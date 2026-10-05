// Scene "look" layers (remotion-motion-graphics 5-layer stack):
// BgMesh (living background) -> [assets] -> [graphics] -> Grade -> FilmLook (grain+vignette, in Root).
import React from 'react';
import { AbsoluteFill, OffthreadVideo, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../lib/theme';
import { EASE, ramp, clamp } from '../lib/time';

const useT = () => useCurrentFrame() / useVideoConfig().fps;

// slowly drifting colour blobs (no CSS blur filters: radial gradients are already soft and cheap)
export const BgMesh: React.FC<{ a?: string; b?: string; base?: string; speed?: number }> = ({ a = C.blue, b = C.red, base = C.bg0, speed = 1 }) => {
  const t = useT() * speed;
  const d1 = Math.sin(t / 1.8) * 90, d2 = Math.cos(t / 2.3) * 70;
  return (
    <AbsoluteFill style={{ background: base, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', top: -650, left: -420 + d1, background: `radial-gradient(circle, ${a}38, transparent 62%)` }} />
      <div style={{ position: 'absolute', width: 1200, height: 1200, borderRadius: '50%', bottom: -620, right: -360 - d2, background: `radial-gradient(circle, ${b}26, transparent 64%)` }} />
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', top: 200 + d2 * 0.6, left: 620 - d1 * 0.5, background: `radial-gradient(circle, ${a}14, transparent 66%)` }} />
    </AbsoluteFill>
  );
};

// unifying colour grade: cool shadows, slight top/bottom falloff
export const Grade: React.FC<{ tint?: string; amount?: number }> = ({ tint = '#1d3a8a', amount = 0.12 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <AbsoluteFill style={{ background: tint, opacity: amount }} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.28), transparent 26%, transparent 70%, rgba(0,0,0,0.38))' }} />
  </AbsoluteFill>
);

// idle "breathing" for anything that stays on screen > 2s
export const useBreathe = (amp = 0.012, speed = 1) => {
  const t = useT();
  return { scale: 1 + Math.sin(t * 1.35 * speed) * amp, y: Math.sin(t * 1.0 * speed) * 4 };
};

// Real footage (Pexels) with Ken Burns, grade and a mask-wipe entrance / fast exit.
// `at`..`out` in seconds on the global clock; `from` = seconds into the clip.
export const Footage: React.FC<{
  src: string; at: number; out: number; from?: number;
  x?: number; y?: number; w?: number; h?: number;        // default full frame
  zoom?: [number, number]; pan?: [number, number];        // Ken Burns scale range, x pan px
  rate?: number; radius?: number; label?: string; still?: boolean;
  enter?: 'wipe' | 'scale' | 'fade'; tint?: string; desat?: number;
}> = ({ src, at, out, from = 0, x = 0, y = 0, w = 1920, h = 1080, zoom = [1.04, 1.14], pan = [-30, 30], rate = 1, radius = 0, label, still = false, enter = 'wipe', tint = '#10204a', desat = 0.15 }) => {
  const { fps } = useVideoConfig();
  const t = useT();
  if (t < at - 0.05 || t > out + 0.3) return null;
  const u = clamp((t - at) / Math.max(0.5, out - at));
  const inU = ramp(t, at, 0.55, EASE.out);
  const outU = ramp(t, out - 0.3, 0.3, EASE.in);
  const sc = zoom[0] + (zoom[1] - zoom[0]) * EASE.smooth(u);
  const px = pan[0] + (pan[1] - pan[0]) * EASE.smooth(u);
  const clip = enter === 'wipe' ? `inset(0 ${(1 - inU) * 100}% 0 0 round ${radius}px)` : `inset(0 0 0 0 round ${radius}px)`;
  const s0 = enter === 'scale' ? 0.88 + 0.12 * inU : 1;
  const media: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${sc}) translateX(${px}px)`, filter: `saturate(${1 - desat}) contrast(1.06) brightness(0.92)` };
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, clipPath: clip, borderRadius: radius, overflow: 'hidden', opacity: (enter === 'fade' ? inU : 1) * (1 - outU), transform: `scale(${s0 * (1 - outU * 0.04)})`, boxShadow: radius ? '0 40px 90px rgba(0,0,0,.6)' : undefined }}>
      {still ? <Img src={staticFile(src.replace(/\.mp4$/, '.jpg'))} style={media} /> : (
        <Sequence from={Math.round(at * fps)} layout="none">
          <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * fps)} playbackRate={rate} muted style={media} />
        </Sequence>
      )}
      <div style={{ position: 'absolute', inset: 0, background: tint, opacity: 0.18 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)' }} />
      {label && <div style={{ position: 'absolute', left: 28, bottom: 24, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '0.22em', color: 'rgba(238,243,251,.75)' }}>{label}</div>}
    </div>
  );
};
