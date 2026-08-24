import type { WorldPalette } from '../../hooks/useWorldPalette';
import {
  MAP_H,
  MAP_W,
  arterials,
  districts,
  lake,
  parks,
  ponds,
  type Point,
} from './worldData';

/* Deterministic noise — the same city every reload, and the same city in both
   themes, so toggling day/night does not reshuffle the streets. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const px = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w = 1,
  h = 1,
  colour?: string,
) => {
  if (colour) ctx.fillStyle = colour;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};

function ellipse(
  ctx: CanvasRenderingContext2D,
  [cx, cy]: Point,
  rx: number,
  ry: number,
  colour: string,
) {
  ctx.fillStyle = colour;
  for (let y = -ry; y <= ry; y++) {
    const span = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (y / ry) ** 2)));
    if (span <= 0) continue;
    ctx.fillRect(Math.round(cx - span), Math.round(cy + y), span * 2, 1);
  }
}

/** Square-brush line, so diagonals stay chunky instead of feathering. */
function line(
  ctx: CanvasRenderingContext2D,
  [x0, y0]: Point,
  [x1, y1]: Point,
  width: number,
  colour: string,
) {
  ctx.fillStyle = colour;
  const half = Math.floor(width / 2);
  let x = Math.round(x0);
  let y = Math.round(y0);
  const ex = Math.round(x1);
  const ey = Math.round(y1);
  const dx = Math.abs(ex - x);
  const dy = -Math.abs(ey - y);
  const sx = x < ex ? 1 : -1;
  const sy = y < ey ? 1 : -1;
  let err = dx + dy;

  for (;;) {
    ctx.fillRect(x - half, y - half, width, width);
    if (x === ex && y === ey) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}

function polyline(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  width: number,
  colour: string,
) {
  for (let i = 0; i < pts.length - 1; i++) line(ctx, pts[i], pts[i + 1], width, colour);
}

/* -------------------------------------------------------------------------- */

export function paintWorld(pal: WorldPalette, night: boolean): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = MAP_W;
  canvas.height = MAP_H;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(19911102);

  const land = night ? pal['grass-edge'] : pal['grass-alt'];
  const landAlt = night ? pal['bg-deep'] : pal.grass;
  const built = night ? pal.rock : pal['path-edge'];
  const road = pal.path;

  // land base, with a little mottling so it is not a flat slab
  ctx.fillStyle = land;
  ctx.fillRect(0, 0, MAP_W, MAP_H);
  for (let i = 0; i < 3000; i++) {
    px(ctx, rand() * MAP_W, rand() * MAP_H, 2, 2, rand() > 0.5 ? landAlt : land);
  }

  // The built-up middle is stippled rather than filled — a solid ellipse reads
  // as a lake, and the point is that the city looks built, not painted.
  for (let i = 0; i < 5600; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand());
    if (rand() < r * 0.75) continue;
    px(ctx, 165 + Math.cos(a) * r * 130, 270 + Math.sin(a) * r * 190, 2, 2, built);
  }

  // green
  for (const p of parks) {
    ellipse(ctx, p.at, p.rx + 1, p.ry + 1, pal['grass-edge']);
    ellipse(ctx, p.at, p.rx, p.ry, pal.grass);
    ellipse(ctx, [p.at[0] - 2, p.at[1] - 2], Math.max(2, p.rx - 5), Math.max(2, p.ry - 4), pal['grass-alt']);
    const trees = Math.round(p.rx * 0.9);
    for (let i = 0; i < trees; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand());
      px(
        ctx,
        p.at[0] + Math.cos(a) * r * p.rx * 0.8,
        p.at[1] + Math.sin(a) * r * p.ry * 0.8,
        2,
        2,
        pal['tree-trunk'],
      );
    }
  }

  // small water
  for (const l of ponds) {
    ellipse(ctx, l.at, l.rx + 1, l.ry + 1, pal['grass-edge']);
    ellipse(ctx, l.at, l.rx, l.ry, pal.water);
    ellipse(ctx, [l.at[0] - 1, l.at[1] - 1], Math.max(1, l.rx - 4), Math.max(1, l.ry - 3), pal['water-light']);
  }

  // background street grid, kept inside the built-up area
  const inCity = (x: number, y: number) =>
    ((x - 165) / 132) ** 2 + ((y - 270) / 195) ** 2 < 1;
  ctx.globalAlpha = night ? 0.5 : 0.7;
  for (let i = 0; i < 150; i++) {
    const horiz = rand() > 0.5;
    const x = 30 + rand() * 260;
    const y = 40 + rand() * 460;
    const len = 12 + rand() * 46;
    if (!inCity(x, y)) continue;
    const end: Point = horiz
      ? [x + len, y + (rand() - 0.5) * 6]
      : [x + (rand() - 0.5) * 6, y + len];
    line(ctx, [x, y], end, 1, pal['path-edge']);
  }
  ctx.globalAlpha = 1;

  // building clusters under each district label
  for (const d of districts) {
    const n = Math.round((d.size ?? 10) * 1.5);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const r = rand() * (d.size ?? 10);
      const bx = d.at[0] + Math.cos(a) * r;
      const by = d.at[1] + Math.sin(a) * r;
      px(ctx, bx, by, 2 + Math.round(rand() * 2), 2 + Math.round(rand() * 2), night ? pal['bg-deep'] : built);
      if (night && rand() > 0.55) px(ctx, bx, by, 1, 1, pal['window-lit']);
    }
  }

  // roads, with a one-pixel casing so they read as roads rather than ribbons
  for (const a of arterials) polyline(ctx, a.pts, a.width + 1, pal.outline);
  for (const a of arterials) polyline(ctx, a.pts, a.width, road);

  // The lake goes on top of the roads: nothing is built over it, and the road
  // visibly stops at the shore, which is why he has to swim.
  ellipse(ctx, lake.at, lake.rx + 2, lake.ry + 2, pal['grass-edge']);
  ellipse(ctx, lake.at, lake.rx, lake.ry, pal.water);
  ellipse(ctx, [lake.at[0] - 3, lake.at[1] - 3], lake.rx - 12, lake.ry - 9, pal['water-light']);
  // surface ripples
  for (let i = 0; i < 90; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.92;
    px(
      ctx,
      lake.at[0] + Math.cos(a) * r * lake.rx,
      lake.at[1] + Math.sin(a) * r * lake.ry,
      rand() > 0.6 ? 3 : 2,
      1,
      rand() > 0.5 ? pal['water-light'] : pal.water,
    );
  }

  // frame
  ctx.fillStyle = pal.outline;
  ctx.fillRect(0, 0, MAP_W, 2);
  ctx.fillRect(0, MAP_H - 2, MAP_W, 2);
  ctx.fillRect(0, 0, 2, MAP_H);
  ctx.fillRect(MAP_W - 2, 0, 2, MAP_H);

  return canvas;
}
