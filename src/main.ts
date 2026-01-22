import { SeededRandom } from './SeededRandom';
import { Food } from './Food';
import { Poison } from './Poison';

async function run() {
    console.log('Starting boid simulation...');

    // Dynamic import is the most compatible way for Rapier in Vite
    const RAPIER = await import('@dimforge/rapier2d-compat');

    // Check if we need to call init.
    if ((RAPIER as any).init) {
        await (RAPIER as any).init();
    }

    console.log('RAPIER module ready');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    document.getElementById('app')!.appendChild(canvas);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Physics Setup
    const gravity = { x: 0.0, y: 0.0 };
    const world = new RAPIER.World(gravity);

    // Random Seed System
    const SEED = Date.now();
    const rng = new SeededRandom(SEED);
    console.log('World Seed:', SEED);

    // Boid Parameters
    const WORLD_SIZE = 2000;
    const THRUSTER_MAX = 500.0;
    const THRUSTER_STEP = THRUSTER_MAX / 10;

    // Boid Creation
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0, 0)
        .setLinearDamping(0.5)
        .setAngularDamping(2.0);
    const body = world.createRigidBody(bodyDesc);

    // Triangle Shape (pointing up)
    // Top: (0, 15), Bottom-Left: (-10, -10), Bottom-Right: (10, -10)
    const vertices = new Float32Array([0, 15, -10, -10, 10, -10]);
    const colliderDesc = RAPIER.ColliderDesc.convexHull(vertices)!;
    world.createCollider(colliderDesc, body);

    // Food and Poison System
    const foods: Food[] = [];
    const poisons: Poison[] = [];
    const FOOD_COUNT = 40;
    const POISON_COUNT = 15;
    const BOID_COLLISION_RADIUS = 15; // Approximate boid size

    function spawnFood(): Food {
        const half = WORLD_SIZE / 2;
        const x = rng.randomRange(-half + 50, half - 50);
        const y = rng.randomRange(-half + 50, half - 50);
        return new Food(x, y);
    }

    function spawnPoison(): Poison {
        const half = WORLD_SIZE / 2;
        const x = rng.randomRange(-half + 50, half - 50);
        const y = rng.randomRange(-half + 50, half - 50);
        return new Poison(x, y);
    }

    // Initialize food and poison
    for (let i = 0; i < FOOD_COUNT; i++) {
        foods.push(spawnFood());
    }
    for (let i = 0; i < POISON_COUNT; i++) {
        poisons.push(spawnPoison());
    }

    let foodCollected = 0;
    let poisonCollected = 0;

    // Input State
    const keys: Record<string, boolean> = {};
    window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

    let leftThruster = 0;
    let rightThruster = 0;

    // HUD and Stats
    const hud = document.createElement('div');
    hud.style.position = 'absolute';
    hud.style.top = '20px';
    hud.style.left = '20px';
    hud.style.padding = '20px';
    hud.style.background = 'rgba(0, 0, 0, 0.7)';
    hud.style.borderRadius = '12px';
    hud.style.backdropFilter = 'blur(10px)';
    hud.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    hud.style.pointerEvents = 'none';
    hud.style.fontSize = '14px';
    hud.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold; color: #4facfe;">BOID SYSTEMS</div>
    <div id="seed-stat">Seed: ${SEED}</div>
    <div style="margin-top: 8px; opacity: 0.7;">---</div>
    <div id="left-stat">Left Thruster: 0</div>
    <div id="right-stat">Right Thruster: 0</div>
    <div id="vel-stat">Velocity: 0</div>
    <div id="rot-stat">Rotation Power: 0</div>
    <div style="margin-top: 8px; opacity: 0.7;">---</div>
    <div id="food-stat">Food: ${FOOD_COUNT}</div>
    <div id="poison-stat">Poison: ${POISON_COUNT}</div>
    <div id="collected-stat">Collected: 0 food, 0 poison</div>
    <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right</div>
  `;
    document.body.appendChild(hud);

    const leftStat = document.getElementById('left-stat')!;
    const rightStat = document.getElementById('right-stat')!;
    const velStat = document.getElementById('vel-stat')!;
    const rotStat = document.getElementById('rot-stat')!;
    const foodStat = document.getElementById('food-stat')!;
    const poisonStat = document.getElementById('poison-stat')!;
    const collectedStat = document.getElementById('collected-stat')!;

    function updateThrusters() {
        // Left Thruster: Q (up), A (down)
        if (keys['q']) leftThruster = Math.min(leftThruster + THRUSTER_STEP, THRUSTER_MAX);
        if (keys['a']) leftThruster = Math.max(leftThruster - THRUSTER_STEP, 0);

        // Right Thruster: W (up), S (down)
        if (keys['w']) rightThruster = Math.min(rightThruster + THRUSTER_STEP, THRUSTER_MAX);
        if (keys['s']) rightThruster = Math.max(rightThruster - THRUSTER_STEP, 0);

        const rotation = body.rotation();
        // Pointing Up (Y+) in Rapier means 0 rotation.
        const fx = -Math.sin(rotation);
        const fy = Math.cos(rotation);

        const bl_local = { x: -10, y: -10 };
        const br_local = { x: 10, y: -10 };

        const rotate = (p: { x: number, y: number }, rad: number) => ({
            x: p.x * Math.cos(rad) - p.y * Math.sin(rad),
            y: p.x * Math.sin(rad) + p.y * Math.cos(rad)
        });

        const pos = body.translation();

        // Applied as force for "realistic" behavior
        if (leftThruster > 0) {
            const p = rotate(bl_local, rotation);
            body.applyImpulseAtPoint(
                { x: fx * leftThruster * 0.1, y: fy * leftThruster * 0.1 },
                { x: pos.x + p.x, y: pos.y + p.y },
                true
            );
        }

        if (rightThruster > 0) {
            const p = rotate(br_local, rotation);
            body.applyImpulseAtPoint(
                { x: fx * rightThruster * 0.1, y: fy * rightThruster * 0.1 },
                { x: pos.x + p.x, y: pos.y + p.y },
                true
            );
        }
    }

    function wrapWorld() {
        let { x, y } = body.translation();
        const half = WORLD_SIZE / 2;
        let wrapped = false;

        if (x > half) { x -= WORLD_SIZE; wrapped = true; }
        else if (x < -half) { x += WORLD_SIZE; wrapped = true; }

        if (y > half) { y -= WORLD_SIZE; wrapped = true; }
        else if (y < -half) { y += WORLD_SIZE; wrapped = true; }

        if (wrapped) {
            body.setTranslation({ x, y }, true);
        }
    }

    function checkCollisions() {
        const pos = body.translation();

        // Check food collisions
        for (let i = foods.length - 1; i >= 0; i--) {
            if (foods[i].isColliding(pos.x, pos.y, BOID_COLLISION_RADIUS)) {
                foods.splice(i, 1);
                foods.push(spawnFood());
                foodCollected++;
            }
        }

        // Check poison collisions
        for (let i = poisons.length - 1; i >= 0; i--) {
            if (poisons[i].isColliding(pos.x, pos.y, BOID_COLLISION_RADIUS)) {
                poisons.splice(i, 1);
                poisons.push(spawnPoison());
                poisonCollected++;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const camX = body.translation().x;
        const camY = body.translation().y;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(1, -1); // Flip Y to match Rapier's Y-up

        // Draw World Objects
        ctx.save();
        ctx.translate(-camX, -camY);

        // Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = -WORLD_SIZE / 2; i <= WORLD_SIZE / 2; i += 100) {
            ctx.beginPath();
            ctx.moveTo(i, -WORLD_SIZE / 2);
            ctx.lineTo(i, WORLD_SIZE / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-WORLD_SIZE / 2, i);
            ctx.lineTo(WORLD_SIZE / 2, i);
            ctx.stroke();
        }

        // Enhanced Borders
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 6;
        ctx.strokeRect(-WORLD_SIZE / 2, -WORLD_SIZE / 2, WORLD_SIZE, WORLD_SIZE);

        // Corner markers
        const cornerSize = 20;
        ctx.fillStyle = '#4facfe';
        const half = WORLD_SIZE / 2;
        ctx.fillRect(-half - 3, -half - 3, cornerSize, cornerSize);
        ctx.fillRect(half - cornerSize + 3, -half - 3, cornerSize, cornerSize);
        ctx.fillRect(-half - 3, half - cornerSize + 3, cornerSize, cornerSize);
        ctx.fillRect(half - cornerSize + 3, half - cornerSize + 3, cornerSize, cornerSize);

        // Helper function to draw items with wrapping
        const drawItemWithGhosts = (item: Food | Poison, camX: number, camY: number) => {
            const viewDist = Math.max(canvas.width, canvas.height) / 2 + 100;

            // Draw main item
            item.draw(ctx);

            // Check if we need to draw ghost copies
            const offsets = [];
            if (item.x - camX < -half + viewDist) offsets.push({ dx: WORLD_SIZE, dy: 0 });
            if (item.x - camX > half - viewDist) offsets.push({ dx: -WORLD_SIZE, dy: 0 });
            if (item.y - camY < -half + viewDist) offsets.push({ dx: 0, dy: WORLD_SIZE });
            if (item.y - camY > half - viewDist) offsets.push({ dx: 0, dy: -WORLD_SIZE });

            // Draw ghost copies
            for (const offset of offsets) {
                ctx.save();
                ctx.translate(offset.dx, offset.dy);
                item.draw(ctx);
                ctx.restore();
            }
        };

        // Draw Food
        foods.forEach(food => drawItemWithGhosts(food, camX, camY));

        // Draw Poison
        poisons.forEach(poison => drawItemWithGhosts(poison, camX, camY));

        ctx.restore();

        // Draw Boid (at center)
        ctx.save();
        ctx.rotate(body.rotation());

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
        if (leftThruster > 0) {
            const h = (leftThruster / THRUSTER_MAX) * tLen;
            ctx.beginPath();
            ctx.moveTo(-7, -10);
            ctx.lineTo(-7, -10 - h);
            ctx.strokeStyle = '#ff4b2b';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        if (rightThruster > 0) {
            const h = (rightThruster / THRUSTER_MAX) * tLen;
            ctx.beginPath();
            ctx.moveTo(7, -10);
            ctx.lineTo(7, -10 - h);
            ctx.strokeStyle = '#ff4b2b';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        ctx.restore();
        ctx.restore();

        // Minimap
        const minimapSize = 200;
        const minimapPadding = 20;
        const minimapX = canvas.width - minimapSize - minimapPadding;
        const minimapY = minimapPadding;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform

        // Minimap background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);

        // Minimap border
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 2;
        ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

        // Scale factor for minimap
        const scale = minimapSize / WORLD_SIZE;
        const centerMinimapX = (coord: number) => (coord + WORLD_SIZE / 2) * scale;
        const centerMinimapY = (coord: number) => (WORLD_SIZE / 2 - coord) * scale; // Flip Y-axis

        // Draw world border on minimap
        ctx.strokeStyle = 'rgba(79, 172, 254, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

        // Draw food on minimap
        ctx.fillStyle = '#00ff88';
        foods.forEach(food => {
            const mx = minimapX + centerMinimapX(food.x);
            const my = minimapY + centerMinimapY(food.y);
            ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
        });

        // Draw poison on minimap
        ctx.fillStyle = '#ff4444';
        poisons.forEach(poison => {
            const mx = minimapX + centerMinimapX(poison.x);
            const my = minimapY + centerMinimapY(poison.y);
            ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
        });

        // Draw boid on minimap
        const boidPos = body.translation();
        const boidX = minimapX + centerMinimapX(boidPos.x);
        const boidY = minimapY + centerMinimapY(boidPos.y);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(boidX, boidY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // UI Updates
        leftStat.innerText = `Left Thruster: ${Math.round((leftThruster / THRUSTER_MAX) * 100)}%`;
        rightStat.innerText = `Right Thruster: ${Math.round((rightThruster / THRUSTER_MAX) * 100)}%`;
        const vel = body.linvel();
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        velStat.innerText = `Velocity: ${Math.round(speed)} | Angle: ${Math.round(Math.atan2(vel.y, vel.x) * 180 / Math.PI)}°`;
        rotStat.innerText = `Rotation Power: ${body.angvel().toFixed(2)}`;
        foodStat.innerText = `Food: ${foods.length}`;
        poisonStat.innerText = `Poison: ${poisons.length}`;
        collectedStat.innerText = `Collected: ${foodCollected} food, ${poisonCollected} poison`;
    }

    function loop() {
        updateThrusters();
        world.step();
        wrapWorld();
        checkCollisions();
        draw();
        requestAnimationFrame(loop);
    }

    loop();
}

run().catch(console.error);
