// Scene 2 · Flashback — VHS rewind to summer 2026: the shady previous owner cheats with Chip
// inside, Vanguard catches it, the gavel drops, the ban hits account → hardware → Chip, he sells it… crickets.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pill, Flash } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, P, PE, S0, S1 } from './ctime';
import { Chip, Shady, Bouncer } from './chars';
import { Stamp, Burst } from './fx';

const A = S0(2), Z = S1(2);
const tRewind = P(18, 'rewind'), tSummer = P(18, 'Summer'), tLived = P(18, 'Chip lived'), tThat = P(18, 'And that owner'), tFair = P(18, 'not playing fair');
const tCheats = C0(19), tDetected = P(19, 'detected'), tRiot = P(19, 'Riot dropped'), tHammer = P(19, 'hammer'), tAccount = P(19, 'an account'), tHardware = P(19, 'the hardware'), tIncl = P(19, 'Including Chip');
const tThen = C0(20), tNatural = P(20, 'most natural'), tSold = P(20, 'He sold'), tSoldEnd = PE(20, 'sold it');
export const s2NoCaptions: [number, number][] = [[tSoldEnd + 0.3, Z + 0.3]];

export const s2Sfx: SfxEvent[] = [
  { t: A + 0.05, name: 'rewind', vol: 0.55, note: 'VHS rewind' },
  { t: tSummer - 0.05, name: 'stomp', vol: 0.4, note: 'SUMMER 2026' },
  { t: tLived - 0.1, name: 'creakyDoor', vol: 0.4, note: 'shady room' },
  { t: tThat - 0.05, name: 'suspenseClarinet', vol: 0.5, note: 'sus' },
  { t: tFair - 0.05, name: 'glitchElectric', vol: 0.3, note: 'aimbot snaps' },
  ...[0, 1, 2].map((k) => ({ t: tFair + 0.15 + k * 0.35, name: 'bleepHi' as const, vol: 0.2 })),
  { t: tCheats - 0.05, name: 'breachAlarm', vol: 0.4, dur: 1.6, note: 'CHEAT DETECTED' },
  { t: tDetected - 0.1, name: 'stomp', vol: 0.5, note: 'Vanguard steps in' },
  { t: tRiot - 0.05, name: 'fallWhistle', vol: 0.4, note: 'gavel falls' }, { t: tHammer - 0.02, name: 'woodHit', vol: 0.8, note: 'GAVEL' }, { t: tHammer, name: 'impactDeep', vol: 0.5 },
  { t: tAccount - 0.03, name: 'stomp', vol: 0.5, note: 'ban account' }, { t: tHardware - 0.03, name: 'stomp', vol: 0.55, note: 'ban hardware' },
  { t: tIncl + 0.3, name: 'stomp', vol: 0.6, note: 'ban sticker on Chip' }, { t: tIncl + 0.35, name: 'gasp', vol: 0.45 },
  { t: tThen + 0.1, name: 'toyWhistle', vol: 0.35, note: 'innocent whistle' }, { t: tNatural, name: 'paperSlide', vol: 0.35, note: 'Chip into the box' },
  { t: tSold - 0.04, name: 'coins', vol: 0.55, note: 'SOLD ka-ching' }, { t: tSold + 0.1, name: 'stomp', vol: 0.4, note: 'SOLD tag' },
  { t: tSoldEnd + 0.2, name: 'crickets', vol: 0.55, dur: 1.6, note: 'crickets beat' },
];

export const S2Flashback: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const r = rng(Math.round(t * 30));
  const rewinding = t < tSummer;
  const alarm = t > tCheats - 0.05 && t < tRiot;
  const shake = t > tHammer && t < tHammer + 0.5 ? (1 - (t - tHammer) / 0.5) * 22 : 0;
  const tilt = ramp(t, tThat - 0.1, 0.6, EASE.inOut) * (1 - ramp(t, tCheats - 0.2, 0.3)) * -4;
  const gavelY = lerp(-500, 420, ramp(t, tRiot, tHammer - tRiot, EASE.in));
  const gavelOut = ramp(t, tHammer + 0.4, 0.4, EASE.in);
  const bouncerIn = ramp(t, tDetected - 0.2, 0.5, EASE.out);
  const boxIn = ramp(t, tNatural - 0.1, 0.6, EASE.out);
  const crickets = t > tSoldEnd + 0.2;
  const chipBanned = t > tIncl + 0.3;
  return (
    <AbsoluteFill style={{ background: '#0b0a0d' }}>
      <AbsoluteFill style={{ transform: `translate(${(r() - 0.5) * shake}px, ${(r() - 0.5) * shake}px) rotate(${tilt}deg) scale(${1 + Math.abs(tilt) * 0.01})`, filter: 'sepia(0.4) saturate(1.15) brightness(1.18)' }}>
        {/* the shady owner's room */}
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 35%, #4a3448, #1a1220 75%)' }} />
        <div style={{ position: 'absolute', left: 1500, top: 420, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,120,.22), transparent 65%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 820, bottom: 0, background: 'linear-gradient(180deg,#1c1418,#0b080a)' }} />
        {/* desk + monitor with the cheat */}
        <div style={{ position: 'absolute', left: 520, top: 800, width: 1100, height: 34, borderRadius: 8, background: '#2a2024' }} />
        <div style={{ position: 'absolute', left: 760, top: 330, width: 620, height: 380, borderRadius: 12, background: '#07060a', boxShadow: '0 0 0 6px #241a22, 0 30px 80px rgba(0,0,0,.6)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 12, borderRadius: 6, background: 'linear-gradient(180deg,#5a7a9a,#c8a070)', overflow: 'hidden' }}>
            {[0, 1, 2].map((k) => { const ex = 120 + k * 170, ey = 210 - (k % 2) * 40; return <div key={k} style={{ position: 'absolute', left: ex, top: ey, width: 30, height: 70, borderRadius: 10, background: '#2a1a24' }}><div style={{ position: 'absolute', left: 4, top: -24, width: 22, height: 22, borderRadius: '50%', background: '#2a1a24' }} /></div>; })}
            {t > tFair - 0.1 && (() => { const k = Math.min(2, Math.floor((t - tFair) / 0.35)); const ex = 135 + k * 170, ey = 190 - (k % 2) * 40; return <>
              {[0, 1, 2].map((q) => <div key={q} style={{ position: 'absolute', left: 105 + q * 170, top: 140 - (q % 2) * 40, width: 60, height: 120, border: `2px solid ${C.red}`, opacity: 0.8 }} />)}
              <svg style={{ position: 'absolute', left: 0, top: 0 }} width="596" height="356"><line x1="298" y1="178" x2={ex} y2={ey} stroke={C.red} strokeWidth="2" strokeDasharray="6 5" /><circle cx={ex} cy={ey} r="14" fill="none" stroke={C.red} strokeWidth="3" /></svg>
              <div style={{ position: 'absolute', left: 14, top: 10, padding: '4px 10px', background: C.red, fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, color: '#fff' }}>AIMBOT: ON · WALLHACK: ON</div></>; })()}
          </div>
        </div>
        {/* energy drink cans */}
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: 'absolute', left: 1430 + i * 40, top: 730 + (i % 2) * 6, width: 30, height: 70, borderRadius: 6, background: i % 2 ? '#3cbf6e' : '#e6c23a', transform: `rotate(${(i - 1.5) * 6}deg)`, boxShadow: '0 6px 10px rgba(0,0,0,.5)' }} />)}
        {/* Chip on the desk */}
        {!(boxIn > 0.6) && <Chip x={1310} y={800} size={290} mood={chipBanned ? 'shock' : t > tThat ? 'sus' : 'happy'} look={t > tThat ? -0.8 : 0} seed={12} sweat={t > tThat && !chipBanned ? 1 : 0} red={chipBanned ? 0.6 : 0} />}
        {chipBanned && !(boxIn > 0.6) && <div style={{ position: 'absolute', left: 1310, top: 600, transform: `translate(-50%,-50%) rotate(-14deg) scale(${3 - 2 * ramp(t, tIncl + 0.3, 0.15, EASE.in)})`, opacity: ramp(t, tIncl + 0.3, 0.15), padding: '4px 14px', background: C.red, fontFamily: fonts.head, fontWeight: 900, fontSize: 30, color: '#fff' }}>BANNED</div>}
        {/* the box Chip gets sold in */}
        {boxIn > 0 && (
          <div style={{ position: 'absolute', left: 1180, top: 640, width: 260, height: 170, transform: `translateY(${(1 - boxIn) * 60}px)`, opacity: clamp(boxIn * 2) }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#c8955a,#a87440)', borderRadius: 6 }} />
            {crickets && <Chip x={130} y={20} size={120} mood="sad" seed={13} look={0.2} lookY={0.6} />}
            <div style={{ position: 'absolute', left: 0, top: 0, width: 260, height: 26, background: '#b8844c' }} />
            {t > tSold && <div style={{ position: 'absolute', left: 130, top: 95, transform: `translate(-50%,-50%) rotate(-8deg) scale(${3 - 2 * ramp(t, tSold + 0.1, 0.15, EASE.in)})`, opacity: ramp(t, tSold + 0.1, 0.15), padding: '4px 16px', border: `5px solid ${C.green}`, fontFamily: fonts.head, fontWeight: 900, fontSize: 46, color: C.green }}>SOLD</div>}
          </div>
        )}
        {/* the shady owner */}
        <Shady x={500} y={1080} size={460} whistle={t > tThen && t < tSold} cash={t > tSold ? ramp(t, tSold, 0.4) : 0} />
        {/* Vanguard bursts in with the flashlight */}
        {t > tDetected - 0.25 && t < tAccount && <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${(1 - bouncerIn) * 700}px)`, opacity: 1 - ramp(t, tAccount - 0.3, 0.25) }}><Bouncer x={1700} y={1100} size={520} glasses={t > tDetected + 0.4 ? 0 : 1} light={1} /></div>}
        {/* the gavel */}
        {t > tRiot - 0.05 && gavelOut < 1 && (
          <div style={{ position: 'absolute', left: 860, top: gavelY, width: 420, height: 400, transform: `rotate(${-20 + ramp(t, tRiot, tHammer - tRiot, EASE.in) * 20}deg) translateY(${-gavelOut * 900}px)`, transformOrigin: '50% 100%' }}>
            <div style={{ position: 'absolute', left: 180, top: 120, width: 44, height: 280, borderRadius: 10, background: 'linear-gradient(90deg,#5a3a1e,#8a5a30,#5a3a1e)' }} />
            <div style={{ position: 'absolute', left: 40, top: 30, width: 320, height: 120, borderRadius: 20, background: 'linear-gradient(180deg,#9a6a3a,#5a3a1e)', boxShadow: '0 20px 40px rgba(0,0,0,.5)' }} />
          </div>
        )}
        <Burst x={1070} y={800} at={tHammer} color="#ffd23a" size={300} n={16} />
      </AbsoluteFill>
      {/* alarm light */}
      {alarm && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 0%, rgba(255,40,60,${0.35 + 0.25 * Math.sin(t * 16)}), transparent 60%)` }} />}
      {alarm && <div style={{ position: 'absolute', left: 960, top: 150, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tCheats, { damping: 10, stiffness: 200 })})`, padding: '14px 40px', background: C.red, fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: '#fff', letterSpacing: '0.04em', boxShadow: `0 0 60px ${C.red}` }}>⚠ CHEAT DETECTED</div>}
      {/* the ban hits: account → hardware */}
      {t > tAccount - 0.1 && t < tNatural && (
        <div style={{ position: 'absolute', left: 960, top: 90, transform: 'translateX(-50%)', display: 'flex', gap: 40, opacity: 1 - ramp(t, tNatural - 0.3, 0.25) }}>
          {[['ph:user-circle-bold', 'ACCOUNT', tAccount], ['ph:cpu-bold', 'HARDWARE', tHardware]].map(([ic, l, at]) => {
            const s = springAt(f, fps, (at as number) - 0.15, { damping: 13, stiffness: 200 });
            return <div key={l as string} style={{ position: 'relative', width: 380, height: 230, borderRadius: 24, background: 'rgba(14,12,20,.92)', border: '2px solid rgba(255,255,255,.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, transform: `scale(${s})`, opacity: clamp(s * 1.5) }}>
              <Icon name={ic as string} size={92} color={C.ink} /><div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: C.ink }}>{l as string}</div>
              <Stamp x={190} y={115} at={at as number} text="BANNED" size={70} rot={-14} />
            </div>;
          })}
        </div>
      )}
      {/* VHS rewind + flashback label */}
      {rewinding && <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 5px)' }}>{[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: (t * 1400 + i * 400) % 1080, height: 40, background: 'rgba(255,255,255,.08)', transform: `translateX(${(r() - 0.5) * 60}px)` }} />)}</AbsoluteFill>}
      {rewinding && <div style={{ position: 'absolute', left: 90, top: 90, fontFamily: fonts.mono, fontWeight: 700, fontSize: 56, color: '#fff', textShadow: '3px 0 rgba(255,0,80,.7), -3px 0 rgba(0,200,255,.7)' }}>◀◀ REWIND</div>}
      <Pill x={960} y={120} at={tSummer - 0.05} out={tCheats - 0.3} color={C.amber} center size={34}><Icon name="ph:sun-bold" size={36} color={C.ink} /> SUMMER 2026 · FLASHBACK</Pill>
      {/* film scratches */}
      {Array.from({ length: 3 }, (_, i) => <div key={i} style={{ position: 'absolute', left: (r() * 1920), top: 0, width: 2, height: 1080, background: 'rgba(255,240,220,.12)' }} />)}
      {/* crickets beat: dim + "…" */}
      {crickets && <AbsoluteFill style={{ background: `rgba(0,0,0,${0.35 * ramp(t, tSoldEnd + 0.2, 0.4)})` }}><div style={{ position: 'absolute', left: 960, top: 300, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 120, color: 'rgba(255,255,255,.6)', letterSpacing: '0.2em', opacity: ramp(t, tSoldEnd + 0.5, 0.4) }}>{'. . .'.slice(0, 1 + Math.floor((t - tSoldEnd) * 3) * 2)}</div></AbsoluteFill>}
      <Flash at={tHammer} color="#fff" max={0.4} d={0.25} />
    </AbsoluteFill>
  );
};
