import React from 'react';
import { AbsoluteFill, Audio, Composition, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FilmLook } from './components/Backdrop';
import { Captions } from './components/Captions';
import { SfxTrack, type SfxEvent } from './lib/sfx';
import { TL, EASE, ramp } from './lib/time';
import { SECTIONS } from './sections';

const FPS = 30;
type Trans = 'cut' | 'whip' | 'scale' | 'wipe';

// transition sounds, placed automatically at every section boundary
const transitionSfx: SfxEvent[] = SECTIONS.slice(1).flatMap((s) => {
  const B = s.start;
  if (s.enter === 'whip') return [{ t: B - 0.28, name: 'whooshBig', vol: 0.5 }, { t: B + 0.02, name: 'bassHit', vol: 0.35 }];
  if (s.enter === 'scale') return [{ t: B - 0.35, name: 'zoomAir', vol: 0.5 }, { t: B + 0.02, name: 'impactDeep', vol: 0.4 }];
  if (s.enter === 'wipe') return [{ t: B - 0.5, name: 'swoosh', vol: 0.5 }, { t: B, name: 'impact', vol: 0.4 }];
  return [];
});
const allSfx = [...transitionSfx, ...SECTIONS.flatMap((s) => s.sfx)];
const noCaptions: [number, number][] = [
  ...SECTIONS.flatMap((s) => s.noCaptions),
  ...SECTIONS.slice(1).map((s) => [s.start - 0.35, s.start + 0.45] as [number, number]),
];

// wraps a section with enter/exit transition transforms
const SectionFrame: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const s = SECTIONS[i], next = SECTIONS[i + 1];
  let tf = '', op = 1, blur = 0;
  const enter: Trans = s.enter;
  if (i > 0 && t < s.start + 0.4) {
    if (enter === 'whip') { const u = ramp(t, s.start - 0.2, 0.4, EASE.inOut); tf += `translateX(${(1 - u) * 1920}px)`; blur += (1 - Math.abs(u * 2 - 1)) * 26; }
    if (enter === 'scale') { const u = ramp(t, s.start - 0.15, 0.45, EASE.out); tf += `scale(${0.82 + 0.18 * u})`; op *= u; }
  }
  if (next && t > next.start - 0.45) {
    const ex: Trans = next.enter;
    if (ex === 'whip') { const u = ramp(t, next.start - 0.2, 0.4, EASE.inOut); tf += ` translateX(${-u * 1920}px)`; blur += (1 - Math.abs(u * 2 - 1)) * 26; }
    if (ex === 'scale') { const u = ramp(t, next.start - 0.35, 0.45, EASE.in); tf += ` scale(${1 + 0.35 * u})`; op *= 1 - u; }
  }
  return <AbsoluteFill style={{ transform: tf || undefined, opacity: op, filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined }}>{children}</AbsoluteFill>;
};

export const Main: React.FC<{ audio?: boolean }> = ({ audio = true }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      {SECTIONS.map((s, i) => {
        const next = SECTIONS[i + 1];
        const from = i ? s.start - 0.5 : 0, to = next ? next.start + 0.5 : TL.duration + 1;
        if (t < from || t > to) return null;
        const Comp = s.comp;
        return <SectionFrame key={i} i={i}><Comp /></SectionFrame>;
      })}
      {/* wipes cover the cut */}
      {SECTIONS.map((s, i) => (i && s.enter === 'wipe' && Math.abs(t - s.start) < 0.9 ? <WipeOver key={`w${i}`} at={s.start} color={s.accent} /> : null))}
      <Captions hide={noCaptions} />
      <FilmLook />
      {audio && <Audio src={staticFile('soundtrack.wav')} />}
      {audio && <SfxTrack events={allSfx} />}
    </AbsoluteFill>
  );
};

const WipeOver: React.FC<{ at: number; color: string }> = ({ at, color }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {[color, '#0b1224'].map((c, i) => {
        const inU = ramp(t, at - 0.5 + i * 0.06, 0.42, EASE.inOut);
        const outU = ramp(t, at + 0.05 + (1 - i) * 0.06, 0.5, EASE.inOut);
        return <div key={i} style={{ position: 'absolute', left: '-30%', top: '-40%', width: '160%', height: '180%', background: c, transform: `rotate(-12deg) translateX(${120 - inU * 120 - outU * 125}%)`, borderRadius: 60 }} />;
      })}
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <>
    <Composition id="SmartTV" component={Main} width={1920} height={1080} fps={FPS} durationInFrames={Math.ceil(TL.duration * FPS)} />
    {SECTIONS.map((s, i) => (
      <Composition key={i} id={`S${i}`} component={Main} width={1920} height={1080} fps={FPS} durationInFrames={Math.ceil(TL.duration * FPS)} />
    ))}
  </>
);
