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
    const w = "modulepreload", N = function(g, t) {
        return new URL(g, t).href;
    }, b = {}, O = function(t, e, i) {
        let s = Promise.resolve();
        if (e && e.length > 0) {
            const n = document.getElementsByTagName("link"), r = document.querySelector("meta[property=csp-nonce]"), h = r?.nonce || r?.getAttribute("nonce");
            s = Promise.allSettled(e.map((l)=>{
                if (l = N(l, i), l in b) return;
                b[l] = !0;
                const d = l.endsWith(".css"), p = d ? '[rel="stylesheet"]' : "";
                if (!!i) for(let a = n.length - 1; a >= 0; a--){
                    const c = n[a];
                    if (c.href === l && (!d || c.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${l}"]${p}`)) return;
                const f = document.createElement("link");
                if (f.rel = d ? "stylesheet" : w, d || (f.as = "script"), f.crossOrigin = "", f.href = l, h && f.setAttribute("nonce", h), document.head.appendChild(f), d) return new Promise((a, c)=>{
                    f.addEventListener("load", a), f.addEventListener("error", ()=>c(new Error(`Unable to preload CSS for ${l}`)));
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
    class R {
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
    class S {
        inputNodes;
        hiddenNodes;
        outputNodes;
        weightsIH;
        weightsHO;
        biasH;
        biasO;
        lastInput = [];
        lastHidden = [];
        lastOutput = [];
        constructor(t, e, i){
            this.inputNodes = t, this.hiddenNodes = e, this.outputNodes = i, this.weightsIH = this.createMatrix(this.hiddenNodes, this.inputNodes), this.weightsHO = this.createMatrix(this.outputNodes, this.hiddenNodes), this.biasH = new Array(this.hiddenNodes).fill(0).map((s)=>Math.random() * 2 - 1), this.biasO = new Array(this.outputNodes).fill(0).map((s)=>Math.random() * 2 - 1), this.randomize();
        }
        createMatrix(t, e) {
            return Array.from({
                length: t
            }, ()=>new Array(e).fill(0));
        }
        randomize() {
            for(let t = 0; t < this.hiddenNodes; t++)for(let e = 0; e < this.inputNodes; e++)this.weightsIH[t][e] = Math.random() * 2 - 1;
            for(let t = 0; t < this.outputNodes; t++)for(let e = 0; e < this.hiddenNodes; e++)this.weightsHO[t][e] = Math.random() * 2 - 1;
            this.biasH = this.biasH.map((t)=>Math.random() * 2 - 1), this.biasO = this.biasO.map((t)=>Math.random() * 2 - 1);
        }
        feedForward(t) {
            if (t.length !== this.inputNodes) return console.error(`NeuralNetwork: Expected ${this.inputNodes} inputs, got ${t.length}`), new Array(this.outputNodes).fill(0);
            this.lastInput = [
                ...t
            ];
            let e = new Array(this.hiddenNodes).fill(0);
            for(let s = 0; s < this.hiddenNodes; s++){
                let o = 0;
                for(let n = 0; n < this.inputNodes; n++)o += this.weightsIH[s][n] * t[n];
                o += this.biasH[s], e[s] = this.sigmoid(o);
            }
            this.lastHidden = [
                ...e
            ];
            let i = new Array(this.outputNodes).fill(0);
            for(let s = 0; s < this.outputNodes; s++){
                let o = 0;
                for(let n = 0; n < this.hiddenNodes; n++)o += this.weightsHO[s][n] * e[n];
                o += this.biasO[s], i[s] = this.sigmoid(o);
            }
            return this.lastOutput = [
                ...i
            ], i;
        }
        sigmoid(t) {
            return 1 / (1 + Math.exp(-t));
        }
        copy() {
            const t = new S(this.inputNodes, this.hiddenNodes, this.outputNodes);
            return t.weightsIH = this.weightsIH.map((e)=>[
                    ...e
                ]), t.weightsHO = this.weightsHO.map((e)=>[
                    ...e
                ]), t.biasH = [
                ...this.biasH
            ], t.biasO = [
                ...this.biasO
            ], t;
        }
        mutate(t, e) {
            const i = (s)=>Math.random() < t ? s + (Math.random() * 2 - 1) * e : s;
            this.weightsIH = this.weightsIH.map((s)=>s.map(i)), this.weightsHO = this.weightsHO.map((s)=>s.map(i)), this.biasH = this.biasH.map(i), this.biasO = this.biasO.map(i);
        }
        toJSON() {
            return {
                inputNodes: this.inputNodes,
                hiddenNodes: this.hiddenNodes,
                outputNodes: this.outputNodes,
                weightsIH: this.weightsIH,
                weightsHO: this.weightsHO,
                biasH: this.biasH,
                biasO: this.biasO
            };
        }
        static fromJSON(t) {
            const e = new S(t.inputNodes, t.hiddenNodes, t.outputNodes);
            return e.weightsIH = t.weightsIH, e.weightsHO = t.weightsHO, e.biasH = t.biasH, e.biasO = t.biasO, e;
        }
    }
    class E {
        body;
        leftThruster = 0;
        rightThruster = 0;
        THRUSTER_MAX = 800;
        sensors = [];
        SENSOR_COUNT = 21;
        SENSOR_ANGLE_SPREAD = Math.PI * .5;
        SENSOR_LENGTH = 600;
        brain;
        INPUT_NODES = 14;
        HIDDEN_NODES = 12;
        OUTPUT_NODES = 2;
        lastInputs = [];
        score = 0;
        foods = [];
        poisons = [];
        isDead = !1;
        timeAlive = 0;
        life = 100;
        MAX_LIFE = 100;
        LIFE_DECAY_RATE = 5;
        constructor(t, e){
            for(let n = 0; n < this.SENSOR_COUNT; n++){
                const r = -this.SENSOR_ANGLE_SPREAD / 2 + n * this.SENSOR_ANGLE_SPREAD / (this.SENSOR_COUNT - 1);
                this.sensors.push({
                    angle: r,
                    length: this.SENSOR_LENGTH,
                    reading: 1,
                    detectedType: "NONE",
                    endX: 0,
                    endY: 0
                });
            }
            const i = t.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(.3).setAngularDamping(2);
            this.body = e.createRigidBody(i);
            const s = new Float32Array([
                0,
                15,
                -10,
                -10,
                10,
                -10
            ]), o = t.ColliderDesc.convexHull(s);
            o.setCollisionGroups(65536), e.createCollider(o, this.body), this.brain = new S(this.INPUT_NODES, this.HIDDEN_NODES, this.OUTPUT_NODES);
        }
        updateSensors(t) {
            const e = this.body.translation(), i = this.body.rotation();
            for (const s of this.sensors){
                const o = i + Math.PI / 2 + s.angle, n = Math.cos(o), r = Math.sin(o), h = e.x, l = e.y;
                let d = this.SENSOR_LENGTH, p = "NONE";
                for (const m of this.foods){
                    let f = m.x - h, a = m.y - l;
                    f > t / 2 && (f -= t), f < -t / 2 && (f += t), a > t / 2 && (a -= t), a < -t / 2 && (a += t);
                    const c = h + f, u = l + a, y = this.rayCircleIntersect(h, l, n, r, c, u, m.radius);
                    y !== null && y < d && (d = y, p = "FOOD");
                }
                for (const m of this.poisons){
                    let f = m.x - h, a = m.y - l;
                    f > t / 2 && (f -= t), f < -t / 2 && (f += t), a > t / 2 && (a -= t), a < -t / 2 && (a += t);
                    const c = h + f, u = l + a, y = this.rayCircleIntersect(h, l, n, r, c, u, m.radius);
                    y !== null && y < d && (d = y, p = "POISON");
                }
                s.reading = 1 - d / this.SENSOR_LENGTH, s.detectedType = p, s.endX = h + n * d, s.endY = l + r * d;
            }
        }
        rayCircleIntersect(t, e, i, s, o, n, r) {
            const h = o - t, l = n - e, d = h * i + l * s;
            let p = t + i * d, m = e + s * d;
            const f = (p - o) * (p - o) + (m - n) * (m - n);
            if (f > r * r) return null;
            const a = Math.sqrt(r * r - f), c = d - a;
            return c < 0 || c > this.SENSOR_LENGTH ? null : c;
        }
        initializeEnvironment(t, e, i) {
            this.foods = [], this.poisons = [];
            for(let s = 0; s < t; s++)this.foods.push(i.spawnFood());
            for(let s = 0; s < e; s++)this.poisons.push(i.spawnPoison());
            this.score = 0, this.timeAlive = 0, this.life = 100, this.isDead = !1, this.body.setLinvel({
                x: 0,
                y: 0
            }, !0), this.body.setAngvel(0, !0);
        }
        checkCollisions(t) {
            const e = this.getPosition(), i = 15;
            for(let s = this.poisons.length - 1; s >= 0; s--)this.poisons[s].isColliding(e.x, e.y, i) && (this.poisons.splice(s, 1), this.poisons.push(t.spawnPoison()), this.score -= 50, this.life -= 50);
            for(let s = this.foods.length - 1; s >= 0; s--)this.foods[s].isColliding(e.x, e.y, i) && (this.foods.splice(s, 1), this.foods.push(t.spawnFood()), this.score += 10, this.life += 20, this.life > this.MAX_LIFE && (this.life = this.MAX_LIFE));
            this.score += 1 / 60, this.timeAlive += 1 / 60, this.life -= this.LIFE_DECAY_RATE / 60, this.life <= 0 && (this.life = 0, this.isDead = !0);
        }
        copyBrainFrom(t) {
            this.brain = t.brain.copy();
        }
        updateThrusters() {
            if (this.isDead) {
                this.body.setLinvel({
                    x: 0,
                    y: 0
                }, !0), this.body.setAngvel(0, !0), this.leftThruster = 0, this.rightThruster = 0;
                return;
            }
            this.decide(), this.applyThrusterForces();
        }
        decide() {
            const t = [];
            for(let o = 0; o < 7; o++){
                let n = 0;
                for(let r = 0; r < 3; r++){
                    const h = o * 3 + r, l = this.sensors[h];
                    l.detectedType === "FOOD" && l.reading > n && (n = l.reading);
                }
                t.push(n);
            }
            for(let o = 0; o < 7; o++){
                let n = 0;
                for(let r = 0; r < 3; r++){
                    const h = o * 3 + r, l = this.sensors[h];
                    l.detectedType === "POISON" && l.reading > n && (n = l.reading);
                }
                t.push(n);
            }
            this.lastInputs = t;
            const s = this.brain.feedForward(t);
            this.leftThruster = s[0] * this.THRUSTER_MAX, this.rightThruster = s[1] * this.THRUSTER_MAX;
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
            const e = this.getPosition();
            if (!this.isDead) {
                t.save(), t.lineWidth = 1;
                for (const s of this.sensors)s.detectedType === "FOOD" ? t.strokeStyle = `rgba(0, 255, 0, ${s.reading})` : s.detectedType === "POISON" ? t.strokeStyle = `rgba(255, 0, 0, ${s.reading})` : t.strokeStyle = "rgba(200, 200, 200, 0.2)", t.beginPath(), t.moveTo(0, 0), t.lineTo(s.endX - e.x, s.endY - e.y), t.stroke();
                t.restore();
            }
            if (t.save(), t.rotate(this.body.rotation()), t.beginPath(), t.moveTo(0, 15), t.lineTo(-10, -10), t.lineTo(10, -10), t.closePath(), t.closePath(), this.isDead ? (t.fillStyle = "#555", t.strokeStyle = "#ff0000") : (t.fillStyle = "#fff", t.strokeStyle = "#4facfe"), t.fill(), t.lineWidth = 2, t.stroke(), !this.isDead) {
                const n = this.life / this.MAX_LIFE;
                t.fillStyle = "rgba(255, 0, 0, 0.7)", t.fillRect(-30 / 2, 20, 30, 4), t.fillStyle = "rgba(0, 255, 0, 0.7)", t.fillRect(-30 / 2, 20, 30 * n, 4);
            }
            const i = 30;
            if (this.leftThruster > 0) {
                const s = this.leftThruster / this.THRUSTER_MAX * i;
                t.beginPath(), t.moveTo(-7, -10), t.lineTo(-7, -10 - s), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
            }
            if (this.rightThruster > 0) {
                const s = this.rightThruster / this.THRUSTER_MAX * i;
                t.beginPath(), t.moveTo(7, -10), t.lineTo(7, -10 - s), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
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
        getSensors() {
            return this.sensors;
        }
    }
    class I {
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
    class v {
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
        drawBoids(t, e, i) {
            this.ctx.save(), this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2), this.ctx.scale(1, -1), this.ctx.translate(-e.x, -e.y);
            const s = Math.max(this.canvas.width, this.canvas.height) / 2 + 100, o = this.worldSize / 2;
            t.forEach((n)=>{
                const h = n === i ? 1 : .3;
                this.ctx.globalAlpha = h, this.drawBoidWithGhosts(n, e.x, e.y, s, o), this.ctx.globalAlpha = 1;
            }), this.ctx.restore();
        }
        drawBoidWithGhosts(t, e, i, s, o) {
            const n = t.getPosition(), r = (l, d)=>{
                this.ctx.save(), this.ctx.translate(l, d), t.draw(this.ctx), this.ctx.restore();
            };
            r(n.x, n.y);
            const h = [];
            n.x - e < -o + s && h.push({
                dx: this.worldSize,
                dy: 0
            }), n.x - e > o - s && h.push({
                dx: -this.worldSize,
                dy: 0
            }), n.y - i < -o + s && h.push({
                dx: 0,
                dy: this.worldSize
            }), n.y - i > o - s && h.push({
                dx: 0,
                dy: -this.worldSize
            });
            for (const l of h)r(n.x + l.dx, n.y + l.dy);
        }
        drawMinimap(t, e, i, s) {
            const r = this.canvas.width - 200 - 20, h = 20;
            this.ctx.save(), this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)", this.ctx.fillRect(r, h, 200, 200), this.ctx.strokeStyle = "#4facfe", this.ctx.lineWidth = 2, this.ctx.strokeRect(r, h, 200, 200);
            const l = 200 / this.worldSize, d = (a)=>(a + this.worldSize / 2) * l, p = (a)=>(this.worldSize / 2 - a) * l;
            this.ctx.strokeStyle = "rgba(79, 172, 254, 0.5)", this.ctx.lineWidth = 1, this.ctx.strokeRect(r, h, 200, 200), this.ctx.fillStyle = "#00ff88", i.forEach((a)=>{
                const c = r + d(a.x), u = h + p(a.y);
                this.ctx.fillRect(c - 1.5, u - 1.5, 3, 3);
            }), this.ctx.fillStyle = "#ff4444", s.forEach((a)=>{
                const c = r + d(a.x), u = h + p(a.y);
                this.ctx.fillRect(c - 1.5, u - 1.5, 3, 3);
            });
            const m = r + d(t), f = h + p(e);
            this.ctx.fillStyle = "#ffffff", this.ctx.beginPath(), this.ctx.arc(m, f, 4, 0, Math.PI * 2), this.ctx.fill(), this.ctx.strokeStyle = "#4facfe", this.ctx.lineWidth = 2, this.ctx.stroke(), this.ctx.restore();
        }
        drawBrain(t, e, i, s, o) {
            this.ctx.save(), this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.ctx.translate(e, i);
            const n = 5, r = s / 2, h = 0, l = o / (t.inputNodes + 1), d = h + r, p = o / (t.hiddenNodes + 1), m = d + r, f = o / (t.outputNodes + 1);
            for(let a = 0; a < t.inputNodes; a++)for(let c = 0; c < t.hiddenNodes; c++){
                const u = t.weightsIH[c][a], y = (a + 1) * l, T = (c + 1) * p;
                this.ctx.beginPath(), this.ctx.moveTo(h, y), this.ctx.lineTo(d, T);
                const x = Math.abs(u) * .5 + .1;
                this.ctx.strokeStyle = u > 0 ? `rgba(0, 255, 0, ${x})` : `rgba(255, 0, 0, ${x})`, this.ctx.lineWidth = Math.abs(u), this.ctx.stroke();
            }
            for(let a = 0; a < t.hiddenNodes; a++)for(let c = 0; c < t.outputNodes; c++){
                const u = t.weightsHO[c][a], y = (a + 1) * p, T = (c + 1) * f;
                this.ctx.beginPath(), this.ctx.moveTo(d, y), this.ctx.lineTo(m, T);
                const x = Math.abs(u) * .5 + .1;
                this.ctx.strokeStyle = u > 0 ? `rgba(0, 255, 0, ${x})` : `rgba(255, 0, 0, ${x})`, this.ctx.lineWidth = Math.abs(u), this.ctx.stroke();
            }
            for(let a = 0; a < t.inputNodes; a++){
                const c = (a + 1) * l, u = t.lastInput[a] || 0;
                this.ctx.beginPath(), this.ctx.arc(h, c, n, 0, Math.PI * 2), this.ctx.fillStyle = `rgba(255, 255, 255, ${u * .8 + .2})`, this.ctx.fill(), this.ctx.strokeStyle = "#fff", this.ctx.lineWidth = 1, this.ctx.stroke();
            }
            for(let a = 0; a < t.hiddenNodes; a++){
                const c = (a + 1) * p, u = t.lastHidden[a] || 0;
                this.ctx.beginPath(), this.ctx.arc(d, c, n, 0, Math.PI * 2), this.ctx.fillStyle = `rgba(255, 255, 255, ${u * .8 + .2})`, this.ctx.fill(), this.ctx.strokeStyle = "#fff", this.ctx.stroke();
            }
            for(let a = 0; a < t.outputNodes; a++){
                const c = (a + 1) * f, u = t.lastOutput[a] || 0;
                this.ctx.beginPath(), this.ctx.arc(m, c, n, 0, Math.PI * 2), this.ctx.fillStyle = `rgba(255, 255, 255, ${u * .8 + .2})`, this.ctx.fill(), this.ctx.strokeStyle = "#fff", this.ctx.stroke();
            }
            this.ctx.fillStyle = "#fff", this.ctx.font = "12px Arial", this.ctx.fillText("Brain Activity", 0, -10), this.ctx.restore();
        }
    }
    class _ {
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
            const l = Math.sqrt(i.x * i.x + i.y * i.y), d = Math.round(Math.atan2(i.y, i.x) * 180 / Math.PI);
            this.velStat.innerText = `Velocity: ${Math.round(l)} | Angle: ${d}°`, this.rotStat.innerText = `Rotation Power: ${s.toFixed(2)}`, this.foodStat.innerText = `Food: ${o}`, this.poisonStat.innerText = `Poison: ${n}`, this.collectedStat.innerText = `Collected: ${r} food, ${h} poison`;
        }
    }
    class B {
        x;
        y;
        radius;
        color;
        constructor(t, e, i = 16){
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
    class M {
        x;
        y;
        radius;
        color;
        constructor(t, e, i = 16){
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
    class A {
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
            return new B(e, i);
        }
        spawnPoison() {
            const t = this.worldSize / 2, e = this.rng.randomRange(-t + 50, t - 50), i = this.rng.randomRange(-t + 50, t - 50);
            return new M(e, i);
        }
        getFoodCollected() {
            return this.foodCollected;
        }
        getPoisonCollected() {
            return this.poisonCollected;
        }
    }
    class D {
        element;
        genRow;
        aliveRow;
        scoreRow;
        highScoreRow;
        timeRow;
        totalTimeRow;
        pauseBtn;
        onPauseToggle;
        isPaused = !1;
        resetBtn;
        onReset;
        constructor(t, e){
            this.onPauseToggle = t, this.onReset = e, this.element = document.createElement("div"), this.element.style.position = "absolute", this.element.style.bottom = "20px", this.element.style.right = "20px", this.element.style.padding = "15px", this.element.style.background = "rgba(0, 0, 0, 0.8)", this.element.style.borderRadius = "8px", this.element.style.border = "1px solid rgba(255, 255, 255, 0.1)", this.element.style.color = "#fff", this.element.style.fontFamily = "monospace", this.element.style.fontSize = "12px", this.element.style.minWidth = "250px";
            const i = document.createElement("div");
            i.style.display = "flex", i.style.justifyContent = "space-between", i.style.alignItems = "center", i.style.marginBottom = "10px";
            const s = document.createElement("span");
            s.innerText = "STATUS", s.style.color = "#4facfe", s.style.fontWeight = "bold";
            const o = document.createElement("div");
            o.style.display = "flex", o.style.gap = "5px", this.pauseBtn = document.createElement("button"), this.pauseBtn.innerText = "PAUSE", this.pauseBtn.style.background = "#ff4b2b", this.pauseBtn.style.border = "none", this.pauseBtn.style.color = "white", this.pauseBtn.style.padding = "2px 8px", this.pauseBtn.style.borderRadius = "4px", this.pauseBtn.style.cursor = "pointer", this.pauseBtn.onclick = ()=>this.togglePause(), this.resetBtn = document.createElement("button"), this.resetBtn.innerText = "RESET", this.resetBtn.style.background = "#aa0000", this.resetBtn.style.border = "none", this.resetBtn.style.color = "white", this.resetBtn.style.padding = "2px 8px", this.resetBtn.style.borderRadius = "4px", this.resetBtn.style.cursor = "pointer", this.resetBtn.onclick = ()=>{
                confirm("Are you sure you want to reset training? This will clear saved data.") && this.onReset();
            }, o.appendChild(this.pauseBtn), o.appendChild(this.resetBtn), i.appendChild(s), i.appendChild(o), this.element.appendChild(i);
            const n = (r, h = "#aaa")=>{
                const l = document.createElement("div");
                l.style.marginBottom = "5px", l.style.display = "flex", l.style.justifyContent = "space-between";
                const d = document.createElement("span");
                d.innerText = r, d.style.color = h;
                const p = document.createElement("span");
                return p.style.fontWeight = "bold", l.appendChild(d), l.appendChild(p), this.element.appendChild(l), p;
            };
            this.genRow = n("Generation:", "#4facfe"), this.aliveRow = n("Alive:", "#00ff88"), this.scoreRow = n("Current Best:", "#ffcc00"), this.highScoreRow = n("High Score:", "#ffa500"), this.timeRow = n("Gen Time:", "#ff4444"), this.totalTimeRow = n("Total Time:", "#ffffff"), document.body.appendChild(this.element);
        }
        togglePause() {
            this.isPaused = !this.isPaused, this.pauseBtn.innerText = this.isPaused ? "RESUME" : "PAUSE", this.pauseBtn.style.background = this.isPaused ? "#4facfe" : "#ff4b2b", this.onPauseToggle();
        }
        update(t, e, i, s, o, n) {
            this.genRow.innerText = t.toString(), this.aliveRow.innerText = e.toString(), this.scoreRow.innerText = i.toFixed(2), this.highScoreRow.innerText = s.toFixed(2), this.timeRow.innerText = o.toFixed(1) + "s";
            const r = Math.floor(n / 60), h = Math.floor(n % 60);
            this.totalTimeRow.innerText = `${r}:${h.toString().padStart(2, "0")}`;
        }
    }
    class H {
        world;
        boids = [];
        camera;
        renderer;
        hud;
        collisionManager;
        rng;
        debugPanel;
        isPaused = !1;
        RAPIER;
        POPULATION_SIZE = 50;
        GENERATION_DURATION = 45;
        generationTimer = 0;
        generation = 1;
        totalTime = 0;
        allTimeBestScore = 0;
        WORLD_SIZE = 2e3;
        FOOD_COUNT = 50;
        POISON_COUNT = 25;
        BOID_COLLISION_RADIUS = 15;
        constructor(t){
            const e = Date.now();
            this.rng = new R(e), console.log("World Seed:", e), this.RAPIER = t, this.world = new P(t, this.WORLD_SIZE), this.camera = new I, this.renderer = new v(this.WORLD_SIZE), this.hud = new _(e, this.FOOD_COUNT, this.POISON_COUNT), this.collisionManager = new A(this.WORLD_SIZE, this.BOID_COLLISION_RADIUS, this.rng), this.debugPanel = new D(()=>{
                this.isPaused = !this.isPaused;
            }, ()=>{
                this.resetTraining();
            }), this.initializePopulation(), this.loadTrainingData();
        }
        initializePopulation() {
            this.boids = [];
            for(let t = 0; t < this.POPULATION_SIZE; t++){
                const e = new E(this.RAPIER, this.world.getPhysicsWorld());
                this.resetBoid(e), this.boids.push(e);
            }
        }
        resetBoid(t) {
            const e = this.WORLD_SIZE / 2, i = this.rng.randomRange(-e, e), s = this.rng.randomRange(-e, e);
            t.getBody().setTranslation({
                x: i,
                y: s
            }, !0), t.getBody().setLinvel({
                x: 0,
                y: 0
            }, !0), t.getBody().setAngvel(0, !0), t.getBody().setRotation(Math.random() * Math.PI * 2, !0), t.initializeEnvironment(this.FOOD_COUNT, this.POISON_COUNT, this.collisionManager);
        }
        update() {
            if (this.isPaused) return;
            this.generationTimer += 1 / 60, this.generationTimer > this.GENERATION_DURATION && this.evolve(), this.totalTime += 1 / 60, this.world.step();
            let t = 0;
            for (const e of this.boids)this.world.wrapPosition(e.getBody()), e.updateThrusters(), e.isDead || (t++, e.updateSensors(this.WORLD_SIZE), e.checkCollisions(this.collisionManager));
            (this.generationTimer > this.GENERATION_DURATION || t <= 1) && this.evolve();
        }
        evolve() {
            this.boids.sort((i, s)=>s.score - i.score);
            const t = this.boids[0].score;
            t > this.allTimeBestScore && (this.allTimeBestScore = t), console.log(`Generation ${this.generation} complete. Survivors: ${this.boids.filter((i)=>!i.isDead).length}. Best Score: ${t}.`);
            const e = Math.floor(this.POPULATION_SIZE / 2);
            for(let i = 0; i < e; i++)this.resetBoid(this.boids[i]);
            for(let i = e; i < this.POPULATION_SIZE; i++){
                const s = i - e, o = this.boids[s], n = this.boids[i];
                n.copyBrainFrom(o), n.brain.mutate(.1, .2), this.resetBoid(n);
            }
            this.generation++, this.generationTimer = 0, this.saveTrainingData();
        }
        saveTrainingData() {
            const t = this.boids.map((i)=>i.brain.toJSON()), e = {
                generation: this.generation,
                totalTime: this.totalTime,
                allTimeBestScore: this.allTimeBestScore,
                brains: t
            };
            localStorage.setItem("boid_training_data", JSON.stringify(e)), console.log("Training data saved for Gen " + this.generation);
        }
        loadTrainingData() {
            const t = localStorage.getItem("boid_training_data");
            if (t) try {
                const e = JSON.parse(t);
                if (this.generation = e.generation, this.totalTime = e.totalTime || 0, this.allTimeBestScore = e.allTimeBestScore || 0, console.log("Loaded training data. Gen: " + this.generation), e.brains && Array.isArray(e.brains)) for(let i = 0; i < this.POPULATION_SIZE; i++)e.brains[i] ? this.boids[i].brain = S.fromJSON(e.brains[i]) : i > 0 && (this.boids[i].brain = this.boids[0].brain.copy(), this.boids[i].brain.mutate(.1, .2));
                else if (e.bestBrain) {
                    const i = S.fromJSON(e.bestBrain);
                    this.boids[0].brain = i.copy();
                    for(let s = 1; s < this.POPULATION_SIZE; s++)this.boids[s].brain = i.copy(), this.boids[s].brain.mutate(.1, .2);
                }
            } catch (e) {
                console.error("Failed to load training data", e);
            }
        }
        resetTraining() {
            localStorage.removeItem("boid_training_data"), this.generation = 1, this.generationTimer = 0, this.initializePopulation(), console.log("Training reset.");
        }
        draw() {
            this.renderer.clear();
            let t = this.boids[0], e = -1 / 0;
            if (this.boids.length > 0) for (const h of this.boids)h.score > e && (e = h.score, t = h);
            const i = t.getPosition();
            this.camera.follow(i.x, i.y), this.renderer.drawWorld(this.camera, t.foods, t.poisons), this.renderer.drawBoids(this.boids, this.camera, t), this.renderer.drawMinimap(i.x, i.y, t.foods, t.poisons);
            const s = 200, o = 300, n = 20;
            this.renderer.drawBrain(t.brain, n, window.innerHeight - o - n, s, o), this.hud.updateStats(t.getLeftThrusterPercent(), t.getRightThrusterPercent(), t.getVelocity(), t.getAngularVelocity(), t.foods.length, t.poisons.length, 0, Math.floor(t.score));
            const r = this.boids.filter((h)=>!h.isDead).length;
            this.debugPanel.update(this.generation, r, t.score, this.allTimeBestScore, this.generationTimer, this.totalTime), this.hud.updateStats(t.getLeftThrusterPercent(), t.getRightThrusterPercent(), t.getVelocity(), t.getAngularVelocity(), this.generation, Math.floor(this.GENERATION_DURATION - this.generationTimer), Math.floor(t.score), 0);
        }
        loop = ()=>{
            this.update(), this.draw(), requestAnimationFrame(this.loop);
        };
        start() {
            console.log("Starting game loop..."), this.loop();
        }
    }
    async function C() {
        console.log("Starting boid simulation...");
        const g = await O(()=>import("./rapier-D9GItMpu.js"), [], import.meta.url);
        g.init && await g.init(), console.log("RAPIER module ready"), new H(g).start();
    }
    C().catch(console.error);
})();
