# GPT görsel istekleri — Tasarım 05 · Mediterranean Lemon

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/05_Lemon_Mediterranean/DESIGN_BRIEF.md`.
Görev: `gorevler/G205-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G805-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/05_Lemon_Mediterranean/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G205: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **soft watercolor** (bütün dekor parçalarında aynı)
- Renkler: ink `#1F3557` · deep `#2A5DA8` · primary `#F2C94C` · mist `#F7F4EC`→`#DCE6F2` · ivory `#FFFDF7` · gold `#C9A04A` · leaf `#5E8C4A`
- Renk dünyası: sunny lemon yellow, cobalt blue, bright white and fresh leaf green
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G205` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 05` — değişiklik için `tools/katalog.py` → `WEB[5]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Çini desenli astarlı beyaz zarf; kapak açılırken limon dalı içeri doğru sallanır):
On tap, the lemon tie slips loose and rolls away, the white flap opens upward to reveal the blue-and-white tile liner, and the card rises while a lemon branch sways in from the top corner and a blossom drifts down.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same white envelope, lemon tie,
  decor, paper, metal and light.
- Technique for all decor: **soft watercolor**; paper, fabric and metal look real.
- Palette: ink `#1F3557` · deep `#2A5DA8` · primary `#F2C94C` · mist `#F7F4EC`→`#DCE6F2` · ivory `#FFFDF7` · gold `#C9A04A` · leaf `#5E8C4A` (sunny lemon yellow, cobalt blue, bright white and fresh leaf green).
- Typography in the W1 screens: a breezy flowing script for the names and an elegant high-contrast Didone serif.
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
  white envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn large on its own square; Claude scales it
  onto the white envelope. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Isabella & Marco · Saturday, June 12, 2027 · 4:00 PM ·
Villa Limonaia, Sorrento, Italy · Ceremony 4:00 PM The Lemon Grove · Cocktail Hour 5:00 PM The Sea Terrace · Reception 6:30 PM The Villa Courtyard · Summer formal ·
Kindly reply by May 1, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: sunlit warm white plaster wall texture fading to a soft sky blue at the bottom (#F7F4EC to #DCE6F2), gentle dappled leaf shadows at the edges, empty center, with lemon branches with ripe yellow lemons, white lemon blossoms and glossy green leaves, fresh watercolor framing the top-left and bottom-right corners and a few small floating accents (a whole ripe lemon with one glossy leaf, a white lemon blossom, a glossy green lemon leaf). Centered slightly below the middle: a crisp bright-white watercolor-paper envelope, about 5:4 wider than tall, with a pointed V flap whose edge is gently scalloped and traced with a thin hand-painted cobalt blue line, closed, with a single small glossy lemon with two leaves and a short sprig of white lemon blossom, tied together with a thin cobalt blue ribbon in a little bow — tucked onto the tip of the V flap. Above it, typography in a breezy flowing script for the names and an elegant high-contrast Didone serif: a small spaced line "YOU ARE INVITED" and the names "Isabella & Marco" large; below the white envelope a small spaced line "TAP TO OPEN". All decor in soft watercolor style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: white envelope ve lemon tie net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the white envelope: a small bright-white card with a gently scalloped edge, a portrait photo window framed by a single row of tiny hand-painted cobalt-and-white tiles in its upper part and plain blank paper below; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "JUNE 12, 2027 · SORRENTO". Under the card: the names "Isabella & Marco" large in the script, a small spaced line "SATURDAY · JUNE 12, 2027", the venue "Villa Limonaia" and "Sorrento, Italy" in italic serif, four small elegant countdown boxes "242 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a cobalt blue pill button with white lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three scalloped tile-framed portraits standing perfectly straight in a gentle staggered column down the page (left, right, left) like painted tile panels set into a sunlit white plaster wall, not overlapping; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "On the piazza", "Above the sea", "Our sweetest yes". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Fiyonk dilimli (scalloped) kenarlı çerçeveler, çini panolar gibi döner.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall bright-white scalloped card with a thin cobalt blue painted border and only one small lemon sprig at the top holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a single short lemon sprig with one small lemon and two blossoms): "4:00 PM — Ceremony — The Lemon Grove", "5:00 PM — Cocktail Hour — The Sea Terrace", "6:30 PM — Reception — The Villa Courtyard" (time in small spaced serif, event in serif, place in italic serif). Below the card: a landscape scalloped-edge rectangular frame made of a single row of small hand-painted cobalt-and-white majolica tiles, a tiny lemon sprig at one corner, its window filled with flat pure green #00FF00 (the venue photo), under it "Villa Limonaia" and "Sorrento, Italy", then a small line "DRESS CODE · Summer formal". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by May 1, 2027" in serif, a cobalt blue pill button with white lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Isabella & Marco" in the script at the bottom; a small lemon tie — the same one as on the white envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı white envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 17 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: sunlit warm white plaster wall texture fading to a soft sky blue at the bottom (#F7F4EC to #DCE6F2), gentle dappled leaf shadows at the edges, empty center, with lemon branches with ripe yellow lemons, white lemon blossoms and glossy green leaves, fresh watercolor entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no white envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: sunlit warm-white plaster (#F7F4EC) with a very soft trowel texture. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same white envelope as in the W1 screens, alone and closed, WITHOUT the lemon tie: a crisp bright-white watercolor-paper envelope, about 5:4 wider than tall, with a pointed V flap whose edge is gently scalloped and traced with a thin hand-painted cobalt blue line. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; lemon tie yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only a single small glossy lemon with two leaves and a short sprig of white lemon blossom, tied together with a thin cobalt blue ribbon in a little bow, alone, exactly as it sits on the white envelope in the W1 screens (tucked onto the tip of the V flap), drawn large so it fills about 70% of the square (Claude scales it to the white envelope), with the same perspective, material and light as on the white envelope and with no white envelope behind it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız lemon tie; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME white envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the scalloped V flap folded fully upward, its inner side and the inside of the back showing original hand-painted blue and white majolica-style tile pattern (cobalt #2A5DA8 on white) with small lemon and leaf motifs, seamless square tiles; the front pocket empty. The top edge of the front pocket is a crisp, clearly visible edge against the liner. No card, nothing inside, no lemon tie. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the white envelope in W1.2, alone: a small bright-white card with a gently scalloped edge, a portrait photo window framed by a single row of tiny hand-painted cobalt-and-white tiles in its upper part and plain blank paper below. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the white envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall bright-white card with a gently scalloped outer edge and a thin cobalt blue painted border, a watercolor lemon branch with ripe lemons, white blossoms and glossy leaves across the top, and a narrow band of blue-and-white majolica tile pattern along the bottom edge. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall bright-white scalloped card with a thin cobalt blue painted border and only one small lemon sprig at the top. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: a scalloped-edge rectangular frame made of a single row of small hand-painted cobalt-and-white majolica tiles. The window inside is a portrait rectangular window (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape scalloped-edge rectangular frame made of a single row of small hand-painted cobalt-and-white majolica tiles, a tiny lemon sprig at one corner, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of lemon branches with ripe yellow lemons, white lemon blossoms and glossy green leaves, fresh watercolor, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of lemon branches with ripe yellow lemons, white lemon blossoms and glossy green leaves, fresh watercolor, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE whole ripe lemon with one glossy leaf, in the same soft watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE white lemon blossom, in the same soft watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE glossy green lemon leaf, in the same soft watercolor style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same soft watercolor style: a single short lemon sprig with one small lemon and two blossoms, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: sunlit warm white plaster wall texture fading to a soft sky blue at the bottom (#F7F4EC to #DCE6F2), gentle dappled leaf shadows at the edges, empty center, with lemon branches with ripe yellow lemons, white lemon blossoms and glossy green leaves, fresh watercolor framing the left and right edges, and the closed white envelope with its lemon tie resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed white envelope with its lemon tie completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G205`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar dilimli kenarlı çini çerçevelere (~3:4) girer: yüzler ortadaki %70'lik alanda. Renk dünyası: limon sarısı, kobalt mavisi, beyaz, taze yaprak yeşili, Akdeniz güneşi.

### 2.1 Ana portre
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other on a sunlit Mediterranean terrace shaded by lemon trees, the sea far behind; she wears a flowing white linen sundress, he wears a light cream linen suit with an open collar. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "On the piazza"
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a small café table on a sunny piazza, two glasses of lemonade and a little vase of lemon blossoms, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "Above the sea"
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment on a whitewashed terrace overlooking the sea at sunset, lemon trees around them: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "Our sweetest yes"
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a small sprig of lemon blossoms and leaves, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional Italian lemon-grove villa wedding venue at golden hour: a pale yellow villa with blue shutters, a stone terrace above the sea, rows of white chairs between lemon trees and an arch of lemon branches and white flowers, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan mockup'ları (görev G805)

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.

### 3.1 Telefon mockup'ı
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/mockups/phone_flatlay.png` · 1024×1536

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on a white plaster tabletop with blue and white tiles at the edge, surrounded at the edges by lemon branches with ripe lemons and white blossoms. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.2 Dizüstü mockup'ı
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/mockups/laptop_desk.png` · 1536×1024

```
Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on a white plaster tabletop with blue and white tiles at the edge, with lemon branches with ripe lemons and white blossoms beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.

### 3.3 Basılı kart mockup'ı
**Kaydet:** `collections/05_Lemon_Mediterranean/assets/gpt/mockups/card_flatlay.png` · 1024×1536

```
Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on a white envelope with a blue tile-pattern liner on a white plaster tabletop with blue and white tiles at the edge, with lemon branches with ripe lemons and white blossoms at the edges. Soft natural light, gentle shadows, no text, no logos.
```
Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.
