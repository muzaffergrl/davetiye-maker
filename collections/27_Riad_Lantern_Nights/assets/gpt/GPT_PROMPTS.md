# GPT görsel istekleri — Tasarım 27 · Riad Lantern Nights

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos of the fictional couple), then PAKET 6 (printable invitation grounds). Use each English prompt exactly as
> written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text,
> letters, numbers, logos, monograms, signatures or watermarks in any image. Make W2.1 `doors_closed.png` first and give
> it as the style reference of every later part: the same carved cedar, the same brass, the same teal / saffron palette,
> the same light.

Bu dosya tasarım 27'nin **bütün görsel parçalarının** tek kaynağıdır (G165). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
(eksenler + hareket imzası) kayıtlı, üreteçlere girmediği için dosya elle yazıldı. Tema (`platform/themes/riad-lantern-nights/`)
bu parçalar gelmeden kuruldu: `build_images.py` şimdilik repodaki başka GPT görsellerinden **geçici** katmanlar kesiyor
(10'un meşe dokusundan iki kanat, 05'in sıvasından avlu/kart/duvar tonları, 05'in çini bordüründen üç karo; çizim yok, K21).
Aşağıdaki parçalar gelince `build_images.py` bunları keser (bkz. en alttaki "Parçalar gelince") ve tema `live` olmadan önce
göz kontrolünden geçer.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/27_Riad_Lantern_Nights/assets/gpt/` altındaki `parts/`
  (PAKET 5), `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.

## Stil ve renk
- Teknik: **gouache illustration with realistic material texture** — gouache painted look (soft, matte, hand-made) but
  real-feeling cedar grain, glazed tile, hammered brass and lime plaster. Not a photo, not flat vector, not cartoon.
- Renkler: night teal `#0F2F31` · deep `#0A2324` · teal `#174A4B` · saffron `#E3A54A` · brass `#C9A35B` · cedar `#3A2114` ·
  ivory `#F6EAD2` · bougainvillea magenta `#B8326E` (yalnız çiçekte, az).
- Işık: sıcak fener ışığı, **sol üstten** yumuşak; bütün parçalarda aynı. Gece sahnesi ama karanlık değil: sıcak, davetkâr.
- Saygılı ve zarif: gerçek bir riad avlusunun zanaatı (oyma sedir, zellige, tadelakt sıva, pirinç fener). Kostüm ya da
  turistik klişe yok (deve, fes, nazar, çöl, hançer, yazı/kaligrafi yok). 11 Boho Terracotta (kemer zarf, pampas), 06 Art Deco
  (altın gatefold) ve 05 Lemon Mediterranean (mavi-beyaz İtalyan çinisi) gibi görünmesin.
- Gerçek bir kişiye, mekâna, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — website katmanları (YAZI YOK)

Tek görselde tek nesne, düşen gölge yok, ışık sol üstten, şeffaflar gerçek alfa (beyaz ya da dama tahtası değil).
**W2.1 kapılar, W2.2 kapı çerçevesi ve W2.3 avlu aynı 1024×1536 tuvalde, aynı konumda** çizilir: üst üste konunca kapı
kanatları çerçevenin açıklığını tam doldurur, avlu da aynı açıklığın arkasında görünür.

#### W2.1 Kapalı çift kapı (kanatlar)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/doors_closed.png` · 1024×1536 · **Şeffaf zemin**

```
A pair of tall carved cedar double doors of a traditional riad, closed, alone on a transparent background, gouache illustration with realistic wood texture: warm deep cedar brown (#3A2114 to #7A4A2A) with a fine visible grain, each leaf carved with a geometric eight-point star and interlace pattern in shallow relief, a row of round hammered-brass studs along the edges, and one heavy brass ring knocker on each leaf at mid height near the center seam. The two leaves meet in a thin, clearly visible vertical dark seam exactly at the horizontal center of the image (a 4–6 px dark gap from top to bottom, so the leaves can be cut apart there). Together the two leaves form a rectangle about 0.76 as wide as it is tall: horizontally centered, 74% of the image width, its bottom edge at 94% of the image height (the rest of the canvas above is left for the arch of the doorway). Only the two door leaves — no wall, no frame, no arch, no threshold. Front view, perfectly straight and symmetrical, not cropped. Lit like every other part: soft warm lantern light from the top-left. No cast shadow and no drop shadow. No glow, halo, light rays or haze outside the object's outline — the website adds light effects. No text, letters, numbers, calligraphy or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: iki kanat ortada ince koyu dikişle ayrılıyor (Claude `tema_build.dikis_bul` ile keser); kanatların dışında hiçbir şey
yok; oran ~0,76; alt kenar %94; gölge yok; gerçek alfa; yazı/kaligrafi yok.

#### W2.2 Kapı çerçevesi — at nalı kemer (önde sabit durur)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/doorway.png` · 1024×1536 · **Şeffaf zemin**

```
The doorway surround of the same riad door, alone, drawn on exactly the same canvas position as doors_closed.png (give it as the reference image): a horseshoe (Moorish) arch of carved ivory stucco with fine geometric lattice carving above the doors, a carved cedar lintel, and two narrow jambs faced with small teal, saffron and ivory zellige tiles in a simple geometric pattern, standing on a low stone threshold. The opening inside the surround — exactly where the two door leaves sit — is completely EMPTY and TRANSPARENT (real alpha, nothing painted there), so the doors and the courtyard behind show through. The surround's inner edge is a crisp line with a slight contact shade on the stucco itself (not a cast shadow). Gouache illustration with realistic stucco and glazed tile texture. Front view, perfectly straight and symmetrical, not cropped, with empty margin around. Soft warm light from the top-left. No cast shadow, no glow outside its outline. No text, letters, numbers or calligraphy. True transparent background PNG.
```
Kontrol: açıklık tamamen şeffaf ve kapıların dış hattıyla çakışıyor; kemer üstte, çini pervazlar yanlarda; gölge yok; alfa.

#### W2.3 Kapıların ardındaki avlu
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/courtyard.png` · 1024×1536 · opak

```
The view through the open doorway of a riad at night, painted to fill the whole canvas in the same gouache-with-real-texture style: a lantern-lit inner courtyard with a small tiled fountain far back in the center, an orange tree in a planter, zellige floor tiles in teal, saffron and ivory going back in perspective, carved arcades on both sides, magenta bougainvillea climbing a column, and several pierced brass lanterns glowing warm saffron. The area in the middle of the image (where the doorway opening is in doors_closed.png, and where an invitation card will stand) is calm, softly lit and without strong detail. Warm, inviting, romantic; deep teal shadows and saffron light. No people, no text, no letters, no calligraphy.
```
Kontrol: orta bölge sakin (kart oraya gelir); kişi yok; yazı yok; kapı açıklığının arkasında görünecek perspektif.

#### W2.4 Kapıdan çıkan küçük davet kartı (boş)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
A small portrait invitation card, alone: thick warm ivory cotton paper (#F6EAD2) with a fine deckled feel and a thin hand-painted saffron-and-teal zellige border inset from its edge, about 0.7 as wide as it is tall. In its upper half a tall Moroccan horseshoe-arch photo window, about 4:5, filled with flat pure green #00FF00 (no texture, no shading, crisp arch outline). The lower half is blank ivory paper (no text — names and date are added by the website). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Soft warm light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00, at nalı kemer biçimi; alt yarı düz kâğıt; bordür ince; alfa.

#### W2.5 Pirinç fener
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lantern.png` · 1024×1536 · **Şeffaf zemin**

```
A single traditional pierced brass lantern hanging from a short brass chain at the top center, alone: hammered antique brass (#C9A35B) with star-shaped piercings and small saffron and teal glass panes, lit from inside so the panes and the piercings glow warm saffron — the glow stays INSIDE the lantern's outline. The chain starts at the very top edge of the image. Gouache with realistic metal texture. Front view, perfectly straight, not cropped. No cast shadow, no light rays, no halo outside its outline (the website adds the glow). No text. True transparent background PNG.
```
Kontrol: tek fener; ışıma yalnız fenerin içinde; zincir üst kenardan; gölge/hâle yok; alfa.

#### W2.6 Sayfa arka planı (kapı sayfası, telefon)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bg_page.png` · 1024×1536 · opak

```
A vertical phone-screen background: the night-teal tadelakt (polished lime plaster) wall of a riad courtyard (#0F2F31 to #174A4B) with a soft hand-made sheen, very faint magenta bougainvillea sprigs reaching in only at the two top corners, and a low band of teal, saffron and ivory zellige along the very bottom edge (bottom 8% only). The whole central area stays calm, plain teal plaster and empty (no door, no card, no text), so light ivory text reads on it. Gouache with real plaster texture, soft warm light from the top-left.
```
Kontrol: orta sakin; dekor yalnız üst köşeler ve en alt bant; yazı yok.

#### W2.7 Döşenebilir duvar dokusu
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bg_tile.png` · 1024×1024 · opak · **dikişsiz**

```
A seamless, tileable texture of night-teal tadelakt lime plaster (#0F2F31 to #174A4B): soft trowel marks, a gentle polished sheen and tiny mineral speckles, evenly lit with no vignette, no light spot and no pattern that shows when the tile repeats. Edges must match perfectly left-right and top-bottom. No text, no objects.
```
Kontrol: 2×2 yan yana konunca dikiş görünmüyor; ışık lekesi yok.

#### W2.8 – W2.11 Zellige karoları (sırayla dizilen bordür)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tile_1.png`, `tile_2.png`, `tile_3.png`, `tile_4.png` · her biri 512×512 · opak (karo kareyi kenardan kenara doldurur)

```
tile_1: A single square hand-cut zellige tile seen straight from above, filling the whole square edge to edge: a glazed eight-point star in deep teal (#174A4B) on ivory (#F6EAD2) with tiny saffron (#E3A54A) points between the arms; slightly uneven hand-made glaze with a soft sheen, realistic ceramic texture, gouache-like softness. No grout lines around it, no shadow, no text.
tile_2: The same tile family and size: an interlaced geometric rosette in saffron and ivory with a thin teal outline, same glaze, same light. No grout, no shadow, no text.
tile_3: The same family: a small teal and ivory star-and-cross pattern with a brass-colored (#C9A35B) glazed center, same glaze, same light. No grout, no shadow, no text.
tile_4: The same family: a plain deep-teal glazed tile with a slightly crackled hand-made surface (a calm tile between the patterned ones), same light. No grout, no shadow, no text.
```
Kontrol: dört karo aynı aileden (renk, ışık, sır); her biri kareyi tam dolduruyor; yan yana dizilince uyumlu; yazı yok.
(Bunlar home/story/details'teki "çini çini dizilen bordür" hareketinin parçaları — her karo ayrı katman.)

#### W2.12 Kemer pencere çerçevesi (story fotoğrafları)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/frame_arch.png` · 1024×1536 · **Şeffaf zemin**

```
A tall Moroccan window frame, alone: a horseshoe-arch opening framed by carved ivory stucco with fine geometric lattice carving and a slim carved cedar sill at the bottom, about 2:3 tall overall. The window opening is filled with flat pure green #00FF00 (no texture, no shading), its arch outline crisp. Gouache with realistic stucco and wood texture. Front view, perfectly straight, centered and not cropped, with generous empty margin. Soft warm light from the top-left. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```
Kontrol: pencere düz #00FF00, at nalı kemer; çerçeve ince (pencere çerçevenin ~%70'i); alfa. (Claude `mask_arch.png` keser.)

#### W2.13 Yatay çerçeve (mekân fotoğrafı)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A wide carved cedar frame in the same style as frame_arch.png, alone: a slim carved cedar border with small hammered-brass studs at the corners, its opening exactly 16:9 and filled with flat pure green #00FF00 (no texture, no shading). Front view, perfectly straight, centered, not cropped, generous margin. Soft warm light from the top-left. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```
Kontrol: pencere 16:9 düz #00FF00; çerçeve ince; alfa.

#### W2.14 – W2.15 Bougainvillea köşe kümeleri
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bougainvillea_tl.png` ve `bougainvillea_br.png` · 1024×1024 · **Şeffaf zemin**

```
tl: A cascading spray of magenta bougainvillea (#B8326E) with papery bracts, small ivory flowers and dark green leaves, growing in from the top-left corner of the square and trailing down and to the right, gouache with realistic petal texture; the bottom-right half of the square stays empty. No shadow, no glow, no text. True transparent background PNG.
br: The same bougainvillea, mirrored in composition: growing in from the bottom-right corner, reaching up and to the left; the top-left half empty. No shadow, no glow, no text. True transparent background PNG.
```
Kontrol: küme köşeden giriyor, diğer yarı boş; magenta yalnız burada; alfa.

#### W2.16 Ayırıcı
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/divider.png` · 1536×512 · **Şeffaf zemin**

```
A slim horizontal ornament, alone: a fine pierced brass filigree line with a small eight-point star at its center, about 10 times wider than tall, centered. Realistic hammered brass, soft warm light from the top-left. No shadow, no glow, no text. True transparent background PNG.
```
Kontrol: ince, yatay, ortalı; alfa.

#### W2.17 Süzülen accent — tek bougainvillea yaprağı (braktesi)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
A single papery magenta bougainvillea bract, alone, slightly curled, filling about 60% of the square. Gouache with realistic petal texture. Front view, centered, not cropped. No shadow, no glow, no text. True transparent background PNG.
```
Kontrol: tek yaprak; alfa (RSVP gönderiminden sonra kapanışta 3 yaprak süzülür — isteğe bağlı).

#### W2.18 Paylaşım görseli kaynağı
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
A wide scene for a link-preview image: the closed carved cedar double doors from doors_closed.png standing in their stucco horseshoe-arch doorway in a night-teal tadelakt wall, a lit pierced brass lantern hanging to the upper left of the arch, a soft warm saffron light on the wall around the door, and a little magenta bougainvillea at the right edge. The doorway sits in the lower-middle of the image and is fully visible; the top 20% of the image is calm wall with nothing important. Same gouache-with-real-texture style and palette. No people, no text, no letters, no calligraphy.
```
Kontrol: kapı alt-ortada tam görünüyor; üst %20 sakin; yazı yok. (`tema_build.og_kirp(hiza="alt")` → `og-1200x630.jpg`.)

---

## PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian)

Demo içeriği (`content.demo.json`): **Leila & Adrian**, *The Saffron Courtyard Riad*, Marrakech, October 9, 2027. Kurgu
kişiler: **gerçek bir kişiye (ünlü dahil) benzemesin**; yüzler doğal, yaşları 28–34; tek bir kurgu çift beş fotoğrafta da aynı
kişiler. Leila: koyu dalgalı omuz boyu saç, sıcak zeytin teni, sade fildişi ipek gece elbisesi (gelinlik değil, sade).
Adrian: kısa açık kahve saç, açık ten, lacivert takım, kravatsız açık yaka. Kostüm, yerel kıyafet taklidi, klişe yok.
Fotoğraf gerçekçi (PAKET 5'in gouache'ı değil), sıcak fener ışığı, sinematik ama doğal. Yazı, logo, filigran yok.

#### 2.1 Portre (davet kartı ve home)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/hero_portrait.jpg` · 1024×1280 (4:5)

```
A warm, natural portrait photograph of a fictional couple in their early thirties (they must not resemble any real person): she has shoulder-length dark wavy hair and wears a simple ivory silk evening dress, he has short light-brown hair and wears a navy suit with an open collar. They stand close, smiling softly, framed from the waist up, in a riad courtyard at blue hour, lit by warm pierced brass lanterns; teal tiled walls and a little magenta bougainvillea softly out of focus behind them. Faces in the upper middle of the frame. Photorealistic, natural skin, no heavy retouching. No text, no logo, no watermark.
```

#### 2.2 Story 1 — "Our first evening" (uzun pencere)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_1.jpg` · 1024×1536 (2:3)

```
The same fictional couple (same faces, hair and clothes) sharing mint tea at a small mosaic table on a lantern-lit riad terrace in the evening, laughing, seen from a little distance; warm saffron lantern light, teal shadows. Vertical photo, the couple in the middle third. Photorealistic. No text, no watermark.
```

#### 2.3 Story 2 — "Among the lanterns"
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_2.jpg` · 1024×1536 (2:3)

```
The same fictional couple walking hand in hand under many hanging pierced brass lanterns in a quiet covered passage at night, warm light patterns falling on the walls, seen from behind at a three-quarter angle so their faces are only partly visible. Vertical photo. Photorealistic. No shop signs, no text, no watermark.
```

#### 2.4 Story 3 — "Yes, under the stars"
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_3.jpg` · 1024×1536 (2:3)

```
A close photograph of the same fictional couple's joined hands with a simple gold engagement ring, resting on a teal and ivory zellige tabletop beside a small lit brass lantern and a few magenta bougainvillea bracts, night, shallow depth of field. Vertical photo. Photorealistic. No text, no watermark.
```

#### 2.5 Mekân — "The Saffron Courtyard Riad" (kurgu)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/venue.jpg` · 1536×864 (16:9)

```
A wide photograph of a fictional riad courtyard set for an evening wedding: a central tiled fountain, an orange tree, low cedar tables with ivory linen and candles, carved stucco arcades, teal and saffron zellige, many lit brass lanterns hanging overhead and bougainvillea on the columns, at blue hour. It must not reproduce any real, identifiable hotel or riad. No people, no text, no signs, no watermark.
```

Kontrol (PAKET 2): beş fotoğrafta aynı kurgu çift; gerçek kişiye benzemiyor; yazı yok; oranlar doğru (`python3 tools/kit_check.py collections/27_Riad_Lantern_Nights --paket 2`).

---

## PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK)

Yazı (isimler, tarih, mekân, program) website'in metin katmanı gibi baskı sayfasına sonradan konur (`lib/print/layouts.ts`).
Ön yüzün ortası ve arka yüzün ortası düz kâğıt kalır. Kenar payı (bleed) için zemin kenara kadar uzanır; önemli dekor
kenardan en az %6 içeride.

#### 6.1 Ön yüz 5×7
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_front_5x7.png` · 1500×2100 · opak

```
A printable invitation front, 5×7 inches portrait at 300 ppi, no text: warm ivory lime-plaster paper (#F6EAD2) with a fine hand-made texture; at the top a small carved horseshoe arch motif in ivory stucco framing a lit brass lantern, and along the top and bottom edges a narrow band of teal, saffron and ivory zellige tiles; a few magenta bougainvillea bracts at the top-right corner. The whole central 60% of the sheet is plain, calm ivory paper for the names, date and venue. Gouache with realistic texture, soft warm light. No text, no letters, no numbers, no calligraphy.
```

#### 6.2 Arka yüz 5×7
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_back_5x7.png` · 1500×2100 · opak

```
The matching back of the same invitation, 5×7 inches portrait at 300 ppi, no text: the same ivory lime-plaster paper with a single narrow band of the same zellige tiles along the top edge and a small brass eight-point star centered just under it; everything else plain ivory paper for the schedule and details. Same style and light. No text, no letters, no numbers.
```

#### 6.3 Ön yüz A5
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_front_a5.png` · 1748×2480 · opak

```
The same invitation front as print_front_5x7.png, recomposed for A5 portrait (148 × 210 mm) at 300 ppi — same arch and lantern at the top, the same zellige bands at the top and bottom edges, the same bougainvillea, the central 60% plain ivory paper. No text, no letters, no numbers.
```

#### 6.4 Arka yüz A5
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_back_a5.png` · 1748×2480 · opak

```
The same invitation back as print_back_5x7.png, recomposed for A5 portrait (148 × 210 mm) at 300 ppi — one zellige band along the top, the small brass star under it, the rest plain ivory paper. No text, no letters, no numbers.
```

Kontrol (PAKET 6): orta alan düz kâğıt; yazı yok; 300 ppi ölçüleri tam; ön ve arka aynı kâğıt.

---

## Parçalar gelince (Claude)

```bash
python3 tools/kit_check.py collections/27_Riad_Lantern_Nights --paket 2          # PAKET 2 oran / kenar denetimi
python3 platform/themes/riad-lantern-nights/build_images.py                     # img/ + manifest.json (geçici kesim → gerçek parçalar)
cd platform && node scripts/build-print-assets.ts --theme riad-lantern-nights    # basılı davetiye parçaları (public/print/)
```

`build_images.py` geçişi (G165 sonrası iş): `doors_closed` → `tema_build.dikis_bul` + dikişten iki kanat (`door_l`, `door_r`),
`doorway` önde sabit katman, `courtyard` → `court`, `card_small` → kart + `mask_card.png` (kemer pencere), `frame_arch` →
`mask_arch.png` (story pencereleri artık dikdörtgen değil kemer), `tile_1..4` → zellige satırı, `bg_tile` → `bg_wall`,
`lantern` → fener katmanı (titreşen ışık CSS'te kalır), `web_hero` → `og-1200x630.jpg`, PAKET 2 → demo kaydının `media`'sı
(tema varlığı), PAKET 6 → `lib/print/layouts.ts` (`composed` yerine kart parçaları). Sonra `theme-check --stress`, göz
kontrolü ve satış kararı (`coming` → `live`).
