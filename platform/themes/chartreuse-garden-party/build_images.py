#!/usr/bin/env python3
"""Chartreuse Garden Party (43) — GPT sources → img/ (docs/11 §5.4, docs/34; tools/tema_build.py). Task G443.

Every picture is the design's own PAKET 5 part (collections/43_Chartreuse_Garden_Party/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  cream_paper (W1)       paper-640/1024        cream cotton paper: the page ground, cards, the reply form
  chartreuse_paper (W2)  chartreuse-640        chartreuse stock: the day band
  env_back (W3)          back-900              the open landscape envelope's back with its pink-and-burgundy gouache lining
  env_front (W4)         front-900             the chartreuse front pocket (the card rises from behind it)
  flap (W5)              flap-900              the scalloped flap, outside (closed; it swings up on its top edge)
  flap_in (W6)           flap_in-900           the flap's inside (the floral lining), shown once it is open
  stem (W7)              stem-640              the pink ranunculus whose stem holds the flap shut (it slides out)
  bloom_1..4 (W8)        bloom_N-480           gouache flower clusters that burst out from behind the envelope
  card_small (W9)        card-720              the cream card that rises from the envelope (it lies sideways inside)
  instant_frame (W10)    instant-640           the instant-film style print (hero, story); window measured
  instant_wide (W11)     instant_wide-1100     the wide print (venue); window measured
  florist_pick (W12)     pick-160              the gold wire florist pick each print rises on
  bouquet (W13)          bouquet-900           the low arrangement in a footed bowl the prints rise out of
  divider (W14)          divider-1200          a garland of small gouache flowers (section dividers)
  accent_1..3 (W15)      accent_N-160          peony petal, lady's mantle sprig, burgundy cosmos (rows, the reply's confetti)
  web_hero (W16)         og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5) share one canvas; each is cut to its own alpha box and laid in the envelope box (the
back's) by its measured edges — manifest `stage`, the numbers site.css uses. Photo windows: the whole measured rectangle
is cleared (the instant frame's window carried a grey ghost blot inside) and the green spill round it removed.

  python3 platform/themes/chartreuse-garden-party/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/43_Chartreuse_Garden_Party"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (244, 238, 222)
REQUIRED = ["cream_paper", "chartreuse_paper", "env_back", "env_front", "flap", "flap_in", "stem", "bloom_1", "bloom_2",
            "bloom_3", "bloom_4", "card_small", "instant_frame", "instant_wide", "florist_pick", "bouquet", "divider",
            "accent_1", "accent_2", "accent_3", "web_hero"]


def part(ad: str) -> Image.Image:
    return Image.open(PARTS / f"{ad}.png").convert("RGBA")


def box(im: Image.Image, esik: int = 8):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def trim(im: Image.Image, esik: int = 8) -> Image.Image:
    k = box(im, esik)
    return im.crop(k) if k else im


def r2(v: float) -> float:
    return round(float(v), 2)


def keyed_window(im: Image.Image):
    """The photo window (as the pilot 39): the box of the #00FF00 pixels, cleared whole (+2 px) — here that also removes
    the grey ghost blot GPT left inside the instant frame's window — and the green spill in a 12 px ring neutralised."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 140) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 70) & (c[..., 3] > 60)
    ys, xs = np.nonzero(green)
    if len(ys) < 256:
        return im, None
    h, w = c.shape[:2]
    x0, x1 = int(np.percentile(xs, .5)), int(np.percentile(xs, 99.5)) + 1
    y0, y1 = int(np.percentile(ys, .5)), int(np.percentile(ys, 99.5)) + 1
    c[max(0, y0 - 2):y1 + 2, max(0, x0 - 2):x1 + 2, 3] = 0
    ring = np.zeros((h, w), bool)
    ring[max(0, y0 - 12):y1 + 12, max(0, x0 - 12):x1 + 12] = True
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h)


def place(inner, outer):
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def main() -> int:
    missing = [k for k in REQUIRED if not (PARTS / f"{k}.png").exists()]
    if missing:
        print("ERROR: parts missing: " + ", ".join(missing), file=sys.stderr)
        return 1
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    paper = Image.open(PARTS / "cream_paper.png").convert("RGB")
    s = min(paper.size)   # GPT gave 3:2: a square crop tiles the same
    paper = paper.crop(((paper.width - s) // 2, (paper.height - s) // 2, (paper.width + s) // 2, (paper.height + s) // 2))
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)
    tb.webp(Image.open(PARTS / "chartreuse_paper.png").convert("RGB"), "chartreuse", [640], 76, manifest, out=OUT)

    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    front = place(boxes["front"], bx)
    flap = place(boxes["flap"], bx)
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    for k in ("back", "front", "flap"):
        tb.webp(layers[k], k, [900], 82, manifest, out=OUT)
    tb.webp(trim(part("flap_in")), "flap_in", [900], 82, manifest, out=OUT)
    stem = trim(part("stem"))
    tb.webp(stem, "stem", [640], 86, manifest, out=OUT)
    sw = 56.0                                                     # % of the envelope width; across the slits at 44–56 %
    sh = r2(sw * bw / bh * stem.height / stem.width)
    stage["stem"] = [22.0, r2(40 - sh / 2), sw, sh]   # the slits GPT cut sit at 40 % of the envelope height
    card = trim(part("card_small"))
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    cr = card.width / card.height
    # the card lies sideways in the landscape pocket: its width (upright) = 78 % of the envelope's height
    cw_h = 78.0
    stage["card"] = {"ratio": round(cr, 4), "width_pct": r2(cw_h / (bw / bh)), "height_pct": r2(cw_h / cr)}
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket and "
                      "flap span its width; the stem lies across the slits; the card (upright size in % of the envelope's "
                      "width / height) lies turned a quarter in the pocket and turns upright as it rises")
    manifest["stage"] = stage
    for n in (1, 2, 3, 4):
        tb.webp(trim(part(f"bloom_{n}")), f"bloom_{n}", [480], 82, manifest, out=OUT)

    for src, name, width in (("instant_frame", "instant", 640), ("instant_wide", "instant_wide", 1100)):
        keyed, win = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("florist_pick", "pick", 160, 86), ("bouquet", "bouquet", 900, 82),
                                ("divider", "divider", 1200, 84), ("accent_1", "accent_1", 160, 86),
                                ("accent_2", "accent_2", 160, 86), ("accent_3", "accent_3", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("square", "instant"), ("wide", "instant_wide")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), w / h, w=640, ton=PH_TONE, karisim=.45, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("instant")}, "story_1": {"aspect": aspect("instant")},
                               "story_2": {"aspect": aspect("instant")}, "story_3": {"aspect": aspect("instant")},
                               "venue": {"aspect": aspect("instant_wide")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(trim(part("bloom_4")))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the raspberry ranunculus cluster"}

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G443 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    # the residue check runs on the keyed frames: the gouache foliage elsewhere is green by design (leaf #4F7A3A)
    manifest["checks"] = {"green": {**tb.yesil_denetle(OUT, "instant-*.webp"), **tb.yesil_denetle(OUT, "instant_wide-*.webp")},
                          "_note": "keyed frames only; the leaves of the flowers, the bouquet and the lining are meant green"}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(stage))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("instant", "instant_wide")})
    print({n: manifest[n]["src_size"] for n in ("pick", "bouquet", "divider", "bloom_1", "bloom_2", "bloom_3", "bloom_4", "card")})
    print(f"chartreuse-garden-party: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
