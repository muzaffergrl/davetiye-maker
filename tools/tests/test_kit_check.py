"""tools/kit_check.py için küçük test — sahte kit üretir (repo dışına), iyi/kötü örnekleri dener.

  python3 tools/tests/test_kit_check.py
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
    print("test_kit_check: tamam (paket 1/3/5, pencere denetimi)")


if __name__ == "__main__":
    main()
