#!/usr/bin/env python3
"""Burgundy Velvet Autumn teması (tasarım 07, G407) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/burgundy-velvet-autumn/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/07_Burgundy_Velvet/assets/gpt/parts/ (G207, PAKET 5 W2 + ek `velvet_swag`). Önce tools/parts_prep.py
geçici klasöre koşar (alfa kırpma, #00FF00 pencereleri, windows.json); tema klasörüne, img_src/'ye, assets/'e yazılmaz
(docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf, dikdörtgen kapak; kapanış SARILI: kurdele zarfı iki yönde sarar):
  * Kapak kesimi: tema_build.kapak_kes("egri") — düz kapak kenarı + yuvarlak iki köşe, kenarın altındaki ince temas
    gölgesinden bulunur (method "renk").
  * Açık zarf: menteşe = açık kapağın astarı ile arka astar arasındaki koyu kat çizgisi (astar bandında en koyu satır).
    Ön cep TRAPEZ: ortada düz üst kenar, iki yanda köşelere çıkan çapraz kanatlar. Noktalar her sütunda bordo astarın en
    alt pikseli (doygunluk > 60); çapraz doğrular noktaların alt zarfından, düz kenar ortadaki noktaların %90'lık değeri.
  * Hiza (docs/11 §7.1 "ölçülen dönüşüm"): kit_check sol/sağ/alt kenarları geçiyor (−0,10 · −0,10 · +0,13 %), ama açık
    gövde (kat çizgisi → alt kenar) kapalı gövdeden ~%7 uzun: açık katmanlar ölçülen ölçek + ötelemeyle kapalının sol/sağ
    kenarına, menteşesine (kapalı üst kenarı) ve alt kenarına oturtulur (manifest.stage.align_fix).
  * Kapanış (closure.png, zarfla aynı tuval 1:1): kit_check uçları — sol +0,29 · sağ +0,68 % (yatay bant zarf kenarına
    3–7 px varmıyor), üst −2,60 · alt −0,91 % (dikey bant zarfın üst/alt kenarından 41 / 14 px taşıyor). Ölçülen dönüşüm:
    yatay ölçek + öteleme ile bant uçları zarfın sol/sağ kenarına (+1 px sarma), zarfın üst/alt kenarının 1 px dışındaki
    her şey kırpılır (kurdele kenardan arkaya döner; manifest.closure.align_fix).
  * Açılış cümlesi "the velvet bow unties and the ribbon slides off the envelope's sides": docs/11 §7.1 "düğüm noktasından
    kesilip iki yana çekilir". Kapanış üç parçaya kesilir (çizim yok): cl_l (sol yatay bant + sol ilmek + sol kuyruk),
    cl_c (dikey bant sütunu + düğüm + meşe yaprağı tılsımı), cl_r (sağ). Sınır = dikey bandın sütun açıklığı (bant
    satırlarının medyanı ± 3 px), tılsım bütünüyle cl_c'de. Üçü birleşince kaynak (ortusme ≤ 0,01).
  * `bow` (RSVP kartının alt kenarı, teşekkür süsü, favicon): kapanışın dikey bandı yatay bandın üstünde ve düğümün
    altında silinir (tılsım kalır), yatay bant ilmeklerin %18 ötesinde kesilir — W1.5'teki kartın altındaki kurdele + fiyonk.
  * `charm` (gezinme ve "Tap to open" süsü, W1.1/W1.2 küçük süs): kapanıştaki altın meşe yaprağı tılsımı — altın renkle
    anahtarlanır (G − B, R), iç gölgeler dolu, kenar rengi tılsımın kendi rengi. Kırpım + anahtar; çizim yok.
  * Story girlandı (`velvet_swag`): kurdelenin orta çizgisi sütun sütun ölçülür; çerçevelerin asılacağı üç nokta
    (%26 / %50 / %74) manifest.swag.hang'e yazılır (site.css bunlarla çerçeveleri kurdeleye bağlar).
  * GPT kusurları (temizlik, çizimsiz): dış hatta yarı saydam hâle (alfa < 12 sıfır, çekirdekten uzak piksel silinir,
    kenar rengi komşu opak renge çekilir); WebP kenar saçağı için şeffaf piksellere komşu renk taşınır (renk_tasir).
    Pencereler saf #00FF00 değil (G207 qc: ortalama (6, 244, 2), alfa 250–254): parts_prep pencereyi tam şeffaf yapar,
    foto_alani her WebP'de denetler. Yeşil denetimi: tema_build.yesil_gorunur koyu zeytin yapraklarını da sayabilir →
    kroma_yesil(): parlak kroma yeşili (G ≥ 190, fazla ≥ 60) her WebP'de 0 olmalı.
  * Telefon zemini (`wall`): bg_page 2:3, telefonda cover ile köşe kümeleri kesilirdi. Zemin bg_page'in iki çiçeksiz
    bölgesinden (üst: mum ışıklı orta duvar, alt: sol alttaki altın bokeh) 110 px yumuşak geçişle; dalya kümeleri ayrı
    katman (florals_tl / florals_br), ekranda bütün. Geniş ekran: `wall_wide` (tek çiçeksiz geniş kırpım).

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
COL = ROOT / "collections/07_Burgundy_Velvet"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, en_buyuk_bolge, genislet  # noqa: E402

WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "card_small": [320, 640], "invitation_card": [480, 900], "info_card": [480, 900],
    "frame_portrait": [320, 640], "frame_landscape": [480, 960], "florals_tl": [480, 720, 900],
    "florals_br": [480, 720, 900], "divider": [300, 600], "velvet_swag": [480, 960, 1440], "bow": [320, 640],
}
# kartın cepteki duruşu: fotoğraf penceresinin en çok bu kadarı cebin düz kenarının üstünde görünür (yüzler kenarla kesilmez)
CARD_PHOTO_ABOVE = 0.06
CARD_W_OF_ENV = 0.5          # kart genişliği / zarf genişliği (W1.2 kartı; kartın altı cepte kalır)
# palet (palette.json burgundy-velvet): ivory #FBF5EE — yer tutucu tonu
IVORY = (251, 245, 238)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: çiçeksiz, mum ışıklı sakin duvar)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (430, 420, 820, 900)),
    "story_1": ("portrait", [320, 640], (360, 400, 760, 960)),
    "story_2": ("portrait", [320, 640], (400, 420, 700, 860)),
    "story_3": ("portrait", [320, 640], (300, 640, 680, 1150)),
    "venue": ("landscape", [480, 960], (300, 430, 900, 800)),
}
PH_MIN_LUM = 155   # yer tutucuda en koyu piksel (gri ton) en az bu: dalya / yaprak kırpıma girmez (çıkış ≠ 0)
PH_MAX_SAT = 60    # ... ve doygun bordo / yeşil yok (max − min kanal, %99,9'luk)
# telefon zemini (bg_page 1024×1536 kaynak pikseli): dalya kümelerinin dışında kalan iki bölge (ölçüldü: sol üst küme
# y ≤ 320'de x ≤ 511, y 360–440'ta x ≤ 283, y 600'de x ≤ 57; sağ alt küme y ≤ 880'de x ≥ 930, y 1120'de x ≥ 785,
# y 1240'ta x ≥ 640, y 1280'de x ≥ 520; sol alttaki koyu noktalar bulanık altın bokeh, çiçek değil)
WALL_TOP = (330, 380, 890, 880)        # mum ışıklı orta duvar
WALL_BOTTOM = (0, 760, 560, 1240)      # sol alttaki altın bokeh
WALL_BLEND = 110                       # px — iki kırpımın yumuşak geçiş bandı
WALL_WIDE = (250, 400, 960, 890)       # geniş ekran: tek çiçeksiz geniş kırpım (en/boy 1,45)
# girlandda çerçevelerin asıldığı noktalar (velvet_swag genişliğinin oranı; W1.3: sol ve sağ yüksekte, orta en altta)
SWAG_HANG = (0.26, 0.5, 0.74)


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
    """(tema_build.yesil_gorunur sayısı, #00FF00 benzeri parlak kroma yeşili sayısı). tema_build'in ölçütü koyu zeytin
    yaprak yeşilini de sayabilir; gerçek pencere kalıntısı parlaktır (opak ≈ (6, 244, 2), krem kağıda karışmış ≈
    (180, 250, 170)) → ek şart G ≥ 190 ve yeşil fazlası ≥ 60. Yapı bu ikinciyle durur; ilki manifest'e yazılır."""
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


def alfa_kutu(im, esik: int = 8):
    a = np.asarray(im)[..., 3] if isinstance(im, Image.Image) else im
    k = tb.alfa_kutusu(a, esik=esik)
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


def bos_doldur(m: np.ndarray) -> np.ndarray:
    """İkili maskenin iç boşlukları dolu (dışarı = maskenin tümleyeninin en büyük bölgesi)."""
    return ~en_buyuk_bolge(~m)


# ============================================================================= kesimler (bu tasarım)

def acik_mentese(eo: Image.Image) -> int:
    """Açık zarfta açık kapak (astar) ile arka astar arasındaki kat çizgisi: gövdenin yan kulakları başlamadan hemen
    önceki ±40 satırda, astar bandının (genişliğin %15–85'i) en koyu satırı."""
    a = np.asarray(eo).astype(np.float64)
    op = a[..., 3] > 200
    wid = op.sum(1)
    tam = int(np.flatnonzero(wid >= wid.max() - 2)[0])          # gövdenin tam genişliği (kulakların altı)
    xs = np.flatnonzero(op.any(0))
    x0, x1 = int(xs.min()), int(xs.max())
    lum = a[..., :3] @ tb.LUM
    bant = lum[:, int(x0 + 0.15 * (x1 - x0)):int(x0 + 0.85 * (x1 - x0))].mean(1)
    lo, hi = tam - 60, tam + 10
    return int(lo + np.argmin(bant[lo:hi]))


def trapez_cep_kes(eo: Image.Image, ust: int):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Noktalar: her sütunda bordo astarın en alt pikseli
    (doygunluk > 60) menteşe … gövde ortası arasında. Sol/sağ çapraz doğrular noktaların alt zarfından (astarın açık
    yaprak desenindeki yukarıda kalan noktalar atılır), düz kenar ortadaki noktaların %90'lık değeri;
    kenar = min(sol, sağ, düz) + 1; köşelerde doğrunun ≤ 6 px altındaki astar noktası kenarı indirir."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    cols = np.flatnonzero(op.any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    alt = int(np.flatnonzero(op.any(1)).max())
    rgb = a[..., :3]
    renkli = ((rgb.max(-1) - rgb.min(-1)) > 60) & op
    sinir = ust + int(0.45 * (alt - ust))   # ön kanadın çapraz kat izleri (tan gölge, y ≈ %58–62) aramaya girmesin
    pts = []
    for x in range(x0 + 14, x1 - 14):
        r = np.flatnonzero(renkli[ust:sinir, x])
        if len(r):
            pts.append((x, ust + r.max()))
    pts = np.array(pts, float)
    xm = (x0 + x1) / 2
    # çapraz kanatlar: simetrik aykırı ayıklama (kat izindeki tek tük alçak nokta doğruyu aşağı çekmesin)
    Lp = _saglam_dogru(pts[(pts[:, 0] > x0 + 12) & (pts[:, 0] < x0 + 0.15 * (x1 - x0))])
    Rp = _saglam_dogru(pts[(pts[:, 0] > x1 - 0.15 * (x1 - x0)) & (pts[:, 0] < x1 - 12)])
    orta = pts[(pts[:, 0] > xm - 160) & (pts[:, 0] < xm + 160)][:, 1]
    duz = float(np.percentile(orta, 90))
    xs = np.arange(W)
    kenar = np.minimum(np.minimum(Lp[0] * xs + Lp[1], Rp[0] * xs + Rp[1]), duz) + 1
    pi = pts[:, 0].astype(int)
    fark = pts[:, 1] + 1 - kenar[pi]
    duzelt = (fark > 0) & (fark <= 6)
    kenar[pi[duzelt]] = pts[duzelt, 1] + 1
    yum = kenar.copy()
    for x in range(x0 + 2, x1 - 2):
        yum[x] = np.median(kenar[x - 2:x + 3])
    kenar = yum
    art = pts[:, 1] + 1 - kenar[pi]
    fx0, fx1 = (duz - Lp[1]) / Lp[0], (duz - Rp[1]) / Rp[0]
    icinde = (pts[:, 0] > fx0 + 12) & (pts[:, 0] < fx1 - 12)    # kartın geçtiği düz kenar (köşe/dirsek hariç)
    yy = np.arange(H)[:, None]
    m = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    cep = a.copy()
    cep[..., 3] *= m
    bilgi = {"method": "renk", "shape": "trapez", "body": [x0, ust, x1, alt], "left": [round(Lp[0], 4), round(Lp[1], 2), Lp[2]],
             "right": [round(Rp[0], 4), round(Rp[1], 2), Rp[2]], "flat_row": duz, "points": int(len(pts)),
             "flat_x": [round((duz - Lp[1]) / Lp[0], 1), round((duz - Rp[1]) / Rp[0], 1)],
             "lowered_columns": int(duzelt.sum()),
             "liner_above_edge_px_p50_p90": [round(float(v), 2) for v in np.percentile(-art, [50, 90])],
             "liner_below_edge_px": int((art[icinde] > 3).sum()),
             "liner_below_edge_px_corners": int((art[~icinde] > 3).sum()),
             "note": "köşe ve dirseklerdeki (kartın geçmediği yerler) astar kırıntısı arka katmandaki aynı astarın "
                     "üstünde durur, görünmez",
             "edge_at": {"x0": round(float(kenar[x0]), 1), "mid": round(float(kenar[int(xm)]), 1), "x1": round(float(kenar[x1]), 1)},
             "warnings": []}
    if min(Lp[2], Rp[2]) < 40 or bilgi["liner_below_edge_px"] > 0.01 * icinde.sum():
        bilgi["warnings"].append(f"cep kenarı zayıf: {Lp[2]}+{Rp[2]} nokta, kenarın altında astar {bilgi['liner_below_edge_px']}")
    return Image.fromarray(np.clip(np.rint(cep), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def altin(a: np.ndarray) -> np.ndarray:
    """Altın tılsım pikselleri (bordo kadife üstünde): yeşil kanal mavinin belirgin üstünde, opak."""
    return (a[..., 1] - a[..., 2] > 35) & (a[..., 0] > 110) & (a[..., 1] > 70) & (a[..., 3] > 128)


def daralt(m: np.ndarray, r: int) -> np.ndarray:
    return ~genislet(~m, r)


def tilsim_maskesi(a: np.ndarray) -> np.ndarray:
    """Tılsımın dolu maskesi: en büyük altın bölgenin kutusu (+12 px) içindeki bütün altın pikseller (koyu damarlar
    tılsımı birkaç bölgeye ayırabiliyor), kapama (3 px genişlet → delikleri doldur → 3 px daralt)."""
    g = altin(a)
    b = en_buyuk_bolge(g)
    ys, xs = np.nonzero(b)
    kutu = np.zeros_like(g)
    kutu[max(0, ys.min() - 12):ys.max() + 13, max(0, xs.min() - 12):xs.max() + 13] = True
    return daralt(bos_doldur(genislet(g & kutu, 3)), 3)


def tilsim_dolu(a: np.ndarray) -> np.ndarray:
    """Tılsımın kendi pikselleri: kapamanın içinde altın ya da koyu kahve damar (G ≥ B + 5); halkanın deliği ve loblar
    arasında görünen bordo kadife (B > G) dışarıda kalır."""
    return tilsim_maskesi(a) & ((a[..., 1] - a[..., 2] >= 5) | altin(a))


def kapanis_hizala(cl: Image.Image, ec: Image.Image):
    """Sarılı kapanış → zarfın kenarlarına oturmuş kapanış (tam tuval) + bilgi. Yatay bant satırlarında (genişliği
    zarfın %75'inden fazla olan satırlar) bandın sol/sağ ucu ile zarfın aynı satırdaki kenarı (medyan) ölçülür; yatay
    ölçek + öteleme ile uçlar zarf kenarının 1 px dışına; sonra zarfın alfa kutusunun 1 px dışındaki her şey kırpılır."""
    ca = np.asarray(cl).astype(np.float64)
    ea = np.asarray(ec)[..., 3] > 128
    km = ca[..., 3] > 128
    H, W = km.shape
    zg = ea.sum(1)
    satir = [y for y in range(H) if km[y].sum() > 0.75 * zg.max() and ea[y].any()]
    cl0 = np.median([np.argmax(km[y]) for y in satir])
    cl1 = np.median([W - np.argmax(km[y, ::-1]) for y in satir])
    e0 = np.median([np.argmax(ea[y]) for y in satir])
    e1 = np.median([W - np.argmax(ea[y, ::-1]) for y in satir])
    t0, t1 = e0 - 1, e1 + 1
    sx = (t1 - t0) / (cl1 - cl0)
    dx = t0 - cl0 * sx
    r = cl.resize((max(1, round(W * sx)), H), Image.LANCZOS)
    tuval = Image.new("RGBA", (W, H))
    tuval.paste(r, (round(dx), 0))
    ek = alfa_kutu(ec, 128)
    a = np.asarray(tuval).copy()
    once_ust = int((a[:ek[1] - 1, :, 3] > 128).any(1).sum())
    once_alt = int((a[ek[3] + 1:, :, 3] > 128).any(1).sum())
    a[:ek[1] - 1, :, 3] = 0
    a[ek[3] + 1:, :, 3] = 0
    a[:, :ek[0] - 1, 3] = 0
    a[:, ek[2] + 1:, 3] = 0
    bilgi = {"band_rows": [int(satir[0]), int(satir[-1])], "band_ends_px_before": [round(float(cl0), 1), round(float(cl1), 1)],
             "envelope_edges_px": [round(float(e0), 1), round(float(e1), 1)], "scale_x": round(float(sx), 5),
             "offset_x_px": round(float(dx), 1), "trimmed_rows": {"above_top": once_ust, "below_bottom": once_alt},
             "reason": "kit_check: yatay bant uçları zarf kenarına 3–7 px varmıyor, dikey bant üstten 41 px / alttan 14 px "
                       "taşıyor; uçlar kenara (+1 px sarma), taşan kısım kenarda kırpıldı (kurdele kenardan arkaya döner)"}
    return Image.fromarray(a, "RGBA"), bilgi


def kapanis_parcala(cl: Image.Image):
    """Hizalanmış kapanış → (cl_l, cl_c, cl_r, bilgi): dikey bant sütunu (bandın yatay bandın üstündeki ve altındaki
    satırlarda medyan sol/sağ kenarı ± 3 px) + tılsım (altın bölge, delikleri dolu, +2 px) = cl_c; solu cl_l, sağı cl_r.
    Üçü birlikte kaynağın kendisi (alfa çarpanı 0/1)."""
    a = np.asarray(cl).astype(np.float64)
    km = a[..., 3] > 128
    H, W = km.shape
    zg = km.sum(1)
    bant_sat = np.flatnonzero(zg > 0.75 * zg.max())
    ust, alt = int(bant_sat.min()), int(bant_sat.max())
    rows = [y for y in range(H) if (y < ust - 120 or y > alt + 260) and km[y].any() and zg[y] < 0.2 * W]
    b0 = float(np.median([np.argmax(km[y]) for y in rows]))
    b1 = float(np.median([W - np.argmax(km[y, ::-1]) for y in rows]))
    c0, c1 = int(round(b0 - 3)), int(round(b1 + 3))
    tilsim = genislet(tilsim_maskesi(a), 2)
    mc = np.zeros((H, W), bool)
    mc[:, c0:c1] = True
    mc |= tilsim
    ml = np.zeros((H, W), bool)
    ml[:, :c0] = True
    ml &= ~mc
    mr = ~(mc | ml)
    out = []
    for m in (ml, mc, mr):
        p = a.copy()
        p[..., 3] *= m
        out.append(Image.fromarray(np.clip(np.rint(p), 0, 255).astype(np.uint8), "RGBA"))
    ty, tx = np.nonzero(tilsim)
    bilgi = {"band_cols": [c0, c1], "band_measured": [round(b0, 1), round(b1, 1)], "horizontal_band_rows": [ust, alt],
             "charm_box": [int(tx.min()), int(ty.min()), int(tx.max()) + 1, int(ty.max()) + 1],
             "knot_center": [round((b0 + b1) / 2, 1), round((ust + alt) / 2, 1)]}
    return out[0], out[1], out[2], bilgi


def fiyonk(cl: Image.Image, pb: dict):
    """Hizalanmış kapanış → yalnız yatay bant + fiyonk + tılsım (RSVP kartının alt kenarı; W1.5). Dikey bant yatay bandın
    üstünde (ilmeklerden boşlukla ayrılmış bileşen) ve düğümün altında (kuyruklardan ayrıldığı satırdan sonra) silinir;
    tılsım kalır. Yatay bant ilmek açıklığının %18 ötesinde düz kesilir."""
    a = np.asarray(cl).astype(np.float64)
    km = a[..., 3] > 8          # kenar yumuşaması dahil: silinen bandın 1 px'lik kenar çizgisi kalmasın
    H, W = km.shape
    ust, alt = pb["horizontal_band_rows"]
    c0, c1 = pb["band_cols"]
    xm = (c0 + c1) // 2
    sil = np.zeros((H, W), bool)
    # üst: bant, ilmeklerden boşlukla ayrılmış ayrı bir bölge (ust − 2'ye kadar)
    ustm = km.copy()
    ustm[ust - 2:] = False
    ustm[:, :c0 - 30] = False
    ustm[:, c1 + 30:] = False
    tohum = np.zeros((H, W), bool)
    tohum[: ust - 2, xm] = True
    parca = ustm & genislet(tohum, 1)
    if parca.any():
        # tohumdan büyüyen bölge = bant (ilmekler en az 1 px boşlukla ayrı; ölçüldü)
        for _ in range(200):
            yeni = genislet(parca, 1) & ustm
            if (yeni == parca).all():
                break
            parca = yeni
    # bandın yarı saydam kenar saçağı da (alfa ≤ 128; ilmekler opak, en az 1 px boşlukla ayrı)
    sil |= parca | (genislet(parca, 2) & (a[..., 3] <= 128))
    # alt: düğümün altında bandın kuyruklardan ayrı olduğu ilk satırdan aşağısı (sütun içinde kalan opak koşu)
    tm = tilsim_dolu(a)
    ayri = None
    for y in range(alt + 4, H):
        xs = np.flatnonzero(km[y])
        if not len(xs):
            continue
        # sütunu içeren koşu sütundan dar mı (kuyruklarla birleşik değil)?
        sol = xm
        while sol > 0 and km[y, sol - 1]:
            sol -= 1
        sag = xm
        while sag < W - 1 and km[y, sag + 1]:
            sag += 1
        if sol >= c0 - 6 and sag <= c1 + 14:
            ayri = y
            break
    alt_sil = np.zeros((H, W), bool)
    if ayri is not None:
        # her satırda bandın opak koşusu (sütunla sınırlı; kuyruk kökü sütuna girse de koşu aradaki boşlukta biter) +
        # 2 px'lik yarı saydam saçağı; tılsım hariç
        op = a[..., 3] > 128
        for y in range(ayri, H):
            if not op[y, c0:c1].any():
                continue
            x = xm if op[y, xm] else int(c0 + np.argmax(op[y, c0:c1]))
            sol = x
            while sol > c0 - 4 and op[y, sol - 1]:
                sol -= 1
            sag = x
            while sag < c1 + 4 and op[y, sag + 1]:
                sag += 1
            alt_sil[y, sol:sag + 1] = True
        alt_sil |= genislet(alt_sil, 2) & (a[..., 3] <= 128)
        alt_sil[ayri + 30:, c0 - 4:c1 + 5] = True     # 30 satır sonra kuyruklar sütundan uzak: kalan saçak da gider
    alt_sil &= ~tm
    sil |= alt_sil
    p = a.copy()
    p[..., 3] *= ~sil
    # yatay bant: ilmek açıklığı (bant satırlarının hemen üstündeki satırlardaki opak sütunlar) ± %18
    ilmek = (a[..., 3] > 128)[ust - 60:ust - 4].any(0)
    xs = np.flatnonzero(ilmek)
    lx0, lx1 = int(xs.min()), int(xs.max())
    pay = 0.18 * (lx1 - lx0)
    k0, k1 = int(lx0 - pay), int(lx1 + pay)
    p[:, :k0, 3] = 0
    p[:, k1:, 3] = 0
    im = Image.fromarray(np.clip(np.rint(p), 0, 255).astype(np.uint8), "RGBA")
    bilgi = {"removed_band_px": int(sil.sum()), "band_split_row": ayri, "loops_x": [lx0, lx1], "band_cut_x": [k0, k1]}
    return im, bilgi


def tilsim_kes(cl: Image.Image):
    """Kapanıştaki altın meşe yaprağı tılsımı (halkası dahil): altın renkle yumuşak anahtar, iç gölgeler dolu, kenar
    rengi tılsımın kendi opak renginden. (RGBA kırpım, bilgi)."""
    a = np.asarray(cl).astype(np.float64)
    g = altin(a)
    b = tilsim_maskesi(a)
    ys, xs = np.nonzero(b)
    x0, y0, x1, y1 = xs.min() - 6, ys.min() - 6, xs.max() + 7, ys.max() + 7
    t = a[y0:y1, x0:x1].copy()
    dolu = b[y0:y1, x0:x1]
    rgb = t[..., :3]
    yumusak = np.clip((rgb[..., 1] - rgb[..., 2] - 15) / 30, 0, 1) * np.clip((rgb[..., 0] - 80) / 40, 0, 1)
    ic = dolu & ~genislet(~dolu, 1)
    kendi = tilsim_dolu(a)[y0:y1, x0:x1]          # halka deliği / lob arası bordo kadife saydam
    alfa = np.where(ic & kendi, 1.0, np.where(dolu, yumusak, 0.0))
    kat = (ic & g[y0:y1, x0:x1]).astype(np.float64)
    pay = _kutu_bulanik(kat, 3)
    yakin = np.stack([_kutu_bulanik(rgb[..., i] * kat, 3) for i in range(3)], -1) / np.maximum(pay, 1e-6)[..., None]
    rgb = np.where((~ic[..., None]) & (pay[..., None] > 1e-3), yakin, rgb)
    im = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), alfa * 255]).round().astype(np.uint8), "RGBA")
    return im.crop(im.getbbox()), {"source": "closure", "box_px": [int(x0), int(y0), int(x1), int(y1)], "gold_px": int(b.sum())}


def kurdele_cizgisi(sw: Image.Image):
    """Girland kurdelesinin her sütundaki üst/alt kenarı (yalnız tek koşulu sütunlar: fiyonk ve kuyruklar hariç)."""
    km = np.asarray(sw)[..., 3] > 128
    H, W = km.shape
    ust = np.full(W, np.nan)
    alt = np.full(W, np.nan)
    for x in range(W):
        ys = np.flatnonzero(km[:, x])
        if not len(ys):
            continue
        if ys.max() - ys.min() + 1 == len(ys) and len(ys) < 0.3 * H:
            ust[x], alt[x] = ys.min(), ys.max()
    return ust, alt


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(6.0, 94.0), min_gen: float = 70.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın neredeyse bütün genişliğinde süs yok (açıklık
    ≥ min_gen; yalnız ince altın çerçeve çizgisi). En uzun kesintisiz düz bant gerilir. (t, b, [t, b])."""
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
    """(yer tutucu, en koyu gri, en doygun piksel). Kırpım çiçeksiz olmalı: koyu yaprak (min_lum) ve doygun bordo/yeşil
    (sat) ikisi de denetlenir."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.36)
    a = np.asarray(ph.convert("RGB")).astype(np.float64)
    sat = a.max(-1) - a.min(-1)
    return ph, int(np.asarray(ph.convert("L")).min()), round(float(np.percentile(sat, 99.9)), 1)


def comp_olc():
    """W1.1 comp'unda zarf (krem, açık, az doygun en büyük bölge) ve kurdele (bordo) — kapanışın zarfa oranı karşılaştırma
    için (sarılı kapanış 1:1 tuvalde; ölçek comp'tan alınmaz, yalnız raporlanır)."""
    a = np.asarray(Image.open(COMPS / "web_1_envelope.png").convert("RGB")).astype(np.float64)
    lum = a @ tb.LUM
    sat = a.max(-1) - a.min(-1)
    krem = (lum > 200) & (sat < 52)          # zarf kağıdı (arka plan şeftalisi daha doygun: ≈ 64)
    krem[:560] = False                       # isimlerin arkasındaki açık ışık
    krem[1150:] = False
    xs = np.flatnonzero(krem.sum(0) > 200)
    zx0, zx1 = int(xs.min()), int(xs.max()) + 1
    # dikey kurdele bandı zarfı üstten alta sarar: satır aralığı = bandın orta sütunundaki bordo satırlar
    bordo = (a[..., 0] - a[..., 1] > 50) & (lum < 130)
    sut = np.flatnonzero(bordo[640:700].sum(0) > 40)
    xm = int((sut.min() + sut.max()) // 2)
    ys = np.flatnonzero(bordo[560:1150, xm - 3:xm + 4].all(1)) + 560
    zy0, zy1 = int(ys.min()), int(ys.max()) + 1
    return {"envelope_box_px": [zx0, zy0, zx1, zy1], "envelope_w": zx1 - zx0, "vertical_band_px": [int(sut.min()), int(sut.max()) + 1],
            "vertical_band_w_over_env_w": round((sut.max() + 1 - sut.min()) / (zx1 - zx0), 4)}


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="bv-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (burgundy-velvet-autumn); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
                         "stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q
    temizlik = {}

    def webp(im, name, widths, q_=None):
        webp_yaz(im, name, widths, q_ or q, manifest, out)

    # ------------------------------------------------------------------ zarf (aynı tuval: 1024×1536)
    ec_raw = Image.open(PARTS / "envelope_closed.png").convert("RGBA")
    eo_raw = Image.open(PARTS / "envelope_open.png").convert("RGBA")
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    ec, temizlik["envelope_closed"] = hale_temizle(ec_raw, sert=True)
    eo, temizlik["envelope_open"] = hale_temizle(eo_raw, sert=True)
    W, H = ec.size

    flap_c, kb = tb.kapak_kes(ec, bicim="egri")
    uyar("env_cflap", kb)
    if kb["method"] != "renk":
        sys.exit("kapak kenarı görselden bulunamadı (geometrik yedek) — kesim önizlemesine bak (--onizleme)")
    flap = Image.new("RGBA", (W, H))
    flap.paste(flap_c, (0, 0))
    a_ust = acik_mentese(eo)
    pocket, cep, cep_kenar = trapez_cep_kes(eo, a_ust)
    uyar("env_pocket", cep)
    # açık zarf: kapak (kat çizgisine kadar + 3 px bindirme), gövde (astar + arka + yan kulaklar), ön cep
    yy = np.arange(H)[:, None]
    eoa = np.asarray(eo).astype(np.float64)
    m_flap = np.clip(a_ust + 3 - yy + 0.5, 0, 1) * np.ones((1, W))
    m_body = np.clip(yy - (a_ust - 2) + 0.5, 0, 1) * np.ones((1, W))
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
    a_alt = int(cep["body"][3]) + 1
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
                     "reason": "GPT: açık gövde (kat çizgisi → alt kenar) kapalı gövdeden ~%7 uzun; ölçülen ölçek + öteleme "
                               "ile sol/sağ, menteşe ve alt kenar çakışır"}
    print(f"hiza düzeltmesi: açık katmanlar × ({sx:.4f}, {sy:.4f}), öteleme ({dx:.1f}, {dy:.1f}) px")

    # ------------------------------------------------------------------ kapanış (sarılı kurdele + fiyonk + tılsım)
    cl_h, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    cl, kap_hiza = kapanis_hizala(cl_h, ec)
    cl_l, cl_c, cl_r, parca = kapanis_parcala(cl)
    fark_kap = tb.ortusme(cl, [cl_l, cl_c, cl_r])
    if fark_kap > 0.01:
        sys.exit(f"kapanış parçaları kaynakla örtüşmüyor ({fark_kap:.4f} > 0.01)")
    bow, bow_bilgi = fiyonk(cl, parca)
    charm, charm_bilgi = tilsim_kes(cl)

    # ------------------------------------------------------------------ kart (card_small) yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    card_w = CARD_W_OF_ENV * (k_x1 - k_x0)
    card_h = card_w / card_ar
    card_x = (k_x0 + k_x1) / 2 - card_w / 2
    ck_win = win["card_small"][0]
    cw_y, cw_h = ck_win["kutu"][1] / ck_win["katman_olcu"][1], ck_win["kutu"][3] / ck_win["katman_olcu"][1]
    cep_duz = float(cep_kenar[int(round(card_x + card_w / 2))])
    hidden_top = cep_duz - (cw_y + CARD_PHOTO_ABOVE * cw_h) * card_h
    kose_kenar = float(min(cep_kenar[int(card_x)], cep_kenar[int(card_x + card_w)]))
    # kart yukarıda kalır (yukarı → aşağı → yukarı yok): out = alt köşeleri cebin kenarını kartın %4'ü kadar aşmış;
    # front = aynı yerde öne gelir (%3 aşağı + × 1.04, büyüyen gölge) → home kartına yukarı uçar
    out_top = kose_kenar - 0.04 * card_h - card_h
    front_top = out_top + 0.03 * card_h
    card_box_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    ob_box = alfa_kutu(eo, esik=1)
    cb_box = alfa_kutu(ec, esik=1)
    clb = alfa_kutu(cl, esik=1)
    scale_front = 1.04
    fr_w, fr_h = card_w * scale_front, card_h * scale_front
    front_box = [card_x - (fr_w - card_w) / 2, front_top - (fr_h - card_h) / 2,
                 card_x + card_w + (fr_w - card_w) / 2, front_top + card_h + (fr_h - card_h) / 2]
    X0 = min(cb_box[0], ob_box[0], clb[0], front_box[0])
    X1 = max(cb_box[2], ob_box[2], clb[2], front_box[2])
    Y0 = min(cb_box[1], ob_box[1], out_top, front_box[1], clb[1])
    Y1 = max(cb_box[3], ob_box[3], clb[3])
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
    for ad, im in (("cl_l", cl_l), ("cl_c", cl_c), ("cl_r", cl_r)):
        k = alfa_kutu(im, esik=1)
        oran = (k[2] - k[0]) / SW
        webp(im.crop(k), ad, [max(40, round(880 * oran / 2)), max(80, round(880 * oran))])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    katman["card"] = pct(card_box_hidden)
    stage["parts"] = katman
    stage["hinge_pct"] = round(100 * (k_ust - Y0) / SH, 3)
    stage["body_bottom_pct"] = round(100 * (k_alt - Y0) / SH, 3)
    env_y0 = int(np.flatnonzero(eca0.max(1) > 200).min())
    stage["closed_obj"] = {"box_pct": pct([k_x0, env_y0, k_x1, k_alt]), "aspect": round((k_x1 - k_x0) / (k_alt - env_y0), 4),
                           "frac_w": round((k_x1 - k_x0) / SW, 5), "top_frac_of_stage_w": round((env_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - k_alt) / SW, 5)}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3), "front_scale": scale_front,
                          "pocket_edge_at_card_corners": round(kose_kenar, 1), "card_w_of_env": CARD_W_OF_ENV,
                          "pocket_flat_edge": round(cep_duz, 1), "photo_above_pocket": CARD_PHOTO_ABOVE}
    # kartın son duruşunun (front) merkezi, sahne yüzdesi: mum ışığı hâlesi (site.css .glow) buraya ortalanır
    stage["card_front_center_pct"] = [round(100 * ((front_box[0] + front_box[2]) / 2 - X0) / SW, 3),
                                      round(100 * ((front_box[1] + front_box[3]) / 2 - Y0) / SH, 3)]
    stage["cuts"] = {"cflap": kb, "pocket": cep, "open_hinge_row": a_ust}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak),
                       "closure_pieces_overlap_diff": round(fark_kap, 5)}
    stage["align_fix"] = hiza_duzeltme
    manifest["stage"] = stage
    comp = comp_olc()
    band_w = parca["band_measured"][1] - parca["band_measured"][0]
    manifest["closure"] = {
        "wrapped": True,
        "anchor": "same canvas 1:1 (wrapped ribbon, docs/11 §7.1: sarılı kapanış zarfla aynı tuvalde üst üste)",
        "anchor_px": [0, 0], "box_pct": pct(clb), "width_pct": pct(clb)[2],
        "center_pct": [round(100 * (parca["knot_center"][0] - X0) / SW, 3), round(100 * (parca["knot_center"][1] - Y0) / SH, 3)],
        "measured_from": "comps/web_1_envelope.png",
        "comp": comp, "band_w_over_env_w": round(band_w / (k_x1 - k_x0), 4),
        "align_fix": kap_hiza, "pieces": parca, "carried_by_flap": False,
        "motion": "the bow unties (the knot halves part, the loops slacken), the halves slide off the envelope's left "
                  "and right sides, the vertical band with the knot and the charm slides off the bottom — before the "
                  "flap lifts (MOTION.envelope.closure)",
    }

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca_ad in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca_ad}.png").convert("RGBA")
        im, temizlik[parca_ad] = hale_temizle(im, sert=True)
        webp(im, parca_ad, WIDTHS[parca_ad])
        slots[ad] = tb.foto_alani(prep, win, parca_ad, ad, manifest, out)
        if oniz:
            bg = Image.new("RGBA", im.size, (40, 40, 40, 255)); bg.alpha_composite(im)
            bg.convert("RGB").save(oniz / f"kenar_{parca_ad}.jpg", quality=88)
    manifest["photo_slots"] = slots

    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        # davet kartının yağlı boya dalyaları yoğun: q 74 (900 px ≤ 250 KB, docs/11 §6)
        webp(im, nm, WIDTHS[nm], 74 if nm == "invitation_card" else None)
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        # gerilen orta bant yalnız düz kağıt + iki yandaki ince altın çizgi olmalı: davet kartında dalya kümelerinin
        # uçları %40–55 solda, %59'dan sonra sağda; bilgi kartında köşe süsleri %90'dan sonra → satır açıklığı ≥ %85
        t, b, _ = dilimler(fz, min_gen=85.0)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (dikey "
                                          "gerilir), alt dilim ::after — docs/11 §9; site.css --t/--b"}
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.8, .86))

    for nm in ("florals_tl", "florals_br", "divider"):
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm], 76 if nm.startswith("florals") else None)
    # köşe kümelerinin 16 × 16 yaprak haritası (site.js decor: duvardaki yazı hiçbir yaprağın üstünde durmaz)
    for nm in ("florals_tl", "florals_br"):
        f = out / manifest[nm]["files"][0]["file"]
        al = np.asarray(Image.open(f).convert("RGBA").resize((16, 16), Image.BOX))[..., 3] > 24
        manifest[nm]["leaf_map"] = "".join(f"{int(''.join('1' if v else '0' for v in row), 2):04x}" for row in al)
    for i in (1, 2, 3):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        im.thumbnail((200, 200), Image.LANCZOS)
        webp(im, f"accent_{i}", [im.width])
    # girland (velvet_swag): kurdele orta çizgisi + çerçevelerin asılacağı noktalar
    sw, temizlik["velvet_swag"] = hale_temizle(Image.open(prep / "velvet_swag.png"), sert=False)
    sw = sw.crop(alfa_kutu(sw))
    webp(sw, "velvet_swag", WIDTHS["velvet_swag"])
    su, sa = kurdele_cizgisi(sw)
    gw, gh = sw.size
    hang = []
    for f in SWAG_HANG:
        x = int(round(f * gw))
        top, bot = float(np.nanmedian(su[x - 6:x + 7])), float(np.nanmedian(sa[x - 6:x + 7]))
        hang.append({"x_pct": round(100 * f, 2), "top_pct_of_w": round(100 * top / gw, 3), "bottom_pct_of_w": round(100 * bot / gw, 3),
                     "mid_pct_of_w": round(100 * (top + bot) / 2 / gw, 3)})
    manifest["velvet_swag"]["hang"] = hang
    manifest["velvet_swag"]["aspect_hw"] = round(gh / gw, 5)
    bk = alfa_kutu(bow)
    bow_c = bow.crop(bk)
    webp(bow_c, "bow", WIDTHS["bow"])
    manifest["bow"].update(bow_bilgi)
    kd = parca["knot_center"]
    manifest["bow"]["knot_in_crop_pct"] = [round(100 * (kd[0] - bk[0]) / (bk[2] - bk[0]), 2),
                                           round(100 * (parca["horizontal_band_rows"][0] - bk[1]) / (bk[3] - bk[1]), 2),
                                           round(100 * (parca["horizontal_band_rows"][1] - bk[1]) / (bk[3] - bk[1]), 2)]
    charm.thumbnail((48, 96), Image.LANCZOS)
    webp(charm, "charm", [charm.width])
    manifest["charm"].update(charm_bilgi)

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    wall = duvar(bg)
    webp(wall, "wall", [wall.width], 78)
    manifest["wall"].update({"top_crop": list(WALL_TOP), "bottom_crop": list(WALL_BOTTOM), "blend_px": WALL_BLEND})
    wide = bg.crop(WALL_WIDE)
    webp(wide, "wall_wide", [wide.width], 78)
    manifest["wall_wide"]["crop"] = list(WALL_WIDE)
    # uzun sayfa zemini: bg_tile (dikişsiz boyalı tuval), bg_page'in mum ışıklı orta duvarının ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((420, 460, 820, 860))).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph, en_koyu, sat = yer_tutucu_temiz(bg, kutu, oran, max(gen))
        if en_koyu < PH_MIN_LUM or sat > PH_MAX_SAT:
            sys.exit(f"ph_{key}: kırpım {kutu} bir dekor parçası içeriyor (en koyu {en_koyu} < {PH_MIN_LUM} "
                     f"ya da doygunluk {sat} > {PH_MAX_SAT})")
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"]["aspect"] = oran
        manifest[f"ph_{key}"]["min_lum"] = en_koyu
        manifest[f"ph_{key}"]["max_sat"] = sat

    # ------------------------------------------------------------------ paylaşım görseli + favicon
    og, og_bilgi = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    og_bilgi["file"] = "og-1200x630.jpg"
    og_bilgi["bytes"] = tb.og_kaydet(og, out / og_bilgi["file"], 82)
    manifest["og"] = og_bilgi
    ikon, ikon_bilgi = tb.ikon(bow_c, 180)
    ikon.save(out / "favicon.png", optimize=True)
    ikon_bilgi.update({"source": "closure", "crop": "bow (closure without the vertical band)", "file": "favicon.png",
                       "bytes": (out / "favicon.png").stat().st_size})
    manifest["favicon"] = ikon_bilgi

    # ------------------------------------------------------------------ hiza (ham GPT dosyaları, Kaydet tuvali)
    olcu = tb.kaydet_olculeri(COL)
    hz = tb.hiza_olc(ec_raw, eo_raw, "kapak", olcu.get("envelope_closed"), olcu.get("envelope_open"),
                     kapanis=cl_raw, kapanis_tuval=olcu.get("closure"))
    manifest["align"] = hz
    print(f"hiza ({hz['durum']}): {tb.hiza_ozet(hz)}")
    for u in hz["uyarilar"]:
        print(f"UYARI  hiza: {u}")
    if hz["durum"] == "hata":
        sys.exit("kapalı/açık zarf hizası > %4 (GPT'den yeniden üretim gerekir)")
    # düzeltmeden sonra: kapalı ↔ hizalanmış açık (sol, sağ, alt kenar; px) ve kapanış uçları
    eoa2 = np.asarray(eo)[..., 3]
    oc = np.flatnonzero(eoa2.max(0) > 200)
    orr = np.flatnonzero(eoa2.max(1) > 200)
    manifest["stage"]["align_fix"]["after_px"] = {"left": int(oc.min()) - k_x0, "right": int(oc.max()) + 1 - k_x1,
                                                  "bottom": int(orr.max()) + 1 - k_alt}
    kh2 = tb.kapanis_hiza(np.asarray(ec), np.asarray(cl))
    manifest["closure"]["align_fix"]["after"] = {e["kenar"]: e["fark_px"] for e in kh2["kenarlar"]}

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
                                          "note": "tema_build.yesil_gorunur koyu yaprak yeşilini de sayabilir; parlak kroma "
                                                  "şartı (G ≥ 190, fazla ≥ 60) ile 0 — kroma_yesil()"},
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı, köşe kümeleri; ilk ekran yatay telefonda da nav'ın
    # üstünde biter, hero isimleri ≥ 36 px
    manifest["theme_check"] = {"particles": ".accent-layer", "clusters": ".corner",
                               "first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl, cl_l, cl_c, cl_r, bow_c, charm, katman, stage, cs, comp)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapalı {stage['closed_obj']}")
    print(f"parçalar {katman}")
    print(f"kart yolu {stage['card_path']} · ön merkez {stage['card_front_center_pct']}")
    print(f"kapanış hizası {kap_hiza} · parçalar {parca}")
    print(f"fiyonk {manifest['bow']} ")
    print(f"girland {hang} oran {manifest['velvet_swag']['aspect_hw']}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} dilimler {manifest[nm]['slices']['top_end_pct']}–{manifest[nm]['slices']['bottom_start_pct']} oran {manifest[nm]['slices']['ratio']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · sayfa {manifest['page_color']}")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl, cl_l, cl_c, cl_r, bow, charm, katman, stage, cs, comp):
    """Kesim önizlemeleri (gözle denetim): kapak / gövde, cep / arka, kapanış parçaları, kapalı ve açık sahne,
    compare_closure.jpg (kapalı sahne | W1.1 comp'unun zarf bölgesi)."""
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
    renkler = [(60, 140, 200), (230, 200, 60), (90, 190, 120)]
    ks = Image.new("RGBA", (W, H), (236, 233, 224, 255))
    ks.alpha_composite(ec)
    for p, r in zip((cl_l, cl_c, cl_r), renkler):
        b = Image.new("RGBA", (W, H), r + (0,))
        m = np.asarray(p)[..., 3]
        bb = np.asarray(b).copy()
        bb[..., 3] = (m > 128) * 90
        ks.alpha_composite(p)
        ks.alpha_composite(Image.fromarray(bb, "RGBA"))
    ks.crop((0, 560, W, 1360)).convert("RGB").save(oniz / "kapanis_parcalari.jpg", quality=86)
    on(bow, (236, 233, 224)).save(oniz / "fiyonk.jpg", quality=88)
    on(charm.resize((charm.width * 4, charm.height * 4), Image.LANCZOS), (236, 233, 224)).save(oniz / "tilsim.jpg", quality=90)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    sahne = Image.new("RGBA", (900, round(SH * k)), (236, 233, 224, 255))

    def koy(im, p):
        x, y, w, h = p
        r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
        sahne.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
    for ad, im in (("env_closed", ec), ("env_cflap", flap)):
        kk = alfa_kutu(im, 1)
        koy(im.crop([int(np.floor(X0)), kk[1], int(np.ceil(X0 + SW)), kk[3]]), katman[ad])
    for ad, im in (("cl_l", cl_l), ("cl_c", cl_c), ("cl_r", cl_r)):
        koy(im.crop(alfa_kutu(im, 1)), katman[ad])
    kapali = sahne.copy()
    sahne.convert("RGB").save(oniz / "kapali_sahne.jpg", quality=88)
    sahne = Image.new("RGBA", sahne.size, (236, 233, 224, 255))
    for ad, im in (("env_flap", env_flap), ("env_body", env_body)):
        kk = alfa_kutu(im, 1)
        koy(im.crop([int(np.floor(X0)), kk[1], int(np.ceil(X0 + SW)), kk[3]]), katman[ad])
    koy(cs, katman["card"])
    kk = alfa_kutu(pocket, 1)
    koy(pocket.crop([int(np.floor(X0)), kk[1], int(np.ceil(X0 + SW)), kk[3]]), katman["env_pocket"])
    sahne.convert("RGB").save(oniz / "acik_sahne.jpg", quality=88)
    # compare_closure.jpg: kapalı sahnenin zarf bölgesi | comp'un zarf bölgesi (aynı yükseklik)
    cb = katman["env_closed"]
    zx0, zy0 = cb[0] / 100 * 900, cb[1] / 100 * SH * k
    zx1, zy1 = zx0 + cb[2] / 100 * 900, zy0 + cb[3] / 100 * SH * k
    pay = 60
    sol = kapali.crop((0, max(0, int(zy0 - pay)), 900, int(min(kapali.height, zy1 + pay)))).convert("RGB")
    cimg = Image.open(COMPS / "web_1_envelope.png").convert("RGB")
    ex0, ey0, ex1, ey1 = comp["envelope_box_px"]
    ew = ex1 - ex0
    olc = ew / (900 * cb[2] / 100)          # comp px / önizleme px
    sag = cimg.crop((int(ex0 - zx0 * olc), int(ey0 - pay * olc), int(ex1 + (900 - zx1) * olc), int(ey1 + pay * olc)))
    sag = sag.resize((900, round(sag.height * 900 / sag.width)), Image.LANCZOS)
    hh = max(sol.height, sag.height)
    cmp_im = Image.new("RGB", (1820, hh), (255, 255, 255))
    cmp_im.paste(sol, (0, 0))
    cmp_im.paste(sag, (920, 0))
    cmp_im.save(oniz / "compare_closure.jpg", quality=86)


if __name__ == "__main__":
    main()
