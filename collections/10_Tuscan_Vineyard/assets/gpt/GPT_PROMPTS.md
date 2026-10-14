# GPT görsel istekleri — Tasarım 10 · Tuscan Vineyard

> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2
> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.
> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and
> folder shown under "Kaydet". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1
> screens, which are layout references.

Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme
yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: `collections/10_Tuscan_Vineyard/DESIGN_BRIEF.md`.
Görev: `gorevler/G210-*` (Paket 5 + Paket 2); mockup'lar `gorevler/G810-*` (Paket 3). Model: tasarım 03 —
`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `collections/10_Tuscan_Vineyard/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)
- Commit mesajı: `G210: website paketi` (Paket 5 + Paket 2)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **vintage engraving with watercolor wash** (bütün dekor parçalarında aynı)
- Renkler: ink `#2F2420` · deep `#5B2C3A` · primary `#7A3E4E` · mist `#F4ECE2`→`#DCC7AE` · ivory `#FBF6EC` · gold `#A9874F` · leaf `#6F7A4C`
- Renk dünyası: deep wine, grape purple, kraft brown, olive green and warm sand
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website tasarımı (GPT tasarlar)

> Görev `G210` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf
> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele
> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.
> Üreten: `python3 tools/katalog.py paket5 --no 10` — değişiklik için `tools/katalog.py` → `WEB[10]`.

**Bu tasarımın website açılışı** (kapaklı zarf; katalog: Kraft zarf, sicim ve kurutulmuş zeytin yaprağıyla bağlı; sicim çözülür, kapak açılır):
On tap, the twine unwinds upward off the flap tip with its cork and olive leaves, the kraft flap opens to reveal the wine-colored grape liner, and the card rises as a vine tendril curls in from the corner.

**Instructions for GPT (read fully before starting):**
- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury
  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous
  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.
- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given
  as **reference images**, then the PAKET 2 photos. Every image shares the same kraft envelope, twine-and-cork tie,
  decor, paper, metal and light.
- Technique for all decor: **vintage engraving with watercolor wash**; paper, fabric and metal look real.
- Palette: ink `#2F2420` · deep `#5B2C3A` · primary `#7A3E4E` · mist `#F4ECE2`→`#DCC7AE` · ivory `#FBF6EC` · gold `#A9874F` · leaf `#6F7A4C` (deep wine, grape purple, kraft brown, olive green and warm sand).
- Typography in the W1 screens: a flowing Italian chancery script for the names and classic Roman inscription capitals.
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
  kraft envelope at the SAME size, position and angle. Make envelope_closed.png first and give it as the
  reference for closure.png and envelope_open.png. closure.png is drawn on a canvas of the same size so it overlays
  envelope_closed.png pixel for pixel. Do not draw separate flap, door, pocket or cover pieces — Claude cuts
  interlocking pieces from one image.
- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).
- Must not resemble any real person, brand or another seller's design.

### W1 — Telefon ekranı tasarımları (referans; satılmaz)

Ortak demo metin (W1 ekranlarında bu metni kullan): Giulia & Matteo · Saturday, September 25, 2027 · 4:00 PM ·
Tenuta del Sole, Montepulciano, Italy · Ceremony 4:00 PM The Vineyard Terrace · Cocktail Hour 5:00 PM The Cellar · Reception 6:30 PM The Cypress Courtyard · Garden formal ·
Kindly reply by August 14, 2027.

#### W1.1 Açılış sayfası — kapalı zarf
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/comps/web_1_envelope.png` · 1024×1536

```
Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait phone screen layout — no phone hardware, no status bar, no browser bar. Background: warm Tuscan sunset gradient of cream to soft sand (#F4ECE2 to #DCC7AE) with faint hazy rolling hills silhouette at the bottom, empty center, with grape clusters in deep purple and green, vine leaves, tendrils and olive branches, vintage botanical engraving with soft watercolor wash framing the top-left and bottom-right corners and a few small floating accents (a small cluster of deep purple grapes, a green vine leaf with a curling tendril, a silvery olive leaf). Centered slightly below the middle: a natural kraft-brown paper envelope with visible fibers, about 5:4 wider than tall, with a deep pointed V flap whose edge is printed with a fine wine-red (#5B2C3A) engraved vine border, closed, with natural jute twine wrapped twice VERTICALLY around the envelope and knotted over the tip of the V flap around a small plain natural cork disc (no branding), two dried olive leaves tucked under the knot — wrapped vertically around the envelope, knotted at the tip of the V flap. Above it, typography in a flowing Italian chancery script for the names and classic Roman inscription capitals: a small spaced line "YOU ARE INVITED" and the names "Giulia & Matteo" large; below the kraft envelope a small spaced line "TAP TO OPEN". All decor in vintage engraving with watercolor wash style. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kraft envelope ve twine-and-cork tie net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm.

#### W1.2 Home — kart, isimler, geri sayım
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/comps/web_2_home.png` · 1024×1536

```
Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the kraft envelope: a small cream card with a portrait photo window shaped like a vintage wine label (rectangle with cut corners) bordered by a fine engraved double line in its upper part, plain blank paper below — a nameless label design: no winery name, no vintage year, no crest or medallion; its photo window is filled with flat pure green #00FF00, and on the card below the window the line "We're getting married" in the script and a small spaced line "SEPTEMBER 25, 2027 · MONTEPULCIANO". Under the card: the names "Giulia & Matteo" large in the script, a small spaced line "SATURDAY · SEPTEMBER 25, 2027", the venue "Tenuta del Sole" and "Montepulciano, Italy" in italic serif, four small elegant countdown boxes "347 DAYS · 09 HOURS · 05 MINUTES · 05 SECONDS", and a deep wine-red pill button with cream lettering labelled "RSVP". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". One or two floating accents. Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var.

#### W1.3 Story — üç fotoğraf
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/comps/web_3_story.png` · 1024×1536

```
Same design, page 3 of 5: our story. The title "Our Story" in the script at the top with a small spaced subtitle "MOMENTS WE HOLD DEAR". Below: three wine-label shaped frames lined up side by side on a rustic oak table, not overlapping, a few grapes and a silvery olive leaf resting beside them; every photo window is filled with flat pure green #00FF00 and each frame has a small caption in the script underneath: "First pour", "Among the vines", "A fine vintage". Small touches of the same decor between the frames. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç çerçeve, pencereler düz yeşil; başlık üstte; çerçeveler birbirini kesmiyor; diziliş: Eski şarap etiketi biçimli (adsız) kartlar, ahşap masaya dizilir.

#### W1.4 Details — program kartı ve mekân
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/comps/web_4_details.png` · 1024×1536

```
Same design, page 4 of 5: details. A tall cream cut-corner label card with a fine engraved double border and only one small vine sprig at the top — a nameless label design: no winery name, no vintage year, no crest or medallion holds the title "Order of the Day" in the script and three schedule rows separated by tiny dividers (a short horizontal vine sprig with one small grape cluster and a tendril): "4:00 PM — Ceremony — The Vineyard Terrace", "5:00 PM — Cocktail Hour — The Cellar", "6:30 PM — Reception — The Cypress Courtyard" (time in small spaced serif, event in serif, place in italic serif). Below the card: a landscape vintage wine-label shaped frame (rectangle with cut corners) in cream with a fine engraved double border — a blank, nameless label: no winery name, no vintage year, no crest or medallion, no lettering of any kind, its window filled with flat pure green #00FF00 (the venue photo), under it "Tenuta del Sole" and "Montepulciano, Italy", then a small line "DRESS CODE · Garden formal". A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var.

#### W1.5 RSVP — davet kartı ve buton
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/comps/web_5_rsvp.png` · 1024×1536

```
Same design, page 5 of 5: RSVP. The same card as page 4 with the title "Will You Join Us?" in the script, "Kindly reply by August 14, 2027" in serif, a deep wine-red pill button with cream lettering labelled "RSVP", the line "We can't wait to celebrate with you" and "With love, Giulia & Matteo" in the script at the bottom; a small twine-and-cork tie — the same one as on the kraft envelope — rests at the base of the card. A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP". Premium luxury wedding stationery quality, real paper and material textures, soft natural light from the top-left, refined, rich and airy.
```
Kontrol: buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı.

### W2 — Parçalar (website katmanları; YAZI YOK)

W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı kraft envelope, aynı kapanış,
aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. 18 parça.

#### W2.1 Sayfa arka planı (telefon)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/bg_page.png` · 1024×1536

```
The page background of the W1 screens alone, as a vertical phone-screen background: warm Tuscan sunset gradient of cream to soft sand (#F4ECE2 to #DCC7AE) with faint hazy rolling hills silhouette at the bottom, empty center, with grape clusters in deep purple and green, vine leaves, tendrils and olive branches, vintage botanical engraving with soft watercolor wash entering softly from the top-left and bottom-right edges only. The whole central area stays calm and empty (no kraft envelope, no card, no frames, no text) so it still works when a tall phone crops the sides. Same colors, technique and light as the W1 screens.
```
Kontrol: orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık.

#### W2.2 Dikişsiz zemin dokusu (uzun sayfalar)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/bg_tile.png` · 1024×1024

```
A seamless tileable square texture for long website pages: warm cream-sand paper (#F4ECE2) with a soft watercolor wash and faint fibers. Calm, even and very low in contrast; no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok.

#### W2.3 Kapalı zarf — kapanış elemanı OLMADAN
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same kraft envelope as in the W1 screens, alone and closed, WITHOUT the twine-and-cork tie: a natural kraft-brown paper envelope with visible fibers, about 5:4 wider than tall, with a deep pointed V flap whose edge is printed with a fine wine-red (#5B2C3A) engraved vine border. Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 80% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap — a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; twine-and-cork tie yok; kesilmemiş; gölge yok; gerçek alfa; kesilecek kenar net çizgi (nesnenin kendi üstünde ince temas gölgesi).

#### W2.4 Kapanış elemanı (tek başına)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/closure.png` · 1024×1536 · **Şeffaf zemin**

```
Only natural jute twine wrapped twice VERTICALLY around the envelope and knotted over the tip of the V flap around a small plain natural cork disc (no branding), two dried olive leaves tucked under the knot, alone, exactly as it sits on the kraft envelope in the W1 screens (wrapped vertically around the envelope, knotted at the tip of the V flap), with no kraft envelope behind it. Draw it on a canvas of exactly the same size as envelope_closed.png and give envelope_closed.png as the reference image: the twine-and-cork tie sits exactly where it wraps the kraft envelope there, so the two images overlay pixel for pixel. Where it wraps around the edges, its ends stop exactly at the kraft envelope's outline. The kraft envelope itself is NOT drawn. Front view, perfectly straight. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız twine-and-cork tie; harf/monogram yok; envelope_closed üstüne 1:1 oturuyor (yarı saydam üst üste konunca zarfın kenarlarıyla çakışıyor); uçlar zarf kenarında bitiyor; gölge yok; alfa.

#### W2.5 Açık zarf — boş
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME kraft envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the V flap folded fully upward, its inner side and the inside of the back showing deep wine (#5B2C3A) background with a fine vintage engraving-style repeat of small grape clusters and vine leaves in cream; the front pocket empty. The top edge of the front pocket is a crisp, clearly visible edge against the liner. No card, nothing inside, no twine-and-cork tie. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser).

#### W2.6 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small card that comes out of the kraft envelope in W1.2, alone: a small cream card with a portrait photo window shaped like a vintage wine label (rectangle with cut corners) bordered by a fine engraved double line in its upper part, plain blank paper below — a nameless label design: no winery name, no vintage year, no crest or medallion. Its photo window is filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank (no text). Slightly narrower than the kraft envelope so it fits inside it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa.

#### W2.7 Büyük davet kartı (boş)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/invitation_card.png` · 1024×1536 · **Şeffaf zemin**

```
The large invitation card of this design, alone: a tall cream card shaped like an elegant vintage wine label (rectangle with cut corners) with a fine engraved double border, vintage-engraving grape clusters, vine leaves and tendrils with a soft watercolor wash across the top and a small olive branch at the bottom — a blank, nameless label: no winery name, no vintage year, no crest or medallion, no lettering of any kind. The card face is completely blank (no text at all) with a large calm area in the middle for the invitation wording. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa.

#### W2.8 Hafif kart (details/rsvp için, boş)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/info_card.png` · 1024×1536 · **Şeffaf zemin**

```
The lighter card from W1.4 and W1.5, alone: a tall cream cut-corner label card with a fine engraved double border and only one small vine sprig at the top — a nameless label design: no winery name, no vintage year, no crest or medallion. Completely blank face (no text) with a large calm writing area. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: boş yüz; davet kartından daha sade; gölge yok; alfa.

#### W2.9 Dikey foto çerçevesi (story)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/frame_portrait.png` · 1024×1536 · **Şeffaf zemin**

```
One photo frame from W1.3, alone and upright: an elegant vintage wine-label shaped frame (rectangle with cut corners) in cream with a fine engraved double border — a blank, nameless label: no winery name, no vintage year, no crest or medallion, no lettering of any kind. The window inside is a portrait window with cut corners (about 3:4), filled with flat pure green #00FF00. No caption, no text. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa.

#### W2.10 Yatay foto çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A landscape vintage wine-label shaped frame (rectangle with cut corners) in cream with a fine engraved double border — a blank, nameless label: no winery name, no vintage year, no crest or medallion, no lettering of any kind, matching frame_portrait.png exactly in material and ornament, about 80% of the image width. The window inside is a 3:2 landscape window, filled with flat pure green #00FF00, for the venue photo. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa.

#### W2.11 Köşe kümesi — sol üst
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/decor_tl.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of grape clusters in deep purple and green, vine leaves, tendrils and olive branches, vintage botanical engraving with soft watercolor wash, isolated, as at the top-left corner of the W1 screens: it fans from the top-left toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the top and left edges (do not cut it off at the image border). Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa.

#### W2.12 Köşe kümesi — sağ alt
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/decor_br.png` · 1024×1024 · **Şeffaf zemin**

```
ONE cluster of grape clusters in deep purple and green, vine leaves, tendrils and olive branches, vintage botanical engraving with soft watercolor wash, isolated, as at the bottom-right corner of the W1 screens: it fans from the bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even at the bottom and right edges. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa.

#### W2.13 Süzülen accent 1
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE small cluster of deep purple grapes, in the same vintage engraving with watercolor wash style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.14 Süzülen accent 2
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/accent_2.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE green vine leaf with a curling tendril, in the same vintage engraving with watercolor wash style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.15 Süzülen accent 3
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/accent_3.png` · 1024×1024 · **Şeffaf zemin**

```
Exactly ONE silvery olive leaf, in the same vintage engraving with watercolor wash style as the W1 screens, alone in the middle of the square at about 40% of its width with lots of empty space around it — a single small object that will float across the website. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa.

#### W2.16 Küçük ayırıcı
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A small horizontal divider in the same vintage engraving with watercolor wash style: a short horizontal vine sprig with one small grape cluster and a tendril, lying horizontally and centered, about 60% of the image width, lots of empty space around it. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: küçük, yatay ve ortalı; gölge yok; alfa.

#### W2.17 Story masası dokusu (meşe, dikişsiz)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/oak_tile.png` · 1024×1024

```
A seamless tileable square texture of a rustic honey-brown oak tabletop seen from directly above, planks running horizontally, soft even light from the top-left, low contrast, no objects, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.
```
Kontrol: dikişsiz; düşük kontrast; nesne/yazı yok.

#### W2.18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design for the desktop website header: warm Tuscan sunset gradient of cream to soft sand (#F4ECE2 to #DCC7AE) with faint hazy rolling hills silhouette at the bottom, empty center, with grape clusters in deep purple and green, vine leaves, tendrils and olive branches, vintage botanical engraving with soft watercolor wash framing the left and right edges, and the closed kraft envelope with its twine-and-cork tie resting slightly off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is also cropped to 1200×630 for link previews: keep the closed kraft envelope with its twine-and-cork tie completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, colors and light as the W1 screens. No text, no letters.
```
Kontrol: orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 yalnız zemin/dekor (1200×630 kırpımı).

---

## PAKET 2 — Örnek fotoğraflar

Görev `G210`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi
fotoğraflarını koyar. 2.1'den sonra her prompt'ta "same couple as in hero_portrait.jpg" korunur. Gerçek veya ünlü
birine benzemesin; eller/parmaklar düzgün. Fotoğraflar köşeleri kesik şarap etiketi biçimli çerçevelere (~3:4) girer: yüzler ortadaki %70'lik alanda. Renk dünyası: şarap kırmızısı, kraft, zeytin yeşili, Toskana gün batımı.

### 2.1 Ana portre
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1536)

```
Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real person), standing close and smiling at each other between vineyard rows on a sunny hillside at golden hour, cypress trees in the distance; she wears a flowing ivory silk slip dress, he wears a light tan linen suit with no tie. Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area of the frame with generous space around them. Vertical photo, no text, no watermark.
```

### 2.2 Hikâye 1 — "First pour"
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/photos/story_1.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), a candid first-date moment laughing together at a rustic wooden table in a vineyard, two glasses of red wine and a loaf of bread, relaxed and natural, true-to-life colors, soft film look, subjects centered, vertical photo, no text, no signage, no watermark.
```

### 2.3 Hikâye 2 — "Among the vines"
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/photos/story_2.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), the proposal moment in a vineyard row under heavy grape vines at sunset: he kneels holding a small open ring box, she covers her mouth in happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft film look, vertical photo, no text, no watermark.
```

### 2.4 Hikâye 3 — "A fine vintage"
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/photos/story_3.jpg` · Dikey (1024×1536)

```
Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), close-up of their hands intertwined showing a delicate engagement ring, holding a small cluster of grapes and an olive sprig, soft natural light, shallow depth of field, centered composition, true-to-life colors, vertical photo, no text, no watermark.
```

### 2.5 Mekân
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/photos/venue.jpg` · Yatay (1536×1024)

```
A fictional Tuscan wine estate at golden hour: a stone farmhouse with a terracotta roof, a terrace overlooking vineyard hills with rows of wooden chairs, cypress trees and a pergola heavy with grape vines, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark.
```

Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.

---

## PAKET 3 — Etsy ilan sahneleri (görev G810; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Üreten: `python3 tools/paket3_sahne.py --no 10` (pilot: 01/03, G801/G803).

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Tuscan Vineyard". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a rustic oak table, grape clusters, vine leaves, olive branches and a cork, the same light and the same color world (deep wine, grape purple, kraft brown, olive green and warm sand). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a rustic oak table and grape clusters, vine leaves, olive branches and a cork. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep wine, grape purple, kraft brown, olive green and warm sand. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a rustic oak table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: grape clusters, vine leaves, olive branches and a cork. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep wine, grape purple, kraft brown, olive green and warm sand. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a rustic oak table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: grape clusters, vine leaves, olive branches and a cork, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep wine, grape purple, kraft brown, olive green and warm sand. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a rustic oak table, slightly right of center and rotated about 8 degrees, surrounded at the edges by grape clusters, vine leaves, olive branches and a cork. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep wine, grape purple, kraft brown, olive green and warm sand. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/10_Tuscan_Vineyard/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a cream linen sofa with a deep wine cushion and a ceramic coffee cup; a small arrangement of grape clusters, vine leaves, olive branches and a cork is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep wine, grape purple, kraft brown, olive green and warm sand. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
