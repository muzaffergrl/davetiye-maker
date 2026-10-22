#!/usr/bin/env python3
"""Bordeaux Silk Bow (46) — GPT sources → img/ (docs/11 §5.4, docs/34; tools/tema_build.py). Task G446.

Every picture is the design's own PAKET 5 part (collections/46_Bordeaux_Silk_Bow/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  ivory_linen (W1)      paper-640/1024        ivory linen: the envelope's card, cards, the reply form
  ivory_moire (W2)      silk-640/1024         the pale ivory moiré silk page ground
  env_back (W3)         back-720              the open portrait envelope's back with its claret silk lining (the envelope box)
                        claret-640            a crop of that lining: the day band
  env_front (W4)        front-720             the front pocket with its punched hole (the card rises from behind it)
  flap (W5)             flap-720              the straight flap, outside, with its punched hole (it swings up on its top edge)
  flap_in (W6)          flap_in-720           the flap's inside (claret silk), shown once it is open
  bow (W7)              bow_l-640, bow_r-640  the big claret satin bow that closes it, cut at its knot into two halves (the
                                              loops untie one after the other)
  knot (W8)             knot-160              the untied ribbon, a straight band from the flap's hole to the pocket's hole
  ribbon_tile (W9)      ribbon-96             the flowing ribbon, straight (repeats down the page edge)
  ribbon_curl (W10)     curl-96               the flowing ribbon, one S-curl (joins the straight run above and below)
  card_small (W11)      card-720              the ivory card that rises from the envelope (a small bow at its top)
  keepsake_print (W12)  print-720             the black-and-white keepsake print (hero, story, the deck); window measured
  bundle_ribbon (W13)   bundle-720            the ribbon tied round the deck of prints (it loosens as the scene enters)
  keepsake_wide (W14)   print_wide-1100       the wide keepsake print (venue); window measured
  tulips (W15)          tulips-720            a spray of white tulips (corner of the home card, the closed envelope)
  bow_small (W16)       bow_small-360         the small claret bow (section heads, rows, the reply)
  accent_1, accent_2    accent_1-160, _2-160  a white tulip petal, a curled ribbon end (the reply's confetti)
  web_hero (W18)        og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5, W7, W8) share one canvas; GPT drifts a few per cent between them, so each is cut to its
own alpha box and laid in the envelope box (the back's alpha box) by its measured edges — manifest `stage`, the numbers
site.css uses (tests/theme-bordeaux-silk-bow.test.ts compares them). The untied band (W8) is laid between the two punched
holes measured on the flap and the pocket (GPT drew it a little lower than the holes). The deck ribbon shares its print's
canvas the same way (manifest `bundle_place`). Photo windows: GPT left only a green rim round an already transparent
inside; the whole measured rectangle is cleared and the green spill round it removed.

  python3 platform/themes/bordeaux-silk-bow/build_images.py
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

COL = ROOT / "collections/46_Bordeaux_Silk_Bow"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (236, 228, 214)        # placeholder tone (warm ivory linen)
REQUIRED = ["ivory_linen", "ivory_moire", "env_back", "env_front", "flap", "flap_in", "bow", "knot", "ribbon_tile",
            "ribbon_curl", "card_small", "keepsake_print", "bundle_ribbon", "keepsake_wide", "tulips", "bow_small",
            "accent_1", "accent_2", "web_hero"]
KNOT_X = .51                     # the bow's gathered knot, % of the canvas (measured on bow.png: x 45–57 %, y 34–41 %)
KNOT_Y = .375
RIBBON_W = 96                    # px width of the straight ribbon in img/ (shown 18–22 px wide)


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


def hole_y(im: Image.Image) -> float:
    """The punched hole of the flap / the pocket: the mean row of the transparent pixels inside the part's alpha box,
    in the middle fifth of the canvas (px)."""
    a = np.asarray(im)[..., 3]
    x0, y0, x1, y1 = box(im)
    w = im.width
    sub = a[y0:y1, int(w * .4):int(w * .6)] < 20
    ys, _ = np.nonzero(sub)
    if not len(ys):
        raise SystemExit("no punched hole found")
    return float(y0 + ys.mean())


def ends(im: Image.Image, row: int):
    xs = np.nonzero(np.asarray(im)[row, :, 3] > 60)[0]
    return int(xs.min()), int(xs.max()) + 1


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — for the favicon sanity check."""
    w = round(h * stage["aspect"])
    pad = round(h * .2)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    for key in ("back", "front", "flap", "bow_l", "bow_r"):
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

    paper = Image.open(PARTS / "ivory_linen.png").convert("RGB")
    silk = Image.open(PARTS / "ivory_moire.png").convert("RGB")
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)
    tb.webp(silk, "silk", [640, 1024], 72, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and flap span its width; the bow halves and the
    # untied band by their measured boxes (the band between the two punched holes)
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"), ("bow", "bow"),
                                   ("knot", "knot"))}
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
    layers = {k: raw[k].crop(boxes[k]) for k in ("back", "front", "flap")}
    # the bow, cut at its knot into the left and the right loop (each with its tail)
    bow = raw["bow"]
    cut = round(bow.width * KNOT_X)
    for side, crop in (("bow_l", (0, 0, cut, bow.height)), ("bow_r", (cut, 0, bow.width, bow.height))):
        half = Image.new("RGBA", bow.size, (0, 0, 0, 0))
        half.paste(bow.crop(crop), crop[:2])
        hb = box(half)
        layers[side] = half.crop(hb)
        stage[side] = place(hb, bx)
    kx, ky = bow.width * KNOT_X, bow.height * KNOT_Y
    stage["knot_center"] = [r2(100 * (kx - bx[0]) / bw), r2(100 * (ky - bx[1]) / bh)]
    # the untied band: its measured width and x, laid from the flap's hole to the pocket's hole
    kb = boxes["knot"]
    y_flap, y_pocket = hole_y(raw["flap"]), hole_y(raw["front"])
    knot_box = (kb[0], round(y_flap - bh * .012), kb[2], round(y_pocket + bh * .012))
    stage["knot"] = place(knot_box, bx)
    stage["holes"] = [r2(100 * (y_flap - bx[1]) / bh), r2(100 * (y_pocket - bx[1]) / bh)]
    layers["knot"] = raw["knot"].crop(kb)
    card = trim(part("card_small"))
    ratio = card.width / card.height
    cw = 84.0                                                      # % of the envelope width
    ch = r2(cw * stage["aspect"] / ratio)
    stage["card"] = [r2(50 - cw / 2), r2(100 - ch - 3), cw, ch]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width, the bow halves by their boxes on the shared canvas, the untied band "
                      "between the punched holes (holes: flap, pocket), the card in the pocket; knot_center = the "
                      "bow's knot (the halves untie towards it)")
    for k, name in (("back", "back"), ("front", "front"), ("flap", "flap")):
        tb.webp(layers[k], name, [720], 82, manifest, out=OUT)
    tb.webp(layers["bow_l"], "bow_l", [640], 84, manifest, out=OUT)
    tb.webp(layers["bow_r"], "bow_r", [640], 84, manifest, out=OUT)
    tb.webp(layers["knot"], "knot", [160], 86, manifest, out=OUT)
    tb.webp(trim(part("flap_in")), "flap_in", [720], 82, manifest, out=OUT)
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    manifest["stage"] = stage
    # the day band: a crop of the envelope's own claret silk lining
    back = layers["back"]
    lining = back.crop((round(back.width * .14), round(back.height * .16), round(back.width * .86), round(back.height * .62)))
    tb.webp(lining.convert("RGB"), "claret", [640], 78, manifest, out=OUT)
    manifest["claret"]["_note"] = "a crop of env_back's claret silk lining (x 14–86 %, y 16–62 % of the back)"

    # the flowing ribbon: the straight run cut to the ribbon's width (it repeats down); the S-curl scaled so that its two
    # ends are as wide as the straight ribbon (GPT drew the curl's ribbon narrower) — manifest ribbon.curl_end: where they
    # leave the curl (left, width in % of the curl), the joins site.css lines up
    tile, curl = part("ribbon_tile"), part("ribbon_curl")
    t0, t1 = ends(tile, tile.height // 2)
    tile_c = tile.crop((t0, 0, t1, tile.height))
    cb = box(curl)
    curl_c = curl.crop((cb[0], 0, cb[2], curl.height))
    n0, n1 = ends(curl_c, 2)
    m0, m1 = ends(curl_c, curl_c.height - 3)
    sc = RIBBON_W / ((n1 - n0 + m1 - m0) / 2)
    tile_c = tile_c.resize((RIBBON_W, round(tile_c.height * RIBBON_W / tile_c.width)), Image.LANCZOS)
    curl_c = curl_c.resize((round(curl_c.width * sc), round(curl_c.height * sc)), Image.LANCZOS)
    tb.webp(tile_c, "ribbon", [RIBBON_W], 84, manifest, out=OUT)
    tb.webp(curl_c, "curl", [curl_c.width], 84, manifest, out=OUT)
    e0, e1 = ends(curl_c, 2)
    f0, f1 = ends(curl_c, curl_c.height - 3)
    manifest["ribbon"] = {"tile": list(tile_c.size), "curl": list(curl_c.size),
                          "curl_end": [r2(100 * (e0 + f0) / 2 / curl_c.width), r2(100 * ((e1 - e0) + (f1 - f0)) / 2 / curl_c.width)],
                          "_note": "the straight run and the S-curl at one scale; curl_end = where the ribbon leaves the "
                                   "curl at the top and the bottom (left, width, % of the curl's width)"}

    # the keepsake prints: window measured; the deck ribbon laid on the print by their boxes on the shared canvas
    fr, rb = part("keepsake_print"), part("bundle_ribbon")
    fbox, rbox = box(fr), box(rb)
    if fr.size != rb.size:   # different canvases: compare in % of each canvas
        sx, sy = fr.width / rb.width, fr.height / rb.height
        rbox = (round(rbox[0] * sx), round(rbox[1] * sy), round(rbox[2] * sx), round(rbox[3] * sy))
    for src, name, width in (("keepsake_print", "print", 720), ("keepsake_wide", "print_wide", 1100)):
        im = part(src)
        keyed, win = keyed_window(im.crop(box(im)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]
    tb.webp(rb.crop(box(rb)), "bundle", [720], 84, manifest, out=OUT)
    manifest["bundle_place"] = {"print": place(rbox, fbox), "_note": "the deck ribbon in % of its print (left, top, width, height)"}

    for src, name, width, q in (("tulips", "tulips", 720, 82), ("bow_small", "bow_small", 360, 86),
                                ("accent_1", "accent_1", 160, 86), ("accent_2", "accent_2", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

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
    icon, icon_info = tb.ikon(trim(part("bow_small")))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the small claret bow"}
    envelope_still(layers, stage, 400)  # sanity: every layer composes

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G446 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in stage if not k.startswith("_")}))
    print(json.dumps(manifest["bundle_place"]), json.dumps(manifest["ribbon"]))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("print", "print_wide")})
    print(f"bordeaux-silk-bow: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
