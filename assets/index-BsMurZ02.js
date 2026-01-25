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
    const N = "modulepreload", E = function(f, t) {
        return new URL(f, t).href;
    }, T = {}, O = function(t, e, i) {
        let s = Promise.resolve();
        if (e && e.length > 0) {
            const n = document.getElementsByTagName("link"), r = document.querySelector("meta[property=csp-nonce]"), a = r?.nonce || r?.getAttribute("nonce");
            s = Promise.allSettled(e.map((h)=>{
                if (h = E(h, i), h in T) return;
                T[h] = !0;
                const l = h.endsWith(".css"), p = l ? '[rel="stylesheet"]' : "";
                if (!!i) for(let c = n.length - 1; c >= 0; c--){
                    const g = n[c];
                    if (g.href === h && (!l || g.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${h}"]${p}`)) return;
                const d = document.createElement("link");
                if (d.rel = l ? "stylesheet" : N, l || (d.as = "script"), d.crossOrigin = "", d.href = h, a && d.setAttribute("nonce", a), document.head.appendChild(d), l) return new Promise((c, g)=>{
                    d.addEventListener("load", c), d.addEventListener("error", ()=>g(new Error(`Unable to preload CSS for ${h}`)));
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
    class P {
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
    class I {
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
    class R {
        body;
        leftThruster = 0;
        rightThruster = 0;
        THRUSTER_MAX = 1600;
        sensors = [];
        SENSOR_COUNT = 7;
        SENSOR_ANGLE_SPREAD = Math.PI * .5;
        SENSOR_LENGTH = 600;
        brain;
        INPUT_NODES = 17;
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
            const i = t.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(.8).setAngularDamping(2.5);
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
                const o = i + Math.PI / 2 + s.angle, n = Math.cos(o), r = Math.sin(o), a = e.x, h = e.y;
                let l = this.SENSOR_LENGTH, p = "NONE";
                for (const u of this.foods){
                    if (this.eatenFoodHistory.includes(u)) continue;
                    let d = u.x - a, c = u.y - h;
                    d > t / 2 && (d -= t), d < -t / 2 && (d += t), c > t / 2 && (c -= t), c < -t / 2 && (c += t);
                    const g = a + d, m = h + c, y = this.rayCircleIntersect(a, h, n, r, g, m, u.radius);
                    y !== null && y < l && (l = y, p = "FOOD");
                }
                for (const u of this.poisons){
                    let d = u.x - a, c = u.y - h;
                    d > t / 2 && (d -= t), d < -t / 2 && (d += t), c > t / 2 && (c -= t), c < -t / 2 && (c += t);
                    const g = a + d, m = h + c, y = this.rayCircleIntersect(a, h, n, r, g, m, u.radius);
                    y !== null && y < l && (l = y, p = "POISON");
                }
                s.reading = 1 - l / this.SENSOR_LENGTH, s.detectedType = p, s.endX = a + n * l, s.endY = h + r * l;
            }
        }
        rayCircleIntersect(t, e, i, s, o, n, r) {
            const a = o - t, h = n - e, l = a * i + h * s;
            let p = t + i * l, u = e + s * l;
            const d = (p - o) * (p - o) + (u - n) * (u - n);
            if (d > r * r) return null;
            const c = Math.sqrt(r * r - d), g = l - c;
            return g < 0 || g > this.SENSOR_LENGTH ? null : g;
        }
        initializeEnvironment(t, e) {
            this.foods = t, this.poisons = e, this.eatenFoodHistory = [], this.score = 0, this.timeAlive = 0, this.life = 100, this.isDead = !1, this.body.setLinvel({
                x: 0,
                y: 0
            }, !0), this.body.setAngvel(0, !0);
        }
        checkCollisions(t) {
            const e = this.getPosition(), i = 15;
            for (const o of this.poisons)o.isColliding(e.x, e.y, i) && (this.score -= 2, this.life -= 2);
            for (const o of this.foods)this.eatenFoodHistory.includes(o) || o.isColliding(e.x, e.y, i) && (this.score += 25, this.life += 20, this.life > this.MAX_LIFE && (this.life = this.MAX_LIFE), this.eatenFoodHistory.push(o), this.eatenFoodHistory.length > this.MEMORY_SIZE && this.eatenFoodHistory.shift());
            this.score += 1 / 60, this.timeAlive += 1 / 60;
            let s = 0;
            for (const o of this.sensors)o.detectedType === "FOOD" && (s += o.reading * .01);
            this.score += s, this.life -= this.LIFE_DECAY_RATE / 60, this.life <= 0 && (this.life = 0, this.isDead = !0);
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
            const e = this.body.linvel(), i = this.body.angvel(), s = this.body.rotation(), o = e.x * -Math.sin(s) + e.y * Math.cos(s), n = e.x * Math.cos(s) + e.y * Math.sin(s);
            t.push(.5 + .5 * Math.tanh(o * .05)), t.push(.5 + .5 * Math.tanh(n * .05)), t.push(.5 + .5 * Math.tanh(i * .5)), this.lastInputs = t;
            const r = this.brain.feedForward(t);
            this.leftThruster = r[0] * this.THRUSTER_MAX, this.rightThruster = r[1] * this.THRUSTER_MAX;
        }
        setThrustersManual(t, e) {
            this.leftThruster = t, this.rightThruster = e;
        }
        applyThrusterForces() {
            const t = this.body.rotation(), e = -Math.sin(t), i = Math.cos(t), s = {
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
                const a = n(s, t);
                this.body.applyImpulseAtPoint({
                    x: e * this.leftThruster * .1,
                    y: i * this.leftThruster * .1
                }, {
                    x: r.x + a.x,
                    y: r.y + a.y
                }, !0);
            }
            if (this.rightThruster > 0) {
                const a = n(o, t);
                this.body.applyImpulseAtPoint({
                    x: e * this.rightThruster * .1,
                    y: i * this.rightThruster * .1
                }, {
                    x: r.x + a.x,
                    y: r.y + a.y
                }, !0);
            }
        }
        draw(t, e = !1) {
            const i = this.getPosition();
            if (!this.isDead && e) {
                t.save(), t.lineWidth = 1;
                for (const o of this.sensors)o.detectedType === "FOOD" ? t.strokeStyle = `rgba(0, 255, 0, ${o.reading})` : o.detectedType === "POISON" ? t.strokeStyle = `rgba(255, 0, 0, ${o.reading})` : t.strokeStyle = "rgba(200, 200, 200, 0.2)", t.beginPath(), t.moveTo(0, 0), t.lineTo(o.endX - i.x, o.endY - i.y), t.stroke();
                t.restore();
            }
            if (t.save(), t.rotate(this.body.rotation()), t.beginPath(), t.moveTo(0, 15), t.lineTo(-10, -10), t.lineTo(10, -10), t.closePath(), t.closePath(), this.isDead ? (t.fillStyle = "#555", t.strokeStyle = "#ff0000") : (t.fillStyle = "#fff", t.strokeStyle = "#4facfe"), t.fill(), t.lineWidth = 2, t.stroke(), !this.isDead) {
                const r = this.life / this.MAX_LIFE;
                t.fillStyle = "rgba(255, 0, 0, 0.7)", t.fillRect(-30 / 2, 20, 30, 4), t.fillStyle = "rgba(0, 255, 0, 0.7)", t.fillRect(-30 / 2, 20, 30 * r, 4);
            }
            const s = 30;
            if (this.leftThruster > 0) {
                const o = this.leftThruster / this.THRUSTER_MAX * s;
                t.beginPath(), t.moveTo(-7, -10), t.lineTo(-7, -10 - o), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
            }
            if (this.rightThruster > 0) {
                const o = this.rightThruster / this.THRUSTER_MAX * s;
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
    class v {
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
    class M {
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
        drawWorld(t, e, i, s = []) {
            this.ctx.save(), this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2), this.ctx.scale(1, -1), this.ctx.save(), this.ctx.translate(-t.x, -t.y), this.drawGrid(), this.drawBorders(), e.forEach((o)=>{
                const n = s.includes(o);
                this.drawItemWithGhosts(o, t.x, t.y, n ? "#0000FF" : void 0);
            }), i.forEach((o)=>this.drawItemWithGhosts(o, t.x, t.y)), this.ctx.restore(), this.ctx.restore();
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
        drawItemWithGhosts(t, e, i, s) {
            const o = Math.max(this.canvas.width, this.canvas.height) / 2 + 100, n = this.worldSize / 2, r = ()=>{
                s ? (this.ctx.fillStyle = s, this.ctx.beginPath(), this.ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2), this.ctx.fill()) : t.draw(this.ctx);
            };
            r();
            const a = [];
            t.x - e < -n + o && a.push({
                dx: this.worldSize,
                dy: 0
            }), t.x - e > n - o && a.push({
                dx: -this.worldSize,
                dy: 0
            }), t.y - i < -n + o && a.push({
                dx: 0,
                dy: this.worldSize
            }), t.y - i > n - o && a.push({
                dx: 0,
                dy: -this.worldSize
            });
            for (const h of a)this.ctx.save(), this.ctx.translate(h.dx, h.dy), r(), this.ctx.restore();
        }
        drawBoids(t, e, i) {
            this.ctx.save(), this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2), this.ctx.scale(1, -1), this.ctx.translate(-e.x, -e.y);
            const s = Math.max(this.canvas.width, this.canvas.height) / 2 + 100, o = this.worldSize / 2;
            t.forEach((n)=>{
                const r = n === i, a = r ? 1 : .3;
                this.ctx.globalAlpha = a, this.drawBoidWithGhosts(n, e.x, e.y, s, o, r), this.ctx.globalAlpha = 1;
            }), this.ctx.restore();
        }
        drawBoidWithGhosts(t, e, i, s, o, n = !1) {
            const r = t.getPosition(), a = (l, p)=>{
                this.ctx.save(), this.ctx.translate(l, p), t.draw(this.ctx, n), this.ctx.restore();
            };
            a(r.x, r.y);
            const h = [];
            r.x - e < -o + s && h.push({
                dx: this.worldSize,
                dy: 0
            }), r.x - e > o - s && h.push({
                dx: -this.worldSize,
                dy: 0
            }), r.y - i < -o + s && h.push({
                dx: 0,
                dy: this.worldSize
            }), r.y - i > o - s && h.push({
                dx: 0,
                dy: -this.worldSize
            });
            for (const l of h)a(r.x + l.dx, r.y + l.dy);
        }
    }
    class w {
        element;
        content;
        toggleBtn;
        isCollapsed = !1;
        constructor(t, e, i = "300px", s = "auto"){
            this.element = document.createElement("div"), this.element.className = `game-panel panel-${e}`, this.element.style.width = i, s !== "auto" && (this.element.style.height = s);
            const o = document.createElement("div");
            o.className = "panel-header";
            const n = document.createElement("div");
            n.className = "panel-title", n.innerHTML = `<span>${t}</span>`, this.toggleBtn = document.createElement("span"), this.toggleBtn.className = "panel-toggle", this.toggleBtn.innerHTML = "−", o.appendChild(n), o.appendChild(this.toggleBtn), o.onclick = ()=>this.toggleCollapse(), this.element.appendChild(o), this.content = document.createElement("div"), this.content.className = "panel-content", this.element.appendChild(this.content), document.body.appendChild(this.element);
        }
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed, this.element.classList.toggle("collapsed", this.isCollapsed), this.toggleBtn.innerHTML = this.isCollapsed ? "+" : "−";
        }
        createRow(t, e = "") {
            const i = document.createElement("div");
            i.style.display = "flex", i.style.justifyContent = "space-between", i.style.marginBottom = "2px";
            const s = document.createElement("span");
            s.style.opacity = "0.7", s.innerText = t;
            const o = document.createElement("span");
            return o.style.fontWeight = "bold", o.innerText = e, i.appendChild(s), i.appendChild(o), this.content.appendChild(i), o;
        }
    }
    class B extends w {
        leftStat;
        rightStat;
        velStat;
        rotStat;
        foodStat;
        poisonStat;
        collectedStat;
        constructor(t, e, i){
            super("Boid Systems", "top-left", "260px"), this.element.style.display = "none", this.createRow("Seed:", t.toString()), this.addSeparator(), this.leftStat = this.createRow("Left Thruster:", "0%"), this.rightStat = this.createRow("Right Thruster:", "0%"), this.velStat = this.createRow("Velocity:", "0"), this.rotStat = this.createRow("Rotation Power:", "0"), this.addSeparator(), this.foodStat = this.createRow("Food:", e.toString()), this.poisonStat = this.createRow("Poison:", i.toString()), this.collectedStat = this.createRow("Collected:", "0");
            const s = document.createElement("div");
            s.style.marginTop = "10px", s.style.fontSize = "10px", s.style.opacity = "0.5", s.innerText = "Q/A: Left | W/S: Right", this.content.appendChild(s);
        }
        addSeparator() {
            const t = document.createElement("div");
            t.style.height = "1px", t.style.background = "rgba(255, 255, 255, 0.1)", t.style.margin = "8px 0", this.content.appendChild(t);
        }
        updateStats(t, e, i, s, o, n, r, a) {
            this.leftStat.innerText = `${Math.round(t)}%`, this.rightStat.innerText = `${Math.round(e)}%`;
            const h = Math.sqrt(i.x * i.x + i.y * i.y), l = Math.round(Math.atan2(i.y, i.x) * 180 / Math.PI);
            this.velStat.innerText = `${Math.round(h)} | ${l}°`, this.rotStat.innerText = s.toFixed(2), this.foodStat.innerText = o.toString(), this.poisonStat.innerText = n.toString(), this.collectedStat.innerText = `${r} / ${a}`;
        }
        updateEnvironment(t, e) {
            this.foodStat.innerText = t.toString(), this.poisonStat.innerText = e.toString();
        }
    }
    class b {
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
    class x {
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
    class _ {
        foodCollected = 0;
        poisonCollected = 0;
        collisionRadius;
        worldSize;
        rng;
        foodSpawnQueue = [];
        poisonSpawnQueue = [];
        QUEUE_SIZE = 500;
        constructor(t, e, i){
            this.worldSize = t, this.collisionRadius = e, this.rng = i;
        }
        generateSpawnQueue() {
            this.foodSpawnQueue = [], this.poisonSpawnQueue = [];
            const t = this.worldSize / 2;
            for(let e = 0; e < this.QUEUE_SIZE; e++)this.foodSpawnQueue.push({
                x: this.rng.randomRange(-t + 50, t - 50),
                y: this.rng.randomRange(-t + 50, t - 50)
            });
        }
        checkCollisions(t, e, i, s) {
            for(let o = i.length - 1; o >= 0; o--)i[o].isColliding(t, e, this.collisionRadius) && (i.splice(o, 1), i.push(this.spawnFood()), this.foodCollected++);
            for(let o = s.length - 1; o >= 0; o--)s[o].isColliding(t, e, this.collisionRadius) && (s.splice(o, 1), s.push(this.spawnPoison()), this.poisonCollected++);
        }
        spawnFood() {
            const t = this.worldSize / 2, e = this.rng.randomRange(-t + 50, t - 50), i = this.rng.randomRange(-t + 50, t - 50);
            return new b(e, i, 30);
        }
        spawnPoison() {
            const t = this.worldSize / 2, e = 250;
            let i, s, o;
            do i = this.rng.randomRange(-t + 50, t - 50), s = this.rng.randomRange(-t + 50, t - 50), o = Math.sqrt(i * i + s * s);
            while (o < e);
            return new x(i, s, 30);
        }
        spawnFoodFromQueue(t) {
            const e = this.foodSpawnQueue[t % this.QUEUE_SIZE];
            return new b(e.x, e.y, 30);
        }
        spawnPoisonFromQueue(t) {
            const e = this.poisonSpawnQueue[t % this.QUEUE_SIZE];
            return new x(e.x, e.y, 30);
        }
        getFoodCollected() {
            return this.foodCollected;
        }
        getPoisonCollected() {
            return this.poisonCollected;
        }
    }
    class C extends w {
        pauseBtn;
        onPauseToggle;
        isPaused = !1;
        resetBtn;
        onReset;
        trainInput;
        trainBtn;
        onFastTrain;
        constructor(t, e, i){
            super("Simulation Control", "top-left", "280px"), this.onPauseToggle = t, this.onReset = e, this.onFastTrain = i, this.setupControls();
        }
        setupControls() {
            const t = document.createElement("div");
            t.style.display = "flex", t.style.flexDirection = "column", t.style.gap = "8px", t.style.marginBottom = "0";
            const e = document.createElement("div");
            e.style.display = "flex", e.style.gap = "5px", this.pauseBtn = document.createElement("button"), this.pauseBtn.innerText = "PAUSE", this.pauseBtn.className = "panel-btn", this.pauseBtn.style.flex = "1", this.pauseBtn.onclick = ()=>this.togglePause(), this.resetBtn = document.createElement("button"), this.resetBtn.innerText = "RESET", this.resetBtn.className = "panel-btn", this.resetBtn.style.flex = "1", this.resetBtn.style.color = "#ff8888", this.resetBtn.style.borderColor = "#ff8888", this.resetBtn.onclick = ()=>{
                confirm("Reset training? Data will be lost.") && this.onReset();
            }, e.appendChild(this.pauseBtn), e.appendChild(this.resetBtn), t.appendChild(e);
            const i = document.createElement("div");
            i.style.display = "flex", i.style.gap = "5px", this.trainInput = document.createElement("input"), this.trainInput.type = "number", this.trainInput.value = "5", this.trainInput.className = "panel-input", this.trainInput.style.width = "50px", this.trainBtn = document.createElement("button"), this.trainBtn.innerText = "FAST TRAIN", this.trainBtn.className = "panel-btn", this.trainBtn.style.flex = "1", this.trainBtn.onclick = ()=>{
                const s = parseInt(this.trainInput.value) || 1;
                this.trainBtn.disabled = !0, this.trainBtn.innerText = "TRAINING...", setTimeout(()=>{
                    this.onFastTrain(s), this.trainBtn.disabled = !1, this.trainBtn.innerText = "FAST TRAIN";
                }, 50);
            }, i.appendChild(this.trainInput), i.appendChild(this.trainBtn), t.appendChild(i), this.content.appendChild(t);
        }
        togglePause() {
            this.isPaused = !this.isPaused, this.pauseBtn.innerText = this.isPaused ? "RESUME" : "PAUSE", this.onPauseToggle();
        }
        update(t, e, i, s, o, n) {}
    }
    class A extends w {
        canvas;
        ctx;
        SIZE = 200;
        worldSize;
        constructor(t){
            super("Minimap", "top-right", "auto"), this.worldSize = t, this.canvas = document.createElement("canvas"), this.canvas.width = this.SIZE, this.canvas.height = this.SIZE, this.canvas.style.display = "block", this.canvas.style.background = "#000", this.canvas.style.border = "1px solid #333", this.content.appendChild(this.canvas), this.content.style.padding = "5px", this.ctx = this.canvas.getContext("2d");
        }
        draw(t, e, i, s, o = []) {
            if (this.isCollapsed) return;
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)", this.ctx.fillRect(0, 0, this.SIZE, this.SIZE);
            const n = this.SIZE / this.worldSize, r = (p)=>(p + this.worldSize / 2) * n, a = (p)=>(this.worldSize / 2 - p) * n;
            for (const p of i){
                const u = o.includes(p);
                this.ctx.fillStyle = u ? "#0000FF" : "#00ff88";
                const d = r(p.x), c = a(p.y);
                this.ctx.fillRect(d - 1, c - 1, 2, 2);
            }
            this.ctx.fillStyle = "#ff4444";
            for (const p of s){
                const u = r(p.x), d = a(p.y);
                this.ctx.fillRect(u - 1, d - 1, 2, 2);
            }
            const h = r(t), l = a(e);
            this.ctx.beginPath(), this.ctx.arc(h, l, 3, 0, Math.PI * 2), this.ctx.fillStyle = "#fff", this.ctx.fill(), this.ctx.strokeStyle = "#4facfe", this.ctx.lineWidth = 1, this.ctx.stroke();
        }
    }
    class H extends w {
        canvas;
        ctx;
        width = 250;
        height = 180;
        constructor(){
            super("Neural Network", "bottom-left", "auto"), this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height, this.canvas.style.display = "block", this.canvas.style.background = "rgba(0,0,0,0.3)", this.content.appendChild(this.canvas), this.content.style.padding = "0", this.ctx = this.canvas.getContext("2d");
        }
        draw(t) {
            if (this.isCollapsed) return;
            const e = this.width, i = this.height;
            this.ctx.clearRect(0, 0, e, i);
            const s = e * .4, o = e * .1, n = o, r = o + s, a = o + s * 2, h = i / (t.inputNodes + 1), l = i / (t.hiddenNodes + 1), p = i / (t.outputNodes + 1);
            for(let u = 0; u < t.inputNodes; u++){
                const d = t.lastInput[u] || 0;
                for(let c = 0; c < t.hiddenNodes; c++){
                    const g = t.weightsIH[c][u], m = (u + 1) * h, y = (c + 1) * l;
                    this.drawConnection(n, m, r, y, g, d);
                }
            }
            for(let u = 0; u < t.hiddenNodes; u++){
                const d = t.lastHidden[u] || 0;
                for(let c = 0; c < t.outputNodes; c++){
                    const g = t.weightsHO[c][u], m = (u + 1) * l, y = (c + 1) * p;
                    this.drawConnection(r, m, a, y, g, d);
                }
            }
            this.drawNodes(n, h, t.inputNodes, t.lastInput), this.drawNodes(r, l, t.hiddenNodes, t.lastHidden), this.drawNodes(a, p, t.outputNodes, t.lastOutput);
        }
        drawConnection(t, e, i, s, o, n) {
            const r = o * n, a = Math.min(Math.abs(o) * .1, .2), h = Math.min(Math.abs(r), 1), l = Math.max(a, h);
            l < .05 || (this.ctx.beginPath(), this.ctx.moveTo(t, e), this.ctx.lineTo(i, s), this.ctx.strokeStyle = o > 0 ? `rgba(0, 255, 136, ${l})` : `rgba(255, 68, 68, ${l})`, this.ctx.lineWidth = 1, this.ctx.stroke());
        }
        drawNodes(t, e, i, s) {
            for(let n = 0; n < i; n++){
                const r = (n + 1) * e, a = s[n] || 0;
                this.ctx.beginPath(), this.ctx.arc(t, r, 4, 0, Math.PI * 2);
                const h = Math.min(Math.abs(a), 1);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${h * .8 + .2})`, this.ctx.fill();
            }
        }
    }
    class D {
        keys = {};
        constructor(){
            window.addEventListener("keydown", (t)=>this.keys[t.key.toLowerCase()] = !0), window.addEventListener("keyup", (t)=>this.keys[t.key.toLowerCase()] = !1);
        }
        isKeyPressed(t) {
            return this.keys[t.toLowerCase()] || !1;
        }
    }
    class L {
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
        POPULATION_SIZE = 50;
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
            this.rng = new P(e), console.log("World Seed:", e), this.RAPIER = t, this.world = new I(t, this.WORLD_SIZE), this.camera = new v, this.renderer = new M(this.WORLD_SIZE), this.statsPanel = new B(e, this.FOOD_COUNT, this.POISON_COUNT), this.minimapPanel = new A(this.WORLD_SIZE), this.brainPanel = new H, this.inputManager = new D, this.collisionManager = new _(this.WORLD_SIZE, this.BOID_COLLISION_RADIUS, this.rng), this.debugPanel = new C(()=>{
                this.isPaused = !this.isPaused;
            }, ()=>{
                this.resetTraining();
            }, (i)=>{
                this.fastTrain(i);
            }), this.initializePopulation(), this.loadTrainingData();
        }
        resetEnvironment() {
            this.collisionManager.generateSpawnQueue(), this.templateFoods = [], this.templatePoisons = [];
            for(let t = 0; t < this.FOOD_COUNT; t++)this.templateFoods.push(this.collisionManager.spawnFood());
            for(let t = 0; t < this.POISON_COUNT; t++)this.templatePoisons.push(this.collisionManager.spawnPoison());
        }
        initializePopulation() {
            this.boids = [], this.resetEnvironment();
            for(let t = 0; t < this.POPULATION_SIZE; t++){
                const e = new R(this.RAPIER, this.world.getPhysicsWorld());
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
            if (this.boids.length > 0) for (const i of this.boids)i.score > e && (e = i.score, t = i);
            return t;
        }
        update() {
            if (this.isPaused) {
                const e = this.getBestBoid();
                let i = 0, s = 0;
                const o = 1600;
                this.inputManager.isKeyPressed("arrowup") && (i = o, s = o), this.inputManager.isKeyPressed("arrowleft") && (s = o), this.inputManager.isKeyPressed("arrowright") && (i = o);
                for (const n of this.boids)this.world.wrapPosition(n.getBody()), n === e ? (n.setThrustersManual(i, s), n.applyThrusterForces()) : (n.getBody().setLinvel({
                    x: 0,
                    y: 0
                }, !0), n.getBody().setAngvel(0, !0));
                this.world.step();
                return;
            }
            this.generationTimer += 1 / 60, this.generationTimer > this.GENERATION_DURATION && this.evolve(), this.totalTime += 1 / 60, this.world.step();
            let t = 0;
            for (const e of this.boids)this.world.wrapPosition(e.getBody()), e.updateThrusters(), e.isDead || (t++, e.updateSensors(this.WORLD_SIZE), e.checkCollisions(this.collisionManager));
            (this.generationTimer > this.GENERATION_DURATION || t <= 1) && this.evolve();
        }
        evolve() {
            this.boids.sort((s, o)=>o.score - s.score);
            const t = this.boids[0].score;
            t > this.allTimeBestScore && (this.allTimeBestScore = t), console.log(`Generation ${this.generation} complete. Survivors: ${this.boids.filter((s)=>!s.isDead).length}. Best Score: ${t}.`), this.resetEnvironment();
            const e = Math.floor(this.POPULATION_SIZE * .1), i = Math.floor(this.POPULATION_SIZE * .5);
            for(let s = 0; s < e; s++)this.resetBoid(this.boids[s]);
            for(let s = e; s < this.POPULATION_SIZE; s++){
                const o = Math.floor(this.rng.random() * i), n = this.boids[o], r = this.boids[s];
                r.copyBrainFrom(n), r.brain.mutate(.05, .1), this.resetBoid(r);
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
        async loadTrainingData() {
            console.log("Checking for training data...");
            let t = null, e = null;
            try {
                const o = await fetch("./localStorage.json");
                if (o.ok) {
                    const n = await o.text();
                    t = JSON.parse(n);
                }
            } catch  {
                console.log("No valid localStorage.json file found.");
            }
            try {
                const o = localStorage.getItem("boid_training_data");
                o && (e = JSON.parse(o));
            } catch  {
                console.log("Error reading browser localStorage.");
            }
            const i = t?.generation || -1, s = e?.generation || -1;
            if (console.log(`Found Data - File Gen: ${i}, Browser Gen: ${s}`), i === -1 && s === -1) {
                console.log("No training data found. Starting fresh.");
                return;
            }
            i >= s ? (console.log(`Loading from localStorage.json (Gen ${i})`), this.applyData(t)) : (console.log(`Loading from browser localStorage (Gen ${s})`), this.applyData(e));
        }
        applyData(t) {
            if (this.generation = t.generation, this.totalTime = t.totalTime || 0, this.allTimeBestScore = t.allTimeBestScore || 0, console.log("Applying training data. Gen: " + this.generation), t.brains && Array.isArray(t.brains)) {
                if (t.brains.length > 0 && (t.brains[0].inputNodes !== this.boids[0].brain.inputNodes || t.brains[0].outputNodes !== this.boids[0].brain.outputNodes)) {
                    console.warn("Architecture mismatch. Resetting..."), this.resetTraining();
                    return;
                }
                for(let e = 0; e < this.POPULATION_SIZE; e++)t.brains[e] ? this.boids[e].brain = S.fromJSON(t.brains[e]) : e > 0 && (this.boids[e].brain = this.boids[0].brain.copy(), this.boids[e].brain.mutate(.05, .1));
            } else if (t.bestBrain) {
                if (t.bestBrain && (t.bestBrain.inputNodes !== this.boids[0].brain.inputNodes || t.bestBrain.outputNodes !== this.boids[0].brain.outputNodes)) {
                    console.warn("Architecture mismatch. Resetting..."), this.resetTraining();
                    return;
                }
                const e = S.fromJSON(t.bestBrain);
                this.boids[0].brain = e.copy();
                for(let i = 1; i < this.POPULATION_SIZE; i++)this.boids[i].brain = e.copy(), this.boids[i].brain.mutate(.05, .1);
            }
        }
        resetTraining() {
            localStorage.removeItem("boid_training_data"), this.generation = 1, this.generationTimer = 0, this.totalTime = 0, this.allTimeBestScore = 0, this.initializePopulation(), console.log("Training reset.");
        }
        fastTrain(t) {
            const e = this.GENERATION_DURATION * 60, i = t * e;
            console.log(`Starting fast training for ${t} generations (${i} steps)...`);
            const s = performance.now(), o = this.generation + t;
            let n = 0;
            const r = i * 2;
            for(; this.generation < o && n < r;)this.update(), n++;
            const a = performance.now() - s;
            console.log(`Fast training complete. Advanced to Gen ${this.generation}. Took ${a.toFixed(0)}ms.`), this.draw();
        }
        lastBestBoid = null;
        draw() {
            this.renderer.clear();
            let t = this.getBestBoid();
            const e = t.getPosition();
            this.lastBestBoid === t ? Math.sqrt(Math.pow(e.x - this.camera.x, 2) + Math.pow(e.y - this.camera.y, 2)) > this.WORLD_SIZE / 3 ? this.camera.snap(e.x, e.y) : this.camera.follow(e.x, e.y) : (this.camera.follow(e.x, e.y), this.lastBestBoid = t), this.renderer.drawWorld(this.camera, t.foods, t.poisons, t.eatenFoodHistory), this.renderer.drawBoids(this.boids, this.camera, t), this.minimapPanel.draw(e.x, e.y, t.foods, t.poisons, t.eatenFoodHistory), this.brainPanel.draw(t.brain), this.statsPanel.updateStats(t.getLeftThrusterPercent(), t.getRightThrusterPercent(), t.getVelocity(), t.getAngularVelocity(), this.generation, Math.floor(this.GENERATION_DURATION - this.generationTimer), Math.floor(t.score), 0);
            const i = this.boids.filter((s)=>!s.isDead).length;
            this.debugPanel.update(this.generation, i, t.score, this.allTimeBestScore, this.generationTimer, this.totalTime);
        }
        loop = ()=>{
            this.update(), this.draw(), requestAnimationFrame(this.loop);
        };
        start() {
            console.log("Starting game loop..."), this.loop();
        }
    }
    class F extends w {
        lines = [];
        MAX_LINES = 100;
        originalConsoleLog;
        constructor(){
            super("Console Output", "bottom-right", "600px", "200px"), this.originalConsoleLog = console.log.bind(console), console.log = (...i)=>{
                this.originalConsoleLog(...i), this.addLine(i.map((s)=>this.stringify(s)).join(" "));
            };
            const t = console.warn.bind(console);
            console.warn = (...i)=>{
                t(...i), this.addLine("[WARN] " + i.map((s)=>this.stringify(s)).join(" "), "#ffaa00");
            };
            const e = console.error.bind(console);
            console.error = (...i)=>{
                e(...i), this.addLine("[ERROR] " + i.map((s)=>this.stringify(s)).join(" "), "#ff4444");
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
            const i = new Date, s = `${i.getHours().toString().padStart(2, "0")}:${i.getMinutes().toString().padStart(2, "0")}:${i.getSeconds().toString().padStart(2, "0")}`;
            this.lines.push(`<span style="color:#666">[${s}]</span> <span style="color:${e}">${this.escapeHtml(t)}</span>`), this.lines.length > this.MAX_LINES && this.lines.shift(), this.content.innerHTML = this.lines.join("<br>"), this.content.scrollTop = this.content.scrollHeight;
        }
        escapeHtml(t) {
            const e = document.createElement("div");
            return e.textContent = t, e.innerHTML;
        }
    }
    async function U() {
        new F, console.log("Starting boid simulation...");
        const f = await O(()=>import("./rapier-D9GItMpu.js"), [], import.meta.url);
        f.init && await f.init(), console.log("RAPIER module ready"), new L(f).start();
    }
    U().catch(console.error);
})();
