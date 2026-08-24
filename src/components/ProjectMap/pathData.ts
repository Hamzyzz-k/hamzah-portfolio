import type { Point } from './worldData';

/**
 * Catmull-Rom through the route points, converted to cubic beziers.
 *
 * Building the path from points rather than hand-writing an SVG `d` means the
 * route can be retuned by nudging coordinates in cityData.ts, and the project
 * stops can be derived from real localities instead of guessed percentages.
 */
export function smoothPath(points: Point[], tension = 0.5): string {
  if (points.length < 2) return '';

  const d: string[] = [`M ${points[0][0]} ${points[0][1]}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2;

    d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`);
  }

  return d.join(' ');
}

/**
 * Progress (0..1) along `path` at the point closest to `target`.
 *
 * Coarse sweep then a local refine — cheap, runs once per mount, and lets a
 * project say "I am in Koramangala" instead of "I am at 62% of the road".
 */
export function progressNearest(
  path: SVGPathElement,
  target: Point,
  coarseSamples = 400,
): number {
  const total = path.getTotalLength();
  const dist2 = (t: number) => {
    const p = path.getPointAtLength(t * total);
    return (p.x - target[0]) ** 2 + (p.y - target[1]) ** 2;
  };

  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i <= coarseSamples; i++) {
    const t = i / coarseSamples;
    const d = dist2(t);
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }

  let step = 1 / coarseSamples;
  for (let pass = 0; pass < 6; pass++) {
    step /= 2;
    for (const t of [best - step, best + step]) {
      if (t < 0 || t > 1) continue;
      const d = dist2(t);
      if (d < bestD) {
        bestD = d;
        best = t;
      }
    }
  }

  return best;
}

/** Position plus facing direction at a given progress along the path. */
export function sampleRoute(path: SVGPathElement, progress: number) {
  const total = path.getTotalLength();
  const at = Math.max(0, Math.min(1, progress)) * total;
  const p = path.getPointAtLength(at);
  const ahead = path.getPointAtLength(Math.min(total, at + 4));
  const behind = path.getPointAtLength(Math.max(0, at - 4));

  const dx = ahead.x - behind.x;
  const dy = ahead.y - behind.y;

  return { x: p.x, y: p.y, dx, dy };
}

export type Facing = 'front' | 'back' | 'side';

/** Which sprite set to use, and whether it needs mirroring. */
export function facingFor(dx: number, dy: number): { facing: Facing; flip: boolean } {
  if (Math.abs(dx) > Math.abs(dy)) {
    return { facing: 'side', flip: dx < 0 };
  }
  return { facing: dy >= 0 ? 'front' : 'back', flip: false };
}
