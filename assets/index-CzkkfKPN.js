(async () => {
  (function() {
    const s = document.createElement("link").relList;
    if (s && s.supports && s.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) w(o);
    new MutationObserver((o) => {
      for (const n of o) if (n.type === "childList") for (const e of n.addedNodes) e.tagName === "LINK" && e.rel === "modulepreload" && w(e);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function t(o) {
      const n = {};
      return o.integrity && (n.integrity = o.integrity), o.referrerPolicy && (n.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? n.credentials = "include" : o.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
    }
    function w(o) {
      if (o.ep) return;
      o.ep = true;
      const n = t(o);
      fetch(o.href, n);
    }
  })();
  const B = "modulepreload", O = function(f) {
    return "/NeuralBoidTraining/" + f;
  }, M = {}, D = function(s, t, w) {
    let o = Promise.resolve();
    if (t && t.length > 0) {
      document.getElementsByTagName("link");
      const e = document.querySelector("meta[property=csp-nonce]"), r = (e == null ? void 0 : e.nonce) || (e == null ? void 0 : e.getAttribute("nonce"));
      o = Promise.allSettled(t.map((c) => {
        if (c = O(c), c in M) return;
        M[c] = true;
        const b = c.endsWith(".css"), l = b ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${c}"]${l}`)) return;
        const h = document.createElement("link");
        if (h.rel = b ? "stylesheet" : B, b || (h.as = "script"), h.crossOrigin = "", h.href = c, r && h.setAttribute("nonce", r), document.head.appendChild(h), b) return new Promise((P, x) => {
          h.addEventListener("load", P), h.addEventListener("error", () => x(new Error(`Unable to preload CSS for ${c}`)));
        });
      }));
    }
    function n(e) {
      const r = new Event("vite:preloadError", {
        cancelable: true
      });
      if (r.payload = e, window.dispatchEvent(r), !r.defaultPrevented) throw e;
    }
    return o.then((e) => {
      for (const r of e || []) r.status === "rejected" && n(r.reason);
      return s().catch(n);
    });
  };
  async function $() {
    console.log("Starting boid simulation...");
    const f = await D(() => import("./rapier-DWAjj0uv.js"), []);
    console.log("RAPIER module loaded:", f), typeof f.init == "function" ? (console.log("Calling RAPIER.init()..."), await f.init()) : console.log("RAPIER.init is not available, proceeding with world creation...");
    const s = document.createElement("canvas"), t = s.getContext("2d");
    document.getElementById("app").appendChild(s);
    function w() {
      s.width = window.innerWidth, s.height = window.innerHeight;
    }
    window.addEventListener("resize", w), w();
    const o = {
      x: 0,
      y: 0
    }, n = new f.World(o), e = 2e3, r = 500, c = r / 10, b = f.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(0.5).setAngularDamping(2), l = n.createRigidBody(b), h = new Float32Array([
      0,
      15,
      -10,
      -10,
      10,
      -10
    ]), P = f.ColliderDesc.convexHull(h);
    n.createCollider(P, l);
    const x = {};
    window.addEventListener("keydown", (i) => x[i.key.toLowerCase()] = true), window.addEventListener("keyup", (i) => x[i.key.toLowerCase()] = false);
    let y = 0, m = 0;
    const u = document.createElement("div");
    u.style.position = "absolute", u.style.top = "20px", u.style.left = "20px", u.style.padding = "20px", u.style.background = "rgba(0, 0, 0, 0.7)", u.style.borderRadius = "12px", u.style.backdropFilter = "blur(10px)", u.style.border = "1px solid rgba(255, 255, 255, 0.1)", u.style.pointerEvents = "none", u.style.fontSize = "14px", u.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold; color: #4facfe;">BOID SYSTEMS</div>
    <div id="left-stat">Left Thruster: 0</div>
    <div id="right-stat">Right Thruster: 0</div>
    <div id="vel-stat">Velocity: 0</div>
    <div id="rot-stat">Rotation Power: 0</div>
    <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right</div>
  `, document.body.appendChild(u);
    const L = document.getElementById("left-stat"), k = document.getElementById("right-stat"), A = document.getElementById("vel-stat"), I = document.getElementById("rot-stat");
    function _() {
      x.q && (y = Math.min(y + c, r)), x.a && (y = Math.max(y - c, 0)), x.w && (m = Math.min(m + c, r)), x.s && (m = Math.max(m - c, 0));
      const i = l.rotation(), p = -Math.sin(i), g = Math.cos(i), a = {
        x: -10,
        y: -10
      }, S = {
        x: 10,
        y: -10
      }, d = (v, E) => ({
        x: v.x * Math.cos(E) - v.y * Math.sin(E),
        y: v.x * Math.sin(E) + v.y * Math.cos(E)
      }), T = l.translation();
      if (y > 0) {
        const v = d(a, i);
        l.applyImpulseAtPoint({
          x: p * y * 0.1,
          y: g * y * 0.1
        }, {
          x: T.x + v.x,
          y: T.y + v.y
        }, true);
      }
      if (m > 0) {
        const v = d(S, i);
        l.applyImpulseAtPoint({
          x: p * m * 0.1,
          y: g * m * 0.1
        }, {
          x: T.x + v.x,
          y: T.y + v.y
        }, true);
      }
    }
    function C() {
      let { x: i, y: p } = l.translation();
      const g = e / 2;
      let a = false;
      i > g ? (i -= e, a = true) : i < -g && (i += e, a = true), p > g ? (p -= e, a = true) : p < -g && (p += e, a = true), a && l.setTranslation({
        x: i,
        y: p
      }, true);
    }
    function W() {
      t.clearRect(0, 0, s.width, s.height);
      const i = l.translation().x, p = l.translation().y;
      t.save(), t.translate(s.width / 2, s.height / 2), t.scale(1, -1), t.save(), t.translate(-i, -p), t.strokeStyle = "rgba(255, 255, 255, 0.05)", t.lineWidth = 1;
      for (let d = -e / 2; d <= e / 2; d += 100) t.beginPath(), t.moveTo(d, -e / 2), t.lineTo(d, e / 2), t.stroke(), t.beginPath(), t.moveTo(-e / 2, d), t.lineTo(e / 2, d), t.stroke();
      t.strokeStyle = "#4facfe", t.lineWidth = 4, t.strokeRect(-e / 2, -e / 2, e, e), t.restore(), t.save(), t.rotate(l.rotation()), t.beginPath(), t.moveTo(0, 15), t.lineTo(-10, -10), t.lineTo(10, -10), t.closePath(), t.fillStyle = "#fff", t.fill(), t.strokeStyle = "#4facfe", t.lineWidth = 2, t.stroke();
      const g = 30;
      if (y > 0) {
        const d = y / r * g;
        t.beginPath(), t.moveTo(-7, -10), t.lineTo(-7, -10 - d), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
      }
      if (m > 0) {
        const d = m / r * g;
        t.beginPath(), t.moveTo(7, -10), t.lineTo(7, -10 - d), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
      }
      t.restore(), t.restore(), L.innerText = `Left Thruster: ${Math.round(y / r * 100)}%`, k.innerText = `Right Thruster: ${Math.round(m / r * 100)}%`;
      const a = l.linvel(), S = Math.sqrt(a.x * a.x + a.y * a.y);
      A.innerText = `Velocity: ${Math.round(S)} | Angle: ${Math.round(Math.atan2(a.y, a.x) * 180 / Math.PI)}\xB0`, I.innerText = `Rotation Power: ${l.angvel().toFixed(2)}`;
    }
    function R() {
      _(), n.step(), C(), W(), requestAnimationFrame(R);
    }
    R();
  }
  $().catch(console.error);
})();
