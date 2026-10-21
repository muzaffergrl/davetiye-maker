"""PAKET 7: Etsy ilanının 10–20. görselleri (11 sahne) + promo video sahnesi (2026-10-21, kullanıcı: "sınır kaç adetse o kadar
görsel; ürünü ön planda gösteren, içini rahatlatan, satın almaya teşvik eden; ve promo video").

Etsy sınırı ilan başına 20 fotoğraf + 2 video; ilanlarda 9 fotoğraf + 1 video var → tasarım başına 11 sahne + 1 video sahnesi.
GPT yalnız fotoğraf gerçekliğinde SAHNE üretir; ekranlar ve basılı kart yüzü düz #00FF00. Claude gerçek site ekranlarını
(ve basılı davetiyenin gerçek PDF render'ını) yeşile yerleştirir, yazıları dizer (`tools/mockup_compose.py`, docs/21 kuralları).
Sahne dünyası (masa, süsler, renkler) her tasarımın PAKET 3 "Instructions for GPT" bloğundan okunur; PAKET 3 ile aynı set.

  python3 tools/paket7_ilan.py --no 01 02 ... 21     # GPT_PROMPTS.md'ye PAKET 7 yazar (varsa yeniler)
  python3 tools/paket7_ilan.py --all --dry-run       # yalnız göster
"""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TALIMAT = re.compile(r'design called "(?P<name>[^"]+)".*?Keep one consistent set across all images: (?P<set>.+?), the same '
                     r'light and the same color world \((?P<palette>[^)]+)\)', re.S)
BASLIK = "## PAKET 7"

SCREEN = ("Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand "
          "marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): "
          "no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are "
          "fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or "
          "watermarks anywhere in the image.")
LOOK = ("Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth "
        "of field, editorial and luxurious, color world: {palette}.")

# (dosya, boyut, yeşil alan sayısı, ne anlatır — Claude oraya ne koyar, prompt gövdesi)
SAHNELER = [
    ("p7_01_closeup", "1024×1024", 1, "Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi",
     "A close, intimate product shot: one smartphone stands slightly tilted back on {set_short}, filling about 60% of the image "
     "height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and "
     "background by {props}, which come close to the phone frame but never touch the screen."),
    ("p7_02_hand_tap", "1024×1024", 1, "Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)",
     "A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of "
     "her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly "
     "out of focus: {set}. A sense of anticipation, like opening a real letter."),
    ("p7_03_guest_home", "1024×1024", 1, "Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez",
     "A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a "
     "comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly "
     "blurred: a cup of tea and {props_short}. Warm, delighted mood; the person's face is not visible."),
    ("p7_04_phone_tablet", "1536×1024", 2, "Her cihazda: telefon + tablet aynı site",
     "A tablet stands upright on a small stand slightly left of center on {set_short}, and a smartphone stands upright to its "
     "right, both screens facing the camera, clear space between them. Around them at the edges: {props}. Calm, generous space "
     "above the devices."),
    ("p7_05_laptop", "1536×1024", 1, "Bilgisayarda düzenleyici: rahat, büyük ekran",
     "An open modern laptop seen from a gentle three-quarter angle on {set_short}, its screen facing the camera and filling about "
     "half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with {props} "
     "arranged loosely at the edges. Bright, organised, stress-free planning mood."),
    ("p7_06_couple_planning", "1536×1024", 2, "Çift birlikte planlıyor: laptop + telefon (yüz yok)",
     "Two people sit side by side at a table set with {set_short}: only their forearms and hands are visible, one with a delicate "
     "engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. "
     "On the table: {props}. Warm, happy, together; no faces visible."),
    ("p7_07_print_card", "1536×1024", 2, "Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)",
     "Flat-lay from directly above on {set_short}: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies "
     "left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a "
     "smartphone lies to its right, rotated about 6 degrees. Around them at the edges: {props}. The card's four corners and the "
     "phone screen's four corners are fully visible."),
    ("p7_08_four_phones", "1536×1024", 4, "Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon",
     "Four identical smartphones stand upright in a gentle arc on {set_short}, seen from the front at eye level, evenly spaced with "
     "clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: {props}. "
     "Elegant, orderly, catalogue-like."),
    ("p7_09_venue_table", "1024×1024", 1, "Düğün günü: misafir masasında telefon (Details/harita)",
     "At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, "
     "crystal glasses and candles, screen facing the camera. Table décor echoes {props_short}; the venue and other tables glow "
     "softly out of focus behind. Golden-hour light, festive and elegant; no people's faces."),
    ("p7_10_bouquet", "1024×1024", 1, "Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)",
     "A bridal bouquet in the color world of this design lies on {set_short}, and a smartphone rests beside it at a slight angle, "
     "screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on "
     "the screen. Soft, nostalgic after-the-wedding mood."),
    ("p7_11_share", "1024×1024", 1, "Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor",
     "Close-up of two people's hands at {set_short}: one holds a smartphone toward the other, screen facing the camera, while the "
     "other person's hand rests on the table nearby. In the soft background: {props}. Joyful sharing moment; no faces visible."),
]

VIDEO = ("A 12-second locked-off (tripod, no camera movement) 1:1 square video, 1080×1080. A smartphone stands perfectly still, "
         "upright on a small invisible stand in the center of the frame, filling about 65% of the frame height, on {set}. The "
         "phone screen is a perfectly flat, uniform, opaque pure green (#00FF00) for the whole clip and never moves, so it can be "
         "replaced in editing. Only the surroundings move, gently and slowly: soft daylight shifts across the table, a sheer "
         "curtain shadow drifts, one or two petals or leaves fall slowly in the background and land at the edges, never in front "
         "of the screen. Nothing ever crosses or covers the phone or its screen; no hands. Photorealistic, luxurious, calm, "
         "high-end wedding stationery commercial look, color world: {palette}. No text, logos or watermarks.")


def bolum(d: dict) -> str:
    k = d["dir"] + "/assets/gpt/mockups/"
    look = LOOK.format(**d)
    parca = [f"""{BASLIK} — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne +
> 1 video sahnesi**. Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no {d['no']}`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "{d['name']}". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: {d['set']}, the same light and the same color world ({d['palette']}). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```
"""]
    for i, (dosya, boyut, n, ne, govde) in enumerate(SAHNELER, 1):
        p = govde.format(**d)
        p = p[0].upper() + p[1:]
        parca.append(f"""### 7.{i} {ne}
**Kaydet:** `{k}{dosya}.png` · {boyut} · {n} yeşil alan

```
{p} {look} {SCREEN}
```
Kontrol: tam {n} yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.
""")
    parca.append(f"""### 7.V Promo video sahnesi (2. video)
**Kaydet:** `{d['dir']}/assets/gpt/video/promo_greenscreen.mp4` · 1080×1080 · 10–15 sn · sessiz olabilir

```
{VIDEO.format(**d)}
```
Kontrol: kamera kıpırdamıyor; telefon ve yeşil ekran tüm klipte sabit ve tam görünür; ekranın önünden hiçbir şey geçmiyor; el yok; yazı/logo yok.
Claude bu klibe gerçek açılış kaydını (zarf → kart → sayfalar) yerleştirir; videoda gösterilen her şey gerçek siteden gelir.
""")
    return "\n".join(parca)


def isle(no: str, dry: bool):
    kol = next((p for p in (ROOT / "collections").glob(f"{no}_*") if p.is_dir()), None)
    if not kol:
        sys.exit(f"{no}: koleksiyon yok")
    pr = kol / "assets/gpt/GPT_PROMPTS.md"
    t = pr.read_text(encoding="utf-8")
    i3 = t.index("## PAKET 3")
    m = TALIMAT.search(t, i3)
    if not m:
        sys.exit(f"{no}: PAKET 3 talimat bloğu okunamadı")
    s = " ".join(m.group("set").split())
    parts = [x.strip() for x in s.split(",")]
    d = dict(no=no, name=m.group("name"), dir=kol.relative_to(ROOT).as_posix(), set=s, palette=m.group("palette").strip(),
             set_short=parts[0], props=", ".join(parts[1:]) or s, props_short=", ".join(parts[1:3]) or s)
    yeni_bolum = bolum(d)
    if BASLIK in t:
        a = t.index(BASLIK)
        n = re.search(r"^## (?!PAKET 7)", t[a + 5:], re.M)
        b = a + 5 + n.start() if n else len(t)
        yeni = t[:a] + yeni_bolum + ("\n---\n\n" if n else "") + t[b:]
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
