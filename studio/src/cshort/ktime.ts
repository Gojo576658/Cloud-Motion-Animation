// Clock for the Cursed CPU Short: same helpers as lib/time, bound to src/cshort/timeline.json.
import timeline from './timeline.json';

export const KTL = timeline as {
  fps: number; offset: number; duration: number; bpm: number;
  beats: number[];
  sections: { index: number; mood: string; start: number; end: number }[];
  cues: { id: number; start: number; end: number; text: string }[];
  words: { c: number; i: number; w: string; s: number; e: number }[];
};
const BY_CUE: Record<number, { s: number; e: number }[]> = {};
for (const w of KTL.words) (BY_CUE[w.c] ||= [])[w.i] = w;

export const C0 = (i: number) => KTL.cues[i].start;
export const C1 = (i: number) => KTL.cues[i].end;

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
const find = (i: number, phrase: string) => {
  const raw = KTL.cues[i].text.split(/\s+/), q = norm(phrase);
  for (let k = 0; k < raw.length; k++) {
    const w = norm(raw.slice(k, k + q.length + 2).join(' '));
    if (q.every((x, j) => w[j] === x)) {
      let n = 0, last = k;
      while (n < q.length && last < raw.length) { n += norm(raw[last]).length; last++; }
      return { k, last };
    }
  }
  throw new Error(`phrase "${phrase}" not in cpu-short cue ${i}`);
};
// moment a phrase starts / ends being spoken
export const P = (i: number, phrase: string, off = 0) => BY_CUE[i][find(i, phrase).k].s + off;
export const PE = (i: number, phrase: string, off = 0) => BY_CUE[i][find(i, phrase).last - 1].e + off;
