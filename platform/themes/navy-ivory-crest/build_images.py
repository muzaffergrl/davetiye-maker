#!/usr/bin/env python3
"""Navy Ivory Crest (48) — GPT sources → img/ (docs/11 §5.4, docs/34; tools/tema_build.py). Task G448.

Every picture is the design's own PAKET 5 part (collections/48_Navy_Ivory_Crest/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  navy_linen (W1)        linen-640/1024        navy linen: the page ground, the day band
  ivory_cotton (W2)      paper-640/1024        ivory cotton: cards, bands, the reply form
  env_back (W3)          back-900              the open landscape wallet envelope's back with its navy-pinstripe lining
  env_front (W4)         front-900             the navy linen pocket (the card rises from behind it)
  flap (W5)              flap-900              the straight flap with its blind-embossed laurel cartouche (it swings up)
  flap_in (W6)           flap_in-900           the flap's inside (the pinstripe lining), shown once it is open
  seal (W7)              seal-240              the ivory shield wax seal on the flap's edge (it lifts with the ribbon tab)
  ribbon_tab (W8)        tab-120               the navy grosgrain tab under the seal
  crest (W9)             crest-480             the gold-engraved laurel wreath round an empty shield (initials: HTML)
  card_small (W10)       card-720              the ivory card that rises from the envelope (it lies sideways inside)
  cartouche_frame (W11)  mat-720               the notched ivory mat round a portrait (hero, story); window measured
  cartouche_wide (W12)   mat_wide-1100         the wide mat (venue); window measured
  magnolia (W13)         magnolia-720          a white magnolia with laurel and a navy ribbon (corners, signature)
  bow (W14)              bow-360               the navy grosgrain bow (signature)
  laurel_divider (W15)   laurel-1200           the gold laurel line (section dividers)
  accent_1..3 (W16)      accent_N-160          a magnolia petal, a laurel leaf, a gold-engraved leaf (the reply, rows)
  web_hero (W17)         og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5, W8) share one canvas; each is cut to its own alpha box and laid in the envelope box
(the back's alpha box) by its measured edges — manifest `stage`, the numbers site.css uses
(tests/theme-navy-ivory-crest.test.ts compares them). The seal (its own canvas) sits centred on the flap's edge, over the
tab's top end. Photo windows: `cartouche_wide` has a green window (cleared whole, the spill round it removed);
`cartouche_frame` has none — its window is the clear region round its centre (the notched corners stay the mat's).

  python3 platform/themes/navy-ivory-crest/build_images.py
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

COL = ROOT / "collections/48_Navy_Ivory_Crest"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (238, 232, 216)        # placeholder tone (ivory cotton)
REQUIRED = ["navy_linen", "ivory_cotton", "env_back", "env_front", "flap", "flap_in", "seal", "ribbon_tab", "crest",
            "card_small", "cartouche_frame", "cartouche_wide", "magnolia", "bow", "laurel_divider", "accent_1", "accent_2",
            "accent_3", "web_hero"]


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


def clear_window(im: Image.Image):
    """The window of a frame GPT left clear (docs/34 §4, 48 cartouche_frame): the box of the transparent region round the
    centre — along the middle row and column, outwards until the mat (alpha ≥ 16) starts. (L, T, W, H) % of the image."""
    a = np.asarray(im)[..., 3]
    h, w = a.shape
    cy, cx = h // 2, w // 2
    if a[cy, cx] >= 16:
        return None

    def run(v, c):
        lo = c
        while lo > 0 and v[lo - 1] < 16:
            lo -= 1
        hi = c
        while hi < len(v) - 1 and v[hi + 1] < 16:
            hi += 1
        return lo, hi + 1
    x0, x1 = run(a[cy], cx)
    y0, y1 = run(a[:, cx], cy)
    return (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h)


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
    for key in ("back", "front", "flap", "tab", "seal"):
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

    linen = Image.open(PARTS / "navy_linen.png").convert("RGB")
    paper = Image.open(PARTS / "ivory_cotton.png").convert("RGB")
    tb.webp(linen, "linen", [640, 1024], 74, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and flap span its width; the tab by its box; the seal
    # (its own canvas) centred on the flap's edge
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"), ("tab", "ribbon_tab"))}
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
        "tab": place(boxes["tab"], bx),
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    seal = trim(part("seal"))
    layers["seal"] = seal
    sw = 15.0                                                      # % of the envelope width
    sh = r2(sw * bw / bh * seal.height / seal.width)
    stage["seal"] = [r2(50 - sw / 2), r2(stage["flap"][3] - sh * .55), sw, sh]
    card = trim(part("card_small"))
    cr = card.width / card.height
    # the card lies sideways in the landscape pocket: its width (upright) = 78 % of the envelope's height
    cw_h = 78.0
    stage["card"] = {"ratio": round(cr, 4), "width_pct": r2(cw_h / (bw / bh)), "height_pct": r2(cw_h / cr)}
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width, the tab by its box on the shared canvas, the seal centred on the flap's "
                      "edge; the card (upright size in % of the envelope's width / height) lies turned a quarter in the "
                      "pocket and turns upright as it rises")
    for k, name in (("back", "back"), ("front", "front"), ("flap", "flap")):
        tb.webp(layers[k], name, [900], 82, manifest, out=OUT)
    tb.webp(layers["tab"], "tab", [120], 86, manifest, out=OUT)
    tb.webp(seal, "seal", [240], 86, manifest, out=OUT)
    tb.webp(trim(part("flap_in")), "flap_in", [900], 82, manifest, out=OUT)
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    manifest["stage"] = stage

    # the mats: the wide one has a green window; the portrait one a clear window round its centre
    mat = trim(part("cartouche_frame"))
    win = clear_window(mat)
    if win is None:
        print("ERROR cartouche_frame.png: no clear window round the centre", file=sys.stderr)
        return 1
    tb.webp(mat, "mat", [720], 84, manifest, out=OUT)
    manifest["mat"]["window_pct"] = [r2(v) for v in win]
    manifest["mat"]["window_px"] = [round(mat.width * win[2] / 100), round(mat.height * win[3] / 100)]
    manifest["mat"]["_note"] = "no green from GPT: the window is the clear region round the centre (docs/34 §4)"
    wide = part("cartouche_wide")
    keyed, win = keyed_window(wide.crop(box(wide)))
    if win is None:
        print("ERROR cartouche_wide.png: no #00FF00 window found", file=sys.stderr)
        return 1
    tb.webp(keyed, "mat_wide", [1100], 84, manifest, out=OUT)
    manifest["mat_wide"]["window_pct"] = [r2(v) for v in win]
    manifest["mat_wide"]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("crest", "crest", 480, 86), ("magnolia", "magnolia", 720, 82), ("bow", "bow", 360, 86),
                                ("laurel_divider", "laurel", 1200, 84), ("accent_1", "accent_1", 160, 86),
                                ("accent_2", "accent_2", 160, 86), ("accent_3", "accent_3", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)
    # the shield inside the wreath, where the initials go (measured: the clear region round the crest's centre)
    crest = trim(part("crest"))
    manifest["crest"]["shield_pct"] = [r2(v) for v in (clear_window(crest) or (0, 0, 0, 0))]

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("portrait", "mat"), ("wide", "mat_wide")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), w / h, w=640, ton=PH_TONE, karisim=.45, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("mat")}, "story_1": {"aspect": aspect("mat")},
                               "story_2": {"aspect": aspect("mat")}, "story_3": {"aspect": aspect("mat")},
                               "venue": {"aspect": aspect("mat_wide")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(seal)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the shield seal"}
    envelope_still(layers, stage, 400)  # sanity: every layer composes

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G448 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in stage if not k.startswith("_")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("mat", "mat_wide")}, manifest["crest"]["shield_pct"])
    print({n: (manifest[n]["files"][0]["file"], manifest[n]["src_size"]) for n in manifest if isinstance(manifest[n], dict) and "files" in manifest[n]})
    print(f"navy-ivory-crest: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
