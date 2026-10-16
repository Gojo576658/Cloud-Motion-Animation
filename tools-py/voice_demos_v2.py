# Vio voice round 2: a chill but sharp 17-18 year-old. Kokoro voices/blends, nudged younger with a small
# pitch + formant lift (rubberband) and a presence EQ for crispness. Run from voice/: python3 ../tools-py/voice_demos_v2.py [speed]
import sys, subprocess, soundfile as sf
from kokoro_onnx import Kokoro
SPEED = float(sys.argv[1]) if len(sys.argv) > 1 else 1.3
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
V = k.get_voice_style
TEXT = ("Okay so... in 2017, a twenty-two-year-old spent ten dollars and sixty-nine cents, "
        "and accidentally stopped a cyberattack in over a hundred countries. "
        "Three months later? The F B I was waiting for him at the airport. Yeah. Let's talk about it.")
ST = lambda s: 2 ** (s / 12)
# name, style, pitch semitones, formant ("shifted" = younger timbre, "preserved" = same timbre)
DEMOS = [
    ("A-puck-young", V("am_puck"), 1.5, "shifted"),
    ("B-puck-fenrir-young", 0.5 * V("am_puck") + 0.5 * V("am_fenrir"), 1.5, "shifted"),
    ("C-liam-young", V("am_liam"), 1.0, "shifted"),
    ("D-puck-liam-mix", 0.5 * V("am_puck") + 0.5 * V("am_liam"), 1.0, "shifted"),
    ("E-echo-puck-mix", 0.5 * V("am_echo") + 0.5 * V("am_puck"), 1.5, "shifted"),
    ("F-puck-michael-chill", 0.6 * V("am_puck") + 0.4 * V("am_michael"), 2.0, "preserved"),
]
OUT = "/home/user/Cloud-Motion-Animation/deliverables/voice-demos/v2"
for name, style, semis, formant in DEMOS:
    audio, sr = k.create(TEXT, voice=style, speed=SPEED, lang="en-us")
    wav = f"/tmp/{name}.wav"; sf.write(wav, audio, sr)
    af = (f"rubberband=pitch={ST(semis):.4f}:formant={formant},highpass=f=90,"
          "equalizer=f=3800:t=q:w=1.2:g=3.5,equalizer=f=250:t=q:w=1:g=-2,"
          "acompressor=threshold=-18dB:ratio=2.5:attack=8:release=120,loudnorm=I=-14:TP=-1.5")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", af, "-ar", "44100", "-b:a", "192k", f"{OUT}/vio-{name}.mp3"], check=True)
    print(name, round(len(audio) / sr, 1), "s")
