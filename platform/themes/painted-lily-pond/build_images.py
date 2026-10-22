#!/usr/bin/env python3
"""Painted Lily Pond (41) — GPT sources → img/ (docs/11 §5.4, docs/34; tools/tema_build.py). Task G441.

Every picture is the design's own PAKET 5 part (collections/41_Painted_Lily_Pond/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  canvas_ground (W1)    canvas-640            primed linen canvas: the page ground, cards, the painted look on photos
  garden_scene (W2)     garden-720/1080       the full-screen water-garden painting the brushstrokes paint in; home's band
  env_back (W3)         back-720              the open canvas portfolio envelope's back with its painted lining
  env_front (W4)        front-720             the cream canvas pocket (the card rises from behind it)
  flap (W5)             flap-720              the straight flap with its deckled edge, painted with a lily pond (it swings up)
  flap_in (W6)          flap_in-720           the flap's inside (a lilac-blue wash), shown once it is open
  seal (W7)             seal-240              the lilac wax seal with an embossed water lily
  stroke_1..4 (W8)      stroke_N-900          four broad brushstrokes: masks that paint the garden in, one after another
  card_small (W9)       card-720              the canvas card that rises from the envelope
  canvas_frame (W10)    pano-720              the stretched canvas panel round a portrait (hero, story); window measured
  canvas_wide (W11)     pano_wide-1100        the wide panel (venue); window measured
  wisteria (W12)        wisteria-560          wisteria (corners of the home card)
  lilies (W13)          lilies-1000           a band of water lilies (dividers, signature)
  accent_1..3 (W14)     accent_N-160          a lily pad, a wisteria sprig, a dragonfly (drifting on the pages, the reply)
  web_hero (W15)        og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5) share one canvas; each is cut to its own alpha box and laid in the envelope box (the
back's alpha box) by its measured edges — manifest `stage`, the numbers site.css uses
(tests/theme-painted-lily-pond.test.ts compares them). The seal (its own canvas) sits centred on the flap's deckled
edge. Photo windows: GPT left only a green rim round an already transparent inside; the whole measured rectangle is
cleared and the green spill round it removed.

  python3 platform/themes/painted-lily-pond/build_images.py
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

COL = ROOT / "collections/41_Painted_Lily_Pond"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (238, 233, 220)        # placeholder tone (primed canvas)
REQUIRED = ["canvas_ground", "garden_scene", "env_back", "env_front", "flap", "flap_in", "seal", "stroke_1", "stroke_2",
            "stroke_3", "stroke_4", "card_small", "canvas_frame", "canvas_wide", "wisteria", "lilies", "accent_1",
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
    """The alpha box in % of its own canvas (the envelope layers' canvases differ by a pixel row)."""
    x0, y0, x1, y1 = box(im)
    return (100 * x0 / im.width, 100 * y0 / im.height, 100 * x1 / im.width, 100 * y1 / im.height)


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — a sanity check that every layer composes."""
    w = round(h * stage["aspect"])
    pad = round(h * .2)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    for key in ("back", "front", "flap", "seal"):
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

    canvas = Image.open(PARTS / "canvas_ground.png").convert("RGB")
    tb.webp(canvas, "canvas", [640], 74, manifest, out=OUT)
    garden = Image.open(PARTS / "garden_scene.png").convert("RGB")
    tb.webp(garden, "garden", [720, 1080], 74, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and flap span its width; the seal (its own
    # canvas) centred on the flap's deckled edge
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"))}
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
    }
    layers = {k: raw[k].crop(box(raw[k])) for k in raw}
    seal = trim(part("seal"))
    layers["seal"] = seal
    sw = 20.0                                                      # % of the envelope width
    sh = r2(sw * stage["aspect"] * seal.height / seal.width)
    stage["seal"] = [r2(50 - sw / 2), r2(stage["flap"][3] - sh * .6), sw, sh]
    card = trim(part("card_small"))
    ratio = card.width / card.height
    cw = 84.0                                                      # % of the envelope width
    ch = r2(cw * stage["aspect"] / ratio)
    stage["card"] = [r2(50 - cw / 2), r2(100 - ch - 3), cw, ch]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width, the seal centred on the flap's deckled edge, the card in the pocket")
    for k, name in (("back", "back"), ("front", "front"), ("flap", "flap")):
        tb.webp(layers[k], name, [720], 82, manifest, out=OUT)
    tb.webp(seal, "seal", [240], 86, manifest, out=OUT)
    tb.webp(trim(part("flap_in")), "flap_in", [720], 82, manifest, out=OUT)
    tb.webp(card, "card", [720], 76, manifest, out=OUT)
    manifest["stage"] = stage

    # the four brushstrokes (masks: where they are opaque the garden shows)
    for n in (1, 2, 3, 4):
        tb.webp(trim(part(f"stroke_{n}")), f"stroke_{n}", [900], 82, manifest, out=OUT)

    # the canvas panels: window measured
    for src, name, width in (("canvas_frame", "pano", 720), ("canvas_wide", "pano_wide", 1100)):
        im = part(src)
        keyed, win = keyed_window(im.crop(box(im)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("wisteria", "wisteria", 560, 78), ("lilies", "lilies", 1000, 78),
                                ("accent_1", "accent_1", 160, 86), ("accent_2", "accent_2", 160, 86), ("accent_3", "accent_3", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("portrait", "pano"), ("wide", "pano_wide")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(canvas, (0, 0, canvas.width, canvas.height), w / h, w=640, ton=PH_TONE, karisim=.45, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("pano")}, "story_1": {"aspect": aspect("pano")},
                               "story_2": {"aspect": aspect("pano")}, "story_3": {"aspect": aspect("pano")},
                               "venue": {"aspect": aspect("pano_wide")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(seal)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the lilac seal"}
    envelope_still(layers, stage, 400)  # sanity: every layer composes

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G441 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT, "pano*.webp")}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in stage if not k.startswith("_")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("pano", "pano_wide")})
    print({n: (manifest[n]["files"][-1]["file"], manifest[n]["src_size"]) for n in manifest if isinstance(manifest[n], dict) and "files" in manifest[n]})
    print(f"painted-lily-pond: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
