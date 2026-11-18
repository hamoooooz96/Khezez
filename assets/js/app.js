/* ==========================================================================
   KHEZEZ — app.js
   WebGL glass stack (telephoto camera) · focus & landing transitions ·
   hash router · index · frames · studio · contact
   Depends on: gsap (vendor), lenis (vendor), data.js
   ========================================================================== */
(() => {
  'use strict';

  const D = window.KHEZEZ;
  const gsap = window.gsap;
  if (!D || !gsap) return;

  /* ---------- helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const damp = (a, b, l, dt) => lerp(a, b, 1 - Math.exp(-l * dt));
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DEG = Math.PI / 180;
  const mqTouch = matchMedia('(hover: none), (pointer: coarse)');
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const isTouch = () => mqTouch.matches;
  const reduced = () => mqReduce.matches;
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  function cubicBezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = t => ((ax * t + bx) * t + cx) * t;
    const sy = t => ((ay * t + by) * t + cy) * t;
    const dx = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const e = sx(t) - x;
        if (Math.abs(e) < 1e-6) return sy(t);
        const d = dx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= e / d;
      }
      let lo = 0, hi = 1; t = x;
      for (let i = 0; i < 30; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-6) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      return sy(t);
    };
  }
  const EASE_IO = cubicBezier(.77, 0, .175, 1);   // movement on screen
  const EASE_OUT = cubicBezier(.23, 1, .32, 1);   // arriving

  if (reduced()) gsap.globalTimeline.timeScale(3);

  /* ==========================================================================
     MEDIA
     ========================================================================== */
  function parseImage(str, p, k) {
    const parts = String(str).trim().split('|');
    const m = { project: p, k, n: k + 1, ratio: 1.5 };
    if (UUID.test(parts[0]) && parts.length >= 4) {
      const id = parts[0];
      m.sm = `${D.cdn}${id}_rw_600.jpg?h=${parts[1]}`;
      m.md = `${D.cdn}${id}_rw_1200.jpg?h=${parts[2]}`;
      m.lg = `${D.cdn}${id}_rw_1920.jpg?h=${parts[3]}`;
      m.ratio = parseFloat(parts[4]) || 1.5;
      if (D.localMedia) {
        const b = `assets/media/${p.slug}/${pad(k + 1)}`;
        m.sm = `${b}-sm.jpg`; m.md = `${b}-md.jpg`; m.lg = `${b}.jpg`;
      }
    } else if (/^assets\/media\/.+\.webp$/i.test(parts[0])) {
      const b = parts[0].replace(/\.webp$/i, '');
      m.local = true;
      m.sm = `${b}-sm.webp`; m.md = `${b}-md.webp`; m.lg = `${b}.webp`;
      m.ratio = parseFloat(parts[1]) || 1.5;
      m.srcset = `${m.sm} 480w, ${m.md} 960w, ${m.lg} 1600w`;
    } else {
      m.sm = m.md = m.lg = parts[0];
      m.ratio = parseFloat(parts[1]) || 1.5;
      m.local = !/^https?:/i.test(parts[0]);
    }
    if (m.srcset == null) m.srcset = m.sm === m.lg ? '' : `${m.sm} 600w, ${m.lg} 1920w`;
    return m;
  }

  const P = (D.projects || []).filter(p => p && p.slug && p.images && p.images.length);
  P.forEach((p, i) => { p.i = i; p.n = i + 1; p.media = p.images.map((s, k) => parseImage(s, p, k)); });
  if (D.localOnly) {
    // a host that can't reach the photo CDN keeps only the photos shipped with the site
    P.forEach(p => { p.media = p.media.filter(m => m.local); p.media.forEach((m, k) => { m.k = k; m.n = k + 1; }); });
    for (let i = P.length; i--;) if (!P[i].media.length) P.splice(i, 1);
    P.forEach((p, i) => { p.i = i; p.n = i + 1; });
  }
  const bySlug = Object.create(null);
  P.forEach(p => { bySlug[p.slug.toLowerCase()] = p; });
  const FRAMES = P.flatMap(p => p.media);
  FRAMES.forEach((m, i) => { m.g = i; });
  const label = p => `${p.title} / ${p.subtitle || p.category}`;

  function makeImg(m, o = {}) {
    const im = document.createElement('img');
    im.alt = o.alt != null ? o.alt : `${m.project.title}, frame ${m.n}`;
    im.decoding = 'async';
    im.draggable = false;
    if (o.lazy) im.loading = 'lazy';
    if (o.cors) im.crossOrigin = 'anonymous';
    im.addEventListener('load', () => im.classList.add('is-loaded'), { once: true });
    im.addEventListener('error', () => { if (im.parentElement) im.parentElement.classList.add('is-broken'); }, { once: true });
    if (m.srcset && o.sizes) { im.sizes = o.sizes; im.srcset = m.srcset; }
    im.src = m[o.size || 'lg'];
    return im;
  }

  /* ==========================================================================
     DECK — glass slabs seen through a long lens
     Camera at the origin looking down -z, 5° vertical field of view. Every
     slab shares one orientation; slots run diagonally away from the viewer.
     ========================================================================== */
  const VERT = `
    attribute vec2 aPos;
    uniform mat4 uProj;
    uniform mat4 uModel;
    varying vec2 vUv;
    void main() {
      vUv = aPos + 0.5;
      gl_Position = uProj * uModel * vec4(aPos, 0.0, 1.0);
    }`;
  const FRAG = `
    precision mediump float;
    uniform sampler2D uTex;
    uniform vec2 uCover;
    uniform vec2 uSize;
    uniform vec3 uBg;
    uniform float uOpacity, uFrost, uEdge, uBlur, uFog, uLoaded, uRim;
    varying vec2 vUv;
    vec3 tap(vec2 uv, float b) { return texture2D(uTex, clamp(uv, 0.001, 0.999), b).rgb; }
    void main() {
      vec2 uv = (vUv - 0.5) * uCover + 0.5;
      vec2 ed = min(vUv, 1.0 - vUv) * uSize;
      float e = min(ed.x, ed.y);
      // frosted glass on the trailing side of each slab
      float side = smoothstep(0.5, 1.0, vUv.x) * uFrost;
      // frosted rim when a slab is lifted out alone
      float ring = (1.0 - smoothstep(0.012, 0.17, e)) * uEdge;
      float m = max(side, ring);
      float b = uBlur + m * 4.2;
      vec3 c;
      if (b < 0.05) {
        c = tap(uv, 0.0);   // sharp area: one sample is enough
      } else {
        float r = 0.0032 * b;
        c = tap(uv, b) * 0.4
          + (tap(uv + vec2(r, 0.0), b) + tap(uv - vec2(r, 0.0), b)
           + tap(uv + vec2(0.0, r), b) + tap(uv - vec2(0.0, r), b)) * 0.15;
      }
      c *= 1.0 - side * 0.09;
      c = mix(vec3(0.925, 0.925, 0.92), c, uLoaded);
      // thickness of the slab catching light on its near edges
      vec2 tr = (1.0 - vUv) * uSize;
      float rim = (1.0 - smoothstep(0.0, 0.009, min(tr.x, tr.y))) * uRim;
      c = mix(c, vec3(1.0), rim * 0.55);
      c = mix(c, uBg, uFog);
      float a = uOpacity * (1.0 - side * 0.1);
      gl_FragColor = vec4(c * a, a);
    }`;

  const Deck = {
    ok: false, gl: null, canvas: $('#gl'), stage: $('#stage'), labelEl: $('#planeLabel'),
    planes: [], N: 0, L: null, cache: new Map(),
    tanH: Math.tan(2.5 * DEG),
    vw: 1, vh: 1, aspect: 1, dpr: 1,
    proj: new Float32Array(16), model: new Float32Array(16),
    g: null, tStart: -8, tEnd: 10, tMin: -6, tMax: 8, slotPx: { x: 1, y: -1, len: 1 },
    scroll: 0, target: 0,
    presence: 0, push: 0, haze: 0,
    hover: null, focus: null, focusP: 0, morphP: 0, focusOp: 1, focusFrom: null, focusTo: null, morphTo: null,
    enabled: false, visible: true, dirty: true, needPick: false, pointer: null, drag: null, lost: false,
    lab: { x: 0, y: 0, on: false },

    init() {
      let gl = null;
      try { gl = this.canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'high-performance' }); } catch (e) { gl = null; }
      if (!gl) return false;
      this.gl = gl;
      if (!this.setupGL()) return false;
      this.ok = true;
      this.build();
      this.layout();
      this.bind();
      this.canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); this.lost = true; });
      this.canvas.addEventListener('webglcontextrestored', () => {
        this.lost = false;
        this.setupGL();
        this.cache.forEach(c => { c.tex = null; if (c.img) this.upload(c); });
        this.layout();
      });
      return true;
    },

    setupGL() {
      const gl = this.gl;
      const sh = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
        return s;
      };
      const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return false;
      const pr = gl.createProgram();
      gl.attachShader(pr, vs); gl.attachShader(pr, fs);
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(pr)); return false; }
      this.prog = pr;
      gl.useProgram(pr);
      this.L = {};
      ['uProj', 'uModel', 'uTex', 'uCover', 'uSize', 'uBg', 'uOpacity', 'uFrost', 'uEdge', 'uBlur', 'uFog', 'uLoaded', 'uRim']
        .forEach(n => { this.L[n] = gl.getUniformLocation(pr, n); });
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-.5, -.5, .5, -.5, -.5, .5, .5, .5]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(pr, 'aPos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.uniform1i(this.L.uTex, 0);
      gl.uniform3f(this.L.uBg, 250 / 255, 250 / 255, 250 / 255);
      this.aniso = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
      this.anisoMax = this.aniso ? gl.getParameter(this.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
      this.blank = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.blank);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([236, 236, 235, 255]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return true;
    },

    build() {
      const pool = p => { const l = p.media.filter(m => m.local); return l.length ? l : p.media; };
      const per = p => Math.min(p.cards || 3, pool(p).length);
      const maxC = Math.max(...P.map(per));
      let list = [];
      for (let k = 0; k < maxC; k++) P.forEach(p => { if (k < per(p)) list.push(pool(p)[k]); });
      const base = list.slice();
      while (list.length && list.length < 16) list = list.concat(base);
      this.N = list.length;
      const blank = () => ({ x: 0, y: 0, z: -40, rx: 0, ry: 0, w: 1, h: 1 });
      this.planes = list.map((m, i) => {
        const r = clamp(m.ratio || 1.5, .4, 3), d = Math.sqrt(1 + r * r);
        if (!this.cache.has(m.md)) this.cache.set(m.md, { url: m.md, img: null, tex: null, err: false });
        const c = this.cache.get(m.md);
        return { i, m, p: m.project, ratio: r, W0: 2.1 * r / d, H0: 2.1 / d, c, t: 0, hov: 0, ld: 0, op: 0, frost: 1, edge: 0, blur: 0, fog: 0, rim: 1, pose: blank(), base: blank() };
      });
      $('#srList').innerHTML = P.map(p => `<a href="#${esc(p.slug)}">${esc(label(p))}</a>`).join('');
    },

    loadImages(onProgress) {
      const list = Array.from(this.cache.values());
      const first = new Set(this.planes.slice(0, Math.min(this.planes.length, Math.ceil(this.tMax - this.tStart) + 2)).map(p => p.c));
      const need = Math.max(1, first.size);
      let got = 0, done = 0;
      const step = c => {
        done++;
        if (first.has(c)) { got++; onProgress(got / need); }
        if (done === list.length) this.prune();
      };
      const load = c => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.onload = () => { c.img = img; try { this.upload(c); } catch (e) { c.err = true; } step(c); };
        img.onerror = () => { c.err = true; step(c); };
        img.src = c.url;
      };
      list.filter(c => first.has(c)).forEach(load);
      setTimeout(() => list.filter(c => !first.has(c)).forEach(load), 60);
    },

    prune() {
      if (!this.planes.some(p => p.c.err)) return;
      const keep = this.planes.filter(p => !p.c.err);
      if (!keep.length) return;
      if (this.focus && this.focus.c.err) this.focus = null;
      if (this.hover && this.hover.c.err) this.hover = null;
      keep.forEach((p, i) => { p.i = i; });
      this.planes = keep;
      this.N = keep.length;
      this.layout();
      this.dirty = true;
    },

    upload(c) {
      const gl = this.gl, img = c.img;
      if (!gl || !img || !img.naturalWidth) return;
      const big = Math.min(screen.width || innerWidth, screen.height || innerHeight) > 700 ? 1024 : 512;
      const ar = img.naturalWidth / img.naturalHeight;
      const tw = ar >= 1 ? big : big / (ar < .7 ? 2 : 1);
      const th = ar >= 1 ? big / (ar > 1.4 ? 2 : 1) : big;
      const cv = document.createElement('canvas');
      cv.width = tw; cv.height = th;
      cv.getContext('2d').drawImage(img, 0, 0, tw, th);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, cv);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (this.aniso) gl.texParameterf(gl.TEXTURE_2D, this.aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, this.anisoMax));
      c.tex = tex;
      this.dirty = true;
    },

    /* ---------- layout: telephoto camera, slab orientation, slot line ---------- */
    layout() {
      const vw = innerWidth, vh = innerHeight, a = vw / vh;
      this.vw = vw; this.vh = vh; this.aspect = a;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(vw * this.dpr);
      this.canvas.height = Math.round(vh * this.dpr);
      if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      const f = 1 / this.tanH, n = .1, fr = 1000, nf = 1 / (n - fr), m = this.proj;
      m.fill(0);
      m[0] = f / a; m[5] = f; m[10] = (fr + n) * nf; m[11] = -1; m[14] = 2 * fr * n * nf;

      // phones stand the line up and pull it further away; desktops lay it across
      const k = smooth(.5, 1.25, a);
      const rx = lerp(13.6, 20.85, k) * DEG, ry = -30 * DEG;
      const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
      this.g = {
        k, rx, ry, s: lerp(.825, 1, k),
        X: [cy, sx * sy, -cx * sy], Y: [0, cx, sx], Z: [sy, -sx * cy, cx * cy],
        c0: [lerp(-.038, 0, k), lerp(-.053, 0, k), lerp(-56.374, -37.4537, k)],
        S: [lerp(.31, .375, k), lerp(.437, .3204, k), lerp(-1.804, -.841, k)]
      };

      // which slots can be seen at this size
      let tMin = Infinity, tMax = -Infinity;
      const R = 1.05 * this.g.s;
      for (let t = -40; t <= 50; t += .25) {
        const c = this.slot(t), s = this.toScreen(c[0], c[1], c[2]);
        const rpx = R * (this.vh / 2) * f / -c[2];
        if (s.x + rpx > 0 && s.x - rpx < vw && s.y + rpx > 0 && s.y - rpx < vh) { tMin = Math.min(tMin, t); tMax = Math.max(tMax, t); }
      }
      if (!isFinite(tMin)) { tMin = -6; tMax = 8; }
      this.tMin = tMin; this.tMax = tMax;
      this.tStart = tMin - .75;
      this.tEnd = this.tStart + this.N;
      const s0 = this.toScreen(...this.slot(0)), s1 = this.toScreen(...this.slot(1));
      const dx = s1.x - s0.x, dy = s1.y - s0.y, len = Math.hypot(dx, dy) || 1;
      this.slotPx = { x: dx / len, y: dy / len, len };

      if (this.focus) this.focusTo = this.focusPose(this.focus);
      this.dirty = true;
    },
    slot(t) {
      const g = this.g;
      return [g.c0[0] + t * g.S[0], g.c0[1] + t * g.S[1], g.c0[2] + t * g.S[2]];
    },
    toScreen(x, y, z) {
      const f = 1 / this.tanH;
      return { x: (f / this.aspect * x / -z * .5 + .5) * this.vw, y: (.5 - f * y / -z * .5) * this.vh };
    },

    /* ---------- poses ---------- */
    stackPose(p, t, hov, out) {
      const g = this.g, s = g.s, c = this.slot(t);
      // slabs share a right edge; a hovered slab slides out along its own width
      const ox = s * ((1.5 - p.W0) / 2 + .6 * hov), oy = s * (-.09 * hov);
      out.x = c[0] + g.X[0] * ox + g.Y[0] * oy;
      out.y = c[1] + g.X[1] * ox + g.Y[1] * oy;
      out.z = c[2] + g.X[2] * ox + g.Y[2] * oy + this.push;
      out.rx = g.rx; out.ry = g.ry; out.w = p.W0 * s; out.h = p.H0 * s;
      return out;
    },
    focusPose(p) {
      const s = this.g.s, w = p.W0 * s, h = p.H0 * s;
      const z = Math.max(36.41 * s, w / (.86 * 2 * this.tanH * this.aspect), h / (.62 * 2 * this.tanH));
      return { x: 0, y: 0, z: -z, rx: 0, ry: 0, w, h };
    },
    rectPose(r, Z) {
      const visH = 2 * Z * this.tanH, visW = visH * this.aspect;
      return {
        x: ((r.left + r.width / 2) / this.vw - .5) * visW,
        y: -((r.top + r.height / 2) / this.vh - .5) * visH,
        z: -Z, rx: 0, ry: 0,
        w: r.width / this.vw * visW, h: r.height / this.vh * visH
      };
    },
    lerpPose(a, b, t, out) {
      out.x = lerp(a.x, b.x, t); out.y = lerp(a.y, b.y, t); out.z = lerp(a.z, b.z, t);
      out.rx = lerp(a.rx, b.rx, t); out.ry = lerp(a.ry, b.ry, t); out.w = lerp(a.w, b.w, t); out.h = lerp(a.h, b.h, t);
      return out;
    },
    alpha(t) { return smooth(this.tStart, this.tStart + .9, t) * (1 - smooth(this.tEnd - .9, this.tEnd, t)); },
    fogAt(t) { return smooth(this.tMax - 6.5, this.tMax + 1, t) * .42; },
    blurAt(t) { return clamp((this.tMin + 2.6 - t) * .85, 0, 2.6); },

    /* ---------- matrices & picking (R = Rx(rx) · Ry(ry)) ---------- */
    modelFrom(p, out) {
      const cy = Math.cos(p.ry), sy = Math.sin(p.ry), cx = Math.cos(p.rx), sx = Math.sin(p.rx);
      out[0] = cy * p.w; out[1] = sx * sy * p.w; out[2] = -cx * sy * p.w; out[3] = 0;
      out[4] = 0; out[5] = cx * p.h; out[6] = sx * p.h; out[7] = 0;
      out[8] = sy; out[9] = -sx * cy; out[10] = cx * cy; out[11] = 0;
      out[12] = p.x; out[13] = p.y; out[14] = p.z; out[15] = 1;
      return out;
    },
    hit(q, mx, my) {
      const dx = ((mx / this.vw) * 2 - 1) * this.tanH * this.aspect, dy = (1 - (my / this.vh) * 2) * this.tanH, dz = -1;
      const cy = Math.cos(q.ry), sy = Math.sin(q.ry), cx = Math.cos(q.rx), sx = Math.sin(q.rx);
      const X0 = cy, X1 = sx * sy, X2 = -cx * sy, Y1 = cx, Y2 = sx, Z0 = sy, Z1 = -sx * cy, Z2 = cx * cy;
      const den = dx * Z0 + dy * Z1 + dz * Z2;
      if (Math.abs(den) < 1e-9) return Infinity;
      const t = (q.x * Z0 + q.y * Z1 + q.z * Z2) / den;
      if (t <= 0) return Infinity;
      const hx = dx * t - q.x, hy = dy * t - q.y, hz = dz * t - q.z;
      const lx = hx * X0 + hy * X1 + hz * X2, ly = hy * Y1 + hz * Y2;
      return Math.abs(lx) <= q.w / 2 && Math.abs(ly) <= q.h / 2 ? t : Infinity;
    },
    pick(mx, my) {
      // keep the slab that is already out while the pointer stays on it
      if (this.hover && this.hover.op > .25 && this.hit(this.hover.pose, mx, my) < Infinity) return this.hover;
      let best = null, bt = Infinity;
      for (const p of this.planes) {
        if (p.op < .25) continue;
        const t = this.hit(p.base, mx, my);
        if (t < bt) { bt = t; best = p; }
      }
      return best;
    },

    /* ---------- hover label follows the pointer ---------- */
    setHover(p) {
      if (this.hover === p) return;
      this.hover = p;
      this.canvas.style.cursor = p ? 'pointer' : '';
      // no text label on hover: the frame itself slides out and clears
      this.lab.on = !!p;
    },
    updateLabel(dt) {
      if (!this.lab.on || !this.pointer || this.focus) return;
      this.lab.x = damp(this.lab.x, this.pointer.x, 22, dt);
      this.lab.y = damp(this.lab.y, this.pointer.y, 22, dt);
      this.labelEl.style.transform = `translate3d(${this.lab.x.toFixed(1)}px, ${(this.lab.y + 16).toFixed(1)}px, 0) translateX(-50%)`;
    },

    /* ---------- input ---------- */
    bind() {
      const c = this.canvas;
      c.addEventListener('pointerdown', e => {
        if (e.button > 0 || (!this.enabled && !this.focus)) return;
        this.drag = { x: e.clientX, y: e.clientY, moved: 0, active: false, hist: [], type: e.pointerType };
      });
      c.addEventListener('pointermove', e => {
        // hover (and its per-frame picking) only makes sense for a mouse; a lifted finger leaves no pointer
        this.pointer = e.pointerType === 'mouse' ? { x: e.clientX, y: e.clientY } : null;
        const d = this.drag;
        if (!d) { this.needPick = true; return; }
        const dx = e.clientX - d.x, dy = e.clientY - d.y;
        d.x = e.clientX; d.y = e.clientY;
        d.moved += Math.abs(dx) + Math.abs(dy);
        if (!this.enabled) return;
        if (!d.active && d.moved > 8) { d.active = true; this.stage.classList.add('is-dragging'); this.setHover(null); if (c.setPointerCapture) c.setPointerCapture(e.pointerId); }
        if (d.active) {
          // 1:1 along the line of slabs on screen
          const dt = (dx * this.slotPx.x + dy * this.slotPx.y) / this.slotPx.len;
          this.target -= dt;
          d.hist.push({ v: dt, t: performance.now() });
          if (d.hist.length > 10) d.hist.shift();
        }
      });
      const end = e => {
        const d = this.drag;
        this.drag = null;
        if (!d) return;
        if (d.active) {
          const now = performance.now(), recent = d.hist.filter(h => now - h.t < 110);
          if (recent.length > 1) {
            const span = Math.max(16, now - recent[0].t) / 1000;
            const v = recent.reduce((s, h) => s + h.v, 0) / span;      // slots per second
            this.target -= clamp(v * .998 / (1 - .998) / 1000, -5, 5);  // momentum projection
          }
          this.stage.classList.remove('is-dragging');
        } else if (d.moved < 8) {
          this.click(e.clientX, e.clientY, d.type);
        }
      };
      c.addEventListener('pointerup', end);
      c.addEventListener('pointercancel', () => { this.drag = null; this.stage.classList.remove('is-dragging'); });
      c.addEventListener('pointerleave', e => {
        if (e.pointerType !== 'mouse') return;
        this.pointer = null;
        if (!this.focus) this.setHover(null);
      });
    },
    click(x, y) {
      if (this.focus) {
        if (Focus.busy || performance.now() - Focus.t0 < 450) return;
        if (this.hit(this.focus.pose, x, y) < Infinity) Focus.open(); else Focus.exit();
        return;
      }
      if (!this.enabled) return;
      const p = this.pick(x, y);
      if (p) Focus.enter(p);
    },
    wheel(e) {
      let d = e.deltaY + e.deltaX;
      if (e.deltaMode === 1) d *= 32; else if (e.deltaMode === 2) d *= innerHeight;
      this.target -= clamp(d, -260, 260) / 200;
    },
    nudge(n) { this.target = Math.round(this.target) - n; },

    /* ---------- frame ---------- */
    tick(dt) {
      if (!this.ok || !this.visible || this.lost) return;
      const s0 = this.scroll;
      // while a finger is down follow it closely but smoothly (touch events arrive unevenly)
      this.scroll = Math.abs(this.target - this.scroll) < 1e-4 ? this.target : damp(this.scroll, this.target, this.drag && this.drag.active ? 22 : 7, dt);
      let anim = Math.abs(s0 - this.scroll) > 1e-6;
      const N = this.N;
      for (const p of this.planes) {
        const t = this.tStart + (((p.i - this.scroll) % N) + N) % N;
        p.t = t;
        const h0 = p.hov, l0 = p.ld;
        if (p !== this.focus) {
          const hv = this.hover === p ? 1 : 0;
          p.hov = Math.abs(p.hov - hv) < .002 ? hv : damp(p.hov, hv, 8, dt);
        }
        const lt = p.c.tex ? 1 : 0;
        p.ld = Math.abs(p.ld - lt) < .003 ? lt : damp(p.ld, lt, 5, dt);
        if (h0 !== p.hov || l0 !== p.ld) anim = true;
        this.stackPose(p, t, 0, p.base);
        if (p === this.focus) {
          const e = EASE_IO(this.focusP);
          this.lerpPose(this.focusFrom, this.focusTo, e, p.pose);
          p.pose.z -= Math.sin(Math.PI * e) * 4.5 * this.g.s;      // breathes back mid-flight
          const mp = EASE_IO(this.morphP);
          if (mp > 0) this.lerpPose(p.pose, this.morphTo, mp, p.pose);
          p.op = this.focusOp;
          p.frost = (1 - e) * (1 - p.hov);
          p.edge = e * (1 - mp);
          p.blur = 0;
          p.fog = (1 - e) * this.fogAt(t) * (1 - p.hov);
          p.rim = 1 - e;
        } else {
          this.stackPose(p, t, p.hov, p.pose);
          p.op = this.alpha(t) * this.presence;
          p.frost = 1 - p.hov;
          p.edge = 0;
          p.blur = this.blurAt(t) * (1 - p.hov) + this.haze * 6;
          p.fog = this.fogAt(t) * (1 - p.hov * .8) + this.haze * .55;
          p.rim = 1 - this.haze;
        }
      }
      if (this.enabled && this.pointer && !this.drag && (this.needPick || anim)) {
        this.needPick = false;
        this.setHover(this.pick(this.pointer.x, this.pointer.y));
      }
      this.updateLabel(dt);
      if (anim || this.dirty || this.lab.on || gsap.isTweening(this)) { this.render(); this.dirty = false; }
    },

    render() {
      const gl = this.gl, L = this.L, Z = this.g.Z;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this.prog);
      gl.uniformMatrix4fv(L.uProj, false, this.proj);
      gl.activeTexture(gl.TEXTURE0);
      const list = this.planes.filter(p => p.op > .003);
      for (const p of list) p.key = p === this.focus ? 1e9 : Z[0] * p.pose.x + Z[1] * p.pose.y + Z[2] * p.pose.z;
      list.sort((a, b) => a.key - b.key);
      for (const p of list) {
        const q = p.pose;
        gl.uniformMatrix4fv(L.uModel, false, this.modelFrom(q, this.model));
        const pa = q.w / q.h, ia = p.ratio;
        if (pa < ia) gl.uniform2f(L.uCover, pa / ia, 1); else gl.uniform2f(L.uCover, 1, ia / pa);
        gl.uniform2f(L.uSize, q.w, q.h);
        gl.uniform1f(L.uOpacity, p.op);
        gl.uniform1f(L.uFrost, p.frost);
        gl.uniform1f(L.uEdge, p.edge);
        gl.uniform1f(L.uBlur, p.blur);
        gl.uniform1f(L.uFog, Math.min(p.fog, .92));
        gl.uniform1f(L.uLoaded, p.ld);
        gl.uniform1f(L.uRim, p.rim);
        gl.bindTexture(gl.TEXTURE_2D, p.c.tex || this.blank);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    },

    /* ---------- presence ---------- */
    show(intro) {
      this.visible = true;
      this.stage.classList.remove('is-off');
      gsap.killTweensOf(this, 'presence,push,haze');
      if (intro && !reduced()) {
        // rack focus: the line arrives soft and close, then settles sharp
        this.push = 9; this.haze = .8; this.presence = 0;
        gsap.to(this, { presence: 1, duration: 1.2, ease: 'power1.out' });
        gsap.to(this, { push: 0, haze: 0, duration: 2.6, ease: EASE_OUT });
      } else {
        gsap.to(this, { presence: 1, push: 0, haze: 0, duration: 1.2, ease: EASE_OUT, delay: .05 });
      }
      this.enabled = !this.focus;
      this.needPick = true;
    },
    hide() {
      this.enabled = false;
      this.setHover(null);
      this.stage.classList.add('is-off');
      gsap.killTweensOf(this, 'presence');
      gsap.to(this, { presence: 0, duration: .55, ease: 'power1.out', onComplete: () => { if (!this.focus) this.visible = false; } });
    }
  };

  /* ==========================================================================
     FOCUS — the chosen slab turns to face you; the rest rush past
     ========================================================================== */
  const Hint = { el: $('#hint'), set(on, text) { if (text) this.el.textContent = text; this.el.classList.toggle('is-on', !!on); } };
  const Switch = { set() {}, view() {} };   // Overview / Index switch removed from the page

  const Focus = {
    busy: false, leaving: false, wheelAcc: 0, wheelT: 0, t0: 0,
    enter(p) {
      if (Deck.focus || !Deck.enabled || Router.cur.name !== 'overview') return;
      Deck.enabled = false;
      Deck.target = Deck.scroll;
      Deck.setHover(null);
      Deck.focus = p;
      Deck.focusFrom = Object.assign({}, p.pose);
      Deck.focusTo = Deck.focusPose(p);
      Deck.focusOp = 1; Deck.morphP = 0; Deck.focusP = 0;
      this.busy = true; this.leaving = false; this.wheelAcc = 0; this.t0 = performance.now();
      gsap.killTweensOf(Deck, 'focusP,morphP,presence,push,haze');
      gsap.to(Deck, { focusP: 1, duration: 1.2, ease: EASE_IO, onComplete: () => { this.busy = false; } });
      gsap.to(Deck, { push: 24, haze: 1, presence: .028, duration: 1.15, ease: EASE_IO });
      Switch.set(false);
      Hint.set(true, isTouch() ? 'Tap to open' : 'Scroll to open');
    },
    exit() {
      if (!Deck.focus || this.busy) return;
      this.busy = true; this.leaving = true;
      Hint.set(false);
      gsap.killTweensOf(Deck, 'presence,push,haze');
      gsap.to(Deck, { focusP: 0, duration: 1.1, ease: EASE_IO, onComplete: () => {
        Deck.focus = null; this.busy = false; this.leaving = false;
        Deck.enabled = Router.cur.name === 'overview';
        Deck.needPick = true;
      } });
      gsap.to(Deck, { push: 0, haze: 0, presence: 1, duration: 1.1, ease: EASE_IO });
      Switch.set(true);
    },
    open() {
      if (!Deck.focus || this.busy) return;
      Router.go(Deck.focus.p.slug, { from: 'focus' });
    },
    wheel(e) {
      if (this.busy) return;
      const now = performance.now();
      if (now - this.wheelT > 350) this.wheelAcc = 0;
      this.wheelT = now;
      this.wheelAcc += e.deltaY * (e.deltaMode === 1 ? 32 : 1);
      if (this.wheelAcc > 50) { this.wheelAcc = 0; this.open(); }
      else if (this.wheelAcc < -50) { this.wheelAcc = 0; this.exit(); }
    },
    /* the lifted slab settles into the first cell of the project grid */
    land(cell, done) {
      const p = Deck.focus;
      if (!p) { done(); return; }
      this.busy = true;
      Hint.set(false);
      Deck.morphTo = Deck.rectPose(cell.getBoundingClientRect(), -Deck.focusTo.z);
      gsap.killTweensOf(Deck, 'presence');
      gsap.to(Deck, { presence: 0, duration: .6, ease: 'power1.out' });
      gsap.to(Deck, { morphP: 1, duration: 1.05, ease: EASE_IO, onComplete: () => {
        done();
        gsap.to(Deck, { focusOp: 0, duration: .25, delay: .05, onComplete: () => this.reset() });
      } });
    },
    reset() {
      gsap.killTweensOf(Deck, 'focusP,morphP,focusOp');
      Deck.focus = null; Deck.focusP = 0; Deck.morphP = 0; Deck.focusOp = 1;
      this.busy = false; this.leaving = false;
      Hint.set(false);
      Deck.dirty = true;
    }
  };

  /* ==========================================================================
     VIEWS — shared open / close + smooth scroll
     ========================================================================== */
  const Views = {
    lenis: new Map(),
    open(view, delay = .1) {
      view._open = true;
      view.classList.add('is-active');
      view.setAttribute('aria-hidden', 'false');
      view.scrollTop = 0;
      gsap.killTweensOf(view);
      gsap.fromTo(view, { opacity: 0 }, { opacity: 1, duration: .5, ease: 'power1.out', delay });
      this.startLenis(view);
    },
    close(view) {
      view._open = false;
      view.setAttribute('aria-hidden', 'true');
      this.stopLenis(view);
      gsap.killTweensOf(view);
      gsap.to(view, { opacity: 0, duration: .35, ease: 'power1.out', onComplete: () => { if (!view._open) view.classList.remove('is-active'); } });
    },
    startLenis(view) {
      if (this.lenis.has(view) || isTouch() || reduced() || typeof window.Lenis !== 'function') return;
      const content = Array.from(view.children).find(el => el.classList.contains('view__inner')) || view.firstElementChild;
      try { this.lenis.set(view, new window.Lenis({ wrapper: view, content, lerp: .1, smoothWheel: true })); } catch (e) { /* native scroll */ }
    },
    stopLenis(view) { const l = this.lenis.get(view); if (l) { l.destroy(); this.lenis.delete(view); } },
    toTop(view) { view.scrollTop = 0; const l = this.lenis.get(view); if (l) { l.scrollTo(0, { immediate: true, force: true }); l.resize(); } },
    raf(ms) { this.lenis.forEach(l => l.raf(ms)); }
  };

  /* ==========================================================================
     INDEX — table + top-right preview
     ========================================================================== */
  const Preview = {
    el: $('#preview'), cur: null, imgs: new Map(),
    show(p) {
      const m = p.media[0];
      let im = this.imgs.get(m);
      if (!im) { im = makeImg(m, { size: 'md', alt: '' }); this.el.append(im); this.imgs.set(m, im); }
      if (this.cur && this.cur !== im) this.cur.classList.remove('is-cur');
      this.cur = im;
      im.classList.add('is-cur');
    },
    hide() { if (this.cur) this.cur.classList.remove('is-cur'); this.cur = null; }
  };

  const IndexView = {
    view: $('#view-index'), list: $('#indexList'), built: false,
    build() {
      this.list.innerHTML = P.map(p => `
        <a class="idx-row" href="#${esc(p.slug)}" data-slug="${esc(p.slug)}">
          <span>${esc(p.category)}</span><span>${esc(p.title)}</span><span>${esc(p.subtitle || '')}</span>
        </a>`).join('');
      $$('.idx-row', this.list).forEach(r => {
        const p = bySlug[r.dataset.slug];
        r.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; r.classList.add('is-hover'); Preview.show(p); });
        r.addEventListener('pointerleave', () => { r.classList.remove('is-hover'); Preview.hide(); });
        r.addEventListener('focus', () => { r.classList.add('is-hover'); Preview.show(p); });
        r.addEventListener('blur', () => { r.classList.remove('is-hover'); Preview.hide(); });
        r.addEventListener('click', e => { e.preventDefault(); Router.go(p.slug); });
      });
      this.built = true;
    },
    show() {
      if (!this.built) this.build();
      Views.open(this.view, .2);
      const rows = $$('.idx-row', this.view);
      gsap.fromTo(rows, { opacity: 0 }, { opacity: (i, el) => (el.classList.contains('idx-head') ? 1 : .3), duration: .5, ease: 'power1.out', stagger: .05, delay: .35, clearProps: 'opacity' });
    },
    hide() { Preview.hide(); Views.close(this.view); }
  };

  /* ==========================================================================
     FRAMES — full-bleed contact sheet
     ========================================================================== */
  const Frames = {
    view: $('#view-frames'), grid: $('#framesGrid'), built: false,
    build() {
      const frag = document.createDocumentFragment();
      FRAMES.forEach((m, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'frame';
        b.dataset.frame = i;
        b.dataset.list = 'all';
        b.setAttribute('aria-label', `${m.project.title}, frame ${m.n} — enlarge`);
        const t = document.createElement('div');
        t.className = 'tile';
        t.style.aspectRatio = m.ratio;
        t.append(makeImg(m, { size: 'md', sizes: '(max-width: 760px) 50vw, (max-width: 1023px) 34vw, 20vw', lazy: true, alt: '' }));
        b.append(t);
        frag.append(b);
      });
      this.grid.append(frag);
      this.built = true;
    },
    show() {
      if (!this.built) this.build();
      Views.open(this.view);
      gsap.fromTo($$('.frame', this.grid).slice(0, 35), { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power1.out', stagger: .025, delay: .3, clearProps: 'opacity' });
    },
    hide() { Views.close(this.view); }
  };

  /* ==========================================================================
     STUDIO — text, lists and a dithered frame that dissolves between shots
     ========================================================================== */
  const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  const Halftone = {
    cv: $('#halftone'), ctx: null, on: false, raf: 0, timer: 0, k: -1, src: [],
    cols: 0, rows: 0, cell: 3, cur: null, nxt: null, rnd: null,
    sources() {
      if (this.src.length) return this.src;
      const seen = new Set();
      Deck.cache.forEach(c => { if (c.img && !seen.has(c.img)) { seen.add(c.img); this.src.push(c.img); } });
      if (!this.src.length) P.forEach(p => { const im = new Image(); im.crossOrigin = 'anonymous'; im.src = p.media[0].md; this.src.push(im); });
      return this.src;
    },
    resize() {
      const r = this.cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.cv.width = Math.max(1, Math.round(r.width * dpr));
      this.cv.height = Math.max(1, Math.round(r.height * dpr));
      this.cell = Math.max(2, Math.round(1.6 * dpr));
      this.cols = Math.ceil(this.cv.width / this.cell);
      this.rows = Math.ceil(this.cv.height / this.cell);
      this.ctx = this.cv.getContext('2d');
      this.buf = document.createElement('canvas');
      this.buf.width = this.cols; this.buf.height = this.rows;
      this.bctx = this.buf.getContext('2d', { willReadFrequently: true });
      this.out = this.bctx.createImageData(this.cols, this.rows);
      this.rnd = new Float32Array(this.cols * this.rows);
      for (let i = 0; i < this.rnd.length; i++) this.rnd[i] = Math.random();
      this.cur = this.k >= 0 ? this.dither(this.sources()[this.k]) : null;
      this.nxt = null;
      this.paint(1);
    },
    dither(img) {
      if (!img || !img.complete || !img.naturalWidth) return null;
      const { cols, rows, bctx } = this;
      const ia = img.naturalWidth / img.naturalHeight, ca = cols / rows;
      let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
      if (ia > ca) { sw = sh * ca; sx = (img.naturalWidth - sw) / 2; } else { sh = sw / ca; sy = (img.naturalHeight - sh) / 2; }
      try {
        bctx.clearRect(0, 0, cols, rows);
        bctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
        const d = bctx.getImageData(0, 0, cols, rows).data;
        const out = new Uint8Array(cols * rows);
        for (let y = 0, i = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++, i++) {
            const j = i * 4;
            let l = (d[j] * .299 + d[j + 1] * .587 + d[j + 2] * .114) / 255;
            l = clamp((Math.pow(l, .72) - .5) * 1.35 + .56, 0, 1);
            out[i] = l < (BAYER[(y & 7) * 8 + (x & 7)] + .5) / 64 ? 1 : 0;
          }
        }
        return out;
      } catch (e) { return null; }
    },
    paint(p) {
      if (!this.ctx) return;
      const d = this.out.data, a = this.cur, b = this.nxt, rnd = this.rnd;
      for (let i = 0, j = 0; i < rnd.length; i++, j += 4) {
        const on = b && rnd[i] < p ? b[i] : (a ? a[i] : 0);
        d[j + 3] = on ? 255 : 0;
      }
      this.bctx.putImageData(this.out, 0, 0);
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
      this.ctx.drawImage(this.buf, 0, 0, this.cols * this.cell, this.rows * this.cell);
    },
    next() {
      const s = this.sources();
      if (!s.length) return;
      for (let tries = 0; tries < s.length; tries++) {
        const k = (this.k + 1 + tries) % s.length;
        const m = this.dither(s[k]);
        if (!m) continue;
        this.k = k;
        if (!this.cur) { this.cur = m; this.paint(1); return; }
        this.nxt = m;
        const t0 = performance.now(), dur = 1500;
        cancelAnimationFrame(this.raf);
        const run = now => {
          if (!this.on) return;
          const p = Math.min(1, (now - t0) / dur);
          this.paint(p);
          if (p < 1) this.raf = requestAnimationFrame(run);
          else { this.cur = this.nxt; this.nxt = null; }
        };
        this.raf = requestAnimationFrame(run);
        return;
      }
    },
    start() {
      if (this.on) return;
      this.on = true;
      this.resize();
      if (!this.cur) this.next();
      this.timer = setInterval(() => this.next(), 5200);
    },
    stop() { this.on = false; clearInterval(this.timer); cancelAnimationFrame(this.raf); if (this.nxt) { this.cur = this.nxt; this.nxt = null; } }
  };

  const Studio = {
    view: $('#view-studio'), inner: $('#studioInner'), built: false,
    build() {
      const clients = [...new Set(P.map(p => p.client).filter(Boolean))];
      const group = (name, items) => `<div class="studio__group"><span class="studio__label">${name}</span><span class="studio__items">${items.join('')}</span></div>`;
      this.inner.innerHTML = `
        <div class="studio">
          <p class="studio__text">${esc(D.bio)} ${esc(D.tagline)}</p>
          <div class="studio__lists">
            ${group('Clients', clients.map(c => `<span>${esc(c)}</span>`))}
            ${group('Services', (D.services || []).map(s => `<span>${esc(s)}</span>`))}
            ${group('Studio', [`<span>${esc(D.studio)}</span>`, `<span>${esc(D.city)}</span>`])}
            ${group('Contact', [`<a href="mailto:${esc(D.email)}">${esc(D.email)}</a>`, `<a href="${esc(D.whatsappLink)}" target="_blank" rel="noopener">WhatsApp ${esc(D.whatsapp)}</a>`])}
            ${group('Elsewhere', (D.socials || []).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`))}
          </div>
        </div>`;
      this.built = true;
    },
    show() {
      if (!this.built) this.build();
      Views.open(this.view);
      Halftone.start();
      gsap.fromTo(Halftone.cv, { opacity: 0 }, { opacity: 1, duration: .9, ease: 'power1.out', delay: .3 });
      gsap.fromTo($$('.studio__text, .studio__group', this.inner), { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power1.out', stagger: .06, delay: .25, clearProps: 'opacity' });
    },
    hide() { Halftone.stop(); Views.close(this.view); }
  };

  /* ==========================================================================
     PROJECT — title and text, two-column grid, next project
     ========================================================================== */
  const Project = {
    view: $('#view-project'), inner: $('#projectInner'), p: null, landing: false,
    render(p, hero) {
      this.p = p;
      const first = hero || p.media[0];
      const order = [first].concat(p.media.filter(m => m !== first));
      const next = P[(p.i + 1) % P.length];
      const more = (p.body || []).length;
      this.inner.innerHTML = `
        <article class="p">
          <header class="p-head"><div class="p-head__in">
            <h1 class="p-title">${esc(label(p))}</h1>
            <div class="p-desc">
              <p>${esc(p.lead || '')}</p>
              ${more ? `<div class="p-more" hidden>${p.body.map(t => `<p>${esc(t)}</p>`).join('')}</div><button class="p-more-btn" type="button" data-more>Read more</button>` : ''}
            </div>
          </div></header>
          <section class="p-grid" id="pGrid"></section>
          <a class="p-next" href="#${esc(next.slug)}" data-route="${esc(next.slug)}"><span>Next project</span><span>${esc(label(next))}</span></a>
        </article>`;
      const grid = $('#pGrid', this.inner);
      order.forEach((m, k) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.aspectRatio = m.ratio;
        cell.dataset.frame = m.g;
        cell.dataset.list = 'project';
        if (k === 0) {
          // starts on the exact file the stack already decoded, then sharpens
          const im = makeImg(m, { size: 'md', cors: true });
          if (m.lg !== m.md) { const pre = new Image(); pre.onload = () => { if (im.isConnected) im.src = m.lg; }; pre.src = m.lg; }
          cell.append(im);
        } else {
          cell.append(makeImg(m, { lazy: k > 3, size: 'lg', sizes: '(max-width: 760px) 100vw, 50vw' }));
        }
        grid.append(cell);
      });
      (p.films || []).forEach((url, k) => {
        const f = document.createElement('div');
        f.className = 'cell cell--film';
        f.dataset.film = url;
        f.innerHTML = `<button class="glass film-play" type="button" aria-label="Play film ${k + 1} of ${esc(p.title)}">Play film ${pad(k + 1)}</button>`;
        grid.insertBefore(f, grid.children[Math.min(grid.children.length, 2 + k)] || null);
      });
      document.title = `${label(p)} — Khezez`;
    },
    play(cell) {
      if (cell.classList.contains('is-playing')) return;
      const url = cell.dataset.film;
      cell.classList.add('is-playing');
      cell.innerHTML = `<iframe src="${esc(url)}" title="${esc(this.p ? this.p.title : '')} film" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    },
    show() {
      this.view._open = true;
      this.view.classList.add('is-active');
      this.view.setAttribute('aria-hidden', 'false');
      gsap.killTweensOf(this.view);
    },
    textIn(delay) {
      gsap.fromTo($$('.p-title, .p-desc', this.inner), { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power1.out', stagger: .08, delay });
    },
    open(p, opts = {}) {
      const landing = opts.from === 'focus' && Deck.focus && Deck.focus.p === p;
      this.render(p, landing ? Deck.focus.m : null);
      this.show();
      this.view.scrollTop = 0;
      if (landing) {
        const grid = $('#pGrid', this.inner), cell = grid.firstElementChild;
        this.landing = true;
        this.view.classList.add('is-landing');
        grid.classList.add('is-waiting');
        cell.classList.add('is-hidden');
        gsap.set(this.view, { opacity: 1 });
        this.textIn(.35);
        Focus.land(cell, () => {
          cell.classList.remove('is-hidden');
          this.view.classList.remove('is-landing');
          grid.classList.remove('is-waiting');
          this.landing = false;
          Views.startLenis(this.view);
          Deck.hide();
        });
      } else {
        Views.startLenis(this.view);
        Views.toTop(this.view);
        gsap.fromTo(this.view, { opacity: 0 }, { opacity: 1, duration: .55, ease: 'power1.out', delay: .1 });
        this.textIn(.3);
      }
    },
    swap(p) {
      gsap.killTweensOf(this.inner);
      gsap.to(this.inner, { opacity: 0, duration: .35, ease: 'power1.out', onComplete: () => {
        this.render(p);
        Views.toTop(this.view);
        gsap.to(this.inner, { opacity: 1, duration: .45, ease: 'power1.out' });
        this.textIn(.15);
      } });
    },
    close() {
      this.view._open = false;
      this.landing = false;
      this.view.setAttribute('aria-hidden', 'true');
      Views.stopLenis(this.view);
      gsap.killTweensOf(this.view);
      gsap.to(this.view, { opacity: 0, duration: .45, ease: 'power1.out', onComplete: () => {
        if (this.view._open) return;
        this.view.classList.remove('is-active', 'is-landing');
        this.inner.innerHTML = '';
        this.p = null;
      } });
    }
  };

  /* ==========================================================================
     CONTACT
     ========================================================================== */
  const Contact = {
    el: $('#contact'), isOpen: false, built: false,
    build() {
      const ig = (D.socials || []).find(s => /instagram/i.test(s.label));
      $('#contactRow').innerHTML = `
        <a class="glass pill pill--sq" href="mailto:${esc(D.email)}"><span>${esc(D.email)}</span></a>
        <a class="glass pill" href="${esc(D.whatsappLink)}" target="_blank" rel="noopener"><span>WhatsApp</span></a>
        ${ig ? `<a class="glass pill" href="${esc(ig.url)}" target="_blank" rel="noopener"><span>Instagram</span></a>` : ''}
        <span class="glass pill"><span>${esc(D.studio)}, ${esc(D.city)}</span></span>`;
      $('#contactLinks').innerHTML = (D.socials || []).filter(s => s !== ig).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('');
      this.built = true;
    },
    open() {
      if (this.isOpen) return;
      if (!this.built) this.build();
      this.isOpen = true;
      Deck.setHover(null);
      this.el.classList.add('is-open');
      this.el.setAttribute('aria-hidden', 'false');
      gsap.killTweensOf(this.el);
      gsap.to(this.el, { opacity: 1, duration: .4, ease: 'power1.out' });
      gsap.fromTo($$('.pill, .contact__links', this.el), { opacity: 0 }, { opacity: 1, duration: .35, stagger: .04, delay: .1, clearProps: 'opacity' });
      Nav.set('contact');
    },
    close(instant) {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.el.setAttribute('aria-hidden', 'true');
      gsap.killTweensOf(this.el);
      gsap.to(this.el, { opacity: 0, duration: instant ? 0 : .3, ease: 'power1.out', onComplete: () => { if (!this.isOpen) this.el.classList.remove('is-open'); } });
      Nav.set(Router.cur.name);
    },
    toggle() { if (this.isOpen) this.close(); else this.open(); }
  };

  /* ==========================================================================
     LIGHTBOX
     ========================================================================== */
  const Lightbox = {
    el: $('#lightbox'), img: $('#lbImg'), cap: $('#lbCap'), count: $('#lbCount'), list: [], i: 0, isOpen: false, sx: 0,
    init() {
      this.img.addEventListener('load', () => this.img.classList.add('is-loaded'));
      this.el.addEventListener('click', e => {
        const b = e.target.closest('[data-lb]');
        if (!b) return;
        const a = b.dataset.lb;
        if (a === 'close') this.close(); else this.step(a === 'next' ? 1 : -1);
      });
      this.el.addEventListener('touchstart', e => { this.sx = e.touches[0].clientX; }, { passive: true });
      this.el.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - this.sx; if (Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1); });
    },
    open(list, i) {
      this.list = list; this.i = Math.max(0, i); this.isOpen = true;
      this.el.classList.add('is-open');
      this.el.setAttribute('aria-hidden', 'false');
      gsap.killTweensOf(this.el);
      gsap.to(this.el, { opacity: 1, duration: .35, ease: 'power1.out' });
      this.render();
    },
    render() {
      const m = this.list[this.i];
      if (!m) return;
      if (this.img.getAttribute('src') !== m.lg) { this.img.classList.remove('is-loaded'); this.img.src = m.lg; }
      else if (this.img.complete) this.img.classList.add('is-loaded');
      this.img.alt = `${m.project.title}, frame ${m.n}`;
      this.cap.textContent = label(m.project);
      this.count.textContent = `${this.i + 1} / ${this.list.length}`;
      [1, -1].forEach(d => { const n = this.list[(this.i + d + this.list.length) % this.list.length]; if (n) { const pre = new Image(); pre.src = n.lg; } });
    },
    step(d) { if (!this.list.length) return; this.i = (this.i + d + this.list.length) % this.list.length; this.render(); },
    close(instant) {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.el.setAttribute('aria-hidden', 'true');
      gsap.killTweensOf(this.el);
      gsap.to(this.el, { opacity: 0, duration: instant ? 0 : .25, onComplete: () => { if (!this.isOpen) this.el.classList.remove('is-open'); } });
    }
  };

  /* ==========================================================================
     NAV + LOADER
     ========================================================================== */
  const Nav = {
    set(name) {
      const map = { overview: 'work', index: 'work', frames: 'frames', studio: 'studio', contact: 'contact' };
      const key = map[name] || '';
      $$('.nav [data-nav]').forEach(a => a.classList.toggle('is-active', a.dataset.nav === key));
    }
  };

  const Loader = {
    el: $('#loader'), pct: $('#loaderPct'), p: 0, target: 0, t0: performance.now(), done: false, onDone: null,
    set(v) { this.target = Math.max(this.target, v); },
    tick(dt) {
      if (this.done || !this.el) return;
      const elapsed = (performance.now() - this.t0) / 1000;
      if (elapsed > 10) this.target = 1;
      const goal = Math.min(this.target, elapsed / 1.1);
      this.p = damp(this.p, Math.min(1, goal), 5, dt);
      if (goal >= 1 && this.p > .99) this.p = 1;
      this.pct.textContent = Math.round(this.p * 100) + '%';
      if (this.p >= 1) this.finish();
    },
    finish() {
      if (this.done) return;
      this.done = true;
      if (this.onDone) this.onDone();
      gsap.to(this.el, { opacity: 0, duration: .6, ease: 'power1.out', delay: .1, onComplete: () => { this.el.remove(); this.el = null; } });
    }
  };

  /* ==========================================================================
     ROUTER — #index · #frames · #studio · #<project-slug>
     ========================================================================== */
  const TITLE = document.title;
  const Router = {
    cur: { name: null },
    parse() {
      let h = location.hash.replace(/^#\/?/, '');
      try { h = decodeURIComponent(h); } catch (e) { /* raw */ }
      h = h.toLowerCase().trim();
      if (!h || h === 'work' || h === 'overview' || h === 'projects') return { name: Deck.ok ? 'overview' : 'index' };
      if (h === 'index' || h === 'frames' || h === 'studio') return { name: h };
      if (bySlug[h]) return { name: 'project', slug: bySlug[h].slug };
      return { name: Deck.ok ? 'overview' : 'index' };
    },
    key(r) { return r.name + (r.slug ? ':' + r.slug : ''); },
    go(path, opts) {
      const hash = path ? '#' + path : '';
      if (location.hash !== hash) {
        try { history.pushState(null, '', hash || (location.pathname + location.search)); }
        catch (e) { location.hash = hash; return; }
      }
      const next = this.parse();
      if (this.key(next) === this.key(this.cur)) {
        if (next.name === 'overview' && Deck.focus) Focus.exit();
        Contact.close();
        return;
      }
      this.apply(next, opts);
    },
    apply(next, opts = {}) {
      if (this.key(next) === this.key(this.cur)) return;
      const prev = this.cur;
      this.cur = next;
      Contact.close(true);
      Lightbox.close(true);
      if (prev.name === 'overview' && Deck.focus && !(next.name === 'project' && opts.from === 'focus')) Focus.reset();
      if (prev.name === 'index') IndexView.hide();
      if (prev.name === 'frames') Frames.hide();
      if (prev.name === 'studio') Studio.hide();
      if (prev.name === 'project' && next.name !== 'project') Project.close();

      switch (next.name) {
        case 'overview': Deck.show(opts.intro); document.title = TITLE; break;
        case 'index': Deck.hide(); IndexView.show(); document.title = 'Index — Khezez'; break;
        case 'frames': Deck.hide(); Frames.show(); document.title = 'Frames — Khezez'; break;
        case 'studio': Deck.hide(); Studio.show(); document.title = 'Studio — Khezez'; break;
        case 'project': {
          const p = bySlug[next.slug];
          if (prev.name === 'project') Project.swap(p);
          else { if (opts.from !== 'focus') Deck.hide(); Project.open(p, opts); }
          break;
        }
      }
      Switch.set((next.name === 'overview' && !Deck.focus) || next.name === 'index');
      Switch.view(next.name);
      if (next.name !== 'overview') Hint.set(false);
      Nav.set(next.name);
    }
  };

  /* ==========================================================================
     GLOBAL EVENTS
     ========================================================================== */
  function bindGlobal() {
    addEventListener('popstate', () => { if (Loader.done) Router.apply(Router.parse()); });
    addEventListener('hashchange', () => { if (Loader.done) Router.apply(Router.parse()); });

    document.addEventListener('click', e => {
      if (e.defaultPrevented) return;
      const t = e.target;
      const route = t.closest('[data-route]');
      if (route) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
        e.preventDefault();
        Router.go(route.dataset.route);
        return;
      }
      if (t.closest('[data-contact]')) { e.preventDefault(); Contact.toggle(); return; }
      if (Contact.isOpen && !t.closest('a')) { Contact.close(); return; }
      const more = t.closest('[data-more]');
      if (more) {
        const box = more.previousElementSibling;
        box.hidden = !box.hidden;
        more.textContent = box.hidden ? 'Read more' : 'Read less';
        const l = Views.lenis.get(Project.view);
        if (l) l.resize();
        return;
      }
      const film = t.closest('[data-film]');
      if (film) { Project.play(film); return; }
      const fr = t.closest('[data-frame]');
      if (fr) {
        const m = FRAMES[+fr.dataset.frame];
        if (!m) return;
        const list = fr.dataset.list === 'all' ? FRAMES : m.project.media;
        Lightbox.open(list, list.indexOf(m));
      }
    });

    addEventListener('keydown', e => {
      const name = Router.cur.name;
      if (e.key === 'Escape') {
        if (Lightbox.isOpen) return Lightbox.close();
        if (Contact.isOpen) return Contact.close();
        if (Deck.focus) return Focus.exit();
        if (name && name !== 'overview' && Deck.ok) return Router.go('');
        return;
      }
      if (Lightbox.isOpen) {
        if (e.key === 'ArrowRight') Lightbox.step(1);
        if (e.key === 'ArrowLeft') Lightbox.step(-1);
        return;
      }
      if (name !== 'overview' || Contact.isOpen || !Deck.ok) return;
      if (Deck.focus) {
        if (e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); Focus.open(); }
        if (e.key === 'ArrowUp' || e.key === 'Backspace') { e.preventDefault(); Focus.exit(); }
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); Deck.nudge(1); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); Deck.nudge(-1); }
      if (e.key === 'Enter') {
        const aim = Deck.tMin + 2.5;
        const front = Deck.hover || Deck.planes.filter(p => p.op > .5).sort((a, b) => Math.abs(a.t - aim) - Math.abs(b.t - aim))[0];
        if (front) Focus.enter(front);
      }
    });

    addEventListener('wheel', e => {
      if (Project.landing) { e.preventDefault(); return; }
      if (Router.cur.name !== 'overview' || Contact.isOpen || Lightbox.isOpen || !Deck.ok) return;
      e.preventDefault();
      if (Deck.focus) Focus.wheel(e); else if (Deck.enabled) Deck.wheel(e);
    }, { passive: false, capture: true });

    let rz = 0;
    addEventListener('resize', () => {
      clearTimeout(rz);
      rz = setTimeout(() => {
        if (Deck.ok) Deck.layout();
        if (Studio.view._open) Halftone.resize();
      }, 120);
    });
  }

  /* ==========================================================================
     BOOT
     ========================================================================== */
  function loop(time, deltaTime) {
    const dt = Math.min((deltaTime || 16) / 1000, .05);
    Loader.tick(dt);
    Deck.tick(dt);
    Views.raf(time * 1000);
  }

  function boot() {
    Lightbox.init();
    bindGlobal();
    if (Deck.init()) Deck.loadImages(f => Loader.set(f));
    else { $('#stage').style.display = 'none'; Loader.set(1); }
    Loader.onDone = () => Router.apply(Router.parse(), { intro: true });
    gsap.ticker.add(loop);
    if (/[?&]debug\b/.test(location.search)) window.__khz = { Deck, Focus, Router, Project, Loader, Halftone };
  }

  boot();
})();
