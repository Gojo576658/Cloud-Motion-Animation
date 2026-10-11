// Cursed CPU Short · beats 0–4: the mugshot hook, the aimbot that locks onto everything,
// the bouncer bans account + hardware ("Wait! What did I do?!"), the innocent sale + crickets,
// and Leo's great deal → KICKED.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Flash } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng, track } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { KTL, C0, C1, P, PE } from './ktime';
import { Chip, Leo, Shady, Bouncer } from '../cpu/chars';
import { Stamp, Bubble, Burst, Boot } from '../cpu/fx';

export const K = KTL.beats;
const useTF = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };

// shared vertical pieces
export const VBg: React.FC<{ top?: string; bot?: string; grid?: boolean }> = ({ top = '#16203c', bot = '#070a16', grid = true }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, ${top}, ${bot} 75%)` }} />
    {grid && <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)', backgroundSize: '90px 90px' }} />}
  </AbsoluteFill>
);
export const BigText: React.FC<{ y: number; at: number; out?: number; color?: string; size?: number; rot?: number; children: React.ReactNode }> = ({ y, at, out, color = '#fff', size = 120, rot = -3, children }) => {
  const { f, fps, t } = useTF();
  if (t < at - 0.02 || (out != null && t > out + 0.25)) return null;
  const s = springAt(f, fps, at, { damping: 10, stiffness: 230 });
  const o = out != null ? 1 - ramp(t, out, 0.2, EASE.in) : 1;
  return <div style={{ position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(${rot}deg)`, opacity: clamp(s * 1.5) * o, fontFamily: fonts.head, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', textShadow: '0 0 0 #000, 6px 6px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 20px 50px rgba(0,0,0,.6)' }}>{children}</div>;
};
const Placard: React.FC<{ x: number; y: number; at?: number; text: string; size?: number; color?: string }> = ({ x, y, at = -1, text, size = 46, color = '#1a1d2a' }) => {
  const { f, fps } = useTF();
  const s = at < 0 ? 1 : springAt(f, fps, at, { damping: 10, stiffness: 220 });
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(-3deg)`, padding: '8px 26px', background: '#fffbe6', border: '6px solid #3a4152', borderRadius: 10, fontFamily: fonts.mono, fontWeight: 700, fontSize: size, color, whiteSpace: 'nowrap', boxShadow: '0 12px 30px rgba(0,0,0,.45)' }}>{text}</div>;
};

// ---------------------------------------------------------------- 0 · mugshot hook
const tCPU = P(1, 'CPU'), tBanned = P(1, 'banned'), tPlayer = P(0, 'player');
export const sfx0: SfxEvent[] = [
  { t: 0, name: 'siren', vol: 0.32, dur: 2.2, note: 'police' }, { t: 0.04, name: 'shutter', vol: 0.55, note: 'mugshot flash' },
  { t: tPlayer, name: 'popUi', vol: 0.35, note: 'player OK' }, { t: tBanned - 0.05, name: 'shutter', vol: 0.5 },
  { t: tCPU - 0.03, name: 'stomp', vol: 0.55, note: 'THE CPU' }, { t: tCPU + 0.35, name: 'boing', vol: 0.4, note: 'Chip blinks' },
];
export const Beat0: React.FC = () => {
  const { t } = useTF();
  const siren = Math.sin(t * 9) > 0;
  const shake = t > tCPU - 0.03 && t < tCPU + 0.35 ? (1 - (t - tCPU) / 0.38) * 22 : 0;
  const r = rng(Math.round(t * 30));
  const push = 1 + ramp(t, 0, 3.2, EASE.smooth) * 0.08 + ramp(t, tCPU - 0.03, 0.15, EASE.out) * 0.06;
  const blink = Math.abs(t - tCPU - 0.4) < 0.07 ? 0.6 : 0;
  return (
    <AbsoluteFill style={{ background: '#0c0f1a', transform: `translate(${(r() - 0.5) * shake}px, ${(r() - 0.5) * shake}px)` }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {/* height chart */}
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#2b3142,#1a1f2c)' }} />
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 120, right: 120, top: 520 + i * 90, height: 4, background: 'rgba(255,255,255,.22)' }}><span style={{ position: 'absolute', left: -70, top: -22, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: 'rgba(255,255,255,.4)' }}>{8 - i}′</span></div>)}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1300, bottom: 0, background: 'linear-gradient(180deg,#141822,#0a0c12)' }} />
        <Chip x={540} y={1230} size={600} mood={t > tCPU ? 'shock' : 'scared'} sweat={1} squash={blink} seed={71} look={t > tPlayer && t < tBanned ? -0.6 : 0} />
        <Placard x={540} y={1070} text="VAN 152" size={64} />
      </AbsoluteFill>
      {/* police lights */}
      <AbsoluteFill style={{ background: siren ? 'radial-gradient(circle at 0% 30%, rgba(255,40,60,.45), transparent 55%)' : 'radial-gradient(circle at 100% 30%, rgba(40,110,255,.45), transparent 55%)', mixBlendMode: 'screen' }} />
      <BigText y={300} at={0.05} out={tBanned - 0.15} size={66} rot={-2}>VALORANT BANNED…</BigText>
      {t > tPlayer && t < tBanned - 0.1 && <div style={{ position: 'absolute', left: 540, top: 430, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 26px', borderRadius: 16, background: '#0b0d14', border: `4px solid ${C.green}`, fontFamily: fonts.head, fontWeight: 900, fontSize: 48, color: C.green }}><Icon name="ph:user-bold" size={48} color={C.green} />NOT THE PLAYER</div>}
      <BigText y={300} at={tBanned - 0.05} size={86} color="#fff" rot={-3}>BANNED:</BigText>
      <BigText y={430} at={tCPU - 0.03} size={150} color={C.red} rot={-4}>THE CPU</BigText>
      <Flash at={0.02} d={0.35} max={0.9} />
      <Flash at={tBanned - 0.05} d={0.3} max={0.7} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 1 · the aimbot locks onto everything
const tCheated = P(2, 'cheated'), tLike = P(2, 'Like'), tLot = P(2, 'a lot');
const SNAPS: [number, number, number, string][] = [[K[1] + 0.15, 330, 420, 'e'], [K[1] + 0.5, 700, 380, 'e'], [K[1] + 0.85, 520, 560, 'e'], [tLike - 0.05, 860, 250, 'fly'], [tLot + 0.05, 240, 250, 'cat']];
export const sfx1: SfxEvent[] = [
  ...SNAPS.slice(0, 3).map(([at]) => ({ t: at, name: 'bleepHi' as const, vol: 0.3, note: 'snap' })),
  { t: tCheated, name: 'cartoonLaugh', vol: 0.25 }, { t: tLike - 0.05, name: 'clownHorn', vol: 0.4, note: 'locks on the fly' }, { t: tLot + 0.05, name: 'squeak', vol: 0.4, note: 'locks on the cat poster' },
];
export const Beat1: React.FC = () => {
  const { t } = useTF();
  const cur = SNAPS.filter(([at]) => t >= at).pop();
  const prev = SNAPS[Math.max(0, SNAPS.findIndex((s) => s === cur) - 1)];
  const u = cur ? ramp(t, cur[0], 0.12, EASE.out) : 0;
  const cx = cur ? lerp(prev[1], cur[1], u) : 540, cy = cur ? lerp(prev[2], cur[2], u) : 420;
  const kills = Math.min(99, Math.floor(ramp(t, K[1], 2.2, EASE.in) * 99));
  const fly = { x: 860 + Math.sin(t * 13) * 26, y: 250 + Math.cos(t * 17) * 18 };
  return (
    <AbsoluteFill style={{ filter: 'sepia(0.25) saturate(1.1)' }}>
      <VBg top="#4a3448" bot="#140e18" grid={false} />
      {/* monitor */}
      <div style={{ position: 'absolute', left: 70, top: 150, width: 940, height: 600, borderRadius: 20, background: '#07060a', boxShadow: '0 0 0 10px #241a22, 0 40px 90px rgba(0,0,0,.6)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 16, borderRadius: 8, background: 'linear-gradient(180deg,#5a7a9a,#c8a070)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 170, background: '#8a6a4a' }} />
          {[[330 - 70, 420 - 150], [700 - 70, 380 - 150], [520 - 70, 560 - 150]].map(([x, y], k) => <div key={k} style={{ position: 'absolute', left: x - 22, top: y - 30, width: 44, height: 90, borderRadius: '22px 22px 6px 6px', background: '#2a2228', opacity: t > SNAPS[k][0] + 0.15 ? 0.2 : 1 }} />)}
          {/* cat poster */}
          <div style={{ position: 'absolute', left: 240 - 70 - 60, top: 250 - 150 - 70, width: 120, height: 140, borderRadius: 8, background: '#f2e3c2', border: '5px solid #6b4a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:cat-bold" size={80} color="#6b4a2a" /></div>
          {/* crosshair */}
          <svg style={{ position: 'absolute', left: cx - 70 - 60, top: cy - 150 - 60 }} width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="38" fill="none" stroke="#ff2e4d" strokeWidth="6" /><path d="M60 6 V34 M60 86 V114 M6 60 H34 M86 60 H114" stroke="#ff2e4d" strokeWidth="6" /><circle cx="60" cy="60" r="5" fill="#ff2e4d" /></svg>
          <div style={{ position: 'absolute', right: 20, top: 16, padding: '6px 16px', borderRadius: 10, background: 'rgba(0,0,0,.6)', fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, color: '#fff' }}>KILLS {kills}</div>
          <div style={{ position: 'absolute', left: 20, top: 16, padding: '6px 16px', borderRadius: 10, background: C.red, fontFamily: fonts.head, fontWeight: 900, fontSize: 34, color: '#fff' }}>AIMBOT: ON</div>
        </div>
      </div>
      {/* the fly (outside the screen, on the wall) */}
      <svg style={{ position: 'absolute', left: fly.x - 20, top: fly.y + 560 }} width="40" height="30" viewBox="0 0 40 30"><ellipse cx="20" cy="18" rx="8" ry="7" fill="#111" /><ellipse cx="12" cy="8" rx="9" ry="6" fill="rgba(200,220,255,.7)" transform={`rotate(${Math.sin(t * 80) * 25} 14 12)`} /><ellipse cx="28" cy="8" rx="9" ry="6" fill="rgba(200,220,255,.7)" transform={`rotate(${-Math.sin(t * 80) * 25} 26 12)`} /></svg>
      {t > tLike - 0.05 && <div style={{ position: 'absolute', left: fly.x - 50, top: fly.y + 515, width: 100, height: 100, borderRadius: '50%', border: `6px solid ${C.red}`, transform: `scale(${1.6 - 0.6 * ramp(t, tLike - 0.05, 0.15)})` }} />}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 820, height: 40, background: '#2a2024' }} />
      <Shady x={300} y={1310} size={480} seed={72} />
      <Chip x={800} y={830} size={210} mood={t > tLike ? 'shock' : 'sus'} look={-1} seed={73} />
      <BigText y={650} at={tLot - 0.05} size={74} color={C.amber} rot={4}>LIKE… A LOT</BigText>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2 · the bouncer bans account + hardware, Chip panics
const tRiot = P(3, 'Riot'), tAccount = P(3, 'account'), tHardware = P(3, 'hardware'), tWait = C0(4), tWhat = P(4, 'What');
export const sfx2: SfxEvent[] = [
  { t: tRiot - 0.15, name: 'stomp', vol: 0.55, note: 'bouncer lands' }, { t: tAccount - 0.02, name: 'woodHit', vol: 0.7, note: 'gavel: account' },
  { t: tHardware - 0.05, name: 'fallWhistle', vol: 0.35 }, { t: tHardware + 0.25, name: 'woodHit', vol: 0.8, note: 'gavel: hardware' }, { t: tHardware + 0.3, name: 'alarm', vol: 0.25, dur: 0.7 },
  { t: tWait - 0.03, name: 'gasp', vol: 0.5, note: 'Chip talks' }, { t: tWait + 0.05, name: 'zoomFast', vol: 0.35 },
];
export const Beat2: React.FC = () => {
  const { f, fps, t } = useTF();
  const zoom = 1 + ramp(t, tWait - 0.08, 0.25, EASE.out) * 0.55;
  const land = springAt(f, fps, tRiot - 0.2, { damping: 12, stiffness: 180 });
  const card = (x: number, at: number, icon: string, label: string) => {
    const s = springAt(f, fps, at - 0.2, { damping: 12, stiffness: 200 });
    return t > at - 0.25 && (
      <div style={{ position: 'absolute', left: x, top: 330, width: 400, height: 260, transform: `translate(-50%,-50%) scale(${s})`, borderRadius: 26, background: 'linear-gradient(160deg,#18213a,#0e1426)', border: '4px solid rgba(255,255,255,.14)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: fonts.head, fontWeight: 900, fontSize: 44, color: C.ink }}>
        <Icon name={icon} size={100} color={C.ink} />{label}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ transformOrigin: '72% 62%', transform: `scale(${zoom})` }}>
      <VBg top="#2a1430" bot="#0a0610" />
      <div style={{ position: 'absolute', left: 540, top: 120, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 60, color: '#ff4d6d', whiteSpace: 'nowrap', textShadow: '0 0 20px #ff2e4d, 0 0 60px #ff2e4d' }}>VALORANT CLUB</div>
      {card(290, tAccount, 'ph:user-circle-bold', 'ACCOUNT')}
      {card(790, tHardware, 'ph:cpu-bold', 'HARDWARE')}
      {t > tAccount && <Stamp x={290} y={340} at={tAccount} text="BANNED" size={60} rot={-10} />}
      {t > tHardware + 0.22 && <Stamp x={790} y={340} at={tHardware + 0.25} text="BANNED" size={60} rot={8} />}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - land) * -900}px)` }}><Bouncer x={330} y={1360} size={640} glasses={1} light={t > tAccount ? 1 : 0} seed={74} lean={-4} /></div>
      <Chip x={790} y={1180} size={360} mood={t > tWait - 0.05 ? 'shock' : 'scared'} sweat={1} red={t > tHardware + 0.25 ? 0.4 : 0} arms={t > tWait ? 'up' : 'none'} squash={t > tWait ? 0.4 * Math.exp(-(t - tWait) * 6) : 0} seed={75} look={-0.5} />
      {t > tHardware + 0.25 && <div style={{ position: 'absolute', left: 790, top: 1010, transform: `translate(-50%,-50%) rotate(-12deg) scale(${springAt(f, fps, tHardware + 0.3, { damping: 9, stiffness: 260 })})`, padding: '4px 16px', background: C.red, color: '#fff', fontFamily: fonts.head, fontWeight: 900, fontSize: 40, borderRadius: 8 }}>BANNED</div>}
      {t > tWait && <Bubble x={720} y={740} at={tWait} text={t > tWhat ? 'WAIT! WHAT DID I DO?!' : 'WAIT!'} w={460} size={46} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3 · "He sold it." + crickets
const tNormal = P(5, 'most normal'), tSold = P(5, 'sold'), tSoldEnd = PE(5, 'sold it');
export const sfx3: SfxEvent[] = [
  { t: K[3] + 0.05, name: 'toyWhistle', vol: 0.4, note: 'innocent whistle' }, { t: tNormal, name: 'sparkle', vol: 0.3, note: 'halo' },
  { t: tSold - 0.04, name: 'coins', vol: 0.55, note: 'SOLD' }, { t: tSold, name: 'stomp', vol: 0.35 },
  { t: tSoldEnd + 0.15, name: 'crickets', vol: 0.5, dur: 1.0 },
];
export const Beat3: React.FC = () => {
  const { f, fps, t } = useTF();
  const halo = t > tNormal && t < tSold;
  const sold = t > tSold - 0.04;
  const crickets = t > tSoldEnd + 0.15;
  return (
    <AbsoluteFill>
      <VBg top="#203a52" bot="#0a1420" />
      {/* listing card */}
      <div style={{ position: 'absolute', left: 540, top: 470, transform: `translate(-50%,-50%) scale(${springAt(f, fps, K[3] - 0.1, { damping: 13, stiffness: 170 })})`, width: 720, borderRadius: 30, background: '#f3f4f8', overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.5)', fontFamily: fonts.head, color: '#1a1d2a' }}>
        <div style={{ position: 'relative', height: 380, background: 'linear-gradient(180deg,#dfe4ee,#c9d0de)' }}>
          <div style={{ position: 'absolute', left: 230, top: 140, width: 260, height: 220, background: 'linear-gradient(180deg,#c8a070,#a07a4a)', borderRadius: 10 }} />
          <Chip x={360} y={330} size={240} mood={crickets ? 'sus' : 'scared'} seed={76} look={0.6} />
        </div>
        <div style={{ padding: '22px 34px 30px' }}>
          <div style={{ fontWeight: 900, fontSize: 44 }}>USED CPU · €180</div>
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 32, color: '#5a6274', marginTop: 6 }}>"works perfectly" ★★★★★</div>
        </div>
      </div>
      {sold && <Stamp x={540} y={560} at={tSold - 0.04} text="SOLD" size={130} rot={-12} color={C.green} />}
      <Shady x={540} y={1300} size={520} whistle={!crickets} seed={77} />
      {halo && <div style={{ position: 'absolute', left: 540 - 120, top: 780, width: 240, height: 54, borderRadius: '50%', border: '12px solid #ffe27a', boxShadow: '0 0 40px #ffe27a', opacity: Math.sin(t * 20) > -0.7 ? 1 : 0.3 }} />}
      {crickets && <Bubble x={540} y={830} at={tSoldEnd + 0.15} text="…" w={200} size={70} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · Leo's great deal → KICKED
const tMeet = P(6, 'Meet Leo'), tDeal = P(6, 'great deal'), tNever = P(6, 'Never'), tOpens = P(7, 'opens'), tKicked = P(7, 'kicked');
export const sfx4: SfxEvent[] = [
  { t: tMeet - 0.05, name: 'sillyPop', vol: 0.45, note: 'Leo pops in' }, { t: tDeal, name: 'sparkle', vol: 0.4, note: 'heart eyes' },
  { t: tNever, name: 'levelUp', vol: 0.35, note: '0 CHEATS badge' }, { t: tOpens, name: 'clickModern', vol: 0.45, note: 'PLAY' },
  { t: tKicked - 0.12, name: 'scratch', vol: 0.45, note: 'record stop' }, { t: tKicked, name: 'punch', vol: 0.55, note: 'boot kick' },
  ...[0, 1, 2].map((k) => ({ t: tKicked + 0.25 + k * 0.22, name: 'impactZoom' as const, vol: 0.4, note: 'dramatic zoom' })),
  { t: C1(7) + 0.55, name: 'sadTrombone', vol: 0.4 },
];
export const Beat4: React.FC = () => {
  const { f, fps, t } = useTF();
  const kicked = t > tKicked;
  const zk = kicked ? Math.min(3, Math.floor((t - tKicked - 0.25) / 0.22) + 1) : 0;
  const zoom = [1, 1.25, 1.55, 1.9][Math.max(0, zk)];
  const leoIn = ramp(t, tMeet - 0.15, 0.4, EASE.back);
  const fly = kicked ? ramp(t, tKicked, 0.12, EASE.out) * (1 - ramp(t, tKicked + 0.15, 0.35, EASE.out)) : 0;
  const screen = t < tOpens ? 'deal' : t < tKicked ? 'loading' : 'ban';
  return (
    <AbsoluteFill>
    <AbsoluteFill style={{ transformOrigin: '50% 55%', transform: `scale(${zoom})` }}>
      <VBg top="#1b2850" bot="#0a0f22" />
      {/* monitor */}
      <div style={{ position: 'absolute', left: 90, top: 170, width: 900, height: 560, borderRadius: 20, background: '#0a0c12', boxShadow: `0 0 0 8px #1b1f2b, 0 30px 80px rgba(0,0,0,.6), 0 0 120px ${screen === 'ban' ? C.red : C.cyan}44`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 16, borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, color: '#fff', background: screen === 'ban' ? `radial-gradient(circle, rgba(255,46,77,.6), #2a0610 80%)` : screen === 'loading' ? '#141824' : '#f3f4f8' }}>
          {screen === 'deal' && <div style={{ textAlign: 'center', color: '#1a1d2a' }}>
            <div style={{ fontWeight: 900, fontSize: 60 }}>USED CPU</div>
            <div style={{ fontWeight: 900, fontSize: 120, color: C.green, lineHeight: 1 }}>€180</div>
            {t > tDeal && <div style={{ marginTop: 10, transform: `scale(${springAt(f, fps, tDeal, { damping: 8, stiffness: 260 })})`, display: 'inline-block', padding: '6px 24px', borderRadius: 12, background: C.amber, color: '#fff', fontWeight: 900, fontSize: 44 }}>GREAT DEAL!</div>}
          </div>}
          {screen === 'loading' && <><div style={{ fontWeight: 900, fontSize: 70, letterSpacing: '0.1em', color: '#ff4655' }}>VALORANT</div><div style={{ marginTop: 20, width: 420, height: 16, borderRadius: 8, background: '#2a3042', overflow: 'hidden' }}><div style={{ width: `${ramp(t, tOpens, 0.8) * 100}%`, height: '100%', background: '#ff4655' }} /></div></>}
          {screen === 'ban' && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}><Icon name="ph:prohibit-bold" size={90} color="#fff" /><div style={{ textAlign: 'left' }}><div style={{ fontWeight: 900, fontSize: 80, lineHeight: 1 }}>VAN 152</div><div style={{ fontWeight: 700, fontSize: 32, opacity: 0.85 }}>HARDWARE BANNED</div></div></div>}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, height: 40, background: 'linear-gradient(180deg,#2a2f3d,#151924)' }} />
      <Chip x={880} y={792} size={170} mood={kicked ? 'shock' : 'happy'} seed={78} look={-0.8} />
      {/* Leo */}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${fly * -90}px, ${(1 - leoIn) * 700}px) rotate(${fly * -9}deg)`, transformOrigin: '540px 1400px' }}>
        <Leo x={540} y={1420} size={640} mood={kicked ? 'shock' : t > tDeal ? 'heart' : 'excited'} look={0.3} seed={79} typing={t > tOpens - 0.3 && t < tKicked} />
        {t > tMeet && t < tKicked && <div style={{ position: 'absolute', left: 540, top: 880, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tMeet, { damping: 10, stiffness: 220 })}) rotate(3deg)`, padding: '8px 26px', borderRadius: 14, background: '#fff', color: '#1a1d2a', fontFamily: fonts.head, fontWeight: 900, fontSize: 46, whiteSpace: 'nowrap', boxShadow: '0 12px 30px rgba(0,0,0,.4)' }}>LEO {t > tNever ? <span style={{ color: C.green }}>· 0 CHEATS ✓</span> : ''}</div>}
      </div>
      <Boot x={540} y={1150} at={tKicked} size={420} />
    </AbsoluteFill>
      {kicked && <BigText y={300} at={tKicked + 0.02} out={tKicked + 0.4} size={150} color={C.red} rot={-6}>KICKED!</BigText>}
      <Flash at={tKicked - 0.02} color="#ff2e4d" d={0.3} max={0.55} />
    </AbsoluteFill>
  );
};
