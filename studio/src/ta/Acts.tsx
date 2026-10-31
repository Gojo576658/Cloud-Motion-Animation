// "Teen Admin" acts. Each beat (one spoken line) returns its own layout and Vio placement, so the frame keeps
// changing: full-screen footage, Vio close-ups, Vio in the corner, the classic left-third shot. Meme cutaways
// and the SFX list live at the bottom (MEMES, SFX_EVENTS).
import React from 'react';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P, TTL } from './ttime';
import { useTF, Pop, Mono } from '../tg/kit';
import { Stamp } from '../cpu/fx';
import { A, AbsoluteFill, GridBg, Phone, Label, Panel, Helper, Chip, Crossed, Tile, Subscribe, Host, type Place, Stock, Shout, RowCount, Kid, Errors, Dashboard, Doors, Redacted, type Meme, CX } from './kit';

type Beat = { place: Place; body: React.ReactNode; glow?: string; grid?: boolean; decode?: number };
const R = 1390; // content centre when Vio is in a close-up (left half is his)

// small pieces
const Counter: React.FC<{ x: number; y: number; at: number; to: number; label: string; red?: boolean; size?: number }> = ({ x, y, at, to, label, red = false, size = 130 }) => {
  const { t } = useTF();
  if (t < at - 0.05) return null;
  const v = Math.round(to * ramp(t, at, 1.1, EASE.out));
  return <Pop x={x} y={y} at={at}><div style={{ textAlign: 'center' }}><div style={{ ...fonts.H, fontWeight: 900, fontSize: size, color: red ? A.red : A.white, letterSpacing: '-0.04em', lineHeight: 1 }}>{v.toLocaleString('en-US')}</div><div style={{ marginTop: 10 }}><Mono size={26} color={A.soft}>{label}</Mono></div></div></Pop>;
};
const Bubble: React.FC<{ x: number; y: number; at: number; text: string; who: string }> = ({ x, y, at, text, who }) => (
  <Pop x={x} y={y} at={at}><div style={{ width: 640, padding: '20px 26px', borderRadius: 22, borderBottomLeftRadius: 6, background: A.white }}><div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 16, letterSpacing: '0.14em', color: '#666' }}>{who}</div><div style={{ ...fonts.H, fontWeight: 800, fontSize: 36, color: '#111', marginTop: 6 }}>{text}</div></div></Pop>
);
const IdCard: React.FC<{ x: number; y: number; at: number; checked: number; stamp?: string; red?: boolean }> = ({ x, y, at, checked, stamp, red = true }) => {
  const { t } = useTF();
  return <Pop x={x} y={y} at={at}><div style={{ position: 'relative', width: 620, height: 380, borderRadius: 26, background: '#ecebe6', boxShadow: '0 40px 90px rgba(0,0,0,.6)', padding: 34 }}>
    <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, letterSpacing: '0.16em', color: '#777' }}>DIGITAL ID</div>
    <div style={{ display: 'flex', gap: 26, marginTop: 20 }}><div style={{ width: 150, height: 180, borderRadius: 14, background: '#c9c8c2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:user-fill" size={110} color="#888" /></div>
      <div style={{ ...fonts.H, fontWeight: 800, fontSize: 34, color: '#111', lineHeight: 1.5 }}>NAME: <span style={{ color: A.red }}>admin</span><br />ROLE: <span style={{ color: A.red }}>everything</span></div></div>
    {t > checked && <div style={{ position: 'absolute', left: 34, bottom: 26, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: red ? A.red : '#111' }}>{stamp}</div>}
  </div></Pop>;
};
const Scale: React.FC<{ at: number; left: string; right: string; tilt: number }> = ({ at, left, right, tilt }) => {
  const { t } = useTF();
  const r = tilt * ramp(t, at + 0.6, 0.8, EASE.inOut);
  return <Pop x={CX} y={520} at={at}><div style={{ position: 'relative', width: 980, height: 520 }}>
    <div style={{ position: 'absolute', left: 485, top: 120, width: 10, height: 380, background: A.soft }} />
    <div style={{ position: 'absolute', left: 90, top: 120, width: 800, height: 10, background: A.soft, transform: `rotate(${r}deg)` }}>
      {[0, 1].map((k) => <div key={k} style={{ position: 'absolute', [k ? 'right' : 'left']: -40, top: 10, width: 300, transform: `rotate(${-r}deg)`, textAlign: 'center' }}><div style={{ height: 120, borderLeft: `3px solid ${A.soft}`, borderRight: `3px solid ${A.soft}`, margin: '0 60px' }} /><div style={{ padding: '18px 10px', borderRadius: 14, background: A.panel, border: `2px solid ${k ? A.red : A.line}`, ...fonts.H, fontWeight: 800, fontSize: 30, color: k ? A.red : A.white, lineHeight: 1.15 }}>{k ? right : left}</div></div>)}
    </div>
  </div></Pop>;
};

// ================================================================ the beats
const B: Record<number, (t: number) => Beat> = {
  // ---- ACT 0 · cold open
  0: () => ({ place: 'none', grid: false, body: <><Stock name="night-pc" at={C0(0)} dark={0.35} /><Shout x={200} y={230} at={C0(0) + 0.4} text="2:00 AM" size={120} align="left" /><Pop x={420} y={320} at={C0(0) + 0.8}><Mono size={28} color={A.white}>ONE KID. ONE BEDROOM.</Mono></Pop></> }),
  1: () => ({ place: 'none', glow: 'rgba(255,43,61,.14)', body: <><div style={{ position: 'absolute', left: 960, top: 430, transform: 'translate(-50%,-50%)' }}><RowCount at={P(1, 'Seventeen trillion')} d={3} size={150} /></div><Shout x={960} y={620} at={P(1, 'rows of data')} text="ROWS OF DATA" size={70} /><Shout x={960} y={760} at={P(1, 'Inside Microsoft')} text="INSIDE MICROSOFT" size={70} red /></> }),
  2: (t) => ({ place: 'corner', body: <><Kid x={1000} y={900} size={600} screen={<div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 30, color: A.red }}>17,333,335,124,315</div>} />{t > P(2, 'his parents are asleep') && <Pop x={1380} y={250} at={P(2, 'his parents are asleep')}><Label size={30}><Icon name="ph:moon-stars-fill" size={34} color={A.white} /> PARENTS: ASLEEP</Label></Pop>}{t > P(2, 'checks the math') && <Shout x={1380} y={380} at={P(2, 'checks the math')} text="checks the math. again." size={56} />}</> }),
  3: (t) => ({ place: 'none', body: t < P(3, 'Now he has') - 0.1 ? <><Tile x={960} y={420} at={C0(3) + 0.1} icon="ph:book-open-text-fill" label="FRIDAY · SCHOOLWORK" size={200} /></> : <><Dashboard x={960} y={470} at={P(3, 'Now he has')} admin /><Shout x={960} y={860} at={P(3, 'only Microsoft employees')} text="EMPLOYEES ONLY" size={60} red /></> }),
  4: (t) => ({ place: 'close', body: <><Shout x={R} y={380} at={P(4, 'five thousand dollars')} text="$5,000" size={170} red />{t > P(4, 'Was that fair') && <Shout x={R} y={640} at={P(4, 'Was that fair')} text="FAIR?" size={120} />}</> }),
  5: (t) => ({ place: 'left', body: <><Chip x={CX} y={190} at={C0(5) + 0.1} red solid>VIO · YOUR HOST</Chip>
    {t > P(5, 'Wi-Fi password') - 0.2 && t < P(5, 'So this is') && <Pop x={CX} y={480} at={P(5, 'Wi-Fi password') - 0.2}><Panel w={620} pad={30}><Mono size={20} color={A.dim}>WI-FI PASSWORD</Mono><div style={{ marginTop: 14, height: 64, borderRadius: 12, background: '#0a0a0d', border: `2px solid ${t > P(5, 'Wi-Fi password') + 0.6 ? A.red : A.line}`, display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: fonts.mono, fontSize: 34, color: A.white }}>••••••••</div>{t > P(5, 'Wi-Fi password') + 0.6 && <div style={{ marginTop: 12 }}><Mono size={22} color={A.red}>INCORRECT PASSWORD</Mono></div>}</Panel></Pop>}
    {t > P(5, 'So this is') && <Shout x={CX} y={480} at={P(5, 'through the front door')} text={'THROUGH THE\nFRONT DOOR'} size={110} />}</> }),
  // ---- ACT 1 · the kid and the bot
  6: (t) => ({ place: 'left', body: <><Pop x={CX} y={330} at={C0(6) + 0.1}><div style={{ width: 230, height: 230, borderRadius: '50%', background: '#16161c', border: `5px solid ${A.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:user-fill" size={150} color={A.soft} /></div></Pop><Shout x={CX} y={540} at={P(6, 'Faav')} text={'"FAAV"'} size={96} />
    {[['Sixteen years old', '16 YEARS OLD'], ['A student', 'STUDENT'], ['a bug hunter', 'BUG HUNTER']].map(([p, l], i) => t > P(6, p) - 0.05 && <Chip key={l} x={960 + i * 310} y={720} at={P(6, p)} red={i === 2}>{l}</Chip>)}</> }),
  7: (t) => ({ place: 'none', body: <><Kid x={960} y={880} size={620} type />{t > P(7, 'He was not gaming') && <Shout x={960} y={180} at={P(7, 'He was not gaming')} text="HE WAS NOT GAMING." size={96} red />}</> }),
  8: (t) => ({ place: 'corner', body: <><Shout x={860} y={200} at={C0(8) + 0.2} text="BUG BOUNTY" size={110} />
    {[['You find the problem', 'ph:magnifying-glass-bold', 'FIND IT'], ['you report it', 'ph:envelope-simple-fill', 'REPORT IT'], ['you get paid', 'ph:currency-dollar-bold', 'GET PAID']].map(([p, ic, l], i) => t > P(8, p) - 0.05 && <Tile key={l} x={560 + i * 330} y={540} at={P(8, p)} icon={ic} label={l} red={i === 2} size={190} />)}
    {t > P(8, 'before criminals do') && t < P(8, 'You find') && <Chip x={860} y={820} at={P(8, 'before criminals do')} red>BEFORE CRIMINALS DO</Chip>}</> }),
  9: (t) => ({ place: 'left', body: <><Helper x={CX} y={860} size={430} mood={t > P(9, 'Antares') ? 'proud' : 'happy'} sign="ANTARES" signAt={P(9, 'Antares')} wave={t > P(9, 'Antares')} /><Pop x={CX} y={180} at={P(9, 'AI hacking assistant')}><Label size={30}><Icon name="ph:robot-fill" size={34} color={A.white} /> HIS OWN AI ASSISTANT</Label></Pop></> }),
  10: (t) => ({ place: 'none', grid: false, body: <><Stock name="typing" at={C0(10)} dark={0.45} /><Shout x={960} y={300} at={P(10, 'never sleeps')} text="NEVER SLEEPS" size={130} />
    {[['pokes at websites', 'POKES'], ['reads the replies', 'READS'], ['looks weird', 'FLAGS THE WEIRD STUFF']].map(([p, l], i) => t > P(10, p) && <Chip key={l} x={560 + i * 400} y={620} at={P(10, p)} red={i === 2}>{l}</Chip>)}</> }),
  11: (t) => ({ place: 'left', body: <><Shout x={CX} y={220} at={C0(11) + 0.1} text="AUG 25" size={110} red /><Helper x={1020} y={860} size={300} mood="proud" />{t > P(11, 'A public doorway') && <><Tile x={1520} y={600} at={P(11, 'A public doorway')} icon="ph:door-open-fill" label="A PUBLIC DOORWAY" size={180} red />{t > P(11, 'called Titan') && <Pop x={1520} y={820} at={P(11, 'called Titan')}><Label size={34}>TITAN</Label></Pop>}</>}</> }),
  12: () => ({ place: 'close', body: <><Shout x={R} y={400} at={P(12, 'Five thousand dollars')} text="$5,000" size={170} red /><Pop x={R} y={600} at={P(12, 'coming back')}><Label size={32}><Icon name="ph:bookmark-simple-fill" size={34} color={A.white} /> REMEMBER THIS</Label></Pop></> }),
  // ---- ACT 2 · Titan
  13: () => ({ place: 'corner', body: <Dashboard x={900} y={470} at={C0(13) + 0.1} /> }),
  14: () => ({ place: 'none', grid: false, body: <><Stock name="cables" at={C0(14)} dark={0.4} /><Shout x={960} y={460} at={P(14, 'very, very big')} text={'VERY, VERY\nBIG DATABASES'} size={120} /></> }),
  15: (t) => ({ place: 'none', grid: false, body: t < P(15, 'Picture an office') - 0.1 ? <><Stock name="restricted-door" at={C0(15)} dark={0.3} /><Shout x={960} y={180} at={C0(15) + 0.3} text="EMPLOYEES ONLY" size={110} red /></> : <><GridBg x={60} /><Doors at={P(15, 'Picture an office')} open={999} /><Pop x={960} y={860} at={P(15, 'only staff badges')}><Label size={30}><Icon name="ph:identification-badge-fill" size={34} color={A.white} /> STAFF BADGES ONLY</Label></Pop></> }),
  16: (t) => ({ place: 'left', body: <><Crossed x={1030} y={420} at={P(16, "didn't have a badge")} icon="ph:identification-badge-fill" label="NO BADGE" size={110} />{t > P(16, 'a hunch') && <Shout x={1520} y={420} at={P(16, 'a hunch')} text={'A\nHUNCH'} size={110} red />}</> }),
  17: () => ({ place: 'close', body: <Shout x={R} y={460} at={P(17, 'Proving it')} text={'PROVING\nIT.'} size={130} red /> }),
  // ---- ACT 3 · ten days
  18: () => ({ place: 'none', body: <><Shout x={960} y={150} at={C0(18) + 0.1} text="10 DAYS" size={110} /><Errors at={P(18, 'everything he tried failed')} n={10} every={0.32} x={960} y={540} /></> }),
  19: (t) => ({ place: 'corner', body: <><Kid x={880} y={900} size={560} type />{[['He had school', 'ph:student-fill', 'SCHOOL'], ['He had homework', 'ph:book-open-text-fill', 'HOMEWORK'], ['not exactly a small target', 'ph:buildings-fill', 'MICROSOFT']].map(([p, ic, l], i) => t > P(19, p) && <Tile key={l} x={1500} y={220 + i * 230} at={P(19, p)} icon={ic} label={l} size={130} red={i === 2} />)}</> }),
  20: () => ({ place: 'none', body: <><Shout x={960} y={200} at={C0(20) + 0.2} text="FRI · SEPT 4" size={110} red /><Kid x={960} y={920} size={560} type /></> }),
  21: () => ({ place: 'none', glow: 'rgba(255,43,61,.15)', body: <><Shout x={960} y={300} at={C0(21) + 0.1} text="1:00 AM" size={170} /><Pop x={960} y={520} at={C0(21) + 0.6}><Mono size={30} color={A.soft}>SATURDAY</Mono></Pop></> }),
  22: (t) => ({ place: 'corner', body: <><Dashboard x={900} y={440} at={C0(22)} admin />{t > P(22, 'run his own') && <Pop x={900} y={860} at={P(22, 'run his own')}><div style={{ padding: '16px 26px', borderRadius: 12, background: '#050507', border: `2px solid ${A.line}`, fontFamily: fonts.mono, fontSize: 30, color: A.white }}>&gt; query accepted · <span style={{ color: A.red }}>role: admin</span></div></Pop>}</> }),
  23: (t) => ({ place: 'left', body: <><Pop x={CX} y={260} at={C0(23) + 0.1}><Icon name="ph:key-fill" size={200} color={A.red} /></Pop><Shout x={CX} y={440} at={P(23, 'master key')} text="THE MASTER KEY" size={84} />
    {[['see everything', 'SEE EVERYTHING'], ['change settings', 'CHANGE SETTINGS'], ['run the show', 'RUN THE SHOW']].map(([p, l], i) => t > P(23, p) && <Chip key={l} x={950 + i * 330} y={620} at={P(23, p)}>{l}</Chip>)}
    {t > P(23, 'started counting') && <div style={{ position: 'absolute', left: CX, top: 800, transform: 'translate(-50%,-50%)' }}><RowCount at={P(23, 'started counting')} d={2.5} size={70} to={17333335124315} /></div>}</> }),
  24: (t) => ({ place: 'left', body: <><IdCard x={CX} y={430} at={C0(24) + 0.2} checked={P(24, 'never checked')} stamp="SIGNATURE: NEVER CHECKED" />{t > P(24, 'what the digital ID said') && t < P(24, 'never checked') && <Pop x={CX} y={760} at={P(24, 'what the digital ID said')}><Label size={28}><Icon name="ph:eye-fill" size={30} color={A.white} /> READ WHAT IT SAYS</Label></Pop>}{t > P(24, 'never checked') && <Stamp x={CX} y={760} at={P(24, 'never checked') + 0.2} text="NOT VERIFIED" size={66} rot={-5} />}</> }),
  25: (t) => ({ place: 'none', grid: t > P(25, 'any keycard'), body: t < P(25, 'any keycard') - 0.2 ? <><Stock name="corridor" at={C0(25)} dark={0.35} /><Shout x={960} y={200} at={P(25, 'like a hotel')} text="A HOTEL..." size={110} /></> : <><Doors at={P(25, 'any keycard') - 0.2} open={P(25, 'any keycard')} /><Shout x={960} y={180} at={P(25, 'any keycard')} text="ANY KEYCARD. ANY ROOM." size={84} red /></> }),
  // ---- ACT 4 · behind the door
  26: () => ({ place: 'left', body: <Shout x={CX} y={460} at={C0(26) + 0.1} text={'BEHIND\nTHE DOORS?'} size={130} /> }),
  27: () => ({ place: 'left', body: <><Counter x={CX} y={430} at={C0(27) + 0.3} to={25000} label="ACCOUNT & EMAIL ENTRIES" size={170} /><Pop x={CX} y={720} at={C0(27) + 0.3}><Mono size={22} color={A.dim}>PER FAAV'S WRITE-UP · THE REGISTER</Mono></Pop></> }),
  28: (t) => ({ place: 'none', body: <><Counter x={960} y={200} at={C0(28) + 0.1} to={17990} label="EMPLOYEE EMAIL RECORDS" size={110} />
    <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>{t > P(28, 'who reports') && [[960, 470, 700, 620], [960, 470, 960, 620], [960, 470, 1220, 620], [700, 680, 600, 800], [700, 680, 800, 800], [1220, 680, 1320, 800]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={A.line} strokeWidth={4} opacity={ramp(t, P(28, 'who reports') + i * 0.08, 0.3)} />)}</svg>
    {[['Job titles', 960, 440, 'JOB TITLES'], ['Departments', 700, 650, 'DEPARTMENTS'], ['who reports to whom', 1220, 650, 'WHO REPORTS TO WHOM']].map(([p, x, y, l]) => t > P(28, p as string) && <Chip key={l as string} x={x as number} y={y as number} at={P(28, p as string)} red={l === 'WHO REPORTS TO WHOM'}>{l}</Chip>)}
    {t > P(28, 'who reports') && [600, 800, 1320].map((x, i) => <Pop key={x} x={x} y={820} at={P(28, 'who reports') + 0.3 + i * 0.1}><Icon name="ph:user-fill" size={60} color={A.soft} /></Pop>)}</> }),
  29: (t) => ({ place: 'corner', body: <><Tile x={760} y={430} at={P(29, 'useful to scammers')} icon="ph:mask-sad-fill" label="USEFUL TO SCAMMERS" red size={190} />{t > P(29, 'never tested') && <Tile x={1180} y={430} at={P(29, 'never tested')} icon="ph:check-circle-fill" label="HE NEVER TESTED IT" size={190} />}</> }),
  30: (t) => ({ place: 'none', body: <><Counter x={620} y={480} at={C0(30) + 0.2} to={24569} label="DASHBOARDS" size={150} />{t > P(30, 'four hundred thousand') && <Counter x={1320} y={480} at={P(30, 'four hundred thousand')} to={425891} label="CHARTS" size={150} red />}</> }),
  31: (t) => ({ place: 'left', body: <><Pop x={CX} y={330} at={C0(31) + 0.2}><Panel w={720} pad={22}><Mono size={20} color={A.dim}>2 TINY BING SAMPLES</Mono>{[0, 1].map((k) => <div key={k} style={{ display: 'flex', gap: 12, marginTop: 12 }}>{[200, 180, 160].map((w, j) => <div key={j} style={{ width: w, height: 30, borderRadius: 6, background: '#2a2a33', filter: 'blur(2px)' }} />)}</div>)}</Panel></Pop>
    {t > P(31, 'not precise') && <Pop x={CX} y={650} at={P(31, 'not precise')}><div style={{ position: 'relative', width: 340, height: 220 }}><div style={{ position: 'absolute', left: 50, top: 10, width: 240, height: 200, borderRadius: '50%', border: `4px dashed ${A.red}`, background: 'rgba(255,43,61,.1)' }} /><div style={{ position: 'absolute', left: 145, top: 70 }}><Icon name="ph:map-pin-fill" size={60} color={A.white} /></div></div></Pop>}
    {t > P(31, 'just rough areas') && <Chip x={CX} y={860} at={P(31, 'just rough areas')}>ROUGH AREA · NOT YOUR ADDRESS</Chip>}</> }),
  32: (t) => ({ place: 'none', glow: 'rgba(255,43,61,.16)', body: <><Shout x={960} y={200} at={C0(32) + 0.1} text="17 DATABASES" size={90} /><div style={{ position: 'absolute', left: 960, top: 330, transform: 'translateX(-50%)', display: 'flex', gap: 14 }}>{Array.from({ length: 17 }, (_, i) => <div key={i} style={{ opacity: ramp(t, C0(32) + 0.3 + i * 0.06, 0.2) }}><Icon name="ph:database-fill" size={64} color={i % 4 ? A.soft : A.red} /></div>)}</div>{t > P(32, 'seventeen point three') - 0.3 && <div style={{ position: 'absolute', left: 960, top: 520, transform: 'translate(-50%,-50%)' }}><RowCount at={P(32, 'seventeen point three') - 0.3} d={1.6} size={150} /></div>}{t > P(32, 'trillion rows') && <Shout x={960} y={720} at={P(32, 'trillion rows')} text="ROWS" size={90} />}</> }),
  33: (t) => ({ place: 'left', body: <>{[['an estimate', 'ph:calculator-fill', 'AN ESTIMATE'], ['old and duplicated', 'ph:copy-fill', 'OLD + DUPLICATED DATA'], ["didn't open", 'ph:hand-palm-fill', 'NOT OPENED · NOT TAKEN']].map(([p, ic, l], i) => t > P(33, p) && <Tile key={l} x={960 + i * 320} y={470} at={P(33, p)} icon={ic} label={l} size={170} red={i === 2} />)}<Chip x={CX} y={180} at={C0(33) + 0.1}>TO BE FAIR</Chip></> }),
  34: () => ({ place: 'none', body: <><div style={{ position: 'absolute', left: 960, top: 330, transform: 'translate(-50%,-50%)', opacity: 0.25 }}><RowCount at={C0(34)} d={0.01} size={150} red={false} /></div><Kid x={960} y={980} size={380} /><Shout x={960} y={560} at={P(34, 'from his bedroom')} text="FROM HIS BEDROOM." size={96} red /></> }),
  // ---- ACT 5 · the report
  35: () => ({ place: 'left', body: <Shout x={CX} y={460} at={C0(35) + 0.05} text={'WHAT DID\nHE DO?'} size={130} /> }),
  36: () => ({ place: 'left', body: <><Pop x={CX} y={330} at={C0(36) + 0.1}><Icon name="ph:paper-plane-tilt-fill" size={180} color={A.white} /></Pop><Shout x={CX} y={560} at={C0(36) + 0.2} text="HE REPORTED IT." size={110} red /></> }),
  37: (t) => ({ place: 'corner', body: <><Bubble x={860} y={330} at={P(37, 'stop testing')} who="MICROSOFT · PARAPHRASED" text="Please stop testing." />{t > P(37, 'IP address') && <Bubble x={940} y={600} at={P(37, 'IP address')} who="MICROSOFT · PARAPHRASED" text="Can you share your IP address?" />}<Shout x={860} y={140} at={C0(37) + 0.1} text="MICROSOFT MOVED FAST" size={70} /></> }),
  38: () => ({ place: 'left', body: <><Pop x={CX} y={360} at={C0(38) + 0.2}><Icon name="ph:shield-check-fill" size={200} color={A.white} /></Pop><Chip x={CX} y={600} at={P(38, "it's normal")}>NORMAL PRACTICE</Chip><Pop x={CX} y={720} at={P(38, 'nobody else')}><Mono size={24} color={A.soft}>CONFIRM IT WAS ONLY THE RESEARCHER</Mono></Pop></> }),
  39: () => ({ place: 'none', body: <><Dashboard x={960} y={470} at={C0(39)} /><Stamp x={960} y={470} at={P(39, 'locked down')} text="LOCKED DOWN" size={110} rot={-6} /><Shout x={960} y={150} at={C0(39) + 0.1} text="~1 DAY" size={90} red /></> }),
  40: (t) => ({ place: 'left', body: <Subscribe x={CX} y={460} at={C0(40) + 0.2} press={P(40, 'hit subscribe') + 0.3} /> }),
  // ---- ACT 6 · five thousand
  41: () => ({ place: 'none', body: <><Shout x={960} y={200} at={C0(41) + 0.1} text="SEPT 17" size={90} /><Shout x={960} y={500} at={P(41, 'Five thousand dollars') + 0.3} text="$5,000" size={260} red /></> }),
  42: (t) => ({ place: 'none', body: <Scale at={P(42, 'look at what he found')} left="$5,000" right={'ADMIN ACCESS\n+ TRILLIONS OF ROWS'} tilt={t > P(42, 'Admin access') ? 12 : 0} /> }),
  43: (t) => ({ place: 'corner', body: <>{t > P(43, 'They better') + 2 && <Pop x={860} y={460} at={P(43, 'They better') + 2}><Panel w={980} pad={40}><div style={{ ...fonts.H, fontWeight: 800, fontSize: 52, color: A.white, lineHeight: 1.2 }}>"They better have paid this kid a proper bounty."</div><div style={{ marginTop: 16 }}><Mono size={22} color={A.dim}>A WRITER COVERING THE STORY · LATEST IN CYBER</Mono></div></Panel></Pop>}</> }),
  44: (t) => ({ place: t > P(44, 'So in their eyes') ? 'close' : 'left', body: t > P(44, 'So in their eyes') ? <Shout x={R} y={460} at={P(44, 'So in their eyes')} text={'NOT THAT\nLEVEL?'} size={120} /> : <>
    <Chip x={CX} y={160} at={C0(44) + 0.1}>THE OTHER SIDE</Chip>
    {t > P(44, 'fixed table') && <Pop x={CX} y={450} at={P(44, 'fixed table')}><Panel w={620} pad={24}>{['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((l, i) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 6px', borderBottom: i < 3 ? `2px solid ${A.line}` : 'none', ...fonts.H, fontWeight: 800, fontSize: 34, color: i === 3 ? A.red : A.white }}><span>{l}</span><span>{'$'.repeat(i + 1)}</span></div>)}</Panel></Pop>}
    {t > P(44, 'not on the biggest') && <Pop x={CX} y={800} at={P(44, 'not on the biggest')}><Label size={26}>PAID FOR WHAT WAS ACTUALLY EXPOSED</Label></Pop>}
    {t > P(44, 'much bigger rewards') && <Pop x={1640} y={450} at={P(44, 'much bigger rewards')}><Icon name="ph:arrow-fat-up-fill" size={130} color={A.red} /></Pop>}</> }),
  45: () => ({ place: 'close', body: <Shout x={R} y={460} at={C0(45) + 0.1} text={'RAISED\nEYEBROWS'} size={110} red /> }),
  46: (t) => ({ place: 'none', body: <><Redacted x={960} y={500} at={C0(46) + 0.1} cut={P(46, 'Sections were cut')} />{t > P(46, "at Microsoft's request") && <Pop x={1560} y={180} at={P(46, "at Microsoft's request")}><Label color={A.red} size={28}>REWRITTEN AT MICROSOFT'S REQUEST</Label></Pop>}</> }),
  47: () => ({ place: 'corner', body: <Pop x={860} y={460} at={C0(47) + 0.2}><Panel w={980} pad={40}><Mono size={22} color={A.dim}>MICROSOFT'S STATEMENT</Mono><div style={{ ...fonts.H, fontWeight: 800, fontSize: 46, color: A.white, lineHeight: 1.25, marginTop: 14 }}>"...helped us to better protect our customers by hardening our services."</div></Panel></Pop> }),
  48: (t) => ({ place: 'none', body: <Scale at={C0(48) + 0.1} left={'FIXED IT FAST\n+ PAID HIM'} right={'$5,000\n+ A TRIMMED STORY'} tilt={t > P(48, 'On the other') ? -8 : 8} /> }),
  // ---- ACT 7 · your turn
  49: (t) => ({ place: 'left', body: <><Shout x={CX} y={170} at={P(49, 'In twenty nineteen')} text="2019 · AGE 14" size={90} red /><Phone x={CX} y={590} w={260}><AbsoluteFill style={{ background: '#101015', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}><Icon name="ph:video-camera-fill" size={80} color={A.white} /><Mono size={16} color={A.soft}>INCOMING CALL</Mono>{t > P(49, 'hear the other person') && <Icon name="ph:ear-fill" size={70} color={A.red} />}</AbsoluteFill></Phone>{t > P(49, 'Grant Thompson') && <Pop x={1630} y={420} at={P(49, 'Grant Thompson')}><Label size={28}>GRANT THOMPSON</Label></Pop>}</> }),
  50: (t) => ({ place: 'none', grid: false, body: t < P(50, 'Apple fixed it') ? <><Stock name="mom-phone" at={C0(50)} dark={0.35} /><Shout x={960} y={180} at={C0(50) + 0.3} text={'"PLEASE, APPLE..."'} size={90} /></> : <>{[['Apple fixed it', 'ph:wrench-fill', 'FIXED'], ['thanked the family', 'ph:hand-heart-fill', 'THANKED'], ['his education', 'ph:graduation-cap-fill', 'EDUCATION']].map(([p, ic, l], i) => t > P(50, p) && <Tile key={l} x={560 + i * 400} y={480} at={P(50, p)} icon={ic} label={l} size={200} red={i === 2} />)}</> }),
  51: () => ({ place: 'close', body: <Shout x={R} y={460} at={C0(51) + 0.05} text={'THE\nLESSON?'} size={130} /> }),
  52: (t) => ({ place: 'left', body: <><Helper x={1020} y={860} size={300} mood="proud" sign="ANTARES" signAt={C0(52)} />{t > P(52, 'trillion-dollar company') && <Tile x={1540} y={480} at={P(52, 'trillion-dollar company')} icon="ph:buildings-fill" label="A TRILLION-DOLLAR COMPANY" size={210} />}<Chip x={CX} y={170} at={C0(52) + 0.2} icon="ph:robot-fill">AI CHANGED WHO CAN FIND HOLES</Chip></> }),
  53: () => ({ place: 'none', body: <><Shout x={960} y={300} at={C0(53) + 0.1} text="IT CUTS BOTH WAYS" size={100} /><Shout x={560} y={600} at={P(53, 'for a bounty')} text="BOUNTY" size={110} /><Shout x={1360} y={600} at={P(53, 'for a ransom')} text="RANSOM" size={110} red /></> }),
  54: (t) => ({ place: 'corner', body: <><Helper x={600} y={820} size={300} mood="happy" sign="DEFENDERS" signAt={C0(54) + 0.2} /><Helper x={1180} y={820} size={300} mood="wink" sign="ATTACKERS" signAt={C0(54) + 0.5} />{t > P(54, 'Whoever finds') && <Shout x={890} y={200} at={P(54, 'Whoever finds')} text="FIRST ONE WINS" size={96} red />}</> }),
  55: (t) => ({ place: 'left', body: <><Tile x={1020} y={400} at={P(55, 'official bug bounty')} icon="ph:seal-check-fill" label="OFFICIAL PROGRAMS" size={170} /><Tile x={1500} y={400} at={P(55, 'with permission')} icon="ph:handshake-fill" label="WITH PERMISSION" size={170} />{t > P(55, 'is a crime') && <Chip x={CX} y={760} at={P(55, 'is a crime')} red solid>NO PERMISSION = A CRIME</Chip>}</> }),
  56: () => ({ place: 'left', body: <IdCard x={CX} y={460} at={C0(56) + 0.1} checked={P(56, 'is real')} stamp="✓ CHECK IT'S REAL FIRST" red={false} /> }),
  57: (t) => ({ place: 'close', body: <><Shout x={R} y={260} at={C0(57) + 0.2} text="$5,000:" size={130} red />{t > P(57, 'Was five thousand') && <Shout x={R} y={440} at={P(57, 'fair')} text="FAIR?" size={110} />}{t > P(57, 'a lot more') && <Shout x={R} y={600} at={P(57, 'a lot more')} text="OR WAY TOO LOW?" size={66} red />}{t > P(57, 'Tell me in the comments') && <Chip x={R} y={790} at={P(57, 'Tell me in the comments')} icon="ph:chat-circle-text-fill" red solid>TELL ME IN THE COMMENTS</Chip>}</> }),
  58: (t) => ({ place: 'left', body: <><Subscribe x={CX} y={360} at={C0(58) + 0.1} press={C0(58) + 0.9} />{t > P(58, 'one person') && <Pop x={CX} y={650} at={P(58, 'one person')}><Mono size={26} color={A.white}>NEXT: ONE PERSON · ONE CRACK · SOMETHING HUGE</Mono></Pop>}</> }),
  59: (t) => ({ place: 'none', body: <><Kid x={960} y={900} size={560} screen={<div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 28, color: A.red }}>17,333,335,124,315</div>} /><Shout x={960} y={140} at={P(59, 'checked the math')} text="HE CHECKED THE MATH AGAIN." size={70} />{t > P(59, 'the whole internet') && <Shout x={960} y={250} at={P(59, 'the whole internet')} text="SO DID THE WHOLE INTERNET." size={70} red />}</> }),
};

// ================================================================ the act component (one per chapter)
export const makeAct = (cues: number[]): React.FC => () => {
  const { t } = useTF();
  let k = 0; cues.forEach((c, j) => { if (t >= C0(c) - 0.15) k = j; });
  const cue = cues[k];
  const beat = B[cue](t);
  const since = C0(cue) - 0.15;
  return (
    <AbsoluteFill>
      {beat.grid !== false && <GridBg x={60} glow={beat.glow} />}
      {beat.body}
      <Host place={beat.place} since={since} decode={beat.decode ?? 0} />
    </AbsoluteFill>
  );
};

// ================================================================ meme cutaways (real-life clips, Pexels licence)
export const MEMES: Meme[] = [
  { at: P(2, 'He wants to scream'), dur: 1.7, clip: 'scream', top: 'ME AT 2 AM', bottom: 'TRYING NOT TO WAKE MY PARENTS' },
  { at: P(7, 'just gaming'), dur: 2.0, clip: 'night-pc', from: 4, top: 'WHAT HIS PARENTS THOUGHT', bottom: 'JUST GAMING' },
  { at: P(18, 'Access denied'), dur: 1.9, clip: 'problem-man', top: 'DAY 7', bottom: 'STILL "ACCESS DENIED"' },
  { at: P(21, 'it worked'), dur: 1.9, clip: 'headset-shout', top: 'IT WORKED', bottom: '(SILENTLY)' },
  { at: P(32, 'seventeen point three') + 1.8, dur: 1.8, clip: 'shocked', top: '17.3 TRILLION', bottom: 'ROWS??' },
  { at: P(41, 'Five thousand dollars') - 0.2, dur: 0.6, clip: 'counting-money', top: '$5,000' },
  { at: P(43, 'They better'), dur: 2.0, clip: 'dissatisfied', top: "THAT'S IT?" },
  { at: P(46, 'was changed'), dur: 1.8, clip: 'disappointed', top: 'WHEN YOUR POST', bottom: 'GETS "EDITED"' },
  { at: P(53, 'for a ransom') + 0.6, dur: 1.8, clip: 'typing', top: 'NOT EVERYONE', bottom: 'WANTS A BOUNTY' },
];

// ================================================================ sound design (owner: more, livelier SFX)
const memeSfx: [number, SfxEvent['name'], number][] = [[0, 'boom', 0.35], [1, 'rimshot', 0.4], [2, 'failPiano', 0.35], [3, 'levelUp', 0.4], [4, 'gasp', 0.45], [5, 'coins', 0.4], [6, 'sadTrombone', 0.4], [7, 'badJoke', 0.35], [8, 'darkSweep', 0.4]];
export const SFX_EVENTS: SfxEvent[] = [
  ...memeSfx.map(([i, name, vol]) => ({ t: MEMES[i].at, name, vol })),
  ...MEMES.map((m) => ({ t: m.at - 0.02, name: 'whooshQuick' as const, vol: 0.3 })),
  // beat changes get a light swoosh; big reveals get impacts
  ...TTL.cues.slice(1).filter((_, i) => i % 2 === 0).map((c) => ({ t: c.start - 0.12, name: 'swoosh' as const, vol: 0.16 })),
  { t: P(1, 'Seventeen trillion'), name: 'riser', vol: 0.3 }, { t: P(1, 'Inside Microsoft'), name: 'impactDeep', vol: 0.4 },
  { t: P(4, 'five thousand dollars'), name: 'coins', vol: 0.35 }, { t: P(4, 'Was that fair'), name: 'mysteryHit', vol: 0.35 },
  { t: P(5, 'Wi-Fi password') + 0.6, name: 'error', vol: 0.3 }, { t: P(5, 'through the front door'), name: 'impact', vol: 0.3 },
  { t: P(7, 'He was not gaming'), name: 'hardPop', vol: 0.35 },
  { t: P(8, 'you get paid'), name: 'coins', vol: 0.3 }, { t: P(9, 'Antares'), name: 'powerUp', vol: 0.3 },
  { t: P(11, 'A public doorway'), name: 'door', vol: 0.3 }, { t: P(17, 'Proving it'), name: 'impactDeep', vol: 0.3 },
  ...Array.from({ length: 10 }, (_, i) => ({ t: P(18, 'everything he tried failed') + i * 0.32, name: 'error' as const, vol: 0.18 })),
  { t: C0(20), name: 'keyboard', vol: 0.3 }, { t: C0(21), name: 'tick', vol: 0.4 },
  { t: C0(22), name: 'success', vol: 0.35 }, { t: P(23, 'master key'), name: 'lock', vol: 0.3 },
  { t: P(24, 'never checked') + 0.2, name: 'impact', vol: 0.3 }, { t: P(25, 'any keycard'), name: 'door', vol: 0.35 },
  { t: P(30, 'four hundred thousand'), name: 'compute', vol: 0.25 }, { t: P(32, 'seventeen point three') - 0.3, name: 'riser', vol: 0.3 },
  { t: P(36, 'He reported it'), name: 'whoosh', vol: 0.3 }, { t: P(39, 'locked down'), name: 'jailLock', vol: 0.4 },
  { t: P(40, 'hit subscribe') + 0.3, name: 'clickModern', vol: 0.4 },
  { t: P(42, 'Admin access'), name: 'woodHit', vol: 0.3 }, { t: P(45, 'raise their eyebrows'), name: 'suspenseCartoon', vol: 0.3 },
  { t: P(46, 'Sections were cut'), name: 'marker', vol: 0.35 }, { t: P(49, 'hear the other person'), name: 'notification', vol: 0.3 },
  { t: P(53, 'for a ransom'), name: 'impactDeep', vol: 0.35 }, { t: P(55, 'is a crime'), name: 'jailLock', vol: 0.3 },
  { t: C0(58) + 0.9, name: 'clickModern', vol: 0.4 }, { t: P(59, 'the whole internet'), name: 'impactBig', vol: 0.35 },
];
export const NO_CAPTIONS: [number, number][] = [];
