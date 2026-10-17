"""tools/gpt_yerlestir.py (G176): eşleştirme denetimi ve adım sırası — sahte bir repo kökünde, build komutları taklit."""
import json
import sys
from pathlib import Path

import numpy as np
import pytest
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import gpt_bekleyen as gb  # noqa: E402
import gpt_yerlestir as gy  # noqa: E402

COL = "collections/90_Deneme"
PROMPTS = f"""# Deneme

## PAKET 5 — website katmanları (YAZI YOK)

### W2.1 Kart
**Kaydet:** `{COL}/assets/gpt/parts/card.png` · 1024×1536 · **Şeffaf zemin**
A card with a flat #00FF00 photo window.

### W2.2 Zemin
**Kaydet:** `{COL}/assets/gpt/parts/bg.png` · 1024×1024 · opak

## PAKET 2 — Örnek fotoğraflar
**Kaydet:** `{COL}/assets/gpt/photos/hero.jpg` · Dikey (1024×1280, 4:5)

## PAKET 6 — Basılı davetiye zeminleri
**Kaydet:** `{COL}/assets/gpt/print/front.png` · 1000×1400 · opak
"""


@pytest.fixture
def kok(tmp_path, monkeypatch):
    (tmp_path / COL / "assets/gpt").mkdir(parents=True)
    (tmp_path / COL / "assets/gpt/GPT_PROMPTS.md").write_text(PROMPTS, encoding="utf-8")
    tema = tmp_path / "platform/themes/deneme-tema"
    tema.mkdir(parents=True)
    (tema / "build_images.py").write_text(f'COL = ROOT / "{COL}"\n', encoding="utf-8")
    (tema / "index.html").write_text('<img src="img/card-480.webp">', encoding="utf-8")
    (tema / "theme.json").write_text("{}", encoding="utf-8")
    (tmp_path / "platform/lib/marketing").mkdir(parents=True)
    (tmp_path / "platform/lib/marketing/config.ts").write_text(
        "designs: [\n  {\n    id: 'deneme-tema',\n    name: 'Deneme',\n    status: 'coming',\n  },\n]\n", encoding="utf-8")
    (tmp_path / "gelen").mkdir()
    monkeypatch.setattr(gy, "KOK", tmp_path)
    monkeypatch.setattr(gb, "KOK", tmp_path)
    return tmp_path


def seffaf_kart(yol: Path, pencere=True, w=200, h=300):
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[30:270, 20:180] = (120, 60, 90, 255)
    if pencere:
        rgba[60:150, 50:150] = (0, 255, 0, 255)
    Image.fromarray(rgba, "RGBA").save(yol)
    return yol


def opak(yol: Path, w, h, renk=(150, 120, 110)):
    Image.new("RGB", (w, h), renk).save(yol)
    return yol


def harita(kok, d: dict) -> Path:
    p = kok / "gelen/harita.json"
    p.write_text(json.dumps(d), encoding="utf-8")
    return p


@pytest.fixture
def komutlar(monkeypatch):
    kayit = []

    def sahte(komut, cwd, env=None):
        kayit.append(komut)
        return 0, "tamam"

    monkeypatch.setattr(gy, "calistir", sahte)
    return kayit


# ---------------------------------------------------------------- eşleştirme

def test_bilinmeyen_hedef_reddedilir(kok, komutlar):
    seffaf_kart(kok / "gelen/a.png")
    rc = gy.main(["--eslestir", str(harita(kok, {"a.png": f"{COL}/assets/gpt/parts/kart.png"})), "--uygula"])
    assert rc == 1
    assert not (kok / COL / "assets/gpt/parts").exists()


def test_kuru_calisma_hicbir_sey_yazmaz(kok, komutlar):
    seffaf_kart(kok / "gelen/indirilen (3).png")
    rc = gy.main(["--eslestir", str(harita(kok, {"indirilen (3).png": f"{COL}/assets/gpt/parts/card.png"}))])
    assert rc == 0
    assert not (kok / COL / "assets/gpt/parts/card.png").exists()
    assert komutlar == []  # kuru: ne build ne gpt_bekleyen --yaz


def test_uygula_kopyalar(kok, komutlar):
    seffaf_kart(kok / "gelen/a.png")
    rc = gy.main(["--eslestir", str(harita(kok, {"a.png": f"{COL}/assets/gpt/parts/card.png"})), "--uygula"])
    assert rc == 0
    assert (kok / COL / "assets/gpt/parts/card.png").read_bytes() == (kok / "gelen/a.png").read_bytes()
    assert any("gpt_bekleyen.py" in c[1] for c in komutlar)
    assert not any("build_images.py" in c[1] for c in komutlar)  # bg.png hâlâ eksik → build atlanır


def test_farkli_dosyanin_ustune_yazilmaz(kok, komutlar):
    hedef = kok / COL / "assets/gpt/parts/bg.png"
    hedef.parent.mkdir(parents=True)
    opak(hedef, 100, 100, (10, 10, 10))
    eski = hedef.read_bytes()
    opak(kok / "gelen/b.png", 100, 100)
    h = harita(kok, {"b.png": f"{COL}/assets/gpt/parts/bg.png"})
    assert gy.main(["--eslestir", str(h), "--uygula"]) == 1
    assert hedef.read_bytes() == eski
    assert gy.main(["--eslestir", str(h), "--uygula", "--uzerine-yaz"]) == 0
    assert hedef.read_bytes() == (kok / "gelen/b.png").read_bytes()


def test_ayni_dosya_yerinde(kok):
    hedef = kok / COL / "assets/gpt/parts/bg.png"
    hedef.parent.mkdir(parents=True)
    opak(hedef, 100, 100)
    (kok / "gelen/b.png").write_bytes(hedef.read_bytes())
    p, = gy.eslestir({"b.png": f"{COL}/assets/gpt/parts/bg.png"}, kok / "gelen", False, gy.istenenler())
    assert p.durum == "YERİNDE"


@pytest.mark.parametrize("hazirla,parca", [
    (lambda k: opak(k / "gelen/x.png", 200, 300), "şeffaf değil"),
    (lambda k: seffaf_kart(k / "gelen/x.png", pencere=False), "#00FF00"),
    (lambda k: seffaf_kart(k / "gelen/x.png", w=300, h=300), "oran"),
])
def test_prompt_sarti_tutmayan_reddedilir(kok, hazirla, parca):
    hazirla(kok)
    p, = gy.eslestir({"x.png": f"{COL}/assets/gpt/parts/card.png"}, kok / "gelen", False, gy.istenenler())
    assert p.durum == "RED" and parca in p.mesaj


def test_tek_red_hicbir_seyi_kopyalatmaz(kok, komutlar):
    seffaf_kart(kok / "gelen/a.png")
    opak(kok / "gelen/b.png", 640, 300)  # bg 1:1 olmalı
    h = harita(kok, {"a.png": f"{COL}/assets/gpt/parts/card.png", "b.png": f"{COL}/assets/gpt/parts/bg.png"})
    assert gy.main(["--eslestir", str(h), "--uygula"]) == 1
    assert not (kok / COL / "assets/gpt/parts/card.png").exists()


def test_iki_gelen_ayni_hedef_ve_dis_yol_reddedilir(kok):
    seffaf_kart(kok / "gelen/a.png")
    seffaf_kart(kok / "gelen/b.png")
    ist = gy.istenenler()
    ps = gy.eslestir({"a.png": f"{COL}/assets/gpt/parts/card.png", "b.png": f"{COL}/assets/gpt/parts/card.png"},
                     kok / "gelen", False, ist)
    assert all(p.durum == "RED" for p in ps)
    p, = gy.eslestir({"a.png": f"{COL}/assets/gpt/../gpt/parts/card.png"}, kok / "gelen", False, ist)
    assert p.durum == "RED"


def test_uzanti_donusturulur_jpg_alfa_reddedilir(kok, komutlar):
    opak(kok / "gelen/f.webp", 1024, 1280)
    seffaf_kart(kok / "gelen/s.png", w=1024, h=1280)
    ist = gy.istenenler()
    p, = gy.eslestir({"f.webp": f"{COL}/assets/gpt/photos/hero.jpg"}, kok / "gelen", False, ist)
    assert p.durum == "DÖNÜŞTÜRÜLECEK"
    gy.uygula_plan([p])
    assert Image.open(kok / COL / "assets/gpt/photos/hero.jpg").format == "JPEG"
    p, = gy.eslestir({"s.png": f"{COL}/assets/gpt/photos/hero.jpg"}, kok / "gelen", True, ist)
    assert p.durum == "RED"


# ---------------------------------------------------------------- adımlar

def _hepsi_var(kok, baski=True, foto=True):
    (kok / "platform/node_modules").mkdir(exist_ok=True)  # build-print-assets'in sharp'ı
    parts = kok / COL / "assets/gpt/parts"
    parts.mkdir(parents=True, exist_ok=True)
    seffaf_kart(parts / "card.png")
    opak(parts / "bg.png", 100, 100)
    if baski:
        (kok / COL / "assets/gpt/print").mkdir(parents=True, exist_ok=True)
        opak(kok / COL / "assets/gpt/print/front.png", 100, 140)
    if foto:
        (kok / COL / "assets/gpt/photos").mkdir(parents=True, exist_ok=True)
        opak(kok / COL / "assets/gpt/photos/hero.jpg", 100, 125)


def _build_img_yazar(kok, kayit, rc_build=0):
    def sahte(komut, cwd, env=None):
        kayit.append(komut)
        if "build_images.py" in komut[1]:
            img = kok / "platform/themes/deneme-tema/img"
            img.mkdir(exist_ok=True)
            (img / "card-480.webp").write_bytes(b"x")
            (img / "manifest.json").write_text('{"_note": "GPT parts"}')
            return rc_build, "build bitti"
        return 0, "tamam"
    return sahte


def test_sira_ve_atlama(kok, monkeypatch):
    _hepsi_var(kok, baski=False)
    kayit = []
    monkeypatch.setattr(gy, "calistir", _build_img_yazar(kok, kayit))
    monkeypatch.setattr(gy, "ETSY_BILINEN", lambda: {"90"})
    t = gy.tasarimlar()["90_Deneme"]
    s = gy.adimlari_kos(t, {"baski": [f"{COL}/assets/gpt/print/front.png"]}, True, False, False)
    assert s["build_images"].durum == "TAMAM"
    assert s["baski"].durum == "ATLANDI" and "baski 1" in s["baski"].not_
    assert s["palet"].durum == "ATLANDI"  # recolor.json yok
    assert s["cikti"].durum == "TAMAM"
    assert s["theme_check"].durum == "KAPALI" and s["ilan"].durum == "KAPALI"
    assert s["etsy"].durum == "TAMAM"
    adlar = [Path(c[1]).name for c in kayit]
    assert adlar == ["build_images.py", "etsy_upload.py"]


def test_tam_sira_palet_ve_baski(kok, monkeypatch):
    _hepsi_var(kok)
    (kok / COL / "variants").mkdir()
    (kok / COL / "variants/recolor.json").write_text("{}")
    kayit = []
    monkeypatch.setattr(gy, "calistir", _build_img_yazar(kok, kayit))
    monkeypatch.setattr(gy, "ETSY_BILINEN", lambda: {"90"})
    s = gy.adimlari_kos(gy.tasarimlar()["90_Deneme"], {}, True, False, False)
    assert [s[a].durum for a in gy.ADIMLAR] == ["TAMAM", "TAMAM", "TAMAM", "TAMAM", "KAPALI", "KAPALI", "TAMAM"]
    sira = [c[1] if c[0] == "node" else Path(c[1]).name + (" " + c[2] if "recolor" in c[1] else "") for c in kayit]
    assert sira == ["build_images.py", "scripts/build-print-assets.ts", "recolor_parts.py build",
                    "recolor_parts.py check", "etsy_upload.py"]


def test_hata_tasarimi_durdurur_digerleri_surer(kok, monkeypatch, capsys):
    _hepsi_var(kok)
    ikinci = kok / "collections/91_Ikinci"
    (ikinci / "assets/gpt").mkdir(parents=True)
    (ikinci / "assets/gpt/GPT_PROMPTS.md").write_text("# yok\n")
    (kok / "platform/themes/ikinci-tema").mkdir()
    (kok / "platform/themes/ikinci-tema/build_images.py").write_text('COL = ROOT / "collections/91_Ikinci"\n')
    kayit = []

    def sahte(komut, cwd, env=None):
        kayit.append(komut)
        return (1, "patladı") if "deneme-tema" in komut[1] else (0, "tamam")

    monkeypatch.setattr(gy, "calistir", sahte)
    rc = gy.main(["--koleksiyon", "90,91", "--uygula"])
    out = capsys.readouterr().out
    assert rc == 1
    assert "| 90 deneme-tema | HATA         | DURDU" in out
    assert any("ikinci-tema" in c[1] for c in kayit)  # 91 yine koştu
    assert "live için kalanlar" in out and "göz kontrolü" in out


def test_kuru_adimlar_kosulmaz(kok, monkeypatch, capsys):
    _hepsi_var(kok)
    kayit = []
    monkeypatch.setattr(gy, "calistir", lambda k, c, e=None: kayit.append(k) or (0, ""))
    assert gy.main(["--koleksiyon", "deneme-tema"]) == 0
    assert kayit == []
    assert "ÇALIŞIR" in capsys.readouterr().out


def test_node_modules_yoksa_baski_hata(kok, monkeypatch):
    _hepsi_var(kok)
    (kok / "platform/node_modules").rmdir()
    monkeypatch.setattr(gy, "calistir", _build_img_yazar(kok, []))
    s = gy.adimlari_kos(gy.tasarimlar()["90_Deneme"], {}, True, False, False)
    assert s["baski"].durum == "HATA" and "npm ci" in s["baski"].not_
    assert s["cikti"].durum == "DURDU"


def test_theme_check_build_ister(kok, monkeypatch):
    _hepsi_var(kok)
    kayit = []
    monkeypatch.setattr(gy, "calistir", _build_img_yazar(kok, kayit))
    s = gy.adimlari_kos(gy.tasarimlar()["90_Deneme"], {}, True, True, False)
    assert s["theme_check"].durum == "HATA" and ".next" in s["theme_check"].not_
    assert s["ilan"].durum == "DURDU" and s["etsy"].durum == "DURDU"


def test_eksik_foto_theme_check_atlar(kok, monkeypatch):
    _hepsi_var(kok, foto=False)
    (kok / "platform/.next").mkdir()
    (kok / "platform/.next/BUILD_ID").write_text("x")
    kayit = []
    monkeypatch.setattr(gy, "calistir", _build_img_yazar(kok, kayit))
    s = gy.adimlari_kos(gy.tasarimlar()["90_Deneme"], {"foto": ["hero.jpg"]}, True, True, False)
    assert s["theme_check"].durum == "ATLANDI" and "foto 1" in s["theme_check"].not_


def test_interim_manifest_cikti_hatasi(kok, monkeypatch):
    _hepsi_var(kok)
    img = kok / "platform/themes/deneme-tema/img"
    img.mkdir()
    (img / "card-480.webp").write_bytes(b"x")
    (img / "manifest.json").write_text('{"_note": "interim pieces"}')
    monkeypatch.setattr(gy, "calistir", lambda k, c, e=None: (0, ""))
    s = gy.adimlari_kos(gy.tasarimlar()["90_Deneme"], {}, True, False, False)
    assert s["cikti"].durum == "HATA" and "interim" in s["cikti"].not_
