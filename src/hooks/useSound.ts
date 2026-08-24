import { useCallback, useSyncExternalStore } from 'react';

export type Blip = 'hover' | 'select' | 'step' | 'toggle' | 'open';

const KEY = 'pixel-portfolio-sound';

const TONES: Record<Blip, { freq: number; to: number; ms: number; gain: number }> = {
  hover: { freq: 880, to: 990, ms: 40, gain: 0.03 },
  select: { freq: 520, to: 880, ms: 90, gain: 0.06 },
  step: { freq: 180, to: 140, ms: 45, gain: 0.025 },
  toggle: { freq: 660, to: 440, ms: 110, gain: 0.05 },
  open: { freq: 300, to: 620, ms: 130, gain: 0.05 },
};

/**
 * Tiny square-wave blip engine. Off by default — audio that starts on its own
 * is hostile — and the AudioContext is only created after the user opts in,
 * which also satisfies browser autoplay rules.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
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
    this.enabled = !this.enabled;
    localStorage.setItem(KEY, this.enabled ? 'on' : 'off');
    if (this.enabled) this.play('toggle');
    this.listeners.forEach((fn) => fn());
  };

  play = (kind: Blip) => {
    if (!this.enabled) return;
    try {
      this.ctx ??= new AudioContext();
      const ctx = this.ctx;
      if (ctx.state === 'suspended') void ctx.resume();

      const { freq, to, ms, gain } = TONES[kind];
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      const now = ctx.currentTime;
      const end = now + ms / 1000;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(to, end);
      amp.gain.setValueAtTime(gain, now);
      amp.gain.exponentialRampToValueAtTime(0.0001, end);

      osc.connect(amp).connect(ctx.destination);
      osc.start(now);
      osc.stop(end);
    } catch {
      /* audio is decorative — never let it break the page */
    }
  };
}

export const sound = new SoundEngine();

export function useSound() {
  const enabled = useSyncExternalStore(sound.subscribe, sound.getSnapshot, () => false);
  const play = useCallback((kind: Blip) => sound.play(kind), []);
  return { enabled, toggle: sound.toggle, play };
}
