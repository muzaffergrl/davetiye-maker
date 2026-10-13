# GPT görsel istekleri — Tasarım 16 · Sunflower Rustic Barn

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/16_Sunflower_Rustic/DESIGN_BRIEF.md`.
Görev: `gorevler/G216-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G816-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/16_Sunflower_Rustic/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G216: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **realistic watercolor** (bütün dekor parçalarında aynı)
- Renkler: ink `#3A2E1F` · deep `#7A5A2E` · primary `#E3A72F` · mist `#FBF5E8`→`#E9D6B2` · ivory `#FFFBF0` · gold `#B88B3E` · leaf `#6E7D3A`
- Renk dünyası: sunflower yellow, mustard, warm kraft brown, barn-wood brown and leaf green
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G216` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 16` — değişiklik için `tools/katalog.py` → `WEB[16]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Kraft zarf; kareli kurdele çözülür, kart ahşap masaya kayar):
On tap, the gingham bow tugs loose and the ribbon slides off with its little sunflower, the kraft flap flips open, and the card slides out onto a weathered wooden tabletop while a few sunflower petals tumble.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same kraft envelope, gingham ribbon,
  decor, paper, metal and light.
- Technique for all decor: **realistic watercolor**; paper, fabric and metal look real.
- Palette: ink `#3A2E1F` · deep `#7A5A2E` · primary `#E3A72F` · mist `#FBF5E8`→`#E9D6B2` · ivory `#FFFBF0` · gold `#B88B3E` · leaf `#6E7D3A` (sunflower yellow, mustard, warm kraft brown, barn-wood brown and leaf green).
- Typography in the W1 screens: a bold friendly brush script for the names and a sturdy classic serif.
- W1 screens are 1024×1536 full-bleed phone layouts (no phone hardware, no status bar, no browser bar). They may
  contain the demo text below — they are layout references only and are never sold.
- W2 parts contain **NO text, letters, numbers or monograms at all** — not on seals, stamps, labels, tags or covers.
- **ONE object per image** — never a sheet or set of several objects in one image.
- **No cast shadow and no drop shadow** on any part (the website adds its own shadows). Light every part the same
  way: soft light from the top-left. Front view, straight, centered, not cropped, empty margin around it.
- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).
- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).
- envelope_closed.png, closure.png and envelope_open.png must fit together exactly: the SAME
  kraft envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for the other two. Do not draw separate flap, door, pocket or cover pieces — Claude cuts interlocking
  pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Daisy & Wyatt · Saturday, August 28, 2027 · 4:00 PM ·
Golden Field Barn, Franklin, Tennessee · Ceremony 4:00 PM The Sunflower Field · Cocktail Hour 5:00 PM The Porch · Reception 6:30 PM The Big Red Barn · Country chic ·
Kindly reply by July 17, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: warm golden-hour cream gradient (#FBF5E8 to #E9D6B2) with soft sun flare and very faint weathered wood grain at the bottom edge, empty center, with sunflowers, wheat stalks, white field daisies and green leaves, realistic watercolor framing the top-left and bottom-right corners and a few small floating accents (a bright yellow sunflower petal, a small sunflower head without a stem, a golden wheat ear). Centered slightly below the middle: a natural kraft-brown paper envelope with visible fibers, about 5:4 wider than tall, with a straight square-cut flap, closed, with a mustard-yellow gingham ribbon wrapped around the envelope and tied in a simple bow with a small sunflower head tucked into the knot — wrapped horizontally around the envelope with the bow at the center. Above it, typography in a bold friendly brush script for the names and a sturdy classic serif: a small spaced line "YOU ARE INVITED" and the names "Daisy & Wyatt" large; below the kraft envelope a small spaced line "TAP TO OPEN". All decor in realistic watercolor style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kraft envelope ve gingham ribbon net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the kraft envelope: a small cream cotton card with a portrait photo window edged by a thin mustard gingham ribbon trim in its upper part, plain blank paper below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "AUGUST 28, 2027 · FRANKLIN". Under the card: the names "Daisy & Wyatt" large in the script, a small spaced line "SATURDAY · AUGUST 28, 2027", the venue "Golden Field Barn" and "Franklin, Tennessee" in italic serif, four small elegant countdown boxes "319 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a mustard-yellow pill button with dark brown lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three instant-style photo prints pegged one by one with small wooden clothespins onto a gently sagging jute twine line against a weathered barn-wood wall; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "First hello", "The proposal", "Forever begins". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: İpe mandalla asılmış fotoğraflar, tek tek mandallanır.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall cream cotton card with the same gingham band and only a small sunflower-and-wheat sprig at the top holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a horizontal spray of one small sunflower, two wheat stalks and a daisy): "4:00 PM — Ceremony — The Sunflower Field", "5:00 PM — Cocktail Hour — The Porch", "6:30 PM — Reception — The Big Red Barn" (time in small spaced serif, event in serif, place in italic). Below the card: a landscape white-bordered instant-style photo print hanging from a small natural wooden clothespin at its top center, its window filled with flat pure green #00FF00 (the venue photo), under it "Golden Field Barn" and "Franklin, Tennessee", then a small line "DRESS CODE · Country chic". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by July 17, 2027" in serif, a mustard-yellow pill button with dark brown lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Daisy & Wyatt" in the script at the bottom; a small gingham ribbon — the same one as on the kraft envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı kraft envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 18 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: warm golden-hour cream gradient (#FBF5E8 to #E9D6B2) with soft sun flare and very faint weathered wood grain at the bottom edge, empty center, with sunflowers, wheat stalks, white field daisies and green leaves, realistic watercolor entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no kraft envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: warm golden-cream watercolor paper (#FBF5E8) with a faint grain. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same kraft envelope as in the W1 screens, alone and closed, WITHOUT the gingham ribbon: a natural kraft-brown paper envelope with visible fibers, about 5:4 wider than tall, with a straight square-cut flap. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; gingham ribbon yok; kesilmemiş; gölge yok; gerçek alfa.

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/closure.png` · 1536×1024 · **Şeffaf zemin**

```
Only a mustard-yellow gingham ribbon wrapped around the envelope and tied in a simple bow with a small sunflower head tucked into the knot, alone, exactly as it sits on the kraft envelope in the W1 screens (wrapped horizontally around the envelope with the bow at the center) and at the same scale as in envelope_closed.png, with no kraft envelope behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız gingham ribbon; harf/monogram yok; zarfla aynı ölçek; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME kraft envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the square-cut flap folded fully upward, its inner side and the inside of the back showing soft mustard and cream gingham check pattern, fabric texture; the front pocket empty. No card, nothing inside, no gingham ribbon. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the kraft envelope in W1.2, alone: a small cream cotton card with a portrait photo window edged by a thin mustard gingham ribbon trim in its upper part, plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading); the rest of the card is blank (no text). Slightly narrower than the kraft envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall cream cotton card with a thin mustard gingham ribbon band across the top edge, a realistic watercolor spray of sunflowers, wheat stalks and white field daisies along the bottom-left and a single sunflower at the top-right. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall cream cotton card with the same gingham band and only a small sunflower-and-wheat sprig at the top. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a white-bordered instant-style photo print hanging from a small natural wooden clothespin at its top center. The window inside is a nearly square portrait window (about 4:5), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape white-bordered instant-style photo print hanging from a small natural wooden clothespin at its top center, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/florals_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of sunflowers, wheat stalks, white field daisies and green leaves, realistic watercolor, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/florals_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of sunflowers, wheat stalks, white field daisies and green leaves, realistic watercolor, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE bright yellow sunflower petal, in the same realistic watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small sunflower head without a stem, in the same realistic watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE golden wheat ear, in the same realistic watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same realistic watercolor style: a horizontal spray of one small sunflower, two wheat stalks and a daisy, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Story ipi (fotoğraflar mandalla asılır)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/twine_line.png` · 1536×1024 · **Şeffaf zemin**

```
A single natural jute twine line stretched horizontally across about 85% of the image width with a gentle sag, realistic fibers, nothing hanging on it, both ends neatly finished and not touching the image edges. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek ip; üstünde bir şey yok; uçlar kenara değmiyor; gölge yok; alfa.

#### W2.18 Website hero (masaüstü üst bant)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: warm golden-hour cream gradient (#FBF5E8 to #E9D6B2) with soft sun flare and very faint weathered wood grain at the bottom edge, empty center, with sunflowers, wheat stalks, white field daisies and green leaves, realistic watercolor framing the left and right edges, and the closed kraft envelope with its gingham ribbon resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf.

---

## PAKET 2 — Örnek fotoğraflar

Görev `G216`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in the first image" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar beyaz kenarlı anlık baskılara (~4:5) girer: yüzler ortada. Renk dünyası: ayçiçeği sarısı, hardal, kraft, ahşap kahvesi, altın saat.

### 2.1 Ana portre
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in a blooming sunflower field at golden hour; she wears a white cotton eyelet sundress with tan boots, he wears a light blue chambray shirt with tan suspenders. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "First hello"
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, a candid first-date moment laughing together on the tailgate of an old farm truck, two glass bottles of lemonade, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "The proposal"
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, the proposal moment in the middle of a sunflower field at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Forever begins"
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of sunflowers and wheat, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional big red barn wedding venue in the countryside at golden hour: a red barn with open doors and string lights, rows of wooden benches on the grass beside a sunflower field, a few hay bales, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G816)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on a weathered barn-wood table, surrounded at the edges by sunflowers, wheat stalks, white daisies and a mustard gingham ribbon. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on a weathered barn-wood table, with sunflowers, wheat stalks, white daisies and a mustard gingham ribbon beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on a kraft envelope tied with a gingham ribbon on a weathered barn-wood table, with sunflowers, wheat stalks, white daisies and a mustard gingham ribbon at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
