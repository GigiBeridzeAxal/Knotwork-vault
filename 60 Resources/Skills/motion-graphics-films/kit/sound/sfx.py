# Build the sound-effects track from a cue list (numpy only, deterministic).
# usage: python3 sfx.py cues.json out.wav     |  python3 sfx.py --demo outdir
# Every event starts at its "t" (a riser ends at t+d). Peak at gain 1 is set per sound.
import sys, json, wave, os
import numpy as np
SR = 48000
def db(x): return 20*np.log10(max(float(x), 1e-9))
def tt(d): return np.arange(int(round(d*SR)))/SR
def bell(n, pk, a=2.0):  # 0..1, peak at fraction pk
    x = np.linspace(0, 1, n); e = x**a*(1-x)**(a*(1-pk)/pk); return e/e.max()
def fade(x, i=0.003, o=0.005):
    n = len(x); a = min(int(i*SR), n//2); b = min(int(o*SR), n//2)
    if a: x[:a] *= np.sin(np.linspace(0, np.pi/2, a))**2
    if b: x[n-b:] *= np.cos(np.linspace(0, np.pi/2, b))**2
    return x
def filt(x, lo=0, hi=0, o=2):  # zero-phase Butterworth-shaped band (FFT, zero padded)
    n = len(x); f = np.fft.rfftfreq(2*n, 1/SR)+1e-9; X = np.fft.rfft(x, 2*n)
    if lo: X /= np.sqrt(1+(lo/f)**(2*o))
    if hi: X /= np.sqrt(1+(f/hi)**(2*o))
    return np.fft.irfft(X, 2*n)[:n]
def band(n, fc, bw, r):  # noise whose band (bw octaves wide) follows fc[sample]
    N, H = 1024, 256; x = r.standard_normal(n+2*N); w = np.hanning(N)
    f = np.fft.rfftfreq(N, 1/SR)+1; out = np.zeros(n+2*N)
    for s in range(0, n+N, H):
        g = np.exp(-0.5*(np.log2(f/fc[min(s, n-1)])/(bw/2.355))**2)
        out[s:s+N] += np.fft.irfft(np.fft.rfft(x[s:s+N]*w)*g)*w
    return out[N//2:N//2+n]
def nrm(x): return x/max(np.abs(x).max(), 1e-12)
def pan(x, p):  # equal power, p -1..1 (scalar or per sample)
    a = (np.asarray(p)+1)*np.pi/4; return np.stack([x*np.cos(a), x*np.sin(a)], 1)
def sine(f): return np.sin(2*np.pi*np.cumsum(f)/SR)

def whoosh(d, r, big=False):
    n = int(d*SR); u = np.linspace(0, 1, n)
    lo, hi, bw, w = (200, 1600, 1.7, .5) if big else (420, 2500, 1.1, .35)
    fc = lo*(hi/lo)**bell(n, .55, 1.3); env = bell(n, .6, 2.2)
    x = nrm(band(n, fc, bw, r)) + .22*nrm(band(n, fc*2.3, 1.0, r))
    if big:
        x = x + .3*nrm(filt(r.standard_normal(n), 0, 140)) + .15*sine(70-25*u)
    return pan(fade(x*env, .005, .01), w*(2*u-1))
def riser(d, r):
    n = int(d*SR); u = np.linspace(0, 1, n); fc = 300*15**(u**1.3)
    a, b = nrm(band(n, fc, 1.0, r)), nrm(band(n, fc, 1.0, r))
    f = 200*3**(u**1.5); tone = .3*(sine(f)+sine(f*1.006)+.3*sine(f*2))
    env = u**2.2; L, R = (.75*a+.25*b+tone)*env, (.25*a+.75*b+tone)*env
    return np.stack([fade(L, .02, .006), fade(R, .02, .006)], 1)
def slam(d, r):
    t = tt(d); body = sine(45+75*np.exp(-t/.035))*np.exp(-t/.09)
    mid = .22*np.sin(2*np.pi*150*t)*np.exp(-t/.03)
    click = .2*nrm(filt(r.standard_normal(len(t))*np.exp(-t/.006), 200, 2500))
    return fade(body+mid+click, .0015, .03)
def sub(d, r):
    t = tt(d); f = 38+20*np.exp(-t/.15); x = (sine(f)+.12*sine(2*f))*np.exp(-t/.22)
    return fade(filt(x, 0, 120, 3), .03, .06)
def pop(d, r):
    t = tt(d); x = sine(420+500*np.exp(-t/.012))*np.exp(-t/.018)
    x = x+.15*nrm(filt(r.standard_normal(len(t))*np.exp(-t/.0015), 1000, 6000))
    return fade(x, .0015, .008)
def tick(d, r, c, tau, fb):
    t = tt(d); k = nrm(filt(r.standard_normal(len(t))*np.exp(-t/tau), c/1.6, c*1.6))
    return k, np.sin(2*np.pi*fb*t)*np.exp(-t/(tau*2.5))
def tap(d, r):
    k, b = tick(d, r, 2500, .0035, 260); return fade(.8*k+.6*b, .0008, .01)
def typing(d, r):
    n = int(d*SR); x = np.zeros((n+SR//10, 2)); k = int(d*17)
    for i in range(k):
        s = int(max(0, i/17+r.normal(0, .012))*SR)
        a, b = tick(.03, r, r.uniform(1800, 3800), r.uniform(.002, .004), r.uniform(350, 600))
        y = pan(fade(a+.5*b, .0005, .006)*10**(r.uniform(-4, 0)/20), r.uniform(-.15, .15))
        x[s:s+len(y)] += y
    return x[:n]
def flap(d, r):  # split-flap board: a dense clatter of dry clacks that thins out as the cells land
    n = int(d*SR); x = np.zeros((n+SR//10, 2)); t0 = 0.0; i = 0
    while t0 < d:
        u = t0/max(d, 1e-6); rate = 30*(1-0.55*u)                      # clacks per second, slowing
        s = int(max(0, t0+r.normal(0, .004))*SR)
        a, b = tick(.045, r, r.uniform(900, 1900), r.uniform(.003, .006), r.uniform(170, 260))
        last = t0+1/rate >= d
        y = pan(fade(a+.8*b, .0005, .01)*10**((0 if last else r.uniform(-7, -1))/20), r.uniform(-.35, .35))
        x[s:s+len(y)] += y; t0 += 1/rate*r.uniform(.75, 1.25); i += 1
    return x[:n+SR//20]
def swish(d, r):
    n = int(d*SR); u = np.linspace(0, 1, n); fc = 1500*2.8**(u**.8)
    x = (nrm(band(n, fc, 1.4, r))+.2*nrm(band(n, fc*2, 1, r)))*bell(n, .45, 1.8)
    return pan(fade(x, .004, .01), .4*u-.2)
def ding(d, r):
    t = tt(d+.11); x = np.zeros((len(t), 2))
    for f, t0, a, p in ((659.3, 0, .8, -.15), (987.8, .11, 1, .15)):
        s = int(t0*SR); u = t[:len(t)-s]
        y = sum(m*np.sin(2*np.pi*f*h*u)*np.exp(-u/tau) for h, m, tau in
                ((1, 1, .3), (1.002, .3, .3), (2, .2, .12), (3, .06, .06)))
        x[s:] += pan(fade(y*a, .002, .15), p)
    return x
FX = {'whoosh': (whoosh, .4, -11), 'whooshBig': (lambda d, r: whoosh(d, r, True), .6, -8),
      'riser': (riser, .8, -11), 'slam': (slam, .3, -8), 'sub': (sub, .6, -11),
      'pop': (pop, .07, -17), 'tap': (tap, .05, -17), 'type': (typing, 1.0, -24),
      'swish': (swish, .25, -15), 'ding': (ding, .9, -11), 'flap': (flap, .8, -19)}

def render(name, d, gain, seed):
    fn, d0, pk = FX[name]; d = float(d or d0)
    x = np.asarray(fn(d, np.random.default_rng(seed)), float)
    if x.ndim == 1: x = pan(x, 0)*np.sqrt(2)
    return x/max(np.abs(x).max(), 1e-12)*10**(pk/20)*gain, d
def limit(x, ceil_db=-3.0):  # look-ahead gain limiter, never above ceiling
    c = 10**(ceil_db/20); B = 240; n = len(x); m = -(-n//B)
    env = np.pad(np.abs(x).max(1), (0, m*B-n)).reshape(m, B).max(1)
    g = np.minimum(1, c/np.maximum(env, 1e-12))
    g = np.minimum(g, np.minimum(np.r_[g[1:], 1], np.r_[1, g[:-1]]))
    g = np.interp(np.arange(n), np.arange(m)*B+B/2, g)
    return np.clip(x*g[:, None], -c, c)
def write(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(np.round(np.clip(x, -1, 1)*32767).astype('<i2').tobytes())
def build(cues, out):
    n = int(round(float(cues['len'])*SR)); tr = np.zeros((n, 2))
    for i, e in enumerate(cues.get('sfx', [])):
        nm = e.get('name'); g = float(e.get('gain', 1)); t = float(e['t'])
        if nm not in FX: print(f'warning: unknown sound {nm!r} at t={t:.2f}, skipped'); continue
        x, d = render(nm, e.get('d'), g, 1000+i); s = int(round(t*SR))
        k = max(0, min(len(x), n-s))
        if s < 0 or k < len(x): print(f'warning: {nm} at t={t:.2f} runs outside the track, cut')
        y = x[:k].copy(); b = min(k, 480)
        if k < len(x) and b: y[-b:] *= np.linspace(1, 0, b)[:, None]**2  # cut at the end: 10 ms fade, no click
        if s >= 0: tr[s:s+k] += y
        print(f't={t:6.2f}  {nm:9s} gain={g:.2f} d={d:.2f}  peak {db(np.abs(x).max()):6.1f} dBFS')
    raw = np.abs(tr).max(); tr = limit(tr)
    print(f'track {n/SR:.3f} s  peak before limiter {db(raw):.1f} dBFS, after {db(np.abs(tr).max()):.1f} dBFS')
    write(out, tr)

def stft_db(m, N=2048, H=480):
    fr = np.lib.stride_tricks.sliding_window_view(np.pad(m, (N//2, N)), N)[::H]
    return 20*np.log10(np.abs(np.fft.rfft(fr*np.hanning(N), axis=1))/N*4+1e-9)
def demo(od):
    from PIL import Image, ImageDraw
    os.makedirs(od, exist_ok=True); names = list(FX); gap = 1.2
    tr = np.zeros((int((len(names)*gap+.3)*SR), 2))
    print(f'{"sound":9s} {"len s":>6s} {"peak":>6s} {"rms":>6s} {"centroid":>8s} {"<120Hz":>7s} {">6kHz":>6s}')
    for i, nm in enumerate(names):
        x, d = render(nm, None, 1, 1000+i); s = int((.2+i*gap)*SR); tr[s:s+len(x)] += x
        m = x.mean(1); P = np.abs(np.fft.rfft(m))**2; f = np.fft.rfftfreq(len(m), 1/SR); E = P.sum()
        print(f'{nm:9s} {len(x)/SR:6.3f} {db(np.abs(x).max()):6.1f} {db(np.sqrt((x**2).mean())):6.1f} '
              f'{(f*P).sum()/E:8.0f} {P[f < 120].sum()/E:7.1%} {P[f > 6000].sum()/E:6.1%}')
    tr = limit(tr); write(os.path.join(od, 'demo.wav'), tr)
    S = stft_db(tr.mean(1)); fb = np.fft.rfftfreq(2048, 1/SR); Hh = 360
    fy = 30*(16000/30)**(np.arange(Hh)[::-1]/(Hh-1))
    img = np.array([np.interp(fy, fb, col) for col in S]).T
    v = np.clip((img+100)/80, 0, 1)
    cm = np.array([[0, 0, 4], [60, 15, 110], [180, 50, 120], [250, 140, 60], [252, 250, 190]], float)
    rgb = np.stack([np.interp(v, np.linspace(0, 1, 5), cm[:, k]) for k in range(3)], -1).astype(np.uint8)
    W = rgb.shape[1]; L, T = 46, 34
    im = Image.new('RGB', (W+L+10, Hh+T+24), (20, 20, 24)); im.paste(Image.fromarray(rgb), (L, T))
    dr = ImageDraw.Draw(im); px = SR/480
    for i, nm in enumerate(names): dr.text((L+int((.2+i*gap)*px), 4+12*(i % 2)), nm, fill=(255, 255, 255))
    for s in range(int(len(tr)/SR)+1):
        x0 = L+int(s*px); dr.line([(x0, T+Hh), (x0, T+Hh+5)], fill=(200, 200, 200)); dr.text((x0+2, T+Hh+6), f'{s}s', fill=(200, 200, 200))
    for hz in (50, 100, 200, 500, 1000, 2000, 5000, 10000):
        y = T+int((Hh-1)*(1-np.log(hz/30)/np.log(16000/30))); dr.line([(L-5, y), (L, y)], fill=(200, 200, 200))
        dr.text((2, y-6), f'{hz//1000}k' if hz >= 1000 else str(hz), fill=(200, 200, 200))
    im.save(os.path.join(od, 'demo.png')); print('wrote', os.path.join(od, 'demo.wav'), 'and demo.png')

if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) == 2 and a[0] == '--demo': demo(a[1])
    elif len(a) == 2: build(json.load(open(a[0])), a[1])
    else: sys.exit(__doc__ or 'usage: sfx.py cues.json out.wav | sfx.py --demo outdir')
