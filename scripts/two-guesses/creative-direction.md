# "Two Guesses Left" — Creative Direction & Production Plan

Companion to `script.md` (61 scenes, 25 hooks, ~7:45, 16:9, 30 fps).
Built in Remotion 4 like the previous videos; 3D via `@remotion/three` (three.js) for a small set of hero shots.

---

## 1 · Creative intent

**One message:** a single forgotten password turned a tiny steel drive into a half-billion-dollar locked door, and
the drive *never forgets*.
**Mood (3 words):** tense · clever · human.
**What the viewer should feel, in order:** "wait, what?" → "oh no" → "that's so smart" → "why would he say no?!" →
"could this be me?" → "I want to see the next one."

**Signature idea:** the counter. Ike's little screen reading **8 / 10** is the visual heartbeat of the whole film.
It appears in the first 3 seconds, lives in a corner HUD during the story, and is the last thing we see.
Viewers always know the stakes at a glance.

---

## 2 · Tone & energy

**Primary cell: Calm + Sharp — "premium thriller."** Deliberate, precise, confident motion; long holds; silence as a tool.
**Deliberate, rule-bound exception: "comedy pockets."** About 30% of the runtime (marked in the shot list) may switch
to Kinetic + Soft: overshoot, squash-and-stretch, whips. Comedy pockets are always:
- triggered by a sound cue (boing, record scratch, buzzer),
- 2–6 seconds long,
- about Ike, robots, paper or situations — never about Stefan or any real person,
- closed by a hard cut back to the thriller grammar.

That keeps two energies in one film without the motion feeling inconsistent: the switch itself is the joke.

---

## 3 · Motion-language spec (locked)

| Property | Thriller (default) | Comedy pocket (exception) |
|---|---|---|
| Easing | Entrances `EASE.out` = cubic-bezier(0.16, 1, 0.3, 1); exits `EASE.in` = (0.7, 0, 0.84, 0); repositioning `EASE.inOut` | `EASE.back` (0.34, 1.56, 0.64, 1) + springs (damping 9–11) |
| Base unit | **0.4 s (12 frames)**: micro 0.2 s · enter 0.4 s · hero 0.8 s · camera 1.6–6.0 s | 0.2 s (snappy) |
| Transitions | hard cut (default) · match-cut · lens push-through (≤ 4 in the whole film) | whip (horizontal), snap-zoom |
| Stagger | 0.1 s (3 frames), top→bottom or left→right | 0.067 s (2 frames) |
| Intensity | travel ≤ 120 px, scale 0.94 → 1.0, overshoot **0%** | overshoot 10–20%, squash ≤ 0.35 |
| Holds | ≥ 0.5 s stillness after every reveal; **0.6–1.0 s of near-silence before each big reveal** | none needed |
| Camera | one move per shot, slow (≥ 1.6 s) | snap-zooms ×1–3 on punchlines |

No `linear` except continuous loops (spinning coins, server fans, laser scan, ambient drift).

---

## 4 · Motion hierarchy (every frame has exactly one hero)

| Tier | Elements | Rule |
|---|---|---|
| **Hero** | Ike / the counter / the number on screen / the one character speaking | boldest, slowest move; lands on the audio beat |
| **Support** | labels, cards, secondary characters, the corner HUD | smaller, earlier or later; eases out of the hero's way |
| **Texture** | dust, vault haze, server LEDs, rain, grain | subliminal: slow loops, ≤ 15% opacity, never cut hard |

The corner HUD (counter) is support: it ticks only when a guess happens, otherwise it is perfectly still.

---

## 5 · Visual world & 3D

**Style split (a rule viewers can feel without noticing):**
- **3D = reverence and threat.** Ike as a polished physical object: the vault, the money, the lab, the chip.
- **2D cartoon = people, comedy, explanations.** The same flat vector style as Chip and Leo, so this belongs to the
  same channel universe. People are never 3D.
- Ike exists in both: a 3D "hero" version and a 2D cartoon version for gags. Same silhouette, same LED eye, same
  counter screen, so the cut between them reads as one character. We always switch with a match-cut on the LED eye.

**3D assets (procedural three.js, no downloads):**
| Asset | Build | Used in |
|---|---|---|
| **Ike 3D** | rounded box (beveled), brushed steel `MeshPhysicalMaterial` (metalness 1, roughness 0.32, clearcoat 0.4), keyring torus, emissive red LED eye with bloom, OLED screen as a canvas texture showing the counter | cold open, title, X-ray, vault, finale |
| **Exploded X-ray** | Ike's shell, epoxy block (translucent amber), chip (green PCB + die), golden "key" glyph inside; layers separate along Z | Act 3 |
| **Coins** | instanced gold coins (bevelled cylinders, ₿ embossed via normal texture), physics-like arc tracks (keyframed, not simulated) | 7,002 BTC pour; "1 in 5 lost" |
| **Vault** | dark room, single cone spotlight, volumetric haze (layered transparent planes), laser line scanning Ike | open, Act 5 |
| **Lab chip** | test IronKey on a steel tray, acid haze particles, tweezers lifting the chip | Act 5 (the one "wow") |
| **Server wall** | rows of boxes with blinking LEDs, the 200-trillion counter on a big panel | Act 5 |

3D budget: **~8 shots, ~70 seconds total** (keeps render time sane and makes each 3D shot feel special).
Lighting recipe for every 3D shot: one key (cool white, 45° above), one **red rim** from behind (danger), soft cyan fill
on hope scenes. Shadows on, ACES filmic tone mapping, subtle depth of field in close-ups.

**2D assets:** reuse the cartoon system (`src/cpu/chars.tsx`, fx), plus new rigs: **Stefan** (glasses, hoodie,
sympathetic, generic cartoon, not his likeness), **Joe** (headlamp, sleeves up), **Dan** (nervous), a
**brute-force robot** (comedy), **Ike 2D**. All with blink, breathing and squash.

**Ike's performance:** no mouth. The LED eye is his face: it narrows (smug), widens (alarm), pulses with his voice
(audio-reactive brightness on his lines), and twitches once when the test drive is unlocked.

---

## 6 · Camera language

| Situation | Move | Notes |
|---|---|---|
| Suspense build | slow dolly push-in, scale 1.00 → 1.08 over 4–6 s, `EASE.inOut` | the default "lean in" |
| 3D hero reveal | 20–30° orbit around Ike + push, rack focus from background haze to the LED | cold open, title, finale |
| Explanation | locked-off wide, then a single push to the detail being named | X-ray, firmware/RAM diagram |
| Guess montage | locked camera, subtle 2 px handheld noise rising with each miss; cut rate speeds up 1.0 s → 0.4 s | tension through editing, not camera |
| Comedy punchline | snap-zoom ×1–3 (0.2 s each) | only inside comedy pockets |
| Heist | top-down "blueprint" view → tilt down into the chip (2.5D) | Joe Grand act |
| Act changes | lens push-through: fly into the LED eye / a screen / the chip, emerge in the next scene | max 4 in the film |
| Landfill | high aerial, slow crane down to the buried drive (cross-section) | Act 6 |
| Ending | slow pull-back from Ike's eye to the whole vault, then hold | final image |

Rule: never move the camera while the viewer is reading a card longer than 4 words.

---

## 7 · Color palette & grading

**Story palette (each color has one meaning):**
| Color | Hex | Means | Used for |
|---|---|---|---|
| Vault ink | `#070B16` → `#0F1830` | the unknown | base background |
| Steel | `#8C97A8` / `#C9D1DC` | the machine | Ike, devices |
| **Danger red** | `#FF2E4D` | guesses, loss, wipe | the counter, wrong guesses, WIPING, "said no" |
| **Bitcoin gold** | `#F7B23B` | value | coins, prices, the key glyph |
| **Hack cyan** | `#33E1FF` | hope, cleverness | Joe, the glitch, Unciphered |
| Warm amber | `#FFB648` | human memory | 2011 flashback, Stefan's quiet moments |
| Success green | `#3CF0A0` | resolved | "UNLOCKED", the tips |

**Color as storytelling:** the red budget rises as guesses run out (the HUD glows a little hotter each miss);
cyan enters the film for the first time with Joe Grand, the visual cue for "hope"; gold appears only with money.

**Grade per act:** 2011 = warm, slightly faded, soft vignette · present = cool teal-navy, crisp · hacker lab =
neon cyan/magenta accents on black · Unciphered lab = sterile white-cyan, high key · landfill = desaturated grey-green,
overcast · ending = warm sunrise.
**Finishing (whole film):** navy-lifted blacks, vignette 0.55, film grain 0.07, soft bloom only on emissive things
(LED, gold, screens). Chromatic aberration and RGB-split **only** on glitch/wipe moments (≤ 0.3 s each).

---

## 8 · Transitions (locked family)

1. **Hard cut** (default, ~70% of joins).
2. **Match-cuts** (the craft moments, ~10 in the film):
   - Ike's counter screen → the game-show guess board (Act 2)
   - a gold coin → the price-chart rocket
   - Ike 3D LED eye ↔ Ike 2D LED eye (style switches)
   - Ike's chip X-ray → the Trezor chip (Act 4)
   - the Trezor terminal digits → the 200-trillion counter (Act 5)
   - the buried landfill drive → Ike in the vault (Act 6)
3. **Lens push-through** (act changes, max 4): into the LED eye / a monitor / the chip, out into the next world.
4. **Comedy whips/snap-zooms:** only inside comedy pockets.

Banned: spins, page curls, stripe wipes, dissolves longer than 0.4 s, any "transition on a transition".

---

## 9 · Typography & on-screen text

| Role | Font | Style |
|---|---|---|
| Headlines, stamps | Montserrat 900 | uppercase, tight tracking, max **6 words**; stamps slam in (scale 3 → 1, 0.16 s) |
| Numbers, counters, terminal | JetBrains Mono 700 | tabular digits; count up with `EASE.out`, **no overshoot on numbers**, land and hold ≥ 0.6 s |
| Quotes, sources | Inter 500/600 | newspaper-clipping card with the outlet name ("— The New York Times, 2021") |
| Captions | existing caption system | key words colored by meaning: danger words red, money gold, hacking cyan |

**Persistent HUD:** small top-right chip `GUESSES LEFT ▮▮` (two red bars) from Act 2 to Act 5. It never animates
unless a guess happens or the stakes change. It is the viewer's "clock".
**Money on screen:** always with context, e.g. `≈ $580M` with a small `at today's price` line, so it stays honest.
**Readability:** text never overlaps the hero; nothing important in the outer 5% of the frame; no text in the
bottom-right corner during the last 20 seconds (YouTube end screen).

---

## 10 · Sound-design moments (picture and sound hit together)

| Moment | Sound | Picture sync |
|---|---|---|
| Ike's leitmotif | low 55 Hz hum + a single metallic *ting* | every time 3D Ike is revealed |
| "Two guesses left" | heartbeat starts, slow (60 bpm) | counter flickers on |
| Wipe preview | glitch break + glass shatter → hard silence | money tag shatters |
| Paper flies away | wind whoosh → record scratch | freeze-frame "SPOILER" |
| Guess montage | buzzer per miss, **pitched lower each time**; heartbeat rises 60 → 110 bpm | each ❌ and counter tick |
| "Two left." | everything cuts; one heartbeat | silence + still frame |
| Quote | music drops to piano, soft rain | newspaper card |
| Brute-force robot gag | machine whir → fall whistle → boing | comedy pocket |
| Mid-video subscribe (Ike) | click + bell, Ike's ting | Ike taps the button |
| Heist | pizzicato + clarinet heist groove; electric zap on the glitch | lightning inside the chip |
| PIN appears | silence → level-up → small applause | digits appear one by one |
| 200 trillion | rising data hum, counter clicks blur into a tone | counter spin |
| **"It opened."** (the one wow) | 1.0 s total silence, then a deep reveal hit | UNLOCKED |
| "Stefan… said no." | record scratch + 1 s crickets | DECLINED freeze |
| Landfill | seagulls, wind, gavel | aerial crane down |
| Ending | heartbeat stops on the last frame | LED eye fades |

Music: a new suspense palette for the Tone.js score (moods: `vault` low strings pulse, `heist` pizz + clarinet,
`hope` piano + cyan pads, `sad` piano, `warm` ending), ducked under the voice like before.
Mix rule: the voice always wins; SFX sit 6–10 dB under the voice except on reveal hits.

---

## 11 · Engagement architecture

**Open loops (a question is always open):**
```
0:05  Q1 what's on it?                 → answered 0:55
0:12  Q2 why is it still locked?       → answered 2:00 (paper lost) … deepened
0:30  Q3 why did he say "no"?          → answered 5:45   ← long loop holds the middle
2:20  Q4 what happens with the last 2? → kept open to the end (comments)
3:30  Q5 can anyone open it?           → 4:40 (Joe) → 5:20 (Unciphered) → 6:05 (status)
6:20  Q6 the landfill drive?           → next video (series loop)
```
**Pattern interrupts every 20–30 s:** a change of format (3D ↔ 2D, wide ↔ macro, color ↔ monochrome quote card,
music ↔ silence, normal ↔ comedy pocket). Never two identical shot types back to back.
**Retention dips to protect:** 0:30 (after the hook) → the title + "a cartoon. like this one" joke; ~2:50 (after the
quote) → the brute-force robot gag; ~5:00 (after the heist) → the "2023" news slam.
**Calls to action, earned:**
- **Like:** after the PIN appears (4:45), a tiny thumbs-up pops beside Dan's happy face, 1 s, no voice.
- **Subscribe:** Ike at ~3:40, in character ("I'll wait. I'm very good at waiting.").
- **Comment:** the two-button question at the end (TRY IT MYSELF vs CALL THE HACKER).
- **Next video:** the landfill teaser plus an end-screen layout with space for one video and the subscribe button.

---

## 12 · Pacing map

```
energy
  ^                                         ★ "It opened." (the one wow, ~5:20)
  |   cold open                   heist  /‾‾\   "said no"
  |  /‾‾\        guesses    /‾‾‾‾‾‾‾‾‾\ /    \__/‾‾\
  | /    \  2011 /‾‾‾\ quote/  robot             \  landfill  tips   question
  |/      \_____/     \__/  gag                    \__/‾‾\___/‾‾\__/‾‾‾\__ end hold
  +-------------------------------------------------------------------------> time
   0:00   0:45   1:45  2:50   3:50        5:00   6:15   6:50   7:30  7:45
```
Tension builds through the guesses, releases with comedy, climbs again through the heist and the lab, peaks at
"It opened." then turns human and warm. The cold open is strong but restrained so the real peak lands harder.

---

## 13 · Restraint list (what stays still)

- The HUD, unless a guess happens.
- Quote cards: no motion while they are read (only a slow push of the background).
- Numbers: count, land, hold; no wobble.
- Stefan: small, natural motion only; no gags around him.
- Backgrounds in explanation shots: static or ≤ 2 px drift.
- No particles in the text frames; no bloom on text.

---

## 14 · Key shot direction notes

```
SHOT 1  [0:00–0:04]  "This little USB drive holds more than half a billion dollars."
PURPOSE:   stop the scroll with one precious object.
HERO:      3D Ike on a velvet pedestal; spotlight snaps on (0.2 s), 25° orbit + slow push.
SUPPORT:   price tag "≈ $580,000,000" spins in at 1.2 s, gold, lands and holds.
TEXTURE:   vault haze drifting, dust in the light cone.
BEAT:      spotlight on the first word; tag lands on "billion".
```
```
SHOT 2  [0:04–0:08]  "And it has two guesses left."
HERO:      the counter screen flickers on: 8 / 10; two red slots glow.
SUPPORT:   camera pushes into the LED eye (rack focus).
BEAT:      heartbeat begins on "two".
NOTE:      first appearance of danger red, earned by the line.
```
```
SHOT 19 [≈2:05–2:25]  guess montage
HERO:      each ❌ and the counter tick (1/10 … 8/10).
SUPPORT:   Stefan typing (2D); game-show board (match-cut from Ike's screen).
CAMERA:    locked; 2 px handheld noise grows with each miss.
EDIT:      cut lengths 1.0 → 0.4 s; then a hard stop to silence on "Two left."
SOUND:     buzzer pitched lower each miss; heartbeat 60 → 110 bpm.
```
```
SHOT 25 [≈3:05–3:15]  robot unplugs Ike, waits a year (comedy pocket)
HERO:      the robot; snap-zooms on the beard and the faint.
SUPPORT:   calendar pages fly (2 frames each).
RULE:      enter on the boing, exit with a hard cut back to the thriller grade.
```
```
SHOT 29 [≈3:40]  Ike's subscribe line
HERO:      Ike 2D, LED eye pulsing with his voice.
SUPPORT:   red SUBSCRIBE button; bell rings after the tap.
NOTE:      in character and short (≤ 4 s); the HUD blinks once to keep the stakes alive.
```
```
SHOT 35 [≈4:20–4:35]  the glitch
HERO:      the RAM box inside the chip (2.5D tilt-down from the blueprint view).
SUPPORT:   oscilloscope trace in a corner; one cyan lightning bolt, perfectly timed.
COLOR:     first strong cyan of the film = hope.
```
```
SHOT 41–43 [≈5:05–5:25]  the lab → "It opened."   ★ the one wow
HERO:      3D test IronKey on a steel tray; chip lifted out; acid haze; then the 200-trillion counter.
CAMERA:    macro push on the chip, then pull back to the server wall.
SOUND:     data hum rising → 1.0 s of silence → reveal hit on "opened".
NOTE:      the biggest visual budget of the film lives here; nothing else gets this treatment.
```
```
SHOT 45 [≈5:35]  "And Stefan… said no."
HERO:      the phone: DECLINED, freeze-frame.
EDIT:      record scratch, 1 s crickets, then a slow push on the question mark (Q3 pays off next).
```
```
SHOT 61 [7:40–7:50]  ending
HERO:      3D Ike, LED eye; counter 8/10.
CAMERA:    slow pull-back from the eye to the whole vault; hold 2 s.
SOUND:     heartbeat stops on the final frame; Ike's ting.
```

---

## 15 · Production plan

**Tech setup**
- Add `@remotion/three`, `three`, `@react-three/fiber` (versions matched to Remotion 4.0.x), render WebGL with the
  `angle`/`swangle` GL backend that already works for stills.
- Risk: 3D frames render slowly in headless Chromium. Mitigation: only ~8 short 3D shots; render them as separate
  compositions to PNG sequences first, then composite into the main timeline (cached, re-renderable in isolation).

**Pipeline (same proven flow as the CPU video)**
1. Narration lines (`lines.json`) from the script → Kokoro voice (narrator ≈1.0×, Ike: low, slow) → per-line Whisper
   word timings → `timeline.json` (scenes, music moods, events).
2. Build the 3D kit: Ike 3D (materials, LED, screen texture), vault, coins, X-ray, lab chip, server wall. Render test
   stills for each and check them.
3. Build the 2D kit: Stefan, Joe, Dan, robot, Ike 2D, HUD, quote card, case-file cards, game-show board.
4. Animate act by act (0 → 8), verifying a contact sheet of stills after every act (spacing, overlap, readability).
5. Score (new suspense moods) → mix (with the fixed loudnorm padding) → full render → frame check → master at
   −14 LUFS / ≤ −1 dBFS.
6. Deliver: master (Git LFS link), a share copy, SRT captions, upload kit (title, description, chapters, tags,
   pinned comment, thumbnail prompt). Then a Short cut-down.

**Quality gates (before delivery)**
- Every frame has one hero; nothing important touches the edges; captions never cover the hero.
- Every number is sourced and shown with its date/context.
- Real people are generic cartoons and are never the butt of a joke.
- The 3D and 2D Ike always cut on the LED eye.
- Exactly one "wow" (Shot 41–43).
- Audio: the voice is present from the first to the last word (checked with Whisper on the final file).

---

## 16 · Pre-render checklist

- [ ] One motion language; comedy pockets only where marked.
- [ ] ≤ 2 easing curves per energy mode; all timings multiples of 0.2/0.4 s.
- [ ] Only the locked transition family; ≤ 4 push-throughs.
- [ ] HUD still unless stakes change.
- [ ] Numbers land and hold ≥ 0.6 s, with context.
- [ ] Palette meanings respected (red = danger, gold = value, cyan = hope).
- [ ] Silence before every big reveal.
- [ ] Mid-video subscribe by Ike; like after the PIN; comment question at the end; end-screen space kept clear.
