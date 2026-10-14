#!/usr/bin/env python3
"""Vintage Airmail Love Letter teması (tasarım 04, G404) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir.
Teknik hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/vintage-airmail-love-letter/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/04_Vintage_Airmail/assets/gpt/parts/ (G204, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre koşar
(alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" şeffaf, windows.json); tema klasörüne, img_src/'ye, assets/'e
yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py (webp, foto alanı, serbest bölge, yer tutucu, og,
ikon, hiza, şerit farkı, denetimler).

Bu tasarıma özgü (docs/11 §7.1, §7.2 "kapak — yırtma şeridi", §7.3 son paragraf):
  * Zarf tipi: hava postası zarfı + üst kenarda delikli yırtma şeridi. Açılış cümlesi: mühür fırlar, şerit soldan sağa
    yırtılır, krem mektup kartı zarftan yukarı kayar, bir kuru çiçek süzülerek düşer.
  * HİZA: envelope_open, envelope_closed'un düzenlemesi ama aynı tuvalde ~25 px aşağıda ve %0,5 geniş çizildi (kit_check:
    sol +0,00 · sağ +0,39 · alt +1,56 % → UYARI). Açık zarf, değişmeyen üç kenarı (sol, sağ, alt — alfa kenarlarının
    gövde satırlarındaki medyanı) kapalınınkine oturacak tek ölçek + ötelemeyle kapalının tuvaline taşınır
    (manifest.stage.align: ölçülen kenarlar, uygulanan dönüşüm, sonrası).
  * KESİMLER (görselin kendi pikselinden; çizim yok):
      - delik çizgisi: kapalı zarfta her sütunda şerit kâğıdından (lum ≈ 200) aşağı inerken ilk koyu temas satırı
        (3 px dikey medyan, lum < 135); 41 sütunluk kayan medyandan > 6 px sapan sütun medyanla doldurulur (leke/pul).
      - env_strip = kapalı zarfın delik çizgisinin ÜSTÜ (şerit, kapalıyken gövdeye bağlı duran hâli).
      - env_open (gövde) = kapalı zarfın delik çizgisinden aşağısı + hizalanmış açık zarfın delik çizgisinin üstünde kalan
        yırtık kâğıt artığı. Gövde kapalı zarfın pikselleri olduğu için kapalı → açık geçişinde kâğıt dokusu ve pullar
        "atlamaz" (iki GPT görseli doku ve pul ayrıntısında farklı); değişen tek şey yırtık kenardır.
      - env_torn = tema_build.serit_farki(kapalı, hizalı açık) — yırtılıp kalkan parça (kapalı zarfın yırtık çizginin
        üstündeki pikselleri), yırtık kenarın altına inmez (delik çizgisi + 2 px ile sınırlı).
      env_strip ∪ env_open = kapalı zarf (alfa farkı ≤ 0,01; denetlenir); env_torn ⊂ env_strip.
  * Kapanış (closure.png = mühür + lavanta dalı, tek parça) kare tuvalde büyük çizildi; yeri kesim geometrisine bağlı:
    çapa = şeridin (kapalı − açık alfa) kutu merkezi; W1.1 comp'ta ölçülen mühür genişliği / zarf genişliği ve mühür
    merkezinin şerit merkezine göre dikey kayması uygulanır (manifest.closure). Mührün boş ortası = monogram yeri.
  * GPT kusurları (kesimle/temizlikle, çizimsiz): (1) bütün şeffaf parçalarda gövde alfası 253 (tam opak değil, ~%1 saydam)
    ve nesnenin çevresinde alfa 1–5 geniş "bulut" — alfa < 12 sıfır, [12, 250] → [0, 255]; çekirdekten uzak düşük alfa
    silinir; yarı saydam kenarın rengi komşu opak renge çekilir; (2) pencereler saf/tam opak #00FF00 değil (frame_* yarı
    saydam lekeli, card_small gölgeli): parts_prep leke dolgusu + pencere çevresinde kalan yeşil/turuncu saçak halkası
    çerçeve renginden yeniden boyanır; (3) şeffaf piksellerin rengi komşu renkle doldurulur (WebP kenar saçağı yok).

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json. site.css'teki yüzdeler
manifest'ten; --onizleme DIR kesim/kenar önizlemelerini yazar (gözle denetim). Tema klasörü ≤ 3 MB (aşarsa çıkış ≠ 0).
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/04_Vintage_Airmail"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, en_buyuk_bolge, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_open": [440, 880], "env_strip": [440, 880], "env_torn": [440, 880], "closure": [240, 480],
    "card_small": [320, 640], "invitation_card": [480, 960], "info_card": [480, 960], "frame_portrait": [320, 640],
    "frame_landscape": [480, 960], "decor_tl": [480, 760], "decor_br": [480, 760], "divider": [300, 600],
}
# palette.json (airmail): ivory #FAF4E8 — yer tutucu tonu
IVORY = (250, 244, 232)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: dekorsuz, harita çizgisiz sakin parşömen)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (430, 420, 900, 980)),
    "story_1": ("portrait", [320, 640], (300, 480, 760, 1050)),
    "story_2": ("portrait", [320, 640], (480, 560, 940, 1130)),
    "story_3": ("portrait", [320, 640], (220, 380, 680, 950)),
    "venue": ("landscape", [480, 960], (180, 560, 1000, 920)),
}
PH_MIN_LUM = 170   # yer tutucuda en koyu piksel (gri ton) en az bu: köşe kümesi / damga kırpıma girmez (çıkış ≠ 0)
CARD_W_OF_ENV = 0.42   # W1.2 comp: kart ~345 px, W1.1 zarfı ~803 px (0,43); zarftan dar
# comp W1.1 (comps/web_1_envelope.png, 1024×1536) ölçümü: zarfın çizgili kenarları x 110–913 (803 px), üst kâğıt kenarı
# y 606, çizgi bandının üstü (delik çizgisi) y 668 → şerit kutusu merkezi y 637; mühür x 437–565 × y 650–777 (128 px),
# merkezi (501, 713). → mühür genişliği / zarf genişliği 0,159; mühür merkezi şerit merkezinden 0,095 × zarf genişliği
# aşağıda (çizgi bandının üstüne biner, şeridi gövdeye "mühürler"). Yatay kayma −0,012 GPT asimetrisi sayıldı: ortalı.
COMP = {"env_w": 803.0, "seal_w": 128.0, "seal_c": (501.0, 713.0), "strip_c_y": 637.0}


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (GPT alfası, hâle, saçak)

def temizle(im: Image.Image, sert: bool, taban: int = 12, dolu: int = 250, cekirdek: int = 96):
    """GPT alfa kusurları (çizim yok). sert: kart/çerçeve/zarf/mühür gibi net kenarlı nesne.
    1) alfa < taban → 0, [taban, dolu] → [0, 255] (gövde alfası 253 → 255: üst üste binen katmanlar birbirini göstermez);
    2) çekirdekten (alfa ≥ cekirdek) uzak (sert 1 px, yumuşak 3 px) piksel silinir (alfa 1–5 "bulut");
    3) yarı saydam kenar pikselinin rengi komşu opak piksellerin ortalamasına çekilir (koyu/yeşil saçak). (RGBA, bilgi)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    al = a[..., 3]
    once = int((al > 0).sum())
    yeni = np.clip((al - taban) * 255.0 / (dolu - taban), 0, 255)
    core = al >= cekirdek
    yeni[~genislet(core, 1 if sert else 3)] = 0
    opak = (al >= 240).astype(np.float64)
    pay = _kutu_bulanik(opak, 3)
    renk = np.stack([_kutu_bulanik(a[..., i] * opak, 3) for i in range(3)], -1)
    kenar = (yeni > 0) & (al < 240) & (pay > 1e-3)
    hedef = renk[kenar] / pay[kenar][:, None]
    w = (1 - al[kenar] / 240.0)[:, None] if not sert else np.ones((int(kenar.sum()), 1))
    a[..., :3][kenar] = a[..., :3][kenar] * (1 - w) + hedef * w
    # yeşil baskınlık: yarı saydam kenarda G ≤ 1.4 × max(R, B); WebP renk alt örneklemesi "görünür yeşil" yapmasın
    mx = np.maximum(a[..., 0], a[..., 2])
    asiri = (yeni > 0) & (al < 240) & (a[..., 1] > 1.4 * mx)
    a[..., 1][asiri] = 1.4 * mx[asiri]
    fazla = (a[..., 1] - mx > 24) & (a[..., 1] * 2 >= 3 * mx)
    a[..., 1][fazla] = mx[fazla] + 24
    a[..., 3] = yeni
    sonra = int((yeni > 0).sum())
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), {
        "alpha_floor": taban, "alpha_full": dolu, "core": cekirdek, "reach_px": 1 if sert else 3, "removed_px": once - sonra}


def pencere_halkasi(im: Image.Image, prep: Path, win: dict, ad: str, halka: int = 3):
    """Pencere ayrıştırmasının bıraktığı yeşil/turuncu saçak: pencerenin `halka` px çevresindeki görünen piksellerin rengi,
    4–10 px dışındaki opak çerçeve renginden (normalize kutu bulanıklığı) yeniden alınır; alfa korunur."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    tam = tb.pencere(prep, win, ad, 254)
    dokunan = tb.pencere(prep, win, ad, 0)
    ring = genislet(dokunan, halka) & ~tam & (a[..., 3] > 0)
    dis = genislet(dokunan, 10) & ~genislet(dokunan, 4) & (a[..., 3] >= 250)
    w = dis.astype(np.float64)
    pay = _kutu_bulanik(w, 9)
    renk = np.stack([_kutu_bulanik(a[..., i] * w, 9) for i in range(3)], -1)
    ok = ring & (pay > 1e-3)
    a[..., :3][ok] = renk[ok] / pay[ok][:, None]
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), int(ok.sum())


def renk_tasir(im: Image.Image) -> Image.Image:
    """Şeffaf piksellerin RGB'si görünen komşu renkle doldurulur ("alpha bleeding"): Pillow'un önçarpımlı küçültmesi
    şeffaf piksellerin rengini siyaha çeker, kayıplı WebP bunu kenara karıştırıp koyu saçak yapar. Görüntü değişmez."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    gor = a[..., 3] >= 24
    if gor.all() or not gor.any():
        return im
    rgb = a[..., :3]
    dolu = gor.copy()
    agirlik = a[..., 3] / 255.0 * gor
    for r in (1, 2, 4, 8, 16, 32):
        w = np.where(dolu, np.maximum(agirlik, 0.1), 0.0)
        pay = _kutu_bulanik(w, r)
        renk = np.stack([_kutu_bulanik(rgb[..., i] * w, r) for i in range(3)], -1)
        yeni = ~dolu & (pay > 1e-6)
        rgb[yeni] = renk[yeni] / pay[yeni][:, None]
        dolu |= yeni
    a[..., :3] = rgb
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA")


def webp_yaz(im: Image.Image, name: str, widths, q: int, manifest: dict, out: Path):
    """tema_build.webp ile aynı çıktı biçimi (manifest[name] = {src_size, ratio, files}); fark: şeffaf parçada küçültme
    sonrası renk taşıma (renk_tasir) — WebP kenar saçağı olmasın."""
    seffaf = im.mode in ("RGBA", "LA", "P")
    im = im.convert("RGBA") if seffaf else im.convert("RGB")
    w0, h0 = im.size
    files = []
    for w in widths:
        w = min(w, w0)
        h = round(h0 * w / w0)
        r = im.resize((w, h), Image.LANCZOS) if w != w0 else im
        if seffaf:
            r = renk_tasir(r)
        p = Path(out) / f"{name}-{w}.webp"
        r.save(p, "WEBP", quality=q, method=6, alpha_quality=90)
        files.append({"file": p.name, "w": w, "h": h, "bytes": p.stat().st_size})
    manifest[name] = {"src_size": [w0, h0], "ratio": round(w0 / h0, 5), "files": files}


def alfa_kutu(im, esik: int = 8):
    k = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)
    return [int(v) for v in k]


# ============================================================================= hiza + şerit kesimleri (bu tasarım)

def kenarlar(al: np.ndarray):
    """Zarfın değişmeyen kenarları (docs/11 §7.1 kapak tipi: sol, sağ, alt): gövde satırlarında (yüksekliğin %30–95'i)
    ilk/son opak sütunun medyanı; alt = gövde sütunlarında son opak satırın medyanı. (L, R, B) px."""
    op = al >= 128
    H, W = op.shape
    rows = np.flatnonzero(op.sum(1) > W * 0.5)
    y0, y1 = rows.min(), rows.max()
    rr = rows[(rows > y0 + 0.3 * (y1 - y0)) & (rows < y1 - 0.05 * (y1 - y0))]
    L = float(np.median([np.argmax(op[r]) for r in rr]))
    R = float(np.median([W - np.argmax(op[r, ::-1]) for r in rr]))
    cols = np.arange(int(L) + 20, int(R) - 20)
    B = float(np.median([H - np.argmax(op[::-1, c]) for c in cols]))
    return L, R, B


def hizala(eo: Image.Image, ec: Image.Image):
    """Açık zarfı kapalının tuvaline taşıyan ölçek + öteleme: sol ve sağ kenar genişliği eşitler (s), sol kenar ve alt
    kenar çakışır. (hizalı açık RGBA, bilgi)."""
    Lc, Rc, Bc = kenarlar(np.asarray(ec)[..., 3])
    Lo, Ro, Bo = kenarlar(np.asarray(eo)[..., 3])
    s = (Rc - Lc) / (Ro - Lo)
    dx, dy = Lc - Lo * s, Bc - Bo * s
    out = eo.transform(eo.size, Image.AFFINE, (1 / s, 0, -dx / s, 0, 1 / s, -dy / s), resample=Image.BICUBIC)
    L2, R2, B2 = kenarlar(np.asarray(out)[..., 3])
    W, H = ec.size
    def kenar(ad, k, o, olcu):
        return {"kenar": ad, "kapali": round(k, 1), "acik": round(o, 1), "fark_px": round(o - k, 1),
                "fark_pct": round(100 * (o - k) / olcu, 2)}
    return out, {
        "method": "olculen_donusum", "scale": round(s, 5), "offset_px": [round(dx, 2), round(dy, 2)],
        "before": [kenar("sol", Lc, Lo, W), kenar("sağ", Rc, Ro, W), kenar("alt", Bc, Bo, H)],
        "after": [kenar("sol", Lc, L2, W), kenar("sağ", Rc, R2, W), kenar("alt", Bc, B2, H)],
        "note": "açık zarf (GPT düzenlemesi) kapalıdan ~25 px aşağıda ve %0,5 geniş; tek ölçek + öteleme kapalıya oturtur",
    }


def kayan_medyan(v: np.ndarray, k: int) -> np.ndarray:
    h = k // 2
    p = np.pad(v, h, mode="edge")
    return np.array([np.median(p[i:i + k]) for i in range(len(v))])


def delik_cizgisi(ec: Image.Image, ara=(35, 110), esik: float = 135, pencere: int = 41, sapma: float = 6):
    """Kapalı zarfta şeridin alt (delikli) kenarı: her sütunda üst kenardan `ara` satır bandında, 3 px dikey medyanlı
    parlaklık şerit kâğıdından (≈ 200) ilk kez `esik`in altına düştüğü satır (temas gölgesi). Leke/pul gibi sapmalar
    kayan medyanla düzeltilir. (satır dizisi [W] — kenar dışı sütunlar en yakın değer, bilgi)."""
    a = np.asarray(ec).astype(np.float64)
    al = a[..., 3]
    H, W = al.shape
    lum = np.clip(a[..., :3] @ LUM, 0, 255).astype(np.uint8)
    lm = np.asarray(Image.fromarray(lum).filter(ImageFilter.MedianFilter(3))).astype(np.float64)
    cols = np.flatnonzero((al > 128).sum(0) > 100)
    x0, x1 = int(cols.min()) + 4, int(cols.max()) - 3
    ust = np.array([int(np.argmax(al[:, x] > 128)) for x in range(W)])
    v = np.full(x1 - x0, np.nan)
    for i, x in enumerate(range(x0, x1)):
        seg = lm[ust[x] + ara[0]:ust[x] + ara[1], x]
        idx = np.flatnonzero(seg < esik)
        if len(idx):
            v[i] = ust[x] + ara[0] + idx[0]
    eksik = int(np.isnan(v).sum())
    if eksik:
        v = np.where(np.isnan(v), np.nanmedian(v), v)
    rm = kayan_medyan(v, pencere)
    sap = np.abs(v - rm) > sapma
    v = np.where(sap, rm, v)
    # şeridin iki ucu kıvrık (kâğıt katı): uçtaki `uc` sütunda delik çizgisi içerideki 40 sütunun medyanıyla sürer
    uc = 24
    v[:uc] = np.median(v[uc:uc + 40])
    v[-uc:] = np.median(v[-uc - 40:-uc])
    out = np.empty(W)
    out[x0:x1] = v
    out[:x0] = v[0]
    out[x1:] = v[-1]
    adim = float(np.abs(np.diff(v)).max())
    bilgi = {"method": "renk", "rows_px": [round(float(v.min()), 1), round(float(np.median(v)), 1), round(float(v.max()), 1)],
             "columns": [x0, x1 - 1], "replaced_columns": int(sap.sum()), "missing_columns": eksik, "max_step_px": round(adim, 1),
             "threshold_lum": esik}
    if sap.sum() > 0.08 * (x1 - x0) or adim > 14:
        bilgi["warnings"] = [f"delik çizgisi düzensiz: {int(sap.sum())} sütun düzeltildi, en büyük sıçrama {adim:.0f} px — önizlemeye bak"]
    return out, bilgi


def maskele(im: Image.Image, m: np.ndarray) -> Image.Image:
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    a[..., 3] *= m
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA")


def ust_uste(alt: Image.Image, ust: Image.Image) -> Image.Image:
    return Image.alpha_composite(alt.convert("RGBA"), ust.convert("RGBA"))


# ============================================================================= kapanış (mühür) ölçüleri

def muhur_olc(rgba: np.ndarray):
    """Bordo balmumu mühür kutusu (lavanta dalı ve sapları hariç): kırmızı baskın pikseller (R − G > 40, R − B > 30,
    R > 70), kapatma 3 + açma 6 px, en büyük bölge. → (x0, y0, x1, y1), bölge maskesi."""
    a = rgba.astype(np.float64)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = (r - g > 40) & (r - b > 30) & (r > 70) & (a[..., 3] > 200)
    m = ~genislet(~genislet(m, 3), 3)
    m = genislet(~genislet(~m, 6), 6)
    s = en_buyuk_bolge(m)
    ys, xs = np.nonzero(s)
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1), s


def muhur_ortasi(kutu, oran: float = 0.46):
    """Mührün boş ortası (monogram yeri, docs/11 §7.1): sekiz dilimli balmumu mührün ortasındaki düz daire mührün
    merkezinde, çapı mühür genişliğinin ~%70'i (W1.1 comp ve closure.png'de ölçüldü; dokulu balmumunda varyans eşiği
    daireyi güvenilir ayırmıyor). Monogram kutusu = dairenin içine sığan, mühür genişliğinin `oran`ı kadar kare."""
    x0, y0, x1, y1 = kutu
    cx, cy, d = (x0 + x1) / 2, (y0 + y1) / 2, oran * (x1 - x0)
    return cx - d / 2, cy - d / 2, cx + d / 2, cy + d / 2


# ============================================================================= yazı alanı (kâğıt lekeleri)

def yazi_alani(im: Image.Image, bolgeler, haric=(), esik: float = 24, k: float = 0.18, yumusak: int = 14, nokta: int = 7):
    """Kartın YAZI ALANINDAKİ eski kâğıt lekelerini yumuşatır (çizim yok, renk tonlaması): GPT kartlarının kâğıdı koyu
    pas lekeli; metin satırı lekenin üstüne düşünce okunurluk düşüyor ve theme-check kart metni piksel testi (satır altında
    kağıt renginden > 45 uzak piksel > %0,5) "boyalı süs" sayıyor. Yalnız `bolgeler` (kesir kutular [x0, y0, x1, y1]) içinde,
    `haric` kutular (çiçek, damga) dışında ve yalnız lekeye benzeyen (kahverengi-krem, düşük doygun) piksellerde renk,
    kâğıdın medyan rengine göre YUMUŞAK KIRPILIR: medyandan uzaklık `esik`e kadar aynen kalır (lif, ince doku), fazlası `k`
    ile çarpılır (koyu pas lekesi 100 → 41); kenarlar `yumusak` px yumuşak geçer. Çizgili kenar, çiçek ve pul bölgeye
    girmez. Önce `nokta` px'lik pas noktacıkları (medyan süzgeçten > 30 sapan tek noktalar) çevrelerinin rengini alır.
    (RGBA, bilgi)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    H, W = a.shape[:2]
    m = np.zeros((H, W))
    for x0, y0, x1, y1 in bolgeler:
        m[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = 1
    for x0, y0, x1, y1 in haric:
        m[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = 0
    m = _kutu_bulanik(_kutu_bulanik(m, yumusak), yumusak)
    rgb = a[..., :3]
    med = np.asarray(im.convert("RGB").filter(ImageFilter.MedianFilter(nokta))).astype(np.float64)
    nokta_m = (np.sqrt(((rgb - med) ** 2).sum(-1)) > 30) & (m > 0.5)
    rgb[nokta_m] = med[nokta_m]
    ic = m > 0.98
    kagit = np.median(rgb[ic].reshape(-1, 3), 0) if ic.any() else np.median(rgb.reshape(-1, 3), 0)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    leke = (r >= g - 6) & (g >= b - 6) & (r - b < 120) & ((rgb.max(-1) - rgb.min(-1)) < 120)   # kahverengi/krem, çizgi değil
    d = rgb - kagit
    D = np.sqrt((d ** 2).sum(-1))
    olcek = np.where(D > esik, (esik + (D - esik) * k) / np.maximum(D, 1e-6), 1.0)
    w = (m * leke)[..., None]
    a[..., :3] = kagit + d * (1 - w + w * olcek[..., None])
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), {
        "areas": [list(b) for b in bolgeler], "excluded": [list(b) for b in haric], "soft_clip": [esik, k],
        "specks_px": int(nokta_m.sum()),
        "paper_rgb": [round(v, 1) for v in kagit], "note": "yazı alanındaki pas lekeleri kâğıt rengine yaklaştırıldı (okunurluk)"}


def serbest_bolge_lekesiz(im: Image.Image, merkez: float, ornek, esik: float = 28, medyan: int = 9):
    """tema_build.serbest_bolge, ama ≤ ~`medyan` px pas noktacıkları (kâğıt dokusu, süs değil) medyan süzgeçle silinmiş
    kopyada: çizgili kenar, çiçek, pencere çerçevesi kalır; satır altındaki tek bir pas noktası "süs" sayılmaz."""
    rgba = im.convert("RGBA")
    rgb = rgba.convert("RGB").filter(ImageFilter.MedianFilter(medyan))
    sade = Image.merge("RGBA", (*rgb.split(), rgba.getchannel("A")))
    return tb.serbest_bolge(sade, merkez, ornek=ornek, esik=esik)


# ============================================================================= kart dilimleri (docs/11 §9)

def tekrar_bandi(im: Image.Image, aralik, periyot=(170, 230), k: int = 6, kenar: float = 0.06):
    """Hava postası çizgili kartın TEKRARLANAN orta bandı (docs/11 §9 "tekrarlanabilir düz kâğıt orta bandı").
    Kenarlardaki çapraz kırmızı-lacivert çizgiler dikeyde gerilirse açıları bozulur (03/01'in gerilen bandı burada
    olmaz): bant gerilmez, TEKRARLANIR. Bandın yüksekliği çizgi deseninin bir periyodu olmalı ki ek yerlerinde çizgiler
    sürsün. GPT çizimi tam periyodik değil (info_card sol ~192, sağ ~202 px): `aralik` (düz kâğıt satırları, yükseklik
    oranı) içinde her (t, P) için t satırının k satırı ile t+P'ninki karşılaştırılır — kenar şeritleri (iki yan, genişliğin
    `kenar`ı) tam, iç kâğıt ¼ ağırlıkla; en küçük ortalama fark seçilir. (t, P, bilgi)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    H, W = a.shape[:2]
    al = a[..., 3]
    rows = np.arange(int(H * .1), int(H * .9))
    x0 = int(np.median([np.argmax(al[r] > 128) for r in rows]))
    x1 = int(np.median([W - np.argmax(al[r, ::-1] > 128) for r in rows]))
    bw = int(kenar * W)
    cols = np.r_[x0:x0 + bw, x1 - bw:x1]
    ic = np.r_[x0 + bw:x1 - bw]
    rgb = a[..., :3]
    kb, ki = rgb[:, cols], rgb[:, ic]
    best = None
    for P in range(periyot[0], periyot[1] + 1):
        for t in range(int(H * aralik[0]), int(H * aralik[1]) - P - k):
            cb = np.abs(kb[t:t + k] - kb[t + P:t + P + k]).mean()
            ci = np.abs(ki[t:t + k] - ki[t + P:t + P + k]).mean()
            c = cb + 0.25 * ci
            if best is None or c < best[0]:
                best = (c, t, P, cb, ci)
    c, t, P, cb, ci = best
    return t, P, {"band_px": [t, P], "match_cost": round(float(c), 2), "border_diff": round(float(cb), 2),
                  "paper_diff": round(float(ci), 2), "search_rows_pct": [round(100 * aralik[0], 1), round(100 * aralik[1], 1)],
                  "period_range_px": list(periyot), "method": "tekrar (çizgi periyodu), gerilmez"}


# ============================================================================= ana akış

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prep-dir", help="parts_prep çıktısı için klasör (vars. geçici)")
    ap.add_argument("--q", type=int, default=80)
    ap.add_argument("--out", help="çıktı klasörü (vars. tema img/)")
    ap.add_argument("--onizleme", help="kesim/kenar önizlemeleri (tema klasörü dışında bir klasör)")
    args = ap.parse_args()

    out = Path(args.out).resolve() if args.out else THEME / "img"
    oniz = Path(args.onizleme).resolve() if args.onizleme else None
    if oniz and (oniz == THEME or oniz.is_relative_to(THEME)):
        sys.exit("--onizleme tema klasörünün içinde olamaz")
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="va-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (vintage-airmail-love-letter); ölçüler px, kutular [x, y, w, h], box_pct "
                         "yüzde. stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q
    temizlik = {}

    def webp(im, name, widths, q_=None):
        webp_yaz(im, name, widths, q_ or q, manifest, out)

    # ------------------------------------------------------------------ zarf (aynı tuval 1024×1536): hiza + kesimler
    ec_raw = Image.open(PARTS / "envelope_closed.png").convert("RGBA")
    eo_raw = Image.open(PARTS / "envelope_open.png").convert("RGBA")
    ec, temizlik["envelope_closed"] = temizle(ec_raw, sert=True)
    eo, temizlik["envelope_open"] = temizle(eo_raw, sert=True)
    W, H = ec.size
    eo_h, hiza_duz = hizala(eo, ec)
    print(f"hiza düzeltmesi: açık × {hiza_duz['scale']}, öteleme {hiza_duz['offset_px']} px · sonra "
          + " · ".join(f"{e['kenar']} {e['fark_pct']:+.2f}%" for e in hiza_duz["after"]))
    perf, delik = delik_cizgisi(ec)
    uyar("delik çizgisi", delik)
    yy = np.arange(H)[:, None].astype(np.float64)
    m_ust = np.clip(perf[None, :] - yy, 0, 1)          # delik çizgisinin üstü = 1 (çizgi satırı gövdede)
    env_strip = maskele(ec, m_ust)
    env_open = ust_uste(maskele(eo_h, m_ust), maskele(ec, 1 - m_ust))
    parca, serit = tb.serit_farki(ec, eo_h, esik=64, acma=2)
    uyar("env_torn", serit)
    torn_m = (np.asarray(parca["env_strip"])[..., 3] > 0) * m_ust            # yırtık kenarın altına, şeridin dışına inmez
    env_torn = maskele(ec, torn_m)
    fark_kapali = tb.ortusme(ec, [env_open, env_strip])
    torn_disari = int(((np.asarray(env_torn)[..., 3].astype(int) - np.asarray(env_strip)[..., 3].astype(int)) > 2).sum())
    if fark_kapali > 0.01:
        sys.exit(f"env_open + env_strip kapalı zarfı vermiyor (alfa farkı {fark_kapali:.4f} > 0.01)")
    if torn_disari:
        sys.exit(f"yırtılan parça şeridin dışına taşıyor ({torn_disari} px)")
    sa = np.asarray(env_strip)[..., 3]
    ta = np.asarray(env_torn)[..., 3]
    strip_box = alfa_kutu(env_strip, 1)
    torn_box = alfa_kutu(env_torn, 1)
    # yırtık kenar (artığın üst kenarı) — her sütunda yırtılan parçanın en alt satırı + 1
    yirtik = np.array([(np.flatnonzero(ta[:, x] > 64).max() + 1) if (ta[:, x] > 64).any() else np.nan for x in range(W)])
    Lc, Rc, Bc = kenarlar(np.asarray(ec)[..., 3])
    env_x0, env_x1, env_y1 = Lc, Rc, Bc
    env_y0 = float(np.median([np.argmax(np.asarray(ec)[:, x, 3] > 128) for x in range(int(Lc) + 20, int(Rc) - 20)]))
    env_w = env_x1 - env_x0

    # ------------------------------------------------------------------ kapanış (mühür + lavanta, tek parça)
    cl_raw = Image.open(prep / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = temizle(cl_raw, sert=False)
    cla = np.asarray(cl)
    (sx0, sy0, sx1, sy1), seal_m = muhur_olc(cla)
    seal_w = sx1 - sx0
    seal_c = ((sx0 + sx1) / 2, (sy0 + sy1) / 2)
    ox0, oy0, ox1, oy1 = muhur_ortasi((sx0, sy0, sx1, sy1))
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    s = (COMP["seal_w"] / COMP["env_w"]) * env_w / seal_w            # closure px → zarf tuval px
    serit_kutu = serit["strip_box"]                                    # kapalı − açık alfa (docs/11 §7.1 çapa)
    anchor = ((serit_kutu[0] + serit_kutu[2]) / 2, (serit_kutu[1] + serit_kutu[3]) / 2)
    kayma = (COMP["seal_c"][1] - COMP["strip_c_y"]) / COMP["env_w"]   # +0.095: mühür merkezi şerit merkezinin altında
    hedef = ((env_x0 + env_x1) / 2, anchor[1] + kayma * env_w)
    c_left = hedef[0] - (seal_c[0] - ck[0]) * s
    c_top = hedef[1] - (seal_c[1] - ck[1]) * s
    closure_box = [c_left, c_top, c_left + (ck[2] - ck[0]) * s, c_top + (ck[3] - ck[1]) * s]

    # ------------------------------------------------------------------ kart (card_small) yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    card_w = CARD_W_OF_ENV * env_w
    card_h = card_w / card_ar
    card_x = (env_x0 + env_x1) / 2 - card_w / 2
    perf_med = float(np.median(perf[int(env_x0):int(env_x1)]))
    hidden_top = perf_med + 0.02 * env_w                              # kartın üstü çizgi bandının arkasında
    kx0, kx1 = int(card_x), int(card_x + card_w)
    artik_ust = float(np.nanmin(yirtik[kx0:kx1]))                      # kart sütunlarında yırtık kenarın en yüksek noktası
    # kart tek yönde yukarı (docs/11 §7.1, G401 incelemesi): out = alt kenarı yırtık kenarın kartın %3'ü kadar üstünde
    # (z-index takasında köşe artığın önüne "atlamaz"); front = olduğu yerde öne, %2 aşağı + × 1.04, büyüyen gölge
    out_top = artik_ust - 0.03 * card_h - card_h
    front_top = out_top + 0.02 * card_h
    scale_front = 1.04
    fr_w, fr_h = card_w * scale_front, card_h * scale_front
    front_box = [card_x - (fr_w - card_w) / 2, front_top - (fr_h - card_h) / 2,
                 card_x + card_w + (fr_w - card_w) / 2, front_top + card_h + (fr_h - card_h) / 2]
    card_box_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    ob = alfa_kutu(env_open, 1)
    sb = strip_box
    X0 = min(ob[0], sb[0], closure_box[0], front_box[0])
    X1 = max(ob[2], sb[2], closure_box[2], front_box[2])
    Y0 = min(ob[1], sb[1], closure_box[1], out_top, front_box[1])
    Y1 = max(ob[3], sb[3], closure_box[3])
    SW, SH = X1 - X0, Y1 - Y0

    def pct(box):
        x0, y0, x1, y1 = box
        return [round(100 * (x0 - X0) / SW, 3), round(100 * (y0 - Y0) / SH, 3),
                round(100 * (x1 - x0) / SW, 3), round(100 * (y1 - y0) / SH, 3)]

    stage = {"canvas": [W, H], "box": [round(X0, 1), round(Y0, 1), round(SW, 1), round(SH, 1)], "ratio": round(SW / SH, 5)}
    katman = {}
    for ad, im in (("env_open", env_open), ("env_strip", env_strip), ("env_torn", env_torn)):
        k = alfa_kutu(im, esik=1)
        webp(im.crop(k), ad, WIDTHS[ad])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    webp(cl_crop, "closure", WIDTHS["closure"])
    katman["closure"] = pct(closure_box)
    katman["card"] = pct(card_box_hidden)
    stage["parts"] = katman
    stage["closed_obj"] = {"box_pct": pct([env_x0, env_y0, env_x1, env_y1]), "aspect": round(env_w / (env_y1 - env_y0), 4),
                           "frac_w": round(env_w / SW, 5), "top_frac_of_stage_w": round((env_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - env_y1) / SW, 5)}
    stage["body_bottom_pct"] = round(100 * (env_y1 - Y0) / SH, 3)          # kart yuvası alttan kırpım
    stage["tear"] = {"perforation_pct_of_stage": round(100 * (perf_med - Y0) / SH, 3),
                     "torn_edge_top_px": round(float(np.nanmin(yirtik)), 1), "torn_edge_bottom_px": round(float(np.nanmax(yirtik)), 1),
                     "direction": "left → right (clip-path), the torn part lifts on its moving tear point"}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3), "front_scale": scale_front,
                          "torn_edge_at_card_px": round(artik_ust, 1), "card_w_of_env": CARD_W_OF_ENV}
    stage["cuts"] = {"perforation": delik, "torn": serit}
    stage["align"] = hiza_duz
    stage["checks"] = {"strip_plus_open_vs_closed_diff": round(fark_kapali, 5), "torn_outside_strip_px": torn_disari}
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "tear strip box centre (closed − open alpha)", "anchor_px": [round(anchor[0], 1), round(anchor[1], 1)],
        "center_px": [round(hedef[0], 1), round(hedef[1], 1)], "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "seal_width_px_closure": seal_w,
        "seal_center_in_crop_pct": [round(100 * (seal_c[0] - ck[0]) / (ck[2] - ck[0]), 3), round(100 * (seal_c[1] - ck[1]) / (ck[3] - ck[1]), 3)],
        "seal_box_in_crop_pct": [round(100 * (sx0 - ck[0]) / (ck[2] - ck[0]), 3), round(100 * (sy0 - ck[1]) / (ck[3] - ck[1]), 3),
                                 round(100 * seal_w / (ck[2] - ck[0]), 3), round(100 * (sy1 - sy0) / (ck[3] - ck[1]), 3)],
        "mono_in_crop_pct": [round(100 * (ox0 - ck[0]) / (ck[2] - ck[0]), 3), round(100 * (oy0 - ck[1]) / (ck[3] - ck[1]), 3),
                             round(100 * (ox1 - ox0) / (ck[2] - ck[0]), 3), round(100 * (oy1 - oy0) / (ck[3] - ck[1]), 3)],
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": COMP["env_w"], "seal_w_over_env_w": round(COMP["seal_w"] / COMP["env_w"], 4),
                 "seal_center_minus_strip_center_over_env_w": round(kayma, 4)},
        "carried_by_flap": False,
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = temizle(im, sert=True)
        im, n_halka = pencere_halkasi(im, prep, win, parca)
        temizlik[parca]["window_ring_px"] = n_halka
        if parca == "card_small":   # yazı alanı: pencerenin altındaki çizgili kâğıt
            im, temizlik["card_small"]["writing_area"] = yazi_alani(im, [(.07, .6, .93, .96)])
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
        if oniz:
            bg = Image.new("RGBA", im.size, (60, 40, 30, 255)); bg.alpha_composite(im)
            bg.convert("RGB").save(oniz / f"kenar_{parca}.jpg", quality=88)
        if parca == "card_small":
            manifest["card_small"]["free_zone"] = serbest_bolge_lekesiz(im, 0.5, ornek=(.8, .86))
    manifest["photo_slots"] = slots

    # düz kâğıt aralığı (yükseklik oranı): info_card üstte tek çiçek (%0–17), davet kartı sol üst küme (%0–43) ve sağ alt
    # damga (%74–100) — bant bunların arasında
    # yazı alanı = çizgili kenarın içi; hariç: davet kartında sol üst çiçek + pul kümesi ve sağ alt damga, info kartında
    # üstteki çiçek
    yazi = {"invitation_card": ([(.07, .055, .93, .945)], [(0, 0, .47, .44), (.45, .74, 1, 1)]),
            "info_card": ([(.07, .05, .93, .955)], [(.32, 0, .68, .19)])}
    for nm, aralik in (("invitation_card", (.44, .73)), ("info_card", (.20, .88))):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = temizle(im, sert=True)
        im, temizlik[nm]["writing_area"] = yazi_alani(im, *yazi[nm])
        webp(im, nm, WIDTHS[nm])
        fz = serbest_bolge_lekesiz(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        t, P, bant = tekrar_bandi(im, aralik)
        webp(im.crop((0, t, im.width, t + P)), f"{nm}_band", WIDTHS[nm])
        H_ = im.height
        manifest[nm]["slices"] = {"top_end_pct": round(100 * t / H_, 3), "bottom_start_pct": round(100 * (t + P) / H_, 3),
                                  "band_ratio": round(im.width / P, 5), "ratio": round(im.width / H_, 5), **bant,
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta bant ::before = img/<kart>_band "
                                          "tekrarı (background-repeat: round; site.js fitPaper bandı tam sayıya yuvarlar), alt "
                                          "dilim ::after — docs/11 §9; site.css --ar/--t/--b"}

    # köşe kümeleri ilk görünümde (zarf sayfası, home): tek WebP ≤ 200 KB (docs/11 §6) — ince kuru çiçek dokusu q 70'te de temiz
    for nm, qq in (("decor_tl", 70), ("decor_br", 70), ("divider", q)):
        im, temizlik[nm] = temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm], qq)
    # accent_1 pul (parçacık + masada sabit), accent_2 kuru unutma beni dalı (açılışta düşen çiçek), accent_3 posta
    # damgası halkası (story çerçevesinin köşesine basılır) — sabit kullanımda büyük genişlik de (DPR 3)
    for i, gen in ((1, [200, 400]), (2, [200, 400]), (3, [240, 480])):
        im, temizlik[f"accent_{i}"] = temizle(Image.open(prep / f"accent_{i}.png"), sert=(i == 1))
        im = im.crop(alfa_kutu(im))
        webp(im, f"accent_{i}", gen)

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    webp(bg, "bg_page", [640, 1024], 76)
    webp(tb.bulanik_fon(bg, (640, 960), 6), "mist", [640], 80)
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta2 = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((560, 520, 860, 820))).reshape(-1, 3).astype(np.float64).mean(0)
    ta2 = ta2 - ta2.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta2), 0, 255).astype(np.uint8), "RGB")
    # uzun sayfaların kâğıdı: kartlarla aynı pas noktası / leke yumuşatması (metin bu zeminde de durur); dikişsiz kalsın
    # diye 3 × 3 döşenmiş kopyada işlenip ortası alınır
    T = tile.width
    kare = Image.new("RGBA", (3 * T, 3 * T))
    for i in range(3):
        for j in range(3):
            kare.paste(tile.convert("RGBA"), (i * T, j * T))
    kare, temizlik["bg_tile"] = yazi_alani(kare, [(0, 0, 1, 1)], esik=20, k=0.25, yumusak=0)
    tile = kare.crop((T, T, 2 * T, 2 * T)).convert("RGB")
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    # story sayfasının yazı masası: bg_desk + dikeyde aynalanmış kopyası alt alta = dikişsiz dikey karo (GPT dosyasının üst
    # ve alt kenarı birbirine uymuyor: üstte ışık huzmesi); uzun sayfa boyunca repeat-y (sabit/fixed zemin yok: iOS ve tam
    # sayfa görüntüsünde kayıyordu)
    desk = Image.open(PARTS / "bg_desk.png").convert("RGB")
    cift = Image.new("RGB", (desk.width, 2 * desk.height))
    cift.paste(desk, (0, 0))
    cift.paste(ImageOps.flip(desk), (0, desk.height))
    webp(cift, "bg_desk_pair", [640], 54)
    webp(cift, "bg_desk_pair_2x", [768], 42)   # DPR ≥ 2 (image-set 2x); ilk görünümde ≤ 200 KB
    da = np.asarray(desk.crop((100, 300, 924, 1300))).reshape(-1, 3).astype(np.float64)
    manifest["bg_desk_pair"]["tone"] = [round(v, 1) for v in da.mean(0)]

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph = tb.yer_tutucu(bg, kutu, oran, max(gen), ton=IVORY, karisim=0.30)
        en_koyu = int(np.asarray(ph.convert("L")).min())
        if en_koyu < PH_MIN_LUM:
            sys.exit(f"ph_{key}: kırpım {kutu} bir dekor parçası içeriyor (en koyu {en_koyu} < {PH_MIN_LUM})")
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"]["aspect"] = oran
        manifest[f"ph_{key}"]["min_lum"] = en_koyu

    # ------------------------------------------------------------------ paylaşım görseli + favicon (mühür)
    og, og_bilgi = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    og_bilgi["file"] = "og-1200x630.jpg"
    og_bilgi["bytes"] = tb.og_kaydet(og, out / og_bilgi["file"], 82)
    manifest["og"] = og_bilgi
    # favicon: yalnız mühür (lavanta sapları 16 px'te okunmaz) — mühür bölgesi maskesi (kesim, çizim yok)
    muhur = maskele(cl, genislet(seal_m, 3).astype(np.float64))
    ikon, ikon_bilgi = tb.ikon(muhur, 180)
    ikon.save(out / "favicon.png", optimize=True)
    ikon_bilgi.update({"source": "closure (seal region only)", "file": "favicon.png", "bytes": (out / "favicon.png").stat().st_size})
    manifest["favicon"] = ikon_bilgi

    # ------------------------------------------------------------------ hiza (ham GPT dosyaları, Kaydet tuvali)
    olcu = tb.kaydet_olculeri(COL)
    hz = tb.hiza_olc(ec_raw, eo_raw, "kapak", olcu.get("envelope_closed"), olcu.get("envelope_open"))
    hz["correction"] = "stage.align (ölçülen ölçek + öteleme)"
    manifest["align"] = hz
    print(f"hiza ham ({hz['durum']}): {tb.hiza_ozet(hz)}")
    if hz["durum"] == "hata":
        sys.exit("kapalı/açık zarf hizası > %4 (GPT'den yeniden üretim gerekir)")
    hz2 = tb.hiza_olc(ec, eo_h, "kapak")
    stage["align"]["after_check"] = {"durum": hz2["durum"], "ozet": tb.hiza_ozet(hz2)}
    print(f"hiza düzeltilmiş ({hz2['durum']}): {tb.hiza_ozet(hz2)}")

    yesil = tb.yesil_denetle(out)
    if yesil:
        sys.exit(f"görünür #00FF00 kalıntısı: {yesil}")
    manifest["cleanup"] = temizlik
    manifest["checks"] = {"strip_plus_open_vs_closed_diff": round(fark_kapali, 5), "green_px": 0,
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): kartlar <img> ile otomatik; parçacık katmanı; yatay telefonda da ilk
    # ekran nav'ın üstünde, hero isimleri ≥ 36 px (qa 2026-10-14 dersleri)
    manifest["theme_check"] = {"particles": ".accent-layer", "clusters": ".corner", "first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, eo_h, env_open, env_strip, env_torn, cl_crop, katman, stage, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · kapalı nesne {stage['closed_obj']}")
    print(f"katmanlar {katman}")
    print(f"kart yolu {stage['card_path']} · yırtık {stage['tear']}")
    print(f"kapanış merkez {manifest['closure']['center_pct']} mühür kutusu {manifest['closure']['seal_box_in_crop_pct']} "
          f"monogram {manifest['closure']['mono_in_crop_pct']}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} dilimler {manifest[nm]['slices']['top_end_pct']}–{manifest[nm]['slices']['bottom_start_pct']} oran {manifest[nm]['slices']['ratio']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · sayfa rengi {manifest['page_color']}")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, ec, eo_h, env_open, env_strip, env_torn, cl_crop, katman, stage, cs):
    """Kesim önizlemeleri (gözle denetim): şerit / gövde / yırtılan parça; kapalı ve açık sahne (kapanış, kart yerinde)."""
    def on(im, bg):
        b = Image.new("RGBA", im.size, bg + (255,))
        b.alpha_composite(im)
        return b.convert("RGB")
    W, H = ec.size
    band = (0, 540, W, 760)
    sheet = Image.new("RGB", (W, (band[3] - band[1]) * 5), (255, 255, 255))
    for i, (im, c) in enumerate(((ec, (70, 90, 70)), (eo_h, (70, 90, 70)), (env_strip, (190, 50, 50)), (env_open, (50, 50, 190)),
                                 (env_torn, (190, 50, 50)))):
        sheet.paste(on(im, c).crop(band), (0, i * (band[3] - band[1])))
    sheet.save(oniz / "kesimler.jpg", quality=88)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    for ad, kat in (("kapali_sahne", ("env_open", "env_strip", "closure")), ("acik_sahne", ("card", "env_open"))):
        sahne = Image.new("RGBA", (900, round(SH * k)), (241, 233, 216, 255))
        for nm in kat:
            src = {"env_open": env_open, "env_strip": env_strip, "closure": cl_crop, "card": cs}[nm]
            if nm.startswith("env_"):
                src = src.crop(alfa_kutu(src, 1))
            x, y, w, h = katman[nm]
            if nm == "card":
                y += stage["card_path"]["out_translate_pct"] * h / 100
            r = src.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
            sahne.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
        sahne.convert("RGB").save(oniz / f"{ad}.jpg", quality=88)


if __name__ == "__main__":
    main()
