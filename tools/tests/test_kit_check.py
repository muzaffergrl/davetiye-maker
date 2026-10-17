"""tools/kit_check.py için küçük test — sahte kit üretir (repo dışına), iyi/kötü örnekleri dener.

  python3 tools/tests/test_kit_check.py

Zarf hizası (G054): kapak/kapı/sarılı kapanış sahte zarflarıyla GEÇTİ / UYARI / KALDI / ATLANDI, `--hiza`, `--zarf-tipi`.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ARAC = Path(__file__).resolve().parent.parent / "kit_check.py"

PROMPTS = """# test
## PAKET 1 — Dokular ve dekor
**Kaydet:** `{k}/assets/gpt/textures/paper.png` · 1024×1024
**Kaydet:** `{k}/assets/gpt/decor/seal.png` · 1024×1024 · **Şeffaf zemin**
## PAKET 3 — mockup
**Kaydet:** `{k}/assets/gpt/mockups/phone.png` · 1024×1536
"""


def kit(tmp: Path, iyi: bool) -> Path:
    k = tmp / ("iyi" if iyi else "kotu")
    for d in ("textures", "decor", "mockups"):
        (k / "assets/gpt" / d).mkdir(parents=True)
    (k / "assets/gpt/GPT_PROMPTS.md").write_text(PROMPTS.format(k=k))
    # doku: iyi = kare opak; kötü = yanlış oran
    Image.new("RGB", (1024, 1024) if iyi else (1536, 1024), (250, 246, 238)).save(k / "assets/gpt/textures/paper.png")
    # mühür: iyi = ortada daire, kenarlar şeffaf; kötü = beyaz zemin (alfa yok)
    if iyi:
        a = np.zeros((1024, 1024, 4), np.uint8)
        yy, xx = np.ogrid[:1024, :1024]
        m = (yy - 512) ** 2 + (xx - 512) ** 2 < 300 ** 2
        a[m] = (110, 136, 163, 255)
        Image.fromarray(a, "RGBA").save(k / "assets/gpt/decor/seal.png")
    else:
        Image.new("RGB", (1024, 1024), (255, 255, 255)).save(k / "assets/gpt/decor/seal.png")
    # mockup: iyi = düz yeşil dikdörtgen; kötü = iki ayrı yeşil blok (tek parça değil)
    m = np.full((1536, 1024, 3), 230, np.uint8)
    if iyi:
        m[300:1200, 300:720] = (0, 255, 0)
    else:
        m[200:600, 200:800] = (0, 255, 0)
        m[900:1300, 200:800] = (0, 255, 0)
    Image.fromarray(m, "RGB").save(k / "assets/gpt/mockups/phone.png")
    return k


def calistir(k: Path, *ek):
    r = subprocess.run([sys.executable, str(ARAC), str(k), *ek], capture_output=True, text=True)
    return r.returncode, r.stdout


PAKET5 = """# test
## PAKET 5 — Website tasarımı (GPT tasarlar)
- Where a photo will go, fill the window with flat pure green #00FF00 (talimat: Kaydet satırı yok, sayılmaz).
#### W2.1 Sayfa arka planı
**Kaydet:** `{k}/assets/gpt/parts/bg_page.png` · 1024×1536

```
Calm background, no window.
```
#### W2.2 Küçük kart
**Kaydet:** `{k}/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
A small card, its photo window filled with flat pure green #00FF00.
```
#### W2.3 Çerçeve
**Kaydet:** `{k}/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
A frame, window filled with flat pure green #00FF00.
```
## PAKET 2 — Örnek fotoğraflar
**Kaydet:** `{k}/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)
## PAKET 3 — mockup
**Kaydet:** `{k}/assets/gpt/mockups/phone.png` · 1024×1536
"""


def kart(yol, yesil):
    """Şeffaf zeminde fildişi kart; yesil: pencere rengi ya da None (pencere yok)."""
    a = np.zeros((1536, 1024, 4), np.uint8)
    a[300:1300, 200:824] = (255, 249, 246, 255)
    if yesil:
        a[380:760, 362:662, :3] = yesil
    Image.fromarray(a, "RGBA").save(yol)


def test_paket5(t: Path):
    """PAKET 5: --paket 5 sayımı, #00FF00 isteyen parçada pencere denetimi (GPT yeşili de), pencere istemeyende yok."""
    import sys as _s
    _s.path.insert(0, str(ARAC.parent))
    from kit_check import beklenenler
    k = t / "p5"
    for d in ("parts", "photos", "mockups"):
        (k / "assets/gpt" / d).mkdir(parents=True)
    (k / "assets/gpt/GPT_PROMPTS.md").write_text(PAKET5.format(k=k), encoding="utf-8")
    b = beklenenler(k / "assets/gpt/GPT_PROMPTS.md")
    assert [x["paket"] for x in b] == [5, 5, 5, 2, 3], b
    assert [x["pencere"] for x in b] == [False, True, True, False, False], b
    Image.new("RGB", (1024, 1536), (240, 230, 220)).save(k / "assets/gpt/parts/bg_page.png")
    kart(k / "assets/gpt/parts/card_small.png", (4, 251, 44))      # GPT'nin gerçek "düz yeşili"
    kart(k / "assets/gpt/parts/frame_portrait.png", None)          # pencere unutulmuş
    kod, out = calistir(k, "--paket", "5")
    assert kod == 1 and out.strip().endswith("2/3 geçti"), out
    assert "card_small.png  — 1024×1536 şeffaf · pencere" in out, out
    assert "frame_portrait.png  — #00FF00 foto penceresi yok" in out, out
    kart(k / "assets/gpt/parts/frame_portrait.png", (0, 255, 0))
    kod, out = calistir(k, "--paket", "5")
    assert kod == 0 and out.strip().endswith("3/3 geçti"), out
    kod, out = calistir(k, "--paket", "2")
    assert kod == 1 and out.strip().endswith("0/1 geçti") and "hero_portrait.jpg" in out, out


HIZA = """# test
## PAKET 5 — Website tasarımı (GPT tasarlar)
#### W2.3 Kapalı zarf{tip} — kapanış elemanı OLMADAN
**Kaydet:** `{k}/assets/gpt/parts/envelope_closed.png` · {olcu} · **Şeffaf zemin**
#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `{k}/assets/gpt/parts/closure.png` · {kolcu} · **Şeffaf zemin**
{ktarif}
#### W2.5 Açık zarf{tip} — boş
**Kaydet:** `{k}/assets/gpt/parts/envelope_open.png` · {olcu} · **Şeffaf zemin**
"""


def rgba(w, h, kutular, renk=(226, 196, 192, 255)):
    a = np.zeros((h, w, 4), np.uint8)
    for x0, y0, x1, y1 in kutular:
        a[y0:y1, x0:x1] = renk
    return Image.fromarray(a, "RGBA")


def hiza_kit(t: Path, ad: str, tip="", olcu=(1024, 1536), kolcu=(1024, 1024),
             ktarif="A ribbon wrapped around the envelope.") -> Path:
    k = t / ad
    (k / "assets/gpt/parts").mkdir(parents=True)
    (k / "assets/gpt/GPT_PROMPTS.md").write_text(
        HIZA.format(k=k, tip=tip, olcu=f"{olcu[0]}×{olcu[1]}", kolcu=f"{kolcu[0]}×{kolcu[1]}", ktarif=ktarif), encoding="utf-8")
    return k


def test_hiza(t: Path):
    """--paket 5 zarf hizası (G054): ±%1,5 GEÇTİ, ≤ %4 UYARI (geçti sayılır), > %4 KALDI; tip başlıktan; --hiza;
    sarılı kapanış (Kaydet ölçüsü zarfınkiyle aynı); eksik açık zarf → ATLANDI (sayılmaz)."""
    from kit_check import beklenenler
    k = hiza_kit(t, "hz_kapak")
    b = beklenenler(k / "assets/gpt/GPT_PROMPTS.md")
    assert b[0]["baslik"].startswith("W2.3 Kapalı zarf"), b[0]
    P = k / "assets/gpt/parts"
    govde = (100, 500, 924, 1300)
    rgba(1024, 1536, [govde]).save(P / "envelope_closed.png")
    rgba(1024, 1024, [(300, 300, 724, 724)]).save(P / "closure.png")
    rgba(1024, 1536, [govde, (200, 300, 824, 500)]).save(P / "envelope_open.png")  # kapak yukarıda, gövde aynı
    kod, out = calistir(k, "--paket", "5")
    assert kod == 0 and "GEÇTİ  hiza  envelope_closed ↔ envelope_open — kapak · tuval · sol +0.00%" in out, out
    assert out.strip().endswith("4/4 geçti"), out
    rgba(1024, 1536, [(124, 500, 948, 1300), (224, 300, 848, 500)]).save(P / "envelope_open.png")  # 24 px = %2,34
    kod, out = calistir(k, "--paket", "5")
    assert kod == 0 and "UYARI  hiza" in out and "sol +2.34%" in out and "4/4 geçti" in out, out
    rgba(1024, 1536, [(150, 500, 974, 1300)]).save(P / "envelope_open.png")                     # 50 px = %4,88
    kod, out = calistir(k, "--hiza")
    assert kod == 1 and "KALDI  hiza" in out and "GPT'den yeniden" in out and out.strip().endswith("0/1 geçti"), out
    # GPT farklı piksel ölçüsü (1254×1881 ≈ 2:3): Kaydet tuvaline göre ölçülür
    rgba(1024, 1536, [govde]).resize((1254, 1881)).save(P / "envelope_open.png")
    kod, out = calistir(k, "--hiza")
    assert kod == 0 and "GEÇTİ  hiza" in out, out
    (P / "envelope_open.png").unlink()
    kod, out = calistir(k, "--paket", "5")
    assert kod == 1 and "ATLANDI  hiza  envelope_open.png yok" in out and out.strip().endswith("2/3 geçti"), out
    # gatefold: tip başlıktan, katlanma çizgileri
    k = hiza_kit(t, "hz_kapi", " (gatefold, iki kapı)", (1536, 1024))
    P = k / "assets/gpt/parts"
    rgba(1536, 1024, [(518, 80, 1018, 940)], (30, 40, 70, 255)).save(P / "envelope_closed.png")
    a = np.asarray(rgba(1536, 1024, [(98, 80, 1438, 940)], (40, 50, 90, 255))).copy()
    a[80:940, 518:1018, :3] = (232, 220, 196)
    a[80:940, 518, :3] = a[80:940, 1017, :3] = (10, 10, 20)
    Image.fromarray(a, "RGBA").save(P / "envelope_open.png")
    rgba(1024, 1024, [(400, 400, 624, 624)]).save(P / "closure.png")
    kod, out = calistir(k, "--hiza")
    assert kod == 0 and "kapi · tuval · üst +0.00% · alt +0.00% · sol kat +0.03% · sağ kat -0.03%" in out, out
    kod, out = calistir(k, "--hiza", "--zarf-tipi", "kese")
    assert "kese · tuval · sol" in out and "KALDI" in out, out   # yanlış tip: açık kapılar sol/sağ kenarı büyütür
    # sarılı kapanış (closure Kaydet = zarf Kaydet): yatay kurdele uçları zarf kenarında
    k = hiza_kit(t, "hz_sarili", "", (1024, 1536), (1024, 1536))
    P = k / "assets/gpt/parts"
    rgba(1024, 1536, [govde]).save(P / "envelope_closed.png")
    rgba(1024, 1536, [govde, (200, 300, 824, 500)]).save(P / "envelope_open.png")
    rgba(1024, 1536, [(100, 850, 924, 950), (450, 800, 574, 1000)], (180, 60, 80, 255)).save(P / "closure.png")
    kod, out = calistir(k, "--hiza")
    assert kod == 0 and "(+ sarılı closure)" in out and "kapanış sol uç +0.00%" in out, out
    rgba(1024, 1536, [(160, 850, 864, 950)], (180, 60, 80, 255)).save(P / "closure.png")      # 60 px kısa: %5,86
    kod, out = calistir(k, "--hiza")
    assert kod == 1 and "kapanış sol uç +5.86%" in out, out
    # aynı tuvalde ama sarmayan kapanış (18'in yuvarlak etiketi): uçlar ölçülmez
    k = hiza_kit(t, "hz_etiket", "", (1024, 1536), (1024, 1536), ktarif="A small round sticker on the sleeve.")
    P = k / "assets/gpt/parts"
    rgba(1024, 1536, [govde]).save(P / "envelope_closed.png")
    rgba(1024, 1536, [govde, (200, 300, 824, 500)]).save(P / "envelope_open.png")
    rgba(1024, 1536, [(450, 800, 574, 924)], (180, 60, 80, 255)).save(P / "closure.png")
    kod, out = calistir(k, "--hiza")
    assert kod == 0 and "sarılı" not in out and "kapanış sol uç" not in out, out


SAHNE = """# test
## PAKET 3 — Etsy ilan sahneleri
**Kaydet:** `{k}/assets/gpt/mockups/hand.png` · 1024×1024 · 1 ekran
**Kaydet:** `{k}/assets/gpt/mockups/three.png` · 1536×1024 · 3 ekran
"""


def _telefon(img: np.ndarray, cx: float, cy: float, w: float, h: float, aci: float, r: float = 0.0):
    """Döndürülmüş, köşeleri yuvarlatılmış düz yeşil ekran (GPT yeşili ≈ (3,252,45))."""
    yy, xx = np.mgrid[: img.shape[0], : img.shape[1]].astype(np.float32)
    c, s = np.cos(np.radians(aci)), np.sin(np.radians(aci))
    u, v = (xx - cx) * c + (yy - cy) * s, -(xx - cx) * s + (yy - cy) * c
    du, dv = np.abs(u) - (w / 2 - r), np.abs(v) - (h / 2 - r)
    m = np.hypot(np.maximum(du, 0), np.maximum(dv, 0)) <= r
    m &= (np.abs(u) <= w / 2) & (np.abs(v) <= h / 2)
    img[m] = (3, 252, 45)
    return m


def test_sahne(t: Path):
    """İlan sahneleri: eğik + yuvarlak köşeli tek ekran ve üç ayrı ekran geçer; ekrana binen parmak ve eksik ekran kalır."""
    for ad, iyi in (("sahne_iyi", True), ("sahne_kotu", False)):
        k = t / ad
        (k / "assets/gpt/mockups").mkdir(parents=True)
        (k / "assets/gpt/GPT_PROMPTS.md").write_text(SAHNE.format(k=k))
        a = np.full((1024, 1024, 3), (236, 226, 214), np.uint8)
        _telefon(a, 512, 600, 300, 600, 10, r=36)
        if not iyi:  # parmak ekranın kenarına biniyor
            a[540:680, 330:430] = (214, 170, 150)
        Image.fromarray(a, "RGB").save(k / "assets/gpt/mockups/hand.png")
        b = np.full((1024, 1536, 3), (236, 226, 214), np.uint8)
        for cx in ((420, 768, 1116) if iyi else (520, 1016)):
            _telefon(b, cx, 520, 230, 470, 0 if cx == 768 else 4, r=28)
        Image.fromarray(b, "RGB").save(k / "assets/gpt/mockups/three.png")
        kod, out = calistir(k, "--paket", "3")
        if iyi:
            assert kod == 0 and "1 ekran" in out and "3 ekran" in out, out
        else:
            assert kod == 1 and "düz/tek parça dörtgen değil" in out and "3 yeşil ekran bekleniyordu, 2 bulundu" in out, out


def test_cok_dosya(t: Path):
    """G167: tek Kaydet satırında birden çok dosya (`tile_1.png`, `tile_2.png`) — hepsi ayrı ayrı aranır."""
    k = t / "cok"
    (k / "assets/gpt/parts").mkdir(parents=True)
    (k / "assets/gpt/GPT_PROMPTS.md").write_text(
        f"## PAKET 5\n**Kaydet:** `{k}/assets/gpt/parts/tile_1.png`, `tile_2.png` · her biri 512×512 · opak\n")
    Image.new("RGB", (512, 512), (90, 120, 130)).save(k / "assets/gpt/parts/tile_1.png")
    kod, out = calistir(k, "--paket", "5")
    assert kod == 1 and "tile_2.png  — dosya yok" in out and out.strip().endswith("1/2 geçti"), out


def main():
    with tempfile.TemporaryDirectory() as t:
        t = Path(t)
        kod, out = calistir(kit(t, True))
        assert kod == 0, out
        kod, out = calistir(kit(t, False))
        assert kod == 1, out
        assert out.count("KALDI") == 3, out
        assert "oran" in out and "şeffaf değil" in out and "yeşil alan" in out, out
        kod, out = calistir(t / "iyi", "--paket", "3")
        assert kod == 0 and out.strip().endswith("1/1 geçti"), out
        test_paket5(t)
        test_hiza(t)
        test_sahne(t)
        test_cok_dosya(t)
    print("test_kit_check: tamam (paket 1/3/5, pencere denetimi, zarf hizası, ilan sahneleri)")


if __name__ == "__main__":
    main()
