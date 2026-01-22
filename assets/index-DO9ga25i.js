(async ()=>{
    (function() {
        const e = document.createElement("link").relList;
        if (e && e.supports && e.supports("modulepreload")) return;
        for (const i of document.querySelectorAll('link[rel="modulepreload"]'))h(i);
        new MutationObserver((i)=>{
            for (const l of i)if (l.type === "childList") for (const d of l.addedNodes)d.tagName === "LINK" && d.rel === "modulepreload" && h(d);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function t(i) {
            const l = {};
            return i.integrity && (l.integrity = i.integrity), i.referrerPolicy && (l.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? l.credentials = "include" : i.crossOrigin === "anonymous" ? l.credentials = "omit" : l.credentials = "same-origin", l;
        }
        function h(i) {
            if (i.ep) return;
            i.ep = !0;
            const l = t(i);
            fetch(i.href, l);
        }
    })();
    const ft = "modulepreload", ht = function(v, e) {
        return new URL(v, e).href;
    }, K = {}, ut = function(e, t, h) {
        let i = Promise.resolve();
        if (t && t.length > 0) {
            const d = document.getElementsByTagName("link"), y = document.querySelector("meta[property=csp-nonce]"), s = y?.nonce || y?.getAttribute("nonce");
            i = Promise.allSettled(t.map((f)=>{
                if (f = ht(f, h), f in K) return;
                K[f] = !0;
                const w = f.endsWith(".css"), A = w ? '[rel="stylesheet"]' : "";
                if (!!h) for(let P = d.length - 1; P >= 0; P--){
                    const m = d[P];
                    if (m.href === f && (!w || m.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${f}"]${A}`)) return;
                const R = document.createElement("link");
                if (R.rel = w ? "stylesheet" : ft, w || (R.as = "script"), R.crossOrigin = "", R.href = f, s && R.setAttribute("nonce", s), document.head.appendChild(R), w) return new Promise((P, m)=>{
                    R.addEventListener("load", P), R.addEventListener("error", ()=>m(new Error(`Unable to preload CSS for ${f}`)));
                });
            }));
        }
        function l(d) {
            const y = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (y.payload = d, window.dispatchEvent(y), !y.defaultPrevented) throw d;
        }
        return i.then((d)=>{
            for (const y of d || [])y.status === "rejected" && l(y.reason);
            return e().catch(l);
        });
    };
    class yt {
        seed;
        a = 1664525;
        c = 1013904223;
        m = 2 ** 32;
        constructor(e = Date.now()){
            this.seed = e % this.m;
        }
        setSeed(e) {
            this.seed = e % this.m;
        }
        getSeed() {
            return this.seed;
        }
        random() {
            return this.seed = (this.a * this.seed + this.c) % this.m, this.seed / this.m;
        }
        randomRange(e, t) {
            return e + this.random() * (t - e);
        }
        randomInt(e, t) {
            return Math.floor(this.randomRange(e, t + 1));
        }
    }
    class mt {
        x;
        y;
        radius;
        color;
        constructor(e, t, h = 8){
            this.x = e, this.y = t, this.radius = h, this.color = "#00ff88";
        }
        isColliding(e, t, h) {
            const i = this.x - e, l = this.y - t;
            return Math.sqrt(i * i + l * l) < this.radius + h;
        }
        draw(e) {
            e.beginPath(), e.arc(this.x, this.y, this.radius, 0, Math.PI * 2), e.fillStyle = this.color, e.fill(), e.strokeStyle = "#00ff88", e.lineWidth = 2, e.stroke();
        }
    }
    class pt {
        x;
        y;
        radius;
        color;
        constructor(e, t, h = 8){
            this.x = e, this.y = t, this.radius = h, this.color = "#ff4444";
        }
        isColliding(e, t, h) {
            const i = this.x - e, l = this.y - t;
            return Math.sqrt(i * i + l * l) < this.radius + h;
        }
        draw(e) {
            e.beginPath(), e.arc(this.x, this.y, this.radius, 0, Math.PI * 2), e.fillStyle = this.color, e.fill(), e.strokeStyle = "#ff0000", e.lineWidth = 2, e.stroke();
        }
    }
    async function gt() {
        console.log("Starting boid simulation...");
        const v = await ut(()=>import("./rapier-D9GItMpu.js"), [], import.meta.url);
        v.init && await v.init(), console.log("RAPIER module ready");
        const e = document.createElement("canvas"), t = e.getContext("2d");
        document.getElementById("app").appendChild(e);
        function h() {
            e.width = window.innerWidth, e.height = window.innerHeight;
        }
        window.addEventListener("resize", h), h();
        const i = {
            x: 0,
            y: 0
        }, l = new v.World(i), d = Date.now(), y = new yt(d);
        console.log("World Seed:", d);
        const s = 2e3, f = 500, w = f / 10, A = v.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(.5).setAngularDamping(2), u = l.createRigidBody(A), R = new Float32Array([
            0,
            15,
            -10,
            -10,
            10,
            -10
        ]), P = v.ColliderDesc.convexHull(R);
        l.createCollider(P, u);
        const m = [], T = [], F = 40, N = 15, q = 15;
        function U() {
            const o = s / 2, r = y.randomRange(-o + 50, o - 50), a = y.randomRange(-o + 50, o - 50);
            return new mt(r, a);
        }
        function z() {
            const o = s / 2, r = y.randomRange(-o + 50, o - 50), a = y.randomRange(-o + 50, o - 50);
            return new pt(r, a);
        }
        for(let o = 0; o < F; o++)m.push(U());
        for(let o = 0; o < N; o++)T.push(z());
        let H = 0, X = 0;
        const M = {};
        window.addEventListener("keydown", (o)=>M[o.key.toLowerCase()] = !0), window.addEventListener("keyup", (o)=>M[o.key.toLowerCase()] = !1);
        let b = 0, E = 0;
        const x = document.createElement("div");
        x.style.position = "absolute", x.style.top = "20px", x.style.left = "20px", x.style.padding = "20px", x.style.background = "rgba(0, 0, 0, 0.7)", x.style.borderRadius = "12px", x.style.backdropFilter = "blur(10px)", x.style.border = "1px solid rgba(255, 255, 255, 0.1)", x.style.pointerEvents = "none", x.style.fontSize = "14px", x.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold; color: #4facfe;">BOID SYSTEMS</div>
    <div id="seed-stat">Seed: ${d}</div>
    <div style="margin-top: 8px; opacity: 0.7;">---</div>
    <div id="left-stat">Left Thruster: 0</div>
    <div id="right-stat">Right Thruster: 0</div>
    <div id="vel-stat">Velocity: 0</div>
    <div id="rot-stat">Rotation Power: 0</div>
    <div style="margin-top: 8px; opacity: 0.7;">---</div>
    <div id="food-stat">Food: ${F}</div>
    <div id="poison-stat">Poison: ${N}</div>
    <div id="collected-stat">Collected: 0 food, 0 poison</div>
    <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right</div>
  `, document.body.appendChild(x);
        const Q = document.getElementById("left-stat"), Z = document.getElementById("right-stat"), J = document.getElementById("vel-stat"), tt = document.getElementById("rot-stat"), et = document.getElementById("food-stat"), ot = document.getElementById("poison-stat"), nt = document.getElementById("collected-stat");
        function st() {
            M.q && (b = Math.min(b + w, f)), M.a && (b = Math.max(b - w, 0)), M.w && (E = Math.min(E + w, f)), M.s && (E = Math.max(E - w, 0));
            const o = u.rotation(), r = -Math.sin(o), a = Math.cos(o), c = {
                x: -10,
                y: -10
            }, D = {
                x: 10,
                y: -10
            }, O = (g, S)=>({
                    x: g.x * Math.cos(S) - g.y * Math.sin(S),
                    y: g.x * Math.sin(S) + g.y * Math.cos(S)
                }), p = u.translation();
            if (b > 0) {
                const g = O(c, o);
                u.applyImpulseAtPoint({
                    x: r * b * .1,
                    y: a * b * .1
                }, {
                    x: p.x + g.x,
                    y: p.y + g.y
                }, !0);
            }
            if (E > 0) {
                const g = O(D, o);
                u.applyImpulseAtPoint({
                    x: r * E * .1,
                    y: a * E * .1
                }, {
                    x: p.x + g.x,
                    y: p.y + g.y
                }, !0);
            }
        }
        function it() {
            let { x: o, y: r } = u.translation();
            const a = s / 2;
            let c = !1;
            o > a ? (o -= s, c = !0) : o < -a && (o += s, c = !0), r > a ? (r -= s, c = !0) : r < -a && (r += s, c = !0), c && u.setTranslation({
                x: o,
                y: r
            }, !0);
        }
        function rt() {
            const o = u.translation();
            for(let r = m.length - 1; r >= 0; r--)m[r].isColliding(o.x, o.y, q) && (m.splice(r, 1), m.push(U()), H++);
            for(let r = T.length - 1; r >= 0; r--)T[r].isColliding(o.x, o.y, q) && (T.splice(r, 1), T.push(z()), X++);
        }
        function lt() {
            t.clearRect(0, 0, e.width, e.height);
            const o = u.translation().x, r = u.translation().y;
            t.save(), t.translate(e.width / 2, e.height / 2), t.scale(1, -1), t.save(), t.translate(-o, -r), t.strokeStyle = "rgba(255, 255, 255, 0.05)", t.lineWidth = 1;
            for(let n = -s / 2; n <= s / 2; n += 100)t.beginPath(), t.moveTo(n, -s / 2), t.lineTo(n, s / 2), t.stroke(), t.beginPath(), t.moveTo(-s / 2, n), t.lineTo(s / 2, n), t.stroke();
            t.strokeStyle = "#4facfe", t.lineWidth = 6, t.strokeRect(-s / 2, -s / 2, s, s);
            const a = 20;
            t.fillStyle = "#4facfe";
            const c = s / 2;
            t.fillRect(-c - 3, -c - 3, a, a), t.fillRect(c - a + 3, -c - 3, a, a), t.fillRect(-c - 3, c - a + 3, a, a), t.fillRect(c - a + 3, c - a + 3, a, a);
            const D = (n, L, C)=>{
                const _ = Math.max(e.width, e.height) / 2 + 100;
                n.draw(t);
                const W = [];
                n.x - L < -c + _ && W.push({
                    dx: s,
                    dy: 0
                }), n.x - L > c - _ && W.push({
                    dx: -s,
                    dy: 0
                }), n.y - C < -c + _ && W.push({
                    dx: 0,
                    dy: s
                }), n.y - C > c - _ && W.push({
                    dx: 0,
                    dy: -s
                });
                for (const G of W)t.save(), t.translate(G.dx, G.dy), n.draw(t), t.restore();
            };
            m.forEach((n)=>D(n, o, r)), T.forEach((n)=>D(n, o, r)), t.restore(), t.save(), t.rotate(u.rotation()), t.beginPath(), t.moveTo(0, 15), t.lineTo(-10, -10), t.lineTo(10, -10), t.closePath(), t.fillStyle = "#fff", t.fill(), t.strokeStyle = "#4facfe", t.lineWidth = 2, t.stroke();
            const O = 30;
            if (b > 0) {
                const n = b / f * O;
                t.beginPath(), t.moveTo(-7, -10), t.lineTo(-7, -10 - n), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
            }
            if (E > 0) {
                const n = E / f * O;
                t.beginPath(), t.moveTo(7, -10), t.lineTo(7, -10 - n), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
            }
            t.restore(), t.restore();
            const p = 200, g = 20, S = e.width - p - g, k = g;
            t.save(), t.setTransform(1, 0, 0, 1, 0, 0), t.fillStyle = "rgba(0, 0, 0, 0.7)", t.fillRect(S, k, p, p), t.strokeStyle = "#4facfe", t.lineWidth = 2, t.strokeRect(S, k, p, p);
            const V = p / s, B = (n)=>(n + s / 2) * V, $ = (n)=>(s / 2 - n) * V;
            t.strokeStyle = "rgba(79, 172, 254, 0.5)", t.lineWidth = 1, t.strokeRect(S, k, p, p), t.fillStyle = "#00ff88", m.forEach((n)=>{
                const L = S + B(n.x), C = k + $(n.y);
                t.fillRect(L - 1.5, C - 1.5, 3, 3);
            }), t.fillStyle = "#ff4444", T.forEach((n)=>{
                const L = S + B(n.x), C = k + $(n.y);
                t.fillRect(L - 1.5, C - 1.5, 3, 3);
            });
            const j = u.translation(), at = S + B(j.x), ct = k + $(j.y);
            t.fillStyle = "#ffffff", t.beginPath(), t.arc(at, ct, 4, 0, Math.PI * 2), t.fill(), t.strokeStyle = "#4facfe", t.lineWidth = 2, t.stroke(), t.restore(), Q.innerText = `Left Thruster: ${Math.round(b / f * 100)}%`, Z.innerText = `Right Thruster: ${Math.round(E / f * 100)}%`;
            const I = u.linvel(), dt = Math.sqrt(I.x * I.x + I.y * I.y);
            J.innerText = `Velocity: ${Math.round(dt)} | Angle: ${Math.round(Math.atan2(I.y, I.x) * 180 / Math.PI)}°`, tt.innerText = `Rotation Power: ${u.angvel().toFixed(2)}`, et.innerText = `Food: ${m.length}`, ot.innerText = `Poison: ${T.length}`, nt.innerText = `Collected: ${H} food, ${X} poison`;
        }
        function Y() {
            st(), l.step(), it(), rt(), lt(), requestAnimationFrame(Y);
        }
        Y();
    }
    gt().catch(console.error);
})();
