import { useCallback, useSyncExternalStore } from 'react';

const KEY = 'pixel-portfolio-music';

/** A short, cheerful major-key loop — square + triangle, all synthesized. */
const MELODY = [
  523.25, 659.25, 784.0, 659.25, 587.33, 784.0, 880.0, 784.0,
  523.25, 659.25, 784.0, 987.77, 880.0, 784.0, 659.25, 587.33,
];
const BASS = [130.81, 130.81, 164.81, 164.81, 174.61, 174.61, 196.0, 196.0];
const STEP_SEC = 0.22;

/**
 * A tiny looping chiptune, generated rather than loaded — no audio file to
 * ship, and it fits the rest of the site's "everything hand-made" approach.
 *
 * Off by default (autoplay is both bad manners and blocked by browsers until
 * a gesture happens anyway); toggled from the HUD, persisted across visits.
 */
class MusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private listeners = new Set<() => void>();
  enabled = false;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      this.enabled = localStorage.getItem(KEY) === 'on';
    }
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getSnapshot = () => this.enabled;

  toggle = () => {
    this.enabled ? this.stop() : this.start();
  };

  start = () => {
    this.enabled = true;
    localStorage.setItem(KEY, 'on');
    this.listeners.forEach((fn) => fn());

    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === 'suspended') void this.ctx.resume();

      this.master ??= this.ctx.createGain();
      this.master.gain.value = 0.05;
      this.master.connect(this.ctx.destination);

      this.step = 0;
      this.scheduleLoop();
    } catch {
      /* music is decorative — never let it break the page */
    }
  };

  stop = () => {
    this.enabled = false;
    localStorage.setItem(KEY, 'off');
    this.listeners.forEach((fn) => fn());
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  };

  private scheduleLoop() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.playStep();
    this.timer = window.setInterval(() => this.playStep(), STEP_SEC * 1000);
  }

  private playStep() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const i = this.step % MELODY.length;
    this.step += 1;

    // lead — square wave, short and bright
    const lead = ctx.createOscillator();
    const leadGain = ctx.createGain();
    lead.type = 'square';
    lead.frequency.value = MELODY[i];
    leadGain.gain.setValueAtTime(0.5, now);
    leadGain.gain.exponentialRampToValueAtTime(0.001, now + STEP_SEC * 0.9);
    lead.connect(leadGain).connect(master);
    lead.start(now);
    lead.stop(now + STEP_SEC);

    // bass — triangle, only on every other step, an octave and a half down
    if (i % 2 === 0) {
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'triangle';
      bass.frequency.value = BASS[(i / 2) % BASS.length];
      bassGain.gain.setValueAtTime(0.6, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + STEP_SEC * 1.7);
      bass.connect(bassGain).connect(master);
      bass.start(now);
      bass.stop(now + STEP_SEC * 1.8);
    }
  }
}

export const music = new MusicEngine();

export function useMusic() {
  const enabled = useSyncExternalStore(music.subscribe, music.getSnapshot, () => false);
  const toggle = useCallback(() => music.toggle(), []);
  return { enabled, toggle };
}
