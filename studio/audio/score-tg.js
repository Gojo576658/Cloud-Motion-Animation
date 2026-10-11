// Score for "Two Guesses Left": each section renders on its own, so this dispatcher sends dark/suspense
// moods to the Smart-TV score and the lighter heist/human moods to the CPU score, each at its own bpm.
import { compose as composeDark, toWav } from './score.js';
import { compose as composeLight } from './score-cpu.js';
export { toWav };
const LIGHT = new Set(['mystery', 'title', 'playful', 'sneaky', 'tech', 'twist', 'sad', 'bright', 'warm']);
export async function compose(tl) {
  const s = tl.sections[0];
  return (LIGHT.has(s.mood) ? composeLight : composeDark)({ ...tl, bpm: s.bpm || tl.bpm });
}
