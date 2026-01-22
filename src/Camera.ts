export class Camera {
    public x: number = 0;
    public y: number = 0;

    follow(x: number, y: number): void {
        this.x = x;
        this.y = y;
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
