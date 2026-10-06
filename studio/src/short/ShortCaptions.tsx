// Shorts-style captions: 1–3 big words per page, the spoken word pops in yellow,
// key words in red. Sits at y≈1330 — above the Shorts title/UI band, below the graphics.
import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { STL } from './stime';
import { clamp, EASE, ramp } from '../lib/time';
import { C, fonts } from '../lib/theme';

const KEY = /^(microphone|awake|worse|thirty-eight|optional|off|cia|recording|nobody|tonight|seventy|thousand|dollars|uploading|later|neighbour's|wi-fi)$/i;
const YEL = '#FFD23A';
const outline = (c: string, w: number) => [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1.3], [0, 1.3], [-1.3, 0], [1.3, 0]].map(([x, y]) => `${x * w}px ${y * w}px 0 ${c}`).join(',');

export const ShortCaptions: React.FC<{ hide?: [number, number][]; y?: number }> = ({ hide = [], y = 1330 }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const pages = useMemo(() => {
    const out: { s: number; e: number; words: { w: string; s: number; e: number }[] }[] = [];
    let cur: typeof out[number] | null = null;
    STL.words.forEach((w, k) => {
      const p = STL.words[k - 1];
      const chars = cur ? cur.words.map((x) => x.w).join(' ').length : 0;
      const brk = !cur || cur.words.length >= 3 || chars + w.w.length > 16 || (p && /[.?!…,]["”]?$/.test(p.w)) || (p && w.s - p.e > 0.3);
      if (brk) { cur = { s: w.s, e: w.e, words: [] }; out.push(cur); }
      cur!.words.push(w); cur!.e = w.e;
    });
    out.forEach((p, i) => { const nx = out[i + 1]; p.e = Math.min(nx ? nx.s : p.e + 0.6, p.e + 0.45); });
    return out;
  }, []);
  if (hide.some(([a, b]) => t >= a && t <= b)) return null;
  const page = pages.find((p) => t >= p.s - 0.02 && t < p.e);
  if (!page) return null;
  const pin = ramp(t, page.s - 0.02, 0.14, EASE.out);
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: y, transform: `translateY(-50%) scale(${0.86 + 0.14 * pin})`, opacity: clamp(pin * 1.5), display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: 26, rowGap: 0, pointerEvents: 'none' }}>
      {page.words.map((w, i) => {
        const active = t >= w.s && t < w.e + 0.05;
        const word = w.w.replace(/[.,!?…:;"“”]/g, '');
        const key = KEY.test(word);
        const pop = active ? 1 + 0.16 * clamp(1 - (t - w.s) / 0.16) : 1;
        const color = active ? YEL : key ? C.red : '#ffffff';
        return (
          <span key={i} style={{ display: 'inline-block', fontFamily: fonts.head, fontWeight: 900, fontSize: 86, lineHeight: 1.08, letterSpacing: '-0.01em', textTransform: 'uppercase', color, transform: `scale(${pop}) rotate(${active ? -2 : 0}deg)`, textShadow: `${outline('#000', 5)}, 0 10px 30px rgba(0,0,0,.85)${active ? `, 0 0 40px ${YEL}66` : ''}` }}>{w.w.replace(/…$/, '')}</span>
        );
      })}
    </div>
  );
};
