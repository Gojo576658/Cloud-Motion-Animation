// Scene 6 · Outro — Chip "NOT A CHEATER" on the couch while the bad roommate tiptoes off with
// the snacks, Chip on a snowy night shelf counting down to December, comment + subscribe,
// a creepy-cute teaser (PC parts opening their eyes), and "See you, Chip." with the logo.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pill, Fade } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng, track } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, P, PE, S0, S1 } from './ctime';
import { Chip, Shady } from './chars';
import { Stamp, Burst, Bubble } from './fx';

const A = S0(6), Z = S1(6);
const tAsFor = C0(43), tNot = P(43, 'not a cheater'), tRoommate = P(43, 'really bad'), tRoomEnd = PE(43, 'roommate');
const tGermany = C0(44), tLittle = P(44, 'little Ryzen'), tCounting = P(44, 'counting down'), tDec = P(44, 'December');
const tComments = C0(45), tWould = P(45, 'Would you'), tSub = P(45, 'subscribe'), tNext = P(45, 'next time'), tSecret = P(45, 'secretly'), tRemembers = P(45, 'remembers');
const tSee = C0(46);

export const s6NoCaptions: [number, number][] = [[tSee - 0.2, Z + 1]];
const W = { couch: [A - 0.5, tGermany - 0.25], shelf: [tGermany - 0.25, tComments - 0.2], cta: [tComments - 0.2, tNext - 0.15], tease: [tNext - 0.15, tSee - 0.2], bye: [tSee - 0.2, Z + 1] } as const;
const inWin = (t: number, w: readonly [number, number]) => t >= w[0] && t < w[1];
const PARTS = [
  { icon: 'ph:memory-bold', x: 330, y: 470, s: 230 }, { icon: 'ph:graphics-card-bold', x: 700, y: 360, s: 280 }, { icon: 'ph:hard-drives-bold', x: 1110, y: 420, s: 240 },
  { icon: 'ph:circuitry-bold', x: 1500, y: 360, s: 280 }, { icon: 'ph:mouse-bold', x: 920, y: 690, s: 190 }, { icon: 'ph:keyboard-bold', x: 1360, y: 700, s: 210 },
];
const EYES = PARTS.map((_, k) => lerp(tNext + 0.4, tRemembers - 0.1, k / (PARTS.length - 1)));

export const s6Sfx: SfxEvent[] = [
  { t: A + 0.05, name: 'sillyPop', vol: 0.35, note: 'couch' }, { t: tNot - 0.1, name: 'paperSlide', vol: 0.4, note: 'NOT A CHEATER sign' }, { t: tNot + 0.5, name: 'hardPop', vol: 0.3 },
  { t: tRoommate - 0.25, name: 'toyWhistle', vol: 0.35, note: 'roommate sneaks' }, ...[0, 1, 2, 3].map((k) => ({ t: tRoommate + k * 0.28, name: 'squeak' as const, vol: 0.22, note: 'tiptoe' })),
  { t: tRoomEnd + 0.15, name: 'laughApplause', vol: 0.25, dur: 1.6, note: 'small laugh' },
  { t: tGermany - 0.2, name: 'swooshSlow', vol: 0.3 }, { t: tLittle, name: 'sparkle', vol: 0.3 },
  ...[0, 1, 2].map((k) => ({ t: tCounting + 0.1 + k * 0.45, name: 'tick' as const, vol: 0.35, note: 'countdown flip' })), { t: tDec, name: 'shimmer', vol: 0.4, note: 'snow + December' },
  { t: tComments - 0.15, name: 'popUi', vol: 0.4, note: 'comment box' }, { t: tComments + 0.4, name: 'typing', vol: 0.35, dur: 1.4 },
  { t: tWould - 0.05, name: 'popUi', vol: 0.35, note: 'poll' }, { t: tWould + 1.3, name: 'click', vol: 0.4, note: 'vote' },
  { t: tSub - 0.05, name: 'clickModern', vol: 0.5, note: 'subscribe click' }, { t: tSub + 0.35, name: 'bell', vol: 0.45, note: 'bell' },
  { t: tNext - 0.15, name: 'darkSweep', vol: 0.4, note: 'lights out' }, { t: tNext + 0.2, name: 'mysteryHeartbeat', vol: 0.4, dur: 3.5 },
  ...EYES.map((x) => ({ t: x, name: 'bleepHi' as const, vol: 0.15, note: 'eyes open' })), { t: tRemembers - 0.05, name: 'horrorBell', vol: 0.45 },
  { t: tSee - 0.2, name: 'whooshQuick', vol: 0.3 }, { t: tSee + 0.05, name: 'sillyPop', vol: 0.45, note: 'wave' }, { t: tSee + 0.8, name: 'sparkle', vol: 0.4, note: 'wink + logo' },
];

const Snow: React.FC<{ n: number; amt: number; w?: number; h?: number }> = ({ n, amt, w = 1920, h = 1080 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const r = rng(11);
  return <>{Array.from({ length: n }, (_, i) => { const x0 = r() * w, sp = 40 + r() * 70, sz = 4 + r() * 8, ph = r() * h; const y = ((t * sp + ph) % (h + 40)) - 20; const x = x0 + Math.sin(t * 0.8 + i) * 18; return <div key={i} style={{ position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: '50%', background: '#fff', opacity: amt * (0.5 + 0.5 * ((i % 3) / 2)) }} />; })}</>;
};

export const S6Outro: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;

  // ---------------------------------------------------------------- couch: not a cheater, just a bad roommate
  if (inWin(t, W.couch)) {
    const sneak = ramp(t, tRoommate - 0.3, 1.9, EASE.inOut);
    const sx = lerp(1210, 1900, sneak), bob = sneak > 0 && sneak < 1 ? Math.abs(Math.sin(t * 11)) * -16 : 0;
    const sign = t > tNot - 0.1;
    return (
      <AbsoluteFill style={{ background: 'linear-gradient(180deg,#3a2c4a,#241a30)' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0 60px, transparent 60px 120px)' }} />
        <div style={{ position: 'absolute', left: 1460, top: 140, width: 260, height: 190, borderRadius: 8, background: 'linear-gradient(160deg,#d8a35a,#8a5a2a)', boxShadow: '0 0 0 12px #2a1e14, 0 20px 40px rgba(0,0,0,.4)' }}><div style={{ position: 'absolute', left: 40, top: 70, width: 180, height: 90, background: '#5a8a6a', borderRadius: '50% 50% 0 0' }} /></div>
        <div style={{ position: 'absolute', left: 230, top: 160, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,210,140,.35), transparent 65%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 860, bottom: 0, background: 'linear-gradient(180deg,#4a3428,#2a1c14)' }} />
        {/* couch */}
        <div style={{ position: 'absolute', left: 520, top: 480, width: 880, height: 260, borderRadius: '60px 60px 20px 20px', background: 'linear-gradient(180deg,#c0443e,#8a2a28)' }} />
        <div style={{ position: 'absolute', left: 560, top: 700, width: 800, height: 140, borderRadius: 30, background: 'linear-gradient(180deg,#d4504a,#a03430)' }} />
        <div style={{ position: 'absolute', left: 470, top: 620, width: 130, height: 230, borderRadius: 50, background: '#a8383a' }} /><div style={{ position: 'absolute', left: 1320, top: 620, width: 130, height: 230, borderRadius: 50, background: '#a8383a' }} />
        {[600, 1300].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 840, width: 26, height: 30, background: '#2a1c14' }} />)}
        {/* crumbs where the roommate sat */}
        {t > tRoommate + 0.6 && Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 1120 + (i * 37) % 160, top: 712 + (i * 13) % 26, width: 12, height: 9, background: '#f2c14e', transform: `rotate(${i * 40}deg)`, opacity: ramp(t, tRoommate + 0.6 + i * 0.03, 0.2) }} />)}
        <Chip x={830} y={725} size={250} mood={t > tRoommate ? 'sus' : sign ? 'proud' : 'neutral'} look={t > tRoommate ? 1 : 0} arms={sign && t < tRoommate - 0.1 ? 'sign' : 'none'} seed={61} />
        {sign && t < tRoommate - 0.1 && <div style={{ position: 'absolute', left: 830, top: 420, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tNot - 0.1, { damping: 10, stiffness: 200 })}) rotate(-3deg)`, padding: '12px 30px', background: '#fffbe6', border: '5px solid #3a4152', borderRadius: 10, fontFamily: fonts.head, fontWeight: 900, fontSize: 50, color: '#1d7a4c', whiteSpace: 'nowrap' }}>NOT A CHEATER</div>}
        <div style={{ position: 'absolute', left: 0, top: bob }}>
          <Shady x={sx} y={800} size={330} whistle={sneak > 0} seed={62} />
          {/* the stolen snack bowl */}
          <div style={{ position: 'absolute', left: sx - 160, top: 600, width: 130, height: 60, borderRadius: '0 0 65px 65px', background: '#3a7bd5', transform: `rotate(${sneak > 0 ? -8 : 0}deg)` }}>
            {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: 'absolute', left: 14 + k * 26, top: -16 - (k % 2) * 8, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '24px solid #f2c14e' }} />)}
          </div>
        </div>
        {t > tRoommate + 0.1 && <Pill x={1330} y={300} at={tRoommate + 0.1} color={C.red} center size={34}><Icon name="ph:arrow-down-right-bold" size={34} color={C.ink} /> REALLY BAD ROOMMATE</Pill>}
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- snowy night shelf, counting to December
  if (inWin(t, W.shelf)) {
    const days = 66 - [0, 1, 2].filter((k) => t > tCounting + 0.1 + k * 0.45).length;
    const dec = t > tDec - 0.05;
    const push = 1 + ramp(t, tGermany - 0.25, 5.2, EASE.inOut) * 0.08;
    return (
      <AbsoluteFill style={{ background: 'linear-gradient(180deg,#141a33,#0a0e1e)', transform: `scale(${push})` }}>
        {/* window */}
        <div style={{ position: 'absolute', left: 560, top: 110, width: 800, height: 560, borderRadius: 20, background: 'linear-gradient(180deg,#0b1640,#1c2c66)', boxShadow: 'inset 0 0 0 16px #2a2238, 0 0 0 6px #1a1426', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 560, top: 70, width: 110, height: 110, borderRadius: '50%', background: '#f4f1d8', boxShadow: '0 0 60px rgba(244,241,216,.6)' }} />
          {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: 'absolute', left: (i * 97) % 760, top: (i * 53) % 260, width: 4, height: 4, borderRadius: '50%', background: '#fff', opacity: 0.4 + 0.4 * Math.sin(t * 2 + i) }} />)}
          {/* rooftops */}
          <svg style={{ position: 'absolute', left: 0, bottom: 0 }} width="800" height="220" viewBox="0 0 800 220"><path d="M0 220 V120 L80 60 L160 120 V90 L240 30 L320 90 V140 L420 70 L520 140 V100 L600 40 L680 100 V130 L800 70 V220 Z" fill="#070b1c" />{[[100, 140], [270, 120], [460, 160], [630, 140]].map(([x, y]) => <rect key={x} x={x} y={y} width="26" height="30" fill="#ffd27a" opacity="0.8" />)}</svg>
          <Snow n={50} amt={0.35 + 0.65 * ramp(t, tDec - 0.1, 1)} w={800} h={560} />
          <div style={{ position: 'absolute', left: 392, top: 0, width: 16, height: '100%', background: '#2a2238' }} />
        </div>
        {/* shelf */}
        <div style={{ position: 'absolute', left: 520, top: 770, width: 880, height: 30, borderRadius: 6, background: 'linear-gradient(180deg,#8a5a3a,#5a3a24)', boxShadow: '0 16px 30px rgba(0,0,0,.5)' }} />
        <div style={{ position: 'absolute', left: 380, top: 380, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,190,110,.25), transparent 65%)' }} />
        <Chip x={800} y={772} size={230} mood={dec ? 'happy' : 'sleepy'} look={dec ? -0.4 : 0} lookY={dec ? -0.8 : 0} blush={dec ? 1 : 0} seed={63} />
        {/* tiny desk calendar */}
        <div style={{ position: 'absolute', left: 1060, top: 610, width: 200, height: 160, borderRadius: 14, background: '#f4efe2', boxShadow: '0 10px 24px rgba(0,0,0,.4)', overflow: 'hidden', textAlign: 'center', fontFamily: fonts.head }}>
          <div style={{ height: 40, background: C.red, color: '#fff', fontWeight: 900, fontSize: 22, lineHeight: '40px' }}>DAYS LEFT</div>
          <div style={{ fontWeight: 900, fontSize: 84, color: '#2a2a35', lineHeight: '118px', transform: `scale(${1 + 0.12 * Math.max(0, 1 - ((t - tCounting - 0.1) % 0.45) * 6) * (t > tCounting && t < tCounting + 1.4 ? 1 : 0)})` }}>{days}</div>
        </div>
        {dec && <div style={{ position: 'absolute', left: 960, top: 60, transform: `translateX(-50%) scale(${springAt(f, fps, tDec, { damping: 12, stiffness: 180 })})`, fontFamily: fonts.head, fontWeight: 900, fontSize: 44, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 0 30px rgba(160,200,255,.8)' }}>SEE YOU IN DECEMBER, CHIP</div>}
        <Pill x={300} y={110} at={tGermany} out={tDec - 0.35} color={C.amber} size={30}>SOMEWHERE IN GERMANY</Pill>
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- comments + subscribe
  if (inWin(t, W.cta)) {
    const msg = 'Never again… unless I test it on day 1.';
    const n = Math.floor(clamp((t - tComments - 0.4) / 1.4) * msg.length);
    const voted = t > tWould + 1.3;
    const subbed = t > tSub;
    const cur = { x: track(t, [[tWould + 0.6, 1500], [tWould + 1.25, 620], [tSub - 0.4, 620], [tSub - 0.08, 1330]]), y: track(t, [[tWould + 0.6, 900], [tWould + 1.25, 600], [tSub - 0.4, 600], [tSub - 0.08, 495]]) };
    const press = (t > tWould + 1.25 && t < tWould + 1.4) || (t > tSub - 0.08 && t < tSub + 0.08) ? 0.85 : 1;
    return (
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 40% 30%, #1d2846, #090d1a 70%)' }}>
        <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)', backgroundSize: '80px 80px' }} />
        <div style={{ position: 'absolute', left: 620, top: 300, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tComments - 0.15, { damping: 13, stiffness: 170 })})`, width: 900, padding: 30, borderRadius: 26, background: 'linear-gradient(160deg,#18213a,#0e1426)', border: '3px solid rgba(255,255,255,.12)', boxShadow: '0 30px 80px rgba(0,0,0,.5)', display: 'flex', gap: 22, alignItems: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.violet, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:user-bold" size={46} color="#fff" /></div>
          <div style={{ flex: 1, borderBottom: `3px solid ${C.cyan}`, padding: '8px 0', fontFamily: fonts.body, fontWeight: 600, fontSize: 36, color: n ? C.ink : C.dim, whiteSpace: 'nowrap', overflow: 'hidden' }}>{n ? msg.slice(0, n) : 'Add a comment…'}<span style={{ color: C.cyan, opacity: Math.sin(t * 12) > 0 ? 1 : 0 }}>|</span></div>
        </div>
        {t > tWould - 0.1 && <div style={{ position: 'absolute', left: 620, top: 640, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tWould - 0.08, { damping: 13, stiffness: 170 })})`, width: 900, padding: 30, borderRadius: 26, background: 'linear-gradient(160deg,#18213a,#0e1426)', border: '3px solid rgba(255,255,255,.12)', boxShadow: '0 30px 80px rgba(0,0,0,.5)', fontFamily: fonts.head, color: C.ink }}>
          <div style={{ fontWeight: 900, fontSize: 44, marginBottom: 20 }}>Would you buy a used CPU again?</div>
          {[['YES, BUT I TEST IT DAY 1', 62, C.green], ['NEVER AGAIN', 38, C.red]].map(([lb, pct, col], k) => <div key={k} style={{ position: 'relative', height: 70, borderRadius: 14, background: '#0a1020', marginTop: 12, overflow: 'hidden', border: `3px solid ${k === 0 && voted ? col : 'rgba(255,255,255,.1)'}` }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(voted ? (pct as number) * ramp(t, tWould + 1.3, 0.6) : 0)}%`, background: `${col}55` }} />
            <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: 30 }}>{lb as string}</div>
            {voted && <div style={{ position: 'absolute', right: 22, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontWeight: 900, fontSize: 30 }}>{Math.round((pct as number) * ramp(t, tWould + 1.3, 0.6))}%</div>}
          </div>)}
        </div>}
        {/* subscribe + bell */}
        <div style={{ position: 'absolute', left: 1500, top: 500, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tWould + 0.3, { damping: 11, stiffness: 190 }) * (t > tSub - 0.08 && t < tSub + 0.08 ? 0.92 : 1)})`, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ padding: '24px 46px', borderRadius: 60, background: subbed ? '#2a3042' : C.red, color: '#fff', fontFamily: fonts.head, fontWeight: 900, fontSize: 46, whiteSpace: 'nowrap', boxShadow: subbed ? 'none' : `0 0 50px ${C.red}88` }}>{subbed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div>
          <div style={{ transform: `rotate(${t > tSub + 0.3 ? Math.sin((t - tSub) * 30) * 22 * Math.max(0, 1 - (t - tSub - 0.3) * 1.2) : 0}deg)`, transformOrigin: '50% 10%' }}><Icon name={t > tSub + 0.3 ? 'ph:bell-ringing-fill' : 'ph:bell-bold'} size={80} color={t > tSub + 0.3 ? C.amber : C.ink} /></div>
        </div>
        {subbed && <Burst x={1440} y={500} at={tSub} color={C.amber} size={300} />}
        <Chip x={1500} y={900} size={220} mood={subbed ? 'proud' : 'happy'} arms={subbed ? 'up' : 'point'} look={-1} squash={subbed ? 0.3 * Math.exp(-(t - tSub) * 5) : 0} seed={64} />
        {t > tWould + 0.6 && t < tSub + 0.6 && <div style={{ position: 'absolute', left: cur.x, top: cur.y, transform: `scale(${press})`, transformOrigin: '0 0', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))' }}><Icon name="ph:hand-pointing-fill" size={90} color="#fff" /></div>}
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- teaser: your hardware remembers
  if (inWin(t, W.tease)) {
    const dark = ramp(t, tNext - 0.15, 0.4);
    return (
      <AbsoluteFill style={{ background: '#020308' }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, rgba(60,40,90,${0.5 * dark}), transparent 65%)` }} />
        {PARTS.map((p, k) => {
          const open = springAt(f, fps, EYES[k], { damping: 10, stiffness: 220 });
          return (
            <div key={k} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-50%)', opacity: 0.18 + 0.12 * open }}>
              <Icon name={p.icon} size={p.s} color="#5a5f7a" />
            </div>
          );
        })}
        {PARTS.map((p, k) => {
          const open = t > EYES[k] ? springAt(f, fps, EYES[k], { damping: 10, stiffness: 220 }) : 0;
          if (open <= 0.01) return null;
          const blink = Math.abs(((t + k * 0.7) % 3.4) - 3.2) < 0.08 ? 0.1 : 1;
          return (
            <svg key={`e${k}`} style={{ position: 'absolute', left: p.x - 70, top: p.y - 30, overflow: 'visible' }} width="140" height="60">
              {[35, 105].map((ex) => <g key={ex}><ellipse cx={ex} cy="30" rx="22" ry={20 * open * blink} fill="#fff6c8" style={{ filter: 'drop-shadow(0 0 12px #ffd23a)' }} /><circle cx={ex + Math.sin(t * 1.2 + k) * 6} cy="32" r={9 * Math.min(1, open * blink * 1.2)} fill="#1a0f05" /></g>)}
            </svg>
          );
        })}
        {t > tSecret - 0.1 && <div style={{ position: 'absolute', left: 960, top: 140, transform: `translateX(-50%) translateY(${(1 - ramp(t, tSecret - 0.1, 0.5)) * 20}px)`, opacity: ramp(t, tSecret - 0.1, 0.5), textAlign: 'center', fontFamily: fonts.head, whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: C.amber, letterSpacing: '0.2em' }}>NEXT TIME</div>
          <div style={{ fontWeight: 900, fontSize: 64, color: '#fff' }}>WHAT YOUR HARDWARE <span style={{ color: C.amber }}>REMEMBERS</span></div>
        </div>}
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- See you, Chip.
  const logo = springAt(f, fps, tSee + 0.7, { damping: 13, stiffness: 160 });
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #1c2a4e, #070b18 70%)' }}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)', backgroundSize: '80px 80px' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - springAt(f, fps, tSee - 0.15, { damping: 11, stiffness: 180 })) * 500}px)` }}>
        <Chip x={960} y={640} size={340} mood={t > tSee + 0.7 ? 'wink' : 'happy'} arms="wave" armPhase={t * 3} blush={1} seed={65} />
      </div>
      {t > tSee && <Bubble x={1260} y={330} at={tSee + 0.05} text="bye! ♥" w={260} size={46} tail="left" />}
      <div style={{ position: 'absolute', left: 960, top: 800, transform: `translate(-50%,-50%) translateY(${(1 - logo) * 40}px) scale(${0.9 + 0.1 * logo})`, opacity: logo, textAlign: 'center', whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 96, color: C.ink, letterSpacing: '-0.02em' }}>Mechivio<span style={{ color: C.cyan }}>Tech</span></div>
        <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, color: C.dim, marginTop: 4 }}>how tech really works</div>
      </div>
      <Fade at={Z - 0.6} d={0.6} out />
    </AbsoluteFill>
  );
};
