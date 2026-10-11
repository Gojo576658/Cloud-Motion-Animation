// Cursed CPU Short · beats 5–9: Leo in the rain, Chip's like/subscribe plea from his cell,
// the secret key that always comes back, "max 4 months" → PLOT TWIST, and the loop ending.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Flash } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { KTL, C0, C1, P, PE } from './ktime';
import { Chip, Leo } from '../cpu/chars';
import { Stamp, Bubble, Burst, Cell } from '../cpu/fx';
import { K, VBg, BigText } from './BeatsA';

export const END = KTL.duration;
const useTF = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const wordAt = (c: number, i: number) => KTL.words.filter((w) => w.c === c)[i].s;
// a 1920×1080 stage (cell, rooms) framed inside the vertical canvas
const Stage: React.FC<{ cx: number; cy: number; s: number; y?: number; children: React.ReactNode }> = ({ cx, cy, s, y = 860, children }) => (
  <div style={{ position: 'absolute', left: 540 - cx * s, top: y - cy * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0', overflow: 'hidden' }}>{children}</div>
);
const Rain: React.FC<{ amt: number }> = ({ amt }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const r = rng(21);
  return <AbsoluteFill style={{ opacity: amt, pointerEvents: 'none' }}>{Array.from({ length: 70 }, (_, i) => { const x = r() * 1180 - 50, sp = 1300 + r() * 700, y = ((t * sp + r() * 2000) % 2100) - 100; return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 3, height: 46, borderRadius: 2, background: 'rgba(170,200,255,.45)', transform: 'rotate(10deg)' }} />; })}</AbsoluteFill>;
};

// ---------------------------------------------------------------- 5 · he did everything right
const tSaved = P(8, 'saved up'), tRight = P(8, 'did everything'), tPaid = P(8, 'paid'), tMistake = P(8, 'mistake');
export const sfx5: SfxEvent[] = [
  { t: K[5] + 0.05, name: 'crowdSad', vol: 0.3, dur: 1.6, note: 'awww' },
  { t: tSaved, name: 'popUi', vol: 0.3 }, { t: tRight, name: 'popUi', vol: 0.3 }, { t: tMistake - 0.05, name: 'failPiano', vol: 0.3 },
];
export const Beat5: React.FC = () => {
  const { f, fps, t } = useTF();
  const lost = t > tPaid - 0.05;
  const row = (y: number, at: number, text: string, good: boolean) => t > at - 0.05 && (
    <div style={{ position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) scale(${springAt(f, fps, at - 0.05, { damping: 12, stiffness: 200 })})`, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px', borderRadius: 18, background: 'rgba(8,12,24,.82)', border: `4px solid ${good ? (lost ? '#4a5266' : C.green) : C.red}`, fontFamily: fonts.head, fontWeight: 900, fontSize: 46, color: good ? (lost ? '#7a8296' : C.ink) : C.red, whiteSpace: 'nowrap' }}>
      <Icon name={good ? 'ph:check-circle-fill' : 'ph:x-circle-fill'} size={50} color={good ? (lost ? '#7a8296' : C.green) : C.red} />{text}
    </div>
  );
  return (
    <AbsoluteFill style={{ filter: `saturate(${1 - 0.45 * ramp(t, tPaid, 1)})` }}>
      <VBg top="#1a2442" bot="#070a16" grid={false} />
      {/* window with rain */}
      <div style={{ position: 'absolute', left: 620, top: 520, width: 360, height: 300, borderRadius: 8, background: 'linear-gradient(180deg,#0e2250,#091634)', boxShadow: 'inset 0 0 0 10px #070b18' }}><div style={{ position: 'absolute', left: 175, top: 0, width: 10, height: '100%', background: '#070b18' }} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 930, height: 36, background: 'linear-gradient(180deg,#2a2f3d,#151924)' }} />
      <Chip x={820} y={935} size={170} mood="sad" look={-1} lookY={-0.6} tears={ramp(t, tMistake - 0.4, 0.6)} seed={81} />
      <Leo x={400} y={1420} size={640} mood={lost ? 'cry' : 'sad'} look={0.4} seed={82} />
      <Rain amt={0.9} />
      {row(230, tSaved, 'SAVED UP', true)}
      {row(350, tRight, 'DID EVERYTHING RIGHT', true)}
      {lost && <div style={{ position: 'absolute', left: 540, top: 500, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tPaid - 0.05, { damping: 12, stiffness: 200 })}) rotate(-2deg)`, textAlign: 'center', padding: '16px 30px', borderRadius: 18, background: C.red, fontFamily: fonts.head, fontWeight: 900, fontSize: 46, color: '#fff', lineHeight: 1.1, boxShadow: '0 20px 50px rgba(0,0,0,.5)' }}>PAID FOR SOMEONE<br />ELSE'S MISTAKE</div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6 · Chip's plea: like + subscribe
const tHey = C0(9), tLikeW = P(9, 'like'), tOff = P(9, 'one day off'), tSub = P(9, 'subscribe'), tLonely = P(9, 'lonely');
export const sfx6: SfxEvent[] = [
  { t: K[6] + 0.05, name: 'jailLock', vol: 0.5, note: 'cell' }, { t: tHey + 0.1, name: 'squeak', vol: 0.3, note: 'Chip grips the bars' },
  { t: tLikeW, name: 'sillyPop', vol: 0.5, note: 'thumbs up' }, { t: tOff, name: 'tick', vol: 0.45, note: 'day off' },
  { t: tSub - 0.05, name: 'clickModern', vol: 0.5, note: 'subscribe' }, { t: tSub + 0.35, name: 'bell', vol: 0.45 },
  { t: tLonely, name: 'crowdSad', vol: 0.25, dur: 1.2, note: 'aww' },
];
export const Beat6: React.FC = () => {
  const { f, fps, t } = useTF();
  const days = t > tOff ? 124 : 125;
  const flip = ramp(t, tOff, 0.25, EASE.back);
  const thumb = t > tLikeW ? springAt(f, fps, tLikeW, { damping: 8, stiffness: 220 }) : 0;
  const subbed = t > tSub;
  const lonely = t > tLonely - 0.05;
  return (
    <AbsoluteFill style={{ background: '#1a1d25' }}>
      <Stage cx={870} cy={560} s={1.6} y={900}>
        <Cell tally={0} bars={1}>
          <div style={{ position: 'absolute', left: 870 - 150, top: 700 - 330, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,230,160,.18), transparent 70%)' }} />
          <Chip x={870} y={700} size={250} mood={lonely ? 'sad' : t > tLikeW ? 'happy' : 'neutral'} blush={lonely ? 1 : 0} arms="up" look={0} lookY={lonely ? -0.4 : 0} seed={83} />
        </Cell>
      </Stage>
      {/* sentence counter */}
      <div style={{ position: 'absolute', left: 540, top: 190, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 18, padding: '14px 34px', borderRadius: 20, background: '#0b0d14', border: `4px solid ${C.amber}`, fontFamily: fonts.head, fontWeight: 900, fontSize: 52, color: C.ink, whiteSpace: 'nowrap', boxShadow: '0 20px 50px rgba(0,0,0,.5)' }}>
        SENTENCE: <span style={{ display: 'inline-block', color: C.amber, transform: `scale(${1 + 0.35 * (1 - flip) * (t > tOff ? 1 : 0)})` }}>{days}</span> DAYS
      </div>
      {/* sign */}
      <div style={{ position: 'absolute', left: 540, top: 1195, transform: 'translate(-50%,-50%) rotate(-3deg)', padding: '10px 28px', background: '#fffbe6', border: '6px solid #3a4152', borderRadius: 12, fontFamily: fonts.head, fontWeight: 900, fontSize: 52, color: '#1d7a4c', whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,.5)' }}>1 LIKE = 1 DAY OFF</div>
      {/* thumbs up */}
      {thumb > 0 && <div style={{ position: 'absolute', left: 880, top: 520, transform: `translate(-50%,-50%) scale(${thumb}) rotate(${-12 + 12 * thumb}deg)` }}><div style={{ width: 210, height: 210, borderRadius: '50%', background: C.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${C.cyan}` }}><Icon name="ph:thumbs-up-fill" size={130} color="#06202a" /></div></div>}
      {thumb > 0 && <Burst x={880} y={520} at={tLikeW} color={C.cyan} size={300} />}
      {/* subscribe */}
      {t > tSub - 0.3 && <div style={{ position: 'absolute', left: 540, top: 360, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tSub - 0.3, { damping: 11, stiffness: 220 }) * (t > tSub - 0.05 && t < tSub + 0.1 ? 0.9 : 1)})`, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ padding: '18px 44px', borderRadius: 60, background: subbed ? '#3a4152' : C.red, color: '#fff', fontFamily: fonts.head, fontWeight: 900, fontSize: 50, whiteSpace: 'nowrap', boxShadow: subbed ? 'none' : `0 0 50px ${C.red}99` }}>{subbed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div>
        <div style={{ transform: `rotate(${t > tSub + 0.35 ? Math.sin((t - tSub) * 30) * 22 * Math.max(0, 1 - (t - tSub - 0.35) * 1.3) : 0}deg)`, transformOrigin: '50% 10%' }}><Icon name={t > tSub + 0.35 ? 'ph:bell-ringing-fill' : 'ph:bell-bold'} size={80} color={t > tSub + 0.35 ? C.amber : C.ink} /></div>
      </div>}
      {lonely && <div style={{ position: 'absolute', left: 230, top: 470 + ramp(t, tLonely - 0.05, 0.6, EASE.out) * 160 }}><div style={{ position: 'absolute', left: 14, top: -800, width: 2, height: 800, background: 'rgba(255,255,255,.5)' }} /><svg width="30" height="26" viewBox="0 0 30 26"><ellipse cx="15" cy="14" rx="8" ry="7" fill="#111" />{[-1, 1].map((d) => [0, 1, 2].map((k) => <path key={`${d}${k}`} d={`M${15 + d * 6} ${10 + k * 4} q ${d * 8} -4 ${d * 13} 2`} stroke="#111" strokeWidth="2" fill="none" />))}</svg></div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 7 · the secret key always comes back
const tHow = C0(10), tVault = P(10, 'tiny vault'), tKey = P(10, 'secret key'), tWin = P(11, 'New Windows'), tSame1 = wordAt(11, 2), tAcct = wordAt(11, 4), tSame2 = wordAt(11, 6);
export const sfx7: SfxEvent[] = [
  { t: tHow, name: 'scan', vol: 0.45, note: 'X-ray' }, { t: tVault - 0.05, name: 'lock', vol: 0.45 }, { t: tKey - 0.05, name: 'shimmer', vol: 0.45, note: 'key' },
  { t: tWin - 0.05, name: 'popUi', vol: 0.4, note: 'reinstall' }, { t: tWin + 0.1, name: 'whooshQuick', vol: 0.35, note: 'key flies out' }, { t: tSame1, name: 'boing', vol: 0.55, note: 'bonk back' },
  { t: tAcct - 0.05, name: 'popUi', vol: 0.4, note: 'new account' }, { t: tAcct + 0.1, name: 'whooshQuick', vol: 0.35 }, { t: tSame2, name: 'boing', vol: 0.6 }, { t: tSame2 + 0.3, name: 'alarm', vol: 0.25, dur: 0.6, note: 'MATCH' },
];
export const Beat7: React.FC = () => {
  const { f, fps, t } = useTF();
  const xr = ramp(t, tHow + 0.1, 0.4);
  const chipY = 1180, size = 560, cy = chipY - size * 0.55;
  const away = (a: number, b: number) => (t > a && t < b ? Math.sin(clamp((t - a) / (b - a)) * Math.PI) : 0);
  const out1 = away(tWin + 0.1, tSame1), out2 = away(tAcct + 0.1, tSame2);
  const keyY = cy - (out1 + out2) * 380, keyX = 540 + out1 * -260 + out2 * 260;
  const keyOn = ramp(t, tKey - 0.1, 0.3);
  const bonk = [tSame1, tSame2].reduce((m, x) => Math.max(m, t > x ? Math.exp(-(t - x) * 7) : 0), 0);
  const card = (x: number, at: number, icon: string, text: string) => t > at - 0.1 && (
    <div style={{ position: 'absolute', left: x, top: 300, transform: `translate(-50%,-50%) scale(${springAt(f, fps, at - 0.08, { damping: 12, stiffness: 200 })})`, width: 420, padding: '20px 10px', borderRadius: 24, background: 'linear-gradient(160deg,#18213a,#0e1426)', border: '4px solid rgba(255,255,255,.14)', textAlign: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: C.ink }}>
      <Icon name={icon} size={90} color={C.cyan} /><div>{text}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <VBg top="#16304a" bot="#060c18" />
      {card(290, tWin, 'ph:windows-logo-fill', 'NEW WINDOWS')}
      {card(790, tAcct, 'ph:user-plus-bold', 'NEW ACCOUNT')}
      <Chip x={540} y={chipY} size={size} mood={t > tSame2 ? 'shock' : t > tWin ? 'sus' : 'neutral'} xray={xr} squash={bonk * 0.3} seed={84} />
      {keyOn > 0 && <div style={{ position: 'absolute', left: keyX, top: keyY, transform: `translate(-50%,-50%) scale(${keyOn * (1 + bonk * 0.3)}) rotate(${(out1 - out2) * 40}deg)`, filter: `drop-shadow(0 0 30px ${C.amber})` }}><Icon name="ph:key-fill" size={130} color={C.amber} /></div>}
      {t > tKey && t < tWin && <div style={{ position: 'absolute', left: 540, top: 1240, transform: 'translate(-50%,-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 48, color: C.amber, whiteSpace: 'nowrap' }}>SECRET KEY</div>}
      {t > tSame1 && <Stamp x={290} y={470} at={tSame1} text="SAME KEY" size={56} rot={-8} color={C.amber} />}
      {t > tSame2 && <Stamp x={790} y={470} at={tSame2} text="SAME KEY" size={56} rot={7} color={C.amber} />}
      {t > tSame2 + 0.3 && <BigText y={620} at={tSame2 + 0.3} size={90} color={C.red} rot={-3}>MATCH ✗</BigText>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 8 · max 4 months… PLOT TWIST
const tGood = C0(12), tFour = P(12, 'four months'), tMax = P(12, 'max'), tTwist = C0(13), tFully = P(13, 'fully buy'), tStory = P(13, "Leo's story");
const FLIPS = [0, 1, 2, 3].map((k) => lerp(tGood + 0.6, tMax, k / 3));
const MONTHS = ['AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const sfx8: SfxEvent[] = [
  ...FLIPS.map((x) => ({ t: x, name: 'pageTurn' as const, vol: 0.4 })), { t: tFour, name: 'stomp', vol: 0.45, note: 'MAX 4 MONTHS' }, { t: tMax + 0.1, name: 'success', vol: 0.45, note: 'Chip cheers' },
  { t: tTwist - 0.12, name: 'scratch', vol: 0.5 }, { t: tTwist - 0.05, name: 'spinWhistle', vol: 0.45, note: 'PLOT TWIST spin' }, { t: tTwist + 0.4, name: 'impactZoom', vol: 0.45 },
  { t: tFully, name: 'suspenseCartoon', vol: 0.4, note: 'Leo side-eye' },
];
export const Beat8: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tTwist - 0.1) {
    const flip = FLIPS.filter((x) => t > x).length;
    const page = flip ? ramp(t, FLIPS[flip - 1], 0.18) : 1;
    const dec = flip >= 4;
    return (
      <AbsoluteFill>
        <VBg top="#123a3a" bot="#06101a" />
        <div style={{ position: 'absolute', left: 540, top: 470, transform: 'translate(-50%,-50%) rotate(-2deg)', width: 560, height: 560, borderRadius: 26, background: '#f4efe2', boxShadow: '0 40px 90px rgba(0,0,0,.5)', overflow: 'hidden' }}>
          <div style={{ height: 130, background: dec ? C.green : C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 96, color: '#fff' }}>{MONTHS[flip]}</div>
          <div style={{ transformOrigin: '50% 0', transform: `perspective(800px) rotateX(${(1 - page) * -80}deg)`, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, padding: 24 }}>
            {Array.from({ length: 20 }, (_, k) => <div key={k} style={{ height: 70, borderRadius: 10, background: '#e2dccb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 800, fontSize: 32, color: '#6b6250', position: 'relative' }}>{k + 1}{dec && k === 14 && <div style={{ position: 'absolute', inset: -6, border: `6px solid ${C.green}`, borderRadius: '50%' }} />}</div>)}
          </div>
        </div>
        {t > tFour && <Stamp x={540} y={800} at={tFour} text="MAX 4 MONTHS" size={84} rot={-6} color={C.amber} />}
        <Chip x={540} y={1250} size={330} mood={dec ? 'proud' : 'happy'} arms={t > tMax ? 'up' : 'none'} squash={t > tMax ? 0.35 * Math.abs(Math.sin((t - tMax) * 9)) * Math.exp(-(t - tMax) * 2) : 0} seed={85} />
        {t > tMax && <Burst x={540} y={1050} at={tMax + 0.05} color={C.green} size={360} />}
      </AbsoluteFill>
    );
  }
  const spin = ramp(t, tTwist - 0.1, 0.6, EASE.out);
  const sideIn = ramp(t, tFully - 0.2, 0.4, EASE.back);
  return (
    <AbsoluteFill style={{ background: '#0b0d14', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `rotate(${t * 40}deg) scale(2.6)`, background: 'repeating-conic-gradient(from 0deg at 50% 50%, #ffd23a 0 10deg, #ff9f1c 10deg 20deg)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, transparent 25%, rgba(10,8,4,.75) 75%)' }} />
      <div style={{ position: 'absolute', left: 540, top: 420, transform: `translate(-50%,-50%) rotate(${(1 - spin) * 720 - 6}deg) scale(${spin})`, padding: '30px 50px', background: '#0b0d14', border: '10px solid #fff', borderRadius: 26, fontFamily: fonts.head, fontWeight: 900, fontSize: 130, lineHeight: 1, color: '#fff', textAlign: 'center' }}>PLOT<br />TWIST</div>
      {t > tFully - 0.1 && <div style={{ position: 'absolute', left: 540, top: 770, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tFully - 0.1, { damping: 12, stiffness: 200 })})`, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px', borderRadius: 18, background: C.red, fontFamily: fonts.head, fontWeight: 900, fontSize: 44, color: '#fff', whiteSpace: 'nowrap' }}><Icon name="ph:shield-check-fill" size={50} color="#fff" />RIOT: "PRETTY UNLIKELY"</div>}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - sideIn) * 700}px)` }}><Leo x={540} y={1420} size={600} mood={t > tStory ? 'sideeye' : 'shock'} look={1} seed={86} /></div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 9 · full story → loop
const tFull = P(14, 'full story'), tChannel = P(14, 'channel'), tRemember = P(14, 'So remember');
export const sfx9: SfxEvent[] = [
  { t: tFull - 0.05, name: 'popUi', vol: 0.45, note: 'video card' }, { t: tChannel, name: 'sparkle', vol: 0.35 }, { t: tChannel + 0.4, name: 'rimshot', vol: 0.4 },
  { t: tRemember, name: 'siren', vol: 0.25, dur: 1.4, note: 'back to the mugshot (loop)' },
];
export const Beat9: React.FC = () => {
  const { f, fps, t } = useTF();
  const s = springAt(f, fps, tFull - 0.1, { damping: 12, stiffness: 180 });
  const bob = Math.sin(t * 9) * 16;
  const siren = t > tRemember ? (Math.sin(t * 9) > 0 ? 'rgba(255,40,60,.4)' : 'rgba(40,110,255,.4)') : 'transparent';
  return (
    <AbsoluteFill>
      <VBg top="#1c2a4e" bot="#070b18" />
      <div style={{ position: 'absolute', left: 540, top: 470, transform: `translate(-50%,-50%) scale(${s}) rotate(-2deg)`, width: 860, borderRadius: 26, overflow: 'hidden', background: '#0e1426', border: '4px solid rgba(255,255,255,.16)', boxShadow: '0 40px 90px rgba(0,0,0,.55)' }}>
        <div style={{ position: 'relative', height: 484, background: 'radial-gradient(ellipse at 75% 50%, #5a1020, #0b1430 70%)' }}>
          <div style={{ position: 'absolute', left: 40, top: 90, fontFamily: fonts.head, fontWeight: 900, fontSize: 104, lineHeight: 0.95, color: '#ffd23a', textShadow: '6px 6px 0 #000' }}>€180<br /><span style={{ color: '#fff' }}>MISTAKE</span></div>
          <div style={{ position: 'absolute', left: 610, top: 230, width: 220, height: 180, background: 'linear-gradient(180deg,#c8a070,#a07a4a)', borderRadius: 10 }} />
          <Chip x={720} y={380} size={190} mood="sad" seed={87} look={-0.4} />
          <div style={{ position: 'absolute', right: 16, bottom: 14, padding: '2px 10px', borderRadius: 6, background: 'rgba(0,0,0,.8)', fontFamily: fonts.head, fontWeight: 800, fontSize: 26, color: '#fff' }}>5:24</div>
        </div>
        <div style={{ padding: '18px 26px', fontFamily: fonts.head, fontWeight: 800, fontSize: 36, color: C.ink, lineHeight: 1.15 }}>Valorant Banned His Used CPU (He Never Cheated)</div>
      </div>
      <div style={{ position: 'absolute', left: 540, top: 900 + bob, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: C.amber, whiteSpace: 'nowrap', opacity: ramp(t, tChannel - 0.2, 0.3) }}>FULL STORY<Icon name="ph:arrow-fat-down-fill" size={110} color={C.amber} /></div>
      <Chip x={880} y={1240} size={260} mood="wink" arms="point" seed={88} look={-1} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${Math.sin(t * 9) > 0 ? '0%' : '100%'} 30%, ${siren}, transparent 55%)`, mixBlendMode: 'screen' }} />
      <Flash at={END - 0.12} d={0.12} max={0.9} />
    </AbsoluteFill>
  );
};
