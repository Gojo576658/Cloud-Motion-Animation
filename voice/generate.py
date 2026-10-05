# Generates the full narration with Kokoro (voice: am_michael), one clip per script paragraph,
# then joins them with short pauses and writes the exact start/end of every paragraph.
import json, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

VOICE, SPEED = "am_michael", float(sys.argv[1]) if len(sys.argv) > 1 else 1.1
PARA_GAP, SECTION_GAP = 0.3, 0.6

cues = json.load(open("../animation/src/cues.json"))["cues"]
fix = [
    (r"\bLevel1Techs\b", "Level One Techs"), (r"\bACR\b", "A C R"), (r"\bLG G5\b", "LG G 5"),
    (r"\b2015\b", "twenty fifteen"), (r"\b2017\b", "twenty seventeen"), (r"\b2019\b", "twenty nineteen"),
    (r"\b2021\b", "twenty twenty-one"), (r"\b2024\b", "twenty twenty-four"), (r"\b2025\b", "twenty twenty-five"),
    (r"\b2026\b", "twenty twenty-six"), (r"65-inch", "sixty-five inch"), (r"\b3D\b", "3 D"),
]
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
sr = 24000
parts, timing, t = [], [], 0.0
for i, c in enumerate(cues):
    text = c["text"]
    for a, b in fix: text = re.sub(a, b, text)
    audio, sr = k.create(text, voice=VOICE, speed=SPEED, lang="en-us")
    # trim leading/trailing silence
    nz = np.where(np.abs(audio) > 0.01)[0]
    audio = audio[max(0, nz[0] - 240): nz[-1] + 1200] if len(nz) else audio
    if i:
        gap = SECTION_GAP if c["section"] != cues[i - 1]["section"] else PARA_GAP
        parts.append(np.zeros(int(gap * sr), dtype=np.float32)); t += gap
    timing.append({"id": c["id"], "section": c["section"], "start": round(t, 3), "end": round(t + len(audio) / sr, 3), "text": c["text"]})
    parts.append(audio.astype(np.float32)); t += len(audio) / sr
    print(f"{i:2d} {timing[-1]['start']:7.2f} {timing[-1]['end']:7.2f}", flush=True)
sf.write("out/voiceover.wav", np.concatenate(parts), sr)
json.dump({"voice": VOICE, "speed": SPEED, "duration": round(t, 3), "cues": timing}, open("out/timing.json", "w"), indent=1)
print(f"total {t:.1f}s = {int(t // 60)}:{t % 60:04.1f}")
