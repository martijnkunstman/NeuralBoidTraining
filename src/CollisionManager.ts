import { Food } from './Food';
import { Poison } from './Poison';
import { SeededRandom } from './SeededRandom';

export class CollisionManager {
    private foodCollected: number = 0;
    private poisonCollected: number = 0;
    private readonly collisionRadius: number;
    private readonly worldSize: number;
    private rng: SeededRandom;

    constructor(worldSize: number, collisionRadius: number, rng: SeededRandom) {
        this.worldSize = worldSize;
        this.collisionRadius = collisionRadius;
        this.rng = rng;
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
        return new Food(x, y);
    }

    public spawnPoison(): Poison {
        const half = this.worldSize / 2;
        const x = this.rng.randomRange(-half + 50, half - 50);
        const y = this.rng.randomRange(-half + 50, half - 50);
        return new Poison(x, y);
    }

    getFoodCollected(): number {
        return this.foodCollected;
    }

    getPoisonCollected(): number {
        return this.poisonCollected;
    }
}
