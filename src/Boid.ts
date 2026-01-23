import type RAPIER from '@dimforge/rapier2d-compat';
import { NeuralNetwork } from './NeuralNetwork';

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


    private sensors: Sensor[] = [];
    private readonly SENSOR_COUNT = 21;
    private readonly SENSOR_ANGLE_SPREAD = Math.PI * 0.5;
    private readonly SENSOR_LENGTH = 600;

    public brain: NeuralNetwork;
    private readonly INPUT_NODES = 14;
    private readonly HIDDEN_NODES = 12;
    private readonly OUTPUT_NODES = 2;

    public lastInputs: number[] = [];

    constructor(RAPIER: typeof import('@dimforge/rapier2d-compat'), world: RAPIER.World) {

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

        // Initialize Brain
        this.brain = new NeuralNetwork(this.INPUT_NODES, this.HIDDEN_NODES, this.OUTPUT_NODES);
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

    updateThrusters(): void {
        // Manual override or training inputs could go here

        // Use Brain to decide
        this.decide();

        // If we want manual override to work alongside AI (e.g. for testing inputs):
        // But for this task, the brain controls it.
        // We can just trust decide set the thrusters.

        this.applyThrusterForces();
    }

    decide(): void {
        const inputs: number[] = [];

        // We have 21 sensors.
        // First 7 inputs: Food detection. 21 sensors / 7 = 3 sensors per input.
        // Max value of the group.

        // Group 1: Sensors 0, 1, 2
        // Group 2: Sensors 3, 4, 5
        // ...

        const SENSORS_PER_INPUT = 3;
        const INPUT_GROUPS = 7;

        // inputs[0-6]: Food
        for (let i = 0; i < INPUT_GROUPS; i++) {
            let maxVal = 0;
            for (let j = 0; j < SENSORS_PER_INPUT; j++) {
                const sensorIdx = i * SENSORS_PER_INPUT + j;
                const sensor = this.sensors[sensorIdx];
                if (sensor.detectedType === 'FOOD') {
                    if (sensor.reading > maxVal) maxVal = sensor.reading;
                }
            }
            inputs.push(maxVal);
        }

        // inputs[7-13]: Poison
        for (let i = 0; i < INPUT_GROUPS; i++) {
            let maxVal = 0;
            for (let j = 0; j < SENSORS_PER_INPUT; j++) {
                const sensorIdx = i * SENSORS_PER_INPUT + j;
                const sensor = this.sensors[sensorIdx];
                if (sensor.detectedType === 'POISON') {
                    if (sensor.reading > maxVal) maxVal = sensor.reading;
                }
            }
            inputs.push(maxVal);
        }

        this.lastInputs = inputs;
        const outputs = this.brain.feedForward(inputs);

        // Output 0 -> Left Thruster
        // Output 1 -> Right Thruster
        // Outputs are 0-1.

        // Thresholding? Or continuous? "0 for no thrust 1 for full thrust" implies continuous mapped to max.
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
            if (sensor.detectedType === 'FOOD') {
                ctx.strokeStyle = `rgba(0, 255, 0, ${sensor.reading})`;
            } else if (sensor.detectedType === 'POISON') {
                ctx.strokeStyle = `rgba(255, 0, 0, ${sensor.reading})`;
            } else {
                ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
            }

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

    getSensors(): Sensor[] {
        return this.sensors;
    }
}
