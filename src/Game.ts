import { SeededRandom } from './SeededRandom';
import { World } from './World';
import { Boid } from './Boid';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { HUD } from './HUD';
import { CollisionManager } from './CollisionManager';
import { DebugPanel } from './DebugPanel';
import { NeuralNetwork } from './NeuralNetwork';

export class Game {
    private world: World;
    private boids: Boid[] = [];
    private camera: Camera;
    private renderer: Renderer;
    private hud: HUD;
    private collisionManager: CollisionManager;
    private rng: SeededRandom;
    private debugPanel: DebugPanel;
    private isPaused: boolean = false;
    private RAPIER: typeof import('@dimforge/rapier2d-compat');

    // Evolution settings
    private readonly POPULATION_SIZE = 50;
    private readonly GENERATION_DURATION = 15; // Seconds
    private generationTimer: number = 0;
    private generation: number = 1;

    private readonly WORLD_SIZE = 2000;
    private readonly FOOD_COUNT = 50;
    private readonly POISON_COUNT = 25;
    private readonly BOID_COLLISION_RADIUS = 15;

    constructor(RAPIER: typeof import('@dimforge/rapier2d-compat')) {
        // Initialize random seed system
        const SEED = Date.now();
        this.rng = new SeededRandom(SEED);
        console.log('World Seed:', SEED);

        this.RAPIER = RAPIER;

        // Initialize subsystems
        this.world = new World(RAPIER, this.WORLD_SIZE);
        this.camera = new Camera();
        this.renderer = new Renderer(this.WORLD_SIZE);
        this.hud = new HUD(SEED, this.FOOD_COUNT, this.POISON_COUNT);
        this.collisionManager = new CollisionManager(
            this.WORLD_SIZE,
            this.BOID_COLLISION_RADIUS,
            this.rng
        );

        this.debugPanel = new DebugPanel(
            () => { this.isPaused = !this.isPaused; },
            () => { this.resetTraining(); }
        );

        // Initialize Population
        this.initializePopulation();

        // Try to load saved data
        this.loadTrainingData();
    }



    private initializePopulation(): void {
        this.boids = [];
        for (let i = 0; i < this.POPULATION_SIZE; i++) {
            const boid = new Boid(this.RAPIER, this.world.getPhysicsWorld());
            this.resetBoid(boid);
            this.boids.push(boid);
        }
    }

    private resetBoid(boid: Boid): void {
        // Random position
        const half = this.WORLD_SIZE / 2;
        const x = this.rng.randomRange(-half, half);
        const y = this.rng.randomRange(-half, half);

        boid.getBody().setTranslation({ x, y }, true);
        boid.getBody().setLinvel({ x: 0, y: 0 }, true);
        boid.getBody().setAngvel(0, true);
        boid.getBody().setRotation(Math.random() * Math.PI * 2, true);

        // Reset Environment
        boid.initializeEnvironment(this.FOOD_COUNT, this.POISON_COUNT, this.collisionManager);
    }

    private update(): void {
        if (this.isPaused) return;

        // Evolution logic
        this.generationTimer += 1 / 60; // Assuming 60fps
        if (this.generationTimer > this.GENERATION_DURATION) {
            this.evolve();
        }

        // Step physics
        this.world.step();

        // Update all boids
        for (const boid of this.boids) {
            boid.updateThrusters();
            boid.updateSensors(this.WORLD_SIZE);
            this.world.wrapPosition(boid.getBody());
            boid.checkCollisions(this.collisionManager);
        }
    }

    private evolve(): void {
        // Sort by score (fitness)
        this.boids.sort((a, b) => b.score - a.score);

        console.log(`Generation ${this.generation} complete. Best Score: ${this.boids[0].score}`);

        const half = Math.floor(this.POPULATION_SIZE / 2);

        // 1. Keep Top 50% (Survivors) - Just reset them
        for (let i = 0; i < half; i++) {
            this.resetBoid(this.boids[i]);
        }

        // 2. Replace Bottom 50% with mutated clones of Top 50%
        for (let i = half; i < this.POPULATION_SIZE; i++) {
            const parentIndex = i - half; // Map bottom half to top half 1:1
            const parent = this.boids[parentIndex];
            const offspring = this.boids[i];

            // Copy brain from parent
            offspring.copyBrainFrom(parent);
            // Mutate
            offspring.brain.mutate(0.1, 0.2); // 10% rate, 0.2 strength

            // Reset state
            this.resetBoid(offspring);
        }

        this.generation++;
        this.generationTimer = 0;

        // Save progress
        this.saveTrainingData();
    }

    private saveTrainingData(): void {
        // Assume boids are sorted by score (called inside evolve after sort)
        const bestBrain = this.boids[0].brain;
        const data = {
            generation: this.generation,
            bestBrain: bestBrain.toJSON()
        };
        localStorage.setItem('boid_training_data', JSON.stringify(data));
        console.log('Training data saved for Gen ' + this.generation);
    }

    private loadTrainingData(): void {
        const json = localStorage.getItem('boid_training_data');
        if (json) {
            try {
                const data = JSON.parse(json);
                this.generation = data.generation;
                const loadedBrain = NeuralNetwork.fromJSON(data.bestBrain);

                console.log('Loaded training data. Gen: ' + this.generation);

                // Apply to population
                // Strategy: Keep 1 exact copy, mutate rest
                this.boids[0].brain = loadedBrain.copy();

                for (let i = 1; i < this.POPULATION_SIZE; i++) {
                    this.boids[i].brain = loadedBrain.copy();
                    this.boids[i].brain.mutate(0.1, 0.2);
                }
            } catch (e) {
                console.error('Failed to load training data', e);
            }
        }
    }

    private resetTraining(): void {
        localStorage.removeItem('boid_training_data');
        this.generation = 1;
        this.generationTimer = 0;
        this.initializePopulation(); // Re-creates random brains
        console.log('Training reset.');
    }

    private draw(): void {
        // Clear canvas
        this.renderer.clear();

        // Update camera to follow boid
        // Find best boid (highest score) for camera and viz
        // Since we only sort at end of gen, we search linear
        let bestBoid = this.boids[0];
        let maxScore = -Infinity;
        for (const b of this.boids) {
            if (b.score > maxScore) {
                maxScore = b.score;
                bestBoid = b;
            }
        }

        // Update camera to follow best boid
        const pos = bestBoid.getPosition();
        this.camera.follow(pos.x, pos.y);

        // Draw everything
        this.renderer.drawWorld(this.camera, bestBoid.foods, bestBoid.poisons); // Draw best boid's view of world
        this.renderer.drawBoids(this.boids, this.camera, bestBoid);
        this.renderer.drawMinimap(pos.x, pos.y, bestBoid.foods, bestBoid.poisons);

        // Draw Brain of best boid
        const brainWidth = 200;
        const brainHeight = 300;
        const margin = 20;
        this.renderer.drawBrain(bestBoid.brain, margin, window.innerHeight - brainHeight - margin, brainWidth, brainHeight);

        // Update HUD
        this.hud.updateStats(
            bestBoid.getLeftThrusterPercent(),
            bestBoid.getRightThrusterPercent(),
            bestBoid.getVelocity(),
            bestBoid.getAngularVelocity(),
            bestBoid.foods.length,
            bestBoid.poisons.length,
            0, // Global stats removed, using score instead
            Math.floor(bestBoid.score)
        );

        // Update Debug Panel with Neuroevolution Stats
        this.debugPanel.update(
            this.generation,
            this.boids.length, // Currently all 50 are alive/present
            bestBoid.score,
            this.generationTimer
        );

        // Draw Generation Info on Canvas (Quick hack or add to Renderer?)
        // Let's add it via previous HUD or Debug or just overlay
        // I'll rely on HUD changes or just log it. 
        // Better: Add text draw to renderer? 
        // I'll skip explicit text draw for now, standard HUD has some fields I can repurpose or I can edit HUD later.
        // For now, I passed `Math.floor(bestBoid.score)` as "Poison Collected" (last arg of HUD updateStats).
        // Wait, HUD updateStats signature: 
        // (lThrust, rThrust, vel, angVel, foodCount, poisonCount, foodCol, poisonCol)
        // I can treat "Food Collected" as Gen and "Poison Collected" as Time?
        // Let's repurpose:
        // Food Collected -> Generation
        // Poison Collected -> Timer
        this.hud.updateStats(
            bestBoid.getLeftThrusterPercent(),
            bestBoid.getRightThrusterPercent(),
            bestBoid.getVelocity(),
            bestBoid.getAngularVelocity(),
            this.generation, // Was Food Count
            Math.floor(this.GENERATION_DURATION - this.generationTimer), // Was Poison Count
            Math.floor(bestBoid.score), // Was Food Coll
            0 // Was Poison Coll
        );
    }

    private loop = (): void => {
        this.update();
        this.draw();
        requestAnimationFrame(this.loop);
    }

    start(): void {
        console.log('Starting game loop...');
        this.loop();
    }
}
