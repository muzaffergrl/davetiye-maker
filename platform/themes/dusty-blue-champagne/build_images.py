#!/usr/bin/env python3
"""Dusty Blue & Champagne teması (tasarım 02, G402) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir.
Teknik hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/dusty-blue-champagne/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/02_Dusty_Blue/assets/gpt/parts/ (G202, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre koşar
(alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" şeffaf, windows.json); tema klasörüne, img_src/'ye, assets/'e
yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py (webp, foto alanı, serbest bölge, yer tutucu, og,
ikon, hiza, kapak_kes, denetimler).

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf; mühür kapağın UCUNDA, kapakla taşınmaz: "breaks free and falls away"):
  * Kapak kesimi ALTIN KENARIN ALTINDAN: V kapağın serbest kenarı ince şampanya-altın bir çizgiyle bitiyor, altında 1–2 px
    açık kağıt dudağı, sonra gövdeye düşen temas gölgesi. tema_build.kapak_kes("v") V doğrularını doğru buluyor ama en
    güçlü parlaklık düşüşü kağıt → altın çizgi geçişi olduğundan kesimi altın çizginin ÜSTÜNDEN yapıyordu (altın kenar
    gövdede kalıyordu). Burada her sütunda altın pikseller (R − B > 60, R > 100) V bandında aranır; kenar = son altın
    satırı + açık dudak (lum > 226, en çok 3 satır) + 1. Köşelerdeki dik pah (altın çizgi köşeden dik iner) aynı taramayla
    izlenir. Süreklilik denetimi (sıçrama ≤ 6 px, doldurulan sütun ≤ %6), yoksa çıkış ≠ 0.
  * Ön cep kesimi ALTTAN TARAMA: açık zarfın önü sivri V değil — iki yan kanadın çapraz kenarı + alt kanadın daha yatık V'si
    (M benzeri dört doğru). tema_build.cep_kes("v") iki doğru uydurduğu için yan kanatların üstünde astar şeridi bırakıyordu.
    Burada her sütunda cebin fildişi kağıdından yukarı çıkılır; ilk kalıcı kağıt dışı satır (astar: B − R > 6 ya da
    lum < 200, 3 satır) kenardır. Kenar profiline 9 sütunluk kapanış (en büyük → en küçük süzgeç): astardaki fildişi
    çiçeklerin yarattığı dar yukarı sivrilikler silinir (kenarın üstünde kıymık kalmaz), eğim ve köşeler korunur.
  * Menteşe hizası: kit_check kenarları (sol −0,20 · sağ +0,29 · alt +0,07 %) geçiyor, ama GPT açık zarfın menteşesini
    (açık kapağın altın kenarının gövde köşelerinde bittiği satır) kapalı zarfın üst kenarından ~22 px
    yukarıda çizdi. Açık katmanlar alt kenara göre dikeyde ölçeklenir (01 ile aynı yöntem) → 90°'de kapak aynı menteşede
    el değiştirir.
  * Kapanış (closure.png = mavi mum mühür + okaliptüs dalı, tek parça) kare tuvalde büyük çizildi; yeri kesim geometrisine
    bağlı: çapa = V kapağın ucu (altın kenarın en alt noktası). Boy ve kayma W1.1 comp'ta ölçülür (mum çapı / zarf
    genişliği, mum merkezinin uca göre yüksekliği). Mühür kapakla dönmez: dokununca kopup düşer (site.js).
  * GPT kusurları (temizlik, çizimsiz): (1) her şeffaf parçada geniş yarı saydam beyaz/sıcak hâle (zarfta ~90 px, kartlarda
    ~140 px, alfa < 64) ve suluboya kümelerinin dış hattında sarı/kırmızı/camgöbeği renk saçağı — alfa tabanı + çekirdeğe
    yakınlık + kenar rengini komşu opak renge çekme; (2) dal (divider) parçasında eğreltinin çevresinde sıcak turuncu,
    yaprakların çevresinde yeşilimsi ışıma (alfa 64–200'e kadar) — sert alfa tabanı + renk; (3) pencere çevresindeki
    ayrıştırma saçağı halkası çerçeve renginden yeniden boyanır; (4) şeffaf piksellere komşu renk taşınır (WebP saçağı).

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json. site.css'teki yüzdeler
manifest'ten; --onizleme DIR kesim/kenar önizlemeleri yazar (gözle denetim). Tema klasörü ≤ 3 MB. Bağımlılık: Pillow + numpy.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/02_Dusty_Blue"
PARTS = COL / "assets/gpt/parts"
COMPS = COL / "assets/gpt/comps"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, en_buyuk_bolge, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [320, 640], "card_small": [320, 640], "invitation_card": [480, 960],
    "info_card": [480, 960], "frame_portrait": [360, 720], "frame_landscape": [480, 960], "florals_tl": [480, 960],
    "florals_br": [480, 960], "divider": [300, 600],
}
# palet (palette.json): ivory #FBF7EF (yer tutucu tonu), mist_top #DDE5EC
IVORY = (251, 247, 239)
MIST = (221, 229, 236)
# telefon zemini: bg_page'in çiçeksiz, bokehli orta-sol bandı (kümeler ayrı katman: florals_tl / florals_br)
PAPER_CROP = (168, 420, 568, 1290)
# geniş/yatay ekran zemini: bg_page'in en geniş çiçeksiz yatay bandı (755 × 500; 1280 × 800'de × 1,7, dikey kırpımın × 3,2
# yerine); altında dikişsiz bg_tile kendi ölçüsünde (kâğıt dokusu) — site.css
PAPER_WIDE_CROP = (116, 600, 871, 1100)
# GPT'nin sağ alt kümesindeki altın eğrelti comp'un şampanya altınından turuncuya kaçıyor (doygunluk 0,60; comp ~0,47):
# yalnız sıcak tonlara (H 25–45°) doygunluk × k, parlaklık × (1 + L); renk düzeltmesi, çizim değil (manifest.cleanup)
FERN_GRADE = {"florals_br": (0.74, 0.04), "florals_tl": (0.86, 0.02)}
PAPER_BUSY_MAX = 0.002   # kırpımda "dolu" piksel payı (yaprak/altın/gül) en çok bu; aşarsa çıkış ≠ 0
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: çiçeksiz bokehli bölgeler)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (200, 430, 560, 830)),
    "story_1": ("portrait", [360, 720], (190, 440, 560, 900)),
    "story_2": ("portrait", [360, 720], (700, 280, 1020, 700)),
    "story_3": ("portrait", [360, 720], (160, 800, 520, 1240)),
    "venue": ("landscape", [480, 960], (120, 760, 860, 1160)),
}
PH_MIN_LUM = 175   # yer tutucuda en koyu piksel (gri ton) en az bu: kümeden yaprak/gül kırpıma girmez (çıkış ≠ 0)
CARD_W_OF_ENV = 0.60     # zarftaki kartın genişliği / zarf genişliği
DUDAK = 3                # altın kenarın son satırından sonra kapakta kalan satır (açık kağıt dudağı: 2 satır) + 1


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (GPT hâlesi, saçak)

def hale_temizle(im: Image.Image, sert: bool, esik: int = 12, cekirdek: int = 96, yesil: bool = True):
    """Dış hattaki yarı saydam hâleyi temizler (çizim yok). sert: kart/çerçeve/zarf/mühür gibi net kenarlı nesne.
    1) alfa < esik → 0, kalan alfa [esik, 255] → [0, 255]; 2) çekirdekten (alfa ≥ cekirdek) uzak (sert 1 px, yumuşak
    3 px) piksel silinir; 3) kenar pikselinin (alfa < 230) rengi komşu opak piksellerin ortalamasına çekilir (beyaz/sarı/
    camgöbeği saçak). (RGBA, bilgi)."""
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
    if yesil:
        mx = np.maximum(a[..., 0], a[..., 2])
        kenar2 = (yeni > 0) & (al < 230)
        asiri = kenar2 & (a[..., 1] > 1.4 * mx)
        a[..., 1][asiri] = 1.4 * mx[asiri]
        # koyu doygun yaprak pikseli WebP 4:2:0'da "görünür #00FF00" eşiğini geçmesin
        fazla = (a[..., 1] - mx > 24) & (a[..., 1] * 2 >= 3 * mx)
        a[..., 1][fazla] = mx[fazla] + 24
    a[..., 3] = yeni
    sonra = int((yeni > 0).sum())
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), {
        "alpha_floor": esik, "core": cekirdek, "reach_px": 1 if sert else 3, "removed_px": once - sonra}


def pencere_halkasi(im: Image.Image, prep: Path, win: dict, ad: str, halka: int = 3):
    """parts_prep pencere ayrıştırmasının bıraktığı renkli saçağı temizler: pencerenin `halka` px çevresinde görünen
    piksellerin rengi, 4–10 px dışındaki opak çerçeve renginden (normalize kutu bulanıklığı) yeniden alınır; alfa
    korunur. (RGBA, düzeltilen piksel sayısı)."""
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
    """Şeffaf piksellerin RGB'si (Pillow'un önçarpımlı küçültmesinden sonra siyah) görünen komşu renkle doldurulur
    ("alpha bleeding"); görüntü değişmez (yalnız alfa 0 piksellerin rengi), WebP kenarında koyu saçak olmaz."""
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
    """tema_build.webp ile aynı çıktı biçimi (manifest[name] = {src_size, ratio, files}); fark: şeffaf parçada küçültme
    sonrası renk taşıma (renk_tasir) — WebP kenar saçağı olmasın."""
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


def _hsv(rgb):
    mx, mn = rgb.max(-1), rgb.min(-1)
    d = mx - mn
    s = np.where(mx > 0, d / np.maximum(mx, 1e-9), 0)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    dd = np.maximum(d, 1e-9)
    h = np.where(mx == r, ((g - b) / dd) % 6, np.where(mx == g, (b - r) / dd + 2, (r - g) / dd + 4)) * 60
    return np.where(d > 0, h, 0), s, mx


def _rgb(h, s, v):
    c = v * s
    x = c * (1 - np.abs((h / 60) % 2 - 1))
    m = v - c
    z = np.zeros_like(h)
    k = (h // 60).astype(int) % 6
    r = np.choose(k, [c, x, z, z, x, c]); g = np.choose(k, [x, c, c, x, z, z]); b = np.choose(k, [z, z, x, c, c, x])
    return np.stack([r + m, g + m, b + m], -1)


def egrelti_ton(im: Image.Image, k: float, L: float):
    """Altın eğrelti tonu: H 25–45° (yumuşak kenar ± 8°) ve doygunluk ≥ 0,25 (krem güller 0,1 civarı: dokunulmaz) olan
    piksellerde doygunluk × k, parlaklık × (1 + L). Ölçü: opak (α > 200), H 25–45°, S > 0,3 piksellerin ortalama doygunluğu."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    h, s, v = _hsv(a[..., :3] / 255)
    op = a[..., 3] > 200

    def olc(h_, s_):
        m = op & (h_ >= 25) & (h_ <= 45) & (s_ > 0.3)
        return round(float(s_[m].mean()), 3) if m.any() else None
    once = olc(h, s)
    wh = np.clip(1 - np.maximum(25 - h, h - 45) / 8, 0, 1)
    ws = np.clip((s - 0.15) / 0.10, 0, 1)
    w = wh * ws
    s2 = s * (1 - w * (1 - k))
    v2 = np.minimum(1, v * (1 + w * L))
    a[..., :3] = np.clip(_rgb(h, s2, v2) * 255, 0, 255)
    out = Image.fromarray(np.rint(a).astype(np.uint8), "RGBA")
    return out, {"hue_deg": [25, 45], "feather_deg": 8, "sat_from": 0.25, "sat_k": k, "value_gain": L,
                 "mean_sat_before": once, "mean_sat_after": olc(h, s2), "px": int((w > 0.5).sum())}


def dikissiz(im: Image.Image, bant: float = 0.28) -> Image.Image:
    """GPT karosu tam dikişsiz değil (640 px döşemede 1 px dikey ek izi görünüyordu). Klasik yarım kaydırma harmanı:
    karonun yarım genişlik/yükseklik kaydırılmış kopyası kenar bantlarında (genişliğin %28'i, yumuşak) üste konur —
    kenarda içerik kaydırılmış kopyadan gelir (karşılıklı kenarlar artık bitişik pikseller), kopyanın kendi eki ortada
    ağırlık 0'da kalır. Yalnız aynı görselin harmanı; çizim yok."""
    a = np.asarray(im.convert("RGB")).astype(np.float64)
    H, W = a.shape[:2]
    b = np.roll(np.roll(a, W // 2, 1), H // 2, 0)
    def kenar(n):
        d = np.minimum(np.arange(n), n - 1 - np.arange(n)) / (bant * n)
        t = np.clip(1 - d, 0, 1)
        return t * t * (3 - 2 * t)   # smoothstep
    w = np.maximum(kenar(W)[None, :], kenar(H)[:, None])[..., None]
    return Image.fromarray(np.clip(np.rint(a * (1 - w) + b * w), 0, 255).astype(np.uint8), "RGB")


def alfa_kutu(im: Image.Image, esik: int = 8):
    k = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)
    return [int(v) for v in k]


def hale_payi(im: Image.Image, esik: int = 8, dis: int = 4) -> dict:
    """Temizlikten sonra nesnenin dış hattının `dis` px dışında kalan görünür piksel (hâle artığı) sayısı."""
    al = np.asarray(im.convert("RGBA"))[..., 3]
    core = genislet(~genislet(~(al >= 128), 2), 2)
    uzak = ~genislet(core, dis)
    return {"halo_px": int(((al > esik) & uzak).sum())}


# ============================================================================= kesimler (bu tasarım)

def altin_kapak_kes(ec: Image.Image):
    """Kapalı zarf → (kapak RGBA tam tuval, bilgi). V doğruları ve menteşe tema_build.kapak_kes("v")'den; kenar her sütunda
    altın kenar çizgisinin son satırı + açık kağıt dudağı + 1 (temas gölgesi gövdede). Bulamazsa kapak_kes kesimi (uyarı)."""
    flap0, kb = tb.kapak_kes(ec, "v")
    a = np.asarray(ec).astype(np.float64)
    H, W = a.shape[:2]
    lum = a[..., :3] @ LUM
    r, b = a[..., 0], a[..., 2]
    # altın çizgi doygun (B < 0,45 R); hemen altındaki sıcak temas gölgesi (162, 124, 86) daha az doygun → altın sayılmaz
    altin = (r - b > 60) & (r > 100) & (b < 0.45 * r) & (a[..., 3] > 200)
    ml, cl = kb["left"][0], kb["left"][1]
    mr, cr = kb["right"][0], kb["right"][1]
    tipx = kb["tip"][0]
    hinge = int(kb["hinge_row"])
    xs = np.arange(W)
    vy = np.where(xs < tipx, ml * xs + cl, mr * xs + cr)
    cols = np.flatnonzero(a[..., 3].max(0) > 200)
    x0, x1 = int(cols.min()), int(cols.max())
    kenar = np.full(W, -1.0)
    for x in range(x0, x1 + 1):
        # bant: menteşeden V'nin 28 px altına (köşe pahı V doğrusunun altına iner); yalnız üstten İLK kesintisiz altın
        # koşusu (≤ 2 px boşluk) — köşe pahının altındaki gövdede sıcak gölge pikselleri altın sayılmaz
        lo, hi = hinge, int(min(H, vy[x] + 28))
        g = np.flatnonzero(altin[lo:hi, x])
        if not len(g):
            continue
        son = int(g[0])
        for v in g[1:]:
            if v - son > 3:
                break
            son = int(v)
        kenar[x] = lo + son + DUDAK
    bulunan = int((kenar[x0:x1 + 1] >= 0).sum())
    bilgi = {"method": "renk", "detector": "kapak_kes V + üstten ilk altın koşusu (R − B > 60, B < 0,45 R; ≤ 2 px boşluk) son satırı + 2 px açık dudak",
             "hinge_row": hinge, "v_left": [round(float(ml), 4), round(float(cl), 2)],
             "v_right": [round(float(mr), 4), round(float(cr), 2)], "columns": [x0, x1], "found": bulunan, "warnings": []}
    if bulunan < 0.9 * (x1 - x0 + 1):
        bilgi.update(method="kapak_kes", warnings=[f"altın kenar {bulunan}/{x1 - x0 + 1} sütunda bulundu → kapak_kes kesimi"])
        tam = Image.new("RGBA", (W, H))
        tam.paste(flap0, (0, 0))
        return tam, dict(bilgi, tip=[float(v) for v in kb["tip"]])
    # köşedeki altın olmayan uç sütunlar: menteşe (kapak yok)
    for x in range(x0, x1 + 1):
        if kenar[x] < 0:
            kenar[x] = hinge
    # süreklilik: V'ye göre kayma kayan medyandan 10 px'ten fazla saparsa komşulardan doldurulur (köşe pahı hariç: orada
    # kenar dik iner, V'den sapma beklenir — ilk/son 40 sütun ölçüye girmez)
    xr = np.arange(x0, x1 + 1)
    dd = kenar[x0:x1 + 1] - vy[x0:x1 + 1]
    ic = (xr > x0 + 40) & (xr < x1 - 40)
    pad = np.pad(dd, 15, mode="edge")
    med = np.array([np.median(pad[i:i + 31]) for i in range(len(dd))])
    aykiri = (np.abs(dd - med) > 10) & ic
    if aykiri.any() and (~aykiri).sum() >= 2:
        dd[aykiri] = np.interp(xr[aykiri], xr[~aykiri], dd[~aykiri])
        kenar[x0:x1 + 1] = vy[x0:x1 + 1] + dd
    adim = np.abs(np.diff(kenar[x0 + 40:x1 - 40]))
    bilgi["continuity"] = {"replaced_columns": int(aykiri.sum()), "max_step_px": round(float(adim.max()), 1),
                           "limits": {"replaced_max_frac": 0.06, "max_step_px": 6}}
    yy = np.arange(H)[:, None]
    m = np.clip(kenar[None, :] - yy + 0.5, 0, 1)
    m[:, :x0] = 0
    m[:, x1 + 1:] = 0
    flap = a.copy()
    flap[..., 3] *= m
    orta = (xs > tipx - 60) & (xs < tipx + 60)
    yt = float(kenar[orta].max())
    xt = float(xs[orta][np.argmax(kenar[orta])])
    bilgi["tip"] = [round(xt, 1), round(yt, 1)]
    bilgi["rows"] = [0, int(np.ceil(kenar.max())) + 1]
    bilgi["edge_minus_v_px"] = [round(float(v), 1) for v in np.percentile(dd[ic], [5, 50, 95])]
    return Image.fromarray(np.clip(np.rint(flap), 0, 255).astype(np.uint8), "RGBA"), bilgi


def menteşe_acik(eo: Image.Image) -> int:
    """Açık zarfın menteşe satırı: açık kapağın altın kenarı gövdenin iki dış köşesinde biter (kapak tabanı = katlanma
    çizgisi); gövde kenarına 6 px içindeki sütunlarda son altın satırının medyanı + 1."""
    a = np.asarray(eo).astype(np.float64)
    al = a[..., 3]
    H = al.shape[0]
    altin = (a[..., 0] - a[..., 2] > 60) & (a[..., 0] > 100) & (al > 200)
    alt = np.flatnonzero((al > 200).any(1)).max()
    satir = al[int(alt - 40)] > 200
    gx0, gx1 = int(np.argmax(satir)), int(len(satir) - 1 - np.argmax(satir[::-1]))
    sonlar = []
    for x in list(range(gx0, gx0 + 7)) + list(range(gx1 - 6, gx1 + 1)):
        g = np.flatnonzero(altin[int(0.3 * H):int(0.6 * H), x])
        if len(g):
            sonlar.append(int(0.3 * H) + int(g.max()) + 1)
    if len(sonlar) < 4:
        sys.exit("açık zarf: menteşe (kapak tabanındaki altın kenar) bulunamadı")
    return int(round(float(np.median(sonlar))))


def cep_tara(eo: Image.Image, hinge: int, pay: float = 1.0):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Her sütunda cebin fildişi kağıdından (gövdenin altından
    %8 yukarıdaki satırdan) yukarı çıkılır; 3 satır üst üste kağıt dışı (astar: B − R > 6 ya da lum < 200) ilk satır =
    kenar. Profile 9 sütunluk kapanış (dar yukarı sivrilikler silinir); kenar `pay` px yukarı (kağıdın açık kesik şeridi cepte)."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    cols = np.flatnonzero(op.any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    alt = int(np.flatnonzero(op.any(1)).max())
    lum = a[..., :3] @ LUM
    kagit = (lum >= 200) & (a[..., 2] - a[..., 0] <= 6) & op
    bas = int(alt - 0.08 * (alt - hinge))
    kenar = np.full(W, np.nan)
    for x in range(x0 + 3, x1 - 2):
        k = kagit[:, max(0, x - 1):x + 2].mean(1) > 0.5
        y = bas
        while y > hinge and (k[y] or k[y - 1] or k[y - 2]):
            y -= 1
        kenar[x] = y + 1
    xr = np.arange(x0 + 3, x1 - 2)
    e = kenar[xr]
    # dar yukarı sivrilikler (astardaki fildişi çiçek kağıt sanılır → kenarın üstünde fildişi kıymık) = profilde dar
    # çukurlar: 9 sütunluk kapanış (önce en büyük, sonra en küçük süzgeç) onları siler, eğimi ve köşeleri korur
    def suz(v, r, f):
        p = np.pad(v, r, mode="edge")
        return np.array([f(p[i:i + 2 * r + 1]) for i in range(len(v))])
    kap = suz(suz(e, 4, np.max), 4, np.min)
    aykiri = np.abs(e - kap) > 1.5
    e = kap
    kenar[xr] = e
    kenar[:x0 + 3] = kenar[x0 + 3]
    kenar[x1 - 2:] = kenar[x1 - 3]
    kenar = kenar - pay
    yy = np.arange(H)[:, None]
    m = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    cep = a.copy()
    cep[..., 3] *= m
    xm = int((x0 + x1) / 2)
    orta = slice(xm - 40, xm + 41)
    bilgi = {"method": "renk", "detector": "alttan tarama: fildişi kağıt (lum ≥ 200, B − R ≤ 6) → ilk kalıcı astar satırı",
             "body": [x0, hinge, x1, alt], "outlier_columns": int(aykiri.sum()),
             "edge_at": {"x0": round(float(kenar[x0 + 3]), 1), "mid": round(float(np.nanmax(kenar[orta])), 1),
                         "x1": round(float(kenar[x1 - 3]), 1)},
             "tip": [float(xm - 40 + int(np.nanargmax(kenar[orta]))), round(float(np.nanmax(kenar[orta])), 1)],
             "warnings": []}
    if aykiri.mean() > 0.08:
        bilgi["warnings"].append(f"cep kenarı gürültülü: {int(aykiri.sum())} sütun düzeltildi — önizlemede gözle")
    return Image.fromarray(np.clip(np.rint(cep), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def mum_olc(rgb: np.ndarray, bolge=None, alfa=None):
    """Mavi mum mühür: mavi (B > G + 4, B − R > 15), 40 < lum < 235; kapatma 6 + açma 5 px, en büyük bölge.
    → (x0, y0, x1, y1) (x1, y1 hariç). Dal yaprağı üstte bitişebildiği için yükseklik değil genişlik güvenilir."""
    a = rgb.astype(np.float64)
    lum = a @ LUM
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = (b > g + 4) & (b - r > 15) & (lum > 40) & (lum < 235)
    if alfa is not None:
        m &= alfa > 200
    if bolge is not None:
        m &= bolge
    m = ~genislet(~genislet(m, 6), 6)
    m = genislet(~genislet(~m, 5), 5)
    s = en_buyuk_bolge(m)
    ys, xs = np.nonzero(s)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def comp_olc():
    """W1.1 comp (comps/web_1_envelope.png): zarf genişliği, mum çapı ve mum merkezinin V ucuna göre yüksekliği.
    Zarf = fildişi kağıt sütunları; V ucu = sağ altın kenar doğrusu (sol kenar mühür dalının altında kalıyor) zarfın orta
    sütununda (simetrik zarf); mum = mum_olc (comp'ta mum merkezi + kenar)."""
    comp = np.asarray(Image.open(COMPS / "web_1_envelope.png").convert("RGB")).astype(np.float64)
    lum = comp @ LUM
    r, b = comp[..., 0], comp[..., 2]
    paper = (lum > 222) & (r >= b - 4)
    reg = np.zeros(paper.shape, bool)
    reg[560:1150, 120:900] = True
    env = en_buyuk_bolge(paper & reg)
    cols = np.flatnonzero(env.any(0))
    ex0, ex1 = int(cols.min()), int(cols.max()) + 1
    gold = (r - b > 50) & (r > 120)
    gold[:615] = False
    gold[1100:] = False
    gold[:, :ex0] = False
    gold[:, ex1:] = False
    gold[760:1080, 340:680] = False
    pts = np.argwhere(gold).astype(np.float64)
    pts = pts[pts[:, 1] > (ex0 + ex1) / 2 + 40]
    for _ in range(12):
        m, c = np.polyfit(pts[:, 1], pts[:, 0], 1)
        res = pts[:, 0] - (m * pts[:, 1] + c)
        k = np.abs(res) < max(3, 2.5 * np.median(np.abs(res)) * 1.48)
        if k.all():
            break
        pts = pts[k]
    xm = (ex0 + ex1) / 2
    tip = (xm, m * xm + c)
    bolge = np.zeros(paper.shape, bool)
    bolge[760:1040, 380:660] = True
    wx0, wy0, wx1, wy1 = mum_olc(comp, bolge)
    ww = wx1 - wx0
    wc = ((wx0 + wx1) / 2, wy1 - ww / 2)
    env_w = ex1 - ex0
    return {"env_x": [ex0, ex1], "env_w": env_w, "v_right": [round(m, 4), round(c, 1), int(len(pts))],
            "tip": [round(tip[0], 1), round(tip[1], 1)], "wax_box": [wx0, wy0, wx1, wy1], "wax_w": ww,
            "wax_c": [round(wc[0], 1), round(wc[1], 1)], "wax_w_over_env_w": round(ww / env_w, 4),
            "wax_c_minus_tip_over_env_w": round((wc[1] - tip[1]) / env_w, 4)}


def halka_olc(rgba: np.ndarray, mum):
    """Mührün içindeki ince gümüş halka (boş basılı merkez, monogram yeri): mum kutusunun içinde açık, az doygun
    pikseller (lum > 165, max − min < 45); halkanın kutusu = mum merkezine en yakın yoğun bölgenin dış sınırı.
    → (x0, y0, x1, y1)."""
    a = rgba.astype(np.float64)
    x0, y0, x1, y1 = mum
    w = x1 - x0
    cx, cy = (x0 + x1) / 2, y1 - w / 2
    lum = a[..., :3] @ LUM
    sat = a[..., :3].max(-1) - a[..., :3].min(-1)
    acik = (lum > 165) & (sat < 45) & (a[..., 3] > 200)
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    d = np.hypot(xx - cx, yy - cy)
    # halka yarıçapı: merkezden dışa doğru açık piksel oranının en yüksek olduğu yarıçap (mum yarıçapının %45–80'i)
    rs = np.arange(int(0.45 * w / 2), int(0.8 * w / 2))
    oran = np.array([acik[(d >= r0) & (d < r0 + 2)].mean() for r0 in rs])
    rh = float(rs[int(np.argmax(oran))]) + 1
    return int(cx - rh), int(cy - rh), int(cx + rh), int(cy + rh), round(rh, 1)


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(8.0, 92.0), min_gen: float = 70.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = merkezden iki yana açıklık ≥ min_gen (yalnız ince altın
    çerçeve çizgileri). Orta bant dikeyde gerilir: içinde süs olursa o da gerilirdi, bu yüzden yalnız düz satırlar. Üst
    dilim sonu = en uzun düz bandın başı, alt dilim başı = sonu. (t, b, [t, b])."""
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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="db-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (dusty-blue-champagne); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
                         "stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q
    temizlik = {}

    def webp(im, name, widths, q_=None):
        webp_yaz(im, name, widths, q_ or q, manifest, out)

    # ------------------------------------------------------------------ zarf (aynı tuval: 1024×1536)
    ec_raw = Image.open(PARTS / "envelope_closed.png").convert("RGBA")
    eo_raw = Image.open(PARTS / "envelope_open.png").convert("RGBA")
    ec, temizlik["envelope_closed"] = hale_temizle(ec_raw, sert=True)
    eo, temizlik["envelope_open"] = hale_temizle(eo_raw, sert=True)
    temizlik["envelope_closed"].update(hale_payi(ec))
    temizlik["envelope_open"].update(hale_payi(eo))
    W, H = ec.size

    flap, kb = altin_kapak_kes(ec)
    uyar("env_cflap", kb)
    sur = kb.get("continuity")
    if sur and (sur["max_step_px"] > 6 or sur["replaced_columns"] > 0.06 * (kb["columns"][1] - kb["columns"][0] + 1)):
        sys.exit(f"kapak kesimi: altın kenar sürekli değil ({sur}) — kesim önizlemesine bak (--onizleme)")
    acik_ust = menteşe_acik(eo)
    pocket, cep, cep_kenar = cep_tara(eo, acik_ust)
    uyar("env_pocket", cep)
    yy = np.arange(H)[:, None]
    eoa = np.asarray(eo).astype(np.float64)
    m_flap = np.clip(acik_ust + 3 - yy + 0.5, 0, 1) * np.ones((1, W))
    m_body = np.clip(yy - (acik_ust - 2) + 0.5, 0, 1) * np.ones((1, W))
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

    # menteşe hizası (docs/11 §7.1 "ölçülen dönüşüm"): açık gövde üstü = kapalı menteşe, açık gövde altı = kapalı alt kenar
    eca0 = np.asarray(ec)[..., 3]
    kapali_ust = int(kb["hinge_row"])
    kapali_alt = int(np.flatnonzero(eca0.max(1) > 200).max()) + 1
    acik_alt = int(cep["body"][3]) + 1
    sy = (kapali_alt - kapali_ust) / (acik_alt - acik_ust)
    dy = kapali_ust - acik_ust * sy

    def hizala(im):
        rr = im.resize((W, max(1, round(H * sy))), Image.LANCZOS)
        tuval = Image.new("RGBA", (W, H))
        tuval.paste(rr, (0, round(dy)))
        return tuval
    eo = hizala(eo)
    env_flap, env_body, pocket = hizala(env_flap), hizala(env_body), hizala(pocket)
    cep_kenar = kapali_ust + (cep_kenar - acik_ust) * sy
    govde_ust = kapali_ust
    hiza_duzeltme = {"open_scale_y": round(sy, 5), "open_offset_y_px": round(dy, 1),
                     "open_body_rows_before": [acik_ust, acik_alt], "closed_rows": [kapali_ust, kapali_alt],
                     "reason": "GPT: açık zarfın menteşesi kapalı zarfın üst kenarından yukarıda; alt kenara göre dikey ölçek"}
    print(f"menteşe hizası: açık katmanlar dikeyde × {sy:.4f}, öteleme {dy:.1f} px (açık menteşe {acik_ust} → {kapali_ust})")

    # ------------------------------------------------------------------ kapanış (mum mühür + okaliptüs dalı, tek parça)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    temizlik["closure"].update(hale_payi(cl))
    cla = np.asarray(cl_raw)
    mx0, my0, mx1, my1 = mum_olc(cla[..., :3], alfa=cla[..., 3])
    mum_w = mx1 - mx0
    mum_c = ((mx0 + mx1) / 2, my1 - mum_w / 2)       # yuvarlak mum: üstte bitişik yaprak yüksekliği bozar
    hx0, hy0, hx1, hy1, hr = halka_olc(cla, (mx0, my0, mx1, my1))
    comp = comp_olc()
    eca = np.asarray(ec)[..., 3]
    ecols = np.flatnonzero(eca.max(0) > 200)
    erows = np.flatnonzero(eca.max(1) > 200)
    env_x0, env_x1, env_y0, env_y1 = int(ecols.min()), int(ecols.max()) + 1, int(erows.min()), int(erows.max()) + 1
    env_w = env_x1 - env_x0
    s = comp["wax_w_over_env_w"] * env_w / mum_w             # closure tuval px → zarf tuval px
    tip = kb["tip"]
    hedef = (tip[0], tip[1] + comp["wax_c_minus_tip_over_env_w"] * env_w)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    c_left = hedef[0] - (mum_c[0] - ck[0]) * s
    c_top = hedef[1] - (mum_c[1] - ck[1]) * s
    c_w, c_h = (ck[2] - ck[0]) * s, (ck[3] - ck[1]) * s
    closure_box = [c_left, c_top, c_left + c_w, c_top + c_h]

    # ------------------------------------------------------------------ kart (card_small) yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    card_w = CARD_W_OF_ENV * env_w
    card_h = card_w / card_ar
    card_x = (env_x0 + env_x1) / 2 - card_w / 2
    hidden_top = govde_ust + 0.06 * (env_y1 - env_y0)                  # kapalıyken gövdenin arkasında
    kose_kenar = float(min(cep_kenar[int(card_x)], cep_kenar[int(card_x + card_w)]))
    # out: alt köşeler cebin kenarını kartın %4'ü kadar aşmış; front: okunur biçimde öne gelir (%3,5 yukarı, × 1.09,
    # büyüyen gölge) → home kartına yukarı devam eder (aşağı inmez; G402 incelemesi: × 1.04 fark edilmiyordu)
    out_top = kose_kenar - 0.04 * card_h - card_h
    front_top = out_top - 0.035 * card_h
    card_box_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    ob_box = alfa_kutu(eo, esik=1)
    cb_box = alfa_kutu(ec, esik=1)
    scale_front = 1.09
    fr_w, fr_h = card_w * scale_front, card_h * scale_front
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
        k = [int(np.floor(X0)), k[1], int(np.ceil(X1)), k[3]]     # yatayda sahnenin tam genişliği (left 0, width 100 %)
        webp(im.crop(k), ad, WIDTHS[ad])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    webp(cl_crop, "closure", WIDTHS["closure"])
    katman["closure"] = pct(closure_box)
    katman["card"] = pct(card_box_hidden)
    stage["parts"] = katman
    stage["hinge_pct"] = round(100 * (kb["hinge_row"] - Y0) / SH, 3)
    stage["body_bottom_pct"] = round(100 * (env_y1 - Y0) / SH, 3)
    stage["closed_obj"] = {"box_pct": pct([env_x0, env_y0, env_x1, env_y1]), "aspect": round(env_w / (env_y1 - env_y0), 4),
                           "frac_w": round(env_w / SW, 5), "top_frac_of_stage_w": round((env_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - env_y1) / SW, 5)}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3), "front_scale": scale_front,
                          "pocket_edge_at_card_corners": round(kose_kenar, 1), "card_w_of_env": CARD_W_OF_ENV}
    stage["cuts"] = {"cflap": kb, "pocket": cep, "open_hinge_row": acik_ust}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak)}
    stage["hinge_align"] = hiza_duzeltme
    manifest["stage"] = stage
    cw_, ch_ = ck[2] - ck[0], ck[3] - ck[1]
    manifest["closure"].update({
        "anchor": "V flap tip (lowest point of the champagne-gold edge)", "anchor_px": [round(tip[0], 1), round(tip[1], 1)],
        "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "wax_box_closure_px": [mx0, my0, mx1, my1],
        "wax_center_in_crop_pct": [round(100 * (mum_c[0] - ck[0]) / cw_, 3), round(100 * (mum_c[1] - ck[1]) / ch_, 3)],
        "ring_in_crop_pct": [round(100 * (hx0 - ck[0]) / cw_, 3), round(100 * (hy0 - ck[1]) / ch_, 3),
                             round(100 * (hx1 - hx0) / cw_, 3), round(100 * (hy1 - hy0) / ch_, 3)],
        "measured_from": "comps/web_1_envelope.png", "comp": comp, "carried_by_flap": False,
        "motion": "breaks free and falls away (site.js MOTION.envelope.closure / fall)",
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = hale_temizle(im, sert=True)
        im, n_halka = pencere_halkasi(im, prep, win, parca)
        temizlik[parca]["window_ring_px"] = n_halka
        temizlik[parca].update(hale_payi(im))
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
        if oniz:
            for nm, bgc in (("acik", (226, 233, 240)), ("koyu", (40, 44, 52))):
                bg = Image.new("RGBA", im.size, bgc + (255,))
                bg.alpha_composite(im)
                bg.convert("RGB").save(oniz / f"kenar_{parca}_{nm}.jpg", quality=88)
    manifest["photo_slots"] = slots
    # kağıt (çerçevenin fildişi kartı) kutusu: çerçevenin sol üstündeki dal kartın dışına taşar (frame_portrait,
    # frame_landscape); fotoğraf dizilişi ve başlık kartın kendi kutusuna göre
    for parca in ("card_small", "frame_portrait", "frame_landscape"):
        im = np.asarray(Image.open(out / manifest[parca]["files"][-1]["file"]).convert("RGBA")).astype(np.float64)
        lum = im[..., :3] @ LUM
        kag = (im[..., 3] > 240) & (lum > 215) & (im[..., 0] >= im[..., 2] - 6)
        ys, xs = np.nonzero(en_buyuk_bolge(kag))
        Hh, Ww = lum.shape
        manifest[parca]["paper_pct"] = [round(100 * xs.min() / Ww, 3), round(100 * ys.min() / Hh, 3),
                                        round(100 * (xs.max() + 1 - xs.min()) / Ww, 3), round(100 * (ys.max() + 1 - ys.min()) / Hh, 3)]
    # (anlık baskıların başlık bandı: çerçeveler sahnede eğik durduğu için theme-check'in doğrusal free_zone eşlemesi
    # kullanılamaz — başlık kutusu CSS'te pencerenin altındaki kağıt bandına (paper_pct ∩ pencere altı) bağlı, site.js
    # fitCaptions sığdırır; bant yüzdesi burada)
    fp = manifest["frame_portrait"]
    fp["caption_band_pct"] = [round(slots["portrait"]["box_pct"][1] + slots["portrait"]["box_pct"][3], 3),
                              round(fp["paper_pct"][1] + fp["paper_pct"][3], 3)]
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(out / manifest["card_small"]["files"][-1]["file"]), 0.5, ornek=(.8, .86))

    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True, esik=20)
        temizlik[nm].update(hale_payi(im))
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        t, b, _ = dilimler(fz)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (dikey "
                                          "gerilir), alt dilim ::after — docs/11 §9; site.css --t/--b"}
        if oniz:
            bg = Image.new("RGBA", im.size, (205, 218, 232, 255))
            bg.alpha_composite(im)
            bg.convert("RGB").save(oniz / f"kenar_{nm}.jpg", quality=86)

    for nm in ("florals_tl", "florals_br", "divider"):
        # divider: eğrelti çevresinde sıcak, yapraklar çevresinde yeşilimsi ışıma (alfa 64–200) → yüksek alfa tabanı
        esik, cek = (110, 200) if nm == "divider" else (16, 110)
        im, temizlik[nm] = hale_temizle(Image.open(prep / f"{nm}.png"), sert=False, esik=esik, cekirdek=cek)
        temizlik[nm].update(hale_payi(im))
        if nm in FERN_GRADE:
            im, temizlik[nm]["fern_grade"] = egrelti_ton(im, *FERN_GRADE[nm])
        im = im.crop(alfa_kutu(im))
        webp(im, nm, WIDTHS[nm])
        if oniz:
            for tag, bgc in (("acik", (214, 225, 236)), ("koyu", (40, 44, 52))):
                bg = Image.new("RGBA", im.size, bgc + (255,))
                bg.alpha_composite(im)
                bg.convert("RGB").save(oniz / f"kenar_{nm}_{tag}.jpg", quality=86)
    for i in (1, 2, 3):
        im, temizlik[f"accent_{i}"] = hale_temizle(Image.open(prep / f"accent_{i}.png"), sert=False, esik=16)
        im = im.crop(alfa_kutu(im))
        im.thumbnail((200, 200), Image.LANCZOS)
        webp(im, f"accent_{i}", [im.width])

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    # telefon/geniş ekran sahne kağıdı: çiçeksiz bokehli kırpım (kümeler ayrı katman, ekranda bütün)
    paper = bg.crop(PAPER_CROP)
    pa = np.asarray(paper).astype(np.float64)
    plum = pa @ LUM
    dolu = float(((plum < 170) | (pa[..., 0] > pa[..., 2] + 8)).mean())
    if dolu > PAPER_BUSY_MAX:
        sys.exit(f"paper: kırpım {PAPER_CROP} dekor içeriyor (dolu pay {dolu:.4f} > {PAPER_BUSY_MAX})")
    webp(paper, "paper", [paper.width], 82)
    manifest["paper"].update({"crop": list(PAPER_CROP), "busy_share": round(dolu, 5)})
    genis = bg.crop(PAPER_WIDE_CROP)
    ga = np.asarray(genis).astype(np.float64)
    dolu_g = float((((ga @ LUM) < 170) | (ga[..., 0] > ga[..., 2] + 8)).mean())
    if dolu_g > PAPER_BUSY_MAX:
        sys.exit(f"paper_wide: kırpım {PAPER_WIDE_CROP} dekor içeriyor (dolu pay {dolu_g:.4f} > {PAPER_BUSY_MAX})")
    webp(genis, "paper_wide", [genis.width], 82)
    manifest["paper_wide"].update({"crop": list(PAPER_WIDE_CROP), "busy_share": round(dolu_g, 5)})
    # bg_page-* / mist: hiçbir sayfa kullanmıyor (docs/11 §1: kullanılmayan görsel tema klasörüne girmez)
    # uzun sayfa zemini: bg_tile (dikişsiz suluboya kağıt), sahne kağıdının ortalama rengine çekilir (renk sıçraması yok)
    # periodisch küçültme: 3 × 3 döşenmiş karo küçültülüp ortası alınır (kenar sütunları komşu karoyu görür; tek karonun
    # LANCZOS küçültmesi kenarda kopma bırakıyordu → sayfada 640 px'te dikey/yatay ek izi)
    t0 = dikissiz(Image.open(PARTS / "bg_tile.png").convert("RGB"))
    mozaik = Image.new("RGB", (t0.width * 3, t0.height * 3))
    for i in range(3):
        for k in range(3):
            mozaik.paste(t0, (i * t0.width, k * t0.height))
    tile = mozaik.resize((1920, 1920), Image.LANCZOS).crop((640, 640, 1280, 1280))
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = pa.reshape(-1, 3).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 85)   # kâğıt dokusu geniş ekranda görünür: daha yüksek kalite (G402 incelemesi)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in hedef_renk]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in hedef_renk)

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph = tb.yer_tutucu(bg, kutu, oran, max(gen), ton=IVORY, karisim=0.30)
        en_koyu = int(np.asarray(ph.convert("L")).min())
        if en_koyu < PH_MIN_LUM:
            sys.exit(f"ph_{key}: kırpım {kutu} bir dekor parçası içeriyor (en koyu {en_koyu} < {PH_MIN_LUM})")
        webp(ph, f"ph_{key}", gen, 80)
        manifest[f"ph_{key}"]["aspect"] = oran
        manifest[f"ph_{key}"]["min_lum"] = en_koyu

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
    hale = {k: v.get("halo_px") for k, v in temizlik.items() if v.get("halo_px")}
    manifest["checks"] = {"envelope_open_overlap_diff": round(fark_acik, 5), "green_px": 0, "halo_left_px": hale,
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): kartlar <img> ile otomatik bulunur; parçacık katmanı; köşe kümeleri
    # düz çizgiyle (kırpan ata, nav bandı) kesilmez; ilk ekran yatay telefonda da nav'ın üstünde biter, isimler ≥ 36 px
    manifest["theme_check"] = {"particles": ".accent-layer", "clusters": ".corner, .page-corner",
                               "first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl_crop, katman, stage, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"kapak {kb['method']} uç {kb['tip']} süreklilik {kb.get('continuity')} · cep {cep['edge_at']}")
    print(f"kart yolu {stage['card_path']}")
    print(f"comp {comp}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} dilimler {manifest[nm]['slices']['top_end_pct']}–{manifest[nm]['slices']['bottom_start_pct']}")
    print(f"hâle artığı {hale}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl_crop, katman, stage, cs):
    """Kesim önizlemeleri (gözle denetim): kapak / gövde, cep / arka, kapalı ve açık sahne (kapanış yerinde)."""
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
    sheet.crop((0, 200, W * 4, 1400)).resize((W * 2, 600)).save(oniz / "kesimler.jpg", quality=86)
    for ad, im, bgc, kutu in (("kapak_ucu", flap, (190, 50, 50), (380, 1040, 640, 1200)),
                              ("kapak_kosesi", flap, (190, 50, 50), (70, 700, 270, 860)),
                              ("cep_ucu", pocket, (50, 50, 190), (300, 820, 720, 1100)),
                              ("cep_kosesi", pocket, (50, 50, 190), (70, 690, 420, 980))):
        on(im, bgc).crop(kutu).resize(((kutu[2] - kutu[0]) * 3, (kutu[3] - kutu[1]) * 3)).save(oniz / f"{ad}.jpg", quality=88)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    sahne = Image.new("RGBA", (900, round(SH * k)), (214, 225, 236, 255))

    def koy(im, p):
        x, y, w, h = p
        r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
        sahne.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
    koy(ec.crop(alfa_kutu(ec, 1)), katman["env_closed"])
    koy(flap.crop(alfa_kutu(flap, 1)), katman["env_cflap"])
    koy(cl_crop, katman["closure"])
    sahne.convert("RGB").save(oniz / "kapali_sahne.jpg", quality=88)
    sahne = Image.new("RGBA", sahne.size, (214, 225, 236, 255))
    koy(env_flap.crop(alfa_kutu(env_flap, 1)), katman["env_flap"])
    koy(env_body.crop(alfa_kutu(env_body, 1)), katman["env_body"])
    koy(cs, katman["card"])
    koy(pocket.crop(alfa_kutu(pocket, 1)), katman["env_pocket"])
    sahne.convert("RGB").save(oniz / "acik_sahne.jpg", quality=88)


if __name__ == "__main__":
    main()
