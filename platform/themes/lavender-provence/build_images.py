#!/usr/bin/env python3
"""Lavender Provence teması (tasarım 09, G409) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, aynalar; yeni şekil/dekor çizmez.

  python3 platform/themes/lavender-provence/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/09_Lavender_Provence/assets/gpt/parts/ (G209, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" doldurma, windows.json); tema klasörüne, img_src/'ye,
assets/'e yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.6 — keten kese, sarılı kapanış):
  * Hiza (kit_check UYARI: alt −2,15 %, kapanış uçları ~−1,3 %): açık kese kapalıdan 33 px yukarıda çizilmiş (sol/sağ
    kenar aynı). Açık kese ölçülen ölçek + ötelemeyle kapalının sol, sağ ve alt kenarına oturtulur. Sicimin iki ucu
    kesenin kenarından ~14 px taşıyor: kapanış düğüm sütunu çevresinde yatayda ölçülen oranla daraltılır (uçlar kesenin
    kenarında biter). İkisi de manifest.stage.align'da (önce / sonra).
  * Ön duvar kesimi (pouch_front): tema_build.kese_kes bu kesede ağız yayını bulamadı ("geometrik yay" yedeği astarın
    ortasını ön duvara katıyordu). Ağzın içi leylak astar (G ≈ B), keten krem (G − B ≥ 15): her sütunda ağız bölgesinde
    astarın EN ALT satırı (+1) ön duvarın ilk satırıdır — krem ağız kenarı ön duvarda kalır, astar arkada. Astarın krem
    desenleri sütun içinde kapatılır (12 px), 9 sütun medyanı; astarın görünmediği yan sütunlarda ön duvar = sütunun alfa
    üstü (kart oradan geçmez). pouch_back = hizalanmış açık kesenin tamamı (ön duvar aynı piksellerle biner, dikiş yok).
  * Kapanış "unties and slips away": closure.png (lavanta demeti + düğüm + sicim fiyonku, kese tuvalinde 1:1) üç parçaya
    RENKLE ayrılır: sicim (jüt: R > G > B, R − B ≥ 38) düğümün iki yanında (düğüm sütunu ± KNOT_HALF) `tie_l` / `tie_r`;
    geri kalan her şey (lavanta, saplar, düğüm) `bundle`. Parçalar ikili maskeyle bölünür (örtüşme 0). Gizli kalan bir şey
    yok: düğümün arkasındaki saplar düğümle birlikte gider (kesilen kısım hiç açığa çıkmaz).
  * Kart yolu: kart (card_small) ağzın astar açıklığından dar, cepte ön duvarın arkasında; sahnede `.card-slot`
    clip-path'i ön duvarın üst kenarını izler (manifest.stage.rim.clip) — kart boyun büzgüsünün yanlarından taşmaz.
  * Lavanta tomurcukları (açılış parçacığı, W1 zeminindeki serbest tomurcuklar, küçük süs): accent_1 dalının en alttaki
    tomurcuk halkasının kırpımı (`bud`), sapı 4 px yumuşak alfayla kesilir. Yalnız kırpım.
  * Zemin: bg_page 2:3 leylak kâğıdı köşe buketleriyle; telefonda cover ile buketler kesilir. Sayfa zemini bg_page'in tam
    genişlikte çiçeksiz orta bandı (y 560–880) + dikey aynası (`paper_tile`, dikişsiz tekrar); buketler ayrı katman
    (florals_tl / florals_br). bg_tile (keten) comp'larda kâğıt zemin olmadığı için kullanılmaz (README sapma).

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json. site.css'teki yüzdeler
manifest'ten; --onizleme DIR kesim önizlemeleri + compare_closure.jpg yazar. Tema klasörü ≤ 3 MB. Bağımlılık: Pillow + numpy.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/09_Lavender_Provence"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "pouch_closed": [440, 880], "pouch_back": [440, 880], "pouch_front": [440, 880],
    "bundle": [240, 480], "tie_l": [160, 320], "tie_r": [160, 320], "closure": [320, 640],
    "card_small": [320, 640], "invitation_card": [480, 960], "info_card": [480, 960],
    "frame_portrait": [320, 640], "frame_landscape": [480, 960],
    "florals_tl": [400, 640, 820], "florals_br": [400, 640, 820], "divider": [300, 600],
}
# palet (palette.json lavender-linen): ivory #FAF8F3 — yer tutucu tonu
IVORY = (250, 248, 243)
# kart genişliği / astar açıklığı (ağızdan dar: kart ağızdan çıkar, kenarı astarın içinde kalır)
CARD_OF_MOUTH = 0.86
# cepte bekleyen kart: kartın en çok bu kadarı ön duvarın (ağız kenarının en alçak noktası) üstünde — astarın önünde
# kartın üst kenarı görünür, fotoğraf penceresi görünmez
CARD_PEEK = 0.05
KNOT_HALF = 44
HALE_ESIK = 8           # GPT'nin tuvale yaydığı soluk alfa hâlesi (alfa 1–7, ~7–30 bin piksel): sıfırlanır
FLORAL_Q = 60           # köşe buketleri yoğun: 390 px telefonda DPR 3'te 640 seçilir, ilk görünümde < 150 KB; 820 yalnız
                        # geniş ekranda (≤ 250 KB, docs/11 §6)          # px (kese tuvali) — düğüm sütunu ± bu kadar `bundle`'da kalır
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: çiçeksiz leylak kâğıt)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (420, 240, 860, 740)),
    "story_1": ("portrait", [320, 640], (330, 260, 780, 840)),
    "story_2": ("portrait", [320, 640], (520, 330, 960, 860)),
    "story_3": ("portrait", [320, 640], (300, 420, 720, 960)),
    "venue": ("landscape", [480, 960], (60, 560, 1000, 880)),
}
PH_MIN_LUM = 170   # yer tutucuda en koyu piksel en az bu (lavanta/yaprak girmez; çıkış ≠ 0)
PH_MAX_SAT = 40    # ... ve doygun renk yok (max − min kanal; leylak kâğıt ~15–25)
# sayfa zemini: bg_page'in tam genişlikte çiçeksiz bandı (ızgarayla doğrulandı: sol üst buketin en alt sapı y ≈ 520,
# sağ alt buketin en üst başağı y ≈ 880, x ≥ 900); band + dikey aynası = dikişsiz dikey tekrar
PAPER_BAND = (0, 560, 1024, 880)
PAPER_MAX_DARK = 0.0005   # bantta lum < 170 piksel payı en çok bu (çiçek parçası yok)


def hale_sil(im: Image.Image, esik: int = HALE_ESIK):
    """GPT hâlesi: alfa < esik pikseller tam şeffaf (görünmez; alfa kutularını ve sahne kutusunu tuval boyuna yayıyordu)."""
    a = np.asarray(im.convert("RGBA")).copy()
    n = int(((a[..., 3] > 0) & (a[..., 3] < esik)).sum())
    a[..., 3] = np.where(a[..., 3] < esik, 0, a[..., 3])
    return Image.fromarray(a, "RGBA"), n


def yaprak_haritasi(im: Image.Image, n: int = 16, esik: float = 0.04) -> str:
    """Köşe buketinin n × n doluluk haritası (alfa > 40 payı > esik olan hücre = 1), satır başına 4 onaltılık hane.
    site.js decor(): buket bir metin kutusunun altına girerse küçülür, olmazsa gizlenir (05'in çözümü)."""
    a = np.asarray(im.convert("RGBA"))[..., 3] > 40
    H, W = a.shape
    out = ""
    for j in range(n):
        bits = 0
        for i in range(n):
            c = a[j * H // n:(j + 1) * H // n, i * W // n:(i + 1) * W // n]
            bits = (bits << 1) | int(c.mean() > esik)
        out += f"{bits:04x}"
    return out


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


def alfa_kutu(im, esik: int = 8):
    k = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)
    if k is None:
        raise SystemExit("boş katman")
    return k


def rgba(im) -> np.ndarray:
    return np.asarray(im.convert("RGBA")).astype(np.float64)


def from_arr(a) -> Image.Image:
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA")


def renk_tasir(im: Image.Image, tur: int = 6) -> Image.Image:
    """WebP kenar saçağı için: tam şeffaf piksellere komşu opak rengi taşır (alfa değişmez, görünüm aynı)."""
    a = rgba(im)
    al = a[..., 3]
    rgb = a[..., :3] * (al[..., None] > 0)
    w = (al > 0).astype(np.float64)
    for _ in range(tur):
        s = np.zeros_like(rgb)
        n = np.zeros_like(w)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            s += np.roll(rgb * w[..., None], (dy, dx), (0, 1))
            n += np.roll(w, (dy, dx), (0, 1))
        yeni = (w == 0) & (n > 0)
        rgb[yeni] = s[yeni] / n[yeni][:, None]
        w = np.where(yeni, 1.0, w)
    a[..., :3] = np.where((al[..., None] == 0) & (w[..., None] > 0), rgb, a[..., :3])
    return from_arr(a)


def webp_yaz(im, name, widths, q, manifest, out):
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    if im.mode == "RGBA":
        im = renk_tasir(im)
    tb.webp(im, name, widths, q, manifest, out)


# ============================================================================= kese: hiza, ön duvar, kapanış

def kutu_kenar(al: np.ndarray, esik: int = 200):
    cols = np.flatnonzero(al.max(0) > esik)
    rows = np.flatnonzero(al.max(1) > esik)
    return int(cols.min()), int(rows.min()), int(cols.max()) + 1, int(rows.max()) + 1


def tasi(im: Image.Image, sx: float, sy: float, dx: float, dy: float) -> Image.Image:
    """Aynı tuvalde ölçek + öteleme (ölçülen hiza düzeltmesi)."""
    W, H = im.size
    r = im.resize((max(1, round(W * sx)), max(1, round(H * sy))), Image.LANCZOS) if (sx, sy) != (1, 1) else im
    t = Image.new("RGBA", (W, H))
    t.paste(r, (round(dx), round(dy)))
    return t


def boyun(al: np.ndarray, y0: int, y1: int):
    """Açık kesenin boynu: ağızla gövde arasında en dar opak satır (büzgü)."""
    gen = (al[y0:y1] > 200).sum(1)
    i = int(np.argmin(gen))
    return y0 + i, int(gen[i])


def agiz_kes(eo: Image.Image, y_ust: int, y_boyun: int, kapat: int = 12, medyan: int = 9):
    """Ön duvarın üst kenarı: her sütunda ağız bölgesinde (y_ust..y_boyun) leylak astarın en alt satırı + 1.
    Astar: G − B < 8, R − B < 45, lum < 200 (keten krem G − B ≥ 15; parlak kenar lum ≥ 200). (kenar[x], bilgi)."""
    a = rgba(eo)
    R, G, B, A = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    lum = a[..., :3] @ LUM
    astar = (G - B < 8) & (R - B < 45) & (lum < 200) & (A > 200)
    H, W = A.shape
    alfa_ust = np.array([int(np.argmax(A[:, x] > 200)) if (A[:, x] > 200).any() else H for x in range(W)])
    kenar = alfa_ust.astype(np.float64).copy()
    bulunan = np.zeros(W, bool)
    for x in range(W):
        col = astar[y_ust:y_boyun, x]
        ys = np.flatnonzero(col)
        if len(ys) < 10:
            continue
        # sütun içinde kapama: astarın krem desenleri (≤ kapat px) astar sayılır; en alttaki sağlam koşu
        dolu = np.zeros_like(col)
        for i in range(len(ys) - 1):
            dolu[ys[i]:ys[i + 1] + 1] = ys[i + 1] - ys[i] <= kapat
        dolu[ys] = True
        kos = np.flatnonzero(dolu)
        # alttan yukarı ilk ≥ 8 px'lik koşu (gölge lekeleri tek tük)
        alt = None
        i = len(kos) - 1
        while i >= 0:
            j = i
            while j > 0 and kos[j - 1] == kos[j] - 1:
                j -= 1
            if i - j + 1 >= 8:
                alt = int(kos[i])
                break
            i = j - 1
        if alt is None:
            continue
        kenar[x] = y_ust + alt + 1
        bulunan[x] = True
    xs = np.flatnonzero(bulunan)
    if len(xs) < 40:
        raise SystemExit(f"kese ağzı: astar bulunamadı ({len(xs)} sütun)")
    yum = kenar.copy()
    h = medyan // 2
    for x in xs:
        pen = kenar[max(xs[0], x - h):min(xs[-1], x + h) + 1]
        yum[x] = np.median(pen)
    # astarın görünmediği sütunlar: alfa üstü (bütün sütun ön duvar)
    yum[~bulunan] = alfa_ust[~bulunan]
    bilgi = {"method": "renk (leylak astarın alt sınırı)", "lining_columns": [int(xs[0]), int(xs[-1]) + 1],
             "columns_found": int(len(xs)), "mouth_rows": [int(y_ust), int(y_boyun)],
             "rule": "astar: G−B<8, R−B<45, lum<200; sütun içi kapama 12 px; 9 sütun medyanı",
             "lowest_rim": [int(xs[np.argmax(yum[xs])]), round(float(yum[xs].max()), 1)]}
    return yum, bulunan, bilgi


def kapanis_bol(cl: Image.Image, cicek_alti: int):
    """closure → {tie_l, tie_r, bundle} (ikili maske, aynı tuval). Sicim (jüt) rengi: R > G > B, R − B ≥ 38, G − B ≥ 14;
    düğüm = sicim piksellerinin en yoğun sütunu (fiyonk ortası). Lavanta çiçeklerinin altındaki satırlarda (y ≥ cicek_alti)
    düğüm sütunu ± KNOT_HALF dışındaki her şey (yeşil saplar hariç) iki yana ayrılır."""
    a = rgba(cl)
    R, G, B, A = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    jut = (R > G) & (G > B) & (R - B >= 38) & (G - B >= 14) & (A > 40)
    H, W = A.shape
    yy = np.arange(H)[:, None]
    bant = jut & (yy >= cicek_alti)
    sutun = bant.sum(0).astype(np.float64)
    kx = int(np.argmax(np.convolve(sutun, np.ones(31), "same")))
    xx = np.arange(W)[None, :]
    # çiçeklerin altında, düğüm bandının dışında kalan her piksel sicimdir (yumuşak kenarları dahil) — yalnız düğümün
    # hemen yanındaki yeşil saplar (G ≥ R − 8, düğüme ≤ 80 px) demette kalır
    sap = tb.genislet((G >= R - 8) & (A > 40) & (np.abs(xx - kx) <= 80), 2)
    m = (A > 0) & (yy >= cicek_alti) & ~sap
    sol = m & (xx < kx - KNOT_HALF)
    sag = m & (xx > kx + KNOT_HALF)
    demet = (A > 0) & ~sol & ~sag
    parca = {}
    for ad, mm in (("tie_l", sol), ("tie_r", sag), ("bundle", demet)):
        b = a.copy()
        b[..., 3] = np.where(mm, A, 0)
        parca[ad] = from_arr(b)
    # düğüm merkezi: düğüm bandındaki sicim piksellerinin ağırlık merkezi
    # düğüm satırı: düğüm bandında sicim sayısı en yüksek satırların (≥ %60) ortası (saplardaki kuru jüt tonları alçakta kalır)
    satir = (bant & (np.abs(xx - kx) <= KNOT_HALF)).sum(1).astype(np.float64)
    ky = float(np.flatnonzero(satir >= 0.6 * satir.max()).mean()) if satir.max() > 0 else float(cicek_alti)
    return parca, {"knot_px": [kx, round(ky, 1)], "knot_half_px": KNOT_HALF, "flowers_end_row": int(cicek_alti),
                   "twine_rule": "R>G>B, R−B≥38, G−B≥14", "split": "ikili maske (örtüşme 0)",
                   "px": {k: int((np.asarray(v)[..., 3] > 0).sum()) for k, v in parca.items()}}


def cicek_alti_bul(cl: Image.Image) -> int:
    """Lavanta çiçeklerinin (mor: B > G + 6) en alt satırı + 4 (fiyonk ilmekleri bunun altında)."""
    a = rgba(cl)
    mor = (a[..., 2] > a[..., 1] + 6) & (a[..., 3] > 120)
    rows = np.flatnonzero(mor.sum(1) > 3)
    return int(rows.max()) + 4


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(8.0, 94.0), min_gen: float = 74.0, sol_maks: float = 100.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın genişliğinin ≥ min_gen'i süssüz ve sol kenarı
    ≤ sol_maks (davet kartında sol kenar boyunca inen buket: gerilen satırda sap olmasın). En uzun düz bant gerilir. (t, b)."""
    duz = [y for y, L, R in fz if L is not None and R - L >= min_gen and L <= sol_maks
           and kenar_bosluk[0] <= y <= kenar_bosluk[1]]
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


# ============================================================================= zemin, yer tutucu, tomurcuk

def orta_bant(im: Image.Image, t: float, b: float, esik: float = 26, boy: int = 9):
    """3 dilim kartın gerilen orta bandı (satır %t–%b), kâğıt liflerinden temizlenmiş: tam opak komşulukta (boy × boy)
    yerel medyandan > esik uzak piksel (turuncu lif, nokta) medyanla değiştirilir. Gerilen bantta lifler uzayıp metnin altına
    giriyordu (theme-check piksel testi, --stress). Temizlik; yeni şekil yok. (RGBA bant, değişen piksel payı)."""
    H = im.height
    band = im.crop((0, round(H * t / 100), im.width, round(H * b / 100))).convert("RGBA")
    a = np.asarray(band).astype(np.float64)
    med = np.asarray(band.convert("RGB").filter(ImageFilter.MedianFilter(boy))).astype(np.float64)
    opak = np.asarray(band.getchannel("A").filter(ImageFilter.MinFilter(boy))) > 250
    d = np.sqrt(((a[..., :3] - med) ** 2).sum(-1))
    m = opak & (d > esik)
    a[..., :3][m] = med[m]
    return from_arr(a), round(float(m.mean()), 5)


def kagit_bandi(bg: Image.Image):
    band = bg.crop(PAPER_BAND)
    lum = np.asarray(band.convert("L")).astype(np.float64)
    koyu = float((lum < 170).mean())
    if koyu > PAPER_MAX_DARK:
        raise SystemExit(f"paper bandı {PAPER_BAND} çiçek parçası içeriyor (koyu pay {koyu:.4f})")
    tile = Image.new("RGB", (band.width, band.height * 2))
    tile.paste(band, (0, 0))
    tile.paste(band.transpose(Image.FLIP_TOP_BOTTOM), (0, band.height))
    return tile, koyu


def yer_tutucu_temiz(bg, kutu, oran, w):
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.34)
    a = np.asarray(ph.convert("RGB")).astype(np.int16)
    sat = int(np.percentile(a.max(-1) - a.min(-1), 99.9))
    return ph, int(np.asarray(ph.convert("L")).min()), sat


def tomurcuk(acc1: Image.Image):
    """accent_1 (dik lavanta dalı) → en alttaki tomurcuk halkası. Halkalar = mor satır grupları; en alttaki grubun
    kutusu + 6 px; sap kesik uçları 4 px'te alfa ile solar."""
    a = rgba(acc1)
    mor = (a[..., 2] > a[..., 1] + 6) & (a[..., 3] > 120)
    rows = np.flatnonzero(mor.sum(1) > 2)
    gruplar, cur = [], [rows[0]]
    for r in rows[1:]:
        if r - cur[-1] > 6:
            gruplar.append(cur)
            cur = [r]
        else:
            cur.append(r)
    gruplar.append(cur)
    g = gruplar[-1]
    y0, y1 = max(0, g[0] - 6), min(a.shape[0], g[-1] + 7)
    cols = np.flatnonzero(a[y0:y1, :, 3].max(0) > 8)
    x0, x1 = int(cols.min()), int(cols.max()) + 1
    b = a[y0:y1, x0:x1].copy()
    h = b.shape[0]
    ramp = np.ones(h)
    ramp[:4] = np.linspace(0.25, 1, 4)
    ramp[-4:] = np.linspace(1, 0.25, 4)
    b[..., 3] *= ramp[:, None]
    return from_arr(b), {"source": "accent_1", "crop": [x0, int(y0), x1 - x0, int(y1 - y0)], "whorls": len(gruplar)}


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="lp-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (lavender-provence); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
                         "stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q

    def webp(im, name, widths=None, q_=None):
        webp_yaz(im, name, widths or WIDTHS[name], q_ or q, manifest, out)

    # ------------------------------------------------------------------ kese (aynı tuval: 1024×1536)
    ec, h1 = hale_sil(Image.open(PARTS / "envelope_closed.png"))
    eo_raw, h2 = hale_sil(Image.open(PARTS / "envelope_open.png"))
    cl_raw, h3 = hale_sil(Image.open(PARTS / "closure.png"))
    hale = {"envelope_closed": h1, "envelope_open": h2, "closure": h3, "alpha_below": HALE_ESIK}
    print(f"hâle temizliği (alfa < {HALE_ESIK}): {hale}")
    W, H = ec.size
    olcu = tb.kaydet_olculeri(COL)
    hz = tb.hiza_olc(ec, eo_raw, "kese", olcu.get("envelope_closed"), olcu.get("envelope_open"),
                     kapanis=cl_raw, kapanis_tuval=olcu.get("closure"))
    print(f"hiza önce ({hz['durum']}): {tb.hiza_ozet(hz)}")
    if hz["durum"] == "hata":
        sys.exit("kapalı/açık kese hizası > %4 (GPT'den yeniden üretim gerekir)")

    kx0, ky0, kx1, ky1 = kutu_kenar(np.asarray(ec)[..., 3])
    ax0, ay0, ax1, ay1 = kutu_kenar(np.asarray(eo_raw)[..., 3])
    sx = (kx1 - kx0) / (ax1 - ax0)                 # tek ölçek (kumaş en/boyu bozulmaz)
    dx = kx0 - ax0 * sx
    dy = ky1 - ay1 * sx
    eo = tasi(eo_raw, sx, sx, dx, dy)
    ox0, oy0, ox1, oy1 = kutu_kenar(np.asarray(eo)[..., 3])
    print(f"hiza düzeltmesi: açık kese × {sx:.4f}, öteleme ({dx:.1f}, {dy:.1f}) px → sol {ox0 - kx0:+d}, sağ {ox1 - kx1:+d}, "
          f"alt {oy1 - ky1:+d} px")

    # kapanış uçları: sicim uçları kesenin kenarına (düğüm sütunu çevresinde yatay ölçek)
    cicek_alti = cicek_alti_bul(cl_raw)
    knot_x = kapanis_bol(cl_raw, cicek_alti)[1]["knot_px"][0]
    ka = np.asarray(ec)[..., 3] >= 128
    cm = np.asarray(cl_raw)[..., 3] >= 128

    def uc_fark(cm_):
        sat = np.flatnonzero(cm_.any(1) & ka.any(1))
        k_l = np.array([np.argmax(cm_[r]) for r in sat])
        z_l = np.array([np.argmax(ka[r]) for r in sat])
        k_r = np.array([W - np.argmax(cm_[r, ::-1]) for r in sat])
        z_r = np.array([W - np.argmax(ka[r, ::-1]) for r in sat])
        sl = k_l <= k_l.min() + max(2, 0.02 * W)
        sr = k_r >= k_r.max() - max(2, 0.02 * W)
        return float(np.median(k_l[sl] - z_l[sl])), float(np.median(z_r[sr] - k_r[sr])), \
            float(np.median(knot_x - k_l[sl])), float(np.median(k_r[sr] - knot_x))
    fl, fr, dl, dr = uc_fark(cm)
    # taşan uç (fark < 0) kenara: o yandaki uzaklık × (1 + fark / uzaklık); iki yan için tek ölçek (simetrik fiyonk)
    s_cl = min(1.0, 1 + min(fl, 0) / dl, 1 + min(fr, 0) / dr)
    cl = tasi(cl_raw, s_cl, 1.0, knot_x * (1 - s_cl), 0)
    fl2, fr2, _, _ = uc_fark(np.asarray(cl)[..., 3] >= 128)
    print(f"kapanış: uçlar önce sol {fl:+.1f} / sağ {fr:+.1f} px → yatay × {s_cl:.4f} (düğüm x {knot_x}) → "
          f"sol {fl2:+.1f} / sağ {fr2:+.1f} px")
    hz2 = tb.hiza_olc(ec, eo, "kese", kapanis=cl)
    print(f"hiza sonra ({hz2['durum']}): {tb.hiza_ozet(hz2)}")

    # ön duvar
    y_boyun, boyun_gen = boyun(np.asarray(eo)[..., 3], oy0 + int(0.15 * (oy1 - oy0)), oy0 + int(0.45 * (oy1 - oy0)))
    rim, astarli, agiz = agiz_kes(eo, oy0, y_boyun)
    yy = np.arange(H)[:, None]
    on_m = (yy >= rim[None, :] - 0.5)
    eoa = rgba(eo)
    fr_a = eoa.copy()
    fr_a[..., 3] *= on_m
    pouch_front = from_arr(fr_a)
    pouch_back = eo
    fark_on = tb.ortusme(eo, [pouch_back, pouch_front])
    if fark_on > 0.01:
        sys.exit(f"açık kese katmanları kaynakla örtüşmüyor ({fark_on:.4f})")
    agiz["neck_row"] = y_boyun
    agiz["neck_width_px"] = boyun_gen

    # kapanış parçaları (hizalanmış kapanış)
    parca, kbilgi = kapanis_bol(cl, cicek_alti)
    fark_cl = tb.ortusme(cl, list(parca.values()))
    if fark_cl > 0.01:
        sys.exit(f"kapanış parçaları kaynakla örtüşmüyor ({fark_cl:.4f})")

    # ------------------------------------------------------------------ kart yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    lx0, lx1 = agiz["lining_columns"]
    agiz_gen = lx1 - lx0
    card_w = CARD_OF_MOUTH * agiz_gen
    card_h = card_w / card_ar
    card_cx = (lx0 + lx1) / 2
    card_x = card_cx - card_w / 2
    cx_lo, cx_hi = int(round(card_x)), int(round(card_x + card_w))
    rim_kart = rim[cx_lo:cx_hi]
    rim_alcak = float(rim_kart.max())                 # kartın sütunlarında ağız kenarının en alçak noktası
    rim_kose = float(min(rim[cx_lo], rim[cx_hi - 1]))  # kartın köşelerindeki ağız kenarı (yüksek)
    hidden_top = rim_alcak - CARD_PEEK * card_h
    # out: kartın alt köşeleri ağız kenarını kartın %4'ü kadar aşmış; front: aynı yerde öne (%3 aşağı + × 1.05)
    out_top = rim_kose - 0.04 * card_h - card_h
    scale_front = 1.05
    front_top = out_top + 0.03 * card_h
    card_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]
    if card_x < lx0 or card_x + card_w > lx1:
        sys.exit("kart astar açıklığından geniş")

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    cb = alfa_kutu(ec, 1)
    ob = alfa_kutu(eo, 1)
    clb = alfa_kutu(cl, 1)
    fr_w, fr_h = card_w * scale_front, card_h * scale_front
    front_box = [card_cx - fr_w / 2, front_top + card_h / 2 - fr_h / 2, card_cx + fr_w / 2, front_top + card_h / 2 + fr_h / 2]
    X0 = min(cb[0], ob[0], clb[0], front_box[0])
    X1 = max(cb[2], ob[2], clb[2], front_box[2])
    Y0 = min(cb[1], ob[1], clb[1], out_top, front_box[1])
    Y1 = max(cb[3], ob[3], clb[3])
    SW, SH = X1 - X0, Y1 - Y0

    def pct(box):
        x0, y0, x1, y1 = box
        return [round(100 * (x0 - X0) / SW, 3), round(100 * (y0 - Y0) / SH, 3),
                round(100 * (x1 - x0) / SW, 3), round(100 * (y1 - y0) / SH, 3)]

    stage = {"canvas": [W, H], "box": [round(X0, 1), round(Y0, 1), round(SW, 1), round(SH, 1)],
             "ratio": round(SW / SH, 5), "type": "kese (docs/11 §7.6)"}
    katman = {}
    for ad, im in (("pouch_closed", ec), ("pouch_back", pouch_back), ("pouch_front", pouch_front)):
        k = alfa_kutu(im, 1)
        k = [int(np.floor(X0)), k[1], int(np.ceil(X1)), k[3]]          # kese katmanları sahne genişliğinde
        webp(im.crop(k), ad)
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    for ad, im in parca.items():
        k = alfa_kutu(im, 1)
        webp(im.crop(k), ad)
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = list(k)
    katman["card"] = pct(card_hidden)
    stage["parts"] = katman
    stage["body_bottom_pct"] = round(100 * (ky1 - Y0) / SH, 3)
    # dönüşüm merkezleri (sahne yüzdesi): kesenin alt orta noktası (gevşeme), düğüm (çözülme)
    stage["loosen_origin_pct"] = [round(100 * ((kx0 + kx1) / 2 - X0) / SW, 3), round(100 * (ky1 - Y0) / SH, 3)]
    kn = kbilgi["knot_px"]
    stage["knot_pct"] = [round(100 * (kn[0] - X0) / SW, 3), round(100 * (kn[1] - Y0) / SH, 3)]
    stage["closed_obj"] = {"box_pct": pct([kx0, ky0, kx1, ky1]), "aspect": round((kx1 - kx0) / (ky1 - ky0), 4),
                           "frac_w": round((kx1 - kx0) / SW, 5), "top_frac_of_stage_w": round((ky0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - ky1) / SW, 5)}
    # kart-slot kırpması: ön duvarın üst kenarı (kartın sütunları ± %6), sahne yüzdesiyle; dışı yatay uzatılır
    xs_clip = np.linspace(card_x - 0.06 * card_w, card_x + 1.06 * card_w, 15)
    clip = [[round(100 * (x - X0) / SW, 2), round(100 * (float(rim[int(round(x))]) - 0.5 - Y0) / SH, 2)] for x in xs_clip]
    stage["rim"] = {"cut": agiz, "clip": clip, "lowest_px": round(rim_alcak, 1), "card_corners_px": round(rim_kose, 1)}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3),
                          "front_scale": scale_front, "card_w_of_mouth": CARD_OF_MOUTH,
                          "card_w_of_pouch": round(card_w / (kx1 - kx0), 4), "peek_of_card": CARD_PEEK}
    stage["align"] = {
        "before": hz, "after": hz2,
        "open_scale": round(sx, 5), "open_offset_px": [round(dx, 1), round(dy, 1)],
        "open_after_px": {"left": ox0 - kx0, "right": ox1 - kx1, "bottom": oy1 - ky1},
        "closure_scale_x": round(s_cl, 5), "closure_scale_origin_x_px": knot_x,
        "closure_ends_px": {"before": [round(fl, 1), round(fr, 1)], "after": [round(fl2, 1), round(fr2, 1)]},
        "reason": "GPT: açık kese 33 px yukarıda (sol/sağ aynı) → ölçek + öteleme; sicim uçları kenardan ~14 px taşıyor → "
                  "düğüm sütunu çevresinde yatay ölçek (uçlar kesenin kenarında)"}
    stage["haze_cleanup_px"] = hale
    stage["checks"] = {"open_layers_overlap_diff": round(fark_on, 5), "closure_pieces_overlap_diff": round(fark_cl, 5)}
    manifest["stage"] = stage
    webp(cl.crop(alfa_kutu(cl, 1)), "closure")          # bütün kapanış: favicon kaynağı, rsvp kartı, teşekkür süsü
    manifest["closure"].update({
        "wrapped": True, "anchor": "1:1 on the pouch canvas (wrapped closure, docs/11 §7.1)",
        "canvas_box": list(alfa_kutu(cl, 1)), "box_pct": pct(alfa_kutu(cl, 1)), "pieces": ["tie_l", "tie_r", "bundle"],
        "split": kbilgi, "carried_by_flap": False,
        "motion": "the twine loops slacken and slide apart (tie_l / tie_r), the lavender bundle with its knot slips down "
                  "and away (MOTION.envelope.closure)"})

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, nm in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        webp(im, nm)
        slots[ad] = tb.foto_alani(prep, win, nm, ad, manifest, out)
    manifest["photo_slots"] = slots
    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        webp(im, nm)
        fz = tb.serbest_bolge(im, 0.5, ornek=(.6, .7))
        manifest[nm]["free_zone"] = fz
        t, b = dilimler(fz, sol_maks=6.0 if nm == "invitation_card" else 100.0)
        mid, lif = orta_bant(im, t, b)
        ad = nm.replace("_card", "_mid")
        webp(mid, ad, [480, im.width])
        manifest[ad].update({"rows_pct": [t, b], "despeckled_share": lif})
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "mid": ad, "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı "
                                  "::before = <ad>_mid (liften temizlenmiş aynı satırlar, dikey gerilir), alt dilim ::after — "
                                  "docs/11 §9; site.css --t/--b"}
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.8, .86))
    # story çerçevesinin alt kâğıt bandı (başlık burada): pencere altından kartın alt kenarına free_zone
    manifest["frame_portrait"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "frame_portrait.png"), 0.5, ornek=(.92, .96))

    for nm in ("florals_tl", "florals_br", "divider"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im = im.crop(alfa_kutu(im))
        webp(im, nm, q_=FLORAL_Q if nm.startswith("florals") else None)
        if nm.startswith("florals"):
            manifest[nm]["leaf_map"] = yaprak_haritasi(im)
    for i in (1, 2, 3):
        im = Image.open(prep / f"accent_{i}.png").convert("RGBA")
        im = im.crop(alfa_kutu(im))
        im.thumbnail((200, 200), Image.LANCZOS)
        webp(im, f"accent_{i}", [im.width])
    bud, bud_bilgi = tomurcuk(Image.open(prep / "accent_1.png").convert("RGBA"))
    bud.thumbnail((80, 80), Image.LANCZOS)
    webp(bud, "bud", [bud.width])
    manifest["bud"].update(bud_bilgi)

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    tile, koyu = kagit_bandi(bg)
    webp(tile, "paper_tile", [640, 1024], 76)
    ta = np.asarray(tile).reshape(-1, 3).astype(np.float64)
    manifest["paper_tile"].update({"band": list(PAPER_BAND), "mirrored": "vertical", "dark_share": round(koyu, 5)})
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in ta.mean(0))
    top = np.asarray(bg.crop((300, 230, 1024, 330))).reshape(-1, 3).astype(np.float64).mean(0)
    bot = np.asarray(bg.crop((60, 1300, 400, 1500))).reshape(-1, 3).astype(np.float64).mean(0)
    manifest["page_tones"] = {"top": "#%02X%02X%02X" % tuple(int(round(v)) for v in top),
                              "bottom": "#%02X%02X%02X" % tuple(int(round(v)) for v in bot)}

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph, en_koyu, sat = yer_tutucu_temiz(bg, kutu, oran, max(gen))
        if en_koyu < PH_MIN_LUM or sat > PH_MAX_SAT:
            sys.exit(f"ph_{key}: kırpım {kutu} bir dekor parçası içeriyor (en koyu {en_koyu}, doygunluk {sat})")
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"].update({"aspect": oran, "min_lum": en_koyu, "max_sat": sat, "crop": list(kutu)})

    # ------------------------------------------------------------------ paylaşım görseli + favicon
    og, og_bilgi = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    og_bilgi["file"] = "og-1200x630.jpg"
    og_bilgi["bytes"] = tb.og_kaydet(og, out / og_bilgi["file"], 82)
    manifest["og"] = og_bilgi
    ikon, ikon_bilgi = tb.ikon(cl, 180)
    ikon.save(out / "favicon.png", optimize=True)
    ikon_bilgi.update({"source": "closure", "file": "favicon.png", "bytes": (out / "favicon.png").stat().st_size})
    manifest["favicon"] = ikon_bilgi

    # yeşil denetimi: tema_build.yesil_gorunur preslenmiş yaprak yeşilini de sayar (florals_br-400: 2 px, kekik yaprağı);
    # sert şart parlak kroma yeşili (G ≥ 190 ve G − max(R, B) ≥ 60; opak #00FF00 ≈ (5, 241, 1)) — her WebP'de 0
    kroma = {}
    for f in sorted(out.glob("*.webp")):
        a = np.asarray(Image.open(f).convert("RGBA")).astype(np.int16)
        n = int(((a[..., 1] >= 190) & (a[..., 1] - np.maximum(a[..., 0], a[..., 2]) >= 60) & (a[..., 3] > 25)).sum())
        if n:
            kroma[f.name] = n
    if kroma:
        sys.exit(f"görünür #00FF00 kalıntısı (parlak kroma yeşili): {kroma}")
    manifest["checks"] = {"green_px": 0, "green_check": {"chroma_key_px": 0, "tema_build_yesil_gorunur_foliage_px": tb.yesil_denetle(out)}, "open_layers_overlap_diff": round(fark_on, 5),
                          "closure_pieces_overlap_diff": round(fark_cl, 5),
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    manifest["theme_check"] = {"particles": ".accent-layer", "clusters": ".corner",
                               "first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, eo, pouch_front, cl, parca, rim, astarli, card_hidden, (X0, Y0, X1, Y1), stage, out)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · kese {stage['closed_obj']}")
    print(f"ağız {agiz} · kart yolu {stage['card_path']}")
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


def onizleme(oniz, ec, eo, front, cl, parca, rim, astarli, card, box, stage, out):
    """Kesim önizlemeleri (gözle denetim) + compare_closure.jpg (kapalı sahne | W1.1 comp'un kese bölgesi)."""
    def on(im, bg):
        b = Image.new("RGBA", im.size, bg + (255,))
        b.alpha_composite(im)
        return b
    X0, Y0, X1, Y1 = [int(round(v)) for v in box]
    lil = (226, 219, 238)
    # 1) kapalı | açık arka | ön duvar (kırmızı zemin) | kart cepte (kart + ön duvar) | kapanış parçaları
    kart = Image.open(out / "card_small-640.webp").convert("RGBA")
    kw, kh = int(round(card[2] - card[0])), int(round(card[3] - card[1]))
    kart = kart.resize((kw, kh), Image.LANCZOS)
    cep = on(eo, lil)
    cep.alpha_composite(kart, (int(round(card[0])), int(round(card[1]))))
    cep.alpha_composite(front)
    cizgi = on(eo, lil)
    px = cizgi.load()
    for x in range(len(rim)):
        if astarli[x]:
            y = int(rim[x])
            if 0 <= y < cizgi.height:
                px[x, y] = (230, 30, 30, 255)
    renk = {"tie_l": (200, 60, 60), "tie_r": (60, 120, 200), "bundle": (60, 160, 90)}
    pp = Image.new("RGBA", ec.size, lil + (255,))
    for ad, im in parca.items():
        a = np.asarray(im).copy()
        t = np.zeros_like(a)
        t[..., :3] = renk[ad]
        t[..., 3] = (a[..., 3] > 0) * 110
        pp.alpha_composite(im)
        pp.alpha_composite(Image.fromarray(t, "RGBA"))
    sheet = Image.new("RGB", ((X1 - X0) * 5, Y1 - Y0), (255, 255, 255))
    for i, im in enumerate((on(ec, lil), cizgi, on(front, (190, 50, 50)), cep, pp)):
        sheet.paste(im.crop((X0, Y0, X1, Y1)).convert("RGB"), (i * (X1 - X0), 0))
    sheet.save(oniz / "cuts_pouch.jpg", quality=86)
    # 2) compare_closure.jpg: kapalı sahne (kese + kapanış) | W1.1 comp'un kese bölgesi
    sahne = on(ec, lil)
    sahne.alpha_composite(cl)
    a = sahne.crop((X0, Y0 + int(.3 * (Y1 - Y0)), X1, Y1)).convert("RGB")
    comp = Image.open(COMPS / "web_1_envelope.png").convert("RGB")
    cc = comp.crop((280, 560, 760, 1080))
    cc = cc.resize((round(cc.width * a.height / cc.height), a.height), Image.LANCZOS)
    cmp_ = Image.new("RGB", (a.width + cc.width + 20, a.height), (255, 255, 255))
    cmp_.paste(a, (0, 0))
    cmp_.paste(cc, (a.width + 20, 0))
    cmp_.save(oniz / "compare_closure.jpg", quality=86)


if __name__ == "__main__":
    main()
