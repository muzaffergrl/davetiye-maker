# GPT görsel istekleri — Tasarım 11 · Boho Pampas Terracotta

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/11_Boho_Pampas/DESIGN_BRIEF.md`.
Görev: `gorevler/G211-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G811-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/11_Boho_Pampas/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G211: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **flat gouache illustration** (bütün dekor parçalarında aynı)
- Renkler: ink `#3A2A22` · deep `#9A4F33` · primary `#C9785B` · mist `#F6EDE3`→`#E5CDB5` · ivory `#FBF5EC` · gold `#C29A5B` · leaf `#9C8A5E`
- Renk dünyası: terracotta, rust, warm sand, cream and muted ochre-sage
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G211` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 11` — değişiklik için `tools/katalog.py` → `WEB[11]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Kemer biçimli terrakota cep; kart kemerden yukarı kayar):
On tap, the pampas-and-palm tie slips off, the arch flap folds upward, and the card slides slowly up out of the arch like a rising sun while a pampas plume sways in from the side.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same terracotta arch pocket, pampas-and-palm tie,
  decor, paper, metal and light.
- Technique for all decor: **flat gouache illustration**; paper, fabric and metal look real.
- Palette: ink `#3A2A22` · deep `#9A4F33` · primary `#C9785B` · mist `#F6EDE3`→`#E5CDB5` · ivory `#FBF5EC` · gold `#C29A5B` · leaf `#9C8A5E` (terracotta, rust, warm sand, cream and muted ochre-sage).
- Typography in the W1 screens: a relaxed flowing brush script for the names and a warm slab serif in spaced capitals.
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
  terracotta arch pocket at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the terracotta arch pocket. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Luna & River · Saturday, April 17, 2027 · 4:00 PM ·
Desert Bloom Ranch, Joshua Tree, California · Ceremony 4:00 PM The Desert Garden · Cocktail Hour 5:00 PM The Adobe Patio · Reception 6:30 PM The Starlight Pavilion · Boho chic ·
Kindly reply by March 6, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: warm sandy cream gradient (#F6EDE3 to #E5CDB5) with very soft sun haze and fine grain, a few faint layered arch shapes at the bottom edge, with fluffy cream pampas grass, dried palm spears, bunny tails and a few dried terracotta roses, flat gouache illustration with soft texture framing the top-left and bottom-right corners and a few small floating accents (a fluffy cream pampas plume, a dried palm spear, a small dried terracotta rose). Centered slightly below the middle: a portrait arch-shaped terracotta (#C9785B) paper pocket with a matte speckled texture, about 3:4: a tall arch-topped back panel, a front pocket covering its lower 55% with a gently curved top edge, and a rounded arch flap folded down from the top of the back panel over the front pocket, closed, with a small dried palm spear and a fluffy pampas plume crossed and tied with a thin cream ribbon — tucked at the center of the arch flap's edge. Above it, typography in a relaxed flowing brush script for the names and a warm slab serif in spaced capitals: a small spaced line "YOU ARE INVITED" and the names "Luna & River" large; below the terracotta arch pocket a small spaced line "TAP TO OPEN". All decor in flat gouache illustration style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: terracotta arch pocket ve pampas-and-palm tie net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the terracotta arch pocket: a small warm-sand speckled card with a tall arch-topped photo window outlined by a thin terracotta arch and a second nested sand-colored arch, a tiny pampas sprig at the arch's lower left, plain blank card below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "APRIL 17, 2027 · JOSHUA TREE". Under the card: the names "Luna & River" large in the script, a small spaced line "SATURDAY · APRIL 17, 2027", the venue "Desert Bloom Ranch" and "Joshua Tree, California" in italic slab serif, four small elegant countdown boxes "186 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a terracotta pill button with cream lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three separate tall arch frames standing side by side with clear space between them, the middle one tallest and slightly in front; each frame is made of two nested bands like a small boho rainbow and has its own photo window; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "Where it began", "Desert sunset", "Wild hearts". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Terrakota ve kum renkli üst üste kemer şekilleri içinde, gökkuşağı gibi açılır.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall arch-topped sand card with a single nested terracotta arch outline and only one small pampas plume at the bottom holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a horizontal spray of a pampas plume and two bunny tails, flat gouache): "4:00 PM — Ceremony — The Desert Garden", "5:00 PM — Cocktail Hour — The Adobe Patio", "6:30 PM — Reception — The Starlight Pavilion" (time in small spaced slab serif, event in slab serif, place in italic slab serif). Below the card: a wide landscape frame with a gently arched top of the same two nested hand-painted gouache bands (an outer terracotta band with a fine cream stitched-dot edge and an inner warm-sand band), visible brush texture and a small spray of cream pampas, a bunny tail and a dried terracotta rose at both lower corners, its window filled with flat pure green #00FF00 (the venue photo), under it "Desert Bloom Ranch" and "Joshua Tree, California", then a small line "DRESS CODE · Boho chic". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by March 6, 2027" in slab serif, a terracotta pill button with cream lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Luna & River" in the script at the bottom; a small pampas-and-palm tie — the same one as on the terracotta arch pocket — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı terracotta arch pocket, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: warm sandy cream gradient (#F6EDE3 to #E5CDB5) with very soft sun haze and fine grain, a few faint layered arch shapes at the bottom edge, with fluffy cream pampas grass, dried palm spears, bunny tails and a few dried terracotta roses, flat gouache illustration with soft texture entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no terracotta arch pocket, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: warm sandy-cream speckled paper (#F6EDE3) with a fine grain. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same terracotta arch pocket as in the W1 screens, alone and closed, WITHOUT the pampas-and-palm tie: a portrait arch-shaped terracotta (#C9785B) paper pocket with a matte speckled texture, about 3:4: a tall arch-topped back panel, a front pocket covering its lower 55% with a gently curved top edge, and a rounded arch flap folded down from the top of the back panel over the front pocket. Place it exactly where it will sit in envelope_open.png: horizontally centered, the pocket about 3:4 (taller than wide), its bottom edge at about 94% of the image height and its width about 52% of the image width; the empty upper part is left for the arch flap to lift fully into (inside the canvas, with margin) and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pampas-and-palm tie yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a small dried palm spear and a fluffy pampas plume crossed and tied with a thin cream ribbon, alone, exactly as it sits on the terracotta arch pocket in the W1 screens (tucked at the center of the arch flap's edge), drawn large so it fills about 70% of the square (Claude scales it to the terracotta arch pocket), with the same perspective, material and light as on the terracotta arch pocket and with no terracotta arch pocket behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız pampas-and-palm tie; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME terracotta arch pocket as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the rounded arch flap lifted fully upward above the back panel, its inner side and the inside of the back panel showing a warm sand-cream (#F6EDE3) lining with a hand-painted repeat of small terracotta and rust arches and dots, flat gouache style; the front pocket (lower 55%, gently curved top edge) empty. The top edge of the front pocket is a crisp, clearly visible edge against the liner. No card, nothing inside, no pampas-and-palm tie. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the terracotta arch pocket in W1.2, alone: a small warm-sand speckled card with a tall arch-topped photo window outlined by a thin terracotta arch and a second nested sand-colored arch, a tiny pampas sprig at the arch's lower left, plain blank card below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the terracotta arch pocket so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall warm-sand speckled card with an arched top, two nested arch outlines in terracotta and rust, fluffy cream pampas grass, dried palm spears and bunny tails in flat gouache growing from the bottom-left and top-right. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall arch-topped sand card with a single nested terracotta arch outline and only one small pampas plume at the bottom. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a tall arch frame of two nested hand-painted gouache bands — an outer terracotta band with a fine cream stitched-dot edge and an inner warm-sand band — with visible brush texture and a small spray of cream pampas, a bunny tail and a dried terracotta rose tucked at its lower left. The window inside is a tall arch-topped window (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A wide landscape frame with a gently arched top of the same two nested hand-painted gouache bands (an outer terracotta band with a fine cream stitched-dot edge and an inner warm-sand band), visible brush texture and a small spray of cream pampas, a bunny tail and a dried terracotta rose at both lower corners, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of fluffy cream pampas grass, dried palm spears, bunny tails and a few dried terracotta roses, flat gouache illustration with soft texture, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of fluffy cream pampas grass, dried palm spears, bunny tails and a few dried terracotta roses, flat gouache illustration with soft texture, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE fluffy cream pampas plume, in the same flat gouache illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE dried palm spear, in the same flat gouache illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small dried terracotta rose, in the same flat gouache illustration style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same flat gouache illustration style: a horizontal spray of a pampas plume and two bunny tails, flat gouache, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: warm sandy cream gradient (#F6EDE3 to #E5CDB5) with very soft sun haze and fine grain, a few faint layered arch shapes at the bottom edge, with fluffy cream pampas grass, dried palm spears, bunny tails and a few dried terracotta roses, flat gouache illustration with soft texture framing the left and right edges, and the closed terracotta arch pocket with its pampas-and-palm tie resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed terracotta arch pocket with its pampas-and-palm tie completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G211`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar uzun kemer çerçevelere (~3:4) girer: yüzler ortada, başın üstünde pay kalsın (kemer tepesi kırpar). Renk dünyası: terrakota, kum, krem, pampas, sıcak çöl ışığı.

### 2.1 Ana portre
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other in the high desert among boulders and yucca at golden hour, warm haze; she wears a flowing cream boho lace dress with bell sleeves, he wears a light sand linen suit with a cream shirt and no tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "Where it began"
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a small outdoor table of an adobe café, two iced drinks and a jar of dried flowers, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "Desert sunset"
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment among desert boulders at sunset, pampas grass around them: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Wild hearts"
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of pampas, dried palm and terracotta roses, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional desert ranch wedding venue at golden hour: an adobe building, a desert garden with cacti, a terracotta-tiled patio and rows of wooden chairs facing an arch of pampas grass and dried palm leaves, warm haze, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan sahneleri (görev G811; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Üreten: `python3 tools/paket3_sahne.py --no 11` (pilot: 01/03, G801/G803).

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Boho Pampas Terracotta". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a warm sand-colored stucco surface, pampas grass plumes, dried palm spears and bunny tails, the same light and the same color world (terracotta, rust, warm sand, cream and muted ochre-sage). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a warm sand-colored stucco surface and pampas grass plumes, dried palm spears and bunny tails. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: terracotta, rust, warm sand, cream and muted ochre-sage. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a warm sand-colored stucco surface, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: pampas grass plumes, dried palm spears and bunny tails. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: terracotta, rust, warm sand, cream and muted ochre-sage. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a warm sand-colored stucco surface, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: pampas grass plumes, dried palm spears and bunny tails, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: terracotta, rust, warm sand, cream and muted ochre-sage. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a warm sand-colored stucco surface, slightly right of center and rotated about 8 degrees, surrounded at the edges by pampas grass plumes, dried palm spears and bunny tails. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: terracotta, rust, warm sand, cream and muted ochre-sage. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/11_Boho_Pampas/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a cream linen sofa with a terracotta cushion and a ceramic coffee cup; a small arrangement of pampas grass plumes, dried palm spears and bunny tails is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: terracotta, rust, warm sand, cream and muted ochre-sage. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
