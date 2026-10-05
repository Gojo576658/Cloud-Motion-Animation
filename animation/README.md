# Is Your Smart TV Listening? — motion graphics sequence

A full 8:47 cinematic motion-graphics video for `scripts/smart-tv-listening/script.md`,
built in code: Three.js for the 3D world, GSAP for the timeline, HTML/CSS for kinetic
typography, rendered frame-by-frame in headless Chromium and encoded with ffmpeg.

## What's in it

- **One continuous 3D world:** a living room inside a full house, the neighbourhood with
  an ad data centre, the chip inside the TV and a 3D history timeline. The camera flies
  between them without cuts. Bigger jumps are hidden behind shape wipes or an iris
  transition.
- **Kinetic typography:** word-by-word rise, pop, zoom, slam, typewriter and glitch.
- **Shape transitions:** diagonal wipes in the section colour, an iris into the
  microphone, a stamp slam and redaction bars.
- **Look:** bloom, ACES tone mapping, red/cyan/amber palette, plus film grain and a
  vignette that ffmpeg adds at encode time.
- **Timing:** every animation is placed on the voiceover clock. `src/cues.json` times
  each narration paragraph by word count (~169 wpm), and `P(cue, 'phrase')` in
  `src/scenes.js` returns the moment a phrase is spoken.
  See `VOICEOVER-TIMING.md` for the read-along sheet.

## Files

| File | What it does |
|---|---|
| `src/scenes.js` | Choreography for all 10 sections (camera shots, 3D motion, text, transitions) |
| `src/world.js` | 3D world, models, lights, camera rig (`shot()` keyframes) |
| `src/kit.js` | Motion toolkit: kinetic words, wipes, iris, counters, panels |
| `src/cues.json` | Narration timing (regenerate with `node tools/make-cues.mjs`) |
| `render.mjs` | Frame renderer + ffmpeg encode (`--stills`, `--from/--to`, `--fps`, `--workers`) |
| `render-all.sh` | Renders section by section, then joins them into `out/smart-tv-listening.mp4` |

## Run it

```bash
npm install
npm run preview            # http://127.0.0.1:5173/index.html  (add ?t=120 to jump)
./render-all.sh            # full 1920x1080, 24 fps video -> out/smart-tv-listening.mp4
node render.mjs --stills 12,95,250   # quick JPG checks -> out/stills/
```

Rendering uses software WebGL here, so the full video takes about 2 hours on 4 CPUs.
On a machine with a real GPU it is much faster.
To re-render one section after an edit, delete its `out/seg_*.mp4` and run
`./render-all.sh` again.

## Editing tips

- **Change the voiceover pace:** edit the section timestamps in the script, then run
  `node tools/make-cues.mjs`. Everything moves with the new times.
- **Check timed phrases:** `node tools/check-phrases.mjs` confirms every `P()` phrase
  exists in its cue.
- **Illustrative content:** the transcript log lines and the Vizio bar heights are
  illustrations, and both are labelled as such on screen.
