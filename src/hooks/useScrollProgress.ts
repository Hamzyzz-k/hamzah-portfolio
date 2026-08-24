import { useEffect, useRef, useState } from 'react';

/**
 * Progress (0..1) of the viewport travelling through a tall section.
 *
 * Read once per animation frame rather than on every scroll event, and eased
 * toward the target, so the map walk stays smooth on trackpads and on browsers
 * that fire scroll in bursts.
 */
export function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  { ease = 0.14, disabled = false }: { ease?: number; disabled?: boolean } = {},
) {
  const [progress, setProgress] = useState(0);
  const smoothed = useRef(0);
  const target = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let running = true;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      // The sticky stage is one viewport tall, so the scrollable travel is the
      // section height minus that one viewport.
      const travel = Math.max(1, rect.height - window.innerHeight);
      target.current = Math.min(1, Math.max(0, -rect.top / travel));
    };

    const tick = () => {
      if (!running) return;
      measure();

      if (disabled) {
        smoothed.current = target.current;
      } else {
        smoothed.current += (target.current - smoothed.current) * ease;
        if (Math.abs(target.current - smoothed.current) < 0.0004) {
          smoothed.current = target.current;
        }
      }

      setProgress((prev) =>
        Math.abs(prev - smoothed.current) > 0.0002 ? smoothed.current : prev,
      );
      raf = requestAnimationFrame(tick);
    };

    measure();
    smoothed.current = target.current;
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [ref, ease, disabled]);

  return progress;
}
