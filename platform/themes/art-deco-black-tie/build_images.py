#!/usr/bin/env python3
"""Art Deco Black-Tie teması (tasarım 06, G406) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, aynalar, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/art-deco-black-tie/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/06_Art_Deco_Noir/assets/gpt/parts/ (G206, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" doldurma, windows.json); tema klasörüne, img_src/'ye,
assets/'e yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.4 — gatefold, iki kapı):
  * Dikiş: kapalı dosyanın ortasında iki kapının kalın altın kenar şeritleri arasında koyu bir boşluk var. tema_build
    .dikis_bul (kat_bul: "iki yanından koyu ince çizgi") sol kapının ince altın ışın çizgileri arasındaki koyu bir sütunu
    buluyordu (x 752; gerçek dikiş ~769, kutu ortası). Burada dikiş = kutu ortasının ± %4'ünde 9 px yumuşatılmış sütun
    parlaklığının en düşük olduğu sütun (koyu boşluğun ortası).
  * Katlanma çizgileri (açık görsel): tema_build.kat_bul orta panelin çift altın çerçeve çizgisinin arasındaki koyu
    şeridi katlanma sanıyordu (x 465 / 1070; kit_check'in "sol kat +1,43 · sağ kat −1,60 %" UYARI'sı buradan). Gerçek
    katlanma = kapı ile orta panelin birleştiği sütun; orta panelin basamaklı tepesinin yanında kapı ile panel arasında
    saydam bir boşluk var: o satırlarda soldaki ilk opak koşunun bittiği / sağdaki son koşunun başladığı sütunların
    medyanı (sol 453, sağ 1083 → kapalı kenarlarla fark +0,65 / −0,78 %, ±%1,5 içinde).
  * Hiza (docs/11 §7.1 "ölçülen dönüşüm"): açık görsel yatayda × (kapalı genişlik / orta panel genişliği), dikeyde
    üst/alt alfa kenarına ölçeklenip ötelenir → katlanma çizgileri kapalı dosyanın sol/sağ kenarına, üst ve alt kenarlar
    üst üste oturur (manifest.stage.align_fix); 90°'de her kapı aynı menteşede el değiştirir.
  * Kesimler: kapalı → door_l / door_r (dikişten); açık → door_l_in / center / door_r_in (katlanma çizgilerinden),
    pocket = orta panelin lacivert cebi (tema_build.cep_kes "duz": düz üst kenar, altın kenar çizgisi cepte).
  * Kapanış (closure.png = altın deco madalyon + inci, kare tuvalde büyük çizildi): yeri kesim geometrisine bağlı —
    çapa = dikiş sütunu, W1.1'de ölçülen yükseklik ("fastened over the center seam, a little above the middle"), boy =
    W1.1'deki madalyon genişliği / dosya genişliği. Madalyonun merkezi incinin merkezi.
  * Kart (card_small) orta cebin arkasında; cepte beklerken yalnız üst çerçeve bandı görünür (foto penceresi cebin
    altında), yükselince alt köşeleri cebin kenarını kartın %4'ü kadar aşar, öne gelirken olduğu yerde büyür.
  * Işınlar (W1.1–W1.5'in üst ortasındaki altın ışın yelpazesi): bg_page'in sağ yarısındaki ışınlar (x 512–1024, y 0–420;
    yelpaze x 511,5 etrafında simetrik) aynalanıp tam yelpaze yapılır, zeminden yüksek geçirgen süzgeçle ayrılır (koyu
    zemin siyah, altın çizgiler kalır) → CSS `mix-blend-mode: screen` ile her lacivert zeminde aynı görünür. bg_page'in
    köşe kümeleri telefonda cover ile kesilirdi: kümeler ayrı katman (decor_tl / decor_br), zemin bg_tile.
  * GPT kusurları (kesimle/temizlikle, çizimsiz): dış hatta yarı saydam hâle (alfa < 12 sıfır, çekirdekten uzak
    piksel silinir, kenar rengi komşu opak renge çekilir); iki çerçevenin penceresindeki yarı saydam/koyu lekeler (G206
    Sonuç) → parts_prep leke dolgusu (pencere TAM şeffaf; foto_alani her WebP'de denetler); pencere çevresinde kalan
    yeşil/eflatun ayrıştırma saçağı çerçeve renginden; WebP kenar saçağı için şeffaf piksellere komşu renk taşınır.
  * Yer tutucular: bg_page'in sade lacivert bölgelerinden (ışın ve küme dışı) yumuşak, fildişine hafif tonlanmış kırpım;
    altın piksel yok (manifest.ph_*.max_gold ≤ 18).

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json. site.css'teki yüzdeler
manifest'ten; --onizleme DIR kesim önizlemeleri yazar (gözle denetim). Tema klasörü ≤ 3 MB. Bağımlılık: Pillow + numpy.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/06_Art_Deco_Noir"
PARTS = COL / "assets/gpt/parts"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, en_buyuk_bolge, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "door_l": [240, 480], "door_r": [240, 480], "door_l_in": [240, 480], "door_r_in": [240, 480],
    "center": [320, 640], "pocket": [320, 640], "closure": [240, 480], "card_small": [320, 640],
    "invitation_card": [480, 760], "info_card": [480, 878], "frame_portrait": [320, 640],
    "frame_landscape": [480, 960], "decor_tl": [320, 480, 720], "decor_br": [320, 480, 720], "divider": [300, 600],
}
# palet (palette.json navy-deco-gold): ivory #F5EEDC — yer tutucu tonu
IVORY = (245, 238, 220)
# kart cepte: kartın üst bandının bu kadarı (kart yüksekliği oranı) cebin düz kenarının üstünde görünür; foto penceresi
# kartın %11,2'sinden başlar → pencere cebin altında kalır
CARD_TOP_ABOVE = 0.085
CARD_W_OF_ENV = 0.80      # kart genişliği / kapalı dosya genişliği (orta panelin altın çerçevesinin içinde)
FRONT_SCALE = 1.06
# W1.1 comp ölçümü (comps/web_1_envelope.png, 1024×1536): dosyanın lacivert gövdesi x 222–802 (genişlik 580), üst =
# dikişteki basamaklı tepe y 435, alt kenar y 1249 (yükseklik 814); madalyon kolları x 435–588 (153), incinin merkezi
# (511,5, 818) = dikiş sütunu. → madalyon genişliği / dosya genişliği 0,2638; merkez dosya yüksekliğinin 0,4705'inde
# ("a little above the middle").
COMP = {"env_x": (222.0, 802.0), "env_y": (435.0, 1249.0), "clasp_x": (435.0, 588.0), "clasp_c": (511.5, 818.0)}
# yer tutucu kırpımları (bg_page 1024×1536): ışınlar y < 420; sol üst küme x < 335 ve y < 565; sağ alt küme x ≥ 585 ve
# y ≥ 925 — kırpımlar bunların dışında, sade lacivert kadife
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (360, 430, 900, 900)),
    "story_1": ("portrait", [320, 640], (90, 600, 560, 1480)),
    "story_2": ("portrait", [320, 640], (360, 440, 760, 900)),
    "story_3": ("portrait", [320, 640], (100, 620, 540, 1460)),
    "venue": ("landscape", [480, 960], (80, 600, 980, 915)),
}
PH_MAX_GOLD = 18    # yer tutucuda altın (R − B) fazlası en çok bu: kırpıma ışın/küme girmez (çıkış ≠ 0)
RAYS_BOX = (512, 0, 1024, 420)   # bg_page ışın yelpazesinin sağ yarısı (merkez x 511,5)


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (GPT hâlesi, saçak)

def hale_temizle(im: Image.Image, sert: bool, esik: int = 12, cekirdek: int = 96):
    """Dış hattaki yarı saydam hâleyi temizler (çizim yok). sert: kart/çerçeve/zarf gibi net kenarlı nesne.
    1) alfa < esik → 0, kalan alfa [esik, 255] → [0, 255]; 2) çekirdekten (alfa ≥ cekirdek) uzak (sert 1 px, yumuşak
    3 px) piksel silinir; 3) kenar pikselinin (alfa < 230) rengi komşu opak piksellerin ortalamasına çekilir.
    (G405 mediterranean-lemon build_images.py'deki yardımcının aynısı.)"""
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
    """Pencere ayrıştırmasının bıraktığı yeşil/eflatun saçak: pencerenin `halka` px çevresindeki görünen piksellerin rengi
    4–10 px dışındaki opak çerçeve renginden alınır; alfa korunur. (RGBA, düzeltilen piksel sayısı)."""
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
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), int(ok.sum())


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


# ============================================================================= gatefold (bu tasarım)

def dikis(ec: np.ndarray, box, bant: float = 0.04):
    """Kapalı dosyanın orta dikişi: kutu ortasının ± bant × genişlik içinde, kutunun orta %80 satırlarındaki opak
    piksellerin sütun parlaklığı (9 px kutu ortalaması) en düşük sütun = iki altın kenar şeridi arasındaki koyu boşluk."""
    x0, y0, x1, y1 = box
    ya, yb = int(y0 + 0.1 * (y1 - y0)), int(y1 - 0.1 * (y1 - y0))
    lum = ec[ya:yb, :, :3] @ LUM
    op = ec[ya:yb, :, 3] >= 200
    col = np.where(op.sum(0) > 0, (lum * op).sum(0) / np.maximum(op.sum(0), 1), 255.0)
    yum = np.convolve(col, np.ones(9) / 9, "same")
    xm = (x0 + x1) / 2
    r = int(bant * (x1 - x0))
    lo, hi = int(xm - r), int(xm + r)
    x = lo + int(np.argmin(yum[lo:hi]))
    # koyu bandın iki kenarı (yarı yükseklik) → ortası
    tab = yum[x]
    esik = tab + 0.5 * (np.median(yum[lo:hi]) - tab)
    a, b = x, x
    while a > lo and yum[a - 1] <= esik:
        a -= 1
    while b < hi - 1 and yum[b + 1] <= esik:
        b += 1
    return {"x": round((a + b + 1) / 2, 1), "min_col": x, "band": [a, b + 1], "column_lum_min": round(float(tab), 1),
            "method": "renk", "detector": "kutu ortası ± %4: 9 px yumuşatılmış sütun parlaklığının en koyu bandının ortası"}


def katlar(eo: np.ndarray, kapali_box):
    """Açık görselin katlanma çizgileri: orta panelin basamaklı tepesinin yanında kapı ile panel arasında saydam boşluk
    olan satırlarda soldaki ilk opak koşunun bittiği (sol) / sağdaki son koşunun başladığı (sağ) sütun; medyan."""
    al = eo[..., 3] >= 128
    ys = np.flatnonzero(al.any(1))
    top, bot = int(ys[0]), int(ys[-1])
    sol, sag = [], []
    for y in range(top, top + int(0.35 * (bot - top))):
        d = np.diff(np.concatenate(([0], al[y].view(np.int8), [0])))
        bas, son = np.flatnonzero(d == 1), np.flatnonzero(d == -1)
        if len(bas) < 2:
            continue
        # koşular: bas[i]..son[i]; ilk koşu sol kapı, son koşu sağ kapı (aradaki boşluk ≥ 4 px)
        if bas[1] - son[0] >= 4 and abs(son[0] - kapali_box[0]) < 0.05 * (kapali_box[2] - kapali_box[0]):
            sol.append(son[0])
        if bas[-1] - son[-2] >= 4 and abs(bas[-1] - kapali_box[2]) < 0.05 * (kapali_box[2] - kapali_box[0]):
            sag.append(bas[-1])
    if len(sol) < 10 or len(sag) < 10:
        sys.exit(f"katlanma çizgileri bulunamadı (sol {len(sol)}, sağ {len(sag)} satır)")
    return float(np.median(sol)), float(np.median(sag)), {"rows_left": len(sol), "rows_right": len(sag),
                                                          "spread_px": [round(float(np.ptp(sol)), 1), round(float(np.ptp(sag)), 1)],
                                                          "method": "alfa",
                                                          "detector": "kapı ile orta panelin basamaklı tepesi arasındaki saydam boşluk"}


def sutun_kes(rgba: np.ndarray, x0: float, x1: float) -> Image.Image:
    """[x0, x1) sütunları (1 px yumuşak geçiş), aynı tuval."""
    w = rgba.shape[1]
    xs = np.arange(w)
    m = np.clip(x1 - xs, 0, 1) * np.clip(xs + 1 - x0, 0, 1)
    out = rgba.astype(np.float64).copy()
    out[..., 3] *= m[None, :]
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA")


def inci_merkezi(rgba: np.ndarray):
    """Kapanış madalyonunun ortasındaki inci: parlak (lum > 185), düşük doygunluklu (max − min < 45), opak; en büyük
    bölgenin ağırlık merkezi ve kutusu."""
    a = rgba.astype(np.float64)
    lum = a[..., :3] @ LUM
    m = (lum > 185) & ((a[..., :3].max(-1) - a[..., :3].min(-1)) < 45) & (a[..., 3] > 200)
    s = en_buyuk_bolge(m)
    ys, xs = np.nonzero(s)
    return float(xs.mean()), float(ys.mean()), [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(6.0, 94.0), min_gen: float = 80.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın neredeyse bütün genişliğinde süs yok (açıklık ≥
    min_gen; yalnız ince altın çerçeve çizgileri). En uzun kesintisiz düz bant gerilir. (t, b)."""
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


# ============================================================================= zemin: ışınlar, yer tutucu

def isinlar(bg: Image.Image):
    """bg_page'in sağ yarısındaki ışınlar aynalanıp tam yelpaze; zemin yüksek geçirgen süzgeçle düşer, kalan ışık
    alfaya çevrilir (RGBA). Çizim yok: yalnız kırpım, ayna, süzgeç."""
    sag = bg.crop(RAYS_BOX)
    tam = Image.new("RGB", (sag.width * 2, sag.height))
    tam.paste(sag.transpose(Image.FLIP_LEFT_RIGHT), (0, 0))
    tam.paste(sag, (sag.width, 0))
    a = np.asarray(tam).astype(np.float64)
    zemin = np.asarray(tam.filter(ImageFilter.GaussianBlur(9))).astype(np.float64)
    hp = np.clip(a - zemin - 2.0, 0, 255) * 1.6
    # aşağı doğru sönen ışınlar zaten sönüyor; üst kenarın 2 px'i (kırpım) ve alt 30 px yumuşak
    yy = np.linspace(0, 1, hp.shape[0])[:, None, None]
    hp *= np.clip((1 - yy) / 0.08, 0, 1)
    # ışık → alfa: alfa = en parlak kanal, renk = ışık / alfa (önçarpımsız) — her zeminde normal bindirmeyle aynı ışık
    al = np.clip(hp.max(-1) / 255.0, 0, 1)
    rgb = np.where(al[..., None] > 1e-3, hp / np.maximum(al[..., None], 1e-3), 0)
    rgba = np.dstack([np.clip(rgb, 0, 255), al * 255])
    return Image.fromarray(np.rint(rgba).astype(np.uint8), "RGBA"), {
        "source_box": list(RAYS_BOX), "mirrored": True, "highpass_blur": 9, "gain": 1.6, "alpha": "max channel",
        "note": "bg_page ışınlarının sağ yarısı + aynası (yelpaze x 511,5'te simetrik); zemin düşer, ışık alfaya"}


def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, en parlak gri, altın fazlası p99,9) — kırpıma ışın/küme girmemeli."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.16, bulanik=10)
    a = np.asarray(ph.convert("RGB")).astype(np.float64)
    altin = a[..., 0] - a[..., 2]
    return ph, int(np.asarray(ph.convert("L")).max()), round(float(np.percentile(altin, 99.9)), 1)


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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="ad-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (art-deco-black-tie); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
                         "stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q
    temizlik = {}

    def webp(im, name, widths, q_=None):
        webp_yaz(im, name, widths, q_ or q, manifest, out)

    # ------------------------------------------------------------------ gatefold (aynı tuval: 1536×1024)
    ec_raw = Image.open(PARTS / "envelope_closed.png").convert("RGBA")
    eo_raw = Image.open(PARTS / "envelope_open.png").convert("RGBA")
    ec, temizlik["envelope_closed"] = hale_temizle(ec_raw, sert=True)
    eo, temizlik["envelope_open"] = hale_temizle(eo_raw, sert=True)
    W, H = ec.size
    eca = np.asarray(ec).astype(np.float64)
    k_box = tb.alfa_kutusu(np.asarray(ec)[..., 3], esik=128)          # (x0, y0, x1, y1)
    k_x0, k_y0, k_x1, k_y1 = k_box
    seam = dikis(eca, k_box)
    tb_seam = tb.dikis_bul(ec)                                         # karşılaştırma için (manifest)
    fl, fr, kat_bilgi = katlar(np.asarray(eo).astype(np.float64), k_box)
    o_box = tb.alfa_kutusu(np.asarray(eo)[..., 3], esik=128)
    # ölçülen dönüşüm: katlanma çizgileri → kapalı sol/sağ kenar; üst/alt alfa kenarı → kapalı üst/alt
    sx = (k_x1 - k_x0) / (fr - fl)
    sy = (k_y1 - k_y0) / (o_box[3] - o_box[1])
    dx = k_x0 - fl * sx
    dy = k_y0 - o_box[1] * sy
    r = eo.resize((round(W * sx), round(H * sy)), Image.LANCZOS)
    eo_t = Image.new("RGBA", (W, H))
    eo_t.paste(r, (round(dx), round(dy)))                              # boş tuvale: paste = kopya (negatif öteleme kırpılır)
    fl_t, fr_t = fl * sx + round(dx), fr * sx + round(dx)
    align_fix = {"fold_px_before": [round(fl, 1), round(fr, 1)], "closed_edges_px": [k_x0, k_x1],
                 "open_scale": [round(sx, 5), round(sy, 5)], "open_offset_px": [round(dx), round(dy)],
                 "folds_after_px": [round(fl_t, 1), round(fr_t, 1)],
                 "reason": "katlanma çizgileri kapalı dosyanın sol/sağ kenarına, üst/alt alfa kenarları üst üste "
                           "(90°'de kapılar aynı menteşede el değiştirir)"}
    print(f"dikiş x {seam['x']} (tema_build.dikis_bul {tb_seam['x']}) · katlar {fl:.0f} / {fr:.0f} → "
          f"× ({sx:.4f}, {sy:.4f}) + ({dx:.0f}, {dy:.0f}) → {fl_t:.1f} / {fr_t:.1f} (kapalı {k_x0} / {k_x1})")

    eta = np.asarray(eo_t).astype(np.float64)
    door_l = sutun_kes(eca, 0, seam["x"])
    door_r = sutun_kes(eca, seam["x"], W)
    door_l_in = sutun_kes(eta, 0, k_x0)
    center = sutun_kes(eta, k_x0, k_x1)
    door_r_in = sutun_kes(eta, k_x1, W)
    pocket, cep = tb.cep_kes(center, "duz")
    uyar("pocket", cep)
    fark_kapali = tb.ortusme(ec, [door_l, door_r])
    fark_acik = tb.ortusme(eo_t, [door_l_in, center, door_r_in, pocket])
    if fark_kapali > 0.01 or fark_acik > 0.01:
        sys.exit(f"kesilen katmanlar kaynakla örtüşmüyor (kapalı {fark_kapali:.4f}, açık {fark_acik:.4f} > 0.01)")
    cep_kenar = float(cep["edge_left_mid_right"][1][1])
    t_box = tb.alfa_kutusu(np.asarray(eo_t)[..., 3], esik=128)

    # ------------------------------------------------------------------ kapanış (altın deco madalyon + inci)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    px, py, inci = inci_merkezi(np.asarray(cl))
    env_w = k_x1 - k_x0
    env_h = k_y1 - k_y0
    comp_w = COMP["env_x"][1] - COMP["env_x"][0]
    comp_h = COMP["env_y"][1] - COMP["env_y"][0]
    clasp_frac_w = (COMP["clasp_x"][1] - COMP["clasp_x"][0]) / comp_w
    clasp_frac_y = (COMP["clasp_c"][1] - COMP["env_y"][0]) / comp_h
    s = clasp_frac_w * env_w / (ck[2] - ck[0])                       # kapanış tuval px → zarf tuval px
    hedef = (seam["x"], k_y0 + clasp_frac_y * env_h)
    c_left = hedef[0] - (px - ck[0]) * s
    c_top = hedef[1] - (py - ck[1]) * s
    c_w, c_h = (ck[2] - ck[0]) * s, (ck[3] - ck[1]) * s
    closure_box = [c_left, c_top, c_left + c_w, c_top + c_h]

    # ------------------------------------------------------------------ kart (card_small) yolu
    cs, temizlik["card_small_stage"] = hale_temizle(Image.open(prep / "card_small.png").convert("RGBA"), sert=True)
    card_ar = cs.width / cs.height
    card_w = CARD_W_OF_ENV * env_w
    card_h = card_w / card_ar
    card_x = seam["x"] - card_w / 2
    hidden_top = cep_kenar - CARD_TOP_ABOVE * card_h
    out_top = cep_kenar - 0.04 * card_h - card_h                      # alt köşeler cebin kenarını kartın %4'ü kadar aşmış
    front_top = out_top + 0.025 * card_h                              # olduğu yerde öne (en çok %2,5 aşağı) + × 1.06
    card_box_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]
    fr_w, fr_h = card_w * FRONT_SCALE, card_h * FRONT_SCALE
    front_box = [card_x - (fr_w - card_w) / 2, front_top - (fr_h - card_h) / 2,
                 card_x + card_w + (fr_w - card_w) / 2, front_top + card_h + (fr_h - card_h) / 2]
    ck_win = win["card_small"][0]
    win_top_frac = ck_win["kutu"][1] / ck_win["katman_olcu"][1]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    X0 = min(k_x0, t_box[0], closure_box[0], front_box[0])
    X1 = max(k_x1, t_box[2], closure_box[2], front_box[2])
    Y0 = min(k_y0, t_box[1], out_top, front_box[1], closure_box[1])
    Y1 = max(k_y1, t_box[3], closure_box[3])
    SW, SH = X1 - X0, Y1 - Y0

    def pct(box):
        x0, y0, x1, y1 = box
        return [round(100 * (x0 - X0) / SW, 3), round(100 * (y0 - Y0) / SH, 3),
                round(100 * (x1 - x0) / SW, 3), round(100 * (y1 - y0) / SH, 3)]

    stage = {"canvas": [W, H], "box": [round(X0, 1), round(Y0, 1), round(SW, 1), round(SH, 1)], "ratio": round(SW / SH, 5)}
    katman = {}
    for ad, im in (("door_l_in", door_l_in), ("door_r_in", door_r_in), ("center", center), ("pocket", pocket),
                   ("door_l", door_l), ("door_r", door_r)):
        k = alfa_kutu(im, esik=1)
        webp(im.crop(k), ad, WIDTHS[ad])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    webp(cl_crop, "closure", WIDTHS["closure"])
    katman["closure"] = pct(closure_box)
    katman["card"] = pct(card_box_hidden)
    stage["parts"] = katman
    stage["seam_pct"] = round(100 * (seam["x"] - X0) / SW, 3)
    stage["closed_obj"] = {"box_pct": pct([k_x0, k_y0, k_x1, k_y1]), "aspect": round(env_w / env_h, 4),
                           "frac_w": round(env_w / SW, 5), "top_frac_of_stage_w": round((k_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - k_y1) / SW, 5),
                           "center_pct": [round(100 * ((k_x0 + k_x1) / 2 - X0) / SW, 3), round(100 * ((k_y0 + k_y1) / 2 - Y0) / SH, 3)]}
    stage["open_obj"] = {"box_pct": pct(t_box), "frac_w": round((t_box[2] - t_box[0]) / SW, 5),
                         "note": "site.js: açılışta sahne × min(1, .94 × 100vw / (sahne genişliği × frac_w)) — docs/11 §7.1"}
    stage["pocket_edge_pct"] = round(100 * (cep_kenar - Y0) / SH, 3)
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3),
                          "front_scale": FRONT_SCALE, "card_w_of_env": CARD_W_OF_ENV, "pocket_flat_edge": round(cep_kenar, 1),
                          "card_top_above_pocket": CARD_TOP_ABOVE, "window_top_frac": round(win_top_frac, 4)}
    stage["cuts"] = {"seam": seam, "seam_tema_build": tb_seam, "folds": kat_bilgi, "pocket": cep}
    stage["checks"] = {"closed_layers_overlap_diff": round(fark_kapali, 5), "open_layers_overlap_diff": round(fark_acik, 5)}
    stage["align_fix"] = align_fix
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "gatefold seam column, at W1.1's height (\"fastened over the center seam, a little above the middle\")",
        "anchor_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5),
        "pearl_center_in_crop_pct": [round(100 * (px - ck[0]) / (ck[2] - ck[0]), 3), round(100 * (py - ck[1]) / (ck[3] - ck[1]), 3)],
        "pearl_box_closure_px": inci, "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": comp_w, "clasp_w_over_env_w": round(clasp_frac_w, 4), "clasp_center_y_of_env_h": round(clasp_frac_y, 4)},
        "carried_by_door": False,
        "motion": "turns and lifts away (MOTION.envelope.closure) before the doors swing open",
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
            bg = Image.new("RGBA", im.size, (200, 60, 200, 255))
            bg.alpha_composite(im)
            bg.convert("RGB").save(oniz / f"kenar_{parca}.jpg", quality=88)
    manifest["photo_slots"] = slots
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.6, .7))

    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        t, b = dilimler(fz)
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

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    rays, rays_info = isinlar(bg)
    webp(rays, "rays", [rays.width], 78)
    manifest["rays"].update(rays_info)
    # uzun sayfaların zemini: bg_tile (dikişsiz lacivert kadife), bg_page'in ışınların altındaki sade üst orta bölgesinin
    # (x 300–760, y 250–620) ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((300, 250, 760, 620))).reshape(-1, 3).astype(np.float64).mean(0)
    # GPT'nin "seamless" karosu dikişsiz değil: sol kenar sağdan, üst alttan açık (B +3,5 / +1,7) → yatay telefonda ve
    # masaüstünde 640 px'te bir dikey/yatay çizgi. Önce ikinci derece yüzey (eğim) düşülür, sonra kenarlar yarım kaydırılmış
    # kopyadan alınır (kenardan %35 içeriye doğrusal geçiş, varyans korunur) → kenar sütunları komşu sütunlar kadar benzer.
    h_, w_ = ta.shape[:2]
    yy, xx = np.mgrid[0:h_, 0:w_]
    xn, yn = xx / w_ - .5, yy / h_ - .5
    yuzey = np.stack([np.ones_like(xn), xn, yn, xn * xn, yn * yn, xn * yn], -1).reshape(-1, 6)
    ort = ta.reshape(-1, 3).mean(0)
    for c in range(3):
        k, *_ = np.linalg.lstsq(yuzey, ta[..., c].reshape(-1), rcond=None)
        ta[..., c] = ta[..., c] - (yuzey @ k).reshape(h_, w_) + ort[c]
    kay = np.roll(ta, (h_ // 2, w_ // 2), (0, 1))
    m = np.clip(np.minimum(np.minimum(xx, w_ - 1 - xx), np.minimum(yy, h_ - 1 - yy)) / (w_ / 2) / .35, 0, 1)[..., None]
    ta = ort + ((ta - ort) * m + (kay - ort) * (1 - m)) / np.sqrt(m * m + (1 - m) ** 2)
    dikis_kaydi = {"seam": round(float(np.abs(ta[:, 0] - ta[:, -1]).mean()), 2),
                   "seam_neighbour": round(float(np.abs(ta[:, 1:] - ta[:, :-1]).mean()), 2)}
    ta = ta - ort + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 76)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["bg_tile"].update(dikis_kaydi)
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph, en_parlak, altin = yer_tutucu_temiz(bg, kutu, oran, max(gen))
        if altin > PH_MAX_GOLD:
            sys.exit(f"ph_{key}: kırpım {kutu} altın bir dekor parçası içeriyor (R − B fazlası {altin} > {PH_MAX_GOLD})")
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"].update({"aspect": oran, "crop": list(kutu), "max_lum": en_parlak, "max_gold": altin})

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
    hz = tb.hiza_olc(ec_raw, eo_raw, "kapi", olcu.get("envelope_closed"), olcu.get("envelope_open"))
    # tema_build.kat_bul'un katlanma ölçümü yerine bu tasarımın alfa boşluğu ölçümü (yukarıda): GPT görsellerinin
    # gerçek hizası
    hz["kenarlar_tema_build"] = hz["kenarlar"]
    hz["kenarlar"] = [e for e in hz["kenarlar"] if e["kenar"] in ("üst", "alt")] + [
        tb._kenar("sol kat", float(k_x0), fl, W, "alfa boşluğu (kapı ↔ orta panel)"),
        tb._kenar("sağ kat", float(k_x1), fr, W, "alfa boşluğu (kapı ↔ orta panel)")]
    hz["durum"] = max((e["durum"] for e in hz["kenarlar"]), key={"tamam": 0, "uyari": 1, "hata": 2}.get)
    manifest["align"] = hz
    print(f"hiza ({hz['durum']}): {tb.hiza_ozet(hz)}")
    if hz["durum"] == "hata":
        sys.exit("kapalı/açık zarf hizası > %4 (GPT'den yeniden üretim gerekir)")
    # düzeltmeden sonra: katlar ve üst/alt (px)
    ta2 = tb.alfa_kutusu(np.asarray(eo_t)[..., 3], esik=128)
    manifest["stage"]["align_fix"]["after_px"] = {"left_fold": round(fl_t - k_x0, 1), "right_fold": round(fr_t - k_x1, 1),
                                                  "top": ta2[1] - k_y0, "bottom": ta2[3] - k_y1}

    yesil = tb.yesil_denetle(out)
    if yesil:
        sys.exit(f"görünür #00FF00 kalıntısı: {yesil}")
    manifest["cleanup"] = temizlik
    manifest["checks"] = {"closed_layers_overlap_diff": round(fark_kapali, 5), "open_layers_overlap_diff": round(fark_acik, 5),
                          "green_px": 0,
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı; ilk ekran yatay telefonda da nav'ın üstünde biter,
    # hero isimleri ≥ 32 px; koyu tasarım: zarf sayfası yazılarının altındaki zemin ölçüsü kendi değerleriyle (altın
    # çizgi = gri > 110; lacivert kadife gri 15–45)
    manifest["theme_check"] = {"particles": ".accent-layer, .sweep",
                               "first_screen": {"landscape": True, "names_min_px": 32},
                               "backdrop": {"edge_max": 2.2, "dark_max": 0.05, "dark_below": 0, "light_above": 110}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, eo_t, katman, stage, {"door_l": door_l, "door_r": door_r, "door_l_in": door_l_in,
                                                 "door_r_in": door_r_in, "center": center, "pocket": pocket},
                 cl_crop, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · dikiş %{stage['seam_pct']} · kapanış {katman['closure']}")
    print(f"kapalı nesne {stage['closed_obj']}")
    print(f"açık nesne {stage['open_obj']['box_pct']} frac_w {stage['open_obj']['frac_w']}")
    print(f"kart yolu {stage['card_path']} kart {katman['card']}")
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


def onizleme(oniz, ec, eo_t, katman, stage, parcalar, cl_crop, cs):
    """Kesim önizlemeleri (gözle denetim): kesilen parçalar, kapalı sahne (+ kapanış), açık sahne (+ kart)."""
    def on(im, bg):
        b = Image.new("RGBA", im.size, bg + (255,))
        b.alpha_composite(im)
        return b.convert("RGB")
    W, H = ec.size
    sheet = Image.new("RGB", (W * 3, H * 2))
    for i, k in enumerate(["door_l", "door_r", "center", "door_l_in", "door_r_in", "pocket"]):
        sheet.paste(on(parcalar[k], (190, 50, 50)), ((i % 3) * W, (i // 3) * H))
    sheet.thumbnail((2400, 1200))
    sheet.save(oniz / "kesimler.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    for ad, ks in (("kapali_sahne", ["door_l", "door_r", "closure"]),
                   ("acik_sahne", ["door_l_in", "door_r_in", "center", "card", "pocket"])):
        sahne = Image.new("RGBA", (900, round(SH * k)), (20, 32, 58, 255))
        for nm in ks:
            im = cl_crop if nm == "closure" else cs if nm == "card" else parcalar[nm].crop(alfa_kutu(parcalar[nm], 1))
            x, y, w, h = katman[nm]
            r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
            sahne.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
        sahne.convert("RGB").save(oniz / f"{ad}.jpg", quality=88)


if __name__ == "__main__":
    main()
