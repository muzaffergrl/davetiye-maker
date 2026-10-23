#!/usr/bin/env python3
"""Music Box Ballerina (32) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G432.

Redesign of 2026-10-22 (docs/35 row 32, pilot G423): every picture is the design's own PAKET 5R part
(collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  page_ground (W1)      satin-640/1024        the pale blush silk satin page ground
  card_paper (W2)       paper-640/1024        cream cotton card: cards, bands, the reply form
  env_back (W3)         back-720              the rose-quartz satin envelope's back with its quilted blush lining (the box)
  env_front (W4)        front-720             the front pocket with its gilt corner mounts (card and ballerina rise behind it)
  flap (W5)             flap-720              the serpentine music-box lid, outside (closed; it swings up on its top edge)
  flap_in (W6)          flap_in-720           the lid's inside: rose-gold mirror satin with an oval mirror (window measured;
                                              the couple's portrait shows in it once the lid stands open)
  escutcheon (W7)       esc-240               the filigree keyhole plate hanging from the lid's tip (rises with the lid)
  key (W8)              key-320               the brass winding key, cropped square round its rotation axis
  ballerina_front (W9)  bal_front-480         the porcelain ballerina from the front } one crop box for both, so the
  ballerina_back (W10)  bal_back-480          … and from behind                       } scaleX swap keeps her outline
  card_small (W11)      card-720              the cream card that rises out of the pocket
  portrait_frame (W12)  portrait-720          the gilded oval vanity mirror with roses (home portrait); window measured
  mirror_frame (W13)    mirror-720            the slender pearl-beaded oval mirror (story, story teaser); window measured
  venue_frame (W14)     venue-1100            the wide gilded overmantel mirror (venue); window measured
  corner_spray (W15)    spray-720             two garden roses, tulle and a gilt scroll (home card corners, reply card)
  divider (W16)         divider-1000          the filigree rule with a pearl (section dividers)
  accent_1..3 (W17)     petal/pearl/tulle     the accents that drift during the opening and after a reply
  web_hero (W18)        og-1200x630.jpg       share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W3, W4, W5, W7) share one canvas and GPT kept them aligned within ~2 %: the pocket and the lid are
drawn ~1–2 % wider than the back (a lid overhang) and the pocket stops ~3 % above the back's bottom. Each is cut to its own
alpha box and laid in the envelope box (the back's): pocket and lid span its width, the pocket reaches its bottom edge;
the keyhole plate keeps its place on the canvas. Plate and key ride on the lid, so their boxes are given in % of the
lid's box (manifest `stage`, the numbers site.css uses — tests/theme-music-box-ballerina.test.ts compares them). The key
(its own canvas) is cropped square round the canvas centre (its rotation axis, W8), scaled to KEY_W % of the envelope's
width and centred on the measured keyhole. The lid's inside (W6, its own canvas) keeps its own proportions: it is as wide
as the envelope and stands up from the hinge, so its height is given in % of the lid's box. Photo windows: GPT left the
middle of some windows transparent inside a green rim; the window = the green pixels plus everything they enclose
(oval mirrors, the wide mirror), cleared whole, the green spill round it neutralised.

  python3 platform/themes/music-box-ballerina/build_images.py [--still <png>]
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

COL = ROOT / "collections/32_Music_Box_Ballerina"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (247, 228, 226)        # placeholder tone (blush)
REQUIRED = ["page_ground", "card_paper", "env_back", "env_front", "flap", "flap_in", "escutcheon", "key",
            "ballerina_front", "ballerina_back", "card_small", "portrait_frame", "mirror_frame", "venue_frame",
            "corner_spray", "divider", "accent_1", "accent_2", "accent_3", "web_hero"]
KEY_W = 30.0                     # % of the envelope width (the key's bow spans a little wider than the plate)
CARD_W = 46.0                    # % of the envelope width (the card stands in the pocket, its foot 1 % above the bottom)
BAL_H = 56.0                     # % of the envelope height (the ballerina, standing)
BAL_FOOT = 48.0                  # % of the envelope height: her pedestal's foot once she has risen (behind the lip)


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
    """The photo window of a framed part: GPT's green is a closed rim, sometimes round an already transparent or
    darker-green middle, so the window = the green rim with everything it encloses (never the frame's own corners — the
    mirrors are ovals), grown 2 px and cleared; the green spill in a 12 px ring round it is neutralised.
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


def keyhole(esc: Image.Image):
    """The keyhole's round opening in the plate (canvas px): the dark deep rose-brown pixels in the plate's middle
    (x ±12 %, y 30–80 % of its box — the scrollwork's shadows lie outside it); the round head is as wide as the widest
    dark row of the upper half, its centre that far below the top."""
    a = np.asarray(esc).astype(np.int16)
    k = box(esc)
    cx = (k[0] + k[2]) / 2
    half = (k[2] - k[0]) * 0.12
    dark = (a[..., 3] > 200) & (a[..., :3].sum(-1) < 260)
    dark[:, :int(cx - half)] = False
    dark[:, int(cx + half):] = False
    dark[:int(k[1] + .3 * (k[3] - k[1]))] = False
    dark[int(k[1] + .8 * (k[3] - k[1])):] = False
    ys, xs = np.nonzero(dark)
    top, bottom = ys.min(), ys.max()
    widths = [(int(dark[y].sum()), y) for y in range(top, top + (bottom - top) // 2)]
    d = max(widths)[0]
    return float(xs.mean()), float(top + d / 2), d


def square_round_centre(im: Image.Image) -> Image.Image:
    """The key cropped to a square centred on its canvas centre (the rotation axis, W8) that holds all of it."""
    k = box(im)
    cx, cy = im.width / 2, im.height / 2
    r = max(cx - k[0], k[2] - cx, cy - k[1], k[3] - cy) + 2
    return im.crop((round(cx - r), round(cy - r), round(cx + r), round(cy + r)))


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — for a composition check (--still <file>)."""
    w = round(h * stage["aspect"])
    pad = round(h * .1)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (150, 150, 150, 255))
    fl = stage["flap"]

    def put(im, L, T, W, H):
        im = im.resize((max(1, round(w * W / 100)), max(1, round(h * H / 100))), Image.LANCZOS)
        canvas.alpha_composite(im, (pad + round(w * L / 100), pad + round(h * T / 100)))
    for key in ("back", "front", "flap"):
        put(layers[key], *stage[key])
    for key in ("esc", "key"):
        L, T, W, H = stage[key]
        put(layers[key], L, T * fl[3] / 100, W, H * fl[3] / 100)
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
    paper = Image.open(PARTS / "card_paper.png").convert("RGB")
    tb.webp(satin, "satin", [640, 1024], 72, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 74, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; pocket and lid span its width; the plate keeps its place
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"), ("esc", "escutcheon"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    front = place(boxes["front"], bx)
    flap = place(boxes["flap"], bx)
    esc = place(boxes["esc"], bx)
    flap_h = r2(flap[1] + flap[3])
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "flap": [0, 0, 100, flap_h],
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    # the pocket's lip at the centre (its top edge is an arc that dips toward the middle): % of the envelope height
    fa = np.asarray(layers["front"])[..., 3] > 128
    mid = fa[:, fa.shape[1] // 2]
    stage["lip_mid"] = r2(stage["front"][1] + stage["front"][3] * float(np.argmax(mid)) / fa.shape[0])
    # plate and key ride on the lid: their boxes in % of the lid's box (left/width: % of the envelope width)
    stage["esc"] = [esc[0], r2(esc[1] * 100 / flap_h), esc[2], r2(esc[3] * 100 / flap_h)]
    kx, ky, kd = keyhole(raw["esc"])
    key = square_round_centre(part("key"))
    layers["key"] = key
    key_h = KEY_W * stage["aspect"]                      # a square: its height in % of the envelope height
    cx = 100 * (kx - bx[0]) / bw
    cy = 100 * (ky - bx[1]) / bh
    stage["keyhole"] = [r2(cx), r2(cy), kd]
    stage["key"] = [r2(cx - KEY_W / 2), r2((cy - key_h / 2) * 100 / flap_h), KEY_W, r2(key_h * 100 / flap_h)]
    for k in ("back", "front", "flap"):
        tb.webp(layers[k], k, [720], 82, manifest, out=OUT)
    tb.webp(layers["esc"], "esc", [240], 86, manifest, out=OUT)
    tb.webp(key, "key", [320], 86, manifest, out=OUT)

    # the lid's inside (its own canvas): the oval mirror keyed; as wide as the envelope, standing up from the hinge
    flap_in, fwin = keyed_window(trim(part("flap_in")))
    if fwin is None:
        print("ERROR flap_in.png: no #00FF00 window found", file=sys.stderr)
        return 1
    tb.webp(flap_in, "flap_in", [720], 82, manifest, out=OUT)
    manifest["flap_in"]["window_pct"] = [r2(v) for v in fwin]
    stage["flap_in_ratio"] = round(flap_in.width / flap_in.height, 4)
    stage["flap_in_h"] = r2(100 * (100 / stage["flap_in_ratio"]) * stage["aspect"] / flap_h)

    # the card in the pocket
    card = trim(part("card_small"))
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    stage["card_ratio"] = round(card.width / card.height, 4)
    card_h = CARD_W * stage["aspect"] / stage["card_ratio"]
    stage["card"] = [r2(50 - CARD_W / 2), r2(99 - card_h), CARD_W, r2(card_h)]

    # the ballerina: one crop box for both views (the scaleX swap keeps her outline); centred on her pedestal
    bf, bb = part("ballerina_front"), part("ballerina_back")
    kf, kb = box(bf), box(bb)
    cxb = (kf[0] + kf[2] + kb[0] + kb[2]) / 4
    half = max(cxb - min(kf[0], kb[0]), max(kf[2], kb[2]) - cxb) + 2
    bal_box = (round(cxb - half), min(kf[1], kb[1]) - 2, round(cxb + half), max(kf[3], kb[3]) + 2)
    for im, name in ((bf, "bal_front"), (bb, "bal_back")):
        tb.webp(im.crop(bal_box), name, [480], 84, manifest, out=OUT)
    bal_ratio = (bal_box[2] - bal_box[0]) / (bal_box[3] - bal_box[1])
    bal_w = BAL_H * bal_ratio / stage["aspect"]
    stage["ballerina"] = [r2(50 - bal_w / 2), r2(BAL_FOOT - BAL_H), r2(bal_w), BAL_H]
    stage["ballerina_ratio"] = round(bal_ratio, 4)
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; pocket "
                      "and lid span its width (lip_mid = the pocket's lip at the centre); esc (the keyhole plate) and key "
                      "are in % of the lid's box (they rise with it), the key centred on the measured keyhole (keyhole = "
                      "its centre in % of the envelope + its diameter in canvas px); flap_in_h = the lid's inside, as wide "
                      "as the envelope, in % of the lid's height; the card stands in the pocket; the ballerina once risen")
    manifest["stage"] = stage

    # the frames: window measured (green rim + whatever it encloses)
    for src, name, width in (("portrait_frame", "portrait", 720), ("mirror_frame", "mirror", 720),
                             ("venue_frame", "venue", 1100)):
        keyed, win = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]

    for src, name, width, q in (("corner_spray", "spray", 720, 82), ("divider", "divider", 1000, 84),
                                ("accent_1", "petal", 160, 86), ("accent_2", "pearl", 160, 86),
                                ("accent_3", "tulle", 200, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("oval", "portrait"), ("mirror", "mirror"), ("wide", "venue")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(satin, (0, 0, satin.width, satin.height), w / h, w=640, ton=PH_TONE, karisim=.4, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("portrait")}, "story_1": {"aspect": aspect("mirror")},
                               "story_2": {"aspect": aspect("mirror")}, "story_3": {"aspect": aspect("mirror")},
                               "venue": {"aspect": aspect("venue")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(layers["esc"])
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the filigree keyhole plate"}
    if "--still" in sys.argv:
        envelope_still(layers, stage, 600).save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G432 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": True, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: v for k, v in stage.items() if k != "_note"}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("flap_in", "portrait", "mirror", "venue")})
    print(f"music-box-ballerina: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
