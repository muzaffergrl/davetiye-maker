#!/usr/bin/env python3
"""Grand Theatre Premiere (24) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G424.

Redesign of 2026-10-22 (docs/35 row 24, pilot G423): every picture is the design's own PAKET 5R part
(collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  page_ground (W1)      playbill-640/1024    warm ivory laid programme paper: the page ground of every page
  card_paper (W2)       board-640/1024       ivory programme board: the home card, programme pages, the reply card
  velvet_ground (W3)    velvet-640/1024      peacock-teal silk velvet: the invitation band, the signature, the reply band
  env_back (W4)         back-960             the horizontal peacock linen envelope lined with an oil-painted stage (the envelope box)
  env_front (W5)        front-960            the front pocket = the stage apron with its gilded lip and five brass footlights
  curtain_left (W6)     curtain_l-560        the left burgundy velvet curtain (hinged on the envelope's outer left edge)
  curtain_right (W7)    curtain_r-560        the right curtain (hinged on the outer right edge)
  curtain_left_in (W8)  curtain_l_in-480     the left curtain's inside (gold silk lining) — its back face once it swings open
  curtain_right_in (W9) curtain_r_in-480     the right curtain's inside
  valance (W10)         valance-960          the fixed swagged velvet valance across the top
  ticket (W11)          ticket_body-300 + ticket_stub-136   the blank ticket, cut at its MEASURED perforation into two
  rope (W12)            rope_l-210 + rope_r-210             the gold tasselled cord, cut at its knot into two halves
  card_small (W13)      card-720             the ivory programme card that rises from the stage
  portrait_frame (W14)  proscenium-720       the gilded proscenium portrait frame (home, the card); window measured
  story_frame (W15)     programme-720        a programme page with a photo window (story Acts, the story teaser)
  venue_frame (W16)     venue-1100           the wide proscenium (venue); window measured
  corner_ornament (W17) corner-720           gilded acanthus with a burgundy rose (home card, reply card corners)
  divider (W18)         divider-1000         the gilded acanthus divider with its tassel
  opera_glasses (W19)   glasses-480          the antique brass opera glasses (home signature, the reply closing)
  accent_1..3 (W20)     confetti/petal_red/petal_ivory-160   the accents that drift during the opening and after a reply
  web_hero (W21)        og-1200x630.jpg      share image (tema_build.og_kirp, bottom-aligned)

The envelope layers (W4–W7, W10–W12) share one 1448×1086 canvas. GPT kept the back and the pocket in one box but drew
the curtains, valance, ticket and rope a little off the prompt's geometry (the ticket 34–66 % × 54–70 % instead of 40–60 %
× 50.5–61.5 %, its perforation at 56.3 % instead of 54.6 %). Each layer is cut to its own alpha box and placed by that box
in the envelope box (the back's alpha box) — the canvas keeps them aligned with one another; the pocket spans the back's
width and is squeezed (3 %) to end on the back's bottom edge. The ticket is cut through the centre line of its punched
holes (measured: the column of the most see-through pixels between the corner notches), so each piece keeps half-holes,
a real tear line. The cord is cut at its knot (the middle of its box). Footlights: the five brass shells along the lip are
measured (columns where the pocket rises above its moulding) — site.css sets its CSS glow (light, not drawn) on them.
Photo windows: the window = the transparent hole the frame encloses (flood fill from the window's centre over every
pixel that is not solid frame; green rim pixels count as window), grown 2 px and cleared, the green spill round it
neutralised; a technical alpha mask PNG of that hole (mask_<name>.png, window box) clips the photo (CSS mask-image) so no
photo corner shows through a gap between drape and pilaster.

  python3 platform/themes/grand-theatre-premiere/build_images.py [--still <png>]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/24_Grand_Theatre_Premiere"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (243, 235, 216)        # placeholder tone (ivory programme paper)
REQUIRED = ["page_ground", "card_paper", "velvet_ground", "env_back", "env_front", "curtain_left", "curtain_right",
            "curtain_left_in", "curtain_right_in", "valance", "ticket", "rope", "card_small", "portrait_frame",
            "story_frame", "venue_frame", "corner_ornament", "divider", "opera_glasses", "accent_1", "accent_2",
            "accent_3", "web_hero"]
CARD_W = 70.0                    # % of the envelope width: the programme card once it has come forward


def part(ad: str) -> Image.Image:
    return Image.open(PARTS / f"{ad}.png").convert("RGBA")


def box(im: Image.Image, esik: int = 8):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def trim(im: Image.Image, esik: int = 8) -> Image.Image:
    k = box(im, esik)
    return im.crop(k) if k else im


def r2(v: float) -> float:
    return round(float(v), 2)


def _grow(m: np.ndarray, px: int) -> np.ndarray:
    """Dilate a boolean mask by `px` pixels (PIL MaxFilter; no scipy on the build machines)."""
    im = Image.fromarray(m.astype(np.uint8) * 255, "L").filter(ImageFilter.MaxFilter(2 * px + 1))
    return np.asarray(im) > 127


def _flood(free: np.ndarray, seed) -> np.ndarray:
    """The connected region of `free` pixels that contains `seed` (x, y) (PIL flood fill; scipy is not installed)."""
    im = Image.fromarray(free.astype(np.uint8) * 255, "L").copy()   # fromarray is read-only: copy before the fill
    ImageDraw.floodfill(im, seed, 128)
    return np.asarray(im) == 128


def keyed_window(im: Image.Image):
    """The photo window of a framed part = the hole the frame encloses: every pixel that is not solid frame (alpha < 200,
    or GPT's green ≈ #00FF00 rim), connected to the window's centre (the centre of the green, else of the part), grown 2
    px and cleared; the green spill in a 12 px ring round it is neutralised.
    (RGBA, window box (L, T, W, H) % of the image, window mask cropped to the box) or (im, None, None)."""
    c = np.asarray(im).copy()
    h, w = c.shape[:2]
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    free = (c[..., 3] < 200) | green
    if green.sum() > 2000:
        ys, xs = np.nonzero(green)
        seed = (int((xs.min() + xs.max()) / 2), int((ys.min() + ys.max()) / 2))
    else:
        seed = (w // 2, h // 2)
    if not free[seed[1], seed[0]]:
        return im, None, None
    hole = _flood(free, seed)
    ys, xs = np.nonzero(hole)
    if xs.min() == 0 or ys.min() == 0 or xs.max() == w - 1 or ys.max() == h - 1:
        return im, None, None                       # not enclosed: the flood ran out of the frame
    win = _grow(hole, 2)
    ys, xs = np.nonzero(win)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    c[win, 3] = 0
    ring = _grow(win, 12) & ~win
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    # the mask grows 3 px more than the cleared window so the photo runs under the frame's inner edge
    mask = _grow(win, 3)[y0:y1, x0:x1]
    return (Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h),
            Image.fromarray(mask.astype(np.uint8) * 255, "L"))


def place(inner, outer):
    """The box `inner` (x0, y0, x1, y1 px) in % of the box `outer`: [left, top, width, height]."""
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def perforation(ticket: Image.Image) -> int:
    """The ticket's perforation column (px of the cut ticket): the column with the most see-through pixels in the
    ticket's middle rows, away from the notched ends (the punched holes are real alpha)."""
    a = np.asarray(ticket)[..., 3]
    h, w = a.shape
    holes = (a[int(h * .15):int(h * .85)] < 60).sum(0).astype(float)
    lo, hi = int(w * .2), int(w * .9)
    band = holes[lo:hi]
    cols = np.nonzero(band >= band.max() * .8)[0] + lo
    return int(round(cols.mean()))


def footlights(front: Image.Image) -> list:
    """The five brass footlight shells on the pocket's lip: columns where the lip rises > 10 px above its moulding
    (% of the cut pocket's width, centres)."""
    a = np.asarray(front)[..., 3] > 100
    top = np.where(a.any(0), a.argmax(0), a.shape[0])
    base = np.median(top)
    up = top < base - 10
    runs, start = [], None
    for x, v in enumerate(list(up) + [False]):
        if v and start is None:
            start = x
        elif not v and start is not None:
            runs.append((start + x - 1) / 2)
            start = None
    return [r2(100 * c / a.shape[1]) for c in runs]


def envelope_still(layers: dict, stage: dict, h: int) -> Image.Image:
    """The closed envelope as the index page shows it — for the composition check (--still <file>)."""
    w = round(h * stage["aspect"])
    pad = round(h * .1)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    for key in ("back", "front", "curtain_r", "curtain_l", "valance", "ticket_body", "ticket_stub", "rope_l", "rope_r"):
        L, T, W, H = stage[key]
        im = layers[key].resize((max(1, round(w * W / 100)), max(1, round(h * H / 100))), Image.LANCZOS)
        canvas.alpha_composite(im, (pad + round(w * L / 100), pad + round(h * T / 100)))
    return canvas


def main() -> int:
    missing = [k for k in REQUIRED if not (PARTS / f"{k}.png").exists()]
    if missing:
        print("ERROR: parts missing: " + ", ".join(missing), file=sys.stderr)
        return 1
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    playbill = Image.open(PARTS / "page_ground.png").convert("RGB")
    board = Image.open(PARTS / "card_paper.png").convert("RGB")
    velvet = Image.open(PARTS / "velvet_ground.png").convert("RGB")
    tb.webp(playbill, "playbill", [640, 1024], 72, manifest, out=OUT)
    tb.webp(board, "board", [640, 1024], 72, manifest, out=OUT)
    tb.webp(velvet, "velvet", [640, 1024], 70, manifest, out=OUT)

    # the envelope: the back's alpha box is the envelope box; every other layer by its own alpha box on the same canvas
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("curtain_l", "curtain_left"),
                                   ("curtain_r", "curtain_right"), ("valance", "valance"), ("ticket", "ticket"),
                                   ("rope", "rope"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    front = place(boxes["front"], bx)
    stage = {
        "aspect": round(bw / bh, 4),
        "back": [0, 0, 100, 100],
        "front": [0, front[1], 100, r2(100 - front[1])],
        "curtain_l": place(boxes["curtain_l"], bx),
        "curtain_r": place(boxes["curtain_r"], bx),
        "valance": place(boxes["valance"], bx),
    }
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    stage["lights"] = footlights(layers["front"])
    # the ticket, cut at its measured perforation
    tk = layers.pop("ticket")
    tx = boxes["ticket"]
    cut = perforation(tk)
    layers["ticket_body"], layers["ticket_stub"] = tk.crop((0, 0, cut, tk.height)), tk.crop((cut, 0, tk.width, tk.height))
    stage["ticket_body"] = place((tx[0], tx[1], tx[0] + cut, tx[3]), bx)
    stage["ticket_stub"] = place((tx[0] + cut, tx[1], tx[2], tx[3]), bx)
    stage["perforation_canvas_pct"] = r2(100 * (tx[0] + cut) / raw["ticket"].width)
    # the cord, cut at its knot (the middle of its box)
    rp = layers.pop("rope")
    rx = boxes["rope"]
    mid = rp.width // 2
    layers["rope_l"], layers["rope_r"] = rp.crop((0, 0, mid, rp.height)), rp.crop((mid, 0, rp.width, rp.height))
    stage["rope_l"] = place((rx[0], rx[1], rx[0] + mid, rx[3]), bx)
    stage["rope_r"] = place((rx[0] + mid, rx[1], rx[2], rx[3]), bx)
    card = trim(part("card_small"))
    stage["card_ratio"] = round(card.width / card.height, 4)
    ch = r2(CARD_W * stage["aspect"] / stage["card_ratio"])
    stage["card"] = [r2(50 - CARD_W / 2), r2(50 - ch / 2), CARD_W, ch]
    cl_in, cr_in = trim(part("curtain_left_in")), trim(part("curtain_right_in"))
    stage["_note"] = ("% of the closed envelope (left, top, width, height): the back's alpha box is the envelope; the "
                      "pocket spans its width down to its bottom edge; curtains, valance, ticket pieces and cord halves "
                      "by their own alpha boxes on the shared canvas; card = the programme card once it has come forward "
                      "(centred, CARD_W % wide); lights = footlight centres, % of the pocket's width")
    tb.webp(layers["back"], "back", [960], 80, manifest, out=OUT)
    tb.webp(layers["front"], "front", [960], 80, manifest, out=OUT)
    tb.webp(layers["valance"], "valance", [960], 82, manifest, out=OUT)
    tb.webp(layers["curtain_l"], "curtain_l", [560], 80, manifest, out=OUT)
    tb.webp(layers["curtain_r"], "curtain_r", [560], 80, manifest, out=OUT)
    tb.webp(cl_in, "curtain_l_in", [480], 78, manifest, out=OUT)
    tb.webp(cr_in, "curtain_r_in", [480], 78, manifest, out=OUT)
    tb.webp(layers["ticket_body"], "ticket_body", [300], 86, manifest, out=OUT)
    tb.webp(layers["ticket_stub"], "ticket_stub", [136], 86, manifest, out=OUT)
    tb.webp(layers["rope_l"], "rope_l", [210], 86, manifest, out=OUT)
    tb.webp(layers["rope_r"], "rope_r", [210], 86, manifest, out=OUT)
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    manifest["stage"] = stage

    # the frames: window = the enclosed hole (+ a technical alpha mask of it for the photo)
    for src, name, width in (("portrait_frame", "proscenium", 720), ("story_frame", "programme", 720),
                             ("venue_frame", "venue", 1100)):
        keyed, win, mask = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no enclosed photo window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]
        mw = min(480, mask.width)
        m = mask.resize((mw, round(mask.height * mw / mask.width)), Image.LANCZOS)
        rgba = Image.new("RGBA", m.size, (255, 255, 255, 0))
        rgba.putalpha(m)
        rgba.save(OUT / f"mask_{name}.png", optimize=True)
        manifest[name]["mask"] = f"mask_{name}.png"

    for src, name, width, q in (("corner_ornament", "corner", 720, 82), ("divider", "divider", 1000, 84),
                                ("opera_glasses", "glasses", 480, 84), ("accent_1", "confetti", 160, 86),
                                ("accent_2", "petal_red", 160, 86), ("accent_3", "petal_ivory", 160, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("portrait", "proscenium"), ("programme", "programme"), ("wide", "venue")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(playbill, (0, 0, playbill.width, playbill.height), w / h, w=640, ton=PH_TONE, karisim=.4,
                           bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("proscenium")},
                               "story_1": {"aspect": aspect("programme")}, "story_2": {"aspect": aspect("programme")},
                               "story_3": {"aspect": aspect("programme")}, "venue": {"aspect": aspect("venue")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    rope_full = trim(part("rope"))
    knot = rope_full.crop((round(rope_full.width * .25), 0, round(rope_full.width * .75), rope_full.height))
    icon, icon_info = tb.ikon(knot)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the gold cord's knot and tassels"}
    if "--still" in sys.argv:
        envelope_still(layers, stage, 600).save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G424 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: stage[k] for k in ("aspect", "front", "curtain_l", "curtain_r", "valance", "ticket_body",
                                            "ticket_stub", "perforation_canvas_pct", "rope_l", "rope_r", "lights",
                                            "card", "card_ratio")}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("proscenium", "programme", "venue")})
    print(f"grand-theatre-premiere: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: "
          f"{manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
