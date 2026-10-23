#!/usr/bin/env python3
"""Marigold & Mehndi (33) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G182.

Every picture is the design's own PAKET 5 part (collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md), cut to its
alpha box, keyed or scaled — nothing is drawn (K21, docs/11 §5.7). The build still takes each part the moment it exists
(G167): it cuts / keys / scales it into img/ and writes `parts.css` (loaded by every page after site.css) with the rules
that use it, the measured numbers included. A part that is not there has no rule and the page keeps the interim look of
site.css (silk, velvet and paper toned from other designs' plain GPT textures, a band of GPT gold for the sleeve):

  silk (W2.1)              silk-640                    envelope back (and pocket / flap until W2.12 / W2.13)
  sleeve (W2.2)            sleeve-900                  the gold laser-cut paisley sleeve that slides off
  petal_1..3 (W2.3)        petal_N-96                  marigold petals of the opening and of a sent reply
                                                       (site.js reads them from --mm-petals; none = none)
  jharokha (W2.4)          arch-640 + mask_arch.png    the carved arch round every portrait photo. GPT left the middle
                                                       of the #00FF00 window transparent with a soft green rim: the
                                                       window = the green + the transparent hole the frame encloses;
                                                       cleared, the green spill round it removed, its shape = the mask
  henna (W2.5)             henna-640                   the henna round the arch, BEHIND the frame and 1.22× its canvas
                                                       (GPT drew the frame edge to edge, so the henna's empty middle
                                                       only clears the frame when scaled up); flows in line by line
  diya (W2.6)              diya-160                    brass lamps under the envelope and in the signatures
  flame (W2.7)             flame-96                    their flames, lit one by one — set on the wick tip, which is
                                                       measured on the diya (the cream cotton at the spout)
  garland (W2.8)           garland-900                 marigold garland: top of the opening and the home hero (the
                                                       text starts below it: --garland-ratio), small under headings
  mehndi_pattern (W2.9)    mehndi-560                  faint henna pattern behind the story page (cut to its alpha box
                                                       so the tile repeats without empty lanes)
  card_small (W2.10)       card_small-860 + mask_card  the card that rises from the lining; #00FF00 window keyed, the
                                                       portrait placed and masked on it; the text zone below the window
                                                       measured on the paper (manifest card_small.text_zone)
  tassel (W2.11)           tassel-200                  the silk tassel that swings from the sleeve
  envelope_front (W2.12)   env_front-900               the pocket front with its gold piping
  flap (W2.13)             flap-900                    the front face of the straight flap
  velvet (W2.14)           velvet-640, ground-640      lining, inner face of the flap; the page ground (darker)
  paper (W2.15)            paper-640/1024              cards, bands, the reply form
  web_hero (W2.16)         og-1200x630.jpg             share image (tema_build.og_kirp, bottom-aligned)

The envelope (G182 eye check, 2026-10-22): the parts were asked for fixed boxes of a 0.8 stage, but GPT gave them their
own proportions (flap 3.8:1 instead of 1.9:1, sleeve 3.8:1 instead of 2.4:1, pocket 1.42:1 instead of 1.29:1).
Stretched to the asked boxes the flap and the sleeve were doubled in height. So, as in designs 39–48, each piece is cut
to its alpha box and laid by its measured size: pocket and flap span the envelope's width at their own heights (the
flap's piped lower edge over the pocket's mouth), the sleeve is 108 % wide at its own height with the flap's lower edge
a quarter down it, the tassel hangs from the sleeve's lower edge 26 % in from the right, the card (its own 0.72:1) fits
inside the envelope. The stage aspect follows (manifest stage; parts.css --env-ratio and the boxes).

  python3 platform/themes/marigold-mehndi/build_images.py
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

# interim closed envelope (site.css .parcel, used while the GPT pocket / flap / sleeve are missing): % of the stage
STAGE = 0.8
FLAP = (0, 0, 100, 42)            # left, top, width, height
POCKET = (0, 38, 100, 62)
SLEEVE = (-4, 30, 108, 36)
CARD = (8, 6, 84, 92)             # the card that rises from the lining (0.73:1)
PHOTO_ASPECT = 4 / 5              # theme.json photos: hero_portrait, story_1..3 = "4/5" (the jharokha window)

# measured envelope (GPT pieces at their own proportions), in % of the envelope's WIDTH unless said otherwise
FLAP_OVER = 2.5                   # the flap's piped lower edge lies this far over the pocket's piped mouth
SLEEVE_W, SLEEVE_X = 108, -4      # the sleeve wraps round the sides (4 % past each edge)
SLEEVE_FLAP_AT = .25              # the flap's lower edge a quarter down the sleeve (the sleeve holds it shut)
TASSEL_W, TASSEL_X = 11, 74       # tassel width; its cord 26 % in from the right edge (GPT_PROMPTS geometry)
TASSEL_HOOK = 2.0                 # its loop overlaps the sleeve's lower edge by this much
CARD_FILL = .92                   # the card's height in the envelope (centred; it must stay hidden while closed)
HENNA_SCALE = 1.22                # the henna canvas round the arch canvas (its empty middle clears the frame)
FLAME_W = 16                      # flame width in % of the diya's width (about the bowl's height)


def r2(v: float) -> float:
    return round(float(v), 2)


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


def box(im: Image.Image, esik: int = 8):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def trim(im: Image.Image, esik: int = 8) -> Image.Image:
    k = box(im, esik)
    return im.crop(k) if k else im


def square(im: Image.Image) -> Image.Image:
    s = max(im.size)
    out = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    out.alpha_composite(im, ((s - im.width) // 2, (s - im.height) // 2))
    return out


def green_window(im: Image.Image):
    """The #00FF00 window of a framed part. Returns (RGBA with the window cleared, window (L, T, W, H) % of the image,
    the window's shape as a white alpha mask cropped to its box) or (None, None, None) when there is no green.

    The window = the green pixels + whatever transparent hole the frame encloses round them (W2.4: GPT left the middle
    of the window transparent with a soft green rim; W2.10: a solid green window — both give the full arched opening).
    It is cleared with a 2 px margin, and the green spill in a 14 px ring round it is neutralised (green → mean of red
    and blue), so no green fringe stays on the carving."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    ys, xs = np.nonzero(green)
    if len(ys) < 256:
        return None, None, None
    h, w = c.shape[:2]
    # free = not frame (transparent or green); flood the outside from a 1 px free border; the rest of free is enclosed
    free = ((c[..., 3] < 128) | green).astype(np.uint8) * 255
    pad = Image.fromarray(np.pad(free, 1, constant_values=255), "L").copy()   # (a copy: floodfill on a numpy-backed image is lost)
    ImageDraw.floodfill(pad, (0, 0), 100)
    enclosed = np.asarray(pad)[1:-1, 1:-1] == 255
    # the window is the enclosed region that holds the green (seed: the green pixel nearest the green box's centre)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    k = int(np.argmin((xs - cx) ** 2 + (ys - cy) ** 2))
    seed = (int(xs[k]), int(ys[k]))
    lab = Image.fromarray((enclosed * 255).astype(np.uint8), "L").copy()
    if not enclosed[seed[1], seed[0]]:
        return None, None, None
    ImageDraw.floodfill(lab, seed, 50)
    win = np.asarray(lab) == 50
    wy, wx = np.nonzero(win)
    x0, y0, x1, y1 = wx.min(), wy.min(), wx.max() + 1, wy.max() + 1
    grown = np.asarray(Image.fromarray((win * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    c[..., 3] = np.where(grown, 0, c[..., 3])
    ring = np.asarray(Image.fromarray((win * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(29))) > 0
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 4)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    a = (grown[y0:y1, x0:x1] * 255).astype(np.uint8)
    mask = Image.fromarray(np.dstack([np.full_like(a, 255)] * 3 + [a]), "RGBA")
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h), mask


def card_text_zone(card: Image.Image, win) -> dict:
    """The plain paper below the card's window, where the names and the date go (% of the card's height / width):
    top = first row under the window's gold rim where the middle is plain paper; bottom = last plain row above the
    lower border; side = the widest inset of the corner sprigs / border between top and the sprigs' top."""
    c = np.asarray(card).astype(np.int16)
    h, w = c.shape[:2]
    hsv = np.asarray(Image.fromarray(c[..., :3].astype(np.uint8)).convert("HSV")).astype(np.int16)
    T = (win[1] + win[3]) / 100
    ref = hsv[int(h * (T + .04)):int(h * (T + .07)), int(w * .4):int(w * .6)]
    s0, v0 = np.median(ref[..., 1]), np.median(ref[..., 2])
    decor = (hsv[..., 1] > s0 + 45) | (hsv[..., 2] < v0 - 45) | (c[..., 3] < 200)
    d = np.asarray(Image.fromarray((decor * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
                   .filter(ImageFilter.MaxFilter(9))) > 0
    mid = d[:, int(w * .4):int(w * .6)].mean(1) > .02
    y = int(h * T)
    while y < h and mid[y]:
        y += 1
    top = y
    while y < h and not mid[y]:
        y += 1
    bottom = y
    top += int(h * .012)                                  # a little air under the rim
    bottom -= int(h * .02)                                # and above the border
    sides = []
    for yy in range(top, bottom - max(1, h // 100), max(1, h // 100)):
        col = d[yy:yy + max(1, h // 100)].mean(0) > .05
        half = w // 2
        left = half - int(np.argmax(col[:half][::-1])) if col[:half].any() else 0
        right = half + int(np.argmax(col[half:])) if col[half:].any() else w
        sides.append((yy, max(left, w - right)))
    side_wide = max(s for yy, s in sides if yy < top + (bottom - top) * .35)
    side_mid = max(s for yy, s in sides if yy < top + (bottom - top) * .6)
    side_low = max(s for yy, s in sides)
    return {"top": r2(100 * top / h), "bottom": r2(100 * bottom / h), "side_wide": r2(100 * side_wide / w),
            "side_mid": r2(100 * side_mid / w), "side_low": r2(100 * side_low / w)}


def wick_tip(diya: Image.Image):
    """The tip of the cotton wick lying in the diya's spout (% of the trimmed diya: x from the left, y from the top):
    the cream, low-saturation pixels in the right fifth; the tip = the top of the right-most few per cent of them."""
    c = np.asarray(diya)
    h, w = c.shape[:2]
    hsv = np.asarray(diya.convert("RGB").convert("HSV")).astype(np.int16)
    m = (c[..., 3] > 200) & (hsv[..., 1] < 70) & (hsv[..., 2] > 170)
    m[:, :int(w * .78)] = False
    ys, xs = np.nonzero(m)
    if len(xs) < 50:
        return None
    end = xs > xs.max() - w * .035
    return r2(100 * xs[end].mean() / w - 1), r2(100 * ys[end].min() / h + 1.5)


def gold_plate() -> Image.Image:
    src = Image.open(GOLD_SRC).convert("RGB")
    w, h = src.size
    crop = src.crop(tuple(round(v * (w if i % 2 == 0 else h)) for i, v in enumerate(GOLD_BOX)))
    return ImageEnhance.Color(crop).enhance(.95).resize((640, 640), Image.LANCZOS)


def measured_stage(got: dict) -> dict | None:
    """The closed envelope from the GPT pieces at their own proportions (% of the stage: left, top, width, height)."""
    front, flap, sleeve = got.get("envelope_front"), got.get("flap"), got.get("sleeve")
    if front is None or flap is None or sleeve is None:
        return None
    flap_h = 100 * flap.height / flap.width
    front_h = 100 * front.height / front.width
    H = flap_h + front_h - FLAP_OVER                      # envelope height in % of its width
    y = lambda v: r2(100 * v / H)                         # noqa: E731  (width units → % of the height)
    sleeve_h = SLEEVE_W * sleeve.height / sleeve.width
    sleeve_top = flap_h - SLEEVE_FLAP_AT * sleeve_h
    stage = {
        "aspect": round(100 / H, 4),
        "flap": [0, 0, 100, y(flap_h)],
        "front": [0, y(flap_h - FLAP_OVER), 100, y(front_h)],
        "sleeve": [SLEEVE_X, y(sleeve_top), SLEEVE_W, y(sleeve_h)],
        "lining": [3, 2.5, 94, y(flap_h - FLAP_OVER + 12)],
    }
    tassel = got.get("tassel")
    if tassel is not None:
        # in % of the sleeve box (the tassel is a child of .sleeve and slides with it)
        tw = 100 * TASSEL_W / SLEEVE_W
        stage["tassel_in_sleeve"] = [r2(100 * (TASSEL_X - SLEEVE_X) / SLEEVE_W - tw / 2),
                                     r2(100 * (sleeve_h - TASSEL_HOOK) / sleeve_h), r2(tw)]
        tassel_bottom = sleeve_top + sleeve_h - TASSEL_HOOK + TASSEL_W * tassel.height / tassel.width
        stage["tassel_bottom"] = y(tassel_bottom)
    card = got.get("card_small")
    if card is not None:
        ch = H * CARD_FILL
        cw = ch * card.width / card.height
        stage["card"] = [r2(50 - cw / 2), y((H - ch) / 2), r2(cw), y(ch)]
        stage["card_ratio"] = round(card.width / card.height, 4)
    stage["_note"] = ("% of the closed envelope (left, top, width, height), measured from the GPT pieces at their own "
                      "proportions; tassel_in_sleeve = left, top, width in % of the sleeve box")
    return stage


def envelope(silk: Image.Image, gold: Image.Image, h: int, parts: dict, stage: dict | None) -> Image.Image:
    """The closed envelope as the page shows it (back, pocket, flap, sleeve, tassel) — og montage / favicon."""
    aspect = stage["aspect"] if stage else STAGE
    w = round(h * aspect)
    pad = round(w * .08) + 20
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    tex = silk.resize((max(w, 512), max(w, 512)), Image.LANCZOS)

    def at(b):
        return (pad + round(w * b[0] / 100), pad + round(h * b[1] / 100), max(1, round(w * b[2] / 100)),
                max(1, round(h * b[3] / 100)))

    def piece(img, b, bright=1.0):
        x, y, bw, bh = at(b)
        p = img.resize((bw, bh), Image.LANCZOS) if img.mode == "RGBA" else img.crop((0, 0, bw, bh))
        p = ImageEnhance.Brightness(p.convert("RGBA")).enhance(bright)
        canvas.alpha_composite(p, (x, y))

    shade = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shade.paste((20, 2, 12, 150), (pad + 6, pad + 10, pad + w + 6, pad + h + 10))
    canvas.alpha_composite(shade.filter(ImageFilter.GaussianBlur(10)))
    piece(tex, (0, 0, 100, 100), .78)
    if stage:
        piece(parts["envelope_front"], stage["front"])
        piece(parts["flap"], stage["flap"])
        piece(parts["sleeve"], stage["sleeve"])
        if "tassel_in_sleeve" in stage:
            sx, sy, sw, sh = stage["sleeve"]
            tl, tt, tw = stage["tassel_in_sleeve"]
            t = parts["tassel"]
            tw_px = w * sw / 100 * tw / 100
            th_pct = 100 * tw_px * t.height / t.width / h
            piece(t, (sx + sw * tl / 100, sy + sh * tt / 100, sw * tw / 100, th_pct))
        return canvas
    piece(parts.get("envelope_front") or tex, POCKET, 1.04)
    piece(parts.get("flap") or tex, FLAP, .9)
    sleeve = parts.get("sleeve")
    if sleeve is None:
        sleeve = gold.resize((at(SLEEVE)[2], at(SLEEVE)[3]), Image.LANCZOS).convert("RGBA")
    piece(sleeve, SLEEVE)
    return canvas


def optional_parts(manifest: dict) -> tuple[list[str], dict]:
    """W2.2–W2.13: whatever exists → img/ + the CSS rules that use it (parts.css). Returns (css rules, the parts)."""
    css, got = [], {}
    card_rule = -1
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
    henna = part("henna")
    if arch is not None:
        abox = box(arch)
        keyed, win, mask = green_window(arch.crop(abox))
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
            manifest["arch"]["window_pct"] = [r2(v) for v in win]
            ratio = (W / 100 * keyed.width) / (H / 100 * keyed.height)
            manifest["arch"]["window_aspect"] = round(ratio, 4)
            if abs(ratio / PHOTO_ASPECT - 1) > .03:
                print(f"WARNING jharokha.png: window {ratio:.3f}:1, the photo slots crop 4:5 (theme.json)", file=sys.stderr)
            # the jharokha box: the arch alone, or the arch inside the henna scaled round the same canvas centre
            ax0, ay0, ax1, ay1 = abox
            bx0, by0, bx1, by1 = ax0, ay0, ax1, ay1
            hbox = None
            if henna is not None and henna.size == arch.size:
                hx0, hy0, hx1, hy1 = box(henna)
                cx, cy = arch.width / 2, arch.height / 2
                hbox = (cx + (hx0 - cx) * HENNA_SCALE, cy + (hy0 - cy) * HENNA_SCALE,
                        cx + (hx1 - cx) * HENNA_SCALE, cy + (hy1 - cy) * HENNA_SCALE)
                bx0, by0, bx1, by1 = min(ax0, hbox[0]), min(ay0, hbox[1]), max(ax1, hbox[2]), max(ay1, hbox[3])
            bw, bh = bx1 - bx0, by1 - by0
            place = lambda x0, y0, x1, y1: [r2(100 * (x0 - bx0) / bw), r2(100 * (y0 - by0) / bh),  # noqa: E731
                                            r2(100 * (x1 - x0) / bw), r2(100 * (y1 - y0) / bh)]
            arch_at = place(ax0, ay0, ax1, ay1)
            # the photo window, 0.6 % larger each way so its edge tucks under the carving
            wx0, wy0 = ax0 + (L - .6) / 100 * keyed.width, ay0 + (T - .6) / 100 * keyed.height
            wx1, wy1 = ax0 + (L + W + .6) / 100 * keyed.width, ay0 + (T + H + .6) / 100 * keyed.height
            photo_at = place(wx0, wy0, wx1, wy1)
            manifest["arch"]["box"] = {"aspect": round(bw / bh, 4), "arch": arch_at, "photo": photo_at,
                                       "_note": "% of the .jharokha box (left, top, width, height)"}
            css.append(f".jharokha{{aspect-ratio:{round(bw)}/{round(bh)}}}")
            css.append(f".jharokha>.arch{{display:block;left:{pct(arch_at[0])}%;top:{pct(arch_at[1])}%;width:{pct(arch_at[2])}%;"
                       f"height:{pct(arch_at[3])}%;z-index:2;background:url(img/{f}) 0 0/100% 100% no-repeat}}")
            css.append(f".jharokha>.photo-slot{{position:absolute;z-index:1;left:{pct(photo_at[0])}%;top:{pct(photo_at[1])}%;"
                       f"width:{pct(photo_at[2])}%;height:{pct(photo_at[3])}%;"
                       f"-webkit-mask:url(img/mask_arch.png) 0 0/100% 100% no-repeat;mask:url(img/mask_arch.png) 0 0/100% 100% no-repeat}}")
            if hbox is not None:
                h_im = henna.crop(box(henna))
                got["henna"] = h_im
                tb.webp(h_im, "henna", [640], 78, manifest, out=OUT)   # fine line art: ≤ 250 kB (theme test)
                hf = manifest["henna"]["files"][0]["file"]
                henna_at = place(*hbox)
                manifest["arch"]["box"]["henna"] = henna_at
                css.append(f".jharokha>.henna{{display:block;z-index:0;left:{pct(henna_at[0])}%;top:{pct(henna_at[1])}%;"
                           f"width:{pct(henna_at[2])}%;height:{pct(henna_at[3])}%;background:url(img/{hf}) 0 0/100% 100% no-repeat}}")
    if henna is not None and "henna" not in got:
        print("WARNING henna.png: needs jharokha.png on the same canvas — not used", file=sys.stderr)

    diya = part("diya")
    if diya is not None:
        d = trim(diya)
        got["diya"] = d
        tb.webp(d, "diya", [160], 86, manifest, out=OUT)
        f = manifest["diya"]["files"][0]["file"]
        css.append(".diyas{display:flex}")
        css.append(f".diya{{aspect-ratio:{d.width}/{d.height};background:url(img/{f}) 50% 100%/contain no-repeat}}")
        tip = wick_tip(d)
        manifest["diya"]["wick_tip_pct"] = tip
        if tip is None:
            print("WARNING diya.png: no wick found at the spout — the flame stays centred", file=sys.stderr)

    flame = part("flame")
    if flame is not None:
        fl = trim(flame)
        got["flame"] = fl
        tb.webp(fl, "flame", [96], 86, manifest, out=OUT)
        f = manifest["flame"]["files"][0]["file"]
        rule = f".flame{{aspect-ratio:{fl.width}/{fl.height};background:url(img/{f}) 50% 100%/contain no-repeat"
        tip = manifest.get("diya", {}).get("wick_tip_pct")
        if tip:   # the flame's base (the bottom centre of its picture) on the wick tip
            rule += f";left:{pct(tip[0])}%;bottom:{pct(100 - tip[1])}%;width:{FLAME_W}%"
        css.append(rule + "}")

    garland = part("garland")
    if garland is not None:
        g = trim(garland)
        got["garland"] = g
        tb.webp(g, "garland", [900], 82, manifest, out=OUT)
        f = manifest["garland"]["files"][0]["file"]
        css.append(f":root{{--garland-ratio:{round(g.width / g.height, 4)}}}")
        css.append(f".garland{{display:block;aspect-ratio:{g.width}/{g.height};background:url(img/{f}) 50% 0/100% 100% no-repeat}}")

    pattern = part("mehndi_pattern")
    if pattern is not None:
        got["mehndi_pattern"] = pattern
        tb.webp(trim(pattern), "mehndi", [560], 74, manifest, out=OUT)
        f = manifest["mehndi"]["files"][0]["file"]
        css.append(f".mehndi-ground{{display:block;background:url(img/{f}) 0 0/400px repeat}}")

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
            manifest["card_small"]["window_pct"] = [r2(v) for v in win]
            zone = card_text_zone(keyed, win)
            manifest["card_small"]["text_zone"] = {**zone, "_note": "% of the card: top / bottom of the height, the "
                                                   "sprigs' / border's inset from each side (wide = upper third, mid = upper 60 %, low = all)"}
            side = zone["side_wide"] + 2
            card_rule = len(css)                   # its padding is written once the card's width in the stage is known
            css.append(f".parcel .card{{background:url(img/{f}) 0 0/100% 100% no-repeat;justify-content:flex-start}}")
            css.append(f".parcel .card .card-photo,.parcel .card.tight .card-photo{{position:absolute;"
                       f"left:{pct(L - .4)}%;top:{pct(T - .4)}%;width:{pct(W + .8)}%;height:{pct(H + .8)}%;aspect-ratio:auto;"
                       f"-webkit-mask:url(img/mask_card.png) 0 0/100% 100% no-repeat;mask:url(img/mask_card.png) 0 0/100% 100% no-repeat}}")
            # the lower lines (date) stay between the corner sprigs
            css.append(".parcel .card .card-line{margin-top:0}")
            # the names (upper middle) and the date (low) stay between the corner sprigs (a margin % is of the card's
            # content width)
            inset = lambda v: pct(max(0, 100 * (v - side) / (100 - 2 * side)))  # noqa: E731
            css.append(f".parcel .card .card-names{{margin-inline:{inset(zone['side_mid'] + 1)}%}}")
            css.append(f".parcel .card .card-date{{margin-inline:{inset(zone['side_low'])}%}}")

    # the envelope laid by the measured pieces (overrides the interim boxes of site.css)
    stage = measured_stage(got)
    if stage:
        manifest["stage"] = stage
        box_css = lambda b: f"left:{pct(b[0])}%;top:{pct(b[1])}%;width:{pct(b[2])}%;height:{pct(b[3])}%"  # noqa: E731
        css.append(f".stage{{--env-ratio:{stage['aspect']}}}")
        css.append(f".parcel{{aspect-ratio:{stage['aspect']}}}")
        css.append(f".parcel>.env-front{{{box_css(stage['front'])};filter:drop-shadow(0 -1px 2px #2a041966)}}")
        css.append(f".parcel>.flap{{{box_css(stage['flap'])};filter:drop-shadow(0 2px 3px #2a041999)}}")
        css.append(f".parcel>.flap-in{{left:0;top:-{pct(stage['flap'][3])}%;width:100%;height:{pct(stage['flap'][3])}%}}")
        css.append(f".parcel>.lining{{{box_css(stage['lining'])}}}")
        css.append(f".parcel>.sleeve{{{box_css(stage['sleeve'])}}}")
        if "tassel_in_sleeve" in stage:
            tl, tt, tw = stage["tassel_in_sleeve"]
            css.append(f".sleeve>.tassel{{left:{pct(tl)}%;top:{pct(tt)}%;width:{pct(tw)}%}}")
        if "card" in stage:
            css.append(f".parcel>.card{{{box_css(stage['card'])}}}")
    if "card_small" in got:
        # the text starts under the window and stays between the corner sprigs. A padding % is of the containing block's
        # width (the parcel), so the card's own proportions are scaled by its width in the stage
        z, k = manifest["card_small"]["text_zone"], (stage["card"][2] if stage and "card" in stage else CARD[2]) / 100
        hw = got["card_small"].height / got["card_small"].width
        side = z["side_wide"] + 2
        css[card_rule] = css[card_rule][:-1] + (f";padding:{pct(z['top'] * hw * k)}% {pct(side * k)}% "
                                                f"{pct((100 - z['bottom']) * hw * k)}%}}")
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
                           "gold": f"{GOLD_SRC.relative_to(ROOT)} (plain metal field {GOLD_BOX}; interim sleeve only)"}

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
                         "_note": "interim boxes (site.css), % of the closed envelope (left, top, width, height)"}

    css, got = optional_parts(manifest)
    hero = PARTS / "web_hero.png"
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        got["web_hero"] = True
    else:   # the closed envelope on the velvet ground (montage of the page's own crops, no text)
        og = ground.resize((1200, 1200)).crop((0, 285, 1200, 915)).convert("RGBA")
        env = envelope(silk, gold, 520, got, manifest["stage"] if "front" in manifest["stage"] else None)
        og.alpha_composite(env, ((1200 - env.width) // 2, (630 - env.height) // 2))
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed envelope (silk + gold sleeve) on the velvet ground",
                          "bytes": tb.og_kaydet(og.convert("RGB"), OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(envelope(silk, gold, 400, got, manifest["stage"] if "front" in manifest["stage"] else None))
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
            "   parts (W2.2–W2.13, GPT_PROMPTS.md) that exist in collections/33_Marigold_Mehndi/assets/gpt/parts/,\n"
            "   with the boxes measured on them (the envelope, the jharokha window, the card's text zone, the wick).\n"
            "   A part that is not there has no rule: the page keeps its look from site.css. */\n")
    (THEME / "parts.css").write_text(head + ("\n".join(css) + "\n" if css else "/* none yet */\n"), encoding="utf-8", newline="\n")   # LF on Windows too (.gitattributes eol=lf)
    manifest["parts_css_rules"] = len(css)

    green = tb.yesil_denetle(OUT)
    # the garland's mango leaves are green by nature (not a key colour left over)
    manifest["checks"] = {"green": green, "_note": "garland-900: green mango leaves of the GPT garland (W2.8), not key residue"}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 28},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 140}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    mf = OUT / "manifest.json"   # LF on Windows too (.gitattributes eol=lf)
    mf.write_bytes(mf.read_bytes().replace(b"\r\n", b"\n"))
    print(json.dumps(manifest["sources"], indent=1))
    if "front" in manifest["stage"]:
        print(json.dumps({k: v for k, v in manifest["stage"].items() if k != "_note"}))
    print("arch", manifest.get("arch", {}).get("window_pct"), manifest.get("arch", {}).get("box"))
    print("card zone", manifest.get("card_small", {}).get("text_zone"), "wick", manifest.get("diya", {}).get("wick_tip_pct"))
    print(f"marigold-mehndi: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green: {green}")
    bad = {k: v for k, v in green.items() if not k.startswith("garland")}
    if bad:
        print(f"ERROR: green residue in img/: {bad}", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
