#!/usr/bin/env python3
"""Art Nouveau Lily (37) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G186).

The design's own PAKET 5 parts are ordered in collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md and do not
exist yet. Until they arrive the theme is built like Celestial Observatory (G168): every picture is cut, toned or scaled
from GPT pixels that already exist — nothing is drawn (K21, docs/11 §5.7). Interim sources (plain papers, no motif):

  cream paper    collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png        warm ivory paper, toned cream
  sage ground    collections/13_Enchanted_Forest/assets/gpt/parts/bg_tile.png   mottled pale-green paper, toned deep sage
  lilac lining   collections/15_Cherry_Blossom/assets/gpt/parts/bg_tile.png     pale blush paper, toned lilac

Toning keeps each paper's own grain (`tonla`). When the design's own parts are in parts/ they are taken the moment they
exist (G167): the build scales / keys / mirrors each into img/ and writes `parts.css` (loaded by every page after
site.css) with the rules that use it. A part that is not there has no rule — the page keeps its interim look and never
asks for a picture the build did not make; nothing is drawn as a stand-in (K21):

  cream_paper (W2.1)      paper-640/1024          the envelope paper, cards, bands, the reply form
  sage_paper (W2.2)       sage-640                the page ground
  lilac_lining (W2.3)     lining-640              the envelope's lining and the back of every petal flap
  env_back (W2.4)         env_back-900            the open envelope's back with its lining (the envelope canvas)
  env_pocket (W2.5)       env_pocket-900          the pocket the card rises from (same canvas)
  petal_left/right/centre env petal_l/r/c-900     the three petal flaps (same canvas); each also mirrored into a mask
     (W2.6)               + petal_l/r/c_m-900     (petal_*_m) that cuts the lilac lining of the petal's back face
  lily_medallion (W2.7)   medallion-400           the stained-glass lily where the petal points meet
  card_small (W2.8)       card_small-860          the card from the pocket; arched #00FF00 window measured + mask_card
  arch_window (W2.9)      arch-640 + mask_arch    the stained-glass arch round every portrait photo; window measured
  halo (W2.10)            halo-900                the gold mosaic halo behind the home card (Mucha)
  lily_spray (W2.11)      lily-480                lily sprays beside the home card and over the signatures
  whiplash (W2.12)        whip-800                the gold whiplash line drawn under the headings
  petal_drift (W2.13)     petal-128               lily petals that drift down when a reply is sent (--anl-petals)
  web_hero (W2.14)        og-1200x630.jpg         share image (tema_build.og_kirp, bottom-aligned)

Outputs without parts (img/): paper, sage, lining, placeholders ph_arch / ph_wide, og montage of the closed envelope on
the sage ground (the page's own paper crops), favicon.

  python3 platform/themes/art-nouveau-lily/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/37_Art_Nouveau_Lily"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

# palette (site.css :root)
CREAM = (244, 236, 219)          # --cream  #F4ECDB  envelope and card paper
SAGE = (85, 99, 78)              # --sage   #55634E  page ground
LILAC = (200, 182, 214)          # --lilac  #C8B6D6  lining
CREAM_SHADE = (226, 218, 198)    # placeholder tone

INTERIM = {
    "cream_paper": ROOT / "collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png",
    "sage_paper": ROOT / "collections/13_Enchanted_Forest/assets/gpt/parts/bg_tile.png",
    "lilac_lining": ROOT / "collections/15_Cherry_Blossom/assets/gpt/parts/bg_tile.png",
}

# the envelope canvas (GPT W2.4–W2.6 are drawn on it, stacked 1:1): width / height, as .envelope in site.css
STAGE = 0.758
CANVAS = (1000, 1320)
CARD = (11, 8, 78, 82)           # the card that rises from the pocket (left, top, width, height % of the stage)
# the interim cuts (site.css clip-path polygons, % of the stage) — the og montage and favicon use the same cuts
POCKET = [(0, 61), (24, 59), (42, 56.5), (50, 55), (58, 56.5), (76, 59), (100, 61), (100, 100), (0, 100)]
PETAL_L = [(0, 0), (24, 0), (34, 14), (42, 30), (48, 45), (50, 57), (38, 65), (22, 75), (8, 83), (0, 87)]
PETAL_R = [(100 - x, y) for x, y in PETAL_L]
PETAL_C = [(0, 0), (100, 0), (97, 12), (88, 27), (74, 42), (58, 54), (50, 61), (42, 54), (26, 42), (12, 27), (3, 12)]


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
    """#00FF00 window of a part: (RGBA with the window + 2 px fringe made transparent, (L, T, W, H) % of the image,
    the window's own mask as an L image) or (None, None, None) when the part has no green window."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 150) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 80) & (c[..., 3] > 128)
    ys, xs = np.nonzero(green)
    if not len(ys):
        return None, None, None
    h, w = c.shape[:2]
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    m = Image.fromarray((green * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
    c[..., 3] = np.where(np.asarray(m) > 0, 0, c[..., 3])
    win = m.crop((x0, y0, x1, y1))
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h), win


def mask_png(win: Image.Image, name: str, manifest: dict, max_w: int = 480) -> str:
    """The window's shape as a white-on-transparent PNG (the photo slot's CSS mask; docs/11 §5.6)."""
    if win.width > max_w:
        win = win.resize((max_w, round(win.height * max_w / win.width)), Image.LANCZOS)
    m = Image.new("RGBA", win.size, (255, 255, 255, 0))
    m.putalpha(win)
    p = OUT / f"mask_{name}.png"
    m.save(p, optimize=True)
    manifest[f"mask_{name}"] = {"file": p.name, "size": list(win.size), "bytes": p.stat().st_size}
    return p.name


def on_canvas(im: Image.Image) -> Image.Image:
    """An envelope-canvas part at the stage's size (the parts are drawn on one canvas and stacked 1:1)."""
    return im if im.size == CANVAS else im.resize(CANVAS, Image.LANCZOS)


def alpha_box(im: Image.Image, esik: int = 8):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def register(parts: dict) -> tuple[dict, dict]:
    """The envelope layers laid by their measured alpha boxes on one registered canvas (eye check 2026-10-22).

    GPT drew W2.4–W2.6 on one canvas but drifted between them: the right petal came 20 % smaller than the left one and
    stopped short of the right edge (the lilac back showed beside it), the centre petal started 11 % below the back's
    top and 9 % narrower (the back showed above it), the pocket came 2 % wider than the back. As in designs 39–48: the
    back's alpha box is the envelope; the pocket spans its width with its foot on the back's foot; the left petal spans
    its height from the left edge (its hinge), the right petal the same from the right edge (same proportions as the
    left, scaled up); the centre petal spans the width from the top edge (its hinge). Each is scaled uniformly and set
    on a canvas of the envelope's size, so site.css keeps its stacked 1:1 layers and edge hinges. Returns (the layers,
    the measured boxes in % of the envelope)."""
    back = parts["env_back"].crop(alpha_box(parts["env_back"]))
    W, H = back.size
    out, boxes = {"env_back": back}, {"env_back": [0, 0, 100, 100]}

    def lay(name, fit, anchor):
        im = parts[name].crop(alpha_box(parts[name]))
        k = W / im.width if fit == "width" else H / im.height
        w, h = round(im.width * k), round(im.height * k)
        x = {"left": 0, "right": W - w, "centre": (W - w) // 2}[anchor[0]]
        y = {"top": 0, "bottom": H - h}[anchor[1]]
        c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        c.paste(im.resize((w, h), Image.LANCZOS), (x, y), im.resize((w, h), Image.LANCZOS))
        out[name] = c
        boxes[name] = [round(100 * x / W, 2), round(100 * y / H, 2), round(100 * w / W, 2), round(100 * h / H, 2)]
        boxes[name + "_scale"] = round(k, 3)

    if "env_pocket" in parts:
        lay("env_pocket", "width", ("centre", "bottom"))
    if "petal_left" in parts:
        lay("petal_left", "height", ("left", "top"))
    if "petal_right" in parts:
        lay("petal_right", "height", ("right", "top"))
    if "petal_centre" in parts:
        lay("petal_centre", "width", ("centre", "top"))
    return out, boxes


def cut(src: Image.Image, poly, size) -> Image.Image:
    """The paper cut along a polygon (% of the box) — the interim petals and pocket, as site.css clip-path does."""
    w, h = size
    tile = src.resize((max(w, h), max(w, h)), Image.LANCZOS).crop((0, 0, w, h)).convert("RGBA")
    m = Image.new("L", (w * 4, h * 4), 0)
    ImageDraw.Draw(m).polygon([(x * w * 4 / 100, y * h * 4 / 100) for x, y in poly], fill=255)
    tile.putalpha(m.resize((w, h), Image.LANCZOS))
    return tile


def envelope(paper: Image.Image, h: int, layers=None) -> Image.Image:
    """The closed envelope as the page shows it: the GPT canvas layers when they exist, else the cream paper cut into
    pocket and three petals (each petal a shade darker, as site.css), with a soft contact shade."""
    w = round(h * STAGE)
    canvas = Image.new("RGBA", (w + 80, h + 80), (0, 0, 0, 0))
    o = 40
    if layers:
        body = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        for k in ("env_back", "env_pocket", "petal_left", "petal_right", "petal_centre"):
            if k in layers:
                body.alpha_composite(layers[k].resize((w, h), Image.LANCZOS))
    else:
        body = paper.resize((max(w, h), max(w, h)), Image.LANCZOS).crop((0, 0, w, h)).convert("RGBA")
        for poly, b in ((POCKET, .97), (PETAL_L, .92), (PETAL_R, .87), (PETAL_C, 1.0)):
            body.alpha_composite(cut(ImageEnhance.Brightness(paper).enhance(b), poly, (w, h)))
    shade = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shade.paste((30, 38, 26, 120), (o + 4, o + 10, o + w + 4, o + h + 10), mask=body.split()[3])
    canvas.alpha_composite(shade.filter(ImageFilter.GaussianBlur(10)))
    canvas.alpha_composite(body, (o, o))
    return canvas


def optional_parts(manifest: dict) -> tuple[list[str], dict]:
    """W2.4–W2.13: whatever exists → img/ + the CSS rules that use it (parts.css). Returns (css rules, the parts)."""
    css, got = [], {}
    pct = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")  # noqa: E731

    raw = {n: part(n) for n in ("env_back", "env_pocket", "petal_left", "petal_right", "petal_centre")}
    raw = {k: v for k, v in raw.items() if v is not None}
    registered = None
    if "env_back" in raw:
        registered, boxes = register(raw)
        aspect = registered["env_back"].width / registered["env_back"].height
        manifest["stage_measured"] = {"aspect": round(aspect, 4), "boxes_pct": boxes,
                                      "_note": "% of the envelope (the back's alpha box): where each GPT layer was laid "
                                               "(scaled uniformly) on the registered canvas the page stacks 1:1"}
        css.append(f".stage{{--env-ratio:{round(aspect, 4)}}}")
        css.append(f".envelope{{aspect-ratio:{round(aspect, 4)}}}")
    reg = lambda n, im: registered[n] if registered and n in registered else on_canvas(im)  # noqa: E731

    back = raw.get("env_back")
    if back is not None:
        got["env_back"] = reg("env_back", back)
        tb.webp(got["env_back"], "env_back", [900], 82, manifest, out=OUT)
        f = manifest["env_back"]["files"][0]["file"]
        css.append(f".env-back{{background:url(img/{f}) 0 0/100% 100% no-repeat}}")
        css.append(".env-lining{display:none}")

    pocket = part("env_pocket")
    if pocket is not None:
        got["env_pocket"] = reg("env_pocket", pocket)
        tb.webp(got["env_pocket"], "env_pocket", [900], 84, manifest, out=OUT)
        f = manifest["env_pocket"]["files"][0]["file"]
        css.append(f".env-pocket{{background:url(img/{f}) 0 0/100% 100% no-repeat;clip-path:none;filter:none}}")

    for ad, side, mirror in (("petal_left", "l", ImageOps.mirror), ("petal_right", "r", ImageOps.mirror),
                             ("petal_centre", "c", ImageOps.flip)):
        p = part(ad)
        if p is None:
            continue
        p = reg(ad, p)
        got[ad] = p
        tb.webp(p, f"petal_{side}", [900], 84, manifest, out=OUT)
        tb.webp(mirror(p), f"petal_{side}_m", [900], 60, manifest, out=OUT)   # only its alpha is used (mask)
        f, fm = manifest[f"petal_{side}"]["files"][0]["file"], manifest[f"petal_{side}_m"]["files"][0]["file"]
        css.append(f".petal-{side} .front{{background:url(img/{f}) 0 0/100% 100% no-repeat;clip-path:none;filter:none}}")
        css.append(f".petal-{side} .back{{clip-path:none;-webkit-mask:url(img/{fm}) 0 0/100% 100% no-repeat;"
                   f"mask:url(img/{fm}) 0 0/100% 100% no-repeat}}")

    med = part("lily_medallion")
    if med is not None:
        got["lily_medallion"] = med
        tb.webp(square(trim(med)), "medallion", [400], 86, manifest, out=OUT)
        f = manifest["medallion"]["files"][0]["file"]
        css.append(f".medallion{{display:block;background:url(img/{f}) 50% 50%/contain no-repeat}}")

    card = part("card_small")
    if card is not None:
        keyed, win, shape = green_window(trim(card))
        if win is None:
            print("WARNING card_small.png: no #00FF00 window found — the card stays cream paper", file=sys.stderr)
            manifest["card_small_rejected"] = "no #00FF00 window"
        else:
            got["card_small"] = keyed
            tb.webp(keyed, "card_small", [860], 82, manifest, out=OUT)
            f = manifest["card_small"]["files"][0]["file"]
            mf = mask_png(shape, "card", manifest)
            L, T, W, H = win
            manifest["card_small"]["window_pct"] = [round(v, 2) for v in win]
            # padding % is of the containing block's width (the envelope), not the card's: the window's foot + 3 % of
            # the card's height, in % of the envelope's width (the first build put the text 17 % too low)
            aspect = (manifest.get("stage_measured") or {}).get("aspect", STAGE)
            below = (T + H + 3) / 100 * CARD[3] / aspect
            manifest["card_small"]["text_top_pct_of_card"] = round(T + H + 3, 2)
            css.append(f".envelope .card{{background:url(img/{f}) 0 0/100% 100% no-repeat;justify-content:flex-start;"
                       f"padding-top:{pct(below)}%}}")
            css.append(f".envelope .card .card-photo,.envelope .card.tight .card-photo{{position:absolute;"
                       f"left:{pct(L)}%;top:{pct(T)}%;width:{pct(W)}%;height:{pct(H)}%;aspect-ratio:auto;"
                       f"-webkit-mask:url(img/{mf}) 0 0/100% 100% no-repeat;mask:url(img/{mf}) 0 0/100% 100% no-repeat}}")

    arch = part("arch_window")
    if arch is not None:
        keyed, win, shape = green_window(trim(arch))
        if win is None:
            print("WARNING arch_window.png: no #00FF00 window found — the photos stay plain windows", file=sys.stderr)
            manifest["arch_rejected"] = "no #00FF00 window"
        else:
            got["arch_window"] = keyed
            tb.webp(keyed, "arch", [640], 84, manifest, out=OUT)
            f = manifest["arch"]["files"][0]["file"]
            mf = mask_png(shape, "arch", manifest)
            L, T, W, H = win
            manifest["arch"]["window_pct"] = [round(v, 2) for v in win]
            # the frame fills the arch's box (its own ratio); the photo sits in the measured window, 0.4 % under the
            # frame's inner edge, cut to the window's shape
            css.append(f".arch{{aspect-ratio:{keyed.width}/{keyed.height}}}")
            css.append(f".arch>.frame{{display:block;background:url(img/{f}) 0 0/100% 100% no-repeat}}")
            css.append(f".arch>.photo-slot{{left:{pct(L + .4)}%;top:{pct(T + .4)}%;width:{pct(W - .8)}%;height:{pct(H - .8)}%;"
                       f"-webkit-mask:url(img/{mf}) 0 0/100% 100% no-repeat;mask:url(img/{mf}) 0 0/100% 100% no-repeat}}")

    for name, out, size, rule in (
        ("halo", "halo", 900, ".halo{{display:block;background:url(img/{f}) 50% 50%/contain no-repeat}}"),
        ("lily_spray", "lily", 480, ".lily{{display:block;background:url(img/{f}) 50% 100%/contain no-repeat}}"),
    ):
        p = part(name)
        if p is not None:
            got[name] = p
            tb.webp(trim(p) if name == "lily_spray" else square(trim(p)), out, [size], 82, manifest, out=OUT)
            f = manifest[out]["files"][0]["file"]
            css.append(rule.format(f=f))

    whip = part("whiplash")
    if whip is not None:
        got["whiplash"] = whip
        w = trim(whip)
        tb.webp(w, "whip", [800], 84, manifest, out=OUT)
        f = manifest["whip"]["files"][0]["file"]
        css.append(f".whip{{display:block;aspect-ratio:{w.width}/{w.height};background:url(img/{f}) 50% 50%/100% 100% no-repeat}}")

    drift = part("petal_drift")
    if drift is not None:
        got["petal_drift"] = drift
        tb.webp(square(trim(drift)), "petal", [128], 86, manifest, out=OUT)
        css.append(":root{--anl-petals:\"img/" + manifest["petal"]["files"][0]["file"] + "\"}")
    return css, got


def main() -> int:
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    paper_src, paper_from, paper_own = kaynak("cream_paper")
    sage_src, sage_from, sage_own = kaynak("sage_paper")
    lining_src, lining_from, lining_own = kaynak("lilac_lining")
    paper = paper_src if paper_own else tonla(paper_src, CREAM, 6)
    sage = (sage_src if sage_own else tonla(sage_src, SAGE, 5)).filter(ImageFilter.GaussianBlur(.5))
    lining = lining_src if lining_own else tonla(lining_src, LILAC, 6)
    manifest["sources"] = {"cream_paper": paper_from, "sage_paper": sage_from, "lilac_lining": lining_from}

    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)
    tb.webp(sage, "sage", [640, 1024], 72, manifest, out=OUT)
    tb.webp(lining, "lining", [640], 76, manifest, out=OUT)

    slots = {}
    for key, shape, ratio in (("portrait", "arch", 5 / 7), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), ratio, w=640, ton=CREAM_SHADE, karisim=.55, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": "5/7"}, "story_1": {"aspect": "5/7"},
                               "story_2": {"aspect": "5/7"}, "story_3": {"aspect": "5/7"}, "venue": {"aspect": "16/9"}}
    manifest["stage"] = {"aspect": STAGE, "canvas_px": list(CANVAS), "card_pct": CARD, "hinges": {
        "petal_l": "left edge (0% 50%), rotateY 0 → -122deg", "petal_r": "right edge (100% 50%), rotateY 0 → 122deg",
        "petal_c": "top edge (50% 0), rotateX 0 → 128deg"},
        "medallion_pct": [32, 43.4, 36], "pocket_cut_pct": POCKET, "petal_cuts_pct": {"l": PETAL_L, "r": PETAL_R, "c": PETAL_C},
        "_note": "% of the closed envelope (left, top, width, height); GPT W2.4–W2.6 are drawn on this canvas, stacked 1:1"}

    css, got = optional_parts(manifest)
    if "stage_measured" in manifest:   # the GPT layers' measured geometry is the envelope; the asked one stays as a note
        manifest["stage_asked"] = manifest.pop("stage")
        manifest["stage"] = manifest.pop("stage_measured")
    hero = PARTS / "web_hero.png"
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        got["web_hero"] = True
    else:   # the closed envelope on the sage ground (montage of the page's own paper cuts, no text)
        og = sage.resize((1200, 1200)).crop((0, 285, 1200, 915))
        light = Image.new("RGB", og.size, (138, 154, 122))
        mask = Image.new("L", og.size, 0)
        ImageDraw.Draw(mask).ellipse((300, -120, 900, 760), fill=110)
        og = Image.composite(light, og, mask.filter(ImageFilter.GaussianBlur(120)))
        env = envelope(paper, 520, got)
        og.paste(env, ((1200 - env.width) // 2, (630 - env.height) // 2), env)
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed envelope (cream paper cuts) on the sage ground",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(envelope(paper, 400, got))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    optional = ["env_back", "env_pocket", "petal_left", "petal_right", "petal_centre", "lily_medallion", "card_small",
                "arch_window", "halo", "lily_spray", "whiplash", "petal_drift", "web_hero"]
    missing = [k for k in optional if k not in got] + [k for k in ("cream_paper", "sage_paper", "lilac_lining") if
                                                         not (PARTS / f"{k}.png").exists()]
    manifest["parts"] = {"used": sorted(got), "waiting_for_gpt": missing}
    manifest["_note"] = ("G186 build from the design's own PAKET 5 parts. Nothing drawn." if not missing else
                         "G186 interim build: cream, sage and lilac papers toned from other designs' plain GPT pictures; "
                         "the design's own PAKET 5 parts are taken as they arrive (GPT_PROMPTS.md, manifest parts). "
                         "Nothing drawn.")
    head = ("/* Art Nouveau Lily — GENERATED by build_images.py (do not edit): rules for the design's optional GPT\n"
            "   parts (W2.4–W2.13, GPT_PROMPTS.md) that exist in collections/37_Art_Nouveau_Lily/assets/gpt/parts/.\n"
            "   A part that is not there has no rule: the page keeps its look from site.css. */\n")
    (THEME / "parts.css").write_text(head + ("\n".join(css) + "\n" if css else "/* none yet */\n"), encoding="utf-8", newline="\n")   # LF on Windows too (.gitattributes eol=lf)
    manifest["parts_css_rules"] = len(css)

    green = tb.yesil_denetle(OUT)
    manifest["checks"] = {"green": green}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 34},
                               # the sage ground is mid-dark: busy = lighter than grey 140 (no dark pixels count)
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 140}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    mf = OUT / "manifest.json"   # LF on Windows too (.gitattributes eol=lf)
    mf.write_bytes(mf.read_bytes().replace(b"\r\n", b"\n"))
    print(json.dumps(manifest["sources"], indent=1))
    print(f"art-nouveau-lily: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
