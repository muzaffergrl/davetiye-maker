"""tools/parts_prep.py için test — sahte GPT parçalarını geçici klasörde üretir (repoya ikili dosya girmez).

  python3 tools/tests/test_parts_prep.py

Denenenler: 2:3 opak → 9:16 merkez kırpma (1080×1920, 2160×3840) ve büyütme uyarısı, yatay opak (kırpılmaz),
şeffaf parçada alfa kutusu + pay, anti-alias kenarlı kemer penceresi (şeffaf, kutu doğru, yeşil kalıntı
yok, maske PNG), aynı görselde üç pencere (biri GPT gerçek yeşili (4, 251, 44)), pencereye bitişik ince
yeşil şeridin pencereye katılması ve uzak küçük lekenin pencere sayılmaması, ön cep (renkle bulunan V kenar
ve düz renkli zarfta geometrik geri düşüş), eksik dosya atlama, --comps (1080×1920 koordinatı), çıkış
kodları (0/1/2, --strict) ve assets/ korunması; GPT "bulut lekesi" (pencerede yarı saydam koyu yeşil leke),
çiçekler arasında kapalı gölgeli yeşil cep ve küçük kirli adanın pencereye katılması, pencereye bilerek konmuş
büyük süsün korunması (uyarılı), çerçeve/çiçek/kemer dışı zeminin değişmemesi.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ARACLAR = Path(__file__).resolve().parent.parent
ARAC = ARACLAR / "parts_prep.py"
sys.path.insert(0, str(ARACLAR))
import mockup_compose as mc  # noqa: E402

IVORY = (255, 249, 246)
GOLD = (200, 164, 110)
KAGIT = (227, 169, 174)
ASTAR_KOYU = (155, 93, 102)
ASTAR_ACIK = (245, 215, 215)
GPT_YESIL = (4, 251, 44)  # GPT'nin "düz #00FF00"ı gerçekte böyle (B > 40)
SS = 4  # süper örnekleme (anti-alias kenar)


def kapsama(h, w, ic, kutu=None):
    """ic(px, py) → bool; SS× süper örneklemeli kapsama 0..1 (yalnız `kutu` [x0, y0, x1, y1) içinde hesaplanır)."""
    x0, y0, x1, y1 = kutu or (0, 0, w, h)
    x0, y0, x1, y1 = max(0, int(x0) - 2), max(0, int(y0) - 2), min(w, int(x1) + 2), min(h, int(y1) + 2)
    ys, xs = np.mgrid[y0 * SS:y1 * SS, x0 * SS:x1 * SS].astype(np.float64)
    px, py = (xs + 0.5) / SS, (ys + 0.5) / SS
    out = np.zeros((h, w))
    out[y0:y1, x0:x1] = ic(px, py).reshape(y1 - y0, SS, x1 - x0, SS).mean(axis=(1, 3))
    return out


def kemer_kap(h, w, x0, y0, x1, y1):
    return kapsama(h, w, kemer(x0, y0, x1, y1), (x0, y0, x1, y1))


def kemer(x0, y0, x1, y1):
    """Üstü yarım daire kemer (dikdörtgen + yarım daire), kutu [x0, x1) × [y0, y1)."""
    r = (x1 - x0) / 2
    cx, cy = x0 + r, y0 + r

    def ic(px, py):
        govde = (px >= x0) & (px < x1) & (py >= cy) & (py < y1)
        tepe = ((px - cx) ** 2 + (py - cy) ** 2 < r * r) & (py < cy)
        return govde | tepe
    return ic


def karis(taban, renk, kap):
    return taban * (1 - kap[..., None]) + np.array(renk, np.float64) * kap[..., None]


def rgba_kaydet(rgb, alfa, yol):
    a = np.dstack([np.clip(np.rint(rgb), 0, 255), np.clip(np.rint(alfa), 0, 255)]).astype(np.uint8)
    Image.fromarray(a, "RGBA").save(yol)


# ----------------------------------------------------------------------------- sahte parçalar

def bg_scene(yol):
    h, w = 1536, 1024
    a = np.zeros((h, w, 3), np.float64)
    a[:] = (240, 215, 214)
    a[:, :60] = (255, 0, 0)       # kırpılması gereken kenar şeritleri (9:16 kırpma x 80..944)
    a[:, 964:] = (0, 0, 255)
    a[700:836, 480:544] = (60, 40, 46)  # merkez işareti
    Image.fromarray(a.astype(np.uint8), "RGB").save(yol)


def web_hero(yol):
    Image.new("RGB", (1536, 1024), (238, 210, 210)).save(yol)


def card_small(yol):
    """Şeffaf zemin, ivory kart [200, 824) × [300, 1300), kemer penceresi [362, 662) × [380, 760)."""
    h, w = 1536, 1024
    kart = kapsama(h, w, lambda px, py: (px >= 200) & (px < 824) & (py >= 300) & (py < 1300), (200, 300, 824, 1300))
    rgb = np.zeros((h, w, 3)) + IVORY
    rgb = karis(rgb, GOLD, kemer_kap(h, w, 354, 372, 670, 768))  # altın kenar
    rgb = karis(rgb, (0, 255, 0), kemer_kap(h, w, 362, 380, 662, 760))
    rgba_kaydet(rgb, kart * 255, yol)
    return (362, 380, 300, 380), (200, 300)  # pencere kutusu (kaynak), kırpma başlangıcı (pay öncesi)


def trio(yol):
    """Şeffaf zemin üstünde 3 altın kemer çerçeve + 1 küçük yeşil leke."""
    h, w = 1024, 1536
    alfa = np.zeros((h, w))
    rgb = np.zeros((h, w, 3)) + GOLD
    kutular = [(180, 300, 380, 760), (620, 220, 900, 760), (1140, 300, 1340, 760)]
    for (x0, y0, x1, y1), yesil in zip(kutular, ((0, 255, 0), GPT_YESIL, (0, 255, 0))):
        alfa = np.maximum(alfa, kemer_kap(h, w, x0 - 24, y0 - 24, x1 + 24, y1 + 24) * 255)
        rgb = karis(rgb, yesil, kemer_kap(h, w, x0, y0, x1, y1))
    rgb[762:766, 200:360] = GPT_YESIL  # 1. pencerenin 2 px altında ince yeşil şerit: pencereye katılmalı
    alfa[900:960, 700:820] = 255
    rgb[920:926, 740:746] = (0, 255, 0)  # 36 px uzak leke: pencere değil
    rgba_kaydet(rgb, alfa, yol)
    return [(180, 300, 380, 766)] + kutular[1:]


def florals(yol):
    h, w = 1024, 1024
    yy, xx = np.mgrid[0:h, 0:w]
    alfa = (((xx - 300) ** 2 + (yy - 260) ** 2) < 150 ** 2) * 255.0
    rgb = np.zeros((h, w, 3)) + (227, 169, 174)
    rgba_kaydet(rgb, alfa, yol)
    return (150, 110, 450, 410)  # alfa kutusu [x0, y0, x1, y1)


def envelope_open(yol, duz=False):
    """Kare gövde [212, 812) × [800, 1400), kapak üçgeni yukarıda, gövde içinde V cep kenarı:
    (212, 860) → (512, 1060) → (812, 860). Kenarın üstü astar (şerit), altı kağıt. Altta yumuşak gölge."""
    h, w = 1536, 1024
    rng = np.random.default_rng(3)
    ys, xs = np.mgrid[0:h, 0:w] + 0.5
    serit = ((ys // 10) % 2 == 0)[..., None]
    astar = np.where(serit, np.array(ASTAR_KOYU, float), np.array(ASTAR_ACIK, float))
    kagit = np.zeros((h, w, 3)) + KAGIT + rng.normal(0, 3, (h, w, 1))
    v = 860 + 200 * (1 - np.abs(xs - 512) / 300).clip(0, 1)
    rgb = kagit if duz else np.where((ys < v)[..., None], astar, kagit)
    kapak = kapsama(h, w, lambda px, py: (py < 800) & (py >= 500) & (np.abs(px - 512) < (py - 500)), (212, 500, 812, 800))
    govde = kapsama(h, w, lambda px, py: (px >= 212) & (px < 812) & (py >= 800) & (py < 1400), (212, 800, 812, 1400))
    alfa = np.maximum(kapak, govde) * 255
    golge = (ys > 1400) & (ys < 1420) & (xs > 222) & (xs < 802)
    alfa[golge] = 50
    rgb = np.where(golge[..., None], 40.0, rgb)
    rgba_kaydet(rgb, alfa, yol)


def scene_3_comp(yol):
    h, w = 1536, 1024
    rgb = np.zeros((h, w, 3)) + (240, 215, 214)
    for x0, x1 in ((200, 360), (432, 592), (664, 824)):
        rgb = karis(rgb, (0, 255, 0), kemer_kap(h, w, x0, 600, x1, 900))
    Image.fromarray(np.rint(rgb).astype(np.uint8), "RGB").save(yol)


PROMPTS = """# test
## PAKET 4 — TASARIM
**Kaydet:** `collections/TEST/assets/gpt/comps/scene_3_comp.png` · 1024×1536
**Kaydet:** `collections/TEST/assets/gpt/parts/bg_scene.png` · 1024×1536
**Kaydet:** `collections/TEST/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**
**Kaydet:** `collections/TEST/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**
An arch-shaped photo window filled with flat pure green #00FF00.
**Kaydet:** `collections/TEST/assets/gpt/parts/trio.png` · 1536×1024 · **Şeffaf zemin**
**Kaydet:** `collections/TEST/assets/gpt/parts/florals_tl.png` · 1024×1024 · **Şeffaf zemin**
**Kaydet:** `collections/TEST/assets/gpt/parts/web_hero.png` · 1536×1024
Test only: a window of flat pure green #00FF00 is requested here but the image has none.
**Kaydet:** `collections/TEST/assets/gpt/parts/petals.png` · 1024×1024 · **Şeffaf zemin**
## PAKET 3 — mockup
**Kaydet:** `collections/TEST/assets/gpt/mockups/phone.png` · 1024×1536
"""


def kit(t: Path, duz_zarf=False) -> Path:
    k = t / ("kit_duz" if duz_zarf else "kit")
    for d in ("parts", "comps", "mockups"):
        (k / "assets/gpt" / d).mkdir(parents=True)
    (k / "assets/gpt/GPT_PROMPTS.md").write_text(PROMPTS, encoding="utf-8")
    p = k / "assets/gpt/parts"
    bg_scene(p / "bg_scene.png")
    web_hero(p / "web_hero.png")
    card_small(p / "card_small.png")
    trio(p / "trio.png")
    florals(p / "florals_tl.png")
    envelope_open(p / "envelope_open.png", duz=duz_zarf)
    scene_3_comp(k / "assets/gpt/comps/scene_3_comp.png")
    # petals.png bilerek yok (eksik dosya)
    return k


def calistir(*arg):
    r = subprocess.run([sys.executable, str(ARAC), *map(str, arg)], capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def yesil_kalinti(a: np.ndarray) -> int:
    """Görünür (alfa > 0) piksellerde #00FF00 (±40) ya da belirgin yeşil baskınlık sayısı."""
    rgb = a[..., :3].astype(np.int16)
    gorunur = a[..., 3] > 0
    tam = mc.yesil_maske(a[..., :3], 40) & gorunur
    baskin = ((rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2])) > 12) & (a[..., 3] > 25)
    return int(tam.sum() + baskin.sum())


def yakin(a, b, tol, msg):
    assert all(abs(x - y) <= tol for x, y in zip(a, b)), f"{msg}: {a} ≠ {b} (±{tol})"


# ----------------------------------------------------------------------------- testler

def test_ana_akis(t: Path):
    k = kit(t)
    kod, out = calistir(k, "--comps")
    assert kod == 0, out
    o = k / "kit_layers"
    j = json.loads((o / "windows.json").read_text(encoding="utf-8"))
    assert "EKSİK" in out and "petals.png" in out and str(k / "assets/gpt/parts/petals.png") in j["eksik"][0], out

    # 2:3 opak → 9:16
    for W, H in ((1080, 1920), (2160, 3840)):
        im = Image.open(o / f"bg_scene_{W}x{H}.jpg")
        assert im.size == (W, H) and im.mode == "RGB", im
        a = np.asarray(im).astype(int)
        assert ((a[..., 0] - a[..., 1]) > 100).sum() == 0, "kırmızı kenar şeridi kırpılmamış"
        assert ((a[..., 2] - a[..., 0]) > 60).sum() == 0, "mavi kenar şeridi kırpılmamış"
        merkez = a[H // 2, W // 2]
        assert merkez.max() < 90, f"merkez işareti kaymış: {merkez}"
    bg = next(x for x in j["katmanlar"] if x["ad"] == "bg_scene")
    assert bg["kirpma"] == [80, 0, 864, 1536], bg
    assert any("büyütme" in u and "bg_scene" in u for u in j["uyarilar"]), j["uyarilar"]
    bulunamadi = [u for u in j["uyarilar"] if "pencere isteniyor" in u]
    assert len(bulunamadi) == 1 and bulunamadi[0].startswith("web_hero"), j["uyarilar"]

    # yatay opak: kırpılmaz
    assert Image.open(o / "web_hero.jpg").size == (1536, 1024)

    # alfa kutusu + pay
    fl = Image.open(o / "florals_tl.png")
    x0, y0, x1, y1 = 150, 110, 450, 410
    assert fl.size == (x1 - x0 - 1 + 16, y1 - y0 - 1 + 16), fl.size  # daire kenarı: < r (uçlar dahil değil)
    assert np.asarray(fl)[..., 3][:6].max() == 0, "pay şeffaf değil"

    # kemer penceresi
    kart = np.asarray(Image.open(o / "card_small.png"))
    assert kart.shape[:2] == (1000 + 16, 624 + 16), kart.shape
    p = j["pencereler"]["card_small"]
    assert len(p) == 1, p
    beklenen = [362 - 200 + 8, 380 - 300 + 8, 300, 380]
    yakin(p[0]["kutu"], beklenen, 2, "kart pencere kutusu")
    x, y, w, h = p[0]["kutu"]
    ic = kart[y + w // 2:y + h - 3, x + 3:x + w - 3, 3]  # kemer merkezinin altı
    assert ic.max() == 0, "pencere içi şeffaf değil"
    assert kart[y + h + 6, x + w // 2, 3] == 255 and kart[y - 30, x + w // 2, 3] == 255, "kart pencere dışında delik"
    assert yesil_kalinti(kart) == 0, f"yeşil kalıntı: {yesil_kalinti(kart)}"
    m = Image.open(o / p[0]["maske"])
    assert m.size == (w, h) and m.mode == "RGBA", m
    ma = np.asarray(m)[..., 3]
    assert ma[h - 5, w // 2] == 255 and ma[2, 2] == 0, "maske kemer şeklinde değil (köşe dolu)"
    assert 0.85 < p[0]["doluluk"] < 0.95, p[0]["doluluk"]

    # çoklu pencere + leke
    tr = np.asarray(Image.open(o / "trio.png"))
    pw = j["pencereler"]["trio"]
    assert len(pw) == 3, pw
    tr_kirp = next(x for x in j["katmanlar"] if x["ad"] == "trio")["kirpma"]
    for kayit, (x0, y0, x1, y1) in zip(pw, trio(t / "_trio_tmp.png")):
        yakin(kayit["kutu"], [x0 - tr_kirp[0], y0 - tr_kirp[1], x1 - x0, y1 - y0], 2, "trio pencere")
        x, y, w, h = kayit["kutu"]
        assert tr[y + 5:y + h - 5, x + w // 2 - 5:x + w // 2 + 5, 3].max() == 0
    assert yesil_kalinti(tr) > 0, "küçük leke pencere sayılmamalıydı (görünür kalır)"
    assert any("trio" in u and "küçük yeşil" in u for u in j["uyarilar"]), j["uyarilar"]
    leke_disi = tr.copy()
    leke_disi[880 - tr_kirp[1]:980 - tr_kirp[1]] = 0
    assert yesil_kalinti(leke_disi) == 0, "pencere kenarında yeşil kalıntı"

    # ön cep (renkle)
    zarf = np.asarray(Image.open(o / "envelope_open.png"))
    cep = np.asarray(Image.open(o / "envelope_pocket_front.png"))
    assert zarf.shape == cep.shape, (zarf.shape, cep.shape)
    c = j["cep"]
    assert c["yontem"] == "renk", c
    zk = next(x for x in j["katmanlar"] if x["ad"] == "envelope_open")["kirpma"]
    ox, oy = zk[0], zk[1]
    (sx, sy), (mx, my), (rx, ry) = c["kenar_sol_orta_sag"]
    assert abs(my - (1060 - oy)) <= 3, (my, 1060 - oy)
    assert abs(sy - (860 - oy)) <= 4 and abs(ry - (860 - oy)) <= 4, c
    a = cep[..., 3]
    assert a[1060 - oy + 10, 512 - ox] == 255 and a[1060 - oy - 10, 512 - ox] == 0, "V ortası yanlış"
    assert a[900 - oy, 260 - ox] == 255 and a[840 - oy, 260 - ox] == 0, "V kenarı yanlış"
    assert a[1390 - oy, 512 - ox] == 255, "cep altı eksik"
    assert a[1410 - oy].max() == 0, "gölge cep katmanına girmiş"
    assert a[700 - oy].max() == 0, "kapak cep katmanında"
    assert zarf[700 - oy, 512 - ox, 3] == 255, "zarf katmanı bozulmuş"

    # comp pencereleri 1080×1920 koordinatında (kırpma x0 = 80, ölçek 1,25)
    cp = j["comp_pencereleri"]["scene_3_comp"]
    assert len(cp) == 3 and all(p["katman"] is None for p in cp), cp
    for kayit, x0 in zip(cp, (200, 432, 664)):
        yakin(kayit["kutu"], [(x0 - 80) * 1.25, (600 - 0) * 1.25, 160 * 1.25, 300 * 1.25], 3, "comp pencere")
        assert (o / kayit["maske"]).exists()
    assert not list(o.glob("scene_3_comp*.*")), "comp katmanı yazılmamalı"

    # --strict: eksik dosya → 1
    kod, out = calistir(k, "--strict", "--out", t / "strict_out")
    assert kod == 1, out


def test_geometrik_cep(t: Path):
    k = kit(t, duz_zarf=True)
    kod, out = calistir(k, "--json")
    assert kod == 0, out
    j = json.loads(out)
    assert j["cep"]["yontem"] == "geometrik", j["cep"]
    assert any("geometrik" in u for u in j["uyarilar"]), j["uyarilar"]
    cep = np.asarray(Image.open(k / "kit_layers/envelope_pocket_front.png"))
    zk = next(x for x in j["katmanlar"] if x["ad"] == "envelope_open")["kirpma"]
    a = cep[..., 3]
    assert a[1390 - zk[1], 512 - zk[0]] == 255 and a[820 - zk[1], 512 - zk[0]] == 0, "geometrik cep yanlış"
    kod, _ = calistir(k, "--strict", "--out", t / "x")
    assert kod == 1


def test_cikis_kodlari(t: Path):
    # hiç kaynak yok → 1, çıktı klasörü açılmaz
    k = t / "bos"
    (k / "assets/gpt").mkdir(parents=True)
    (k / "assets/gpt/GPT_PROMPTS.md").write_text(PROMPTS, encoding="utf-8")
    kod, out = calistir(k)
    assert kod == 1 and out.count("EKSİK") == 7, out
    assert not (k / "kit_layers").exists()
    # GPT_PROMPTS.md yok → 2
    (t / "yok").mkdir()
    kod, out = calistir(t / "yok")
    assert kod == 2, out
    # parts satırı yok → 2
    k2 = t / "partsiz"
    (k2 / "assets/gpt").mkdir(parents=True)
    (k2 / "assets/gpt/GPT_PROMPTS.md").write_text("**Kaydet:** `x/assets/gpt/mockups/a.png` · 1024×1536\n")
    kod, out = calistir(k2)
    assert kod == 2, out
    # assets/ altına yazma → 2, hiçbir şey yazılmaz
    kod, out = calistir(k, "--out", "assets/gpt/parts")
    assert kod == 2 and "assets" in out, out
    # bozuk kaynak → 1
    k3 = t / "bozuk"
    (k3 / "assets/gpt/parts").mkdir(parents=True)
    (k3 / "assets/gpt/GPT_PROMPTS.md").write_text(PROMPTS, encoding="utf-8")
    (k3 / "assets/gpt/parts/web_hero.png").write_bytes(b"not a png")
    florals(k3 / "assets/gpt/parts/florals_tl.png")
    kod, out = calistir(k3)
    assert kod == 1 and "HATA" in out and "florals_tl" in out, out


def bulutlu_cerceve(yol):
    """GPT'nin gerçek kusuru (tasarım 03 arch_frame, frame_landscape): şeffaflık yeşil pencerenin ortasına sızar →
    yarı saydam, koyu yeşil "bulut lekesi". Ayrıca: pencerenin altına binen çiçekler (opak pembe daireler)
    ve aralarında kapalı kalmış, gölgede koyulaşmış yeşil cep; 3×3 kirli piksel; pencereye bilerek konmuş
    60×60 fildişi süs (korunmalı). Kemer dışındaki şeffaf zemin pencere kutusunun köşelerine girer."""
    h, w = 1024, 1536
    rgb = np.zeros((h, w, 3)) + GOLD
    alfa = kemer_kap(h, w, 300, 150, 1236, 900) * 255
    rgb = karis(rgb, (0, 255, 0), kemer_kap(h, w, 360, 210, 1176, 840))
    ys, xs = np.mgrid[0:h, 0:w] + 0.5
    # bulut: merkezde alfa ≈ 13 ve koyu yeşil (2, 93, 1), kenara doğru düz yeşile ve tam alfaya yumuşak geçiş
    d = np.sqrt(((xs - 768) / 250) ** 2 + ((ys - 560) / 120) ** 2)
    p = np.clip(1 - d, 0, 1) ** 0.6
    alfa = alfa * (1 - 0.95 * p)
    rgb = karis(rgb, (2, 93, 1), p)
    # çiçekler pencerenin alt kenarına biner; üçünün arasında kapalı bir cep kalır
    for cx, cy in ((440, 830), (540, 830), (490, 744)):
        kap = kapsama(h, w, lambda px, py, cx=cx, cy=cy: (px - cx) ** 2 + (py - cy) ** 2 < 58 ** 2,
                      (cx - 60, cy - 60, cx + 60, cy + 60))
        rgb = karis(rgb, KAGIT, kap)
        alfa = np.maximum(alfa, kap * 255)
    rgb[((xs - 490) ** 2 + (ys - 802) ** 2 < 7 ** 2)] = (30, 110, 20)  # çiçeklerin arasında gölgedeki pencere yeşili
    rgb[300:303, 700:703] = (200, 190, 180)  # kirli piksel
    rgb[400:460, 1000:1060] = IVORY            # bilerek konmuş süs
    rgba_kaydet(rgb, alfa, yol)


def test_bulut_lekesi(t: Path):
    k = t / "kit_bulut"
    (k / "assets/gpt/parts").mkdir(parents=True)
    (k / "assets/gpt/GPT_PROMPTS.md").write_text(
        "**Kaydet:** `collections/TEST/assets/gpt/parts/bulut.png` · 1536×1024 · **Şeffaf zemin**\n"
        "Frame window flat pure green #00FF00.\n", encoding="utf-8")
    bulutlu_cerceve(k / "assets/gpt/parts/bulut.png")
    kaynak = np.asarray(Image.open(k / "assets/gpt/parts/bulut.png"))
    kod, out = calistir(k, "--json")
    assert kod == 0, out
    j = json.loads(out)
    p = j["pencereler"]["bulut"]
    assert len(p) == 1, p
    assert p[0]["leke_px"] > 20000, p[0]  # bulutun eşik altı kısmı (alfa < 128) pencereye katıldı
    ox, oy = next(x for x in j["katmanlar"] if x["ad"] == "bulut")["kirpma"][:2]
    a = np.asarray(Image.open(k / "kit_layers/bulut.png"))
    al = a[..., 3]

    def A(x, y):
        return int(al[y - oy, x - ox])

    assert A(768, 560) == 0, "bulut merkezi (alfa 13, koyu yeşil) şeffaf değil"
    assert A(600, 560) == 0 and A(900, 600) == 0 and A(768, 470) == 0, "bulutun yarı saydam kenarı kaldı"
    assert A(490, 802) == 0, "çiçeklerin arasındaki gölgeli yeşil cep kaldı"
    assert A(701, 301) == 0, "pencere içindeki küçük kirli ada kaldı"
    assert A(1030, 430) == 255, "pencereye bilerek konmuş büyük opak süs silinmiş"
    assert any("ada korundu" in u for u in j["uyarilar"]), j["uyarilar"]
    assert A(440, 830) == 255 and A(490, 744) == 255, "pencereye binen çiçek delinmiş"
    assert A(330, 600) == 255 and A(768, 180) == 255, "çerçeve delinmiş"
    assert A(320, 170) == 0 == kaynak[170, 320, 3], "kemer dışındaki zemin değişmiş"
    # pencere kutusu kemer + bulut taşması değil: kaynaktaki pencereyle aynı (±2)
    yakin(p[0]["kutu"], [360 - ox, 210 - oy, 816, 630], 2, "bulutlu pencere kutusu")
    # pencere maskesi tam: kemerin içi 255 (bulut ve cep dahil; süs hariç)
    m = np.asarray(Image.open(k / "kit_layers" / p[0]["maske"]))[..., 3]
    x0, y0 = p[0]["kutu"][:2]
    assert m[560 - oy - y0, 768 - ox - x0] == 255 and m[802 - oy - y0, 490 - ox - x0] == 255
    assert m[430 - oy - y0, 1030 - ox - x0] == 0
    # görünür yeşil kalıntı yok (çiçek/çerçeve/süs dahil bütün görünür pikseller)
    assert yesil_kalinti(a) == 0, f"yeşil kalıntı: {yesil_kalinti(a)}"


def main():
    with tempfile.TemporaryDirectory() as t:
        t = Path(t)
        for test in (test_ana_akis, test_geometrik_cep, test_cikis_kodlari, test_bulut_lekesi):
            d = t / test.__name__
            d.mkdir()
            test(d)
            print(f"  {test.__name__}: tamam")
    print("test_parts_prep: tamam")


if __name__ == "__main__":
    main()
