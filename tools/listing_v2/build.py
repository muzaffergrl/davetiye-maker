"""G067 — Etsy ilan görselleri v2, kısım 1: 01 Olive & Ivory ve 03 Blush Garden Rose için kapak (LC1), sayfalar (LC2),
nasıl çalışır (LC3), canlı demo (LC7).

  python3 tools/listing_v2/build.py                               # 01 ve 03, bütün adımlar
  python3 tools/listing_v2/build.py --design 03 --skip-capture    # önbellekteki ekranlarla yeniden kur

Düzen ve tipografi GM03 comp'larından (brand/listing/comps/lc1_cover, lc2_pages, lc3_how, lc7_demo). Zemin her tasarımın
kendi GPT sahnesi (collections/<NN>/assets/gpt/mockups/; LC3'te sitenin kendi sayfa zemini assets/gpt/parts/), ekranlar
yerel platformun gerçek misafir ekranları (capture.ts). Burada şekil ya da süs çizilmez (K21): yazı, logo (brand/svg),
hap/kart zemini, yerleştirme ve harmanlama.

Adımlar:
  capture  sahnelerdeki yeşil ekranların biçimini ölçer, her ekran için 390 × (o biçim) CSS px @3x misafir ekranı çeker
           (tools/listing_v2/capture.ts; önce `cd platform && npm ci && npm run build`)
  compose  sahne 2000 px tuvale büyütülür (Lanczos + hafif keskinlik), eksik şerit sahnenin kendi kenarından uzatılır,
           ekranlar yeşil alanlara oturtulur (mockup_compose.birlestir_cok; kompozit.py)
  render   templates/*.html → 2000 × 2000 PNG (Chromium; fontlar Google Fonts'tan geçici klasöre, repoya font girmez)
  preview  preview_thumbs.png: her görsel 300 px ve 4:3 orta kırpımı
  check    ölçü, yeşil saçak, metin harf harf, metin kutuları tuval içinde ve ekranların üstünde değil
Önbellek: tools/listing_v2/.cache/<NN>/ (git'e girmez). Çıktı: collections/<NN>/package/listing_v2/.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
sys.path.insert(0, str(HERE))
import kompozit as kz  # noqa: E402
import render as rd  # noqa: E402

TEMPLATES = HERE / "templates"
CACHE = HERE / ".cache"
LOGO_SVG = REPO / "brand" / "svg" / "bke-logo-horizontal-anchor.svg"
CAPTURE = HERE / "capture.ts"
PLATFORM = REPO / "platform"
T = kz.TUVAL

TASARIMLAR = {
    "01": {"tema": "olive-ivory", "klasor": "01_Olive_Ivory", "ad": "Olive & Ivory",
           # LC3 zemini: sitenin kendi sayfa zemini (süsler köşelerde), kare kırpım (x0, y0, x1, y1)
           "nasil_zemin": ("assets/gpt/parts/bg_page.png", (0, 200, 1024, 1224))},
    "03": {"tema": "blush-garden-rose", "klasor": "03_Blush_Garden_Rose", "ad": "Blush Garden Rose",
           "nasil_zemin": ("assets/gpt/parts/bg_scene.png", (0, 256, 1024, 1280))},
}

# Görseller ve tam metinleri (docs/05 §E gerçek iddiaları; QR ve web adresi yok). Ekranlar soldan sağa.
GORSELLER = {
    "cover": {"dosya": "01_cover.png", "sahne": "cover_hand.png", "ekranlar": ["envelope"],
              "metin": ["Wedding Website", "Opens like a real invitation", "Edit on your phone", "Online RSVP", "Instant access"]},
    "pages": {"dosya": "02_pages.png", "sahne": "three_phones.png", "ekranlar": ["home", "details", "rsvp"],
              "altyazi": ["Home", "Details", "RSVP"],
              "metin": ["Every page your guests need", "Home", "Details", "RSVP"]},
    "how": {"dosya": "03_how.png",
            "metin": ["How it works", "Buy this design", "Open your start link", "Edit on your phone", "Publish and share"]},
    "demo": {"dosya": "07_demo.png", "sahne": "flatlay_phone.png", "ekranlar": ["story"],
             "metin": ["Try the live demo", "Open the demo link in the description"]},
}
SIRA = ["cover", "pages", "how", "demo"]

# Yerleşim (2000 px tuval). Kapakta başlık, Etsy arama küçük resminin 4:3 orta kırpımına (y 250–1750) girer.
KAPAK = {"h1_top": 236, "sub_top": 474, "pills_top": 620, "ekran_ust": 830}
SAYFALAR = {"olcek": 1.52, "h1_top": 116, "ekran_ust": 600, "altyazi_bosluk": 52}
NASIL = {"h1_top": 530, "cards_top": 990, "logo_bottom": 92}
# LC7: masa üstü sahnesi biraz büyütülür, sol kenara dayanır (yalnız süslü sağ/alt kenar kırpılır, doku uydurulmaz)
DEMO = {"olcek": 1.7, "col_left": 120, "col_w": 800}


def onbellek(nn: str) -> Path:
    return CACHE / nn


def sahne_yolu(nn: str, ad: str) -> Path:
    return REPO / "collections" / TASARIMLAR[nn]["klasor"] / "assets" / "gpt" / "mockups" / ad


def cikti_klasoru(nn: str) -> Path:
    return REPO / "collections" / TASARIMLAR[nn]["klasor"] / "package" / "listing_v2"


# ----------------------------------------------------------------------------- capture

def ekran_isleri(nn: str) -> dict[str, list[dict]]:
    """Görsel → [{ad, page, height}] (soldan sağa). Yükseklik, yeşil ekranın en/boy oranından (ölçekten bağımsız)."""
    out = {}
    for anahtar, g in GORSELLER.items():
        if "sahne" not in g:
            continue
        bolgeler = kz.ekran_bolgeleri(Image.open(sahne_yolu(nn, g["sahne"])))
        if len(bolgeler) != len(g["ekranlar"]):
            raise RuntimeError(f"{nn} {g['sahne']}: {len(bolgeler)} yeşil ekran, beklenen {len(g['ekranlar'])}")
        out[anahtar] = [{"name": f"{p}_{kz.ekran_yuksekligi(b['oran'])}", "page": p, "height": kz.ekran_yuksekligi(b["oran"])}
                        for p, b in zip(g["ekranlar"], bolgeler)]
    return out


def adim_capture(nn: str) -> None:
    if not (PLATFORM / ".next" / "BUILD_ID").exists():
        raise RuntimeError("platform/ production build yok: cd platform && npm ci && npm run build")
    isler = {j["name"]: j for js in ekran_isleri(nn).values() for j in js}
    hedef = onbellek(nn) / "screens"
    hedef.mkdir(parents=True, exist_ok=True)
    jobs = onbellek(nn) / "jobs.json"
    jobs.write_text(json.dumps(list(isler.values()), indent=2), encoding="utf-8")
    env = dict(os.environ)
    env.setdefault("NODE_PATH", "/opt/node22/lib/node_modules")
    env.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers")
    for deneme in range(1, 3):
        r = subprocess.run(["node", str(CAPTURE), "--theme", TASARIMLAR[nn]["tema"], "--out", str(hedef), "--jobs", str(jobs)],
                           cwd=REPO, env=env)
        if r.returncode == 0:
            return
        print(f"capture {nn}: deneme {deneme} başarısız (kod {r.returncode})", file=sys.stderr)
    raise RuntimeError(f"capture başarısız: {nn}")


# ----------------------------------------------------------------------------- compose

def _ekranlar(nn: str, isler: list[dict]) -> list[Image.Image]:
    out = []
    for j in isler:
        p = onbellek(nn) / "screens" / f"{j['name']}.png"
        if not p.exists():
            raise RuntimeError(f"ekran yok: {p} (capture adımını koşun)")
        out.append(Image.open(p))
    return out


def adim_compose(nn: str, sadece: list[str]) -> dict:
    """Her görselin zemini (.cache/<NN>/bg_<ad>.png) ve yerleşim bilgisi."""
    isler = ekran_isleri(nn)
    bilgi = {}
    for anahtar in sadece:
        g = GORSELLER[anahtar]
        if anahtar == "how":
            yol, kutu = TASARIMLAR[nn]["nasil_zemin"]
            kaynak = Image.open(REPO / "collections" / TASARIMLAR[nn]["klasor"] / yol).convert("RGB").crop(kutu)
            bg = kz.buyut(kaynak, T / kaynak.width)
            bg = bg.crop((0, 0, T, T)) if bg.size != (T, T) else bg
            bilgi[anahtar] = {"zemin": f"{yol} kırpım {list(kutu)}", "ekranlar": []}
        else:
            sahne = Image.open(sahne_yolu(nn, g["sahne"]))
            bol = kz.ekran_bolgeleri(sahne)
            if anahtar == "cover":
                s = T / sahne.width
                x0, y0 = 0, KAPAK["ekran_ust"] - bol[0]["kutu"][1] * s
            elif anahtar == "pages":
                s = SAYFALAR["olcek"]
                cx = (bol[0]["kutu"][0] + bol[-1]["kutu"][2]) / 2
                x0 = T / 2 - cx * s
                y0 = SAYFALAR["ekran_ust"] - min(b["kutu"][1] for b in bol) * s
            else:  # demo: sol üçte bir boş keten yazıya; telefon dikeyde ortada, sahne tuvali taşar (uzatma yok)
                s = DEMO["olcek"]
                merkez = (bol[0]["kutu"][1] + bol[0]["kutu"][3]) / 2 * s
                x0, y0 = 0, min(0, max(T - sahne.height * s, T / 2 - merkez))
            bg, yer = kz.yerlestir(sahne, s, x0, y0, sis_gucu=0.45)
            bg, ekr = kz.ekranlari_oturt(bg, _ekranlar(nn, isler[anahtar]))
            kalinti = kz.yesil_kalinti(bg)
            if kalinti:
                raise RuntimeError(f"{nn} {anahtar}: yerleştirmeden sonra {kalinti} yeşil piksel kaldı")
            bilgi[anahtar] = {"sahne": str(sahne_yolu(nn, g["sahne"]).relative_to(REPO)), "yerlesim": yer,
                              "ekranlar": [{"sayfa": j["page"], "goruntu": f"{j['name']}.png", "kutu": e["kutu"],
                                            "kose": e["kose"]} for j, e in zip(isler[anahtar], ekr)]}
        p = onbellek(nn) / f"bg_{anahtar}.png"
        bg.save(p)
        print(f"compose {nn} {anahtar}: {p.relative_to(REPO)}")
    (onbellek(nn) / "compose.json").write_text(json.dumps(bilgi, indent=2, ensure_ascii=False), encoding="utf-8")
    return bilgi


# ----------------------------------------------------------------------------- render

def doldur(sablon: str, degerler: dict) -> str:
    for k, v in degerler.items():
        sablon = sablon.replace("{{" + k + "}}", str(v))
    if "{{" in sablon:
        raise ValueError(f"doldurulmamış yer tutucu: {sablon[sablon.index('{{'):][:40]}")
    return sablon


def logo_svg() -> str:
    svg = LOGO_SVG.read_text(encoding="utf-8")
    return svg[svg.index("<svg"):]


def sablon_degerleri(nn: str, anahtar: str, bilgi: dict) -> dict:
    ekr = bilgi[anahtar]["ekranlar"]
    if anahtar == "cover":
        return dict(KAPAK)
    if anahtar == "pages":
        alt = max(e["kutu"][3] for e in ekr) + SAYFALAR["altyazi_bosluk"] + 14  # +14: telefon çerçevesinin alt kenarı
        caps = "\n  ".join(
            f'<span class="pill cap" data-kutu="sayfa_adi" style="left:{(e["kutu"][0] + e["kutu"][2]) / 2:.0f}px">{ad}</span>'
            for e, ad in zip(ekr, GORSELLER["pages"]["altyazi"]))
        return {"h1_top": SAYFALAR["h1_top"], "cap_top": alt, "captions": caps}
    if anahtar == "how":
        return dict(NASIL)
    if anahtar == "demo":
        k = ekr[0]["kutu"]
        merkez = (k[1] + k[3]) / 2
        return {"col_left": DEMO["col_left"], "col_w": DEMO["col_w"], "col_top": f"{merkez:.0f}"}
    raise KeyError(anahtar)


def adim_render(nn: str, sadece: list[str], bilgi: dict, font_css: str, calisma: Path) -> dict:
    base_css = (TEMPLATES / "base.css").read_text(encoding="utf-8")
    fit_js = (TEMPLATES / "fit.js").read_text(encoding="utf-8")
    sonuc = {}
    for anahtar in sadece:
        g = GORSELLER[anahtar]
        degerler = {"fonts_css": font_css, "base_css": base_css, "fit_js": fit_js, "logo": logo_svg(),
                    "bg": (onbellek(nn) / f"bg_{anahtar}.png").resolve().as_uri(), **sablon_degerleri(nn, anahtar, bilgi)}
        sablon = (TEMPLATES / f"{anahtar}.html").read_text(encoding="utf-8")
        html = calisma / f"{nn}_{anahtar}.html"
        html.write_text(doldur(sablon, degerler), encoding="utf-8")
        cikti = cikti_klasoru(nn) / g["dosya"]
        sonuc[anahtar] = rd.ciz(html, cikti, calisma)
        print(f"render  {nn} {anahtar}: {cikti.relative_to(REPO)}")
    return sonuc


# ----------------------------------------------------------------------------- preview

def kirp_43(img: Image.Image) -> Image.Image:
    """Etsy arama ızgarası gibi 4:3 orta kırpım."""
    w, h = img.size
    yh = round(w * 3 / 4)
    y0 = (h - yh) // 2
    return img.crop((0, y0, w, y0 + yh))


def adim_preview(nn: str, font_css: str, calisma: Path) -> Path:
    satirlar = []
    for anahtar in SIRA:
        dosya = cikti_klasoru(nn) / GORSELLER[anahtar]["dosya"]
        if not dosya.exists():
            continue
        img = Image.open(dosya).convert("RGB")
        kucuk = calisma / f"{nn}_{anahtar}_300.png"
        img.resize((300, 300), Image.LANCZOS).save(kucuk)
        kirpim = calisma / f"{nn}_{anahtar}_43.png"
        kirp_43(img).resize((300, 225), Image.LANCZOS).save(kirpim)
        satirlar.append(
            f'<div class="row"><div class="name">{dosya.name}</div>'
            f'<figure><img src="{kucuk.resolve().as_uri()}" width="300" height="300"><figcaption>300 px</figcaption></figure>'
            f'<figure><img src="{kirpim.resolve().as_uri()}" width="300" height="225"><figcaption>4:3 centre crop</figcaption></figure></div>')
    w, h = 900, 120 + len(satirlar) * 360
    html = calisma / f"{nn}_preview.html"
    html.write_text(doldur((TEMPLATES / "preview.html").read_text(encoding="utf-8"), {
        "fonts_css": font_css, "w": w, "h": h, "rows": "\n  ".join(satirlar),
        "title": f"{nn} {TASARIMLAR[nn]['ad']} — listing images v2 (G067)"}), encoding="utf-8")
    cikti = cikti_klasoru(nn) / "preview_thumbs.png"
    rd.ciz(html, cikti, calisma, w, h, aileler=["DM Sans"])
    print(f"preview {nn}: {cikti.relative_to(REPO)}")
    return cikti


# ----------------------------------------------------------------------------- check

def _metin(s: str) -> str:
    return " ".join(s.split())


def denetle(nn: str, sadece: list[str], bilgi: dict, render_sonuc: dict) -> list[str]:
    """Sorun listesi (boş = geçti)."""
    sorun = []
    for anahtar in sadece:
        g = GORSELLER[anahtar]
        dosya = cikti_klasoru(nn) / g["dosya"]
        img = Image.open(dosya)
        if img.size != (T, T):
            sorun.append(f"{dosya.name}: ölçü {img.size}")
        if kz.yesil_kalinti(img):
            sorun.append(f"{dosya.name}: {kz.yesil_kalinti(img)} yeşil piksel")
        kutular = render_sonuc[anahtar]["kutular"]
        metinler = [_metin(k["metin"]) for k in kutular if k["ad"] not in ("haplar", "sutun", "logo")]
        for beklenen in g["metin"]:
            if beklenen not in metinler:
                sorun.append(f"{dosya.name}: metin yok ya da farklı: {beklenen!r} (bulunan {metinler})")
        fazla = [m for m in metinler if m not in g["metin"]]
        if fazla:
            sorun.append(f"{dosya.name}: beklenmeyen metin {fazla}")
        # satır sayısı: başlık/adım/not tasarlandığı kadar satır (kendiliğinden kırılıp üçüncü satıra düşmez)
        satir = {"baslik": 2 if anahtar in ("pages", "demo") else 1, "adim": 2, "not": 2, "alt_satir": 1, "hap": 1,
                 "sayfa_adi": 1}
        for k in kutular:
            if k["ad"] in satir and k["ad"] not in ("hap", "sayfa_adi", "not"):
                fs = float(k["font"].rstrip("px"))
                if k["h"] / fs > satir[k["ad"]] * 1.15:
                    sorun.append(f"{dosya.name}: {k['ad']} {satir[k['ad']]} satırdan fazla ({k['metin']!r}, {k['h']} px)")
        ekranlar = [e["kutu"] for e in bilgi[anahtar]["ekranlar"]]
        for k in kutular:
            x0, y0, x1, y1 = k["x"], k["y"], k["x"] + k["w"], k["y"] + k["h"]
            if x0 < 40 or y0 < 40 or x1 > T - 40 or y1 > T - 40:
                sorun.append(f"{dosya.name}: {k['ad']} kenara çok yakın/taşıyor ({x0},{y0},{x1},{y1})")
            for e in ekranlar:
                # telefon çerçevesi ekranın ~20 px dışı: yazı ekrana da çerçeveye de binmez
                if x0 < e[2] + 20 and x1 > e[0] - 20 and y0 < e[3] + 20 and y1 > e[1] - 20:
                    sorun.append(f"{dosya.name}: {k['ad']} ekranın üstünde ({x0},{y0},{x1},{y1}) ∩ {e}")
        if anahtar == "cover":
            b = next(k for k in kutular if k["ad"] == "baslik")
            if b["y"] < 250 - 30 or b["y"] + b["h"] > 1750:
                sorun.append(f"{dosya.name}: başlık 4:3 küçük resim kırpımının dışında (y {b['y']}–{b['y'] + b['h']})")
    return sorun


# ----------------------------------------------------------------------------- CLI

def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="G067 ilan görselleri v2 (LC1, LC2, LC3, LC7) — 01 ve 03")
    ap.add_argument("--design", nargs="+", choices=sorted(TASARIMLAR), default=sorted(TASARIMLAR))
    ap.add_argument("--only", nargs="+", choices=SIRA, default=SIRA)
    ap.add_argument("--skip-capture", action="store_true", help="önbellekteki ekranları kullan")
    a = ap.parse_args(argv)
    hepsi_tamam = True
    with tempfile.TemporaryDirectory(prefix="listing_v2_") as t:
        calisma = Path(t)
        font_css = rd.font_css(calisma / "fonts")
        for nn in a.design:
            onbellek(nn).mkdir(parents=True, exist_ok=True)
            cikti_klasoru(nn).mkdir(parents=True, exist_ok=True)
            if not a.skip_capture:
                adim_capture(nn)
            bilgi = adim_compose(nn, a.only)
            sonuc = adim_render(nn, a.only, bilgi, font_css, calisma)
            adim_preview(nn, font_css, calisma)
            sorun = denetle(nn, a.only, bilgi, sonuc)
            (onbellek(nn) / "render.json").write_text(json.dumps(sonuc, indent=2, ensure_ascii=False), encoding="utf-8")
            for s in sorun:
                print(f"SORUN {nn}: {s}")
            print(f"check   {nn}: {'geçti' if not sorun else f'{len(sorun)} sorun'}")
            hepsi_tamam &= not sorun
    return 0 if hepsi_tamam else 1


if __name__ == "__main__":
    sys.exit(main())
