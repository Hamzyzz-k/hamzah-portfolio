import { useEffect, useState } from 'react';

import { bootLines } from '../data/lines';
import { useReducedMotion } from '../hooks/useReducedMotion';

const KEY = 'pixel-portfolio-booted';

type Phase = 'boot' | 'leaving' | 'gone';

/**
 * CRT power-on. Shown once per browsing session — a boot screen every single
 * navigation stops being charming very quickly.
 *
 * Renders nothing once `phase` reaches 'gone', and stops accepting pointer
 * events the moment it starts leaving — a full-viewport `position: fixed`
 * layer left behind at `opacity: 0` would otherwise sit on top of the whole
 * site (z-index above the HUD and the companion) and silently swallow every
 * click and hover forever.
 */
export default function BootScreen({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>(() => {
    const skip =
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(KEY) === '1') || reduced;
    return skip ? 'leaving' : 'boot';
  });

  useEffect(() => {
    if (phase !== 'boot') {
      onDone();
      const id = window.setTimeout(() => setPhase('gone'), 320);
      return () => window.clearTimeout(id);
    }

    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= bootLines.length - 1) {
          window.clearInterval(id);
          window.setTimeout(finish, 620);
          return s;
        }
        return s + 1;
      });
    }, 380);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function finish() {
    sessionStorage.setItem(KEY, '1');
    setPhase((p) => (p === 'boot' ? 'leaving' : p));
  }

  useEffect(() => {
    if (phase !== 'boot') return;
    const onKey = () => finish();
    window.addEventListener('keydown', onKey, { once: true });
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`boot ${phase === 'leaving' ? 'is-leaving' : ''} scanlines`}
      onClick={finish}
      role="presentation"
    >
      <div className="boot__inner">
        <h2 className="boot__logo" aria-hidden="true">
          HAMZAH<span className="boot__logo-dim">.EXE</span>
        </h2>
        <ul className="boot__lines">
          {bootLines.slice(0, step + 1).map((l, i) => (
            <li key={l}>
              <span className="boot__ok">{i < step ? '[ OK ]' : '[ .. ]'}</span> {l}
            </li>
          ))}
        </ul>
        <p className="boot__press">PRESS ANY KEY</p>
      </div>
    </div>
  );
}
