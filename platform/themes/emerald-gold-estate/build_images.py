#!/usr/bin/env python3
"""Emerald & Gold Estate teması (tasarım 17, G417) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/emerald-gold-estate/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/17_Emerald_Gold_Estate/assets/gpt/parts/ (G217, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" doldurma, windows.json); tema klasörüne, img_src/'ye,
assets/'e yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf, çan/ogee kapak; kapanış kapakla TAŞINMAZ: "the gold seal lifts away
with a glint"):
  * Kapak kesimi: tema_build.kapak_kes("egri") — zümrüt kapağın serbest kenarı ince altın çizgili çan (ogee) eğrisi; en
    güçlü parlaklık düşüşü altın çizgiden gövdedeki temas gölgesine geçişte, yani altın çizgi kapakta kalır
    (önizleme: cuts_envelope.jpg).
  * Ön cep ÇİZGİ ÜSTÜNDEN (cep_cizgi): açık zarfın ön cebi V, kenarı 9–12 satırlık parlak altın bir çizgi (koyu iç hat,
    turuncu altın, parlak şerit, kahverengi dış hat); üstü yine altın astar (yaprak desenli altın varak). tema_build.cep_kes
    ("v") kesimi çizginin ALTINDAN geçiriyordu (çizgi ve uçtaki yuvarlak köşenin altındaki yeşil şerit arka katmanda
    kalıyor, yükselen kart çizgiyi örtüyordu). Burada cep_kes("v")'nin iki doğrusu yalnız ön bilgi: her sütunda doğrunun
    30 px altından (cep yeşili: G > R, B ≥ R − 8, lum < 165) yukarı çıkılır; yeşil biten satırın doğrunun 4 px'ten
    fazla altında kalması = yan kanat kat çizgisi (cebin içinde) → üstünden geçilip aramaya devam edilir; sonra altın
    çizgi pikselleri (R − B ≥ 130 ya da lum ≥ 195 ya da koyu altın hat) boyunca tırmanılır (ilk 3 satır geçiş için
    tolere). Kalınlık 21 sütun medyanıyla düzeltilir, 8–13 satıra sınırlanır; kenar 9 sütun medyanı. Çizgi cepte kalır,
    astar dışarıda (docs/11 §7.3 "kenar bandı cebe dahil").
  * Hiza: kit_check geçiyor (sol −0,10 · sağ +0,20 · alt +0,13 %) — dönüşüm yok (manifest.align). Menteşe satırı = kapalı
    zarfın üst kenarı (kapak_kes hinge_row); açık kapak/gövde aynı satırdan ayrılır.
  * Kapanış (closure.png = altın mühür, ortası BOŞ, defne çelengi kenarlı) kare tuvalde büyük çizildi; yeri kesim
    geometrisine bağlı: çapa = çan kapağın en alt noktası (kapak_kes tip), W1.1 comp'ta ölçülen mühür genişliği / zarf
    genişliği ve merkezin uca göre kayması ile (manifest.closure; COMP). Ortasındaki boş daire monogram alanı
    (manifest.closure.mono_in_crop_pct; site `.seal-mono` = data-field="initials", mühürle birlikte hareket eder).
  * Telefon zemini (`velvet`): bg_page 2:3, telefonda cover ile köşe kümeleri kesilirdi → bg_page'in kümesiz orta kadifesi
    (x 200–800, y 290–1240; altın piksel haritasıyla ölçüldü) tek kırpım; altın çizgi kümeleri ayrı katman (decor_tl /
    decor_br), ekranda bütün. Geniş ekran `velvet_wide` (tek kümesiz geniş kırpım). Uzun sayfalar bg_tile (dikişsiz kadife)
    — rengi bg_page'in sakin orta kadifesinin ortalamasına çekilir.
  * Mermer kartlar (card_small, invitation_card, info_card): free_zone'u açma (morfolojik) ince damarları saymaz;
    3 dilim kesimin gerilen orta bandı kartın en sakin (damarsız) düz bandından seçilir (DILIM_ARALIK) — theme-check'in
    uzayan kart piksel testi damarı "dekor" sayar.
  * GPT kusurları: dış hatta yarı saydam hâle temizliği, WebP kenar saçağı için renk taşıma (08'in yöntemi); yatay
    çerçeve penceresindeki koyu leke (G217 bilinen kusuru) parts_prep leke dolgusuyla tam şeffaf (foto_alani her WebP'de
    denetler). Yeşil denetimi: parlak kroma yeşili (G ≥ 190, fazla ≥ 60) her WebP'de 0 (zümrüt kadife sayılmaz).

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
COL = ROOT / "collections/17_Emerald_Gold_Estate"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [240, 480], "card_small": [320, 640], "invitation_card": [480, 868],
    "info_card": [480, 827], "frame_portrait": [320, 513], "frame_landscape": [480, 960], "decor_tl": [360, 540, 720],
    "decor_br": [360, 540, 720], "divider": [300],
}
# altın çizgi kümeleri ince çizgi + şeffaf: alfa kalitesi 70 (720 px'te ilk görünüm bütçesi, docs/11 §6)
QUALITY = {"decor_tl": 78, "decor_br": 78, "closure": 80}
ALPHA_Q = {"decor_tl": 70, "decor_br": 70}
CARD_W_OF_ENV = 0.52       # kart genişliği / zarf genişliği (W1.2 kartı zarftan dar; kart 0,612 en/boy, zarftan uzun)
CARD_PHOTO_ABOVE = 0.06    # cepte bekleyen kart: foto penceresinin en çok bu kadarı cep kenarının üstünde
POCKET_BELOW = 0.04        # out: kartın alt köşeleri cebin kenarını kart boyunun bu kadarı aşar (docs/11 §7.1)
FRONT_DROP, FRONT_SCALE = 0.03, 1.04
# palet (palette.json emerald-gold): ivory #F3EDDF — yer tutucu tonu (kadife kırpımı fildişine karışır: adaçayı)
IVORY = (243, 237, 223)
PH_MIX = 0.34
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: kümesiz kadife)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (330, 420, 700, 900)),
    "story_1": ("portrait", [320, 640], (260, 380, 600, 840)),
    "story_2": ("portrait", [320, 640], (420, 520, 760, 980)),
    "story_3": ("portrait", [320, 640], (300, 700, 640, 1160)),
    "venue": ("landscape", [480, 960], (220, 560, 800, 930)),
}
PH_MAX_GOLD = 0.0005  # yer tutucuda altın (R > G + 10) piksel payı en çok bu: küme/toz kırpıma girmez (çıkış ≠ 0)
# telefon / geniş ekran zemini (bg_page 1024×1536; 32 px ızgarada altın piksel haritası: sol üst küme y < 360'ta
# x ≤ 520, y 360–550'de x ≤ 96; sağ alt küme y ≥ 860'ta x ≥ 960, y ≥ 1020'de x ≥ 900, y ≥ 1180'de x ≥ 830, y ≥ 1280'de
# x ≥ 640; sol kenarda y ≥ 990'da altın toz x ≤ 130)
VELVET = (200, 290, 800, 1240)       # telefon: kümesiz orta kadife (en/boy 0,63)
VELVET_WIDE = (64, 600, 960, 1000)   # geniş ekran: kümesiz geniş kırpım (en/boy 2,24)
CALM = (300, 600, 700, 900)          # sayfa rengi ve bg_tile tonu: sakin orta kadife
# 3 dilim: gerilen orta bant bu aralıkta, damarsız (> 45 RGB uzaklığı payı ≤ %0,05) en uzun bant (yüzde)
DILIM_ARALIK = {"invitation_card": (40.0, 68.0), "info_card": (24.0, 88.0)}
DAMAR_ESIK = 0.0015
FZ_NOTE = ("serbest_mermer: dolu = şeffaf ya da altın (R − B > 40 ve kağıttan > 24); gri mermer damarı kağıt dokusu "
           "(tema_build.serbest_bolge gibi 2 px açma)")
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536): zarfın altın kenarlı dış hattı x 149–873 (725 px); çan kapağın
# altın çizgisi mührün iki yanında (x 330–438 ve 582–686) her sütunda en alt altın pikseli → 3. derece uydurma (artık
# 0,46 px), en alt nokta (510,9; 886,2). Mühür (altın, R > G + 10, R > 120; sütun/satır payı > %5) x 442–576, y 816–953:
# genişlik 135 → / zarf = 0,1862; merkez (509, 884,5) − uç = (−1,9; −1,7) px = (−0,0026; −0,0023) × zarf genişliği.
COMP = {"env_w": 725.0, "tip": (510.9, 886.2), "closure_w_over_env": 0.1862, "closure_c_minus_tip": (-0.0026, -0.0023)}


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
    """(tema_build.yesil_gorunur sayısı, #00FF00 benzeri parlak kroma yeşili sayısı). Zümrüt kadife ve astarın yeşil
    deseni ilk ölçüte girebilir; gerçek pencere kalıntısı parlak (opak #00FF00 ≈ (5, 242, 2)) → ek şart G ≥ 190 ve yeşil
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

def cep_cizgi(eo: Image.Image, mentese: int):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Kenar = cebin altın çizgisinin ÜSTÜ (çizgi cepte).
    Ön bilgi tema_build.cep_kes("v")'nin iki doğrusu; ayrıntı modül başında."""
    _, vb = tb.cep_kes(eo, "v")
    if vb.get("method") != "renk":
        sys.exit(f"cep ön bilgisi (cep_kes v) geometrik yedeğe düştü: {vb.get('warnings')}")
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    R, G, B, A = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    lum = a[..., :3] @ LUM
    op = A > 200
    cep = op & (G > R) & (B >= R - 8) & (lum < 165)
    cizgi = op & ((R - B >= 130) | (lum >= 195) | ((lum < 125) & (B < 45) & (R > G)))
    x0, y0, x1, y1 = vb["body"]
    sol, sag, tipx = vb["left"], vb["right"], float(vb["tip"][0])

    def vdog(x):
        return sol[0] * x + sol[1] if x <= tipx else sag[0] * x + sag[1]

    yesil_ust = np.full(W, np.nan)
    ust = np.full(W, np.nan)
    kat_atlandi = 0
    for x in range(x0 + 2, x1 - 1):
        y = min(int(round(vdog(x))) + 30, y1 - 6)
        if not cep[y, x]:
            continue
        for _ in range(4):
            while y > y0 and cep[y, x]:
                y -= 1
            if y <= vdog(x) + 4:
                break
            kat_atlandi += 1           # yan kanat kat çizgisi (cebin içinde): üstünden geç
            yb = y
            while y > yb - 24 and not cep[y, x]:
                y -= 1
        yesil_ust[x] = y
        top = None
        for k in range(16):
            if cizgi[y - k, x]:
                top = y - k
            elif k >= 3 and top is not None:
                break
        if top is not None:
            ust[x] = top
    kal = yesil_ust - ust + 1
    gecerli = np.isfinite(kal) & (kal >= 6) & (kal <= 15)
    kal_g = np.where(gecerli, kal, np.nan)
    med = float(np.nanmedian(kal_g))
    kal_s = np.full(W, med)
    for x in range(W):
        w = kal_g[max(0, x - 10):x + 11]
        if np.isfinite(w).any():
            kal_s[x] = np.nanmedian(w)
    kal_s = np.clip(kal_s, 8, 13)
    xs = np.flatnonzero(np.isfinite(yesil_ust))
    cx0, cx1 = int(xs.min()), int(xs.max())
    ham = yesil_ust - kal_s
    ham[:cx0] = ham[cx0]
    ham[cx1 + 1:] = ham[cx1]
    ham = np.where(np.isfinite(ham), ham, np.interp(np.arange(W), xs, ham[xs]))
    kenar = ham.copy()
    for x in range(W):
        kenar[x] = np.median(ham[max(0, x - 4):x + 5])
    sicrama = int((np.abs(ham - kenar)[cx0:cx1] > 2).sum())
    kenar = np.maximum(kenar, mentese)
    yy = np.arange(H)[:, None]
    m_ = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    out = a.copy()
    out[..., 3] *= m_
    # denetim: kenarın 3 px altından itibaren 14 satırda astar (matte altın, B ≥ 50, çizgi değil) var mı (örneklem)
    astar = 0
    for x in range(cx0 + 20, cx1 - 19, 3):
        yb = int(np.ceil(kenar[x])) + 2
        seg = (slice(yb, yb + 14), x)
        astar += int((op[seg] & ~cep[seg] & ~cizgi[seg] & (B[seg] >= 50)).sum())
    xm = int(np.argmax(kenar[cx0:cx1 + 1])) + cx0
    bilgi = {"method": "renk", "detector": "cep_kes(v) doğruları ön bilgi; cep yeşili → altın çizginin üstü",
             "prior": {"left": sol, "right": sag, "tip": vb["tip"]}, "body": [x0, mentese, x1, y1],
             "rim_rows_median": med, "fold_lines_skipped_cols": kat_atlandi,
             "tip": [xm, round(float(kenar[xm]), 1)],
             "edge_at": {"x0": round(float(kenar[cx0]), 1), "x0+100": round(float(kenar[cx0 + 100]), 1),
                         "mid": round(float(kenar[(cx0 + cx1) // 2]), 1), "x1-100": round(float(kenar[cx1 - 100]), 1),
                         "x1": round(float(kenar[cx1]), 1)},
             "single_column_spikes_fixed": sicrama, "liner_px_inside_sampled": astar, "warnings": []}
    if astar > 150:
        bilgi["warnings"].append(f"cebin içinde astar pikseli: {astar}")
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def zarf_genislik(rgba: np.ndarray):
    """Kapalı zarfın altın kenarlı dış hattı (comp ölçümüyle aynı: alfa > 200 sütunları)."""
    cols = np.flatnonzero(rgba[..., 3].max(0) > 200)
    return int(cols.min()), int(cols.max()) + 1


def mono_kutusu(cl: Image.Image):
    """Mührün boş ortası (monogram alanı): merkezden dışa doğru halka başına doku (yerel gradyan) — defne çelengi
    başlayınca artar. Kırpım yüzdesi [x, y, w, h] (kare içine sığan yatay kutu)."""
    a = np.asarray(cl.convert("RGBA")).astype(np.float64)
    lum = a[..., :3] @ LUM
    gy, gx = np.gradient(lum)
    g = np.hypot(gx, gy) * (a[..., 3] > 200)
    H, W = lum.shape
    yy, xx = np.mgrid[0:H, 0:W]
    al = a[..., 3] > 200
    cy, cx = yy[al].mean(), xx[al].mean()
    r = np.hypot(yy - cy, xx - cx)
    R0 = r[al].max()
    prof = []
    for f in np.arange(0.04, 0.9, 0.02):
        ring = (r >= f * R0) & (r < (f + 0.02) * R0) & al
        prof.append((round(float(f), 2), float(g[ring].mean())))
    taban = np.median([v for f, v in prof if f < 0.3])
    sinir = next((f for f, v in prof if f > 0.2 and v > taban * 2.2), 0.5)
    ri = sinir * R0 * 0.94
    # yatay kutu: genişlik 1.6 ri, yükseklik 0.7 ri (monogram tek satır)
    w, h = 1.6 * ri, 0.7 * ri
    return ([round(100 * (cx - w / 2) / W, 3), round(100 * (cy - h / 2) / H, 3), round(100 * w / W, 3),
             round(100 * h / H, 3)], {"centre_px": [round(cx, 1), round(cy, 1)], "plain_radius_frac": sinir,
                                     "texture_profile": prof[::3]})


# ============================================================================= mermer kartın serbest bölgesi

def serbest_mermer(im: Image.Image, merkez: float = 0.5, adim: float = 1.0, ornek=(.5, .55), esik: float = 24,
                   sicak: float = 40):
    """tema_build.serbest_bolge'nin mermer kart hâli (aynı çıktı biçimi [y%, sol%, sağ%]). Dolu = şeffaf ya da altın süs
    (sıcak renk: R − B > `sicak` ve kağıttan > `esik` uzak). Gri mermer damarları (R ≈ G ≈ B) kağıdın dokusudur, süs
    değil: W1 comp'ları yazıyı damarlı mermerin üstüne basar; tema_build'in renk farkı eşiği (28) damarları "dolu" sayıp
    bölgeyi parçalıyordu (card_small %68: sağ kenar %55). Açma (2 px) aynı."""
    a = np.asarray(im.convert("RGBA")).astype(np.int16)
    H, W = a.shape[:2]
    paper = np.median(a[int(H * ornek[0]):int(H * ornek[1]), int(W * .4):int(W * .6), :3].reshape(-1, 3), 0)
    d = np.sqrt(((a[..., :3] - paper) ** 2).sum(-1))
    busy = ((a[..., 0] - a[..., 2] > sicak) & (d > esik)) | (a[..., 3] < 200)
    busy = genislet(~genislet(~busy, 2), 2)
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


def damar_yumusat(im: Image.Image, tavan: float = 40, sicak: float = 40, pay: int = 3):
    """Mermerin İÇİ (opak, altın değil: R − B ≤ `sicak`, altından `pay` px uzak): gri damarların kağıt rengine uzaklığı
    `tavan`'a (RGB) sınırlanır — damar çizgisi aynı yerde ve keskin kalır, yalnız açık griye iner; altın kenar, eğrelti ve
    köşe süsleri dokunulmaz. Neden: kart metni 3 dilimle uzayınca theme-check her satırın altını kartın ortasındaki kağıt
    rengiyle karşılaştırır (> 45 RGB uzaklığı %0,5'ten fazla = "boyalı dekor"); koyu damarlar imza satırında tam %0,5'e
    değiyordu (2 px bulanıklık da denendi: damarları bulut gibi yayıyordu). (yeni görüntü, bilgi)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    H, W = a.shape[:2]
    paper = np.median(a[int(H * .45):int(H * .55), int(W * .4):int(W * .6), :3].reshape(-1, 3), 0)
    altin = (a[..., 0] - a[..., 2] > sicak) | (a[..., 3] < 250)
    ic = ~genislet(altin, pay)
    fark = a[..., :3] - paper
    d = np.sqrt((fark ** 2).sum(-1))
    k = ic & (d > tavan)
    out = a.copy()
    out[..., :3][k] = paper + fark[k] * (tavan / d[k])[:, None]
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), {
        "cap_rgb": tavan, "paper": [round(v, 1) for v in paper], "px": int(k.sum())}


# ============================================================================= kart dilimleri (docs/11 §9)

def damar_bandi(im: Image.Image, aralik, min_gen: float = 80.0):
    """3 dilim sınırları (yüzde): `aralik` içinde her %1 satır bandında kartın orta %80'i düz kağıt (opak, kağıt
    renginden > 45 RGB uzaklığı payı ≤ DAMAR_ESIK — damar yok); en uzun kesintisiz bant gerilir. (t, b, satır payları)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    H, W = a.shape[:2]
    paper = np.median(a[int(H * .45):int(H * .55), int(W * .4):int(W * .6), :3].reshape(-1, 3), 0)
    d = np.sqrt(((a[..., :3] - paper) ** 2).sum(-1))
    pay = (100 - min_gen) / 200
    duz = []
    for y in np.arange(aralik[0], aralik[1], 1.0):
        b = slice(int(H * y / 100), int(H * (y + 1) / 100))
        c = slice(int(W * pay), int(W * (1 - pay)))
        oran = float(((d[b, c] > 45) | (a[b, c, 3] < 250)).mean())
        duz.append((float(y), oran))
    bantlar, cur = [], []
    for y, oran in duz:
        if oran <= DAMAR_ESIK:
            cur.append(y)
        else:
            if cur:
                bantlar.append(cur)
            cur = []
    if cur:
        bantlar.append(cur)
    if not bantlar:
        raise SystemExit(f"kart: {aralik} içinde damarsız düz bant yok")
    en = max(bantlar, key=len)
    return float(en[0]), float(en[-1] + 1), [round(o, 4) for _, o in duz]


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="eg-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (emerald-gold-estate); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
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
    flap = Image.new("RGBA", (W, H))
    flap.paste(flap_k, (0, 0))
    mentese = int(kb["hinge_row"])
    pocket, cep, cep_kenar = cep_cizgi(eo, mentese)
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

    # ------------------------------------------------------------------ kapanış (altın mühür, boş orta)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=True)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    g_x0, g_x1 = zarf_genislik(eca)
    env_w = g_x1 - g_x0
    tip = kb["tip"]
    c_w = COMP["closure_w_over_env"] * env_w
    s = c_w / (ck[2] - ck[0])
    c_h = (ck[3] - ck[1]) * s
    hedef = (tip[0] + COMP["closure_c_minus_tip"][0] * env_w, tip[1] + COMP["closure_c_minus_tip"][1] * env_w)
    closure_box = [hedef[0] - c_w / 2, hedef[1] - c_h / 2, hedef[0] + c_w / 2, hedef[1] + c_h / 2]
    mono_pct, mono_bilgi = mono_kutusu(cl_crop)

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
        "anchor": "the lowest point of the bell (ogee) flap's gold edge (kapak_kes 'egri' tip)",
        "anchor_px": [round(tip[0], 1), round(tip[1], 1)], "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "env_w_px": env_w,
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": COMP["env_w"], "tip": list(COMP["tip"]), "closure_w_over_env": COMP["closure_w_over_env"],
                 "closure_center_minus_tip_over_env_w": list(COMP["closure_c_minus_tip"])},
        "carried_by_flap": False, "mono_in_crop_pct": mono_pct, "mono": mono_bilgi,
        "motion": "glints and lifts away (MOTION.envelope.glint, closure) before the flap lifts",
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = hale_temizle(im, sert=True)
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
    manifest["photo_slots"] = slots
    manifest["card_small"]["free_zone"] = serbest_mermer(Image.open(prep / "card_small.png"), 0.5, ornek=(.78, .86))
    manifest["card_small"]["free_zone_method"] = FZ_NOTE

    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        im, yumusak = damar_yumusat(im)
        webp(im, nm, WIDTHS[nm])
        manifest[nm]["veins_softened"] = yumusak
        manifest[nm]["free_zone"] = serbest_mermer(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone_method"] = FZ_NOTE
        t, b, oranlar = damar_bandi(im, DILIM_ARALIK[nm], min_gen=93.0)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "search_pct": list(DILIM_ARALIK[nm]), "vein_share_per_row": oranlar,
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz mermer bandı ::before "
                                          "(dikey gerilir; damarsız satırlar), alt dilim ::after — docs/11 §9; site.css "
                                          "--t/--b"}

    for nm in ("decor_tl", "decor_br", "divider"):
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm])
        if nm != "divider":
            # 16 × 16 çizgi haritası (hücrede alfa > 40 payı > %2): site.js `decor` yazıyla çakışmayı buna bakar
            al = np.asarray(im)[..., 3] > 40
            hh, ww = al.shape
            satirlar = []
            for j in range(16):
                bit = 0
                for i in range(16):
                    hucre = al[hh * j // 16:hh * (j + 1) // 16, ww * i // 16:ww * (i + 1) // 16]
                    bit = bit << 1 | int(hucre.mean() > 0.02)
                satirlar.append(f"{bit:04x}")
            manifest[nm]["line_map_16"] = "".join(satirlar)
    for i in (1, 2, 3):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        # 200: süzülen parçalar ve küçük süsler; 400: açılışta "kendini çizen" altın çizgiler (≤ 130 px × DPR 3)
        k200 = im.copy()
        k200.thumbnail((200, 200), Image.LANCZOS)
        webp(k200, f"accent_{i}", [k200.width])
        k400 = im.copy()
        k400.thumbnail((400, 400), Image.LANCZOS)
        webp_yaz(k400, f"accent_{i}_lg", [k400.width], q, manifest, out)
        manifest[f"accent_{i}"]["aspect"] = round(im.width / im.height, 4)

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    vel = bg.crop(VELVET)
    webp(vel, "velvet", [vel.width], 78)
    manifest["velvet"]["crop"] = list(VELVET)
    wide = bg.crop(VELVET_WIDE)
    webp(wide, "velvet_wide", [wide.width], 76)
    manifest["velvet_wide"]["crop"] = list(VELVET_WIDE)
    # uzun sayfa zemini: bg_tile (dikişsiz kadife), bg_page'in sakin orta kadifesinin ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop(CALM)).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 76)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    va = np.asarray(vel.convert("L")).astype(np.float64)
    manifest["velvet"]["grey_pct"] = {str(p): round(float(np.percentile(va, p)), 1) for p in (0.1, 1, 50, 99, 99.9)}

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ham = bg.crop(kutu)
        ha = np.asarray(ham).astype(np.int16)
        altin = float(((ha[..., 0] > ha[..., 1] + 10) & (ha[..., 0] > 90)).mean())
        if altin > PH_MAX_GOLD:
            sys.exit(f"ph_{key}: kırpım {kutu} altın dekor içeriyor (pay {altin:.4f} > {PH_MAX_GOLD})")
        ph = tb.yer_tutucu(bg, kutu, oran, max(gen), ton=IVORY, karisim=PH_MIX)
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"].update({"aspect": oran, "crop": list(kutu), "gold_share": round(altin, 5),
                                      "tone": list(IVORY), "mix": PH_MIX})

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
                          "green_check": {"chroma_key_px": 0, "tema_build_yesil_gorunur_px": yaprak,
                                          "note": "tema_build.yesil_gorunur zümrüt kadifeyi / astar desenini de sayabilir; "
                                                  "parlak kroma şartı (G ≥ 190, fazla ≥ 60) ile 0 — kroma_yesil()"},
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı; boyalı kümeler; ilk ekran yatay telefonda da
    # nav'ın üstünde biter, hero isimleri ≥ 34 px. backdrop: koyu zümrüt kadife (gri %99,9'luk değeri manifest
    # velvet.grey_pct) — varsayılan dark_below 170 düz kadifenin tamamını "dolu" sayar; dolu = altın çizgi (açık) →
    # dark_below 0, light_above = düz kadifenin %99,9'luğunun üstünde (altın çizgiler 110–230)
    p999 = manifest["velvet"]["grey_pct"]["99.9"]
    manifest["theme_check"] = {"particles": ".accent-layer", "clusters": ".corner",
                               "first_screen": {"landscape": True, "names_min_px": 34},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0,
                                            "light_above": int(round(p999 + 18))}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, env_flap, env_body, pocket, cl_crop, katman, stage, cs, eo)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"kart yolu {stage['card_path']} · kart {katman['card']}")
    print(f"kapalı nesne {stage['closed_obj']}")
    print(f"katmanlar {katman}")
    print(f"cep {cep['edge_at']} çizgi {cep['rim_rows_median']} sıçrama {cep['single_column_spikes_fixed']} "
          f"kat {cep['fold_lines_skipped_cols']} astar {cep['liner_px_inside_sampled']}")
    print(f"mono {mono_pct} {mono_bilgi['plain_radius_frac']}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} dilimler {manifest[nm]['slices']['top_end_pct']}–{manifest[nm]['slices']['bottom_start_pct']} "
              f"oran {manifest[nm]['slices']['ratio']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · "
          f"sayfa rengi {manifest['page_color']} · kadife gri {manifest['velvet']['grey_pct']}")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, ec, flap, env_flap, env_body, pocket, cl_crop, katman, stage, cs, eo):
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
    sheet.paste(on(pocket, (190, 50, 190)), (2 * W, 0))
    rest = np.asarray(eo).copy()
    rest[..., 3] = (rest[..., 3] * (1 - np.asarray(pocket)[..., 3] / 255.0)).astype(np.uint8)
    sheet.paste(on(Image.fromarray(rest, "RGBA"), (50, 50, 190)), (3 * W, 0))
    sheet = sheet.crop((0, 180, W * 4, 1380))
    sheet.thumbnail((2400, 1000))
    sheet.save(oniz / "cuts_envelope.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    zemin = (15, 77, 58, 255)

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
    cx0, cx1 = 149 - 40, 873 + 40
    cy0, cy1 = 520, 1200
    cmp_crop = comp.crop((cx0, cy0, cx1, cy1))
    ox, oy, ow, oh = stage["closed_obj"]["box_pct"]
    env_px = ow / 100 * 900
    olcek = (873 - 149) / env_px
    t0 = kapali.resize((round(900 * olcek), round(kapali.height * olcek)), Image.LANCZOS)
    t = Image.new("RGBA", (t0.width + 400, t0.height + 400), zemin)
    t.alpha_composite(t0, (200, 200))
    ex = ox / 100 * 900 * olcek + 200
    ey = (oy + oh) / 100 * kapali.height * olcek + 200
    # comp'ta zarfın alt kenarı y 1159 → kırpımda 1159 − cy0
    t = t.crop((round(ex - 40), round(ey - (1159 - cy0)), round(ex - 40) + cmp_crop.width, round(ey - (1159 - cy0)) + cmp_crop.height))
    out_im = Image.new("RGB", (cmp_crop.width * 2 + 16, cmp_crop.height), (255, 255, 255))
    out_im.paste(t.convert("RGB"), (0, 0))
    out_im.paste(cmp_crop, (cmp_crop.width + 16, 0))
    out_im.save(oniz / "compare_closure.jpg", quality=88)


if __name__ == "__main__":
    main()
