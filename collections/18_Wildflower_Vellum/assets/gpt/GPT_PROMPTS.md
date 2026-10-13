# GPT görsel istekleri — Tasarım 18 · Wildflower Meadow Vellum

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/18_Wildflower_Vellum/DESIGN_BRIEF.md`.
Görev: `gorevler/G218-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G818-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/18_Wildflower_Vellum/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G218: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **colored-pencil botanical illustration** (bütün dekor parçalarında aynı)
- Renkler: ink `#2E3140` · deep `#4A6FA5` · primary `#E07A5F` · mist `#FBFAF4`→`#E8EBDC` · ivory `#FFFEF8` · gold `#C2A15E` · leaf `#6A8A4E`
- Renk dünyası: poppy red, cornflower blue, daisy white, meadow green and soft cream
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G218` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 18` — değişiklik için `tools/katalog.py` → `WEB[18]`.

**Bu tasarımın website açılışı** (vellum kılıf; katalog: Yarı saydam vellum sargı, kır çiçeği etiketiyle; vellum kayarak çıkar, kart görünür):
On tap, the wildflower label peels away, the frosted vellum sleeve slides down off the card and fades, and the card lifts up as a few colored-pencil petals flutter across the screen.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same vellum sleeve, wildflower label,
  decor, paper, metal and light.
- Technique for all decor: **colored-pencil botanical illustration**; paper, fabric and metal look real.
- Palette: ink `#2E3140` · deep `#4A6FA5` · primary `#E07A5F` · mist `#FBFAF4`→`#E8EBDC` · ivory `#FFFEF8` · gold `#C2A15E` · leaf `#6A8A4E` (poppy red, cornflower blue, daisy white, meadow green and soft cream).
- Typography in the W1 screens: a casual flowing script for the names and a graceful book serif.
- W1 screens are 1024×1536 full-bleed phone layouts (no phone hardware, no status bar, no browser bar). They may
  contain the demo text below — they are layout references only and are never sold.
- W2 parts contain **NO text, letters, numbers or monograms at all** — not on seals, stamps, labels, tags or covers.
- **ONE object per image** — never a sheet or set of several objects in one image.
- **No cast shadow and no drop shadow** on any part (the website adds its own shadows). Light every part the same
  way: soft light from the top-left. Front view, straight, centered, not cropped, empty margin around it.
- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).
- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).
- envelope_closed.png and envelope_open.png must fit together exactly: the SAME
  vellum sleeve at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the vellum sleeve. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Willow & Finn · Saturday, June 26, 2027 · 4:00 PM ·
Meadowlark Farm, Lancaster, Pennsylvania · Ceremony 4:00 PM The Wildflower Meadow · Cocktail Hour 5:00 PM The Garden Barn · Reception 6:30 PM The Meadow Tent · Garden party ·
Kindly reply by May 15, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: bright airy cream-to-pale-meadow-green gradient (#FBFAF4 to #E8EBDC) with soft blurred wildflower colors at the very bottom edge, empty center, with colorful wildflowers — red poppies, blue cornflowers, white daisies, purple lupines and grasses — detailed colored-pencil botanical illustration framing the top-left and bottom-right corners and a few small floating accents (a red poppy petal, a small blue cornflower head, a white field daisy). Centered slightly below the middle: a portrait sleeve of translucent frosted vellum, milky white and mostly opaque (about 80%), slightly larger than the soft-white cotton card inside it, the card's colorful colored-pencil wildflower border showing faintly through the vellum, closed, with a small round cream paper sticker label with a deckled edge, showing a tiny colored-pencil poppy, cornflower and daisy, no text — centered horizontally on the front of the sleeve, just below its open top edge. Above it, typography in a casual flowing script for the names and a graceful book serif: a small spaced line "YOU ARE INVITED" and the names "Willow & Finn" large; below the vellum sleeve a small spaced line "TAP TO OPEN". All decor in colored-pencil botanical illustration style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: vellum sleeve ve wildflower label net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the vellum sleeve: a small soft-white cotton card with a portrait photo window in its upper part and a colorful colored-pencil wildflower border (poppies, cornflowers, daisies) along its lower edge, the area between blank; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "JUNE 26, 2027 · LANCASTER". Under the card: the names "Willow & Finn" large in the script, a small spaced line "SATURDAY · JUNE 26, 2027", the venue "Meadowlark Farm" and "Lancaster, Pennsylvania" in italic serif, four small elegant countdown boxes "256 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a cornflower-blue pill button with white lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three portrait photo cards in a gentle row, each half covered by a frosted vellum sheet printed with white wildflower silhouettes that is lifting away from the bottom to reveal the photo; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "First hello", "The proposal", "Forever begins". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Vellum üstüne basılmış çiçek siluetleriyle örtülü kartlar; vellum kalkınca foto belirir.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall soft-white cotton card with only a small spray of a poppy and a cornflower at the bottom-left holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a horizontal spray of a poppy, a cornflower and two grass stems in the same style): "4:00 PM — Ceremony — The Wildflower Meadow", "5:00 PM — Cocktail Hour — The Garden Barn", "6:30 PM — Reception — The Meadow Tent" (time in small spaced serif, event in serif, place in italic serif). Below the card: a landscape soft-white cotton photo card with a slim margin around the window and a thin colored-pencil wildflower border along its lower edge, its window filled with flat pure green #00FF00 (the venue photo), under it "Meadowlark Farm" and "Lancaster, Pennsylvania", then a small line "DRESS CODE · Garden party". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by May 15, 2027" in serif, a cornflower-blue pill button with white lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Willow & Finn" in the script at the bottom; a small wildflower label — the same one as on the vellum sleeve — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı vellum sleeve, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 18 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: bright airy cream-to-pale-meadow-green gradient (#FBFAF4 to #E8EBDC) with soft blurred wildflower colors at the very bottom edge, empty center, with colorful wildflowers — red poppies, blue cornflowers, white daisies, purple lupines and grasses — detailed colored-pencil botanical illustration entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no vellum sleeve, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: bright airy cream cotton paper (#FBFAF4) with a fine grain. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf (vellum kılıf) — kapanış elemanı OLMADAN
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same vellum sleeve as in the W1 screens, alone and closed, WITHOUT the wildflower label: a portrait sleeve of frosted vellum, milky white and evenly semi-opaque, with softly folded side edges and an open top edge, completely EMPTY: no card inside and nothing showing through (the website places card_small.png behind it). If real partial transparency is not possible, render it solid milky white with a soft frosted texture; Claude sets the opacity in CSS. Horizontally centered, its bottom edge at about 90% of the image height and its width about 70% of the image width; the empty upper part is left for the card to rise into. Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; wildflower label yok; kesilmemiş; gölge yok; gerçek alfa.

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a small round cream paper sticker label with a deckled edge, showing a tiny colored-pencil poppy, cornflower and daisy, no text, alone, exactly as it sits on the vellum sleeve in the W1 screens (centered horizontally on the front of the sleeve, just below its open top edge), drawn large so it fills about 70% of the square (Claude scales it to the vellum sleeve), with the same perspective, material and light as on the vellum sleeve and with no vellum sleeve behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız wildflower label; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf (vellum kılıf) — boş
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME vellum sleeve as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the same empty frosted sleeve, its open top edge gently flared. No card, nothing inside, no wildflower label. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the vellum sleeve in W1.2, alone: a small soft-white cotton card with a portrait photo window in its upper part and a colorful colored-pencil wildflower border (poppies, cornflowers, daisies) along its lower edge, the area between blank. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the vellum sleeve so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall soft-white cotton card with detailed colored-pencil wildflowers — red poppies, blue cornflowers, white daisies, purple lupines and grasses — growing up from the bottom edge and a few stems along the top-right. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall soft-white cotton card with only a small spray of a poppy and a cornflower at the bottom-left. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a soft-white cotton photo card with a slim margin around the window and a thin colored-pencil wildflower border along its lower edge. The window inside is a portrait window (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape soft-white cotton photo card with a slim margin around the window and a thin colored-pencil wildflower border along its lower edge, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/florals_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of colorful wildflowers — red poppies, blue cornflowers, white daisies, purple lupines and grasses — detailed colored-pencil botanical illustration, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/florals_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of colorful wildflowers — red poppies, blue cornflowers, white daisies, purple lupines and grasses — detailed colored-pencil botanical illustration, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE red poppy petal, in the same colored-pencil botanical illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small blue cornflower head, in the same colored-pencil botanical illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE white field daisy, in the same colored-pencil botanical illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same colored-pencil botanical illustration style: a horizontal spray of a poppy, a cornflower and two grass stems in the same style, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Vellum örtü (story fotoğraflarının üstü)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/vellum_overlay.png` · 1024×1536 · **Şeffaf zemin**

```
A single sheet of translucent frosted vellum paper with exactly the size and proportion of the portrait photo card (frame_portrait.png), milky white and mostly opaque (about 80%), soft white wildflower silhouettes printed along its edges, a plain frosted center and straight clean edges. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek yaprak; frame_portrait ile aynı oran; kenarda beyaz çiçek siluetleri; alfa (tam opak çıkarsa Claude CSS ile saydamlık verir).

#### W2.18 Website hero (masaüstü üst bant)
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: bright airy cream-to-pale-meadow-green gradient (#FBFAF4 to #E8EBDC) with soft blurred wildflower colors at the very bottom edge, empty center, with colorful wildflowers — red poppies, blue cornflowers, white daisies, purple lupines and grasses — detailed colored-pencil botanical illustration framing the left and right edges, and the closed vellum sleeve with its wildflower label resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf.

---

## PAKET 2 — Örnek fotoğraflar

Görev `G218`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar dikey kartlara (~3:4) girer, üstündeki vellum kalkar: yüzler ortadaki %70'lik alanda. Renk dünyası: gelincik kırmızısı, peygamber çiçeği mavisi, papatya beyazı, çayır yeşili.

### 2.1 Ana portre
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in a sunny wildflower meadow full of poppies and cornflowers at golden hour; she wears a flowing white cotton dress with tiny embroidered flowers, he wears a light grey-blue linen suit with no tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "First hello"
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together on a picnic blanket in a meadow, a basket of strawberries and a jar of wildflowers, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "The proposal"
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment in a wildflower meadow at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Forever begins"
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a loose bouquet of poppies, cornflowers and daisies, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional farm wedding venue in summer: a white farmhouse and a garden barn, a wildflower meadow with rows of wooden chairs and a simple arch of wildflowers, a white tent in the distance, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G818)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on a soft white cotton cloth, surrounded at the edges by fresh wildflowers — poppies, cornflowers, daisies — and a sheet of translucent vellum. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on a soft white cotton cloth, with fresh wildflowers — poppies, cornflowers, daisies — and a sheet of translucent vellum beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/18_Wildflower_Vellum/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on a translucent vellum sleeve with a small round wildflower label on a soft white cotton cloth, with fresh wildflowers — poppies, cornflowers, daisies — and a sheet of translucent vellum at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
