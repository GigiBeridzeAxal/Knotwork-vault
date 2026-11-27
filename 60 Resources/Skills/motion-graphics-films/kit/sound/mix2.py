# Lay narration, effects and optional music on the picture; two-pass loudnorm to -16 LUFS / -1.5 dBTP.
# usage: python3 mix2.py picture.mp4 cues.json clipsdir sfx.wav out.mp4 [--music file]
#        [--voice-db 0] [--sfx-db -10] [--music-db -19]
# Works with ffmpeg 5.1+ (adelay all=1, amix normalize=0, sidechaincompress, alimiter level=0, loudnorm).
import sys, os, json, re, argparse, subprocess, tempfile
import numpy as np
SR, TARGET, TP = 48000, -16.0, -2.0   # TP: aim under -1.5 so the AAC encode keeps margin
AF = 'aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts='
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: sys.exit('ffmpeg failed: ' + ' '.join(cmd[:6]) + ' ...\n' + r.stderr[-2500:])
    return r
def probe(p, sel):
    o = run(['ffprobe', '-v', 'error', '-select_streams', sel, '-show_entries',
             'stream=duration:format=duration', '-of', 'json', p]).stdout
    j = json.loads(o); s = j.get('streams') or [{}]
    return float(s[0].get('duration') or j['format']['duration'])
def ln(err):
    j = json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}', err)[-1]); return {k: float(v) if k != 'normalization_type' else v for k, v in j.items()}
def measure(inputs, graph, wav):  # render the premaster to wav and measure it in the same call
    g = graph + ';[pre]asplit[p1][p2];[p2]loudnorm=I=%g:TP=%g:LRA=20:print_format=json[m]' % (TARGET, TP)
    r = run(['ffmpeg', '-y', '-hide_banner', '-nostats', *inputs, '-filter_complex', g,
             '-map', '[p1]', '-c:a', 'pcm_f32le', wav, '-map', '[m]', '-f', 'null', '-'])
    return ln(r.stderr)

a = argparse.ArgumentParser()
for k in ('picture', 'cues', 'clips', 'sfx', 'out'): a.add_argument(k)
a.add_argument('--music'); a.add_argument('--voice-db', type=float, default=0)
a.add_argument('--sfx-db', type=float, default=-10); a.add_argument('--music-db', type=float, default=-19)
A = a.parse_args()
L = probe(A.picture, 'v:0'); C = json.load(open(A.cues))
cues = sorted(C['cues'] if isinstance(C, dict) else C, key=lambda c: c['voiceAt'])
miss = [c['id'] for c in cues if not os.path.exists(os.path.join(A.clips, c['id'] + '.wav'))]
if miss: sys.exit('error: missing narration clip(s): ' + ', '.join(os.path.join(A.clips, m + '.wav') for m in miss))
sig = []
for i, c in enumerate(cues):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(A.clips, c['id'] + '.wav'), '-f', 'f32le',
                        '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True)
    x = np.frombuffer(r.stdout, np.float32); sig.append(x); end = c['voiceAt'] + len(x) / SR
    nxt = cues[i + 1]['voiceAt'] if i + 1 < len(cues) else L
    if end > nxt + 1e-3:
        print(f'WARNING: clip {c["id"]} ({len(x)/SR:.2f} s from {c["voiceAt"]:.2f}) runs {end-nxt:.2f} s past '
              + (f'the next cue {cues[i+1]["id"]} at {nxt:.2f}' if i + 1 < len(cues) else f'the end of the picture ({L:.2f} s)'))
# speech level of all clips (20 ms frames within 30 dB of the loudest) -> pre-gain to -20 dBFS RMS,
# so the compressor and the music ducking behave the same whatever the clips' recording level
v = np.concatenate(sig); f = v[:len(v)//960*960].reshape(-1, 960); fr = np.sqrt((f.astype(float)**2).mean(1)) + 1e-9
act = fr[fr > fr.max() * 10**(-30/20)]; vrms = 20*np.log10(np.sqrt((act**2).mean()))
pg = -20 - vrms; print(f'voice speech RMS {vrms:.1f} dBFS, pre-gain {pg:+.1f} dB')

ins = ['-i', A.sfx]; fl = []; tags = ''
for i, c in enumerate(cues):
    ins += ['-i', os.path.join(A.clips, c['id'] + '.wav')]
    fl.append(f'[{i+1}:a]{AF}mono,adelay={int(round(c["voiceAt"]*1000))}:all=1[c{i}]'); tags += f'[c{i}]'
n = len(cues); pad = f'apad=whole_dur={L:.3f},atrim=0:{L:.3f},asetpts=PTS-STARTPTS'
fl.append(f'{tags}amix=inputs={n}:normalize=0:dropout_transition=0,volume={pg:.2f}dB,highpass=f=70,'
          f'acompressor=threshold=-18dB:ratio=2.5:attack=10:release=150:knee=4,{pad},{AF}stereo,asplit[vk][vv]')
fl.append(f'[vv]volume={A.voice_db}dB[v]')
fl.append(f'[0:a]{AF}stereo,volume={A.sfx_db}dB,{pad}[s]')
mix = '[v][s]'
if A.music:
    ins = ['-stream_loop', '-1', '-i', A.music] + ins   # music becomes input 0, shift the others
    fl = [re.sub(r'\[(\d+):a\]', lambda m: f'[{int(m.group(1))+1}:a]', s) for s in fl]
    fl.append(f'[0:a]{AF}stereo,atrim=0:{L:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.3,'
              f'afade=t=out:st={L-1.5:.3f}:d=1.5,volume={A.music_db}dB,{pad}[mu]')
    # ducking: key is the voice at about -20 dBFS RMS -> roughly 5-7 dB of gain reduction while speaking
    fl.append('[mu][vk]sidechaincompress=threshold=-31dB:ratio=2:knee=4:attack=30:release=250:detection=rms[md]')
    mix += '[md]'
else:
    fl.append('[vk]anullsink')
fl.append(f'{mix}amix=inputs={len(mix)//3}:normalize=0:dropout_transition=0,{pad}[pre]')
graph = ';'.join(fl)
tmp = tempfile.mkdtemp(prefix='mix2_'); pre = os.path.join(tmp, 'pre.wav')
m = measure(ins, graph, pre)
gain = TARGET - m['input_i']
print(f'premaster: I {m["input_i"]:.1f} LUFS, TP {m["input_tp"]:.1f} dBTP, LRA {m["input_lra"]:.1f} LU, gain {gain:+.1f} dB')
if m['input_tp'] + gain > TP - 0.2:   # linear gain would exceed the peak target: limit peaks first (4x oversampled)
    lim = 10**((TP - 0.4 - gain) / 20); s = 1.0
    if lim < 0.0625: s = lim / 0.0625; lim = 0.0625
    pre2 = os.path.join(tmp, 'pre2.wav')
    g = (f'[0:a]volume={s:.6f},aresample=192000,alimiter=limit={lim:.6f}:attack=2:release=60:level=0,'
         f'aresample=48000,volume={1/s:.6f},{pad}[pre]')
    print(f'peaks too high for a linear gain: limiting at {20*np.log10(lim/s):.1f} dBFS (oversampled)')
    m = measure(['-i', pre], g, pre2); pre = pre2
lnf = (f'loudnorm=I={TARGET}:TP={TP}:LRA=20:measured_I={m["input_i"]}:measured_TP={m["input_tp"]}:'
       f'measured_LRA={m["input_lra"]}:measured_thresh={m["input_thresh"]}:offset={m["target_offset"]}:'
       f'linear=true:print_format=json')
r = run(['ffmpeg', '-y', '-hide_banner', '-nostats', '-i', A.picture, '-i', pre, '-filter_complex',
         f'[1:a]{lnf},aresample=48000,{pad}[a]', '-map', '0:v:0', '-map', '[a]', '-c:v', 'copy',
         '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-t', f'{L:.3f}', '-movflags', '+faststart', A.out])
print('loudnorm pass 2 mode:', ln(r.stderr).get('normalization_type', '?'))
r = run(['ffmpeg', '-hide_banner', '-nostats', '-i', A.out, '-map', '0:a:0', '-af',
         'loudnorm=print_format=json', '-f', 'null', '-'])
o = ln(r.stderr)
print(f'OUTPUT {A.out}: integrated {o["input_i"]:.1f} LUFS, true peak {o["input_tp"]:.1f} dBTP, '
      f'LRA {o["input_lra"]:.1f} LU; video {probe(A.out, "v:0"):.3f} s, audio {probe(A.out, "a:0"):.3f} s')
for p in os.listdir(tmp): os.remove(os.path.join(tmp, p))
os.rmdir(tmp)
