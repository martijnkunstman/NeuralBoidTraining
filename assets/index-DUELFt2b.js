var Ee = (a, t) => () => (t || a((t = { exports: {} }).exports, t), t.exports);
var _r = Ee((cr, Ce) => {
  (function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const n of document.querySelectorAll('link[rel="modulepreload"]')) r(n);
    new MutationObserver((n) => {
      for (const s of n) if (s.type === "childList") for (const o of s.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && r(o);
    }).observe(document, { childList: true, subtree: true });
    function e(n) {
      const s = {};
      return n.integrity && (s.integrity = n.integrity), n.referrerPolicy && (s.referrerPolicy = n.referrerPolicy), n.crossOrigin === "use-credentials" ? s.credentials = "include" : n.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s;
    }
    function r(n) {
      if (n.ep) return;
      n.ep = true;
      const s = e(n);
      fetch(n.href, s);
    }
  })();
  let i;
  const S = new Array(128).fill(void 0);
  S.push(void 0, null, true, false);
  let wt = S.length;
  function st(a) {
    wt === S.length && S.push(S.length + 1);
    const t = wt;
    return wt = S[t], S[t] = a, t;
  }
  function Ie(a) {
    return S[a];
  }
  function Pe(a) {
    a < 132 || (S[a] = wt, wt = a);
  }
  function Ht(a) {
    const t = Ie(a);
    return Pe(a), t;
  }
  function g(a) {
    return a == null;
  }
  let ft = null;
  function Ft() {
    return (ft === null || ft.byteLength === 0) && (ft = new Float64Array(i.memory.buffer)), ft;
  }
  let mt = null;
  function I() {
    return (mt === null || mt.byteLength === 0) && (mt = new Int32Array(i.memory.buffer)), mt;
  }
  const Ae = typeof TextDecoder > "u" ? (0, Ce.require)("util").TextDecoder : TextDecoder;
  let Te = new Ae("utf-8", { ignoreBOM: true, fatal: true });
  Te.decode();
  function _(a, t) {
    if (!(a instanceof t)) throw new Error(`expected instance of ${t.name}`);
    return a.ptr;
  }
  let yt = null;
  function Z() {
    return (yt === null || yt.byteLength === 0) && (yt = new Float32Array(i.memory.buffer)), yt;
  }
  let C = 128;
  function P(a) {
    if (C == 1) throw new Error("out of js stack");
    return S[--C] = a, C;
  }
  function $t(a, t) {
    return a = a >>> 0, Z().subarray(a / 4, a / 4 + t);
  }
  let St = null;
  function _e() {
    return (St === null || St.byteLength === 0) && (St = new Uint32Array(i.memory.buffer)), St;
  }
  function je(a, t) {
    return a = a >>> 0, _e().subarray(a / 4, a / 4 + t);
  }
  let W = 0;
  function et(a, t) {
    const e = t(a.length * 4, 4) >>> 0;
    return Z().set(a, e / 4), W = a.length, e;
  }
  function Zt(a, t) {
    const e = t(a.length * 4, 4) >>> 0;
    return _e().set(a, e / 4), W = a.length, e;
  }
  const L = Object.freeze({ Ball: 0, 0: "Ball", Cuboid: 1, 1: "Cuboid", Capsule: 2, 2: "Capsule", Segment: 3, 3: "Segment", Polyline: 4, 4: "Polyline", Triangle: 5, 5: "Triangle", TriMesh: 6, 6: "TriMesh", HeightField: 7, 7: "HeightField", Compound: 8, 8: "Compound", ConvexPolygon: 9, 9: "ConvexPolygon", RoundCuboid: 10, 10: "RoundCuboid", RoundTriangle: 11, 11: "RoundTriangle", RoundConvexPolygon: 12, 12: "RoundConvexPolygon", HalfSpace: 13, 13: "HalfSpace" }), $ = Object.freeze({ Revolute: 0, 0: "Revolute", Fixed: 1, 1: "Fixed", Prismatic: 2, 2: "Prismatic", Rope: 3, 3: "Rope", Spring: 4, 4: "Spring", Generic: 5, 5: "Generic" }), It = Object.freeze({ X: 0, 0: "X", Y: 1, 1: "Y", AngX: 2, 2: "AngX" });
  class rt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(rt.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawbroadphase_free(t);
    }
    constructor() {
      const t = i.rawbroadphase_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
  }
  class Gt {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawccdsolver_free(t);
    }
    constructor() {
      const t = i.rawccdsolver_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
  }
  class le {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcharactercollision_free(t);
    }
    constructor() {
      const t = i.rawcharactercollision_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    handle() {
      return i.rawcharactercollision_handle(this.__wbg_ptr);
    }
    translationDeltaApplied() {
      const t = i.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return c.__wrap(t);
    }
    translationDeltaRemaining() {
      const t = i.rawcharactercollision_translationDeltaRemaining(this.__wbg_ptr);
      return c.__wrap(t);
    }
    toi() {
      return i.rawcharactercollision_toi(this.__wbg_ptr);
    }
    worldWitness1() {
      const t = i.rawcharactercollision_worldWitness1(this.__wbg_ptr);
      return c.__wrap(t);
    }
    worldWitness2() {
      const t = i.rawcharactercollision_worldWitness2(this.__wbg_ptr);
      return c.__wrap(t);
    }
    worldNormal1() {
      const t = i.rawcharactercollision_worldNormal1(this.__wbg_ptr);
      return c.__wrap(t);
    }
    worldNormal2() {
      const t = i.rawcharactercollision_worldNormal2(this.__wbg_ptr);
      return c.__wrap(t);
    }
  }
  class A {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(A.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcolliderset_free(t);
    }
    coTranslation(t) {
      const e = i.rawcolliderset_coTranslation(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    coRotation(t) {
      const e = i.rawcolliderset_coRotation(this.__wbg_ptr, t);
      return R.__wrap(e);
    }
    coSetTranslation(t, e, r) {
      i.rawcolliderset_coSetTranslation(this.__wbg_ptr, t, e, r);
    }
    coSetTranslationWrtParent(t, e, r) {
      i.rawcolliderset_coSetTranslationWrtParent(this.__wbg_ptr, t, e, r);
    }
    coSetRotation(t, e) {
      i.rawcolliderset_coSetRotation(this.__wbg_ptr, t, e);
    }
    coSetRotationWrtParent(t, e) {
      i.rawcolliderset_coSetRotationWrtParent(this.__wbg_ptr, t, e);
    }
    coIsSensor(t) {
      return i.rawcolliderset_coIsSensor(this.__wbg_ptr, t) !== 0;
    }
    coShapeType(t) {
      return i.rawcolliderset_coShapeType(this.__wbg_ptr, t);
    }
    coHalfspaceNormal(t) {
      const e = i.rawcolliderset_coHalfspaceNormal(this.__wbg_ptr, t);
      return e === 0 ? void 0 : c.__wrap(e);
    }
    coHalfExtents(t) {
      const e = i.rawcolliderset_coHalfExtents(this.__wbg_ptr, t);
      return e === 0 ? void 0 : c.__wrap(e);
    }
    coSetHalfExtents(t, e) {
      _(e, c), i.rawcolliderset_coSetHalfExtents(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    coRadius(t) {
      try {
        const n = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coRadius(n, this.__wbg_ptr, t);
        var e = I()[n / 4 + 0], r = Z()[n / 4 + 1];
        return e === 0 ? void 0 : r;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coSetRadius(t, e) {
      i.rawcolliderset_coSetRadius(this.__wbg_ptr, t, e);
    }
    coHalfHeight(t) {
      try {
        const n = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coHalfHeight(n, this.__wbg_ptr, t);
        var e = I()[n / 4 + 0], r = Z()[n / 4 + 1];
        return e === 0 ? void 0 : r;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coSetHalfHeight(t, e) {
      i.rawcolliderset_coSetHalfHeight(this.__wbg_ptr, t, e);
    }
    coRoundRadius(t) {
      try {
        const n = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coRoundRadius(n, this.__wbg_ptr, t);
        var e = I()[n / 4 + 0], r = Z()[n / 4 + 1];
        return e === 0 ? void 0 : r;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coSetRoundRadius(t, e) {
      i.rawcolliderset_coSetRoundRadius(this.__wbg_ptr, t, e);
    }
    coVertices(t) {
      try {
        const n = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coVertices(n, this.__wbg_ptr, t);
        var e = I()[n / 4 + 0], r = I()[n / 4 + 1];
        let s;
        return e !== 0 && (s = $t(e, r).slice(), i.__wbindgen_free(e, r * 4, 4)), s;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coIndices(t) {
      try {
        const n = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coIndices(n, this.__wbg_ptr, t);
        var e = I()[n / 4 + 0], r = I()[n / 4 + 1];
        let s;
        return e !== 0 && (s = je(e, r).slice(), i.__wbindgen_free(e, r * 4, 4)), s;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coTriMeshFlags(t) {
      try {
        const n = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coTriMeshFlags(n, this.__wbg_ptr, t);
        var e = I()[n / 4 + 0], r = I()[n / 4 + 1];
        return e === 0 ? void 0 : r >>> 0;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coHeightfieldHeights(t) {
      try {
        const n = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coHeightfieldHeights(n, this.__wbg_ptr, t);
        var e = I()[n / 4 + 0], r = I()[n / 4 + 1];
        let s;
        return e !== 0 && (s = $t(e, r).slice(), i.__wbindgen_free(e, r * 4, 4)), s;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coHeightfieldScale(t) {
      const e = i.rawcolliderset_coHeightfieldScale(this.__wbg_ptr, t);
      return e === 0 ? void 0 : c.__wrap(e);
    }
    coParent(t) {
      try {
        const n = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coParent(n, this.__wbg_ptr, t);
        var e = I()[n / 4 + 0], r = Ft()[n / 8 + 1];
        return e === 0 ? void 0 : r;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coSetEnabled(t, e) {
      i.rawcolliderset_coSetEnabled(this.__wbg_ptr, t, e);
    }
    coIsEnabled(t) {
      return i.rawcolliderset_coIsEnabled(this.__wbg_ptr, t) !== 0;
    }
    coSetContactSkin(t, e) {
      i.rawcolliderset_coSetContactSkin(this.__wbg_ptr, t, e);
    }
    coContactSkin(t) {
      return i.rawcolliderset_coContactSkin(this.__wbg_ptr, t);
    }
    coFriction(t) {
      return i.rawcolliderset_coFriction(this.__wbg_ptr, t);
    }
    coRestitution(t) {
      return i.rawcolliderset_coRestitution(this.__wbg_ptr, t);
    }
    coDensity(t) {
      return i.rawcolliderset_coDensity(this.__wbg_ptr, t);
    }
    coMass(t) {
      return i.rawcolliderset_coMass(this.__wbg_ptr, t);
    }
    coVolume(t) {
      return i.rawcolliderset_coVolume(this.__wbg_ptr, t);
    }
    coCollisionGroups(t) {
      return i.rawcolliderset_coCollisionGroups(this.__wbg_ptr, t) >>> 0;
    }
    coSolverGroups(t) {
      return i.rawcolliderset_coSolverGroups(this.__wbg_ptr, t) >>> 0;
    }
    coActiveHooks(t) {
      return i.rawcolliderset_coActiveHooks(this.__wbg_ptr, t) >>> 0;
    }
    coActiveCollisionTypes(t) {
      return i.rawcolliderset_coActiveCollisionTypes(this.__wbg_ptr, t);
    }
    coActiveEvents(t) {
      return i.rawcolliderset_coActiveEvents(this.__wbg_ptr, t) >>> 0;
    }
    coContactForceEventThreshold(t) {
      return i.rawcolliderset_coContactForceEventThreshold(this.__wbg_ptr, t);
    }
    coContainsPoint(t, e) {
      return _(e, c), i.rawcolliderset_coContainsPoint(this.__wbg_ptr, t, e.__wbg_ptr) !== 0;
    }
    coCastShape(t, e, r, n, s, o, l, h, d) {
      _(e, c), _(r, m), _(n, c), _(s, R), _(o, c);
      const p = i.rawcolliderset_coCastShape(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr, o.__wbg_ptr, l, h, d);
      return p === 0 ? void 0 : jt.__wrap(p);
    }
    coCastCollider(t, e, r, n, s, o, l) {
      _(e, c), _(n, c);
      const h = i.rawcolliderset_coCastCollider(this.__wbg_ptr, t, e.__wbg_ptr, r, n.__wbg_ptr, s, o, l);
      return h === 0 ? void 0 : Pt.__wrap(h);
    }
    coIntersectsShape(t, e, r, n) {
      return _(e, m), _(r, c), _(n, R), i.rawcolliderset_coIntersectsShape(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr) !== 0;
    }
    coContactShape(t, e, r, n, s) {
      _(e, m), _(r, c), _(n, R);
      const o = i.rawcolliderset_coContactShape(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s);
      return o === 0 ? void 0 : ht.__wrap(o);
    }
    coContactCollider(t, e, r) {
      const n = i.rawcolliderset_coContactCollider(this.__wbg_ptr, t, e, r);
      return n === 0 ? void 0 : ht.__wrap(n);
    }
    coProjectPoint(t, e, r) {
      _(e, c);
      const n = i.rawcolliderset_coProjectPoint(this.__wbg_ptr, t, e.__wbg_ptr, r);
      return At.__wrap(n);
    }
    coIntersectsRay(t, e, r, n) {
      return _(e, c), _(r, c), i.rawcolliderset_coIntersectsRay(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n) !== 0;
    }
    coCastRay(t, e, r, n, s) {
      return _(e, c), _(r, c), i.rawcolliderset_coCastRay(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n, s);
    }
    coCastRayAndGetNormal(t, e, r, n, s) {
      _(e, c), _(r, c);
      const o = i.rawcolliderset_coCastRayAndGetNormal(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n, s);
      return o === 0 ? void 0 : Tt.__wrap(o);
    }
    coSetSensor(t, e) {
      i.rawcolliderset_coSetSensor(this.__wbg_ptr, t, e);
    }
    coSetRestitution(t, e) {
      i.rawcolliderset_coSetRestitution(this.__wbg_ptr, t, e);
    }
    coSetFriction(t, e) {
      i.rawcolliderset_coSetFriction(this.__wbg_ptr, t, e);
    }
    coFrictionCombineRule(t) {
      return i.rawcolliderset_coFrictionCombineRule(this.__wbg_ptr, t) >>> 0;
    }
    coSetFrictionCombineRule(t, e) {
      i.rawcolliderset_coSetFrictionCombineRule(this.__wbg_ptr, t, e);
    }
    coRestitutionCombineRule(t) {
      return i.rawcolliderset_coRestitutionCombineRule(this.__wbg_ptr, t) >>> 0;
    }
    coSetRestitutionCombineRule(t, e) {
      i.rawcolliderset_coSetRestitutionCombineRule(this.__wbg_ptr, t, e);
    }
    coSetCollisionGroups(t, e) {
      i.rawcolliderset_coSetCollisionGroups(this.__wbg_ptr, t, e);
    }
    coSetSolverGroups(t, e) {
      i.rawcolliderset_coSetSolverGroups(this.__wbg_ptr, t, e);
    }
    coSetActiveHooks(t, e) {
      i.rawcolliderset_coSetActiveHooks(this.__wbg_ptr, t, e);
    }
    coSetActiveEvents(t, e) {
      i.rawcolliderset_coSetActiveEvents(this.__wbg_ptr, t, e);
    }
    coSetActiveCollisionTypes(t, e) {
      i.rawcolliderset_coSetActiveCollisionTypes(this.__wbg_ptr, t, e);
    }
    coSetShape(t, e) {
      _(e, m), i.rawcolliderset_coSetShape(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    coSetContactForceEventThreshold(t, e) {
      i.rawcolliderset_coSetContactForceEventThreshold(this.__wbg_ptr, t, e);
    }
    coSetDensity(t, e) {
      i.rawcolliderset_coSetDensity(this.__wbg_ptr, t, e);
    }
    coSetMass(t, e) {
      i.rawcolliderset_coSetMass(this.__wbg_ptr, t, e);
    }
    coSetMassProperties(t, e, r, n) {
      _(r, c), i.rawcolliderset_coSetMassProperties(this.__wbg_ptr, t, e, r.__wbg_ptr, n);
    }
    constructor() {
      const t = i.rawcolliderset_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    len() {
      return i.rawcolliderset_len(this.__wbg_ptr) >>> 0;
    }
    contains(t) {
      return i.rawcolliderset_contains(this.__wbg_ptr, t) !== 0;
    }
    createCollider(t, e, r, n, s, o, l, h, d, p, u, b, f, y, v, G, z, O, X, ot, _t, lt, ct, j) {
      try {
        const M = i.__wbindgen_add_to_stack_pointer(-16);
        _(e, m), _(r, c), _(n, R), _(l, c), _(j, T), i.rawcolliderset_createCollider(M, this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s, o, l.__wbg_ptr, h, d, p, u, b, f, y, v, G, z, O, X, ot, _t, lt, ct, j.__wbg_ptr);
        var H = I()[M / 4 + 0], F = Ft()[M / 8 + 1];
        return H === 0 ? void 0 : F;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    remove(t, e, r, n) {
      _(e, K), _(r, T), i.rawcolliderset_remove(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n);
    }
    isHandleValid(t) {
      return i.rawcolliderset_contains(this.__wbg_ptr, t) !== 0;
    }
    forEachColliderHandle(t) {
      try {
        i.rawcolliderset_forEachColliderHandle(this.__wbg_ptr, P(t));
      } finally {
        S[C++] = void 0;
      }
    }
  }
  class Pt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Pt.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcollidershapecasthit_free(t);
    }
    colliderHandle() {
      return i.rawcollidershapecasthit_colliderHandle(this.__wbg_ptr);
    }
    time_of_impact() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
    witness1() {
      const t = i.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return c.__wrap(t);
    }
    witness2() {
      const t = i.rawcollidershapecasthit_witness2(this.__wbg_ptr);
      return c.__wrap(t);
    }
    normal1() {
      const t = i.rawcollidershapecasthit_normal1(this.__wbg_ptr);
      return c.__wrap(t);
    }
    normal2() {
      const t = i.rawcollidershapecasthit_normal2(this.__wbg_ptr);
      return c.__wrap(t);
    }
  }
  class Ut {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Ut.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcontactmanifold_free(t);
    }
    normal() {
      const t = i.rawcontactmanifold_normal(this.__wbg_ptr);
      return c.__wrap(t);
    }
    local_n1() {
      const t = i.rawcontactmanifold_local_n1(this.__wbg_ptr);
      return c.__wrap(t);
    }
    local_n2() {
      const t = i.rawcontactmanifold_local_n2(this.__wbg_ptr);
      return c.__wrap(t);
    }
    subshape1() {
      return i.rawcontactmanifold_subshape1(this.__wbg_ptr) >>> 0;
    }
    subshape2() {
      return i.rawcontactmanifold_subshape2(this.__wbg_ptr) >>> 0;
    }
    num_contacts() {
      return i.rawcontactmanifold_num_contacts(this.__wbg_ptr) >>> 0;
    }
    contact_local_p1(t) {
      const e = i.rawcontactmanifold_contact_local_p1(this.__wbg_ptr, t);
      return e === 0 ? void 0 : c.__wrap(e);
    }
    contact_local_p2(t) {
      const e = i.rawcontactmanifold_contact_local_p2(this.__wbg_ptr, t);
      return e === 0 ? void 0 : c.__wrap(e);
    }
    contact_dist(t) {
      return i.rawcontactmanifold_contact_dist(this.__wbg_ptr, t);
    }
    contact_fid1(t) {
      return i.rawcontactmanifold_contact_fid1(this.__wbg_ptr, t) >>> 0;
    }
    contact_fid2(t) {
      return i.rawcontactmanifold_contact_fid2(this.__wbg_ptr, t) >>> 0;
    }
    contact_impulse(t) {
      return i.rawcontactmanifold_contact_impulse(this.__wbg_ptr, t);
    }
    contact_tangent_impulse(t) {
      return i.rawcontactmanifold_contact_tangent_impulse(this.__wbg_ptr, t);
    }
    num_solver_contacts() {
      return i.rawcontactmanifold_num_solver_contacts(this.__wbg_ptr) >>> 0;
    }
    solver_contact_point(t) {
      const e = i.rawcontactmanifold_solver_contact_point(this.__wbg_ptr, t);
      return e === 0 ? void 0 : c.__wrap(e);
    }
    solver_contact_dist(t) {
      return i.rawcontactmanifold_solver_contact_dist(this.__wbg_ptr, t);
    }
    solver_contact_friction(t) {
      return i.rawcontactmanifold_solver_contact_friction(this.__wbg_ptr, t);
    }
    solver_contact_restitution(t) {
      return i.rawcontactmanifold_solver_contact_restitution(this.__wbg_ptr, t);
    }
    solver_contact_tangent_velocity(t) {
      const e = i.rawcontactmanifold_solver_contact_tangent_velocity(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
  }
  class Xt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Xt.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcontactpair_free(t);
    }
    collider1() {
      return i.rawcontactpair_collider1(this.__wbg_ptr);
    }
    collider2() {
      return i.rawcontactpair_collider2(this.__wbg_ptr);
    }
    numContactManifolds() {
      return i.rawcontactpair_numContactManifolds(this.__wbg_ptr) >>> 0;
    }
    contactManifold(t) {
      const e = i.rawcontactpair_contactManifold(this.__wbg_ptr, t);
      return e === 0 ? void 0 : Ut.__wrap(e);
    }
  }
  class Me {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawdebugrenderpipeline_free(t);
    }
    constructor() {
      const t = i.rawdebugrenderpipeline_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    vertices() {
      const t = i.rawdebugrenderpipeline_vertices(this.__wbg_ptr);
      return Ht(t);
    }
    colors() {
      const t = i.rawdebugrenderpipeline_colors(this.__wbg_ptr);
      return Ht(t);
    }
    render(t, e, r, n, s) {
      _(t, T), _(e, A), _(r, V), _(n, Y), _(s, Q), i.rawdebugrenderpipeline_render(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr);
    }
  }
  class Jt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Jt.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawdeserializedworld_free(t);
    }
    takeGravity() {
      const t = i.rawdeserializedworld_takeGravity(this.__wbg_ptr);
      return t === 0 ? void 0 : c.__wrap(t);
    }
    takeIntegrationParameters() {
      const t = i.rawdeserializedworld_takeIntegrationParameters(this.__wbg_ptr);
      return t === 0 ? void 0 : it.__wrap(t);
    }
    takeIslandManager() {
      const t = i.rawdeserializedworld_takeIslandManager(this.__wbg_ptr);
      return t === 0 ? void 0 : K.__wrap(t);
    }
    takeBroadPhase() {
      const t = i.rawdeserializedworld_takeBroadPhase(this.__wbg_ptr);
      return t === 0 ? void 0 : rt.__wrap(t);
    }
    takeNarrowPhase() {
      const t = i.rawdeserializedworld_takeNarrowPhase(this.__wbg_ptr);
      return t === 0 ? void 0 : Q.__wrap(t);
    }
    takeBodies() {
      const t = i.rawdeserializedworld_takeBodies(this.__wbg_ptr);
      return t === 0 ? void 0 : T.__wrap(t);
    }
    takeColliders() {
      const t = i.rawdeserializedworld_takeColliders(this.__wbg_ptr);
      return t === 0 ? void 0 : A.__wrap(t);
    }
    takeImpulseJoints() {
      const t = i.rawdeserializedworld_takeImpulseJoints(this.__wbg_ptr);
      return t === 0 ? void 0 : V.__wrap(t);
    }
    takeMultibodyJoints() {
      const t = i.rawdeserializedworld_takeMultibodyJoints(this.__wbg_ptr);
      return t === 0 ? void 0 : Y.__wrap(t);
    }
  }
  class De {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_raweventqueue_free(t);
    }
    constructor(t) {
      const e = i.raweventqueue_new(t);
      return this.__wbg_ptr = e >>> 0, this;
    }
    drainCollisionEvents(t) {
      try {
        i.raweventqueue_drainCollisionEvents(this.__wbg_ptr, P(t));
      } finally {
        S[C++] = void 0;
      }
    }
    drainContactForceEvents(t) {
      try {
        i.raweventqueue_drainContactForceEvents(this.__wbg_ptr, P(t));
      } finally {
        S[C++] = void 0;
      }
    }
    clear() {
      i.raweventqueue_clear(this.__wbg_ptr);
    }
  }
  class J {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(J.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawgenericjoint_free(t);
    }
    static spring(t, e, r, n, s) {
      _(n, c), _(s, c);
      const o = i.rawgenericjoint_spring(t, e, r, n.__wbg_ptr, s.__wbg_ptr);
      return J.__wrap(o);
    }
    static rope(t, e, r) {
      _(e, c), _(r, c);
      const n = i.rawgenericjoint_rope(t, e.__wbg_ptr, r.__wbg_ptr);
      return J.__wrap(n);
    }
    static prismatic(t, e, r, n, s, o) {
      _(t, c), _(e, c), _(r, c);
      const l = i.rawgenericjoint_prismatic(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n, s, o);
      return l === 0 ? void 0 : J.__wrap(l);
    }
    static fixed(t, e, r, n) {
      _(t, c), _(e, R), _(r, c), _(n, R);
      const s = i.rawgenericjoint_fixed(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr);
      return J.__wrap(s);
    }
    static revolute(t, e) {
      _(t, c), _(e, c);
      const r = i.rawgenericjoint_revolute(t.__wbg_ptr, e.__wbg_ptr);
      return r === 0 ? void 0 : J.__wrap(r);
    }
  }
  class V {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(V.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawimpulsejointset_free(t);
    }
    jointType(t) {
      return i.rawimpulsejointset_jointType(this.__wbg_ptr, t);
    }
    jointBodyHandle1(t) {
      return i.rawimpulsejointset_jointBodyHandle1(this.__wbg_ptr, t);
    }
    jointBodyHandle2(t) {
      return i.rawimpulsejointset_jointBodyHandle2(this.__wbg_ptr, t);
    }
    jointFrameX1(t) {
      const e = i.rawimpulsejointset_jointFrameX1(this.__wbg_ptr, t);
      return R.__wrap(e);
    }
    jointFrameX2(t) {
      const e = i.rawimpulsejointset_jointFrameX2(this.__wbg_ptr, t);
      return R.__wrap(e);
    }
    jointAnchor1(t) {
      const e = i.rawimpulsejointset_jointAnchor1(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    jointAnchor2(t) {
      const e = i.rawimpulsejointset_jointAnchor2(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    jointSetAnchor1(t, e) {
      _(e, c), i.rawimpulsejointset_jointSetAnchor1(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    jointSetAnchor2(t, e) {
      _(e, c), i.rawimpulsejointset_jointSetAnchor2(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    jointContactsEnabled(t) {
      return i.rawimpulsejointset_jointContactsEnabled(this.__wbg_ptr, t) !== 0;
    }
    jointSetContactsEnabled(t, e) {
      i.rawimpulsejointset_jointSetContactsEnabled(this.__wbg_ptr, t, e);
    }
    jointLimitsEnabled(t, e) {
      return i.rawimpulsejointset_jointLimitsEnabled(this.__wbg_ptr, t, e) !== 0;
    }
    jointLimitsMin(t, e) {
      return i.rawimpulsejointset_jointLimitsMin(this.__wbg_ptr, t, e);
    }
    jointLimitsMax(t, e) {
      return i.rawimpulsejointset_jointLimitsMax(this.__wbg_ptr, t, e);
    }
    jointSetLimits(t, e, r, n) {
      i.rawimpulsejointset_jointSetLimits(this.__wbg_ptr, t, e, r, n);
    }
    jointConfigureMotorModel(t, e, r) {
      i.rawimpulsejointset_jointConfigureMotorModel(this.__wbg_ptr, t, e, r);
    }
    jointConfigureMotorVelocity(t, e, r, n) {
      i.rawimpulsejointset_jointConfigureMotorVelocity(this.__wbg_ptr, t, e, r, n);
    }
    jointConfigureMotorPosition(t, e, r, n, s) {
      i.rawimpulsejointset_jointConfigureMotorPosition(this.__wbg_ptr, t, e, r, n, s);
    }
    jointConfigureMotor(t, e, r, n, s, o) {
      i.rawimpulsejointset_jointConfigureMotor(this.__wbg_ptr, t, e, r, n, s, o);
    }
    constructor() {
      const t = i.rawimpulsejointset_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    createJoint(t, e, r, n) {
      return _(t, J), i.rawimpulsejointset_createJoint(this.__wbg_ptr, t.__wbg_ptr, e, r, n);
    }
    remove(t, e) {
      i.rawimpulsejointset_remove(this.__wbg_ptr, t, e);
    }
    len() {
      return i.rawimpulsejointset_len(this.__wbg_ptr) >>> 0;
    }
    contains(t) {
      return i.rawimpulsejointset_contains(this.__wbg_ptr, t) !== 0;
    }
    forEachJointHandle(t) {
      try {
        i.rawimpulsejointset_forEachJointHandle(this.__wbg_ptr, P(t));
      } finally {
        S[C++] = void 0;
      }
    }
    forEachJointAttachedToRigidBody(t, e) {
      try {
        i.rawimpulsejointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, t, P(e));
      } finally {
        S[C++] = void 0;
      }
    }
  }
  class it {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(it.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawintegrationparameters_free(t);
    }
    constructor() {
      const t = i.rawintegrationparameters_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    get dt() {
      return i.rawintegrationparameters_dt(this.__wbg_ptr);
    }
    get erp() {
      return i.rawintegrationparameters_erp(this.__wbg_ptr);
    }
    get normalizedAllowedLinearError() {
      return i.rawcontactforceevent_max_force_magnitude(this.__wbg_ptr);
    }
    get normalizedPredictionDistance() {
      return i.rawintegrationparameters_normalizedPredictionDistance(this.__wbg_ptr);
    }
    get numSolverIterations() {
      return i.rawintegrationparameters_numSolverIterations(this.__wbg_ptr) >>> 0;
    }
    get numAdditionalFrictionIterations() {
      return i.rawintegrationparameters_numAdditionalFrictionIterations(this.__wbg_ptr) >>> 0;
    }
    get numInternalPgsIterations() {
      return i.rawintegrationparameters_numInternalPgsIterations(this.__wbg_ptr) >>> 0;
    }
    get minIslandSize() {
      return i.rawimpulsejointset_len(this.__wbg_ptr) >>> 0;
    }
    get maxCcdSubsteps() {
      return i.rawintegrationparameters_maxCcdSubsteps(this.__wbg_ptr) >>> 0;
    }
    get lengthUnit() {
      return i.rawcontactforceevent_total_force_magnitude(this.__wbg_ptr);
    }
    set dt(t) {
      i.rawintegrationparameters_set_dt(this.__wbg_ptr, t);
    }
    set erp(t) {
      i.rawintegrationparameters_set_erp(this.__wbg_ptr, t);
    }
    set normalizedAllowedLinearError(t) {
      i.rawintegrationparameters_set_normalizedAllowedLinearError(this.__wbg_ptr, t);
    }
    set normalizedPredictionDistance(t) {
      i.rawintegrationparameters_set_normalizedPredictionDistance(this.__wbg_ptr, t);
    }
    set numSolverIterations(t) {
      i.rawintegrationparameters_set_numSolverIterations(this.__wbg_ptr, t);
    }
    set numAdditionalFrictionIterations(t) {
      i.rawintegrationparameters_set_numAdditionalFrictionIterations(this.__wbg_ptr, t);
    }
    set numInternalPgsIterations(t) {
      i.rawintegrationparameters_set_numInternalPgsIterations(this.__wbg_ptr, t);
    }
    set minIslandSize(t) {
      i.rawintegrationparameters_set_minIslandSize(this.__wbg_ptr, t);
    }
    set maxCcdSubsteps(t) {
      i.rawintegrationparameters_set_maxCcdSubsteps(this.__wbg_ptr, t);
    }
    set lengthUnit(t) {
      i.rawintegrationparameters_set_lengthUnit(this.__wbg_ptr, t);
    }
    switchToStandardPgsSolver() {
      i.rawintegrationparameters_switchToStandardPgsSolver(this.__wbg_ptr);
    }
    switchToSmallStepsPgsSolver() {
      i.rawintegrationparameters_switchToSmallStepsPgsSolver(this.__wbg_ptr);
    }
    switchToSmallStepsPgsSolverWithoutWarmstart() {
      i.rawintegrationparameters_switchToSmallStepsPgsSolverWithoutWarmstart(this.__wbg_ptr);
    }
  }
  class K {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(K.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawislandmanager_free(t);
    }
    constructor() {
      const t = i.rawislandmanager_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    forEachActiveRigidBodyHandle(t) {
      try {
        i.rawislandmanager_forEachActiveRigidBodyHandle(this.__wbg_ptr, P(t));
      } finally {
        S[C++] = void 0;
      }
    }
  }
  class xe {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawkinematiccharactercontroller_free(t);
    }
    constructor(t) {
      const e = i.rawkinematiccharactercontroller_new(t);
      return this.__wbg_ptr = e >>> 0, this;
    }
    up() {
      const t = i.rawcollidershapecasthit_normal2(this.__wbg_ptr);
      return c.__wrap(t);
    }
    setUp(t) {
      _(t, c), i.rawkinematiccharactercontroller_setUp(this.__wbg_ptr, t.__wbg_ptr);
    }
    normalNudgeFactor() {
      return i.rawkinematiccharactercontroller_normalNudgeFactor(this.__wbg_ptr);
    }
    setNormalNudgeFactor(t) {
      i.rawkinematiccharactercontroller_setNormalNudgeFactor(this.__wbg_ptr, t);
    }
    offset() {
      return i.rawintegrationparameters_dt(this.__wbg_ptr);
    }
    setOffset(t) {
      i.rawkinematiccharactercontroller_setOffset(this.__wbg_ptr, t);
    }
    slideEnabled() {
      return i.rawkinematiccharactercontroller_slideEnabled(this.__wbg_ptr) !== 0;
    }
    setSlideEnabled(t) {
      i.rawkinematiccharactercontroller_setSlideEnabled(this.__wbg_ptr, t);
    }
    autostepMaxHeight() {
      try {
        const r = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawkinematiccharactercontroller_autostepMaxHeight(r, this.__wbg_ptr);
        var t = I()[r / 4 + 0], e = Z()[r / 4 + 1];
        return t === 0 ? void 0 : e;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    autostepMinWidth() {
      try {
        const r = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawkinematiccharactercontroller_autostepMinWidth(r, this.__wbg_ptr);
        var t = I()[r / 4 + 0], e = Z()[r / 4 + 1];
        return t === 0 ? void 0 : e;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    autostepIncludesDynamicBodies() {
      const t = i.rawkinematiccharactercontroller_autostepIncludesDynamicBodies(this.__wbg_ptr);
      return t === 16777215 ? void 0 : t !== 0;
    }
    autostepEnabled() {
      return i.rawkinematiccharactercontroller_autostepEnabled(this.__wbg_ptr) !== 0;
    }
    enableAutostep(t, e, r) {
      i.rawkinematiccharactercontroller_enableAutostep(this.__wbg_ptr, t, e, r);
    }
    disableAutostep() {
      i.rawkinematiccharactercontroller_disableAutostep(this.__wbg_ptr);
    }
    maxSlopeClimbAngle() {
      return i.rawintegrationparameters_normalizedPredictionDistance(this.__wbg_ptr);
    }
    setMaxSlopeClimbAngle(t) {
      i.rawintegrationparameters_set_normalizedPredictionDistance(this.__wbg_ptr, t);
    }
    minSlopeSlideAngle() {
      return i.rawkinematiccharactercontroller_minSlopeSlideAngle(this.__wbg_ptr);
    }
    setMinSlopeSlideAngle(t) {
      i.rawkinematiccharactercontroller_setMinSlopeSlideAngle(this.__wbg_ptr, t);
    }
    snapToGroundDistance() {
      try {
        const r = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawkinematiccharactercontroller_snapToGroundDistance(r, this.__wbg_ptr);
        var t = I()[r / 4 + 0], e = Z()[r / 4 + 1];
        return t === 0 ? void 0 : e;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    enableSnapToGround(t) {
      i.rawkinematiccharactercontroller_enableSnapToGround(this.__wbg_ptr, t);
    }
    disableSnapToGround() {
      i.rawkinematiccharactercontroller_disableSnapToGround(this.__wbg_ptr);
    }
    snapToGroundEnabled() {
      return i.rawkinematiccharactercontroller_snapToGroundEnabled(this.__wbg_ptr) !== 0;
    }
    computeColliderMovement(t, e, r, n, s, o, l, h, d, p, u) {
      try {
        _(e, T), _(r, A), _(n, ce), _(o, c), i.rawkinematiccharactercontroller_computeColliderMovement(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s, o.__wbg_ptr, l, !g(h), g(h) ? 0 : h, d, !g(p), g(p) ? 0 : p, P(u));
      } finally {
        S[C++] = void 0;
      }
    }
    computedMovement() {
      const t = i.rawkinematiccharactercontroller_computedMovement(this.__wbg_ptr);
      return c.__wrap(t);
    }
    computedGrounded() {
      return i.rawkinematiccharactercontroller_computedGrounded(this.__wbg_ptr) !== 0;
    }
    numComputedCollisions() {
      return i.rawkinematiccharactercontroller_numComputedCollisions(this.__wbg_ptr) >>> 0;
    }
    computedCollision(t, e) {
      return _(e, le), i.rawkinematiccharactercontroller_computedCollision(this.__wbg_ptr, t, e.__wbg_ptr) !== 0;
    }
  }
  class Y {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Y.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawmultibodyjointset_free(t);
    }
    jointType(t) {
      return i.rawmultibodyjointset_jointType(this.__wbg_ptr, t);
    }
    jointFrameX1(t) {
      const e = i.rawmultibodyjointset_jointFrameX1(this.__wbg_ptr, t);
      return R.__wrap(e);
    }
    jointFrameX2(t) {
      const e = i.rawmultibodyjointset_jointFrameX2(this.__wbg_ptr, t);
      return R.__wrap(e);
    }
    jointAnchor1(t) {
      const e = i.rawmultibodyjointset_jointAnchor1(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    jointAnchor2(t) {
      const e = i.rawmultibodyjointset_jointAnchor2(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    jointContactsEnabled(t) {
      return i.rawmultibodyjointset_jointContactsEnabled(this.__wbg_ptr, t) !== 0;
    }
    jointSetContactsEnabled(t, e) {
      i.rawmultibodyjointset_jointSetContactsEnabled(this.__wbg_ptr, t, e);
    }
    jointLimitsEnabled(t, e) {
      return i.rawmultibodyjointset_jointLimitsEnabled(this.__wbg_ptr, t, e) !== 0;
    }
    jointLimitsMin(t, e) {
      return i.rawmultibodyjointset_jointLimitsMin(this.__wbg_ptr, t, e);
    }
    jointLimitsMax(t, e) {
      return i.rawmultibodyjointset_jointLimitsMax(this.__wbg_ptr, t, e);
    }
    constructor() {
      const t = i.rawmultibodyjointset_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    createJoint(t, e, r, n) {
      return _(t, J), i.rawmultibodyjointset_createJoint(this.__wbg_ptr, t.__wbg_ptr, e, r, n);
    }
    remove(t, e) {
      i.rawmultibodyjointset_remove(this.__wbg_ptr, t, e);
    }
    contains(t) {
      return i.rawmultibodyjointset_contains(this.__wbg_ptr, t) !== 0;
    }
    forEachJointHandle(t) {
      try {
        i.rawmultibodyjointset_forEachJointHandle(this.__wbg_ptr, P(t));
      } finally {
        S[C++] = void 0;
      }
    }
    forEachJointAttachedToRigidBody(t, e) {
      try {
        i.rawmultibodyjointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, t, P(e));
      } finally {
        S[C++] = void 0;
      }
    }
  }
  class Q {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Q.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawnarrowphase_free(t);
    }
    constructor() {
      const t = i.rawnarrowphase_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    contact_pairs_with(t, e) {
      i.rawnarrowphase_contact_pairs_with(this.__wbg_ptr, t, st(e));
    }
    contact_pair(t, e) {
      const r = i.rawnarrowphase_contact_pair(this.__wbg_ptr, t, e);
      return r === 0 ? void 0 : Xt.__wrap(r);
    }
    intersection_pairs_with(t, e) {
      i.rawnarrowphase_intersection_pairs_with(this.__wbg_ptr, t, st(e));
    }
    intersection_pair(t, e) {
      return i.rawnarrowphase_intersection_pair(this.__wbg_ptr, t, e) !== 0;
    }
  }
  class Ne {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawphysicspipeline_free(t);
    }
    constructor() {
      const t = i.rawphysicspipeline_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    step(t, e, r, n, s, o, l, h, d, p) {
      _(t, c), _(e, it), _(r, K), _(n, rt), _(s, Q), _(o, T), _(l, A), _(h, V), _(d, Y), _(p, Gt), i.rawphysicspipeline_step(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr, o.__wbg_ptr, l.__wbg_ptr, h.__wbg_ptr, d.__wbg_ptr, p.__wbg_ptr);
    }
    stepWithEvents(t, e, r, n, s, o, l, h, d, p, u, b, f, y) {
      _(t, c), _(e, it), _(r, K), _(n, rt), _(s, Q), _(o, T), _(l, A), _(h, V), _(d, Y), _(p, Gt), _(u, De), i.rawphysicspipeline_stepWithEvents(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr, o.__wbg_ptr, l.__wbg_ptr, h.__wbg_ptr, d.__wbg_ptr, p.__wbg_ptr, u.__wbg_ptr, st(b), st(f), st(y));
    }
  }
  class Rt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Rt.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawpointcolliderprojection_free(t);
    }
    colliderHandle() {
      return i.rawpointcolliderprojection_colliderHandle(this.__wbg_ptr);
    }
    point() {
      const t = i.rawpointcolliderprojection_point(this.__wbg_ptr);
      return c.__wrap(t);
    }
    isInside() {
      return i.rawpointcolliderprojection_isInside(this.__wbg_ptr) !== 0;
    }
    featureType() {
      return i.rawpointcolliderprojection_featureType(this.__wbg_ptr);
    }
    featureId() {
      try {
        const r = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawpointcolliderprojection_featureId(r, this.__wbg_ptr);
        var t = I()[r / 4 + 0], e = I()[r / 4 + 1];
        return t === 0 ? void 0 : e >>> 0;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  class At {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(At.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawpointprojection_free(t);
    }
    point() {
      const t = i.rawpointprojection_point(this.__wbg_ptr);
      return c.__wrap(t);
    }
    isInside() {
      return i.rawpointprojection_isInside(this.__wbg_ptr) !== 0;
    }
  }
  class ce {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawquerypipeline_free(t);
    }
    constructor() {
      const t = i.rawquerypipeline_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    update(t, e) {
      _(t, T), _(e, A), i.rawquerypipeline_update(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr);
    }
    castRay(t, e, r, n, s, o, l, h, d, p, u) {
      try {
        _(t, T), _(e, A), _(r, c), _(n, c);
        const b = i.rawquerypipeline_castRay(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s, o, l, !g(h), g(h) ? 0 : h, !g(d), g(d) ? 0 : d, !g(p), g(p) ? 0 : p, P(u));
        return b === 0 ? void 0 : Vt.__wrap(b);
      } finally {
        S[C++] = void 0;
      }
    }
    castRayAndGetNormal(t, e, r, n, s, o, l, h, d, p, u) {
      try {
        _(t, T), _(e, A), _(r, c), _(n, c);
        const b = i.rawquerypipeline_castRayAndGetNormal(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s, o, l, !g(h), g(h) ? 0 : h, !g(d), g(d) ? 0 : d, !g(p), g(p) ? 0 : p, P(u));
        return b === 0 ? void 0 : Kt.__wrap(b);
      } finally {
        S[C++] = void 0;
      }
    }
    intersectionsWithRay(t, e, r, n, s, o, l, h, d, p, u, b) {
      try {
        _(t, T), _(e, A), _(r, c), _(n, c), i.rawquerypipeline_intersectionsWithRay(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s, o, P(l), h, !g(d), g(d) ? 0 : d, !g(p), g(p) ? 0 : p, !g(u), g(u) ? 0 : u, P(b));
      } finally {
        S[C++] = void 0, S[C++] = void 0;
      }
    }
    intersectionWithShape(t, e, r, n, s, o, l, h, d, p) {
      try {
        const f = i.__wbindgen_add_to_stack_pointer(-16);
        _(t, T), _(e, A), _(r, c), _(n, R), _(s, m), i.rawquerypipeline_intersectionWithShape(f, this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr, o, !g(l), g(l) ? 0 : l, !g(h), g(h) ? 0 : h, !g(d), g(d) ? 0 : d, P(p));
        var u = I()[f / 4 + 0], b = Ft()[f / 8 + 1];
        return u === 0 ? void 0 : b;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16), S[C++] = void 0;
      }
    }
    projectPoint(t, e, r, n, s, o, l, h, d) {
      try {
        _(t, T), _(e, A), _(r, c);
        const p = i.rawquerypipeline_projectPoint(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n, s, !g(o), g(o) ? 0 : o, !g(l), g(l) ? 0 : l, !g(h), g(h) ? 0 : h, P(d));
        return p === 0 ? void 0 : Rt.__wrap(p);
      } finally {
        S[C++] = void 0;
      }
    }
    projectPointAndGetFeature(t, e, r, n, s, o, l, h) {
      try {
        _(t, T), _(e, A), _(r, c);
        const d = i.rawquerypipeline_projectPointAndGetFeature(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n, !g(s), g(s) ? 0 : s, !g(o), g(o) ? 0 : o, !g(l), g(l) ? 0 : l, P(h));
        return d === 0 ? void 0 : Rt.__wrap(d);
      } finally {
        S[C++] = void 0;
      }
    }
    intersectionsWithPoint(t, e, r, n, s, o, l, h, d) {
      try {
        _(t, T), _(e, A), _(r, c), i.rawquerypipeline_intersectionsWithPoint(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, P(n), s, !g(o), g(o) ? 0 : o, !g(l), g(l) ? 0 : l, !g(h), g(h) ? 0 : h, P(d));
      } finally {
        S[C++] = void 0, S[C++] = void 0;
      }
    }
    castShape(t, e, r, n, s, o, l, h, d, p, u, b, f, y) {
      try {
        _(t, T), _(e, A), _(r, c), _(n, R), _(s, c), _(o, m);
        const v = i.rawquerypipeline_castShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr, o.__wbg_ptr, l, h, d, p, !g(u), g(u) ? 0 : u, !g(b), g(b) ? 0 : b, !g(f), g(f) ? 0 : f, P(y));
        return v === 0 ? void 0 : Pt.__wrap(v);
      } finally {
        S[C++] = void 0;
      }
    }
    intersectionsWithShape(t, e, r, n, s, o, l, h, d, p, u) {
      try {
        _(t, T), _(e, A), _(r, c), _(n, R), _(s, m), i.rawquerypipeline_intersectionsWithShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr, P(o), l, !g(h), g(h) ? 0 : h, !g(d), g(d) ? 0 : d, !g(p), g(p) ? 0 : p, P(u));
      } finally {
        S[C++] = void 0, S[C++] = void 0;
      }
    }
    collidersWithAabbIntersectingAabb(t, e, r) {
      try {
        _(t, c), _(e, c), i.rawquerypipeline_collidersWithAabbIntersectingAabb(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, P(r));
      } finally {
        S[C++] = void 0;
      }
    }
  }
  class Vt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Vt.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawraycolliderhit_free(t);
    }
    colliderHandle() {
      return i.rawcollidershapecasthit_colliderHandle(this.__wbg_ptr);
    }
    timeOfImpact() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
  }
  class Kt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Kt.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawraycolliderintersection_free(t);
    }
    colliderHandle() {
      return i.rawpointcolliderprojection_colliderHandle(this.__wbg_ptr);
    }
    normal() {
      const t = i.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return c.__wrap(t);
    }
    time_of_impact() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
    featureType() {
      return i.rawpointcolliderprojection_featureType(this.__wbg_ptr);
    }
    featureId() {
      try {
        const r = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawpointcolliderprojection_featureId(r, this.__wbg_ptr);
        var t = I()[r / 4 + 0], e = I()[r / 4 + 1];
        return t === 0 ? void 0 : e >>> 0;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  class Tt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Tt.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawrayintersection_free(t);
    }
    normal() {
      const t = i.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return c.__wrap(t);
    }
    time_of_impact() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
    featureType() {
      return i.rawpointcolliderprojection_featureType(this.__wbg_ptr);
    }
    featureId() {
      try {
        const r = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawpointcolliderprojection_featureId(r, this.__wbg_ptr);
        var t = I()[r / 4 + 0], e = I()[r / 4 + 1];
        return t === 0 ? void 0 : e >>> 0;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  class T {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(T.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawrigidbodyset_free(t);
    }
    rbTranslation(t) {
      const e = i.rawrigidbodyset_rbTranslation(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    rbRotation(t) {
      const e = i.rawrigidbodyset_rbRotation(this.__wbg_ptr, t);
      return R.__wrap(e);
    }
    rbSleep(t) {
      i.rawrigidbodyset_rbSleep(this.__wbg_ptr, t);
    }
    rbIsSleeping(t) {
      return i.rawrigidbodyset_rbIsSleeping(this.__wbg_ptr, t) !== 0;
    }
    rbIsMoving(t) {
      return i.rawrigidbodyset_rbIsMoving(this.__wbg_ptr, t) !== 0;
    }
    rbNextTranslation(t) {
      const e = i.rawrigidbodyset_rbNextTranslation(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    rbNextRotation(t) {
      const e = i.rawrigidbodyset_rbNextRotation(this.__wbg_ptr, t);
      return R.__wrap(e);
    }
    rbSetTranslation(t, e, r, n) {
      i.rawrigidbodyset_rbSetTranslation(this.__wbg_ptr, t, e, r, n);
    }
    rbSetRotation(t, e, r) {
      i.rawrigidbodyset_rbSetRotation(this.__wbg_ptr, t, e, r);
    }
    rbSetLinvel(t, e, r) {
      _(e, c), i.rawrigidbodyset_rbSetLinvel(this.__wbg_ptr, t, e.__wbg_ptr, r);
    }
    rbSetAngvel(t, e, r) {
      i.rawrigidbodyset_rbSetAngvel(this.__wbg_ptr, t, e, r);
    }
    rbSetNextKinematicTranslation(t, e, r) {
      i.rawrigidbodyset_rbSetNextKinematicTranslation(this.__wbg_ptr, t, e, r);
    }
    rbSetNextKinematicRotation(t, e) {
      i.rawrigidbodyset_rbSetNextKinematicRotation(this.__wbg_ptr, t, e);
    }
    rbRecomputeMassPropertiesFromColliders(t, e) {
      _(e, A), i.rawrigidbodyset_rbRecomputeMassPropertiesFromColliders(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    rbSetAdditionalMass(t, e, r) {
      i.rawrigidbodyset_rbSetAdditionalMass(this.__wbg_ptr, t, e, r);
    }
    rbSetAdditionalMassProperties(t, e, r, n, s) {
      _(r, c), i.rawrigidbodyset_rbSetAdditionalMassProperties(this.__wbg_ptr, t, e, r.__wbg_ptr, n, s);
    }
    rbLinvel(t) {
      const e = i.rawrigidbodyset_rbLinvel(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    rbAngvel(t) {
      return i.rawrigidbodyset_rbAngvel(this.__wbg_ptr, t);
    }
    rbLockTranslations(t, e, r) {
      i.rawrigidbodyset_rbLockTranslations(this.__wbg_ptr, t, e, r);
    }
    rbSetEnabledTranslations(t, e, r, n) {
      i.rawrigidbodyset_rbSetEnabledTranslations(this.__wbg_ptr, t, e, r, n);
    }
    rbLockRotations(t, e, r) {
      i.rawrigidbodyset_rbLockRotations(this.__wbg_ptr, t, e, r);
    }
    rbDominanceGroup(t) {
      return i.rawrigidbodyset_rbDominanceGroup(this.__wbg_ptr, t);
    }
    rbSetDominanceGroup(t, e) {
      i.rawrigidbodyset_rbSetDominanceGroup(this.__wbg_ptr, t, e);
    }
    rbEnableCcd(t, e) {
      i.rawrigidbodyset_rbEnableCcd(this.__wbg_ptr, t, e);
    }
    rbSetSoftCcdPrediction(t, e) {
      i.rawrigidbodyset_rbSetSoftCcdPrediction(this.__wbg_ptr, t, e);
    }
    rbMass(t) {
      return i.rawrigidbodyset_rbMass(this.__wbg_ptr, t);
    }
    rbInvMass(t) {
      return i.rawrigidbodyset_rbInvMass(this.__wbg_ptr, t);
    }
    rbEffectiveInvMass(t) {
      const e = i.rawrigidbodyset_rbEffectiveInvMass(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    rbLocalCom(t) {
      const e = i.rawrigidbodyset_rbLocalCom(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    rbWorldCom(t) {
      const e = i.rawrigidbodyset_rbWorldCom(this.__wbg_ptr, t);
      return c.__wrap(e);
    }
    rbInvPrincipalInertiaSqrt(t) {
      return i.rawrigidbodyset_rbInvPrincipalInertiaSqrt(this.__wbg_ptr, t);
    }
    rbPrincipalInertia(t) {
      return i.rawrigidbodyset_rbPrincipalInertia(this.__wbg_ptr, t);
    }
    rbEffectiveWorldInvInertiaSqrt(t) {
      return i.rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt(this.__wbg_ptr, t);
    }
    rbEffectiveAngularInertia(t) {
      return i.rawrigidbodyset_rbEffectiveAngularInertia(this.__wbg_ptr, t);
    }
    rbWakeUp(t) {
      i.rawrigidbodyset_rbWakeUp(this.__wbg_ptr, t);
    }
    rbIsCcdEnabled(t) {
      return i.rawrigidbodyset_rbIsCcdEnabled(this.__wbg_ptr, t) !== 0;
    }
    rbSoftCcdPrediction(t) {
      return i.rawrigidbodyset_rbSoftCcdPrediction(this.__wbg_ptr, t);
    }
    rbNumColliders(t) {
      return i.rawrigidbodyset_rbNumColliders(this.__wbg_ptr, t) >>> 0;
    }
    rbCollider(t, e) {
      return i.rawrigidbodyset_rbCollider(this.__wbg_ptr, t, e);
    }
    rbBodyType(t) {
      return i.rawrigidbodyset_rbBodyType(this.__wbg_ptr, t);
    }
    rbSetBodyType(t, e, r) {
      i.rawrigidbodyset_rbSetBodyType(this.__wbg_ptr, t, e, r);
    }
    rbIsFixed(t) {
      return i.rawrigidbodyset_rbIsFixed(this.__wbg_ptr, t) !== 0;
    }
    rbIsKinematic(t) {
      return i.rawrigidbodyset_rbIsKinematic(this.__wbg_ptr, t) !== 0;
    }
    rbIsDynamic(t) {
      return i.rawrigidbodyset_rbIsDynamic(this.__wbg_ptr, t) !== 0;
    }
    rbLinearDamping(t) {
      return i.rawrigidbodyset_rbLinearDamping(this.__wbg_ptr, t);
    }
    rbAngularDamping(t) {
      return i.rawrigidbodyset_rbAngularDamping(this.__wbg_ptr, t);
    }
    rbSetLinearDamping(t, e) {
      i.rawrigidbodyset_rbSetLinearDamping(this.__wbg_ptr, t, e);
    }
    rbSetAngularDamping(t, e) {
      i.rawrigidbodyset_rbSetAngularDamping(this.__wbg_ptr, t, e);
    }
    rbSetEnabled(t, e) {
      i.rawrigidbodyset_rbSetEnabled(this.__wbg_ptr, t, e);
    }
    rbIsEnabled(t) {
      return i.rawrigidbodyset_rbIsEnabled(this.__wbg_ptr, t) !== 0;
    }
    rbGravityScale(t) {
      return i.rawrigidbodyset_rbGravityScale(this.__wbg_ptr, t);
    }
    rbSetGravityScale(t, e, r) {
      i.rawrigidbodyset_rbSetGravityScale(this.__wbg_ptr, t, e, r);
    }
    rbResetForces(t, e) {
      i.rawrigidbodyset_rbResetForces(this.__wbg_ptr, t, e);
    }
    rbResetTorques(t, e) {
      i.rawrigidbodyset_rbResetTorques(this.__wbg_ptr, t, e);
    }
    rbAddForce(t, e, r) {
      _(e, c), i.rawrigidbodyset_rbAddForce(this.__wbg_ptr, t, e.__wbg_ptr, r);
    }
    rbApplyImpulse(t, e, r) {
      _(e, c), i.rawrigidbodyset_rbApplyImpulse(this.__wbg_ptr, t, e.__wbg_ptr, r);
    }
    rbAddTorque(t, e, r) {
      i.rawrigidbodyset_rbAddTorque(this.__wbg_ptr, t, e, r);
    }
    rbApplyTorqueImpulse(t, e, r) {
      i.rawrigidbodyset_rbApplyTorqueImpulse(this.__wbg_ptr, t, e, r);
    }
    rbAddForceAtPoint(t, e, r, n) {
      _(e, c), _(r, c), i.rawrigidbodyset_rbAddForceAtPoint(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n);
    }
    rbApplyImpulseAtPoint(t, e, r, n) {
      _(e, c), _(r, c), i.rawrigidbodyset_rbApplyImpulseAtPoint(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n);
    }
    rbAdditionalSolverIterations(t) {
      return i.rawrigidbodyset_rbAdditionalSolverIterations(this.__wbg_ptr, t) >>> 0;
    }
    rbSetAdditionalSolverIterations(t, e) {
      i.rawrigidbodyset_rbSetAdditionalSolverIterations(this.__wbg_ptr, t, e);
    }
    rbUserData(t) {
      return i.rawrigidbodyset_rbUserData(this.__wbg_ptr, t) >>> 0;
    }
    rbSetUserData(t, e) {
      i.rawrigidbodyset_rbSetUserData(this.__wbg_ptr, t, e);
    }
    constructor() {
      const t = i.rawrigidbodyset_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    createRigidBody(t, e, r, n, s, o, l, h, d, p, u, b, f, y, v, G, z, O, X, ot, _t, lt) {
      return _(e, c), _(r, R), _(l, c), _(h, c), i.rawrigidbodyset_createRigidBody(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n, s, o, l.__wbg_ptr, h.__wbg_ptr, d, p, u, b, f, y, v, G, z, O, X, ot, _t, lt);
    }
    remove(t, e, r, n, s) {
      _(e, K), _(r, A), _(n, V), _(s, Y), i.rawrigidbodyset_remove(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr);
    }
    len() {
      return i.rawcolliderset_len(this.__wbg_ptr) >>> 0;
    }
    contains(t) {
      return i.rawrigidbodyset_contains(this.__wbg_ptr, t) !== 0;
    }
    forEachRigidBodyHandle(t) {
      try {
        i.rawrigidbodyset_forEachRigidBodyHandle(this.__wbg_ptr, P(t));
      } finally {
        S[C++] = void 0;
      }
    }
    propagateModifiedBodyPositionsToColliders(t) {
      _(t, A), i.rawrigidbodyset_propagateModifiedBodyPositionsToColliders(this.__wbg_ptr, t.__wbg_ptr);
    }
  }
  class R {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(R.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawrotation_free(t);
    }
    static identity() {
      const t = i.rawrotation_identity();
      return R.__wrap(t);
    }
    static fromAngle(t) {
      const e = i.rawrotation_fromAngle(t);
      return R.__wrap(e);
    }
    get im() {
      return i.rawintegrationparameters_dt(this.__wbg_ptr);
    }
    get re() {
      return i.rawrotation_re(this.__wbg_ptr);
    }
    get angle() {
      return i.rawrotation_angle(this.__wbg_ptr);
    }
  }
  class ke {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawserializationpipeline_free(t);
    }
    constructor() {
      const t = i.rawserializationpipeline_new();
      return this.__wbg_ptr = t >>> 0, this;
    }
    serializeAll(t, e, r, n, s, o, l, h, d) {
      _(t, c), _(e, it), _(r, K), _(n, rt), _(s, Q), _(o, T), _(l, A), _(h, V), _(d, Y);
      const p = i.rawserializationpipeline_serializeAll(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr, o.__wbg_ptr, l.__wbg_ptr, h.__wbg_ptr, d.__wbg_ptr);
      return Ht(p);
    }
    deserializeAll(t) {
      const e = i.rawserializationpipeline_deserializeAll(this.__wbg_ptr, st(t));
      return e === 0 ? void 0 : Jt.__wrap(e);
    }
  }
  class m {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(m.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawshape_free(t);
    }
    static cuboid(t, e) {
      const r = i.rawshape_cuboid(t, e);
      return m.__wrap(r);
    }
    static roundCuboid(t, e, r) {
      const n = i.rawshape_roundCuboid(t, e, r);
      return m.__wrap(n);
    }
    static ball(t) {
      const e = i.rawshape_ball(t);
      return m.__wrap(e);
    }
    static halfspace(t) {
      _(t, c);
      const e = i.rawshape_halfspace(t.__wbg_ptr);
      return m.__wrap(e);
    }
    static capsule(t, e) {
      const r = i.rawshape_capsule(t, e);
      return m.__wrap(r);
    }
    static polyline(t, e) {
      const r = et(t, i.__wbindgen_malloc), n = W, s = Zt(e, i.__wbindgen_malloc), o = W, l = i.rawshape_polyline(r, n, s, o);
      return m.__wrap(l);
    }
    static trimesh(t, e, r) {
      const n = et(t, i.__wbindgen_malloc), s = W, o = Zt(e, i.__wbindgen_malloc), l = W, h = i.rawshape_trimesh(n, s, o, l, r);
      return m.__wrap(h);
    }
    static heightfield(t, e) {
      const r = et(t, i.__wbindgen_malloc), n = W;
      _(e, c);
      const s = i.rawshape_heightfield(r, n, e.__wbg_ptr);
      return m.__wrap(s);
    }
    static segment(t, e) {
      _(t, c), _(e, c);
      const r = i.rawshape_segment(t.__wbg_ptr, e.__wbg_ptr);
      return m.__wrap(r);
    }
    static triangle(t, e, r) {
      _(t, c), _(e, c), _(r, c);
      const n = i.rawshape_triangle(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr);
      return m.__wrap(n);
    }
    static roundTriangle(t, e, r, n) {
      _(t, c), _(e, c), _(r, c);
      const s = i.rawshape_roundTriangle(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n);
      return m.__wrap(s);
    }
    static convexHull(t) {
      const e = et(t, i.__wbindgen_malloc), r = W, n = i.rawshape_convexHull(e, r);
      return n === 0 ? void 0 : m.__wrap(n);
    }
    static roundConvexHull(t, e) {
      const r = et(t, i.__wbindgen_malloc), n = W, s = i.rawshape_roundConvexHull(r, n, e);
      return s === 0 ? void 0 : m.__wrap(s);
    }
    static convexPolyline(t) {
      const e = et(t, i.__wbindgen_malloc), r = W, n = i.rawshape_convexPolyline(e, r);
      return n === 0 ? void 0 : m.__wrap(n);
    }
    static roundConvexPolyline(t, e) {
      const r = et(t, i.__wbindgen_malloc), n = W, s = i.rawshape_roundConvexPolyline(r, n, e);
      return s === 0 ? void 0 : m.__wrap(s);
    }
    castShape(t, e, r, n, s, o, l, h, d, p) {
      _(t, c), _(e, R), _(r, c), _(n, m), _(s, c), _(o, R), _(l, c);
      const u = i.rawshape_castShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr, o.__wbg_ptr, l.__wbg_ptr, h, d, p);
      return u === 0 ? void 0 : jt.__wrap(u);
    }
    intersectsShape(t, e, r, n, s) {
      return _(t, c), _(e, R), _(r, m), _(n, c), _(s, R), i.rawshape_intersectsShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr) !== 0;
    }
    contactShape(t, e, r, n, s, o) {
      _(t, c), _(e, R), _(r, m), _(n, c), _(s, R);
      const l = i.rawshape_contactShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s.__wbg_ptr, o);
      return l === 0 ? void 0 : ht.__wrap(l);
    }
    containsPoint(t, e, r) {
      return _(t, c), _(e, R), _(r, c), i.rawshape_containsPoint(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr) !== 0;
    }
    projectPoint(t, e, r, n) {
      _(t, c), _(e, R), _(r, c);
      const s = i.rawshape_projectPoint(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n);
      return At.__wrap(s);
    }
    intersectsRay(t, e, r, n, s) {
      return _(t, c), _(e, R), _(r, c), _(n, c), i.rawshape_intersectsRay(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s) !== 0;
    }
    castRay(t, e, r, n, s, o) {
      return _(t, c), _(e, R), _(r, c), _(n, c), i.rawshape_castRay(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s, o);
    }
    castRayAndGetNormal(t, e, r, n, s, o) {
      _(t, c), _(e, R), _(r, c), _(n, c);
      const l = i.rawshape_castRayAndGetNormal(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, n.__wbg_ptr, s, o);
      return l === 0 ? void 0 : Tt.__wrap(l);
    }
  }
  class jt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(jt.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawshapecasthit_free(t);
    }
    time_of_impact() {
      return i.rawrotation_re(this.__wbg_ptr);
    }
    witness1() {
      const t = i.rawshapecasthit_witness1(this.__wbg_ptr);
      return c.__wrap(t);
    }
    witness2() {
      const t = i.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return c.__wrap(t);
    }
    normal1() {
      const t = i.rawcollidershapecasthit_witness2(this.__wbg_ptr);
      return c.__wrap(t);
    }
    normal2() {
      const t = i.rawcollidershapecasthit_normal1(this.__wbg_ptr);
      return c.__wrap(t);
    }
  }
  class ht {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(ht.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawshapecontact_free(t);
    }
    distance() {
      return i.rawcontactforceevent_total_force_magnitude(this.__wbg_ptr);
    }
    point1() {
      const t = i.rawpointprojection_point(this.__wbg_ptr);
      return c.__wrap(t);
    }
    point2() {
      const t = i.rawpointcolliderprojection_point(this.__wbg_ptr);
      return c.__wrap(t);
    }
    normal1() {
      const t = i.rawcontactforceevent_total_force(this.__wbg_ptr);
      return c.__wrap(t);
    }
    normal2() {
      const t = i.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return c.__wrap(t);
    }
  }
  class c {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(c.prototype);
      return e.__wbg_ptr = t, e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawvector_free(t);
    }
    static zero() {
      const t = i.rawvector_zero();
      return c.__wrap(t);
    }
    constructor(t, e) {
      const r = i.rawvector_new(t, e);
      return this.__wbg_ptr = r >>> 0, this;
    }
    get x() {
      return i.rawrotation_re(this.__wbg_ptr);
    }
    set x(t) {
      i.rawvector_set_x(this.__wbg_ptr, t);
    }
    get y() {
      return i.rawintegrationparameters_dt(this.__wbg_ptr);
    }
    set y(t) {
      i.rawintegrationparameters_set_dt(this.__wbg_ptr, t);
    }
    xy() {
      const t = i.rawvector_xy(this.__wbg_ptr);
      return c.__wrap(t);
    }
    yx() {
      const t = i.rawvector_yx(this.__wbg_ptr);
      return c.__wrap(t);
    }
  }
  class Le {
    constructor(t, e) {
      this.x = t, this.y = e;
    }
  }
  class w {
    static new(t, e) {
      return new Le(t, e);
    }
    static zeros() {
      return w.new(0, 0);
    }
    static fromRaw(t) {
      if (!t) return null;
      let e = w.new(t.x, t.y);
      return t.free(), e;
    }
    static intoRaw(t) {
      return new c(t.x, t.y);
    }
    static copy(t, e) {
      t.x = e.x, t.y = e.y;
    }
  }
  class E {
    static identity() {
      return 0;
    }
    static fromRaw(t) {
      if (!t) return null;
      let e = t.angle;
      return t.free(), e;
    }
    static intoRaw(t) {
      return R.fromAngle(t);
    }
  }
  var q;
  (function(a) {
    a[a.Dynamic = 0] = "Dynamic", a[a.Fixed = 1] = "Fixed", a[a.KinematicPositionBased = 2] = "KinematicPositionBased", a[a.KinematicVelocityBased = 3] = "KinematicVelocityBased";
  })(q || (q = {}));
  class Qt {
    constructor(t, e, r) {
      this.rawSet = t, this.colliderSet = e, this.handle = r;
    }
    finalizeDeserialization(t) {
      this.colliderSet = t;
    }
    isValid() {
      return this.rawSet.contains(this.handle);
    }
    lockTranslations(t, e) {
      return this.rawSet.rbLockTranslations(this.handle, t, e);
    }
    lockRotations(t, e) {
      return this.rawSet.rbLockRotations(this.handle, t, e);
    }
    setEnabledTranslations(t, e, r) {
      return this.rawSet.rbSetEnabledTranslations(this.handle, t, e, r);
    }
    restrictTranslations(t, e, r) {
      this.setEnabledTranslations(t, t, r);
    }
    dominanceGroup() {
      return this.rawSet.rbDominanceGroup(this.handle);
    }
    setDominanceGroup(t) {
      this.rawSet.rbSetDominanceGroup(this.handle, t);
    }
    additionalSolverIterations() {
      return this.rawSet.rbAdditionalSolverIterations(this.handle);
    }
    setAdditionalSolverIterations(t) {
      this.rawSet.rbSetAdditionalSolverIterations(this.handle, t);
    }
    enableCcd(t) {
      this.rawSet.rbEnableCcd(this.handle, t);
    }
    setSoftCcdPrediction(t) {
      this.rawSet.rbSetSoftCcdPrediction(this.handle, t);
    }
    softCcdPrediction() {
      return this.rawSet.rbSoftCcdPrediction(this.handle);
    }
    translation() {
      let t = this.rawSet.rbTranslation(this.handle);
      return w.fromRaw(t);
    }
    rotation() {
      let t = this.rawSet.rbRotation(this.handle);
      return E.fromRaw(t);
    }
    nextTranslation() {
      let t = this.rawSet.rbNextTranslation(this.handle);
      return w.fromRaw(t);
    }
    nextRotation() {
      let t = this.rawSet.rbNextRotation(this.handle);
      return E.fromRaw(t);
    }
    setTranslation(t, e) {
      this.rawSet.rbSetTranslation(this.handle, t.x, t.y, e);
    }
    setLinvel(t, e) {
      let r = w.intoRaw(t);
      this.rawSet.rbSetLinvel(this.handle, r, e), r.free();
    }
    gravityScale() {
      return this.rawSet.rbGravityScale(this.handle);
    }
    setGravityScale(t, e) {
      this.rawSet.rbSetGravityScale(this.handle, t, e);
    }
    setRotation(t, e) {
      this.rawSet.rbSetRotation(this.handle, t, e);
    }
    setAngvel(t, e) {
      this.rawSet.rbSetAngvel(this.handle, t, e);
    }
    setNextKinematicTranslation(t) {
      this.rawSet.rbSetNextKinematicTranslation(this.handle, t.x, t.y);
    }
    setNextKinematicRotation(t) {
      this.rawSet.rbSetNextKinematicRotation(this.handle, t);
    }
    linvel() {
      return w.fromRaw(this.rawSet.rbLinvel(this.handle));
    }
    angvel() {
      return this.rawSet.rbAngvel(this.handle);
    }
    mass() {
      return this.rawSet.rbMass(this.handle);
    }
    effectiveInvMass() {
      return w.fromRaw(this.rawSet.rbEffectiveInvMass(this.handle));
    }
    invMass() {
      return this.rawSet.rbInvMass(this.handle);
    }
    localCom() {
      return w.fromRaw(this.rawSet.rbLocalCom(this.handle));
    }
    worldCom() {
      return w.fromRaw(this.rawSet.rbWorldCom(this.handle));
    }
    invPrincipalInertiaSqrt() {
      return this.rawSet.rbInvPrincipalInertiaSqrt(this.handle);
    }
    principalInertia() {
      return this.rawSet.rbPrincipalInertia(this.handle);
    }
    effectiveWorldInvInertiaSqrt() {
      return this.rawSet.rbEffectiveWorldInvInertiaSqrt(this.handle);
    }
    effectiveAngularInertia() {
      return this.rawSet.rbEffectiveAngularInertia(this.handle);
    }
    sleep() {
      this.rawSet.rbSleep(this.handle);
    }
    wakeUp() {
      this.rawSet.rbWakeUp(this.handle);
    }
    isCcdEnabled() {
      return this.rawSet.rbIsCcdEnabled(this.handle);
    }
    numColliders() {
      return this.rawSet.rbNumColliders(this.handle);
    }
    collider(t) {
      return this.colliderSet.get(this.rawSet.rbCollider(this.handle, t));
    }
    setEnabled(t) {
      this.rawSet.rbSetEnabled(this.handle, t);
    }
    isEnabled() {
      return this.rawSet.rbIsEnabled(this.handle);
    }
    bodyType() {
      return this.rawSet.rbBodyType(this.handle);
    }
    setBodyType(t, e) {
      return this.rawSet.rbSetBodyType(this.handle, t, e);
    }
    isSleeping() {
      return this.rawSet.rbIsSleeping(this.handle);
    }
    isMoving() {
      return this.rawSet.rbIsMoving(this.handle);
    }
    isFixed() {
      return this.rawSet.rbIsFixed(this.handle);
    }
    isKinematic() {
      return this.rawSet.rbIsKinematic(this.handle);
    }
    isDynamic() {
      return this.rawSet.rbIsDynamic(this.handle);
    }
    linearDamping() {
      return this.rawSet.rbLinearDamping(this.handle);
    }
    angularDamping() {
      return this.rawSet.rbAngularDamping(this.handle);
    }
    setLinearDamping(t) {
      this.rawSet.rbSetLinearDamping(this.handle, t);
    }
    recomputeMassPropertiesFromColliders() {
      this.rawSet.rbRecomputeMassPropertiesFromColliders(this.handle, this.colliderSet.raw);
    }
    setAdditionalMass(t, e) {
      this.rawSet.rbSetAdditionalMass(this.handle, t, e);
    }
    setAdditionalMassProperties(t, e, r, n) {
      let s = w.intoRaw(e);
      this.rawSet.rbSetAdditionalMassProperties(this.handle, t, s, r, n), s.free();
    }
    setAngularDamping(t) {
      this.rawSet.rbSetAngularDamping(this.handle, t);
    }
    resetForces(t) {
      this.rawSet.rbResetForces(this.handle, t);
    }
    resetTorques(t) {
      this.rawSet.rbResetTorques(this.handle, t);
    }
    addForce(t, e) {
      const r = w.intoRaw(t);
      this.rawSet.rbAddForce(this.handle, r, e), r.free();
    }
    applyImpulse(t, e) {
      const r = w.intoRaw(t);
      this.rawSet.rbApplyImpulse(this.handle, r, e), r.free();
    }
    addTorque(t, e) {
      this.rawSet.rbAddTorque(this.handle, t, e);
    }
    applyTorqueImpulse(t, e) {
      this.rawSet.rbApplyTorqueImpulse(this.handle, t, e);
    }
    addForceAtPoint(t, e, r) {
      const n = w.intoRaw(t), s = w.intoRaw(e);
      this.rawSet.rbAddForceAtPoint(this.handle, n, s, r), n.free(), s.free();
    }
    applyImpulseAtPoint(t, e, r) {
      const n = w.intoRaw(t), s = w.intoRaw(e);
      this.rawSet.rbApplyImpulseAtPoint(this.handle, n, s, r), n.free(), s.free();
    }
  }
  class U {
    constructor(t) {
      this.enabled = true, this.status = t, this.translation = w.zeros(), this.rotation = E.identity(), this.gravityScale = 1, this.linvel = w.zeros(), this.mass = 0, this.massOnly = false, this.centerOfMass = w.zeros(), this.translationsEnabledX = true, this.translationsEnabledY = true, this.angvel = 0, this.principalAngularInertia = 0, this.rotationsEnabled = true, this.linearDamping = 0, this.angularDamping = 0, this.canSleep = true, this.sleeping = false, this.ccdEnabled = false, this.softCcdPrediction = 0, this.dominanceGroup = 0, this.additionalSolverIterations = 0;
    }
    static dynamic() {
      return new U(q.Dynamic);
    }
    static kinematicPositionBased() {
      return new U(q.KinematicPositionBased);
    }
    static kinematicVelocityBased() {
      return new U(q.KinematicVelocityBased);
    }
    static fixed() {
      return new U(q.Fixed);
    }
    static newDynamic() {
      return new U(q.Dynamic);
    }
    static newKinematicPositionBased() {
      return new U(q.KinematicPositionBased);
    }
    static newKinematicVelocityBased() {
      return new U(q.KinematicVelocityBased);
    }
    static newStatic() {
      return new U(q.Fixed);
    }
    setDominanceGroup(t) {
      return this.dominanceGroup = t, this;
    }
    setAdditionalSolverIterations(t) {
      return this.additionalSolverIterations = t, this;
    }
    setEnabled(t) {
      return this.enabled = t, this;
    }
    setTranslation(t, e) {
      if (typeof t != "number" || typeof e != "number") throw TypeError("The translation components must be numbers.");
      return this.translation = { x: t, y: e }, this;
    }
    setRotation(t) {
      return this.rotation = t, this;
    }
    setGravityScale(t) {
      return this.gravityScale = t, this;
    }
    setAdditionalMass(t) {
      return this.mass = t, this.massOnly = true, this;
    }
    setLinvel(t, e) {
      if (typeof t != "number" || typeof e != "number") throw TypeError("The linvel components must be numbers.");
      return this.linvel = { x: t, y: e }, this;
    }
    setAngvel(t) {
      return this.angvel = t, this;
    }
    setAdditionalMassProperties(t, e, r) {
      return this.mass = t, w.copy(this.centerOfMass, e), this.principalAngularInertia = r, this.massOnly = false, this;
    }
    enabledTranslations(t, e) {
      return this.translationsEnabledX = t, this.translationsEnabledY = e, this;
    }
    restrictTranslations(t, e) {
      return this.enabledTranslations(t, e);
    }
    lockTranslations() {
      return this.restrictTranslations(false, false);
    }
    lockRotations() {
      return this.rotationsEnabled = false, this;
    }
    setLinearDamping(t) {
      return this.linearDamping = t, this;
    }
    setAngularDamping(t) {
      return this.angularDamping = t, this;
    }
    setCanSleep(t) {
      return this.canSleep = t, this;
    }
    setSleeping(t) {
      return this.sleeping = t, this;
    }
    setCcdEnabled(t) {
      return this.ccdEnabled = t, this;
    }
    setSoftCcdPrediction(t) {
      return this.softCcdPrediction = t, this;
    }
    setUserData(t) {
      return this.userData = t, this;
    }
  }
  class Mt {
    constructor() {
      this.fconv = new Float64Array(1), this.uconv = new Uint32Array(this.fconv.buffer), this.data = new Array(), this.size = 0;
    }
    set(t, e) {
      let r = this.index(t);
      for (; this.data.length <= r; ) this.data.push(null);
      this.data[r] == null && (this.size += 1), this.data[r] = e;
    }
    len() {
      return this.size;
    }
    delete(t) {
      let e = this.index(t);
      e < this.data.length && (this.data[e] != null && (this.size -= 1), this.data[e] = null);
    }
    clear() {
      this.data = new Array();
    }
    get(t) {
      let e = this.index(t);
      return e < this.data.length ? this.data[e] : null;
    }
    forEach(t) {
      for (const e of this.data) e != null && t(e);
    }
    getAll() {
      return this.data.filter((t) => t != null);
    }
    index(t) {
      return this.fconv[0] = t, this.uconv[0];
    }
  }
  class He {
    constructor(t) {
      this.raw = t || new T(), this.map = new Mt(), t && t.forEachRigidBodyHandle((e) => {
        this.map.set(e, new Qt(t, null, e));
      });
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
    }
    finalizeDeserialization(t) {
      this.map.forEach((e) => e.finalizeDeserialization(t));
    }
    createRigidBody(t, e) {
      let r = w.intoRaw(e.translation), n = E.intoRaw(e.rotation), s = w.intoRaw(e.linvel), o = w.intoRaw(e.centerOfMass), l = this.raw.createRigidBody(e.enabled, r, n, e.gravityScale, e.mass, e.massOnly, o, s, e.angvel, e.principalAngularInertia, e.translationsEnabledX, e.translationsEnabledY, e.rotationsEnabled, e.linearDamping, e.angularDamping, e.status, e.canSleep, e.sleeping, e.softCcdPrediction, e.ccdEnabled, e.dominanceGroup, e.additionalSolverIterations);
      r.free(), n.free(), s.free(), o.free();
      const h = new Qt(this.raw, t, l);
      return h.userData = e.userData, this.map.set(l, h), h;
    }
    remove(t, e, r, n, s) {
      for (let o = 0; o < this.raw.rbNumColliders(t); o += 1) r.unmap(this.raw.rbCollider(t, o));
      n.forEachJointHandleAttachedToRigidBody(t, (o) => n.unmap(o)), s.forEachJointHandleAttachedToRigidBody(t, (o) => s.unmap(o)), this.raw.remove(t, e.raw, r.raw, n.raw, s.raw), this.map.delete(t);
    }
    len() {
      return this.map.len();
    }
    contains(t) {
      return this.get(t) != null;
    }
    get(t) {
      return this.map.get(t);
    }
    forEach(t) {
      this.map.forEach(t);
    }
    forEachActiveRigidBody(t, e) {
      t.forEachActiveRigidBodyHandle((r) => {
        e(this.get(r));
      });
    }
    getAll() {
      return this.map.getAll();
    }
  }
  class Fe {
    constructor(t) {
      this.raw = t || new it();
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    get dt() {
      return this.raw.dt;
    }
    get erp() {
      return this.raw.erp;
    }
    get lengthUnit() {
      return this.raw.lengthUnit;
    }
    get normalizedAllowedLinearError() {
      return this.raw.normalizedAllowedLinearError;
    }
    get normalizedPredictionDistance() {
      return this.raw.normalizedPredictionDistance;
    }
    get numSolverIterations() {
      return this.raw.numSolverIterations;
    }
    get numAdditionalFrictionIterations() {
      return this.raw.numAdditionalFrictionIterations;
    }
    get numInternalPgsIterations() {
      return this.raw.numInternalPgsIterations;
    }
    get minIslandSize() {
      return this.raw.minIslandSize;
    }
    get maxCcdSubsteps() {
      return this.raw.maxCcdSubsteps;
    }
    set dt(t) {
      this.raw.dt = t;
    }
    set erp(t) {
      this.raw.erp = t;
    }
    set lengthUnit(t) {
      this.raw.lengthUnit = t;
    }
    set normalizedAllowedLinearError(t) {
      this.raw.normalizedAllowedLinearError = t;
    }
    set normalizedPredictionDistance(t) {
      this.raw.normalizedPredictionDistance = t;
    }
    set numSolverIterations(t) {
      this.raw.numSolverIterations = t;
    }
    set numAdditionalFrictionIterations(t) {
      this.raw.numAdditionalFrictionIterations = t;
    }
    set numInternalPgsIterations(t) {
      this.raw.numInternalPgsIterations = t;
    }
    set minIslandSize(t) {
      this.raw.minIslandSize = t;
    }
    set maxCcdSubsteps(t) {
      this.raw.maxCcdSubsteps = t;
    }
    switchToStandardPgsSolver() {
      this.raw.switchToStandardPgsSolver();
    }
    switchToSmallStepsPgsSolver() {
      this.raw.switchToSmallStepsPgsSolver();
    }
    switchToSmallStepsPgsSolverWithoutWarmstart() {
      this.raw.switchToSmallStepsPgsSolverWithoutWarmstart();
    }
  }
  var te;
  (function(a) {
    a[a.Revolute = 0] = "Revolute", a[a.Fixed = 1] = "Fixed", a[a.Prismatic = 2] = "Prismatic", a[a.Rope = 3] = "Rope", a[a.Spring = 4] = "Spring";
  })(te || (te = {}));
  var ee;
  (function(a) {
    a[a.AccelerationBased = 0] = "AccelerationBased", a[a.ForceBased = 1] = "ForceBased";
  })(ee || (ee = {}));
  var re;
  (function(a) {
    a[a.X = 1] = "X", a[a.Y = 2] = "Y", a[a.Z = 4] = "Z", a[a.AngX = 8] = "AngX", a[a.AngY = 16] = "AngY", a[a.AngZ = 32] = "AngZ";
  })(re || (re = {}));
  class tt {
    constructor(t, e, r) {
      this.rawSet = t, this.bodySet = e, this.handle = r;
    }
    static newTyped(t, e, r) {
      switch (t.jointType(r)) {
        case $.Revolute:
          return new Be(t, e, r);
        case $.Prismatic:
          return new We(t, e, r);
        case $.Fixed:
          return new Ge(t, e, r);
        case $.Spring:
          return new Oe(t, e, r);
        case $.Rope:
          return new ze(t, e, r);
        default:
          return new tt(t, e, r);
      }
    }
    finalizeDeserialization(t) {
      this.bodySet = t;
    }
    isValid() {
      return this.rawSet.contains(this.handle);
    }
    body1() {
      return this.bodySet.get(this.rawSet.jointBodyHandle1(this.handle));
    }
    body2() {
      return this.bodySet.get(this.rawSet.jointBodyHandle2(this.handle));
    }
    type() {
      return this.rawSet.jointType(this.handle);
    }
    anchor1() {
      return w.fromRaw(this.rawSet.jointAnchor1(this.handle));
    }
    anchor2() {
      return w.fromRaw(this.rawSet.jointAnchor2(this.handle));
    }
    setAnchor1(t) {
      const e = w.intoRaw(t);
      this.rawSet.jointSetAnchor1(this.handle, e), e.free();
    }
    setAnchor2(t) {
      const e = w.intoRaw(t);
      this.rawSet.jointSetAnchor2(this.handle, e), e.free();
    }
    setContactsEnabled(t) {
      this.rawSet.jointSetContactsEnabled(this.handle, t);
    }
    contactsEnabled() {
      return this.rawSet.jointContactsEnabled(this.handle);
    }
  }
  class we extends tt {
    limitsEnabled() {
      return this.rawSet.jointLimitsEnabled(this.handle, this.rawAxis());
    }
    limitsMin() {
      return this.rawSet.jointLimitsMin(this.handle, this.rawAxis());
    }
    limitsMax() {
      return this.rawSet.jointLimitsMax(this.handle, this.rawAxis());
    }
    setLimits(t, e) {
      this.rawSet.jointSetLimits(this.handle, this.rawAxis(), t, e);
    }
    configureMotorModel(t) {
      this.rawSet.jointConfigureMotorModel(this.handle, this.rawAxis(), t);
    }
    configureMotorVelocity(t, e) {
      this.rawSet.jointConfigureMotorVelocity(this.handle, this.rawAxis(), t, e);
    }
    configureMotorPosition(t, e, r) {
      this.rawSet.jointConfigureMotorPosition(this.handle, this.rawAxis(), t, e, r);
    }
    configureMotor(t, e, r, n) {
      this.rawSet.jointConfigureMotor(this.handle, this.rawAxis(), t, e, r, n);
    }
  }
  class Ge extends tt {
  }
  class ze extends tt {
  }
  class Oe extends tt {
  }
  class We extends we {
    rawAxis() {
      return It.X;
    }
  }
  class Be extends we {
    rawAxis() {
      return It.AngX;
    }
  }
  class qe {
    constructor(t) {
      this.raw = t || new V(), this.map = new Mt(), t && t.forEachJointHandle((e) => {
        this.map.set(e, tt.newTyped(t, null, e));
      });
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
    }
    finalizeDeserialization(t) {
      this.map.forEach((e) => e.finalizeDeserialization(t));
    }
    createJoint(t, e, r, n, s) {
      const o = e.intoRaw(), l = this.raw.createJoint(o, r, n, s);
      o.free();
      let h = tt.newTyped(this.raw, t, l);
      return this.map.set(l, h), h;
    }
    remove(t, e) {
      this.raw.remove(t, e), this.unmap(t);
    }
    forEachJointHandleAttachedToRigidBody(t, e) {
      this.raw.forEachJointAttachedToRigidBody(t, e);
    }
    unmap(t) {
      this.map.delete(t);
    }
    len() {
      return this.map.len();
    }
    contains(t) {
      return this.get(t) != null;
    }
    get(t) {
      return this.map.get(t);
    }
    forEach(t) {
      this.map.forEach(t);
    }
    getAll() {
      return this.map.getAll();
    }
  }
  class at {
    constructor(t, e) {
      this.rawSet = t, this.handle = e;
    }
    static newTyped(t, e) {
      switch (t.jointType(e)) {
        case $.Revolute:
          return new Je(t, e);
        case $.Prismatic:
          return new Xe(t, e);
        case $.Fixed:
          return new Ue(t, e);
        default:
          return new at(t, e);
      }
    }
    isValid() {
      return this.rawSet.contains(this.handle);
    }
    setContactsEnabled(t) {
      this.rawSet.jointSetContactsEnabled(this.handle, t);
    }
    contactsEnabled() {
      return this.rawSet.jointContactsEnabled(this.handle);
    }
  }
  class he extends at {
  }
  class Ue extends at {
  }
  class Xe extends he {
    rawAxis() {
      return It.X;
    }
  }
  class Je extends he {
    rawAxis() {
      return It.AngX;
    }
  }
  class Ve {
    constructor(t) {
      this.raw = t || new Y(), this.map = new Mt(), t && t.forEachJointHandle((e) => {
        this.map.set(e, at.newTyped(this.raw, e));
      });
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
    }
    createJoint(t, e, r, n) {
      const s = t.intoRaw(), o = this.raw.createJoint(s, e, r, n);
      s.free();
      let l = at.newTyped(this.raw, o);
      return this.map.set(o, l), l;
    }
    remove(t, e) {
      this.raw.remove(t, e), this.map.delete(t);
    }
    unmap(t) {
      this.map.delete(t);
    }
    len() {
      return this.map.len();
    }
    contains(t) {
      return this.get(t) != null;
    }
    get(t) {
      return this.map.get(t);
    }
    forEach(t) {
      this.map.forEach(t);
    }
    forEachJointHandleAttachedToRigidBody(t, e) {
      this.raw.forEachJointAttachedToRigidBody(t, e);
    }
    getAll() {
      return this.map.getAll();
    }
  }
  var vt;
  (function(a) {
    a[a.Average = 0] = "Average", a[a.Min = 1] = "Min", a[a.Multiply = 2] = "Multiply", a[a.Max = 3] = "Max";
  })(vt || (vt = {}));
  class Ke {
    constructor(t) {
      this.raw = t || new Gt();
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
  }
  class Ye {
    constructor(t) {
      this.raw = t || new K();
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    forEachActiveRigidBodyHandle(t) {
      this.raw.forEachActiveRigidBodyHandle(t);
    }
  }
  class $e {
    constructor(t) {
      this.raw = t || new rt();
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
  }
  class Ze {
    constructor(t) {
      this.raw = t || new Q(), this.tempManifold = new Qe(null);
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    contactPairsWith(t, e) {
      this.raw.contact_pairs_with(t, e);
    }
    intersectionPairsWith(t, e) {
      this.raw.intersection_pairs_with(t, e);
    }
    contactPair(t, e, r) {
      const n = this.raw.contact_pair(t, e);
      if (n) {
        const s = n.collider1() != t;
        let o;
        for (o = 0; o < n.numContactManifolds(); ++o) this.tempManifold.raw = n.contactManifold(o), this.tempManifold.raw && r(this.tempManifold, s), this.tempManifold.free();
        n.free();
      }
    }
    intersectionPair(t, e) {
      return this.raw.intersection_pair(t, e);
    }
  }
  class Qe {
    constructor(t) {
      this.raw = t;
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    normal() {
      return w.fromRaw(this.raw.normal());
    }
    localNormal1() {
      return w.fromRaw(this.raw.local_n1());
    }
    localNormal2() {
      return w.fromRaw(this.raw.local_n2());
    }
    subshape1() {
      return this.raw.subshape1();
    }
    subshape2() {
      return this.raw.subshape2();
    }
    numContacts() {
      return this.raw.num_contacts();
    }
    localContactPoint1(t) {
      return w.fromRaw(this.raw.contact_local_p1(t));
    }
    localContactPoint2(t) {
      return w.fromRaw(this.raw.contact_local_p2(t));
    }
    contactDist(t) {
      return this.raw.contact_dist(t);
    }
    contactFid1(t) {
      return this.raw.contact_fid1(t);
    }
    contactFid2(t) {
      return this.raw.contact_fid2(t);
    }
    contactImpulse(t) {
      return this.raw.contact_impulse(t);
    }
    contactTangentImpulse(t) {
      return this.raw.contact_tangent_impulse(t);
    }
    numSolverContacts() {
      return this.raw.num_solver_contacts();
    }
    solverContactPoint(t) {
      return w.fromRaw(this.raw.solver_contact_point(t));
    }
    solverContactDist(t) {
      return this.raw.solver_contact_dist(t);
    }
    solverContactFriction(t) {
      return this.raw.solver_contact_friction(t);
    }
    solverContactRestitution(t) {
      return this.raw.solver_contact_restitution(t);
    }
    solverContactTangentVelocity(t) {
      return w.fromRaw(this.raw.solver_contact_tangent_velocity(t));
    }
  }
  class dt {
    constructor(t, e, r, n, s) {
      this.distance = t, this.point1 = e, this.point2 = r, this.normal1 = n, this.normal2 = s;
    }
    static fromRaw(t) {
      if (!t) return null;
      const e = new dt(t.distance(), w.fromRaw(t.point1()), w.fromRaw(t.point2()), w.fromRaw(t.normal1()), w.fromRaw(t.normal2()));
      return t.free(), e;
    }
  }
  var pt;
  (function(a) {
    a[a.Vertex = 0] = "Vertex", a[a.Face = 1] = "Face", a[a.Unknown = 2] = "Unknown";
  })(pt || (pt = {}));
  class Dt {
    constructor(t, e) {
      this.point = t, this.isInside = e;
    }
    static fromRaw(t) {
      if (!t) return null;
      const e = new Dt(w.fromRaw(t.point()), t.isInside());
      return t.free(), e;
    }
  }
  class Ct {
    constructor(t, e, r, n, s) {
      this.featureType = pt.Unknown, this.featureId = void 0, this.collider = t, this.point = e, this.isInside = r, s !== void 0 && (this.featureId = s), n !== void 0 && (this.featureType = n);
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new Ct(t.get(e.colliderHandle()), w.fromRaw(e.point()), e.isInside(), e.featureType(), e.featureId());
      return e.free(), r;
    }
  }
  class xt {
    constructor(t, e, r, n) {
      this.featureType = pt.Unknown, this.featureId = void 0, this.timeOfImpact = t, this.normal = e, n !== void 0 && (this.featureId = n), r !== void 0 && (this.featureType = r);
    }
    static fromRaw(t) {
      if (!t) return null;
      const e = new xt(t.time_of_impact(), w.fromRaw(t.normal()), t.featureType(), t.featureId());
      return t.free(), e;
    }
  }
  class Et {
    constructor(t, e, r, n, s) {
      this.featureType = pt.Unknown, this.featureId = void 0, this.collider = t, this.timeOfImpact = e, this.normal = r, s !== void 0 && (this.featureId = s), n !== void 0 && (this.featureType = n);
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new Et(t.get(e.colliderHandle()), e.time_of_impact(), w.fromRaw(e.normal()), e.featureType(), e.featureId());
      return e.free(), r;
    }
  }
  class Yt {
    constructor(t, e) {
      this.collider = t, this.timeOfImpact = e;
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new Yt(t.get(e.colliderHandle()), e.timeOfImpact());
      return e.free(), r;
    }
  }
  class ut {
    constructor(t, e, r, n, s) {
      this.time_of_impact = t, this.witness1 = e, this.witness2 = r, this.normal1 = n, this.normal2 = s;
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new ut(e.time_of_impact(), w.fromRaw(e.witness1()), w.fromRaw(e.witness2()), w.fromRaw(e.normal1()), w.fromRaw(e.normal2()));
      return e.free(), r;
    }
  }
  class Nt extends ut {
    constructor(t, e, r, n, s, o) {
      super(e, r, n, s, o), this.collider = t;
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new Nt(t.get(e.colliderHandle()), e.time_of_impact(), w.fromRaw(e.witness1()), w.fromRaw(e.witness2()), w.fromRaw(e.normal1()), w.fromRaw(e.normal2()));
      return e.free(), r;
    }
  }
  class N {
    static fromRaw(t, e) {
      const r = t.coShapeType(e);
      let n, s, o, l, h, d, p;
      switch (r) {
        case L.Ball:
          return new de(t.coRadius(e));
        case L.Cuboid:
          return n = t.coHalfExtents(e), new ue(n.x, n.y);
        case L.RoundCuboid:
          return n = t.coHalfExtents(e), s = t.coRoundRadius(e), new be(n.x, n.y, s);
        case L.Capsule:
          return h = t.coHalfHeight(e), d = t.coRadius(e), new ge(h, d);
        case L.Segment:
          return o = t.coVertices(e), new fe(w.new(o[0], o[1]), w.new(o[2], o[3]));
        case L.Polyline:
          return o = t.coVertices(e), l = t.coIndices(e), new Se(o, l);
        case L.Triangle:
          return o = t.coVertices(e), new me(w.new(o[0], o[1]), w.new(o[2], o[3]), w.new(o[4], o[5]));
        case L.RoundTriangle:
          return o = t.coVertices(e), s = t.coRoundRadius(e), new ye(w.new(o[0], o[1]), w.new(o[2], o[3]), w.new(o[4], o[5]), s);
        case L.HalfSpace:
          return p = w.fromRaw(t.coHalfspaceNormal(e)), new pe(p);
        case L.TriMesh:
          o = t.coVertices(e), l = t.coIndices(e);
          const u = t.coTriMeshFlags(e);
          return new Re(o, l, u);
        case L.HeightField:
          const b = t.coHeightfieldScale(e), f = t.coHeightfieldHeights(e);
          return new ve(f, b);
        case L.ConvexPolygon:
          return o = t.coVertices(e), new zt(o, false);
        case L.RoundConvexPolygon:
          return o = t.coVertices(e), s = t.coRoundRadius(e), new Ot(o, s, false);
        default:
          throw new Error("unknown shape type: " + r);
      }
    }
    castShape(t, e, r, n, s, o, l, h, d, p) {
      let u = w.intoRaw(t), b = E.intoRaw(e), f = w.intoRaw(r), y = w.intoRaw(s), v = E.intoRaw(o), G = w.intoRaw(l), z = this.intoRaw(), O = n.intoRaw(), X = ut.fromRaw(null, z.castShape(u, b, f, O, y, v, G, h, d, p));
      return u.free(), b.free(), f.free(), y.free(), v.free(), G.free(), z.free(), O.free(), X;
    }
    intersectsShape(t, e, r, n, s) {
      let o = w.intoRaw(t), l = E.intoRaw(e), h = w.intoRaw(n), d = E.intoRaw(s), p = this.intoRaw(), u = r.intoRaw(), b = p.intersectsShape(o, l, u, h, d);
      return o.free(), l.free(), h.free(), d.free(), p.free(), u.free(), b;
    }
    contactShape(t, e, r, n, s, o) {
      let l = w.intoRaw(t), h = E.intoRaw(e), d = w.intoRaw(n), p = E.intoRaw(s), u = this.intoRaw(), b = r.intoRaw(), f = dt.fromRaw(u.contactShape(l, h, b, d, p, o));
      return l.free(), h.free(), d.free(), p.free(), u.free(), b.free(), f;
    }
    containsPoint(t, e, r) {
      let n = w.intoRaw(t), s = E.intoRaw(e), o = w.intoRaw(r), l = this.intoRaw(), h = l.containsPoint(n, s, o);
      return n.free(), s.free(), o.free(), l.free(), h;
    }
    projectPoint(t, e, r, n) {
      let s = w.intoRaw(t), o = E.intoRaw(e), l = w.intoRaw(r), h = this.intoRaw(), d = Dt.fromRaw(h.projectPoint(s, o, l, n));
      return s.free(), o.free(), l.free(), h.free(), d;
    }
    intersectsRay(t, e, r, n) {
      let s = w.intoRaw(e), o = E.intoRaw(r), l = w.intoRaw(t.origin), h = w.intoRaw(t.dir), d = this.intoRaw(), p = d.intersectsRay(s, o, l, h, n);
      return s.free(), o.free(), l.free(), h.free(), d.free(), p;
    }
    castRay(t, e, r, n, s) {
      let o = w.intoRaw(e), l = E.intoRaw(r), h = w.intoRaw(t.origin), d = w.intoRaw(t.dir), p = this.intoRaw(), u = p.castRay(o, l, h, d, n, s);
      return o.free(), l.free(), h.free(), d.free(), p.free(), u;
    }
    castRayAndGetNormal(t, e, r, n, s) {
      let o = w.intoRaw(e), l = E.intoRaw(r), h = w.intoRaw(t.origin), d = w.intoRaw(t.dir), p = this.intoRaw(), u = xt.fromRaw(p.castRayAndGetNormal(o, l, h, d, n, s));
      return o.free(), l.free(), h.free(), d.free(), p.free(), u;
    }
  }
  var x;
  (function(a) {
    a[a.Ball = 0] = "Ball", a[a.Cuboid = 1] = "Cuboid", a[a.Capsule = 2] = "Capsule", a[a.Segment = 3] = "Segment", a[a.Polyline = 4] = "Polyline", a[a.Triangle = 5] = "Triangle", a[a.TriMesh = 6] = "TriMesh", a[a.HeightField = 7] = "HeightField", a[a.ConvexPolygon = 9] = "ConvexPolygon", a[a.RoundCuboid = 10] = "RoundCuboid", a[a.RoundTriangle = 11] = "RoundTriangle", a[a.RoundConvexPolygon = 12] = "RoundConvexPolygon", a[a.HalfSpace = 13] = "HalfSpace";
  })(x || (x = {}));
  var ie;
  (function(a) {
    a[a.DELETE_BAD_TOPOLOGY_TRIANGLES = 4] = "DELETE_BAD_TOPOLOGY_TRIANGLES", a[a.ORIENTED = 8] = "ORIENTED", a[a.MERGE_DUPLICATE_VERTICES = 16] = "MERGE_DUPLICATE_VERTICES", a[a.DELETE_DEGENERATE_TRIANGLES = 32] = "DELETE_DEGENERATE_TRIANGLES", a[a.DELETE_DUPLICATE_TRIANGLES = 64] = "DELETE_DUPLICATE_TRIANGLES", a[a.FIX_INTERNAL_EDGES = 152] = "FIX_INTERNAL_EDGES";
  })(ie || (ie = {}));
  class de extends N {
    constructor(t) {
      super(), this.type = x.Ball, this.radius = t;
    }
    intoRaw() {
      return m.ball(this.radius);
    }
  }
  class pe extends N {
    constructor(t) {
      super(), this.type = x.HalfSpace, this.normal = t;
    }
    intoRaw() {
      let t = w.intoRaw(this.normal), e = m.halfspace(t);
      return t.free(), e;
    }
  }
  class ue extends N {
    constructor(t, e) {
      super(), this.type = x.Cuboid, this.halfExtents = w.new(t, e);
    }
    intoRaw() {
      return m.cuboid(this.halfExtents.x, this.halfExtents.y);
    }
  }
  class be extends N {
    constructor(t, e, r) {
      super(), this.type = x.RoundCuboid, this.halfExtents = w.new(t, e), this.borderRadius = r;
    }
    intoRaw() {
      return m.roundCuboid(this.halfExtents.x, this.halfExtents.y, this.borderRadius);
    }
  }
  class ge extends N {
    constructor(t, e) {
      super(), this.type = x.Capsule, this.halfHeight = t, this.radius = e;
    }
    intoRaw() {
      return m.capsule(this.halfHeight, this.radius);
    }
  }
  class fe extends N {
    constructor(t, e) {
      super(), this.type = x.Segment, this.a = t, this.b = e;
    }
    intoRaw() {
      let t = w.intoRaw(this.a), e = w.intoRaw(this.b), r = m.segment(t, e);
      return t.free(), e.free(), r;
    }
  }
  class me extends N {
    constructor(t, e, r) {
      super(), this.type = x.Triangle, this.a = t, this.b = e, this.c = r;
    }
    intoRaw() {
      let t = w.intoRaw(this.a), e = w.intoRaw(this.b), r = w.intoRaw(this.c), n = m.triangle(t, e, r);
      return t.free(), e.free(), r.free(), n;
    }
  }
  class ye extends N {
    constructor(t, e, r, n) {
      super(), this.type = x.RoundTriangle, this.a = t, this.b = e, this.c = r, this.borderRadius = n;
    }
    intoRaw() {
      let t = w.intoRaw(this.a), e = w.intoRaw(this.b), r = w.intoRaw(this.c), n = m.roundTriangle(t, e, r, this.borderRadius);
      return t.free(), e.free(), r.free(), n;
    }
  }
  class Se extends N {
    constructor(t, e) {
      super(), this.type = x.Polyline, this.vertices = t, this.indices = e ?? new Uint32Array(0);
    }
    intoRaw() {
      return m.polyline(this.vertices, this.indices);
    }
  }
  class Re extends N {
    constructor(t, e, r) {
      super(), this.type = x.TriMesh, this.vertices = t, this.indices = e, this.flags = r;
    }
    intoRaw() {
      return m.trimesh(this.vertices, this.indices, this.flags);
    }
  }
  class zt extends N {
    constructor(t, e) {
      super(), this.type = x.ConvexPolygon, this.vertices = t, this.skipConvexHullComputation = !!e;
    }
    intoRaw() {
      return this.skipConvexHullComputation ? m.convexPolyline(this.vertices) : m.convexHull(this.vertices);
    }
  }
  class Ot extends N {
    constructor(t, e, r) {
      super(), this.type = x.RoundConvexPolygon, this.vertices = t, this.borderRadius = e, this.skipConvexHullComputation = !!r;
    }
    intoRaw() {
      return this.skipConvexHullComputation ? m.roundConvexPolyline(this.vertices, this.borderRadius) : m.roundConvexHull(this.vertices, this.borderRadius);
    }
  }
  class ve extends N {
    constructor(t, e) {
      super(), this.type = x.HeightField, this.heights = t, this.scale = e;
    }
    intoRaw() {
      let t = w.intoRaw(this.scale), e = m.heightfield(this.heights, t);
      return t.free(), e;
    }
  }
  class tr {
    constructor(t) {
      this.raw = t || new Ne();
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    step(t, e, r, n, s, o, l, h, d, p, u, b) {
      let f = w.intoRaw(t);
      u ? this.raw.stepWithEvents(f, e.raw, r.raw, n.raw, s.raw, o.raw, l.raw, h.raw, d.raw, p.raw, u.raw, b, b ? b.filterContactPair : null, b ? b.filterIntersectionPair : null) : this.raw.step(f, e.raw, r.raw, n.raw, s.raw, o.raw, l.raw, h.raw, d.raw, p.raw), f.free();
    }
  }
  var ne;
  (function(a) {
    a[a.EXCLUDE_FIXED = 1] = "EXCLUDE_FIXED", a[a.EXCLUDE_KINEMATIC = 2] = "EXCLUDE_KINEMATIC", a[a.EXCLUDE_DYNAMIC = 4] = "EXCLUDE_DYNAMIC", a[a.EXCLUDE_SENSORS = 8] = "EXCLUDE_SENSORS", a[a.EXCLUDE_SOLIDS = 16] = "EXCLUDE_SOLIDS", a[a.ONLY_DYNAMIC = 3] = "ONLY_DYNAMIC", a[a.ONLY_KINEMATIC = 5] = "ONLY_KINEMATIC", a[a.ONLY_FIXED = 6] = "ONLY_FIXED";
  })(ne || (ne = {}));
  class er {
    constructor(t) {
      this.raw = t || new ce();
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    update(t, e) {
      this.raw.update(t.raw, e.raw);
    }
    castRay(t, e, r, n, s, o, l, h, d, p) {
      let u = w.intoRaw(r.origin), b = w.intoRaw(r.dir), f = Yt.fromRaw(e, this.raw.castRay(t.raw, e.raw, u, b, n, s, o, l, h, d, p));
      return u.free(), b.free(), f;
    }
    castRayAndGetNormal(t, e, r, n, s, o, l, h, d, p) {
      let u = w.intoRaw(r.origin), b = w.intoRaw(r.dir), f = Et.fromRaw(e, this.raw.castRayAndGetNormal(t.raw, e.raw, u, b, n, s, o, l, h, d, p));
      return u.free(), b.free(), f;
    }
    intersectionsWithRay(t, e, r, n, s, o, l, h, d, p, u) {
      let b = w.intoRaw(r.origin), f = w.intoRaw(r.dir), y = (v) => o(Et.fromRaw(e, v));
      this.raw.intersectionsWithRay(t.raw, e.raw, b, f, n, s, y, l, h, d, p, u), b.free(), f.free();
    }
    intersectionWithShape(t, e, r, n, s, o, l, h, d, p) {
      let u = w.intoRaw(r), b = E.intoRaw(n), f = s.intoRaw(), y = this.raw.intersectionWithShape(t.raw, e.raw, u, b, f, o, l, h, d, p);
      return u.free(), b.free(), f.free(), y;
    }
    projectPoint(t, e, r, n, s, o, l, h, d) {
      let p = w.intoRaw(r), u = Ct.fromRaw(e, this.raw.projectPoint(t.raw, e.raw, p, n, s, o, l, h, d));
      return p.free(), u;
    }
    projectPointAndGetFeature(t, e, r, n, s, o, l, h) {
      let d = w.intoRaw(r), p = Ct.fromRaw(e, this.raw.projectPointAndGetFeature(t.raw, e.raw, d, n, s, o, l, h));
      return d.free(), p;
    }
    intersectionsWithPoint(t, e, r, n, s, o, l, h, d) {
      let p = w.intoRaw(r);
      this.raw.intersectionsWithPoint(t.raw, e.raw, p, n, s, o, l, h, d), p.free();
    }
    castShape(t, e, r, n, s, o, l, h, d, p, u, b, f, y) {
      let v = w.intoRaw(r), G = E.intoRaw(n), z = w.intoRaw(s), O = o.intoRaw(), X = Nt.fromRaw(e, this.raw.castShape(t.raw, e.raw, v, G, z, O, l, h, d, p, u, b, f, y));
      return v.free(), G.free(), z.free(), O.free(), X;
    }
    intersectionsWithShape(t, e, r, n, s, o, l, h, d, p, u) {
      let b = w.intoRaw(r), f = E.intoRaw(n), y = s.intoRaw();
      this.raw.intersectionsWithShape(t.raw, e.raw, b, f, y, o, l, h, d, p, u), b.free(), f.free(), y.free();
    }
    collidersWithAabbIntersectingAabb(t, e, r) {
      let n = w.intoRaw(t), s = w.intoRaw(e);
      this.raw.collidersWithAabbIntersectingAabb(n, s, r), n.free(), s.free();
    }
  }
  class se {
    constructor(t) {
      this.raw = t || new ke();
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    serializeAll(t, e, r, n, s, o, l, h, d) {
      let p = w.intoRaw(t);
      const u = this.raw.serializeAll(p, e.raw, r.raw, n.raw, s.raw, o.raw, l.raw, h.raw, d.raw);
      return p.free(), u;
    }
    deserializeAll(t) {
      return kt.fromRaw(this.raw.deserializeAll(t));
    }
  }
  class rr {
    constructor(t, e) {
      this.vertices = t, this.colors = e;
    }
  }
  class ir {
    constructor(t) {
      this.raw = t || new Me();
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.vertices = void 0, this.colors = void 0;
    }
    render(t, e, r, n, s) {
      this.raw.render(t.raw, e.raw, r.raw, n.raw, s.raw), this.vertices = this.raw.vertices(), this.colors = this.raw.colors();
    }
  }
  class nr {
  }
  class sr {
    constructor(t, e, r, n, s) {
      this.params = e, this.bodies = r, this.colliders = n, this.queries = s, this.raw = new xe(t), this.rawCharacterCollision = new le(), this._applyImpulsesToDynamicBodies = false, this._characterMass = null;
    }
    free() {
      this.raw && (this.raw.free(), this.rawCharacterCollision.free()), this.raw = void 0, this.rawCharacterCollision = void 0;
    }
    up() {
      return this.raw.up();
    }
    setUp(t) {
      let e = w.intoRaw(t);
      return this.raw.setUp(e);
    }
    applyImpulsesToDynamicBodies() {
      return this._applyImpulsesToDynamicBodies;
    }
    setApplyImpulsesToDynamicBodies(t) {
      this._applyImpulsesToDynamicBodies = t;
    }
    characterMass() {
      return this._characterMass;
    }
    setCharacterMass(t) {
      this._characterMass = t;
    }
    offset() {
      return this.raw.offset();
    }
    setOffset(t) {
      this.raw.setOffset(t);
    }
    normalNudgeFactor() {
      return this.raw.normalNudgeFactor();
    }
    setNormalNudgeFactor(t) {
      this.raw.setNormalNudgeFactor(t);
    }
    slideEnabled() {
      return this.raw.slideEnabled();
    }
    setSlideEnabled(t) {
      this.raw.setSlideEnabled(t);
    }
    autostepMaxHeight() {
      return this.raw.autostepMaxHeight();
    }
    autostepMinWidth() {
      return this.raw.autostepMinWidth();
    }
    autostepIncludesDynamicBodies() {
      return this.raw.autostepIncludesDynamicBodies();
    }
    autostepEnabled() {
      return this.raw.autostepEnabled();
    }
    enableAutostep(t, e, r) {
      this.raw.enableAutostep(t, e, r);
    }
    disableAutostep() {
      return this.raw.disableAutostep();
    }
    maxSlopeClimbAngle() {
      return this.raw.maxSlopeClimbAngle();
    }
    setMaxSlopeClimbAngle(t) {
      this.raw.setMaxSlopeClimbAngle(t);
    }
    minSlopeSlideAngle() {
      return this.raw.minSlopeSlideAngle();
    }
    setMinSlopeSlideAngle(t) {
      this.raw.setMinSlopeSlideAngle(t);
    }
    snapToGroundDistance() {
      return this.raw.snapToGroundDistance();
    }
    enableSnapToGround(t) {
      this.raw.enableSnapToGround(t);
    }
    disableSnapToGround() {
      this.raw.disableSnapToGround();
    }
    snapToGroundEnabled() {
      return this.raw.snapToGroundEnabled();
    }
    computeColliderMovement(t, e, r, n, s) {
      let o = w.intoRaw(e);
      this.raw.computeColliderMovement(this.params.dt, this.bodies.raw, this.colliders.raw, this.queries.raw, t.handle, o, this._applyImpulsesToDynamicBodies, this._characterMass, r, n, this.colliders.castClosure(s)), o.free();
    }
    computedMovement() {
      return w.fromRaw(this.raw.computedMovement());
    }
    computedGrounded() {
      return this.raw.computedGrounded();
    }
    numComputedCollisions() {
      return this.raw.numComputedCollisions();
    }
    computedCollision(t, e) {
      if (this.raw.computedCollision(t, this.rawCharacterCollision)) {
        let r = this.rawCharacterCollision;
        return e = e ?? new nr(), e.translationDeltaApplied = w.fromRaw(r.translationDeltaApplied()), e.translationDeltaRemaining = w.fromRaw(r.translationDeltaRemaining()), e.toi = r.toi(), e.witness1 = w.fromRaw(r.worldWitness1()), e.witness2 = w.fromRaw(r.worldWitness2()), e.normal1 = w.fromRaw(r.worldNormal1()), e.normal2 = w.fromRaw(r.worldNormal2()), e.collider = this.colliders.get(r.handle()), e;
      } else return null;
    }
  }
  class kt {
    constructor(t, e, r, n, s, o, l, h, d, p, u, b, f, y) {
      this.gravity = t, this.integrationParameters = new Fe(e), this.islands = new Ye(r), this.broadPhase = new $e(n), this.narrowPhase = new Ze(s), this.bodies = new He(o), this.colliders = new ar(l), this.impulseJoints = new qe(h), this.multibodyJoints = new Ve(d), this.ccdSolver = new Ke(p), this.queryPipeline = new er(u), this.physicsPipeline = new tr(b), this.serializationPipeline = new se(f), this.debugRenderPipeline = new ir(y), this.characterControllers = /* @__PURE__ */ new Set(), this.impulseJoints.finalizeDeserialization(this.bodies), this.bodies.finalizeDeserialization(this.colliders), this.colliders.finalizeDeserialization(this.bodies);
    }
    free() {
      this.integrationParameters.free(), this.islands.free(), this.broadPhase.free(), this.narrowPhase.free(), this.bodies.free(), this.colliders.free(), this.impulseJoints.free(), this.multibodyJoints.free(), this.ccdSolver.free(), this.queryPipeline.free(), this.physicsPipeline.free(), this.serializationPipeline.free(), this.debugRenderPipeline.free(), this.characterControllers.forEach((t) => t.free()), this.integrationParameters = void 0, this.islands = void 0, this.broadPhase = void 0, this.narrowPhase = void 0, this.bodies = void 0, this.colliders = void 0, this.ccdSolver = void 0, this.impulseJoints = void 0, this.multibodyJoints = void 0, this.queryPipeline = void 0, this.physicsPipeline = void 0, this.serializationPipeline = void 0, this.debugRenderPipeline = void 0, this.characterControllers = void 0;
    }
    static fromRaw(t) {
      return t ? new kt(w.fromRaw(t.takeGravity()), t.takeIntegrationParameters(), t.takeIslandManager(), t.takeBroadPhase(), t.takeNarrowPhase(), t.takeBodies(), t.takeColliders(), t.takeImpulseJoints(), t.takeMultibodyJoints()) : null;
    }
    takeSnapshot() {
      return this.serializationPipeline.serializeAll(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
    }
    static restoreSnapshot(t) {
      return new se().deserializeAll(t);
    }
    debugRender() {
      return this.debugRenderPipeline.render(this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.narrowPhase), new rr(this.debugRenderPipeline.vertices, this.debugRenderPipeline.colors);
    }
    step(t, e) {
      this.physicsPipeline.step(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.ccdSolver, t, e), this.queryPipeline.update(this.bodies, this.colliders);
    }
    propagateModifiedBodyPositionsToColliders() {
      this.bodies.raw.propagateModifiedBodyPositionsToColliders(this.colliders.raw);
    }
    updateSceneQueries() {
      this.propagateModifiedBodyPositionsToColliders(), this.queryPipeline.update(this.bodies, this.colliders);
    }
    get timestep() {
      return this.integrationParameters.dt;
    }
    set timestep(t) {
      this.integrationParameters.dt = t;
    }
    get lengthUnit() {
      return this.integrationParameters.lengthUnit;
    }
    set lengthUnit(t) {
      this.integrationParameters.lengthUnit = t;
    }
    get numSolverIterations() {
      return this.integrationParameters.numSolverIterations;
    }
    set numSolverIterations(t) {
      this.integrationParameters.numSolverIterations = t;
    }
    get numAdditionalFrictionIterations() {
      return this.integrationParameters.numAdditionalFrictionIterations;
    }
    set numAdditionalFrictionIterations(t) {
      this.integrationParameters.numAdditionalFrictionIterations = t;
    }
    get numInternalPgsIterations() {
      return this.integrationParameters.numInternalPgsIterations;
    }
    set numInternalPgsIterations(t) {
      this.integrationParameters.numInternalPgsIterations = t;
    }
    switchToStandardPgsSolver() {
      this.integrationParameters.switchToStandardPgsSolver();
    }
    switchToSmallStepsPgsSolver() {
      this.integrationParameters.switchToSmallStepsPgsSolver();
    }
    switchToSmallStepsPgsSolverWithoutWarmstart() {
      this.integrationParameters.switchToSmallStepsPgsSolverWithoutWarmstart();
    }
    createRigidBody(t) {
      return this.bodies.createRigidBody(this.colliders, t);
    }
    createCharacterController(t) {
      let e = new sr(t, this.integrationParameters, this.bodies, this.colliders, this.queryPipeline);
      return this.characterControllers.add(e), e;
    }
    removeCharacterController(t) {
      this.characterControllers.delete(t), t.free();
    }
    createCollider(t, e) {
      let r = e ? e.handle : void 0;
      return this.colliders.createCollider(this.bodies, t, r);
    }
    createImpulseJoint(t, e, r, n) {
      return this.impulseJoints.createJoint(this.bodies, t, e.handle, r.handle, n);
    }
    createMultibodyJoint(t, e, r, n) {
      return this.multibodyJoints.createJoint(t, e.handle, r.handle, n);
    }
    getRigidBody(t) {
      return this.bodies.get(t);
    }
    getCollider(t) {
      return this.colliders.get(t);
    }
    getImpulseJoint(t) {
      return this.impulseJoints.get(t);
    }
    getMultibodyJoint(t) {
      return this.multibodyJoints.get(t);
    }
    removeRigidBody(t) {
      this.bodies && this.bodies.remove(t.handle, this.islands, this.colliders, this.impulseJoints, this.multibodyJoints);
    }
    removeCollider(t, e) {
      this.colliders && this.colliders.remove(t.handle, this.islands, this.bodies, e);
    }
    removeImpulseJoint(t, e) {
      this.impulseJoints && this.impulseJoints.remove(t.handle, e);
    }
    removeMultibodyJoint(t, e) {
      this.impulseJoints && this.multibodyJoints.remove(t.handle, e);
    }
    forEachCollider(t) {
      this.colliders.forEach(t);
    }
    forEachRigidBody(t) {
      this.bodies.forEach(t);
    }
    forEachActiveRigidBody(t) {
      this.bodies.forEachActiveRigidBody(this.islands, t);
    }
    castRay(t, e, r, n, s, o, l, h) {
      return this.queryPipeline.castRay(this.bodies, this.colliders, t, e, r, n, s, o ? o.handle : null, l ? l.handle : null, this.colliders.castClosure(h));
    }
    castRayAndGetNormal(t, e, r, n, s, o, l, h) {
      return this.queryPipeline.castRayAndGetNormal(this.bodies, this.colliders, t, e, r, n, s, o ? o.handle : null, l ? l.handle : null, this.colliders.castClosure(h));
    }
    intersectionsWithRay(t, e, r, n, s, o, l, h, d) {
      this.queryPipeline.intersectionsWithRay(this.bodies, this.colliders, t, e, r, n, s, o, l ? l.handle : null, h ? h.handle : null, this.colliders.castClosure(d));
    }
    intersectionWithShape(t, e, r, n, s, o, l, h) {
      let d = this.queryPipeline.intersectionWithShape(this.bodies, this.colliders, t, e, r, n, s, o ? o.handle : null, l ? l.handle : null, this.colliders.castClosure(h));
      return d != null ? this.colliders.get(d) : null;
    }
    projectPoint(t, e, r, n, s, o, l) {
      return this.queryPipeline.projectPoint(this.bodies, this.colliders, t, e, r, n, s ? s.handle : null, o ? o.handle : null, this.colliders.castClosure(l));
    }
    projectPointAndGetFeature(t, e, r, n, s, o) {
      return this.queryPipeline.projectPointAndGetFeature(this.bodies, this.colliders, t, e, r, n ? n.handle : null, s ? s.handle : null, this.colliders.castClosure(o));
    }
    intersectionsWithPoint(t, e, r, n, s, o, l) {
      this.queryPipeline.intersectionsWithPoint(this.bodies, this.colliders, t, this.colliders.castClosure(e), r, n, s ? s.handle : null, o ? o.handle : null, this.colliders.castClosure(l));
    }
    castShape(t, e, r, n, s, o, l, h, d, p, u, b) {
      return this.queryPipeline.castShape(this.bodies, this.colliders, t, e, r, n, s, o, l, h, d, p ? p.handle : null, u ? u.handle : null, this.colliders.castClosure(b));
    }
    intersectionsWithShape(t, e, r, n, s, o, l, h, d) {
      this.queryPipeline.intersectionsWithShape(this.bodies, this.colliders, t, e, r, this.colliders.castClosure(n), s, o, l ? l.handle : null, h ? h.handle : null, this.colliders.castClosure(d));
    }
    collidersWithAabbIntersectingAabb(t, e, r) {
      this.queryPipeline.collidersWithAabbIntersectingAabb(t, e, this.colliders.castClosure(r));
    }
    contactPairsWith(t, e) {
      this.narrowPhase.contactPairsWith(t.handle, this.colliders.castClosure(e));
    }
    intersectionPairsWith(t, e) {
      this.narrowPhase.intersectionPairsWith(t.handle, this.colliders.castClosure(e));
    }
    contactPair(t, e, r) {
      this.narrowPhase.contactPair(t.handle, e.handle, r);
    }
    intersectionPair(t, e) {
      return this.narrowPhase.intersectionPair(t.handle, e.handle);
    }
  }
  var Wt;
  (function(a) {
    a[a.NONE = 0] = "NONE", a[a.COLLISION_EVENTS = 1] = "COLLISION_EVENTS", a[a.CONTACT_FORCE_EVENTS = 2] = "CONTACT_FORCE_EVENTS";
  })(Wt || (Wt = {}));
  var Bt;
  (function(a) {
    a[a.NONE = 0] = "NONE", a[a.FILTER_CONTACT_PAIRS = 1] = "FILTER_CONTACT_PAIRS", a[a.FILTER_INTERSECTION_PAIRS = 2] = "FILTER_INTERSECTION_PAIRS";
  })(Bt || (Bt = {}));
  var ae;
  (function(a) {
    a[a.EMPTY = 0] = "EMPTY", a[a.COMPUTE_IMPULSE = 1] = "COMPUTE_IMPULSE";
  })(ae || (ae = {}));
  var qt;
  (function(a) {
    a[a.DYNAMIC_DYNAMIC = 1] = "DYNAMIC_DYNAMIC", a[a.DYNAMIC_KINEMATIC = 12] = "DYNAMIC_KINEMATIC", a[a.DYNAMIC_FIXED = 2] = "DYNAMIC_FIXED", a[a.KINEMATIC_KINEMATIC = 52224] = "KINEMATIC_KINEMATIC", a[a.KINEMATIC_FIXED = 8704] = "KINEMATIC_FIXED", a[a.FIXED_FIXED = 32] = "FIXED_FIXED", a[a.DEFAULT = 15] = "DEFAULT", a[a.ALL = 60943] = "ALL";
  })(qt || (qt = {}));
  class oe {
    constructor(t, e, r, n) {
      this.colliderSet = t, this.handle = e, this._parent = r, this._shape = n;
    }
    finalizeDeserialization(t) {
      this.handle != null && (this._parent = t.get(this.colliderSet.raw.coParent(this.handle)));
    }
    ensureShapeIsCached() {
      this._shape || (this._shape = N.fromRaw(this.colliderSet.raw, this.handle));
    }
    get shape() {
      return this.ensureShapeIsCached(), this._shape;
    }
    isValid() {
      return this.colliderSet.raw.contains(this.handle);
    }
    translation() {
      return w.fromRaw(this.colliderSet.raw.coTranslation(this.handle));
    }
    rotation() {
      return E.fromRaw(this.colliderSet.raw.coRotation(this.handle));
    }
    isSensor() {
      return this.colliderSet.raw.coIsSensor(this.handle);
    }
    setSensor(t) {
      this.colliderSet.raw.coSetSensor(this.handle, t);
    }
    setShape(t) {
      let e = t.intoRaw();
      this.colliderSet.raw.coSetShape(this.handle, e), e.free(), this._shape = t;
    }
    setEnabled(t) {
      this.colliderSet.raw.coSetEnabled(this.handle, t);
    }
    isEnabled() {
      return this.colliderSet.raw.coIsEnabled(this.handle);
    }
    setRestitution(t) {
      this.colliderSet.raw.coSetRestitution(this.handle, t);
    }
    setFriction(t) {
      this.colliderSet.raw.coSetFriction(this.handle, t);
    }
    frictionCombineRule() {
      return this.colliderSet.raw.coFrictionCombineRule(this.handle);
    }
    setFrictionCombineRule(t) {
      this.colliderSet.raw.coSetFrictionCombineRule(this.handle, t);
    }
    restitutionCombineRule() {
      return this.colliderSet.raw.coRestitutionCombineRule(this.handle);
    }
    setRestitutionCombineRule(t) {
      this.colliderSet.raw.coSetRestitutionCombineRule(this.handle, t);
    }
    setCollisionGroups(t) {
      this.colliderSet.raw.coSetCollisionGroups(this.handle, t);
    }
    setSolverGroups(t) {
      this.colliderSet.raw.coSetSolverGroups(this.handle, t);
    }
    contactSkin() {
      return this.colliderSet.raw.coContactSkin(this.handle);
    }
    setContactSkin(t) {
      return this.colliderSet.raw.coSetContactSkin(this.handle, t);
    }
    activeHooks() {
      return this.colliderSet.raw.coActiveHooks(this.handle);
    }
    setActiveHooks(t) {
      this.colliderSet.raw.coSetActiveHooks(this.handle, t);
    }
    activeEvents() {
      return this.colliderSet.raw.coActiveEvents(this.handle);
    }
    setActiveEvents(t) {
      this.colliderSet.raw.coSetActiveEvents(this.handle, t);
    }
    activeCollisionTypes() {
      return this.colliderSet.raw.coActiveCollisionTypes(this.handle);
    }
    setContactForceEventThreshold(t) {
      return this.colliderSet.raw.coSetContactForceEventThreshold(this.handle, t);
    }
    contactForceEventThreshold() {
      return this.colliderSet.raw.coContactForceEventThreshold(this.handle);
    }
    setActiveCollisionTypes(t) {
      this.colliderSet.raw.coSetActiveCollisionTypes(this.handle, t);
    }
    setDensity(t) {
      this.colliderSet.raw.coSetDensity(this.handle, t);
    }
    setMass(t) {
      this.colliderSet.raw.coSetMass(this.handle, t);
    }
    setMassProperties(t, e, r) {
      let n = w.intoRaw(e);
      this.colliderSet.raw.coSetMassProperties(this.handle, t, n, r), n.free();
    }
    setTranslation(t) {
      this.colliderSet.raw.coSetTranslation(this.handle, t.x, t.y);
    }
    setTranslationWrtParent(t) {
      this.colliderSet.raw.coSetTranslationWrtParent(this.handle, t.x, t.y);
    }
    setRotation(t) {
      this.colliderSet.raw.coSetRotation(this.handle, t);
    }
    setRotationWrtParent(t) {
      this.colliderSet.raw.coSetRotationWrtParent(this.handle, t);
    }
    shapeType() {
      return this.colliderSet.raw.coShapeType(this.handle);
    }
    halfExtents() {
      return w.fromRaw(this.colliderSet.raw.coHalfExtents(this.handle));
    }
    setHalfExtents(t) {
      const e = w.intoRaw(t);
      this.colliderSet.raw.coSetHalfExtents(this.handle, e);
    }
    radius() {
      return this.colliderSet.raw.coRadius(this.handle);
    }
    setRadius(t) {
      this.colliderSet.raw.coSetRadius(this.handle, t);
    }
    roundRadius() {
      return this.colliderSet.raw.coRoundRadius(this.handle);
    }
    setRoundRadius(t) {
      this.colliderSet.raw.coSetRoundRadius(this.handle, t);
    }
    halfHeight() {
      return this.colliderSet.raw.coHalfHeight(this.handle);
    }
    setHalfHeight(t) {
      this.colliderSet.raw.coSetHalfHeight(this.handle, t);
    }
    vertices() {
      return this.colliderSet.raw.coVertices(this.handle);
    }
    indices() {
      return this.colliderSet.raw.coIndices(this.handle);
    }
    heightfieldHeights() {
      return this.colliderSet.raw.coHeightfieldHeights(this.handle);
    }
    heightfieldScale() {
      let t = this.colliderSet.raw.coHeightfieldScale(this.handle);
      return w.fromRaw(t);
    }
    parent() {
      return this._parent;
    }
    friction() {
      return this.colliderSet.raw.coFriction(this.handle);
    }
    restitution() {
      return this.colliderSet.raw.coRestitution(this.handle);
    }
    density() {
      return this.colliderSet.raw.coDensity(this.handle);
    }
    mass() {
      return this.colliderSet.raw.coMass(this.handle);
    }
    volume() {
      return this.colliderSet.raw.coVolume(this.handle);
    }
    collisionGroups() {
      return this.colliderSet.raw.coCollisionGroups(this.handle);
    }
    solverGroups() {
      return this.colliderSet.raw.coSolverGroups(this.handle);
    }
    containsPoint(t) {
      let e = w.intoRaw(t), r = this.colliderSet.raw.coContainsPoint(this.handle, e);
      return e.free(), r;
    }
    projectPoint(t, e) {
      let r = w.intoRaw(t), n = Dt.fromRaw(this.colliderSet.raw.coProjectPoint(this.handle, r, e));
      return r.free(), n;
    }
    intersectsRay(t, e) {
      let r = w.intoRaw(t.origin), n = w.intoRaw(t.dir), s = this.colliderSet.raw.coIntersectsRay(this.handle, r, n, e);
      return r.free(), n.free(), s;
    }
    castShape(t, e, r, n, s, o, l, h) {
      let d = w.intoRaw(t), p = w.intoRaw(r), u = E.intoRaw(n), b = w.intoRaw(s), f = e.intoRaw(), y = ut.fromRaw(this.colliderSet, this.colliderSet.raw.coCastShape(this.handle, d, f, p, u, b, o, l, h));
      return d.free(), p.free(), u.free(), b.free(), f.free(), y;
    }
    castCollider(t, e, r, n, s, o) {
      let l = w.intoRaw(t), h = w.intoRaw(r), d = Nt.fromRaw(this.colliderSet, this.colliderSet.raw.coCastCollider(this.handle, l, e.handle, h, n, s, o));
      return l.free(), h.free(), d;
    }
    intersectsShape(t, e, r) {
      let n = w.intoRaw(e), s = E.intoRaw(r), o = t.intoRaw(), l = this.colliderSet.raw.coIntersectsShape(this.handle, o, n, s);
      return n.free(), s.free(), o.free(), l;
    }
    contactShape(t, e, r, n) {
      let s = w.intoRaw(e), o = E.intoRaw(r), l = t.intoRaw(), h = dt.fromRaw(this.colliderSet.raw.coContactShape(this.handle, l, s, o, n));
      return s.free(), o.free(), l.free(), h;
    }
    contactCollider(t, e) {
      return dt.fromRaw(this.colliderSet.raw.coContactCollider(this.handle, t.handle, e));
    }
    castRay(t, e, r) {
      let n = w.intoRaw(t.origin), s = w.intoRaw(t.dir), o = this.colliderSet.raw.coCastRay(this.handle, n, s, e, r);
      return n.free(), s.free(), o;
    }
    castRayAndGetNormal(t, e, r) {
      let n = w.intoRaw(t.origin), s = w.intoRaw(t.dir), o = xt.fromRaw(this.colliderSet.raw.coCastRayAndGetNormal(this.handle, n, s, e, r));
      return n.free(), s.free(), o;
    }
  }
  var nt;
  (function(a) {
    a[a.Density = 0] = "Density", a[a.Mass = 1] = "Mass", a[a.MassProps = 2] = "MassProps";
  })(nt || (nt = {}));
  class D {
    constructor(t) {
      this.enabled = true, this.shape = t, this.massPropsMode = nt.Density, this.density = 1, this.friction = 0.5, this.restitution = 0, this.rotation = E.identity(), this.translation = w.zeros(), this.isSensor = false, this.collisionGroups = 4294967295, this.solverGroups = 4294967295, this.frictionCombineRule = vt.Average, this.restitutionCombineRule = vt.Average, this.activeCollisionTypes = qt.DEFAULT, this.activeEvents = Wt.NONE, this.activeHooks = Bt.NONE, this.mass = 0, this.centerOfMass = w.zeros(), this.contactForceEventThreshold = 0, this.contactSkin = 0, this.principalAngularInertia = 0, this.rotationsEnabled = true;
    }
    static ball(t) {
      const e = new de(t);
      return new D(e);
    }
    static capsule(t, e) {
      const r = new ge(t, e);
      return new D(r);
    }
    static segment(t, e) {
      const r = new fe(t, e);
      return new D(r);
    }
    static triangle(t, e, r) {
      const n = new me(t, e, r);
      return new D(n);
    }
    static roundTriangle(t, e, r, n) {
      const s = new ye(t, e, r, n);
      return new D(s);
    }
    static polyline(t, e) {
      const r = new Se(t, e);
      return new D(r);
    }
    static trimesh(t, e, r) {
      const n = new Re(t, e, r);
      return new D(n);
    }
    static cuboid(t, e) {
      const r = new ue(t, e);
      return new D(r);
    }
    static roundCuboid(t, e, r) {
      const n = new be(t, e, r);
      return new D(n);
    }
    static halfspace(t) {
      const e = new pe(t);
      return new D(e);
    }
    static heightfield(t, e) {
      const r = new ve(t, e);
      return new D(r);
    }
    static convexHull(t) {
      const e = new zt(t, false);
      return new D(e);
    }
    static convexPolyline(t) {
      const e = new zt(t, true);
      return new D(e);
    }
    static roundConvexHull(t, e) {
      const r = new Ot(t, e, false);
      return new D(r);
    }
    static roundConvexPolyline(t, e) {
      const r = new Ot(t, e, true);
      return new D(r);
    }
    setTranslation(t, e) {
      if (typeof t != "number" || typeof e != "number") throw TypeError("The translation components must be numbers.");
      return this.translation = { x: t, y: e }, this;
    }
    setRotation(t) {
      return this.rotation = t, this;
    }
    setSensor(t) {
      return this.isSensor = t, this;
    }
    setEnabled(t) {
      return this.enabled = t, this;
    }
    setContactSkin(t) {
      return this.contactSkin = t, this;
    }
    setDensity(t) {
      return this.massPropsMode = nt.Density, this.density = t, this;
    }
    setMass(t) {
      return this.massPropsMode = nt.Mass, this.mass = t, this;
    }
    setMassProperties(t, e, r) {
      return this.massPropsMode = nt.MassProps, this.mass = t, w.copy(this.centerOfMass, e), this.principalAngularInertia = r, this;
    }
    setRestitution(t) {
      return this.restitution = t, this;
    }
    setFriction(t) {
      return this.friction = t, this;
    }
    setFrictionCombineRule(t) {
      return this.frictionCombineRule = t, this;
    }
    setRestitutionCombineRule(t) {
      return this.restitutionCombineRule = t, this;
    }
    setCollisionGroups(t) {
      return this.collisionGroups = t, this;
    }
    setSolverGroups(t) {
      return this.solverGroups = t, this;
    }
    setActiveHooks(t) {
      return this.activeHooks = t, this;
    }
    setActiveEvents(t) {
      return this.activeEvents = t, this;
    }
    setActiveCollisionTypes(t) {
      return this.activeCollisionTypes = t, this;
    }
    setContactForceEventThreshold(t) {
      return this.contactForceEventThreshold = t, this;
    }
  }
  class ar {
    constructor(t) {
      this.raw = t || new A(), this.map = new Mt(), t && t.forEachColliderHandle((e) => {
        this.map.set(e, new oe(this, e, null));
      });
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
    }
    castClosure(t) {
      return (e) => {
        if (t) return t(this.get(e));
      };
    }
    finalizeDeserialization(t) {
      this.map.forEach((e) => e.finalizeDeserialization(t));
    }
    createCollider(t, e, r) {
      let n = r != null && r != null;
      if (n && isNaN(r)) throw Error("Cannot create a collider with a parent rigid-body handle that is not a number.");
      let s = e.shape.intoRaw(), o = w.intoRaw(e.translation), l = E.intoRaw(e.rotation), h = w.intoRaw(e.centerOfMass), d = this.raw.createCollider(e.enabled, s, o, l, e.massPropsMode, e.mass, h, e.principalAngularInertia, e.density, e.friction, e.restitution, e.frictionCombineRule, e.restitutionCombineRule, e.isSensor, e.collisionGroups, e.solverGroups, e.activeCollisionTypes, e.activeHooks, e.activeEvents, e.contactForceEventThreshold, e.contactSkin, n, n ? r : 0, t.raw);
      s.free(), o.free(), l.free(), h.free();
      let p = n ? t.get(r) : null, u = new oe(this, d, p, e.shape);
      return this.map.set(d, u), u;
    }
    remove(t, e, r, n) {
      this.raw.remove(t, e.raw, r.raw, n), this.unmap(t);
    }
    unmap(t) {
      this.map.delete(t);
    }
    get(t) {
      return this.map.get(t);
    }
    len() {
      return this.map.len();
    }
    contains(t) {
      return this.get(t) != null;
    }
    forEach(t) {
      this.map.forEach(t);
    }
    getAll() {
      return this.map.getAll();
    }
  }
  async function or() {
    const a = document.createElement("canvas"), t = a.getContext("2d");
    document.getElementById("app").appendChild(a);
    function e() {
      a.width = window.innerWidth, a.height = window.innerHeight;
    }
    window.addEventListener("resize", e), e();
    const r = { x: 0, y: 0 }, n = new kt(r), s = 2e3, o = 500, l = o / 10, h = U.dynamic().setTranslation(0, 0).setLinearDamping(0.5).setAngularDamping(2), d = n.createRigidBody(h), p = new Float32Array([0, 15, -10, -10, 10, -10]), u = D.convexHull(p);
    n.createCollider(u, d);
    const b = {};
    window.addEventListener("keydown", (j) => b[j.key.toLowerCase()] = true), window.addEventListener("keyup", (j) => b[j.key.toLowerCase()] = false);
    let f = 0, y = 0;
    const v = document.createElement("div");
    v.style.position = "absolute", v.style.top = "20px", v.style.left = "20px", v.style.padding = "20px", v.style.background = "rgba(0, 0, 0, 0.7)", v.style.borderRadius = "12px", v.style.backdropFilter = "blur(10px)", v.style.border = "1px solid rgba(255, 255, 255, 0.1)", v.style.pointerEvents = "none", v.style.fontSize = "14px", v.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold; color: #4facfe;">BOID SYSTEMS</div>
    <div id="left-stat">Left Thruster: 0</div>
    <div id="right-stat">Right Thruster: 0</div>
    <div id="vel-stat">Velocity: 0</div>
    <div id="rot-stat">Rotation Power: 0</div>
    <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right</div>
  `, document.body.appendChild(v);
    const G = document.getElementById("left-stat"), z = document.getElementById("right-stat"), O = document.getElementById("vel-stat"), X = document.getElementById("rot-stat");
    function ot() {
      b.q && (f = Math.min(f + l, o)), b.a && (f = Math.max(f - l, 0)), b.w && (y = Math.min(y + l, o)), b.s && (y = Math.max(y - l, 0));
      const j = d.rotation(), H = -Math.sin(j), F = Math.cos(j), M = { x: -10, y: -10 }, Lt = { x: 10, y: -10 }, k = (B, gt) => ({ x: B.x * Math.cos(gt) - B.y * Math.sin(gt), y: B.x * Math.sin(gt) + B.y * Math.cos(gt) }), bt = d.translation();
      if (f > 0) {
        const B = k(M, j);
        d.applyImpulseAtPoint({ x: H * f * 0.1, y: F * f * 0.1 }, { x: bt.x + B.x, y: bt.y + B.y }, true);
      }
      if (y > 0) {
        const B = k(Lt, j);
        d.applyImpulseAtPoint({ x: H * y * 0.1, y: F * y * 0.1 }, { x: bt.x + B.x, y: bt.y + B.y }, true);
      }
    }
    function _t() {
      let { x: j, y: H } = d.translation();
      const F = s / 2;
      let M = false;
      j > F ? (j -= s, M = true) : j < -F && (j += s, M = true), H > F ? (H -= s, M = true) : H < -F && (H += s, M = true), M && d.setTranslation({ x: j, y: H }, true);
    }
    function lt() {
      t.clearRect(0, 0, a.width, a.height);
      const j = d.translation().x, H = d.translation().y;
      t.save(), t.translate(a.width / 2, a.height / 2), t.scale(1, -1), t.save(), t.translate(-j, -H), t.strokeStyle = "rgba(255, 255, 255, 0.05)", t.lineWidth = 1;
      for (let k = -s / 2; k <= s / 2; k += 100) t.beginPath(), t.moveTo(k, -s / 2), t.lineTo(k, s / 2), t.stroke(), t.beginPath(), t.moveTo(-s / 2, k), t.lineTo(s / 2, k), t.stroke();
      t.strokeStyle = "#4facfe", t.lineWidth = 4, t.strokeRect(-s / 2, -s / 2, s, s), t.restore(), t.save(), t.rotate(d.rotation()), t.beginPath(), t.moveTo(0, 15), t.lineTo(-10, -10), t.lineTo(10, -10), t.closePath(), t.fillStyle = "#fff", t.fill(), t.strokeStyle = "#4facfe", t.lineWidth = 2, t.stroke();
      const F = 30;
      if (f > 0) {
        const k = f / o * F;
        t.beginPath(), t.moveTo(-7, -10), t.lineTo(-7, -10 - k), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
      }
      if (y > 0) {
        const k = y / o * F;
        t.beginPath(), t.moveTo(7, -10), t.lineTo(7, -10 - k), t.strokeStyle = "#ff4b2b", t.lineWidth = 4, t.stroke();
      }
      t.restore(), t.restore(), G.innerText = `Left Thruster: ${Math.round(f / o * 100)}%`, z.innerText = `Right Thruster: ${Math.round(y / o * 100)}%`;
      const M = d.linvel(), Lt = Math.sqrt(M.x * M.x + M.y * M.y);
      O.innerText = `Velocity: ${Math.round(Lt)} | Angle: ${Math.round(Math.atan2(M.y, M.x) * 180 / Math.PI)}\xB0`, X.innerText = `Rotation Power: ${d.angvel().toFixed(2)}`;
    }
    function ct() {
      ot(), n.step(), _t(), lt(), requestAnimationFrame(ct);
    }
    ct();
  }
  or().catch(console.error);
});
var stdin_default = _r();
export {
  stdin_default as default
};
