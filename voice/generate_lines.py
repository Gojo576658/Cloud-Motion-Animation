# Generic narration builder: python generate_lines.py <lines.json> <outdir> [speed]
# lines.json = [{"s": section, "gap": pause_after_seconds, "text": "...", optional "voice", "speed", "pitch"}];
# default voice Kokoro am_michael. "pitch" > 1 raises pitch (and tempo) by resampling: a cartoon character voice.
import json, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

lines = json.load(open(sys.argv[1])); out = sys.argv[2]
SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 1.15
fix = [(r"5800X3D", "fifty-eight hundred X 3 D"), (r"\bTPM 2\.0\b", "T P M two point oh"), (r"\bTPM\b", "T P M"), (r"\bCPU\b", "C P U"),
       (r"\bSSD\b", "S S D"), (r"\bAMD\b", "A M D"), (r"\bPC\b", "P C"), (r"\b2026\b", "twenty twenty-six"), (r"Kleinanzeigen", "Kline-anzeigen"),
       (r"\bRyzen 7\b", "Ryzen seven"), (r"Windows 11", "Windows eleven"), (r"\b3D\b", "3 D"),
       (r"\b20(1\d|2\d)\b", r"twenty \1"), (r"\bPIN\b", "pin"), (r"Unciphered", "Un-ciphered"), (r"Chainalysis", "Chain-alysis"), (r"\bReich\b", "Rike"), (r"IronKeys", "Iron Keys"), (r"IronKey", "Iron Key"),
       (r"\bUTC\b", "U T C"), (r"\b4:09\b", "four oh nine"), (r"BitLocker", "Bit Locker"), (r"Parametrix", "Para-metrix"), (r"\bIT\b", "I T"), (r"\bUS\b", "U S"), (r"\bVPN\b", "V P N"), (r"\bAI\b", "A I"), (r"Sephora", "Seffora"), (r"WannaCry", "Wanna Cry"), (r"\bDEF CON\b", "Def Con"), (r"\bFBI\b", "F B I"), (r"\bNSA\b", "N S A")]
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
parts, timing, t = [], [], 0.0
for i, l in enumerate(lines):
    say = l["text"]
    for a, b in fix: say = re.sub(a, b, say)
    audio, sr = k.create(say, voice=l.get("voice", "am_michael"), speed=l.get("speed", SPEED), lang="en-us")
    if l.get("pitch", 1) != 1:
        n = int(len(audio) / l["pitch"])
        audio = np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype(np.float32)
    nz = np.where(np.abs(audio) > 0.01)[0]
    audio = audio[max(0, nz[0] - 240): nz[-1] + 1200] if len(nz) else audio
    timing.append({"id": i, "section": l["s"], "start": round(t, 3), "end": round(t + len(audio) / sr, 3), "text": l["text"], "voice": l.get("voice", "am_michael")})
    parts.append(audio.astype(np.float32)); t += len(audio) / sr
    if l["gap"]: parts.append(np.zeros(int(l["gap"] * sr), dtype=np.float32)); t += l["gap"]
    print(f"{i:2d} {timing[-1]['start']:7.2f} {timing[-1]['end']:7.2f}", flush=True)
sf.write(f"{out}/voiceover.wav", np.concatenate(parts), sr)
json.dump({"voice": "am_michael", "speed": SPEED, "duration": round(t, 3), "cues": timing}, open(f"{out}/timing.json", "w"), indent=1)
print(f"total {t:.1f}s = {int(t // 60)}:{t % 60:04.1f}")
