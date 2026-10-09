# Generic narration builder: python generate_lines.py <lines.json> <outdir> [speed]
# lines.json = [{"s": section, "gap": pause_after_seconds, "text": "..."}]; Kokoro am_michael.
import json, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

lines = json.load(open(sys.argv[1])); out = sys.argv[2]
SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 1.15
fix = [(r"5800X3D", "fifty-eight hundred X 3 D"), (r"\bTPM 2\.0\b", "T P M two point oh"), (r"\bTPM\b", "T P M"), (r"\bCPU\b", "C P U"),
       (r"\bSSD\b", "S S D"), (r"\bAMD\b", "A M D"), (r"\bPC\b", "P C"), (r"\b2026\b", "twenty twenty-six"), (r"Kleinanzeigen", "Kline-anzeigen"),
       (r"\bRyzen 7\b", "Ryzen seven"), (r"Windows 11", "Windows eleven"), (r"\b3D\b", "3 D")]
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
parts, timing, t = [], [], 0.0
for i, l in enumerate(lines):
    say = l["text"]
    for a, b in fix: say = re.sub(a, b, say)
    audio, sr = k.create(say, voice="am_michael", speed=SPEED, lang="en-us")
    nz = np.where(np.abs(audio) > 0.01)[0]
    audio = audio[max(0, nz[0] - 240): nz[-1] + 1200] if len(nz) else audio
    timing.append({"id": i, "section": l["s"], "start": round(t, 3), "end": round(t + len(audio) / sr, 3), "text": l["text"]})
    parts.append(audio.astype(np.float32)); t += len(audio) / sr
    if l["gap"]: parts.append(np.zeros(int(l["gap"] * sr), dtype=np.float32)); t += l["gap"]
    print(f"{i:2d} {timing[-1]['start']:7.2f} {timing[-1]['end']:7.2f}", flush=True)
sf.write(f"{out}/voiceover.wav", np.concatenate(parts), sr)
json.dump({"voice": "am_michael", "speed": SPEED, "duration": round(t, 3), "cues": timing}, open(f"{out}/timing.json", "w"), indent=1)
print(f"total {t:.1f}s = {int(t // 60)}:{t % 60:04.1f}")
