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
    print("test_kit_check: tamam")


if __name__ == "__main__":
    main()
