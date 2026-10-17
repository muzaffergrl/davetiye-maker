#!/usr/bin/env python3
"""Grand Theatre Premiere (24) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). INTERIM build (G162).

The design's own GPT parts (PAKET 5 website layers, PAKET 2 photos, PAKET 6 print grounds) are ordered in
collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md and do not exist yet. Until they arrive, the theme runs
on two GPT textures that already live in the repository, only cropped, scaled, blurred and toned (K21: nothing is
drawn, no shape is painted by code):

  VELVET  collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png              navy velvet-like texture (seamless)
          → toned to peacock teal (a duotone of its own luminance): the curtain panels, the stage, the page grounds,
            the photo placeholders
  PAPER   collections/21_Crimson_Rose_Atelier/assets/gpt/textures/paper-background.png   ivory cotton paper
          → toned to playbill ivory: the programme card on the stage, the programme sheets, the ticket stub

All stage layers share ONE canvas (1024×1536, like the ordered GPT layers) and the same stage box, so CSS stacks them
with inset:0 and the transforms use the box percentages written to img/manifest.json → "stage":
  th_back      the stage behind the curtains (velvet, deep)
  curtain_l/r  the two closed curtain panels (two different crops of the velvet, so they are not mirror copies)
  curtain_gl/gr the gathered panels the closed ones hand over to at the end of the parting (interim: the closed panel
               scaled to the gathered width — the GPT pair brings real swags, tiebacks and tassels)
  th_arch      the valance over the opening (interim: a deeper velvet band; GPT: the gilded proscenium arch, its
               stage opening a #00FF00 window → transparent)
  card_paper   the programme card standing on the stage (interim: plain paper; GPT: card_small.png with its window)
When the PAKET 5 files arrive this script switches to them (same output names; see GPT_PROMPTS.md "Claude's cut").

  python3 platform/themes/grand-theatre-premiere/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/24_Grand_Theatre_Premiere"
VELVET_SRC = ROOT / "collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png"
PAPER_SRC = ROOT / "collections/21_Crimson_Rose_Atelier/assets/gpt/textures/paper-background.png"
OUT = THEME / "img"

CANVAS = (1024, 1536)
# the stage opening on the canvas (interim; the GPT proscenium window replaces it): x0, y0, x1, y1
OPENING = (72, 96, 952, 1440)
PEACOCK_LO, PEACOCK_HI = np.array([3, 22, 25.]), np.array([47, 124, 121.])    # shadow / highlight of the velvet
IVORY = np.array([243, 235, 216.])                                              # --ivory


def tone_velvet(im: Image.Image, gamma: float = .9, lo=PEACOCK_LO, hi=PEACOCK_HI) -> Image.Image:
    """Duotone of the texture's own luminance: shadows → deep peacock, highlights → peacock teal."""
    lum = np.asarray(im.convert("L")).astype(float)
    a, b = np.percentile(lum, 1), np.percentile(lum, 99)
    t = np.clip((lum - a) / max(b - a, 1), 0, 1) ** gamma
    rgb = lo + (hi - lo) * t[..., None]
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def tone_paper(im: Image.Image) -> Image.Image:
    """Shift the paper's mean onto playbill ivory, keep its own grain."""
    p = np.asarray(im.convert("RGB")).astype(float)
    p += IVORY - p.reshape(-1, 3).mean(0)
    return Image.fromarray(np.clip(p, 0, 255).astype(np.uint8), "RGB")


def layer(fill: Image.Image, box) -> Image.Image:
    """A full-canvas transparent layer with `fill` resized into `box` (x0, y0, x1, y1)."""
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    x0, y0, x1, y1 = box
    canvas.paste(fill.convert("RGBA").resize((x1 - x0, y1 - y0), Image.LANCZOS), (x0, y0))
    return canvas


def main() -> int:
    manifest: dict = {"_note": "G162 INTERIM build: stage layers toned/cropped from two GPT textures already in the "
                      "repository (06 velvet tile, 21 paper). The design's PAKET 5 / 2 / 6 parts are ordered in "
                      "collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md."}
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    velvet_src = Image.open(VELVET_SRC).convert("RGB")
    vw, vh = velvet_src.size
    velvet = tone_velvet(velvet_src)
    paper = tone_paper(Image.open(PAPER_SRC))

    x0, y0, x1, y1 = OPENING
    W, H = x1 - x0, y1 - y0
    cx = (x0 + x1) // 2
    seam = round(W * .015)                                            # the panels overlap at the centre seam
    # two different crops of the velvet for the two panels (tall strips, scaled to the panel)
    left_fill = velvet.crop((0, 0, vw // 2, vh))
    right_fill = velvet.crop((vw // 2, 0, vw, vh)).transpose(Image.FLIP_TOP_BOTTOM)
    deep = ImageEnhance.Brightness(velvet.filter(ImageFilter.GaussianBlur(6))).enhance(.42)
    valance = ImageEnhance.Brightness(velvet.crop((0, 0, vw, vh // 4))).enhance(.72)

    box = (x0, y0, x1, y1)                                            # interim stage box = the opening
    crop = lambda im: im.crop(box)                                    # noqa: E731 — every layer to the stage box
    widths = [440, 880]
    tb.webp(crop(layer(deep, OPENING)), "th_back", widths, 72, manifest, out=OUT)
    cl = layer(left_fill, (x0, y0, cx + seam, y1))
    cr = layer(right_fill, (cx - seam, y0, x1, y1))
    tb.webp(crop(cl), "curtain_l", widths, 74, manifest, out=OUT)
    tb.webp(crop(cr), "curtain_r", widths, 74, manifest, out=OUT)
    gather = .34                                                      # gathered width / closed panel width
    gw = round((cx + seam - x0) * gather)
    tb.webp(crop(layer(left_fill, (x0, y0, x0 + gw, y1))), "curtain_gl", widths, 74, manifest, out=OUT)
    tb.webp(crop(layer(right_fill, (x1 - gw, y0, x1, y1))), "curtain_gr", widths, 74, manifest, out=OUT)
    vh_px = round(H * .085)
    tb.webp(crop(layer(valance, (x0, y0, x1, y0 + vh_px))), "th_arch", widths, 74, manifest, out=OUT)

    # the programme card standing on the stage: 2:3, half the opening wide, its foot at 90% of the opening
    card_w = round(W * .5)
    card_h = round(card_w * 1.5)
    card_x, card_y = cx - card_w // 2, y0 + round(H * .9) - card_h
    card = tb.kapla(paper, 2 / 3, .5)
    tb.webp(card, "card_paper", [320, 640], 78, manifest, out=OUT)

    pct = lambda v, tot: round(100 * v / tot, 3)                      # noqa: E731
    manifest["stage"] = {
        "canvas": list(CANVAS), "box": [x0, y0, W, H], "objAspect": round(W / H, 4), "method": "interim",
        "opening_pct": [0, 0, 100, 100],
        "curtain_l": {"box_pct": [0, 0, pct(cx + seam - x0, W), 100], "origin": "0% 50%"},
        "curtain_r": {"box_pct": [pct(cx - seam - x0, W), 0, pct(x1 - cx + seam, W), 100], "origin": "100% 50%"},
        "gather": gather,
        "valance_pct": pct(vh_px, H),
        "card": {"box_pct": [pct(card_x - x0, W), pct(card_y - y0, H), pct(card_w, W), pct(card_h, H)]},
    }

    # ---------------------------------------------------------------- grounds, paper, ticket, placeholders
    # repeat tile: the texture mirrored 2×2, so its edges meet (seamless whatever the source tile does at its border)
    half = velvet.resize((640, 640), Image.LANCZOS)
    tile = Image.new("RGB", (1280, 1280))
    for (dx, dy), im in zip(((0, 0), (640, 0), (0, 640), (640, 640)),
                            (half, half.transpose(Image.FLIP_LEFT_RIGHT), half.transpose(Image.FLIP_TOP_BOTTOM),
                             half.transpose(Image.ROTATE_180))):
        tile.paste(im, (dx, dy))
    tb.webp(tile, "velvet", [640], 74, manifest, out=OUT)
    room = ImageEnhance.Brightness(tb.bulanik_fon(velvet.resize((1024, 1024)).crop((0, 0, 1024, 1024)),
                                                 (683, 1024), 3)).enhance(.62)
    tb.webp(room, "room", [640], 72, manifest, out=OUT)                                  # dark house ground
    tb.webp(paper, "paper", [640, 1024], 74, manifest, out=OUT)                          # programme sheets
    stub = tb.kapla(paper.crop((0, 0, 1024, 1024)), 3 / 1, .4)
    tb.webp(stub, "stub_paper", [480, 960], 76, manifest, out=OUT)                       # the ticket stub
    slots = {}
    for key, shape, ratio in (("hero_portrait", "portrait", 4 / 5), ("venue", "land", 3 / 2)):
        ph = tb.yer_tutucu(velvet, (0, 0, vw, vh), ratio, w=640, ton=(16, 58, 60), karisim=.35, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"portrait": {"aspect": "4/5"}, "land": {"aspect": "3/2"}}

    # ---------------------------------------------------------------- share image + icon (assembled, nothing drawn)
    share = Image.new("RGB", (1200, 630))
    share.paste(ImageEnhance.Brightness(velvet.resize((1200, 1200))).enhance(.55).crop((0, 285, 1200, 915)), (0, 0))
    sw, sh = 300, 630
    share.paste(left_fill.resize((sw, sh)), (0, 0))
    share.paste(right_fill.resize((sw, sh)), (1200 - sw, 0))
    share.paste(paper.resize((sw, round(sw * 1.5))).crop((0, 0, sw, 450)), (600 - sw // 2, 90))
    manifest["og"] = {"file": "og-1200x630.jpg", "source": "assembled (interim): velvet + paper",
                      "bytes": tb.og_kaydet(share, OUT / "og-1200x630.jpg")}
    icon_src = Image.new("RGBA", (360, 360), (0, 0, 0, 0))
    icon_src.paste(left_fill.resize((180, 360)), (0, 0))
    icon_src.paste(right_fill.resize((180, 360)), (180, 0))
    icon, icon_info = tb.ikon(icon_src)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # ---------------------------------------------------------------- checks + manifest
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(manifest["stage"], indent=1))
    print(f"grand-theatre-premiere: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
