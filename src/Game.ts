import { SeededRandom } from './SeededRandom';
import { World } from './World';
import { Boid } from './Boid';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { StatsPanel } from './StatsPanel';
import { CollisionManager } from './CollisionManager';
import { DebugPanel } from './DebugPanel';
import { MinimapPanel } from './MinimapPanel';
import { BrainPanel } from './BrainPanel';
import { NeuralNetwork } from './NeuralNetwork';
import { Food } from './Food';
import { InputManager } from './InputManager';
import { Poison } from './Poison';

export class Game {
    private world: World;
    private boids: Boid[] = [];
    private camera: Camera;
    private renderer: Renderer;
    private statsPanel: StatsPanel;
    private minimapPanel: MinimapPanel;
    private brainPanel: BrainPanel;
    private collisionManager: CollisionManager;
    private rng: SeededRandom;
    private debugPanel: DebugPanel;
    private isPaused: boolean = false;
    private RAPIER: typeof import('@dimforge/rapier2d-compat');
    private inputManager: InputManager;

    // Template environment (shared layout for all boids)
    private templateFoods: Food[] = [];
    private templatePoisons: Poison[] = [];

    // Evolution settings
    private readonly POPULATION_SIZE = 100; // Increased from 50 (Performance optimization allows more)
    private readonly GENERATION_DURATION = 45; // Reduced from 120s for faster iteration
    private generationTimer: number = 0;

    private generation: number = 1;
    private totalTime: number = 0;
    private allTimeBestScore: number = 0;

    private readonly WORLD_SIZE = 3000;
    private readonly FOOD_COUNT = 50;
    private readonly POISON_COUNT = 50;
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

        // Initialize UI Panels
        this.statsPanel = new StatsPanel(SEED, this.FOOD_COUNT, this.POISON_COUNT);
        this.minimapPanel = new MinimapPanel(this.WORLD_SIZE);
        this.brainPanel = new BrainPanel();

        this.inputManager = new InputManager(); // Initialize InputManager
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



    private resetEnvironment(): void {
        // Generate spawn queue for synchronized respawns (only food now)
        this.collisionManager.generateSpawnQueue();

        // Generate shared global environment
        this.templateFoods = [];
        this.templatePoisons = [];
        for (let i = 0; i < this.FOOD_COUNT; i++) {
            this.templateFoods.push(this.collisionManager.spawnFood());
        }
        for (let i = 0; i < this.POISON_COUNT; i++) {
            this.templatePoisons.push(this.collisionManager.spawnPoison());
        }

        // Rebuild spatial grid with new environment
        this.collisionManager.rebuildGrids(this.templateFoods, this.templatePoisons);
    }

    private initializePopulation(): void {
        this.boids = [];
        this.resetEnvironment();
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

        // Reset Environment using shared global state
        boid.initializeEnvironment(this.templateFoods, this.templatePoisons);
    }

    private getBestBoid(): Boid {
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
        return bestBoid;
    }

    private update(): void {
        if (this.isPaused) {
            // Manual Override Mode
            const focusedBoid = this.getBestBoid();

            // Handle Manual Input for Focused Boid
            let leftThrust = 0;
            let rightThrust = 0;
            const THRUSTER_MAX = 1600.0; // Hardcoded matches Boid.ts, could be public static

            if (this.inputManager.isKeyPressed('arrowup')) {
                leftThrust = THRUSTER_MAX;
                rightThrust = THRUSTER_MAX;
            }
            if (this.inputManager.isKeyPressed('arrowleft')) {
                rightThrust = THRUSTER_MAX;
            }
            if (this.inputManager.isKeyPressed('arrowright')) {
                leftThrust = THRUSTER_MAX;
            }

            // Apply control to focused boid
            // Freeze others
            for (const boid of this.boids) {
                this.world.wrapPosition(boid.getBody());

                if (boid === focusedBoid) {
                    boid.setThrustersManual(leftThrust, rightThrust);
                    boid.applyThrusterForces();
                    // Still need to update sensors/collisions to eat food?
                    // Let's allow eating food in manual mode for fun, but maybe not score recording?
                    // For now, let's just do minimal physics step.
                    // Actually, if we want to "steer", we need physics step.
                } else {
                    // Freeze
                    boid.getBody().setLinvel({ x: 0, y: 0 }, true);
                    boid.getBody().setAngvel(0, true);
                }
            }

            // Step physics
            this.world.step();
            return;
        }

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
                boid.updateSensors(this.WORLD_SIZE, this.collisionManager);
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

        // Reset environment for the next generation
        this.resetEnvironment();

        const eliteCount = Math.floor(this.POPULATION_SIZE * 0.1); // Keep top 10% unchanged
        const selectionPool = Math.floor(this.POPULATION_SIZE * 0.5); // Parents chosen from top 50%

        // 1. Keep Elites (No Mutation)
        for (let i = 0; i < eliteCount; i++) {
            this.resetBoid(this.boids[i]);
        }

        // 2. Fill the rest with mutated children of selection pool (using Crossover)
        for (let i = eliteCount; i < this.POPULATION_SIZE; i++) {
            // Pick two random parents from the top 50%
            const parentIndexA = Math.floor(this.rng.random() * selectionPool);
            const parentIndexB = Math.floor(this.rng.random() * selectionPool);

            const parentA = this.boids[parentIndexA];
            const parentB = this.boids[parentIndexB];

            const offspring = this.boids[i]; // Rewrite this boid

            // Crossover
            offspring.brain = parentA.brain.crossover(parentB.brain);

            // Mutation: slightly reduced rate since crossover provides diversity
            offspring.brain.mutate(0.05, 0.1);

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

    private async loadTrainingData(): Promise<void> {
        console.log('Checking for training data...');

        let fileData: any = null;
        let browserData: any = null;

        // 1. Try to fetch file
        try {
            const response = await fetch('./localStorage.json');
            if (response.ok) {
                const text = await response.text();
                fileData = JSON.parse(text);
            }
        } catch (e) {
            console.log('No valid localStorage.json file found.');
        }

        // 2. Try to get browser storage
        try {
            const json = localStorage.getItem('boid_training_data');
            if (json) {
                browserData = JSON.parse(json);
            }
        } catch (e) {
            console.log('Error reading browser localStorage.');
        }

        // 3. Compare and Load
        const fileGen = fileData?.generation || -1;
        const browserGen = browserData?.generation || -1;

        console.log(`Found Data - File Gen: ${fileGen}, Browser Gen: ${browserGen}`);

        if (fileGen === -1 && browserGen === -1) {
            console.log('No training data found. Starting fresh.');
            return;
        }

        if (fileGen >= browserGen) {
            console.log(`Loading from localStorage.json (Gen ${fileGen})`);
            this.applyData(fileData);
        } else {
            console.log(`Loading from browser localStorage (Gen ${browserGen})`);
            this.applyData(browserData);
        }
    }

    // Helper to apply parsed data object
    private applyData(data: any): void {
        this.generation = data.generation;
        this.totalTime = data.totalTime || 0;
        this.allTimeBestScore = data.allTimeBestScore || 0;

        console.log('Applying training data. Gen: ' + this.generation);

        if (data.brains && Array.isArray(data.brains)) {
            if (data.brains.length > 0 &&
                (data.brains[0].inputNodes !== this.boids[0].brain.inputNodes ||
                    data.brains[0].outputNodes !== this.boids[0].brain.outputNodes)) {
                console.warn('Architecture mismatch. Resetting...');
                this.resetTraining();
                return;
            }

            for (let i = 0; i < this.POPULATION_SIZE; i++) {
                if (data.brains[i]) {
                    this.boids[i].brain = NeuralNetwork.fromJSON(data.brains[i]);
                } else {
                    if (i > 0) {
                        this.boids[i].brain = this.boids[0].brain.copy();
                        this.boids[i].brain.mutate(0.05, 0.1);
                    }
                }
            }
        } else if (data.bestBrain) {
            if (data.bestBrain && (data.bestBrain.inputNodes !== this.boids[0].brain.inputNodes ||
                data.bestBrain.outputNodes !== this.boids[0].brain.outputNodes)) {
                console.warn('Architecture mismatch. Resetting...');
                this.resetTraining();
                return;
            }

            const loadedBrain = NeuralNetwork.fromJSON(data.bestBrain);
            this.boids[0].brain = loadedBrain.copy();
            for (let i = 1; i < this.POPULATION_SIZE; i++) {
                this.boids[i].brain = loadedBrain.copy();
                this.boids[i].brain.mutate(0.05, 0.1);
            }
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
        let bestBoid = this.getBestBoid();

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
        this.renderer.drawWorld(this.camera, bestBoid.foods, bestBoid.poisons, bestBoid.eatenFoodHistory); // Draw best boid's view of world
        this.renderer.drawBoids(this.boids, this.camera, bestBoid);

        // Update dedicated UI panels
        this.minimapPanel.draw(pos.x, pos.y, bestBoid.foods, bestBoid.poisons, bestBoid.eatenFoodHistory);
        this.brainPanel.draw(bestBoid.brain);

        // Update HUD (StatsPanel)
        this.statsPanel.updateStats(
            bestBoid.getLeftThrusterPercent(),
            bestBoid.getRightThrusterPercent(),
            bestBoid.getVelocity(),
            bestBoid.getAngularVelocity(),
            this.generation, // Mapping to legacy slot
            Math.floor(this.GENERATION_DURATION - this.generationTimer), // Mapping to legacy slot
            Math.floor(bestBoid.score), // Mapping to legacy slot
            0 // Unused
        );

        // Update Debug Panel with Neuroevolution Stats
        const aliveBoids = this.boids.filter(b => !b.isDead).length;
        this.debugPanel.update(
            this.generation,
            aliveBoids,
            bestBoid.score,
            this.allTimeBestScore,
            Math.max(0, this.GENERATION_DURATION - this.generationTimer),
            this.totalTime
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
