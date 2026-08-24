import { useEffect, useState } from 'react';

import type { Theme } from './useTheme';

const KEYS = [
  'grass',
  'grass-alt',
  'grass-edge',
  'path',
  'path-edge',
  'water',
  'water-light',
  'tree-leaf',
  'tree-leaf-2',
  'tree-trunk',
  'rock',
  'window-lit',
  'sun-moon',
  'outline',
  'ink',
  'accent',
  'accent-2',
  'accent-3',
  'accent-4',
  'bg',
  'bg-deep',
  'bg-panel',
  'ink-dim',
  'sky-top',
  'sky-bottom',
] as const;

export type WorldPalette = Record<(typeof KEYS)[number], string>;

/**
 * Canvas cannot read CSS custom properties, so resolve them once per theme and
 * hand the plain colours to the map painters.
 */
export function useWorldPalette(theme: Theme): WorldPalette {
  const [palette, setPalette] = useState<WorldPalette>(() => read());

  useEffect(() => {
    // Read on the next frame so the `data-theme` attribute has been applied.
    const id = requestAnimationFrame(() => setPalette(read()));
    return () => cancelAnimationFrame(id);
  }, [theme]);

  return palette;
}

function read(): WorldPalette {
  const styles = getComputedStyle(document.documentElement);
  const out = {} as WorldPalette;
  for (const key of KEYS) {
    out[key] = styles.getPropertyValue(`--${key}`).trim() || '#000000';
  }
  return out;
}
