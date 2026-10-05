import soundfile as sf, subprocess, sys
from kokoro_onnx import Kokoro
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
text = ("Your TV is off. The screen is black. The room is silent. So why is the microphone still awake? "
        "In September 2026, a team of researchers left a brand-new LG TV sitting in standby, cut off its internet, and simply talked around it.")
for v in ["am_michael", "am_fenrir", "bm_george", "af_heart"]:
    samples, sr = k.create(text, voice=v, speed=1.0, lang="en-us" if v[0] == "a" else "en-gb")
    sf.write(f"sample_{v}.wav", samples, sr)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"sample_{v}.wav", "-b:a", "128k", f"/home/user/Cloud-Motion-Animation/voice/sample_{v}.mp3"])
    print(v, round(len(samples) / sr, 1), "s")
