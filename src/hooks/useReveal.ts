import { useEffect } from 'react';

/**
 * Adds `is-visible` to every `.reveal` inside `root` as it scrolls into view.
 * One observer for the whole page rather than a hook per component.
 */
export function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    const targets = el.querySelectorAll('.reveal');
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [root]);
}
