#!/usr/bin/env python3
"""Orient Express Voyage (25) — GPT parts → img/ (docs/11 §5.4; tools/tema_build.py). G163.

The design was built BEFORE its GPT parts exist (docs/24, like 22 Nocturne). Every website layer is ordered in
collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md (PAKET 5 W2). For each piece this script uses the GPT
part when the file is there and otherwise an INTERIM placeholder: a flat tone in the design's palette with a soft light
fall-off (light only, docs/11 §5.7 — no shape, line, texture or ornament is drawn; K21). The placeholders keep the layer
sizes, so the opening and the pages already move the separate pieces in their real order; `manifest.json` "interim"
lists which pieces still wait for GPT. Run again whenever a part arrives:

  python3 platform/themes/orient-express-voyage/build_images.py

Sources (collections/25_Orient_Express_Voyage/assets/gpt/parts/, all PNG):
  bg_station.png          1024×1536 opaque   the station at night, behind the closed wallet (index)
  wallet_closed.png       1024×1536 alpha    the leather ticket wallet, closed, WITHOUT its strap
  wallet_strap.png        1024×1536 alpha    only the strap + brass buckle, same canvas and place as wallet_closed
  wallet_inside_cover.png 1024×1536 alpha    the inside of the front cover (seen after it swings open to the left)
  wallet_inside.png       1024×1536 alpha    the inside right panel (back of the ticket pocket), same place as closed
  wallet_pocket.png       1024×1536 alpha    only the front lip of the ticket pocket, same place as wallet_inside
  ticket.png              1024×1536 alpha    the first-class ticket, portrait window flat #00FF00
  poster_hero.png         1024×1536 opaque   the lithograph travel poster (home hero, og image)
  map.png                 1536×1024 opaque   the antique map without any readable name (route band)
  luggage_tag.png         1024×1536 alpha    the luggage tag with its string (swings)
  station_clock.png       1024×1024 alpha    the brass station clock (countdown)
  carriage_window.png     1024×1536 alpha    the brass carriage window frame, glass flat #00FF00 (story frames)
  carriage_wall.png       1024×1024 opaque   seamless bottle-green carriage panelling (story ground)
  bg_paper.png            1024×1024 opaque   seamless ivory lithograph paper (page ground)
  boarding_pass.png       1024×1536 alpha    the boarding pass the RSVP form sits on (3-slice: top · middle · stub)
  stamp.png               1024×1024 alpha    the boarding stamp pressed on the pass after a reply (+ favicon)
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

COL = ROOT / "collections/25_Orient_Express_Voyage"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

# palette (site.css :root)
GREEN, GREEN_DEEP, GREEN_SOFT = (30, 58, 44), (17, 36, 27), (46, 82, 64)
BRASS, BRASS_LIGHT = (184, 145, 75), (216, 189, 132)
IVORY, PAPER, KRAFT, LEATHER = (243, 235, 217), (236, 225, 200), (196, 160, 112), (92, 58, 36)
INK_STAMP = (122, 40, 48)

# interim geometry (canvas 1024×1536, like the GPT parts): the wallet's box, the strap band, the pocket lip, the ticket
WALLET = (192, 288, 832, 1248)             # x0, y0, x1, y1 — 640 × 960 (2:3)
STRAP = (0.53, 0.63)                       # strap band, fraction of the wallet height
BUCKLE_X = 0.62                            # where the strap is cut in two (fraction of the wallet width)
POCKET_TOP = 0.46                          # top edge of the pocket lip (fraction of the wallet height)
TICKET = (500, 760)                        # ticket box (px) inside the wallet
TICKET_AT = (0.109, 0.08)                  # ticket's left / top in the wallet (fractions)
TICKET_WINDOW = (0.27, 0.07, 0.73, 0.45)   # portrait window on the ticket (x0, y0, x1, y1 fractions): 230 × 289 px, 4:5


# ---------------------------------------------------------------------------------------------------- helpers
def save(im: Image.Image, name: str, widths, q: int, manifest: dict):
    """tb.webp with stable file names: the piece is first brought to the largest width (tb.webp never upscales, so a
    GPT part of another size would otherwise change the names the templates use)."""
    w = max(widths)
    if im.size[0] != w:
        im = im.resize((w, max(1, round(im.size[1] * w / im.size[0]))), Image.LANCZOS)
    tb.webp(im, name, widths, q, manifest, out=OUT)


def part(name: str) -> Image.Image | None:
    p = PARTS / name
    return Image.open(p).convert("RGBA") if p.exists() else None


def light(w: int, h: int, top, bottom, glow=(.5, .32), strength=.10) -> np.ndarray:
    """A flat tone with a soft vertical light fall-off and one soft highlight (light, not a shape)."""
    t = np.linspace(0, 1, h)[:, None, None]
    base = np.array(top, float) * (1 - t) + np.array(bottom, float) * t
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.hypot((xx / w - glow[0]) * 1.2, yy / h - glow[1])
    lift = np.clip(1 - r / .75, 0, 1)[..., None] ** 2 * strength * 255
    return np.clip(base + lift, 0, 255)


def tone(w: int, h: int, top, bottom=None, glow=(.5, .32), strength=.10) -> Image.Image:
    return Image.fromarray(light(w, h, top, bottom or top, glow, strength).astype(np.uint8), "RGB")


def block(w: int, h: int, top, bottom=None, alpha: np.ndarray | None = None, **kw) -> Image.Image:
    """An interim layer: the tone on an alpha mask (default: the whole box)."""
    rgb = light(w, h, top, bottom or top, **kw)
    a = np.full((h, w), 255.0) if alpha is None else alpha
    return Image.fromarray(np.dstack([rgb, a]).astype(np.uint8), "RGBA")


def fit(im: Image.Image, size) -> Image.Image:
    """A GPT part cropped to its alpha box and scaled to `size` (the closed wallet's box): pieces drawn in separate
    images are put on one common box (docs/11 §7.1 alignment; the measured offset is in manifest stage.align)."""
    k = tb.alfa_kutusu(np.asarray(im)[..., 3])
    return im.crop(k).resize(size, Image.LANCZOS)


def green_window(im: Image.Image):
    """#00FF00 window → transparent; returns (image, window box in fractions)."""
    a = np.asarray(im).copy()
    r, g, b = (a[..., i].astype(int) for i in range(3))
    win = (g > 200) & (r < 90) & (b < 90) & (a[..., 3] > 128)
    if win.sum() < 100:
        return im, None
    ys, xs = np.nonzero(win)
    soft = np.asarray(Image.fromarray((win * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    a[soft, 3] = 0
    h, w = win.shape
    return Image.fromarray(a, "RGBA"), [round(xs.min() / w, 4), round(ys.min() / h, 4), round((xs.max() + 1) / w, 4),
                                        round((ys.max() + 1) / h, 4)]


def buckle_cut(strap: Image.Image) -> float:
    """The strap is cut just left of its brass buckle (warm, bright pixels); fallback BUCKLE_X."""
    a = np.asarray(strap).astype(int)
    brass = (a[..., 0] > 150) & (a[..., 0] - a[..., 2] > 50) & (a[..., 3] > 128)
    cols = np.flatnonzero(brass.sum(0) > 3)
    if len(cols) < 6:
        return BUCKLE_X
    return max(.3, min(.85, (cols.min() - 4) / a.shape[1]))


# ---------------------------------------------------------------------------------------------------- build
def main() -> int:
    manifest: dict = {"_note": "G163 build. Pieces listed under 'interim' are flat palette tones with a soft light "
                      "fall-off (no drawn shape) until their GPT part (GPT_PROMPTS.md PAKET 5 W2) arrives."}
    interim: list[str] = []
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    def use(name: str):
        im = part(name)
        if im is None:
            interim.append(name)
        return im

    # -------------------------------------------------------------- station backdrop (index)
    bg = use("bg_station.png")
    bg = bg.convert("RGB") if bg else tone(1024, 1536, (24, 46, 35), (10, 22, 16), glow=(.5, .55), strength=.16)
    save(bg, "station_bg", [640, 1024], 74, manifest)

    # -------------------------------------------------------------- the ticket wallet (docs/11 §7, own type "cuzdan")
    W, H = WALLET[2] - WALLET[0], WALLET[3] - WALLET[1]
    closed = use("wallet_closed.png")
    if closed:
        k = tb.alfa_kutusu(np.asarray(closed)[..., 3])
        cover = closed.crop(k).resize((W, H), Image.LANCZOS)
    else:
        cover = block(W, H, (40, 76, 57), GREEN, glow=(.35, .25), strength=.12)
    save(cover, "wallet_cover", [440, 640], 80, manifest)

    cin = use("wallet_inside_cover.png")
    cin = fit(cin, (W, H)) if cin else block(W, H, (30, 58, 44), GREEN_DEEP, glow=(.65, .3), strength=.08)
    save(cin, "wallet_cover_in", [440, 640], 78, manifest)

    inside = use("wallet_inside.png")
    inside = fit(inside, (W, H)) if inside else block(W, H, GREEN_DEEP, (12, 26, 19), glow=(.4, .2), strength=.06)
    save(inside, "wallet_inside", [440, 640], 78, manifest)

    pocket = use("wallet_pocket.png")
    if pocket:
        ref = part("wallet_inside.png")          # same canvas as the inside panel: cut with the panel's box
        pocket = pocket.crop(tb.alfa_kutusu(np.asarray(ref)[..., 3])).resize((W, H), Image.LANCZOS) if ref else fit(pocket, (W, H))
        a = np.asarray(pocket)[..., 3]
        rows = np.flatnonzero(a.max(1) > 128)
        pocket_top = round(rows.min() / H, 4) if len(rows) else POCKET_TOP
    else:
        al = np.zeros((H, W))
        al[int(H * POCKET_TOP):] = 255
        pocket = block(W, H, (36, 68, 51), GREEN, alpha=al, glow=(.4, .55), strength=.10)
        pocket_top = POCKET_TOP
    save(pocket, "wallet_pocket", [440, 640], 80, manifest)

    strap = use("wallet_strap.png")
    if strap:
        k = tb.alfa_kutusu(np.asarray(strap)[..., 3])
        strap_box = [round((k[0] - WALLET[0]) / W * 100, 3), round((k[1] - WALLET[1]) / H * 100, 3),
                     round((k[2] - k[0]) / W * 100, 3), round((k[3] - k[1]) / H * 100, 3)]
        strap = strap.crop(k)
        cut = buckle_cut(strap)
    else:
        sh = int(H * (STRAP[1] - STRAP[0]))
        strap = block(W, sh, (110, 72, 46), LEATHER, glow=(.5, .2), strength=.08)
        strap_box = [0, STRAP[0] * 100, 100, round(sh / H * 100, 3)]
        cut = BUCKLE_X
    sw, shh = strap.size
    xcut = int(round(sw * cut))
    save(strap.crop((0, 0, xcut, shh)), "strap_l", [240, 480], 80, manifest)
    save(strap.crop((xcut, 0, sw, shh)), "strap_r", [160, 320], 80, manifest)

    ticket = use("ticket.png")
    if ticket:
        ticket = ticket.crop(tb.alfa_kutusu(np.asarray(ticket)[..., 3])).resize(TICKET, Image.LANCZOS)
        ticket, window = green_window(ticket)
        window = window or list(TICKET_WINDOW)
    else:
        tw, th = TICKET
        al = np.full((th, tw), 255.0)
        x0, y0, x1, y1 = (int(TICKET_WINDOW[0] * tw), int(TICKET_WINDOW[1] * th), int(TICKET_WINDOW[2] * tw),
                          int(TICKET_WINDOW[3] * th))
        al[y0:y1, x0:x1] = 0                      # the window: the portrait shows through (photo slot under the card)
        ticket = block(tw, th, (248, 242, 228), IVORY, alpha=al, glow=(.5, .7), strength=.04)
        window = list(TICKET_WINDOW)
    save(ticket, "ticket", [480, 640], 82, manifest)

    pct = lambda v: round(v * 100, 3)               # noqa: E731
    manifest["stage"] = {
        "canvas": [1024, 1536], "box": [WALLET[0], WALLET[1], W, H], "objAspect": round(W / H, 4),
        "strap": {"box_pct": strap_box, "buckle_cut": round(cut, 4)},
        "pocket": {"top_pct": pct(pocket_top)},
        "ticket": {"box_pct": [pct(TICKET_AT[0]), pct(TICKET_AT[1]), pct(TICKET[0] / W), pct(TICKET[1] / H)],
                   "window_pct": [pct(window[0]), pct(window[1]), pct(window[2] - window[0]), pct(window[3] - window[1])]},
        "open": "the cover turns on its left hinge to -180° (rotateY; its inside is wallet_cover_in, backface hidden); "
                "the spread is two wallets wide: site.js scales the stage to 94% of the screen (--open-scale)",
    }

    # -------------------------------------------------------------- pages
    poster = use("poster_hero.png")
    poster = poster.convert("RGB") if poster else tone(1024, 1536, (233, 214, 170), (34, 66, 50), glow=(.5, .18), strength=.14)
    save(poster, "poster", [640, 1024], 76, manifest)

    mp = use("map.png")
    mp = mp.convert("RGB") if mp else tone(1536, 1024, (236, 224, 194), (214, 196, 156), glow=(.45, .4), strength=.06)
    save(mp, "map", [640, 1024, 1536], 76, manifest)

    tag = use("luggage_tag.png")
    if tag:
        tag = tag.crop(tb.alfa_kutusu(np.asarray(tag)[..., 3]))
    else:
        tag = block(300, 560, (214, 182, 134), KRAFT, glow=(.4, .3), strength=.06)
    save(tag, "tag", [240, 360], 80, manifest)

    clock = use("station_clock.png")
    clock = clock.crop(tb.alfa_kutusu(np.asarray(clock)[..., 3])) if clock else \
        block(560, 560, (226, 210, 172), (200, 178, 128), glow=(.45, .35), strength=.08)
    save(clock, "clock", [240, 480], 80, manifest)

    frame = use("carriage_window.png")
    if frame:
        frame = frame.crop(tb.alfa_kutusu(np.asarray(frame)[..., 3]))
        frame, glass = green_window(frame)
    else:
        frame = Image.new("RGBA", (600, 800), (0, 0, 0, 0))    # interim: no frame (the photo stands alone)
        glass = [0, 0, 1, 1]
    save(frame, "window_frame", [480, 640], 82, manifest)
    manifest["window"] = {"glass_pct": [pct(glass[0]), pct(glass[1]), pct(glass[2] - glass[0]), pct(glass[3] - glass[1])],
                          "aspect": round(frame.size[0] / frame.size[1], 4)}

    wall = use("carriage_wall.png")
    wall = wall.convert("RGB") if wall else tone(640, 640, GREEN, GREEN, strength=0)
    save(wall.resize((640, 640), Image.LANCZOS), "wall", [640], 74, manifest)

    paper = use("bg_paper.png")
    paper = paper.convert("RGB") if paper else tone(640, 640, IVORY, IVORY, strength=0)
    save(paper.resize((640, 640), Image.LANCZOS), "paper", [640], 74, manifest)

    bp = use("boarding_pass.png")
    if bp:
        bp = bp.crop(tb.alfa_kutusu(np.asarray(bp)[..., 3]))
    else:
        bp = block(1000, 1500, (248, 243, 230), IVORY, glow=(.5, .1), strength=.03)
    bw, bh = bp.size
    top, bot = int(bh * .16), int(bh * .82)                  # 3-slice: header · plain middle · stub (docs/11 §9)
    save(bp.crop((0, 0, bw, top)), "pass_top", [640, 960], 80, manifest)
    save(bp.crop((0, int(bh * .45), bw, int(bh * .55))), "pass_mid", [640, 960], 80, manifest)
    save(bp.crop((0, bot, bw, bh)), "pass_stub", [640, 960], 80, manifest)

    stamp = use("stamp.png")
    if stamp:
        stamp = stamp.crop(tb.alfa_kutusu(np.asarray(stamp)[..., 3]))
    else:
        stamp = block(520, 520, INK_STAMP, (98, 30, 38), glow=(.5, .5), strength=.05)
    save(stamp, "stamp", [240, 480], 82, manifest)

    # photo placeholders: the poster's sky, softened and toned to the page (no person, no text)
    sky = (0, 0, 1024, 900)
    slots = {}
    for key, shape, ratio in (("hero_portrait", "portrait", 4 / 5), ("story", "window", 3 / 4), ("venue", "wide", 3 / 2)):
        ph = tb.yer_tutucu(poster, sky, ratio, w=640, ton=IVORY, karisim=.35, bulanik=10)
        save(ph, f"ph_{shape}", [640], 76, manifest)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots

    og, og_info = tb.og_kirp(poster, hiza="orta")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(stamp)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # -------------------------------------------------------------- checks + manifest
    manifest["interim"] = interim
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(manifest["stage"], indent=1))
    print(f"interim (waiting for GPT): {len(interim)} — {', '.join(interim) or 'none'}")
    print(f"orient-express-voyage: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
