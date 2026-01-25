import { Panel } from './Panel';
import { Food } from './Food';
import { Poison } from './Poison';

export class MinimapPanel extends Panel {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private readonly SIZE = 200;
    private worldSize: number;

    constructor(worldSize: number) {
        super('Minimap', 'top-right', 'auto');
        this.worldSize = worldSize;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.SIZE;
        this.canvas.height = this.SIZE;
        this.canvas.style.display = 'block';
        this.canvas.style.background = '#000';
        this.canvas.style.border = '1px solid #333';
        this.content.appendChild(this.canvas);

        // Remove padding for cleaner look? Or keep it.
        this.content.style.padding = '5px';

        this.ctx = this.canvas.getContext('2d')!;
    }

    draw(boidX: number, boidY: number, foods: Food[], poisons: Poison[], ignoredFoods: Food[] = []): void {
        if (this.isCollapsed) return;

        // Clear
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.SIZE, this.SIZE);

        // Scale factor
        const scale = this.SIZE / this.worldSize;
        const centerMinimapX = (coord: number) => (coord + this.worldSize / 2) * scale;
        const centerMinimapY = (coord: number) => (this.worldSize / 2 - coord) * scale; // Flip Y

        // Draw Food
        for (const food of foods) {
            const isIgnored = ignoredFoods.includes(food);
            this.ctx.fillStyle = isIgnored ? '#0000FF' : '#00ff88';
            const mx = centerMinimapX(food.x);
            const my = centerMinimapY(food.y);
            this.ctx.fillRect(mx - 1, my - 1, 2, 2);
        }

        // Draw Poison
        this.ctx.fillStyle = '#ff4444';
        for (const poison of poisons) {
            const mx = centerMinimapX(poison.x);
            const my = centerMinimapY(poison.y);
            this.ctx.fillRect(mx - 1, my - 1, 2, 2);
        }

        // Draw Boid
        const bx = centerMinimapX(boidX);
        const by = centerMinimapY(boidY);

        this.ctx.beginPath();
        this.ctx.arc(bx, by, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#4facfe';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
}
