#!/usr/bin/env python3
"""Monochrome Darkroom (47) — GPT sources → img/ (docs/11 §5.4, docs/34; tools/tema_build.py). Task G447.

Every picture is the design's own PAKET 5 part (collections/47_Monochrome_Darkroom/assets/gpt/GPT_PROMPTS.md), cut,
keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  black_paper (W1)    black-640/1024        matte black photographic paper: the page ground
  fiber_paper (W2)    fiber-640/1024        warm white fibre paper: cards, bands, the reply form
  env_back (W3)       back-720              the open light-tight black paper envelope's back (the envelope box)
  env_front (W4)      front-720             the front pocket (the flap's tongue is tucked behind it)
  flap (W5)           flap-720              the tuck flap, outside (it comes out of the pocket and swings up on its top edge)
  flap_in (W6)        flap_in-720           the flap's inside, shown once it is open
  film_curl (W7)      curl-480              the loose loop of 35 mm negative coming out where the flap tucks in
  film_tile (W8)      frame-640             one 35 mm negative frame (they join end to end); window measured
  tray (W9)           tray-720              the developing tray the card appears in during the opening
  card_small (W10)    card-720              the white card that rises from the envelope
  fiber_print (W11)   print-720             the glossy fibre print round a portrait (hero, story); window measured
  fiber_wide (W12)    print_wide-1100       the wide fibre print (venue); window measured
  loupe (W13)         loupe-480             the photographer's loupe over the contact strip (its lens is clear)
  anemones (W14)      anemones-720          white anemones with a black satin ribbon (corners of the home card)
  canister (W15)      canister-360          the film canister (signature)
  divider (W16)       divider-1200          a short strip of negative (section dividers)
  accent_1, accent_2  accent_1-160, _2-160  an anemone petal, a curl of film (the reply's confetti)
  web_hero (W18)      og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5, W7) share one canvas (GPT gave the back one row more); each is cut to its own alpha
box and laid in the envelope box (the back's alpha box) by its measured edges, in % of each canvas — manifest `stage`,
the numbers site.css uses (tests/theme-monochrome-darkroom.test.ts compares them). Photo windows: GPT left only a green
rim round an already transparent inside (the prints) or a full green window (the film frame); the whole measured
rectangle is cleared and the green spill round it removed.

  python3 platform/themes/monochrome-darkroom/build_images.py
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

COL = ROOT / "collections/47_Monochrome_Darkroom"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (226, 224, 220)        # placeholder tone (cool fibre white)
REQUIRED = ["black_paper", "fiber_paper", "env_back", "env_front", "flap", "flap_in", "film_curl", "film_tile", "tray",
            "card_small", "fiber_print", "fiber_wide", "loupe", "anemones", "canister", "divider", "accent_1", "accent_2",
            "web_hero"]


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
    """The box `inner` (x0, y0, x1, y1, any unit) in % of the box `outer`: [left, top, width, height]."""
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def pbox(im: Image.Image):
    """The alpha box in % of its own canvas (the envelope layers' canvases differ by a pixel row)."""
    x0, y0, x1, y1 = box(im)
    return (100 * x0 / im.width, 100 * y0 / im.height, 100 * x1 / im.width, 100 * y1 / im.height)


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — a sanity check that every layer composes."""
    w = round(h * stage["aspect"])
    pad = round(h * .2)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    for key in ("back", "flap", "front", "curl"):
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

    black = Image.open(PARTS / "black_paper.png").convert("RGB")
    fiber = Image.open(PARTS / "fiber_paper.png").convert("RGB")
    tb.webp(black, "black", [640, 1024], 74, manifest, out=OUT)
    tb.webp(fiber, "fiber", [640, 1024], 76, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and flap span its width; the film loop by its box
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"), ("curl", "film_curl"))}
    pb = {k: pbox(v) for k, v in raw.items()}
    bx = pb["back"]
    back_px = box(raw["back"])
    front = place(pb["front"], bx)
    flap = place(pb["flap"], bx)
    stage = {
        "aspect": round((back_px[2] - back_px[0]) / (back_px[3] - back_px[1]), 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, r2(flap[1] + flap[3])],
        "curl": place(pb["curl"], bx),
    }
    layers = {k: raw[k].crop(box(raw[k])) for k in raw}
    card = trim(part("card_small"))
    ratio = card.width / card.height
    cw = 82.0                                                      # % of the envelope width
    ch = r2(cw * stage["aspect"] / ratio)
    stage["card"] = [r2(50 - cw / 2), r2(100 - ch - 3), cw, ch]
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and flap span its width (the flap's tongue runs on behind the pocket), the film loop by its box "
                      "on the shared canvas, the card in the pocket")
    for k, name in (("back", "back"), ("front", "front"), ("flap", "flap")):
        tb.webp(layers[k], name, [720], 82, manifest, out=OUT)
    tb.webp(layers["curl"], "curl", [480], 84, manifest, out=OUT)
    tb.webp(trim(part("flap_in")), "flap_in", [720], 82, manifest, out=OUT)
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    tb.webp(trim(part("tray")), "tray", [720], 82, manifest, out=OUT)
    manifest["stage"] = stage

    # the framed parts: window measured (prints: a green rim round a clear inside; the film frame: a full green window)
    for src, name, width in (("fiber_print", "print", 720), ("fiber_wide", "print_wide", 1100), ("film_tile", "frame", 640)):
        im = part(src)
        keyed, win = keyed_window(im.crop(box(im)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("loupe", "loupe", 480, 86), ("anemones", "anemones", 720, 82), ("canister", "canister", 360, 86),
                                ("divider", "divider", 1200, 84), ("accent_1", "accent_1", 160, 86), ("accent_2", "accent_2", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("portrait", "print"), ("wide", "print_wide"), ("frame", "frame")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(fiber, (0, 0, fiber.width, fiber.height), w / h, w=640, ton=PH_TONE, karisim=.45, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("print")}, "story_1": {"aspect": aspect("print")},
                               "story_2": {"aspect": aspect("print")}, "story_3": {"aspect": aspect("print")},
                               "venue": {"aspect": aspect("print_wide")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(trim(part("canister")))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the film canister"}
    envelope_still(layers, stage, 400)  # sanity: every layer composes

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G447 build from the design's own PAKET 5 parts (all present). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in stage if not k.startswith("_")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("print", "print_wide", "frame")})
    print({n: manifest[n]["files"][0]["file"] for n in manifest if isinstance(manifest[n], dict) and "files" in manifest[n]})
    print(f"monochrome-darkroom: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
