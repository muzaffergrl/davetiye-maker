#!/usr/bin/env python3
"""Blush Garden Rose teması — img/ klasörünü GPT parçalarından üretir. Yalnız teknik hazırlık (K21):
kırpar, maskeler, keser, bulanıklaştırır, ölçekler; yeni şekil çizmez.

  python3 platform/themes/blush-garden-rose/build_images.py [--prep-dir DIR] [--q 80] [--out DIR]

Kaynak: collections/03_Blush_Garden_Rose/assets/gpt/parts/ (G030/G047). Önce tools/parts_prep.py çalışır
(alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" şeffaf, windows.json); ara çıktı geçici klasöre
(ya da --prep-dir; tema klasörünün içi reddedilir) yazılır, repoya girmez. Görsel yardımcıları ortak modülden:
tools/tema_build.py (G054; webp, kesimler, foto alanı, serbest bölge, yer tutucu, og, ikon, hiza, denetimler).
G054 öncesi çıktıyla bayt bayt aynı (bütün webp ve mask_*.png); manifest.json yalnız ek anahtarlar aldı
(kesim `method`, `og`, `favicon`, `align`, `checks`). `--out` başka klasöre üretir (yeniden üretim denetimi,
tools/tests/test_tema_build.py).

G035 demosundan farkları (platform teması):
  * Fotoğraf görsele PİŞİRİLMEZ. Her foto alanı nötr bir yer tutucu alır (img/ph_<anahtar>-<w>.webp:
    bg_scene'den yumuşak, tonlanmış kırpım); alıcının fotoğrafını platform `data-photo` ile üstüne koyar.
  * Mekân: GPT yatay altın çerçeve (frame_landscape, G047) + pencere maskesi (img/mask_landscape.png).
  * Kapalı zarfın kapağı ayrı katman (img/env_cflap-*.webp): tırtıklı kenarı izlenerek kesilir, açılışta
    menteşesinde 3D kalkar; sonra açık zarfın kapağı (env_flap) devralır.
  * Paylaşım görseli img/og-1200x630.jpg (web_hero'dan alt hizalı 1.91:1 kırpım, yazısız) ve img/favicon.png
    (ribbon_bow'dan kare ikon); etiketleri motor yazar (G055).
Çıktı: img/*.webp, img/mask_*.png, img/og-1200x630.jpg, img/favicon.png, img/manifest.json (ölçüler, foto alanı
kutuları, kart serbest bölgeleri, kapak geometrisi, kapalı/açık zarf hiza ölçümü). site.css'teki yüzdeler
manifest'ten alınmıştır; görsel değişirse onlar da güncellenir. Tema klasörü ≤ 3 MB (aşarsa çıkış ≠ 0).
Bağımlılık: Pillow + numpy.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/03_Blush_Garden_Rose"
PARTS = COL / "assets/gpt/parts"
sys.dont_write_bytecode = True  # tools/ klasörüne __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

WIDTHS = {
    "envelope_closed": [440, 880], "envelope_open": [440, 880], "pocket": [440, 880], "env_cflap": [440, 880],
    "ribbon_bow": [480, 960], "card_small": [320, 640], "invitation_card": [480, 960], "info_card": [480, 960],
    "arch_frame": [320, 640], "frame_landscape": [480, 960], "florals_tl": [480, 960], "florals_br": [480, 960],
    "divider": [300],
}
# foto anahtarı → (pencere, çıktı genişlikleri, bg_scene yer tutucu kırpım kutusu)  — theme.json photos ile aynı anahtarlar
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (20, 30, 500, 530)),
    "story_1": ("arch", [300, 600], (0, 100, 400, 650)),
    "story_2": ("arch", [300, 600], (600, 980, 1024, 1536)),
    "story_3": ("arch", [300, 600], (520, 40, 960, 640)),
    "venue": ("landscape", [480, 960], (0, 850, 1024, 1536)),
}


def uyar(ad: str, bilgi: dict):
    for u in bilgi.get("warnings", []):
        print(f"UYARI  {ad}: {u}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prep-dir", help="parts_prep çıktısı için klasör (vars. geçici)")
    ap.add_argument("--q", type=int, default=80)
    ap.add_argument("--out", help="çıktı klasörü (vars. tema img/)")
    args = ap.parse_args()

    out = Path(args.out).resolve() if args.out else THEME / "img"
    prep, win, tmp = tb.prep_hazirla(COL, args.prep_dir, yasak=[THEME], onek="bgr-prep-")
    out.mkdir(parents=True, exist_ok=True)
    for f in list(out.glob("*.webp")) + list(out.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (tema); ölçüler px, kutular [x, y, w, h] kaynak katman pikseli, "
                         "box_pct yüzde"}
    q = args.q

    def webp(im, name, widths, q_):
        tb.webp(im, name, widths, q_, manifest, out=out)

    # açık zarf: kapak (menteşede döner), gövde (astar), ön cep — V cep kenarı (G035 kesimi, tema_build.cep_kes "v")
    eo = Image.open(prep / "envelope_open.png").convert("RGBA")
    pocket, cep = tb.cep_kes(eo, "v")
    uyar("pocket", cep)
    bt = cep["body"][1]
    W, H = eo.size
    webp(eo.crop((0, 0, W, bt + 3)), "env_flap", WIDTHS["envelope_open"], q)
    webp(eo.crop((0, bt - 2, W, H)), "env_body", WIDTHS["envelope_open"], q)
    webp(pocket.crop((0, bt - 2, W, H)), "pocket", WIDTHS["pocket"], q)
    manifest["envelope_open"] = {"src_size": [W, H], "body": cep["body"], "flap_rows": [0, bt + 3],
                                 "body_rows": [bt - 2, H], "tip": cep["tip"]}
    manifest["pocket"]["cut"] = cep
    # denetim: kapak + gövde + cep katmanları (tuvalde) üst üste konunca açık zarfın kendisi (docs/11 §5.4 #4)
    tuval = lambda im_, y: np.pad(np.asarray(im_)[..., 3], ((y, H - y - im_.height), (0, 0)))  # noqa: E731
    fark = tb.ortusme(eo, [tuval(eo.crop((0, 0, W, bt + 3)), 0), tuval(eo.crop((0, bt - 2, W, H)), bt - 2),
                           np.asarray(pocket)])
    if fark > 0.01:
        sys.exit(f"açık zarf katmanları kaynakla örtüşmüyor (alfa farkı {fark:.4f} > 0.01)")

    # kapalı zarf + ayrı kapak katmanı (tırtıklı V kenar izlenir — tema_build.kapak_kes "v")
    ec = Image.open(prep / "envelope_closed.png").convert("RGBA")
    al = np.asarray(ec)[..., 3]
    r_, c_ = np.flatnonzero(al.max(1) > 200), np.flatnonzero(al.max(0) > 200)
    webp(ec, "envelope_closed", WIDTHS["envelope_closed"], q)
    manifest["envelope_closed"]["body"] = [int(c_.min()), int(r_.min()), int(c_.max()), int(r_.max())]
    flap, kb = tb.kapak_kes(ec, "v")
    uyar("env_cflap", kb)
    webp(flap, "env_cflap", WIDTHS["env_cflap"], q)
    kb["height_pct_of_closed"] = round(100 * kb["rows"][1] / ec.height, 3)
    kb["hinge_pct_of_flap"] = round(100 * kb["hinge_row"] / kb["rows"][1], 3)
    manifest["env_cflap"]["cut"] = kb
    print("kapak", kb)

    rb = Image.open(prep / "ribbon_bow.png").convert("RGBA")
    webp(rb, "ribbon_bow", WIDTHS["ribbon_bow"], q)

    # çerçeveli parçalar ve foto alanı maskeleri (pencere + 2 px, çerçevenin altına taşsın) + şeffaflık denetimi
    slots = {}
    katmanlar = {"card": "card_small", "arch": "arch_frame", "landscape": "frame_landscape"}
    for ad, parca in katmanlar.items():
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        webp(im, parca, WIDTHS[parca], q)
        slots[ad] = tb.foto_alani(prep, win, parca, ad, manifest, out)
    manifest["photo_slots"] = slots

    for nm in ("invitation_card", "info_card", "florals_tl", "florals_br", "divider"):
        webp(Image.open(prep / f"{nm}.png"), nm, WIDTHS[nm], q)
    for nm, mx, ornek in (("invitation_card", .487, (.5, .55)), ("info_card", .492, (.5, .55)),
                          ("card_small", .5, (.8, .86))):
        manifest[nm]["free_zone"] = tb.serbest_bolge(Image.open(prep / f"{nm}.png"), mx, ornek=ornek)

    for i, p in enumerate(tb.bilesenler(Image.open(prep / "petals.png").convert("RGBA")), 1):
        p.thumbnail((200, 200), Image.LANCZOS)
        webp(p, f"petal{i}", [p.width], q)

    bg = Image.open(PARTS / "bg_scene.png").convert("RGB")
    webp(bg, "bg_scene", [640, 1024], 78)
    webp(tb.bulanik_fon(bg, (640, 960), 5), "mist", [640], 82)
    # uzun sayfa zemini (03'e özel): bg_scene'in çiçeksiz sakin ortası, sayfa rengine %30 karışık + dikey aynası
    calm = bg.crop((280, 470, 880, 1000)).resize((640, 565), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.6))
    calm = Image.blend(calm, Image.new("RGB", calm.size, (242, 216, 215)), 0.30)
    tile = Image.new("RGB", (calm.width, calm.height * 2))
    tile.paste(calm, (0, 0))
    tile.paste(calm.transpose(Image.FLIP_TOP_BOTTOM), (0, calm.height))
    webp(tile, "mist_tile", [640], 80)

    # nötr foto yer tutucuları (gerçek fotoğraf asla tema görseline girmez)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        webp(tb.yer_tutucu(bg, kutu, oran, max(gen)), f"ph_{key}", gen, 82)
        manifest[f"ph_{key}"]["aspect"] = oran

    # paylaşım görseli (web_hero → 1200×630, alt hizalı: zarf + fiyonk altta tam kalır; yazı yok) ve favicon (fiyonk)
    og, og_bilgi = tb.og_kirp(Image.open(PARTS / "web_hero.png"), hiza="alt")
    og_bilgi["file"] = "og-1200x630.jpg"
    og_bilgi["bytes"] = tb.og_kaydet(og, out / og_bilgi["file"], 82)
    manifest["og"] = og_bilgi
    ikon, ikon_bilgi = tb.ikon(rb, 180)
    ikon.save(out / "favicon.png", optimize=True)
    ikon_bilgi.update({"source": "ribbon_bow", "file": "favicon.png", "bytes": (out / "favicon.png").stat().st_size})
    manifest["favicon"] = ikon_bilgi

    # kapalı ↔ açık zarf hizası (ham GPT dosyaları, GPT_PROMPTS "Kaydet" tuvalinde; 03'te tuvaller farklı → ölçekli)
    olcu = tb.kaydet_olculeri(COL)
    hz = tb.hiza_olc(Image.open(PARTS / "envelope_closed.png"), Image.open(PARTS / "envelope_open.png"), "kapak",
                     olcu.get("envelope_closed"), olcu.get("envelope_open"))
    manifest["align"] = hz
    print(f"hiza ({hz['durum']}): {tb.hiza_ozet(hz)}")
    for u in hz["uyarilar"]:
        print(f"UYARI  hiza: {u}")

    yesil = tb.yesil_denetle(out)
    if yesil:
        sys.exit(f"görünür #00FF00 kalıntısı: {yesil}")
    manifest["checks"] = {"envelope_open_overlap_diff": round(fark, 5), "green_px": 0}
    # theme-check: the short landscape layout (site.css, G058) is held to the home first-screen rule at 844×390 / 667×375
    # too, and the home names to 36 px (scripts/lib/theme-env.ts first_screen)
    manifest["theme_check"] = {"first_screen": {"landscape": True, "names_min_px": 36}}
    tb.manifest_yaz(out, manifest)
    tot = sum(f.stat().st_size for f in out.glob("*.webp"))
    print(f"{len(list(out.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {out}")
    print(f"og {og_bilgi['file']} {og_bilgi['bytes'] / 1024:.0f} KB (kırpım {og_bilgi['crop']}) · favicon "
          f"{ikon_bilgi['bytes'] / 1024:.0f} KB")
    for ad, s in slots.items():
        print(f"foto alanı {ad}: box_pct {s['box_pct']} oran {s['aspect']} ({s['box_px'][0]}/{s['box_px'][1]})")
    boyut = tb.klasor_boyutu(THEME) - tb.klasor_boyutu(THEME / "img") + tb.klasor_boyutu(out)
    print(f"tema klasörü {boyut / 1e6:.2f} MB (sınır {tb.TEMA_BUTCE / 1e6:.0f} MB)")
    if tmp:
        tmp.cleanup()
    if boyut > tb.TEMA_BUTCE:
        sys.exit(f"tema klasörü {boyut} bayt > {tb.TEMA_BUTCE} (docs/11 §1)")


if __name__ == "__main__":
    main()
