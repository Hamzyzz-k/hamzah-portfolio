/**
 * Maps raw scroll progress to progress along the road, with a flat plateau at
 * every project.
 *
 * Without this the character glides past each project and the dialogue only
 * gets a moment on screen. With it, roughly half the section's scroll distance
 * is spent parked at a project — the character sits down and works while the
 * user reads, then gets up and walks to the next one.
 */

export interface Segment {
  rawStart: number;
  rawEnd: number;
  routeStart: number;
  routeEnd: number;
  /** Index into the stops array, or null while travelling. */
  stop: number | null;
}

/** Share of the whole section's scroll spent parked at projects. */
const PLATEAU_SHARE = 0.52;

export function buildSegments(stops: number[]): Segment[] {
  const sorted = [...stops].sort((a, b) => a - b);
  if (sorted.length === 0) {
    return [{ rawStart: 0, rawEnd: 1, routeStart: 0, routeEnd: 1, stop: null }];
  }

  const plateauRaw = PLATEAU_SHARE / sorted.length;
  const travelRawTotal = 1 - PLATEAU_SHARE;

  // Route distance covered by each travel leg: 0 -> s1, s1 -> s2, ... sn -> 1.
  const legs: number[] = [];
  let prev = 0;
  for (const s of sorted) {
    legs.push(Math.max(0, s - prev));
    prev = s;
  }
  legs.push(Math.max(0, 1 - prev));
  const legTotal = legs.reduce((a, b) => a + b, 0) || 1;

  const segments: Segment[] = [];
  let raw = 0;
  let route = 0;

  legs.forEach((leg, i) => {
    const rawLen = (leg / legTotal) * travelRawTotal;
    const routeEnd = i < sorted.length ? sorted[i] : 1;

    segments.push({
      rawStart: raw,
      rawEnd: raw + rawLen,
      routeStart: route,
      routeEnd,
      stop: null,
    });
    raw += rawLen;
    route = routeEnd;

    if (i < sorted.length) {
      segments.push({
        rawStart: raw,
        rawEnd: raw + plateauRaw,
        routeStart: route,
        routeEnd: route,
        stop: i,
      });
      raw += plateauRaw;
    }
  });

  // Absorb float drift into the final segment so raw always reaches exactly 1.
  segments[segments.length - 1].rawEnd = 1;
  return segments;
}

export function sampleSegments(segments: Segment[], raw: number) {
  const clamped = Math.min(1, Math.max(0, raw));

  for (const seg of segments) {
    if (clamped <= seg.rawEnd || seg === segments[segments.length - 1]) {
      const span = seg.rawEnd - seg.rawStart;
      const t = span > 0 ? (clamped - seg.rawStart) / span : 1;
      return {
        route: seg.routeStart + (seg.routeEnd - seg.routeStart) * Math.min(1, Math.max(0, t)),
        stop: seg.stop,
        /** How far into a plateau we are — used to fade the dialogue in and out. */
        stopPhase: seg.stop === null ? 0 : Math.min(1, Math.max(0, t)),
      };
    }
  }

  return { route: 1, stop: null, stopPhase: 0 };
}

/** Raw scroll position that parks the character at a given stop. */
export function rawForStop(segments: Segment[], stopIndex: number): number {
  const seg = segments.find((s) => s.stop === stopIndex);
  if (!seg) return 0;
  return seg.rawStart + (seg.rawEnd - seg.rawStart) * 0.35;
}
