#!/usr/bin/env python3
"""Sunflower Rustic Barn teması (tasarım 16, G416) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, döndürür, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/sunflower-rustic-barn/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/16_Sunflower_Rustic/assets/gpt/parts/ (G216, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri, windows.json); tema klasörüne, img_src/'ye, assets/'e yazılmaz (docs/11 §1,
§5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf, köşeleri yuvarlak kare kapak; kapanış SARILI kurdele, 1:1 tuval):
  * Kapak kesimi: tema_build.kapak_kes("egri") kraft kapağın yuvarlak alt kenarını x 118–936 arasında buluyor; sol alt
    yuvarlak köşe (x 74–117, kapağın sol kenarı x≈74) bu aralığın dışında kaldığı için kapak orada "yok" sayılıyordu.
    Köşe ölçülen çeyrek elipsle tamamlanır (kose_tamamla: merkez (117, 844), yarıçap 43 × 93 px — her 4 sütunda
    kenar düşüşü ölçüldü, sapma ≤ 2 px); kapağın kenarlarının dışı (x < 74, x > 952) kapak değildir (gövdenin yan şeridi).
  * Ön cep KRAFT TARAMASI (cep_kraft): tema_build.cep_kes("duz"/"egri") V katlama çizgisine (y≈1254) oturuyordu. Her
    sütunda gövdenin altından yukarı: kraft (lum < 190, G − B < 64, R − G > 30) bitip 6 satır astar (hardal/krem kareli
    kumaş) görülen yer kenar; üstteki açık yırtık kenar şeridi (≤ 9 px) cebe dahil. Ortadaki sütunlardan (x 220–840)
    doğru uydurulur (düz kenar); yan kanatlar (sol/sağ kraft kulaklar) gövde katmanında kalır — kart onların arasından
    geçer, üstlerine binmez.
  * Hiza: kit_check geçiyor (sol +0,10 · sağ −0,20 · alt +1,43 %; kurdele uçları −0,39 / −0,10 %) — dönüşüm yok.
  * Kapanış (G098: GM07 R3 `closure_r2_v3.png` = hardal kareli kurdele + fiyonk + küçük ayçiçeği + arkasında buğday
    başakları, çiçek ve iki yaprak; ham imagegen, kaynakta piksel düzenlemesi yok) zarfla aynı 1024 × 1536 tuvalde,
    1:1 üst üste: yeri kendi alfa kutusu (manifest.closure, anchor "1:1 canvas overlay"). GPT bandı ~43 px aşağı
    çizdi: kayma eski closure.png'nin bandıyla ölçülür (bant_kaymasi, x 100 / 900 sütunlarında opak satırlar) ve yalnız
    YERLEŞİME uygulanır (alfa kutusu yukarı taşınır; görüntü aynı). Açılışta fiyonk gevşer, kurdele ayçiçeğiyle
    birlikte bant boyunca sağa kayıp zarfın sağ kenarında arkaya döner (CSS clip, site.js).
  * Ekler: barnwood (ahşap masa: açılışta zarfın altında beliren masa; story duvarı: 90° döndürülmüş, comp W1.3'ün dikey
    tahtaları) ve twine_line (story ipi; alfa kutusuna kırpılır, sarkma ölçülür: manifest.twine_line.sag).
  * Telefon zemini (`field`): bg_page 2:3, telefonda köşe kümelerini keserdi. Zemin bg_page'in iki çiçeksiz bölgesinden
    (güneşli krem orta x 150–1000 y 250–1150 + sol alttaki ahşap zemin x 0–500 y 1330–1536, 110 px yumuşak geçiş);
    ayçiçeği kümeleri ayrı katman (florals_tl / florals_br), ekranda bütün. Geniş ekran: `field_wide`.

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
COL = ROOT / "collections/16_Sunflower_Rustic"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [440, 880], "card_small": [320, 640], "invitation_card": [480, 900],
    "info_card": [480, 900], "frame_portrait": [320, 640], "frame_landscape": [480, 960], "florals_tl": [360, 540, 720],
    "florals_br": [360, 540, 720], "divider": [300], "twine_line": [480, 960],
}
QUALITY = {"florals_tl": 76, "florals_br": 76, "closure": 78, "card_ribbon": 78, "invitation_card": 76}
ALPHA_Q = {"florals_tl": 60, "florals_br": 60}
CARD_W_OF_ENV = 0.50       # kart genişliği / zarf genişliği (W1.2 kartı zarftan dar)
CARD_PHOTO_ABOVE = 0.06    # cepte bekleyen kart: foto penceresinin en çok bu kadarı cep kenarının üstünde
POCKET_BELOW = 0.04        # out: kartın alt köşeleri cebin kenarını kart boyunun bu kadarı aşar (docs/11 §7.1)
FRONT_DROP, FRONT_SCALE = 0.035, 1.05   # "slides out onto the tabletop": öne gelirken hafifçe masaya iner
# palet (palette.json sunflower): ivory #FFFBF0 — yer tutucu tonu
IVORY = (255, 251, 240)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: çiçeksiz güneşli krem)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (420, 420, 860, 880)),
    "story_1": ("portrait", [320, 640], (300, 500, 640, 960)),
    "story_2": ("portrait", [320, 640], (560, 380, 900, 840)),
    "story_3": ("portrait", [320, 640], (420, 700, 760, 1140)),
    "venue": ("landscape", [480, 960], (220, 520, 960, 960)),
}
PH_MIN_LUM = 170   # yer tutucuda en koyu piksel en az bu: kümeden yaprak/çiçek kırpıma girmez (çıkış ≠ 0)
PH_MAX_SAT = 70    # ... ve doygun ayçiçeği sarısı / yaprak yeşili yok (güneşli kremin kendi doygunluğu ~40–55)
# telefon zemini (bg_page 1024×1536 kaynak pikseli; 100 px ızgarayla ölçüldü: sol üst küme y < 350'de x ≤ 380 … 140,
# sağ alt küme y ≥ 900'de x ≥ 940, y ≥ 1150'de x ≥ 520; altta ahşap zemin y ≥ 1330)
FIELD_TOP = (150, 250, 1000, 1150)     # güneşli krem, ışık huzmeleri
FIELD_BOTTOM = (0, 1330, 500, 1536)    # sol alttaki ahşap zemin (comp'ların alt kenarı)
FIELD_BLEND = 110
FIELD_WIDE = (150, 300, 1000, 860)     # geniş ekran: çiçeksiz tek geniş kırpım
TWINE_SAG_X = (0.25, 0.5, 0.75)
CLOSURE_SRC = "closure_r2_v3.png"   # GM07 R3 (G098); closure.png yalnız bant hizası referansı
BANT_X = (100, 900)                 # bant kayması bu sütunlarda ölçülür (fiyonk/buğday dışı, kurdelenin düz bandı)
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


def bant_kaymasi(ref: Image.Image, yeni: Image.Image) -> int:
    """Sarılı kurdelenin düz bandı (BANT_X sütunlarında alfa > 200 satırların ortası) yeni parçada referansa göre kaç
    px aşağıda/yukarıda → dikey yerleşim farkı (− = yukarı taşı). İki sütun ±2 px içinde aynı kaymayı vermeli."""
    def orta(im, x):
        r = np.flatnonzero(np.asarray(im)[:, x, 3] > 200)
        return (r.min() + r.max()) / 2
    dys = [orta(ref, x) - orta(yeni, x) for x in BANT_X]
    if max(dys) - min(dys) > 2:
        sys.exit(f"kapanış bandı eğik/kayık: sütun kaymaları {dys}")
    return int(round(sum(dys) / len(dys)))


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
    """(tema_build.yesil_gorunur sayısı, #00FF00 benzeri parlak kroma yeşili sayısı). tema_build'in ölçütü bu tasarımın
    çam iğnelerini de sayıyor; gerçek pencere kalıntısı parlak (opak #00FF00 ≈ (5, 242, 2)) → ek şart G ≥ 190 ve yeşil
    fazlası ≥ 60. Yapı ikinciyle durur; ilki manifest'e "yaprak" olarak yazılır."""
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



def dilimler(fz, kenar_bosluk=(8.0, 92.0), min_gen: float = 80.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın bütün genişliğinde süs yok (açıklık ≥ min_gen;
    yalnız ince altın çerçeve çizgisi). En uzun kesintisiz düz bant gerilir. (t, b)."""
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



def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, en koyu gri, en renkli piksel). Kırpım kümesiz olmalı: koyu dal (min_lum) ve renkli meyve/iğne
    (doygunluk) ikisi de denetlenir."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.30)
    a = np.asarray(ph.convert("RGB")).astype(np.float64)
    sat = a.max(-1) - a.min(-1)
    return ph, int(np.asarray(ph.convert("L")).min()), round(float(np.percentile(sat, 99.9)), 1)




# ============================================================================= kesimler (bu tasarım)

def kose_tamamla(flap: Image.Image, ec: Image.Image, mentese: int, sol=(74, 117, 844.0, 93.0), sag_sinir: int = 952):
    """kapak_kes("egri") çıktısını tamamlar: sol alt yuvarlak köşe (kapak kenarı x = sol[0], eğrinin başladığı sütun
    sol[1], elips merkezi y sol[2], dikey yarıçap sol[3]) çeyrek elipsle; kapağın yan kenarlarının dışı kapak değil.
    Döner: (kapak RGBA tam tuval, kenar dizisi, bilgi)."""
    W, H = ec.size
    fa = np.zeros((H, W))
    k = np.asarray(flap)[..., 3].astype(np.float64)
    fa[:k.shape[0], :k.shape[1]] = k
    kenar = np.array([float(np.flatnonzero(fa[:, x] > 0).max()) if fa[:, x].any() else float(mentese) for x in range(W)])
    xs, xe, yc, ry = sol
    rx = xe - xs
    for x in range(xs, xe):
        t = (xe - x) / rx
        kenar[x] = yc + ry * np.sqrt(max(0.0, 1 - t * t))
    kenar[:xs] = mentese
    kenar[sag_sinir:] = mentese
    yy = np.arange(H)[:, None]
    m = np.clip(kenar[None, :] - yy + 0.5, 0, 1)
    a = np.asarray(ec).astype(np.float64).copy()
    a[..., 3] *= m
    out = Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA")
    return out, kenar, {"left_corner": {"side_x": xs, "curve_from_x": xe, "center_y": yc, "rx": rx, "ry": ry,
                                        "note": "quarter ellipse fitted to the measured edge drop (x 80–116, ≤ 2 px)"},
                        "flap_cols": [xs, sag_sinir]}


def cep_kraft(eo: Image.Image, mentese: int, tol: int = 6, deckle: int = 9, orta=(220, 840)):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Her sütunda gövdenin altından (alt kenar − 4) yukarı:
    kraft (lum < 190, G − B < 64, R − G > 30) sürer; `tol` satır üst üste kraft dışı (kareli astar: hardal G − B ≥ 64 ya
    da krem lum ≥ 190) görülünce kenar = son kraft satırı; üstündeki açık yırtık kenar şeridi (lum ≥ 185, kraft tonu,
    ≤ `deckle` px) cebe dahil. Ortadaki sütunlardan (`orta`) aykırısız doğru → düz kenar (yan kanatlar gövdede)."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    lum = a[..., :3] @ LUM
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    kraft = op & (lum < 190) & (G - B < 64) & (R - G > 30)
    serit = op & (lum >= 185) & (R - G >= 36) & (R - G <= 62) & (G - B >= 38) & (G - B <= 62)
    ham = {}
    for x in range(orta[0], orta[1] + 1):
        y = int(np.flatnonzero(op[:, x]).max()) - 4
        kac = 0
        while y > mentese:
            if kraft[y, x]:
                kac = 0
            else:
                kac += 1
                if kac >= tol:
                    break
            y -= 1
        e = y + kac
        k = 0
        while k < deckle and serit[e - 1 - k, x]:
            k += 1
        ham[x] = e - k
    X = np.array(list(ham.keys()), float)
    Y = np.array(list(ham.values()), float)
    keep = np.ones(len(X), bool)
    for _ in range(4):
        p = np.polyfit(X[keep], Y[keep], 1)
        r = Y - np.polyval(p, X)
        sd = max(1.0, float(np.std(r[keep])))
        keep = np.abs(r) <= 2.5 * sd
    kenar = np.polyval(p, np.arange(W)) - 1.0           # 1 px yukarı: yırtık kenarın açık şeridi cepte kalsın
    kenar = np.maximum(kenar, mentese)
    yy = np.arange(H)[:, None]
    m_ = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    out = a.copy()
    out[..., 3] *= m_
    bilgi = {"method": "renk", "detector": "kraft scan from the bottom (lum < 190, G − B < 64, R − G > 30) → 6 liner rows; "
                                           "deckle strip ≤ 9 px kept; straight line fitted over x %d–%d" % orta,
             "line": [round(float(p[0]), 5), round(float(p[1]), 2)], "points": int(keep.sum()), "outliers": int((~keep).sum()),
             "residual_sd": round(float(np.std(r[keep])), 2),
             "edge_at": {"x220": round(float(kenar[220]), 1), "mid": round(float(kenar[W // 2]), 1), "x840": round(float(kenar[840]), 1)},
             "side_wings": "kept in env_body (outside the card's path)", "warnings": []}
    if bilgi["residual_sd"] > 4:
        bilgi["warnings"].append(f"cep kenarı düz değil (sd {bilgi['residual_sd']} px)")
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def ip_sarkma(tw: Image.Image):
    """twine_line (alfa kutusuna kırpılmış): genişliğin %25/%50/%75'inde ipin orta çizgisi (yükseklik %) + uçlar."""
    al = np.asarray(tw)[..., 3]
    H, W = al.shape
    def orta(x):
        r = np.flatnonzero(al[:, min(W - 1, max(0, x))] > 128)
        return round(100 * float(r.mean()) / H, 2) if len(r) else None
    return {"ends_pct": [orta(6), orta(W - 7)], "at_pct": {str(f): orta(int(W * f)) for f in TWINE_SAG_X},
            "thickness_pct": round(100 * float(np.median([(al[:, x] > 128).sum() for x in range(W // 4, 3 * W // 4)])) / H, 2)}


# ============================================================================= zemin

def tarla_zemini(bg: Image.Image):
    """Telefon zemini: iki çiçeksiz bg_page kırpımı üst üste (FIELD_BLEND px yumuşak geçiş). RGB."""
    ust = bg.crop(FIELD_TOP)
    alt = bg.crop(FIELD_BOTTOM)
    alt = alt.resize((ust.width, round(alt.height * ust.width / alt.width)), Image.LANCZOS)
    w = ust.width
    H = ust.height + alt.height - FIELD_BLEND
    out = Image.new("RGB", (w, H))
    out.paste(alt, (0, ust.height - FIELD_BLEND))
    m = np.ones((ust.height, w))
    ramp = np.linspace(1, 0, FIELD_BLEND)
    ramp = ramp * ramp * (3 - 2 * ramp)
    m[-FIELD_BLEND:] = ramp[:, None]
    out.paste(ust, (0, 0), Image.fromarray((m * 255).astype(np.uint8), "L"))
    return out


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="srb-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (sunflower-rustic-barn); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
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

    flap_k, kb = tb.kapak_kes(ec, "egri")
    uyar("env_cflap", kb)
    if kb.get("method") != "renk":
        sys.exit(f"kapak kesimi geometrik yedeğe düştü: {kb.get('warnings')} — önizlemeye bak (--onizleme)")
    mentese = int(kb["hinge_row"])
    flap, kapak_kenar, kose = kose_tamamla(flap_k, ec, mentese)
    kb["completed"] = kose
    pocket, cep, cep_kenar = cep_kraft(eo, mentese)
    uyar("env_pocket", cep)
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

    # ------------------------------------------------------------------ kapanış (sarılı kurdele, 1:1 tuval)
    cl_raw = Image.open(PARTS / CLOSURE_SRC).convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    if cl.size != ec.size:
        sys.exit(f"{CLOSURE_SRC} tuvali {cl.size} ≠ envelope_closed {ec.size} (sarılı kapanış 1:1 olmalı)")
    dy = bant_kaymasi(Image.open(PARTS / "closure.png").convert("RGBA"), cl_raw)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    ck = [ck[0], ck[1] + dy, ck[2], ck[3] + dy]   # yerleşim: tuvalde dy kadar (görüntü değişmez)
    closure_box = list(map(float, ck))
    yerinde = Image.new("RGBA", cl_raw.size)
    yerinde.paste(cl_raw, (0, dy))                 # yalnız hiza ölçümü için (yazılmaz)
    clh = tb.kapanis_hiza(ec_raw, yerinde)
    # fiyonk düğümü: ayçiçeğinin koyu kahve göbeği (kurdelenin hardal karelerinde yok) — dönme/gevşeme odağı
    ca = np.asarray(cl_crop).astype(np.float64)
    gobek = (ca[..., 3] > 200) & (ca[..., 0] < 130) & (ca[..., 1] < 90) & (ca[..., 2] < 60)
    ys_, xs_ = np.nonzero(gobek)
    knot = [round(100 * float(np.median(xs_)) / cl_crop.width, 2), round(100 * float(np.median(ys_)) / cl_crop.height, 2)]

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
    out_top = kose_kenar - POCKET_BELOW * card_h - card_h
    front_top = out_top + FRONT_DROP * card_h
    card_box_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    ob_box = alfa_kutu(eo, esik=1)
    cb_box = alfa_kutu(ec, esik=1)
    fr_w, fr_h = card_w * FRONT_SCALE, card_h * FRONT_SCALE
    front_box = [card_x - (fr_w - card_w) / 2, front_top - (fr_h - card_h) / 2,
                 card_x + card_w + (fr_w - card_w) / 2, front_top + card_h + (fr_h - card_h) / 2]
    # kurdele zarfın sütunlarında kırpılır (.closure-clip = envelope_x_pct): o sütunların dışına taşan uç (GM07 R3'te
    # sağda ~8 px) sahne kutusunu genişletmez
    X0 = min(cb_box[0], ob_box[0], max(closure_box[0], cb_box[0]), front_box[0])
    X1 = max(cb_box[2], ob_box[2], min(closure_box[2], cb_box[2]), front_box[2])
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
    # RSVP kartının tabanındaki kurdele (W1.5) eski spreysiz closure.png'den kalır: GM07 R3'ün buğday spreyi kurdeleyi kart
    # genişliğinde ~17cqw uzatıyor → 390×844'te ya imzanın üstüne biniyor ya da ilk ekranın altına itilip kartta boşluk
    # bırakıyor (G098 denemesi). Zarfta ve teşekkür kartında yeni kapanış.
    eski, temizlik["card_ribbon"] = hale_temizle(Image.open(PARTS / "closure.png").convert("RGBA"), sert=False)
    webp(eski.crop(alfa_kutu(eski)), "card_ribbon", WIDTHS["closure"])
    manifest["card_ribbon"]["source"] = "parts/closure.png"
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
    stage["envelope_x_pct"] = [round(100 * (k_x0 - X0) / SW, 3), round(100 * (k_x1 - X0) / SW, 3)]
    stage["cuts"] = {"cflap": kb, "pocket": cep}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak)}
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "1:1 canvas overlay (wrapped ribbon drawn on the envelope's canvas, docs/11 §7.1 sarılı)",
        "anchor_px": [round((ck[0] + ck[2]) / 2, 1), round((ck[1] + ck[3]) / 2, 1)], "canvas_box": ck,
        "center_pct": [round(katman["closure"][0] + katman["closure"][2] / 2, 3), round(katman["closure"][1] + katman["closure"][3] / 2, 3)],
        "width_pct": katman["closure"][2], "knot_pct_of_closure": knot, "ends_vs_envelope": clh,
        "measured_from": f"parts/{CLOSURE_SRC} on the envelope_closed canvas (no comp scaling: wrapped closure)",
        "source": f"parts/{CLOSURE_SRC}", "placement_dy_px": dy,
        "placement_note": "GM07 R3 (G098): ham imagegen; bant parts/closure.png'ye göre ölçülen dy kadar kaydırılarak "
                          "yerleştirildi (yalnız konum, piksel değişmedi)",
        "carried_by_flap": False,
        "motion": "the bow tugs loose (about the sunflower knot), then the ribbon slides off along its band to the right, "
                  "turning behind the envelope's right edge (clip) — MOTION.envelope.tug/closure",
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = hale_temizle(im, sert=True)
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
    manifest["photo_slots"] = slots
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.8, .86))

    # düz bant = kartın bütün genişliği süssüz (davet kartı: sol alt buket %44'te başlıyor, sağ üst ayçiçeği %20'ye iner →
    # %24–44; bilgi kartı: gingham bant + dal %22'ye iner, kâğıt %24–92)
    for nm, gen in (("invitation_card", 75.0), ("info_card", 80.0)):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        t, b = dilimler(fz, kenar_bosluk=(8.0, 94.0), min_gen=gen)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (dikey "
                                          "gerilir), alt dilim ::after — docs/11 §9; site.css --t/--b"}

    for nm in ("florals_tl", "florals_br", "divider"):
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm])
    for i in (1, 2, 3):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        im.thumbnail((200, 200), Image.LANCZOS)
        webp(im, f"accent_{i}", [im.width])
    # story ipi (ek parça)
    tw, temizlik["twine_line"] = hale_temizle(Image.open(prep / "twine_line.png"), sert=False)
    tw = tw.crop(alfa_kutu(tw))
    webp(tw, "twine_line", WIDTHS["twine_line"])
    manifest["twine_line"]["sag"] = ip_sarkma(tw)

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    field = tarla_zemini(bg)
    webp(field, "field", [field.width // 2], 78)
    manifest["field"].update({"top_crop": list(FIELD_TOP), "bottom_crop": list(FIELD_BOTTOM), "blend_px": FIELD_BLEND})
    wide = bg.crop(FIELD_WIDE)
    webp(wide, "field_wide", [640], 78)
    manifest["field_wide"]["crop"] = list(FIELD_WIDE)
    # uzun sayfaların sonu: sol alttaki ahşap zemin (comp'ların alt kenarı)
    foot = bg.crop(FIELD_BOTTOM)
    webp(foot, "wood_foot", [foot.width], 76)
    manifest["wood_foot"]["crop"] = list(FIELD_BOTTOM)
    # ahşap (ek parça barnwood): masa (yatay tahtalar) ve story duvarı (90°: comp W1.3'ün dikey tahtaları)
    bw = Image.open(PARTS / "barnwood.png").convert("RGB")
    webp(bw, "barnwood", [480, 800], 76)
    wall = bw.rotate(90, expand=True)
    webp(wall, "barnwall", [640, 1024], 74)
    manifest["barnwall"]["note"] = "barnwood.png rotated 90° (vertical planks of W1.3); no other change"
    # uzun sayfa zemini: bg_tile, bg_page'in sakin orta kreminin ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((400, 600, 800, 900))).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    fa_ = np.asarray(field).reshape(-1, 3).astype(np.float64)
    manifest["field"]["tone_bottom"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in fa_[-field.width * 40:].mean(0))

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
    # favicon: kurdelenin fiyonk + ayçiçeği bölgesi (bant uçları kare ikonu inceltirdi)
    fx0 = int(cl_crop.width * .30)
    fy = cl_crop.crop((fx0, 0, cl_crop.width - fx0, cl_crop.height))
    ikon, ikon_bilgi = tb.ikon(fy, 180)
    ikon.save(out / "favicon.png", optimize=True)
    ikon_bilgi.update({"source": "closure (bow + sunflower, middle 40 %)", "file": "favicon.png",
                       "bytes": (out / "favicon.png").stat().st_size})
    manifest["favicon"] = ikon_bilgi

    # ------------------------------------------------------------------ hiza (ham GPT dosyaları, Kaydet tuvali)
    olcu = tb.kaydet_olculeri(COL)
    hz = tb.hiza_olc(ec_raw, eo_raw, "kapak", olcu.get("envelope_closed"), olcu.get("envelope_open"), kapanis=yerinde,
                     kapanis_tuval=olcu.get("closure"))
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
                                          "note": "tema_build.yesil_gorunur yaprak yeşilini de sayar; parlak kroma "
                                                  "şartı (G ≥ 190, fazla ≥ 60) ile 0 — kroma_yesil()"},
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, env_flap, env_body, pocket, cl_crop, katman, stage, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} (cflap içinde %{stage['hinge_in_cflap_pct']})")
    print(f"kart yolu {stage['card_path']}")
    print(f"kapalı nesne {stage['closed_obj']} · zarf x {stage['envelope_x_pct']}")
    print(f"katmanlar {katman}")
    print(f"cep {cep['edge_at']} doğru {cep['line']} sd {cep['residual_sd']} · düğüm {knot}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card", "card_small", "frame_portrait", "frame_landscape", "twine_line", "florals_tl", "florals_br", "divider"):
        m = manifest[nm]
        print(f"{nm} src {m['src_size']} oran {m['ratio']}" + (f" dilimler {m['slices']['top_end_pct']}–{m['slices']['bottom_start_pct']}" if 'slices' in m else ""))
    print(f"ip sarkması {manifest['twine_line']['sag']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · "
          f"sayfa rengi {manifest['page_color']} · alt {manifest['field']['tone_bottom']}")
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
    sheet = sheet.crop((0, 420, W * 4, 1360))
    sheet.thumbnail((2400, 1000))
    sheet.save(oniz / "cuts_envelope.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    zemin = (246, 236, 214, 255)

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
    # compare_closure: tema (kapalı sahne) | comp W1.1 zarf bölgesi (zarf genişliğine ölçekli)
    comp = Image.open(COMPS / "web_1_envelope.png").convert("RGB")
    ca = np.asarray(comp).astype(np.float64)
    # comp'taki kraft zarf: kraft tonlu sütunlar (y 560–860 bandında), üst kenar = kraft oranı > .5 olan ilk satır
    kraft = (ca[..., 0] - ca[..., 2] > 40) & (ca[..., 0] < 215) & (ca[..., 1] - ca[..., 2] < 60)
    xs = np.flatnonzero(kraft[560:860].mean(0) > .5)
    cx0, cx1 = int(xs.min()), int(xs.max())
    rows = np.flatnonzero(kraft[:, cx0:cx1].mean(1) > .5)
    cy0 = int(rows.min())
    cmp_crop = comp.crop((cx0 - 30, cy0 - 40, cx1 + 30, min(comp.height, cy0 + 600)))
    ox, oy, ow, oh = stage["closed_obj"]["box_pct"]
    env_px = ow / 100 * 900
    olcek = (cx1 - cx0) / env_px
    t0 = kapali.resize((round(900 * olcek), round(kapali.height * olcek)), Image.LANCZOS)
    ex, ey = ox / 100 * 900 * olcek, oy / 100 * kapali.height * olcek
    t = t0.crop((round(ex - 30), round(ey - 40), round(ex - 30) + cmp_crop.width, round(ey - 40) + cmp_crop.height))
    out_im = Image.new("RGB", (cmp_crop.width * 2 + 16, cmp_crop.height), (255, 255, 255))
    out_im.paste(t.convert("RGB"), (0, 0))
    out_im.paste(cmp_crop, (cmp_crop.width + 16, 0))
    out_im.save(oniz / "compare_closure.jpg", quality=88)
    print(f"comp zarf x {cx0}–{cx1} (genişlik {cx1 - cx0}), üst {cy0}")


if __name__ == "__main__":
    main()
