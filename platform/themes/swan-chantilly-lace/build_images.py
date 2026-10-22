#!/usr/bin/env python3
"""Swan Chantilly Lace (40) — GPT sources → img/ (docs/11 §5.4, docs/34; tools/tema_build.py). Task G440.

Every picture is the design's own PAKET 5 part (collections/40_Swan_Chantilly_Lace/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  ivory_cotton (W1)   paper-640/1024        ivory cotton card stock: cards, bands, the reply form
  oyster_silk (W2)    silk-640/1024         the pale oyster silk-linen page ground
  env_back (W3)       back-720              the open square envelope's back with its black silk lining (the envelope box)
  env_front (W4)      front-720             the front pocket (the card rises from behind it)
  flap (W5)           flap-720              the round-bottom flap, outside (closed; it swings up on its top edge)
  flap_in (W6)        flap_in-720           the flap's inside (black silk with a lace edge), shown once it is open
  lace_overlay (W7)   lace-720              the Chantilly lace that covers the closed flap (it lifts away like a veil)
  ribbon_tails (W8)   tails-640             the two black silk ribbon tails under the seal (left and right half slip away)
  seal (W9)           seal-240              the ivory wax seal with a gliding swan
  card_small (W10)    card-720              the ivory card that rises from the envelope
  print_frame (W11)   print-720             the deckled print round a portrait (hero, story); window measured
  lace_veil (W12)     veil-720              the lace veil over a print: it lifts as the scene enters
  print_wide (W13)    print_wide-1100       the wide deckled print (venue); window measured (a thin green rim)
  veil_wide (W14)     veil_wide-1100        its lace veil
  swans (W15)         swans-720             a pair of engraved swans (invitation band, signature)
  lily_valley (W16)   lily-720              lily-of-the-valley sprays (home card corners)
  lace_band (W17)     laceband-1200         a horizontal strip of Chantilly lace (section dividers; repeats along x)
  bow (W18)           bow-360               the black silk bow on the home card
  feather, bell (W19) feather-160, bell-160 the swan feather that floats down, the lily-of-the-valley bell (rows, reply)
  web_hero (W20)      og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5, W7, W8) share one canvas; GPT drifts a few per cent between them, so each is cut to its
own alpha box and laid in the envelope box (the back's alpha box) by its measured edges — manifest `stage`, the numbers
site.css uses (tests/theme-swan-chantilly-lace.test.ts compares them). The lace veils share their print's canvas the same
way (manifest `veil`). Photo windows: the whole measured rectangle is cleared and the green spill round it removed.

  python3 platform/themes/swan-chantilly-lace/build_images.py
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

COL = ROOT / "collections/40_Swan_Chantilly_Lace"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (232, 226, 214)        # placeholder tone (soft oyster ivory)
REQUIRED = ["ivory_cotton", "oyster_silk", "env_back", "env_front", "flap", "flap_in", "lace_overlay", "ribbon_tails",
            "seal", "card_small", "print_frame", "lace_veil", "print_wide", "veil_wide", "swans", "lily_valley",
            "lace_band", "bow", "feather", "bell", "web_hero"]


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
    """The closed envelope as the index page shows it — for the favicon."""
    w = round(h * stage["aspect"])
    pad = round(h * .2)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    for key in ("back", "front", "flap", "lace", "tails", "seal"):
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

    paper = Image.open(PARTS / "ivory_cotton.png").convert("RGB")
    silk = Image.open(PARTS / "oyster_silk.png").convert("RGB")
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)
    tb.webp(silk, "silk", [640, 1024], 72, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket, flap and lace span its width, the tails sit by
    # their measured box; the seal (its own canvas) is centred on the flap's tip
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"),
                                   ("lace", "lace_overlay"), ("tails", "ribbon_tails"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    front = place(boxes["front"], bx)
    flap = place(boxes["flap"], bx)
    lace = place(boxes["lace"], bx)
    tails = place(boxes["tails"], bx)
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
        "lace": [0, max(0, lace[1]), 100, r2(lace[1] + lace[3] - max(0, lace[1]))],
        "tails": tails,
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    seal = trim(part("seal"))
    layers["seal"] = seal
    sw = 22.0                                                      # % of the envelope width
    sh = r2(sw * bw / bh * seal.height / seal.width)
    stage["seal"] = [r2(50 - sw / 2), r2(stage["flap"][3] - sh * .62), sw, sh]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket, "
                      "flap and lace span its width, the tails by their box, the seal on the flap's tip")
    for k, name in (("back", "back"), ("front", "front"), ("flap", "flap"), ("lace", "lace")):
        tb.webp(layers[k], name, [720], 82, manifest, out=OUT)
    tb.webp(layers["tails"], "tails", [640], 84, manifest, out=OUT)
    tb.webp(seal, "seal", [240], 86, manifest, out=OUT)
    flap_in = trim(part("flap_in"))
    tb.webp(flap_in, "flap_in", [720], 82, manifest, out=OUT)
    card = trim(part("card_small"))
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    stage["card_ratio"] = round(card.width / card.height, 4)
    manifest["stage"] = stage

    # the prints and their lace veils: window measured; the veil laid on the print by their boxes on the shared canvas
    veils = {}
    for frame, veil, name, vname, width in (("print_frame", "lace_veil", "print", "veil", 720),
                                            ("print_wide", "veil_wide", "print_wide", "veil_wide", 1100)):
        fr, vl = part(frame), part(veil)
        fbox, vbox = box(fr), box(vl)
        if fr.size != vl.size:   # different canvases: compare in % of each canvas
            sx, sy = fr.width / vl.width, fr.height / vl.height
            vbox = (round(vbox[0] * sx), round(vbox[1] * sy), round(vbox[2] * sx), round(vbox[3] * sy))
        keyed, win = keyed_window(fr.crop(fbox))
        if win is None:
            print(f"ERROR {frame}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]
        tb.webp(vl.crop(box(vl)), vname, [width], 82, manifest, out=OUT)
        veils[name] = place(vbox, fbox)
    manifest["veil_place"] = {**veils, "_note": "each lace veil in % of its print (left, top, width, height)"}

    for src, name, width, q in (("swans", "swans", 720, 84), ("lily_valley", "lily", 720, 82), ("bow", "bow", 360, 86),
                                ("feather", "feather", 160, 86), ("bell", "bell", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)
    band = part("lace_band")
    bb = box(band)
    tb.webp(band.crop((0, bb[1], band.width, bb[3])), "laceband", [1200], 82, manifest, out=OUT)
    manifest["laceband"]["_note"] = "cut to its lace (full width: it repeats along x)"

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("portrait", "print"), ("wide", "print_wide")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(silk, (0, 0, silk.width, silk.height), w / h, w=640, ton=PH_TONE, karisim=.45, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("print")}, "story_1": {"aspect": aspect("print")},
                               "story_2": {"aspect": aspect("print")}, "story_3": {"aspect": aspect("print")},
                               "venue": {"aspect": aspect("print_wide")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(seal)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the swan seal"}
    envelope_still(layers, stage, 400)  # sanity: every layer composes

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G440 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "front", "flap", "lace", "tails", "seal", "card_ratio")}))
    print(json.dumps(manifest["veil_place"]))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("print", "print_wide")})
    print(f"swan-chantilly-lace: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
