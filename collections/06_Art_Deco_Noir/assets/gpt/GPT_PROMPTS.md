# GPT görsel istekleri — Tasarım 06 · Art Deco Black-Tie

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/06_Art_Deco_Noir/DESIGN_BRIEF.md`.
Görev: `gorevler/G206-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G806-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/06_Art_Deco_Noir/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G206: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **fine metallic gold line illustration** (bütün dekor parçalarında aynı)
- Renkler: ink `#F5EEDC` · deep `#C9A55C` · primary `#14213D` · mist `#1B2A4A`→`#0E1626` · ivory `#F5EEDC` · gold `#C9A55C` · leaf `#C9A55C`
- Renk dünyası: deep midnight navy, polished metallic gold, champagne and pearl
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G206` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 06` — değişiklik için `tools/katalog.py` → `WEB[6]`.

**Bu tasarımın website açılışı** (gatefold, iki kapı; katalog: Ortadan iki kanatlı açılan (gatefold) lacivert kapı; altın deco madalyon çözülür, kapılar yana açılır):
On tap, the gold medallion clasp turns and lifts away, the two navy doors swing open to the sides like ballroom doors, and the card rises from the center pocket as a thin band of gold light sweeps across the screen.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same navy gatefold folder, gold medallion clasp,
  decor, paper, metal and light.
- Technique for all decor: **fine metallic gold line illustration**; paper, fabric and metal look real.
- Palette: ink `#F5EEDC` · deep `#C9A55C` · primary `#14213D` · mist `#1B2A4A`→`#0E1626` · ivory `#F5EEDC` · gold `#C9A55C` · leaf `#C9A55C` (deep midnight navy, polished metallic gold, champagne and pearl).
- Typography in the W1 screens: tall slender art deco display capitals for the names and a clean geometric sans-serif in widely spaced capitals.
- W1 screens are 1024×1536 full-bleed phone layouts (no phone hardware, no status bar, no browser bar). They may
  contain the demo text below — they are layout references only and are never sold.
- W2 parts contain **NO text, letters, numbers or monograms at all** — not on seals, stamps, labels, tags or covers.
- **ONE object per image** — never a sheet or set of several objects in one image.
- **No cast shadow and no drop shadow** on any part (the website adds its own shadows). Light every part the same
  way: soft light from the top-left. Front view, straight, centered, not cropped, empty margin around it.
- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).
- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).
- envelope_closed.png and envelope_open.png must fit together exactly: the SAME
  navy gatefold folder at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the navy gatefold folder. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Vivian & Charles · Saturday, December 18, 2027 · 4:00 PM ·
The Grand Lumière Hotel, Chicago, Illinois · Ceremony 4:00 PM The Mirror Ballroom · Cocktail Hour 5:00 PM The Gold Bar · Reception 6:30 PM The Grand Salon · Black tie ·
Kindly reply by November 6, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: deep midnight navy (#1B2A4A to #0E1626) with a very subtle art deco sunburst of thin gold lines radiating from the top center, fine velvet grain, empty center, with art deco geometric corner ornament of fine metallic gold lines, stepped fans and a few small pearls (no flowers) framing the top-left and bottom-right corners and a few small floating accents (a tiny gold-rimmed crystal champagne coupe drawn in fine gold line, a small gold art deco fan medallion, a tiny gold-and-crystal starburst sparkle). Centered slightly below the middle: a tall deep-navy (#14213D) linen card-stock gatefold folder, portrait-shaped (about 2:3), closed, its two doors meeting exactly in a vertical center seam, both doors edged with fine metallic-gold art deco lines that form a stepped sunburst where they meet, the two doors' top edges together forming a stepped art deco ziggurat arch silhouette, closed, with an ornate round art deco medallion clasp in polished gold with stepped geometric rays and a small pearl in the middle, no letters — fastened over the center seam, a little above the middle. Above it, typography in tall slender art deco display capitals for the names and a clean geometric sans-serif in widely spaced capitals: a small spaced line "YOU ARE INVITED" and the names "Vivian & Charles" large; below the navy gatefold folder a small spaced line "TAP TO OPEN". All decor in fine metallic gold line illustration style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: navy gatefold folder ve gold medallion clasp net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the navy gatefold folder: a small champagne-ivory card with a fine gold-line border and a stepped art deco arch-shaped photo window outlined in fine gold lines in its upper part, plain blank card below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the display lettering and a small spaced line "DECEMBER 18, 2027 · CHICAGO". Under the card: the names "Vivian & Charles" large in the display lettering, a small spaced line "SATURDAY · DECEMBER 18, 2027", the venue "The Grand Lumière Hotel" and "Chicago, Illinois" in geometric sans-serif in spaced capitals, four small elegant countdown boxes "431 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a navy pill button with a fine gold outline and champagne lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the display lettering at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three stepped gold art deco arch frames standing side by side like ballroom doorways, the middle one taller, a faint diagonal sweep of gold light crossing them; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the display lettering underneath: "First hello", "The proposal", "Forever begins". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Basamaklı deco kemer çerçeveler, ışık süpürmesiyle belirir.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall deep-navy card with a fine metallic-gold art deco double border and only small gold fans in the corners holds the title "Order of the Day" in the display lettering and three schedule rows separated by tiny dividers (a horizontal art deco divider of fine gold lines with a small central diamond and pearl): "4:00 PM — Ceremony — The Mirror Ballroom", "5:00 PM — Cocktail Hour — The Gold Bar", "6:30 PM — Reception — The Grand Salon" (time in small spaced geometric sans-serif, event in geometric sans-serif, place in geometric sans-serif in spaced capitals). Below the card: a landscape stepped art deco frame in fine metallic gold lines with small fan ornaments at the four corners, its window filled with flat pure green #00FF00 (the venue photo), under it "The Grand Lumière Hotel" and "Chicago, Illinois", then a small line "DRESS CODE · Black tie". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the display lettering, "Kindly reply by November 6, 2027" in geometric sans-serif, a navy pill button with a fine gold outline and champagne lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Vivian & Charles" in the display lettering at the bottom; a small gold medallion clasp — the same one as on the navy gatefold folder — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı navy gatefold folder, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: deep midnight navy (#1B2A4A to #0E1626) with a very subtle art deco sunburst of thin gold lines radiating from the top center, fine velvet grain, empty center, with art deco geometric corner ornament of fine metallic gold lines, stepped fans and a few small pearls (no flowers) entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no navy gatefold folder, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: deep midnight navy velvet (#1B2A4A) with a fine even grain. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf (gatefold, iki kapı) — kapanış elemanı OLMADAN
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/envelope_closed.png` · 1536×1024 · **Şeffaf zemin**

```
The same navy gatefold folder as in the W1 screens, alone and closed, WITHOUT the gold medallion clasp: a tall deep-navy (#14213D) linen card-stock gatefold folder, portrait-shaped (about 2:3), closed, its two doors meeting exactly in a vertical center seam, both doors edged with fine metallic-gold art deco lines that form a stepped sunburst where they meet, the two doors' top edges together forming a stepped art deco ziggurat arch silhouette. The folder stands perfectly upright in the exact center of the wide image, its height about 85% of the image height; the empty areas to the left and right are left for the two doors to open into. Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; gold medallion clasp yok; kesilmemiş; gölge yok; gerçek alfa.

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only an ornate round art deco medallion clasp in polished gold with stepped geometric rays and a small pearl in the middle, no letters, alone, exactly as it sits on the navy gatefold folder in the W1 screens (fastened over the center seam, a little above the middle), drawn large so it fills about 70% of the square (Claude scales it to the navy gatefold folder), with the same perspective, material and light as on the navy gatefold folder and with no navy gatefold folder behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız gold medallion clasp; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf (gatefold, iki kapı) — boş
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/envelope_open.png` · 1536×1024 · **Şeffaf zemin**

```
The SAME navy gatefold folder as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: both doors swung fully open to the left and right and lying flat, the inside of the doors lined with original art deco fan and arch geometric pattern in thin metallic gold lines on deep navy, seamless, the center panel faced in champagne-ivory card with a shallow deep-navy pocket across its lower third whose straight top edge is a crisp fine metallic-gold line; the pocket empty. No card, nothing inside, no gold medallion clasp. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the navy gatefold folder in W1.2, alone: a small champagne-ivory card with a fine gold-line border and a stepped art deco arch-shaped photo window outlined in fine gold lines in its upper part, plain blank card below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the navy gatefold folder so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall deep-navy card with a fine metallic-gold art deco double border and stepped corners, a gold fan ornament with tiny pearls crowning the top and a smaller fan at the bottom center. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall deep-navy card with a fine metallic-gold art deco double border and only small gold fans in the corners. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a stepped art deco arch frame in fine metallic gold lines with small corner fans. The window inside is a tall stepped-arch window (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape stepped art deco frame in fine metallic gold lines with small fan ornaments at the four corners, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of art deco geometric corner ornament of fine metallic gold lines, stepped fans and a few small pearls (no flowers), isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of art deco geometric corner ornament of fine metallic gold lines, stepped fans and a few small pearls (no flowers), isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE tiny gold-rimmed crystal champagne coupe drawn in fine gold line, in the same fine metallic gold line illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small gold art deco fan medallion, in the same fine metallic gold line illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE tiny gold-and-crystal starburst sparkle, in the same fine metallic gold line illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same fine metallic gold line illustration style: a horizontal art deco divider of fine gold lines with a small central diamond and pearl, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero (masaüstü üst bant)
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: deep midnight navy (#1B2A4A to #0E1626) with a very subtle art deco sunburst of thin gold lines radiating from the top center, fine velvet grain, empty center, with art deco geometric corner ornament of fine metallic gold lines, stepped fans and a few small pearls (no flowers) framing the left and right edges, and the closed navy gatefold folder with its gold medallion clasp resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf.

---

## PAKET 2 — Örnek fotoğraflar

Görev `G206`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar basamaklı deco kemer çerçevelere (~3:4) girer: yüzler ortada, başın üstünde pay kalsın (kemer tepesi kırpar). Renk dünyası: gece laciverti, altın, şampanya, inci; sıcak akşam ışığı.

### 2.1 Ana portre
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in a glamorous 1920s-style hotel lobby with brass details and mirrored walls, warm evening light; she wears a sleek champagne satin gown with a pearl headband, he wears a classic black tuxedo with a bow tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "First hello"
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a small round table in a vintage jazz lounge, two champagne coupes, warm amber light, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "The proposal"
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment on a grand marble staircase with brass railings in the evening: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Forever begins"
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands showing a delicate engagement ring as they clink two crystal champagne coupes, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional grand 1920s hotel ballroom set for a wedding: mirrored walls, a gold art deco ceiling, crystal chandeliers, round tables with white linen and tall candles, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G806)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on a dark navy velvet surface, surrounded at the edges by two crystal champagne coupes, a string of pearls and gold art deco accents. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on a dark navy velvet surface, with two crystal champagne coupes, a string of pearls and gold art deco accents beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/06_Art_Deco_Noir/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on a deep navy envelope with a gold deco medallion on a dark navy velvet surface, with two crystal champagne coupes, a string of pearls and gold art deco accents at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
