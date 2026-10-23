#!/usr/bin/env python3
"""Sky Lantern Festival (31) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G431.

Redesign of 2026-10-22 (docs/35): every picture is the design's own PAKET 5R part
(collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  dusk_ground (W1)    ground-640/853        the dip-dyed dusk washi (violet → rose → amber): the cover ground (cover, fixed)
                                            and the dusk glow behind the home hero
  dusk_tile (W2)      tile-640/1024         the seamless violet washi: every inner page's ground
  rice_paper (W3)     paper-640/1024        rice paper: the reply card, the programme, the day band
  env_back (W4)       back-720              the portrait envelope's back with its starry dusk-sky lining (the envelope box)
  env_front (W5)      front-720             the front pocket with its gold stud (the card rises from behind it)
  flap (W6)           flap-720              the lantern-belly flap, outside (closed; it swings up on its top edge)
  flap_in (W7)        flap_in-720           the flap's inside (rose → amber washi with gold flecks), shown once it is open
  lantern_unlit (W8)  unlit-320             the paper sky lantern tied to the stud (the closure)
  lantern_lit (W9)    lit-320               the same lantern lit from inside (crossfades over W8; CSS adds the warm halo)
  silk_thread (W10)   thread-120            the amber silk thread from the lantern's wire ring, wound round the stud in a bow
  card_small (W11)    card-720              the deckle-edged rice-paper card that rises from the envelope (and the home card)
  lantern_frame (W12) lframe-720            the lantern-silhouette portrait frame; arched window measured → mask_arch.png
  paper_panel (W13)   panel-720             the hanging rice-paper panel (story, story teaser); window measured
  wide_panel (W14)    wide-1100             the wide bamboo-rod panel (venue); window measured
  far_lantern (W15)   far-200               the small far lantern: rising behind the opening, drifting on the pages, the
                                            programme's row lanterns, the lantern released after a reply
  corner_spray (W16)  spray-720             roses and meadow grasses (one corner of the home card and of the reply card)
  divider (W17)       divider-1000          the string of miniature lanterns (section dividers)
  accent_1..3 (W18)   gold/petal/seed-160   gold leaf, a rose petal, a dandelion seed: drifting during the opening and a reply
  web_hero (W19)      og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W4, W5, W6, W8, W9, W10) share one canvas; GPT drifted between them (the flap ~7 % wider than the
back, the pocket ~2 % wider), so each is cut to its own alpha box and laid in the envelope box (the back's alpha box);
pocket and flap span its width — manifest `stage`, the numbers site.css uses (tests/theme-sky-lantern-festival.test.ts
compares them). GPT drew the lantern 43 % of the envelope's width (the prompt asked ~33 %) so it hid the whole belly of
the flap: both lanterns (unlit and lit, each cut to its own box) are laid in one box, scaled to LANTERN_W of the
envelope's width about their wire ring (which keeps sitting on the stud). The thread is laid by its own box; its rows
above the scaled lantern's shoulders are dropped (GPT's larger lantern hid them).
Photo windows: GPT left the window's middle transparent inside a soft green rim; the window = the green pixels plus the
transparent hole they enclose, cleared whole, the green spill round it neutralised. The lantern frame's window has an
arched top: its measured shape is written as a technical alpha mask (mask_arch.png) that site.css applies with
mask-image (the photo's corners never show past the arch).

  python3 platform/themes/sky-lantern-festival/build_images.py [--still <png>]
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

COL = ROOT / "collections/31_Sky_Lantern_Festival"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (236, 214, 200)        # placeholder tone (rice paper in dusk light)
REQUIRED = ["dusk_ground", "dusk_tile", "rice_paper", "env_back", "env_front", "flap", "flap_in", "lantern_unlit",
            "lantern_lit", "silk_thread", "card_small", "lantern_frame", "paper_panel", "wide_panel", "far_lantern",
            "corner_spray", "divider", "accent_1", "accent_2", "accent_3", "web_hero"]
LANTERN_W = 34.0                 # % of the envelope width (GPT_PROMPTS geometry: x 36–64 % of the canvas ≈ 33 %)
CARD_W = 78.0                    # % of the envelope width: the card sits inside the pocket
CARD_TOP = 9.0                   # % of the envelope height


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
    """The photo window of a framed part: GPT's green is a closed rim (soft towards the middle) round an already
    transparent hole, so the window = the green with everything it encloses, grown 2 px and cleared; the green spill in a
    12 px ring round it is neutralised. (RGBA, window box (L, T, W, H) % of the image, window mask) or (im, None, None)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 110) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 50) & (c[..., 3] > 30)
    if green.sum() < 256:
        return im, None, None
    win = _grow(_fill_holes(_grow(green, 1)), 2)
    ys, xs = np.nonzero(win)
    h, w = c.shape[:2]
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    c[win, 3] = 0
    ring = _grow(win, 12) & ~win
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    return (Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h),
            win[y0:y1, x0:x1])


def place(inner, outer):
    """The box `inner` (x0, y0, x1, y1 px) in % of the box `outer`: [left, top, width, height]."""
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def envelope_still(layers: dict, stage: dict, h: int, keys=("back", "front", "flap", "thread", "unlit")) -> Image.Image:
    """The closed envelope as the index page shows it — a composition check (--still <file>)."""
    w = round(h * stage["aspect"])
    pad = round(h * .1)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (128, 128, 128, 255))
    for key in keys:
        L, T, W, H = stage["lantern" if key in ("unlit", "lit") else key]
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

    ground = Image.open(PARTS / "dusk_ground.png").convert("RGB")
    tile = Image.open(PARTS / "dusk_tile.png").convert("RGB")
    paper = Image.open(PARTS / "rice_paper.png").convert("RGB")
    tb.webp(ground, "ground", [640, 853], 74, manifest, out=OUT)
    tb.webp(tile, "tile", [640, 1024], 70, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 72, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and flap span its width
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"),
                                   ("thread", "silk_thread"), ("unlit", "lantern_unlit"), ("lit", "lantern_lit"))}
    boxes = {k: box(v, 24 if k == "thread" else 8) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    front = place(boxes["front"], bx)
    flap = place(boxes["flap"], bx)
    unlit = place(boxes["unlit"], bx)
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
    }
    layers = {k: raw[k].crop(boxes[k]) for k in ("back", "front", "flap", "unlit", "lit")}
    # the lantern: scaled to LANTERN_W about its bottom (the wire ring stays on the stud), centred
    lh = unlit[3] * LANTERN_W / unlit[2]
    bottom = unlit[1] + unlit[3]
    stage["lantern"] = [r2(50 - LANTERN_W / 2), r2(bottom - lh), LANTERN_W, r2(lh)]
    # the thread: its own box, minus the rows hidden above the (smaller) lantern's shoulders
    tx0, ty0, tx1, ty1 = boxes["thread"]
    ty0 = max(ty0, round(bx[1] + bh * (stage["lantern"][1] + lh * .12) / 100))
    layers["thread"] = raw["thread"].crop((tx0, ty0, tx1, ty1))
    thread = place((tx0, ty0, tx1, ty1), bx)
    stage["thread"] = [r2(50 - thread[2] / 2), thread[1], thread[2], thread[3]]
    card = trim(part("card_small"))
    stage["card_ratio"] = round(card.width / card.height, 4)
    stage["card"] = [r2(50 - CARD_W / 2), CARD_TOP, CARD_W, r2(CARD_W * stage["aspect"] / stage["card_ratio"])]
    stage["_note"] = ("%% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width; both lanterns share one box, scaled to %g %% of the width about their "
                      "wire ring; the thread by its own box; the card %g %% wide inside the pocket" % (LANTERN_W, CARD_W))
    for key in ("back", "front", "flap"):
        tb.webp(layers[key], key, [720], 82, manifest, out=OUT)
    tb.webp(layers["unlit"], "unlit", [320], 86, manifest, out=OUT)
    tb.webp(layers["lit"], "lit", [320], 86, manifest, out=OUT)
    tb.webp(layers["thread"], "thread", [120], 88, manifest, out=OUT)
    flap_in = trim(part("flap_in"))
    tb.webp(flap_in, "flap_in", [720], 82, manifest, out=OUT)
    stage["flap_in_ratio"] = round(flap_in.width / flap_in.height, 4)
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    manifest["stage"] = stage

    # the frames: window measured (green rim + the transparent hole it encloses)
    for src, name, width in (("lantern_frame", "lframe", 720), ("paper_panel", "panel", 720), ("wide_panel", "wide", 1100)):
        keyed, win, mask = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]
        if name == "lframe":
            # the arched window as a technical alpha mask (its own measured pixels, softened ~1 px), 320 px wide
            m = Image.fromarray(mask.astype(np.uint8) * 255, "L").filter(ImageFilter.GaussianBlur(1.2))
            m = m.resize((320, round(320 * m.height / m.width)), Image.LANCZOS)
            a = Image.new("RGBA", m.size, (0, 0, 0, 0))
            a.putalpha(m)
            a.save(OUT / "mask_arch.png", optimize=True)
            manifest[name]["mask"] = "mask_arch.png"

    for src, name, width, q in (("far_lantern", "far", 200, 86), ("corner_spray", "spray", 720, 82),
                                ("divider", "divider", 1000, 84), ("accent_1", "gold", 160, 88),
                                ("accent_2", "petal", 160, 86), ("accent_3", "seed", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("arch", "lframe"), ("panel", "panel"), ("wide", "wide")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), w / h, w=640, ton=PH_TONE, karisim=.4, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("lframe")}, "story_1": {"aspect": aspect("panel")},
                               "story_2": {"aspect": aspect("panel")}, "story_3": {"aspect": aspect("panel")},
                               "venue": {"aspect": aspect("wide")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(layers["lit"])
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the lit paper lantern"}
    if "--still" in sys.argv:
        envelope_still(layers, stage, 900).save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G431 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "front", "flap", "lantern", "thread", "card", "flap_in_ratio", "card_ratio")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("lframe", "panel", "wide")})
    print(f"sky-lantern-festival: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
