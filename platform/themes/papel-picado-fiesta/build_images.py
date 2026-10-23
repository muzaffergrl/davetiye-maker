#!/usr/bin/env python3
"""Papel Picado Fiesta (38) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G187).

The design's own PAKET 5 parts are ordered in collections/38_Papel_Picado_Fiesta/assets/gpt/GPT_PROMPTS.md and do not
exist yet. Until they arrive the theme is built like Celestial Observatory (G168): every picture is cut, toned, scaled or
blurred from GPT pixels that already exist — nothing is drawn (K21, docs/11 §5.7). Interim sources (no motif):

  kraft paper     collections/04_Vintage_Airmail/assets/gpt/parts/bg_tile.png       aged tan paper, toned to kraft brown
  limewash wall   collections/11_Boho_Pampas/assets/gpt/parts/bg_tile.png           warm paper, toned to a pale limewash
  cream paper     collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png     white cotton paper, toned cream
  terracotta      collections/11_Boho_Pampas/assets/gpt/parts/bg_tile.png           the same warm paper, toned terracotta
  tissue (×6)     collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png     cotton paper toned to the six fiesta
                                                                                     colours; plain rectangles cut from it
                                                                                     stand in for the cut-paper flags

Toning keeps each paper's own grain (`tonla`). When the design's own parts are in parts/ they are taken the moment they
exist (G167): the build cuts / keys / scales each into img/ and writes `parts.css` (loaded by every page after site.css)
with the rules that use it. A part that is not there has no rule — the page keeps its interim look and never asks for a
picture the build did not make; nothing is drawn as a stand-in (K21):

  kraft_paper (W1)        kraft-640/1024            the envelope, the order-of-the-day card
  limewash_wall (W2)      wall-640/1024             the page ground
  cream_paper (W3)        paper-640/1024            cards, bands, the reply form, the card from the envelope
  terracotta (W4)         terra-640                 the terracotta band of home ("The Day")
  envelope_pocket (W5)    pocket-720                the envelope back (the pocket the card rises from)
  envelope_flap (W6)      flap-720                  the straight flap, outside (closed; it swings up on its top edge)
  flap_liner (W7)         liner-720                 the flap's inside: embroidered fabric, shown once it is open
  flag_1..6 (W8)          flag_N-200                the cut-paper flags: the belly band of the closed envelope, the
                                                     garland they fly up to, the home garland, the order-of-the-day
                                                     rows, the flutter after a reply (same names interim and GPT)
  bulb (W9)               bulb-96                   the string lights that light one by one (site.js reads them from
                                                     --pf-bulb; none = no bulbs)
  frame_1..3 (W10)        frame_N-720               cut-paper photo frames; #00FF00 window keyed and measured
                                                     (manifest frame_N.window_pct → the photo sits in it)
  frame_wide (W11)        frame_wide-1100           the venue photo's frame (16:9 window, measured)
  bougainvillea (W12)     bloom-720                 corner clusters of the home card and the signature
  embroidery_band (W13)   embroidery-1200           section dividers (a band of embroidered fabric)
  web_hero (W14)          og-1200x630.jpg           share image (tema_build.og_kirp, bottom-aligned)

Outputs without parts (img/): kraft, wall, paper, terra, tissue_1..6 (the interim mats round the photos), flag_1..6
(plain tissue rectangles), placeholders ph_portrait / ph_wide, og montage of the closed envelope on the wall, favicon.

  python3 platform/themes/papel-picado-fiesta/build_images.py
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

COL = ROOT / "collections/38_Papel_Picado_Fiesta"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

# palette (site.css :root)
KRAFT = (183, 138, 91)           # --kraft  #B78A5B
WALL = (245, 233, 216)           # --wall   #F5E9D8  page ground (smooth grain: text sits on it)
PAPER = (251, 244, 232)          # --paper  #FBF4E8
TERRA = (176, 80, 47)            # --terra  #B0502F
PAPER_SHADE = (236, 220, 200)    # placeholder tone
# the six tissue colours of the flags (fuchsia, marigold, turquoise, lime, violet, coral) — site.css --pink … --coral
TISSUE = [(214, 58, 122), (242, 163, 27), (28, 150, 164), (118, 166, 58), (122, 79, 160), (232, 86, 55)]

INTERIM = {
    "kraft_paper": ROOT / "collections/04_Vintage_Airmail/assets/gpt/parts/bg_tile.png",
    "limewash_wall": ROOT / "collections/11_Boho_Pampas/assets/gpt/parts/bg_tile.png",
    "cream_paper": ROOT / "collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png",
    "terracotta": ROOT / "collections/11_Boho_Pampas/assets/gpt/parts/bg_tile.png",
}
TISSUE_SRC = ROOT / "collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png"

# closed envelope geometry (site.css .envelope): width/height, flap, band and card in % of the envelope
ENVELOPE = 0.74
BUDGET = 2_500_000                # theme folder (docs/11 §6 allows 3 MB; the 39–48 wave keeps ≤ 2.5 MB)
HAZE = 12                         # alpha below this is GPT haze round a cut-out part (bougainvillea): cleared
FLAP = (0, 0, 100, 30)            # left, top, width, height — the straight flap, hinged on the top edge
BAND = (0, 22, 100, 15.4)         # the belly band of six flags (each 16.67 % wide, 0.8 : 1)
CARD = (7, 5, 86, 90)             # the card in the pocket
FLAG_RATIO = 0.8                  # flag width / height
PORTRAIT = 4 / 5                  # photo slots (hero + story): the frame windows ask for 4:5
WIDE = 16 / 9


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


def green_window(im: Image.Image):
    """The #00FF00 window of a framed part (a rectangle in every frame of this design): (RGBA with the window cleared,
    (L, T, W, H) % of the image) or (None, None).

    GPT left the middle of frame_3's window transparent inside a soft green rim (the first build keyed only the green,
    and a green ring stayed round the photo). As in silver-photo-booth: the rectangle the green outlines (0.5–99.5
    percentiles, robust to a stray pixel) is cleared with a 2 px margin and the green spill in a 12 px ring round it is
    neutralised (green → the mean of red and blue)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    ys, xs = np.nonzero(green)
    if len(ys) < 256:
        return None, None
    h, w = c.shape[:2]
    x0, x1 = int(np.percentile(xs, .5)), int(np.percentile(xs, 99.5)) + 1
    y0, y1 = int(np.percentile(ys, .5)), int(np.percentile(ys, 99.5)) + 1
    c[max(0, y0 - 2):y1 + 2, max(0, x0 - 2):x1 + 2, 3] = 0
    ring = np.zeros((h, w), bool)
    ring[max(0, y0 - 14):y1 + 14, max(0, x0 - 14):x1 + 14] = True
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 4)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h)


def dehaze(im: Image.Image, below: int = HAZE) -> Image.Image:
    """A cut-out part without GPT's faint alpha haze round it: alpha below `below` → 0."""
    c = np.asarray(im.convert("RGBA")).copy()
    c[..., 3] = np.where(c[..., 3] < below, 0, c[..., 3])
    return Image.fromarray(c, "RGBA")


def tissue(n: int) -> Image.Image:
    """Interim tissue paper n (1–6): the cotton paper toned to the flag colour, a little stronger grain (fibres)."""
    src = Image.open(TISSUE_SRC).convert("RGB").resize((480, 480), Image.LANCZOS)
    return tonla(src, TISSUE[n - 1], 9)


def interim_flag(n: int) -> Image.Image:
    """A plain rectangle of tissue n (0.8 : 1) — a crop, no cut pattern (the GPT flag brings it)."""
    t = tissue(n)
    w = round(t.height * FLAG_RATIO)
    x0 = (t.width - w) // 2 + (n * 23) % 40 - 20
    return t.crop((x0, 0, x0 + w, t.height)).resize((200, 250), Image.LANCZOS)


def envelope_still(kraft: Image.Image, flags: list[Image.Image], h: int, got: dict) -> Image.Image:
    """The closed envelope as the page shows it: the pocket (GPT or kraft), the flap (GPT or the kraft darker) and the
    belly band of six flags across it."""
    w = round(h * ENVELOPE)
    o = 40
    canvas = Image.new("RGBA", (w + 2 * o, h + 2 * o), (0, 0, 0, 0))
    if "envelope_pocket" in got:
        body = got["envelope_pocket"].resize((w, h), Image.LANCZOS)
    else:
        body = kraft.resize((max(w, h), max(w, h)), Image.LANCZOS).crop((0, 0, w, h)).convert("RGBA")
    shade = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shade.paste((60, 30, 15, 120), (o + 4, o + 8, o + w + 4, o + h + 8), mask=body.split()[3])
    canvas.alpha_composite(shade.filter(ImageFilter.GaussianBlur(8)))
    canvas.alpha_composite(body, (o, o))
    fh = round(h * FLAP[3] / 100)
    if "envelope_flap" in got:
        flap = got["envelope_flap"].resize((w, fh), Image.LANCZOS)
    else:
        flap = ImageEnhance.Brightness(kraft).enhance(.9).resize((max(w, fh), max(w, fh))).crop((0, 0, w, fh)).convert("RGBA")
    canvas.alpha_composite(flap, (o, o))
    by, bh = round(h * BAND[1] / 100), round(h * BAND[3] / 100)
    fw = w / 6
    for i in range(6):
        f = flags[i].resize((max(1, round(fw)), bh), Image.LANCZOS).convert("RGBA")
        canvas.alpha_composite(f, (o + round(i * fw), o + by))
    return canvas


def optional_parts(manifest: dict) -> tuple[list[str], dict]:
    """W5–W13: whatever exists → img/ + the CSS rules that use it (parts.css). Returns (css rules, the parts)."""
    css, got = [], {}
    pct = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")  # noqa: E731

    for name, out, sel in (("envelope_pocket", "pocket", ".pocket"), ("envelope_flap", "flap", ".flap-out"),
                           ("flap_liner", "liner", ".flap-in")):
        p = part(name)
        if p is not None:
            t = trim(p)
            got[name] = t
            tb.webp(t, out, [720], 84, manifest, out=OUT)
            f = manifest[out]["files"][0]["file"]
            css.append(f"{sel}{{background:url(img/{f}) 0 0/100% 100% no-repeat;filter:none}}")
    # the envelope by the GPT pieces' own proportions (eye check 2026-10-22): the pocket came 1079×1458 (alpha box
    # 0.75:1, the asked stage 0.74) and the flap 3.30:1 instead of the asked 100 × 30 box (2.47:1) — stretched 1.34× in
    # height. Now the stage is the pocket's shape and the flap (and its liner) span the width at their own heights.
    if "envelope_pocket" in got and "envelope_flap" in got:
        pk, fl = got["envelope_pocket"], got["envelope_flap"]
        aspect = pk.width / pk.height
        flap_h = 100 * aspect * fl.height / fl.width
        stage = {"aspect": round(aspect, 4), "pocket": [0, 0, 100, 100], "flap": [0, 0, 100, round(flap_h, 2)]}
        if "flap_liner" in got:
            ln = got["flap_liner"]
            stage["liner_pct_of_flap"] = round(100 * (ln.height / ln.width) / (fl.height / fl.width), 2)
        stage["_note"] = ("% of the closed envelope (left, top, width, height), measured on the GPT pieces at their own "
                          "proportions; the flag band keeps the asked box (BAND)")
        manifest["stage_measured"] = stage
        css.append(f".stage{{--env-ratio:{stage['aspect']};--flap-h:{round(flap_h / 100, 4)}}}")
        css.append(f".envelope{{aspect-ratio:{stage['aspect']}}}")
        css.append(f".flap{{height:{pct(flap_h)}%}}")
        if "liner_pct_of_flap" in stage:
            css.append(f".flap-in{{bottom:auto;height:{pct(stage['liner_pct_of_flap'])}%}}")

    bulb = part("bulb")
    if bulb is not None:
        b = trim(bulb)
        got["bulb"] = b
        tb.webp(b, "bulb", [96], 86, manifest, out=OUT)
        f = manifest["bulb"]["files"][0]["file"]
        manifest["bulb"]["aspect"] = round(b.width / b.height, 4)
        css.append(f":root{{--pf-bulb:\"img/{f}\";--pf-bulb-ratio:{b.width / b.height:.4f}}}")

    for n in (1, 2, 3):
        fr = part(f"frame_{n}")
        if fr is None:
            continue
        keyed, win = green_window(trim(fr))
        if win is None:
            print(f"WARNING frame_{n}.png: no #00FF00 window found — the tissue mat stays", file=sys.stderr)
            manifest[f"frame_{n}_rejected"] = "no #00FF00 window"
            continue
        got[f"frame_{n}"] = keyed
        tb.webp(keyed, f"frame_{n}", [720], 80, manifest, out=OUT)   # each ≤ 250 kB
        f = manifest[f"frame_{n}"]["files"][0]["file"]
        manifest[f"frame_{n}"]["window_pct"] = [round(v, 2) for v in win]
        L, T, W, H = win
        # the frame box takes the part's ratio; the photo sits in the measured window, 0.5 % under the paper's edge
        # the cut paper casts its own shadow (its outline, not the box's)
        css.append(f".frame.f-{n}{{aspect-ratio:{keyed.width}/{keyed.height};padding:0;background:none;box-shadow:none;"
                   f"filter:drop-shadow(0 8px 9px rgb(59 36 24/.3))}}")
        css.append(f".frame.f-{n}>.cut{{display:block;background:url(img/{f}) 0 0/100% 100% no-repeat}}")
        css.append(f".frame.f-{n}>.photo-slot{{position:absolute;left:{pct(L - .5)}%;top:{pct(T - .5)}%;"
                   f"width:{pct(W + 1)}%;height:{pct(H + 1)}%;aspect-ratio:auto}}")

    wide = part("frame_wide")
    if wide is not None:
        keyed, win = green_window(trim(wide))
        if win is None:
            print("WARNING frame_wide.png: no #00FF00 window found — the venue photo keeps its tissue mat", file=sys.stderr)
            manifest["frame_wide_rejected"] = "no #00FF00 window"
        else:
            got["frame_wide"] = keyed
            tb.webp(keyed, "frame_wide", [1100], 82, manifest, out=OUT)
            f = manifest["frame_wide"]["files"][0]["file"]
            manifest["frame_wide"]["window_pct"] = [round(v, 2) for v in win]
            L, T, W, H = win
            css.append(f".frame.f-wide{{aspect-ratio:{keyed.width}/{keyed.height};padding:0;background:none;box-shadow:none;"
                       f"filter:drop-shadow(0 8px 9px rgb(59 36 24/.3))}}")
            css.append(f".frame.f-wide>.cut{{display:block;background:url(img/{f}) 0 0/100% 100% no-repeat}}")
            css.append(f".frame.f-wide>.photo-slot{{position:absolute;left:{pct(L - .5)}%;top:{pct(T - .5)}%;"
                       f"width:{pct(W + 1)}%;height:{pct(H + 1)}%;aspect-ratio:auto}}")

    bloom = part("bougainvillea")
    if bloom is not None:
        b = trim(dehaze(bloom))      # GPT left a faint alpha haze (alpha 1–11) round the cluster
        got["bougainvillea"] = b
        tb.webp(b, "bloom", [720], 82, manifest, out=OUT)
        f = manifest["bloom"]["files"][0]["file"]
        css.append(f".bloom{{display:block;aspect-ratio:{b.width}/{b.height};background:url(img/{f}) 0 0/100% 100% no-repeat}}")

    band = part("embroidery_band")
    if band is not None:
        b = trim(band)
        got["embroidery_band"] = b
        tb.webp(b, "embroidery", [1200], 82, manifest, out=OUT)
        f = manifest["embroidery"]["files"][0]
        css.append(f".embroidery{{display:block;background:url(img/{f['file']}) 0 50%/auto 100% repeat-x}}")
        manifest["embroidery"]["_note"] = "repeated along the divider at the divider's height (site.css .embroidery)"
    return css, got


def main() -> int:
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    kraft_src, kraft_from, kraft_own = kaynak("kraft_paper")
    wall_src, wall_from, wall_own = kaynak("limewash_wall")
    paper_src, paper_from, paper_own = kaynak("cream_paper")
    terra_src, terra_from, terra_own = kaynak("terracotta")
    kraft = kraft_src if kraft_own else tonla(kraft_src, KRAFT, 10)
    wall = (wall_src if wall_own else tonla(wall_src, WALL, 3)).filter(ImageFilter.GaussianBlur(.5))
    paper = paper_src if paper_own else tonla(paper_src, PAPER, 4)
    terra = terra_src if terra_own else tonla(terra_src, TERRA, 8)
    manifest["sources"] = {"kraft_paper": kraft_from, "limewash_wall": wall_from, "cream_paper": paper_from,
                           "terracotta": terra_from}

    tb.webp(kraft, "kraft", [640, 1024], 76, manifest, out=OUT)
    tb.webp(wall, "wall", [640, 1024], 72, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)
    tb.webp(terra, "terra", [640], 76, manifest, out=OUT)

    # the six flags: the GPT cut-paper flag when it exists, else a plain tissue rectangle (same file names)
    flags, flag_from = [], {}
    for n in range(1, 7):
        own = part(f"flag_{n}")
        if own is not None:
            f = trim(own)
            flag_from[f"flag_{n}"] = f"collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_{n}.png"
        else:
            f = interim_flag(n)
            flag_from[f"flag_{n}"] = f"interim: {TISSUE_SRC.relative_to(ROOT)} toned {TISSUE[n - 1]}, plain rectangle"
        flags.append(f)
        tb.webp(f, f"flag_{n}", [200], 84, manifest, out=OUT)
        tb.webp(tissue(n), f"tissue_{n}", [480], 74, manifest, out=OUT)
    manifest["flags"] = flag_from

    slots = {}
    for key, shape, ratio in (("portrait", "portrait", PORTRAIT), ("venue", "wide", WIDE)):
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), ratio, w=640, ton=PAPER_SHADE, karisim=.5, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": "4/5"}, "story_1": {"aspect": "4/5"},
                               "story_2": {"aspect": "4/5"}, "story_3": {"aspect": "4/5"}, "venue": {"aspect": "16/9"}}
    manifest["stage"] = {"aspect": ENVELOPE, "flap_pct": FLAP, "band_pct": BAND, "card_pct": CARD,
                         "flag_ratio": FLAG_RATIO,
                         "_note": "% of the closed envelope (left, top, width, height); six flags across the band"}

    css, got = optional_parts(manifest)
    if "stage_measured" in manifest:   # the GPT pieces' measured geometry is the envelope; the asked boxes stay as a note
        manifest["stage_asked"] = manifest.pop("stage")
        manifest["stage"] = manifest.pop("stage_measured")
    for n in range(1, 7):
        if (PARTS / f"flag_{n}.png").exists():
            got[f"flag_{n}"] = True
    hero = PARTS / "web_hero.png"
    still = envelope_still(kraft, flags, 470, got)
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        got["web_hero"] = True
    else:   # the closed envelope on the limewash wall, the flags of its band (montage of the page's own crops, no text)
        og = wall.resize((1200, 1200)).crop((0, 285, 1200, 915))
        og.paste(still, ((1200 - still.width) // 2, (630 - still.height) // 2), still)
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed envelope (kraft + tissue band) on the wall",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(envelope_still(kraft, flags, 400, got))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    optional = ["envelope_pocket", "envelope_flap", "flap_liner", "bulb", "frame_1", "frame_2", "frame_3",
                "frame_wide", "bougainvillea", "embroidery_band", "web_hero"] + [f"flag_{n}" for n in range(1, 7)]
    missing = [k for k in optional if k not in got] + [k for k in INTERIM if not (PARTS / f"{k}.png").exists()]
    manifest["parts"] = {"used": sorted(k for k in got if k in optional), "waiting_for_gpt": missing}
    manifest["_note"] = ("G187 build from the design's own PAKET 5 parts. Nothing drawn." if not missing else
                         "G187 interim build: kraft, wall, paper, terracotta and the tissue flags cut and toned from other "
                         "designs' plain GPT papers; the design's own PAKET 5 parts are taken as they arrive "
                         "(GPT_PROMPTS.md, manifest parts). Nothing drawn.")
    head = ("/* Papel Picado Fiesta — GENERATED by build_images.py (do not edit): rules for the design's optional GPT\n"
            "   parts (W5–W13, GPT_PROMPTS.md) that exist in collections/38_Papel_Picado_Fiesta/assets/gpt/parts/.\n"
            "   A part that is not there has no rule: the page keeps its look from site.css. */\n")
    (THEME / "parts.css").write_text(head + ("\n".join(css) + "\n" if css else "/* none yet */\n"), encoding="utf-8", newline="\n")   # LF on Windows too (.gitattributes eol=lf)
    manifest["parts_css_rules"] = len(css)

    green = tb.yesil_denetle(OUT)
    # the green flag (flag_4 / tissue_4), the embroidery's and the bougainvillea's leaves are green by nature; a frame
    # (a keyed window) must be clean
    manifest["checks"] = {"green": green, "_note": "flag_4 / tissue_4 / embroidery / liner / bloom: the parts' own green, "
                                                   "not key residue; frames must be clean"}
    big = {f["file"]: f["bytes"] for v in manifest.values() if isinstance(v, dict) for f in v.get("files", []) if f["bytes"] > 250_000}
    keyed_green = {k: v for k, v in green.items() if k.startswith("frame_")}
    # a light ground: theme-check's default backdrop profile (dark_below 170) applies
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    mf = OUT / "manifest.json"   # LF on Windows too (.gitattributes eol=lf)
    mf.write_bytes(mf.read_bytes().replace(b"\r\n", b"\n"))
    print(json.dumps(manifest["sources"], indent=1))
    print(f"papel-picado-fiesta: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    print(f"green (natural greens allowed): {green}; files over 250 kB: {big}")
    if keyed_green or big:
        print(f"ERROR: key green {keyed_green} / a file over 250 kB {big} in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > BUDGET:
        print(f"ERROR: theme folder over {BUDGET / 1e6:.1f} MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
