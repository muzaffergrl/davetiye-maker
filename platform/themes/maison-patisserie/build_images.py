#!/usr/bin/env python3
"""Maison Pâtisserie (28) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). G166.

The opening object is a pistachio pâtisserie box seen from above (docs/24 #28): a satin ribbon crosses the lid and is
tied in a bow; the bow unties (two loops part, the knot drops), the four ribbon arms slide off, the lid lifts away,
two sheets of tissue paper part and the invitation card inside comes forward. Every stage layer is a FULL-CANVAS
picture (one 1024 × 1024 canvas, same place for every layer, PAKET 5 rule "parts that sit on each other are drawn on
the same canvas"), so the CSS stacks them at 100 % and never measures a piece; transform origins come from the alpha
boxes written to manifest.json → stage.

GPT parts (collections/28_Maison_Patisserie/assets/gpt/parts/, PAKET 5 in GPT_PROMPTS.md) — used as soon as they exist:
  box_base.png  lid.png  ribbon_cross.png  bow_left.png  bow_right.png  bow_knot.png  tissue_left.png  tissue_right.png
  card_small.png  bg_page.png  bg_tile.png  shelf.png  accent_1.png (sugar pearl)  web_hero.png
Every output keeps the SAME file names and widths whatever size GPT delivers (G167 drop-in rehearsal,
tools/gpt_kuru_deneme.py): each part is scaled to the canvas / width the pages ask for (img/<name>-<w>.webp in the HTML).
INTERIM (none of them exist yet, 2026-10-17): until they arrive each layer is cut, toned, mirrored or masked from GPT
pictures that are already in this repository — nothing is drawn (K21, docs/11 §5.7):
  paper    collections/21_Crimson_Rose_Atelier/assets/gpt/textures/paper-background.png  (plain cream paper)
  satin    collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_tile.png                   (ivory satin sheen)
  bow      collections/14_Ivory_Lace_Pearl/assets/gpt/parts/accent_3.png                  (ivory satin bow)
  pearl    collections/14_Ivory_Lace_Pearl/assets/gpt/parts/accent_1.png                  (pearl drop; the body only)
The interim box / lid / tissue / card / shelf are plain rectangular crops of the paper or the satin, toned to the
palette (the same move as Nocturne's interim card, G142); the bow is the ivory bow toned rose and cut at its knot into
two loops + the knot (docs/11 §7.1: a bow is "cut at the knot and pulled to the two sides"). These borrowed pixels are
placeholders, not the design: GPT_PROMPTS.md orders the real parts, and this file switches layer by layer.

  python3 platform/themes/maison-patisserie/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/28_Maison_Patisserie"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"
INTERIM = {
    "paper": ROOT / "collections/21_Crimson_Rose_Atelier/assets/gpt/textures/paper-background.png",
    "satin": ROOT / "collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_tile.png",
    "bow": ROOT / "collections/14_Ivory_Lace_Pearl/assets/gpt/parts/accent_3.png",
    "pearl": ROOT / "collections/14_Ivory_Lace_Pearl/assets/gpt/parts/accent_1.png",
}
C = 1024                                   # stage canvas (px), square: the box seen from above
# palette (site.css :root)
PISTACHIO, PISTACHIO_DEEP, ROSE, CREAM, TISSUE, PLATE = (181, 205, 168), (147, 176, 137), (232, 182, 186), (252, 247, 238), (255, 251, 246), (236, 222, 196)
# interim geometry on the canvas (x0, y0, x1, y1)
LID, BASE = (32, 32, 992, 992), (54, 54, 970, 970)
BAND = 104                                 # ribbon width
CARD = (232, 142, 792, 882)                # the invitation card inside the box (560 × 740)
TISSUE_L, TISSUE_R = (54, 54, 548, 970), (476, 54, 970, 970)

used: dict[str, str] = {}


def gpt(name: str, canvas: bool = False) -> Image.Image | None:
    """The GPT part, or None. canvas=True: a stage layer, scaled to the shared C × C canvas (PAKET 5: 1024 × 1024)."""
    p = PARTS / f"{name}.png"
    if p.exists():
        used[name] = f"gpt parts/{name}.png"
        im = Image.open(p).convert("RGBA")
        if canvas and im.size != (C, C):
            print(f"note: {name}.png is {im.size[0]}×{im.size[1]}, scaled to the {C}×{C} stage canvas", file=sys.stderr)
            im = im.resize((C, C), Image.LANCZOS)
        return im
    return None


def at_width(im: Image.Image, w: int) -> Image.Image:
    """At least `w` px wide (the widest file the pages name): tb.webp never upscales and would name a narrower piece
    <name>-<its width>.webp, which no page asks for (a broken image). Wider pieces are left to tb.webp."""
    if im.width >= w:
        return im
    print(f"note: a {im.width} px wide piece is scaled UP to {w} px (ask GPT for a larger one)", file=sys.stderr)
    return im.resize((w, max(1, round(im.height * w / im.width))), Image.LANCZOS)


def pure_green(out: Path) -> dict:
    """Residue of a #00FF00 key window: near-pure green pixels only. No Maison part has a window (GPT_PROMPTS.md), and
    tb.yesil_denetle's hue test also fires on a deep, saturated pistachio (e.g. 50,100,45) — the box's own colour — so
    that test is recorded as information and this stricter one decides."""
    bad = {}
    for f in sorted(Path(out).glob("*.webp")):
        a = np.asarray(Image.open(f).convert("RGBA")).astype(np.int16)
        n = int(((a[..., 1] >= 200) & (a[..., 0] <= 90) & (a[..., 2] <= 90) & (a[..., 3] > 25)).sum())
        if n:
            bad[f.name] = n
    return bad


def tone(src: Image.Image, colour, strength: float = .55) -> Image.Image:
    """Tone a texture to one palette colour: its own light/dark grain around the colour (no new marks)."""
    g = np.asarray(src.convert("L"), dtype=float)
    g = (g - g.mean()) / max(g.std(), 1.0)
    rgb = np.clip(np.array(colour, float)[None, None, :] + g[..., None] * 9.0 * strength, 0, 255)
    return Image.fromarray(rgb.astype(np.uint8), "RGB")


def seamless(src: Image.Image, size: int) -> Image.Image:
    """A repeatable tile: a crop mirrored 2 × 2 (no seam where the copies meet)."""
    q = src.crop((0, 0, size // 2, size // 2))
    t = Image.new("RGB", (size, size))
    t.paste(q, (0, 0))
    t.paste(q.transpose(Image.FLIP_LEFT_RIGHT), (size // 2, 0))
    t.paste(q.transpose(Image.FLIP_TOP_BOTTOM), (0, size // 2))
    t.paste(q.transpose(Image.ROTATE_180), (size // 2, size // 2))
    return t


def on_canvas(piece: Image.Image, box, alpha: float = 1.0) -> Image.Image:
    """A rectangular crop placed at `box` on the transparent stage canvas."""
    x0, y0, x1, y1 = box
    layer = Image.new("RGBA", (C, C), (0, 0, 0, 0))
    p = piece.convert("RGBA").resize((x1 - x0, y1 - y0), Image.LANCZOS)
    if alpha < 1:
        p.putalpha(Image.fromarray((np.asarray(p)[..., 3] * alpha).astype(np.uint8)))
    layer.paste(p, (x0, y0), p)
    return layer


def knot_split(bow: Image.Image):
    """Left loop, knot and right loop of a bow: the narrowest run of alpha columns around the middle is the knot."""
    a = np.asarray(bow)[..., 3]
    x0, y0, x1, y1 = tb.alfa_kutusu(a)
    cols = (a[y0:y1, x0:x1] > 128).sum(0).astype(float)
    w = x1 - x0
    mid = slice(int(w * .3), int(w * .7))
    lo = cols[mid].min()
    run = np.flatnonzero(cols[mid] <= lo * 1.18) + int(w * .3)
    k0, k1 = x0 + run.min(), x0 + run.max() + 1
    parts = {}
    for name, (c0, c1) in {"bow_l": (0, k0), "bow_knot": (k0, k1), "bow_r": (k1, bow.width)}.items():
        m = np.zeros_like(a)
        m[:, c0:c1] = 1
        rgba = np.asarray(bow).copy()
        rgba[..., 3] = rgba[..., 3] * m
        parts[name] = Image.fromarray(rgba, "RGBA")
    return parts, (int(k0), int(k1))


def main() -> int:
    manifest: dict = {"_note": "G166 build. INTERIM layers (no Maison Pâtisserie GPT part exists yet): rectangular crops "
                      "of repository GPT paper/satin toned to the palette, the ivory bow toned rose and cut at its knot "
                      "(see build_images.py). PAKET 5 parts in collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md "
                      "replace them layer by layer."}
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()
    paper = Image.open(INTERIM["paper"]).convert("RGB")        # 1024 × 1536
    satin = Image.open(INTERIM["satin"]).convert("RGB")        # 1254 × 1254

    def layer(name: str, interim, widths=(440, 880), q=82):
        im = gpt(name, canvas=True) or interim()
        used.setdefault(name, "interim")
        tb.webp(im, name, list(widths), q, manifest, out=OUT)
        return im

    # ---------------------------------------------------------------- the box (stage, bottom → top)
    base = layer("box_base", lambda: on_canvas(tone(paper.crop((40, 300, 1000, 1260)), PISTACHIO_DEEP, .7), BASE))
    tissue_src = tone(satin.crop((0, 0, 1000, 1000)), TISSUE, .6)
    tl = layer("tissue_left", lambda: on_canvas(tissue_src.crop((0, 0, 494, 916)), TISSUE_L, .96))
    tr = layer("tissue_right", lambda: on_canvas(tissue_src.crop((506, 0, 1000, 916)).transpose(Image.FLIP_LEFT_RIGHT), TISSUE_R, .96))
    lid = layer("lid", lambda: on_canvas(tone(paper.crop((32, 260, 992, 1220)), PISTACHIO, .6), LID))

    # ribbon: one cross over the lid (GPT ribbon_cross.png), cut into four arms at the middle so each slides away
    cross = gpt("ribbon_cross", canvas=True)
    if cross is None:
        band = tone(satin.crop((100, 0, 100 + BAND * 2, 1254)), ROSE, .9)
        cross = Image.new("RGBA", (C, C), (0, 0, 0, 0))
        v = on_canvas(band.resize((BAND, LID[3] - LID[1])), (512 - BAND // 2, LID[1], 512 + BAND // 2, LID[3]))
        h = on_canvas(band.resize((BAND, LID[2] - LID[0])).transpose(Image.ROTATE_90), (LID[0], 512 - BAND // 2, LID[2], 512 + BAND // 2))
        cross.alpha_composite(h)
        cross.alpha_composite(v)
        used["ribbon_cross"] = "interim"
    ca = np.asarray(cross)
    arms = ("ribbon_n", "ribbon_s", "ribbon_w", "ribbon_e")
    yy, xx = np.mgrid[0:C, 0:C]
    # each canvas pixel belongs to the arm whose direction it lies in from the centre (diagonals split the knot square)
    owner = np.where(np.abs(yy - 512) >= np.abs(xx - 512), np.where(yy < 512, 0, 1), np.where(xx < 512, 2, 3))
    for i, name in enumerate(arms):
        rgba = ca.copy()
        rgba[..., 3] = rgba[..., 3] * (owner == i)
        tb.webp(Image.fromarray(rgba, "RGBA"), name, [440, 880], 82, manifest, out=OUT)

    # bow: two loops + the knot (GPT bow_left / bow_right / bow_knot, or the interim bow cut at its knot)
    if all((PARTS / f"{n}.png").exists() for n in ("bow_left", "bow_right", "bow_knot")):
        bows = {"bow_l": gpt("bow_left", True), "bow_knot": gpt("bow_knot", True), "bow_r": gpt("bow_right", True)}
        knot = None
    else:
        src = Image.open(INTERIM["bow"]).convert("RGBA")
        bx = tb.alfa_kutusu(np.asarray(src)[..., 3], esik=8)
        src = src.crop((bx[0] - 6, bx[1] - 6, bx[2] + 6, bx[3] + 6))
        rgb = np.asarray(src).copy()
        toned = np.asarray(tone(src.convert("RGB"), ROSE, 1.25))
        lum = np.asarray(src.convert("L"), dtype=float)[..., None] / 255
        rgb[..., :3] = np.clip(toned * (.72 + .38 * lum), 0, 255).astype(np.uint8)   # keep the satin's light
        src = Image.fromarray(rgb, "RGBA")
        bw = 600                                                   # bow width on the canvas
        bh = round(src.height * bw / src.width)
        src = src.resize((bw, bh), Image.LANCZOS)
        placed = Image.new("RGBA", (C, C), (0, 0, 0, 0))
        placed.paste(src, (512 - bw // 2, 512 - bh // 2 - 14), src)
        bows, knot = knot_split(placed)
        for n in bows:
            used[n] = "interim (14 accent_3 toned rose, cut at the knot)"
    for n, im in bows.items():
        tb.webp(im, n, [440, 880], 84, manifest, out=OUT)
    whole = Image.alpha_composite(Image.alpha_composite(bows["bow_l"], bows["bow_knot"]), bows["bow_r"])
    wb = tb.alfa_kutusu(np.asarray(whole)[..., 3], esik=8)
    tb.webp(at_width(whole.crop((wb[0] - 4, wb[1] - 4, wb[2] + 4, wb[3] + 4)), 480), "bow", [240, 480], 84, manifest, out=OUT)  # footer, thank-you card
    knot_ok = tb.ortusme(np.asarray(Image.alpha_composite(Image.alpha_composite(bows["bow_l"], bows["bow_knot"]), bows["bow_r"])),
                         [np.asarray(b) for b in bows.values()])

    # the card inside: paper toned cream (GPT card_small.png: a blank card, the photo window is the HTML photo slot)
    card_src = gpt("card_small")
    if card_src is None:
        card_src = tone(paper.crop((120, 200, 680, 940)), CREAM, .45)
        used["card_small"] = "interim"
    else:
        card_src = card_src.crop(tb.alfa_kutusu(np.asarray(card_src)[..., 3], esik=24))   # the card alone, its own edge kept
        want = (CARD[2] - CARD[0]) / (CARD[3] - CARD[1])
        if abs(card_src.width / card_src.height / want - 1) > .04:   # the HTML card is 560:740; > 4 % = visibly stretched
            print(f"WARNING: card_small.png card is {card_src.width}×{card_src.height} (ratio {card_src.width / card_src.height:.3f}), "
                  f"the stage card is 560:740 ({want:.3f}) — it is stretched; ask GPT again", file=sys.stderr)
    card_src = card_src.resize((CARD[2] - CARD[0], CARD[3] - CARD[1]), Image.LANCZOS)
    tb.webp(card_src, "card_paper", [320, 560], 80, manifest, out=OUT)

    pct = lambda v: round(100 * v / C, 3)                       # noqa: E731
    box = lambda im: [int(v) for v in tb.alfa_kutusu(np.asarray(im)[..., 3], esik=24)]  # noqa: E731
    stage = {"canvas": [C, C], "objAspect": 1.0, "layers": {}}
    for n, im in {"box_base": base, "tissue_left": tl, "tissue_right": tr, "lid": lid, **bows}.items():
        x0, y0, x1, y1 = box(im)
        stage["layers"][n] = {"box_pct": [pct(x0), pct(y0), pct(x1 - x0), pct(y1 - y0)],
                              "center_pct": [pct((x0 + x1) / 2), pct((y0 + y1) / 2)]}
    stage["card"] = {"box_pct": [pct(CARD[0]), pct(CARD[1]), pct(CARD[2] - CARD[0]), pct(CARD[3] - CARD[1])],
                     "aspect": f"{CARD[2] - CARD[0]}/{CARD[3] - CARD[1]}"}
    stage["knot_cols"] = knot
    stage["bow_cut_overlap"] = round(float(knot_ok), 5)
    manifest["stage"] = stage

    # ---------------------------------------------------------------- page ground, shelf, sugar pearl
    bg = gpt("bg_page")
    bg = at_width(bg.convert("RGB"), 1024) if bg is not None else tone(paper, CREAM, .5)
    if used.get("bg_page", "").startswith("gpt"):
        # the box page's kicker, names, date and hint sit straight on this ground: theme-check "text over painted decor"
        # fails at a mean horizontal grey gradient > 2.2 on screen (scripts/lib/theme-env.ts backdrop.edge_max). Same
        # measure on the middle 70 % at phone size (640 px wide); interim: mean 247, gradient 0.77.
        g = bg.convert("L").resize((640, round(bg.height * 640 / bg.width)), Image.LANCZOS)
        mid = np.asarray(g.crop((96, int(g.height * .15), 544, int(g.height * .85))), float)
        lum, grad = float(mid.mean()), float(np.abs(np.diff(mid, axis=1)).mean())
        manifest["bg_page_middle"] = {"mean": round(lum, 1), "gradient": round(grad, 2)}
        if lum < 215 or grad > 1.8:
            print(f"WARNING: bg_page.png middle is not calm/light enough for the box page's dark text (mean {lum:.0f}, "
                  f"want >= 215; gradient {grad:.2f}, theme-check fails > 2.2) — ask GPT again (W2.10)", file=sys.stderr)
    used.setdefault("bg_page", "interim")
    tb.webp(bg, "bg_page", [640, 1024], 76, manifest, out=OUT)
    tile = gpt("bg_tile")
    tile = tile.convert("RGB").resize((640, 640)) if tile is not None else seamless(tone(paper.crop((200, 400, 840, 1040)), CREAM, .5), 640)
    used.setdefault("bg_tile", "interim")
    tb.webp(tile, "bg_tile", [640], 74, manifest, out=OUT)
    shelf = gpt("shelf")
    if shelf is not None:
        shelf = at_width(shelf.crop(tb.alfa_kutusu(np.asarray(shelf)[..., 3], esik=24)), 1200)   # pages: shelf-600 / -1200
    else:
        shelf = tone(satin.crop((0, 600, 1254, 660)), PLATE, .8).resize((1200, 44))
        used["shelf"] = "interim"
    tb.webp(shelf, "shelf", [600, 1200], 80, manifest, out=OUT)
    pearl = gpt("accent_1")
    if pearl is None:
        src = Image.open(INTERIM["pearl"]).convert("RGBA").crop((470, 650, 784, 980))   # the pearl body, below its cap
        a = np.asarray(src).copy()
        a[..., :3] = np.clip(a[..., :3].astype(float) * .35 + 255 * .65 * (a[..., :3] / 255.0) ** .6, 0, 255).astype(np.uint8)
        pearl = Image.fromarray(a, "RGBA")
        used["accent_1"] = "interim (14 accent_1, pearl body only)"
    pb = tb.alfa_kutusu(np.asarray(pearl)[..., 3], esik=8)
    tb.webp(at_width(pearl.crop(pb), 200), "accent_1", [200], 84, manifest, out=OUT)

    # ---------------------------------------------------------------- placeholders, share image, icon
    slots = {}
    for key, ratio in (("portrait", 4 / 5), ("wide", 3 / 2)):
        ph = tb.yer_tutucu(bg, (0, 0, bg.width, bg.height), ratio, w=640, ton=(238, 232, 219), karisim=.2, bulanik=6)
        tb.webp(ph, f"ph_{key}", [640], 76, manifest, out=OUT)
        slots[key] = f"ph_{key}-640.webp"
    manifest["placeholders"] = slots
    hero = gpt("web_hero")
    if hero is None:
        # interim: the closed box (its own layers) on the page ground, wide crop — no text (K24)
        sheet = bg.resize((1200, 1800)).crop((0, 585, 1200, 1215)).convert("RGBA")
        closed = Image.new("RGBA", (C, C), (0, 0, 0, 0))
        for im in (base, lid, cross, *bows.values()):
            closed.alpha_composite(im.convert("RGBA"))
        closed = closed.resize((560, 560), Image.LANCZOS)
        shadow = Image.new("RGBA", closed.size, (60, 70, 50, 0))
        shadow.putalpha(Image.fromarray((np.asarray(closed)[..., 3] * .28).astype(np.uint8)).filter(ImageFilter.GaussianBlur(18)))
        sheet.alpha_composite(shadow, (320, 52))
        sheet.alpha_composite(closed, (320, 35))
        og, og_info = sheet.convert("RGB"), {"src_size": [1200, 630], "crop": [0, 0, 1200, 630], "align": "interim"}
        used["web_hero"] = "interim"
    else:
        og, og_info = tb.og_kirp(hero, hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(whole)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # ---------------------------------------------------------------- checks + manifest
    manifest["sources"] = used
    waiting = sorted(n for n, v in used.items() if not v.startswith("gpt"))
    manifest["_note"] = ("G166/G167 build from the PAKET 5 GPT parts (collections/28_Maison_Patisserie/assets/gpt/parts/)."
                         if not waiting else manifest["_note"] + " Still waiting for: " + ", ".join(waiting) + ".")
    manifest["checks"] = {"green": pure_green(OUT), "green_hue_info": tb.yesil_denetle(OUT),
                          "bow_cut_overlap": stage["bow_cut_overlap"]}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({"stage": stage, "sources": used}, indent=1, ensure_ascii=False))
    print(f"maison-patisserie: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["checks"]["green"]:
        print("ERROR: visible #00FF00", manifest["checks"]["green"], file=sys.stderr)
        return 1
    if stage["bow_cut_overlap"] > .01:
        print("ERROR: the bow pieces do not add up to the bow", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
