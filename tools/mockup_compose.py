"""Yeşil ekran mockup birleştirici + Etsy ilan görseli şablonları.

  python3 tools/mockup_compose.py <mockup.png> <tasarım.png|jpg> <çıktı.png>
          [--mode cover|fit|stretch] [--tol 40] [--feather 1.5] [--bg #FFFFFF] [--json]

  python3 tools/mockup_compose.py render <palette.json> <çıktı_klasörü>
          [--only whats_included how_it_works edit_in_canva] [--shop "[PLACEHOLDER: shop name]"] [--no-fonts]

Birleştirme (yalnız Pillow + numpy):
  1. #00FF00 (±tol) pikselleri maskelenir; en büyük bağlı bölge (8-komşuluk) seçilir — küçük yeşil lekeler atlanır.
  2. Bölgenin sınır noktalarından 4 köşe: köşegen uçlarıyla başlangıç → içe çizilen en büyük dörtgen →
     her kenara doğru (total least squares) uydurulup kesiştirilir. Yuvarlak köşeli ekranlarda sanal köşe
     bulunur; hafif perspektif ve küçük dönmeler sorun değildir.
  3. Tasarım homografi ile dörtgene çarpıtılır (bilineer). cover: dörtgen oranına kırpar (varsayılan),
     fit: zemin rengiyle doldurup sığdırır, stretch: oranı bozar.
  4. Alfa = yeşil bölge + kenardaki yarı yeşil (anti-alias) pikseller; `--feather` px yumuşatılır.
  5. Yeşil taşması: bölge çevresindeki halkada G kanalı max(R, B)'ye kırpılır.
Çıkış kodu: 0 tamam, 1 yeşil bölge bulunamadı / girdi hatası, 2 kullanım hatası.

`render`: tools/listing_templates/*.html şablonlarını palette.json renkleriyle 2000×2000 PNG'ye çevirir
(Playwright Chromium; tools/md_to_pdf.py'deki font indirici ve çalıştırıcı kullanılır). Fontlar çalışma
anında Google Fonts'tan geçici klasöre iner; repoya font girmez.
"""
import argparse
import json
import re
import shutil
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

SABLON_DIR = Path(__file__).resolve().parent / "listing_templates"
SABLONLAR = ["whats_included", "how_it_works", "edit_in_canva"]


# ----------------------------------------------------------------------------- maske

def yesil_maske(rgb: np.ndarray, tol: int = 40) -> np.ndarray:
    """#00FF00 (±tol) ya da yeşil baskın piksel (G − max(R,B) ≥ 150). GPT'nin "düz yeşili" ≈ (3, 252, 45):
    B kanalı ±40'ı aşabildiği için baskınlık testi de kabul edilir (parts_prep.yesil_baskin ile aynı eşik)."""
    r, g, b = (rgb[..., i].astype(np.int16) for i in range(3))
    return ((r <= tol) & (g >= 255 - tol) & (b <= tol)) | ((g - np.maximum(r, b) >= 150) & (g >= 150))


def en_buyuk_bolge(maske: np.ndarray) -> np.ndarray:
    """8-komşulukta en büyük bağlı bölge. Satır koşuları + union-find (scipy gerekmez)."""
    h, w = maske.shape
    kosular = []  # (y, x0, x1) x1 dahil değil
    satir_bas = []
    for y in range(h):
        satir = maske[y]
        satir_bas.append(len(kosular))
        if not satir.any():
            continue
        d = np.diff(np.concatenate(([0], satir.view(np.int8), [0])))
        bas, son = np.flatnonzero(d == 1), np.flatnonzero(d == -1)
        kosular.extend((y, int(a), int(b)) for a, b in zip(bas, son))
    satir_bas.append(len(kosular))
    if not kosular:
        return np.zeros_like(maske)
    ebeveyn = list(range(len(kosular)))

    def bul(i):
        while ebeveyn[i] != i:
            ebeveyn[i] = ebeveyn[ebeveyn[i]]
            i = ebeveyn[i]
        return i

    for y in range(1, h):
        ust = range(satir_bas[y - 1], satir_bas[y])
        alt = range(satir_bas[y], satir_bas[y + 1])
        if not ust or not alt:
            continue
        j = ust.start
        for i in alt:
            _, a0, a1 = kosular[i]
            while j < ust.stop and kosular[j][2] < a0:  # üst koşu tamamen solda (8-komşu: x1 >= a0 değmez)
                j += 1
            k = j
            while k < ust.stop and kosular[k][1] <= a1:
                ri, rk = bul(i), bul(k)
                if ri != rk:
                    ebeveyn[ri] = rk
                k += 1
    boyut = {}
    for i, (_, a, b) in enumerate(kosular):
        r = bul(i)
        boyut[r] = boyut.get(r, 0) + (b - a)
    kazanan = max(boyut, key=boyut.get)
    out = np.zeros_like(maske)
    for i, (y, a, b) in enumerate(kosular):
        if bul(i) == kazanan:
            out[y, a:b] = True
    return out


# ----------------------------------------------------------------------------- köşeler

def _alan(q: np.ndarray) -> float:
    x, y = q[:, 0], q[:, 1]
    return 0.5 * abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))


def _gövde(p: np.ndarray) -> np.ndarray:
    """Andrew monotone chain dışbükey gövde (saat yönünün tersi, görüntü koordinatında)."""
    p = np.unique(p, axis=0)
    if len(p) < 3:
        return p
    p = p[np.lexsort((p[:, 1], p[:, 0]))]

    def zincir(nok):
        z = []
        for q in nok:
            while len(z) >= 2 and (z[-1][0] - z[-2][0]) * (q[1] - z[-2][1]) - (z[-1][1] - z[-2][1]) * (q[0] - z[-2][0]) <= 0:
                z.pop()
            z.append(tuple(q))
        return z

    alt, ust = zincir(p), zincir(p[::-1])
    return np.array(alt[:-1] + ust[:-1], dtype=np.float64)


def sinir_noktalari(bolge: np.ndarray) -> np.ndarray:
    """Satır ve sütun uç noktaları, piksel kenarı koordinatında (x, y)."""
    h, w = bolge.shape
    nok = []
    sat = np.flatnonzero(bolge.any(1))
    sol = np.argmax(bolge[sat], axis=1)
    sag = w - np.argmax(bolge[sat, ::-1], axis=1)
    nok += [np.stack([sol, sat + 0.5], 1), np.stack([sag, sat + 0.5], 1)]
    sut = np.flatnonzero(bolge.any(0))
    ust = np.argmax(bolge[:, sut], axis=0)
    alt = h - np.argmax(bolge[::-1, sut], axis=0)
    nok += [np.stack([sut + 0.5, ust], 1), np.stack([sut + 0.5, alt], 1)]
    return np.concatenate(nok).astype(np.float64)


def _dogru(p: np.ndarray):
    """Total least squares doğru: (nokta, yön)."""
    c = p.mean(axis=0)
    _, _, vt = np.linalg.svd(p - c)
    return c, vt[0]


def _kesis(d1, d2):
    (c1, v1), (c2, v2) = d1, d2
    a = np.array([v1, -v2]).T
    if abs(np.linalg.det(a)) < 1e-9:
        return None
    t = np.linalg.solve(a, c2 - c1)
    return c1 + t[0] * v1


def dort_kose(bolge: np.ndarray) -> np.ndarray:
    """Sol-üst, sağ-üst, sağ-alt, sol-alt sırasıyla 4 köşe (x, y) — piksel kenarı koordinatında."""
    nok = sinir_noktalari(bolge)
    gov = _gövde(nok)
    s, d = gov.sum(1), gov[:, 0] - gov[:, 1]
    idx = [int(np.argmin(s)), int(np.argmax(d)), int(np.argmax(s)), int(np.argmin(d))]
    # içe çizilen en büyük dörtgen: her köşeyi gövde köşeleri arasında yerel olarak iyileştir
    for _ in range(10):
        degisti = False
        for k in range(4):
            en_iyi, en_alan = idx[k], _alan(gov[idx])
            for c in range(len(gov)):
                dene = idx.copy()
                dene[k] = c
                a = _alan(gov[dene])
                if a > en_alan + 1e-6:
                    en_iyi, en_alan = c, a
            if en_iyi != idx[k]:
                idx[k], degisti = en_iyi, True
        if not degisti:
            break
    q0 = q = gov[idx]
    boy = np.sqrt(_alan(q0))
    # kenar doğruları: her kenarın orta %70'indeki sınır noktalarına doğru uydur, kesiştir; toleransı
    # daraltarak yinele (yuvarlak/kesik köşede ilk dörtgenin kenarı gerçek kenardan içeride kalır)
    for oran in (0.12, 0.04, 0.012):
        tol = max(3.0, oran * boy)
        dogrular = []
        for k in range(4):
            a, b = q[k], q[(k + 1) % 4]
            v = b - a
            L = np.linalg.norm(v)
            if L < 1:
                return q0
            u = v / L
            n = np.array([-u[1], u[0]])
            t = (nok - a) @ u
            mesafe = np.abs((nok - a) @ n)
            sec = (t > 0.15 * L) & (t < 0.85 * L) & (mesafe < tol)
            dogrular.append(_dogru(nok[sec]) if sec.sum() >= 4 else (a, u))
        out = []
        for k in range(4):
            p = _kesis(dogrular[k - 1], dogrular[k])
            out.append(p if p is not None and np.linalg.norm(p - q0[k]) < 0.25 * boy else q[k])
        q = np.array(out)
    return q  # idx sırası korunur: TL, TR, BR, BL


# ----------------------------------------------------------------------------- homografi

def homografi(kaynak: np.ndarray, hedef: np.ndarray) -> np.ndarray:
    """kaynak[i] → hedef[i] eşleyen 3×3 matris (DLT, 4 nokta)."""
    A, bvec = [], []
    for (x, y), (u, v) in zip(kaynak, hedef):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        bvec.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        bvec.append(v)
    h = np.linalg.solve(np.array(A, dtype=np.float64), np.array(bvec, dtype=np.float64))
    return np.append(h, 1).reshape(3, 3)


def bilineer(img: np.ndarray, u: np.ndarray, v: np.ndarray) -> np.ndarray:
    h, w = img.shape[:2]
    u = np.clip(u, 0, w - 1.001)
    v = np.clip(v, 0, h - 1.001)
    x0, y0 = np.floor(u).astype(np.int64), np.floor(v).astype(np.int64)
    fx, fy = (u - x0)[..., None], (v - y0)[..., None]
    a = img[y0, x0]
    b = img[y0, x0 + 1]
    c = img[y0 + 1, x0]
    d = img[y0 + 1, x0 + 1]
    return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy


def _kutu_bulanik(a: np.ndarray, r: int) -> np.ndarray:
    if r <= 0:
        return a
    p = np.pad(a, r, mode="edge")
    c = np.cumsum(np.cumsum(p, 0), 1)
    c = np.pad(c, ((1, 0), (1, 0)))
    k = 2 * r + 1
    h, w = a.shape
    return (c[k:k + h, k:k + w] - c[:h, k:k + w] - c[k:k + h, :w] + c[:h, :w]) / (k * k)


def yumusat(a: np.ndarray, sigma: float) -> np.ndarray:
    """Üç kutu bulanıklığı ≈ gauss."""
    if sigma <= 0:
        return a
    r = max(1, int(round(np.sqrt(4 * sigma * sigma + 1) / 2)))  # 3 geçişte σ² ≈ r(r+1)
    for _ in range(3):
        a = _kutu_bulanik(a, r)
    return a


def genislet(m: np.ndarray, r: int) -> np.ndarray:
    return _kutu_bulanik(m.astype(np.float64), r) > 1e-6 if r > 0 else m


# ----------------------------------------------------------------------------- birleştirme

def _renk(hexc: str):
    hexc = hexc.lstrip("#")
    return tuple(int(hexc[i:i + 2], 16) for i in (0, 2, 4))


def tasarim_hazirla(tasarim: Image.Image, oran: float, mod: str, zemin: str) -> Image.Image:
    tasarim = tasarim.convert("RGB")
    w, h = tasarim.size
    if mod == "stretch" or abs(w / h - oran) < 1e-3:
        return tasarim
    if mod == "cover":
        if w / h > oran:
            yw = int(round(h * oran))
            x0 = (w - yw) // 2
            return tasarim.crop((x0, 0, x0 + yw, h))
        yh = int(round(w / oran))
        y0 = (h - yh) // 2
        return tasarim.crop((0, y0, w, y0 + yh))
    # fit
    if w / h > oran:
        tw, th = w, int(round(w / oran))
    else:
        tw, th = int(round(h * oran)), h
    tuval = Image.new("RGB", (tw, th), _renk(zemin))
    tuval.paste(tasarim, ((tw - w) // 2, (th - h) // 2))
    return tuval


def birlestir(mockup: Image.Image, tasarim: Image.Image, mod="cover", tol=40, feather=1.5, zemin="#FFFFFF"):
    """(sonuç görseli, bilgi sözlüğü) döndürür. Yeşil bölge yoksa ValueError."""
    alfa_kanal = mockup.getchannel("A") if mockup.mode in ("RGBA", "LA") else None
    m = np.asarray(mockup.convert("RGB")).astype(np.float64)
    ham = yesil_maske(m.astype(np.uint8), tol)
    if ham.sum() < 64:
        raise ValueError(f"#00FF00 (±{tol}) bölgesi bulunamadı")
    bolge = en_buyuk_bolge(ham)
    q = dort_kose(bolge)
    ust, alt = np.linalg.norm(q[1] - q[0]), np.linalg.norm(q[2] - q[3])
    sol, sag = np.linalg.norm(q[3] - q[0]), np.linalg.norm(q[2] - q[1])
    oran = ((ust + alt) / 2) / ((sol + sag) / 2)
    d = np.asarray(tasarim_hazirla(tasarim, oran, mod, zemin)).astype(np.float64)
    dh, dw = d.shape[:2]
    # çıktı (x, y) → tasarım (u, v): piksel merkezleri, köşeler piksel kenarında
    H = homografi(q, np.array([[0, 0], [dw, 0], [dw, dh], [0, dh]], dtype=np.float64))

    halka_r = int(np.ceil(feather)) + 3
    bolge_gen = genislet(bolge, halka_r)
    r, g, b = m[..., 0], m[..., 1], m[..., 2]
    yesillik = g - np.maximum(r, b)
    # anti-alias kenarı: bölgeye komşu yarı yeşil pikselin yeşil payı ≈ yeşillik/255 → kısmi alfa
    kismi = np.clip(yesillik / 255.0, 0, 1) * bolge_gen * ~bolge
    alfa = np.maximum(bolge.astype(np.float64), kismi)
    # yumuşatma yalnız dışa doğru: bölge içi tam kapalı kalır
    alfa = np.maximum(alfa, yumusat(alfa, feather)) if feather > 0 else alfa

    # yeşil taşması temizliği: kısmi piksellerde arka planı ayrıştır (pix = c·yeşil + (1-c)·zemin),
    # kalan yeşil baskınlığı G'yi max(R, B)'ye kırparak gider
    temiz = m.copy()
    ayr = (kismi > 0.02) & (kismi < 0.9)
    c = kismi[ayr][:, None]
    temiz[ayr] = np.clip((m[ayr] - c * np.array([0.0, 255.0, 0.0])) / (1 - c), 0, 255)
    tg = temiz[..., 1]
    tasma = bolge_gen & (tg > np.maximum(temiz[..., 0], temiz[..., 2]))
    temiz[..., 1] = np.where(tasma, np.maximum(temiz[..., 0], temiz[..., 2]), tg)

    ys, xs = np.nonzero(alfa > 1e-4)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float64)
    px, py = xx + 0.5, yy + 0.5
    den = H[2, 0] * px + H[2, 1] * py + H[2, 2]
    u = (H[0, 0] * px + H[0, 1] * py + H[0, 2]) / den - 0.5
    v = (H[1, 0] * px + H[1, 1] * py + H[1, 2]) / den - 0.5
    ornek = bilineer(d, u, v)

    a = alfa[y0:y1, x0:x1, None]
    sonuc = temiz.copy()
    sonuc[y0:y1, x0:x1] = ornek * a + temiz[y0:y1, x0:x1] * (1 - a)
    out = Image.fromarray(np.clip(np.rint(sonuc), 0, 255).astype(np.uint8), "RGB")
    if alfa_kanal is not None:
        out.putalpha(alfa_kanal)
    bilgi = {
        "kose": [[round(float(x), 1), round(float(y), 1)] for x, y in q],
        "bolge_piksel": int(bolge.sum()),
        "atlanan_yesil_piksel": int(ham.sum() - bolge.sum()),
        "oran": round(float(oran), 4),
        "mod": mod,
    }
    return out, bilgi


# ----------------------------------------------------------------------------- ilan şablonları

def sablon_doldur(metin: str, palet: dict, shop: str) -> str:
    degerler = {"collection_name": palet.get("name", "[PLACEHOLDER: collection name]"), "shop_name": shop}
    return re.sub(r"\{\{\s*(\w+)\s*\}\}", lambda m: degerler.get(m.group(1), m.group(0)), metin)


def palet_css(palet: dict) -> str:
    anahtarlar = ["ink", "deep", "primary", "mist_top", "mist_bottom", "gold", "gold_light", "ivory", "leaf"]
    satir = [f"  --{k.replace('_', '-')}: {palet[k]};" for k in anahtarlar if k in palet]
    return ":root {\n" + "\n".join(satir) + "\n}\n"


def render(palet_yolu: Path, cikti: Path, sadece=None, shop="[PLACEHOLDER: shop name]", fontlar=True):
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import md_to_pdf as m2p  # noqa: E402 — ortak font/Playwright yardımcıları

    palet = m2p.palet_oku(palet_yolu)
    if not m2p.playwright_hazir():
        raise RuntimeError("node + Playwright bulunamadı (NODE_PATH=$(npm root -g) ve Chromium gerekli)")
    cikti.mkdir(parents=True, exist_ok=True)
    yazilan = []
    with tempfile.TemporaryDirectory(prefix="listing_") as t:
        t = Path(t)
        for f in SABLON_DIR.iterdir():
            if f.is_file() and f.suffix in (".css", ".html"):
                shutil.copy(f, t / f.name)
        (t / "palette.css").write_text(palet_css(palet), encoding="utf-8")
        ailer = ["Cormorant Garamond", "Montserrat", "Pinyon Script"]
        css = m2p.google_fonts_css(ailer, t / "fonts") if fontlar else ""
        (t / "fonts.css").write_text(css, encoding="utf-8")
        for ad in sadece or SABLONLAR:
            kaynak = t / f"{ad}.html"
            if not kaynak.exists():
                raise ValueError(f"şablon yok: {ad}")
            kaynak.write_text(sablon_doldur(kaynak.read_text(encoding="utf-8"), palet, shop), encoding="utf-8")
            hedef = cikti / f"{ad}.png"
            m2p.playwright_calistir({"url": kaynak.as_uri(), "out": str(hedef.resolve()), "mode": "png",
                                     "width": 2000, "height": 2000, "scale": 1,
                                     "fonts": ailer if css else []}, t)
            yazilan.append(hedef)
    return yazilan


# ----------------------------------------------------------------------------- CLI

def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if argv and argv[0] == "render":
        ap = argparse.ArgumentParser(prog="mockup_compose.py render",
                                     description="İlan görseli şablonlarını palete göre 2000×2000 PNG'ye çevirir.")
        ap.add_argument("palette", type=Path)
        ap.add_argument("cikti", type=Path)
        ap.add_argument("--only", nargs="+", choices=SABLONLAR)
        ap.add_argument("--shop", default="[PLACEHOLDER: shop name]")
        ap.add_argument("--no-fonts", action="store_true")
        a = ap.parse_args(argv[1:])
        try:
            for p in render(a.palette, a.cikti, a.only, a.shop, not a.no_fonts):
                print(f"PNG: {p}")
        except (ValueError, RuntimeError, OSError) as e:
            print(f"HATA: {e}", file=sys.stderr)
            return 1
        return 0

    ap = argparse.ArgumentParser(description="Tasarımı mockup'ın #00FF00 alanına perspektifle yerleştirir.")
    ap.add_argument("mockup", type=Path)
    ap.add_argument("tasarim", type=Path)
    ap.add_argument("cikti", type=Path)
    ap.add_argument("--mode", choices=["cover", "fit", "stretch"], default="cover")
    ap.add_argument("--tol", type=int, default=40, help="#00FF00 toleransı (kanal başına)")
    ap.add_argument("--feather", type=float, default=1.5, help="kenar yumuşatma (px, ≈σ)")
    ap.add_argument("--bg", default="#FFFFFF", help="fit modunda boşluk rengi")
    ap.add_argument("--json", action="store_true", help="köşe ve ölçüleri JSON yaz")
    a = ap.parse_args(argv)
    if not re.fullmatch(r"#?[0-9A-Fa-f]{6}", a.bg):
        ap.error("--bg #RRGGBB olmalı")
    try:
        out, bilgi = birlestir(Image.open(a.mockup), Image.open(a.tasarim), a.mode, a.tol, a.feather, a.bg)
    except (ValueError, OSError) as e:
        print(f"HATA: {e}", file=sys.stderr)
        return 1
    a.cikti.parent.mkdir(parents=True, exist_ok=True)
    out.save(a.cikti)
    if a.json:
        print(json.dumps(bilgi, ensure_ascii=False))
    else:
        print(f"köşeler (TL, TR, BR, BL): {bilgi['kose']} · oran {bilgi['oran']} · {bilgi['mod']}")
        if bilgi["atlanan_yesil_piksel"]:
            print(f"UYARI: en büyük bölge dışında {bilgi['atlanan_yesil_piksel']} yeşil piksel atlandı")
        print(f"PNG: {a.cikti}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
