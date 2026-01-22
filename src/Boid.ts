import type RAPIER from '@dimforge/rapier2d-compat';

export class Boid {
    private body: RAPIER.RigidBody;
    private leftThruster: number = 0;
    private rightThruster: number = 0;
    private readonly THRUSTER_MAX = 500.0;
    private readonly THRUSTER_STEP: number;

    constructor(RAPIER: typeof import('@dimforge/rapier2d-compat'), world: RAPIER.World) {
        this.THRUSTER_STEP = this.THRUSTER_MAX / 10;

        // Create rigid body
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0, 0)
            .setLinearDamping(0.5)
            .setAngularDamping(2.0);
        this.body = world.createRigidBody(bodyDesc);

        // Triangle Shape (pointing up)
        const vertices = new Float32Array([0, 15, -10, -10, 10, -10]);
        const colliderDesc = RAPIER.ColliderDesc.convexHull(vertices)!;
        world.createCollider(colliderDesc, this.body);
    }

    updateThrusters(qPressed: boolean, aPressed: boolean, wPressed: boolean, sPressed: boolean): void {
        // Left Thruster: Q (up), A (down)
        if (qPressed) this.leftThruster = Math.min(this.leftThruster + this.THRUSTER_STEP, this.THRUSTER_MAX);
        if (aPressed) this.leftThruster = Math.max(this.leftThruster - this.THRUSTER_STEP, 0);

        // Right Thruster: W (up), S (down)
        if (wPressed) this.rightThruster = Math.min(this.rightThruster + this.THRUSTER_STEP, this.THRUSTER_MAX);
        if (sPressed) this.rightThruster = Math.max(this.rightThruster - this.THRUSTER_STEP, 0);

        this.applyThrusterForces();
    }

    private applyThrusterForces(): void {
        const rotation = this.body.rotation();
        const fx = -Math.sin(rotation);
        const fy = Math.cos(rotation);

        const bl_local = { x: -10, y: -10 };
        const br_local = { x: 10, y: -10 };

        const rotate = (p: { x: number, y: number }, rad: number) => ({
            x: p.x * Math.cos(rad) - p.y * Math.sin(rad),
            y: p.x * Math.sin(rad) + p.y * Math.cos(rad)
        });

        const pos = this.body.translation();

        if (this.leftThruster > 0) {
            const p = rotate(bl_local, rotation);
            this.body.applyImpulseAtPoint(
                { x: fx * this.leftThruster * 0.1, y: fy * this.leftThruster * 0.1 },
                { x: pos.x + p.x, y: pos.y + p.y },
                true
            );
        }

        if (this.rightThruster > 0) {
            const p = rotate(br_local, rotation);
            this.body.applyImpulseAtPoint(
                { x: fx * this.rightThruster * 0.1, y: fy * this.rightThruster * 0.1 },
                { x: pos.x + p.x, y: pos.y + p.y },
                true
            );
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.rotate(this.body.rotation());

        // Triangle
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(-10, -10);
        ctx.lineTo(10, -10);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Thrusters
        const tLen = 30;
        if (this.leftThruster > 0) {
            const h = (this.leftThruster / this.THRUSTER_MAX) * tLen;
            ctx.beginPath();
            ctx.moveTo(-7, -10);
            ctx.lineTo(-7, -10 - h);
            ctx.strokeStyle = '#ff4b2b';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        if (this.rightThruster > 0) {
            const h = (this.rightThruster / this.THRUSTER_MAX) * tLen;
            ctx.beginPath();
            ctx.moveTo(7, -10);
            ctx.lineTo(7, -10 - h);
            ctx.strokeStyle = '#ff4b2b';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        ctx.restore();
    }

    getBody(): RAPIER.RigidBody {
        return this.body;
    }

    getPosition(): { x: number, y: number } {
        return this.body.translation();
    }

    getVelocity(): { x: number, y: number } {
        return this.body.linvel();
    }

    getAngularVelocity(): number {
        return this.body.angvel();
    }

    getLeftThrusterPercent(): number {
        return (this.leftThruster / this.THRUSTER_MAX) * 100;
    }

    getRightThrusterPercent(): number {
        return (this.rightThruster / this.THRUSTER_MAX) * 100;
    }
}
