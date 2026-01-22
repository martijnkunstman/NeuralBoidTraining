/**
 * Poison item that should be avoided by the boid
 */
export class Poison {
    public x: number;
    public y: number;
    public radius: number;
    public color: string;

    constructor(x: number, y: number, radius: number = 16) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = '#ff4444';
    }

    /**
     * Check if this poison item is colliding with a circular object
     */
    isColliding(x: number, y: number, radius: number): boolean {
        const dx = this.x - x;
        const dy = this.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.radius + radius);
    }

    /**
     * Draw the poison item on a canvas context
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
