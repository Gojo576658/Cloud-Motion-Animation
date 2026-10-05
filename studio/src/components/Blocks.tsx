// Reusable motion-graphic blocks used across sections.
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, rng } from '../lib/time';
import { Icon } from './Icon';

const useTF = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };

// premium entrance: opacity + rise + scale (spring), fast exit; plus idle breathing
export const useEnter = (at: number, out?: number, o: { rise?: number; scale?: number; delay?: number } = {}) => {
  const { f, fps, t } = useTF();
  const s = springAt(f, fps, at + (o.delay ?? 0), { damping: 15, stiffness: 140 });
  const ex = out != null ? ramp(t, out, 0.28, EASE.in) : 0;
  const breathe = Math.sin(t * 1.3 + at) * 0.006;
  return {
    visible: t >= at + (o.delay ?? 0) - 0.02 && (out == null || t < out + 0.32),
    style: { opacity: clamp(s * 1.4) * (1 - ex), transform: `translateY(${(1 - s) * (o.rise ?? 50) - ex * 24}px) scale(${(1 - (o.scale ?? 0.08)) + (o.scale ?? 0.08) * s + breathe - ex * 0.04})` } as React.CSSProperties,
    s, ex, t,
  };
};

// name card (who did what) with icon tile
export const NameCard: React.FC<{ x: number; y: number; at: number; out?: number; icon: string; title: string; sub?: string; color?: string; w?: number }> = ({ x, y, at, out, icon, title, sub, color = C.cyan, w = 520 }) => {
  const e = useEnter(at, out, { rise: 40 });
  if (!e.visible) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, display: 'flex', alignItems: 'center', gap: 22, padding: '20px 26px', borderRadius: 22, background: 'linear-gradient(160deg, rgba(22,32,60,.88), rgba(8,12,24,.9))', border: '1px solid rgba(140,170,230,.2)', boxShadow: '0 30px 70px rgba(0,0,0,.5)', ...e.style }}>
      <div style={{ width: 72, height: 72, flex: 'none', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}1f`, border: `2px solid ${color}88`, boxShadow: `0 0 26px ${color}33` }}><Icon name={icon} size={40} color={color} /></div>
      <div>
        <div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 38, color: C.ink, lineHeight: 1.1 }}>{title}</div>
        {sub && <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 20, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.dim, marginTop: 6 }}>{sub}</div>}
      </div>
    </div>
  );
};

// big animated number
export const Stat: React.FC<{ x: number; y: number; at: number; out?: number; to: number; fmt?: (v: number) => string; label: string; icon: string; color?: string; dur?: number; w?: number }> = ({ x, y, at, out, to, fmt = (v) => Math.round(v).toLocaleString('en-US'), label, icon, color = C.ink, dur = 1.4, w = 420 }) => {
  const e = useEnter(at, out, { rise: 60 });
  if (!e.visible) return null;
  const v = to * EASE.out(clamp((e.t - at - 0.1) / dur));
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, padding: '28px 32px', borderRadius: 26, background: 'linear-gradient(160deg, rgba(22,32,60,.86), rgba(8,12,24,.9))', border: '1px solid rgba(140,170,230,.18)', boxShadow: '0 40px 90px rgba(0,0,0,.55)', ...e.style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: fonts.body, fontWeight: 700, fontSize: 20, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.dim }}><Icon name={icon} size={26} color={C.dim} />{label}</div>
      <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 92, lineHeight: 1.05, marginTop: 10, color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{fmt(v)}</div>
    </div>
  );
};

// terminal / code window with scrolling lines
export const Terminal: React.FC<{ x: number; y: number; w: number; h: number; at: number; out?: number; title: string; icon: string; lines: (k: number) => string[]; color?: string; speed?: number; typed?: boolean }> = ({ x, y, w, h, at, out, title, icon, lines, color = C.cyan, speed = 9, typed = false }) => {
  const e = useEnter(at, out, { rise: 70, scale: 0.06 });
  if (!e.visible) return null;
  const k = Math.max(0, Math.floor((e.t - at) * speed));
  const ls = lines(k);
  const shown = typed ? ls.slice(0, Math.min(ls.length, k + 1)) : ls;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 20, overflow: 'hidden', background: 'rgba(5,9,18,.92)', border: `1px solid ${color}44`, boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.03), 0 0 40px ${color}18`, ...e.style }}>
      <div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        {[C.red, C.amber, C.green].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.8 }} />)}
        <Icon name={icon} size={22} color={color} style={{ marginLeft: 10 }} />
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 18, letterSpacing: '0.16em', color, textTransform: 'uppercase' }}>{title}</div>
      </div>
      <div style={{ padding: '18px 22px', fontFamily: fonts.mono, fontSize: 19, lineHeight: 1.6, color: '#a9bad6', whiteSpace: 'pre' }}>
        {shown.map((l, i) => <div key={i} style={{ opacity: i === shown.length - 1 ? 1 : 0.85, color: l.startsWith('!') ? C.red : l.startsWith('>') ? color : undefined }}>{l.replace(/^[!>]/, '')}</div>)}
      </div>
    </div>
  );
};

export const hexLines = (k: number, n = 14) => { const r = rng(k + 3); return Array.from({ length: n }, (_, j) => `${(0x1f00 + (j + k) * 16).toString(16)}  ${Array.from({ length: 8 }, () => Math.floor(r() * 256).toString(16).padStart(2, '0')).join(' ')}`); };

// icon chip that pops in (used for callouts on illustrations)
export const Callout: React.FC<{ x: number; y: number; at: number; out?: number; icon: string; text: string; color?: string; dir?: 'up' | 'down' }> = ({ x, y, at, out, icon, text, color = C.red, dir = 'up' }) => {
  const e = useEnter(at, out, { rise: dir === 'up' ? 30 : -30 });
  if (!e.visible) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 14, background: 'rgba(6,10,20,.9)', border: `2px solid ${color}`, boxShadow: `0 0 30px ${color}44`, fontFamily: fonts.body, fontWeight: 700, fontSize: 24, color: C.ink, whiteSpace: 'nowrap', ...e.style }}>
        <Icon name={icon} size={28} color={color} />{text}
      </div>
      <div style={{ width: 2, height: 60, margin: '0 auto', background: `linear-gradient(${color}, transparent)`, opacity: e.style.opacity as number }} />
    </div>
  );
};

// section chapter tag (top-left)
export const Chapter: React.FC<{ n: number; title: string; at: number; out: number; color?: string }> = ({ n, title, at, out, color = C.red }) => {
  const e = useEnter(at, out, { rise: -20 });
  if (!e.visible) return null;
  const line = ramp(e.t, at + 0.15, 0.8, EASE.out);
  return (
    <div style={{ position: 'absolute', left: 80, top: 60, ...e.style }}>
      <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#c9d3e6' }}><span style={{ color, fontFamily: fonts.mono }}>{String(n).padStart(2, '0')}</span><span style={{ opacity: 0.35, margin: '0 14px' }}>/</span>{title}</div>
      <div style={{ marginTop: 12, height: 2, width: 280 * line, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
};
