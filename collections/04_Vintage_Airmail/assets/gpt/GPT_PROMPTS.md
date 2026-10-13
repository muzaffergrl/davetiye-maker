# GPT görsel istekleri — Tasarım 04 · Vintage Airmail Love Letter

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/04_Vintage_Airmail/DESIGN_BRIEF.md`.
Görev: `gorevler/G204-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G804-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/04_Vintage_Airmail/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G204: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **vintage print** (bütün dekor parçalarında aynı)
- Renkler: ink `#2A2A35` · deep `#3D4F7A` · primary `#B5483E` · mist `#F2EADB`→`#DCCDB2` · ivory `#FAF4E8` · gold `#A88A5A` · leaf `#8A9474`
- Renk dünyası: faded airmail red, navy blue, aged cream parchment and muted brass
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G204` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 04` — değişiklik için `tools/katalog.py` → `WEB[4]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Kenarları kırmızı-lacivert çizgili hava postası zarfı; şerit yırtılarak açılır, mektup kayar):
On tap, the little wax seal pops off, the perforated tear strip rips away along the top edge from left to right, and the folded cream love letter slides up out of the envelope and settles open while a pressed flower flutters down.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same airmail envelope, burgundy wax seal,
  decor, paper, metal and light.
- Technique for all decor: **vintage print**; paper, fabric and metal look real.
- Palette: ink `#2A2A35` · deep `#3D4F7A` · primary `#B5483E` · mist `#F2EADB`→`#DCCDB2` · ivory `#FAF4E8` · gold `#A88A5A` · leaf `#8A9474` (faded airmail red, navy blue, aged cream parchment and muted brass).
- Typography in the W1 screens: a handwritten fountain-pen script for the names and a vintage typewriter-style serif for the small details.
- W1 screens are 1024×1536 full-bleed phone layouts (no phone hardware, no status bar, no browser bar). They may
  contain the demo text below — they are layout references only and are never sold.
- W2 parts contain **NO text, letters, numbers or monograms at all** — not on seals, stamps, labels, tags or covers.
- **ONE object per image** — never a sheet or set of several objects in one image.
- **No cast shadow and no drop shadow** on any part (the website adds its own shadows). Light every part the same
  way: soft light from the top-left. Front view, straight, centered, not cropped, empty margin around it.
- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).
- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).
- envelope_closed.png, closure.png and envelope_open.png must fit together exactly: the SAME
  airmail envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for the other two. Do not draw separate flap, door, pocket or cover pieces — Claude cuts interlocking
  pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Margot & Henry · Saturday, October 2, 2027 · 4:00 PM ·
The Old Post House, Hudson, New York · Ceremony 4:00 PM The Orchard Lawn · Cocktail Hour 5:00 PM The Library Bar · Reception 6:30 PM The Post Hall · Cocktail attire ·
Kindly reply by August 21, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: aged warm parchment gradient (#F2EADB to #DCCDB2) with subtle paper stains, faint vintage map contour lines without any labels, with dried pressed wildflowers, a sprig of dried lavender, a short twine loop and two or three fictional botanical postage stamps with perforated edges (each showing only a tiny flower illustration, no numbers, no words), layered in a vintage print style framing the top-left and bottom-right corners and a few small floating accents (a fictional botanical postage stamp, a pressed dried forget-me-not sprig, a faint inky circular postmark ring). Centered slightly below the middle: a vintage airmail envelope of aged cream laid paper, about 3:2 wider than tall, its edges bordered with diagonal faded-red and navy airmail stripes, two fictional botanical postage stamps in the top-right corner (each showing only a tiny pressed-flower illustration, perforated edges, no numbers, no words) and a slim perforated tear strip running along the top edge, closed, with a small cracked burgundy-red wax seal with a smooth EMPTY center and a short pressed sprig of dried lavender tucked under it — on the middle of the tear strip at the top edge. Above it, typography in a handwritten fountain-pen script for the names and a vintage typewriter-style serif for the small details: a small spaced line "YOU ARE INVITED" and the names "Margot & Henry" large; below the airmail envelope a small spaced line "TAP TO OPEN". All decor in vintage print style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: airmail envelope ve burgundy wax seal net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the airmail envelope: a small aged-cream laid-paper letter card with faint laid lines and softly deckled edges, a portrait postcard-style photo window with a thin red-and-navy airmail-stripe border in its upper part and plain blank paper below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "OCTOBER 2, 2027 · HUDSON". Under the card: the names "Margot & Henry" large in the script, a small spaced line "SATURDAY · OCTOBER 2, 2027", the venue "The Old Post House" and "Hudson, New York" in italic serif, four small elegant countdown boxes "354 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a navy blue pill button with a thin cream inner line labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three large perforated postage-stamp frames scattered at slight angles across an old wooden writing desk, as if dropped one by one, a faint inky postmark ring (no letters or numbers) overlapping one corner; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "First hello", "The proposal", "Forever begins". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Tırtıklı kenarlı pul ve kartpostal kartları, masaya tek tek düşer.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall aged-cream laid-paper letter sheet with a thinner airmail-stripe border and only one small pressed flower at the top holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a short twine string with a small dried flower tied on it): "4:00 PM — Ceremony — The Orchard Lawn", "5:00 PM — Cocktail Hour — The Library Bar", "6:30 PM — Reception — The Post Hall" (time in small spaced serif, event in serif, place in italic). Below the card: a landscape vintage picture-postcard card with softly worn corners, an aged cream border and a thin red-and-navy airmail-stripe edge, its window filled with flat pure green #00FF00 (the venue photo), under it "The Old Post House" and "Hudson, New York", then a small line "DRESS CODE · Cocktail attire". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by August 21, 2027" in serif, a navy blue pill button with a thin cream inner line labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Margot & Henry" in the script at the bottom; a small burgundy wax seal — the same one as on the airmail envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı airmail envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: aged warm parchment gradient (#F2EADB to #DCCDB2) with subtle paper stains, faint vintage map contour lines without any labels, with dried pressed wildflowers, a sprig of dried lavender, a short twine loop and two or three fictional botanical postage stamps with perforated edges (each showing only a tiny flower illustration, no numbers, no words), layered in a vintage print style entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no airmail envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: aged warm-cream parchment (#F2EADB) with very subtle stains and fibers. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same airmail envelope as in the W1 screens, alone and closed, WITHOUT the burgundy wax seal: a vintage airmail envelope of aged cream laid paper, about 3:2 wider than tall, its edges bordered with diagonal faded-red and navy airmail stripes, two fictional botanical postage stamps in the top-right corner (each showing only a tiny pressed-flower illustration, perforated edges, no numbers, no words) and a slim perforated tear strip running along the top edge. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; burgundy wax seal yok; kesilmemiş; gölge yok; gerçek alfa.

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a small cracked burgundy-red wax seal with a smooth EMPTY center and a short pressed sprig of dried lavender tucked under it, alone, exactly as it sits on the airmail envelope in the W1 screens (on the middle of the tear strip at the top edge) and at the same scale as in envelope_closed.png, with no airmail envelope behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız burgundy wax seal; harf/monogram yok; zarfla aynı ölçek; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME airmail envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: its tear strip torn away, leaving a slightly ragged open top edge, the inside of the back panel visible with fine navy (#3D4F7A) and faded red (#B5483E) diagonal airmail stripe pattern on cream, like a vintage airmail envelope border, no text; the envelope empty. No card, nothing inside, no burgundy wax seal. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the airmail envelope in W1.2, alone: a small aged-cream laid-paper letter card with faint laid lines and softly deckled edges, a portrait postcard-style photo window with a thin red-and-navy airmail-stripe border in its upper part and plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading); the rest of the card is blank (no text). Slightly narrower than the airmail envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall aged-cream laid-paper letter sheet with a border of diagonal faded-red and navy airmail stripes, pressed dried wildflowers and one fictional botanical postage stamp (tiny flower illustration only, no text) tucked at the top-left corner, and faint inky postmark rings with wavy cancellation lines (no letters or numbers) at the bottom-right. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall aged-cream laid-paper letter sheet with a thinner airmail-stripe border and only one small pressed flower at the top. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a large vintage postage-stamp shaped frame with perforated scalloped edges in aged cream paper and a fine engraved inner border line. The window inside is a portrait window (about 4:5), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape vintage picture-postcard card with softly worn corners, an aged cream border and a thin red-and-navy airmail-stripe edge, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of dried pressed wildflowers, a sprig of dried lavender, a short twine loop and two or three fictional botanical postage stamps with perforated edges (each showing only a tiny flower illustration, no numbers, no words), layered in a vintage print style, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of dried pressed wildflowers, a sprig of dried lavender, a short twine loop and two or three fictional botanical postage stamps with perforated edges (each showing only a tiny flower illustration, no numbers, no words), layered in a vintage print style, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE fictional botanical postage stamp with perforated edges showing only a tiny pressed-flower illustration (no numbers, no words), in the same vintage print style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE pressed dried forget-me-not sprig, in the same vintage print style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE faint inky circular postmark ring with wavy cancellation lines, containing no letters, numbers or symbols, in the same vintage print style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same vintage print style: a short twine string with a small dried flower tied on it, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero (masaüstü üst bant)
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: aged warm parchment gradient (#F2EADB to #DCCDB2) with subtle paper stains, faint vintage map contour lines without any labels, with dried pressed wildflowers, a sprig of dried lavender, a short twine loop and two or three fictional botanical postage stamps with perforated edges (each showing only a tiny flower illustration, no numbers, no words), layered in a vintage print style framing the left and right edges, and the closed airmail envelope with its burgundy wax seal resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf.

---

## PAKET 2 — Örnek fotoğraflar

Görev `G204`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in the first image" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar tırtıklı pul çerçevelere (~4:5) girer: yüzler ortada, kenarlarda pay kalsın. Renk dünyası: eski kâğıt kreması, soluk posta kırmızısı, lacivert, sonbahar ışığı.

### 2.1 Ana portre
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other on the platform of a small old countryside train station in autumn, a vintage leather suitcase at their feet, soft golden light; she wears a vintage-inspired tea-length cream lace dress, he wears a navy wool suit with a knit tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "First hello"
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, a candid moment writing letters together at a small wooden table in a cozy old library café, an old fountain pen and a stack of envelopes on the table (no visible writing), relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "The proposal"
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, the proposal moment in an apple orchard in autumn at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Forever begins"
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, close-up of their hands intertwined showing a delicate engagement ring, resting on a bundle of old letters tied with twine (no visible writing), soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional historic red-brick former post office converted into a wedding venue in a river-valley town in autumn: tall arched windows, an orchard lawn with rows of wooden ceremony chairs and a simple arch of dried flowers, warm golden light, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G804)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on an aged wooden writing desk, surrounded at the edges by a few fictional botanical postage stamps without text, dried flowers and a vintage fountain pen. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on an aged wooden writing desk, with a few fictional botanical postage stamps without text, dried flowers and a vintage fountain pen beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/04_Vintage_Airmail/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on a red and navy striped airmail envelope on an aged wooden writing desk, with a few fictional botanical postage stamps without text, dried flowers and a vintage fountain pen at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
