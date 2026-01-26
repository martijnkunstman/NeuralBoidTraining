(async ()=>{
    (function() {
        const t = document.createElement("link").relList;
        if (t && t.supports && t.supports("modulepreload")) return;
        for (const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);
        new MutationObserver((i)=>{
            for (const o of i)if (o.type === "childList") for (const n of o.addedNodes)n.tagName === "LINK" && n.rel === "modulepreload" && s(n);
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
    const v = "modulepreload", M = function(f, t) {
        return new URL(f, t).href;
    }, I = {}, _ = function(t, e, s) {
        let i = Promise.resolve();
        if (e && e.length > 0) {
            const n = document.getElementsByTagName("link"), r = document.querySelector("meta[property=csp-nonce]"), a = r?.nonce || r?.getAttribute("nonce");
            i = Promise.allSettled(e.map((h)=>{
                if (h = M(h, s), h in I) return;
                I[h] = !0;
                const l = h.endsWith(".css"), d = l ? '[rel="stylesheet"]' : "";
                if (!!s) for(let p = n.length - 1; p >= 0; p--){
                    const g = n[p];
                    if (g.href === h && (!l || g.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${h}"]${d}`)) return;
                const u = document.createElement("link");
                if (u.rel = l ? "stylesheet" : v, l || (u.as = "script"), u.crossOrigin = "", u.href = h, a && u.setAttribute("nonce", a), document.head.appendChild(u), l) return new Promise((p, g)=>{
                    u.addEventListener("load", p), u.addEventListener("error", ()=>g(new Error(`Unable to preload CSS for ${h}`)));
                });
            }));
        }
        function o(n) {
            const r = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (r.payload = n, window.dispatchEvent(r), !r.defaultPrevented) throw n;
        }
        return i.then((n)=>{
            for (const r of n || [])r.status === "rejected" && o(r.reason);
            return t().catch(o);
        });
    };
    class B {
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
    class C {
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
        inputNodes;
        hiddenNodes;
        outputNodes;
        weightsIH;
        weightsHO;
        biasH;
        biasO;
        lastInput;
        lastHidden;
        lastOutput;
        constructor(t, e, s){
            this.inputNodes = t, this.hiddenNodes = e, this.outputNodes = s, this.weightsIH = this.createMatrix(this.hiddenNodes, this.inputNodes), this.weightsHO = this.createMatrix(this.outputNodes, this.hiddenNodes), this.biasH = new Float32Array(this.hiddenNodes), this.biasO = new Float32Array(this.outputNodes), this.lastInput = new Float32Array(this.inputNodes), this.lastHidden = new Float32Array(this.hiddenNodes), this.lastOutput = new Float32Array(this.outputNodes), this.randomize();
        }
        createMatrix(t, e) {
            return Array.from({
                length: t
            }, ()=>new Float32Array(e));
        }
        randomize() {
            for(let t = 0; t < this.hiddenNodes; t++){
                for(let e = 0; e < this.inputNodes; e++)this.weightsIH[t][e] = Math.random() * 2 - 1;
                this.biasH[t] = Math.random() * 2 - 1;
            }
            for(let t = 0; t < this.outputNodes; t++){
                for(let e = 0; e < this.hiddenNodes; e++)this.weightsHO[t][e] = Math.random() * 2 - 1;
                this.biasO[t] = Math.random() * 2 - 1;
            }
        }
        feedForward(t) {
            if (t.length !== this.inputNodes) return console.error(`NeuralNetwork: Expected ${this.inputNodes} inputs, got ${t.length}`), this.lastOutput;
            for(let e = 0; e < this.inputNodes; e++)this.lastInput[e] = t[e];
            for(let e = 0; e < this.hiddenNodes; e++){
                let s = 0;
                for(let i = 0; i < this.inputNodes; i++)s += this.weightsIH[e][i] * this.lastInput[i];
                s += this.biasH[e], this.lastHidden[e] = Math.tanh(s);
            }
            for(let e = 0; e < this.outputNodes; e++){
                let s = 0;
                for(let i = 0; i < this.hiddenNodes; i++)s += this.weightsHO[e][i] * this.lastHidden[i];
                s += this.biasO[e], this.lastOutput[e] = this.sigmoid(s);
            }
            return this.lastOutput;
        }
        sigmoid(t) {
            return 1 / (1 + Math.exp(-t));
        }
        copy() {
            const t = new b(this.inputNodes, this.hiddenNodes, this.outputNodes);
            for(let e = 0; e < this.hiddenNodes; e++)t.weightsIH[e].set(this.weightsIH[e]);
            for(let e = 0; e < this.outputNodes; e++)t.weightsHO[e].set(this.weightsHO[e]);
            return t.biasH.set(this.biasH), t.biasO.set(this.biasO), t;
        }
        crossover(t) {
            const e = new b(this.inputNodes, this.hiddenNodes, this.outputNodes), s = (i, o)=>Math.random() < .5 ? i : o;
            for(let i = 0; i < this.hiddenNodes; i++){
                for(let o = 0; o < this.inputNodes; o++)e.weightsIH[i][o] = s(this.weightsIH[i][o], t.weightsIH[i][o]);
                e.biasH[i] = s(this.biasH[i], t.biasH[i]);
            }
            for(let i = 0; i < this.outputNodes; i++){
                for(let o = 0; o < this.hiddenNodes; o++)e.weightsHO[i][o] = s(this.weightsHO[i][o], t.weightsHO[i][o]);
                e.biasO[i] = s(this.biasO[i], t.biasO[i]);
            }
            return e;
        }
        mutate(t, e) {
            const s = (i)=>Math.random() < t ? i + (Math.random() * 2 - 1) * e : i;
            for(let i = 0; i < this.hiddenNodes; i++){
                for(let o = 0; o < this.inputNodes; o++)this.weightsIH[i][o] = s(this.weightsIH[i][o]);
                this.biasH[i] = s(this.biasH[i]);
            }
            for(let i = 0; i < this.outputNodes; i++){
                for(let o = 0; o < this.hiddenNodes; o++)this.weightsHO[i][o] = s(this.weightsHO[i][o]);
                this.biasO[i] = s(this.biasO[i]);
            }
        }
        toJSON() {
            return {
                inputNodes: this.inputNodes,
                hiddenNodes: this.hiddenNodes,
                outputNodes: this.outputNodes,
                weightsIH: this.weightsIH.map((t)=>Array.from(t)),
                weightsHO: this.weightsHO.map((t)=>Array.from(t)),
                biasH: Array.from(this.biasH),
                biasO: Array.from(this.biasO)
            };
        }
        static fromJSON(t) {
            const e = new b(t.inputNodes, t.hiddenNodes, t.outputNodes);
            if (t.weightsIH) for(let s = 0; s < t.hiddenNodes; s++)e.weightsIH[s].set(t.weightsIH[s]);
            if (t.weightsHO) for(let s = 0; s < t.outputNodes; s++)e.weightsHO[s].set(t.weightsHO[s]);
            return t.biasH && e.biasH.set(t.biasH), t.biasO && e.biasO.set(t.biasO), e;
        }
    }
    class A {
        body;
        leftThruster = 0;
        rightThruster = 0;
        THRUSTER_MAX = 1600;
        sensors = [];
        SENSOR_COUNT = 7;
        SENSOR_ANGLE_SPREAD = Math.PI * .8;
        SENSOR_LENGTH = 600;
        brain;
        INPUT_NODES = 18;
        HIDDEN_NODES = 16;
        OUTPUT_NODES = 2;
        lastInputs = [];
        score = 0;
        foods = [];
        poisons = [];
        isDead = !1;
        timeAlive = 0;
        life = 100;
        MAX_LIFE = 100;
        LIFE_DECAY_RATE = 1;
        eatenFoodHistory = [];
        MEMORY_SIZE = 5;
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
            const s = t.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(.8).setAngularDamping(2.5);
            this.body = e.createRigidBody(s);
            const i = new Float32Array([
                0,
                15,
                -10,
                -10,
                10,
                -10
            ]), o = t.ColliderDesc.convexHull(i);
            o.setCollisionGroups(65536), e.createCollider(o, this.body), this.brain = new b(this.INPUT_NODES, this.HIDDEN_NODES, this.OUTPUT_NODES);
        }
        updateSensors(t, e) {
            const s = this.body.translation(), i = this.body.rotation(), o = e.getNearbyFood(s.x, s.y, this.SENSOR_LENGTH), n = e.getNearbyPoison(s.x, s.y, this.SENSOR_LENGTH);
            for (const r of this.sensors){
                const a = i + Math.PI / 2 + r.angle, h = Math.cos(a), l = Math.sin(a), d = s.x, c = s.y;
                let u = this.SENSOR_LENGTH, p = "NONE";
                for (const g of o){
                    if (this.eatenFoodHistory.includes(g)) continue;
                    let m = g.x - d, y = g.y - c;
                    m > t / 2 && (m -= t), m < -t / 2 && (m += t), y > t / 2 && (y -= t), y < -t / 2 && (y += t);
                    const w = d + m, T = c + y, S = this.rayCircleIntersect(d, c, h, l, w, T, g.radius);
                    S !== null && S < u && (u = S, p = "FOOD");
                }
                for (const g of n){
                    let m = g.x - d, y = g.y - c;
                    m > t / 2 && (m -= t), m < -t / 2 && (m += t), y > t / 2 && (y -= t), y < -t / 2 && (y += t);
                    const w = d + m, T = c + y, S = this.rayCircleIntersect(d, c, h, l, w, T, g.radius);
                    S !== null && S < u && (u = S, p = "POISON");
                }
                r.reading = 1 - u / this.SENSOR_LENGTH, r.detectedType = p, r.endX = d + h * u, r.endY = c + l * u;
            }
        }
        rayCircleIntersect(t, e, s, i, o, n, r) {
            const a = o - t, h = n - e, l = a * s + h * i;
            let d = t + s * l, c = e + i * l;
            const u = (d - o) * (d - o) + (c - n) * (c - n);
            if (u > r * r) return null;
            const p = Math.sqrt(r * r - u), g = l - p;
            return g < 0 || g > this.SENSOR_LENGTH ? null : g;
        }
        initializeEnvironment(t, e) {
            this.foods = t, this.poisons = e, this.eatenFoodHistory = [], this.score = 0, this.timeAlive = 0, this.life = 100, this.isDead = !1, this.body.setLinvel({
                x: 0,
                y: 0
            }, !0), this.body.setAngvel(0, !0);
        }
        checkCollisions(t) {
            const e = this.getPosition(), s = 15;
            for (const o of this.poisons)o.isColliding(e.x, e.y, s) && (this.score -= 10, this.life -= 10);
            for (const o of this.foods)this.eatenFoodHistory.includes(o) || o.isColliding(e.x, e.y, s) && (this.score += 25, this.life += 20, this.life > this.MAX_LIFE && (this.life = this.MAX_LIFE), this.eatenFoodHistory.push(o), this.eatenFoodHistory.length > this.MEMORY_SIZE && this.eatenFoodHistory.shift());
            this.score += 1 / 60, this.timeAlive += 1 / 60;
            let i = 0;
            for (const o of this.sensors)o.detectedType === "FOOD" && (i += o.reading * .01);
            this.score += i, this.life -= this.LIFE_DECAY_RATE / 60, this.life <= 0 && (this.life = 0, this.isDead = !0);
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
            for (const a of this.sensors)t.push(a.detectedType === "FOOD" ? a.reading : 0);
            for (const a of this.sensors)t.push(a.detectedType === "POISON" ? a.reading : 0);
            const e = this.body.linvel(), s = this.body.angvel(), i = this.body.rotation(), o = e.x * -Math.sin(i) + e.y * Math.cos(i), n = e.x * Math.cos(i) + e.y * Math.sin(i);
            t.push(.5 + .5 * Math.tanh(o * .05)), t.push(.5 + .5 * Math.tanh(n * .05)), t.push(.5 + .5 * Math.tanh(s * .5)), t.push(this.life / this.MAX_LIFE), this.lastInputs = t;
            const r = this.brain.feedForward(t);
            this.leftThruster = r[0] * this.THRUSTER_MAX, this.rightThruster = r[1] * this.THRUSTER_MAX;
        }
        setThrustersManual(t, e) {
            this.leftThruster = t, this.rightThruster = e;
        }
        applyThrusterForces() {
            const t = this.body.rotation(), e = -Math.sin(t), s = Math.cos(t), i = {
                x: -10,
                y: -10
            }, o = {
                x: 10,
                y: -10
            }, n = (a, h)=>({
                    x: a.x * Math.cos(h) - a.y * Math.sin(h),
                    y: a.x * Math.sin(h) + a.y * Math.cos(h)
                }), r = this.body.translation();
            if (this.leftThruster > 0) {
                const a = n(i, t);
                this.body.applyImpulseAtPoint({
                    x: e * this.leftThruster * .1,
                    y: s * this.leftThruster * .1
                }, {
                    x: r.x + a.x,
                    y: r.y + a.y
                }, !0);
            }
            if (this.rightThruster > 0) {
                const a = n(o, t);
                this.body.applyImpulseAtPoint({
                    x: e * this.rightThruster * .1,
                    y: s * this.rightThruster * .1
                }, {
                    x: r.x + a.x,
                    y: r.y + a.y
                }, !0);
            }
        }
        draw(t, e = !1) {
            const s = this.getPosition();
            if (!this.isDead && e) {
                t.save(), t.lineWidth = 1;
                for (const o of this.sensors)o.detectedType === "FOOD" ? t.strokeStyle = `rgba(0, 255, 0, ${o.reading})` : o.detectedType === "POISON" ? t.strokeStyle = `rgba(255, 0, 0, ${o.reading})` : t.strokeStyle = "rgba(200, 200, 200, 0.2)", t.beginPath(), t.moveTo(0, 0), t.lineTo(o.endX - s.x, o.endY - s.y), t.stroke();
                t.restore();
            }
            if (t.save(), t.rotate(this.body.rotation()), t.beginPath(), t.moveTo(0, 15), t.lineTo(-10, -10), t.lineTo(10, -10), t.closePath(), t.closePath(), this.isDead ? (t.fillStyle = "#555", t.strokeStyle = "#ff0000") : (t.fillStyle = "#fff", t.strokeStyle = "#4facfe"), t.fill(), t.lineWidth = 2, t.stroke(), !this.isDead) {
                const r = this.life / this.MAX_LIFE;
                t.fillStyle = "rgba(255, 0, 0, 0.7)", t.fillRect(-30 / 2, 20, 30, 4), t.fillStyle = "rgba(0, 255, 0, 0.7)", t.fillRect(-30 / 2, 20, 30 * r, 4);
            }
            const i = 30;
            if (this.leftThruster > 0) {
                const o = this.leftThruster / this.THRUSTER_MAX * i;
                t.beginPath(), t.moveTo(-7, -10), t.lineTo(-7, -10 - o), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
            }
            if (this.rightThruster > 0) {
                const o = this.rightThruster / this.THRUSTER_MAX * i;
                t.beginPath(), t.moveTo(7, -10), t.lineTo(7, -10 - o), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
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
    class H {
        x = 0;
        y = 0;
        targetX = 0;
        targetY = 0;
        SMOOTHNESS = .08;
        follow(t, e) {
            this.targetX = t, this.targetY = e, this.x += (this.targetX - this.x) * this.SMOOTHNESS, this.y += (this.targetY - this.y) * this.SMOOTHNESS;
        }
        snap(t, e) {
            this.x = t, this.y = e, this.targetX = t, this.targetY = e;
        }
        applyTransform(t, e) {
            t.save(), t.translate(e.width / 2, e.height / 2), t.scale(1, -1), t.translate(-this.x, -this.y);
        }
        resetTransform(t) {
            t.restore();
        }
    }
    class L {
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
        drawWorld(t, e, s, i = []) {
            this.ctx.save(), this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2), this.ctx.scale(1, -1), this.ctx.save(), this.ctx.translate(-t.x, -t.y), this.drawGrid(), this.drawBorders(), e.forEach((o)=>{
                const n = i.includes(o);
                this.drawItemWithGhosts(o, t.x, t.y, n ? "#0000FF" : void 0);
            }), s.forEach((o)=>this.drawItemWithGhosts(o, t.x, t.y)), this.ctx.restore(), this.ctx.restore();
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
        drawItemWithGhosts(t, e, s, i) {
            const o = Math.max(this.canvas.width, this.canvas.height) / 2 + 100, n = this.worldSize / 2, r = ()=>{
                i ? (this.ctx.fillStyle = i, this.ctx.beginPath(), this.ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2), this.ctx.fill()) : t.draw(this.ctx);
            };
            r();
            const a = [];
            t.x - e < -n + o && a.push({
                dx: this.worldSize,
                dy: 0
            }), t.x - e > n - o && a.push({
                dx: -this.worldSize,
                dy: 0
            }), t.y - s < -n + o && a.push({
                dx: 0,
                dy: this.worldSize
            }), t.y - s > n - o && a.push({
                dx: 0,
                dy: -this.worldSize
            });
            for (const h of a)this.ctx.save(), this.ctx.translate(h.dx, h.dy), r(), this.ctx.restore();
        }
        drawBoids(t, e, s) {
            this.ctx.save(), this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2), this.ctx.scale(1, -1), this.ctx.translate(-e.x, -e.y);
            const i = Math.max(this.canvas.width, this.canvas.height) / 2 + 100, o = this.worldSize / 2;
            t.forEach((n)=>{
                const r = n === s, a = r ? 1 : .3;
                this.ctx.globalAlpha = a, this.drawBoidWithGhosts(n, e.x, e.y, i, o, r), this.ctx.globalAlpha = 1;
            }), this.ctx.restore();
        }
        drawBoidWithGhosts(t, e, s, i, o, n = !1) {
            const r = t.getPosition(), a = (l, d)=>{
                this.ctx.save(), this.ctx.translate(l, d), t.draw(this.ctx, n), this.ctx.restore();
            };
            a(r.x, r.y);
            const h = [];
            r.x - e < -o + i && h.push({
                dx: this.worldSize,
                dy: 0
            }), r.x - e > o - i && h.push({
                dx: -this.worldSize,
                dy: 0
            }), r.y - s < -o + i && h.push({
                dx: 0,
                dy: this.worldSize
            }), r.y - s > o - i && h.push({
                dx: 0,
                dy: -this.worldSize
            });
            for (const l of h)a(r.x + l.dx, r.y + l.dy);
        }
    }
    class N {
        element;
        content;
        toggleBtn;
        isCollapsed = !1;
        constructor(t, e, s = "300px", i = "auto"){
            this.element = document.createElement("div"), this.element.className = `game-panel panel-${e}`, this.element.style.width = s, i !== "auto" && (this.element.style.height = i);
            const o = document.createElement("div");
            o.className = "panel-header";
            const n = document.createElement("div");
            n.className = "panel-title", n.innerHTML = `<span>${t}</span>`, this.toggleBtn = document.createElement("span"), this.toggleBtn.className = "panel-toggle", this.toggleBtn.innerHTML = "−", o.appendChild(n), o.appendChild(this.toggleBtn), o.onclick = ()=>this.toggleCollapse(), this.element.appendChild(o), this.content = document.createElement("div"), this.content.className = "panel-content", this.element.appendChild(this.content), document.body.appendChild(this.element);
        }
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed, this.element.classList.toggle("collapsed", this.isCollapsed), this.toggleBtn.innerHTML = this.isCollapsed ? "+" : "−";
        }
        createRow(t, e = "") {
            const s = document.createElement("div");
            s.style.display = "flex", s.style.justifyContent = "space-between", s.style.marginBottom = "2px";
            const i = document.createElement("span");
            i.style.opacity = "0.7", i.innerText = t;
            const o = document.createElement("span");
            return o.style.fontWeight = "bold", o.innerText = e, s.appendChild(i), s.appendChild(o), this.content.appendChild(s), o;
        }
    }
    class D extends N {
        leftStat;
        rightStat;
        velStat;
        rotStat;
        foodStat;
        poisonStat;
        collectedStat;
        constructor(t, e, s){
            super("Boid Systems", "top-left", "260px"), this.element.style.display = "none", this.createRow("Seed:", t.toString()), this.addSeparator(), this.leftStat = this.createRow("Left Thruster:", "0%"), this.rightStat = this.createRow("Right Thruster:", "0%"), this.velStat = this.createRow("Velocity:", "0"), this.rotStat = this.createRow("Rotation Power:", "0"), this.addSeparator(), this.foodStat = this.createRow("Food:", e.toString()), this.poisonStat = this.createRow("Poison:", s.toString()), this.collectedStat = this.createRow("Collected:", "0");
            const i = document.createElement("div");
            i.style.marginTop = "10px", i.style.fontSize = "10px", i.style.opacity = "0.5", i.innerText = "Q/A: Left | W/S: Right", this.content.appendChild(i);
        }
        addSeparator() {
            const t = document.createElement("div");
            t.style.height = "1px", t.style.background = "rgba(255, 255, 255, 0.1)", t.style.margin = "8px 0", this.content.appendChild(t);
        }
        updateStats(t, e, s, i, o, n, r, a) {
            this.leftStat.innerText = `${Math.round(t)}%`, this.rightStat.innerText = `${Math.round(e)}%`;
            const h = Math.sqrt(s.x * s.x + s.y * s.y), l = Math.round(Math.atan2(s.y, s.x) * 180 / Math.PI);
            this.velStat.innerText = `${Math.round(h)} | ${l}°`, this.rotStat.innerText = i.toFixed(2), this.foodStat.innerText = o.toString(), this.poisonStat.innerText = n.toString(), this.collectedStat.innerText = `${r} / ${a}`;
        }
        updateEnvironment(t, e) {
            this.foodStat.innerText = t.toString(), this.poisonStat.innerText = e.toString();
        }
    }
    class O {
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
    class P {
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
    class F {
        foodCollected = 0;
        poisonCollected = 0;
        worldSize;
        rng;
        foodGrid = new Map;
        poisonGrid = new Map;
        GRID_CELL_SIZE = 300;
        foodSpawnQueue = [];
        poisonSpawnQueue = [];
        QUEUE_SIZE = 500;
        constructor(t, e, s){
            this.worldSize = t, this.rng = s;
        }
        getGridKey(t, e) {
            const s = this.worldSize / 2, i = Math.ceil(this.worldSize / this.GRID_CELL_SIZE);
            let o = Math.floor((t + s) / this.GRID_CELL_SIZE), n = Math.floor((e + s) / this.GRID_CELL_SIZE);
            return o = (o % i + i) % i, n = (n % i + i) % i, `${o},${n}`;
        }
        addToGrid(t, e, s) {
            const i = this.getGridKey(e.x, e.y);
            t.has(i) || t.set(i, []), t.get(i).push(s);
        }
        rebuildGrids(t, e) {
            this.foodGrid.clear(), this.poisonGrid.clear();
            for (const s of t)this.addToGrid(this.foodGrid, s, s);
            for (const s of e)this.addToGrid(this.poisonGrid, s, s);
        }
        getNearbyFood(t, e, s) {
            return this.getNearbyEntities(t, e, s, this.foodGrid);
        }
        getNearbyPoison(t, e, s) {
            return this.getNearbyEntities(t, e, s, this.poisonGrid);
        }
        getNearbyEntities(t, e, s, i) {
            const o = [], n = new Set, r = this.worldSize / 2, a = Math.ceil(this.worldSize / this.GRID_CELL_SIZE), h = t - s, l = t + s, d = e - s, c = e + s, u = Math.floor((h + r) / this.GRID_CELL_SIZE), p = Math.floor((l + r) / this.GRID_CELL_SIZE), g = Math.floor((d + r) / this.GRID_CELL_SIZE), m = Math.floor((c + r) / this.GRID_CELL_SIZE);
            for(let y = u; y <= p; y++)for(let w = g; w <= m; w++){
                const T = (y % a + a) % a, S = (w % a + a) % a, R = `${T},${S}`, x = i.get(R);
                if (x) for (const E of x)n.has(E) || (o.push(E), n.add(E));
            }
            return o;
        }
        generateSpawnQueue() {
            this.foodSpawnQueue = [], this.poisonSpawnQueue = [];
            const t = this.worldSize / 2;
            for(let e = 0; e < this.QUEUE_SIZE; e++)this.foodSpawnQueue.push({
                x: this.rng.randomRange(-t + 50, t - 50),
                y: this.rng.randomRange(-t + 50, t - 50)
            });
        }
        spawnFood() {
            const t = this.worldSize / 2, e = this.rng.randomRange(-t + 50, t - 50), s = this.rng.randomRange(-t + 50, t - 50);
            return new O(e, s, 30);
        }
        spawnPoison() {
            const t = this.worldSize / 2, e = 250;
            let s, i, o;
            do s = this.rng.randomRange(-t + 50, t - 50), i = this.rng.randomRange(-t + 50, t - 50), o = Math.sqrt(s * s + i * i);
            while (o < e);
            return new P(s, i, 30);
        }
        spawnFoodFromQueue(t) {
            const e = this.foodSpawnQueue[t % this.QUEUE_SIZE];
            return new O(e.x, e.y, 30);
        }
        spawnPoisonFromQueue(t) {
            const e = this.poisonSpawnQueue[t % this.QUEUE_SIZE];
            return new P(e.x, e.y, 30);
        }
        getFoodCollected() {
            return this.foodCollected;
        }
        getPoisonCollected() {
            return this.poisonCollected;
        }
    }
    class G extends N {
        pauseBtn;
        onPauseToggle;
        isPaused = !1;
        resetBtn;
        onReset;
        trainInput;
        trainBtn;
        onFastTrain;
        constructor(t, e, s){
            super("Simulation Control", "top-left", "280px"), this.onPauseToggle = t, this.onReset = e, this.onFastTrain = s, this.setupControls();
        }
        genStat;
        timerStat;
        aliveStat;
        scoreStat;
        setupControls() {
            const t = document.createElement("div");
            t.style.display = "flex", t.style.flexDirection = "column", t.style.gap = "8px", t.style.marginBottom = "0";
            const e = document.createElement("div");
            e.style.background = "rgba(0,0,0,0.3)", e.style.padding = "8px", e.style.borderRadius = "4px", e.style.marginBottom = "10px", e.style.fontSize = "12px", e.style.fontFamily = "monospace", e.style.color = "#00ff88", this.genStat = document.createElement("div"), this.timerStat = document.createElement("div"), this.aliveStat = document.createElement("div"), this.scoreStat = document.createElement("div"), e.appendChild(this.genStat), e.appendChild(this.timerStat), e.appendChild(this.aliveStat), e.appendChild(this.scoreStat), t.appendChild(e);
            const s = document.createElement("div");
            s.style.display = "flex", s.style.gap = "5px", this.pauseBtn = document.createElement("button"), this.pauseBtn.innerText = "PAUSE", this.pauseBtn.className = "panel-btn", this.pauseBtn.style.flex = "1", this.pauseBtn.onclick = ()=>this.togglePause(), this.resetBtn = document.createElement("button"), this.resetBtn.innerText = "RESET", this.resetBtn.className = "panel-btn", this.resetBtn.style.flex = "1", this.resetBtn.style.color = "#ff8888", this.resetBtn.style.borderColor = "#ff8888", this.resetBtn.onclick = ()=>{
                confirm("Reset training? Data will be lost.") && this.onReset();
            }, s.appendChild(this.pauseBtn), s.appendChild(this.resetBtn), t.appendChild(s);
            const i = document.createElement("div");
            i.style.display = "flex", i.style.gap = "5px", this.trainInput = document.createElement("input"), this.trainInput.type = "number", this.trainInput.value = "5", this.trainInput.className = "panel-input", this.trainInput.style.width = "50px", this.trainBtn = document.createElement("button"), this.trainBtn.innerText = "FAST TRAIN", this.trainBtn.className = "panel-btn", this.trainBtn.style.flex = "1", this.trainBtn.onclick = ()=>{
                const o = parseInt(this.trainInput.value) || 1;
                this.trainBtn.disabled = !0, this.trainBtn.innerText = "TRAINING...", setTimeout(()=>{
                    this.onFastTrain(o), this.trainBtn.disabled = !1, this.trainBtn.innerText = "FAST TRAIN";
                }, 50);
            }, i.appendChild(this.trainInput), i.appendChild(this.trainBtn), t.appendChild(i), this.content.appendChild(t);
        }
        togglePause() {
            this.isPaused = !this.isPaused, this.pauseBtn.innerText = this.isPaused ? "RESUME" : "PAUSE", this.onPauseToggle();
        }
        update(t, e, s, i, o, n) {
            this.genStat.innerText = `Generation:  ${t}`, this.timerStat.innerText = `Time Left:   ${o.toFixed(1)}s`, this.aliveStat.innerText = `Alive:       ${e}`, this.scoreStat.innerText = `Best Score:  ${s.toFixed(2)}`;
        }
    }
    class U extends N {
        canvas;
        ctx;
        SIZE = 200;
        worldSize;
        constructor(t){
            super("Minimap", "top-right", "auto"), this.worldSize = t, this.canvas = document.createElement("canvas"), this.canvas.width = this.SIZE, this.canvas.height = this.SIZE, this.canvas.style.display = "block", this.canvas.style.background = "#000", this.canvas.style.border = "1px solid #333", this.content.appendChild(this.canvas), this.content.style.padding = "5px", this.ctx = this.canvas.getContext("2d");
        }
        draw(t, e, s, i, o = []) {
            if (this.isCollapsed) return;
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)", this.ctx.fillRect(0, 0, this.SIZE, this.SIZE);
            const n = this.SIZE / this.worldSize, r = (d)=>(d + this.worldSize / 2) * n, a = (d)=>(this.worldSize / 2 - d) * n;
            for (const d of s){
                const c = o.includes(d);
                this.ctx.fillStyle = c ? "#0000FF" : "#00ff88";
                const u = r(d.x), p = a(d.y);
                this.ctx.fillRect(u - 1, p - 1, 2, 2);
            }
            this.ctx.fillStyle = "#ff4444";
            for (const d of i){
                const c = r(d.x), u = a(d.y);
                this.ctx.fillRect(c - 1, u - 1, 2, 2);
            }
            const h = r(t), l = a(e);
            this.ctx.beginPath(), this.ctx.arc(h, l, 3, 0, Math.PI * 2), this.ctx.fillStyle = "#fff", this.ctx.fill(), this.ctx.strokeStyle = "#4facfe", this.ctx.lineWidth = 1, this.ctx.stroke();
        }
    }
    class k extends N {
        canvas;
        ctx;
        width = 250;
        height = 180;
        constructor(){
            super("Neural Network", "bottom-left", "auto"), this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height, this.canvas.style.display = "block", this.canvas.style.background = "rgba(0,0,0,0.3)", this.content.appendChild(this.canvas), this.content.style.padding = "0", this.ctx = this.canvas.getContext("2d");
        }
        draw(t) {
            if (this.isCollapsed) return;
            const e = this.width, s = this.height;
            this.ctx.clearRect(0, 0, e, s);
            const i = e * .4, o = e * .1, n = o, r = o + i, a = o + i * 2, h = s / (t.inputNodes + 1), l = s / (t.hiddenNodes + 1), d = s / (t.outputNodes + 1);
            for(let c = 0; c < t.inputNodes; c++){
                const u = t.lastInput[c] || 0;
                for(let p = 0; p < t.hiddenNodes; p++){
                    const g = t.weightsIH[p][c], m = (c + 1) * h, y = (p + 1) * l;
                    this.drawConnection(n, m, r, y, g, u);
                }
            }
            for(let c = 0; c < t.hiddenNodes; c++){
                const u = t.lastHidden[c] || 0;
                for(let p = 0; p < t.outputNodes; p++){
                    const g = t.weightsHO[p][c], m = (c + 1) * l, y = (p + 1) * d;
                    this.drawConnection(r, m, a, y, g, u);
                }
            }
            this.drawNodes(n, h, t.inputNodes, t.lastInput), this.drawNodes(r, l, t.hiddenNodes, t.lastHidden), this.drawNodes(a, d, t.outputNodes, t.lastOutput);
        }
        drawConnection(t, e, s, i, o, n) {
            const r = o * n, a = Math.min(Math.abs(o) * .1, .2), h = Math.min(Math.abs(r), 1), l = Math.max(a, h);
            l < .05 || (this.ctx.beginPath(), this.ctx.moveTo(t, e), this.ctx.lineTo(s, i), this.ctx.strokeStyle = o > 0 ? `rgba(0, 255, 136, ${l})` : `rgba(255, 68, 68, ${l})`, this.ctx.lineWidth = 1, this.ctx.stroke());
        }
        drawNodes(t, e, s, i) {
            for(let n = 0; n < s; n++){
                const r = (n + 1) * e, a = i[n] || 0;
                this.ctx.beginPath(), this.ctx.arc(t, r, 4, 0, Math.PI * 2);
                const h = Math.min(Math.abs(a), 1);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${h * .8 + .2})`, this.ctx.fill();
            }
        }
    }
    class $ {
        keys = {};
        constructor(){
            window.addEventListener("keydown", (t)=>this.keys[t.key.toLowerCase()] = !0), window.addEventListener("keyup", (t)=>this.keys[t.key.toLowerCase()] = !1);
        }
        isKeyPressed(t) {
            return this.keys[t.toLowerCase()] || !1;
        }
    }
    class z {
        world;
        boids = [];
        camera;
        renderer;
        statsPanel;
        minimapPanel;
        brainPanel;
        collisionManager;
        rng;
        debugPanel;
        isPaused = !1;
        RAPIER;
        inputManager;
        templateFoods = [];
        templatePoisons = [];
        POPULATION_SIZE = 100;
        GENERATION_DURATION = 45;
        generationTimer = 0;
        generation = 1;
        totalTime = 0;
        allTimeBestScore = 0;
        WORLD_SIZE = 3e3;
        FOOD_COUNT = 50;
        POISON_COUNT = 50;
        BOID_COLLISION_RADIUS = 15;
        constructor(t){
            const e = Math.floor(Date.now() / 36e5);
            this.rng = new B(e), console.log("World Seed:", e), this.RAPIER = t, this.world = new C(t, this.WORLD_SIZE), this.camera = new H, this.renderer = new L(this.WORLD_SIZE), this.statsPanel = new D(e, this.FOOD_COUNT, this.POISON_COUNT), this.minimapPanel = new U(this.WORLD_SIZE), this.brainPanel = new k, this.inputManager = new $, this.collisionManager = new F(this.WORLD_SIZE, this.BOID_COLLISION_RADIUS, this.rng), this.debugPanel = new G(()=>{
                this.isPaused = !this.isPaused;
            }, ()=>{
                this.resetTraining();
            }, (s)=>{
                this.fastTrain(s);
            }), this.initializePopulation(), this.loadTrainingData();
        }
        resetEnvironment() {
            this.collisionManager.generateSpawnQueue(), this.templateFoods = [], this.templatePoisons = [];
            for(let t = 0; t < this.FOOD_COUNT; t++)this.templateFoods.push(this.collisionManager.spawnFood());
            for(let t = 0; t < this.POISON_COUNT; t++)this.templatePoisons.push(this.collisionManager.spawnPoison());
            this.collisionManager.rebuildGrids(this.templateFoods, this.templatePoisons);
        }
        initializePopulation() {
            this.boids = [], this.resetEnvironment();
            for(let t = 0; t < this.POPULATION_SIZE; t++){
                const e = new A(this.RAPIER, this.world.getPhysicsWorld());
                this.resetBoid(e), this.boids.push(e);
            }
        }
        resetBoid(t) {
            t.getBody().setTranslation({
                x: 0,
                y: 0
            }, !0), t.getBody().setLinvel({
                x: 0,
                y: 0
            }, !0), t.getBody().setAngvel(0, !0), t.getBody().setRotation(0, !0), t.initializeEnvironment(this.templateFoods, this.templatePoisons);
        }
        getBestBoid() {
            let t = this.boids[0], e = -1 / 0;
            if (this.boids.length > 0) for (const s of this.boids)s.score > e && (e = s.score, t = s);
            return t;
        }
        update() {
            if (this.isPaused) {
                const e = this.getBestBoid();
                let s = 0, i = 0;
                const o = 1600;
                this.inputManager.isKeyPressed("arrowup") && (s = o, i = o), this.inputManager.isKeyPressed("arrowleft") && (i = o), this.inputManager.isKeyPressed("arrowright") && (s = o);
                for (const n of this.boids)this.world.wrapPosition(n.getBody()), n === e ? (n.setThrustersManual(s, i), n.applyThrusterForces()) : (n.getBody().setLinvel({
                    x: 0,
                    y: 0
                }, !0), n.getBody().setAngvel(0, !0));
                this.world.step();
                return;
            }
            this.generationTimer += 1 / 60, this.generationTimer > this.GENERATION_DURATION && this.evolve(), this.totalTime += 1 / 60, this.world.step();
            let t = 0;
            for (const e of this.boids)this.world.wrapPosition(e.getBody()), e.updateThrusters(), e.isDead || (t++, e.updateSensors(this.WORLD_SIZE, this.collisionManager), e.checkCollisions(this.collisionManager));
            (this.generationTimer > this.GENERATION_DURATION || t <= 1) && this.evolve();
        }
        evolve() {
            this.boids.sort((i, o)=>o.score - i.score);
            const t = this.boids[0].score;
            t > this.allTimeBestScore && (this.allTimeBestScore = t), console.log(`Generation ${this.generation} complete. Survivors: ${this.boids.filter((i)=>!i.isDead).length}. Best Score: ${t}.`), this.resetEnvironment();
            const e = Math.floor(this.POPULATION_SIZE * .1), s = Math.floor(this.POPULATION_SIZE * .5);
            for(let i = 0; i < e; i++)this.resetBoid(this.boids[i]);
            for(let i = e; i < this.POPULATION_SIZE; i++){
                const o = Math.floor(this.rng.random() * s), n = Math.floor(this.rng.random() * s), r = this.boids[o], a = this.boids[n], h = this.boids[i];
                h.brain = r.brain.crossover(a.brain), h.brain.mutate(.1, .2), this.resetBoid(h);
            }
            this.generation++, this.generationTimer = 0, this.saveTrainingData();
        }
        saveTrainingData() {
            const t = this.boids.map((s)=>s.brain.toJSON()), e = {
                generation: this.generation,
                totalTime: this.totalTime,
                allTimeBestScore: this.allTimeBestScore,
                brains: t
            };
            localStorage.setItem("boid_training_data", JSON.stringify(e)), console.log("Training data saved for Gen " + this.generation);
        }
        isValidData(t) {
            if (!t || !t.generation || !t.brains) return !1;
            const e = t.brains[0]?.inputNodes, s = t.brains[0]?.outputNodes, i = this.boids[0]?.brain.inputNodes, o = this.boids[0]?.brain.outputNodes;
            return e !== i || s !== o ? (console.log(`Data (Gen ${t.generation}) ignored due to architecture mismatch (Saved: ${e}->${s}, Current: ${i}->${o})`), !1) : !0;
        }
        async loadTrainingData() {
            console.log("Checking for training data...");
            let t = null, e = null;
            try {
                const r = await fetch("./localStorage.json");
                if (r.ok) {
                    const a = await r.text();
                    t = JSON.parse(a);
                }
            } catch  {
                console.log("No valid localStorage.json file found.");
            }
            try {
                const r = localStorage.getItem("boid_training_data");
                r && (e = JSON.parse(r));
            } catch  {
                console.log("Error reading browser localStorage.");
            }
            const s = this.isValidData(t), i = this.isValidData(e), o = s ? t.generation : -1, n = i ? e.generation : -1;
            if (console.log(`Found Data - File Gen: ${o} (${s ? "Valid" : "Invalid"}), Browser Gen: ${n} (${i ? "Valid" : "Invalid"})`), o === -1 && n === -1) {
                console.log("No valid training data found. Starting fresh.");
                return;
            }
            n >= o ? (console.log(`Loading from browser localStorage (Gen ${n})`), this.applyData(e)) : (console.log(`Loading from localStorage.json (Gen ${o})`), this.applyData(t));
        }
        applyData(t) {
            if (this.generation = t.generation, this.totalTime = t.totalTime || 0, this.allTimeBestScore = t.allTimeBestScore || 0, console.log("Applying training data. Gen: " + this.generation), t.brains && Array.isArray(t.brains)) {
                if (t.brains.length > 0 && (t.brains[0].inputNodes !== this.boids[0].brain.inputNodes || t.brains[0].outputNodes !== this.boids[0].brain.outputNodes)) {
                    console.warn("Architecture mismatch. Resetting..."), this.resetTraining();
                    return;
                }
                for(let e = 0; e < this.POPULATION_SIZE; e++)t.brains[e] ? this.boids[e].brain = b.fromJSON(t.brains[e]) : e > 0 && (this.boids[e].brain = this.boids[0].brain.copy(), this.boids[e].brain.mutate(.05, .1));
            } else if (t.bestBrain) {
                if (t.bestBrain && (t.bestBrain.inputNodes !== this.boids[0].brain.inputNodes || t.bestBrain.outputNodes !== this.boids[0].brain.outputNodes)) {
                    console.warn("Architecture mismatch. Resetting..."), this.resetTraining();
                    return;
                }
                const e = b.fromJSON(t.bestBrain);
                this.boids[0].brain = e.copy();
                for(let s = 1; s < this.POPULATION_SIZE; s++)this.boids[s].brain = e.copy(), this.boids[s].brain.mutate(.05, .1);
            }
        }
        resetTraining() {
            localStorage.removeItem("boid_training_data"), this.generation = 1, this.generationTimer = 0, this.totalTime = 0, this.allTimeBestScore = 0, this.initializePopulation(), console.log("Training reset.");
        }
        fastTrain(t) {
            const e = this.GENERATION_DURATION * 60, s = t * e;
            console.log(`Starting fast training for ${t} generations (${s} steps)...`);
            const i = performance.now(), o = this.generation + t;
            let n = 0;
            const r = s * 2;
            for(; this.generation < o && n < r;)this.update(), n++;
            const a = performance.now() - i;
            console.log(`Fast training complete. Advanced to Gen ${this.generation}. Took ${a.toFixed(0)}ms.`), this.draw();
        }
        lastBestBoid = null;
        draw() {
            this.renderer.clear();
            let t = this.getBestBoid();
            const e = t.getPosition();
            this.lastBestBoid === t ? Math.sqrt(Math.pow(e.x - this.camera.x, 2) + Math.pow(e.y - this.camera.y, 2)) > this.WORLD_SIZE / 3 ? this.camera.snap(e.x, e.y) : this.camera.follow(e.x, e.y) : (this.camera.follow(e.x, e.y), this.lastBestBoid = t), this.renderer.drawWorld(this.camera, t.foods, t.poisons, t.eatenFoodHistory), this.renderer.drawBoids(this.boids, this.camera, t), this.minimapPanel.draw(e.x, e.y, t.foods, t.poisons, t.eatenFoodHistory), this.brainPanel.draw(t.brain), this.statsPanel.updateStats(t.getLeftThrusterPercent(), t.getRightThrusterPercent(), t.getVelocity(), t.getAngularVelocity(), this.generation, Math.floor(this.GENERATION_DURATION - this.generationTimer), Math.floor(t.score), 0);
            const s = this.boids.filter((i)=>!i.isDead).length;
            this.debugPanel.update(this.generation, s, t.score, this.allTimeBestScore, Math.max(0, this.GENERATION_DURATION - this.generationTimer), this.totalTime);
        }
        loop = ()=>{
            this.update(), this.draw(), requestAnimationFrame(this.loop);
        };
        start() {
            console.log("Starting game loop..."), this.loop();
        }
    }
    class W extends N {
        lines = [];
        MAX_LINES = 100;
        originalConsoleLog;
        constructor(){
            super("Console Output", "bottom-right", "600px", "200px"), this.originalConsoleLog = console.log.bind(console), console.log = (...s)=>{
                this.originalConsoleLog(...s), this.addLine(s.map((i)=>this.stringify(i)).join(" "));
            };
            const t = console.warn.bind(console);
            console.warn = (...s)=>{
                t(...s), this.addLine("[WARN] " + s.map((i)=>this.stringify(i)).join(" "), "#ffaa00");
            };
            const e = console.error.bind(console);
            console.error = (...s)=>{
                e(...s), this.addLine("[ERROR] " + s.map((i)=>this.stringify(i)).join(" "), "#ff4444");
            };
        }
        stringify(t) {
            if (typeof t == "string") return t;
            if (typeof t == "number" || typeof t == "boolean") return String(t);
            try {
                return JSON.stringify(t);
            } catch  {
                return String(t);
            }
        }
        addLine(t, e = "#00ff00") {
            const s = new Date, i = `${s.getHours().toString().padStart(2, "0")}:${s.getMinutes().toString().padStart(2, "0")}:${s.getSeconds().toString().padStart(2, "0")}`;
            this.lines.push(`<span style="color:#666">[${i}]</span> <span style="color:${e}">${this.escapeHtml(t)}</span>`), this.lines.length > this.MAX_LINES && this.lines.shift(), this.content.innerHTML = this.lines.join("<br>"), this.content.scrollTop = this.content.scrollHeight;
        }
        escapeHtml(t) {
            const e = document.createElement("div");
            return e.textContent = t, e.innerHTML;
        }
    }
    async function Z() {
        new W, console.log("Starting boid simulation...");
        const f = await _(()=>import("./rapier-D9GItMpu.js"), [], import.meta.url);
        f.init && await f.init(), console.log("RAPIER module ready"), new z(f).start();
    }
    Z().catch(console.error);
})();
