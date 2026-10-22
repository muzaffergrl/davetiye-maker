#!/usr/bin/env python3
"""Velvet Jewel Box (23) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G423.

Redesign of 2026-10-22 (docs/35): every picture is the design's own PAKET 5R part
(collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  moire_ground (W1)   moire-640/1024        the pale champagne silk moiré page ground
  ivory_paper (W2)    paper-640/1024        ivory card stock: cards, the reply form
  velvet (W3)         velvet-640/1024       aubergine silk velvet: the invitation band, the showcase, the signature
  env_back (W4)       back-720              the square velvet envelope's back with its champagne satin lining (the envelope box)
  env_front (W5)      front-720             the front pocket (the card rises from behind it)
  flap (W6)           flap-720              the three-lobed velvet flap, outside (closed; it swings up on its top edge)
  flap_in (W7)        flap_in-720           the flap's inside (champagne satin with a seed-pearl edge), shown once it is open
  ribbon_band (W8)    ribbon-144            the champagne satin band round the envelope (cut at its knot into two halves)
  ring (W9)           ring-320              the rose gold solitaire threaded on the band
  card_small (W10)    card-720              the pearl-edged ivory card that rises from the envelope
  cameo_frame (W11)   cameo-720             the oval rose gold and pearl cameo round the portrait; oval window measured
  tray_frame (W12)    tray-720              the oval setting in a velvet ring tray (story showcase, story teaser)
  venue_frame (W13)   venue-1100            the wide pearl-edged rose gold frame (venue); window measured
  corner_spray (W14)  spray-720             champagne ribbon, pearls and a rose (home card corners, reply card)
  divider (W15)       divider-1000          a strand of seed pearls with a rose gold bead (section dividers)
  ring_box (W16)      ringbox-480           the open ring box of the signature (the ring settles into it)
  accent_1..3 (W17)   pearl/petal/diamond-160  the accents that drift during the opening and after a reply
  web_hero (W18)      og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W4, W5, W6, W8) share one canvas; GPT drifted ~2 % between them (pocket and flap a little wider
than the back), so each is cut to its own alpha box and laid in the envelope box (the back's alpha box); pocket and flap
span its width — manifest `stage`, the numbers site.css uses (tests/theme-velvet-jewel-box.test.ts compares them). The
ring has its own canvas: it is scaled to 21 % of the envelope's width and centred on the band just above the knot.
Photo windows: GPT left the window's middle transparent inside a green rim; the window = the green pixels plus the
transparent hole they enclose (oval for the cameo and the tray), cleared whole, the green spill round it neutralised.

  python3 platform/themes/velvet-jewel-box/build_images.py
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

COL = ROOT / "collections/23_Velvet_Jewel_Box"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (238, 226, 206)        # placeholder tone (soft champagne)
REQUIRED = ["moire_ground", "ivory_paper", "velvet", "env_back", "env_front", "flap", "flap_in", "ribbon_band", "ring",
            "card_small", "cameo_frame", "tray_frame", "venue_frame", "corner_spray", "divider", "ring_box",
            "accent_1", "accent_2", "accent_3", "web_hero"]
RING_W = 21.0                    # % of the envelope width (the hero detail of the closed envelope)


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
    """The photo window of a framed part: GPT's green (≈ 3, 252, 45) is a closed rim round an already transparent middle,
    so the window = the green rim with everything it encloses (never the frame's own corners — the cameo and the tray are
    ovals), grown 2 px and cleared; the green spill in a 12 px ring round it is neutralised.
    (RGBA, window box (L, T, W, H) % of the image) or (im, None)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    if green.sum() < 256:
        return im, None
    win = _grow(_fill_holes(_grow(green, 1)), 2)
    ys, xs = np.nonzero(win)
    h, w = c.shape[:2]
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    c[win, 3] = 0
    ring = _grow(win, 12) & ~win
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


def knot_row(band: Image.Image) -> float:
    """The band's knot: the widest run of rows in its middle third (% of the cut band's height)."""
    a = np.asarray(band)[..., 3] > 40
    widths = a.sum(1).astype(float)
    h = len(widths)
    lo, hi = h // 3, 2 * h // 3
    mid = widths[lo:hi]
    rows = np.nonzero(mid >= mid.max() * .97)[0] + lo
    return 100 * float(rows.mean()) / h


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — for the favicon and a composition check."""
    w = round(h * stage["aspect"])
    pad = round(h * .1)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    for key in ("back", "front", "flap", "ribbon", "ring"):
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

    moire = Image.open(PARTS / "moire_ground.png").convert("RGB")
    paper = Image.open(PARTS / "ivory_paper.png").convert("RGB")
    velvet = Image.open(PARTS / "velvet.png").convert("RGB")
    tb.webp(moire, "moire", [640, 1024], 72, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 74, manifest, out=OUT)
    tb.webp(velvet, "velvet", [640, 1024], 70, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and flap span its width; the band by its box
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"),
                                   ("ribbon", "ribbon_band"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    front = place(boxes["front"], bx)
    flap = place(boxes["flap"], bx)
    ribbon = place(boxes["ribbon"], bx)
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
        "ribbon": [r2(50 - ribbon[2] / 2), ribbon[1], ribbon[2], ribbon[3]],
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    stage["knot"] = r2(knot_row(layers["ribbon"]))
    ring = trim(part("ring"))
    layers["ring"] = ring
    rh = r2(RING_W * bw / bh * ring.height / ring.width)
    knot_y = stage["ribbon"][1] + stage["ribbon"][3] * stage["knot"] / 100
    stage["ring"] = [r2(50 - RING_W / 2), r2(knot_y - rh * 1.04), RING_W, rh]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width, the band is centred by its box (knot = % of the band's height), the "
                      "ring sits on the band just above the knot")
    for k in ("back", "front", "flap"):
        tb.webp(layers[k], k, [720], 82, manifest, out=OUT)
    tb.webp(layers["ribbon"], "ribbon", [144], 84, manifest, out=OUT)
    tb.webp(ring, "ring", [320], 88, manifest, out=OUT)
    flap_in = trim(part("flap_in"))
    tb.webp(flap_in, "flap_in", [720], 82, manifest, out=OUT)
    stage["flap_in_ratio"] = round(flap_in.width / flap_in.height, 4)
    card = trim(part("card_small"))
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    stage["card_ratio"] = round(card.width / card.height, 4)
    manifest["stage"] = stage

    # the frames: window measured (green rim + the transparent hole it encloses)
    for src, name, width in (("cameo_frame", "cameo", 720), ("tray_frame", "tray", 720), ("venue_frame", "venue", 1100)):
        keyed, win = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("corner_spray", "spray", 720, 82), ("divider", "divider", 1000, 84),
                                ("ring_box", "ringbox", 480, 84), ("accent_1", "pearl", 160, 86),
                                ("accent_2", "petal", 160, 86), ("accent_3", "diamond", 160, 88)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("oval", "cameo"), ("tray", "tray"), ("wide", "venue")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(moire, (0, 0, moire.width, moire.height), w / h, w=640, ton=PH_TONE, karisim=.4, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("cameo")}, "story_1": {"aspect": aspect("tray")},
                               "story_2": {"aspect": aspect("tray")}, "story_3": {"aspect": aspect("tray")},
                               "venue": {"aspect": aspect("venue")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(ring)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the rose gold ring"}
    still = envelope_still(layers, stage, 600)
    if "--still" in sys.argv:
        still.save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G423 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "front", "flap", "ribbon", "knot", "ring", "flap_in_ratio", "card_ratio")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("cameo", "tray", "venue")})
    print(f"velvet-jewel-box: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
