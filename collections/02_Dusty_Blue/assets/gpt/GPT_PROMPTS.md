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
- **No glow, halo, light rays or haze outside an object's outline** (the website adds light effects); a
  semi-transparent halo leaves a dirty edge on another background.
- Edges Claude will cut along (the flap's free edge, a door seam, a book's spine and cover edge, a pouch mouth, a
  pocket's top edge) are **crisp lines with a slight contact shade on the object itself** — never a cast shadow.
- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).
- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).
- envelope_closed.png and envelope_open.png must fit together exactly: the SAME
  ivory envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the ivory envelope. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Eleanor & Theo · Saturday, September 18, 2027 · 4:30 PM ·
Rosewood Manor, Charleston, South Carolina · Ceremony 4:30 PM The Garden Lawn · Cocktail Hour 5:30 PM The Veranda · Reception 6:30 PM The Grand Hall · Black tie optional ·
Kindly reply by August 1, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: soft misty dusty blue gradient (#DDE5EC at the top to #B7C6D4 at the bottom) with very gentle out-of-focus bokeh and a faint fine paper grain, calm empty center, with silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs framing the top-left and bottom-right corners and a few small floating accents (a silver-dollar eucalyptus leaf, a small white five-petal blossom, a delicate champagne-gold fern frond). Centered slightly below the middle: a classic ivory cotton-paper envelope, about 5:4 wider than tall, with a deep pointed V flap edged by a hair-thin champagne-gold line, crisp edges and soft natural fibers, closed, with a realistic dusty blue wax seal (#6E88A3, deepening to #4E6782 in the pressed recesses) with an organic irregular poured edge, a smooth EMPTY circular pressed center inside a thin raised ring and a tiny embossed eucalyptus-leaf wreath, a short sprig of silver-dollar eucalyptus tucked under it — pressed onto the tip of the V flap. Above it, typography in an elegant copperplate script for the names and a graceful Garamond-style serif in small spaced capitals: a small spaced line "YOU ARE INVITED" and the names "Eleanor & Theo" large; below the ivory envelope a small spaced line "TAP TO OPEN". All decor in watercolor-and-gouache style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
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
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three instant-photo prints scattered across the page at gentle angles, touching only at their white borders so every green window stays fully visible, as if each had just flown in and settled one after another; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "Our first coffee", "Sunset by the sea", "Ever after". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler yalnız kenar paylarında üst üste; üç yeşil pencere tam görünür; diziliş: Üç anlık baskı (instant print) sırayla uçarak yerleşir.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall ivory card with a thin champagne-gold inner border and only one small eucalyptus sprig at the top center holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (one slender eucalyptus branch with dusty blue-green leaves, two tiny white blossoms and a champagne-gold fern sprig): "4:30 PM — Ceremony — The Garden Lawn", "5:30 PM — Cocktail Hour — The Veranda", "6:30 PM — Reception — The Grand Hall" (time in small spaced serif, event in serif, place in italic serif). Below the card: a landscape version of the same ivory instant-photo print with the hair-thin champagne-gold foil edge and a tiny eucalyptus sprig behind its top-left corner, its window filled with flat pure green #00FF00 (the venue photo), under it "Rosewood Manor" and "Charleston, South Carolina", then a small line "DRESS CODE · Black tie optional". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
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
The same ivory envelope as in the W1 screens, alone and closed, WITHOUT the dusty blue wax seal: a classic ivory cotton-paper envelope, about 5:4 wider than tall, with a deep pointed V flap edged by a hair-thin champagne-gold line, crisp edges and soft natural fibers. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; dusty blue wax seal yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a realistic dusty blue wax seal (#6E88A3, deepening to #4E6782 in the pressed recesses) with an organic irregular poured edge, a smooth EMPTY circular pressed center inside a thin raised ring and a tiny embossed eucalyptus-leaf wreath, a short sprig of silver-dollar eucalyptus tucked under it, alone, exactly as it sits on the ivory envelope in the W1 screens (pressed onto the tip of the V flap), drawn large so it fills about 70% of the square (Claude scales it to the ivory envelope), with the same perspective, material and light as on the ivory envelope and with no ivory envelope behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız dusty blue wax seal; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME ivory envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the V flap folded fully upward, its inner side and the inside of the back showing a soft dusty blue (#7C94AC) liner with a delicate champagne-gold (#D9C49E) botanical damask of small eucalyptus leaves and tiny five-petal blossoms; the front pocket empty. The top edge of the front pocket is a crisp, clearly visible edge against the liner. No card, nothing inside, no dusty blue wax seal. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the ivory envelope in W1.2, alone: a small ivory card with straight edges and a thin champagne-gold inner border, a portrait photo window in its upper 60% and plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the ivory envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall ivory cotton card with a thin champagne-gold inner border, a watercolor-and-gouache spray of silver-dollar eucalyptus, white garden roses and champagne-gold fern across the top-left corner and a smaller spray at the bottom-right. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall ivory card with a thin champagne-gold inner border and only one small eucalyptus sprig at the top center. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a classic instant-photo print in heavy ivory cotton paper with a deeper bottom margin, its outer edge finished with a hair-thin champagne-gold foil line and a tiny sprig of silver-dollar eucalyptus tucked behind its top-left corner. The window inside is a slightly portrait window (about 4:5), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape version of the same ivory instant-photo print with the hair-thin champagne-gold foil edge and a tiny eucalyptus sprig behind its top-left corner, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/florals_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/florals_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE silver-dollar eucalyptus leaf, in the same watercolor-and-gouache style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small white five-petal blossom, in the same watercolor-and-gouache style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE delicate champagne-gold fern frond, in the same watercolor-and-gouache style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same watercolor-and-gouache style: one slender eucalyptus branch with dusty blue-green leaves, two tiny white blossoms and a champagne-gold fern sprig, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: soft misty dusty blue gradient (#DDE5EC at the top to #B7C6D4 at the bottom) with very gentle out-of-focus bokeh and a faint fine paper grain, calm empty center, with silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs framing the left and right edges, and the closed ivory envelope with its dusty blue wax seal resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed ivory envelope with its dusty blue wax seal completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G202`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar anlık baskı (instant print) karelerine girer — pencere ~4:5: yüzler ortada, üstte ve altta pay kalsın. Renk dünyası: pudra mavisi, fildişi, okaliptüs yeşili, şampanya altını.

### 2.1 Ana portre
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in a garden at golden hour, with a soft creamy background of greenery and white roses; she wears a flowing dusty blue chiffon dress, he wears a light grey suit with no tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "Our first coffee"
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid moment laughing together at a small outdoor café table with two coffee cups, warm afternoon light, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "Sunset by the sea"
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment on a quiet seaside cliff path at sunset under a soft pastel sky: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Ever after"
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, resting on a linen tablecloth with a few white blossoms and eucalyptus leaves, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional elegant Southern manor wedding venue at golden hour: a white two-story house with columns and a wide veranda, a lawn with rows of white ceremony chairs and a simple floral arch of white roses and eucalyptus, large oak trees, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan sahneleri (görev G802; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Üreten: `python3 tools/paket3_sahne.py --no 02` (pilot: 01/03, G801/G803).

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Dusty Blue & Champagne". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: an ivory linen tablecloth, white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents, the same light and the same color world (dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower center of the frame, the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with an ivory linen tablecloth and white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. The upper 30% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; üst %30 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on an ivory linen tablecloth, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on an ivory linen tablecloth, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on an ivory linen tablecloth, slightly right of center and rotated about 8 degrees, surrounded at the edges by white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a cream linen sofa with a dusty blue cushion and a ceramic coffee cup; a small arrangement of white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.


---

## G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

> Görev `G139`. Panelden indirilen 5×7 in / A5 basılı davetiye bu tasarımın `parts/invitation_card.png` (ön) ve
> `parts/info_card.png` (arka) parçalarını kullanır. Bugünkü parçalar 1024 × 1536 px: 5×7'de ~230 ppi, A5'te ~200 ppi
> (300 ppi hedefinin altında; büyütme yapılmadı). Aynı tasarımın **2× sürümü** istenir; gelince
> `node scripts/build-print-assets.ts --theme <tema>` çalıştırılır (yerleşim değişmez).

### P1 — invitation_card_print
Kaydet: `collections/02_Dusty_Blue/assets/gpt/parts/invitation_card_print.png` — **2048 × 3072 px, PNG, şeffaf arka plan**
```
Recreate the attached invitation_card.png of this collection exactly — same card shape, paper, colours, decor and
decor positions, same empty text area — at 2048 × 3072 px for print. Fully transparent background around the card.
Crisp, print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### P2 — info_card_print
Kaydet: `collections/02_Dusty_Blue/assets/gpt/parts/info_card_print.png` — **2048 × 3072 px, PNG, şeffaf arka plan**
```
Recreate the attached info_card.png of this collection exactly — same card shape, paper, colours, small decor and
its position, same empty area — at 2048 × 3072 px for print. Fully transparent background around the card. Crisp,
print-quality detail; no new elements. No text, letters, numbers, logos or watermarks.
```

### P1b — invitation_card_print, geniş yazı alanı (G149 revizyonu — P1 yerine bunu üretin)
> G149: bugünkü kartta dekor yazı alanına girdiği için basılı davetiyede yazı ×0.5'e kadar küçülüyor. Aynı kart, dekor
> kenarlara çekilmiş hâliyle istenir. Gelince `node scripts/build-print-assets.ts --theme <tema>` ve `lib/print/layouts.ts`
> kutusu/bantları yeniden ölçülür (test `tests/g149-print-layout.test.ts`).

Kaydet: `collections/02_Dusty_Blue/assets/gpt/parts/invitation_card_print.png` — **2048 × 3072 px, PNG, şeffaf arka plan**
```
Recreate the attached invitation_card.png of this collection in the same style — same card shape, paper, colours and
decor family — at 2048 × 3072 px for print, but keep ALL decor inside the outer border zone: no leaf, flower, frame
element or ornament may reach further than 13% of the card width from the left/right edges or 14% of the card height
from the top/bottom edges. The central area (at least 74% of the card width and 62% of the card height, centred)
must be completely empty, plain paper of the card, so the invitation text can be printed large. Fully transparent
background around the card. Crisp, print-quality detail. No text, letters, numbers, logos or watermarks.
```

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne +
> 1 video sahnesi**. Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 02`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Dusty Blue & Champagne". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: an ivory linen tablecloth, white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents, the same light and the same color world (dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_01_closeup.png` · 1024×1024 · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on an ivory linen tablecloth, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 1 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_02_hand_tap.png` · 1024×1024 · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: an ivory linen tablecloth, white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 1 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_03_guest_home.png` · 1024×1024 · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and white roses, eucalyptus sprigs. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 1 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_04_phone_tablet.png` · 1536×1024 · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on an ivory linen tablecloth, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_05_laptop.png` · 1536×1024 · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on an ivory linen tablecloth, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 1 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_06_couple_planning.png` · 1536×1024 · 2 yeşil alan

```
Two people sit side by side at a table set with an ivory linen tablecloth: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_07_print_card.png` · 1536×1024 · 2 yeşil alan

```
Flat-lay from directly above on an ivory linen tablecloth: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_08_four_phones.png` · 1536×1024 · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on an ivory linen tablecloth, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 4 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_09_venue_table.png` · 1024×1024 · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes white roses, eucalyptus sprigs; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 1 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_10_bouquet.png` · 1024×1024 · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on an ivory linen tablecloth, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 1 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/mockups/p7_11_share.png` · 1024×1024 · 1 yeşil alan

```
Close-up of two people's hands at an ivory linen tablecloth: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 1 yeşil alan; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok.

### 7.V Promo video sahnesi (2. video)
**Kaydet:** `collections/02_Dusty_Blue/assets/gpt/video/promo_greenscreen.mp4` · 1080×1080 · 10–15 sn · sessiz olabilir

```
A 12-second locked-off (tripod, no camera movement) 1:1 square video, 1080×1080. A smartphone stands perfectly still, upright on a small invisible stand in the center of the frame, filling about 65% of the frame height, on an ivory linen tablecloth, white roses, eucalyptus sprigs, a dusty blue silk ribbon and a few champagne-gold accents. The phone screen is a perfectly flat, uniform, opaque pure green (#00FF00) for the whole clip and never moves, so it can be replaced in editing. Only the surroundings move, gently and slowly: soft daylight shifts across the table, a sheer curtain shadow drifts, one or two petals or leaves fall slowly in the background and land at the edges, never in front of the screen. Nothing ever crosses or covers the phone or its screen; no hands. Photorealistic, luxurious, calm, high-end wedding stationery commercial look, color world: dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green. No text, logos or watermarks.
```
Kontrol: kamera kıpırdamıyor; telefon ve yeşil ekran tüm klipte sabit ve tam görünür; ekranın önünden hiçbir şey geçmiyor; el yok; yazı/logo yok.
Claude bu klibe gerçek açılış kaydını (zarf → kart → sayfalar) yerleştirir; videoda gösterilen her şey gerçek siteden gelir.
