// Builds src/short/timeline.json for the Short from voice/out-short (timing.json + words.json).
// Video time = voice time + OFFSET. Music sections carry a mood (incl. 'drop' = deliberate silence).
import fs from 'node:fs';
const OFFSET = 0.2, TAIL = 0.55, FPS = 30;
const v = JSON.parse(fs.readFileSync('../voice/out-short/timing.json', 'utf8'));
const words = JSON.parse(fs.readFileSync('../voice/out-short/words.json', 'utf8'));
const cues = v.cues.map((c) => ({ id: c.id, section: c.id, start: +(c.start + OFFSET).toFixed(3), end: +(c.end + OFFSET).toFixed(3), vStart: c.start, vEnd: c.end, hooks: [], text: c.text }));
const duration = +(v.duration + OFFSET + TAIL).toFixed(3);
const C0 = (i) => cues[i].start, C1 = (i) => cues[i].end;
// music map (by cue index), boundaries a touch before the line that starts the new feel
const plan = [
  ['open', 0], ['audio', 1], ['drop', 3], ['network', 4], ['calm', 6], ['drop', 7], ['hack', 8], ['money', 9], ['open', 10],
];
const sections = plan.map(([mood, ci], k) => ({
  index: k, title: mood, mood,
  start: k === 0 ? 0 : +(C0(ci) - (mood === 'drop' ? 0.25 : 0.15)).toFixed(3),
  end: 0,
}));
sections.forEach((s, k) => { s.end = k < sections.length - 1 ? sections[k + 1].start : duration; });
// "drop" before "Then it got worse" ends where line 4 starts; the twist drop ends on "isn't off"
const out = {
  fps: FPS, offset: OFFSET, duration, titleAt: 0, bpm: 100, loop: true,
  sections, cues, hooks: [],
  words: words.map((w) => ({ c: w.cue, i: w.i, w: w.word, s: +(w.start + OFFSET).toFixed(3), e: +(w.end + OFFSET).toFixed(3) })),
  events: [],
};
fs.writeFileSync('src/short/timeline.json', JSON.stringify(out, null, 1));
for (const s of sections) console.log(s.mood.padEnd(8), s.start.toFixed(2), '->', s.end.toFixed(2));
console.log('duration', duration, 'frames', Math.ceil(duration * FPS));
