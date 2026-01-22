

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
    <div id="left-stat">Left Thruster: 0</div>
    <div id="right-stat">Right Thruster: 0</div>
    <div id="vel-stat">Velocity: 0</div>
    <div id="rot-stat">Rotation Power: 0</div>
    <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right</div>
  `;
    document.body.appendChild(hud);

    const leftStat = document.getElementById('left-stat')!;
    const rightStat = document.getElementById('right-stat')!;
    const velStat = document.getElementById('vel-stat')!;
    const rotStat = document.getElementById('rot-stat')!;

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

        // Borders
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 4;
        ctx.strokeRect(-WORLD_SIZE / 2, -WORLD_SIZE / 2, WORLD_SIZE, WORLD_SIZE);
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

        // UI Updates
        leftStat.innerText = `Left Thruster: ${Math.round((leftThruster / THRUSTER_MAX) * 100)}%`;
        rightStat.innerText = `Right Thruster: ${Math.round((rightThruster / THRUSTER_MAX) * 100)}%`;
        const vel = body.linvel();
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        velStat.innerText = `Velocity: ${Math.round(speed)} | Angle: ${Math.round(Math.atan2(vel.y, vel.x) * 180 / Math.PI)}°`;
        rotStat.innerText = `Rotation Power: ${body.angvel().toFixed(2)}`;
    }

    function loop() {
        updateThrusters();
        world.step();
        wrapWorld();
        draw();
        requestAnimationFrame(loop);
    }

    loop();
}

run().catch(console.error);
