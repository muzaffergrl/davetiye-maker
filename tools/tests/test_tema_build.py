"""tools/tema_build.py testleri — sahte görseller kod içinde üretilir (repoya ikili dosya girmez).

  python3 tools/tests/test_tema_build.py            # hepsi (03 yeniden üretimi dahil, ~35 s)
  python3 tools/tests/test_tema_build.py --hizli    # 03 yeniden üretimi hariç

Her kesim iki kez denenir: kenarı okunur sahte parça (yöntem "renk"/"alfa", kenar bilinen geometriye ±3 px) ve kenarı
okunmayan parça (açık uyarı + geometrik yedek, kesim yine boş değil). Ayrıca: kesilen parçalar birleşince kaynak
(ortusme ≤ 0,01), hiza ölçümü (tamam / uyarı / hata, aynı ve farklı tuval, kapı/kitap kenarları, sarılı kapanış uçları),
og kırpımı, ikon, bileşen ayırma. Son adım: 03 teması `--out` ile geçici klasöre yeniden üretilir ve tema `img/`'si ile
bayt bayt karşılaştırılır (bütün webp/png/jpg + manifest.json).
"""
import filecmp
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ARACLAR = Path(__file__).resolve().parent.parent
ROOT = ARACLAR.parent
sys.dont_write_bytecode = True
sys.path.insert(0, str(ARACLAR))
import tema_build as tb  # noqa: E402

RNG = np.random.default_rng(54)
KAGIT = np.array([226, 196, 192], float)


def tuval(w, h):
    return np.zeros((h, w, 4), float)


def gurultu(a, m, s=3.0):
    a[..., :3][m] += RNG.normal(0, s, (int(m.sum()), 3))


def bitir(a) -> Image.Image:
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGBA")


def desen(h, w, c1, c2, blok=10):
    yy, xx = np.mgrid[0:h, 0:w]
    m = ((yy // blok + xx // blok) % 2 == 0)[..., None]
    return np.where(m, np.array(c1, float), np.array(c2, float))


def yakin(a, b, tol, ad):
    assert abs(a - b) <= tol, f"{ad}: {a} ≠ {b} (±{tol})"


# ----------------------------------------------------------------------------- kapak (kapalı zarf)

def kapali_zarf(bicim, kenar_var=True):
    W, H, x0, x1, y0, y1 = 640, 560, 60, 580, 100, 500
    a = tuval(W, H)
    xs = np.arange(W)
    u = (xs - 320) / 260
    e = (104 + 240 * (1 - np.abs(u))) if bicim == "v" else (104 + 230 * np.sqrt(np.clip(1 - u * u, 0, 1)))
    a[y0:y1, x0:x1] = [*KAGIT, 255]
    yy = np.arange(H)[:, None]
    kapak = (yy < e[None, :]) & (a[..., 3] > 0)
    if kenar_var:
        a[..., :3][kapak] += 6
        for x in range(x0, x1):
            ex = int(round(e[x]))
            if ex - 3 > y0:
                a[ex - 3:ex, x, :3] = (248, 228, 224)
                for k in range(6):
                    a[ex + k, x, :3] = KAGIT - (36 - 6 * k)
    gurultu(a, a[..., 3] > 0)
    return bitir(a), e


def test_kapak():
    for bicim in ("v", "egri"):
        im, e = kapali_zarf(bicim)
        flap, b = tb.kapak_kes(im, bicim)
        assert b["method"] == "renk" and "warnings" not in b, (bicim, b)
        fa = np.asarray(flap)[..., 3]
        for x in (90, 160, 250, 320, 390, 480, 550):
            ex = int(round(e[x]))
            if ex - 4 <= 100:
                continue
            assert fa[ex - 4, x] == 255, (bicim, x, "kapak kenarın üstünde dolu olmalı")
            assert ex + 3 >= fa.shape[0] or fa[ex + 3, x] == 0, (bicim, x, "kapak kenarın altında boş olmalı")
        yakin(b["tip"][1], e.max(), 3, f"{bicim} uç")
        yakin(b["hinge_row"], 100, 1, f"{bicim} menteşe")
        assert tb.ortusme(im, [im, np.pad(fa, ((0, im.height - fa.shape[0]), (0, 0)))]) <= 0.01
        # kenarı okunmayan kapak → açık uyarı + geometrik yedek
        im2, _ = kapali_zarf(bicim, kenar_var=False)
        flap2, b2 = tb.kapak_kes(im2, bicim)
        assert b2["method"] == "geometrik" and b2["warnings"], b2
        assert "bulunamadı" in b2["warnings"][0] and np.asarray(flap2)[..., 3].sum() > 0
    print("  kapak_kes: V + eğri, yedek")


# ----------------------------------------------------------------------------- ön cep

def acik_zarf(bicim, kenar_var=True, serit=3):
    W, H, x0, x1, bt, yb = 640, 900, 60, 580, 400, 820
    a = tuval(W, H)
    xs = np.arange(W)
    u = (xs - 320) / 260
    p = {"v": 430 + 230 * (1 - np.abs(u)), "duz": np.full(W, 640.0), "egri": 600 + 40 * (1 - u * u)}[bicim]
    yy, xx = np.mgrid[0:H, 0:W]
    ucgen = (yy >= 120) & (yy < bt) & (np.abs(xx - 320) <= 260 * (yy - 120) / (bt - 120))
    govde = (yy >= bt) & (yy < yb) & (xx >= x0) & (xx < x1)
    sekil = ucgen | govde
    astar = desen(H, W, (240, 220, 215), (120, 150, 110)) if kenar_var else np.broadcast_to(KAGIT, (H, W, 3))
    a[..., :3] = np.where(sekil[..., None], astar, 0)
    a[..., 3] = sekil * 255
    cep = govde & (yy >= p[None, :])
    a[..., :3][cep] = KAGIT
    if kenar_var and serit:
        bant = cep & (yy < p[None, :] + serit)
        a[..., :3][bant] = (250, 232, 228)
    gurultu(a, sekil)
    return bitir(a), p


def test_cep():
    for bicim in ("v", "duz", "egri"):
        im, p = acik_zarf(bicim)
        cep, b = tb.cep_kes(im, bicim)
        assert b["method"] == "renk" and "warnings" not in b, (bicim, b)
        ca = np.asarray(cep)[..., 3]
        for x in (100, 200, 320, 440, 540):
            px = int(round(p[x]))
            assert ca[px + 4, x] == 255, (bicim, x, px, "cep kenarın altında dolu olmalı")
            assert ca[px - 5, x] == 0, (bicim, x, px, "cep kenarın üstünde boş olmalı")
        if bicim == "v":
            yakin(b["tip"][1], 660 + 3, 3, "V cep ucu (G035 kenarı açık şeridin altında bulur, kesim 2 px yukarıda)")
        else:
            yakin(b["edge_left_mid_right"][1][1], p[320], 1.5, f"{bicim} cep ortası")
            assert b["edge_band_offset"] == -2, b  # 3 satırlık açık kesik şeridi cebe dahil
            for x in (100, 320, 540):
                px = int(np.ceil(p[x]))
                assert ca[px + 1, x] == 255 and ca[px - 2, x] == 0, (bicim, x, "şerit cepte, astar dışarıda")
        if bicim == "duz":  # 1 px kenar çizgisi (ofset 0) ve şeritsiz kenar (ofset +1): ilk cep satırı yine p
            for serit, ofset in ((1, 0), (0, 1)):
                im3, p3 = acik_zarf(bicim, serit=serit)
                c3, b3 = tb.cep_kes(im3, bicim)
                a3 = np.asarray(c3)[..., 3]
                assert b3["edge_band_offset"] == ofset, (serit, b3)
                assert a3[640, 320] == 255 and a3[639, 320] == 0, (serit, a3[636:644, 320])
        im2, _ = acik_zarf(bicim, kenar_var=False)
        cep2, b2 = tb.cep_kes(im2, bicim)
        assert b2["method"] == "geometrik" and b2["warnings"] and "bulunamadı" in b2["warnings"][0], b2
        assert np.asarray(cep2)[..., 3].sum() > 0
    print("  cep_kes: V + düz + eğri, yedek")


def test_saglam():
    """Gerçek GPT parçasına yakın bozukluklar çökme değil, uyarı vermeli: ≥ 2° eğik gövde (hiçbir satır sütun açıklığının
    %97'sine ulaşmaz), gövdenin yanında ayrı bir yaprak, RGB (alfasız) girdi."""
    for bicim in ("v", "duz", "egri"):
        im, p = acik_zarf(bicim)
        for aci in (2.0, 3.0):
            cep, b = tb.cep_kes(im.rotate(aci, resample=Image.BICUBIC), bicim)
            assert b["method"] in ("renk", "geometrik") and np.asarray(cep)[..., 3].sum() > 0, (bicim, aci, b)
            if aci == 3.0:
                assert any("gövde üstü" in u for u in b["warnings"]), (bicim, b)
        a = np.asarray(im).copy()
        a[600:660, 0:40] = [200, 100, 120, 255]  # gövdenin 20 px solunda ayrı yaprak
        cep, b = tb.cep_kes(Image.fromarray(a, "RGBA"), bicim)
        assert any("gövde üstü" in u for u in b["warnings"]), (bicim, b)
        assert b["body"][0] == 60 and b["body"][2] == 579, (bicim, b["body"])
        ca = np.asarray(cep)[..., 3]
        px = int(round(p[320]))
        assert ca[px + 4, 320] == 255 and ca[px - 5, 320] == 0, (bicim, "yaprak kenar bulmayı bozmamalı")
        cep, b = tb.cep_kes(im.convert("RGB"), bicim)
        assert cep.mode == "RGBA" and b["method"] in ("renk", "geometrik"), (bicim, b)
    k, o = gatefold()
    parcalar, b = tb.kapi_kes(k, o.rotate(3.0, resample=Image.BICUBIC))
    assert set(parcalar) >= {"door_l", "door_r", "center", "pocket"} and b["method"] in ("renk", "geometrik"), b
    for bicim in ("v", "egri"):
        im, _ = kapali_zarf(bicim)
        flap, b = tb.kapak_kes(im.convert("RGB"), bicim)
        assert flap.mode == "RGBA" and b["method"] in ("renk", "geometrik"), b
    assert len(tb.bilesenler(Image.new("RGB", (60, 40), (200, 120, 130)), n=2, min_px=10)) == 1
    print("  sağlamlık: 2–3° eğik gövde, yanında yaprak, RGB girdi → uyarı, çökme yok")


# ----------------------------------------------------------------------------- gatefold

def gatefold(dikis_var=True, kat_var=True):
    W, H = 900, 600
    k = tuval(W, H)
    k[60:540, 300:600] = [30, 40, 70, 255]
    if dikis_var:
        k[60:540, 449:451, :3] = (8, 10, 22)
    gurultu(k, k[..., 3] > 0, 2)
    o = tuval(W, H)
    o[60:540, 40:860, 3] = 255
    o[60:540, 40:860, :3] = desen(480, 820, (40, 50, 90), (60, 70, 110), 14)
    o[60:540, 300:600, :3] = (232, 220, 196)
    if kat_var:
        o[60:540, 300, :3] = (12, 12, 20)
        o[60:540, 599, :3] = (12, 12, 20)
    o[380:540, 300:600, :3] = (30, 40, 70)
    o[380:383, 300:600, :3] = (212, 175, 90)
    gurultu(o, o[..., 3] > 0, 2)
    return bitir(k), bitir(o)


def test_kapi():
    k, o = gatefold()
    d = tb.dikis_bul(k)
    assert d["method"] == "renk", d
    yakin(d["x"], 450, 1.5, "dikiş")
    parcalar, b = tb.kapi_kes(k, o, d)
    assert b["method"] == "renk" and "warnings" not in b, b
    yakin(b["folds"][0], 300.5, 1.5, "sol kat")
    yakin(b["folds"][1], 599.5, 1.5, "sağ kat")
    assert tb.ortusme(k, [parcalar["door_l"], parcalar["door_r"]]) <= 0.01
    assert tb.ortusme(o, [parcalar["door_l_in"], parcalar["center"], parcalar["door_r_in"]]) <= 0.01
    ca = np.asarray(parcalar["pocket"])[..., 3]
    assert ca[380, 450] == 255 and ca[378, 450] == 0, "orta cep: 3 px altın kenar çizgisi cepte, panel dışarıda"
    assert b["pocket"]["edge_band_offset"] == -2, b["pocket"]
    assert np.asarray(parcalar["door_l"])[..., 3][:, 452:].max() == 0
    hz = tb.hiza_olc(k, o, "kapi")
    assert hz["durum"] == "tamam", tb.hiza_ozet(hz)
    assert [e["kenar"] for e in hz["kenarlar"]] == ["üst", "alt", "sol kat", "sağ kat"], hz
    # dikiş ve katlanma çizgisi okunmuyor → kutu ortası / kapalı kenar + uyarı
    k2, o2 = gatefold(dikis_var=False, kat_var=False)
    d2 = tb.dikis_bul(k2)
    assert d2["method"] == "geometrik" and d2["warnings"] and d2["x"] == 450, d2
    _, b2 = tb.kapi_kes(k2, o2, d2)
    assert b2["method"] == "geometrik" and len(b2["warnings"]) >= 1, b2
    # kat çizgisi yoksa da renk geçişi (astar ↔ orta panel) katlanma yerini verir
    yakin(b2["folds"][0], 300, 1.5, "geçişten sol kat")
    print("  dikis_bul + kapi_kes: dikiş, katlar, orta cep, yedek")


# ----------------------------------------------------------------------------- kitap

def kitap(oluk_var=True):
    W, H = 900, 600
    k = tuval(W, H)
    k[50:550, 450:846] = [40, 80, 50, 255]
    gurultu(k, k[..., 3] > 0, 2)
    o = tuval(W, H)
    o[50:550, 54:846, 3] = 255
    if oluk_var:
        o[50:550, 54:450, :3] = desen(500, 396, (200, 180, 120), (170, 150, 100), 16)
        o[50:550, 450:846, :3] = (240, 232, 210)
        o[50:550, 448:452, :3] = (60, 50, 40)
    else:
        o[50:550, 54:846, :3] = (240, 232, 210)
    gurultu(o, o[..., 3] > 0, 2)
    return bitir(k), bitir(o)


def test_kitap():
    k, o = kitap()
    parcalar, b = tb.kitap_kes(k, o)
    assert b["method"] == "renk", b
    yakin(b["spine"], 450, 1.5, "sırt")
    assert b["page_box"][2] == 846 and b["page_box"][1] == 50, b
    assert tb.ortusme(o, [parcalar["cover_in"], parcalar["page"]]) <= 0.01
    hz = tb.hiza_olc(k, o, "kitap")
    assert hz["durum"] == "tamam", tb.hiza_ozet(hz)
    k2, o2 = kitap(oluk_var=False)
    _, b2 = tb.kitap_kes(k2, o2)
    assert b2["method"] == "geometrik" and b2["warnings"] and b2["spine"] == 450, b2
    print("  kitap_kes: sırt/oluk, yedek")


# ----------------------------------------------------------------------------- kese

def kese(yay_var=True):
    W, H = 600, 900
    a = tuval(W, H)
    yy, xx = np.mgrid[0:H, 0:W]
    u = (xx - 300) / 180
    elips = (u * u + ((yy - 260) / 70) ** 2) <= 1
    govde = (yy >= 260) & (yy < 820) & (np.abs(xx - 300) < 180)
    sekil = elips | govde
    krem = np.array([238, 232, 218], float)
    a[..., 3] = sekil * 255
    a[..., :3] = krem
    yay = 260 + 70 * np.sqrt(np.clip(1 - ((np.arange(W) - 300) / 180) ** 2, 0, 1))
    ic = elips & (yy < yay[None, :])
    if yay_var:
        a[..., :3][ic] = desen(H, W, (170, 150, 200), (150, 130, 185), 8)[ic]
        serit = govde & ~ic & (yy < yay[None, :] + 3) & (yy >= yay[None, :])
        a[..., :3][serit] = (252, 248, 236)
    gurultu(a, sekil)
    return bitir(a), yay


def test_kese():
    im, yay = kese()
    parcalar, b = tb.kese_kes(im)
    assert b["method"] == "renk" and "warnings" not in b, b
    fa = np.asarray(parcalar["pouch_front"])[..., 3]
    for x in (180, 240, 300, 360, 420):
        y = int(np.ceil(yay[x]))   # ağız kenarı şeridinin ilk satırı
        assert fa[y + 1, x] == 255, (x, y, "ağız kenarı şeridi ön duvarda")
        assert fa[y - 3, x] == 0, (x, y, "astar ön duvarda değil")
    yakin(b["rim_left_mid_right"][1][1], yay[300], 3, "yay ortası")
    assert np.array_equal(np.asarray(parcalar["pouch_back"]), np.asarray(im))
    im2, _ = kese(yay_var=False)
    p2, b2 = tb.kese_kes(im2)
    assert b2["method"] == "geometrik" and b2["warnings"] and "bulunamadı" in b2["warnings"][0], b2
    assert np.asarray(p2["pouch_front"])[..., 3].sum() > 0
    print("  kese_kes: ağız yayı, yedek")


# ----------------------------------------------------------------------------- kılıf şeridi, yırtma şeridi

def kilif(acik_fark=True):
    W, H = 600, 900
    k = tuval(W, H)
    k[200:800, 150:450] = [245, 245, 240, 215]
    o = k.copy()
    if acik_fark:
        o[190:250] = 0
        for y in range(190, 250):
            f = (y - 190) / 60
            o[y, int(140 + 10 * f):int(460 - 10 * f)] = [245, 245, 240, 215]
    return bitir(k), bitir(o)


def test_kilif_serit():
    k, o = kilif()
    p, b = tb.kilif_serit(k, o)
    assert b["method"] == "alfa" and "warnings" not in b, b
    assert 250 <= b["cut_row"] <= 262, b
    sb, bd = np.asarray(p["sleeve_band"])[..., 3], np.asarray(p["sleeve_body"])[..., 3]
    assert sb[220, 300] == 215 and sb[300, 300] == 0 and bd[300, 300] == 215 and bd[220, 300] == 0
    assert tb.ortusme(k, [p["sleeve_band"], p["sleeve_body"]]) <= 0.01
    assert np.asarray(p["sleeve_open_band"])[..., 3][195, 145] == 215
    k2, o2 = kilif(acik_fark=False)
    _, b2 = tb.kilif_serit(k2, o2)
    assert b2["method"] == "geometrik" and b2["warnings"] and b2["cut_row"] == 290, b2
    print("  kilif_serit: üst şerit, yedek")


def test_serit_farki():
    k = tuval(600, 900)
    k[300:700, 100:500] = [*KAGIT, 255]
    gurultu(k, k[..., 3] > 0)
    o = k.copy()
    o[300:330, :, 3] = 0
    p, b = tb.serit_farki(bitir(k), bitir(o))
    sx0, sy0, sx1, sy1 = b["strip_box"]
    yakin(sy0, 300, 2, "şerit üst")
    yakin(sy1, 330, 2, "şerit alt")
    assert "warnings" not in b
    _, b2 = tb.serit_farki(bitir(k), bitir(k))
    assert b2["warnings"], b2
    print("  serit_farki: 04 yırtma şeridi, uyarı")


# ----------------------------------------------------------------------------- hiza

def kapak_cifti(kaydir=0, W=1024, H=1536, govde=(100, 500, 924, 1300)):
    x0, y0, x1, y1 = govde
    k = tuval(W, H)
    k[y0:y1, x0:x1] = [*KAGIT, 255]
    o = tuval(W, H)
    yy, xx = np.mgrid[0:H, 0:W]
    ucgen = (yy >= y0 - 240) & (yy < y0) & (np.abs(xx - (x0 + x1) / 2) <= (x1 - x0) / 2 * (yy - (y0 - 240)) / 240)
    o[ucgen] = [240, 220, 215, 255]
    o[y0:y1, x0:x1] = [*KAGIT, 255]
    if kaydir:
        o = np.roll(o, kaydir, axis=1)
    return bitir(k), bitir(o)


def test_hiza():
    k, o = kapak_cifti()
    s = tb.hiza_olc(k, o, "kapak")
    assert s["durum"] == "tamam" and s["yontem"] == "tuval", s
    assert [e["kenar"] for e in s["kenarlar"]] == ["sol", "sağ", "alt"]
    assert all(e["fark_px"] == 0 for e in s["kenarlar"])
    s = tb.hiza_olc(*kapak_cifti(24), "kapak")          # 24/1024 = %2,34
    assert s["durum"] == "uyari" and s["kenarlar"][0]["fark_pct"] == 2.34, tb.hiza_ozet(s)
    s = tb.hiza_olc(*kapak_cifti(50), "kese")           # %4,88
    assert s["durum"] == "hata", tb.hiza_ozet(s)
    # GPT farklı piksel ölçüsünde kaydetti (1254×1881 ≈ 1024×1536 oranı): Kaydet tuvaline göre ölçülür
    k2, o2 = kapak_cifti()
    o2 = o2.resize((1254, 1881), Image.LANCZOS)
    s = tb.hiza_olc(k2, o2, "kapak", (1024, 1536), (1024, 1536))
    assert s["durum"] == "tamam", tb.hiza_ozet(s)
    # farklı Kaydet tuvali (03: kapalı 1024×1024, açık 1024×1536) → ölçekli; aynı oranlı gövde → ~0
    kk = tuval(1024, 1024)
    kk[200:840, 100:924] = [*KAGIT, 255]       # 824×640
    _, oo = kapak_cifti(govde=(100, 660, 924, 1300))
    s = tb.hiza_olc(bitir(kk), oo, "kapak", (1024, 1024), (1024, 1536))
    assert s["yontem"] == "olcekli" and s["uyarilar"] and abs(s["kenarlar"][0]["fark_pct"]) < 0.3, s
    kk[600:840, 100:924, 3] = 0                 # kapalı gövde kısaldı (640 → 400 px): oran farkı büyük ama farklı tuval → en çok uyarı
    s = tb.hiza_olc(bitir(kk), oo, "kapak", (1024, 1024), (1024, 1536))
    assert s["durum"] == "uyari" and s["kenarlar"][0]["fark_pct"] > 4, s
    # sarılı kapanış: yatay kurdele zarfın iki kenarında bitiyor → tamam; kısa kurdele → hata
    for bas, son, beklenen in ((100, 924, "tamam"), (160, 864, "hata")):
        c = tuval(1024, 1536)
        c[850:950, bas:son] = [180, 60, 80, 255]
        c[800:1000, 450:574] = [170, 50, 70, 255]
        s = tb.hiza_olc(k, o, "kapak", kapanis=bitir(c))
        kp = s["kapanis"]
        assert kp["eksen"] == ["yatay"] and kp["kenarlar"][0]["kenar"] == "kapanış sol uç", kp
        assert s["durum"] == beklenen, tb.hiza_ozet(s)
    print("  hiza_olc: tamam/uyarı/hata, Kaydet ölçeği, ölçekli (03), sarılı kapanış")


# ----------------------------------------------------------------------------- og, ikon, bileşenler, birleşim

def test_og_ikon_bilesen():
    src = np.zeros((1024, 1536, 3), np.uint8)
    src[..., 0] = np.linspace(0, 255, 1024)[:, None]
    og, b = tb.og_kirp(Image.fromarray(src))
    assert og.size == (1200, 630) and b["crop"] == [0, 218, 1536, 806] and b["align"] == "alt", b
    assert np.asarray(og)[-1, :, 0].mean() > 250 and np.asarray(og)[0, :, 0].mean() > 50
    _, b = tb.og_kirp(Image.fromarray(src), hiza="ust")
    assert b["crop"][1] == 0
    _, b = tb.og_kirp(Image.new("RGB", (2000, 600)))
    assert b["crop"] == [428, 0, 1143, 600], b
    with tempfile.TemporaryDirectory() as t:
        n = tb.og_kaydet(og, Path(t) / "og.jpg")
        im = Image.open(Path(t) / "og.jpg")
        assert im.format == "JPEG" and im.size == (1200, 630) and n > 0 and "exif" not in im.info
    a = tuval(600, 600)
    a[200:400, 100:500] = [200, 120, 130, 255]
    ik, b = tb.ikon(bitir(a))
    ia = np.asarray(ik)
    assert ik.size == (180, 180) and ik.mode == "RGBA" and ia[0, 0, 3] == 0 and ia[90, 90, 3] == 255, b
    assert b["src_box"] == [100, 200, 400, 200]
    assert ia[90, 3, 3] == 0 and ia[90, 12, 3] == 255, "kenarda %4 şeffaf pay"
    a = tuval(500, 300)
    a[20:80, 20:120, 3] = 255
    a[150:280, 300:480, 3] = 255
    parcalar = tb.bilesenler(bitir(a), n=6)
    assert [p.size for p in parcalar] == [(112, 72), (192, 142)], [p.size for p in parcalar]
    k = np.full((10, 10), 255, np.uint8)
    assert tb.ortusme(k, [k[:, :]]) == 0
    yarim = k.copy()
    yarim[:, 5:] = 0
    assert abs(tb.ortusme(k, [yarim]) - 0.5) < 1e-9
    assert tb.zarf_tipi_basliktan("W2.3 Kapalı zarf (gatefold, iki kapı) — kapanış elemanı OLMADAN") == "kapi"
    assert tb.zarf_tipi_basliktan("W2.3 Kapalı zarf (kitap kapağı) — x") == "kitap"
    assert tb.zarf_tipi_basliktan("W2.3 Kapalı zarf — kapanış elemanı OLMADAN") == "kapak"
    print("  og_kirp, og_kaydet, ikon, bilesenler, ortusme, zarf_tipi_basliktan")


# ----------------------------------------------------------------------------- 03 yeniden üretimi

def test_03_yeniden():
    tema = ROOT / "platform/themes/blush-garden-rose"
    with tempfile.TemporaryDirectory(prefix="g054-03-") as t:
        out = Path(t) / "img"
        r = subprocess.run([sys.executable, "-B", str(tema / "build_images.py"), "--out", str(out)], cwd=ROOT,
                           capture_output=True, text=True)
        assert r.returncode == 0, r.stdout[-2000:] + r.stderr[-2000:]
        ref = sorted(p.name for p in (tema / "img").iterdir())
        yeni = sorted(p.name for p in out.iterdir())
        assert ref == yeni, (set(ref) ^ set(yeni))
        _, farkli, hata = filecmp.cmpfiles(tema / "img", out, ref, shallow=False)
        assert not farkli and not hata, (farkli, hata)
    boyut = tb.klasor_boyutu(tema)
    assert boyut <= tb.TEMA_BUTCE, boyut
    og = Image.open(tema / "img/og-1200x630.jpg")
    fav = Image.open(tema / "img/favicon.png")
    assert og.size == (1200, 630) and og.format == "JPEG" and fav.size == (180, 180) and fav.mode == "RGBA"
    print(f"  03 yeniden üretimi: {len(ref)} dosya bayt bayt aynı; tema klasörü {boyut / 1e6:.2f} MB ≤ 3 MB")


def main():
    test_kapak()
    test_cep()
    test_saglam()
    test_kapi()
    test_kitap()
    test_kese()
    test_kilif_serit()
    test_serit_farki()
    test_hiza()
    test_og_ikon_bilesen()
    if "--hizli" not in sys.argv:
        test_03_yeniden()
    print("test_tema_build: tamam")


if __name__ == "__main__":
    main()
