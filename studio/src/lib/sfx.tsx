// Sound design: a named catalog over the bundled SFX (CC0 + Mixkit free license)
// and <Sfx at={seconds} name="zoomIn" /> which drops the sound on the timeline.
import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';

const M = (p: string) => `sfx/mixkit/${p}.mp3`;
const E = (p: string) => `sfx/${p}.mp3`;
const K = (p: string) => `sfx/comedy/${p}.mp3`; // comedy / cartoon (Mixkit free license)

// semantic name -> file (pick by what the animation does)
export const SFX = {
  // camera / zoom
  zoomIn: M('camera/ui-zoom-in'), zoomOut: M('camera/ui-zoom-out'), zoomFast: M('camera/zoom-swipe-fast'),
  zoomAir: M('camera/zoom-air-fast'), zoomTech: M('camera/zoom-futuristic'), focus: M('camera/camera-autofocus'),
  shutter: M('camera/camera-shutter-hard'), shutterSoft: M('camera/click-camera'),
  // transitions / whooshes
  whoosh: M('transition/whoosh-fast'), whooshDeep: M('transition/air-woosh-deep'), whooshBig: M('transition/air-whoosh-powerful'),
  whooshQuick: M('transition/air-woosh-quick'), swoosh: M('transition/swoosh-quick'), swooshSlow: M('transition/swoosh-slow'),
  sweep: M('transition/sweep-fast'), sweepSmall: M('transition/sweep-fast-small'), sweepSciFi: M('transition/sweep-scifi-fast'),
  snap: M('transition/transition-snap'), techSlide: M('transition/transition-tech-slide'), tech: M('transition/transition-tech'),
  warp: M('transition/warp-slide'), swirl: M('transition/whoosh-swirl'), vacuum: M('transition/air-zoom-vacuum'),
  reverseWhoosh: E('reverse-whoosh'), whooshAlt: E('whoosh-alt1'),
  // impacts / risers
  impact: M('impact/impact-transition'), impactBig: M('impact/impact-cine-big'), impactEpic: M('impact/impact-epic-trailer'),
  impactDeep: M('impact/impact-deep-whoosh'), impactZoom: M('impact/impact-zoom-quick'), bassHit: M('impact/bass-hit-short'),
  bassHitFx: M('impact/bass-hit-futuristic'), hit: M('impact/hit-fast-exciting'), hitSoft: M('impact/hit-weak'), stomp: M('impact/stomp-apocalyptic'),
  riser: E('riser'), boom: E('boom'), drone: E('drone'),
  // ui
  pop: E('pop'), popUi: M('ui/ui-message-pop'), popElectric: M('ui/pop-electric'), click: M('ui/ui-select-click'), clickModern: M('ui/ui-select-modern'),
  toggle: M('ui/switch-click-quick'), switchLight: M('ui/switch-light'), tap: M('ui/switch-tap'), tone: M('ui/ui-tone-quick'),
  confirm: M('ui/ui-confirm-tone'), bleep: M('ui/ui-confirm-bleep'), notify: M('ui/ui-notify-tech'), select: M('ui/ui-option-select'),
  popup: M('ui/ui-popup-dry'), success: M('ui/ui-success-soft'), chime: M('ui/chime-crystal'), magnet: M('ui/hitech-touch-magnet'),
  error: E('error'), notification: E('notification'),
  // data / digital
  glitch: M('data/glitch-virtual-quick'), glitchStatic: M('data/glitch-static'), glitchElectric: M('data/glitch-electric-small'),
  glitchBreak: M('data/break-glitch-digital'), scan: M('data/data-scan'), compute: M('data/data-compute'), dataLoad: M('data/data-load-os'),
  powerUp: M('data/power-up-electronic'), powerUpStatic: M('data/power-up-static'), staticFx: M('data/static-electric-present'),
  sweepDigital: M('data/sweep-digital'), whooshElectric: M('data/whoosh-electric'),
  // text
  typing: M('text/typewriter-digital'), typeKey: M('text/typewriter-hit-soft'), typeHard: M('text/typewriter-hit-hard'), bell: M('text/typewriter-return-bell'),
  keyboard: E('keyboard'), marker: M('text/marker-pen-line'), write: M('text/write-fast'),
  // mech / sci-fi
  lock: M('mech/lock-digital'), lockQuick: M('mech/lock-quick'), machine: M('mech/machine-activate-short'), robotic: M('mech/mech-robotic-futuristic'),
  techMove: M('mech/mech-tech-movement'), door: M('mech/door-open-futuristic'), scifiClick: M('scifi/scifi-click'), bleepHi: M('scifi/hitech-bleep'),
  hum: M('scifi/tech-hum-futuristic'), computerAmb: M('scifi/scifi-computer-ambience'),
  // light / sparkle
  sparkle: M('light/sparkle-touch'), shimmer: M('light/shimmer-sparkle-sweep'), lightSweep: M('light/light-sweep-magic'), reveal: E('magic-reveal'),
  // time / paper / film
  tick: M('counter/clock-tick-single'), clockSpin: M('counter/clock-knob-spin'), countdown: M('counter/countdown-bleeps'), heartbeat: M('crowd/heartbeat-single'),
  pageTurn: M('paper/paper-page-turn'), pageTurnBig: M('paper/paper-page-turn-big'), pagesFast: M('paper/paper-book-browse-fast'), paperSlide: M('paper/paper-slide'),
  rewind: M('film/tape-rewind-fast'), rewindCine: M('film/tape-rewind-cine'), projector: M('film/projector-spin-antique'), scratch: M('film/vinyl-scratch-small'),
  glassHit: M('glass/glass-hit-cine'), glassBreak: M('glass/glass-break-hammer'),
  // comedy / cartoon
  boing: K('boing'), boingMetal: K('boingMetal'), fallWhistle: K('fallWhistle'), toyWhistle: K('toyWhistle'), spinWhistle: K('spinWhistle'),
  sadTrombone: K('sadTrombone'), sadTromboneSlow: K('sadTromboneSlow'), failPiano: K('failPiano'), clownHorn: K('clownHorn'), splat: K('splat'),
  punch: K('punch'), dizzy: K('dizzy'), gasp: K('gasp'), panic: K('panic'), suspenseStrings: K('suspenseStrings'),
  suspenseClarinet: K('suspenseClarinet'), suspenseCartoon: K('suspenseCartoon'), crowdLaugh: K('crowdLaugh'), laughApplause: K('laughApplause'),
  crowdBoo: K('crowdBoo'), crowdSad: K('crowdSad'), crickets: K('crickets'), drumRoll: K('drumRoll'), rimshot: K('rimshot'), badJoke: K('badJoke'),
  coins: K('coins'), moneyBag: K('moneyBag'), creakyDoor: K('creakyDoor'), jailLock: K('jailLock'), alarm: K('alarm'), breachAlarm: K('breachAlarm'),
  gameOver: K('gameOver'), loseTone: K('loseTone'), levelUp: K('levelUp'), mysteryHeartbeat: K('mysteryHeartbeat'), mysteryHit: K('mysteryHit'),
  horrorBell: K('horrorBell'), darkSweep: K('darkSweep'), hardPop: K('hardPop'), sillyPop: K('sillyPop'), cartoonLaugh: K('cartoonLaugh'),
  applause: K('applause'), spinJump: K('spinJump'), negGuitar: K('negGuitar'), siren: K('siren'), squeak: K('squeak'), woodHit: K('woodHit'),
} as const;
export type SfxName = keyof typeof SFX;

// Place a sound at an absolute time (seconds). `dur` trims long files.
export const Sfx: React.FC<{ at: number; name: SfxName; vol?: number; dur?: number; rate?: number }> = ({ at, name, vol = 0.6, dur, rate = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(at * fps)} durationInFrames={dur ? Math.round(dur * fps) : undefined} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(SFX[name])} volume={vol} playbackRate={rate} />
    </Sequence>
  );
};

// A section's sound design as data (one row per visual action), rendered by <SfxTrack>.
export type SfxEvent = { t: number; name: SfxName; vol?: number; dur?: number; rate?: number; note?: string };
export const SfxTrack: React.FC<{ events: SfxEvent[] }> = ({ events }) => (
  <>{events.map((e, i) => <Sfx key={i} at={Math.max(0, e.t)} name={e.name} vol={e.vol} dur={e.dur} rate={e.rate} />)}</>
);
