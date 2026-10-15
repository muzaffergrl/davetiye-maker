#!/usr/bin/env python3
"""Tuscan Vineyard teması (tasarım 10, G410) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik hazırlık
(K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/tuscan-vineyard/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/10_Tuscan_Vineyard/assets/gpt/parts/ (G210, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre koşar
(alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" şeffaf — iki çerçevenin penceresindeki koyu/yarı saydam leke burada
dolar —, windows.json); tema klasörüne, img_src/'ye, assets/'e yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar:
tools/tema_build.py. Kenar temizliği (hale_temizle, pencere_halkasi, renk_tasir, webp_yaz) 01 temasının build_images.py'sindeki
yöntemdir (aynı GPT kusurları: dış hatta yarı saydam hâle, pencere çevresinde ayrıştırma saçağı, WebP kenar saçağı).

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf, SARILI kapanış: jüt sicim + mantar + iki zeytin yaprağı):
  * Kapak kesimi GERÇEK KENARDAN: kraft kapağın serbest kenarının hemen içinde şarap rengi gravür asma bordürü var.
    tema_build.kapak_kes("v") en güçlü parlaklık düşüşünü bordürün asma sapında buluyor (kesim yaprakları ortadan
    bölüyordu). Burada kapak_kes'in V'si yalnız arama başlangıcıdır: her kanatta (sol/sağ) eğim ± 0,08 ve kayma −20 … +150
    px aralığında, doğru boyunca 3 satır üst − 3 satır alt parlaklık farkının SÜTUN MEDYANI en büyük olan doğru seçilir
    (ışıklı kapak kenarı → gövdedeki temas gölgesi bütün kanat boyunca sürer; bordür motifleri dağınık olduğu için medyanı
    taşımaz). Sonra her sütun bu V'nin ±6 px'inde yeniden aranır, 7 sütun medyanı.
  * Ön cep kesimi: açık zarfın önü iki çapraz yan kanat + üstü düz (köşeleri yuvarlak) alt kanat; astar koyu şarap zemin
    üzerinde krem asma deseni. Her sütunda astarın içinden aşağı inilir, ilk "kraft" bandı (G/R 0,66–0,86, B/R < 0,60 —
    astarın krem motifi B/R ≈ 0,66 —, 10 satır, 5 sütunun ≥ %80'i) kenardır. Sol çapraz, sağ çapraz ve düz orta için aykırısız
    doğru; sütun ölçümü modelden 6 px'ten fazla saparsa model alınır (motifin kenara değdiği sütun), 7 sütun medyanı; kenar
    2 px yukarı (kesik kenarın açık şeridi cepte).
  * Kapalı ↔ açık hiza (kit_check UYARI: alt −1,82 %): açık zarfın gövdesi (menteşe kırışığı … alt kenar) kapalı gövdeden
    ~23 px yukarıda ve ~0,7 % kısa çizildi; açık katmanlar ölçülen ölçek + ötelemeyle kapalı gövdeye oturtulur (menteşe
    kırışığı = kapalı üst kenar, alt kenar = alt kenar; yatayda gövde genişliği) → manifest.stage.align.
  * Kapanış (closure.png) zarfla aynı tuvalde 1:1 (sarılı). Sicim uçları zarf hattından taşıyor (kit_check: üst −2,02 %,
    alt −3,12 %): kapanışın alfası kapalı zarfın alfasıyla (1 px genişletilmiş) kırpılır — uçlar tam zarf kenarında biter
    (sicim zarfın arkasına dolanır). Monogram yok: mantar diski "plain natural cork, no branding" (W1.1'de harf yok) —
    README "Mühür monogramı".
  * Story çerçevesi (frame_portrait): pencerenin altı yalnız çift çerçeve çizgisi (pencere tuvalin %92,7'sine iniyor, düz
    kağıt bandı yok) — W1.3'teki gibi caption etiketin içine sığmaz; caption çerçevenin altında, meşe masada (README sapma).

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json. --onizleme DIR kesim/kenar
önizlemelerini yazar (gözle denetim). Tema klasörü ≤ 3 MB (aşarsa çıkış ≠ 0). Bağımlılık: Pillow + numpy.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/10_Tuscan_Vineyard"
PARTS = COL / "assets/gpt/parts"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [180, 360], "card_small": [320, 640], "invitation_card": [480, 960],
    "info_card": [480, 960], "frame_portrait": [320, 640], "frame_landscape": [480, 960], "decor_tl": [480, 960],
    "decor_br": [480, 960], "divider": [300, 600],
}
# palet (palette.json): ivory #FBF6EC — yer tutucu tonu
IVORY = (251, 246, 236)
# gökyüzü + tepeler (telefon zemini, sayfa sonu bandı): bg_page'in sol alt bölgesi — sol üst kümenin zeytin yaprakları
# y ≤ 645, sağ alt kümenin en soldaki yaprağı x ≥ 465 (ölçüldü); ikisi de bu kutunun dışında
SKY_BOX = (0, 660, 460, 1536)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: kümesiz, sakin gökyüzü)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (420, 260, 960, 820)),
    "story_1": ("portrait", [320, 640], (360, 420, 860, 1060)),
    "story_2": ("portrait", [320, 640], (560, 220, 1010, 800)),
    "story_3": ("portrait", [320, 640], (300, 660, 760, 1180)),
    "venue": ("landscape", [480, 960], (300, 560, 900, 960)),
}
PH_MIN_LUM = 175   # yer tutucuda en koyu piksel (gri ton) en az bu: kümeden yaprak/üzüm kırpıma girmez (çıkış ≠ 0)
CARD_W_OF_ENV = 0.54   # zarftan çıkan kartın genişliği / zarf genişliği (W1.2 kartı ÷ W1.1 zarfı ≈ 0,51; kart zarfa sığar)


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (01'in yöntemi)

def hale_temizle(im: Image.Image, sert: bool, esik: int = 12, cekirdek: int = 96):
    """Dış hattaki yarı saydam hâleyi temizler (çizim yok). sert: kart/çerçeve/zarf gibi net kenarlı nesne.
    1) alfa < esik → 0, kalan alfa [esik, 255] → [0, 255]; 2) çekirdekten (alfa ≥ cekirdek) uzak (sert 1 px, yumuşak
    3 px) piksel silinir; 3) kenar pikselinin (alfa < 230) rengi komşu opak piksellerin ortalamasına çekilir. (RGBA, bilgi)."""
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
    # yeşil saçak: yarı saydam kenarda G ≤ 1.4 × max(R, B); koyu doygun yaprak pikselinin yeşil fazlası 24'te (WebP 4:2:0
    # alt örneklemesi "görünür #00FF00" eşiğini geçmesin — yalnız uç pikseller)
    kenar2 = (yeni > 0) & (al < 230)
    mx = np.maximum(a[..., 0], a[..., 2])
    asiri = kenar2 & (a[..., 1] > 1.4 * mx)
    a[..., 1][asiri] = 1.4 * mx[asiri]
    fazla = (a[..., 1] - mx > 24) & (a[..., 1] * 2 >= 3 * mx)
    a[..., 1][fazla] = mx[fazla] + 24
    a[..., 3] = yeni
    sonra = int((yeni > 0).sum())
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), {
        "alpha_floor": esik, "core": cekirdek, "reach_px": 1 if sert else 3, "removed_px": once - sonra}


def pencere_halkasi(im: Image.Image, prep: Path, win: dict, ad: str, halka: int = 3):
    """Pencere ayrıştırmasının bıraktığı saçak: pencerenin `halka` px çevresinde görünen piksellerin rengi 4–10 px
    dışındaki opak çerçeve renginden yeniden alınır; alfa korunur. (RGBA, düzeltilen piksel sayısı)."""
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
    """Şeffaf piksellerin RGB'si görünen komşu renkle doldurulur ("alpha bleeding"): kayıplı WebP renk alt örneklemesi
    kenara siyah karıştırmasın. Görüntü değişmez (yalnız alfa 0 piksellerin rengi)."""
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
    """tema_build.webp biçimi (manifest[name] = {src_size, ratio, files}); şeffaf parçada küçültme sonrası renk taşıma."""
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


def _saglam_dogru(p):
    p = np.array(p, float)
    for _ in range(8):
        m, c = np.polyfit(p[:, 0], p[:, 1], 1)
        r = p[:, 1] - (m * p[:, 0] + c)
        s = max(2.5, 2.5 * np.median(np.abs(r)) * 1.4826)
        keep = np.abs(r) < s
        if keep.all():
            break
        p = p[keep]
    return float(m), float(c), int(len(p))


def _medyan(v, r=3):
    out = v.copy()
    for x in range(r, len(v) - r):
        out[x] = np.median(v[x - r:x + r + 1])
    return out


# ============================================================================= kesimler (bu tasarım)

def kraft_kapak_kes(ec: Image.Image, iz: int = 6):
    """Kapalı zarf → (kapak RGBA tam tuval, bilgi). Kenar = kraft kapağın gerçek serbest kenarı (bordürün altı), bkz. modül
    belgesi. Doğru skoru zayıfsa (medyan düşüş < 30) tema_build.kapak_kes kesimine düşer (uyarı)."""
    flap0, kb = tb.kapak_kes(ec, "v")
    a = np.asarray(ec).astype(np.float64)
    H, W = a.shape[:2]
    al = a[..., 3]
    lum = a[..., :3] @ LUM
    lum = (np.roll(lum, 1, 1) + lum + np.roll(lum, -1, 1)) / 3
    cols = np.flatnonzero(al.max(0) > 200)
    x0, x1 = int(cols.min()), int(cols.max())
    tipx = float(kb["tip"][0])

    def dogru(xs, m0, c0):
        en = None
        for m in np.arange(m0 - 0.08, m0 + 0.08, 0.002):
            cs = np.arange(c0 - 20, c0 + 150, 0.5)
            Yi = np.rint(m * xs[None, :] + cs[:, None]).astype(int)
            ok = (Yi > 4) & (Yi < H - 5)
            up = sum(lum[np.clip(Yi - k, 0, H - 1), xs[None, :]] for k in (1, 2, 3)) / 3
            dn = sum(lum[np.clip(Yi + k, 0, H - 1), xs[None, :]] for k in (1, 2, 3)) / 3
            s = np.median(np.where(ok, up - dn, 0), 1)
            i = int(np.argmax(s))
            if en is None or s[i] > en[0]:
                en = (float(s[i]), float(m), float(cs[i]))
        return en

    sL, mL, cL = dogru(np.arange(x0 + 30, int(tipx) - 50, 2), kb["left"][0], kb["left"][1])
    sR, mR, cR = dogru(np.arange(int(tipx) + 50, x1 - 30, 2), kb["right"][0], kb["right"][1])
    bilgi = {"method": "renk", "detector": "V doğrusu: kanat boyunca medyan parlaklık düşüşü (kapak kenarı → temas gölgesi), "
                                            "sütun izi ±6 px, 7 sütun medyanı",
             "hinge_row": int(kb["hinge_row"]), "line_score": [round(sL, 1), round(sR, 1)],
             "v_left": [round(mL, 4), round(cL, 2)], "v_right": [round(mR, 4), round(cR, 2)],
             "start_lines_kapak_kes": {"left": kb["left"], "right": kb["right"]}, "columns": [x0, x1], "warnings": []}
    if min(sL, sR) < 30:
        bilgi.update(method="kapak_kes", warnings=[f"kapak kenarı doğrusu zayıf ({sL:.0f}/{sR:.0f}) → kapak_kes kesimi"])
        tam = Image.new("RGBA", (W, H))
        tam.paste(flap0, (0, 0))
        return tam, dict(bilgi, tip=[float(v) for v in kb["tip"]])
    xs = np.arange(W)
    v = np.minimum(mL * xs + cL, mR * xs + cR)
    cs = np.vstack([np.zeros((1, W)), np.cumsum(lum, 0)])
    kenar = v.copy()
    izlenen = 0
    for x in range(x0 + 2, x1 - 1):
        ys = np.arange(max(int(v[x]) - iz, 4), min(int(v[x]) + iz + 1, H - 5))
        d = (cs[ys, x] - cs[ys - 3, x]) / 3 - (cs[ys + 4, x] - cs[ys + 1, x]) / 3
        i = int(np.argmax(d))
        if d[i] > 20:
            kenar[x] = ys[i] + 1
            izlenen += 1
    yum = np.clip(_medyan(kenar, 3), v - iz, v + iz)
    satir = np.arange(H)[:, None]
    kap = np.clip(yum[None, :] - satir, 0, 1)
    out = a.copy()
    out[..., 3] = al * kap
    xt = (cR - cL) / (mL - mR)
    orta = (xs > xt - 40) & (xs < xt + 40)
    bilgi["tip"] = [round(float(xs[orta][np.argmax(yum[orta])]), 1), round(float(yum[orta].max()), 1)]
    bilgi["traced_columns"] = izlenen
    bilgi["edge_minus_v_px"] = [round(float(q), 1) for q in np.percentile(yum[x0:x1 + 1] - v[x0:x1 + 1], [5, 50, 95])]
    bilgi["rows"] = [0, int(np.ceil(yum[x0:x1 + 1].max())) + 1]
    return Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8), "RGBA"), bilgi


def kirisik_bul(eo: Image.Image):
    """Açık zarfta menteşe kırışığı: gövdenin tam genişliğe ulaştığı ilk satırın ±40 satırında, orta sütunların medyan
    parlaklığı en düşük satır (kapağın içi ↔ arka panel astarı arasındaki koyu kat)."""
    a = np.asarray(eo).astype(np.float64)
    op = a[..., 3] > 200
    cols = np.flatnonzero(op.any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    tam = np.flatnonzero(op.sum(1) >= (x1 - x0) * 0.97)
    lum = a[..., :3] @ LUM
    y0 = int(tam[0])
    ys = np.arange(max(0, y0 - 40), y0 + 41)
    med = np.array([np.median(lum[y, x0 + 100:x1 - 100]) for y in ys])
    return int(ys[int(np.argmin(med))]), float(med.min())


def kraft_cep_kes(eo: Image.Image, kirisik: int, pay: float = 2.0):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Bkz. modül belgesi."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    al = a[..., 3]
    R, G, B = a[..., 0] + 1e-6, a[..., 1], a[..., 2]
    lum = a[..., :3] @ LUM
    kraft = (G > 0.66 * R) & (G < 0.86 * R) & (B < 0.60 * R) & (lum > 105) & (lum < 215) & (al > 200)
    kf = _kutu_bulanik(kraft.astype(np.float64), 2)            # 5 sütun × 5 satır ortalaması
    op = al > 200
    cols = np.flatnonzero(op.any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    alt = int(np.flatnonzero(op.any(1)).max())
    xm = (x0 + x1) / 2
    pts = []
    for x in range(x0 + 6, x1 - 5):
        c = kf[:, x] >= 0.8
        for y in range(kirisik + 12, alt - 20):
            if c[y:y + 10].all():
                pts.append((x, y))
                break
    pts = np.array(pts, float)
    L = _saglam_dogru(pts[(pts[:, 0] > x0 + 40) & (pts[:, 0] < xm - 130)])
    Rr = _saglam_dogru(pts[(pts[:, 0] > xm + 130) & (pts[:, 0] < x1 - 40)])
    orta = pts[(pts[:, 0] > xm - 40) & (pts[:, 0] < xm + 40)]
    duz = float(np.median(orta[:, 1]))
    xs = np.arange(W)
    model = np.minimum(np.minimum(L[0] * xs + L[1], Rr[0] * xs + Rr[1]), duz)
    olcum = model.copy()
    olcum[pts[:, 0].astype(int)] = pts[:, 1]
    sapma = np.abs(olcum - model)
    kenar = np.where(sapma <= 6, olcum, model)
    kenar = _medyan(kenar, 3) - pay
    yy = np.arange(H)[:, None]
    m = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    m[:kirisik] = 0
    cep = a.copy()
    cep[..., 3] = al * m
    cep[..., 3][al < 200] = 0   # gölge ve kenar yumuşaması arka katmanda zaten var
    bilgi = {"method": "renk", "shape": "trapez (iki çapraz yan kanat + düz alt kanat)", "body": [x0, kirisik, x1, alt],
             "left": [round(L[0], 4), round(L[1], 2), L[2]], "right": [round(Rr[0], 4), round(Rr[1], 2), Rr[2]],
             "flat_row": round(duz, 1), "points": int(len(pts)),
             "model_replaced_columns": int((sapma[x0 + 40:x1 - 39] > 6).sum()),   # köşelerdeki ince astar şeridi hariç
             "edge_at": {"x0": round(float(kenar[x0]), 1), "mid": round(float(kenar[int(xm)]), 1), "x1": round(float(kenar[x1]), 1)},
             "warnings": []}
    if len(pts) < 0.8 * (x1 - x0) or bilgi["model_replaced_columns"] > 0.25 * (x1 - x0):
        bilgi["warnings"].append(f"cep kenarı zayıf: {len(pts)} nokta, {bilgi['model_replaced_columns']} sütun modelden — önizlemede gözle")
    return Image.fromarray(np.clip(np.rint(cep), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


# ============================================================================= kart / çerçeve dilimleri (docs/11 §9)

def dilimler(fz, aralik=(8.0, 92.0), min_gen: float = 80.0):
    """free_zone → en uzun kesintisiz "düz kağıt" satır bandı (yüzde): merkezden iki yana açıklık ≥ min_gen (% genişlik).
    Orta bant dikeyde gerilir: içinde süs olursa o da gerilirdi; bu yüzden yalnız geniş düz satırlar. (t, b)."""
    duz = [y for y, L, R in fz if L is not None and R - L >= min_gen and aralik[0] <= y <= aralik[1]]
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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="tv-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (tuscan-vineyard); ölçüler px, kutular [x, y, w, h] ya da [x0, y0, x1, y1] "
                         "(adında belirtilir), box_pct yüzde. stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
    q = args.q
    temizlik = {}

    def webp(im, name, widths, q_=None):
        webp_yaz(im, name, widths, q_ or q, manifest, out)

    # ------------------------------------------------------------------ zarf (aynı tuval: 1024×1536)
    ec_raw = Image.open(PARTS / "envelope_closed.png").convert("RGBA")
    eo_raw = Image.open(PARTS / "envelope_open.png").convert("RGBA")
    ec, temizlik["envelope_closed"] = hale_temizle(ec_raw, sert=True)
    eo, temizlik["envelope_open"] = hale_temizle(eo_raw, sert=True)
    W, H = ec.size

    flap, kb = kraft_kapak_kes(ec)
    uyar("env_cflap", kb)
    kirisik, kir_lum = kirisik_bul(eo)
    pocket, cep, cep_kenar = kraft_cep_kes(eo, kirisik)
    uyar("env_pocket", cep)
    # açık zarf: kapak (kırışığa kadar + 3 px bindirme), gövde (astar + arka + kanatlar), ön cep
    yy = np.arange(H)[:, None]
    eoa = np.asarray(eo).astype(np.float64)
    m_flap = np.clip(kirisik + 3 - yy + 0.5, 0, 1) * np.ones((1, W))
    m_body = np.clip(yy - (kirisik - 2) + 0.5, 0, 1) * np.ones((1, W))
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

    # hiza (docs/11 §7.1 "ölçülen dönüşüm"): açık gövde (kırışık … alt kenar, sol … sağ) → kapalı gövde (üst … alt kenar)
    eca0 = np.asarray(ec)[..., 3]
    kapali_ust = int(kb["hinge_row"])
    kapali_alt = int(np.flatnonzero(eca0.max(1) > 200).max()) + 1
    kc = np.flatnonzero(eca0.max(0) > 200)
    kapali_sol, kapali_sag = int(kc.min()), int(kc.max()) + 1
    eoa0 = np.asarray(eo)[..., 3]
    acik_alt = int(np.flatnonzero(eoa0.max(1) > 200).max()) + 1
    ocs = np.flatnonzero(eoa0[kirisik + 20:acik_alt - 20].max(0) > 200)
    acik_sol, acik_sag = int(ocs.min()), int(ocs.max()) + 1
    sy = (kapali_alt - kapali_ust) / (acik_alt - kirisik)
    sx = (kapali_sag - kapali_sol) / (acik_sag - acik_sol)
    dy = kapali_ust - kirisik * sy
    dx = kapali_sol - acik_sol * sx

    def hizala(im):
        r = im.resize((max(1, round(W * sx)), max(1, round(H * sy))), Image.LANCZOS)
        tuval = Image.new("RGBA", (W, H))
        tuval.paste(r, (round(dx), round(dy)))
        return tuval
    eo = hizala(eo)
    env_flap, env_body, pocket = hizala(env_flap), hizala(env_body), hizala(pocket)
    # cep kenarı (tuval sütunu → hizalı koordinat)
    xs_all = np.arange(W)
    cep_kenar = np.interp((xs_all - dx) / sx, xs_all, cep_kenar) * sy + dy
    hiza_duzeltme = {"open_scale": [round(sx, 5), round(sy, 5)], "open_offset_px": [round(dx, 1), round(dy, 1)],
                     "open_body_before": {"crease_row": kirisik, "crease_lum": round(kir_lum, 1), "bottom": acik_alt,
                                          "left": acik_sol, "right": acik_sag},
                     "closed_body": {"top": kapali_ust, "bottom": kapali_alt, "left": kapali_sol, "right": kapali_sag},
                     "reason": "GPT: açık gövde kapalıdan ~23 px yukarıda ve biraz kısa; menteşe kırışığı = kapalı üst kenar, "
                               "alt = alt, yatayda gövde genişliği"}
    print(f"hiza düzeltmesi: açık katmanlar × ({sx:.4f}, {sy:.4f}), öteleme ({dx:.1f}, {dy:.1f}) px")

    # ------------------------------------------------------------------ kapanış (sicim + mantar + zeytin yaprakları; sarılı, 1:1)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    cla = np.asarray(cl).astype(np.float64)
    zarf = genislet(eca0 >= 128, 1)
    once = int((cla[..., 3] > 24).sum())
    cla[..., 3] *= zarf
    tasan = once - int((cla[..., 3] > 24).sum())
    cl = Image.fromarray(np.clip(np.rint(cla), 0, 255).astype(np.uint8), "RGBA")
    ck = alfa_kutu(cl)                                     # [x0, y0, x1, y1] tuval px
    cl_crop = cl.crop(ck)
    # mantar + yapraklar (düğüm): kapanışın en geniş satırları (sicim ~2 tel, düğümde yaprak + disk)
    gen = (cla[..., 3] > 128).sum(1)
    dugum_satir = np.flatnonzero(gen >= 0.45 * gen.max())
    dugum = [int(dugum_satir.min()), int(dugum_satir.max()) + 1]

    # ------------------------------------------------------------------ kart (card_small) yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    env_x0, env_x1, env_y0, env_y1 = kapali_sol, kapali_sag, kapali_ust, kapali_alt
    env_w = env_x1 - env_x0
    card_w = CARD_W_OF_ENV * env_w
    card_h = card_w / card_ar
    card_x = (env_x0 + env_x1) / 2 - card_w / 2
    hidden_top = kapali_ust + 0.06 * (env_y1 - env_y0)             # astar penceresinde kartın üstü görünür
    kose_kenar = float(min(cep_kenar[int(card_x)], cep_kenar[int(card_x + card_w)]))
    # kart yukarıda kalır (G401 incelemesi): out = alt köşeleri cebin kenarını kartın %4'ü kadar aşmış; front = aynı yerde
    # öne gelir (%3 aşağı + × 1.04, büyüyen gölge) → home kartına yukarı uçar
    out_top = kose_kenar - 0.04 * card_h - card_h
    front_top = out_top + 0.03 * card_h
    card_box_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    ob_box = alfa_kutu(eo, esik=1)
    cb_box = alfa_kutu(ec, esik=1)
    scale_front = 1.04
    fr_w, fr_h = card_w * scale_front, card_h * scale_front
    front_box = [card_x - (fr_w - card_w) / 2, front_top - (fr_h - card_h) / 2,
                 card_x + card_w + (fr_w - card_w) / 2, front_top + card_h + (fr_h - card_h) / 2]
    X0 = min(cb_box[0], ob_box[0], ck[0], front_box[0])
    X1 = max(cb_box[2], ob_box[2], ck[2], front_box[2])
    Y0 = min(cb_box[1], ob_box[1], out_top, front_box[1], ck[1])
    Y1 = max(cb_box[3], ob_box[3], ck[3])
    SW, SH = X1 - X0, Y1 - Y0

    def pct(box):
        x0, y0, x1, y1 = box
        return [round(100 * (x0 - X0) / SW, 3), round(100 * (y0 - Y0) / SH, 3),
                round(100 * (x1 - x0) / SW, 3), round(100 * (y1 - y0) / SH, 3)]

    stage = {"canvas": [W, H], "box": [round(X0, 1), round(Y0, 1), round(SW, 1), round(SH, 1)], "ratio": round(SW / SH, 5)}
    katman = {}
    for ad, im in (("env_closed", ec), ("env_cflap", flap), ("env_flap", env_flap), ("env_body", env_body),
                   ("env_pocket", pocket)):
        k = alfa_kutu(im, esik=1)
        k = [int(np.floor(X0)), k[1], int(np.ceil(X1)), k[3]]   # yatayda sahnenin tam genişliği (left 0, width 100 %)
        webp(im.crop(k), ad, WIDTHS[ad])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    webp(cl_crop, "closure", WIDTHS["closure"])
    katman["closure"] = pct(ck)
    katman["card"] = pct(card_box_hidden)
    stage["parts"] = katman
    stage["hinge_pct"] = round(100 * (kapali_ust - Y0) / SH, 3)
    stage["body_bottom_pct"] = round(100 * (env_y1 - Y0) / SH, 3)
    stage["closed_obj"] = {"box_pct": pct([env_x0, env_y0, env_x1, env_y1]), "aspect": round(env_w / (env_y1 - env_y0), 4),
                           "frac_w": round(env_w / SW, 5), "top_frac_of_stage_w": round((env_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - env_y1) / SW, 5)}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3), "front_scale": scale_front,
                          "pocket_edge_at_card_corners": round(kose_kenar, 1), "card_w_of_env": CARD_W_OF_ENV}
    stage["cuts"] = {"cflap": kb, "pocket": cep}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak)}
    stage["align"] = hiza_duzeltme
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "wrapped (same canvas as envelope_closed, 1:1)", "canvas_box_x0y0x1y1": ck,
        "knot_rows_pct_of_crop": [round(100 * (dugum[0] - ck[1]) / (ck[3] - ck[1]), 2), round(100 * (dugum[1] - ck[1]) / (ck[3] - ck[1]), 2)],
        "clipped_to_envelope_px": tasan, "flap_tip_px": kb["tip"],
        "note": "sicim uçları kapalı zarfın alfasına (1 px genişletilmiş) kırpıldı; açılışta düğüm (mantar + yapraklar) "
                "yukarı kalkar, alt tel düğüme doğru toplanır (site.js MOTION.envelope.closure)",
        "carried_by_flap": False,
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
            bg = Image.new("RGBA", im.size, (70, 110, 160, 255)); bg.alpha_composite(im)
            bg.convert("RGB").save(oniz / f"kenar_{parca}.jpg", quality=88)
    manifest["photo_slots"] = slots
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.78, .84))

    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        # davet kartının sol üst üzüm salkımı kağıdın %51'ine iniyor: orta bant yalnız salkımın altındaki tam genişlik (≥ %88)
        t, b = dilimler(fz, min_gen=88.0 if nm == "invitation_card" else 80.0)
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
        webp(im, f"accent_{i}", [200, 400] if im.width > 260 else [200])

    # ------------------------------------------------------------------ zemin
    bg = Image.open(PARTS / "bg_page.png").convert("RGB")
    sky = bg.crop(SKY_BOX)
    webp(sky, "sky", [460], 80)
    manifest["sky"]["crop_x0y0x1y1"] = list(SKY_BOX)
    # ufuk (tepelerin başladığı satır, kırpımın yüzdesi): satır ortalama parlaklığı gökyüzünün (kırpımın %30–55'i) medyanından
    # 15'ten fazla düştüğü ilk satır — site.css metni bunun üstünde tutar
    sa = np.asarray(sky).astype(np.float64) @ LUM
    rm = sa.mean(1)
    taban = float(np.median(rm[int(.30 * len(rm)):int(.55 * len(rm))]))
    ufuk = next(y for y in range(int(.40 * len(rm)), len(rm)) if rm[y] < taban - 15)
    manifest["sky"]["horizon_pct"] = round(100 * ufuk / sky.height, 2)
    # geniş/yatay ekran zemini: aynı gökyüzü + tepeler kırpımının yumuşak hâli (bg_page'in bütünü bulanıkken iki küme dev
    # lekeler olarak kalıyordu; köşe kümeleri ayrı katman olarak keskin gelir)
    webp(sky.resize((640, round(640 * sky.height / sky.width)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(3)), "mist", [640], 80)
    manifest["mist"]["source"] = "sky crop (SKY_BOX), Gaussian 3 px"
    # uzun sayfa zemini: bg_tile (dikişsiz krem kağıt, kendi rengi — gökyüzünün şeftalisi uzun okumada fazla doygun; sayfa sonu
    # tepe bandı maskeyle bu kağıda solar)
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    webp(tile, "bg_tile", [640], 78)
    ton = np.asarray(tile).reshape(-1, 3).astype(np.float64).mean(0)
    manifest["bg_tile"]["tone"] = [round(v, 1) for v in ton]
    manifest["page_color"] = "#%02X%02X%02X" % tuple(int(round(v)) for v in ton)
    hex_ = lambda kutu: "#%02X%02X%02X" % tuple(int(round(v)) for v in np.asarray(sky.crop(kutu)).reshape(-1, 3).mean(0))
    manifest["sky_colors"] = {"top": hex_((0, 0, 460, 40)), "above_horizon": hex_((0, ufuk - 40, 460, ufuk - 4))}
    # story masası: meşe (W2.17, dikişsiz) — tasarıma özel opak zemin
    oak = Image.open(PARTS / "oak_tile.png").convert("RGB")
    webp(oak, "oak_tile", [640, 1024], 74)

    # ------------------------------------------------------------------ nötr foto yer tutucuları (gerçek foto asla)
    for key, (ad, gen_, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        ph = tb.yer_tutucu(bg, kutu, oran, max(gen_), ton=IVORY, karisim=0.30)
        en_koyu = int(np.asarray(ph.convert("L")).min())
        if en_koyu < PH_MIN_LUM:
            sys.exit(f"ph_{key}: kırpım {kutu} bir dekor parçası içeriyor (en koyu {en_koyu} < {PH_MIN_LUM})")
        webp(ph, f"ph_{key}", gen_, 80)
        manifest[f"ph_{key}"]["aspect"] = oran
        manifest[f"ph_{key}"]["min_lum"] = en_koyu

    # ------------------------------------------------------------------ paylaşım görseli + favicon
    og, og_bilgi = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    og_bilgi["file"] = "og-1200x630.jpg"
    og_bilgi["bytes"] = tb.og_kaydet(og, out / og_bilgi["file"], 82)
    manifest["og"] = og_bilgi
    # favicon: kapanışın düğümü (mantar + iki zeytin yaprağı) — ince uzun sicim 180 px karede okunmaz
    pad = 12
    ikon_kaynak = cl.crop((ck[0], max(ck[1], dugum[0] - pad), ck[2], min(ck[3], dugum[1] + pad)))
    ikon, ikon_bilgi = tb.ikon(ikon_kaynak, 180)
    ikon.save(out / "favicon.png", optimize=True)
    ikon_bilgi.update({"source": "closure", "crop": "knot (cork + olive leaves)", "file": "favicon.png",
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

    yesil_ = tb.yesil_denetle(out)
    if yesil_:
        sys.exit(f"görünür #00FF00 kalıntısı: {yesil_}")
    manifest["cleanup"] = temizlik
    manifest["checks"] = {"envelope_open_overlap_diff": round(fark_acik, 5), "green_px": 0,
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): JS parçacık katmanı
    manifest["theme_check"] = {"particles": ".accent-layer"}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl, katman, stage, cs, ck)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"katmanlar {katman}")
    print(f"kart yolu {stage['card_path']} · kapalı nesne {stage['closed_obj']}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} dilimler {manifest[nm]['slices']['top_end_pct']}–{manifest[nm]['slices']['bottom_start_pct']} oran {manifest[nm]['slices']['ratio']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · sayfa {manifest['page_color']} · gök {manifest['sky_colors']} · ufuk %{manifest['sky']['horizon_pct']}")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl, katman, stage, cs, ck):
    """Kesim önizlemeleri (gözle denetim): kapak / gövde, cep / arka, kapalı ve açık sahne."""
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
    sheet.crop((0, 560, W * 4, 1440)).resize((W * 2, 440)).save(oniz / "kesimler.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW

    def sahne(parcalar):
        s = Image.new("RGBA", (900, round(SH * k)), (241, 228, 210, 255))
        for im, p in parcalar:
            x, y, w, h = p
            r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
            s.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
        return s.convert("RGB")
    sahne([(ec.crop(alfa_kutu(ec, 1)), stage["closed_obj"]["box_pct"]), (flap.crop(alfa_kutu(flap, 1)), katman["env_cflap"]),
           (cl.crop(ck), katman["closure"])]).save(oniz / "kapali_sahne.jpg", quality=88)
    sahne([(env_flap.crop(alfa_kutu(env_flap, 1)), katman["env_flap"]), (env_body.crop(alfa_kutu(env_body, 1)), katman["env_body"]),
           (cs, katman["card"]), (pocket.crop(alfa_kutu(pocket, 1)), katman["env_pocket"])]).save(oniz / "acik_sahne.jpg", quality=88)


if __name__ == "__main__":
    main()
