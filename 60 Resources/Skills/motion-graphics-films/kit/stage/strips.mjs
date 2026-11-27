// Usage: node strips.mjs [--act aN] [--step 0.5] [--from S] [--to S] [--page kit.html] [--out sheet.jpg] [--sub 4] [--no-blur] [--at t1,t2]
//        node strips.mjs [--act aN] --live t1 t2 ...    full-size stills drawn at those times (1920 x 1080 PNG each)
// Draws by seeking the stage directly (no video needed): a contact sheet (a frame every --step s, 6 columns, 480 wide,
// time and shot id printed) and, for each blur interval, a strip of 8 consecutive frames (4 x 2, 640 wide; frames inside
// an interval are the mean of --sub sub-frames, as render.mjs makes them); --at adds a strip of 8 frames from each time.
// --act aN mounts that act only (?only=aN). Output: ../out/v5/sheet-<act|film>.jpg and ../out/v5/strips/<act|film>/.
import { createRequire } from 'node:module';
import { execSync, execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { const req = createRequire(execSync('npm root -g').toString().trim() + '/'); ({ chromium } = req('playwright')); }

const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const act = opt('--act'), pageFile = opt('--page', 'film.html'), name = act || path.basename(pageFile, '.html');
const outDir = path.join(here, '..', 'out', 'v5'), stripDir = path.join(outDir, 'strips', name), tmp = path.join(outDir, 'tmp-' + name);
for (const d of [tmp, stripDir]) { fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d, { recursive: true }); }
const live = argv.includes('--live');

const PY = `
import sys, json
from PIL import Image, ImageDraw, ImageChops
out, cols, w, items = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), json.loads(open(sys.argv[4]).read())
h, lab, gap = w * 9 // 16, 22, 6
rows = (len(items) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + gap) + gap, rows * (h + lab + gap) + gap), (34, 34, 32))
d = ImageDraw.Draw(sheet)
for i, (fs, label) in enumerate(items):
    im = Image.open(fs[0]).convert('RGB')
    for k, f in enumerate(fs[1:]):
        im = Image.blend(im, Image.open(f).convert('RGB'), 1 / (k + 2))
    x, y = gap + (i % cols) * (w + gap), gap + (i // cols) * (h + lab + gap)
    sheet.paste(im.resize((w, h), Image.LANCZOS), (x, y))
    d.text((x + 4, y + h + 5), label, fill=(245, 244, 238))
sheet.save(out, quality=88)
`;
let tiles = 0;
const tile = (out, cols, w, items) => {
  const j = path.join(tmp, `items${tiles++}.json`);
  fs.writeFileSync(j, JSON.stringify(items));
  execFileSync('python3', ['-I', '-c', PY, out, String(cols), String(w), j], { stdio: 'inherit' });
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: live ? 1.5 : 0.5 });
page.on('pageerror', e => console.error('pageerror:', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
await page.goto(pathToFileURL(path.join(here, pageFile)).href + (act ? `?only=${act}` : ''));
await page.evaluate(() => window.ready);
const F = await page.evaluate(() => window.FILM);
const A = act ? F.acts.find(a => a.id === act) : { t0: 0, t1: F.len };
const shotAt = t => [...F.cues].reverse().find(c => c.t <= t + 1e-6).id;
let n = 0;
const grab = async t => {
  const f = path.join(tmp, `s${n++}.${live ? 'png' : 'jpg'}`);
  await page.evaluate(x => window.seek(x), t);
  await page.screenshot({ path: f, type: live ? 'png' : 'jpeg', quality: live ? undefined : 90 });
  return f;
};

if (live) {
  for (const a of argv.slice(argv.indexOf('--live') + 1)) {
    const f = await grab(parseFloat(a)), to = path.join(stripDir, `live-${parseFloat(a).toFixed(2)}.png`);
    fs.renameSync(f, to); console.log('wrote', to);
  }
} else {
  const FPS = F.fps, SUB = parseInt(opt('--sub', '4'), 10), step = parseFloat(opt('--step', '0.5'));
  const from = parseFloat(opt('--from', String(A.t0))), to = parseFloat(opt('--to', String(A.t1)));
  const inBlur = t => F.blur.some(([a, b]) => t >= a - 1e-6 && t <= b + 1e-6);
  const frame = async k => {
    const t = k / FPS;
    if (!inBlur(t) || SUB < 2) return [await grab(t)];
    const fs2 = [];
    for (let s = 0; s < SUB; s++) fs2.push(await grab((k + ((s + 0.5) / SUB - 0.5) * 0.8) / FPS));
    return fs2;
  };
  const sheet = [];
  for (let t = from; t < to - 1e-6; t += step) sheet.push([await frame(Math.round(t * FPS)), `${t.toFixed(1)}s  ${shotAt(t)}`]);
  const out = path.resolve(opt('--out', path.join(outDir, `sheet-${name}.jpg`)));
  tile(out, 6, 480, sheet);
  console.log('wrote', out);
  for (const a of (opt('--at') || '').split(',').filter(Boolean)) {
    const k0 = Math.round(parseFloat(a) * FPS), items = [];
    for (let k = k0; k < k0 + 8; k++) items.push([await frame(k), `${(k / FPS).toFixed(3)}s  f${k}  ${shotAt(k / FPS)}`]);
    const f = path.join(stripDir, `at-${parseFloat(a).toFixed(2)}.jpg`);
    tile(f, 4, 640, items); console.log('wrote', f);
  }
  if (!argv.includes('--no-blur')) {
    for (const [i, [a]] of F.blur.entries()) {
      if (a < from - 1e-6 || a > to) continue;
      const k0 = Math.max(0, Math.round(a * FPS) - 1), items = [];
      for (let k = k0; k < k0 + 8; k++) items.push([await frame(k), `${(k / FPS).toFixed(3)}s  f${k}  ${shotAt(k / FPS)}`]);
      tile(path.join(stripDir, `blur${String(i).padStart(2, '0')}-${a.toFixed(2)}.jpg`), 4, 640, items);
    }
    console.log('wrote blur strips to', stripDir);
  }
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
