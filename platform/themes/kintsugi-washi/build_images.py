#!/usr/bin/env python3
"""Kintsugi & Washi (26) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G164).

The design's own PAKET 5 parts are ordered in collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md and do not exist
yet. Until they arrive the theme is built like Nocturne (G142): every picture is cut, toned, scaled or blurred from GPT
pixels that already exist — nothing is drawn (K21, docs/11 §5.7). Interim sources (plain paper textures, no motif):

  indigo washi   collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png        deep navy paper, toned to indigo
  rice paper     collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png    white cotton paper, toned to rice ivory

Toning keeps each paper's own grain (`tonla`: the source's luminance deviation around the palette colour). When the
design's own parts are in parts/ (washi_indigo.png, washi_inner.png, rice_paper.png) they replace the interim sources
automatically; the vein, ink, stroke and flake layers (W2.4–W2.7) need template work when they arrive (README).

Outputs (img/):
  washi_indigo-640/1024   outer faces of the four folds (CSS background) and the page ground
  washi_inner-640         inside of the folds (the 90°→180° half of each fold)
  washi_night-640         the page ground (same paper, darker, finer grain: texts sit on it)
  rice-640/1024           the invitation card, the home cards, the reply panel
  ph_portrait/land/wide   neutral placeholders (rice paper, softly blurred; no person, no text)
  og-1200x630.jpg         the closed folded packet on indigo — a montage of the same crops the page uses
  favicon.png             the closed packet alone (tema_build.ikon)

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


def packet(washi: Image.Image, rice: Image.Image, h: int) -> Image.Image:
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
    layer(rice.resize((max(w, 1024), max(w, 1024))), BAND, .98, (200, 300))
    return canvas


def main() -> int:
    manifest: dict = {"_note": "G164 interim build: papers toned from other designs' plain GPT textures until the "
                      "design's own PAKET 5 parts arrive (GPT_PROMPTS.md). Nothing drawn."}
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
                           "washi_inner": str(inner_path.relative_to(ROOT)) if inner_path.exists() else washi_from + " (toned lighter)",
                           "interim": not (washi_own and rice_own)}

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

    # share image: the closed packet on the indigo ground (montage of the page's own crops, no text)
    og = night.resize((1200, 1200)).crop((0, 285, 1200, 915))
    pk = packet(washi, rice, 470)
    og.paste(pk, ((1200 - pk.width) // 2, (630 - pk.height) // 2), pk)
    manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed packet (washi_indigo + rice) on night washi",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(packet(washi, rice, 400))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

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
