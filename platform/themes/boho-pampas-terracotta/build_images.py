#!/usr/bin/env python3
"""Boho Pampas Terracotta teması (tasarım 11, G411) — img/ klasörünü yalnız bu tasarımın GPT parçalarından üretir. Teknik
hazırlık (K21): kırpar, keser, maskeler, ölçekler, bulanıklaştırır, kenar temizler; yeni şekil/dekor çizmez.

  python3 platform/themes/boho-pampas-terracotta/build_images.py [--prep-dir DIR] [--q 80] [--out DIR] [--onizleme DIR]

Kaynak: collections/11_Boho_Pampas/assets/gpt/parts/ (G211, PAKET 5 W2). Önce tools/parts_prep.py geçici klasöre koşar
(alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" şeffaf, windows.json); tema klasörüne, img_src/'ye, assets/'e
yazılmaz (docs/11 §1, §5.3). Ortak yardımcılar: tools/tema_build.py.

Bu tasarıma özgü (docs/11 §7.1, §7.2 "kapak — kemer cep", §7.3):
  * Kapak: kapalı zarfın yuvarlak kemer kapağı (üstteki kubbe + ön cebin üstüne inen yay, tek parça) tema_build
    kapak_kes("egri") ile serbest kenarından kesilir; menteşe = kapağın üst kenarı (kapalı zarfın üst kenarı).
  * Ön cep: açık zarfın ön cebi yukarı doğru hafif kemerli. tema_build.cep_kes("egri") bu görselde kenarı okuyamadı
    (geometrik yedek, kenar ~45 px aşağıda): astardaki terrakota gökkuşakları cep kağıdıyla aynı renkte. Burada ortada
    her sütunda astarın açık zemininin en alt satırından aşağı ilk kalıcı terrakota satırı, iki yanda (astar yerine yan
    kanatlar var) aynı eğrinin ±14 px'inde açık kesik şeridin üst kenarı (en güçlü aydınlanma) okunur; hepsine aykırısız
    4. derece polinom; kenar 2 px yukarı (açık şerit cepte).
  * Siluet hizası (ölçülen dönüşüm, docs/11 §7.1): kit_check'in karşılaştırdığı kenarlar (sol, sağ, alt) ±%1,04 içinde,
    ama GPT açık zarfı ~200 px daha uzun çizdi (alfa üstü 242 ↔ kapalı 426): açık zarfta astarlı kubbe gövdeye y≈601'deki
    boğumda birleşiyor, kapalı zarfta gövdenin tam genişliği (omuz) y≈730'da başlıyor; genişlikler aynı. Açık katmanlar
    dikeyde alt kenara göre ölçeklenir: açık boğum = kapalı omuz, açık alt = kapalı alt (× ~0,80) → açık zarfın kubbesi
    kapalı zarfın kubbesinin yerine oturur (üst kenar farkı ~17 px), açılışta gövdeye "omuz" eklenmez, kapanışsız kemer
    siluet korunur (ölçek ve sonuç manifest.stage.hinge_align'da). Kapalı kapak üst kenarında (kubbenin tepesi) döner,
    astarlı açık kapak boğum (= omuz) satırından kalkar; 90°'de ikisi de kenardan görünür.
  * Kapanış (closure.png = kurdeleyle bağlı palmiye mızrağı + pampas tüyü, tek parça) kare tuvalde büyük çizildi; yeri
    kesim geometrisine bağlanır: çapa = kemer kapağın ucu (kenarın en alt noktası), comp'ta (W1.1) ölçülen boy (kapanış
    yüksekliği / zarf genişliği) ve kayma (manifest.closure). Açılışta kapaktan kayıp düşer (site.js "slips off").
  * GPT kusurları (kesimle/temizlikle, çizimsiz): dış hatta yarı saydam hâle (alfa tabanı + çekirdekten uzak düşük alfa
    silinir, kenar rengi komşu opak renge çekilir); frame_portrait ve frame_landscape pencerelerindeki koyu yarı saydam
    "bulut lekesi" (G211 kusuru) parts_prep leke_doldur ile tam maske; pencere çevresi 3 px halkada kalan ayrıştırma
    saçağı çerçeve renginden yeniden boyanır (alfa korunur).

Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json (sahne kutusu ve katman
yüzdeleri, menteşe, kart yolu, kapanış çapası, foto alanları, kart serbest bölgeleri ve 3 dilim sınırları, hiza ölçümü,
denetimler). site.css'teki yüzdeler manifest'ten; --onizleme DIR kesim önizlemelerini yazar (gözle denetim).
Tema klasörü ≤ 3 MB (aşarsa çıkış ≠ 0). Bağımlılık: Pillow + numpy.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/11_Boho_Pampas"
PARTS = COL / "assets/gpt/parts"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402
from mockup_compose import _kutu_bulanik, genislet  # noqa: E402

LUM = np.array([0.299, 0.587, 0.114])
WIDTHS = {
    "env_closed": [440, 880], "env_cflap": [440, 880], "env_flap": [440, 880], "env_body": [440, 880],
    "env_pocket": [440, 880], "closure": [320, 640], "card_small": [320, 596], "invitation_card": [480, 877],
    "info_card": [480, 747], "frame_portrait": [320, 640], "frame_landscape": [480, 960], "decor_tl": [480, 960],
    "decor_br": [480, 960], "divider": [300, 600],
}
# palet (palette.json terracotta-boho): ivory #FBF5EC — yer tutucu tonu
IVORY = (251, 245, 236)
# foto anahtarı → (pencere, çıktı genişlikleri, bg_page kırpım kutusu: dekorsuz, güneş ışınlı sakin bölgeler)
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (430, 120, 900, 760)),
    "story_1": ("portrait", [320, 640], (300, 640, 760, 1120)),
    "story_2": ("portrait", [320, 640], (560, 140, 1000, 720)),
    "story_3": ("portrait", [320, 640], (330, 380, 800, 1000)),
    "venue": ("landscape", [480, 960], (240, 720, 800, 1080)),
}
MIST_KUTU = (340, 260, 800, 950)   # bulanık geniş ekran zemini için bg_page kırpımı (kümeler dışında)
PH_MIN_LUM = 175   # yer tutucuda en koyu piksel (gri ton) en az bu: kümeden yaprak/gül kırpıma girmez (çıkış ≠ 0)
# comp W1.1 ölçümü (comps/web_1_envelope.png, 1024×1536): zarf gövdesi x 265–758 (493 px); kapanış (açık krem/bej
# pikseller, zarf içinde en büyük bölge) kutusu x 422–645, y 620–980 (yükseklik 360); kemer kapağın kenarı kapanışın
# altında kaldığı için iki yanındaki sütunlardan (x 285–415, 655–745; parlak kenar şeridi → gölge geçişi) aykırısız
# parabolle bulundu, ucu (511.5, 870.5). → kapanış yüksekliği / zarf genişliği 0.730; kutu merkezi uçtan (+0.045, −0.143)
# × zarf genişliği (yatay kayma tasarımın kendisi: pampas tüyü sağa yatık; kare tuvaldeki parçada da aynı yön).
COMP = {"env_w": 493.0, "closure_h": 360.0, "closure_c": (533.5, 800.0), "tip": (511.5, 870.5)}
# 3 dilim: düz kağıt satırı = iç kemer çizgisinin içinde bu genişlikte (%) süssüz (invitation_card: iç çizgi %17–84,
# pampas kümeleri sağ üst + sol alt; info_card: iç çizgi %7–93, tek pampas tüyü altta)
DUZ_BANT = {"invitation_card": 66.0, "info_card": 85.0}
CARD_W_OF_ENV = 0.60      # sahnedeki kart genişliği / kapalı zarf genişliği (cebe sığar, kemerin üstüne güneş gibi doğar)


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
    near = genislet(al >= cekirdek, 1 if sert else 3)
    yeni[~near] = 0
    opak = (al >= 230).astype(np.float64)
    pay = _kutu_bulanik(opak, 3)
    renk = np.stack([_kutu_bulanik(a[..., i] * opak, 3) for i in range(3)], -1)
    kenar = (yeni > 0) & (al < 230) & (pay > 1e-3)
    hedef = renk[kenar] / pay[kenar][:, None]
    w = (1 - al[kenar] / 230.0)[:, None] if not sert else np.ones((int(kenar.sum()), 1))
    a[..., :3][kenar] = a[..., :3][kenar] * (1 - w) + hedef * w
    # yeşil fazlası (WebP 4:2:0 renk alt örneklemesinde "görünür #00FF00" eşiğini geçmesin; kuru palmiyenin zeytin tonu
    # kalır): G − max(R, B) ≤ 24
    mx = np.maximum(a[..., 0], a[..., 2])
    fazla = (a[..., 1] - mx > 24) & (a[..., 1] * 2 >= 3 * mx)
    a[..., 1][fazla] = mx[fazla] + 24
    a[..., 3] = yeni
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA"), {
        "alpha_floor": esik, "core": cekirdek, "reach_px": 1 if sert else 3, "removed_px": once - int((yeni > 0).sum())}


def pencere_halkasi(im: Image.Image, prep: Path, win: dict, ad: str, halka: int = 3):
    """Pencere ayrıştırmasının bıraktığı saçak: pencerenin `halka` px çevresindeki görünür piksellerin rengi, 4–10 px
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
    """Şeffaf piksellerin RGB'si görünen komşu renkle doldurulur ("alpha bleeding"): kayıplı WebP kenar saçağı olmasın;
    görüntü değişmez (yalnız alfa 0 piksellerin rengi)."""
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
    return [int(v) for v in tb.alfa_kutusu(np.asarray(im)[..., 3], esik=esik)]


def satir_kutusu(im: Image.Image, esik: int = 200):
    """Opak (alfa > esik) piksellerin kutusu [x0, y0, x1, y1) — zarf gövdesinin ölçüsü (yumuşak gölge kenarı hariç)."""
    al = np.asarray(im)[..., 3]
    c = np.flatnonzero(al.max(0) > esik)
    r = np.flatnonzero(al.max(1) > esik)
    return int(c.min()), int(r.min()), int(c.max()) + 1, int(r.max()) + 1


# ============================================================================= kesimler (bu tasarım)

def _saglam_polinom(x, y, derece, merkez, yarim, tur=8):
    p = np.column_stack([x, y]).astype(float)
    for _ in range(tur):
        co = np.polyfit((p[:, 0] - merkez) / yarim, p[:, 1], derece)
        r = p[:, 1] - np.polyval(co, (p[:, 0] - merkez) / yarim)
        s = max(2.0, 2.5 * np.median(np.abs(r)) * 1.4826)
        keep = np.abs(r) < s
        if keep.all():
            break
        p = p[keep]
    r = p[:, 1] - np.polyval(co, (p[:, 0] - merkez) / yarim)
    return co, int(len(p)), [round(float(v), 2) for v in np.percentile(np.abs(r), [50, 90])]


def kemer_cep_kes(eo: Image.Image, pay: float = 2.0):
    """Açık zarf → (ön cep RGBA tam tuval, bilgi, kenar dizisi). Ortada: her sütunda astarın açık zemininin (lum > 196,
    3 satır) en alt satırından aşağı ilk kalıcı terrakota satırı (R − B > 55, lum < 178, 8 satır). Bu noktalara 2. derece
    ön bilgi; iki yanda (nokta bulunmayan sütunlar: yan kanat kağıdı) ön bilginin ±14 px'inde açık kesik şeridin üst
    kenarı (en güçlü aydınlanma, < −40). Hepsine aykırısız 4. derece polinom; kenar `pay` px yukarı."""
    a = np.asarray(eo).astype(np.float64)
    H, W = a.shape[:2]
    op = a[..., 3] > 200
    cols = np.flatnonzero(op.any(0))
    x0, x1 = int(cols.min()), int(cols.max())
    alt = int(np.flatnonzero(op.any(1)).max())
    lum = a[..., :3] @ LUM
    terra = (a[..., 0] - a[..., 2] > 55) & (lum < 178) & op
    krem = (lum > 196) & op
    ust_ara, alt_ara = int(0.42 * H), int(0.68 * H)   # astar → cep geçişinin arandığı bant (cebin içindeki açık benekler dışarıda)
    pts = []
    for x in range(x0 + 4, x1 - 3):
        c, t = krem[ust_ara:alt_ara, x], terra[ust_ara:alt_ara, x]
        run = np.flatnonzero(c[:-2] & c[1:-1] & c[2:])
        if not len(run):
            continue
        y = int(run.max()) + 2
        for k in range(y, len(t) - 8):
            if t[k:k + 8].all():
                pts.append((x, ust_ara + k))
                break
    pts = np.array(pts, float)
    xm, yarim = (x0 + x1) / 2, (x1 - x0) / 2
    bilgi = {"method": "renk", "shape": "egri (kemer)", "body": [x0, None, x1, alt], "center_points": int(len(pts)),
             "warnings": []}
    if len(pts) < 0.4 * (x1 - x0):
        raise SystemExit(f"ön cep: astar → cep geçişi yalnız {len(pts)} sütunda bulundu — kesim önizlemesine bak")
    co2, _, _ = _saglam_polinom(pts[:, 0], pts[:, 1], 2, xm, yarim)
    xs = np.arange(W)
    on = np.polyval(co2, (xs - xm) / yarim)
    lo_x, hi_x = int(pts[:, 0].min()), int(pts[:, 0].max())
    yan = []
    for x in list(range(x0 + 4, lo_x)) + list(range(hi_x + 1, x1 - 3)):
        e = int(round(on[x]))
        col = lum[e - 14:e + 16, x]
        d = col[:-3] - col[3:]
        i = int(np.argmin(d))
        if d[i] < -40:
            yan.append((x, e - 14 + i + 1))
    yan = np.array(yan, float).reshape(-1, 2)
    hepsi = np.vstack([pts, yan])
    co4, kalan, art = _saglam_polinom(hepsi[:, 0], hepsi[:, 1], 4, xm, yarim)
    kenar = np.polyval(co4, (xs - xm) / yarim) - pay
    bilgi.update({"side_points": int(len(yan)), "kept": kalan, "residual_px_p50_p90": art,
                  "curve": [round(float(c), 4) for c in co4], "curve_x": [round(xm, 1), round(yarim, 1)],
                  "edge_at": {"x0": round(float(kenar[x0]), 1), "mid": round(float(kenar[int(xm)]), 1),
                              "x1": round(float(kenar[x1]), 1)}})
    if kalan < 0.6 * (x1 - x0) or art[0] > 3:
        bilgi["warnings"].append(f"cep kenarı zayıf: {kalan} nokta, artık p50 {art[0]} px — önizlemede gözle")
    yy = np.arange(H)[:, None]
    m = np.clip(yy - kenar[None, :] + 0.5, 0, 1)
    cep = a.copy()
    cep[..., 3] *= m
    return Image.fromarray(np.clip(np.rint(cep), 0, 255).astype(np.uint8), "RGBA"), bilgi, kenar


def acik_mentese(eo: Image.Image):
    """Açık zarfta kubbe (kalkık kemer kapak, astarlı iç yüzü) ile gövdenin birleştiği boğum: kubbe tam genişliğe
    ulaştıktan sonraki %15 yükseklikte opak satır genişliğinin en dar yeri (yan kanatların kapak kenarına girdiği çentik)
    — o satırların ortası. → (satır, bilgi)."""
    al = np.asarray(eo)[..., 3]
    r = np.flatnonzero(al.max(1) > 200)
    y0, y1 = int(r.min()), int(r.max())
    genis = (al > 200).sum(1)
    tam = int(np.flatnonzero(genis >= genis.max() - 2)[0])
    gen = []
    for y in range(tam, int(tam + 0.15 * (y1 - y0))):
        c = np.flatnonzero(al[y] > 200)
        gen.append((y, int(c.max() - c.min()) if len(c) else 0))
    g = np.array(gen)
    en = g[:, 1].min()
    dar = g[g[:, 1] <= en + 1, 0]
    return int(round(float(np.median(dar)))), {"narrowest_width_px": int(en), "rows": [int(dar.min()), int(dar.max())],
                                                "full_width_px": int(g[:, 1].max())}


def kapanis_olc(rgba: np.ndarray):
    """Kapanış parçasının (kurdele + palmiye + pampas) kutusu: alfa > 128 kutusu (yumuşak tüy ucu dahil, comp'taki
    açık renk bölgesiyle aynı tanım). → (x0, y0, x1, y1)."""
    al = rgba[..., 3]
    c = np.flatnonzero(al.max(0) > 128)
    r = np.flatnonzero(al.max(1) > 128)
    return int(c.min()), int(r.min()), int(c.max()) + 1, int(r.max()) + 1


# ============================================================================= kart dilimleri (docs/11 §9)

def dilimler(fz, min_gen: float, kenar_bosluk=(8.0, 92.0)):
    """free_zone → 3 dilim sınırları (yüzde): düz kağıt satırı = kartın iç kemer çizgisinin içinde süs yok (açıklık
    ≥ min_gen; yalnız terrakota kemer çizgileri dışarıda). Orta bant dikeyde gerilir: içinde süs olursa o da gerilirdi,
    bu yüzden yalnız düz satırlar. Üst dilim sonu = en uzun düz bandın başı, alt dilim başı = sonu."""
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


# ============================================================================= ana akış

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prep-dir", help="parts_prep çıktısı için klasör (vars. geçici)")
    ap.add_argument("--q", type=int, default=80)
    ap.add_argument("--out", help="çıktı klasörü (vars. tema img/)")
    ap.add_argument("--onizleme", help="kesim önizlemeleri (tema klasörü dışında bir klasör)")
    args = ap.parse_args()

    out = Path(args.out).resolve() if args.out else THEME / "img"
    oniz = Path(args.onizleme).resolve() if args.onizleme else None
    if oniz and (oniz == THEME or oniz.is_relative_to(THEME)):
        sys.exit("--onizleme tema klasörünün içinde olamaz")
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="bpt-prep-")
    out.mkdir(parents=True, exist_ok=True)
    if oniz:
        oniz.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (boho-pampas-terracotta); ölçüler px, kutular [x, y, w, h], box_pct "
                         "yüzde. stage.* yüzdeleri sahne kutusuna göre (docs/11 §7.1)"}
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

    flap0, kb = tb.kapak_kes(ec, "egri")
    uyar("env_cflap", kb)
    if kb.get("method") == "geometrik":
        sys.exit("kemer kapak kenarı okunamadı (geometrik yedek) — kesim önizlemesine bak")
    flap = Image.new("RGBA", (W, H))
    flap.paste(flap0, (0, 0))
    pocket, cep, cep_kenar = kemer_cep_kes(eo)
    uyar("env_pocket", cep)
    mentese_o, mentese_bilgi = acik_mentese(eo)
    cep["body"][1] = mentese_o
    # açık zarf: kapak (menteşeye kadar + 3 px bindirme), gövde (astar + arka + yan kanatlar), ön cep
    yy = np.arange(H)[:, None]
    eoa = np.asarray(eo).astype(np.float64)
    of = eoa.copy(); of[..., 3] *= np.clip(mentese_o + 3 - yy + 0.5, 0, 1) * np.ones((1, W))
    ob = eoa.copy(); ob[..., 3] *= np.clip(yy - (mentese_o - 2) + 0.5, 0, 1) * np.ones((1, W))
    env_flap = Image.fromarray(np.rint(of).astype(np.uint8), "RGBA")
    env_body = Image.fromarray(np.rint(ob).astype(np.uint8), "RGBA")
    fark_acik = tb.ortusme(eo, [env_flap, env_body, pocket])
    fark_kapak = float(((np.asarray(flap)[..., 3].astype(int) - np.asarray(ec)[..., 3].astype(int)) > 1).sum())
    if fark_acik > 0.01:
        sys.exit(f"açık zarf katmanları kaynakla örtüşmüyor (alfa farkı {fark_acik:.4f} > 0.01)")
    if fark_kapak:
        sys.exit(f"kapak katmanı kapalı zarfın dışına taşıyor ({fark_kapak:.0f} px)")

    # siluet hizası (ölçülen dönüşüm): açık boğum → kapalı omuz, açık alt → kapalı alt (yalnız dikey ölçek)
    kapak_ust = satir_kutusu(flap, 128)[1]                       # kapalı kapağın döndüğü satır (kubbenin tepesi)
    eca_ = np.asarray(ec)[..., 3] > 200
    gen_ = eca_.sum(1)
    kapali_ust = int(np.flatnonzero(gen_ >= gen_.max() - 2)[0])     # omuz: gövdenin tam genişliği başlar
    kapali_alt = satir_kutusu(ec)[3]
    acik_alt = satir_kutusu(eo)[3]
    sy = (kapali_alt - kapali_ust) / (acik_alt - mentese_o)
    dy = kapali_ust - mentese_o * sy

    def hizala(im):
        r = im.resize((W, max(1, round(H * sy))), Image.LANCZOS)
        tuval = Image.new("RGBA", (W, H))
        tuval.paste(r, (0, round(dy)))
        return tuval
    acik_kapak_boy = (mentese_o - satir_kutusu(eo)[1]) * sy
    eo = hizala(eo)
    env_flap, env_body, pocket = hizala(env_flap), hizala(env_body), hizala(pocket)
    cep_kenar = kapali_ust + (cep_kenar - mentese_o) * sy
    acik_ust_sonra = satir_kutusu(eo, 128)[1]
    hiza_duzeltme = {"open_scale_y": round(sy, 5), "open_offset_y_px": round(dy, 1), "open_hinge_row_before": mentese_o,
                     "open_hinge_detector": mentese_bilgi, "open_bottom_before": acik_alt,
                     "closed_shoulder_row": kapali_ust, "closed_bottom_row": kapali_alt, "closed_flap_top_row": kapak_ust,
                     "top_edge_after_px": {"closed": kapak_ust, "open": acik_ust_sonra},
                     "dome_height_px": {"open_after": round(acik_kapak_boy, 1), "closed_dome": kapali_ust - kapak_ust},
                     "reason": "GPT: açık zarf ~200 px uzun (genişlikler aynı); açık boğum = kapalı omuz, alt kenarlar "
                               "aynı → aynı kemer siluet"}
    print(f"siluet hizası: açık katmanlar dikeyde × {sy:.4f}, öteleme {dy:.1f} px; üst kenar kapalı {kapak_ust} / açık "
          f"{acik_ust_sonra}; kubbe açık {acik_kapak_boy:.0f} px, kapalı {kapali_ust - kapak_ust} px")

    # ------------------------------------------------------------------ kapanış (bağ, tek parça) — kesim geometrisine bağlı
    cl_raw = Image.open(PARTS / "closure.png").convert("RGBA")
    cl, temizlik["closure"] = hale_temizle(cl_raw, sert=False)
    kx0, ky0, kx1, ky1 = kapanis_olc(np.asarray(cl_raw))
    env_x0, env_y0, env_x1, env_y1 = satir_kutusu(ec)
    env_w = env_x1 - env_x0
    s = (COMP["closure_h"] / COMP["env_w"]) * env_w / (ky1 - ky0)      # closure tuval px → zarf tuval px
    kayma = ((COMP["closure_c"][0] - COMP["tip"][0]) / COMP["env_w"], (COMP["closure_c"][1] - COMP["tip"][1]) / COMP["env_w"])
    tip = kb["tip"]
    hedef = (tip[0] + kayma[0] * env_w, tip[1] + kayma[1] * env_w)    # kapanış kutusunun merkezi (zarf tuvali)
    ck = alfa_kutu(cl)
    cl_crop = cl.crop(ck)
    kc = ((kx0 + kx1) / 2, (ky0 + ky1) / 2)
    c_left = hedef[0] - (kc[0] - ck[0]) * s
    c_top = hedef[1] - (kc[1] - ck[1]) * s
    closure_box = [c_left, c_top, c_left + (ck[2] - ck[0]) * s, c_top + (ck[3] - ck[1]) * s]

    # ------------------------------------------------------------------ kart (card_small) yolu
    cs = Image.open(prep / "card_small.png").convert("RGBA")
    card_ar = cs.width / cs.height
    card_w = CARD_W_OF_ENV * env_w
    card_h = card_w / card_ar
    card_x = (env_x0 + env_x1) / 2 - card_w / 2
    cx0, cx1 = int(card_x), int(np.ceil(card_x + card_w))
    cep_ust = float(cep_kenar[cx0:cx1 + 1].min())                     # cebin kartın genişliğindeki en yüksek noktası
    hidden_top = cep_ust - 0.12 * card_h                                # açık zarfta kartın üstü astarın önünde görünür
    # out: kartın alt kenarı cebin kartın genişliğindeki en yüksek noktasını kart boyunun %4'ü aşmış (z-index takasında
    # köşe "atlamaz"); front: aynı yerde öne (%2,5 aşağı + × 1.05, büyüyen gölge) → home kartına doğru yukarı uçar
    out_top = cep_ust - 0.04 * card_h - card_h
    front_top = out_top + 0.025 * card_h
    card_box_hidden = [card_x, hidden_top, card_x + card_w, hidden_top + card_h]

    # ------------------------------------------------------------------ sahne kutusu = birleşim (docs/11 §7.1)
    ob_box = alfa_kutu(eo, esik=1)
    cb_box = alfa_kutu(ec, esik=1)
    scale_front = 1.05
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
        k = [int(np.floor(X0)), k[1], int(np.ceil(X1)), k[3]]   # yatayda sahnenin tam genişliği (left 0, width 100 %)
        webp(im.crop(k), ad, WIDTHS[ad])
        katman[ad] = pct(k)
        manifest[ad]["canvas_box"] = k
    def katman_px(ad):
        x0, y0, x1, y1 = manifest[ad]["canvas_box"]
        return [x0, y0, x1 - x0, y1 - y0]
    webp(cl_crop, "closure", WIDTHS["closure"])
    katman["closure"] = pct(closure_box)
    katman["card"] = pct(card_box_hidden)
    stage["parts"] = katman
    stage["hinge_pct"] = round(100 * (kapak_ust - Y0) / SH, 3)                  # env_cflap döner: kubbenin tepesi
    stage["hinge_pct_of_flap"] = round(100 * (kapak_ust - katman_px("env_cflap")[1]) / max(1, katman_px("env_cflap")[3]), 3)
    stage["body_bottom_pct"] = round(100 * (env_y1 - Y0) / SH, 3)
    stage["open_hinge_pct"] = round(100 * (kapali_ust - Y0) / SH, 3)            # env_flap alt kenarı = kapalı omuz
    stage["pocket_top_pct"] = round(100 * (cep_ust - Y0) / SH, 3)
    obj = satir_kutusu(ec, esik=128)
    stage["closed_obj"] = {"box_pct": pct(obj), "aspect": round((obj[2] - obj[0]) / (obj[3] - obj[1]), 4),
                           "frac_w": round((obj[2] - obj[0]) / SW, 5), "top_frac_of_stage_w": round((obj[1] - Y0) / SW, 5),
                           "bottom_frac_of_stage_w": round((Y1 - obj[3]) / SW, 5)}
    stage["card_path"] = {"out_translate_pct": round(100 * (out_top - hidden_top) / card_h, 3),
                          "front_translate_pct": round(100 * (front_top - hidden_top) / card_h, 3),
                          "front_scale": scale_front, "pocket_top_over_card": round(cep_ust, 1),
                          "card_w_of_env": CARD_W_OF_ENV}
    stage["cuts"] = {"cflap": kb, "pocket": cep}
    stage["checks"] = {"open_layers_overlap_diff": round(fark_acik, 5), "cflap_outside_closed_px": int(fark_kapak)}
    stage["hinge_align"] = hiza_duzeltme
    manifest["stage"] = stage
    manifest["closure"].update({
        "anchor": "arch flap tip (lowest point of the curved free edge)", "anchor_px": [round(tip[0], 1), round(tip[1], 1)],
        "center_px": [round(hedef[0], 1), round(hedef[1], 1)],
        "center_pct": [round(100 * (hedef[0] - X0) / SW, 3), round(100 * (hedef[1] - Y0) / SH, 3)],
        "width_pct": katman["closure"][2], "scale": round(s, 5), "box_closure_px": [kx0, ky0, kx1, ky1],
        "measured_from": "comps/web_1_envelope.png",
        "comp": {"env_w": COMP["env_w"], "closure_h_over_env_w": round(COMP["closure_h"] / COMP["env_w"], 4),
                 "center_minus_tip_over_env_w": [round(kayma[0], 4), round(kayma[1], 4)]},
        "carried_by_flap": False, "monogram": False,
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
            bg = Image.new("RGBA", im.size, (40, 52, 110, 255)); bg.alpha_composite(im)
            bg.convert("RGB").save(oniz / f"kenar_{parca}.jpg", quality=88)
    manifest["photo_slots"] = slots

    for nm in ("invitation_card", "info_card"):
        im = Image.open(prep / f"{nm}.png").convert("RGBA")
        im, temizlik[nm] = hale_temizle(im, sert=True)
        webp(im, nm, WIDTHS[nm])
        fz = tb.serbest_bolge(im, 0.5, ornek=(.5, .56))
        manifest[nm]["free_zone"] = fz
        t, b = dilimler(fz, DUZ_BANT[nm])
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
    # geniş ekran zemini: bg_page'in iki küme arasındaki dekorsuz, ışınlı bölgesi (x 340–800, y 260–950; 2:3), bulanık —
    # sayfanın tamamı bulanıklaşınca kümeler köşe katmanlarının arkasında "hayalet" leke kalıyordu
    webp(tb.bulanik_fon(bg.crop(MIST_KUTU), (640, 960), 6), "mist", [640], 80)
    manifest["mist"]["crop"] = list(MIST_KUTU)
    # uzun sayfa zemini: bg_tile (dikişsiz kum kağıt), bg_page'in dekorsuz orta bölgesinin ortalama rengine çekilir
    tile = Image.open(PARTS / "bg_tile.png").convert("RGB").resize((640, 640), Image.LANCZOS)
    ta = np.asarray(tile).astype(np.float64)
    hedef_renk = np.asarray(bg.crop((420, 760, 760, 1060))).reshape(-1, 3).astype(np.float64).mean(0)
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
    # theme-check tablosu (scripts/lib/theme-env.ts): kartlar <img> ile otomatik; parçacık katmanı; zarf ve hero zeminindeki
    # boyalı köşe kümeleri (sayfa sonu köşeleri .page-corner kaydırılan içerik: bölümleri kendi boylarında, sayfa sonunda
    # nav'ın üstünde biter — README)
    manifest["theme_check"] = {"particles": ".accent-layer", "clusters": ".scene-bg .corner",
                               "first_screen": {"landscape": False, "names_min_px": 32}}
    tb.manifest_yaz(out, manifest)

    if oniz:
        onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl_crop, katman, stage, cs)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"sahne {stage['box']} oran {stage['ratio']} · menteşe %{stage['hinge_pct']} · kapanış {katman['closure']}")
    print(f"kapalı nesne {stage['closed_obj']}")
    print(f"kart {katman['card']} yolu {stage['card_path']}")
    for ad in ("env_closed", "env_cflap", "env_flap", "env_body", "env_pocket"):
        print(f"  {ad}: {katman[ad]}")
    for ad, sl in slots.items():
        print(f"foto alanı {ad}: box_pct {sl['box_pct']} oran {sl['aspect']} ({sl['box_px'][0]}/{sl['box_px'][1]})")
    for nm in ("invitation_card", "info_card"):
        print(f"{nm} oran {manifest[nm]['ratio']} dilimler {manifest[nm]['slices']['top_end_pct']}–"
              f"{manifest[nm]['slices']['bottom_start_pct']}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB · favicon {ikon_bilgi['bytes'] / 1024:.0f} KB · "
          f"sayfa rengi {manifest['page_color']}")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


def onizleme(oniz, ec, flap, eo, env_flap, env_body, pocket, cl_crop, katman, stage, cs):
    """Kesim önizlemeleri (gözle denetim): kapak / gövde, cep / arka, kapalı ve açık sahne (kapanış, kart yerinde)."""
    def on(im, bg):
        b = Image.new("RGBA", im.size, bg + (255,))
        b.alpha_composite(im)
        return b.convert("RGB")
    W, H = ec.size
    sheet = Image.new("RGB", (W * 4, H))
    sheet.paste(on(flap, (40, 52, 160)), (0, 0))
    gov = np.asarray(ec).copy()
    gov[..., 3] = (gov[..., 3] * (1 - np.asarray(flap)[..., 3] / 255.0)).astype(np.uint8)
    sheet.paste(on(Image.fromarray(gov, "RGBA"), (40, 140, 60)), (W, 0))
    sheet.paste(on(pocket, (40, 52, 160)), (2 * W, 0))
    sheet.paste(on(Image.alpha_composite(env_flap, env_body), (40, 140, 60)), (3 * W, 0))
    sheet.thumbnail((2400, 1000))
    sheet.save(oniz / "kesimler.jpg", quality=86)
    X0, Y0, SW, SH = stage["box"]
    k = 900 / SW

    def sahne_yap(katmanlar):
        sahne = Image.new("RGBA", (900, round(SH * k)), (238, 220, 198, 255))
        for im, p in katmanlar:
            x, y, w, h = p
            r = im.resize((max(1, round(w / 100 * 900)), max(1, round(h / 100 * SH * k))), Image.LANCZOS)
            sahne.alpha_composite(r, (round(x / 100 * 900), round(y / 100 * SH * k)))
        return sahne.convert("RGB")
    sahne_yap([(ec.crop(alfa_kutu(ec, 1)), katman["env_closed"]), (flap.crop(alfa_kutu(flap, 1)), katman["env_cflap"]),
               (cl_crop, katman["closure"])]).save(oniz / "kapali_sahne.jpg", quality=88)
    sahne_yap([(env_flap.crop(alfa_kutu(env_flap, 1)), katman["env_flap"]),
               (env_body.crop(alfa_kutu(env_body, 1)), katman["env_body"]), (cs, katman["card"]),
               (pocket.crop(alfa_kutu(pocket, 1)), katman["env_pocket"])]).save(oniz / "acik_sahne.jpg", quality=88)
    x, y, w, h = katman["card"]
    cp = stage["card_path"]["out_translate_pct"] / 100 * h
    sahne_yap([(env_flap.crop(alfa_kutu(env_flap, 1)), katman["env_flap"]),
               (env_body.crop(alfa_kutu(env_body, 1)), katman["env_body"]),
               (pocket.crop(alfa_kutu(pocket, 1)), katman["env_pocket"]), (cs, [x, y + cp, w, h])]).save(
        oniz / "kart_disarida.jpg", quality=88)


if __name__ == "__main__":
    main()
