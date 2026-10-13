# GPT görsel istekleri — Tasarım 09 · Lavender Provence

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/09_Lavender_Provence/DESIGN_BRIEF.md`.
Görev: `gorevler/G209-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G809-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/09_Lavender_Provence/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G209: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **pressed flower flat-lay photograph** (bütün dekor parçalarında aynı)
- Renkler: ink `#2E2A3F` · deep `#5D5287` · primary `#9C8FC4` · mist `#F3F0F7`→`#D9D2E8` · ivory `#FAF8F3` · gold `#B5A27A` · leaf `#8A9A78`
- Renk dünyası: soft lavender, dusty purple, natural linen cream and sage
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G209` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 09` — değişiklik için `tools/katalog.py` → `WEB[9]`.

**Bu tasarımın website açılışı** (keten kese; katalog: Ketenden bir kese; sicim çözülür, kese ağzı açılır, kart dışarı kayar):
On tap, the jute twine with its lavender bundle unties and slips away, the linen pouch loosens and opens, and the card slides up out of it while dried lavender buds scatter on a summer breeze.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same linen pouch, lavender-and-twine tie,
  decor, paper, metal and light.
- Technique for all decor: **pressed flower flat-lay photograph**; paper, fabric and metal look real.
- Palette: ink `#2E2A3F` · deep `#5D5287` · primary `#9C8FC4` · mist `#F3F0F7`→`#D9D2E8` · ivory `#FAF8F3` · gold `#B5A27A` · leaf `#8A9A78` (soft lavender, dusty purple, natural linen cream and sage).
- Typography in the W1 screens: a light airy brush script for the names and a delicate Garamond-style serif.
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
  linen pouch at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn on a canvas of the same size so it overlays
  envelope_closed.png pixel for pixel. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Amélie & Louis · Saturday, July 3, 2027 · 4:00 PM ·
Les Jardins de Lavande, Gordes, France · Ceremony 4:00 PM The Lavender Field · Cocktail Hour 5:00 PM The Stone Terrace · Reception 6:30 PM The Old Barn · Summer chic ·
Kindly reply by May 22, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: soft lavender-tinted handmade cotton paper (#F3F0F7 at the top deepening to #D9D2E8 at the bottom) photographed flat from directly above in soft daylight, faint paper fibers, calm empty center, with real pressed and dried lavender stems, small white daisies and golden wheat ears arranged as one corner cluster, photographed flat from above and pressed completely flat framing the top-left and bottom-right corners and a few small floating accents (a pressed dried lavender stem, a pressed white daisy, a small pressed sprig of wild thyme). Centered slightly below the middle: a small natural cream linen drawstring pouch (#FAF8F3, fine visible weave), portrait-shaped, its mouth gathered closed at the top, closed, with a small bundle of dried lavender stems tied with natural jute twine in a simple bow — tied around the gathered neck of the pouch. Above it, typography in a light airy brush script for the names and a delicate Garamond-style serif: a small spaced line "YOU ARE INVITED" and the names "Amélie & Louis" large; below the linen pouch a small spaced line "TAP TO OPEN". All decor in pressed flower flat-lay photograph style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: linen pouch ve lavender-and-twine tie net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the linen pouch: a small cream deckle-edged cotton card with a thin border of tiny pressed lavender florets around a portrait photo window in its upper part and plain blank paper below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "JULY 3, 2027 · GORDES". Under the card: the names "Amélie & Louis" large in the script, a small spaced line "SATURDAY · JULY 3, 2027", the venue "Les Jardins de Lavande" and "Gordes, France" in italic serif, four small elegant countdown boxes "263 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a soft dusty-purple pill button with cream lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three pressed-flower cards tumbling in at loose angles as if carried by a summer breeze, not overlapping; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "Rosé in the square", "In the lavender", "Tied together". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Kurutulmuş çiçek basılmış (pressed flower) kartlar, rüzgârla savrulur gibi gelir.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall cream deckle-edged card with only one pressed lavender stem laid along the top holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a single pressed lavender stem with one small white daisy lying horizontally, flat-lay photo): "4:00 PM — Ceremony — The Lavender Field", "5:00 PM — Cocktail Hour — The Stone Terrace", "6:30 PM — Reception — The Old Barn" (time in small spaced serif, event in serif, place in italic serif). Below the card: a landscape cream deckle-edged card with a thin border of tiny pressed lavender florets around the window, its window filled with flat pure green #00FF00 (the venue photo), under it "Les Jardins de Lavande" and "Gordes, France", then a small line "DRESS CODE · Summer chic". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by May 22, 2027" in serif, a soft dusty-purple pill button with cream lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Amélie & Louis" in the script at the bottom; a small lavender-and-twine tie — the same one as on the linen pouch — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı linen pouch, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: soft lavender-tinted handmade cotton paper (#F3F0F7 at the top deepening to #D9D2E8 at the bottom) photographed flat from directly above in soft daylight, faint paper fibers, calm empty center, with real pressed and dried lavender stems, small white daisies and golden wheat ears arranged as one corner cluster, photographed flat from above and pressed completely flat entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no linen pouch, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: natural undyed cream linen weave (#FAF8F3), evenly lit. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf (keten kese) — kapanış elemanı OLMADAN
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same linen pouch as in the W1 screens, alone and closed, WITHOUT the lavender-and-twine tie: a small natural cream linen drawstring pouch (#FAF8F3, fine visible weave), portrait-shaped, its mouth gathered closed at the top. Horizontally centered, its bottom edge at about 90% of the image height and its width about 60% of the image width; the empty upper part is left for the card to rise into. The edges where this piece will be cut must read clearly: the gathered mouth — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; lavender-and-twine tie yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/closure.png` · 1024×1536 · **Şeffaf zemin**

```
Only a small bundle of dried lavender stems tied with natural jute twine in a simple bow, alone, exactly as it sits on the linen pouch in the W1 screens (tied around the gathered neck of the pouch), with no linen pouch behind it. Draw it on a canvas of exactly the same size as envelope_closed.png and give envelope_closed.png as the reference image: the lavender-and-twine tie sits exactly where it wraps the linen pouch there, so the two images overlay pixel for pixel. Where it wraps around the edges, its ends stop exactly at the linen pouch's outline. The linen pouch itself is NOT drawn. Front view, perfectly straight. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız lavender-and-twine tie; harf/monogram yok; envelope_closed üstüne 1:1 oturuyor (yarı saydam üst üste konunca zarfın kenarlarıyla çakışıyor); uçlar zarf kenarında bitiyor; gölge yok; alfa.

#### W2.5 Açık zarf (keten kese) — boş
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME linen pouch as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: its gathered mouth loosened and opened wide into an oval, seen very slightly from above so the inside of the back wall shows soft lavender (#9C8FC4) linen with a delicate block-printed sprig pattern in cream as the lining; the front rim stays plain cream linen (not folded over); the pouch empty. The front rim of the mouth is a crisp, clearly visible edge against the lining. No card, nothing inside, no lavender-and-twine tie. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the linen pouch in W1.2, alone: a small cream deckle-edged cotton card with a thin border of tiny pressed lavender florets around a portrait photo window in its upper part and plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the linen pouch so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall cream deckle-edged handmade cotton card with real pressed lavender stems, small white daisies and golden wheat ears laid along the left edge and across the top, pressed completely flat. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall cream deckle-edged card with only one pressed lavender stem laid along the top. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a cream deckle-edged card with a thin border of tiny pressed lavender florets around the window. The window inside is a portrait window (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape cream deckle-edged card with a thin border of tiny pressed lavender florets around the window, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/florals_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of real pressed and dried lavender stems, small white daisies and golden wheat ears arranged as one corner cluster, photographed flat from above and pressed completely flat, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/florals_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of real pressed and dried lavender stems, small white daisies and golden wheat ears arranged as one corner cluster, photographed flat from above and pressed completely flat, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE pressed dried lavender stem, in the same pressed flower flat-lay photograph style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE pressed white daisy, in the same pressed flower flat-lay photograph style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small pressed sprig of wild thyme with tiny pink-purple flowers, in the same pressed flower flat-lay photograph style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same pressed flower flat-lay photograph style: a single pressed lavender stem with one small white daisy lying horizontally, flat-lay photo, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: soft lavender-tinted handmade cotton paper (#F3F0F7 at the top deepening to #D9D2E8 at the bottom) photographed flat from directly above in soft daylight, faint paper fibers, calm empty center, with real pressed and dried lavender stems, small white daisies and golden wheat ears arranged as one corner cluster, photographed flat from above and pressed completely flat framing the left and right edges, and the closed linen pouch with its lavender-and-twine tie resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed linen pouch with its lavender-and-twine tie completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G209`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar presli çiçek bordürlü dikey kartlara (~3:4) girer: yüzler ortadaki %70'lik alanda. Renk dünyası: lavanta, krem keten, adaçayı, yaz akşamı ışığı.

### 2.1 Ana portre
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in a blooming lavender field at golden hour, soft hills behind; she wears a flowing lavender chiffon midi dress, a straw hat in her hand, he wears a light stone-colored linen suit with an open collar. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "Rosé in the square"
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a small bistro table in a sunny stone village square, two glasses of rosé and a bunch of lavender, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "In the lavender"
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment between the rows of a lavender field at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Tied together"
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a small bundle of lavender tied with twine, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional Provençal stone farmhouse wedding venue at golden hour: honey-colored stone walls with lavender-blue shutters, a terrace with rows of wooden chairs facing long lavender rows, an old stone barn, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G809)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on a natural cream linen cloth, surrounded at the edges by dried lavender bundles tied with twine and small white daisies. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on a natural cream linen cloth, with dried lavender bundles tied with twine and small white daisies beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/09_Lavender_Provence/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on a cream linen pouch tied with jute twine on a natural cream linen cloth, with dried lavender bundles tied with twine and small white daisies at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
