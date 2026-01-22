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
        // Update boid thrusters based on input
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
