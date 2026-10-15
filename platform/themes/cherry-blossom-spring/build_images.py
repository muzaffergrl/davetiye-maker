#!/usr/bin/env python3
"""Cherry Blossom Spring teması (tasarım 15, G415) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/cherry-blossom-spring/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/15_Cherry_Blossom/assets/gpt/parts/ (G215, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" doldurma, windows.json); tema klasörüne, img_src/'ye,
assets/'e yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf, YUVARLAK kapak; kapanış kapakla TAŞINMAZ: "the blossom twig loosens
and drifts off"):
  * Kapak kesimi: tema_build.kapak_kes("egri") — açık gri zarfın yuvarlak kapağı, serbest kenarı beyaz tırtıklı (deckle)
    şerit; en güçlü parlaklık düşüşü beyaz şeritten gri gövdeye geçişte, şerit kapakta kalır. Kapağın sol ucu zarfın sol
    üst köşesine dik iniyor: kapak_kes'in uç uzatması en soldaki birkaç sütunda kenarı gövdenin altına kadar indiriyordu
    (ince dikey şerit) → kenar uçtan dışa doğru tekdüze azalan yapılır (kapak_tekduze; düzeltilen sütun sayısı manifest'te).
  * Ön cep "GÜLÜMSEME" yayı (cep_gulumseme): açık zarfın ön yüzü iki yan kanat + alt kanat; cebin üst kenarı sol üst
    köşeden ortada en alta inip sağ üst köşeye çıkan tek bir yay. tema_build.cep_kes("egri") alttan taradığı için alt
    kanadın beyaz kat çizgilerinde duruyor (geometrik yedeğe düştü). Burada her sütunda kaba yayın ±80 px bandında
    "koyu temas gölgesi → parlak kenar şeridi" geçişi aranır (astar üstte, kenar şeridi cepte), aykırısız 6. derece
    polinom, sonra ±8 px'te yeniden arama + 9 sütun medyanı. Astardaki dal/çiçek geçişleri polinom aykırısı olarak düşer.
  * Hiza: kit_check geçiyor (sol +0,10 · sağ 0,00 · alt 0,00 %) — açık katmanlar kapalınınkiyle aynı tuval konumunda,
    dönüşüm yok (manifest.align). Menteşe satırı = kapalı zarfın üst kenarı (kapak_kes hinge_row).
  * Kapanış (closure.png = beş çiçekli, tomurcuklu kiraz dalı, TEK parça) kare tuvalde büyük çizildi; yeri kesim
    geometrisine bağlı: çapa = yuvarlak kapağın en alt noktası (kapak_kes tip), W1.1 comp'ta ölçülen dal genişliği / zarf
    genişliği ve dal merkezinin uca göre kayması ile (manifest.closure; COMP).
  * Zemin: bg_page 2:3, telefonda (en/boy ≈ 0,46) cover ile köşe kümeleri kesilirdi. Telefon zemini (`mist`) bg_page'in
    iki kümesiz bölgesinden (üstte sakin pembe sis + sol alttaki bulanık yaprak bokehi, 110 px yumuşak geçiş); kümeler ayrı
    katman (florals_tl / florals_br), ekranda bütün. Geniş ekran: `mist_wide` (tek kümesiz geniş kırpım); uzun sayfa sonu
    `mist_foot` (sol alt bokeh). Zemindeki keskin yapraklar kırpıma alınmaz: süzülen yapraklar ayrı GPT accent_1 katmanı.
  * GPT kusurları: dış hatta yarı saydam hâle temizliği (alfa < 12 sıfır, çekirdekten uzak piksel silinir, kenar rengi
    komşu opak renge), WebP kenar saçağı için renk taşıma (08/05 temalarının aynı yöntemi); card_small ve frame_portrait
    pencerelerinin ortasındaki koyu yeşil gradyan parts_prep leke dolgusuyla tam şeffaf (foto_alani her WebP'de denetler).

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
COL = ROOT / "collections/15_Cherry_Blossom"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [240, 480], "card_small": [320, 640], "invitation_card": [480, 900],
    "info_card": [480, 860], "frame_portrait": [320, 640], "frame_landscape": [480, 960],
    "florals_tl": [360, 540, 720], "florals_br": [360, 540, 720], "divider": [300],
}
# kümeler yoğun çiçek dokulu: alfa kalitesi 60 (suluboya yumuşak kenar; 08'in ölçüsü), q 76; kapalı zarf kağıt dokusu q 78.
# davet kartı: çelenk + iki küme + yaprak + kağıt lifi; q 80'de 900 px 258 KB (docs/11 §6: tek WebP ≤ 200 KB) → q 66, alfa 80
# (alfa yalnız tırtıklı kenarda); bilgi kartı ve çerçeveler q 74
QUALITY = {"florals_tl": 76, "florals_br": 76, "closure": 78, "env_closed": 78, "env_body": 78, "invitation_card": 66,
           "info_card": 74, "frame_portrait": 74, "frame_landscape": 74}
ALPHA_Q = {"florals_tl": 60, "florals_br": 60, "invitation_card": 80}
CARD_W_OF_ENV = 0.50       # kart genişliği / zarf genişliği (kart zarfa sığar)
CARD_PHOTO_ABOVE = 0.10    # cepte bekleyen kart: foto penceresinin en çok bu kadarı cep yayının dibinin üstünde
POCKET_BELOW = 0.04        # out: kartın alt köşeleri cebin kenarını kart boyunun bu kadarı aşar (docs/11 §7.1)
FRONT_DROP, FRONT_SCALE = 0.03, 1.05
# palet (palette.json sakura): ivory #FFFCFB — yer tutucu tonu
IVORY = (255, 252, 251)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: kümesiz, yapraksız pembe sis)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (300, 520, 720, 920)),
    "story_1": ("portrait", [320, 640], (240, 440, 560, 840)),
    "story_2": ("portrait", [320, 640], (480, 470, 800, 870)),
    "story_3": ("portrait", [320, 640], (300, 620, 620, 1000)),
    "venue": ("landscape", [480, 960], (230, 560, 850, 880)),
}
PH_MIN_LUM = 175   # yer tutucuda en koyu piksel en az bu: kümeden dal/çiçek kırpıma girmez (çıkış ≠ 0)
PH_MAX_SAT = 26    # ... ve renkli dekor yok (max − min kanal, %99,9)
# zemin (bg_page 1024×1536 kaynak pikseli; 100 px ızgarayla ölçüldü: sol üst küme y < 300'de x ≤ 640, y < 600'de x ≤ 130;
# sağ alt küme y ≥ 1000'de x ≥ 900, y ≥ 1240'ta x ≥ 600; keskin yapraklar (870–960, 300–382), (30–97, 660–720),
# (55–195, 1130–1245), (510–592, 1357–1432))
MIST_TOP = (220, 390, 860, 1060)     # sakin pembe sis
MIST_BOTTOM = (0, 1250, 440, 1536)   # sol alttaki bulanık yaprak bokehi (comp'ların sol alt köşesi)
MIST_BLEND = 110                     # px — iki kırpımın yumuşak geçiş bandı
MIST_WIDE = (110, 390, 900, 1010)    # geniş ekran: kümesiz, keskin yapraksız tek geniş kırpım (en/boy 1,27)
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536): zarf gövdesi x 190–835 (genişlik 645), y 615–1050. Kapağın
# tırtıklı kenarı (pembe tonlu şerit) dal dışındaki sütunlarda: (300, 827) (340, 844) (380, 861) (400, 869) (620, 865)
# (660, 849) (700, 829) (740, 797) → yay simetrisi x ≈ 510, en alt nokta (dalın altında) ≈ (510, 880). Dal (pembe/koyu
# piksel bileşeni; kapak şeridi hariç satır bantları): x 421–622, y 742–935 → genişlik 201 / zarf 645 = 0,312; merkez
# (521,5, 838,5) − uç (510, 880) = (+11,5, −41,5) px = (+0,0178, −0,0643) × zarf genişliği.
COMP = {"env_w": 645.0, "tip": (510.0, 880.0), "closure_w_over_env": 0.312, "closure_c_minus_tip": (0.0178, -0.0643)}


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

def kapak_tekduze(ec: Image.Image, flap_k: Image.Image, kb: dict):
    """kapak_kes("egri") çıktısını düzeltir: kenar (her sütunda kapağın son satırı) uçtan (yayın en alt noktası) dışa doğru
    artmaz. Kapağın sol ucu zarfın köşesine dik indiği için kapak_kes'in uç uzatması en soldaki sütunlarda kenarı gövdenin
    altına kadar indiriyordu (ince dikey şerit). Düzeltilmeyen sütunlarda kapak_kes'in 1 px yumuşak geçişi korunur.
    (tam tuval kapak RGBA, düzeltilen sütun sayısı, gerçek uç [x, y])."""
    W, H = ec.size
    fa = np.zeros((H, W))
    fa[:flap_k.height] = np.asarray(flap_k)[..., 3]
    var = fa > 0
    kenar = np.where(var.any(0), H - np.argmax(var[::-1], 0), 0).astype(np.float64)   # son kapak satırı + 1
    x0, x1 = (int(v) for v in kb["curve_x"])
    pay = 24                                    # uç uzatmasının dışında, polinomun güvenilir aralığı
    ic = np.arange(x0 + pay, x1 - pay)
    xt = int(ic[np.argmax(kenar[ic])])
    duz = kenar.copy()
    for x in range(xt - 1, -1, -1):
        duz[x] = min(duz[x], duz[x + 1])
    for x in range(xt + 1, W):
        duz[x] = min(duz[x], duz[x - 1])
    degisen = np.flatnonzero(duz < kenar - 0.5)
    al = np.asarray(ec)[..., 3].astype(np.float64)
    yy = np.arange(H)[:, None]
    yeni = fa.copy()
    if len(degisen):
        m = np.clip(duz[None, degisen] - yy, 0, 1)
        yeni[:, degisen] = al[:, degisen] * m
    out = np.asarray(ec).copy()
    out[..., 3] = np.rint(yeni).astype(np.uint8)
    return Image.fromarray(out, "RGBA"), int(len(degisen)), [xt, round(float(duz[xt]), 1)]


def cep_gulumseme(eo: Image.Image, mentese: int, bant: int = 80, ara: int = 8, derece: int = 6):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Cebin üst kenarı tek "gülümseme" yayı (sol üst köşe →
    ortada en alt → sağ üst köşe). Kenar profili: üstte astarın üstüne düşen koyu temas gölgesi (2–8 px), altında parlak
    kenar şeridi (parlaklık 225–245), sonra cep kağıdı. Her sütunda kaba yayın ±`bant` px'inde en büyük "aşağıdaki 3 satır −
    yukarıdaki 4 satır" parlaklık sıçraması (koyu → parlak) aday; adaylara aykırısız `derece`. dereceden polinom; sonra
    polinomun ±`ara` px'inde yeniden arama + 9 sütun medyanı. Kesim = ilk parlak satır (şerit cepte, gölge gövdede)."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    lum = a[..., :3] @ LUM
    cols = np.flatnonzero(op[mentese + 20:].any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    alt = int(np.flatnonzero(op.any(1)).max())
    xm, yarim = (x0 + x1) / 2, (x1 - x0) / 2
    cs = np.vstack([np.zeros((1, W)), np.cumsum(lum, 0)])

    def sicrama(x, ylo, yhi):
        ys = np.arange(max(ylo, mentese + 2), min(yhi, alt - 6))
        if not len(ys):
            return None, -1e9
        ust = (cs[ys, x] - cs[ys - 4, x]) / 4          # y−4 … y−1
        asg = (cs[ys + 3, x] - cs[ys, x]) / 3          # y … y+2
        d = asg - ust
        i = int(np.argmax(d))
        return int(ys[i]), float(d[i])

    # kaba yay: köşelerde menteşe, ortada gövde yüksekliğinin %41'i (ilk tahmin; bant geniş)
    dip = mentese + 0.41 * (alt - mentese)
    pts = []
    for x in range(x0 + 10, x1 - 9, 2):
        u = (x - xm) / yarim
        g = mentese + (dip - mentese) * (1 - u * u) ** 0.8
        y, d = sicrama(x, int(g - bant), int(g + bant))
        if y is not None and d > 30:
            pts.append((x, y))
    p = np.array(pts, float)
    for _ in range(6):
        c = np.polyfit((p[:, 0] - xm) / yarim, p[:, 1], derece)
        r = p[:, 1] - np.polyval(c, (p[:, 0] - xm) / yarim)
        keep = np.abs(r) < max(3.0, 2.5 * r.std())
        if keep.all():
            break
        p = p[keep]
    sd = float(np.abs(r[keep]).std()) if keep.any() else 99.0
    xs = np.arange(W)
    v = np.polyval(c, (xs - xm) / yarim)
    ham = v.copy()
    for x in range(x0 + 6, x1 - 5):
        y, d = sicrama(x, int(v[x]) - ara, int(v[x]) + ara + 1)
        if y is not None and d > 24:
            ham[x] = y
    kenar = ham.copy()
    for x in range(x0 + 4, x1 - 3):
        kenar[x] = np.median(ham[x - 4:x + 5])
    kenar = np.clip(kenar, mentese, alt)
    yy = np.arange(H)[:, None]
    m_ = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    out = a.copy()
    out[..., 3] *= m_
    out[..., 3][a[..., 3] < 200] = 0           # gölge ve kenar AA'sı arka katmanda zaten var
    xd = int(np.argmax(np.where((xs > x0 + 20) & (xs < x1 - 20), kenar, -1)))
    uyar_ = []
    if len(p) < 0.5 * len(pts) or sd > 4:
        uyar_.append(f"cep yayı zayıf uyum ({len(p)}/{len(pts)} nokta, sapma {sd:.1f} px)")
    bilgi = {"method": "renk", "shape": "gulumseme",
             "detector": "kaba yay ±80 px'te koyu temas gölgesi → parlak kenar şeridi sıçraması, aykırısız 6. derece "
                         "polinom, ±8 px yeniden arama, 9 sütun medyanı",
             "body": [x0, mentese, x1, alt], "points": [len(p), len(pts)], "residual_sd": round(sd, 2),
             "bottom": [xd, round(float(kenar[xd]), 1)],
             "edge_at": {"x0+20": round(float(kenar[x0 + 20]), 1), "x0+200": round(float(kenar[x0 + 200]), 1),
                         "mid": round(float(kenar[int(xm)]), 1), "x1-200": round(float(kenar[x1 - 200]), 1),
                         "x1-20": round(float(kenar[x1 - 20]), 1)},
             "warnings": uyar_}
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


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

def sis_zemini(bg: Image.Image):
    """Telefon zemini: iki kümesiz bg_page kırpımı üst üste (MIST_BLEND px yumuşak geçiş). RGB."""
    ust = bg.crop(MIST_TOP)
    alt = bg.crop(MIST_BOTTOM)
    if alt.width != ust.width:
        alt = alt.resize((ust.width, round(alt.height * ust.width / alt.width)), Image.LANCZOS)
    w = ust.width
    H = ust.height + alt.height - MIST_BLEND
    out = Image.new("RGB", (w, H))
    out.paste(alt, (0, ust.height - MIST_BLEND))
    m = np.ones((ust.height, w))
    ramp = np.linspace(1, 0, MIST_BLEND)
    ramp = ramp * ramp * (3 - 2 * ramp)                      # smoothstep
    m[-MIST_BLEND:] = ramp[:, None]
    out.paste(ust, (0, 0), Image.fromarray((m * 255).astype(np.uint8), "L"))
    return out


def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, en koyu gri, en renkli piksel). Kırpım kümesiz olmalı: koyu dal (min_lum) ve renkli çiçek/yaprak
    (doygunluk) ikisi de denetlenir."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.30)
    a = np.asarray(ph.convert("RGB")).astype(np.float64)
    sat = a.max(-1) - a.min(-1)
    return ph, int(np.asarray(ph.convert("L")).min()), round(float(np.percentile(sat, 99.9)), 1)


def doluluk_haritasi(dosya: Path, n: int = 16, esik: int = 40) -> str:
    """Kümenin 16 × 16 doluluk haritası (site.js decor MAP): satır başına 4 onaltılık hane, bit (15 − i) = sütun i'de
    alfa > esik piksel var. Yazı bir kümenin boyalı hücresine değerse küme küçülür."""
    a = np.asarray(Image.open(dosya).convert("RGBA"))[..., 3] > esik
    H, W = a.shape
    s = ""
    for j in range(n):
        v = 0
        for i in range(n):
            if a[j * H // n:(j + 1) * H // n, i * W // n:(i + 1) * W // n].any():
                v |= 1 << (15 - i)
        s += f"{v:04x}"
    return s


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="cb-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (cherry-blossom-spring); ölçüler px, kutular [x, y, w, h], box_pct "
                         "yüzde. stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
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
    flap, duzeltilen, tip = kapak_tekduze(ec, flap_k, kb)
    kb["monotone_fix_columns"] = duzeltilen
    kb["tip_kapak_kes"] = kb["tip"]
    kb["tip"] = tip
    mentese = int(kb["hinge_row"])
    pocket, cep, cep_kenar = cep_gulumseme(eo, mentese)
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
    env_w = k_x1 - k_x0

    # ------------------------------------------------------------------ kapanış (kiraz dalı)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    c_w = COMP["closure_w_over_env"] * env_w
    s = c_w / (ck[2] - ck[0])
    c_h = (ck[3] - ck[1]) * s
    hedef = (tip[0] + COMP["closure_c_minus_tip"][0] * env_w, tip[1] + COMP["closure_c_minus_tip"][1] * env_w)
    closure_box = [hedef[0] - c_w / 2, hedef[1] - c_h / 2, hedef[0] + c_w / 2, hedef[1] + c_h / 2]

    # ------------------------------------------------------------------ kart (card_small) yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    card_w = CARD_W_OF_ENV * env_w
    card_h = card_w / card_ar
    card_x = (k_x0 + k_x1) / 2 - card_w / 2
    ck_win = win["card_small"][0]
    cw_y, cw_h = ck_win["kutu"][1] / ck_win["katman_olcu"][1], ck_win["kutu"][3] / ck_win["katman_olcu"][1]
    cep_dip = float(cep_kenar[int(round(card_x + card_w / 2))])
    hidden_top = cep_dip - (cw_y + CARD_PHOTO_ABOVE * cw_h) * card_h
    kose_kenar = float(min(cep_kenar[int(card_x)], cep_kenar[int(card_x + card_w)]))
    # kart yukarıda kalır (yukarı → aşağı → yukarı yok): out = alt köşeleri cebin kenarını kart boyunun %4'ü kadar aşmış;
    # front = aynı yerde öne gelir (%3 aşağı + × 1.05, büyüyen gölge) → home kartına (ekranın üstü) yukarı uçar
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
                          "pocket_edge_mid": round(cep_dip, 1), "photo_above_pocket": CARD_PHOTO_ABOVE}
    stage["cuts"] = {"cflap": kb, "pocket": cep}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak)}
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "the round flap's lowest point (kapak_kes egri tip, after the monotone fix)",
        "anchor_px": [round(tip[0], 1), round(tip[1], 1)], "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "env_w_px": env_w,
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": COMP["env_w"], "closure_w_over_env": COMP["closure_w_over_env"],
                 "closure_center_minus_tip_over_env_w": list(COMP["closure_c_minus_tip"])},
        "carried_by_flap": False,
        "motion": "loosens, then drifts off up and away like a blossom on the breeze (MOTION.envelope.closure) before "
                  "the flap lifts",
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

    # düz bant = kartın bütün genişliği süssüz: davet kartında çelenk sağ kenardan ~%55'e iniyor, sol alt küme ~%74'te
    # başlıyor (açıklık ≥ %90 ister); bilgi kartının altın çerçevesi serbest bölgeyi daraltıyor (≥ %85)
    for nm, gen in (("invitation_card", 90.0), ("info_card", 85.0)):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.6, .66))
        manifest[nm]["free_zone"] = fz
        t, b = dilimler(fz, min_gen=gen)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (dikey "
                                          "gerilir), alt dilim ::after — docs/11 §9; site.css --t/--b"}

    for nm in ("florals_tl", "florals_br", "divider"):
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm])
    for nm in ("florals_tl", "florals_br"):
        manifest[nm]["occupancy_16"] = doluluk_haritasi(out / manifest[nm]["files"][-1]["file"])
    # accent_1 = yaprak (süzülen, açılış girdabı, varış/kapanış), accent_2 = tek çiçek (çizgi · çiçek · çizgi, hap, yer
    # tutucu işareti); accent_3 (tomurcuk) bu temada kullanılmıyor → yazılmaz (docs/11 §1: kullanılmayan görsel yok)
    for i in (1, 2):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        im.thumbnail((200, 200), Image.LANCZOS)
        webp(im, f"accent_{i}", [im.width])

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    mist = sis_zemini(bg)
    webp(mist, "mist", [mist.width], 78)
    manifest["mist"].update({"top_crop": list(MIST_TOP), "bottom_crop": list(MIST_BOTTOM), "blend_px": MIST_BLEND})
    wide = bg.crop(MIST_WIDE)
    webp(wide, "mist_wide", [640], 78)
    manifest["mist_wide"]["crop"] = list(MIST_WIDE)
    foot = bg.crop(MIST_BOTTOM)
    webp(foot, "mist_foot", [foot.width], 76)
    manifest["mist_foot"]["crop"] = list(MIST_BOTTOM)
    # uzun sayfa zemini: bg_tile (dikişsiz kağıt lifi), bg_page'in sakin orta sisinin ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((300, 600, 700, 900))).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    ma = np.asarray(mist).reshape(-1, 3).astype(np.float64)
    manifest["mist"]["tone_top"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in ma[:mist.width * 40].mean(0))

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

    yesil = tb.yesil_denetle(out)
    if yesil:
        sys.exit(f"görünür #00FF00 kalıntısı: {yesil}")
    manifest["cleanup"] = temizlik
    manifest["checks"] = {"envelope_open_overlap_diff": round(fark_acik, 5), "green_px": 0,
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı; ilk ekran yatay telefonda da nav'ın üstünde biter,
    # hero isimleri ≥ 36 px
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, env_flap, env_body, pocket, cl_crop, katman, stage, cs, cep_kenar)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"kapak {kb.get('curve_x')} uç {kb['tip']} (kapak_kes {kb['tip_kapak_kes']}) düzeltilen sütun {duzeltilen}")
    print(f"kart yolu {stage['card_path']} · kart {katman['card']}")
    print(f"kapalı nesne {stage['closed_obj']}")
    print(f"katmanlar {katman}")
    print(f"cep {cep['edge_at']} dip {cep['bottom']} nokta {cep['points']} sapma {cep['residual_sd']}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} dilimler {manifest[nm]['slices']['top_end_pct']}–{manifest[nm]['slices']['bottom_start_pct']} "
              f"oran {manifest[nm]['slices']['ratio']}")
    for nm in ("florals_tl", "florals_br"):
        print(f"{nm} harita {manifest[nm]['occupancy_16']} oran {manifest[nm]['ratio']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · "
          f"sayfa rengi {manifest['page_color']} · sis üstü {manifest['mist']['tone_top']}")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, ec, flap, env_flap, env_body, pocket, cl_crop, katman, stage, cs, cep_kenar):
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
    sheet = sheet.crop((0, 180, W * 4, 1320))
    sheet.thumbnail((2400, 1000))
    sheet.save(oniz / "cuts_envelope.jpg", quality=86)
    # cep yayı yakın plan: açık zarfın gövdesi, kesim kenarı üstünde 1 px kırmızı (yalnız önizleme)
    yak = on(Image.fromarray(np.asarray(env_body), "RGBA"), (40, 40, 160))
    ya = np.asarray(yak).copy()
    for x in range(W):
        y = int(round(cep_kenar[x]))
        if 0 <= y < H and np.asarray(env_body)[y, x, 3] > 200:
            ya[y, x] = (255, 0, 0)
    Image.fromarray(ya).crop((40, 600, 990, 1310)).save(oniz / "cut_pocket_edge.jpg", quality=90)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    zemin = (246, 238, 240, 255)

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
    cx0, cx1 = 190 - 40, 835 + 40
    cy0, cy1 = 575, 1090
    cmp_crop = comp.crop((cx0, cy0, cx1, cy1))
    ox, oy, ow, oh = stage["closed_obj"]["box_pct"]
    env_px = ow / 100 * 900
    olcek = COMP["env_w"] / env_px
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
