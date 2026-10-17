# BKE Studio — marka kimliği GPT prompt'ları (GM01, 2026-10-14)

Kullanıcı kararı K26: marka adı **BKE Studio** (çalışma adı). İstek: **çağdaş ve cesur**, ama 20 romantik/klasik
tasarımla yan yana yakışan bir marka. Tasarımcı GPT (K21); Claude yalnız vektöre çevirir, ölçülere oturtur, renk
kodlarını ölçer ve kiti kurar (GM02).

**Sıra, tek sohbet:** B0 (brief, görsel yok) → B1 (3 yön panosu) → **commit + push** → en güçlü yönü seç →
B2 (seçilen yönün dosyaları; her birinde seçilen panoyu **referans görsel** ver).

**Bu pakete özel kural:** logo dosyalarında yazı serbest, ama **yalnız "BKE Studio"** (ya da büyük harfle "BKE STUDIO").
Yazımı harf harf kontrol et: B-K-E, boşluk, Studio. Tek harf hatalıysa yeniden üret. Başka kelime, etiket, renk kodu yok.

**Seçim ölçütleri (B1 → B2):** (1) 32 px'te sembol okunuyor mu; (2) tek renkte güçlü mü; (3) özgün mü — Buckle'ın BKE
giyim markasına ya da başka bir düğün markasına benzemiyor mu; (4) çağdaş ve cesur mu; (5) 20 tasarımın yanında
(pembe, zeytin, toz mavi, bordo, lavanta, zümrüt-altın) çerçeve gibi duruyor mu, onlarla yarışmıyor mu. Seçimi ve
gerekçesini görev dosyasının Sonuç'una yaz. Kullanıcı başka yönü seçerse B2 o yönle yeniden üretilir.

---

## B0 — Brief (önce düz mesaj olarak gönder; görsel üretme)

```
You are the lead brand designer for BKE Studio. Read this brief and keep it for every image in this chat; do not generate an image for this message.

What BKE Studio is: a small studio that makes wedding websites that open like a real invitation. On their phone, guests see a sealed envelope; one tap and it opens with motion, and the invitation website appears (home, our story, details, RSVP). Couples buy a design on Etsy and edit everything themselves from their phone. Buyers are engaged couples, 25–38, mostly in the US, UK and Europe, shopping on their phones.

The products are romantic and classic: 20 designs with watercolor florals, wax seals, silk ribbons, lace, kraft envelopes, Art Deco gold, lemons, vineyards, lavender, winter evergreen and a midnight garden.

The brand must be CONTEMPORARY and BOLD: a confident modern frame around romantic products, the way a gallery wall frames paintings. It must not look like one more invitation design, and it must sit well next to all 20 designs on the Etsy shop page and on our sales website.

Name: BKE Studio. Spell it exactly: the capital letters B, K, E, then a space, then Studio with a capital S. An all-caps lockup "BKE STUDIO" is allowed. BKE are initials. Never add any other words to a logo.

Build the brand signature from: the envelope (its V-shaped flap and fold lines), the seal (a pressed circle), and the moment of opening (a reveal).

Rules for every logo image: flat solid color, crisp clean edges, no gradients, no textures, no 3D, no bevels, no shadows, no glow, no mockup perspective; it will be traced to vector. It must still read at 16–32 px as a browser favicon, in one single color, inside a circular avatar, and on both light and dark backgrounds.

Avoid: wedding rings, hearts, doves, bells, cupids, a floral wreath around the logo, script-only logos, generic monogram-in-a-circle templates, glitter or foil effects. Do not imitate any existing brand, especially not the BKE clothing label of the Buckle retailer (no western, denim, varsity, stitched or distressed lettering), and not Zola, The Knot, Minted, Paperless Post, Greenvelope or Etsy.

Color: each direction has one deep anchor color, one vivid accent, one warm paper neutral, a near-black for text and one soft secondary. Text must stay readable (contrast at least 4.5:1), and the palette must harmonize with blush, olive, dusty blue, burgundy, lavender and emerald-and-gold designs.
```

---

## B1 — Üç yön panosu

Ortak pano düzeni her üç prompt'un içinde yazılı. Üçü de 1536×1024, opak.

### B1.A "The Fold"
**Kaydet:** `brand/assets/gpt/boards/direction_a.png` · 1536×1024

```
Brand identity board for BKE Studio, direction A, "The Fold". The symbol is built from an envelope flap: a bold V-shaped fold line becomes part of the letters B, K and E (for example the fold forms the arms of the K, or runs through the letters like a crisp crease). Wordmark: a confident contemporary geometric or wide grotesque sans-serif. Palette: deep ink navy anchor, vivid coral-vermilion accent, warm ivory paper neutral, near-black text, soft dusty blue secondary.
Board layout on a warm paper-colored background: the large primary logo (symbol and wordmark together) on the left half. On the right half: the symbol alone inside a circular avatar; the symbol at tiny favicon size; a row of five unlabeled flat color swatches (anchor, accent, paper neutral, near-black, secondary); a strip of a repeating brand pattern made from the symbol or the fold lines; and one plain modern phone seen from the front whose screen shows only a closed envelope sealed with the symbol. The only text anywhere on the board is "BKE Studio": no other words, no labels, no color codes, no placeholder text. Clean, contemporary, generous white space, flat graphic style.
```
Kontrol: yazı yalnız ve harf harf "BKE Studio"; sembol V/katlama çizgisinden doğuyor; 5 renk kartı etiketsiz; telefon ekranında yalnız mühürlü kapalı zarf.

### B1.B "The Seal"
**Kaydet:** `brand/assets/gpt/boards/direction_b.png` · 1536×1024

```
Brand identity board for BKE Studio, direction B, "The Seal". The symbol is a bold modern seal: a solid circle (a contemporary, flat interpretation of a pressed wax seal, with a slightly irregular organic edge) with B, K and E cut out of it as one crisp ligature monogram. Wordmark: a high-contrast modern serif with sharp, confident details. Palette: deep oxblood burgundy anchor, vivid blush-pink accent, warm cream paper neutral, near-black text, soft sage secondary.
Board layout on a warm paper-colored background: the large primary logo (symbol and wordmark together) on the left half. On the right half: the symbol alone inside a circular avatar; the symbol at tiny favicon size; a row of five unlabeled flat color swatches (anchor, accent, paper neutral, near-black, secondary); a strip of a repeating brand pattern made from the symbol; and one plain modern phone seen from the front whose screen shows only a closed envelope sealed with the symbol. The only text anywhere on the board is "BKE Studio": no other words, no labels, no color codes, no placeholder text. Clean, contemporary, generous white space, flat graphic style.
```
Kontrol: yazı yalnız ve harf harf "BKE Studio"; mühür düz grafik (logo panoda gerçekçi balmumu değil); harfler BKE sırasıyla okunuyor; 5 renk kartı etiketsiz.

### B1.C "The Reveal"
**Kaydet:** `brand/assets/gpt/boards/direction_c.png` · 1536×1024

```
Brand identity board for BKE Studio, direction C, "The Reveal". A typographic identity with dramatic contrast: a heavy, tightly spaced "BKE" and a light, widely spaced "Studio". The diagonal stroke of the K opens like an envelope flap lifting, revealing a sliver of the accent color behind it. The symbol is that opening K, or a compact stacked BKE, set in a square. Palette: near-black aubergine anchor, flat champagne-gold accent (a flat color, not metallic foil), vellum paper neutral, near-black text, dusty lavender secondary.
Board layout on a warm paper-colored background: the large primary logo (symbol and wordmark together) on the left half. On the right half: the symbol alone inside a circular avatar; the symbol at tiny favicon size; a row of five unlabeled flat color swatches (anchor, accent, paper neutral, near-black, secondary); a strip of a repeating brand pattern made from the symbol; and one plain modern phone seen from the front whose screen shows only a closed envelope sealed with the symbol. The only text anywhere on the board is "BKE Studio": no other words, no labels, no color codes, no placeholder text. Clean, contemporary, generous white space, flat graphic style.
```
Kontrol: yazı yalnız ve harf harf "BKE Studio"; K'nin çaprazı kapak gibi açılıyor; altın düz renk (metalik değil); 5 renk kartı etiketsiz.

**B1 bitince:** üç panoyu commit + push et (`GM01: B1 yön panoları`), sonra seçimini yap ve B2'ye geç.

---

## B2 — Seçilen yönün dosyaları

Her prompt'ta seçilen yönün panosunu (`direction_<x>.png`) **referans görsel** olarak ver. Hepsi aynı sembol,
aynı yazı biçimi, aynı renkler. Logo dosyaları düz renk (vektöre çevrilecek); yalnız B2.6 ve B2.9 fotoğrafik.

### B2.1 Sembol
**Kaydet:** `brand/assets/gpt/final/monogram.png` · 1024×1024 · **Şeffaf zemin**

```
The BKE Studio symbol alone, exactly as on the chosen direction board (reference image), redrawn clean and precise: one flat solid color (the anchor color), centered, filling about 70% of the canvas, with generous empty margin. No wordmark and no other text. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız sembol; tek düz renk; kenarlar keskin; gerçek alfa; panodakiyle aynı.

### B2.2 Küçük boy sembol (favicon)
**Kaydet:** `brand/assets/gpt/final/monogram_small.png` · 1024×1024 · **Şeffaf zemin**

```
A simplified version of the same BKE Studio symbol (reference image), designed to read at 16 to 32 pixels as a browser favicon: same idea and silhouette, but thicker strokes, fewer and larger shapes, no thin hairlines, no small gaps. One flat solid color (the anchor color), centered, filling about 80% of the canvas. No other text. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: 32 px'e küçültünce hâlâ okunuyor; ince çizgi yok; tek renk; gerçek alfa.

### B2.3 Yazı logosu
**Kaydet:** `brand/assets/gpt/final/wordmark.png` · 1536×1024 · **Şeffaf zemin**

```
The BKE Studio wordmark alone, exactly as on the chosen direction board (reference image): the words "BKE Studio", spelled B, K, E, space, Studio, in the board's lettering, one flat solid color (the board's text color), horizontally centered on one line, about 80% of the canvas width, no symbol. No other text. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: harf harf "BKE Studio"; tek satır; tek renk; gerçek alfa.

### B2.4 Yatay logo
**Kaydet:** `brand/assets/gpt/final/logo_horizontal.png` · 1536×1024 · **Şeffaf zemin**

```
The BKE Studio horizontal logo lockup, exactly as on the chosen direction board (reference image): the symbol on the left and the wordmark "BKE Studio" on the right, vertically centered on one line, balanced spacing, the whole lockup about 85% of the canvas width. At most two flat colors (anchor and accent) as on the board. No other text. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: harf harf "BKE Studio"; sembol solda; en çok iki düz renk; gerçek alfa.

### B2.5 Dikey logo
**Kaydet:** `brand/assets/gpt/final/logo_stacked.png` · 1024×1024 · **Şeffaf zemin**

```
The BKE Studio stacked logo lockup (reference image): the symbol centered on top and the wordmark "BKE Studio" centered below it, balanced spacing, the whole lockup about 75% of the canvas. At most two flat colors (anchor and accent) as on the board. No other text. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: harf harf "BKE Studio"; sembol üstte ortada; en çok iki düz renk; gerçek alfa.

### B2.6 Balmumu mühür rozeti (fotoğrafik)
**Kaydet:** `brand/assets/gpt/final/seal_badge.png` · 1024×1024 · **Şeffaf zemin**

```
The BKE Studio symbol (reference image) pressed into a real wax seal: a round wax seal in the anchor color with the symbol crisply embossed in its center, a soft satin sheen, a slightly irregular poured-wax edge. Photographic and tactile, front view, perfectly straight, centered, about 70% of the canvas, generous empty margin. Soft light from the top-left. No cast shadow, no drop shadow, no glow or halo outside the wax. No other text. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: sembol doğru ve okunur (B, K, E sırası); gerçekçi balmumu; gölge ve hâle yok; gerçek alfa.

### B2.7 Desen (dikişsiz)
**Kaydet:** `brand/assets/gpt/final/pattern_tile.png` · 1024×1024

```
A seamless repeating BKE Studio brand pattern made only from the symbol and/or the V-shaped envelope fold lines of the chosen direction (reference image): two flat colors from the palette — the paper neutral as background with the anchor or accent color at low contrast — contemporary, rhythmic and calm. The left and right edges and the top and bottom edges match so it tiles with no visible seams. Flat graphic style; no texture, no gradient, no shadow, no text other than the symbol's own letter shapes.
```
Kontrol: 2×2 yan yana koyunca dikiş görünmüyor; iki düz renk; sakin; sembol dışında yazı yok.

### B2.8 Dükkân / profil ikonu
**Kaydet:** `brand/assets/gpt/final/shop_icon.png` · 1024×1024

```
A shop and social profile icon for BKE Studio: the symbol (reference image) in the paper-neutral color, centered on a solid flat square of the anchor color. Everything stays inside a central circle whose diameter is 70% of the canvas, because platforms crop the icon to a circle. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D; no other text.
```
Kontrol: daire kırpımında sembol tam; tek düz zemin; sembol dışında yazı yok.

### B2.9 Geniş marka sahnesi (fotoğraf; banner ve satış sitesi)
**Kaydet:** `brand/assets/gpt/final/brand_scene_wide.png` · 1536×1024

```
A photographic styled flat lay for the BKE Studio brand, seen from directly above, in the chosen direction's palette (reference image): on the left third, a plain modern smartphone with no brand logo, its screen showing only a closed envelope sealed with the symbol; next to it a real paper envelope closed with a wax seal of the symbol in the anchor color; a ribbon in the accent color and a few loose petals or a small green sprig in muted tones. Soft natural daylight from the top-left with soft, natural shadows. The right 45% of the image is calm, empty paper surface for headline text. Keep everything important inside the middle band between 30% and 70% of the image height, because it will be cropped to a wide 4:1 banner. No text, no words, no other logos, nothing that resembles a real brand.
```
Kontrol: yazı yok; telefonda marka logosu yok; sağ %45 boş ve sakin; önemli öğeler orta bantta (yükseklik %30–70); 4:1 kırpımda zarf ve mühür tam.

### B2.10 Son marka panosu
**Kaydet:** `brand/assets/gpt/final/brand_board_final.png` · 1536×1024

```
The final BKE Studio brand board for the chosen direction (reference image), refined: the horizontal logo large at the top left; below it the symbol in a circular avatar and at favicon size; a row of five large, perfectly flat square color swatches with no texture and no labels, in this order from left to right: anchor, accent, paper neutral, near-black, secondary; a strip of the brand pattern; the wax seal badge. Warm paper background, generous white space. The only text anywhere is "BKE Studio": no labels, no color codes, no other words.
```
Kontrol: harf harf "BKE Studio"; renk kartları düz, etiketsiz ve doğru sırada; B2 dosyalarıyla aynı sembol ve renkler.

---

## B3 — Sembolde K yerine S (GM08, kullanıcı isteği 2026-10-16)

Kullanıcı: "BKE Studio logosunu değiştireceğiz. Logoda K yerine S harfi olacak." Yalnız **sembol** değişir; "BKE Studio" yazısı,
renkler ve "The Reveal" fikri (harfin bir ucu zarf kapağı gibi kalkar, arkasından altın şerit görünür) aynı kalır.
**Her prompt'ta referans olarak iki görsel ver:** `brand/assets/gpt/final/logo_horizontal.png` ve `brand/assets/gpt/final/monogram.png`.
Eski dosyaların üstüne yazma; yeni dosyalar `brand/assets/gpt/final_s/` altına. Bitince commit + push: `GM08: S sembolü`.

### B3.1 Sembol (S)
**Kaydet:** `brand/assets/gpt/final_s/monogram_s.png` · 1024×1024 · **Şeffaf zemin**

```
Redraw the BKE Studio symbol from the reference images with one change: the letter inside the square is a capital S instead of a K. Keep everything else identical to the reference symbol: the same solid square in the deep aubergine anchor color (#2B1526), the same proportions and margins, a bold geometric capital S cut out of the square as clean negative space (white in the reference), the same heavy stroke weight as the reference K. Keep the "Reveal" idea: the upper-right end of the S lifts away like an envelope flap opening, with a thin straight cut line, revealing a narrow wedge of flat champagne-gold (#D0AE6A) behind it, at the same angle and size as the gold wedge in the reference. The S must read instantly as an S at small sizes. Centered, filling about 70% of the canvas. No other letters and no text. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: harf açıkça **S**; kare, oran ve kalınlık eski sembolle aynı; altın kama var ve düz renk; gerçek alfa; başka yazı yok.

### B3.2 Küçük boy sembol (favicon)
**Kaydet:** `brand/assets/gpt/final_s/monogram_small_s.png` · 1024×1024 · **Şeffaf zemin**

```
A simplified version of the new S symbol (use the B3.1 result as the main reference), designed to read at 16 to 32 pixels as a browser favicon: the same square and the same capital S cut out, but thicker strokes, a wider flap gap and a larger gold wedge, no thin hairlines and no small gaps. Anchor color #2B1526 and flat gold #D0AE6A only. Centered, filling about 80% of the canvas. No other text. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: 32 px'e küçültünce S okunuyor; ince çizgi yok; iki düz renk; gerçek alfa.

### B3.3 Yatay logo (S)
**Kaydet:** `brand/assets/gpt/final_s/logo_horizontal_s.png` · 1536×1024 · **Şeffaf zemin**

```
The BKE Studio horizontal logo lockup exactly as in the reference logo_horizontal image, with only the symbol on the left replaced by the new S symbol (B3.1 result): the S symbol on the left, then a heavy, tightly spaced "BKE" and a light, widely spaced "Studio" on one line, vertically centered, the same spacing and proportions as the reference, the whole lockup about 85% of the canvas width. The wordmark text stays exactly "BKE Studio", spelled B, K, E, space, S, t, u, d, i, o. Colors: anchor #2B1526 and flat gold #D0AE6A only. No other text. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: sembolde S; yazı harf harf "BKE Studio" (yazıdaki K duruyor); referansla aynı yerleşim; iki düz renk; gerçek alfa.

### B3.4 Dikey logo (S)
**Kaydet:** `brand/assets/gpt/final_s/logo_stacked_s.png` · 1024×1024 · **Şeffaf zemin**

```
The BKE Studio stacked logo lockup with the new S symbol (B3.1 result) centered on top and the wordmark "BKE Studio" (heavy "BKE", light widely spaced "Studio", exactly as in the reference) centered below it, balanced spacing, the whole lockup about 75% of the canvas. Colors: anchor #2B1526 and flat gold #D0AE6A only. No other text. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: sembol üstte ortada ve S; yazı harf harf "BKE Studio"; iki düz renk; gerçek alfa.

### B3.5 Dükkân / profil ikonu (S)
**Kaydet:** `brand/assets/gpt/final_s/shop_icon_s.png` · 1024×1024

```
A shop and social profile icon for BKE Studio: the new S symbol (B3.1 result) in the paper-neutral color (#EDE5D7) with its flat gold wedge (#D0AE6A), centered on a solid flat square of the anchor color (#2B1526). Everything stays inside a central circle whose diameter is 70% of the canvas, because platforms crop the icon to a circle. Flat vector style: crisp edges; no gradient, texture, shadow, glow or 3D; no text.
```
Kontrol: daire kırpımında sembol tam; S okunuyor; tek düz zemin; yazı yok.

### B3.6 Geniş marka sahnesi (S mühür; Etsy banner kaynağı) — GM09
**Kaydet:** `brand/assets/gpt/final_s/brand_scene_wide_s.png` · 1536×1024
**Referans:** `brand/assets/gpt/final/brand_scene_wide_v2.png` (sahne, ışık, düzen) ve `brand/assets/gpt/final_s/monogram_s.png` (yeni sembol).

```
Recreate the reference brand scene photo with one change: every wax seal and every symbol in the scene now shows the new S symbol from the second reference image (a capital S cut out of a square, with the upper-right end lifting like an envelope flap and a thin flat gold wedge behind it), pressed into deep aubergine (#2B1526) sealing wax. Keep everything else the same as the reference scene: a photographic flat lay seen from directly above, a plain modern smartphone with no brand logo on the left third whose screen shows only a closed envelope sealed with the S symbol, a real paper envelope closed with the S wax seal, a champagne-gold ribbon, a few muted petals or a small green sprig, soft natural daylight from the top-left with soft shadows. The right 45% of the image is calm, empty paper surface for a logo. Keep everything important inside the middle band between 30% and 70% of the image height, because it will be cropped to a wide 4:1 banner. No text, no words, no letters other than the S in the seals, no other logos.
```
Kontrol: mühürlerde açıkça **S** (K yok); sağ %45 boş; önemli öğeler orta bantta; yazı yok. Sonra Claude: `brand/etsy/etsy_banner_big_3360x840.jpg` ve mini banner'ı bu sahneden yeniden kırpar + yazı logosu.
