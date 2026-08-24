/* ---------------------------------------------------------------------------
   An invented city map.

   Authored in map pixels on a 320 x 560 canvas with north at the top; the
   canvas is scaled up by MAP_SCALE with `image-rendering: pixelated`, so one
   map pixel is one crisp square on screen.

   Nothing here refers to a real place. The districts are made up, and the road
   layout is drawn for the walk rather than copied from anywhere.
--------------------------------------------------------------------------- */

export const MAP_W = 320;
export const MAP_H = 560;
export const MAP_SCALE = 3;

export type Point = [number, number];

export interface District {
  id: string;
  label: string;
  at: Point;
  labelSide?: 'left' | 'right' | 'above' | 'below';
  /** Rough footprint of the building cluster drawn underneath. */
  size?: number;
}

export const districts: District[] = [
  { id: 'northgate', label: 'NORTHGATE', at: [86, 92], labelSide: 'left', size: 14 },
  { id: 'oldtown', label: 'OLD TOWN', at: [150, 168], labelSide: 'above', size: 16 },
  { id: 'eastmarket', label: 'EAST MARKET', at: [232, 196], labelSide: 'right', size: 14 },
  { id: 'lakeside', label: 'LAKESIDE', at: [214, 300], labelSide: 'right', size: 11 },
  { id: 'thebasin', label: 'THE BASIN', at: [122, 356], labelSide: 'left', size: 14 },
  { id: 'southworks', label: 'SOUTHWORKS', at: [190, 470], labelSide: 'right', size: 16 },
  // unvisited places, there to make the map feel bigger than the route
  { id: 'highfell', label: 'HIGHFELL', at: [44, 210], labelSide: 'left', size: 9 },
  { id: 'thespur', label: 'THE SPUR', at: [286, 118], labelSide: 'left', size: 9 },
  { id: 'redkiln', label: 'RED KILN', at: [274, 400], labelSide: 'right', size: 10 },
  { id: 'thewarrens', label: 'THE WARRENS', at: [72, 460], labelSide: 'left', size: 10 },
];

export const districtById = Object.fromEntries(districts.map((d) => [d.id, d]));

export const parks: { at: Point; rx: number; ry: number }[] = [
  { at: [178, 140], rx: 22, ry: 13 },
  { at: [104, 250], rx: 18, ry: 12 },
  { at: [246, 254], rx: 15, ry: 10 },
  { at: [148, 500], rx: 40, ry: 34 },
  { at: [292, 330], rx: 16, ry: 12 },
  { at: [40, 130], rx: 14, ry: 11 },
];

/**
 * The lake. The road stops at its north shore and picks up again on the south
 * shore — the character swims the gap, which is the whole point of it.
 */
export const lake = { at: [168, 258] as Point, rx: 54, ry: 30 };

export const ponds: { at: Point; rx: number; ry: number }[] = [
  { at: [70, 60], rx: 12, ry: 7 },
  { at: [290, 218], rx: 11, ry: 7 },
  { at: [56, 342], rx: 10, ry: 6 },
  { at: [240, 520], rx: 14, ry: 8 },
];

export const arterials: { pts: Point[]; width: number }[] = [
  // ring road
  {
    width: 3,
    pts: [
      [52, 150],
      [88, 74],
      [160, 46],
      [236, 68],
      [290, 132],
      [300, 232],
      [284, 330],
      [244, 432],
      [166, 496],
      [80, 470],
      [34, 372],
      [30, 244],
      [52, 150],
    ],
  },
  { width: 2, pts: [[150, 170], [120, 108], [86, 92], [58, 42]] },
  { width: 2, pts: [[150, 170], [206, 182], [232, 196], [292, 186]] },
  { width: 2, pts: [[122, 356], [66, 330], [24, 300]] },
  { width: 2, pts: [[190, 470], [252, 434], [300, 396]] },
  { width: 2, pts: [[214, 300], [258, 336], [286, 392]] },
  { width: 2, pts: [[122, 356], [138, 424], [190, 470], [206, 540]] },
  { width: 2, pts: [[86, 92], [40, 132], [22, 190]] },
];

/**
 * The walking route, north to south. It runs straight through the lake —
 * whether he is swimming is decided geometrically (his map position against
 * the lake's ellipse), not by a fixed stretch of this list.
 */
export const routePoints: Point[] = [
  [72, 24],
  [80, 58],
  [86, 92],
  [112, 122],
  [132, 148],
  [150, 168],
  [186, 180],
  [214, 190],
  [232, 196],
  [222, 226],
  [196, 236],
  // into the water
  [180, 250],
  [166, 266],
  [174, 284],
  // out the other side
  [196, 294],
  [214, 300],
  [186, 322],
  [150, 340],
  [122, 356],
  [128, 396],
  [154, 432],
  [176, 452],
  [190, 470],
  [198, 508],
  [204, 548],
];

/** Ambient traffic — small vehicles loop these for a bit of life. */
export const trafficRoutes: Point[][] = [
  [[30, 244], [52, 150], [88, 74], [160, 46], [236, 68], [290, 132], [300, 232]],
  [[300, 232], [284, 330], [244, 432], [166, 496], [80, 470], [34, 372], [30, 244]],
  [[150, 170], [206, 182], [232, 196], [292, 186]],
  [[122, 356], [138, 424], [190, 470], [206, 540]],
];
