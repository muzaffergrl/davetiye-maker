"""GPT parçalarını Canva katmanına hazırlar — yalnız teknik hazırlık (K21): kırpma, yeşil pencere, ön cep.

  python3 tools/parts_prep.py <koleksiyon> [--out kit_layers] [--esik 150] [--pay 8] [--comps] [--strict] [--json]

Örnek:  python3 tools/parts_prep.py collections/03_Blush_Garden_Rose

Parça listesi koleksiyonun `assets/gpt/GPT_PROMPTS.md` dosyasındaki `**Kaydet:**` satırlarından okunur
(kit_check.beklenenler); yalnız PAKET 4 (video, tasarım 03) ya da PAKET 5 (website, K22–K24) bölümündeki — ya da
PAKET başlığı olmayan — `/parts/` satırları işlenir; aynı yol iki pakette varsa sonraki geçerlidir (`--comps` ile
`/comps/` pencereleri de ölçülür). PAKET 5 parçaları website katmanıdır: opak dikey görsel (ör. `bg_page.png`)
9:16'ya kırpılmaz, video ölçülerine büyütülmez → `<ad>.jpg` (pencere varsa `.png`); PAKET 5 comp'larının pencereleri
comp'un kendi piksel koordinatında ölçülür (`koordinat: kaynak`). Kaynak yolu `.../assets/gpt/<alt yol>` ise `<koleksiyon>/assets/gpt/<alt yol>`'dan okunur
(varyant/test kökleri de çalışsın diye). Eksik kaynak → uyarı, atlanır (GPT görselleri henüz yoksa normal).

Çıktı `<koleksiyon>/<--out>` (vars. `kit_layers/`). `assets/` altındaki bir klasöre hiçbir koşulda yazılmaz
(GPT ham dosyaları ve dondurulmuş maskeler korunur). Göreli `--out` koleksiyon köküne göredir.

İşlemler:
  1. Opak dikey görsel (ör. `bg_scene.png`, 2:3; yalnız PAKET 4/video) → 9:16 merkez kırpma → `<ad>_1080x1920.jpg` ve
     `<ad>_2160x3840.jpg` (kalite 92). 1024×1536 kaynaktan 2160×3840 ×2,5 BÜYÜTMEDİR, ayrıntı eklemez
     (özet bunu uyarı olarak yazar). Opak yatay/kare görsel (ör. `web_hero.png`) kırpılmaz → `<ad>.jpg`.
  2. Şeffaf parça (prompt satırında **Şeffaf zemin**) → alfa kutusuna kırpılır (alfa > 8) + `--pay` px
     pay → `<ad>.png`. Alfa kanalı yoksa uyarı verilir, kırpılmadan PNG yazılır.
  3. `#00FF00` pencereleri: yeşil baskınlığı G − max(R, B) ≥ `--esik` (vars. 150) ve G ≥ `--esik` olan
     pikseller (şeffaf parçada yalnız alfa ≥ 128). Kanal başına ±40 toleransı kullanılmaz: GPT'nin "düz
     #00FF00"ı gerçekte ≈ (3, 252, 40–46) çıkıyor (tasarım 03 comp'ları); B > 40 pencereyi parçalıyordu.
     Bağlı bölgeler en büyükten başlayarak alınır (8-komşuluk, mockup_compose.en_buyuk_bolge). Görsel
     alanının %0,1'inden (en az 256 px) küçük yeşil parçalar bir pencereye kısa kenarın %1'i kadar
     yakınsa ona katılır (çiçeklerin arasından görünen pencere), uzaktakiler pencere sayılmaz, uyarıyla
     kalır. Her bölge küçük bir kapanışla (2 px) iç lekelerden temizlenir. Pencere tam şeffaf yapılır;
     kenardaki yarı yeşil (anti-alias) pikseller yerel zemin rengine göre ayrıştırılır (piksel = c·yeşil + (1−c)·zemin →
     alfa × (1−c), renk = zemin) ve 2 px halkada kalan yeşil baskınlığı G → max(R, B) kırpılarak
     temizlenir (mockup_compose'daki yöntemin genellenmiş hâli). Şeffaf delikteki RGB, Canva ölçeklerken
     yeşil sızmasın diye çerçeve rengine boyanır. Pencere içeren opak görsel JPG yerine PNG yazılır.
     Pencereler soldan sağa sıralanır; her biri `windows.json`'a çıktı katmanının piksel koordinatında
     `[x, y, w, h]` kutusuyla ve `masks/<katman>_w<N>.png` şekil maskesiyle (beyaz, alfa = pencere
     kapsaması, kutu boyutunda) yazılır — Canva'da foto alanını aynı kemer şekline getirmek için.
  4. `envelope_open.png` → `envelope_pocket_front.png`: zarfın ön cebi, kırpılmış `envelope_open.png` ile
     AYNI TUVAL boyutunda ayrı katman (Canva'da ikisi aynı x/y/w/h ile konur; sıra: zarf → kart → cep).
     Cep sınırı: zarf gövdesinin alt bandındaki kağıt rengi referans alınır; her sütunda aşağıdan yukarı
     çıkılıp renk farkı ya da doku (yerel std) eşiği aşan, gövde yüksekliğinin ≥%2,5'i kadar süren ilk
     bölge bulunur (ince dikiş/gölge çizgileri atlanır), sınır ±6 satırda en güçlü dikey renk geçişine
     oturtulur; sınır noktalarına tek kırılımlı parçalı doğru
     uydurulur (düz, V ya da ters V kenar). Uyum zayıfsa ya da sınır gövde dışına düşerse geometrik V
     kenar (gövde üstünden %10 → ortada %42) kullanılır ve UYARI basılır. Düşük alfalı (< 64) gölge
     pikselleri cep katmanına alınmaz (üst üste binince gölge koyulaşmasın).
  5. Prompt bloğunda `#00FF00` geçen parçada pencere bulunamazsa uyarı verilir (foto alanı kaydı yok).
  6. `--comps`: comp'lar (2:3 opak) 9:16 / 1080×1920'ye kırpılmış gibi ölçülür; katman yazılmaz, yalnız
     pencere kutuları + maskeler `windows.json` → `comp_pencereleri` altına (video sayfası koordinatı).

`windows.json`: {"pencereler": {parça: [{katman, katman_olcu, kutu, maske, alan_px, doluluk}]},
"comp_pencereleri": {...}, "katmanlar": [...], "cep": {...}, "uyarilar": [...]}.

Sınırlar (dürüst):
  - Yeni şekil çizmez, görseli yeniden tasarlamaz; yalnız kırpar, maskeler, keser.
  - Pencere bulma renk eşiğine dayanır: GPT yeşili düz değilse (doku, gölge, gradyan) ya da pencere
    yeşil baskınlığı `--esik`in altına düşmüşse bölge eksik kalır; kenarda zayıf yeşil yansıma kalabilir. Sonuç
    önizlemede gözle kontrol edilmelidir (G031).
  - Cep kesimi sezgiseldir: cep ile zarfın iç yüzü aynı renk/dokudaysa ya da cep kenarı yalnız ince bir
    çizgiyse sınır bulunamaz → geometrik V'ye düşer (uyarılı); geometrik V gerçek cebi tutmayabilir.
    Kıvrımlı (dalgalı/kemerli) cep kenarı iki doğruyla yaklaşık izlenir. Zarfın dik, önden ve gövdesinin
    kare olduğu (prompt T2.4) varsayılır; eğik/döndürülmüş zarfta sonuç güvenilmez.
  - Gölge parçası cep katmanından çıkarıldığı için cep katmanı tek başına gölgesizdir.
  - Ölçü/oran denetimi kit_check.py'nin işidir; burada yalnız uyarı verilir.
Çıkış kodu: 0 = en az bir parça işlendi (eksikler uyarı); 1 = hiç parça işlenmedi, bir kaynak açılamadı
ya da `--strict` ile eksik kaynak / bulunamayan pencere / geometrik cep; 2 = kullanım hatası
(GPT_PROMPTS.md yok, parça satırı yok, çıktı yolu `assets/` altında). Bağımlılık: yalnız Pillow + numpy.
"""
import argparse
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ARACLAR = Path(__file__).resolve().parent
ROOT = ARACLAR.parent
sys.path.insert(0, str(ARACLAR))
from kit_check import beklenenler  # noqa: E402
from mockup_compose import _kutu_bulanik, en_buyuk_bolge, genislet  # noqa: E402

VIDEO_OLCULERI = [(1080, 1920), (2160, 3840)]
JPG_KALITE = 92
YESIL = np.array([0.0, 255.0, 0.0])
CEP_KAYNAK = "envelope_open"
CEP_CIKTI = "envelope_pocket_front.png"
MAKS_PENCERE = 16
PARCA_PAKETLERI = (4, 5, None)  # video tasarım paketi (03) ve website paketi (K22–K24); None = başlıksız dosya
WEB_PAKETI = 5


class KullanimHatasi(Exception):
    pass


# ----------------------------------------------------------------------------- yollar

def kok_coz(arg: str) -> Path:
    p = Path(arg)
    if p.is_absolute():
        return p
    return (ROOT / p) if (ROOT / p).exists() else p.resolve()


def kaynak_yolu(yol: str, kok: Path) -> Path:
    p = Path(yol)
    if p.is_absolute():
        return p
    if "assets/gpt/" in yol:
        return kok / "assets/gpt" / yol.split("assets/gpt/", 1)[1]
    return ROOT / p


def cikti_koru(out: Path, kok: Path):
    o, k = out.resolve(), kok.resolve()
    parcalar = o.relative_to(k).parts if o.is_relative_to(k) else o.parts
    if "assets" in parcalar:
        raise KullanimHatasi(f"çıktı yolu assets/ altında, reddedildi: {out}")


def goreli(p: Path) -> str:
    try:
        return str(p.resolve().relative_to(ROOT))
    except ValueError:
        return str(p)


def pencere_bekleyenler(prompts: Path) -> set:
    """Prompt bloğunda (Kaydet satırından sonraki başlığa kadar) #00FF00 geçen dosya yolları."""
    return {b["yol"] for b in beklenenler(prompts) if b.get("pencere")}


def parca_listesi(liste: list) -> list:
    """PAKET 4/5 (ya da başlıksız) `/parts/` satırları; aynı yol iki kez geçerse sonraki kazanır, sıra korunur."""
    secili = {}
    for b in liste:
        if "/parts/" in b["yol"] and b.get("paket") in PARCA_PAKETLERI:
            secili.pop(b["yol"], None)
            secili[b["yol"]] = b
    return list(secili.values())


# ----------------------------------------------------------------------------- kırpma

def merkez_kirp_916(w: int, h: int):
    """(x0, y0, x1, y1): 9:16 oranında merkez kırpma kutusu."""
    if w * 16 > h * 9:
        cw = int(round(h * 9 / 16))
        x0 = (w - cw) // 2
        return x0, 0, x0 + cw, h
    ch = int(round(w * 16 / 9))
    y0 = (h - ch) // 2
    return 0, y0, w, y0 + ch


def alfa_kutusu(alfa: np.ndarray, esik: int = 8, pay: int = 8):
    """Alfa > esik piksellerin kutusu + pay (görsel sınırına kırpılır). Boşsa None."""
    ys, xs = np.nonzero(alfa > esik)
    if not len(ys):
        return None
    h, w = alfa.shape
    return (max(0, int(xs.min()) - pay), max(0, int(ys.min()) - pay),
            min(w, int(xs.max()) + 1 + pay), min(h, int(ys.max()) + 1 + pay))


# ----------------------------------------------------------------------------- pencereler

def yesil_baskin(rgb: np.ndarray, esik: int = 150) -> np.ndarray:
    r, g, b = (rgb[..., i].astype(np.int16) for i in range(3))
    return (g - np.maximum(r, b) >= esik) & (g >= esik)


def _asindir(m: np.ndarray, r: int) -> np.ndarray:
    return ~genislet(~m, r) if r > 0 else m


def pencereleri_bul(rgb: np.ndarray, alfa=None, esik: int = 150, min_alan=None):
    """(bölge maskeleri soldan sağa, pencere sayılmayan yeşil piksel sayısı)."""
    h, w = rgb.shape[:2]
    ham = yesil_baskin(rgb, esik)
    if alfa is not None:
        ham &= alfa >= 128
    if min_alan is None:
        min_alan = max(256, int(0.001 * h * w))
    kalan, bolgeler = ham.copy(), []
    while len(bolgeler) < MAKS_PENCERE and kalan.sum() >= min_alan:
        b = en_buyuk_bolge(kalan)
        if b.sum() < min_alan:
            break
        kalan &= ~b
        bolgeler.append(b)
    # pencereye yakın küçük yeşil parçalar (ince çizgi ya da üstüne binen çiçeklerin arasından görünen
    # pencere) pencereye katılır; uzaktakiler leke olarak kalır
    yakinlik = max(6, int(round(0.01 * min(h, w))))
    for i, b in enumerate(bolgeler):
        ek = genislet(b, yakinlik) & kalan
        kalan &= ~ek
        b = b | ek
        # iç lekeleri kapat (dışbükey kemer/dikdörtgende şekli değiştirmez)
        bolgeler[i] = _asindir(genislet(b, 2), 2) | b
    atlanan = int((kalan & ~np.logical_or.reduce(bolgeler)).sum()) if bolgeler else int(kalan.sum())

    def anahtar(b):
        ys, xs = np.nonzero(b)
        return (float(xs.mean()), float(ys.mean()))

    bolgeler.sort(key=anahtar)
    return bolgeler, atlanan


def kutu(m: np.ndarray):
    ys, xs = np.nonzero(m)
    return [int(xs.min()), int(ys.min()), int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)]


def pencere_isle(rgba: np.ndarray, bolge: np.ndarray):
    """rgba (float, 0..255, h×w×4) içinde bölgeyi şeffaf yapar, kenar yeşilini temizler.
    (yeni rgba, kapsama 0..1) döndürür. İşlem pencere kutusu + 24 px çevrede yapılır."""
    h, w = bolge.shape
    x, y, bw, bh = kutu(bolge)
    x0, y0, x1, y1 = max(0, x - 24), max(0, y - 24), min(w, x + bw + 24), min(h, y + bh + 24)
    parca, kap = _pencere_isle(rgba[y0:y1, x0:x1], bolge[y0:y1, x0:x1])
    yeni = rgba.copy()
    yeni[y0:y1, x0:x1] = parca
    kapsama = np.zeros((h, w))
    kapsama[y0:y1, x0:x1] = kap
    return yeni, kapsama


def _pencere_isle(rgba: np.ndarray, bolge: np.ndarray):
    m = rgba[..., :3]
    alfa = rgba[..., 3]
    r, g, b = m[..., 0], m[..., 1], m[..., 2]
    yesillik = g - np.maximum(r, b)
    halka = genislet(bolge, 4) & ~bolge
    # yerel zemin rengi: pencereye yakın, yeşil olmayan, görünür pikseller
    agirlik = (genislet(bolge, 9) & ~halka & ~bolge & (yesillik <= 8) & (alfa > 0)).astype(np.float64)
    if agirlik.sum() == 0:
        agirlik = (halka & (yesillik <= 8)).astype(np.float64)
    if agirlik.sum():
        ort = np.array([float((m[..., i] * agirlik).sum() / agirlik.sum()) for i in range(3)])
    else:
        ort = np.array([255.0, 255.0, 255.0])
    pay = _kutu_bulanik(agirlik, 6)
    zemin = np.stack([_kutu_bulanik(m[..., i] * agirlik, 6) for i in range(3)], -1)
    zemin = np.where(pay[..., None] > 1e-6, zemin / np.maximum(pay, 1e-6)[..., None], ort)

    # kenardaki yarı yeşil pikseller: piksel = c·yeşil + (1−c)·zemin → c
    kenar = halka & (yesillik > 8)
    fark = YESIL - zemin
    payda = (fark * fark).sum(-1)
    c_proj = ((m - zemin) * fark).sum(-1) / np.maximum(payda, 1e-6)
    c = np.where(payda > 2000, c_proj, yesillik / 255.0)
    c = np.clip(c, 0, 1) * kenar
    kapsama = np.maximum(bolge.astype(np.float64), c)

    yeni = rgba.copy()
    ayr = kenar & (c > 0.02)
    cc = c[ayr][:, None]
    on = (m[ayr] - cc * YESIL) / np.maximum(1 - cc, 0.05)
    on = np.where(cc > 0.9, zemin[ayr], on)
    yeni[..., :3][ayr] = np.clip(on, 0, 255)
    yeni[..., 3] = alfa * (1 - kapsama)
    # kalan yeşil baskınlığı: pencereye 2 px yakın ve ayrıştırılan piksellerde G → max(R, B)
    tasma = (genislet(bolge, 2) | ayr) & ~bolge
    yr, yg, yb = yeni[..., 0], yeni[..., 1], yeni[..., 2]
    yeni[..., 1] = np.where(tasma & (yg > np.maximum(yr, yb)), np.maximum(yr, yb), yg)
    # delik: RGB çerçeve rengine (Canva ölçeklemesinde yeşil sızmasın)
    yeni[..., :3][bolge] = zemin[bolge]
    return yeni, kapsama


def maske_kaydet(kapsama: np.ndarray, k, yol: Path):
    x, y, w, h = k
    parca = np.clip(np.rint(kapsama[y:y + h, x:x + w] * 255), 0, 255).astype(np.uint8)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = parca
    yol.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(out, "RGBA").save(yol)


def pencereler_uygula(rgba: np.ndarray, esik: int, katman_ad: str, out: Path, maske_dir: str):
    """rgba uint8 (h×w×4). (yeni rgba uint8, pencere kayıtları, atlanan yeşil piksel)."""
    bolgeler, atlanan = pencereleri_bul(rgba[..., :3], rgba[..., 3], esik)
    if not bolgeler:
        return rgba, [], atlanan
    f = rgba.astype(np.float64)
    kayit = []
    stem = Path(katman_ad).stem
    for i, b in enumerate(bolgeler, 1):
        f, kap = pencere_isle(f, b)
        k = kutu(b)
        maske = f"{maske_dir}/{stem}_w{i}.png"
        maske_kaydet(kap, k, out / maske)
        kayit.append({"katman": katman_ad, "katman_olcu": [f.shape[1], f.shape[0]], "kutu": k,
                      "maske": maske, "alan_px": int(b.sum()),
                      "doluluk": round(float(b.sum()) / (k[2] * k[3]), 3)})
    return np.clip(np.rint(f), 0, 255).astype(np.uint8), kayit, atlanan


# ----------------------------------------------------------------------------- ön cep

def _parcali_dogru_uydur(x: np.ndarray, y: np.ndarray):
    """Tek kırılımlı sürekli parçalı doğru (kırılım yoksa düz). (fonksiyon, artık MAD, kırılım x)."""
    def coz(b):
        A = np.stack([np.ones_like(x), np.minimum(x - b, 0), np.maximum(x - b, 0)], 1)
        p, *_ = np.linalg.lstsq(A, y, rcond=None)
        return p, A @ p

    en_iyi = None
    adaylar = np.linspace(x.min(), x.max(), 41)
    for b in adaylar:
        p, tahmin = coz(b)
        sse = float(((y - tahmin) ** 2).sum())
        if en_iyi is None or sse < en_iyi[0]:
            en_iyi = (sse, b, p)
    _, b, p = en_iyi

    def f(xx, b=b, p=p):
        xx = np.asarray(xx, np.float64)
        return p[0] + p[1] * np.minimum(xx - b, 0) + p[2] * np.maximum(xx - b, 0)

    res = y - f(x)
    mad = float(np.median(np.abs(res - np.median(res))))
    return f, mad, float(b)


def cep_kes(rgba: np.ndarray):
    """rgba uint8 (kırpılmış envelope_open). (cep rgba uint8, bilgi, uyarılar)."""
    uyarilar = []
    alfa = rgba[..., 3].astype(np.float64)
    opak = alfa >= 128
    if opak.sum() < 100:
        raise ValueError("zarfta opak piksel yok")
    h, w = opak.shape
    ys = np.flatnonzero(opak.any(1))
    y0, y1 = int(ys[0]), int(ys[-1]) + 1
    H = y1 - y0
    genislik = opak.sum(1)
    alt = np.arange(int(y0 + 0.6 * H), int(y0 + 0.9 * H))
    alt = alt[genislik[alt] > 0]
    sol = np.array([np.argmax(opak[y]) for y in alt])
    sag = np.array([w - np.argmax(opak[y, ::-1]) for y in alt])
    bx0, bx1 = int(np.median(sol)), int(np.median(sag))
    Bw = bx1 - bx0
    govde_sat = np.flatnonzero(genislik >= 0.5 * Bw)
    yb = int(govde_sat[-1]) + 1
    yt = max(y0, yb - Bw)  # kare zarf varsayımı
    Bh = yb - yt

    rgb = rgba[..., :3].astype(np.float64)
    S = np.stack([_kutu_bulanik(rgb[..., i], 2) for i in range(3)], -1)
    lum = rgb @ np.array([0.299, 0.587, 0.114])
    ort = _kutu_bulanik(lum, 3)
    std = np.sqrt(np.maximum(_kutu_bulanik(lum * lum, 3) - ort * ort, 0))

    bant_y = slice(int(yb - 0.22 * Bh), int(yb - 0.06 * Bh))
    bant_x = slice(int(bx0 + 0.15 * Bw), int(bx1 - 0.15 * Bw))
    bant_op = opak[bant_y, bant_x]
    ref = np.median(S[bant_y, bant_x][bant_op], axis=0)
    d_bant = np.linalg.norm(S[bant_y, bant_x][bant_op] - ref, axis=1)
    esik_c = max(20.0, float(np.percentile(d_bant, 95)) * 1.8 + 6)
    esik_t = max(6.0, float(np.percentile(std[bant_y, bant_x][bant_op], 95)) * 2 + 3)

    tara0, tara1 = y0, bant_y.start  # tarama satırları [tara0, tara1)
    sx = np.arange(int(bx0 + 0.05 * Bw), int(bx1 - 0.05 * Bw))
    blok_S = S[tara0:tara1][:, sx]
    uyusmaz = ((np.linalg.norm(blok_S - ref, axis=-1) > esik_c) | (std[tara0:tara1][:, sx] > esik_t)
               | ~opak[tara0:tara1][:, sx])
    L = max(3, int(round(0.025 * Bh)))
    cs = np.concatenate([np.zeros((1, len(sx))), np.cumsum(uyusmaz, 0)], 0)
    # tam[y]: satır y'de biten L satırlık koşu tamamen uyuşmaz (y ≥ L−1)
    tam = np.zeros_like(uyusmaz)
    tam[L - 1:] = (cs[L:] - cs[:-L]) == L
    kenar = np.full(len(sx), np.nan)
    var = tam.any(0)
    son = tam.shape[0] - 1 - np.argmax(tam[::-1], axis=0)
    kenar[var] = tara0 + son[var] + 1
    # ince ayar: bulanıklık/doku penceresi sınırı birkaç px aşağı kaydırır → ±6 satırda en güçlü dikey
    # renk geçişine otur (yalnız yatay yumuşatılmış görüntüde; dikey konum bozulmaz)
    cs_x = np.cumsum(np.pad(rgb, ((0, 0), (3, 2), (0, 0)), mode="edge"), axis=1)
    Gh = (cs_x[:, 5:] - cs_x[:, :-5]) / 5
    dv = np.zeros((h, w))
    dv[1:] = np.linalg.norm(Gh[1:] - Gh[:-1], axis=-1)
    for i in np.flatnonzero(var):
        e0 = int(kenar[i])
        a0, a1 = max(1, e0 - 6), min(h, e0 + 7)
        kenar[i] = a0 + int(np.argmax(dv[a0:a1, sx[i]]))

    bilgi = {"govde": [bx0, yt, Bw, Bh], "esik_renk": round(esik_c, 1), "esik_doku": round(esik_t, 1)}
    gecerli = ~np.isnan(kenar)
    yontem = None
    if gecerli.mean() >= 0.6:
        xx, yy = sx[gecerli].astype(np.float64), kenar[gecerli]
        f, mad, kirilim = _parcali_dogru_uydur(xx, yy)
        res = yy - f(xx)
        tut = np.abs(res) <= max(3 * mad * 1.4826, 2.0)
        if tut.sum() >= 0.5 * len(sx):
            f, mad, kirilim = _parcali_dogru_uydur(xx[tut], yy[tut])
        ornek = f(np.linspace(bx0, bx1, 21))
        icinde = (ornek >= yt - 0.08 * Bh) & (ornek <= yb - 0.2 * Bh)
        if mad <= 0.02 * Bh + 1 and icinde.mean() >= 0.9:
            yontem = "renk"
            bilgi.update({"artik_mad_px": round(mad, 2), "kirilim_x": round(kirilim, 1),
                          "gecerli_sutun": round(float(gecerli.mean()), 3)})
    if yontem is None:
        yontem = "geometrik"
        cx = (bx0 + bx1) / 2

        def f(xx):
            xx = np.asarray(xx, np.float64)
            return yt + 0.10 * Bw + (0.32 * Bw) * (1 - np.abs(xx - cx) / (Bw / 2)).clip(0, 1)

        uyarilar.append("cep sınırı renk/doku ile bulunamadı → geometrik V kenar kullanıldı; önizlemede gözle kontrol et")
    xs_tum = np.arange(w) + 0.5
    e = f(xs_tum)
    satir = np.arange(h)[:, None]
    kap = np.clip((satir + 1) - e[None, :], 0, 1)
    cep_alfa = np.where(alfa >= 64, alfa, 0) * kap
    cep = rgba.copy()
    cep[..., 3] = np.clip(np.rint(cep_alfa), 0, 255).astype(np.uint8)
    if (cep[..., 3] > 0).sum() == 0:
        raise ValueError("cep katmanı boş çıktı")
    bilgi.update({"yontem": yontem, "kenar_sol_orta_sag": [
        [bx0, round(float(f(bx0)), 1)], [round((bx0 + bx1) / 2, 1), round(float(f((bx0 + bx1) / 2)), 1)],
        [bx1, round(float(f(bx1)), 1)]], "cep_kutu": kutu(cep[..., 3] > 0)})
    return cep, bilgi, uyarilar


# ----------------------------------------------------------------------------- parça işleme

def _rgba(im: Image.Image) -> np.ndarray:
    return np.asarray(im.convert("RGBA")).copy()


def parca_isle(b: dict, kaynak: Path, out: Path, esik: int, pay: int, comp=False):
    """Bir parçayı işler. (katman kaydı, pencere kayıtları, cep bilgisi|None, uyarılar)."""
    ad = kaynak.stem
    im = Image.open(kaynak)
    im.load()
    w, h = im.size
    alfa_var = im.mode in ("RGBA", "LA", "PA") or (im.mode == "P" and "transparency" in im.info)
    uyarilar, pencereler, cep = [], [], None
    kayit = {"ad": ad, "kaynak": goreli(kaynak), "kaynak_olcu": [w, h], "dosyalar": []}

    if b.get("seffaf") and not comp:
        if not alfa_var:
            uyarilar.append(f"{ad}: şeffaf bekleniyordu ama alfa kanalı yok — kırpılmadan PNG yazıldı")
            rgba = _rgba(im)
            kirp = (0, 0, w, h)
        else:
            rgba = _rgba(im)
            kirp = alfa_kutusu(rgba[..., 3], pay=pay)
            if kirp is None:
                uyarilar.append(f"{ad}: görsel tamamen şeffaf — atlandı")
                return None, [], None, uyarilar
            x0, y0, x1, y1 = kirp
            rgba = rgba[y0:y1, x0:x1]
            if (x1 - x0) * (y1 - y0) >= 0.99 * w * h:
                uyarilar.append(f"{ad}: alfa kutusu neredeyse tüm görsel (nesne kenara değiyor ya da zemin dolu olabilir)")
        kayit["kirpma"] = [kirp[0], kirp[1], kirp[2] - kirp[0], kirp[3] - kirp[1]]
        dosya = f"{ad}.png"
        rgba, pencereler, atlanan = pencereler_uygula(rgba, esik, dosya, out, "masks")
        if atlanan:
            uyarilar.append(f"{ad}: pencere sayılmayan {atlanan} küçük yeşil piksel kaldı (lekeler)")
        son = rgba
        Image.fromarray(son, "RGBA").save(out / dosya)
        kayit["dosyalar"].append({"dosya": dosya, "olcu": [son.shape[1], son.shape[0]]})
        if ad == CEP_KAYNAK:
            try:
                cep_rgba, cep, cu = cep_kes(son)
            except ValueError as e:
                uyarilar.append(f"{ad}: ön cep kesilemedi ({e}) — {CEP_CIKTI} yazılmadı")
                return kayit, pencereler, None, uyarilar
            Image.fromarray(cep_rgba, "RGBA").save(out / CEP_CIKTI)
            cep.update({"dosya": CEP_CIKTI, "zarf_katmani": dosya, "ayni_tuval": True,
                        "olcu": [cep_rgba.shape[1], cep_rgba.shape[0]]})
            uyarilar += [f"{ad}: {u}" for u in cu]
            kayit["dosyalar"].append({"dosya": CEP_CIKTI, "olcu": cep["olcu"]})
        return kayit, pencereler, cep, uyarilar

    # opak
    rgb_im = im.convert("RGB")
    if alfa_var and not comp:
        a = np.asarray(im.convert("RGBA"))[..., 3]
        if (a < 250).mean() > 0.001:
            uyarilar.append(f"{ad}: opak beklenirken şeffaf pikseller var — beyaz zemine düzleştirilmedi, alfa atıldı")
    if h > w and b.get("paket") != WEB_PAKETI:  # website (PAKET 5) görseli video ölçüsüne kırpılmaz
        kutu916 = merkez_kirp_916(w, h)
        kayit["kirpma"] = [kutu916[0], kutu916[1], kutu916[2] - kutu916[0], kutu916[3] - kutu916[1]]
        olculer = VIDEO_OLCULERI[:1] if comp else VIDEO_OLCULERI
        buyutme = max(W / (kutu916[2] - kutu916[0]) for W, _ in olculer)
        if buyutme > 1.001 and not comp:
            uyarilar.append(f"{ad}: kaynaktan ×{buyutme:.2f} büyütme (ayrıntı eklenmez; daha büyük kaynak daha iyi)")
        hedefler = [(rgb_im.crop(kutu916).resize((W, H), Image.LANCZOS), f"{ad}_{W}x{H}") for W, H in olculer]
    else:
        kayit["kirpma"] = [0, 0, w, h]
        hedefler = [(rgb_im, ad)]
    for gorsel, stem in hedefler:
        rgba = _rgba(gorsel)
        dosya_png = f"{stem}.png"
        rgba, pk, atlanan = pencereler_uygula(rgba, esik, dosya_png, out, "masks/comps" if comp else "masks")
        if atlanan:
            uyarilar.append(f"{stem}: pencere sayılmayan {atlanan} küçük yeşil piksel kaldı (lekeler)")
        pencereler += pk
        if comp:
            for p in pk:
                p["katman"] = None
                p["koordinat"] = "kaynak" if b.get("paket") == WEB_PAKETI else "video_1080x1920"
            continue
        son = rgba
        if pk:
            Image.fromarray(son, "RGBA").save(out / dosya_png)
            dosya = dosya_png
        else:
            dosya = f"{stem}.jpg"
            Image.fromarray(son[..., :3], "RGB").save(out / dosya, quality=JPG_KALITE, optimize=True)
        kayit["dosyalar"].append({"dosya": dosya, "olcu": [son.shape[1], son.shape[0]]})
    return kayit, pencereler, cep, uyarilar


def calistir(kok: Path, out: Path, esik=150, pay=8, comps=False, strict=False):
    """(çıkış kodu, özet sözlüğü)."""
    prompts = kok / "assets/gpt/GPT_PROMPTS.md"
    if not prompts.exists():
        raise KullanimHatasi(f"GPT_PROMPTS.md yok: {prompts}")
    liste = beklenenler(prompts)
    parcalar = parca_listesi(liste)
    if not parcalar:
        raise KullanimHatasi("GPT_PROMPTS.md içinde PAKET 4/5 parts/ altına **Kaydet:** satırı yok")
    is_listesi = [(b, False) for b in parcalar]
    if comps:
        is_listesi += [(b, True) for b in liste if "/comps/" in b["yol"]]
    cikti_koru(out, kok)
    bekleyen = pencere_bekleyenler(prompts)
    ozet = {"arac": "tools/parts_prep.py", "koleksiyon": goreli(kok), "pencereler": {},
            "comp_pencereleri": {}, "katmanlar": [], "cep": None, "eksik": [], "uyarilar": []}
    hata = eksik_pencere = False
    for b, comp in is_listesi:
        kaynak = kaynak_yolu(b["yol"], kok)
        if not kaynak.exists():
            ozet["eksik"].append(goreli(kaynak))
            continue
        out.mkdir(parents=True, exist_ok=True)
        try:
            kayit, pencereler, cep, uy = parca_isle(b, kaynak, out, esik, pay, comp)
        except (OSError, ValueError) as e:
            ozet["uyarilar"].append(f"{kaynak.name}: HATA {e}")
            hata = True
            continue
        ozet["uyarilar"] += uy
        if b["yol"] in bekleyen and not pencereler:
            ozet["uyarilar"].append(f"{kaynak.stem}: prompt'ta #00FF00 pencere isteniyor ama görselde bulunamadı "
                                    f"(eşik {esik}); foto alanı kaydı yok")
            eksik_pencere = True
        if pencereler:
            ozet["comp_pencereleri" if comp else "pencereler"][kaynak.stem] = pencereler
        if kayit and not comp:
            ozet["katmanlar"].append(kayit)
        if cep:
            ozet["cep"] = cep
    if ozet["katmanlar"] or ozet["comp_pencereleri"]:
        (out / "windows.json").write_text(json.dumps(ozet, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    kod = 0
    if hata or not ozet["katmanlar"]:
        kod = 1
    if strict and (ozet["eksik"] or eksik_pencere or (ozet["cep"] and ozet["cep"]["yontem"] != "renk")):
        kod = 1
    return kod, ozet


def ozet_yaz(ozet: dict, out: Path):
    for k in ozet["katmanlar"]:
        dosyalar = ", ".join(f"{d['dosya']} ({d['olcu'][0]}×{d['olcu'][1]})" for d in k["dosyalar"])
        print(f"TAMAM  {k['ad']} → {dosyalar}")
    for ad, pl in list(ozet["pencereler"].items()) + [(f"comp:{a}", p) for a, p in ozet["comp_pencereleri"].items()]:
        for p in pl:
            yer = p["katman"] or ("comp koordinatı" if p.get("koordinat") == "kaynak" else "1080×1920 video koordinatı")
            print(f"PENCERE  {ad} · {yer} · kutu {p['kutu']} · maske {p['maske']}")
    if ozet["cep"]:
        c = ozet["cep"]
        print(f"CEP  {c['dosya']} ({c['yontem']}) · kenar {c['kenar_sol_orta_sag']} · {c['zarf_katmani']} ile aynı tuval")
    for e in ozet["eksik"]:
        print(f"EKSİK  {e} — atlandı")
    for u in ozet["uyarilar"]:
        print(f"UYARI  {u}")
    n = sum(len(k["dosyalar"]) for k in ozet["katmanlar"])
    print(f"\n{len(ozet['katmanlar'])} parça → {n} katman · {len(ozet['eksik'])} eksik · çıktı: {out}"
          + (" · windows.json" if ozet["katmanlar"] or ozet["comp_pencereleri"] else ""))


def main(argv=None):
    ap = argparse.ArgumentParser(description="GPT parçalarını Canva katmanına hazırlar (kırpma, yeşil pencere, ön cep).")
    ap.add_argument("koleksiyon", help="ör. collections/03_Blush_Garden_Rose (repo köküne ya da çalışma klasörüne göre)")
    ap.add_argument("--out", default="kit_layers", help="çıktı klasörü (göreliyse koleksiyon köküne göre)")
    ap.add_argument("--esik", type=int, default=150, help="pencere: G − max(R, B) ve G alt sınırı")
    ap.add_argument("--pay", type=int, default=8, help="şeffaf parçada alfa kutusu payı (px)")
    ap.add_argument("--comps", action="store_true", help="comp pencerelerini de 1080×1920 koordinatında ölç")
    ap.add_argument("--strict", action="store_true", help="eksik kaynak ya da geometrik cep → çıkış 1")
    ap.add_argument("--json", action="store_true", help="özeti JSON olarak yaz")
    a = ap.parse_args(argv)
    kok = kok_coz(a.koleksiyon)
    out = Path(a.out)
    out = out if out.is_absolute() else kok / out
    try:
        kod, ozet = calistir(kok, out, a.esik, a.pay, a.comps, a.strict)
    except KullanimHatasi as e:
        print(f"HATA: {e}", file=sys.stderr)
        return 2
    if a.json:
        print(json.dumps(ozet, ensure_ascii=False, indent=2))
    else:
        ozet_yaz(ozet, out)
    if not ozet["katmanlar"]:
        print("UYARI: hiç parça işlenmedi (kaynaklar yok mu?)", file=sys.stderr)
    return kod


if __name__ == "__main__":
    sys.exit(main())
