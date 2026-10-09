"""Kit katman üretici — ham GPT görsellerinden Canva'ya yüklenecek katmanları `kit_map.json`'a göre üretir.

  python3 tools/kit_build.py <kit veya koleksiyon kökü> [--map <kit_map.json>] [--photos <klasör>]

Örnekler:
  python3 tools/kit_build.py collections/02_Dusty_Blue
  python3 tools/kit_build.py collections/02_Dusty_Blue/variants/V02_blush_champagne \
      --map collections/02_Dusty_Blue/kit_map.json

Standart: docs/07_KIT_STANDARDI.md (§3 tasarım 02 tablosu, §6 genel kit_map.json biçimi).

CLI'daki göreli <kök> ve --map yolları repo köküne göredir (kit_check.py gibi).
Yol çözümleme kuralı (haritadaki göreli yollar şu köklere göredir):
  K = CLI'da verilen kit kökü (ör. variants/V02_blush_champagne)
  C = kit_map.json dosyasının bulunduğu klasör (koleksiyon kökü; --map yoksa C = K)
  - `source`  → K'ye göre. Varyant, tasarımın haritasını --map ile kullanır ama KENDİ ham GPT
                dosyalarını okur. Eksik dosyada C'ye geri DÜŞÜLMEZ (yanlış kitin dokusu sessizce
                girmesin); katman atlanır ve uyarı verilir.
  - `shared: true` olan katmanın `source`'u → C'ye göre (ör. tasarım 02'nin ortak fotoğrafları:
                `assets/gpt/photos/moment_1.jpg`). Başka tasarımın fotoğrafı `../02_Dusty_Blue/...`
                gibi yazılabilir; `shared: true` ile C'den çözüldüğü için varyantlarda da çalışır.
  - `--photos DIR` verilirse, kaynağı bir `photos/` klasöründe olan katmanlar DIR/<dosya adı>'ndan okunur.
  - `masks` (vars. `assets/layers`) ve `mask` → C'ye göre. Maskeler dondurulmuştur (V01'in HTML'den
                çıkarılmış katmanları); tasarım 02 için hep `collections/02_Dusty_Blue/assets/layers/`.
  - `out` (vars. `kit_layers`) → K'ye göre.
  - Renk (`color`, `line_color`): `#RRGGBB` ya da `palette.<anahtar>`; palet K/palette.json'dan,
                yoksa C/palette.json'dan okunur.
  Mutlak yollar olduğu gibi kullanılır.

Katman alanları: name (çıktı dosya adı; .jpg → opak, kalite 92), size [w, h] (çıktı tam bu piksel),
source, method, ve isteğe bağlı: mask, shared, rotate (90/180/270, saat yönünde), flip (h/v/hv),
anchor [x, y] (cover kırpma odağı, 0–1; vars. 0.5, 0.5), trim (fit öncesi alfa kutusuna kırp),
pad (fit'te kenar boşluğu, px), tile_scale (doku tekrar ölçeği, vars. 1.0), color, line_color,
background (JPG düzleştirme zemini, vars. #FFFFFF).

Yöntemler (rotate/flip kaynağa, yöntemden önce uygulanır):
  cover              hedef orana `anchor` odaklı kırp + ölçekle
  fit                oranı koru, şeffaf kenarla hedef boyuta sığdır (kırpma yok); `trim`, `pad`
  texture_mask       maskenin alfası + doku (tile) × maskenin parlaklık gölgesi
                     (gölge = maske luminansı / maskenin dolu bölgesindeki ortalama luminans → ort. ≈ 1)
  pattern_mask       maskenin alfası + desen (tile), gölge yok
  tint               fit (ya da `"fit_mode": "cover"`) + gri tona çevirip `color` ile çarparak renklendir
  texture_mask_lines (isteğe bağlı) texture_mask + maskedeki renkli çizgi piksellerini (ör. davetiye
                     çerçevesindeki altın çizgiler) `line_color` (vars. palette.gold) ile yeniden boyar
  Maske yöntemlerinde `color` verilirse doku önce o renge çekilir: doku / doku ortalama luminansı × color
  (kağıt dokusunun damarları korunur, ortalama ton `color` olur; ör. açık kağıttan pembe zarf).

Güvenlik: `collections/*/assets/layers/` altına ve maske klasörüne hiçbir koşulda yazılmaz.
Eksik kaynak/maske → katman atlanır, uyarı basılır, devam edilir; özet yazılır.
Çıkış kodu: 0 (atlanan katman olsa da); harita geçersizse ya da çıktı yolu korunan yerse 2.
Bağımlılık: yalnız Pillow + numpy.
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
METHODS = {"cover", "fit", "texture_mask", "pattern_mask", "tint", "texture_mask_lines"}
MASK_METHODS = {"texture_mask", "pattern_mask", "texture_mask_lines"}
JPG_QUALITY = 92


class MapError(Exception):
    pass


class GuardError(Exception):
    pass


# ---------------------------------------------------------------- yollar ve doğrulama

def resolve(base: Path, p: str) -> Path:
    q = Path(p)
    return (q if q.is_absolute() else base / q).resolve()


def korunan_mu(path: Path) -> bool:
    """collections/<herhangi>/assets/layers/ altı mı?"""
    parts = path.resolve().parts
    for i, part in enumerate(parts):
        if part == "collections" and len(parts) > i + 3 and parts[i + 2:i + 4] == ("assets", "layers"):
            return True
    return False


def yazma_korumasi(path: Path, masks_dir: Path):
    p = path.resolve()
    m = masks_dir.resolve()
    if korunan_mu(p) or p == m or m in p.parents:
        raise GuardError(f"korunan maske klasörüne yazma reddedildi: {p}")


def parse_color(value, palette: dict):
    if value is None:
        return None
    s = str(value)
    if s.startswith("palette."):
        key = s.split(".", 1)[1]
        if key not in palette:
            raise MapError(f"palette.json içinde '{key}' yok")
        s = palette[key]
    s = s.lstrip("#")
    if len(s) != 6:
        raise MapError(f"geçersiz renk: {value}")
    try:
        return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))
    except ValueError as e:
        raise MapError(f"geçersiz renk: {value}") from e


def load_palette(kit: Path, coll: Path) -> dict:
    for d in (kit, coll):
        f = d / "palette.json"
        if f.exists():
            try:
                return json.loads(f.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                raise MapError(f"palette.json okunamadı: {f}: {e}") from e
    return {}


def validate_map(data) -> list:
    if not isinstance(data, dict) or not isinstance(data.get("layers"), list) or not data["layers"]:
        raise MapError("kit_map.json: 'layers' boş olmayan liste olmalı")
    hatalar, adlar = [], set()
    for i, L in enumerate(data["layers"]):
        etiket = f"layers[{i}]"
        if not isinstance(L, dict):
            hatalar.append(f"{etiket}: nesne değil")
            continue
        ad = L.get("name")
        if not isinstance(ad, str) or not ad or "/" in ad or "\\" in ad or ad.startswith("."):
            hatalar.append(f"{etiket}: geçersiz 'name'")
        elif not ad.lower().endswith((".png", ".jpg", ".jpeg")):
            hatalar.append(f"{etiket} {ad}: uzantı .png/.jpg olmalı")
        elif ad in adlar:
            hatalar.append(f"{etiket} {ad}: ad tekrarı")
        else:
            adlar.add(ad)
        etiket = f"{etiket} {ad}"
        sz = L.get("size")
        if not (isinstance(sz, list) and len(sz) == 2 and all(isinstance(v, int) and v > 0 for v in sz)):
            hatalar.append(f"{etiket}: 'size' [w, h] pozitif tamsayı olmalı")
        if not isinstance(L.get("source"), str) or not L.get("source"):
            hatalar.append(f"{etiket}: 'source' yok")
        m = L.get("method")
        if m not in METHODS:
            hatalar.append(f"{etiket}: bilinmeyen method {m!r} ({', '.join(sorted(METHODS))})")
        if m in MASK_METHODS and not isinstance(L.get("mask"), str):
            hatalar.append(f"{etiket}: {m} için 'mask' gerekli")
        if m == "tint" and not L.get("color"):
            hatalar.append(f"{etiket}: tint için 'color' gerekli")
        if L.get("rotate", 0) not in (0, 90, 180, 270):
            hatalar.append(f"{etiket}: rotate 0/90/180/270 olmalı")
        if L.get("flip") not in (None, "h", "v", "hv"):
            hatalar.append(f"{etiket}: flip h/v/hv olmalı")
        an = L.get("anchor")
        if an is not None and not (isinstance(an, list) and len(an) == 2 and all(isinstance(v, (int, float)) and 0 <= v <= 1 for v in an)):
            hatalar.append(f"{etiket}: anchor [x, y] 0–1 olmalı")
        ts = L.get("tile_scale", 1.0)
        if not (isinstance(ts, (int, float)) and ts > 0):
            hatalar.append(f"{etiket}: tile_scale > 0 olmalı")
    if hatalar:
        raise MapError("kit_map.json geçersiz:\n  " + "\n  ".join(hatalar))
    return data["layers"]


# ---------------------------------------------------------------- görüntü işlemleri

def orient(im: Image.Image, L: dict) -> Image.Image:
    flip = L.get("flip") or ""
    if "h" in flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if "v" in flip:
        im = im.transpose(Image.FLIP_TOP_BOTTOM)
    rot = L.get("rotate", 0)  # saat yönünde
    if rot == 90:
        im = im.transpose(Image.ROTATE_270)
    elif rot == 180:
        im = im.transpose(Image.ROTATE_180)
    elif rot == 270:
        im = im.transpose(Image.ROTATE_90)
    return im


def cover(im: Image.Image, size, anchor=(0.5, 0.5)) -> Image.Image:
    tw, th = size
    w, h = im.size
    s = max(tw / w, th / h)
    cw, ch = tw / s, th / s  # kaynakta kırpılacak alan
    ax, ay = anchor
    left = min(max((w - cw) * ax, 0), w - cw)
    top = min(max((h - ch) * ay, 0), h - ch)
    return im.resize((tw, th), Image.LANCZOS, box=(left, top, left + cw, top + ch))


def fit(im: Image.Image, size, pad=0, trim=False) -> Image.Image:
    im = im.convert("RGBA")
    if trim:
        bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
        if bbox:
            im = im.crop(bbox)
    tw, th = size
    iw, ih = max(1, tw - 2 * pad), max(1, th - 2 * pad)
    s = min(iw / im.width, ih / im.height)
    nw, nh = max(1, round(im.width * s)), max(1, round(im.height * s))
    im = im.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    canvas.alpha_composite(im, ((tw - nw) // 2, (th - nh) // 2))
    return canvas


def tile(im: Image.Image, size, scale=1.0) -> np.ndarray:
    im = im.convert("RGB")
    if scale != 1.0:
        im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    a = np.asarray(im, dtype=np.float32)
    tw, th = size
    ry, rx = -(-th // a.shape[0]), -(-tw // a.shape[1])
    return np.tile(a, (ry, rx, 1))[:th, :tw]


def load_mask(path: Path, size) -> np.ndarray:
    m = Image.open(path).convert("RGBA")
    if m.size != tuple(size):
        m = m.resize(tuple(size), Image.LANCZOS)
    return np.asarray(m, dtype=np.float32)


def luminance(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722


def shading(mask: np.ndarray) -> np.ndarray:
    """Maske parlaklığından gölge: dolu bölgede ortalama ≈ 1."""
    lum = luminance(mask[..., :3])
    alpha = mask[..., 3] / 255.0
    dolu = alpha >= 250 / 255
    if dolu.sum() > 0:
        mean = float(lum[dolu].mean())
    else:
        w = alpha.sum()
        mean = float((lum * alpha).sum() / w) if w > 0 else 255.0
    return lum / max(mean, 1e-3)


def colorize(tex: np.ndarray, color) -> np.ndarray:
    """Dokuyu ortalama tonu `color` olacak şekilde renklendir; ışık/damar farkları korunur."""
    lum = luminance(tex)
    return lum[..., None] / max(float(lum.mean()), 1e-3) * np.array(color, np.float32)


def texture_mask(src, mask, size, scale, shade=True, color=None) -> np.ndarray:
    tex = tile(src, size, scale)
    if color is not None:
        tex = colorize(tex, color)
    if shade:
        tex = tex * shading(mask)[..., None]
    out = np.dstack([np.clip(tex, 0, 255), mask[..., 3]])
    return out


def recolor_lines(out: np.ndarray, mask: np.ndarray, color) -> np.ndarray:
    """Maskede kağıttan belirgin renkli (yüksek kroma) çizgi piksellerini `color` ile boya."""
    rgb = mask[..., :3]
    chroma = rgb.max(-1) - rgb.min(-1)
    dolu = mask[..., 3] >= 250
    if dolu.sum() == 0:
        return out
    base = float(np.median(chroma[dolu]))
    peak = float(np.percentile(chroma[dolu], 99.9))
    if peak - base < 15:  # çizgi yok
        return out
    t = np.clip((chroma - base - 6) / max(peak - base - 6, 1), 0, 1)[..., None]
    out = out.copy()
    out[..., :3] = out[..., :3] * (1 - t) + np.array(color, np.float32) * t
    return out


def tint(im: Image.Image, color) -> Image.Image:
    im = im.convert("RGBA")
    a = np.asarray(im, dtype=np.float32)
    lum = luminance(a[..., :3]) / 255.0
    rgb = lum[..., None] * np.array(color, np.float32)
    return Image.fromarray(np.dstack([np.clip(rgb, 0, 255), a[..., 3]]).astype(np.uint8), "RGBA")


def save(im: Image.Image, path: Path, background=(255, 255, 255)):
    if path.suffix.lower() in (".jpg", ".jpeg"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, background + (255,))
        bg.alpha_composite(im)
        bg.convert("RGB").save(path, "JPEG", quality=JPG_QUALITY)
    else:
        im.convert("RGBA").save(path, "PNG", optimize=True)


# ---------------------------------------------------------------- ana akış

def build_layer(L, src_path: Path, mask_path, palette) -> Image.Image:
    size = tuple(L["size"])
    src = orient(Image.open(src_path), L)
    src.load()
    m = L["method"]
    if m == "cover":
        im = cover(src.convert("RGBA"), size, tuple(L.get("anchor", (0.5, 0.5))))
    elif m == "fit":
        im = fit(src, size, int(L.get("pad", 0)), bool(L.get("trim")))
    elif m == "tint":
        base = cover(src.convert("RGBA"), size, tuple(L.get("anchor", (0.5, 0.5)))) if L.get("fit_mode") == "cover" \
            else fit(src, size, int(L.get("pad", 0)), bool(L.get("trim")))
        im = tint(base, parse_color(L["color"], palette))
    else:
        mask = load_mask(mask_path, size)
        arr = texture_mask(src, mask, size, float(L.get("tile_scale", 1.0)), shade=(m != "pattern_mask"),
                           color=parse_color(L.get("color"), palette))
        if m == "texture_mask_lines":
            arr = recolor_lines(arr, mask, parse_color(L.get("line_color", "palette.gold"), palette))
        im = Image.fromarray(arr.round().astype(np.uint8), "RGBA")
    if im.size != size:  # güvence: çıktı tam ölçü
        im = im.resize(size, Image.LANCZOS)
    return im


def run(kit: Path, map_path: Path, photos=None) -> int:
    kit = kit.resolve()
    map_path = map_path.resolve()
    coll = map_path.parent
    try:
        data = json.loads(map_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"HATA: kit_map.json yok: {map_path}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as e:
        print(f"HATA: kit_map.json okunamadı: {e}", file=sys.stderr)
        return 2
    try:
        layers = validate_map(data)
        palette = load_palette(kit, coll)
        masks_dir = resolve(coll, data.get("masks", "assets/layers"))
        out_dir = resolve(kit, data.get("out", "kit_layers"))
        yazma_korumasi(out_dir, masks_dir)
    except (MapError, GuardError) as e:
        print(f"HATA: {e}", file=sys.stderr)
        return 2

    print(f"kit kökü : {kit}\nharita   : {map_path}\nmaskeler : {masks_dir}\nçıktı    : {out_dir}\n")
    uretilen, uyarilar = [], []
    for L in layers:
        name = L["name"]
        if photos and Path(L["source"]).parent.name == "photos":
            src_path = resolve(Path(photos).resolve(), Path(L["source"]).name)
        else:
            src_path = resolve(coll if L.get("shared") else kit, L["source"])
        mask_path = resolve(masks_dir, L["mask"]) if L["method"] in MASK_METHODS else None
        if not src_path.exists():
            uyarilar.append(f"{name}: kaynak yok → {src_path}")
            print(f"ATLANDI {name}  — kaynak yok: {src_path}")
            continue
        if mask_path is not None and not mask_path.exists():
            uyarilar.append(f"{name}: maske yok → {mask_path}")
            print(f"ATLANDI {name}  — maske yok: {mask_path}")
            continue
        try:
            im = build_layer(L, src_path, mask_path, palette)
        except MapError as e:
            print(f"HATA: {name}: {e}", file=sys.stderr)
            return 2
        except Exception as e:  # noqa: BLE001 — bozuk görsel: atla, devam et
            uyarilar.append(f"{name}: işlenemedi ({e})")
            print(f"ATLANDI {name}  — işlenemedi: {e}")
            continue
        out_path = out_dir / name
        try:
            yazma_korumasi(out_path, masks_dir)
        except GuardError as e:
            print(f"HATA: {e}", file=sys.stderr)
            return 2
        out_dir.mkdir(parents=True, exist_ok=True)
        bg = parse_color(L.get("background", "#FFFFFF"), palette)
        save(im, out_path, bg)
        uretilen.append(name)
        print(f"ÜRETİLDİ {name}  {im.size[0]}×{im.size[1]}  ({L['method']})")

    print(f"\nÖzet: {len(uretilen)}/{len(layers)} katman üretildi, {len(uyarilar)} atlandı.")
    if uyarilar:
        print("Uyarılar:")
        for u in uyarilar:
            print(f"  - {u}")
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("kok", help="kit veya koleksiyon kökü, ör. collections/02_Dusty_Blue")
    ap.add_argument("--map", help="kit_map.json yolu (vars. <kök>/kit_map.json)")
    ap.add_argument("--photos", help="ortak fotoğraf klasörü (photos/ kaynaklı katmanlar buradan okunur)")
    a = ap.parse_args()
    kit = Path(a.kok) if Path(a.kok).is_absolute() else ROOT / a.kok
    map_path = (Path(a.map) if Path(a.map).is_absolute() else ROOT / a.map) if a.map else kit / "kit_map.json"
    sys.exit(run(kit, map_path, a.photos))


if __name__ == "__main__":
    main()
