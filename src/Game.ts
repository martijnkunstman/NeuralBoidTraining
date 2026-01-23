import { SeededRandom } from './SeededRandom';
import { Food } from './Food';
import { Poison } from './Poison';
import { World } from './World';
import { Boid } from './Boid';
import { InputManager } from './InputManager';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { HUD } from './HUD';
import { CollisionManager } from './CollisionManager';
import { DebugPanel } from './DebugPanel';

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
    private debugPanel: DebugPanel;
    private isPaused: boolean = false;

    private readonly WORLD_SIZE = 2000;
    private readonly FOOD_COUNT = 50;
    private readonly POISON_COUNT = 25;
    private readonly BOID_COLLISION_RADIUS = 15;

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

        this.debugPanel = new DebugPanel(() => {
            this.isPaused = !this.isPaused;
        });

        // Initialize food and poison
        this.initializeItems();
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
        if (this.isPaused) return;

        // Update boid thrusters based on input
        this.boid.updateThrusters();

        // Update boid sensors
        this.boid.updateSensors(this.foods, this.poisons, this.WORLD_SIZE);

        // Step physics
        this.world.step();

        // Wrap world
        this.world.wrapPosition(this.boid.getBody());

        // Check collisions
        const pos = this.boid.getPosition();
        this.collisionManager.checkCollisions(pos.x, pos.y, this.foods, this.poisons);
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
        const brainWidth = 200;
        const brainHeight = 300;
        const margin = 20;
        // Position at bottom left
        this.renderer.drawBrain(this.boid.brain, margin, window.innerHeight - brainHeight - margin, brainWidth, brainHeight);

        // Update HUD
        this.hud.updateStats(
            this.boid.getLeftThrusterPercent(),
            this.boid.getRightThrusterPercent(),
            this.boid.getVelocity(),
            this.boid.getAngularVelocity(),
            this.foods.length,
            this.poisons.length,
            this.collisionManager.getFoodCollected(),
            this.collisionManager.getPoisonCollected()
        );

        // Update Debug Panel
        this.debugPanel.update(
            this.boid.getSensors(),
            this.boid.lastInputs,
            this.boid.brain.lastHidden,
            this.boid.brain.lastOutput
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
