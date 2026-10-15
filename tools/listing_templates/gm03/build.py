"""G065 — Etsy ilan görselleri, GM03 düzeni, kalan üç yerleşim: editör (LC4), RSVP (LC5), dahil olanlar (LC6); ve 7
görselin tamamını tek kit olarak `package/listing/images/`e koyan adım. 01 Olive & Ivory ve 03 Blush Garden Rose.

  python3 tools/listing_templates/gm03/build.py                         # 01 ve 03: G067 dört görseli + bu üçü, kit
  python3 tools/listing_templates/gm03/build.py --design 03 --skip-capture

Kapak, sayfalar, nasıl çalışır ve canlı demo (LC1, LC2, LC3, LC7) G067'nin aracıyla üretilir (tools/listing_v2/build.py,
burada içe aktarılır, değiştirilmez). Bu modül aynı kompozit/render/denetim işlevlerini kullanır; yeni olanlar:
  * capture.ts: ekranlar yeni panelden (K29/G060 düzeni) — telefonda "Edit your website" (LC4), dizüstü boyunda Guests
    (yanıt sayıları, sorunun yanıtları, Download list; LC5) ve misafirin RSVP sayfası (LC5 telefonu). Yerel production
    build, yerel adaptör, kurgu çift ve kurgu yanıtlar; canlıya bir şey gitmez.
  * Zemin: LC4 `hand_phone_edit`, LC5 `laptop_phone` (tasarımın PAKET 3 sahneleri), LC6 sitenin kendi sayfa zemini
    (LC3 ile aynı kırpım). Eksik şerit sahnenin kendi kenarından uzatılır (kompozit.yerlestir).
  * İkonlar brand/listing/icons (GM03 LI, GPT); yeni şekil/süs çizilmez (K21) — yazı, logo SVG, hap/kart zemini.
QR ve web adresi hiçbir görselde yok (docs/15 §1, Off-Platform): canlı demo görseli "demo link in the description" der.
Çıktı: collections/<NN>/package/listing_v2/ (7 görsel + preview_thumbs.png), sonra package/listing/images/01..07.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
V2 = REPO / "tools" / "listing_v2"
sys.dont_write_bytecode = True
sys.path.insert(0, str(V2))
import build as v2  # noqa: E402  (G067)
import kompozit as kz  # noqa: E402
import render as rd  # noqa: E402

_font_css = rd.font_css


def _font_css_yuklu(hedef: Path) -> str:
    """render.ciz her aileyi 400 ağırlıkta `document.fonts.check` ile sorar; check yalnız *yüklenmiş* yüzü görür ve
    Google Fonts Montserrat'ı artık 300 ile 400'ü ayrı yüz olarak veriyor: şablonlar yalnız 300 kullandığı için 400
    hiç yüklenmez, G067'nin kendi çizimi de "yüklenemeyen font: Montserrat" ile durur (2026-10-15). Görünmez bir öğe
    üç ailenin 400'ünü yükletir; denetim yine gerçek yüklemeyi sorar, sistem fontuna sessiz düşüş yine yakalanır."""
    return _font_css(hedef) + ("\nhtml::after{content:'Aa';position:absolute;left:-9999px;top:0;opacity:0;"
                               "font:400 40px 'Montserrat';}"
                               "\nhtml::before{content:'Aa';position:absolute;left:-9999px;top:0;opacity:0;"
                               "font:400 40px 'Archivo','DM Sans';}")


rd.font_css = _font_css_yuklu  # G067'nin build.py'si (repo dışı yazar yolu) aynı modülü kullanır

CAPTURE = HERE / "capture.ts"
ICONS = REPO / "brand" / "listing" / "icons"
T = kz.TUVAL

# Bu görevin görselleri ve tam metinleri (docs/05 §E; yalnız platformun bugün yaptığı). Ekranlar soldan sağa.
YENI = {
    "editor": {"dosya": "04_editor.png", "sahne": "hand_phone_edit.png",
               "ekranlar": [{"kind": "panel", "view": "edit"}],
               "metin": ["Edit everything", "from your phone", "Names and date", "Photos", "Schedule and venue",
                         "Your RSVP questions"]},
    "rsvp": {"dosya": "05_rsvp.png", "sahne": "laptop_phone.png",
             "ekranlar": [{"kind": "panel", "view": "guests"}, {"kind": "guest", "page": "rsvp"}],
             "metin": ["RSVPs in one place", "You see every answer", "Guests reply", "Download your guest list anytime"]},
    "included": {"dosya": "06_included.png",
                 "metin": ["What's included", "Envelope opening", "Edit on your phone", "Online RSVP", "Add to calendar",
                           "Share your link", "Your photos", "Questions and answers", "Day schedule"]},
}
DAHIL = [("envelope_open", "Envelope<br>opening"), ("phone_edit", "Edit on<br>your phone"), ("rsvp", "Online<br>RSVP"),
         ("calendar", "Add to<br>calendar"), ("share", "Share<br>your link"), ("photos", "Your<br>photos"),
         ("questions", "Questions<br>and answers"), ("schedule", "Day<br>schedule")]
EDITOR_HAPLAR = [("calendar", "Names and date"), ("photos", "Photos"), ("schedule", "Schedule and venue"),
                 ("questions", "Your RSVP questions")]

# Etsy'ye yükleme sırası (kit): dosya adı → G067/G065 anahtarı
KIT = [("01_cover.png", "cover"), ("02_pages.png", "pages"), ("03_how.png", "how"), ("04_editor.png", "editor"),
       ("05_rsvp.png", "rsvp"), ("06_included.png", "included"), ("07_demo.png", "demo")]

# Yerleşim (2000 px tuval)
EDITOR = {"ekran_h": 1150, "ekran_cx": 1430, "ekran_ust": 640, "h1_top": 150, "sub_top": 360, "pills_left": 90,
          "pills_top": 760, "pill_gap": 70}
RSVP = {"olcek": 1.62, "sahne_ust": 190, "h1_top": 110, "pills_gap": 70, "logo_bottom": 64,
        # hapların/notun en alt yeri: 03'te laptop daha aşağıda, not logoya biniyordu (logo ~120 px + 64 alt pay)
        "pills_max": 1520, "foot_max": 1670}
DAHIL_YER = {"h1_top": 300, "grid_top": 640, "logo_bottom": 92}
LAPTOP_GEN = 1280  # dizüstü ekranı CSS genişliği (masaüstü panel), DPR 2


def sahne_yolu(nn: str, ad: str) -> Path:
    return v2.sahne_yolu(nn, ad)


# ----------------------------------------------------------------------------- capture

def isler(nn: str) -> dict[str, list[dict]]:
    """Görsel → capture işleri (soldan sağa): telefon 390 CSS px @3x, dizüstü LAPTOP_GEN @2x; yükseklik yeşil ekranın
    en/boy oranından."""
    out = {}
    for anahtar, g in YENI.items():
        if "sahne" not in g:
            continue
        bol = kz.ekran_bolgeleri(Image.open(sahne_yolu(nn, g["sahne"])))
        if len(bol) != len(g["ekranlar"]):
            raise RuntimeError(f"{nn} {g['sahne']}: {len(bol)} yeşil ekran, beklenen {len(g['ekranlar'])}")
        js = []
        for e, b in zip(g["ekranlar"], bol):
            if b["oran"] > 1:  # dizüstü
                w, h, dpr = LAPTOP_GEN, round(LAPTOP_GEN / b["oran"]), 2
            else:
                w, h, dpr = 390, kz.ekran_yuksekligi(b["oran"]), 3
            ad = f"{e.get('view') or e.get('page')}_{w}x{h}"
            js.append({"name": ad, **e, "width": w, "height": h, "dpr": dpr})
        out[anahtar] = js
    return out


def adim_capture(nn: str) -> None:
    if not (REPO / "platform" / ".next" / "BUILD_ID").exists():
        raise RuntimeError("platform/ production build yok: cd platform && npm ci && npm run build")
    hepsi = {j["name"]: j for js in isler(nn).values() for j in js}
    hedef = v2.onbellek(nn) / "screens_g065"
    hedef.mkdir(parents=True, exist_ok=True)
    jobs = v2.onbellek(nn) / "jobs_g065.json"
    jobs.write_text(json.dumps(list(hepsi.values()), indent=2), encoding="utf-8")
    env = dict(os.environ)
    env.setdefault("NODE_PATH", "/opt/node22/lib/node_modules")
    env.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers")
    for deneme in range(1, 3):
        r = subprocess.run(["node", str(CAPTURE), "--theme", v2.TASARIMLAR[nn]["tema"], "--out", str(hedef), "--jobs", str(jobs)],
                           cwd=REPO, env=env)
        if r.returncode == 0:
            return
        print(f"capture {nn}: deneme {deneme} başarısız (kod {r.returncode})", file=sys.stderr)
    raise RuntimeError(f"capture başarısız: {nn}")


# ----------------------------------------------------------------------------- compose

def _ekranlar(nn: str, js: list[dict]) -> list[Image.Image]:
    out = []
    for j in js:
        p = v2.onbellek(nn) / "screens_g065" / f"{j['name']}.png"
        if not p.exists():
            raise RuntimeError(f"ekran yok: {p} (capture adımını koşun)")
        out.append(Image.open(p))
    return out


def adim_compose(nn: str, sadece: list[str]) -> dict:
    js = isler(nn)
    bilgi = {}
    for anahtar in sadece:
        g = YENI[anahtar]
        if anahtar == "included":
            yol, kutu = v2.TASARIMLAR[nn]["nasil_zemin"]
            kaynak = Image.open(REPO / "collections" / v2.TASARIMLAR[nn]["klasor"] / yol).convert("RGB").crop(kutu)
            bg = kz.buyut(kaynak, T / kaynak.width)
            bg = bg.crop((0, 0, T, T)) if bg.size != (T, T) else bg
            bilgi[anahtar] = {"zemin": f"{yol} kırpım {list(kutu)}", "ekranlar": []}
        else:
            sahne = Image.open(sahne_yolu(nn, g["sahne"]))
            bol = kz.ekran_bolgeleri(sahne)
            if anahtar == "editor":
                # telefon sağda büyük; başlık ve haplar sol üstte (sahnenin sol tarafı yastık/battaniye, sakin)
                k = bol[0]["kutu"]
                s = EDITOR["ekran_h"] / (k[3] - k[1])
                x0 = EDITOR["ekran_cx"] - (k[0] + k[2]) / 2 * s
                y0 = EDITOR["ekran_ust"] - k[1] * s
            else:  # rsvp: sahne tam genişlik, üstte başlık payı (sahnenin kendi duvarından uzatılır)
                s = RSVP["olcek"]
                cx = (bol[0]["kutu"][0] + bol[-1]["kutu"][2]) / 2
                x0 = T / 2 - cx * s
                y0 = RSVP["sahne_ust"]
            bg, yer = kz.yerlestir(sahne, s, x0, y0, sis_gucu=0.45)
            bg, ekr = kz.ekranlari_oturt(bg, _ekranlar(nn, js[anahtar]))
            kalinti = kz.yesil_kalinti(bg)
            if kalinti:
                raise RuntimeError(f"{nn} {anahtar}: yerleştirmeden sonra {kalinti} yeşil piksel kaldı")
            bilgi[anahtar] = {"sahne": str(sahne_yolu(nn, g["sahne"]).relative_to(REPO)), "yerlesim": yer,
                              "ekranlar": [{"sayfa": j.get("view") or j.get("page"), "goruntu": f"{j['name']}.png",
                                            "kutu": e["kutu"], "kose": e["kose"]} for j, e in zip(js[anahtar], ekr)]}
        p = v2.onbellek(nn) / f"bg_{anahtar}.png"
        bg.save(p)
        print(f"compose {nn} {anahtar}: {p.relative_to(REPO)}")
    eski = v2.onbellek(nn) / "compose.json"
    tum = json.loads(eski.read_text(encoding="utf-8")) if eski.exists() else {}
    tum.update(bilgi)
    eski.write_text(json.dumps(tum, indent=2, ensure_ascii=False), encoding="utf-8")
    return bilgi


# ----------------------------------------------------------------------------- render

def ikon(ad: str) -> str:
    return (ICONS / f"{ad}.png").resolve().as_uri()


def degerler(nn: str, anahtar: str, bilgi: dict) -> dict:
    if anahtar == "editor":
        haplar = "\n    ".join(f'<span class="pill" data-kutu="hap"><img class="ic" src="{ikon(i)}" alt="">{m}</span>'
                               for i, m in EDITOR_HAPLAR)
        k = bilgi[anahtar]["ekranlar"][0]["kutu"]
        return {**EDITOR, "pills": haplar, "col_right": f"{k[0] - 110:.0f}"}
    if anahtar == "rsvp":
        ekr = bilgi[anahtar]["ekranlar"]
        laptop, phone = ekr[0]["kutu"], ekr[1]["kutu"]
        alt = max(laptop[3], phone[3])
        return {"h1_top": RSVP["h1_top"], "pills_top": f"{min(alt + 175, RSVP['pills_max']):.0f}",
                "foot_top": f"{min(alt + 330, RSVP['foot_max']):.0f}",
                "logo_bottom": RSVP["logo_bottom"],
                "pill_l": f"{(laptop[0] + laptop[2]) / 2:.0f}", "pill_r": f"{(phone[0] + phone[2]) / 2:.0f}"}
    if anahtar == "included":
        kartlar = "\n    ".join(f'<div class="card"><img class="ic" src="{ikon(i)}" alt=""><div class="label" data-kutu="adim">{m}</div></div>'
                                for i, m in DAHIL)
        return {**DAHIL_YER, "cards": kartlar}
    raise KeyError(anahtar)


def adim_render(nn: str, sadece: list[str], bilgi: dict, font_css: str, calisma: Path) -> dict:
    base_css = (v2.TEMPLATES / "base.css").read_text(encoding="utf-8")
    fit_js = (v2.TEMPLATES / "fit.js").read_text(encoding="utf-8")
    sonuc = {}
    for anahtar in sadece:
        d = {"fonts_css": font_css, "base_css": base_css, "fit_js": fit_js, "logo": v2.logo_svg(),
             "bg": (v2.onbellek(nn) / f"bg_{anahtar}.png").resolve().as_uri(), **degerler(nn, anahtar, bilgi)}
        html = calisma / f"{nn}_{anahtar}.html"
        html.write_text(v2.doldur((HERE / f"{anahtar}.html").read_text(encoding="utf-8"), d), encoding="utf-8")
        cikti = v2.cikti_klasoru(nn) / YENI[anahtar]["dosya"]
        # yalnız şablonun kullandığı aileler denetlenir (render.py 400 ağırlığını sorar; Montserrat yalnız 300 kullanılıyor,
        # fit.js onu açıkça yükler — 400 yüklenmediği için "eksik" sayılırdı; çizimde Montserrat 300 gözle doğrulandı)
        aileler = {"editor": ["Archivo", "DM Sans"], "rsvp": ["Archivo", "DM Sans"], "included": ["Archivo"]}[anahtar]
        sonuc[anahtar] = rd.ciz(html, cikti, calisma, aileler=aileler)
        print(f"render  {nn} {anahtar}: {cikti.relative_to(REPO)}")
    return sonuc


# ----------------------------------------------------------------------------- kit

def kit(nn: str) -> list[Path]:
    """7 görsel, Etsy yükleme sırasıyla package/listing/images/'e (eskiler silinir: 07_details, 08_live_demo QR)."""
    hedef = REPO / "collections" / v2.TASARIMLAR[nn]["klasor"] / "package" / "listing" / "images"
    hedef.mkdir(parents=True, exist_ok=True)
    for f in hedef.glob("*.png"):
        f.unlink()
    out = []
    for dosya, anahtar in KIT:
        kaynak = v2.cikti_klasoru(nn) / (YENI.get(anahtar) or v2.GORSELLER[anahtar])["dosya"]
        if not kaynak.exists():
            raise RuntimeError(f"görsel yok: {kaynak}")
        shutil.copyfile(kaynak, hedef / dosya)
        out.append(hedef / dosya)
    eski_qr = hedef.parent / "demo_qr.png"
    for f in (eski_qr, eski_qr.with_suffix(".svg")):
        if f.exists():
            f.unlink()
    return out


def ust_uste(sadece: list[str], sonuc: dict, pay: int = 12) -> list[str]:
    """Yazı kutuları (logo dahil) birbirine binmez (G067 denetimi logoyu saymıyor)."""
    sorun = []
    for anahtar in sadece:
        ks = [k for k in sonuc[anahtar]["kutular"] if k["ad"] not in ("haplar", "sutun")]
        for i, a in enumerate(ks):
            for b in ks[i + 1:]:
                if (a["x"] < b["x"] + b["w"] + pay and b["x"] < a["x"] + a["w"] + pay
                        and a["y"] < b["y"] + b["h"] + pay and b["y"] < a["y"] + a["h"] + pay):
                    sorun.append(f"{YENI[anahtar]['dosya']}: {a['ad']} {a['metin'][:24]!r} ile {b['ad']} {b['metin'][:24]!r} üst üste")
    return sorun


def kaydet_v2() -> None:
    """G067 denetim/önizleme işlevleri bu görevin görsellerini de tanısın (yalnız bu süreçte, dosya değişmez)."""
    for anahtar, g in YENI.items():
        v2.GORSELLER[anahtar] = g
    v2.SIRA[:] = [a for _, a in KIT]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="G065 ilan görselleri (GM03): LC4, LC5, LC6 + G067'nin dördü → kit")
    ap.add_argument("--design", nargs="+", choices=sorted(v2.TASARIMLAR), default=sorted(v2.TASARIMLAR))
    ap.add_argument("--only", nargs="+", choices=list(YENI), default=list(YENI))
    ap.add_argument("--skip-capture", action="store_true", help="önbellekteki ekranları kullan")
    ap.add_argument("--skip-v2", action="store_true", help="G067'nin dört görselini yeniden üretme")
    a = ap.parse_args(argv)
    tamam = True
    for nn in a.design:
        if not a.skip_v2:
            argv2 = ["--design", nn] + (["--skip-capture"] if a.skip_capture else [])
            if v2.main(argv2) != 0:
                print(f"SORUN {nn}: G067 görselleri denetimden geçmedi")
                tamam = False
    kaydet_v2()
    with tempfile.TemporaryDirectory(prefix="listing_g065_") as t:
        calisma = Path(t)
        font_css = rd.font_css(calisma / "fonts")
        for nn in a.design:
            v2.onbellek(nn).mkdir(parents=True, exist_ok=True)
            if not a.skip_capture:
                adim_capture(nn)
            bilgi = adim_compose(nn, a.only)
            sonuc = adim_render(nn, a.only, bilgi, font_css, calisma)
            sorun = v2.denetle(nn, a.only, bilgi, sonuc) + ust_uste(a.only, sonuc)
            v2.adim_preview(nn, font_css, calisma)
            for s in sorun:
                print(f"SORUN {nn}: {s}")
            print(f"check   {nn}: {'geçti' if not sorun else f'{len(sorun)} sorun'}")
            tamam &= not sorun
            for p in kit(nn):
                print(f"kit     {nn}: {p.relative_to(REPO)}")
    return 0 if tamam else 1


if __name__ == "__main__":
    sys.exit(main())
