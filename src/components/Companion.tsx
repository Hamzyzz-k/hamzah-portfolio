import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { companion, type Pose } from '../companion/store';
import {
  danceLines,
  greetLines,
  pick,
  restLines,
  swimLines,
  tiredLines,
  walkLines,
} from '../data/lines';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollDrive } from '../hooks/useScrollDrive';
import {
  PALETTE,
  codeCycle,
  danceCycle,
  idleFront,
  linkedinCycle,
  phoneCycle,
  swimCycle,
  tiredCycle,
  walkBack,
  walkFront,
  walkSide,
  wipeCycle,
} from '../sprites/poses';
import PixelSprite from './PixelSprite';

const FRAME_MS = 120;
/** Where he sits on the page when the map is not driving him. */
const EDGE_X = 46;
const EDGE_Y_RATIO = 0.62;

/** How long each half of the out-of-breath beat lasts. */
const TIRED_MS = 1400;
const WIPE_MS = 1500;
/** How long he takes to "catch up" before reacting to a nav jump. */
const ARRIVAL_DELAY_MS = 500;

const CYCLES: Partial<Record<Pose, string[][]>> = {
  dance: danceCycle,
  code: codeCycle,
  swim: swimCycle,
  tired: tiredCycle,
  wipe: wipeCycle,
  phone: phoneCycle,
  linkedin: linkedinCycle,
  github: codeCycle,
};

type Breath = 'tired' | 'wipe' | null;

/**
 * The one character on the page.
 *
 * Rendered once, fixed to the viewport. Normally he walks down the left edge
 * and follows the scroll; while the projects map is on screen the map hands
 * him a viewport anchor and he walks the route instead, so it reads as the
 * same person going through the map rather than a second copy of him.
 */
export default function Companion() {
  const state = useSyncExternalStore(companion.subscribe, companion.getSnapshot);
  const drive = useScrollDrive();
  const reduced = useReducedMotion();

  const [frame, setFrame] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const [bubbleSide, setBubbleSide] = useState<'left' | 'right' | 'center'>('center');
  const [breath, setBreath] = useState<Breath>(null);
  const [, force] = useState(0);

  // Rendered position, eased toward the target so moving on and off the map is
  // a walk rather than a teleport.
  const posRef = useRef({ x: EDGE_X, y: 0, ready: false });
  const rafRef = useRef(0);
  const breathTimers = useRef<number[]>([]);

  const { anchor, action, hidden, arrival } = state;

  /* ------------------------------------------------------------ behaviour */

  // Scrolling always wins: it cancels a hover reaction and cuts the breath
  // sequence short so the character goes straight back to walking.
  useEffect(() => {
    if (!drive.moving) return;
    companion.clearAction();
    setBreath(null);
  }, [drive.moving]);

  // Natural trigger: a sustained fast scroll, once it stops.
  const wasFast = useRef(false);
  useEffect(() => {
    if (drive.fast) wasFast.current = true;
    if (!drive.moving && wasFast.current) {
      wasFast.current = false;
      runBreathSequence(0);
    }
  }, [drive.moving, drive.fast]);

  // Forced trigger: a nav-bar jump, however fast the actual scroll was.
  const lastArrival = useRef(arrival);
  useEffect(() => {
    if (arrival === lastArrival.current) return;
    lastArrival.current = arrival;
    runBreathSequence(ARRIVAL_DELAY_MS);
  }, [arrival]);

  useEffect(() => () => breathTimers.current.forEach(window.clearTimeout), []);

  function runBreathSequence(delay: number) {
    const t1 = window.setTimeout(() => setBreath('tired'), delay);
    const t2 = window.setTimeout(() => setBreath('wipe'), delay + TIRED_MS);
    const t3 = window.setTimeout(() => setBreath(null), delay + TIRED_MS + WIPE_MS);
    breathTimers.current.forEach(window.clearTimeout);
    breathTimers.current = [t1, t2, t3];
  }

  const swimming = anchor?.swimming ?? false;
  const atStop = anchor?.stop ?? null;

  // Swimming is a location fact ("he is standing in the lake"), not a
  // transient reaction — it wins over everything else, including a breath
  // sequence a fast jump might have just kicked off. Without this, scrolling
  // quickly into the crossing shows him wiping sweat mid-lake instead of
  // actually swimming.
  let pose: Pose;
  if (swimming) {
    pose = 'swim';
  } else if (drive.moving) {
    pose = 'walk';
  } else if (breath) {
    pose = breath;
  } else if (action) {
    pose = action.pose;
  } else if (atStop !== null) {
    pose = 'code';
  } else if (anchor) {
    pose = 'dance';
  } else {
    pose = 'idle';
  }

  /* --------------------------------------------------------------- speech */

  const bubbleKey = `${pose}|${action?.line ?? ''}|${atStop ?? ''}`;
  const lastKey = useRef('');

  useEffect(() => {
    if (lastKey.current === bubbleKey) return;
    lastKey.current = bubbleKey;

    if (action) {
      setBubble(action.line);
      return;
    }
    if (pose === 'tired') {
      setBubble(pick(tiredLines));
      return;
    }
    if (pose === 'wipe') {
      setBubble(pick(restLines));
      return;
    }
    if (pose === 'swim') {
      setBubble(pick(swimLines));
      return;
    }
    if (pose === 'dance') {
      setBubble(pick(danceLines));
      return;
    }
    if (pose === 'idle' && Math.random() < 0.35) {
      setBubble(pick(greetLines));
      return;
    }
    setBubble(null);
  }, [bubbleKey, action, pose]);

  // A bubble that lingers forever stops being a reaction, so retire it.
  useEffect(() => {
    if (!bubble) return;
    const id = window.setTimeout(() => setBubble(null), pose === 'code' ? 6000 : 4200);
    return () => window.clearTimeout(id);
  }, [bubble, pose]);

  // Occasional chatter while he is actively walking the map. `pose` stays
  // 'walk' for the whole stretch of a scroll, so the bubbleKey effect above
  // only fires once at the start of it — this timer is what keeps him talking
  // sporadically for a long walk instead of going silent after the first line.
  useEffect(() => {
    if (pose !== 'walk' || !anchor) return;
    const id = window.setInterval(() => {
      if (Math.random() < 0.3) setBubble((prev) => pick(walkLines, prev ?? undefined));
    }, 3200);
    return () => window.clearInterval(id);
  }, [pose, anchor]);

  /* ------------------------------------------------------------ animation */

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    const step = () => {
      const targetX = anchor ? anchor.x : EDGE_X;
      const targetY = anchor ? anchor.y : window.innerHeight * EDGE_Y_RATIO;
      const p = posRef.current;

      if (!p.ready) {
        p.x = targetX;
        p.y = targetY;
        p.ready = true;
      } else {
        const ease = reduced ? 1 : 0.18;
        p.x += (targetX - p.x) * ease;
        p.y += (targetY - p.y) * ease;
      }

      // The speech bubble is centred over him by default, which pushes it off
      // the left edge of the viewport when he is standing near EDGE_X. Anchor
      // it to whichever side actually has room instead of letting the page's
      // overflow-x clip it silently.
      const margin = 130;
      const side = p.x < margin ? 'left' : window.innerWidth - p.x < margin ? 'right' : 'center';
      setBubbleSide((prev) => (prev === side ? prev : side));

      force((n) => (n + 1) % 1000);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [anchor, reduced]);

  if (hidden) return null;

  /* --------------------------------------------------------------- render */

  const facing = anchor?.facing ?? (drive.direction < 0 ? 'back' : 'front');
  const flip = anchor?.flip ?? false;
  const scale = anchor?.scale ?? 3;

  let grid;
  if (pose === 'walk') {
    const set = facing === 'side' ? walkSide : facing === 'back' ? walkBack : walkFront;
    grid = set[frame % set.length];
  } else if (pose === 'idle') {
    grid = idleFront;
  } else {
    const cycle = CYCLES[pose];
    grid = cycle ? cycle[frame % cycle.length] : idleFront;
  }

  const { x, y } = posRef.current;

  return (
    <div
      className={`companion ${anchor ? 'is-on-map' : 'is-on-page'} ${breath ? 'is-winded' : ''}`}
      style={{ transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)` }}
      aria-hidden="true"
    >
      {bubble && (
        <span className={`companion__bubble companion__bubble--${bubbleSide}`} key={bubble}>
          {bubble}
        </span>
      )}
      {breath && !reduced && (
        <span className="companion__sweat">
          <i />
          <i />
        </span>
      )}
      <PixelSprite grid={grid} palette={PALETTE} scale={scale} flip={flip} />
      <span className="companion__shadow" />
    </div>
  );
}
