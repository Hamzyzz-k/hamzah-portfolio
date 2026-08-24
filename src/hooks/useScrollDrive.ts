import { useEffect, useRef, useState } from 'react';

export interface ScrollDrive {
  /** True while the page is actually moving. */
  moving: boolean;
  /** 1 scrolling down, -1 scrolling up, 0 at rest. */
  direction: number;
  /** True while the recent scroll speed is above the comfortable threshold. */
  fast: boolean;
  /** True for a few seconds after a fast burst, so he can catch his breath. */
  winded: boolean;
}

/** Pixels per second past which he starts complaining. */
const FAST_PX_PER_SEC = 2200;
/** How long the out-of-breath state lasts once the scrolling stops. */
const RECOVER_MS = 2600;
/** Sustained fast scrolling needed before he reacts, so a flick does nothing. */
const FAST_SUSTAIN_MS = 320;

/**
 * Scroll velocity, sampled once per animation frame.
 *
 * Reading in a rAF loop rather than on every scroll event keeps the numbers
 * stable across trackpads, wheels and momentum scrolling, all of which fire at
 * wildly different rates.
 */
export function useScrollDrive(): ScrollDrive {
  const [drive, setDrive] = useState<ScrollDrive>({
    moving: false,
    direction: 0,
    fast: false,
    winded: false,
  });

  const lastY = useRef(0);
  const lastT = useRef(0);
  const fastSince = useRef(0);
  const windedUntil = useRef(0);
  const stillFrames = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    lastT.current = performance.now();

    let raf = 0;
    let current: ScrollDrive = {
      moving: false,
      direction: 0,
      fast: false,
      winded: false,
    };

    const tick = (now: number) => {
      const y = window.scrollY;
      const dt = Math.max(1, now - lastT.current);
      const dy = y - lastY.current;
      const speed = (Math.abs(dy) / dt) * 1000;

      lastY.current = y;
      lastT.current = now;

      // A couple of quiet frames before we call it stopped — a single frame of
      // zero delta happens mid-scroll and would make him flicker.
      if (Math.abs(dy) < 0.5) stillFrames.current += 1;
      else stillFrames.current = 0;

      const moving = stillFrames.current < 4;
      const direction = Math.abs(dy) < 0.5 ? 0 : dy > 0 ? 1 : -1;

      if (speed > FAST_PX_PER_SEC) {
        if (fastSince.current === 0) fastSince.current = now;
      } else {
        fastSince.current = 0;
      }

      const fast = fastSince.current !== 0 && now - fastSince.current > FAST_SUSTAIN_MS;
      if (fast) windedUntil.current = now + RECOVER_MS;
      const winded = now < windedUntil.current;

      if (
        moving !== current.moving ||
        direction !== current.direction ||
        fast !== current.fast ||
        winded !== current.winded
      ) {
        current = { moving, direction, fast, winded };
        setDrive(current);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return drive;
}
