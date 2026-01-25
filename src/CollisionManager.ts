import { Food } from './Food';
import { Poison } from './Poison';
import { SeededRandom } from './SeededRandom';

interface SpawnPosition {
    x: number;
    y: number;
}

export class CollisionManager {
    private foodCollected: number = 0;
    private poisonCollected: number = 0;
    private readonly collisionRadius: number;
    private readonly worldSize: number;
    private rng: SeededRandom;

    // Pre-generated spawn queues for synchronized respawns
    private foodSpawnQueue: SpawnPosition[] = [];
    private poisonSpawnQueue: SpawnPosition[] = [];
    private readonly QUEUE_SIZE = 500; // Enough spawns for a generation

    constructor(worldSize: number, collisionRadius: number, rng: SeededRandom) {
        this.worldSize = worldSize;
        this.collisionRadius = collisionRadius;
        this.rng = rng;
    }

    // Generate spawn queues at the start of each generation
    public generateSpawnQueue(): void {
        this.foodSpawnQueue = [];
        this.poisonSpawnQueue = [];
        const half = this.worldSize / 2;

        for (let i = 0; i < this.QUEUE_SIZE; i++) {
            this.foodSpawnQueue.push({
                x: this.rng.randomRange(-half + 50, half - 50),
                y: this.rng.randomRange(-half + 50, half - 50)
            });
            // Poison is now persistent, no need for spawn queue. 
            // If we needed it, we'd ensure safe distance, but we only spawn initially now.
        }
    }

    checkCollisions(
        boidX: number,
        boidY: number,
        foods: Food[],
        poisons: Poison[]
    ): void {
        // Check food collisions
        for (let i = foods.length - 1; i >= 0; i--) {
            if (foods[i].isColliding(boidX, boidY, this.collisionRadius)) {
                foods.splice(i, 1);
                foods.push(this.spawnFood());
                this.foodCollected++;
            }
        }

        // Check poison collisions
        for (let i = poisons.length - 1; i >= 0; i--) {
            if (poisons[i].isColliding(boidX, boidY, this.collisionRadius)) {
                poisons.splice(i, 1);
                poisons.push(this.spawnPoison());
                this.poisonCollected++;
            }
        }
    }

    public spawnFood(): Food {
        const half = this.worldSize / 2;
        const x = this.rng.randomRange(-half + 50, half - 50);
        const y = this.rng.randomRange(-half + 50, half - 50);
        return new Food(x, y, 30);
    }

    public spawnPoison(): Poison {
        const half = this.worldSize / 2;
        const safeRadius = 250; // Safe zone around center where boids start
        let x, y, dist;

        do {
            x = this.rng.randomRange(-half + 50, half - 50);
            y = this.rng.randomRange(-half + 50, half - 50);
            dist = Math.sqrt(x * x + y * y);
        } while (dist < safeRadius);

        return new Poison(x, y, 30);
    }

    // Spawn food using pre-generated queue position
    public spawnFoodFromQueue(index: number): Food {
        const pos = this.foodSpawnQueue[index % this.QUEUE_SIZE];
        return new Food(pos.x, pos.y, 30);
    }

    // Spawn poison using pre-generated queue position
    public spawnPoisonFromQueue(index: number): Poison {
        const pos = this.poisonSpawnQueue[index % this.QUEUE_SIZE];
        return new Poison(pos.x, pos.y, 30);
    }

    getFoodCollected(): number {
        return this.foodCollected;
    }

    getPoisonCollected(): number {
        return this.poisonCollected;
    }
}
