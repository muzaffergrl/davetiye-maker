#!/usr/bin/env python3
"""Nocturne Lake Estate (22) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). v2 of 2026-10-24.

v2 follows the GPT design board (assets/gpt/mockups/design-board.png, PAKET 8 "The moon is missing") and is built only
from its PAKET 8 parts (collections/22_Nocturne_Lake_Estate/assets/gpt/parts/) — cut, aligned, scaled; nothing is drawn
(K21, docs/11 §5.7):

  moon_envelope_closed  env_flap-720/938    the closed envelope's mountain-cut flap (tema_build.kapak_kes "egri": cut at the
                                            first contact-shade row under its gold hairline, so the hairline stays on it)
  moon_envelope_open    env_pocket-720/938  the front pocket with its gold "moonlight" hairlines (the closed flap lies on it)
                        env_back-720/938    the open envelope's back and moiré lining, aligned onto the closed body
                        env_flap_in-720     the open flap's moiré inner face (it stands above the envelope once open)
  moon_seal             seal-200/400        the champagne-gold "moon" seal in the flap's valley (initials = live text)
  moon                  moon-320/640        the full moon (home sky; the seal rises into it on the opening)
  card_invite           card-720/1100       the ivory card with the arch window (photo under it, mask_card.png = its hole)
  night_lake(_wide)     lake-720/1024, lake_wide-1536, lake_blur-480   the night lake without a moon (index, home, RSVP)
                        water-720           the lower water of the wide lake (story: the photographs' reflections float on it)
  paper_tile            paper-512           black cotton paper, made seamless (half-offset cross-fade of its own pixels)
  balustrade            balustrade-800/1400 the moonlit limestone balustrade (home hero foreground, RSVP foot)
  frame_arch            frame_arch-480/720  + mask_arch.png (the measured hole) — the home portrait
  frame_landscape       frame_land-720/1100 — story photographs, the venue
  card_gilt             gilt_top/mid/bot-720  the gilt-edged black card in three slices (the middle one repeats)
  divider_moonpath      divider-720/1100    rules under headings; thread-720 = its broken end, turned upright (timeline)
  icon_*                icon-<key>-128      programme icons (low-alpha colour fringe cleared)
  gold_leaf_1..3        leaf1/2/3-160       drifting gold leaf (accents)
  og-1200x630.jpg       night_lake_wide + the closed envelope + the seal (composited, no text); favicon = the seal

The open envelope came out ~6 % taller than the closed one (hinge row 665 vs the closed top edge 696; bottom 1286 vs
1280; sides ±2 px): it is scaled onto the closed body (hinge → top edge, bottom → bottom, sides → sides) before cutting,
so back, pocket and both flap faces line up. manifest `stage` = the numbers site.css uses (% of the closed body box).

  python3 platform/themes/nocturne-lake-estate/build_images.py [--still out.png]
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

COL = ROOT / "collections/22_Nocturne_Lake_Estate"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

ICONS = {"rings": "icon_ceremony", "toast": "icon_toast", "dinner": "icon_dinner", "dance": "icon_dancing",
         "dress": "icon_dresscode", "boat": "icon_boat"}
REQUIRED = ["moon_envelope_closed", "moon_envelope_open", "moon_seal", "moon", "card_invite", "night_lake",
            "night_lake_wide", "paper_tile", "balustrade", "frame_arch", "frame_landscape", "card_gilt",
            "divider_moonpath", "gold_leaf_1", "gold_leaf_2", "gold_leaf_3", *ICONS.values()]
SEAL_W = 19.0        # % of the envelope width (design board: the seal in the valley ≈ 19 %)
CARD_W = 92.0        # % of the envelope width: the card in the pocket
CARD_TOP = 9.5       # % of the envelope height: the card's top edge inside the pocket (just under the pocket's edge)
PH_TONE = (40, 44, 52)


def part(ad: str) -> Image.Image:
    return Image.open(PARTS / f"{ad}.png").convert("RGBA")


def abox(im, esik: int = 128):
    return tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)


def trim(im: Image.Image, esik: int = 24) -> Image.Image:
    k = abox(im, esik)
    return im.crop(k) if k else im


def r2(v) -> float:
    return round(float(v), 2)


def clean_fringe(im: Image.Image, cut: int = 14) -> Image.Image:
    """GPT's foil parts carry 1–7/255 alpha specks and red/yellow colour fringes round the stroke: clear alpha < `cut`
    and give the faint edge pixels the median colour of the opaque ones (no new pixels, only the fringe neutralised)."""
    a = np.asarray(im.convert("RGBA")).copy()
    al = a[..., 3]
    solid = al > 200
    if solid.any():
        med = np.median(a[solid][:, :3], axis=0).astype(np.uint8)
        weak = (al > 0) & (al < 110)
        a[weak, :3] = med
    a[al < cut] = 0
    return Image.fromarray(a, "RGBA")


def holes(im: Image.Image, esik: int = 128) -> np.ndarray:
    """The biggest transparent region not reachable from the border = the window the frame encloses (the moulding's
    own see-through specks are smaller enclosed regions and are left out)."""
    from scipy import ndimage
    clear = np.asarray(im)[..., 3] < esik
    lab, n = ndimage.label(clear)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    sizes = ndimage.sum(clear, lab, range(1, n + 1))
    best = max((i for i in range(1, n + 1) if i not in edge), key=lambda i: sizes[i - 1], default=None)
    return lab == best if best else np.zeros_like(clear)


def window(im: Image.Image, mask_name: str | None = None, mask_w: int = 320):
    """The largest enclosed hole of a frame/card: its box in % of the image, its px size and (optionally) its shape saved
    as a technical alpha mask for CSS mask-image (the measured pixels, not a drawing)."""
    m = holes(im)
    lab = Image.fromarray(m.astype(np.uint8) * 255, "L")
    ys, xs = np.nonzero(m)
    if not len(xs):
        raise SystemExit(f"no window in {mask_name}")
    # keep the biggest region: the hole is one blob (GPT closed the ring), stray specks are tiny
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    w, h = im.size
    info = {"window_pct": [r2(100 * x0 / w), r2(100 * y0 / h), r2(100 * (x1 - x0) / w), r2(100 * (y1 - y0) / h)],
            "window_px": [int(x1 - x0), int(y1 - y0)]}
    if mask_name:
        mk = lab.crop((x0, y0, x1, y1)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1))
        mk = mk.resize((mask_w, round(mask_w * mk.height / mk.width)), Image.LANCZOS)
        rgba = Image.new("RGBA", mk.size, (0, 0, 0, 0))
        rgba.putalpha(mk)
        rgba.save(OUT / mask_name, optimize=True)
        info["mask"] = mask_name
    return info


def seamless(im: Image.Image) -> Image.Image:
    """Tileable: cross-fade the texture with its own half-offset copy (weight 1 at the centre, 0 at the edges of the
    copy), so the edges become the original's continuous middle."""
    a = np.asarray(im.convert("RGB")).astype(np.float64)
    h, w = a.shape[:2]
    b = np.roll(np.roll(a, h // 2, 0), w // 2, 1)
    wy = 1 - np.abs(np.linspace(-1, 1, h))[:, None]
    wx = 1 - np.abs(np.linspace(-1, 1, w))[None, :]
    k = (np.minimum(wy, wx) * 2).clip(0, 1)[..., None]
    return Image.fromarray((a * k + b * (1 - k)).round().clip(0, 255).astype(np.uint8), "RGB")


def envelope():
    """Closed + open envelope → aligned layers in the closed body box, and the stage numbers."""
    ec, eo = part("moon_envelope_closed"), part("moon_envelope_open")
    W, H = ec.size
    x0, y0, x1, y1 = abox(ec, 200)
    bw, bh = x1 - x0, y1 - y0
    # the open envelope: its hinge = the bright fold line + the dark crease (median luminance over the body's middle)
    oa = np.asarray(eo).astype(np.float64)
    lum = oa[..., :3] @ tb.LUM
    ox0, _, ox1, oy1 = abox(eo, 200)
    cols = np.arange(ox0 + 100, ox1 - 100, 3)
    med = np.median(lum[:, cols], axis=1)
    # the pocket paper: the first run of 6 dark rows below the flap's widest rows; above it the lining band, whose top
    # is the fold (bright line) + the dark crease
    full = np.flatnonzero((oa[..., 3] > 200).sum(1) > .97 * (ox1 - ox0))
    ys = np.arange(full[0], oy1)
    dark = np.array([med[y:y + 6].max() < 90 for y in ys])
    pocket_o = int(ys[np.argmax(dark)])
    band = np.arange(pocket_o - int(.16 * bh), pocket_o - 12)
    crease = int(band[np.argmin(med[band])])           # the dark crease under the fold
    hinge = crease - 1
    hair = pocket_o - 4                                 # the pocket's gold hairline stays on the pocket
    sx, sy = bw / (ox1 - ox0), bh / (oy1 - hinge)
    big = eo.resize((round(W * sx), round(H * sy)), Image.LANCZOS)
    dx, dy = round(x0 - ox0 * sx), round(y0 - hinge * sy)
    al = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    al.alpha_composite(big.crop((max(0, -dx), max(0, -dy), max(0, -dx) + W, max(0, -dy) + H)), (max(0, dx), max(0, dy)))
    pocket_top = round(y0 + (hair - hinge) * sy)
    # the flap of the closed envelope (kapak_kes "egri"; tip = the valley's lowest point = the seal's anchor)
    flap, info = tb.kapak_kes(ec, "egri")
    fa = np.asarray(flap)
    edge = np.zeros(W)
    for x in range(W):
        col = np.nonzero(fa[:, x, 3] > 128)[0]
        edge[x] = col.max() + 1 if len(col) else y0
    # pocket = the open envelope's front panel below its gilded top edge, in every state: the closed flap lies on it, so
    # its gold "moonlight" hairlines never change when the flap lifts (the closed envelope's own pocket pixels differ
    # in tone and pattern and showed a seam once open)
    pk = np.asarray(al).copy()
    pk[:pocket_top] = 0
    pocket = Image.fromarray(pk, "RGBA")
    crop = (x0, y0, x1, y1)
    flap_bottom = int(np.ceil(edge[x0:x1].max())) + 2
    layers = {
        "back": al.crop(crop),
        "pocket": pocket.crop(crop),
        "flap": flap.crop((x0, y0, x1, flap_bottom)) if flap.height >= flap_bottom else flap.crop((x0, y0, x1, flap.height)),
    }
    fi_top = abox(al.crop((0, 0, W, y0)), 128)[1]
    layers["flap_in"] = al.crop((x0, fi_top, x1, y0))
    tip_x, tip_y = info["tip"]
    stage = {
        "aspect": round(bw / bh, 4),
        "pocket_top": r2(100 * (pocket_top - y0) / bh),
        "flap_h": r2(100 * (layers["flap"].height) / bh),
        "flap_in_h": r2(100 * (y0 - fi_top) / bh),
        "valley": [r2(100 * (tip_x - x0) / bw), r2(100 * (tip_y - y0) / bh)],
        "open_scale": [round(sx, 4), round(sy, 4)],
        "hinge_open_px": hinge,
        "flap_cut": {k2: info[k2] for k2 in ("method", "points", "residual_sd") if k2 in info},
    }
    return layers, stage, ec.crop(crop)


def still(layers, stage, seal, card, h=700):
    """The closed envelope as composed in the page (pocket + flap + seal) — a check (--still)."""
    w = round(h * stage["aspect"])
    pad = round(h * .7)
    c = Image.new("RGBA", (w + 80, h + pad + 40), (20, 26, 36, 255))
    ox, oy = 40, pad
    c.alpha_composite(layers["flap_in"].resize((w, round(h * stage["flap_in_h"] / 100))), (ox, oy - round(h * stage["flap_in_h"] / 100)))
    c.alpha_composite(layers["back"].resize((w, h)), (ox, oy))
    L, T, Wc, Hc = stage["card"]
    cr = card.resize((round(w * Wc / 100), round(h * Hc / 100)))
    c.alpha_composite(cr, (ox + round(w * L / 100), oy + round(h * (T - 40) / 100)))
    c.alpha_composite(layers["pocket"].resize((w, h)), (ox, oy))
    sw = round(w * SEAL_W / 100)
    s = seal.resize((sw, round(sw * seal.height / seal.width)))
    vx, vy = stage["valley"]
    c.alpha_composite(s, (ox + round(w * vx / 100) - sw // 2 + 2 * w, oy))  # off-canvas (open state shows no seal)
    return c


def main() -> int:
    missing = [k for k in REQUIRED if not (PARTS / f"{k}.png").exists()]
    if missing:
        print("ERROR: parts missing: " + ", ".join(missing), file=sys.stderr)
        return 1
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in [*OUT.glob("*.webp"), *OUT.glob("*.jpg"), *OUT.glob("*.png"), *OUT.glob("*.json")]:
        old.unlink()

    # grounds
    lake = Image.open(PARTS / "night_lake.png").convert("RGB")
    wide = Image.open(PARTS / "night_lake_wide.png").convert("RGB")
    tb.webp(lake, "lake", [720, 1024], 72, manifest, out=OUT)
    tb.webp(wide, "lake_wide", [1536], 70, manifest, out=OUT)
    tb.webp(lake.resize((480, 720), Image.LANCZOS).filter(ImageFilter.GaussianBlur(7)), "lake_blur", [480], 70, manifest, out=OUT)
    water = wide.crop((0, round(wide.height * .6), wide.width, wide.height))
    tb.webp(water, "water", [720, 1100], 70, manifest, out=OUT)
    paper = seamless(Image.open(PARTS / "paper_tile.png").convert("RGB")).resize((512, 512), Image.LANCZOS)
    tb.webp(paper, "paper", [512], 72, manifest, out=OUT)

    # the envelope
    layers, stage, closed = envelope()
    for k, name, ws, q in (("back", "env_back", [720, 1100], 80), ("pocket", "env_pocket", [720, 1100], 82),
                           ("flap", "env_flap", [720, 1100], 84), ("flap_in", "env_flap_in", [720], 80)):
        tb.webp(layers[k], name, ws, q, manifest, out=OUT)
    seal = trim(part("moon_seal"), 24)
    tb.webp(seal, "seal", [200, 400], 86, manifest, out=OUT)
    sh = SEAL_W * stage["aspect"] * seal.height / seal.width
    vx, vy = stage["valley"]
    stage["seal"] = [r2(vx - SEAL_W / 2), r2(vy - sh * .55), SEAL_W, r2(sh)]
    card = trim(part("card_invite"), 24)
    tb.webp(card, "card", [720, 1100], 82, manifest, out=OUT)
    manifest["card"].update(window(card, "mask_card.png"))
    ch = CARD_W * stage["aspect"] * card.height / card.width
    stage["card"] = [r2(50 - CARD_W / 2), CARD_TOP, CARD_W, r2(ch)]
    stage["card_ratio"] = round(card.width / card.height, 4)
    stage["_note"] = ("% of the closed envelope body (left, top, width, height): pocket from pocket_top down, the flap "
                      "from the top edge (flap_h), its inside standing above it (flap_in_h), the seal on the valley's "
                      "lowest point, the card inside the pocket")
    manifest["stage"] = stage
    moon = trim(part("moon"), 24)
    tb.webp(moon, "moon", [320, 640], 86, manifest, out=OUT)

    # frames: the window = the hole the ring encloses (alpha), arch shape as a mask
    fa = trim(part("frame_arch"), 24)
    tb.webp(fa, "frame_arch", [480, 720], 84, manifest, out=OUT)
    manifest["frame_arch"].update(window(fa, "mask_arch.png"))
    fl = trim(part("frame_landscape"), 24)
    tb.webp(fl, "frame_land", [720, 1100], 84, manifest, out=OUT)
    manifest["frame_land"].update(window(fl))

    # the gilt card in three slices (top 20 %, a repeatable strip from the plain middle, bottom 18 %)
    g = trim(part("card_gilt"), 24)
    gw, gh = g.size
    t, b = round(gh * .2), round(gh * .82)
    mid = g.crop((0, round(gh * .45), gw, round(gh * .45) + round(gw * .12)))
    tb.webp(g.crop((0, 0, gw, t)), "gilt_top", [720], 84, manifest, out=OUT)
    tb.webp(mid, "gilt_mid", [720], 84, manifest, out=OUT)
    tb.webp(g.crop((0, b, gw, gh)), "gilt_bot", [720], 84, manifest, out=OUT)

    bal = trim(part("balustrade"), 24)
    tb.webp(bal, "balustrade", [800, 1400], 80, manifest, out=OUT)

    dv = trim(clean_fringe(part("divider_moonpath"), 10), 10)
    tb.webp(dv, "divider", [720, 1100], 88, manifest, out=OUT)
    # the timeline thread: the divider's broken right third (no moon dot), turned upright
    th = dv.crop((round(dv.width * .66), 0, dv.width, dv.height)).rotate(90, expand=True)
    tb.webp(th, "thread", [720], 88, manifest, out=OUT)

    for key, src in ICONS.items():
        ic = trim(clean_fringe(part(src)), 14)
        s = max(ic.size)
        sq = Image.new("RGBA", (s, s), (0, 0, 0, 0))
        sq.alpha_composite(ic, ((s - ic.width) // 2, (s - ic.height) // 2))
        tb.webp(sq, f"icon-{key}", [128], 88, manifest, out=OUT)
    for i in (1, 2, 3):
        tb.webp(trim(clean_fringe(part(f"gold_leaf_{i}"), 10), 10), f"leaf{i}", [160], 86, manifest, out=OUT)

    # placeholders (no person, no text): the soft lake, toned
    slots = {}
    for shape, name in (("arch", "frame_arch"), ("land", "frame_land")):
        w, h = manifest[name]["window_px"]
        ph = tb.yer_tutucu(lake, (0, 0, lake.width, lake.height), w / h, w=640, ton=PH_TONE, karisim=.3, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[shape] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    asp = lambda n: "{}/{}".format(*manifest[n]["window_px"])  # noqa: E731
    manifest["photo_slots"] = {"hero_portrait": {"aspect": asp("frame_arch")}, "story_1": {"aspect": asp("frame_land")},
                               "story_2": {"aspect": asp("frame_land")}, "story_3": {"aspect": asp("frame_land")},
                               "venue": {"aspect": asp("frame_land")}}

    # share image: the wide lake, the closed envelope low in the middle, the seal in its valley (no text)
    og = wide.resize((1200, 800), Image.LANCZOS).crop((0, 120, 1200, 750)).convert("RGBA")
    ew = 560
    eh = round(ew / stage["aspect"])
    env = closed.resize((ew, eh), Image.LANCZOS)
    ex, ey = (1200 - ew) // 2, 630 - eh - 46
    og.alpha_composite(env, (ex, ey))
    sw = round(ew * SEAL_W / 100)
    og.alpha_composite(seal.resize((sw, round(sw * seal.height / seal.width)), Image.LANCZOS),
                       (ex + round(ew * stage["seal"][0] / 100), ey + round(eh * stage["seal"][1] / 100)))
    manifest["og"] = {"file": "og-1200x630.jpg", "size": [1200, 630],
                      "source": "night_lake_wide + moon_envelope_closed + moon_seal (composited)",
                      "bytes": tb.og_kaydet(og.convert("RGB"), OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(seal)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size,
                           "source": "the moon seal"}
    if "--still" in sys.argv:
        still(layers, stage, seal, card).save(sys.argv[sys.argv.index("--still") + 1])

    manifest["parts"] = {"used": sorted(REQUIRED), "waiting_for_gpt": []}
    manifest["_note"] = "22 v2 (2026-10-24): built from the PAKET 8 parts after the GPT design board. Nothing drawn."
    # light type on the night: "busy" = bright pixels (> 110) or strong edges under a text box (as 21)
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 30},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(stage))
    print({n: manifest[n].get("window_pct") for n in ("card", "frame_arch", "frame_land")})
    print(f"nocturne-lake-estate: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
