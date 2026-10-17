#!/usr/bin/env python3
"""Sky Lantern Festival (31) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G170.

Two source modes, chosen PART BY PART (each PAKET 5 part is used as soon as its file exists; a missing part keeps its
interim stand-in). Either way the pages get the same file names (fixed pixel sizes below), so nothing in the HTML changes
when GPT's parts arrive.

GPT parts (collections/31_Sky_Lantern_Festival/assets/gpt/parts/, PAKET 5 in GPT_PROMPTS.md):
  hands, lantern_dark, lantern_lit   ONE 1024×1536 canvas, same position (the lantern held in cupped hands): each is
                   scaled whole to SCENE_PX and shown full size over the stage (CSS inset 0), so they stay registered;
                   the lantern's alpha box goes to the manifest (stage.lantern_box_pct; the halo is centred on it)
  sky_dusk         the dusk sky (9:16, opaque) → sky (the opening page and the home hero) + a 16:9 cover crop → sky_band
  star_dust        star specks on transparent (same 9:16) → a parallax layer over the sky (GPT only)
  lantern_far      one small distant lantern → lantern_far (the drifting lanterns, schedule marks, the reply's lantern)
  card_small       the card alone, scaled to the card size below; its #00FF00 window keyed transparent and measured
                   (stage.card.window_pct) — the portrait sits BEHIND the card, so the window shape is GPT's own outline;
                   the plain paper under the window = free_zone (theme-check: card text stays on it)
  frame_paper      #00FF00 → transparent, window measured: the story / teaser photos sit behind a rice-paper mat
  frame_landscape  #00FF00 → transparent, window measured: the venue photo's frame
  divider          a trail of star dust (GPT only)
  bg_tile → bg_wall, web_hero → og-1200x630.jpg
The measured numbers go to img/manifest.json AND to the generated block at the end of site.css ("@gpt-layers", written
by this script; never edit it by hand), so CSS and manifest cannot drift.

INTERIM (a part not there yet): stand-ins cut from GPT pixels already in the repo (nothing drawn, K21 — cut, toned,
blurred, scaled and placed only; the theme stays "coming" and is never sold on these):

  wash   collections/02_Dusty_Blue/assets/gpt/parts/bg_tile.png          (1024², soft blue watercolor wash)
  paper  collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png   (1254², plain cotton paper)

  sky          the wash toned row by row: deep violet at the top, dusk rose in the middle, amber at the horizon
  bg_wall      the wash toned deep dusk violet (repeats): the evening sky of every page
  lantern_*    a tall rectangle of the paper, toned dusky rose (dark) and glowing amber (lit), on the scene canvas
  lantern_far  the lit paper, small: the distant lanterns
  card_paper   the paper toned warm rice-paper ivory: the invitation card that appears in the lantern's light
  ph_*         photo placeholders (blurred, lifted crops of the sky)
  og / favicon the lit lantern rising in the dusk sky, two distant ones beside it (placed, not painted)
  hands, star_dust, frame_paper, frame_landscape, divider: none until GPT (hidden in the CSS)

  python3 platform/themes/sky-lantern-festival/build_images.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/31_Sky_Lantern_Festival"
PARTS = COL / "assets/gpt/parts"
SRC = {
    "wash": ROOT / "collections/02_Dusty_Blue/assets/gpt/parts/bg_tile.png",
    "paper": ROOT / "collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png",
}
OUT = THEME / "img"
CSS = THEME / "site.css"
# fixed pixel sizes of the pieces the pages name by file (img/<name>-<width>.webp): a GPT part is scaled to these, so
# its files carry the same names as the interim ones (tema_build.webp names a file by its width)
SCENE_PX = (800, 1200)           # hands / lantern canvas, 2:3 (GPT 1024×1536)
SCENE_W = [400, 800]
SKY_PX = (1080, 1920)            # 9:16
SKY_W = [540, 1080]
BAND_W = 1024                    # sky_band, 16:9
FAR_PX = (144, 216)              # one distant lantern, 2:3
CARD_PX = (878, 1254)            # the card, .70
# the interim lantern on the scene canvas (fractions: x0, y0, x1, y1) = where the prompts put GPT's lantern
LANTERN_BOX = (0.31, 0.27, 0.69, 0.67)
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


def dusk(im: Image.Image, stops) -> Image.Image:
    """The wash toned row by row: each row is a duotone of its own luminance between the (dark, light) pair of the
    nearest stops (top → bottom) — colour grading of GPT's watercolor, no shape and no line added."""
    g = np.asarray(im.convert("L")).astype(float) / 255
    g = (g - g.min()) / max(g.max() - g.min(), 1e-6)
    h = g.shape[0]
    pos = np.array([s[0] for s in stops])
    out = np.empty(g.shape + (3,))
    for y in range(h):
        t = y / max(h - 1, 1)
        i = min(max(int(np.searchsorted(pos, t)) - 1, 0), len(stops) - 2)
        k = (t - pos[i]) / max(pos[i + 1] - pos[i], 1e-6)
        d = np.array(stops[i][1], float) * (1 - k) + np.array(stops[i + 1][1], float) * k
        l = np.array(stops[i][2], float) * (1 - k) + np.array(stops[i + 1][2], float) * k
        out[y] = d + (l - d) * g[y][:, None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGB")


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
    """frame_paper / frame_landscape: the frame alone, window keyed → {file, aspect, window_pct} or None."""
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
    """The generated block at the end of site.css: switches on the GPT-only layers and places the GPT card window and
    the photo frames with the numbers measured above. Empty (a comment) while all are interim."""
    r = []
    card = stage.get("card", {})
    if card.get("window_pct"):
        x, y, w, h = card["window_pct"]
        pt, ps, pb = card["pad_pct_of_width"]
        r += [f".hero-card{{aspect-ratio:{CARD_PX[0]}/{CARD_PX[1]};width:min(84vw,400px,calc((100svh - var(--nav-h) - 120px) * {CARD_PX[0] / CARD_PX[1]:.4f}))}}",
              ".hero-card>.card-img,.stage .card>.card-img{object-fit:fill;z-index:1}",
              f".hero-copy{{position:static;min-height:100%;display:flex;flex-direction:column;justify-content:center;justify-content:safe center;padding:{pt}% {ps}% {pb}%}}",
              f".hero-photo,.stage .card-photo{{position:absolute;left:{x}%;top:{y}%;width:{w}%;height:{h}%;margin:0;z-index:0}}",
              ".hero-copy>:not(.hero-photo),.card-copy>:not(.card-photo){position:relative;z-index:2;zoom:var(--k,1)}",
              ".hero-photo.ty-fill{display:block}",
              f".card-copy{{position:static;justify-content:center;justify-content:safe center;padding:{pt}% {ps}% {pb}%}}"]
    paper = layers.get("frame_paper")
    if paper:
        x, y, w, h = paper["window_pct"]
        r += [f".lit-photo{{aspect-ratio:{paper['aspect']};background:none}}",
              f".lit-photo>img{{position:absolute;left:{x}%;top:{y}%;width:{w}%;height:{h}%}}",
              f".lit-photo>.mat{{display:block;background-image:url(img/{paper['file']})}}"]
    land = layers.get("frame_landscape")
    if land:
        x, y, w, h = land["window_pct"]
        r += [f".venue-photo{{aspect-ratio:{land['aspect']};background:none}}",
              f".venue-photo>img{{position:absolute;left:{x}%;top:{y}%;width:{w}%;height:{h}%}}",
              f".venue-photo>.frame{{display:block;background-image:url(img/{land['file']})}}"]
    if layers.get("hands"):
        r.append(f".hands{{display:block;background-image:url(img/{layers['hands']['file']})}}")
    if layers.get("star_dust"):
        r.append(f".stars{{display:block;background-image:url(img/{layers['star_dust']['file']})}}")
    if layers.get("divider"):
        r.append(f".divider{{display:block;aspect-ratio:{layers['divider']['aspect']};background-image:url(img/{layers['divider']['file']})}}")
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

    wash = Image.open(SRC["wash"]).convert("RGB")
    paper = Image.open(SRC["paper"]).convert("RGB")
    stage: dict = {"canvas": "2:3 scene (hands + lantern on one canvas)", "lantern_box_pct": [round(100 * v, 2) for v in LANTERN_BOX]}
    layers: dict = {}

    # ---------------------------------------------------------------- the lantern in the hands (one canvas)
    scene: dict[str, Image.Image] = {}
    for name in ("lantern_dark", "lantern_lit", "hands"):
        im = gpt(name)
        if im is not None:
            scene[name] = to_size(im, SCENE_PX, name, notes)
    lit_paper = tone(paper, (150, 62, 18), (255, 218, 150), gamma=0.7)                  # glowing amber paper
    dark_paper = tone(paper, (64, 40, 62), (206, 168, 160), gamma=1.0)                 # dusky rose paper, unlit
    W, H = SCENE_PX
    x0, y0, x1, y1 = (round(LANTERN_BOX[0] * W), round(LANTERN_BOX[1] * H), round(LANTERN_BOX[2] * W), round(LANTERN_BOX[3] * H))
    for name, src in (("lantern_dark", dark_paper), ("lantern_lit", lit_paper)):
        if name in scene:
            continue
        canvas = Image.new("RGBA", SCENE_PX, (0, 0, 0, 0))
        canvas.paste(tb.kapla(src, (x1 - x0) / (y1 - y0)).resize((x1 - x0, y1 - y0), Image.LANCZOS).convert("RGBA"), (x0, y0))
        scene[name] = canvas
        used[name] = f"interim (18 paper toned {'amber, lit' if name == 'lantern_lit' else 'dusky rose'})"
    for name in ("lantern_dark", "lantern_lit"):
        tb.webp(scene[name], name, SCENE_W, 82, manifest, out=OUT)
    k = tb.alfa_kutusu(np.asarray(scene["lantern_dark"])[..., 3], esik=24)
    if k is not None:
        stage["lantern_box_pct"] = [round(100 * k[0] / W, 2), round(100 * k[1] / H, 2), round(100 * k[2] / W, 2), round(100 * k[3] / H, 2)]
    if "hands" in scene:
        tb.webp(scene["hands"], "hands", SCENE_W, 82, manifest, out=OUT)
        layers["hands"] = {"file": manifest["hands"]["files"][-1]["file"]}

    # ---------------------------------------------------------------- the sky, the page wall, the distant lantern
    sky_src = gpt("sky_dusk", "RGB")
    if sky_src is not None:
        sky = to_size(sky_src, SKY_PX, "sky", notes)
    else:
        sky = dusk(tb.kapla(wash, SKY_PX[0] / SKY_PX[1]), [
            (0.0, (24, 16, 44), (66, 48, 104)),       # deep violet
            (0.45, (58, 36, 82), (150, 104, 150)),    # dusk mauve
            (0.75, (120, 64, 82), (226, 150, 132)),   # rose
            (1.0, (170, 92, 52), (250, 196, 126)),    # amber horizon
        ]).resize(SKY_PX, Image.LANCZOS)
        used["sky_dusk"] = "interim (02 watercolor wash toned violet → rose → amber)"
    tb.webp(sky, "sky", SKY_W, 74, manifest, out=OUT)
    band = tb.kapla(sky.crop((0, round(SKY_PX[1] * .25), SKY_PX[0], SKY_PX[1])), 16 / 9)
    tb.webp(band.resize((BAND_W, round(BAND_W * 9 / 16)), Image.LANCZOS), "sky_band", [640, 1024], 72, manifest, out=OUT)

    wall_src = gpt("bg_tile", "RGB")
    if wall_src is not None:
        wall = wall_src.resize((640, 640), Image.LANCZOS)
    else:
        wall = tone(wash, (20, 14, 38), (58, 42, 88), gamma=1.0).resize((640, 640), Image.LANCZOS)   # deep dusk violet
        used["bg_tile"] = "interim (02 watercolor wash toned dusk violet)"
    tb.webp(wall, "bg_wall", [640], 72, manifest, out=OUT)

    far_src = gpt("lantern_far")
    if far_src is not None:
        far = to_size(alpha_crop(far_src), FAR_PX, "lantern_far", notes)
    else:
        far = tb.kapla(lit_paper, FAR_PX[0] / FAR_PX[1]).resize(FAR_PX, Image.LANCZOS).convert("RGBA")
        used["lantern_far"] = "interim (18 paper toned amber, small)"
    tb.webp(far, "lantern_far", [FAR_PX[0] // 2, FAR_PX[0]], 82, manifest, out=OUT)

    stars = gpt("star_dust")
    if stars is not None:
        tb.webp(to_size(stars, SKY_PX, "star_dust", notes), "star_dust", SKY_W, 80, manifest, out=OUT)
        layers["star_dust"] = {"file": manifest["star_dust"]["files"][-1]["file"]}

    # ---------------------------------------------------------------- the card
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
        card = tone(paper, (204, 178, 146), (253, 246, 232), gamma=0.8)                   # warm rice-paper ivory
        tb.webp(tb.kapla(card, 0.7), "card_paper", [480, 960], 78, manifest, out=OUT)
        used["card_small"] = "interim (18 paper toned rice-paper ivory)"

    # ---------------------------------------------------------------- GPT-only layers (hidden in the CSS until they exist)
    div = gpt("divider")
    if div is not None:
        div = alpha_crop(div)
        tb.webp(div, "divider", [320, 640], 84, manifest, out=OUT)
        layers["divider"] = {"file": manifest["divider"]["files"][-1]["file"], "aspect": f"{div.width}/{div.height}"}
    for name, w in (("frame_paper", 720), ("frame_landscape", 1024)):
        f = framed(name, w, manifest, notes)
        if f:
            layers[name] = f

    # ---------------------------------------------------------------- placeholders
    slots = {}
    for key, shape, ratio, w in (("hero_portrait", "portrait", 4 / 5, 640), ("story", "story", 3 / 4, 480), ("venue", "wide", 16 / 9, 640)):
        ph = tb.yer_tutucu(sky, (0, round(sky.height * .2), sky.width, round(sky.height * .8)), ratio, w=w,
                           ton=(92, 70, 120), karisim=.3, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [w], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-{w}.webp"
    manifest["placeholders"] = slots

    # ---------------------------------------------------------------- og + favicon
    lit_box = tb.alfa_kutusu(np.asarray(scene["lantern_lit"])[..., 3], esik=24)
    lit = scene["lantern_lit"].crop(lit_box)
    hero = gpt("web_hero", "RGB")
    if hero is not None:
        og, og_info = tb.og_kirp(hero, hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    else:   # the lit lantern rising in the dusk sky, two distant ones beside it
        ow, oh = tb.OG_OLCU
        og = tb.kapla(sky, ow / oh).resize((ow, oh), Image.LANCZOS)
        lh = 280
        lw = round(lh * lit.width / lit.height)
        og.paste(lit.resize((lw, lh), Image.LANCZOS), ((ow - lw) // 2, 150), lit.resize((lw, lh), Image.LANCZOS))
        for x, y, s in ((300, 150, 64), (880, 80, 46)):
            f = far.resize((round(s * FAR_PX[0] / FAR_PX[1]), s), Image.LANCZOS)
            og.paste(f, (x, y), f)
        manifest["og"] = {"composed": "sky + lantern_lit (centre) + two lantern_far", "file": "og-1200x630.jpg",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(scene["lantern_lit"], pay=0.12)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # ---------------------------------------------------------------- stage geometry, CSS block, checks, manifest
    gpt_all = all(v.startswith("gpt") for v in used.values())
    manifest["_note"] = ("G170 build from the PAKET 5 parts (GPT_PROMPTS.md)." if gpt_all else
                         "G170 build: every PAKET 5 part that exists is used (see 'sources'); the others are stand-ins "
                         "cut and toned from GPT pixels of 02 (watercolor wash) and 18 (paper) — see build_images.py.")
    manifest["sources"] = dict(sorted(used.items()))
    manifest["stage"] = stage
    manifest["gpt_layers"] = layers
    if notes:
        manifest["warnings"] = notes
    write_css_block(gpt_css(stage, layers))
    # #00FF00 left visible: only the files cut from a part with a green window
    keyed = [f for f in sorted(OUT.glob("*.webp")) if f.name.split("-")[0] in ("card_paper", "frame_paper", "frame_landscape")]
    manifest["checks"] = {"green": {f.name: n for f in keyed if (n := tb.yesil_gorunur(f))}}
    manifest["theme_check"] = {"particles": ".accent-layer,.drift", "first_screen": {"landscape": False, "names_min_px": 30},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    for n in notes:
        print("WARNING", n, file=sys.stderr)
    print(f"sky-lantern-festival: theme folder {manifest['bytes_total'] / 1e6:.2f} MB · GPT parts used: "
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
