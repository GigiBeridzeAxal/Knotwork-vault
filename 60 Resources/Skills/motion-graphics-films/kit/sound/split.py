# Split one narration take into one clip per script line.
# usage: python3 split.py take.mp3 lines.json outdir
import sys, json, re, subprocess, difflib, os
audio, lines_json, outdir = sys.argv[1:4]
os.makedirs(outdir, exist_ok=True)
lines = json.load(open(lines_json))
err = subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',audio,'-af','silencedetect=noise=-38dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
sil=[]; s=None
for m in re.finditer(r'silence_(start|end): (-?[0-9.]+)', err):
    if m.group(1)=='start': s=max(0.0,float(m.group(2)))
    else: sil.append((0.0 if s is None else s, float(m.group(2)))); s=None
total = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',audio],capture_output=True,text=True).stdout)
if s is not None: sil.append((s,total))
cache = audio + '.words.json'
if os.path.exists(cache):
    words = json.load(open(cache))
else:
    from faster_whisper import WhisperModel
    m = WhisperModel('large-v3', device='cpu', compute_type='int8', cpu_threads=int(os.environ.get('WTHREADS','1')))
    # Whisper loses words in a long take, so it gets short pieces cut at pauses (each at least 6 s).
    marks=[0.0]
    for x in sil:
        mid=(x[0]+x[1])/2
        if x[1]-x[0] >= 0.2 and mid-marks[-1] >= 6.0 and total-mid >= 1.5: marks.append(mid)
    marks.append(total)
    words=[]; piece = cache + '.piece.wav'; part = cache + '.part'; done = 0
    if os.path.exists(part):
        pj = json.load(open(part)); done, words = pj['done'], pj['words']
    for i in range(len(marks)-1):
        if i < done: continue
        subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',f'{marks[i]:.3f}','-to',f'{marks[i+1]:.3f}','-i',audio,'-ar','16000','-ac','1',piece],check=True)
        segs,_ = m.transcribe(piece, language='ka', beam_size=5, word_timestamps=True, condition_on_previous_text=False)
        words += [[round(w.start+marks[i],2),round(w.end+marks[i],2),w.word.strip()] for s_ in segs for w in (s_.words or [])]
        print('heard', f'{marks[i]:.2f}-{marks[i+1]:.2f}', flush=True)
        json.dump({'done': i+1, 'words': words}, open(part,'w'), ensure_ascii=False)
    os.remove(piece)
    json.dump(words, open(cache,'w'), ensure_ascii=False)
norm = lambda x: re.sub(r'[\W_]','',x.lower())
S=''; bounds=[]
for ln in lines:
    S += norm(ln['say']); bounds.append(len(S))
T=''; owner=[]
for i,w in enumerate(words):
    n = norm(w[2]); T += n; owner += [i]*len(n)
ops = difflib.SequenceMatcher(None, S, T, autojunk=False).get_opcodes()
def s2t(pos):
    for tag,i1,i2,j1,j2 in ops:
        if i1 <= pos <= i2:
            if tag=='equal': return j1 + (pos-i1)
            if i2==i1: return j1
            return j1 + round((pos-i1)/(i2-i1)*(j2-j1))
    return len(T)
cuts=[0.0]; firsts=[0]
for b in bounds[:-1]:
    j = s2t(b); k = owner[j] if j < len(owner) else len(words)-1   # first word of the next line
    firsts.append(k)
    a_end = words[k-1][1] if k>0 else 0.0; b_start = words[k][0]
    cand = [x for x in sil if x[1] > a_end-0.35 and x[0] < b_start+0.35]
    if cand:
        best = max(cand, key=lambda x: (x[1]-x[0]) - abs((x[0]+x[1])/2 - (a_end+b_start)/2)*0.5)
        cuts.append((best[0]+best[1])/2)
    else:
        cuts.append((a_end+b_start)/2)
cuts.append(total); firsts.append(len(words))
res=[]
for i,ln in enumerate(lines):
    a,b = cuts[i], cuts[i+1]
    for x in sil:                       # trim leading and trailing silence
        if x[0] <= a+0.02 and x[1] > a: a = max(a, x[1]-0.04)
        if x[1] >= b-0.02 and x[0] < b: b = min(b, x[0]+0.08)
    d = b-a
    if d < 0.2: sys.exit(f"line {ln['id']} got no audio ({a:.2f}-{b:.2f}): the transcript does not cover the take")
    out = os.path.join(outdir, ln['id']+'.wav')
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',f'{a:.3f}','-to',f'{b:.3f}','-i',audio,'-af',f'afade=t=in:d=0.012,afade=t=out:st={max(0,d-0.04):.3f}:d=0.04','-ar','48000','-ac','1',out],check=True)
    heard = ' '.join(w[2] for w in words[firsts[i]:firsts[i+1]])   # the words the alignment gives this line
    match = round(difflib.SequenceMatcher(None, norm(ln['say']), norm(heard), autojunk=False).ratio(), 2)
    res.append({'id':ln['id'],'from':round(a,3),'to':round(b,3),'dur':round(d,3),'cps':round(len(ln['say'])/d,1),'match':match,'heard':heard})
    print(ln['id'], f'{a:6.2f} {b:6.2f} dur {d:5.2f} cps {len(ln["say"])/d:4.1f} match {match:4.2f} |', ln['say'], '|', heard)
json.dump(res, open(os.path.join(outdir,'clips.json'),'w'), ensure_ascii=False, indent=1)
