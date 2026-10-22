#!/usr/bin/env python3
"""Suede Ranch Lace (45) — GPT sources → img/ (docs/11 §5.4, docs/34; tools/tema_build.py). Task G445.

Every picture is the design's own PAKET 5 part (collections/45_Suede_Ranch_Lace/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  suede (W1)              suede-640             tan suede: the page ground, the opening
  cream_paper (W2)        paper-640             cream paper: cards, bands, the reply form
  ranch_landscape (W3)    ranch-720             the golden-hour ranch landscape: the day band
  env_back (W4)           back-720              the open suede envelope's back with its ticking lining (the envelope box)
  env_front (W5)          front-720             the suede pocket, whipstitched at the sides (the card rises from behind it)
  flap (W6)               flap-720              the straight flap with its lace strip and suede fringe (it swings up)
  flap_in (W7)            flap_in-720           the flap's inside, shown once it is open
  cord (W8)               cord-720              the leather cord twice round the envelope, knotted in the middle
  concho (W9)             concho-240            the silver concho on the knot (it turns half round as the cord comes undone)
  card_small (W10)        card-720              the cream card that rises from the envelope
  leather_frame (W11)     frame-720             the tooled leather frame round a portrait (hero, story); window measured
  leather_wide (W12)      frame_wide-1100       the wide frame (venue); window measured
  gate (W13)              gate-480              the weathered ranch gate in front of each photo (it swings open on its hinge)
  lace_divider (W14)      lace-1200             a lace strip with a small concho (dividers)
  hat (W15)               hat-480               a cream felt hat with a band of dried flowers (signature)
  wildflowers (W16)       wildflowers-720       Indian paintbrush, bluebonnets, wild roses and sage (card corners, signature)
  accent_1..3 (W17)       accent_N-160          a sage sprig, a bluebonnet, a wild rose (rows, the reply)
  web_hero (W18)          og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W4, W5, W6, W8) should share one canvas, but GPT gave the pocket and the cord a 1036×1518 canvas and
the back and the flap a 1079×1457 one (docs/34 §4): each is cut to its own alpha box and laid in the envelope box (the
back's alpha box) by its measured edges in % of its own canvas — manifest `stage`, the numbers site.css uses
(tests/theme-suede-ranch-lace.test.ts compares them). The concho (its own canvas) sits on the cord's knot. Photo windows:
GPT left only a green rim round an already transparent inside; the whole measured rectangle is cleared and the green
spill round it removed.

  python3 platform/themes/suede-ranch-lace/build_images.py
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

COL = ROOT / "collections/45_Suede_Ranch_Lace"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (236, 226, 208)        # placeholder tone (cream paper)
REQUIRED = ["suede", "cream_paper", "ranch_landscape", "env_back", "env_front", "flap", "flap_in", "cord", "concho",
            "card_small", "leather_frame", "leather_wide", "gate", "lace_divider", "hat", "wildflowers", "accent_1",
            "accent_2", "accent_3", "web_hero"]


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
    """The box `inner` (x0, y0, x1, y1, any unit) in % of the box `outer`: [left, top, width, height]."""
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def pbox(im: Image.Image):
    """The alpha box in % of its own canvas (the envelope layers come on two different canvases)."""
    x0, y0, x1, y1 = box(im)
    return (100 * x0 / im.width, 100 * y0 / im.height, 100 * x1 / im.width, 100 * y1 / im.height)


def knot_x(cord: Image.Image) -> float:
    """The knot of the cord: the column (in % of the cord's own box) where the cord is tallest — the knot and its
    hanging tails — the concho is centred on it."""
    a = np.asarray(cord)[..., 3] > 60
    cols = a.sum(0)
    w = len(cols)
    mid = cols[int(w * .3):int(w * .7)]
    return 100 * (int(w * .3) + int(np.argmax(mid))) / w


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — a sanity check that every layer composes."""
    w = round(h * stage["aspect"])
    pad = round(h * .2)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    for key in ("back", "front", "flap", "cord", "concho"):
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

    tb.webp(Image.open(PARTS / "suede.png").convert("RGB"), "suede", [640], 74, manifest, out=OUT)
    paper = Image.open(PARTS / "cream_paper.png").convert("RGB")
    tb.webp(paper, "paper", [640], 74, manifest, out=OUT)
    tb.webp(Image.open(PARTS / "ranch_landscape.png").convert("RGB"), "ranch", [720], 74, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket, flap and cord by their measured boxes in % of their
    # own canvases; the concho (its own canvas) on the cord's knot
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"), ("cord", "cord"))}
    pb = {k: pbox(v) for k, v in raw.items()}
    bx = pb["back"]
    back_px = box(raw["back"])
    front = place(pb["front"], bx)
    flap = place(pb["flap"], bx)
    stage = {
        "aspect": round((back_px[2] - back_px[0]) / (back_px[3] - back_px[1]), 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
        "cord": place(pb["cord"], bx),
    }
    layers = {k: raw[k].crop(box(raw[k])) for k in raw}
    concho = trim(part("concho"))
    layers["concho"] = concho
    cw_ = 18.0                                                     # % of the envelope width
    chh = r2(cw_ * stage["aspect"] * concho.height / concho.width)
    cl, ct, cwid, cht = stage["cord"]
    kx = cl + cwid * knot_x(layers["cord"]) / 100
    band = ct + cht * .2                                           # the two turns sit in the cord box's upper part
    stage["concho"] = [r2(kx - cw_ / 2), r2(band - chh / 2), cw_, chh]
    stage["knot_x"] = r2(kx)
    card = trim(part("card_small"))
    ratio = card.width / card.height
    cwp = 84.0                                                     # % of the envelope width
    ch = r2(cwp * stage["aspect"] / ratio)
    stage["card"] = [r2(50 - cwp / 2), r2(100 - ch - 3), cwp, ch]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width, the cord by its box (pocket and cord came on another canvas: matched in % "
                      "of each), the concho on the cord's knot, the card in the pocket")
    for k, name in (("back", "back"), ("front", "front"), ("flap", "flap"), ("cord", "cord")):
        tb.webp(layers[k], name, [720], 82, manifest, out=OUT)
    tb.webp(concho, "concho", [240], 86, manifest, out=OUT)
    tb.webp(trim(part("flap_in")), "flap_in", [720], 80, manifest, out=OUT)
    tb.webp(card, "card", [720], 78, manifest, out=OUT)
    manifest["stage"] = stage

    for src, name, width in (("leather_frame", "frame", 720), ("leather_wide", "frame_wide", 1100)):
        im = part(src)
        keyed, win = keyed_window(im.crop(box(im)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 82, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("gate", "gate", 480, 82), ("lace_divider", "lace", 1200, 82), ("hat", "hat", 480, 82),
                                ("wildflowers", "wildflowers", 720, 80), ("accent_1", "accent_1", 160, 86),
                                ("accent_2", "accent_2", 160, 86), ("accent_3", "accent_3", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("portrait", "frame"), ("wide", "frame_wide")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), w / h, w=640, ton=PH_TONE, karisim=.45, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("frame")}, "story_1": {"aspect": aspect("frame")},
                               "story_2": {"aspect": aspect("frame")}, "story_3": {"aspect": aspect("frame")},
                               "venue": {"aspect": aspect("frame_wide")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(concho)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the silver concho"}
    envelope_still(layers, stage, 400)  # sanity: every layer composes

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G445 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT, "frame*.webp")}   # the frames (the sage and the flowers are green by nature)
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in stage if not k.startswith("_")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("frame", "frame_wide")})
    print({n: (manifest[n]["files"][-1]["file"], manifest[n]["src_size"]) for n in manifest if isinstance(manifest[n], dict) and "files" in manifest[n]})
    print(f"suede-ranch-lace: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
