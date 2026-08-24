import { useEffect, useState } from 'react';

import { useReducedMotion } from './useReducedMotion';

/**
 * Types `lines` out one character at a time. Restarts whenever the joined text
 * changes, so pointing it at a new project's dialogue is enough to replay it.
 * Under reduced motion the full text is returned immediately.
 */
export function useTypewriter(lines: string[], active = true, speed = 26) {
  const reduced = useReducedMotion();
  const full = lines.join('\n');
  const [shown, setShown] = useState('');

  useEffect(() => {
    if (!active) {
      setShown('');
      return;
    }
    if (reduced) {
      setShown(full);
      return;
    }

    setShown('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, speed);

    return () => window.clearInterval(id);
  }, [full, active, reduced, speed]);

  return {
    text: shown,
    done: shown.length >= full.length,
    /** Skip the animation and show everything. */
    finish: () => setShown(full),
  };
}
