#!/usr/bin/env python3
"""Espresso Pastoral (42) — GPT sources → img/ (docs/11 §5.4, docs/34; tools/tema_build.py). Task G442.

Every picture is the design's own PAKET 5 part (collections/42_Espresso_Pastoral/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  espresso_paper (W1)   espresso-640/1024     espresso laid paper: the page ground
  cream_parchment (W2)  parchment-640         cream parchment: cards, bands, the reply form
  sky, hills, meadow,   sky-720, hills-1100,  the four layers of the oil-painted twilight landscape the opening dives
  grasses (W3–W6)       meadow-1200, grasses-1100   into (parallax); home's top band
  env_back (W7)         back-720              the open espresso envelope's back (the envelope box)
  env_front (W8)        front-720             the pocket (the card rises from behind it)
  flap (W9)             flap-720              the V flap with deckled edges (its own GPT part; it swings up on its top edge)
  flap_in (W10)         flap_in-720           the flap's inside: a small oil painting of the landscape, shown once open
  lace_band (W11)       lace-720              the cream cotton lace band round the envelope (it slides down and off)
  posy (W12)            posy-480              the dried-flower posy tucked into the band (it tips forward and falls)
  card_small (W13)      card-720              the cream card that rises from the meadow
  cabinet_frame (W14)   cabinet-720           the antique cabinet card mount round a portrait (hero, story); window measured
  cabinet_wide (W15)    cabinet_wide-1100     the wide mount (venue); window measured
  candle (W16)          candle-360            a brass candlestick with a small flame (the day, details)
  dried_roses (W17)     roses-720             dried roses, wheat and gypsophila (card corners, signature)
  accent_1..3 (W18)     accent_N-160          a rose petal, a wheat ear, a gypsophila sprig (the opening's petals, rows, reply)
  web_hero (W19)        og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W7, W8, W9, W11, W12) share one canvas; each is cut to its own alpha box and laid in the envelope
box (the back's alpha box) by its measured edges — manifest `stage`, the numbers site.css uses
(tests/theme-espresso-pastoral.test.ts compares them). GPT drew the posy over the whole canvas instead of its own small
one: it is cut to its box and laid centred on the band (stage.posy, 34 % of the envelope's width). Photo windows: GPT
left only a green rim round an already transparent inside; the whole measured rectangle is cleared and the green spill
round it removed.

  python3 platform/themes/espresso-pastoral/build_images.py
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

COL = ROOT / "collections/42_Espresso_Pastoral"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (230, 216, 191)        # placeholder tone (parchment)
REQUIRED = ["espresso_paper", "cream_parchment", "sky", "hills", "meadow", "grasses", "env_back", "env_front", "flap",
            "flap_in", "lace_band", "posy", "card_small", "cabinet_frame", "cabinet_wide", "candle", "dried_roses",
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
    """The photo window of a framed part (same as the pilot 39): the box of its #00FF00 pixels — GPT's green is
    ≈ (3, 252, 45) and often only a rim round an already transparent inside — cleared whole (+2 px), the green spill in a
    12 px ring round it neutralised. (RGBA, window (L, T, W, H) % of the image) or (im, None)."""
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
    """The box `inner` (x0, y0, x1, y1 px) in % of the box `outer`: [left, top, width, height]."""
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — a sanity check that every layer composes."""
    w = round(h * stage["aspect"])
    pad = round(h * .2)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    for key in ("back", "front", "flap", "lace", "posy"):
        L, T, W, H = stage[key]
        im = layers[key].resize((max(1, round(w * W / 100)), max(1, round(h * H / 100))), Image.LANCZOS)
        canvas.alpha_composite(im, (pad + round(w * L / 100), pad + round(h * T / 100)))
    return canvas


def main() -> int:
    missing = [k for k in REQUIRED if not (PARTS / f"{k}.png").exists()]
    if missing:
        print("ERROR: parts missing: " + ", ".join(missing), file=sys.stderr)
        return 1
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    tb.webp(Image.open(PARTS / "espresso_paper.png").convert("RGB"), "espresso", [640], 74, manifest, out=OUT)
    parchment = Image.open(PARTS / "cream_parchment.png").convert("RGB")
    tb.webp(parchment, "parchment", [640], 74, manifest, out=OUT)
    # the landscape: the sky is opaque; the hills, the meadow and the grasses are cut to their alpha box (full width)
    tb.webp(Image.open(PARTS / "sky.png").convert("RGB"), "sky", [720], 72, manifest, out=OUT)
    for src, width in (("hills", 1100), ("meadow", 1200), ("grasses", 1100)):
        im = part(src)
        b = box(im)
        tb.webp(im.crop((0, b[1], im.width, b[3])), src, [width], 78, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket, flap and band span its width; the posy (drawn over
    # the whole canvas) is laid centred on the band
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"), ("lace", "lace_band"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    front = place(boxes["front"], bx)
    flap = place(boxes["flap"], bx)
    lace = place(boxes["lace"], bx)
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
        "lace": [0, lace[1], 100, lace[3]],
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    posy = trim(part("posy"))
    layers["posy"] = posy
    pw = 34.0                                                      # % of the envelope width
    ph = r2(pw * bw / bh * posy.height / posy.width)
    band_mid = lace[1] + lace[3] / 2
    stage["posy"] = [r2(50 - pw / 2), r2(band_mid - ph / 2), pw, ph]
    card = trim(part("card_small"))
    ratio = card.width / card.height
    cw = 84.0                                                      # % of the envelope width
    ch = r2(cw * stage["aspect"] / ratio)
    stage["card"] = [r2(50 - cw / 2), r2(100 - ch - 3), cw, ch]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket, "
                      "flap and lace band span its width, the posy centred on the band, the card in the pocket")
    for k, name in (("back", "back"), ("front", "front"), ("flap", "flap"), ("lace", "lace")):
        tb.webp(layers[k], name, [720], 82, manifest, out=OUT)
    tb.webp(posy, "posy", [480], 84, manifest, out=OUT)
    tb.webp(trim(part("flap_in")), "flap_in", [720], 80, manifest, out=OUT)
    tb.webp(card, "card", [720], 78, manifest, out=OUT)
    manifest["stage"] = stage

    for src, name, width in (("cabinet_frame", "cabinet", 720), ("cabinet_wide", "cabinet_wide", 1100)):
        im = part(src)
        keyed, win = keyed_window(im.crop(box(im)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 82, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("candle", "candle", 360, 84), ("dried_roses", "roses", 720, 80),
                                ("accent_1", "accent_1", 160, 86), ("accent_2", "accent_2", 160, 86), ("accent_3", "accent_3", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("portrait", "cabinet"), ("wide", "cabinet_wide")):
        w, h = manifest[name]["window_px"]
        ph_ = tb.yer_tutucu(parchment, (0, 0, parchment.width, parchment.height), w / h, w=640, ton=PH_TONE, karisim=.45, bulanik=10)
        tb.webp(ph_, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("cabinet")}, "story_1": {"aspect": aspect("cabinet")},
                               "story_2": {"aspect": aspect("cabinet")}, "story_3": {"aspect": aspect("cabinet")},
                               "venue": {"aspect": aspect("cabinet_wide")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(posy)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the dried-flower posy"}
    envelope_still(layers, stage, 400)  # sanity: every layer composes

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G442 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT, "cabinet*.webp")}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in stage if not k.startswith("_")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("cabinet", "cabinet_wide")})
    print({n: (manifest[n]["files"][-1]["file"], manifest[n]["src_size"]) for n in manifest if isinstance(manifest[n], dict) and "files" in manifest[n]})
    print(f"espresso-pastoral: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
