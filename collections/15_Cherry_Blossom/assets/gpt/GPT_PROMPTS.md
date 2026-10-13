# GPT görsel istekleri — Tasarım 15 · Cherry Blossom Spring

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/15_Cherry_Blossom/DESIGN_BRIEF.md`.
Görev: `gorevler/G215-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G815-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/15_Cherry_Blossom/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G215: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **fine ink and watercolor** (bütün dekor parçalarında aynı)
- Renkler: ink `#3A3438` · deep `#8A6B76` · primary `#F2C4CE` · mist `#FBF5F6`→`#E9E1E6` · ivory `#FFFCFB` · gold `#B9A07A` · leaf `#6E5E55`
- Renk dünyası: soft blossom pink, dove grey, warm white and dark twig brown
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G215` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 15` — değişiklik için `tools/katalog.py` → `WEB[15]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Kiraz çiçeği astarlı açık gri zarf; kapak açılınca yapraklar uçuşur):
On tap, the blossom twig loosens and drifts off, the curved grey flap lifts, and the card rises as a gentle flurry of cherry petals swirls up and floats across the screen.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same dove-grey envelope, cherry blossom twig,
  decor, paper, metal and light.
- Technique for all decor: **fine ink and watercolor**; paper, fabric and metal look real.
- Palette: ink `#3A3438` · deep `#8A6B76` · primary `#F2C4CE` · mist `#FBF5F6`→`#E9E1E6` · ivory `#FFFCFB` · gold `#B9A07A` · leaf `#6E5E55` (soft blossom pink, dove grey, warm white and dark twig brown).
- Typography in the W1 screens: a delicate formal script for the names and a refined high-contrast display serif.
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
  dove-grey envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the dove-grey envelope. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Hana & Ethan · Saturday, April 3, 2027 · 4:00 PM ·
Blossom Hill Gardens, Washington, D.C. · Ceremony 4:00 PM The Blossom Walk · Cocktail Hour 5:00 PM The Pavilion Terrace · Reception 6:30 PM The Garden Hall · Spring formal ·
Kindly reply by February 20, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: very soft pale pink-to-dove-grey gradient (#FBF5F6 to #E9E1E6) with a few blurred drifting cherry petals at the edges, empty center, with cherry blossom branches with dark brown twigs, pale pink five-petal blossoms and buds, fine ink lines with soft watercolor wash framing the top-left and bottom-right corners and a few small floating accents (a pale pink cherry blossom petal, a five-petal pink cherry blossom, a small pink cherry bud on a tiny twig). Centered slightly below the middle: a soft dove-grey (#BDB5BA) mulberry-paper envelope with fine fibers, about 5:4 wider than tall, with a softly curved (rounded) flap finished in a fine deckled white edge, closed, with a small cluster of three pink cherry blossoms on a short dark brown twig — tucked onto the edge of the curved flap at its center. Above it, typography in a delicate formal script for the names and a refined high-contrast display serif: a small spaced line "YOU ARE INVITED" and the names "Hana & Ethan" large; below the dove-grey envelope a small spaced line "TAP TO OPEN". All decor in fine ink and watercolor style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: dove-grey envelope ve cherry blossom twig net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the dove-grey envelope: a small warm-white mulberry-paper card with a perfectly round photo window ringed by a slender dark-brown cherry branch bent into a full circle, blossoming with pale pink flowers and buds over its upper third, with a hair-thin brushed-gold inner ring, plain blank paper below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "APRIL 3, 2027 · WASHINGTON". Under the card: the names "Hana & Ethan" large in the script, a small spaced line "SATURDAY · APRIL 3, 2027", the venue "Blossom Hill Gardens" and "Washington, D.C." in italic serif, four small elegant countdown boxes "172 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a dusty mauve-rose pill button with white lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three round blossoming cherry-branch frames of different sizes drifting down the page in a gentle diagonal like falling petals; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "Our first spring", "Under the blossoms", "In full bloom". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Yuvarlak (round) çerçeveler, yaprak gibi süzülerek iner.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall warm-white mulberry-paper card with a thin brushed-gold border and only a short blossom twig at the top-left corner holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a short horizontal cherry blossom twig with three blossoms): "4:00 PM — Ceremony — The Blossom Walk", "5:00 PM — Cocktail Hour — The Pavilion Terrace", "6:30 PM — Reception — The Garden Hall" (time in small spaced serif, event in serif, place in italic serif). Below the card: a wide oval version of the same blossoming cherry-branch frame with the hair-thin brushed-gold inner ring, its window filled with flat pure green #00FF00 (the venue photo), under it "Blossom Hill Gardens" and "Washington, D.C.", then a small line "DRESS CODE · Spring formal". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by February 20, 2027" in serif, a dusty mauve-rose pill button with white lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Hana & Ethan" in the script at the bottom; a small cherry blossom twig — the same one as on the dove-grey envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı dove-grey envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: very soft pale pink-to-dove-grey gradient (#FBF5F6 to #E9E1E6) with a few blurred drifting cherry petals at the edges, empty center, with cherry blossom branches with dark brown twigs, pale pink five-petal blossoms and buds, fine ink lines with soft watercolor wash entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no dove-grey envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: very soft pale blush-white mulberry paper (#FBF5F6) with fine fibers. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same dove-grey envelope as in the W1 screens, alone and closed, WITHOUT the cherry blossom twig: a soft dove-grey (#BDB5BA) mulberry-paper envelope with fine fibers, about 5:4 wider than tall, with a softly curved (rounded) flap finished in a fine deckled white edge. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; cherry blossom twig yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a small cluster of three pink cherry blossoms on a short dark brown twig, alone, exactly as it sits on the dove-grey envelope in the W1 screens (tucked onto the edge of the curved flap at its center), drawn large so it fills about 70% of the square (Claude scales it to the dove-grey envelope), with the same perspective, material and light as on the dove-grey envelope and with no dove-grey envelope behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız cherry blossom twig; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME dove-grey envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the rounded flap folded fully upward, its inner side and the inside of the back showing pale grey background with a delicate repeat of small pink cherry blossoms and buds; the front pocket empty. The top edge of the front pocket is a crisp, clearly visible edge against the liner. No card, nothing inside, no cherry blossom twig. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the dove-grey envelope in W1.2, alone: a small warm-white mulberry-paper card with a perfectly round photo window ringed by a slender dark-brown cherry branch bent into a full circle, blossoming with pale pink flowers and buds over its upper third, with a hair-thin brushed-gold inner ring, plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the dove-grey envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall warm-white mulberry-paper card with a thin brushed-gold border and softly deckled edges, a lush fine ink-and-watercolor cherry blossom branch heavy with blossoms and buds arching from the top-left across the whole top edge and down the right side, a smaller blossoming branch rising from the bottom-left, a few loose petals. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall warm-white mulberry-paper card with a thin brushed-gold border and only a short blossom twig at the top-left corner. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a round frame made of a slender dark-brown cherry branch bent into a full circle, blossoming with pale pink flowers and buds over its upper third, with a hair-thin brushed-gold inner ring. The window inside is a perfectly round window, filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A wide oval version of the same blossoming cherry-branch frame with the hair-thin brushed-gold inner ring, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a wide oval window (about 3:2), filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/florals_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of cherry blossom branches with dark brown twigs, pale pink five-petal blossoms and buds, fine ink lines with soft watercolor wash, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/florals_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of cherry blossom branches with dark brown twigs, pale pink five-petal blossoms and buds, fine ink lines with soft watercolor wash, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE pale pink cherry blossom petal, in the same fine ink and watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE five-petal pink cherry blossom, in the same fine ink and watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small pink cherry bud on a tiny twig, in the same fine ink and watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same fine ink and watercolor style: a short horizontal cherry blossom twig with three blossoms, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: very soft pale pink-to-dove-grey gradient (#FBF5F6 to #E9E1E6) with a few blurred drifting cherry petals at the edges, empty center, with cherry blossom branches with dark brown twigs, pale pink five-petal blossoms and buds, fine ink lines with soft watercolor wash framing the left and right edges, and the closed dove-grey envelope with its cherry blossom twig resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed dove-grey envelope with its cherry blossom twig completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G215`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar yuvarlak çerçevelere girer: yüzler tam ortadaki dairede, kenarlarda bol pay kalsın. Renk dünyası: kiraz çiçeği pembesi, güvercin grisi, sıcak beyaz.

### 2.1 Ana portre
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other under blooming cherry blossom trees in a park in spring, soft daylight, pink petals in the air; she wears a soft blush-pink tulle midi dress, he wears a dove-grey suit with a pale pink tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark. Compose so that both people fit well inside a centered circle whose diameter is the image width (the photo will be cropped to a circle), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.2 Hikâye 1 — "Our first spring"
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a small café table in spring, two cups of tea and a sprig of cherry blossoms, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark. Compose so that both people fit well inside a centered circle whose diameter is the image width (the photo will be cropped to a circle), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.3 Hikâye 2 — "Under the blossoms"
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment on a path under an arch of blooming cherry trees with petals falling: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark. Compose so that both people fit well inside a centered circle whose diameter is the image width (the photo will be cropped to a circle), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.4 Hikâye 3 — "In full bloom"
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a small cherry blossom branch, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark. Compose so that both people fit well inside a centered circle whose diameter is the image width (the photo will be cropped to a circle), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.5 Mekân
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional spring garden wedding venue: a small open white garden pavilion with a simple pitched roof (not a real landmark, no domed monument) beside a reflecting pond, a walk lined with blooming cherry trees, rows of white chairs, soft daylight, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G815)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on a pale grey stone surface, surrounded at the edges by cherry blossom branches and scattered pink petals. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on a pale grey stone surface, with cherry blossom branches and scattered pink petals beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on a pale grey envelope with a cherry blossom liner on a pale grey stone surface, with cherry blossom branches and scattered pink petals at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
