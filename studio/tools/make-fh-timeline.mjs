// Builds src/fh/timeline.json for "Fridge Hack" (French supermarket fridges turned into ovens) from voice/out-fh (timing + per-line
// Whisper words). scenes = the 8 acts; sections = music sections (mood + bpm, dispatched by audio/score-tg.js).
import fs from 'node:fs';
const OFFSET = 0.6, TAIL = 3.2, FPS = 30;
const v = JSON.parse(fs.readFileSync('../voice/out-fh/timing.json', 'utf8'));
const words = JSON.parse(fs.readFileSync('../voice/out-fh/words.json', 'utf8'));
const cues = v.cues.map((c) => ({ id: c.id, section: c.section, voice: c.voice, start: +(c.start + OFFSET).toFixed(3), end: +(c.end + OFFSET).toFixed(3), text: c.text }));
const duration = +(v.duration + OFFSET + TAIL).toFixed(3);
const C0 = (i) => cues[i].start, C1 = (i) => cues[i].end;
const W = words.map((w) => ({ c: w.cue, i: w.i, w: w.word, s: +(w.start + OFFSET).toFixed(3), e: +(w.end + OFFSET).toFixed(3) }));
const TITLES = ['Cold Open', 'The Brain', 'The Open Door', 'How They Got In', 'The Night', 'How Big', 'It Happened Before', 'Your Turn'];
const scenes = TITLES.map((title, s) => {
  const first = cues.find((c) => c.section === s), next = cues.find((c) => c.section === s + 1);
  return { index: s, title, start: s === 0 ? 0 : +(first.start - 0.4).toFixed(3), end: next ? +(next.start - 0.4).toFixed(3) : duration };
});
const A = 84, B = 100;
// one consistent bed: the same dark synth palette all the way through, only the intensity changes
const plan = [
  ['invest', 0, A], ['inside', C0(6) - 0.3, A], ['calm', C0(14) - 0.3, A], ['inside', C0(23) - 0.3, A], ['audio', C0(30) - 0.3, A],
  ['invest', C0(40) - 0.3, A], ['calm', C0(48) - 0.3, A], ['open', C0(56) - 0.3, A],
];
const sections = plan.map(([mood, start, bpm], k) => ({ index: k, title: mood, mood, bpm, start: +Math.max(0, start).toFixed(3), end: 0 }));
sections.forEach((s, k) => { s.end = k < sections.length - 1 ? sections[k + 1].start : duration; });
const events = [];
const out = { fps: FPS, offset: OFFSET, duration, bpm: A, scenes, sections, cues, hooks: [], words: W, events };
fs.writeFileSync('src/fh/timeline.json', JSON.stringify(out, null, 1));
for (const s of scenes) console.log('act', s.index, s.start.toFixed(2), '->', s.end.toFixed(2), s.title);
console.log('sections', sections.length, 'duration', duration, '=', Math.floor(duration / 60) + ':' + (duration % 60).toFixed(1), 'frames', Math.ceil(duration * FPS));
