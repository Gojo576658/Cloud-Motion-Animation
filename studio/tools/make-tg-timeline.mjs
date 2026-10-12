// Builds src/tg/timeline.json for "Two Guesses Left" from voice/out-tg (timing + per-line Whisper words).
// scenes = the 9 acts (for Remotion); sections = music sections (mood + bpm; the score dispatcher picks the
// dark Smart-TV palette or the comedy CPU palette per mood).
import fs from 'node:fs';
const OFFSET = 0.6, TAIL = 3.2, FPS = 30;
const v = JSON.parse(fs.readFileSync('../voice/out-tg2/timing.json', 'utf8'));
const words = JSON.parse(fs.readFileSync('../voice/out-tg2/words.json', 'utf8'));
const cues = v.cues.map((c) => ({ id: c.id, section: c.section, voice: c.voice, start: +(c.start + OFFSET).toFixed(3), end: +(c.end + OFFSET).toFixed(3), vStart: c.start, vEnd: c.end, text: c.text }));
const duration = +(v.duration + OFFSET + TAIL).toFixed(3);
const C0 = (i) => cues[i].start, C1 = (i) => cues[i].end;
const W = words.map((w) => ({ c: w.cue, i: w.i, w: w.word, s: +(w.start + OFFSET).toFixed(3), e: +(w.end + OFFSET).toFixed(3) }));
const TITLES = ['Cold Open', 'The Cartoon That Paid in Bitcoin', 'Eight Guesses', 'Why Nobody Can Open It', 'The Heist', 'The Offer', "He's Not Alone", 'Protect Yourself', 'Outro'];
const scenes = TITLES.map((title, s) => {
  const first = cues.find((c) => c.section === s), next = cues.find((c) => c.section === s + 1);
  return { index: s, title, start: s === 0 ? 0 : +(first.start - 0.4).toFixed(3), end: next ? +(next.start - 0.4).toFixed(3) : duration };
});
const A = 84, B = 100; // dark palette bpm / comedy palette bpm
const plan = [
  ['open', 0, A], ['warm', C0(9) - 0.3, B], ['inside', C0(13) - 0.2, A], ['drop', C0(17) - 0.1, A], ['invest', C0(18) - 0.2, A],
  ['audio', C0(21) - 0.2, A], ['drop', C0(23) - 0.1, A], ['sad', C0(25) - 0.3, B], ['money', C0(27) - 0.2, A], ['inside', C0(28) - 0.3, A],
  ['drop', C0(33) - 0.1, A], ['calm', C0(34) - 0.2, A], ['sneaky', C0(35) - 0.3, B], ['tech', C0(39) - 0.2, B], ['drop', C0(42) - 0.1, B],
  ['bright', C0(43) - 0.2, B], ['twist', C0(44) - 0.2, B], ['network', C0(46) - 0.3, A], ['hack', C0(47) - 0.2, A], ['drop', C1(48) + 0.05, A],
  ['mystery', C0(50) - 0.2, B], ['drop', C1(51) + 0.05, B], ['twist', C0(52) - 0.1, B], ['open', C0(54) - 0.2, A], ['calm', C0(56) - 0.3, A],
  ['fix', C0(59) - 0.3, A], ['warm', C0(64) - 0.3, B], ['calm', C0(65) - 0.2, A], ['open', C0(67) - 0.2, A],
];
const sections = plan.map(([mood, start, bpm], k) => ({ index: k, title: mood, mood, bpm, start: +Math.max(0, start).toFixed(3), end: 0 }));
sections.forEach((s, k) => { s.end = k < sections.length - 1 ? sections[k + 1].start : duration; });
const events = [{ t: +(C1(8) + 0.35).toFixed(3), type: 'impact' }, { t: +(C1(8) + 0.4).toFixed(3), type: 'title' }, { t: +(C1(49) - 0.6).toFixed(3), type: 'impact' }];
const out = { fps: FPS, offset: OFFSET, duration, bpm: A, scenes, sections, cues, hooks: [], words: W, events };
fs.writeFileSync('src/tg/timeline.json', JSON.stringify(out, null, 1));
for (const s of scenes) console.log('act', s.index, s.start.toFixed(2), '->', s.end.toFixed(2), s.title);
console.log('sections', sections.length, 'duration', duration, '=', Math.floor(duration / 60) + ':' + (duration % 60).toFixed(1), 'frames', Math.ceil(duration * FPS));
