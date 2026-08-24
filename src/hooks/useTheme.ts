import { useCallback, useEffect, useState } from 'react';

export type Theme = 'day' | 'night';

const KEY = 'pixel-portfolio-theme';

function initialTheme(): Theme {
  const stored = localStorage.getItem(KEY);
  if (stored === 'day' || stored === 'night') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night';
}

/**
 * Day/night is a single `data-theme` attribute on <html>; every colour in the
 * site resolves through a token in tokens.css. The transition class is added
 * only for the duration of the flip so scroll work is not competing with a
 * transition on every element the rest of the time.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('night');

  useEffect(() => {
    const t = initialTheme();
    setTheme(t);
    document.documentElement.dataset.theme = t;
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'night' ? 'day' : 'night';
      const root = document.documentElement;
      root.classList.add('theme-switching');
      root.dataset.theme = next;
      localStorage.setItem(KEY, next);
      window.setTimeout(() => root.classList.remove('theme-switching'), 460);
      return next;
    });
  }, []);

  return { theme, toggle };
}
