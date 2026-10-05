// Shared film look: deep gradient, drifting grid, dust particles, vignette, grain, light leak.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../lib/theme';
import { rng } from '../lib/time';

export const Gradient: React.FC<{ hue?: string; x?: number; y?: number }> = ({ hue = '#13244a', x = 50, y = 40 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x}% ${y}%, ${hue} 0%, ${C.bg1} 45%, ${C.bg0} 100%)` }} />
);

export const Grid: React.FC<{ opacity?: number; speed?: number; color?: string; size?: number; perspective?: boolean }> = ({ opacity = 0.35, speed = 12, color = 'rgba(80,130,220,0.22)', size = 80, perspective = true }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const off = (t * speed) % size;
  const g = (
    <div style={{ position: 'absolute', inset: perspective ? '-60% -40% 0 -40%' : 0, backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`, backgroundSize: `${size}px ${size}px`, backgroundPosition: `0 ${off}px`, opacity }} />
  );
  if (!perspective) return <AbsoluteFill>{g}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{ perspective: 900, overflow: 'hidden', maskImage: 'linear-gradient(to top, black 10%, transparent 75%)', WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 75%)' }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'rotateX(68deg) translateY(30%)', transformOrigin: '50% 100%' }}>{g}</div>
    </AbsoluteFill>
  );
};

export const Dust: React.FC<{ count?: number; color?: string; seed?: number; opacity?: number }> = ({ count = 60, color = '#9fc3ff', seed = 3, opacity = 0.5 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const r = rng(seed);
  const parts = Array.from({ length: count }, () => ({ x: r() * 1920, y: r() * 1080, s: 1 + r() * 2.6, v: 6 + r() * 20, ph: r() * 10, a: 0.2 + r() * 0.8 }));
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {parts.map((p, i) => {
        const y = (p.y - t * p.v + 1200) % 1200 - 60;
        const x = p.x + Math.sin(t * 0.4 + p.ph) * 18;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: p.s, height: p.s, borderRadius: '50%', background: color, opacity: opacity * p.a * (0.6 + 0.4 * Math.sin(t * 1.3 + p.ph)), boxShadow: `0 0 ${p.s * 4}px ${color}` }} />;
      })}
    </AbsoluteFill>
  );
};

// grain from a tiny pre-baked noise tile (cheap), jittered every frame
const NOISE = (() => {
  const r = rng(99);
  let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">';
  for (let i = 0; i < 900; i++) { const v = Math.round(r() * 255); svg += `<rect x="${Math.floor(r() * 160)}" y="${Math.floor(r() * 160)}" width="1" height="1" fill="rgb(${v},${v},${v})"/>`; }
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg + '</svg>')}")`;
})();

export const FilmLook: React.FC<{ vignette?: number; grain?: number }> = ({ vignette = 0.65, grain = 0.09 }) => {
  const f = useCurrentFrame();
  const r = rng(f + 1);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ backgroundImage: NOISE, backgroundPosition: `${Math.floor(r() * 160)}px ${Math.floor(r() * 160)}px`, opacity: grain * 0.6 }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,${vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};

// soft colored glow blob
export const Glow: React.FC<{ x: number; y: number; r: number; color: string; opacity?: number }> = ({ x, y, r, color, opacity = 1 }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, pointerEvents: 'none' }} />
);
