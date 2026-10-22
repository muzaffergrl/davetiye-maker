#!/usr/bin/env python3
"""Blue Toile Pavilion (44) — GPT sources → img/ (docs/11 §5.4, docs/34; tools/tema_build.py). Task G444.

Every picture is the design's own PAKET 5 part (collections/44_Blue_Toile_Pavilion/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  toile_fabric (W1)       toile-640             the design's own toile: the envelope's fabric, the day band
  porcelain_paper (W2)    porcelain-640         porcelain-white paper: the page ground, cards, the reply form
  linen_wall (W3)         linen-640             powder-blue linen: the wall the plates hang on
  env_back (W4)           back-720              the open envelope's back with its powder-blue lining (the envelope box)
  env_front (W5)          front-720             the toile pocket with its two side wings (they hide the card beside the flap)
  flap (W6)               flap-720              the ogee flap with its powder-blue piping (it swings up on its top edge)
  flap_in (W7)            flap_in-720           the flap's inside, shown once it is open
  brooch (W8)             brooch-240            the blue-and-white porcelain cameo brooch pinned to the flap's tip
  bird_1..3 (W9)          bird_N-480            three engraved doves: they lift off the fabric and fly (opening, reply, rows)
  card_small (W10)        card-720              the porcelain-white card that rises from the envelope
  plate_round (W11)       plate-720             a round blue-and-white plate (hero, story 1 and 3); round window measured
  plate_scalloped (W12)   plate_scalloped-720   a scalloped plate (story 2); round window measured
  platter_oval (W13)      platter-1100          an oval platter (venue); oval window measured
  bow (W14)               bow-360               the powder-blue silk bow each plate hangs from
  ginger_jar (W15)        jar-720               a ginger jar with hydrangeas and delphiniums (home card, signature)
  toile_border (W16)      border-1200           an engraved garland (dividers, the reply card)
  accent_1, accent_2      accent_N-160          a hydrangea floret, a delphinium flower (the reply's confetti)
  web_hero (W18)          og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W4, W5, W6) share one canvas; each is cut to its own alpha box and laid in the envelope box (the
back's alpha box) by its measured edges — the pocket's side wings reach above the back, so its box is kept whole —
manifest `stage`, the numbers site.css uses (tests/theme-blue-toile-pavilion.test.ts compares them). The brooch (its own
canvas) sits on the flap's tip. Photo windows are round or oval: only the green and the clear inside are cleared (never
the rectangle round them, which holds the plate's rim) and the green spill round them removed; the photo sits in the
window's bounding box under the plate.

  python3 platform/themes/blue-toile-pavilion/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/44_Blue_Toile_Pavilion"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (232, 236, 242)        # placeholder tone (porcelain with a touch of blue)
REQUIRED = ["toile_fabric", "porcelain_paper", "linen_wall", "env_back", "env_front", "flap", "flap_in", "brooch",
            "bird_1", "bird_2", "bird_3", "card_small", "plate_round", "plate_scalloped", "platter_oval", "bow",
            "ginger_jar", "toile_border", "accent_1", "accent_2", "web_hero"]


def part(ad: str) -> Image.Image:
    return Image.open(PARTS / f"{ad}.png").convert("RGBA")


def box(im: Image.Image, esik: int = 8):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def trim(im: Image.Image, esik: int = 8) -> Image.Image:
    k = box(im, esik)
    return im.crop(k) if k else im


def r2(v: float) -> float:
    return round(float(v), 2)


def keyed_round(im: Image.Image):
    """The round / oval photo window of a plate: GPT's #00FF00 is a ring round an already clear inside. The green (grown
    by 3 px) is cleared, never the rectangle round it — its corners are the plate's rim — and the green spill in a 12 px
    ring round it neutralised. (RGBA, window bounding box (L, T, W, H) % of the image) or (im, None)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 140) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 70) & (c[..., 3] > 60)
    ys, xs = np.nonzero(green)
    if len(ys) < 256:
        return im, None
    h, w = c.shape[:2]
    x0, x1 = int(np.percentile(xs, .5)), int(np.percentile(xs, 99.5)) + 1
    y0, y1 = int(np.percentile(ys, .5)), int(np.percentile(ys, 99.5)) + 1
    grown = np.asarray(Image.fromarray((green * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))) > 0
    # the clear inside: everything inside the window's box that is not the plate (alpha already low) or green
    inside = np.zeros((h, w), bool)
    inside[y0:y1, x0:x1] = True
    c[..., 3] = np.where(grown, 0, c[..., 3])
    ring = np.asarray(Image.fromarray((grown * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(25))) > 0
    rgb = c[..., :3].astype(np.int16)
    spill = ring & ~grown & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    # semi-transparent green haze inside the window (GPT's soft inner edge): clear it too
    haze = inside & (c[..., 3] < 200) & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 10)
    c[..., 3] = np.where(haze, 0, c[..., 3])
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
    for key in ("back", "front", "flap", "brooch"):
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

    tb.webp(Image.open(PARTS / "toile_fabric.png").convert("RGB"), "toile", [640], 76, manifest, out=OUT)
    porcelain = Image.open(PARTS / "porcelain_paper.png").convert("RGB")
    tb.webp(porcelain, "porcelain", [640], 74, manifest, out=OUT)
    tb.webp(Image.open(PARTS / "linen_wall.png").convert("RGB"), "linen", [640], 74, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket (with its wings) and flap by their measured boxes;
    # the brooch (its own canvas) on the flap's tip
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"))}
    pb = {k: pbox(v) for k, v in raw.items()}
    bx = pb["back"]
    back_px = box(raw["back"])
    stage = {
        "aspect": round((back_px[2] - back_px[0]) / (back_px[3] - back_px[1]), 4),
        "back": [0, 0, 100, 100],
        "front": place(pb["front"], bx),
        "flap": place(pb["flap"], bx),
    }
    layers = {k: raw[k].crop(box(raw[k])) for k in raw}
    brooch = trim(part("brooch"))
    layers["brooch"] = brooch
    bw_ = 22.0                                                     # % of the envelope width
    bh_ = r2(bw_ * stage["aspect"] * brooch.height / brooch.width)
    tip = stage["flap"][1] + stage["flap"][3]
    stage["brooch"] = [r2(50 - bw_ / 2), r2(tip - bh_ * .62), bw_, bh_]
    card = trim(part("card_small"))
    ratio = card.width / card.height
    cw = 84.0                                                      # % of the envelope width
    ch = r2(cw * stage["aspect"] / ratio)
    stage["card"] = [r2(50 - cw / 2), r2(100 - ch - 3), cw, ch]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; the "
                      "pocket (its side wings reach above the back) and the ogee flap by their boxes on the shared "
                      "canvas, the brooch on the flap's tip, the card in the pocket")
    for k, name in (("back", "back"), ("front", "front"), ("flap", "flap")):
        tb.webp(layers[k], name, [720], 82, manifest, out=OUT)
    tb.webp(brooch, "brooch", [240], 86, manifest, out=OUT)
    tb.webp(trim(part("flap_in")), "flap_in", [720], 80, manifest, out=OUT)
    tb.webp(card, "card", [720], 78, manifest, out=OUT)
    manifest["stage"] = stage

    for src, name, width in (("plate_round", "plate", 720), ("plate_scalloped", "plate_scalloped", 720), ("platter_oval", "platter", 1100)):
        im = part(src)
        keyed, win = keyed_round(im.crop(box(im)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 82, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("bird_1", "bird_1", 480, 84), ("bird_2", "bird_2", 480, 84), ("bird_3", "bird_3", 480, 84),
                                ("bow", "bow", 360, 84), ("ginger_jar", "jar", 720, 80), ("toile_border", "border", 1200, 82),
                                ("accent_1", "accent_1", 160, 86), ("accent_2", "accent_2", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("round", "plate"), ("wide", "platter")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(porcelain, (0, 0, porcelain.width, porcelain.height), w / h, w=640, ton=PH_TONE, karisim=.45, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("plate")}, "story_1": {"aspect": aspect("plate")},
                               "story_2": {"aspect": aspect("plate_scalloped")}, "story_3": {"aspect": aspect("plate")},
                               "venue": {"aspect": aspect("platter")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(brooch)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the porcelain brooch"}
    envelope_still(layers, stage, 400)  # sanity: every layer composes

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G444 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT, "plat*.webp")}   # the plates (the jar's leaves are green by nature)
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in stage if not k.startswith("_")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("plate", "plate_scalloped", "platter")})
    print({n: (manifest[n]["files"][-1]["file"], manifest[n]["src_size"]) for n in manifest if isinstance(manifest[n], dict) and "files" in manifest[n]})
    print(f"blue-toile-pavilion: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
