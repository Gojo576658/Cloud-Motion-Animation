// The Short (1080×1920): beats with vertical whip / zoom / hard-cut transitions, Shorts captions,
// film grain, music + voice soundtrack and the per-animation SFX layer. Ends on frame 0 (loop).
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FilmLook, Dust } from '../components/Backdrop';
import { Grade } from '../components/Look';
import { SfxTrack, type SfxEvent } from '../lib/sfx';
import { EASE, ramp } from '../lib/time';
import { ShortCaptions } from './ShortCaptions';
import { Beat0, Beat1, Beat2, Beat3, Beat45, B1, B2, B3, B4, sfx0, sfx1, sfx2, sfx3, sfx45 } from './BeatsA';
import { Beat6, Beat7, Beat8, Beat9, Beat10, B6, B7, B8, B9, B10, END, sfx6, sfx7, sfx8, sfx9, sfx10 } from './BeatsB';

type Enter = 'cut' | 'flash' | 'whip' | 'zoom';
const BEATS: { comp: React.FC; from: number; to: number; enter: Enter }[] = [
  { comp: Beat0, from: 0, to: B1, enter: 'cut' },
  { comp: Beat1, from: B1, to: B2, enter: 'flash' },
  { comp: Beat2, from: B2, to: B3, enter: 'whip' },
  { comp: Beat3, from: B3, to: B4, enter: 'cut' },
  { comp: Beat45, from: B4, to: B6, enter: 'zoom' },
  { comp: Beat6, from: B6, to: B7, enter: 'whip' },
  { comp: Beat7, from: B7, to: B8, enter: 'cut' },
  { comp: Beat8, from: B8, to: B9, enter: 'zoom' },
  { comp: Beat9, from: B9, to: B10, enter: 'whip' },
  { comp: Beat10, from: B10, to: END, enter: 'whip' },
];
const soft = (e: Enter) => e === 'whip' || e === 'zoom';

const transitionSfx: SfxEvent[] = BEATS.slice(1).flatMap((b): SfxEvent[] => {
  if (b.enter === 'whip') return [{ t: b.from - 0.24, name: 'whooshBig', vol: 0.42 }];
  if (b.enter === 'zoom') return [{ t: b.from - 0.2, name: 'zoomFast', vol: 0.4 }, { t: b.from, name: 'impact', vol: 0.35 }];
  return [];
});
const SFX = [...transitionSfx, ...sfx0, ...sfx1, ...sfx2, ...sfx3, ...sfx45, ...sfx6, ...sfx7, ...sfx8, ...sfx9, ...sfx10];
const HIDE: [number, number][] = [[B3 - 0.05, B4 + 0.1], [B7 - 0.05, B8 + 0.05]];

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

export const ShortMain: React.FC = () => {
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
      <Dust count={26} opacity={0.22} />
      <Grade amount={0.08} />
      <ShortCaptions hide={HIDE} />
      <FilmLook vignette={0.6} grain={0.09} />
      <Audio src={staticFile('short/soundtrack.wav')} />
      <SfxTrack events={SFX} />
    </AbsoluteFill>
  );
};
