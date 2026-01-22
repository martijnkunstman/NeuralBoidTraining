(async ()=>{
    (function() {
        const t = document.createElement("link").relList;
        if (t && t.supports && t.supports("modulepreload")) return;
        for (const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);
        new MutationObserver((s)=>{
            for (const o of s)if (o.type === "childList") for (const n of o.addedNodes)n.tagName === "LINK" && n.rel === "modulepreload" && i(n);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function e(s) {
            const o = {};
            return s.integrity && (o.integrity = s.integrity), s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? o.credentials = "include" : s.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
        }
        function i(s) {
            if (s.ep) return;
            s.ep = !0;
            const o = e(s);
            fetch(s.href, o);
        }
    })();
    const S = "modulepreload", w = function(a, t) {
        return new URL(a, t).href;
    }, p = {}, T = function(t, e, i) {
        let s = Promise.resolve();
        if (e && e.length > 0) {
            const n = document.getElementsByTagName("link"), r = document.querySelector("meta[property=csp-nonce]"), h = r?.nonce || r?.getAttribute("nonce");
            s = Promise.allSettled(e.map((l)=>{
                if (l = w(l, i), l in p) return;
                p[l] = !0;
                const c = l.endsWith(".css"), y = c ? '[rel="stylesheet"]' : "";
                if (!!i) for(let d = n.length - 1; d >= 0; d--){
                    const u = n[d];
                    if (u.href === l && (!c || u.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${l}"]${y}`)) return;
                const f = document.createElement("link");
                if (f.rel = c ? "stylesheet" : S, c || (f.as = "script"), f.crossOrigin = "", f.href = l, h && f.setAttribute("nonce", h), document.head.appendChild(f), c) return new Promise((d, u)=>{
                    f.addEventListener("load", d), f.addEventListener("error", ()=>u(new Error(`Unable to preload CSS for ${l}`)));
                });
            }));
        }
        function o(n) {
            const r = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (r.payload = n, window.dispatchEvent(r), !r.defaultPrevented) throw n;
        }
        return s.then((n)=>{
            for (const r of n || [])r.status === "rejected" && o(r.reason);
            return t().catch(o);
        });
    };
    class x {
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
    class v {
        size;
        world;
        constructor(t, e = 2e3){
            this.size = e;
            const i = {
                x: 0,
                y: 0
            };
            this.world = new t.World(i);
        }
        getPhysicsWorld() {
            return this.world;
        }
        step() {
            this.world.step();
        }
        wrapPosition(t) {
            let { x: e, y: i } = t.translation();
            const s = this.size / 2;
            let o = !1;
            e > s ? (e -= this.size, o = !0) : e < -s && (e += this.size, o = !0), i > s ? (i -= this.size, o = !0) : i < -s && (i += this.size, o = !0), o && t.setTranslation({
                x: e,
                y: i
            }, !0);
        }
    }
    class R {
        body;
        leftThruster = 0;
        rightThruster = 0;
        THRUSTER_MAX = 500;
        THRUSTER_STEP;
        constructor(t, e){
            this.THRUSTER_STEP = this.THRUSTER_MAX / 10;
            const i = t.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(.5).setAngularDamping(2);
            this.body = e.createRigidBody(i);
            const s = new Float32Array([
                0,
                15,
                -10,
                -10,
                10,
                -10
            ]), o = t.ColliderDesc.convexHull(s);
            e.createCollider(o, this.body);
        }
        updateThrusters(t, e, i, s) {
            t && (this.leftThruster = Math.min(this.leftThruster + this.THRUSTER_STEP, this.THRUSTER_MAX)), e && (this.leftThruster = Math.max(this.leftThruster - this.THRUSTER_STEP, 0)), i && (this.rightThruster = Math.min(this.rightThruster + this.THRUSTER_STEP, this.THRUSTER_MAX)), s && (this.rightThruster = Math.max(this.rightThruster - this.THRUSTER_STEP, 0)), this.applyThrusterForces();
        }
        applyThrusterForces() {
            const t = this.body.rotation(), e = -Math.sin(t), i = Math.cos(t), s = {
                x: -10,
                y: -10
            }, o = {
                x: 10,
                y: -10
            }, n = (h, l)=>({
                    x: h.x * Math.cos(l) - h.y * Math.sin(l),
                    y: h.x * Math.sin(l) + h.y * Math.cos(l)
                }), r = this.body.translation();
            if (this.leftThruster > 0) {
                const h = n(s, t);
                this.body.applyImpulseAtPoint({
                    x: e * this.leftThruster * .1,
                    y: i * this.leftThruster * .1
                }, {
                    x: r.x + h.x,
                    y: r.y + h.y
                }, !0);
            }
            if (this.rightThruster > 0) {
                const h = n(o, t);
                this.body.applyImpulseAtPoint({
                    x: e * this.rightThruster * .1,
                    y: i * this.rightThruster * .1
                }, {
                    x: r.x + h.x,
                    y: r.y + h.y
                }, !0);
            }
        }
        draw(t) {
            t.save(), t.rotate(this.body.rotation()), t.beginPath(), t.moveTo(0, 15), t.lineTo(-10, -10), t.lineTo(10, -10), t.closePath(), t.fillStyle = "#fff", t.fill(), t.strokeStyle = "#4facfe", t.lineWidth = 2, t.stroke();
            const e = 30;
            if (this.leftThruster > 0) {
                const i = this.leftThruster / this.THRUSTER_MAX * e;
                t.beginPath(), t.moveTo(-7, -10), t.lineTo(-7, -10 - i), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
            }
            if (this.rightThruster > 0) {
                const i = this.rightThruster / this.THRUSTER_MAX * e;
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
    class P {
        keys = {};
        constructor(){
            window.addEventListener("keydown", (t)=>this.keys[t.key.toLowerCase()] = !0), window.addEventListener("keyup", (t)=>this.keys[t.key.toLowerCase()] = !1);
        }
        isKeyPressed(t) {
            return this.keys[t.toLowerCase()] || !1;
        }
    }
    class b {
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
    class E {
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
        drawWorld(t, e, i) {
            this.ctx.save(), this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2), this.ctx.scale(1, -1), this.ctx.save(), this.ctx.translate(-t.x, -t.y), this.drawGrid(), this.drawBorders(), e.forEach((s)=>this.drawItemWithGhosts(s, t.x, t.y)), i.forEach((s)=>this.drawItemWithGhosts(s, t.x, t.y)), this.ctx.restore(), this.ctx.restore();
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
        drawItemWithGhosts(t, e, i) {
            const s = Math.max(this.canvas.width, this.canvas.height) / 2 + 100, o = this.worldSize / 2;
            t.draw(this.ctx);
            const n = [];
            t.x - e < -o + s && n.push({
                dx: this.worldSize,
                dy: 0
            }), t.x - e > o - s && n.push({
                dx: -this.worldSize,
                dy: 0
            }), t.y - i < -o + s && n.push({
                dx: 0,
                dy: this.worldSize
            }), t.y - i > o - s && n.push({
                dx: 0,
                dy: -this.worldSize
            });
            for (const r of n)this.ctx.save(), this.ctx.translate(r.dx, r.dy), t.draw(this.ctx), this.ctx.restore();
        }
        drawBoidAtCenter(t) {
            this.ctx.save(), this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2), this.ctx.scale(1, -1), t(this.ctx), this.ctx.restore();
        }
        drawMinimap(t, e, i, s) {
            const r = this.canvas.width - 200 - 20, h = 20;
            this.ctx.save(), this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)", this.ctx.fillRect(r, h, 200, 200), this.ctx.strokeStyle = "#4facfe", this.ctx.lineWidth = 2, this.ctx.strokeRect(r, h, 200, 200);
            const l = 200 / this.worldSize, c = (d)=>(d + this.worldSize / 2) * l, y = (d)=>(this.worldSize / 2 - d) * l;
            this.ctx.strokeStyle = "rgba(79, 172, 254, 0.5)", this.ctx.lineWidth = 1, this.ctx.strokeRect(r, h, 200, 200), this.ctx.fillStyle = "#00ff88", i.forEach((d)=>{
                const u = r + c(d.x), g = h + y(d.y);
                this.ctx.fillRect(u - 1.5, g - 1.5, 3, 3);
            }), this.ctx.fillStyle = "#ff4444", s.forEach((d)=>{
                const u = r + c(d.x), g = h + y(d.y);
                this.ctx.fillRect(u - 1.5, g - 1.5, 3, 3);
            });
            const m = r + c(t), f = h + y(e);
            this.ctx.fillStyle = "#ffffff", this.ctx.beginPath(), this.ctx.arc(m, f, 4, 0, Math.PI * 2), this.ctx.fill(), this.ctx.strokeStyle = "#4facfe", this.ctx.lineWidth = 2, this.ctx.stroke(), this.ctx.restore();
        }
    }
    class M {
        element;
        leftStat;
        rightStat;
        velStat;
        rotStat;
        foodStat;
        poisonStat;
        collectedStat;
        constructor(t, e, i){
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
            <div id="poison-stat">Poison: ${i}</div>
            <div id="collected-stat">Collected: 0 food, 0 poison</div>
            <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right</div>
        `, document.body.appendChild(this.element), this.leftStat = document.getElementById("left-stat"), this.rightStat = document.getElementById("right-stat"), this.velStat = document.getElementById("vel-stat"), this.rotStat = document.getElementById("rot-stat"), this.foodStat = document.getElementById("food-stat"), this.poisonStat = document.getElementById("poison-stat"), this.collectedStat = document.getElementById("collected-stat");
        }
        updateStats(t, e, i, s, o, n, r, h) {
            this.leftStat.innerText = `Left Thruster: ${Math.round(t)}%`, this.rightStat.innerText = `Right Thruster: ${Math.round(e)}%`;
            const l = Math.sqrt(i.x * i.x + i.y * i.y), c = Math.round(Math.atan2(i.y, i.x) * 180 / Math.PI);
            this.velStat.innerText = `Velocity: ${Math.round(l)} | Angle: ${c}°`, this.rotStat.innerText = `Rotation Power: ${s.toFixed(2)}`, this.foodStat.innerText = `Food: ${o}`, this.poisonStat.innerText = `Poison: ${n}`, this.collectedStat.innerText = `Collected: ${r} food, ${h} poison`;
        }
    }
    class z {
        x;
        y;
        radius;
        color;
        constructor(t, e, i = 8){
            this.x = t, this.y = e, this.radius = i, this.color = "#00ff88";
        }
        isColliding(t, e, i) {
            const s = this.x - t, o = this.y - e;
            return Math.sqrt(s * s + o * o) < this.radius + i;
        }
        draw(t) {
            t.beginPath(), t.arc(this.x, this.y, this.radius, 0, Math.PI * 2), t.fillStyle = this.color, t.fill(), t.strokeStyle = "#00ff88", t.lineWidth = 2, t.stroke();
        }
    }
    class C {
        x;
        y;
        radius;
        color;
        constructor(t, e, i = 8){
            this.x = t, this.y = e, this.radius = i, this.color = "#ff4444";
        }
        isColliding(t, e, i) {
            const s = this.x - t, o = this.y - e;
            return Math.sqrt(s * s + o * o) < this.radius + i;
        }
        draw(t) {
            t.beginPath(), t.arc(this.x, this.y, this.radius, 0, Math.PI * 2), t.fillStyle = this.color, t.fill(), t.strokeStyle = "#ff0000", t.lineWidth = 2, t.stroke();
        }
    }
    class I {
        foodCollected = 0;
        poisonCollected = 0;
        collisionRadius;
        worldSize;
        rng;
        constructor(t, e, i){
            this.worldSize = t, this.collisionRadius = e, this.rng = i;
        }
        checkCollisions(t, e, i, s) {
            for(let o = i.length - 1; o >= 0; o--)i[o].isColliding(t, e, this.collisionRadius) && (i.splice(o, 1), i.push(this.spawnFood()), this.foodCollected++);
            for(let o = s.length - 1; o >= 0; o--)s[o].isColliding(t, e, this.collisionRadius) && (s.splice(o, 1), s.push(this.spawnPoison()), this.poisonCollected++);
        }
        spawnFood() {
            const t = this.worldSize / 2, e = this.rng.randomRange(-t + 50, t - 50), i = this.rng.randomRange(-t + 50, t - 50);
            return new z(e, i);
        }
        spawnPoison() {
            const t = this.worldSize / 2, e = this.rng.randomRange(-t + 50, t - 50), i = this.rng.randomRange(-t + 50, t - 50);
            return new C(e, i);
        }
        getFoodCollected() {
            return this.foodCollected;
        }
        getPoisonCollected() {
            return this.poisonCollected;
        }
    }
    class O {
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
            this.rng = new x(e), console.log("World Seed:", e), this.world = new v(t, this.WORLD_SIZE), this.boid = new R(t, this.world.getPhysicsWorld()), this.inputManager = new P, this.camera = new b, this.renderer = new E(this.WORLD_SIZE), this.hud = new M(e, this.FOOD_COUNT, this.POISON_COUNT), this.collisionManager = new I(this.WORLD_SIZE, this.BOID_COLLISION_RADIUS, this.rng), this.initializeItems();
        }
        initializeItems() {
            for(let t = 0; t < this.FOOD_COUNT; t++)this.foods.push(this.collisionManager.spawnFood());
            for(let t = 0; t < this.POISON_COUNT; t++)this.poisons.push(this.collisionManager.spawnPoison());
        }
        update() {
            this.boid.updateThrusters(this.inputManager.isKeyPressed("q"), this.inputManager.isKeyPressed("a"), this.inputManager.isKeyPressed("w"), this.inputManager.isKeyPressed("s")), this.world.step(), this.world.wrapPosition(this.boid.getBody());
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
    async function _() {
        console.log("Starting boid simulation...");
        const a = await T(()=>import("./rapier-D9GItMpu.js"), [], import.meta.url);
        a.init && await a.init(), console.log("RAPIER module ready"), new O(a).start();
    }
    _().catch(console.error);
})();
