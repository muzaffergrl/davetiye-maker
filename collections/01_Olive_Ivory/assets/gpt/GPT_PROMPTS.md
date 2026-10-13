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

## PAKET 3 — Etsy ilan mockup'ları (görev G801)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on an ivory linen tablecloth, surrounded at the edges by olive branches, a few green olives and an olive-green silk ribbon. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on an ivory linen tablecloth, with olive branches, a few green olives and an olive-green silk ribbon beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/01_Olive_Ivory/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on an olive-green textured envelope with an ivory lace edge and an oval botanical seal on an ivory linen tablecloth, with olive branches, a few green olives and an olive-green silk ribbon at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
