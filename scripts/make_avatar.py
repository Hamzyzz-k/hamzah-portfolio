"""Convert the source photo into pixel-art avatar sprites.

Run once from the project root:

    python scripts/make_avatar.py

Outputs (committed, so this normally never needs re-running):
    public/sprites/avatar-64.png       64x64 quantized portrait, transparent background
    public/sprites/avatar-16.png       16x16 head, used to colour-match the walking sprite
    public/sprites/avatar-preview.png  8x upscale on a checker, for eyeballing the result

The source is a phone screenshot, so it carries a status bar and letterbox bars.
The photo region is detected rather than hard-coded, and the studio-blue backdrop
is flood-filled away from the borders (rather than colour-keyed globally) so that
blue-ish shadows inside the face survive.
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "ref-images" / "Mypic.jpeg"
OUT = ROOT / "public" / "sprites"

HEAD_TOP = 0.0      # start of the head crop, as a fraction of the photo region
HEAD_HEIGHT = 0.70  # crop side length, as a fraction of the photo region height
HEAD_CENTRE_X = 0.50

PALETTE_SIZE = 26
SIZE = 64


def content_box(img: Image.Image) -> tuple[int, int]:
    """Top and bottom of the largest contiguous run of non-letterbox rows."""
    arr = np.asarray(img.convert("RGB")).astype(int)
    bright = arr.mean(axis=(1, 2)) > 30

    best = (0, 0)
    start = None
    for i, on in enumerate(bright):
        if on and start is None:
            start = i
        elif not on and start is not None:
            if i - start > best[1] - best[0]:
                best = (start, i - 1)
            start = None
    if start is not None and len(bright) - start > best[1] - best[0]:
        best = (start, len(bright) - 1)

    return best[0], best[1] + 1


def is_backdrop(px: tuple[int, int, int]) -> bool:
    """Studio-blue backdrop: clearly bluer than it is red, and not very dark."""
    r, g, b = px
    return b > r + 22 and b > g + 6 and b > 60


def cut_backdrop(img: Image.Image) -> Image.Image:
    """Flood-fill the backdrop from the image border and make it transparent."""
    w, h = img.size
    px = img.load()
    out = img.convert("RGBA")
    op = out.load()

    seen = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if is_backdrop(px[x, y]):
                queue.append((x, y))
                seen[y][x] = True
    for y in range(h):
        for x in (0, w - 1):
            if is_backdrop(px[x, y]) and not seen[y][x]:
                queue.append((x, y))
                seen[y][x] = True

    while queue:
        x, y = queue.popleft()
        op[x, y] = (0, 0, 0, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and is_backdrop(px[nx, ny]):
                seen[ny][nx] = True
                queue.append((nx, ny))

    return out


def checkerboard(img: Image.Image, cell: int = 32) -> Image.Image:
    bg = Image.new("RGB", img.size, (210, 210, 210))
    load = bg.load()
    for y in range(img.height):
        for x in range(img.width):
            if ((x // cell) + (y // cell)) % 2:
                load[x, y] = (170, 170, 170)
    bg.paste(img, (0, 0), img)
    return bg


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.open(SRC).convert("RGB")

    top, bottom = content_box(img)
    region_h = bottom - top

    size = int(region_h * HEAD_HEIGHT)
    left = max(0, int(img.width * HEAD_CENTRE_X) - size // 2)
    upper = top + int(region_h * HEAD_TOP)
    head = img.crop((left, upper, left + size, upper + size))

    small = head.resize((SIZE, SIZE), Image.BOX)
    small = small.quantize(colors=PALETTE_SIZE, method=Image.MEDIANCUT, dither=Image.NONE)
    small = small.convert("RGB")

    cut = cut_backdrop(small)
    cut.save(OUT / "avatar-64.png")
    cut.resize((16, 16), Image.BOX).save(OUT / "avatar-16.png")
    checkerboard(cut.resize((512, 512), Image.NEAREST)).save(OUT / "avatar-preview.png")

    counts: dict[tuple[int, int, int, int], int] = {}
    for p in cut.getdata():
        if p[3]:
            counts[p] = counts.get(p, 0) + 1
    print(f"crop: x={left} y={upper} size={size}")
    print("dominant colours (hex, pixel count):")
    for (r, g, b, _a), n in sorted(counts.items(), key=lambda kv: -kv[1])[:14]:
        print(f"  #{r:02x}{g:02x}{b:02x}  {n}")


if __name__ == "__main__":
    main()
