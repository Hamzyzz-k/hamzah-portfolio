import { useEffect, useRef } from 'react';

import type { Grid } from '../sprites/poses';

interface Props {
  grid: Grid;
  palette: Record<string, string>;
  /** CSS pixels per sprite pixel. */
  scale?: number;
  /** Mirror horizontally — used to face the character left. */
  flip?: boolean;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

/**
 * Paints a character grid to a canvas sized to the grid itself, then lets CSS
 * scale it up with `image-rendering: pixelated`. Drawing at 1:1 and scaling in
 * CSS keeps every pixel square at any zoom level and keeps the redraw cheap
 * enough to run on every animation frame.
 */
export default function PixelSprite({
  grid,
  palette,
  scale = 3,
  flip = false,
  className,
  style,
  alt,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cols = grid[0]?.length ?? 0;
  const rows = grid.length;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, cols, rows);
    for (let y = 0; y < rows; y++) {
      const row = grid[y];
      for (let x = 0; x < cols; x++) {
        const colour = palette[row[x]];
        if (!colour) continue;
        ctx.fillStyle = colour;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [grid, palette, cols, rows]);

  return (
    <canvas
      ref={ref}
      width={cols}
      height={rows}
      role={alt ? 'img' : 'presentation'}
      aria-label={alt}
      className={className}
      style={{
        width: cols * scale,
        height: rows * scale,
        transform: flip ? 'scaleX(-1)' : undefined,
        ...style,
      }}
    />
  );
}
