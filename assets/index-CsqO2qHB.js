(async ()=>{
    (function() {
        const l = document.createElement("link").relList;
        if (l && l.supports && l.supports("modulepreload")) return;
        for (const o of document.querySelectorAll('link[rel="modulepreload"]'))v(o);
        new MutationObserver((o)=>{
            for (const n of o)if (n.type === "childList") for (const t of n.addedNodes)t.tagName === "LINK" && t.rel === "modulepreload" && v(t);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function e(o) {
            const n = {};
            return o.integrity && (n.integrity = o.integrity), o.referrerPolicy && (n.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? n.credentials = "include" : o.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
        }
        function v(o) {
            if (o.ep) return;
            o.ep = !0;
            const n = e(o);
            fetch(o.href, n);
        }
    })();
    const C = "modulepreload", O = function(x, l) {
        return new URL(x, l).href;
    }, L = {}, D = function(l, e, v) {
        let o = Promise.resolve();
        if (e && e.length > 0) {
            const t = document.getElementsByTagName("link"), s = document.querySelector("meta[property=csp-nonce]"), w = s?.nonce || s?.getAttribute("nonce");
            o = Promise.allSettled(e.map((y)=>{
                if (y = O(y, v), y in L) return;
                L[y] = !0;
                const r = y.endsWith(".css"), E = r ? '[rel="stylesheet"]' : "";
                if (!!v) for(let a = t.length - 1; a >= 0; a--){
                    const d = t[a];
                    if (d.href === y && (!r || d.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${y}"]${E}`)) return;
                const c = document.createElement("link");
                if (c.rel = r ? "stylesheet" : C, r || (c.as = "script"), c.crossOrigin = "", c.href = y, w && c.setAttribute("nonce", w), document.head.appendChild(c), r) return new Promise((a, d)=>{
                    c.addEventListener("load", a), c.addEventListener("error", ()=>d(new Error(`Unable to preload CSS for ${y}`)));
                });
            }));
        }
        function n(t) {
            const s = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (s.payload = t, window.dispatchEvent(s), !s.defaultPrevented) throw t;
        }
        return o.then((t)=>{
            for (const s of t || [])s.status === "rejected" && n(s.reason);
            return l().catch(n);
        });
    };
    async function $() {
        console.log("Starting boid simulation (v1.0.3)...");
        const x = await D(()=>import("./rapier-DWAjj0uv.js"), [], import.meta.url);
        await new Promise((i)=>setTimeout(i, 100)), console.log("RAPIER module ready");
        const l = document.createElement("canvas"), e = l.getContext("2d");
        document.getElementById("app").appendChild(l);
        function v() {
            l.width = window.innerWidth, l.height = window.innerHeight;
        }
        window.addEventListener("resize", v), v();
        const o = {
            x: 0,
            y: 0
        }, n = new x.World(o), t = 2e3, s = 500, w = s / 10, y = x.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(.5).setAngularDamping(2), r = n.createRigidBody(y), E = new Float32Array([
            0,
            15,
            -10,
            -10,
            10,
            -10
        ]), P = x.ColliderDesc.convexHull(E);
        n.createCollider(P, r);
        const c = {};
        window.addEventListener("keydown", (i)=>c[i.key.toLowerCase()] = !0), window.addEventListener("keyup", (i)=>c[i.key.toLowerCase()] = !1);
        let a = 0, d = 0;
        const h = document.createElement("div");
        h.style.position = "absolute", h.style.top = "20px", h.style.left = "20px", h.style.padding = "20px", h.style.background = "rgba(0, 0, 0, 0.7)", h.style.borderRadius = "12px", h.style.backdropFilter = "blur(10px)", h.style.border = "1px solid rgba(255, 255, 255, 0.1)", h.style.pointerEvents = "none", h.style.fontSize = "14px", h.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold; color: #4facfe;">BOID SYSTEMS</div>
    <div id="left-stat">Left Thruster: 0</div>
    <div id="right-stat">Right Thruster: 0</div>
    <div id="vel-stat">Velocity: 0</div>
    <div id="rot-stat">Rotation Power: 0</div>
    <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right</div>
  `, document.body.appendChild(h);
        const M = document.getElementById("left-stat"), k = document.getElementById("right-stat"), A = document.getElementById("vel-stat"), I = document.getElementById("rot-stat");
        function _() {
            c.q && (a = Math.min(a + w, s)), c.a && (a = Math.max(a - w, 0)), c.w && (d = Math.min(d + w, s)), c.s && (d = Math.max(d - w, 0));
            const i = r.rotation(), m = -Math.sin(i), p = Math.cos(i), u = {
                x: -10,
                y: -10
            }, S = {
                x: 10,
                y: -10
            }, f = (g, b)=>({
                    x: g.x * Math.cos(b) - g.y * Math.sin(b),
                    y: g.x * Math.sin(b) + g.y * Math.cos(b)
                }), T = r.translation();
            if (a > 0) {
                const g = f(u, i);
                r.applyImpulseAtPoint({
                    x: m * a * .1,
                    y: p * a * .1
                }, {
                    x: T.x + g.x,
                    y: T.y + g.y
                }, !0);
            }
            if (d > 0) {
                const g = f(S, i);
                r.applyImpulseAtPoint({
                    x: m * d * .1,
                    y: p * d * .1
                }, {
                    x: T.x + g.x,
                    y: T.y + g.y
                }, !0);
            }
        }
        function B() {
            let { x: i, y: m } = r.translation();
            const p = t / 2;
            let u = !1;
            i > p ? (i -= t, u = !0) : i < -p && (i += t, u = !0), m > p ? (m -= t, u = !0) : m < -p && (m += t, u = !0), u && r.setTranslation({
                x: i,
                y: m
            }, !0);
        }
        function W() {
            e.clearRect(0, 0, l.width, l.height);
            const i = r.translation().x, m = r.translation().y;
            e.save(), e.translate(l.width / 2, l.height / 2), e.scale(1, -1), e.save(), e.translate(-i, -m), e.strokeStyle = "rgba(255, 255, 255, 0.05)", e.lineWidth = 1;
            for(let f = -t / 2; f <= t / 2; f += 100)e.beginPath(), e.moveTo(f, -t / 2), e.lineTo(f, t / 2), e.stroke(), e.beginPath(), e.moveTo(-t / 2, f), e.lineTo(t / 2, f), e.stroke();
            e.strokeStyle = "#4facfe", e.lineWidth = 4, e.strokeRect(-t / 2, -t / 2, t, t), e.restore(), e.save(), e.rotate(r.rotation()), e.beginPath(), e.moveTo(0, 15), e.lineTo(-10, -10), e.lineTo(10, -10), e.closePath(), e.fillStyle = "#fff", e.fill(), e.strokeStyle = "#4facfe", e.lineWidth = 2, e.stroke();
            const p = 30;
            if (a > 0) {
                const f = a / s * p;
                e.beginPath(), e.moveTo(-7, -10), e.lineTo(-7, -10 - f), e.strokeStyle = "#ff4b2b", e.lineWidth = 4, e.stroke();
            }
            if (d > 0) {
                const f = d / s * p;
                e.beginPath(), e.moveTo(7, -10), e.lineTo(7, -10 - f), e.strokeStyle = "#ff4b2b", e.lineWidth = 4, e.stroke();
            }
            e.restore(), e.restore(), M.innerText = `Left Thruster: ${Math.round(a / s * 100)}%`, k.innerText = `Right Thruster: ${Math.round(d / s * 100)}%`;
            const u = r.linvel(), S = Math.sqrt(u.x * u.x + u.y * u.y);
            A.innerText = `Velocity: ${Math.round(S)} | Angle: ${Math.round(Math.atan2(u.y, u.x) * 180 / Math.PI)}°`, I.innerText = `Rotation Power: ${r.angvel().toFixed(2)}`;
        }
        function R() {
            _(), n.step(), B(), W(), requestAnimationFrame(R);
        }
        R();
    }
    $().catch(console.error);
})();
