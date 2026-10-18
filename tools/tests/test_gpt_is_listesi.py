"""tools/gpt_is_listesi.py (G179): indirme adları, kendi başına prompt'lar, gpt_yerlestir --klasor."""
import sys
from pathlib import Path

import numpy as np
import pytest
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import gpt_bekleyen as gb  # noqa: E402
import gpt_is_listesi as il  # noqa: E402
import gpt_yerlestir as gy  # noqa: E402

COL = "collections/91_Deneme_Liste"
ON = "You are the photographer for this set. Every screen is flat pure green (#00FF00)."
PROMPTS = f"""# Deneme

> **Instructions for GPT:** Make W2.1 first and give it as the reference image of every later part.

## PAKET 5 — website katmanları (YAZI YOK)

Bölüm notu: hepsi aynı tuvalde.

#### W2.1 Kapalı kutu
**Kaydet:** `{COL}/assets/gpt/parts/box_closed.png` · 1024×1536 · **Şeffaf zemin**

```
A closed velvet box,
centered on the canvas. True transparent background PNG.
```
Kontrol: tek nesne.

#### W2.2 Açık kutu
**Kaydet:** `{COL}/assets/gpt/parts/box_open.png` · 1024×1536 · **Şeffaf zemin**

```
Same as above, but the lid is open (give box_closed.png as the reference image).
```

#### W2.3 Açık kutu (yedek)
**Kaydet:** `{COL}/assets/gpt/parts/box_open_alt.png` · 1024×1536 · **Şeffaf zemin**

Prompt: same as above.

#### W2.4 Karolar
**Kaydet:** `{COL}/assets/gpt/parts/tile_1.png`, `tile_2.png` · her biri 512×512 · opak

```
tile_1: A blue star tile filling the square.
tile_2: The same tile family: a plain blue tile.
```

#### W2.5 Pullar
**Kaydet:** `{COL}/assets/gpt/parts/flake_1.png`, `flake_2.png` · her biri 512×512 · **Şeffaf zemin**

```
A single gold flake. (Make two: 1 = square, 2 = sliver.)
```

## PAKET 3 — Etsy ilan sahneleri

**Instructions for GPT (send before the first image):**
```
{ON}
```

### 3.1 Kapak
**Kaydet:** `{COL}/assets/gpt/mockups/cover.png` · 1024×1024 · 1 ekran

```
A hand holds a phone. Every screen is flat #00FF00.
```
"""


@pytest.fixture
def kok(tmp_path, monkeypatch):
    (tmp_path / COL / "assets/gpt").mkdir(parents=True)
    (tmp_path / COL / "assets/gpt/GPT_PROMPTS.md").write_text(PROMPTS, encoding="utf-8")
    (tmp_path / "platform/themes").mkdir(parents=True)
    (tmp_path / "gelen").mkdir()
    monkeypatch.setattr(gy, "KOK", tmp_path)
    monkeypatch.setattr(gb, "KOK", tmp_path)
    return tmp_path


@pytest.fixture
def komutlar(monkeypatch):
    kayit = []
    monkeypatch.setattr(gy, "calistir", lambda komut, cwd, env=None: (kayit.append(komut), (0, "tamam"))[1])
    return kayit


def maddeler():
    return {Path(m["hedef"]).name: m for m in il.is_listesi()[0]}


# ---------------------------------------------------------------- indirme adı

def test_indirme_adi_ornekleri():
    assert il.indirme_adi("collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_closed.png") == \
        "23-velvet-jewel-box__box_closed.png"
    assert il.indirme_adi("collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_1.jpg") == \
        "23-velvet-jewel-box__photos__story_1.jpg"
    assert il.indirme_adi("collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure.png") == \
        "16-sunflower-rustic__v02-navy-sunflower__closure.png"
    assert il.indirme_koku("23-Velvet-Jewel-Box__Box_Closed.WEBP") == "23-velvet-jewel-box__box_closed"


def test_gercek_repo_indirme_adlari_benzersiz_ve_sabit():
    istenen = gy.istenenler()
    kokler = [il.indirme_koku(il.indirme_adi(h)) for h in istenen]
    assert len(kokler) == len(set(kokler))  # bütün istenen hedefler (eksik + var) arasında benzersiz
    a, _ = il.is_listesi()
    b, _ = il.is_listesi()
    assert [m["indirme_adi"] for m in a] == [m["indirme_adi"] for m in b]
    assert all(m["indirme_adi"] == il.indirme_adi(m["hedef"]) for m in a)  # yalnız yoldan türer
    assert all(m["prompt"] for m in a), [m["hedef"] for m in a if not m["prompt"]]
    eksik = sum(len(x["eksik"]) for bol in gb.topla().values() for x in bol.values())
    assert len(a) == eksik  # docs/26 ile aynı küme
    gruplar = [m["grup"] for m in a]
    assert gruplar == sorted(gruplar)  # a → b → c sırası


# ---------------------------------------------------------------- kendi başına prompt'lar

def test_sentetik_prompt_kendi_basina(kok):
    m = maddeler()
    assert m["box_closed.png"]["prompt"] == "A closed velvet box, centered on the canvas. True transparent background PNG."
    acik = m["box_open.png"]["prompt"]
    assert acik.startswith("A closed velvet box, centered on the canvas.")  # "Same as above" çözüldü
    assert "lid is open" in acik and "Same as above" not in acik
    assert m["box_open_alt.png"]["prompt"].startswith("A closed velvet box")  # bloksuz "same as above"
    assert m["box_open.png"]["referanslar"][0]["no"] == m["box_closed.png"]["no"]
    t2 = m["tile_2.png"]["prompt"]
    assert "A blue star tile" in t2 and "plain blue tile" in t2 and "tile_1:" not in t2
    assert m["tile_1.png"]["prompt"] == "A blue star tile filling the square."
    assert "ONLY ONE image now: flake_2 (number 2 of 2)" in m["flake_2.png"]["prompt"]
    kapak = m["cover.png"]
    assert kapak["prompt"].startswith(ON) and kapak["prompt"].endswith("Every screen is flat #00FF00.")
    assert kapak["ekran"] == 1 and kapak["tur"] == "mockup"
    assert m["box_closed.png"]["olcu"] == [1024, 1536] and m["box_closed.png"]["seffaf"]
    assert m["tile_2.png"]["olcu"] == [512, 512] and not m["tile_2.png"]["seffaf"]
    assert [x["tur"] for x in m.values()].index("mockup") > [x["tur"] for x in m.values()].index("web")


def test_yaz_iki_belge(kok, monkeypatch):
    (kok / "docs").mkdir()
    n, _ = il.yaz()
    md = (kok / il.CIKTI_MD).read_text(encoding="utf-8")
    ht = (kok / il.CIKTI_HTML).read_text(encoding="utf-8")
    assert n == 8 and "91-deneme-liste__tile_2.png" in md and 'data-ad="91-deneme-liste__tile_2.png"' in ht
    assert "<script src" not in ht and "<link" not in ht and "localStorage" in ht


# ---------------------------------------------------------------- gpt_yerlestir --klasor

def _seffaf(yol, w=200, h=300):
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[30:h - 30, 20:w - 20] = (120, 60, 90, 255)
    Image.fromarray(rgba, "RGBA").save(yol)


def test_klasor_adla_eslestirir_bilinmeyeni_birakir(kok, komutlar, capsys):
    _seffaf(kok / "gelen/91-Deneme-Liste__BOX_CLOSED.webp")
    Image.new("RGB", (512, 512), (40, 60, 160)).save(kok / "gelen/91-deneme-liste__tile_2.jpg")
    _seffaf(kok / "gelen/ChatGPT Image Oct 18, 2026.png")
    hedef = kok / COL / "assets/gpt/parts"
    assert gy.main(["--klasor", str(kok / "gelen")]) == 0  # kuru
    out = capsys.readouterr().out
    assert "BİLİNMEYEN      ChatGPT Image Oct 18, 2026.png" in out
    assert "→ collections/91_Deneme_Liste/assets/gpt/parts/box_closed.png" in out
    assert not hedef.exists() and komutlar == []
    assert gy.main(["--klasor", str(kok / "gelen"), "--uygula"]) == 0
    assert (hedef / "box_closed.png").exists() and (hedef / "tile_2.png").exists()
    assert sorted(p.name for p in hedef.iterdir()) == ["box_closed.png", "tile_2.png"]
    assert (kok / "gelen/ChatGPT Image Oct 18, 2026.png").exists()  # bilinmeyene dokunulmadı


def test_klasor_red_hicbir_sey_yazmaz(kok, komutlar):
    _seffaf(kok / "gelen/91-deneme-liste__box_closed.png")
    Image.new("RGB", (512, 512)).save(kok / "gelen/91-deneme-liste__flake_1.png")  # şeffaf istendi → red
    assert gy.main(["--klasor", str(kok / "gelen"), "--uygula"]) == 1
    assert not (kok / COL / "assets/gpt/parts").exists()
