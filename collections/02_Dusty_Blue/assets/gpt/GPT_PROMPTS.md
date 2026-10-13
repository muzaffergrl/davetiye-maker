# GPT görsel istekleri — Tasarım 02 · Dusty Blue & Champagne

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `docs/09_TASARIM_KATALOGU.md` (satır 02) ve `collections/02_Dusty_Blue/COLLECTION_STATUS.md`.
Görev: `gorevler/G202-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G013-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/02_Dusty_Blue/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G202: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **watercolor-and-gouache** (bütün dekor parçalarında aynı)
- Renkler: ink `#2B3A4E` · deep `#4E6782` · primary `#6E88A3` · mist `#DDE5EC`→`#B7C6D4` · ivory `#FBF7EF` · gold `#B8996A` · leaf `#9AAE9F`
- Renk dünyası: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G202` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 02` — değişiklik için `tools/katalog.py` → `WEB[2]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Fildişi V kapaklı zarf, pudra mavisi mum mühür; desenli astar görünür, kart cebin arkasından yükselir):
On tap, the dusty blue wax seal breaks free and falls away, the V flap opens upward to reveal the gold damask liner, and the card rises from behind the front pocket while a single eucalyptus leaf drifts down.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same ivory envelope, dusty blue wax seal,
  decor, paper, metal and light.
- Technique for all decor: **watercolor-and-gouache**; paper, fabric and metal look real.
- Palette: ink `#2B3A4E` · deep `#4E6782` · primary `#6E88A3` · mist `#DDE5EC`→`#B7C6D4` · ivory `#FBF7EF` · gold `#B8996A` · leaf `#9AAE9F` (dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green).
- Typography in the W1 screens: an elegant copperplate script for the names and a graceful Garamond-style serif in small spaced capitals.
- W1 screens are 1024×1536 full-bleed phone layouts (no phone hardware, no status bar, no browser bar). They may
  contain the demo text below — they are layout references only and are never sold.
- W2 parts contain **NO text, letters, numbers or monograms at all** — not on seals, stamps, labels, tags or covers.
- **ONE object per image** — never a sheet or set of several objects in one image.
- **No cast shadow and no drop shadow** on any part (the website adds its own shadows). Light every part the same
  way: soft light from the top-left. Front view, straight, centered, not cropped, empty margin around it.
- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).
- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).
- envelope_closed.png, closure.png and envelope_open.png must fit together exactly: the SAME
  ivory envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for the other two. Do not draw separate flap, door, pocket or cover pieces — Claude cuts interlocking
  pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Eleanor & Theo · Saturday, September 18, 2027 · 4:30 PM ·
Rosewood Manor, Charleston, South Carolina · Ceremony 4:30 PM The Garden Lawn · Cocktail Hour 5:30 PM The Veranda · Reception 6:30 PM The Grand Hall · Black tie optional ·
Kindly reply by August 1, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: soft misty dusty blue gradient (#DDE5EC at the top to #B7C6D4 at the bottom) with very gentle out-of-focus bokeh and a faint fine paper grain, calm empty center, with silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs framing the top-left and bottom-right corners and a few small floating accents (a silver-dollar eucalyptus leaf, a small white five-petal blossom, a delicate champagne-gold fern frond). Centered slightly below the middle: a classic ivory cotton-paper envelope, about 5:4 wider than tall, with a deep pointed V flap edged by a hair-thin champagne-gold line, crisp edges and soft natural fibers, closed, with a realistic dusty blue wax seal (#6E88A3 with deeper #4E6782 shadows) with an organic irregular poured edge, a smooth EMPTY circular pressed center inside a thin raised ring and a tiny embossed eucalyptus-leaf wreath, a short sprig of silver-dollar eucalyptus tucked under it — pressed onto the tip of the V flap. Above it, typography in an elegant copperplate script for the names and a graceful Garamond-style serif in small spaced capitals: a small spaced line "YOU ARE INVITED" and the names "Eleanor & Theo" large; below the ivory envelope a small spaced line "TAP TO OPEN". All decor in watercolor-and-gouache style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: ivory envelope ve dusty blue wax seal net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the ivory envelope: a small ivory card with straight edges and a thin champagne-gold inner border, a portrait photo window in its upper 60% and plain blank paper below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "SEPTEMBER 18, 2027 · CHARLESTON". Under the card: the names "Eleanor & Theo" large in the script, a small spaced line "SATURDAY · SEPTEMBER 18, 2027", the venue "Rosewood Manor" and "Charleston, South Carolina" in italic serif, four small elegant countdown boxes "340 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a dusty blue pill button with ivory lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three instant-photo prints scattered across the page at gentle angles and slightly overlapping, as if each had just flown in and settled one after another; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "First hello", "The proposal", "Forever begins". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Üç polaroid sırayla uçarak yerleşir.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall ivory card with the same thin champagne-gold inner border and only one small eucalyptus sprig at the top center holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (one slender eucalyptus branch with dusty blue-green leaves, two tiny white blossoms and a champagne-gold fern sprig): "4:30 PM — Ceremony — The Garden Lawn", "5:30 PM — Cocktail Hour — The Veranda", "6:30 PM — Reception — The Grand Hall" (time in small spaced serif, event in serif, place in italic). Below the card: a landscape instant-photo print with a white border that is wider at the bottom and a short strip of dusty blue washi tape at its top edge, its window filled with flat pure green #00FF00 (the venue photo), under it "Rosewood Manor" and "Charleston, South Carolina", then a small line "DRESS CODE · Black tie optional". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by August 1, 2027" in serif, a dusty blue pill button with ivory lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Eleanor & Theo" in the script at the bottom; a small dusty blue wax seal — the same one as on the ivory envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı ivory envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: soft misty dusty blue gradient (#DDE5EC at the top to #B7C6D4 at the bottom) with very gentle out-of-focus bokeh and a faint fine paper grain, calm empty center, with silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no ivory envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: soft misty dusty blue watercolor wash (#DDE5EC) with a fine paper grain. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same ivory envelope as in the W1 screens, alone and closed, WITHOUT the dusty blue wax seal: a classic ivory cotton-paper envelope, about 5:4 wider than tall, with a deep pointed V flap edged by a hair-thin champagne-gold line, crisp edges and soft natural fibers. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; dusty blue wax seal yok; kesilmemiş; gölge yok; gerçek alfa.

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a realistic dusty blue wax seal (#6E88A3 with deeper #4E6782 shadows) with an organic irregular poured edge, a smooth EMPTY circular pressed center inside a thin raised ring and a tiny embossed eucalyptus-leaf wreath, a short sprig of silver-dollar eucalyptus tucked under it, alone, exactly as it sits on the ivory envelope in the W1 screens (pressed onto the tip of the V flap) and at the same scale as in envelope_closed.png, with no ivory envelope behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız dusty blue wax seal; harf/monogram yok; zarfla aynı ölçek; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME ivory envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the V flap folded fully upward, its inner side and the inside of the back showing a soft dusty blue (#7C94AC) liner with a delicate champagne-gold (#D9C49E) botanical damask of small eucalyptus leaves and tiny five-petal blossoms; the front pocket empty. No card, nothing inside, no dusty blue wax seal. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the ivory envelope in W1.2, alone: a small ivory card with straight edges and a thin champagne-gold inner border, a portrait photo window in its upper 60% and plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading); the rest of the card is blank (no text). Slightly narrower than the ivory envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall ivory cotton card with a thin champagne-gold inner border, a watercolor-and-gouache spray of silver-dollar eucalyptus, white garden roses and champagne-gold fern across the top-left corner and a smaller spray at the bottom-right. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall ivory card with the same thin champagne-gold inner border and only one small eucalyptus sprig at the top center. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a classic instant-photo print with a bright white card border that is wider at the bottom and a short strip of dusty blue washi tape at its top edge. The window inside is a slightly portrait window (about 4:5), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape instant-photo print with a white border that is wider at the bottom and a short strip of dusty blue washi tape at its top edge, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/florals_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/florals_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE silver-dollar eucalyptus leaf, in the same watercolor-and-gouache style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small white five-petal blossom, in the same watercolor-and-gouache style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE delicate champagne-gold fern frond, in the same watercolor-and-gouache style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same watercolor-and-gouache style: one slender eucalyptus branch with dusty blue-green leaves, two tiny white blossoms and a champagne-gold fern sprig, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero (masaüstü üst bant)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: soft misty dusty blue gradient (#DDE5EC at the top to #B7C6D4 at the bottom) with very gentle out-of-focus bokeh and a faint fine paper grain, calm empty center, with silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs framing the left and right edges, and the closed ivory envelope with its dusty blue wax seal resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf.

---

## PAKET 2 — Örnek fotoğraflar

Görev `G202`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in the first image" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar anlık baskı (instant print) karelerine girer — pencere ~4:5: yüzler ortada, üstte ve altta pay kalsın. Renk dünyası: pudra mavisi, fildişi, okaliptüs yeşili, şampanya altını.

### 2.1 Ana portre
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in a garden at golden hour, with a soft creamy background of greenery and white roses; she wears a flowing dusty blue chiffon dress, he wears a light grey suit with no tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "First hello"
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, a candid moment laughing together at a small outdoor café table with two coffee cups, warm afternoon light, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "The proposal"
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, the proposal moment on a quiet seaside cliff path at sunset under a soft pastel sky: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Forever begins"
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the first image, close-up of their hands intertwined showing a delicate engagement ring, resting on a linen tablecloth with a few white blossoms and eucalyptus leaves, soft natural window light, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional elegant Southern manor wedding venue at golden hour: a white two-story house with columns and a wide veranda, a lawn with rows of white ceremony chairs and a simple floral arch of white roses and eucalyptus, large oak trees, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (sonra)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)** olacak; ben gerçek tasarımı oraya yerleştireceğim.

### 3.1 Telefon mockup'ı (video ve website ekranı için)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/phone_flatlay.png` · Dikey (1024×1536)

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on an ivory linen tablecloth, surrounded at the edges by white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural daylight, gentle shadows, no text, no logos, no brand marks on the phone.
```

### 3.2 Dizüstü mockup'ı (website için)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/laptop_desk.png` · Yatay (1536×1024)

```
Elegant styled desk scene: an open modern laptop seen straight from the front at eye level, centered, on a light oak desk with a small vase of white roses and eucalyptus and a linen notebook. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural window light, airy and bright, no text, no logos, no brand marks.
```

### 3.3 Basılı kart mockup'ı (PDF davetiye için)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/card_flatlay.png` · Dikey (1024×1536)

```
Bright flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face is a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on a dusty blue envelope with an ivory linen background, a few white roses and eucalyptus sprigs at the edges, a dusty blue silk ribbon. Soft natural daylight, gentle shadows, no text, no logos.
```

Kontrol (mockup'lar): yeşil alan tamamen düz ve tek renk; telefon, laptop ve kart düz duruyor, eğik değil.
