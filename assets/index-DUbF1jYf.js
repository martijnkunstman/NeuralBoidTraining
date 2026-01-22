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
  const C = "modulepreload", O = function(x) {
    return "/NeuralBoidTraining/" + x;
  }, L = {}, D = function(s, t, w) {
    let o = Promise.resolve();
    if (t && t.length > 0) {
      document.getElementsByTagName("link");
      const e = document.querySelector("meta[property=csp-nonce]"), r = (e == null ? void 0 : e.nonce) || (e == null ? void 0 : e.getAttribute("nonce"));
      o = Promise.allSettled(t.map((c) => {
        if (c = O(c), c in L) return;
        L[c] = true;
        const T = c.endsWith(".css"), a = T ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${c}"]${a}`)) return;
        const f = document.createElement("link");
        if (f.rel = T ? "stylesheet" : C, T || (f.as = "script"), f.crossOrigin = "", f.href = c, r && f.setAttribute("nonce", r), document.head.appendChild(f), T) return new Promise((S, v) => {
          f.addEventListener("load", S), f.addEventListener("error", () => v(new Error(`Unable to preload CSS for ${c}`)));
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
    const x = await D(() => import("./rapier-DWAjj0uv.js"), []), s = document.createElement("canvas"), t = s.getContext("2d");
    document.getElementById("app").appendChild(s);
    function w() {
      s.width = window.innerWidth, s.height = window.innerHeight;
    }
    window.addEventListener("resize", w), w();
    const o = {
      x: 0,
      y: 0
    }, n = new x.World(o), e = 2e3, r = 500, c = r / 10, T = x.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(0.5).setAngularDamping(2), a = n.createRigidBody(T), f = new Float32Array([
      0,
      15,
      -10,
      -10,
      10,
      -10
    ]), S = x.ColliderDesc.convexHull(f);
    n.createCollider(S, a);
    const v = {};
    window.addEventListener("keydown", (i) => v[i.key.toLowerCase()] = true), window.addEventListener("keyup", (i) => v[i.key.toLowerCase()] = false);
    let h = 0, y = 0;
    const u = document.createElement("div");
    u.style.position = "absolute", u.style.top = "20px", u.style.left = "20px", u.style.padding = "20px", u.style.background = "rgba(0, 0, 0, 0.7)", u.style.borderRadius = "12px", u.style.backdropFilter = "blur(10px)", u.style.border = "1px solid rgba(255, 255, 255, 0.1)", u.style.pointerEvents = "none", u.style.fontSize = "14px", u.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold; color: #4facfe;">BOID SYSTEMS</div>
    <div id="left-stat">Left Thruster: 0</div>
    <div id="right-stat">Right Thruster: 0</div>
    <div id="vel-stat">Velocity: 0</div>
    <div id="rot-stat">Rotation Power: 0</div>
    <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right</div>
  `, document.body.appendChild(u);
    const R = document.getElementById("left-stat"), k = document.getElementById("right-stat"), A = document.getElementById("vel-stat"), I = document.getElementById("rot-stat");
    function _() {
      v.q && (h = Math.min(h + c, r)), v.a && (h = Math.max(h - c, 0)), v.w && (y = Math.min(y + c, r)), v.s && (y = Math.max(y - c, 0));
      const i = a.rotation(), m = -Math.sin(i), p = Math.cos(i), l = {
        x: -10,
        y: -10
      }, P = {
        x: 10,
        y: -10
      }, d = (g, E) => ({
        x: g.x * Math.cos(E) - g.y * Math.sin(E),
        y: g.x * Math.sin(E) + g.y * Math.cos(E)
      }), b = a.translation();
      if (h > 0) {
        const g = d(l, i);
        a.applyImpulseAtPoint({
          x: m * h * 0.1,
          y: p * h * 0.1
        }, {
          x: b.x + g.x,
          y: b.y + g.y
        }, true);
      }
      if (y > 0) {
        const g = d(P, i);
        a.applyImpulseAtPoint({
          x: m * y * 0.1,
          y: p * y * 0.1
        }, {
          x: b.x + g.x,
          y: b.y + g.y
        }, true);
      }
    }
    function W() {
      let { x: i, y: m } = a.translation();
      const p = e / 2;
      let l = false;
      i > p ? (i -= e, l = true) : i < -p && (i += e, l = true), m > p ? (m -= e, l = true) : m < -p && (m += e, l = true), l && a.setTranslation({
        x: i,
        y: m
      }, true);
    }
    function B() {
      t.clearRect(0, 0, s.width, s.height);
      const i = a.translation().x, m = a.translation().y;
      t.save(), t.translate(s.width / 2, s.height / 2), t.scale(1, -1), t.save(), t.translate(-i, -m), t.strokeStyle = "rgba(255, 255, 255, 0.05)", t.lineWidth = 1;
      for (let d = -e / 2; d <= e / 2; d += 100) t.beginPath(), t.moveTo(d, -e / 2), t.lineTo(d, e / 2), t.stroke(), t.beginPath(), t.moveTo(-e / 2, d), t.lineTo(e / 2, d), t.stroke();
      t.strokeStyle = "#4facfe", t.lineWidth = 4, t.strokeRect(-e / 2, -e / 2, e, e), t.restore(), t.save(), t.rotate(a.rotation()), t.beginPath(), t.moveTo(0, 15), t.lineTo(-10, -10), t.lineTo(10, -10), t.closePath(), t.fillStyle = "#fff", t.fill(), t.strokeStyle = "#4facfe", t.lineWidth = 2, t.stroke();
      const p = 30;
      if (h > 0) {
        const d = h / r * p;
        t.beginPath(), t.moveTo(-7, -10), t.lineTo(-7, -10 - d), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
      }
      if (y > 0) {
        const d = y / r * p;
        t.beginPath(), t.moveTo(7, -10), t.lineTo(7, -10 - d), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
      }
      t.restore(), t.restore(), R.innerText = `Left Thruster: ${Math.round(h / r * 100)}%`, k.innerText = `Right Thruster: ${Math.round(y / r * 100)}%`;
      const l = a.linvel(), P = Math.sqrt(l.x * l.x + l.y * l.y);
      A.innerText = `Velocity: ${Math.round(P)} | Angle: ${Math.round(Math.atan2(l.y, l.x) * 180 / Math.PI)}\xB0`, I.innerText = `Rotation Power: ${a.angvel().toFixed(2)}`;
    }
    function M() {
      _(), n.step(), W(), B(), requestAnimationFrame(M);
    }
    M();
  }
  $().catch(console.error);
})();
