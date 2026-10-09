"""tools/mockup_compose.py için küçük test — sahte mockup ve tasarımı geçici klasörde üretir.

  python3 tools/tests/test_mockup_compose.py

Denenenler: düz dikdörtgen, perspektifli + yuvarlak köşeli dörtgen (sanal köşe), küçük ikinci yeşil leke
(en büyük bölge seçilir), anti-alias kenar + yeşil taşması, cover/fit modları, JPG tasarım, CLI çıkış kodları.
Node + Playwright varsa `render` komutu da denenir (2000×2000, palet renkleri piksellerde).
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ARACLAR = Path(__file__).resolve().parent.parent
ARAC = ARACLAR / "mockup_compose.py"
sys.path.insert(0, str(ARACLAR))
import mockup_compose as mc  # noqa: E402

GRI = (200, 196, 190)
CEYREK = {"tl": (220, 30, 30), "tr": (30, 60, 220), "bl": (240, 200, 20), "br": (200, 40, 200)}


def dortgen_maske(h, w, q, ss=3):
    """Dışbükey dörtgen (TL, TR, BR, BL) maskesi, ss× süper örneklemeli kapsama (0..1)."""
    ys, xs = np.mgrid[0:h * ss, 0:w * ss].astype(np.float64)
    px, py = (xs + 0.5) / ss, (ys + 0.5) / ss
    ic = np.ones_like(px, bool)
    for k in range(4):
        (x0, y0), (x1, y1) = q[k], q[(k + 1) % 4]
        ic &= (x1 - x0) * (py - y0) - (y1 - y0) * (px - x0) >= 0
    return ic.reshape(h, ss, w, ss).mean(axis=(1, 3))


def yuvarlak_kose(kapsam, q, r):
    """Dörtgenin köşelerinden r px içeriyi kırp (yuvarlak köşe benzetimi)."""
    h, w = kapsam.shape
    yy, xx = np.mgrid[0:h, 0:w] + 0.5
    for (cx, cy) in q:
        kapsam[(np.abs(xx - cx) + np.abs(yy - cy)) < r] = 0
    return kapsam


def mockup(h, w, q, yuvarlak=0, leke=False, aa=True):
    m = np.empty((h, w, 3), np.float64)
    m[:] = GRI
    kap = dortgen_maske(h, w, q)
    if yuvarlak:
        kap = yuvarlak_kose(kap, q, yuvarlak)
    if not aa:
        kap = (kap >= 0.5).astype(np.float64)
    yesil = np.array([0, 255, 0], np.float64)
    m = m * (1 - kap[..., None]) + yesil * kap[..., None]
    if leke:
        m[20:40, 20:40] = (10, 250, 10)
    return Image.fromarray(np.rint(m).astype(np.uint8), "RGB"), kap


def tasarim(w=600, h=900):
    d = np.zeros((h, w, 3), np.uint8)
    d[: h // 2, : w // 2] = CEYREK["tl"]
    d[: h // 2, w // 2:] = CEYREK["tr"]
    d[h // 2:, : w // 2] = CEYREK["bl"]
    d[h // 2:, w // 2:] = CEYREK["br"]
    return Image.fromarray(d, "RGB")


def yakin(a, b, tol=40):
    return all(abs(int(x) - int(y)) <= tol for x, y in zip(a, b))


def ic_nokta(q, s, t):
    """Dörtgende (s, t) ∈ [0,1]² iki doğrusal nokta (perspektif için yaklaşık; merkezden uzak değil)."""
    q = np.asarray(q, float)
    ust = q[0] + (q[1] - q[0]) * s
    alt = q[3] + (q[2] - q[3]) * s
    p = ust + (alt - ust) * t
    return int(p[1]), int(p[0])


def yesil_artik(arr, kap):
    """Bölge + çevresinde hâlâ yeşil baskın piksel sayısı."""
    a = arr.astype(np.int16)
    yesillik = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
    return int((yesillik > 30).sum())


def kontrol_ceyrekler(arr, q):
    for (s, t), ad in (((0.2, 0.2), "tl"), ((0.8, 0.2), "tr"), ((0.2, 0.8), "bl"), ((0.8, 0.8), "br")):
        y, x = ic_nokta(q, s, t)
        assert yakin(arr[y, x], CEYREK[ad]), (ad, arr[y, x].tolist())


def test_duz(t: Path):
    q = [(300, 300), (720, 300), (720, 1200), (300, 1200)]
    m, kap = mockup(1536, 1024, q, aa=False)
    out, bilgi = mc.birlestir(m, tasarim(420, 900), "cover")
    for (x, y), (ex, ey) in zip(bilgi["kose"], q):
        assert abs(x - ex) <= 1.5 and abs(y - ey) <= 1.5, bilgi["kose"]
    arr = np.asarray(out)
    kontrol_ceyrekler(arr, q)
    assert yesil_artik(arr, kap) == 0
    assert tuple(arr[100, 100]) == GRI and tuple(arr[1400, 900]) == GRI  # dışarı dokunulmadı


def test_perspektif_yuvarlak_leke(t: Path):
    q = [(260, 210), (790, 260), (760, 1290), (230, 1240)]
    m, kap = mockup(1536, 1024, q, yuvarlak=40, leke=True)
    out, bilgi = mc.birlestir(m, tasarim(), "cover")
    for (x, y), (ex, ey) in zip(bilgi["kose"], q):  # yuvarlak köşede bile sanal köşe
        assert abs(x - ex) <= 4 and abs(y - ey) <= 4, bilgi["kose"]
    assert bilgi["atlanan_yesil_piksel"] == 400, bilgi
    arr = np.asarray(out)
    kontrol_ceyrekler(arr, q)
    # küçük leke en büyük bölge değil: olduğu gibi kalır
    assert yakin(arr[30, 30], (10, 250, 10), 5)
    arr2 = arr.copy()
    arr2[20:40, 20:40] = GRI
    assert yesil_artik(arr2, kap) == 0, yesil_artik(arr2, kap)
    # kenar yumuşak: bölge sınırına dik kesitte ara değerler var
    y = 750
    satir = arr[y, 180:300].astype(int)
    farkli = {tuple(p) for p in satir}
    assert len(farkli) > 3


def test_fit_ve_cli(t: Path):
    q = [(100, 100), (500, 100), (500, 500), (100, 500)]  # kare alan
    m, _ = mockup(600, 600, q, aa=False)
    mp, dp, op = t / "m.png", t / "d.jpg", t / "o.png"
    m.save(mp)
    tasarim(300, 600).save(dp, quality=95)  # dikey tasarım kare alana: fit → yanlarda zemin
    r = subprocess.run([sys.executable, str(ARAC), str(mp), str(dp), str(op), "--mode", "fit", "--bg", "#102030",
                        "--json"], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    bilgi = json.loads(r.stdout)
    assert bilgi["mod"] == "fit" and abs(bilgi["oran"] - 1) < 0.01
    arr = np.asarray(Image.open(op).convert("RGB"))
    assert yakin(arr[300, 130], (16, 32, 48), 12), arr[300, 130]   # sol boşluk zemin rengi
    assert yakin(arr[300, 470], (16, 32, 48), 12)
    assert yakin(arr[200, 250], CEYREK["tl"]) and yakin(arr[400, 350], CEYREK["br"])
    # cover: tüm kare tasarımla dolu (kenarda zemin yok)
    r = subprocess.run([sys.executable, str(ARAC), str(mp), str(dp), str(op)], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    arr = np.asarray(Image.open(op).convert("RGB"))
    assert yakin(arr[150, 110], CEYREK["tl"]) and yakin(arr[450, 490], CEYREK["br"])
    # yeşil yok → çıkış 1
    Image.new("RGB", (200, 200), GRI).save(mp)
    r = subprocess.run([sys.executable, str(ARAC), str(mp), str(dp), str(op)], capture_output=True, text=True)
    assert r.returncode == 1 and "bulunamadı" in r.stderr


def test_render(t: Path):
    sys.path.insert(0, str(ARACLAR))
    import md_to_pdf as m2p
    if not m2p.playwright_hazir():
        print("  render: node/Playwright yok — atlandı")
        return
    palet = {"name": "Test Palette", "ink": "#203040", "deep": "#405060", "primary": "#6080A0",
             "mist_top": "#E0E8F0", "mist_bottom": "#C0D0E0", "gold": "#B09060", "gold_light": "#D8C8A0",
             "ivory": "#FBF7EF", "leaf": "#90A090"}
    pp = t / "palette.json"
    pp.write_text(json.dumps(palet))
    r = subprocess.run([sys.executable, str(ARAC), "render", str(pp), str(t / "out"), "--no-fonts"],
                       capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    for ad in mc.SABLONLAR:
        im = Image.open(t / "out" / f"{ad}.png").convert("RGB")
        assert im.size == (2000, 2000), (ad, im.size)
        arr = np.asarray(im).reshape(-1, 3)
        # palet rengi gerçekten kullanılmış: zemin (mist_top) köşede, altın vurgu piksellerde
        assert yakin(np.asarray(im)[4, 4], (0xE0, 0xE8, 0xF0), 18), (ad, np.asarray(im)[4, 4])
        gold = np.array([0xB0, 0x90, 0x60])
        assert (np.abs(arr.astype(int) - gold).max(1) <= 10).sum() > 500, ad
    html = (mc.SABLON_DIR / "whats_included.html").read_text()
    assert "{{collection_name}}" in html


def main():
    with tempfile.TemporaryDirectory() as t:
        t = Path(t)
        for test in (test_duz, test_perspektif_yuvarlak_leke, test_fit_ve_cli, test_render):
            test(t)
            print(f"  {test.__name__}: tamam")
    print("test_mockup_compose: tamam")


if __name__ == "__main__":
    main()
