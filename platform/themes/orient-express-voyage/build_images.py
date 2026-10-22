#!/usr/bin/env python3
"""Orient Express Voyage (25) — GPT sources → img/ (docs/11 §5.4, docs/34, docs/35; tools/tema_build.py). Task G425.

Redesign of 2026-10-22 (docs/35 row 25): every picture is the design's own PAKET 5R part
(collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md), cut, keyed, scaled — nothing is drawn (K21, docs/11 §5.7):

  page_ground (W1)    ground-640/1024        warm ivory antique map paper: the page ground of every page
  ticket_paper (W2)   ticket-640/1024        ivory ticket card stock: bands, the itinerary card, the reply form
  env_back (W3)       back-960               the ticket sleeve's back, its route-red moiré silk lining (the envelope box)
  env_front (W4)      front-960              the bottle-green embossed leather front panel with its thumb notch
                      leather-640            a calm patch of the same leather (inside the gold tooling), its lamplight
                                             gradient levelled and mirrored into a seamless tile: the dark bands
  flap (W5)           flap-256               the end-tab flap at the right end (closed; hinged on its right edge)
  flap_in (W6)        flap_in-256            the tab's inside (route-red silk, a brass washer) once it has swung open
  lock_plate (W7)     plate-112              the brass turn-lock plate on the tab's tip
  lock_key (W8)       key-160                the turn button (it turns 90° about its centre rivet)
  luggage_tag (W9)    tag-160                the blank luggage tag on its red cord from a brass grommet (pendulum)
  card_small (W10)    card-720               the blank first-class ticket card that slides out of the sleeve
  portrait_frame (W11) carriage-720          the mahogany and brass carriage window (portrait; window measured)
  story_frame (W12)   sash-720               the sliding sash window with its rolled leather blind (story; window measured)
  venue_frame (W13)   panorama-1100          the wide observation-carriage window (venue; window measured)
  corner_spray (W14)  spray-720              a brass rack corner with dried roses and a route-red ribbon
  divider (W15)       rail-1000              the brass luggage-rack rail (section dividers)
  pocket_watch (W16)  watch-480              the numeral-free brass pocket watch (beside the countdown)
  route_map (W17)     map-1200               the letterless antique map panel (the journey, the itinerary)
  accent_1..3 (W18)   steam/disc/bud-200     steam, a punched ticket disc, a dried rose bud (opening, reply)
  web_hero (W19)      og-1200x630.jpg        share image (tema_build.og_kirp, bottom-aligned)

The sleeve layers (W3, W4, W5, W7, W8, W9) share one canvas and GPT kept them aligned on it (checked on a composite);
each is cut to its own alpha box and placed by that box in the envelope box (the back's alpha box) — manifest `stage`,
the numbers site.css uses (tests/theme-orient-express-voyage.test.ts compares them). The back reaches ~6 % below the front
panel (its leather rim shows under the front, like the back of a document case). The tag's pendulum pivot is its brass
grommet (measured: the ring's rows at the top of the part). The card (its own canvas) lies sideways in the sleeve: its
long side = CARD_LEN % of the sleeve width, its right end just inside the mouth; CSS sizes the card box at its final
upright size and scales it down (card_k0) while it is in the sleeve, so it is crisp when it comes forward.
Photo windows: GPT left the window's middle transparent inside a green rim; the window = the green pixels plus the
transparent hole they enclose, cleared whole, the green spill round it neutralised. The windows are rounded rectangles,
so each frame also gets a technical alpha mask of its measured window (mask_*.png, white + alpha) for CSS mask-image.

  python3 platform/themes/orient-express-voyage/build_images.py [--still out.png]
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

COL = ROOT / "collections/25_Orient_Express_Voyage"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

PH_TONE = (236, 226, 204)        # placeholder tone (warm ivory)
REQUIRED = ["page_ground", "ticket_paper", "env_back", "env_front", "flap", "flap_in", "lock_plate", "lock_key",
            "luggage_tag", "card_small", "portrait_frame", "story_frame", "venue_frame", "corner_spray", "divider",
            "pocket_watch", "route_map", "accent_1", "accent_2", "accent_3", "web_hero"]
CARD_LEN = 44.0                  # the card's long side, lying in the sleeve, in % of the sleeve width
CARD_END = 97.0                  # its right end (just inside the mouth), % of the sleeve width
CARD_FINAL = 72.0                # the card's upright width when it has come forward, % of the sleeve width


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


def _fill_holes(m: np.ndarray) -> np.ndarray:
    """m plus every pixel not reachable from the border without crossing m (scipy's binary_fill_holes)."""
    h, w = m.shape
    pad = np.zeros((h + 2, w + 2), np.uint8)
    pad[1:-1, 1:-1] = m.astype(np.uint8) * 255
    im = Image.fromarray(pad, "L").copy()
    ImageDraw.floodfill(im, (0, 0), 128)
    return (np.asarray(im)[1:-1, 1:-1] != 128)


def keyed_window(im: Image.Image):
    """The photo window of a framed part: GPT's green is a closed rim round an already transparent (or blurred) middle,
    so the window = the green rim with everything it encloses, grown 2 px and cleared; the green spill in a 12 px ring
    round it is neutralised. (RGBA, window box (L, T, W, H) % of the image, window mask cropped to its box) or
    (im, None, None)."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 120) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 60) & (c[..., 3] > 40)
    if green.sum() < 256:
        return im, None, None
    win = _grow(_fill_holes(_grow(green, 1)), 2)
    ys, xs = np.nonzero(win)
    h, w = c.shape[:2]
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    c[win, 3] = 0
    ring = _grow(win, 12) & ~win
    rgb = c[..., :3].astype(np.int16)
    spill = ring & (rgb[..., 1] > np.maximum(rgb[..., 0], rgb[..., 2]) + 6)
    c[..., 1] = np.where(spill, ((rgb[..., 0] + rgb[..., 2]) // 2).clip(0, 255), c[..., 1]).astype(np.uint8)
    return (Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h),
            win[y0:y1, x0:x1])


def window_mask(win: np.ndarray, name: str, width: int = 240) -> dict:
    """A technical alpha mask of the measured window (white, alpha = the window, 1 px soft edge) for CSS mask-image —
    never shown, it only clips the photo to the frame's own rounded window."""
    h, w = win.shape
    a = Image.fromarray(win.astype(np.uint8) * 255, "L").filter(ImageFilter.GaussianBlur(1))
    hh = round(h * width / w)
    a = a.resize((width, hh), Image.LANCZOS)
    im = Image.new("RGBA", (width, hh), (255, 255, 255, 0))
    im.putalpha(a)
    p = OUT / f"mask_{name}.png"
    im.save(p, optimize=True)
    return {"file": p.name, "size": [width, hh], "bytes": p.stat().st_size}


def place(inner, outer):
    """The box `inner` (x0, y0, x1, y1 px) in % of the box `outer`: [left, top, width, height]."""
    ox0, oy0, ox1, oy1 = outer
    ow, oh = ox1 - ox0, oy1 - oy0
    x0, y0, x1, y1 = inner
    return [r2(100 * (x0 - ox0) / ow), r2(100 * (y0 - oy0) / oh), r2(100 * (x1 - x0) / ow), r2(100 * (y1 - y0) / oh)]


def grommet(tag: Image.Image) -> list:
    """The tag's pendulum pivot: the centre of the brass grommet ring at the top of the cut part (% of the part): the
    ring rows are wider than the cord hanging under it."""
    a = np.asarray(tag)[..., 3] > 40
    rows = a.sum(1)
    top = int(np.nonzero(rows)[0][0])
    cord = float(np.median(rows[top + 60:top + 110]))
    y = top + 4
    while y < len(rows) and rows[y] > cord * 1.5:
        y += 1
    xs = np.nonzero(a[top:y].any(0))[0]
    return [r2(100 * (xs.min() + xs.max() + 1) / 2 / tag.width), r2(100 * (top + y) / 2 / tag.height)]


def leather_tile(front: Image.Image) -> Image.Image:
    """A calm patch of the front panel's leather (inside its gold tooling), the lamplight gradient levelled (divided by
    a wide blur of itself, the mean colour kept) and mirrored 2×2 so it tiles without a seam."""
    patch = front.convert("RGB").crop((200, 150, 1090, 550))
    a = np.asarray(patch).astype(np.float32)
    blur = np.asarray(patch.filter(ImageFilter.GaussianBlur(70))).astype(np.float32)
    mean = a.reshape(-1, 3).mean(0)
    lev = (a * (mean / np.maximum(blur, 1))).clip(0, 255).astype(np.uint8)
    p = Image.fromarray(lev, "RGB")
    w, h = p.size
    tile = Image.new("RGB", (2 * w, 2 * h))
    tile.paste(p, (0, 0))
    tile.paste(p.transpose(Image.FLIP_LEFT_RIGHT), (w, 0))
    tile.paste(p.transpose(Image.FLIP_TOP_BOTTOM), (0, h))
    tile.paste(p.transpose(Image.ROTATE_180), (w, h))
    return tile


def calm_green(im: Image.Image, tint: int = 34) -> Image.Image:
    """The bottle-green leather has a few saturated edge pixels that the chroma-key residue check (tb.yesil_gorunur)
    takes for #00FF00: the green channel is capped at max(R, B) + `tint` there (a handful of pixels, invisible)."""
    a = np.asarray(im.convert("RGBA")).copy()
    rgb = a[..., :3].astype(np.int16)
    cap = np.maximum(rgb[..., 0], rgb[..., 2]) + tint
    a[..., 1] = np.minimum(rgb[..., 1], cap).clip(0, 255).astype(np.uint8)
    return Image.fromarray(a, "RGBA")


def sleeve_still(layers: dict, stage: dict, w: int) -> Image.Image:
    """The closed sleeve as the index page shows it — a composition check."""
    h = round(w / stage["aspect"])
    pad = round(w * .1)
    canvas = Image.new("RGBA", (w + 2 * pad, round(h * 1.6) + 2 * pad), (120, 120, 120, 255))
    for key in ("back", "front", "tag", "flap", "plate", "key"):
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

    ground = Image.open(PARTS / "page_ground.png").convert("RGB")
    ticket = Image.open(PARTS / "ticket_paper.png").convert("RGB")
    tb.webp(ground, "ground", [640, 1024], 70, manifest, out=OUT)
    tb.webp(ticket, "ticket", [640, 1024], 72, manifest, out=OUT)

    # the sleeve: the back's alpha box is the envelope box; every other layer by its own box on the shared canvas
    raw = {k: part(n) for k, n in (("back", "env_back"), ("front", "env_front"), ("flap", "flap"),
                                   ("plate", "lock_plate"), ("key", "lock_key"), ("tag", "luggage_tag"))}
    boxes = {k: box(v) for k, v in raw.items()}
    bx = boxes["back"]
    bw, bh = bx[2] - bx[0], bx[3] - bx[1]
    stage = {"aspect": round(bw / bh, 4), "back": [0, 0, 100, 100]}
    for k in ("front", "flap", "plate", "key", "tag"):
        stage[k] = place(boxes[k], bx)
    layers = {k: raw[k].crop(boxes[k]) for k in raw}
    for k in ("back", "front", "flap"):
        layers[k] = calm_green(layers[k])
    stage["tag_pivot"] = grommet(layers["tag"])
    # the lock rides on the tab: plate and turn button in % of the tab's box (they swing open with it)
    fl, ft, fw_, fh = stage["flap"]
    for k in ("plate", "key"):
        L, T, W, H = stage[k]
        stage[f"{k}_in_flap"] = [r2(100 * (L - fl) / fw_), r2(100 * (T - ft) / fh), r2(100 * W / fw_), r2(100 * H / fh)]
    tb.webp(leather_tile(raw["front"]), "leather", [640], 70, manifest, out=OUT)
    for k, wd, q in (("back", 960, 80), ("front", 960, 80), ("flap", 256, 84), ("plate", 112, 88), ("key", 160, 88),
                     ("tag", 160, 86)):
        tb.webp(layers[k], k, [wd], q, manifest, out=OUT)
    flap_in = trim(part("flap_in"))
    tb.webp(flap_in, "flap_in", [256], 84, manifest, out=OUT)
    stage["flap_in_ratio"] = round(flap_in.width / flap_in.height, 4)
    card = trim(part("card_small"))
    tb.webp(card, "card", [720], 80, manifest, out=OUT)
    ratio = card.width / card.height
    stage["card_ratio"] = round(ratio, 4)
    # the card box at its final upright size, centred where the card lies sideways in the sleeve (vertically on the
    # front panel's middle); card_k0 = its scale in the sleeve (its long side = CARD_LEN % of the sleeve width)
    fw = CARD_FINAL
    fh_h = fw / ratio * stage["aspect"]                      # its height in % of the envelope height
    cx = CARD_END - CARD_LEN / 2
    cy = stage["front"][1] + stage["front"][3] / 2
    stage["card"] = [r2(cx - fw / 2), r2(cy - fh_h / 2), r2(fw), r2(fh_h)]
    stage["card_k0"] = round(CARD_LEN * ratio / fw, 4)
    stage["_note"] = ("% of the envelope (left, top, width, height): the back's alpha box is the envelope; front, flap, "
                      "plate, key and tag by their own alpha boxes on the shared canvas; tag_pivot = the grommet, % of "
                      "the tag; card = its final upright box centred on its place in the sleeve, scaled by card_k0 and "
                      "turned -90° while it lies there")
    manifest["stage"] = stage

    # the frames: window measured (green rim + the transparent hole it encloses) + a mask of the rounded window
    for src, name, width in (("portrait_frame", "carriage", 720), ("story_frame", "sash", 720),
                             ("venue_frame", "panorama", 1100)):
        keyed, win, wmask = keyed_window(trim(part(src)))
        if win is None:
            print(f"ERROR {src}.png: no #00FF00 window found", file=sys.stderr)
            return 1
        tb.webp(keyed, name, [width], 84, manifest, out=OUT)
        manifest[name]["window_pct"] = [r2(v) for v in win]
        manifest[name]["window_px"] = [round(keyed.width * win[2] / 100), round(keyed.height * win[3] / 100)]
        manifest[name]["mask"] = window_mask(wmask, name)

    for src, name, width, q in (("corner_spray", "spray", 720, 82), ("divider", "rail", 1000, 84),
                                ("pocket_watch", "watch", 480, 84), ("accent_1", "steam", 200, 84),
                                ("accent_2", "disc", 200, 86), ("accent_3", "bud", 200, 86)):
        tb.webp(trim(part(src)), name, [width], q, manifest, out=OUT)
    tb.webp(Image.open(PARTS / "route_map.png").convert("RGB"), "map", [1200], 70, manifest, out=OUT)

    def aspect(name):
        w, h = manifest[name]["window_px"]
        return f"{w}/{h}"
    slots = {}
    for shape, name in (("portrait", "carriage"), ("sash", "sash"), ("wide", "panorama")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(ground, (0, 0, ground.width, ground.height), w / h, w=640, ton=PH_TONE, karisim=.4, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": aspect("carriage")}, "story_1": {"aspect": aspect("sash")},
                               "story_2": {"aspect": aspect("sash")}, "story_3": {"aspect": aspect("sash")},
                               "venue": {"aspect": aspect("panorama")}}

    og, og_info = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                      "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(layers["tag"])
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the blank luggage tag"}
    if "--still" in sys.argv:
        sleeve_still(layers, stage, 900).save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "G425 build from the design's own PAKET 5R parts (all present; docs/35). Nothing drawn."
    manifest["checks"] = {"green": tb.yesil_denetle(OUT)}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps({k: v for k, v in stage.items() if k != "_note"}))
    print({n: (manifest[n]["window_pct"], manifest[n]["src_size"]) for n in ("carriage", "sash", "panorama")})
    print(f"orient-express-voyage: theme folder {manifest['bytes_total'] / 1e6:.2f} MB, green residue: {manifest['checks']['green']}")
    if manifest["checks"]["green"]:
        print("ERROR: green residue in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
