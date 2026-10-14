"""tools/listing_v2 (G067) ve mockup_compose çok-ekran yardımcıları için testler.

  python3 tools/tests/test_listing_v2.py

Denenenler:
- mockup_compose.yesil_bolgeler: bütün yeşil bölgeler, soldan sağa; %1'den küçük leke atlanır.
- mockup_compose.birlestir_cok: üç ekranlı sahnede her tasarım kendi bölgesine, soldan sağa sırayla (bölgeler farklı
  boyda ve yukarıdan aşağıya ters sırada dizili olsa da); bölge/tasarım sayısı tutmazsa ValueError; tek bölgede
  `birlestir` ile aynı sonuç (eski davranış değişmedi); yeşil kalmaz.
- kompozit: ekranlari_oturt sırası + sahne ölçüsü korunur; yerlestir 2000 × 2000 verir ve sahne dışındaki şeridi
  uzatır (sahne alanı aynen kalır); ekran yüksekliği yeşil alanın biçiminden.
- build: şablon doldurma (eksik yer tutucu hata), 4:3 orta kırpım, her görselin metin listesi.
- Kurulmuşsa çıktılar: collections/0{1,3}_*/package/listing_v2/ içinde 4 görsel 2000 × 2000, yeşil piksel yok,
  preview_thumbs.png var.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

TOOLS = Path(__file__).resolve().parent.parent
REPO = TOOLS.parent
sys.path.insert(0, str(TOOLS))
sys.path.insert(0, str(TOOLS / "listing_v2"))
import build as lb  # noqa: E402
import kompozit as kz  # noqa: E402
import mockup_compose as mc  # noqa: E402

GRI = (200, 196, 190)
RENKLER = [(220, 30, 30), (30, 60, 220), (240, 200, 20)]


def sahne(boyut=(900, 600), kutular=(), leke=None):
    """Gri zemin + düz #00FF00 dikdörtgen ekranlar (x0, y0, x1, y1)."""
    a = np.empty((boyut[1], boyut[0], 3), np.uint8)
    a[:] = GRI
    for x0, y0, x1, y1 in kutular:
        a[y0:y1, x0:x1] = (0, 255, 0)
    if leke:
        x0, y0, x1, y1 = leke
        a[y0:y1, x0:x1] = (5, 250, 20)
    return Image.fromarray(a, "RGB")


def duz(renk, w=120, h=260):
    return Image.new("RGB", (w, h), renk)


def merkez_rengi(img, kutu):
    x0, y0, x1, y1 = kutu
    return tuple(int(v) for v in np.asarray(img)[(y0 + y1) // 2, (x0 + x1) // 2])


def yakin(a, b, tol=12):
    return all(abs(x - y) <= tol for x, y in zip(a, b))


# Sıra testi için bilerek karışık: ortadaki en büyük ve en üstte, sağdaki en aşağıda, soldaki ortada.
KUTULAR = [(60, 160, 200, 460), (330, 60, 560, 560), (680, 220, 820, 520)]


def test_yesil_bolgeler():
    img = sahne(kutular=[KUTULAR[2], KUTULAR[0], KUTULAR[1]], leke=(860, 10, 880, 30))  # leke: %0,07
    ham = mc.yesil_maske(np.asarray(img), 40)
    bol = mc.yesil_bolgeler(ham, 0.01)
    assert len(bol) == 3, len(bol)
    xs = [np.nonzero(b)[1].min() for b in bol]
    assert xs == sorted(xs) == [k[0] for k in KUTULAR], xs
    assert mc.yesil_bolgeler(np.zeros((10, 10), bool)) == []
    # eşik: %1'in altı atlanır, üstü alınır
    assert len(mc.yesil_bolgeler(ham, 0.0001)) == 4


def test_birlestir_cok_sira():
    img = sahne(kutular=KUTULAR)
    out, bilgi = mc.birlestir_cok(img, [duz(r) for r in RENKLER], feather=1.0)
    assert out.size == img.size
    assert [b["sira"] for b in bilgi] == [0, 1, 2]
    for kutu, renk in zip(KUTULAR, RENKLER):
        assert yakin(merkez_rengi(out, kutu), renk), (kutu, merkez_rengi(out, kutu), renk)
    # köşeler sırayla soldan sağa
    assert bilgi[0]["kose"][0][0] < bilgi[1]["kose"][0][0] < bilgi[2]["kose"][0][0]
    # yeşil kalmadı, zemin bozulmadı
    assert kz.yesil_kalinti(out) == 0
    assert merkez_rengi(out, (0, 0, 20, 20)) == GRI
    try:
        mc.birlestir_cok(img, [duz(RENKLER[0]), duz(RENKLER[1])])
        raise AssertionError("bölge/tasarım sayısı tutmadığında ValueError beklenirdi")
    except ValueError:
        pass


def test_tek_bolge_eski_davranis():
    img = sahne(kutular=[KUTULAR[1]])
    tek, _ = mc.birlestir(img, duz(RENKLER[0]), feather=1.5)
    cok, _ = mc.birlestir_cok(img, [duz(RENKLER[0])], feather=1.5)
    assert np.array_equal(np.asarray(tek), np.asarray(cok))


def test_ekranlari_oturt():
    img = sahne(kutular=KUTULAR)
    ekranlar = [duz(r, 390 * 2, 844 * 2) for r in RENKLER]
    out, bilgi = kz.ekranlari_oturt(img, ekranlar, feather=1.0, parlaklik=0.05)
    assert out.size == img.size
    for kutu, renk in zip(KUTULAR, RENKLER):
        # parlaklık en çok %5 açar: renk yine kendi bölgesinde
        assert yakin(merkez_rengi(out, kutu), renk, 16), (kutu, merkez_rengi(out, kutu))
    assert [b["kutu"][0] for b in bilgi] == [k[0] for k in KUTULAR]
    assert kz.yesil_kalinti(out) == 0
    # ekran yüksekliği yeşil alanın biçiminden (390 px genişlikte)
    orta = kz.ekran_bolgeleri(img)[1]
    assert kz.ekran_yuksekligi(orta["oran"]) == round(390 * 500 / 230), kz.ekran_yuksekligi(orta["oran"])


def test_yerlestir():
    img = sahne(boyut=(600, 400), kutular=[(250, 100, 350, 300)])
    out, bilgi = kz.yerlestir(img, 2.0, 400, 300)  # sahne 1200 × 800, tuvalde (400, 300)
    assert out.size == (kz.TUVAL, kz.TUVAL)
    assert bilgi["uzatma"] == {"ust": 300, "alt": 900, "sol": 400, "sag": 400}, bilgi
    a = np.asarray(out)
    # sahnenin içi yerinde: yeşil ekranın ortası (300, 200) → 2× + (400, 300) = (1000, 700)
    assert yakin(tuple(int(v) for v in a[700, 1000]), (0, 255, 0), 6), a[700, 1000]
    # uzatılan şeritler sahnenin kendi kenarından: gri
    for y, x in ((50, 50), (1950, 1950), (1000, 100)):
        assert yakin(tuple(int(v) for v in a[y, x]), GRI, 6), (y, x, a[y, x])
    # kırpma: sahne tuvalden büyükse uzatma yok
    out2, b2 = kz.yerlestir(sahne(boyut=(1500, 1500)), 1.5, -100, -50)
    assert out2.size == (kz.TUVAL, kz.TUVAL) and b2["uzatma"] == {"ust": 0, "alt": 0, "sol": 0, "sag": 0}


def test_build_yardimcilari():
    assert lb.doldur("a {{x}} b", {"x": 1}) == "a 1 b"
    try:
        lb.doldur("a {{x}} {{y}}", {"x": 1})
        raise AssertionError("eksik yer tutucu hata vermeliydi")
    except ValueError:
        pass
    k = lb.kirp_43(Image.new("RGB", (2000, 2000)))
    assert k.size == (2000, 1500)
    # metinler: görevdeki tam metinler; QR/web adresi yok
    tum = " ".join(m for g in lb.GORSELLER.values() for m in g["metin"])
    for beklenen in ("Wedding Website", "Opens like a real invitation", "Edit on your phone", "Online RSVP",
                     "Instant access", "Every page your guests need", "How it works", "Buy this design",
                     "Open your start link", "Publish and share", "Try the live demo",
                     "Open the demo link in the description"):
        assert beklenen in tum, beklenen
    assert not any(s in tum.lower() for s in ("http", "www", ".com", ".app", "qr"))
    # LC2: sahnedeki telefon sayısı kadar sayfa ve alt yazı
    g = lb.GORSELLER["pages"]
    assert len(g["ekranlar"]) == len(g["altyazi"]) == 3
    # şablonlarda her yer tutucu build'in verdiği değerlerle dolar
    for ad in lb.SIRA:
        html = (lb.TEMPLATES / f"{ad}.html").read_text(encoding="utf-8")
        assert "{{bg}}" in html and "{{logo}}" in html and "{{fonts_css}}" in html, ad


def test_ciktilar():
    """Kurulmuşsa: 01 ve 03 için 4 görsel 2000 × 2000, yeşil yok, önizleme var (kurulmamışsa atlanır)."""
    for nn in lb.TASARIMLAR:
        klasor = lb.cikti_klasoru(nn)
        if not klasor.exists():
            print(f"    {nn}: listing_v2 yok, atlandı")
            continue
        for ad in lb.SIRA:
            p = klasor / lb.GORSELLER[ad]["dosya"]
            assert p.exists(), p
            im = Image.open(p)
            assert im.size == (2000, 2000), (p, im.size)
            assert kz.yesil_kalinti(im) == 0, p
        assert (klasor / "preview_thumbs.png").exists()


def main():
    for test in (test_yesil_bolgeler, test_birlestir_cok_sira, test_tek_bolge_eski_davranis, test_ekranlari_oturt,
                 test_yerlestir, test_build_yardimcilari, test_ciktilar):
        test()
        print(f"  {test.__name__}: tamam")
    print("test_listing_v2: tamam")


if __name__ == "__main__":
    main()
