#!/usr/bin/env python3
"""Ortak tema görsel hattı (docs/11 §5, §7; G054) — her `platform/themes/<slug>/build_images.py` bunu kullanır.

K21: yalnız GPT parçalarını kırpar, keser, maskeler, ölçekler, bulanıklaştırır; yeni şekil/dekor çizmez. Kesimler kenarı
görselin kendi piksellerinden bulur (renk/parlaklık geçişi, koyu ya da boş sütun, alfa farkı). Bulamazsa **açık uyarıyla**
geometrik yedeğe düşer: `bilgi["yontem"] == "geometrik"` ve `bilgi["uyarilar"]` dolu — tema betiği uyarıyı basar,
manifest'e yazar ve kesim önizlemesi gözle denetlenir; yedek kesim sessizce kabul edilmez.

Kullanım (tema `build_images.py`):

    sys.path.insert(0, str(ROOT / "tools"))
    import tema_build as tb
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME])     # parts_prep → geçici klasör
    tb.webp(im, "card_small", [320, 640], 80, manifest, out=OUT)
    slot = tb.foto_alani(prep, win, "card_small", "card", manifest, OUT)
    flap, bilgi = tb.kapak_kes(closed, bicim="egri")                          # bilgi["uyarilar"] → bas + manifest

Bölümler
  çıktı       webp, manifest_yaz, klasor_boyutu (tema klasörü ≤ 3 MB, docs/11 §6)
  hazırlık    prep_hazirla (tools/parts_prep.py → geçici klasör), pencere, kaydet_olculeri (GPT_PROMPTS "Kaydet" ölçüleri)
  foto alanı  pencere_maskesi, foto_alani · serbest_bolge · kapla, yer_tutucu · bulanik_fon · bilesenler
  paylaşım    og_kirp + og_kaydet (web_hero → 1200×630, alt hizalı, yazısız) · ikon (kapanış → kare favicon.png)
  denetim     pencere_seffaf_mi, yesil_gorunur, yesil_denetle, ortusme (kesilen parçalar birleşince kaynak mı)
  hiza        alfa_kutusu, hiza_olc (kapalı ↔ açık; tipe göre değişmeyen kenarlar; sarılı kapanış uçları), hiza_ozet
              — tools/kit_check.py `--paket 5` aynı fonksiyonu kullanır (±%1,5 uyarı, > %4 hata)
  kesimler    kapak_kes (V / eğri kapak kenarı) · cep_kes (V / düz / eğri ön cep) · dikis_bul + kapi_kes (gatefold dikişi,
              katlanma çizgileri, orta cep) · kitap_kes (sırt/kapak) · kese_kes (ağız yayı) · kilif_serit (aydınger kılıf
              üst şeridi) · serit_farki (04 yırtma şeridi = kapalı alfa − açık alfa)

Koordinatlar: kesimler kaynak tuvalinde (aynı boyutta tam tuval görüntüleri döndürür; yalnız `kapak_kes` 03 uyumu için
kapağı satır 0'dan kırpar). Eşikler 03'ün ışığına göre varsayılandır; yeni tasarımda parametreyle verilir ve değer
manifest'e yazılır (docs/11 §5.4). Bağımlılık: Pillow + numpy (tools/mockup_compose yardımcıları).

Test: `python3 tools/tests/test_tema_build.py` (her kesim sahte görsellerle + yedek yolu; 03 yeniden üretimi bayt bayt).
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ARACLAR = Path(__file__).resolve().parent
ROOT = ARACLAR.parent
if str(ARACLAR) not in sys.path:
    sys.path.insert(0, str(ARACLAR))
from mockup_compose import en_buyuk_bolge, genislet  # noqa: E402

TEMA_BUTCE = 3_000_000          # bayt — tema klasörü toplamı (docs/11 §1, §6)
OG_OLCU = (1200, 630)
IKON_OLCU = 180
HIZA_UYARI, HIZA_HATA = 1.5, 4.0  # % (tuval ölçüsüne göre) — docs/11 §7.1
LUM = np.array([0.299, 0.587, 0.114])


# ============================================================================= çıktı

def webp(im: Image.Image, name: str, widths, q: int, manifest: dict, out: Path):
    """`out/<name>-<w>.webp` (her genişlik; kaynaktan büyütmez) + manifest[name] = {src_size, ratio, files}."""
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    w0, h0 = im.size
    files = []
    for w in widths:
        w = min(w, w0)
        h = round(h0 * w / w0)
        r = im.resize((w, h), Image.LANCZOS) if w != w0 else im
        p = Path(out) / f"{name}-{w}.webp"
        r.save(p, "WEBP", quality=q, method=6, alpha_quality=90)
        files.append({"file": p.name, "w": w, "h": h, "bytes": p.stat().st_size})
    manifest[name] = {"src_size": [w0, h0], "ratio": round(w0 / h0, 5), "files": files}


def manifest_yaz(out: Path, manifest: dict) -> Path:
    p = Path(out) / "manifest.json"
    p.write_text(json.dumps(manifest, indent=1, ensure_ascii=False) + "\n")
    return p


def klasor_boyutu(klasor: Path) -> int:
    """Klasördeki bütün dosyaların toplam baytı (__pycache__ hariç)."""
    return sum(f.stat().st_size for f in Path(klasor).rglob("*") if f.is_file() and "__pycache__" not in f.parts)


# ============================================================================= hazırlık

def prep_hazirla(col: Path, prep_dir=None, yasak=(), root: Path = ROOT, onek: str = "tema-prep-"):
    """tools/parts_prep.py'yi geçici klasöre (ya da `prep_dir`'e) koşturur. (prep, windows["pencereler"], tmp|None).
    `prep_dir`'de windows.json zaten varsa yeniden koşturmaz. Çıktı `yasak` klasörlerinden (tema klasörü) birinin
    içindeyse reddedilir; `assets/` altını parts_prep kendisi reddeder."""
    tmp = None
    if prep_dir:
        prep = Path(prep_dir).resolve()
        for y in yasak:
            if prep == Path(y).resolve() or prep.is_relative_to(Path(y).resolve()):
                raise SystemExit(f"--prep-dir tema klasörünün içinde olamaz: {prep}")
    else:
        tmp = tempfile.TemporaryDirectory(prefix=onek)
        prep = Path(tmp.name)
    if not (prep / "windows.json").exists():
        col = Path(col)
        hedef = str(col.relative_to(root)) if col.is_relative_to(root) else str(col)
        r = subprocess.run([sys.executable, "-B", str(root / "tools/parts_prep.py"), hedef, "--out", str(prep)], cwd=root)
        if r.returncode != 0:
            sys.exit("parts_prep başarısız")
    win = json.loads((prep / "windows.json").read_text())["pencereler"]
    return prep, win, tmp


def pencere(prep: Path, windows: dict, ad: str, esik: int = 0) -> np.ndarray:
    """parts_prep pencere maskesi (kapsama > esik; 0 = pencerenin dokunduğu her piksel, 254 = tam şeffaf
    pencere) → katman boyutunda bool pencere."""
    p = windows[ad][0]
    x, y, w, h = p["kutu"]
    W, H = p["katman_olcu"]
    m = np.zeros((H, W), bool)
    m[y:y + h, x:x + w] = np.asarray(Image.open(prep / p["maske"]))[..., 3] > esik
    return m


def kaydet_olculeri(col: Path) -> dict:
    """GPT_PROMPTS.md `**Kaydet:**` satırları → {dosya adı (uzantısız): (g, y)} (aynı ad iki pakette: sonraki)."""
    from kit_check import beklenenler  # geç içe aktarma: kit_check bu modülü içe aktarır
    out = {}
    for b in beklenenler(Path(col) / "assets/gpt/GPT_PROMPTS.md"):
        if b.get("olcu") and "/parts/" in b["yol"]:
            out[Path(b["yol"]).stem] = tuple(b["olcu"])
    return out


# ============================================================================= foto alanı, serbest bölge, yer tutucu

def pencere_maskesi(win: np.ndarray, pay: int = 2):
    """Pencere bölgesi (+pay px, çerçevenin altına taşsın diye) → (beyaz alfa maskesi, [x0, y0, x1, y1])."""
    m = genislet(win, pay)
    ys, xs = np.nonzero(m)
    x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
    a = (m[y0:y1, x0:x1] * 255).astype(np.uint8)
    rgba = np.dstack([np.full_like(a, 255)] * 3 + [a])
    return Image.fromarray(rgba, "RGBA"), [x0, y0, x1, y1]


def foto_alani(prep: Path, windows: dict, parca: str, ad: str, manifest: dict, out: Path, maks: int = 480) -> dict:
    """Çerçeve/kart parçasının (webp() ile manifest'e yazılmış olmalı) pencere kaydı + `mask_<ad>.png` + denetim.
    Kaynakta ya da WebP çıktısında tam pencerede görünür piksel kalırsa çıkış ≠ 0 (docs/11 §5.4 #3–#4)."""
    im = Image.open(prep / f"{parca}.png").convert("RGBA")
    manifest[parca]["window"] = windows[parca][0]["kutu"]
    manifest[parca]["leke_px"] = windows[parca][0].get("leke_px", 0)
    mask, (x0, y0, x1, y1) = pencere_maskesi(pencere(prep, windows, parca))
    tam = pencere(prep, windows, parca, 254)
    kaynak_gorunur = int((np.asarray(im)[..., 3][tam] > 0).sum())
    if kaynak_gorunur:
        sys.exit(f"{parca}: parts_prep çıktısında tam pencerede {kaynak_gorunur} görünür piksel (leke kaldı)")
    mask.thumbnail((maks, maks), Image.LANCZOS)
    mask.save(Path(out) / f"mask_{ad}.png", optimize=True)
    Wl, Hl = im.size
    box = [round(100 * x0 / Wl, 3), round(100 * y0 / Hl, 3), round(100 * (x1 - x0) / Wl, 3),
           round(100 * (y1 - y0) / Hl, 3)]
    slot = {"box_pct": box, "aspect": round((x1 - x0) / (y1 - y0), 4), "box_px": [x1 - x0, y1 - y0],
            "mask": f"mask_{ad}.png"}
    for f in manifest[parca]["files"]:
        gorunur = pencere_seffaf_mi(Path(out) / f["file"], tam)
        f["window_visible_px"] = gorunur
        if gorunur:
            sys.exit(f"{f['file']}: pencerede {gorunur} görünür piksel (leke kaldı)")
    return slot


def serbest_bolge(im: Image.Image, merkez: float, adim: float = 1.0, ornek=(.5, .55), esik: float = 28):
    """Kart yüzünde düz kağıt bölgesi: her %adim yükseklik bandında, merkez sütundan sola/sağa ilk "dolu"
    piksele (çiçek, altın çizgi, pencere, şeffaflık) kadar olan aralık [y%, sol%, sağ%]. Kağıt rengi `ornek`
    (yükseklik oranı aralığı, genişliğin %40–60'ı) bölgesinin medyanı; `esik` renk farkı (03: 28). theme-check
    metin satırlarının bu aralıkta kaldığını (boyalı süse değmediğini) bununla denetler."""
    a = np.asarray(im.convert("RGBA")).astype(np.int16)
    H, W = a.shape[:2]
    paper = np.median(a[int(H * ornek[0]):int(H * ornek[1]), int(W * .4):int(W * .6), :3].reshape(-1, 3), 0)
    d = np.sqrt(((a[..., :3] - paper) ** 2).sum(-1))
    busy = (d > esik) | (a[..., 3] < 200)
    busy = genislet(~genislet(~busy, 2), 2)   # açma: kağıt dokusundaki < 5 px lekeler sayılmaz
    c = int(W * merkez)
    out = []
    y = 0.0
    while y < 100:
        y0, y1 = int(H * y / 100), max(int(H * y / 100) + 1, int(H * (y + adim) / 100))
        band = busy[y0:y1].any(0)
        if band[c]:
            out.append([round(y, 2), None, None])
        else:
            L = c
            while L > 0 and not band[L - 1]:
                L -= 1
            R = c
            while R < W - 1 and not band[R + 1]:
                R += 1
            out.append([round(y, 2), round(100 * L / W, 2), round(100 * (R + 1) / W, 2)])
        y += adim
    return out


def kapla(im: Image.Image, oran: float, odak_y: float = .5) -> Image.Image:
    """Oranı `oran` (g/y) olan en büyük kırpım; yatayda ortalı, dikeyde odak_y (yüz için yukarı)."""
    w, h = im.size
    if w / h > oran:
        cw = round(h * oran)
        x0 = (w - cw) // 2
        return im.crop((x0, 0, x0 + cw, h))
    ch = round(w / oran)
    y0 = int(round((h - ch) * odak_y))
    return im.crop((0, y0, w, y0 + ch))


def yer_tutucu(bg: Image.Image, kutu, oran: float, w: int = 640, ton=(248, 233, 231), karisim: float = 0.34,
               bulanik: float = 9) -> Image.Image:
    """Nötr foto yer tutucusu: sayfa zemininden (bg_page) yumuşak odaklı, açık tonlanmış kırpım — kişi, yazı, düz renk
    kutu yok (docs/11 §5.4 #6). `ton` paletin açık sayfa rengi, `karisim` ona karışma oranı."""
    p = kapla(bg.crop(kutu), oran)
    p = p.resize((w, round(w / oran)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(bulanik * w / 640))
    return Image.blend(p, Image.new("RGB", p.size, ton), karisim)


def bulanik_fon(bg: Image.Image, olcu=(640, 960), yaricap: float = 5) -> Image.Image:
    """Geniş ekran zemini ("mist"): sayfa zemininin küçültülüp Gauss bulanıklaştırılmış hâli."""
    return bg.resize(olcu, Image.LANCZOS).filter(ImageFilter.GaussianBlur(yaricap))


def bilesenler(im: Image.Image, n: int = 6, min_px: int = 500, pad: int = 6, alfa_esik: int = 24, satir: int = 200):
    """Tek görselde birden çok nesne (03 petals.png) → alfa bileşenlerine göre en büyük `n` parça (her biri yalnız
    kendi bileşeni + 3 px; komşunun ucu girmez), satır (`satir` px bant) sonra x sırasıyla. PAKET 5'te accent_1..3 zaten
    tek nesnedir; bu yalnız çok nesneli eski sayfalar için."""
    im = im.convert("RGBA")
    a = np.asarray(im)
    m = a[..., 3] > alfa_esik
    out = []
    kalan = m.copy()
    for _ in range(n):
        b = en_buyuk_bolge(kalan)
        if b.sum() < min_px:
            break
        kalan &= ~b
        ys, xs = np.nonzero(b)
        box = (max(0, xs.min() - pad), max(0, ys.min() - pad),
               min(a.shape[1], xs.max() + 1 + pad), min(a.shape[0], ys.max() + 1 + pad))
        crop = im.crop(box)
        cm = Image.fromarray((genislet(b, 3)[box[1]:box[3], box[0]:box[2]] * 255).astype(np.uint8), "L")
        ca = np.asarray(crop).copy()
        ca[..., 3] = np.minimum(ca[..., 3], np.asarray(cm))
        out.append((box, Image.fromarray(ca, "RGBA")))
    out.sort(key=lambda t: (t[0][1] // satir, t[0][0]))
    return [p for _, p in out]


# ============================================================================= paylaşım görseli, ikon

def og_kirp(im: Image.Image, olcu=OG_OLCU, hiza: str = "alt"):
    """`web_hero` → paylaşım görseli (1200×630 ≈ 1.91:1): kaynağın tam genişliği (ya da yüksekliği) korunur, oran fazlası
    kırpılır — `hiza` "alt" (vars.; web_hero kuralı: zarf + kapanış altta, üst %20'de önemli öğe yok), "ust", "orta"
    (yatay fazlada "sol"/"sag"/"orta"). Yazı eklenmez (isim yok; K24). (RGB görüntü, bilgi {src_size, crop [x, y, w, h],
    align, size})."""
    im = im.convert("RGB")
    W, H = im.size
    tw, th = olcu
    oran = tw / th
    if W / H > oran:
        cw = round(H * oran)
        x0 = {"sol": 0, "sag": W - cw}.get(hiza, (W - cw) // 2)
        kutu = (x0, 0, x0 + cw, H)
    else:
        ch = round(W / oran)
        y0 = {"ust": 0, "alt": H - ch}.get(hiza, (H - ch) // 2)
        kutu = (0, y0, W, y0 + ch)
    out = im.crop(kutu).resize((tw, th), Image.LANCZOS)
    bilgi = {"src_size": [W, H], "crop": [kutu[0], kutu[1], kutu[2] - kutu[0], kutu[3] - kutu[1]], "align": hiza,
             "size": [tw, th]}
    return out, bilgi


def og_kaydet(im: Image.Image, yol: Path, kalite: int = 82) -> int:
    """JPEG (q≈82, docs/11 §5.1), meta verisiz. Bayt sayısını döndürür."""
    im.convert("RGB").save(yol, "JPEG", quality=kalite, optimize=True, progressive=True)
    return Path(yol).stat().st_size


def ikon(im: Image.Image, olcu: int = IKON_OLCU, pay: float = 0.04):
    """Kapanış parçası (03: ribbon_bow) → kare, şeffaf zeminli ikon (favicon.png). Nesnenin alfa kutusu ortalanır,
    kısa kenar şeffafla kareye tamamlanır (nesne kesilmez, çizilmez), kenarda `pay` oranında boşluk. Küçültme
    önçarpımlı alfayla (şeffaf kenarda koyu saçak olmasın). (RGBA görüntü, bilgi)."""
    rgba = im.convert("RGBA")
    k = alfa_kutusu(np.asarray(rgba)[..., 3], esik=8)
    if k is None:
        raise ValueError("ikon: kaynak tamamen şeffaf")
    crop = rgba.crop(k)
    w, h = crop.size
    s = round(max(w, h) * (1 + 2 * pay))
    kare = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    kare.paste(crop, ((s - w) // 2, (s - h) // 2))
    out = kare.convert("RGBa").resize((olcu, olcu), Image.LANCZOS).convert("RGBA")
    return out, {"src_box": [k[0], k[1], k[2] - k[0], k[3] - k[1]], "size": [olcu, olcu], "pad": pay}


# ============================================================================= denetim

def pencere_seffaf_mi(dosya: Path, tam: np.ndarray) -> int:
    """WebP çıktısında tam şeffaf pencere (parts_prep kapsaması 255; katman boyutunda bool) şeffaf kaldı mı?
    Görünür (alfa > %10) piksel sayısı. Küçültme/WebP kenarı 1–2 px yayar: pencere o kadar içeri alınır."""
    im = np.asarray(Image.open(dosya).convert("RGBA"))
    H, W = im.shape[:2]
    m = np.asarray(Image.fromarray((tam * 255).astype(np.uint8)).resize((W, H), Image.LANCZOS)) > 250
    r = 2
    m = ~genislet(~np.pad(m, r + 1), r)[r + 1:-r - 1, r + 1:-r - 1]
    return int((im[..., 3][m] > 24).sum())


def yesil_gorunur(dosya: Path) -> int:
    """Görünür #00FF00 kalıntısı (yeşil baskın, alfa > 25) piksel sayısı."""
    a = np.asarray(Image.open(dosya).convert("RGBA")).astype(np.int16)
    tint = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
    return int(((tint > 40) & (a[..., 1] * 2 >= 3 * np.maximum(a[..., 0], a[..., 2])) & (a[..., 3] > 25)).sum())


def yesil_denetle(out: Path, desen: str = "*.webp") -> dict:
    """{dosya: piksel} — yalnız kalıntı bulunanlar (boş sözlük = temiz)."""
    return {f.name: n for f in sorted(Path(out).glob(desen)) if (n := yesil_gorunur(f))}


def _alfa(x) -> np.ndarray:
    a = np.asarray(x)
    return a[..., 3] if a.ndim == 3 else a


def ortusme(kaynak, parcalar) -> float:
    """Kesilen parçalar (kaynakla aynı tuvalde; RGBA görüntü/dizi ya da alfa dizisi) üst üste konunca kaynağın alfası
    çıkıyor mu? Fark oranı = Σ|birleşim − kaynak| / Σ kaynak (0 = birebir). docs/11 §5.4 #4: ≤ 0,01."""
    k = _alfa(kaynak).astype(np.float64) / 255
    kalan = np.ones_like(k)
    for p in parcalar:
        kalan *= 1 - _alfa(p).astype(np.float64) / 255
    return float(np.abs((1 - kalan) - k).sum() / max(k.sum(), 1.0))


# ============================================================================= hiza (kapalı ↔ açık)

def alfa_kutusu(alfa: np.ndarray, esik: int = 128):
    """(x0, y0, x1, y1) — alfa ≥ esik piksellerin kutusu (x1, y1 hariç). Boşsa None."""
    ys, xs = np.nonzero(np.asarray(alfa) >= esik)
    if not len(ys):
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def _rgba_dizi(x) -> np.ndarray:
    if isinstance(x, Image.Image):
        return np.asarray(x.convert("RGBA"))
    return np.asarray(x)


def kat_bul(rgba, x_merkez: float, yaricap: float, esik: float = 10.0, y_aralik=None, k: int = 3):
    """Dikey katlanma/dikiş/oluk çizgisi: [x_merkez ± yaricap] sütunları içinde aranır; sütun parlaklığı = nesnenin
    dikey açıklığının orta %90'ındaki (ya da `y_aralik`) opak piksellerin ortalaması.
      1. çizgi/boşluk: skor = (iki yandaki ±k sütunun koyusu − sütun, ≥ 0: iki yanından da koyu ince çizgi; adım değil)
         + 255 × boşluk oranı (alfa < 128). En yüksek skora yakın (≥ %80) bitişik sütunlar (düz boşluk) ortalanır.
      2. çizgi yoksa geçiş: iki bölge arasındaki en güçlü adım (sağdaki 3 sütun − soldaki 3 sütun ortalaması, ≥ 2·esik;
         ör. kapı içi astarı ↔ orta panel). Konum = iki sütunun sınırı.
    (x — kaynak px | None, skor). Hiçbiri eşiği geçmezse None."""
    a = _rgba_dizi(rgba).astype(np.float64)
    al = a[..., 3]
    h, w = al.shape
    opak = al >= 128
    if y_aralik is None:
        ys = np.flatnonzero(opak.any(1))
        if not len(ys):
            return None, 0.0
        y0, y1 = int(ys[0]), int(ys[-1]) + 1
        p = int(0.05 * (y1 - y0))
        y_aralik = (y0 + p, y1 - p)
    ya, yb = int(y_aralik[0]), int(y_aralik[1])
    c0, c1 = max(0, int(np.floor(x_merkez - yaricap)) - k), min(w, int(np.ceil(x_merkez + yaricap)) + 1 + k)
    if c1 - c0 < 2 * k + 3 or yb - ya < 3:
        return None, 0.0
    lum = a[ya:yb, c0:c1, :3] @ LUM
    op = opak[ya:yb, c0:c1]
    say = op.sum(0)
    ort = np.where(say > 0, (lum * op).sum(0) / np.maximum(say, 1), np.nan)
    bosluk = 1 - say / (yb - ya)
    dolu = np.where(np.isfinite(ort), ort, np.nanmax(ort) if np.isfinite(ort).any() else 0.0)
    n = len(dolu)
    idx = np.arange(k, n - k)
    yan = np.minimum(dolu[idx - k], dolu[idx + k])
    cizgi = np.clip(yan - dolu[idx], 0, None) + 255 * bosluk[idx]
    i = int(np.argmax(cizgi))
    if cizgi[i] >= esik:
        j0 = j1 = i
        while j0 > 0 and cizgi[j0 - 1] >= 0.8 * cizgi[i]:
            j0 -= 1
        while j1 < len(cizgi) - 1 and cizgi[j1 + 1] >= 0.8 * cizgi[i]:
            j1 += 1
        return c0 + k + (j0 + j1) / 2 + 0.5, float(cizgi[i])
    sinir = np.arange(3, n - 2)  # sınır: sütun s−1 ile s arası
    if not len(sinir):
        return None, float(cizgi[i])
    adim = np.array([abs(dolu[s:s + 3].mean() - dolu[s - 3:s].mean()) for s in sinir])
    j = int(np.argmax(adim))
    if adim[j] >= 2 * esik:
        return float(c0 + sinir[j]), float(adim[j])
    return None, float(max(cizgi[i], adim[j] / 2))


def _govde(al: np.ndarray):
    """Zarf gövdesi (kapak açıkken de değişmeyen dikdörtgen kısım): genişlik = alt gövdenin (yüksekliğin %60–95'i)
    satır genişliklerinin medyanı; üst = genişliğin bu medyana (− max(2 px, %0,3)) ilk ulaştığı satır — açık zarfta
    menteşe, kapalı zarfta üst kenar; alt = son opak satır + 1. Köşe/menteşe çıkıntıları (03: menteşede ~%1 taşan kapak
    tabanı) alfa kutusunu genişletir, medyanı değiştirmez. {w, top, bottom} | None."""
    op = np.asarray(al) >= 128
    ys = np.flatnonzero(op.any(1))
    if not len(ys):
        return None
    y0, y1 = int(ys[0]), int(ys[-1]) + 1
    gen = op.sum(1)
    alt = gen[int(y0 + 0.6 * (y1 - y0)):max(int(y1 - 0.05 * (y1 - y0)), int(y0 + 0.6 * (y1 - y0)) + 1)]
    med = float(np.median(alt))
    sat = np.flatnonzero(gen >= med - max(2.0, 0.003 * med))
    return {"w": med, "top": int(sat[0]) if len(sat) else y0, "bottom": y1}


def _durum(pct) -> str:
    if pct is None:
        return "uyari"
    p = abs(pct)
    return "tamam" if p <= HIZA_UYARI else ("uyari" if p <= HIZA_HATA else "hata")


_SIRA = {"tamam": 0, "uyari": 1, "hata": 2}


def _kenar(ad, kapali, acik, olcu, not_=None):
    if kapali is None or acik is None:
        return {"kenar": ad, "kapali": kapali, "acik": acik, "fark_px": None, "fark_pct": None, "durum": "uyari",
                "not": not_ or "ölçülemedi"}
    f = acik - kapali
    e = {"kenar": ad, "kapali": round(kapali, 1), "acik": round(acik, 1), "fark_px": round(f, 1),
         "fark_pct": round(100 * f / olcu, 2), "durum": _durum(100 * f / olcu)}
    if not_:
        e["not"] = not_
    return e


def _uc_fark(kap: np.ndarray, zarf: np.ndarray, eksen: str, uc: str, bant: float = 0.02):
    """Sarılı kapanışın bir ucu ile zarfın aynı satırdaki (ya da sütundaki) kenarı arasındaki medyan fark (px).
    Pozitif = kapanış zarf kenarına varmıyor (boşluk), negatif = kenardan taşıyor."""
    if eksen == "dikey":
        kap, zarf = kap.T, zarf.T
    satirlar = np.flatnonzero(kap.any(1) & zarf.any(1))
    if not len(satirlar):
        return None
    w = kap.shape[1]
    if uc == "bas":
        k = np.array([np.argmax(kap[r]) for r in satirlar])
        z = np.array([np.argmax(zarf[r]) for r in satirlar])
        uc_k = k.min()
        sec = k <= uc_k + max(2, bant * w)
        return float(np.median(k[sec] - z[sec]))
    k = np.array([w - np.argmax(kap[r, ::-1]) for r in satirlar])
    z = np.array([w - np.argmax(zarf[r, ::-1]) for r in satirlar])
    uc_k = k.max()
    sec = k >= uc_k - max(2, bant * w)
    return float(np.median(z[sec] - k[sec]))


def hiza_olc(kapali, acik, tip: str = "kapak", kapali_tuval=None, acik_tuval=None, kapanis=None, kapanis_tuval=None,
             kat_bant: float = 0.03):
    """Kapalı ↔ açık zarf (ve sarılı kapanış) hizası — docs/11 §7.1. Görseller GPT_PROMPTS "Kaydet" tuvaline
    (`*_tuval` = (g, y); vars. kendi boyu) ölçeklenmiş sayılır; farklar tuval ölçüsünün yüzdesi (x farkı genişliğe, y
    farkı yüksekliğe göre). Yalnız **değişmeyen kenarlar** karşılaştırılır (açık hâl alfa kutusunu bilerek büyütür):
      kapak (04 dahil) — alfa kutusunun sol, sağ, alt kenarı · kese, kilif — sol, sağ, alt
      kapi  — üst, alt + açık görselde katlanma çizgileri (kapalı x0/x1 ± kat_bant içinde en koyu/boşluklu sütun)
      kitap — kapağın üst/alt/sağ kenarı ↔ sağ sayfanınki; sırt (açık görselde oluk) ↔ kapalı kapağın sol kenarı
    Kaydet tuvalleri farklıysa (03: kapalı 1024×1024, açık 1024×1536 — PAKET 4 pilotu) yöntem "olcekli": iki gövde
    (`_govde`: alt gövde genişliği medyanı, menteşe/üst kenar satırı, alt kenar) genişlikleri eşitlenecek ölçekle eşlenir,
    alt kenarlar çakıştırılır; kalan tek serbestlik gövde yüksekliği (en/boy oranı farkı) ölçülür. Prompt üst üste çizim
    istemediği için burada "hata" en çok "uyari" sayılır (tema iki katmanı ayrı ölçekle oturtur; 03 site.css böyle).
    Sarılı kapanış (`kapanis`, zarfla aynı tuval): sarma
    ekseni boyunca iki ucu zarfın aynı satır/sütundaki kenarına göre (medyan) — taşan fiyonk/dal uçta ölçülürse "taşma"
    görünür, gözle bakılır. Eşik: ≤ %1,5 tamam, ≤ %4 uyarı (tema ölçülen dönüşümle düzeltir), > %4 hata (GPT'den yeniden).
    Döner: {tip, yontem, tuval, kenarlar[], kapanis[]?, durum, uyarilar[], esik}."""
    ka, ac = _rgba_dizi(kapali), _rgba_dizi(acik)
    hk, wk = ka.shape[:2]
    ho, wo = ac.shape[:2]
    Tk = tuple(kapali_tuval or (wk, hk))
    To = tuple(acik_tuval or (wo, ho))
    sxk, syk = Tk[0] / wk, Tk[1] / hk
    sxo, syo = To[0] / wo, To[1] / ho
    uyarilar = []
    kenarlar = []
    bk, bo = alfa_kutusu(ka[..., 3]), alfa_kutusu(ac[..., 3])
    sonuc = {"tip": tip, "yontem": "tuval", "tuval": list(Tk), "kenarlar": kenarlar, "uyarilar": uyarilar,
             "esik": [HIZA_UYARI, HIZA_HATA]}
    if bk is None or bo is None:
        uyarilar.append("kapalı ya da açık zarfta opak piksel yok")
        sonuc["durum"] = "hata"
        return sonuc
    W, H = Tk
    if Tk != To:
        sonuc["yontem"] = "olcekli"
        sonuc["tuval"] = [list(Tk), list(To)]
        uyarilar.append(f"farklı tuval: kapalı {Tk[0]}×{Tk[1]} ↔ açık {To[0]}×{To[1]} — kenarlar ölçek + ötelemeyle "
                        "eşlendi; tuvalde üst üste oturmuyor (PAKET 5 kuralı: aynı tuval)")
        if tip != "kapak":
            kenarlar.append(_kenar("tuval", None, None, 1, "farklı tuvalde yalnız kapak tipi ölçülür"))
        else:
            gk, go = _govde(ka[..., 3]), _govde(ac[..., 3])
            s = gk["w"] * sxk / max(go["w"] * sxo, 1e-6)  # açık → kapalı (gövde genişlikleri eşit olsun)
            hk = (gk["bottom"] - gk["top"]) * syk
            ho = (go["bottom"] - go["top"]) * syo * s
            sonuc["olcek"] = round(s, 4)
            sonuc["govde"] = {"kapali_px": [round(gk["w"] * sxk, 1), round(hk, 1)],
                              "acik_px_olcekli": [round(go["w"] * sxo * s, 1), round(ho, 1)]}
            e = _kenar("gövde yüksekliği (oran)", hk, ho, H,
                       "açık gövde kapalının genişliğine ölçeklendi, alt kenarlar çakıştırıldı; fark = gövde en/boy farkı")
            if e["durum"] == "hata":  # prompt üst üste çizim istemedi (PAKET 4): tema ölçekleri ayrı ayarlar
                e["durum"] = "uyari"
                e["not"] += " · farklı tuvalde hata eşiği uygulanmaz; tema iki katmanı ayrı ölçekle oturtur (ör. 03 " \
                            "site.css .env-closed dikeyde ~%5 basık)"
            kenarlar.append(e)
    elif tip == "kapi":
        kenarlar.append(_kenar("üst", bk[1] * syk, bo[1] * syo, H))
        kenarlar.append(_kenar("alt", bk[3] * syk, bo[3] * syo, H))
        for ad, xk in (("sol kat", bk[0]), ("sağ kat", bk[2])):
            x_o, _ = kat_bul(ac, xk * sxk / sxo, kat_bant * wo)
            kenarlar.append(_kenar(ad, xk * sxk, None if x_o is None else x_o * sxo, W,
                                   None if x_o is not None else "açık görselde katlanma çizgisi bulunamadı"))
    elif tip == "kitap":
        x_o, _ = kat_bul(ac, bk[0] * sxk / sxo, kat_bant * wo)
        g = int(round(x_o)) if x_o is not None else int(round(bk[0] * sxk / sxo))
        sayfa = alfa_kutusu(ac[:, g:, 3])
        if sayfa is None:
            uyarilar.append("açık kitapta sırtın sağında sayfa yok")
            sonuc["durum"] = "hata"
            return sonuc
        sayfa = (sayfa[0] + g, sayfa[1], sayfa[2] + g, sayfa[3])
        kenarlar.append(_kenar("sırt", bk[0] * sxk, None if x_o is None else x_o * sxo, W,
                               None if x_o is not None else "açık görselde sırt (oluk) bulunamadı"))
        kenarlar.append(_kenar("üst", bk[1] * syk, sayfa[1] * syo, H))
        kenarlar.append(_kenar("alt", bk[3] * syk, sayfa[3] * syo, H))
        kenarlar.append(_kenar("sağ", bk[2] * sxk, sayfa[2] * sxo, W))
    else:  # kapak, kese, kilif (ve bilinmeyen tip)
        kenarlar.append(_kenar("sol", bk[0] * sxk, bo[0] * sxo, W))
        kenarlar.append(_kenar("sağ", bk[2] * sxk, bo[2] * sxo, W))
        kenarlar.append(_kenar("alt", bk[3] * syk, bo[3] * syo, H))
    if kapanis is not None:
        sonuc["kapanis"] = kapanis_hiza(ka, kapanis, Tk, kapanis_tuval)
    hepsi = kenarlar + sonuc.get("kapanis", {}).get("kenarlar", [])
    sonuc["durum"] = max((e["durum"] for e in hepsi), key=_SIRA.get, default="uyari")
    if not hepsi:
        sonuc["durum"] = "uyari"
    return sonuc


def kapanis_hiza(kapali, kapanis, kapali_tuval=None, kapanis_tuval=None, kapsama: float = 0.85) -> dict:
    """Sarılı kapanış (kurdele/sicim zarfı sarar; zarfla aynı tuvalde 1:1) — uçları zarfın kenarında bitiyor mu?
    Sarma ekseni: kapanışın genişliği, kendi satırlarında zarfın (medyan) genişliğinin ≥ `kapsama`'sı ise yatay;
    yükseklik için aynı → dikey; ikisi de değilse oranı büyük olan (sarmıyor gibi; farklar büyük çıkar)."""
    ka, kp = _rgba_dizi(kapali), _rgba_dizi(kapanis)
    hk, wk = ka.shape[:2]
    Tk = tuple(kapali_tuval or (wk, hk))
    Tc = tuple(kapanis_tuval or (kp.shape[1], kp.shape[0]))
    out = {"kenarlar": [], "eksen": []}
    if Tk != Tc:
        out["kenarlar"].append(_kenar("kapanış tuvali", None, None, 1,
                                      f"sarılı kapanış zarfla aynı tuvalde olmalı ({Tc[0]}×{Tc[1]} ≠ {Tk[0]}×{Tk[1]})"))
        return out
    if kp.shape[:2] != ka.shape[:2]:
        kp = np.asarray(Image.fromarray(kp).resize((wk, hk), Image.LANCZOS))
    zm, km = ka[..., 3] >= 128, kp[..., 3] >= 128
    if not km.any():
        out["kenarlar"].append(_kenar("kapanış", None, None, 1, "kapanışta opak piksel yok"))
        return out
    sx, sy = Tk[0] / wk, Tk[1] / hk
    kb = alfa_kutusu(kp[..., 3])
    satir = np.flatnonzero(km.any(1) & zm.any(1))
    sutun = np.flatnonzero(km.any(0) & zm.any(0))
    zg = np.median(zm[satir].sum(1)) if len(satir) else 1
    zy = np.median(zm[:, sutun].sum(0)) if len(sutun) else 1
    oranlar = {"yatay": (kb[2] - kb[0]) / max(zg, 1), "dikey": (kb[3] - kb[1]) / max(zy, 1)}
    eksenler = [e for e, o in oranlar.items() if o >= kapsama] or [max(oranlar, key=oranlar.get)]
    out["eksen"] = eksenler
    out["kapsama"] = {e: round(float(o), 3) for e, o in oranlar.items()}
    for e in eksenler:
        olcu, s = (Tk[0], sx) if e == "yatay" else (Tk[1], sy)
        adlar = ("sol uç", "sağ uç") if e == "yatay" else ("üst uç", "alt uç")
        for ad, uc in zip(adlar, ("bas", "son")):
            f = _uc_fark(km, zm, e, uc)
            if f is None:
                out["kenarlar"].append(_kenar(f"kapanış {ad}", None, None, olcu, "ölçülemedi"))
                continue
            k = {"kenar": f"kapanış {ad}", "fark_px": round(f * s, 1), "fark_pct": round(100 * f * s / olcu, 2),
                 "durum": _durum(100 * f * s / olcu), "not": "+ boşluk, − taşma (zarfın aynı satır/sütundaki kenarına göre)"}
            out["kenarlar"].append(k)
    return out


def hiza_ozet(sonuc: dict) -> str:
    """Tek satır özet: 'kapak · tuval · sol +0.10% · sağ −0.20% · alt +0.00%' (+ kapanış uçları, notlar)."""
    def f(e):
        if e["fark_pct"] is None:
            return f"{e['kenar']} ? ({e.get('not', 'ölçülemedi')})"
        return f"{e['kenar']} {e['fark_pct']:+.2f}%"
    parca = [sonuc["tip"], sonuc["yontem"]] + [f(e) for e in sonuc["kenarlar"]]
    if sonuc.get("kapanis"):
        parca += [f(e) for e in sonuc["kapanis"]["kenarlar"]]
    return " · ".join(parca)


# ============================================================================= kesim yardımcıları

def _alt_maske(h: int, w: int, kenar: np.ndarray, kaydir: float = 0.0) -> np.ndarray:
    """Her sütunda kenar(x) − kaydir satırından aşağısı 1 (1 px yumuşak geçiş)."""
    satir = np.arange(h)[:, None]
    return np.clip(satir - (kenar[None, :] - kaydir) + 0.5, 0, 1)


def _sutun_maske(h: int, w: int, x_kes: float) -> np.ndarray:
    """x < x_kes → 1, x ≥ x_kes → 0; kesen sütunda alan oranı (1 px yumuşak)."""
    return np.broadcast_to(np.clip(x_kes - np.arange(w), 0, 1)[None, :], (h, w))


def _alfa_carp(rgba: np.ndarray, m: np.ndarray) -> Image.Image:
    out = rgba.copy()
    out[..., 3] = np.round(rgba[..., 3].astype(np.float64) * m).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def _alttan_tara(rgb: np.ndarray, x: int, y_start: int, y_stop: int, esik: float, pencere: int = 24):
    """Sütun x'te ön malzemenin rengi (y_start'ın üstündeki `pencere` satırın medyanı, ±3 sütun) referans alınıp yukarı
    çıkılır; 4 satır ortalaması `esik`'i ilk aştığında o penceredeki **en alttaki** sapan satır döner (ön malzemenin
    hemen üstündeki ilk farklı satır: kenar şeridi/çizgisi ya da astar). Yoksa None."""
    if y_start - pencere < 3:
        return None
    ref = np.median(rgb[y_start - pencere:y_start, max(0, x - 3):x + 4].reshape(-1, 3), 0)
    d = np.sqrt(((rgb[:, x] - ref) ** 2).sum(-1))
    for y in range(y_start - pencere, y_stop, -1):
        if d[y - 3:y + 1].mean() > esik:
            for yy in range(y, y - 4, -1):
                if d[yy] > esik:
                    return yy
            return y
    return None


def _bant_ofseti(rgb: np.ndarray, xs: np.ndarray, alt_sapma: np.ndarray, esik: float, ust: int = 12) -> int:
    """Ön malzemenin üst kenar bandı (açık kesik şeridi, altın çizgi) cebe/ön duvara aittir; astar değildir. Kenar boyunca
    (alt_sapma(x) + o satırı) ortalama renk profili P(o) çıkarılır — astarın deseni sütunlar boyunca ortalanınca düz bir
    renge iner. Astar rengi L = P(−ust..−6) ortalaması. o = 0, −1, … satırları L'den `esik`'ten çok farklı oldukça banda
    katılır. Döner: kenarın (ilk ön satır) alt_sapma'ya göre ofseti — bant yoksa +1 (alt_sapma zaten astardır)."""
    h = rgb.shape[0]
    xs = np.asarray(xs, int)
    xs = xs[(xs >= 0) & (xs < rgb.shape[1])]
    if not len(xs):
        return 1
    P = {}
    for o in range(-ust, 1):
        satir = np.clip(np.round(alt_sapma[xs]).astype(int) + o, 0, h - 1)
        P[o] = rgb[satir, xs].mean(0)
    L = np.mean([P[o] for o in range(-ust, -5)], 0)
    ofset = 1
    for o in range(0, -6, -1):
        if np.linalg.norm(P[o] - L) > esik:
            ofset = o
        else:
            break
    return ofset


def _yerel_temizle(x, y, yaricap: float = 10, esik_min: float = 4.0, tur: int = 2):
    """Biçimden bağımsız aykırı ayıklama: her nokta, ±`yaricap` px içindeki komşularına (kendisi hariç) uydurulan
    doğruya göre artığıyla tutulur (|artık| ≤ max(esik_min, 3·1,4826·MAD)). Dik eğrilerde (elips ucu) de çalışır.
    (tutulan x, tutulan y, tutulanların artık std'si)."""
    x, y = np.asarray(x, float), np.asarray(y, float)
    r = np.zeros(len(x))
    for _ in range(tur):
        r = np.full(len(x), np.nan)
        for i in range(len(x)):
            j = (np.abs(x - x[i]) <= yaricap) & (np.arange(len(x)) != i)
            if j.sum() >= 2 and np.ptp(x[j]) > 0:
                m, c = np.polyfit(x[j], y[j], 1)
                r[i] = y[i] - (m * x[i] + c)
        ok = np.isfinite(r)
        if ok.sum() < 3:
            break
        mad = np.median(np.abs(r[ok] - np.median(r[ok])))
        keep = ok & (np.abs(r) <= max(esik_min, 3 * 1.4826 * mad))
        if keep.all() or keep.sum() < 3:
            break
        x, y = x[keep], y[keep]
        r = r[keep]
    ok = np.isfinite(r)
    return x, y, float(np.std(r[ok])) if ok.any() else 0.0


def _saglam_uydur(x, y, derece: int, esik_min: float = 4.0, tur: int = 5):
    """Aykırıları atarak polinom uydurma (x normalize edilmiş olmalı). (katsayılar, tutulan x, tutulan y, artık std)."""
    x, y = np.asarray(x, float), np.asarray(y, float)
    for _ in range(tur):
        p = np.polyfit(x, y, derece)
        r = y - np.polyval(p, x)
        keep = np.abs(r) < max(esik_min, 2.5 * r.std())
        if keep.all() or keep.sum() < derece + 3:
            break
        x, y = x[keep], y[keep]
    p = np.polyfit(x, y, derece)
    r = y - np.polyval(p, x)
    return p, x, y, float(r.std()), float(np.abs(r).mean())


# ============================================================================= kapak (kapalı zarfın kapağı)

def kapak_kes(ec: Image.Image, bicim: str = "v", esik=(40, 30), ara: int = 14, kirp: int = 12, derece: int = 4,
              alt_sinir: float = 0.66, yedek_derinlik: float = 0.55):
    """envelope_closed → (kapak RGBA — satır 0'dan kapağın altına kırpılmış, tuval genişliğinde —, bilgi).

    Kapağın serbest kenarı: her sütunda üst kenardan aşağı, kapağın açık kenar şeridinden ön yüze düşen temas gölgesine
    en güçlü parlaklık düşüşü (`esik[0]` ilk geçiş, `esik[1]` izleme). `bicim`:
      "v"    (03, 01, 02, 05, 08, 10, 19, 20) — sol/sağ kanada iki doğru uydurulur, sonra her sütun bu V'nin ±`ara` px'inde
             yeniden aranır (tırtık/dalga/fisto izlenir), 7 sütun medyanı, V ± `kirp` ile sınırlanır (03'ün kesimi).
      "egri" (07 dikdörtgen, 11 kemer, 12 yuvarlak, 15 yuvarlak, 16 köşeleri yuvarlak kare, 17 çan/ogee) — ilk geçiş
             noktalarına aykırısız `derece`. dereceden polinom (eğri ön bilgisi), aynı izleme + yumuşatma; ilk geçişte
             kenar bulunan sütun aralığının dışında kapak yok sayılır (zarftan dar kapak: kenar = üst kenar).
    Yedek: yeterli nokta yoksa / uyum zayıfsa geometrik kenar (V: köşelerden ortadaki uca, derinlik = gövde
    yüksekliğinin `yedek_derinlik`'i; eğri: aynı derinlikte yarım elips) + UYARI (`bilgi["yontem"] = "geometrik"`).
    Menteşe satırı = kapalı zarfın üst kenarı (sütun medyanı)."""
    ec = ec.convert("RGBA")  # RGB/P/LA girdi de çalışsın (alfa kanalı a[..., 3])
    a = np.asarray(ec).astype(np.float64)
    al = a[..., 3]
    h, w = al.shape
    cols = np.flatnonzero(al.max(0) > 200)
    rows = np.flatnonzero(al.max(1) > 200)
    if not len(cols):
        raise ValueError("kapak_kes: opak piksel yok")
    x0, x1, y0, y1 = int(cols.min()), int(cols.max()), int(rows.min()), int(rows.max())
    lum = a[..., :3] @ LUM
    if bicim == "v":  # yatay hafif yumuşatma (doku gürültüsü); eğri kapağın dik uçlarında kenarı yayar → yalnız V
        lum = (np.roll(lum, 1, 1) + lum + np.roll(lum, -1, 1)) / 3
    cs = np.vstack([np.zeros((1, w)), np.cumsum(lum, 0)])

    def dusus(ylo, yhi, x):
        """y ∈ [ylo, yhi): (3 satır üst ort.) − (3 satır alt ort.); en büyüğü ve konumu."""
        ys = np.arange(max(ylo, 3), min(yhi, h - 4))
        if not len(ys):
            return ylo, -1e9
        ust = (cs[ys, x] - cs[ys - 3, x]) / 3
        alt = (cs[ys + 4, x] - cs[ys + 1, x]) / 3
        d = ust - alt
        i = int(np.argmax(d))
        return int(ys[i]), float(d[i])

    xm = (x0 + x1) / 2
    uyarilar = []
    yontem = "renk"
    ilk = {"L": [], "R": []}
    taranan = 0
    for x in range(x0 + 8, x1 - 8, 2):
        taranan += 1
        top = int(np.argmax(al[:, x] > 200))
        y, d = dusus(top + 8, int(y0 + alt_sinir * (y1 - y0)), x)
        if d > esik[0]:
            ilk["L" if x < xm else "R"].append((x, y))
    xs = np.arange(w)
    menteşe = int(np.median([np.argmax(al[:, x] > 200) for x in range(x0 + 40, x1 - 40)])) if x1 - x0 > 100 else y0
    derin = y0 + yedek_derinlik * (y1 - y0)
    bilgi_ek = {}

    if bicim == "v":
        def fit(p):
            p = np.array(p, float)
            for _ in range(5):
                m, c = np.polyfit(p[:, 0], p[:, 1], 1)
                r = p[:, 1] - (m * p[:, 0] + c)
                keep = np.abs(r) < max(4.0, 2.5 * r.std())
                if keep.all():
                    break
                p = p[keep]
            return m, c, len(p)

        gecerli = len(ilk["L"]) >= 8 and len(ilk["R"]) >= 8
        if gecerli:
            mL, cL, nL = fit(ilk["L"])
            mR, cR, nR = fit(ilk["R"])
            gecerli = abs(mL - mR) > 1e-3
            if gecerli:
                xt = (cR - cL) / (mL - mR)
                yt = mL * xt + cL
                gecerli = (x0 < xt < x1) and (y0 < yt < y1) and mL > 0 > mR
        if not gecerli:
            yontem = "geometrik"
            uyarilar.append(f"kapak kenarı (V) bulunamadı ({len(ilk['L'])}+{len(ilk['R'])} nokta) → geometrik V "
                            f"(uç gövde yüksekliğinin %{yedek_derinlik * 100:.0f}'inde); önizlemede gözle kontrol et")
            mL = (derin - menteşe) / max(xm - x0, 1)
            cL = menteşe - mL * x0
            mR = -(derin - menteşe) / max(x1 - xm, 1)
            cR = menteşe - mR * x1
            nL = nR = 0
            xt, yt = xm, derin
        v = np.minimum(mL * xs + cL, mR * xs + cR)
        kenar = v.copy()
        if yontem == "renk":
            for x in range(x0 + 2, x1 - 1):
                y, d = dusus(int(v[x]) - ara, int(v[x]) + ara + 1, x)
                if d > esik[1]:
                    kenar[x] = y + 1  # y: açık şeridin son satırı (dahil); kenar = ilk gölge satırı
        yum = kenar.copy()
        for x in range(x0 + 3, x1 - 3):
            yum[x] = np.median(kenar[x - 3:x + 4])
        yum = np.clip(yum, v - kirp, v + kirp)
        bilgi_ek = {"tip": [round(xt, 1), round(yt, 1)], "left": [round(mL, 4), round(cL, 2), nL],
                    "right": [round(mR, 4), round(cR, 2), nR]}
    elif bicim == "egri":
        pts = np.array(sorted(ilk["L"] + ilk["R"]), float).reshape(-1, 2)
        yarim = max((x1 - x0) / 2, 1)
        gecerli = len(pts) >= max(12, 0.4 * taranan)
        if gecerli:
            kx, ky, sd = _yerel_temizle(pts[:, 0], pts[:, 1])
            gecerli = len(kx) >= max(12, 0.35 * taranan) and sd <= max(3.0, 0.015 * (y1 - y0))
        if gecerli:
            xa, xb = kx.min(), kx.max()
            ust = np.array([np.argmax(al[:, x] > 200) if al[:, x].max() > 200 else y0 for x in range(w)], float)
            v = np.interp(xs, kx, ky)
            # aralığın dışı: uçtaki eğimle en çok `ara` px uzat (kapak köşesi), sonra kapak yok (kenar = üst kenar)
            for uc, sec, yon in ((xa, kx <= xa + 12, -1), (xb, kx >= xb - 12, 1)):
                m_ = np.polyfit(kx[sec], ky[sec], 1)[0] if sec.sum() >= 3 else 0.0
                dis = (xs - uc) * yon
                bolge = (dis > 0) & (dis <= ara)
                v[bolge] = (np.interp(uc, kx, ky) + m_ * (xs[bolge] - uc))
            disari = (xs < xa - ara) | (xs > xb + ara)
            v = np.clip(np.where(disari, ust, np.maximum(v, ust)), y0, y1)
            p = np.polyfit((kx - xm) / yarim, ky, min(derece, len(kx) - 1))
            kenar = v.copy()
            for x in range(x0 + 2, x1 - 1):
                if disari[x]:
                    continue
                y, d = dusus(int(v[x]) - ara, int(v[x]) + ara + 1, x)
                if d > esik[1]:
                    kenar[x] = y + 1
            yum = kenar.copy()
            for x in range(x0 + 3, x1 - 3):
                yum[x] = np.median(kenar[x - 3:x + 4])
            yum = np.clip(yum, v - kirp, v + kirp)
            bilgi_ek = {"curve": [round(float(c), 4) for c in p], "curve_x": [round(xa, 1), round(xb, 1)],
                        "points": int(len(kx)), "residual_sd": round(sd, 2)}
        else:
            yontem = "geometrik"
            uyarilar.append(f"kapak kenarı (eğri) bulunamadı ({len(pts)}/{taranan} sütunda geçiş) → geometrik yarım elips "
                            f"(derinlik gövdenin %{yedek_derinlik * 100:.0f}'i); önizlemede gözle kontrol et")
            u = np.clip((xs - xm) / yarim, -1, 1)
            yum = menteşe + (derin - menteşe) * np.sqrt(np.clip(1 - u * u, 0, 1))
        i = int(np.argmax(np.where((xs >= x0) & (xs <= x1), yum, -1)))
        bilgi_ek["tip"] = [round(float(i), 1), round(float(yum[i]), 1)]
    else:
        raise ValueError(f"kapak_kes: bilinmeyen biçim {bicim!r} (v | egri)")

    satir = np.arange(h)[:, None]
    kap = np.clip(yum[None, :] - satir, 0, 1)  # satır < kenar−1 → 1, satır ≥ kenar → 0 (1 px yumuşak geçiş)
    out = np.asarray(ec).copy()
    out[..., 3] = np.round(al * kap).astype(np.uint8)
    alt = int(np.ceil(yum[x0:x1 + 1].max())) + 2
    bilgi = {"canvas": [w, h], "rows": [0, alt], "hinge_row": menteşe}
    bilgi.update(bilgi_ek)
    if bicim != "v" or yontem != "renk":
        bilgi["shape"] = bicim
    bilgi["method"] = yontem
    if uyarilar:
        bilgi["warnings"] = uyarilar
    return Image.fromarray(out[:alt], "RGBA"), bilgi


# ============================================================================= ön cep

def cep_kes(im: Image.Image, bicim: str = "v", esik: float = 24, yedek=None, derece: int = 2):
    """envelope_open (ya da gatefold orta paneli) → (cep RGBA — aynı tuval —, bilgi). Cep = ön cebin üst kenarının altı.

    Gövde: alfa > 200 sütunlarının kutusu; gövde üstü = satır genişliğinin gövde genişliğinin %97'sine ulaştığı ilk satır.
    Kenar noktaları: her sütunda cebin kendi kağıdı (yerel referans) üzerinden yukarı çıkılıp ilk kalıcı renk sapması
    (4 satır ortalaması > `esik`; kesik kenarın açık şeridi ya da astar). `bicim`:
      "v"    (03 ve V cepli kapaklar) — referans tahmini V çizgisinin 70 px altından (astardaki çiçekler kağıda yakın renkte
             olduğu için "en güçlü geçiş" yanlış kenara oturuyordu, G035); sol/sağ kanada aykırısız doğru; kesim kenarı
             2 px yukarı (kesik kenarın açık şeridi cepte kalsın) — 03'ün onaylı kesimi, sayılar değişmez.
      "duz"  (gatefold orta cebi 06/14, düz cepler) — referans gövdenin alt bandından, aykırısız doğru (hafif eğim serbest).
      "egri" (11 kemer cep, hafif eğri kenar) — aynı tarama, aykırısız `derece`. dereceden polinom.
    duz/egri: nokta = ön kağıdın hemen üstündeki ilk farklı satır; kenar bandı (açık kesik şeridi, altın çizgi) astardan
    ayrılır (`_bant_ofseti`: kenar boyunca ortalama renk profili) ve cebe dahil edilir — 1 px'lik altın çizgi de cepte
    kalır, astar saçağı girmez. Alfa < 200 pikseller (gölge, kenar yumuşaması) cebe alınmaz — arka katmanda zaten var.
    Yedek: nokta < %40 sütun, artık büyük ya da kenar gövde dışında → geometrik kenar `yedek` = (uçlarda, ortada) gövde
    yüksekliği oranı (vars. v (0.10, 0.62), duz (0.65, 0.65), egri (0.45, 0.42)) + UYARI.
    Gövde üstü bulunamazsa (hiçbir satır %97'ye ulaşmıyor: gövde ≥ ~2° eğik ya da yanında ayrı bir yaprak/parça var)
    gövde = en büyük opak bölge, üst = `_govde` medyanı + UYARI (çökme yok; kesim yine yukarıdaki yollardan)."""
    im = im.convert("RGBA")  # RGB/P/LA girdi de çalışsın (alfa kanalı a[..., 3])
    a = np.asarray(im).astype(np.float64)
    al = a[..., 3]
    h, w = al.shape
    op = al > 200
    cols = np.flatnonzero(op.any(0))
    if not len(cols):
        raise ValueError("cep_kes: opak piksel yok")
    x0, x1 = int(cols.min()), int(cols.max())
    widths = op.sum(1)
    satirlar = np.flatnonzero(widths >= (x1 - x0) * 0.97)
    govde_uyari = []
    if len(satirlar):
        body_top = int(satirlar[0])
        body_bot = int(np.flatnonzero(op.any(1)).max())
    else:
        # gövdeye değmeyen parça (yaprak, dal) sütun açıklığını genişletir; eğik gövdede satırlar köşeden köşeye ulaşmaz
        gov = en_buyuk_bolge(op)
        gc, gr = np.flatnonzero(gov.any(0)), np.flatnonzero(gov.any(1))
        x0, x1 = int(gc.min()), int(gc.max())
        satirlar = np.flatnonzero(gov.sum(1) >= (x1 - x0) * 0.97)
        g = _govde(gov.astype(np.uint8) * 255)
        body_top = int(satirlar[0]) if len(satirlar) else int(g["top"])
        body_bot = int(gr.max())
        govde_uyari.append(
            f"ön cep: gövde üstü sütun açıklığından bulunamadı (hiçbir satır %97'ye ulaşmıyor — gövde eğik ya da yanında "
            f"ayrı parça var) → en büyük opak bölge, gövde {x0}–{x1} × {body_top}–{body_bot}; önizlemede gözle kontrol et")
    Bh = max(body_bot - body_top, 1)
    xm = (x0 + x1) / 2
    rgb = a[..., :3]
    yedek = yedek or {"v": (0.10, 0.62), "duz": (0.65, 0.65), "egri": (0.45, 0.42)}[bicim]
    uyarilar = []

    def tara(x, y_start, y_stop):
        if y_start - 24 < 0:
            return None
        ref = np.median(rgb[y_start - 24:y_start, max(0, x - 3):x + 4].reshape(-1, 3), 0)
        d = np.sqrt(((rgb[:, x] - ref) ** 2).sum(-1))
        for y in range(y_start - 24, max(y_stop, 3), -1):  # y − 3 ≥ 0 (tuvalin üstüne taşan pencere boş dilim olmasın)
            if d[y - 3:y + 1].mean() > esik:
                return y
        return None

    if bicim == "v":
        tip0 = body_top + 0.62 * (body_bot - body_top)

        def guess(x):
            f = 1 - abs(x - xm) / (xm - x0)
            return body_top + 35 + f * (tip0 - body_top - 35)

        pts = {"L": [], "R": []}
        for x in range(x0 + 20, x1 - 20, 3):
            if abs(x - xm) < 30:
                continue
            g = guess(x)
            by = tara(x, int(min(g + 70, body_bot - 12)), int(g - 90))
            if by is not None:
                pts["L" if x < xm else "R"].append((x, by))

        def fit(p):
            p = np.array(p, float)
            for _ in range(4):  # aykırıları at
                m, c = np.polyfit(p[:, 0], p[:, 1], 1)
                r = p[:, 1] - (m * p[:, 0] + c)
                keep = np.abs(r) < max(2.5, 2.5 * r.std())
                if keep.all():
                    break
                p = p[keep]
            return m, c, float(np.abs(p[:, 1] - (m * p[:, 0] + c)).mean()), len(p)

        gecerli = len(pts["L"]) >= 8 and len(pts["R"]) >= 8
        if gecerli:
            mL, cL, eL, nL = fit(pts["L"])
            mR, cR, eR, nR = fit(pts["R"])
            gecerli = abs(mL - mR) > 1e-3 and max(eL, eR) <= max(3.0, 0.02 * Bh)
            if gecerli:
                xt = (cR - cL) / (mL - mR)
                yt = mL * xt + cL
                gecerli = x0 < xt < x1 and body_top < yt < body_bot
        if not gecerli:
            # ikinci yöntem: tools/parts_prep.cep_kes (gövdenin alt bandı referans + doku eşiği + tek kırılımlı doğru;
            # 01'in lifli kağıdında çalışıyor, 03'te geometrik'e düşüyordu — iki yöntem birbirini tamamlıyor)
            from parts_prep import cep_kes as pp_cep_kes  # geç içe aktarma (parts_prep → kit_check → tema_build)
            try:
                pp_cep, pp_bilgi, _ = pp_cep_kes(np.asarray(im.convert("RGBA")).copy())
            except ValueError:
                pp_bilgi = {"yontem": "hata"}
            if pp_bilgi.get("yontem") == "renk":
                info = {"body": [x0, body_top, x1, body_bot], "shape": "v", "method": "renk",
                        "detector": "parts_prep.cep_kes",
                        "edge_left_mid_right": pp_bilgi["kenar_sol_orta_sag"], "residual_mad": pp_bilgi["artik_mad_px"],
                        "first_detector": f"G035 V: {len(pts['L'])}+{len(pts['R'])} nokta, uyum zayıf"}
                if govde_uyari:
                    info["warnings"] = govde_uyari
                return Image.fromarray(pp_cep, "RGBA"), info
            yu, yo = body_top + yedek[0] * Bh, body_top + yedek[1] * Bh
            mL = (yo - yu) / max(xm - x0, 1)
            cL = yu - mL * x0
            mR = -(yo - yu) / max(x1 - xm, 1)
            cR = yu - mR * x1
            eL = eR = 0.0
            nL = nR = 0
            xt, yt = xm, yo
            uyarilar.append(f"ön cep kenarı (V) bulunamadı ({len(pts['L'])}+{len(pts['R'])} nokta; parts_prep yöntemi de "
                            "bulamadı) → geometrik V; önizlemede gözle kontrol et")
        # imzalı mesafe (aşağısı +): V kenarı y_edge(x) = min(sol(x), sağ(x)); cep bunun altı. Kenar 2 px kağıda.
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
        dL = (yy - (mL * xx + cL)) / np.sqrt(1 + mL * mL)
        dR = (yy - (mR * xx + cR)) / np.sqrt(1 + mR * mR)
        d = np.maximum(dL, dR) + 2.0
        cut = np.clip(d + 0.5, 0, 1)
        cut[:body_top] = 0
        info = {"body": [x0, body_top, x1, body_bot], "tip": [round(xt, 1), round(yt, 1)],
                "left": [round(mL, 4), round(cL, 2), round(eL, 2), nL],
                "right": [round(mR, 4), round(cR, 2), round(eR, 2), nR]}
        yontem = "renk" if not uyarilar else "geometrik"
    elif bicim in ("duz", "egri"):
        pts = []
        taranan = 0
        for x in range(x0 + 12, x1 - 12, 3):
            ys = np.flatnonzero(al[:, x] > 200)
            if not len(ys):
                continue
            taranan += 1
            y_start = int(ys.max() - max(12, 0.06 * Bh))
            by = _alttan_tara(rgb, x, y_start, body_top + 4, esik)
            if by is not None:
                pts.append((x, by))
        yarim = max((x1 - x0) / 2, 1)
        derece_ = 1 if bicim == "duz" else derece
        gecerli = len(pts) >= max(10, 0.4 * taranan)
        if gecerli:
            pts_ = np.array(pts, float)
            p, kx, ky, sd, ort = _saglam_uydur((pts_[:, 0] - xm) / yarim, pts_[:, 1], derece_, esik_min=2.5)
            orn = np.polyval(p, np.linspace(-1, 1, 21))
            icinde = (orn >= body_top - 0.08 * Bh) & (orn <= body_bot - 0.1 * Bh)
            gecerli = len(kx) >= max(10, 0.35 * taranan) and ort <= max(2.0, 0.015 * Bh) and icinde.mean() >= 0.9
        if gecerli:
            alt_sapma = np.polyval(p, (np.arange(w) - xm) / yarim)
            ofset = _bant_ofseti(rgb, (xm + kx * yarim).astype(int), alt_sapma, esik)
            kenar = alt_sapma + ofset
            yontem = "renk"
            info_ek = {"curve": [round(float(c), 4) for c in p], "edge_band_offset": ofset, "points": int(len(kx)),
                       "residual_mean": round(ort, 2)}
            cut = _alt_maske(h, w, kenar, kaydir=0.5)
        else:
            u = np.clip((np.arange(w) - xm) / yarim, -1, 1)
            kenar = body_top + (yedek[0] + (yedek[1] - yedek[0]) * (1 - u * u)) * Bh
            yontem = "geometrik"
            uyarilar.append(f"ön cep kenarı ({bicim}) bulunamadı ({len(pts)}/{taranan} sütunda geçiş) → geometrik kenar "
                            f"(gövde yüksekliğinin %{yedek[0] * 100:.0f}–%{yedek[1] * 100:.0f}'i); önizlemede gözle kontrol et")
            info_ek = {}
            cut = _alt_maske(h, w, kenar, kaydir=0.5)
        cut[:body_top] = 0
        info = {"body": [x0, body_top, x1, body_bot], "shape": bicim,
                "edge_left_mid_right": [[x0, round(float(kenar[x0]), 1)], [round(xm, 1), round(float(kenar[int(xm)]), 1)],
                                        [x1, round(float(kenar[x1]), 1)]]}
        info.update(info_ek)
    else:
        raise ValueError(f"cep_kes: bilinmeyen biçim {bicim!r} (v | duz | egri)")
    pa = al * cut
    pa[al < 200] = 0  # gölge ve kenar AA'sı arka katmanda zaten var; ikilenmesin
    out = np.asarray(im).copy()
    out[..., 3] = np.round(pa).astype(np.uint8)
    if bicim != "v" or yontem != "renk":
        info.setdefault("shape", bicim)
    info["method"] = yontem
    if govde_uyari or uyarilar:
        info["warnings"] = govde_uyari + uyarilar
    return Image.fromarray(out, "RGBA"), info


# ============================================================================= gatefold (kapi)

def dikis_bul(kapali, bant: float = 0.12, esik: float = 10.0):
    """Kapalı gatefold'un orta dikişi: alfa kutusunun ortasının ± `bant` (kutu genişliği oranı) içinde en koyu ya da
    boşluklu sütun (kat_bul). Bulunamazsa kutu ortası + UYARI. Döner {x, method, score, box, warnings?}."""
    ka = _rgba_dizi(kapali)
    b = alfa_kutusu(ka[..., 3])
    if b is None:
        raise ValueError("dikis_bul: opak piksel yok")
    xm = (b[0] + b[2]) / 2
    x, skor = kat_bul(ka, xm, bant * (b[2] - b[0]), esik)
    bilgi = {"box": list(b), "score": round(skor, 1)}
    if x is None:
        bilgi.update({"x": xm, "method": "geometrik",
                      "warnings": [f"gatefold dikişi bulunamadı (skor {skor:.1f} < {esik}) → kutu ortası; önizlemede kontrol et"]})
    else:
        bilgi.update({"x": round(x, 1), "method": "renk"})
    return bilgi


def kapi_kes(kapali, acik, dikis=None, kat_bant: float = 0.03, cep_bicim: str = "duz", cep_esik: float = 24):
    """Gatefold (06, 14) — docs/11 §7.4. (parçalar {ad: RGBA tam tuval}, bilgi).
    Kapalı: `door_l` (dikişin solu), `door_r` (sağı). Açık: `center` = katlanma çizgileri arası (kapalı kutunun içi),
    `door_l_in` / `door_r_in` = dışı, `pocket` = orta panelin ön cebi (cep_kes, vars. düz kenar). Katlanma çizgisi açık
    görselde kapalı x0/x1 ± `kat_bant` × tuval genişliği içinde en koyu/boşluklu sütun; bulunamazsa kapalı kenar + UYARI.
    Kapalı ve açık görsel aynı tuvalde olmalı (PAKET 5)."""
    ka, ac = _rgba_dizi(kapali), _rgba_dizi(acik)
    if ka.shape != ac.shape:
        raise ValueError(f"kapi_kes: kapalı {ka.shape[1]}×{ka.shape[0]} ve açık {ac.shape[1]}×{ac.shape[0]} aynı tuvalde değil")
    h, w = ka.shape[:2]
    d = dikis if dikis is not None else dikis_bul(ka)
    uyarilar = list(d.get("warnings", []))
    sol = _sutun_maske(h, w, d["x"])
    parcalar = {"door_l": _alfa_carp(ka, sol), "door_r": _alfa_carp(ka, 1 - sol)}
    b = alfa_kutusu(ka[..., 3])
    katlar, yontem = [], d["method"]
    for ad, xk in (("sol", b[0]), ("sağ", b[2])):
        x, _ = kat_bul(ac, xk, kat_bant * w)
        if x is None:
            x = float(xk)
            yontem = "geometrik"
            uyarilar.append(f"açık gatefold {ad} katlanma çizgisi bulunamadı → kapalı kenar x={xk}; önizlemede kontrol et")
        katlar.append(x)
    fl, fr = katlar
    msol, msag = _sutun_maske(h, w, fl), _sutun_maske(h, w, fr)
    orta = msag - msol
    parcalar.update({"door_l_in": _alfa_carp(ac, msol), "center": _alfa_carp(ac, orta),
                     "door_r_in": _alfa_carp(ac, 1 - msag)})
    cep, cep_bilgi = cep_kes(parcalar["center"], cep_bicim, esik=cep_esik)
    parcalar["pocket"] = cep
    uyarilar += cep_bilgi.get("warnings", [])
    if cep_bilgi["method"] != "renk":
        yontem = "geometrik"
    bilgi = {"seam": d, "folds": [round(fl, 1), round(fr, 1)], "closed_box": list(b), "pocket": cep_bilgi,
             "method": yontem}
    if uyarilar:
        bilgi["warnings"] = uyarilar
    return parcalar, bilgi


# ============================================================================= kitap

def kitap_kes(kapali, acik, bant: float = 0.04, esik: float = 10.0):
    """Kitap (13) — docs/11 §7.5. (parçalar {cover, cover_in, page}, bilgi). Kapalı kitap = `cover` (sırt = alfa
    kutusunun sol kenarı, menteşe orada). Açık: oluk (sırt) = kapalı sırtın ± `bant` × tuval genişliği içinde en
    koyu/boşluklu sütun; solu `cover_in`, sağı `page` (sayfa çevirme: `page` kopyası, arka yüzü aynalı `page`, CSS).
    Oluk bulunamazsa kapalı sırt + UYARI."""
    ka, ac = _rgba_dizi(kapali), _rgba_dizi(acik)
    if ka.shape != ac.shape:
        raise ValueError("kitap_kes: kapalı ve açık aynı tuvalde değil")
    h, w = ka.shape[:2]
    b = alfa_kutusu(ka[..., 3])
    if b is None:
        raise ValueError("kitap_kes: opak piksel yok")
    x, skor = kat_bul(ac, b[0], bant * w, esik)
    uyarilar, yontem = [], "renk"
    if x is None:
        x, yontem = float(b[0]), "geometrik"
        uyarilar.append(f"açık kitapta sırt (oluk) bulunamadı (skor {skor:.1f}) → kapalı kapağın sol kenarı x={b[0]}; "
                        "önizlemede kontrol et")
    sol = _sutun_maske(h, w, x)
    parcalar = {"cover": Image.fromarray(ka.copy(), "RGBA"), "cover_in": _alfa_carp(ac, sol), "page": _alfa_carp(ac, 1 - sol)}
    sayfa = alfa_kutusu(np.asarray(parcalar["page"])[..., 3])
    bilgi = {"spine": round(x, 1), "spine_score": round(skor, 1), "cover_box": list(b),
             "page_box": list(sayfa) if sayfa else None, "method": yontem}
    if uyarilar:
        bilgi["warnings"] = uyarilar
    return parcalar, bilgi


# ============================================================================= kese (ağız yayı)

def kese_kes(acik, esik: float = 24, ara: int = 10, kirp: int = 8, yedek=(0.10, 0.20), kenar_pay: float = 0.08):
    """Açık kese (09) — docs/11 §7.6. (parçalar {pouch_back, pouch_front}, bilgi). Ön duvar = ağız ovalinin alt yayının
    altı. Her sütunda (kesenin kenarlarından `kenar_pay` içeride) ön duvarın kendi kumaşı referans alınıp yukarı çıkılır;
    ilk kalıcı renk sapması (astar ya da ağız kenarı) yay noktasıdır. Aykırısız 2. derece uydurma (yay ön bilgisi; ortası
    uçlarından aşağıda olmalı — "gülümseme"), ±`ara` px'te yeniden arama, 7 sütun medyanı, uydurma ± `kirp` ile sınır;
    ağız kenarının bandı (krem kenar şeridi) astardan ayrılıp ön duvara katılır (`_bant_ofseti`, cep_kes gibi).
    `pouch_back` = açık görselin tamamı (ön duvar aynı piksellerle üstüne biner, dikiş yok).
    Yedek: geometrik yay — uçlar alfa kutusunun üstünden yüksekliğin `yedek[0]`'ı, orta `yedek[1]`'i aşağıda + UYARI."""
    ac = _rgba_dizi(acik)
    a = ac.astype(np.float64)
    al = a[..., 3]
    h, w = al.shape
    b = alfa_kutusu(al, 200)
    if b is None:
        raise ValueError("kese_kes: opak piksel yok")
    x0, y0, x1, y1 = b
    H = y1 - y0
    xm, yarim = (x0 + x1) / 2, max((x1 - x0) / 2, 1)
    rgb = a[..., :3]
    pts, taranan = [], 0
    for x in range(int(x0 + kenar_pay * (x1 - x0)), int(x1 - kenar_pay * (x1 - x0)), 3):
        col = np.flatnonzero(al[:, x] > 200)
        if not len(col):
            continue
        taranan += 1
        y_start = int(col.min() + 0.75 * (col.max() - col.min()))
        by = _alttan_tara(rgb, x, y_start, int(col.min()) + 2, esik)
        if by is not None:
            pts.append((x, by))
    uyarilar, yontem = [], "renk"
    xs = np.arange(w)
    gecerli = len(pts) >= max(10, 0.5 * taranan)
    if gecerli:
        pts_ = np.array(pts, float)
        p, kx, ky, sd, ort = _saglam_uydur((pts_[:, 0] - xm) / yarim, pts_[:, 1], 2, esik_min=3.0)
        gecerli = len(kx) >= max(10, 0.4 * taranan) and ort <= max(2.5, 0.012 * H) and p[0] <= 0.02 * H
    if gecerli:
        v = np.clip(np.polyval(p, (xs - xm) / yarim), y0, y1)
        kenar = v.copy()
        for x in range(x0, x1):
            col = np.flatnonzero(al[:, x] > 200)
            if not len(col) or int(v[x]) + ara + 30 >= h:
                continue
            by = _alttan_tara(rgb, x, min(int(v[x]) + ara + 24, h - 1), max(int(v[x]) - ara, 3), esik)
            if by is not None and abs(by - v[x]) <= ara:
                kenar[x] = by
        yum = kenar.copy()
        for x in range(x0 + 3, x1 - 3):
            yum[x] = np.median(kenar[x - 3:x + 4])
        yum = np.clip(yum, v - kirp, v + kirp)
        ofset = _bant_ofseti(rgb, (xm + kx * yarim).astype(int), yum, esik)
        yum = yum + ofset
        bilgi = {"curve": [round(float(c), 4) for c in p], "edge_band_offset": ofset, "points": int(len(kx)),
                 "residual_mean": round(ort, 2)}
    else:
        u = np.clip((xs - xm) / yarim, -1, 1)
        yum = y0 + (yedek[0] + (yedek[1] - yedek[0]) * (1 - u * u)) * H
        yontem = "geometrik"
        uyarilar.append(f"kese ağız yayı bulunamadı ({len(pts)}/{taranan} sütunda geçiş) → geometrik yay; "
                        "önizlemede gözle kontrol et")
        bilgi = {}
    on = _alt_maske(h, w, yum, kaydir=0.5)  # yum = ön duvarın ilk satırı (ağız kenarı bandı dahil, _bant_ofseti)
    parcalar = {"pouch_back": Image.fromarray(ac.copy(), "RGBA"), "pouch_front": _alfa_carp(ac, on)}
    bilgi.update({"box": [x0, y0, x1, y1], "rim_left_mid_right": [[x0, round(float(yum[x0]), 1)],
                  [round(xm, 1), round(float(yum[int(xm)]), 1)], [x1 - 1, round(float(yum[x1 - 1]), 1)]],
                  "method": yontem})
    if uyarilar:
        bilgi["warnings"] = uyarilar
    return parcalar, bilgi


# ============================================================================= aydınger kılıf (üst şerit)

def kilif_serit(kapali, acik, esik: int = 64, oran: float = 0.004, pay: int = 6, ust_sinir: float = 0.5,
                yedek_oran: float = 0.15):
    """Vellum kılıf (18) — docs/11 §7.7 `flare`. Kapalı ve açık kılıf yalnız üst kenarda (açılan ağız) farklıdır: tüm
    kılıfı çapraz soldurmak yerine yalnız üst şerit takas edilir, gövde tek nesne kalır (hayalet çift kenar olmaz).
    Şerit sınırı = kılıfın üst yarısında (`ust_sinir`) iki alfanın > `esik` farklı olduğu (satır genişliğinin
    > `oran`'ı) son satır + `pay`. (parçalar {sleeve_band, sleeve_open_band, sleeve_body}, bilgi). Parçalar örtüşmez
    (yarı saydam aydınger üst üste binince koyu çizgi olur): şerit satır < y_cut, gövde satır ≥ y_cut.
    Yedek: fark yoksa (ya da tuvaller farklıysa) kılıf yüksekliğinin `yedek_oran`'ı + UYARI. Alt yarıda da fark varsa
    (hiza kayması) UYARI."""
    ka, ac = _rgba_dizi(kapali), _rgba_dizi(acik)
    uyarilar, yontem = [], "alfa"
    b = alfa_kutusu(ka[..., 3], 64)
    if b is None:
        raise ValueError("kilif_serit: opak piksel yok")
    x0, y0, x1, y1 = b
    if ka.shape != ac.shape:
        uyarilar.append("kapalı ve açık kılıf aynı tuvalde değil → geometrik şerit")
        y_cut = int(y0 + yedek_oran * (y1 - y0))
        ac = np.asarray(Image.fromarray(ac).resize((ka.shape[1], ka.shape[0]), Image.LANCZOS))
        yontem = "geometrik"
    else:
        fark = np.abs(ka[..., 3].astype(np.int16) - ac[..., 3].astype(np.int16)) > esik
        satir = fark.sum(1) > oran * ka.shape[1]
        sinir = int(y0 + ust_sinir * (y1 - y0))
        ust = np.flatnonzero(satir[:sinir])
        alt = np.flatnonzero(satir[sinir:])
        if len(alt):
            uyarilar.append(f"kılıfın alt yarısında da {len(alt)} satır farklı (kapalı/açık hizası kaymış olabilir; "
                            "kit_check hiza)")
        if len(ust):
            y_cut = int(min(ust.max() + 1 + pay, sinir))
        else:
            y_cut = int(y0 + yedek_oran * (y1 - y0))
            yontem = "geometrik"
            uyarilar.append(f"kapalı ve açık kılıfın üst kenarında fark bulunamadı → geometrik şerit (kılıfın "
                            f"%{yedek_oran * 100:.0f}'i); önizlemede kontrol et")
    h, w = ka.shape[:2]
    m = (np.arange(h) < y_cut).astype(np.float64)[:, None] * np.ones((1, w))
    parcalar = {"sleeve_band": _alfa_carp(ka, m), "sleeve_open_band": _alfa_carp(ac, m), "sleeve_body": _alfa_carp(ka, 1 - m)}
    bilgi = {"box": list(b), "cut_row": y_cut, "band_pct_of_sleeve": round(100 * (y_cut - y0) / max(y1 - y0, 1), 2),
             "method": yontem}
    if uyarilar:
        bilgi["warnings"] = uyarilar
    return parcalar, bilgi


# ============================================================================= yırtma şeridi (04)

def serit_farki(kapali, acik, esik: int = 64, acma: int = 2, min_oran: float = 0.002):
    """04 yırtma şeridi — `envelope_open` = `envelope_closed`'un şeritsiz düzenlemesi: şerit = kapalı alfa − açık alfa
    (> `esik`), `acma` px morfolojik açmayla kenar yumuşaması farkı (1–2 px saçak) atılır. (parçalar {env_strip,
    env_open}, bilgi). Şerit kapalının alanının `min_oran`'ından küçükse UYARI (düzenleme şeridi kaldırmamış olabilir)."""
    ka, ac = _rgba_dizi(kapali), _rgba_dizi(acik)
    if ka.shape != ac.shape:
        raise ValueError("serit_farki: kapalı ve açık aynı tuvalde değil")
    fark = (ka[..., 3].astype(np.int16) - ac[..., 3].astype(np.int16)) > esik
    m = genislet(~genislet(~fark, acma), acma) if acma > 0 else fark
    if m.any():
        m = genislet(m, 1) & (ka[..., 3] > 0)
    uyarilar = []
    alan = int(m.sum())
    if alan < min_oran * max(int((ka[..., 3] >= 128).sum()), 1):
        uyarilar.append(f"şerit farkı çok küçük ({alan} px) — açık görsel şeridi kaldırmamış olabilir")
    parcalar = {"env_strip": _alfa_carp(ka, m.astype(np.float64)), "env_open": Image.fromarray(ac.copy(), "RGBA")}
    k = alfa_kutusu(m.astype(np.uint8) * 255)
    bilgi = {"strip_box": list(k) if k else None, "strip_px": alan, "method": "alfa"}
    if uyarilar:
        bilgi["warnings"] = uyarilar
    return parcalar, bilgi


# ============================================================================= zarf tipi (GPT_PROMPTS başlığından)

def zarf_tipi_basliktan(baslik: str | None) -> str:
    """'#### W2.3 Kapalı zarf (gatefold, iki kapı) — …' → 'kapi'. Parantez yoksa 'kapak' (katalog `ZARF_TIPI` adları)."""
    if not baslik:
        return "kapak"
    m = re.search(r"\(([^)]+)\)", baslik)
    if not m:
        return "kapak"
    try:
        from katalog import ZARF_TIPI
        adlar = {v[0]: k for k, v in ZARF_TIPI.items()}
    except Exception:  # noqa: BLE001 — katalog yoksa bilinen adlar
        adlar = {"kapaklı zarf": "kapak", "gatefold, iki kapı": "kapi", "kitap kapağı": "kitap", "keten kese": "kese",
                 "vellum kılıf": "kilif"}
    return adlar.get(m.group(1).strip(), "kapak")
