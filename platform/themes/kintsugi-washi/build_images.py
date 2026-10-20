#!/usr/bin/env python3
"""Kintsugi & Washi (26) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G164).

The design's own PAKET 5 parts are ordered in collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md and do not exist
yet. Until they arrive the theme is built like Nocturne (G142): every picture is cut, toned, scaled or blurred from GPT
pixels that already exist — nothing is drawn (K21, docs/11 §5.7). Interim sources (plain paper textures, no motif):

  indigo washi   collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png        deep navy paper, toned to indigo
  rice paper     collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png    white cotton paper, toned to rice ivory

Toning keeps each paper's own grain (`tonla`: the source's luminance deviation around the palette colour). When the
design's own parts are in parts/ (washi_indigo.png, washi_inner.png, rice_paper.png) they replace the interim sources
automatically. Every other PAKET 5 part is optional and taken the moment it exists (G167): the build cuts / keys /
scales it into img/ and writes `parts.css` (loaded by every page after site.css) with the rules that use it. Without the
part the rule is not written and the page keeps its interim look — so a page never asks for a picture the build did
not make, and nothing is drawn as a stand-in (K21):

  kintsugi_veins (W2.4)  vein_top/bottom/left/right   cut along the fold lines, one per fold's outside face (::after)
                         vein_glint                   the whole closed sheet minus the band: mask of the gold light
                                                      (.sheen) — the shimmer runs along the veins only
  ink_bleed (W2.5)       ink-640                      the ink-bloom photo mask (.ink) instead of the soft discs
  sumi_stroke (W2.6)     sumi_stroke-640              brush stroke painted in under the headings on rice paper
  gold_flake_1..3 (W2.7) flake_1..3-200               drifting gold leaf (site.js reads them from --kw-flakes)
  obi_band (W2.8)        obi-800                      the rice-paper band round the packet
  card_small (W2.9)      card_small-860               the card inside the folds; #00FF00 window keyed to alpha,
                                                      the portrait slot placed on the measured window
  web_hero (W2.10)       og-1200x630.jpg              share image (tema_build.og_kirp, bottom-aligned)

Outputs (img/):
  washi_indigo-640/1024   outer faces of the four folds (CSS background) and the page ground
  washi_inner-640         inside of the folds (the 90°→180° half of each fold)
  washi_night-640         the page ground (same paper, darker, finer grain: texts sit on it)
  rice-640/1024           the invitation card, the home cards, the reply panel
  ph_portrait/land/wide   neutral placeholders (rice paper, softly blurred; no person, no text)
  og-1200x630.jpg         web_hero, or the closed folded packet on indigo — a montage of the same crops the page uses
  favicon.png             the closed packet alone (tema_build.ikon; with the band and veins when they exist)
  ../parts.css            the rules for the optional parts above (comment only while none exists)

  python3 platform/themes/kintsugi-washi/build_images.py
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

COL = ROOT / "collections/26_Kintsugi_Washi"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

# palette (site.css :root)
INDIGO = (36, 46, 88)            # --indigo   #242E58  outer washi
INNER = (60, 72, 116)            # --indigo-2 #3C4874  inside of a fold
NIGHT = (22, 28, 54)             # --night    #161C36  page ground (smoother grain: text sits on it)
RICE = (243, 236, 220)           # --rice     #F3ECDC
RICE_SHADE = (228, 218, 198)     # placeholder tone

INTERIM = {
    "washi_indigo": ROOT / "collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png",
    "rice_paper": ROOT / "collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png",
}

# closed packet geometry (site.css .fold): width/height, and each fold's box in % of the packet
PACKET = 0.70
FOLDS = {                         # name: (left, top, width, height) %, brightness (light from the top-left)
    "right": ((50, 0, 50, 100), .90),
    "left": ((0, 0, 50, 100), 1.0),
    "bottom": ((0, 62, 100, 38), .94),
    "top": ((0, 0, 100, 40), 1.07),
}
BAND = (0, 45, 100, 11)           # the rice-paper band round the middle (closure)


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
    """Transparent padding to a square (the part keeps its proportions when CSS scales it per axis)."""
    s = max(im.size)
    out = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    out.alpha_composite(im, ((s - im.width) // 2, (s - im.height) // 2))
    return out


def packet(washi: Image.Image, rice: Image.Image, h: int, veins=None, obi=None) -> Image.Image:
    """The closed folded packet as the page shows it (same crops, same order, light shade at each fold edge)."""
    w = round(h * PACKET)
    canvas = Image.new("RGBA", (w + 80, h + 80), (0, 0, 0, 0))
    ox = oy = 40

    def layer(src, box, bright, offset):
        lx, ty, lw, lh = box
        x0, y0 = round(w * lx / 100), round(h * ty / 100)
        cw, ch = round(w * (lx + lw) / 100) - x0, round(h * (ty + lh) / 100) - y0
        crop = src.crop((offset[0], offset[1], offset[0] + cw, offset[1] + ch))
        crop = ImageEnhance.Brightness(crop).enhance(bright).convert("RGBA")
        shade = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        shade.paste((8, 10, 24, 120), (ox + x0 + 2, oy + y0 + 5, ox + x0 + cw + 2, oy + y0 + ch + 5))
        canvas.alpha_composite(shade.filter(ImageFilter.GaussianBlur(6)))
        canvas.alpha_composite(crop, (ox + x0, oy + y0))

    big = washi.resize((max(w, 1024), max(w, 1024)))
    layer(rice.resize((max(w, 1024), max(w, 1024))), (0, 0, 100, 100), 1.0, (0, 0))
    for i, (_, (box, bright)) in enumerate(FOLDS.items()):
        layer(big, box, bright, (37 * i, 53 * i))
    if veins is not None:
        canvas.alpha_composite(veins.resize((w, h), Image.LANCZOS), (ox, oy))
    if obi is not None:
        bx0, by0 = round(-w * .03), round(h * BAND[1] / 100)
        o = obi.resize((round(w * 1.06), round(h * BAND[3] / 100)), Image.LANCZOS)
        canvas.alpha_composite(o, (ox + bx0, oy + by0))
    else:
        layer(rice.resize((max(w, 1024), max(w, 1024))), BAND, .98, (200, 300))
    return canvas


def optional_parts(manifest: dict) -> tuple[list[str], dict]:
    """W2.4–W2.9: whatever exists → img/ + the CSS rules that use it (parts.css). Returns (css rules, the parts)."""
    css, got = [], {}
    pct = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")  # noqa: E731

    veins = part("kintsugi_veins")
    if veins is not None:
        # the sheet IS the closed packet (0.70:1): stretch to it, then cut along the fold lines (manifest stage)
        H = 1540
        W = round(H * PACKET)
        v = np.asarray(veins.resize((W, H), Image.LANCZOS)).copy()
        got["kintsugi_veins"] = veins
        cuts = {  # fold: (fold box in % of the packet, the part of it the closed packet shows)
            "top": ((0, 0, 100, 40), (0, 0, 100, 40)),
            "bottom": ((0, 62, 100, 38), (0, 62, 100, 38)),
            "left": ((0, 0, 50, 100), (0, 40, 50, 22)),
            "right": ((50, 0, 50, 100), (50, 40, 50, 22)),
        }
        for name, (fold, show) in cuts.items():
            m = np.zeros((H, W), bool)
            m[round(H * show[1] / 100):round(H * (show[1] + show[3]) / 100),
              round(W * show[0] / 100):round(W * (show[0] + show[2]) / 100)] = True
            a = v.copy()
            a[..., 3] = np.where(m, a[..., 3], 0)
            x0, y0 = round(W * fold[0] / 100), round(H * fold[1] / 100)
            x1, y1 = round(W * (fold[0] + fold[2]) / 100), round(H * (fold[1] + fold[3]) / 100)
            piece = Image.fromarray(a[y0:y1, x0:x1], "RGBA")
            tb.webp(piece, f"vein_{name}", [760 if fold[2] == 100 else 380], 86, manifest, out=OUT)
            fname = manifest[f"vein_{name}"]["files"][0]["file"]
            css.append(f".f-{name} .face.out::after{{content:\"\";position:absolute;inset:0;"
                       f"background:url(img/{fname}) 0 0/100% 100% no-repeat}}")
        # the glint: a light masked by the veins the closed packet shows (not under the band: the band hides them)
        g = v.copy()
        g[round(H * BAND[1] / 100):round(H * (BAND[1] + BAND[3]) / 100), :, 3] = 0
        tb.webp(Image.fromarray(g, "RGBA"), "vein_glint", [540], 86, manifest, out=OUT)
        gf = manifest["vein_glint"]["files"][0]["file"]
        css.append(f".sheen{{background-image:linear-gradient(105deg,#0000 40%,#fff3c8 50%,#0000 60%);"
                   f"-webkit-mask:url(img/{gf}) 0 0/100% 100% no-repeat;mask:url(img/{gf}) 0 0/100% 100% no-repeat}}")
        # the opening glint ends as the top fold starts to turn (the mask does not turn with the folds)
        css.append(".is-opening .sheen{animation-duration:430ms}")

    ink = part("ink_bleed")
    if ink is not None:
        got["ink_bleed"] = ink
        tb.webp(square(trim(ink)), "ink", [640], 86, manifest, out=OUT)
        f = manifest["ink"]["files"][0]["file"]
        u = f"url(img/{f})"
        css.append(f".js .ink{{-webkit-mask-image:{u},{u},{u};mask-image:{u},{u},{u}}}")

    stroke = part("sumi_stroke")
    if stroke is not None:
        got["sumi_stroke"] = stroke
        st = trim(stroke)
        tb.webp(st, "sumi_stroke", [640], 84, manifest, out=OUT)
        f = manifest["sumi_stroke"]["files"][0]["file"]
        r = f"{st.width}/{st.height}"
        css.append(f".paper-band h2::after,.reply-card .form-title::after{{content:\"\";display:block;width:min(66%,280px);"
                   f"aspect-ratio:{r};margin:10px auto 0;background:url(img/{f}) 0 50%/100% 100% no-repeat}}")
        # painted in from the pressed head to the dry tail once the heading has risen (scene step)
        css.append(".js .paper-band h2[data-step]::after{clip-path:inset(0 100% 0 0);"
                   "transition:clip-path 1.1s .5s cubic-bezier(.55,0,.25,1)}")
        css.append(".js .paper-band h2[data-step].in::after{clip-path:inset(0)}")

    flakes = []
    for n in (1, 2, 3):
        fl = part(f"gold_flake_{n}")
        if fl is not None:
            got[f"gold_flake_{n}"] = fl
            tb.webp(square(trim(fl)), f"flake_{n}", [200], 84, manifest, out=OUT)
            flakes.append("img/" + manifest[f"flake_{n}"]["files"][0]["file"])
    if flakes:
        css.append(":root{--kw-flakes:\"" + " ".join(flakes) + "\"}")

    obi = part("obi_band")
    if obi is not None:
        got["obi_band"] = obi
        tb.webp(trim(obi), "obi", [800], 84, manifest, out=OUT)
        f = manifest["obi"]["files"][0]["file"]
        css.append(f".band{{background:url(img/{f}) 0 0/100% 100% no-repeat}}")

    card = part("card_small")
    if card is not None:
        c = np.asarray(trim(card)).copy()
        rgb = c[..., :3].astype(np.int16)
        green = (rgb[..., 1] > 150) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 80)
        ys, xs = np.nonzero(green)
        if len(ys):
            ch, cw = c.shape[:2]
            wx0, wy0, wx1, wy1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
            # the window (+2 px of green fringe) becomes transparent; the portrait slot sits on it, 0.4 % over its edge
            c[max(wy0 - 2, 0):wy1 + 2, max(wx0 - 2, 0):wx1 + 2, 3] = 0
            got["card_small"] = card
            tb.webp(Image.fromarray(c, "RGBA"), "card_small", [860], 82, manifest, out=OUT)
            f = manifest["card_small"]["files"][0]["file"]
            L, T = 100 * wx0 / cw - .4, 100 * wy0 / ch - .4
            Wd, Hd = 100 * (wx1 - wx0) / cw + .8, 100 * (wy1 - wy0) / ch + .8
            below = 100 * wy1 / ch / PACKET + 3           # window bottom in % of the card's WIDTH (padding), + 3 % gap
            manifest["card_small"]["window_pct"] = [round(L, 2), round(T, 2), round(Wd, 2), round(Hd, 2)]
            css.append(f".fold .card{{background:url(img/{f}) 0 0/100% 100% no-repeat;justify-content:flex-start;"
                       f"padding-top:{pct(below)}%}}")
            css.append(f".fold .card .card-photo,.fold .card.tight .card-photo{{position:absolute;left:{pct(L)}%;"
                       f"top:{pct(T)}%;width:{pct(Wd)}%;height:{pct(Hd)}%;aspect-ratio:auto}}")
        else:
            print("WARNING card_small.png: no #00FF00 window found — the card stays rice paper", file=sys.stderr)
            manifest["card_small_rejected"] = "no #00FF00 window"
    return css, got


# Emekli (2026-10-20): tema 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (docs/qa/2026-10-18-*.md,
# docs/qa/2026-10-19-*.md); img/ artık bu betiğin çıktısı değil. Bu betik img/'yi silip eski geçici kesimi kurar ve
# yeni kapak / iç sayfa görsellerini yok eder, bu yüzden çalışmaz. tools/gpt_yerlestir.py bu adımı atlar.
EMEKLI = "tema 2026-10-18/19 yeniden kurulumuyla değişti; img/ elle yönetiliyor (silmemek için çalışmaz)"


def main() -> int:
    if EMEKLI:
        print(f"build_images.py çalıştırılmadı: {EMEKLI}", file=sys.stderr)
        return 2
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    washi_src, washi_from, washi_own = kaynak("washi_indigo")
    rice_src, rice_from, rice_own = kaynak("rice_paper")
    washi = washi_src if washi_own else tonla(washi_src, INDIGO, 9)
    rice = rice_src if rice_own else tonla(rice_src, RICE, 6)
    inner_path = PARTS / "washi_inner.png"
    inner = Image.open(inner_path).convert("RGB") if inner_path.exists() else tonla(washi_src, INNER, 8)
    manifest["sources"] = {"washi_indigo": washi_from, "rice_paper": rice_from,
                           "washi_inner": str(inner_path.relative_to(ROOT)) if inner_path.exists() else washi_from + " (toned lighter)"}

    tb.webp(washi, "washi_indigo", [640, 1024], 74, manifest, out=OUT)
    tb.webp(inner, "washi_inner", [640], 74, manifest, out=OUT)
    night = tonla(washi_src, NIGHT, 4).filter(ImageFilter.GaussianBlur(.6))
    tb.webp(night, "washi_night", [640], 72, manifest, out=OUT)
    tb.webp(rice, "rice", [640, 1024], 76, manifest, out=OUT)

    slots = {}
    for key, shape, ratio in (("hero_portrait", "portrait", 4 / 5), ("story", "land", 5 / 4), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(rice, (0, 0, rice.width, rice.height), ratio, w=640, ton=RICE_SHADE, karisim=.55, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": "4/5"}, "story_1": {"aspect": "4/5"},
                               "story_2": {"aspect": "5/4"}, "story_3": {"aspect": "4/5"}, "venue": {"aspect": "16/9"}}
    manifest["stage"] = {"packet_aspect": PACKET, "folds_pct": {k: v[0] for k, v in FOLDS.items()},
                         "fold_brightness": {k: v[1] for k, v in FOLDS.items()}, "band_pct": BAND,
                         "open_spread": {"width": 2.0, "height": 1.78,
                                         "_note": "side folds lie out left/right, top/bottom folds above/below"}}

    css, got = optional_parts(manifest)
    veins, obi = got.get("kintsugi_veins"), got.get("obi_band")
    hero = PARTS / "web_hero.png"
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        got["web_hero"] = True
    else:   # the closed packet on the indigo ground (montage of the page's own crops, no text)
        og = night.resize((1200, 1200)).crop((0, 285, 1200, 915))
        pk = packet(washi, rice, 470, veins, obi)
        og.paste(pk, ((1200 - pk.width) // 2, (630 - pk.height) // 2), pk)
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed packet (washi_indigo + rice) on night washi",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(packet(washi, rice, 400, veins, obi))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    optional = ["kintsugi_veins", "ink_bleed", "sumi_stroke", "gold_flake_1", "gold_flake_2", "gold_flake_3",
                "obi_band", "card_small", "web_hero"]
    missing = [k for k in optional if k not in got] + [k for k in ("washi_indigo", "rice_paper") if
                                                         not (PARTS / f"{k}.png").exists()]
    manifest["parts"] = {"used": sorted(got), "waiting_for_gpt": missing}
    manifest["_note"] = ("G164/G167 build from the design's own PAKET 5 parts. Nothing drawn." if not missing else
                         "G164 interim build: papers toned from other designs' plain GPT textures; the design's own "
                         "PAKET 5 parts are taken as they arrive (GPT_PROMPTS.md, manifest parts). Nothing drawn.")
    head = ("/* Kintsugi & Washi — GENERATED by build_images.py (do not edit): rules for the design's optional GPT parts\n"
            "   (W2.4–W2.9, GPT_PROMPTS.md) that exist in collections/26_Kintsugi_Washi/assets/gpt/parts/. A part that\n"
            "   is not there has no rule: the page keeps its look from site.css. */\n")
    (THEME / "parts.css").write_text(head + ("\n".join(css) + "\n" if css else "/* none yet */\n"), encoding="utf-8")
    manifest["parts_css_rules"] = len(css)

    green = tb.yesil_denetle(OUT)
    manifest["checks"] = {"green": green}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 140}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(manifest["sources"], indent=1))
    print(f"kintsugi-washi: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
