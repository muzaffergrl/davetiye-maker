#!/usr/bin/env python3
"""Red Lacquer & Double Happiness (34) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G183.

Since 2026-10-22 every picture is the design's own PAKET 5 part (collections/34_Red_Lacquer_Double_Happiness/assets/gpt/
GPT_PROMPTS.md), cut to its alpha box, keyed or scaled — nothing is drawn (K21, docs/11 §5.7). The interim sources below
stay only as the look of a part that is missing (none is):

  red paper      collections/04_Vintage_Airmail/assets/gpt/parts/bg_tile.png      flecked paper, toned cinnabar red
  lacquer        collections/07_Burgundy_Velvet/assets/gpt/parts/bg_tile.png      mottled paper, toned deep lacquer red
  cream paper    collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png          cotton paper, toned warm cream
  gold leaf      collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png   the plain gold field inside the seal
                                                                                   (a rectangle of metal, no laurel)

Toning keeps each paper's own grain (`tonla`). When the design's own parts are in parts/ they are taken the moment they
exist (G167): the build cuts / keys / scales each into img/ and writes `parts.css` (loaded by every page after
site.css) with the rules that use it. A part that is not there has no rule — the page keeps its interim look and never
asks for a picture the build did not make; nothing is drawn as a stand-in (K21):

  lacquer (W2.1)            lacquer-640                the page ground
  red_paper (W2.2)          red-640/1024               the envelope paper (interim back, pocket, flap, outer veil)
  cream_paper (W2.3)        cream-640/1024             cards, bands, the reply form
  gold_leaf (W2.4)          gold-480                   the interim buttons, the interim inner veil, the interim 囍 glyph
  envelope_back (W2.5)      env_back-900               the back of the envelope with its lining (full envelope canvas)
  envelope_pocket (W2.6)    pocket-900                 the front pocket (full envelope canvas, transparent above it)
  envelope_flap (W2.7)      flap-900                   the closed flap, outside (canvas = the flap box)
  flap_inside (W2.8)        flap_in-900                the inside of the flap, seen when it has lifted
  button (W2.9)             button-240                 both paper buttons of the string-and-button closure
  string (W2.10)            string-320                 the red cord wound round the buttons (canvas = the string box)
  xi_gold (W2.11)           xi-400                     the gold-leaf 囍 on the pocket (the interim glyph goes)
  veil_outer (W2.12)        veil_o_l/r-480             the red paper-cut peony window over the card, cut in two
  veil_inner (W2.13)        veil_i_l/r-480             the gold paper-cut layer under it, cut in two
  card_small (W2.14)        card_small-860             the card; round #00FF00 window keyed, the portrait placed on it
  cloud_1..3 (W2.15)        cloud_N-400                gold clouds drifting (site.js reads them from --rl-clouds)
  moon_gate (W2.16)         gate-720                   the round frame of every round photo; #00FF00 window measured
  peony_band (W2.17)        band-800                   the paper-cut border under the headings on cream paper
  jianzhi_far/near (W2.18)  cut_far-900, cut_near-700  the two paper-cut layers that move at two speeds (parallax)
  tassel (W2.19)            tassel-300                 the knot with its tassel (signatures; it sways)
  web_hero (W2.20)          og-1200x630.jpg            share image (tema_build.og_kirp, bottom-aligned)

Outputs without parts (img/): lacquer, red, cream, gold, placeholders ph_round / ph_wide, og montage of the closed
envelope on the lacquer ground, favicon.

The envelope (eye check 2026-10-22): GPT drifted between the layers it drew on one canvas (the pocket 3 % narrower than
the back and 4 % short of its foot, so the back showed round it) and gave the flap, its inside and the cord canvases of
their own (the flap's alpha box started 7 % below its canvas top, so the back's cream lining showed above the closed
flap). As in designs 39–48 each layer is cut to its alpha box and laid by its measured edges: the back's alpha box is the
envelope; the pocket spans its width with its foot on the back's foot (scaled 1.06, uniform); the flap spans the width
from the fold at its own height, its button on the flap's tip; the flap's inside at its own height under the fold; the
cord scaled so its two loops ring the two buttons (loop centres measured as the cord's two enclosed holes). manifest
`stage_measured` and parts.css carry the numbers (--env-ratio, the boxes). Photo windows: GPT left the middle of the
round #00FF00 windows (card, moon gate) transparent inside a soft green rim — the window = the green + the hole it
encloses, cleared, the spill round it removed. Sizes are kept for a ≤ 2.5 MB folder (every file ≤ 250 kB, docs/11 §6).

  python3 platform/themes/red-lacquer-double-happiness/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/34_Red_Lacquer_Double_Happiness"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

# palette (site.css :root)
CINNABAR = (168, 30, 36)         # --cinnabar #A81E24  the envelope paper
LACQUER = (74, 10, 14)           # --lacquer  #4A0A0E  page ground (smooth grain: text sits on it)
CREAM = (245, 236, 216)          # --cream    #F5ECD8  card paper
GOLD = (201, 161, 74)            # --gold     #C9A14A
CREAM_SHADE = (226, 208, 182)    # placeholder tone

INTERIM = {
    "red_paper": ROOT / "collections/04_Vintage_Airmail/assets/gpt/parts/bg_tile.png",
    "lacquer": ROOT / "collections/07_Burgundy_Velvet/assets/gpt/parts/bg_tile.png",
    "cream_paper": ROOT / "collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png",
}
GOLD_SRC = ROOT / "collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png"
GOLD_BOX = (.42, .32, .58, .48)  # the plain metal inside the seal's laurel (fractions of the 1024 px part)

# closed envelope geometry (site.css .envelope): width/height and every layer in % of the envelope (left, top, w, h)
STAGE = 0.66
POCKET_TOP = 30                   # the pocket covers 30 %–100 % of the height
FLAP = (0, 0, 100, 52)            # the closed flap (its canvas)
CARD = (6, 8, 88, 84)             # the card inside (0.69:1)
BUTTONS = ((50, 47), (50, 62))    # centres of the flap button and the body button
BUTTON_W = 14                     # % of the envelope width
STRING = (36, 41, 28, 27)         # the cord's canvas
XI = (33, 70, 34, 22.5)           # the gold 囍 on the pocket (square in px: 34 % w = 22.4 % h)
GATE_WINDOW = (0, 0, 100, 100)    # interim: the photo circle IS the frame (no gate)
BUDGET = 2_500_000                # theme folder (docs/11 §6 allows 3 MB; the 39–48 wave keeps ≤ 2.5 MB)
# measured envelope (the GPT layers laid by their alpha boxes)
BUTTON_ON_TIP = 1.3               # the flap button's centre this far (% of the height) above the flap's tip
LOOP_ROOM = 1.09                  # a cord loop's inner width = this × the button's width (it rings the button)


def tonla(src: Image.Image, renk, sigma: float) -> Image.Image:
    """The palette colour carrying the source paper's own grain: per-pixel luminance deviation × sigma levels."""
    g = np.asarray(src.convert("L"), float)
    d = (g - g.mean()) / (g.std() + 1e-6)
    out = np.clip(np.array(renk, float)[None, None, :] + d[..., None] * sigma, 0, 255)
    return Image.fromarray(out.astype(np.uint8), "RGB")


def kaynak(ad: str):
    own = PARTS / f"{ad}.png"
    if own.exists():
        return Image.open(own).convert("RGB"), str(own.relative_to(ROOT)), True
    return Image.open(INTERIM[ad]).convert("RGB"), str(INTERIM[ad].relative_to(ROOT)), False


def part(ad: str):
    """An optional PAKET 5 part (RGBA) or None."""
    p = PARTS / f"{ad}.png"
    return Image.open(p).convert("RGBA") if p.exists() else None


def trim(im: Image.Image, esik: int = 8) -> Image.Image:
    k = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)
    return im.crop(k) if k else im


def square(im: Image.Image) -> Image.Image:
    s = max(im.size)
    out = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    out.alpha_composite(im, ((s - im.width) // 2, (s - im.height) // 2))
    return out


def green_window(im: Image.Image):
    """The #00FF00 window of a framed part: (RGBA with the window cleared, (L, T, W, H) % of the image) or (None, None).

    The window = the green pixels + the transparent hole they enclose (GPT left the middle of the round windows of
    card_small and moon_gate transparent inside a soft green rim): flood-filled from the green pixel nearest the green
    box's centre, cleared with a 2 px margin; the green spill in a 20 px ring round it is neutralised (green → the mean
    of red and blue) so no green line stays on the rim."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    ys, xs = np.nonzero(green)
    if len(ys) < 256:
        return None, None
    h, w = c.shape[:2]
    free = ((c[..., 3] < 128) | green).astype(np.uint8) * 255
    pad = Image.fromarray(np.pad(free, 1, constant_values=255), "L").copy()   # (a copy: floodfill on a numpy view is lost)
    ImageDraw.floodfill(pad, (0, 0), 100)
    enclosed = np.asarray(pad)[1:-1, 1:-1] == 255
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    k = int(np.argmin((xs - cx) ** 2 + (ys - cy) ** 2))
    if not enclosed[ys[k], xs[k]]:
        return None, None
    lab = Image.fromarray((enclosed * 255).astype(np.uint8), "L").copy()
    ImageDraw.floodfill(lab, (int(xs[k]), int(ys[k])), 50)
    win = np.asarray(lab) == 50
    wy, wx = np.nonzero(win)
    x0, y0, x1, y1 = wx.min(), wy.min(), wx.max() + 1, wy.max() + 1
    # the window, and any other spot of key green GPT left in the ornament (moon_gate: a gap between two peony leaves)
    # — this frame has no green of its own
    key = win | ((rgb[..., 1] > 140) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 80) & (c[..., 3] > 40))
    grown = np.asarray(Image.fromarray((key * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    c[..., 3] = np.where(grown, 0, c[..., 3])
    ring = np.asarray(Image.fromarray((key * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(41))) > 0
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 4)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h)


def alpha_box(im: Image.Image, esik: int = 8):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def r2(v: float) -> float:
    return round(float(v), 2)


def cord_loops(cord: Image.Image):
    """The two loops of the figure-eight cord: [(centre x %, centre y %, inner width %, inner height %)] of the trimmed
    cord, top first — its two largest enclosed transparent holes."""
    a = np.asarray(cord)[..., 3]
    free = ((a < 100) * 255).astype(np.uint8)
    pad = Image.fromarray(np.pad(free, 1, constant_values=255), "L").copy()
    ImageDraw.floodfill(pad, (0, 0), 100)
    lab = Image.fromarray(((np.asarray(pad)[1:-1, 1:-1] == 255) * 255).astype(np.uint8), "L").copy()
    h, w = a.shape
    holes, val = [], 10
    for y in range(0, h, 6):
        for x in range(0, w, 6):
            if lab.getpixel((x, y)) == 255:
                ImageDraw.floodfill(lab, (x, y), val)
                yy, xx = np.nonzero(np.asarray(lab) == val)
                holes.append((len(yy), 100 * xx.mean() / w, 100 * yy.mean() / h, 100 * (xx.max() - xx.min()) / w,
                              100 * (yy.max() - yy.min()) / h))
                val = val + 1 if val < 250 else 10
    loops = sorted(sorted(holes, reverse=True)[:2], key=lambda t: t[2])
    return [tuple(r2(v) for v in t[1:]) for t in loops] if len(loops) == 2 else None


def gold_plate() -> Image.Image:
    src = Image.open(GOLD_SRC).convert("RGB")
    w, h = src.size
    crop = src.crop(tuple(round(v * (w if i % 2 == 0 else h)) for i, v in enumerate(GOLD_BOX)))
    crop = ImageEnhance.Brightness(crop).enhance(1.04)
    return ImageEnhance.Color(crop).enhance(.92).resize((480, 480), Image.LANCZOS)


def box(spec, w: int, h: int):
    L, T, W, H = spec
    return round(w * L / 100), round(h * T / 100), round(w * (L + W) / 100), round(h * (T + H) / 100)


def envelope(red: Image.Image, gold: Image.Image, h: int, own: dict, stage: dict | None = None) -> Image.Image:
    """The closed envelope as the page shows it: the pocket and the flap (GPT, or crops of the red paper), the two gold
    buttons (GPT, or round crops of the gold leaf), the cord and the 囍 when GPT made them. With the measured stage
    (manifest stage, the GPT layers) every layer sits in its measured box."""
    if stage and "pocket" in stage:
        return envelope_measured(h, own, stage)
    w = round(h * STAGE)
    o = 40
    canvas = Image.new("RGBA", (w + 2 * o, h + 2 * o), (0, 0, 0, 0))
    body = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    paper = red.resize((max(w, h), max(w, h)), Image.LANCZOS).convert("RGBA")
    for name, spec, light in (("envelope_back", (0, 0, 100, 100), .62), ("envelope_pocket", (0, POCKET_TOP, 100, 100 - POCKET_TOP), 1.0),
                              ("envelope_flap", FLAP, 1.08)):
        x0, y0, x1, y1 = box(spec, w, h)
        if name in own:
            src = own[name]
            if name != "envelope_flap":
                x0, y0, x1, y1 = 0, 0, w, h
            body.alpha_composite(src.resize((x1 - x0, y1 - y0), Image.LANCZOS), (x0, y0))
        else:
            body.alpha_composite(ImageEnhance.Brightness(paper.crop((x0, y0, x1, y1))).enhance(light), (x0, y0))
    shade = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shade.paste((20, 2, 4, 140), (o + 4, o + 10, o + w + 4, o + h + 10), mask=body.split()[3])
    canvas.alpha_composite(shade.filter(ImageFilter.GaussianBlur(10)))
    canvas.alpha_composite(body, (o, o))
    if "string" in own:
        x0, y0, x1, y1 = box(STRING, w, h)
        canvas.alpha_composite(own["string"].resize((x1 - x0, y1 - y0), Image.LANCZOS), (o + x0, o + y0))
    bw = round(w * BUTTON_W / 100)
    for cx, cy in BUTTONS:
        if "button" in own:
            b = own["button"].resize((bw, bw), Image.LANCZOS)
        else:   # a round crop of the gold leaf (a crop, as every round photo of the site)
            b = gold.resize((bw, bw), Image.LANCZOS).convert("RGBA")
            m = Image.new("L", (bw * 4, bw * 4), 0)
            ImageDraw.Draw(m).ellipse((0, 0, bw * 4 - 1, bw * 4 - 1), fill=255)
            b.putalpha(m.resize((bw, bw), Image.LANCZOS))
        canvas.alpha_composite(b, (o + round(w * cx / 100) - bw // 2, o + round(h * cy / 100) - bw // 2))
    if "xi_gold" in own:
        x0, y0, x1, y1 = box(XI, w, h)
        canvas.alpha_composite(own["xi_gold"].resize((x1 - x0, x1 - x0), Image.LANCZOS), (o + x0, o + y0))
    return canvas


def envelope_measured(h: int, own: dict, stage: dict) -> Image.Image:
    """The closed envelope from the measured stage (favicon): back, pocket, flap, cord, buttons, 囍."""
    w = round(h * stage["aspect"])
    o = 40
    canvas = Image.new("RGBA", (w + 2 * o, h + 2 * o), (0, 0, 0, 0))

    def put(im, b):
        x0, y0, x1, y1 = box(b, w, h)
        canvas.alpha_composite(im.resize((max(1, x1 - x0), max(1, y1 - y0)), Image.LANCZOS), (o + x0, o + y0))

    put(own["envelope_back"], stage["back"])
    put(own["envelope_pocket"], stage["pocket"])
    put(own["envelope_flap"], stage["flap"])
    if "xi_gold" in own:
        x0, y0, x1, y1 = box(XI, w, h)
        canvas.alpha_composite(own["xi_gold"].resize((x1 - x0, x1 - x0), Image.LANCZOS), (o + x0, o + y0))
    if "string" in own and "string" in stage:
        put(own["string"], stage["string"])
    if "button" in own:
        bw = round(w * BUTTON_W / 100)
        b = own["button"].resize((bw, bw), Image.LANCZOS)
        for cx, cy in stage["button_centres"]:
            canvas.alpha_composite(b, (o + round(w * cx / 100) - bw // 2, o + round(h * cy / 100) - bw // 2))
    return canvas


def halves(im: Image.Image, name: str, width: int, manifest: dict, q: int = 70) -> list[str]:
    half = im.width // 2
    tb.webp(im.crop((0, 0, half, im.height)), f"{name}_l", [width], q, manifest, out=OUT)
    tb.webp(im.crop((half, 0, im.width, im.height)), f"{name}_r", [width], q, manifest, out=OUT)
    return [manifest[f"{name}_{s}"]["files"][0]["file"] for s in ("l", "r")]


def optional_parts(manifest: dict) -> tuple[list[str], dict]:
    """W2.5–W2.19: whatever exists → img/ + the CSS rules that use it (parts.css). Returns (css rules, the parts)."""
    css, got = [], {}
    pct = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")  # noqa: E731
    full = "0 0/100% 100% no-repeat"

    # the envelope: every layer cut to its alpha box and laid by its measured edges (the back's alpha box = the envelope)
    back, pocket, flap, flap_in, cord, button = (part(n) for n in ("envelope_back", "envelope_pocket", "envelope_flap",
                                                                   "flap_inside", "string", "button"))
    if back is not None and pocket is not None and flap is not None:
        bx0, by0, bx1, by1 = alpha_box(back)
        bw, bh = bx1 - bx0, by1 - by0
        got["envelope_back"] = back.crop((bx0, by0, bx1, by1))
        got["envelope_pocket"] = pocket.crop(alpha_box(pocket))
        got["envelope_flap"] = flap.crop(alpha_box(flap))
        aspect = bw / bh
        pw, ph = got["envelope_pocket"].size
        pocket_h = 100 * (ph * bw / pw) / bh                  # at the envelope's width, in % of its height
        fw, fh = got["envelope_flap"].size
        flap_h = 100 * (fh * bw / fw) / bh
        fa = np.asarray(got["envelope_flap"])[..., 3]
        tip = 100 * (np.nonzero(fa[:, fw // 2] > 128)[0].max() + 1) / fh   # the flap's tip, % of the flap
        stage = {"aspect": round(aspect, 4), "back": [0, 0, 100, 100],
                 "pocket": [0, r2(100 - pocket_h), 100, r2(pocket_h)], "flap": [0, 0, 100, r2(flap_h)],
                 "flap_tip_pct_of_flap": r2(tip)}
        stage["button_flap_top_pct_of_flap"] = r2(tip - BUTTON_ON_TIP * 100 / flap_h)
        if flap_in is not None:
            got["flap_inside"] = flap_in.crop(alpha_box(flap_in))
            iw, ih = got["flap_inside"].size
            stage["flap_in_pct_of_flap"] = r2(100 * (ih / iw) / (fh / fw))
        flap_button_y = flap_h * stage["button_flap_top_pct_of_flap"] / 100     # % of the envelope's height
        stage["button_centres"] = [[50, r2(flap_button_y)]]
        if cord is not None:
            got["string"] = cord.crop(alpha_box(cord))
            loops = cord_loops(got["string"])
            stage["cord_loops_pct"] = loops
            if loops:
                (tx, ty, tw, _), (bx_, by_, bw_, _) = loops
                cw = BUTTON_W * LOOP_ROOM * 100 / ((tw + bw_) / 2)            # cord width, % of the envelope width
                sw_, sh_ = got["string"].size
                ch = cw * sh_ / sw_ * aspect                                    # its height, % of the envelope height
                top = flap_button_y - ch * ty / 100
                stage["string"] = [r2(50 - cw * tx / 100), r2(top), r2(cw), r2(ch)]
                stage["button_centres"].append([50, r2(top + ch * by_ / 100)])
        stage["_note"] = ("% of the closed envelope (left, top, width, height), measured on the GPT layers' alpha boxes; "
                          "the flap button and the inside face in % of the flap box")
        manifest["stage_measured"] = stage
        for name, out, size, q in (("envelope_back", "env_back", 720, 80), ("envelope_pocket", "pocket", 720, 80),
                                   ("envelope_flap", "flap", 720, 82), ("flap_inside", "flap_in", 720, 80),
                                   ("string", "string", 320, 84)):
            if name in got:
                tb.webp(got[name], out, [size], q, manifest, out=OUT)
        f = lambda out: manifest[out]["files"][0]["file"]  # noqa: E731
        css.append(f".env-back{{background:url(img/{f('env_back')}) {full};filter:none}}")
        css.append(f".pocket{{background:url(img/{f('pocket')}) {full};filter:none}}")
        css.append(f".flap-out{{background:url(img/{f('flap')}) {full};filter:drop-shadow(0 3px 4px #2c050780);box-shadow:none}}")
        if "flap_inside" in got:
            css.append(f".flap-in{{background:url(img/{f('flap_in')}) {full};filter:none}}")
        if "string" in got:
            # a hairline shadow under the red cord on the red paper (light only)
            css.append(f".string{{display:block;background:url(img/{f('string')}) {full};filter:drop-shadow(0 1px 1px #2c0507b3)}}")
        box_css = lambda b: f"left:{pct(b[0])}%;top:{pct(b[1])}%;width:{pct(b[2])}%;height:{pct(b[3])}%"  # noqa: E731
        css.append(f".stage{{--env-ratio:{stage['aspect']}}}")
        css.append(f".envelope{{aspect-ratio:{stage['aspect']}}}")
        css.append(f".pocket{{{box_css(stage['pocket'])}}}")
        css.append(f".flap{{height:{pct(stage['flap'][3])}%}}")
        if "flap_in_pct_of_flap" in stage:
            css.append(f".flap-in{{bottom:auto;height:{pct(stage['flap_in_pct_of_flap'])}%}}")
        css.append(f".b-flap{{top:{pct(stage['button_flap_top_pct_of_flap'])}%}}")
        if "string" in stage:
            css.append(f".b-body{{top:{pct(stage['button_centres'][1][1])}%}}")
            css.append(f".string{{{box_css(stage['string'])}}}")
    else:
        for name, out, size, rule in (
            ("envelope_back", "env_back", 720, ".env-back{{background:url(img/{f}) " + full + ";filter:none}}"),
            ("envelope_pocket", "pocket", 720, ".pocket{{top:0;height:100%;background:url(img/{f}) " + full + ";filter:none}}"),
            ("envelope_flap", "flap", 720, ".flap-out{{background:url(img/{f}) " + full + ";filter:none}}"),
            ("flap_inside", "flap_in", 720, ".flap-in{{background:url(img/{f}) " + full + ";filter:none}}"),
            ("string", "string", 320, ".string{{display:block;background:url(img/{f}) " + full + "}}"),
        ):
            p = part(name)
            if p is not None:
                got[name] = p
                tb.webp(p, out, [size], 84, manifest, out=OUT)
                css.append(rule.format(f=manifest[out]["files"][0]["file"]))

    if button is not None:
        got["button"] = square(trim(button))
        tb.webp(got["button"], "button", [240], 86, manifest, out=OUT)
        css.append(f".button{{background:url(img/{manifest['button']['files'][0]['file']}) {full};border-radius:0;"
                   f"filter:drop-shadow(0 2px 3px #2008);box-shadow:none}}")

    xi = part("xi_gold")
    if xi is not None:
        got["xi_gold"] = square(trim(xi))
        tb.webp(got["xi_gold"], "xi", [400], 86, manifest, out=OUT)
        css.append(f".xi{{background:url(img/{manifest['xi']['files'][0]['file']}) 50% 50%/contain no-repeat}}")
        css.append(".xi::before{content:none}")

    for name, out, cls in (("veil_outer", "veil_o", "vo"), ("veil_inner", "veil_i", "vi")):
        p = part(name)
        if p is not None:
            got[name] = p
            files = halves(trim(p), out, 300, manifest)   # half of a card ≤ 270 CSS px wide
            for side, f in zip(("l", "r"), files):
                css.append(f".{cls}.{side}{{background:url(img/{f}) {full};filter:none;opacity:1}}")

    card = part("card_small")
    if card is not None:
        keyed, win = green_window(trim(card))
        if win is None:
            print("WARNING card_small.png: no #00FF00 window found — the card stays cream paper", file=sys.stderr)
            manifest["card_small_rejected"] = "no #00FF00 window"
        else:
            got["card_small"] = keyed
            tb.webp(keyed, "card_small", [720], 80, manifest, out=OUT)
            f = manifest["card_small"]["files"][0]["file"]
            L, T, W, H = win
            manifest["card_small"]["window_pct"] = [round(v, 2) for v in win]
            # the card at its own proportions, CARD's width, in the envelope (measured stage when there is one)
            aspect = (manifest.get("stage_measured") or {}).get("aspect", STAGE)
            ch = CARD[2] / (keyed.width / keyed.height) * aspect       # % of the envelope's height
            card_box = [CARD[0], r2(max(CARD[1], (100 - ch) / 2)), CARD[2], r2(ch)]
            manifest["card_small"]["box_pct"] = card_box
            # padding % is of the containing block's width (the envelope): the window's foot + 3 % of the card's height
            below = (T + H + 3) / 100 * card_box[3] / aspect
            css.append(f".envelope>.card{{left:{pct(card_box[0])}%;top:{pct(card_box[1])}%;width:{pct(card_box[2])}%;height:{pct(card_box[3])}%}}")
            css.append(f".envelope .card{{background:url(img/{f}) {full};justify-content:flex-start;padding-top:{pct(below)}%}}")
            css.append(f".envelope .card .card-photo,.envelope .card.tight .card-photo{{position:absolute;"
                       f"left:{pct(L - .4)}%;top:{pct(T - .4)}%;width:{pct(W + .8)}%;height:{pct(H + .8)}%;aspect-ratio:auto}}")

    clouds = []
    for n in (1, 2, 3):
        c = part(f"cloud_{n}")
        if c is not None:
            got[f"cloud_{n}"] = c
            tb.webp(trim(c), f"cloud_{n}", [400], 84, manifest, out=OUT)
            clouds.append("img/" + manifest[f"cloud_{n}"]["files"][0]["file"])
    if clouds:
        css.append(":root{--rl-clouds:\"" + " ".join(clouds) + "\"}")

    gate = part("moon_gate")
    if gate is not None:
        keyed, win = green_window(trim(gate))
        if win is None:
            print("WARNING moon_gate.png: no #00FF00 window found — photos stay without a gate", file=sys.stderr)
            manifest["gate_rejected"] = "no #00FF00 window"
        else:
            got["moon_gate"] = keyed
            sq = square(keyed)
            tb.webp(sq, "gate", [720], 80, manifest, out=OUT)
            f = manifest["gate"]["files"][0]["file"]
            # the window measured on the squared canvas
            dx, dy = (sq.width - keyed.width) / 2, (sq.height - keyed.height) / 2
            L, T, W, H = win
            L = (dx + keyed.width * L / 100) / sq.width * 100
            T = (dy + keyed.height * T / 100) / sq.height * 100
            W, H = keyed.width * W / 100 / sq.width * 100, keyed.height * H / 100 / sq.height * 100
            manifest["gate"]["window_pct"] = [round(v, 2) for v in (L, T, W, H)]
            # the frame fills the gate's box (nothing reaches past it into the text beside it); the round photo sits
            # in the measured window, 0.6 % under the frame's inner edge
            css.append(f".gate>.rim{{display:block;background:url(img/{f}) {full}}}")
            css.append(f".gate>.photo-slot{{position:absolute;left:{pct(L + .6)}%;top:{pct(T + .6)}%;"
                       f"width:{pct(W - 1.2)}%;height:{pct(H - 1.2)}%}}")

    band = part("peony_band")
    if band is not None:
        got["peony_band"] = band
        b = trim(band)
        tb.webp(b, "band", [800], 84, manifest, out=OUT)
        css.append(f".band-cut{{display:block;aspect-ratio:{b.width}/{b.height};background:url(img/{manifest['band']['files'][0]['file']}) 50% 50%/100% 100% no-repeat}}")

    for name, out, size, q, cls in (("jianzhi_far", "cut_far", 720, 68, ".cut-far"),        # shown at 32 % opacity
                                    ("jianzhi_near", "cut_near", 640, 78, ".cut-near"), ("tassel", "tassel", 300, 82, ".tassel")):
        p = part(name)
        if p is not None:
            got[name] = p
            t = trim(p)
            tb.webp(t, out, [size], q, manifest, out=OUT)
            css.append(f"{cls}{{display:block;aspect-ratio:{t.width}/{t.height};background:url(img/{manifest[out]['files'][0]['file']}) 50% 50%/contain no-repeat}}")
    return css, got


def main() -> int:
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    red_src, red_from, red_own = kaynak("red_paper")
    lac_src, lac_from, lac_own = kaynak("lacquer")
    cream_src, cream_from, cream_own = kaynak("cream_paper")
    red = red_src if red_own else tonla(red_src, CINNABAR, 7)
    lacquer = (lac_src if lac_own else tonla(lac_src, LACQUER, 5)).filter(ImageFilter.GaussianBlur(.5))
    cream = cream_src if cream_own else tonla(cream_src, CREAM, 5)
    gold_own = PARTS / "gold_leaf.png"
    gold = Image.open(gold_own).convert("RGB").resize((480, 480), Image.LANCZOS) if gold_own.exists() else gold_plate()
    manifest["sources"] = {"red_paper": red_from, "lacquer": lac_from, "cream_paper": cream_from,
                           "gold_leaf": str(gold_own.relative_to(ROOT)) if gold_own.exists() else
                           f"{GOLD_SRC.relative_to(ROOT)} (plain metal field {GOLD_BOX})"}

    tb.webp(lacquer, "lacquer", [640], 72, manifest, out=OUT)
    tb.webp(red, "red", [640, 1024], 76, manifest, out=OUT)
    tb.webp(cream, "cream", [640, 1024], 76, manifest, out=OUT)
    tb.webp(gold, "gold", [480], 80, manifest, out=OUT)

    slots = {}
    for key, shape, ratio in (("round", "round", 1.0), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(cream, (0, 0, cream.width, cream.height), ratio, w=640, ton=CREAM_SHADE, karisim=.55, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": "1/1"}, "story_1": {"aspect": "1/1"},
                               "story_2": {"aspect": "1/1"}, "story_3": {"aspect": "1/1"}, "venue": {"aspect": "16/9"}}
    manifest["stage"] = {"aspect": STAGE, "pocket_top_pct": POCKET_TOP, "flap_pct": FLAP, "card_pct": CARD,
                         "buttons_centre_pct": BUTTONS, "button_w_pct": BUTTON_W, "string_pct": STRING, "xi_pct": XI,
                         "gate_window_pct": GATE_WINDOW,
                         "_note": "% of the closed envelope (left, top, width, height); GPT_PROMPTS.md asks for these"}

    css, got = optional_parts(manifest)
    if "stage_measured" in manifest:   # the GPT layers' measured geometry is the envelope; the asked boxes stay as a note
        manifest["stage_asked"] = manifest.pop("stage")
        manifest["stage"] = manifest.pop("stage_measured")
    hero = PARTS / "web_hero.png"
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        got["web_hero"] = True
    else:   # the closed envelope on the lacquer ground (montage of the page's own crops, no text)
        og = lacquer.resize((1200, 1200)).crop((0, 285, 1200, 915))
        env = envelope(red, gold, 540, got, manifest["stage"])
        og.paste(env, ((1200 - env.width) // 2, (630 - env.height) // 2), env)
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed envelope (red paper + gold) on the lacquer ground",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(envelope(red, gold, 400, got, manifest["stage"]))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    optional = ["envelope_back", "envelope_pocket", "envelope_flap", "flap_inside", "button", "string", "xi_gold",
                "veil_outer", "veil_inner", "card_small", "cloud_1", "cloud_2", "cloud_3", "moon_gate", "peony_band",
                "jianzhi_far", "jianzhi_near", "tassel", "web_hero"]
    missing = [k for k in optional if k not in got] + [k for k in ("lacquer", "red_paper", "cream_paper", "gold_leaf")
                                                         if not (PARTS / f"{k}.png").exists()]
    manifest["parts"] = {"used": sorted(got), "waiting_for_gpt": missing}
    manifest["_note"] = ("G183 build from the design's own PAKET 5 parts. Nothing drawn." if not missing else
                         "G183 interim build: red paper, lacquer, cream paper and gold leaf cut and toned from other designs' "
                         "plain GPT pictures; the design's own PAKET 5 parts are taken as they arrive (GPT_PROMPTS.md, "
                         "manifest parts). Nothing drawn.")
    head = ("/* Red Lacquer & Double Happiness — GENERATED by build_images.py (do not edit): rules for the design's optional\n"
            "   GPT parts (W2.5–W2.19, GPT_PROMPTS.md) that exist in collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/.\n"
            "   A part that is not there has no rule: the page keeps its look from site.css. */\n")
    (THEME / "parts.css").write_text(head + ("\n".join(css) + "\n" if css else "/* none yet */\n"), encoding="utf-8", newline="\n")   # LF on Windows too (.gitattributes eol=lf)
    manifest["parts_css_rules"] = len(css)

    green = tb.yesil_denetle(OUT)
    manifest["checks"] = {"green": green}
    big = {f["file"]: f["bytes"] for v in manifest.values() if isinstance(v, dict) for f in v.get("files", []) if f["bytes"] > 250_000}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 140}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    mf = OUT / "manifest.json"   # LF on Windows too (.gitattributes eol=lf)
    mf.write_bytes(mf.read_bytes().replace(b"\r\n", b"\n"))
    print(json.dumps(manifest["sources"], indent=1, ensure_ascii=False))
    print(f"red-lacquer-double-happiness: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    print(f"green residue: {green}; files over 250 kB: {big}")
    if green or big:
        print("ERROR: green residue / a file over 250 kB in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > BUDGET:
        print(f"ERROR: theme folder over {BUDGET / 1e6:.1f} MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
