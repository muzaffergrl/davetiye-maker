#!/usr/bin/env python3
"""Azulejo Mosaic (30) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G430.

Redesign of 2026-10-22 (docs/35 row 30): every picture is the design's own PAKET 5R part
(collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  whitewash_ground (W1)  wash-640/1024        sunlit lime-whitewash plaster: every page ground
  glaze_paper (W2)       paper-640/1024       creamy glaze-white cotton paper: cards, bands, the reply form
  env_back (W3)          back-720             the envelope's inside: terracotta lining with cobalt rosettes
  env_front (W4)         front-720            the glaze-white front pocket with its row of border tiles (the card rises
                         border-<w>           from behind it); its six border tiles, cut out, edge the invitation band
  flap (W5)              flap-720             the stepped tile-grid flap, outside (closed; it swings up on its top edge)
  flap_in (W6)           flap_in-720          the flap's inside (terracotta + cobalt lining), shown once it is open
  twine (W7)             twine_v/l/r-<w>      the crossed jute twine, cut into three: the vertical strand with the knot
                                              and its loose ends, the left arm, the right arm (they slide off apart)
  tile_front (W8)        tile_front-<w>       the loose swallow tile at the flap's lowest step (the closure)
  tile_back (W9)         tile_back-<w>        its terracotta bisque back (the 3D flip; the back of every turning tile)
  card_small (W10)       card-720             the glaze-white card that rises from the envelope
  niche_frame (W11)      niche-720            the limestone arch niche with tiles round the home portrait; window measured
  story_frame (W12)      frame-720            the azulejo-bordered frame (story, story teaser); window measured
  venue_frame (W13)      venue-1100           the wide tile-panel frame (venue); window measured
  corner_spray (W14)     spray-720            olive, jasmine and two loose tiles (cover corner, home card, reply card)
  divider (W15)          divider-1000         the frieze of five small tiles (section dividers)
  terracotta_pot (W16)   pot-480              the terracotta pot with ivy and jasmine (signature)
  mosaic_tile_a/b (W17)  tile_a/tile_b-240    the tiles of the photo mosaic and of the turning tiles on the cover
  accent_1..3 (W18)      chip/leaf/jasmine-160  the accents that drift during the opening and after a reply
  web_hero (W19)         og-1200x630.jpg      share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5, W7, W8, W9) share one canvas and GPT kept them in place there, except that it drew the
flap ~8 % wider than the back (x 4–96 % against 7.7–92.5 %) and the pocket ~2 % wider. The flap's square tiles and round
medallions are the strongest picture, so they keep their proportions: the envelope box is the flap's width × the back's
height, and the back and the pocket (plain paper, a small rosette print, six border tiles) are laid across that width.
Twine and tile keep their places on the canvas relative to that box. Manifest `stage` holds the numbers site.css uses
(tests/theme-azulejo-mosaic.test.ts compares them).
Photo windows: the story and venue frames came with a fully transparent window (no green at all), the niche with a green
rim round a transparent middle; the window = the hole the frame encloses (with any green in it), cleared whole, the
green spill round it neutralised. All three windows are rectangles (no mask needed).

  python3 platform/themes/azulejo-mosaic/build_images.py
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

COL = ROOT / "collections/30_Azulejo_Mosaic"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (232, 236, 242)        # placeholder tone (glaze white with a breath of cobalt)
REQUIRED = ["whitewash_ground", "glaze_paper", "env_back", "env_front", "flap", "flap_in", "twine", "tile_front",
            "tile_back", "card_small", "niche_frame", "story_frame", "venue_frame", "corner_spray", "divider",
            "terracotta_pot", "mosaic_tile_a", "mosaic_tile_b", "accent_1", "accent_2", "accent_3", "web_hero"]
# the six border tiles along the bottom of the pocket (env_front canvas px, measured on the part: tile 1's left edge to
# tile 6's right edge with a hair of grout; the ribbon repeats every two tiles, so the cut repeats along a band)
BORDER_CROP = (117, 1137, 1010, 1244)
CARD_W = 70.0                    # % of the envelope width (inside the pocket with room on both sides)
CARD_TOP = 6.0                   # % of the envelope height


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
    return np.asarray(im)[1:-1, 1:-1] != 128


def _component(m: np.ndarray, seed) -> np.ndarray:
    """The 4-connected region of m that holds `seed` (x, y)."""
    im = Image.fromarray(m.astype(np.uint8) * 255, "L").copy()
    ImageDraw.floodfill(im, seed, 128)
    return np.asarray(im) == 128


def keyed_window(im: Image.Image):
    """The photo window of a framed part = the hole the frame encloses round its middle, with any GPT green (≈ 3, 252, 45)
    in it (the niche: a green rim; the story and venue frames: no green, the window is simply transparent), grown 2 px and
    cleared; the green spill in a 12 px ring round it is neutralised.
    (RGBA, window box (L, T, W, H) % of the image) or (im, None)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    solid = (c[..., 3] > 40) & ~green
    hole = _fill_holes(solid) & ~solid
    h, w = c.shape[:2]
    seed = (w // 2, h // 2)
    if not hole[seed[1], seed[0]]:
        return im, None
    win = _grow(_component(hole, seed), 2)
    if win.sum() < 0.05 * w * h:
        return im, None
    ys, xs = np.nonzero(win)
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


def union(a, b):
    return (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]))


def split_twine(tw: Image.Image):
    """The crossed twine → its knot (x, y px) and three layers on the same canvas: the vertical strand with the knot and
    the two loose ends, the left arm, the right arm. The knot = the crossing of the tallest columns and the widest rows;
    the arms are the wide rows left and right of the knot (the loose ends hang lower, so they stay with the strand)."""
    c = np.asarray(tw)
    a = c[..., 3] > 60
    cols = np.nonzero(a.sum(0) > 0.5 * a.sum(0).max())[0]
    rows = np.nonzero(a.sum(1) > 0.5 * a.sum(1).max())[0]
    kx, ky = float(cols.mean()), float(rows.mean())
    knot_r = 34                                  # the knot's half width (px, measured: x 541–601 round 571)
    y = np.arange(c.shape[0])[:, None]
    band = (y >= rows.min() - 30) & (y <= rows.max() + 16)   # the arms' ends bend up a little
    x = np.arange(c.shape[1])[None, :]
    left = band & (x < kx - knot_r)
    right = band & (x > kx + knot_r)
    out = {}
    for k, m in (("twine_l", left), ("twine_r", right), ("twine_v", ~(left | right))):
        d = c.copy()
        d[..., 3] = np.where(m, d[..., 3], 0)
        out[k] = Image.fromarray(d, "RGBA")
    return (kx, ky), out


def neutral_leaves(im: Image.Image) -> Image.Image:
    """The pot's ivy has a few leaf-edge pixels as saturated as the #00FF00 key (tb.yesil_gorunur would read them as
    residue): only those are pulled to the ivy's own muted green (G at 1.3 × max(R, B)); nothing else changes."""
    c = np.asarray(im).copy()
    a = c.astype(np.int16)
    mx = np.maximum(a[..., 0], a[..., 2])
    hot = ((a[..., 1] - mx) > 30) & (a[..., 1] * 20 >= 27 * mx) & (a[..., 3] > 25)   # with a margin for resampling
    c[..., 1] = np.where(hot, np.minimum(a[..., 1], (mx * 1.3).astype(np.int16)).clip(0, 255), c[..., 1]).astype(np.uint8)
    return Image.fromarray(c, "RGBA")


def first_file(manifest, name):
    return manifest[name]["files"][0]["file"]


def main() -> int:
    missing = [k for k in REQUIRED if not (PARTS / f"{k}.png").exists()]
    if missing:
        print("ERROR: parts missing: " + ", ".join(missing), file=sys.stderr)
        return 1
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    wash = Image.open(PARTS / "whitewash_ground.png").convert("RGB")
    paper = Image.open(PARTS / "glaze_paper.png").convert("RGB")
    tb.webp(wash, "wash", [640, 1024], 70, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 72, manifest, out=OUT)

    # the envelope: the box is the flap's width × the back's height; back and pocket span its width
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"))}
    boxes = {k: box(v) for k, v in raw.items()}
    env = (boxes["flap"][0], boxes["back"][1], boxes["flap"][2], boxes["back"][3])
    ew, eh = env[2] - env[0], env[3] - env[1]
    front = place(boxes["front"], env)
    flap = place(boxes["flap"], env)
    stage = {
        "aspect": round(ew / eh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
        "_drift": {"back_px": list(boxes["back"]), "front_px": list(boxes["front"]), "flap_px": list(boxes["flap"])},
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    for k in ("back", "front", "flap"):
        tb.webp(layers[k], k, [720], 80, manifest, out=OUT)
    flap_in = trim(part("flap_in"))
    tb.webp(flap_in, "flap_in", [720], 80, manifest, out=OUT)
    stage["flap_in_ratio"] = round(flap_in.width / flap_in.height, 4)

    # the closure: the loose tile (front and back cut to one box, so the flip turns on one axis) and the twine in three
    tf, tk = part("tile_front"), part("tile_back")
    tbox = union(box(tf), box(tk))
    tb.webp(tf.crop(tbox), "tile_front", [320], 86, manifest, out=OUT)
    tb.webp(tk.crop(tbox), "tile_back", [320], 84, manifest, out=OUT)
    stage["tile"] = place(tbox, env)
    (kx, ky), strands = split_twine(part("twine"))
    for k, im in strands.items():
        b = box(im)
        tb.webp(im.crop(b), k, [min(720, b[2] - b[0])], 86, manifest, out=OUT)
        stage[k] = place(b, env)
    stage["knot"] = [r2(100 * (kx - env[0]) / ew), r2(100 * (ky - env[1]) / eh)]
    card = trim(part("card_small"))
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    stage["card_ratio"] = round(card.width / card.height, 4)
    stage["card"] = [r2(50 - CARD_W / 2), CARD_TOP, CARD_W, r2(CARD_W * ew / eh / stage["card_ratio"])]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the box is the flap's width × the back's "
                      "height; back and pocket span its width, the flap hangs from its top edge, tile and twine keep "
                      "their canvas places (knot = the twine's crossing, x/y %); the card is 70 % of the width")
    manifest["stage"] = stage

    # the border tiles of the pocket, cut out to edge the invitation band
    tb.webp(part("env_front").crop(BORDER_CROP), "border", [900], 84, manifest, out=OUT)

    # the frames: window measured (the hole the frame encloses, with any green in it)
    for src, name, width in (("niche_frame", "niche", 720), ("story_frame", "frame", 720), ("venue_frame", "venue", 1100)):
        keyed, win = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no photo window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("corner_spray", "spray", 720, 82), ("divider", "divider", 1000, 84),
                                ("terracotta_pot", "pot", 480, 84), ("mosaic_tile_a", "tile_a", 240, 86),
                                ("mosaic_tile_b", "tile_b", 240, 86), ("accent_1", "chip", 160, 86),
                                ("accent_2", "leaf", 160, 86), ("accent_3", "jasmine", 160, 86)):
        im = trim(part(src))
        if src == "terracotta_pot":
            im = neutral_leaves(im)
        tb.webp(im, name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("niche", "niche"), ("story", "frame"), ("venue", "venue")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(wash, (0, 0, wash.width, wash.height), w / h, w=640, ton=PH_TONE, karisim=.35, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("niche")}, "story_1": {"aspect": aspect("frame")},
                               "story_2": {"aspect": aspect("frame")}, "story_3": {"aspect": aspect("frame")},
                               "venue": {"aspect": aspect("venue")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(tf.crop(tbox))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the loose swallow tile"}

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G430 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: v for k, v in stage.items() if not k.startswith("_")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("niche", "frame", "venue")})
    print({n: first_file(manifest, n) for n in ("twine_v", "twine_l", "twine_r", "border", "tile_front", "tile_a")})
    print(f"azulejo-mosaic: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
