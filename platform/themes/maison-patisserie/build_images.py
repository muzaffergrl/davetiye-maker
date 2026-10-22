#!/usr/bin/env python3
"""Maison Pâtisserie (28) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G428.

Redesign of 2026-10-22 (docs/35): every picture is the design's own PAKET 5R part
(collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  page_ground (W1)    ground-640/1024       cream pastry paper with hair-fine pistachio pinstripes (every page)
  cream_paper (W2)    paper-640/1024        cream cotton card: the home card, the invitation band, programme, reply form
  env_back (W3)       back-720              the landscape envelope's back with its rose doily lining (the envelope box)
  env_front (W4)      front-720             the front pocket (the card rises from behind it)
  flap (W5)           flap-720              the scalloped pistachio doily-edged flap, outside (closed)
  flap_in (W6)        flap_in-720           the flap's inside (rose doily lining), shown once it is open (3D back face)
  sleeve_band (W7)    band-720              the rose-pink sleeve band with gold scalloped edges round the envelope
  bow (W8)            bow-720               the rose satin ribbon tied in a bow on the band
  bow_untied (W9)     untied-720            the same ribbon untied: the two loose tails (swapped in for the bow)
  rosebud (W10)       bud-240               the sugared rose bud on the knot (falls first; home and reply ornament; favicon)
  card_small (W11)    card-720              the scallop-topped cream card with a doily rosette that rises from the envelope
  cameo_frame (W12)   cameo-720             the piped royal-icing oval round the portrait; oval window measured
  plate_frame (W13)   plate-720             the gold-rimmed porcelain cake plate (story shelf, story teaser); round window
  shelf (W14)         shelf-1000            the glass display-case shelf on gold brackets (story, the menu note)
  vitrine_wide (W15)  vitrine-1100          the pistachio pâtisserie shop window with its striped awning (venue); window
  corner_spray (W16)  spray-720             roses, a macaron and a curl of satin (home card corners, reply card)
  divider (W17)       divider-1000          a line of piped icing with gold dragées (section dividers)
  cake_stand (W18)    stand-480             the porcelain stand with a pyramid of macarons (signature, thank-you)
  accent_1..3 (W19)   macaron/pearl/petal-160  macarons, sugar pearls and petals that drop in with a bounce
  web_hero (W20)      og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5, W7, W8, W9) share one canvas; GPT drifted between them (the flap starts 4 % below the
back's top edge and is ~1 % wider, the pocket stops 1.6 % short of the back's bottom, the untied ribbon sits 5 % higher
and is a little thicker than the tied one), so each is cut to its own alpha box and laid in the envelope box (the back's
alpha box): pocket and flap span its width (the flap hangs from the top edge, the pocket reaches the bottom edge), the
band and the bow by their boxes, the untied ribbon moved down so its ribbon line meets the tied one's — manifest
`stage`, the numbers site.css uses (tests/theme-maison-patisserie.test.ts compares them). The rose bud has its own
canvas: scaled to BUD_W % of the envelope's width and set on the knot. Photo windows: GPT left the window's middle
transparent inside a green rim; the window = the green pixels plus the transparent hole they enclose (oval for the
cameo, round for the plate); the shop window's rim is broken by the roses of its window box, so its window is the box of
the rim (a plain rectangle, as the prompt asked), the roses in front of the glass kept.

  python3 platform/themes/maison-patisserie/build_images.py [--still out.png]
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

COL = ROOT / "collections/28_Maison_Patisserie"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (246, 236, 228)        # placeholder tone (cream with a breath of rose)
REQUIRED = ["page_ground", "cream_paper", "env_back", "env_front", "flap", "flap_in", "sleeve_band", "bow", "bow_untied",
            "rosebud", "card_small", "cameo_frame", "plate_frame", "shelf", "vitrine_wide", "corner_spray", "divider",
            "cake_stand", "accent_1", "accent_2", "accent_3", "web_hero"]
BUD_W = 11.0                     # % of the envelope width (the prompt's 7.5 % of the canvas read too small on a phone)
CARD_W = 46.0                    # % of the envelope width: the card hides behind flap and pocket while closed


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


def _green(c: np.ndarray) -> np.ndarray:
    rgb = c[..., :3].astype(np.int16)
    return (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)


def _despill(c: np.ndarray, win: np.ndarray) -> None:
    """Clear the window and neutralise the green spill in a 12 px ring round it (in place)."""
    c[win, 3] = 0
    ring = _grow(win, 12) & ~win
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)


def keyed_window(im: Image.Image):
    """The photo window of a framed part: GPT's green is a closed rim round an already transparent (or blurred) middle,
    so the window = the green rim with everything it encloses (never the frame's own corners — the cameo is an oval,
    the plate a circle), grown 2 px and cleared; the green spill round it neutralised.
    (RGBA, window box (L, T, W, H) % of the image) or (im, None)."""
    c = np.asarray(im).copy()
    green = _green(c)
    if green.sum() < 256:
        return im, None
    win = _grow(_fill_holes(_grow(green, 1)), 2)
    ys, xs = np.nonzero(win)
    h, w = c.shape[:2]
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    _despill(c, win)
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h)


def rect_window(im: Image.Image):
    """The shop window: its green rim is broken at the bottom by the window box's roses (they stand in front of the
    glass), so the hole cannot be flood-filled; the window = the box of the green rim (straight edges, square corners —
    the prompt's rectangle). Inside it everything that is not opaque (the green, its blurred fringe) is cleared; the
    roses in front of the glass stay; the spill round it is neutralised. (RGBA, window box %) or (im, None)."""
    c = np.asarray(im).copy()
    green = _green(c)
    if green.sum() < 256:
        return im, None
    ys, xs = np.nonzero(green)
    h, w = c.shape[:2]
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    win = np.zeros(green.shape, bool)
    win[y0:y1, x0:x1] = True
    keep = np.zeros(green.shape, bool)       # opaque, not green: the roses and leaves of the window box
    keep[y0:y1, x0:x1] = (c[y0:y1, x0:x1, 3] > 200) & ~_grow(green, 3)[y0:y1, x0:x1]
    keep[:y0 + round(.7 * (y1 - y0))] = False   # only the bottom of the window has roses in front of it
    _despill(c, (win & ~keep) | _grow(green, 2))
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h)


def place(inner, outer):
    """The box `inner` (x0, y0, x1, y1 px) in % of the box `outer`: [left, top, width, height]."""
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def ribbon_line(im: Image.Image) -> float:
    """The straight ribbon's centre row (px of the canvas): the middle of its top and bottom rows in four columns on its
    straight runs (14–24 % and 76–86 % of the canvas width, clear of the bow and of the turned-over ends)."""
    a = np.asarray(im)[..., 3] > 60
    w = a.shape[1]
    rows = []
    for f in (.14, .24, .76, .86):
        ys = np.nonzero(a[:, round(w * f)])[0]
        rows.append((ys.min() + ys.max()) / 2)
    return float(np.median(rows))


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — for the composition check (--still)."""
    w = round(h * stage["aspect"])
    pad = round(h * .1)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (150, 150, 150, 255))
    for key in ("back", "front", "flap", "band", "bow", "bud"):
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

    ground = Image.open(PARTS / "page_ground.png").convert("RGB")
    paper = Image.open(PARTS / "cream_paper.png").convert("RGB")
    tb.webp(ground, "ground", [640, 1024], 74, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 74, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and flap span its width; band and bows by their box
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"),
                                   ("band", "sleeve_band"), ("bow", "bow"), ("untied", "bow_untied"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    # the untied ribbon: moved down so its straight ribbon line meets the tied ribbon's (GPT drew it ~5 % higher)
    dy = round(ribbon_line(raw["bow"]) - ribbon_line(raw["untied"]))
    ub = boxes["untied"]
    front = place(boxes["front"], bx)
    flap = place(boxes["flap"], bx)
    band = place(boxes["band"], bx)
    bow = place(boxes["bow"], bx)
    untied = place((ub[0], ub[1] + dy, ub[2], ub[3] + dy), bx)
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
        "band": [r2(50 - band[2] / 2), band[1], band[2], band[3]],
        "bow": [r2(50 - bow[2] / 2), bow[1], bow[2], bow[3]],
        "untied": [r2(50 - untied[2] / 2), untied[1], untied[2], untied[3]],
        "untied_shift_px": dy,
    }
    layers = {k: raw[k].crop(boxes[k]) for k in ("back", "front", "flap", "band", "bow", "untied")}
    bud = trim(part("rosebud"))
    layers["bud"] = bud
    knot_y = 100 * (ribbon_line(raw["bow"]) - bx[1]) / bh
    bud_h = r2(BUD_W * bw / bh * bud.height / bud.width)
    # the bud sits on the knot: its flower (the upper part of the cut, the leaves below) centred on the ribbon line
    stage["bud"] = [r2(50 - BUD_W / 2), r2(knot_y - bud_h * .48), BUD_W, bud_h]
    card = trim(part("card_small"))
    stage["card_ratio"] = round(card.width / card.height, 4)
    stage["card"] = [r2(50 - CARD_W / 2), 6.0, CARD_W, r2(CARD_W * stage["aspect"] / stage["card_ratio"])]
    flap_in = trim(part("flap_in"))
    stage["flap_in_ratio"] = round(flap_in.width / flap_in.height, 4)
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width, the band and both ribbons are centred by their boxes (the untied one "
                      "moved down by untied_shift_px canvas px onto the tied ribbon's line), the bud sits on the knot, "
                      "the card hides behind flap and pocket")
    for k in ("back", "front", "flap", "band", "bow", "untied"):
        tb.webp(layers[k], k, [720], 82, manifest, out=OUT)
    tb.webp(bud, "bud", [240], 86, manifest, out=OUT)
    tb.webp(flap_in, "flap_in", [720], 82, manifest, out=OUT)
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    manifest["stage"] = stage

    # the frames: window measured (green rim + the transparent hole it encloses)
    for src, name, width in (("cameo_frame", "cameo", 720), ("plate_frame", "plate", 720), ("vitrine_wide", "vitrine", 1100)):
        cut = trim(part(src))
        keyed, win = rect_window(cut) if name == "vitrine" else keyed_window(cut)
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("corner_spray", "spray", 720, 82), ("divider", "divider", 1000, 84),
                                ("shelf", "shelf", 1000, 84), ("cake_stand", "stand", 480, 84),
                                ("accent_1", "macaron", 160, 86), ("accent_2", "pearl", 160, 86),
                                ("accent_3", "petal", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("oval", "cameo"), ("round", "plate"), ("wide", "vitrine")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(ground, (0, 0, ground.width, ground.height), w / h, w=640, ton=PH_TONE, karisim=.4, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("cameo")}, "story_1": {"aspect": aspect("plate")},
                               "story_2": {"aspect": aspect("plate")}, "story_3": {"aspect": aspect("plate")},
                               "venue": {"aspect": aspect("vitrine")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(bud)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the sugared rose bud"}
    if "--still" in sys.argv:
        envelope_still(layers, stage, 600).convert("RGB").save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G428 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "front", "flap", "band", "bow", "untied", "untied_shift_px", "bud",
                                            "card", "flap_in_ratio", "card_ratio")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("cameo", "plate", "vitrine")})
    print(f"maison-patisserie: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
