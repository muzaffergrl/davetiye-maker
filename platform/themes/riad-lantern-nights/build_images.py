#!/usr/bin/env python3
"""Riad Lantern Nights (27) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G165).

The design's own GPT parts (PAKET 5 / PAKET 2, ordered in collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md)
do not exist yet. Until they arrive this build cuts interim layers from GPT pixels already in the repo (nothing drawn,
K21 — cut, rotated, toned, blurred and placed only; the theme stays "coming" and is never sold on these):

  wood     collections/10_Tuscan_Vineyard/assets/gpt/parts/oak_tile.png        (1254², oak planks)
  plaster  collections/05_Lemon_Mediterranean/assets/gpt/parts/bg_tile.png     (1254², seamless lime plaster)
  tiles    collections/05_Lemon_Mediterranean/assets/gpt/parts/frame_portrait.png (its painted tile border)

  door_l / door_r  two leaves cut side by side from the oak, turned upright, toned to deep cedar (the doors swing in)
  court            the plaster toned warm saffron: the lantern-lit courtyard seen through the open doors
  card_paper       the plaster toned ivory: the invitation card that comes out through the doorway
  bg_wall          the plaster toned night teal (seamless, repeats): the courtyard wall of every page
  tile_1..3        three single tiles cut from the border, blue turned teal: the zellige row that lays itself
  ph_*             photo placeholders (blurred, lifted crops of the teal wall)
  og / favicon     the closed doors on the wall, a sliver of court light between them (placed, not painted)

When the real parts are in collections/27_Riad_Lantern_Nights/assets/gpt/parts/ (doors_closed, courtyard, card_small,
bg_tile, tile_1..4, frame_arch, web_hero …) this build is rewritten to cut them instead (GPT_PROMPTS.md "After the
parts arrive").

  python3 platform/themes/riad-lantern-nights/build_images.py
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

COL = ROOT / "collections/27_Riad_Lantern_Nights"
SRC = {
    "wood": ROOT / "collections/10_Tuscan_Vineyard/assets/gpt/parts/oak_tile.png",
    "plaster": ROOT / "collections/05_Lemon_Mediterranean/assets/gpt/parts/bg_tile.png",
    "tiles": ROOT / "collections/05_Lemon_Mediterranean/assets/gpt/parts/frame_portrait.png",
}
OUT = THEME / "img"
LEAF = 0.38                      # one door leaf, width / height (a tall riad door; the pair is 0.76)
# three single tiles of the 05 frame border (x0, y0, x1, y1), inside the gold grout: flower, leaf spray, daisy
TILE_BOXES = [(163, 289, 233, 361), (253, 289, 339, 361), (472, 289, 556, 361)]


def tone(im: Image.Image, dark, light, gamma: float = 1.0) -> Image.Image:
    """Duotone of the image's own luminance: shadows → `dark`, highlights → `light` (the grain stays, nothing added)."""
    g = np.asarray(im.convert("L")).astype(float) / 255
    g = (g - g.min()) / max(g.max() - g.min(), 1e-6)
    g = g ** gamma
    d, l = np.array(dark, float), np.array(light, float)
    rgb = d + (l - d) * g[..., None]
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def teal_tile(im: Image.Image) -> Image.Image:
    """The painted blue of a tile turned teal, its white warmed to ivory; the gold dots stay (hue shift, no drawing)."""
    a = np.asarray(im.convert("RGB")).astype(float) / 255
    out = np.empty_like(a)
    for y in range(a.shape[0]):
        for x in range(a.shape[1]):
            h, s, v = colorsys.rgb_to_hsv(*a[y, x])
            if 0.55 < h < 0.75 and s > 0.25:          # cobalt → deep teal
                h, s, v = 0.49, min(1, s * 0.85), v * 0.82
            elif s < 0.2:                              # white glaze → warm ivory
                r, g, b = a[y, x]
                out[y, x] = (r * 0.97, g * 0.92, b * 0.80)
                continue
            out[y, x] = colorsys.hsv_to_rgb(h, s, v)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), "RGB")


def main() -> int:
    manifest: dict = {"_note": "G165 interim build: layers cut and toned from GPT pixels of 10 (oak) and 05 (plaster, tile "
                      "border) — see build_images.py; the design's own PAKET 5 parts are ordered in GPT_PROMPTS.md."}
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    wood = Image.open(SRC["wood"]).convert("RGB").transpose(Image.ROTATE_90)     # planks upright
    plaster = Image.open(SRC["plaster"]).convert("RGB")
    W, H = wood.size

    # ---------------------------------------------------------------- doors (two leaves, side by side in the wood)
    lw = round(H * LEAF)
    gap = (W - 2 * lw) // 3
    leaves = {}
    for name, x0 in (("door_l", gap), ("door_r", 2 * gap + lw)):
        leaf = wood.crop((x0, 0, x0 + lw, H))
        leaf = tone(leaf, (34, 15, 9), (150, 84, 46), gamma=1.1)                 # deep cedar
        leaf = ImageEnhance.Contrast(leaf).enhance(1.12)
        leaves[name] = leaf
        tb.webp(leaf, name, [240, 480], 78, manifest, out=OUT)

    # ---------------------------------------------------------------- court, card, wall
    court = tone(plaster, (96, 50, 18), (246, 196, 112), gamma=0.9)              # warm saffron light
    tb.webp(tb.kapla(court, 2 * LEAF), "court", [440, 880], 74, manifest, out=OUT)
    tb.webp(tb.kapla(court, 16 / 9), "court_band", [640, 1024], 72, manifest, out=OUT)
    card = tone(plaster, (196, 170, 128), (252, 244, 226), gamma=0.8)            # ivory card
    tb.webp(tb.kapla(card, 0.7), "card_paper", [480, 960], 78, manifest, out=OUT)
    wall = tone(plaster, (9, 33, 35), (34, 82, 82), gamma=1.0)                   # night teal, seamless
    tb.webp(wall.resize((640, 640), Image.LANCZOS), "bg_wall", [640], 72, manifest, out=OUT)

    # ---------------------------------------------------------------- zellige row: three tiles from the 05 border
    border = Image.open(SRC["tiles"]).convert("RGB")
    for i, box in enumerate(TILE_BOXES, 1):
        t = teal_tile(tb.kapla(border.crop(box), 1.0).resize((76, 76), Image.LANCZOS))   # the source's own size
        tb.webp(t, f"tile_{i}", [76], 82, manifest, out=OUT)

    # ---------------------------------------------------------------- placeholders
    slots = {}
    for key, shape, ratio in (("hero_portrait", "portrait", 4 / 5), ("story", "window", 2 / 3), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(wall, (0, 0, wall.width, wall.height), ratio, w=640 if shape != "window" else 480,
                           ton=(40, 92, 90), karisim=.3, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640 if shape != "window" else 480], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-{640 if shape != 'window' else 480}.webp"
    manifest["placeholders"] = slots

    # ---------------------------------------------------------------- og + favicon: the closed doors on the wall
    og = Image.new("RGB", tb.OG_OLCU)
    tile = wall.resize((630, 630), Image.LANCZOS)
    for x in range(0, og.width, 630):
        og.paste(tile, (x, 0))
    dh = 560
    dw = round(dh * LEAF)
    sliver = court.resize((40, dh), Image.LANCZOS)
    cx, top = og.width // 2, (og.height - dh) // 2 + 6
    og.paste(sliver, (cx - 20, top))
    for name, x in (("door_l", cx - dw - 3), ("door_r", cx + 3)):
        og.paste(leaves[name].resize((dw, dh), Image.LANCZOS), (x, top))
    manifest["og"] = {"composed": "bg_wall + court sliver + door_l/door_r, centred", "file": "og-1200x630.jpg",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    pair = Image.new("RGBA", (2 * lw + 24, H), (0, 0, 0, 0))
    pair.paste(court.resize((24, H)).convert("RGBA"), (lw, 0))
    pair.paste(leaves["door_l"].convert("RGBA"), (0, 0))
    pair.paste(leaves["door_r"].convert("RGBA"), (lw + 24, 0))
    icon, icon_info = tb.ikon(pair, pay=0.1)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # ---------------------------------------------------------------- stage geometry + checks + manifest
    manifest["stage"] = {"leaf_aspect": LEAF, "pair_aspect": round(2 * LEAF, 4), "hinges": "outer edges",
                         "swing": "inwards, away from the guest (rotateY ±78deg)", "method": "interim"}
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 30},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(f"riad-lantern-nights: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["checks"]["green"]:
        print("ERROR: visible #00FF00", manifest["checks"]["green"], file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
