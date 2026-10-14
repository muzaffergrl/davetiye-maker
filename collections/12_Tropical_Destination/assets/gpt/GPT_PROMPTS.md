# GPT görsel istekleri — Tasarım 12 · Tropical Destination

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/12_Tropical_Destination/DESIGN_BRIEF.md`.
Görev: `gorevler/G212-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G812-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/12_Tropical_Destination/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G212: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **vibrant watercolor** (bütün dekor parçalarında aynı)
- Renkler: ink `#1E3A3A` · deep `#1F6F6B` · primary `#2FA39A` · mist `#F2FAF8`→`#CDEBE6` · ivory `#FFFCF5` · gold `#D4A44C` · leaf `#2E7D4F`
- Renk dünyası: lagoon teal, seafoam aqua, palm green, hibiscus pink and sunny gold
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G212` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 12` — değişiklik için `tools/katalog.py` → `WEB[12]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Palmiye desenli astarlı seyahat cüzdanı; çıtçıt açılır, bavul etiketi kartlar kayar):
On tap, the brass snap pops open and the plumeria tab swings away, the wallet flap flips up to reveal the palm-leaf liner, and a luggage-tag card slides up while a monstera leaf and a white plumeria drift across the screen.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same travel wallet, brass snap with plumeria,
  decor, paper, metal and light.
- Technique for all decor: **vibrant watercolor**; paper, fabric and metal look real.
- Palette: ink `#1E3A3A` · deep `#1F6F6B` · primary `#2FA39A` · mist `#F2FAF8`→`#CDEBE6` · ivory `#FFFCF5` · gold `#D4A44C` · leaf `#2E7D4F` (lagoon teal, seafoam aqua, palm green, hibiscus pink and sunny gold).
- Typography in the W1 screens: a lively flowing script for the names and a light elegant sans-serif in spaced capitals.
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
  travel wallet at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the travel wallet. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Maya & Kai · Saturday, June 19, 2027 · 4:00 PM ·
Coral Bay Resort, Wailea, Hawaii · Ceremony 4:00 PM The Ocean Lawn · Cocktail Hour 5:00 PM The Sunset Deck · Reception 6:30 PM The Palm Pavilion · Beach formal ·
Kindly reply by May 8, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: bright airy seafoam-to-aqua gradient (#F2FAF8 to #CDEBE6) with soft sunlight flares and faint palm leaf shadows at the edges, empty center, with monstera leaves, palm fronds, pink hibiscus and white plumeria flowers in vibrant fresh watercolor framing the top-left and bottom-right corners and a few small floating accents (a white plumeria flower, a small glossy monstera leaf, a pink hibiscus flower). Centered slightly below the middle: a portrait travel wallet of bright white textured watercolor paper with a rounded top flap folded down over the front and a slim tan leather strap running vertically down the middle of the flap, its rounded end reaching just past the flap's edge onto the front panel, closed, with a small round polished brass press-snap button with a short loop of natural twine wound around it and a single fresh white plumeria flower tucked into the twine — pressed onto the rounded end of the vertical leather strap, just below the center of the flap's edge. Above it, typography in a lively flowing script for the names and a light elegant sans-serif in spaced capitals: a small spaced line "YOU ARE INVITED" and the names "Maya & Kai" large; below the travel wallet a small spaced line "TAP TO OPEN". All decor in vibrant watercolor style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: travel wallet ve brass snap with plumeria net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the travel wallet: a small bright-white card shaped like a large luggage tag (cut top corners, a reinforced eyelet hole with a short twine loop at the top), a portrait photo window in its upper part and plain blank card below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "JUNE 19, 2027 · WAILEA". Under the card: the names "Maya & Kai" large in the script, a small spaced line "SATURDAY · JUNE 19, 2027", the venue "Coral Bay Resort" and "Wailea, Hawaii" in italic light sans-serif, four small elegant countdown boxes "249 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a lagoon-teal pill button with white lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three kraft luggage tags hanging from their twine strings in a row at slightly different heights, gently swinging, palm leaves peeking in from the edges; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "Island time", "End of the pier", "Next stop: forever". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: İpli eski bavul etiketleri (yazısız), sallanarak dizilir.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall bright-white card with a softly rounded top and only a small spray of one palm leaf and two plumeria at the top holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a horizontal spray of one small palm leaf and two plumeria flowers): "4:00 PM — Ceremony — The Ocean Lawn", "5:00 PM — Cocktail Hour — The Sunset Deck", "6:30 PM — Reception — The Palm Pavilion" (time in small spaced light sans-serif, event in light sans-serif, place in italic light sans-serif). Below the card: a landscape kraft luggage tag with cut corners at its left end and a reinforced eyelet hole with a short twine string there, completely free of printed text, its window filled with flat pure green #00FF00 (the venue photo), under it "Coral Bay Resort" and "Wailea, Hawaii", then a small line "DRESS CODE · Beach formal". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by May 8, 2027" in light sans-serif, a lagoon-teal pill button with white lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Maya & Kai" in the script at the bottom; a small brass snap with plumeria — the same one as on the travel wallet — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı travel wallet, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: bright airy seafoam-to-aqua gradient (#F2FAF8 to #CDEBE6) with soft sunlight flares and faint palm leaf shadows at the edges, empty center, with monstera leaves, palm fronds, pink hibiscus and white plumeria flowers in vibrant fresh watercolor entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no travel wallet, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: bright airy seafoam watercolor wash (#F2FAF8) with a fine paper grain. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same travel wallet as in the W1 screens, alone and closed, WITHOUT the brass snap with plumeria: a portrait travel wallet of bright white textured watercolor paper with a rounded top flap folded down over the front and a slim tan leather strap running vertically down the middle of the flap, its rounded end reaching just past the flap's edge onto the front panel. Place it exactly where it will sit in envelope_open.png: horizontally centered, about 55% of the image width and about 55% of the image height (a 2:3 portrait wallet), its bottom edge at about 92% of the image height; the empty upper ~40% of the image is left for the rounded flap to lift into and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; brass snap with plumeria yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a small round polished brass press-snap button with a short loop of natural twine wound around it and a single fresh white plumeria flower tucked into the twine, alone, exactly as it sits on the travel wallet in the W1 screens (pressed onto the rounded end of the vertical leather strap, just below the center of the flap's edge), drawn large so it fills about 70% of the square (Claude scales it to the travel wallet), with the same perspective, material and light as on the travel wallet and with no travel wallet behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız brass snap with plumeria; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME travel wallet as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the rounded flap, with its leather strap, lifted fully upward, its inner side and the inside of the back panel showing lush tropical leaf pattern with monstera and palm leaves in deep green on a soft aqua background, seamless; the front panel forms an empty pocket. The top edge of the front pocket is a crisp, clearly visible edge against the liner. No card, nothing inside, no brass snap with plumeria. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the travel wallet in W1.2, alone: a small bright-white card shaped like a large luggage tag (cut top corners, a reinforced eyelet hole with a short twine loop at the top), a portrait photo window in its upper part and plain blank card below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the travel wallet so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall bright-white watercolor card with a softly rounded top, vibrant watercolor monstera leaves, palm fronds, pink hibiscus and white plumeria spilling over the top-right and bottom-left corners. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall bright-white card with a softly rounded top and only a small spray of one palm leaf and two plumeria at the top. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a blank vintage kraft luggage tag with cut top corners and a reinforced eyelet hole, a twine string looped through the eyelet and rising straight up about half the tag's height, completely free of printed text. The window inside is a portrait window (about 3:4) on the tag, filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape kraft luggage tag with cut corners at its left end and a reinforced eyelet hole with a short twine string there, completely free of printed text, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/florals_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of monstera leaves, palm fronds, pink hibiscus and white plumeria flowers in vibrant fresh watercolor, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/florals_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of monstera leaves, palm fronds, pink hibiscus and white plumeria flowers in vibrant fresh watercolor, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE white plumeria flower, in the same vibrant watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small glossy monstera leaf, in the same vibrant watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE pink hibiscus flower, in the same vibrant watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same vibrant watercolor style: a horizontal spray of one small palm leaf and two plumeria flowers, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: bright airy seafoam-to-aqua gradient (#F2FAF8 to #CDEBE6) with soft sunlight flares and faint palm leaf shadows at the edges, empty center, with monstera leaves, palm fronds, pink hibiscus and white plumeria flowers in vibrant fresh watercolor framing the left and right edges, and the closed travel wallet with its brass snap with plumeria resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed travel wallet with its brass snap with plumeria completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G212`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar bavul etiketi biçimli çerçevelere (~3:4) girer: yüzler ortada, üstte ve altta pay kalsın. Renk dünyası: lagün turkuazı, köpük yeşili, palmiye yeşili, hibiskus pembesi, gün batımı.

### 2.1 Ana portre
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other beneath leaning coconut palms on a white-sand lagoon beach with lush green volcanic mountains behind, at golden hour; she wears a flowing coral-pink chiffon maxi dress with a white plumeria in her hair, he wears a white linen shirt and light sand trousers. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "Island time"
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a beach-shack table, two coconut drinks and a pink hibiscus flower, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "End of the pier"
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment at the end of a weathered wooden pier over a turquoise lagoon at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Next stop: forever"
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of white plumeria and pink hibiscus, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional tropical resort garden set for a wedding at sunset: an open-air white pavilion with a thatched roof framed by blooming plumeria trees and tall coconut palms, rows of white chairs on a lawn, a bamboo arch with monstera leaves and white orchids, the ocean far beyond, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan sahneleri (görev G812; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Üreten: `python3 tools/paket3_sahne.py --no 12` (pilot: 01/03, G801/G803).

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Tropical Destination". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a light rattan tray on white sand, monstera leaves, pink hibiscus, white plumeria and a few seashells, the same light and the same color world (lagoon teal, seafoam aqua, palm green, hibiscus pink and sunny gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower center of the frame, the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a light rattan tray on white sand and monstera leaves, pink hibiscus, white plumeria and a few seashells. The upper 30% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: lagoon teal, seafoam aqua, palm green, hibiscus pink and sunny gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; üst %30 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a light rattan tray on white sand, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: monstera leaves, pink hibiscus, white plumeria and a few seashells. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: lagoon teal, seafoam aqua, palm green, hibiscus pink and sunny gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a light rattan tray on white sand, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: monstera leaves, pink hibiscus, white plumeria and a few seashells, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: lagoon teal, seafoam aqua, palm green, hibiscus pink and sunny gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a light rattan tray on white sand, slightly right of center and rotated about 8 degrees, surrounded at the edges by monstera leaves, pink hibiscus, white plumeria and a few seashells. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: lagoon teal, seafoam aqua, palm green, hibiscus pink and sunny gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/12_Tropical_Destination/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a cream linen sofa with a lagoon teal cushion and a ceramic coffee cup; a small arrangement of monstera leaves, pink hibiscus, white plumeria and a few seashells is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: lagoon teal, seafoam aqua, palm green, hibiscus pink and sunny gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
