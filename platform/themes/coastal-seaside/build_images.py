#!/usr/bin/env python3
"""Coastal Seaside teması (tasarım 20, G420) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/coastal-seaside/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/20_Coastal_Seaside/assets/gpt/parts/ (G220, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri, windows.json); tema klasörüne, img_src/'ye, assets/'e yazılmaz (docs/11 §1,
§5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf; kapanış kapakla TAŞINMAZ: "the watercolor wave sweeps across the
screen and carries the seashell and twine away"):
  * Kapak kesimi: tema_build.kapak_kes("v") — kum rengi V kapağın serbest kenarı dalgalı (kıyı çizgisi gibi); kenarın
    altındaki ince gölge en güçlü parlaklık düşüşü, iz ±14 px dalgayı izler (önizleme: cuts_envelope.jpg).
  * Ön cep VURGU ÇİZGİSİ izi (cep_cizgi): açık zarfın ön yüzü iki yan kanat + düz üst kenarlı alt kanat, hepsi aynı
    kum kâğıdı; arkadaki iç yüz de kum rengi (astar ortada söner). Renk taraması kenarı bulamıyor (tema_build.cep_kes
    geometrik V'ye düştü, uç y 1132 — gerçek cep tabanı y ≈ 1003 düz). Kenar her yerde kağıdın kendi ince "gölge üstte
    + parlak çizgi altta" çiftiyle görünüyor: 11 sütunluk yatay ortalamalı parlaklıkta satır − (±4 satır ortalaması) =
    vurgu haritası; önce düz taban satırı (orta bantta en güçlü vurgu), sonra her sütunda köşeden tabana uzanan ön
    bilgi çizgisinin ±34 px bandında en güçlü vurgu; 9 sütun medyanı + 2. derece aykırısız uydurma (yan kanatlar hafif
    kavisli). Kesim parlak çizginin 1 px üstünden (parlak kenar cepte, gölge arkada kalır).
  * Hiza: kit_check geçiyor (sol +0,10 · sağ +0,49 · alt +1,11 %) — dönüşüm yok (manifest.align). Menteşe satırı =
    kapalı zarfın üst kenarı (kapak_kes hinge_row); açık kapak/gövde aynı satırdan ayrılır.
  * Kapanış (closure.png = deniz tarağı kabuğu + kısa doğal sicim halkası, TEK parça) kare tuvalde büyük çizildi; yeri
    kesim geometrisine bağlı: çapa = V kapağın ucu (kapak_kes tip); W1.1 comp'ta ölçülen kabuk+sicim genişliği / zarf
    genişliği ve merkezin uca göre kayması (manifest.closure; COMP).
  * Açılış dalgası (wave.png, ek parça): alfa kutusuna kırpılır, iki genişlik; site ekranı soldan sağa geçirir.
  * Lomboz (G098, GM07 R2): story ve home lombozu `frame_portrait_r2_v2.png` — tam yuvarlak pirinç lomboz, sekiz perçin
    (comp W1.3 gibi; eski frame_portrait dik ovaldi). Ham imagegen çıktısı (kaynakta düzenleme yok): penceresi düz değil
    (kenarda koyulaşan yeşil, ortada alfa deliği = GPT "bulut lekesi") → olağan hat: GPT_PROMPTS.md'de Kaydet satırı
    olmadığından parts_prep.parca_isle elle çağrılır (geçici klasör `gm07/`); leke dolgusu pencereyi tam şeffaf yapar,
    foto_alani her WebP'de denetler.
  * Telefon zemini (`sea`): bg_page 2:3 telefonda (en/boy ≈ 0,46) cover ile köşe kümelerini keserdi. Zemin bg_page'in
    iki kümesiz bölgesinden kurulur (deniz sisi + alttaki kıyı: dalga ve kum, sağdaki kabuk kümesi hariç), 120 px yumuşak
    geçiş; kumsal kümeleri ayrı katman (decor_tl / decor_br), ekranda bütün. Geniş ekran: `sea_wide` (kümesiz geniş
    sis); uzun sayfaların sonu ve geniş ekranın alt bandı `shore` (kıyı kırpımı).
  * GPT kusurları: dış hatta yarı saydam hâle temizliği (alfa < 12 sıfır, çekirdekten uzak piksel silinir, kenar rengi
    komşu opak renge), WebP kenar saçağı için renk taşıma. Yeşil denetimi: kumul otu zeytin yeşili; parlak kroma şartıyla
    (kroma_yesil) her WebP'de 0.

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json. site.css'teki yüzdeler
manifest'ten; --onizleme DIR kesim önizlemeleri + compare_closure.jpg yazar (gözle denetim). Tema klasörü ≤ 3 MB.
Bağımlılık: Pillow + numpy.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/20_Coastal_Seaside"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
GM07_PORTRAIT = "frame_portrait_r2_v2.png"   # GM07 R2 yuvarlak lomboz (G098)
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 873], "env_cflap": [440, 873], "env_flap": [440, 873], "env_body": [440, 873],
    "env_pocket": [440, 873], "closure": [240, 480], "card_small": [320, 640], "invitation_card": [480, 914],
    "info_card": [480, 840], "frame_portrait": [320, 640], "frame_landscape": [480, 960], "decor_tl": [360, 540, 720],
    "decor_br": [360, 540, 720], "divider": [300], "wave": [640, 1200],
}
# divider: a row of shells and sea glass, ≤ 110 px wide on every page (DPR 3 → 330 px): one 300 px file is enough
# kümeler (kumul otu, kum, köpük) WebP'de ağır, ağırlığın çoğu alfa kanalında: alfa kalitesi 60 (suluboya yumuşak kenar)
QUALITY = {"decor_tl": 76, "decor_br": 76, "closure": 78, "wave": 74, "invitation_card": 74}
ALPHA_Q = {"decor_tl": 60, "decor_br": 60, "wave": 64}
CARD_W_OF_ENV = 0.52       # kart genişliği / zarf genişliği (kart zarfa sığar)
CARD_PHOTO_ABOVE = 0.06    # cepte bekleyen kart: foto penceresinin en çok bu kadarı cep kenarının üstünde
POCKET_BELOW = 0.04        # out: kartın alt köşeleri cebin kenarını kart boyunun bu kadarı aşar (docs/11 §7.1)
FRONT_DROP, FRONT_SCALE = 0.03, 1.04
# palet (palette.json seaside): mist_top #F4F8F9 — yer tutucu tonu
MIST = (244, 248, 249)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: kümesiz deniz sisi)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (420, 600, 800, 980)),
    "story_1": ("portrait", [320, 640], (300, 560, 640, 1000)),
    "story_2": ("portrait", [320, 640], (520, 600, 860, 1040)),
    "story_3": ("portrait", [320, 640], (360, 640, 700, 1080)),
    "venue": ("landscape", [480, 960], (240, 600, 900, 1000)),
}
PH_MIN_LUM = 200   # yer tutucuda en koyu piksel en az bu: kümeden kabuk/ot kırpıma girmez (çıkış ≠ 0)
PH_MAX_SAT = 40    # ... ve renkli dekor yok (max − min kanal, %99,9; sis zaten açık mavi ≈ 30)
# telefon zemini (bg_page 1024×1536 kaynak pikseli; ızgarayla ölçüldü: sol üst kumsal y < 560'ta x ≤ 500, üstte dalga
# x ≤ 680 y < 210; alt kıyı y ≥ 1130 bütün genişlikte; sağ alt kabuk kümesi x ≥ 690 y ≥ 880)
SEA_TOP = (420, 230, 880, 1020)      # deniz sisi (açık suluboya; sağdaki kumul otu uçları dışarıda)
SEA_SHORE = (0, 1130, 600, 1536)     # alttaki kıyı: köpüklü dalga + kum (kabuk/deniz camı kümesi x ≥ 610 dışarıda)
SEA_BLEND = 120                      # px — iki kırpımın yumuşak geçiş bandı
SEA_WIDE = (0, 560, 1024, 1110)      # geniş ekran: kümesiz tek geniş sis (en/boy 1,86)
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536): zarfın kum gövdesi (zemin mavisinden R ≥ B ile ayrılır) x 145–879,
# y 575–1038; kabuk + sicim halkası (gözle, kırpım 340,740 + R − B > 55 maskesi; kapak kenarının gölgesi hariç) x 402–630,
# y 800–912. Zarf kutusu envelope_closed alfa kutusuna eşlenir → kapak ucu comp'ta; kapanış merkezi uca göre kayma ve
# genişlik / zarf genişliği buradan (build sırasında hesaplanır, manifest.closure.comp).
COMP = {"env_box": (145.0, 575.0, 879.0, 1038.0), "closure_box": (402.0, 800.0, 630.0, 912.0)}


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (GPT hâlesi, saçak)

def hale_temizle(im: Image.Image, sert: bool, esik: int = 12, cekirdek: int = 96):
    """Dış hattaki yarı saydam hâleyi temizler (çizim yok). sert: kart/çerçeve/zarf gibi net kenarlı nesne.
    1) alfa < esik → 0, kalan alfa [esik, 255] → [0, 255]; 2) çekirdekten (alfa ≥ cekirdek) uzak (sert 1 px, yumuşak
    3 px) piksel silinir; 3) kenar pikselinin (alfa < 230) rengi komşu opak piksellerin ortalamasına çekilir."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    al = a[..., 3]
    once = int((al > 0).sum())
    yeni = np.clip((al - esik) * 255.0 / (255 - esik), 0, 255)
    core = al >= cekirdek
    near = genislet(core, 1 if sert else 3)
    yeni[~near] = 0
    opak = (al >= 230).astype(np.float64)
    pay = _kutu_bulanik(opak, 3)
    renk = np.stack([_kutu_bulanik(a[..., i] * opak, 3) for i in range(3)], -1)
    var = pay > 1e-3
    kenar = (yeni > 0) & (al < 230) & var
    hedef = renk[kenar] / pay[kenar][:, None]
    w = (1 - al[kenar] / 230.0)[:, None] if not sert else np.ones((int(kenar.sum()), 1))
    a[..., :3][kenar] = a[..., :3][kenar] * (1 - w) + hedef * w
    a[..., 3] = yeni
    sonra = int((yeni > 0).sum())
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), {
        "alpha_floor": esik, "core": cekirdek, "reach_px": 1 if sert else 3, "removed_px": once - sonra}


def renk_tasir(im: Image.Image) -> Image.Image:
    """Şeffaf piksellerin RGB'si görünen komşu renkle doldurulur ("alpha bleeding"); kayıplı WebP renk alt örneklemesi
    kenara siyah karıştırıp koyu saçak üretmesin. Görüntü değişmez (yalnız alfa 0 piksellerin rengi)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    gor = a[..., 3] >= 24
    if gor.all() or not gor.any():
        return im
    rgb = a[..., :3]
    dolu = gor.copy()
    agirlik = a[..., 3] / 255.0 * gor
    for r in (1, 2, 4, 8, 16):
        w = np.where(dolu, np.maximum(agirlik, 0.1), 0.0)
        pay = _kutu_bulanik(w, r)
        renk = np.stack([_kutu_bulanik(rgb[..., i] * w, r) for i in range(3)], -1)
        yeni = ~dolu & (pay > 1e-6)
        rgb[yeni] = renk[yeni] / pay[yeni][:, None]
        dolu |= yeni
    a[..., :3] = rgb
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA")


def kroma_yesil(dosya: Path) -> tuple:
    """(tema_build.yesil_gorunur sayısı, #00FF00 benzeri parlak kroma yeşili sayısı). Kumul otu ve deniz camı tema_build
    ölçütüne takılabilir; gerçek pencere kalıntısı parlak (opak #00FF00 ≈ (5, 242, 2)) → ek şart G ≥ 190 ve yeşil
    fazlası ≥ 60. Yapı ikinciyle durur; ilki manifest'e yazılır."""
    a = np.asarray(Image.open(dosya).convert("RGBA")).astype(np.int16)
    mx = np.maximum(a[..., 0], a[..., 2])
    t = a[..., 1] - mx
    taban = (t > 40) & (a[..., 1] * 2 >= 3 * mx) & (a[..., 3] > 25)
    return int(taban.sum()), int((taban & (a[..., 1] >= 190) & (t >= 60)).sum())


def webp_yaz(im: Image.Image, name: str, widths, q: int, manifest: dict, out: Path, aq: int = 90):
    """tema_build.webp ile aynı çıktı biçimi; fark: şeffaf parçada küçültme sonrası renk taşıma (renk_tasir), alfa kalitesi
    parametre (ALPHA_Q)."""
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
        r.save(p, "WEBP", quality=q, method=6, alpha_quality=aq)
        files.append({"file": p.name, "w": w, "h": h, "bytes": p.stat().st_size})
    manifest[name] = {"src_size": [w0, h0], "ratio": round(w0 / h0, 5), "files": files}
    if q != 80 or aq != 90:
        manifest[name]["quality"] = [q, aq]


def alfa_kutu(im: Image.Image, esik: int = 8):
    k = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)
    return [int(v) for v in k]


# ============================================================================= kesimler (bu tasarım)

def vurgu_haritasi(rgba: np.ndarray, yatay: int = 11, ofset: int = 4) -> np.ndarray:
    """Yatay kâğıt kenarlarının ince parlak çizgisi: yatayda `yatay` sütun ortalamalı parlaklık − (±ofset satırın ortalaması).
    Kum kâğıdının benekleri kısa, kenar çizgileri uzun → yatay ortalama benekleri bastırır."""
    L = rgba[..., :3] @ LUM
    k = np.ones(yatay) / yatay
    Ls = np.apply_along_axis(lambda r: np.convolve(r, k, "same"), 1, L)
    H = np.zeros_like(L)
    H[ofset:-ofset] = Ls[ofset:-ofset] - 0.5 * (Ls[:-2 * ofset] + Ls[2 * ofset:])
    return H


def cep_cizgi(eo: Image.Image, mentese: int, bant: int = 34):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Ön yüz: iki yan kanadın köşeden inen kavisli üst kenarı +
    alt kanadın düz üst kenarı (cep tabanı). Hepsi kâğıdın kendi ince vurgu çizgisiyle görünür (vurgu_haritasi).
    1) taban satırı: gövdenin orta %20'sinde en güçlü vurgu satırı (menteşenin 120–320 px altı);
    2) tabanın uçları: taban satırında vurgunun ortalamanın yarısının üstünde kaldığı en geniş kesintisiz aralık;
    3) her sütunda ön bilgi çizgisi (köşe menteşede → taban ucu) ±bant içinde en güçlü vurgu; 9 sütun medyanı, yan
       kanatlarda 2. derece aykırısız uydurma; 4) kesim = parlak çizginin 1 px üstü (parlak kenar cepte)."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    cols = np.flatnonzero(op[mentese + 20:].any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    V = vurgu_haritasi(a)
    xm0, xm1 = int(x0 + (x1 - x0) * .4), int(x1 - (x1 - x0) * .4)
    satirlar = np.arange(mentese + 120, mentese + 320)
    taban_skor = V[satirlar][:, xm0:xm1].mean(1)
    yb = int(satirlar[int(np.argmax(taban_skor))])
    sira = V[yb - 1:yb + 2].max(0)
    esik = 0.5 * float(V[yb, xm0:xm1].mean())
    ici = sira > esik
    xc = (x0 + x1) // 2
    xa = xc
    while xa > x0 and ici[xa - 1:xa + 1].any():
        xa -= 1
    xb = xc
    while xb < x1 and ici[xb:xb + 2].any():
        xb += 1
    ham = np.full(W, np.nan)
    for x in range(x0 + 2, x1 - 1):
        if xa <= x <= xb:
            yp = yb
        elif x < xa:
            yp = mentese + (yb - mentese) * (x - x0) / max(1, xa - x0)
        else:
            yp = mentese + (yb - mentese) * (x1 - x) / max(1, x1 - xb)
        lo, hi = int(max(mentese + 2, yp - bant)), int(min(H - 2, yp + bant))
        ham[x] = lo + int(np.argmax(V[lo:hi, x]))
    kenar = ham.copy()
    for x in range(x0 + 6, x1 - 5):
        kenar[x] = np.nanmedian(ham[x - 4:x + 5])
    bilgi_fit = {}
    for ad, (s0, s1) in (("left", (x0 + 6, xa - 2)), ("right", (xb + 2, x1 - 6))):
        xs = np.arange(s0, s1)
        ys = kenar[xs]
        ok = np.isfinite(ys)
        c = np.polyfit(xs[ok], ys[ok], 2)
        for _ in range(3):
            r = np.abs(np.polyval(c, xs) - ys)
            ok = np.isfinite(ys) & (r < max(3.0, 2.5 * float(np.nanmedian(r))))
            c = np.polyfit(xs[ok], ys[ok], 2)
        r = np.abs(np.polyval(c, xs) - ys)
        bilgi_fit[ad] = {"poly": [round(float(v), 7) for v in c], "resid_median_px": round(float(np.nanmedian(r)), 2),
                         "inliers": int(ok.sum()), "cols": int(len(xs))}
        kenar[s0:s1] = np.polyval(c, xs)
        if ad == "left":
            kenar[x0:s0] = np.polyval(c, np.arange(x0, s0))
        else:
            kenar[s1:x1 + 1] = np.polyval(c, np.arange(s1, x1 + 1))
    kenar[xa - 2:xb + 2] = yb
    kenar[:x0] = kenar[x0]
    kenar[x1 + 1:] = kenar[x1]
    kenar = np.maximum(kenar - 1, mentese)
    yy = np.arange(H)[:, None]
    m_ = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    out = a.copy()
    out[..., 3] *= m_
    bilgi = {"method": "renk", "detector": "vurgu çizgisi (yatay 11 sütun ortalamalı parlaklık − ±4 satır) + taban satırı + "
                                           "2. derece aykırısız yan kanatlar",
             "body": [x0, mentese, x1, int(np.flatnonzero(op.any(1)).max())], "floor_row": yb,
             "floor_x": [int(xa), int(xb)], "floor_score": round(float(taban_skor.max()), 2),
             "edge_at": {"x0+20": round(float(kenar[x0 + 20]), 1), "x0+150": round(float(kenar[x0 + 150]), 1),
                         "mid": round(float(kenar[xc]), 1), "x1-150": round(float(kenar[x1 - 150]), 1),
                         "x1-20": round(float(kenar[x1 - 20]), 1)},
             "sides": bilgi_fit, "warnings": []}
    for ad, f in bilgi_fit.items():
        if f["resid_median_px"] > 4 or f["inliers"] < 0.6 * f["cols"]:
            bilgi["warnings"].append(f"{ad} kanat kenarı zayıf ({f})")
    if taban_skor.max() < 8:
        bilgi["warnings"].append(f"cep tabanı vurgusu zayıf ({taban_skor.max():.1f})")
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


# ============================================================================= kart dilimleri (docs/11 §9)

def benek_temizle(im: Image.Image, esik: float = 26, kagit_esik: float = 22):
    """GPT kusuru onarımı (bilgi + davet kartı): katalog ve W1.4/W1.5 comp'ları düz yumuşak beyaz kâğıt istiyor, GPT kâğıda
    renkli kum benekleri serpmiş (metin satırlarının altına düşüyor). Yalnız DÜZ KÂĞIT üzerindeki küçük benek pikselleri
    (çevresinin medyanından renkçe > esik uzak, medyanı kâğıt rengine < kagit_esik yakın) o medyanla doldurulur; kabuk, ot,
    dalga gibi büyük boyalı süsün medyanı kâğıt değildir → dokunulmaz. Çizim yok. (görüntü, değişen piksel sayısı)"""
    from PIL import ImageFilter
    im = im.convert("RGBA")
    a = np.asarray(im).astype(np.float64)
    k = 3
    med = im.convert("RGB").resize((im.width // k, im.height // k), Image.BOX).filter(ImageFilter.MedianFilter(9))
    med = np.asarray(med.resize(im.size, Image.BILINEAR)).astype(np.float64)
    H, W = a.shape[:2]
    kagit = np.median(a[int(H * .45):int(H * .55), int(W * .4):int(W * .6), :3].reshape(-1, 3), 0)
    fark = np.sqrt(((a[..., :3] - med) ** 2).sum(-1))
    duz = np.sqrt(((med - kagit) ** 2).sum(-1)) < kagit_esik
    benek = genislet((fark > esik) & duz & (a[..., 3] > 250), 2) & duz & (a[..., 3] > 250)
    a[..., :3][benek] = med[benek]
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), int(benek.sum())


def benek_sil(im: Image.Image) -> Image.Image:
    """Yalnız ÖLÇÜM için: kâğıdın kendi küçük benekleri (kum kâğıdı "tiny speckles", ≤ ~16 px) medyan süzgeciyle silinir;
    boyalı süs (kabuk, ot, dalga) büyük olduğu için kalır. serbest_bolge'ye verilir; görsel dosyalar değişmez."""
    from PIL import ImageFilter
    im = im.convert("RGBA")
    k = 3   # ⅓ ölçekte 9 px medyan ≈ tam ölçekte 27 px pencere (≤ ~16 px benek silinir), hızlı
    rgb = im.convert("RGB").resize((im.width // k, im.height // k), Image.BOX).filter(ImageFilter.MedianFilter(9))
    rgb = rgb.resize(im.size, Image.BILINEAR)
    out = rgb.convert("RGBA")
    out.putalpha(im.getchannel("A"))
    return out

def dilimler(fz, kenar_bosluk=(8.0, 92.0), min_gen: float = 80.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın bütün genişliğinde süs yok (açıklık ≥ min_gen).
    En uzun kesintisiz düz bant gerilir. (t, b)."""
    duz = [y for y, L, R in fz if L is not None and R - L >= min_gen and kenar_bosluk[0] <= y <= kenar_bosluk[1]]
    if not duz:
        raise SystemExit("kart: düz kağıt bandı bulunamadı")
    bantlar, cur = [], [duz[0]]
    for y in duz[1:]:
        if y - cur[-1] <= 2.01:   # tek satırlık kum beneği bandı bölmez
            cur.append(y)
        else:
            bantlar.append(cur)
            cur = [y]
    bantlar.append(cur)
    en = max(bantlar, key=len)
    return float(en[0]), float(en[-1] + 1)


# ============================================================================= zemin

def deniz_zemini(bg: Image.Image):
    """Telefon zemini: deniz sisi kırpımı üstte, kıyı kırpımı (dalga + kum) altta, SEA_BLEND px yumuşak geçiş. RGB."""
    ust = bg.crop(SEA_TOP)
    alt = bg.crop(SEA_SHORE)
    if alt.width != ust.width:
        alt = alt.resize((ust.width, round(alt.height * ust.width / alt.width)), Image.LANCZOS)
    w = ust.width
    H = ust.height + alt.height - SEA_BLEND
    out = Image.new("RGB", (w, H))
    out.paste(alt, (0, ust.height - SEA_BLEND))
    m = np.ones((ust.height, w))
    ramp = np.linspace(1, 0, SEA_BLEND)
    ramp = ramp * ramp * (3 - 2 * ramp)                      # smoothstep
    m[-SEA_BLEND:] = ramp[:, None]
    out.paste(ust, (0, 0), Image.fromarray((m * 255).astype(np.uint8), "L"))
    return out


def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, en koyu gri, en renkli piksel). Kırpım kümesiz olmalı: koyu ot/kabuk (min_lum) ve renkli parça
    (doygunluk) ikisi de denetlenir."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=MIST, karisim=0.30)
    a = np.asarray(ph.convert("RGB")).astype(np.float64)
    sat = a.max(-1) - a.min(-1)
    return ph, int(np.asarray(ph.convert("L")).min()), round(float(np.percentile(sat, 99.9)), 1)


# ============================================================================= ana akış

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prep-dir", help="parts_prep çıktısı için klasör (vars. geçici)")
    ap.add_argument("--q", type=int, default=80)
    ap.add_argument("--out", help="çıktı klasörü (vars. tema img/)")
    ap.add_argument("--onizleme", help="kesim önizlemeleri + compare_closure.jpg (tema klasörü dışında bir klasör)")
    args = ap.parse_args()

    out = Path(args.out).resolve() if args.out else THEME / "img"
    oniz = Path(args.onizleme).resolve() if args.onizleme else None
    if oniz and (oniz == THEME or oniz.is_relative_to(THEME)):
        sys.exit("--onizleme tema klasörünün içinde olamaz")
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="cs-prep-")
    # GM07 R2 lombozu (G098): ayrı alt klasörde parts_prep.parca_isle → frame_portrait.png + pencere kaydı
    import hashlib
    import parts_prep
    gm = prep / "gm07"
    (gm / "masks").mkdir(parents=True, exist_ok=True)
    gm_kayit, gm_pen, _, gm_uy = parts_prep.parca_isle({"seffaf": True}, PARTS / GM07_PORTRAIT, gm, 150, 8)
    for u in gm_uy:
        print(f"UYARI  {GM07_PORTRAIT}: {u}")
    if len(gm_pen) != 1:
        sys.exit(f"{GM07_PORTRAIT}: tek pencere bekleniyordu ({len(gm_pen)})")
    (gm / gm_kayit["dosyalar"][0]["dosya"]).replace(gm / "frame_portrait.png")
    gm_pen[0]["katman"] = "frame_portrait.png"
    gm_win = {"frame_portrait": gm_pen}
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (coastal-seaside); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
                         "stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q
    temizlik = {}

    def webp(im, name, widths, q_=None):
        webp_yaz(im, name, widths, q_ or QUALITY.get(name, q), manifest, out, ALPHA_Q.get(name, 90))

    # ------------------------------------------------------------------ zarf (aynı tuval: 1024×1536)
    ec_raw = Image.open(PARTS / "envelope_closed.png").convert("RGBA")
    eo_raw = Image.open(PARTS / "envelope_open.png").convert("RGBA")
    ec, temizlik["envelope_closed"] = hale_temizle(ec_raw, sert=True)
    eo, temizlik["envelope_open"] = hale_temizle(eo_raw, sert=True)
    W, H = ec.size

    flap_k, kb = tb.kapak_kes(ec, "v")
    uyar("env_cflap", kb)
    if kb.get("method") != "renk":
        sys.exit(f"kapak kesimi geometrik yedeğe düştü: {kb.get('warnings')} — önizlemeye bak (--onizleme)")
    flap = Image.new("RGBA", (W, H))
    flap.paste(flap_k, (0, 0))
    mentese = int(kb["hinge_row"])
    pocket, cep, cep_kenar = cep_cizgi(eo, mentese)
    uyar("env_pocket", cep)
    if cep["warnings"]:
        sys.exit("ön cep kenarı zayıf — önizlemeye bak (--onizleme)")
    # açık zarf: kapak (menteşeye kadar + 3 px bindirme), gövde (astar + arka + yan kanatlar), ön cep
    yy = np.arange(H)[:, None]
    eoa = np.asarray(eo).astype(np.float64)
    m_flap = np.clip(mentese + 3 - yy + 0.5, 0, 1) * np.ones((1, W))
    m_body = np.clip(yy - (mentese - 2) + 0.5, 0, 1) * np.ones((1, W))
    of = eoa.copy()
    of[..., 3] *= m_flap
    ob = eoa.copy()
    ob[..., 3] *= m_body
    env_flap = Image.fromarray(np.rint(of).astype(np.uint8), "RGBA")
    env_body = Image.fromarray(np.rint(ob).astype(np.uint8), "RGBA")
    fark_acik = tb.ortusme(eo, [env_flap, env_body, pocket])
    fark_kapak = float(((np.asarray(flap)[..., 3].astype(int) - np.asarray(ec)[..., 3].astype(int)) > 1).sum())
    if fark_acik > 0.01:
        sys.exit(f"açık zarf katmanları kaynakla örtüşmüyor (alfa farkı {fark_acik:.4f} > 0.01)")
    if fark_kapak:
        sys.exit(f"kapak katmanı kapalı zarfın dışına taşıyor ({fark_kapak:.0f} px)")

    eca = np.asarray(ec)
    kc = np.flatnonzero(eca[..., 3].max(0) > 200)
    k_x0, k_x1 = int(kc.min()), int(kc.max()) + 1
    kr = np.flatnonzero(eca[..., 3].max(1) > 200)
    k_y0, k_alt = int(kr.min()), int(kr.max()) + 1

    # ------------------------------------------------------------------ kapanış (deniz tarağı + sicim halkası)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    env_w = k_x1 - k_x0
    tip = kb["tip"]
    # comp → parça: zarf kutuları eşlenir (ölçek = genişlik oranı, alt kenar hizası)
    ce = COMP["env_box"]
    cmp_s = (ce[2] - ce[0]) / env_w
    tip_comp = (ce[0] + (tip[0] - k_x0) * cmp_s, ce[3] - (k_alt - tip[1]) * cmp_s)
    cb_ = COMP["closure_box"]
    c_cmp = ((cb_[0] + cb_[2]) / 2, (cb_[1] + cb_[3]) / 2)
    w_over = (cb_[2] - cb_[0]) / (ce[2] - ce[0])
    c_minus_tip = ((c_cmp[0] - tip_comp[0]) / (ce[2] - ce[0]), (c_cmp[1] - tip_comp[1]) / (ce[2] - ce[0]))
    c_w = w_over * env_w
    s = c_w / (ck[2] - ck[0])
    c_h = (ck[3] - ck[1]) * s
    hedef = (tip[0] + c_minus_tip[0] * env_w, tip[1] + c_minus_tip[1] * env_w)
    closure_box = [hedef[0] - c_w / 2, hedef[1] - c_h / 2, hedef[0] + c_w / 2, hedef[1] + c_h / 2]

    # ------------------------------------------------------------------ kart (card_small) yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    card_w = CARD_W_OF_ENV * (k_x1 - k_x0)
    card_h = card_w / card_ar
    card_x = (k_x0 + k_x1) / 2 - card_w / 2
    ck_win = win["card_small"][0]
    cw_y, cw_h = ck_win["kutu"][1] / ck_win["katman_olcu"][1], ck_win["kutu"][3] / ck_win["katman_olcu"][1]
    cep_orta = float(cep_kenar[int(round(card_x + card_w / 2))])
    hidden_top = cep_orta - (cw_y + CARD_PHOTO_ABOVE * cw_h) * card_h
    kose_kenar = float(min(cep_kenar[int(card_x)], cep_kenar[int(card_x + card_w)]))
    # kart yukarıda kalır: out = alt köşeleri cebin kenarını kart boyunun %4'ü kadar aşmış; front = aynı yerde öne gelir
    # (%3 aşağı + × 1.04, büyüyen gölge) → home kartına (ekranın üstü) yukarı uçar
    out_top = kose_kenar - POCKET_BELOW * card_h - card_h
    front_top = out_top + FRONT_DROP * card_h
    card_box_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    ob_box = alfa_kutu(eo, esik=1)
    cb_box = alfa_kutu(ec, esik=1)
    fr_w, fr_h = card_w * FRONT_SCALE, card_h * FRONT_SCALE
    front_box = [card_x - (fr_w - card_w) / 2, front_top - (fr_h - card_h) / 2,
                 card_x + card_w + (fr_w - card_w) / 2, front_top + card_h + (fr_h - card_h) / 2]
    X0 = min(cb_box[0], ob_box[0], closure_box[0], front_box[0])
    X1 = max(cb_box[2], ob_box[2], closure_box[2], front_box[2])
    Y0 = min(cb_box[1], ob_box[1], out_top, front_box[1], closure_box[1])
    Y1 = max(cb_box[3], ob_box[3], closure_box[3])
    SW, SH = X1 - X0, Y1 - Y0

    def pct(box):
        x0, y0, x1, y1 = box
        return [round(100 * (x0 - X0) / SW, 3), round(100 * (y0 - Y0) / SH, 3),
                round(100 * (x1 - x0) / SW, 3), round(100 * (y1 - y0) / SH, 3)]

    stage = {"canvas": [W, H], "box": [round(X0, 1), round(Y0, 1), round(SW, 1), round(SH, 1)],
             "ratio": round(SW / SH, 5)}
    katman = {}
    for ad, im in (("env_closed", ec), ("env_cflap", flap), ("env_flap", env_flap), ("env_body", env_body),
                   ("env_pocket", pocket)):
        k = alfa_kutu(im, esik=1)
        k = [int(np.floor(X0)), k[1], int(np.ceil(X1)), k[3]]           # bütün zarf katmanları sahne genişliğinde
        webp(im.crop(k), ad, WIDTHS[ad])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    webp(cl_crop, "closure", WIDTHS["closure"])
    katman["closure"] = pct(closure_box)
    katman["card"] = pct(card_box_hidden)
    stage["parts"] = katman
    cf = manifest["env_cflap"]["canvas_box"]
    stage["hinge_pct"] = round(100 * (mentese - Y0) / SH, 3)
    stage["hinge_in_cflap_pct"] = round(100 * (mentese - cf[1]) / (cf[3] - cf[1]), 3)
    stage["body_bottom_pct"] = round(100 * (k_alt - Y0) / SH, 3)
    stage["closed_obj"] = {"box_pct": pct([k_x0, k_y0, k_x1, k_alt]), "aspect": round((k_x1 - k_x0) / (k_alt - k_y0), 4),
                           "frac_w": round((k_x1 - k_x0) / SW, 5), "top_frac_of_stage_w": round((k_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - k_alt) / SW, 5)}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3), "front_scale": FRONT_SCALE,
                          "pocket_edge_at_card_corners": round(kose_kenar, 1), "card_w_of_env": CARD_W_OF_ENV,
                          "pocket_edge_mid": round(cep_orta, 1), "photo_above_pocket": CARD_PHOTO_ABOVE}
    stage["cuts"] = {"cflap": kb, "pocket": cep}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak)}
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "V flap tip (kapak_kes tip: intersection of the V lines along the foot of the wave-cut edge)",
        "anchor_px": [round(tip[0], 1), round(tip[1], 1)], "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "env_w_px": env_w,
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_box": list(COMP["env_box"]), "closure_box": list(COMP["closure_box"]),
                 "tip_in_comp": [round(tip_comp[0], 1), round(tip_comp[1], 1)], "closure_w_over_env": round(w_over, 4),
                 "closure_center_minus_tip_over_env_w": [round(c_minus_tip[0], 4), round(c_minus_tip[1], 4)]},
        "carried_by_flap": False,
        "motion": "the wave sweeps across and carries the shell and twine away (MOTION.envelope.closure) before the flap lifts",
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        kok, pw = (gm, gm_win) if parca == "frame_portrait" else (prep, win)
        im = Image.open(kok / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = hale_temizle(im, sert=True)
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(kok, pw, parca, ad, manifest, out)
    manifest["frame_portrait"].update({"source": f"parts/{GM07_PORTRAIT}", "source_canvas": gm_kayit["kaynak_olcu"],
                                       "crop": gm_kayit["kirpma"],
                                       "source_sha256": hashlib.sha256((PARTS / GM07_PORTRAIT).read_bytes()).hexdigest(),
                                       "note": "GM07 R2 ham imagegen (G098): yuvarlak lomboz; pencere parts_prep leke dolgusuyla"})
    manifest["photo_slots"] = slots
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(benek_sil(Image.open(prep / "card_small.png")), 0.5, ornek=(.8, .86))

    # düz bant = kartın bütün genişliği süssüz (davet kartında sol üstte kumul otu, altta dalga + kabuklar; bilgi kartında
    # yalnız alttaki dalga)
    for nm, gen in (("invitation_card", 97.3), ("info_card", 97.0)):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        im, temizlik[nm]["speckles_filled_px"] = benek_temizle(im)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(benek_sil(im), 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        t, b = dilimler(fz, min_gen=gen)
        # orta bant GERİLMEZ (gerilen kum benekleri dikey çizgi olur): düz kâğıt bandı + dikey aynası = dikişsiz döşeme,
        # site.css ::before repeat-y, doğal ölçekte
        H_ = im.height
        bant = im.crop((0, round(H_ * t / 100), im.width, round(H_ * b / 100)))
        dos = Image.new("RGBA", (bant.width, bant.height * 2))
        dos.paste(bant, (0, 0))
        dos.paste(bant.transpose(Image.FLIP_TOP_BOTTOM), (0, bant.height))
        webp(dos, f"{nm}_band", WIDTHS[nm], 74)
        manifest[f"{nm}_band"]["note"] = "düz kâğıt bandı + dikey aynası (dikişsiz), ::before repeat-y"
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (<ad>_band, "
                                          "repeat-y döşenir), alt dilim ::after — docs/11 §9; site.css --t/--b"}

    for nm in ("decor_tl", "decor_br", "divider", "wave"):
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm])
    for i in (1, 2, 3):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        im.thumbnail((200, 200), Image.LANCZOS)
        webp(im, f"accent_{i}", [im.width])

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    sea = deniz_zemini(bg)
    webp(sea, "sea", [sea.width], 78)
    manifest["sea"].update({"top_crop": list(SEA_TOP), "shore_crop": list(SEA_SHORE), "blend_px": SEA_BLEND})
    # zarf sayfası (telefon): yalnız deniz sisi; kıyı ayrı alt bant (`shore`), yazıların altında kalmasın
    mist = bg.crop(SEA_TOP)
    webp(mist, "mist", [mist.width], 78)
    manifest["mist"]["crop"] = list(SEA_TOP)
    wide = bg.crop(SEA_WIDE)
    webp(wide, "sea_wide", [640], 78)
    manifest["sea_wide"]["crop"] = list(SEA_WIDE)
    # uzun sayfaların sonu ve geniş ekranın alt bandı: kıyı (dalga + kum)
    shore = bg.crop(SEA_SHORE)
    webp(shore, "shore", [shore.width], 76)
    manifest["shore"]["crop"] = list(SEA_SHORE)
    # uzun sayfa zemini: bg_tile (dikişsiz deniz sisi), bg_page'in sakin orta sisinin ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((420, 600, 800, 950))).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    fa_ = np.asarray(shore).reshape(-1, 3).astype(np.float64)
    manifest["shore"]["tone_bottom"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in fa_[-shore.width * 40:].mean(0))

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph, en_koyu, renkli = yer_tutucu_temiz(bg, kutu, oran, max(gen))
        if en_koyu < PH_MIN_LUM or renkli > PH_MAX_SAT:
            sys.exit(f"ph_{key}: kırpım {kutu} bir dekor parçası içeriyor (en koyu {en_koyu} < {PH_MIN_LUM} "
                     f"ya da doygunluk {renkli} > {PH_MAX_SAT})")
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"].update({"aspect": oran, "crop": list(kutu), "min_lum": en_koyu, "max_sat": renkli})

    # ------------------------------------------------------------------ paylaşım görseli + favicon
    og, og_bilgi = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    og_bilgi["file"] = "og-1200x630.jpg"
    og_bilgi["bytes"] = tb.og_kaydet(og, out / og_bilgi["file"], 82)
    manifest["og"] = og_bilgi
    ikon, ikon_bilgi = tb.ikon(cl, 180)
    ikon.save(out / "favicon.png", optimize=True)
    ikon_bilgi.update({"source": "closure", "file": "favicon.png", "bytes": (out / "favicon.png").stat().st_size})
    manifest["favicon"] = ikon_bilgi

    # ------------------------------------------------------------------ hiza (ham GPT dosyaları, Kaydet tuvali)
    olcu = tb.kaydet_olculeri(COL)
    hz = tb.hiza_olc(ec_raw, eo_raw, "kapak", olcu.get("envelope_closed"), olcu.get("envelope_open"))
    manifest["align"] = hz
    print(f"hiza ({hz['durum']}): {tb.hiza_ozet(hz)}")
    for u in hz["uyarilar"]:
        print(f"UYARI  hiza: {u}")
    if hz["durum"] == "hata":
        sys.exit("kapalı/açık zarf hizası > %4 (GPT'den yeniden üretim gerekir)")

    yaprak, kroma = {}, {}
    for f in sorted(out.glob("*.webp")):
        n_tb, n_kroma = kroma_yesil(f)
        if n_tb:
            yaprak[f.name] = n_tb
        if n_kroma:
            kroma[f.name] = n_kroma
    if kroma:
        sys.exit(f"görünür #00FF00 kalıntısı (parlak kroma yeşili): {kroma}")
    manifest["cleanup"] = temizlik
    manifest["checks"] = {"envelope_open_overlap_diff": round(fark_acik, 5), "green_px": 0,
                          "green_check": {"chroma_key_px": 0, "tema_build_yesil_gorunur_foliage_px": yaprak,
                                          "note": "tema_build.yesil_gorunur kumul otu / deniz camı yeşilini de sayabilir; "
                                                  "parlak kroma şartı (G ≥ 190, fazla ≥ 60) ile 0 — kroma_yesil()"},
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı; ilk ekran yatay telefonda da nav'ın üstünde biter,
    # hero isimleri ≥ 36 px
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, env_flap, env_body, pocket, cl_crop, katman, stage, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"kart yolu {stage['card_path']} · kart {katman['card']}")
    print(f"kapalı nesne {stage['closed_obj']}")
    print(f"katmanlar {katman}")
    print(f"cep {cep['edge_at']} taban {cep['floor_row']} {cep['floor_x']} kanatlar {cep['sides']}")
    print(f"kapanış comp {manifest['closure']['comp']}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} dilimler {manifest[nm]['slices']['top_end_pct']}–{manifest[nm]['slices']['bottom_start_pct']} "
              f"oran {manifest[nm]['slices']['ratio']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · "
          f"sayfa rengi {manifest['page_color']}")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, ec, flap, env_flap, env_body, pocket, cl_crop, katman, stage, cs):
    """Kesim önizlemeleri (gözle denetim): kapak / gövde / cep / açık kapak + gövde; kapalı ve açık sahne;
    compare_closure.jpg = kapalı sahne (tema) | W1.1 comp'un zarf bölgesi."""
    def on(im, bg):
        b = Image.new("RGBA", im.size, bg + (255,))
        b.alpha_composite(im)
        return b.convert("RGB")
    W, H = ec.size
    sheet = Image.new("RGB", (W * 4, H))
    sheet.paste(on(flap, (190, 50, 50)), (0, 0))
    gov = np.asarray(ec).copy()
    gov[..., 3] = (gov[..., 3] * (1 - np.asarray(flap)[..., 3] / 255.0)).astype(np.uint8)
    sheet.paste(on(Image.fromarray(gov, "RGBA"), (50, 50, 190)), (W, 0))
    sheet.paste(on(pocket, (50, 50, 190)), (2 * W, 0))
    sheet.paste(on(Image.alpha_composite(env_body, env_flap), (190, 50, 50)), (3 * W, 0))
    sheet = sheet.crop((0, 360, W * 4, 1420))
    sheet.thumbnail((2400, 1000))
    sheet.save(oniz / "cuts_envelope.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    zemin = (222, 239, 245, 255)

    def sahne(parcalar):
        s = Image.new("RGBA", (900, round(SH * k)), zemin)
        for im, p in parcalar:
            x, y, w, h = p
            r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
            s.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
        return s
    kapali = sahne([(ec.crop(alfa_kutu(ec, 1)), katman["env_closed"]), (flap.crop(alfa_kutu(flap, 1)), katman["env_cflap"]),
                    (cl_crop, katman["closure"])])
    kapali.convert("RGB").save(oniz / "stage_closed.jpg", quality=88)
    acik = sahne([(env_flap.crop(alfa_kutu(env_flap, 1)), katman["env_flap"]),
                  (env_body.crop(alfa_kutu(env_body, 1)), katman["env_body"]), (cs, katman["card"]),
                  (pocket.crop(alfa_kutu(pocket, 1)), katman["env_pocket"])])
    acik.convert("RGB").save(oniz / "stage_open.jpg", quality=88)
    # compare_closure: tema (kapalı sahne, zarf genişliği comp'unkine ölçekli) | comp
    ce = COMP["env_box"]
    comp = Image.open(COMPS / "web_1_envelope.png").convert("RGB")
    cx0, cx1 = int(ce[0]) - 40, int(ce[2]) + 40
    cy0, cy1 = int(ce[1]) - 40, int(ce[3]) + 40
    cmp_crop = comp.crop((cx0, cy0, cx1, cy1))
    ox, oy, ow, oh = stage["closed_obj"]["box_pct"]
    env_px = ow / 100 * 900
    olcek = (ce[2] - ce[0]) / env_px
    t0 = kapali.resize((round(900 * olcek), round(kapali.height * olcek)), Image.LANCZOS)
    t = Image.new("RGBA", (t0.width + 400, t0.height + 400), zemin)
    t.alpha_composite(t0, (200, 200))
    ex = ox / 100 * 900 * olcek + 200
    ey = (oy + oh) / 100 * kapali.height * olcek + 200
    t = t.crop((round(ex - 40), round(ey - (cy1 - cy0) + 40), round(ex - 40) + cmp_crop.width, round(ey + 40)))
    out_im = Image.new("RGB", (cmp_crop.width * 2 + 16, cmp_crop.height), (255, 255, 255))
    out_im.paste(t.convert("RGB"), (0, 0))
    out_im.paste(cmp_crop, (cmp_crop.width + 16, 0))
    out_im.save(oniz / "compare_closure.jpg", quality=88)


if __name__ == "__main__":
    main()
