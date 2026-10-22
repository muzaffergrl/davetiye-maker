#!/usr/bin/env python3
"""Riad Lantern Nights (27) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G427.

Redesign of 2026-10-22 (docs/35): every picture is the design's own PAKET 5R part
(collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  tadelakt_ground (W1)  plaster-640/1024      warm ivory tadelakt plaster: the page ground of every page
  cotton_paper (W2)     paper-640/1024        ivory cotton paper: the invitation, the day, the programme, the reply form
  env_back (W3)         back-720              the portrait deep-teal envelope's back with its saffron-teal zellige lining
                                              (the envelope box: every other layer is laid in its alpha box)
  env_front (W4)        front-720             the front pocket (the card rises from behind it)
  flap (W5)             flap-720              the upside-down horseshoe-arch flap, outside, gold zellige border
  flap_in (W6)          flap_in-720           its inside (zellige), shown once it is open: it stands up like an arched door
  stud (W7)             stud-160              the domed brass stud at the flap's tip (it lifts with the flap)
  cord (W8)             cord-240              the saffron silk cord looped round the stud: tassel on the left end, a jump
                                              ring on the right
  lantern_unlit (W9)    lantern-off-240       the pierced brass lantern charm hanging from the jump ring, unlit …
  lantern_lit (W10)     lantern-on-240        … and lit (same canvas: both cut to one shared box, so they crossfade in place)
  card_small (W11)      card-720              the ivory arch-topped card that rises from the envelope (and the home card)
  arch_frame (W12)      arch-720 + arch-mask.png        carved stucco horseshoe arch (portrait); window measured + mask
  story_frame (W13)     storyarch-720 + storyarch-mask.png  carved cedar horseshoe arch (story, story teaser); window + mask
  venue_frame (W14)     venue-1100            the wide cedar frame with the stucco arch frieze (venue); window measured
  corner_spray (W15)    spray-720             bougainvillea and orange blossom (home card corners, reply card)
  divider (W16)         divider-1000          the brass line with the zellige star (section dividers)
  hanging_lantern (W17) hanglamp-240          the large lit lantern over the day
  zellige_tile (W18)    zellige-320           one seamless zellige repeat: the band whose tiles are set one by one
  accent_1..3 (W19)     bract/blossom/star-160  bougainvillea bract, orange blossom, brass star: they drift after the opening
                                              and after a reply
  web_hero (W20)        og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5, W7, W8) share one canvas; GPT drifted ~1 % between them (the flap's fold sits ~1 %
under the back's top edge, the pocket reaches 0.3 % lower): each is cut to its own alpha box and laid in the envelope
box (the back's alpha box) at its measured place; pocket and flap span its width — manifest `stage`, the numbers
site.css uses (tests/theme-riad-lantern-nights.test.ts compares them). The lanterns have their own canvas: scaled to
LANTERN_H % of the envelope's height, their hanging ring hooked into the cord's jump ring (both rings measured).
Photo windows: GPT left the window's middle transparent inside a green rim; the window = the green pixels plus the
transparent hole they enclose, cleared whole, the green spill round it neutralised. The two arch windows are horseshoe
arches: a rectangle or border-radius would show photo corners or erase the stucco/cedar, so the build writes a technical
alpha mask of the measured window (cropped to the photo slot = window box ± 0.5 %), used by CSS `mask-image`.

  python3 platform/themes/riad-lantern-nights/build_images.py [--still <png>]
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

COL = ROOT / "collections/27_Riad_Lantern_Nights"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (240, 228, 205)        # placeholder tone (warm tadelakt ivory)
REQUIRED = ["tadelakt_ground", "cotton_paper", "env_back", "env_front", "flap", "flap_in", "stud", "cord",
            "lantern_unlit", "lantern_lit", "card_small", "arch_frame", "story_frame", "venue_frame", "corner_spray",
            "divider", "hanging_lantern", "zellige_tile", "accent_1", "accent_2", "accent_3", "web_hero"]
LANTERN_H = 23.0                 # % of the envelope's height (prompt: ~16 % of the 1440 canvas ≈ 19 % of the box; a touch larger: the hero detail)
CARD_W = 58.0                    # % of the envelope's width: the card stays inside the flap's curve and the pocket
CARD_TOP = 22.0                  # % of the envelope's height: hidden behind the closed flap and the pocket
SLOT_PAD = 0.5                   # % of the frame: the photo slot = the window box grown by this on every side


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


def _region_from(passable: np.ndarray, seed) -> np.ndarray:
    """The connected region of `passable` pixels that contains `seed` (x, y) — PIL flood fill (no scipy)."""
    im = Image.fromarray(passable.astype(np.uint8) * 255, "L").copy()
    ImageDraw.floodfill(im, seed, 128)
    return np.asarray(im) == 128


def keyed_window(im: Image.Image):
    """The photo window of a framed part: GPT painted a green rim round an already transparent, soft-edged middle, and
    the rim is not closed everywhere (the soft middle touches the frame's inner moulding in places), so the window is
    the region reachable from the middle through green or transparent pixels, bounded by the opaque frame itself — the
    horseshoe outline, never the frame's own corners; grown 2 px and cleared; the green spill in a 12 px ring round it
    is neutralised; islands inside it (half-opaque wisps of the soft middle) belong to it.
    (RGBA, window box (L, T, W, H) % of the image, window mask bool) or (im, None, None)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    if green.sum() < 256:
        return im, None, None
    passable = _grow(green, 1) | (c[..., 3] <= 40)
    gy, gx = np.nonzero(green)
    seed = (int((gx.min() + gx.max()) // 2), int((gy.min() + gy.max()) // 2))
    if not passable[seed[1], seed[0]]:
        return im, None, None
    # + the islands it encloses (a few half-opaque wisps of GPT's soft middle)
    win = _grow(_fill_holes(_region_from(passable, seed)), 2)
    if win[0].any() or win[-1].any() or win[:, 0].any() or win[:, -1].any():
        print("ERROR: the window leaks to the image border", file=sys.stderr)
        return im, None, None
    ys, xs = np.nonzero(win)
    h, w = c.shape[:2]
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    c[win, 3] = 0
    ring = _grow(win, 12) & ~win
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h), win


def window_mask(win: np.ndarray, slot_px, width: int) -> Image.Image:
    """Technical alpha mask of the measured window (grown 2 px more, so the photo tucks under the frame's inner edge),
    cropped to the photo slot `slot_px` (x0, y0, x1, y1 — may reach past the image: padded transparent), `width` px wide.
    White with the window as alpha (CSS mask-image uses the alpha)."""
    m = _grow(win, 2).astype(np.uint8) * 255
    h, w = m.shape
    x0, y0, x1, y1 = slot_px
    pad = max(0, -x0, -y0, x1 - w, y1 - h)
    if pad:
        m = np.pad(m, pad)
        x0, y0, x1, y1 = x0 + pad, y0 + pad, x1 + pad, y1 + pad
    a = Image.fromarray(m[y0:y1, x0:x1], "L")
    a = a.resize((width, round(width * a.height / a.width)), Image.LANCZOS)
    return Image.merge("LA", (Image.new("L", a.size, 255), a))


def seam_soften(im: Image.Image) -> Image.Image:
    """GPT's "seamless" grounds still show a faint tone step where the tiles meet (plaster: 3.3 levels across the edge
    vs 1.8 between neighbouring rows). The texture rolled by half (its edges then meet its own middle, which is
    continuous) is blended in towards the edges, the original kept in the middle — pixels re-used, nothing drawn."""
    a = np.asarray(im.convert("RGB")).astype(np.float32)
    h, w = a.shape[:2]
    for axis, n in ((0, h), (1, w)):
        rolled = np.roll(a, n // 2, axis=axis)
        t = np.abs(np.arange(n) - (n - 1) / 2) / ((n - 1) / 2)          # 0 in the middle, 1 at the edges
        wgt = np.clip((t - .55) / .4, 0, 1)
        wgt = wgt * wgt * (3 - 2 * wgt)
        wgt = wgt[:, None, None] if axis == 0 else wgt[None, :, None]
        a = a * (1 - wgt) + rolled * wgt
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGB")


def place(inner, outer):
    """The box `inner` (x0, y0, x1, y1 px) in % of the box `outer`: [left, top, width, height]."""
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def ring_of(a: np.ndarray, y_from: int, x_from: int):
    """The bounding box (x0, y0, x1, y1) of the first run of rows at/after y_from that has alpha right of x_from:
    the cord's jump ring (its right end hangs alone on that side)."""
    m = a > 60
    ys = []
    for y in range(y_from, m.shape[0]):
        if m[y, x_from:].any():
            if ys and y != ys[-1] + 1:
                break
            ys.append(y)
        elif ys:
            break
    sub = m[ys[0]:ys[-1] + 1, x_from:]
    _, xx = np.nonzero(sub)
    return (int(xx.min() + x_from), int(ys[0]), int(xx.max() + 1 + x_from), int(ys[-1] + 1))


def lantern_ring(a: np.ndarray):
    """The lantern's hanging ring: from the top row down to the narrowest waist under it (the ring's neck before the
    cap widens) — (centre x, top y, ring height) in px of the cut lantern."""
    m = a > 60
    widths = m.sum(1)
    top = int(np.nonzero(widths)[0][0])
    span = range(top + 8, top + int(.25 * m.shape[0]))
    waist = min(span, key=lambda y: widths[y])
    cols = np.nonzero(m[top:waist].any(0))[0]
    return (float(cols.min() + cols.max() + 1) / 2, top, waist - top)


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — a composition check (--still)."""
    w = round(h * stage["aspect"])
    pad = round(h * .1)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (150, 150, 150, 255))
    for key in ("back", "front", "flap", "stud", "cord", "lantern"):
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

    plaster = seam_soften(Image.open(PARTS / "tadelakt_ground.png"))
    paper = seam_soften(Image.open(PARTS / "cotton_paper.png"))
    tb.webp(plaster, "plaster", [640, 1024], 70, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 72, manifest, out=OUT)
    tb.webp(Image.open(PARTS / "zellige_tile.png").convert("RGB"), "zellige", [320], 80, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and flap span its width; stud and cord by their box
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"), ("stud", "stud"),
                                   ("cord", "cord"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    front = place(boxes["front"], bx)
    flap = place(boxes["flap"], bx)
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, flap[1], 100, flap[3]],
        "stud": place(boxes["stud"], bx),
        "cord": place(boxes["cord"], bx),
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    # the stud rides on the flap (it lifts with it): its box in % of the flap box as well
    fx = (bx[0], boxes["flap"][1], bx[2], boxes["flap"][3])
    stage["stud_on_flap"] = place(boxes["stud"], fx)
    # the cord's loop sits round the stud: the closure turns round the stud's centre
    sx0, sy0, sx1, sy1 = boxes["stud"]
    stage["pivot"] = [r2(100 * ((sx0 + sx1) / 2 - bx[0]) / bw), r2(100 * ((sy0 + sy1) / 2 - bx[1]) / bh)]

    # the lantern pair: one shared box (unlit ∪ lit), scaled to LANTERN_H % of the envelope's height, its hanging ring
    # hooked into the cord's jump ring (the lantern ring's top at the jump ring's inner bottom)
    off, on = part("lantern_unlit"), part("lantern_lit")
    lb = [min(a, b) if i < 2 else max(a, b) for i, (a, b) in enumerate(zip(box(off), box(on)))]
    off, on = off.crop(lb), on.crop(lb)
    lcx, ltop, lring = lantern_ring(np.asarray(off)[..., 3])
    jr = ring_of(np.asarray(raw["cord"])[..., 3], y_from=int(bx[1] + .70 * bh), x_from=int(boxes["stud"][2]) - 20)
    jr_thick = max(4, round((jr[2] - jr[0]) * .16))
    scale = (LANTERN_H / 100 * bh) / off.height          # canvas px per lantern px
    lw, lh = off.width * scale, off.height * scale
    hook_x = (jr[0] + jr[2]) / 2
    hook_y = jr[3] - jr_thick                              # the jump ring's inner bottom (canvas px)
    lx0 = hook_x - lcx * scale
    ly0 = hook_y - ltop * scale
    stage["lantern"] = place((lx0, ly0, lx0 + lw, ly0 + lh), bx)
    stage["jump_ring"] = place(jr, bx)
    layers["lantern"] = off

    # the card: CARD_W % of the envelope's width, its own ratio, CARD_TOP from the top (behind the flap and the pocket)
    card = trim(part("card_small"))
    ch = CARD_W * card.height / card.width * bw / bh
    stage["card"] = [r2(50 - CARD_W / 2), CARD_TOP, CARD_W, r2(ch)]
    stage["card_ratio"] = round(card.width / card.height, 4)
    flap_in = trim(part("flap_in"))
    stage["flap_in_ratio"] = round(flap_in.width / flap_in.height, 4)
    stage["flap_ratio"] = round(layers["flap"].width / layers["flap"].height, 4)
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width at their measured height; stud, cord by their own box on the same canvas "
                      "(stud_on_flap = the stud in % of the flap, it lifts with it); pivot = the stud's centre (the "
                      "closure turns round it); the lantern pair hangs from the cord's jump ring (LANTERN_H % of the "
                      "height); the card is CARD_W % wide, CARD_TOP from the top")
    for k in ("back", "front", "flap"):
        tb.webp(layers[k], k, [720], 82, manifest, out=OUT)
    tb.webp(layers["stud"], "stud", [160], 88, manifest, out=OUT)
    tb.webp(layers["cord"], "cord", [240], 86, manifest, out=OUT)
    tb.webp(off, "lantern-off", [240], 88, manifest, out=OUT)
    tb.webp(on, "lantern-on", [240], 88, manifest, out=OUT)
    manifest["lantern"] = {"src_box": lb, "ratio": round(off.width / off.height, 5),
                           "ring": {"cx_pct": r2(100 * lcx / off.width), "top_pct": r2(100 * ltop / off.height),
                                    "h_pct": r2(100 * lring / off.height)}}
    tb.webp(flap_in, "flap_in", [720], 82, manifest, out=OUT)
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    manifest["stage"] = stage

    # the frames: window measured (green rim + the transparent hole it encloses); the two arches get a mask
    for src, name, width, mask in (("arch_frame", "arch", 720, True), ("story_frame", "storyarch", 720, True),
                                   ("venue_frame", "venue", 1100, False)):
        keyed, win, wmask = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        W, H = keyed.size
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(W * win[2] / 100), round(H * win[3] / 100)]
        L, T, Wp, Hp = [r2(v) for v in win]
        slot = [r2(L - SLOT_PAD), r2(T - SLOT_PAD), r2(Wp + 2 * SLOT_PAD), r2(Hp + 2 * SLOT_PAD)]
        manifest[name]["slot_pct"] = slot
        if mask:
            sp = (round(W * slot[0] / 100), round(H * slot[1] / 100), round(W * (slot[0] + slot[2]) / 100),
                  round(H * (slot[1] + slot[3]) / 100))
            m = window_mask(wmask, sp, 360)
            m.save(OUT / f"{name}-mask.png", optimize=True)
            # the window really is an arch: its top corners are outside it (a rectangle would show the photo there)
            a = np.asarray(m)[..., 1]
            manifest[name]["mask"] = {"file": f"{name}-mask.png", "size": list(m.size), "slot_px": list(sp),
                                      "corner_alpha": int(max(a[3, 3], a[3, -4])),
                                      "centre_alpha": int(a[a.shape[0] // 2, a.shape[1] // 2]),
                                      "coverage_pct": r2(100 * (a > 127).mean())}

    for src, name, width, q in (("corner_spray", "spray", 720, 82), ("divider", "divider", 1000, 84),
                                ("hanging_lantern", "hanglamp", 240, 86), ("accent_1", "bract", 160, 86),
                                ("accent_2", "blossom", 160, 86), ("accent_3", "star", 160, 88)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("arch", "arch"), ("story", "storyarch"), ("wide", "venue")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(plaster, (0, 0, plaster.width, plaster.height), w / h, w=640, ton=PH_TONE, karisim=.4,
                           bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("arch")}, "story_1": {"aspect": aspect("storyarch")},
                               "story_2": {"aspect": aspect("storyarch")}, "story_3": {"aspect": aspect("storyarch")},
                               "venue": {"aspect": aspect("venue")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(on)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the lit brass lantern charm"}
    if "--still" in sys.argv:
        envelope_still(layers, stage, 600).save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G427 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    # the green check covers the keyed frames (the spray's orange leaves are a natural green, never a #00FF00 window)
    keyed_files = [f["file"] for n in ("arch", "storyarch", "venue") for f in manifest[n]["files"]]
    manifest["checks"] = {"green": {f: n for f, n in tb.yesil_denetle(OUT).items() if f in keyed_files},
                          "green_scope": keyed_files}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 30}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "front", "flap", "stud", "stud_on_flap", "cord", "pivot", "lantern",
                                            "jump_ring", "card", "flap_in_ratio", "flap_ratio", "card_ratio")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"], manifest[n].get("mask")) for n in
           ("arch", "storyarch", "venue")})
    print(f"riad-lantern-nights: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: "
          f"{manifest['checks']['green']} (all files: {tb.yesil_denetle(OUT)})")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in the keyed frames", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
