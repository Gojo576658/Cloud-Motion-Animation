# Six Kokoro voice candidates for Vio, same lines (run from voice/): python3 ../tools-py/voice_demos.py [speed]
import numpy as np, soundfile as sf, subprocess, sys
SPEED = float(sys.argv[1]) if len(sys.argv) > 1 else 1.2
from kokoro_onnx import Kokoro
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
print([v for v in k.get_voices() if v.startswith(('am_', 'bm_'))])
TEXT = ("Yo, I'm Vee-oh. In 2017, a twenty-two-year-old spent ten dollars and sixty-nine cents, "
        "and accidentally stopped a cyberattack in over a hundred countries. "
        "Three months later? The F B I was waiting for him at the airport.")
V = lambda n: k.get_voice_style(n)
DEMOS = [
    ("1-puck-young-energetic", V("am_puck")),
    ("2-fenrir-confident", V("am_fenrir")),
    ("3-michael-current", V("am_michael")),
    ("4-fable-british", V("bm_fable")),
    ("5-puck-michael-mix", 0.6 * V("am_puck") + 0.4 * V("am_michael")),
    ("6-puck-fenrir-mix", 0.5 * V("am_puck") + 0.5 * V("am_fenrir")),
]
OUT = "/home/user/Cloud-Motion-Animation/deliverables/voice-demos"
for name, style in DEMOS:
    lang = "en-gb" if "british" in name else "en-us"
    audio, sr = k.create(TEXT, voice=style, speed=SPEED, lang=lang)
    wav = f"/tmp/{name}.wav"; sf.write(wav, audio, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", "loudnorm=I=-14:TP=-1.5", "-ar", "44100", "-b:a", "192k", f"{OUT}/voice-{name}-{SPEED}x.mp3"], check=True)
    print(name, round(len(audio) / sr, 1), "s")
