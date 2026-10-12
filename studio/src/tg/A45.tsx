// Acts 4–5: the heist (Joe Grand opens Dan Reich's wallet with a perfectly timed power glitch) and the
// offer (Unciphered opens a test IronKey: chip carved out, epoxy dissolved, 200 trillion guesses, "It opened."
// → they call Stefan → "said no" → another team → still locked).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { C } from '../lib/theme';
import { fonts } from './type';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, PE, S1 } from './ttime';
import { useTF, P as COL, Ike, Vault, Person, Pop, Count, Title, Mono } from './kit';
import { Stamp, Burst } from '../cpu/fx';

const Neon: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 30%, #0e1f33, #04070d 75%)' }} />
    <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(51,225,255,.06) 2px, transparent 2px), linear-gradient(90deg, rgba(51,225,255,.06) 2px, transparent 2px)', backgroundSize: '80px 80px', transform: 'perspective(900px) rotateX(55deg) translateY(380px) scale(1.8)', transformOrigin: '50% 100%' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: `linear-gradient(90deg, transparent, ${COL.cyan}, #ff4fd8, transparent)`, opacity: 0.6 }} />
  </AbsoluteFill>
);
const Wallet: React.FC<{ x: number; y: number; w?: number; text?: string; color?: string }> = ({ x, y, w = 150, text = '', color = COL.cyan }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - w * 0.32, width: w, height: w * 0.64, borderRadius: w * 0.12, background: 'linear-gradient(160deg,#2a2f3d,#0e1118)', border: '3px solid #3a4152', boxShadow: '0 10px 30px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: w * 0.66, height: w * 0.34, borderRadius: 6, background: '#05070d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.13, color }}>{text}</div>
  </div>
);

// ================================================================ ACT 4 · the heist
const tNot = C0(35), tJoe = P(36, 'Meet Joe'), tDan = P(36, 'a man named'), t2M = P(36, 'two million'), tForgot = P(36, "He'd forgotten");
const t12 = P(37, 'Twelve'), t16 = P(37, 'sixteen'), tWipe = P(37, 'wipes itself'), tLonger = P(37, 'Four tries');
const tAttack = C0(38), tFirm = P(39, 'firmware update'), tCopies = P(39, 'copies its PIN'), tProt = P(39, 'That memory'), tGlitch = P(40, 'glitch'), tTrick = P(40, 'split second'), tRead = P(40, 'lock blinked');
const tWeeks = C0(41), tPopped = P(42, 'PIN appeared'), tMillion = C0(43), tCatch = C0(44), tFixed = P(45, 'fixed back'), tTough = P(45, 'tougher');
export const a4NoCaptions: [number, number][] = [];
export const a4Sfx: SfxEvent[] = [
  { t: tNot - 0.1, name: 'scratch', vol: 0.45 }, { t: tNot + 0.3, name: 'door', vol: 0.45, note: 'hidden door' }, { t: tJoe - 0.1, name: 'powerUp', vol: 0.35, note: 'neon lab' },
  { t: tDan, name: 'popUi', vol: 0.35 }, { t: t2M, name: 'coins', vol: 0.4 }, { t: tForgot, name: 'negGuitar', vol: 0.35 },
  { t: t12, name: 'alarm', vol: 0.25, dur: 0.6, note: '12/16' }, { t: tWipe, name: 'glitchBreak', vol: 0.3 },
  { t: tLonger, name: 'tick', vol: 0.4 }, { t: tLonger + 0.5, name: 'tick', vol: 0.4 }, { t: tLonger + 1.5, name: 'tick', vol: 0.4 },
  { t: tAttack - 0.1, name: 'suspenseStrings', vol: 0.35, dur: 3, note: 'heist' }, { t: tAttack + 0.3, name: 'whooshDeep', vol: 0.35, note: 'blueprint' },
  { t: tCopies, name: 'swoosh', vol: 0.35, note: 'PIN travels' }, { t: tProt, name: 'lock', vol: 0.4, note: 'guard' },
  { t: tGlitch - 0.05, name: 'glitchElectric', vol: 0.55, note: 'THE GLITCH' }, { t: tGlitch, name: 'bassHitFx', vol: 0.45 }, { t: tRead, name: 'reveal', vol: 0.4, note: 'memory opens' },
  { t: tWeeks, name: 'spinWhistle', vol: 0.3, note: '12 weeks' }, { t: tWeeks + 0.8, name: 'dizzy', vol: 0.3 },
  { t: tPopped, name: 'levelUp', vol: 0.5, note: 'PIN FOUND' }, { t: tMillion, name: 'laughApplause', vol: 0.3, dur: 1.8 }, { t: tMillion + 0.2, name: 'sillyPop', vol: 0.3, note: 'like pop' },
  { t: tCatch - 0.05, name: 'scratch', vol: 0.4, note: 'freeze' }, { t: tFixed, name: 'stomp', vol: 0.45, note: 'FIXED IN 2017' }, { t: tTough - 0.3, name: 'chime', vol: 0.25, note: 'Ike slides in' },
];
export const A4: React.FC = () => {
  const { f, fps, t } = useTF();
  const r = rng(Math.round(t * 30));
  // ---- the lab, Joe, Dan, the stakes
  if (t < tAttack - 0.2) {
    const door = ramp(t, tNot + 0.2, 1.0, EASE.inOut);
    const used = t > t12 - 0.05 ? 12 : 0;
    const hg = [tLonger, tLonger + 0.5, tLonger + 1.5].filter((x) => t > x).length;
    return (
      <AbsoluteFill>
        <Neon />
        <div style={{ position: 'absolute', left: 120, top: 150, width: 520, height: 320, borderRadius: 18, background: '#05070d', border: `3px solid ${COL.cyan}55`, overflow: 'hidden' }}>
          <svg width="520" height="320"><path d={Array.from({ length: 53 }, (_, i) => `${i ? 'L' : 'M'}${i * 10} ${160 + Math.sin(i * 0.6 + t * 6) * 60 * Math.sin(i * 0.11)}`).join(' ')} stroke={COL.cyan} strokeWidth="4" fill="none" style={{ filter: `drop-shadow(0 0 8px ${COL.cyan})` }} /></svg>
          <div style={{ position: 'absolute', left: 16, top: 12 }}><Mono size={20} color={COL.cyan}>OSCILLOSCOPE</Mono></div>
        </div>
        <Person kind="joe" x={560} y={1120} size={560} mood={t > tForgot ? 'focused' : 'neutral'} look={1} seed={41} />
        {t > tDan - 0.1 && <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${(1 - ramp(t, tDan - 0.1, 0.6, EASE.out)) * 700}px)` }}>
          <Person kind="dan" x={1420} y={1120} size={520} mood={t > tForgot ? 'worried' : 'smile'} look={-1} seed={42} />
          <Wallet x={1560} y={1020} w={170} text={used ? `${used}/16` : 'PIN?'} color={used ? COL.red : COL.cyan} />
        </div>}
        {t > t2M - 0.1 && t < t12 - 0.1 && <Pop x={1420} y={260} at={t2M - 0.1}><div style={{ padding: '14px 30px', borderRadius: 16, background: 'rgba(7,11,22,.85)', border: `3px solid ${COL.gold}`, textAlign: 'center' }}><div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 54, color: COL.gold }}>≈ $2M</div><div style={{ ...fonts.H, fontWeight: 900, fontSize: 26, color: C.ink }}>IN CRYPTO</div>{t > tForgot && <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 36, color: COL.red, marginTop: 6 }}>PIN: ????</div>}</div></Pop>}
        {t > t12 - 0.1 && <Pop x={1180} y={250} at={t12 - 0.1}><div style={{ padding: '18px 26px', borderRadius: 16, background: 'rgba(7,11,22,.9)', border: `3px solid ${COL.red}`, textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>{Array.from({ length: 16 }, (_, i) => <div key={i} style={{ width: 22, height: 40, borderRadius: 4, background: i < 12 ? '#3a2228' : COL.red, boxShadow: i >= 12 ? `0 0 10px ${COL.red}` : 'none', opacity: i >= 12 && t > t16 ? 0.6 + 0.4 * Math.sin(t * 10) : 1 }} />)}</div>
          <div style={{ marginTop: 12, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: COL.red }}>12 WRONG · WIPES AT 16</div>
        </div></Pop>}
        {hg > 0 && <div style={{ position: 'absolute', left: 900, top: 560, transform: `translate(-50%,-50%) scale(${0.6 * Math.pow(1.45, hg)})` }}><Icon name="ph:hourglass-high-bold" size={120} color={COL.amber} /></div>}
        {/* the hidden door swinging open over the lab */}
        {door < 1 && <AbsoluteFill style={{ background: '#0b0f1a', transformOrigin: '0 50%', transform: `perspective(1600px) rotateY(${-door * 95}deg)`, boxShadow: '30px 0 80px rgba(0,0,0,.6)' }}><AbsoluteFill style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0 4px, transparent 4px 160px)' }} /></AbsoluteFill>}
      </AbsoluteFill>
    );
  }
  // ---- inside the chip: firmware update → PIN in memory → guard → glitch
  if (t < tWeeks - 0.2) {
    const travel = ramp(t, tCopies, 0.9, EASE.inOut);
    const guard = ramp(t, tProt, 0.3) * (1 - ramp(t, tGlitch + 0.15, 0.3));
    const open = ramp(t, tRead, 0.5, EASE.out);
    const bolt = t > tGlitch - 0.05 && t < tGlitch + 0.35;
    const tilt = lerp(55, 32, ramp(t, tAttack, 1.6, EASE.inOut));
    return (
      <AbsoluteFill style={{ background: '#02050a' }}>
        <AbsoluteFill style={{ transform: `perspective(1400px) rotateX(${tilt}deg) scale(${lerp(0.8, 1.05, ramp(t, tAttack, 2, EASE.inOut))})`, transformOrigin: '50% 60%' }}>
          <div style={{ position: 'absolute', left: 260, top: 140, width: 1400, height: 820, borderRadius: 30, background: 'linear-gradient(160deg,#0f2a1f,#06140e)', border: '6px solid #1f7a4c', boxShadow: `0 0 80px rgba(60,240,160,.15)` }}>
            <svg style={{ position: 'absolute', inset: 0 }} width="1400" height="820">{Array.from({ length: 22 }, (_, i) => <path key={i} d={`M0 ${40 + i * 36} H${300 + (i * 97) % 600} V${60 + (i * 53) % 700} H1400`} stroke="rgba(60,240,160,.12)" strokeWidth="3" fill="none" />)}</svg>
            <div style={{ position: 'absolute', left: 120, top: 260, width: 360, height: 300, borderRadius: 20, background: '#0b1a12', border: '4px solid #3cf0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}><Mono size={34} color={COL.green}>FLASH</Mono><Mono size={22} color={C.dim}>stores the PIN</Mono></div>
            <div style={{ position: 'absolute', left: 900, top: 260, width: 380, height: 300, borderRadius: 20, background: '#0b1a12', border: `4px solid ${guard > 0.5 ? COL.red : COL.cyan}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: open ? `0 0 ${60 * open}px ${COL.cyan}` : 'none' }}><Mono size={34} color={COL.cyan}>RAM</Mono><Mono size={22} color={C.dim}>temporary memory</Mono></div>
            {t > tCopies - 0.05 && <div style={{ position: 'absolute', left: lerp(300, 1090, travel), top: 410, transform: `translate(-50%,-50%) scale(${1 + open * 0.4})`, padding: '10px 22px', borderRadius: 12, background: COL.gold, fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: '#2a1a00', boxShadow: `0 0 30px ${COL.gold}` }}>PIN</div>}
            {guard > 0 && <div style={{ position: 'absolute', left: 1090, top: 180, transform: 'translateX(-50%)', opacity: guard * (bolt && Math.sin(t * 90) > 0 ? 0.2 : 1) }}><Icon name="ph:shield-check-fill" size={150} color={COL.red} /></div>}
          </div>
        </AbsoluteFill>
        {/* oscilloscope inset */}
        <div style={{ position: 'absolute', left: 60, top: 60, width: 380, height: 200, borderRadius: 14, background: 'rgba(5,7,13,.9)', border: `2px solid ${COL.cyan}66` }}>
          <svg width="380" height="200"><path d={Array.from({ length: 39 }, (_, i) => `${i ? 'L' : 'M'}${i * 10} ${100 + (bolt && i > 18 && i < 22 ? -80 : Math.sin(i * 0.8 + t * 8) * 18)}`).join(' ')} stroke={COL.cyan} strokeWidth="3" fill="none" /></svg>
          <div style={{ position: 'absolute', left: 12, bottom: 8 }}><Mono size={18} color={COL.cyan}>POWER</Mono></div>
        </div>
        {bolt && <svg style={{ position: 'absolute', left: 0, top: 0 }} width="1920" height="1080"><path d={`M300 0 L${720 + r() * 40} 360 L640 380 L${1180 + r() * 40} 640 L1060 650 L1500 1080`} stroke={COL.cyan} strokeWidth="14" fill="none" style={{ filter: `drop-shadow(0 0 30px ${COL.cyan})` }} /></svg>}
        {bolt && <AbsoluteFill style={{ background: COL.cyan, opacity: 0.12 * (1 - (t - tGlitch) / 0.35) }} />}
        <div style={{ position: 'absolute', right: 60, top: 60 }}><Person kind="joe" x={-160} y={330} size={300} mood="focused" seed={43} /></div>
        {t > tFirm && t < tCopies + 0.8 && <Pop x={960} y={1000} at={tFirm}><Mono size={30} color={COL.steel2}>FIRMWARE UPDATE…</Mono></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- 12 weeks, PIN found, the catch
  const weeks = Math.min(12, Math.floor(ramp(t, tWeeks, 1.8) * 12));
  const found = t > tPopped - 0.05;
  const freeze = t > tCatch - 0.05;
  const tt = freeze ? Math.min(t, tCatch) : t;
  return (
    <AbsoluteFill>
      <Neon />
      {t < tPopped - 0.3 ? <>
        <div style={{ position: 'absolute', left: 960, top: 300, transform: 'translateX(-50%)', display: 'flex', gap: 14 }}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ width: 70, height: 90, borderRadius: 10, background: i < weeks ? COL.cyan : 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: '#04121a' }}>{i < weeks ? `W${i + 1}` : ''}</div>)}</div>
        {Array.from({ length: 3 }, (_, i) => { const u = ((t - tWeeks) * 1.3 + i * 0.33) % 1; return <div key={i} style={{ position: 'absolute', left: 820 + i * 140, top: 760 - u * 200, width: 90 + u * 60, height: 90 + u * 60, borderRadius: '50%', background: 'rgba(200,210,230,.25)', opacity: 1 - u, filter: 'blur(6px)' }} />; })}
        <Person kind="joe" x={960} y={1120} size={520} mood="worried" seed={44} tilt={Math.sin(t * 6) * 2} />
      </> : <>
        <div style={{ position: 'absolute', left: 360, top: 160, width: 1200, height: 420, borderRadius: 20, background: '#04070d', border: `3px solid ${COL.green}88`, padding: 40, fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, color: COL.green, lineHeight: 1.5 }}>
          <div>&gt; reading RAM…</div>
          {found && <div style={{ opacity: ramp(t, tPopped, 0.3) }}>&gt; PIN FOUND: {'•••••'.slice(0, Math.min(5, Math.floor((t - tPopped) * 6) + 1))}</div>}
          {t > tMillion && <div style={{ color: COL.gold }}>&gt; WALLET UNLOCKED ✓</div>}
        </div>
        <Person kind="dan" x={1400} y={1120} size={460} mood={t > tMillion ? 'happy' : 'shock'} seed={45} />
        <Person kind="joe" x={520} y={1120} size={460} mood={t > tMillion ? 'smile' : 'focused'} seed={46} />
        {t > tMillion && Array.from({ length: 40 }, (_, i) => { const rr = rng(i * 977 + 13); rr(); const x = rr() * 1920, sp = 200 + rr() * 300; const y = -40 + ((tt - tMillion) * sp + rr() * 200) % 1200; return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 14, height: 22, background: [COL.gold, COL.cyan, '#ff4fd8', COL.green][i % 4], transform: `rotate(${(tt * 200 + i * 40) % 360}deg)` }} />; })}
        {t > tMillion + 0.2 && t < tMillion + 1.4 && <Pop x={1640} y={600} at={tMillion + 0.2} out={tMillion + 1.1}><div style={{ width: 120, height: 120, borderRadius: '50%', background: COL.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${COL.cyan}` }}><Icon name="ph:thumbs-up-fill" size={70} color="#04121a" /></div></Pop>}
        {freeze && <AbsoluteFill style={{ background: 'rgba(0,0,0,.35)', backdropFilter: 'grayscale(1)' }} />}
        {freeze && <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${(1 - ramp(t, tTough - 0.5, 0.6, EASE.out)) * 900}px)` }}><Ike x={1500} y={1000} size={440} count={8} eye="smug" seed={47} /></div>}
        {t > tFixed && <Stamp x={760} y={720} at={tFixed} text="FIXED IN 2017" size={70} rot={-6} color={COL.amber} />}
        {t > tTough && <Pop x={1500} y={470} at={tTough}><div style={{ padding: '10px 22px', borderRadius: 12, background: 'rgba(7,11,22,.9)', border: `2px solid ${COL.red}`, ...fonts.H, fontWeight: 900, fontSize: 36, color: COL.red, whiteSpace: 'nowrap' }}>DIFFERENT. TOUGHER.</div></Pop>}
      </>}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 5 · the offer
const t2023 = C0(46), tUnc = P(46, 'Unciphered'), tWired = C0(47), tCarved = P(47, 'carved out'), tDissolve = P(47, 'dissolved'), tTrillion = P(48, 'two hundred');
const tOpened = C0(49), tOffer = C0(50), tLetUs = P(50, 'let us'), tSaidNo = P(51, 'said no'), tWhy = C0(52), tReports = C0(53), tTeam = P(53, 'another team'), tShare = P(53, 'a share');
const tSomewhere = C0(54), tStatus = C0(55), tToday = P(55, 'as of today');
export const a5NoCaptions: [number, number][] = [[C1(48) + 0.05, C1(49) + 0.2]];
export const a5Sfx: SfxEvent[] = [
  { t: t2023 - 0.05, name: 'notify', vol: 0.4, note: 'news' }, { t: tUnc, name: 'stomp', vol: 0.45 },
  { t: tWired, name: 'machine', vol: 0.3, note: 'lab' }, { t: tCarved, name: 'techMove', vol: 0.4, note: 'chip lifted' }, { t: tDissolve, name: 'glitchStatic', vol: 0.3, dur: 1.6, note: 'acid hiss' }, { t: tDissolve + 0.3, name: 'gasp', vol: 0.35, note: 'Ike horrified' },
  { t: tTrillion - 0.2, name: 'compute', vol: 0.45, dur: 2.6, note: '200 trillion' }, { t: tTrillion, name: 'riser', vol: 0.35, dur: 2.4 },
  { t: tOpened - 0.04, name: 'reveal', vol: 0.55, note: 'IT OPENED' }, { t: tOpened, name: 'impactEpic', vol: 0.35 },
  { t: tOffer, name: 'bell', vol: 0.35, note: 'phone' }, { t: tOffer + 0.4, name: 'heartbeat', vol: 0.45 }, { t: tSaidNo - 0.02, name: 'scratch', vol: 0.5, note: 'DECLINED' }, { t: tSaidNo + 0.5, name: 'crickets', vol: 0.45, dur: 1.1 },
  { t: tWhy - 0.05, name: 'mysteryHit', vol: 0.45 }, { t: tTeam, name: 'paperSlide', vol: 0.4, note: 'contract' }, { t: tShare, name: 'suspenseClarinet', vol: 0.3 },
  { t: tSomewhere, name: 'scan', vol: 0.4, note: 'laser' }, { t: tToday, name: 'heartbeat', vol: 0.5 },
];
export const A5: React.FC = () => {
  const { f, fps, t } = useTF();
  const r = rng(Math.round(t * 30));
  // ---- the lab and the 200 trillion guesses
  if (t < tOffer - 0.2) {
    const lift = ramp(t, tCarved, 1.0, EASE.inOut);
    const acid = ramp(t, tDissolve, 0.6);
    const servers = t > tTrillion - 0.3;
    const opened = t > tOpened - 0.05;
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 30%, #dff4fb, #9cc3d1 70%)' }} />
        <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(10,40,60,.06) 2px, transparent 2px), linear-gradient(90deg, rgba(10,40,60,.06) 2px, transparent 2px)', backgroundSize: '100px 100px' }} />
        {t < tWired && <Pop x={960} y={460} at={t2023}><div style={{ width: 1100, padding: '30px 40px', borderRadius: 20, background: '#0b0f1a', boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}><div style={{ display: 'flex', gap: 14, alignItems: 'center' }}><div style={{ padding: '6px 14px', background: COL.red, borderRadius: 8, ...fonts.H, fontWeight: 900, fontSize: 30, color: '#fff' }}>2023</div><Mono size={26} color={COL.steel2}>SECURITY NEWS</Mono></div><div style={{ marginTop: 18 }}><Title size={70} color="#fff">"IRONKEY CRACKED?"</Title></div>{t > tUnc && <div style={{ marginTop: 14 }}><Mono size={30} color={COL.cyan}>UNCIPHERED · A SECURITY COMPANY</Mono></div>}</div></Pop>}
        {t >= tWired && !servers && <>
          {/* steel tray + test unit */}
          <div style={{ position: 'absolute', left: 460, top: 760, width: 1000, height: 60, borderRadius: 14, background: 'linear-gradient(180deg,#e8edf3,#aab4c3)', boxShadow: '0 30px 60px rgba(0,0,0,.25)' }} />
          <Ike x={960} y={780} size={440} count={0} eye="closed" glow={0} screenText="TEST" xray={acid * 0.8} seed={51} />
          <div style={{ position: 'absolute', left: 960, top: 640, transform: 'translateX(-50%)' }}><Mono size={22} color="#2a3a4a">TEST UNIT</Mono></div>
          {lift > 0 && <div style={{ position: 'absolute', left: 1240, top: lerp(600, 330, lift), transform: `translate(-50%,-50%) rotate(${lift * 12}deg)` }}><div style={{ width: 150, height: 130, borderRadius: 10, background: '#1f7a4c', border: '4px solid #3cf0a0', boxShadow: '0 20px 40px rgba(0,0,0,.35)' }} /><div style={{ position: 'absolute', left: 60, top: -170, width: 14, height: 170, background: '#8c97a8', transform: 'rotate(-8deg)' }} /></div>}
          {acid > 0 && Array.from({ length: 18 }, (_, i) => { const u = ((t - tDissolve) * 0.8 + i / 18) % 1; return <div key={i} style={{ position: 'absolute', left: 900 + (i % 6) * 22 + Math.sin(u * 6 + i) * 20, top: 560 - u * 260, width: 18 + u * 30, height: 18 + u * 30, borderRadius: '50%', background: 'rgba(150,255,170,.45)', opacity: (1 - u) * acid, filter: 'blur(3px)' }} />; })}
          <div style={{ position: 'absolute', left: 120, top: 120 }}><Mono size={24} color="#2a3a4a">LAB · WITH WIRED</Mono></div>
          <div style={{ position: 'absolute', left: 0, top: 0 }}><Ike x={1720} y={1040} size={260} count={8} eye={t > tDissolve ? 'wide' : 'open'} seed={52} /></div>
        </>}
        {servers && <AbsoluteFill style={{ background: '#05070d' }}>
          {Array.from({ length: 6 }, (_, c) => <div key={c} style={{ position: 'absolute', left: 120 + c * 290, top: 120, width: 240, height: 860, borderRadius: 10, background: '#0e1220', border: '2px solid #1b2133' }}>{Array.from({ length: 22 }, (_, k) => <div key={k} style={{ position: 'absolute', left: 16, top: 20 + k * 38, width: 6, height: 6, borderRadius: 3, background: (k + c + Math.floor(t * 12)) % 5 ? '#1b2133' : COL.cyan }} />)}</div>)}
          <div style={{ position: 'absolute', left: 960, top: 480, transform: 'translate(-50%,-50%)', padding: '26px 40px', borderRadius: 20, background: 'rgba(5,7,13,.92)', border: `3px solid ${opened ? COL.green : COL.cyan}`, textAlign: 'center' }}>
            <Mono size={26} color={C.dim}>PASSWORD GUESSES</Mono>
            <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 88, color: opened ? COL.green : COL.cyan }}><Count to={200e12} at={tTrillion} d={2.3} /></div>
            {opened && <div style={{ marginTop: 8, transform: `scale(${springAt(f, fps, tOpened - 0.04, { damping: 14, stiffness: 160 })})` }}><Title size={110} color={COL.green}>UNLOCKED</Title></div>}
          </div>
          {opened && <div style={{ position: 'absolute', left: 0, top: 0 }}><Ike x={1720} y={1040} size={260} count={8} eye="wide" tilt={Math.sin(t * 40) * 2 * Math.max(0, 1 - (t - tOpened) * 2)} seed={53} /></div>}
        </AbsoluteFill>}
      </AbsoluteFill>
    );
  }
  // ---- the call, "said no", why, another team, still locked
  if (t < tSomewhere - 0.2) {
    const declined = t > tSaidNo - 0.02;
    const fr = declined && t < tWhy - 0.1;
    if (t < tWhy - 0.1) return (
      <AbsoluteFill style={{ filter: fr ? 'grayscale(.85) contrast(1.1)' : undefined }}>
        <AbsoluteFill style={{ background: 'linear-gradient(90deg,#cfe7f0 0 50%,#101626 50% 100%)' }} />
        <div style={{ position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: '#000' }} />
        <div style={{ position: 'absolute', left: 480, top: 380, transform: 'translate(-50%,-50%)', textAlign: 'center' }}><Icon name="ph:phone-call-fill" size={160} color="#0b3a4a" /><div style={{ marginTop: 10 }}><Mono size={30} color="#0b3a4a">UNCIPHERED</Mono></div>{t > tLetUs && <div style={{ marginTop: 18, padding: '14px 26px', borderRadius: 16, background: '#fff', ...fonts.H, fontWeight: 900, fontSize: 40, color: '#0b3a4a' }}>"Let us unlock it."</div>}</div>
        <Person kind="stefan" x={1440} y={1120} size={520} mood={declined ? 'neutral' : 'focused'} seed={54} look={-1} />
        <div style={{ position: 'absolute', left: 1180, top: 300, transform: `rotate(${!declined ? Math.sin(t * 50) * 6 : 0}deg)` }}><Icon name="ph:device-mobile-bold" size={150} color={C.ink} /></div>
        {declined && <Stamp x={1240} y={380} at={tSaidNo - 0.02} text="DECLINED" size={90} rot={-8} />}
      </AbsoluteFill>
    );
    const swing = Math.sin((t - tWhy) * 3) * 10 * Math.exp(-(t - tWhy) * 0.6);
    return (
      <AbsoluteFill>
        <Vault light={0.5} pedestal={false} />
        {t < tReports - 0.1 ? <>
          <div style={{ position: 'absolute', left: 960, top: 500, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tWhy - 0.05, { damping: 10, stiffness: 200 })})`, ...fonts.H, fontWeight: 900, fontSize: 520, color: COL.red, lineHeight: 1, textShadow: `0 0 80px ${COL.red}88` }}>?</div>
          <div style={{ position: 'absolute', left: 1380, top: 160, transformOrigin: '50% 0', transform: `rotate(${swing}deg)` }}><div style={{ width: 4, height: 140, background: '#8c97a8', margin: '0 auto' }} /><div style={{ padding: '14px 26px', borderRadius: 14, background: 'rgba(7,11,22,.9)', border: `3px solid ${COL.gold}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 48, color: COL.gold, whiteSpace: 'nowrap' }}>≈ $580M</div></div>
        </> : <>
          <Pop x={760} y={480} at={tTeam - 0.1}><div style={{ width: 760, padding: '36px 44px', borderRadius: 16, background: '#f4efe2', boxShadow: '0 30px 80px rgba(0,0,0,.5)', ...fonts.H, color: '#2a2a35' }}>
            <Mono size={22} color="#6b6250">AGREEMENT · ACCORDING TO REPORTS</Mono>
            <div style={{ fontWeight: 900, fontSize: 56, marginTop: 14 }}>ANOTHER TEAM</div>
            {t > tShare && <div style={{ fontWeight: 800, fontSize: 38, color: '#b3261e', marginTop: 8 }}>gets a share if they succeed</div>}
            <div style={{ marginTop: 30, height: 3, background: '#d8cfb6' }} /><div style={{ marginTop: 8, fontFamily: fonts.body, fontStyle: 'italic', fontSize: 28, color: '#6b6250' }}>signed: S.T.</div>
          </div></Pop>
          {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 1360 + i * 150, top: 520 - (i % 2) * 30, opacity: ramp(t, tTeam + i * 0.12, 0.4) }}><svg width="140" height="300" viewBox="0 0 140 300"><circle cx="70" cy="60" r="44" fill="#0b0f1a" /><path d="M10 300 Q10 130 70 120 Q130 130 130 300 Z" fill="#0b0f1a" /><rect x="40" y="52" width="60" height="14" rx="7" fill={COL.cyan} opacity="0.5" /></svg></div>)}
        </>}
      </AbsoluteFill>
    );
  }
  // ---- somewhere, right now… still locked
  const scan = (t * 0.6) % 1;
  return (
    <AbsoluteFill>
      <Vault light={0.8} />
      <Ike x={960} y={812} size={480} count={8} eye="narrow" seed={55} />
      {t < tStatus && <div style={{ position: 'absolute', left: 700, top: 300 + scan * 520, width: 520, height: 4, background: COL.red, boxShadow: `0 0 20px ${COL.red}`, opacity: 0.8 }} />}
      {t > tToday - 0.05 && <Pop x={960} y={220} at={tToday - 0.05}><div style={{ textAlign: 'center', padding: '16px 34px', borderRadius: 16, background: 'rgba(7,11,22,.9)', border: `3px solid ${COL.red}` }}><Title size={60} color={COL.red}>STATUS: STILL LOCKED</Title><div style={{ marginTop: 6 }}><Mono size={22} color={C.dim}>NO PUBLIC CONFIRMATION · AS OF OCT 2026</Mono></div></div></Pop>}
    </AbsoluteFill>
  );
};
