#!/usr/bin/env python3
"""Enchanted Forest Storybook teması (tasarım 13, G413) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir.
Teknik hazırlık (K21): kırpar, keser, maskeler, ölçekler, aynalar, bulanıklaştırır, kenar temizler; yeni şekil/dekor
çizmez.

  python3 platform/themes/enchanted-forest-storybook/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/13_Enchanted_Forest/assets/gpt/parts/ (G213, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri, windows.json); tema klasörüne, img_src/'ye, assets/'e yazılmaz (docs/11 §1,
§5.3). parts_prep'in ön cep kesimi (envelope_pocket_front.png, "geometrik V" uyarısı) kitap tipinde anlamsızdır, kullanılmaz
(docs/11 §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.5 — kitap):
  * Kesim: tema_build.kitap_kes — kapalı kitap = `cover` (sırt = alfa kutusunun sol kenarı, menteşe orada); açık kitapta
    oluk (sırt) kapalı sırtın ± %4'ünde en koyu sütun: solu `cover_in` (kapağın astarlı içi), sağı `page` (sağ yarı: ilk
    sayfa + altındaki sayfa kenarları + arka kapak kenarı).
  * Çevrilen sayfa (`leaf`): `page`'in yalnız krem yaprağı — oluktan sonra kremin başladığı sütundan sayfa yığınının ilk koyu
    çizgisine kadar, üst/alt kenar ilk/son krem satırı; köşeler görselin kendi alfasından (yuvarlak köşe, krem eşiği).
    Sayfa yığını ve arka kapak kenarı `page`'de kalır, yaprakla dönmez. Arka yüzü = aynı dosya, CSS `scaleX(-1)` (docs/11
    §7.5 "arka yüzü aynalı page"; §5.7 aynalama).
  * Hiza: kit_check geçiyor (sırt +0,23 · üst −0,10 · alt +0,29 · sağ +0,20 %) — dönüşüm yok (manifest.align).
  * Kapanış (closure.png = pirinç kitap tokası, menteşe silindiri sağda) kare tuvalde büyük çizildi; yeri kesim geometrisine
    bağlı: çapa = kapalı kapağın sağ kenarı, yarı yükseklik (docs/11 §7.1 kitap); W1.1 comp'ta ölçülen toka genişliği /
    kitap genişliği ve toka merkezinin çapaya göre kayması (COMP). Dönme ekseni = menteşe silindirinin ortası (alfa
    yüksekliği en büyük sütunlar).
  * Kart (card_small) ilk sayfanın üstünde düz yatar (yaprağın altında, sayfa çevrilince görünür), sonra kalkar
    (`lift`: ölçek + öteleme + büyüyen gölge) ve açık çift sayfanın ortasına öne gelir (`forward`); sahne kutusu bu yolu da
    kapsar (docs/11 §7.1).
  * Zemin (`mist`): bg_page 2:3 telefonda cover ile köşe kümelerini keserdi → bg_page'in kümesiz orta sis kırpımı; köşe
    kümeleri ayrı katman (decor_tl / decor_br), ekranda bütün. Geniş ekran (`mist_wide`): bütün genişlikte kümesiz bant.
  * Uzun kart (docs/11 §9): invitation_card ve info_card üst dilim + orta düz kâğıt + alt dilim. Orta bant GERİLMEZ:
    kartın düz kâğıt bandından bir parça + dikey aynası üst üste (`*_band`, aynalı ek yeri dikişsiz) `repeat-y` ile döşenir;
    lekeler uzamaz. Bandın düz olduğu serbest_bolge (free_zone) ile doğrulanır.
  * GPT kusurları: dış hatta yarı saydam hâle temizliği ve WebP kenar saçağı için renk taşıma (winter-evergreen /
    mediterranean-lemon'un yöntemi). Yeşil denetimi: tema_build.yesil_gorunur eğrelti/yosun yeşilini de sayıyor →
    kroma_yesil(): parlak kroma yeşili (G ≥ 190, fazla ≥ 60) her WebP'de 0.

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json. site.css'teki yüzdeler
manifest'ten; --onizleme DIR kesim önizlemeleri + compare_closure.jpg yazar (gözle denetim). Tema klasörü ≤ 3 MB.
Bağımlılık: Pillow + numpy.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/13_Enchanted_Forest"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "book_cover": [360, 640], "book_cover_in": [360, 640], "book_page": [360, 700], "book_leaf": [320, 622],
    "closure": [240, 480], "card_small": [320, 640], "invitation_card": [480, 860], "info_card": [480, 860],
    "frame_portrait": [320, 640], "frame_landscape": [480, 960], "decor_tl": [360, 540, 720], "decor_br": [360, 540, 720],
    "divider": [300],
}
# eğrelti/yosun dokusu WebP'de ağır, ağırlığın çoğu alfa kanalında: kümelerde alfa kalitesi 60 (suluboya yumuşak kenar)
# kitap kapağı (kabartma altın varak, kumaş dokusu) en ağır parça: q 68 ile 640 px < 150 KB (ilk görünüm, docs/11 §6);
# davet kartının çelengi q 70 ile 860 px < 200 KB (ekran altı)
QUALITY = {"decor_tl": 76, "decor_br": 76, "closure": 78, "book_cover": 68, "book_cover_in": 70, "invitation_card": 70}
ALPHA_Q = {"decor_tl": 60, "decor_br": 60}
CARD_W_OF_LEAF = 0.66        # kart genişliği / yaprak genişliği (kart sayfaya sığar; GPT: "slightly narrower")
LIFT_UP, LIFT_SCALE = 0.04, 1.08    # lift: kart sayfadan kalkar (boyunun %4'ü yukarı, × 1,08, gölge büyür)
FRONT_SCALE = 1.4            # forward: çift sayfanın ortasına, × 1,4 (açık kitabın yüksekliğini aşmaz)
# serbest_bolge renk eşiği: eskitilmiş kâğıdın lekeleri ve kenara doğru koyulaşması 28'de (03'ün düz kâğıdı) her satırı
# "süslü" sayıyor; boyalı dekor (sarmaşık, mantar, mürekkep çerçeve) kâğıttan > 80 uzak → 52 (docs/11 §5.4: eşik parametre)
FZ_ESIK = 52
# palet (palette.json forest-moss): ivory #F8F4E6 — yer tutucu tonu
IVORY = (248, 244, 230)
# telefon zemini: bg_page'in kümesiz orta sisi (20 px ızgara: sol üst küme x < 580 · y < 200, sarmaşıklar x < 250 ·
# y < 620, ateş böceği (380, 210); sağ alt küme y ≥ 1270'te x ≥ 680, y ≥ 990'da x ≥ 880; sağdaki ağaç gövdesi x ≥ 830)
MIST = (250, 250, 830, 1250)
# geniş ekran: bütün genişlikte kümesiz bant (sarmaşık uçları y < 630, eğrelti kıvrımı y ≥ 990; sağdaki ateş böceği resmin
# parçası) — aynalama denendi, 1280 px'te aynalı ek yerleri ağaç gölgelerinde simetrik "mürekkep lekesi" gösterdi
MIST_WIDE = (0, 630, 1024, 985)
# foto anahtarı → (pencere, çıktı genişlikleri, MIST'in içinden kırpım: ağaç gölgesi az, ateş böceği yok)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (330, 300, 760, 760)),
    "story_1": ("portrait", [320, 640], (300, 520, 640, 980)),
    "story_2": ("portrait", [320, 640], (420, 420, 780, 900)),
    "story_3": ("portrait", [320, 640], (340, 700, 700, 1180)),
    "venue": ("landscape", [480, 960], (280, 560, 820, 900)),
}
PH_MIN_LUM = 150   # yer tutucuda en koyu piksel en az bu (koyu dal/küme girmez; çıkış ≠ 0)
PH_MAX_SAT = 40    # ... ve renkli dekor yok (max − min kanal, %99,9)
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536): kitap (dış kenarlar, zeminden içe tarama) x 256–765 (genişlik
# 509), y 593–1217; sağ kenar yarı yükseklikte (765, 905). Pirinç toka: sol uç x 659 (koyu dış hat), menteşe silindiri sağ
# kenarı x 782, üst topuz y 837, alt topuz y 955 → kutu 123 × 118, merkez (720,5, 896). Genişlik / kitap = 0,2417; merkez
# çapadan (−0,0874, −0,0177) × kitap genişliği. closure.png'nin en/boy oranı (1,147) comp'takinden (1,04) geniş: genişlikle
# ölçeklenir (docs/11 §7.1 "kapanış genişliği / zarf genişliği"), boy comp'tan ~%10 kısa kalır (README sapma).
COMP = {"book_w": 509.0, "anchor": (765.0, 905.0), "closure_w_over_book": 0.2417, "closure_c_minus_anchor": (-0.0874, -0.0177)}


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (GPT hâlesi, saçak)

def hale_temizle(im: Image.Image, sert: bool, esik: int = 12, cekirdek: int = 96):
    """Dış hattaki yarı saydam hâleyi temizler (çizim yok). sert: kitap/kart/çerçeve gibi net kenarlı nesne.
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
    """(tema_build.yesil_gorunur sayısı, #00FF00 benzeri parlak kroma yeşili sayısı). tema_build'in ölçütü eğrelti ve yosun
    yeşilini de sayıyor; gerçek pencere kalıntısı parlak (opak #00FF00 ≈ (5, 242, 2)) → ek şart G ≥ 190 ve yeşil fazlası ≥ 60.
    Yapı ikinciyle durur; ilki manifest'e "yaprak" olarak yazılır."""
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


# ============================================================================= kitap: çevrilen yaprak

def yaprak_kes(page: Image.Image, sirt: float):
    """`page` (açık kitabın sırt sağı) → (yaprak RGBA tam tuval, bilgi). Yaprak = ilk sayfanın krem yüzü: her satırda
    oluktan sonra kremin başladığı sütun (sol), sayfa yığınının ilk koyu çizgisi (sağ: orta satırların sütun ortalamasında
    krem düzlükten ilk düşüş); üst/alt = orta sütunların ilk/son krem satırı. Köşeler: dikdörtgen içinde krem eşiğini
    (lum ≥ 150) geçen ve kenar bağlantılı olmayan pikseller (yuvarlak köşenin dışı = arka kapak/kenar düşer); lekeler
    (krem içindeki koyu benekler) kapatma ile doldurulur."""
    a = np.asarray(page).astype(np.float64)
    H, W = a.shape[:2]
    lum = a[..., :3] @ LUM
    op = a[..., 3] > 200
    xs = int(np.ceil(sirt))
    orta = slice(int(H * .25), int(H * .75))
    prof = np.where(op[orta], lum[orta], 0).mean(0)
    duz = float(np.median(prof[xs + 60:xs + 400]))
    sol = xs + int(np.argmax(prof[xs:xs + 60] >= duz - 12))
    sag_ara = np.flatnonzero(prof[xs + 300:] < duz - 40)
    if not len(sag_ara):
        raise SystemExit("yaprak: sayfa yığınının kenarı bulunamadı")
    sag = xs + 300 + int(sag_ara[0])
    cols = slice(sol + 40, sag - 40)
    cprof = np.where(op[:, cols], lum[:, cols], 0).mean(1)
    krem = np.flatnonzero(cprof >= duz - 30)
    ust, alt = int(krem[0]), int(krem[-1]) + 1
    m = np.zeros((H, W), bool)
    m[ust:alt, sol:sag] = True
    acik = (lum >= 150) & op
    # köşe dışı: dikdörtgenin içinde kalan koyu (arka kapak, sayfa kenarı) piksel; leke = küçük koyu benek (kapatma)
    dolu = genislet(acik, 3)
    dolu = ~genislet(~dolu, 3)
    m &= dolu
    out = a.copy()
    out[..., 3] = np.where(m, a[..., 3], 0)
    bilgi = {"box": [sol, ust, sag, alt], "paper_lum": round(duz, 1), "method": "renk",
             "detector": "krem düzlük (orta satırların sütun ortalaması) → sağda ilk ≥ 40 düşüş = sayfa yığını; üst/alt ilk/son krem satırı"}
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), bilgi


def mentese_sutunu(cl: Image.Image) -> float:
    """Toka (kırpılmış) → menteşe silindirinin orta sütunu (px): alfa yüksekliği en büyük sütunların (≥ %95) ortası."""
    al = np.asarray(cl)[..., 3] > 128
    h = al.sum(0)
    xs = np.flatnonzero(h >= 0.95 * h.max())
    return float((xs.min() + xs.max() + 1) / 2)


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(8.0, 95.0), min_gen: float = 80.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın bütün genişliğinde süs yok (açıklık ≥ min_gen;
    yalnız ince mürekkep çerçeve çizgisi). En uzun kesintisiz düz bant. (t, b)."""
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


def aynali_bant(im: Image.Image, t: float, b: float, pay: float = 0.08):
    """Kartın düz bandının ortasından (t..b'nin iç kısmı, `pay` kenarlardan içeri) bir parça + dikey aynası üst üste:
    `repeat-y` ile döşenince ek yerleri ayna simetrisi (dikişsiz), kâğıt lekeleri gerilmez. (RGBA, [y0, y1] kaynak px)."""
    H = im.height
    y0 = int(H * (t + (b - t) * pay) / 100)
    y1 = int(H * (b - (b - t) * pay) / 100)
    y1 = min(y1, y0 + int(0.30 * H))
    band = im.crop((0, y0, im.width, y1))
    per = Image.new("RGBA", (im.width, band.height * 2))
    per.paste(band, (0, 0))
    per.paste(band.transpose(Image.FLIP_TOP_BOTTOM), (0, band.height))
    return per, [y0, y1]


# ============================================================================= zemin

def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, en koyu gri, en renkli piksel). Kırpım kümesiz olmalı."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.34)
    a = np.asarray(ph.convert("RGB")).astype(np.float64)
    sat = a.max(-1) - a.min(-1)
    return ph, int(np.asarray(ph.convert("L")).min()), round(float(np.percentile(sat, 99.9)), 1)


def alfa_haritasi(im: Image.Image, n: int = 16) -> str:
    """Köşe kümesinin n × n doluluk haritası (hücrede ≥ %6 opak piksel = dolu) → 64 hex karakter (satır başına 4).
    site.js `decor` yazı kutularını buna göre denetler (küme hiçbir sis yazısının altında kalmaz)."""
    al = np.asarray(im)[..., 3] > 40
    H, W = al.shape
    satirlar = []
    for j in range(n):
        bits = 0
        for i in range(n):
            c = al[j * H // n:(j + 1) * H // n, i * W // n:(i + 1) * W // n]
            bits = (bits << 1) | int(c.mean() >= 0.06)
        satirlar.append(f"{bits:04x}")
    return "".join(satirlar)


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="efs-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (enchanted-forest-storybook); ölçüler px, kutular [x, y, w, h], box_pct "
                         "yüzde. stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q
    temizlik = {}

    def webp(im, name, widths, q_=None):
        webp_yaz(im, name, widths, q_ or QUALITY.get(name, q), manifest, out, ALPHA_Q.get(name, 90))

    # ------------------------------------------------------------------ kitap (aynı tuval: 1536×1024)
    ec_raw = Image.open(PARTS / "envelope_closed.png").convert("RGBA")
    eo_raw = Image.open(PARTS / "envelope_open.png").convert("RGBA")
    ec, temizlik["envelope_closed"] = hale_temizle(ec_raw, sert=True)
    eo, temizlik["envelope_open"] = hale_temizle(eo_raw, sert=True)
    W, H = ec.size
    kitap, kb = tb.kitap_kes(ec, eo)
    uyar("kitap", kb)
    if kb.get("method") != "renk":
        sys.exit(f"kitap kesimi geometrik yedeğe düştü: {kb.get('warnings')} — önizlemeye bak (--onizleme)")
    sirt = float(kb["spine"])
    cover, cover_in, page = kitap["cover"], kitap["cover_in"], kitap["page"]
    leaf, yb = yaprak_kes(page, sirt)
    fark_acik = tb.ortusme(eo, [cover_in, page])
    if fark_acik > 0.01:
        sys.exit(f"açık kitap katmanları kaynakla örtüşmüyor (alfa farkı {fark_acik:.4f} > 0.01)")
    yaprak_disi = float(((np.asarray(leaf)[..., 3].astype(int) - np.asarray(page)[..., 3].astype(int)) > 1).sum())
    if yaprak_disi:
        sys.exit(f"yaprak sayfanın dışına taşıyor ({yaprak_disi:.0f} px)")

    eca = np.asarray(ec)
    kc = alfa_kutu(ec, esik=128)                                  # kapalı kitabın dış kenarları (kitap_kes cover_box)
    k_x0, k_y0, k_x1, k_y1 = kc
    book_w = k_x1 - k_x0
    orta_y = (k_y0 + k_y1) / 2
    # kapağın sağ kenarı yarı yükseklikte (köşe pirinçleri değil, kenarın kendisi): orta satırların medyanı
    satir = range(int(orta_y) - 40, int(orta_y) + 41, 4)
    sag_kenar = float(np.median([np.flatnonzero(eca[y, :, 3] >= 128).max() + 1 for y in satir]))

    # ------------------------------------------------------------------ kapanış (pirinç toka)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    c_w = COMP["closure_w_over_book"] * book_w
    s = c_w / cl_crop.width
    c_h = cl_crop.height * s
    anchor = (sag_kenar, orta_y)
    hedef = (anchor[0] + COMP["closure_c_minus_anchor"][0] * book_w, anchor[1] + COMP["closure_c_minus_anchor"][1] * book_w)
    closure_box = [hedef[0] - c_w / 2, hedef[1] - c_h / 2, hedef[0] + c_w / 2, hedef[1] + c_h / 2]
    hinge_x = mentese_sutunu(cl_crop)
    hinge_pct = round(100 * hinge_x / cl_crop.width, 2)

    # ------------------------------------------------------------------ kart yolu: yaprağın üstünde → kalkar → ortaya
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    lx0, ly0, lx1, ly1 = yb["box"]
    card_w = CARD_W_OF_LEAF * (lx1 - lx0)
    card_h = card_w / card_ar
    card_x = (lx0 + lx1) / 2 - card_w / 2
    card_y = (ly0 + ly1) / 2 - card_h / 2
    card_box = [card_x, card_y, card_x + card_w, card_y + card_h]
    ob = alfa_kutu(eo, esik=128)
    spread_cx = (ob[0] + ob[2]) / 2
    open_cy = (ob[1] + ob[3]) / 2
    # front: kartın merkezi açık çift sayfanın ortasında; dikey merkez açık kitabın ortası
    f_dx = spread_cx - (card_x + card_w / 2)
    f_dy = open_cy - (card_y + card_h / 2)
    fw, fh = card_w * FRONT_SCALE, card_h * FRONT_SCALE
    front_box = [spread_cx - fw / 2, open_cy - fh / 2, spread_cx + fw / 2, open_cy + fh / 2]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    ob1 = alfa_kutu(eo, esik=1)
    cb1 = alfa_kutu(ec, esik=1)
    X0 = min(cb1[0], ob1[0], closure_box[0], front_box[0])
    X1 = max(cb1[2], ob1[2], closure_box[2], front_box[2])
    Y0 = min(cb1[1], ob1[1], closure_box[1], front_box[1])
    Y1 = max(cb1[3], ob1[3], closure_box[3], front_box[3])
    SW, SH = X1 - X0, Y1 - Y0

    def pct(box):
        x0, y0, x1, y1 = box
        return [round(100 * (x0 - X0) / SW, 3), round(100 * (y0 - Y0) / SH, 3),
                round(100 * (x1 - x0) / SW, 3), round(100 * (y1 - y0) / SH, 3)]

    stage = {"canvas": [W, H], "box": [round(X0, 1), round(Y0, 1), round(SW, 1), round(SH, 1)], "ratio": round(SW / SH, 5)}
    katman = {}
    for ad, im in (("book_cover", cover), ("book_cover_in", cover_in), ("book_page", page), ("book_leaf", leaf)):
        k = alfa_kutu(im, esik=1)
        webp(im.crop(k), ad, WIDTHS[ad])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    # arka yüz = yaprağın sırta göre aynası (aynı dosya, CSS scaleX(-1))
    lk = manifest["book_leaf"]["canvas_box"]
    katman["book_leaf_back"] = pct([2 * sirt - lk[2], lk[1], 2 * sirt - lk[0], lk[3]])
    webp(cl_crop, "closure", WIDTHS["closure"])
    katman["closure"] = pct(closure_box)
    katman["card"] = pct(card_box)
    stage["parts"] = katman
    stage["spine_pct"] = round(100 * (sirt - X0) / SW, 3)
    cv = manifest["book_cover"]["canvas_box"]
    stage["spine_in_cover_pct"] = round(100 * (sirt - cv[0]) / (cv[2] - cv[0]), 3)
    stage["closed_obj"] = {"box_pct": pct([k_x0, k_y0, k_x1, k_y1]), "aspect": round(book_w / (k_y1 - k_y0), 4),
                           "frac_w": round(book_w / SW, 5), "center_x_frac": round(((k_x0 + k_x1) / 2 - X0) / SW, 5)}
    stage["open_obj"] = {"box_pct": pct(ob), "frac_w": round((ob[2] - ob[0]) / SW, 5),
                         "center_x_frac": round((spread_cx - X0) / SW, 5)}
    stage["card_path"] = {"lift": [0.0, -100 * LIFT_UP], "lift_scale": LIFT_SCALE,
                          "front_translate_pct": [round(100 * f_dx / card_w, 3), round(100 * f_dy / card_h, 3)],
                          "front_scale": FRONT_SCALE, "card_w_of_leaf": CARD_W_OF_LEAF}
    stage["cuts"] = {"book": kb, "leaf": yb}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "leaf_outside_page_px": int(yaprak_disi)}
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "the closed cover's right edge at half height (docs/11 §7.1 kitap)",
        "anchor_px": [round(anchor[0], 1), round(anchor[1], 1)], "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "book_w_px": book_w, "hinge_x_pct": hinge_pct,
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"book_w": COMP["book_w"], "anchor": list(COMP["anchor"]), "closure_w_over_book": COMP["closure_w_over_book"],
                 "closure_center_minus_anchor_over_book_w": list(COMP["closure_c_minus_anchor"])},
        "carried_by_flap": False,
        "motion": "unhooks (lifts on its hinge toward the viewer) and swings away, falling off the screen, before the cover opens",
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = hale_temizle(im, sert=True)
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
    manifest["photo_slots"] = slots
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.8, .86),
                                                          esik=FZ_ESIK)
    manifest["card_small"]["free_zone_threshold"] = FZ_ESIK

    # düz bant = kartın bütün genişliği süssüz (mürekkep çerçeve çizgileri arası); orta bant aynalı döşenir
    for nm, gen in (("invitation_card", 84.0), ("info_card", 84.0)):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55), esik=FZ_ESIK)
        manifest[nm]["free_zone"] = fz
        manifest[nm]["free_zone_threshold"] = FZ_ESIK
        t, b = dilimler(fz, min_gen=gen)
        per, kaynak = aynali_bant(im, t, b)
        band = nm.replace("_card", "_band")
        webp(per, band, [480, 860], 78)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "band": band, "band_src_rows": kaynak, "band_ratio": round(per.width / per.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kâğıt ::before (aynalı bant "
                                          "repeat-y, gerilmez), alt dilim ::after — docs/11 §9; site.css --t/--b"}

    for nm in ("decor_tl", "decor_br", "divider"):
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm])
        if nm != "divider":
            manifest[nm]["map16"] = alfa_haritasi(im)
    for i in (1, 2, 3):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        im.thumbnail((200, 200), Image.LANCZOS)
        webp(im, f"accent_{i}", [im.width])

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    mist = bg.crop(MIST)
    webp(mist, "mist", [mist.width], 78)
    manifest["mist"]["crop"] = list(MIST)
    wide = bg.crop(MIST_WIDE)
    webp(wide, "mist_wide", [wide.width], 76)
    manifest["mist_wide"]["crop"] = list(MIST_WIDE)
    # uzun sayfa zemini: bg_tile (dikişsiz kâğıt-sis), bg_page'in sakin orta sisinin ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((360, 560, 700, 900))).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    ma = np.asarray(mist).reshape(-1, 3).astype(np.float64)
    manifest["mist"]["tone_bottom"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in ma[-mist.width * 40:].mean(0))

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
    hz = tb.hiza_olc(ec_raw, eo_raw, "kitap", olcu.get("envelope_closed"), olcu.get("envelope_open"))
    manifest["align"] = hz
    print(f"hiza ({hz['durum']}): {tb.hiza_ozet(hz)}")
    for u in hz["uyarilar"]:
        print(f"UYARI  hiza: {u}")
    if hz["durum"] == "hata":
        sys.exit("kapalı/açık kitap hizası > %4 (GPT'den yeniden üretim gerekir)")

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
    manifest["checks"] = {"book_open_overlap_diff": round(fark_acik, 5), "green_px": 0,
                          "green_check": {"chroma_key_px": 0, "tema_build_yesil_gorunur_foliage_px": yaprak,
                                          "note": "tema_build.yesil_gorunur eğrelti/yosun yeşilini de sayar; parlak kroma şartı "
                                                  "(G ≥ 190, fazla ≥ 60) ile 0 — kroma_yesil()"},
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı; ilk ekran yatay telefonda da nav'ın üstünde biter
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": True, "names_min_px": 40}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, cover, cover_in, page, leaf, cl_crop, katman, stage, cs, ec)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · sırt %{stage['spine_pct']} · kapanış {katman['closure']} "
          f"(menteşe %{hinge_pct})")
    print(f"kart yolu {stage['card_path']} · kart {katman['card']}")
    print(f"kapalı {stage['closed_obj']} · açık {stage['open_obj']}")
    print(f"katmanlar {katman}")
    print(f"yaprak {yb}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        sl = manifest[nm]["slices"]
        print(f"{nm} dilimler {sl['top_end_pct']}–{sl['bottom_start_pct']} oran {sl['ratio']} bant {sl['band_src_rows']} "
              f"bant oranı {sl['band_ratio']}")
    print(f"haritalar tl {manifest['decor_tl']['map16']} br {manifest['decor_br']['map16']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · "
          f"sayfa rengi {manifest['page_color']}")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, cover, cover_in, page, leaf, cl_crop, katman, stage, cs, ec):
    """Kesim önizlemeleri (gözle denetim): kapak / kapağın içi / sağ sayfa / yaprak (ayrı zeminlerde); kapalı ve açık sahne;
    compare_closure.jpg = kapalı sahne (tema) | W1.1 comp'un kitap bölgesi."""
    def on(im, bg):
        b = Image.new("RGBA", im.size, bg + (255,))
        b.alpha_composite(im)
        return b.convert("RGB")
    W, H = cover.size
    sheet = Image.new("RGB", (W * 2, H * 2))
    sheet.paste(on(cover, (190, 50, 50)), (0, 0))
    sheet.paste(on(cover_in, (50, 50, 190)), (W, 0))
    sheet.paste(on(page, (50, 150, 50)), (0, H))
    sheet.paste(on(leaf, (190, 50, 190)), (W, H))
    sheet.thumbnail((2000, 1400))
    sheet.save(oniz / "cuts_book.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    zemin = (233, 233, 214, 255)

    def sahne(parcalar):
        s = Image.new("RGBA", (900, round(SH * k)), zemin)
        for im, p in parcalar:
            x, y, w, h = p
            r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
            s.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
        return s
    kapali = sahne([(cover.crop(alfa_kutu(cover, 1)), katman["book_cover"]), (cl_crop, katman["closure"])])
    kapali.convert("RGB").save(oniz / "stage_closed.jpg", quality=88)
    lb = leaf.crop(alfa_kutu(leaf, 1))
    acik = sahne([(cover_in.crop(alfa_kutu(cover_in, 1)), katman["book_cover_in"]),
                  (page.crop(alfa_kutu(page, 1)), katman["book_page"]), (cs, katman["card"]),
                  (lb.transpose(Image.FLIP_LEFT_RIGHT), katman["book_leaf_back"])])
    acik.convert("RGB").save(oniz / "stage_open.jpg", quality=88)
    # compare_closure: tema (kapalı sahne, kitap genişliği comp'unkine ölçekli) | comp
    comp = Image.open(COMPS / "web_1_envelope.png").convert("RGB")
    cx0, cy0, cx1, cy1 = 230, 560, 830, 1250
    cmp_crop = comp.crop((cx0, cy0, cx1, cy1))
    ox, oy, ow, oh = stage["closed_obj"]["box_pct"]
    olcek = COMP["book_w"] / (ow / 100 * 900)
    t0 = kapali.resize((round(900 * olcek), round(kapali.height * olcek)), Image.LANCZOS)
    t = Image.new("RGBA", (t0.width + 800, t0.height + 800), zemin)
    t.alpha_composite(t0, (400, 400))
    ex = ox / 100 * 900 * olcek + 400            # kitabın sol kenarı (tema) ↔ comp'ta x 256
    ey = oy / 100 * kapali.height * olcek + 400  # üst kenar ↔ comp'ta y 593
    t = t.crop((round(ex - (256 - cx0)), round(ey - (593 - cy0)), round(ex - (256 - cx0)) + cmp_crop.width,
                round(ey - (593 - cy0)) + cmp_crop.height))
    out_im = Image.new("RGB", (cmp_crop.width * 2 + 16, cmp_crop.height), (255, 255, 255))
    out_im.paste(t.convert("RGB"), (0, 0))
    out_im.paste(cmp_crop, (cmp_crop.width + 16, 0))
    out_im.save(oniz / "compare_closure.jpg", quality=88)


if __name__ == "__main__":
    main()
