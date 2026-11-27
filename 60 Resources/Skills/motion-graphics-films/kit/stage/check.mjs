// Usage: node check.mjs [--act aN] [--step 0.1]
// Steps through the film (or one act, mounted alone with ?only=aN) with the narration lengths as given, x0.85 and x1.2,
// and with the shot m1 removed (full film or a1), and exits 1 with a list of failures:
//  console errors; narration outrunning its shot; 2.5 s with no camera key, cut or event; honesty labels (any visible
//  element with data-lbl="text" needs a fully visible .lbl with that text, except inside blur intervals); stickers,
//  stamps, labels and full-frame lines cut by the frame or overlapping while settled; the top corners (chapter stub,
//  label) covered by settled act type ([data-read] included); text drawn in a font other than Inter / Noto Sans Georgian;
//  pictures that depend on seek order.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { const req = createRequire(execSync('npm root -g').toString().trim() + '/'); ({ chromium } = req('playwright')); }

const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const act = opt('--act'), STEP = parseFloat(opt('--step', '0.1'));
const url = pathToFileURL(path.join(here, 'film.html')).href + (act ? `?only=${act}` : '');
const fails = new Map();
// the same failure is listed once, with its first time and how many steps had it
const fail = (run, t, msg) => { const k = `${run}: ${msg}`, f = fails.get(k); if (f) f.n++; else fails.set(k, { t, n: 1 }); };
const FONTS = new Set(['Inter', 'Noto Sans Georgian']);

// in the page: what is on screen at t
function probe(t) {
  window.seek(t);
  const shown = e => { for (let n = e; n && n !== document.body; n = n.parentElement) { const s = getComputedStyle(n); if (s.visibility === 'hidden' || s.display === 'none') return false; } return true; };
  const alpha = e => { let a = 1; for (let n = e; n && n !== document.body; n = n.parentElement) a *= +getComputedStyle(n).opacity; return a; };
  const box = r => ({ l: r.left, t: r.top, r: r.right, b: r.bottom });
  const textBox = e => {
    const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), g = document.createRange();
    let l = Infinity, rt = -Infinity, tp = Infinity, bt = -Infinity;
    while (tw.nextNode()) {
      if (!tw.currentNode.nodeValue.trim()) continue;
      g.selectNodeContents(tw.currentNode);
      const q = g.getBoundingClientRect(), r = tw.currentNode.parentElement.getBoundingClientRect();
      l = Math.min(l, q.left); rt = Math.max(rt, q.right); tp = Math.min(tp, r.top); bt = Math.max(bt, r.bottom);
    }
    return { l, t: tp, r: rt, b: bt };
  };
  const inView = b => b.r > 0 && b.l < 1280 && b.b > 0 && b.t < 720;
  const on = document.querySelector('.act.on');
  if (!on) return { items: [], needs: [], lbls: [], stub: null };
  const needs = [...new Set([...on.querySelectorAll('[data-lbl]')].filter(e => shown(e) && alpha(e) > 0.01 && inView(box(e.getBoundingClientRect()))).map(e => e.dataset.lbl))];
  const lbls = [...on.querySelectorAll('.lbl')].filter(shown).map(e => ({ text: e.textContent.trim(), a: alpha(e), b: box(e.getBoundingClientRect()) }));
  const items = [];
  [...on.querySelectorAll('.stk, .stamp, .lbl, .ff .ml, [data-read]')].forEach((e, i) => {
    if (!shown(e)) return;
    const isText = e.matches('.ml, [data-read]');
    items.push({ id: `${e.className.baseVal ?? e.className}#${i}`, lbl: e.matches('.lbl'), a: alpha(e), b: isText ? textBox(e) : box(e.getBoundingClientRect()), path: [...e.parentElement.closest('.stk, .stamp, .bp, .lbl') ? [1] : []].length });
  });
  const st = [...document.querySelectorAll('#chap .bp.mini')].find(shown);
  return { items, needs, lbls, stub: st ? box(st.getBoundingClientRect()) : null };
}

const browser = await chromium.launch();
const runs = [['x1', 1, false], ['x0.85', 0.85, false], ['x1.2', 1.2, false]];
if (!act || act === 'a1') runs.push(['no-m1', 1, true]);
const summary = [];
for (const [run, k, noM1] of runs) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => fail(run, 0, 'pageerror ' + e.message));
  page.on('console', m => { if (m.type() === 'error') fail(run, 0, 'console error ' + m.text().split('\n')[0]); });
  // change the timeline before core.js reads it
  await page.addInitScript(([k, noM1]) => {
    let tl;
    Object.defineProperty(window, 'TL', { configurable: true, get: () => tl, set: v => {
      const add = v.act;
      v.act = (id, def) => { def.shots = def.shots.filter(s => !(noM1 && s.id === 'm1')); def.shots.forEach(s => { s.dur *= k; }); add.call(v, id, def); };
      tl = v;
    } });
  }, [k, noM1]);
  await page.goto(url);
  await page.evaluate(() => window.ready);
  const F = await page.evaluate(() => window.FILM);
  const A = act ? F.acts.find(a => a.id === act) : { t0: 0, t1: F.len };
  const marks = [A.t0, ...F.marks.filter(m => m > A.t0 && m < A.t1), A.t1];
  for (let i = 1; i < marks.length; i++) if (marks[i] - marks[i - 1] > 2.5) fail(run, marks[i - 1], `nothing new for ${(marks[i] - marks[i - 1]).toFixed(2)} s`);
  for (let i = 0; i < F.cues.length; i++) {
    const c = F.cues[i], end = i + 1 < F.cues.length ? F.cues[i + 1].t : F.len;
    if ((!act || c.act === act) && c.voiceAt + c.dur > end + 1e-6) fail(run, c.t, `${c.id}: narration outruns the shot`);
  }
  const inBlur = t => F.blur.some(([a, b]) => t >= a - 1e-6 && t <= b + 1e-6);
  const moved = (a, b) => !b || Math.max(...['l', 't', 'r', 'b'].map(x => Math.abs(a.b[x] - b.b[x]))) >= 2;
  let n = 0;
  for (let t = A.t0; t < A.t1 - 1e-9; t += STEP, n++) {
    const p = await page.evaluate(probe, t), q = await page.evaluate(probe, Math.min(F.len, t + 0.05));
    if (!inBlur(t)) for (const need of p.needs) {
      const L = p.lbls.find(l => l.text === need);
      if (!L || L.a < 0.999 || L.b.l < -0.5 || L.b.t < -0.5 || L.b.r > 1280.5 || L.b.b > 720.5) fail(run, t, `"${need}" on screen without its full label`);
    }
    const settled = p.items.filter(a => a.a > 0.999 && !moved(a, q.items.find(x => x.id === a.id)));
    for (const a of settled) if (a.b.l < -1 || a.b.t < -1 || a.b.r > 1281 || a.b.b > 721) fail(run, t, `${a.id} cut by the frame edge`);
    for (let i = 0; i < settled.length; i++) for (let j = i + 1; j < settled.length; j++) {
      const a = settled[i].b, b = settled[j].b;
      if (settled[i].path || settled[j].path) continue;
      if (Math.min(a.r, b.r) - Math.max(a.l, b.l) > 3 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 3) fail(run, t, `${settled[i].id} overlaps ${settled[j].id}`);
    }
    for (const a of settled) {
      if (p.stub && a.b.l < p.stub.r + 8 && a.b.t < p.stub.b + 8) fail(run, t, `${a.id} in the chapter stub's corner`);
      if (!a.lbl && a.b.r > 1000 && a.b.t < 84) fail(run, t, `${a.id} in the label's corner`);
    }
  }
  if (run === 'x1') {
    // fonts actually used for visible text, at each shot's middle and end
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    for (const c of F.cues.filter(c => !act || c.act === act)) {
      const end = F.cues[F.cues.indexOf(c) + 1]?.t ?? F.len;
      for (const t of [(c.t + end) / 2, end - 0.1]) {
        const cnt = await page.evaluate(t => {
          window.seek(t);
          document.querySelectorAll('[data-fchk]').forEach(e => e.removeAttribute('data-fchk'));
          let n = 0;
          for (const e of document.querySelectorAll('#view *')) {
            if (n >= 400 || ![...e.childNodes].some(x => x.nodeType === 3 && x.nodeValue.trim())) continue;
            const r = e.getBoundingClientRect(), s = getComputedStyle(e);
            if (s.visibility === 'hidden' || r.width === 0 || r.right < 0 || r.left > 1280 || r.bottom < 0 || r.top > 720) continue;
            e.setAttribute('data-fchk', ''); n++;
          }
          return n;
        }, t);
        if (!cnt) continue;
        const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
        const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-fchk]' });
        for (const id of nodeIds) {
          const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id });
          const bad = fonts.filter(f => !FONTS.has(f.familyName));
          if (bad.length) {
            const { outerHTML } = await cdp.send('DOM.getOuterHTML', { nodeId: id });
            fail(run, t, `fallback font ${bad.map(f => f.familyName).join(', ')} in ${outerHTML.slice(0, 90)}`);
          }
        }
      }
    }
    // order independence
    const times = [0.13, 0.31, 0.52, 0.74, 0.93].map(f => A.t0 + f * (A.t1 - A.t0));
    const shot = async t => { await page.evaluate(x => window.seek(x), t); return page.screenshot({ type: 'png' }); };
    const a = [];
    for (const t of times) a.push(await shot(t));
    for (let i = times.length - 1; i >= 0; i--) {
      await page.evaluate(x => window.seek(x), A.t1 - (times[i] - A.t0));
      if (!(await shot(times[i])).equals(a[i])) fail(run, times[i], 'picture depends on seek order');
    }
  }
  summary.push(`${run}: film ${F.len.toFixed(2)} s, ${act || 'all'} ${A.t0.toFixed(2)}-${A.t1.toFixed(2)} s, ${n} steps`);
  await page.close();
}
await browser.close();
console.log(summary.join('\n'));
if (fails.size) {
  console.log(`FAIL (${fails.size})\n` + [...fails].map(([k, f]) => `${k}  (from t=${f.t.toFixed(2)}${f.n > 1 ? `, ${f.n} steps` : ''})`).join('\n'));
  process.exit(1);
}
console.log('PASS');
