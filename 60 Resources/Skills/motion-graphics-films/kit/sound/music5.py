# Stretch the 48 s music bed to the film: the drop lands on --hit, bars are repeated on the beat grid.
# usage: python3 music5.py music.mp3 out.wav --hit 21.0 --len 93.6 [--insert 8,8,4] [--duck -5]
import sys, argparse, subprocess, numpy as np, wave
import librosa
SR = 48000
a = argparse.ArgumentParser(); a.add_argument('src'); a.add_argument('out')
a.add_argument('--hit', type=float, required=True); a.add_argument('--len', type=float, required=True)
a.add_argument('--insert', default=''); a.add_argument('--duck', type=float, default=-5.0)
a.add_argument('--drop', type=float, default=16.30)
A = a.parse_args()
raw = subprocess.run(['ffmpeg','-v','error','-i',A.src,'-f','f32le','-ac','2','-ar',str(SR),'-'],capture_output=True,check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64); D = len(x)/SR
mono = librosa.resample(x.mean(1), orig_sr=SR, target_sr=22050)
oenv = librosa.onset.onset_strength(y=mono, sr=22050, hop_length=256)
tempo, beats = librosa.beat.beat_track(onset_envelope=oenv, sr=22050, hop_length=256, units='time')
per = float(np.median(np.diff(beats))); bar = 4*per
b0 = float(beats[np.argmin(np.abs(beats-A.drop))])           # the downbeat of the drop
def snap(t):                                                  # the real onset near a grid time, minus 12 ms
    fr = librosa.time_to_frames(t, sr=22050, hop_length=256); w = 4
    k = fr-w+int(np.argmax(oenv[max(0, fr-w):fr+w+1])); return float(librosa.frames_to_time(k, sr=22050, hop_length=256))-0.012
grid = lambda n: snap(b0+n*bar)                               # downbeat n bars after the drop (n may be negative)
print(f'track {D:.2f} s, beat {per:.4f} s, bar {bar:.4f} s, drop downbeat {b0:.3f} s (cut at {grid(0):.3f})')
segs = []                                                     # (start, end) in track seconds, played in order
# intro: the 8 bars before the drop, with whole bars repeated (or cut from the front) so that it lasts --hit
need = A.hit - (grid(0) - 0.0)
k = int(np.ceil(max(0.0, need)/bar - 1e-9)) if need > 0 else 0
intro = [(0.0, grid(-2))] + [(grid(-4), grid(-2))]*(k//2) + ([(grid(-3), grid(-2))] if k % 2 else []) + [(grid(-2), grid(0))]
ilen = sum(e-s for s, e in intro); cut = ilen - A.hit        # trim this much from the very start
out = []; acc = 0.0
for s, e in intro:
    if acc + (e-s) <= cut: acc += e-s; continue
    if acc < cut: s += cut-acc; acc = cut
    out.append((s, e)); acc += e-s
segs += out
ins = [int(v) for v in A.insert.split(',') if v]
for n in ins: segs.append((grid(0), grid(n)))
segs.append((grid(0), D))
# render with 10 ms equal-power crossfades at the seams
X = int(0.010*SR); y = np.zeros((0, 2)); marks = []
for i, (s, e) in enumerate(segs):
    s0 = max(0, int(round(s*SR)) - (X if i else 0)); e0 = min(len(x), int(round(e*SR)))
    c = x[s0:e0].copy()
    if i:
        f = np.sin(np.linspace(0, np.pi/2, X))[:, None]
        y[-X:] = y[-X:]*np.cos(np.linspace(0, np.pi/2, X))[:, None] + c[:X]*f; c = c[X:]
        marks.append(len(y)/SR)
    y = np.concatenate([y, c])
hit = sum(e-s for s, e in out)
print('plan:', ' | '.join(f'{s:.2f}-{e:.2f}' for s, e in segs))
print(f'seams at {", ".join(f"{m:.2f}" for m in marks)} s; drop lands at {hit:.3f} s (wanted {A.hit:.3f}); music ends at {len(y)/SR:.2f} s, film {A.len:.2f} s')
# after the drop: one bar at full level, then down by --duck dB over 1.2 s (keeps the bed under the voice)
t = np.arange(len(y))/SR; g = np.interp(t, [0, hit+bar*0.5, hit+bar*0.5+1.2, 1e9], [0, 0, A.duck, A.duck])
y = y*(10**(g/20))[:, None]
n = int(round(A.len*SR))
if len(y) < n: y = np.concatenate([y, np.zeros((n-len(y), 2))])
with wave.open(A.out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(np.round(np.clip(y, -1, 1)*32767).astype('<i2').tobytes())
