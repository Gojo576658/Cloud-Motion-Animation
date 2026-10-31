// "Teen Admin" kit — the new, livelier format (owner's notes, Oct 31): Vio moves between three placements
// (left talking shot, small bottom-right corner, big close-up) or leaves the frame for full-screen scenes;
// real-life stock clips (Pexels, free licence) as b-roll and as meme cutaways with a caption, a zoom punch and a
// sound; big kinetic text only on key beats. Story props: the kid at his desk, Antares (the AI helper), the
// Titan dashboard, error pop-ups, the badge door / hotel keycard corridor, the big row counter, the redacted post.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { fonts } from '../tg/type';
import { useTF, Pop, Mono } from '../tg/kit';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import { Icon } from '../components/Icon';
import { A, Label } from '../ai/kit';
import { Vio, talkFrom } from '../vio/Vio';
import { TTL, C0 } from './ttime';
export { A, GridBg, Phone, Label, Panel, BigNum, Helper } from '../ai/kit';
export { Wire, Subscribe, Browser } from '../fh/kit';
export { Chip, Crossed, Tile, Post } from '../sc/kit';

export const CX = 1270;
export const beatOf = (t: number, cues: number[], lead = 0.15) => { let k = 0; cues.forEach((c, j) => { if (t >= C0(c) - lead) k = j; }); return k; };

// ---------------------------------------------------------------- Vio, three placements (never flipped)
export type Place = 'left' | 'corner' | 'close' | 'none';
export const Host: React.FC<{ place: Place; since?: number; decode?: number }> = ({ place, since = 0, decode = 0 }) => {
  const { t } = useTF();
  if (place === 'none') return null;
  const talk = talkFrom(TTL.words, t);
  const s = ramp(t, since, 0.35, EASE.out);
  if (place === 'close') {
    // big close-up: face centred in the left half, body far below the frame
    return <div style={{ position: 'absolute', inset: 0, transform: `scale(${0.96 + 0.04 * s})`, opacity: s }}><Vio x={560} y={2050} size={2000} talk={talk} decode={decode} seed={5} /></div>;
  }
  if (place === 'corner') {
    return <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - s) * 80}px)`, opacity: s }}><Vio x={1730} y={1080 + 0.15 * 540} size={540} talk={talk} decode={decode} seed={5} /></div>;
  }
  return <div style={{ position: 'absolute', inset: 0, opacity: s }}><Vio x={400} y={1080 + 0.15 * 860} size={860} talk={talk} decode={decode} seed={5} /></div>;
};

// ---------------------------------------------------------------- real-life footage (Pexels), graded to the channel look
export const Stock: React.FC<{ name: string; from?: number; at: number; tint?: number; dark?: number; push?: number }> = ({ name, from = 0, at, tint = 0, dark = 0.25, push = 0.08 }) => {
  const { t, fps } = useTF();
  const u = clamp((t - at) / 8);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${1.04 + push * u})` }}>
        <OffthreadVideo src={staticFile(`stock/${name}.mp4`)} startFrom={Math.round(from * fps)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />
      {tint > 0 && <AbsoluteFill style={{ background: `rgba(255,43,61,${0.25 * tint})`, mixBlendMode: 'multiply' }} />}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,.7) 100%)' }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- meme cutaway (overlay, a couple of seconds)
export type Meme = { at: number; dur: number; clip: string; from?: number; top: string; bottom?: string };
const memeText = (size: number): React.CSSProperties => ({ ...fonts.H, fontWeight: 900, fontSize: size, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.01em', lineHeight: 1, textAlign: 'center', WebkitTextStroke: `${size * 0.06}px #000`, paintOrder: 'stroke fill', textShadow: '0 6px 0 #000' });
export const MemeLayer: React.FC<{ memes: Meme[] }> = ({ memes }) => {
  const { t } = useTF();
  const m = memes.find((x) => t >= x.at && t < x.at + x.dur);
  if (!m) return null;
  const k = t - m.at;
  const punch = 1 + 0.12 * (1 - ramp(k, 0, 0.35, EASE.out)) + 0.05 * ramp(k, 0.35, m.dur, EASE.inOut);
  const shake = k < 0.3 ? Math.sin(k * 90) * 6 * (1 - k / 0.3) : 0;
  const flash = 1 - ramp(k, 0, 0.12);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${-shake * 0.6}px)` }}>
      <AbsoluteFill style={{ transform: `scale(${punch})` }}><Stock name={m.clip} from={m.from ?? 0} at={m.at} dark={0.05} push={0} /></AbsoluteFill>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 60, ...memeText(84) }}>{m.top}</div>
      {m.bottom && <div style={{ position: 'absolute', left: 80, right: 80, top: 800, ...memeText(64) }}>{m.bottom}</div>}
      <AbsoluteFill style={{ background: '#fff', opacity: flash * 0.7 }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- big kinetic headline (positioned anywhere)
export const Shout: React.FC<{ x: number; y: number; at: number; text: string; size?: number; red?: boolean; align?: 'center' | 'left'; rot?: number }> = ({ x, y, at, text, size = 140, red = false, align = 'center', rot = 0 }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.02) return null;
  const s = springAt(f, fps, at, { damping: 11, stiffness: 220 });
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? '-50%' : '0'},-50%) scale(${0.6 + 0.4 * s}) rotate(${rot}deg)`, opacity: clamp(s * 2), transformOrigin: align === 'center' ? '50% 50%' : '0% 50%', ...fonts.H, fontWeight: 900, fontSize: size, lineHeight: 0.95, letterSpacing: '-0.04em', color: red ? A.red : A.white, textShadow: red ? '0 0 50px rgba(255,43,61,.45)' : '0 12px 40px rgba(0,0,0,.6)', whiteSpace: 'pre-line', textAlign: align }}>{text}</div>;
};

// ---------------------------------------------------------------- the row counter (17,333,335,124,315)
export const RowCount: React.FC<{ at: number; d?: number; size?: number; to?: number; red?: boolean }> = ({ at, d = 2.2, size = 150, to = 17333335124315, red = true }) => {
  const { t } = useTF();
  const u = ramp(t, at, d, EASE.out);
  const v = Math.round(to * u);
  return <div style={{ ...fonts.H, fontWeight: 900, fontSize: size, letterSpacing: '-0.03em', color: red ? A.red : A.white, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textShadow: '0 0 40px rgba(255,43,61,.35)' }}>{v.toLocaleString('en-US')}</div>;
};

// ---------------------------------------------------------------- the kid at his desk, from behind (no face: we don't know it)
export const Kid: React.FC<{ x: number; y: number; size?: number; glow?: number; type?: boolean; screen?: React.ReactNode }> = ({ x, y, size = 620, glow = 1, type = false, screen }) => {
  const { t } = useTF();
  const w = size * 1.5, h = size;
  const tap = type ? Math.sin(t * 22) * 4 : 0;
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h }}>
      <div style={{ position: 'absolute', left: w * 0.2, top: 0, width: w * 0.6, height: h * 0.52, borderRadius: 14, background: '#0b0b10', border: '6px solid #24242c', boxShadow: `0 0 ${160 * glow}px rgba(200,215,255,${0.45 * glow})`, overflow: 'hidden' }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(200,215,255,${0.38 * glow}), rgba(200,215,255,${0.16 * glow}))` }} />
        {screen}
      </div>
      <div style={{ position: 'absolute', left: w * 0.46, top: h * 0.52, width: w * 0.08, height: h * 0.1, background: '#24242c' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.62, height: h * 0.06, background: '#1a1a20', borderRadius: 6 }} />
      <svg viewBox="0 0 300 260" width={w * 0.42} height={h * 0.55} style={{ position: 'absolute', left: w * 0.29, top: h * 0.46, overflow: 'visible' }}>
        <path d="M30 260 Q34 150 150 140 Q266 150 270 260 Z" fill="#2a2a33" />
        <path d="M70 150 Q60 60 150 50 Q240 60 230 150 Q190 175 150 175 Q110 175 70 150 Z" fill="#33333d" />
        <path d="M98 58 Q150 10 202 58" stroke="#2c2c34" strokeWidth="14" fill="none" />
        <rect x="84" y="76" width="22" height="40" rx="8" fill="#2c2c34" /><rect x="194" y="76" width="22" height="40" rx="8" fill="#2c2c34" />
        <path d={`M40 ${235 + tap} Q70 ${205 + tap} 110 ${215 - tap}`} stroke="#141418" strokeWidth="28" strokeLinecap="round" fill="none" />
        <path d={`M260 ${235 - tap} Q230 ${205 - tap} 190 ${215 + tap}`} stroke="#141418" strokeWidth="28" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- error pop-ups stacking up
export const Errors: React.FC<{ at: number; n?: number; every?: number; x?: number; y?: number }> = ({ at, n = 9, every = 0.35, x = 1240, y = 430 }) => {
  const { t } = useTF();
  return <>{Array.from({ length: n }, (_, i) => {
    const on = at + i * every; if (t < on) return null;
    const u = ramp(t, on, 0.18, EASE.out);
    return <div key={i} style={{ position: 'absolute', left: x - 260 + ((i * 97) % 180) - 90 + i * 14, top: y - 170 + ((i * 53) % 140) + i * 12, width: 520, borderRadius: 14, background: '#16161c', border: `3px solid ${A.red}`, boxShadow: '0 20px 50px rgba(0,0,0,.6)', transform: `scale(${0.7 + 0.3 * u})`, opacity: u }}>
      <div style={{ height: 40, background: A.red, borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}><Icon name="ph:x-circle-fill" size={24} color={A.white} /><span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 16, color: A.white, letterSpacing: '0.1em' }}>ERROR</span></div>
      <div style={{ padding: '18px 20px', ...fonts.H, fontWeight: 800, fontSize: 32, color: A.white }}>{['ACCESS DENIED', 'UNAUTHORIZED', 'INVALID TOKEN', 'ACCESS DENIED', 'REQUEST FAILED'][i % 5]}</div>
    </div>;
  })}</>;
};

// ---------------------------------------------------------------- Titan-style analytics dashboard (generic, not a replica)
export const Dashboard: React.FC<{ x: number; y: number; w?: number; at: number; admin?: boolean }> = ({ x, y, w = 1040, at, admin = false }) => {
  const { t, f, fps } = useTF();
  const s = springAt(f, fps, at, { damping: 15, stiffness: 170 });
  const h = w * 0.58;
  const bars = [0.4, 0.7, 0.55, 0.9, 0.62, 0.8, 0.48, 0.74];
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * s})`, opacity: clamp(s * 1.5), borderRadius: 18, background: A.panel, border: `2px solid ${admin ? A.red : A.line}`, boxShadow: '0 40px 100px rgba(0,0,0,.65)', overflow: 'hidden' }}>
      <div style={{ height: 58, background: '#16161c', display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14, borderBottom: `2px solid ${A.line}` }}>
        <Icon name="ph:chart-bar-fill" size={28} color={A.white} /><span style={{ ...fonts.H, fontWeight: 800, fontSize: 26, color: A.white }}>Titan</span><Mono size={18} color={A.dim}>INTERNAL ANALYTICS</Mono>
        <div style={{ marginLeft: 'auto' }}>{admin ? <Label color={A.red} size={20} solid>ROLE: ADMIN</Label> : <Label size={20}>EMPLOYEES ONLY</Label>}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, padding: 22, height: h - 58 - 44 }}>
        <div style={{ borderRadius: 12, background: '#101015', border: `2px solid ${A.line}`, display: 'flex', alignItems: 'flex-end', gap: 14, padding: 20 }}>
          {bars.map((b, i) => <div key={i} style={{ flex: 1, height: `${100 * b * ramp(t, at + 0.3 + i * 0.06, 0.5, EASE.out)}%`, borderRadius: 6, background: i === 3 ? A.red : A.soft }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 18 }}>
          {[0, 1].map((k) => <div key={k} style={{ borderRadius: 12, background: '#101015', border: `2px solid ${A.line}`, padding: 16 }}>
            <svg viewBox="0 0 200 80" width="100%" height="100%" preserveAspectRatio="none"><polyline points={Array.from({ length: 12 }, (_, i) => `${i * 18},${40 + Math.sin(i * 1.3 + k) * 22 + k * 6}`).join(' ')} fill="none" stroke={k ? A.red : A.white} strokeWidth={3} /></svg>
          </div>)}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- doors: a badge reader and a hotel corridor where any key opens any room
export const Doors: React.FC<{ at: number; open: number; n?: number; x?: number; y?: number }> = ({ at, open, n = 5, x = 1240, y = 560 }) => {
  const { t } = useTF();
  return <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', display: 'flex', gap: 34 }}>
    {Array.from({ length: n }, (_, i) => {
      const o = ramp(t, open + i * 0.18, 0.5, EASE.out);
      return <div key={i} style={{ position: 'relative', width: 150, height: 300, opacity: ramp(t, at + i * 0.08, 0.3) }}>
        <div style={{ position: 'absolute', inset: 0, background: '#050507', border: `4px solid ${A.line}`, borderRadius: 6 }}>{o > 0.3 && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,43,61,.35), transparent)' }} />}</div>
        <div style={{ position: 'absolute', inset: 0, background: '#1d1d24', border: `4px solid #3a3a44`, borderRadius: 6, transformOrigin: '0% 50%', transform: `perspective(600px) rotateY(${-70 * o}deg)` }}>
          <div style={{ position: 'absolute', right: 14, top: 130, width: 30, height: 46, borderRadius: 6, background: '#0b0b10', border: '2px solid #3a3a44', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: o > 0.05 ? A.white : A.red }} /></div>
        </div>
      </div>;
    })}
  </div>;
};

// ---------------------------------------------------------------- a blog post getting cut (redaction bars sweep over lines)
export const Redacted: React.FC<{ x: number; y: number; at: number; cut: number }> = ({ x, y, at, cut }) => {
  const { t, f, fps } = useTF();
  const s = springAt(f, fps, at, { damping: 15, stiffness: 170 });
  const lines = [1, 0.92, 0.97, 0.7, 1, 0.85, 0.95, 0.6, 0.9];
  const cutL = [1, 3, 4, 6, 7];
  return <div style={{ position: 'absolute', left: x, top: y, width: 760, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * s})`, opacity: clamp(s * 1.5), padding: '34px 40px', borderRadius: 16, background: '#ecebe6', boxShadow: '0 40px 90px rgba(0,0,0,.6)' }}>
    <div style={{ fontFamily: fonts.mono, fontSize: 16, color: '#777', letterSpacing: '0.12em' }}>FAAV'S BLOG POST</div>
    <div style={{ ...fonts.H, fontWeight: 900, fontSize: 40, color: '#111', marginTop: 8, lineHeight: 1.1 }}>How I could've accessed 17 trillion records</div>
    <div style={{ marginTop: 20 }}>{lines.map((l, i) => { const k = cutL.indexOf(i); const c = k >= 0 ? ramp(t, cut + k * 0.25, 0.3, EASE.out) : 0; return <div key={i} style={{ position: 'relative', height: 14, width: `${l * 100}%`, background: '#bdbcb6', borderRadius: 4, marginBottom: 14 }}>{c > 0 && <div style={{ position: 'absolute', left: 0, top: -4, bottom: -4, width: `${c * 100}%`, background: '#111', borderRadius: 3 }} />}</div>; })}</div>
  </div>;
};
export { lerp, AbsoluteFill };
