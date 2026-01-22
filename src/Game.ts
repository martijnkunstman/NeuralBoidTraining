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
    private boids: Boid[] = [];
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
    private readonly POPULATION_SIZE = 10;

    // Training Vars
    private trainMode: boolean = false;
    private score: number = 0;
    private maxFitness: number = 0;
    private generation: number = 1;
    private bestBrainJSON: any = null;
    private timeAlive: number = 0;
    private readonly MAX_TIME_ALIVE = 3000;

    constructor(RAPIER: typeof import('@dimforge/rapier2d-compat')) {
        const SEED = Date.now();
        this.rng = new SeededRandom(SEED);
        console.log('World Seed:', SEED);

        this.world = new World(RAPIER, this.WORLD_SIZE);
        this.inputManager = new InputManager();
        this.camera = new Camera();
        this.renderer = new Renderer(this.WORLD_SIZE);
        this.hud = new HUD(SEED, this.FOOD_COUNT, this.POISON_COUNT);
        this.collisionManager = new CollisionManager(
            this.WORLD_SIZE,
            this.BOID_COLLISION_RADIUS,
            this.rng
        );

        this.loadBestBrain();

        // Spawn population
        for (let i = 0; i < this.POPULATION_SIZE; i++) {
            const boid = new Boid(RAPIER, this.world.getPhysicsWorld());
            if (this.bestBrainJSON) {
                boid.brain.getNetwork().fromJSON(this.bestBrainJSON);
                if (i > 0) boid.brain.mutate(0.1, 0.1);
            }
            this.boids.push(boid);
        }

        this.initializeItems();

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 't') {
                this.toggleTrainMode();
            }
        });
    }

    private loadBestBrain(): void {
        const saved = localStorage.getItem('bestBrain');
        if (saved) {
            try {
                this.bestBrainJSON = JSON.parse(saved);
                console.log("Loaded best brain from storage");
            } catch (e) {
                console.error("Failed to parse best brain", e);
            }
        }

        const savedGen = localStorage.getItem('generation');
        if (savedGen) this.generation = parseInt(savedGen);

        const savedMaxFit = localStorage.getItem('maxFitness');
        if (savedMaxFit) this.maxFitness = parseFloat(savedMaxFit);
    }

    private saveBestBrain(bestBoid: Boid): void {
        if (bestBoid.brain) {
            this.bestBrainJSON = bestBoid.brain.getNetwork().toJSON();
            localStorage.setItem('bestBrain', JSON.stringify(this.bestBrainJSON));
            localStorage.setItem('generation', this.generation.toString());
            localStorage.setItem('maxFitness', this.maxFitness.toString());
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
        let allDead = true;
        let bestBoid: Boid | null = null;
        let maxScore = -Infinity;

        for (const boid of this.boids) {
            if (!boid.alive) continue;
            allDead = false;

            boid.updateSensors(this.foods, this.poisons, this.WORLD_SIZE);
            boid.think();

            if (this.boids.indexOf(boid) === 0) {
                boid.updateThrusters(
                    this.inputManager.isKeyPressed('q'),
                    this.inputManager.isKeyPressed('a'),
                    this.inputManager.isKeyPressed('w'),
                    this.inputManager.isKeyPressed('s')
                );
            } else {
                // If in training mode, other boids follow their brain. 
                // In manual mode, they stay still or follow brain but we don't apply forces if we want 'pure' manual.
                // However, boid.think() already set the thrusters. 
                // Let's call updateThrusters(false...) which will just apply current thruster values.
                boid.updateThrusters(false, false, false, false);
            }
            this.world.wrapPosition(boid.getBody());

            const pos = boid.getPosition();
            const result = this.collisionManager.checkCollisions(pos.x, pos.y, this.foods, this.poisons);

            if (this.trainMode) {
                boid.score += result.foodCollected * 10;
                boid.score -= result.poisonCollected * 20;
                if (result.poisonCollected > 0) {
                    boid.die();
                }
            }

            if (boid.score > maxScore) {
                maxScore = boid.score;
                bestBoid = boid;
            }
        }

        this.boids.forEach(b => b.isBest = (b === bestBoid));
        if (bestBoid) this.score = bestBoid.score;

        this.world.step();

        if (this.trainMode) {
            this.timeAlive++;
            if (allDead || this.timeAlive > this.MAX_TIME_ALIVE) {
                this.resetGeneration();
            }
        }
    }

    private resetGeneration(): void {
        let winner = this.boids[0];
        let maxScore = -Infinity;
        for (const boid of this.boids) {
            if (boid.score > maxScore) {
                maxScore = boid.score;
                winner = boid;
            }
        }

        console.log(`Generation ${this.generation} ended. Top Score: ${maxScore}`);

        if (maxScore > this.maxFitness) {
            this.maxFitness = maxScore;
            this.saveBestBrain(winner);
            console.log("New record!");
        }

        const winnerJSON = winner.brain.getNetwork().toJSON();
        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            const newBrain = new Brain(18, 10, 2);
            newBrain.getNetwork().fromJSON(winnerJSON);
            if (i > 0) {
                newBrain.mutate(0.1, 0.2);
            }
            boid.reset(newBrain);
        }

        this.foods = [];
        this.poisons = [];
        this.initializeItems();

        this.score = 0;
        this.timeAlive = 0;
        this.generation++;
    }

    private draw(): void {
        this.renderer.clear();
        const bestBoid = this.boids.find(b => b.isBest) || this.boids[0];
        const pos = bestBoid.getPosition();
        this.camera.follow(pos.x, pos.y);

        this.renderer.drawWorld(this.camera, this.foods, this.poisons);

        for (const boid of this.boids) {
            if (boid.alive) {
                this.renderer.drawBoidAtCenter((ctx) => {
                    const bPos = boid.getPosition();
                    const cPos = { x: this.camera.x, y: this.camera.y };
                    ctx.save();
                    ctx.translate(bPos.x - cPos.x, bPos.y - cPos.y);
                    boid.draw(ctx);
                    ctx.restore();
                });
            }
        }

        this.renderer.drawMinimap(pos.x, pos.y, this.foods, this.poisons);

        if (bestBoid.brain) {
            this.renderer.drawBrain(bestBoid.brain);
        }

        this.hud.updateStats(
            bestBoid.getLeftThrusterPercent(),
            bestBoid.getRightThrusterPercent(),
            bestBoid.getVelocity(),
            bestBoid.getAngularVelocity(),
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
