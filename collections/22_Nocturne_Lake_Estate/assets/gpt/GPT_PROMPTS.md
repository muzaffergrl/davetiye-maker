# GPT görsel istekleri — Tasarım 22 · Nocturne Lake Estate

> **Instructions for GPT:** Generate the PAKET 5 W2 parts below first, in order and in ONE chat, then PAKET 2 (sample
> photos). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name
> and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image. Give
> `collections/22_Nocturne_Lake_Estate/assets/gpt/envelope.png` (the draft envelope) and `hero.png` as the style
> reference of every part: the same black textured paper, the same champagne-gold wax seal with the olive-twig relief,
> the same Lake Como dusk.

Bu dosya Nocturne'ün **eksik website parçalarının** tek kaynağıdır (G142). Tasarım `tools/katalog.py`'de kayıtlı değil;
bu yüzden dosya elle yazıldı (katalog kaydı açılırsa oradan yeniden üretilir). Taslağın üç PNG'si (`envelope.png`,
`hero.png`, `couple.png`; prompt'ları `PROMPTS.md`) şu an temada **geçici** olarak kullanılıyor: zarf tek kapalı görsel
olduğu için `platform/themes/nocturne-lake-estate/build_images.py` kapak, cep, mühür, iç kapak (aynalanmış kapak) ve kart
kâğıdını o tek görselden kesiyor. K23 / AGENTS şart 4 için asıl parçalar aşağıdakiler; gelince `build_images.py` bunlara
geçer (docs/11 §5.1, §7.3 kapak tipi).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/22_Nocturne_Lake_Estate/assets/gpt/` altındaki `parts/`
  (Paket 5 W2) ve `photos/` (Paket 2). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Stil ve renk
- Teknik: **photorealistic luxury stationery** (gerçek kâğıt, gerçek mum), siyah-beyaz değil: sıcak şampanya altını
- Renkler: night `#11120F` · charcoal `#1C1D15` · champagne `#E0C7A4` · gold `#C7A978` · ivory `#F1E4CC`
- Işık: yumuşak, sol üstten; bütün parçalarda aynı
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)

Tek görselde tek nesne, düşen gölge yok, ışık sol üstten, şeffaflar gerçek alfa. Kapalı zarf, açık zarf ve mühür
**aynı tuvalde, aynı konumda** çizilir (birbirinin üstüne konunca gövde çakışmalı).

#### W2.1 Kapalı zarf — mühür OLMADAN
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/envelope_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The same premium black textured paper envelope as envelope.png, alone and closed, WITHOUT the gold wax seal: nearly black charcoal paper with a fine visible grain and delicate warm highlights on its edges, about 8:5 wider than tall, with a pointed triangular V flap folded down over the front; the tip of the flap is fully visible (nothing covers it). Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about 88% of the image height and its width about 84% of the image width; the empty upper part of the image is left for the opening and for the card to rise into. The edges where this piece will be cut must read clearly: the free edge of the flap is a crisp line with a slight contact shade on the object itself (not a cast shadow). Only this one object. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters, numbers or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: mühür yok, kapağın ucu açıkta; tek nesne; kesilmemiş; gölge yok; gerçek alfa; kapağın serbest kenarı net çizgi.

#### W2.2 Kapanış elemanı — altın mühür (tek başına)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/closure.png` · 1024×1024 · **Şeffaf zemin**

```
Only the round champagne-gold wax seal with a small abstract olive-twig relief (no letters) from envelope.png, alone, exactly as it sits on the tip of the black envelope's flap, drawn large so it fills about 70% of the square (Claude scales it to the envelope), with the same perspective, material and light and with no envelope behind it. The center of the relief is the same olive twig — no initials, no monogram. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız mühür; harf yok; zarftakiyle aynı görünüm; kareyi ~%70 dolduruyor; gölge yok; alfa.

#### W2.3 Açık zarf — boş
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/envelope_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME black envelope as envelope_closed.png — same size, same position on the canvas, same angle, same material and light (give envelope_closed.png as the reference image) — now open: the V flap folded fully upward above the envelope, its inner side and the inside of the back lined with a deep charcoal paper with a very fine champagne-gold pinstripe, seamless; the front pocket empty. The top edge of the front pocket is a crisp, clearly visible V edge against the liner. No card, nothing inside, no wax seal. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: envelope_closed ile aynı ölçü, konum ve açı (üst üste konunca sol, sağ, alt kenar çakışıyor); içi boş; gölge yok; alfa.

#### W2.4 Zarftan çıkan küçük kart (boş)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small invitation card that comes out of the black envelope, alone: a thick charcoal card (slightly lighter than the envelope) with a thin champagne-gold foil border inset from its edge, landscape, about 2:1 wider than tall, sized to slip into the envelope (about 64% of the envelope's width). On its left third a portrait photo window with softly rounded corners, about 4:5 tall, filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank charcoal paper (no text). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın geri kalanı boş (yazı alanı sağ üçte ikide düz kâğıt); zarfa sığacak genişlikte; alfa.

#### W2.5 Sayfa arka planı (zarf sayfası, telefon)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/bg_page.png` · 1024×1536

```
A vertical phone-screen background for the envelope page: deep night-black textured paper with very soft warm candlelight falling from below the center, a faint distant Lake Como dusk reflection blurred far in the bottom quarter, cypress silhouettes barely visible at the far left and right edges. The whole central area stays calm, dark and empty (no envelope, no card, no text) so light ivory text reads on it. Same light and palette as hero.png.
```
Kontrol: orta sakin ve koyu; dekor yalnız kenarlarda; yazı yok; hero.png ile aynı ışık.

#### W2.6 Süzülen accent 1 — altın zeytin yaprağı
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
A single small olive leaf in brushed champagne gold leaf (the same olive motif as the wax seal's relief), alone, slightly curved, drawn large so it fills about 60% of the square. Front view, centered, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG.
```
Kontrol: tek yaprak; altın; gölge yok; alfa (açılışta kartın çevresinden süzülen 2 yaprak — `MOTION.accents.open`).

#### W2.7 Küçük ayırıcı — altın zeytin dalı
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A thin horizontal divider: one slender olive twig in brushed champagne gold leaf lying flat, about 70% of the image width, very fine and delicate, centered. Soft light from the top-left. No cast shadow, no glow. No text. True transparent background PNG.
```
Kontrol: ince, yatay; altın; gölge yok; alfa (başlık altları).

#### W2.8 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal version of the same design: the Lake Como terrace at blue-black dusk from hero.png (tiny lights across the water, mountain silhouettes, a stone balustrade with ivory taper candles), and the closed black envelope with its champagne-gold wax seal resting on the balustrade slightly below the center. The center-top area is calm night sky. This image is also cropped to 1200×630 for link previews: keep the envelope with its seal completely visible with at least 5% empty margin below it, and keep the top 20% to sky only. Photorealistic, same light and palette as hero.png. No text, no letters.
```
Kontrol: zarf + mühür altta tam görünür; üst %20 yalnız gökyüzü; yazı yok.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin)

#### 2.1 Ana portre
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties on a Lake Como villa terrace at blue hour: groom in a tailored black tuxedo, bride in a minimal ivory silk gown, close and smiling, three-quarter length, faces in the upper third. Distant lake lights, cypresses, warm candlelight. Black, olive and champagne palette, subtle film grain. No text, no frame.
```

#### 2.2 Galeri 1 — "A quiet moment, just us"
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5, a quiet candid moment on the villa's stone steps at dusk, foreheads touching, candle lanterns along the steps, lake in soft focus behind. Photorealistic, same palette and grain. No text.
```

#### 2.3 Galeri 2 — "Where the mountains meet the water"
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_2.jpg` · Yatay (1536×1152, 4:3)

```
Landscape 4:3: the same couple small in the frame on a wooden lake jetty at dusk, the mountains and the water's lights wide around them. Photorealistic, same palette and grain. No text.
```

#### 2.4 Galeri 3 — "An evening we will always remember"
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_3.jpg` · Yatay (1536×1152, 4:3)

```
Landscape 4:3: a long candlelit dinner table on the lake terrace at night, ivory roses and champagne glasses, guests as soft silhouettes, the couple laughing at the head of the table. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/venue.jpg` · Yatay (1536×864, 16:9)

```
Landscape 16:9: an elegant lakeside villa with a stone balustrade terrace and cypress trees, seen from the water at dusk, warm windows and candle lights, mountains behind. No people, no signs, no text. Photorealistic, same palette.
```

---

## G139 — Basılı davetiye parçaları (yeni; şu an göl manzarası + mühürle geçici düzen)

> Görev `G139`. Panelden indirilen 5×7 in / A5 basılı davetiye bu tasarımın kendi kart parçalarını ister. Şu an
> `hero.png` (ön yüz: göl manzarası, yazı gökyüzünde) ve temanın zarftan kestiği mühür (`env_seal`, arka yüz: gece siyahı
> `#11120F`) ile geçici düzen kuruldu (`platform/lib/print/layouts.ts`, `composed`). İki parça gelince layouts.ts'te
> `composed` yerine `card`/`back` kaynakları (kâğıt: W2.5 `parts/bg_page.png`, `paper: { mode: 'cover' }`) yazılır ve `node scripts/build-print-assets.ts --theme nocturne-lake-estate`
> çalıştırılır. W2.2 `closure.png` gelirse geçici düzendeki mühür de ona geçer.

### P1 — invitation_card (ön yüz)
Kaydet: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/invitation_card.png` — **2048 × 3072 px, PNG, şeffaf arka plan**
```
A flat printed wedding invitation card, front side, seen straight on, portrait 2:3, on a fully transparent background.
Thick premium black textured cotton paper with a fine visible grain, the same nearly black charcoal paper as the
Nocturne Lake Estate envelope (envelope.png), with a crisp straight edge and a soft natural contact shade on the card
itself. A thin champagne-gold foil hairline frame inset from the edge. A slender olive twig in brushed champagne gold
leaf (the same olive motif as the wax seal's relief) at the top centre and a smaller mirrored twig at the bottom
centre. Soft light from the top-left. The whole centre (about 70% of the width, 60% of the height) is EMPTY black
paper for light ivory text. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp details
at 2048 × 3072 px.
```
Kontrol: siyah dokulu kâğıt (zarfla aynı); altın çerçeve ince; orta %70 × %60 boş; yazı yok; gerçek alfa.

### P2 — info_card (arka yüz)
Kaydet: `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/info_card.png` — **2048 × 3072 px, PNG, şeffaf arka plan**
```
The back side of the same black Nocturne Lake Estate wedding invitation card: portrait 2:3 on a fully transparent
background, the same black textured cotton paper, crisp edge, soft contact shade and thin champagne-gold foil hairline
frame. Only one small brushed champagne-gold olive twig centred at the top edge. Everything below the twig is EMPTY
black paper for a schedule and a QR code. No text, letters, numbers, logos or watermarks. Print quality,
2048 × 3072 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; yalnız üstte küçük dal; geri kalanı boş; yazı yok; gerçek alfa.

---

## PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Yazan: G175 (`tools/paket3_sahne.py` şablonu, 01–21 ile aynı). `tools/listing_editorial.py` 3.1, 3.2, 3.4 ve 3.5'i
> kullanır (ilan görselleri 1, 2, 8, 4); 3.3 yedek sahnedir.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a black linen tablecloth over a dark walnut table beside a window at dusk and tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a black linen tablecloth over a dark walnut table beside a window at dusk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a black linen tablecloth over a dark walnut table beside a window at dusk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a black linen tablecloth over a dark walnut table beside a window at dusk, slightly right of center and rotated about 8 degrees, surrounded at the edges by tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a charcoal velvet sofa with a champagne silk cushion and a crystal champagne coupe; a small arrangement of tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.


---

## PAKET 6 — Kullanıcının 27_GPT_IS_LISTESI.html ekindeki baskı zeminleri (2026-10-20)

Bu iki zemin kullanıcı ekinde istenir; mevcut G139 kartları ayrı dosyalardır. Üretim ve kalan QA kayıtları: `docs/qa/2026-10-20-generated-visuals/manifest.json`.

### P6.1 Ön yüz

**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/print/invitation_front.png` · 1819×2551 px · opak PNG · 300 ppi hedef

```
A full-bleed printable wedding invitation ground for the "Nocturne Lake Estate" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same midnight charcoal, champagne gold, ivory garden roses and lake Como cypress foliage, softly reflected moonlight across a distant Italian lake, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: istenen oran; gerçek opak zemin; yazı alanı boş; metin, monogram, logo ve filigran yok. Hedefin altındaki çözünürlük QA kaydında uyarıdır.

### P6.2 Arka yüz

**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/print/invitation_back.png` · 1819×2551 px · opak PNG · 300 ppi hedef

```
The back side of the same "Nocturne Lake Estate" invitation (give invitation_front.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```

Kontrol: istenen oran; gerçek opak zemin; yazı alanı boş; metin, monogram, logo ve filigran yok. Hedefin altındaki çözünürlük QA kaydında uyarıdır.
