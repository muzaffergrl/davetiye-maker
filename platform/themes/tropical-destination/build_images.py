#!/usr/bin/env python3
"""Tropical Destination teması (tasarım 12, G412) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/tropical-destination/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/12_Tropical_Destination/assets/gpt/parts/ (G212, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri, windows.json); tema klasörüne, img_src/'ye, assets/'e yazılmaz (docs/11 §1,
§5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.2 "kapak — cüzdan", §7.3):
  * Zarf = seyahat cüzdanı: tam genişlikte YUVARLAK kapak + kapağın ortasından aşağı inen deri KAYIŞ (katalog: "kayış
    kapakla bir"). tema_build.kapak_kes("egri") burada iki yerde yanılıyor (G412 denemesi): yuvarlak kapağın dik yan
    yaylarında sütun taraması kenar bulamıyor (kapak 290–780 sütunlarına daralıyor, yanlarda gövdeye kayıyor) ve kayış
    sütunlarında kayışın ucunu kapak kenarı sanıyor (tırtıklı kesim). Bu yüzden:
      - kapak kenarı = sütun başına en güçlü parlaklık düşüşü (kapağın kendi kenar gölgesi), kayış sütunları dışında;
        noktalara aykırısız ELİPS (eksenleri yatay/dikey) uydurulur, kenar her sütunda elipsin ±10 px'inde yeniden aranır,
        7 sütun medyanı; dik yanlarda (elips eğimi > 3) kenar elipsten alınır (manifest: found / from_fit sütun sayısı);
      - kayış = deri rengi (doygunluk > 45, kayış sütun bandında) satır satır doldurulur, 2 px pay; kapak katmanı =
        elips kapak ∪ kayış (kayış kapakla birlikte kalkar). Kapak ucu (kayışın altında) = elipsin en alt noktası.
  * Ön cep EĞRİ ("gülümseme" kenar): her sütunda astarın (yeşil/turkuaz, doygunluk > 40) en alt pikseli; noktaların alt
    zarfına aykırısız 2. derece eğri; kenar = max(eğri, ≤ 6 px altındaki astar noktası) + 1 (cebe astar girmez).
  * Hiza (docs/11 §7.1): kit_check kenarları geçiyor (sol +0,20 · sağ +0,20 · alt 0,00 %). Açık görselin kapak/gövde
    katlanma satırı kapalı zarfın üst kenarıyla (menteşe) ölçülür; fark ölçülen ölçek + ötelemeyle düzeltilir
    (manifest.stage.align_fix) → kapak 90°'de aynı menteşede el değiştirir.
  * Kapanış (closure.png = pirinç çıtçıt + sicim + beyaz plumeria + yapraklar, TEK parça) kare tuvalde büyük çizildi; yeri
    kesim geometrisine bağlı (katalog kapanis_yeri "pressed onto the rounded end of the vertical leather strap, just below
    the center of the flap's edge"): çapa = kapak ucu (elipsin en alt noktası, kayış ekseni). W1.1 comp'ta ölçülen:
    kapanış genişliği / zarf genişliği 0,445 ve çıtçıt topunun merkezi uçtan 0,132 × zarf genişliği yukarıda (COMP).
    Dönüş noktası (pivot) = topun merkezi (sekme topun çevresinde savrulur, MOTION.envelope.closure).
  * Kart (card_small, bavul etiketi) cepte bekler: sicim ilmeği ve etiketin başı cebin üstünde, foto penceresinin en
    çok CARD_PHOTO_ABOVE'u; yükselince alt köşeleri cep kenarını kart boyunun %4'ü aşar (out), sonra öne gelir (front).
  * Ev davet kartı info_card üzerinde (3 dilim): invitation_card'ın süsleri çapraz köşelerde (sağ üst + sol alt), tam
    genişlikte düz yatay bant yok → 3 dilimle uzatılamıyor, uzun kayıt taşardı; invitation_card temaya alınmaz (README
    "comp sapmaları", Sonuç: önerilen GPT parçası).
  * Zemin: bg_page 2:3 köşelerinde çiçek kümeleri pişmiş; telefonda (en/boy ≈ 0,46) cover ile kesilirdi. Telefon zemini
    `lagoon` = bg_page'in iki çiçeksiz kırpımı (açık üst + turkuaz alt, yumuşak geçiş); florals_tl / florals_br ayrı
    katman. Geniş ekran `lagoon_wide` (tek çiçeksiz kırpım). Kırpımlarda süs denetimi (pembe/yaprak pikseli 0).
  * Yeşil denetimi: tema_build.yesil_gorunur canlı palmiye/monstera yeşilini de sayar → kroma_yesil(): parlak kroma
    yeşili (G ≥ 190, fazla ≥ 60) 0 olmalı; yaprak sayıları manifest.checks.green_check'e yazılır.

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json. site.css'teki yüzdeler
manifest'ten; --onizleme DIR kesim önizlemeleri yazar (gözle denetim). Tema klasörü ≤ 3 MB. Bağımlılık: Pillow + numpy.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/12_Tropical_Destination"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, en_buyuk_bolge, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [320, 640], "card_small": [320, 640], "info_card": [480, 960],
    "frame_portrait": [320, 640], "frame_landscape": [480, 960], "florals_tl": [480, 800, 960],
    "florals_br": [480, 800, 960], "divider": [300, 600],
}
# 800 px kümeler: 390 px telefonda DPR 3 (sizes ≈ 250 px → 750 px) 960'ı değil 800'ü seçer (ilk görünümde WebP < 150 KB)
# kartın cepteki duruşu: foto penceresinin en çok bu kadarı cebin kenarının üstünde (yüzler kenarla kesilmez)
CARD_PHOTO_ABOVE = 0.04
CARD_W_OF_ENV = 0.58          # kart genişliği / zarf genişliği (cebe sığar, iki yanda ~%21 cep kağıdı)
FRONT_SCALE = 1.05
# palet (palette.json tropical): ivory #FFFCF5 — yer tutucu tonu
IVORY = (255, 252, 245)
# W1.1 comp ölçümü (comps/web_1_envelope.png, 1024×1536; 2× büyütülmüş 20 px ızgarada okundu, G412): zarf x 320–702
# (genişlik 382), kayış x 479–545 (ekseni 512), kapağın yuvarlak kenarının en alt noktası (kayış altında, iki yandan
# uzatılarak) y ≈ 863; çıtçıt topu merkezi (512.5, 812.5), çapı ≈ 40; kapanış topluluğu (sicim ucu, top, plumeria,
# yapraklar) x 472–642, y 739–916. → kapanış genişliği / zarf genişliği 0.445; top merkezi uçtan 0.132 × zarf genişliği
# yukarıda, yatayda kayış ekseninde.
COMP = {"env_w": 382.0, "closure_w": 170.0, "tip": (512.0, 863.0), "ball_c": (512.5, 812.5), "ball_d": 40.0,
        "box": (472, 739, 642, 916)}
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: çiçeksiz deniz köpüğü yıkaması)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (560, 260, 900, 704)),
    "story_1": ("portrait", [320, 640], (420, 300, 760, 746)),
    "story_2": ("portrait", [320, 640], (600, 420, 940, 866)),
    "story_3": ("portrait", [320, 640], (300, 520, 640, 966)),
    "venue": ("landscape", [480, 960], (200, 560, 780, 916)),
}
PH_MIN_LUM = 170   # yer tutucuda en koyu piksel (gri ton) en az bu
# telefon zemini (bg_page 1024×1536 kaynak pikseli): çiçek kümelerinin dışındaki iki bölge (sol üst küme ~ (660, 0)–(0, 470)
# köşegeninin solunda/üstünde, sağ alt küme ~ (985, 927)–(377, 1536) köşegeninin sağında/altında; süs denetimi ile)
LAGOON_TOP = (520, 140, 1024, 640)     # açık deniz köpüğü
LAGOON_BOTTOM = (120, 560, 624, 1100)  # turkuaza dönen alt yıkama
LAGOON_BLEND = 120                     # px — iki kırpımın yumuşak geçiş bandı
LAGOON_WIDE = (240, 450, 950, 920)     # geniş ekran: tek çiçeksiz geniş kırpım (en/boy ≈ 1,51)


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (GPT hâlesi, saçak)

def hale_temizle(im: Image.Image, sert: bool, esik: int = 12, cekirdek: int = 96):
    """Dış hattaki yarı saydam hâleyi temizler (çizim yok). sert: kart/çerçeve/zarf gibi net kenarlı nesne.
    alfa < esik → 0, kalan alfa yeniden ölçeklenir; çekirdekten (alfa ≥ cekirdek) uzak (sert 1 px, yumuşak 3 px) piksel
    silinir; kenar pikselinin (alfa < 230) rengi komşu opak piksellerin ortalamasına çekilir."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    al = a[..., 3]
    once = int((al > 0).sum())
    yeni = np.clip((al - esik) * 255.0 / (255 - esik), 0, 255)
    yeni[~genislet(al >= cekirdek, 1 if sert else 3)] = 0
    opak = (al >= 230).astype(np.float64)
    pay = _kutu_bulanik(opak, 3)
    renk = np.stack([_kutu_bulanik(a[..., i] * opak, 3) for i in range(3)], -1)
    kenar = (yeni > 0) & (al < 230) & (pay > 1e-3)
    hedef = renk[kenar] / pay[kenar][:, None]
    w = np.ones((int(kenar.sum()), 1)) if sert else (1 - al[kenar] / 230.0)[:, None]
    a[..., :3][kenar] = a[..., :3][kenar] * (1 - w) + hedef * w
    a[..., 3] = yeni
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), {
        "alpha_floor": esik, "core": cekirdek, "reach_px": 1 if sert else 3, "removed_px": once - int((yeni > 0).sum())}


def renk_tasir(im: Image.Image) -> Image.Image:
    """Şeffaf piksellerin RGB'si görünen komşu renkle doldurulur ("alpha bleeding"): kayıplı WebP renk alt örneklemesi
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


def webp_yaz(im: Image.Image, name: str, widths, q: int, manifest: dict, out: Path):
    """tema_build.webp ile aynı çıktı biçimi; fark: şeffaf parçada küçültme sonrası renk taşıma (renk_tasir)."""
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


def kroma_yesil(dosya: Path, pencereli: bool) -> tuple:
    """(tema_build.yesil_gorunur ölçütündeki piksel, #00FF00 benzeri parlak kroma yeşili). tema_build'in ölçütü (yeşil
    fazlası > 40, G ≥ 1,5 × max(R, B), alfa > 25) bu tasarımın canlı palmiye/monstera yaprağını da sayar. Gerçek pencere
    kalıntısı parlaktır (opak #00FF00 ≈ (5, 241, 1); beyaz kağıda karışmış ≈ (184, 250, 184)) → ek şart G ≥ 190 ve
    yeşil fazlası ≥ 60. Penceresiz parçalarda (dekor, zarf astarı) GPT'nin kendi boyadığı yaprak ışığı da bunu geçer
    (G412: florals_tl kaynağında 14 piksel ≈ (125, 192, 123)); #00FF00 açık bir renge karışınca G ≥ 225 kalır →
    penceresizde şart G ≥ 225 ve fazla ≥ 80. Yapı ikinciyle durur; ilki manifest'e "yaprak" olarak yazılır."""
    a = np.asarray(Image.open(dosya).convert("RGBA")).astype(np.int16)
    mx = np.maximum(a[..., 0], a[..., 2])
    t = a[..., 1] - mx
    taban = (t > 40) & (a[..., 1] * 2 >= 3 * mx) & (a[..., 3] > 25)
    g_min, t_min = (190, 60) if pencereli else (225, 80)
    return int(taban.sum()), int((taban & (a[..., 1] >= g_min) & (t >= t_min)).sum())


TOP_PAD = 48


def tuval_ust(im: Image.Image) -> Image.Image:
    """Tuvalin üstüne TOP_PAD şeffaf satır (koordinatlar manifest'te bu dolgulu tuvalde; stage.canvas_top_pad)."""
    t = Image.new("RGBA", (im.width, im.height + TOP_PAD))
    t.paste(im, (0, TOP_PAD))
    return t


def alfa_kutu(im: Image.Image, esik: int = 8):
    return [int(v) for v in tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)]


def suslu_piksel(rgb: np.ndarray) -> int:
    """Deniz köpüğü zeminde süs pikseli: pembe/kırmızı (hibiskus: R − (G + B)/2 > 25), yaprak (G − B > 22 ve G − R > 22),
    sarı/beyaz plumeria göbeği (R + G − 2B > 90)."""
    a = rgb.astype(np.float64)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    pembe = r - (g + b) / 2 > 25
    yaprak = (g - b > 22) & (g - r > 22)
    sari = r + g - 2 * b > 90
    return int((pembe | yaprak | sari).sum())


# ============================================================================= kesimler (bu tasarım)

def _elips_uydur(p):
    """Eksenleri hizalı elips: A x² + C y² + D x + E y + F = 0 (SVD, aykırısız). (xc, yc, a, b, kalan nokta)."""
    p = np.array(p, float)
    for _ in range(8):
        x, y = p[:, 0], p[:, 1]
        M = np.stack([x * x, y * y, x, y, np.ones_like(x)], 1)
        _, _, vt = np.linalg.svd(M, full_matrices=False)
        A, C, D, E, F = vt[-1]
        xc, yc = -D / (2 * A), -E / (2 * C)
        G = A * xc * xc + C * yc * yc - F
        a, b = np.sqrt(G / A), np.sqrt(G / C)
        r = y - (yc + b * np.sqrt(np.clip(1 - ((x - xc) / a) ** 2, 0, 1)))
        s = max(2.5, 2.5 * np.median(np.abs(r)) * 1.4826)
        keep = np.abs(r) < s
        if keep.all():
            break
        p = p[keep]
    return float(xc), float(yc), float(a), float(b), int(len(p))


def kayis_maskesi(a: np.ndarray, hinge: int):
    """Deri kayış: doygunluk > 45 olan piksellerin ana sütun bandı (kenar gölgesi değil, sütun histogramının çekirdeği);
    her satırda o banttaki en sol–en sağ kayış pikseli arası doldurulur, 2 px pay. (maske, bilgi)."""
    al = a[..., 3]
    rgb = a[..., :3]
    sat = rgb.max(-1) - rgb.min(-1)
    der = (sat > 45) & (al > 200) & (rgb[..., 0] > rgb[..., 2] + 40)
    # sütun başına kayış pikseli: kayış boyunca (menteşe … menteşe + 180) yoğun sütunlar = kayış bandı
    bant = der[hinge:hinge + 180].sum(0)
    cols = np.flatnonzero(bant > 0.8 * 180)
    if len(cols) < 20:
        sys.exit("kayış bulunamadı (deri rengi sütun bandı < 20 px)")
    c0, c1 = int(cols.min()) - 6, int(cols.max()) + 6
    H, W = al.shape
    m = np.zeros((H, W), bool)
    rows = []
    for y in range(H):
        r = np.flatnonzero(der[y, c0:c1 + 1])
        if len(r) >= 4:
            m[y, c0 + r.min():c0 + r.max() + 1] = True
            rows.append(y)
    m = genislet(m, 2) & (al > 0)
    return m, {"columns": [c0 + 6, c1 - 6], "axis_x": round((c0 + c1) / 2, 1), "rows": [int(min(rows)), int(max(rows))],
               "px": int(m.sum())}


def cuzdan_kapak_kes(ec: Image.Image):
    """Kapalı cüzdan → (kapak + kayış RGBA tam tuval, bilgi). Kenar = kapağın yuvarlak serbest kenarı (elips + iz)."""
    a = np.asarray(ec).astype(np.float64)
    al = a[..., 3]
    H, W = al.shape
    cols = np.flatnonzero(al.max(0) > 200)
    x0, x1 = int(cols.min()), int(cols.max())
    tops = np.array([int(np.argmax(al[:, x] > 200)) for x in range(x0, x1 + 1)])
    hinge = int(np.median(tops))
    kayis, kb = kayis_maskesi(a, hinge)
    k0, k1 = kb["columns"]
    lum = a[..., :3] @ LUM
    cs = np.vstack([np.zeros((1, W)), np.cumsum(lum, 0)])

    def dusus(ylo, yhi, x):
        ys = np.arange(max(ylo, 3), min(yhi, H - 4))
        if not len(ys):
            return ylo, -1e9
        ust = (cs[ys, x] - cs[ys - 3, x]) / 3
        alt = (cs[ys + 4, x] - cs[ys + 1, x]) / 3
        d = ust - alt
        i = int(np.argmax(d))
        return int(ys[i]), float(d[i])

    alt_sinir = hinge + int(0.62 * (H - hinge))
    pts = []
    for x in range(x0 + 6, x1 - 5, 2):
        if k0 - 8 <= x <= k1 + 8:
            continue
        y, d = dusus(hinge + 12, alt_sinir, x)
        if d > 18:
            pts.append((x, y))
    if len(pts) < 60:
        sys.exit(f"kapak kenarı: {len(pts)} nokta (< 60) — kesim önizlemesine bak")
    xc, yc, ea, eb, n = _elips_uydur(pts)
    xs = np.arange(W)
    ell = yc + eb * np.sqrt(np.clip(1 - ((xs - xc) / ea) ** 2, 0, 1))
    # elipsin eğimi: dik yanlarda (|dy/dx| > 3) sütun taraması güvenilmez → elips
    egim = np.abs(np.gradient(ell))
    kenar = ell.copy()
    bulunan = 0
    for x in range(x0, x1 + 1):
        if k0 - 4 <= x <= k1 + 4 or egim[x] > 3:
            continue
        y, d = dusus(int(ell[x]) - 10, int(ell[x]) + 11, x)
        if d > 12:
            kenar[x] = y + 1.5
            bulunan += 1
    yum = kenar.copy()
    for x in range(x0 + 3, x1 - 3):
        yum[x] = np.median(kenar[x - 3:x + 4])
    kenar = yum
    sapma = np.abs(kenar[x0:x1 + 1] - ell[x0:x1 + 1])
    yy = np.arange(H)[:, None]
    m = np.clip(kenar[None, :] - yy + 0.5, 0, 1)
    m[:hinge - 2] = 0
    m[:, :x0] = 0
    m[:, x1 + 1:] = 0
    m = np.maximum(m, kayis.astype(np.float64))
    flap = a.copy()
    flap[..., 3] *= m
    ax = kb["axis_x"]
    tip = (float(ax), float(yc + eb * np.sqrt(max(0.0, 1 - ((ax - xc) / ea) ** 2))))
    bilgi = {"method": "renk", "shape": "egri (elips) + kayış", "detector": "sütun başına en güçlü parlaklık düşüşü (kapak "
             "kenar gölgesi), kayış sütunları dışında; aykırısız eksen hizalı elips; elips ± 10 px iz; dik yanlar elipsten",
             "hinge_row": hinge, "ellipse": {"xc": round(xc, 1), "yc": round(yc, 1), "a": round(ea, 1), "b": round(eb, 1),
                                              "points": len(pts), "kept": n},
             "columns": [x0, x1], "traced_columns": bulunan, "from_fit_columns": int((x1 - x0 + 1) - bulunan),
             "trace_minus_fit_px_p50_p95": [round(float(v), 2) for v in np.percentile(sapma, [50, 95])],
             "strap": kb, "tip": [round(tip[0], 1), round(tip[1], 1)], "rows": [hinge, int(np.ceil(max(kenar.max(), kb["rows"][1]))) + 2],
             "warnings": []}
    if n < 0.7 * len(pts):
        bilgi["warnings"].append(f"elips uyumu zayıf: {n}/{len(pts)} nokta kaldı")
    if float(np.percentile(sapma, 95)) > 8:
        bilgi["warnings"].append(f"iz elipsten uzak (p95 {np.percentile(sapma, 95):.1f} px)")
    return Image.fromarray(np.clip(np.rint(flap), 0, 255).astype(np.uint8), "RGBA"), bilgi


def kat_satiri(eo: Image.Image, yakin: int):
    """Açık cüzdanda kapak ↔ gövde katlanma satırı: astar bölgesinde (sütunların %20–80'i) satır ortalaması parlaklığın en
    büyük basamağı, `yakin` ± 40 satır içinde. (satır, basamak)."""
    a = np.asarray(eo).astype(np.float64)
    al = a[..., 3]
    cols = np.flatnonzero(al.max(0) > 200)
    x0, x1 = int(cols.min()), int(cols.max())
    xa, xb = int(x0 + 0.2 * (x1 - x0)), int(x0 + 0.8 * (x1 - x0))
    lum = (a[..., :3] @ LUM)[:, xa:xb]
    prof = lum.mean(1)
    best, by = 0.0, yakin
    for y in range(yakin - 40, yakin + 41):
        d = abs(prof[y - 3:y].mean() - prof[y:y + 3].mean())
        if d > best:
            best, by = d, y
    return by, round(float(best), 2)


def kavis_cep_kes(eo: Image.Image, govde_ust: int):
    """Açık cüzdan → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Noktalar: her sütunda astarın (doygunluk > 40) en alt
    pikseli (gövde üstü … gövdenin %70'i). Alt zarfa aykırısız 2. derece eğri; kenar = max(eğri, ≤ 6 px altındaki astar
    noktası) + 1; 5 sütun medyanı."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    cols = np.flatnonzero(op.any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    alt = int(np.flatnonzero(op.any(1)).max())
    rgb = a[..., :3]
    astar = ((rgb.max(-1) - rgb.min(-1)) > 40) & op
    sinir = govde_ust + int(0.7 * (alt - govde_ust))
    pts = []
    for x in range(x0 + 3, x1 - 2):
        r = np.flatnonzero(astar[govde_ust:sinir, x])
        if len(r):
            pts.append((x, govde_ust + r.max()))
    pts = np.array(pts, float)
    p = pts.copy()
    for _ in range(12):
        c = np.polyfit(p[:, 0], p[:, 1], 2)
        r = p[:, 1] - np.polyval(c, p[:, 0])
        keep = (r > -4.0) & (r < max(8.0, 4 * np.median(np.abs(r)) * 1.4826 + 1))
        if keep.all():
            break
        p = p[keep]
    xs = np.arange(W)
    kenar = np.polyval(c, xs) + 1
    pi = pts[:, 0].astype(int)
    fark = pts[:, 1] + 1 - kenar[pi]
    duzelt = (fark > 0) & (fark <= 6)
    kenar[pi[duzelt]] = pts[duzelt, 1] + 1
    yum = kenar.copy()
    for x in range(x0 + 2, x1 - 2):
        yum[x] = np.median(kenar[x - 2:x + 3])
    kenar = yum
    art = pts[:, 1] + 1 - kenar[pi]
    yy = np.arange(H)[:, None]
    m = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    cep = a.copy()
    cep[..., 3] *= m
    xm = (x0 + x1) // 2
    bilgi = {"method": "renk", "shape": "egri", "body": [x0, govde_ust, x1, alt], "curve": [round(float(v), 6) for v in c],
             "points": int(len(pts)), "kept": int(len(p)), "lowered_columns": int(duzelt.sum()),
             "liner_below_edge_px": int((art > 3).sum()),
             "edge_at": {"x0": round(float(kenar[x0]), 1), "mid": round(float(kenar[xm]), 1), "x1": round(float(kenar[x1]), 1)},
             "warnings": []}
    if len(p) < 0.6 * len(pts) or bilgi["liner_below_edge_px"] > 0.02 * len(pts):
        bilgi["warnings"].append(f"cep kenarı zayıf: {len(p)}/{len(pts)} nokta, kenarın altında astar {bilgi['liner_below_edge_px']}")
    return Image.fromarray(np.clip(np.rint(cep), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def top_olc(rgba: np.ndarray):
    """Kapanıştaki pirinç çıtçıt topu (altın sarısı: R > 170, G > 120, B < 110, R − B > 90 ve G > 0,72 R — deri kayış
    G/R ≈ 0,68 dışarıda kalır, opak), en büyük bölge → (x0, y0, x1, y1, cx, cy); merkez = kutunun ortası (topun gölgeli
    sol yanı sarı eşiğin altında kalır, ortalama parlak sağ alta kayar)."""
    a = rgba.astype(np.float64)
    m = (a[..., 0] > 170) & (a[..., 1] > 120) & (a[..., 2] < 110) & (a[..., 0] - a[..., 2] > 90) & (a[..., 1] > 0.72 * a[..., 0])
    if a.shape[-1] == 4:
        m &= a[..., 3] > 200
    s = en_buyuk_bolge(m)
    ys, xs = np.nonzero(s)
    x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())
    return x0, y0, x1, y1, (x0 + x1) / 2, (y0 + y1) / 2


def comp_dogrula():
    """COMP sabitlerini comp görselinden yeniden ölçer (yapı her koşuda): çıtçıt topu (altın sarısı) ve kayış ekseni
    (deri rengi) ±8 px içinde mi. Ölçümler manifest'e yazılır."""
    c = np.asarray(Image.open(COMPS / "web_1_envelope.png").convert("RGB")).astype(np.float64)
    bx0, by0, bx1, by1, bcx, bcy = top_olc(c[700:900, 440:600])
    bcx, bcy = bcx + 440, bcy + 700
    sat = c.max(-1) - c.min(-1)
    der = (sat > 50) & (c[..., 0] > c[..., 2] + 40) & (c[..., 0] < 225)
    band = der[620:760, 440:600].sum(0)
    kc = np.flatnonzero(band > 0.8 * 140) + 440
    axis = float((kc.min() + kc.max()) / 2)
    olc = {"ball_center": [round(bcx, 1), round(bcy, 1)], "strap_axis_x": round(axis, 1), "strap_cols": [int(kc.min()), int(kc.max())]}
    if abs(bcx - COMP["ball_c"][0]) > 8 or abs(bcy - COMP["ball_c"][1]) > 8 or abs(axis - COMP["tip"][0]) > 8:
        sys.exit(f"comp ölçümü COMP sabitleriyle uyuşmuyor: {olc}")
    return olc


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(8.0, 96.0), min_gen: float = 80.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın bütün genişliğinde süs yok (açıklık ≥ min_gen).
    En uzun kesintisiz düz bant gerilir. (t, b)."""
    duz = [y for y, L, R in fz if L is not None and R - L >= min_gen and kenar_bosluk[0] <= y <= kenar_bosluk[1]]
    if not duz:
        raise SystemExit("kart: düz kağıt bandı bulunamadı")
    bantlar, cur = [], [duz[0]]
    for y in duz[1:]:
        if y - cur[-1] <= 1.01:
            cur.append(y)
        else:
            bantlar.append(cur)
            cur = [y]
    bantlar.append(cur)
    en = max(bantlar, key=len)
    return float(en[0]), float(en[-1] + 1)


# ============================================================================= zemin

def lagun(bg: Image.Image):
    """Telefon zemini: iki çiçeksiz bg_page kırpımı üst üste (LAGOON_BLEND px yumuşak geçiş). RGB."""
    ust = bg.crop(LAGOON_TOP)
    alt = bg.crop(LAGOON_BOTTOM)
    w = ust.width
    out = Image.new("RGB", (w, ust.height + alt.height - LAGOON_BLEND))
    out.paste(alt, (0, ust.height - LAGOON_BLEND))
    m = np.ones((ust.height, w))
    ramp = np.linspace(1, 0, LAGOON_BLEND)
    m[-LAGOON_BLEND:] = (ramp * ramp * (3 - 2 * ramp))[:, None]
    out.paste(ust, (0, 0), Image.fromarray((m * 255).astype(np.uint8), "L"))
    return out


def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, en koyu gri, süs pikseli): kırpım çiçeksiz olmalı."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.32)
    return ph, int(np.asarray(ph.convert("L")).min()), suslu_piksel(np.asarray(bg.crop(kutu)))


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="td-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (tropical-destination); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
                         "stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q
    temizlik = {}

    def webp(im, name, widths, q_=None):
        webp_yaz(im, name, widths, q_ or q, manifest, out)

    # ------------------------------------------------------------------ zarf (aynı tuval: 1024×1536)
    ec_raw = Image.open(PARTS / "envelope_closed.png").convert("RGBA")
    eo_raw = Image.open(PARTS / "envelope_open.png").convert("RGBA")
    ec, temizlik["envelope_closed"] = hale_temizle(ec_raw, sert=True)
    eo, temizlik["envelope_open"] = hale_temizle(eo_raw, sert=True)
    # tuvalin üstüne TOP_PAD satır boşluk: hiza düzeltmesi açık görseli yukarı öteler, kayışın ucu tuvalden taşmasın
    ec, eo = (tuval_ust(ec), tuval_ust(eo))
    W, H = ec.size

    flap, kb = cuzdan_kapak_kes(ec)
    uyar("env_cflap", kb)
    k_ust = kb["hinge_row"]
    kat, kat_basamak = kat_satiri(eo, k_ust)
    pocket, cep, cep_kenar = kavis_cep_kes(eo, kat)
    uyar("env_pocket", cep)
    yy = np.arange(H)[:, None]
    eoa = np.asarray(eo).astype(np.float64)
    m_flap = np.clip(kat + 3 - yy + 0.5, 0, 1) * np.ones((1, W))
    m_body = np.clip(yy - (kat - 2) + 0.5, 0, 1) * np.ones((1, W))
    of = eoa.copy(); of[..., 3] *= m_flap
    ob = eoa.copy(); ob[..., 3] *= m_body
    env_flap = Image.fromarray(np.rint(of).astype(np.uint8), "RGBA")
    env_body = Image.fromarray(np.rint(ob).astype(np.uint8), "RGBA")
    fark_acik = tb.ortusme(eo, [env_flap, env_body, pocket])
    fark_kapak = float(((np.asarray(flap)[..., 3].astype(int) - np.asarray(ec)[..., 3].astype(int)) > 1).sum())
    if fark_acik > 0.01:
        sys.exit(f"açık zarf katmanları kaynakla örtüşmüyor (alfa farkı {fark_acik:.4f} > 0.01)")
    if fark_kapak:
        sys.exit(f"kapak katmanı kapalı zarfın dışına taşıyor ({fark_kapak:.0f} px)")

    # hiza (docs/11 §7.1 "ölçülen dönüşüm"): açık gövde kapalının sol/sağ kenarına, menteşesine (katlanma satırı) ve alt
    # kenarına
    eca0 = np.asarray(ec)[..., 3]
    kc = np.flatnonzero(eca0[k_ust + 40:].max(0) > 200)
    k_x0, k_x1 = int(kc.min()), int(kc.max()) + 1
    k_alt = int(np.flatnonzero(eca0.max(1) > 200).max()) + 1
    a_x0, a_x1 = int(cep["body"][0]), int(cep["body"][2]) + 1
    a_ust, a_alt = int(kat), int(cep["body"][3]) + 1
    sx = (k_x1 - k_x0) / (a_x1 - a_x0)
    sy = (k_alt - k_ust) / (a_alt - a_ust)
    dx = k_x0 - a_x0 * sx
    dy = k_ust - a_ust * sy

    def hizala(im):
        r = im.resize((max(1, round(W * sx)), max(1, round(H * sy))), Image.LANCZOS)
        tuval = Image.new("RGBA", (W, H))
        tuval.paste(r, (round(dx), round(dy)))
        return tuval
    eo = hizala(eo)
    env_flap, env_body, pocket = hizala(env_flap), hizala(env_body), hizala(pocket)
    cep_kenar = k_ust + (np.interp((np.arange(W) - dx) / sx, np.arange(W), cep_kenar) - a_ust) * sy
    hiza_duzeltme = {"open_scale": [round(sx, 5), round(sy, 5)], "open_offset_px": [round(dx, 1), round(dy, 1)],
                     "open_body_before": [a_x0, a_ust, a_x1, a_alt], "closed_body": [k_x0, k_ust, k_x1, k_alt],
                     "open_fold_row": kat, "fold_step": kat_basamak,
                     "reason": "açık görselin katlanma satırı ve gövde kenarları kapalı zarfın menteşe satırı ve "
                               "kenarlarına ölçülen ölçek + ötelemeyle oturtulur (90°'de aynı menteşe)"}
    print(f"hiza düzeltmesi: açık katmanlar × ({sx:.4f}, {sy:.4f}), öteleme ({dx:.1f}, {dy:.1f}) px; katlanma satırı {kat}, menteşe {k_ust}")

    # ------------------------------------------------------------------ kapanış (çıtçıt + sicim + plumeria + yapraklar)
    comp_olc = comp_dogrula()
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    ck = alfa_kutu(cl)
    bx0, by0, bx1, by1, bcx, bcy = top_olc(np.asarray(cl_raw))
    env_w = k_x1 - k_x0
    cw_of_env = COMP["closure_w"] / COMP["env_w"]                     # 0.445
    s = cw_of_env * env_w / (ck[2] - ck[0])                          # closure tuval px → zarf tuval px
    ball_dy = (COMP["ball_c"][1] - COMP["tip"][1]) / COMP["env_w"]    # −0.132
    tip = kb["tip"]
    ball = (tip[0], tip[1] + ball_dy * env_w)
    cl_crop = cl.crop(ck)
    c_left = ball[0] - (bcx - ck[0]) * s
    c_top = ball[1] - (bcy - ck[1]) * s
    c_w, c_h = (ck[2] - ck[0]) * s, (ck[3] - ck[1]) * s
    closure_box = [c_left, c_top, c_left + c_w, c_top + c_h]
    pivot = [round(100 * (bcx - ck[0]) / (ck[2] - ck[0]), 3), round(100 * (bcy - ck[1]) / (ck[3] - ck[1]), 3)]

    # ------------------------------------------------------------------ kart (card_small, bavul etiketi) yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    card_w = CARD_W_OF_ENV * env_w
    card_h = card_w / card_ar
    card_x = (k_x0 + k_x1) / 2 - card_w / 2
    cwin = win["card_small"][0]
    cw_y, cw_h = cwin["kutu"][1] / cwin["katman_olcu"][1], cwin["kutu"][3] / cwin["katman_olcu"][1]
    cw_x0 = card_x + card_w * cwin["kutu"][0] / cwin["katman_olcu"][0]
    cw_x1 = cw_x0 + card_w * cwin["kutu"][2] / cwin["katman_olcu"][0]
    # gülümseme kenarı ortada en alçak: pencerenin sütunlarında kenarın en alt noktası = fotoğrafın en çok
    # CARD_PHOTO_ABOVE'u cebin üstünde görünür (yanlarda cep daha yüksek, daha az görünür)
    pencere_kenar = float(cep_kenar[int(cw_x0):int(cw_x1) + 1].max())
    hidden_top = pencere_kenar - (cw_y + CARD_PHOTO_ABOVE * cw_h) * card_h
    kose_kenar = float(min(cep_kenar[int(card_x)], cep_kenar[int(card_x + card_w)]))
    out_top = kose_kenar - 0.04 * card_h - card_h
    front_top = out_top + 0.03 * card_h
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

    stage = {"canvas": [W, H], "canvas_top_pad": TOP_PAD, "box": [round(X0, 1), round(Y0, 1), round(SW, 1), round(SH, 1)], "ratio": round(SW / SH, 5)}
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
    stage["hinge_pct"] = round(100 * (k_ust - Y0) / SH, 3)
    stage["hinge_in_cflap_pct"] = round(100 * (k_ust - manifest["env_cflap"]["canvas_box"][1]) /
                                        (manifest["env_cflap"]["canvas_box"][3] - manifest["env_cflap"]["canvas_box"][1]), 3)
    stage["body_bottom_pct"] = round(100 * (k_alt - Y0) / SH, 3)
    env_y0 = int(np.flatnonzero(eca0.max(1) > 200).min())
    stage["closed_obj"] = {"box_pct": pct([k_x0, env_y0, k_x1, k_alt]), "aspect": round((k_x1 - k_x0) / (k_alt - env_y0), 4),
                           "frac_w": round((k_x1 - k_x0) / SW, 5), "top_frac_of_stage_w": round((env_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - k_alt) / SW, 5)}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3), "front_scale": FRONT_SCALE,
                          "pocket_edge_at_card_corners": round(kose_kenar, 1), "card_w_of_env": CARD_W_OF_ENV,
                          "pocket_edge_at_window": round(pencere_kenar, 1), "photo_above_pocket": CARD_PHOTO_ABOVE}
    stage["cuts"] = {"cflap": kb, "pocket": cep}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak)}
    stage["align_fix"] = hiza_duzeltme
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "the rounded flap's lowest point under the leather strap (ellipse bottom on the strap axis)",
        "anchor_px": [round(tip[0], 1), round(tip[1], 1)], "ball_center_px": [round(ball[0], 1), round(ball[1], 1)],
        "center_pct": [round(100 * ((c_left + c_w / 2) - X0) / SW, 3), round(100 * ((c_top + c_h / 2) - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "ball_in_closure_px": [round(bcx, 1), round(bcy, 1)],
        "ball_d_closure_px": bx1 - bx0, "pivot_in_crop_pct": pivot,
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": COMP["env_w"], "closure_w_over_env_w": round(cw_of_env, 4),
                 "ball_center_minus_tip_over_env_w": round(ball_dy, 4), "remeasured": comp_olc},
        "carried_by_flap": False,
        "motion": "the brass snap pops, the plumeria tab swings away about the snap and leaves (MOTION.envelope.closure) "
                  "before the flap lifts",
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = hale_temizle(im, sert=True)
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
        if oniz:
            bg = Image.new("RGBA", im.size, (40, 40, 40, 255)); bg.alpha_composite(im)
            bg.convert("RGB").save(oniz / f"kenar_{parca}.jpg", quality=88)
    manifest["photo_slots"] = slots
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.8, .9))
    # bavul etiketinin parçaları (frame_portrait: sicim tepesi = salınım noktası, etiket gövdesinin üstü)
    fp = np.asarray(Image.open(prep / "frame_portrait.png").convert("RGBA"))[..., 3]
    gen = (fp > 200).sum(1)
    govde = int(np.flatnonzero(gen > 0.9 * gen.max())[0])
    manifest["frame_portrait"]["tag_top_pct"] = round(100 * govde / fp.shape[0], 3)
    sicim = np.flatnonzero(fp[0:40].max(0) > 120)
    manifest["frame_portrait"]["string_top_pct"] = [round(100 * float(sicim.mean()) / fp.shape[1], 3), 0.0]

    im = Image.open(prep / "info_card.png").convert("RGBA")
    im, temizlik["info_card"] = hale_temizle(im, sert=True)
    webp(im, "info_card", WIDTHS["info_card"])
    fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
    manifest["info_card"]["free_zone"] = fz
    t, b = dilimler(fz)
    manifest["info_card"]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                       "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before "
                                               "(dikey gerilir), alt dilim ::after — docs/11 §9; site.css --t/--b"}

    for nm in ("florals_tl", "florals_br", "divider"):
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        # kümeler ilk görünümde (index/home/iç sayfa başı): q − 6 → 800 px < 150 KB (docs/11 §6)
        webp(im, nm, WIDTHS[nm], q - 6 if nm.startswith("florals") else None)
        if nm.startswith("florals"):
            # 16 × 16 yaprak haritası (hücrede alfa > 40 olan piksel > %8): site.js küme ile duvar yazısını bununla ayırır
            al = np.asarray(im)[..., 3] > 40
            hh, ww = al.shape
            satir = []
            for j in range(16):
                bits = 0
                for i in range(16):
                    hucre = al[j * hh // 16:(j + 1) * hh // 16, i * ww // 16:(i + 1) * ww // 16]
                    bits = (bits << 1) | int(hucre.mean() > 0.08)
                satir.append(f"{bits:04x}")
            manifest[nm]["map16"] = "".join(satir)
    for i in (1, 2, 3):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        im = im.resize((200, round(im.height * 200 / im.width)), Image.LANCZOS)
        webp(im, f"accent_{i}", [200])

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    for ad, kutu in (("lagoon_top", LAGOON_TOP), ("lagoon_bottom", LAGOON_BOTTOM), ("lagoon_wide", LAGOON_WIDE)):
        n = suslu_piksel(np.asarray(bg.crop(kutu)))
        if n > 40:
            sys.exit(f"{ad}: kırpım {kutu} süs içeriyor ({n} pembe/yaprak/sarı piksel)")
    lag = lagun(bg)
    webp(lag, "lagoon", [lag.width], 78)
    manifest["lagoon"].update({"top_crop": list(LAGOON_TOP), "bottom_crop": list(LAGOON_BOTTOM), "blend_px": LAGOON_BLEND})
    wide = bg.crop(LAGOON_WIDE)
    webp(wide, "lagoon_wide", [wide.width], 78)
    manifest["lagoon_wide"]["crop"] = list(LAGOON_WIDE)
    la = np.asarray(lag).astype(np.float64)
    manifest["lagoon"]["tone_top"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in la[:40].reshape(-1, 3).mean(0))
    manifest["lagoon"]["tone_bottom"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in la[-40:].reshape(-1, 3).mean(0))
    # uzun sayfa zemini: bg_tile (dikişsiz deniz köpüğü kağıdı), 640 px
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    webp(tile, "bg_tile", [640], 78)
    ta = np.asarray(tile).reshape(-1, 3).astype(np.float64).mean(0)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in ta]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in ta)

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen_, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph, en_koyu, sus = yer_tutucu_temiz(bg, kutu, oran, max(gen_))
        if en_koyu < PH_MIN_LUM or sus > 40:
            sys.exit(f"ph_{key}: kırpım {kutu} bir dekor parçası içeriyor (en koyu {en_koyu} < {PH_MIN_LUM} ya da süs {sus})")
        webp(ph, f"ph_{key}", gen_, 80)
        manifest[f"ph_{key}"].update({"aspect": oran, "crop": list(kutu), "min_lum": en_koyu, "decor_px": sus})

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
    eoa2 = np.asarray(eo)[..., 3]
    oc = np.flatnonzero(eoa2[k_ust + 40:].max(0) > 200)
    orr = np.flatnonzero(eoa2.max(1) > 200)
    manifest["stage"]["align_fix"]["after_px"] = {"left": int(oc.min()) - k_x0, "right": int(oc.max()) + 1 - k_x1,
                                                  "bottom": int(orr.max()) + 1 - k_alt}

    yaprak, kroma = {}, {}
    for f in sorted(out.glob("*.webp")):
        n_tb, n_kroma = kroma_yesil(f, f.name.startswith(("card_small", "frame_")))
        if n_tb:
            yaprak[f.name] = n_tb
        if n_kroma:
            kroma[f.name] = n_kroma
    if kroma:
        sys.exit(f"görünür #00FF00 kalıntısı (parlak kroma yeşili): {kroma}")
    manifest["cleanup"] = temizlik
    manifest["checks"] = {"envelope_open_overlap_diff": round(fark_acik, 5), "green_px": 0,
                          "green_check": {"chroma_key_px": 0, "tema_build_yesil_gorunur_foliage_px": yaprak,
                                          "note": "tema_build.yesil_gorunur canlı yaprak yeşilini de sayar; parlak kroma "
                                                  "şartı (G ≥ 190, fazla ≥ 60) ile 0 — kroma_yesil()"},
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı; hero isimleri ≥ 32 px
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": False, "names_min_px": 32}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl_crop, katman, stage, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"kapak {kb['ellipse']} iz {kb['traced_columns']} / elips {kb['from_fit_columns']} sütun · uç {kb['tip']}")
    print(f"cep {cep['edge_at']} · kart yolu {stage['card_path']}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    print(f"info_card dilimler {manifest['info_card']['slices']['top_end_pct']}–{manifest['info_card']['slices']['bottom_start_pct']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl_crop, katman, stage, cs):
    """Kesim önizlemeleri (gözle denetim): kapak / gövde, cep / arka, kapalı ve açık sahne."""
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
    arka = Image.alpha_composite(env_body, Image.new("RGBA", (W, H)))
    sheet.paste(on(Image.alpha_composite(env_flap, arka), (190, 50, 50)), (3 * W, 0))
    sheet.thumbnail((2400, 1000))
    sheet.save(oniz / "kesimler.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    sahne = Image.new("RGBA", (900, round(SH * k)), (226, 244, 240, 255))

    def koy(im, p):
        x, y, w, h = p
        r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
        sahne.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
    koy(ec.crop(alfa_kutu(ec, 1)), katman["env_closed"])
    koy(flap.crop(alfa_kutu(flap, 1)), katman["env_cflap"])
    koy(cl_crop, katman["closure"])
    sahne.convert("RGB").save(oniz / "kapali_sahne.jpg", quality=88)
    sahne = Image.new("RGBA", sahne.size, (226, 244, 240, 255))
    koy(env_flap.crop(alfa_kutu(env_flap, 1)), katman["env_flap"])
    koy(env_body.crop(alfa_kutu(env_body, 1)), katman["env_body"])
    koy(cs, katman["card"])
    koy(pocket.crop(alfa_kutu(pocket, 1)), katman["env_pocket"])
    sahne.convert("RGB").save(oniz / "acik_sahne.jpg", quality=88)


if __name__ == "__main__":
    main()
