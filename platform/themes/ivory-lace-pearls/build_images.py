#!/usr/bin/env python3
"""Ivory Lace & Pearls teması (tasarım 14, G414) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/ivory-lace-pearls/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/14_Ivory_Lace_Pearl/assets/gpt/parts/ (G214, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre
koşar (alfa kırpma, #00FF00 pencereleri + GPT lekesi doldurma, windows.json); tema klasörüne, img_src/'ye, assets/'e
yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.4 — gatefold, iki kapı):
  * Dikiş (kapalı dosya): iki kapının dantel kenarları arasındaki ince düz boşluğun ortasındaki koyu temas çizgisi —
    tema_build.dikis_bul burada doğru buluyor (x 769,5 = kutu ortası). Katlanma çizgileri (açık dosya): kapı içi ile orta
    panel arasındaki koyu ince çizgi — tema_build.kat_bul (sol 443,5 · sağ 1087,5).
  * Hiza (docs/11 §7.1, kit_check UYARI "sol kat +1,99 · sağ kat −2,51 %"): GPT'nin açık dosyasında orta panel kapalı
    dosyadan %9,7 dar (645 / 713 px); kapı içleri ise kapalı kapı yarılarıyla aynı genişlikte. Tek bir ölçek ya kapı
    içlerini %10 büyütür ya da menteşelerde boşluk bırakır. Bu yüzden ölçülen dönüşüm **parça başına**: orta panel
    yatayda kapalı genişliğe (× 1,1046), dikeyde üst/alt alfa kenarına (× 1,0067) getirilir; kapı içleri yalnız dikey
    ölçekle (en-boy korunur) ölçeklenip katlanma kenarları kapalı dosyanın sol/sağ kenarına oturtulur → 90°'de her kapı
    aynı menteşede el değiştirir, açık dosyada boşluk yok (manifest.stage.align_fix).
  * Orta cep: düz üst kenar + iki köşede kenarın üstüne çıkan dantel (W2.5). tema_build.cep_kes "duz" köşe dantelini
    aykırı sayıp cebin dışında (kartın arkasında) bırakırdı; burada her sütunda düz panel kağıdından aşağı inilip ilk
    kalıcı renk sapması (dantelin üst ucu ya da düz kenar çizgisi) cep kenarı: 7 sütunluk medyan, altın kenar
    sütunlarında en yakın iç sütun (cep_dantel).
  * Kapanış (closure.png = beş incili gümüş-altın broş + kısa inci dizisi, kare tuvalde büyük çizildi; kapılarla
    taşınmaz): yeri kesim geometrisine bağlı — çapa = dikiş sütunu, yükseklik W1.1'de ölçülen ("fastened over the center
    seam at mid-height": comp'ta dosya yüksekliğinin 0,474'ü), boy = W1.1'deki broş metal genişliği / dosya genişliği.
    Merkez = broşun ortasındaki küçük inci.
  * Kart (card_small) orta cebin arkasında; cepte beklerken yalnız üst bandı (oval çerçevenin gül tepesi) cebin düz
    kenarının üstünde görünür, foto penceresi cebin altında; yükselince alt köşeleri cebin kenarını kartın %4'ü kadar
    aşar, öne gelirken olduğu yerde büyür.
  * Zemin: bg_page'in çiçeksiz orta bölgesi (saten + pencere ışığının çapraz gölgeleri) → mist-640 (ilk ekranların
    zemini); köşe kümeleri telefonda cover ile kesilirdi → decor_tl / decor_br ayrı katman, ekranda bütün. Uzun sayfalar:
    bg_tile (GPT karosu dikişsiz değil: eğim düşülür, kenarlar yarım kaydırılmış kopyadan — 06'nın yöntemi).
  * GPT kusurları (kesimle/temizlikle, çizimsiz): dış hatta yarı saydam hâle; frame_landscape penceresindeki lekeler
    (G214 onayı) → parts_prep leke dolgusu (pencere TAM şeffaf; foto_alani her WebP'de denetler); pencere çevresindeki
    yeşil/eflatun ayrıştırma saçağı çerçeve renginden; WebP kenar saçağı için şeffaf piksellere komşu renk taşınır.
  * Yer tutucular: bg_page'in çiçeksiz saten bölgesinden yumuşak, fildişine tonlanmış kırpım; dekor yok
    (manifest.ph_*.max_busy ≤ PH_MAX_BUSY).

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
COL = ROOT / "collections/14_Ivory_Lace_Pearl"
PARTS = COL / "assets/gpt/parts"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "door_l": [240, 480], "door_r": [240, 480], "door_l_in": [240, 480], "door_r_in": [240, 480],
    "center": [320, 720], "pocket": [320, 720], "closure": [240, 480], "card_small": [320, 640],
    "invitation_card": [480, 800], "info_card": [480, 800], "frame_portrait": [320, 640],
    "frame_landscape": [480, 960], "decor_tl": [320, 480, 720], "decor_br": [320, 480, 720], "divider": [300, 600],
}
# palet (palette.json ivory-pearl): mist_top #FAF7F2 — yer tutucu tonu
IVORY = (250, 247, 242)
CARD_TOP_ABOVE = 0.085    # kart cepte: üst bandın bu kadarı (kart yüksekliği oranı) cebin düz kenarının üstünde
CARD_W_OF_ENV = 0.80      # kart genişliği / kapalı dosya genişliği (orta panelin altın kenar çizgilerinin içinde)
FRONT_SCALE = 1.06
# W1.1 comp ölçümü (comps/web_1_envelope.png, 1024×1536; 4× büyütülmüş kırpımlarda okunan pikseller): dosyanın gövdesi
# x 222–799 (genişlik 577), y 472,5–1189 (716,5); broşun gümüş-altın metal kolları x 451–573 (122), ortadaki küçük incinin
# merkezi (512, 812) — dikişin üstünde, dosya yüksekliğinin 0,474'ünde ("at mid-height").
COMP = {"env_x": (222.0, 799.0), "env_y": (472.5, 1189.0), "clasp_metal_x": (451.0, 573.0), "clasp_c": (512.0, 812.0)}
# closure.png (1254 kare) aynı ölçü: metal kolların uçları x 260–990 (730), küçük incinin merkezi (625, 585)
CLOSURE = {"metal_x": (260.0, 990.0), "pearl_c": (625.0, 585.0)}
# bg_page (1024×1536) çiçeksiz saten bölgesi (16 px blok yerel kontrast ölçümü: köşe kümeleri dışında en büyük dikdörtgen)
SATIN_BOX = (176, 336, 800, 1200)
# yer tutucu kırpımları (hepsi SATIN_BOX içinde)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (260, 420, 720, 1100)),
    "story_1": ("portrait", [320, 640], (200, 380, 560, 1000)),
    "story_2": ("portrait", [320, 640], (420, 520, 790, 1180)),
    "story_3": ("portrait", [320, 640], (300, 560, 700, 1190)),
    "venue": ("landscape", [480, 960], (190, 640, 790, 1000)),
}
PH_MAX_BUSY = 9.0   # yer tutucuda dekor yok: yerel kontrastın p99'u en çok bu (çıkış ≠ 0)


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (GPT hâlesi, saçak)

def hale_temizle(im: Image.Image, sert: bool, esik: int = 12, cekirdek: int = 96):
    """Dış hattaki yarı saydam hâleyi temizler (çizim yok). sert: kart/çerçeve/zarf gibi net kenarlı nesne.
    1) alfa < esik → 0, kalan alfa [esik, 255] → [0, 255]; 2) çekirdekten (alfa ≥ cekirdek) uzak (sert 1 px, yumuşak
    3 px) piksel silinir; 3) kenar pikselinin (alfa < 230) rengi komşu opak piksellerin ortalamasına çekilir.
    (G405/G406 build_images.py'deki yardımcının aynısı.)"""
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
    kenara koyu saçak karıştırmasın. Görüntü değişmez (yalnız alfa 0 piksellerin rengi)."""
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

def sutun_kes(rgba: np.ndarray, x0: float, x1: float) -> np.ndarray:
    """[x0, x1) sütunları (1 px yumuşak geçiş), aynı tuval (float RGBA dizi)."""
    w = rgba.shape[1]
    xs = np.arange(w)
    m = np.clip(x1 - xs, 0, 1) * np.clip(xs + 1 - x0, 0, 1)
    out = rgba.astype(np.float64).copy()
    out[..., 3] *= m[None, :]
    return out


def yerlestir(parca: np.ndarray, sx: float, sy: float, dx: float, dy: float, W: int, H: int) -> Image.Image:
    """Parçayı (tam tuval RGBA dizi) x' = x·sx + dx, y' = y·sy + dy dönüşümüyle aynı boyda boş tuvale koyar (afin,
    çift doğrusal; önçarpımlı alfa — saydam kenarda koyu saçak olmasın)."""
    im = Image.fromarray(np.clip(np.rint(parca), 0, 255).astype(np.uint8), "RGBA").convert("RGBa")
    out = im.transform((W, H), Image.AFFINE, (1 / sx, 0, -dx / sx, 0, 1 / sy, -dy / sy), resample=Image.BICUBIC)
    return out.convert("RGBA")


def cep_dantel(center: Image.Image, body_top: int, body_bot: int, x0: int, x1: int, esik: float = 14.0, kenar_bant: int = 24):
    """Orta cebin üst kenarı (düz kenar çizgisi + köşelerde onun üstüne çıkan dantel): her sütunda panelin düz
    kağıdından (y_bas'ın üstündeki 30 satır, ±3 sütun medyanı) aşağı inilir; 3 satır ortalaması `esik`'i aşan ilk satır =
    kenar. Panelin iki yanındaki altın kenar çizgisi bandında (`kenar_bant` px) taranmaz: oradaki sütunlar en yakın iç
    sütunun kenarını alır. 7 sütunluk medyan; kenar 1 satır yukarı (temas gölgesi cepte kalsın). (cep RGBA, bilgi)."""
    a = np.asarray(center.convert("RGBA")).astype(np.float64)
    rgb, al = a[..., :3], a[..., 3]
    h, w = al.shape
    y_bas = int(body_top + 0.55 * (body_bot - body_top))
    kenar = np.full(w, np.nan)
    for x in range(x0 + kenar_bant, x1 - kenar_bant):
        ref = np.median(rgb[y_bas - 30:y_bas, max(0, x - 3):x + 4].reshape(-1, 3), 0)
        d = np.sqrt(((rgb[:, x] - ref) ** 2).sum(-1))
        for y in range(y_bas, body_bot - 4):
            if d[y:y + 3].mean() > esik:
                kenar[x] = y
                break
    gecerli = np.isfinite(kenar) & (kenar > y_bas + 10)
    xs = np.flatnonzero(gecerli)
    if len(xs) < 0.8 * (x1 - x0 - 2 * kenar_bant):
        raise SystemExit(f"cep kenarı bulunamadı ({len(xs)}/{x1 - x0} sütun)")
    ham = kenar.copy()
    for x in range(x0, x1):
        if not gecerli[x]:
            kenar[x] = kenar[xs[np.argmin(np.abs(xs - x))]]
    yum = kenar.copy()
    for x in range(x0, x1):
        yum[x] = np.median(kenar[max(x0, x - 3):min(x1, x + 4)])
    yum[:x0] = yum[x0]
    yum[x1:] = yum[x1 - 1]
    # düz kenar düz kalsın: düz çizginin (orta 300 sütunun medyanı) ± 6 px'indeki sütunlar o satıra (kağıt dokusundaki
    # 2–4 px'lik iz sapmaları kartın önünde tırtıklı kenar gibi okunurdu); dantel köşeler izlendiği gibi
    xm_ = (x0 + x1) // 2
    duz_ = float(np.median(yum[xm_ - 150:xm_ + 150]))
    yum[np.abs(yum - duz_) <= 6] = duz_
    yum = yum - 1.0
    m = np.clip(np.arange(h)[:, None] - yum[None, :] + 0.5, 0, 1)
    m[:body_top] = 0
    pa = al * m
    pa[al < 200] = 0  # kenar yumuşaması arka katmanda (center) zaten var; ikilenmesin
    out = a.copy()
    out[..., 3] = pa
    xm = (x0 + x1) // 2
    duz = float(np.median(yum[xm - 150:xm + 150]))
    bilgi = {"method": "renk", "shape": "duz + dantel köşeler", "threshold": esik, "scan_from_y": y_bas,
             "columns": [x0, x1], "found": int(len(xs)), "filled_edge_columns": int((x1 - x0) - len(xs)),
             "flat_edge_y": round(duz, 1), "corner_top_y": round(float(np.min(yum[x0:x1])), 1),
             "edge_left_mid_right": [[x0, round(float(yum[x0]), 1)], [xm, round(float(yum[xm]), 1)],
                                     [x1 - 1, round(float(yum[x1 - 1]), 1)]],
             "raw_edge_sample": [[int(x), None if not np.isfinite(ham[x]) else int(ham[x])] for x in range(x0, x1, 40)]}
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), bilgi


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(4.0, 96.0), min_gen: float = 80.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın neredeyse bütün genişliğinde süs yok (açıklık ≥
    min_gen; yalnız ince altın kenar çizgisi). En uzun kesintisiz düz bant gerilir. (t, b)."""
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


# ============================================================================= zemin, yer tutucu

def yerel_kontrast(im: Image.Image) -> float:
    """Dekor denetimi: görüntü ile 6 px Gauss bulanığı arasındaki farkın p99'u (saten düz ≈ 3–6, dantel/gül > 12)."""
    g = im.convert("L")
    a = np.asarray(g).astype(np.float64)
    b = np.asarray(g.filter(ImageFilter.GaussianBlur(6))).astype(np.float64)
    return round(float(np.percentile(np.abs(a - b), 99)), 2)


def yer_tutucu_temiz(bg, kutu, oran, w):
    """(yer tutucu, kaynak kırpımın yerel kontrastı) — kırpıma dantel/gül girmemeli."""
    kontrast = yerel_kontrast(bg.crop(kutu))
    ph = tb.yer_tutucu(bg, kutu, oran, w, ton=IVORY, karisim=0.30, bulanik=8)
    return ph, kontrast


def karo_duzelt(tile: Image.Image, hedef_renk):
    """GPT'nin "seamless" karosu dikişsiz değil: önce ikinci derece yüzey (eğim) düşülür, sonra kenarlar yarım
    kaydırılmış kopyadan alınır (kenardan %35 içeriye doğrusal geçiş, varyans korunur), en son renk sayfa tonuna.
    (G406 build_images.py'deki yöntem.)"""
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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="ilp-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (ivory-lace-pearls); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
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
    eoa = np.asarray(eo).astype(np.float64)
    k_box = tb.alfa_kutusu(eca[..., 3], esik=128)                      # (x0, y0, x1, y1)
    k_x0, k_y0, k_x1, k_y1 = k_box
    seam = tb.dikis_bul(ec)
    if seam["method"] != "renk":
        sys.exit(f"dikiş bulunamadı: {seam}")
    o_box = tb.alfa_kutusu(eoa[..., 3], esik=128)
    fl, s_l = tb.kat_bul(eo, k_x0, 0.03 * W)
    fr, s_r = tb.kat_bul(eo, k_x1, 0.03 * W)
    if fl is None or fr is None:
        sys.exit("katlanma çizgileri bulunamadı")
    kat_bilgi = {"left": round(fl, 1), "right": round(fr, 1), "score": [round(s_l, 1), round(s_r, 1)], "method": "renk",
                 "detector": "tema_build.kat_bul (kapalı x0/x1 ± %3: iki yanından koyu ince çizgi)"}

    # ölçülen dönüşüm (parça başına; docs/11 §7.1): dikeyde üst/alt alfa kenarı kapalınınkine; orta panel yatayda
    # katlanma çizgileri → kapalı sol/sağ kenar; kapı içleri yalnız dikey ölçekle (en-boy korunur), katlanma kenarı →
    # kapalı kenar
    sy = (k_y1 - k_y0) / (o_box[3] - o_box[1])
    dy = k_y0 - o_box[1] * sy
    sx_c = (k_x1 - k_x0) / (fr - fl)
    dx_c = k_x0 - fl * sx_c
    dx_l = k_x0 - fl * sy
    dx_r = k_x1 - fr * sy
    door_l_in = yerlestir(sutun_kes(eoa, 0, fl), sy, sy, dx_l, dy, W, H)
    center = yerlestir(sutun_kes(eoa, fl, fr), sx_c, sy, dx_c, dy, W, H)
    door_r_in = yerlestir(sutun_kes(eoa, fr, W), sy, sy, dx_r, dy, W, H)
    eo_t = Image.alpha_composite(Image.alpha_composite(door_l_in, center), door_r_in)
    align_fix = {"folds_px_before": [round(fl, 1), round(fr, 1)], "closed_edges_px": [k_x0, k_x1],
                 "open_box_before": list(o_box), "closed_box": list(k_box),
                 "center": {"scale": [round(sx_c, 5), round(sy, 5)], "offset_px": [round(dx_c, 2), round(dy, 2)]},
                 "door_l_in": {"scale": [round(sy, 5), round(sy, 5)], "offset_px": [round(dx_l, 2), round(dy, 2)]},
                 "door_r_in": {"scale": [round(sy, 5), round(sy, 5)], "offset_px": [round(dx_r, 2), round(dy, 2)]},
                 "reason": "GPT'nin orta paneli kapalı dosyadan %9,7 dar, kapı içleri kapalı kapı yarılarıyla aynı genişlikte: "
                           "orta panel yatayda kapalı genişliğe getirilir, kapı içleri yalnız dikey ölçekle kapalı kenarlara "
                           "oturtulur → menteşeler ortak, açık dosyada boşluk yok"}
    print(f"dikiş x {seam['x']} · katlar {fl:.1f} / {fr:.1f} (kapalı {k_x0} / {k_x1}) → orta × ({sx_c:.4f}, {sy:.4f}), "
          f"kapı içleri × {sy:.4f}")

    eta = np.asarray(eo_t).astype(np.float64)
    door_l = Image.fromarray(np.clip(np.rint(sutun_kes(eca, 0, seam["x"])), 0, 255).astype(np.uint8), "RGBA")
    door_r = Image.fromarray(np.clip(np.rint(sutun_kes(eca, seam["x"], W)), 0, 255).astype(np.uint8), "RGBA")
    pocket, cep = cep_dantel(center, k_y0, k_y1, k_x0 + 2, k_x1 - 2)
    fark_kapali = tb.ortusme(ec, [door_l, door_r])
    fark_acik = tb.ortusme(eo_t, [door_l_in, center, door_r_in, pocket])
    if fark_kapali > 0.01 or fark_acik > 0.01:
        sys.exit(f"kesilen katmanlar kaynakla örtüşmüyor (kapalı {fark_kapali:.4f}, açık {fark_acik:.4f} > 0.01)")
    t_box = tb.alfa_kutusu(eta[..., 3], esik=128)
    cep_kenar = cep["flat_edge_y"]

    # ------------------------------------------------------------------ kapanış (inci broş)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    px, py = CLOSURE["pearl_c"]
    env_w = k_x1 - k_x0
    env_h = k_y1 - k_y0
    comp_w = COMP["env_x"][1] - COMP["env_x"][0]
    comp_h = COMP["env_y"][1] - COMP["env_y"][0]
    metal_frac_w = (COMP["clasp_metal_x"][1] - COMP["clasp_metal_x"][0]) / comp_w
    clasp_frac_y = (COMP["clasp_c"][1] - COMP["env_y"][0]) / comp_h
    s = metal_frac_w * env_w / (CLOSURE["metal_x"][1] - CLOSURE["metal_x"][0])   # kapanış tuval px → zarf tuval px
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
    stage["cuts"] = {"seam": seam, "folds": kat_bilgi, "pocket": cep}
    stage["checks"] = {"closed_layers_overlap_diff": round(fark_kapali, 5), "open_layers_overlap_diff": round(fark_acik, 5)}
    stage["align_fix"] = align_fix
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "gatefold seam column, at W1.1's height (\"fastened over the center seam at mid-height\")",
        "anchor_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5),
        "pearl_center_in_crop_pct": [round(100 * (px - ck[0]) / (ck[2] - ck[0]), 3), round(100 * (py - ck[1]) / (ck[3] - ck[1]), 3)],
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": comp_w, "metal_w_over_env_w": round(metal_frac_w, 4), "clasp_center_y_of_env_h": round(clasp_frac_y, 4),
                 "closure_metal_px": list(CLOSURE["metal_x"]), "closure_pearl_px": list(CLOSURE["pearl_c"])},
        "carried_by_door": False,
        "motion": "unhooks (lifts towards the viewer) and slips away down the seam (MOTION.envelope.closure) before the doors part",
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
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.82, .9))
    # frame_portrait: inci dizisinin üst ucu (ipin "asıldığı" nokta) ve oval çerçevenin üstü (asılı çerçevenin salınım
    # noktası ve story yerleşimi için)
    fp = np.asarray(Image.open(prep / "frame_portrait.png").convert("RGBA"))[..., 3] >= 128
    satir_gen = fp.sum(1)
    ys_fp = np.flatnonzero(satir_gen)
    dar = satir_gen[ys_fp[0]:] < 0.2 * satir_gen.max()
    oval_ust = int(ys_fp[0] + np.argmin(dar)) if not dar.all() else int(ys_fp[0])
    manifest["frame_portrait"]["strand"] = {"top_pct": round(100 * ys_fp[0] / fp.shape[0], 2),
                                            "oval_top_pct": round(100 * oval_ust / fp.shape[0], 2),
                                            "note": "inci dizisi (ip) çerçevenin üst %'sinde; salınım noktası ipin üstü"}

    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55), esik=22)
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
    satin = bg.crop(SATIN_BOX)
    satin_kontrast = yerel_kontrast(satin)
    if satin_kontrast > PH_MAX_BUSY:
        sys.exit(f"mist: kırpım {SATIN_BOX} dekor içeriyor (yerel kontrast {satin_kontrast} > {PH_MAX_BUSY})")
    mist = satin.resize((640, round(640 * satin.height / satin.width)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2))
    webp(mist, "mist", [640], 76)
    manifest["mist"].update({"crop": list(SATIN_BOX), "blur": 2, "local_contrast": satin_kontrast,
                             "note": "bg_page'in çiçeksiz saten bölgesi (pencere ışığının çapraz gölgeleri) — ilk ekranların zemini"})
    hedef_renk = np.asarray(satin).reshape(-1, 3).astype(np.float64).mean(0)
    tile, dikis_kaydi = karo_duzelt(Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS),
                                    hedef_renk)
    webp(tile, "bg_tile", [640], 76)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["bg_tile"].update(dikis_kaydi)
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph, kontrast = yer_tutucu_temiz(bg, kutu, oran, max(gen))
        if kontrast > PH_MAX_BUSY:
            sys.exit(f"ph_{key}: kırpım {kutu} dekor içeriyor (yerel kontrast {kontrast} > {PH_MAX_BUSY})")
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"].update({"aspect": oran, "crop": list(kutu), "max_busy": kontrast})

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
    print(f"hiza ({hz['durum']}): {tb.hiza_ozet(hz)}")
    if hz["durum"] == "hata":
        sys.exit("kapalı/açık zarf hizası > %4 (GPT'den yeniden üretim gerekir)")
    # düzeltmeden sonra: katlanma çizgileri (dönüşümün eşlediği sütunlar) ve üst/alt alfa kenarları (px)
    ta2 = tb.alfa_kutusu(eta[..., 3], esik=128)
    fl_t, fr_t = fl * sx_c + dx_c, fr * sx_c + dx_c
    in_l = alfa_kutu(door_l_in, 128)
    in_r = alfa_kutu(door_r_in, 128)
    stage["align"] = hz
    stage["align_fix"]["after_px"] = {"left_fold": round(fl_t - k_x0, 2), "right_fold": round(fr_t - k_x1, 2),
                                      "door_l_in_hinge": round(in_l[2] - k_x0, 2), "door_r_in_hinge": round(in_r[0] - k_x1, 2),
                                      "top": ta2[1] - k_y0, "bottom": ta2[3] - k_y1}
    stage["align_fix"]["door_in_width_vs_closed_half"] = [round((in_l[2] - in_l[0]) / (seam["x"] - k_x0), 4),
                                                          round((in_r[2] - in_r[0]) / (k_x1 - seam["x"]), 4)]

    yesil = tb.yesil_denetle(out)
    if yesil:
        sys.exit(f"görünür #00FF00 kalıntısı: {yesil}")
    manifest["cleanup"] = temizlik
    manifest["checks"] = {"closed_layers_overlap_diff": round(fark_kapali, 5), "open_layers_overlap_diff": round(fark_acik, 5),
                          "green_px": 0,
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): parçacık katmanları; ilk ekran yatay telefonda da nav'ın üstünde biter,
    # hero isimleri ≥ 32 px (script yazı küçük x-yüksekliğinde: 32 px altı okunmaz)
    manifest["theme_check"] = {"particles": ".accent-layer, .glint-band",
                               "first_screen": {"landscape": True, "names_min_px": 32}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, eo_t, katman, stage, {"door_l": door_l, "door_r": door_r, "door_l_in": door_l_in,
                                             "door_r_in": door_r_in, "center": center, "pocket": pocket}, cl_crop, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · dikiş %{stage['seam_pct']} · kapanış {katman['closure']}")
    print(f"kapalı nesne {stage['closed_obj']}")
    print(f"açık nesne {stage['open_obj']['box_pct']} frac_w {stage['open_obj']['frac_w']}")
    print(f"kart yolu {stage['card_path']} kart {katman['card']}")
    print(f"cep {cep['flat_edge_y']} (köşe {cep['corner_top_y']}) · hiza sonrası {stage['align_fix']['after_px']}")
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


def onizleme(oniz, eo_t, katman, stage, parcalar, cl_crop, cs):
    """Kesim önizlemeleri (gözle denetim): kesilen parçalar, kapalı sahne (+ kapanış), açık sahne (+ kart)."""
    def on(im, bg):
        b = Image.new("RGBA", im.size, bg + (255,))
        b.alpha_composite(im)
        return b.convert("RGB")
    W, H = eo_t.size
    sheet = Image.new("RGB", (W * 3, H * 2))
    for i, k in enumerate(["door_l", "door_r", "center", "door_l_in", "door_r_in", "pocket"]):
        sheet.paste(on(parcalar[k], (190, 50, 50)), ((i % 3) * W, (i // 3) * H))
    sheet.thumbnail((2400, 1200))
    sheet.save(oniz / "kesimler.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    for ad, ks in (("kapali_sahne", ["door_l", "door_r", "closure"]),
                   ("acik_sahne", ["door_l_in", "door_r_in", "center", "card", "pocket"])):
        sahne = Image.new("RGBA", (900, round(SH * k)), (60, 80, 120, 255))
        for nm in ks:
            im = cl_crop if nm == "closure" else cs if nm == "card" else parcalar[nm].crop(alfa_kutu(parcalar[nm], 1))
            x, y, w, h = katman[nm]
            r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
            sahne.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
        sahne.convert("RGB").save(oniz / f"{ad}.jpg", quality=88)


if __name__ == "__main__":
    main()
