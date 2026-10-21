"""PAKET 8: Etsy ilan şablonu, dikey 4:5 — kapak + 7 bilgi görselinin SAHNELERİ (2026-10-21).

Neden: Etsy arama ızgarası kapakları dikey 4:5 (510×638) kırpıyor; en çok satan rakiplerin kalıbı (2026-10-21 incelemesi):
üstte büyük başlık, altta kartın ~%65'ini kaplayan büyük düz telefonlar, yuvarlak özellik rozetleri; sonraki görsellerde tek
mesajlı büyük başlıklar ("Collect RSVPs with ease", "Make it your own", "Try the live demo"...).
GPT yalnız SAHNEYİ üretir (K21): telefonlar ve QR kartının yüzü düz #00FF00, başlık alanları boş. Claude gerçek site
ekranlarını yeşile yerleştirir, başlık/rozet/madde yazılarını dizer, QR'ı tools/make_qr.py ile gerçek demo adresinden üretir.
Sahne dünyası (masa, süs, renk) her tasarımın PAKET 3 "Instructions for GPT" bloğundan okunur; PAKET 3/7 ile aynı set.

  python3 tools/paket8_ilan.py --no 01           # GPT_PROMPTS.md'ye PAKET 8 yazar (varsa yeniler)
  python3 tools/paket8_ilan.py --all --dry-run
"""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TALIMAT = re.compile(r'design called "(?P<name>[^"]+)".*?Keep one consistent set across all images: (?P<set>.+?), the same '
                     r'light and the same color world \((?P<palette>[^)]+)\)', re.S)
BASLIK = "## PAKET 8"

FRAME = ("Portrait 2:3 image (1024×1536). Everything important stays inside the middle 84% of the height: the top and bottom "
         "eighth of the image are only background, because the picture will be cropped to 4:5.")
SCREEN = ("Every phone is the same generic modern smartphone with thin even black bezels and rounded corners, seen straight from "
          "the front, no logo, no brand marks, no camera bump visible. Every screen is a perfectly flat, uniform, opaque pure "
          "green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of "
          "every screen are fully visible: no phone overlaps another, and no finger, hand, prop, petal or ribbon covers any part "
          "of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.")
LOOK = ("Photorealistic high-end Etsy listing photography for wedding stationery, soft natural daylight from the top-left, gentle "
        "realistic shadows under the phones, background softly out of focus, clean, airy and luxurious, color world: {palette}.")
TOP = ("The upper {top} of the image is a calm, plain, softly lit stretch of the same blurred background with no objects at all: "
       "a headline will be added there later.")

# (dosya, yeşil alan sayısı, başlık boşluğu, ne anlatır — Claude ne koyar, prompt gövdesi)
SAHNELER = [
    ("p8_01_cover", 2, "third", "Kapak: iki büyük telefon (kapalı zarf + açılmış zarf), üstte başlık, yanlarda 3 rozet",
     "Two identical smartphones stand upright side by side on {set_short}, the left one tilted about 4 degrees to the left and "
     "the right one about 4 degrees to the right, with a small gap between them. Together they fill about 60% of the image "
     "height and about 75% of its width, sitting in the lower two-thirds of the frame. {props} appear only low at the bottom "
     "corners and along the side edges, small and soft, never in front of the phones; leave a little empty background beside "
     "the outer edge of each phone."),
    ("p8_02_reveal", 3, "quarter", "Zarf nasıl açılır: 3 adım (kapalı → açılıyor → fotoğraf)",
     "Three identical smartphones stand upright in a straight row on {set_short}, evenly spaced with clear gaps, all the same "
     "size and height, each filling about 50% of the image height, the row centered in the lower part of the frame. {props} "
     "only at the bottom corners, low and small."),
    ("p8_03_rsvp", 2, "quarter", "RSVP: misafirin formu + çiftin misafir listesi paneli",
     "Two identical smartphones stand upright side by side on {set_short} with a clear gap between them, the left one placed "
     "slightly lower and the right one slightly higher, both straight-on, each filling about 55% of the image height. {props} "
     "only at the bottom corners and side edges, low and small."),
    ("p8_04_edit", 3, "quarter", "Telefondan düzenleme: sayfa listesi → yazı değişiyor → Yayında (No Canva)",
     "Three identical smartphones stand upright on {set_short}: the middle one slightly larger and a little forward, the two "
     "outer ones slightly smaller and further back, with clear gaps so no phone overlaps another, all straight-on. Together "
     "they fill about 55% of the image height. {props} only at the bottom corners, low and small."),
    ("p8_05_pages", 4, "quarter", "Her sayfa dahil: Home · Our Story · Details · RSVP (altlarında etiket boşluğu)",
     "Four identical smartphones stand upright in a straight row on {set_short}, evenly spaced with clear gaps, all the same "
     "size, each filling about 42% of the image height, the row centered vertically slightly below the middle. Below the row, "
     "a plain stretch of {set_short} with no objects, for small labels added later. {props} only at the far corners."),
    ("p8_06_included", 1, "fifth", "Neler dahil: solda telefon, sağda madde listesi alanı",
     "One smartphone stands upright on the left third of {set_short}, straight-on, filling about 58% of the image height. The "
     "right 55% of the image is an empty, plain, softly textured area of the same surface and background with nothing on it, "
     "for a checklist added later. {props} only along the left edge and the bottom-left corner."),
    ("p8_07_demo", 2, "quarter", "Satın almadan dene: telefon + QR kartı (kartın yüzü yeşil; QR'ı Claude gerçek adresten koyar)",
     "One smartphone stands upright slightly left of center on {set_short}, straight-on, filling about 55% of the image height. "
     "To its right, a small square place card with a thick cotton-paper edge is propped upright on a tiny stand, its entire "
     "front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges, about a third of the phone's "
     "height. {props} only at the bottom corners, low and small."),
    ("p8_08_how", 1, "fifth", "Nasıl çalışır: üstten düz çekim, ortada telefon, çevresinde 4 adım yazısı alanı",
     "Flat-lay from directly above on {set_short}: one smartphone lies in the exact center, perfectly straight (not rotated), "
     "filling about 45% of the image height. Wide plain space of the same surface all around it, for step texts added later. "
     "{props} only at the four corners, small."),
]


def bolum(d: dict) -> str:
    k = d["dir"] + "/assets/gpt/mockups/"
    look = LOOK.format(**d)
    parca = [f"""{BASLIK} — Etsy ilan şablonu 4:5: kapak + 7 bilgi görseli sahneleri (2026-10-21)

> Kullanıcı (2026-10-21): kapak ve görseller en çok satan rakiplerin kalıbında olsun; sahneleri GPT üretsin. Etsy arama ızgarası
> dikey **4:5** (510×638) gösteriyor. GPT **yalnız sahneyi** üretir: telefon ekranları (ve 8.7'de kartın yüzü) **düz #00FF00**,
> başlık alanı **boş**. Claude gerçek site ekranlarını yeşile koyar; başlıkları, rozetleri, maddeleri yazar; QR'ı gerçek demo
> adresinden üretir. GPT görsele **hiç yazı koymaz**. PAKET 3/7 ile **aynı set**. Hepsini **tek sohbette** üret.
> Üreten: `python3 tools/paket8_ilan.py --no {d['no']}`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "{d['name']}". Every image in this chat is a real-looking styled product photo of smartphones (and once a small place card) whose screens and card face are flat pure green (#00FF00); we will place the real website screens, the headlines and a QR code afterwards, so you never add any text. Keep one consistent set across all images: {d['set']}, the same light and the same color world ({d['palette']}). The phones are always the hero: large, sharp, straight-on, never small in the frame. Every image is a portrait 2:3 picture with a calm empty area at the top for a headline. Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered.
```
"""]
    tops = {"third": "third", "quarter": "quarter", "fifth": "fifth"}
    for i, (dosya, n, top, ne, govde) in enumerate(SAHNELER, 1):
        p = govde.format(**d)
        p = p[0].upper() + p[1:]
        p = re.sub(r"(\. )([a-z])", lambda m: m.group(1) + m.group(2).upper(), p)
        parca.append(f"""### 8.{i} {ne}
**Kaydet:** `{k}{dosya}.png` · dikey 2:3 (ör. 1024×1536) · {n} yeşil alan

```
{p} {TOP.format(top=tops[top])} {FRAME} {look} {SCREEN}
```
Kontrol (gözle; piksel ölçme yok): {n} adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil); telefonlar büyük ve düz karşıdan; hiçbir telefon diğerinin üstüne binmiyor; her yeşil alanın dört köşesi görünüyor; üstteki başlık alanı boş; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.
""")
    return "\n".join(parca)


def isle(no: str, dry: bool):
    kol = next((p for p in (ROOT / "collections").glob(f"{no}_*") if p.is_dir()), None)
    if not kol:
        sys.exit(f"{no}: koleksiyon yok")
    pr = kol / "assets/gpt/GPT_PROMPTS.md"
    t = pr.read_text(encoding="utf-8")
    m = TALIMAT.search(t, t.index("## PAKET 3"))
    if not m:
        sys.exit(f"{no}: PAKET 3 talimat bloğu okunamadı")
    s = " ".join(m.group("set").split())
    parts = [x.strip() for x in s.split(",")]
    props = ", ".join(parts[1:]) or s
    d = dict(no=no, name=m.group("name"), dir=kol.relative_to(ROOT).as_posix(), set=s, palette=m.group("palette").strip(),
             set_short=parts[0], props=props[0].upper() + props[1:])
    yeni_bolum = bolum(d)
    if BASLIK in t:
        a = t.index(BASLIK)
        nx = re.search(r"^## (?!PAKET 8)", t[a + 5:], re.M)
        b = a + 5 + nx.start() if nx else len(t)
        yeni = t[:a] + yeni_bolum + ("\n---\n\n" if nx else "") + t[b:]
    else:
        yeni = t.rstrip() + "\n\n---\n\n" + yeni_bolum
    if dry:
        print(f"{no}: {d['name']} · set_short={d['set_short']!r} · props={d['props']!r}")
        return
    pr.write_text(yeni, encoding="utf-8", newline="\n")
    print(f"{no}: yazıldı ({pr.relative_to(ROOT).as_posix()})")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--no", nargs="*", default=[])
    ap.add_argument("--all", action="store_true", help="01–21")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args(argv)
    nos = [f"{i:02d}" for i in range(1, 22)] if a.all else [n.zfill(2) for n in a.no]
    if not nos:
        ap.error("--no ya da --all")
    for no in nos:
        isle(no, a.dry_run)


if __name__ == "__main__":
    main()
