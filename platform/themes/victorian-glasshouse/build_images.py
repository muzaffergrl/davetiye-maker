#!/usr/bin/env python3
"""Victorian Glasshouse (36) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G185).

The design's own PAKET 5 parts are ordered in collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md and do not
exist yet. Until they arrive the theme is built like Celestial Observatory (G168): every picture is cut, toned, scaled
or blurred from GPT pixels that already exist — nothing is drawn (K21, docs/11 §5.7). Interim sources (no motif):

  fern ground     collections/17_Emerald_Gold_Estate/assets/gpt/parts/bg_tile.png   plain green velvet, toned deep fern
  glass ground    collections/13_Enchanted_Forest/assets/gpt/parts/bg_tile.png      plain pale paper, toned glass sage
  herbarium paper collections/16_Sunflower_Rustic/assets/gpt/parts/bg_tile.png      plain cream paper, toned herbarium
  kraft           collections/04_Vintage_Airmail/assets/gpt/parts/bg_tile.png      plain aged paper, toned kraft brown
  copper          collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png  the plain metal field inside the
                                                                                    seal (a rectangle, no laurel), toned
  twine           collections/10_Tuscan_Vineyard/assets/gpt/parts/closure.png      a straight piece of the two jute
                                                                                    strands below the knot (no leaf)

Toning keeps each source's own grain (`tonla`). When the design's own parts are in parts/ they are taken the moment
they exist (G167): the build cuts / keys / scales each into img/ and writes `parts.css` (loaded by every page after
site.css) with the rules that use it. A part that is not there has no rule — the page keeps its interim look and never
asks for a picture the build did not make; nothing is drawn as a stand-in (K21):

  fern_ground (W3.1)       fern-640               the dark glasshouse ground (opening, home hero, signature, nav)
  glass_ground (W3.2)      glass-640/1024         the pale page ground (misted glass)
  herbarium_paper (W3.3)   paper-640/1024         cards, bands, labels, the reply form
  packet_body (W3.4)       packet_body-700        the seed packet's front (kraft, printed fern engraving)
  packet_flap (W3.5)       flap_out-700           the packet's top flap, outer face (folded down over the front)
  packet_flap_in (W3.5b)   flap_in-700            its inner face (seen standing above the packet once it has turned)
  copper_tag (W3.6)        tag-360                the hanging copper plant label (its #00FF00 hole keyed)
  twine (W3.7)             twine-160              the jute twine strand (repeats down the packet)
  glass_mist (W3.8)        mist-900               condensation on the glass (the opening's mist, wiped away)
  ironwork (W3.9)          arches-1200            cast-iron glasshouse arches (parallax)
  ferns (W3.10)            ferns-1000             fern fronds and an orchid round the opening and the home hero
  orchid_sprig (W3.11)     sprig-700              divider under the headings on herbarium paper
  specimen_frame (W3.12)   frame-800              the glass case round every 4:5 photo; #00FF00 window measured
  herbarium_label (W3.13)  label-640              the blank label under every specimen (the caption sits on it)
  leaf_1..3 (W3.14)        leaf_N-200             fern leaflets that drift (opening, reply sent; site.js --vg-leaves)
  card_small (W3.15)       card_small-860         the card from the packet; #00FF00 window keyed, portrait on it
  web_hero (W3.16)         og-1200x630.jpg        share image (tema_build.og_kirp, bottom-aligned)

Outputs without parts (img/): fern, glass, paper, kraft, copper, twine, placeholders ph_tall (4:5) / ph_wide (16:9),
og montage of the closed packet on the fern ground, favicon.

  python3 platform/themes/victorian-glasshouse/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/36_Victorian_Glasshouse"
PARTS = COL / "assets/gpt/parts"
OUT = THEME / "img"

# palette (site.css :root)
FERN = (28, 51, 40)              # --fern     #1C3328  the dark glasshouse ground
GLASS = (226, 234, 227)          # --glass    #E2EAE3  pale misted-glass page ground
PAPER = (243, 237, 223)          # --paper    #F3EDDF  herbarium paper
PAPER_SHADE = (216, 222, 210)    # placeholder tone (sage)
KRAFT = (172, 128, 84)           # --kraft    #AC8054  seed packet kraft
COPPER = (178, 106, 60)          # --copper   #B26A3C

INTERIM = {
    "fern_ground": ROOT / "collections/17_Emerald_Gold_Estate/assets/gpt/parts/bg_tile.png",
    "glass_ground": ROOT / "collections/13_Enchanted_Forest/assets/gpt/parts/bg_tile.png",
    "herbarium_paper": ROOT / "collections/16_Sunflower_Rustic/assets/gpt/parts/bg_tile.png",
}
KRAFT_SRC = ROOT / "collections/04_Vintage_Airmail/assets/gpt/parts/bg_tile.png"
COPPER_SRC = ROOT / "collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png"
COPPER_BOX = (.42, .32, .58, .48)        # the plain metal inside the seal's laurel (fractions of the 1024 px part)
TWINE_SRC = ROOT / "collections/10_Tuscan_Vineyard/assets/gpt/parts/closure.png"
TWINE_BOX = (462, 1192, 562, 1418)       # the two straight jute strands below the knot (px of the 1024×1536 part)

# closed seed packet (site.css .packet): width/height; the boxes in % of the packet (left, top, width, height)
STAGE = 0.68
FLAP = (0, 0, 100, 30)            # the top flap folded down over the front, hinged on the packet's top edge
BODY = (0, 5, 100, 95)            # the front wall below the mouth (the back wall shows 0–5 % when the flap is up)
CARD = (9, 4, 82, 80)             # the card inside (0.70:1)
TWINE = (45, -3, 10, 106)         # the twine down the middle (cut at the knot: top half up, bottom half down)
TAG = (49, 40, 30, 30)            # the copper label hanging from the knot (pivot = its hole, top-left)
BUDGET = 2_500_000                # theme folder (docs/11 §6 allows 3 MB; the 39–48 wave keeps ≤ 2.5 MB)


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


def trim(im: Image.Image, esik: int = 8) -> Image.Image:
    k = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)
    return im.crop(k) if k else im


def square(im: Image.Image) -> Image.Image:
    s = max(im.size)
    out = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    out.alpha_composite(im, ((s - im.width) // 2, (s - im.height) // 2))
    return out


def green_window(im: Image.Image):
    """#00FF00 window of a part: (RGBA with the window + 2 px fringe made transparent, (L, T, W, H) % of the image) or
    (None, None) when the part has no green window."""
    c = np.asarray(im).copy()
    rgb = c[..., :3].astype(np.int16)
    green = (rgb[..., 1] > 150) & (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]) > 80) & (c[..., 3] > 128)
    ys, xs = np.nonzero(green)
    if not len(ys):
        return None, None
    h, w = c.shape[:2]
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    m = Image.fromarray((green * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
    c[..., 3] = np.where(np.asarray(m) > 0, 0, c[..., 3])
    return Image.fromarray(c, "RGBA"), (100 * x0 / w, 100 * y0 / h, 100 * (x1 - x0) / w, 100 * (y1 - y0) / h)


def copper_plate() -> Image.Image:
    src = Image.open(COPPER_SRC).convert("RGB")
    w, h = src.size
    crop = src.crop(tuple(round(v * (w if i % 2 == 0 else h)) for i, v in enumerate(COPPER_BOX)))
    return tonla(crop, COPPER, 16).resize((320, 320), Image.LANCZOS)


def twine_strip() -> Image.Image:
    return Image.open(TWINE_SRC).convert("RGBA").crop(TWINE_BOX)


def packet(kraft: Image.Image, copper: Image.Image, twine: Image.Image, h: int, own: dict, stage: dict | None = None) -> Image.Image:
    """The closed seed packet as the page shows it: the kraft body and its flap (GPT, or darker / lighter kraft), the
    twine down the middle and the copper label at the knot (the measured stage when the GPT body and flap exist)."""
    measured = stage is not None and "flap" in stage
    w = round(h * (stage["aspect"] if measured else STAGE))
    BODY_, FLAP_ = (stage["body"], stage["flap"]) if measured else (BODY, FLAP)
    canvas = Image.new("RGBA", (w + 60, h + 60), (0, 0, 0, 0))
    o = 30
    box = lambda b: (round(w * b[0] / 100), round(h * b[1] / 100), round(w * b[2] / 100), round(h * b[3] / 100))  # noqa: E731
    shade = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shade.paste((6, 14, 10, 140), (o + 5, o + 10, o + w + 5, o + h + 10))
    canvas.alpha_composite(shade.filter(ImageFilter.GaussianBlur(9)))
    x, y, bw, bh = box(BODY_)
    body = own.get("packet_body") or ImageEnhance.Brightness(kraft).enhance(.94).resize((max(bw, bh),) * 2).crop((0, 0, bw, bh))
    canvas.alpha_composite(body.convert("RGBA").resize((bw, bh)), (o + x, o + y))
    x, y, fw, fh = box(FLAP_)
    flap = own.get("flap_out") or ImageEnhance.Brightness(kraft).enhance(1.06).resize((max(fw, fh),) * 2).crop((0, 0, fw, fh))
    canvas.alpha_composite(flap.convert("RGBA").resize((fw, fh)), (o + x, o + y))
    x, y, tw, th = box(TWINE)
    tw_img = own.get("twine") or twine
    strip = tw_img.resize((tw, round(tw * tw_img.height / tw_img.width)))
    yy = y
    while yy < y + th:
        canvas.alpha_composite(strip, (o + x, o + max(0, yy)))
        yy += strip.height
    x, y, gw, gh = box(TAG)
    tag = own.get("tag") or copper.resize((gw, gh))
    canvas.alpha_composite(tag.convert("RGBA").resize((gw, gh)), (o + x, o + y))
    return canvas


def optional_parts(manifest: dict) -> tuple[list[str], dict]:
    """W3.4–W3.15: whatever exists → img/ + the CSS rules that use it (parts.css). Returns (css rules, the parts)."""
    css, got = [], {}
    pct = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")  # noqa: E731

    body = part("packet_body")
    if body is not None:
        b = trim(body)
        got["packet_body"] = b
        tb.webp(b, "packet_body", [700], 84, manifest, out=OUT)
        f = manifest["packet_body"]["files"][0]["file"]
        css.append(f".pk-body{{background:url(img/{f}) 0 0/100% 100% no-repeat}}")

    for name, out, cls in (("packet_flap", "flap_out", ".pk-flap-out"), ("packet_flap_in", "flap_in", ".pk-flap-in")):
        fl = part(name)
        if fl is not None:
            f_im = trim(fl)
            got[out] = f_im
            tb.webp(f_im, out, [700], 84, manifest, out=OUT)
            f = manifest[out]["files"][0]["file"]
            css.append(f"{cls}{{background:url(img/{f}) 0 0/100% 100% no-repeat;filter:none}}")

    # the packet laid by the measured GPT pieces (eye check 2026-10-22): the flap came 3.58:1 instead of the asked
    # 100 × 30 box of a 0.68 stage (2.27:1) and was stretched 1.58× in height; the body 0.708:1 instead of 0.716. Now the
    # body spans the width at its own height from its mouth (BODY's top) to the foot — the stage takes its shape — and
    # the flap spans the width at its own height from the fold (the inner face at its own height under it)
    if "packet_body" in got and "flap_out" in got:
        bw_, bh_ = got["packet_body"].size
        aspect = (100 - BODY[1]) / 100 * bw_ / bh_
        fo = got["flap_out"]
        flap_h = 100 * aspect * fo.height / fo.width
        stage = {"aspect": round(aspect, 4), "body": [0, BODY[1], 100, 100 - BODY[1]], "flap": [0, 0, 100, round(flap_h, 2)]}
        if "flap_in" in got:
            fi = got["flap_in"]
            stage["flap_in_pct_of_flap"] = round(100 * (fi.height / fi.width) / (fo.height / fo.width), 2)
        stage["_note"] = ("% of the closed packet (left, top, width, height), measured on the GPT pieces at their own "
                          "proportions; twine and label keep the asked boxes (TWINE, TAG)")
        manifest["stage_measured"] = stage
        css.append(f".stage{{--env-ratio:{stage['aspect']}}}")
        css.append(f".packet{{aspect-ratio:{stage['aspect']}}}")
        css.append(f".pk-flap{{height:{pct(stage['flap'][3])}%}}")
        if "flap_in_pct_of_flap" in stage:
            css.append(f".pk-flap-in{{bottom:auto;height:{pct(stage['flap_in_pct_of_flap'])}%}}")

    tag = part("copper_tag")
    if tag is not None:
        keyed, win = green_window(trim(tag))
        t = keyed if keyed is not None else trim(tag)
        got["tag"] = t
        tb.webp(t, "tag", [360], 86, manifest, out=OUT)
        f = manifest["tag"]["files"][0]["file"]
        manifest["tag"]["ratio_wh"] = round(t.width / t.height, 4)
        if win:
            manifest["tag"]["hole_pct"] = [round(v, 2) for v in win]
        css.append(f".tag-plate{{background:url(img/{f}) 0 0/100% 100% no-repeat;aspect-ratio:{t.width}/{t.height}}}")

    tw = part("twine")
    if tw is not None:
        t = trim(tw)
        got["twine"] = t
        tb.webp(t, "twine_own", [160], 86, manifest, out=OUT)
        f = manifest["twine_own"]["files"][0]["file"]
        css.append(f".twine>span,.tag-cord{{background-image:url(img/{f})}}")

    mist = part("glass_mist")
    if mist is not None:
        got["glass_mist"] = mist
        tb.webp(mist, "mist", [640], 70, manifest, out=OUT)   # a soft veil (cover): ≤ 250 kB
        f = manifest["mist"]["files"][0]["file"]
        css.append(f".mist,.fog{{background-image:url(img/{f});background-size:cover}}")

    for name, out, size, rule in (
        ("ironwork", "arches", 1200, ".arches{{display:block;background:url(img/{f}) 50% 0/100% auto no-repeat}}"),
        ("ferns", "ferns", 1000, ".ferns{{display:block;background:url(img/{f}) 50% 100%/100% auto no-repeat}}"),
    ):
        p = part(name)
        if p is not None:
            got[name] = p
            tb.webp(trim(p), out, [size], 82, manifest, out=OUT)
            f = manifest[out]["files"][0]["file"]
            css.append(rule.format(f=f))

    sprig = part("orchid_sprig")
    if sprig is not None:
        s = trim(sprig)
        got["orchid_sprig"] = s
        tb.webp(s, "sprig", [700], 84, manifest, out=OUT)
        f = manifest["sprig"]["files"][0]["file"]
        css.append(f".sprig{{display:block;aspect-ratio:{s.width}/{s.height};background:url(img/{f}) 50% 50%/100% 100% no-repeat}}")

    frame = part("specimen_frame")
    if frame is not None:
        keyed, win = green_window(trim(frame))
        if win is None:
            print("WARNING specimen_frame.png: no #00FF00 window found — photos stay without a glass case", file=sys.stderr)
            manifest["frame_rejected"] = "no #00FF00 window"
        else:
            got["specimen_frame"] = keyed
            tb.webp(keyed, "frame", [800], 84, manifest, out=OUT)
            f = manifest["frame"]["files"][0]["file"]
            manifest["frame"]["window_pct"] = [round(v, 2) for v in win]
            L, T, W, H = win
            ratio = keyed.width / keyed.height
            # the case fills the specimen's box; the photo (+ its glass: mist, sheen) sits in the measured window
            css.append(f".specimen{{aspect-ratio:{ratio:.4f}}}")
            css.append(f".specimen>.case{{display:block;background:url(img/{f}) 0 0/100% 100% no-repeat}}")
            css.append(f".specimen>.pane{{left:{pct(L - .4)}%;top:{pct(T - .4)}%;width:{pct(W + .8)}%;height:{pct(H + .8)}%}}")

    label = part("herbarium_label")
    if label is not None:
        lb = trim(label)
        got["herbarium_label"] = lb
        tb.webp(lb, "label", [640], 84, manifest, out=OUT)
        f = manifest["label"]["files"][0]["file"]
        css.append(f".hlabel{{background:url(img/{f}) 0 0/100% 100% no-repeat}}")

    leaves = []
    for n in (1, 2, 3):
        lf = part(f"leaf_{n}")
        if lf is not None:
            got[f"leaf_{n}"] = lf
            tb.webp(square(trim(lf)), f"leaf_{n}", [200], 86, manifest, out=OUT)
            leaves.append("img/" + manifest[f"leaf_{n}"]["files"][0]["file"])
    if leaves:
        css.append(":root{--vg-leaves:\"" + " ".join(leaves) + "\"}")

    card = part("card_small")
    if card is not None:
        keyed, win = green_window(trim(card))
        if win is None:
            print("WARNING card_small.png: no #00FF00 window found — the card stays herbarium paper", file=sys.stderr)
            manifest["card_small_rejected"] = "no #00FF00 window"
        else:
            got["card_small"] = keyed
            tb.webp(keyed, "card_small", [860], 82, manifest, out=OUT)
            f = manifest["card_small"]["files"][0]["file"]
            L, T, W, H = win
            manifest["card_small"]["window_pct"] = [round(v, 2) for v in win]
            # padding % is of the containing block's width (the packet), not the card's: the window's foot + 3 % of
            # the card's height, in % of the packet's width (the first build put the text 14 % too low, so it spilled)
            aspect = (manifest.get("stage_measured") or {}).get("aspect", STAGE)
            below = (T + H + 3) / 100 * CARD[3] / aspect
            manifest["card_small"]["text_top_pct_of_card"] = round(T + H + 3, 2)
            css.append(f".packet .card{{background:url(img/{f}) 0 0/100% 100% no-repeat;justify-content:flex-start;"
                       f"padding-top:{pct(below)}%}}")
            css.append(f".packet .card .card-photo,.packet .card.tight .card-photo{{position:absolute;"
                       f"left:{pct(L - .4)}%;top:{pct(T - .4)}%;width:{pct(W + .8)}%;height:{pct(H + .8)}%;aspect-ratio:auto}}")
    return css, got


def main() -> int:
    manifest: dict = {}
    OUT.mkdir(exist_ok=True)
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    fern_src, fern_from, fern_own = kaynak("fern_ground")
    glass_src, glass_from, glass_own = kaynak("glass_ground")
    paper_src, paper_from, paper_own = kaynak("herbarium_paper")
    fern = (fern_src if fern_own else tonla(fern_src, FERN, 6)).filter(ImageFilter.GaussianBlur(.5))
    glass = glass_src if glass_own else tonla(glass_src, GLASS, 4)
    paper = paper_src if paper_own else tonla(paper_src, PAPER, 5)
    kraft = tonla(Image.open(KRAFT_SRC).convert("RGB"), KRAFT, 7).filter(ImageFilter.GaussianBlur(.4))
    copper = copper_plate()
    twine = twine_strip()
    manifest["sources"] = {"fern_ground": fern_from, "glass_ground": glass_from, "herbarium_paper": paper_from,
                           "kraft": f"{KRAFT_SRC.relative_to(ROOT)} (plain aged paper, toned kraft)",
                           "copper": f"{COPPER_SRC.relative_to(ROOT)} (plain metal field {COPPER_BOX}, toned copper)",
                           "twine": f"{TWINE_SRC.relative_to(ROOT)} (jute strands {TWINE_BOX}, no leaf)"}

    tb.webp(fern, "fern", [640], 72, manifest, out=OUT)
    tb.webp(glass, "glass", [640, 1024], 74, manifest, out=OUT)
    tb.webp(paper, "paper", [640, 1024], 76, manifest, out=OUT)
    tb.webp(kraft, "kraft", [640], 76, manifest, out=OUT)
    tb.webp(copper, "copper", [320], 80, manifest, out=OUT)
    tb.webp(twine, "twine", [160], 86, manifest, out=OUT)

    slots = {}
    for key, shape, ratio in (("tall", "tall", 4 / 5), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(paper, (0, 0, paper.width, paper.height), ratio, w=640, ton=PAPER_SHADE, karisim=.5, bulanik=10)
        tb.webp(ph, f"ph_{shape}", [640], 74, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    manifest["photo_slots"] = {"hero_portrait": {"aspect": "4/5"}, "story_1": {"aspect": "4/5"},
                               "story_2": {"aspect": "4/5"}, "story_3": {"aspect": "4/5"}, "venue": {"aspect": "16/9"}}
    manifest["stage"] = {"aspect": STAGE, "flap_pct": FLAP, "body_pct": BODY, "card_pct": CARD, "twine_pct": TWINE,
                         "tag_pct": TAG, "_note": "% of the closed seed packet (left, top, width, height)"}

    css, got = optional_parts(manifest)
    if "stage_measured" in manifest:   # the GPT pieces' measured geometry is the packet; the asked boxes stay as a note
        manifest["stage_asked"] = manifest.pop("stage")
        manifest["stage"] = manifest.pop("stage_measured")
    hero = PARTS / "web_hero.png"
    if hero.exists():
        og, og_info = tb.og_kirp(Image.open(hero), hiza="alt")
        manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "source": "parts/web_hero.png",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
        got["web_hero"] = True
    else:   # the closed seed packet on the fern ground (montage of the page's own crops, no text)
        og = fern.resize((1200, 1200)).crop((0, 285, 1200, 915))
        pk = packet(kraft, copper, twine, 520, got, manifest["stage"])
        og.paste(pk, ((1200 - pk.width) // 2, (630 - pk.height) // 2), pk)
        manifest["og"] = {"file": "og-1200x630.jpg", "source": "montage: closed seed packet (kraft, twine, copper) on the fern ground",
                          "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(packet(kraft, copper, twine, 400, got, manifest["stage"]))
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    optional = ["packet_body", "packet_flap", "packet_flap_in", "copper_tag", "twine", "glass_mist", "ironwork", "ferns", "orchid_sprig",
                "specimen_frame", "herbarium_label", "leaf_1", "leaf_2", "leaf_3", "card_small", "web_hero"]
    used = {"tag": "copper_tag", "flap_out": "packet_flap", "flap_in": "packet_flap_in"}
    have = {used.get(k, k) for k in got}
    missing = [k for k in optional if k not in have] + [k for k in ("fern_ground", "glass_ground", "herbarium_paper")
                                                        if not (PARTS / f"{k}.png").exists()]
    manifest["parts"] = {"used": sorted(have), "waiting_for_gpt": missing}
    manifest["_note"] = ("G185 build from the design's own PAKET 5 parts. Nothing drawn." if not missing else
                         "G185 interim build: fern, glass, herbarium paper, kraft, copper and twine cut and toned from "
                         "other designs' plain GPT pictures; the design's own PAKET 5 parts are taken as they arrive "
                         "(GPT_PROMPTS.md, manifest parts). Nothing drawn.")
    head = ("/* Victorian Glasshouse — GENERATED by build_images.py (do not edit): rules for the design's optional GPT\n"
            "   parts (W3.4–W3.15, GPT_PROMPTS.md) that exist in collections/36_Victorian_Glasshouse/assets/gpt/parts/.\n"
            "   A part that is not there has no rule: the page keeps its look from site.css. */\n")
    (THEME / "parts.css").write_text(head + ("\n".join(css) + "\n" if css else "/* none yet */\n"), encoding="utf-8", newline="\n")   # LF on Windows too (.gitattributes eol=lf)
    manifest["parts_css_rules"] = len(css)

    green = tb.yesil_denetle(OUT)
    # ferns and leaflets are green by nature (not key residue); every keyed window part must be clean
    manifest["checks"] = {"green": green, "_note": "ferns / leaf_N: the GPT foliage's own green, not key residue"}
    big = {f["file"]: f["bytes"] for v in manifest.values() if isinstance(v, dict) for f in v.get("files", []) if f["bytes"] > 250_000}
    keyed_green = {k: v for k, v in green.items() if not k.startswith(("ferns", "leaf_"))}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 140}}
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    mf = OUT / "manifest.json"   # LF on Windows too (.gitattributes eol=lf)
    mf.write_bytes(mf.read_bytes().replace(b"\r\n", b"\n"))
    print(json.dumps(manifest["sources"], indent=1))
    print(f"victorian-glasshouse: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    print(f"green (foliage allowed): {green}; files over 250 kB: {big}")
    if keyed_green or big:
        print(f"ERROR: key green {keyed_green} / a file over 250 kB {big} in img/", file=sys.stderr)
        return 1
    if manifest["bytes_total"] > BUDGET:
        print(f"ERROR: theme folder over {BUDGET / 1e6:.1f} MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
