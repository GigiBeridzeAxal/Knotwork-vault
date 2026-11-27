/* Film v5 core. window.seek(t) draws the film at time t (seconds) as a pure function of t.
   Every time comes from timeline.js and acts/*.tl.js. API for the acts: CORE.md. */
(function () {
  'use strict';
  const TL = window.TL, FX = TL.fx, FPS = TL.fps, W = 1280, H = 720;
  const ONLY = new URLSearchParams(location.search).get('only');

  // ---------- math ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ramp = (t, a, d) => (d <= 0 ? (t >= a ? 1 : 0) : clamp((t - a) / d));
  const back = c => p => 1 + (c + 1) * (p - 1) ** 3 + c * (p - 1) ** 2;
  const EASE = {
    linear: p => p,
    outExpo: p => (p >= 1 ? 1 : 1 - 2 ** (-10 * p)),
    outQuint: p => 1 - (1 - p) ** 5,
    inQuint: p => p ** 5,
    inCubic: p => p * p * p,
    inOutCubic: p => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2),
    inOutQuint: p => (p < 0.5 ? 16 * p ** 5 : 1 - (-2 * p + 2) ** 5 / 2),
    outBack: back(2.2),
  };
  const ease = e => (typeof e === 'function' ? e : EASE[e || 'outExpo']);
  const rand = i => {
    let x = Math.imul((i | 0) ^ 0x9E3779B9, 0x85EBCA6B);
    x ^= x >>> 13; x = Math.imul(x, 0xC2B2AE35); x ^= x >>> 16;
    return (x >>> 0) / 4294967296;
  };
  const f2 = n => n.toFixed(2);
  const chars = s => Array.from(s);
  const GEO = /[Ⴀ-ჿᲐ-Ჿ]/;

  // ---------- timeline ----------
  const SH = {}, ACTS = [], cues = [];
  let accF = 0;
  for (const id of TL.order) {
    const def = TL.acts[id];
    if (!def) throw new Error(`timeline: act ${id} has no ${id}.tl.js`);
    const a = { id, t0: accF / FPS, shots: [], worlds: [], kicks: [] };
    for (const s of def.shots) {
      if (SH[s.id]) throw new Error(`timeline: shot ${s.id} twice`);
      const lead = s.lead ?? TL.lead, n = Math.ceil(Math.max(s.vis, lead + s.dur + (s.tail ?? TL.tail)) * FPS - 1e-6);
      const t = accF / FPS;
      SH[s.id] = { s, id: s.id, t, len: n / FPS, lead, a, at: {} };
      a.shots.push(SH[s.id]);
      cues.push({ id: s.id, act: id, t: +t.toFixed(4), voiceAt: +(t + lead).toFixed(4), dur: s.dur });
      accF += n;
    }
    a.t1 = accF / FPS;
    ACTS.push(a);
  }
  const LEN = accF / FPS;
  const shot = id => { const s = SH[id]; if (!s) throw new Error(`timeline: no shot ${id}`); return s; };
  function when(id, v) {
    const s = shot(id);
    if (Array.isArray(v)) return Math.max(...v.map(x => when(id, x)));
    if (typeof v === 'number') return v < 0 ? s.t + s.len + v : s.t + v;
    const m = /^(v?)([\d.]+%|[a-zA-Z]\w*)([+-][\d.]+)?$/.exec(v);
    if (!m) throw new Error(`timeline: bad time ${id} ${v}`);
    const off = +m[3] || 0;
    if (!m[2].endsWith('%')) return T(id, m[2]) + off;
    const f = parseFloat(m[2]) / 100;
    return (m[1] ? s.t + s.lead + f * s.s.dur : s.t + f * s.len) + off;
  }
  function T(id, k) {
    const s = shot(id), c = s.at;
    if (!(k in c)) {
      const v = (s.s.at || {})[k];
      if (v == null) throw new Error(`timeline: ${id}.${k} missing`);
      c[k] = NaN;
      c[k] = when(id, v);
      if (Number.isNaN(c[k])) throw new Error(`timeline: ${id}.${k} refers to itself`);
    }
    return c[k];
  }
  const S = id => { const s = shot(id); return { t0: s.t, t1: s.t + s.len, v0: s.t + s.lead, v1: s.t + s.lead + s.s.dur, dur: s.s.dur }; };
  const evt = (a, k) => { for (const s of a.shots) if (s.s.at && k in s.s.at) return T(s.id, k); return null; };
  const actAt = t => { let a = ACTS[0]; for (const x of ACTS) if (x.t0 <= t) a = x; return a; };

  // ---------- DOM helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const css = (e, k, v) => { if (e.style[k] !== v) e.style[k] = v; };
  const cssv = (e, k, v) => { if (e.style.getPropertyValue(k) !== v) e.style.setProperty(k, v); };
  const txt = (e, s) => { if (e.textContent !== s) e.textContent = s; };
  const vis = (e, on) => css(e, 'visibility', on ? '' : 'hidden');
  const el = (tag, cls, html) => { const e = document.createElement(tag); e.className = cls; if (html) e.innerHTML = html; return e; };
  const ERR = new Set();
  function run(a, f, ...args) {
    try { return f && f.apply(a.def, args); } catch (e) {
      const m = `${a.id}: ${e.message}`;
      if (!ERR.has(m)) { ERR.add(m); console.error(m + '\n' + e.stack); }
    }
  }
  // layout offsets relative to `stop` (scroll set by K.scroll counted, other transforms not)
  const SC = new Map();
  function box(e, stop) {
    let x = 0, y = 0, n = e;
    while (n && n !== stop) {
      x += n.offsetLeft; y += n.offsetTop;
      if (SC.has(n)) y -= SC.get(n);
      n = n.offsetParent;
    }
    return { x, y, w: e.offsetWidth, h: e.offsetHeight };
  }

  // ---------- icons (drawn, 24 x 24) ----------
  const PLANE = 'M22.6 12c0-.9-1-1.45-2.3-1.45H5.2c-1 0-1.7.6-1.7 1.45s.7 1.45 1.7 1.45h15.1c1.3 0 2.3-.55 2.3-1.45zM14.2 10.6 9.6 2.4H7.5l2.3 8.2zM14.2 13.4 9.6 21.6H7.5l2.3-8.2zM6.4 10.6 4.5 6.6H3.1l.7 4zM6.4 13.4l-1.9 4H3.1l.7-4z';
  const ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    lock: '<rect width="16" height="11" x="4" y="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/>',
    up: '<path d="m5 12 7-7 7 7M12 19V5"/>',
    arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    approx: '<path d="M5 9.5c2.3-2 4.7-2 7 0s4.7 2 7 0M5 15.5c2.3-2 4.7-2 7 0s4.7 2 7 0"/>',
    plane: `<path d="${PLANE}" fill="currentColor" stroke="none"/>`,
  };
  const icon = (n, s = 24) => `<svg class="i ic-${n}" viewBox="0 0 24 24" width="${s}" height="${s}">${ICONS[n]}</svg>`;

  // ---------- shared HTML ----------
  function barcode(seed) {
    let x = 0, r = '';
    for (let i = 0; x < 98; i++) {
      const w = [0.8, 1.2, 1.6, 2.6][Math.floor(rand(seed * 977 + i) * 4)];
      r += `<rect x="${x.toFixed(1)}" y="0" width="${w}" height="20"/>`;
      x += w + [0.9, 1.3, 2][Math.floor(rand(seed * 613 + i) * 3)];
    }
    return `<svg class="bp-bc" viewBox="0 0 100 20" preserveAspectRatio="none">${r}</svg>`;
  }
  const g = s => (GEO.test(s) ? ' g' : '');
  function passHTML(o) {
    const k = `bp${o.ink ? ' ink' : ''}${o.mini ? ' mini' : ''}${o.cls ? ' ' + o.cls : ''}`, bc = barcode(o.seed ?? 1);
    const head = `<div class="${k}" style="--w:${o.w || (o.mini ? 270 : 900)}px"><i class="bp-sh"></i><i class="bp-edge"></i>${o.mini ? '<i class="bp-ol"></i>' : ''}<div class="bp-face">`;
    if (o.mini) return `${head}<div class="bp-main"><span class="bp-no">${o.no}</span><span class="bp-nm">${o.name}</span></div><i class="bp-perf"></i><div class="bp-stub"></div></div></div>`;
    const fl = (o.fields || []).map(([a, b]) => `<div><div class="bp-k${g(a)}">${a}</div><div class="bp-v${g(b)}">${b}</div></div>`).join('');
    return `${head}<div class="bp-main"><div class="bp-top"><span class="bp-k${g(o.head || '')}">${o.head || ''}</span>${o.tag ? `<span class="bp-tag">${o.tag}</span>` : ''}</div>` +
      `<div class="bp-hero">${o.no ? `<span class="bp-no">${o.no}</span>` : ''}<span class="bp-ttl">${o.title}</span></div><div class="bp-fl">${fl}</div></div>` +
      `<i class="bp-perf"></i><div class="bp-stub"><span class="bp-k${g(o.stubHead || '')}">${o.stubHead || ''}</span><span class="bp-sno">${o.no || ''}</span><span class="bp-nm">${o.name || ''}</span>${bc}</div></div></div>`;
  }
  const browserHTML = (url, inner = '') => `<div class="brw-bar"><i class="brw-dots"><b></b><b></b><b></b></i><span class="brw-url">${icon('lock', 12)}${url}</span></div><div class="brw-vp"><div class="brw-pg">${inner}</div></div>`;
  const phoneHTML = (inner = '') => `<div class="phn-sc">${inner}</div><i class="phn-isl"></i>`;
  let RID = 0;
  function routeHTML(d, w, h, o = {}) {
    const id = `rteM${++RID}`, s = (o.plane ?? 28) / 24;
    return `<svg class="rte" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><mask id="${id}" maskUnits="userSpaceOnUse"><path class="rte-m" d="${d}" stroke="#fff" stroke-width="${o.mw ?? 24}" fill="none"/></mask></defs>` +
      `<path class="rte-p" d="${d}" mask="url(#${id})"/><g class="rte-pl"><g transform="scale(${s.toFixed(3)}) translate(-12 -12)"><path d="${PLANE}"/></g></g></svg>`;
  }

  // ---------- motions ----------
  function life(t, a, kind, out, ok) {
    if (t < a) return null;
    const st = { o: 1, x: 0, y: 0, s: 1, r: 0 };
    const d = kind === 'slam' ? FX.slam : kind === 'stamp' ? FX.stamp : kind === 'pop' ? FX.pop : FX.arrive;
    const p = ramp(t, a, d), e = EASE.outExpo(p);
    if (kind === 'slam' || kind === 'stamp') { st.s = lerp(1.6, 1, e); st.o = clamp(p * 5); }
    else if (kind === 'pop') { st.s = lerp(0.4, 1, EASE.outBack(p)); st.r = 8 * (1 - e); st.o = clamp(p * 5); }
    else if (kind === 'drop') { st.y = -120 * (1 - e); st.s = lerp(1.15, 1, e); st.r = -8 * (1 - e); st.o = clamp(p * 8); }
    else if (kind === 'right') { st.x = 460 * (1 - e); st.r = 5 * (1 - e); st.o = clamp(p * 8); }
    else if (kind === 'left') { st.x = -460 * (1 - e); st.r = -5 * (1 - e); st.o = clamp(p * 8); }
    else if (kind === 'up') { st.y = 160 * (1 - e); st.o = clamp(p * 8); }
    else if (kind === 'settle') st.s = lerp(1.18, 1, e);
    if (out != null && t >= out) {
      const q = ramp(t, out, FX.exit), c = EASE.inCubic(q);
      if (q >= 1) return null;
      if (ok === 'left') st.x -= 1500 * c;
      else if (ok === 'right') st.x += 1500 * c;
      else if (ok === 'up') st.y -= 900 * c;
      else { st.s *= lerp(1, 0.6, c); st.o *= 1 - c; st.y -= 30 * c; }
    }
    return st;
  }
  function put(e, st) {
    vis(e, !!st);
    if (!st) return;
    css(e, 'opacity', st.o >= 1 ? '' : st.o.toFixed(3));
    css(e, 'transform', `translate(${f2(st.x)}px,${f2(st.y)}px) rotate(calc(var(--r, 0deg) + ${f2(st.r)}deg)) scale(${st.s.toFixed(4)})`);
  }
  function mask(e, t, at, out) {
    const p = EASE.outExpo(ramp(t, at, FX.mask)), q = out == null ? 0 : EASE.inCubic(ramp(t, out, FX.exit));
    vis(e, t >= at && q < 1);
    css(e.firstElementChild, 'transform', p >= 1 && q <= 0 ? '' : `translateY(${f2(112 * (1 - p) - 112 * q)}%)`);
  }
  function pressScale(t, at) {
    if (t < at - FX.press || t > at + FX.release) return 1;
    if (t < at) return lerp(1, 0.94, EASE.outExpo(ramp(t, at - FX.press, FX.press)));
    const h = FX.release * 0.4;
    return t < at + h ? lerp(0.94, 1.03, EASE.outExpo(ramp(t, at, h))) : lerp(1.03, 1, EASE.outExpo(ramp(t, at + h, FX.release - h)));
  }
  const press = (e, t, at) => { const s = pressScale(t, at); css(e, 'transform', s === 1 ? '' : `scale(${s.toFixed(4)})`); };
  const typed = (str, t, a, b) => { const c = chars(str); return c.slice(0, Math.round(ramp(t, a, b - a) * c.length)).join(''); };
  const caret = (t, a, b, end = Infinity) => t >= a - FX.caret && t < end && (t < b || Math.floor((t - b) / FX.blink) % 2 === 0);
  function scroll(e, t, steps) {
    let s = 0;
    for (const [a, to] of steps) if (t >= a) s = lerp(s, to, EASE.inOutQuint(ramp(t, a, FX.scroll)));
    SC.set(e, s);
    css(e, 'transform', s ? `translateY(${f2(-s)}px)` : '');
    return s;
  }
  function words(root) {
    const out = [], nodes = [], tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) nodes.push(tw.currentNode);
    for (const tn of nodes) {
      const fr = document.createDocumentFragment();
      for (const tok of tn.nodeValue.match(/\s*\S+\s*/g) || []) { const s = document.createElement('span'); s.textContent = tok; fr.append(s); out.push(s); }
      tn.replaceWith(fr);
    }
    return out;
  }
  const stream = (ws, t, a, b) => { const n = Math.ceil(ramp(t, a, b - a) * ws.length - 1e-9); ws.forEach((w, i) => vis(w, i < n)); };
  // smooth seeded wobble, [dx, dy] in px
  function tremble(t, amp, seed = 1) {
    const f = t * FX.tremble, n = Math.floor(f), u = f - n, s = u * u * (3 - 2 * u);
    const v = k => lerp(rand(seed * 7919 + n * 2 + k) - 0.5, rand(seed * 7919 + n * 2 + 2 + k) - 0.5, s) * 2 * amp;
    return [v(0), v(1)];
  }
  // keyed position: keys [[time, x, y], ...], eased between keys
  function path(t, keys, e = 'outQuint') {
    let p = keys[0];
    for (let i = 1; i < keys.length; i++) {
      const [a, x, y] = keys[i - 1], [b, x2, y2] = keys[i];
      if (t >= b) { p = keys[i]; continue; }
      if (t > a) { const q = ease(e)(ramp(t, a, b - a)); return [lerp(x, x2, q), lerp(y, y2, q)]; }
      break;
    }
    return [p[1], p[2]];
  }
  function sweep(e, t, at, o = {}) {
    let s = e.querySelector(':scope > .lsw');
    if (!s) { s = el('i', 'lsw'); e.append(s); }
    const p = ramp(t, at, o.d ?? FX.sweep), on = p > 0 && p < 1;
    vis(s, on);
    if (on) { css(s, 'backgroundPosition', `${f2(100 * (1 - EASE.outQuint(p)))}% 0`); css(s, 'opacity', String(o.a ?? 1)); }
  }
  const RT = new WeakMap();
  function route(svg, t, a, b, o = {}) {
    let r = RT.get(svg);
    if (!r) { const p = svg.querySelector('.rte-p'); r = { p, m: svg.querySelector('.rte-m'), pl: svg.querySelector('.rte-pl'), len: p.getTotalLength() }; RT.set(svg, r); }
    let q = ease(o.e || 'inOutQuint')(ramp(t, a, b - a));
    if (o.rev) q = 1 - q;
    const head = r.len * q, tail = o.trail != null ? Math.max(0, head - o.trail) : 0;
    r.m.setAttribute('stroke-dasharray', `0 ${tail.toFixed(1)} ${(head - tail).toFixed(1)} ${(r.len * 2).toFixed(1)}`);
    const P = r.p.getPointAtLength(head), A = r.p.getPointAtLength(Math.min(r.len, head + 1)), B = r.p.getPointAtLength(Math.max(0, head - 1));
    const ang = Math.atan2(A.y - B.y, A.x - B.x) * 180 / Math.PI + (o.rev ? 180 : 0);
    vis(r.pl, o.plane !== false && t >= a && (t < b || o.stay));
    r.pl.setAttribute('transform', `translate(${P.x.toFixed(1)} ${P.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    return { x: P.x, y: P.y, ang, q };
  }

  // ---------- split-flap ----------
  const FLAPS = new WeakMap(), ABC = { d: '0123456789', g: 'ᲐᲑᲒᲓᲔᲕᲖᲗᲘᲙᲚᲛᲜᲝᲞᲟᲠᲡᲢᲣᲤᲥᲦᲧᲨᲩᲪᲫᲬᲭᲮᲯᲰ', l: 'ABCDEFGHIJKLMNOPRSTUVWXYZ' };
  function flapList(text, o, i) {
    const fin = chars(text)[i] ?? ' ', list = [o.from != null ? chars(o.from)[i] ?? ' ' : ' '];
    const push = c => { if (c !== list[list.length - 1]) list.push(c); };
    if (o.seq) o.seq.forEach(s => push(chars(s)[i] ?? ' '));
    else if (fin !== list[0]) {
      const abc = chars(o.abc || (/\d/.test(fin) ? ABC.d : GEO.test(fin) ? ABC.g : ABC.l));
      for (let k = 0; k < (o.steps ?? FX.flapSteps); k++) push(abc[Math.floor(rand((o.seed ?? 1) * 131 + i * 17 + k) * abc.length)]);
    }
    push(fin);
    return list;
  }
  function flapPlan(text, o) {
    const n = chars(text).length, lists = [];
    for (let i = 0; i < n; i++) lists.push(flapList(text, o, i));
    const f = o.flip ?? FX.flip, st = o.stagger ?? FX.flapStagger;
    const len = Math.max(...lists.map((l, i) => (o.rtl ? n - 1 - i : i) * st + (l.length - 1) * f));
    return { n, lists, f, st, len };
  }
  const flapLen = (text, o = {}) => flapPlan(text, o).len;
  function flap(e, text, t, at, o = {}) {
    const P = flapPlan(text, o), start = o.end ? at - P.len : at;
    let st = FLAPS.get(e);
    if (!st || st.n !== P.n) {
      e.classList.add('flp'); e.textContent = '';
      cssv(e, '--h', (o.h || 120) + 'px'); cssv(e, '--w', (o.w || Math.round((o.h || 120) * 0.68)) + 'px');
      const cells = [];
      for (let i = 0; i < P.n; i++) {
        const c = el('span', 'fc', '<b class="h t"><i></i></b><b class="h b"><i></i></b><b class="h ft"><i></i></b><b class="h fb"><i></i></b>');
        e.append(c); cells.push([...c.children]);
      }
      st = { n: P.n, cells }; FLAPS.set(e, st);
    }
    const face = (h, c, last) => {
      const i = h.firstElementChild;
      txt(i, c === ' ' ? '' : c); i.className = GEO.test(c) ? 'g' : '';
      cssv(h, '--fco', last && o.color ? o.color : ''); cssv(h, '--fbg', last && o.bg ? o.bg : '');
    };
    st.cells.forEach(([top, bot, ft, fb], i) => {
      const L = P.lists[i], nf = L.length - 1, s0 = start + (o.rtl ? P.n - 1 - i : i) * P.st;
      const j = Math.floor((t - s0) / P.f);
      if (t < s0 || j >= nf) {
        const k = t < s0 ? 0 : nf;
        face(top, L[k], k === nf); face(bot, L[k], k === nf); vis(ft, false); vis(fb, false);
        cssv(top, '--s', ''); cssv(bot, '--s', '');
        return;
      }
      const ph = (t - s0 - j * P.f) / P.f, last = j + 1 === nf;
      face(top, L[j + 1], last); face(bot, L[j], false);
      if (ph < 0.5) {
        const q = ph * 2;
        face(ft, L[j], false); vis(ft, true); vis(fb, false);
        css(ft, 'transform', `rotateX(${f2(-90 * q * q)}deg)`);
        cssv(ft, '--s', f2(0.55 * q)); cssv(top, '--s', f2(0.6 * (1 - q))); cssv(bot, '--s', '');
      } else {
        const q = (ph - 0.5) * 2;
        face(fb, L[j + 1], last); vis(fb, true); vis(ft, false);
        css(fb, 'transform', `rotateX(${f2(90 * (1 - back(1.1)(q)))}deg)`);
        cssv(fb, '--s', f2(0.45 * (1 - q))); cssv(bot, '--s', f2(0.5 * q)); cssv(top, '--s', '');
      }
    });
    return start + P.len;
  }

  // ---------- camera: one per world element ----------
  const creep = (P, t0, t, dir, sl) => {
    const dt = Math.max(0, t - t0), v = sl || [0, 0];
    return { ...P, x: P.x + v[0] * dt / P.z, y: P.y + v[1] * dt / P.z, z: P.z * (1 + FX.creep * dt * dir) };
  };
  function makeWorld(a, root, o = {}) {
    const name = o.name || 'main', keys = [];
    for (const sh of a.shots) for (const k of sh.s.cam || []) {
      if ((k.w || 'main') !== name) continue;
      const s = when(sh.id, k.at);
      if (k.kick) a.kicks.push([s, k.kick, name]);
      else keys.push({ s, d: k.d ?? FX.cam, e: k.e || 'inOutQuint', spec: k.to, snd: k.snd, slide: k.slide });
    }
    for (const [s, kk, w] of a.kicks) if (w === name || w === '*') keys.push({ s, d: FX.kick[0], e: 'outExpo', spec: { dz: 1 + kk } }, { s: s + FX.kick[0], d: FX.kick[1], e: 'inOutQuint', spec: { dz: 1 / (1 + kk) } });
    keys.sort((x, y) => x.s - y.s);
    const C = { root, keys, n: 0, P0: { x: W / 2, y: H / 2, z: 1, r: 0 }, cam0: o.cam0, P: null };
    const at = (t, n = C.n) => {
      let k = null;
      for (let i = 0; i < n && C.keys[i].s <= t; i++) k = C.keys[i];
      if (!k) return creep(C.P0, a.t0, t, 1);
      const p = k.d ? (t - k.s) / k.d : 1;
      if (p >= 1) return creep(k.to, k.s + k.d, t, k.dir, k.slide);
      const e = EASE[k.e](clamp(p)), A = k.from, B = k.to;
      return { x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e), z: A.z * (B.z / A.z) ** e, r: lerp(A.r, B.r, e) + Math.sin(Math.PI * p) * k.roll };
    };
    const pose = (spec, from, tEnd) => {
      if (spec.dz || spec.dx || spec.dy) return { ...from, x: from.x + (spec.dx || 0) / from.z, y: from.y + (spec.dy || 0) / from.z, z: from.z * (spec.dz || 1) };
      if (spec.el) {
        run(a, a.def.draw, tEnd, a.K);
        const e = typeof spec.el === 'string' ? root.querySelector(spec.el) : spec.el;
        if (!e) throw new Error(`${a.id} camera: no ${spec.el}`);
        const b = box(e, root), z = spec.z ?? 1;
        return { x: b.x + b.w / 2 - ((spec.ax ?? 0.5) * W - W / 2) / z, y: b.y + b.h / 2 - ((spec.ay ?? 0.5) * H - H / 2) / z, z, r: spec.r || 0 };
      }
      return { x: spec.x, y: spec.y, z: spec.z ?? 1, r: spec.r || 0 };
    };
    C.resolve = () => {
      if (C.cam0) C.P0 = pose(C.cam0, C.P0, a.t0);
      C.keys.forEach((k, i) => {
        C.n = i;
        k.from = at(k.s);
        k.to = pose(k.spec, k.from, k.s + k.d);
        const travel = Math.hypot(k.to.x - k.from.x, k.to.y - k.from.y) * (k.from.z + k.to.z) / 2;
        k.fast = k.d > 0 && k.d < 0.6 && (travel > 150 || Math.abs(Math.log(k.to.z / k.from.z)) > Math.log(1.25));
        k.roll = k.fast ? clamp((k.to.x - k.from.x) * k.to.z / 260, -3, 3) : 0;
        k.dir = k.to.z < k.from.z * 0.9 ? -1 : 1;
      });
      C.n = C.keys.length;
    };
    a.worlds.push(C);
    const api = {
      el: root,
      at: t => at(t),
      apply(t) {
        const P = (C.P = at(t));
        css(root, 'transform', `translate(640px,360px) rotate(${P.r.toFixed(3)}deg) scale(${P.z.toFixed(5)}) translate(${(-P.x).toFixed(2)}px,${(-P.y).toFixed(2)}px)`);
        return P;
      },
      toScreen(x, y, P = C.P) {
        const r = P.r * Math.PI / 180, dx = (x - P.x) * P.z, dy = (y - P.y) * P.z;
        return [W / 2 + dx * Math.cos(r) - dy * Math.sin(r), H / 2 + dx * Math.sin(r) + dy * Math.cos(r)];
      },
      box: e => box(typeof e === 'string' ? root.querySelector(e) : e, root),
      parallax(e, f, P = C.P) { css(e, 'transform', `translate(${f2((P.x - C.P0.x) * (1 - f))}px,${f2((P.y - C.P0.y) * (1 - f))}px)`); },
    };
    return api;
  }

  // ---------- finger ----------
  function makeFinger(root) {
    const r = el('i', 'rip'), f = el('i', 'fng');
    root.append(r, f);
    return {
      el: f,
      draw(t, x, y, o = {}) {
        const on = (o.o ?? 1) > 0;
        vis(f, on);
        let s = 1, rp = null;
        for (const at of o.taps || []) {
          s = Math.min(s, 1 - (1 - pressScale(t, at)) * 2.4);
          if (t >= at && t < at + FX.ripple) rp = ramp(t, at, FX.ripple);
        }
        if (on) {
          css(f, 'opacity', o.o >= 1 || o.o == null ? '' : o.o.toFixed(3));
          css(f, 'transform', `translate(${f2(x)}px,${f2(y)}px) scale(${s.toFixed(4)})`);
        }
        vis(r, rp != null);
        if (rp != null) {
          css(r, 'transform', `translate(${f2(x)}px,${f2(y)}px) scale(${lerp(0.35, 1.5, EASE.outExpo(rp)).toFixed(3)})`);
          css(r, 'opacity', f2(0.9 * (1 - EASE.inCubic(rp))));
        }
      },
    };
  }

  // ---------- chapter layer ----------
  // a chapter starts in the act it is keyed by and runs `through` a later act (default: that act alone)
  const CHAPS = [];
  function buildChapter(id) {
    const c = TL.chapters[id], i = ACTS.findIndex(x => x.id === id), j = c.through ? ACTS.findIndex(x => x.id === c.through) : i;
    if (i < 0 || j < i) throw new Error(`timeline: chapter ${id} through ${c.through}`);
    const span = ACTS.slice(i, j + 1), a = span[0], find = k => { for (const x of span) { const v = evt(x, k); if (v != null) return v; } return null; };
    const tIn = evt(a, 'chIn');
    if (tIn == null || !span.some(x => x.el)) return;
    const box = el('div', 'chp', passHTML({ ...c, head: 'ᲡᲐᲑᲝᲠᲢᲘᲜᲒ ᲞᲐᲡᲘ', stubHead: 'ᲠᲔᲘᲡᲘ', fields: c.fields || [['ᲠᲔᲘᲡᲘ', `${c.no} / 03`], ['ᲡᲐᲘᲓᲐᲜ', 'TBS'], ['ᲡᲢᲐᲢᲣᲡᲘ', 'ᲩᲐᲡᲮᲓᲝᲛᲐ']], seed: +c.no }) +
      passHTML({ ...c, mini: true, seed: +c.no }));
    const [full, mini] = box.children;
    const stamp = el('div', `stamp rd${c.ink ? ' y' : ''}`, icon('check'));
    mini.append(stamp);
    $('#chap').append(box);
    const ch = { box, full, mini, face: full.querySelector('.bp-face'), stamp, tIn, tFly: evt(a, 'chFly'), tSt: find('chStamp'), t1: span[span.length - 1].t1, ink: c.ink };
    CHAPS.push(ch);
    a.kicks.push([tIn + FX.chIn * 0.5, FX.chKick, '*']);
    if (ch.tSt != null) actAt(ch.tSt).kicks.push([ch.tSt + FX.stamp * 0.6, FX.chKick, '*']);
  }
  function drawChapter(c, t) {
    const on = t >= c.tIn && t < c.t1;
    vis(c.box, on);
    if (!on) return;
    c.box.classList.toggle('on-ink', TL.open[actAt(t).id] === 'ink');
    const p = ramp(t, c.tIn, FX.chIn), e = EASE.outExpo(p), fly = c.tFly ?? Infinity;
    const s0 = lerp(1.45, 1, e) * (1 + FX.creep * Math.max(0, Math.min(t, fly) - c.tIn - FX.chIn));
    const q = ramp(t, fly, FX.chFly), m = EASE.inOutCubic(q);
    const cx = lerp(640, 175, m), cy = lerp(360 + 50 * (1 - e), 60, m), wv = lerp(900 * s0, 270, m), r = lerp(lerp(-7, -2, e), -1.5, m);
    vis(c.full, q < 0.5); vis(c.mini, q >= 0.5);
    if (q < 0.5) {
      css(c.full, 'opacity', p >= 0.2 ? '' : f2(p * 5));
      css(c.full, 'transform', `translate(${f2(cx - 450)}px,${f2(cy - 193)}px) perspective(1600px) rotateX(${f2(180 * q)}deg) rotate(${f2(r)}deg) scale(${(wv / 900).toFixed(4)})`);
      cssv(c.full, '--lift', f2(lerp(1, 0.12, e)));
      sweep(c.face, t, c.tIn + FX.chIn * 0.5, { a: c.ink ? 0.35 : 1 });
    } else css(c.mini, 'transform', `translate(${f2(cx - 135)}px,${f2(cy - 32)}px) perspective(800px) rotateX(${f2(180 * (q - 1))}deg) rotate(${f2(r)}deg) scale(${(wv / 270).toFixed(4)})`);
    put(c.stamp, c.tSt != null ? life(t, c.tSt, 'stamp') : null);
  }

  // ---------- joins: a tilted band sweeps the next act's opening colour in ----------
  const TAN8 = Math.tan(8 * Math.PI / 180), OV = 360 * TAN8, STRIPE = 110, BAND = W + 2 * OV + STRIPE + 4;
  const JOINS = [];
  function buildJoins() {
    for (let i = 1; i < ACTS.length; i++) {
      const a = ACTS[i], sc = TL.stripe[a.id] || 'yellow', j = el('div', 'jn');
      j.innerHTML = `<i class="c-${TL.open[a.id]}"></i><i class="c-${sc}"></i><div class="jp" style="color:var(--${sc === 'ink' ? 'yellow' : 'ink'})">${icon('plane', 72)}</div>`;
      $('#fx').append(j);
      JOINS.push({ t: a.t0, j, parts: [...j.children] });
    }
  }
  function drawJoins(t) {
    for (const { t: b, j, parts: [body, stripe, plane] } of JOINS) {
      const p = ramp(t, b - FX.join / 2, FX.join), on = p > 0 && p < 1;
      vis(j, on);
      if (!on) continue;
      const L = lerp(-OV, W + OV + BAND, EASE.inOutCubic(p)), Ls = L - STRIPE, Lb = L - BAND;
      const poly = (x0, x1) => `polygon(${f2(x0 + OV)}px 0, ${f2(x1 + OV)}px 0, ${f2(x1 - OV)}px 720px, ${f2(x0 - OV)}px 720px)`;
      css(body, 'clipPath', poly(Lb, Ls)); css(stripe, 'clipPath', poly(Ls, L));
      css(plane, 'transform', `translate(${f2(L - STRIPE / 2)}px,360px) rotate(${f2(-4)}deg)`);
    }
  }

  // ---------- grain ----------
  // Light on purpose: grain that changes every frame is what an H.264 file spends most of its bits on (alpha 26 on every
  // frame was about 100 Mbit/s at 1080p; alpha 5 on every second frame keeps dark gradients from banding at a few Mbit/s).
  const GRAIN_A = 5, GRAIN_EVERY = 2;
  function grain() {
    const n = 384, c = document.createElement('canvas'); c.width = c.height = n;
    const x = c.getContext('2d'), im = x.createImageData(n, n);
    for (let i = 0; i < n * n; i++) {
      const v = rand(i) > 0.5 ? 255 : 0;
      im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = Math.floor(rand(i + 7e6) * GRAIN_A);
    }
    x.putImageData(im, 0, 0);
    $('#grain').style.backgroundImage = `url(${c.toDataURL()})`;
    const m = 160, w = document.createElement('canvas'); w.width = w.height = m;
    const y = w.getContext('2d'), wm = y.createImageData(m, m);
    for (let i = 0; i < m * m; i++) { const r = rand(i + 3e6); wm.data[i * 4 + 3] = r > 0.94 ? 40 : r > 0.84 ? 170 : 255; }
    y.putImageData(wm, 0, 0);
    document.documentElement.style.setProperty('--wear', `url(${w.toDataURL()})`);
  }
  const grainAt = t => { const n = Math.floor(Math.round(t * FPS) / GRAIN_EVERY); css($('#grain'), 'backgroundPosition', `${Math.floor(rand(n * 2) * 128) * 2}px ${Math.floor(rand(n * 2 + 1) * 128) * 2}px`); };

  // ---------- the kit handed to each act ----------
  const SND = [];
  const BASE = {
    T, S, has: id => id in SH, when, ...EASE, E: EASE, fx: FX, W, H,
    clamp, lerp, ramp, rand, prog: (t, at, d, e) => ease(e)(ramp(t, at, d)),
    life, put, mask, press, pressScale, typed, caret, scroll, words, stream, tremble, path, sweep, route, flap, flapLen,
    passHTML, browserHTML, phoneHTML, routeHTML, icon, css, cssv, txt, vis,
    sound(t, name, gain = 0.7, d) { SND.push(d ? { t: +t.toFixed(3), name, gain, d: +d.toFixed(3) } : { t: +t.toFixed(3), name, gain }); },
  };
  function kit(a) {
    const K = Object.create(BASE);
    Object.assign(K, {
      id: a.id, root: a.el, t0: a.t0, t1: a.t1, shots: a.shots.map(s => ({ id: s.id, say: s.s.say })),
      $: s => a.el.querySelector(s), $$: s => [...a.el.querySelectorAll(s)],
      box: (e, stop = a.el) => box(e, stop),
      world: (e, o) => makeWorld(a, e, o),
      finger: () => makeFinger(a.el),
    });
    return K;
  }

  // ---------- exports derived from the timeline ----------
  function derive() {
    const blur = [], sfx = [...SND], marks = [];
    const add = (t, name, gain = 0.7, d) => sfx.push(d ? { t: +t.toFixed(3), name, gain, d: +d.toFixed(3) } : { t: +t.toFixed(3), name, gain });
    for (const a of ACTS) {
      for (const C of a.worlds) for (const k of C.keys) {
        marks.push(k.s);
        if (k.fast) { blur.push([k.s, k.s + k.d]); add(k.s, k.snd || 'whoosh', 0.7, k.d); }
      }
      for (const s of a.shots) {
        marks.push(s.t);
        for (const k of Object.keys(s.s.at || {})) marks.push(T(s.id, k));
        for (const [k, v] of Object.entries(s.s.snd || {})) {
          const [name, gain, endKey] = Array.isArray(v) ? v : [v];
          add(T(s.id, k), name, gain ?? 0.7, endKey ? T(s.id, endKey) - T(s.id, k) : undefined);
        }
      }
    }
    for (const c of CHAPS) {
      add(c.tIn, 'slam', 0.9);
      if (c.tFly != null) { blur.push([c.tFly, c.tFly + FX.chFly]); add(c.tFly, 'swish', 0.7, FX.chFly); }
      if (c.tSt != null) add(c.tSt, 'slam', 0.8);
    }
    for (const { t } of JOINS) { blur.push([t - FX.join / 2, t + FX.join / 2]); add(t - FX.join / 2, 'whooshBig', 0.9, FX.join); marks.push(t); }
    blur.sort((x, y) => x[0] - y[0]);
    const merged = [];
    for (const b of blur) { const m = merged[merged.length - 1]; if (m && b[0] <= m[1] + 1e-6) m[1] = Math.max(m[1], b[1]); else merged.push([...b]); }
    sfx.sort((x, y) => x.t - y.t);
    return { blur: merged.map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]), sfx, marks: marks.sort((x, y) => x - y).map(x => +x.toFixed(4)) };
  }

  // ---------- seek ----------
  function seek(t) {
    t = clamp(+t || 0, 0, LEN);
    const a = actAt(t);
    for (const x of ACTS) if (x.el) x.el.classList.toggle('on', x === a);
    if (a.el) run(a, a.def.draw, t, a.K);
    for (const c of CHAPS) drawChapter(c, t);
    // a join inside a chapter's span passes under the stub, so the stub stays
    css($('#chap'), 'zIndex', JOINS.some(j => Math.abs(t - j.t) < FX.join / 2 && CHAPS.some(c => j.t > c.tIn && j.t < c.t1)) ? '1' : '');
    drawJoins(t);
    grainAt(t);
  }

  const DEFS = {};
  window.ACT = (id, def) => { DEFS[id] = def; };
  window.ready = (async () => {
    if (document.readyState === 'loading') await new Promise(r => document.addEventListener('DOMContentLoaded', r));
    const host = $('#acts');
    for (const a of ACTS) {
      if (ONLY && a.id !== ONLY) continue;
      a.def = DEFS[a.id];
      if (!a.def) { console.error(`${a.id}: acts/${a.id}.js did not register`); continue; }
      a.el = el('section', `act w-${TL.open[a.id]}`, a.def.html || '');
      a.el.id = a.id;
      host.append(a.el);
      a.K = kit(a);
    }
    await Promise.all(['400 16px "Noto Sans Georgian"', '600 16px "Noto Sans Georgian"', '900 30px "Noto Sans Georgian"', '400 16px Inter', '800 16px Inter', '900 16px Inter']
      .map(f => document.fonts.load(f, 'აᲐA1')));
    await document.fonts.ready;
    grain();
    Object.keys(TL.chapters).forEach(buildChapter);
    for (const a of ACTS) if (a.el) { a.el.classList.add('on'); run(a, a.def.init, a.K); a.el.classList.remove('on'); }
    await Promise.all(Array.from(document.images).map(i => i.decode().catch(() => console.error('image failed: ' + i.src))));
    for (const a of ACTS) if (a.el) { a.el.classList.add('on'); for (const C of a.worlds) run(a, C.resolve); a.el.classList.remove('on'); }
    buildJoins();
    const D = derive();
    window.FILM = { len: LEN, fps: FPS, cues, blur: D.blur, sfx: D.sfx, marks: D.marks, say: cues.map(c => SH[c.id].s.say),
      acts: ACTS.map(a => ({ id: a.id, t0: a.t0, t1: a.t1 })), only: ONLY };
    window.seek = seek;
    const q = new URLSearchParams(location.search).get('t');
    seek(q != null ? parseFloat(q) : ONLY ? ACTS.find(a => a.id === ONLY).t0 : 0);
    return true;
  })();
})();
