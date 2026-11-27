// Usage: node render.mjs [--from S] [--to S] [--act aN] [--sub N] [--jobs J] [--scale F] [--out file.mp4]   render, then encode
//        node render.mjs --encode [--scale F] [--out file.mp4]                                              encode the frames on disk
// 1280 x 720 CSS px at deviceScaleFactor 1.5 x F (1920 x 1080 at F = 1), 30 fps, H.264 yuv420p crf 16, silent.
// Frames are JPEG q95 in <out dir>/frames (frames-s<F> for a scaled preview), kept so a range can be rendered again.
// A frame inside a FILM.blur interval is the mean of N sub-frames spread over 80% of the frame time.
// --act aN renders that act's time range of the full film (all acts mounted). Each job is its own browser.
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
const scale = parseFloat(opt('--scale', '1'));
const out = path.resolve(opt('--out', path.join(here, '..', 'out', 'v5', scale === 1 ? 'film-v5.mp4' : 'film-v5-preview.mp4')));
const frames = path.join(path.dirname(out), scale === 1 ? 'frames' : `frames-s${scale}`), subDir = path.join(frames, 'sub');
fs.mkdirSync(subDir, { recursive: true });
const fname = n => path.join(frames, `f${String(n).padStart(5, '0')}.jpg`);
const url = pathToFileURL(path.join(here, 'film.html')).href;

async function openPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 * scale });
  page.on('pageerror', e => console.error('pageerror:', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto(url);
  await page.evaluate(() => window.ready);
  const cdp = await page.context().newCDPSession(page);
  // one CDP capture per frame: faster than page.screenshot, same pixels (the clip scale is what makes it 1920 x 1080;
  // without it CDP returns 1280 x 720 whatever deviceScaleFactor says)
  const shot = async (t, file) => {
    await page.evaluate(x => window.seek(x), t);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1280, height: 720, scale: 1.5 * scale } });
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
  };
  return { browser, page, shot };
}

const first = await openPage();
const FILM = await first.page.evaluate(() => window.FILM);
const FPS = FILM.fps, LEN = FILM.len, TOTAL = Math.round(LEN * FPS);
fs.writeFileSync(path.join(path.dirname(out), 'cues.json'), JSON.stringify({ len: LEN, fps: FPS, cues: FILM.cues, sfx: FILM.sfx, blur: FILM.blur }, null, 1));

if (!argv.includes('--encode')) {
  const SUB = parseInt(opt('--sub', '8'), 10), JOBS = parseInt(opt('--jobs', '3'), 10);
  const A = opt('--act') ? FILM.acts.find(a => a.id === opt('--act')) : null;
  const from = parseFloat(opt('--from', String(A ? A.t0 : 0))), to = Math.min(LEN, parseFloat(opt('--to', String(A ? A.t1 : LEN))));
  const f0 = Math.round(from * FPS), f1 = Math.min(TOTAL, Math.round(to * FPS));
  const blurred = n => FILM.blur.some(([a, b]) => n / FPS >= a - 1e-6 && n / FPS <= b + 1e-6);
  const work = [];
  let bi = 0;
  for (let n = f0; n < f1; n++) work.push({ n, b: blurred(n) && SUB > 1 ? bi++ : -1 });
  for (const f of fs.readdirSync(subDir)) fs.rmSync(path.join(subDir, f));
  const pages = [first];
  while (pages.length < JOBS) pages.push(await openPage());
  const t0 = Date.now();
  let done = 0, shots = 0;
  await Promise.all(pages.map(async (p, j) => {
    for (let i = j; i < work.length; i += JOBS) {
      const { n, b } = work[i];
      if (b < 0) { await p.shot(n / FPS, fname(n)); shots++; }
      else for (let k = 0; k < SUB; k++) {
        await p.shot((n + ((k + 0.5) / SUB - 0.5) * 0.8) / FPS, path.join(subDir, `s${String(b * SUB + k).padStart(6, '0')}.jpg`)); shots++;
      }
      if (++done % 150 === 0) console.log(`frame ${done}/${work.length} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
  }));
  const secs = (Date.now() - t0) / 1000;
  const nb = work.filter(w => w.b >= 0);
  if (nb.length) {
    // every SUB-th output of a SUB-frame moving average is exactly the mean of one frame's sub-frames
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(subDir, 's%06d.jpg'),
      '-vf', `tmix=frames=${SUB},select='not(mod(n+1\\,${SUB}))'`, '-fps_mode', 'passthrough', '-q:v', '1', path.join(subDir, 'avg%05d.jpg')]);
    nb.forEach((w, i) => fs.renameSync(path.join(subDir, `avg${String(i + 1).padStart(5, '0')}.jpg`), fname(w.n)));
    for (const f of fs.readdirSync(subDir)) fs.rmSync(path.join(subDir, f));
  }
  console.log(`rendered ${work.length} frames (${nb.length} blurred x ${SUB} sub-frames, ${shots} screenshots) in ${secs.toFixed(0)}s: ` +
    `${(secs / work.length).toFixed(3)} s per frame, ${(secs * JOBS / shots).toFixed(3)} s per screenshot per job (${JOBS} jobs)`);
  for (const p of pages.slice(1)) await p.browser.close();
}
await first.browser.close();

const missing = [];
for (let n = 0; n < TOTAL; n++) if (!fs.existsSync(fname(n))) missing.push(n);
if (missing.length) console.log(`not encoded: ${missing.length} frames missing (first ${missing[0]}); render them first`);
else {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.jpg'), '-frames:v', String(TOTAL),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'medium', '-r', String(FPS), '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log(`encoded ${TOTAL} frames, ${LEN}s -> ${out}`);
}
