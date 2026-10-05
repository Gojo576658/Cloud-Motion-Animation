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
const transitionSfx: SfxEvent[] = SECTIONS.slice(1).flatMap((s): SfxEvent[] => {
  const B = s.start;
  if (s.enter === 'whip') return [{ t: B - 0.28, name: 'whooshBig', vol: 0.5 }, { t: B + 0.02, name: 'bassHit', vol: 0.35 }];
  if (s.enter === 'scale') return [{ t: B - 0.35, name: 'zoomAir', vol: 0.5 }, { t: B + 0.02, name: 'impactDeep', vol: 0.4 }];
  if (s.enter === 'wipe') return [{ t: B - 0.42, name: 'swoosh', vol: 0.5 }, { t: B - 0.02, name: 'impact', vol: 0.35 }];
  return [];
});
const allSfx = [...transitionSfx, ...SECTIONS.flatMap((s) => s.sfx)];
const noCaptions: [number, number][] = [
  ...SECTIONS.flatMap((s) => s.noCaptions),
  ...SECTIONS.slice(1).map((s) => [s.start - 0.35, s.start + 0.45] as [number, number]),
];

// wipe edge x (px, at mid-height) — crosses the frame centre exactly on the boundary
const WIPE_SKEW = 115; // half the horizontal lean of the -12° edge over 1080px
const wipeEdge = (t: number, at: number) => 2200 - 2560 * ramp(t, at - 0.38, 0.76, EASE.inOut);

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
  // wipe: a diagonal edge sweeps right → left; the new section is revealed behind it
  let clip: string | undefined;
  if (i > 0 && enter === 'wipe' && t < s.start + 0.4) { const e = wipeEdge(t, s.start); clip = `polygon(${e + WIPE_SKEW}px 0, 1920px 0, 1920px 1080px, ${e - WIPE_SKEW}px 1080px)`; }
  if (next && next.enter === 'wipe' && t > next.start - 0.4) { const e = wipeEdge(t, next.start); clip = `polygon(0 0, ${e + WIPE_SKEW}px 0, ${e - WIPE_SKEW}px 1080px, 0 1080px)`; }
  return <AbsoluteFill style={{ transform: tf || undefined, opacity: op, filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined, clipPath: clip }}>{children}</AbsoluteFill>;
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
      {SECTIONS.map((s, i) => (i && s.enter === 'wipe' && Math.abs(t - s.start) < 0.6 ? <WipeOver key={`w${i}`} at={s.start} color={s.accent} /> : null))}
      <Captions hide={noCaptions} />
      <FilmLook />
      {audio && <Audio src={staticFile('soundtrack.wav')} />}
      {audio && <SfxTrack events={allSfx} />}
    </AbsoluteFill>
  );
};

const WipeOver: React.FC<{ at: number; color: string }> = ({ at, color }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const e = wipeEdge(t, at);
  if (e > 2150 || e < -330) return null;
  const band = (off: number, w: number, bg: string, extra: React.CSSProperties = {}) => (
    <div style={{ position: 'absolute', left: e + off - w / 2, top: -60, width: w, height: 1200, background: bg, transform: 'skewX(-12deg)', ...extra }} />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {band(-10, 260, `linear-gradient(90deg, transparent, ${color}33 70%, transparent)`)}
      {band(0, 54, color, { boxShadow: `0 0 60px ${color}, 0 0 140px ${color}88` })}
      {band(46, 8, 'rgba(255,255,255,.8)')}
      {band(78, 4, `${color}aa`)}
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
