// Acts 6–8: he's not alone (the Newport landfill drive, "up to one in five" bitcoins lost), protect yourself
// (four tips, Stefan's own words at sunrise), and the outro (two-button question, landfill teaser, Chip and
// Ike's last lines, logo).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { C } from '../lib/theme';
import { fonts } from './type';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { TTL, C0, C1, P, PE } from './ttime';
import { useTF, P as COL, Ike, Vault, Person, Coin, Pop, Title, Mono } from './kit';
import { Stamp } from '../cpu/fx';
import { Chip } from '../cpu/chars';
import { Cell } from '../cpu/fx';

// ================================================================ ACT 6 · he's not alone
const tAlone = C0(56), tWales = C0(57), tThrew = P(57, 'threw away'), t8000 = P(57, 'eight thousand'), tBuried = P(57, "It's buried"), tYears = P(57, 'He spent'), tLost = P(57, 'he lost');
const tEst = C0(58), tFive = P(58, 'up to one in five'), tForgot = P(58, 'lost forever');
export const a6NoCaptions: [number, number][] = [];
export const a6Sfx: SfxEvent[] = [
  { t: tAlone, name: 'whooshDeep', vol: 0.4, note: 'pull back' }, { t: tWales - 0.1, name: 'swooshSlow', vol: 0.3 },
  { t: tThrew, name: 'paperSlide', vol: 0.3, note: 'drive tossed' }, { t: t8000, name: 'coins', vol: 0.35 }, { t: tBuried, name: 'whooshDeep', vol: 0.35, note: 'dig down' },
  { t: tYears, name: 'pagesFast', vol: 0.3 }, { t: tLost - 0.03, name: 'woodHit', vol: 0.75, note: 'gavel' }, { t: tLost + 0.3, name: 'sadTromboneSlow', vol: 0.25, dur: 1.6 },
  { t: tFive - 0.05, name: 'darkSweep', vol: 0.4, note: '1 in 5' }, { t: tFive + 0.6, name: 'fallWhistle', vol: 0.3 },
];
export const A6: React.FC = () => {
  const { f, fps, t } = useTF();
  const r = rng(61);
  if (t < tWales - 0.2) {
    const u = ramp(t, tAlone - 0.2, 1.6, EASE.inOut);
    return (
      <AbsoluteFill style={{ background: COL.ink }}>
        <AbsoluteFill style={{ transform: `scale(${lerp(1, 0.18, u)})` }}><Vault light={0.8} /><Ike x={960} y={812} size={480} count={8} eye="narrow" seed={61} /></AbsoluteFill>
        {Array.from({ length: 60 }, (_, i) => { const x = r() * 1920, y = r() * 1080, d = Math.hypot(x - 960, y - 540); return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 10, height: 10, borderRadius: 5, background: COL.red, boxShadow: `0 0 14px ${COL.red}`, opacity: clamp(u * 2 - d / 900) }} />; })}
      </AbsoluteFill>
    );
  }
  if (t < tEst - 0.2) {
    const dig = ramp(t, tBuried - 0.1, 1.4, EASE.inOut);
    return (
      <AbsoluteFill style={{ background: '#5a6470' }}>
        <AbsoluteFill style={{ transform: `translateY(${-dig * 520}px)` }}>
          <AbsoluteFill style={{ background: 'linear-gradient(180deg,#8a949e,#6a747e 60%)' }} />
          {/* trash hills */}
          <svg style={{ position: 'absolute', left: 0, top: 380 }} width="1920" height="1300"><path d="M0 220 Q300 60 620 180 Q900 40 1240 170 Q1600 30 1920 160 L1920 1300 L0 1300 Z" fill="#4a5240" /><path d="M0 320 Q400 200 800 300 Q1200 180 1920 290 L1920 1300 L0 1300 Z" fill="#3a4032" />{Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i * 211) % 1900} y={260 + ((i * 97) % 900)} width={20 + (i % 5) * 12} height={14 + (i % 3) * 10} fill={['#6a5a3a', '#4a6a7a', '#7a4a3a', '#5a5a5a'][i % 4]} opacity="0.7" transform={`rotate(${i * 23} ${(i * 211) % 1900} ${260 + ((i * 97) % 900)})`} />)}</svg>
          {/* the buried drive */}
          <div style={{ position: 'absolute', left: 1180, top: 1140, width: 120, height: 80, borderRadius: 8, background: 'linear-gradient(160deg,#c9d1dc,#7c8798)', boxShadow: `0 0 ${30 + 20 * Math.sin(t * 3)}px ${COL.gold}` }} />
          <Pop x={1240} y={1060} at={t8000}><div style={{ padding: '8px 20px', borderRadius: 12, background: 'rgba(7,11,22,.9)', border: `3px solid ${COL.gold}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, color: COL.gold, whiteSpace: 'nowrap' }}>~8,000 BTC</div></Pop>
          <Person kind="james" x={420} y={820} size={360} mood={t > tLost ? 'sad' : 'worried'} look={1} seed={62} />
          {/* seagulls */}
          {Array.from({ length: 6 }, (_, i) => { const x = ((t * (60 + i * 15) + i * 340) % 2200) - 140, y = 140 + (i % 3) * 70 + Math.sin(t * 2 + i) * 20, w = Math.sin(t * 10 + i) * 14; return <svg key={i} style={{ position: 'absolute', left: x, top: y }} width="70" height="40"><path d={`M0 20 Q18 ${8 + w} 35 20 Q52 ${8 + w} 70 20`} stroke="#e8ecf2" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>; })}
        </AbsoluteFill>
        {/* rain */}
        <AbsoluteFill>{Array.from({ length: 70 }, (_, i) => { const x = r() * 1960, sp = 900 + r() * 500, y = ((t * sp + r() * 1100) % 1160) - 60; return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 2, height: 34, background: 'rgba(220,230,240,.35)', transform: 'rotate(12deg)' }} />; })}</AbsoluteFill>
        <div style={{ position: 'absolute', left: 140, top: 96, padding: '8px 18px', borderRadius: 10, background: 'rgba(7,11,22,.75)' }}><Mono size={26} color={C.ink}>NEWPORT, WALES · 2013</Mono></div>
        {t > tLost - 0.05 && <Stamp x={1300} y={300} at={tLost - 0.03} text="CASE DISMISSED · 2025" size={64} rot={-6} />}
      </AbsoluteFill>
    );
  }
  // one in five
  const lost = ramp(t, tFive + 0.3, 0.8, EASE.in);
  const grid = ramp(t, tFive - 0.4, 0.8);
  return (
    <AbsoluteFill>
      <Vault light={0.35} pedestal={false} />
      {grid < 1 && <div style={{ opacity: 1 - grid }}>{[0, 1, 2, 3, 4].map((i) => <Coin key={i} x={560 + i * 200} y={460 + (i === 4 ? lost * lost * 700 : 0)} size={170} spin={i === 4 ? lost * 6 : 0} grey={i === 4 ? lost : 0} />)}</div>}
      {grid > 0 && <div style={{ position: 'absolute', left: 960, top: 470, transform: 'translate(-50%,-50%)', display: 'grid', gridTemplateColumns: 'repeat(20, 54px)', gap: 10, opacity: grid }}>{Array.from({ length: 100 }, (_, i) => { const gone = (i * 37) % 5 === 0; const fade = gone ? ramp(t, tForgot + (i % 20) * 0.04, 0.6) : 0; return <div key={i} style={{ width: 54, height: 54, borderRadius: '50%', background: gone && fade > 0.5 ? '#2a2f3d' : 'radial-gradient(circle at 35% 30%, #fff1b8, #f7b23b 50%, #b07a10)', opacity: 1 - fade * 0.7 }} />; })}</div>}
      <Pop x={960} y={150} at={tFive - 0.05}><div style={{ textAlign: 'center' }}><Title size={84} color={COL.gold}>UP TO 1 IN 5 BITCOINS</Title><div style={{ marginTop: 6 }}><Mono size={24} color={C.dim}>MAY BE LOST FOREVER · CHAINALYSIS ESTIMATE (2017)</Mono></div></div></Pop>
    </AbsoluteFill>
  );
};

// ================================================================ ACT 7 · protect yourself
const tHow = C0(59), tT1 = C0(60), tT2 = C0(61), tNotOne = P(61, 'Not one piece'), tT3 = C0(62), tT4 = C0(63), tStefan = C0(64), tDep = P(64, 'He said he was'), tForward = P(64, 'look forward');
const TIPS = [
  { at: tT1, icon: 'ph:key-fill', a: 'USE A', b: 'PASSWORD MANAGER' },
  { at: tT2, icon: 'ph:vault-bold', a: 'RECOVERY CODES IN', b: 'TWO SAFE PLACES' },
  { at: tT3, icon: 'ph:check-circle-bold', a: 'TEST YOUR', b: 'BACKUP' },
  { at: tT4, icon: 'ph:users-three-bold', a: 'SOMEONE YOU TRUST', b: 'KNOWS WHERE' },
];
export const a7NoCaptions: [number, number][] = [];
export const a7Sfx: SfxEvent[] = [
  { t: tHow - 0.1, name: 'levelUp', vol: 0.4, note: 'shield' },
  ...TIPS.flatMap((x) => [{ t: x.at - 0.05, name: 'popUi' as const, vol: 0.4 }, { t: x.at + 1.4, name: 'confirm' as const, vol: 0.4, note: 'tick' }]),
  { t: tNotOne, name: 'whooshQuick', vol: 0.3, note: 'paper blows away (callback)' },
  { t: tStefan - 0.2, name: 'swooshSlow', vol: 0.3, note: 'sunrise' }, { t: tForward, name: 'shimmer', vol: 0.3 },
];
export const A7: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tStefan - 0.3) {
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 30% 40%, #10323a, #050b12 72%)' }} />
        <Pop x={450} y={460} at={tHow - 0.1}><div style={{ textAlign: 'center' }}><Icon name="ph:shield-check-fill" size={180} color={COL.green} /><div style={{ marginTop: 10 }}><Title size={50}>DON'T LET YOUR<br />HARDWARE FORGET YOU</Title></div></div></Pop>
        {TIPS.map((x, k) => {
          if (t < x.at - 0.1) return null;
          const s = springAt(f, fps, x.at - 0.08, { damping: 15, stiffness: 180 });
          const done = t > x.at + 1.4;
          const cx = 1090 + (k % 2) * 455, cy = 330 + Math.floor(k / 2) * 340;
          return (
            <div key={k} style={{ position: 'absolute', left: cx, top: cy, width: 430, height: 290, transform: `translate(-50%,-50%) translateY(${(1 - s) * 50}px)`, opacity: clamp(s * 1.6), borderRadius: 24, background: 'linear-gradient(160deg,#122636,#0a1520)', border: `3px solid ${done ? COL.green : 'rgba(255,255,255,.12)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
              <div style={{ position: 'absolute', left: 18, top: 12, ...fonts.H, fontWeight: 900, fontSize: 34, color: C.dim }}>{k + 1}</div>
              <Icon name={x.icon} size={86} color={done ? COL.green : C.ink} />
              <div style={{ ...fonts.H, fontWeight: 800, fontSize: 28, color: C.ink, lineHeight: 1.15 }}>{x.a}<br /><span style={{ color: COL.cyan, fontWeight: 900 }}>{x.b}</span></div>
              {done && <div style={{ position: 'absolute', right: -18, top: -18, width: 64, height: 64, borderRadius: '50%', background: COL.green, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${springAt(f, fps, x.at + 1.4, { damping: 9, stiffness: 260 })})` }}><Icon name="ph:check-bold" size={40} color="#052014" /></div>}
            </div>
          );
        })}
        {t > tNotOne - 0.1 && t < tNotOne + 1.4 && <div style={{ position: 'absolute', left: lerp(1400, 2100, ramp(t, tNotOne, 1.2, EASE.in)), top: lerp(560, 200, ramp(t, tNotOne, 1.2)), width: 150, height: 110, background: '#fbf6e6', borderRadius: 4, transform: `rotate(${(t - tNotOne) * 300}deg)` }} />}
      </AbsoluteFill>
    );
  }
  // Stefan at sunrise
  const sun = ramp(t, tStefan - 0.3, 6, EASE.inOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${sun > 0.5 ? '#f7b26a' : '#3a3050'}, #2a1a24)` }} />
      <div style={{ position: 'absolute', left: 980, top: 140, width: 760, height: 560, borderRadius: 16, overflow: 'hidden', boxShadow: 'inset 0 0 0 16px #2a1e1a' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${lerp(0, 1, sun) > 0.4 ? '#ffcf8a' : '#5a4a7a'}, #ff9a5a)` }} />
        <div style={{ position: 'absolute', left: 300, top: lerp(520, 260, sun), width: 180, height: 180, borderRadius: '50%', background: '#fff3c8', boxShadow: '0 0 120px #ffd27a' }} />
        <div style={{ position: 'absolute', left: 372, top: 0, width: 16, height: '100%', background: '#2a1e1a' }} />
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(255,200,120,.25), transparent 60%)' }} />
      <Person kind="stefan" x={620} y={1120} size={560} mood={t > tForward ? 'smile' : t > tDep ? 'sad' : 'neutral'} look={1} seed={71} />
      <Pop x={600} y={240} at={tStefan + 0.4}><div style={{ maxWidth: 720, padding: '20px 30px', borderRadius: 16, background: 'rgba(20,12,10,.6)', fontFamily: fonts.body, fontWeight: 600, fontSize: 34, color: '#fff3e0', lineHeight: 1.3 }}>"A painful memory." He hopes others can learn from his mistakes.<div style={{ marginTop: 8 }}><Mono size={18} color="#d8b89a">STEFAN THOMAS, ON TWITTER (2021)</Mono></div></div></Pop>
    </AbsoluteFill>
  );
};

// ================================================================ ACT 8 · outro
const tQ = C0(65), tTwoG = P(65, 'Two guesses'), tWould = P(65, 'Would you'), tHand = P(65, 'or hand'), tTell = P(65, 'Tell me'), tNext = C0(66), tChip = C0(67), tIke = C0(68), tEnd = C1(68);
export const a8NoCaptions: [number, number][] = [[tEnd + 0.2, TTL.duration + 1]];
export const a8Sfx: SfxEvent[] = [
  { t: tTwoG, name: 'heartbeat', vol: 0.45 }, { t: tWould - 0.05, name: 'drumRoll', vol: 0.3, dur: 1.4 }, { t: tTell, name: 'clickModern', vol: 0.4, note: 'cursor' },
  { t: tNext - 0.1, name: 'whooshDeep', vol: 0.35, note: 'teaser' }, { t: tNext + 0.4, name: 'horrorBell', vol: 0.3 },
  { t: tChip - 0.1, name: 'jailLock', vol: 0.4, note: 'Chip cameo' }, { t: tChip + 0.2, name: 'sillyPop', vol: 0.35 },
  { t: tIke - 0.1, name: 'chime', vol: 0.3, note: 'Ike ting' }, { t: tEnd + 0.4, name: 'heartbeat', vol: 0.55, note: 'last beat' },
];
export const A8: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tNext - 0.2) {
    const hover = Math.sin((t - tWould) * 2.2);
    return (
      <AbsoluteFill>
        <Vault light={0.55} />
        <Ike x={960} y={812} size={360} count={8} eye="smug" seed={81} />
        {t > tWould - 0.1 && <>
          <Pop x={560} y={300} at={tWould - 0.05}><div style={{ padding: '26px 44px', borderRadius: 20, background: COL.red, ...fonts.H, fontWeight: 900, fontSize: 50, color: '#fff', boxShadow: `0 0 40px ${COL.red}88`, transform: `scale(${1 + Math.max(0, -hover) * 0.06})` }}>TRY IT MYSELF</div></Pop>
          <Pop x={1360} y={300} at={tHand - 0.05}><div style={{ padding: '26px 44px', borderRadius: 20, background: COL.cyan, ...fonts.H, fontWeight: 900, fontSize: 50, color: '#04121a', boxShadow: `0 0 40px ${COL.cyan}88`, transform: `scale(${1 + Math.max(0, hover) * 0.06})` }}>CALL THE HACKER</div></Pop>
          {t > tHand && <div style={{ position: 'absolute', left: 960 + hover * 380, top: 330, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))' }}><Icon name="ph:hand-pointing-fill" size={90} color="#fff" /></div>}
          {t > tTell && <Pop x={960} y={470} at={tTell}><Mono size={32} color={COL.steel2}>TELL ME IN THE COMMENTS ↓</Mono></Pop>}
        </>}
      </AbsoluteFill>
    );
  }
  if (t < tChip - 0.2) {
    // landfill teaser
    return (
      <AbsoluteFill style={{ background: '#3a424a' }}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#6a747e,#2a3036)' }} />
        <svg style={{ position: 'absolute', left: 0, top: 420 }} width="1920" height="700"><path d="M0 200 Q300 40 620 160 Q900 30 1240 150 Q1600 20 1920 140 L1920 700 L0 700 Z" fill="#2e3428" /></svg>
        <div style={{ position: 'absolute', left: 1100, top: 760, width: 70, height: 46, borderRadius: 6, background: 'linear-gradient(160deg,#c9d1dc,#7c8798)', boxShadow: `0 0 ${20 + 20 * Math.sin(t * 6)}px ${COL.gold}` }} />
        <Pop x={960} y={220} at={tNext + 0.1}><div style={{ textAlign: 'center' }}><Mono size={28} color={COL.amber}>NEXT TIME</Mono><Title size={86}>THE LANDFILL FORTUNE</Title></div></Pop>
      </AbsoluteFill>
    );
  }
  if (t < tIke - 0.15) {
    return (
      <AbsoluteFill>
        <Cell tally={14} bars={1}><Chip x={900} y={860} size={300} mood="sad" look={0.6} seed={82} /></Cell>
      </AbsoluteFill>
    );
  }
  // final: Ike, pull back, logo
  const pull = ramp(t, tIke, 2.6, EASE.inOut);
  const fade = ramp(t, tEnd + 0.3, 1.2, EASE.in);
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      <AbsoluteFill style={{ transform: `scale(${lerp(1.5, 1, pull)})`, transformOrigin: '50% 40%' }}>
        <Vault light={1 - fade * 0.6} />
        <Ike x={960} y={812} size={480} count={8} eye="narrow" glow={1 - fade * 0.8} talk={t < tEnd ? Math.abs(Math.sin(t * 16)) : 0} seed={83} />
      </AbsoluteFill>
      {t > tEnd + 0.4 && <div style={{ position: 'absolute', left: 960, top: 960, transform: 'translate(-50%,-50%)', opacity: ramp(t, tEnd + 0.4, 0.6), ...fonts.H, fontWeight: 900, fontSize: 64, color: C.ink, whiteSpace: 'nowrap' }}>Mechivio<span style={{ color: COL.cyan }}>Tech</span></div>}
    </AbsoluteFill>
  );
};
