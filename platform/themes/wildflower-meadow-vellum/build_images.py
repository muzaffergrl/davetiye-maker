#!/usr/bin/env python3
"""Wildflower Meadow Vellum teması (tasarım 18, G418) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir.
Teknik hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/wildflower-meadow-vellum/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/18_Wildflower_Vellum/assets/gpt/parts/ (G218, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri, windows.json); tema klasörüne, img_src/'ye, assets/'e yazılmaz (docs/11 §1,
§5.3). parts_prep'in envelope_open için kestiği envelope_pocket_front.png kılıf tipinde anlamsızdır, kullanılmaz (§5.3).
Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.7 — vellum kılıf; kart kılıfın ARKASINDA, kılıfın sınırı içinde):
  * Kılıf tek nesne kalır; `flare` adımında yalnız üst şerit takas edilir (kapalı → açık ağız). GPT'nin kapalı ve açık
    kılıfı aynı tuvalde, alfaları aynı (fark yalnız ön panelin üst kenarı: açıkta ~13 px daha derin, RGB'de).
    tema_build.kilif_serit yalnız ALFA farkına bakıyor (burada tek satır: y 500 → 7 px'lik anlamsız şerit); bu yüzden
    şerit sınırı RGB + alfa farkından bulunur (serit_bul: üst yarıda satırın > 20 pikseli farklı olan son satır + 8 px).
    Parçalar örtüşmez (yarı saydam aydınger üst üste binince koyu çizgi olur): şerit satır < kesim, gövde ≥ kesim.
  * Kılıf GPT'den OPAK geldi (alfa 255): saydamlık site.css'te kılıf sarmalayıcısında (`opacity`, docs/11 §7.7 .82–.9) —
    tek grup olduğu için şerit/gövde ekinde çift kat olmaz.
  * Kapanış (closure.png = deckle kenarlı yuvarlak kır çiçeği etiketi). Kısım 2 kullanıcı talebiyle (2026-10-14) kılıfla
    aynı 1024×1536 tuvalde, kılıfa oturduğu yerde çizildi; docs/11 §7.1 kuralı (kılıf: çapa = kılıfın üst kenarının
    ortası, hemen altı; boyut W1.1 comp'tan) yine uygulanır: çapa = kapalı kılıfın ÖN PANELİNİN üst kenarının orta
    noktası (görselden: orta sütunda en güçlü parlaklık düşüşü), boyut ve kayma comp'tan (COMP). GPT'nin 1:1 yerleşimi
    manifest.closure.gpt_canvas'a karşılaştırma için yazılır.
  * Kart (card_small) kılıf genişliğinin CARD_W_OF_SLEEVE'i, kılıfın üst kenarından CARD_TOP_PAD × kılıf genişliği
    aşağıda; kapalıyken bütünüyle kılıfın içinde (denetlenir). Kılıf aşağı kayıp sönünce kart yukarı kalkar (LIFT), sonra
    olduğu yerde öne gelir (FRONT) ve home kartına uçar.
  * vellum_overlay (ek parça): story/home portre çerçevelerinin fotoğrafı ÜSTÜNDE, pencere kutusuna `cover`; site.css
    `lift-veil` girişiyle alt kenarından kalkıp gider. GPT yarı saydam verdi; yalnız alfa kutusuna kırpılır.
  * Zemin: bg_page 2:3, telefonda cover köşe kümelerini keserdi → telefon zemini `meadow` = bg_page'in iki kümesiz
    kırpımı (krem → çayır yeşili sis + sol alttaki bulanık kır çiçeği şeridi, yumuşak geçiş); kümeler ayrı katman
    (florals_tl / florals_br), ekranda bütün. Geniş ekran `meadow_wide`, uzun sayfaların sonu `meadow_foot`.
  * bg_tile: GPT karosu dikişsiz değil (sol↔sağ 2,8 / komşu 1,7) → ikinci derece eğim düşülür, kenarlar yarım
    kaydırılmış kopyadan (06/14'ün yöntemi), renk sayfa tonuna.
  * GPT kusurları: dış hatta yarı saydam hâle temizliği, WebP kenar saçağı için renk taşıma (08'in yöntemi).
    Yeşil denetimi: tema_build.yesil_gorunur yaprak yeşilini de sayar → kroma_yesil() parlak kroma yeşili her WebP'de 0.

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
COL = ROOT / "collections/18_Wildflower_Vellum"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "sleeve_body": [440, 720], "sleeve_band": [440, 720], "sleeve_open_band": [440, 720], "closure": [200, 400],
    "card_small": [320, 590], "invitation_card": [480, 900], "info_card": [480, 894], "frame_portrait": [320, 640],
    "frame_landscape": [400, 800], "florals_tl": [360, 540, 720], "florals_br": [360, 540, 720], "divider": [300, 600],
    "vellum_overlay": [320, 640],
}
QUALITY = {"florals_tl": 72, "florals_br": 72, "vellum_overlay": 74, "closure": 80, "invitation_card": 76}
ALPHA_Q = {"florals_tl": 56, "florals_br": 56, "vellum_overlay": 72}
CARD_W_OF_SLEEVE = 0.74    # kart genişliği / kılıf genişliği (kart kılıfa sığar: card_small 0,657 en/boy, kılıf 0,827)
CARD_TOP_PAD = 0.04        # kartın üst kenarı kılıfın üst kenarından bu kadar (× kılıf genişliği) aşağıda
LIFT = 0.17                # kılıf gidince kart kendi boyunun bu kadarı yukarı kalkar
FRONT_DROP, FRONT_SCALE = 0.02, 1.05
IVORY = (255, 254, 248)    # palette.json ivory — yer tutucu tonu
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: kümesiz krem→çayır sisi)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (300, 330, 700, 880)),
    "story_1": ("portrait", [320, 640], (260, 380, 640, 900)),
    "story_2": ("portrait", [320, 640], (380, 420, 760, 940)),
    "story_3": ("portrait", [320, 640], (220, 560, 600, 1080)),
    "venue": ("landscape", [400, 800], (120, 700, 780, 1120)),
}
PH_MIN_LUM = 190   # yer tutucuda en koyu piksel en az bu: kümeden çiçek/sap kırpıma girmez (çıkış ≠ 0)
PH_MAX_SAT = 30    # ... ve renkli dekor yok (max − min kanal, %99,9)
# telefon zemini (bg_page 1024×1536 kaynak pikseli; 32 px bloklarla ölçüldü: sol üst küme y < 640'ta x ≤ 192…700,
# sağ alt küme y ≥ 640'ta x ≥ 830, y ≥ 864'te x ≥ 800, y ≥ 1248'de x ≥ 640; sol alt y ≥ 1180 bulanık kır çiçeği şeridi)
MEADOW_TOP = (220, 300, 800, 1150)     # krem → çayır yeşili sis
MEADOW_BOTTOM = (0, 1150, 580, 1536)   # sol alttaki bulanık kır çiçekleri (comp'ların alt kenarı)
MEADOW_BLEND = 120                     # px — iki kırpımın yumuşak geçiş bandı
MEADOW_WIDE = (64, 700, 800, 1150)     # geniş ekran: kümesiz tek geniş kırpım (en/boy 1,64)
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536; 2× büyütülmüş kırpımda okundu): kılıf x 239–786 (547), üst
# kenar y 519; ön panelin üst kenarı orta sütunda y ≈ 642; etiketin deckle kenarı x 437,5–586 (148,5), y 605–756,5,
# merkez (511,8, 680,7) → etiket genişliği / kılıf = 0,2715; merkez − ön kenar ortası = (−0,0013, +0,0708) × kılıf
COMP = {"sleeve_w": 547.0, "front_mid": (512.5, 642.0), "closure_w_over_sleeve": 0.2715,
        "closure_c_minus_front_mid": (-0.0013, 0.0708)}


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (GPT hâlesi, saçak)

def hale_temizle(im: Image.Image, sert: bool, esik: int = 12, cekirdek: int = 96):
    """Dış hattaki yarı saydam hâleyi temizler (çizim yok). sert: kart/çerçeve/kılıf gibi net kenarlı nesne.
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
    """(tema_build.yesil_gorunur benzeri sayı, #00FF00 benzeri parlak kroma yeşili sayısı). Yaprak ve çimen yeşili ilkini
    de doldurur; gerçek pencere kalıntısı parlak (opak #00FF00 ≈ (5, 242, 2)) → ek şart G ≥ 190 ve yeşil fazlası ≥ 60."""
    a = np.asarray(Image.open(dosya).convert("RGBA")).astype(np.int16)
    mx = np.maximum(a[..., 0], a[..., 2])
    t = a[..., 1] - mx
    taban = (t > 40) & (a[..., 1] * 2 >= 3 * mx) & (a[..., 3] > 25)
    return int(taban.sum()), int((taban & (a[..., 1] >= 190) & (t >= 60)).sum())


def webp_yaz(im: Image.Image, name: str, widths, q: int, manifest: dict, out: Path, aq: int = 90):
    """tema_build.webp ile aynı çıktı biçimi; fark: şeffaf parçada küçültme sonrası renk taşıma, alfa kalitesi parametre."""
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


def harita(im: Image.Image, n: int = 16, esik: int = 40) -> str:
    """n × n alfa haritası (hex, satır başına n bit) — site.js `decor` kümeyi yazıyla karşılaştırır (MAP)."""
    a = np.asarray(im.convert("RGBA"))[..., 3]
    H, W = a.shape
    bits = ""
    for j in range(n):
        v = 0
        for i in range(n):
            blk = a[j * H // n:(j + 1) * H // n, i * W // n:(i + 1) * W // n]
            v = (v << 1) | int((blk > esik).mean() > 0.04)
        bits += f"{v:0{n // 4}x}"
    return bits


# ============================================================================= kılıf (docs/11 §7.7)

def serit_bul(kapali: Image.Image, acik: Image.Image, pay: int = 8, min_px: int = 20):
    """Kapalı ve açık kılıfın farklı olduğu üst şerit (RGB + alfa; tema_build.kilif_serit yalnız alfaya bakar).
    Kesim = kılıfın üst yarısında satırın > min_px pikselinin farklı olduğu son satır + pay. (kesim, bilgi)."""
    ka = np.asarray(kapali).astype(np.int16)
    ac = np.asarray(acik).astype(np.int16)
    b = tb.alfa_kutusu(ka[..., 3], 64)
    x0, y0, x1, y1 = b
    fark = (np.abs(ka[..., 3] - ac[..., 3]) > 64) | ((np.abs(ka[..., :3] - ac[..., :3]).sum(-1) > 40) & (ka[..., 3] > 128))
    satir = fark.sum(1) > min_px
    sinir = int(y0 + 0.5 * (y1 - y0))
    ust = np.flatnonzero(satir[:sinir])
    alt = np.flatnonzero(satir[sinir:])
    bilgi = {"box": [int(v) for v in b], "method": "renk", "rows_differing_lower_half": int(len(alt)), "warnings": []}
    if len(alt):
        bilgi["warnings"].append(f"kılıfın alt yarısında {len(alt)} satır farklı (hiza)")
    if not len(ust):
        sys.exit("kılıf: kapalı ve açık kılıfın üst kenarında fark yok — şerit bulunamadı")
    kesim = int(ust.max() + 1 + pay)
    bilgi.update({"cut_row": kesim, "first_diff_row": int(ust.min()), "last_diff_row": int(ust.max()),
                  "band_pct_of_sleeve": round(100 * (kesim - y0) / (y1 - y0), 2)})
    return kesim, bilgi


def on_kenar(kapali: Image.Image, x: int, y_ust: int, aralik: int = 220) -> float:
    """Ön panelin üst kenarı: sütunda (± 2 px) kılıfın üst kenarının 12 px altından itibaren en güçlü parlaklık düşüşü."""
    a = np.asarray(kapali).astype(np.float64)
    lum = a[..., :3] @ LUM
    col = lum[y_ust + 12:y_ust + aralik, x - 2:x + 3].mean(1)
    d = np.diff(col)
    return float(y_ust + 12 + int(np.argmin(d)) + 0.5)


def bol(im: Image.Image, kesim: int):
    a = np.asarray(im).astype(np.float64)
    H, W = a.shape[:2]
    yy = np.arange(H)[:, None] * np.ones((1, W))
    ust, alt = a.copy(), a.copy()
    ust[..., 3] *= (yy < kesim)
    alt[..., 3] *= (yy >= kesim)
    f = lambda x: Image.fromarray(np.clip(np.rint(x), 0, 255).astype(np.uint8), "RGBA")  # noqa: E731
    return f(ust), f(alt)


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(6.0, 94.0), min_gen: float = 80.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın neredeyse bütün genişliğinde süs yok. En uzun
    kesintisiz düz bant gerilir. (t, b)."""
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

def cayir_zemini(bg: Image.Image):
    """Telefon zemini: iki kümesiz bg_page kırpımı üst üste (MEADOW_BLEND px yumuşak geçiş). RGB."""
    ust = bg.crop(MEADOW_TOP)
    alt = bg.crop(MEADOW_BOTTOM)
    if alt.width != ust.width:
        alt = alt.resize((ust.width, round(alt.height * ust.width / alt.width)), Image.LANCZOS)
    w = ust.width
    H = ust.height + alt.height - MEADOW_BLEND
    out = Image.new("RGB", (w, H))
    out.paste(alt, (0, ust.height - MEADOW_BLEND))
    m = np.ones((ust.height, w))
    ramp = np.linspace(1, 0, MEADOW_BLEND)
    ramp = ramp * ramp * (3 - 2 * ramp)                      # smoothstep
    m[-MEADOW_BLEND:] = ramp[:, None]
    out.paste(ust, (0, 0), Image.fromarray((m * 255).astype(np.uint8), "L"))
    return out


def karo_duzelt(tile: Image.Image, hedef_renk):
    """GPT'nin "seamless" karosu dikişsiz değil: ikinci derece yüzey (eğim) düşülür, kenarlar yarım kaydırılmış kopyadan
    (kenardan %35 içeriye doğrusal geçiş, varyans korunur), en son renk sayfa tonuna (06/14'ün yöntemi)."""
    ta = np.asarray(tile).astype(np.float64)
    h_, w_ = ta.shape[:2]
    yy, xx = np.mgrid[0:h_, 0:w_]
    xn, yn = xx / w_ - .5, yy / h_ - .5
    yuzey = np.stack([np.ones_like(xn), xn, yn, xn * xn, yn * yn, xn * yn], -1).reshape(-1, 6)
    ort = ta.reshape(-1, 3).mean(0)
    once = round(float(np.abs(ta[:, 0] - ta[:, -1]).mean()), 2)
    for c in range(3):
        k, *_ = np.linalg.lstsq(yuzey, ta[..., c].reshape(-1), rcond=None)
        ta[..., c] = ta[..., c] - (yuzey @ k).reshape(h_, w_) + ort[c]
    kay = np.roll(ta, (h_ // 2, w_ // 2), (0, 1))
    m = np.clip(np.minimum(np.minimum(xx, w_ - 1 - xx), np.minimum(yy, h_ - 1 - yy)) / (w_ / 2) / .35, 0, 1)[..., None]
    ta = ort + ((ta - ort) * m + (kay - ort) * (1 - m)) / np.sqrt(m * m + (1 - m) ** 2)
    kayit = {"seam_before": once, "seam": round(float(np.abs(ta[:, 0] - ta[:, -1]).mean()), 2),
             "seam_top_bottom": round(float(np.abs(ta[0] - ta[-1]).mean()), 2),
             "seam_neighbour": round(float(np.abs(ta[:, 1:] - ta[:, :-1]).mean()), 2)}
    ta = ta - ort + np.asarray(hedef_renk)
    return Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB"), kayit


def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, en koyu gri, en renkli piksel). Kırpım kümesiz olmalı: koyu sap (min_lum) ve renkli çiçek
    (doygunluk) ikisi de denetlenir."""
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.32)
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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="wf-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (wildflower-meadow-vellum); ölçüler px, kutular [x, y, w, h], box_pct "
                         "yüzde. stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q
    temizlik = {}

    def webp(im, name, widths, q_=None):
        webp_yaz(im, name, widths, q_ or QUALITY.get(name, q), manifest, out, ALPHA_Q.get(name, 90))

    # ------------------------------------------------------------------ kılıf (aynı tuval: 1024×1536)
    sc_raw = Image.open(PARTS / "envelope_closed.png").convert("RGBA")
    so_raw = Image.open(PARTS / "envelope_open.png").convert("RGBA")
    sc, temizlik["envelope_closed"] = hale_temizle(sc_raw, sert=True)
    so, temizlik["envelope_open"] = hale_temizle(so_raw, sert=True)
    W, H = sc.size
    kesim, serit = serit_bul(sc, so)
    uyar("sleeve", serit)
    band, body = bol(sc, kesim)
    oband, obody = bol(so, kesim)
    fark_kapali = tb.ortusme(sc, [band, body])
    fark_acik = tb.ortusme(so, [oband, body])   # açık kılıf = açık şerit + (kapalı) gövde
    if fark_kapali > 0.01 or fark_acik > 0.01:
        sys.exit(f"kılıf parçaları kaynakla örtüşmüyor (kapalı {fark_kapali:.4f}, açık {fark_acik:.4f} > 0.01)")
    sca = np.asarray(sc)
    kc = np.flatnonzero(sca[..., 3].max(0) > 200)
    s_x0, s_x1 = int(kc.min()), int(kc.max()) + 1
    kr = np.flatnonzero(sca[..., 3].max(1) > 200)
    s_y0, s_y1 = int(kr.min()), int(kr.max()) + 1
    sw = s_x1 - s_x0
    xm = (s_x0 + s_x1) // 2
    front_mid = (xm + 0.5, on_kenar(sc, xm, s_y0))
    front_mid_open = (xm + 0.5, on_kenar(so, xm, s_y0))

    # ------------------------------------------------------------------ kapanış (kır çiçeği etiketi)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=True)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    c_w = COMP["closure_w_over_sleeve"] * sw
    s = c_w / (ck[2] - ck[0])
    c_h = (ck[3] - ck[1]) * s
    hedef = (front_mid[0] + COMP["closure_c_minus_front_mid"][0] * sw, front_mid[1] + COMP["closure_c_minus_front_mid"][1] * sw)
    closure_box = [hedef[0] - c_w / 2, hedef[1] - c_h / 2, hedef[0] + c_w / 2, hedef[1] + c_h / 2]
    gpt_c = ((ck[0] + ck[2]) / 2, (ck[1] + ck[3]) / 2)

    # ------------------------------------------------------------------ kart (card_small) — kılıfın arkasında, içinde
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    cs, temizlik["card_small"] = hale_temizle(cs, sert=True)
    cka = alfa_kutu(cs, 64)
    ks = CARD_W_OF_SLEEVE * sw / (cka[2] - cka[0])       # prep pikseli → tuval pikseli
    card_w, card_h = cs.width * ks, cs.height * ks
    card_x = (s_x0 + s_x1) / 2 - card_w / 2
    card_y = s_y0 + CARD_TOP_PAD * sw - cka[1] * ks
    vis = [card_x + cka[0] * ks, card_y + cka[1] * ks, card_x + cka[2] * ks, card_y + cka[3] * ks]
    icinde = vis[0] >= s_x0 and vis[2] <= s_x1 and vis[1] >= s_y0 and vis[3] <= s_y1
    if not icinde:
        sys.exit(f"kart kapalıyken kılıfın dışına taşıyor: kart {vis}, kılıf {[s_x0, s_y0, s_x1, s_y1]}")
    card_box = [card_x, card_y, card_x + card_w, card_y + card_h]
    out_top = card_y - LIFT * card_h
    front_top = out_top + FRONT_DROP * card_h
    fr_w, fr_h = card_w * FRONT_SCALE, card_h * FRONT_SCALE
    front_box = [card_x - (fr_w - card_w) / 2, front_top - (fr_h - card_h) / 2,
                 card_x + card_w + (fr_w - card_w) / 2, front_top + card_h + (fr_h - card_h) / 2]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    sb = alfa_kutu(sc, esik=1)
    ob = alfa_kutu(so, esik=1)
    X0 = min(sb[0], ob[0], closure_box[0], front_box[0])
    X1 = max(sb[2], ob[2], closure_box[2], front_box[2])
    Y0 = min(sb[1], ob[1], out_top, front_box[1], closure_box[1])
    Y1 = max(sb[3], ob[3], closure_box[3], card_box[3])
    SW, SH = X1 - X0, Y1 - Y0

    def pct(box):
        x0, y0, x1, y1 = box
        return [round(100 * (x0 - X0) / SW, 3), round(100 * (y0 - Y0) / SH, 3),
                round(100 * (x1 - x0) / SW, 3), round(100 * (y1 - y0) / SH, 3)]

    stage = {"canvas": [W, H], "box": [round(X0, 1), round(Y0, 1), round(SW, 1), round(SH, 1)],
             "ratio": round(SW / SH, 5)}
    katman = {}
    for ad, im in (("sleeve_body", body), ("sleeve_band", band), ("sleeve_open_band", oband)):
        k = alfa_kutu(im, esik=1)
        k = [int(np.floor(X0)), k[1], int(np.ceil(X1)), k[3]]           # bütün kılıf katmanları sahne genişliğinde
        webp(im.crop(k), ad, WIDTHS[ad])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    webp(cl_crop, "closure", WIDTHS["closure"])
    katman["closure"] = pct(closure_box)
    katman["card"] = pct(card_box)
    stage["parts"] = katman
    stage["closed_obj"] = {"box_pct": pct([s_x0, s_y0, s_x1, s_y1]), "aspect": round(sw / (s_y1 - s_y0), 4),
                           "frac_w": round(sw / SW, 5), "top_frac_of_stage_w": round((s_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - s_y1) / SW, 5)}
    stage["card_path"] = {"lift_translate_pct": round(-100 * LIFT, 3),
                          "front_translate_pct": round(-100 * (LIFT - FRONT_DROP), 3), "front_scale": FRONT_SCALE,
                          "card_w_of_sleeve": CARD_W_OF_SLEEVE, "card_top_pad": CARD_TOP_PAD,
                          "card_visible_box_canvas": [round(v, 1) for v in vis], "inside_sleeve_when_closed": icinde}
    stage["cuts"] = {"band": serit, "front_edge_mid_closed": [round(v, 1) for v in front_mid],
                     "front_edge_mid_open": [round(v, 1) for v in front_mid_open]}
    stage["checks"] = {"closed_overlap_diff": round(fark_kapali, 5), "open_overlap_diff": round(fark_acik, 5)}
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "front panel top edge, middle (the sleeve's mouth edge at the centre column; just below it the label)",
        "anchor_px": [round(v, 1) for v in front_mid], "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "sleeve_w_px": sw,
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"sleeve_w": COMP["sleeve_w"], "closure_w_over_sleeve": COMP["closure_w_over_sleeve"],
                 "closure_center_minus_front_mid_over_sleeve_w": list(COMP["closure_c_minus_front_mid"])},
        "gpt_canvas": {"note": "closure.png drawn on the sleeve canvas (user request 2026-10-14): its own 1:1 place, for "
                               "comparison only", "box": ck, "w_over_sleeve": round((ck[2] - ck[0]) / sw, 4),
                       "center_minus_front_mid_over_sleeve_w": [round((gpt_c[0] - front_mid[0]) / sw, 4),
                                                                round((gpt_c[1] - front_mid[1]) / sw, 4)]},
        "motion": "peels away from its top edge (rotateX toward the viewer about its lower edge, lifts, fades) before the "
                  "sleeve flares and slides down (MOTION.envelope.closure)",
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    webp(cs, "card_small", WIDTHS["card_small"])
    slots["card"] = tb.foto_alani(prep, win, "card_small", "card", manifest, out)
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.6, .66))
    for ad, parca in (("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = hale_temizle(im, sert=True)
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
    manifest["photo_slots"] = slots

    for nm, gen in (("invitation_card", 86.0), ("info_card", 84.0)):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        t, b = dilimler(fz, min_gen=gen)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (dikey "
                                          "gerilir), alt dilim ::after — docs/11 §9; site.css --t/--b"}

    maps = {}
    for nm in ("florals_tl", "florals_br", "divider"):
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm])
        if nm != "divider":
            maps[nm] = harita(im)
    for i in (1, 2, 3):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False)
        im = im.crop(alfa_kutu(im))
        im.thumbnail((200, 200), Image.LANCZOS)
        webp(im, f"accent_{i}", [im.width])
    vo = Image.open(prep / "vellum_overlay.png").convert("RGBA")
    vo = vo.crop(alfa_kutu(vo, esik=24))
    webp(vo, "vellum_overlay", WIDTHS["vellum_overlay"])
    va = np.asarray(vo)[..., 3].astype(np.float64)
    hh, ww = va.shape
    manifest["vellum_overlay"].update({
        "alpha_mean": round(float(va.mean()), 1),
        "alpha_centre_mean": round(float(va[int(hh * .35):int(hh * .65), int(ww * .35):int(ww * .65)].mean()), 1),
        "use": "story/home portrait frames: over the photo window, under the frame; lifts away from its bottom edge "
               "(site.css lift-veil)"})

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    meadow = cayir_zemini(bg)
    webp(meadow, "meadow", [meadow.width], 78)
    manifest["meadow"].update({"top_crop": list(MEADOW_TOP), "bottom_crop": list(MEADOW_BOTTOM), "blend_px": MEADOW_BLEND})
    wide = bg.crop(MEADOW_WIDE)
    webp(wide, "meadow_wide", [640], 78)
    manifest["meadow_wide"]["crop"] = list(MEADOW_WIDE)
    foot = bg.crop(MEADOW_BOTTOM)
    webp(foot, "meadow_foot", [foot.width], 76)
    manifest["meadow_foot"]["crop"] = list(MEADOW_BOTTOM)
    hedef_renk = np.asarray(bg.crop((300, 560, 700, 820))).reshape(-1, 3).astype(np.float64).mean(0)
    tile, dikis = karo_duzelt(Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS), hedef_renk)
    webp(tile, "bg_tile", [640], 78)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["bg_tile"].update(dikis)
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)
    fa_ = np.asarray(foot).reshape(-1, 3).astype(np.float64)
    manifest["meadow_foot"]["tone_top"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in fa_[:foot.width * 30].mean(0))

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
    hz = tb.hiza_olc(sc_raw, so_raw, "kilif", olcu.get("envelope_closed"), olcu.get("envelope_open"))
    manifest["align"] = hz
    print(f"hiza ({hz['durum']}): {tb.hiza_ozet(hz)}")
    for u in hz["uyarilar"]:
        print(f"UYARI  hiza: {u}")
    if hz["durum"] == "hata":
        sys.exit("kapalı/açık kılıf hizası > %4 (GPT'den yeniden üretim gerekir)")

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
    manifest["decor_map"] = {"note": "16 × 16 alpha map (hex, 4 digits per row) of florals_tl / florals_br — site.js MAP",
                             **maps}
    manifest["checks"] = {"sleeve_overlap_diff": [round(fark_kapali, 5), round(fark_acik, 5)], "green_px": 0,
                          "green_check": {"chroma_key_px": 0, "tema_build_yesil_gorunur_foliage_px": yaprak,
                                          "note": "tema_build.yesil_gorunur yaprak yeşilini de sayar; parlak kroma şartı "
                                                  "(G ≥ 190, fazla ≥ 60) ile 0 — kroma_yesil()"},
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanı; ilk ekran yatay telefonda da nav'ın üstünde biter
    manifest["theme_check"] = {"particles": ".accent-layer", "first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, sc, band, oband, body, cl_crop, katman, stage, cs, kesim)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · kapanış {katman['closure']}")
    print(f"kart yolu {stage['card_path']} · kart {katman['card']}")
    print(f"kapalı nesne {stage['closed_obj']}")
    print(f"katmanlar {katman}")
    print(f"şerit {serit} · ön kenar {front_mid} / açık {front_mid_open}")
    print(f"kapanış GPT 1:1 {manifest['closure']['gpt_canvas']}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} dilimler {manifest[nm]['slices']['top_end_pct']}–{manifest[nm]['slices']['bottom_start_pct']} "
              f"oran {manifest[nm]['slices']['ratio']}")
    print(f"MAP {maps}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · "
          f"sayfa rengi {manifest['page_color']} · karo {dikis}")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, sc, band, oband, body, cl_crop, katman, stage, cs, kesim):
    """Kesim önizlemeleri (gözle denetim): şerit / açık şerit / gövde; kapalı ve açık sahne;
    compare_closure.jpg = kapalı sahne (tema) | W1.1 comp'un kılıf bölgesi."""
    def on(im, bg):
        b = Image.new("RGBA", im.size, bg + (255,))
        b.alpha_composite(im)
        return b.convert("RGB")
    W, H = sc.size
    sheet = Image.new("RGB", (W * 3, H))
    sheet.paste(on(band, (190, 50, 50)), (0, 0))
    sheet.paste(on(oband, (190, 50, 50)), (W, 0))
    sheet.paste(on(body, (50, 50, 190)), (2 * W, 0))
    sheet = sheet.crop((0, 440, W * 3, 1420))
    sheet.thumbnail((2400, 1000))
    sheet.save(oniz / "cuts_sleeve.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    zemin = (238, 240, 228, 255)

    def sahne(parcalar, op=1.0):
        s = Image.new("RGBA", (900, round(SH * k)), zemin)
        for im, p, o in parcalar:
            x, y, w, h = p
            r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
            if o < 1:
                a = np.asarray(r).copy()
                a[..., 3] = (a[..., 3] * o).astype(np.uint8)
                r = Image.fromarray(a, "RGBA")
            s.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
        return s
    crop = lambda im: im.crop(alfa_kutu(im, 1))  # noqa: E731
    kapali = sahne([(cs, katman["card"], 1), (crop(body), katman["sleeve_body"], .84), (crop(band), katman["sleeve_band"], .84),
                    (cl_crop, katman["closure"], 1)])
    kapali.convert("RGB").save(oniz / "stage_closed.jpg", quality=88)
    acik = sahne([(cs, katman["card"], 1), (crop(body), katman["sleeve_body"], .84), (crop(oband), katman["sleeve_open_band"], .84)])
    acik.convert("RGB").save(oniz / "stage_open.jpg", quality=88)
    # compare_closure: tema (kapalı sahne, kılıf genişliği comp'unkine ölçekli) | comp
    comp = Image.open(COMPS / "web_1_envelope.png").convert("RGB")
    cx0, cx1, cy0, cy1 = 239 - 40, 786 + 40, 470, 1230
    cmp_crop = comp.crop((cx0, cy0, cx1, cy1))
    ox, oy, ow, oh = stage["closed_obj"]["box_pct"]
    olcek = COMP["sleeve_w"] / (ow / 100 * 900)
    t0 = kapali.resize((round(900 * olcek), round(kapali.height * olcek)), Image.LANCZOS)
    t = Image.new("RGBA", (t0.width + 400, t0.height + 400), zemin)
    t.alpha_composite(t0, (200, 200))
    ex = ox / 100 * 900 * olcek + 200
    ey = oy / 100 * kapali.height * olcek + 200
    t = t.crop((round(ex - 40), round(ey - (519 - cy0)), round(ex - 40) + cmp_crop.width, round(ey - (519 - cy0)) + cmp_crop.height))
    out_im = Image.new("RGB", (cmp_crop.width * 2 + 16, cmp_crop.height), (255, 255, 255))
    out_im.paste(t.convert("RGB"), (0, 0))
    out_im.paste(cmp_crop, (cmp_crop.width + 16, 0))
    out_im.save(oniz / "compare_closure.jpg", quality=88)


if __name__ == "__main__":
    main()
