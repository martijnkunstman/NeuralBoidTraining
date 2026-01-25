import type RAPIER from '@dimforge/rapier2d-compat';
import { NeuralNetwork } from './NeuralNetwork';
import { Food } from './Food';
import { Poison } from './Poison';
import { CollisionManager } from './CollisionManager';

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
    private readonly THRUSTER_MAX = 1600.0;


    private sensors: Sensor[] = [];
    private readonly SENSOR_COUNT = 7;
    private readonly SENSOR_ANGLE_SPREAD = Math.PI * 0.5;
    private readonly SENSOR_LENGTH = 600;

    public brain: NeuralNetwork;
    private readonly INPUT_NODES = 17; // Added 3 inputs for velocity
    private readonly HIDDEN_NODES = 16;
    private readonly OUTPUT_NODES = 2;

    public lastInputs: number[] = [];

    // Neuroevolution properties
    public score: number = 0;
    public foods: Food[] = [];
    public poisons: Poison[] = [];
    public isDead: boolean = false;
    public timeAlive: number = 0;
    public life: number = 100;
    private readonly MAX_LIFE = 100;
    private readonly LIFE_DECAY_RATE = 1; // Reduced from 2 - they live longer now

    // Spawn indices for synchronized respawns
    private foodSpawnIndex: number = 0;
    private poisonSpawnIndex: number = 0;


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
            .setLinearDamping(0.4) // Reduced from 0.6 to help them move easier
            .setAngularDamping(1.5);
        this.body = world.createRigidBody(bodyDesc);

        // Triangle Shape (pointing up)
        const vertices = new Float32Array([0, 15, -10, -10, 10, -10]);
        const colliderDesc = RAPIER.ColliderDesc.convexHull(vertices)!;
        // Disable collisions: Membership group 1, Filter group 0 (interact with nothing)
        colliderDesc.setCollisionGroups(0x00010000);
        world.createCollider(colliderDesc, this.body);

        // Initialize Brain
        this.brain = new NeuralNetwork(this.INPUT_NODES, this.HIDDEN_NODES, this.OUTPUT_NODES);
    }

    /*
     * Updates the sensors based on the current position and nearby entities.
     * Uses simplified raycasting against circular objects.
     */
    updateSensors(worldSize: number): void {
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
            for (const food of this.foods) {
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
            for (const poison of this.poisons) {
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

    // Initialize environment with own food/poison (from templates if provided)
    initializeEnvironment(foodCount: number, poisonCount: number, spawner: CollisionManager, templateFoods?: Food[], templatePoisons?: Poison[]) {
        this.foods = [];
        this.poisons = [];

        if (templateFoods && templatePoisons) {
            // Clone from templates - same positions but independent instances
            for (const food of templateFoods) {
                this.foods.push(new Food(food.x, food.y, food.radius));
            }
            for (const poison of templatePoisons) {
                this.poisons.push(new Poison(poison.x, poison.y, poison.radius));
            }
        } else {
            // Generate new random positions
            for (let i = 0; i < foodCount; i++) this.foods.push(spawner.spawnFood());
            for (let i = 0; i < poisonCount; i++) this.poisons.push(spawner.spawnPoison());
        }

        this.score = 0;
        this.timeAlive = 0;
        this.life = 100;
        this.isDead = false;
        this.foodSpawnIndex = 0;
        this.poisonSpawnIndex = 0;

        // Reset physics
        this.body.setLinvel({ x: 0, y: 0 }, true);
        this.body.setAngvel(0, true);
    }

    checkCollisions(spawner: CollisionManager): void {
        const pos = this.getPosition();
        const BOID_RADIUS = 15; // From Game.ts constants

        // Check poison
        for (let i = this.poisons.length - 1; i >= 0; i--) {
            if (this.poisons[i].isColliding(pos.x, pos.y, BOID_RADIUS)) {
                this.poisons.splice(i, 1);
                this.poisons.push(spawner.spawnPoisonFromQueue(this.poisonSpawnIndex));
                this.poisonSpawnIndex++;
                this.score -= 100;
                this.life -= 100;
            }
        }

        // Check food
        for (let i = this.foods.length - 1; i >= 0; i--) {
            if (this.foods[i].isColliding(pos.x, pos.y, BOID_RADIUS)) {
                this.foods.splice(i, 1);
                this.foods.push(spawner.spawnFoodFromQueue(this.foodSpawnIndex));
                this.foodSpawnIndex++;
                this.score += 25; // Increased from 10
                this.life += 20;
                if (this.life > this.MAX_LIFE) this.life = this.MAX_LIFE;
            }
        }

        // Survival points (approx 60fps)
        this.score += 1 / 60;
        this.timeAlive += 1 / 60;

        // Proximity reward: small bonus for having food in sensors (encourages seeking)
        // Sum up food sensor readings and give a tiny bonus
        let foodProximityBonus = 0;
        for (const sensor of this.sensors) {
            if (sensor.detectedType === 'FOOD') {
                foodProximityBonus += sensor.reading * 0.01; // Closer = more bonus
            }
        }
        this.score += foodProximityBonus;

        // Life decay
        this.life -= this.LIFE_DECAY_RATE / 60;

        if (this.life <= 0) {
            this.life = 0;
            this.isDead = true;
        }
    }

    // Helper to apply brain from another boid
    copyBrainFrom(other: Boid) {
        this.brain = other.brain.copy();
    }



    updateThrusters(): void {
        if (this.isDead) {
            // Stop applying forces if dead.
            // Force zero velocity to "freeze" it immediately
            this.body.setLinvel({ x: 0, y: 0 }, true);
            this.body.setAngvel(0, true);

            this.leftThruster = 0;
            this.rightThruster = 0;
            return;
        }

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

        // We have 7 sensors, each directly mapped to neural network inputs.
        // inputs[0-6]: Food detection (reading if food detected, 0 otherwise)
        for (const sensor of this.sensors) {
            inputs.push(sensor.detectedType === 'FOOD' ? sensor.reading : 0);
        }

        // inputs[7-13]: Poison detection (reading if poison detected, 0 otherwise)
        for (const sensor of this.sensors) {
            inputs.push(sensor.detectedType === 'POISON' ? sensor.reading : 0);
        }

        // inputs[14, 15, 16]: Proprioception (Self-sensing)
        // We need local velocity to know if we are drifting sideways vs moving forward.
        const vel = this.body.linvel();
        const angVel = this.body.angvel();
        const rotation = this.body.rotation();

        // Rotate velocity to local space
        // localX = forward velocity, localY = sideways drift

        // Wait, Boid nose is (0, 15). "Up" in local is +Y? 
        // Let's verify orientation.
        // In draw(): moveTo(0, 15) is nose.
        // In applyThrusterForces(): fx = -Math.sin(rotation), fy = Math.cos(rotation).
        // If rotation=0, fx=0, fy=1. So (0, 1) is forward?
        // Yes, 0 degrees is facing +Y.

        // So to get local coordinates relative to "Forward":
        // Forward vector F = (-sin(rot), cos(rot))
        // Right vector R = (cos(rot), sin(rot))

        // Dot product with velocity
        const forwardVel = vel.x * (-Math.sin(rotation)) + vel.y * Math.cos(rotation);
        const rightVel = vel.x * Math.cos(rotation) + vel.y * Math.sin(rotation);

        // Normalize using tanh to squash large values to -1..1, then map to 0..1
        // Scaling factor 0.05 implies typical speeds of ~20-50 are mapped well.
        inputs.push(0.5 + 0.5 * Math.tanh(forwardVel * 0.05));
        inputs.push(0.5 + 0.5 * Math.tanh(rightVel * 0.05));
        inputs.push(0.5 + 0.5 * Math.tanh(angVel * 0.5));

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
        if (!this.isDead) {
            ctx.save();
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
        }


        ctx.save();
        ctx.rotate(this.body.rotation());

        // Triangle
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(-10, -10);
        ctx.lineTo(10, -10);
        ctx.closePath();
        ctx.closePath();

        if (this.isDead) {
            ctx.fillStyle = '#555'; // Dark grey for dead
            ctx.strokeStyle = '#ff0000'; // Red for dead
        } else {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#4facfe';
        }

        ctx.fill();
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Health Bar
        if (!this.isDead) {
            const barWidth = 30;
            const barHeight = 4;
            const healthPct = this.life / this.MAX_LIFE;

            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fillRect(-barWidth / 2, 20, barWidth, barHeight);

            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
            ctx.fillRect(-barWidth / 2, 20, barWidth * healthPct, barHeight);
        }

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
