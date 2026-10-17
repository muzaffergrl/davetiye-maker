#!/usr/bin/env python3
"""Velvet Jewel Box (23) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G161.

The closed object is an aubergine velvet ring box (not an envelope): a satin bow (closure) slides off, the lid turns up
on its back hinge and its satin-lined inside takes over at 90° (docs/11 §7.1 hand-over, like a top-hinged flap), the
satin cushion shows, the small invitation card rises out of the box, comes forward and flies to home.

Two source modes (the same cut and the same manifest either way):

  GPT parts (PAKET 5 W2, collections/23_Velvet_Jewel_Box/assets/gpt/parts/ — GPT_PROMPTS.md), used when box_closed.png
  AND box_open.png exist: box_closed / box_open / closure on ONE 1024×1536 canvas, card_small (#00FF00 window), bg_page,
  satin_bg, divider, web_hero. The lid/base seam and the back hinge are measured (seam = lowest row where the closed and
  the open box differ; hinge = strongest horizontal tone step between the lid's inside and the cushion), SEAM_PCT /
  HINGE_PCT override them if the measurement is off.

  Interim (no W2 parts yet — the theme must run and be testable, like 22 Nocturne before its parts): stand-in box
  pieces are cut as plain rectangles from existing GPT textures of the catalogue, toned to this palette — velvet = the
  emerald velvet-like tile of 17 toned aubergine, satin = the satin tile of 14 toned champagne, card paper = the ivory
  paper tile of 01, closure = the satin bow accent of 14 toned champagne. Nothing is drawn (K21): every pixel is a GPT
  pixel cropped, scaled, toned or blurred. They are placeholders only: the real velvet box comes from GPT (W2.1–W2.4).

Pieces (img/): box_lid (closed lid), box_base (front of the base), box_inner (inside of the lid, satin), box_well (the
satin cushion), closure, card_paper, bg_velvet (page ground), bg_satin (light sections), ph_* placeholders, og, favicon.

  python3 platform/themes/velvet-jewel-box/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/23_Velvet_Jewel_Box"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"
CANVAS = (1024, 1536)

# interim sources (other collections' GPT textures; read only)
VELVET_SRC = ROOT / "collections/17_Emerald_Gold_Estate/assets/gpt/parts/bg_tile.png"
SATIN_SRC = ROOT / "collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_tile.png"
PAPER_SRC = ROOT / "collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png"
BOW_SRC = ROOT / "collections/14_Ivory_Lace_Pearl/assets/gpt/parts/accent_3.png"

# palette (site.css tokens)
AUBERGINE = [(34, 13, 31), (66, 28, 59), (104, 54, 92)]       # the box velvet
NIGHT = [(15, 6, 14), (28, 12, 26), (43, 19, 39)]              # the page ground (darker than the box)
SATIN = [(150, 118, 86), (226, 202, 164), (252, 242, 224)]
SATIN_PAGE = [(212, 186, 148), (230, 210, 176), (244, 230, 204)]   # text sits on it: low contrast
PAPER = [(226, 210, 184), (247, 237, 220), (255, 250, 241)]

SEAM_PCT = None   # override: lid/base seam, % of the canvas height (GPT parts only)
HINGE_PCT = None  # override: back hinge (inside of the lid / cushion), % of the canvas height (GPT parts only)


def tone(im: Image.Image, stops) -> Image.Image:
    """Duotone/tritone: the image's own luminance (stretched 2–98 %) mapped onto palette stops; alpha kept."""
    rgba = np.asarray(im.convert("RGBA")).astype(float)
    lum = rgba[..., :3] @ tb.LUM
    lo, hi = np.percentile(lum[rgba[..., 3] > 0] if (rgba[..., 3] > 0).any() else lum, (2, 98))
    t = np.clip((lum - lo) / max(hi - lo, 1), 0, 1)
    st = np.array(stops, float)
    seg = np.minimum((t * (len(st) - 1)).astype(int), len(st) - 2)
    f = (t * (len(st) - 1) - seg)[..., None]
    rgb = st[seg] * (1 - f) + st[seg + 1] * f
    return Image.fromarray(np.dstack([rgb, rgba[..., 3]]).astype(np.uint8), "RGBA")


def shade(im: Image.Image, top: float, bottom: float) -> Image.Image:
    """Brightness from `top` to `bottom` down the image (the piece's own light from above; nothing drawn)."""
    a = np.asarray(im.convert("RGBA")).astype(float)
    k = np.linspace(top, bottom, a.shape[0])[:, None, None]
    a[..., :3] = np.clip(a[..., :3] * k, 0, 255)
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def cover(im: Image.Image, size) -> Image.Image:
    w, h = size
    s = max(w / im.width, h / im.height)
    r = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (r.width - w) // 2, (r.height - h) // 2
    return r.crop((x, y, x + w, y + h))


# ---------------------------------------------------------------- interim stand-in box (one canvas, like GPT's)
# canvas rows/columns of the stand-in (GPT's own box replaces all of this; the cut below measures nothing here)
LID = (146, 776, 878, 968)      # closed lid: x0, y0, x1, y1 (the seam is its bottom edge)
BASE = (154, 968, 870, 1229)    # front of the base
INNER = (172, 540, 852, 900)    # inside of the opened lid, standing up (bottom = the back hinge)
WELL = (160, 900, 864, 968)     # satin cushion between the back hinge and the seam
CLOSURE_C, CLOSURE_W = (512, 872), 236


def interim_canvas():
    velvet = tone(Image.open(VELVET_SRC).filter(ImageFilter.GaussianBlur(2.2)), AUBERGINE)
    satin = tone(Image.open(SATIN_SRC), SATIN)
    closed = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    opened = Image.new("RGBA", CANVAS, (0, 0, 0, 0))

    def put(canvas, tex, box, at, top, bottom):
        x0, y0, x1, y1 = box
        piece = shade(tex.crop((at[0], at[1], at[0] + x1 - x0, at[1] + y1 - y0)), top, bottom)
        canvas.alpha_composite(piece, (x0, y0))

    put(closed, velvet, LID, (60, 80), 1.38, 1.05)
    put(closed, velvet, BASE, (300, 500), 0.98, 0.70)
    put(opened, satin, INNER, (120, 60), 1.04, 0.86)
    put(opened, satin, WELL, (300, 700), 0.80, 0.70)
    put(opened, velvet, BASE, (300, 500), 0.98, 0.70)
    bow = tone(Image.open(BOW_SRC), SATIN)
    k = tb.alfa_kutusu(np.asarray(bow)[..., 3], esik=8)
    bow = bow.crop(k)
    bow = bow.resize((CLOSURE_W, round(bow.height * CLOSURE_W / bow.width)), Image.LANCZOS)
    closure = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    closure.alpha_composite(bow, (CLOSURE_C[0] - bow.width // 2, CLOSURE_C[1] - bow.height // 2))
    return closed, opened, closure, LID[3], INNER[3]


def measured_rows(closed: Image.Image, opened: Image.Image):
    """GPT parts: the seam (lowest row where closed ≠ open, scanning up from the shared base) and the back hinge
    (strongest horizontal tone step between seam − 14 % and the seam in the open box)."""
    c = np.asarray(closed).astype(float)
    o = np.asarray(opened).astype(float)
    box = tb.alfa_kutusu(c[..., 3])
    x0, x1 = box[0] + (box[2] - box[0]) // 5, box[2] - (box[2] - box[0]) // 5
    diff = np.abs(c[:, x0:x1] - o[:, x0:x1]).mean(axis=(1, 2))
    seam = box[3]
    for y in range(box[3] - 1, box[1], -1):
        if diff[y - 4:y + 1].min() > 18:
            seam = y + 1
            break
    lum = (o[:, x0:x1, :3] @ tb.LUM).mean(axis=1)
    lo = int(seam - .14 * CANVAS[1])
    steps = [abs(lum[y + 3] - lum[y - 3]) for y in range(lo, seam - 4)]
    hinge = lo + int(np.argmax(steps)) if steps else seam
    if SEAM_PCT is not None:
        seam = round(SEAM_PCT * CANVAS[1] / 100)
    if HINGE_PCT is not None:
        hinge = round(HINGE_PCT * CANVAS[1] / 100)
    return seam, hinge


def main() -> int:
    gpt = (PARTS / "box_closed.png").exists() and (PARTS / "box_open.png").exists()
    manifest: dict = {"_note": ("G161 build from the PAKET 5 W2 parts." if gpt else
                                "G161 interim build: stand-in box pieces cut from toned GPT textures of 17/14/01 "
                                "(see build_images.py); the real velvet box is ordered in GPT_PROMPTS.md (W2.1–W2.4).")}
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    # ---------------------------------------------------------------- the box
    if gpt:
        closed = cover(Image.open(PARTS / "box_closed.png").convert("RGBA"), CANVAS)
        opened = cover(Image.open(PARTS / "box_open.png").convert("RGBA"), CANVAS)
        cl = PARTS / "closure.png"
        closure = cover(Image.open(cl).convert("RGBA"), CANVAS) if cl.exists() else None
        seam, hinge = measured_rows(closed, opened)
    else:
        closed, opened, closure, seam, hinge = interim_canvas()
    ca, oa = np.asarray(closed)[..., 3], np.asarray(opened)[..., 3]
    cbox, obox = tb.alfa_kutusu(ca), tb.alfa_kutusu(oa)

    def rows(im, y0, y1, name, widths=(440, 880)):
        a = np.asarray(im).copy()
        a[:y0, :, 3] = 0
        a[y1:, :, 3] = 0
        k = tb.alfa_kutusu(a[..., 3], esik=8)
        piece = Image.fromarray(a, "RGBA").crop(k)
        tb.webp(piece, name, list(widths), 84, manifest, out=OUT)
        return k

    lid_k = rows(closed, 0, seam, "box_lid")
    base_k = rows(closed, seam, CANVAS[1], "box_base")
    inner_k = rows(opened, 0, hinge, "box_inner")
    well_k = rows(opened, hinge, seam, "box_well")
    close_k = None
    if closure is not None:
        close_k = tb.alfa_kutusu(np.asarray(closure)[..., 3], esik=8)
        tb.webp(closure.crop(close_k), "closure", [160, 320], 84, manifest, out=OUT)

    # the card: GPT card_small (window → transparent) or a plain crop of the ivory paper (interim)
    card_src = PARTS / "card_small.png"
    if card_src.exists():
        card = Image.open(card_src).convert("RGBA")
        card = card.crop(tb.alfa_kutusu(np.asarray(card)[..., 3]))
    else:
        card = tone(Image.open(PAPER_SRC), PAPER).crop((200, 300, 1060, 730))
    tb.webp(card, "card_paper", [480, 860], 82, manifest, out=OUT)
    cw = round((BASE[2] - BASE[0]) * .60) if not gpt else round((cbox[2] - cbox[0]) * .60)
    ch = round(cw * card.height / card.width)
    cx0 = CANVAS[0] // 2 - cw // 2
    ctop = seam + 24
    rise_top = inner_k[1] + 24                                     # the risen card sits over the satin of the lid
    card_k = (cx0, ctop, cx0 + cw, ctop + ch)

    # stage box = union of the closed box, the open box and the card's path (docs/11 §7.1)
    X0 = min(cbox[0], obox[0], card_k[0])
    Y0 = min(cbox[1], obox[1], rise_top)
    X1 = max(cbox[2], obox[2], card_k[2])
    Y1 = max(cbox[3], obox[3], card_k[3])
    SW, SH = X1 - X0, Y1 - Y0
    pct = lambda b: [round(100 * (b[0] - X0) / SW, 3), round(100 * (b[1] - Y0) / SH, 3),  # noqa: E731
                     round(100 * (b[2] - b[0]) / SW, 3), round(100 * (b[3] - b[1]) / SH, 3)]
    manifest["stage"] = {
        "canvas": list(CANVAS), "box": [X0, Y0, SW, SH], "aspect": round(SW / SH, 4),
        "closed_obj": {"box_pct": pct((cbox[0], lid_k[1], cbox[2], cbox[3])),
                       "aspect": round((cbox[2] - cbox[0]) / (cbox[3] - lid_k[1]), 4)},
        "above_closed_frac_of_width": round((lid_k[1] - Y0) / SW, 4),
        "seam_row": seam, "hinge_row": hinge, "source": "gpt" if gpt else "interim",
        "lid": {"box_pct": pct(lid_k)}, "base": {"box_pct": pct(base_k)},
        "inner": {"box_pct": pct(inner_k)}, "well": {"box_pct": pct(well_k)},
        "card": {"box_pct": pct(card_k), "rise_pct": round(100 * (rise_top - ctop) / ch, 2)},
    }
    if close_k:
        manifest["stage"]["closure"] = {"box_pct": pct(close_k)}

    # ---------------------------------------------------------------- grounds, placeholders, share image, icon
    bg_src = PARTS / "bg_page.png"
    velvet_page = (Image.open(bg_src).convert("RGB") if bg_src.exists()
                   else cover(tone(Image.open(VELVET_SRC).filter(ImageFilter.GaussianBlur(16)), NIGHT).convert("RGB"), CANVAS))
    tb.webp(velvet_page, "bg_velvet", [640, 1024], 62, manifest, out=OUT)
    satin_src = PARTS / "satin_bg.png"
    satin_page = (Image.open(satin_src).convert("RGB") if satin_src.exists()
                  else cover(tone(Image.open(SATIN_SRC).filter(ImageFilter.GaussianBlur(4)), SATIN_PAGE).convert("RGB"), (1536, 1024)))
    tb.webp(satin_page, "bg_satin", [768, 1280], 58, manifest, out=OUT)
    div_src = PARTS / "divider.png"
    if div_src.exists():
        d = Image.open(div_src).convert("RGBA")
        tb.webp(d.crop(tb.alfa_kutusu(np.asarray(d)[..., 3], esik=8)), "divider", [320, 640], 84, manifest, out=OUT)

    slots = {}
    for key, shape, ratio in (("hero_portrait", "portrait", 4 / 5), ("story", "story", 4 / 5), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(satin_page, (0, 0, satin_page.width, satin_page.height), ratio, w=640,
                           ton=(74, 36, 66), karisim=.55, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 76, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots

    hero_src = PARTS / "web_hero.png"
    if hero_src.exists():
        og, og_info = tb.og_kirp(Image.open(hero_src), hiza="alt")
    else:   # interim: the closed stand-in box with its bow on the velvet ground
        scene = cover(velvet_page, (1200, 630)).convert("RGBA")
        obj = closed.copy()
        if closure is not None:
            obj.alpha_composite(closure)
        obj = obj.crop((X0 - 40, lid_k[1] - 40, X1 + 40, Y1 + 40))
        obj = obj.resize((round(obj.width * 470 / obj.height), 470), Image.LANCZOS)
        scene.alpha_composite(obj, ((1200 - obj.width) // 2, 100))
        og, og_info = scene.convert("RGB"), {"src_size": [1200, 630], "crop": [0, 0, 1200, 630], "align": "interim",
                                             "size": [1200, 630]}
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(closure.crop(close_k) if close_k else closed.crop(cbox))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # ---------------------------------------------------------------- checks + manifest
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 120}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(manifest["stage"], indent=1))
    print(f"velvet-jewel-box: theme folder {manifest['bytes_total'] / 1e6:.2f} MB ({'GPT parts' if gpt else 'interim'})")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
