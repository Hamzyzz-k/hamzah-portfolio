"""Author every character pose and emit them as a TypeScript module.

Run from the project root:

    python scripts/make_sprites.py

Poses are composed from small body parts stamped onto a 24x24 frame, rather
than counted by hand, so a new pose is a list of (part, x, y) instead of 24
rows of dots. Every frame is the same size and the body is centred in it, which
means the page can anchor any pose by bottom-centre without special cases.

Outfit follows ref-images/Mypic.jpeg: white shirt, navy tie, dark curly hair
and beard. Proportions follow ref-images/portfolio2.jpg.

Outputs:
    src/sprites/poses.ts        all frames + the cycles that use them
    scripts/preview-poses.png   contact sheet, for actually looking at them

Legend
  .  transparent   o outline    h hair    H hair highlight   S skin   s skin shade
  b  beard         W shirt      w shirt shade   T tie    D tie dot
  p  trousers      P trousers shade   k shoe
  L  laptop shell  l keyboard   c screen    E phone
  R  shades        q white      m mug       f rose    C gold chain
  N  water/sweat   M moon light n moon shade
  Y  auto yellow   K auto dark  G glass     O sun core  F sun light
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_TS = ROOT / "src" / "sprites" / "poses.ts"
OUT_PNG = Path(__file__).resolve().parent / "preview-poses.png"

W = H = 24

PALETTE = {
    "o": "#140f14",
    "h": "#241b1e",
    "H": "#3f3032",
    "S": "#cdb695",
    "s": "#a97f4e",
    "b": "#503830",
    "W": "#f4efe3",
    "w": "#cfc7b6",
    "T": "#37477a",
    "D": "#e8563f",
    "p": "#2b3550",
    "P": "#1f2740",
    "k": "#3a2a20",
    "L": "#59627f",
    "l": "#3b4258",
    "c": "#6ef0c8",
    "E": "#2b2b34",
    "R": "#20222e",
    "q": "#faf6ec",
    "m": "#e8563f",
    "f": "#e8563f",
    "C": "#f2c14e",
    "N": "#7fd0f0",
    "M": "#f4e6c3",
    "n": "#d9c79c",
    "Y": "#f2c14e",
    "K": "#1c1c24",
    "G": "#8fd6e8",
    "O": "#ff9d3d",
    "F": "#ffd76b",
}

# ---------------------------------------------------------------- body parts


def art(block: str) -> list[str]:
    rows = [r for r in block.split("\n") if r != ""]
    width = max(len(r) for r in rows)
    return [r.ljust(width, ".") for r in rows]


def mirror(part: list[str]) -> list[str]:
    """Flip a part horizontally, so left-facing poses need no second drawing."""
    return [row[::-1] for row in part]


# heads ---------------------------------------------------------------------

HEAD_FRONT = art(
    """
.oooooooooo.
ohHhhhHhhHho
ohhhhhhhhhho
oHhhhhhhhhHo
.ohhhhhhhho.
.ohSSSSSSho.
.ohSoSSoSho.
.ohSSSSSSho.
.ohSbbbbSho.
..obbbbbbo..
...oSSSSo...
"""
)

HEAD_SIDE = art(
    """
..oooooooo..
.ohHhhhhhHho
.ohhhhhhhhho
.oHhhhhhhhho
..ohhhhhhho.
..ohSSSSoho.
..ohSoSSSho.
..ohSSSSSho.
..ohSSSSSbo.
...obbbbbo..
...oSSSSo...
"""
)

HEAD_BACK = art(
    """
.oooooooooo.
ohHhhhHhhHho
ohhhhhhhhhho
oHhhhhhhhhHo
.ohhhhhhhho.
.ohhhhhhhho.
.ohhhhhhhho.
.ohhhhhhhho.
.ohhhhhhhho.
..ohhhhhho..
...oSSSSo...
"""
)

# squinting, mouth open — the out-of-breath face
HEAD_TIRED = art(
    """
.oooooooooo.
ohHhhhHhhHho
ohhhhhhhhhho
oHhhhhhhhhHo
.ohhhhhhhho.
.ohSSSSSSho.
.ohSooooSho.
.ohSSSSSSho.
.ohSboobSho.
..obbbbbbo..
...oSSSSo...
"""
)

HEAD_SHADES = art(
    """
.oooooooooo.
ohHhhhHhhHho
ohhhhhhhhhho
oHhhhhhhhhHo
.ohhhhhhhho.
.oRRRRRRRRo.
.oRqRRRRqRo.
.ohSSSSSSho.
.ohSbqqbSho.
..obbbbbbo..
...oSSSSo...
"""
)

HEAD_WINK = art(
    """
.oooooooooo.
ohHhhhHhhHho
ohhhhhhhhhho
oHhhhhhhhhHo
.ohhhhhhhho.
.oRRRRRRRRo.
.oRqRRRRoRo.
.ohSSSSSSho.
.ohSbqqbSho.
..obbbbbbo..
...oSSSSo...
"""
)

# shades, wink and a lopsided smirk — the drip pose
HEAD_DRIP = art(
    """
.oooooooooo.
ohHhhhHhhHho
ohhhhhhhhhho
oHhhhhhhhhHo
.ohhhhhhhho.
.oRRRRRRRRo.
.oRqRRRRoRo.
.ohSSSSSSho.
.ohSqqqbSho.
..obbbbbbo..
...oSSSSo...
"""
)

# hair being smoothed down, one side flattened
HEAD_HAIRFIX = art(
    """
.oooooooooo.
ohHhhhhhhhho
ohhhhhhhhhho
.ohhhhhhhhHo
..ohhhhhhho.
.ohSSSSSSho.
.ohSoSSoSho.
.ohSSSSSSho.
.ohSbbbbSho.
..obbbbbbo..
...oSSSSo...
"""
)

# torsos --------------------------------------------------------------------

TORSO_FRONT = art(
    """
.oooooooooo.
owWWoTToWWwo
owWWWTTWWWwo
owWWWTTWWWwo
owWWWDTWWWwo
owWWWTTWWWwo
.oWWWWWWWWo.
"""
)

# knot pulled up a notch, for the tie-straightening pose
TORSO_TIEFIX = art(
    """
.oooooooooo.
owWWoTToWWwo
owWWWTTWWWwo
owWWWTTWWWwo
owWWWTTWWWwo
owWWWDTWWWwo
.oWWWTTWWWo.
"""
)

TORSO_SIDE = art(
    """
..oooooooo..
.owWWWWWWwo.
.owWWWWWWwo.
.owWWTWWWwo.
.owWWWWWWwo.
.owwWWWWwwo.
..oWWWWWWo..
"""
)

TORSO_BACK = art(
    """
.oooooooooo.
owWWWWWWWWwo
owWWWWWWWWwo
owWWWWWWWWwo
owWWWWWWWWwo
owWWWWWWWWwo
.oWWWWWWWWo.
"""
)

# shirt plus a gold chain, for the drip pose
TORSO_DRIP = art(
    """
.oooooooooo.
owWWoTToWWwo
owWCCTTCCWwo
owWWCTTCWWwo
owWWWCCWWWwo
owWWWDTWWWwo
.oWWWWWWWWo.
"""
)

# legs ----------------------------------------------------------------------

LEGS_TOGETHER = art(
    """
..oppppppo..
..oppppppo..
..oppooppo..
..oppooppo..
.okkoookko..
.ooooooooo..
"""
)

LEGS_STEP_A = art(
    """
..oppppppo..
.opppoppo...
.oppo.oppo..
.oppo.oppo..
okko...okko.
oooo...oooo.
"""
)

LEGS_STEP_B = art(
    """
..oppppppo..
...oppoppo..
..oppo.oppo.
..oppo.oppo.
.okko...okko
.oooo...oooo
"""
)

LEGS_WIDE = art(
    """
..oppppppo..
.opppoppo...
oppo...oppo.
oppo...oppo.
kko.....okk.
ooo.....ooo.
"""
)

LEGS_SIDE_A = art(
    """
..oppppppo..
.opppoppo...
oppo..oppo..
oppo..oppo..
kko....okko.
ooo....oooo.
"""
)

LEGS_SIDE_B = art(
    """
..oppppppo..
..oppppppo..
..oppoppo...
..oppoppo...
.okko.okko..
.oooo.oooo..
"""
)

LEGS_KICK_L = art(
    """
..oppppppo..
.opppoppo...
oppo..oppo..
ppo....oppo.
ko......okko
oo......oooo
"""
)

LEGS_KICK_R = art(
    """
..oppppppo..
...oppoppo..
..oppo..oppo
.oppo....opp
okko......ok
oooo......oo
"""
)

# knees bent, weight dropped — the dip in the dance
LEGS_DIP = art(
    """
..oppppppo..
.opppppppo..
.oppo..oppo.
.oppo..oppo.
okkoo..okko.
ooooo..oooo.
"""
)

# both feet off the ground — shorter than the others, so the empty rows below
# read as air rather than the sprite sinking
LEGS_TUCK = art(
    """
..oppppppo..
.oppo..oppo.
.okko..okko.
.oooo..oooo.
"""
)

# hunched, out of breath
LEGS_HUNCH = art(
    """
.opppppppo..
.opppppppo..
.oppo.oppo..
.oppo.oppo..
okkoo.okkoo.
ooooo.ooooo.
"""
)

# seated in profile: thigh forward, shin down
LEGS_SIT = art(
    """
..opppppppo.
..opppppppo.
..oPo...oPo.
..oPo...oPo.
..okko..okko
..oooo..oooo
"""
)

# arms ----------------------------------------------------------------------

ARM_UP = art(
    """
oSSo
oSSo
oWWo
oWWo
.oo.
"""
)

ARM_OUT_R = art(
    """
oWWSSo
oWWSSo
.oooo.
"""
)

ARM_OUT_L = art(
    """
oSSWWo
oSSWWo
.oooo.
"""
)

ARM_DOWN = art(
    """
oWo
oWo
oSo
oSo
.o.
"""
)

ARM_HIP = art(
    """
oWWo
oSSo
.oo.
"""
)

ARM_TYPE = art(
    """
oWo
oWo
oSo
.o.
"""
)

# forearm raised across the brow
ARM_WIPE = art(
    """
oSSSSo
oSSSSo
.oWWo.
..oo..
"""
)

# bent up to the ear, holding a phone
ARM_PHONE = art(
    """
oEEo
oEEo
oSSo
oWWo
oWWo
.oo.
"""
)

# hand up at the hairline
ARM_HAIR = art(
    """
oSSSo
oSSSo
.oWo.
.oWo.
..o..
"""
)

# hand resting on the tie knot
ARM_TIE = art(
    """
oWWo
oWSo
oSSo
.oo.
"""
)

# swimming stroke, arm reaching forward
ARM_REACH = art(
    """
oSSWWWo
oSSWWWo
.ooooo.
"""
)

# finger gun
ARM_POINT = art(
    """
oWWSSSo
oWWSSSo
.ooooo.
"""
)

# props ---------------------------------------------------------------------

# Seen from the side: the lid leans back, the screen face and the keyboard deck
# are both visible, so it reads as a laptop rather than a slab.
LAPTOP_ANGLE = art(
    """
..oooooooo..
.occccccccLo
.occccccccLo
.occccccccLo
.occccccccLo
.occccccccLo
.oooooooooLo
ollllllllllo
.oooooooooo.
"""
)

MUG = art(
    """
ommo
ommo
.oo.
"""
)

# water surface the swimmer sits in
WATERLINE = art(
    """
NNNNNNNNNNNNNNNNNNNN
oNNNNNNNNNNNNNNNNNNo
.oooooooooooooooooo.
"""
)

# --------------------------------------------------------------------- frames

Stamp = tuple[list[str], int, int]


def compose(*stamps: Stamp) -> list[str]:
    grid = [["."] * W for _ in range(H)]
    for block, ox, oy in stamps:
        for y, row in enumerate(block):
            for x, ch in enumerate(row):
                if ch == ".":
                    continue
                gx, gy = ox + x, oy + y
                assert 0 <= gx < W and 0 <= gy < H, f"stamp overflows frame at ({gx},{gy})"
                grid[gy][gx] = ch
    return ["".join(row) for row in grid]


HEAD_X, HEAD_Y = 6, 0
TORSO_X, TORSO_Y = 6, 11
LEGS_X, LEGS_Y = 6, 18

FRAMES: dict[str, list[str]] = {}


def add(name: str, *stamps: Stamp) -> None:
    FRAMES[name] = compose(*stamps)


def body(
    head: list[str],
    torso: list[str],
    legs: list[str],
    *extra: Stamp,
    dy: int = 0,
    legs_dy: int | None = None,
) -> tuple[Stamp, ...]:
    """Standard stack.

    `dy` moves the upper body, which is what a dip actually does — the feet
    stay planted. `legs_dy` moves the legs too, for jump frames.
    """
    return (
        (head, HEAD_X, HEAD_Y + dy),
        (torso, TORSO_X, TORSO_Y + dy),
        (legs, LEGS_X, LEGS_Y + (dy if legs_dy is None else legs_dy)),
        *extra,
    )


# walking -------------------------------------------------------------------
add("walkFrontA", *body(HEAD_FRONT, TORSO_FRONT, LEGS_STEP_A))
add("walkFrontB", *body(HEAD_FRONT, TORSO_FRONT, LEGS_TOGETHER))
add("walkFrontC", *body(HEAD_FRONT, TORSO_FRONT, LEGS_STEP_B))
add("walkSideA", *body(HEAD_SIDE, TORSO_SIDE, LEGS_SIDE_A))
add("walkSideB", *body(HEAD_SIDE, TORSO_SIDE, LEGS_SIDE_B))
add("walkBackA", *body(HEAD_BACK, TORSO_BACK, LEGS_STEP_A))
add("walkBackB", *body(HEAD_BACK, TORSO_BACK, LEGS_TOGETHER))
add("walkBackC", *body(HEAD_BACK, TORSO_BACK, LEGS_STEP_B))
add("idleFront", *body(HEAD_FRONT, TORSO_FRONT, LEGS_TOGETHER))
add("idleSide", *body(HEAD_SIDE, TORSO_SIDE, LEGS_SIDE_B))
add("idleBack", *body(HEAD_BACK, TORSO_BACK, LEGS_TOGETHER))

# dancing — six frames with real travel, not a two-frame bob -----------------
add("danceA", *body(HEAD_FRONT, TORSO_FRONT, LEGS_KICK_L, (ARM_UP, 3, 7), (ARM_DOWN, 17, 12)))
add("danceB", *body(HEAD_FRONT, TORSO_FRONT, LEGS_WIDE, (ARM_OUT_L, 1, 12), (ARM_OUT_R, 17, 12)))
add("danceC", *body(HEAD_FRONT, TORSO_FRONT, LEGS_KICK_R, (ARM_DOWN, 4, 12), (ARM_UP, 17, 7)))
add("danceD", *body(HEAD_FRONT, TORSO_FRONT, LEGS_DIP, (ARM_HIP, 3, 16), (ARM_HIP, 17, 16), dy=2, legs_dy=0))
add("danceE", *body(HEAD_FRONT, TORSO_FRONT, LEGS_TUCK, (ARM_UP, 3, 7), (ARM_UP, 17, 7)))
add("danceF", *body(HEAD_BACK, TORSO_BACK, LEGS_WIDE, (ARM_OUT_L, 1, 12), (ARM_OUT_R, 17, 12)))

# coding, from the side so the laptop actually reads as a laptop -------------
# Facing left with the laptop beside him, so the machine and the person are
# both legible instead of the screen covering his body.
HEAD_LEFT = mirror(HEAD_SIDE)
TORSO_LEFT = mirror(TORSO_SIDE)
LEGS_SIT_LEFT = mirror(LEGS_SIT)
CODE_X = 11

add(
    "codeSideA",
    (HEAD_LEFT, CODE_X, 0),
    (TORSO_LEFT, CODE_X, 11),
    (LEGS_SIT_LEFT, CODE_X, 18),
    (ARM_TYPE, 12, 14),
    (LAPTOP_ANGLE, 0, 13),
)
add(
    "codeSideB",
    (HEAD_LEFT, CODE_X, 0),
    (TORSO_LEFT, CODE_X, 11),
    (LEGS_SIT_LEFT, CODE_X, 18),
    (ARM_TYPE, 12, 13),
    (LAPTOP_ANGLE, 0, 13),
)
add(
    "codeSideC",
    (HEAD_LEFT, CODE_X, 0),
    (TORSO_LEFT, CODE_X, 11),
    (LEGS_SIT_LEFT, CODE_X, 18),
    (ARM_TYPE, 12, 14),
    (MUG, 20, 11),
    (LAPTOP_ANGLE, 0, 13),
)

# swimming ------------------------------------------------------------------
add(
    "swimA",
    (HEAD_SIDE, HEAD_X, HEAD_Y + 4),
    (TORSO_SIDE, TORSO_X, TORSO_Y + 4),
    (ARM_REACH, 16, 16),
    (WATERLINE, 2, 19),
)
add(
    "swimB",
    (HEAD_SIDE, HEAD_X, HEAD_Y + 3),
    (TORSO_SIDE, TORSO_X, TORSO_Y + 3),
    (ARM_UP, 17, 11),
    (WATERLINE, 2, 19),
)

# out of breath -------------------------------------------------------------
add("tiredA", *body(HEAD_TIRED, TORSO_FRONT, LEGS_HUNCH, (ARM_DOWN, 4, 14), (ARM_DOWN, 17, 14), dy=1, legs_dy=0))
add("tiredB", *body(HEAD_TIRED, TORSO_FRONT, LEGS_HUNCH, (ARM_DOWN, 4, 15), (ARM_DOWN, 17, 15), dy=2, legs_dy=0))
add("wipeA", *body(HEAD_TIRED, TORSO_FRONT, LEGS_TOGETHER, (ARM_WIPE, 5, 5), (ARM_DOWN, 17, 13)))
add("wipeB", *body(HEAD_TIRED, TORSO_FRONT, LEGS_TOGETHER, (ARM_WIPE, 6, 4), (ARM_DOWN, 17, 13)))

# hover reactions -----------------------------------------------------------
add("phoneA", *body(HEAD_SIDE, TORSO_SIDE, LEGS_TOGETHER, (ARM_PHONE, 16, 4), (ARM_DOWN, 4, 13)))
add("phoneB", *body(HEAD_SIDE, TORSO_SIDE, LEGS_TOGETHER, (ARM_PHONE, 16, 5), (ARM_DOWN, 4, 13)))
add("tieFixA", *body(HEAD_FRONT, TORSO_TIEFIX, LEGS_TOGETHER, (ARM_TIE, 8, 14), (ARM_DOWN, 17, 13)))
add("tieFixB", *body(HEAD_HAIRFIX, TORSO_FRONT, LEGS_TOGETHER, (ARM_HAIR, 4, 2), (ARM_DOWN, 17, 13)))

# rizz ----------------------------------------------------------------------
add("rizzA", *body(HEAD_SHADES, TORSO_FRONT, LEGS_TOGETHER, (ARM_HIP, 3, 13), (ARM_HIP, 17, 13)))
add("rizzB", *body(HEAD_WINK, TORSO_FRONT, LEGS_TOGETHER, (ARM_POINT, 0, 12), (ARM_POINT, 17, 12)))
add("rizzC", *body(HEAD_DRIP, TORSO_DRIP, LEGS_STEP_B, (ARM_UP, 3, 7), (ARM_HIP, 17, 13)))
add("rizzD", *body(HEAD_DRIP, TORSO_DRIP, LEGS_WIDE, (ARM_OUT_L, 1, 12), (ARM_POINT, 17, 12)))

# ------------------------------------------------------------- world sprites

WORLD: dict[str, list[str]] = {}


def add_world(name: str, block: str) -> None:
    rows = art(block)
    width = max(len(r) for r in rows)
    assert all(len(r) == width for r in rows), name
    WORLD[name] = rows


add_world(
    "moon",
    """
....oooo....
..ooMMMMoo..
.oMMMMMMMMo.
.oMnnMMMMMo.
oMMnnMMMMMMo
oMMMMMMMMMMo
oMMMMMMMnMMo
oMMMMMMMnnMo
.oMMMMMMMMo.
.oMMnMMMMMo.
..ooMMMMoo..
....oooo....
""",
)

add_world(
    "sun",
    """
.......OO.......
................
.....oooooo.....
...ooFFFFFFoo...
..oFFFFFFFFFFo..
.oFFFFFFFFFFFFo.
.oFFFFOOFFFFFFo.
OoFFFFOOFFFFFFoO
OoFFFFFFFFFFFFoO
.oFFFFFFFFOOFFo.
.oFFFFFFFFOOFFo.
..oFFFFFFFFFFo..
...ooFFFFFFoo...
.....oooooo.....
................
.......OO.......
""",
)

add_world(
    "auto",
    """
..ooooo..
.oKKKKKo.
oKYYYYYKo
oKYGGGYKo
oKYYYYYKo
.oKKKKKo.
..ooooo..
""",
)

# --------------------------------------------------------------------- output


def preview(scale: int = 5, per_row: int = 6) -> None:
    pad = 2
    cell = W + pad
    cols = min(per_row, len(FRAMES))
    rows_n = (len(FRAMES) + cols - 1) // cols
    img = Image.new("RGBA", (cell * cols, (H + pad) * rows_n), (24, 24, 32, 255))
    px = img.load()
    for idx, rows in enumerate(FRAMES.values()):
        ox = (idx % cols) * cell + pad // 2
        oy = (idx // cols) * (H + pad) + pad // 2
        for y, row in enumerate(rows):
            for x, ch in enumerate(row):
                if ch == ".":
                    continue
                c = PALETTE[ch]
                px[ox + x, oy + y] = (
                    int(c[1:3], 16),
                    int(c[3:5], 16),
                    int(c[5:7], 16),
                    255,
                )
    img.resize((img.width * scale, img.height * scale), Image.NEAREST).save(OUT_PNG)


def emit_ts() -> None:
    out = [
        "/* GENERATED by scripts/make_sprites.py — edit the art there, not here. */",
        "",
        "export type Grid = string[];",
        "",
        "export const SPRITE_W = 24;",
        "export const SPRITE_H = 24;",
        "",
        "export const PALETTE: Record<string, string> = {",
    ]
    for key, val in PALETTE.items():
        out.append(f"  {key}: '{val}',")
    out.append("};")
    out.append("")

    for name, rows in FRAMES.items():
        body_src = ",\n".join(f"  '{r}'" for r in rows)
        out.append(f"export const {name}: Grid = [\n{body_src},\n];\n")

    for name, rows in WORLD.items():
        body_src = ",\n".join(f"  '{r}'" for r in rows)
        out.append(f"export const {name}Sprite: Grid = [\n{body_src},\n];\n")

    out += [
        "export const walkFront: Grid[] = [walkFrontA, walkFrontB, walkFrontC, walkFrontB];",
        "export const walkSide: Grid[] = [walkSideA, walkSideB, walkSideA, walkSideB];",
        "export const walkBack: Grid[] = [walkBackA, walkBackB, walkBackC, walkBackB];",
        "export const danceCycle: Grid[] = [danceA, danceB, danceC, danceD, danceE, danceF];",
        "export const codeCycle: Grid[] = [codeSideA, codeSideB, codeSideA, codeSideC];",
        "export const swimCycle: Grid[] = [swimA, swimB];",
        "export const tiredCycle: Grid[] = [tiredA, tiredB];",
        "export const wipeCycle: Grid[] = [wipeA, wipeB];",
        "export const phoneCycle: Grid[] = [phoneA, phoneB];",
        "export const linkedinCycle: Grid[] = [tieFixA, tieFixB];",
        "export const rizzCycle: Grid[] = [rizzA, rizzB, rizzC, rizzD];",
        "",
    ]
    OUT_TS.write_text("\n".join(out), encoding="utf-8")


if __name__ == "__main__":
    preview()
    emit_ts()
    print(f"wrote {OUT_TS.relative_to(ROOT)} ({len(FRAMES)} frames) and {OUT_PNG.name}")
