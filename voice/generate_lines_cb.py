# Chatterbox narration builder (Vio's voice: the built-in Chatterbox voice). Runs in the Chatterbox venv:
#   /opt/cb/bin/python generate_lines_cb.py <lines.json> <outdir> [only_ids,comma,separated] [tempo]
# tempo < 1 slows each line down (pitch kept, via ffmpeg rubberband), e.g. 0.9 for a calmer, longer read.
# Same inputs/outputs as generate_lines.py: lines.json = [{"s", "gap", "text"}]; writes <outdir>/lines/NN.wav,
# then <outdir>/voiceover.wav and timing.json. Pass ids to regenerate just those lines (e.g. after a check).
import sys, os, json, re, subprocess, numpy as np, soundfile as sf, torch
from chatterbox.tts import ChatterboxTTS
lines = json.load(open(sys.argv[1])); out = sys.argv[2]
only = set(int(x) for x in sys.argv[3].split(',')) if len(sys.argv) > 3 and sys.argv[3] else None
TEMPO = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
os.makedirs(f"{out}/lines", exist_ok=True)
FIX = [(r"\bUS\b", "U S"), (r"\bVio\b", "Vio")]
SR = 24000
m = None
for i, l in enumerate(lines):
    p = f"{out}/lines/{i:02d}.wav"
    if os.path.exists(p) and (only is None or i not in only): continue
    if m is None: m = ChatterboxTTS.from_pretrained(device="cpu")
    say = l["text"]
    for a, b in FIX: say = re.sub(a, b, say)
    torch.manual_seed(1000 + i + (7 if only else 0))
    wav = m.generate(say, exaggeration=l.get("exaggeration", 0.45), cfg_weight=l.get("cfg", 0.5)).squeeze(0).numpy()
    # trim leading/trailing silence
    idx = np.where(np.abs(wav) > 0.01)[0]
    if len(idx): wav = wav[max(0, idx[0] - 1200): idx[-1] + 2400]
    sf.write(p, wav, SR)
    if TEMPO != 1.0:
        tmp = p + '.tmp.wav'; os.replace(p, tmp)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'rubberband=tempo={TEMPO}', '-ar', str(SR), p], check=True); os.remove(tmp)
    print(i, f"{sf.info(p).duration:.1f}s", flush=True)
parts, timing, t = [], [], 0.0
for i, l in enumerate(lines):
    a, sr = sf.read(f"{out}/lines/{i:02d}.wav"); parts.append(a)
    timing.append({"id": i, "section": l["s"], "start": round(t, 3), "end": round(t + len(a) / sr, 3), "text": l["text"], "voice": "chatterbox"})
    t += len(a) / sr
    gap = l.get("gap", 0.3); parts.append(np.zeros(int(gap * sr))); t += gap
sf.write(f"{out}/voiceover.wav", np.concatenate(parts), SR)
json.dump({"voice": "chatterbox", "duration": round(t, 3), "cues": timing}, open(f"{out}/timing.json", "w"), indent=1)
print(f"total {t:.1f}s = {int(t // 60)}:{t % 60:04.1f}")
