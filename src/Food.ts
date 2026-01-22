/**
 * Food item that can be collected by the boid
 */
export class Food {
    public x: number;
    public y: number;
    public radius: number;
    public color: string;

    constructor(x: number, y: number, radius: number = 24) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = '#00ff88';
    }

    /**
     * Check if this food item is colliding with a circular object
     */
    isColliding(x: number, y: number, radius: number): boolean {
        const dx = this.x - x;
        const dy = this.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.radius + radius);
    }

    /**
     * Draw the food item on a canvas context
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
