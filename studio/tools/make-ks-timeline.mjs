// Builds src/ks/timeline.json for "Kill Switch" (WannaCry and the accidental hero) from voice/out-ks (timing + per-line
// Whisper words). scenes = the 8 acts; sections = music sections (mood + bpm, dispatched by audio/score-tg.js).
import fs from 'node:fs';
const OFFSET = 0.6, TAIL = 3.2, FPS = 30;
const v = JSON.parse(fs.readFileSync('../voice/out-ks/timing.json', 'utf8'));
const words = JSON.parse(fs.readFileSync('../voice/out-ks/words.json', 'utf8'));
const cues = v.cues.map((c) => ({ id: c.id, section: c.section, voice: c.voice, start: +(c.start + OFFSET).toFixed(3), end: +(c.end + OFFSET).toFixed(3), text: c.text }));
const duration = +(v.duration + OFFSET + TAIL).toFixed(3);
const C0 = (i) => cues[i].start, C1 = (i) => cues[i].end;
const W = words.map((w) => ({ c: w.cue, i: w.i, w: w.word, s: +(w.start + OFFSET).toFixed(3), e: +(w.end + OFFSET).toFixed(3) }));
const TITLES = ['Cold Open', 'WannaCry', 'The Accidental Hero', 'The Kill Switch', 'Famous', 'The Arrest', 'The Verdict', 'Outro'];
const scenes = TITLES.map((title, s) => {
  const first = cues.find((c) => c.section === s), next = cues.find((c) => c.section === s + 1);
  return { index: s, title, start: s === 0 ? 0 : +(first.start - 0.4).toFixed(3), end: next ? +(next.start - 0.4).toFixed(3) : duration };
});
const A = 84, B = 100;
// one consistent bed: the same dark synth palette all the way through, only the intensity changes
const plan = [
  ['invest', 0, A], ['inside', C0(7) - 0.3, A], ['audio', C0(11) - 0.3, A], ['calm', C0(13) - 0.3, A], ['inside', C0(16) - 0.3, A],
  ['invest', C0(19) - 0.3, A], ['calm', C0(26) - 0.3, A], ['audio', C0(30) - 0.3, A], ['inside', C0(35) - 0.3, A], ['open', C0(40) - 0.3, A],
];
const sections = plan.map(([mood, start, bpm], k) => ({ index: k, title: mood, mood, bpm, start: +Math.max(0, start).toFixed(3), end: 0 }));
sections.forEach((s, k) => { s.end = k < sections.length - 1 ? sections[k + 1].start : duration; });
const events = [];
const out = { fps: FPS, offset: OFFSET, duration, bpm: A, scenes, sections, cues, hooks: [], words: W, events };
fs.writeFileSync('src/ks/timeline.json', JSON.stringify(out, null, 1));
for (const s of scenes) console.log('act', s.index, s.start.toFixed(2), '->', s.end.toFixed(2), s.title);
console.log('sections', sections.length, 'duration', duration, '=', Math.floor(duration / 60) + ':' + (duration % 60).toFixed(1), 'frames', Math.ceil(duration * FPS));
