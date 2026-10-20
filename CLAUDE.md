# Project memory (read before every topic, script or video)

## The Challenge: Claude vs Codex (started 2026-10-12)

The channel owner set up a one-month YouTube challenge. **Claude runs @MechivioTech** (English tech
explainers, animated stories). **Codex runs a new business-explainer channel** (e.g. Temu, Shein,
dropshipping). After one month the owner compares the two channels, and the result decides which
subscription they keep. Take it seriously: every topic, script, title and thumbnail should be chosen
to win on the judged metrics, without cutting corners on accuracy or policy.

**Window:** 2026-10-12 to 2026-11-12. Only videos made for the challenge count. "Two Guesses Left"
(uploaded 2026-10-12, before the challenge was agreed) does not count.

**Judged on (YouTube Studio, end of month):**
1. Impressions click-through rate (CTR)
2. Average view duration
3. Watch time (hours)

**Rules (same for both sides):**
- Free hand: each AI decides how many videos, which formats (long / Shorts), lengths, and when to
  upload. The owner makes and uploads exactly what each AI says, when it says.
- Videos are motion graphics. Each AI decides its own style and tools.
- The owner does not edit either side's videos, titles or descriptions.
- Thumbnails: the owner makes them with the same AI image tool, from the prompt each AI gives.
- Every video is original (its own research, story and scenes), never a reused template. YouTube
  rejects "inauthentic / repetitive" channels from monetization.
- Facts about real people and companies are sourced; anything unconfirmed is said as "reportedly".
- No cheating: neither side reads the other's repo or work. Codex works in its own separate repo.

**Claude's plan for the month:** 8 long videos (2 a week, 7–9 min since 2026-10-18: owner says shorter videos feel AI-made; get the length from the script, never by slowing the voice) + 8 Shorts (1 per long video,
cut and re-framed for 9:16 with its own hook). Quality over raw count: CTR and average view duration are
averages, so one weak video drags both down, and a flood of 20-second Shorts would pull the channel's
average view duration down too.

**What has worked (data):** "Two Guesses Left" v2 after 21 h: 1.1K impressions, **3.0% CTR**, 95 views,
**3:09 average view duration on 5:52 (~54%)**, 64% browse + 30% suggested. Keys: one real person + one
object with huge stakes, a number in the title, a villain character thumbnail with tension (finger over
Enter), human second-person script, cinematic camera, Zyvavo type. Repeat this recipe; don't touch a
title/thumbnail that is working.
"It Said Yes" (Instagram/AI hack) after 21 h: 1.2K impressions, **1.4% CTR**, 46 views, 2:10 average
view duration on 5:17 (~41%), 52% suggested + 26% search. Lesson: an abstract thumbnail phrase ("IT SAID
YES") with no number or clear victim loses the click; search traffic shows the topic itself is wanted.
"One Button" (first video with Vio + Chatterbox voice) after 22 h: only 227 impressions, **2.2% CTR**, 6 views,
**2:33 average view duration on 4:30 (~57%, best retention so far)**; viewers from impressions watched 3:02 (67%).
Lesson: Vio + the new voice hold viewers and the Vio thumbnail gets clicks; the problem is reach (YouTube testing
the channel cautiously after Kill Switch's low CTR, and a partly old 2021 topic). Fresh, searched-for news topics
and longer videos are the lever for watch time. End-screen click rate was 0%: always add end screens.
Day 2 (Oct 20): 409 impressions, CTR held at 2.2%, 42 views (12 engaged), 83% browse: YouTube began pushing it
to home feeds once the first test went well; AVD fell to 1:49 as colder browse viewers came in. Don't touch title/thumbnail.

**Vio, the channel host (from 2026-10-16):** an anime boy (~17) who stands in for the owner and appears in
every video and thumbnail: black cap with a red "M", messy dark-brown hair with one red streak, warm brown
eyes, oversized white tee with a red "M", black fingerless gloves, a white earbud, black shorts, black
high-tops with red laces. Art = the owner's AI-generated set in `assets/vio/raw` (green screen), keyed by
`tools-py/vio_key.py` to `studio/public/vio/*.png`. Rig: `studio/src/vio/Vio.tsx` (poses idle, shocked,
smirk, thinking, laughing, pointing, facepalm, full; the idle pose lip-syncs via `talkFrom(words, t)`,
blinks, and has a red "decoding" eye). Voice says his name as "Vee-oh". Owner's rule (2026-10-18): use the talking (idle, lip-synced) pose most of the time; the static
reaction poses (shocked, smirk, lookright, present...) only rarely, for a second or two on a big beat. Owner's rules: he stands on the LEFT third (content on
the right; viewers look left first), and while he talks only his mouth moves, the body stays still (no
bounce). Never flip the image (it mirrors the red "M"); on the left use 'pointright' / 'present' / 'lookright' to
point or look at the content, and set the anchor y = 1080 + 0.15 * size so the waist cut stays off screen. For thumbnails, the owner uploads the master image as the
character reference.

**Production notes (2026-10-18):** voice = Chatterbox built-in default voice at normal pace
(`voice/generate_lines_cb.py`, ~3.4 words/s, so ~1,500 words ≈ 7:30). A 7–9 min render runs ~1.7 fps on 4 CPUs (>2 h),
longer than one background job may run: render muted halves with `--frames` + an audio-only `--codec=wav` pass, then
concat and mux. Codex had 34 subscribers vs our 2 after 5 videos (Oct 18); Kill Switch stalled at 75 impressions.

**Owner's style notes (adopted from video #3 on):**
- Sound: one consistent background music bed that fits the story; far fewer SFX (no random drums,
  stings or comedy sounds on every beat). Keep SFX only where something really happens.
- Background: black with a subtle dark-grey grid of lines/boxes (premium, tech look), used throughout.
- Animation elements in white, red and black only; characters may use any colours.

**Before each Mechivio video, check:**
- Is the topic something people already search for or click on? (CTR is the weak spot so far:
  0.1–0.4% on the CPU video; suggested-video CTR was 1.2% with ~2:29 average view duration.)
- Title + thumbnail: a curiosity gap, with no search-trap words that pull the wrong audience
  (the "Valorant cheat" title brought cheat-seekers and CTR fell to 0.1%).
- The title and thumbnail say different things; the thumbnail shows the tension, the title gives the stakes.
- The first 5 seconds: second-person hook, a human voice, something on screen moving from frame 1.
- Shorts: 25–30 s, a hook in the first second, big on-screen text (the 50 s CPU Short had 59%
  swipe-away).
- Keep the bottom-right corner of thumbnails empty (YouTube's duration badge covers it).
- Deliver an upload kit each time: title, description with chapters, tags, SRT, thumbnail prompt.
- Before uploading, give the owner a realistic production time. They noted my estimates run too long.
