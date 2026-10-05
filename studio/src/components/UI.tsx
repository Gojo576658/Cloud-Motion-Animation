// HUD / UI building blocks: chips, glass panels, toggles, focus brackets, transitions.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, rng } from '../lib/time';

const useT = () => useCurrentFrame() / useVideoConfig().fps;

export const Pill: React.FC<{ x: number; y: number; at: number; out?: number; color: string; children: React.ReactNode; dot?: boolean; dark?: boolean; size?: number; center?: boolean }> = ({ x, y, at, out, color, children, dot = true, dark = false, size = 26, center = false }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  if (t < at || (out != null && t > out + 0.4)) return null;
  const s = springAt(f, fps, at, { damping: 12, stiffness: 180 });
  const o = out != null ? 1 - ramp(t, out, 0.3, EASE.in) : 1;
  const blink = dot ? 0.55 + 0.45 * Math.sin(t * 7) : 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${center ? '-50%' : '0'}, 0) scale(${0.6 + 0.4 * s})`, transformOrigin: 'left center', opacity: clamp(s * 1.5) * o, display: 'flex', alignItems: 'center', gap: 12, padding: `${size * 0.45}px ${size * 0.85}px`, borderRadius: 999, background: dark ? 'rgba(6,10,20,.8)' : `${color}22`, border: `2px solid ${color}`, color: dark ? color : C.ink, fontFamily: fonts.body, fontWeight: 700, fontSize: size, letterSpacing: '0.12em', textTransform: 'uppercase', boxShadow: `0 0 30px ${color}44, inset 0 0 20px ${color}22`, backdropFilter: 'blur(6px)' }}>
      {dot && <span style={{ width: size * 0.42, height: size * 0.42, borderRadius: '50%', background: color, opacity: blink, boxShadow: `0 0 12px ${color}` }} />}
      {children}
    </div>
  );
};

export const Panel: React.FC<{ x: number; y: number; w: number; h?: number; at: number; out?: number; children?: React.ReactNode; from?: 'up' | 'left' | 'right' | 'scale'; accent?: string; pad?: number }> = ({ x, y, w, h, at, out, children, from = 'up', accent = C.cyan, pad = 34 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  if (t < at || (out != null && t > out + 0.5)) return null;
  const s = springAt(f, fps, at, { damping: 16, stiffness: 140 });
  const o = out != null ? 1 - ramp(t, out, 0.35, EASE.in) : 1;
  const tf = from === 'up' ? `translateY(${(1 - s) * 70}px)` : from === 'left' ? `translateX(${(s - 1) * 120}px)` : from === 'right' ? `translateX(${(1 - s) * 120}px)` : `scale(${0.85 + 0.15 * s})`;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, padding: pad, borderRadius: 26, transform: tf, opacity: clamp(s * 1.4) * o, background: 'linear-gradient(160deg, rgba(22,32,60,.82), rgba(8,12,24,.86))', border: '1px solid rgba(140,170,230,.18)', boxShadow: `0 40px 90px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08), 0 0 0 1px ${accent}10`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      {children}
    </div>
  );
};

export const Toggle: React.FC<{ on: number; color?: string; offColor?: string; size?: number }> = ({ on, color = C.red, offColor = C.green, size = 1 }) => {
  const w = 120 * size, h = 64 * size, k = 50 * size;
  const c = on > 0.5 ? color : offColor;
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: h, background: `${c}30`, border: `3px solid ${c}`, boxShadow: `0 0 26px ${c}55` }}>
      <div style={{ position: 'absolute', top: (h - k) / 2 - 3, left: 4 + on * (w - k - 14), width: k, height: k, borderRadius: '50%', background: c, boxShadow: `0 4px 14px rgba(0,0,0,.5), 0 0 18px ${c}` }} />
    </div>
  );
};

// animated corner brackets around a rectangle (focus / scan frame)
export const Brackets: React.FC<{ x: number; y: number; w: number; h: number; at: number; out?: number; color?: string; label?: string }> = ({ x, y, w, h, at, out, color = C.cyan, label }) => {
  const t = useT();
  if (t < at || (out != null && t > out + 0.4)) return null;
  const u = ramp(t, at, 0.6, EASE.out);
  const o = out != null ? 1 - ramp(t, out, 0.3) : 1;
  const L = 60, gap = (1 - u) * 60;
  const corner = (cx: number, cy: number, sx: number, sy: number) => (
    <div style={{ position: 'absolute', left: cx - (sx < 0 ? L : 0) + sx * -gap, top: cy - (sy < 0 ? L : 0) + sy * -gap, width: L, height: L, borderLeft: sx > 0 ? `4px solid ${color}` : undefined, borderRight: sx < 0 ? `4px solid ${color}` : undefined, borderTop: sy > 0 ? `4px solid ${color}` : undefined, borderBottom: sy < 0 ? `4px solid ${color}` : undefined, filter: `drop-shadow(0 0 8px ${color})` }} />
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: u * o }}>
      {corner(x, y, 1, 1)}{corner(x + w, y, -1, 1)}{corner(x, y + h, 1, -1)}{corner(x + w, y + h, -1, -1)}
      {label && <div style={{ position: 'absolute', left: x, top: y - 46, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color, letterSpacing: '0.08em' }}>{label}</div>}
      {/* scan line */}
      <div style={{ position: 'absolute', left: x, top: y + ((t * 0.6) % 1) * h, width: w, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.6 }} />
    </div>
  );
};

// diagonal multi-bar wipe; screen fully covered at `at`
export const Wipe: React.FC<{ at: number; colors?: string[] }> = ({ at, colors = [C.red, C.cyan, '#0b1224'] }) => {
  const t = useT();
  if (t < at - 0.7 || t > at + 0.8) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {colors.map((c, i) => {
        const inU = ramp(t, at - 0.55 + i * 0.06, 0.45, EASE.inOut);
        const outU = ramp(t, at + 0.05 + (colors.length - 1 - i) * 0.06, 0.5, EASE.inOut);
        const x = 120 - inU * 120 - outU * 125;
        return <div key={i} style={{ position: 'absolute', left: '-30%', top: '-40%', width: '160%', height: '180%', background: c, transform: `rotate(-12deg) translateX(${x}%)`, borderRadius: 60, boxShadow: '0 0 80px rgba(0,0,0,.6)' }} />;
      })}
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{ at: number; color?: string; d?: number; max?: number }> = ({ at, color = '#fff', d = 0.45, max = 0.85 }) => {
  const t = useT();
  if (t < at || t > at + d) return null;
  return <AbsoluteFill style={{ background: color, opacity: max * (1 - ramp(t, at, d, EASE.out)) }} />;
};

export const Fade: React.FC<{ at: number; d?: number; out?: boolean; color?: string }> = ({ at, d = 0.6, out = false, color = '#000' }) => {
  const t = useT();
  const u = ramp(t, at, d, EASE.inOut);
  const o = out ? u : 1 - u;
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o }} />;
};

// expanding sound-wave rings
export const Rings: React.FC<{ x: number; y: number; at: number; out: number; color?: string; max?: number; count?: number; speed?: number }> = ({ x, y, at, out, color = C.red, max = 600, count = 5, speed = 0.55 }) => {
  const t = useT();
  if (t < at || t > out + 1) return null;
  const a = Math.min(ramp(t, at, 0.4), 1 - ramp(t, out, 0.6));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {Array.from({ length: count }, (_, i) => {
        const ph = ((t - at) * speed + i / count) % 1;
        const r = 20 + ph * max;
        return <div key={i} style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `3px solid ${color}`, opacity: a * (1 - ph) * 0.85, boxShadow: `0 0 20px ${color}66` }} />;
      })}
    </div>
  );
};

export const glitchOffset = (t: number, at: number, d = 0.5, amp = 18) => {
  if (t < at || t > at + d) return { x: 0, skew: 0 };
  const r = rng(Math.floor(t * 30));
  return { x: (r() - 0.5) * amp, skew: (r() - 0.5) * 10 };
};
