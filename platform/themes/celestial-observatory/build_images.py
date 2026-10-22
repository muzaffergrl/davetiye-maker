#!/usr/bin/env python3
"""Celestial Observatory (29) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G429.

Redesign of 2026-10-22 (docs/35): every picture is the design's own PAKET 5R part
(collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  night_paper (W1)        night-640/1024      midnight-blue cotton paper with a faint engraved star chart (page ground)
  chart_paper (W2)        chart-640/1024      silver-ivory chart paper: cards, the day band, the reply form
  env_back (W3)           back-720            the portrait envelope's back with its antique star-atlas lining (the envelope box)
  env_front (W4)          front-720           the front pocket with its half-circle dome window (the card rises from behind it)
  flap (W5)               flap-720            the half-circle dome flap, outside (gold-foil constellation engraving)
  flap_in (W6)            flap_in-720         the flap's inside: the observatory dome (stands up once the flap is open)
  astro_plate (W7)        plate-480           the brass astrolabe's mater (fixed)
  astro_rete (W8)         rete-480            the lace-like rete; cut to a square round its own circle so it turns about it
  card_small (W9)         card-720            the chart-paper card that rises from the envelope
  medallion_frame (W10)   medallion-720       the gilded celestial medallion round the portrait; round window measured
  planisphere_frame (W11) plani-720           the brass planisphere ring (story, story teaser); round window measured
  planisphere_dial (W12)  dial-720            its turning dial ring, cut to a square round its own circle
  venue_frame (W13)       venue-1100          the brass-framed star-chart panel (venue); window measured
  corner_ornament (W14)   corner-640          gold constellation arcs and a crescent (cover corner, home card corners)
  divider (W15)           divider-1000        seven gold moon phases (section dividers)
  telescope (W16)         telescope-480       the small brass telescope of the signature
  accent_1..3 (W17)       star/moon/dust      the gold stars that light up, the drifting crescent, the rising star dust
  web_hero (W18)          og-1200x630.jpg     share image (tema_build.og_kirp, bottom-aligned)

GPT drift absorbed (measured here, never redrawn):
- The envelope layers share one canvas but drifted: the pocket rises ~1 % above the back and ends ~1.7 % short of its
  bottom; the flap is 3.7 % wider than the back and its hinge sits 43 px below the back's top edge. Each layer is cut to
  its own alpha box and laid in the envelope box (the back's): the pocket spans it; the flap is scaled uniformly to its
  width with the hinge on the top edge (its half circle keeps its shape) — manifest `stage`, the numbers site.css uses.
  The closed still is checked for lining showing between the pocket's cut and the flap (`checks.closed_gap_px`).
- The rete's circle sits 54 px above the plate's disc and is drawn 96 % of its size (over the tick ring): both are fitted
  as circles (least squares on the alpha outline); the rete is cut to a square round its own centre (so a CSS rotation
  turns it exactly about the pin) and scaled to sit inside the limb, centred on the plate's disc.
- The dial ring and the planisphere frame: the same circle fit, the dial's square centred on the frame's circle.
- Photo windows: GPT left a green rim round a half-transparent middle; the window = the green pixels plus everything they
  enclose (PIL flood fill, no scipy), cleared, the green spill round it neutralised. The round windows are clipped with
  border-radius:50% in CSS.

  python3 platform/themes/celestial-observatory/build_images.py [--still out.png]
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

COL = ROOT / "collections/29_Celestial_Observatory"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (232, 227, 214)        # placeholder tone (softened chart paper)
REQUIRED = ["night_paper", "chart_paper", "env_back", "env_front", "flap", "flap_in", "astro_plate", "astro_rete",
            "card_small", "medallion_frame", "planisphere_frame", "planisphere_dial", "venue_frame", "corner_ornament",
            "divider", "telescope", "accent_1", "accent_2", "accent_3", "web_hero"]
DISC_W = 28 / 86 * 100           # the astrolabe disc: 28 % of the envelope canvas = % of the envelope width (prompt W7)
DISC_UP = 1.7                    # its centre sits this many % (of the envelope height) above the flap's tip
RETE_IN = 0.86                   # the rete's ring inside the limb: × the plate disc's radius (prompt: Ø 60 % / Ø 70 %)
CARD_W = 64.0                    # the card: % of the envelope width (stays inside the pocket)


def part(ad: str) -> Image.Image:
    return Image.open(PARTS / f"{ad}.png").convert("RGBA")


def box(im: Image.Image, esik: int = 8):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def trim(im: Image.Image, esik: int = 8) -> Image.Image:
    k = box(im, esik)
    return im.crop(k) if k else im


def r2(v: float) -> float:
    return round(float(v), 2)


def circle(im: Image.Image, min_w: float = .35):
    """Least-squares circle through the left/right alpha edges of every row wider than min_w × the widest row (the
    astrolabe's throne and ring stay out of the fit). → (cx, cy, r) px."""
    a = np.asarray(im)[..., 3] > 60
    rows = [(y, np.nonzero(a[y])[0]) for y in range(a.shape[0])]
    widths = np.array([xs.max() - xs.min() + 1 if len(xs) else 0 for _, xs in rows])
    keep = [(y, xs) for y, xs in rows if len(xs) and widths[y] > min_w * widths.max()]
    p = np.array([(xs.min(), y) for y, xs in keep] + [(xs.max(), y) for y, xs in keep], float)
    A = np.c_[2 * p[:, 0], 2 * p[:, 1], np.ones(len(p))]
    x0, y0, c = np.linalg.lstsq(A, (p ** 2).sum(1), rcond=None)[0]
    return float(x0), float(y0), float(np.sqrt(c + x0 ** 2 + y0 ** 2))


def square(im: Image.Image, cx: float, cy: float, half: float) -> Image.Image:
    """A square cut centred on (cx, cy): its centre is the rotation centre in CSS (transform-origin 50% 50%)."""
    return im.crop((round(cx - half), round(cy - half), round(cx + half), round(cy + half)))


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
    """The photo window of a framed part: the green rim with everything it encloses, grown 2 px and cleared; the green
    spill in a 12 px ring round it is neutralised. (RGBA, window box (L, T, W, H) % of the image) or (im, None)."""
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


def astrolabe(plate: Image.Image, rete: Image.Image, pc, half: float, k: float) -> Image.Image:
    """The closed astrolabe (rete on the plate) at the build's alignment — for the favicon."""
    r = rete.resize((round(rete.width * k), round(rete.height * k)), Image.LANCZOS)
    out = plate.copy()
    out.alpha_composite(r, (round(pc[0] - half * k), round(pc[1] - half * k)))
    return out


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed pocket + flap as the index page shows them — for the gap check (and a composition check)."""
    w = round(h * stage["aspect"])
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for key in ("front", "flap"):
        L, T, W, H = stage[key]
        im = layers[key].resize((max(1, round(w * W / 100)), max(1, round(h * H / 100))), Image.LANCZOS)
        canvas.alpha_composite(im, (round(w * L / 100), round(h * T / 100)))
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

    night = Image.open(PARTS / "night_paper.png").convert("RGB")
    chart = Image.open(PARTS / "chart_paper.png").convert("RGB")
    tb.webp(night, "night", [640, 1024], 70, manifest, out=OUT)
    tb.webp(chart, "chart", [640, 1024], 74, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; the pocket spans it; the flap is scaled to its width with
    # its hinge on the top edge
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    fb = boxes["flap"]
    flap_h = r2(100 * (fb[3] - fb[1]) * bw / (fb[2] - fb[0]) / bh)
    stage = {"aspect": round(bw / bh, 4), "back": [0, 0, 100, 100], "front": [0, 0, 100, 100], "flap": [0, 0, 100, flap_h]}
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    # the pocket's dome window: its deepest point (centre column) in % of the envelope height
    fa = np.asarray(layers["front"])[..., 3] > 60
    col = fa[:, fa.shape[1] // 2]
    stage["cut"] = r2(100 * int(np.argmax(col)) / fa.shape[0])
    flap_in = trim(part("flap_in"))
    stage["flap_in_ratio"] = round(flap_in.width / flap_in.height, 4)
    stage["flap_in_h"] = r2(100 / stage["flap_in_ratio"] * bw / bh)     # % of the envelope height, as wide as it

    # the astrolabe: the plate's disc and the rete's ring fitted as circles; the rete cut square round its own centre
    plate = trim(part("astro_plate"))
    pc = circle(plate)
    rete_src = part("astro_rete")
    rc = circle(rete_src)
    rk = box(rete_src)
    half = max(rc[0] - rk[0], rk[2] - rc[0], rc[1] - rk[1], rk[3] - rc[1]) + 4
    rete = square(rete_src, rc[0], rc[1], half)
    k = RETE_IN * pc[2] / rc[2]
    plate_w = r2(DISC_W * plate.width / (2 * pc[2]))                           # % of the envelope width
    plate_h = r2(plate_w * bw / bh * plate.height / plate.width)               # % of the envelope height
    cy = flap_h - DISC_UP
    stage["astro"] = [r2(50 - plate_w * pc[0] / plate.width), r2(cy - plate_h * pc[1] / plate.height), plate_w, plate_h]
    side = 2 * half * k
    stage["rete"] = [r2(100 * (pc[0] - side / 2) / plate.width), r2(100 * (pc[1] - side / 2) / plate.height),
                     r2(100 * side / plate.width), r2(100 * side / plate.height)]
    stage["disc"] = [r2(100 * pc[0] / plate.width), r2(100 * pc[1] / plate.height)]
    stage["circles"] = {"plate_disc": [r2(v) for v in pc], "rete_ring_src": [r2(v) for v in rc], "rete_scale": r2(k)}

    # the card: just under the dome window's deepest point, 64 % of the envelope width
    card = trim(part("card_small"))
    stage["card_ratio"] = round(card.width / card.height, 4)
    card_h = r2(CARD_W * bw / bh / stage["card_ratio"])
    stage["card"] = [r2(50 - CARD_W / 2), r2(stage["cut"] + 1), CARD_W, card_h]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; the "
                      "pocket spans it; the flap is scaled uniformly to its width, hinge on the top edge; flap_in_h = the "
                      "open dome's height (as wide as the envelope); cut = the dome window's deepest point; the "
                      "astrolabe's disc centre sits DISC_UP above the flap's tip; rete = % of the astrolabe box (a square "
                      "round the rete's own circle, centred on the disc); disc = the disc centre in % of the astrolabe box")
    if stage["card"][1] + card_h > 99:
        print(f"ERROR: the card leaves the pocket ({stage['card'][1] + card_h:.1f} %)", file=sys.stderr)
        return 1

    still = envelope_still(layers, stage, 700)
    a = np.asarray(still)[..., 3]
    gap = int((a[3: round(700 * stage["cut"] / 100) + 4, 6:-6] < 200).sum())   # lining showing above the cut, closed
    for k2 in ("back", "front", "flap"):
        tb.webp(layers[k2], k2, [720], 82, manifest, out=OUT)
    tb.webp(flap_in, "flap_in", [720], 82, manifest, out=OUT)
    tb.webp(plate, "plate", [480], 86, manifest, out=OUT)
    tb.webp(rete, "rete", [480], 88, manifest, out=OUT)
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    manifest["stage"] = stage

    # the frames: window measured (green rim + the hole it encloses)
    for src, name, width in (("medallion_frame", "medallion", 720), ("planisphere_frame", "plani", 720),
                             ("venue_frame", "venue", 1100)):
        keyed, win = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]
    # the dial ring: a square round its own circle, centred on the planisphere frame's circle
    frame_src = part("planisphere_frame")
    fk, fc = box(frame_src), circle(frame_src)
    dial_src = part("planisphere_dial")
    dc, dk = circle(dial_src), box(dial_src)
    dh = max(dc[0] - dk[0], dk[2] - dc[0], dc[1] - dk[1], dk[3] - dc[1]) + 4
    tb.webp(square(dial_src, dc[0], dc[1], dh), "dial", [720], 86, manifest, out=OUT)
    manifest["dial"]["box_pct"] = place((fc[0] - dh, fc[1] - dh, fc[0] + dh, fc[1] + dh), fk)
    manifest["dial"]["circles"] = {"frame": [r2(v) for v in fc], "dial": [r2(v) for v in dc]}

    for src, name, width, q in (("corner_ornament", "corner", 640, 84), ("divider", "divider", 1000, 84),
                                ("telescope", "telescope", 480, 84), ("accent_1", "star", 160, 86),
                                ("accent_2", "moon", 160, 86), ("accent_3", "dust", 200, 88)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("round", "medallion"), ("plani", "plani"), ("wide", "venue")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(chart, (0, 0, chart.width, chart.height), w / h, w=640, ton=PH_TONE, karisim=.35, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("medallion")}, "story_1": {"aspect": aspect("plani")},
                               "story_2": {"aspect": aspect("plani")}, "story_3": {"aspect": aspect("plani")},
                               "venue": {"aspect": aspect("venue")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(astrolabe(plate, rete, pc, half, k))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the brass astrolabe (plate + rete)"}
    if "--still" in sys.argv:
        still.save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G429 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT), "closed_gap_px": gap}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "flap", "cut", "flap_in_h", "astro", "rete", "disc", "card")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("medallion", "plani", "venue")},
          "dial", manifest["dial"]["box_pct"], manifest["dial"]["src_size"])
    print(f"celestial-observatory: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: "
          f"{manifest['checks']['green']}, closed gap {gap} px")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
