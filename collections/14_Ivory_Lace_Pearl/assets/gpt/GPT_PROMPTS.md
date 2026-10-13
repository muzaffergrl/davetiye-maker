# GPT görsel istekleri — Tasarım 14 · Ivory Lace & Pearls

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/14_Ivory_Lace_Pearl/DESIGN_BRIEF.md`.
Görev: `gorevler/G214-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G814-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/14_Ivory_Lace_Pearl/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G214: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **photorealistic** (bütün dekor parçalarında aynı)
- Renkler: ink `#3A3530` · deep `#8C7B66` · primary `#E9E2D6` · mist `#FAF7F2`→`#E7E0D4` · ivory `#FFFDF8` · gold `#BFA67A` · leaf `#A3A58F`
- Renk dünyası: ivory, champagne, pearl white, soft taupe and antique silver-gold
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G214` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 14` — değişiklik için `tools/katalog.py` → `WEB[14]`.

**Bu tasarımın website açılışı** (gatefold, iki kapı; katalog: Dantel kaplı fildişi gatefold; inci tokalı kopça açılır, dantel kanatlar aralanır):
On tap, the pearl clasp unhooks and slips away, the lace-covered doors part slowly to the sides like a lifted veil, and the card rises from the satin center while a strand of tiny pearls glints.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same lace gatefold folder, pearl clasp,
  decor, paper, metal and light.
- Technique for all decor: **photorealistic**; paper, fabric and metal look real.
- Palette: ink `#3A3530` · deep `#8C7B66` · primary `#E9E2D6` · mist `#FAF7F2`→`#E7E0D4` · ivory `#FFFDF8` · gold `#BFA67A` · leaf `#A3A58F` (ivory, champagne, pearl white, soft taupe and antique silver-gold).
- Typography in the W1 screens: a refined formal copperplate script for the names and a high-contrast Bodoni-style serif.
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
  lace gatefold folder at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the lace gatefold folder. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Charlotte & William · Saturday, June 5, 2027 · 4:00 PM ·
Ashbury Manor, Newport, Rhode Island · Ceremony 4:00 PM St. Mary's Chapel Garden · Cocktail Hour 5:00 PM The Pearl Room · Reception 6:30 PM The Ashbury Ballroom · Black tie optional ·
Kindly reply by April 24, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: soft pearly ivory gradient (#FAF7F2 to #E7E0D4) with a subtle satin sheen and very faint lace shadow at the edges, empty center, with a corner of delicate original ivory lace with scalloped edges, strands of small pearls and a few white garden roses, photorealistic framing the top-left and bottom-right corners and a few small floating accents (a single lustrous teardrop pearl drop on a tiny antique silver-gold cap, a white garden rose petal, a tiny ivory satin bow). Centered slightly below the middle: a tall ivory satin-finish gatefold folder (#FFFDF8), portrait-shaped (about 2:3), closed, its two doors meeting in a vertical center seam, each door edged with a hair-thin antique silver-gold line, both doors covered with a delicate original ivory lace overlay whose scalloped edge stops just short of the seam, leaving a hair-thin straight plain-ivory gap exactly on the vertical center line, closed, with an elegant pearl clasp: a cluster of five lustrous white pearls on a small antique silver-gold setting with a short loop of tiny pearls, no letters — fastened over the center seam at mid-height. Above it, typography in a refined formal copperplate script for the names and a high-contrast Bodoni-style serif: a small spaced line "YOU ARE INVITED" and the names "Charlotte & William" large; below the lace gatefold folder a small spaced line "TAP TO OPEN". All decor in photorealistic style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: lace gatefold folder ve pearl clasp net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the lace gatefold folder: a small ivory satin card with an upright oval photo window in carved ivory-white relief (tiny roses and scrolls only, no faces or figures) edged by a fine string of tiny pearls in its upper part, plain blank card below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "JUNE 5, 2027 · NEWPORT". Under the card: the names "Charlotte & William" large in the script, a small spaced line "SATURDAY · JUNE 5, 2027", the venue "Ashbury Manor" and "Newport, Rhode Island" in italic serif, four small elegant countdown boxes "235 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a soft champagne-taupe pill button with ivory lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three carved ivory-white oval frames, each hanging from a fine strand of pearls, descending to slightly different heights; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "First hello", "The proposal", "Forever begins". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Oyma fildişi oval çerçeveler, inci dizisiyle iner.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall ivory satin-finish card with a hair-thin antique silver-gold edge and only a narrow scalloped lace edge along the top holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a horizontal strand of small white pearls with a tiny lace bow in the center): "4:00 PM — Ceremony — St. Mary's Chapel Garden", "5:00 PM — Cocktail Hour — The Pearl Room", "6:30 PM — Reception — The Ashbury Ballroom" (time in small spaced serif, event in serif, place in italic serif). Below the card: a wide landscape oval frame of carved ivory-white relief (tiny roses and scrolls only — no faces, figures or profile silhouettes) with a fine string of tiny pearls around the edge, its window filled with flat pure green #00FF00 (the venue photo), under it "Ashbury Manor" and "Newport, Rhode Island", then a small line "DRESS CODE · Black tie optional". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by April 24, 2027" in serif, a soft champagne-taupe pill button with ivory lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Charlotte & William" in the script at the bottom; a small pearl clasp — the same one as on the lace gatefold folder — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı lace gatefold folder, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: soft pearly ivory gradient (#FAF7F2 to #E7E0D4) with a subtle satin sheen and very faint lace shadow at the edges, empty center, with a corner of delicate original ivory lace with scalloped edges, strands of small pearls and a few white garden roses, photorealistic entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no lace gatefold folder, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: soft pearly ivory satin (#FAF7F2) with a very subtle sheen. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf (gatefold, iki kapı) — kapanış elemanı OLMADAN
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/envelope_closed.png` · 1536×1024 · **Şeffaf zemin**

```
The same lace gatefold folder as in the W1 screens, alone and closed, WITHOUT the pearl clasp: a tall ivory satin-finish gatefold folder (#FFFDF8), portrait-shaped (about 2:3), closed, its two doors meeting in a vertical center seam, each door edged with a hair-thin antique silver-gold line, both doors covered with a delicate original ivory lace overlay whose scalloped edge stops just short of the seam, leaving a hair-thin straight plain-ivory gap exactly on the vertical center line. The folder stands perfectly upright in the exact center of the wide image, its height about 85% of the image height; the empty areas to the left and right are left for the two doors to open into. The edges where this piece will be cut must read clearly: the center seam where the two doors meet — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pearl clasp yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only an elegant pearl clasp: a cluster of five lustrous white pearls on a small antique silver-gold setting with a short loop of tiny pearls, no letters, alone, exactly as it sits on the lace gatefold folder in the W1 screens (fastened over the center seam at mid-height), drawn large so it fills about 70% of the square (Claude scales it to the lace gatefold folder), with the same perspective, material and light as on the lace gatefold folder and with no lace gatefold folder behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız pearl clasp; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf (gatefold, iki kapı) — boş
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/envelope_open.png` · 1536×1024 · **Şeffaf zemin**

```
The SAME lace gatefold folder as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: both lace-covered doors swung fully open to the left and right and lying flat, the inside of the doors lined with original fine ivory lace pattern with small roses and scallops on a pale champagne background, seamless, photorealistic, the ivory satin center panel with a shallow pocket along its lower edge; the pocket empty. The top edge of the center pocket is a crisp, clearly visible edge against the center panel. No card, nothing inside, no pearl clasp. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the lace gatefold folder in W1.2, alone: a small ivory satin card with an upright oval photo window in carved ivory-white relief (tiny roses and scrolls only, no faces or figures) edged by a fine string of tiny pearls in its upper part, plain blank card below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the lace gatefold folder so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall ivory satin-finish card with a hair-thin antique silver-gold edge, scalloped lace borders along the top and bottom edges, a cluster of white garden roses and a draped strand of small pearls at the top-left corner, photorealistic. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall ivory satin-finish card with a hair-thin antique silver-gold edge and only a narrow scalloped lace edge along the top. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: an upright oval frame of carved ivory-white relief (tiny roses and scrolls only — no faces, figures or profile silhouettes) with a fine string of tiny pearls around the edge, hanging from a single fine strand of tiny pearls that rises straight up from the top of the frame to the top margin of the image. The window inside is an upright oval window (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A wide landscape oval frame of carved ivory-white relief (tiny roses and scrolls only — no faces, figures or profile silhouettes) with a fine string of tiny pearls around the edge, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a wide oval window (about 3:2), filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of a corner of delicate original ivory lace with scalloped edges, strands of small pearls and a few white garden roses, photorealistic, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of a corner of delicate original ivory lace with scalloped edges, strands of small pearls and a few white garden roses, photorealistic, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE single lustrous teardrop pearl drop on a tiny antique silver-gold cap, in the same photorealistic style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE white garden rose petal, in the same photorealistic style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE tiny ivory satin bow, in the same photorealistic style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same photorealistic style: a horizontal strand of small white pearls with a tiny lace bow in the center, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: soft pearly ivory gradient (#FAF7F2 to #E7E0D4) with a subtle satin sheen and very faint lace shadow at the edges, empty center, with a corner of delicate original ivory lace with scalloped edges, strands of small pearls and a few white garden roses, photorealistic framing the left and right edges, and the closed lace gatefold folder with its pearl clasp resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed lace gatefold folder with its pearl clasp completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G214`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar dikey oval oyma fildişi çerçevelere girer: yüzler tam ortada, kenarlarda bol pay kalsın. Renk dünyası: fildişi, şampanya, inci beyazı, yumuşak taupe.

### 2.1 Ana portre
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in a walled white-rose garden beside a small white stone chapel at golden hour; she wears an ivory satin midi dress with a single strand of pearls, he wears a navy suit with a white pocket square. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark. Compose so that both people fit well inside a centered upright oval about as wide as the image (the photo will be cropped to an oval), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.2 Hikâye 1 — "First hello"
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a garden tea table with fine china teacups and white roses, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark. Compose so that both people fit well inside a centered upright oval about as wide as the image (the photo will be cropped to an oval), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.3 Hikâye 2 — "The proposal"
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment in a formal rose garden beside a stone fountain at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark. Compose so that both people fit well inside a centered upright oval about as wide as the image (the photo will be cropped to an oval), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.4 Hikâye 3 — "Forever begins"
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, resting on ivory lace beside a strand of pearls, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark. Compose so that both people fit well inside a centered upright oval about as wide as the image (the photo will be cropped to an oval), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.5 Mekân
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional small white stone chapel with a tall arched wooden door and a round rose window, a garden aisle lined with white garden roses and rows of white chairs leading to the door, soft golden light (not resembling any real building), true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G814)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on an ivory satin cloth, surrounded at the edges by white garden roses, a strand of pearls and a piece of ivory lace. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on an ivory satin cloth, with white garden roses, a strand of pearls and a piece of ivory lace beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/14_Ivory_Lace_Pearl/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on an ivory lace-covered gatefold envelope with a pearl clasp on an ivory satin cloth, with white garden roses, a strand of pearls and a piece of ivory lace at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
