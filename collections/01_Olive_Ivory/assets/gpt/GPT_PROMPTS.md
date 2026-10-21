# GPT görsel istekleri — Tasarım 01 · Olive & Ivory

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/01_Olive_Ivory/DESIGN_BRIEF.md`.
Görev: `gorevler/G201-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G801-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/01_Olive_Ivory/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G201: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **soft watercolor** (bütün dekor parçalarında aynı)
- Renkler: ink `#2F3A2B` · deep `#5E6B45` · primary `#7D8B5A` · mist `#F1EFE6`→`#DCD9C6` · ivory `#FBF8F0` · gold `#B39A63` · leaf `#7D8B5A`
- Renk dünyası: olive green, sage, warm ivory and soft antique gold
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G201` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 01` — değişiklik için `tools/katalog.py` → `WEB[1]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Zeytin yeşili dokulu kağıt zarf, fildişi dantel kenarlı V kapak, botanik oval mühür; kapak mühürle birlikte kalkar, kart yükselir):
On tap, the lace-edged flap peels up on its hinge carrying the oval seal and its tucked olive sprig with it, and the ivory card glides up out of the pocket while two olive leaves float across the screen.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same olive envelope, oval botanical seal,
  decor, paper, metal and light.
- Technique for all decor: **soft watercolor**; paper, fabric and metal look real.
- Palette: ink `#2F3A2B` · deep `#5E6B45` · primary `#7D8B5A` · mist `#F1EFE6`→`#DCD9C6` · ivory `#FBF8F0` · gold `#B39A63` · leaf `#7D8B5A` (olive green, sage, warm ivory and soft antique gold).
- Typography in the W1 screens: a flowing calligraphy script for the names and a refined classic Garamond-style serif in small spaced capitals.
- W1 screens are 1024×1536 full-bleed phone layouts (no phone hardware, no status bar, no browser bar). They may
  contain the demo text below — they are layout references only and are never sold.
- W2 parts contain **NO text, letters, numbers or monograms at all** — not on seals, stamps, labels, tags or covers.
- **ONE object per image** — never a sheet or set of several objects in one image.
- **No cast shadow and no drop shadow** on any part (the website adds its own shadows). Light every part the same
  way: soft light from the top-left. Front view, straight, centered, not cropped, empty margin around it.
- **No glow, halo, light rays or haze outside an object's outline** (the website adds light effects); a
  semi-transparent halo leaves a dirty edge on another background.
- Edges Claude will cut along (the flap's free edge, a door seam, a book's spine and cover edge, a pouch mouth, a
  pocket's top edge) are **crisp lines with a slight contact shade on the object itself** — never a cast shadow.
- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).
- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).
- envelope_closed.png and envelope_open.png must fit together exactly: the SAME
  olive envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the olive envelope. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Avery & Jordan · Saturday, June 12, 2027 · 4:00 PM ·
The Willow Grove Estate, Napa, California · Ceremony 4:00 PM The Garden Terrace · Cocktail Hour 5:00 PM The Olive Courtyard · Reception 6:30 PM The Grand Ballroom · Formal Attire ·
Kindly reply by May 15, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: soft warm ivory-to-pale-olive gradient (#F1EFE6 to #DCD9C6) with faint linen grain and a few very soft out-of-focus sunlight flecks, with slender olive branches with silvery-green leaves and small dark olives, a few white garden roses and small white blossoms framing the top-left and bottom-right corners and a few small floating accents (a silvery-green olive leaf, a small ripe dark olive, a tiny white jasmine blossom). Centered slightly below the middle: an olive-green (#7D8B5A) textured cotton-paper envelope with soft visible fibers, about 5:4 wider than tall, with a deep pointed V flap whose edge is trimmed with a narrow band of fine ivory lace, closed, with an oval botanical wax seal in warm antique gold-ivory (#D7C79F, deepening to #B39A63 in its pressed recesses) with an irregular poured edge, a smooth EMPTY oval center inside a thin raised rim and a tiny embossed wreath of olive leaves and small blossoms, a short olive sprig tucked under it — pressed onto the tip of the V flap, a little below the envelope's center. Above it, typography in a flowing calligraphy script for the names and a refined classic Garamond-style serif in small spaced capitals: a small spaced line "YOU ARE INVITED" and the names "Avery & Jordan" large; below the olive envelope a small spaced line "TAP TO OPEN". All decor in soft watercolor style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: olive envelope ve oval botanical seal net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the olive envelope: a small warm-ivory card with softly rounded corners and a fine antique-gold double border, a rounded-corner portrait photo window in its upper 60% and plain blank paper below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "JUNE 12, 2027 · NAPA". Under the card: the names "Avery & Jordan" large in the script, a small spaced line "SATURDAY · JUNE 12, 2027", the venue "The Willow Grove Estate" and "Napa, California" in italic serif, four small elegant countdown boxes "242 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and an olive-green pill button with ivory lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three rounded-corner gold-bordered portrait cards fanned out gently like a hand of cards — the middle card upright and slightly higher, the side cards tilted about 8 degrees outward and overlapping it only at their outer ivory margins, so all three green windows stay fully visible and each caption sits under its own card; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "Our first lunch", "In the olive grove", "Simply forever". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler yalnız kenar paylarında üst üste; üç yeşil pencere tam görünür; diziliş: Yuvarlak köşeli ince altın çerçeveli kartlar, yelpaze gibi açılır.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall warm-ivory card with softly rounded corners, a fine antique-gold double border and only one small olive sprig at the top center holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a single slender olive sprig with five leaves and two small olives): "4:00 PM — Ceremony — The Garden Terrace", "5:00 PM — Cocktail Hour — The Olive Courtyard", "6:30 PM — Reception — The Grand Ballroom" (time in small spaced serif, event in serif, place in italic serif). Below the card: a landscape version of the same rounded-corner ivory card frame with the fine antique-gold double border and a tiny olive sprig at its bottom-left corner, its window filled with flat pure green #00FF00 (the venue photo), under it "The Willow Grove Estate" and "Napa, California", then a small line "DRESS CODE · Formal Attire". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by May 15, 2027" in serif, an olive-green pill button with ivory lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Avery & Jordan" in the script at the bottom; a small oval botanical seal — the same one as on the olive envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı olive envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: soft warm ivory-to-pale-olive gradient (#F1EFE6 to #DCD9C6) with faint linen grain and a few very soft out-of-focus sunlight flecks, with slender olive branches with silvery-green leaves and small dark olives, a few white garden roses and small white blossoms entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no olive envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: soft warm-ivory watercolor paper (#F1EFE6) with faint linen grain and very subtle tonal mottling. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same olive envelope as in the W1 screens, alone and closed, WITHOUT the oval botanical seal: an olive-green (#7D8B5A) textured cotton-paper envelope with soft visible fibers, about 5:4 wider than tall, with a deep pointed V flap whose edge is trimmed with a narrow band of fine ivory lace. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; oval botanical seal yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only an oval botanical wax seal in warm antique gold-ivory (#D7C79F, deepening to #B39A63 in its pressed recesses) with an irregular poured edge, a smooth EMPTY oval center inside a thin raised rim and a tiny embossed wreath of olive leaves and small blossoms, a short olive sprig tucked under it, alone, exactly as it sits on the olive envelope in the W1 screens (pressed onto the tip of the V flap, a little below the envelope's center), drawn large so it fills about 70% of the square (Claude scales it to the olive envelope), with the same perspective, material and light as on the olive envelope and with no olive envelope behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız oval botanical seal; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME olive envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the lace-edged V flap folded fully upward above the envelope, its inner side and the inside of the back showing the liner — a warm ivory (#FBF8F0) liner with a fine hand-drawn olive-branch repeat in pale sage (#A8B28A); the front pocket empty. The top edge of the front pocket is a crisp, clearly visible edge against the liner. No card, nothing inside, no oval botanical seal. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the olive envelope in W1.2, alone: a small warm-ivory card with softly rounded corners and a fine antique-gold double border, a rounded-corner portrait photo window in its upper 60% and plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the olive envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall warm-ivory cotton card with softly rounded corners and a fine antique-gold double border, a slender watercolor olive branch with silvery leaves and small dark olives arching across the top-left corner and a smaller sprig at the bottom-right. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall warm-ivory card with softly rounded corners, a fine antique-gold double border and only one small olive sprig at the top center. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a portrait ivory card frame with softly rounded corners, a fine antique-gold double border and a slim ivory margin, a tiny watercolor olive sprig tucked at its bottom-left corner. The window inside is a portrait window with softly rounded corners (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape version of the same rounded-corner ivory card frame with the fine antique-gold double border and a tiny olive sprig at its bottom-left corner, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of slender olive branches with silvery-green leaves and small dark olives, a few white garden roses and small white blossoms, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of slender olive branches with silvery-green leaves and small dark olives, a few white garden roses and small white blossoms, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE silvery-green olive leaf, in the same soft watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small ripe dark olive with a short stem and one tiny leaf, in the same soft watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE tiny white jasmine blossom, in the same soft watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same soft watercolor style: a single slender olive sprig with five leaves and two small olives, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: soft warm ivory-to-pale-olive gradient (#F1EFE6 to #DCD9C6) with faint linen grain and a few very soft out-of-focus sunlight flecks, with slender olive branches with silvery-green leaves and small dark olives, a few white garden roses and small white blossoms framing the left and right edges, and the closed olive envelope with its oval botanical seal resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed olive envelope with its oval botanical seal completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G201`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar yuvarlak köşeli dikey kart çerçevelere (~3:4) girer: yüzler ortadaki %70'lik alanda, başın üstünde pay kalsın. Renk dünyası: zeytin yeşili, fildişi, adaçayı, sıcak altın ışık.

### 2.1 Ana portre
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other beneath old silvery olive trees in a sunlit Mediterranean-style garden at golden hour; she wears a flowing ivory chiffon dress, he wears a light sage-grey linen suit with no tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "Our first lunch"
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a rustic outdoor table under an olive tree, two glasses of lemonade and a small bowl of olives, warm afternoon light, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "In the olive grove"
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment on a gravel path through an olive grove at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Simply forever"
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a small sprig of olive leaves and white jasmine, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional elegant wine-country estate wedding venue at golden hour: a cream stone villa with a terrace, rows of white ceremony chairs on a lawn lined with old olive trees, a simple arch of olive branches and white flowers, soft rolling vineyard hills behind, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan sahneleri (görev G801; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Olive & Ivory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a warm ivory linen tablecloth, olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine, the same light and the same color world (olive green, sage, warm ivory and soft antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower center of the frame, the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a warm ivory linen tablecloth and olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine. The upper 30% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; üst %30 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a warm ivory linen tablecloth, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a warm ivory linen tablecloth, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a warm ivory linen tablecloth, slightly right of center and rotated about 8 degrees, surrounded at the edges by olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine. The left third of the image is calm, empty linen kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on an ivory linen sofa with a sage cushion and a ceramic coffee cup; a small arrangement of olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.


---

## G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

> Görev `G139`. Panelden indirilen 5×7 in / A5 basılı davetiye bu tasarımın `parts/invitation_card.png` (ön) ve
> `parts/info_card.png` (arka) parçalarını kullanır. Bugünkü parçalar 1024 × 1536 px: 5×7'de ~230 ppi, A5'te ~200 ppi
> (300 ppi hedefinin altında; büyütme yapılmadı). Aynı tasarımın **2× sürümü** istenir; gelince
> `node scripts/build-print-assets.ts --theme <tema>` çalıştırılır (yerleşim değişmez).

### P1 — invitation_card_print
Kaydet: `collections/01_Olive_Ivory/assets/gpt/parts/invitation_card_print.png` — **2048 × 3072 px, PNG, şeffaf arka plan**
```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and
decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card.
Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### P2 — info_card_print
Kaydet: `collections/01_Olive_Ivory/assets/gpt/parts/info_card_print.png` — **2048 × 3072 px, PNG, şeffaf arka plan**
```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and
its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp,
print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 01`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Olive & Ivory". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a warm ivory linen tablecloth, olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine, the same light and the same color world (olive green, sage, warm ivory and soft antique gold). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a warm ivory linen tablecloth, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a warm ivory linen tablecloth, olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and olive branches with silvery leaves, a few green olives. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a warm ivory linen tablecloth, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a warm ivory linen tablecloth, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a warm ivory linen tablecloth: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a warm ivory linen tablecloth: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a warm ivory linen tablecloth, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes olive branches with silvery leaves, a few green olives; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a warm ivory linen tablecloth, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a warm ivory linen tablecloth: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.

---

## PAKET 8 — Etsy ilan şablonu 4:5: kapak + 7 bilgi görseli sahneleri (2026-10-21)

> Kullanıcı (2026-10-21): kapak ve görseller en çok satan rakiplerin kalıbında olsun; sahneleri GPT üretsin. Etsy arama ızgarası
> dikey **4:5** (510×638) gösteriyor. GPT **yalnız sahneyi** üretir: telefon ekranları (ve 8.7'de kartın yüzü) **düz #00FF00**,
> başlık alanı **boş**. Claude gerçek site ekranlarını yeşile koyar; başlıkları, rozetleri, maddeleri yazar; QR'ı gerçek demo
> adresinden üretir. GPT görsele **hiç yazı koymaz**. PAKET 3/7 ile **aynı set**. Hepsini **tek sohbette** üret.
> Üreten: `python3 tools/paket8_ilan.py --no 01`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Olive & Ivory". Every image in this chat is a real-looking styled product photo of smartphones (and once a small place card) whose screens and card face are flat pure green (#00FF00); we will place the real website screens, the headlines and a QR code afterwards, so you never add any text. Keep one consistent set across all images: a warm ivory linen tablecloth, olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine, the same light and the same color world (olive green, sage, warm ivory and soft antique gold). The phones are always the hero: large, sharp, straight-on, never small in the frame. Every image is a portrait 2:3 picture with a calm empty area at the top for a headline. Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered.
```

### 8.1 Kapak: iki büyük telefon (kapalı zarf + açılmış zarf), üstte başlık, yanlarda 3 rozet
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p8_01_cover.png` · dikey 2:3 (ör. 1024×1536) · 2 yeşil alan

```
Two identical smartphones stand upright side by side on a warm ivory linen tablecloth, the left one tilted about 4 degrees to the left and the right one about 4 degrees to the right, with a small gap between them. Together they fill about 60% of the image height and about 75% of its width, sitting in the lower two-thirds of the frame. Olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine appear only low at the bottom corners and along the side edges, small and soft, never in front of the phones; leave a little empty background beside the outer edge of each phone. The upper third of the image is a calm, plain, softly lit stretch of the same blurred background with no objects at all: a headline will be added there later. Portrait 2:3 image (1024×1536). Everything important stays inside the middle 84% of the height: the top and bottom eighth of the image are only background, because the picture will be cropped to 4:5. Photorealistic high-end Etsy listing photography for wedding stationery, soft natural daylight from the top-left, gentle realistic shadows under the phones, background softly out of focus, clean, airy and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is the same generic modern smartphone with thin even black bezels and rounded corners, seen straight from the front, no logo, no brand marks, no camera bump visible. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no phone overlaps another, and no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil); telefonlar büyük ve düz karşıdan; hiçbir telefon diğerinin üstüne binmiyor; her yeşil alanın dört köşesi görünüyor; üstteki başlık alanı boş; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 8.2 Zarf nasıl açılır: 3 adım (kapalı → açılıyor → fotoğraf)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p8_02_reveal.png` · dikey 2:3 (ör. 1024×1536) · 3 yeşil alan

```
Three identical smartphones stand upright in a straight row on a warm ivory linen tablecloth, evenly spaced with clear gaps, all the same size and height, each filling about 50% of the image height, the row centered in the lower part of the frame. Olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine only at the bottom corners, low and small. The upper quarter of the image is a calm, plain, softly lit stretch of the same blurred background with no objects at all: a headline will be added there later. Portrait 2:3 image (1024×1536). Everything important stays inside the middle 84% of the height: the top and bottom eighth of the image are only background, because the picture will be cropped to 4:5. Photorealistic high-end Etsy listing photography for wedding stationery, soft natural daylight from the top-left, gentle realistic shadows under the phones, background softly out of focus, clean, airy and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is the same generic modern smartphone with thin even black bezels and rounded corners, seen straight from the front, no logo, no brand marks, no camera bump visible. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no phone overlaps another, and no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 3 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil); telefonlar büyük ve düz karşıdan; hiçbir telefon diğerinin üstüne binmiyor; her yeşil alanın dört köşesi görünüyor; üstteki başlık alanı boş; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 8.3 RSVP: misafirin formu + çiftin misafir listesi paneli
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p8_03_rsvp.png` · dikey 2:3 (ör. 1024×1536) · 2 yeşil alan

```
Two identical smartphones stand upright side by side on a warm ivory linen tablecloth with a clear gap between them, the left one placed slightly lower and the right one slightly higher, both straight-on, each filling about 55% of the image height. Olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine only at the bottom corners and side edges, low and small. The upper quarter of the image is a calm, plain, softly lit stretch of the same blurred background with no objects at all: a headline will be added there later. Portrait 2:3 image (1024×1536). Everything important stays inside the middle 84% of the height: the top and bottom eighth of the image are only background, because the picture will be cropped to 4:5. Photorealistic high-end Etsy listing photography for wedding stationery, soft natural daylight from the top-left, gentle realistic shadows under the phones, background softly out of focus, clean, airy and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is the same generic modern smartphone with thin even black bezels and rounded corners, seen straight from the front, no logo, no brand marks, no camera bump visible. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no phone overlaps another, and no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil); telefonlar büyük ve düz karşıdan; hiçbir telefon diğerinin üstüne binmiyor; her yeşil alanın dört köşesi görünüyor; üstteki başlık alanı boş; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 8.4 Telefondan düzenleme: sayfa listesi → yazı değişiyor → Yayında (No Canva)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p8_04_edit.png` · dikey 2:3 (ör. 1024×1536) · 3 yeşil alan

```
Three identical smartphones stand upright on a warm ivory linen tablecloth: the middle one slightly larger and a little forward, the two outer ones slightly smaller and further back, with clear gaps so no phone overlaps another, all straight-on. Together they fill about 55% of the image height. Olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine only at the bottom corners, low and small. The upper quarter of the image is a calm, plain, softly lit stretch of the same blurred background with no objects at all: a headline will be added there later. Portrait 2:3 image (1024×1536). Everything important stays inside the middle 84% of the height: the top and bottom eighth of the image are only background, because the picture will be cropped to 4:5. Photorealistic high-end Etsy listing photography for wedding stationery, soft natural daylight from the top-left, gentle realistic shadows under the phones, background softly out of focus, clean, airy and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is the same generic modern smartphone with thin even black bezels and rounded corners, seen straight from the front, no logo, no brand marks, no camera bump visible. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no phone overlaps another, and no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 3 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil); telefonlar büyük ve düz karşıdan; hiçbir telefon diğerinin üstüne binmiyor; her yeşil alanın dört köşesi görünüyor; üstteki başlık alanı boş; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 8.5 Her sayfa dahil: Home · Our Story · Details · RSVP (altlarında etiket boşluğu)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p8_05_pages.png` · dikey 2:3 (ör. 1024×1536) · 4 yeşil alan

```
Four identical smartphones stand upright in a straight row on a warm ivory linen tablecloth, evenly spaced with clear gaps, all the same size, each filling about 42% of the image height, the row centered vertically slightly below the middle. Below the row, a plain stretch of a warm ivory linen tablecloth with no objects, for small labels added later. Olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine only at the far corners. The upper quarter of the image is a calm, plain, softly lit stretch of the same blurred background with no objects at all: a headline will be added there later. Portrait 2:3 image (1024×1536). Everything important stays inside the middle 84% of the height: the top and bottom eighth of the image are only background, because the picture will be cropped to 4:5. Photorealistic high-end Etsy listing photography for wedding stationery, soft natural daylight from the top-left, gentle realistic shadows under the phones, background softly out of focus, clean, airy and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is the same generic modern smartphone with thin even black bezels and rounded corners, seen straight from the front, no logo, no brand marks, no camera bump visible. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no phone overlaps another, and no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil); telefonlar büyük ve düz karşıdan; hiçbir telefon diğerinin üstüne binmiyor; her yeşil alanın dört köşesi görünüyor; üstteki başlık alanı boş; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 8.6 Neler dahil: solda telefon, sağda madde listesi alanı
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p8_06_included.png` · dikey 2:3 (ör. 1024×1536) · 1 yeşil alan

```
One smartphone stands upright on the left third of a warm ivory linen tablecloth, straight-on, filling about 58% of the image height. The right 55% of the image is an empty, plain, softly textured area of the same surface and background with nothing on it, for a checklist added later. Olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine only along the left edge and the bottom-left corner. The upper fifth of the image is a calm, plain, softly lit stretch of the same blurred background with no objects at all: a headline will be added there later. Portrait 2:3 image (1024×1536). Everything important stays inside the middle 84% of the height: the top and bottom eighth of the image are only background, because the picture will be cropped to 4:5. Photorealistic high-end Etsy listing photography for wedding stationery, soft natural daylight from the top-left, gentle realistic shadows under the phones, background softly out of focus, clean, airy and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is the same generic modern smartphone with thin even black bezels and rounded corners, seen straight from the front, no logo, no brand marks, no camera bump visible. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no phone overlaps another, and no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil); telefonlar büyük ve düz karşıdan; hiçbir telefon diğerinin üstüne binmiyor; her yeşil alanın dört köşesi görünüyor; üstteki başlık alanı boş; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 8.7 Satın almadan dene: telefon + QR kartı (kartın yüzü yeşil; QR'ı Claude gerçek adresten koyar)
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p8_07_demo.png` · dikey 2:3 (ör. 1024×1536) · 2 yeşil alan

```
One smartphone stands upright slightly left of center on a warm ivory linen tablecloth, straight-on, filling about 55% of the image height. To its right, a small square place card with a thick cotton-paper edge is propped upright on a tiny stand, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges, about a third of the phone's height. Olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine only at the bottom corners, low and small. The upper quarter of the image is a calm, plain, softly lit stretch of the same blurred background with no objects at all: a headline will be added there later. Portrait 2:3 image (1024×1536). Everything important stays inside the middle 84% of the height: the top and bottom eighth of the image are only background, because the picture will be cropped to 4:5. Photorealistic high-end Etsy listing photography for wedding stationery, soft natural daylight from the top-left, gentle realistic shadows under the phones, background softly out of focus, clean, airy and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is the same generic modern smartphone with thin even black bezels and rounded corners, seen straight from the front, no logo, no brand marks, no camera bump visible. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no phone overlaps another, and no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil); telefonlar büyük ve düz karşıdan; hiçbir telefon diğerinin üstüne binmiyor; her yeşil alanın dört köşesi görünüyor; üstteki başlık alanı boş; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 8.8 Nasıl çalışır: üstten düz çekim, ortada telefon, çevresinde 4 adım yazısı alanı
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/p8_08_how.png` · dikey 2:3 (ör. 1024×1536) · 1 yeşil alan

```
Flat-lay from directly above on a warm ivory linen tablecloth: one smartphone lies in the exact center, perfectly straight (not rotated), filling about 45% of the image height. Wide plain space of the same surface all around it, for step texts added later. Olive branches with silvery leaves, a few green olives, an olive-green silk ribbon and a small bud vase of white jasmine only at the four corners, small. The upper fifth of the image is a calm, plain, softly lit stretch of the same blurred background with no objects at all: a headline will be added there later. Portrait 2:3 image (1024×1536). Everything important stays inside the middle 84% of the height: the top and bottom eighth of the image are only background, because the picture will be cropped to 4:5. Photorealistic high-end Etsy listing photography for wedding stationery, soft natural daylight from the top-left, gentle realistic shadows under the phones, background softly out of focus, clean, airy and luxurious, color world: olive green, sage, warm ivory and soft antique gold. Every phone is the same generic modern smartphone with thin even black bezels and rounded corners, seen straight from the front, no logo, no brand marks, no camera bump visible. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no phone overlaps another, and no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil); telefonlar büyük ve düz karşıdan; hiçbir telefon diğerinin üstüne binmiyor; her yeşil alanın dört köşesi görünüyor; üstteki başlık alanı boş; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.
