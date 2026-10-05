# Word-level timing for the voiceover with Whisper, mapped back onto the exact script words.
# Output: voice/out/words.json  [{cue, i, word, start, end}] in voiceover-file time.
import json, re, sys, difflib
import whisper

voice = json.load(open('../voice/out/timing.json'))
model = whisper.load_model(sys.argv[1] if len(sys.argv) > 1 else 'base.en')
res = model.transcribe('../voice/out/voiceover.wav', word_timestamps=True, language='en', condition_on_previous_text=False)
heard = [w for seg in res['segments'] for w in seg.get('words', [])]
norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower().replace('’', "'"))

# script words with their cue ids
script = []
for c in voice['cues']:
    for i, w in enumerate(c['text'].split()):
        script.append({'cue': c['id'], 'i': i, 'word': w, 'n': norm(w)})

a = [s['n'] for s in script]
b = [norm(h['word']) for h in heard]
sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        for k in range(i2 - i1):
            script[i1 + k]['start'] = heard[j1 + k]['start']; script[i1 + k]['end'] = heard[j1 + k]['end']
    elif tag == 'replace' and j2 > j1:
        # spread the heard span over the script words
        t0, t1 = heard[j1]['start'], heard[j2 - 1]['end']
        n = i2 - i1
        for k in range(n):
            script[i1 + k]['start'] = t0 + (t1 - t0) * k / n; script[i1 + k]['end'] = t0 + (t1 - t0) * (k + 1) / n

# fill any gaps by interpolating inside the paragraph's exact start/end
cues = {c['id']: c for c in voice['cues']}
for c in voice['cues']:
    ws = [s for s in script if s['cue'] == c['id']]
    for k, s in enumerate(ws):
        if 'start' not in s or not (c['start'] - 0.3 <= s['start'] <= c['end'] + 0.3):
            s['start'] = c['start'] + (c['end'] - c['start']) * k / len(ws); s['end'] = c['start'] + (c['end'] - c['start']) * (k + 1) / len(ws); s['est'] = True
matched = sum(1 for s in script if not s.get('est'))
json.dump([{k: (round(v, 3) if isinstance(v, float) else v) for k, v in s.items() if k != 'n'} for s in script], open('../voice/out/words.json', 'w'))
print(f'{matched}/{len(script)} words timed by Whisper, rest interpolated')
