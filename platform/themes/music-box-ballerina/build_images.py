#!/usr/bin/env python3
"""Music Box Ballerina (32) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G171.

The opening object is a lacquered rose-quartz music box seen from the front (docs/24 #32): a brass wind-up key on its
right side, a lid on a back hinge with an oval mirror inside, a satin-lined well with a little ballerina folded away in
it. Tap → the key turns, the lid swings up on its hinge, the mirror stands up (the couple's portrait in it), the
ballerina rises and turns slowly, a few rose petals drift down, the invitation card rises out of the box and comes
forward to become the home page.

Every stage layer is a FULL-CANVAS picture (one 1024 × 1536 canvas, same place for every layer, PAKET 5 rule "parts
that sit on each other are drawn on the same canvas"), cropped here to the stage window CROP and stacked by the CSS at
100 %. Transform origins (hinges, key axis), the mirror window, the card and the ballerina's box are measured from the
layers' alpha and written to img/manifest.json → stage AND to the /* stage:begin … stage:end */ block of site.css (no
hand copy; tests/theme-music-box-ballerina.test.ts compares them).

GPT parts (collections/32_Music_Box_Ballerina/assets/gpt/parts/, PAKET 5 in GPT_PROMPTS.md) — used as soon as they exist:
  lid_open.png (oval mirror filled #00FF00)  interior.png  box_body.png  lid_closed.png  key.png
  dancer_turn_a.png + dancer_turn_b.png (four turn frames each, 384 px cells) — or dancer.png alone (one front pose,
  turned in 2D: horizontal scale by |cos|, the back half mirrored)
  card_small.png  petal_1.png petal_2.png petal_3.png  bg_page.png  satin_bg.png  web_hero.png
Output file names and widths never change whatever size GPT delivers (G167 drop-in, tools/gpt_kuru_deneme.py).

INTERIM (no part exists yet, 2026-10-17): every layer is cut, toned or masked from GPT pictures already in this
repository — nothing is drawn (K21, docs/11 §5.7):
  paper    collections/21_Crimson_Rose_Atelier/assets/gpt/textures/paper-background.png  (cream paper → lacquer, page)
  satin    collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_tile.png                   (ivory satin → lining, tulle)
  frame    collections/14_Ivory_Lace_Pearl/assets/gpt/parts/frame_portrait.png            (oval frame, #00FF00 window → mirror)
  medal    collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png                (gold disc → key stand-in)
  petals   collections/03_Blush_Garden_Rose/assets/gpt/parts/petals.png                   (six rose petals)
  card     collections/01_Olive_Ivory/assets/gpt/parts/card_small.png                    (ivory card)
The interim box, lid and well are plain rectangular crops toned to the palette; the interim "ballerina" is a plain
rectangle of toned satin turned in 2D — a slot that reads as a placeholder on purpose, not a figure.

  python3 platform/themes/music-box-ballerina/build_images.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/32_Music_Box_Ballerina"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"
CSS = THEME / "site.css"
INTERIM = {
    "paper": ROOT / "collections/21_Crimson_Rose_Atelier/assets/gpt/textures/paper-background.png",
    "satin": ROOT / "collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_tile.png",
    "frame": ROOT / "collections/14_Ivory_Lace_Pearl/assets/gpt/parts/frame_portrait.png",
    "medal": ROOT / "collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png",
    "petals": ROOT / "collections/03_Blush_Garden_Rose/assets/gpt/parts/petals.png",
    "card": ROOT / "collections/01_Olive_Ivory/assets/gpt/parts/card_small.png",
}
W, H = 1024, 1536                          # stage canvas of every PAKET 5 stage part (GPT_PROMPTS.md)
CROP = (0, 240, 1024, 1420)                # the stage window the page shows (the room above the box is for the lid)
# interim geometry on the canvas (x0, y0, x1, y1) — the same numbers as the prompts
LID_OPEN, MIRROR = (150, 200, 874, 905), (312, 290, 712, 790)
INTERIOR, BODY = (150, 880, 874, 1010), (112, 990, 912, 1400)
LID_CLOSED, KEY = (100, 880, 924, 1020), (896, 1112, 1014, 1268)
DANCER = (436, 660, 588, 990)              # the ballerina's box (all frames share it, feet on the pedestal)
CARD = (262, 1030, 762, 1360)              # the invitation card inside the box (500 × 330, behind the front)
CARD_TARGET_CY = 610                       # where the risen card's centre stops (canvas y, in front of the mirror)
FRAMES = 8                                 # turn frames in the sprite
CELL = 384                                 # GPT strip cell width (dancer_turn_a/b: 4 cells of 384 × 1024)
# palette (site.css :root)
QUARTZ, QUARTZ_DEEP, BLUSH, CREAM, TULLE, BRASS = (238, 206, 208), (205, 152, 160), (248, 228, 226), (255, 249, 244), (246, 222, 226), (201, 164, 92)

used: dict[str, str] = {}


def gpt(name: str, canvas: bool = False) -> Image.Image | None:
    """The GPT part, or None. canvas=True: a stage layer, scaled to the shared W × H canvas (PAKET 5: 1024 × 1536)."""
    p = PARTS / f"{name}.png"
    if p.exists():
        used[name] = f"gpt parts/{name}.png"
        im = Image.open(p).convert("RGBA")
        if canvas and im.size != (W, H):
            print(f"note: {name}.png is {im.size[0]}×{im.size[1]}, scaled to the {W}×{H} stage canvas", file=sys.stderr)
            im = im.resize((W, H), Image.LANCZOS)
        return im
    return None


def at_width(im: Image.Image, w: int) -> Image.Image:
    """At least `w` px wide (the widest file the pages name): tb.webp never upscales and would name a narrower piece
    <name>-<its width>.webp, which no page asks for."""
    if im.width >= w:
        return im
    print(f"note: a {im.width} px wide piece is scaled UP to {w} px (ask GPT for a larger one)", file=sys.stderr)
    return im.resize((w, max(1, round(im.height * w / im.width))), Image.LANCZOS)


def tone(src: Image.Image, colour, strength: float = .55) -> Image.Image:
    """Tone a texture to one palette colour: its own light/dark grain around the colour (no new marks)."""
    g = np.asarray(src.convert("L"), dtype=float)
    g = (g - g.mean()) / max(g.std(), 1.0)
    rgb = np.clip(np.array(colour, float)[None, None, :] + g[..., None] * 9.0 * strength, 0, 255)
    return Image.fromarray(rgb.astype(np.uint8), "RGB")


def on_canvas(piece: Image.Image, box, alpha: float = 1.0) -> Image.Image:
    """A piece placed (stretched) at `box` on the transparent stage canvas."""
    x0, y0, x1, y1 = box
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    p = piece.convert("RGBA").resize((x1 - x0, y1 - y0), Image.LANCZOS)
    if alpha < 1:
        p.putalpha(Image.fromarray((np.asarray(p)[..., 3] * alpha).astype(np.uint8)))
    layer.alpha_composite(p, (x0, y0))
    return layer


def green_mask(im: Image.Image) -> np.ndarray:
    """#00FF00 key: green clearly above red and blue (antialiased rim included)."""
    a = np.asarray(im.convert("RGBA")).astype(np.int16)
    return (a[..., 1] - np.maximum(a[..., 0], a[..., 2]) > 70) & (a[..., 1] > 120) & (a[..., 3] > 24)


def key_out(im: Image.Image) -> tuple[Image.Image, tuple[int, int, int, int] | None]:
    """Mirror window → transparent (the photo shows through it); returns the window box on the canvas."""
    m = green_mask(im)
    if m.sum() < 500:
        return im, None
    ys, xs = np.nonzero(m)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    grown = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    a = np.asarray(im.convert("RGBA")).copy()
    a[..., 3][grown] = 0
    rim = grown ^ m                       # despill the frame's inner edge
    a[..., 1][rim] = np.minimum(a[..., 1][rim], np.maximum(a[..., 0][rim], a[..., 2][rim]))
    return Image.fromarray(a, "RGBA"), box


def pure_green(out: Path) -> dict:
    bad = {}
    for f in sorted(Path(out).glob("*.webp")):
        a = np.asarray(Image.open(f).convert("RGBA")).astype(np.int16)
        n = int(((a[..., 1] >= 200) & (a[..., 0] <= 90) & (a[..., 2] <= 90) & (a[..., 3] > 25)).sum())
        if n:
            bad[f.name] = n
    return bad


def turn_2d(front: Image.Image, n: int) -> list[Image.Image]:
    """2D rotation of one front pose: horizontal scale |cos| around the vertical axis, the back half mirrored and a
    little darker (docs/24 #32: "2B döndürme")."""
    w, h = front.size
    frames = []
    for i in range(n):
        ang = 2 * np.pi * i / n
        sx = max(abs(np.cos(ang)), .14)
        src = front if np.cos(ang) >= 0 else front.transpose(Image.FLIP_LEFT_RIGHT)
        if np.cos(ang) < 0:
            a = np.asarray(src).astype(float)
            a[..., :3] *= .9
            src = Image.fromarray(a.astype(np.uint8), "RGBA")
        sq = src.resize((max(1, round(w * sx)), h), Image.LANCZOS)
        f = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        f.alpha_composite(sq, ((w - sq.width) // 2, 0))
        frames.append(f)
    return frames


def fit_frames(cells: list[Image.Image]) -> list[Image.Image]:
    """GPT turn frames → the DANCER box: one common scale (the tallest figure fills the box height), each figure
    bottom-centred on its own alpha (feet on the pedestal)."""
    bw, bh = DANCER[2] - DANCER[0], DANCER[3] - DANCER[1]
    boxes = [tb.alfa_kutusu(np.asarray(c)[..., 3], esik=24) for c in cells]
    tall = max(b[3] - b[1] for b in boxes)
    wide = max(b[2] - b[0] for b in boxes)
    s = min(bh / tall, bw / wide)
    out = []
    for c, b in zip(cells, boxes):
        fig = c.crop(b)
        fig = fig.resize((max(1, round(fig.width * s)), max(1, round(fig.height * s))), Image.LANCZOS)
        f = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
        f.alpha_composite(fig, ((bw - fig.width) // 2, bh - fig.height))
        out.append(f)
    return out


def stage_css(stage: dict) -> str:
    """The /* stage:begin … stage:end */ block of site.css, from manifest stage (percent of the stage window)."""
    L = stage["layers"]
    p = lambda v: f"{v:g}%"                                     # noqa: E731
    box = lambda b: f"left:{p(b[0])};top:{p(b[1])};width:{p(b[2])};height:{p(b[3])}"  # noqa: E731
    lc, lo, k = L["lid_closed"]["box_pct"], L["lid_open"]["box_pct"], L["key"]["box_pct"]
    lx, ly, lw, lh = L["lid_open"]["box_px"]
    wx, wy, ww, wh = stage["mirror"]["box_px"]
    r = lambda v: round(100 * v, 3)                              # noqa: E731
    return "\n".join([
        f"/* stage:begin — written by build_images.py from img/manifest.json \"stage\" (source: {stage['source']}); do not",
        f"   edit by hand. Stage = {stage['window'][2]}×{stage['window'][3]} px of the {W}×{H} canvas; the closed box is its lower",
        f"   {round(100 - stage['closed_top_pct'], 1)} %, the room above it is for the lid, the mirror and the risen card. */",
        f".stage{{aspect-ratio:{stage['window'][2]}/{stage['window'][3]};margin-top:calc(14px - var(--w) * {stage['room']})}}",
        f".lid-closed{{transform-origin:50% {p(lc[1])}}}",
        f".lid-up{{transform-origin:50% {p(round(lo[1] + lo[3], 3))}}}",
        f".key{{transform-origin:{p(round(k[0] + k[2] / 2, 3))} {p(round(k[1] + k[3] / 2, 3))}}}",
        f".mirror{{{box(stage['mirror']['box_pct'])}}}",
        f".dancer{{{box(stage['dancer']['box_pct'])}}}",
        f".box>.card{{{box(stage['card']['box_pct'])}}}",
        f".is-opened .box>.card{{transform:translateY({stage['card']['rise_pct']}%) scale(1.12)}}",
        f"@keyframes card-rise{{from{{transform:none}}to{{transform:translateY({stage['card']['rise_pct']}%)}}}}",
        f"@keyframes card-forward{{from{{transform:translateY({stage['card']['rise_pct']}%)}}to{{transform:translateY({stage['card']['rise_pct']}%) scale(1.12)}}}}",
        "/* the story page's mirror: the lid's oval window in flow (margins in % of the width), the lid picture round it */",
        f".mirror-stage{{padding-bottom:{r((ly + lh - wy - wh) / lw)}%}}",
        f".mirror-glass{{width:{r(ww / lw)}%;margin:{r((wy - ly) / lw)}% 0 0 {r((wx - lx) / lw)}%;aspect-ratio:{ww}/{wh}}}",
        f".mirror-lid{{width:{r(stage['window'][2] / lw)}%;left:-{r(lx / lw)}%;top:-{r(ly / lh)}%}}",
        "/* stage:end */",
    ])


def main() -> int:
    manifest: dict = {"_note": "G171 build. INTERIM layers (no Music Box Ballerina GPT part exists yet): rectangular "
                      "crops of repository GPT paper/satin toned to the palette, 14's oval frame as the mirror, 17's gold "
                      "disc as the key stand-in, a toned satin slot turned in 2D for the ballerina (see build_images.py). "
                      "PAKET 5 parts in collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md replace them."}
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()
    paper = Image.open(INTERIM["paper"]).convert("RGB")        # 1024 × 1536
    satin = Image.open(INTERIM["satin"]).convert("RGB")        # 1254 × 1254
    crop = lambda im: im.crop(CROP)                             # noqa: E731

    def layer(name: str, interim, widths=(440, 880), q=82, post=None):
        im = gpt(name, canvas=True)
        if im is None:
            im = interim()
            used[name] = "interim"
        if post:
            im = post(im)
        tb.webp(crop(im), name, list(widths), q, manifest, out=OUT)
        return im

    # ---------------------------------------------------------------- the music box (stage, bottom → top)
    def interim_lid_open():
        back = on_canvas(tone(satin.crop((0, 0, 900, 800)), BLUSH, .7), LID_OPEN)
        frame = Image.open(INTERIM["frame"]).convert("RGBA")
        fb = tb.alfa_kutusu(np.asarray(frame)[..., 3], esik=24)
        frame = frame.crop(fb)                                   # 14's oval frame: its own green window = the mirror glass
        fh = LID_OPEN[3] - LID_OPEN[1] - 40                    # the whole frame on the lid, its own proportions
        fw = round(frame.width * fh / frame.height)
        fx, fy = (LID_OPEN[0] + LID_OPEN[2] - fw) // 2, LID_OPEN[1] + 14
        back.alpha_composite(frame.resize((fw, fh), Image.LANCZOS), (fx, fy))
        return back
    lid_open_raw = gpt("lid_open", canvas=True)
    if lid_open_raw is None:
        lid_open_raw = interim_lid_open()
        used["lid_open"] = "interim (satin + 14 frame_portrait)"
    lid_open, window = key_out(lid_open_raw)
    if window is None:
        print("WARNING: lid_open.png has no #00FF00 mirror window — the prompt's mirror box is used", file=sys.stderr)
        window = MIRROR
    tb.webp(crop(lid_open), "lid_open", [440, 880], 82, manifest, out=OUT)
    interior = layer("interior", lambda: on_canvas(tone(satin.crop((100, 300, 1100, 480)), QUARTZ_DEEP, .8), INTERIOR))
    body = layer("box_body", lambda: on_canvas(tone(paper.crop((60, 400, 980, 880)), QUARTZ_DEEP, .75), BODY))
    lid_closed = layer("lid_closed", lambda: on_canvas(tone(paper.crop((60, 200, 980, 360)), QUARTZ, .7), LID_CLOSED))
    key = layer("key", lambda: on_canvas(Image.open(INTERIM["medal"]).convert("RGBA").crop(
        tb.alfa_kutusu(np.asarray(Image.open(INTERIM["medal"]).convert("RGBA"))[..., 3], esik=24)), KEY))

    # the ballerina: GPT turn strips (8 frames), else one GPT pose turned in 2D, else the interim satin slot in 2D
    strips = [gpt(n) for n in ("dancer_turn_a", "dancer_turn_b")]
    pose = gpt("dancer")                                       # the still front pose (footer, reduced motion)
    if all(s is not None for s in strips):
        cells = []
        for s in strips:
            s = s.resize((CELL * 4, round(s.height * CELL * 4 / s.width)), Image.LANCZOS) if s.width != CELL * 4 else s
            cells += [s.crop((i * CELL, 0, (i + 1) * CELL, s.height)) for i in range(4)]
        frames = fit_frames(cells)
        dancer_src = "gpt dancer_turn_a/b (8 frames)"
    elif pose is not None:
        frames = turn_2d(fit_frames([pose])[0], FRAMES)
        dancer_src = "gpt dancer.png turned in 2D (the turn strips are missing)"
    else:
        bw, bh = DANCER[2] - DANCER[0], DANCER[3] - DANCER[1]
        slot = tone(satin.crop((300, 200, 300 + bw * 2, 200 + bh * 2)), TULLE, .9).resize((bw * 3 // 5, bh))
        front = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
        front.alpha_composite(slot.convert("RGBA"), ((bw - slot.width) // 2, 0))
        frames = turn_2d(front, FRAMES)
        dancer_src = "interim (toned satin slot, 2D turn)"
    for n in ("dancer_turn_a", "dancer_turn_b", "dancer"):
        used.setdefault(n, "interim")
    still = fit_frames([pose])[0] if pose is not None else frames[0]
    fw, fh = 140, round(140 * (DANCER[3] - DANCER[1]) / (DANCER[2] - DANCER[0]))
    sprite = Image.new("RGBA", (fw * FRAMES, fh), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        sprite.alpha_composite(f.resize((fw, fh), Image.LANCZOS), (i * fw, 0))
    sprite.save(OUT / f"dancer_sprite-{sprite.width}.webp", "WEBP", quality=84, method=6, alpha_quality=90)
    manifest["dancer_sprite"] = {"file": f"dancer_sprite-{sprite.width}.webp", "frames": FRAMES, "frame": [fw, fh],
                                 "source": dancer_src, "bytes": (OUT / f"dancer_sprite-{sprite.width}.webp").stat().st_size}
    tb.webp(at_width(still, 140), "dancer", [140], 84, manifest, out=OUT)   # the still figure (reduced motion, footer)

    # the card inside the box: paper toned cream (GPT card_small.png: a blank card; names and date are HTML)
    card_src = gpt("card_small")
    cw, ch = CARD[2] - CARD[0], CARD[3] - CARD[1]
    if card_src is None:
        c = Image.open(INTERIM["card"]).convert("RGBA")
        c = c.crop(tb.alfa_kutusu(np.asarray(c)[..., 3], esik=24)).convert("RGB")
        card_src = tone(c.crop((0, 0, c.width, round(c.width * ch / cw))), CREAM, .35)
        used["card_small"] = "interim (01 card_small, toned cream)"
    else:
        card_src = card_src.crop(tb.alfa_kutusu(np.asarray(card_src)[..., 3], esik=24))
        if abs(card_src.width / card_src.height / (cw / ch) - 1) > .04:
            print(f"WARNING: card_small.png card is {card_src.width}×{card_src.height}, the stage card is {cw}:{ch} — "
                  "it is stretched; ask GPT again (W2.8)", file=sys.stderr)
    tb.webp(card_src.resize((cw, ch), Image.LANCZOS), "card_paper", [300, 500], 80, manifest, out=OUT)

    # ---------------------------------------------------------------- stage geometry → manifest + site.css
    cx0, cy0, cx1, cy1 = CROP
    sw, sh = cx1 - cx0, cy1 - cy0
    px = lambda v: round(100 * (v - cx0) / sw, 3)             # noqa: E731
    py = lambda v: round(100 * (v - cy0) / sh, 3)             # noqa: E731
    pbox = lambda b: [px(b[0]), py(b[1]), round(100 * (b[2] - b[0]) / sw, 3), round(100 * (b[3] - b[1]) / sh, 3)]  # noqa: E731
    stage = {"canvas": [W, H], "window": [cx0, cy0, sw, sh], "source": "gpt" if all(v.startswith("gpt") for k, v in used.items()
             if k in ("lid_open", "interior", "box_body", "lid_closed", "key")) else "interim", "layers": {}}
    for n, im in {"lid_open": lid_open, "interior": interior, "box_body": body, "lid_closed": lid_closed, "key": key}.items():
        b = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=24)
        stage["layers"][n] = {"box_pct": pbox(b), "box_px": [b[0] - cx0, b[1] - cy0, b[2] - b[0], b[3] - b[1]]}
    stage["mirror"] = {"box_pct": pbox(window), "box_px": [window[0] - cx0, window[1] - cy0, window[2] - window[0], window[3] - window[1]]}
    stage["dancer"] = {"box_pct": pbox(DANCER)}
    rise = round(100 * (CARD_TARGET_CY - (CARD[1] + CARD[3]) / 2) / (CARD[3] - CARD[1]), 3)
    stage["card"] = {"box_pct": pbox(CARD), "rise_pct": rise, "aspect": f"{cw}/{ch}"}
    closed_top = min(stage["layers"]["lid_closed"]["box_pct"][1], stage["layers"]["box_body"]["box_pct"][1])
    stage["closed_top_pct"] = closed_top
    stage["room"] = round(closed_top / 100 * sh / sw * .9, 4)   # × stage width: how far the stage tucks under the heading
    manifest["stage"] = stage
    block = stage_css(stage)
    css = CSS.read_text(encoding="utf-8")
    new = re.sub(r"/\* stage:begin.*?/\* stage:end \*/", lambda _m: block, css, flags=re.S)
    if new == css and "stage:begin" not in css:
        print("ERROR: site.css has no stage:begin … stage:end block", file=sys.stderr)
        return 1
    CSS.write_text(new, encoding="utf-8")

    # ---------------------------------------------------------------- petals, page grounds
    petals = [gpt(f"petal_{i}") for i in (1, 2, 3)]
    if any(p is None for p in petals):
        pieces = tb.bilesenler(Image.open(INTERIM["petals"]), n=6)
        petals = [p if p is not None else pieces[i * 2 % len(pieces)] for i, p in enumerate(petals)]
        for i in (1, 2, 3):
            used.setdefault(f"petal_{i}", "interim (03 petals.png)")
    for i, p in enumerate(petals, 1):
        tb.webp(at_width(p.crop(tb.alfa_kutusu(np.asarray(p)[..., 3], esik=16)), 480 if i == 1 else 120), f"petal_{i}", [120, 480] if i == 1 else [120], 84, manifest, out=OUT)

    bg = gpt("bg_page")
    bg = at_width(bg.convert("RGB"), 1024) if bg is not None else tone(paper, BLUSH, .45)
    if used.get("bg_page", "").startswith("gpt"):
        # the box page's text sits straight on this ground: theme-check "text over painted decor" fails at a mean
        # horizontal grey gradient > 2.2 on screen; same measure on the middle 70 % at phone size (640 px wide)
        g = bg.convert("L").resize((640, round(bg.height * 640 / bg.width)), Image.LANCZOS)
        mid = np.asarray(g.crop((96, int(g.height * .1), 544, int(g.height * .5))), float)
        lum, grad = float(mid.mean()), float(np.abs(np.diff(mid, axis=1)).mean())
        manifest["bg_page_middle"] = {"mean": round(lum, 1), "gradient": round(grad, 2)}
        if lum < 205 or grad > 1.8:
            print(f"WARNING: bg_page.png upper middle is not calm/light enough for the box page's text (mean {lum:.0f}, "
                  f"want >= 205; gradient {grad:.2f}) — ask GPT again (W2.10)", file=sys.stderr)
    used.setdefault("bg_page", "interim")
    tb.webp(bg, "bg_page", [640, 1024], 76, manifest, out=OUT)
    sat = gpt("satin_bg")
    sat = at_width(sat.convert("RGB"), 1280) if sat is not None else tone(satin, (250, 236, 233), .55).resize((1280, 1280))
    used.setdefault("satin_bg", "interim")
    tb.webp(sat, "bg_satin", [768, 1280], 74, manifest, out=OUT)

    # ---------------------------------------------------------------- placeholders, share image, icon
    slots = {}
    for key_, ratio in (("portrait", 4 / 5), ("wide", 16 / 9)):
        ph = tb.yer_tutucu(bg, (0, 0, bg.width, bg.height), ratio, w=640, ton=(246, 230, 228), karisim=.25, bulanik=6)
        tb.webp(ph, f"ph_{key_}", [640], 76, manifest, out=OUT)
        slots[key_] = f"ph_{key_}-640.webp"
    manifest["placeholders"] = slots
    closed = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for im in (interior, body, lid_closed, key):
        closed.alpha_composite(im.convert("RGBA"))
    hero = gpt("web_hero")
    if hero is None:
        # interim: the closed box (its own layers) on the page ground, wide crop — no text (K24)
        sheet = bg.resize((1200, 1800)).crop((0, 585, 1200, 1215)).convert("RGBA")
        cb = closed.crop(tb.alfa_kutusu(np.asarray(closed)[..., 3], esik=8))
        cb = cb.resize((620, round(cb.height * 620 / cb.width)), Image.LANCZOS)
        shadow = Image.new("RGBA", cb.size, (90, 50, 55, 0))
        shadow.putalpha(Image.fromarray((np.asarray(cb)[..., 3] * .25).astype(np.uint8)).filter(ImageFilter.GaussianBlur(16)))
        y = (630 - cb.height) // 2 + 30
        sheet.alpha_composite(shadow, (290, y + 16))
        sheet.alpha_composite(cb, (290, y))
        og, og_info = sheet.convert("RGB"), {"src_size": [1200, 630], "crop": [0, 0, 1200, 630], "align": "interim"}
        used["web_hero"] = "interim"
    else:
        og, og_info = tb.og_kirp(hero, hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(key)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # ---------------------------------------------------------------- checks + manifest
    manifest["sources"] = used
    waiting = sorted(n for n, v in used.items() if not v.startswith("gpt"))
    manifest["_note"] = ("G171 build from the PAKET 5 GPT parts (collections/32_Music_Box_Ballerina/assets/gpt/parts/)."
                         if not waiting else manifest["_note"] + " Still waiting for: " + ", ".join(waiting) + ".")
    manifest["checks"] = {"green": pure_green(OUT), "green_hue_info": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({"stage": stage, "sources": used}, indent=1, ensure_ascii=False))
    print(f"music-box-ballerina: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["checks"]["green"]:
        print("ERROR: visible #00FF00", manifest["checks"]["green"], file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
