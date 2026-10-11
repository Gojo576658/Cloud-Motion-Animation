// Cursed CPU Short (1080×1920): 10 beats with vertical whip / zoom / hard-cut transitions,
// Shorts captions, film grain, soundtrack and the comedy SFX layer. The end runs into frame 0 (loop).
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FilmLook } from '../components/Backdrop';
import { SfxTrack, type SfxEvent } from '../lib/sfx';
import { EASE, ramp } from '../lib/time';
import { ShortCaptions } from '../short/ShortCaptions';
import { KTL, C0, C1 } from './ktime';
import { K, Beat0, Beat1, Beat2, Beat3, Beat4, sfx0, sfx1, sfx2, sfx3, sfx4 } from './BeatsA';
import { END, Beat5, Beat6, Beat7, Beat8, Beat9, sfx5, sfx6, sfx7, sfx8, sfx9 } from './BeatsB';

type Enter = 'cut' | 'whip' | 'zoom';
const COMPS: [React.FC, Enter][] = [[Beat0, 'cut'], [Beat1, 'whip'], [Beat2, 'zoom'], [Beat3, 'whip'], [Beat4, 'cut'], [Beat5, 'zoom'], [Beat6, 'whip'], [Beat7, 'zoom'], [Beat8, 'whip'], [Beat9, 'whip']];
const BEATS = COMPS.map(([comp, enter], i) => ({ comp, enter, from: K[i], to: K[i + 1] ?? END }));
const soft = (e: Enter) => e !== 'cut';

const transitionSfx: SfxEvent[] = BEATS.slice(1).flatMap((b): SfxEvent[] => {
  if (b.enter === 'whip') return [{ t: b.from - 0.24, name: 'whooshBig', vol: 0.4 }];
  if (b.enter === 'zoom') return [{ t: b.from - 0.2, name: 'zoomFast', vol: 0.38 }];
  return [];
});
const SFX = [...transitionSfx, ...sfx0, ...sfx1, ...sfx2, ...sfx3, ...sfx4, ...sfx5, ...sfx6, ...sfx7, ...sfx8, ...sfx9];
// Chip's "Wait! What did I do?!" is already in his speech bubble
const HIDE: [number, number][] = [[C0(4) - 0.05, C1(4) + 0.3]];
const KEYS = /^(banned|cpu|cheated|hardware|kicked|mistake|like|subscribe|key|twist|lonely|sold|max)$/i;

const Frame: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const b = BEATS[i], next = BEATS[i + 1];
  let tf = '', op = 1, blur = 0;
  if (i > 0 && t < b.from + 0.4) {
    if (b.enter === 'whip') { const u = ramp(t, b.from - 0.18, 0.36, EASE.inOut); tf += `translateY(${(1 - u) * 1920}px)`; blur += (1 - Math.abs(u * 2 - 1)) * 30; }
    if (b.enter === 'zoom') { const u = ramp(t, b.from - 0.04, 0.32, EASE.out); tf += `scale(${1.5 - 0.5 * u})`; op *= Math.min(1, u * 1.6); blur += (1 - u) * 14; }
  }
  if (next && t > next.from - 0.3) {
    if (next.enter === 'whip') { const u = ramp(t, next.from - 0.18, 0.36, EASE.inOut); tf += ` translateY(${-u * 1920}px)`; blur += (1 - Math.abs(u * 2 - 1)) * 30; }
    if (next.enter === 'zoom') { const u = ramp(t, next.from - 0.22, 0.26, EASE.in); tf += ` scale(${1 + 0.7 * u})`; op *= 1 - u; blur += u * 16; }
  }
  return <AbsoluteFill style={{ transform: tf || undefined, opacity: op, filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined }}>{children}</AbsoluteFill>;
};

export const CpuShort: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      {BEATS.map((b, i) => {
        const next = BEATS[i + 1];
        const from = i && soft(b.enter) ? b.from - 0.3 : b.from;
        const to = next && soft(next.enter) ? b.to + 0.3 : b.to;
        if (t < from || t >= to) return null;
        const Comp = b.comp;
        return <Frame key={i} i={i}><Comp /></Frame>;
      })}
      <ShortCaptions hide={HIDE} words={KTL.words} keys={KEYS} />
      <FilmLook vignette={0.55} grain={0.08} />
      <Audio src={staticFile('cshort/soundtrack.wav')} />
      <SfxTrack events={SFX} />
    </AbsoluteFill>
  );
};
