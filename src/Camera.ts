export class Camera {
    public x: number = 0;
    public y: number = 0;
    private targetX: number = 0;
    private targetY: number = 0;
    private readonly SMOOTHNESS = 0.08; // Lower = smoother/slower, Higher = faster/snappier

    follow(x: number, y: number): void {
        this.targetX = x;
        this.targetY = y;

        // Lerp towards target position for smooth camera movement
        this.x += (this.targetX - this.x) * this.SMOOTHNESS;
        this.y += (this.targetY - this.y) * this.SMOOTHNESS;
    }

    // Instantly snap to position (no smoothing)
    snap(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
    }

    applyTransform(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(1, -1); // Flip Y to match Rapier's Y-up
        ctx.translate(-this.x, -this.y);
    }

    resetTransform(ctx: CanvasRenderingContext2D): void {
        ctx.restore();
    }
}
