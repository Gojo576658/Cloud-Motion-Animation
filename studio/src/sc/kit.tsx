// "Spy Chip" kit: the black-grid stage and white/red language (re-exported from ../ai/kit), Vio as host on the
// left, plus this story's pieces: a generic hardware wallet (closed, or opened to show its board with the secure
// chip and the red implant), the 24-word recovery sheet, the sealed product box, the implant's mobile signal,
// a phone wallet app whose balance drains to zero, supply-chain nodes, an X-style post card and a sealed bottle.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { fonts } from '../tg/type';
import { useTF, Pop, Mono } from '../tg/kit';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import { Icon } from '../components/Icon';
import { A, Label } from '../ai/kit';
import { Vio, talkFrom, type VioPose } from '../vio/Vio';
import { TTL, C0 } from './ttime';
export { A, GridBg, Phone, Label, Panel, BigNum, Hacker } from '../ai/kit';
export { Wire, Subscribe, Browser } from '../fh/kit';

// ---------------------------------------------------------------- Vio, the host (left third, owner's rule)
export const Host: React.FC<{ pose?: VioPose; at?: number; decode?: number; x?: number; size?: number }> = ({ pose = 'idle', at, decode = 0, x = 400, size = 860 }) => {
  const { t } = useTF();
  return <Vio x={x} y={1080 + 0.15 * size} size={size} pose={pose} at={at} decode={decode} talk={pose === 'idle' ? talkFrom(TTL.words, t) : 0} seed={5} />;
};
export const beatOf = (t: number, cues: number[], lead = 0.15) => { let k = 0; cues.forEach((c, j) => { if (t >= C0(c) - lead) k = j; }); return k; };
export const CX = 1270; // centre of the content area (Vio holds the left third)

export const Chip: React.FC<{ x: number; y: number; at: number; icon?: string; red?: boolean; size?: number; children: React.ReactNode; solid?: boolean }> = ({ x, y, at, icon, red = false, size = 30, children, solid = false }) => (
  <Pop x={x} y={y} at={at}><Label color={red ? A.red : A.white} size={size} solid={solid}>{icon && <Icon name={icon} size={size * 1.1} color={solid ? (red ? A.white : '#111') : red ? A.red : A.white} />}{children}</Label></Pop>
);
export const Crossed: React.FC<{ x: number; y: number; at: number; icon: string; label: string; size?: number }> = ({ x, y, at, icon, label, size = 120 }) => {
  const { t } = useTF();
  const u = ramp(t, at + 0.35, 0.3, EASE.out);
  return (
    <Pop x={x} y={y} at={at}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: size * 1.4, height: size * 1.4, margin: '0 auto', borderRadius: '50%', background: A.panel, border: `3px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={size * 0.8} color={A.white} />
          <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 100 100"><line x1={18} y1={82} x2={18 + 64 * u} y2={82 - 64 * u} stroke={A.red} strokeWidth={7} strokeLinecap="round" /></svg>
        </div>
        <div style={{ marginTop: 14 }}><Mono size={22} color={A.white}>{label}</Mono></div>
      </div>
    </Pop>
  );
};
export const Tile: React.FC<{ x: number; y: number; at: number; icon: string; label: string; red?: boolean; size?: number }> = ({ x, y, at, icon, label, red = false, size = 160 }) => (
  <Pop x={x} y={y} at={at}><div style={{ textAlign: 'center' }}><div style={{ width: size, height: size, margin: '0 auto', borderRadius: size * 0.18, background: A.panel, border: `2px solid ${red ? A.red : A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: red ? '0 0 40px rgba(255,43,61,.35)' : undefined }}><Icon name={icon} size={size * 0.58} color={red ? A.red : A.white} /></div><div style={{ marginTop: 14, width: Math.max(size * 1.7, 300), marginLeft: '50%', transform: 'translateX(-50%)', fontFamily: fonts.mono, fontWeight: 700, fontSize: 21, letterSpacing: '0.1em', lineHeight: 1.35, color: red ? A.red : A.soft, whiteSpace: 'normal' }}>{label}</div></div></Pop>
);

// ---------------------------------------------------------------- the hardware wallet (generic, not a brand replica)
// open 0 = closed device with its screen; open 1 = top shell lifted away, showing the board: the secure chip
// (white) and, when implant > 0, the extra red component with its antenna.
export const Wallet: React.FC<{ x: number; y: number; w?: number; screen?: React.ReactNode; open?: number; implant?: number; pulse?: number; rot?: number; check?: 'none' | 'pass' }> = ({ x, y, w = 520, screen, open = 0, implant = 0, pulse = 0, rot = 0, check = 'none' }) => {
  const { t } = useTF();
  const h = w * 0.36, lift = open * h * 1.25;
  const glow = implant > 0.5 ? 0.35 + 0.25 * Math.sin(t * 6) : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(-50%,-50%) rotate(${rot}deg)` }}>
      {/* the board (visible when opened) */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: h * 0.22, background: '#16161c', border: `3px solid ${A.line}`, overflow: 'hidden', opacity: clamp(open * 3) }}>
        <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
          {[0.25, 0.5, 0.75].map((k) => <path key={k} d={`M ${w * 0.08} ${h * k} H ${w * 0.92}`} stroke="#2e2e38" strokeWidth={3} />)}
          {[0.2, 0.4, 0.6, 0.8].map((k) => <path key={k} d={`M ${w * k} ${h * 0.1} V ${h * 0.9}`} stroke="#25252e" strokeWidth={2} />)}
        </svg>
        <div style={{ position: 'absolute', left: w * 0.12, top: h * 0.22, width: w * 0.24, height: h * 0.56, borderRadius: 8, background: A.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(0,0,0,.5)' }}><div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.026, letterSpacing: '0.1em', color: '#111', textAlign: 'center', lineHeight: 1.3 }}>SECURE<br />CHIP</div></div>
        <div style={{ position: 'absolute', left: w * 0.44, top: h * 0.3, width: w * 0.2, height: h * 0.4, borderRadius: 6, background: '#2a2a33', border: '2px solid #3a3a44' }} />
        {implant > 0 && <div style={{ position: 'absolute', left: w * 0.72, top: h * 0.26, width: w * 0.16, height: h * 0.48, borderRadius: 6, background: A.red, transform: `scale(${0.6 + 0.4 * implant})`, opacity: implant, boxShadow: `0 0 ${30 + 30 * glow}px rgba(255,43,61,${0.5 + glow})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.024, color: A.white, letterSpacing: '0.08em', textAlign: 'center', lineHeight: 1.2 }}>LTE<br />eSIM</div></div>}
      </div>
      {/* the shell + screen */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-lift}px)`, borderRadius: h * 0.22, background: 'linear-gradient(180deg,#26262e,#121217)', border: '3px solid #3a3a44', boxShadow: `0 30px 70px rgba(0,0,0,.6)${pulse > 0 ? `, 0 0 ${60 * pulse}px rgba(255,43,61,.5)` : ''}` }}>
        <div style={{ position: 'absolute', left: w * 0.08, top: h * 0.2, width: w * 0.62, height: h * 0.6, borderRadius: h * 0.06, background: '#05060a', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', color: A.white, fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.04, textAlign: 'center' }}>{screen}</div>
        {[0, 1].map((i) => <div key={i} style={{ position: 'absolute', left: w * (0.78 + i * 0.1), top: h * 0.4, width: w * 0.06, height: w * 0.06, borderRadius: '50%', background: '#3a3a44', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.4)' }} />)}
      </div>
      {check === 'pass' && <Pop x={w * 0.5} y={-h * 0.55 - lift} at={0}><Label size={26}><Icon name="ph:seal-check-fill" size={30} color={A.white} /> GENUINE CHECK: PASSED</Label></Pop>}
    </div>
  );
};

// ---------------------------------------------------------------- the 24-word recovery sheet
const WORDS = ['river', 'candle', 'orbit', 'velvet', 'thunder', 'maple', 'pilot', 'harbor', 'echo', 'lantern', 'meadow', 'copper', 'saddle', 'glacier', 'violin', 'pepper', 'atlas', 'cactus', 'falcon', 'marble', 'quiver', 'ribbon', 'summit', 'walnut'];
export const SeedSheet: React.FC<{ x: number; y: number; at: number; w?: number; read?: number; red?: boolean; paper?: boolean }> = ({ x, y, at, w = 760, read = -1, red = false, paper = false }) => {
  const { t } = useTF();
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: 'translate(-50%,-50%)', padding: 26, borderRadius: 16, background: paper ? '#ecebe6' : A.panel, border: `2px solid ${red ? A.red : A.line}`, boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {WORDS.map((wd, i) => {
          const u = ramp(t, at + i * 0.045, 0.25, EASE.out), hit = read >= 0 && t > read + i * 0.06;
          return <div key={wd} style={{ display: 'flex', gap: 8, alignItems: 'baseline', padding: '7px 10px', borderRadius: 8, background: hit ? 'rgba(255,43,61,.18)' : paper ? 'transparent' : '#16161c', border: `1.5px solid ${hit ? A.red : paper ? '#c9c8c2' : A.line}`, opacity: u, transform: `translateY(${(1 - u) * 10}px)` }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 15, color: hit ? A.red : paper ? '#777' : A.dim }}>{i + 1}</span>
            <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: hit ? A.red : paper ? '#111' : A.white }}>{wd}</span>
          </div>;
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- sealed product box (lid lifts with `open`)
export const Box: React.FC<{ x: number; y: number; w?: number; open?: number; seal?: number; label?: string }> = ({ x, y, w = 460, open = 0, seal = 1, label = 'HARDWARE WALLET' }) => {
  const h = w * 0.62;
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.8, borderRadius: 10, background: 'linear-gradient(180deg,#1c1c22,#101014)', border: `3px solid ${A.line}`, boxShadow: '0 30px 80px rgba(0,0,0,.6)' }} />
      <div style={{ position: 'absolute', left: -6, right: -6, top: 0, height: h * 0.3, borderRadius: 10, background: '#24242c', border: `3px solid #3a3a44`, transform: `translateY(${-open * h * 0.6}px) rotate(${-open * 10}deg)`, transformOrigin: '0% 100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.04, letterSpacing: '0.18em', color: A.soft }}>{label}</div>
      </div>
      {seal > 0 && <div style={{ position: 'absolute', left: w * 0.38, top: h * 0.18, width: w * 0.24, height: h * 0.22, borderRadius: 6, background: A.white, opacity: seal * (1 - open), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-4deg)', fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.032, color: '#111', letterSpacing: '0.1em' }}>SEALED</div>}
    </div>
  );
};

// mobile signal: rings expanding from (x, y), plus a dashed path to a target
export const Signal: React.FC<{ x: number; y: number; on: number; size?: number }> = ({ x, y, on, size = 160 }) => {
  const { t } = useTF();
  if (on <= 0) return null;
  return <>{[0, 1, 2].map((i) => { const u = (t * 0.9 + i / 3) % 1; return <div key={i} style={{ position: 'absolute', left: x, top: y, width: size * u * 2, height: size * u * 2, borderRadius: '50%', border: `4px solid ${A.red}`, opacity: on * (1 - u), transform: 'translate(-50%,-50%)' }} />; })}</>;
};

// ---------------------------------------------------------------- phone wallet app (balance drains to zero)
export const Balance: React.FC<{ v: number; red?: boolean; label?: string }> = ({ v, red = false, label = 'MY WALLET' }) => (
  <AbsoluteFill style={{ background: '#0b0b0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
    <Mono size={16} color={A.dim}>{label}</Mono>
    <div style={{ ...fonts.H, fontWeight: 900, fontSize: 60, color: red ? A.red : A.white, letterSpacing: '-0.03em' }}>${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>{['ph:currency-btc-bold', 'ph:currency-eth-bold', 'ph:coins-bold'].map((ic) => <div key={ic} style={{ width: 54, height: 54, borderRadius: 14, background: '#1a1a20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={30} color={red ? A.red : A.white} /></div>)}</div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- supply chain node
export const Node: React.FC<{ x: number; y: number; at: number; icon: string; label: string; red?: boolean; dim?: number }> = ({ x, y, at, icon, label, red = false, dim = 0 }) => (
  <Pop x={x} y={y} at={at}><div style={{ textAlign: 'center', opacity: 1 - dim * 0.6 }}>
    <div style={{ width: 150, height: 150, margin: '0 auto', borderRadius: '50%', background: A.panel, border: `4px solid ${red ? A.red : A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: red ? '0 0 50px rgba(255,43,61,.4)' : undefined }}><Icon name={icon} size={80} color={red ? A.red : A.white} /></div>
    <div style={{ marginTop: 12 }}><Mono size={24} color={red ? A.red : A.soft}>{label}</Mono></div>
  </div></Pop>
);

// ---------------------------------------------------------------- X-style post card (generic, no logo)
export const Post: React.FC<{ x: number; y: number; at: number; name: string; handle: string; initials: string; text: string; w?: number; red?: boolean }> = ({ x, y, at, name, handle, initials, text, w = 760, red = false }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.05) return null;
  const s = springAt(f, fps, at, { damping: 15, stiffness: 180 });
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-50%) translateY(${(1 - s) * 40}px) scale(${0.94 + 0.06 * s})`, opacity: clamp(s * 1.5), padding: '26px 30px', borderRadius: 20, background: A.panel, border: `2px solid ${red ? A.red : A.line}`, boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 62, height: 62, borderRadius: '50%', background: red ? A.red : A.white, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 24, color: red ? A.white : '#111' }}>{initials}</div>
        <div><div style={{ ...fonts.H, fontWeight: 800, fontSize: 28, color: A.white }}>{name}</div><div style={{ fontFamily: fonts.mono, fontSize: 18, color: A.dim }}>{handle}</div></div>
        <div style={{ marginLeft: 'auto', fontFamily: fonts.mono, fontSize: 18, color: A.dim, letterSpacing: '0.1em' }}>POST ON X</div>
      </div>
      <div style={{ marginTop: 18, ...fonts.H, fontWeight: 700, fontSize: 36, lineHeight: 1.25, color: A.white }}>{text}</div>
    </div>
  );
};

// ---------------------------------------------------------------- sealed bottle (cap opens, contents turn red, cap closes)
export const Bottle: React.FC<{ x: number; y: number; open: number; bad: number; h?: number }> = ({ x, y, open, bad, h = 420 }) => {
  const w = h * 0.36;
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h }}>
      <div style={{ position: 'absolute', left: w * 0.32, width: w * 0.36, top: -open * 70, height: h * 0.1, borderRadius: 8, background: A.white, transform: `rotate(${open * 25}deg)`, transformOrigin: '0% 100%' }} />
      <div style={{ position: 'absolute', left: w * 0.3, width: w * 0.4, top: h * 0.1, height: h * 0.12, background: 'rgba(244,244,246,.18)', border: `3px solid ${A.soft}`, borderBottom: 'none' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.2, bottom: 0, borderRadius: w * 0.22, border: `4px solid ${A.soft}`, background: 'rgba(244,244,246,.06)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '78%', background: `rgba(${lerp(200, 255, bad)},${lerp(215, 43, bad)},${lerp(235, 61, bad)},${0.25 + 0.3 * bad})` }} />
      </div>
    </div>
  );
};
export { lerp, AbsoluteFill };
