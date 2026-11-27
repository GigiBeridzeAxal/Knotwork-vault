"""Write measured narration lengths into the act timelines.

Usage: python3 retime5.py clips.json FILM/v5/acts
clips.json: [{"id": "y1", "dur": 1.83, ...}, ...]. Each id's `dur` is rewritten in the one acts/*.tl.js line that starts
the shot as `{ id: 'y1', vis: N, dur: N,`. Prints the old and new film length (the sum of max(vis, lead + dur + tail)
per shot, each rounded up to a whole frame, with lead and tail from ../timeline.js unless the shot sets its own).
An id that no file holds, or that two files hold, is an error and nothing is written.
"""
import json, math, pathlib, re, sys

clips, acts = json.load(open(sys.argv[1])), pathlib.Path(sys.argv[2])
glob = (acts.parent / 'timeline.js').read_text()
num = lambda k: float(re.search(rf'^\s*{k}: ([\d.]+),', glob, re.M).group(1))
FPS, LEAD, TAIL = num('fps'), num('lead'), num('tail')
HEAD = re.compile(r"\{ id: '(\w+)', vis: ([\d.]+), dur: ([\d.]+),")
files = {p: p.read_text() for p in sorted(acts.glob('*.tl.js'))}


def length(texts):
    total = 0
    for text in texts:
        for m in HEAD.finditer(text):
            body = text[m.end():text.find('\n    {', m.end()) if '\n    {' in text[m.end():] else len(text)]
            get = lambda k, d: float(x.group(1)) if (x := re.search(rf'\b{k}: ([\d.]+)', body)) else d
            total += math.ceil(max(float(m.group(2)), get('lead', LEAD) + float(m.group(3)) + get('tail', TAIL)) * FPS - 1e-6) / FPS
    return total


old = length(files.values())
new_files, errors = dict(files), []
for c in clips:
    hits = [p for p, t in new_files.items() if re.search(rf"\{{ id: '{re.escape(c['id'])}', vis: ", t)]
    if len(hits) != 1:
        errors.append(f"{c['id']}: found in {len(hits)} files")
        continue
    p = hits[0]
    new_files[p] = re.sub(rf"(\{{ id: '{re.escape(c['id'])}', vis: [\d.]+, dur: )[\d.]+,", lambda m: f"{m.group(1)}{round(float(c['dur']), 3)},", new_files[p])
if errors:
    sys.exit('retime5: nothing written\n' + '\n'.join(errors))
for p, t in new_files.items():
    if t != files[p]:
        p.write_text(t)
print(f'film length: {old:.2f} s -> {length(new_files.values()):.2f} s ({len(clips)} shots retimed)')
