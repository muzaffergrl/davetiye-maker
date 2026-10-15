#!/usr/bin/env python3
"""Winter Evergreen teması (tasarım 08, G408) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/winter-evergreen/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/08_Winter_Evergreen/assets/gpt/parts/ (G208, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" doldurma, windows.json); tema klasörüne, img_src/'ye,
assets/'e yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf; kapanış kapakla TAŞINMAZ: "the pine-and-berry bundle loosens and
slides away"):
  * Kapak kesimi: tema_build.kapak_kes("v") — orman yeşili V kapağın serbest kenarı karlı beyaz yırtık (deckle) şerit;
    en güçlü parlaklık düşüşü beyaz şeritten yeşil gövdeye geçişte, yani şerit kapakta kalır (önizleme: cuts_envelope.jpg).
  * Ön cep ALTTAN TARAMA: açık zarfın ön yüzü iki yan kanat + yuvarlak omuzlu alt kanat; kenar iki doğrudan oluşmuyor
    (tema_build.cep_kes("v") düz V uydurdu, omuzların iki yanında astar şeritleri cebe giriyordu). Burada her sütunda
    gövdenin altından yukarı çıkılır: cep yeşili (koyu, B ≥ R − 8, G > R) bitip 6 satır üst üste astar (açık zemin, zeytin
    yeşili dal, kırmızı meyve, altın kar tanesi) görülen yer kenardır; tek sütunluk sıçramalar (kat gölgesi, parlama) ve
    uçlar 9 sütunluk medyanla düzeltilir. Astarın zeytin yeşili dalları B < R olduğu için cebe girmez.
  * Hiza: kit_check geçiyor (sol 0,00 · sağ 0,00 · alt +0,13 %) — açık katmanlar kapalınınkiyle aynı tuval konumunda,
    dönüşüm yok (manifest.align). Menteşe satırı = kapalı zarfın üst kenarı (kapak_kes hinge_row); açık kapak/gövde aynı
    satırdan ayrılır.
  * Kapanış (closure.png = çam dalı + sedir dalı + üç kırmızı meyve + kırmızı kadife fiyonk, TEK parça) kare tuvalde
    büyük çizildi; yeri kesim geometrisine bağlı: çapa = V kapağın ucu (kapak_kes tip), W1.1 comp'ta ölçülen demet
    genişliği / zarf genişliği ve demet merkezinin uca göre kayması ile (manifest.closure; COMP).
  * Buğu katmanı (frost_overlay, ek parça): story pencerelerinin fotoğrafının üstünde, pencere kutusuna `cover`; site
    `wipe` girişiyle ortadan dışa silinir (köşelerde kırağı kalır). Yalnız alfa kutusuna kırpılır (yarı saydam olduğu
    için hâle temizliği yapılmaz).
  * Telefon zemini (`snow`): bg_page 2:3, telefonda (en/boy ≈ 0,46) cover ile köşe kümeleri kesilirdi. Zemin bg_page'in
    iki kümesiz bölgesinden kurulur (karlı sis üst kırpım + sol alttaki kar yığını, 110 px yumuşak geçiş); çam kümeleri
    ayrı katman (decor_tl / decor_br), ekranda bütün. Geniş ekran: `snow_wide` (tek kümesiz geniş kırpım).
  * GPT kusurları: dış hatta yarı saydam hâle temizliği (alfa < 12 sıfır, çekirdekten uzak piksel silinir, kenar rengi
    komşu opak renge), WebP kenar saçağı için renk taşıma (mediterranean-lemon'un aynı yöntemi); yatay çerçeve
    penceresindeki koyu leke (G208 açık kusuru) parts_prep leke dolgusuyla tam şeffaf (foto_alani her WebP'de denetler).
    Yeşil denetimi: tema_build.yesil_gorunur çam iğnelerini de "görünür #00FF00" sayıyor → kroma_yesil(): parlak kroma
    yeşili (G ≥ 190, fazla ≥ 60) her WebP'de 0; yaprak sayıları manifest.checks.green_check'te.

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
COL = ROOT / "collections/08_Winter_Evergreen"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [240, 480], "card_small": [320, 640], "invitation_card": [480, 883],
    "info_card": [480, 856], "frame_portrait": [320, 640, 857], "frame_landscape": [480, 960], "decor_tl": [360, 540, 720],
    "decor_br": [360, 540, 720], "divider": [300], "frost_overlay": [320, 640],
}
# divider: the W1 pine sprig between hairlines is ≤ 60 px wide on every page (DPR 3 → 180 px): one 300 px file
# yoğun çam iğnesi ve kırağı dokusu WebP'de ağır, ağırlığın çoğu alfa kanalında: kümelerde alfa kalitesi 60 (suluboya
# yumuşak kenar; q 80 / alfa 90'da 720 px 187 KB idi — 390 px telefonda DPR 3 ilk görünümde 720 seçilir, docs/11 §6 ≥ 150 KB
# gerekçe ister), buğuda 70; diğerleri --q (80) / alfa 90
QUALITY = {"decor_tl": 76, "decor_br": 76, "frost_overlay": 72, "closure": 78}
ALPHA_Q = {"decor_tl": 60, "decor_br": 60, "frost_overlay": 70}
CARD_W_OF_ENV = 0.54       # kart genişliği / zarf genişliği (kart zarfa sığar; W1.2 kartı zarftan dar)
CARD_PHOTO_ABOVE = 0.06    # cepte bekleyen kart: foto penceresinin en çok bu kadarı cep kenarının üstünde
POCKET_BELOW = 0.04        # out: kartın alt köşeleri cebin kenarını kart boyunun bu kadarı aşar (docs/11 §7.1)
FRONT_DROP, FRONT_SCALE = 0.03, 1.04
# palet (palette.json evergreen): ivory #FAFAF6 — yer tutucu tonu
IVORY = (250, 250, 246)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: kümesiz, karlı sis)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (300, 560, 720, 1000)),
    "story_1": ("portrait", [320, 640], (250, 540, 560, 990)),
    "story_2": ("portrait", [320, 640], (430, 560, 740, 1010)),
    "story_3": ("portrait", [320, 640], (120, 600, 430, 1050)),
    "venue": ("landscape", [480, 960], (60, 600, 760, 930)),
}
PH_MIN_LUM = 175   # yer tutucuda en koyu piksel en az bu: kümeden dal/meyve kırpıma girmez (çıkış ≠ 0)
PH_MAX_SAT = 26    # ... ve renkli dekor yok (max − min kanal, %99,9)
# telefon zemini (bg_page 1024×1536 kaynak pikseli; 20 px ızgarayla ölçüldü: sol üst küme y < 520'de x ≤ 220 … 720,
# sağ alt küme y ≥ 820'de x ≥ 880, y ≥ 1040'ta x ≥ 760, y ≥ 1300'de x ≥ 440)
SNOW_TOP = (290, 330, 710, 1010)     # karlı sis, kar tanesi bokehi
SNOW_BOTTOM = (0, 1060, 420, 1536)   # sol alttaki kar yığını ve kırağı (comp'ların sol alt köşesi)
SNOW_BLEND = 110                     # px — iki kırpımın yumuşak geçiş bandı
SNOW_WIDE = (0, 520, 800, 1040)      # geniş ekran: kümesiz tek geniş kırpım (en/boy 1,54)
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536): zarfın yeşil gövdesi x 150–875 (genişlik 725); karlı beyaz
# yırtık kenarın her sütundaki en alt pikseli → V doğruları y = 0.7714x + 553.4 ve y = −0.7802x + 1350.5, ucu
# (513.7, 949.7). Demetin kırmızı kurdele kuyrukları x 398–634, alt uç y 985 ↔ closure.png'de x 170–1087, alt uç 1184
# (ölçek 0,2574) → demetin alfa kutusu comp'ta x 397,5–651,1, y 701,4–985: genişlik / zarf = 0,3497, merkez uçtan
# (+0,0146, −0,1469) × zarf genişliği (yatay +10,6 px: GPT'nin demeti hafif sağa eğik; ölçüldüğü gibi alındı).
COMP = {"env_w": 725.0, "tip": (513.7, 949.7), "closure_w_over_env": 0.3497, "closure_c_minus_tip": (0.0146, -0.1469)}


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


# ============================================================================= kesimler (bu tasarım)

def cep_alttan(eo: Image.Image, mentese: int):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Her sütunda gövdenin altından (alt kenar − 4) yukarı:
    cep yeşili (lum < 165, B ≥ R − 8, G > R; açık ışıkta sol kanat da) sürer; 6 satır üst üste cep dışı (astar zemini,
    zeytin yeşili dal B < R, kırmızı meyve, altın kar tanesi) görülünce kenar = son cep satırı (6: kat çizgisindeki
    parlak şerit 3–5 px, astar uzun). Ham kenar 9 sütun medyanıyla düzeltilir (tek sütunluk sıçrama); en dış 4 sütun
    komşudan."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    lum = a[..., :3] @ LUM
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    cep = op & (lum < 165) & (B >= R - 8) & (G > R)
    # 6 satır: yan kanadın kat çizgisindeki parlak şerit (sol üst ışık) 3–5 px; astar ise uzun
    cols = np.flatnonzero(op[mentese + 20:].any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    ham = np.full(W, np.nan)
    for x in range(x0, x1 + 1):
        rows = np.flatnonzero(op[:, x])
        y = int(rows.max()) - 4
        kac = 0
        while y > mentese - 30:
            if cep[y, x]:
                kac = 0
            else:
                kac += 1
                if kac >= 6:
                    break
            y -= 1
        ham[x] = y + kac
    kenar = ham.copy()
    for x in range(x0 + 4, x1 - 3):
        kenar[x] = np.median(ham[x - 4:x + 5])
    sicrama = int((np.abs(ham[x0 + 4:x1 - 3] - kenar[x0 + 4:x1 - 3]) > 3).sum())
    # uçlar: en dış 4 sütunda kenar gölgesi taramayı erken kesiyor → 5. sütunun değeri
    kenar[x0:x0 + 4] = kenar[x0 + 4]
    kenar[x1 - 3:x1 + 1] = kenar[x1 - 4]
    kenar[:x0] = kenar[x0]
    kenar[x1 + 1:] = kenar[x1]
    kenar = np.maximum(kenar, mentese)
    yy = np.arange(H)[:, None]
    m_ = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    out = a.copy()
    out[..., 3] *= m_
    # cebin içinde kalan astar pikseli (kenarın 2 px altından itibaren) — denetim
    astar_ici = 0
    for x in range(x0 + 14, x1 - 13, 3):
        yb = int(np.flatnonzero(op[:, x]).max()) - 4
        y0_ = int(np.ceil(kenar[x])) + 2
        if y0_ < yb:
            astar_ici += int((~cep[y0_:yb, x] & op[y0_:yb, x] & (lum[y0_:yb, x] > 175)).sum())
    xm = int(np.nanargmax(kenar[x0:x1 + 1])) + x0
    bilgi = {"method": "renk", "detector": "alttan tarama: cep yeşili (lum < 165, B ≥ R − 8, G > R) → 6 satır astar",
             "body": [x0, mentese, x1, int(np.flatnonzero(op.any(1)).max())], "tip": [xm, round(float(kenar[xm]), 1)],
             "edge_at": {"x0": round(float(kenar[x0]), 1), "x0+60": round(float(kenar[x0 + 60]), 1),
                         "mid": round(float(kenar[(x0 + x1) // 2]), 1), "x1-60": round(float(kenar[x1 - 60]), 1),
                         "x1": round(float(kenar[x1]), 1)},
             "single_column_spikes_fixed": sicrama, "light_liner_px_inside_sampled": astar_ici, "warnings": []}
    if astar_ici > 200:
        bilgi["warnings"].append(f"cebin içinde açık astar pikseli: {astar_ici}")
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def yesil_genislik(rgba: np.ndarray, satir: int):
    """Zarfın orman yeşili gövdesinin bir satırdaki uçları (comp ölçümüyle aynı ölçüt)."""
    a = rgba.astype(np.float64)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    gr = (G > R + 8) & (G > B) & (G < 140) & (R < 110)
    if a.shape[-1] == 4:
        gr &= a[..., 3] > 200
    cols = np.flatnonzero(gr[satir])
    return int(cols.min()), int(cols.max()) + 1


# ============================================================================= kart dilimleri (docs/11 §9)

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


# ============================================================================= zemin

def kar_zemini(bg: Image.Image):
    """Telefon zemini: iki kümesiz bg_page kırpımı üst üste (SNOW_BLEND px yumuşak geçiş). RGB."""
    ust = bg.crop(SNOW_TOP)
    alt = bg.crop(SNOW_BOTTOM)
    if alt.width != ust.width:
        alt = alt.resize((ust.width, round(alt.height * ust.width / alt.width)), Image.LANCZOS)
    w = ust.width
    H = ust.height + alt.height - SNOW_BLEND
    out = Image.new("RGB", (w, H))
    out.paste(alt, (0, ust.height - SNOW_BLEND))
    m = np.ones((ust.height, w))
    ramp = np.linspace(1, 0, SNOW_BLEND)
    ramp = ramp * ramp * (3 - 2 * ramp)                      # smoothstep
    m[-SNOW_BLEND:] = ramp[:, None]
    out.paste(ust, (0, 0), Image.fromarray((m * 255).astype(np.uint8), "L"))
    return out


def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, en koyu gri, en renkli piksel). Kırpım kümesiz olmalı: koyu dal (min_lum) ve renkli meyve/iğne
    (doygunluk) ikisi de denetlenir."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.30)
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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="we-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (winter-evergreen); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
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
    pocket, cep, cep_kenar = cep_alttan(eo, mentese)
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

    # ------------------------------------------------------------------ kapanış (çam + sedir + meyveler + fiyonk)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    g_x0, g_x1 = yesil_genislik(eca, (k_y0 + k_alt) // 2 + 120)      # comp'la aynı ölçüt (yeşil gövde)
    env_w = g_x1 - g_x0
    tip = kb["tip"]
    c_w = COMP["closure_w_over_env"] * env_w
    s = c_w / (ck[2] - ck[0])
    c_h = (ck[3] - ck[1]) * s
    hedef = (tip[0] + COMP["closure_c_minus_tip"][0] * env_w, tip[1] + COMP["closure_c_minus_tip"][1] * env_w)
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
    # kart yukarıda kalır (yukarı → aşağı → yukarı yok): out = alt köşeleri cebin kenarını kart boyunun %4'ü kadar aşmış;
    # front = aynı yerde öne gelir (%3 aşağı + × 1.04, büyüyen gölge) → home kartına (ekranın üstü) yukarı uçar
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
        "anchor": "V flap tip (kapak_kes tip: intersection of the V lines along the foot of the snowy deckled edge)",
        "anchor_px": [round(tip[0], 1), round(tip[1], 1)], "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "env_green_w_px": env_w,
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": COMP["env_w"], "closure_w_over_env": COMP["closure_w_over_env"],
                 "closure_center_minus_tip_over_env_w": list(COMP["closure_c_minus_tip"])},
        "carried_by_flap": False,
        "motion": "loosens, then slides away down the envelope front (MOTION.envelope.closure) before the flap lifts",
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

    # düz bant = kartın bütün genişliği süssüz (davet kartında sol alt dal %76'da başlıyor: açıklık ≥ %95 ister; bilgi
    # kartının altın çerçevesi serbest bölgeyi %5,1–94,6'ya daraltıyor: ≥ %85)
    for nm, gen in (("invitation_card", 95.0), ("info_card", 85.0)):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        t, b = dilimler(fz, min_gen=gen)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (dikey "
                                          "gerilir), alt dilim ::after — docs/11 §9; site.css --t/--b"}

    for nm in ("decor_tl", "decor_br", "divider"):
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm])
    for i in (1, 2, 3):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        im.thumbnail((200, 200), Image.LANCZOS)
        webp(im, f"accent_{i}", [im.width])
    fr = Image.open(prep / "frost_overlay.png").convert("RGBA")
    fr = fr.crop(alfa_kutu(fr, esik=24))
    webp(fr, "frost_overlay", WIDTHS["frost_overlay"])
    fa = np.asarray(fr)[..., 3].astype(np.float64)
    hh, ww = fa.shape
    manifest["frost_overlay"].update({
        "alpha_mean": round(float(fa.mean()), 1),
        "alpha_centre_mean": round(float(fa[int(hh * .35):int(hh * .65), int(ww * .35):int(ww * .65)].mean()), 1),
        "use": "story/home portrait windows: over the photo, under the frame; wiped from the centre (site.css wipe)"})

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    snow = kar_zemini(bg)
    webp(snow, "snow", [snow.width], 78)
    manifest["snow"].update({"top_crop": list(SNOW_TOP), "bottom_crop": list(SNOW_BOTTOM), "blend_px": SNOW_BLEND})
    wide = bg.crop(SNOW_WIDE)
    webp(wide, "snow_wide", [640], 78)
    manifest["snow_wide"]["crop"] = list(SNOW_WIDE)
    # uzun sayfaların sonu: sol alttaki kar yığını (comp'ların alt kenarı)
    foot = bg.crop(SNOW_BOTTOM)
    webp(foot, "snow_foot", [foot.width], 76)
    manifest["snow_foot"]["crop"] = list(SNOW_BOTTOM)
    # uzun sayfa zemini: bg_tile (dikişsiz kırağı lekeli sis), bg_page'in sakin orta sisinin ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((300, 600, 700, 900))).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    fa_ = np.asarray(foot).reshape(-1, 3).astype(np.float64)
    manifest["snow_foot"]["tone_bottom"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in fa_[-foot.width * 40:].mean(0))

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
                                          "note": "tema_build.yesil_gorunur çam iğnesi yeşilini de sayar; parlak kroma "
                                                  "şartı (G ≥ 190, fazla ≥ 60) ile 0 — kroma_yesil()"},
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
    print(f"cep {cep['edge_at']} sıçrama {cep['single_column_spikes_fixed']} astar {cep['light_liner_px_inside_sampled']}")
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
    sheet = sheet.crop((0, 180, W * 4, 1290))
    sheet.thumbnail((2400, 1000))
    sheet.save(oniz / "cuts_envelope.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    zemin = (238, 242, 241, 255)

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
    comp = Image.open(COMPS / "web_1_envelope.png").convert("RGB")
    cx0, cx1 = 150 - 40, 875 + 40
    cy0, cy1 = 560, 1110
    cmp_crop = comp.crop((cx0, cy0, cx1, cy1))
    ox, oy, ow, oh = stage["closed_obj"]["box_pct"]
    env_px = ow / 100 * 900
    olcek = (875 - 150) / env_px * (1.0)
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
