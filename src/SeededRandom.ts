/**
 * Seeded Random Number Generator using Linear Congruential Generator (LCG)
 * Provides reproducible random numbers for consistent simulations
 */
export class SeededRandom {
    private seed: number;
    private readonly a = 1664525;
    private readonly c = 1013904223;
    private readonly m = 2 ** 32;

    constructor(seed: number = Date.now()) {
        this.seed = seed % this.m;
    }

    /**
     * Set a new seed value
     */
    setSeed(seed: number): void {
        this.seed = seed % this.m;
    }

    /**
     * Get the current seed
     */
    getSeed(): number {
        return this.seed;
    }

    /**
     * Generate next random number [0, 1)
     */
    random(): number {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed / this.m;
    }

    /**
     * Generate random number in range [min, max)
     */
    randomRange(min: number, max: number): number {
        return min + this.random() * (max - min);
    }

    /**
     * Generate random integer in range [min, max]
     */
    randomInt(min: number, max: number): number {
        return Math.floor(this.randomRange(min, max + 1));
    }
}
