# GPT görsel istekleri — Tasarım 23 · Velvet Jewel Box

> **Instructions for GPT:** This design ("Velvet Jewel Box") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/velvet-jewel-box/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/velvet-jewel-box/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.

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

## Parçalar gelince (Claude) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).
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

## PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).

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

## PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor)

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

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre)

> **Neden yeniden yazıldı (2026-10-20):** website 18–19 Ekim'de fildişi kâğıt + köşe çiçekleri görünümüne geçti; eski baskı prompt'ları eski görünümü (ve artık olmayan PAKET 5 parçalarını) istiyordu. `platform/lib/print/layouts.ts` `'velvet-jewel-box'` bloğunun geçici kaynakları yeniden kurulumda `img/`'den silindi: panel şu an `public/print/velvet-jewel-box/`'deki eski çıktıyı (eski görünüm) basıyor ve `build-print-assets` bu tema için yeniden koşamaz. Bu zeminler gelince:
> Platform her yüz için **tek** zemin kullanır ve onu taşma payıyla `cover` olarak yayar (5×7 ve A5 aynı zeminden).
> 1. `layouts.ts` `'velvet-jewel-box'` bloğunda `sources` → bu zeminler (`print/invitation_front.png` + `print/invitation_back.png`), `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Zemin artık **açık fildişi**: `ink` / `accent` koyu tonlara (temanın site metin rengi) alınır; açık mürekkep kalmaz.
> 3. Metin kutuları (`front` / `back`) gerçek görselde ölçülür (G149; süsten ~%2 açıklık), `node --test tests/g149-print-layout.test.ts`.
> 4. `cd platform && node scripts/build-print-assets.ts --theme velvet-jewel-box`; `public/print/velvet-jewel-box/`'deki artık kaynak olmayan eski dosyalar silinir; 5×7 ve A5 örnek PDF'ine göz atılır.
> Ek görsel (her iki yüz için sohbetin başında): `platform/themes/velvet-jewel-box/img/bg_scene-1024.webp`.

#### P6.1 Ön yüz
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_front.png` · 1819×2551 px (300 ppi), opak

```
A full-bleed printable wedding invitation ground for the "Velvet Jewel Box" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same deep plum velvet, antique gold, ivory and dusty mauve roses, elegant gemstone-inspired filigree and softly draped silk, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```
Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1819×2551.

#### P6.2 Arka yüz
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_back.png` · 1819×2551 px (300 ppi), opak

```
The back side of the same "Velvet Jewel Box" invitation (give invitation_front.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1819×2551.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a champagne satin cloth over a dark plum lacquered table and a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a champagne satin cloth over a dark plum lacquered table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a champagne satin cloth over a dark plum lacquered table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a champagne satin cloth over a dark plum lacquered table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a plum velvet sofa with a champagne satin cushion and a porcelain teacup; a small arrangement of a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 23`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a champagne satin cloth over a dark plum lacquered table, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a champagne satin cloth over a dark plum lacquered table, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a champagne satin cloth over a dark plum lacquered table, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a champagne satin cloth over a dark plum lacquered table: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a champagne satin cloth over a dark plum lacquered table: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a champagne satin cloth over a dark plum lacquered table, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a champagne satin cloth over a dark plum lacquered table, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a champagne satin cloth over a dark plum lacquered table: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
