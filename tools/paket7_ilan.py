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
# PAKET 3'ü olmayan tasarımlar (33–48, 2026-10-22): set ve renk dünyası buradan; her biri kendi DESIGN_BRIEF / "Stil ve renk"
# bölümünden. Biçim PAKET 3 ile aynı: "zemin, süs, süs ve süs" (ilk parça zemin).
EK_SETLER = {
    "33": ("a fuchsia silk cloth over a carved dark wood low table, fresh marigold garlands, a saffron silk tassel, a small brass "
           "bowl of marigold petals and a fold of plum velvet with fine gold embroidery", "fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold"),
    "34": ("a glossy red lacquer tray on a cream silk cloth, pink and deep red tree peonies, a red silk knot with a tassel, a cream "
           "porcelain teacup with a gold rim and a sprig of plum blossom", "lacquer red, cinnabar, cream and gold in soft warm lamplight"),
    "35": ("a soft woven wool tartan throw in moss green and heather purple over a weathered oak table, purple thistles and heather, "
           "a saddle-leather strap with an antique brass buckle and a cream linen napkin", "heather purple, moss green, cream, antique brass and saddle brown with a thin deep red line"),
    "36": ("a white-painted wooden potting bench under the misted glass roof of a Victorian glasshouse, lush fern fronds, a white "
           "orchid in a copper pot with a little verdigris and a roll of kraft paper tied with jute", "deep fern green, misted glass, herbarium cream, kraft and copper"),
    "37": ("a cream linen cloth over a curved walnut table in the soft glow of a stained-glass window, tall white lilies in a slender "
           "glass vase, a sage silk ribbon and a few lilac sweet peas", "sage green, cream, lilac and soft gold"),
    "38": ("a limewashed courtyard table with a cream linen runner in warm late-afternoon sun, strings of colorful cut tissue paper "
           "banners with flower patterns, terracotta pots of bright dahlias and marigolds and a few warm glass string-light bulbs",
           "fuchsia, marigold, turquoise, lime, violet and coral tissue paper on kraft, limewash and terracotta"),
    "39": ("a pearl-grey silk satin cloth, a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, "
           "ivory ranunculus and silvery dusty miller", "ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour"),
    "40": ("an ivory heavy cotton cloth, ivory Chantilly lace, a black silk satin ribbon, white lily of the valley and a single white "
           "swan feather", "ivory, warm white, soft pewter and antique gold with fine black accents"),
    "41": ("a cream primed linen canvas surface, sprays of lilac wisteria, pale pink water lilies floating in a shallow glass dish "
           "and a wooden paintbrush", "soft pond blue, lilac and wisteria, lily pink, water sage and canvas cream in luminous morning light"),
    "42": ("a dark espresso-brown wooden table, dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass "
           "candlestick", "espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight"),
    "43": ("a cream cotton tablecloth, a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a "
           "burgundy cosmos stem", "chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight"),
    "44": ("a powder-blue linen tablecloth, blue-and-white toile porcelain plates, a blue-and-white ginger jar of white hydrangeas "
           "and a pale blue silk bow", "porcelain white, toile blue, powder blue and cream in soft cool daylight"),
    "45": ("a sun-bleached wooden ranch table, a soft tan suede throw, cream cotton lace, wildflowers in sage and sunset peach and "
           "a tooled leather belt with a silver concho", "suede tan, saddle brown, cream lace, sage green, sunset peach and silver in low golden-hour sun"),
    "46": ("an ivory moiré silk cloth, a double-faced claret silk satin ribbon, white tulips and a small stack of ivory "
           "linen-covered books", "ivory, linen, oyster and deep claret red with a touch of soft gold"),
    "47": ("a matte black darkroom bench, a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with "
           "black centres and warm white fibre photo paper", "black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red"),
    "48": ("a navy linen tablecloth, white magnolia blossoms and bay laurel sprigs, a navy grosgrain ribbon and an ivory wax seal",
           "navy, deep navy, ivory, parchment and polished gold in fresh morning seaside light"),
}

SCREEN = ("Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand "
          "marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): "
          "no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are "
          "fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or "
          "watermarks anywhere in the image.")
LOOK = ("Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth "
        "of field, editorial and luxurious, color world: {palette}.")

# (dosya, boyut, yeşil alan sayısı, ne anlatır — Claude oraya ne koyar, prompt gövdesi)
SAHNELER = [
    ("p7_01_closeup", "kare 1:1 (ör. 1254×1254)", 1, "Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi",
     "A close, intimate product shot: one smartphone stands slightly tilted back on {set_short}, filling about 60% of the image "
     "height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and "
     "background by {props}, which come close to the phone frame but never touch the screen."),
    ("p7_02_hand_tap", "kare 1:1 (ör. 1254×1254)", 1, "Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)",
     "A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of "
     "her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly "
     "out of focus: {set}. A sense of anticipation, like opening a real letter."),
    ("p7_03_guest_home", "kare 1:1 (ör. 1254×1254)", 1, "Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez",
     "A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a "
     "comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly "
     "blurred: a cup of tea and {props_short}. Warm, delighted mood; the person's face is not visible."),
    ("p7_04_phone_tablet", "yatay 3:2 (ör. 1536×1024)", 2, "Her cihazda: telefon + tablet aynı site",
     "A tablet stands upright on a small stand slightly left of center on {set_short}, and a smartphone stands upright to its "
     "right, both screens facing the camera, clear space between them. Around them at the edges: {props}. Calm, generous space "
     "above the devices."),
    ("p7_05_laptop", "yatay 3:2 (ör. 1536×1024)", 1, "Bilgisayarda düzenleyici: rahat, büyük ekran",
     "An open modern laptop seen from a gentle three-quarter angle on {set_short}, its screen facing the camera and filling about "
     "half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with {props} "
     "arranged loosely at the edges. Bright, organised, stress-free planning mood."),
    ("p7_06_couple_planning", "yatay 3:2 (ör. 1536×1024)", 2, "Çift birlikte planlıyor: laptop + telefon (yüz yok)",
     "Two people sit side by side at a table set with {set_short}: only their forearms and hands are visible, one with a delicate "
     "engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. "
     "On the table: {props}. Warm, happy, together; no faces visible."),
    ("p7_07_print_card", "yatay 3:2 (ör. 1536×1024)", 2, "Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)",
     "Flat-lay from directly above on {set_short}: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies "
     "left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a "
     "smartphone lies to its right, rotated about 6 degrees. Around them at the edges: {props}. The card's four corners and the "
     "phone screen's four corners are fully visible."),
    ("p7_08_four_phones", "yatay 3:2 (ör. 1536×1024)", 4, "Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon",
     "Four identical smartphones stand upright in a gentle arc on {set_short}, seen from the front at eye level, evenly spaced with "
     "clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: {props}. "
     "Elegant, orderly, catalogue-like."),
    ("p7_09_venue_table", "kare 1:1 (ör. 1254×1254)", 1, "Düğün günü: misafir masasında telefon (Details/harita)",
     "At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, "
     "crystal glasses and candles, screen facing the camera. Table décor echoes {props_short}; the venue and other tables glow "
     "softly out of focus behind. Golden-hour light, festive and elegant; no people's faces."),
    ("p7_10_bouquet", "kare 1:1 (ör. 1254×1254)", 1, "Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)",
     "A bridal bouquet in the color world of this design lies on {set_short}, and a smartphone rests beside it at a slight angle, "
     "screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on "
     "the screen. Soft, nostalgic after-the-wedding mood."),
    ("p7_11_share", "kare 1:1 (ör. 1254×1254)", 1, "Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor",
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

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> {d['set_kaynak']} Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no {d['no']}`.

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
Kontrol (gözle; piksel ölçme yok): {n} adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.
""")
    parca.append("""### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
""")
    return "\n".join(parca)


def isle(no: str, dry: bool):
    kol = next((p for p in (ROOT / "collections").glob(f"{no}_*") if p.is_dir()), None)
    if not kol:
        sys.exit(f"{no}: koleksiyon yok")
    pr = kol / "assets/gpt/GPT_PROMPTS.md"
    t = pr.read_text(encoding="utf-8")
    if no in EK_SETLER:
        s, palette = EK_SETLER[no]
        bas = (kol / "DESIGN_BRIEF.md").read_text(encoding="utf-8").splitlines()[0]   # "# Tasarım 33 — Marigold & Mehndi · …"
        m = re.search(r"— (.+?) ·", bas)
        name = m.group(1) if m else " ".join(w.capitalize() if w.islower() else w for w in kol.name.split("_")[1:])
        kaynak = "Set bu tasarımın kendi dünyası (PAKET 3 yok; `EK_SETLER`): bütün sahnelerde aynı masa, süs, ışık."
    else:
        i3 = t.index("## PAKET 3")
        m = TALIMAT.search(t, i3)
        if not m:
            sys.exit(f"{no}: PAKET 3 talimat bloğu okunamadı")
        s, palette, name = " ".join(m.group("set").split()), m.group("palette").strip(), m.group("name")
        kaynak = "PAKET 3 ile **aynı set** (aynı masa, süs, ışık)."
    parts = [x.strip() for x in s.split(",")]
    d = dict(no=no, name=name, dir=kol.relative_to(ROOT).as_posix(), set=s, palette=palette, set_kaynak=kaynak,
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
