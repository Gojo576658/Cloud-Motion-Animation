# Chatterbox TTS test for Vio (MIT licence; CPU). Runs in its own venv: /opt/cb/bin/python tools-py/voice_chatterbox.py
# Demos: the built-in voice, and the built-in model prompted with an AI voice (Orpheus leo / zac) as the timbre.
import time, subprocess, torchaudio as ta
from chatterbox.tts import ChatterboxTTS
TEXT = ("Okay so... in 2017, a twenty-two-year-old spent ten dollars and sixty-nine cents, "
        "and accidentally stopped a cyberattack in over a hundred countries. "
        "Three months later? The FBI was waiting for him at the airport. Yeah. Let's talk about it.")
D = "/home/user/Cloud-Motion-Animation/deliverables/voice-demos"
m = ChatterboxTTS.from_pretrained(device="cpu")
for name, ref in [("default", None), ("leo-timbre", f"{D}/orpheus/vio-orpheus-leo.mp3"), ("zac-timbre", f"{D}/orpheus/vio-orpheus-zac.mp3")]:
    t0 = time.time()
    wav = m.generate(TEXT, audio_prompt_path=ref, exaggeration=0.45, cfg_weight=0.5)
    tmp = f"/tmp/cb-{name}.wav"; ta.save(tmp, wav, m.sr)
    for tag, af in [("", "loudnorm=I=-14:TP=-1.5"), ("-1.25x", "atempo=1.25,loudnorm=I=-14:TP=-1.5")]:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", af, "-ar", "44100", "-b:a", "192k", f"{D}/chatterbox/vio-chatterbox-{name}{tag}.mp3"], check=True)
    print(name, f"{wav.shape[-1] / m.sr:.1f}s audio in {time.time() - t0:.0f}s", flush=True)
