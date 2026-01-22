(async ()=>{
    (function() {
        const t = document.createElement("link").relList;
        if (t && t.supports && t.supports("modulepreload")) return;
        for (const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);
        new MutationObserver((i)=>{
            for (const o of i)if (o.type === "childList") for (const r of o.addedNodes)r.tagName === "LINK" && r.rel === "modulepreload" && s(r);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function e(i) {
            const o = {};
            return i.integrity && (o.integrity = i.integrity), i.referrerPolicy && (o.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? o.credentials = "include" : i.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
        }
        function s(i) {
            if (i.ep) return;
            i.ep = !0;
            const o = e(i);
            fetch(i.href, o);
        }
    })();
    const x = "modulepreload", R = function(f, t) {
        return new URL(f, t).href;
    }, w = {}, E = function(t, e, s) {
        let i = Promise.resolve();
        if (e && e.length > 0) {
            const r = document.getElementsByTagName("link"), n = document.querySelector("meta[property=csp-nonce]"), h = n?.nonce || n?.getAttribute("nonce");
            i = Promise.allSettled(e.map((a)=>{
                if (a = R(a, s), a in w) return;
                w[a] = !0;
                const c = a.endsWith(".css"), y = c ? '[rel="stylesheet"]' : "";
                if (!!s) for(let l = r.length - 1; l >= 0; l--){
                    const d = r[l];
                    if (d.href === a && (!c || d.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${a}"]${y}`)) return;
                const u = document.createElement("link");
                if (u.rel = c ? "stylesheet" : x, c || (u.as = "script"), u.crossOrigin = "", u.href = a, h && u.setAttribute("nonce", h), document.head.appendChild(u), c) return new Promise((l, d)=>{
                    u.addEventListener("load", l), u.addEventListener("error", ()=>d(new Error(`Unable to preload CSS for ${a}`)));
                });
            }));
        }
        function o(r) {
            const n = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (n.payload = r, window.dispatchEvent(n), !n.defaultPrevented) throw r;
        }
        return i.then((r)=>{
            for (const n of r || [])n.status === "rejected" && o(n.reason);
            return t().catch(o);
        });
    };
    class v {
        seed;
        a = 1664525;
        c = 1013904223;
        m = 2 ** 32;
        constructor(t = Date.now()){
            this.seed = t % this.m;
        }
        setSeed(t) {
            this.seed = t % this.m;
        }
        getSeed() {
            return this.seed;
        }
        random() {
            return this.seed = (this.a * this.seed + this.c) % this.m, this.seed / this.m;
        }
        randomRange(t, e) {
            return t + this.random() * (e - t);
        }
        randomInt(t, e) {
            return Math.floor(this.randomRange(t, e + 1));
        }
    }
    class P {
        size;
        world;
        constructor(t, e = 2e3){
            this.size = e;
            const s = {
                x: 0,
                y: 0
            };
            this.world = new t.World(s);
        }
        getPhysicsWorld() {
            return this.world;
        }
        step() {
            this.world.step();
        }
        wrapPosition(t) {
            let { x: e, y: s } = t.translation();
            const i = this.size / 2;
            let o = !1;
            e > i ? (e -= this.size, o = !0) : e < -i && (e += this.size, o = !0), s > i ? (s -= this.size, o = !0) : s < -i && (s += this.size, o = !0), o && t.setTranslation({
                x: e,
                y: s
            }, !0);
        }
    }
    class b {
        body;
        leftThruster = 0;
        rightThruster = 0;
        THRUSTER_MAX = 500;
        THRUSTER_STEP;
        sensors = [];
        SENSOR_COUNT = 9;
        SENSOR_ANGLE_SPREAD = Math.PI * .5;
        SENSOR_LENGTH = 400;
        constructor(t, e){
            this.THRUSTER_STEP = this.THRUSTER_MAX / 10;
            for(let r = 0; r < this.SENSOR_COUNT; r++){
                const n = -this.SENSOR_ANGLE_SPREAD / 2 + r * this.SENSOR_ANGLE_SPREAD / (this.SENSOR_COUNT - 1);
                this.sensors.push({
                    angle: n,
                    length: this.SENSOR_LENGTH,
                    reading: 1,
                    detectedType: "NONE",
                    endX: 0,
                    endY: 0
                });
            }
            const s = t.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(.5).setAngularDamping(2);
            this.body = e.createRigidBody(s);
            const i = new Float32Array([
                0,
                15,
                -10,
                -10,
                10,
                -10
            ]), o = t.ColliderDesc.convexHull(i);
            e.createCollider(o, this.body);
        }
        updateSensors(t, e, s) {
            const i = this.body.translation(), o = this.body.rotation();
            for (const r of this.sensors){
                const n = o + Math.PI / 2 + r.angle, h = Math.cos(n), a = Math.sin(n), c = i.x, y = i.y;
                let p = this.SENSOR_LENGTH, u = "NONE";
                for (const l of t){
                    let d = l.x - c, g = l.y - y;
                    d > s / 2 && (d -= s), d < -s / 2 && (d += s), g > s / 2 && (g -= s), g < -s / 2 && (g += s);
                    const S = c + d, T = y + g, m = this.rayCircleIntersect(c, y, h, a, S, T, l.radius);
                    m !== null && m < p && (p = m, u = "FOOD");
                }
                for (const l of e){
                    let d = l.x - c, g = l.y - y;
                    d > s / 2 && (d -= s), d < -s / 2 && (d += s), g > s / 2 && (g -= s), g < -s / 2 && (g += s);
                    const S = c + d, T = y + g, m = this.rayCircleIntersect(c, y, h, a, S, T, l.radius);
                    m !== null && m < p && (p = m, u = "POISON");
                }
                r.reading = 1 - p / this.SENSOR_LENGTH, r.detectedType = u, r.endX = c + h * p, r.endY = y + a * p;
            }
        }
        rayCircleIntersect(t, e, s, i, o, r, n) {
            const h = o - t, a = r - e, c = h * s + a * i;
            let y = t + s * c, p = e + i * c;
            const u = (y - o) * (y - o) + (p - r) * (p - r);
            if (u > n * n) return null;
            const l = Math.sqrt(n * n - u), d = c - l;
            return d < 0 || d > this.SENSOR_LENGTH ? null : d;
        }
        updateThrusters(t, e, s, i) {
            t && (this.leftThruster = Math.min(this.leftThruster + this.THRUSTER_STEP, this.THRUSTER_MAX)), e && (this.leftThruster = Math.max(this.leftThruster - this.THRUSTER_STEP, 0)), s && (this.rightThruster = Math.min(this.rightThruster + this.THRUSTER_STEP, this.THRUSTER_MAX)), i && (this.rightThruster = Math.max(this.rightThruster - this.THRUSTER_STEP, 0)), this.applyThrusterForces();
        }
        applyThrusterForces() {
            const t = this.body.rotation(), e = -Math.sin(t), s = Math.cos(t), i = {
                x: -10,
                y: -10
            }, o = {
                x: 10,
                y: -10
            }, r = (h, a)=>({
                    x: h.x * Math.cos(a) - h.y * Math.sin(a),
                    y: h.x * Math.sin(a) + h.y * Math.cos(a)
                }), n = this.body.translation();
            if (this.leftThruster > 0) {
                const h = r(i, t);
                this.body.applyImpulseAtPoint({
                    x: e * this.leftThruster * .1,
                    y: s * this.leftThruster * .1
                }, {
                    x: n.x + h.x,
                    y: n.y + h.y
                }, !0);
            }
            if (this.rightThruster > 0) {
                const h = r(o, t);
                this.body.applyImpulseAtPoint({
                    x: e * this.rightThruster * .1,
                    y: s * this.rightThruster * .1
                }, {
                    x: n.x + h.x,
                    y: n.y + h.y
                }, !0);
            }
        }
        draw(t) {
            const e = this.getPosition();
            t.save(), t.lineWidth = 1;
            for (const i of this.sensors)i.detectedType === "FOOD" ? t.strokeStyle = "#00ff00" : i.detectedType === "POISON" ? t.strokeStyle = "#ff0000" : t.strokeStyle = "rgba(200, 200, 200, 0.2)", t.beginPath(), t.moveTo(0, 0), t.lineTo(i.endX - e.x, i.endY - e.y), t.stroke();
            t.restore(), t.save(), t.rotate(this.body.rotation()), t.beginPath(), t.moveTo(0, 15), t.lineTo(-10, -10), t.lineTo(10, -10), t.closePath(), t.fillStyle = "#fff", t.fill(), t.strokeStyle = "#4facfe", t.lineWidth = 2, t.stroke();
            const s = 30;
            if (this.leftThruster > 0) {
                const i = this.leftThruster / this.THRUSTER_MAX * s;
                t.beginPath(), t.moveTo(-7, -10), t.lineTo(-7, -10 - i), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
            }
            if (this.rightThruster > 0) {
                const i = this.rightThruster / this.THRUSTER_MAX * s;
                t.beginPath(), t.moveTo(7, -10), t.lineTo(7, -10 - i), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
            }
            t.restore();
        }
        getBody() {
            return this.body;
        }
        getPosition() {
            return this.body.translation();
        }
        getVelocity() {
            return this.body.linvel();
        }
        getAngularVelocity() {
            return this.body.angvel();
        }
        getLeftThrusterPercent() {
            return this.leftThruster / this.THRUSTER_MAX * 100;
        }
        getRightThrusterPercent() {
            return this.rightThruster / this.THRUSTER_MAX * 100;
        }
    }
    class M {
        keys = {};
        constructor(){
            window.addEventListener("keydown", (t)=>this.keys[t.key.toLowerCase()] = !0), window.addEventListener("keyup", (t)=>this.keys[t.key.toLowerCase()] = !1);
        }
        isKeyPressed(t) {
            return this.keys[t.toLowerCase()] || !1;
        }
    }
    class O {
        x = 0;
        y = 0;
        follow(t, e) {
            this.x = t, this.y = e;
        }
        applyTransform(t, e) {
            t.save(), t.translate(e.width / 2, e.height / 2), t.scale(1, -1), t.translate(-this.x, -this.y);
        }
        resetTransform(t) {
            t.restore();
        }
    }
    class _ {
        canvas;
        ctx;
        worldSize;
        constructor(t){
            this.worldSize = t, this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), document.getElementById("app").appendChild(this.canvas), this.resize(), window.addEventListener("resize", ()=>this.resize());
        }
        resize() {
            this.canvas.width = window.innerWidth, this.canvas.height = window.innerHeight;
        }
        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        drawWorld(t, e, s) {
            this.ctx.save(), this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2), this.ctx.scale(1, -1), this.ctx.save(), this.ctx.translate(-t.x, -t.y), this.drawGrid(), this.drawBorders(), e.forEach((i)=>this.drawItemWithGhosts(i, t.x, t.y)), s.forEach((i)=>this.drawItemWithGhosts(i, t.x, t.y)), this.ctx.restore(), this.ctx.restore();
        }
        drawGrid() {
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.05)", this.ctx.lineWidth = 1;
            for(let t = -this.worldSize / 2; t <= this.worldSize / 2; t += 100)this.ctx.beginPath(), this.ctx.moveTo(t, -this.worldSize / 2), this.ctx.lineTo(t, this.worldSize / 2), this.ctx.stroke(), this.ctx.beginPath(), this.ctx.moveTo(-this.worldSize / 2, t), this.ctx.lineTo(this.worldSize / 2, t), this.ctx.stroke();
        }
        drawBorders() {
            this.ctx.strokeStyle = "#4facfe", this.ctx.lineWidth = 6, this.ctx.strokeRect(-this.worldSize / 2, -this.worldSize / 2, this.worldSize, this.worldSize);
            const t = 20;
            this.ctx.fillStyle = "#4facfe";
            const e = this.worldSize / 2;
            this.ctx.fillRect(-e - 3, -e - 3, t, t), this.ctx.fillRect(e - t + 3, -e - 3, t, t), this.ctx.fillRect(-e - 3, e - t + 3, t, t), this.ctx.fillRect(e - t + 3, e - t + 3, t, t);
        }
        drawItemWithGhosts(t, e, s) {
            const i = Math.max(this.canvas.width, this.canvas.height) / 2 + 100, o = this.worldSize / 2;
            t.draw(this.ctx);
            const r = [];
            t.x - e < -o + i && r.push({
                dx: this.worldSize,
                dy: 0
            }), t.x - e > o - i && r.push({
                dx: -this.worldSize,
                dy: 0
            }), t.y - s < -o + i && r.push({
                dx: 0,
                dy: this.worldSize
            }), t.y - s > o - i && r.push({
                dx: 0,
                dy: -this.worldSize
            });
            for (const n of r)this.ctx.save(), this.ctx.translate(n.dx, n.dy), t.draw(this.ctx), this.ctx.restore();
        }
        drawBoidAtCenter(t) {
            this.ctx.save(), this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2), this.ctx.scale(1, -1), t(this.ctx), this.ctx.restore();
        }
        drawMinimap(t, e, s, i) {
            const n = this.canvas.width - 200 - 20, h = 20;
            this.ctx.save(), this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)", this.ctx.fillRect(n, h, 200, 200), this.ctx.strokeStyle = "#4facfe", this.ctx.lineWidth = 2, this.ctx.strokeRect(n, h, 200, 200);
            const a = 200 / this.worldSize, c = (l)=>(l + this.worldSize / 2) * a, y = (l)=>(this.worldSize / 2 - l) * a;
            this.ctx.strokeStyle = "rgba(79, 172, 254, 0.5)", this.ctx.lineWidth = 1, this.ctx.strokeRect(n, h, 200, 200), this.ctx.fillStyle = "#00ff88", s.forEach((l)=>{
                const d = n + c(l.x), g = h + y(l.y);
                this.ctx.fillRect(d - 1.5, g - 1.5, 3, 3);
            }), this.ctx.fillStyle = "#ff4444", i.forEach((l)=>{
                const d = n + c(l.x), g = h + y(l.y);
                this.ctx.fillRect(d - 1.5, g - 1.5, 3, 3);
            });
            const p = n + c(t), u = h + y(e);
            this.ctx.fillStyle = "#ffffff", this.ctx.beginPath(), this.ctx.arc(p, u, 4, 0, Math.PI * 2), this.ctx.fill(), this.ctx.strokeStyle = "#4facfe", this.ctx.lineWidth = 2, this.ctx.stroke(), this.ctx.restore();
        }
    }
    class C {
        element;
        leftStat;
        rightStat;
        velStat;
        rotStat;
        foodStat;
        poisonStat;
        collectedStat;
        constructor(t, e, s){
            this.element = document.createElement("div"), this.element.style.position = "absolute", this.element.style.top = "20px", this.element.style.left = "20px", this.element.style.padding = "20px", this.element.style.background = "rgba(0, 0, 0, 0.7)", this.element.style.borderRadius = "12px", this.element.style.backdropFilter = "blur(10px)", this.element.style.border = "1px solid rgba(255, 255, 255, 0.1)", this.element.style.pointerEvents = "none", this.element.style.fontSize = "14px", this.element.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #4facfe;">BOID SYSTEMS</div>
            <div id="seed-stat">Seed: ${t}</div>
            <div style="margin-top: 8px; opacity: 0.7;">---</div>
            <div id="left-stat">Left Thruster: 0</div>
            <div id="right-stat">Right Thruster: 0</div>
            <div id="vel-stat">Velocity: 0</div>
            <div id="rot-stat">Rotation Power: 0</div>
            <div style="margin-top: 8px; opacity: 0.7;">---</div>
            <div id="food-stat">Food: ${e}</div>
            <div id="poison-stat">Poison: ${s}</div>
            <div id="collected-stat">Collected: 0 food, 0 poison</div>
            <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right</div>
        `, document.body.appendChild(this.element), this.leftStat = document.getElementById("left-stat"), this.rightStat = document.getElementById("right-stat"), this.velStat = document.getElementById("vel-stat"), this.rotStat = document.getElementById("rot-stat"), this.foodStat = document.getElementById("food-stat"), this.poisonStat = document.getElementById("poison-stat"), this.collectedStat = document.getElementById("collected-stat");
        }
        updateStats(t, e, s, i, o, r, n, h) {
            this.leftStat.innerText = `Left Thruster: ${Math.round(t)}%`, this.rightStat.innerText = `Right Thruster: ${Math.round(e)}%`;
            const a = Math.sqrt(s.x * s.x + s.y * s.y), c = Math.round(Math.atan2(s.y, s.x) * 180 / Math.PI);
            this.velStat.innerText = `Velocity: ${Math.round(a)} | Angle: ${c}°`, this.rotStat.innerText = `Rotation Power: ${i.toFixed(2)}`, this.foodStat.innerText = `Food: ${o}`, this.poisonStat.innerText = `Poison: ${r}`, this.collectedStat.innerText = `Collected: ${n} food, ${h} poison`;
        }
    }
    class I {
        x;
        y;
        radius;
        color;
        constructor(t, e, s = 16){
            this.x = t, this.y = e, this.radius = s, this.color = "#00ff88";
        }
        isColliding(t, e, s) {
            const i = this.x - t, o = this.y - e;
            return Math.sqrt(i * i + o * o) < this.radius + s;
        }
        draw(t) {
            t.beginPath(), t.arc(this.x, this.y, this.radius, 0, Math.PI * 2), t.fillStyle = this.color, t.fill(), t.strokeStyle = "#00ff88", t.lineWidth = 2, t.stroke();
        }
    }
    class N {
        x;
        y;
        radius;
        color;
        constructor(t, e, s = 16){
            this.x = t, this.y = e, this.radius = s, this.color = "#ff4444";
        }
        isColliding(t, e, s) {
            const i = this.x - t, o = this.y - e;
            return Math.sqrt(i * i + o * o) < this.radius + s;
        }
        draw(t) {
            t.beginPath(), t.arc(this.x, this.y, this.radius, 0, Math.PI * 2), t.fillStyle = this.color, t.fill(), t.strokeStyle = "#ff0000", t.lineWidth = 2, t.stroke();
        }
    }
    class L {
        foodCollected = 0;
        poisonCollected = 0;
        collisionRadius;
        worldSize;
        rng;
        constructor(t, e, s){
            this.worldSize = t, this.collisionRadius = e, this.rng = s;
        }
        checkCollisions(t, e, s, i) {
            for(let o = s.length - 1; o >= 0; o--)s[o].isColliding(t, e, this.collisionRadius) && (s.splice(o, 1), s.push(this.spawnFood()), this.foodCollected++);
            for(let o = i.length - 1; o >= 0; o--)i[o].isColliding(t, e, this.collisionRadius) && (i.splice(o, 1), i.push(this.spawnPoison()), this.poisonCollected++);
        }
        spawnFood() {
            const t = this.worldSize / 2, e = this.rng.randomRange(-t + 50, t - 50), s = this.rng.randomRange(-t + 50, t - 50);
            return new I(e, s);
        }
        spawnPoison() {
            const t = this.worldSize / 2, e = this.rng.randomRange(-t + 50, t - 50), s = this.rng.randomRange(-t + 50, t - 50);
            return new N(e, s);
        }
        getFoodCollected() {
            return this.foodCollected;
        }
        getPoisonCollected() {
            return this.poisonCollected;
        }
    }
    class k {
        world;
        boid;
        inputManager;
        camera;
        renderer;
        hud;
        collisionManager;
        foods = [];
        poisons = [];
        rng;
        WORLD_SIZE = 2e3;
        FOOD_COUNT = 40;
        POISON_COUNT = 15;
        BOID_COLLISION_RADIUS = 15;
        constructor(t){
            const e = Date.now();
            this.rng = new v(e), console.log("World Seed:", e), this.world = new P(t, this.WORLD_SIZE), this.boid = new b(t, this.world.getPhysicsWorld()), this.inputManager = new M, this.camera = new O, this.renderer = new _(this.WORLD_SIZE), this.hud = new C(e, this.FOOD_COUNT, this.POISON_COUNT), this.collisionManager = new L(this.WORLD_SIZE, this.BOID_COLLISION_RADIUS, this.rng), this.initializeItems();
        }
        initializeItems() {
            for(let t = 0; t < this.FOOD_COUNT; t++)this.foods.push(this.collisionManager.spawnFood());
            for(let t = 0; t < this.POISON_COUNT; t++)this.poisons.push(this.collisionManager.spawnPoison());
        }
        update() {
            this.boid.updateThrusters(this.inputManager.isKeyPressed("q"), this.inputManager.isKeyPressed("a"), this.inputManager.isKeyPressed("w"), this.inputManager.isKeyPressed("s")), this.boid.updateSensors(this.foods, this.poisons, this.WORLD_SIZE), this.world.step(), this.world.wrapPosition(this.boid.getBody());
            const t = this.boid.getPosition();
            this.collisionManager.checkCollisions(t.x, t.y, this.foods, this.poisons);
        }
        draw() {
            this.renderer.clear();
            const t = this.boid.getPosition();
            this.camera.follow(t.x, t.y), this.renderer.drawWorld(this.camera, this.foods, this.poisons), this.renderer.drawBoidAtCenter((e)=>this.boid.draw(e)), this.renderer.drawMinimap(t.x, t.y, this.foods, this.poisons), this.hud.updateStats(this.boid.getLeftThrusterPercent(), this.boid.getRightThrusterPercent(), this.boid.getVelocity(), this.boid.getAngularVelocity(), this.foods.length, this.poisons.length, this.collisionManager.getFoodCollected(), this.collisionManager.getPoisonCollected());
        }
        loop = ()=>{
            this.update(), this.draw(), requestAnimationFrame(this.loop);
        };
        start() {
            console.log("Starting game loop..."), this.loop();
        }
    }
    async function z() {
        console.log("Starting boid simulation...");
        const f = await E(()=>import("./rapier-D9GItMpu.js"), [], import.meta.url);
        f.init && await f.init(), console.log("RAPIER module ready"), new k(f).start();
    }
    z().catch(console.error);
})();
