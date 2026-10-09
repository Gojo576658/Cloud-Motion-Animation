// Scene 4 · Plot twist — the spin card, Riot's anti-cheat lead doubts the story (0 results,
// tumbleweed), Leo vs Riot on a wobbling scale, one part ≠ whole PC, two doors + Chip's shrug,
// what Riot did confirm (max 4 months, only that game), and Chip's prison cell AUG → DEC.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pill, Flash } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng, track } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, P, PE, S0, S1 } from './ctime';
import { Chip, Leo } from './chars';
import { Cell, Stamp, Burst, Bubble } from './fx';

const A = S0(4), Z = S1(4);
const tTwist = P(31, 'plot twist');
const tKos = C0(32), tName = P(32, 'Phillip'), tAddUp = P(32, "don't add up"), tCouldnt = P(32, "couldn't find"), tMatches = P(32, "matches Leo's"), tCalled = P(32, 'called the whole'), tUnlikely = P(32, 'unlikely');
const tLeo = C0(33), tBoard = P(33, 'motherboard'), tSSD = P(33, 'SSD'), tNo = P(33, 'Riot says no'), tOnePart = P(33, 'When one part'), tBlack = P(33, "doesn't blacklist");
const tWho = C0(34), tTruth = P(34, 'truth'), tHonest = P(34, 'Honestly'), tYet = PE(34, 'know yet');
const tConfirm = C0(35), tTwoThings = P(35, 'two things'), tOne = P(35, 'One,'), tFour = P(35, 'four months'), tTwo = P(35, 'Two,'), tOnly = P(35, 'only apply'), tWhere = P(35, 'where the cheating');
const tCell = C0(36), tAug = P(36, 'August'), tSentence = P(36, 'his sentence'), tMiddle = P(36, 'middle of'), tDec = P(36, 'December');

export const s4NoCaptions: [number, number][] = [[A - 0.3, tKos - 0.3]];
const W = { twist: [A - 0.5, tKos - 0.25], quote: [tKos - 0.25, tLeo - 0.25], scale: [tLeo - 0.25, tWho - 0.25], doors: [tWho - 0.25, tConfirm - 0.2], confirm: [tConfirm - 0.2, tCell - 0.2], cell: [tCell - 0.2, Z + 0.5] } as const;
const inWin = (t: number, w: readonly [number, number]) => t >= w[0] && t < w[1];
const FLIPS = [0, 1, 2, 3].map((k) => lerp(tSentence - 0.1, tDec - 0.15, k / 3));
const MONTHS = ['AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const s4Sfx: SfxEvent[] = [
  { t: A - 0.05, name: 'spinWhistle', vol: 0.5, note: 'plot twist spin' }, { t: tTwist - 0.05, name: 'impactZoom', vol: 0.55 }, { t: tTwist, name: 'glitch', vol: 0.35 }, { t: tTwist + 0.1, name: 'gasp', vol: 0.4 },
  { t: tKos - 0.2, name: 'whooshQuick', vol: 0.35 }, { t: tName - 0.05, name: 'popUi', vol: 0.4, note: 'name plate' }, { t: tAddUp - 0.05, name: 'popup', vol: 0.4, note: 'quote' },
  { t: tCouldnt - 0.25, name: 'typing', vol: 0.4, dur: 1.2, note: 'search types' }, { t: tMatches + 0.25, name: 'negGuitar', vol: 0.45, note: '0 results' },
  { t: tMatches + 0.6, name: 'toyWhistle', vol: 0.25, note: 'tumbleweed' }, { t: tUnlikely - 0.03, name: 'stomp', vol: 0.5, note: 'PRETTY UNLIKELY' }, { t: tUnlikely + 0.05, name: 'sillyPop', vol: 0.3 },
  { t: tLeo - 0.2, name: 'swoosh', vol: 0.35, note: 'scale' }, { t: tBoard - 0.03, name: 'boingMetal', vol: 0.45, note: 'tips left' }, { t: tSSD - 0.03, name: 'boingMetal', vol: 0.4 },
  { t: tNo - 0.05, name: 'clownHorn', vol: 0.35, note: 'Riot says no' }, { t: tNo + 0.05, name: 'boingMetal', vol: 0.5, note: 'tips right' },
  ...[0, 1, 2, 3].map((k) => ({ t: tOnePart - 0.2 + k * 0.09, name: 'popUi' as const, vol: 0.3 })), { t: tOnePart + 0.3, name: 'alarm', vol: 0.3, dur: 0.6, note: 'CPU match' },
  ...[1, 2, 3].map((k) => ({ t: tBlack + 0.15 + k * 0.2, name: 'confirm' as const, vol: 0.3, note: 'others fine' })),
  { t: tWho - 0.2, name: 'creakyDoor', vol: 0.4, note: 'two doors' }, { t: tWho + 0.3, name: 'tick', vol: 0.4 }, { t: tTruth, name: 'tick', vol: 0.4 },
  { t: tHonest - 0.05, name: 'crickets', vol: 0.35, dur: 1.0, note: 'shrug' }, { t: tYet + 0.08, name: 'rimshot', vol: 0.55 },
  { t: tConfirm - 0.15, name: 'whooshQuick', vol: 0.35 }, { t: tTwoThings - 0.05, name: 'drumRoll', vol: 0.3, dur: 1.0 }, { t: tOne - 0.05, name: 'popUi', vol: 0.4 },
  { t: tFour + 0.25, name: 'stomp', vol: 0.55, note: 'MAX 4 MONTHS' }, { t: tTwo - 0.05, name: 'popUi', vol: 0.4 }, { t: tOnly - 0.03, name: 'stomp', vol: 0.55, note: 'ONLY THAT GAME' },
  { t: tWhere + 0.2, name: 'success', vol: 0.45, note: 'other games fine' },
  { t: tCell - 0.1, name: 'jailLock', vol: 0.6, note: 'cell door' }, { t: tAug - 0.05, name: 'marker', vol: 0.4, note: 'chalk tally' }, { t: tAug + 0.6, name: 'marker', vol: 0.3 },
  ...FLIPS.map((x) => ({ t: x, name: 'pageTurn' as const, vol: 0.4, note: 'calendar flip' })), { t: tDec + 0.15, name: 'sparkle', vol: 0.5, note: 'December!' },
];

// ---- pieces
const Card: React.FC<{ x: number; y: number; w: number; at: number; children: React.ReactNode; rot?: number; border?: string; bg?: string }> = ({ x, y, w, at, children, rot = 0, border = 'rgba(255,255,255,.12)', bg = 'linear-gradient(160deg,#18213a,#0e1426)' }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = springAt(f, fps, at, { damping: 12, stiffness: 180 });
  if (f / fps < at - 0.02) return null;
  return <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-50%) translateY(${(1 - s) * 60}px) scale(${0.85 + 0.15 * s}) rotate(${rot}deg)`, opacity: clamp(s * 1.6), padding: 30, borderRadius: 26, background: bg, border: `3px solid ${border}`, boxShadow: '0 30px 80px rgba(0,0,0,.5)', fontFamily: fonts.head, color: C.ink, textAlign: 'center' }}>{children}</div>;
};
const Tumbleweed: React.FC<{ at: number; y: number }> = ({ at, y }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const u = (t - at) / 3.2;
  if (u < 0 || u > 1) return null;
  const x = lerp(2050, -150, u), hop = Math.abs(Math.sin(u * Math.PI * 5)) * 50;
  return (
    <svg style={{ position: 'absolute', left: x - 60, top: y - 60 - hop, transform: `rotate(${-u * 900}deg)` }} width="120" height="120" viewBox="0 0 120 120">
      {[0, 1, 2, 3, 4, 5].map((k) => <ellipse key={k} cx="60" cy="60" rx={50 - k * 4} ry={30 + k * 3} fill="none" stroke={k % 2 ? '#a07a46' : '#c79a5a'} strokeWidth="4" transform={`rotate(${k * 30} 60 60)`} />)}
    </svg>
  );
};
const Door: React.FC<{ x: number; label: string; icon: React.ReactNode; color: string; at: number; open: number }> = ({ x, label, icon, color, at, open }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = springAt(f, fps, at, { damping: 13, stiffness: 160 });
  return (
    <div style={{ position: 'absolute', left: x - 170, top: 250, width: 340, height: 600, transform: `translateY(${(1 - s) * 700}px)` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '24px 24px 0 0', background: '#05070d', boxShadow: `0 0 0 12px #2a2f3d, 0 0 70px ${color}44` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '24px 24px 0 0', background: `radial-gradient(circle at 50% 40%, ${color}55, transparent 70%)`, opacity: open }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '24px 24px 0 0', background: 'linear-gradient(160deg,#3b4256,#232838)', transformOrigin: '0 50%', transform: `perspective(900px) rotateY(${-open * 55}deg)`, boxShadow: 'inset 0 0 0 8px rgba(0,0,0,.25)' }}>
        <div style={{ position: 'absolute', right: 34, top: 300, width: 26, height: 26, borderRadius: '50%', background: '#d8b45a' }} />
        <div style={{ position: 'absolute', left: 40, right: 40, top: 60, height: 170, borderRadius: 12, border: '5px solid rgba(0,0,0,.25)' }} />
        <div style={{ position: 'absolute', left: 40, right: 40, top: 380, height: 170, borderRadius: 12, border: '5px solid rgba(0,0,0,.25)' }} />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: -70, transform: 'translateX(-50%)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 26px', borderRadius: 14, background: color, color: '#0b0d14', fontFamily: fonts.head, fontWeight: 900, fontSize: 40, boxShadow: `0 0 40px ${color}88` }}>{icon}{label}</div>
    </div>
  );
};
const Tile: React.FC<{ x: number; y: number; at: number; icon: string; label: string; state: 'none' | 'bad' | 'ok'; stateAt: number; w?: number; h?: number }> = ({ x, y, at, icon, label, state, stateAt, w = 300, h = 300 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const s = springAt(f, fps, at, { damping: 12, stiffness: 200 });
  const on = state !== 'none' && t > stateAt;
  const p = on ? springAt(f, fps, stateAt, { damping: 9, stiffness: 260 }) : 0;
  const col = state === 'bad' && on ? C.red : state === 'ok' && on ? C.green : 'rgba(255,255,255,.14)';
  const shake = state === 'bad' && on && t < stateAt + 0.5 ? Math.sin(t * 70) * 8 * (1 - (t - stateAt) / 0.5) : 0;
  if (t < at - 0.02) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(-50%,-50%) translateX(${shake}px) translateY(${(1 - s) * 80}px) scale(${0.8 + 0.2 * s})`, opacity: clamp(s * 1.6), borderRadius: 26, background: 'linear-gradient(160deg,#1a2238,#0e1426)', border: `5px solid ${col}`, boxShadow: on ? `0 0 50px ${col}66` : '0 20px 50px rgba(0,0,0,.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Icon name={icon} size={h * 0.4} color={on ? col : C.ink} />
      <div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 30, color: C.ink, whiteSpace: 'nowrap' }}>{label}</div>
      {on && <div style={{ position: 'absolute', right: -22, top: -22, width: 72, height: 72, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, boxShadow: '0 8px 20px rgba(0,0,0,.4)' }}><Icon name={state === 'bad' ? 'ph:x-bold' : 'ph:check-bold'} size={44} color="#0b0d14" /></div>}
    </div>
  );
};

export const S4Twist: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const r = rng(Math.round(t * 30));

  // ---------------------------------------------------------------- PLOT TWIST spin card
  if (inWin(t, W.twist)) {
    const spin = ramp(t, A - 0.3, 0.9, EASE.out);
    const g = t > tTwist - 0.05 && t < tTwist + 0.35;
    const zoom = 1 + ramp(t, tTwist - 0.05, 0.2, EASE.out) * 0.12 - ramp(t, tTwist + 0.15, 0.6, EASE.inOut) * 0.08;
    return (
      <AbsoluteFill style={{ background: '#0b0d14', overflow: 'hidden' }}>
        <AbsoluteFill style={{ transform: `rotate(${t * 40}deg) scale(2.2)`, background: `repeating-conic-gradient(from 0deg at 50% 50%, #ffd23a 0 10deg, #ff9f1c 10deg 20deg)`, opacity: 0.9 }} />
        <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, transparent 25%, rgba(10,8,4,.75) 75%)' }} />
        <div style={{ position: 'absolute', left: 960, top: 470, transform: `translate(-50%,-50%) rotate(${(1 - spin) * 720 - 6}deg) scale(${spin * zoom})` }}>
          <div style={{ position: 'relative', padding: '40px 90px', background: '#0b0d14', border: '12px solid #fff', borderRadius: 30, boxShadow: '0 40px 100px rgba(0,0,0,.6)', fontFamily: fonts.head, fontWeight: 900, fontSize: 190, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
            {g && <span style={{ position: 'absolute', left: 90 + (r() - 0.5) * 30, top: 40, color: C.red, opacity: 0.8, mixBlendMode: 'screen' }}>PLOT TWIST</span>}
            {g && <span style={{ position: 'absolute', left: 90 + (r() - 0.5) * 30, top: 40, color: C.cyan, opacity: 0.8, mixBlendMode: 'screen' }}>PLOT TWIST</span>}
            <span style={{ position: 'relative' }}>PLOT TWIST</span>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - ramp(t, tTwist, 0.4, EASE.back)) * 500}px)` }}><Leo x={300} y={1180} size={480} mood="shock" seed={41} /></div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - ramp(t, tTwist + 0.12, 0.4, EASE.back)) * 500}px)` }}><Chip x={1620} y={1000} size={300} mood="shock" seed={42} tilt={-6} /></div>
        <Flash at={tTwist - 0.04} d={0.3} max={0.6} />
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- Riot's anti-cheat lead + 0 results
  if (inWin(t, W.quote)) {
    const q = 'Leo\'s support ticket';
    const typed = Math.floor(clamp((t - (tCouldnt - 0.2)) / 1.0) * q.length);
    const results = t > tMatches + 0.25;
    return (
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 30% 30%, #2a1424, #0c0a14 70%)' }}>
        <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)', backgroundSize: '80px 80px' }} />
        {/* name plate */}
        <Card x={520} y={330} w={720} at={tKos - 0.1} border={`${C.red}88`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, textAlign: 'left' }}>
            <div style={{ width: 150, height: 150, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #ff6b81, ${C.red} 60%, #8a1022)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 50px ${C.red}66`, flexShrink: 0 }}><Icon name="ph:shield-check-fill" size={90} color="#fff" /></div>
            <div>
              <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: C.redSoft, letterSpacing: '0.12em' }}>RIOT GAMES</div>
              <div style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.05, opacity: ramp(t, tName - 0.05, 0.3) }}>PHILLIP KOSKINAS</div>
              <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: C.dim, marginTop: 6 }}>Head of Anti-Cheat</div>
            </div>
          </div>
        </Card>
        {/* the quote */}
        {t > tAddUp - 0.1 && <Card x={520} y={660} w={720} at={tAddUp - 0.08} rot={-1.5} bg="#fffbea" border="#fffbea">
          <div style={{ position: 'absolute', left: 20, top: -40, fontSize: 160, lineHeight: 1, color: C.red, fontWeight: 900 }}>“</div>
          <div style={{ fontWeight: 900, fontSize: 54, lineHeight: 1.12, color: '#1a1424', padding: '10px 20px' }}>Parts of this story<br />don't add up.</div>
        </Card>}
        {t > tUnlikely - 0.05 && <Stamp x={560} y={800} at={tUnlikely - 0.03} text="PRETTY UNLIKELY" size={60} rot={-7} />}
        {/* search panel */}
        {t > tCouldnt - 0.35 && <Card x={1400} y={420} w={760} at={tCouldnt - 0.35} border="rgba(51,225,255,.35)">
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: C.cyan, textAlign: 'left', letterSpacing: '0.1em', marginBottom: 16 }}>SUPPORT TICKETS · SEARCH</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px', borderRadius: 16, background: '#070b16', border: '3px solid rgba(255,255,255,.12)', textAlign: 'left' }}>
            <Icon name="ph:magnifying-glass-bold" size={44} color={C.dim} />
            <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 40 }}>{q.slice(0, typed)}<span style={{ opacity: Math.sin(t * 12) > 0 ? 1 : 0, color: C.cyan }}>|</span></span>
          </div>
          <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {results ? <div style={{ transform: `scale(${springAt(f, fps, tMatches + 0.25, { damping: 9, stiffness: 240 })})` }}>
              <div style={{ fontWeight: 900, fontSize: 120, color: C.red, lineHeight: 1 }}>0</div>
              <div style={{ fontWeight: 800, fontSize: 40, color: C.ink }}>results found</div>
            </div> : <div style={{ display: 'flex', gap: 14 }}>{[0, 1, 2].map((k) => <div key={k} style={{ width: 18, height: 18, borderRadius: '50%', background: C.dim, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 5 + k)) }} />)}</div>}
          </div>
        </Card>}
        <Tumbleweed at={tMatches + 0.6} y={760} />
        {/* Leo peeks in, side-eye */}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - ramp(t, tCalled - 0.3, 0.5, EASE.back)) * 500}px)` }}>
          <Leo x={1700} y={1180} size={440} mood={t > tUnlikely ? 'shock' : 'sideeye'} look={-1} seed={43} />
        </div>
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- Leo vs Riot on the scale, then one part ≠ whole PC
  if (inWin(t, W.scale)) {
    const out = ramp(t, tOnePart - 0.45, 0.4, EASE.in);
    const wob = t > tNo ? Math.sin((t - tNo) * 9) * 5 * Math.exp(-(t - tNo) * 1.4) : 0;
    const ang = track(t, [[tLeo, 0], [tBoard - 0.05, 0], [tBoard + 0.3, -10], [tSSD + 0.3, -17], [tNo - 0.05, -17], [tNo + 0.35, 15]], EASE.back) + wob;
    const rad = (ang * Math.PI) / 180, px = 960, py = 300, L = 470;
    const end = (sgn: number) => ({ x: px + sgn * L * Math.cos(rad), y: py + sgn * L * Math.sin(rad) });
    const lp = end(-1), rp = end(1);
    const scaleIn = springAt(f, fps, tLeo - 0.2, { damping: 14, stiffness: 150 });
    return (
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 30%, #1d2846, #090d1a 70%)' }}>
        <AbsoluteFill style={{ transform: `translateY(${(1 - scaleIn) * 300 - out * 1100}px)` }}>
          <svg style={{ position: 'absolute', left: 0, top: 0 }} width="1920" height="1080">
            <path d="M960 300 L960 860" stroke="#c9a24a" strokeWidth="26" strokeLinecap="round" />
            <path d="M800 880 Q960 830 1120 880 Z" fill="#c9a24a" />
            <line x1={lp.x} y1={lp.y} x2={rp.x} y2={rp.y} stroke="#e8c76a" strokeWidth="22" strokeLinecap="round" />
            <circle cx={px} cy={py} r="30" fill="#ffd36b" />
            {[lp, rp].map((p, i) => <g key={i}><line x1={p.x} y1={p.y} x2={p.x - 150} y2={p.y + 250} stroke="#e8c76a" strokeWidth="5" /><line x1={p.x} y1={p.y} x2={p.x + 150} y2={p.y + 250} stroke="#e8c76a" strokeWidth="5" /><path d={`M${p.x - 190} ${p.y + 250} Q${p.x} ${p.y + 320} ${p.x + 190} ${p.y + 250} Z`} fill="#c9a24a" /></g>)}
          </svg>
          {/* Leo's claim on the left pan */}
          <div style={{ position: 'absolute', left: lp.x, top: lp.y + 250, transform: 'translate(-50%,-100%)', width: 340, padding: '18px 16px', borderRadius: 20, background: '#fffbea', boxShadow: '0 20px 40px rgba(0,0,0,.4)', fontFamily: fonts.head, textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 30, color: '#3a2a12' }}>LEO SAYS</div>
            {[['ph:cpu-bold', 'CPU', tLeo], ['ph:circuitry-bold', 'MOTHERBOARD', tBoard], ['ph:hard-drives-bold', 'SSD', tSSD]].map(([ic, lb, at]) => t > (at as number) - 0.05 && <div key={lb as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontWeight: 800, fontSize: 28, color: C.red, transform: `scale(${springAt(f, fps, (at as number) - 0.05, { damping: 10, stiffness: 240 })})` }}><Icon name={ic as string} size={32} color={C.red} />{lb as string} BANNED</div>)}
          </div>
          {/* Riot on the right pan */}
          <div style={{ position: 'absolute', left: rp.x, top: rp.y + 250, transform: 'translate(-50%,-100%)', width: 300, padding: '18px 16px', borderRadius: 20, background: `linear-gradient(160deg,${C.red},#8a1022)`, boxShadow: '0 20px 40px rgba(0,0,0,.4)', fontFamily: fonts.head, textAlign: 'center', color: '#fff' }}>
            <Icon name="ph:shield-check-fill" size={60} color="#fff" />
            <div style={{ fontWeight: 900, fontSize: 30 }}>RIOT SAYS</div>
            <div style={{ fontWeight: 900, fontSize: 64, lineHeight: 1, opacity: ramp(t, tNo - 0.05, 0.15), transform: `scale(${t > tNo ? springAt(f, fps, tNo - 0.05, { damping: 8, stiffness: 260 }) : 0})` }}>NOPE.</div>
          </div>
        </AbsoluteFill>
        {/* Leo + Chip watch from the corners */}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${out * 600}px)` }}><Leo x={230} y={1160} size={380} mood={t > tNo ? 'angry' : 'determined'} look={0.8} seed={44} /></div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${out * 600}px)` }}><Chip x={1720} y={980} size={220} mood={t > tNo ? 'sus' : 'scared'} look={-1} seed={45} /></div>
        {/* one part matches ≠ whole PC */}
        {t > tOnePart - 0.3 && <>
          <Pill x={960} y={150} at={tOnePart - 0.25} color={C.amber} center size={34}>ONE PART MATCHES ≠ WHOLE PC BANNED</Pill>
          {([['ph:cpu-bold', 'CPU', 'bad'], ['ph:circuitry-bold', 'MOTHERBOARD', 'ok'], ['ph:hard-drives-bold', 'SSD', 'ok'], ['ph:graphics-card-bold', 'GPU', 'ok']] as const).map(([ic, lb, st], k) => (
            <Tile key={lb} x={330 + k * 420} y={520} at={tOnePart - 0.2 + k * 0.09} icon={ic} label={lb} state={st} stateAt={st === 'bad' ? tOnePart + 0.3 : tBlack + 0.15 + k * 0.2} />
          ))}
          {t > tOnePart + 0.3 && <div style={{ position: 'absolute', left: 330, top: 740, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 34, color: C.red, whiteSpace: 'nowrap', opacity: ramp(t, tOnePart + 0.3, 0.2) }}>MATCH</div>}
          {t > tBlack + 0.3 && <div style={{ position: 'absolute', left: 1170, top: 740, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 34, color: C.green, whiteSpace: 'nowrap', opacity: ramp(t, tBlack + 0.3, 0.3) }}>STILL FINE ✓</div>}
        </>}
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- two doors, the truth is loading…
  if (inWin(t, W.doors)) {
    const look = track(t, [[tWho, 0], [tWho + 0.35, -1], [tTruth - 0.1, -1], [tTruth + 0.2, 1], [tHonest - 0.1, 1], [tHonest + 0.15, 0]]);
    const shrug = t > tHonest;
    const prog = Math.min(0.5, ramp(t, tWho, 1.2, EASE.out) * 0.5) + (t > tYet ? Math.sin(t * 6) * 0.004 : 0);
    return (
      <AbsoluteFill style={{ background: 'linear-gradient(180deg,#151a2c,#0a0d18)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 850, bottom: 0, background: 'linear-gradient(180deg,#1b2132,#0b0e18)' }} />
        <div style={{ position: 'absolute', left: 960, top: 160, transform: 'translateX(-50%)', width: 640, textAlign: 'center', fontFamily: fonts.head }}>
          <div style={{ fontWeight: 900, fontSize: 38, color: C.ink, letterSpacing: '0.08em' }}>THE TRUTH</div>
          <div style={{ position: 'relative', height: 30, marginTop: 10, borderRadius: 15, background: '#070a14', border: '3px solid rgba(255,255,255,.15)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${prog * 100}%`, background: `linear-gradient(90deg,${C.cyan},${C.violet})` }} />
          </div>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, marginTop: 8 }}>loading… 50% · stuck since 2026</div>
        </div>
        <Door x={430} label="LEO'S STORY" icon={<Icon name="ph:user-bold" size={40} color="#0b0d14" />} color={C.cyan} at={tWho - 0.25} open={ramp(t, tWho + 0.3, 0.5, EASE.out) * (1 - ramp(t, tTruth - 0.1, 0.3))} />
        <Door x={1490} label="RIOT'S STORY" icon={<Icon name="ph:shield-check-fill" size={40} color="#0b0d14" />} color={C.red} at={tWho - 0.15} open={ramp(t, tTruth, 0.5, EASE.out) * (1 - ramp(t, tHonest - 0.1, 0.3))} />
        <Chip x={960} y={830} size={300} mood={shrug ? 'neutral' : 'sus'} look={look} arms={shrug ? 'shrug' : 'none'} squash={shrug ? 0.35 * Math.exp(-(t - tHonest) * 4) : 0} seed={46} />
        {t > tHonest && <Bubble x={960} y={500} at={tHonest + 0.05} text="¯\_(ツ)_/¯" w={330} size={46} />}
        {t > tYet + 0.05 && <div style={{ position: 'absolute', left: 960, top: 255, transform: `translate(-50%,0) scale(${springAt(f, fps, tYet + 0.05, { damping: 10, stiffness: 240 })})`, padding: '6px 20px', borderRadius: 10, background: C.amber, color: '#0b0d14', fontFamily: fonts.head, fontWeight: 900, fontSize: 30, whiteSpace: 'nowrap' }}>WE DON'T KNOW YET</div>}
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- what Riot did confirm
  if (inWin(t, W.confirm)) {
    const games = [['ph:crosshair-bold', 'VALORANT'], ['ph:sword-bold', 'RPG'], ['ph:car-bold', 'RACING'], ['ph:soccer-ball-bold', 'FOOTBALL']] as const;
    const month = Math.min(4, Math.floor(clamp((t - tOne - 0.2) / 1.4) * 5));
    return (
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 20%, #13304a, #070c18 70%)' }}>
        <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)', backgroundSize: '80px 80px' }} />
        <Pill x={960} y={120} at={tConfirm} color={C.green} center size={38}><Icon name="ph:seal-check-fill" size={38} color={C.ink} /> RIOT CONFIRMED 2 THINGS</Pill>
        {t > tOne - 0.1 && <Card x={540} y={500} w={680} at={tOne - 0.1}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: C.cyan, letterSpacing: '0.1em' }}>① HARDWARE BAN</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '30px 0 20px' }}>
            {[0, 1, 2, 3].map((k) => <div key={k} style={{ width: 110, height: 120, borderRadius: 14, background: k < month ? C.red : '#0a1020', border: `3px solid ${k < month ? C.red : 'rgba(255,255,255,.15)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${k < month ? 1 + 0.12 * Math.exp(-(t - tOne - 0.2 - (k + 1) * 0.28) * 8) : 1})` }}>
              <Icon name="ph:calendar-blank-bold" size={50} color={k < month ? '#fff' : C.dim} />
              <div style={{ fontWeight: 900, fontSize: 26, color: k < month ? '#fff' : C.dim }}>M{k + 1}</div>
            </div>)}
          </div>
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: C.dim }}>then it's lifted</div>
        </Card>}
        {t > tFour + 0.2 && <Stamp x={540} y={720} at={tFour + 0.25} text="MAX 4 MONTHS" size={62} rot={-6} color={C.amber} />}
        {t > tTwo - 0.1 && <Card x={1380} y={500} w={680} at={tTwo - 0.1}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: C.cyan, letterSpacing: '0.1em' }}>② WHICH GAMES?</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '26px 30px 0' }}>
            {games.map(([ic, lb], k) => { const bad = k === 0, on = bad ? t > tOnly : t > tWhere + 0.15 + k * 0.12; const col = on ? (bad ? C.red : C.green) : 'rgba(255,255,255,.15)';
              return <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, background: '#0a1020', border: `3px solid ${col}` }}><Icon name={ic} size={40} color={on ? col : C.ink} /><span style={{ fontWeight: 800, fontSize: 26, flex: 1, textAlign: 'left' }}>{lb}</span>{on && <Icon name={bad ? 'ph:prohibit-bold' : 'ph:check-circle-fill'} size={36} color={col} />}</div>; })}
          </div>
        </Card>}
        {t > tOnly - 0.05 && <Stamp x={1380} y={760} at={tOnly - 0.03} text="ONLY THAT GAME" size={58} rot={5} color={C.amber} />}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - ramp(t, tTwoThings, 0.5, EASE.back)) * 400}px)` }}><Chip x={960} y={600} size={150} mood={t > tWhere ? 'happy' : 'sus'} look={t > tTwo ? 1 : -1} seed={47} /></div>
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- the cell: AUG → DEC
  const flip = FLIPS.filter((x) => t > x).length;
  const scratch = t > tAug - 0.05 && t < tDec;
  const tally = clamp((t - tAug + 0.05) / (tDec - tAug)) * 23;
  const lastFlip = FLIPS[Math.max(0, flip - 1)];
  const page = flip > 0 ? ramp(t, lastFlip, 0.18, EASE.out) : 1;
  const dec = flip >= 4;
  const doorIn = ramp(t, tCell - 0.25, 0.3, EASE.in);
  return (
    <AbsoluteFill style={{ transform: `translateX(${t < tCell + 0.2 && t > tCell - 0.05 ? (r() - 0.5) * 18 : 0}px)` }}>
      <Cell tally={tally} bars={doorIn * (1 - 0.7 * ramp(t, tCell + 0.6, 0.9, EASE.inOut))} zoom={1 + 1.2 * ramp(t, tCell + 0.6, 0.9, EASE.inOut)}>
        {/* window light */}
        <div style={{ position: 'absolute', left: 820, top: 180, width: 280, height: 130, borderRadius: 10, background: dec ? 'linear-gradient(180deg,#bcd4ff,#e8f0ff)' : '#5f7fb4', boxShadow: '0 0 80px rgba(160,200,255,.35)' }}>{[0, 1, 2, 3].map((k) => <div key={k} style={{ position: 'absolute', left: 30 + k * 66, top: 0, width: 12, height: '100%', background: '#2a2f3a' }} />)}</div>
        <AbsoluteFill style={{ background: 'linear-gradient(160deg, transparent 40%, rgba(170,200,255,.08) 50%, transparent 62%)' }} />
        {/* wall calendar */}
        <div style={{ position: 'absolute', left: 250, top: 210, width: 280, height: 320, borderRadius: 14, background: '#f4efe2', boxShadow: '0 20px 40px rgba(0,0,0,.45)', overflow: 'hidden', transform: 'rotate(-2deg)' }}>
          <div style={{ height: 70, background: dec ? C.green : C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 48, color: '#fff' }}>{MONTHS[flip]}</div>
          <div style={{ transformOrigin: '50% 0', transform: `perspective(600px) rotateX(${(1 - page) * -80}deg)`, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, padding: 14 }}>
            {Array.from({ length: 20 }, (_, k) => <div key={k} style={{ height: 38, borderRadius: 6, background: '#e2dccb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 800, fontSize: 20, color: '#6b6250', position: 'relative' }}>
              {k + 1}
              {flip === 0 && k === 11 && t > tAug && <div style={{ position: 'absolute', inset: -4, border: `4px solid ${C.red}`, borderRadius: '50%' }} />}
              {dec && k === 14 && <div style={{ position: 'absolute', inset: -6, border: `4px solid ${C.green}`, borderRadius: '50%', transform: `scale(${springAt(f, fps, tDec + 0.1, { damping: 8, stiffness: 240 })})` }} />}
            </div>)}
          </div>
        </div>
        {flip === 0 && t > tAug && <div style={{ position: 'absolute', left: 390, top: 560, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 34, color: C.redSoft, whiteSpace: 'nowrap' }}>BANNED: AUG 12</div>}
        {dec && <div style={{ position: 'absolute', left: 390, top: 560, transform: `translateX(-50%) scale(${springAt(f, fps, tDec + 0.1, { damping: 10, stiffness: 220 })})`, fontFamily: fonts.head, fontWeight: 900, fontSize: 34, color: C.green, whiteSpace: 'nowrap' }}>FREE ≈ MID-DEC</div>}
        {/* bed */}
        <div style={{ position: 'absolute', left: 1240, top: 720, width: 520, height: 70, borderRadius: 10, background: '#5c6474' }}><div style={{ position: 'absolute', left: 20, top: -30, width: 140, height: 50, borderRadius: 20, background: '#c9ced8' }} /></div>
        {/* Chip with a prisoner number, scratching tally marks */}
        <Chip x={790} y={860} size={300} mood={dec ? 'happy' : t > tAug ? 'sad' : 'grumpy'} look={scratch ? 1 : 0} lookY={scratch ? -0.6 : 0} arms={scratch ? 'point' : 'none'} armPhase={t * 6} tilt={scratch ? 4 + Math.sin(t * 18) * 2 : 0} seed={48} />
        <div style={{ position: 'absolute', left: 790, top: 820, transform: 'translate(-50%,-50%) rotate(-3deg)', padding: '4px 14px', background: '#fffbe6', border: '4px solid #3a4152', borderRadius: 6, fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: '#3a4152', whiteSpace: 'nowrap' }}>VAN-152</div>
        {dec && <Burst x={390} y={370} at={tDec + 0.1} color={C.green} size={260} />}
      </Cell>
    </AbsoluteFill>
  );
};
