# Make a narration clip brisk: every pause longer than `keep` is cut down to `keep`, then a small speed-up (pitch kept).
# usage: python3 tight.py in.wav out.wav [tempo=1.10] [keep=0.14]
import sys, re, subprocess
src, dst = sys.argv[1:3]
tempo = float(sys.argv[3]) if len(sys.argv) > 3 else 1.10
keep = float(sys.argv[4]) if len(sys.argv) > 4 else 0.14
total = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',src],capture_output=True,text=True).stdout)
err = subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',src,'-af','silencedetect=noise=-38dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
sil=[]; s=None
for m in re.finditer(r'silence_(start|end): (-?[0-9.]+)', err):
    if m.group(1)=='start': s=max(0.0,float(m.group(2)))
    elif s is not None: sil.append((s,float(m.group(2)))); s=None
segs=[]; pos=0.0
for a,b in sil:
    if a <= 0.02 or b >= total-0.02 or b-a <= keep+0.04: continue      # leave the ends and short pauses alone
    segs.append((pos, a+keep/2)); pos = b-keep/2
segs.append((pos,total))
parts=[]; names=[]
for i,(a,b) in enumerate(segs):
    parts.append(f'[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={max(0,b-a-0.008):.3f}:d=0.008[s{i}]'); names.append(f'[s{i}]')
fc=';'.join(parts)+';'+''.join(names)+f'concat=n={len(segs)}:v=0:a=1,atempo={tempo}[o]'
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',src,'-filter_complex',fc,'-map','[o]','-ar','48000','-ac','1',dst],check=True)
out = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',dst],capture_output=True,text=True).stdout)
print(f'{src}: {total:.2f}s -> {out:.2f}s, {len(segs)-1} pauses cut, tempo {tempo}')
