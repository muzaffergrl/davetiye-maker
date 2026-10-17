#!/usr/bin/env python3
"""Nocturne Lake Estate (22) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py). Interim build (G142).

Sources (collections/22_Nocturne_Lake_Estate/assets/gpt/, the Codex draft's three PNGs; PAKET 5 W2 parts are ordered in
GPT_PROMPTS.md and replace this cut when they arrive):
  envelope.png  closed black envelope, V flap folded down, round gold wax seal on the tip (1448×1086, transparent)
  hero.png      Lake Como terrace at dusk (1024×1536, opaque) — home backdrop, placeholders, share image
  couple.png    fictional couple on the terrace (1122×1402) — demo photo only (content.demo.json media)

K21 (docs/11 §5.7): everything below is cut, masked, mirrored, scaled, blurred or toned from those pixels; nothing is
drawn. Because the envelope comes as ONE closed picture, the opening's separate pieces are cut from it (docs/11 §7.3,
kapak; AGENTS şart 4 — the pieces move on their own):
  env_flap      the V flap (tema_build.kapak_kes "v"; under the seal the fitted V lines, the seal itself is a layer)
  env_pocket    the body below the flap (closed − flap)
  env_seal      the gold wax seal, a disc cut from the closed envelope (it lifts off before the flap turns)
  env_inner     the flap mirrored upwards and toned down: the inside of the opened flap (the 90° hand-over, §7.1)
  env_back      the body softened and darkened: the inside of the envelope that shows once the flap is up
  card_paper    a plain crop of the flap's own black paper, lifted in tone: the invitation card that rises
Under the seal the flap and the pocket carry paper moved from just above / below it (the same envelope's grain), so
the seal can leave without a hole. Interim: a real envelope_open / card_small from GPT replaces env_inner / env_back /
card_paper (GPT_PROMPTS.md W2).

  python3 platform/themes/nocturne-lake-estate/build_images.py
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

COL = ROOT / "collections/22_Nocturne_Lake_Estate"
GPT = COL / "assets/gpt"
OUT = THEME / "img"
INK = (17, 18, 15)               # --black (placeholder tone)


def seal_disc(c: np.ndarray):
    """Centre and radius of the gold seal: warm bright pixels in the middle of the envelope."""
    r, g, b, a = (c[..., i].astype(int) for i in range(4))
    h, w = a.shape
    gold = (r > 100) & (r - b > 40) & (a > 128)
    y0, y1, x0, x1 = int(h * .35), int(h * .75), int(w * .33), int(w * .67)
    sub = gold[y0:y1, x0:x1]
    rows = np.flatnonzero(sub.sum(1) > 3)
    cols = np.flatnonzero(sub.sum(0) > 3)
    cx, cy = (cols.min() + cols.max()) / 2 + x0, (rows.min() + rows.max()) / 2 + y0
    return cx, cy, max(cols.max() - cols.min(), rows.max() - rows.min()) / 2


def disc(h, w, cx, cy, rad, soft=2.0):
    yy, xx = np.mgrid[0:h, 0:w]
    return np.clip((rad - np.hypot(xx - cx, yy - cy)) / soft + .5, 0, 1)


def main() -> int:
    manifest: dict = {"_note": "G142 interim build: envelope pieces cut from the single closed envelope (see "
                      "build_images.py); PAKET 5 W2 parts ordered in GPT_PROMPTS.md."}
    warnings: list[str] = []
    for old in list(OUT.glob("*.webp")) + list(OUT.glob("*.jpg")) + list(OUT.glob("*.png")):
        old.unlink()

    # ---------------------------------------------------------------- envelope
    env = Image.open(GPT / "envelope.png").convert("RGBA")
    c = np.asarray(env).copy()
    h, w = c.shape[:2]
    al = c[..., 3].astype(float)
    flap_img, info = tb.kapak_kes(env, "v")
    if info.get("warnings"):
        warnings += info["warnings"]
    hinge = int(info["hinge_row"])
    (ml, bl, _), (mr, br, _) = info["left"], info["right"]
    tip_x = (br - bl) / (ml - mr)
    tip_y = ml * tip_x + bl
    vline = lambda x: np.minimum(ml * x + bl, mr * x + br)          # noqa: E731 — the flap's free edge (fitted V)
    yy, xx = np.mgrid[0:h, 0:w]
    geo = np.clip(vline(xx) - yy, 0, 1) * (yy >= hinge - 2)
    frac = np.zeros((h, w))
    fa = np.asarray(flap_img)[..., 3].astype(float)
    frac[:fa.shape[0]] = np.where(al[:fa.shape[0]] > 0, fa / np.maximum(al[:fa.shape[0]], 1), 0)

    cx, cy, rad = seal_disc(c)
    seal_m = disc(h, w, cx, cy, rad + 12, soft=5)   # the seal with its own contact shadow
    hole = disc(h, w, cx, cy, rad + 28, soft=10)
    frac = np.where(hole > 0, geo, frac)                              # under the seal: the fitted V

    # paper under the seal: flap side from above, pocket side from below (same envelope, same grain)
    up, down = int(rad * 2.2), int(rad * 1.6)
    above = np.roll(c, up, axis=0)
    below = np.roll(c, -down, axis=0)
    fill = np.where((geo > .5)[..., None], above, below).astype(float)
    # match the moved paper to the tone right around the seal, side by side (no lighter disc)
    ring = (disc(h, w, cx, cy, rad + 66) - disc(h, w, cx, cy, rad + 40)) > .5
    inside = hole > .5
    for side in (geo > .5, geo <= .5):
        ref, got = ring & side & (al > 200), inside & side
        if ref.sum() > 50 and got.sum() > 50:
            fill[got, :3] += c[ref, :3].mean(0) - fill[got, :3].mean(0)
    fill = np.clip(fill, 0, 255)
    k = hole[..., None]
    filled = (c * (1 - k) + fill * k).astype(np.uint8)
    filled[..., 3] = c[..., 3]
    F = Image.fromarray(filled, "RGBA")

    box = tb.alfa_kutusu(c[..., 3])                                   # envelope box on the canvas (x0, y0, x1, y1)
    X0, Y0, X1, Y1 = box
    W, H = X1 - X0, Y1 - Y0

    def piece(alpha: np.ndarray, name: str, widths, rows=None, src=filled):
        rgba = src.copy()
        rgba[..., 3] = np.round(src[..., 3] * alpha).astype(np.uint8)
        y_a, y_b = rows if rows else (Y0, Y1)
        im = Image.fromarray(rgba[y_a:y_b, X0:X1], "RGBA")
        tb.webp(im, name, widths, 82, manifest, out=OUT)
        return im

    flap_rows = (Y0, int(np.ceil(tip_y)) + 4)
    flap = piece(frac, "env_flap", [440, 880], flap_rows)
    piece(1 - frac, "env_pocket", [440, 880])
    # seal: its own disc from the untouched envelope
    s_box = (int(cx - rad - 20), int(cy - rad - 20), int(cx + rad + 21), int(cy + rad + 21))
    seal_rgba = c.copy()
    seal_rgba[..., 3] = np.round(c[..., 3] * seal_m).astype(np.uint8)
    seal = Image.fromarray(seal_rgba, "RGBA").crop(s_box)
    tb.webp(seal, "env_seal", [160, 320], 84, manifest, out=OUT)
    # inside of the flap: the flap mirrored over the hinge, toned down
    inner = ImageEnhance.Brightness(flap.transpose(Image.FLIP_TOP_BOTTOM)).enhance(.62)
    tb.webp(inner, "env_inner", [440, 880], 80, manifest, out=OUT)
    # inside of the envelope: the filled body softened and darkened
    back = ImageEnhance.Brightness(F.crop((X0, Y0, X1, Y1)).filter(ImageFilter.GaussianBlur(3))).enhance(.5)
    tb.webp(back, "env_back", [440, 880], 78, manifest, out=OUT)
    # the card: a plain crop of the flap's paper (inside the V, above the seal), lifted in tone
    cbox = (int(tip_x - W * .23), Y0 + int(H * .03), int(tip_x + W * .23), Y0 + int(H * .03) + int(W * .23))
    assert vline(np.array([cbox[0], cbox[2]])).min() > cbox[3], "card crop leaves the flap"
    card = ImageEnhance.Brightness(F.crop(cbox).convert("RGB")).enhance(1.55)
    tb.webp(card, "card_paper", [480, 960], 80, manifest, out=OUT)

    pct = lambda v, tot: round(100 * v / tot, 3)                      # noqa: E731
    manifest["stage"] = {
        "canvas": [w, h], "box": [X0, Y0, W, H], "objAspect": round(W / H, 4),
        "flap": {"box_pct": [0, 0, 100, pct(flap_rows[1] - Y0, H)], "hinge_pct": pct(hinge - Y0, H),
                 "tip": [round(tip_x, 1), round(tip_y, 1)], "method": info["method"]},
        "inner": {"box_pct": [0, -pct(flap_rows[1] - Y0, H), 100, pct(flap_rows[1] - Y0, H)]},
        "seal": {"center_pct": [pct(cx - X0, W), pct(cy - Y0, H)], "width_pct": pct(s_box[2] - s_box[0], W),
                 "height_pct": pct(s_box[3] - s_box[1], H)},
        "card_crop": list(cbox),
    }

    # ---------------------------------------------------------------- lake, photos, placeholders, share
    hero = Image.open(GPT / "hero.png").convert("RGB")
    tb.webp(hero, "lake_hero", [640, 1024], 76, manifest, out=OUT)
    tb.webp(hero.crop((0, 420, 1024, 1188)), "lake_view", [640, 1024], 76, manifest, out=OUT)
    tb.webp(hero.crop((0, 900, 1024, 1536)), "terrace", [640, 1024], 76, manifest, out=OUT)
    couple = Image.open(GPT / "couple.png").convert("RGB")
    tb.webp(tb.kapla(couple, 4 / 5, .35), "couple", [480, 960], 78, manifest, out=OUT)
    sky = (0, 0, 1024, 900)
    slots = {}
    for key, shape, ratio in (("hero_portrait", "portrait", 4 / 5), ("story", "land", 4 / 3), ("venue", "wide", 16 / 9)):
        ph = tb.yer_tutucu(hero, sky, ratio, w=640, ton=INK, karisim=.45, bulanik=8)
        tb.webp(ph, f"ph_{shape}", [640], 76, manifest, out=OUT)
        slots[key] = f"ph_{shape}-640.webp"
    manifest["placeholders"] = slots
    og, og_info = tb.og_kirp(hero, hiza="alt")
    manifest["og"] = {**og_info, "file": "og-1200x630.jpg", "bytes": tb.og_kaydet(og, OUT / "og-1200x630.jpg")}
    icon, icon_info = tb.ikon(seal)
    icon.save(OUT / "favicon.png", optimize=True)
    manifest["favicon"] = {**icon_info, "file": "favicon.png", "bytes": (OUT / "favicon.png").stat().st_size}

    # ---------------------------------------------------------------- checks + manifest
    green = tb.yesil_denetle(OUT)
    manifest["checks"] = {"seal_radius_px": round(rad, 1), "green": green}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    if warnings:
        manifest["warnings"] = warnings
        for x in warnings:
            print("WARN", x)
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(json.dumps(manifest["stage"], indent=1))
    print(f"nocturne-lake-estate: theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
