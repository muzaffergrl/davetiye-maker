#!/usr/bin/env python3
"""Kintsugi & Washi (26) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G426.

Redesign of 2026-10-22 (docs/35): every picture is the design's own PAKET 5R part
(collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  page_ground (W1)    ground-640/1024       undyed rice-ivory washi with sparse gold fibres: every page ground
  card_paper (W2)     paper-640/1024        smooth rice-paper card stock: the invitation band, the programme, the form
  env_back (W3)       back-720              the packet's undyed inside floor (the packet box)
  flap_n/e/s/w (W4–7) flap_n-720, flap_e-440, flap_s-720, flap_w-440   the four indigo washi flaps of the tatō fold
  flap_in_* (W8–11)   in_n-720, in_e-440, in_s-720, in_w-440            their real inner faces (gold-flecked undyed washi)
  cord_band (W12)     cord-720              the twisted gold-and-ivory cord round the packet, figure-eight round the button
  button (W13)        button-240            the kintsugi-mended porcelain button at the centre
  card_small (W14)    card-720              the deckled rice-paper card that rises from the centre
  frame_portrait (W15) portrait-720         the indigo washi mat of the portrait; window measured
  frame_story (W16)   story-720             the rice-paper story mat (portrait); window measured
  frame_story_wide (W17) wide-900           the rice-paper story mat (landscape, 5:4); window measured
  frame_venue (W18)   venue-1100            the wide torn indigo washi of the venue; window measured
  ink_bloom (W19)     ink-512               the sumi ink bloom: a CSS mask (mask-image) through which each photo appears
  corner_sprig (W20)  sprig-560             the white plum sprig (cover corner, home card, reply card)
  divider (W21)       divider-1000          a single gold kintsugi seam (section dividers)
  mended_bowl (W22)   bowl-480              the kintsugi-mended tea bowl of the signature
  accent_1..3 (W23)   flake/drop/petal-160  gold-leaf flake, indigo ink drop, plum petal: they drift during the opening
  web_hero (W24)      og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The packet layers (W3–W7, W12) share one canvas; GPT drifted ~1–3 % between them (the east flap runs 3 % below the
floor, the west flap starts 2 % right of it), so each is cut to its own alpha box and laid in the packet box (the floor's
alpha box): every flap keeps its hinge on its own edge of the square and spans that edge; its depth (to its point) is
measured — manifest `stage`, the numbers site.css uses (tests/theme-kintsugi-washi.test.ts compares them). The cord is
placed by its box. The button has its own canvas: it is centred on the empty circle the cord's figure-eight leaves
(measured: the transparent hole the cord encloses round its centre) and sized to cover the inner half of that ring.
Each inner face is cut to its alpha box and shares its flap's box exactly (the CSS reflection puts it over the hinge);
the south inner face is mirrored left–right so its point lands where the outside's point is (GPT drew it 10 % off).
Photo windows: green rim + everything it encloses (GPT left the middle transparent), or — the venue mat came without
green — the transparent hole the mat encloses; cleared whole, the green spill round it neutralised.

  python3 platform/themes/kintsugi-washi/build_images.py
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

COL = ROOT / "collections/26_Kintsugi_Washi"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (243, 236, 220)        # placeholder tone (rice ivory #F3ECDC)
REQUIRED = ["page_ground", "card_paper", "env_back", "flap_n", "flap_e", "flap_s", "flap_w", "flap_in_n", "flap_in_e",
            "flap_in_s", "flap_in_w", "cord_band", "button", "card_small", "frame_portrait", "frame_story",
            "frame_story_wide", "frame_venue", "ink_bloom", "corner_sprig", "divider", "mended_bowl",
            "accent_1", "accent_2", "accent_3", "web_hero"]
CARD_H = 84.0                    # % of the packet's height: the card lying on the floor, under the flaps
BUTTON_OVER = 1.14               # the button covers the inner half of the cord's ring (× the hole's diameter)


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


def _region(m: np.ndarray, seed) -> np.ndarray:
    """The 4-connected region of the boolean mask m that contains `seed` (x, y) (PIL flood fill)."""
    im = Image.fromarray(m.astype(np.uint8) * 255, "L").copy()
    ImageDraw.floodfill(im, seed, 128)
    return np.asarray(im) == 128


def keyed_window(im: Image.Image):
    """The photo window of a mat: GPT's green rim with everything it encloses (the middle came transparent) — or, for a
    mat without green, the transparent hole the mat encloses; grown 2 px and cleared; the green spill in a 12 px ring
    round it is neutralised. (RGBA, window box (L, T, W, H) % of the image, how) or (im, None, None)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    if green.sum() >= 256:
        win = _grow(_fill_holes(_grow(green, 1)), 2)
        how = "green rim + the hole it encloses"
    else:
        solid = c[..., 3] > 40
        hole = _fill_holes(solid) & ~solid
        if hole.sum() < 256:
            return im, None, None
        win = _grow(hole, 2)
        how = "the transparent hole the mat encloses (no green)"
    ys, xs = np.nonzero(win)
    h, w = c.shape[:2]
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    c[win, 3] = 0
    ring = _grow(win, 12) & ~win
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h), how


def cord_hole(cord: Image.Image):
    """The empty circle in the middle of the cord's figure-eight (canvas px): (cx, cy, diameter)."""
    a = np.asarray(cord)[..., 3] > 40
    hole = _fill_holes(a) & ~a
    k = tb.alfa_kutusu(a.astype(np.uint8) * 255, esik=128)
    seed = ((k[0] + k[2]) // 2, (k[1] + k[3]) // 2)
    if not hole[seed[1], seed[0]]:
        raise SystemExit("ERROR cord_band.png: the middle of the cord is not an enclosed empty circle")
    r = _region(hole, seed)
    ys, xs = np.nonzero(r)
    return ((xs.min() + xs.max() + 1) / 2, (ys.min() + ys.max() + 1) / 2,
            ((xs.max() + 1 - xs.min()) + (ys.max() + 1 - ys.min())) / 2)


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
    paper = Image.open(PARTS / "card_paper.png").convert("RGB")
    tb.webp(ground, "ground", [640, 1024], 72, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 72, manifest, out=OUT)

    # the packet: the floor's alpha box is the packet box; each flap keeps its hinge on its edge and spans it
    raw = {k: part(n) for k, n in (("back", "env_back"), ("n", "flap_n"), ("e", "flap_e"), ("s", "flap_s"),
                                   ("w", "flap_w"), ("cord", "cord_band"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]

    def px(x):
        return 100 * (x - bx[0]) / bw

    def py(y):
        return 100 * (y - bx[1]) / bh
    n_depth, s_top = py(boxes["n"][3]), py(boxes["s"][1])
    e_left, w_depth = px(boxes["e"][0]), px(boxes["w"][2])
    cb = boxes["cord"]
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "n": [0, 0, 100, r2(n_depth)],
        "e": [r2(e_left), 0, r2(100 - e_left), 100],
        "s": [0, r2(s_top), 100, r2(100 - s_top)],
        "w": [0, 0, r2(w_depth), 100],
        "cord": [r2(px(cb[0])), r2(py(cb[1])), r2(100 * (cb[2] - cb[0]) / bw), r2(100 * (cb[3] - cb[1]) / bh)],
    }
    # how far each open flap lies beyond the square (% of the packet): the opening scales the stage to fit them
    stage["reach"] = {"n": stage["n"][3], "e": stage["e"][2], "s": stage["s"][3], "w": stage["w"][2]}
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    hx, hy, hd = cord_hole(raw["cord"])
    button = trim(part("button"))
    bd = hd * BUTTON_OVER
    stage["button"] = [r2(px(hx - bd / 2)), r2(py(hy - bd / 2)), r2(100 * bd / bw), r2(100 * bd / bh)]
    stage["cord_hole"] = [r2(px(hx)), r2(py(hy)), r2(100 * hd / bw)]
    card = trim(part("card_small"))
    ch = CARD_H
    cw = ch * card.width / card.height * bh / bw
    stage["card"] = [r2(50 - cw / 2), r2(50 - ch / 2), r2(cw), ch]
    stage["card_ratio"] = round(card.width / card.height, 4)
    stage["_note"] = ("% of the closed packet (left, top, width, height): the floor's alpha box is the packet; each flap "
                      "keeps its hinge on its edge and spans it, its depth measured (reach = how far it lies beyond "
                      "the square once open); the cord by its box; the button centred on the cord's empty circle "
                      f"(cord_hole = centre x, y, diameter) at {BUTTON_OVER} × its diameter; the card centred, "
                      f"{CARD_H} % high")
    tb.webp(layers["back"], "back", [720], 80, manifest, out=OUT)
    tb.webp(layers["n"], "flap_n", [720], 82, manifest, out=OUT)
    tb.webp(layers["s"], "flap_s", [720], 82, manifest, out=OUT)
    tb.webp(layers["e"], "flap_e", [440], 82, manifest, out=OUT)
    tb.webp(layers["w"], "flap_w", [440], 82, manifest, out=OUT)
    tb.webp(layers["cord"], "cord", [720], 84, manifest, out=OUT)
    tb.webp(button, "button", [240], 88, manifest, out=OUT)
    # the inner faces, each in its flap's box (the south one mirrored: its point then sits where the outside's does)
    inner = {"n": trim(part("flap_in_n")), "e": trim(part("flap_in_e")),
             "s": trim(part("flap_in_s")).transpose(Image.FLIP_LEFT_RIGHT), "w": trim(part("flap_in_w"))}
    for k, w in (("n", 720), ("s", 720), ("e", 440), ("w", 440)):
        tb.webp(inner[k], f"in_{k}", [w], 80, manifest, out=OUT)
    stage["inner_mirrored"] = ["s"]
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    manifest["stage"] = stage

    # the mats: window measured
    for src, name, width in (("frame_portrait", "portrait", 720), ("frame_story", "story", 720),
                             ("frame_story_wide", "wide", 900), ("frame_venue", "venue", 1100)):
        keyed, win, how = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no photo window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]
        manifest[name]["window_from"] = how

    # the ink bloom as a mask: its alpha only (the pixels black), never shown as a picture
    ink = trim(part("ink_bloom"))
    a = np.asarray(ink).copy()
    a[..., :3] = 0
    tb.webp(Image.fromarray(a, "RGBA"), "ink", [512], 86, manifest, out=OUT)
    for src, name, width, q in (("corner_sprig", "sprig", 560, 84), ("divider", "divider", 1000, 84),
                                ("mended_bowl", "bowl", 480, 84), ("accent_1", "flake", 160, 86),
                                ("accent_2", "drop", 160, 86), ("accent_3", "petal", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for name in ("portrait", "story", "wide", "venue"):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(ground, (0, 0, ground.width, ground.height), w / h, w=640, ton=PH_TONE, karisim=.4, bulanik=10)
        tb.webp(ph, f"ph_{name}", [640], 74, manifest, out=OUT)
        slots[name] = f"ph_{name}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("portrait")}, "story_1": {"aspect": aspect("story")},
                               "story_2": {"aspect": aspect("wide")}, "story_3": {"aspect": aspect("story")},
                               "venue": {"aspect": aspect("venue")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(button)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the kintsugi porcelain button"}

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": [], "not_used": ["env_back_v1 (earlier attempt)"]}
    manifest["_note"] = "G426 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "n", "e", "s", "w", "cord", "button", "cord_hole", "card")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"], manifest[n]["window_px"])
           for n in ("portrait", "story", "wide", "venue")})
    print(f"kintsugi-washi: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
