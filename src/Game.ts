import { SeededRandom } from './SeededRandom';
import { World } from './World';
import { Boid } from './Boid';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { HUD } from './HUD';
import { CollisionManager } from './CollisionManager';
import { DebugPanel } from './DebugPanel';
import { NeuralNetwork } from './NeuralNetwork';
import { Food } from './Food';
import { Poison } from './Poison';

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

    // Template environment (shared layout for all boids)
    private templateFoods: Food[] = [];
    private templatePoisons: Poison[] = [];

    // Evolution settings
    private readonly POPULATION_SIZE = 50;
    private readonly GENERATION_DURATION = 45; // Reduced from 120s for faster iteration
    private generationTimer: number = 0;

    private generation: number = 1;
    private totalTime: number = 0;
    private allTimeBestScore: number = 0;

    private readonly WORLD_SIZE = 2000;
    private readonly FOOD_COUNT = 25;
    private readonly POISON_COUNT = 25;
    private readonly BOID_COLLISION_RADIUS = 15;

    constructor(RAPIER: typeof import('@dimforge/rapier2d-compat')) {
        // Initialize random seed system
        const SEED = Math.floor(Date.now() / (1000 * 60 * 60));
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
            () => { this.resetTraining(); },
            (gens) => { this.fastTrain(gens); }
        );

        // Initialize Population
        this.initializePopulation();

        // Try to load saved data
        this.loadTrainingData();
    }



    private generateTemplateEnvironment(): void {
        // Generate spawn queue for synchronized respawns
        this.collisionManager.generateSpawnQueue();

        // Generate template food/poison layout once per generation
        this.templateFoods = [];
        this.templatePoisons = [];
        for (let i = 0; i < this.FOOD_COUNT; i++) {
            this.templateFoods.push(this.collisionManager.spawnFood());
        }
        for (let i = 0; i < this.POISON_COUNT; i++) {
            this.templatePoisons.push(this.collisionManager.spawnPoison());
        }
    }

    private initializePopulation(): void {
        this.boids = [];
        this.generateTemplateEnvironment();
        for (let i = 0; i < this.POPULATION_SIZE; i++) {
            const boid = new Boid(this.RAPIER, this.world.getPhysicsWorld());
            this.resetBoid(boid);
            this.boids.push(boid);
        }
    }

    private resetBoid(boid: Boid): void {
        // All boids start at the same position (center of world)
        boid.getBody().setTranslation({ x: 0, y: 0 }, true);
        boid.getBody().setLinvel({ x: 0, y: 0 }, true);
        boid.getBody().setAngvel(0, true);
        boid.getBody().setRotation(0, true); // All start facing the same direction

        // Reset Environment using template (same layout for all boids)
        boid.initializeEnvironment(this.FOOD_COUNT, this.POISON_COUNT, this.collisionManager, this.templateFoods, this.templatePoisons);
    }

    private update(): void {
        if (this.isPaused) return;

        // Evolution logic
        this.generationTimer += 1 / 60; // Assuming 60fps
        if (this.generationTimer > this.GENERATION_DURATION) {
            this.evolve();
        }

        this.totalTime += 1 / 60;

        // Step physics
        this.world.step();

        // Check for early exit if all dead
        let aliveCount = 0;

        // Update all boids
        for (const boid of this.boids) {
            // Always wrap position so bodies sustain in world
            this.world.wrapPosition(boid.getBody());

            // Always update thrusters (handles dead state freezing internally)
            boid.updateThrusters();

            if (!boid.isDead) {
                aliveCount++;
                boid.updateSensors(this.WORLD_SIZE);
                boid.checkCollisions(this.collisionManager);
            }
        }

        // Check if all dead or time up
        if (this.generationTimer > this.GENERATION_DURATION || aliveCount <= 1) {
            this.evolve();
        }
    }

    private evolve(): void {
        // Sort by score (fitness)
        this.boids.sort((a, b) => b.score - a.score);

        const currentBestScore = this.boids[0].score;
        if (currentBestScore > this.allTimeBestScore) {
            this.allTimeBestScore = currentBestScore;
        }

        console.log(`Generation ${this.generation} complete. Survivors: ${this.boids.filter(b => !b.isDead).length}. Best Score: ${currentBestScore}.`);

        // Generate new template environment for the next generation
        this.generateTemplateEnvironment();

        const eliteCount = Math.floor(this.POPULATION_SIZE * 0.1); // Keep top 10% unchanged
        const selectionPool = Math.floor(this.POPULATION_SIZE * 0.5); // Parents chosen from top 50%

        // 1. Keep Elites (No Mutation)
        for (let i = 0; i < eliteCount; i++) {
            this.resetBoid(this.boids[i]);
        }

        // 2. Fill the rest with mutated children of selection pool
        for (let i = eliteCount; i < this.POPULATION_SIZE; i++) {
            // Pick a random parent from the top 50%
            const parentIndex = Math.floor(this.rng.random() * selectionPool);
            const parent = this.boids[parentIndex];
            const offspring = this.boids[i]; // Rewrite this boid

            offspring.copyBrainFrom(parent);

            // Dynamic Mutation:
            // If parent is elite, mutate less? No, finding new peaks needs exploration.
            // Using standard mutation but slightly more frequent for diversity.
            offspring.brain.mutate(0.2, 0.5); // Rate 20%, Strength 0.5

            this.resetBoid(offspring);
        }

        this.generation++;
        this.generationTimer = 0;

        // Save progress
        this.saveTrainingData();
    }

    private saveTrainingData(): void {
        const brainsData = this.boids.map(b => b.brain.toJSON());
        const data = {
            generation: this.generation,
            totalTime: this.totalTime,
            allTimeBestScore: this.allTimeBestScore,
            brains: brainsData
        };
        localStorage.setItem('boid_training_data', JSON.stringify(data));
        console.log('Training data saved for Gen ' + this.generation);
    }

    private loadTrainingData(): void {
        const json = localStorage.getItem('boid_training_data');
        if (json) {
            this.applyTrainingData(json);
        } else {
            // Fallback: Load from bundled JSON file
            console.log('No localStorage found, loading from localStorage.json...');
            fetch('./localStorage.json')
                .then(response => {
                    if (!response.ok) throw new Error('localStorage.json not found');
                    return response.text();
                })
                .then(jsonText => {
                    this.applyTrainingData(jsonText);
                    console.log('Loaded pre-trained brains from localStorage.json');
                })
                .catch(e => {
                    console.log('No pre-trained data found, starting fresh.', e);
                });
        }
    }

    private applyTrainingData(json: string): void {
        try {
            const data = JSON.parse(json);
            this.generation = data.generation;
            this.totalTime = data.totalTime || 0;
            this.allTimeBestScore = data.allTimeBestScore || 0;

            console.log('Loaded training data. Gen: ' + this.generation);

            if (data.brains && Array.isArray(data.brains)) {
                // Load full population
                // Check architecture compatibility first using first brain
                if (data.brains.length > 0 &&
                    (data.brains[0].inputNodes !== this.boids[0].brain.inputNodes ||
                        data.brains[0].outputNodes !== this.boids[0].brain.outputNodes)) {
                    console.warn('Loaded population architecture mismatch. Resetting...');
                    this.resetTraining();
                    return;
                }

                for (let i = 0; i < this.POPULATION_SIZE; i++) {
                    if (data.brains[i]) {
                        this.boids[i].brain = NeuralNetwork.fromJSON(data.brains[i]);
                    } else {
                        // If population increased, fill remainder with mutations of best (or random if no brains)
                        // Fallback: Copy from index 0 if available, else random
                        if (i > 0) {
                            this.boids[i].brain = this.boids[0].brain.copy();
                            this.boids[i].brain.mutate(0.1, 0.2);
                        }
                    }
                }
            } else if (data.bestBrain) {
                // Legacy support for single best brain save
                // Check compatibility
                if (data.bestBrain && (data.bestBrain.inputNodes !== this.boids[0].brain.inputNodes ||
                    data.bestBrain.outputNodes !== this.boids[0].brain.outputNodes)) {
                    console.warn('Loaded brain architecture mismatch. Resetting...');
                    this.resetTraining();
                    return;
                }

                const loadedBrain = NeuralNetwork.fromJSON(data.bestBrain);
                this.boids[0].brain = loadedBrain.copy();
                for (let i = 1; i < this.POPULATION_SIZE; i++) {
                    this.boids[i].brain = loadedBrain.copy();
                    this.boids[i].brain.mutate(0.1, 0.2);
                }
            }

        } catch (e) {
            console.error('Failed to load training data', e);
        }
    }

    private resetTraining(): void {
        localStorage.removeItem('boid_training_data');
        this.generation = 1;
        this.generationTimer = 0;
        this.totalTime = 0; // added reset
        this.allTimeBestScore = 0; // added reset
        this.initializePopulation(); // Re-creates random brains
        console.log('Training reset.');
    }

    private fastTrain(generations: number): void {
        const stepsPerGen = this.GENERATION_DURATION * 60;
        const totalSteps = generations * stepsPerGen;

        console.log(`Starting fast training for ${generations} generations (${totalSteps} steps)...`);

        const startTime = performance.now();

        // We simulate "generations" by running until we hit the generation count target
        // But since evolution is triggered dynamically (by time OR death), 
        // we can't just run N * steps. We have to run `update` repeatedly.
        // We can track the current generation and stop when we've advanced N times.

        const targetGeneration = this.generation + generations;

        // Safety Break: Don't run forever. 
        // Max steps roughly estimated + buffer. 
        // Logic: if all die early, generation advances faster. 
        // So simple loop while this.generation < targetGeneration is best.

        // Protect against infinite loops if logic breaks? 
        let steps = 0;
        const MAX_STEPS = totalSteps * 2; // Buffer for safety

        while (this.generation < targetGeneration && steps < MAX_STEPS) {
            this.update(); // Simulate one tick
            steps++;
        }

        const duration = performance.now() - startTime;
        console.log(`Fast training complete. Advanced to Gen ${this.generation}. Took ${duration.toFixed(0)}ms.`);

        // Refresh visuals
        this.draw();
    }

    // Track last focused boid to detect switches vs wraps
    private lastBestBoid: Boid | null = null;

    private draw(): void {
        // Clear canvas
        this.renderer.clear();

        // Update camera to follow boid
        // Find best boid (highest score) for camera and viz
        let bestBoid = this.boids[0];
        let maxScore = -Infinity;
        if (this.boids.length > 0) {
            for (const b of this.boids) {
                if (b.score > maxScore) {
                    maxScore = b.score;
                    bestBoid = b;
                }
            }
        }

        // Update camera
        const pos = bestBoid.getPosition();

        if (this.lastBestBoid === bestBoid) {
            // Same boid, check for large jump indicating world wrap
            // Camera position is the "last known position", so check distance to new position
            const dist = Math.sqrt(Math.pow(pos.x - this.camera.x, 2) + Math.pow(pos.y - this.camera.y, 2));

            // If distance is large (e.g. > world/3), assume wrap and snap instantly
            if (dist > this.WORLD_SIZE / 3) {
                this.camera.snap(pos.x, pos.y);
            } else {
                this.camera.follow(pos.x, pos.y);
            }
        } else {
            // Switched to a different boid - use smooth transition
            this.camera.follow(pos.x, pos.y);
            this.lastBestBoid = bestBoid;
        }

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
        const aliveBoids = this.boids.filter(b => !b.isDead).length;
        this.debugPanel.update(
            this.generation,
            aliveBoids,
            bestBoid.score,
            this.allTimeBestScore,
            this.generationTimer,
            this.totalTime
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
