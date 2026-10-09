// Scene 5 · The hurt + how to protect yourself — rainy room and Leo's memory polaroids
// (save up, hunt a deal, build it piece by piece), the bouncer's proud thumbs-up vs Leo under his
// own rain cloud, "BAN STATUS: ???" on a used listing, the 4-step checklist, and two padlocks.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pill, Flash } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, P, PE, S0, S1 } from './ctime';
import { Chip, Leo, Bouncer } from './chars';
import { GamerRoom, Stamp, Burst } from './fx';

const A = S0(5), Z = S1(5);
const tHurts = P(37, 'actually hurts'), tSave = P(37, 'save up'), tHunt = P(37, 'hunt'), tBuild = P(37, 'build your'), tPaying = P(37, 'paying'), tMistake = P(37, 'mistake');
const tWorst = C0(38), tSystem = P(38, 'The system'), tExactly = P(38, 'exactly'), tJust = P(38, 'Just'), tWrong = P(38, 'wrong person');
const tNoWay = C0(39), tCheck = P(39, 'check a used'), tBan = P(39, 'for a ban'), tBuy = P(39, 'buy it');
const tProtect = C0(40), tT1 = P(41, 'One.'), tT2 = P(41, 'Two.'), tT3 = P(41, 'Three.'), tT4 = P(41, 'And four.'), tRiotSays = P(41, 'Riot says');
const tSome = C0(42), tTemp = P(42, 'temporary'), tDont = P(42, "and some don't");

export const s5NoCaptions: [number, number][] = [];
const W = { hurt: [A - 0.5, tWorst - 0.2], system: [tWorst - 0.2, tNoWay - 0.2], check: [tNoWay - 0.2, tProtect - 0.15], tips: [tProtect - 0.15, tSome - 0.2], locks: [tSome - 0.2, Z + 0.5] } as const;
const inWin = (t: number, w: readonly [number, number]) => t >= w[0] && t < w[1];
const FANS = [0, 1, 2].map((k) => tBuild + 0.35 + k * 0.45);
const TIPS = [
  { at: tT1, tick: tT2 - 0.35, icon: 'ph:calendar-check-bold', a: 'BUY WITH A', b: 'RETURN WINDOW' },
  { at: tT2, tick: tT3 - 0.35, icon: 'ph:game-controller-bold', a: 'TEST EVERY ANTI-CHEAT', b: 'GAME ON DAY 1' },
  { at: tT3, tick: tT4 - 0.35, icon: 'ph:receipt-bold', a: 'KEEP THE RECEIPT', b: '+ SELLER CHAT' },
  { at: tT4, tick: tRiotSays + 1.4, icon: 'ph:headset-bold', a: 'BANNED? CONTACT', b: 'GAME SUPPORT' },
];

export const s5Sfx: SfxEvent[] = [
  { t: A + 0.1, name: 'crowdSad', vol: 0.12, dur: 2.5, note: 'very low' },
  { t: tSave - 0.25, name: 'swooshSlow', vol: 0.3, note: 'polaroid 1' }, ...[0, 1, 2].map((k) => ({ t: tSave + 0.1 + k * 0.22, name: 'coins' as const, vol: 0.25, dur: 0.5 })),
  { t: tHunt - 0.2, name: 'swooshSlow', vol: 0.3, note: 'polaroid 2' }, { t: tHunt + 0.45, name: 'sparkle', vol: 0.3, note: 'heart' },
  { t: tBuild - 0.2, name: 'swooshSlow', vol: 0.3, note: 'polaroid 3' }, ...FANS.map((x) => ({ t: x, name: 'switchLight' as const, vol: 0.35, note: 'fan lights' })),
  { t: tPaying - 0.1, name: 'glitchBreak', vol: 0.3, note: 'memories fade' }, { t: tMistake, name: 'failPiano', vol: 0.3 },
  { t: tWorst - 0.15, name: 'whooshQuick', vol: 0.3 }, { t: tSystem + 0.1, name: 'success', vol: 0.45, rate: 0.82, note: 'detuned SYSTEM WORKING' }, { t: tExactly, name: 'applause', vol: 0.15, dur: 1.2, note: 'ironic' },
  { t: tJust - 0.05, name: 'scratch', vol: 0.35 }, { t: tWrong - 0.05, name: 'negGuitar', vol: 0.4, note: 'WRONG PERSON' }, { t: tWrong + 0.3, name: 'crowdSad', vol: 0.3, dur: 1.4 },
  { t: tNoWay - 0.1, name: 'popUi', vol: 0.35, note: 'listing' }, { t: tCheck - 0.1, name: 'scan', vol: 0.45, note: 'magnifier' }, { t: tBan, name: 'error', vol: 0.4, note: 'BAN STATUS ???' },
  { t: tBuy - 0.02, name: 'stomp', vol: 0.5, note: 'NO WAY TO CHECK' },
  { t: tProtect - 0.1, name: 'levelUp', vol: 0.45, note: 'shield' },
  ...TIPS.flatMap((x) => [{ t: x.at - 0.05, name: 'popUi' as const, vol: 0.4 }, { t: x.tick, name: 'confirm' as const, vol: 0.4, note: 'tick' }]),
  { t: tSome - 0.1, name: 'lock', vol: 0.4, note: 'padlocks' }, { t: tTemp, name: 'tick', vol: 0.4 }, { t: tTemp + 0.5, name: 'tick', vol: 0.4 }, { t: tTemp + 1.05, name: 'lockQuick', vol: 0.45, note: 'unlocks' },
  { t: tDont - 0.05, name: 'jailLock', vol: 0.5, note: 'forever lock' }, { t: tDont + 0.2, name: 'gasp', vol: 0.35 },
];

// ---- pieces
const Polaroid: React.FC<{ x: number; y: number; at: number; drop: number; rot: number; label: string; children: React.ReactNode }> = ({ x, y, at, drop, rot, label, children }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  if (t < at - 0.02) return null;
  const s = springAt(f, fps, at, { damping: 13, stiffness: 150 });
  const fall = ramp(t, drop, 0.7, EASE.in), grey = ramp(t, drop - 0.3, 0.4);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 420, transform: `translate(-50%,-50%) translateY(${(1 - s) * -300 + fall * 900}px) rotate(${rot * s + fall * rot * 4}deg) scale(${0.9 + 0.1 * s})`, opacity: clamp(s * 1.5), padding: '20px 20px 0', background: '#f7f3ea', boxShadow: '0 30px 70px rgba(0,0,0,.55)', filter: `grayscale(${grey})` }}>
      <div style={{ position: 'relative', height: 340, overflow: 'hidden', background: '#1a2238' }}>{children}</div>
      <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: '#2a2a35' }}>{label}</div>
    </div>
  );
};
const Piggy: React.FC<{ at: number }> = ({ at }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const bump = [0, 1, 2].reduce((m, k) => m + Math.max(0, 1 - Math.abs(t - at - 0.35 - k * 0.22) * 8) * 0.06, 0);
  return (
    <>
      <svg style={{ position: 'absolute', left: 60, top: 80, transform: `scale(${1 + bump}, ${1 - bump})`, transformOrigin: '50% 100%' }} width="260" height="220" viewBox="0 0 260 220">
        <ellipse cx="130" cy="120" rx="110" ry="80" fill="#ff9fb8" /><ellipse cx="236" cy="118" rx="26" ry="22" fill="#ff86a3" /><circle cx="230" cy="114" r="5" fill="#a83a5a" /><circle cx="242" cy="122" r="5" fill="#a83a5a" />
        <path d="M150 52 L176 24 L184 60 Z" fill="#ff86a3" /><circle cx="196" cy="96" r="8" fill="#2a1a24" /><rect x="96" y="44" width="56" height="10" rx="5" fill="#a83a5a" />
        {[50, 90, 160, 200].map((lx) => <rect key={lx} x={lx - 12} y="180" width="24" height="34" rx="8" fill="#ff86a3" />)}
      </svg>
      {[0, 1, 2].map((k) => { const u = clamp((t - at - k * 0.22) / 0.35); return u > 0 && u < 1 ? <div key={k} style={{ position: 'absolute', left: 175, top: lerp(-40, 120, EASE.in(u)), width: 46, height: 46, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff1a8, #f2b630 60%, #b07a10)', border: '3px solid #b07a10' }} /> : null; })}
    </>
  );
};
const RainCloud: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const s = ramp(t, at, 0.5, EASE.back);
  const r = rng(7);
  return (
    <div style={{ position: 'absolute', left: x - 220, top: y, width: 440, height: 600, transform: `scale(${s})`, transformOrigin: '50% 0', opacity: clamp(s * 1.5) }}>
      {Array.from({ length: 26 }, (_, i) => { const dx = 40 + r() * 360, sp = 700 + r() * 300, dy = ((t * sp + r() * 600) % 600); return <div key={i} style={{ position: 'absolute', left: dx, top: 70 + dy, width: 4, height: 30, borderRadius: 2, background: 'rgba(150,190,255,.75)' }} />; })}
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width="440" height="160" viewBox="0 0 440 160">
        <g fill="#5a6274"><circle cx="110" cy="90" r="62" /><circle cx="200" cy="64" r="78" /><circle cx="300" cy="84" r="66" /><rect x="70" y="90" width="300" height="60" rx="30" /></g>
        <g fill="#6c7488"><circle cx="190" cy="54" r="50" /><circle cx="290" cy="74" r="40" /></g>
      </svg>
    </div>
  );
};
const Padlock: React.FC<{ x: number; y: number; at: number; open: number; color: string; children: React.ReactNode; label: string }> = ({ x, y, at, open, color, children, label }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (f / fps < at - 0.02) return null;
  const s = springAt(f, fps, at, { damping: 11, stiffness: 190 });
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: clamp(s * 1.5), textAlign: 'center' }}>
      <svg width="360" height="420" viewBox="0 0 360 420" style={{ overflow: 'visible' }}>
        <g transform={`translate(${open * 60} ${-open * 50}) rotate(${open * 25} 270 170)`}><path d="M90 180 V110 a90 90 0 0 1 180 0 V180" fill="none" stroke="#aab2c2" strokeWidth="34" strokeLinecap="round" /></g>
        <rect x="30" y="170" width="300" height="240" rx="40" fill={color} />
        <rect x="30" y="170" width="300" height="60" rx="30" fill="rgba(255,255,255,.18)" />
      </svg>
      <div style={{ position: 'absolute', left: 30, top: 170, width: 300, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      <div style={{ marginTop: 18, fontFamily: fonts.head, fontWeight: 900, fontSize: 46, color, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
};

export const S5Hurt: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;

  // ---------------------------------------------------------------- rainy room + memory polaroids
  if (inWin(t, W.hurt)) {
    const memo = ramp(t, tSave - 0.4, 0.5) * (1 - ramp(t, tPaying, 0.6));
    const fansOn = FANS.filter((x) => t > x).length;
    const push = 1 + ramp(t, tPaying, 2.2, EASE.inOut) * 0.12;
    const redFlick = 0.85 + 0.15 * Math.sin(t * 9);
    return (
      <AbsoluteFill style={{ background: '#05070c' }}>
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 60%', filter: `brightness(${1 - 0.55 * memo}) blur(${memo * 4}px) saturate(0.8)` }}>
          <GamerRoom rain={1} rgb={0.25} screen={<AbsoluteFill style={{ background: `radial-gradient(circle, rgba(255,46,77,${0.5 * redFlick}), #2a0610 80%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, color: '#fff' }}><Icon name="ph:prohibit-bold" size={90} color="#fff" /><div style={{ fontWeight: 900, fontSize: 54 }}>VAN 152</div><div style={{ fontWeight: 700, fontSize: 26, opacity: 0.8 }}>HARDWARE BAN</div></AbsoluteFill>} />
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(20,40,90,.25), rgba(5,10,25,.45))' }} />
          <Chip x={1150} y={822} size={140} mood="sad" look={-1} lookY={-0.7} tears={ramp(t, tMistake - 0.3, 0.6)} seed={51} />
          <Leo x={330} y={1100} size={600} mood={t > tPaying ? 'cry' : 'sad'} look={0.6} seed={52} />
        </AbsoluteFill>
        <Polaroid x={470} y={430} at={tSave - 0.2} drop={tPaying} rot={-5} label="SAVE UP"><AbsoluteFill style={{ background: 'linear-gradient(180deg,#26355e,#141c34)' }} /><Piggy at={tSave} /></Polaroid>
        <Polaroid x={960} y={410} at={tHunt - 0.15} drop={tPaying + 0.08} rot={3} label="HUNT A DEAL">
          <AbsoluteFill style={{ background: 'linear-gradient(180deg,#2a2440,#141024)' }} />
          <div style={{ position: 'absolute', left: 100, top: 20, width: 180, height: 320, borderRadius: 26, background: '#0a0c14', boxShadow: 'inset 0 0 0 6px #2a2f3d' }}>
            <div style={{ position: 'absolute', inset: 14, borderRadius: 16, background: '#f3f4f8', padding: 12, fontFamily: fonts.head, color: '#1a1d2a', textAlign: 'center' }}>
              <div style={{ height: 110, borderRadius: 10, background: '#dfe4ee', position: 'relative' }}><Chip x={76} y={104} size={90} mood="happy" seed={53} /></div>
              <div style={{ fontWeight: 900, fontSize: 18, marginTop: 10 }}>RYZEN 7</div>
              <div style={{ fontWeight: 900, fontSize: 30, color: C.green }}>€180</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', background: C.amber, borderRadius: 8, padding: '3px 0', marginTop: 4 }}>GREAT DEAL</div>
            </div>
          </div>
          {t > tHunt + 0.4 && <div style={{ position: 'absolute', left: 270, top: 40, transform: `scale(${springAt(f, fps, tHunt + 0.4, { damping: 8, stiffness: 260 })})` }}><Icon name="ph:heart-fill" size={80} color={C.red} /></div>}
        </Polaroid>
        <Polaroid x={1450} y={440} at={tBuild - 0.15} drop={tPaying + 0.16} rot={-3} label="BUILD IT">
          <AbsoluteFill style={{ background: 'linear-gradient(180deg,#1c2a44,#0d1424)' }} />
          <div style={{ position: 'absolute', left: 105, top: 30, width: 170, height: 280, borderRadius: 14, background: 'linear-gradient(160deg,#1a1f2c,#0c0f17)', boxShadow: 'inset 0 0 0 4px #2a3042' }}>
            {[0, 1, 2].map((k) => { const on = k < fansOn; const hue = 190 + k * 60; return <div key={k} style={{ position: 'absolute', left: 45, top: 20 + k * 84, width: 76, height: 76, borderRadius: '50%', border: `6px solid ${on ? `hsl(${hue},90%,62%)` : '#2a3042'}`, boxShadow: on ? `0 0 26px hsl(${hue},90%,62%)` : 'none' }} />; })}
          </div>
        </Polaroid>
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- the system worked… on the wrong guy
  if (inWin(t, W.system)) {
    const wrong = t > tWrong - 0.05;
    const g = wrong && t < tWrong + 0.3;
    return (
      <AbsoluteFill style={{ background: '#05070c' }}>
        <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 1020px 0, 900px 1080px, 0 1080px)', background: 'radial-gradient(ellipse at 40% 30%, #1d3a2c, #08120e 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(1020px 0, 1920px 0, 1920px 1080px, 900px 1080px)', background: 'linear-gradient(180deg,#1a2238,#0b1020)' }} />
        <svg style={{ position: 'absolute', left: 0, top: 0 }} width="1920" height="1080"><line x1="1020" y1="0" x2="900" y2="1080" stroke="#ffd23a" strokeWidth="10" /></svg>
        <Bouncer x={470} y={1120} size={600} glasses={1} thumbs lean={-4} seed={54} />
        <div style={{ position: 'absolute', left: 470, top: 190, transform: `translate(-50%,-50%) translateX(${g ? Math.sin(t * 80) * 10 : 0}px) scale(${springAt(f, fps, tSystem, { damping: 10, stiffness: 200 })}) rotate(-3deg)`, padding: '16px 34px', borderRadius: 18, background: wrong ? C.amber : C.green, color: '#06120c', fontFamily: fonts.head, fontWeight: 900, fontSize: 54, whiteSpace: 'nowrap', boxShadow: `0 0 50px ${wrong ? C.amber : C.green}88`, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name={wrong ? 'ph:warning-bold' : 'ph:check-circle-fill'} size={56} color="#06120c" />{wrong ? 'SYSTEM WORKING…?' : 'SYSTEM WORKING'}
        </div>
        <Leo x={1430} y={1120} size={580} mood="sad" look={-0.5} seed={55} />
        <RainCloud x={1430} y={110} at={tWorst + 0.1} />
        {wrong && <>
          <div style={{ position: 'absolute', left: 1080, top: 560, transform: `scale(${springAt(f, fps, tWrong - 0.05, { damping: 9, stiffness: 240 })})` }}><Icon name="ph:arrow-fat-right-fill" size={150} color={C.red} /></div>
          <Stamp x={1180} y={480} at={tWrong - 0.03} text="WRONG PERSON" size={58} rot={-8} />
        </>}
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- BAN STATUS: ???
  if (inWin(t, W.check)) {
    const scan = ramp(t, tCheck - 0.1, 0.4);
    const mx = 560 + Math.sin((t - tCheck) * 2.6) * 110 * scan, my = 420 + Math.cos((t - tCheck) * 3.4) * 50 * scan;
    const rows: [string, number, boolean][] = [['CONDITION', tNoWay + 0.3, true], ['PRICE', tNoWay + 0.55, true], ['PINS', tNoWay + 0.8, true], ['BAN STATUS', tBan, false]];
    return (
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 30%, #1d2846, #090d1a 70%)' }}>
        <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)', backgroundSize: '80px 80px' }} />
        <div style={{ position: 'absolute', left: 560, top: 470, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tNoWay - 0.15, { damping: 13, stiffness: 170 })})`, width: 600, borderRadius: 28, background: '#f3f4f8', boxShadow: '0 40px 90px rgba(0,0,0,.55)', overflow: 'hidden', fontFamily: fonts.head, color: '#1a1d2a' }}>
          <div style={{ position: 'relative', height: 360, background: 'linear-gradient(180deg,#dfe4ee,#c9d0de)' }}><Chip x={300} y={340} size={260} mood="happy" seed={56} /></div>
          <div style={{ padding: '20px 30px 26px' }}>
            <div style={{ fontWeight: 900, fontSize: 36 }}>USED RYZEN 7 5800X3D</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}><span style={{ fontWeight: 900, fontSize: 48, color: C.green }}>€180</span><span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 24, color: '#5a6274' }}>"works perfectly" ★★★★★</span></div>
          </div>
        </div>
        {t > tCheck - 0.15 && <div style={{ position: 'absolute', left: mx, top: my, transform: `translate(-50%,-50%) scale(${scan})` }}>
          <div style={{ width: 230, height: 230, borderRadius: '50%', border: '16px solid #2a3042', background: 'rgba(160,220,255,.18)', boxShadow: '0 0 40px rgba(51,225,255,.35), inset 0 0 30px rgba(255,255,255,.3)' }} />
          <div style={{ position: 'absolute', left: 190, top: 190, width: 40, height: 150, borderRadius: 20, background: '#2a3042', transform: 'rotate(-45deg)', transformOrigin: '50% 0' }} />
        </div>}
        <div style={{ position: 'absolute', left: 1360, top: 440, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tNoWay + 0.1, { damping: 13, stiffness: 170 })})`, width: 640, padding: 34, borderRadius: 28, background: 'linear-gradient(160deg,#18213a,#0e1426)', border: '3px solid rgba(255,255,255,.12)', boxShadow: '0 30px 80px rgba(0,0,0,.5)', fontFamily: fonts.head, color: C.ink }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: C.cyan, letterSpacing: '0.1em', marginBottom: 14 }}>BEFORE YOU BUY · CHECK</div>
          {rows.map(([lb, at, ok]) => t > at - 0.05 && <div key={lb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '2px solid rgba(255,255,255,.08)', transform: `translateX(${(1 - ramp(t, at - 0.05, 0.3)) * 40}px)`, opacity: ramp(t, at - 0.05, 0.2) }}>
            <span style={{ fontWeight: 800, fontSize: 40 }}>{lb}</span>
            {ok ? <Icon name="ph:check-circle-fill" size={50} color={C.green} /> : <span style={{ fontWeight: 900, fontSize: 56, color: C.amber, opacity: 0.6 + 0.4 * Math.abs(Math.sin(t * 6)), letterSpacing: '0.1em' }}>???</span>}
          </div>)}
        </div>
        {t > tBuy - 0.05 && <Stamp x={960} y={760} at={tBuy - 0.02} text="NO WAY TO CHECK" size={76} rot={-5} />}
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- the 4-step checklist
  if (inWin(t, W.tips)) {
    const active = TIPS.filter((x) => t > x.at - 0.1).length - 1;
    return (
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 25% 40%, #123a3a, #07101a 70%)' }}>
        <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)', backgroundSize: '80px 80px' }} />
        <div style={{ position: 'absolute', left: 460, top: 230, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tProtect - 0.1, { damping: 10, stiffness: 200 })})`, textAlign: 'center', fontFamily: fonts.head }}>
          <Icon name="ph:shield-check-fill" size={150} color={C.green} glow />
          <div style={{ fontWeight: 900, fontSize: 60, lineHeight: 1.05, color: C.ink, marginTop: 6 }}>HOW TO<br />PROTECT YOURSELF</div>
        </div>
        <Chip x={460} y={860} size={300} mood={active >= 3 && t > TIPS[3].tick ? 'proud' : 'happy'} arms="point" look={1} seed={57} squash={0.25 * Math.exp(-Math.max(0, t - TIPS[Math.max(0, active)].at) * 6)} />
        {TIPS.map((x, k) => {
          if (t < x.at - 0.1) return null;
          const s = springAt(f, fps, x.at - 0.08, { damping: 12, stiffness: 190 });
          const done = t > x.tick, cur = k === active && !done;
          const cx = 1210 + (k % 2) * 440, cy = 360 + Math.floor(k / 2) * 330;
          return (
            <div key={k} style={{ position: 'absolute', left: cx, top: cy, width: 400, height: 290, transform: `translate(-50%,-50%) translateY(${(1 - s) * 60}px) scale(${(0.85 + 0.15 * s) * (cur ? 1.04 : 1)})`, opacity: clamp(s * 1.6), borderRadius: 26, background: 'linear-gradient(160deg,#18233a,#0d1424)', border: `4px solid ${done ? C.green : cur ? C.cyan : 'rgba(255,255,255,.12)'}`, boxShadow: cur ? `0 0 50px ${C.cyan}55` : '0 24px 60px rgba(0,0,0,.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: fonts.head, textAlign: 'center' }}>
              <div style={{ position: 'absolute', left: 18, top: 14, fontWeight: 900, fontSize: 34, color: C.dim }}>{k + 1}</div>
              <Icon name={x.icon} size={90} color={done ? C.green : C.ink} />
              <div style={{ fontWeight: 800, fontSize: 28, color: C.ink, lineHeight: 1.15 }}>{x.a}<br /><span style={{ color: C.cyan, fontWeight: 900 }}>{x.b}</span></div>
              {k === 3 && t > tRiotSays && <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 20, color: C.dim }}>Riot tells you how long is left</div>}
              {done && <div style={{ position: 'absolute', right: -20, top: -20, width: 70, height: 70, borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${springAt(f, fps, x.tick, { damping: 8, stiffness: 260 })})` }}><Icon name="ph:check-bold" size={44} color="#06120c" /></div>}
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }

  // ---------------------------------------------------------------- two padlocks: temporary vs forever
  const left = clamp(1 - (t - tTemp) / 1.05);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 35%, #1d2238, #080a14 70%)' }}>
      <Padlock x={520} y={430} at={tSome - 0.1} open={ramp(t, tTemp + 1.05, 0.4, EASE.back)} color={C.cyan} label="TEMPORARY">
        <div style={{ position: 'relative', width: 170, height: 170 }}><svg width="170" height="170" viewBox="0 0 170 170"><circle cx="85" cy="85" r="70" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="16" /><circle cx="85" cy="85" r="70" fill="none" stroke="#06202a" strokeWidth="16" strokeDasharray={`${440 * left} 440`} transform="rotate(-90 85 85)" strokeLinecap="round" /></svg><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:timer-bold" size={70} color="#06202a" /></div></div>
      </Padlock>
      {t > tDont - 0.1 && <Padlock x={1400} y={430} at={tDont - 0.08} open={0} color={C.red} label="PERMANENT">
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 170, color: '#2a0610', lineHeight: 1 }}>∞</div>
      </Padlock>}
      <Chip x={960} y={880} size={230} mood={t > tDont ? 'scared' : 'sus'} look={t > tDont ? 1 : -1} sweat={t > tDont ? 1 : 0} seed={58} />
      {t > tTemp + 1.05 && <Burst x={520} y={330} at={tTemp + 1.05} color={C.cyan} size={220} />}
    </AbsoluteFill>
  );
};
