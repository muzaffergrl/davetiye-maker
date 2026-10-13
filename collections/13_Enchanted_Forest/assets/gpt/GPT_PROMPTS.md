# GPT görsel istekleri — Tasarım 13 · Enchanted Forest Storybook

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/13_Enchanted_Forest/DESIGN_BRIEF.md`.
Görev: `gorevler/G213-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G813-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/13_Enchanted_Forest/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G213: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **classic storybook ink-and-watercolor illustration** (bütün dekor parçalarında aynı)
- Renkler: ink `#2B2A1F` · deep `#4A5A3A` · primary `#6F7F4F` · mist `#EDEFE3`→`#BFC7A8` · ivory `#F8F4E6` · gold `#B7975A` · leaf `#55703F`
- Renk dünyası: moss green, fern green, aged cream parchment and warm lantern gold
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G213` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 13` — değişiklik için `tools/katalog.py` → `WEB[13]`.

**Bu tasarımın website açılışı** (kitap kapağı; katalog: Kabartma çiçek bordürlü eski masal kitabı kapağı (yazısız); kapak açılır, sayfalar çevrilir):
On tap, the brass clasp unhooks and swings away, the moss-green cover swings open to the left like a storybook, the first page turns, and the card rises from the page while tiny fireflies glow up around it.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same storybook, brass book clasp,
  decor, paper, metal and light.
- Technique for all decor: **classic storybook ink-and-watercolor illustration**; paper, fabric and metal look real.
- Palette: ink `#2B2A1F` · deep `#4A5A3A` · primary `#6F7F4F` · mist `#EDEFE3`→`#BFC7A8` · ivory `#F8F4E6` · gold `#B7975A` · leaf `#55703F` (moss green, fern green, aged cream parchment and warm lantern gold).
- Typography in the W1 screens: a whimsical calligraphic script for the names and an old-style storybook serif.
- W1 screens are 1024×1536 full-bleed phone layouts (no phone hardware, no status bar, no browser bar). They may
  contain the demo text below — they are layout references only and are never sold.
- W2 parts contain **NO text, letters, numbers or monograms at all** — not on seals, stamps, labels, tags or covers.
- **ONE object per image** — never a sheet or set of several objects in one image.
- **No cast shadow and no drop shadow** on any part (the website adds its own shadows). Light every part the same
  way: soft light from the top-left. Front view, straight, centered, not cropped, empty margin around it.
- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).
- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).
- envelope_closed.png, closure.png and envelope_open.png must fit together exactly: the SAME
  storybook at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for the other two. Do not draw separate flap, door, pocket or cover pieces — Claude cuts interlocking
  pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Aurora & Rowan · Saturday, August 14, 2027 · 4:00 PM ·
Fernwood Glen, Portland, Oregon · Ceremony 4:00 PM The Mossy Clearing · Cocktail Hour 5:00 PM The Lantern Grove · Reception 6:30 PM The Forest Hall · Garden formal ·
Kindly reply by July 3, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: dreamy misty forest green gradient (#EDEFE3 to #BFC7A8) with soft glowing firefly bokeh and faint silhouettes of tall trees at the edges, empty center, with ferns, moss, small toadstool mushrooms, ivy and tiny glowing fireflies, classic children's storybook illustration with fine ink lines and soft watercolor framing the top-left and bottom-right corners and a few small floating accents (a tiny glowing firefly, a small red-capped toadstool mushroom, a curled young fern frond). Centered slightly below the middle: an antique closed storybook seen straight from the front: a deep moss-green cloth cover with an embossed gold floral border of ferns and tiny mushrooms and an empty oval cartouche in the center (no title, no letters), slightly worn corners, the spine on the left, closed, with a small antique brass book clasp with a leaf-shaped engraving, no letters — hooked over the cover's right edge at mid-height, holding the book shut. Above it, typography in a whimsical calligraphic script for the names and an old-style storybook serif: a small spaced line "YOU ARE INVITED" and the names "Aurora & Rowan" large; below the storybook a small spaced line "TAP TO OPEN". All decor in classic storybook ink-and-watercolor illustration style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: storybook ve brass book clasp net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the storybook: a small aged-cream book-page card with soft foxing and deckled edges, a portrait photo window held by four vintage black photo-corner mounts in its upper part, plain blank paper below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "AUGUST 14, 2027 · PORTLAND". Under the card: the names "Aurora & Rowan" large in the script, a small spaced line "SATURDAY · AUGUST 14, 2027", the venue "Fernwood Glen" and "Portland, Oregon" in italic serif, four small elegant countdown boxes "305 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a moss-green pill button with a thin gold line and cream lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: an open storybook spread with three photo-cornered pictures mounted on its pages — one on the left page and two on the right — as if just revealed by a turning page; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "First hello", "The proposal", "Forever begins". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Kitap sayfalarına yapıştırılmış fotoğraf köşelikli kartlar, sayfa çevrilince belirir.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall aged-cream storybook page with the same fine ink rule border and only a small ivy sprig with two tiny mushrooms at the top holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a horizontal sprig of ivy with two tiny mushrooms and a firefly glow): "4:00 PM — Ceremony — The Mossy Clearing", "5:00 PM — Cocktail Hour — The Lantern Grove", "6:30 PM — Reception — The Forest Hall" (time in small spaced serif, event in serif, place in italic). Below the card: a landscape aged-cream book-page card on which four vintage black photo-corner mounts hold the picture rectangle, its window filled with flat pure green #00FF00 (the venue photo), under it "Fernwood Glen" and "Portland, Oregon", then a small line "DRESS CODE · Garden formal". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by July 3, 2027" in serif, a moss-green pill button with a thin gold line and cream lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Aurora & Rowan" in the script at the bottom; a small brass book clasp — the same one as on the storybook — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı storybook, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: dreamy misty forest green gradient (#EDEFE3 to #BFC7A8) with soft glowing firefly bokeh and faint silhouettes of tall trees at the edges, empty center, with ferns, moss, small toadstool mushrooms, ivy and tiny glowing fireflies, classic children's storybook illustration with fine ink lines and soft watercolor entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no storybook, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: dreamy misty pale moss-green watercolor wash (#EDEFE3) with a faint paper grain. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf (kitap kapağı) — kapanış elemanı OLMADAN
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/envelope_closed.png` · 1536×1024 · **Şeffaf zemin**

```
The same storybook as in the W1 screens, alone and closed, WITHOUT the brass book clasp: an antique closed storybook seen straight from the front: a deep moss-green cloth cover with an embossed gold floral border of ferns and tiny mushrooms and an empty oval cartouche in the center (no title, no letters), slightly worn corners, the spine on the left. The book's spine sits exactly at the horizontal center of the wide image and the closed cover fills the right half, its height about 85% of the image height; the left half stays empty for the cover to swing open into. Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; brass book clasp yok; kesilmemiş; gölge yok; gerçek alfa.

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a small antique brass book clasp with a leaf-shaped engraving, no letters, alone, exactly as it sits on the storybook in the W1 screens (hooked over the cover's right edge at mid-height, holding the book shut) and at the same scale as in envelope_closed.png, with no storybook behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız brass book clasp; harf/monogram yok; zarfla aynı ölçek; gölge yok; alfa.

#### W2.5 Açık zarf (kitap kapağı) — boş
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/envelope_open.png` · 1536×1024 · **Şeffaf zemin**

```
The SAME storybook as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the cover swung fully open to the left and lying flat, its inside lined with dark moss green (#4A5A3A) background with a storybook-style repeat of tiny ferns, mushrooms and stars in muted gold; the first page on the right is blank aged-cream paper with soft foxing (no text) and sits exactly where the closed cover was. No card, nothing inside, no brass book clasp. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the storybook in W1.2, alone: a small aged-cream book-page card with soft foxing and deckled edges, a portrait photo window held by four vintage black photo-corner mounts in its upper part, plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading); the rest of the card is blank (no text). Slightly narrower than the storybook so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall aged-cream storybook page with soft foxing, deckled edges and a fine ink rule border, a classic storybook ink-and-watercolor vignette of ferns, moss, ivy and small toadstool mushrooms with a few glowing fireflies along the top and in the bottom corners. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall aged-cream storybook page with the same fine ink rule border and only a small ivy sprig with two tiny mushrooms at the top. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: an aged-cream book-page card with soft foxing on which four vintage black photo-corner mounts hold the picture rectangle. The window inside is a portrait window (about 3:4) held by the four photo corners, filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape aged-cream book-page card on which four vintage black photo-corner mounts hold the picture rectangle, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of ferns, moss, small toadstool mushrooms, ivy and tiny glowing fireflies, classic children's storybook illustration with fine ink lines and soft watercolor, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of ferns, moss, small toadstool mushrooms, ivy and tiny glowing fireflies, classic children's storybook illustration with fine ink lines and soft watercolor, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE tiny glowing firefly with a soft warm halo, in the same classic storybook ink-and-watercolor illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small red-capped toadstool mushroom, in the same classic storybook ink-and-watercolor illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE curled young fern frond, in the same classic storybook ink-and-watercolor illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same classic storybook ink-and-watercolor illustration style: a horizontal sprig of ivy with two tiny mushrooms and a firefly glow, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero (masaüstü üst bant)
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: dreamy misty forest green gradient (#EDEFE3 to #BFC7A8) with soft glowing firefly bokeh and faint silhouettes of tall trees at the edges, empty center, with ferns, moss, small toadstool mushrooms, ivy and tiny glowing fireflies, classic children's storybook illustration with fine ink lines and soft watercolor framing the left and right edges, and the closed storybook with its brass book clasp resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf.

---

## PAKET 2 — Örnek fotoğraflar

Görev `G213`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in the first image" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar fotoğraf köşelikli dikey kartlara (~3:4) girer: yüzler ortada; köşeler köşeliklerle hafifçe örtülür. Renk dünyası: yosun yeşili, eğrelti, eski kâğıt kreması, fener altını.

### 2.1 Ana portre
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in a misty old-growth forest among ferns and moss at golden hour, soft rays of light; she wears a flowing sage-green tulle gown with a crown of tiny white flowers, he wears a moss-green tweed suit with a cream shirt. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "First hello"
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, a candid first-date moment laughing together while reading an old book on a moss-covered log in the forest (no visible text), relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "The proposal"
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, the proposal moment in a forest clearing ringed with glowing lanterns and ferns at dusk: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Forever begins"
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of ferns, moss and tiny white flowers, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional enchanted forest glen wedding venue at dusk: a mossy clearing among tall evergreen trees, rows of wooden benches, glowing lanterns hanging from branches and a rustic arch of ferns and ivy, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G813)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on a mossy wooden tabletop, surrounded at the edges by ferns, moss, small mushrooms and tiny warm fairy lights. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on a mossy wooden tabletop, with ferns, moss, small mushrooms and tiny warm fairy lights beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/13_Enchanted_Forest/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on an antique green storybook with an embossed gold border and no title on a mossy wooden tabletop, with ferns, moss, small mushrooms and tiny warm fairy lights at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
