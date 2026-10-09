"""tools/kit_build.py için test — sahte ham GPT dosyalarını repo DIŞINA (geçici klasör) üretir,
tasarım 02'nin gerçek kit_map.json'u ve dondurulmuş maskeleriyle aracı çalıştırır.

  python3 tools/tests/test_kit_build.py
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
ARAC = ROOT / "tools/kit_build.py"
HARITA = ROOT / "collections/02_Dusty_Blue/kit_map.json"
MASKELER = ROOT / "collections/02_Dusty_Blue/assets/layers"

BEKLENEN = {
    "bg_mist.jpg": (2160, 3840), "botanical_tl.png": (800, 800), "botanical_br.png": (820, 820),
    "card_botanical_tl.png": (500, 500), "card_botanical_br.png": (500, 500),
    "envelope_back.png": (2040, 1480), "envelope_pocket.png": (1800, 1240),
    "envelope_flap_closed.png": (1816, 816), "envelope_liner_open.png": (1776, 760),
    "card_small_blank.png": (1640, 1200), "invitation_card_blank.png": (2080, 3280),
    "polaroid_frame.png": (1080, 1260), "wax_seal.png": (496, 496),
    "photo_placeholder_wide.jpg": (1360, 620), "photo_placeholder_1.jpg": (792, 832),
    "photo_placeholder_2.jpg": (792, 832), "photo_placeholder_3.jpg": (792, 832),
}
DOKU = ["envelope_back.png", "envelope_pocket.png", "envelope_flap_closed.png", "card_small_blank.png",
        "invitation_card_blank.png", "polaroid_frame.png"]
KAGIT = (236, 226, 208)


def maske_durumu():
    r = subprocess.run(["git", "status", "--porcelain", "--", str(MASKELER)], cwd=ROOT, capture_output=True, text=True)
    return r.stdout.strip()


def sahte_kit(k: Path, photos: Path, eksik=()):
    rng = np.random.default_rng(7)
    for d in ("textures", "decor"):
        (k / "assets/gpt" / d).mkdir(parents=True, exist_ok=True)
    photos.mkdir(parents=True, exist_ok=True)
    dosyalar = {}
    # düz kağıt (hafif gren) — ortalama KAGIT
    kag = np.clip(np.array(KAGIT, np.float32) + rng.normal(0, 2, (1024, 1024, 3)), 0, 255).astype(np.uint8)
    dosyalar["textures/ivory_paper.png"] = Image.fromarray(kag, "RGB")
    # astar: çizgili desen
    lin = np.zeros((1024, 1024, 3), np.uint8)
    lin[:] = (120, 140, 170)
    lin[::32] = (230, 220, 200)
    dosyalar["textures/envelope_liner.png"] = Image.fromarray(lin, "RGB")
    dosyalar["textures/background_mist.png"] = Image.new("RGB", (1024, 1536), (210, 220, 230))
    # mühür: ortada şeffaf zeminde daire
    a = np.zeros((1024, 1024, 4), np.uint8)
    yy, xx = np.ogrid[:1024, :1024]
    a[(yy - 512) ** 2 + (xx - 512) ** 2 < 300 ** 2] = (150, 60, 70, 255)
    dosyalar["decor/wax_seal_blank.png"] = Image.fromarray(a, "RGBA")
    # botanik: yalnız sol üst çeyrekte içerik
    b = np.zeros((1024, 1024, 4), np.uint8)
    b[40:400, 40:400] = (120, 150, 110, 255)
    dosyalar["decor/botanical_corner.png"] = Image.fromarray(b, "RGBA")
    for ad, im in dosyalar.items():
        if ad not in eksik:
            im.save(k / "assets/gpt" / ad)
    Image.new("RGB", (1024, 1536), (180, 160, 150)).save(photos / "hero_portrait.jpg")
    for i in (1, 2, 3):
        Image.new("RGB", (1024, 1024), (100 + 30 * i, 120, 140)).save(photos / f"moment_{i}.jpg")


def calistir(k: Path, harita: Path, *ek):
    r = subprocess.run([sys.executable, str(ARAC), str(k), "--map", str(harita), *ek], capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def main():
    once = maske_durumu()
    with tempfile.TemporaryDirectory() as t:
        t = Path(t)
        # 1) tam kit: 17 katman, doğru ad/ölçü
        kit, photos = t / "V99_test", t / "photos"
        sahte_kit(kit, photos)
        kod, out = calistir(kit, HARITA, "--photos", str(photos))
        assert kod == 0, out
        assert "17/17 katman üretildi, 0 atlandı" in out, out
        cikti = kit / "kit_layers"
        assert sorted(p.name for p in cikti.iterdir()) == sorted(BEKLENEN), sorted(p.name for p in cikti.iterdir())
        for ad, olcu in BEKLENEN.items():
            im = Image.open(cikti / ad)
            assert im.size == olcu, (ad, im.size, olcu)
            if ad.endswith(".jpg"):
                assert im.format == "JPEG" and im.mode == "RGB", (ad, im.format, im.mode)
            else:
                assert im.mode == "RGBA", (ad, im.mode)
        # 2) texture_mask: maske alfası birebir korunur; gölge ortalaması ≈ 1 (renk ≈ kağıt)
        for ad in DOKU + ["envelope_liner_open.png"]:
            o = np.asarray(Image.open(cikti / ad).convert("RGBA"))
            m = np.asarray(Image.open(MASKELER / ad).convert("RGBA"))
            assert np.array_equal(o[..., 3], m[..., 3]), f"{ad}: alfa değişmiş"
        for ad in DOKU:
            o = np.asarray(Image.open(cikti / ad).convert("RGBA")).astype(float)
            dolu = o[..., 3] >= 250
            ort = o[..., :3][dolu].mean(0)
            assert np.all(np.abs(ort / np.array(KAGIT) - 1) < 0.04), (ad, ort)
        # 3) rotate 180: botanik içerik sağ altta
        br = np.asarray(Image.open(cikti / "botanical_br.png"))[..., 3]
        h = br.shape[0] // 2
        assert br[h:, h:].sum() > 0 and br[:h, :h].sum() == 0, "botanical_br döndürülmemiş"
        tl = np.asarray(Image.open(cikti / "botanical_tl.png"))[..., 3]
        assert tl[:400, :400].sum() > 0 and tl[400:, 400:].sum() == 0, "botanical_tl yanlış"
        # 4) mühür: kırp + ölçekle → kenarlar şeffaf, içerik büyük
        ws = np.asarray(Image.open(cikti / "wax_seal.png"))[..., 3]
        assert ws[:20].max() == 0 and (ws > 200).mean() > 0.5, "wax_seal kırpma/ölçek yanlış"

        # 5) eksik kaynak: atla + uyarı, çıkış 0
        kit2 = t / "V98_eksik"
        sahte_kit(kit2, t / "photos2", eksik=("textures/ivory_paper.png", "decor/wax_seal_blank.png"))
        kod, out = calistir(kit2, HARITA, "--photos", str(t / "photos2"))
        assert kod == 0, out
        assert "10/17 katman üretildi, 7 atlandı" in out and out.count("ATLANDI") == 7, out
        # --photos olmadan: ortak fotoğraflar haritanın koleksiyon kökünden (repo; boş) → 4 atlanır, çıkış 0
        kod, out = calistir(kit2, HARITA)
        assert kod == 0 and "6/17" in out and "hero_portrait.jpg" in out, out

        # 6) isteğe bağlı texture_mask_lines: altın çizgiler palette.gold ile boyanır
        kit3 = t / "V97_lines"
        sahte_kit(kit3, t / "photos3")
        (kit3 / "palette.json").write_text(json.dumps({"gold": "#C9A96E"}))
        h3 = t / "map_lines.json"
        h3.write_text(json.dumps({"masks": str(MASKELER), "out": "lines", "layers": [
            {"name": "invitation_card_blank.png", "size": [2080, 3280], "source": "assets/gpt/textures/ivory_paper.png",
             "method": "texture_mask_lines", "mask": "invitation_card_blank.png", "line_color": "palette.gold"}]}))
        kod, out = calistir(kit3, h3)
        assert kod == 0 and "1/1" in out, out
        o = np.asarray(Image.open(kit3 / "lines/invitation_card_blank.png").convert("RGB")).astype(float)
        m = np.asarray(Image.open(MASKELER / "invitation_card_blank.png").convert("RGBA")).astype(float)
        cizgi = (m[..., :3].max(-1) - m[..., :3].min(-1) > 45) & (m[..., 3] >= 250)
        assert cizgi.sum() > 1000
        assert np.all(np.abs(o[cizgi].mean(0) - np.array([0xC9, 0xA9, 0x6E])) < 25), o[cizgi].mean(0)

        # 6b) texture_mask + color: açık kağıttan renkli zarf (ortalama ≈ color, alfa korunur)
        (kit3 / "palette.json").write_text(json.dumps({"primary": "#E3A9AE"}))
        h6 = t / "map_color.json"
        h6.write_text(json.dumps({"masks": str(MASKELER), "out": "renk", "layers": [
            {"name": "envelope_back.png", "size": [2040, 1480], "source": "assets/gpt/textures/ivory_paper.png",
             "method": "texture_mask", "mask": "envelope_back.png", "color": "palette.primary"}]}))
        kod, out = calistir(kit3, h6)
        assert kod == 0 and "1/1" in out, out
        o = np.asarray(Image.open(kit3 / "renk/envelope_back.png").convert("RGBA")).astype(float)
        m = np.asarray(Image.open(MASKELER / "envelope_back.png").convert("RGBA"))
        assert np.array_equal(o[..., 3], m[..., 3]), "renkli zarfta alfa değişmiş"
        ort = o[..., :3][o[..., 3] >= 250].mean(0)
        assert np.all(np.abs(ort / np.array([0xE3, 0xA9, 0xAE]) - 1) < 0.06), ort

        # 7) geçersiz harita → 2
        bozuk = t / "bozuk.json"
        bozuk.write_text(json.dumps({"layers": [{"name": "x.png", "size": [10], "source": "a.png", "method": "zoom"}]}))
        kod, out = calistir(kit, bozuk)
        assert kod == 2 and "geçersiz" in out, out

        # 8) koruma: çıktı maske klasörü ya da collections/*/assets/layers olamaz
        for hedef in (str(MASKELER), str(t / "collections/X/assets/layers")):
            h8 = t / "map_guard.json"
            h8.write_text(json.dumps({"masks": str(MASKELER), "out": hedef, "layers": [
                {"name": "bg_mist.jpg", "size": [2160, 3840], "source": "assets/gpt/textures/background_mist.png", "method": "cover"}]}))
            kod, out = calistir(kit, h8)
            assert kod == 2 and "reddedildi" in out, out
        assert not (t / "collections").exists()

    sonra = maske_durumu()
    assert once == sonra == "", f"maske klasöründe değişiklik: {sonra!r}"
    print("test_kit_build: tamam (17 katman, alfa korundu, JPG opak, eksik kaynak atlandı, koruma çalışıyor, maskeler temiz)")


if __name__ == "__main__":
    main()
