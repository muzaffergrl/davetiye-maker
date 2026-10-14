#!/usr/bin/env python3
"""Mediterranean Lemon teması (tasarım 05, G405) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/mediterranean-lemon/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/05_Lemon_Mediterranean/assets/gpt/parts/ (G205, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" doldurma, windows.json); tema klasörüne, img_src/'ye,
assets/'e yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf; kapanış kapakla TAŞINMAZ: "the lemon tie slips loose and rolls away"):
  * Kapak kesimi MAVİ FİSTO ÇİZGİSİNİN ALTINDAN: kapalı zarfın V kapağının serbest kenarı ince kobalt mavisi boyalı bir
    fisto (scallop) çizgisiyle bitiyor. tema_build.kapak_kes("v") en güçlü parlaklık düşüşünü (beyaz → mavi) bulur, yani
    çizginin ÜSTÜNDEN keserdi (mavi çizgi gövdede kalırdı). Burada V doğruları her sütunun en alttaki mavi pikselinden
    (B − R > 40) aykırısız uydurulur; kenar = o sütunda V bandındaki en alt mavi satır + 2 px (temas gölgesi kapakta) —
    fisto dalgası piksel piksel izlenir. Sert denetim: komşu sütun sıçraması ≤ 24 px, bulunamayan sütun ≤ %3.
  * Ön cep TRAPEZ: açık zarfın ön cebi iki çapraz yan kanat + düz üst kenarlı alt kanat. cep_kes("v") sivri V buluyordu
    (astar cebe, cep astara giriyordu; G035 yöntemi "uyum zayıf"). Burada her sütunda çini astarın en alt renkli pikseli
    (doygunluk > 60 ya da mavi) alınır; sol çapraz, sağ çapraz doğrular noktaların ALT zarfından (yukarıda kalan nokta =
    astarın beyaz çini zemini, atılır) ve düz kenar orta bölgenin %90'lık değerinden; kenar = min(sol, sağ, düz) + 1;
    köşelerde ve düz kenarla çaprazın yuvarlak dirseğinde doğrunun ≤ 6 px altında kalan astar noktası kenarı indirir.
  * Hiza (docs/11 §7.1, "ölçülen dönüşüm"): kit_check kenarları geçiyor (sol −0,20 · sağ +0,49 · alt +0,85 %), ama açık
    gövde kapalıdan ~%1 geniş, ~%3 uzun. Açık katmanlar ölçülen ölçek + ötelemeyle kapalının sol/sağ kenarına, menteşe
    satırına ve alt kenarına oturtulur (manifest.stage.align_fix) → 90°'de kapak aynı menteşede el değiştirir.
  * Kapanış (closure.png = limon + iki yaprak + çiçek dalı + kobalt kurdele, TEK parça) kare tuvalde büyük çizildi; yeri
    kesim geometrisine bağlı: çapa = fisto V'sinin ucu (V doğrularının kesişimi), W1.1 comp'ta ölçülen limon yüksekliği /
    zarf genişliği (0,192) ve limon merkezinin uca göre kayması (−0,059 × zarf genişliği) ile (manifest.closure).
  * GPT kusurları (kesimle/temizlikle, çizimsiz): (1) dış hatta yarı saydam hâle — alfa < 12 sıfırlanır, çekirdekten uzak
    piksel silinir, kenar rengi komşu opak renge çekilir; (2) pencereler saf #00FF00 değil, iki çerçevede yarı saydam
    koyu lekeler (G205 Sonuç) — parts_prep leke dolgusu (pencere TAM şeffaf; foto_alani denetler) + pencere çevresi 3 px
    halkada kalan pembe/kırmızı ayrıştırma saçağı halkanın dışındaki çerçeve renginden yeniden boyanır; yatay çerçevenin
    pencereye taşan limon dalındaki kırmızımsı saçak da komşu yaprak renginden; (3) WebP kenar saçağı: kaydetmeden önce
    şeffaf piksellere komşu renk taşınır (renk_tasir). Yeşil denetimi: tema_build.yesil_gorunur canlı limon yaprağını da
    "görünür #00FF00" sayıyor (01'in yeşil kırpması yaprakların ~%16'sını donuklaştırırdı) → kroma_yesil(): parlak kroma
    yeşili (G ≥ 190) 0 olmalı; yaprak sayıları manifest.checks.green_check'e yazılır.
  * Yer tutucular: en koyu gri ≥ 175 ve sarı/yeşil fazlası ≤ 24 (limon parlak: yalnız gri denetimi onu kaçırıyordu).
  * Telefon zemini (`wall`): bg_page 2:3, telefonda (en/boy ≈ 0,46) cover ile köşe kümeleri kesilirdi. Zemin bg_page'in
    iki çiçeksiz bölgesinden kurulur (güneşli sıva üst kırpım + beyazdan maviye geçen alt kırpım, 110 px yumuşak geçişle
    üst üste); limon kümeleri ayrı katman (decor_tl / decor_br), ekranda bütün. Geniş ekran: `wall_wide` (tek çiçeksiz
    geniş kırpım).

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
COL = ROOT / "collections/05_Lemon_Mediterranean"
PARTS = COL / "assets/gpt/parts"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, en_buyuk_bolge, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [320, 640], "card_small": [320, 640], "invitation_card": [480, 960],
    "info_card": [480, 960], "frame_portrait": [320, 640], "frame_landscape": [480, 960], "decor_tl": [480, 960],
    "decor_br": [480, 960], "divider": [300, 600],
}
# palet (palette.json lemon-azure): ivory #FFFDF7 — yer tutucu tonu
IVORY = (255, 253, 247)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: çiçeksiz, güneş gölgeli sakin sıva)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (480, 220, 880, 756)),
    "story_1": ("portrait", [320, 640], (600, 220, 980, 760)),
    "story_2": ("portrait", [320, 640], (380, 520, 740, 1030)),
    "story_3": ("portrait", [320, 640], (150, 760, 510, 1270)),
    "venue": ("landscape", [480, 960], (120, 690, 700, 1000)),
}
PH_MIN_LUM = 175   # yer tutucuda en koyu piksel (gri ton) en az bu: kümeden yaprak kırpıma girmez (çıkış ≠ 0)
PH_MAX_WARM = 24   # ... ve sarı/yeşil (limon, yaprak) yok: (R + G) / 2 − B ve G − max(R, B) en çok bu (gök mavisi serbest)
# telefon zemini (bg_page 1024×1536 kaynak pikseli): limon kümelerinin dışında kalan iki bölge (ızgarayla doğrulandı:
# sol üst küme y < 140'ta x ≤ 600, y < 210'da x ≤ 445 (limon), y < 480'de x ≤ 330, y < 690'da x ≤ 90; sağ alt küme
# x ≥ 495 ve y ≥ 1350, x ≥ 652 ve y ≥ 1305 (ilk çiçek), x ≥ 700 ve y ≥ 1150, x ≥ 850 ve y ≥ 1000)
WALL_TOP = (460, 210, 1000, 700)       # güneşli beyaz sıva, sağda yaprak gölgeleri
WALL_BOTTOM = (100, 700, 640, 1290)    # beyazdan gök mavisine geçen alt sıva
WALL_BLEND = 110                       # px — iki kırpımın yumuşak geçiş bandı
WALL_WIDE = (60, 820, 700, 1290)       # geniş ekran: beyazdan maviye geçen tek çiçeksiz geniş kırpım (en/boy 1,36)
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536): zarfın mavi fisto çizgisi x 157–866 (zarf genişliği 709);
# fisto V'si (her sütunun en alt mavi pikseli, kurdele dışı sütunlar) y = 0.8313x + 532.9 ve y = −0.849x + 1397.7, ucu
# (514.6, 960.7); limon kutusu x 458–568, y 842–978 (yükseklik 136), merkezi (507.4, 913.2). → limon yüksekliği / zarf
# genişliği 0.192; limon merkezi uçtan 0.067 × zarf genişliği yukarıda (yatay −0.010: GPT asimetrisi sayıldı, simetrik
# zarfta limon uca ortalanır).
COMP = {"env_w": 709.0, "lemon_h": 136.0, "lemon_c": (507.4, 913.2), "tip": (514.6, 960.7)}


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
    kenar2 = (yeni > 0) & (al < 230)
    mx = np.maximum(a[..., 0], a[..., 2])
    asiri = kenar2 & (a[..., 1] > 1.4 * mx)
    a[..., 1][asiri] = 1.4 * mx[asiri]
    a[..., 3] = yeni
    sonra = int((yeni > 0).sum())
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), {
        "alpha_floor": esik, "core": cekirdek, "reach_px": 1 if sert else 3, "removed_px": once - sonra}


def pencere_halkasi(im: Image.Image, prep: Path, win: dict, ad: str, halka: int = 3):
    """Pencere ayrıştırmasının bıraktığı pembe/kırmızı saçak: pencerenin `halka` px çevresindeki görünen piksellerin rengi
    4–10 px dışındaki opak çerçeve renginden alınır; alfa korunur. Pencereye taşan dekorun (yatay çerçevenin limon dalı)
    saçağı: pencere içinde kalan yarı saydam ve kırmızı/eflatun (R ya da B ≫ G) pikseller komşu opak dekor renginden
    (yarıçap 4). (RGBA, düzeltilen piksel sayısı)."""
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
    # pencere içindeki dekor saçağı (pay = 0 kalan halka pikselleri: çerçeveden uzak, dekorun ucunda)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    sacak = dokunan & ~ok & (a[..., 3] > 0) & (a[..., 3] < 250) & ((r > g + 30) | (b > g + 30))
    opak = (a[..., 3] >= 250) & ~((r > g + 30) & (b > g + 10))
    w2 = opak.astype(np.float64)
    pay2 = _kutu_bulanik(w2, 4)
    renk2 = np.stack([_kutu_bulanik(a[..., i] * w2, 4) for i in range(3)], -1)
    ok2 = sacak & (pay2 > 1e-3)
    a[..., :3][ok2] = renk2[ok2] / pay2[ok2][:, None]
    # komşusu olmayan küçük kırmızı saçak (dalın ucu) → silinir
    sil = sacak & ~ok2
    a[..., 3][sil] = 0
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), int(ok.sum() + ok2.sum() + sil.sum())


def renk_tasir(im: Image.Image) -> Image.Image:
    """Şeffaf piksellerin RGB'si (Pillow'un önçarpımlı küçültmesinden sonra siyah) görünen komşu renkle doldurulur
    ("alpha bleeding"); kayıplı WebP renk alt örneklemesi kenara siyah karıştırıp koyu saçak üretmesin. Görüntü
    değişmez (yalnız alfa 0 piksellerin rengi)."""
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
    """(tema_build.yesil_gorunur sayısı, #00FF00 benzeri parlak kroma yeşili sayısı). tema_build'in ölçütü (yeşil fazlası
    > 40, G ≥ 1,5 × max(R, B), alfa > 25) bu tasarımın canlı limon yapraklarını da sayıyor (kaynak decor_tl'de ~4700
    piksel: (82, 124, 46) gibi düz yaprak yeşili). Gerçek pencere kalıntısı parlak: opak #00FF00 ≈ (5, 241, 1), beyaz
    çerçeveye karışmış hâli ≈ (184, 250, 184); yaprak ışığı en çok ≈ (110, 172, 73) → ek şart G ≥ 190 ve yeşil fazlası ≥ 60. Yapı bu ikinciyle durur; ilki
    manifest'e "yaprak" olarak yazılır (README, Sonuç)."""
    a = np.asarray(Image.open(dosya).convert("RGBA")).astype(np.int16)
    mx = np.maximum(a[..., 0], a[..., 2])
    t = a[..., 1] - mx
    taban = (t > 40) & (a[..., 1] * 2 >= 3 * mx) & (a[..., 3] > 25)
    return int(taban.sum()), int((taban & (a[..., 1] >= 190) & (t >= 60)).sum())


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


def alfa_kutu(im: Image.Image, esik: int = 8):
    k = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)
    return [int(v) for v in k]


def _saglam_dogru(p, tol=None):
    """Aykırısız doğru. tol verilirse noktaların ALT zarfı (büyük y): doğrunun `tol` px'ten fazla üstündeki nokta atılır."""
    p = np.array(p, float)
    for _ in range(20):
        m, c = np.polyfit(p[:, 0], p[:, 1], 1)
        r = p[:, 1] - (m * p[:, 0] + c)
        if tol is None:
            s = max(2.5, 2.5 * np.median(np.abs(r)) * 1.4826)
            keep = np.abs(r) < s
        else:
            keep = r > -tol
            mad = np.median(np.abs(r[keep])) * 1.4826 + 1
            keep &= r < max(8.0, 4 * mad)
        if keep.all():
            break
        p = p[keep]
    return float(m), float(c), int(len(p))


# ============================================================================= kesimler (bu tasarım)

def mavi(a: np.ndarray) -> np.ndarray:
    """Kobalt mavisi boyalı çizgi pikselleri (opak)."""
    return (a[..., 2] - a[..., 0] > 40) & (a[..., 2] > 90) & (a[..., 3] > 200)


def fisto_v(a: np.ndarray):
    """Kapalı zarf (RGBA dizi) → (sol doğru, sağ doğru, uç, menteşe, x0, x1, en alt mavi satırı/sütun): V doğruları
    fisto çizgisinin her sütundaki en alt mavi pikselinden (fisto dalgalarının dipleri) aykırısız."""
    al = a[..., 3]
    W = a.shape[1]
    cols = np.flatnonzero(al.max(0) > 200)
    x0, x1 = int(cols.min()), int(cols.max())
    hinge = int(np.median([np.argmax(al[:, x] > 200) for x in range(x0 + 40, x1 - 40)]))
    bl = mavi(a)
    low = np.full(W, -1.0)
    for x in range(x0, x1 + 1):
        yy = np.flatnonzero(bl[:, x])
        if len(yy):
            low[x] = yy.max()
    xm = (x0 + x1) / 2
    L = _saglam_dogru([(x, low[x]) for x in range(x0 + 20, int(xm) - 60) if low[x] > 0])
    R = _saglam_dogru([(x, low[x]) for x in range(int(xm) + 60, x1 - 20) if low[x] > 0])
    xt = (R[1] - L[1]) / (L[0] - R[0])
    yt = L[0] * xt + L[1]
    return L, R, (xt, yt), hinge, x0, x1


def fisto_kapak_kes(ec: Image.Image):
    """Kapalı zarf → (kapak RGBA tam tuval, bilgi). Kenar = her sütunda V bandındaki (V − 80 … V + 30 px, menteşenin
    altı) en alt mavi fisto pikseli + 2 px. Bulunamayan sütun: komşudan (uçlarda menteşe)."""
    a = np.asarray(ec).astype(np.float64)
    H, W = a.shape[:2]
    L, R, tip, hinge, x0, x1 = fisto_v(a)
    xs = np.arange(W)
    vy = np.minimum(L[0] * xs + L[1], R[0] * xs + R[1])
    bl = mavi(a)
    kenar = np.full(W, -1.0)
    for x in range(x0, x1 + 1):
        lo, hi = int(max(hinge, vy[x] - 80)), int(min(H, vy[x] + 30))
        r = np.flatnonzero(bl[lo:hi, x])
        if len(r):
            kenar[x] = lo + r.max() + 2
    bulunan = int((kenar[x0:x1 + 1] >= 0).sum())
    bos = (x1 - x0 + 1) - bulunan
    for x in range(x0, x1 + 1):                       # uçlar: menteşe; arada: komşudan
        if kenar[x] < 0:
            kenar[x] = kenar[x - 1] if x > x0 and kenar[x - 1] >= 0 else float(hinge)
    dd = kenar[x0:x1 + 1]
    adim = float(np.abs(np.diff(dd[3:-3])).max())
    bilgi = {"method": "renk", "detector": "fisto: en alt kobalt pikseli (B − R > 40) V − 80 … V + 30 px, + 2 px",
             "hinge_row": hinge, "v_left": [round(L[0], 4), round(L[1], 2), L[2]], "v_right": [round(R[0], 4), round(R[1], 2), R[2]],
             "v_tip": [round(tip[0], 1), round(tip[1], 1)], "columns": [x0, x1], "found": bulunan,
             "continuity": {"missing_columns": bos, "max_step_px": round(adim, 1),
                            "limits": {"missing_max_frac": 0.03, "max_step_px": 24}},
             "edge_minus_v_px": [round(float(v), 1) for v in np.percentile(dd - vy[x0:x1 + 1], [5, 50, 95])],
             "warnings": []}
    yy = np.arange(H)[:, None]
    m = np.clip(kenar[None, :] - yy + 0.5, 0, 1)
    m[:, :x0] = 0
    m[:, x1 + 1:] = 0
    flap = a.copy()
    flap[..., 3] *= m
    orta = (xs > tip[0] - 40) & (xs < tip[0] + 40)
    bilgi["tip"] = [round(float(xs[orta][np.argmax(kenar[orta])]), 1), round(float(kenar[orta].max()), 1)]
    bilgi["rows"] = [0, int(np.ceil(kenar.max())) + 1]
    return Image.fromarray(np.clip(np.rint(flap), 0, 255).astype(np.uint8), "RGBA"), bilgi


def trapez_cep_kes(eo: Image.Image):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Noktalar: her sütunda çini astarın en alt renkli
    pikseli (doygunluk > 60 ya da B − R > 40) gövde üstü … 1080 arasında. Sol/sağ çapraz doğrular noktaların alt
    zarfından (astarın beyaz çini zemininde kalan, kenardan yukarıdaki noktalar atılır), düz kenar ortadaki noktaların
    %90'lık değeri; kenar = min(sol, sağ, düz) + 1."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    cols = np.flatnonzero(op.any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    wid = op.sum(1)
    ust = int(np.flatnonzero(wid >= wid.max() - 2)[0])
    alt = int(np.flatnonzero(op.any(1)).max())
    rgb = a[..., :3]
    renkli = (((rgb.max(-1) - rgb.min(-1)) > 60) | (rgb[..., 2] - rgb[..., 0] > 40)) & op
    sinir = min(alt - 60, ust + int(0.62 * (alt - ust)))
    pts = []
    for x in range(x0 + 14, x1 - 14):
        r = np.flatnonzero(renkli[ust:sinir, x])
        if len(r):
            pts.append((x, ust + r.max()))
    pts = np.array(pts, float)
    xm = (x0 + x1) / 2
    Lp = _saglam_dogru(pts[(pts[:, 0] > x0 + 20) & (pts[:, 0] < xm - 200)], tol=4.0)
    Rp = _saglam_dogru(pts[(pts[:, 0] > xm + 200) & (pts[:, 0] < x1 - 20)], tol=4.0)
    orta = pts[(pts[:, 0] > xm - 120) & (pts[:, 0] < xm + 120)][:, 1]
    duz = float(np.percentile(orta, 90))
    xs = np.arange(W)
    kenar = np.minimum(np.minimum(Lp[0] * xs + Lp[1], Rp[0] * xs + Rp[1]), duz) + 1
    # köşeler ve düz kenarla sağ çaprazın birleştiği yuvarlak dirsek: doğrunun en çok 6 px altında kalan astar noktası
    # kenarı oraya indirir (cebe astar şeridi girmesin), sonra 5 sütun medyanı
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
    bilgi = {"method": "renk", "shape": "trapez", "body": [x0, ust, x1, alt], "left": [round(Lp[0], 4), round(Lp[1], 2), Lp[2]],
             "right": [round(Rp[0], 4), round(Rp[1], 2), Rp[2]], "flat_row": duz, "points": int(len(pts)),
             "flat_x": [round((duz - Lp[1]) / Lp[0], 1), round((duz - Rp[1]) / Rp[0], 1)],
             "lowered_columns": int(duzelt.sum()),
             "liner_above_edge_px_p50_p90": [round(float(v), 2) for v in np.percentile(-art, [50, 90])],
             "liner_below_edge_px": int((art > 3).sum()),   # > 3 px: 1–3 px kalıntı yalnız kenarın satırı (köşelerde)
             "edge_at": {"x0": round(float(kenar[x0]), 1), "mid": round(float(kenar[int(xm)]), 1), "x1": round(float(kenar[x1]), 1)},
             "warnings": []}
    if min(Lp[2], Rp[2]) < 60 or bilgi["liner_below_edge_px"] > 0.02 * len(pts):
        bilgi["warnings"].append(f"cep kenarı zayıf: {Lp[2]}+{Rp[2]} nokta, kenarın altında astar {bilgi['liner_below_edge_px']}")
    return Image.fromarray(np.clip(np.rint(cep), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def limon_olc(rgba: np.ndarray):
    """Kapanıştaki limon (sarı: R > 190, G > 150, B < 110, opak), en büyük bölge → (x0, y0, x1, y1, cx, cy)."""
    a = rgba.astype(np.float64)
    m = (a[..., 0] > 190) & (a[..., 1] > 150) & (a[..., 2] < 110)
    if a.shape[-1] == 4:
        m &= a[..., 3] > 200
    s = en_buyuk_bolge(m)
    ys, xs = np.nonzero(s)
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()), float(xs.mean()), float(ys.mean())


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(8.0, 92.0), min_gen: float = 80.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın bütün genişliğinde süs yok (açıklık ≥ min_gen;
    yalnız ince mavi çerçeve çizgisi). En uzun kesintisiz düz bant gerilir. (t, b, [t, b])."""
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
    return float(en[0]), float(en[-1] + 1), [float(en[0]), float(en[-1] + 1)]


# ============================================================================= zemin

def duvar(bg: Image.Image):
    """Telefon zemini: iki çiçeksiz bg_page kırpımı üst üste (WALL_BLEND px yumuşak geçiş). RGB."""
    ust = bg.crop(WALL_TOP)
    alt = bg.crop(WALL_BOTTOM)
    w = ust.width
    H = ust.height + alt.height - WALL_BLEND
    out = Image.new("RGB", (w, H))
    out.paste(alt, (0, ust.height - WALL_BLEND))
    m = np.ones((ust.height, w))
    ramp = np.linspace(1, 0, WALL_BLEND)
    ramp = ramp * ramp * (3 - 2 * ramp)                      # smoothstep
    m[-WALL_BLEND:] = ramp[:, None]
    out.paste(ust, (0, 0), Image.fromarray((m * 255).astype(np.uint8), "L"))
    return out


def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, en koyu gri, en sıcak sarı/yeşil fazlası). Kırpım çiçeksiz olmalı: koyu yaprak (min_lum) ve açık
    limon/yaprak (warm) ikisi de denetlenir — limon parlaktır, yalnız min_lum onu yakalamıyordu."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.30)
    a = np.asarray(ph.convert("RGB")).astype(np.float64)
    sicak = np.maximum((a[..., 0] + a[..., 1]) / 2 - a[..., 2], a[..., 1] - np.maximum(a[..., 0], a[..., 2]))
    return ph, int(np.asarray(ph.convert("L")).min()), round(float(np.percentile(sicak, 99.9)), 1)


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="ml-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (mediterranean-lemon); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
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
    W, H = ec.size

    flap, kb = fisto_kapak_kes(ec)
    uyar("env_cflap", kb)
    sur = kb["continuity"]
    if sur["max_step_px"] > 24 or sur["missing_columns"] > 0.03 * (kb["columns"][1] - kb["columns"][0] + 1):
        sys.exit(f"kapak kesimi: fisto kenarı sürekli değil ({sur}) — kesim önizlemesine bak (--onizleme)")
    pocket, cep, cep_kenar = trapez_cep_kes(eo)
    uyar("env_pocket", cep)
    govde_ust = cep["body"][1]
    # açık zarf: kapak (gövde üstüne kadar + 3 px bindirme), gövde (astar + arka + yan kanatlar), ön cep
    yy = np.arange(H)[:, None]
    eoa = np.asarray(eo).astype(np.float64)
    m_flap = np.clip(govde_ust + 3 - yy + 0.5, 0, 1) * np.ones((1, W))
    m_body = np.clip(yy - (govde_ust - 2) + 0.5, 0, 1) * np.ones((1, W))
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

    # hiza (docs/11 §7.1 "ölçülen dönüşüm"): açık gövde kapalının sol/sağ kenarına, menteşesine ve alt kenarına
    eca0 = np.asarray(ec)[..., 3]
    kc = np.flatnonzero(eca0.max(0) > 200)
    k_x0, k_x1 = int(kc.min()), int(kc.max()) + 1
    k_ust = int(kb["hinge_row"])
    k_alt = int(np.flatnonzero(eca0.max(1) > 200).max()) + 1
    a_x0, a_x1 = int(cep["body"][0]), int(cep["body"][2]) + 1
    a_ust, a_alt = int(govde_ust), int(cep["body"][3]) + 1
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
    cep_kenar_x = np.arange(W)
    cep_kenar = k_ust + (np.interp((cep_kenar_x - dx) / sx, np.arange(W), cep_kenar) - a_ust) * sy
    govde_ust = k_ust
    hiza_duzeltme = {"open_scale": [round(sx, 5), round(sy, 5)], "open_offset_px": [round(dx, 1), round(dy, 1)],
                     "open_body_before": [a_x0, a_ust, a_x1, a_alt], "closed_body": [k_x0, k_ust, k_x1, k_alt],
                     "reason": "GPT: açık gövde kapalıdan ~%1 geniş, ~%3 uzun; ölçülen ölçek + öteleme ile sol/sağ, menteşe ve alt kenar çakışır"}
    print(f"hiza düzeltmesi: açık katmanlar × ({sx:.4f}, {sy:.4f}), öteleme ({dx:.1f}, {dy:.1f}) px")

    # ------------------------------------------------------------------ kapanış (limon + yapraklar + çiçek + kurdele)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    lx0, ly0, lx1, ly1, lcx, lcy = limon_olc(np.asarray(cl_raw))
    lemon_h = ly1 - ly0
    eca = np.asarray(ec)
    bl = mavi(eca.astype(np.float64))
    bc = np.flatnonzero(bl.any(0))
    env_x0, env_x1 = int(bc.min()), int(bc.max()) + 1               # fisto çizgisinin uçları (comp'la aynı ölçü)
    erows = np.flatnonzero(eca[..., 3].max(1) > 200)
    env_y0, env_y1 = int(erows.min()), int(erows.max()) + 1
    env_w = env_x1 - env_x0
    s = (COMP["lemon_h"] / COMP["env_w"]) * env_w / lemon_h          # closure tuval px → zarf tuval px
    kayma = (COMP["lemon_c"][1] - COMP["tip"][1]) / COMP["env_w"]     # −0.059: limon merkezi uçtan yukarıda
    tip = kb["v_tip"]
    hedef = (tip[0], tip[1] + kayma * env_w)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    c_left = hedef[0] - (lcx - ck[0]) * s
    c_top = hedef[1] - (lcy - ck[1]) * s
    c_w, c_h = (ck[2] - ck[0]) * s, (ck[3] - ck[1]) * s
    closure_box = [c_left, c_top, c_left + c_w, c_top + c_h]

    # ------------------------------------------------------------------ kart (card_small) yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    card_w_of_env = 0.56
    card_w = card_w_of_env * (k_x1 - k_x0)
    card_h = card_w / card_ar
    card_x = (k_x0 + k_x1) / 2 - card_w / 2
    hidden_top = govde_ust + 0.07 * (k_alt - k_ust)                   # astar penceresinde kartın üstü görünür
    kose_kenar = float(min(cep_kenar[int(card_x)], cep_kenar[int(card_x + card_w)]))
    # kart yukarıda kalır (yukarı → aşağı → yukarı yok): out = alt köşeleri cebin kenarını kartın %4'ü kadar aşmış;
    # front = aynı yerde öne gelir (%3 aşağı + × 1.04, büyüyen gölge) → home kartına yukarı uçar
    out_top = kose_kenar - 0.04 * card_h - card_h
    front_top = out_top + 0.03 * card_h
    card_box_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    ob_box = alfa_kutu(eo, esik=1)
    cb_box = alfa_kutu(ec, esik=1)
    scale_front = 1.04
    fr_w, fr_h = card_w * scale_front, card_h * scale_front
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
    stage["hinge_pct"] = round(100 * (k_ust - Y0) / SH, 3)
    stage["body_bottom_pct"] = round(100 * (k_alt - Y0) / SH, 3)
    stage["open_body_top_pct"] = round(100 * (govde_ust - Y0) / SH, 3)
    stage["closed_obj"] = {"box_pct": pct([k_x0, env_y0, k_x1, env_y1]), "aspect": round((k_x1 - k_x0) / (env_y1 - env_y0), 4),
                           "frac_w": round((k_x1 - k_x0) / SW, 5), "top_frac_of_stage_w": round((env_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - env_y1) / SW, 5)}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3), "front_scale": scale_front,
                          "pocket_edge_at_card_corners": round(kose_kenar, 1), "card_w_of_env": card_w_of_env}
    stage["cuts"] = {"cflap": kb, "pocket": cep}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak)}
    stage["align_fix"] = hiza_duzeltme
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "scalloped V flap tip (intersection of the V lines through the scallop bottoms)",
        "anchor_px": [round(tip[0], 1), round(tip[1], 1)], "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "lemon_height_px_closure": lemon_h,
        "lemon_center_in_crop_pct": [round(100 * (lcx - ck[0]) / (ck[2] - ck[0]), 3), round(100 * (lcy - ck[1]) / (ck[3] - ck[1]), 3)],
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": COMP["env_w"], "lemon_h_over_env_w": round(COMP["lemon_h"] / COMP["env_w"], 4),
                 "lemon_center_minus_tip_over_env_w": round(kayma, 4)},
        "carried_by_flap": False,
        "motion": "slips loose and rolls away (MOTION.envelope.closure, roll) before the flap lifts",
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = hale_temizle(im, sert=True)
        im, n_halka = pencere_halkasi(im, prep, win, parca)
        temizlik[parca]["window_ring_px"] = n_halka
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
        if oniz:
            bg = Image.new("RGBA", im.size, (40, 40, 40, 255)); bg.alpha_composite(im)
            bg.convert("RGB").save(oniz / f"kenar_{parca}.jpg", quality=88)
    manifest["photo_slots"] = slots

    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        t, b, _ = dilimler(fz)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (dikey "
                                          "gerilir), alt dilim ::after — docs/11 §9; site.css --t/--b"}
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.8, .86))

    for nm in ("decor_tl", "decor_br", "divider"):
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
    wall = duvar(bg)
    webp(wall, "wall", [wall.width], 78)
    manifest["wall"].update({"top_crop": list(WALL_TOP), "bottom_crop": list(WALL_BOTTOM), "blend_px": WALL_BLEND})
    wide = bg.crop(WALL_WIDE)
    webp(wide, "wall_wide", [wide.width], 78)
    manifest["wall_wide"]["crop"] = list(WALL_WIDE)
    # uzun sayfa zemini: bg_tile (dikişsiz sıva), bg_page'in güneşli orta sıvasının ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((420, 300, 760, 640))).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    # uzun sayfaların alt mavi sıvası (comp'larda her ekranın altı gök mavisi): bg_page'in çiçeksiz alt sol kırpımı
    wash = bg.crop((60, 1060, 480, 1536))
    webp(wash, "wash", [wash.width], 76)
    manifest["wash"]["crop"] = [60, 1060, 480, 1536]
    wa = np.asarray(wash).reshape(-1, 3).astype(np.float64)
    manifest["wash"]["tone_bottom"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in wa[-420 * 40:].mean(0))

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph, en_koyu, sicak = yer_tutucu_temiz(bg, kutu, oran, max(gen))
        if en_koyu < PH_MIN_LUM or sicak > PH_MAX_WARM:
            sys.exit(f"ph_{key}: kırpım {kutu} bir dekor parçası içeriyor (en koyu {en_koyu} < {PH_MIN_LUM} "
                     f"ya da sarı/yeşil {sicak} > {PH_MAX_WARM})")
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"]["aspect"] = oran
        manifest[f"ph_{key}"]["min_lum"] = en_koyu
        manifest[f"ph_{key}"]["max_warm"] = sicak

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
    # düzeltmeden sonra: kapalı ↔ hizalanmış açık (sol, sağ, alt kenar ve menteşe; px)
    eoa2 = np.asarray(eo)[..., 3]
    oc = np.flatnonzero(eoa2.max(0) > 200)
    orr = np.flatnonzero(eoa2.max(1) > 200)
    manifest["stage"]["align_fix"]["after_px"] = {"left": int(oc.min()) - k_x0, "right": int(oc.max()) + 1 - k_x1,
                                                  "bottom": int(orr.max()) + 1 - k_alt}

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
                                          "note": "tema_build.yesil_gorunur canlı yaprak yeşilini de sayar; parlak kroma "
                                                  "şartı (G ≥ 190, fazla ≥ 60) ile 0 — kroma_yesil()"},
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı; ilk ekran yatay telefonda da nav'ın üstünde biter,
    # hero isimleri ≥ 36 px
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl_crop, katman, stage, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"kart yolu {stage['card_path']}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} dilimler {manifest[nm]['slices']['top_end_pct']}–{manifest[nm]['slices']['bottom_start_pct']}")
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
    sahne = Image.new("RGBA", (900, round(SH * k)), (236, 233, 224, 255))

    def koy(im, p):
        x, y, w, h = p
        r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
        sahne.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
    koy(ec.crop(alfa_kutu(ec, 1)), katman["env_closed"])
    koy(flap.crop(alfa_kutu(flap, 1)), katman["env_cflap"])
    koy(cl_crop, katman["closure"])
    sahne.convert("RGB").save(oniz / "kapali_sahne.jpg", quality=88)
    sahne = Image.new("RGBA", sahne.size, (236, 233, 224, 255))
    koy(env_flap.crop(alfa_kutu(env_flap, 1)), katman["env_flap"])
    koy(env_body.crop(alfa_kutu(env_body, 1)), katman["env_body"])
    koy(cs, katman["card"])
    koy(pocket.crop(alfa_kutu(pocket, 1)), katman["env_pocket"])
    sahne.convert("RGB").save(oniz / "acik_sahne.jpg", quality=88)


if __name__ == "__main__":
    main()
