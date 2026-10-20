#!/usr/bin/env python3
"""Grand Theatre Premiere (24) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G162, GPT branch G167.

Two source modes, chosen per piece (the same output names either way, so the pages never change):

  GPT parts (PAKET 5, collections/24_Grand_Theatre_Premiere/assets/gpt/parts/ — GPT_PROMPTS.md "Claude's cut"):
    the STAGE switches as a set when proscenium.png + curtain_left.png + curtain_right.png exist (one 1024×1536
    canvas, stacked in place): the arch's #00FF00 opening and card_small's #00FF00 window are keyed transparent by
    tools/parts_prep.py (tb.prep_hazirla), the stage box = the union of the stage layers' alpha boxes, stage_back is
    cut to the arch's opening, the curtain origins, the gathered width, the card box and its window are MEASURED and
    written to img/manifest.json "stage" and to the `/* stage:begin … stage:end */` block of site.css (CSS custom
    properties) — nobody copies percentages by hand. Within the GPT stage a missing curtain_*_open / stage_back /
    card_small falls back to its interim stand-in (cut to the GPT geometry). Every other piece (velvet_tile,
    playbill_tile, ticket_stub, bg_page, tassel, web_hero, card_plain) switches on its own.

  Interim (no GPT part yet): two GPT textures that already live in the repository, only cropped, scaled, blurred and
  toned (K21: nothing is drawn, no shape is painted by code):
    VELVET  collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png              navy velvet-like texture (seamless)
            → toned to peacock teal (a duotone of its own luminance): the curtain panels, the stage, the page grounds,
              the photo placeholders
    PAPER   collections/21_Crimson_Rose_Atelier/assets/gpt/textures/paper-background.png   ivory cotton paper
            → toned to playbill ivory: the programme cards, the programme sheets, the ticket stub

Stage layers (img/, all the same stage box of one canvas; CSS stacks them with inset:0):
  th_back       the stage behind the curtains          GPT stage_back.png cut to the arch's opening
  curtain_l/r   the two closed curtain panels          GPT curtain_left.png / curtain_right.png
  curtain_gl/gr the gathered swags the closed panels hand over to   GPT curtain_left_open.png / curtain_right_open.png
  th_arch       the valance (interim) / the gilded proscenium arch with its opening keyed transparent (GPT)
  card_paper    the programme card standing on the stage (GPT card_small.png, its photo window keyed transparent)
Other pieces: card_plain (home's programme card, GPT card_plain.png), paper (playbill_tile), velvet (velvet_tile),
stub_paper (ticket_stub), room + ph_* placeholders (bg_page), og-1200x630.jpg (web_hero), favicon.png (tassel).

  python3 platform/themes/grand-theatre-premiere/build_images.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/24_Grand_Theatre_Premiere"
PARTS = COL / "assets/gpt/parts"
VELVET_SRC = ROOT / "collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png"
PAPER_SRC = ROOT / "collections/21_Crimson_Rose_Atelier/assets/gpt/textures/paper-background.png"
OUT = THEME / "img"

CANVAS = (1024, 1536)
# the stage opening on the canvas (interim; the GPT proscenium window replaces it): x0, y0, x1, y1
OPENING = (72, 96, 952, 1440)
PEACOCK_LO, PEACOCK_HI = np.array([3, 22, 25.]), np.array([47, 124, 121.])    # shadow / highlight of the velvet
IVORY = np.array([243, 235, 216.])                                              # --ivory

# GPT_PROMPTS.md "Ortak sahne ölçüleri" (canvas %) — used only where a GPT part gives nothing to measure
P_OPENING = (12, 14, 88, 92)          # the arch's stage opening (fallback when the #00FF00 window is not found)
P_CARD_W, P_CARD_FOOT = 38, 90        # the programme card on the stage: x 31–69 %, its foot at 90 % of the height
P_GATHER = 16 / 40                    # gathered swag width / closed panel width (x 11–27 vs 11–51)
# interim: where the photo sits on the plain programme card (x, y, w, h in % of the card) — the GPT card measures it
INTERIM_WINDOW = (17, 8, 66, 55)

CSS_BLOCK = re.compile(r"/\* stage:begin.*?stage:end \*/", re.S)


def tone_velvet(im: Image.Image, gamma: float = .9, lo=PEACOCK_LO, hi=PEACOCK_HI) -> Image.Image:
    """Duotone of the texture's own luminance: shadows → deep peacock, highlights → peacock teal."""
    lum = np.asarray(im.convert("L")).astype(float)
    a, b = np.percentile(lum, 1), np.percentile(lum, 99)
    t = np.clip((lum - a) / max(b - a, 1), 0, 1) ** gamma
    rgb = lo + (hi - lo) * t[..., None]
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def tone_paper(im: Image.Image) -> Image.Image:
    """Shift the paper's mean onto playbill ivory, keep its own grain."""
    p = np.asarray(im.convert("RGB")).astype(float)
    p += IVORY - p.reshape(-1, 3).mean(0)
    return Image.fromarray(np.clip(p, 0, 255).astype(np.uint8), "RGB")


def layer(fill: Image.Image, box) -> Image.Image:
    """A full-canvas transparent layer with `fill` resized into `box` (x0, y0, x1, y1)."""
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    x0, y0, x1, y1 = box
    canvas.paste(fill.convert("RGBA").resize((x1 - x0, y1 - y0), Image.LANCZOS), (x0, y0))
    return canvas


def part_path(name: str) -> Path | None:
    p = PARTS / f"{name}.png"
    return p if p.exists() else None


def to_canvas(im: Image.Image) -> Image.Image:
    """A stage part brought onto the 1024×1536 canvas: scaled when GPT returned the same proportion at another size,
    otherwise centre-cropped to the canvas proportion (a warning in the manifest)."""
    im = im.convert("RGBA")
    if im.size == CANVAS:
        return im
    W, H = CANVAS
    s = max(W / im.width, H / im.height)
    r = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (r.width - W) // 2, (r.height - H) // 2
    return r.crop((x, y, x + W, y + H))


def alpha_box(im: Image.Image, esik: int = 8):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def pct(v: float, tot: float) -> float:
    return round(100 * v / tot, 3)


def n(v) -> str:
    return f"{v:g}" if isinstance(v, (int, float)) else str(v)


# ---------------------------------------------------------------------------------------------------- GPT stage
class Prep:
    """tools/parts_prep.py run once into a temporary folder: the #00FF00 windows keyed, each transparent part cropped
    to its alpha box (+8 px); `restore` puts a part back on its source canvas."""

    def __init__(self):
        self.dir, self.win, self._tmp = tb.prep_hazirla(COL, yasak=(THEME,))
        data = json.loads((self.dir / "windows.json").read_text())
        self.layers = {k["ad"]: k for k in data["katmanlar"]}

    def restore(self, name: str) -> Image.Image:
        k = self.layers[name]
        x, y, _, _ = k["kirpma"]
        c = Image.new("RGBA", tuple(k["kaynak_olcu"]), (0, 0, 0, 0))
        c.paste(Image.open(self.dir / f"{name}.png").convert("RGBA"), (x, y))
        return c

    def window(self, name: str) -> np.ndarray | None:
        """The part's window (bool, on its source canvas), or None when parts_prep found no #00FF00 window."""
        if name not in self.win or name not in self.layers:
            return None
        k = self.layers[name]
        w, h = k["kaynak_olcu"]
        m = np.zeros((h, w), bool)
        x, y, _, _ = k["kirpma"]
        loc = tb.pencere(self.dir, self.win, name)
        m[y:y + loc.shape[0], x:x + loc.shape[1]] = loc
        return m


def mask_to_canvas(m: np.ndarray) -> np.ndarray:
    """A bool mask on a part's source canvas → on the 1024×1536 canvas (the same scaling as to_canvas)."""
    if m.shape == (CANVAS[1], CANVAS[0]):
        return m
    im = to_canvas(Image.fromarray((m * 255).astype(np.uint8)).convert("RGBA"))
    return np.asarray(im)[..., 0] > 127


def card_piece(prep: Prep | None, paper: Image.Image, sources: dict, warnings: list):
    """The programme card standing on the stage: GPT card_small.png (its #00FF00 window keyed transparent, the window
    measured in % of the card) or the interim paper card. (image, window_pct, window source, photo z-index)."""
    p = part_path("card_small")
    if p is None or prep is None or "card_small" not in prep.layers:
        sources["card_paper"] = "stand-in"
        return tb.kapla(paper, 2 / 3, .5), list(INTERIM_WINDOW), "stand-in (the photo on plain paper)", 2
    if Image.open(p).size != CANVAS:
        warnings.append(f"card_small.png is {Image.open(p).size}, not {CANVAS[0]}×{CANVAS[1]} (used as it is)")
    card = prep.restore("card_small")
    k = alpha_box(card)
    win = prep.window("card_small")
    card = card.crop(k)
    sources["card_paper"] = "gpt:parts/card_small.png"
    if win is None:
        warnings.append("card_small.png: no #00FF00 window found — the photo lies on the card (stand-in place)")
        return card, list(INTERIM_WINDOW), "stand-in (no window found)", 2
    win = tb.genislet(win, 2)[k[1]:k[3], k[0]:k[2]]                  # the photo reaches 2 px under the frame
    wy, wx = np.nonzero(win)
    cw0, ch0 = card.size
    window = [pct(wx.min(), cw0), pct(wy.min(), ch0), pct(wx.max() + 1 - wx.min(), cw0), pct(wy.max() + 1 - wy.min(), ch0)]
    return card, window, "measured (#00FF00 window of card_small.png)", 0  # the card lies over the photo


# ---------------------------------------------------------------------------------------------------- site.css
def sync_css(css_vars: dict) -> None:
    """Writes the stage geometry (manifest stage.css) into site.css between `/* stage:begin` and `stage:end */`."""
    body = ";".join(f"{k}:{v}" for k, v in css_vars.items())
    block = ("/* stage:begin — written by build_images.py from img/manifest.json stage.css (GPT parts or interim); "
             f"do not edit by hand */\n:root{{{body}}}\n/* stage:end */")
    css = THEME / "site.css"
    s = css.read_text(encoding="utf-8")
    if not CSS_BLOCK.search(s):
        raise SystemExit("site.css: the /* stage:begin … stage:end */ block is missing")
    new = CSS_BLOCK.sub(lambda _m: block, s)
    if new != s:
        css.write_text(new, encoding="utf-8")
        print("site.css: stage block updated from the manifest")


# Emekli (2026-10-20): tema 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (docs/qa/2026-10-18-*.md,
# docs/qa/2026-10-19-*.md); img/ artık bu betiğin çıktısı değil. Bu betik img/'yi silip eski geçici kesimi kurar ve
# yeni kapak / iç sayfa görsellerini yok eder, bu yüzden çalışmaz. tools/gpt_yerlestir.py bu adımı atlar.
EMEKLI = "tema 2026-10-18/19 yeniden kurulumuyla değişti; img/ elle yönetiliyor (silmemek için çalışmaz)"


def main() -> int:
    if EMEKLI:
        print(f"build_images.py çalıştırılmadı: {EMEKLI}", file=sys.stderr)
        return 2
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()
    sources: dict[str, str] = {}
    warnings: list[str] = []

    velvet_src = Image.open(VELVET_SRC).convert("RGB")
    vw, vh = velvet_src.size
    velvet = tone_velvet(velvet_src)
    paper = tone_paper(Image.open(PAPER_SRC))

    x0, y0, x1, y1 = OPENING
    W, H = x1 - x0, y1 - y0
    cx = (x0 + x1) // 2
    seam = round(W * .015)                                            # the panels overlap at the centre seam
    # two different crops of the velvet for the two panels (tall strips, scaled to the panel)
    left_fill = velvet.crop((0, 0, vw // 2, vh))
    right_fill = velvet.crop((vw // 2, 0, vw, vh)).transpose(Image.FLIP_TOP_BOTTOM)
    deep = ImageEnhance.Brightness(velvet.filter(ImageFilter.GaussianBlur(6))).enhance(.42)
    valance = ImageEnhance.Brightness(velvet.crop((0, 0, vw, vh // 4))).enhance(.72)
    widths = [440, 880]

    gpt_stage = all(part_path(p) for p in ("proscenium", "curtain_left", "curtain_right"))
    prep = Prep() if (gpt_stage or part_path("card_small")) else None
    manifest: dict = {"_note": ("G162/G167 build. The stage comes from the PAKET 5 GPT parts (measured)." if gpt_stage else
                                "G162 build on stand-in pieces toned/cropped from two GPT textures already in the "
                                "repository (06 velvet tile, 21 paper) until the PAKET 5 parts of GPT_PROMPTS.md arrive.")}

    if not gpt_stage:
        # ------------------------------------------------------------ interim stage (unchanged since G162)
        box = (x0, y0, x1, y1)                                        # interim stage box = the opening
        crop = lambda im: im.crop(box)                                # noqa: E731 — every layer to the stage box
        tb.webp(crop(layer(deep, OPENING)), "th_back", widths, 72, manifest, out=OUT)
        cl = layer(left_fill, (x0, y0, cx + seam, y1))
        cr = layer(right_fill, (cx - seam, y0, x1, y1))
        tb.webp(crop(cl), "curtain_l", widths, 74, manifest, out=OUT)
        tb.webp(crop(cr), "curtain_r", widths, 74, manifest, out=OUT)
        gather = .34                                                  # gathered width / closed panel width
        gw = round((cx + seam - x0) * gather)
        tb.webp(crop(layer(left_fill, (x0, y0, x0 + gw, y1))), "curtain_gl", widths, 74, manifest, out=OUT)
        tb.webp(crop(layer(right_fill, (x1 - gw, y0, x1, y1))), "curtain_gr", widths, 74, manifest, out=OUT)
        vh_px = round(H * .085)
        tb.webp(crop(layer(valance, (x0, y0, x1, y0 + vh_px))), "th_arch", widths, 74, manifest, out=OUT)
        for k in ("th_back", "curtain_l", "curtain_r", "curtain_gl", "curtain_gr", "th_arch"):
            sources[k] = "stand-in"
        # the programme card standing on the stage: 2:3, half the opening wide, its foot at 90% of the opening
        card, window, window_src, photo_z = card_piece(prep, paper, sources, warnings)
        card_w = round(W * .5)
        card_h = round(card_w * (1.5 if sources["card_paper"] == "stand-in" else card.height / card.width))
        card_x, card_y = cx - card_w // 2, y0 + round(H * .9) - card_h
        tb.webp(card, "card_paper", [320, 640], 78 if sources["card_paper"] == "stand-in" else 80, manifest, out=OUT)
        stage = {
            "canvas": list(CANVAS), "box": [x0, y0, W, H], "objAspect": round(W / H, 4), "method": "stand-in",
            "opening_pct": [0, 0, 100, 100],
            "curtain_l": {"box_pct": [0, 0, pct(cx + seam - x0, W), 100], "origin": "0% 50%"},
            "curtain_r": {"box_pct": [pct(cx - seam - x0, W), 0, pct(x1 - cx + seam, W), 100], "origin": "100% 50%"},
            "gather": gather,
            "valance_pct": pct(vh_px, H),
            "card": {"box_pct": [pct(card_x - x0, W), pct(card_y - y0, H), pct(card_w, W), pct(card_h, H)],
                     "window_pct": window, "window": window_src},
        }
        css = {"--stage-ar": f"{W}/{H}", "--cl-o": "0%", "--cr-o": "100%", "--gather": n(gather),
               "--swl-o": "6% 0", "--swr-o": "94% 0", "--spot-l": "5%", "--spot-t": "24%"}
        card_box = stage["card"]["box_pct"]
    else:
        # ------------------------------------------------------------ GPT stage (measured)
        arch_src = to_canvas(Image.open(part_path("proscenium")))
        arch = to_canvas(prep.restore("proscenium"))                  # the #00FF00 opening keyed transparent
        opening = prep.window("proscenium")
        if opening is not None:
            opening = mask_to_canvas(opening)
        else:   # no green window found: the transparent hole inside the arch where the prompt puts the opening
            warnings.append("proscenium.png: no #00FF00 opening found — the opening is the prompt's box where the arch is transparent")
            a = np.asarray(arch_src)[..., 3]
            opening = np.zeros(a.shape, bool)
            px0, py0, px1, py1 = (round(P_OPENING[i] * CANVAS[i % 2] / 100) for i in range(4))
            opening[py0:py1, px0:px1] = a[py0:py1, px0:px1] < 128
        ys, xs = np.nonzero(opening)
        ob = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
        cl = to_canvas(Image.open(part_path("curtain_left")))
        cr = to_canvas(Image.open(part_path("curtain_right")))
        clb, crb = alpha_box(cl), alpha_box(cr)
        sources.update({"th_arch": "gpt:parts/proscenium.png", "curtain_l": "gpt:parts/curtain_left.png",
                        "curtain_r": "gpt:parts/curtain_right.png"})

        def swag(name: str, closed: Image.Image, cbox, outer: str) -> Image.Image:
            p = part_path(name)
            if p:
                sources["curtain_g" + outer[0]] = f"gpt:parts/{name}.png"
                return to_canvas(Image.open(p))
            # stand-in: the closed GPT panel scaled to the prompt's gathered width, anchored at its outer edge
            sources["curtain_g" + outer[0]] = f"stand-in (curtain_{'left' if outer == 'l' else 'right'} scaled)"
            gx0, gy0, gx1, gy1 = cbox
            gw = max(1, round((gx1 - gx0) * P_GATHER))
            c = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
            c.paste(closed.crop(cbox).resize((gw, gy1 - gy0), Image.LANCZOS), (gx0 if outer == "l" else gx1 - gw, gy0))
            return c

        gl = swag("curtain_left_open", cl, clb, "l")
        gr = swag("curtain_right_open", cr, crb, "r")
        glb, grb = alpha_box(gl), alpha_box(gr)

        # the stage behind: stage_back (or the interim deep velvet) inside the arch's opening (+6 px under its edge)
        if part_path("stage_back"):
            back = to_canvas(Image.open(part_path("stage_back")).convert("RGB"))
            sources["th_back"] = "gpt:parts/stage_back.png"
        else:
            back = deep.resize(CANVAS, Image.LANCZOS).convert("RGBA")
            sources["th_back"] = "stand-in (velvet)"
        hole = Image.fromarray((tb.genislet(opening, 6) * 255).astype(np.uint8))
        back = back.convert("RGBA")
        back.putalpha(hole)

        # stage box = union of the arch, the closed panels and the swags (everything that stacks on the stage)
        boxes = [alpha_box(arch), clb, crb, glb, grb]
        X0, Y0 = min(b[0] for b in boxes), min(b[1] for b in boxes)
        X1, Y1 = max(b[2] for b in boxes), max(b[3] for b in boxes)
        SW, SH = X1 - X0, Y1 - Y0
        crop = lambda im: im.crop((X0, Y0, X1, Y1))                  # noqa: E731
        bp = lambda b: [pct(b[0] - X0, SW), pct(b[1] - Y0, SH), pct(b[2] - b[0], SW), pct(b[3] - b[1], SH)]  # noqa: E731
        tb.webp(crop(back), "th_back", widths, 72, manifest, out=OUT)
        tb.webp(crop(cl), "curtain_l", widths, 74, manifest, out=OUT)
        tb.webp(crop(cr), "curtain_r", widths, 74, manifest, out=OUT)
        tb.webp(crop(gl), "curtain_gl", widths, 74, manifest, out=OUT)
        tb.webp(crop(gr), "curtain_gr", widths, 74, manifest, out=OUT)
        tb.webp(crop(arch), "th_arch", widths, 78, manifest, out=OUT)
        gather = round(((glb[2] - glb[0]) / (clb[2] - clb[0]) + (grb[2] - grb[0]) / (crb[2] - crb[0])) / 2, 3)

        # the programme card: GPT card_small (window keyed) or the interim paper card, set on the stage floor
        ocx = (ob[0] + ob[2]) / 2
        card, window, window_src, photo_z = card_piece(prep, paper, sources, warnings)
        tb.webp(card, "card_paper", [320, 640], 78 if sources["card_paper"] == "stand-in" else 80, manifest, out=OUT)
        card_w = CANVAS[0] * P_CARD_W / 100
        card_h = card_w * card.height / card.width
        foot = CANVAS[1] * P_CARD_FOOT / 100
        cbox = (ocx - card_w / 2, foot - card_h, ocx + card_w / 2, foot)
        card_box = bp(cbox)
        stage = {
            "canvas": list(CANVAS), "box": [X0, Y0, SW, SH], "objAspect": round(SW / SH, 4), "method": "gpt",
            "opening_pct": bp(ob),
            "curtain_l": {"box_pct": bp(clb), "origin": f"{pct(clb[0] - X0, SW):g}% 50%"},
            "curtain_r": {"box_pct": bp(crb), "origin": f"{pct(crb[2] - X0, SW):g}% 50%"},
            "swag_l": {"box_pct": bp(glb)}, "swag_r": {"box_pct": bp(grb)},
            "gather": gather,
            "card": {"box_pct": card_box, "window_pct": window, "window": window_src},
        }
        # the spotlight rests where it rests on the interim stage, moved with the card's centre
        ccx, ccy = card_box[0] + card_box[2] / 2, card_box[1] + card_box[3] / 2
        css = {"--stage-ar": f"{SW}/{SH}", "--cl-o": f"{pct(clb[0] - X0, SW):g}%",
               "--cr-o": f"{pct(crb[2] - X0, SW):g}%", "--gather": n(gather),
               "--swl-o": f"{pct((glb[0] + glb[2]) / 2 - X0, SW):g}% {pct(glb[1] - Y0, SH):g}%",
               "--swr-o": f"{pct((grb[0] + grb[2]) / 2 - X0, SW):g}% {pct(grb[1] - Y0, SH):g}%",
               "--spot-l": f"{round(5 + ccx - 50, 3):g}%", "--spot-t": f"{round(24 + ccy - (40.923 + 49.107 / 2), 3):g}%"}
        if Image.open(part_path("proscenium")).size != CANVAS:
            warnings.append(f"proscenium.png is not {CANVAS[0]}×{CANVAS[1]}: brought onto the canvas")

    css.update({"--card-l": f"{n(card_box[0])}%", "--card-t": f"{n(card_box[1])}%", "--card-w": f"{n(card_box[2])}%",
                "--card-h": f"{n(card_box[3])}%"})
    wl, wt, ww, wh = stage["card"]["window_pct"]
    css.update({"--win-l": f"{n(wl)}%", "--win-t": f"{n(wt)}%", "--win-w": f"{n(ww)}%", "--win-h": f"{n(wh)}%",
                "--photo-z": str(photo_z)})

    # ---------------------------------------------------------------- home's programme card (no photo window)
    if part_path("card_plain"):
        cp = Image.open(part_path("card_plain")).convert("RGBA")
        cp = cp.crop(alpha_box(cp))
        sources["card_plain"] = "gpt:parts/card_plain.png"
        css.update({"--hero-ar": f"{cp.width}/{cp.height}", "--hero-fit": "fill", "--hero-pad": "20% 13% 16%",
                    "--hero-pad-short": "17% 12% 13%"})
    else:
        cp = tb.kapla(paper, 2 / 3, .5)                               # = the interim card_paper
        sources["card_plain"] = "stand-in"
        css.update({"--hero-ar": "auto", "--hero-fit": "cover", "--hero-pad": "30px 22px 28px",
                    "--hero-pad-short": "22px 18px 20px"})
    tb.webp(cp, "card_plain", [320, 640], 78 if sources["card_plain"] == "stand-in" else 80, manifest, out=OUT)

    # ---------------------------------------------------------------- grounds, paper, ticket, placeholders
    if part_path("velvet_tile"):
        tile = Image.open(part_path("velvet_tile")).convert("RGB")   # seamless already: no mirroring
        sources["velvet"] = "gpt:parts/velvet_tile.png"
    else:   # repeat tile: the texture mirrored 2×2, so its edges meet (seamless whatever the source tile does)
        half = velvet.resize((640, 640), Image.LANCZOS)
        tile = Image.new("RGB", (1280, 1280))
        for (dx, dy), im in zip(((0, 0), (640, 0), (0, 640), (640, 640)),
                                (half, half.transpose(Image.FLIP_LEFT_RIGHT), half.transpose(Image.FLIP_TOP_BOTTOM),
                                 half.transpose(Image.ROTATE_180))):
            tile.paste(im, (dx, dy))
        sources["velvet"] = "stand-in"
    tb.webp(tile, "velvet", [640], 74, manifest, out=OUT)
    bg_page = Image.open(part_path("bg_page")).convert("RGB") if part_path("bg_page") else None
    if bg_page is not None:
        # the opening's names, date, hint and "Replay" sit in light ink on this ground: if GPT painted its calm centre
        # lighter than the prompt's near-black, it is toned down (brightness only) until 95 % of the centre is ≤ 90
        lum = np.asarray(bg_page.convert("L"))
        h_, w_ = lum.shape
        p95 = float(np.percentile(lum[h_ // 6:h_ * 5 // 6, w_ // 6:w_ * 5 // 6], 95))
        k = min(1.0, 90 / max(p95, 1))
        room = ImageEnhance.Brightness(bg_page).enhance(k) if k < 1 else bg_page
        manifest["room_tone"] = {"centre_p95": round(p95, 1), "brightness": round(k, 3)}
        sources["room"] = "gpt:parts/bg_page.png"
    else:
        room = ImageEnhance.Brightness(tb.bulanik_fon(velvet.resize((1024, 1024)).crop((0, 0, 1024, 1024)),
                                                     (683, 1024), 3)).enhance(.62)
        sources["room"] = "stand-in"
    tb.webp(room, "room", [640], 72, manifest, out=OUT)                                  # dark house ground
    if part_path("playbill_tile"):
        sheet = Image.open(part_path("playbill_tile")).convert("RGB")
        sources["paper"] = "gpt:parts/playbill_tile.png"
    else:
        sheet = paper
        sources["paper"] = "stand-in"
    tb.webp(sheet, "paper", [640, 1024], 74, manifest, out=OUT)                          # programme sheets
    if part_path("ticket_stub"):
        stub = Image.open(part_path("ticket_stub")).convert("RGBA")
        stub = stub.crop(alpha_box(stub))
        sources["stub_paper"] = "gpt:parts/ticket_stub.png"
        css.update({"--stub-ar": f"{stub.width}/{stub.height}", "--stub-fit": "fill", "--stub-rule": "0"})
    else:
        stub = tb.kapla(paper.crop((0, 0, 1024, 1024)), 3 / 1, .4)
        sources["stub_paper"] = "stand-in"
        css.update({"--stub-ar": "auto", "--stub-fit": "cover", "--stub-rule": "1px dashed #6e5119b3"})
    tb.webp(stub, "stub_paper", [480, 960], 76, manifest, out=OUT)                       # the ticket stub
    slots = {}
    for key, shape, ratio in (("hero_portrait", "portrait", 4 / 5), ("venue", "land", 3 / 2)):
        if bg_page is not None:
            ph = tb.yer_tutucu(bg_page, (0, 0, bg_page.width, bg_page.height), ratio, w=640, ton=(16, 58, 60),
                               karisim=.35, bulanik=10)
        else:
            ph = tb.yer_tutucu(velvet, (0, 0, vw, vh), ratio, w=640, ton=(16, 58, 60), karisim=.35, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    sources["ph_portrait"] = sources["ph_land"] = "gpt:parts/bg_page.png" if bg_page is not None else "stand-in"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"portrait": {"aspect": "4/5"}, "land": {"aspect": "3/2"}}

    # ---------------------------------------------------------------- share image + icon (assembled, nothing drawn)
    if part_path("web_hero"):
        og, og_info = tb.og_kirp(Image.open(part_path("web_hero")), hiza="alt")
        manifest["og"] = {**og_info, "source": "gpt:parts/web_hero.png"}
        sources["og"] = "gpt:parts/web_hero.png"
    else:
        og = Image.new("RGB", (1200, 630))
        og.paste(ImageEnhance.Brightness(velvet.resize((1200, 1200))).enhance(.55).crop((0, 285, 1200, 915)), (0, 0))
        sw, sh = 300, 630
        og.paste(left_fill.resize((sw, sh)), (0, 0))
        og.paste(right_fill.resize((sw, sh)), (1200 - sw, 0))
        og.paste(paper.resize((sw, round(sw * 1.5))).crop((0, 0, sw, 450)), (600 - sw // 2, 90))
        manifest["og"] = {"source": "assembled stand-in: velvet + paper"}
        sources["og"] = "stand-in"
    manifest["og"].update({"file": "og-1200x630.jpg", "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")})
    if part_path("tassel"):
        icon_src = Image.open(part_path("tassel")).convert("RGBA")
        sources["favicon"] = "gpt:parts/tassel.png"
    else:
        icon_src = Image.new("RGBA", (360, 360), (0, 0, 0, 0))
        icon_src.paste(left_fill.resize((180, 360)), (0, 0))
        icon_src.paste(right_fill.resize((180, 360)), (180, 0))
        sources["favicon"] = "stand-in"
    icon, icon_info = tb.ikon(icon_src)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # ---------------------------------------------------------------- checks + manifest + site.css
    stage["css"] = css
    manifest["stage"] = stage
    manifest["sources"] = sources
    manifest["waiting_for_gpt"] = sorted(k for k, v in sources.items() if not v.startswith("gpt:"))
    if warnings:
        manifest["warnings"] = warnings
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    sync_css(css)
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: v for k, v in stage.items() if k != "css"}, indent=1))
    for w in warnings:
        print("WARNING " + w, file=sys.stderr)
    keyed = {f: px for f, px in manifest["checks"]["green"].items() if f.startswith(("th_arch", "card_paper"))}
    if manifest["checks"]["green"]:   # only the keyed windows can leave #00FF00; elsewhere it is a green-ish source
        print(f"{'ERROR' if keyed else 'WARNING'}: green-dominant pixels in {manifest['checks']['green']}", file=sys.stderr)
    print(f"grand-theatre-premiere: theme folder {manifest['bytes_total'] / 1e6:.2f} MB · "
          f"waiting for GPT: {', '.join(manifest['waiting_for_gpt']) or 'nothing'}")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 1 if keyed else 0


if __name__ == "__main__":
    sys.exit(main())
