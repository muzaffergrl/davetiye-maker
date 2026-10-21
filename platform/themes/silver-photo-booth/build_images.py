#!/usr/bin/env python3
"""Silver Photo Booth (39) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Pilot of the fourth wave (G439).

Every picture is the design's own PAKET 5 part (collections/39_Silver_Photo_Booth/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  page_ground (W1)    satin-640/1024        the pearl-grey satin booth backdrop: every page's ground
  ivory_paper (W2)    paper-640/1024        cards, bands, the reply form
  env_back (W3)       back-720              the open envelope's back with its black star-dust lining (the envelope box)
  env_front (W4)      front-720             the front pocket (the card rises from behind it)
  flap (W5)           flap-720              the deep U flap, outside (closed; it swings up on its top edge)
  flap_in (W6)        flap_in-720           the flap's inside (black star dust), shown once it is open
  strip_band (W7)     band-360              the photo strip that wraps the closed envelope (its three frames are blank
                                            photo paper: the couple's photos are set in them, measured → manifest band)
  strip_tile (W8)     tile-480              one frame of a booth strip; #00FF00 window keyed and measured
  booth_slot (W9)     slot-900              the chrome slot the strips print out of
  booth_frame (W10)   booth-720             the chrome booth window round a portrait (hero, story); window measured
  print_wide (W11)    print_wide-1100       the deckled print with silver photo corners (venue); window measured
  card_small (W12)    card-720              the ivory card that rises from the envelope
  corner_spray (W13)  spray-720             ranunculus + dusty miller (home card corners, signature)
  divider (W14)       divider-1200          a strand of silver star sequins (section dividers)
  flashbulb (W15)     bulb-200              the flashbulb that fires at the tap and on a reply
  accent_1..3 (W16)   accent_N-160          star sequin, ranunculus petal, satin ribbon curl (the reply's shower)
  web_hero (W17)      og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The four envelope layers (W3, W4, W5, W7) were asked on one canvas in one box; GPT drifts a few per cent between them, so
each is cut to its own alpha box and laid in the envelope box (the back's alpha box) by its measured edges: pocket and
flap span the full width, the band is centred. The numbers go to manifest `stage` and are the ones site.css uses
(tests/theme-silver-photo-booth.test.ts compares them). Photo windows: the GPT left the inside of most windows already
transparent with a soft green rim; the whole measured window rectangle is cleared and the green spill round it removed.

  python3 platform/themes/silver-photo-booth/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/39_Silver_Photo_Booth"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

IVORY = (245, 240, 230)          # --ivory  #F5F0E6
PEARL = (213, 214, 216)          # --pearl  #D5D6D8
PH_TONE = (226, 224, 220)        # placeholder tone (soft pearl ivory)
REQUIRED = ["page_ground", "ivory_paper", "env_back", "env_front", "flap", "flap_in", "strip_band", "strip_tile",
            "booth_slot", "booth_frame", "print_wide", "card_small", "corner_spray", "divider", "flashbulb",
            "accent_1", "accent_2", "accent_3", "web_hero"]


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
    """The photo window of a framed part: the box of its #00FF00 pixels (GPT's green is ≈ (3, 252, 45)); the whole box
    (+2 px) is made transparent — the GPT often left the inside already clear with a soft green rim — and the green
    spill in a 10 px ring round it is neutralised (green channel → the mean of red and blue). Returns (RGBA, window as
    (L, T, W, H) % of the image) or (im, None)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 140) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 70) & (c[..., 3] > 60)
    ys, xs = np.nonzero(green)
    if len(ys) < 256:
        return im, None
    h, w = c.shape[:2]
    # the rectangle the green rim outlines (robust to a few stray green pixels: 0.5–99.5 percentiles)
    x0, x1 = int(np.percentile(xs, .5)), int(np.percentile(xs, 99.5)) + 1
    y0, y1 = int(np.percentile(ys, .5)), int(np.percentile(ys, 99.5)) + 1
    c[max(0, y0 - 2):y1 + 2, max(0, x0 - 2):x1 + 2, 3] = 0
    ring = np.zeros((h, w), bool)
    ring[max(0, y0 - 12):y1 + 12, max(0, x0 - 12):x1 + 12] = True
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h)


def runs(v: np.ndarray, min_len: int):
    """[(start, end)] of the True runs of a 1-D array that are at least min_len long."""
    out, s = [], None
    for i, x in enumerate(list(v) + [False]):
        if x and s is None:
            s = i
        elif not x and s is not None:
            if i - s >= min_len:
                out.append((s, i))
            s = None
    return out


def band_frames(band: Image.Image):
    """The three blank frames of the strip band (flat light-grey photo paper, asked #D9D9D9): % of the band's box."""
    c = np.asarray(band).astype(np.int16)
    rgb = c[..., :3]
    grey = (c[..., 3] > 200) & (np.ptp(rgb, axis=2) < 16) & (rgb.mean(axis=2) > 178) & (rgb.mean(axis=2) < 232)
    h, w = grey.shape
    cols = runs(grey.mean(axis=0) > .35, max(4, w // 8))
    if not cols:
        return []
    cx0, cx1 = max(cols, key=lambda r: r[1] - r[0])
    rows = runs(grey[:, cx0:cx1].mean(axis=1) > .6, max(4, h // 12))
    return [[r2(100 * cx0 / w), r2(100 * y0 / h), r2(100 * (cx1 - cx0) / w), r2(100 * (y1 - y0) / h)] for y0, y1 in rows]


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it (back, pocket, flap, band) — for the favicon."""
    w = round(h * stage["aspect"])
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for key in ("back", "front", "flap", "band"):
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

    satin = Image.open(PARTS / "page_ground.png").convert("RGB")
    paper = Image.open(PARTS / "ivory_paper.png").convert("RGB")
    tb.webp(satin, "satin", [640, 1024], 74, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; the other layers by their measured edges in it
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"), ("band", "strip_band"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx0, by0, bx1, by1 = boxes["back"]
    bw, bh = bx1 - bx0, by1 - by0
    fx0, fy0, fx1, fy1 = boxes["front"]
    lx0, ly0, lx1, ly1 = boxes["flap"]
    sx0, sy0, sx1, sy1 = boxes["band"]
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, r2(100 * (fy0 - by0) / bh), 100, r2(100 - 100 * (fy0 - by0) / bh)],
        "flap": [0, 0, 100, r2(100 * (ly1 - by0) / bh)],
        "band": [r2(50 - 50 * (sx1 - sx0) / bw), r2(100 * (sy0 - by0) / bh), r2(100 * (sx1 - sx0) / bw),
                 r2(100 * (sy1 - sy0) / bh)],
        "_note": "% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket and "
                 "flap span its width, the band is centred (GPT drift between the same-canvas layers absorbed here); "
                 "under = the envelope paper behind the closed flap down to just below the pocket's top edge",
    }
    stage["under"] = [0, 0, 100, r2(stage["front"][1] + 6)]
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    tb.webp(layers["back"], "back", [720], 82, manifest, out=OUT)
    tb.webp(layers["front"], "front", [720], 82, manifest, out=OUT)
    tb.webp(layers["flap"], "flap", [720], 82, manifest, out=OUT)
    tb.webp(layers["band"], "band", [360], 84, manifest, out=OUT)
    # the envelope's own paper (a plain crop of the pocket, between its fold lines): under the flap while it is closed,
    # where GPT's U flap leaves the black lining showing at the two upper corners (manifest stage.under)
    fw, fh = layers["front"].size
    tb.webp(layers["front"].crop((round(fw * .3), round(fh * .45), round(fw * .7), round(fh * .75))).convert("RGB"),
            "envpaper", [320], 78, manifest, out=OUT)
    stage["band_frames"] = band_frames(layers["band"])
    if len(stage["band_frames"]) != 3:
        print(f"ERROR strip_band.png: {len(stage['band_frames'])} blank frames found, 3 expected", file=sys.stderr)
        return 1
    flap_in = trim(part("flap_in"))
    tb.webp(flap_in, "flap_in", [720], 82, manifest, out=OUT)
    card = trim(part("card_small"))
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    stage["card_ratio"] = round(card.width / card.height, 4)
    manifest["stage"] = stage

    # framed parts: window measured (manifest <name>.window_pct → site.css puts the photo there)
    for src, name, width in (("strip_tile", "tile", 480), ("booth_frame", "booth", 720), ("print_wide", "print_wide", 1100)):
        keyed, win = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("booth_slot", "slot", 900, 84), ("corner_spray", "spray", 720, 82),
                                ("divider", "divider", 1200, 84), ("flashbulb", "bulb", 200, 86),
                                ("accent_1", "accent_1", 160, 86), ("accent_2", "accent_2", 160, 86),
                                ("accent_3", "accent_3", 160, 86)):
        im = trim(part(src))
        tb.webp(im, name, [width], q, manifest, out=OUT)

    # placeholders (soft pearl satin), one per window shape
    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("portrait", "booth"), ("tile", "tile"), ("wide", "print_wide")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(satin, (0, 0, satin.width, satin.height), w / h, w=640, ton=PH_TONE, karisim=.45, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("booth")}, "story_1": {"aspect": aspect("booth")},
                               "story_2": {"aspect": aspect("booth")}, "story_3": {"aspect": aspect("booth")},
                               "venue": {"aspect": aspect("print_wide")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(envelope_still(layers, stage, 400))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G439 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    # a light ground: theme-check's default backdrop profile applies
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "front", "flap", "band", "band_frames", "card_ratio")}, indent=1))
    print({n: manifest[n]["window_pct"] for n in ("tile", "booth", "print_wide")})
    print(f"silver-photo-booth: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
