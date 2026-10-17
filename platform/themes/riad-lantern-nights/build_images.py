#!/usr/bin/env python3
"""Riad Lantern Nights (27) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G165, GPT branch G167.

Two source modes, chosen PART BY PART (each PAKET 5 part is used as soon as its file exists; a missing part keeps its
interim stand-in). Either way the pages get the same file names (fixed pixel sizes below), so nothing in the HTML changes
when GPT's parts arrive.

GPT parts (collections/27_Riad_Lantern_Nights/assets/gpt/parts/, PAKET 5 in GPT_PROMPTS.md):
  doors_closed     cut at its centre seam (tema_build.dikis_bul) → door_l / door_r, each scaled to the leaf size below;
                   its alpha box is "the doorway opening" every other stage layer is measured against
  doorway          the carved surround (same canvas): cut to the opening's box + the fixed margins DOORWAY_EXT → a front
                   layer of the stage (CSS .riad>.doorway: left -18% top -45% width 136% height 155%)
  courtyard        the opening's box of the canvas → court (behind the doors); a 16:9 cover crop → court_band
  card_small       the card alone, scaled to the card size below; its #00FF00 arch window keyed transparent and measured
                   (stage.card.window_pct) — the portrait sits BEHIND the card, so the arch is GPT's own outline; the
                   plain paper under the window = free_zone (theme-check: card text stays on it)
  frame_arch       #00FF00 → transparent, window measured: the story / teaser windows become arches (photo behind)
  frame_landscape  #00FF00 → transparent, window measured: the venue photo's carved frame
  lantern, bougainvillea_tl/br, divider, accent_1, bg_page   layers that exist only with GPT (hidden until then)
  bg_tile → bg_wall, tile_1..4 → tile_N, web_hero → og-1200x630.jpg
The measured numbers go to img/manifest.json AND to the generated block at the end of site.css ("@gpt-layers", written
by this script; never edit it by hand), so CSS and manifest cannot drift.

INTERIM (a part not there yet): stand-ins cut from GPT pixels already in the repo (nothing drawn, K21 — cut, rotated,
toned, blurred, scaled and placed only; the theme stays "coming" and is never sold on these):

  wood     collections/10_Tuscan_Vineyard/assets/gpt/parts/oak_tile.png        (1254², oak planks)
  plaster  collections/05_Lemon_Mediterranean/assets/gpt/parts/bg_tile.png     (1254², seamless lime plaster)
  tiles    collections/05_Lemon_Mediterranean/assets/gpt/parts/frame_portrait.png (its painted tile border)

  door_l / door_r  two leaves cut side by side from the oak, turned upright, toned to deep cedar (the doors swing in)
  court            the plaster toned warm saffron: the lantern-lit courtyard seen through the open doors
  card_paper       the plaster toned ivory: the invitation card that comes out through the doorway
  bg_wall          the plaster toned night teal (seamless, repeats): the courtyard wall of every page
  tile_1..4        four single tiles cut from the border, blue turned teal: the zellige row that lays itself
  ph_*             photo placeholders (blurred, lifted crops of the teal wall)
  og / favicon     the closed doors on the wall, a sliver of court light between them (placed, not painted)

  python3 platform/themes/riad-lantern-nights/build_images.py
"""
from __future__ import annotations

import colorsys
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

COL = ROOT / "collections/27_Riad_Lantern_Nights"
PARTS = COL / "assets/gpt/parts"
SRC = {
    "wood": ROOT / "collections/10_Tuscan_Vineyard/assets/gpt/parts/oak_tile.png",
    "plaster": ROOT / "collections/05_Lemon_Mediterranean/assets/gpt/parts/bg_tile.png",
    "tiles": ROOT / "collections/05_Lemon_Mediterranean/assets/gpt/parts/frame_portrait.png",
}
OUT = THEME / "img"
CSS = THEME / "site.css"
LEAF = 0.38                      # one door leaf, width / height (a tall riad door; the pair is 0.76)
# three single tiles of the 05 frame border (x0, y0, x1, y1), inside the gold grout: flower, leaf spray, daisy — and
# the mirrored leaf spray between them as the fourth
TILE_BOXES = [(163, 289, 233, 361), (253, 289, 339, 361), (472, 289, 556, 361), (360, 289, 446, 361)]
# fixed pixel sizes of the pieces the pages name by file (img/<name>-<width>.webp): a GPT part is scaled to these, so
# its files carry the same names as the interim ones (tema_build.webp names a file by its width)
LEAF_PX = (477, 1254)
COURT_PX = (953, 1254)           # the opening, aspect = the pair (.76)
BAND_W = 1254                    # court_band, 16:9
CARD_PX = (878, 1254)            # the card, .70
TILE_PX = (76, 152)
# the doorway surround around the opening (fractions of the opening's width / height: left, top, right, bottom); the
# CSS of .riad>.doorway places the cut with exactly these numbers (left -18%, top -45%, width 136%, height 155%)
DOORWAY_EXT = (0.18, 0.45, 0.18, 0.10)
GREEN_TINT = 80                  # #00FF00 key: g - max(r, b) above this (and g > 150) = window

used: dict[str, str] = {}


def gpt(name: str, mode: str = "RGBA") -> Image.Image | None:
    p = PARTS / f"{name}.png"
    if p.exists():
        used[name] = f"gpt parts/{name}.png"
        return Image.open(p).convert(mode)
    return None


def tone(im: Image.Image, dark, light, gamma: float = 1.0) -> Image.Image:
    """Duotone of the image's own luminance: shadows → `dark`, highlights → `light` (the grain stays, nothing added)."""
    g = np.asarray(im.convert("L")).astype(float) / 255
    g = (g - g.min()) / max(g.max() - g.min(), 1e-6)
    g = g ** gamma
    d, l = np.array(dark, float), np.array(light, float)
    rgb = d + (l - d) * g[..., None]
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def teal_tile(im: Image.Image) -> Image.Image:
    """The painted blue of a tile turned teal, its white warmed to ivory; the gold dots stay (hue shift, no drawing)."""
    a = np.asarray(im.convert("RGB")).astype(float) / 255
    out = np.empty_like(a)
    for y in range(a.shape[0]):
        for x in range(a.shape[1]):
            h, s, v = colorsys.rgb_to_hsv(*a[y, x])
            if 0.55 < h < 0.75 and s > 0.25:          # cobalt → deep teal
                h, s, v = 0.49, min(1, s * 0.85), v * 0.82
            elif s < 0.2:                              # white glaze → warm ivory
                r, g, b = a[y, x]
                out[y, x] = (r * 0.97, g * 0.92, b * 0.80)
                continue
            out[y, x] = colorsys.hsv_to_rgb(h, s, v)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), "RGB")


def alpha_crop(im: Image.Image, esik: int = 24) -> Image.Image:
    k = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)
    if k is None:
        raise ValueError("part is fully transparent")
    return im.crop(k)


def to_size(im: Image.Image, size, name: str, notes: list) -> Image.Image:
    """Scale a GPT piece to the fixed size the pages name; note an aspect change > 4 % or an upscale > 1.5×."""
    w, h = im.size
    d = (w / h) / (size[0] / size[1]) - 1
    if abs(d) > 0.04:
        notes.append(f"{name}: aspect {w}/{h} differs {d:+.1%} from {size[0]}/{size[1]} — stretched to fit; check the part")
    if size[0] / w > 1.5:
        notes.append(f"{name}: upscaled {size[0] / w:.2f}× ({w} → {size[0]} px)")
    return im.resize(size, Image.LANCZOS) if im.size != tuple(size) else im


def key_green(im: Image.Image):
    """#00FF00 window → transparent (2 px grown, so no green fringe), the green spill on its edge neutralised.
    Returns (RGBA image, window box (x0, y0, x1, y1) or None)."""
    a = np.asarray(im.convert("RGBA")).astype(np.int16)
    tint = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
    win = (tint > GREEN_TINT) & (a[..., 1] > 150) & (a[..., 3] > 0)
    if win.sum() < 0.002 * win.size:
        return im.convert("RGBA"), None
    win = tb.en_buyuk_bolge(win)
    if not 0.03 < win.sum() / max((a[..., 3] > 0).sum(), 1) < 0.9:      # a sliver, or the whole piece: not a window
        return im.convert("RGBA"), None
    ys, xs = np.nonzero(win)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    grown = tb.genislet(win, 2)
    out = a.copy()
    out[..., 3][grown] = 0
    # the hidden pixels take the frame's own colour round the window: lossy WebP (4:2:0 chroma) would otherwise bleed
    # the invisible green into the visible edge
    ring = tb.genislet(win, 10) & ~grown & (a[..., 3] > 200)
    if ring.any():
        out[..., :3][grown] = np.median(a[..., :3][ring], 0).astype(np.int16)
    spill = tb.genislet(win, 5) & ~grown & (tint > 0)            # green cast on the frame's inner edge
    out[..., 1][spill] = np.maximum(out[..., 0], out[..., 2])[spill]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA"), box


def pct_box(box, size):
    W, H = size
    x0, y0, x1, y1 = box
    return [round(100 * x0 / W, 2), round(100 * y0 / H, 2), round(100 * (x1 - x0) / W, 2), round(100 * (y1 - y0) / H, 2)]


def framed(name: str, out_w: int, manifest: dict, notes: list):
    """frame_arch / frame_landscape: the frame alone, window keyed → {file, aspect, window_pct} or None."""
    im = gpt(name)
    if im is None:
        return None
    im, win = key_green(alpha_crop(im))
    if win is None:
        notes.append(f"{name}: no #00FF00 window found — not used")
        used[name] += " (no window: not used)"
        return None
    tb.webp(im, name, [out_w], 84, manifest, out=OUT)
    return {"file": manifest[name]["files"][-1]["file"], "aspect": f"{im.width}/{im.height}",
            "window_pct": pct_box(win, im.size)}


def card_layout(card: Image.Image, win, notes: list) -> dict:
    """The GPT card: window box, plain-paper zone (free_zone, theme-check) and the text block's padding under the window
    (% of the card width, CSS padding)."""
    W, H = card.size
    wp = pct_box(win, card.size)
    zone = tb.serbest_bolge(card, .5, adim=1.0, ornek=(.74, .80))
    below = wp[1] + wp[3] + 2
    rows = [r for r in zone if r[0] >= below and r[1] is not None]
    if not rows:
        notes.append("card_small: no plain paper under the window — text padding is a guess (8 %)")
        side, last = 8.0, 92.0
    else:
        last = max(r[0] for r in rows) + 1
        mid = [r for r in rows if r[0] <= last - 2] or rows
        side = max(max(r[1] for r in mid), max(100 - r[2] for r in mid)) + 2
    k = H / W                                                   # % of height → % of width
    return {"window_pct": wp, "free_zone": zone,
            "pad_pct_of_width": [round(below * k, 2), round(side, 2), round(max(100 - last + 2, 4) * k, 2)]}


def gpt_css(stage: dict, layers: dict) -> str:
    """The generated block at the end of site.css: switches on the GPT-only layers and places the GPT card window, the
    arch / landscape frames and the doorway with the numbers measured above. Empty (a comment) while all are interim."""
    r = []
    card = stage.get("card", {})
    if card.get("window_pct"):
        x, y, w, h = card["window_pct"]
        pt, ps, pb = card["pad_pct_of_width"]
        r += [f".hero-card{{aspect-ratio:{CARD_PX[0]}/{CARD_PX[1]};width:min(84vw,400px,calc((100svh - var(--nav-h) - 120px) * {CARD_PX[0] / CARD_PX[1]:.4f}))}}",
              ".hero-card>.card-img,.riad>.card>.card-img{object-fit:fill;z-index:1}",
              f".hero-copy{{position:static;min-height:100%;display:flex;flex-direction:column;justify-content:center;justify-content:safe center;padding:{pt}% {ps}% {pb}%}}",
              f".hero-photo,.riad .card-photo{{position:absolute;left:{x}%;top:{y}%;width:{w}%;height:{h}%;margin:0;z-index:0}}",
              ".hero-copy>:not(.hero-photo),.card-copy>:not(.card-photo){position:relative;z-index:2;zoom:var(--k,1)}",
              ".hero-photo.ty-fill{display:block}",
              ".riad>.card{top:12%;height:76%}",
              f".card-copy{{position:static;justify-content:center;justify-content:safe center;padding:{pt}% {ps}% {pb}%}}"]
    arch = layers.get("frame_arch")
    if arch:
        x, y, w, h = arch["window_pct"]
        r += [f".window,.gallery-item button,.teaser-windows .window{{aspect-ratio:{arch['aspect']};background:none}}",
              f".window>img{{position:absolute;left:{x}%;top:{y}%;width:{w}%;height:{h}%}}",
              f".window>.arch{{display:block;background-image:url(img/{arch['file']})}}"]
    land = layers.get("frame_landscape")
    if land:
        x, y, w, h = land["window_pct"]
        r += [f".venue-photo{{aspect-ratio:{land['aspect']};background:none}}",
              f".venue-photo>img{{position:absolute;left:{x}%;top:{y}%;width:{w}%;height:{h}%}}",
              f".venue-photo>.frame{{display:block;background-image:url(img/{land['file']})}}"]
    if layers.get("doorway"):
        r += [f".riad>.doorway{{display:block;background-image:url(img/{layers['doorway']['file']})}}",
              # the arch stands 45 % of the doors' height above them: smaller doors, room above the stage
              ".stage{--obj:min(54vw,calc(33svh * .76),280px);margin-top:calc(var(--obj) / .76 * .45 + 26px)}",
              "@media(max-height:700px) and (max-width:759px){.stage{--obj:min(48vw,calc(29svh * .76));margin-top:calc(var(--obj) / .76 * .45 + 14px)}}"]
    if layers.get("lantern"):
        r += [f".lantern{{display:block;aspect-ratio:{layers['lantern']['aspect']};background-image:url(img/{layers['lantern']['file']})}}",
              ".stage>.lantern-glow{top:-26%}"]
    for k in ("bougainvillea_tl", "bougainvillea_br"):
        if layers.get(k):
            r.append(f".bloom-{k[-2:]}{{display:block;background-image:url(img/{layers[k]['file']})}}")
    if layers.get("divider"):
        r.append(f".divider{{display:block;aspect-ratio:{layers['divider']['aspect']};background-image:url(img/{layers['divider']['file']})}}")
    if layers.get("bg_page"):
        r.append(f"@media(max-width:759px){{.page-opening{{background:var(--night) url(img/{layers['bg_page']['file']}) 50% 0/cover no-repeat}}}}")
    if layers.get("accent_1"):
        r.append(f":root{{--petal:url(img/{layers['accent_1']['file']})}}")
    body = "\n".join(r) if r else "/* no GPT layer yet: interim pieces only */"
    return ("/* @gpt-layers — generated by build_images.py from img/manifest.json (stage, gpt_layers); do not edit by hand */\n"
            + body + "\n/* @end gpt-layers */\n")


def write_css_block(block: str) -> None:
    css = CSS.read_text(encoding="utf-8")
    pat = re.compile(r"/\* @gpt-layers.*?/\* @end gpt-layers \*/\n", re.S)
    css = pat.sub(lambda m: block, css) if pat.search(css) else css.rstrip("\n") + "\n" + block
    CSS.write_text(css, encoding="utf-8")


def main() -> int:
    notes: list[str] = []
    manifest: dict = {}
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    plaster = Image.open(SRC["plaster"]).convert("RGB")
    stage: dict = {"leaf_aspect": LEAF, "pair_aspect": round(2 * LEAF, 4), "hinges": "outer edges",
                   "swing": "inwards, away from the guest (rotateY ±76deg)"}
    layers: dict = {}

    # ---------------------------------------------------------------- doors (two leaves)
    doors = gpt("doors_closed")
    leaves = {}
    if doors is not None:
        seam = tb.dikis_bul(doors)
        x0, y0, x1, y1 = seam["box"]
        sx = int(round(seam["x"]))
        notes += seam.get("warnings", [])
        for name, box in (("door_l", (x0, y0, sx, y1)), ("door_r", (sx, y0, x1, y1))):
            leaf = alpha_crop(doors.crop(box), esik=8)
            leaves[name] = to_size(leaf, LEAF_PX, name, notes)
            tb.webp(leaves[name], name, [240, 480], 82, manifest, out=OUT)
        opening = (x0, y0, x1, y1)
        ow, oh = x1 - x0, y1 - y0
        stage.update({"method": "gpt", "canvas": list(doors.size), "opening_px": list(opening),
                      "opening_aspect": round(ow / oh, 4), "seam": {k: seam[k] for k in ("x", "method", "score")},
                      "leaf_widths_px": [sx - x0, x1 - sx]})
    else:
        wood = Image.open(SRC["wood"]).convert("RGB").transpose(Image.ROTATE_90)     # planks upright
        W, H = wood.size
        lw = round(H * LEAF)
        gap = (W - 2 * lw) // 3
        for name, x0 in (("door_l", gap), ("door_r", 2 * gap + lw)):
            leaf = wood.crop((x0, 0, x0 + lw, H))
            leaf = tone(leaf, (34, 15, 9), (150, 84, 46), gamma=1.1)                 # deep cedar
            leaf = ImageEnhance.Contrast(leaf).enhance(1.12)
            leaves[name] = leaf
            tb.webp(leaf, name, [240, 480], 78, manifest, out=OUT)
        opening = None
        stage["method"] = "interim"
        used["doors_closed"] = "interim (10 oak_tile, toned cedar)"

    # ---------------------------------------------------------------- doorway surround (GPT only, front layer)
    doorway = gpt("doorway")
    if doorway is not None and opening is not None:
        ow, oh = opening[2] - opening[0], opening[3] - opening[1]
        l, t, rr, b = DOORWAY_EXT
        region = (round(opening[0] - l * ow), round(opening[1] - t * oh), round(opening[2] + rr * ow), round(opening[3] + b * oh))
        lost = np.asarray(doorway)[..., 3].copy()
        lost[max(region[1], 0):region[3], max(region[0], 0):region[2]] = 0
        if (lost > 24).sum() > 0.002 * lost.size:
            notes.append("doorway: part of the surround lies outside DOORWAY_EXT around the doors and is cut off")
        cut = doorway.crop(region)                                                   # outside the canvas → transparent
        tb.webp(cut, "doorway", [440, 880], 82, manifest, out=OUT)
        layers["doorway"] = {"file": manifest["doorway"]["files"][-1]["file"],
                             "box_pct_of_opening": [-100 * l, -100 * t, round(100 * (1 + l + rr), 2), round(100 * (1 + t + b), 2)]}
    elif doorway is not None:
        notes.append("doorway: needs doors_closed.png (same canvas) to be placed — not used")
        used["doorway"] += " (waits for doors_closed)"

    # ---------------------------------------------------------------- court, card, wall
    court_src = gpt("courtyard", "RGB")
    if court_src is not None:
        box = opening
        if box is None:                                                             # no doors yet: the prompt's box
            cw, ch = court_src.size
            bw = round(cw * .74)
            bh = round(bw / (2 * LEAF))
            box = ((cw - bw) // 2, round(ch * .94) - bh, (cw + bw) // 2, round(ch * .94))
        court_in = to_size(court_src.crop(box), COURT_PX, "court", notes)
        tb.webp(court_in, "court", [440, 880], 76, manifest, out=OUT)
        band = tb.kapla(court_src, 16 / 9)
        band = band.resize((BAND_W, round(BAND_W * 9 / 16)), Image.LANCZOS)
        tb.webp(band, "court_band", [640, 1024], 72, manifest, out=OUT)
        court = court_in
    else:
        court = tone(plaster, (96, 50, 18), (246, 196, 112), gamma=0.9)              # warm saffron light
        tb.webp(tb.kapla(court, 2 * LEAF), "court", [440, 880], 74, manifest, out=OUT)
        tb.webp(tb.kapla(court, 16 / 9), "court_band", [640, 1024], 72, manifest, out=OUT)
        used["courtyard"] = "interim (05 plaster toned saffron)"

    card_src = gpt("card_small")
    if card_src is not None:
        card, win = key_green(to_size(alpha_crop(card_src), CARD_PX, "card_paper", notes))
        tb.webp(card, "card_paper", [480, 960], 82, manifest, out=OUT)
        if win is None:
            notes.append("card_small: no #00FF00 window found — the portrait stays in the text flow")
            stage["card"] = {"window_pct": None}
        else:
            lay = card_layout(card, win, notes)
            manifest["card_paper"]["free_zone"] = lay.pop("free_zone")
            stage["card"] = lay
    else:
        card = tone(plaster, (196, 170, 128), (252, 244, 226), gamma=0.8)            # ivory card
        tb.webp(tb.kapla(card, 0.7), "card_paper", [480, 960], 78, manifest, out=OUT)
        used["card_small"] = "interim (05 plaster toned ivory)"

    wall_src = gpt("bg_tile", "RGB")
    if wall_src is not None:
        wall = wall_src.resize((640, 640), Image.LANCZOS)
        tb.webp(wall, "bg_wall", [640], 72, manifest, out=OUT)
    else:
        wall = tone(plaster, (9, 33, 35), (34, 82, 82), gamma=1.0)                   # night teal, seamless
        tb.webp(wall.resize((640, 640), Image.LANCZOS), "bg_wall", [640], 72, manifest, out=OUT)
        used["bg_tile"] = "interim (05 plaster toned teal)"

    # ---------------------------------------------------------------- zellige row: four tiles
    border = Image.open(SRC["tiles"]).convert("RGB")
    for i, box in enumerate(TILE_BOXES, 1):
        t = gpt(f"tile_{i}", "RGB")
        if t is not None:
            t = tb.kapla(t, 1.0).resize((TILE_PX[1], TILE_PX[1]), Image.LANCZOS)
            tb.webp(t, f"tile_{i}", list(TILE_PX), 82, manifest, out=OUT)
        else:
            t = teal_tile(tb.kapla(border.crop(box), 1.0).resize((TILE_PX[0], TILE_PX[0]), Image.LANCZOS))
            tb.webp(t, f"tile_{i}", [TILE_PX[0]], 82, manifest, out=OUT)
            # the 2× file for sharp screens / print: the interim tile scaled up (the 05 border's tiles are ~76 px)
            big = OUT / f"tile_{i}-{TILE_PX[1]}.webp"
            t.resize((TILE_PX[1], TILE_PX[1]), Image.LANCZOS).save(big, "WEBP", quality=82, method=6)
            manifest[f"tile_{i}"]["files"].append({"file": f"tile_{i}-{TILE_PX[1]}.webp", "w": TILE_PX[1], "h": TILE_PX[1],
                                                   "bytes": (OUT / f"tile_{i}-{TILE_PX[1]}.webp").stat().st_size,
                                                   "upscaled": True})
            used[f"tile_{i}"] = "interim (05 frame_portrait border tile, teal)"

    # ---------------------------------------------------------------- GPT-only layers (hidden in the CSS until they exist)
    for name, widths, esik in (("lantern", [160, 320], 24), ("bougainvillea_tl", [240, 480], 24),
                               ("bougainvillea_br", [240, 480], 24), ("divider", [320, 640], 24),
                               ("accent_1", [120], 24)):
        im = gpt(name)
        if im is None:
            continue
        im = alpha_crop(im, esik)
        tb.webp(im, name, widths, 84, manifest, out=OUT)
        layers[name] = {"file": manifest[name]["files"][-1]["file"], "aspect": f"{im.width}/{im.height}"}
    bgp = gpt("bg_page", "RGB")
    if bgp is not None:
        tb.webp(bgp, "bg_page", [1024], 66, manifest, out=OUT)
        layers["bg_page"] = {"file": manifest["bg_page"]["files"][-1]["file"]}
    for name, w in (("frame_arch", 720), ("frame_landscape", 1024)):
        f = framed(name, w, manifest, notes)
        if f:
            layers[name] = f

    # ---------------------------------------------------------------- placeholders
    slots = {}
    for key, shape, ratio in (("hero_portrait", "portrait", 4 / 5), ("story", "window", 2 / 3), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(wall, (0, 0, wall.width, wall.height), ratio, w=640 if shape != "window" else 480,
                           ton=(40, 92, 90), karisim=.3, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640 if shape != "window" else 480], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-{640 if shape != 'window' else 480}.webp"
    manifest["placeholders"] = slots

    # ---------------------------------------------------------------- og + favicon
    hero = gpt("web_hero", "RGB")
    if hero is not None:
        og, og_info = tb.og_kirp(hero, hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    else:   # the closed doors on the wall, a sliver of court light between them
        og = Image.new("RGB", tb.OG_OLCU)
        tile = wall.resize((630, 630), Image.LANCZOS)
        for x in range(0, og.width, 630):
            og.paste(tile, (x, 0))
        dh = 560
        dw = round(dh * LEAF)
        sliver = court.convert("RGB").resize((40, dh), Image.LANCZOS)
        cx, top = og.width // 2, (og.height - dh) // 2 + 6
        og.paste(sliver, (cx - 20, top))
        for name, x in (("door_l", cx - dw - 3), ("door_r", cx + 3)):
            lf = leaves[name].resize((dw, dh), Image.LANCZOS).convert("RGBA")
            og.paste(lf, (x, top), lf)
        manifest["og"] = {"composed": "bg_wall + court sliver + door_l/door_r, centred", "file": "og-1200x630.jpg",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    if doors is not None:
        icon, icon_info = tb.ikon(doors, pay=0.1)
    else:
        lw, H = leaves["door_l"].size
        pair = Image.new("RGBA", (2 * lw + 24, H), (0, 0, 0, 0))
        pair.paste(court.resize((24, H)).convert("RGBA"), (lw, 0))
        pair.paste(leaves["door_l"].convert("RGBA"), (0, 0))
        pair.paste(leaves["door_r"].convert("RGBA"), (lw + 24, 0))
        icon, icon_info = tb.ikon(pair, pay=0.1)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # ---------------------------------------------------------------- stage geometry, CSS block, checks, manifest
    gpt_all = all(v.startswith("gpt") for v in used.values())
    manifest["_note"] = ("G167 build from the PAKET 5 parts (GPT_PROMPTS.md)." if gpt_all else
                         "G165/G167 build: every PAKET 5 part that exists is used (see 'sources'); the others are stand-ins "
                         "cut and toned from GPT pixels of 10 (oak) and 05 (plaster, tile border) — see build_images.py.")
    manifest["sources"] = dict(sorted(used.items()))
    manifest["stage"] = stage
    manifest["gpt_layers"] = layers
    if notes:
        manifest["warnings"] = notes
    write_css_block(gpt_css(stage, layers))
    # #00FF00 left visible: only the files cut from a part with a green window (bougainvillea leaves or a teal-green
    # glaze would count as "green" on any other file)
    keyed = [f for f in sorted(OUT.glob("*.webp")) if f.name.split("-")[0] in ("card_paper", "frame_arch", "frame_landscape")]
    manifest["checks"] = {"green": {f.name: n for f in keyed if (n := tb.yesil_gorunur(f))}}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 30},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    for n in notes:
        print("WARNING", n, file=sys.stderr)
    print(f"riad-lantern-nights: theme folder {manifest['bytes_total'] / 1e6:.2f} MB · GPT parts used: "
          f"{sum(v.startswith('gpt') for v in used.values())}/{len(used)}")
    if manifest["checks"]["green"]:
        print("ERROR: visible #00FF00", manifest["checks"]["green"], file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
