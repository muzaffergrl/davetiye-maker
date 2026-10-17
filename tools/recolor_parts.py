#!/usr/bin/env python3
"""G153 — renk paleti varyantları: mevcut GPT parçalarını algoritmayla yeni palete boyar (K21: yeni şekil/dekor çizmez,
yalnız renk dönüşümü; yeni sanat gerekirse GPT prompt'u yazılır).

  python3 tools/recolor_parts.py tokenize --theme <id>          # tek sefer: CSS'teki sabit renkleri :root token'ına taşır
  python3 tools/recolor_parts.py build --design 01 [--variant V02_dusty_blue] [--no-sheet]
  python3 tools/recolor_parts.py check --design 01              # yazmadan denetim (manifest, palet, kontrast, dosyalar)

Girdi (docs/25_PALET_VARYANTLARI.md):
  collections/<NN_*>/variants/recolor.json   tasarımın renk aileleri (çapa rengi + ton genişliği), parça manifesti
                                             (recolor: auto | gpt | keep, group), baskı parçaları, CSS token aileleri,
                                             kontrast çiftleri
  collections/<NN_*>/variants/V0x_<slug>/palette.json   02'nin şeması (ink, deep, primary, mist_top, mist_bottom, gold,
                                             gold_light, ivory, leaf) + slug, name, status, swatch, families (aile → rol)
Çıktı:
  platform/themes/<id>/img/variants/<slug>/<parça>-<genişlik>.webp   (yalnız recolor: auto parçalar; diğerleri asıl)
  platform/public/print/<id>/variants/<slug>/<ad>.webp                 (baskı davetiyesi parçaları)
  platform/themes/<id>/variants.css                                    html[data-variant="<slug>"] token blokları
  platform/themes/<id>/theme.json  "variants" (+ "swatch")             durum korunur; yeni varyant "coming"
  collections/<NN_*>/variants/V0x_<slug>/review/contact_sheet.jpg      gözle inceleme (asıl | varyant, durum etiketi)

Dönüşüm (OKLab/OKLCH): her piksel, parçanın grubundaki ailelere ton açısı yakınlığıyla (Gauss, sigma derece) ve kromaya
göre yumuşak ağırlık alır (neredeyse gri pikseller — fildişi kağıt, dantel — dokunulmaz). Aile çapası A, hedef rol rengi
T ise: L' = L_T + (L − L_A)·lk, C' = C·C_T/C_A, h' = h + (h_T − h_A). Doku (L farkları) ve alfa korunur; hedefi null olan
aile (metal altın/gümüş) olduğu gibi kalır. Aynı dönüşüm CSS token'larına uygulanır, ardından metin token'ları kontrast
çiftlerine göre (≥ 4.5:1) gerekirse koyulaştırılır/açılır. Fotoğraflar hiçbir zaman boyanmaz (manifestte keep).
"""
import argparse
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
THEMES = ROOT / "platform/themes"
PRINT = ROOT / "platform/public/print"
COLLECTIONS = ROOT / "collections"
sys.dont_write_bytecode = True

ROLES = ["ink", "deep", "primary", "mist_top", "mist_bottom", "gold", "gold_light", "ivory", "leaf"]
SLUG_RE = re.compile(r"^[a-z][a-z0-9-]{0,31}$")
HEX_RE = re.compile(r"^#[0-9a-fA-F]{6}$")
IMG_EXT = (".webp", ".png", ".jpg", ".jpeg")
WEBP_Q = 82
WEBP_METHOD = 4


class RecolorError(Exception):
    pass


def rel(p):
    try:
        return p.relative_to(ROOT).as_posix()
    except ValueError:
        return str(p)


# --------------------------------------------------------------------------------------------- renk matematiği (OKLab)

_M1 = np.array([[0.4122214708, 0.5363325363, 0.0514459929], [0.2119034982, 0.6806995451, 0.1073969566],
                [0.0883024619, 0.2817188376, 0.6299787005]])
_M2 = np.array([[0.2104542553, 0.7936177850, -0.0040720468], [1.9779984951, -2.4285922050, 0.4505937099],
                [0.0259040371, 0.7827717662, -0.8086757660]])
_M1I = np.linalg.inv(_M1)
_M2I = np.linalg.inv(_M2)


def rgb_to_oklab(rgb):
    c = np.asarray(rgb, float) / 255.0
    lin = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return np.cbrt(lin @ _M1.T) @ _M2.T


def oklab_to_rgb(lab):
    lin = np.clip(((np.asarray(lab, float) @ _M2I.T) ** 3) @ _M1I.T, 0, 1)
    return np.where(lin <= 0.0031308, lin * 12.92, 1.055 * np.power(lin, 1 / 2.4) - 0.055) * 255.0


def hex_rgb(h):
    if not isinstance(h, str) or not HEX_RE.match(h):
        raise RecolorError(f"renk #RRGGBB olmalı: {h!r}")
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)


def rgb_hex(rgb):
    r, g, b = (int(round(float(x))) for x in np.clip(rgb, 0, 255))
    return f"#{r:02X}{g:02X}{b:02X}"


def _lch(lab):
    return lab[..., 0], np.hypot(lab[..., 1], lab[..., 2]), np.arctan2(lab[..., 2], lab[..., 1])


def _wrap(d):
    return (d + np.pi) % (2 * np.pi) - np.pi


def luminance(rgb):
    c = np.asarray(rgb, float) / 255.0
    lin = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return float(0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2])


def contrast(a, b):
    la, lb = sorted([luminance(a), luminance(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


def transfer(rgb, families, cmin=0.012, cfull=0.035):
    """rgb (..., 3) → yeni rgb. families: [{anchor: lab, target: lab | None, sigma: derece, lk: float, cmin?, cfull?, cmax?,
    cfade?}] (cmin/cfull: ailenin kroma eşiği — bu kromanın altındaki pikseller o aileye girmez; kağıt gibi soluk tonları korur;
    cmax/cfade: üst eşik — cmax + cfade üstündeki pikseller girmez; aynı tondaki canlı çiçekten soluk kağıdı ayırır)."""
    lab = rgb_to_oklab(rgb)
    L, C, h = _lch(lab)
    sat = np.clip((C - cmin) / (cfull - cmin), 0, 1)
    weights, outs = [], []
    for f in families:
        La, Ca, ha = _lch(f["anchor"])
        s = sat if "cmin" not in f else np.clip((C - f["cmin"]) / (f.get("cfull", f["cmin"] + 0.02) - f["cmin"]), 0, 1)
        if "cmax" in f:  # G158: the family stops above this chroma (a pale paper sharing the hue of a vivid flower)
            s = s * np.clip((f["cmax"] + f.get("cfade", 0.015) - C) / f.get("cfade", 0.015), 0, 1)
        w = np.exp(-0.5 * (_wrap(h - ha) / np.radians(f.get("sigma", 20))) ** 2) * s
        weights.append(w)
        if f["target"] is None:
            outs.append(lab)
            continue
        Lt, Ct, ht = _lch(f["target"])
        L2 = Lt + (L - La) * f.get("lk", 1.0)
        C2 = C * (Ct / max(float(Ca), 1e-4))
        h2 = h + _wrap(ht - ha)
        outs.append(np.stack([L2, C2 * np.cos(h2), C2 * np.sin(h2)], -1))
    if not weights:
        return np.asarray(rgb, float)
    total = np.sum(weights, 0)
    keep = np.clip(1 - total, 0, 1)
    norm = np.maximum(total, 1)
    res = lab * keep[..., None]
    for w, o in zip(weights, outs):
        res = res + o * (w / norm)[..., None]
    return np.clip(oklab_to_rgb(res), 0, 255)


def recolor_hex(hex_color, families):
    return rgb_hex(transfer(hex_rgb(hex_color)[None, :], families)[0])


# --------------------------------------------------------------------------------------------- tasarım ve paletler

def design_dir(no):
    hits = sorted(p for p in COLLECTIONS.glob(f"{int(no):02d}_*") if p.is_dir())
    if not hits:
        raise RecolorError(f"collections/{int(no):02d}_* yok")
    return hits[0]


def load_spec(design):
    path = design / "variants/recolor.json"
    if not path.exists():
        raise RecolorError(f"{rel(path)} yok")
    spec = json.loads(path.read_text())
    problems = []
    if not (THEMES / spec.get("theme", "?") / "theme.json").exists():
        problems.append(f"theme {spec.get('theme')!r} platform/themes altında yok")
    fams = spec.get("families", {})
    for k, f in fams.items():
        try:
            hex_rgb(f.get("anchor"))
        except RecolorError as e:
            problems.append(f"families.{k}: {e}")
    groups = spec.get("groups", {})
    for g, members in groups.items():
        for m in members:
            if m not in fams:
                problems.append(f"groups.{g}: bilinmeyen aile {m!r}")
    for section in ("parts", "print"):
        for name, p in spec.get(section, {}).items():
            if p.get("recolor") not in ("auto", "gpt", "keep"):
                problems.append(f"{section}.{name}.recolor auto | gpt | keep olmalı")
            if p.get("recolor") == "auto" and p.get("group") not in groups:
                problems.append(f"{section}.{name}: auto parçanın grubu {p.get('group')!r} tanımlı değil")
    css = spec.get("css", {})
    for m in css.get("families", []):
        if m not in fams:
            problems.append(f"css.families: bilinmeyen aile {m!r}")
    for tok, fam in css.get("tokens", {}).items():
        if fam is not None and fam not in fams:
            problems.append(f"css.tokens.{tok}: bilinmeyen aile {fam!r}")
    if problems:
        raise RecolorError("recolor.json: " + "; ".join(problems))
    return spec


def load_palettes(design, only=None):
    out = []
    for p in sorted((design / "variants").glob("V*/palette.json")):
        pal = json.loads(p.read_text())
        pal["_dir"] = p.parent
        if only and pal.get("id") != only and p.parent.name != only:
            continue
        problems = []
        if pal.get("id") != p.parent.name:
            problems.append(f"id {pal.get('id')!r} klasör adı ({p.parent.name}) olmalı")
        if not SLUG_RE.match(str(pal.get("slug", ""))):
            problems.append("slug a-z, 0-9, - olmalı")
        if not str(pal.get("name", "")).strip() or len(pal.get("name", "")) > 40:
            problems.append("name gerekli (≤ 40)")
        for r in ROLES:
            try:
                hex_rgb(pal.get(r))
            except RecolorError:
                problems.append(f"{r} #RRGGBB olmalı")
        sw = pal.get("swatch", [])
        if not (1 <= len(sw) <= 4) or not all(isinstance(c, str) and HEX_RE.match(c) for c in sw):
            problems.append("swatch 1–4 renk")
        if pal.get("status", "coming") not in ("coming", "live"):
            problems.append("status coming | live")
        if problems:
            raise RecolorError(f"{rel(p)}: " + "; ".join(problems))
        out.append(pal)
    if only and not out:
        raise RecolorError(f"varyant {only} bulunamadı")
    return out


def family_map(spec, pal, members, roles=None):
    """Grubun aileleri → transfer listesi (paletin families alanı: aile → rol | #hex | {role, lk} | null). roles: CSS'te
    (recolor.json css.roles) bir ailenin paletteki hedefi yerine kullanılacak rol (ör. zarf rengi yerine koyu "deep")."""
    targets = dict(pal.get("families", {}))
    for fam, role in (roles or {}).items():
        if targets.get(fam) is not None:
            targets[fam] = role
    out = []
    for name in members:
        f = spec["families"][name]
        t = targets.get(name, None)
        lk = f.get("lk", 1.0)
        if isinstance(t, dict):
            lk = t.get("lk", lk)
            t = t.get("role")
        if t is None:
            target = None
        else:
            target = rgb_to_oklab(hex_rgb(pal[t] if t in ROLES else t))
        fam = {"anchor": rgb_to_oklab(hex_rgb(f["anchor"])), "target": target, "sigma": f.get("sigma", 20), "lk": lk}
        for k in ("cmin", "cfull", "cmax", "cfade"):
            if k in f:
                fam[k] = f[k]
        out.append(fam)
    return out


# --------------------------------------------------------------------------------------------- görseller

def part_key(filename):
    """env_body-880.webp → env_body; og-1200x630.jpg → og-1200x630; favicon.png → favicon."""
    stem = Path(filename).stem
    m = re.match(r"^(.*)-(\d+)$", stem)
    return m.group(1) if m else stem


def theme_images(theme):
    img = THEMES / theme / "img"
    return sorted(p for p in img.iterdir() if p.is_file() and p.suffix.lower() in IMG_EXT and not p.name.startswith("mask_"))


def recolor_image(path, fams):
    im = Image.open(path)
    rgba = np.array(im.convert("RGBA")).astype(float)
    out = transfer(rgba[..., :3], fams)
    return Image.fromarray(np.dstack([out, rgba[..., 3]]).round().astype(np.uint8), "RGBA"), im.mode


def unchanged(src, im, tol=2):
    """Boyama sonucu asılla aynı mı (paletin bu parçanın bütün ailelerini null bıraktığı durum): kopya yazılmaz."""
    a = np.asarray(src.convert("RGBA"), np.int16)
    b = np.asarray(im.convert("RGBA"), np.int16)
    return a.shape == b.shape and int(np.abs(a - b).max()) <= tol


def save_like(im, mode, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    ext = path.suffix.lower()
    if ext == ".webp":
        im.save(path, "WEBP", quality=WEBP_Q, method=WEBP_METHOD)
    elif ext in (".jpg", ".jpeg"):
        im.convert("RGB").save(path, "JPEG", quality=86, optimize=True, progressive=True)
    else:
        (im if mode == "RGBA" or "A" in mode else im.convert("RGB")).save(path, "PNG", optimize=True)


# --------------------------------------------------------------------------------------------- CSS

COLOR_RE = re.compile(r"#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)")
ROOT_BLOCK_RE = re.compile(r":root\s*\{[^}]*\}")
COMMENT_RE = re.compile(r"/\*.*?\*/", re.S)
TOKEN_DEF_RE = re.compile(r"(--[a-z0-9-]+)\s*:\s*([^;}]+)")
CHANNEL_NOTE = "/* G153 palette channels (tools/recolor_parts.py) */"
CHANNEL_DEF_RE = re.compile(r"(--c-[0-9a-f]{6}):\s*(\d+ \d+ \d+);")
CHANNEL_USE_RE = re.compile(r"rgb\(var\((--c-[0-9a-f]{6})\)(?:\s*/\s*([\d.]+))?\)")


def inline_unused_channels(css, used):
    """Kanal token'larından hiçbir paletin değiştirmediklerini yeniden sabit renge çevirir (site.css bütçesi, docs/11 §6).
    used: variants.css'te değişen token adları."""
    defs = dict(CHANNEL_DEF_RE.findall(css))

    def lit(m):
        name, a = m.group(1), m.group(2)
        if name in used or name not in defs:
            return m.group(0)
        # the shortest exact-enough literal: #rrggbb, or #rrggbbaa (alpha in 1/255 steps)
        return f"#{name[4:]}" if a is None else f"#{name[4:]}{round(float(a) * 255):02x}"

    out = CHANNEL_USE_RE.sub(lit, css)
    for name, v in defs.items():
        if name not in used and f"var({name})" not in out:
            out = out.replace(f"{name}:{v};", "").replace(f"{name}: {v};", "")
    out = re.sub(r"\n  " + re.escape(CHANNEL_NOTE) + r"\n  \n", "\n", out)
    return out


def parse_color(lit):
    """CSS renk yazımı → (rgb dizisi, alfa) ya da None."""
    s = lit.strip()
    if s.startswith("#"):
        h = s[1:]
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float), a
    m = re.match(r"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)", s)
    if m:
        return np.array([float(m.group(i)) for i in (1, 2, 3)]), float(m.group(4)) if m.group(4) else 1.0
    m = re.match(r"^(\d+)\s+(\d+)\s+(\d+)$", s)  # kanal token'ı "102 27 39"
    if m:
        return np.array([float(m.group(i)) for i in (1, 2, 3)]), 1.0
    return None


def _neutral(rgb):
    return float(np.ptp(rgb)) < 6


def tokenize_css(css, inject=True):
    """:root dışındaki sabit renkleri rgb(var(--rgb-<hex>) / a) yapar; yeni token'lar ilk :root bloğuna eklenir.
    Gri tonlar (siyah/beyaz gölgeler) olduğu gibi kalır. Dönüş: (yeni css, {token: 'r g b'})."""
    roots = [m.span() for m in ROOT_BLOCK_RE.finditer(css)]
    comments = [m.span() for m in COMMENT_RE.finditer(css)]
    inside = lambda i, spans: any(a <= i < b for a, b in spans)  # noqa: E731
    tokens = {}
    out, last = [], 0
    for m in COLOR_RE.finditer(css):
        if inside(m.start(), roots) or inside(m.start(), comments):
            continue
        parsed = parse_color(m.group(0))
        if parsed is None or _neutral(parsed[0]):
            continue
        rgb, a = parsed
        name = f"--c-{rgb_hex(rgb)[1:].lower()}"
        tokens[name] = " ".join(str(int(v)) for v in rgb)
        alpha = "" if a >= 0.999 else "/0" if a <= 0 else "/" + f"{round(a, 3):g}".lstrip("0")
        out.append(css[last:m.start()])
        out.append(f"rgb(var({name}){alpha})")
        last = m.end()
    out.append(css[last:])
    new = "".join(out)
    if tokens and inject:
        m = ROOT_BLOCK_RE.search(new)
        if not m:
            raise RecolorError("CSS'te :root bloğu yok")
        existing = set(re.findall(r"(--c-[0-9a-f]{6})\s*:", m.group(0)))
        add = "".join(f"{k}:{v};" for k, v in sorted(tokens.items()) if k not in existing)
        if add:
            block = m.group(0)
            body = block[:-1].rstrip()
            sep = "" if body.endswith(";") or body.endswith("{") else ";"
            block2 = f"{body}{sep}\n  {CHANNEL_NOTE}\n  {add}\n}}"
            new = new[:m.start()] + block2 + new[m.end():]
    return new, tokens


def root_tokens(css):
    """İlk :root bloğundaki renk token'ları: {ad: (değer yazımı, rgb, alfa)}."""
    m = ROOT_BLOCK_RE.search(COMMENT_RE.sub("", css))
    out = {}
    if not m:
        return out
    for name, value in TOKEN_DEF_RE.findall(m.group(0)):
        p = parse_color(value)
        if p is not None:
            out[name] = (value.strip(), p[0], p[1])
    return out


def css_value(orig, rgb, alpha):
    if re.match(r"^\d+\s+\d+\s+\d+$", orig):
        return " ".join(str(int(round(float(v)))) for v in np.clip(rgb, 0, 255))
    if alpha < 0.999:
        return f"rgba({', '.join(str(int(round(float(v)))) for v in np.clip(rgb, 0, 255))}, {round(alpha, 3):g})"
    return rgb_hex(rgb)


def fix_contrast(text_rgb, ground_rgb, need):
    """Metin rengini OKLab L'de adım adım zeminden uzaklaştırır, ratio ≥ need olana dek. (rgb, ayarlandı mı)."""
    if contrast(text_rgb, ground_rgb) >= need:
        return text_rgb, False
    lab = rgb_to_oklab(text_rgb)
    darker = luminance(ground_rgb) > 0.18
    for _ in range(60):
        lab = lab + np.array([-0.01 if darker else 0.01, 0, 0])
        cand = oklab_to_rgb(lab)
        if contrast(cand, ground_rgb) >= need:
            return cand, True
    return oklab_to_rgb(lab), True


def variant_tokens(spec, pal, css_files):
    """Bir paletin token değerleri {ad: değer} + kontrast ayarları listesi."""
    css_spec = spec.get("css", {})
    default_members = css_spec.get("families", list(spec["families"]))
    per = css_spec.get("tokens", {})
    skip = set(css_spec.get("keep", []))
    base = {}
    for css in css_files:
        for k, v in root_tokens(css).items():
            base.setdefault(k, v)
    values, rgbs = {}, {}
    for name, (orig, rgb, alpha) in base.items():
        rgbs[name] = rgb
        if name in skip:
            continue
        members = [per[name]] if name in per and per[name] is not None else ([] if name in per else default_members)
        new = transfer(rgb[None, :], family_map(spec, pal, members, css_spec.get("roles")))[0] if members else rgb
        if np.max(np.abs(new - rgb)) < 5:  # below ~2 % of a channel: invisible, the token stays the original
            continue
        rgbs[name] = new
        values[name] = css_value(orig, new, alpha)
    fixes = []
    for text, ground, need in css_spec.get("contrast", []):
        if text not in rgbs or ground not in rgbs:
            raise RecolorError(f"css.contrast: {text} / {ground} :root'ta yok")
        fixed, changed = fix_contrast(rgbs[text], rgbs[ground], need)
        if changed:
            orig = base[text][0]
            values[text] = css_value(orig, fixed, base[text][2])
            rgbs[text] = fixed
            fixes.append(f"{text} → {values[text]} ({contrast(fixed, rgbs[ground]):.2f}:1 on {ground})")
    return values, fixes, rgbs


# --------------------------------------------------------------------------------------------- inceleme sayfası

def contact_sheet(rows, tokens, title, path, cell=220):
    """rows: [(ad, durum, asıl PIL, varyant PIL | None)]; tokens: [(ad, rgb asıl, rgb varyant)]."""
    cols = 4  # 2 parça yan yana: asıl | varyant
    n = len(rows)
    rh = cell + 22
    sw_rows = (len(tokens) + 7) // 8
    W = cols * cell
    H = 40 + ((n + 1) // 2) * rh + sw_rows * 46 + 10
    sheet = Image.new("RGB", (W, H), (236, 233, 228))
    d = ImageDraw.Draw(sheet)
    d.text((10, 12), title, fill=(30, 30, 30))
    checker = Image.new("RGBA", (cell - 8, cell - 8), (214, 210, 204, 255))
    for i, (name, status, a, b) in enumerate(rows):
        x0 = (i % 2) * 2 * cell
        y0 = 40 + (i // 2) * rh
        for j, im in enumerate([a, b if b is not None else a]):
            t = im.convert("RGBA").copy()
            t.thumbnail((cell - 8, cell - 8))
            bg = checker.copy()
            bg.alpha_composite(t, ((bg.width - t.width) // 2, (bg.height - t.height) // 2))
            sheet.paste(bg.convert("RGB"), (x0 + j * cell + 4, y0 + 4))
        colour = {"auto": (30, 110, 60), "gpt": (170, 60, 30), "keep": (90, 90, 90)}[status]
        d.text((x0 + 6, y0 + cell + 4), f"{name} · {status}{' (original until GPT)' if status == 'gpt' else ''}", fill=colour)
    y = 40 + ((n + 1) // 2) * rh
    for k, (name, before, after) in enumerate(tokens):
        x = (k % 8) * (W // 8)
        yy = y + (k // 8) * 46
        d.rectangle([x + 6, yy, x + 26, yy + 20], fill=tuple(int(v) for v in before))
        d.rectangle([x + 26, yy, x + 46, yy + 20], fill=tuple(int(v) for v in after))
        d.text((x + 6, yy + 24), name[:16], fill=(40, 40, 40))
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path, "JPEG", quality=84, optimize=True)


# --------------------------------------------------------------------------------------------- komutlar

def cmd_tokenize(theme, files=("site.css", "thank-you.css"), quiet=False):
    """site.css'in :root'u bütün dosyaların token'larını taşır (thank-you.css site.css ile birlikte yüklenir)."""
    total = {}
    for f in files[1:]:
        p = THEMES / theme / f
        if p.exists():
            new, toks = tokenize_css(p.read_text(), inject=False)
            total.update(toks)
            if new != p.read_text():
                p.write_text(new)
    main_css = THEMES / theme / files[0]
    new, toks = tokenize_css(main_css.read_text())
    total.update(toks)
    missing = {k: v for k, v in total.items() if k not in toks and f"{k}:" not in new}
    if missing:
        m = ROOT_BLOCK_RE.search(new)
        add = "".join(f"  {k}: {v};\n" for k, v in sorted(missing.items()))
        new = new[:m.end() - 1].rstrip() + "\n" + add + "}" + new[m.end():]
    if new != main_css.read_text():
        main_css.write_text(new)
    if not quiet:
        print(f"{theme}: {len(total)} sabit renk token'a taşındı", file=sys.stderr)
    return total


def manifest_problems(spec):
    """Tema img/ klasöründeki her parça manifestte mi; manifestteki her parça var mı; baskı parçaları var mı."""
    theme = spec["theme"]
    keys = {part_key(p.name) for p in theme_images(theme)}
    listed = set(spec.get("parts", {}))
    problems = [f"parça manifestte yok: {k}" for k in sorted(keys - listed)]
    problems += [f"manifestteki parça img/'de yok: {k}" for k in sorted(listed - keys)]
    for name in spec.get("print", {}):
        if not (PRINT / theme / f"{name}.webp").exists():
            problems.append(f"baskı parçası yok: public/print/{theme}/{name}.webp")
    return problems


def build(design, only=None, sheet=True, write=True, images=True):
    """images=False: yalnız token'lar, variants.css ve theme.json (görseller ve baskı parçaları olduğu gibi kalır)."""
    spec = load_spec(design)
    problems = manifest_problems(spec)
    if problems:
        raise RecolorError("; ".join(problems))
    theme = spec["theme"]
    tdir = THEMES / theme
    files = tuple(spec.get("css", {}).get("files", ["site.css"]))
    if write:
        # önceki build'in variants.css :root'una taşıdığı kanallar site.css'e döner, sabit renkler kanal token'ı olur;
        # sonda (write_variants_css) değişmeyenler yeniden sabitlenir, kalanlar variants.css :root'una taşınır
        restore_channels(theme, files[0])
        cmd_tokenize(theme, files, quiet=True)
    css_files = [(tdir / f).read_text() for f in spec.get("css", {}).get("files", ["site.css"]) if (tdir / f).exists()]
    if (tdir / "variants.css").exists():
        css_files.append((tdir / "variants.css").read_text())  # its :root = the channel tokens (write_variants_css)
    pals = load_palettes(design, only)
    report = {}
    blocks = {}
    for pal in pals:
        slug = pal["slug"]
        rows = []
        written = []
        for path in (theme_images(theme) if images else []):
            key = part_key(path.name)
            p = spec["parts"][key]
            status = part_status(pal, key, p)
            src = Image.open(path)
            if status == "auto":
                fams = family_map(spec, pal, spec["groups"][p["group"]])
                im, mode = recolor_image(path, fams)
                dst = tdir / "img/variants" / slug / path.name
                if unchanged(src, im):  # every family of this part kept in this palette: the original serves (G157)
                    if write and dst.exists():
                        dst.unlink()
                else:
                    if write:
                        save_like(im, mode, dst)
                    written.append(path.name)
            else:
                im = None
            if sheet and (not rows or rows[-1][0] != key):
                rows.append((key, status, src, im))
        art = [] if images else list(existing_print(theme, slug).get("art", []))
        for name, p in (spec.get("print", {}) if images else {}).items():
            if part_status(pal, f"print:{name}", p) != "auto":
                if sheet and part_status(pal, f"print:{name}", p) == "gpt":
                    rows.append((f"print:{name}", "gpt", Image.open(PRINT / theme / f"{name}.webp"), None))
                continue
            src = PRINT / theme / f"{name}.webp"
            im, mode = recolor_image(src, family_map(spec, pal, spec["groups"][p["group"]]))
            dst = PRINT / theme / "variants" / slug / f"{name}.webp"
            if unchanged(Image.open(src), im):
                if write and dst.exists():
                    dst.unlink()
                continue
            if write:
                save_like(im, mode, dst)
            art.append(name)
            if sheet:
                rows.append((f"print:{name}", "auto", Image.open(src), im))
        values, fixes, rgbs = variant_tokens(spec, pal, css_files)
        blocks[slug] = (pal, values)
        pc = spec.get("print_colors", {})
        print_spec = {"art": art}
        paper = hex_rgb(pc.get("paper", "#FFFFFF"))
        for k in ("ink", "accent"):
            if k in pc:
                fams = family_map(spec, pal, spec.get("css", {}).get("families", list(spec["families"])), spec.get("css", {}).get("roles"))
                new = transfer(hex_rgb(pc[k])[None, :], fams)[0]
                new, _ = fix_contrast(new, paper, 4.5)
                print_spec[k] = rgb_hex(new)
        pal["_print"] = print_spec
        if sheet and images:
            base_tokens = {}
            for css in css_files:
                for k, v in root_tokens(css).items():
                    base_tokens.setdefault(k, v[1])
            toks = [(k, base_tokens[k], rgbs[k]) for k in base_tokens if k in values]
            contact_sheet(rows, toks, f"{design.name} · {pal['id']} · {pal['name']} ({pal.get('status', 'coming')})",
                          pal["_dir"] / "review/contact_sheet.jpg")
        report[pal["id"]] = {"slug": slug, "images": len(written), "print": art, "tokens": len(values), "contrast_fixes": fixes,
                             "gpt": sorted([k for k, p in spec["parts"].items() if part_status(pal, k, p) == "gpt"]
                                           + [f"print:{k}" for k, p in spec.get("print", {}).items()
                                              if part_status(pal, f"print:{k}", p) == "gpt"])}
    if write and not only:
        write_variants_css(spec, design, blocks)
        write_theme_json(spec, design, pals)
    elif write and only:
        # tek varyant: diğer blokları koru (hepsini yeniden hesaplamak ucuz değil ama tutarlı): tamamını yeniden yaz
        allp = load_palettes(design)
        for p in allp:
            if p["slug"] not in blocks:
                blocks[p["slug"]] = (p, variant_tokens(spec, p, css_files)[0])
                p["_print"] = existing_print(spec["theme"], p["slug"])
            else:
                p["_print"] = next(x for x in pals if x["slug"] == p["slug"])["_print"]
        write_variants_css(spec, design, blocks)
        write_theme_json(spec, design, allp)
    return report


def part_status(pal, key, part):
    """G158: palette.json "recolor": {parça | "print:<ad>": auto | gpt | keep} manifestteki durumu o palet için ezer (ör. bir
    palette ayçiçeğiyle aynı tondaki kurdele algoritmayla ayrılamaz → gpt; aynı parça başka palette auto)."""
    status = (pal.get("recolor") or {}).get(key, part["recolor"])
    if status not in ("auto", "gpt", "keep"):
        raise RecolorError(f"{pal.get('id')}: recolor.{key} auto | gpt | keep olmalı")
    if status == "auto" and part.get("group") is None:
        raise RecolorError(f"{pal.get('id')}: recolor.{key} auto ama manifestte grubu yok")
    return status


def existing_print(theme, slug):
    data = json.loads((THEMES / theme / "theme.json").read_text())
    for v in data.get("variants", []):
        if v.get("id") == slug:
            return v.get("print", {"art": []})
    return {"art": []}


def write_variants_css(spec, design, blocks):
    """variants.css = :root'ta kanal token'larının asıl değerleri + her paletin html[data-variant] bloğu. Hiçbir paletin
    değiştirmediği kanallar site.css'te yeniden sabit renk olur; kalan kanal tanımları site.css'ten buraya taşınır
    (site.css bütçesi ≤ 45 KB, docs/11 §6; motor paleti olan temada bu dosyayı her sayfaya bağlar)."""
    used = {k for _, values in blocks.values() for k in values}
    channels = {}
    for f in spec.get("css", {}).get("files", ["site.css"]):
        p = THEMES / spec["theme"] / f
        if not p.exists():
            continue
        css = inline_unused_channels(p.read_text(), used)
        for name, v in CHANNEL_DEF_RE.findall(css):
            channels[name] = v
            css = css.replace(f"{name}:{v};", "").replace(f"{name}: {v};", "")
        css = re.sub(r"\n  " + re.escape(CHANNEL_NOTE) + r"\n  \n", "\n", css)
        css = re.sub(r"\n  " + re.escape(CHANNEL_NOTE) + r"\n", "\n", css)
        if css != p.read_text():
            p.write_text(css)
    lines = [
        "/* G153 — renk paleti varyantları. ÜRETİLİR, elle düzenlenmez:",
        f"   python3 tools/recolor_parts.py build --design {design.name[:2]}",
        f"   (kaynak: collections/{design.name}/variants/*/palette.json + recolor.json).",
        "   :root = asıl paletin kanal token'ları (site.css'teki rgb(var(--c-…)) kullanımları); html[data-variant] blokları",
        "   yalnız paletin değiştirdiği token'lar. */",
        ":root {",
        *[f"  {k}: {v};" for k, v in sorted(channels.items())],
        "}",
    ]
    for slug in sorted(blocks):
        pal, values = blocks[slug]
        lines.append(f'\n/* {pal["id"]} · {pal["name"]} */\nhtml[data-variant="{slug}"] {{')
        lines += [f"  {k}: {v};" for k, v in sorted(values.items())]
        lines.append("}")
    (THEMES / spec["theme"] / "variants.css").write_text("\n".join(lines) + "\n")


def restore_channels(theme, main="site.css"):
    defaults = channel_defaults(theme)
    p = THEMES / theme / main
    css = p.read_text()
    missing = {k: v for k, v in defaults.items() if f"{k}:" not in css and f"var({k})" in css}
    if not missing:
        return
    m = ROOT_BLOCK_RE.search(css)
    add = "".join(f"{k}:{v};" for k, v in sorted(missing.items()))
    css = css[:m.end() - 1].rstrip() + f"\n  {CHANNEL_NOTE}\n  {add}\n}}" + css[m.end():]
    p.write_text(css)


def channel_defaults(theme):
    """variants.css :root'undaki kanal değerleri (build başında site.css'e geri konur ki tokenize/okuma tam olsun)."""
    p = THEMES / theme / "variants.css"
    if not p.exists():
        return {}
    m = ROOT_BLOCK_RE.search(p.read_text())
    return dict(CHANNEL_DEF_RE.findall(m.group(0))) if m else {}


def write_theme_json(spec, design, pals):
    path = THEMES / spec["theme"] / "theme.json"
    data = json.loads(path.read_text())
    old = {v.get("id"): v for v in data.get("variants", [])}
    base_pal = json.loads((design / "palette.json").read_text())
    data["swatch"] = spec.get("swatch") or [base_pal["ivory"], base_pal["primary"], base_pal["gold"]]
    out = []
    for pal in sorted(pals, key=lambda p: p["id"]):
        prev = old.get(pal["slug"], {})
        v = {"id": pal["slug"], "name": pal["name"], "swatch": pal["swatch"],
             "status": prev.get("status", pal.get("status", "coming"))}
        pr = pal.get("_print") or {}
        if pr.get("art") or pr.get("ink") or pr.get("accent"):
            v["print"] = pr
        out.append(v)
    data["variants"] = out
    # alan sırası: variants en sonda (okunur)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def check(design):
    spec = load_spec(design)
    problems = manifest_problems(spec)
    pals = load_palettes(design)
    if len(pals) != 5:
        problems.append(f"{len(pals)} palet (5 olmalı)")
    for pal in pals:
        known = set(spec.get("parts", {})) | {f"print:{k}" for k in spec.get("print", {})}
        for key in (pal.get("recolor") or {}):
            if key not in known:
                problems.append(f"{pal['id']}: recolor.{key} manifestte yok")
    slugs = [p["slug"] for p in pals]
    if len(set(slugs)) != len(slugs):
        problems.append("slug'lar tekrar ediyor")
    theme = json.loads((THEMES / spec["theme"] / "theme.json").read_text())
    declared = {v["id"] for v in theme.get("variants", [])}
    for s in slugs:
        if s not in declared:
            problems.append(f"theme.json'da varyant yok: {s} (build çalıştırılmadı)")
        elif not (THEMES / spec["theme"] / "variants.css").exists() or f'html[data-variant="{s}"]' not in (THEMES / spec["theme"] / "variants.css").read_text():
            problems.append(f"variants.css'te blok yok: {s}")
    return problems


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    t = sub.add_parser("tokenize")
    t.add_argument("--theme", required=True)
    b = sub.add_parser("build")
    b.add_argument("--design", required=True)
    b.add_argument("--variant")
    b.add_argument("--no-sheet", action="store_true")
    b.add_argument("--css-only", action="store_true", help="yalnız variants.css + theme.json (görseller yazılmaz)")
    c = sub.add_parser("check")
    c.add_argument("--design", required=True)
    a = ap.parse_args(argv)
    try:
        if a.cmd == "tokenize":
            cmd_tokenize(a.theme)
            return 0
        design = design_dir(a.design)
        if a.cmd == "build":
            rep = build(design, a.variant, sheet=not a.no_sheet, images=not a.css_only)
            print(json.dumps(rep, ensure_ascii=False, indent=1))
            return 0
        problems = check(design)
        for p in problems:
            print("HATA ", p)
        print(f"{design.name}: {'temiz' if not problems else f'{len(problems)} sorun'}")
        return 1 if problems else 0
    except RecolorError as e:
        print(f"recolor_parts: {e}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
