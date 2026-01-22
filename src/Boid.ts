import type RAPIER from '@dimforge/rapier2d-compat';
import { Brain } from './Brain';

export interface Sensor {
    angle: number;
    length: number;
    reading: number;
    detectedType: 'FOOD' | 'POISON' | 'NONE';
    endX: number;
    endY: number;
}

export class Boid {
    private body: RAPIER.RigidBody;
    private leftThruster: number = 0;
    private rightThruster: number = 0;
    private readonly THRUSTER_MAX = 500.0;
    private readonly THRUSTER_STEP: number;

    private sensors: Sensor[] = [];
    private readonly SENSOR_COUNT = 9;
    private readonly SENSOR_ANGLE_SPREAD = Math.PI * 0.5;
    private readonly SENSOR_LENGTH = 400;

    brain: Brain;

    constructor(RAPIER: typeof import('@dimforge/rapier2d-compat'), world: RAPIER.World, brain?: Brain) {
        this.THRUSTER_STEP = this.THRUSTER_MAX / 10;

        // Initialize Brain (Inputs: Sensors * 3 (reading, food?, poison?), Hidden: 8, Output: 2)
        // Sensors return reading (0-1) and detectedType.
        // Let's feed: For each sensor: [reading, isFood, isPoison]
        // 9 sensors * 3 = 27 inputs.
        // Actually simplifies: Reading, isFood (1/0), isPoison (1/0) might be better?
        // Or: 
        // Input: [Sensor1Reading, Sensor1Type, Sensor2Reading, ....]
        // Type could be: 1 for Food, -1 for Poison, 0 for None.
        const inputSize = this.SENSOR_COUNT * 2; // Reading + Type
        const hiddenSize = 10;
        const outputSize = 2; // Left, Right thruster

        if (brain) {
            this.brain = brain;
        } else {
            this.brain = new Brain(inputSize, hiddenSize, outputSize);
        }

        // Initialize Sensors
        for (let i = 0; i < this.SENSOR_COUNT; i++) {
            const angle = -this.SENSOR_ANGLE_SPREAD / 2 + (i * this.SENSOR_ANGLE_SPREAD) / (this.SENSOR_COUNT - 1);
            this.sensors.push({
                angle: angle,
                length: this.SENSOR_LENGTH,
                reading: 1.0,
                detectedType: 'NONE',
                endX: 0,
                endY: 0
            });
        }

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

    /*
     * Updates the sensors based on the current position and nearby entities.
     * Uses simplified raycasting against circular objects.
     */
    updateSensors(foods: { x: number, y: number, radius: number }[], poisons: { x: number, y: number, radius: number }[], worldSize: number): void {
        const pos = this.body.translation();
        const rotation = this.body.rotation();

        for (const sensor of this.sensors) {
            // Calculate sensor ray in world space
            // Boid nose is at (0, 15) which is angle PI/2 (+Y)
            // So we center sensors around rotation + PI/2
            const finalAngle = rotation + Math.PI / 2 + sensor.angle;

            const rayDirX = Math.cos(finalAngle);
            const rayDirY = Math.sin(finalAngle);

            // Origin of ray (center of boid)
            const startX = pos.x;
            const startY = pos.y;

            let closestDist = this.SENSOR_LENGTH;
            let detected = 'NONE';

            // Check Foods
            for (const food of foods) {
                // Ghost sensing: find closest wrapped position
                let dx = food.x - startX;
                let dy = food.y - startY;

                if (dx > worldSize / 2) dx -= worldSize;
                if (dx < -worldSize / 2) dx += worldSize;
                if (dy > worldSize / 2) dy -= worldSize;
                if (dy < -worldSize / 2) dy += worldSize;

                const wrappedFoodX = startX + dx;
                const wrappedFoodY = startY + dy;

                const dist = this.rayCircleIntersect(startX, startY, rayDirX, rayDirY, wrappedFoodX, wrappedFoodY, food.radius);
                if (dist !== null && dist < closestDist) {
                    closestDist = dist;
                    detected = 'FOOD';
                }
            }

            // Check Poisons
            for (const poison of poisons) {
                // Ghost sensing: find closest wrapped position
                let dx = poison.x - startX;
                let dy = poison.y - startY;

                if (dx > worldSize / 2) dx -= worldSize;
                if (dx < -worldSize / 2) dx += worldSize;
                if (dy > worldSize / 2) dy -= worldSize;
                if (dy < -worldSize / 2) dy += worldSize;

                const wrappedPoisonX = startX + dx;
                const wrappedPoisonY = startY + dy;

                const dist = this.rayCircleIntersect(startX, startY, rayDirX, rayDirY, wrappedPoisonX, wrappedPoisonY, poison.radius);
                if (dist !== null && dist < closestDist) {
                    closestDist = dist;
                    detected = 'POISON';
                }
            }

            // Update Sensor State
            sensor.reading = 1.0 - (closestDist / this.SENSOR_LENGTH); // 0 = far/nothing, 1 = close
            sensor.detectedType = detected as 'FOOD' | 'POISON' | 'NONE';
            sensor.endX = startX + rayDirX * closestDist;
            sensor.endY = startY + rayDirY * closestDist;
        }
    }

    /**
     * Returns distance to intersection or null if no intersection
     */
    private rayCircleIntersect(rx: number, ry: number, rdx: number, rdy: number, cx: number, cy: number, cr: number): number | null {
        // Vector from ray origin to circle center
        const fx = cx - rx;
        const fy = cy - ry;

        // Project f onto ray direction
        const t = fx * rdx + fy * rdy;

        // Closest point on ray line to circle center
        // If t < 0, circle is behind ray (but we only care if we are INSIDE, which is rare/handled)
        // Let's treat valid intersection range [0, SENSOR_LENGTH]

        let closestX = rx + rdx * t;
        let closestY = ry + rdy * t;

        // If t < 0, clamp to 0 (start) - but if circle is behind, we might still be inside?
        // Simple approach: check perpendicular distance

        // Distance squared from circle center to closest point on line
        const circleDistSq = (closestX - cx) * (closestX - cx) + (closestY - cy) * (closestY - cy);

        if (circleDistSq > cr * cr) {
            return null; // Miss
        }

        // Hits! calculate exact intersection distance
        // We want the entrance point.
        // Triangle: distance from closest point to intersection point along the ray
        const dt = Math.sqrt(cr * cr - circleDistSq);

        // Intersection t values: t - dt and t + dt
        const t1 = t - dt;
        // t2 = t + dt (exit point)

        if (t1 < 0 || t1 > this.SENSOR_LENGTH) {
            return null; // Intersection is behind or too far
        }

        return t1;
    }

    updateThrusters(qPressed: boolean, aPressed: boolean, wPressed: boolean, sPressed: boolean): void {
        // Manual Control (Override)
        if (qPressed || aPressed || wPressed || sPressed) {
            // Left Thruster: Q (up), A (down)
            if (qPressed) this.leftThruster = Math.min(this.leftThruster + this.THRUSTER_STEP, this.THRUSTER_MAX);
            if (aPressed) this.leftThruster = Math.max(this.leftThruster - this.THRUSTER_STEP, 0);

            // Right Thruster: W (up), S (down)
            if (wPressed) this.rightThruster = Math.min(this.rightThruster + this.THRUSTER_STEP, this.THRUSTER_MAX);
            if (sPressed) this.rightThruster = Math.max(this.rightThruster - this.THRUSTER_STEP, 0);
        }

        this.applyThrusterForces();
    }

    think(): void {
        const inputs: number[] = [];
        for (const sensor of this.sensors) {
            inputs.push(sensor.reading);
            // Type: Food=1, Poison=-1, None=0
            let typeVal = 0;
            if (sensor.detectedType === 'FOOD') typeVal = 1;
            if (sensor.detectedType === 'POISON') typeVal = -1;
            inputs.push(typeVal);
        }

        this.brain.lastInputs = inputs;
        const outputs = this.brain.predict(inputs);
        // Outputs are 0-1. Map to Thruster Force.
        // Threshold? Or proportional?
        // Let's say separate outputs for Left and Right power.

        this.leftThruster = outputs[0] * this.THRUSTER_MAX;
        this.rightThruster = outputs[1] * this.THRUSTER_MAX;
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
        const pos = this.getPosition();

        // Draw Sensors (World Space because they are calculated in world space)
        // We do this BEFORE rotation because we have world coords
        ctx.save();
        // Reset transform to identity (draw caller might have NOT applied translation yet? 
        // Game.ts says: `this.renderer.drawBoidAtCenter((ctx) => this.boid.draw(ctx));`
        // Renderer does: `ctx.translate(canvas.width/2, canvas.height/2);` then calls callback.
        // So `0,0` is where the boid IS visually.
        // BUT my sensor coordinates are in WORLD space.
        // I need to convert them to relative space (Relative to Boid) OR
        // Ask Renderer to handle world-space drawing?
        // 
        // Let's modify: `updateSensors` stores RELATIVE coords? Or easier:
        // Inverse transform the world points.
        // endX - pos.x, endY - pos.y
        ctx.lineWidth = 1;
        for (const sensor of this.sensors) {
            if (sensor.detectedType === 'FOOD') ctx.strokeStyle = '#00ff00';
            else if (sensor.detectedType === 'POISON') ctx.strokeStyle = '#ff0000';
            else ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';

            ctx.beginPath();
            ctx.moveTo(0, 0); // Center of boid
            ctx.lineTo(sensor.endX - pos.x, sensor.endY - pos.y);
            ctx.stroke();
        }
        ctx.restore();


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
