# GPT görsel istekleri — Tasarım 17 · Emerald & Gold Estate

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/17_Emerald_Gold_Estate/DESIGN_BRIEF.md`.
Görev: `gorevler/G217-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G817-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/17_Emerald_Gold_Estate/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G217: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **gold line art** (bütün dekor parçalarında aynı)
- Renkler: ink `#F3EDDF` · deep `#C8A45A` · primary `#0F4D3A` · mist `#165C46`→`#0B3528` · ivory `#F3EDDF` · gold `#C8A45A` · leaf `#C8A45A`
- Renk dünyası: deep emerald green, polished gold, white Carrara marble and ivory
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G217` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 17` — değişiklik için `tools/katalog.py` → `WEB[17]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Zümrüt yeşili zarf, altın mühür; kapak açılınca altın çizgiler çizilerek büyür):
On tap, the gold seal lifts away with a glint, the emerald flap opens upward, thin gold botanical lines draw themselves across the screen, and the marble card rises from the pocket.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same emerald envelope, gold seal,
  decor, paper, metal and light.
- Technique for all decor: **gold line art**; paper, fabric and metal look real.
- Palette: ink `#F3EDDF` · deep `#C8A45A` · primary `#0F4D3A` · mist `#165C46`→`#0B3528` · ivory `#F3EDDF` · gold `#C8A45A` · leaf `#C8A45A` (deep emerald green, polished gold, white Carrara marble and ivory).
- Typography in the W1 screens: ornate decorative Roman capitals for the names and an elegant old-style serif.
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
  emerald envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the emerald envelope. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Evelyn & Alexander · Saturday, May 29, 2027 · 4:00 PM ·
Emerald Court Estate, Lake Geneva, Wisconsin · Ceremony 4:00 PM The Lakeside Lawn · Cocktail Hour 5:00 PM The Marble Gallery · Reception 6:30 PM The Emerald Ballroom · Black tie ·
Kindly reply by April 17, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: deep emerald green velvet texture (#165C46 to #0B3528) with soft sheen and very subtle gold dust at the edges, empty center, with thin metallic-gold line-art ferns, monstera leaves and eucalyptus sprigs drawn as fine outlines without fill framing the top-left and bottom-right corners and a few small floating accents (a thin gold line-art fern leaf, a small gold line-art monstera leaf, a small gold line-art eucalyptus sprig). Centered slightly below the middle: a deep jewel-emerald (#0F4D3A) envelope with a velvet sheen, about 5:4 wider than tall, with a long curved bell-shaped (ogee) flap reaching just below the center, the flap edge, the pocket's top edges and all four outer edges traced with a thin polished-gold line, closed, with a round polished-gold wax-style seal with a smooth EMPTY center and a fine leaf border, no letters — pressed onto the lowest point of the bell-shaped flap. Above it, typography in ornate decorative Roman capitals for the names and an elegant old-style serif: a small spaced line "YOU ARE INVITED" and the names "Evelyn & Alexander" large; below the emerald envelope a small spaced line "TAP TO OPEN". All decor in gold line art style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: emerald envelope ve gold seal net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the emerald envelope: a small white Carrara-marble-printed card (thin card stock, no stone thickness) with soft grey veins, a slim polished-gold frame around a portrait photo window in its upper part and plain marble below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the display lettering and a small spaced line "MAY 29, 2027 · LAKE GENEVA". Under the card: the names "Evelyn & Alexander" large in the display lettering, a small spaced line "SATURDAY · MAY 29, 2027", the venue "Emerald Court Estate" and "Lake Geneva, Wisconsin" in italic serif, four small elegant countdown boxes "228 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a polished-gold pill button with emerald lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the display lettering at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: a gallery wall: three slim polished-gold frames of the same 3:4 shape in three sizes (large, medium, small) hung asymmetrically on the emerald velvet page; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the display lettering underneath: "At the gallery", "By the lake", "Set in gold". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Galeri duvarı: farklı boylarda ince altın çerçeveler zümrüt kadife duvara asılır.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall white Carrara-marble-printed card (thin card stock, no stone thickness) with a slim polished-gold border and only one thin gold line-art fern sprig at the top holds the title "Order of the Day" in the display lettering and three schedule rows separated by tiny dividers (a horizontal thin gold line-art fern sprig): "4:00 PM — Ceremony — The Lakeside Lawn", "5:00 PM — Cocktail Hour — The Marble Gallery", "6:30 PM — Reception — The Emerald Ballroom" (time in small spaced serif, event in serif, place in italic serif). Below the card: a landscape slim polished-gold picture frame with a fine inner bevel, its window filled with flat pure green #00FF00 (the venue photo), under it "Emerald Court Estate" and "Lake Geneva, Wisconsin", then a small line "DRESS CODE · Black tie". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the display lettering, "Kindly reply by April 17, 2027" in serif, a polished-gold pill button with emerald lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Evelyn & Alexander" in the display lettering at the bottom; a small gold seal — the same one as on the emerald envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı emerald envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: deep emerald green velvet texture (#165C46 to #0B3528) with soft sheen and very subtle gold dust at the edges, empty center, with thin metallic-gold line-art ferns, monstera leaves and eucalyptus sprigs drawn as fine outlines without fill entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no emerald envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: deep emerald-green velvet (#165C46) with a soft even sheen. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same emerald envelope as in the W1 screens, alone and closed, WITHOUT the gold seal: a deep jewel-emerald (#0F4D3A) envelope with a velvet sheen, about 5:4 wider than tall, with a long curved bell-shaped (ogee) flap reaching just below the center, the flap edge, the pocket's top edges and all four outer edges traced with a thin polished-gold line. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; gold seal yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a round polished-gold wax-style seal with a smooth EMPTY center and a fine leaf border, no letters, alone, exactly as it sits on the emerald envelope in the W1 screens (pressed onto the lowest point of the bell-shaped flap), drawn large so it fills about 70% of the square (Claude scales it to the emerald envelope), with the same perspective, material and light as on the emerald envelope and with no emerald envelope behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız gold seal; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME emerald envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the bell-shaped flap folded fully upward, its inner side and the inside of the back showing a softly polished gold-foil liner with a fine emerald-green line-art pattern of ferns and leaves; the front pocket empty, its top edges traced with a thin polished-gold line. The top edge of the front pocket is a crisp, clearly visible edge against the liner. No card, nothing inside, no gold seal. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the emerald envelope in W1.2, alone: a small white Carrara-marble-printed card (thin card stock, no stone thickness) with soft grey veins, a slim polished-gold frame around a portrait photo window in its upper part and plain marble below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the emerald envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall white Carrara-marble-printed card (thin card stock, no stone thickness) with soft thin grey veins and a slim polished-gold border, elegant thin metallic-gold line-art ferns, monstera and eucalyptus growing from the top-left and bottom-right corners. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall white Carrara-marble-printed card (thin card stock, no stone thickness) with a slim polished-gold border and only one thin gold line-art fern sprig at the top. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a slim polished-gold picture frame with a fine inner bevel. The window inside is a portrait window (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape slim polished-gold picture frame with a fine inner bevel, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of thin metallic-gold line-art ferns, monstera leaves and eucalyptus sprigs drawn as fine outlines without fill, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of thin metallic-gold line-art ferns, monstera leaves and eucalyptus sprigs drawn as fine outlines without fill, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE thin gold line-art fern leaf, in the same gold line art style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small gold line-art monstera leaf, in the same gold line art style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small gold line-art eucalyptus sprig, in the same gold line art style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same gold line art style: a horizontal thin gold line-art fern sprig, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: deep emerald green velvet texture (#165C46 to #0B3528) with soft sheen and very subtle gold dust at the edges, empty center, with thin metallic-gold line-art ferns, monstera leaves and eucalyptus sprigs drawn as fine outlines without fill framing the left and right edges, and the closed emerald envelope with its gold seal resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed emerald envelope with its gold seal completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G217`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar ince altın çerçevelere (~3:4) girer (galeri duvarı): yüzler ortadaki %70'lik alanda. Renk dünyası: zümrüt yeşili, altın, beyaz mermer, fildişi.

### 2.1 Ana portre
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other on the terrace of a grand lakeside estate at golden hour; she wears an emerald-green satin evening gown, he wears a black tuxedo with an emerald velvet bow tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "At the gallery"
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together in a marble gallery hall, each holding a glass of champagne, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "By the lake"
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment in a formal estate garden beside a lake at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Set in gold"
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, resting on emerald velvet, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional lakeside country estate set for a black-tie wedding: a grand neoclassical house with a marble gallery, a lawn sloping to a lake with rows of white chairs, tall clipped hedges, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G817)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on a white Carrara marble surface, surrounded at the edges by emerald velvet ribbon, gold candle holders and eucalyptus. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on a white Carrara marble surface, with emerald velvet ribbon, gold candle holders and eucalyptus beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on an emerald green envelope with a gold seal on a white Carrara marble surface, with emerald velvet ribbon, gold candle holders and eucalyptus at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
