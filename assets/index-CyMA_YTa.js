(async ()=>{
    (function() {
        const s = document.createElement("link").relList;
        if (s && s.supports && s.supports("modulepreload")) return;
        for (const o of document.querySelectorAll('link[rel="modulepreload"]'))x(o);
        new MutationObserver((o)=>{
            for (const n of o)if (n.type === "childList") for (const t of n.addedNodes)t.tagName === "LINK" && t.rel === "modulepreload" && x(t);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function e(o) {
            const n = {};
            return o.integrity && (n.integrity = o.integrity), o.referrerPolicy && (n.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? n.credentials = "include" : o.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
        }
        function x(o) {
            if (o.ep) return;
            o.ep = !0;
            const n = e(o);
            fetch(o.href, n);
        }
    })();
    const C = "modulepreload", O = function(v, s) {
        return new URL(v, s).href;
    }, L = {}, D = function(s, e, x) {
        let o = Promise.resolve();
        if (e && e.length > 0) {
            const t = document.getElementsByTagName("link"), i = document.querySelector("meta[property=csp-nonce]"), w = i?.nonce || i?.getAttribute("nonce");
            o = Promise.allSettled(e.map((y)=>{
                if (y = O(y, x), y in L) return;
                L[y] = !0;
                const r = y.endsWith(".css"), E = r ? '[rel="stylesheet"]' : "";
                if (!!x) for(let l = t.length - 1; l >= 0; l--){
                    const d = t[l];
                    if (d.href === y && (!r || d.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${y}"]${E}`)) return;
                const c = document.createElement("link");
                if (c.rel = r ? "stylesheet" : C, r || (c.as = "script"), c.crossOrigin = "", c.href = y, w && c.setAttribute("nonce", w), document.head.appendChild(c), r) return new Promise((l, d)=>{
                    c.addEventListener("load", l), c.addEventListener("error", ()=>d(new Error(`Unable to preload CSS for ${y}`)));
                });
            }));
        }
        function n(t) {
            const i = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (i.payload = t, window.dispatchEvent(i), !i.defaultPrevented) throw t;
        }
        return o.then((t)=>{
            for (const i of t || [])i.status === "rejected" && n(i.reason);
            return s().catch(n);
        });
    };
    async function $() {
        console.log("Starting boid simulation...");
        const v = await D(()=>import("./rapier-D9GItMpu.js"), [], import.meta.url);
        v.init && await v.init(), console.log("RAPIER module ready");
        const s = document.createElement("canvas"), e = s.getContext("2d");
        document.getElementById("app").appendChild(s);
        function x() {
            s.width = window.innerWidth, s.height = window.innerHeight;
        }
        window.addEventListener("resize", x), x();
        const o = {
            x: 0,
            y: 0
        }, n = new v.World(o), t = 2e3, i = 500, w = i / 10, y = v.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(.5).setAngularDamping(2), r = n.createRigidBody(y), E = new Float32Array([
            0,
            15,
            -10,
            -10,
            10,
            -10
        ]), P = v.ColliderDesc.convexHull(E);
        n.createCollider(P, r);
        const c = {};
        window.addEventListener("keydown", (a)=>c[a.key.toLowerCase()] = !0), window.addEventListener("keyup", (a)=>c[a.key.toLowerCase()] = !1);
        let l = 0, d = 0;
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
            c.q && (l = Math.min(l + w, i)), c.a && (l = Math.max(l - w, 0)), c.w && (d = Math.min(d + w, i)), c.s && (d = Math.max(d - w, 0));
            const a = r.rotation(), m = -Math.sin(a), p = Math.cos(a), u = {
                x: -10,
                y: -10
            }, S = {
                x: 10,
                y: -10
            }, f = (g, T)=>({
                    x: g.x * Math.cos(T) - g.y * Math.sin(T),
                    y: g.x * Math.sin(T) + g.y * Math.cos(T)
                }), b = r.translation();
            if (l > 0) {
                const g = f(u, a);
                r.applyImpulseAtPoint({
                    x: m * l * .1,
                    y: p * l * .1
                }, {
                    x: b.x + g.x,
                    y: b.y + g.y
                }, !0);
            }
            if (d > 0) {
                const g = f(S, a);
                r.applyImpulseAtPoint({
                    x: m * d * .1,
                    y: p * d * .1
                }, {
                    x: b.x + g.x,
                    y: b.y + g.y
                }, !0);
            }
        }
        function B() {
            let { x: a, y: m } = r.translation();
            const p = t / 2;
            let u = !1;
            a > p ? (a -= t, u = !0) : a < -p && (a += t, u = !0), m > p ? (m -= t, u = !0) : m < -p && (m += t, u = !0), u && r.setTranslation({
                x: a,
                y: m
            }, !0);
        }
        function W() {
            e.clearRect(0, 0, s.width, s.height);
            const a = r.translation().x, m = r.translation().y;
            e.save(), e.translate(s.width / 2, s.height / 2), e.scale(1, -1), e.save(), e.translate(-a, -m), e.strokeStyle = "rgba(255, 255, 255, 0.05)", e.lineWidth = 1;
            for(let f = -t / 2; f <= t / 2; f += 100)e.beginPath(), e.moveTo(f, -t / 2), e.lineTo(f, t / 2), e.stroke(), e.beginPath(), e.moveTo(-t / 2, f), e.lineTo(t / 2, f), e.stroke();
            e.strokeStyle = "#4facfe", e.lineWidth = 4, e.strokeRect(-t / 2, -t / 2, t, t), e.restore(), e.save(), e.rotate(r.rotation()), e.beginPath(), e.moveTo(0, 15), e.lineTo(-10, -10), e.lineTo(10, -10), e.closePath(), e.fillStyle = "#fff", e.fill(), e.strokeStyle = "#4facfe", e.lineWidth = 2, e.stroke();
            const p = 30;
            if (l > 0) {
                const f = l / i * p;
                e.beginPath(), e.moveTo(-7, -10), e.lineTo(-7, -10 - f), e.strokeStyle = "#ff4b2b", e.lineWidth = 4, e.stroke();
            }
            if (d > 0) {
                const f = d / i * p;
                e.beginPath(), e.moveTo(7, -10), e.lineTo(7, -10 - f), e.strokeStyle = "#ff4b2b", e.lineWidth = 4, e.stroke();
            }
            e.restore(), e.restore(), M.innerText = `Left Thruster: ${Math.round(l / i * 100)}%`, k.innerText = `Right Thruster: ${Math.round(d / i * 100)}%`;
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
