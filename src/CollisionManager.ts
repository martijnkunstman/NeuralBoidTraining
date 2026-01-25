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
    private readonly worldSize: number;
    private rng: SeededRandom;
    // Removed unused collisionRadius

    // Spatial Grid
    private foodGrid: Map<string, Food[]> = new Map();
    private poisonGrid: Map<string, Poison[]> = new Map();
    private readonly GRID_CELL_SIZE = 300;

    // Pre-generated spawn queues for synchronized respawns
    private foodSpawnQueue: SpawnPosition[] = [];
    private poisonSpawnQueue: SpawnPosition[] = [];
    private readonly QUEUE_SIZE = 500;

    constructor(worldSize: number, _collisionRadius: number, rng: SeededRandom) {
        this.worldSize = worldSize;
        this.rng = rng;
    }

    private getGridKey(x: number, y: number): string {
        const offset = this.worldSize / 2;
        const cellsPerRow = Math.ceil(this.worldSize / this.GRID_CELL_SIZE);

        let gx = Math.floor((x + offset) / this.GRID_CELL_SIZE);
        let gy = Math.floor((y + offset) / this.GRID_CELL_SIZE);

        // Wrap
        gx = (gx % cellsPerRow + cellsPerRow) % cellsPerRow;
        gy = (gy % cellsPerRow + cellsPerRow) % cellsPerRow;

        return `${gx},${gy}`;
    }

    private addToGrid(grid: Map<string, any[]>, entity: { x: number, y: number }, item: any) {
        const key = this.getGridKey(entity.x, entity.y);
        if (!grid.has(key)) {
            grid.set(key, []);
        }
        grid.get(key)!.push(item);
    }

    public rebuildGrids(foods: Food[], poisons: Poison[]) {
        this.foodGrid.clear();
        this.poisonGrid.clear();

        for (const food of foods) {
            this.addToGrid(this.foodGrid, food, food);
        }
        for (const poison of poisons) {
            this.addToGrid(this.poisonGrid, poison, poison);
        }
    }

    public getNearbyFood(x: number, y: number, radius: number): Food[] {
        return this.getNearbyEntities(x, y, radius, this.foodGrid);
    }

    public getNearbyPoison(x: number, y: number, radius: number): Poison[] {
        return this.getNearbyEntities(x, y, radius, this.poisonGrid);
    }

    private getNearbyEntities<T extends { x: number, y: number }>(x: number, y: number, radius: number, grid: Map<string, T[]>): T[] {
        const results: T[] = [];
        const seen = new Set<T>();

        const offset = this.worldSize / 2;
        const cellsPerRow = Math.ceil(this.worldSize / this.GRID_CELL_SIZE);

        const minX = x - radius;
        const maxX = x + radius;
        const minY = y - radius;
        const maxY = y + radius;

        const startGx = Math.floor((minX + offset) / this.GRID_CELL_SIZE);
        const endGx = Math.floor((maxX + offset) / this.GRID_CELL_SIZE);
        const startGy = Math.floor((minY + offset) / this.GRID_CELL_SIZE);
        const endGy = Math.floor((maxY + offset) / this.GRID_CELL_SIZE);

        for (let gx = startGx; gx <= endGx; gx++) {
            for (let gy = startGy; gy <= endGy; gy++) {
                const wrappedGx = (gx % cellsPerRow + cellsPerRow) % cellsPerRow;
                const wrappedGy = (gy % cellsPerRow + cellsPerRow) % cellsPerRow;
                const key = `${wrappedGx},${wrappedGy}`;

                const cell = grid.get(key);
                if (cell) {
                    for (const item of cell) {
                        if (!seen.has(item)) {
                            results.push(item);
                            seen.add(item);
                        }
                    }
                }
            }
        }
        return results;
    }

    public generateSpawnQueue(): void {
        this.foodSpawnQueue = [];
        this.poisonSpawnQueue = [];
        const half = this.worldSize / 2;

        for (let i = 0; i < this.QUEUE_SIZE; i++) {
            this.foodSpawnQueue.push({
                x: this.rng.randomRange(-half + 50, half - 50),
                y: this.rng.randomRange(-half + 50, half - 50)
            });
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
        const safeRadius = 250;
        let x, y, dist;

        do {
            x = this.rng.randomRange(-half + 50, half - 50);
            y = this.rng.randomRange(-half + 50, half - 50);
            dist = Math.sqrt(x * x + y * y);
        } while (dist < safeRadius);

        return new Poison(x, y, 30);
    }

    public spawnFoodFromQueue(index: number): Food {
        const pos = this.foodSpawnQueue[index % this.QUEUE_SIZE];
        return new Food(pos.x, pos.y, 30);
    }

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
