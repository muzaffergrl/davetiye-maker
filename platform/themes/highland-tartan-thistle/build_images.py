#!/usr/bin/env python3
"""Highland Tartan & Thistle (35) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G184.

Since 2026-10-22 every picture is the design's own PAKET 5 part (collections/35_Highland_Tartan_Thistle/assets/gpt/
GPT_PROMPTS.md), cut to its alpha box, keyed or scaled — nothing is drawn (K21, docs/11 §5.7). The interim sources below
stay only as the look of a part that is missing (none is):

  wool         collections/09_Lavender_Provence/assets/gpt/parts/bg_tile.png     plain woven linen, toned heather / moss
  moss ground  collections/17_Emerald_Gold_Estate/assets/gpt/parts/bg_tile.png   plain green velvet, toned dark moss
  cream paper  collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png           plain ivory paper, toned cream
  leather      collections/07_Burgundy_Velvet/assets/gpt/parts/bg_tile.png       plain mottled velvet, toned saddle brown
  brass        collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png   the plain gold field inside the seal
                                                                                 (a rectangle of metal, no laurel)
  mist         collections/08_Winter_Evergreen/assets/gpt/parts/bg_tile.png      pale frosted paper, blurred hard; its
                                                                                 own soft blotches become the alpha

Toning keeps each source's own grain (`tonla`). When the design's own parts are in parts/ they are taken the moment they
exist (G167): the build cuts / keys / scales each into img/ and writes `parts.css` (loaded by every page after
site.css) with the rules that use it. A part that is not there has no rule — the page keeps its interim look and never
asks for a picture the build did not make; nothing is drawn as a stand-in (K21):

  tartan_wool (W2.1)        wool-640                  the envelope (back, pocket, flap); the thank-you locket decor
  cream_paper (W2.2)        paper-640/1024            cards, bands, the reply form, the card in the envelope
  moss_ground (W2.3)        ground-640                the page ground
  hills (W2.4)              hills-1024                the oil-painted hills behind the envelope (opening)
  mist (W2.5)               mist-1024                 the two banks of mist (opening, home hero, story/details pages)
  envelope_back (W2.6)      env_back-760              the open envelope's back with its lining (one canvas with W2.7/8)
  envelope_front (W2.7)     env_front-760             the front pocket
  flap (W2.8)               flap-760                  the flap's outer face (its lining stays the darker wool)
  strap (W2.9)              strap-200                 the leather strap
  buckle (W2.10)            buckle-320                the brass buckle on the strap
  heather_sprig (W2.11)     sprig-420                 the sprig that rises out of the pocket
  heather_divider (W2.12)   divider-800               under the headings on cream paper
  heather_floret_1..3 (W2.13) floret_N-96             florets drifting down when a reply is sent (--ht-florets)
  locket_rim (W2.14)        rim-640                   the brass rim round every oval photo; #00FF00 window measured
                                                      (manifest rim.window_pct)
  locket_lid (W2.15)        lid-560                   the lid that swings open on its hinge (instead of the brass crop)
  thistle (W2.16)           thistle-400               signature of home and of the reply page
  card_small (W2.17)        card_small-760            the card in the envelope; oval #00FF00 window keyed, the
                                                      portrait slot placed on it
  web_hero (W2.18)          og-1200x630.jpg           share image (tema_build.og_kirp, bottom-aligned)

Outputs without parts (img/): wool, ground, paper, leather, brass, mist, placeholders ph_oval / ph_wide, og montage of
the closed envelope on the moss ground, favicon.

The envelope (eye check 2026-10-22): the three layers were asked on one canvas in one place, cut by the asked boxes and
stretched over them — but GPT drifted: the pocket came 2.5 % narrower than the back and stopped 3 % above its foot (the
back's dark lining showed under it), the flap started 5 % below the back's top (the back's tartan edge showed above it).
The strap came 0.13:1 instead of 0.18:1 and was squashed into its box. As in designs 39–48 each layer is cut to its alpha
box and laid by its measured edges: the back's alpha box is the envelope; the pocket spans its width with its foot on
the back's foot; the flap spans the width from the fold at its own height; the strap keeps its own proportions (its cut
end at the top edge, as if it ran over it); the buckle keeps its own and sits on the flap's lower edge; the card keeps
its own inside the pocket. manifest `stage` (the asked boxes in `stage_asked`) and parts.css carry the numbers. Photo
windows: GPT left the middle of the oval #00FF00 window of the locket rim transparent inside a soft green rim — the
window = the green + the hole it encloses, cleared, the spill round it removed.

  python3 platform/themes/highland-tartan-thistle/build_images.py
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

COL = ROOT / "collections/35_Highland_Tartan_Thistle"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

# palette (site.css :root)
HEATHER = (94, 72, 100)          # heather wool, a little deeper than --heather #7B5A84 (the pocket)
GROUND = (32, 41, 29)            # --ground   #20291D  page ground (smooth grain: text sits on it)
CREAM = (241, 234, 219)          # --cream    #F1EADB  cards, bands
CREAM_SHADE = (226, 216, 195)    # placeholder tone (--cream-2)
LEATHER = (107, 68, 40)          # --leather  #6B4428
MIST = (223, 227, 220)           # --mist     #DFE3DC

INTERIM = {
    "tartan_wool": ROOT / "collections/09_Lavender_Provence/assets/gpt/parts/bg_tile.png",
    "moss_ground": ROOT / "collections/17_Emerald_Gold_Estate/assets/gpt/parts/bg_tile.png",
    "cream_paper": ROOT / "collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png",
}
LEATHER_SRC = ROOT / "collections/07_Burgundy_Velvet/assets/gpt/parts/bg_tile.png"
MIST_SRC = ROOT / "collections/08_Winter_Evergreen/assets/gpt/parts/bg_tile.png"
BRASS_SRC = ROOT / "collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png"
BRASS_BOX = (.42, .32, .58, .48)  # the plain metal inside the seal's laurel (fractions of the 1024 px part)

# the closed envelope (site.css .satchel): width/height and the layers in % of it (left, top, width, height)
STAGE = 0.9
FRONT = (0, 34, 100, 66)          # the front pocket
FLAP = (0, 0, 100, 56)            # the straight flap on its top fold
STRAP = (42, -5, 16, 86)          # the leather strap (runs over the top edge)
BUCKLE = (36.9, 47.5, 26.2, 14.6) # the buckle on the strap (in % of the envelope)
CARD = (9, 7, 82, 86)             # the card in the pocket (0.858:1)
# measured envelope (the GPT layers laid by their alpha boxes)
FLAP_FOLD = 0                     # the flap's fold on the envelope's top edge
STRAP_W, STRAP_TOP = 12.5, -1     # strap width (% of the envelope width); its cut end just over the top edge
BUCKLE_W = 20                     # buckle width (% of the envelope width), centred on the strap at the flap's lower edge
CARD_W = 80                       # the card's width in the pocket (% of the envelope width), its own proportions
BUDGET = 2_500_000                # theme folder (docs/11 §6 allows 3 MB; the 39–48 wave keeps ≤ 2.5 MB)
LOCKET = "4/5"                    # oval photo window (aspect of every locket)


def tonla(src: Image.Image, renk, sigma: float) -> Image.Image:
    """The palette colour carrying the source's own grain: per-pixel luminance deviation × sigma levels."""
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

    The window = the green pixels + the transparent hole they enclose (GPT left the middle of the locket rim's oval
    window transparent inside a soft green rim): flood-filled from the green pixel nearest the green box's centre,
    cleared with a 2 px margin, with any other spot of key green; the spill in a 20 px ring round them is neutralised
    (green → the mean of red and blue). These frames have no green of their own."""
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


def brass_plate() -> Image.Image:
    src = Image.open(BRASS_SRC).convert("RGB")
    w, h = src.size
    crop = src.crop(tuple(round(v * (w if i % 2 == 0 else h)) for i, v in enumerate(BRASS_BOX)))
    crop = ImageEnhance.Brightness(crop).enhance(.86)
    return ImageEnhance.Color(crop).enhance(.78).resize((640, 640), Image.LANCZOS)


def mist_bank(src: Image.Image) -> Image.Image:
    """A soft bank of mist from the frosted paper: its own light blotches, blurred hard, become the alpha; the edges
    fade out (a soft vertical and side falloff — light only, no shape)."""
    g = src.convert("L").resize((512, 256), Image.LANCZOS).filter(ImageFilter.GaussianBlur(14))
    a = np.asarray(g, float)
    a = (a - a.min()) / (a.max() - a.min() + 1e-6)
    h, w = a.shape
    y = np.linspace(-1, 1, h)[:, None]
    x = np.linspace(-1, 1, w)[None, :]
    fall = np.clip(1 - y ** 2, 0, 1) ** 1.4 * np.clip(1 - np.abs(x) ** 3, 0, 1)
    alpha = np.clip((0.35 + 0.65 * a) * fall * 255, 0, 255).astype(np.uint8)
    rgb = np.empty((h, w, 3), np.uint8)
    rgb[...] = MIST
    im = Image.fromarray(np.dstack([rgb, alpha]), "RGBA").resize((1024, 512), Image.LANCZOS)
    return im.filter(ImageFilter.GaussianBlur(6))


def envelope(wool: Image.Image, leather: Image.Image, brass: Image.Image, h: int, got: dict, stage: dict | None = None) -> Image.Image:
    """The closed envelope as the page shows it: the wool pocket and flap (GPT parts, or the toned wool), the strap
    (GPT, or the toned leather) and the buckle (GPT, or the brass crop). With the measured stage every GPT layer sits
    in its measured box."""
    if stage and "front" in stage:
        w = round(h * stage["aspect"])
        o = 40
        canvas = Image.new("RGBA", (w + 2 * o, h + 2 * o), (0, 0, 0, 0))

        def put(im, b):
            x0, y0 = round(w * b[0] / 100), round(h * b[1] / 100)
            bw, bh = max(1, round(w * b[2] / 100)), max(1, round(h * b[3] / 100))
            canvas.alpha_composite(im.resize((bw, bh), Image.LANCZOS), (o + x0, max(0, o + y0)))

        for key, b in (("envelope_back", stage["back"]), ("envelope_front", stage["front"]), ("flap", stage["flap"])):
            put(got[key], b)
        if "strap" in stage:
            put(got["strap"], stage["strap"])
            sl, st, sw, sh = stage["strap"]
            bl, bt, bw_, bh_ = stage["buckle_in_strap"]
            put(got["buckle"], (sl + sw * bl / 100, st + sh * bt / 100, sw * bw_ / 100, sh * bh_ / 100))
        return canvas
    w = round(h * STAGE)
    o = 40
    canvas = Image.new("RGBA", (w + 2 * o, h + 2 * o), (0, 0, 0, 0))

    def box(b):
        return round(w * b[0] / 100), round(h * b[1] / 100), max(1, round(w * b[2] / 100)), max(1, round(h * b[3] / 100))

    def fill(tex, b, bright=1.0):
        x, y, bw, bh = box(b)
        t = ImageEnhance.Brightness(tex).enhance(bright).resize((max(bw, bh), max(bw, bh)), Image.LANCZOS).crop((0, 0, bw, bh))
        return t.convert("RGBA"), (o + x, o + y)

    shade = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shade.paste((8, 10, 6, 140), (o + 4, o + 10, o + w + 4, o + h + 10))
    canvas.alpha_composite(shade.filter(ImageFilter.GaussianBlur(10)))
    for key, b, bright in (("envelope_front", FRONT, 1.0), ("flap", FLAP, .9)):
        x, y, bw, bh = box(b)
        if key in got:
            canvas.alpha_composite(got[key].resize((bw, bh), Image.LANCZOS), (o + x, o + y))
        else:
            t, at = fill(wool, b, bright)
            canvas.alpha_composite(t, at)
    x, y, bw, bh = box(STRAP)
    y0 = max(y, -o + 2)
    strap = got.get("strap")
    strip = strap.resize((bw, bh), Image.LANCZOS) if strap is not None else fill(leather, STRAP)[0]
    canvas.alpha_composite(strip.crop((0, y0 - y, bw, bh)), (o + x, o + y0))
    x, y, bw, bh = box(BUCKLE)
    buckle = got.get("buckle")
    canvas.alpha_composite(buckle.resize((bw, bh), Image.LANCZOS) if buckle is not None else fill(brass, BUCKLE)[0], (o + x, o + y))
    return canvas


def optional_parts(manifest: dict) -> tuple[list[str], dict]:
    """W2.4–W2.17: whatever exists → img/ + the CSS rules that use it (parts.css). Returns (css rules, the parts)."""
    css, got = [], {}
    pct = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")  # noqa: E731

    hills = part("hills")
    if hills is not None:
        got["hills"] = hills
        tb.webp(hills.convert("RGB"), "hills", [1024], 78, manifest, out=OUT)
        f = manifest["hills"]["files"][0]["file"]
        css.append(f".opening>.hills{{display:block;background:url(img/{f}) 50% 100%/cover no-repeat}}")

    # the envelope: every layer cut to its alpha box and laid by its measured edges (the back's alpha box = the envelope)
    back, front, flap, strap, buckle = (part(n) for n in ("envelope_back", "envelope_front", "flap", "strap", "buckle"))
    box_css = lambda b: f"left:{pct(b[0])}%;top:{pct(b[1])}%;width:{pct(b[2])}%;height:{pct(b[3])}%"  # noqa: E731
    if back is not None and front is not None and flap is not None:
        got["envelope_back"] = back.crop(alpha_box(back))
        got["envelope_front"] = front.crop(alpha_box(front))
        got["flap"] = flap.crop(alpha_box(flap))
        bw, bh = got["envelope_back"].size
        aspect = bw / bh
        hgt = lambda im: 100 * (im.height * bw / im.width) / bh   # noqa: E731  (at the envelope's width, % of its height)
        front_h, flap_h = hgt(got["envelope_front"]), hgt(got["flap"])
        stage = {"aspect": round(aspect, 4), "back": [0, 0, 100, 100], "front": [0, r2(100 - front_h), 100, r2(front_h)],
                 "flap": [0, FLAP_FOLD, 100, r2(flap_h)]}
        if strap is not None and buckle is not None:
            got["strap"], got["buckle"] = trim(strap), trim(buckle)
            sh = STRAP_W * got["strap"].height / got["strap"].width * aspect       # % of the height
            stage["strap"] = [r2(50 - STRAP_W / 2), STRAP_TOP, STRAP_W, r2(sh)]
            bh_ = BUCKLE_W * got["buckle"].height / got["buckle"].width * aspect   # % of the height
            edge = FLAP_FOLD + flap_h                                              # the flap's lower edge
            # the buckle in % of the strap box (it is a child of .strap and leaves with it)
            stage["buckle_in_strap"] = [r2(50 - 50 * BUCKLE_W / STRAP_W), r2(100 * (edge - bh_ / 2 - STRAP_TOP) / sh),
                                        r2(100 * BUCKLE_W / STRAP_W), r2(100 * bh_ / sh)]
        stage["_note"] = ("% of the closed envelope (left, top, width, height), measured on the GPT layers' alpha boxes; "
                          "buckle_in_strap in % of the strap box")
        manifest["stage_measured"] = stage
        for name, out, size, sel in (("envelope_back", "env_back", 760, ".env-back"), ("envelope_front", "env_front", 760, ".env-front"),
                                     ("flap", "flap", 760, ".flap::before")):
            tb.webp(got[name], out, [size], 84, manifest, out=OUT)
            f = manifest[out]["files"][0]["file"]
            css.append(f"{sel}{{background:url(img/{f}) 0 0/100% 100% no-repeat;filter:drop-shadow(0 2px 3px #0007)}}")
        css.append(f".stage{{--env-ratio:{stage['aspect']}}}")
        css.append(f".satchel{{aspect-ratio:{stage['aspect']}}}")
        css.append(f".satchel>.env-front{{{box_css(stage['front'])}}}")
        css.append(f".satchel>.flap{{{box_css(stage['flap'])}}}")
        if "strap" in stage:
            for name, out, size, sel in (("strap", "strap", 200, ".strap"), ("buckle", "buckle", 320, ".buckle")):
                tb.webp(got[name], out, [size], 84, manifest, out=OUT)
                f = manifest[out]["files"][0]["file"]
                css.append(f"{sel}{{background:url(img/{f}) 0 0/100% 100% no-repeat}}")
            css.append(f".satchel>.strap{{{box_css(stage['strap'])}}}")
            css.append(f".strap>.buckle{{{box_css(stage['buckle_in_strap'])}}}")
    else:
        for name, out, size, sel, b in (("envelope_back", "env_back", 760, ".env-back", (0, 0, 100, 100)),
                                        ("envelope_front", "env_front", 760, ".env-front", FRONT),
                                        ("flap", "flap", 760, ".flap::before", FLAP)):
            p = part(name)
            if p is not None:
                W, H = p.size
                p = p.crop((round(W * b[0] / 100), round(H * b[1] / 100), round(W * (b[0] + b[2]) / 100), round(H * (b[1] + b[3]) / 100)))
                got[name] = p
                tb.webp(p, out, [size], 84, manifest, out=OUT)
                f = manifest[out]["files"][0]["file"]
                css.append(f"{sel}{{background:url(img/{f}) 0 0/100% 100% no-repeat;filter:drop-shadow(0 2px 3px #0007)}}")
        for name, out, size, sel in (("strap", "strap", 200, ".strap"), ("buckle", "buckle", 320, ".buckle")):
            p = part(name)
            if p is not None:
                p = trim(p)
                got[name] = p
                tb.webp(p, out, [size], 84, manifest, out=OUT)
                f = manifest[out]["files"][0]["file"]
                css.append(f"{sel}{{background:url(img/{f}) 0 0/100% 100% no-repeat}}")

    for name, out, size, rule in (
        ("heather_sprig", "sprig", 420, ".sprig{{display:block;opacity:0;background:url(img/{f}) 50% 100%/contain no-repeat}}"),
        ("heather_divider", "divider", 800, ".band-sprig{{display:block;aspect-ratio:{r};background:url(img/{f}) 50% 50%/100% 100% no-repeat}}"),
        ("thistle", "thistle", 400, ".thistle{{display:block;background:url(img/{f}) 50% 50%/contain no-repeat}}"),
    ):
        p = part(name)
        if p is not None:
            p = trim(p)
            got[name] = p
            tb.webp(p, out, [size], 84, manifest, out=OUT)
            f = manifest[out]["files"][0]["file"]
            css.append(rule.format(f=f, r=f"{p.width}/{p.height}"))

    florets = []
    for n in (1, 2, 3):
        fl = part(f"heather_floret_{n}")
        if fl is not None:
            got[f"heather_floret_{n}"] = fl
            tb.webp(square(trim(fl)), f"floret_{n}", [96], 86, manifest, out=OUT)
            florets.append("img/" + manifest[f"floret_{n}"]["files"][0]["file"])
    if florets:
        css.append(":root{--ht-florets:\"" + " ".join(florets) + "\"}")

    rim = part("locket_rim")
    if rim is not None:
        keyed, win = green_window(trim(rim))
        if win is None:
            print("WARNING locket_rim.png: no #00FF00 window found — photos stay without a rim", file=sys.stderr)
            manifest["rim_rejected"] = "no #00FF00 window"
        else:
            got["locket_rim"] = keyed
            tb.webp(keyed, "rim", [640], 84, manifest, out=OUT)
            f = manifest["rim"]["files"][0]["file"]
            manifest["rim"]["window_pct"] = [round(v, 2) for v in win]
            L, T, W, H = win
            # the rim fills the locket's box (its bail included); the oval photo and the lid sit in the measured window
            css.append(f".locket{{aspect-ratio:{keyed.width}/{keyed.height}}}")
            css.append(f".locket>.locket-rim{{display:block;background:url(img/{f}) 0 0/100% 100% no-repeat}}")
            css.append(f".locket>.locket-face,.locket>.lid{{inset:auto;left:{pct(L + .5)}%;top:{pct(T + .5)}%;width:{pct(W - 1)}%;"
                       f"height:{pct(H - 1)}%}}")

    lid = part("locket_lid")
    if lid is not None:
        got["locket_lid"] = lid
        tb.webp(trim(lid), "lid", [560], 84, manifest, out=OUT)
        f = manifest["lid"]["files"][0]["file"]
        css.append(f".locket>.lid{{background:url(img/{f}) 50% 50%/100% 100% no-repeat;border-radius:0}}")

    card = part("card_small")
    if card is not None:
        keyed, win = green_window(trim(card))
        if win is None:
            print("WARNING card_small.png: no #00FF00 window found — the card stays cream paper", file=sys.stderr)
            manifest["card_small_rejected"] = "no #00FF00 window"
        else:
            got["card_small"] = keyed
            tb.webp(keyed, "card_small", [760], 82, manifest, out=OUT)
            f = manifest["card_small"]["files"][0]["file"]
            L, T, W, H = win
            manifest["card_small"]["window_pct"] = [round(v, 2) for v in win]
            # the card at its own proportions in the pocket (measured stage when there is one)
            aspect = (manifest.get("stage_measured") or {}).get("aspect", STAGE)
            ch = CARD_W / (keyed.width / keyed.height) * aspect       # % of the envelope's height
            card_box = [r2(50 - CARD_W / 2), r2((100 - ch) / 2), CARD_W, r2(ch)]
            manifest["card_small"]["box_pct"] = card_box
            # padding % is of the containing block's width (the envelope): the window's foot + 3 % of the card's height
            below = (T + H + 3) / 100 * card_box[3] / aspect
            css.append(f".satchel>.card{{{box_css(card_box)}}}")
            css.append(f".satchel .card{{background:url(img/{f}) 0 0/100% 100% no-repeat;justify-content:flex-start;"
                       f"padding-top:{pct(below)}%}}")
            css.append(f".satchel .card .card-photo,.satchel .card.tight .card-photo{{position:absolute;"
                       f"left:{pct(L - .4)}%;top:{pct(T - .4)}%;width:{pct(W + .8)}%;height:{pct(H + .8)}%;aspect-ratio:auto}}")
    return css, got


def main() -> int:
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    wool_src, wool_from, wool_own = kaynak("tartan_wool")
    ground_src, ground_from, ground_own = kaynak("moss_ground")
    paper_src, paper_from, paper_own = kaynak("cream_paper")
    wool = wool_src if wool_own else tonla(wool_src, HEATHER, 9)
    ground = (ground_src if ground_own else tonla(ground_src, GROUND, 4)).filter(ImageFilter.GaussianBlur(.5))
    paper = paper_src if paper_own else tonla(paper_src, CREAM, 6)
    leather = tonla(Image.open(LEATHER_SRC).convert("RGB"), LEATHER, 11)
    brass = brass_plate()
    mist_own = part("mist")
    mist = trim(mist_own) if mist_own is not None else mist_bank(Image.open(MIST_SRC).convert("RGB"))
    manifest["sources"] = {"tartan_wool": wool_from, "moss_ground": ground_from, "cream_paper": paper_from,
                           "leather": f"{LEATHER_SRC.relative_to(ROOT)} (toned saddle brown)",
                           "brass": f"{BRASS_SRC.relative_to(ROOT)} (plain metal field {BRASS_BOX})",
                           "mist": "parts/mist.png" if mist_own is not None else
                           f"{MIST_SRC.relative_to(ROOT)} (blurred; its own blotches as alpha)"}

    tb.webp(wool, "wool", [640], 76, manifest, out=OUT)
    tb.webp(ground, "ground", [640], 72, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)
    tb.webp(leather.resize((480, 480), Image.LANCZOS), "leather", [480], 76, manifest, out=OUT)
    tb.webp(brass, "brass", [640], 78, manifest, out=OUT)
    tb.webp(mist, "mist", [1024], 70, manifest, out=OUT)

    slots = {}
    for key, shape, ratio in (("oval", "oval", 4 / 5), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), ratio, w=640, ton=CREAM_SHADE, karisim=.55, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": LOCKET}, "story_1": {"aspect": LOCKET},
                               "story_2": {"aspect": LOCKET}, "story_3": {"aspect": LOCKET}, "venue": {"aspect": "16/9"}}
    manifest["stage"] = {"aspect": STAGE, "front_pct": FRONT, "flap_pct": FLAP, "strap_pct": STRAP, "buckle_pct": BUCKLE,
                         "card_pct": CARD, "_note": "% of the closed envelope (left, top, width, height); the GPT envelope "
                                                    "layers share one canvas of this ratio"}

    css, got = optional_parts(manifest)
    if "stage_measured" in manifest:   # the GPT layers' measured geometry is the envelope; the asked boxes stay as a note
        manifest["stage_asked"] = manifest.pop("stage")
        manifest["stage"] = manifest.pop("stage_measured")
    for k, own in (("tartan_wool", wool_own), ("moss_ground", ground_own), ("cream_paper", paper_own), ("mist", mist_own is not None)):
        if own:
            got[k] = True
    hero = PARTS / "web_hero.png"
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        got["web_hero"] = True
    else:   # the closed envelope on the moss ground with a bank of mist (montage of the page's own crops, no text)
        og = ground.resize((1200, 1200)).crop((0, 285, 1200, 915)).convert("RGBA")
        bank = mist.resize((1500, 300), Image.LANCZOS)
        og.alpha_composite(bank, (-150, 360))
        env = envelope(wool, leather, brass, 520, got, manifest["stage"])
        og.alpha_composite(env, ((1200 - env.width) // 2, (630 - env.height) // 2))
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed envelope (wool, leather, brass) on the moss ground",
                          "bytes": tb.og_kaydet(og.convert("RGB"), OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(envelope(wool, leather, brass, 400, got, manifest["stage"]))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    optional = ["tartan_wool", "cream_paper", "moss_ground", "hills", "mist", "envelope_back", "envelope_front", "flap",
                "strap", "buckle", "heather_sprig", "heather_divider", "heather_floret_1", "heather_floret_2",
                "heather_floret_3", "locket_rim", "locket_lid", "thistle", "card_small", "web_hero"]
    missing = [k for k in optional if k not in got]
    manifest["parts"] = {"used": sorted(got), "waiting_for_gpt": missing}
    manifest["_note"] = ("G184 build from the design's own PAKET 5 parts. Nothing drawn." if not missing else
                         "G184 interim build: wool, ground, paper, leather, brass and mist cut, toned and blurred from "
                         "other designs' plain GPT pictures; the design's own PAKET 5 parts are taken as they arrive "
                         "(GPT_PROMPTS.md, manifest parts). Nothing drawn.")
    head = ("/* Highland Tartan & Thistle — GENERATED by build_images.py (do not edit): rules for the design's optional GPT\n"
            "   parts (W2.4–W2.17, GPT_PROMPTS.md) that exist in collections/35_Highland_Tartan_Thistle/assets/gpt/parts/.\n"
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
    print(json.dumps(manifest["sources"], indent=1))
    print(f"highland-tartan-thistle: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
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
