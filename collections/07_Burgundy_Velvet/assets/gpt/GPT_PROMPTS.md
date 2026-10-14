# GPT görsel istekleri — Tasarım 07 · Burgundy Velvet Autumn

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/07_Burgundy_Velvet/DESIGN_BRIEF.md`.
Görev: `gorevler/G207-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G807-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/07_Burgundy_Velvet/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G207: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **romantic oil painting** (bütün dekor parçalarında aynı)
- Renkler: ink `#3B1A20` · deep `#6E1F2E` · primary `#8C2A3C` · mist `#F4E7E1`→`#D9B9AE` · ivory `#FBF5EE` · gold `#B88A4A` · leaf `#7A6A3A`
- Renk dünyası: deep burgundy, wine red, warm cream, copper and antique gold
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G207` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 07` — değişiklik için `tools/katalog.py` → `WEB[7]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Bordo kadife kurdeleyle bağlı krem zarf; kurdele çözülüp kayar, kapak açılır):
On tap, the velvet bow unties and the ribbon slides off the envelope's sides, the rectangular flap lifts, and the card rises in warm candlelight while a single copper leaf drifts down.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same cream envelope, velvet ribbon,
  decor, paper, metal and light.
- Technique for all decor: **romantic oil painting**; paper, fabric and metal look real.
- Palette: ink `#3B1A20` · deep `#6E1F2E` · primary `#8C2A3C` · mist `#F4E7E1`→`#D9B9AE` · ivory `#FBF5EE` · gold `#B88A4A` · leaf `#7A6A3A` (deep burgundy, wine red, warm cream, copper and antique gold).
- Typography in the W1 screens: a romantic copperplate script for the names and classical engraved Roman capitals.
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
  cream envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn on a canvas of the same size so it overlays
  envelope_closed.png pixel for pixel. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Rosalind & Edward · Saturday, October 23, 2027 · 4:00 PM ·
Hawthorne Hall, Asheville, North Carolina · Ceremony 4:00 PM The Chapel Lawn · Cocktail Hour 5:00 PM The Hearth Room · Reception 6:30 PM The Great Hall · Formal attire ·
Kindly reply by September 11, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: warm candlelit cream-to-rose-taupe gradient (#F4E7E1 to #D9B9AE) with soft golden bokeh and faint canvas texture, with burgundy dahlias, deep red garden roses, blackberries, copper autumn leaves and dark green foliage in a rich oil-painting style framing the top-left and bottom-right corners and a few small floating accents (a copper-orange autumn maple leaf, a deep burgundy dahlia petal, a small blackberry cluster with one leaf). Centered slightly below the middle: a heavy warm-cream cotton envelope with a soft felt texture, about 5:4 wider than tall, with a straight rectangular flap (not pointed), closed, with a long burgundy velvet ribbon crossing the envelope both horizontally and vertically, tied in a soft bow at the crossing with a small antique-gold leaf charm hanging from the knot, plush velvet texture — wrapped around the envelope with the bow a little above the center. Above it, typography in a romantic copperplate script for the names and classical engraved Roman capitals: a small spaced line "YOU ARE INVITED" and the names "Rosalind & Edward" large; below the cream envelope a small spaced line "TAP TO OPEN". All decor in romantic oil painting style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: cream envelope ve velvet ribbon net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the cream envelope: a small heavy-cream card with an upright oval photo window framed in antique gold leaf in its upper part and plain blank paper below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "OCTOBER 23, 2027 · ASHEVILLE". Under the card: the names "Rosalind & Edward" large in the script, a small spaced line "SATURDAY · OCTOBER 23, 2027", the venue "Hawthorne Hall" and "Asheville, North Carolina" in italic serif, four small elegant countdown boxes "375 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a deep burgundy pill button with a velvet sheen and cream lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three oval gold-leaf frames tied at different points along one long burgundy velvet ribbon swag that drapes in a gentle curve across a warm candlelit wall like a garland, each frame swaying slightly; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "By the fire", "Falling leaves", "Hand in hand". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Varak altın oval çerçeveler tek bir kadife kurdele girlandına bağlı, sallanır.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall heavy-cream card with a thin antique-gold leaf border and only a small sprig of burgundy buds and berries at the top holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a horizontal sprig of two small burgundy buds, a few berries and copper leaves in the same oil style): "4:00 PM — Ceremony — The Chapel Lawn", "5:00 PM — Cocktail Hour — The Hearth Room", "6:30 PM — Reception — The Great Hall" (time in small spaced serif, event in serif, place in italic serif). Below the card: a wide landscape oval frame in antique gold leaf with a carved bead border, hanging from a short burgundy velvet ribbon bow at the top, its window filled with flat pure green #00FF00 (the venue photo), under it "Hawthorne Hall" and "Asheville, North Carolina", then a small line "DRESS CODE · Formal attire". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by September 11, 2027" in serif, a deep burgundy pill button with a velvet sheen and cream lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Rosalind & Edward" in the script at the bottom; a small velvet ribbon — the same one as on the cream envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı cream envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 18 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: warm candlelit cream-to-rose-taupe gradient (#F4E7E1 to #D9B9AE) with soft golden bokeh and faint canvas texture, with burgundy dahlias, deep red garden roses, blackberries, copper autumn leaves and dark green foliage in a rich oil-painting style entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no cream envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: warm candlelit cream (#F4E7E1) painted-canvas texture with very soft tonal variation. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same cream envelope as in the W1 screens, alone and closed, WITHOUT the velvet ribbon: a heavy warm-cream cotton envelope with a soft felt texture, about 5:4 wider than tall, with a straight rectangular flap (not pointed). Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; velvet ribbon yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/closure.png` · 1024×1536 · **Şeffaf zemin**

```
Only a long burgundy velvet ribbon crossing the envelope both horizontally and vertically, tied in a soft bow at the crossing with a small antique-gold leaf charm hanging from the knot, plush velvet texture, alone, exactly as it sits on the cream envelope in the W1 screens (wrapped around the envelope with the bow a little above the center), with no cream envelope behind it. Draw it on a canvas of exactly the same size as envelope_closed.png and give envelope_closed.png as the reference image: the velvet ribbon sits exactly where it wraps the cream envelope there, so the two images overlay pixel for pixel. Where it wraps around the edges, its ends stop exactly at the cream envelope's outline. The cream envelope itself is NOT drawn. Front view, perfectly straight. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız velvet ribbon; harf/monogram yok; envelope_closed üstüne 1:1 oturuyor (yarı saydam üst üste konunca zarfın kenarlarıyla çakışıyor); uçlar zarf kenarında bitiyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME cream envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the rectangular flap folded fully upward, its inner side and the inside of the back showing rich burgundy (#6E1F2E) damask pattern with small autumn leaves and berries in muted gold; the front pocket empty. The top edge of the front pocket is a crisp, clearly visible edge against the liner. No card, nothing inside, no velvet ribbon. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the cream envelope in W1.2, alone: a small heavy-cream card with an upright oval photo window framed in antique gold leaf in its upper part and plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the cream envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall heavy-cream card with a thin antique-gold leaf border, a lush oil-painted cascade of burgundy dahlias, deep red roses, blackberries and copper autumn leaves across the top and a smaller cluster at the bottom-right. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall heavy-cream card with a thin antique-gold leaf border and only a small sprig of burgundy buds and berries at the top. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: an oval frame in antique gold leaf with a delicate carved bead border, hanging from a short burgundy velvet ribbon with a small bow at the top. The window inside is an upright oval window (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A wide landscape oval frame in antique gold leaf with a carved bead border, hanging from a short burgundy velvet ribbon bow at the top, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a wide oval window (about 3:2), filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/florals_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of burgundy dahlias, deep red garden roses, blackberries, copper autumn leaves and dark green foliage in a rich oil-painting style, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/florals_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of burgundy dahlias, deep red garden roses, blackberries, copper autumn leaves and dark green foliage in a rich oil-painting style, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE copper-orange autumn maple leaf, in the same romantic oil painting style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE deep burgundy dahlia petal, in the same romantic oil painting style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small blackberry cluster with one leaf, in the same romantic oil painting style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same romantic oil painting style: a horizontal sprig of two small burgundy buds, a few berries and copper leaves in the same oil style, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Story kurdele girlandı
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/velvet_swag.png` · 1536×1024 · **Şeffaf zemin**

```
A single long burgundy velvet ribbon draped across about 85% of the image width in one gentle swag curve, lowest at the center, both ends finished with small soft bows, plush velvet texture, nothing hanging on it, ends not touching the image edges. Seen straight-on (not tilted, no perspective), centered and not cropped, with generous empty margin all around; the object keeps its natural curve. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek kurdele; üstünde çerçeve yok; uçlar kenara değmiyor; gölge yok; alfa.

#### W2.18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: warm candlelit cream-to-rose-taupe gradient (#F4E7E1 to #D9B9AE) with soft golden bokeh and faint canvas texture, with burgundy dahlias, deep red garden roses, blackberries, copper autumn leaves and dark green foliage in a rich oil-painting style framing the left and right edges, and the closed cream envelope with its velvet ribbon resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed cream envelope with its velvet ribbon completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G207`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar dikey oval çerçevelere girer: yüzler tam ortada; köşeler kırpılır — kenarlarda bol pay kalsın. Renk dünyası: bordo, şarap kırmızısı, krem, bakır, mum ışığı.

### 2.1 Ana portre
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in an autumn garden under copper and gold trees at golden hour; she wears a deep burgundy velvet long-sleeve gown, he wears a charcoal three-piece suit with a burgundy tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark. Compose so that both people fit well inside a centered upright oval about as wide as the image (the photo will be cropped to an oval), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.2 Hikâye 1 — "By the fire"
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together by a crackling stone fireplace in a cozy inn, two mugs of hot cider, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark. Compose so that both people fit well inside a centered upright oval about as wide as the image (the photo will be cropped to an oval), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.3 Hikâye 2 — "Falling leaves"
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment on a path covered in fallen autumn leaves under copper trees at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark. Compose so that both people fit well inside a centered upright oval about as wide as the image (the photo will be cropped to an oval), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.4 Hikâye 3 — "Hand in hand"
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of burgundy dahlias and blackberries, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark. Compose so that both people fit well inside a centered upright oval about as wide as the image (the photo will be cropped to an oval), with space around them — for standing or kneeling poses, photograph from a slightly greater distance.
```

### 2.5 Mekân
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional ivy-covered stone manor hall in the mountains in autumn: a chapel lawn with rows of wooden chairs, an arch of burgundy dahlias and autumn leaves, copper trees and misty hills, warm golden light, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan sahneleri (görev G807; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Üreten: `python3 tools/paket3_sahne.py --no 07` (pilot: 01/03, G801/G803).

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Burgundy Velvet Autumn". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a dark walnut table with a burgundy velvet runner, burgundy dahlias, deep red roses, blackberries and a burgundy velvet ribbon, the same light and the same color world (deep burgundy, wine red, warm cream, copper and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower center of the frame, the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a dark walnut table with a burgundy velvet runner and burgundy dahlias, deep red roses, blackberries and a burgundy velvet ribbon. The upper 30% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep burgundy, wine red, warm cream, copper and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; üst %30 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a dark walnut table with a burgundy velvet runner, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: burgundy dahlias, deep red roses, blackberries and a burgundy velvet ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep burgundy, wine red, warm cream, copper and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a dark walnut table with a burgundy velvet runner, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: burgundy dahlias, deep red roses, blackberries and a burgundy velvet ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep burgundy, wine red, warm cream, copper and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a dark walnut table with a burgundy velvet runner, slightly right of center and rotated about 8 degrees, surrounded at the edges by burgundy dahlias, deep red roses, blackberries and a burgundy velvet ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep burgundy, wine red, warm cream, copper and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/07_Burgundy_Velvet/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a cream linen sofa with a deep burgundy cushion and a ceramic coffee cup; a small arrangement of burgundy dahlias, deep red roses, blackberries and a burgundy velvet ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep burgundy, wine red, warm cream, copper and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
