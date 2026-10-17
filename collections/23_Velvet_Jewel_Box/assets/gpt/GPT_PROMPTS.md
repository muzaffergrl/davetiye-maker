# GPT görsel istekleri — Tasarım 23 · Velvet Jewel Box

> **Instructions for GPT:** Generate PAKET 5 (W2 website parts) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation grounds). Use each English prompt exactly as written, follow its
> checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers,
> logos, monograms or watermarks in any image. Make W2.1 first and give it as the reference image of every later part:
> the same aubergine velvet, the same champagne satin, the same rose-gold metal, the same light.

Bu dosya Velvet Jewel Box'ın **bütün görsel parçalarının** tek kaynağıdır (G161). Tasarım `tools/katalog.py`
`EK_TEMALAR`'da; bu dosya elle yazıldı. Tema şu an **geçici** parçalarla çalışıyor: `platform/themes/velvet-jewel-box/
build_images.py` başka koleksiyonların GPT dokularını (17 kadife benzeri karo, 14 saten karo, 01 kâğıt, 14 saten fiyonk)
bu paletin tonlarına çevirip düz dikdörtgenlerden bir yer tutucu kutu kuruyor. Aşağıdaki parçalar gelince aynı betik
onlara geçer (kutu açılışı: kapak menteşesinde 90°'ye döner, saten iç kapak devralır — docs/11 §7.1).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/23_Velvet_Jewel_Box/assets/gpt/` altında `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme
  işi verme.

## Stil ve renk
- Teknik: **photorealistic luxury product photography** (gerçek kadife, gerçek saten, gerçek metal), stüdyo ışığı.
- Renkler: night `#1C0B1A` · aubergine `#2A1328` · plum `#4A2142` · champagne `#E8D3B0` · rose gold `#C99A86` · ivory `#F8EDE0`
- Işık: yumuşak, sol üstten; bütün parçalarda aynı. Parçalarda düşen gölge yok (gölgeyi site ekler).
- Klasik, romantik, zengin; gerçek bir markaya (mücevher markaları dahil), kişiye ya da başka bir satıcının tasarımına benzemesin.

## Parçalar gelince (Claude)
```bash
python3 platform/themes/velvet-jewel-box/build_images.py      # parts/ → img/ (+ manifest.json stage ölçüleri)
# site.css'teki /* manifest stage.* */ yüzdeleri ve lid-up / card-rise translateY değerleri manifest'ten güncellenir
cd platform && node --test tests/theme-velvet-jewel-box.test.ts   # CSS = manifest denetimi
node scripts/build-print-assets.ts --theme velvet-jewel-box    # PAKET 6 gelince (layouts.ts kaynakları değişince)
```

---

## PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)

Tek görselde tek nesne, düşen gölge yok, ışık sol üstten, şeffaflar gerçek alfa. **W2.1 kapalı kutu, W2.2 fiyonk ve
W2.3 açık kutu aynı 1024×1536 tuvalde, aynı konumda** çizilir (üst üste konunca kutunun gövdesi çakışmalı). Site kutuyu
kapak/gövde ekleminden ve kapağın arka menteşesinden keser; bu çizgiler net ve yatay olmalı.

#### W2.1 Kapalı kutu — fiyonk OLMADAN
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_closed.png` · 1024×1536 · **Şeffaf zemin**

```
A closed luxury ring box covered in deep aubergine plum velvet (#2A1328 to #4A2142, soft velvet pile with gentle highlights where the light catches it), seen from the front and slightly from above, wider than tall, with a softly rounded lid sitting on the base; a thin rose-gold metal rim runs along the seam where the lid meets the base, as one crisp straight horizontal line across the whole front. Place it exactly where it will sit in box_open.png: horizontally centered, about 72% of the image width, the bottom edge of the base at about 80% of the image height, the lid/base seam at about 63% of the image height, the top of the lid at about 50%. The empty upper half of the image is left for the lid to open and the card to rise into. Only this one object, no ribbon, no bow, no jewelry. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek nesne; fiyonk yok; kapak/gövde eklemi net yatay çizgi (rose gold kenar); ölçü ve konum tarife yakın; gölge yok; gerçek alfa.

#### W2.2 Kapanış elemanı — saten fiyonk (tek başına, aynı tuvalde)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/closure.png` · 1024×1536 · **Şeffaf zemin**

```
Only a champagne satin ribbon bow (#E8D3B0, glossy satin with soft folds and two short tails) with a single small round ivory pearl at its knot, alone, drawn exactly where it sits on the front of the lid of box_closed.png — same canvas, same scale and perspective (give box_closed.png as the reference image): centered horizontally on the front of the lid, about 23% of the image width, its knot at about 57% of the image height. The ribbon does NOT wrap around the box: it is a bow resting on the lid's front. Without the box behind it. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız fiyonk + inci; kutu yok; box_closed üstüne konunca kapağın önünde, ortada; kuyruklar gövdeye taşmıyor; gölge yok; alfa.

#### W2.3 Açık kutu — boş
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME aubergine velvet ring box as box_closed.png — same size, same position on the canvas, same angle, same material and light (give box_closed.png as the reference image) — now open: the lid has swung up and back on its rear hinge and stands upright above the base, showing its inside lined with smooth champagne satin (#E8D3B0) gathered in soft radiant folds toward the center; the inside of the base holds a plump champagne satin cushion with a single empty horizontal slit across its middle (no ring in it). The base's velvet front is exactly the same as in box_closed.png, and the line where the satin cushion meets the lid's satin lining at the back hinge is a clear straight horizontal line. Nothing inside, no ring, no card, no bow. Front view, perfectly straight, not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: box_closed ile aynı ölçü, konum, açı (gövdenin önü birebir çakışıyor); kapak dik, içi saten; yastık boş; menteşe çizgisi net; gölge yok; alfa.

#### W2.4 Kutudan yükselen küçük kart (boş)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
The small invitation card that rises out of the velvet ring box, alone: a thick ivory cotton card (#F8EDE0) with a fine rose-gold foil edge, landscape, about 2:1 wider than tall, sized to fit inside the box (about 60% of the box's width). On its left third a portrait photo window with softly rounded corners, about 4:5 tall, filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank ivory paper (no text). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00; kartın sağ üçte ikisi boş düz kâğıt; ~2:1; gölge yok; alfa.

#### W2.5 Kadife sayfa zemini (kutu sayfası + home)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/bg_page.png` · 1024×1536

```
A vertical phone-screen background: a close, softly lit expanse of deep aubergine velvet (#1C0B1A to #2A1328) with a few long, gentle folds and a very soft pool of warm light slightly below the center, the velvet pile catching faint plum highlights. Darker toward the edges. The whole central area stays calm and even (no object, no box, no jewelry, no text) so light ivory text reads on it. Photorealistic, same light as the box.
```
Kontrol: orta sakin ve koyu; kıvrımlar yalnız hafif; nesne yok; yazı yok.

#### W2.6 Şampanya saten zemin (açık bölümler)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/satin_bg.png` · 1536×1024

```
A wide background of smooth champagne satin (#E8D3B0 to #F3E4C8) with soft, wide, flowing diagonal folds and a gentle sheen from the top-left, very low contrast so dark plum text reads on any part of it. Edge to edge, no object, no ribbon ends, no pearls, no text. Photorealistic.
```
Kontrol: düşük kontrast; her yerinde koyu yazı okunur; nesne yok; kenara kadar saten.

#### W2.7 İnce ayırıcı — inci dizisi
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/divider.png` · 1536×1024 · **Şeffaf zemin**

```
A thin horizontal divider: one short straight strand of small round ivory pearls with a tiny rose-gold clasp in the middle, lying flat, about 60% of the image width, centered. Soft light from the top-left. No cast shadow, no glow. No text. True transparent background PNG.
```
Kontrol: ince ve yatay; inci + rose gold; gölge yok; alfa (başlık altları için; tema henüz kullanmıyor, gelince eklenir).

#### W2.8 Accent — tek inci
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
A single round ivory pearl with a soft pink-champagne lustre, alone, filling about 50% of the square. Front view, centered, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG.
```
Kontrol: tek inci; gölge yok; alfa (açılış/gönderim parçacığı için; tema henüz kullanmıyor).

#### W2.9 Dekor — alyanslar
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/rings.png` · 1024×1024 · **Şeffaf zemin**

```
Two wedding rings resting together, one in rose gold and one in yellow gold with a small solitaire, slightly overlapping, drawn large so they fill about 60% of the square. Front view, centered, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow. No text, no engraving. True transparent background PNG.
```
Kontrol: iki yüzük; yazı/gravür yok; gölge yok; alfa (RSVP kapanışı / altbilgi için; tema henüz kullanmıyor).

#### W2.10 Vitrin altlığı (Story karuseli)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/plinth.png` · 1536×1024 · **Şeffaf zemin**

```
An empty round jewelry display turntable covered in aubergine velvet with a thin rose-gold rim, seen from the front and slightly from above (an ellipse about 85% of the image width and 25% of its height), placed in the lower part of the image. Nothing on it. Soft light from the top-left. No cast shadow, no glow. No text. True transparent background PNG.
```
Kontrol: boş altlık; elips geniş ve basık; gölge yok; alfa (döner vitrinin altına; tema henüz kullanmıyor).

#### W2.11 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/web_hero.png` · 1536×1024

```
Wide horizontal product photograph: the closed aubergine velvet ring box from box_closed.png with its champagne satin bow and pearl (closure.png) resting on a draped champagne satin cloth, a loose strand of ivory pearls curling beside it, soft studio light from the top-left on an aubergine velvet backdrop. The box sits slightly below the center. The center-top area is calm velvet. This image is also cropped to 1200×630 for link previews: keep the box and bow completely visible with at least 5% empty margin below them, and keep the top 20% to velvet only. Photorealistic. No text, no letters.
```
Kontrol: kutu + fiyonk altta tam görünür; üst %20 yalnız kadife; yazı yok.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin)

Bütün fotoğraflar aynı kurgu çift (gerçek ya da ünlü birine benzemeyen, otuzlu yaşların başında iki kişi), aynı
renk düzeni (aubergine, champagne, ivory), hafif film greni. Yazı, logo, tabela yok.

#### 2.1 Ana portre
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties who do not resemble any real or famous person, in an elegant New York townhouse salon with aubergine velvet curtains and warm candlelight: groom in a midnight tuxedo, bride in an ivory satin gown with a single strand of pearls, close and smiling, three-quarter length, faces in the upper third. Aubergine, champagne and ivory palette, subtle film grain. No text, no frame.
```

#### 2.2 Story 1 — "Our first dinner"
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5, a candid moment at a small candlelit restaurant table for two, laughing, a shared dessert, rain-streaked window behind them with soft city lights. Photorealistic, same palette and grain. No text, no signs.
```

#### 2.3 Story 2 — "A little velvet box"
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
Vertical 4:5: the same fictional couple at the moment of the proposal in a quiet park under an umbrella at dusk, he holds an open aubergine velvet ring box, she covers her mouth in happy surprise; the ring is a small glint, not the focus. Photorealistic, same palette and grain. No text.
```

#### 2.4 Story 3 — "Yours, forever"
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Vertical 4:5 close-up: the couple's hands intertwined on champagne satin, her engagement ring and a strand of pearls, soft window light. Only hands, no faces. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/venue.jpg` · Yatay (1536×864, 16:9)

```
Landscape 16:9: a grand fictional New York townhouse ballroom prepared for a wedding dinner: aubergine velvet chairs, champagne satin table linens, tall candles and ivory flowers, crystal chandeliers, warm evening light. No people, no signs, no text, no recognisable real venue. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka, 5×7 ve A5, 300 ppi)

> Panelden indirilen basılı davetiye şu an geçici **composed** düzende: kadife sayfa zemini (`img/bg_velvet`) + saten fiyonk
> (`img/closure`), `platform/lib/print/layouts.ts` `'velvet-jewel-box'`. Zeminler gelince layouts.ts'te `sources` bu
> dosyalara çevrilir (`front`/`back` bg = `cover('front')` / `cover('back')`, fiyonk görseli kaldırılır; metin kutuları
> aynı kalır: ön yüzde üst %27 süse ayrılır, arka yüzde alt %22) ve `node scripts/build-print-assets.ts --theme
> velvet-jewel-box` çalıştırılır. Ölçüler taşma payı (bleed) dahildir: 5×7 in + 1/8 in her kenarda = 5.25 × 7.25 in;
> A5 148×210 mm + 3 mm her kenarda = 154 × 216 mm. Yazı yok; metin alanları boş kalır.

#### P6.1 Ön yüz 5×7
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 px (300 ppi), opak

```
A flat printed wedding invitation ground, front side, seen straight on, portrait, edge to edge (it is trimmed later; keep everything important 0.25 in inside the edges): rich aubergine velvet-look paper (#2A1328 to #1C0B1A) with a subtle velvet texture, a thin rose-gold foil hairline frame inset about 0.3 in from the trim, and at the top centre a champagne satin ribbon bow with a single ivory pearl at its knot (the same bow as closure.png), occupying the top 20% of the height. Everything below the bow — about 80% of the height and 75% of the width — is EMPTY even velvet paper for light champagne text. Soft light from the top-left. Print quality, sharp details at 1575 × 2175 px. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: üst %20 fiyonk; altı boş ve düz; çerçeve ince; yazı yok; 1575×2175.

#### P6.2 Arka yüz 5×7
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 px (300 ppi), opak

```
The back side of the same invitation: the same aubergine velvet-look paper and the same thin rose-gold foil hairline frame, edge to edge, portrait. Only one small champagne satin bow with a pearl at the bottom centre, occupying the bottom 15% of the height. Everything above it is EMPTY even velvet paper for a schedule and a QR code. Soft light from the top-left. Print quality, 1575 × 2175 px. No text, letters, numbers, logos or watermarks.
```
Kontrol: yalnız altta küçük fiyonk; üstü boş; ön yüzle aynı kâğıt ve çerçeve; yazı yok.

#### P6.3 Ön yüz A5
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_front_a5.png` · 1819×2551 px (300 ppi), opak

```
The same front ground as invitation_front_5x7.png (give it as the reference image), recomposed for an A5 sheet with bleed (154 × 216 mm, portrait): same velvet paper, same rose-gold hairline frame inset about 8 mm from the trim, the same satin bow with pearl in the top 20%, everything below EMPTY. Print quality, 1819 × 2551 px. No text, letters, numbers, logos or watermarks.
```

#### P6.4 Arka yüz A5
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_back_a5.png` · 1819×2551 px (300 ppi), opak

```
The same back ground as invitation_back_5x7.png (give it as the reference image), recomposed for an A5 sheet with bleed (154 × 216 mm, portrait): same paper and frame, one small satin bow with a pearl in the bottom 15%, everything above EMPTY. Print quality, 1819 × 2551 px. No text, letters, numbers, logos or watermarks.
```
Kontrol (P6.3–P6.4): 5×7 sürümüyle aynı görünüm; A5 oranı; yazı yok.
