#!/usr/bin/env python3
"""Azulejo Mosaic (30) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G169).

The design's own PAKET 5 parts are ordered in collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md and do not exist
yet. Every part is taken PART BY PART the moment its file exists in collections/30_Azulejo_Mosaic/assets/gpt/parts/;
a missing part keeps its interim stand-in, cut, toned or scaled from GPT pixels already in the repo — nothing is drawn
(K21, docs/11 §5.7). Both ways give the pages the same file names (fixed pixel sizes below), so no template changes
when GPT's parts arrive:

  part (GPT_PROMPTS.md)     output (img/)                 interim stand-in
  azulejo_1   (W2.1)        tile_1-128/256  field tile    05 frame_portrait border: the daisy tile (centre toned terracotta)
  azulejo_2   (W2.2)        tile_2-128/256  border tile   05 border: the leaf-spray tile
  azulejo_3   (W2.3)        tile_3-128/256  corner tile   05 border: the four-petal corner tile
  azulejo_4   (W2.4)        tile_4-128/256  second field  05 border: the mirrored leaf spray
  tile_back   (W2.5)        tile_back-256                 05 plaster (bg_tile) toned terracotta bisque
  cobalt_wall (W2.6)        wall-640                      05 plaster toned deep cobalt (the opening page and the bands)
  lime_wash   (W2.7)        lime-640                      05 plaster toned warm whitewash (the light pages)
  card_paper  (W2.8)        card-640                      18 cotton paper (bg_tile) toned glaze white (the card)
  frieze      (W2.9)        frieze-768                    the four tiles above set side by side (placed, not painted)
  pot_left / pot_right (W2.10, optional)  pot_l-480, pot_r-480 + ../parts.css   none: no pot until GPT's (no stand-in)
  web_hero    (W2.11)       og-1200x630.jpg               montage: the closed tile wall on the cobalt wall

Every page links ../parts.css after site.css: it is GENERATED here and carries the rules of the optional parts that
exist (the terracotta pots) — a page never asks for a picture the build did not make (G167).

Also written: ph_portrait / ph_land / ph_wide (neutral photo placeholders: whitewash, blurred), favicon.png (one tile)
and img/manifest.json (sources, sizes, the wall geometry, parts used / waiting for GPT).

  python3 platform/themes/azulejo-mosaic/build_images.py
"""
from __future__ import annotations

import colorsys
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/30_Azulejo_Mosaic"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"
SRC = {
    "plaster": ROOT / "collections/05_Lemon_Mediterranean/assets/gpt/parts/bg_tile.png",
    "tiles": ROOT / "collections/05_Lemon_Mediterranean/assets/gpt/parts/frame_portrait.png",
    "paper": ROOT / "collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png",
}
# single tiles of the 05 frame border (x0, y0, x1, y1), inside the gold grout: daisy (field), leaf spray (border),
# four-petal corner, mirrored leaf spray (second field)
TILE_BOXES = {1: (474, 291, 554, 359), 2: (255, 291, 337, 359), 3: (165, 291, 231, 359), 4: (362, 291, 444, 359)}
TILE_PX = (128, 256)

# palette (site.css :root)
NIGHT = (16, 37, 84)             # --night   #102554  the opening wall, the bands
LIME = (242, 237, 227)           # --lime    #F2EDE3  the light pages
CARD = (250, 248, 242)           # --glaze   #FAF8F2  the card behind the tiles
TERRA = (174, 88, 58)            # --terra   #AE583A  the unglazed back of a tile
LIME_SHADE = (226, 219, 205)     # placeholder tone

# the closed wall (site.css .wall, site.js WALL): 4 × 6 tiles, the card behind it has the same 2:3 box
WALL = {"cols": 4, "rows": 6, "aspect": round(4 / 6, 4)}

used: dict[str, str] = {}


def gpt(name: str, mode: str = "RGB"):
    p = PARTS / f"{name}.png"
    if p.exists():
        used[name] = f"gpt parts/{name}.png"
        return Image.open(p).convert(mode)
    return None


def tonla(src: Image.Image, renk, sigma: float) -> Image.Image:
    """The palette colour carrying the source's own grain: per-pixel luminance deviation × sigma levels (nothing added)."""
    g = np.asarray(src.convert("L"), float)
    d = (g - g.mean()) / (g.std() + 1e-6)
    out = np.clip(np.array(renk, float)[None, None, :] + d[..., None] * sigma, 0, 255)
    return Image.fromarray(out.astype(np.uint8), "RGB")


def terracotta_centre(im: Image.Image) -> Image.Image:
    """The 05 tiles' yellow flower centres and gold grout turned terracotta (hue shift only; the cobalt stays)."""
    a = np.asarray(im.convert("RGB")).astype(float) / 255
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in a.reshape(-1, 3)]).reshape(a.shape)
    warm = (hsv[..., 0] > 0.08) & (hsv[..., 0] < 0.2) & (hsv[..., 1] > 0.3)
    hsv[..., 0] = np.where(warm, 0.045, hsv[..., 0])
    hsv[..., 1] = np.where(warm, np.minimum(hsv[..., 1] * 0.85, 1), hsv[..., 1])
    hsv[..., 2] = np.where(warm, hsv[..., 2] * 0.78, hsv[..., 2])
    rgb = np.array([colorsys.hsv_to_rgb(*p) for p in hsv.reshape(-1, 3)]).reshape(a.shape)
    return Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8), "RGB")


def square_crop(im: Image.Image) -> Image.Image:
    s = min(im.size)
    return im.crop(((im.width - s) // 2, (im.height - s) // 2, (im.width - s) // 2 + s, (im.height - s) // 2 + s))


def tiles() -> dict[int, Image.Image]:
    border = Image.open(SRC["tiles"]).convert("RGB")
    out = {}
    for i, box in TILE_BOXES.items():
        own = gpt(f"azulejo_{i}")
        if own is not None:
            t = square_crop(own)
        else:
            t = terracotta_centre(border.crop(box).resize((TILE_PX[1], TILE_PX[1]), Image.LANCZOS))
            used[f"azulejo_{i}"] = "interim (05 frame_portrait border tile, centre toned terracotta)"
        out[i] = t.resize((TILE_PX[1], TILE_PX[1]), Image.LANCZOS)
        tb.webp(out[i], f"tile_{i}", list(TILE_PX), 82, manifest, out=OUT)
    return out


def ground(name: str, src: str, renk, sigma: float):
    own = gpt(name)
    if own is not None:
        return own
    used[name] = f"interim ({Path(SRC[src]).parts[-5]} {Path(SRC[src]).name} toned)"
    im = Image.open(SRC[src]).convert("RGB")
    return tonla(im, renk, sigma)


def wall_montage(t: dict[int, Image.Image], px: int) -> Image.Image:
    """The closed wall as the page lays it out (site.js tileKind): corners tile_3, border tile_2 turned to its side,
    field tile_1 / tile_4 in a 2 × 2 turn. Placed tiles only (no grout drawn: the tiles touch)."""
    cols, rows = WALL["cols"], WALL["rows"]
    out = Image.new("RGB", (cols * px, rows * px))
    for r in range(rows):
        for c in range(cols):
            k, turn = tile_kind(r, c)
            out.paste(t[k].resize((px, px), Image.LANCZOS).rotate(-90 * turn), (c * px, r * px))
    return out


def tile_kind(r: int, c: int) -> tuple[int, int]:
    """Same rule as site.js tileKind(): (tile number, quarter turns)."""
    cols, rows = WALL["cols"], WALL["rows"]
    edge_r, edge_c = r in (0, rows - 1), c in (0, cols - 1)
    if edge_r and edge_c:
        return 3, (0 if (r, c) == (0, 0) else 1 if r == 0 else 3 if c == 0 else 2)
    if edge_r:
        return 2, 0 if r == 0 else 2
    if edge_c:
        return 2, 3 if c == 0 else 1
    return (1 if (r + c) % 2 else 4), (r % 2) * 2 + (c % 2)


manifest: dict = {}


def main() -> int:
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    t = tiles()
    back = gpt("tile_back")
    if back is None:
        back = tonla(Image.open(SRC["plaster"]).convert("RGB").crop((0, 0, 640, 640)), TERRA, 11)
        used["tile_back"] = "interim (05 plaster toned terracotta)"
    tb.webp(square_crop(back).resize((256, 256), Image.LANCZOS), "tile_back", [256], 80, manifest, out=OUT)

    wall = ground("cobalt_wall", "plaster", NIGHT, 7)
    tb.webp(wall.resize((640, 640), Image.LANCZOS), "wall", [640], 74, manifest, out=OUT)
    lime = ground("lime_wash", "plaster", LIME, 5)
    tb.webp(lime.resize((640, 640), Image.LANCZOS), "lime", [640], 74, manifest, out=OUT)
    card = ground("card_paper", "paper", CARD, 4)
    tb.webp(card.resize((640, 640), Image.LANCZOS), "card", [640], 76, manifest, out=OUT)

    fr = gpt("frieze")
    if fr is not None:
        h = 192
        fr = fr.resize((round(fr.width * h / fr.height), h), Image.LANCZOS)
        fr = fr.crop((0, 0, 768, h)) if fr.width >= 768 else fr.resize((768, h), Image.LANCZOS)
    else:   # four tiles side by side, the border tile between the field tiles (placed, not painted)
        fr = Image.new("RGB", (768, 192))
        for i, k in enumerate((1, 2, 4, 2)):
            fr.paste(t[k].resize((192, 192), Image.LANCZOS), (i * 192, 0))
        used["frieze"] = "interim (the four tiles above, side by side)"
    tb.webp(fr, "frieze", [768], 80, manifest, out=OUT)

    slots = {}
    for key, shape, ratio in (("hero_portrait", "portrait", 4 / 5), ("story", "land", 5 / 4), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(lime, (0, 0, lime.width, lime.height), ratio, w=640, ton=LIME_SHADE, karisim=.55, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": "4/5"}, "story_1": {"aspect": "4/5"},
                               "story_2": {"aspect": "5/4"}, "story_3": {"aspect": "4/5"}, "venue": {"aspect": "16/9"}}
    manifest["stage"] = {"wall": WALL, "tile_px": TILE_PX,
                         "_note": "4 × 6 tiles over the card (same 2:3 box); corners tile_3, border tile_2, field "
                                  "tile_1 / tile_4 turned in a 2 × 2 (site.js tileKind = build_images.tile_kind)"}

    # optional parts (parts.css): the terracotta pots at the foot of the opening wall and the home card
    css = []
    for side, name in (("l", "pot_left"), ("r", "pot_right")):
        pot = gpt(name, "RGBA")
        if pot is None:
            continue
        k = tb.alfa_kutusu(np.asarray(pot)[..., 3], esik=12)
        pot = pot.crop(k) if k else pot
        tb.webp(pot, f"pot_{side}", [480], 82, manifest, out=OUT)
        f = manifest[f"pot_{side}"]["files"][0]["file"]
        css.append(f".pot-{side}{{display:block;aspect-ratio:{pot.width}/{pot.height};"
                   f"background:url(img/{f}) 50% 100%/contain no-repeat}}")
    head = ("/* Azulejo Mosaic — GENERATED by build_images.py (do not edit): rules for the design's optional GPT parts\n"
            "   (W2.10 terracotta pots, GPT_PROMPTS.md) that exist in collections/30_Azulejo_Mosaic/assets/gpt/parts/.\n"
            "   A part that is not there has no rule: its place stays empty (display:none in site.css). */\n")
    (THEME / "parts.css").write_text(head + ("\n".join(css) + "\n" if css else "/* none yet */\n"), encoding="utf-8")
    manifest["parts_css_rules"] = len(css)

    hero = PARTS / "web_hero.png"
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        used["web_hero"] = "gpt parts/web_hero.png"
    else:   # the closed tile wall on the cobalt wall (the page's own tiles, placed; no text)
        og = Image.new("RGB", (1200, 630))
        w640 = wall.resize((640, 640), Image.LANCZOS)
        for x in (0, 600):
            og.paste(w640.crop((0, 0, 640, 630)), (x, 0))
        m = wall_montage(t, 92)
        shade = Image.new("RGBA", (m.width + 60, m.height + 60), (0, 0, 0, 0))
        shade.paste((4, 10, 30, 150), (30, 38, 30 + m.width, 38 + m.height))
        shade = shade.filter(ImageFilter.GaussianBlur(14))
        x0, y0 = (1200 - m.width) // 2, (630 - m.height) // 2
        og.paste(shade, (x0 - 30, y0 - 30), shade)
        og.paste(m, (x0, y0))
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: the closed tile wall (tile_1..4) on the cobalt wall",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    tile_icon = Image.new("RGBA", (256, 256))
    tile_icon.paste(ImageEnhance.Contrast(t[1]).enhance(1.05))
    icon, icon_info = tb.ikon(tile_icon, pay=0.02)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    waiting = sorted(k for k, v in used.items() if v.startswith("interim"))
    optional = [k for k in ("pot_left", "pot_right", "web_hero") if k not in used]
    manifest["sources"] = used
    manifest["parts"] = {"used": sorted(k for k, v in used.items() if v.startswith("gpt")),
                         "waiting_for_gpt": waiting + optional}
    manifest["_note"] = ("G169 build from the design's own PAKET 5 parts. Nothing drawn." if not manifest["parts"]["waiting_for_gpt"]
                         else "G169 interim build: tiles cut from 05's painted tile border, grounds toned from 05 / 18 "
                              "plain GPT textures; the design's own PAKET 5 parts are taken as they arrive "
                              "(GPT_PROMPTS.md, manifest parts). Nothing drawn.")
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 140}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(used, indent=1))
    print(f"azulejo-mosaic: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
