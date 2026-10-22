#!/usr/bin/env python3
"""Nocturne Lake Estate (22) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G422.

Redesign of 2026-10-22 (docs/35 row 22): every picture is the design's own PAKET 5R part
(collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  night_laid (W1)     night-640/1024        the charcoal-black laid paper with sparse gold flecks (every page's ground)
  ivory_laid (W2)     ivory-640/1024        warm ivory laid card: the home card, the invitation band, programme, reply form
  env_back (W3)       back-720              the portrait envelope's back, lined with the oil-painted night lake (the envelope box)
  env_front (W4)      front-720             the front pocket (the card rises from behind it)
  flap (W5)           flap-720              the deep diamond flap, outside, with its deckled champagne-gold foil edge
  flap_in (W6)        flap_in-720           the flap's inside — the painted night sky and mountains, shown once it is open
  vellum_band (W7)    vellum-720            the frosted vellum belly band engraved with a lake panorama (made translucent in CSS)
  moon_brooch (W8)    moon-320              the hammered gold crescent brooch pinned on the band; it rises and stays as the moon
  card_small (W9)     card-720              the ivory card that rises from the envelope (moon-and-ripple vignette at its top)
  window_frame (W10)  window-720            the arched gilded wrought-iron villa window (home portrait); window measured + mask
  story_frame (W11)   story-720             the rectangular lacquered villa window (story, story teaser); window measured
  shutter_left/right  shutter_l/r-360       the two charcoal louvred shutters in front of the story window (same canvas)
  terrace_frame (W13) terrace-1100          the wide frame over a stone balustrade with two lanterns (venue); window measured
  nocturne_band (W14) band-640/1280         the oil painting of the lake at night (home top band, narrow strips on details/rsvp)
  corner_spray (W15)  spray-720             white garden roses and olive (home card corners, reply card)
  divider (W16)       divider-1000          two gold olive branches with a tiny crescent (section dividers)
  candle_lantern (W17) lantern-320          the hurricane lantern of the signature (the flame flickers in CSS)
  accent_1..3 (W18)   flake/petal/spark-160 gold leaf, a rose petal, a candle spark: they drift during the opening / a reply
  web_hero (W19)      og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5, W7) share one canvas; GPT drew the pocket, the flap and the band ~5 % wider than the
back, so each is cut to its own alpha box and laid in the envelope box (the back's alpha box): pocket and flap span its
width (the flap hangs from the top edge, the pocket stands on the bottom edge); the band, drawn exactly as wide as the
flap, spans the envelope plus a small fold at each end; the brooch (its own canvas) is scaled to 26 % of the envelope's
width and pinned at the band's centre — manifest `stage`, the numbers site.css uses (tests/theme-nocturne-lake-estate.test.ts
compares them). The shutters share the story window's canvas: each is cut to its alpha box and placed in % of the cut
window frame (`shutters`). Photo windows: GPT left the window's middle (nearly) transparent inside a green rim; the
window = the green pixels plus the hole they enclose, cleared whole, the green spill round it neutralised. The arched
window's shape becomes a technical alpha mask (mask_arch.png = the measured window, nothing drawn) for CSS mask-image.

  python3 platform/themes/nocturne-lake-estate/build_images.py [--still out.png]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/22_Nocturne_Lake_Estate"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (58, 56, 50)           # placeholder tone (warm charcoal)
REQUIRED = ["night_laid", "ivory_laid", "env_back", "env_front", "flap", "flap_in", "vellum_band", "moon_brooch",
            "card_small", "window_frame", "story_frame", "shutter_left", "shutter_right", "terrace_frame",
            "nocturne_band", "corner_spray", "divider", "candle_lantern", "accent_1", "accent_2", "accent_3", "web_hero"]
MOON_W = 26.0                    # % of the envelope width (the hero detail of the closed envelope)
BAND_FOLD = 1.5                  # % of the envelope width the band reaches past each side edge (it folds round it)
CARD_W = 64.0                    # % of the envelope width: the card sits low in the pocket, the lake shows above it
CARD_TOP = 33.0                  # % of the envelope height: the card's top in the closed envelope (behind flap and pocket)


def part(ad: str) -> Image.Image:
    return Image.open(PARTS / f"{ad}.png").convert("RGBA")


def box(im: Image.Image, esik: int = 8):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def trim(im: Image.Image, esik: int = 8) -> Image.Image:
    k = box(im, esik)
    return im.crop(k) if k else im


def r2(v: float) -> float:
    return round(float(v), 2)


def _grow(m: np.ndarray, px: int) -> np.ndarray:
    """Dilate a boolean mask by `px` pixels (PIL MaxFilter; no scipy on the build machines)."""
    im = Image.fromarray(m.astype(np.uint8) * 255, "L").filter(ImageFilter.MaxFilter(2 * px + 1))
    return np.asarray(im) > 127


def _fill_holes(m: np.ndarray) -> np.ndarray:
    """m plus every pixel not reachable from the border without crossing m (scipy's binary_fill_holes)."""
    h, w = m.shape
    pad = np.zeros((h + 2, w + 2), np.uint8)
    pad[1:-1, 1:-1] = m.astype(np.uint8) * 255
    im = Image.fromarray(pad, "L").copy()
    ImageDraw.floodfill(im, (0, 0), 128)
    return (np.asarray(im)[1:-1, 1:-1] != 128)


def keyed_window(im: Image.Image):
    """The photo window of a framed part: GPT's green is a closed rim round a (nearly) transparent middle, so the
    window = the green rim with everything it encloses, grown 2 px and cleared; the green spill in a 12 px ring round it
    is neutralised (and any stray green-dominant speck). (RGBA, window box (L, T, W, H) % of the image, window mask) or (im, None, None)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    if green.sum() < 256:
        return im, None, None
    win = _grow(_fill_holes(_grow(green, 1)), 2)
    ys, xs = np.nonzero(win)
    h, w = c.shape[:2]
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    c[win, 3] = 0
    ring = _grow(win, 12) & ~win
    rgb = c[..., :3].astype(np.int16)
    # the green spill round the window, and any stray green-dominant speck elsewhere (the frames have no green)
    spill = (ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)) | (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 30)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    c[c[..., 3] < 8, :3] = 16      # a neutral dark under the transparent pixels: no green chroma bleeds in the lossy WebP
    return (Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h),
            win[y0:y1, x0:x1])


def place(inner, outer):
    """The box `inner` (x0, y0, x1, y1 px) in % of the box `outer`: [left, top, width, height]."""
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — a composition check (--still)."""
    w = round(h * stage["aspect"])
    pad = round(h * .1)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (40, 40, 40, 255))
    for key in ("back", "card", "front", "flap", "vellum", "moon"):
        L, T, W, H = stage[key]
        im = layers[key].resize((max(1, round(w * W / 100)), max(1, round(h * H / 100))), Image.LANCZOS)
        if key == "vellum":
            a = np.asarray(im).copy()
            a[..., 3] = (a[..., 3] * .78).astype(np.uint8)
            im = Image.fromarray(a, "RGBA")
        canvas.alpha_composite(im, (pad + round(w * L / 100), pad + round(h * T / 100)))
    return canvas


def main() -> int:
    missing = [k for k in REQUIRED if not (PARTS / f"{k}.png").exists()]
    if missing:
        print("ERROR: parts missing: " + ", ".join(missing), file=sys.stderr)
        return 1
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")) + list(OUT.glob("*.json")):
        old.unlink()

    night = Image.open(PARTS / "night_laid.png").convert("RGB")
    ivory = Image.open(PARTS / "ivory_laid.png").convert("RGB")
    tb.webp(night, "night", [640, 1024], 70, manifest, out=OUT)
    tb.webp(ivory, "ivory", [640, 1024], 72, manifest, out=OUT)
    band = Image.open(PARTS / "nocturne_band.png").convert("RGB")
    tb.webp(band, "band", [640, 1280], 74, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and flap span its width; the band by the flap's
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"),
                                   ("vellum", "vellum_band"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    front = place(boxes["front"], bx)
    flap = place(boxes["flap"], bx)
    vel = place(boxes["vellum"], bx)
    fx0, fx1 = boxes["flap"][0], boxes["flap"][2]
    vx0, vx1 = boxes["vellum"][0], boxes["vellum"][2]
    vel_w = 100 * (vx1 - vx0) / (fx1 - fx0) + 2 * BAND_FOLD          # the band in the flap's (= envelope's) width
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
        "vellum": [r2(50 - vel_w / 2), vel[1], r2(vel_w), vel[3]],
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    moon = trim(part("moon_brooch"))
    layers["moon"] = moon
    mh = r2(MOON_W * bw / bh * moon.height / moon.width)
    band_mid = stage["vellum"][1] + stage["vellum"][3] / 2
    stage["moon"] = [r2(50 - MOON_W / 2), r2(band_mid - mh / 2), MOON_W, mh]
    card = trim(part("card_small"))
    layers["card"] = card
    ch = r2(CARD_W * bw / bh * card.height / card.width)
    stage["card"] = [r2(50 - CARD_W / 2), CARD_TOP, CARD_W, ch]
    stage["card_ratio"] = round(card.width / card.height, 4)
    flap_in = trim(part("flap_in"))
    stage["flap_in_ratio"] = round(flap_in.width / flap_in.height, 4)
    # standing open, the inside is as wide as the envelope; its height (% of the envelope's) follows its own shape
    stage["flap_in_h"] = r2(100 * bw / bh / stage["flap_in_ratio"])
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width (flap from the top edge, pocket down to the bottom edge), the band spans "
                      "the flap's width + a fold at each end, the brooch sits on the band's centre, the card in the "
                      "pocket; flap_in_h = the open flap's inside standing above the envelope (% of its height)")
    for k in ("back", "front", "flap"):
        tb.webp(layers[k], k, [720], 82, manifest, out=OUT)
    tb.webp(layers["vellum"], "vellum", [720], 84, manifest, out=OUT)
    tb.webp(moon, "moon", [320], 88, manifest, out=OUT)
    tb.webp(flap_in, "flap_in", [720], 82, manifest, out=OUT)
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    manifest["stage"] = stage

    # the frames: window measured (green rim + the transparent hole it encloses)
    story_box = box(part("story_frame"))
    for src, name, width in (("window_frame", "window", 720), ("story_frame", "story", 720),
                             ("terrace_frame", "terrace", 1100)):
        keyed, win, mask = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]
        if src == "window_frame":
            # the arched window's shape as a technical alpha mask for CSS mask-image (the measured pixels, not a drawing)
            m = Image.fromarray(mask.astype(np.uint8) * 255, "L").filter(ImageFilter.GaussianBlur(1.2))
            m = m.resize((320, round(320 * m.height / m.width)), Image.LANCZOS)
            rgba = Image.new("RGBA", m.size, (0, 0, 0, 0))
            rgba.putalpha(m)
            rgba.save(OUT / "mask_arch.png", optimize=True)
            manifest[name]["mask"] = "mask_arch.png"

    # the shutters share the story window's canvas: cut to their alpha boxes, placed in % of the cut window frame
    shutters = {}
    for src, name in (("shutter_left", "shutter_l"), ("shutter_right", "shutter_r")):
        im = part(src)
        k = box(im)
        tb.webp(im.crop(k), name, [360], 84, manifest, out=OUT)
        shutters[name] = place(k, story_box)
    manifest["shutters"] = shutters

    for src, name, width, q, esik in (("corner_spray", "spray", 720, 82, 8), ("divider", "divider", 1000, 84, 8),
                                      ("candle_lantern", "lantern", 320, 86, 8), ("accent_1", "flake", 160, 86, 8),
                                      ("accent_2", "petal", 160, 86, 8), ("accent_3", "spark", 160, 88, 3)):
        tb.webp(trim(part(src), esik), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("arch", "window"), ("story", "story"), ("wide", "terrace")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(band, (0, 0, band.width, band.height), w / h, w=640, ton=PH_TONE, karisim=.35, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("window")}, "story_1": {"aspect": aspect("story")},
                               "story_2": {"aspect": aspect("story")}, "story_3": {"aspect": aspect("story")},
                               "venue": {"aspect": aspect("terrace")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(moon)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the gold crescent brooch"}
    if "--still" in sys.argv:
        envelope_still(layers, stage, 900).save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G422 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 30}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "front", "flap", "vellum", "moon", "card", "flap_in_ratio",
                                            "flap_in_h")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("window", "story", "terrace")})
    print("shutters", shutters)
    print(f"nocturne-lake-estate: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
