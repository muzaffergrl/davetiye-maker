"""tools/parts_prep.py — PAKET 5 (website) okuma testi. Sahte parçalar geçici klasörde üretilir.

  python3 tools/tests/test_parts_prep_paket5.py

Denenenler: parça listesi yalnız PAKET 4/5 `/parts/` satırlarından gelir (PAKET 1 `/parts/`, PAKET 2 fotoğraflar,
PAKET 3 mockup'lar alınmaz); aynı yol PAKET 4 ve 5'te varsa PAKET 5 satırı geçerli (sıra korunur); PAKET 5 opak dikey
görsel 9:16'ya kırpılmaz/büyütülmez (`bg_page.jpg` 1024×1536); PAKET 5 parçasında #00FF00 penceresi bulunur;
`--comps` ile PAKET 5 comp penceresi comp'un kendi koordinatında (`koordinat: kaynak`); gerçek bir tasarımın
üretilmiş GPT_PROMPTS.md dosyasından (varsa) PAKET 5 parça sayısı.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ARACLAR = Path(__file__).resolve().parent.parent
ROOT = ARACLAR.parent
ARAC = ARACLAR / "parts_prep.py"
sys.path.insert(0, str(ARACLAR))
import parts_prep as pp  # noqa: E402
from kit_check import beklenenler  # noqa: E402

PROMPTS = """# test
## PAKET 1 — eski doku/dekor
**Kaydet:** `collections/TEST/assets/gpt/parts/legacy.png` · 1024×1024 · **Şeffaf zemin**
## PAKET 4 — TASARIM (video)
**Kaydet:** `collections/TEST/assets/gpt/parts/card_small.png` · 1024×1536
**Kaydet:** `collections/TEST/assets/gpt/parts/ribbon_bow.png` · 1536×1024 · **Şeffaf zemin**
## PAKET 5 — Website tasarımı (GPT tasarlar)
- Instructions: fill photo windows with flat pure green #00FF00.
#### W1.2 Home
**Kaydet:** `collections/TEST/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Phone screen; the hero card window is filled with flat pure green #00FF00.
```
#### W2.1 Sayfa arka planı
**Kaydet:** `collections/TEST/assets/gpt/parts/bg_page.png` · 1024×1536

```
Calm background.
```
#### W2.6 Küçük kart
**Kaydet:** `collections/TEST/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
Small card, photo window filled with flat pure green #00FF00.
```
## PAKET 2 — Örnek fotoğraflar
**Kaydet:** `collections/TEST/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)
## PAKET 3 — mockup
**Kaydet:** `collections/TEST/assets/gpt/mockups/phone_flatlay.png` · 1024×1536
"""


def kit(t: Path) -> Path:
    k = t / "kit"
    for d in ("parts", "comps", "photos", "mockups"):
        (k / "assets/gpt" / d).mkdir(parents=True)
    (k / "assets/gpt/GPT_PROMPTS.md").write_text(PROMPTS, encoding="utf-8")
    g = k / "assets/gpt"
    bg = np.zeros((1536, 1024, 3), np.uint8)
    bg[:] = (238, 226, 214)
    bg[:, :60] = (200, 60, 60)  # 9:16 kırpma olsaydı giderdi; website'te kalmalı
    Image.fromarray(bg, "RGB").save(g / "parts/bg_page.png")
    kart = np.zeros((1536, 1024, 4), np.uint8)
    kart[300:1300, 200:824] = (255, 249, 246, 255)
    kart[380:760, 362:662, :3] = (4, 251, 44)  # GPT'nin gerçek "düz yeşili"
    Image.fromarray(kart, "RGBA").save(g / "parts/card_small.png")
    Image.new("RGBA", (1024, 1024), (0, 0, 0, 0)).save(g / "parts/legacy.png")  # PAKET 1: işlenmemeli
    comp = np.zeros((1536, 1024, 3), np.uint8)
    comp[:] = (238, 226, 214)
    comp[200:600, 300:700] = (0, 255, 0)
    Image.fromarray(comp, "RGB").save(g / "comps/web_2_home.png")
    Image.new("RGB", (1024, 1536), (120, 110, 100)).save(g / "photos/hero_portrait.jpg")
    return k


def test_liste(k: Path):
    liste = beklenenler(k / "assets/gpt/GPT_PROMPTS.md")
    secili = pp.parca_listesi(liste)
    adlar = [Path(b["yol"]).name for b in secili]
    assert adlar == ["ribbon_bow.png", "bg_page.png", "card_small.png"], adlar
    kart = secili[-1]
    assert kart["paket"] == 5 and kart["seffaf"] and kart["pencere"], kart  # PAKET 5 satırı PAKET 4'ü ezer
    assert pp.pencere_bekleyenler(k / "assets/gpt/GPT_PROMPTS.md") == {
        "collections/TEST/assets/gpt/comps/web_2_home.png", "collections/TEST/assets/gpt/parts/card_small.png"}


def test_calistir(k: Path):
    r = subprocess.run([sys.executable, str(ARAC), str(k), "--comps", "--json"], capture_output=True, text=True)
    assert r.returncode == 0, r.stdout + r.stderr
    j = json.loads(r.stdout)
    katman = {x["ad"]: x for x in j["katmanlar"]}
    assert set(katman) == {"bg_page", "card_small"}, katman.keys()
    assert j["eksik"] and all("ribbon_bow" in e for e in j["eksik"]), j["eksik"]  # yalnız PAKET 4 parçası eksik
    bg = katman["bg_page"]
    assert bg["kirpma"] == [0, 0, 1024, 1536] and bg["dosyalar"] == [{"dosya": "bg_page.jpg", "olcu": [1024, 1536]}], bg
    assert not any("büyütme" in u for u in j["uyarilar"]), j["uyarilar"]
    a = np.asarray(Image.open(k / "kit_layers/bg_page.jpg")).astype(int)
    assert (a[:, :40, 0] - a[:, :40, 1]).mean() > 100, "website arka planı kırpılmamalıydı"
    p = j["pencereler"]["card_small"]
    assert len(p) == 1 and abs(p[0]["kutu"][2] - 300) <= 2 and abs(p[0]["kutu"][3] - 380) <= 2, p
    cp = j["comp_pencereleri"]["web_2_home"]
    assert len(cp) == 1 and cp[0]["koordinat"] == "kaynak" and cp[0]["katman"] is None, cp
    assert [abs(x - y) <= 2 for x, y in zip(cp[0]["kutu"], [300, 200, 400, 400])] == [True] * 4, cp
    assert not (k / "kit_layers/hero_portrait.jpg").exists() and not (k / "kit_layers/legacy.png").exists()


def test_gercek_dosya():
    """Üretilmiş bir PAKET 5 dosyası (varsa): parts_prep 17 parça görür, 3 parça ve 3 comp pencere bekler."""
    yol = ROOT / "collections/04_Vintage_Airmail/assets/gpt/GPT_PROMPTS.md"
    if not yol.exists() or "## PAKET 5" not in yol.read_text(encoding="utf-8"):
        print("  test_gercek_dosya: atlandı (04'te PAKET 5 yok)")
        return
    liste = beklenenler(yol)
    secili = pp.parca_listesi(liste)
    assert len(secili) == 17 and all(b["paket"] == 5 for b in secili), len(secili)
    pencere = sorted(Path(b["yol"]).name for b in secili if b["pencere"])
    assert pencere == ["card_small.png", "frame_landscape.png", "frame_portrait.png"], pencere
    comps = [b for b in liste if "/comps/" in b["yol"]]
    assert len(comps) == 5 and sum(b["pencere"] for b in comps) == 3, comps
    print("  test_gercek_dosya: tamam (04: 17 parça, 3 pencereli parça, 3 pencereli comp)")


def main():
    with tempfile.TemporaryDirectory() as t:
        k = kit(Path(t))
        test_liste(k)
        print("  test_liste: tamam")
        test_calistir(k)
        print("  test_calistir: tamam")
    test_gercek_dosya()
    print("test_parts_prep_paket5: tamam")


if __name__ == "__main__":
    main()
