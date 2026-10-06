# Narration for the Short (am_michael), one clip per line, tight Shorts pacing with a few
# deliberate dramatic pauses. Writes out-short/voiceover.wav + timing.json.
import json, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

VOICE, SPEED = "am_michael", float(sys.argv[1]) if len(sys.argv) > 1 else 1.18
LINES = [
    ("Your TV is off. So why is its microphone still awake?", 0.18),
    ("Researchers spent seventy thousand dollars testing brand-new LG TVs.", 0.15),
    ("With the screen black, they say it was still saving audio… and uploading it later.", 0.38),
    ("Then it got worse.", 0.2),
    ("It scanned thirty-eight devices on the home network. Phones. Watches. Even a 3D printer.", 0.15),
    ("And it could see your neighbour's Wi-Fi. Why would a TV need that?", 0.3),
    ("LG says these features are optional.", 0.15),
    ("But optional… isn't off.", 0.4),
    ("And this isn't new. In 2017, the CIA had a tool that made a TV look off… while the mic kept recording.", 0.3),
    ("There are five settings that shut this down. The last one? Almost nobody does it.", 0.25),
    ("The full story is in the video linked below. Watch it before you turn your TV off tonight…", 0.0),
]
fix = [(r"\b2017\b", "twenty seventeen"), (r"\b3D\b", "3 D"), (r"\bCIA\b", "C I A")]
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
parts, timing, t = [], [], 0.0
for i, (text, gap) in enumerate(LINES):
    say = text
    for a, b in fix: say = re.sub(a, b, say)
    audio, sr = k.create(say, voice=VOICE, speed=SPEED, lang="en-us")
    nz = np.where(np.abs(audio) > 0.01)[0]
    audio = audio[max(0, nz[0] - 240): nz[-1] + 1200] if len(nz) else audio
    timing.append({"id": i, "section": i, "start": round(t, 3), "end": round(t + len(audio) / sr, 3), "text": text})
    parts.append(audio.astype(np.float32)); t += len(audio) / sr
    if gap: parts.append(np.zeros(int(gap * sr), dtype=np.float32)); t += gap
    print(f"{i:2d} {timing[-1]['start']:6.2f} {timing[-1]['end']:6.2f}  {text}", flush=True)
sf.write("out-short/voiceover.wav", np.concatenate(parts), sr)
json.dump({"voice": VOICE, "speed": SPEED, "duration": round(t, 3), "cues": timing}, open("out-short/timing.json", "w"), indent=1)
print(f"total {t:.1f}s")
