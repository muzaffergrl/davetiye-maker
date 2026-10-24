#!/usr/bin/env python3
"""Crimson Rose Atelier (21) — GPT sources → img/ + parts.css (docs/11 §5.4; tools/tema_build.py).

2026-10-23 atelier redesign. Every image is a GPT part of collections/21_Crimson_Rose_Atelier/assets/gpt/, only cut,
aligned, scaled and compressed here (K21: nothing is drawn):

  env_closed   the closed envelope cropped to its body — the stage box; the pocket and the 3D flap (both faces) are
               cut from it in CSS with clip-path
  env_inside   the open envelope's body (decor/envelope-open.png below its hinge) scaled onto the closed body: the
               inside that shows when the flap has turned up (the open flap itself is not used — the 3D flap's back face
               is the closed flap, mirrored and shaded)
  seal         the gold wax seal (two clip-path halves crack apart in CSS)
  card_portrait  parts/info_card.png — the deckled card that rises from the envelope and lands as the home hero card
  card_formal    parts/invitation_card.png — the formal invitation on home (3-slice: the roses stay in their corners)
  rose         decor/rose-branch.png
  paper        textures/paper-background.png
  ph_*         neutral photo placeholders from the paper (no person, no text)

PAKET 8 (GPT_PROMPTS.md W3.x) parts are optional: each one that exists is cut and named in parts.css (generated), with
the boxes measured on it; a part that is not there has no rule and the page keeps its site.css look.

  python3 platform/themes/crimson-rose-atelier/build_images.py
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

COL = ROOT / "collections/21_Crimson_Rose_Atelier"
GPT = COL / "assets/gpt"
OUT = THEME / "img"
PAPER = (248, 239, 223)          # --cream

# photo windows (theme.json "aspect"): oval portrait, album leaves, venue band
SLOTS = {"hero_portrait": ("portrait", 4 / 5), "story": ("land", 4 / 3), "venue": ("wide", 16 / 9)}
# the demo photos the collection's content.demo.json points at (kept as made in G133)
KEEP = {"couple-photo.webp", "story_2.webp", "story_3.webp", "venue.webp", "og-1200x630.jpg", "favicon.png"}


def rgba(p: Path) -> Image.Image:
    return Image.open(p).convert("RGBA")


def bbox(im: Image.Image, thr: int = 128):
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > thr)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def trim(im: Image.Image, thr: int = 24, pad: int = 2) -> Image.Image:
    x0, y0, x1, y1 = bbox(im, thr)
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))


def pct(v: float) -> str:
    return f"{v * 100:.2f}%".replace(".00%", "%")


def envelope(manifest: dict) -> dict:
    closed = rgba(GPT / "decor/envelope-closed.png")
    opened = rgba(GPT / "decor/envelope-open.png")
    cb = bbox(closed)
    body = closed.crop(cb)
    tb.webp(body, "env_closed", [720, 1100], 84, manifest, out=OUT)
    # the open envelope's body: rows where it is (nearly) as wide as its widest row = below the hinge of its flap
    a = np.asarray(opened)[..., 3] > 128
    widths = a.sum(1)
    full = widths.max()
    hinge = int(np.argmax(widths >= full * 0.985))
    ys = np.where(widths > 0)[0]
    xs = np.where(a[hinge:].any(0))[0]
    inside = opened.crop((int(xs.min()), hinge, int(xs.max()) + 1, int(ys.max()) + 1)).resize(body.size, Image.LANCZOS)
    tb.webp(inside, "env_inside", [720, 1100], 82, manifest, out=OUT)
    W, H = body.size
    return {"ratio": round(W / H, 4), "inside_src": [int(xs.min()), hinge, int(xs.max()) + 1, int(ys.max()) + 1],
            "flap": "clip-path polygon in site.css (hinge = top edge of the body, tip at 76.6 % of its height)"}


def cards(manifest: dict) -> dict:
    out = {}
    # band = a plain stretch of paper and gold border (no rose, no mid-side flourish) that repeats down the middle of a
    # card that has to grow (3-slice, docs/11 §9): rows measured on the parts (flourish at ~49 %, roses above / below)
    for src, name, band in (("parts/info_card.png", "card_portrait", (.55, .85)),
                            ("parts/invitation_card.png", "card_formal", (.54, .61))):
        im = trim(rgba(GPT / src), 24, 0)
        tb.webp(im, name, [520, 860], 84, manifest, out=OUT)
        y0, y1 = round(im.height * band[0]), round(im.height * band[1])
        tb.webp(im.crop((0, y0, im.width, y1)), f"{name}_band", [520, 860], 84, manifest, out=OUT)
        out[name] = {"ratio": round(im.width / im.height, 4), "band": list(band)}
    return out


def optional_parts(manifest: dict) -> list[str]:
    """PAKET 8 parts that exist → img/ + parts.css rules (the selectors are the theme's own hooks in site.css)."""
    P = GPT / "parts"
    rules: list[str] = []
    found: list[str] = []

    def have(n: str) -> Path | None:
        p = P / n
        return p if p.exists() else None

    if have("velvet.png"):
        im = Image.open(P / "velvet.png").convert("RGB")
        tb.webp(im, "velvet", [720, 1024], 80, manifest, out=OUT)
        rules.append(":root{--cra-velvet:url(img/velvet-720.webp);--cra-velvet-2x:url(img/velvet-1024.webp)}.velvet{display:block}")
        found.append("velvet")
    if have("velvet_wide.png"):
        im = Image.open(P / "velvet_wide.png").convert("RGB")
        tb.webp(im, "velvet_wide", [1536], 78, manifest, out=OUT)
        rules.append("@media(min-width:700px){:root{--cra-velvet:url(img/velvet_wide-1536.webp);--cra-velvet-2x:url(img/velvet_wide-1536.webp)}}")
        found.append("velvet_wide")
    if have("satin_drape.png"):
        im = trim(rgba(P / "satin_drape.png"))
        tb.webp(im, "satin", [1200], 80, manifest, out=OUT)
        rules.append(f".satin{{display:block;aspect-ratio:{im.width}/{im.height};background:url(img/satin-1200.webp) 50% 100%/100% 100% no-repeat}}")
        found.append("satin_drape")
    petals = []
    for i in range(1, 6):
        if have(f"petal_{i}.png"):
            im = trim(rgba(P / f"petal_{i}.png"))
            side = max(im.size)
            sq = Image.new("RGBA", (side, side))
            sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
            tb.webp(sq, f"petal_{i}", [96], 86, manifest, out=OUT)
            petals.append(f"img/petal_{i}-96.webp")
    if petals:
        rules.append(':root{--cra-petals:"' + " ".join(petals) + '"}')
        found.append(f"petals×{len(petals)}")
    if have("oval_frame.png"):
        im = rgba(P / "oval_frame.png")
        arr = np.asarray(im).astype(int)
        green = (arr[..., 1] > 200) & (arr[..., 0] < 90) & (arr[..., 2] < 90) & (arr[..., 3] > 200)
        if green.sum() <= 1000:
            # PAKET 9 W4.1: the window may come transparent instead of green — then it is the transparent region
            # enclosed by the (closed) frame ring: the clear component under the centre that does not touch the edge
            from scipy import ndimage
            lab, _ = ndimage.label(arr[..., 3] <= 40)
            c = lab[arr.shape[0] // 2, arr.shape[1] // 2]
            edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
            if c and c not in edge:
                green = lab == c
        if green.sum() > 1000:
            ys, xs = np.where(green)
            x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
            frame = im.copy()
            fa = np.asarray(frame).copy()
            # the window (and its anti-aliased rim) becomes transparent; the photo shows through it
            rim = Image.fromarray((green * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
            fa[..., 3] = np.where(np.asarray(rim) > 0, 0, fa[..., 3])
            frame = Image.fromarray(fa.astype(np.uint8), "RGBA")
            tb.webp(frame, "oval_frame", [640], 86, manifest, out=OUT)
            mask = Image.fromarray((green[y0:y1, x0:x1] * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
            mask.resize((400, round(400 * (y1 - y0) / (x1 - x0))), Image.LANCZOS).save(OUT / "mask_oval.png", optimize=True)
            W, H = im.size
            rules.append(".oval-frame{display:block;background:url(img/oval_frame-640.webp) 0 0/100% 100% no-repeat}"
                         f".framed{{--fx:{pct(x0 / W)};--fy:{pct(y0 / H)};--fw:{pct((x1 - x0) / W)};--fh:{pct((y1 - y0) / H)};"
                         f"aspect-ratio:{W}/{H}}}"
                         ".framed>.photo-slot{-webkit-mask:url(img/mask_oval.png) 0 0/100% 100% no-repeat;"
                         "mask:url(img/mask_oval.png) 0 0/100% 100% no-repeat;border-radius:0;box-shadow:none}")
            found.append("oval_frame")
    if have("torn_edge.png"):
        # GPT drew the oxblood paper torn open over ivory: opaque paper above a ragged tear with its white fibres,
        # nothing below. Kept: a strip of paper above the highest point of the tear, the tear and its fibres; the top
        # of the strip fades out so it melts into the room's dark (cut + mask only). The sheet's straight top edge then
        # sits under opaque paper, just above the tear, and the ivory sheet shows through below it.
        im = rgba(P / "torn_edge.png")
        al = np.asarray(im)[..., 3]
        H, W = al.shape
        gone = al <= 128
        tear = np.array([int(np.argmax(gone[:, x])) if gone[:, x].any() else H for x in range(W)])
        hi, lo = int(np.percentile(tear, 1)), int(np.percentile(tear, 99))
        end = min(H, int(np.flatnonzero((al > 8).any(axis=1)).max()) + 2)
        top = max(0, hi - max(60, int(1.3 * (lo - hi))))
        strip = np.asarray(im.crop((0, top, W, end))).copy()
        h = strip.shape[0]
        ramp = np.clip(np.arange(h) / max(1, (hi - top) * .75), 0, 1) ** 1.5
        strip[..., 3] = (strip[..., 3] * ramp[:, None]).astype(np.uint8)
        tb.webp(Image.fromarray(strip, "RGBA"), "torn_edge", [1200], 84, manifest, out=OUT)
        rules.append(f".torn{{display:block;aspect-ratio:{W}/{h};background:url(img/torn_edge-1200.webp) 50% 0/100% 100% no-repeat}}"
                     f".sheet>.torn{{bottom:auto;top:0;margin:0;translate:0 -{pct((hi - top - 8) / h)}}}.sheet{{box-shadow:none}}")
        found.append("torn_edge")
    if have("ribbon.png"):
        im = trim(rgba(P / "ribbon.png"))
        tb.webp(im, "ribbon", [180], 86, manifest, out=OUT)
        rules.append(f".ribbon{{display:block;aspect-ratio:{im.width}/{im.height};background:url(img/ribbon-180.webp) 50% 0/100% 100% no-repeat}}")
        found.append("ribbon")
    if have("gold_sprig.png"):
        im = trim(rgba(P / "gold_sprig.png"))
        tb.webp(im, "sprig", [120], 88, manifest, out=OUT)
        rules.append(f".sprig{{display:block;aspect-ratio:{im.width}/{im.height};background:url(img/sprig-120.webp) 50%/contain no-repeat}}")
        found.append("gold_sprig")
    if have("album_page.png"):
        im = trim(rgba(P / "album_page.png"))
        tb.webp(im, "album_page", [720], 82, manifest, out=OUT)
        # the album becomes a real book of deckled pages (binding on the left): the leaves take the page's own shape
        r = f"{im.width}/{im.height}"
        rules.append(f".leaf-face{{background:url(img/album_page-720.webp) 0 0/100% 100% no-repeat;padding:12% 10% 12% 15%;aspect-ratio:{r}}}"
                     f".js .book{{aspect-ratio:{r}}}"
                     ".js .album-leaf::after,.leaf-shade{-webkit-mask-image:url(img/album_page-720.webp);mask-image:url(img/album_page-720.webp)}")
        found.append("album_page")
    if have("rose_corner.png"):
        im = trim(rgba(P / "rose_corner.png"))
        tb.webp(im, "rose_corner", [640], 84, manifest, out=OUT)
        rules.append(f".rose-corner{{display:block;aspect-ratio:{im.width}/{im.height};background:url(img/rose_corner-640.webp) 0 100%/100% 100% no-repeat}}")
        found.append("rose_corner")
    if have("rose_bloom.png"):
        im = trim(rgba(P / "rose_bloom.png"))
        tb.webp(im, "rose_bloom", [200, 400], 86, manifest, out=OUT)
        rules.append(".bloom{display:block;background:url(img/rose_bloom-200.webp) 50%/contain no-repeat;"
                     "background-image:image-set(url(img/rose_bloom-200.webp) 1x,url(img/rose_bloom-400.webp) 2x)}")
        found.append("rose_bloom")
    # PAKET 9 (W4.x): programme icons, album photo corner, gold flourish, satin bow, rosebud
    icons = []
    for key in ("rings", "toast", "dinner", "dance", "cake", "sparkle", "pin", "dress"):
        if have(f"icon_{key}.png"):
            im = trim(rgba(P / f"icon_{key}.png"))
            side = max(im.size)
            sq = Image.new("RGBA", (side, side))
            sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
            tb.webp(sq, f"icon_{key}", [96], 88, manifest, out=OUT)
            icons.append(f"--cra-icon-{key}:url(img/icon_{key}-96.webp)")
    if icons:
        rules.append(":root{" + ";".join(icons) + "}.sched-icon{display:block}")
        found.append(f"icons×{len(icons)}")
    if have("photo_corner.png"):
        im = trim(rgba(P / "photo_corner.png"))
        tb.webp(im, "photo_corner", [120], 88, manifest, out=OUT)
        rules.append(f":root{{--cra-corner:url(img/photo_corner-120.webp)}}.corners{{display:block}}")
        found.append("photo_corner")
    if have("gold_flourish.png"):
        im = trim(rgba(P / "gold_flourish.png"))
        tb.webp(im, "flourish", [600], 86, manifest, out=OUT)
        rules.append(f".flourish{{display:block;aspect-ratio:{im.width}/{im.height};background:url(img/flourish-600.webp) 50%/contain no-repeat}}")
        found.append("gold_flourish")
    if have("ribbon_bow.png"):
        im = trim(rgba(P / "ribbon_bow.png"))
        tb.webp(im, "bow", [400], 86, manifest, out=OUT)
        rules.append(f".bow{{display:block;aspect-ratio:{im.width}/{im.height};background:url(img/bow-400.webp) 50%/contain no-repeat}}")
        found.append("ribbon_bow")
    if have("rose_bud.png"):
        im = trim(rgba(P / "rose_bud.png"))
        tb.webp(im, "rose_bud", [200], 86, manifest, out=OUT)
        rules.append(f".bud{{display:block;aspect-ratio:{im.width}/{im.height};background:url(img/rose_bud-200.webp) 50%/contain no-repeat}}")
        found.append("rose_bud")
    head = ("/* Crimson Rose Atelier — GENERATED by build_images.py (do not edit): the PAKET 8 GPT parts (GPT_PROMPTS.md W3.x)\n"
            "   that exist in collections/21_Crimson_Rose_Atelier/assets/gpt/parts/, with the boxes measured on them. A part that\n"
            "   is not there has no rule: the page keeps its site.css look. */\n")
    (THEME / "parts.css").write_text(head + "\n".join(rules) + ("\n" if rules else ""))
    return found


def main() -> int:
    old = json.loads((OUT / "manifest.json").read_text()) if (OUT / "manifest.json").exists() else {}
    manifest: dict = {"_note": "2026-10-23 atelier redesign: build_images.py cuts every image from the collection's GPT "
                      "parts; the demo photos, og and favicon are the G133 files."}
    # clear the previous derivatives (never the kept demo photos, og, favicon or the palette folders)
    for f in OUT.iterdir():
        if f.is_file() and f.name not in KEEP and f.name != "manifest.json":
            f.unlink()
    manifest["stage"] = envelope(manifest)
    manifest["cards"] = cards(manifest)
    seal = trim(rgba(GPT / "decor/seal.png"))
    tb.webp(seal, "seal", [160, 320], 86, manifest, out=OUT)
    rose = trim(rgba(GPT / "decor/rose-branch.png"))
    tb.webp(rose, "rose", [420, 800], 84, manifest, out=OUT)
    paper = Image.open(GPT / "textures/paper-background.png").convert("RGB")
    # a seamless tile: the paper and its three mirror images (2 × 2), so a repeated background shows no seams
    w2, h2 = paper.size
    tile = Image.new("RGB", (w2 * 2, h2 * 2))
    tile.paste(paper, (0, 0))
    tile.paste(paper.transpose(Image.FLIP_LEFT_RIGHT), (w2, 0))
    tile.paste(paper.transpose(Image.FLIP_TOP_BOTTOM), (0, h2))
    tile.paste(paper.transpose(Image.ROTATE_180), (w2, h2))
    tb.webp(tile, "paper", [1200], 70, manifest, out=OUT)
    w, h = paper.size
    box = (int(w * .1), int(h * .1), int(w * .9), int(h * .9))
    slots = {}
    for key, (shape, ratio) in SLOTS.items():
        ph = tb.yer_tutucu(paper, box, ratio, w=640, ton=PAPER, karisim=.25, bulanik=6)
        tb.webp(ph, f"ph_{shape}", [640], 78, manifest, out=OUT)
        slots[key] = {"placeholder": f"ph_{shape}-640.webp", "aspect": f"{round(ratio * 1000)}/1000"}
    manifest["placeholders"] = slots
    manifest["paket8"] = optional_parts(manifest)
    for k in ("og", "favicon", "theme_check"):
        if k in old:
            manifest[k] = old[k]
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(f"crimson-rose-atelier: stage {manifest['stage']['ratio']}, PAKET 8 parts: {', '.join(manifest['paket8']) or 'none'}, "
          f"theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
