// Builds src/bf/timeline.json for "Blue Friday" (the CrowdStrike outage) from voice/out-bf (timing + per-line
// Whisper words). scenes = the 8 acts; sections = music sections (mood + bpm, dispatched by audio/score-tg.js).
import fs from 'node:fs';
const OFFSET = 0.6, TAIL = 3.2, FPS = 30;
const v = JSON.parse(fs.readFileSync('../voice/out-bf/timing.json', 'utf8'));
const words = JSON.parse(fs.readFileSync('../voice/out-bf/words.json', 'utf8'));
const cues = v.cues.map((c) => ({ id: c.id, section: c.section, voice: c.voice, start: +(c.start + OFFSET).toFixed(3), end: +(c.end + OFFSET).toFixed(3), text: c.text }));
const duration = +(v.duration + OFFSET + TAIL).toFixed(3);
const C0 = (i) => cues[i].start, C1 = (i) => cues[i].end;
const W = words.map((w) => ({ c: w.cue, i: w.i, w: w.word, s: +(w.start + OFFSET).toFixed(3), e: +(w.end + OFFSET).toFixed(3) }));
const TITLES = ['Cold Open', 'Meet the Guard', 'Twenty-One', 'The World Goes Blue', 'The Fix Nobody Could Download', 'The Bill', 'How It Got Through', 'Outro'];
const scenes = TITLES.map((title, s) => {
  const first = cues.find((c) => c.section === s), next = cues.find((c) => c.section === s + 1);
  return { index: s, title, start: s === 0 ? 0 : +(first.start - 0.4).toFixed(3), end: next ? +(next.start - 0.4).toFixed(3) : duration };
});
const A = 84, B = 100;
const plan = [
  ['calm', 0, A], ['drop', C0(1) - 0.1, A], ['invest', C0(2) - 0.2, A], ['network', C0(3) - 0.2, A], ['drop', C0(4) - 0.1, A], ['inside', C0(5) - 0.2, A],
  ['playful', C1(6) + 0.3, B], ['tech', C0(9) - 0.2, B], ['inside', C0(11) - 0.2, A], ['drop', C0(14) - 0.1, A],
  ['tech', C0(15) - 0.3, B], ['sneaky', C0(17) - 0.2, B], ['invest', C0(19) - 0.2, A], ['mystery', C0(20) - 0.1, B], ['drop', C0(23) - 0.1, A], ['sad', C0(24) - 0.2, B],
  ['hack', C0(26) - 0.3, A], ['network', C0(28) - 0.2, A], ['calm', C0(30) - 0.2, A], ['bright', C0(31) - 0.2, B],
  ['tech', C0(32) - 0.3, B], ['drop', C0(34) - 0.1, A], ['invest', C0(35) - 0.2, A], ['sneaky', C0(37) - 0.2, B], ['twist', C0(38) - 0.1, B], ['calm', C0(39) - 0.2, A],
  ['money', C0(40) - 0.3, A], ['playful', C0(43) - 0.2, B], ['twist', C0(44) - 0.1, B],
  ['inside', C0(46) - 0.3, A], ['fix', C0(49) - 0.2, A], ['calm', C0(50) - 0.2, A],
  ['open', C0(51) - 0.3, A], ['warm', C0(53) - 0.2, B],
];
const sections = plan.map(([mood, start, bpm], k) => ({ index: k, title: mood, mood, bpm, start: +Math.max(0, start).toFixed(3), end: 0 }));
sections.forEach((s, k) => { s.end = k < sections.length - 1 ? sections[k + 1].start : duration; });
const events = [{ t: +(C1(6) + 0.35).toFixed(3), type: 'impact' }, { t: +(C1(6) + 0.4).toFixed(3), type: 'title' }, { t: +(C0(23) - 0.05).toFixed(3), type: 'impact' }];
const out = { fps: FPS, offset: OFFSET, duration, bpm: A, scenes, sections, cues, hooks: [], words: W, events };
fs.writeFileSync('src/bf/timeline.json', JSON.stringify(out, null, 1));
for (const s of scenes) console.log('act', s.index, s.start.toFixed(2), '->', s.end.toFixed(2), s.title);
console.log('sections', sections.length, 'duration', duration, '=', Math.floor(duration / 60) + ':' + (duration % 60).toFixed(1), 'frames', Math.ceil(duration * FPS));
