#!/usr/bin/env python3
"""Olive & Ivory teması (tasarım 01, G401) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik hazırlık
(K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/olive-ivory/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/01_Olive_Ivory/assets/gpt/parts/ (G201, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre koşar
(alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" şeffaf, windows.json); tema klasörüne, img_src/'ye, assets/'e
yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py (webp, foto alanı, serbest bölge, yer tutucu, og,
ikon, hiza, denetimler).

Bu tasarıma özgü (docs/11 §7.1, §7.3 — kapaklı zarf, kapanış kapakla taşınır):
  * Kapak kesimi DANTEL DIŞ KENARINDAN: kapalı zarfın V kapağının serbest kenarı fildişi dantel şeridiyle bitiyor.
    tema_build.kapak_kes("v") kapağın V doğrularını bulur (yöntem "renk"), ama en güçlü parlaklık düşüşü dantelin
    delikli iç kısmına düştüğü için kesim danteli ortadan bölüyordu (fisto sırası gövdede kalıyordu). Burada V doğruları
    kapak_kes'ten alınır, kenar ise her sütunda V bandı içindeki fildişi dantel pikselleri (kapatma: delikler dolar) en
    alt satırından + 2 px (temas gölgesi kapakta) okunur — fisto dalgası piksel piksel izlenir.
  * Ön cep kesimi TRAPEZ: açık zarfın ön cebi sivri V değil, iki çapraz yan kanat + düz üst kenarlı alt kanat (V'nin ucu
    düz). parts_prep/tema_build cep_kes("v") ucu 40 px aşağıda sivri V buluyordu (cebe astar, astara cep giriyordu).
    Burada her sütunda astarın fildişi zemininin en alt satırından aşağı inilip ilk kalıcı cep kağıdı satırı bulunur;
    sol çapraz, sağ çapraz ve düz orta için aykırısız doğru uydurulur; kenar = min(sol, sağ, düz) − 2 px (kesik kenarın
    açık şeridi cepte kalır).
  * Kapanış (closure.png = oval mühür + altına sıkıştırılmış zeytin dalı, TEK parça) kare tuvalde büyük çizildi; yeri
    kesim geometrisine bağlanır: çapa = dantel V'sinin ucu, comp'ta (W1.1) ölçülen kayma ve boy (mühür yüksekliği / zarf
    genişliği) ile (manifest.closure). Kapakla birlikte döner (site.css .env-cflap-wrap).
  * GPT kusurları (kesimle/temizlikle, çizimsiz): (1) parçaların dış hattında yarı saydam sıcak/yeşil hâle — alfa < 12
    sıfırlanır ve kalan alfa yeniden ölçeklenir, çekirdekten uzak (sert parçada 1 px, yumuşak suluboya parçada 3 px)
    düşük alfa silinir, kenar piksellerinin rengi komşu opak rengin ağırlıklı ortalamasına çekilir (koyu/yeşil saçak yok);
    (2) pencereler saf #00FF00 değil (≈ 5,241,1; frame_landscape'te koyu yarı saydam leke) — parts_prep leke dolgusu +
    pencere çevresi 3 px halkada kalan pembe/turuncu ayrıştırma saçağı, halkanın 4–10 px dışındaki çerçeve renginden
    yeniden boyanır (alfa korunur).

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json (sahne kutusu ve katman
yüzdeleri, menteşe, kart yolu, kapanış çapası, foto alanları, kart serbest bölgeleri ve 3 dilim sınırları, hiza ölçümü,
denetimler). site.css'teki yüzdeler manifest'ten; --onizleme DIR kesim/kenar önizlemelerini yazar (gözle denetim).
Tema klasörü ≤ 3 MB (aşarsa çıkış ≠ 0). Bağımlılık: Pillow + numpy.
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/01_Olive_Ivory"
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
    "info_card": [480, 960], "frame_portrait": [320, 640], "frame_landscape": [480, 960], "decor_tl": [480, 960],
    "decor_br": [480, 960], "divider": [300, 600],
}
# palet (palette.json): ivory #FBF8F0 — yer tutucu tonu
IVORY = (251, 248, 240)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: çiçeksiz, güneş lekeli sakin bölgeler)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (420, 300, 1000, 900)),
    "story_1": ("portrait", [320, 640], (330, 380, 830, 1100)),
    "story_2": ("portrait", [320, 640], (520, 260, 1000, 960)),
    "story_3": ("portrait", [320, 640], (60, 640, 560, 1300)),
    # qa-kontrol 2026-10-14: eski kutu (220, 560, 1000, 1080) sağ altta bg_page'in alt kümesinin bulanık koyu yaprak ucunu
    # alıyordu (en düşük parlaklık 136); yeni kutu sol orta güneş lekeleri (en düşük 216), aşağıdaki PH_MIN_LUM denetimi
    "venue": ("landscape", [480, 960], (0, 760, 760, 1225)),
}
PH_MIN_LUM = 175   # yer tutucuda en koyu piksel (gri ton) en az bu: kümeden yaprak/zeytin kırpıma girmez (çıkış ≠ 0)
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536): zarf gövdesi x 149–876 (727 px); mühür yüksekliği 205 px
# (y 889–1094), merkezi (516, 991.5); dantel V'sinin dış kenar doğruları y = 1.147x + 504.6 ve y = −1.018x + 1585.5,
# kesişim (ucu) (499.2, 1077.1). → mühür yüksekliği / zarf genişliği 0.282; mühür merkezi uçtan 0.118 × zarf genişliği
# yukarıda (yatay kayma 0.023 GPT asimetrisi sayıldı: simetrik zarfta mühür uca ortalanır). sealmeasure: --comp-olc.
COMP = {"env_w": 727.0, "seal_h": 205.0, "seal_c": (516.0, 991.5), "tip": (499.2, 1077.1)}


def uyar(ad, bilgi):
    for u in bilgi.get("warnings", []) + bilgi.get("uyarilar", []):
        print(f"UYARI  {ad}: {u}")


# ============================================================================= kenar temizliği (GPT hâlesi, saçak)

def hale_temizle(im: Image.Image, sert: bool, esik: int = 12, cekirdek: int = 96):
    """Dış hattaki yarı saydam hâleyi temizler (çizim yok). sert: kart/çerçeve/zarf/mühür gibi net kenarlı nesne.
    1) alfa < esik → 0, kalan alfa [esik, 255] → [0, 255]; 2) çekirdekten (alfa ≥ cekirdek) uzak (sert 1 px, yumuşak
    3 px) piksel silinir; 3) kenar pikselinin (alfa < 230) rengi komşu opak piksellerin ortalamasına çekilir (koyu/yeşil
    saçak). (RGBA, bilgi)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    al = a[..., 3]
    once = int((al > 0).sum())
    yeni = np.clip((al - esik) * 255.0 / (255 - esik), 0, 255)
    core = al >= cekirdek
    near = genislet(core, 1 if sert else 3)
    yeni[~near] = 0
    # saçak: kenar pikselleri komşu opak rengin ağırlıklı ortalamasına (yarıçap 3) doğru
    opak = (al >= 230).astype(np.float64)
    pay = _kutu_bulanik(opak, 3)
    renk = np.stack([_kutu_bulanik(a[..., i] * opak, 3) for i in range(3)], -1)
    var = pay > 1e-3
    kenar = (yeni > 0) & (al < 230) & var
    hedef = renk[kenar] / pay[kenar][:, None]
    w = (1 - al[kenar] / 230.0)[:, None] if not sert else np.ones((int(kenar.sum()), 1))
    a[..., :3][kenar] = a[..., :3][kenar] * (1 - w) + hedef * w
    # yeşil saçak: yarı saydam kenarda yeşil baskınlığı G ≤ 1.4 × max(R, B) (suluboya yaprak tonu korunur)
    kenar2 = (yeni > 0) & (al < 230)
    mx = np.maximum(a[..., 0], a[..., 2])
    asiri = kenar2 & (a[..., 1] > 1.4 * mx)
    a[..., 1][asiri] = 1.4 * mx[asiri]
    # koyu doygun yaprak pikseli WebP 4:2:0 renk alt örneklemesinde "görünür #00FF00" eşiğini (G − max(R, B) > 40)
    # geçebiliyor (kaynakta 0 piksel): yeşil fazlası 24'te tutulur — yalnız bu uç pikseller, göze görünmez
    fazla = (a[..., 1] - mx > 24) & (a[..., 1] * 2 >= 3 * mx)   # şeffaf pikselde de: kayıplı alfa onları açabilir
    a[..., 1][fazla] = mx[fazla] + 24
    a[..., 3] = yeni
    sonra = int((yeni > 0).sum())
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), {
        "alpha_floor": esik, "core": cekirdek, "reach_px": 1 if sert else 3, "removed_px": once - sonra}


def pencere_halkasi(im: Image.Image, prep: Path, win: dict, ad: str, halka: int = 3):
    """parts_prep pencere ayrıştırmasının bıraktığı pembe/turuncu saçağı (yeşil saf #00FF00 değil: ≈ 5,241,1) temizler:
    pencerenin `halka` px çevresinde görünen piksellerin rengi, 4–10 px dışındaki opak çerçeve renginden (normalize
    kutu bulanıklığı) yeniden alınır; alfa korunur. (RGBA, düzeltilen piksel sayısı)."""
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
    ("alpha bleeding"). Kayıplı WebP renk alt örneklemesi kenar piksellerine siyah karıştırıp koyu/yeşil saçak
    üretiyordu; görüntü değişmez (yalnız alfa 0 piksellerin rengi)."""
    a = np.asarray(im.convert("RGBA")).astype(np.float64)
    gor = a[..., 3] >= 24          # önçarpımdan geri açılan çok düşük alfalı pikselin rengi güvenilmez
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


def alfa_kutu(im: Image.Image, esik: int = 8):
    k = tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)
    return [int(v) for v in k]


# ============================================================================= kesimler (bu tasarım)

def dantel_kapak_kes(ec: Image.Image):
    """Kapalı zarf → (kapak RGBA tam tuval, bilgi). V doğruları tema_build.kapak_kes("v")'den; kenar = fildişi dantelin
    (lum > 178, opak; 4 px kapatma) her sütunda V bandındaki en alt satırı + 2. Bulamazsa kapak_kes kesimi (uyarı)."""
    flap0, kb = tb.kapak_kes(ec, "v")
    a = np.asarray(ec).astype(np.float64)
    H, W = a.shape[:2]
    lum = a[..., :3] @ LUM
    ml, cl = kb["left"][0], kb["left"][1]
    mr, cr = kb["right"][0], kb["right"][1]
    tipx = kb["tip"][0]
    xs = np.arange(W)
    vy = np.where(xs < tipx, ml * xs + cl, mr * xs + cr)
    parlak = (lum > 178) & (a[..., 3] > 200)
    dantel = ~genislet(~genislet(parlak, 4), 4)
    # açma (3 px): dantelin dış kenarına değen ince açık çizgiler (yan kanadın ışıklı katı, 2–3 px) dantel sayılmaz
    dantel = genislet(~genislet(~dantel, 3), 3)
    cols = np.flatnonzero(a[..., 3].max(0) > 200)
    x0, x1 = int(cols.min()), int(cols.max())
    kenar = np.full(W, -1.0)
    # arama bandı: V doğrusunun 70 px üstü … 62 px altı (dantel şeridi V'nin ~45 px altına iner; daha aşağısı gövdenin yan
    # kanat katlarıdır — G401 incelemesi: sol kanadın açık kat dikişi 28 sütunda "dantel kenarı" sanılıyordu)
    for x in range(x0, x1 + 1):
        lo, hi = int(max(0, vy[x] - 70)), int(min(H, vy[x] + 62))
        r = np.flatnonzero(dantel[lo:hi, x])
        if len(r):
            kenar[x] = lo + r.max() + 2
    bulunan = int((kenar[x0:x1 + 1] >= 0).sum())
    bilgi = {"method": "renk", "detector": "kapak_kes V + dantel dış kenarı (lum > 178, kapatma 4 px, açma 3 px, V + 62 px bandı)",
             "hinge_row": int(kb["hinge_row"]), "v_left": [round(ml, 4), round(cl, 2)], "v_right": [round(mr, 4), round(cr, 2)],
             "columns": [x0, x1], "found": bulunan, "warnings": []}
    if bulunan < 0.9 * (x1 - x0 + 1):
        bilgi.update(method="kapak_kes", warnings=[f"dantel kenarı {bulunan}/{x1 - x0 + 1} sütunda bulundu → kapak_kes kesimi"])
        tam = Image.new("RGBA", (W, H))
        tam.paste(flap0, (0, 0))
        return tam, dict(bilgi, tip=[float(v) for v in kb["tip"]])
    # boş kalan uç sütunlar: komşudan
    for x in range(x0, x1 + 1):
        if kenar[x] < 0:
            kenar[x] = kenar[x - 1] if x > x0 else vy[x]
    # sürekli kenar: V'ye göre kayma (kenar − vy) geniş kayan medyandan (101 sütun) 22 px'ten fazla sapan sütun aykırıdır
    # (fisto dalgası medyanın ±16 px'i içinde) → komşu sağlam sütunlardan doğrusal doldurulur. Sert denetim (main): dolgudan
    # sonra komşu sütunlar arası sıçrama ≤ 24 px ve doldurulan sütun ≤ %6, yoksa çıkış ≠ 0.
    xr = np.arange(x0, x1 + 1)
    dd = kenar[x0:x1 + 1] - vy[x0:x1 + 1]
    pad = np.pad(dd, 50, mode="edge")
    med = np.array([np.median(pad[i:i + 101]) for i in range(len(dd))])
    aykiri = np.abs(dd - med) > 22
    if aykiri.any() and (~aykiri).sum() >= 2:
        dd[aykiri] = np.interp(xr[aykiri], xr[~aykiri], dd[~aykiri])
        kenar[x0:x1 + 1] = vy[x0:x1 + 1] + dd
    # (zarfın yuvarlak köşesindeki 3'er kenar sütunu sıçrama ölçüsüne girmez: orada dantel yok, kenar = gövde hattı)
    bilgi["continuity"] = {"replaced_columns": int(aykiri.sum()), "max_step_px": round(float(np.abs(np.diff(dd[3:-3])).max()), 1),
                           "limits": {"replaced_max_frac": 0.06, "max_step_px": 24}}
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
    bilgi["edge_minus_v_px"] = [round(float(v), 1) for v in np.percentile(kenar[x0:x1 + 1] - vy[x0:x1 + 1], [5, 50, 95])]
    return Image.fromarray(np.clip(np.rint(flap), 0, 255).astype(np.uint8), "RGBA"), bilgi


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


def trapez_cep_kes(eo: Image.Image, pay: float = 2.0):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi). Kenar = min(sol çapraz, sağ çapraz, düz orta) doğruları; noktalar:
    her sütunda astarın fildişi zemininin (lum > 195, 3 satır) en alt satırından aşağı ilk kalıcı cep kağıdı (100 < lum
    < 150, 6 satır). Sonuç kenarı `pay` px yukarı (açık kesik şeridi cepte)."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    cols = np.flatnonzero(op.any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    rows = np.flatnonzero(op.sum(1) >= (x1 - x0) * 0.97)
    ust, alt = int(rows[0]), int(np.flatnonzero(op.any(1)).max())
    lum = a[..., :3] @ LUM
    pts = []
    for x in range(x0 + 10, x1 - 10):
        c = lum[:, max(0, x - 1):x + 2].mean(1)
        iv = c > 195
        run = iv[:-2] & iv[1:-1] & iv[2:]
        aday = np.flatnonzero(run[ust - 10:alt - 60]) + ust - 10
        if not len(aday):
            continue
        y = int(aday.max()) + 2
        pk = (c < 150) & (c > 100)
        for yy in range(y, min(y + 80, alt - 10)):
            if pk[yy:yy + 6].all():
                pts.append((x, yy))
                break
    pts = np.array(pts, float)
    xm = (x0 + x1) / 2
    L = _saglam_dogru(pts[(pts[:, 0] > x0 + 30) & (pts[:, 0] < xm - 140)])
    R = _saglam_dogru(pts[(pts[:, 0] > xm + 140) & (pts[:, 0] < x1 - 30)])
    duz = float(np.median(pts[(pts[:, 0] > xm - 50) & (pts[:, 0] < xm + 50)][:, 1]))
    xs = np.arange(W)
    kenar = np.minimum(np.minimum(L[0] * xs + L[1], R[0] * xs + R[1]), duz) - pay
    art = np.abs(pts[:, 1] + 0 - (kenar[pts[:, 0].astype(int)] + pay))
    yy = np.arange(H)[:, None]
    m = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    cep = a.copy()
    cep[..., 3] *= m
    bilgi = {"method": "renk", "shape": "trapez", "body": [x0, ust, x1, alt], "left": [round(L[0], 4), round(L[1], 2), L[2]],
             "right": [round(R[0], 4), round(R[1], 2), R[2]], "flat_row": duz, "points": int(len(pts)),
             "residual_px_p50_p90": [round(float(v), 2) for v in np.percentile(art, [50, 90])],
             "edge_at": {"x0": round(float(kenar[x0]), 1), "mid": round(float(kenar[int(xm)]), 1), "x1": round(float(kenar[x1]), 1)},
             "warnings": []}
    if len(pts) < 0.6 * (x1 - x0) or bilgi["residual_px_p50_p90"][0] > 4:
        bilgi["warnings"].append(f"cep kenarı zayıf: {len(pts)} nokta, artık p50 {bilgi['residual_px_p50_p90'][0]} px — önizlemede gözle")
    return Image.fromarray(np.clip(np.rint(cep), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def muhur_olc(rgba: np.ndarray):
    """Mühür (altın balmumu) kutusu: sıcak altın pikseller (R − B > 45, R ≥ G − 4, lum > 120, R > 150), kapatma 3 +
    açma 8 px, en büyük bölge. Yatay ölçü çiçek sızıntısından etkilenir; boy güvenilir. → (x0, y0, x1, y1)."""
    rgb = rgba[..., :3].astype(np.float64)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = rgb @ LUM
    m = (r - b > 45) & (r >= g - 4) & (lum > 120) & (r > 150)
    if rgba.shape[-1] == 4:
        m &= rgba[..., 3] > 200
    m = ~genislet(~genislet(m, 3), 3)
    m = genislet(~genislet(~m, 8), 8)
    s = en_buyuk_bolge(m)
    ys, xs = np.nonzero(s)
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def muhur_ovali(rgba: np.ndarray):
    """Mührün boş oval ortası (monogram yeri, docs/11 §7.1): opak, açık (lum > 170), sıcak (R − B > 30) ve pürüzsüz
    (6 px pencerede varyans < 40) en büyük bölge. → (x0, y0, x1, y1)."""
    a = rgba.astype(np.float64)
    lum = a[..., :3] @ LUM
    m = _kutu_bulanik(lum, 6)
    v = _kutu_bulanik(lum * lum, 6) - m * m
    o = en_buyuk_bolge((v < 40) & (a[..., 3] > 250) & (lum > 170) & (a[..., 0] - a[..., 2] > 30))
    ys, xs = np.nonzero(o)
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, kenar_bosluk=(8.0, 90.0), min_gen: float = 90.0):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın bütün genişliğinde süs yok (merkezden iki yana
    açıklık ≥ min_gen; yalnız altın çerçeve çizgileri). Orta bant dikeyde gerilir: içinde süs olursa o da gerilirdi, bu
    yüzden yalnız tam genişlikte düz satırlar. Üst dilim sonu = en uzun düz bandın başı, alt dilim başı = sonu.
    (t, b, [t, b])."""
    duz = [y for y, L, R in fz if L is not None and R - L >= min_gen and kenar_bosluk[0] <= y <= kenar_bosluk[1]]
    if not duz:
        raise SystemExit("kart: düz kağıt bandı bulunamadı")
    # en uzun kesintisiz bant
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
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="oi-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (olive-ivory); ölçüler px, kutular [x, y, w, h], box_pct yüzde. "
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
    W, H = ec.size

    flap, kb = dantel_kapak_kes(ec)
    uyar("env_cflap", kb)
    sur = kb.get("continuity")
    if sur and (sur["max_step_px"] > 24 or sur["replaced_columns"] > 0.06 * (kb["columns"][1] - kb["columns"][0] + 1)):
        sys.exit(f"kapak kesimi: dantel kenarı sürekli değil ({sur}) — kesim önizlemesine bak (--onizleme)")
    pocket, cep, cep_kenar = trapez_cep_kes(eo)
    uyar("env_pocket", cep)
    govde_ust = cep["body"][1]
    # açık zarf: kapak (gövde üstüne kadar + 3 px bindirme), gövde (astar + arka + yan kanatlar), ön cep
    yy = np.arange(H)[:, None]
    eoa = np.asarray(eo).astype(np.float64)
    m_flap = np.clip(govde_ust + 3 - yy + 0.5, 0, 1) * np.ones((1, W))
    m_body = np.clip(yy - (govde_ust - 2) + 0.5, 0, 1) * np.ones((1, W))
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

    # menteşe hizası (docs/11 §7.1 "ölçülen dönüşüm"): kit_check'in karşılaştırdığı kenarlar (sol, sağ, alt) ±%0,65 içinde,
    # ama GPT açık zarfın arka panelinin üst kenarını kapalı zarfın kapak katlanma çizgisinden ~60 px yukarıda çizdi (açık
    # gövde %10 uzun). Açık katmanlar dikeyde alt kenara göre ölçeklenir: açık gövde üstü = kapalı menteşe satırı, açık
    # gövde altı = kapalı alt kenar → 90°'deki el değiştirme aynı menteşe çizgisinde olur (kapak "zıplamaz").
    eca0 = np.asarray(ec)[..., 3]
    kapali_ust = int(kb["hinge_row"])
    kapali_alt = int(np.flatnonzero(eca0.max(1) > 200).max()) + 1
    acik_ust, acik_alt = int(govde_ust), int(cep["body"][3]) + 1
    sy = (kapali_alt - kapali_ust) / (acik_alt - acik_ust)
    dy = kapali_ust - acik_ust * sy

    def hizala(im):
        r = im.resize((W, max(1, round(H * sy))), Image.LANCZOS)
        tuval = Image.new("RGBA", (W, H))
        tuval.paste(r, (0, round(dy)))
        return tuval
    eo = hizala(eo)
    env_flap, env_body, pocket = hizala(env_flap), hizala(env_body), hizala(pocket)
    cep_kenar = kapali_ust + (cep_kenar - acik_ust) * sy
    govde_ust = kapali_ust
    hiza_duzeltme = {"open_scale_y": round(sy, 5), "open_offset_y_px": round(dy, 1),
                     "open_body_rows_before": [acik_ust, acik_alt], "closed_rows": [kapali_ust, kapali_alt],
                     "reason": "GPT: açık arka panelin üst kenarı kapalı menteşeden yukarıda; alt kenara göre dikey ölçek"}
    print(f"menteşe hizası: açık katmanlar dikeyde × {sy:.4f}, öteleme {dy:.1f} px")

    # ------------------------------------------------------------------ kapanış (mühür + dal, tek parça)
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    sx0, sy0, sx1, sy1 = muhur_olc(np.asarray(cl_raw))
    seal_h = sy1 - sy0
    ox0, oy0, ox1, oy1 = muhur_ovali(np.asarray(cl_raw))
    seal_c = ((ox0 + ox1) / 2, (oy0 + oy1) / 2)                    # mühür merkezi = boş ovalin merkezi
    eca = np.asarray(ec)[..., 3]
    ecols = np.flatnonzero(eca.max(0) > 200)
    erows = np.flatnonzero(eca.max(1) > 200)
    env_x0, env_x1, env_y0, env_y1 = int(ecols.min()), int(ecols.max()) + 1, int(erows.min()), int(erows.max()) + 1
    env_w = env_x1 - env_x0
    s = (COMP["seal_h"] / COMP["env_w"]) * env_w / seal_h          # closure tuval px → zarf tuval px
    kayma = (COMP["seal_c"][1] - COMP["tip"][1]) / COMP["env_w"]    # −0.118: mühür merkezi uçtan yukarıda
    tip = kb["tip"]
    hedef = (tip[0], tip[1] + kayma * env_w)
    ck = alfa_kutu(cl)                                               # kapanışın kendi alfa kutusu (closure tuvali)
    cl_crop = cl.crop(ck)
    c_left = hedef[0] - (seal_c[0] - ck[0]) * s
    c_top = hedef[1] - (seal_c[1] - ck[1]) * s
    c_w, c_h = (ck[2] - ck[0]) * s, (ck[3] - ck[1]) * s
    closure_box = [c_left, c_top, c_left + c_w, c_top + c_h]

    # ------------------------------------------------------------------ kart (card_small) yolu
    # sahnedeki kart = img/card_small (parts_prep katmanı: alfa kutusu + 8 px şeffaf pay; pencere kaydı bu katmana göre)
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    card_w = 0.58 * env_w
    card_h = card_w / card_ar
    card_x = (env_x0 + env_x1) / 2 - card_w / 2
    hidden_top = govde_ust + 0.075 * (env_y1 - env_y0)                 # astar penceresinde kartın üstü görünür
    kose_kenar = float(min(cep_kenar[int(card_x)], cep_kenar[int(card_x + card_w)]))
    # G401 incelemesi: kart yukarıda kalır (yukarı → aşağı → yukarı dönüş yok). out = alt köşeleri cebin kenarını kartın
    # %4'ü kadar aşmış (cep kartın açıklığında en yüksek köşelerde; z-index takası anında köşe "atlamaz"); front = aynı
    # yerde öne gelir: %3 aşağı + × 1.04 (üst kenar neredeyse yerinde, büyüyen gölge) → home kartına doğru yukarı uçar
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
        # yatayda sahnenin tam genişliği: bütün zarf katmanları aynı genişlikte (440/880 dosya adları sabit, left 0)
        k = [int(np.floor(X0)), k[1], int(np.ceil(X1)), k[3]]
        webp(im.crop(k), ad, WIDTHS[ad])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    webp(cl_crop, "closure", WIDTHS["closure"])
    katman["closure"] = pct(closure_box)
    katman["card"] = pct(card_box_hidden)
    stage["parts"] = katman
    stage["hinge_pct"] = round(100 * (kb["hinge_row"] - Y0) / SH, 3)          # .env-cflap-wrap transform-origin y
    stage["body_bottom_pct"] = round(100 * (env_y1 - Y0) / SH, 3)            # kart yuvası alttan kırpım
    stage["open_body_top_pct"] = round(100 * (govde_ust - Y0) / SH, 3)
    stage["closed_obj"] = {"box_pct": pct([env_x0, env_y0, env_x1, env_y1]), "aspect": round(env_w / (env_y1 - env_y0), 4),
                           "frac_w": round(env_w / SW, 5), "top_frac_of_stage_w": round((env_y0 - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - env_y1) / SW, 5)}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3), "front_scale": scale_front,
                          "pocket_edge_at_card_corners": round(kose_kenar, 1), "card_w_of_env": 0.58}
    stage["cuts"] = {"cflap": kb, "pocket": cep}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak)}
    stage["hinge_align"] = hiza_duzeltme
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "V flap tip (lace outer edge, lowest point)", "anchor_px": [round(tip[0], 1), round(tip[1], 1)],
        "center_px": [round(hedef[0], 1), round(hedef[1], 1)], "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "seal_height_px_closure": seal_h,
        "seal_center_in_crop_pct": [round(100 * (seal_c[0] - ck[0]) / (ck[2] - ck[0]), 3), round(100 * (seal_c[1] - ck[1]) / (ck[3] - ck[1]), 3)],
        "seal_size_in_crop_pct": [round(100 * (sx1 - sx0) / (ck[2] - ck[0]), 3), round(100 * seal_h / (ck[3] - ck[1]), 3)],
        "mono_oval_in_crop_pct": [round(100 * (ox0 - ck[0]) / (ck[2] - ck[0]), 3), round(100 * (oy0 - ck[1]) / (ck[3] - ck[1]), 3),
                                  round(100 * (ox1 - ox0) / (ck[2] - ck[0]), 3), round(100 * (oy1 - oy0) / (ck[3] - ck[1]), 3)],
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": COMP["env_w"], "seal_h_over_env_w": round(COMP["seal_h"] / COMP["env_w"], 4),
                 "seal_center_minus_tip_over_env_w": round(kayma, 4)},
        "carried_by_flap": True,
    })

    # ------------------------------------------------------------------ çerçeveli parçalar + foto alanları
    slots = {}
    for ad, parca in (("card", "card_small"), ("portrait", "frame_portrait"), ("landscape", "frame_landscape")):
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        im, temizlik[parca] = hale_temizle(im, sert=True)
        im, n_halka = pencere_halkasi(im, prep, win, parca)
        temizlik[parca]["window_ring_px"] = n_halka
        # foto_alani pencere kutusunu prep katmanına göre hesaplar: kırpmadan (prep boyutunda) yaz
        webp(im, parca, WIDTHS[parca])
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
        if oniz:
            bg = Image.new("RGBA", im.size, (241, 239, 230, 255)); bg.alpha_composite(im)
            bg.convert("RGB").save(oniz / f"kenar_{parca}.jpg", quality=88)
    manifest["photo_slots"] = slots

    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.45, .55))
        manifest[nm]["free_zone"] = fz
        t, b, _ = dilimler(fz)
        manifest[nm]["slices"] = {"top_end_pct": t, "bottom_start_pct": b, "ratio": round(im.width / im.height, 5),
                                  "note": "üst dilim <img> (object-fit: cover, üstten), orta düz kağıt bandı ::before (dikey "
                                          "gerilir), alt dilim ::after — docs/11 §9; site.css --t/--b"}
    manifest["card_small"]["free_zone"] = tb.serbest_bolge(Image.open(prep / "card_small.png"), 0.5, ornek=(.8, .86))

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
    webp(bg, "bg_page", [640, 1024], 76)
    webp(tb.bulanik_fon(bg, (640, 960), 6), "mist", [640], 80)
    # uzun sayfa zemini: bg_tile (dikişsiz kağıt), bg_page'in çiçeksiz, güneşli orta bölgesinin ortalama rengine çekilir
    # (sahne zemini ile karo zemin arasında renk sıçraması olmasın; doku korunur)
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((400, 500, 700, 700))).reshape(-1, 3).astype(np.float64).mean(0)
    ta = ta - ta.reshape(-1, 3).mean(0) + hedef_renk
    tile = Image.fromarray(np.clip(np.rint(ta), 0, 255).astype(np.uint8), "RGB")
    webp(tile, "bg_tile", [640], 78)
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
    manifest["checks"] = {"envelope_open_overlap_diff": round(fark_acik, 5), "green_px": 0,
                          "windows_transparent": {k: [f.get("window_visible_px") for f in manifest[p]["files"]]
                                                  for k, p in (("card", "card_small"), ("portrait", "frame_portrait"),
                                                               ("landscape", "frame_landscape"))}}
    # theme-check tablosu (scripts/lib/theme-env.ts): kartlar <img> ile otomatik bulunur; parçacık katmanı adı
    manifest["theme_check"] = {"particles": ".accent-layer"}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl_crop, katman, stage, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"kart yolu {stage['card_path']}")
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


def onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl_crop, katman, stage, cs):
    """Kesim önizlemeleri (gözle denetim): kapak / gövde, cep / arka, kapalı sahne (kapanış yerinde)."""
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
    # kapalı sahne: zarf + kapanış sahne yüzdeleriyle
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW
    sahne = Image.new("RGBA", (900, round(SH * k)), (241, 239, 230, 255))

    def koy(im, p, kutu=None):
        x, y, w, h = p
        r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
        sahne.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
    koy(ec.crop(alfa_kutu(ec, 1)), katman["env_closed"])
    koy(flap.crop(alfa_kutu(flap, 1)), katman["env_cflap"])
    koy(cl_crop, katman["closure"])
    sahne.convert("RGB").save(oniz / "kapali_sahne.jpg", quality=88)
    acik = Image.new("RGBA", sahne.size, (241, 239, 230, 255))
    sahne = acik
    koy(env_flap.crop(alfa_kutu(env_flap, 1)), katman["env_flap"])
    koy(env_body.crop(alfa_kutu(env_body, 1)), katman["env_body"])
    koy(cs, katman["card"])
    koy(pocket.crop(alfa_kutu(pocket, 1)), katman["env_pocket"])
    sahne.convert("RGB").save(oniz / "acik_sahne.jpg", quality=88)


if __name__ == "__main__":
    main()
