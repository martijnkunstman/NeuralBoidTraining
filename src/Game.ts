import { SeededRandom } from './SeededRandom';
import { Food } from './Food';
import { Poison } from './Poison';
import { Brain } from './Brain';
import { World } from './World';
import { Boid } from './Boid';
import { InputManager } from './InputManager';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { HUD } from './HUD';
import { CollisionManager } from './CollisionManager';

export class Game {
    private world: World;
    private boid: Boid;
    private inputManager: InputManager;
    private camera: Camera;
    private renderer: Renderer;
    private hud: HUD;
    private collisionManager: CollisionManager;
    private foods: Food[] = [];
    private poisons: Poison[] = [];
    private rng: SeededRandom;

    private readonly WORLD_SIZE = 2000;
    private readonly FOOD_COUNT = 40;
    private readonly POISON_COUNT = 15;
    private readonly BOID_COLLISION_RADIUS = 15;

    // Training Vars
    private trainMode: boolean = false;
    private score: number = 0;
    private maxFitness: number = 0;
    private generation: number = 1;
    private bestBrainJSON: any = null;
    private timeAlive: number = 0;
    private readonly MAX_TIME_ALIVE = 3000; // Reset if taking too long without progress? Or just keep going.
    // Actually, we want to reset if they die. 
    // Let's add stats to HUD too.

    constructor(RAPIER: typeof import('@dimforge/rapier2d-compat')) {
        // Initialize random seed system
        const SEED = Date.now();
        this.rng = new SeededRandom(SEED);
        console.log('World Seed:', SEED);

        // Initialize subsystems
        this.world = new World(RAPIER, this.WORLD_SIZE);
        this.boid = new Boid(RAPIER, this.world.getPhysicsWorld());
        this.inputManager = new InputManager();
        this.camera = new Camera();
        this.renderer = new Renderer(this.WORLD_SIZE);
        this.hud = new HUD(SEED, this.FOOD_COUNT, this.POISON_COUNT);
        this.collisionManager = new CollisionManager(
            this.WORLD_SIZE,
            this.BOID_COLLISION_RADIUS,
            this.rng
        );

        // Initialize food and poison
        this.initializeItems();

        this.loadBestBrain();

        // Auto-start training?
        // this.toggleTrainMode();

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 't') {
                this.toggleTrainMode();
            }
        });
    }

    private loadBestBrain(): void {
        const saved = localStorage.getItem('bestBrain');
        if (saved) {
            this.bestBrainJSON = JSON.parse(saved);
            console.log("Loaded best brain from storage");
            if (this.boid.brain) {
                this.boid.brain.getNetwork().fromJSON(this.bestBrainJSON);
            }
        }
    }

    private saveBestBrain(): void {
        if (this.boid.brain) {
            this.bestBrainJSON = this.boid.brain.getNetwork().toJSON();
            localStorage.setItem('bestBrain', JSON.stringify(this.bestBrainJSON));
        }
    }

    toggleTrainMode(): void {
        this.trainMode = !this.trainMode;
        console.log("Train Mode:", this.trainMode);
    }

    private initializeItems(): void {
        for (let i = 0; i < this.FOOD_COUNT; i++) {
            this.foods.push(this.collisionManager.spawnFood());
        }
        for (let i = 0; i < this.POISON_COUNT; i++) {
            this.poisons.push(this.collisionManager.spawnPoison());
        }
    }

    private update(): void {
        if (this.trainMode) {
            this.boid.think();
        }

        // Update boid thrusters based on input (Manual override still works if keys pressed)
        this.boid.updateThrusters(
            this.inputManager.isKeyPressed('q'),
            this.inputManager.isKeyPressed('a'),
            this.inputManager.isKeyPressed('w'),
            this.inputManager.isKeyPressed('s')
        );

        // Update boid sensors
        this.boid.updateSensors(this.foods, this.poisons, this.WORLD_SIZE);

        // Step physics
        this.world.step();

        // Wrap world
        this.world.wrapPosition(this.boid.getBody());

        // Check collisions
        const pos = this.boid.getPosition();
        const result = this.collisionManager.checkCollisions(pos.x, pos.y, this.foods, this.poisons);

        // Update Score/Fitness
        if (this.trainMode) {
            this.timeAlive++;
            // Reward for collecting food
            if (result.foodCollected > 0) {
                this.score += 10 * result.foodCollected;
                this.timeAlive = 0; // Reset timeout on progress? Or just accumulate score.
                // Maybe heal boid?
            }
            // Penalty for poison
            if (result.poisonCollected > 0) {
                this.score -= 20 * result.poisonCollected;
                // Die?
                this.resetGeneration();
                return;
            }

            // Timeout to prevent spinning in circles
            if (this.timeAlive > this.MAX_TIME_ALIVE) { // ~50 seconds at 60fps
                // If score is low, kill.
                // If score is high, maybe just reset to avoid infinite life?
                this.resetGeneration();
                return;
            }
        }
    }

    private resetGeneration(): void {
        // Evaluate Fitness
        // Simple fitness: Score + TimeAlive/100?
        // Or just Score.
        console.log(`Generation ${this.generation} ended. Score: ${this.score}`);

        if (this.score > this.maxFitness) {
            this.maxFitness = this.score;
            this.saveBestBrain();
            console.log("New record!");
        }

        // Create new brain
        // If we have a best brain, mutate it.
        // If not, random (already done by constructor, or we should re-randomize if very bad?)

        let newBrain: Brain;
        if (this.bestBrainJSON) {
            newBrain = new Brain(0, 0, 0); // Sizes ignored if fromJSON
            // Wiat, constructor needs sizes.
            // Boid uses: Input 18, Hidden 10, Output 2
            // 9 sensors * 2 inputs = 18.
            newBrain = new Brain(18, 10, 2);
            newBrain.getNetwork().fromJSON(this.bestBrainJSON);
            // Mutate
            newBrain.mutate(0.1, 0.1); // Rate, Amount
        } else {
            newBrain = new Brain(18, 10, 2);
        }

        // Respawn Boid
        // We need to re-create Boid or reset it.
        // Rapier bodies are hard to reset fully without recreation sometimes, but we can just set translation.
        // But we want to inject the new brain.
        // The boid class has the brain. We can just set it.
        this.boid.brain = newBrain;

        // Reset Physics
        this.boid.getBody().setTranslation({ x: 0, y: 0 }, true);
        this.boid.getBody().setLinvel({ x: 0, y: 0 }, true);
        this.boid.getBody().setAngvel(0, true);
        this.boid.getBody().setRotation(0, true);

        // Reset Items
        this.foods = [];
        this.poisons = [];
        this.initializeItems(); // Re-randomize items

        // Reset Vars
        this.score = 0;
        this.timeAlive = 0;
        this.generation++;
    }

    private draw(): void {
        // Clear canvas
        this.renderer.clear();

        // Update camera to follow boid
        const pos = this.boid.getPosition();
        this.camera.follow(pos.x, pos.y);

        // Draw world (grid, borders, food, poison)
        this.renderer.drawWorld(this.camera, this.foods, this.poisons);

        // Draw boid at center
        this.renderer.drawBoidAtCenter((ctx) => this.boid.draw(ctx));

        // Draw minimap
        this.renderer.drawMinimap(pos.x, pos.y, this.foods, this.poisons);

        // Draw Brain
        // We need to pass the brain to the renderer
        if (this.boid.brain) {
            this.renderer.drawBrain(this.boid.brain);
        }

        // Update HUD
        this.hud.updateStats(
            this.boid.getLeftThrusterPercent(),
            this.boid.getRightThrusterPercent(),
            this.boid.getVelocity(),
            this.boid.getAngularVelocity(),
            this.foods.length,
            this.poisons.length,
            this.collisionManager.getFoodCollected(),
            this.collisionManager.getPoisonCollected(),
            this.trainMode,
            this.generation,
            this.maxFitness,
            this.score
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
