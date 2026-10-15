#!/usr/bin/env python3
"""Midnight Garden teması (tasarım 19, G419) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/midnight-garden/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/19_Midnight_Garden/assets/gpt/parts/ (G219, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" doldurma, windows.json); tema klasörüne, img_src/'ye,
assets/'e yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf; kapanış kapakla TAŞINMAZ: "the silver seal cracks and falls away"):
  * Kapak kesimi: tema_build.kapak_kes("v") — siyah V kapağın serbest kenarı ince antik gümüş çizgi; en güçlü
    parlaklık düşüşü gümüş çizgiden siyah gövdeye (çizgi kapakta kalır; önizleme cuts_envelope.jpg).
  * Ön cep ALTTAN TARAMA (cep_alttan): açık zarfın ön yüzü iki yan kanat + üstü düz kesik alt kanat (355–550 px'te
    yatay kenar); kenar iki doğru değil. tema_build.cep_kes("v") / parts_prep tek V uydurdu: alt kanadın düz üstünü
    kesiyor, yan kanatların üstünde astar şeritleri cebe giriyordu. Her sütunda gövdenin altından yukarı: siyah kâğıt
    (lum ≥ 22, R − B < 12; astarın bordo/erik pikselleri R ≫ B) bitip 6 satır astar görülen yer kenar; kenarın parlak
    gümüş çizgisi (lum > 70, en çok 4 satır) cebe eklenir; 9 sütun medyanı.
  * Hiza: kit_check geçiyor (sol 0,00 · sağ −0,10 · alt +0,13 %) — dönüşüm yok (manifest.align).
  * Kapanış (closure.png = gümüş mühür, ortası BOŞ) kare tuvalde büyük çizildi; yeri kesim geometrisine bağlı: çapa =
    V kapağın ucu (kapak_kes tip), W1.1 comp'ta ölçülen mühür genişliği / zarf genişliği ve merkezin uca göre kayması
    (manifest.closure; COMP). Monogram (`initials`) site tarafında mühürle birlikte hareket eden metin (pişirilmez).
    "Çatlama" site tarafında: aynı mühür iki kopya, düz bir çizgiyle clip-path (çatlak çizilmez, docs/11 §7.1).
  * Gece zemini (`night`): bg_page 2:3 telefonda köşe kümelerini keserdi. Zemin bg_page'in iki kümesiz bölgesinden:
    düz gece karası (üst) + sol alttaki mum ışığı parıltısı (alt), 110 px yumuşak geçiş; çiçek kümeleri ayrı katman
    (florals_tl / florals_br), ekranda bütün. Geniş ekran `night_wide` (tek geniş kırpım).
  * GPT kusurları: dış hatta yarı saydam hâle temizliği, WebP kenar saçağı için renk taşıma (08'in yöntemi);
    frame_portrait penceresindeki koyu leke (entegratör notu 2026-10-14) parts_prep leke dolgusuyla tam şeffaf
    (foto_alani her WebP'de denetler: manifest.checks.windows_transparent).

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
COL = ROOT / "collections/19_Midnight_Garden"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [160, 320], "card_small": [320, 640], "invitation_card": [480, 960],
    "info_card": [480, 825], "frame_portrait": [320, 640], "frame_landscape": [480, 960], "florals_tl": [360, 540, 720],
    "florals_br": [360, 540, 720], "divider": [300],
}
# yoğun yağlı boya çiçek dokusu WebP'de ağır: kümelerde alfa kalitesi 60 (q 76); diğerleri --q (80) / alfa 90
QUALITY = {"florals_tl": 76, "florals_br": 76, "closure": 80, "frame_portrait": 78, "frame_landscape": 78}
ALPHA_Q = {"florals_tl": 60, "florals_br": 60}
CARD_W_OF_ENV = 0.54       # kart genişliği / zarf genişliği (W1.2 kartı zarftan dar)
CARD_PHOTO_ABOVE = 0.06    # cepte bekleyen kart: foto penceresinin en çok bu kadarı cep kenarının üstünde
POCKET_BELOW = 0.04        # out: kartın alt köşeleri cebin kenarını kart boyunun bu kadarı aşar (docs/11 §7.1)
FRONT_DROP, FRONT_SCALE = 0.03, 1.04
# palet (palette.json midnight): mist_top #1C1A21 — yer tutucu tonu
NIGHT = (28, 26, 33)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: kümesiz mum ışığı parıltısı + gece karası)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (150, 1060, 520, 1500)),
    "story_1": ("portrait", [320, 640], (120, 1040, 470, 1500)),
    "story_2": ("portrait", [320, 640], (200, 1080, 540, 1520)),
    "story_3": ("portrait", [320, 640], (60, 1100, 400, 1536)),
    "venue": ("landscape", [480, 960], (40, 1150, 540, 1480)),
}
PH_MAX_RED = 40    # yer tutucuda gül kırmızısı yok: (R − 1,6 G) %99,9 ≤ bu (mum ışığının turuncusu ~0; gül ≫ 100)
# telefon zemini (bg_page 1024×1536 kaynak pikseli; gözle + 20 px ızgarayla: sol üst küme y < 440'ta x ≤ 830, y < 700'de
# x ≤ 140; sağda soluk yapraklar x ≥ 905 (y 450–760), sağ alt küme y ≥ 770'te x ≥ 900, y ≥ 1180'de x ≥ 770, y ≥ 1290'da
# x ≥ 545)
NIGHT_TOP = (190, 440, 880, 1080)     # düz gece karası
NIGHT_BOTTOM = (0, 1100, 540, 1536)   # sol alttaki mum ışığı parıltısı ve koyu yaprak gölgeleri (comp'ların sol altı)
NIGHT_BLEND = 110                     # px — iki kırpımın yumuşak geçiş bandı
NIGHT_WIDE = (60, 440, 890, 1100)     # geniş ekran: kümesiz tek geniş kırpım (en/boy 1,26)
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536): siyah zarf x 132–896 (1000. satır; genişlik 764); kapağın gümüş
# kenarının her sütundaki ilk parlak pikseli → V doğruları y = 0.7996x + 512.6 (x 200–420) ve y = −0.80x + 1333
# (x 620–840), ucu (513, 923). Gümüş mühür (lum > 90, doygunluk < 30, sütun/satır başına > 8 px) x 457–571, y 827–946 →
# genişlik / zarf = 114 / 764 = 0,1492; merkez (514, 886,5) → uçtan (+0,0013, −0,0478) × zarf genişliği.
COMP = {"env_w": 764.0, "tip": (513.0, 923.0), "closure_w_over_env": 0.1492, "closure_c_minus_tip": (0.0013, -0.0478)}


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
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Adı 08'den kalma; burada her sütunda menteşeden AŞAĞI
    taranır (alttan tarama alt kanadın gümüş/altın dikiş çizgilerinde duruyordu): astar (bordo/erik zemin, kırmızı
    güller, bronz yapraklar: R − B ≥ 12 ya da çok koyu) bitip 8 satır üst üste siyah kâğıt (opak, 8 ≤ lum < 70,
    R − B < 12) görülen ilk satır kenar; hemen üstündeki parlak gümüş kenar çizgisi (lum > 70) en çok 4 satır cebe
    eklenir. Ham kenar 21 sütun medyanıyla düzeltilir; en dış 16 sütun komşudan."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    lum = a[..., :3] @ LUM
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    cep = op & (lum >= 8) & (lum < 70) & (R - B < 12)
    cols = np.flatnonzero(op[mentese + 20:].any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    ham = np.full(W, np.nan)
    for x in range(x0, x1 + 1):
        rows = np.flatnonzero(op[:, x])
        alt = int(rows.max())
        y, kac = mentese - 2, 0
        while y < alt:
            if cep[y, x]:
                kac += 1
                if kac >= 8:
                    break
            else:
                kac = 0
            y += 1
        e = y - kac + 1
        for _ in range(4):                       # gümüş kenar çizgisi cepte kalsın
            if e - 1 > mentese and op[e - 1, x] and lum[e - 1, x] > 70:
                e -= 1
            else:
                break
        ham[x] = e
    kenar = ham.copy()
    for x in range(x0 + 10, x1 - 9):            # 21 sütun: astarın koyu yapraklarında erken duran sütun öbekleri
        kenar[x] = np.median(ham[x - 10:x + 11])
    sicrama = int((np.abs(ham[x0 + 10:x1 - 9] - kenar[x0 + 10:x1 - 9]) > 3).sum())
    # uçlar: zarfın yan kenarındaki parlak gümüş şerit (≈ 12 px) taramayı geçirmiyor → 16. sütunun değeri
    kenar[x0:x0 + 16] = kenar[x0 + 16]
    kenar[x1 - 15:x1 + 1] = kenar[x1 - 16]
    kenar[:x0] = kenar[x0]
    kenar[x1 + 1:] = kenar[x1]
    kenar = np.maximum(kenar, mentese)
    yy = np.arange(H)[:, None]
    m_ = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    out = a.copy()
    out[..., 3] *= m_
    # cebin içinde kalan astar pikseli (kenarın 3 px altından; bordo/kırmızı: R − B ≥ 24, G < 0,55 R — altın dikiş
    # çizgileri G'si yüksek olduğu için sayılmaz) — denetim
    astar_ici = 0
    for x in range(x0 + 14, x1 - 13, 3):
        yb = int(np.flatnonzero(op[:, x]).max()) - 4
        y0_ = int(np.ceil(kenar[x])) + 3
        if y0_ < yb:
            astar_ici += int((op[y0_:yb, x] & (R[y0_:yb, x] - B[y0_:yb, x] >= 24) & (G[y0_:yb, x] < .55 * R[y0_:yb, x])).sum())
    xm = int(np.nanargmax(kenar[x0:x1 + 1])) + x0
    bilgi = {"method": "renk", "detector": "alttan tarama: siyah kâğıt (lum ≥ 22, R − B < 12) → 6 satır astar; "
                                           "gümüş kenar (lum > 70) ≤ 4 satır cebe",
             "body": [x0, mentese, x1, int(np.flatnonzero(op.any(1)).max())], "low": [xm, round(float(kenar[xm]), 1)],
             "edge_at": {"x0": round(float(kenar[x0]), 1), "x0+120": round(float(kenar[x0 + 120]), 1),
                         "mid": round(float(kenar[(x0 + x1) // 2]), 1), "x1-120": round(float(kenar[x1 - 120]), 1),
                         "x1": round(float(kenar[x1]), 1)},
             "single_column_spikes_fixed": sicrama, "liner_px_inside_sampled": astar_ici, "warnings": []}
    if astar_ici > 200:
        bilgi["warnings"].append(f"cebin içinde astar pikseli: {astar_ici}")
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def zarf_genislik(rgba: np.ndarray, satir: int):
    """Zarfın siyah gövdesinin bir satırdaki uçları (opak; comp ölçümüyle aynı satır seviyesi)."""
    op = rgba[..., 3] > 200
    cols = np.flatnonzero(op[satir])
    return int(cols.min()), int(cols.max()) + 1


# ============================================================================= kart dilimleri (docs/11 §9)

def temiz_bant(im: Image.Image, aralik=(.25, .80)):
    """Kartın tekrarlanabilir düz bandı (yüzde [t, b)): satırda yalnız dikey altın çerçeve çizgileri (aralığın %60'ında
    dolu olan sütunlar ± 3 px) var, başka hiçbir dolu piksel (çiçek, yaprak, kenar süsü: lum > 60 ya da doygunluk > 40)
    yok. En uzun kesintisiz satır dizisi. Davet kartında köşe çiçekleri ve kenar süsleri arasında yalnız ~%4'lük bir
    bant kalıyor: site.css bu bandı esnetmez, kendi boyunda tekrarlar (repeat-y; `<ad>_band` dosyası)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    H, W = a.shape[:2]
    lum = a[..., :3].mean(-1)
    sat = a[..., :3].max(-1) - a[..., :3].min(-1)
    dolu = ((lum > 60) | (sat > 40)) & (a[..., 3] > 100)
    y0, y1 = int(H * aralik[0]), int(H * aralik[1])
    cizgi = dolu[y0:y1].mean(0) > .6
    cizgi = genislet(cizgi[None, :], 3)[0]
    x0, x1 = int(W * .04), int(W * .96)
    temiz = ~(dolu[:, x0:x1] & ~cizgi[None, x0:x1]).any(1)
    en, bas, cur = (0, 0), None, 0
    for y in range(y0, y1):
        if temiz[y]:
            bas = y if bas is None else bas
            if y - bas + 1 > en[1] - en[0]:
                en = (bas, y + 1)
        else:
            bas = None
    if en[1] - en[0] < 20:
        raise SystemExit("kart: tekrarlanabilir düz bant bulunamadı")
    return en


# ============================================================================= zemin

def gece_zemini(bg: Image.Image):
    """Telefon zemini: iki kümesiz bg_page kırpımı üst üste (NIGHT_BLEND px yumuşak geçiş). RGB."""
    ust = bg.crop(NIGHT_TOP)
    alt = bg.crop(NIGHT_BOTTOM)
    if alt.width != ust.width:
        alt = alt.resize((ust.width, round(alt.height * ust.width / alt.width)), Image.LANCZOS)
    w = ust.width
    H = ust.height + alt.height - NIGHT_BLEND
    out = Image.new("RGB", (w, H))
    out.paste(alt, (0, ust.height - NIGHT_BLEND))
    m = np.ones((ust.height, w))
    ramp = np.linspace(1, 0, NIGHT_BLEND)
    ramp = ramp * ramp * (3 - 2 * ramp)                      # smoothstep
    m[-NIGHT_BLEND:] = ramp[:, None]
    out.paste(ust, (0, 0), Image.fromarray((m * 255).astype(np.uint8), "L"))
    return out


def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, gül kırmızısı ölçüsü). Kırpım kümesiz olmalı: kırmızı gül/meyve (R − 1,6 G; mum ışığının turuncusu
    G'si yüksek olduğu için sayılmaz) denetlenir."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=NIGHT, karisim=0.18)
    a = np.asarray(ph.convert("RGB")).astype(np.float64)
    kirmizi = a[..., 0] - 1.6 * a[..., 1]
    return ph, round(float(np.percentile(kirmizi, 99.9)), 1)


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="mg-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (midnight-garden); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
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

    # ------------------------------------------------------------------ kapanış (gümüş mühür, ortası boş)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=True)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    g_x0, g_x1 = zarf_genislik(eca, k_alt - 40)          # comp'la aynı ölçüt (zarfın alt bandı)
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
    # mum ışığı (site.css .env-glow, kenarsız ışık §5.7): cebin ağzı — iki köşe ve en alçak nokta
    stage["pocket_mouth_pct"] = {"left": [round(100 * (k_x0 - X0) / SW, 2), round(100 * (float(cep_kenar[k_x0]) - Y0) / SH, 2)],
                                 "low": [round(100 * (cep["low"][0] - X0) / SW, 2), round(100 * (cep["low"][1] - Y0) / SH, 2)],
                                 "right": [round(100 * (k_x1 - 1 - X0) / SW, 2), round(100 * (float(cep_kenar[k_x1 - 1]) - Y0) / SH, 2)]}
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
        "anchor": "V flap tip (kapak_kes tip: intersection of the V lines along the silver edge of the flap)",
        "anchor_px": [round(tip[0], 1), round(tip[1], 1)], "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "env_w_px": env_w,
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": COMP["env_w"], "closure_w_over_env": COMP["closure_w_over_env"],
                 "closure_center_minus_tip_over_env_w": list(COMP["closure_c_minus_tip"])},
        "carried_by_flap": False,
        "motion": "cracks along a straight line into two halves (clip-path on two copies), which fall away "
                  "(MOTION.envelope.closure) before the flap opens",
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

    # düz bant = kartın bütün genişliği süssüz (davet kartında köşe çiçekleri: açıklık ≥ %85; bilgi kartı ≥ %85)
    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        by0, by1 = temiz_bant(im)
        t, b = round(100 * by0 / im.height, 3), round(100 * by1 / im.height, 3)
        if nm == "invitation_card":            # kısa bant: kendi boyunda tekrarlanır (esnetilmez)
            webp(im.crop((0, by0, im.width, by1)), f"{nm}_band", WIDTHS[nm])
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "band_px": [by0, by1],
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (bilgi "
                                          "kartında dikey gerilir; davet kartında <ad>_band kendi boyunda tekrarlanır), alt "
                                          "dilim ::after — docs/11 §9; site.css --t/--b"}

    for nm in ("florals_tl", "florals_br", "divider"):
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
    night = gece_zemini(bg)
    webp(night, "night", [night.width], 78)
    manifest["night"].update({"top_crop": list(NIGHT_TOP), "bottom_crop": list(NIGHT_BOTTOM), "blend_px": NIGHT_BLEND})
    wide = bg.crop(NIGHT_WIDE)
    webp(wide, "night_wide", [720], 78)
    manifest["night_wide"]["crop"] = list(NIGHT_WIDE)
    # uzun sayfaların sonu: sol alttaki mum ışığı parıltısı (comp'ların alt kenarı)
    foot = bg.crop(NIGHT_BOTTOM)
    webp(foot, "night_foot", [foot.width], 76)
    manifest["night_foot"]["crop"] = list(NIGHT_BOTTOM)
    # uzun sayfa zemini: bg_tile (dikişsiz koyu doku), bg_page'in düz gece karasının ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((300, 560, 760, 900))).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    fa_ = np.asarray(foot).reshape(-1, 3).astype(np.float64)
    manifest["night_foot"]["tone_bottom"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in fa_[-foot.width * 40:].mean(0))

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph, kirmizi = yer_tutucu_temiz(bg, kutu, oran, max(gen))
        if kirmizi > PH_MAX_RED:
            sys.exit(f"ph_{key}: kırpım {kutu} bir gül/meyve içeriyor (kırmızılık {kirmizi} > {PH_MAX_RED})")
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"].update({"aspect": oran, "crop": list(kutu), "max_red": kirmizi})

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

    yesil = tb.yesil_denetle(out)
    if yesil:
        sys.exit(f"görünür #00FF00 kalıntısı: {yesil}")
    manifest["cleanup"] = temizlik
    manifest["checks"] = {"envelope_open_overlap_diff": round(fark_acik, 5), "green_px": 0,
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı; koyu zemin (06 gibi: koyu sayılan piksel yok,
    # açık = > 110); ilk ekran yatay telefonda da nav'ın üstünde biter
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": True, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, env_flap, env_body, pocket, cl_crop, katman, stage, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"kart yolu {stage['card_path']} · kart {katman['card']}")
    print(f"kapalı nesne {stage['closed_obj']}")
    print(f"katmanlar {katman}")
    print(f"cep {cep['edge_at']} sıçrama {cep['single_column_spikes_fixed']} astar {cep['liner_px_inside_sampled']} "
          f"ağız {stage['pocket_mouth_pct']}")
    print(f"kapak {kb.get('method')} uç {kb.get('tip')} menteşe {kb.get('hinge_row')}")
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
    sheet.paste(on(pocket, (50, 150, 70)), (2 * W, 0))
    sheet.paste(on(Image.alpha_composite(env_body, env_flap), (190, 50, 50)), (3 * W, 0))
    sheet = sheet.crop((0, 280, W * 4, 1320))
    sheet.thumbnail((2400, 1000))
    sheet.save(oniz / "cuts_envelope.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    zemin = (20, 18, 24, 255)

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
    cx0, cx1 = 132 - 40, 896 + 40
    cy0, cy1 = 560, 1130
    cmp_crop = comp.crop((cx0, cy0, cx1, cy1))
    ox, oy, ow, oh = stage["closed_obj"]["box_pct"]
    env_px = ow / 100 * 900
    olcek = (896 - 132) / env_px
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
