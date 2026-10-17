#!/usr/bin/env python3
"""Velvet Jewel Box (23) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G161.

The closed object is an aubergine velvet ring box (not an envelope): a satin bow (closure) slides off, the lid turns up
on its back hinge and its satin-lined inside takes over at 90° (docs/11 §7.1 hand-over, like a top-hinged flap), the
satin cushion shows, the small invitation card rises out of the box, comes forward and flies to home.

Two source modes (the same cut and the same manifest either way):

  GPT parts (PAKET 5 W2, collections/23_Velvet_Jewel_Box/assets/gpt/parts/ — GPT_PROMPTS.md), used when box_closed.png
  AND box_open.png exist: box_closed / box_open / closure on ONE 1024×1536 canvas, card_small (#00FF00 window), bg_page,
  satin_bg, web_hero. The lid/base seam and the back hinge are measured (seam = lowest row where the closed and the
  open box differ; hinge = strongest horizontal tone step between the lid's inside and the cushion); a measurement
  outside the prompt's geometry falls back to it (seam 63 %, hinge 4.5 % above it — printed as a warning), SEAM_PCT /
  HINGE_PCT override both. The card's #00FF00 window is keyed out and measured (manifest stage.card.window_pct).

Output names never depend on the source size (the pages and lib/print/layouts.ts name them: box_lid-732.webp …): each
piece is scaled to its largest listed width first (SIZES). The stage numbers of site.css — between
`/* stage:begin` and `/* stage:end */` — are written by this script from the manifest (no hand copy).

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

# output widths per piece (= the file names the pages and the print layout use; the interim pieces have exactly the
# largest width, so their output is unchanged)
SIZES = {"box_lid": (440, 732), "box_base": (440, 716), "box_inner": (440, 680), "box_well": (440, 704),
         "closure": (160, 236), "card_paper": (480, 860)}
SEAM_DEFAULT, HINGE_DEFAULT = 63.0, 4.5   # GPT_PROMPTS.md W2.1/W2.3: seam row %, hinge = seam − this % (fallbacks)
# interim card window = the photo's place in the card (% of the card: left, top, width, height) and where the text starts
CARD_WINDOW_INTERIM, CARD_TEXT_GAP = [7.0, 14.0, 28.8, 72.0], 6.0

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


def webp_fixed(im: Image.Image, name: str, manifest: dict) -> None:
    """tb.webp with stable names: the piece is scaled to its largest width in SIZES first (GPT pieces of any size give
    the same files the pages reference). An interim piece already has that width: same pixels, same files."""
    widths = SIZES[name]
    cut = list(im.size)
    if im.width != widths[-1]:
        im = im.resize((widths[-1], max(1, round(im.height * widths[-1] / im.width))), Image.LANCZOS)
    tb.webp(im, name, list(widths), 84 if name != "card_paper" else 82, manifest, out=OUT)
    if cut != manifest[name]["src_size"]:
        manifest[name]["cut_size"] = cut


def key_window(card: Image.Image):
    """GPT card_small: the flat #00FF00 window → transparent (its rectangle + 3 px; green spill on the ring around it
    is pulled to the neighbouring channels). Returns (card, window box in % of the card [l, t, w, h]) or (card, None)
    when there is no green window. Nothing drawn: pixels are only made transparent or desaturated."""
    a = np.asarray(card.convert("RGBA")).astype(np.int16)
    tint = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
    green = (tint > 60) & (a[..., 3] > 128)
    if green.sum() < 0.005 * green.size:
        return card, None
    ys, xs = np.nonzero(green)
    x0, x1 = (int(v) for v in np.percentile(xs, (0.2, 99.8)))
    y0, y1 = (int(v) for v in np.percentile(ys, (0.2, 99.8)))
    H, W = green.shape
    out = a.copy()
    p = 3
    win = np.zeros_like(green)
    win[max(0, y0 - p):min(H, y1 + 1 + p), max(0, x0 - p):min(W, x1 + 1 + p)] = True
    out[..., 3][win & (tint > 25)] = 0
    ring = np.zeros_like(green)
    ring[max(0, y0 - 8):min(H, y1 + 9), max(0, x0 - 8):min(W, x1 + 9)] = True
    spill = ring & (tint > 0) & (out[..., 3] > 0)
    out[..., 1][spill] = np.maximum(out[..., 0], out[..., 2])[spill]
    box = [round(100 * x0 / W, 3), round(100 * y0 / H, 3), round(100 * (x1 + 1 - x0) / W, 3), round(100 * (y1 + 1 - y0) / H, 3)]
    return Image.fromarray(out.astype(np.uint8), "RGBA"), box


def n(v: float) -> str:
    """A number as JSON → JavaScript prints it (0.0 → 0, 34.253 → 34.253): the theme test builds its patterns that way."""
    return f"{v:g}"


def write_css(stage: dict) -> None:
    """site.css between `/* stage:begin` and `/* stage:end */` ← manifest stage (the place of every piece, the stage
    proportions and the travel of the lid and the card). Everything else in site.css is hand-written."""
    css_path = THEME / "site.css"
    css = css_path.read_text(encoding="utf-8")
    b = lambda k: "left:{}%;top:{}%;width:{}%;height:{}%".format(*(n(v) for v in stage[k]["box_pct"]))  # noqa: E731
    sw, sh = stage["box"][2:]
    lines = [
        f"/* stage:begin — written by build_images.py from img/manifest.json \"stage\" (source: {stage['source']}); do not edit by",
        f"   hand. Stage = {sw}×{sh} px of the {stage['canvas'][0]}×{stage['canvas'][1]} canvas; the closed box is its lower "
        f"{n(round(stage['closed_obj']['box_pct'][3], 1))} %, the room",
        f"   above it ({n(stage['above_closed_frac_of_width'])} × the width) is for the lid's inside and the risen card "
        "(it slides up under the heading). */",
        f".stage{{--w:min(84vw,calc(43svh * {n(round(stage['closed_obj']['aspect'], 3))}),440px);aspect-ratio:{sw}/{sh};"
        f"margin:calc(14px - var(--w) * {n(stage['above_closed_frac_of_width'])}) auto 0}}",
        f".box-inner,.box-sheen{{{b('inner')}}}",
        f".box-well{{{b('well')}}}",
        f".box-base{{{b('base')}}}",
        f".box-lid,.lid-sheen{{{b('lid')}}}",
    ]
    if "closure" in stage:
        lines.append(f".box-closure{{{b('closure')}}}")
    card = stage["card"]
    wl, wt, ww, wh = card["window_pct"]
    lines += [
        f".box>.card{{{b('card')}}}",
        f".card-photo{{left:{n(wl)}%;top:{n(wt)}%;width:{n(ww)}%;height:{n(wh)}%}}",
        f".card-text{{left:{n(round(wl + ww + CARD_TEXT_GAP, 3))}%}}",
        f".is-opened .box>.card{{transform:translateY({n(card['forward_pct'])}%) scale(1.1)}}",
        "@keyframes lid-up{0%{transform:perspective(900px) rotateX(0);filter:brightness(1)}",
        "99%{opacity:1}",
        f"100%{{transform:translateY({n(stage['lid']['drop_pct'])}%) perspective(900px) rotateX(-90deg);filter:brightness(.7);opacity:0}}}}",
        f"@keyframes card-rise{{from{{transform:none}}to{{transform:translateY({n(card['rise_pct'])}%)}}}}",
        f"@keyframes card-forward{{from{{z-index:9;transform:translateY({n(card['rise_pct'])}%);filter:drop-shadow(0 6px 8px #0008)}}",
        f"to{{z-index:9;transform:translateY({n(card['forward_pct'])}%) scale(1.1);filter:drop-shadow(0 18px 22px #000b)}}}}",
        "/* stage:end */",
    ]
    i, j = css.find("/* stage:begin"), css.find("/* stage:end */")
    if i < 0 or j < i:
        sys.exit("site.css: no /* stage:begin … /* stage:end */ block")
    new = css[:i] + "\n".join(lines) + css[j + len("/* stage:end */"):]
    if new != css:
        css_path.write_text(new, encoding="utf-8")
        print("site.css: stage block updated from the manifest")


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
    H = CANVAS[1]
    how = {"seam": "measured", "hinge": "measured"}
    if not .55 * H <= seam <= .72 * H:          # the prompt asks for 63 %: a measurement far off it is not the seam
        print(f"WARNING: measured seam row {seam} ({100 * seam / H:.1f} %) is off the prompt's geometry; using "
              f"{SEAM_DEFAULT} % (set SEAM_PCT after a look at box_closed/box_open)", file=sys.stderr)
        seam, how["seam"] = round(SEAM_DEFAULT * H / 100), "fallback"
    lum = (o[:, x0:x1, :3] @ tb.LUM).mean(axis=1)
    lo = int(seam - .14 * H)
    steps = [abs(lum[y + 3] - lum[y - 3]) for y in range(lo, seam - 4)]
    hinge = lo + int(np.argmax(steps)) if steps else seam
    if not steps or max(steps) < 6 or hinge >= seam - 4:
        print(f"WARNING: no clear lining/cushion line above the seam; hinge = seam − {HINGE_DEFAULT} % (set HINGE_PCT)",
              file=sys.stderr)
        hinge, how["hinge"] = seam - round(HINGE_DEFAULT * H / 100), "fallback"
    if SEAM_PCT is not None:
        seam = round(SEAM_PCT * CANVAS[1] / 100)
    if HINGE_PCT is not None:
        hinge = round(HINGE_PCT * CANVAS[1] / 100)
    return seam, hinge, how


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
        seam, hinge, how = measured_rows(closed, opened)
    else:
        closed, opened, closure, seam, hinge = interim_canvas()
        how = None
    ca, oa = np.asarray(closed)[..., 3], np.asarray(opened)[..., 3]
    cbox, obox = tb.alfa_kutusu(ca, esik=8), tb.alfa_kutusu(oa, esik=8)   # = the pieces' own crop threshold

    def rows(im, y0, y1, name):
        a = np.asarray(im).copy()
        a[:y0, :, 3] = 0
        a[y1:, :, 3] = 0
        k = tb.alfa_kutusu(a[..., 3], esik=8)
        piece = Image.fromarray(a, "RGBA").crop(k)
        webp_fixed(piece, name, manifest)
        return k

    lid_k = rows(closed, 0, seam, "box_lid")
    base_k = rows(closed, seam, CANVAS[1], "box_base")
    inner_k = rows(opened, 0, hinge, "box_inner")
    well_k = rows(opened, hinge, seam, "box_well")
    close_k = None
    if closure is not None:
        close_k = tb.alfa_kutusu(np.asarray(closure)[..., 3], esik=8)
        webp_fixed(closure.crop(close_k), "closure", manifest)

    # the card: GPT card_small (window → transparent) or a plain crop of the ivory paper (interim)
    card_src = PARTS / "card_small.png"
    window = None
    if card_src.exists():
        card = Image.open(card_src).convert("RGBA")
        card = card.crop(tb.alfa_kutusu(np.asarray(card)[..., 3]))
        card, window = key_window(card)
        if window is None:
            print("WARNING: card_small.png has no #00FF00 window; the photo keeps the interim place", file=sys.stderr)
    else:
        card = tone(Image.open(PAPER_SRC), PAPER).crop((200, 300, 1060, 730))
    webp_fixed(card, "card_paper", manifest)
    cw = round((BASE[2] - BASE[0]) * .60) if not gpt else round((cbox[2] - cbox[0]) * .60)
    ch = round(cw * card.height / card.width)
    ctop = seam + 24
    room = cbox[3] - 12 - ctop                                     # the card waits hidden behind the front of the base
    if ch > room:
        cw, ch = round(cw * room / ch), room
    cx0 = CANVAS[0] // 2 - cw // 2
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
        "lid": {"box_pct": pct(lid_k), "drop_pct": round(100 * (hinge - lid_k[1]) / (lid_k[3] - lid_k[1]), 2)},
        "base": {"box_pct": pct(base_k)},
        "inner": {"box_pct": pct(inner_k)}, "well": {"box_pct": pct(well_k)},
        "card": {"box_pct": pct(card_k), "rise_pct": round(100 * (rise_top - ctop) / ch, 2),
                 "window_pct": window or CARD_WINDOW_INTERIM, "window": "gpt" if window else "interim"},
    }
    manifest["stage"]["card"]["forward_pct"] = round(manifest["stage"]["card"]["rise_pct"] - 7, 2)
    if how:
        manifest["stage"]["measure"] = how
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
    write_css(manifest["stage"])
    leak = {f: v for f, v in manifest["checks"]["green"].items() if f.startswith("card_paper")}
    if leak:   # the card's window must be keyed out completely (other parts have no #00FF00 window)
        print(f"ERROR: visible #00FF00 left in {leak}", file=sys.stderr)
        return 1
    if manifest["checks"]["green"]:
        print(f"WARNING: green-dominant pixels in {manifest['checks']['green']} (no window there: check the part)",
              file=sys.stderr)
    print(json.dumps(manifest["stage"], indent=1))
    print(f"velvet-jewel-box: theme folder {manifest['bytes_total'] / 1e6:.2f} MB ({'GPT parts' if gpt else 'interim'})")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
