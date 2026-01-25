import { Food } from './Food';
import { Poison } from './Poison';
import { Camera } from './Camera';


import { Boid } from './Boid';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private worldSize: number;

    constructor(worldSize: number) {
        this.worldSize = worldSize;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        document.getElementById('app')!.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    private resize(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawWorld(camera: Camera, foods: Food[], poisons: Poison[], ignoredFoods: Food[] = []): void {
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(1, -1); // Flip Y to match Rapier's Y-up

        this.ctx.save();
        this.ctx.translate(-camera.x, -camera.y);

        // Draw grid
        this.drawGrid();

        // Draw borders
        this.drawBorders();

        // Draw food and poison with ghost wrapping
        foods.forEach(food => {
            const isIgnored = ignoredFoods.includes(food);
            this.drawItemWithGhosts(food, camera.x, camera.y, isIgnored ? '#0000FF' : undefined);
        });
        poisons.forEach(poison => this.drawItemWithGhosts(poison, camera.x, camera.y));

        this.ctx.restore();
        this.ctx.restore();
    }

    private drawGrid(): void {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        for (let i = -this.worldSize / 2; i <= this.worldSize / 2; i += 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, -this.worldSize / 2);
            this.ctx.lineTo(i, this.worldSize / 2);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(-this.worldSize / 2, i);
            this.ctx.lineTo(this.worldSize / 2, i);
            this.ctx.stroke();
        }
    }

    private drawBorders(): void {
        // Enhanced Borders
        this.ctx.strokeStyle = '#4facfe';
        this.ctx.lineWidth = 6;
        this.ctx.strokeRect(-this.worldSize / 2, -this.worldSize / 2, this.worldSize, this.worldSize);

        // Corner markers
        const cornerSize = 20;
        this.ctx.fillStyle = '#4facfe';
        const half = this.worldSize / 2;
        this.ctx.fillRect(-half - 3, -half - 3, cornerSize, cornerSize);
        this.ctx.fillRect(half - cornerSize + 3, -half - 3, cornerSize, cornerSize);
        this.ctx.fillRect(-half - 3, half - cornerSize + 3, cornerSize, cornerSize);
        this.ctx.fillRect(half - cornerSize + 3, half - cornerSize + 3, cornerSize, cornerSize);
    }

    private drawItemWithGhosts(item: Food | Poison, camX: number, camY: number, color?: string): void {
        const viewDist = Math.max(this.canvas.width, this.canvas.height) / 2 + 100;
        const half = this.worldSize / 2;

        const draw = () => {
            if (color) {
                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                item.draw(this.ctx);
            }
        };

        // Draw main item
        draw();

        // Check if we need to draw ghost copies
        const offsets = [];
        if (item.x - camX < -half + viewDist) offsets.push({ dx: this.worldSize, dy: 0 });
        if (item.x - camX > half - viewDist) offsets.push({ dx: -this.worldSize, dy: 0 });
        if (item.y - camY < -half + viewDist) offsets.push({ dx: 0, dy: this.worldSize });
        if (item.y - camY > half - viewDist) offsets.push({ dx: 0, dy: -this.worldSize });

        // Draw ghost copies
        for (const offset of offsets) {
            this.ctx.save();
            this.ctx.translate(offset.dx, offset.dy);
            draw();
            this.ctx.restore(); // Restore transform
        }
    }

    // Draw all boids with ghosting
    drawBoids(boids: Boid[], camera: Camera, bestBoid: Boid): void {
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(1, -1);
        this.ctx.translate(-camera.x, -camera.y);

        const viewDist = Math.max(this.canvas.width, this.canvas.height) / 2 + 100;
        const half = this.worldSize / 2;

        boids.forEach(boid => {
            // Draw regular (unless it's best boid, maybe draw differently?)
            const isBest = boid === bestBoid;
            const alpha = isBest ? 1.0 : 0.3; // dim others

            this.ctx.globalAlpha = alpha;
            this.drawBoidWithGhosts(boid, camera.x, camera.y, viewDist, half, isBest);
            this.ctx.globalAlpha = 1.0;
        });

        this.ctx.restore();
    }

    private drawBoidWithGhosts(boid: Boid, camX: number, camY: number, viewDist: number, half: number, showSensors: boolean = false): void {
        const pos = boid.getPosition();

        // Helper to draw at position
        const drawAt = (x: number, y: number) => {
            this.ctx.save();
            this.ctx.translate(x, y);
            boid.draw(this.ctx, showSensors);
            this.ctx.restore();
        };

        drawAt(pos.x, pos.y);

        // Check ghosts
        const offsets = [];
        if (pos.x - camX < -half + viewDist) offsets.push({ dx: this.worldSize, dy: 0 });
        if (pos.x - camX > half - viewDist) offsets.push({ dx: -this.worldSize, dy: 0 });
        if (pos.y - camY < -half + viewDist) offsets.push({ dx: 0, dy: this.worldSize });
        if (pos.y - camY > half - viewDist) offsets.push({ dx: 0, dy: -this.worldSize });

        for (const offset of offsets) {
            drawAt(pos.x + offset.dx, pos.y + offset.dy);
        }
    }


    // Minimap and Brain drawing removed (Moved to dedicated Panels)
}
