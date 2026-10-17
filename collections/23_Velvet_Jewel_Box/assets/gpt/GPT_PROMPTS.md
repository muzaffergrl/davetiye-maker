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
# site.css'teki /* stage:begin … stage:end */ bloğunu (parça yerleri, sahne oranı, kapak/kart yolu, kart penceresi)
# betik manifest'ten kendisi yazar; elle kopya yok. Eklem/menteşe ölçümü tarifin dışına düşerse betik UYARI yazar ve
# tarifin değerine (eklem %63, menteşe eklemin %4,5 üstü) döner → box_closed/box_open'a bakıp SEAM_PCT / HINGE_PCT ver.
cd platform && node --test tests/theme-velvet-jewel-box.test.ts   # CSS = manifest denetimi
PORT=3401 node scripts/theme-check.cjs --theme velvet-jewel-box --stress --compare none --no-video
# PAKET 6: aşağıdaki "PAKET 6 gelince" adımları (layouts.ts değişikliği + G149 ölçümü), sonra:
node scripts/build-print-assets.ts --theme velvet-jewel-box
```
Dosya adları kaynak ölçüsüne bağlı değil (`box_lid-732.webp` …): GPT parçası hangi boyda gelirse gelsin sayfaların ve
baskı düzeninin istediği adlar üretilir. Kuru prova: `python3 tools/gpt_kuru_deneme.py --tema velvet-jewel-box --sekil
collections/23_Velvet_Jewel_Box/assets/gpt/kuru_sekil.json` (deneme görselleriyle, repoya dokunmaz).

---

## PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)

Yedi parça (W2.1–W2.7). Tek görselde tek nesne, düşen gölge yok, ışık sol üstten, şeffaflar gerçek alfa. **W2.1 kapalı kutu, W2.2 fiyonk ve
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
The small invitation card that rises out of the velvet ring box, alone: a thick ivory cotton card (#F8EDE0) with a fine rose-gold foil edge, landscape, about 2:1 wider than tall, filling about 90% of the image width, centered (it is scaled into the box later). On its left third a portrait photo window with softly rounded corners, about 4:5 tall, filled with flat pure green #00FF00 (no texture, no shading). The rest of the card is blank ivory paper (no text). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00, keskin kenarlı; kartın sağ üçte ikisi boş düz kâğıt; ~2:1; tuvalin ~%90 genişliği; gölge yok; alfa.
Site pencereyi şeffaf yapar, yerini ölçer (`manifest stage.card.window_pct`) ve fotoğrafı tam oraya koyar; yazı pencerenin sağında.

#### W2.5 Kadife sayfa zemini (kutu sayfası + home)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/bg_page.png` · 1024×1536 · opak

```
A vertical phone-screen background: a close, softly lit expanse of deep aubergine velvet (#1C0B1A to #2A1328) with a few long, gentle folds and a very soft pool of warm light slightly below the center, the velvet pile catching faint plum highlights. Darker toward the edges. The whole central area stays calm and even (no object, no box, no jewelry, no text) so light ivory text reads on it. Photorealistic, same light as the box.
```
Kontrol: orta sakin ve koyu; kıvrımlar yalnız hafif; nesne yok; yazı yok.

#### W2.6 Şampanya saten zemin (açık bölümler)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/satin_bg.png` · 1536×1024 · opak

```
A wide background of smooth champagne satin (#E8D3B0 to #F3E4C8) with soft, wide, flowing diagonal folds and a gentle sheen from the top-left, very low contrast so dark plum text reads on any part of it. Edge to edge, no object, no ribbon ends, no pearls, no text. Photorealistic.
```
Kontrol: düşük kontrast; her yerinde koyu yazı okunur; nesne yok; kenara kadar saten.

> **Ertelendi (üretme):** inci dizisi ayırıcı, tek inci accent, alyanslar ve vitrin altlığı ilk sürümde istenmişti ama
> hiçbir sayfa onları kullanmıyor (G167 denetimi) — boşa üretim olmasın diye listeden çıkarıldı. Tema onlara yer
> açarsa (ör. karuselin altına altlık) prompt'ları buraya yeniden eklenir.

#### W2.7 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal product photograph: the closed aubergine velvet ring box from box_closed.png with its champagne satin bow and pearl (closure.png) resting on a draped champagne satin cloth, a loose strand of ivory pearls curling beside it, soft studio light from the top-left on an aubergine velvet backdrop. The box sits slightly below the center. The center-top area is calm velvet. This image is also cropped to 1200×630 for link previews: keep the box and bow completely visible with at least 5% empty margin below them, and keep the top 20% to velvet only. Photorealistic. No text, letters, numbers, logos or watermarks.
```
Kontrol: kutu + fiyonk altta tam görünür; üst %20 yalnız kadife; yazı yok.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin)

Bütün fotoğraflar **aynı kurgu çift** (her prompt aynı tarifi taşır: Isabelle uzun koyu kahve saç, alçak topuz, buğday
ten; Julian kısa koyu sarı saç, kısa düzgün sakal, açık ten), gerçek ya da ünlü birine benzemeyen; aynı renk düzeni
(aubergine, champagne, ivory), hafif film greni. Yazı, logo, tabela yok. Sitedeki yerleri: `hero_portrait` = kutudan
çıkan kartın penceresi + home portresi; `story_1..3` = Story karuseli; `venue` = Details. Dosya adları `theme.json`
foto anahtarlarıyla aynı (theme-check / seed bu klasörden okur).

#### 2.1 Ana portre
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes. An elegant New York townhouse salon with aubergine velvet curtains and warm candlelight: Julian in a midnight-blue tuxedo, Isabelle in an ivory satin gown with a single strand of pearls, standing close and smiling, three-quarter length, both faces in the upper third and centered (the photo is also shown small, cropped to the faces). Aubergine, champagne and ivory palette, subtle film grain. No text, no logos, no frame.
```

#### 2.2 Story 1 — "Our first dinner"
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic candid photo, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes — the same two people as in the portrait. A small candlelit restaurant table for two, laughing over a shared dessert, a rain-streaked window behind them with soft out-of-focus city lights. Smart evening clothes (no wedding attire). Aubergine, champagne and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 2.3 Story 2 — "A little velvet box"
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic photo, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes — the same two people as in the portrait. The moment of the proposal in a quiet park under a black umbrella at dusk: Julian holds an open aubergine velvet ring box, Isabelle covers her mouth in happy surprise; the ring is a small glint, not the focus; both faces visible. Aubergine, champagne and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 2.4 Story 3 — "Yours, forever"
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic close-up, vertical 4:5: the hands of the same fictional couple, Isabelle and Julian (her warm olive skin, his fair skin), intertwined on champagne satin, her engagement ring and a strand of ivory pearls, soft window light. Only hands, no faces. Not resembling any real or famous person. Aubergine, champagne and ivory palette, subtle film grain. No text, no engraving, no logos.
```

#### 2.5 Mekân
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/venue.jpg` · Yatay (1536×864, 16:9)

```
Photorealistic landscape 16:9: a grand fictional New York townhouse ballroom prepared for a wedding dinner: aubergine velvet chairs, champagne satin table linens, tall candles and ivory flowers, crystal chandeliers, warm evening light. No people, no signs, no text, no logos, no recognisable real venue. Aubergine, champagne and ivory palette, subtle film grain.
```

---

## PAKET 6 — Basılı davetiye zeminleri (G139; ön + arka, 5×7 ve A5 için tek çift, 300 ppi)

> **Şu an:** panelden indirilen basılı davetiye geçici **composed** düzende: kadife sayfa zemini (`img/bg_velvet`) +
> saten fiyonk (`img/closure`), `platform/lib/print/layouts.ts` `'velvet-jewel-box'`. Metin kutuları (kırpım çizgisinin
> yüzdesi; üst, sağ, alt, sol): **ön `[27, 13, 14, 13]`**, **arka `[12, 12, 22, 12]`**. Aşağıdaki zeminler bu kutuları boş
> bırakacak şekilde istendi. Tek çift iki boya da yeter: A5 (154×216 mm, taşma dahil) ve 5×7 (5,25×7,25 in, taşma dahil)
> oranları %1,5 içinde aynı; zemin sayfayı `cover` ile doldurur (5×7'de üstten/alttan ~%0,8 kırpılır).
>
> **PAKET 6 gelince (Claude) — `layouts.ts` `'velvet-jewel-box'` bloğunda:**
> 1. `sources` → `{ front: 'print/invitation_front.png', back: 'print/invitation_back.png' }` (fiyonk ve kadife kaynakları çıkar),
> 2. `composed.front` → `{ bg: cover('front'), images: [] }`, `composed.back` → `{ bg: cover('back'), images: [] }`,
> 3. `node scripts/build-print-assets.ts --theme velvet-jewel-box`, sonra `node --test tests/g149-print-layout.test.ts`:
>    G149 metin kutularını gerçek sanatta ölçer — fiyonk/çerçeve kutuya giriyorsa `front`/`back` kutusu (ve gerekirse
>    `bands`) GPT'nin çizdiğine göre yeniden ölçülür; kutu sanattan sonra gelir, tersi değil.
> 4. Tema testi (`tests/theme-velvet-jewel-box.test.ts`) yalnız kaynakların var olduğunu denetler; değişiklik gerekmez.

#### P6.1 Ön yüz
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_front.png` · 1819×2551 px (300 ppi), opak

```
A flat printed wedding invitation ground, front side, seen straight on, portrait, edge to edge (it is trimmed later; keep everything important at least 4% inside every edge): rich aubergine velvet-look paper (#2A1328 to #1C0B1A) with a subtle velvet texture, a thin rose-gold foil hairline frame inset about 5% from every edge, and at the top centre a champagne satin ribbon bow with a single ivory pearl at its knot (the same bow as closure.png), lying entirely between 5% and 22% of the image height. The whole area from 25% to 90% of the height and from 11% to 89% of the width is EMPTY, even velvet paper (no ornament, no sparkle, no fold, no light spot) for light champagne text. Soft light from the top-left. Print quality, sharp details at 1819 × 2551 px. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: fiyonk + inci üst %5–22 içinde; %25–90 yükseklik × %11–89 genişlik tamamen boş ve düz; çerçeve ince, kenardan ~%5; yazı yok; 1819×2551.

#### P6.2 Arka yüz
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_back.png` · 1819×2551 px (300 ppi), opak

```
The back side of the same invitation (give invitation_front.png as the reference image): the same aubergine velvet-look paper and the same thin rose-gold foil hairline frame inset about 5% from every edge, edge to edge, portrait. Only one small champagne satin bow with a pearl at the bottom centre, lying entirely between 82% and 95% of the image height. The whole area from 10% to 80% of the height and from 11% to 89% of the width is EMPTY, even velvet paper for a schedule and a QR code. Soft light from the top-left. Print quality, 1819 × 2551 px. No text, letters, numbers, logos or watermarks.
```
Kontrol: yalnız altta küçük fiyonk (%82–95); %10–80 yükseklik × %11–89 genişlik boş; ön yüzle aynı kâğıt ve çerçeve; yazı yok.
