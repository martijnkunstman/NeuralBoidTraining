import type RAPIER from '@dimforge/rapier2d-compat';

export class World {
    public readonly size: number;
    private world: RAPIER.World;

    constructor(RAPIER: typeof import('@dimforge/rapier2d-compat'), size: number = 2000) {
        this.size = size;
        const gravity = { x: 0.0, y: 0.0 };
        this.world = new RAPIER.World(gravity);
    }

    getPhysicsWorld(): RAPIER.World {
        return this.world;
    }

    step(): void {
        this.world.step();
    }

    wrapPosition(body: RAPIER.RigidBody): void {
        let { x, y } = body.translation();
        const half = this.size / 2;
        let wrapped = false;

        if (x > half) { x -= this.size; wrapped = true; }
        else if (x < -half) { x += this.size; wrapped = true; }

        if (y > half) { y -= this.size; wrapped = true; }
        else if (y < -half) { y += this.size; wrapped = true; }

        if (wrapped) {
            body.setTranslation({ x, y }, true);
        }
    }
}
