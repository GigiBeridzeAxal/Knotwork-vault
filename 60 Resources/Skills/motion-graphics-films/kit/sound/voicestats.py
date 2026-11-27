# Rough voice numbers from an audio file: pitch (median, range), brightness, syllable rate.
# usage: python3 voicestats.py name=file [name=file ...]
import sys, subprocess, numpy as np
def load(p):
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32)/32768.0
def stats(x, sr=16000):
    n=int(0.04*sr); h=int(0.01*sr); f0=[]; en=[]
    lo=int(sr/400); hi=int(sr/65)
    for i in range(0, len(x)-n, h):
        w = x[i:i+n]; e = float(np.sqrt(np.mean(w*w))); en.append(e)
        if e < 0.02: f0.append(0); continue
        w = w-np.mean(w); ac = np.correlate(w, w, 'full')[n-1:]
        if ac[0] <= 0: f0.append(0); continue
        ac = ac/ac[0]; k = lo+int(np.argmax(ac[lo:hi]))
        f0.append(sr/k if ac[k] > 0.45 else 0)
    f0=np.array(f0); en=np.array(en); v=f0[f0>0]
    if len(v) < 20: return None
    med=float(np.median(v)); p10,p90=np.percentile(v,[10,90]); span=12*np.log2(p90/p10)
    speech = en > 0.02; dur = speech.sum()*0.01
    k=np.ones(7)/7; sm=np.convolve(en,k,'same'); pk=0
    for i in range(2,len(sm)-2):
        if sm[i]>0.03 and sm[i]>sm[i-1] and sm[i]>=sm[i+1] and sm[i]>1.15*min(sm[max(0,i-6):i+7]): pk+=1
    X=np.abs(np.fft.rfft(x[:sr*20])); fr=np.fft.rfftfreq(len(x[:sr*20]),1/sr); cen=float((X*fr).sum()/X.sum())
    return med, span, pk/max(dur,0.1), cen, len(x)/sr, dur
for a in sys.argv[1:]:
    name, path = a.split('=',1)
    try:
        s = stats(load(path))
        print(name, 'f0 %.0fHz span %.1fst rate %.1f/s bright %.0fHz len %.1fs speech %.1fs' % s if s else 'no voice', flush=True)
    except Exception as e:
        print(name, 'ERR', e, flush=True)
