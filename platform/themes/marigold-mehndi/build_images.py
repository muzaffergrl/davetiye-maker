#!/usr/bin/env python3
"""Marigold & Mehndi (33) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G182).

The design's own PAKET 5 parts are ordered in collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md and do not exist
yet. Until they arrive the theme is built like Celestial Observatory (G168): every picture is cut, toned, scaled or
blurred from GPT pixels that already exist — nothing is drawn (K21, docs/11 §5.7). Interim sources (no motif):

  fuchsia silk   collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_tile.png       ivory satin waves, toned fuchsia
  velvet         collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png          plain navy paper, toned velvet-fuchsia
                                                                                     (the page ground: the same, darker)
  saffron paper  collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png      white cotton paper, toned saffron-ivory
  gold           collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png    the plain gold field inside the seal
                                                                                     (a rectangle of metal, no laurel)

Toning keeps each source's own grain (`tonla`). When the design's own parts are in parts/ they are taken the moment
they exist (G167): the build cuts / keys / scales each into img/ and writes `parts.css` (loaded by every page after
site.css) with the rules that use it. A part that is not there has no rule — the page keeps its interim look and never
asks for a picture the build did not make; nothing is drawn as a stand-in (K21):

  silk (W2.1)              silk-640                    envelope back, pocket front and flap (until W2.12/W2.13)
  sleeve (W2.2)            sleeve-900                 the gold laser-cut paisley sleeve that slides off
  petal_1..3 (W2.3)        petal_N-96                 marigold petals of the opening and of a sent reply
                                                      (site.js reads them from --mm-petals; none = none)
  jharokha (W2.4)          arch-640 + mask_arch.png   the carved arch round every photo; #00FF00 window measured
                                                      (manifest jharokha.window_pct) and cut as the photo mask
  henna (W2.5)             henna-720                  the henna round the arch, flowing in line by line (mask)
  diya (W2.6)              diya-160                   brass lamps under the envelope and in the signatures
  flame (W2.7)             flame-96                   their flames, lit one by one
  garland (W2.8)           garland-900                marigold garland: top of the opening and the home hero,
                                                      small under headings
  mehndi_pattern (W2.9)    mehndi-640                 faint henna pattern behind the story page
  card_small (W2.10)       card_small-860 + mask_card the card that rises from the lining; arched #00FF00 window
                                                      keyed, the portrait slot placed and masked on it
  tassel (W2.11)           tassel-200                 the silk tassel that swings from the sleeve
  envelope_front (W2.12)   env_front-900              the pocket front with its gold piping
  flap (W2.13)             flap-900                   the front face of the straight flap
  velvet (W2.14)           velvet-640, ground-640     lining, inner face of the flap; the page ground (darker)
  paper (W2.15)            paper-640/1024             cards, bands, the reply form
  web_hero (W2.16)         og-1200x630.jpg            share image (tema_build.og_kirp, bottom-aligned)

Outputs without parts (img/): silk, velvet, ground, paper, gold (the sleeve: CSS band of it), placeholders ph_arch /
ph_wide, og montage of the closed envelope on the velvet, favicon.

  python3 platform/themes/marigold-mehndi/build_images.py
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

COL = ROOT / "collections/33_Marigold_Mehndi"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

# palette (site.css :root)
SILK = (179, 22, 94)             # --silk   #B3165E  fuchsia silk
VELVET = (92, 10, 54)            # --velvet #5C0A36  lining, inner flap
PLUM = (62, 7, 38)               # --plum   #3E0726  page ground (smooth grain: text sits on it)
PAPER = (250, 235, 208)          # --paper  #FAEBD0  saffron-ivory paper
PAPER_SHADE = (241, 217, 180)    # --paper-2 placeholder tone

INTERIM = {
    "silk": ROOT / "collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_tile.png",
    "velvet": ROOT / "collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png",
    "paper": ROOT / "collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png",
}
GOLD_SRC = ROOT / "collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png"
GOLD_BOX = (.42, .32, .58, .48)  # the plain metal inside the seal's laurel (fractions of the 1024 px part)

# closed envelope geometry (site.css .parcel): width/height, pocket, flap, sleeve and card in % of the stage
STAGE = 0.8
FLAP = (0, 0, 100, 42)            # left, top, width, height
POCKET = (0, 38, 100, 62)
SLEEVE = (-4, 30, 108, 36)
CARD = (8, 6, 84, 92)             # the card that rises from the lining (0.73:1)
PHOTO_ASPECT = 4 / 5              # theme.json photos: hero_portrait, story_1..3 = "4/5" (the jharokha window)


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
    """#00FF00 window of a part: (RGBA with the window + 2 px fringe made transparent, (L, T, W, H) % of the image,
    the window's shape as a white alpha mask cropped to its box) or (None, None, None) when there is no green window."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 150) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 80) & (c[..., 3] > 128)
    ys, xs = np.nonzero(green)
    if not len(ys):
        return None, None, None
    h, w = c.shape[:2]
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    # the green pixels themselves and a 2 px fringe round them become transparent (an arched window stays arched)
    m = Image.fromarray((green * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
    c[..., 3] = np.where(np.asarray(m) > 0, 0, c[..., 3])
    a = np.asarray(m)[y0:y1, x0:x1]
    mask = Image.fromarray(np.dstack([np.full_like(a, 255)] * 3 + [a]), "RGBA")
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h), mask


def gold_plate() -> Image.Image:
    src = Image.open(GOLD_SRC).convert("RGB")
    w, h = src.size
    crop = src.crop(tuple(round(v * (w if i % 2 == 0 else h)) for i, v in enumerate(GOLD_BOX)))
    return ImageEnhance.Color(crop).enhance(.95).resize((640, 640), Image.LANCZOS)


def envelope(silk: Image.Image, gold: Image.Image, h: int, parts: dict) -> Image.Image:
    """The closed envelope as the page shows it: the silk back, the pocket front, the flap (GPT pieces or silk crops),
    the gold sleeve across it (GPT sleeve, or the band of gold)."""
    w = round(h * STAGE)
    pad = round(w * .08) + 20
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    tex = silk.resize((max(w, 512), max(w, 512)), Image.LANCZOS)

    def box(b):
        return (pad + round(w * b[0] / 100), pad + round(h * b[1] / 100), round(w * b[2] / 100), round(h * b[3] / 100))

    def piece(img, b, bright=1.0):
        x, y, bw, bh = box(b)
        p = img.resize((bw, bh), Image.LANCZOS) if img.size != (bw, bh) and img.mode == "RGBA" else img.crop((0, 0, bw, bh))
        p = ImageEnhance.Brightness(p.convert("RGBA")).enhance(bright)
        canvas.alpha_composite(p, (x, y))

    shade = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shade.paste((20, 2, 12, 150), (pad + 6, pad + 10, pad + w + 6, pad + h + 10))
    canvas.alpha_composite(shade.filter(ImageFilter.GaussianBlur(10)))
    piece(tex, (0, 0, 100, 100), .78)
    piece(parts.get("envelope_front") or tex, POCKET, 1.04)
    piece(parts.get("flap") or tex, FLAP, .9)
    sleeve = parts.get("sleeve")
    if sleeve is None:
        sleeve = gold.resize((box(SLEEVE)[2], box(SLEEVE)[3]), Image.LANCZOS).convert("RGBA")
    piece(sleeve, SLEEVE)
    return canvas


def optional_parts(manifest: dict) -> tuple[list[str], dict]:
    """W2.2–W2.13: whatever exists → img/ + the CSS rules that use it (parts.css). Returns (css rules, the parts)."""
    css, got = [], {}
    pct = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")  # noqa: E731

    sleeve = part("sleeve")
    if sleeve is not None:
        s = trim(sleeve)
        got["sleeve"] = s
        tb.webp(s, "sleeve", [900], 84, manifest, out=OUT)
        f = manifest["sleeve"]["files"][0]["file"]
        css.append(f".sleeve-gold{{background:url(img/{f}) 0 0/100% 100% no-repeat}}")

    petals = []
    for n in (1, 2, 3):
        p = part(f"petal_{n}")
        if p is not None:
            got[f"petal_{n}"] = p
            tb.webp(square(trim(p)), f"petal_{n}", [96], 86, manifest, out=OUT)
            petals.append("img/" + manifest[f"petal_{n}"]["files"][0]["file"])
    if petals:
        css.append(":root{--mm-petals:\"" + " ".join(petals) + "\"}")

    arch = part("jharokha")
    if arch is not None:
        a = trim(arch)
        keyed, win, mask = green_window(a)
        if win is None:
            print("WARNING jharokha.png: no #00FF00 window found — photos stay without an arch", file=sys.stderr)
            manifest["jharokha_rejected"] = "no #00FF00 window"
        else:
            got["jharokha"] = keyed
            tb.webp(keyed, "arch", [640], 84, manifest, out=OUT)
            f = manifest["arch"]["files"][0]["file"]
            mask.thumbnail((480, 480), Image.LANCZOS)
            mask.save(OUT / "mask_arch.png", optimize=True)
            L, T, W, H = win
            manifest["arch"]["window_pct"] = [round(v, 2) for v in win]
            ratio = (W / 100 * keyed.width) / (H / 100 * keyed.height)
            manifest["arch"]["window_aspect"] = round(ratio, 4)
            if abs(ratio / PHOTO_ASPECT - 1) > .03:
                print(f"WARNING jharokha.png: window {ratio:.3f}:1, the photo slots crop 4:5 (theme.json)", file=sys.stderr)
            css.append(f".jharokha{{aspect-ratio:{keyed.width}/{keyed.height}}}")
            css.append(f".jharokha>.arch{{display:block;inset:0;background:url(img/{f}) 0 0/100% 100% no-repeat}}")
            css.append(f".jharokha>.photo-slot{{position:absolute;left:{pct(L)}%;top:{pct(T)}%;width:{pct(W)}%;"
                       f"height:{pct(H)}%;-webkit-mask:url(img/mask_arch.png) 0 0/100% 100% no-repeat;"
                       f"mask:url(img/mask_arch.png) 0 0/100% 100% no-repeat}}")

    henna = part("henna")
    if henna is not None:
        got["henna"] = henna
        tb.webp(henna, "henna", [720], 82, manifest, out=OUT)
        f = manifest["henna"]["files"][0]["file"]
        css.append(f".jharokha>.henna{{display:block;inset:0;background:url(img/{f}) 0 0/100% 100% no-repeat}}")

    diya = part("diya")
    if diya is not None:
        d = trim(diya)
        got["diya"] = d
        tb.webp(d, "diya", [160], 86, manifest, out=OUT)
        f = manifest["diya"]["files"][0]["file"]
        css.append(".diyas{display:flex}")
        css.append(f".diya{{aspect-ratio:{d.width}/{d.height};background:url(img/{f}) 50% 100%/contain no-repeat}}")

    flame = part("flame")
    if flame is not None:
        fl = trim(flame)
        got["flame"] = fl
        tb.webp(fl, "flame", [96], 86, manifest, out=OUT)
        f = manifest["flame"]["files"][0]["file"]
        css.append(f".flame{{aspect-ratio:{fl.width}/{fl.height};background:url(img/{f}) 50% 100%/contain no-repeat}}")

    garland = part("garland")
    if garland is not None:
        g = trim(garland)
        got["garland"] = g
        tb.webp(g, "garland", [900], 82, manifest, out=OUT)
        f = manifest["garland"]["files"][0]["file"]
        css.append(f".garland{{display:block;aspect-ratio:{g.width}/{g.height};background:url(img/{f}) 50% 0/100% 100% no-repeat}}")

    pattern = part("mehndi_pattern")
    if pattern is not None:
        got["mehndi_pattern"] = pattern
        tb.webp(pattern.convert("RGBA"), "mehndi", [640], 78, manifest, out=OUT)
        f = manifest["mehndi"]["files"][0]["file"]
        css.append(f".mehndi-ground{{display:block;background:url(img/{f}) 0 0/420px repeat}}")

    tassel = part("tassel")
    if tassel is not None:
        t = trim(tassel)
        got["tassel"] = t
        tb.webp(t, "tassel", [200], 86, manifest, out=OUT)
        f = manifest["tassel"]["files"][0]["file"]
        css.append(f".tassel{{display:block;aspect-ratio:{t.width}/{t.height};background:url(img/{f}) 50% 0/100% 100% no-repeat}}")

    for name, out, sel in (("envelope_front", "env_front", ".env-front"), ("flap", "flap", ".flap")):
        p = part(name)
        if p is not None:
            got[name] = trim(p)
            tb.webp(got[name], out, [900], 84, manifest, out=OUT)
            f = manifest[out]["files"][0]["file"]
            css.append(f"{sel}{{background:url(img/{f}) 0 0/100% 100% no-repeat}}")

    card = part("card_small")
    if card is not None:
        keyed, win, mask = green_window(trim(card))
        if win is None:
            print("WARNING card_small.png: no #00FF00 window found — the card stays saffron paper", file=sys.stderr)
            manifest["card_small_rejected"] = "no #00FF00 window"
        else:
            got["card_small"] = keyed
            tb.webp(keyed, "card_small", [860], 82, manifest, out=OUT)
            f = manifest["card_small"]["files"][0]["file"]
            mask.thumbnail((360, 360), Image.LANCZOS)
            mask.save(OUT / "mask_card.png", optimize=True)
            L, T, W, H = win
            manifest["card_small"]["window_pct"] = [round(v, 2) for v in win]
            card_ratio = CARD[2] / 100 * STAGE / (CARD[3] / 100)
            below = (T + H) / card_ratio + 3      # window bottom in % of the card's WIDTH (padding), + 3 % gap
            css.append(f".parcel .card{{background:url(img/{f}) 0 0/100% 100% no-repeat;justify-content:flex-start;"
                       f"padding-top:{pct(below)}%}}")
            css.append(f".parcel .card .card-photo,.parcel .card.tight .card-photo{{position:absolute;"
                       f"left:{pct(L - .4)}%;top:{pct(T - .4)}%;width:{pct(W + .8)}%;height:{pct(H + .8)}%;aspect-ratio:auto;"
                       f"-webkit-mask:url(img/mask_card.png) 0 0/100% 100% no-repeat;mask:url(img/mask_card.png) 0 0/100% 100% no-repeat}}")
    return css, got


def main() -> int:
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    silk_src, silk_from, silk_own = kaynak("silk")
    velvet_src, velvet_from, velvet_own = kaynak("velvet")
    paper_src, paper_from, paper_own = kaynak("paper")
    silk = silk_src if silk_own else tonla(silk_src, SILK, 20)
    velvet = velvet_src if velvet_own else tonla(velvet_src, VELVET, 9)
    ground = (ImageEnhance.Brightness(velvet_src).enhance(.66) if velvet_own else tonla(velvet_src, PLUM, 3)).filter(ImageFilter.GaussianBlur(.6))
    paper = paper_src if paper_own else tonla(paper_src, PAPER, 6)
    gold = gold_plate()
    manifest["sources"] = {"silk": silk_from, "velvet": velvet_from, "paper": paper_from,
                           "gold": f"{GOLD_SRC.relative_to(ROOT)} (plain metal field {GOLD_BOX})"}

    tb.webp(silk, "silk", [640], 70, manifest, out=OUT)
    tb.webp(velvet, "velvet", [640], 74, manifest, out=OUT)
    tb.webp(ground, "ground", [640], 72, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)
    tb.webp(gold, "gold", [640], 78, manifest, out=OUT)

    slots = {}
    for key, shape, ratio in (("portrait", "arch", PHOTO_ASPECT), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), ratio, w=640, ton=PAPER_SHADE, karisim=.55, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": "4/5"}, "story_1": {"aspect": "4/5"},
                               "story_2": {"aspect": "4/5"}, "story_3": {"aspect": "4/5"}, "venue": {"aspect": "16/9"}}
    manifest["stage"] = {"aspect": STAGE, "flap_pct": FLAP, "pocket_pct": POCKET, "sleeve_pct": SLEEVE, "card_pct": CARD,
                         "_note": "% of the closed envelope (left, top, width, height); the GPT pieces are stretched to these boxes"}

    css, got = optional_parts(manifest)
    hero = PARTS / "web_hero.png"
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        got["web_hero"] = True
    else:   # the closed envelope on the velvet ground (montage of the page's own crops, no text)
        og = ground.resize((1200, 1200)).crop((0, 285, 1200, 915)).convert("RGBA")
        env = envelope(silk, gold, 520, got)
        og.alpha_composite(env, ((1200 - env.width) // 2, (630 - env.height) // 2))
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed envelope (silk + gold sleeve) on the velvet ground",
                          "bytes": tb.og_kaydet(og.convert("RGB"), OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(envelope(silk, gold, 400, got))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    optional = ["sleeve", "petal_1", "petal_2", "petal_3", "jharokha", "henna", "diya", "flame", "garland",
                "mehndi_pattern", "card_small", "tassel", "envelope_front", "flap", "web_hero"]
    missing = [k for k in optional if k not in got] + [k for k in ("silk", "velvet", "paper") if
                                                         not (PARTS / f"{k}.png").exists()]
    manifest["parts"] = {"used": sorted(got), "waiting_for_gpt": missing}
    manifest["_note"] = ("G182 build from the design's own PAKET 5 parts. Nothing drawn." if not missing else
                         "G182 interim build: silk, velvet, paper and gold cut and toned from other designs' plain GPT "
                         "pictures; the design's own PAKET 5 parts are taken as they arrive (GPT_PROMPTS.md, manifest "
                         "parts). Nothing drawn.")
    head = ("/* Marigold & Mehndi — GENERATED by build_images.py (do not edit): rules for the design's optional GPT\n"
            "   parts (W2.2–W2.13, GPT_PROMPTS.md) that exist in collections/33_Marigold_Mehndi/assets/gpt/parts/.\n"
            "   A part that is not there has no rule: the page keeps its look from site.css. */\n")
    (THEME / "parts.css").write_text(head + ("\n".join(css) + "\n" if css else "/* none yet */\n"), encoding="utf-8")
    manifest["parts_css_rules"] = len(css)

    green = tb.yesil_denetle(OUT)
    manifest["checks"] = {"green": green}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 28},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 140}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(manifest["sources"], indent=1))
    print(f"marigold-mehndi: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
