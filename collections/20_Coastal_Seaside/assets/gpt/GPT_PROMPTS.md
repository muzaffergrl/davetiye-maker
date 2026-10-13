# GPT görsel istekleri — Tasarım 20 · Coastal Seaside

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/20_Coastal_Seaside/DESIGN_BRIEF.md`.
Görev: `gorevler/G220-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G820-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/20_Coastal_Seaside/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G220: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **ocean watercolor** (bütün dekor parçalarında aynı)
- Renkler: ink `#1D3445` · deep `#2E5E7E` · primary `#7FB3C8` · mist `#F4F8F9`→`#D5E5EB` · ivory `#FFFDF8` · gold `#C2A26B` · leaf `#8FB5A8`
- Renk dünyası: ocean blue, sea-glass aqua, warm sand, white foam and soft brass
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G220` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 20` — değişiklik için `tools/katalog.py` → `WEB[20]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Dalga desenli astarlı kum rengi zarf, deniz kabuğu süslü; dalga geçince açılır):
On tap, the watercolor wave (wave.png) sweeps across the screen and carries the seashell and twine away, the wave-edged flap lifts, and the card rises like the incoming tide.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same sand envelope, scallop shell,
  decor, paper, metal and light.
- Technique for all decor: **ocean watercolor**; paper, fabric and metal look real.
- Palette: ink `#1D3445` · deep `#2E5E7E` · primary `#7FB3C8` · mist `#F4F8F9`→`#D5E5EB` · ivory `#FFFDF8` · gold `#C2A26B` · leaf `#8FB5A8` (ocean blue, sea-glass aqua, warm sand, white foam and soft brass).
- Typography in the W1 screens: a breezy handwritten script for the names and a classic book serif.
- W1 screens are 1024×1536 full-bleed phone layouts (no phone hardware, no status bar, no browser bar). They may
  contain the demo text below — they are layout references only and are never sold.
- W2 parts contain **NO text, letters, numbers or monograms at all** — not on seals, stamps, labels, tags or covers.
- **ONE object per image** — never a sheet or set of several objects in one image.
- **No cast shadow and no drop shadow** on any part (the website adds its own shadows). Light every part the same
  way: soft light from the top-left. Front view, straight, centered, not cropped, empty margin around it.
- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).
- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).
- envelope_closed.png and envelope_open.png must fit together exactly: the SAME
  sand envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the sand envelope. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Marina & Oliver · Saturday, July 17, 2027 · 4:00 PM ·
Seaglass Point, Chatham, Massachusetts · Ceremony 4:00 PM The Dune Lawn · Cocktail Hour 5:00 PM The Lighthouse Deck · Reception 6:30 PM The Boathouse · Coastal formal ·
Kindly reply by June 5, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: soft sea-mist gradient (#F4F8F9 to #D5E5EB) with a faint watercolor shoreline wave at the bottom edge and fine sand grain, empty center, with seashells, a starfish, pieces of sea glass in aqua and white, and dune grass, soft ocean watercolor framing the top-left and bottom-right corners and a few small floating accents (a small white spiral moon-snail shell, a piece of frosted aqua sea glass, a small sand-colored starfish). Centered slightly below the middle: a soft sand-colored textured paper envelope with tiny speckles, about 5:4 wider than tall, with a pointed V flap whose two edges are cut in a gentle wave like a shoreline, closed, with a small pale-pink scallop seashell resting on a short loop of natural twine — resting on the point of the wave-edged V flap. Above it, typography in a breezy handwritten script for the names and a classic book serif: a small spaced line "YOU ARE INVITED" and the names "Marina & Oliver" large; below the sand envelope a small spaced line "TAP TO OPEN". All decor in ocean watercolor style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: sand envelope ve scallop shell net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the sand envelope: a small sand-colored speckled card with a perfectly round porthole-style photo window ringed in aged brass with small rivets in its upper part, plain blank card below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "JULY 17, 2027 · CHATHAM". Under the card: the names "Marina & Oliver" large in the script, a small spaced line "SATURDAY · JULY 17, 2027", the venue "Seaglass Point" and "Chatham, Massachusetts" in italic serif, four small elegant countdown boxes "277 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and an ocean-blue pill button with white lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three round brass portholes stacked down the page in a gentle zig-zag (left, right, left) on the soft sea-mist page, a few shells and sea glass between them; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "First hello", "The proposal", "Forever begins". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Yuvarlak gemi lombozu (porthole) çerçeveler, kenardan kayar.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall soft-white textured card with a gently wavy top edge and only a narrow watercolor wave along the bottom holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a horizontal row of three small seashells and a piece of sea glass): "4:00 PM — Ceremony — The Dune Lawn", "5:00 PM — Cocktail Hour — The Lighthouse Deck", "6:30 PM — Reception — The Boathouse" (time in small spaced serif, event in serif, place in italic serif). Below the card: a wide oval brass porthole-style frame with small rivets and an aged patina, its window filled with flat pure green #00FF00 (the venue photo), under it "Seaglass Point" and "Chatham, Massachusetts", then a small line "DRESS CODE · Coastal formal". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by June 5, 2027" in serif, an ocean-blue pill button with white lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Marina & Oliver" in the script at the bottom; a small scallop shell — the same one as on the sand envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı sand envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 18 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: soft sea-mist gradient (#F4F8F9 to #D5E5EB) with a faint watercolor shoreline wave at the bottom edge and fine sand grain, empty center, with seashells, a starfish, pieces of sea glass in aqua and white, and dune grass, soft ocean watercolor entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no sand envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: soft sea-mist watercolor wash (#F4F8F9) with a fine sand grain. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same sand envelope as in the W1 screens, alone and closed, WITHOUT the scallop shell: a soft sand-colored textured paper envelope with tiny speckles, about 5:4 wider than tall, with a pointed V flap whose two edges are cut in a gentle wave like a shoreline. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; scallop shell yok; kesilmemiş; gölge yok; gerçek alfa.

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a small pale-pink scallop seashell resting on a short loop of natural twine, alone, exactly as it sits on the sand envelope in the W1 screens (resting on the point of the wave-edged V flap), drawn large so it fills about 70% of the square (Claude scales it to the sand envelope), with the same perspective, material and light as on the sand envelope and with no sand envelope behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız scallop shell; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME sand envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the wave-edged V flap folded fully upward, its inner side and the inside of the back showing soft ocean-blue watercolor wave pattern with thin white foam lines, seamless; the front pocket empty. No card, nothing inside, no scallop shell. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the sand envelope in W1.2, alone: a small sand-colored speckled card with a perfectly round porthole-style photo window ringed in aged brass with small rivets in its upper part, plain blank card below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the sand envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall soft-white textured card with a gently wavy top edge, ocean-watercolor waves with thin white foam lines along the bottom, seashells, a starfish and pieces of sea glass at the bottom-right and a small tuft of dune grass at the top-left. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall soft-white textured card with a gently wavy top edge and only a narrow watercolor wave along the bottom. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a round brass ship porthole frame with small rivets and an aged patina. The window inside is a perfectly round window, filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A wide oval brass porthole-style frame with small rivets and an aged patina, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a wide oval window (about 3:2), filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of seashells, a starfish, pieces of sea glass in aqua and white, and dune grass, soft ocean watercolor, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of seashells, a starfish, pieces of sea glass in aqua and white, and dune grass, soft ocean watercolor, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small white spiral moon-snail shell, in the same ocean watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE piece of frosted aqua sea glass, in the same ocean watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small sand-colored starfish, in the same ocean watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same ocean watercolor style: a horizontal row of three small seashells and a piece of sea glass, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Açılış dalgası
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/wave.png` · 1536×1024 · **Şeffaf zemin**

```
A single soft ocean-watercolor wave seen from the side: a wide band of translucent aqua and ocean-blue water whose top edge curls into a crest of white foam lace, spanning about 90% of the image width, its lower edge softly feathered. Only this one wave, no shells, no sand, no sky. Seen straight-on (not tilted, no perspective), centered and not cropped, with generous empty margin all around; the object keeps its natural curve. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek dalga; köpük üst kenarda; alt kenar yumuşak; gölge yok; alfa.

#### W2.18 Website hero (masaüstü üst bant)
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: soft sea-mist gradient (#F4F8F9 to #D5E5EB) with a faint watercolor shoreline wave at the bottom edge and fine sand grain, empty center, with seashells, a starfish, pieces of sea glass in aqua and white, and dune grass, soft ocean watercolor framing the left and right edges, and the closed sand envelope with its scallop shell resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf.

---

## PAKET 2 — Örnek fotoğraflar

Görev `G220`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar yuvarlak lomboz çerçevelere girer: yüzler tam ortadaki dairede, kenarlarda bol pay kalsın. Renk dünyası: okyanus mavisi, deniz camı, kum, köpük beyazı.

### 2.1 Ana portre
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other on a sandy dune path beside a weathered split-rail fence and blue hydrangeas at golden hour, the ocean behind; she wears a flowing white chiffon dress, he wears a light blue linen suit with no tie, sleeves rolled. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark. Compose so that both people fit well inside a centered circle whose diameter is the image width (the photo will be cropped to a circle), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.2 Hikâye 1 — "First hello"
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a weathered picnic table on a harbor dock, two iced teas and a paper basket of fried clams, sailboats softly blurred behind, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark. Compose so that both people fit well inside a centered circle whose diameter is the image width (the photo will be cropped to a circle), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.3 Hikâye 2 — "The proposal"
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment on the beach near a white lighthouse at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark. Compose so that both people fit well inside a centered circle whose diameter is the image width (the photo will be cropped to a circle), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.4 Hikâye 3 — "Forever begins"
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a small scallop shell and a piece of sea glass, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark. Compose so that both people fit well inside a centered circle whose diameter is the image width (the photo will be cropped to a circle), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.5 Mekân
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional seaside wedding venue at golden hour: a weathered shingle boathouse, a dune lawn with rows of white chairs facing the ocean, a white lighthouse in the distance and a driftwood arch with white flowers, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G820)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on pale beach sand, surrounded at the edges by seashells, a starfish, sea glass and dune grass. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on pale beach sand, with seashells, a starfish, sea glass and dune grass beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on a sand-colored envelope with a wave-pattern liner on pale beach sand, with seashells, a starfish, sea glass and dune grass at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
