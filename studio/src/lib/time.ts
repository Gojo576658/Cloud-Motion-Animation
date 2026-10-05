// One clock for everything: the real voiceover timing (src/timeline.json).
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import timeline from '../timeline.json';

export const TL = timeline as {
  fps: number; offset: number; duration: number; titleAt: number;
  sections: { index: number; title: string; mood: string; start: number; end: number }[];
  cues: { id: number; section: number; start: number; end: number; hooks: number[]; text: string }[];
  hooks: number[];
  words: { c: number; i: number; w: string; s: number; e: number }[];
};
const WORDS_BY_CUE: Record<number, { s: number; e: number }[]> = {};
for (const w of TL.words || []) (WORDS_BY_CUE[w.c] ||= [])[w.i] = w;

export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

export const C0 = (i: number) => TL.cues[i].start;
export const C1 = (i: number) => TL.cues[i].end;
export const S0 = (i: number) => TL.sections[i].start;
export const S1 = (i: number) => TL.sections[i].end;

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
// exact moment a phrase starts being spoken (Whisper word timing; falls back to word position)
export function P(i: number, phrase: string, off = 0) {
  const c = TL.cues[i];
  const raw = c.text.split(/\s+/);
  const q = norm(phrase);
  for (let k = 0; k < raw.length; k++) {
    // compare word by word on normalized text (one raw word can hold e.g. "Wi-Fi")
    const window = norm(raw.slice(k, k + q.length + 2).join(' '));
    if (q.every((x, j) => window[j] === x)) {
      const w = WORDS_BY_CUE[i]?.[k];
      return (w ? w.s : c.start + ((c.end - c.start) * k) / raw.length) + off;
    }
  }
  throw new Error(`phrase "${phrase}" not in cue ${i}`);
}
// end time of a phrase
export function PE(i: number, phrase: string, off = 0) {
  const c = TL.cues[i];
  const raw = c.text.split(/\s+/);
  const q = norm(phrase);
  for (let k = 0; k < raw.length; k++) {
    const window = norm(raw.slice(k, k + q.length + 2).join(' '));
    if (q.every((x, j) => window[j] === x)) {
      // find the last raw word that covers the phrase
      let n = 0, last = k;
      while (n < q.length && last < raw.length) { n += norm(raw[last]).length; last++; }
      const w = WORDS_BY_CUE[i]?.[last - 1];
      return (w ? w.e : c.end) + off;
    }
  }
  throw new Error(`phrase "${phrase}" not in cue ${i}`);
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),        // expo-ish out (AE "easy ease out" feel)
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
  smooth: Easing.bezier(0.45, 0, 0.55, 1),
};

// 0→1 between t0 and t0+d with easing
export const ramp = (t: number, t0: number, d: number, e = EASE.out) =>
  interpolate(t, [t0, t0 + d], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e });

// visible window with fade in/out
export const win = (t: number, a: number, b: number, fi = 0.35, fo = 0.3) =>
  Math.min(ramp(t, a, fi, EASE.out), 1 - ramp(t, b - fo, fo, EASE.in));

// spring that starts at time t0 (seconds)
export const springAt = (frame: number, fps: number, t0: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  spring({ frame: frame - Math.round(t0 * fps), fps, config: { damping: 14, stiffness: 120, mass: 0.9, ...cfg } });

// keyframe track: [[t, value], ...] with easing between keys
export function track(t: number, keys: [number, number][], e = EASE.inOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [ta, va] = keys[i], [tb, vb] = keys[i + 1];
    if (t <= tb) return lerp(va, vb, e(clamp((t - ta) / (tb - ta))));
  }
  return keys[keys.length - 1][1];
}

// deterministic random
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
