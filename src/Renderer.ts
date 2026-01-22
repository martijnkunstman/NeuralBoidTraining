import { Food } from './Food';
import { Poison } from './Poison';
import { Camera } from './Camera';

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

    drawWorld(camera: Camera, foods: Food[], poisons: Poison[]): void {
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
        foods.forEach(food => this.drawItemWithGhosts(food, camera.x, camera.y));
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

    private drawItemWithGhosts(item: Food | Poison, camX: number, camY: number): void {
        const viewDist = Math.max(this.canvas.width, this.canvas.height) / 2 + 100;
        const half = this.worldSize / 2;

        // Draw main item
        item.draw(this.ctx);

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
            item.draw(this.ctx);
            this.ctx.restore();
        }
    }

    drawBoidAtCenter(drawCallback: (ctx: CanvasRenderingContext2D) => void): void {
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(1, -1);
        drawCallback(this.ctx);
        this.ctx.restore();
    }

    drawMinimap(boidX: number, boidY: number, foods: Food[], poisons: Poison[]): void {
        const minimapSize = 200;
        const minimapPadding = 20;
        const minimapX = this.canvas.width - minimapSize - minimapPadding;
        const minimapY = minimapPadding;

        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform

        // Minimap background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);

        // Minimap border
        this.ctx.strokeStyle = '#4facfe';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

        // Scale factor for minimap
        const scale = minimapSize / this.worldSize;
        const centerMinimapX = (coord: number) => (coord + this.worldSize / 2) * scale;
        const centerMinimapY = (coord: number) => (this.worldSize / 2 - coord) * scale; // Flip Y-axis

        // Draw world border on minimap
        this.ctx.strokeStyle = 'rgba(79, 172, 254, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

        // Draw food on minimap
        this.ctx.fillStyle = '#00ff88';
        foods.forEach(food => {
            const mx = minimapX + centerMinimapX(food.x);
            const my = minimapY + centerMinimapY(food.y);
            this.ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
        });

        // Draw poison on minimap
        this.ctx.fillStyle = '#ff4444';
        poisons.forEach(poison => {
            const mx = minimapX + centerMinimapX(poison.x);
            const my = minimapY + centerMinimapY(poison.y);
            this.ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
        });

        // Draw boid on minimap
        const boidMinimapX = minimapX + centerMinimapX(boidX);
        const boidMinimapY = minimapY + centerMinimapY(boidY);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(boidMinimapX, boidMinimapY, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#4facfe';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }
}
