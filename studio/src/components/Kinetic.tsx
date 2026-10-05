// Kinetic typography: word-by-word reveals with AE-style easing.
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { fonts, C } from '../lib/theme';
import { EASE, ramp, springAt, rng, clamp } from '../lib/time';

type Anim = 'rise' | 'pop' | 'slam' | 'zoom' | 'type' | 'glitch' | 'blur';

export const Kinetic: React.FC<{
  text: string;          // *word* = accent; | = new line
  at: number;
  out?: number;
  anim?: Anim;
  x?: number; y?: number;
  size?: number;
  weight?: number;
  accent?: string;
  color?: string;
  align?: 'center' | 'left' | 'right';
  stagger?: number;
  font?: 'head' | 'body' | 'mono';
  upper?: boolean;
  tracking?: number;
  drift?: number;
}> = ({ text, at, out, anim = 'rise', x = 960, y = 540, size = 72, weight = 800, accent = C.red, color = C.ink, align = 'center', stagger = 0.06, font = 'head', upper = false, tracking = -0.01, drift = 0.025 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < at - 0.05 || (out != null && t > out + 0.6)) return null;
  const lines = text.split('|').map((l) => l.trim().split(/\s+/));
  // accents may span several words: "*every hacker*"
  const accentFlags: boolean[] = [];
  { let open = false; for (const l of lines) for (const w of l) { const starts = w.startsWith('*'), ends = /\*[.,!?…:]*$/.test(w); if (starts) open = true; accentFlags.push(open); if (ends) open = false; } }
  let idx = 0;
  const outU = out != null ? ramp(t, out, 0.35, EASE.in) : 0;
  const hold = out != null ? out - at : 4;
  const scale = 1 + drift * clamp((t - at) / Math.max(0.5, hold));
  const r = rng(Math.round(at * 997));
  const glitchOn = anim === 'glitch' && t - at < 0.7;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? -50 : align === 'right' ? -100 : 0}%, -50%) scale(${scale})`, transformOrigin: align === 'left' ? '0% 50%' : align === 'right' ? '100% 50%' : '50% 50%', textAlign: align, fontFamily: fonts[font], fontWeight: weight, fontSize: size, lineHeight: 1.08, letterSpacing: `${tracking}em`, color, textTransform: upper ? 'uppercase' : 'none', whiteSpace: 'nowrap', textShadow: '0 8px 40px rgba(0,0,0,.7)' }}>
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((wRaw, wi) => {
            const i = idx++;
            const acc = accentFlags[i];
            const w = wRaw.replace(/\*/g, '');
            const t0 = at + i * stagger;
            const u = ramp(t, t0, 0.7, EASE.out);
            const sp = springAt(frame, fps, t0, { damping: 11, stiffness: 160 });
            let tf = '', op = 1, blur = 0;
            if (anim === 'rise') { tf = `translateY(${(1 - u) * 105}%)`; }
            if (anim === 'pop') { tf = `scale(${0.4 + 0.6 * sp})`; op = clamp(sp * 1.6); blur = (1 - clamp(sp)) * 10; }
            if (anim === 'zoom') { tf = `scale(${2.4 - 1.4 * u})`; op = u; blur = (1 - u) * 16; }
            if (anim === 'blur') { tf = `translateY(${(1 - u) * 18}px)`; op = u; blur = (1 - u) * 14; }
            if (anim === 'slam') { const s = ramp(t, t0, 0.22, EASE.in); tf = `scale(${3 - 2 * s})`; op = s; }
            if (anim === 'type') { op = t >= at + i * 0.09 ? 1 : 0; }
            if (anim === 'glitch') { op = t >= t0 ? 1 : 0; if (glitchOn) tf = `translateX(${(r() - 0.5) * 30}px) skewX(${(r() - 0.5) * 14}deg)`; }
            // exit: rise up and fade
            if (outU > 0) { tf += ` translateY(${-outU * 60}%)`; op *= 1 - outU; }
            const acStyle: React.CSSProperties = acc ? { color: accent, textShadow: `0 0 28px ${accent}99, 0 0 70px ${accent}55` } : {};
            const gl: React.CSSProperties = glitchOn ? { textShadow: `${(r() - 0.5) * 16}px 0 rgba(255,46,77,.9), ${(r() - 0.5) * 16}px 0 rgba(51,225,255,.9)` } : {};
            return (
              <span key={wi} style={{ display: 'inline-block', overflow: anim === 'rise' ? 'hidden' : 'visible', verticalAlign: 'bottom', padding: '0.06em 0.02em 0.12em', margin: '-0.06em 0 -0.12em' }}>
                <span style={{ display: 'inline-block', transform: tf, opacity: op, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, ...acStyle, ...gl }}>{w}</span>
                {wi < words.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// small uppercase label
export const Label: React.FC<{ children: React.ReactNode; x: number; y: number; at: number; out?: number; color?: string; size?: number; align?: 'left' | 'center' }> = ({ children, x, y, at, out, color = C.dim, size = 22, align = 'left' }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const u = ramp(t, at, 0.6) * (out != null ? 1 - ramp(t, out, 0.3, EASE.in) : 1);
  if (u <= 0) return null;
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? '-50%' : '0'}, ${(1 - u) * 14}px)`, opacity: u, fontFamily: fonts.body, fontWeight: 700, fontSize: size, letterSpacing: '0.22em', textTransform: 'uppercase', color }}>{children}</div>;
};
