#!/usr/bin/env python3
"""Celestial Observatory (29) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G168).

The design's own PAKET 5 parts are ordered in collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md and do not
exist yet. Until they arrive the theme is built like Kintsugi & Washi (G164): every picture is cut, toned, scaled or
blurred from GPT pixels that already exist — nothing is drawn (K21, docs/11 §5.7). Interim sources (no motif):

  night sky      collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png         plain navy paper, toned to midnight
  chart paper    collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png     white cotton paper, toned silver-ivory
  brass          collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png    the plain gold field inside the seal
                                                                                     (a rectangle of metal, no laurel)

Toning keeps each paper's own grain (`tonla`). When the design's own parts are in parts/ they are taken the moment they
exist (G167): the build cuts / keys / scales each into img/ and writes `parts.css` (loaded by every page after
site.css) with the rules that use it. A part that is not there has no rule — the page keeps its interim look and never
asks for a picture the build did not make; nothing is drawn as a stand-in (K21):

  night_sky (W2.1)        sky-640/1024, night-640    the sky in the dome slit; the page ground (darker)
  chart_paper (W2.2)      paper-640/1024             cards, bands, the reply form
  dome (W2.3)             dome-900                   the observatory; its #00FF00 slit is keyed to alpha and measured
                                                     (manifest dome.slit_pct → the slit sky, beam and shutters)
  shutter (W2.4)          shutter_l/r-240            the slit shutter cut in two at its centre seam: the halves part
  star_1..3 (W2.5)        star_N-128                 stars lit one by one + the stars of the initials constellation
                                                     (site.js reads them from --co-stars; none = line only)
  star_chart (W2.6)       chart-1000                 the engraved sky that turns: opening sky, home hero, story page
  planisphere_ring (W2.7) ring-720                   the brass rim round every round photo; #00FF00 window measured
                                                     (manifest ring.window_pct); turns as the page scrolls
  astrolabe (W2.8)        astrolabe-480              signature of home and of the reply page
  moon_phases (W2.9)      moons-800                  under the headings on chart paper; phases appear left → right
  orbits (W2.10)          orbits-900                 behind the home card: engraved orbits, turning slowly
  card_small (W2.11)      card_small-860             the card that rises from the slit; round #00FF00 window keyed,
                                                     the portrait slot placed on it
  web_hero (W2.12)        og-1200x630.jpg            share image (tema_build.og_kirp, bottom-aligned)

Outputs without parts (img/): sky, night, paper, brass (the closed observatory: CSS crops of the brass rectangle round
the slit), placeholders ph_round / ph_wide, og montage of the closed observatory on the night sky, favicon.

  python3 platform/themes/celestial-observatory/build_images.py
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

COL = ROOT / "collections/29_Celestial_Observatory"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

# palette (site.css :root)
MIDNIGHT = (17, 25, 58)          # --midnight #11193A  the sky in the slit
NIGHT = (10, 15, 36)             # --night    #0A0F24  page ground (smooth grain: text sits on it)
PAPER = (238, 235, 227)          # --paper    #EEEBE3  silver-ivory chart paper
PAPER_SHADE = (214, 216, 222)    # placeholder tone (silver)

INTERIM = {
    "night_sky": ROOT / "collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png",
    "chart_paper": ROOT / "collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png",
}
BRASS_SRC = ROOT / "collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png"
BRASS_BOX = (.42, .32, .58, .48)  # the plain metal inside the seal's laurel (fractions of the 1024 px part)

# closed observatory geometry (site.css .observatory): width/height, slit and card in % of the stage
STAGE = 0.82
SLIT = (39, 4, 22, 62)            # left, top, width, height — the interim brass is masked round it
CARD = (14, 6, 72, 82)            # the card that rises from the slit (0.72:1)
RING_WINDOW = (13, 13, 74, 74)    # interim: the photo circle IS the frame (no rim)


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
    """#00FF00 window of a part: (RGBA with the window + 2 px fringe made transparent, (L, T, W, H) % of the image) or
    (None, None) when the part has no green window."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 150) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 80) & (c[..., 3] > 128)
    ys, xs = np.nonzero(green)
    if not len(ys):
        return None, None
    h, w = c.shape[:2]
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    # the green pixels themselves and a 2 px fringe round them become transparent (a round window stays round)
    m = Image.fromarray((green * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
    c[..., 3] = np.where(np.asarray(m) > 0, 0, c[..., 3])
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h)


def brass_plate() -> Image.Image:
    src = Image.open(BRASS_SRC).convert("RGB")
    w, h = src.size
    crop = src.crop(tuple(round(v * (w if i % 2 == 0 else h)) for i, v in enumerate(BRASS_BOX)))
    crop = ImageEnhance.Brightness(crop).enhance(.82)
    return ImageEnhance.Color(crop).enhance(.82).resize((640, 640), Image.LANCZOS)


def observatory(sky: Image.Image, brass: Image.Image, h: int, dome=None, slit=None) -> Image.Image:
    """The closed observatory as the page shows it: the dome (GPT, or the brass rectangle masked round the slit) over
    the night sky in its slit, the shutter closed (GPT halves, or the darker brass)."""
    w = round(h * STAGE)
    canvas = Image.new("RGBA", (w + 80, h + 80), (0, 0, 0, 0))
    o = 40
    sl = slit or SLIT
    sx0, sy0 = round(w * sl[0] / 100), round(h * sl[1] / 100)
    sx1, sy1 = round(w * (sl[0] + sl[2]) / 100), round(h * (sl[1] + sl[3]) / 100)
    canvas.paste(sky.resize((max(w, 512), max(w, 512))).crop((0, 0, sx1 - sx0, sy1 - sy0)), (o + sx0, o + sy0))
    shade = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    if dome is not None:
        body = dome.resize((w, h), Image.LANCZOS)
    else:
        body = brass.resize((max(w, h), max(w, h)), Image.LANCZOS).crop((0, 0, w, h)).convert("RGBA")
        a = np.full((h, w), 255, np.uint8)
        a[sy0:sy1, sx0:sx1] = 0
        body.putalpha(Image.fromarray(a))
    shade.paste((4, 6, 16, 130), (o + 4, o + 8, o + w + 4, o + h + 8), mask=body.split()[3])
    canvas.alpha_composite(shade.filter(ImageFilter.GaussianBlur(8)))
    canvas.alpha_composite(body, (o, o))
    # the closed shutter: the darker brass in the slit, its two halves meeting at the centre
    half = (sx1 - sx0) // 2
    sh = ImageEnhance.Brightness(brass).enhance(.72).resize((max(half, 1) * 2, sy1 - sy0)).convert("RGBA")
    canvas.alpha_composite(sh.crop((0, 0, half, sy1 - sy0)), (o + sx0, o + sy0))
    canvas.alpha_composite(ImageEnhance.Brightness(sh).enhance(.9).crop((half, 0, half * 2, sy1 - sy0)), (o + sx0 + half, o + sy0))
    return canvas


def optional_parts(manifest: dict) -> tuple[list[str], dict]:
    """W2.3–W2.11: whatever exists → img/ + the CSS rules that use it (parts.css). Returns (css rules, the parts)."""
    css, got = [], {}
    pct = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")  # noqa: E731

    dome = part("dome")
    if dome is not None:
        d = trim(dome)
        keyed, win = green_window(d)
        if win is None:
            print("WARNING dome.png: no #00FF00 slit found — the interim brass stays", file=sys.stderr)
            manifest["dome_rejected"] = "no #00FF00 slit"
        else:
            got["dome"] = keyed
            tb.webp(keyed, "dome", [900], 84, manifest, out=OUT)
            f = manifest["dome"]["files"][0]["file"]
            ratio = keyed.width / keyed.height
            manifest["dome"]["slit_pct"] = [round(v, 2) for v in win]
            L, T, W, H = win
            css.append(f".observatory{{aspect-ratio:{ratio:.4f}}}")
            css.append(f".dome{{background:url(img/{f}) 0 0/100% 100% no-repeat;-webkit-mask:none;mask:none}}")
            css.append(f".slit{{left:{pct(L)}%;top:{pct(T)}%;width:{pct(W)}%;height:{pct(H)}%}}")

    shutter = part("shutter")
    if shutter is not None:
        s = trim(shutter)
        half = s.width // 2
        got["shutter"] = s
        tb.webp(s.crop((0, 0, half, s.height)), "shutter_l", [240], 84, manifest, out=OUT)
        tb.webp(s.crop((half, 0, s.width, s.height)), "shutter_r", [240], 84, manifest, out=OUT)
        for side in ("l", "r"):
            f = manifest[f"shutter_{side}"]["files"][0]["file"]
            css.append(f".sh-{side}{{background:url(img/{f}) 0 0/100% 100% no-repeat;filter:drop-shadow(0 2px 3px #0008)}}")

    stars = []
    for n in (1, 2, 3):
        st = part(f"star_{n}")
        if st is not None:
            got[f"star_{n}"] = st
            tb.webp(square(trim(st)), f"star_{n}", [128], 86, manifest, out=OUT)
            stars.append("img/" + manifest[f"star_{n}"]["files"][0]["file"])
    if stars:
        css.append(":root{--co-stars:\"" + " ".join(stars) + "\"}")

    chart = part("star_chart")
    if chart is not None:
        got["star_chart"] = chart
        tb.webp(square(trim(chart)), "chart", [1000], 80, manifest, out=OUT)
        f = manifest["chart"]["files"][0]["file"]
        css.append(f".sky-chart{{display:block;background:url(img/{f}) 50% 50%/contain no-repeat}}")

    ring = part("planisphere_ring")
    if ring is not None:
        r = trim(ring)
        keyed, win = green_window(r)
        if win is None:
            print("WARNING planisphere_ring.png: no #00FF00 window found — photos stay without a rim", file=sys.stderr)
            manifest["ring_rejected"] = "no #00FF00 window"
        else:
            got["planisphere_ring"] = keyed
            tb.webp(keyed, "ring", [720], 84, manifest, out=OUT)
            f = manifest["ring"]["files"][0]["file"]
            manifest["ring"]["window_pct"] = [round(v, 2) for v in win]
            L, T, W, H = win
            # the rim fills the planisphere's box (nothing reaches past it into the text beside it); the round photo
            # sits in the measured window, 0.6 % under the rim's inner edge
            css.append(f".planisphere>.rim{{display:block;inset:0;background:url(img/{f}) 0 0/100% 100% no-repeat}}")
            css.append(f".planisphere>.photo-slot{{position:absolute;left:{pct(L + .6)}%;top:{pct(T + .6)}%;"
                       f"width:{pct(W - 1.2)}%;height:{pct(H - 1.2)}%}}")

    for name, out, size, rule in (
        ("astrolabe", "astrolabe", 480, ".astro{{display:block;background:url(img/{f}) 50% 50%/contain no-repeat}}"),
        ("orbits", "orbits", 900, ".orbits{{display:block;background:url(img/{f}) 50% 50%/contain no-repeat}}"),
    ):
        p = part(name)
        if p is not None:
            got[name] = p
            tb.webp(square(trim(p)), out, [size], 82, manifest, out=OUT)
            f = manifest[out]["files"][0]["file"]
            css.append(rule.format(f=f))

    moons = part("moon_phases")
    if moons is not None:
        got["moon_phases"] = moons
        m = trim(moons)
        tb.webp(m, "moons", [800], 84, manifest, out=OUT)
        f = manifest["moons"]["files"][0]["file"]
        css.append(f".moons{{display:block;aspect-ratio:{m.width}/{m.height};background:url(img/{f}) 0 50%/100% 100% no-repeat}}")

    card = part("card_small")
    if card is not None:
        keyed, win = green_window(trim(card))
        if win is None:
            print("WARNING card_small.png: no #00FF00 window found — the card stays chart paper", file=sys.stderr)
            manifest["card_small_rejected"] = "no #00FF00 window"
        else:
            got["card_small"] = keyed
            tb.webp(keyed, "card_small", [860], 82, manifest, out=OUT)
            f = manifest["card_small"]["files"][0]["file"]
            L, T, W, H = win
            manifest["card_small"]["window_pct"] = [round(v, 2) for v in win]
            card_ratio = CARD[2] / 100 * STAGE / (CARD[3] / 100)
            below = (T + H) / card_ratio + 3      # window bottom in % of the card's WIDTH (padding), + 3 % gap
            css.append(f".observatory .card{{background:url(img/{f}) 0 0/100% 100% no-repeat;justify-content:flex-start;"
                       f"padding-top:{pct(below)}%}}")
            css.append(f".observatory .card .card-photo,.observatory .card.tight .card-photo{{position:absolute;"
                       f"left:{pct(L - .4)}%;top:{pct(T - .4)}%;width:{pct(W + .8)}%;height:{pct(H + .8)}%;aspect-ratio:auto}}")
    return css, got


def main() -> int:
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    sky_src, sky_from, sky_own = kaynak("night_sky")
    paper_src, paper_from, paper_own = kaynak("chart_paper")
    sky = sky_src if sky_own else tonla(sky_src, MIDNIGHT, 7)
    paper = paper_src if paper_own else tonla(paper_src, PAPER, 6)
    night = (ImageEnhance.Brightness(sky_src).enhance(.62) if sky_own else tonla(sky_src, NIGHT, 3)).filter(ImageFilter.GaussianBlur(.6))
    brass = brass_plate()
    manifest["sources"] = {"night_sky": sky_from, "chart_paper": paper_from,
                           "brass": f"{BRASS_SRC.relative_to(ROOT)} (plain metal field {BRASS_BOX}, darkened)"}

    tb.webp(sky, "sky", [640, 1024], 74, manifest, out=OUT)
    tb.webp(night, "night", [640], 72, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)
    tb.webp(brass, "brass", [640], 78, manifest, out=OUT)

    slots = {}
    for key, shape, ratio in (("round", "round", 1.0), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), ratio, w=640, ton=PAPER_SHADE, karisim=.55, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": "1/1"}, "story_1": {"aspect": "1/1"},
                               "story_2": {"aspect": "1/1"}, "story_3": {"aspect": "1/1"}, "venue": {"aspect": "16/9"}}
    manifest["stage"] = {"aspect": STAGE, "slit_pct": SLIT, "card_pct": CARD, "ring_window_pct": RING_WINDOW,
                         "_note": "% of the closed observatory (left, top, width, height); GPT dome.png measures its own slit"}

    css, got = optional_parts(manifest)
    dome = got.get("dome")
    slit = manifest.get("dome", {}).get("slit_pct")
    hero = PARTS / "web_hero.png"
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        got["web_hero"] = True
    else:   # the closed observatory on the night sky (montage of the page's own crops, no text)
        og = night.resize((1200, 1200)).crop((0, 285, 1200, 915))
        ob = observatory(sky, brass, 500, dome, slit)
        og.paste(ob, ((1200 - ob.width) // 2, (630 - ob.height) // 2), ob)
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed observatory (brass + sky) on the night ground",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(observatory(sky, brass, 400, dome, slit))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    optional = ["dome", "shutter", "star_1", "star_2", "star_3", "star_chart", "planisphere_ring", "astrolabe",
                "moon_phases", "orbits", "card_small", "web_hero"]
    missing = [k for k in optional if k not in got] + [k for k in ("night_sky", "chart_paper") if
                                                         not (PARTS / f"{k}.png").exists()]
    manifest["parts"] = {"used": sorted(got), "waiting_for_gpt": missing}
    manifest["_note"] = ("G168 build from the design's own PAKET 5 parts. Nothing drawn." if not missing else
                         "G168 interim build: sky, paper and brass cut and toned from other designs' plain GPT pictures; "
                         "the design's own PAKET 5 parts are taken as they arrive (GPT_PROMPTS.md, manifest parts). "
                         "Nothing drawn.")
    head = ("/* Celestial Observatory — GENERATED by build_images.py (do not edit): rules for the design's optional GPT\n"
            "   parts (W2.3–W2.11, GPT_PROMPTS.md) that exist in collections/29_Celestial_Observatory/assets/gpt/parts/.\n"
            "   A part that is not there has no rule: the page keeps its look from site.css. */\n")
    (THEME / "parts.css").write_text(head + ("\n".join(css) + "\n" if css else "/* none yet */\n"), encoding="utf-8")
    manifest["parts_css_rules"] = len(css)

    green = tb.yesil_denetle(OUT)
    manifest["checks"] = {"green": green}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 140}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(manifest["sources"], indent=1))
    print(f"celestial-observatory: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
