# Orpheus TTS test for Vio (Apache-2.0 model, Q4 GGUF via llama.cpp, SNAC ONNX decoder; CPU only).
# python3 tools-py/voice_orpheus.py [voice ...]   -> deliverables/voice-demos/orpheus/vio-orpheus-<voice>.mp3
import sys, time, subprocess, numpy as np, soundfile as sf
import llama_cpp
_L = llama_cpp.Llama
class _Small(_L):  # orpheus-cpp asks for the model's full 128k context (n_ctx=0): that needs ~14 GB of KV cache
    def __init__(self, *a, **k): k['n_ctx'] = 4096; super().__init__(*a, **k)
llama_cpp.Llama = _Small  # orpheus-cpp imports Llama inside __init__, so patch the module attribute
from orpheus_cpp import OrpheusCpp
VOICES = sys.argv[1:] or ["zac", "leo", "dan"]
TEXT = ("Okay so... <sigh> in 2017, a twenty-two-year-old spent ten dollars and sixty-nine cents, "
        "and accidentally stopped a cyberattack in over a hundred countries. "
        "Three months later? The FBI was waiting for him at the airport. <chuckle> Yeah. Let's talk about it.")
orph = OrpheusCpp(lang="en", n_threads=4, verbose=False)
OUT = "/home/user/Cloud-Motion-Animation/deliverables/voice-demos/orpheus"
for v in VOICES:
    t0 = time.time()
    sr, audio = orph.tts(TEXT, options={"voice_id": v, "temperature": 0.7})
    a = np.asarray(audio).reshape(-1).astype(np.float32)
    if np.abs(a).max() > 2: a = a / 32768.0
    wav = f"/tmp/orpheus-{v}.wav"; sf.write(wav, a, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", "loudnorm=I=-14:TP=-1.5", "-ar", "44100", "-b:a", "192k", f"{OUT}/vio-orpheus-{v}.mp3"], check=True)
    print(v, f"{len(a) / sr:.1f}s audio in {time.time() - t0:.0f}s", flush=True)
