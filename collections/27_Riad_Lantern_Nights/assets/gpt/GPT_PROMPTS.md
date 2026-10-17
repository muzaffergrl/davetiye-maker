# GPT görsel istekleri — Tasarım 27 · Riad Lantern Nights

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos of the fictional couple), then PAKET 6 (printable invitation grounds). Use each English prompt exactly as
> written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text,
> letters, numbers, logos, monograms, signatures or watermarks in any image. Make W2.1 `doors_closed.png` first and give
> it as the style reference of every later part: the same carved cedar, the same brass, the same teal / saffron palette,
> the same light.

Bu dosya tasarım 27'nin **bütün görsel parçalarının** tek kaynağıdır (G165). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
(eksenler + hareket imzası) kayıtlı, üreteçlere girmediği için dosya elle yazıldı. Tema (`platform/themes/riad-lantern-nights/`)
bu parçalar gelmeden kuruldu: `build_images.py` eksik her parça için repodaki başka GPT görsellerinden **geçici** bir katman
kesiyor (10'un meşe dokusundan iki kanat, 05'in sıvasından avlu/kart/duvar tonları, 05'in çini bordüründen dört karo; çizim
yok, K21). **G167:** betiğin GPT kolu hazır — her parça dosyası `parts/` altına konduğu anda (parça parça) kullanılır, sayfalar
aynı dosya adlarını alır, ölçülen pencere/kapı yüzdeleri `img/manifest.json`'a ve `site.css` sonundaki üretilen
`@gpt-layers` bloğuna yazılır (elle düzenlenmez). Yalnız GPT'yle var olan katmanlar (kapı kemeri, fener, bougainvillea,
ayırıcı, oyma çerçeveler, sayfa zemini, RSVP yaprakları) o blok açana kadar gizlidir. Tema `live` olmadan önce göz
kontrolünden geçer (bkz. en alttaki "Parçalar gelince").

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
kanatları çerçevenin açıklığını tam doldurur, avlu da aynı açıklığın arkasında görünür. Ortak ölçü (tuval yüzdesi):
kapı kanatları x %13–87, y %29–94 (oran 0,76); kapı çerçevesi bunun dışında kalır: pervazlar x %3–13 ve %87–97, kemer
y %8'den kapıların üstüne (%29), eşik y %94–97. `build_images.py` çerçeveyi kapı kutusunun çevresinden sabit paylarla keser
(sol/sağ kapı genişliğinin %18'i, üst yüksekliğin %45'i, alt %10'u); bunun dışına taşan çerçeve kesilir (uyarı yazar).

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
The doorway surround of the same riad door, alone, drawn on exactly the same canvas position as doors_closed.png (give it as the reference image): the doors' rectangle (from 13% to 87% of the image width, from 29% to 94% of the image height) stays an empty opening; the surround hugs it — the jambs from 3% to 13% and from 87% to 97% of the width, the arch above the doors from 8% of the height down to 29%, a low threshold from 94% to 97% — and nothing reaches beyond 3% from the image edges: a horseshoe (Moorish) arch of carved ivory stucco with fine geometric lattice carving above the doors, a carved cedar lintel, and two narrow jambs faced with small teal, saffron and ivory zellige tiles in a simple geometric pattern, standing on a low stone threshold. The opening inside the surround — exactly where the two door leaves sit — is completely EMPTY and TRANSPARENT (real alpha, nothing painted there), so the doors and the courtyard behind show through. The surround's inner edge is a crisp line with a slight contact shade on the stucco itself (not a cast shadow). Gouache illustration with realistic stucco and glazed tile texture. Front view, perfectly straight and symmetrical, not cropped, with empty margin around. Soft warm light from the top-left. No cast shadow, no glow outside its outline. No text, letters, numbers or calligraphy. True transparent background PNG.
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
A small portrait invitation card, alone: thick warm ivory cotton paper (#F6EAD2) with a fine deckled feel and a thin hand-painted saffron-and-teal zellige border inset from its edge, about 0.7 as wide as it is tall. In its upper half, horizontally centred, a tall Moroccan horseshoe-arch photo window about 4:5 and about half as wide as the card, its top about 8% of the card's height below the card's top edge, filled with flat pure green #00FF00 (no texture, no shading, crisp arch outline). Everything inside the border below the window — at least the lower 42% of the card — is blank, even ivory paper (no text, no ornament: names and date are added there by the website). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Soft warm light from the top-left. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00, at nalı kemer biçimi, kartın üst yarısında ortalı; pencerenin altı bordüre kadar düz kâğıt;
bordür ince; alfa. (Claude: pencere şeffaf yapılır, portre kartın ARKASINA, ölçülen pencereye konur — kemer biçimi GPT'nin
kendi çizgisi; pencere altındaki düz kâğıt `free_zone` olur, theme-check kart yazısını onunla denetler.)

#### W2.5 Pirinç fener
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lantern.png` · 1024×1536 · **Şeffaf zemin**

```
A single traditional pierced brass lantern hanging from a short brass chain at the top center, alone: hammered antique brass (#C9A35B) with star-shaped piercings and small saffron and teal glass panes, lit from inside so the panes and the piercings glow warm saffron — the glow stays INSIDE the lantern's outline. The chain starts at the very top edge of the image. Gouache with realistic metal texture. Front view, perfectly straight, not cropped. No cast shadow, no light rays, no halo outside its outline (the website adds the glow). No text. True transparent background PNG.
```
Kontrol: tek fener; ışıma yalnız fenerin içinde; zincir üst kenardan; gölge/hâle yok; alfa. (Yeri: kapı sayfasında kemerin
içinde kapıların üstünde asılı, home'da kartın üstünde, RSVP'de başlığın üstünde; hafifçe sallanır, titreyen hâle CSS ışığı.)

#### W2.6 Sayfa arka planı (kapı sayfası, telefon)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bg_page.png` · 1024×1536 · opak

```
A vertical phone-screen background: the night-teal tadelakt (polished lime plaster) wall of a riad courtyard (#0F2F31 to #174A4B) with a soft hand-made sheen, very faint magenta bougainvillea sprigs reaching in only at the two top corners, and a low band of teal, saffron and ivory zellige along the very bottom edge (bottom 8% only). The whole central area stays calm, plain teal plaster and empty (no door, no card, no text), so light ivory text reads on it. Gouache with real plaster texture, soft warm light from the top-left.
```
Kontrol: orta sakin; dekor yalnız üst köşeler ve en alt bant; yazı yok. (Yeri: kapı sayfasının telefon zemini; geniş ekranda
döşenen `bg_tile` kalır.)

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
(Bunlar home/story/details'teki "çini çini dizilen bordür" hareketinin parçaları — her karo ayrı katman; site 76 ve 152 px
keser, baskı 152 px'i kullanır. `tile_4` sade karo desenli karoların arasına girer: 1·4·2·4·3·4·1.)

#### W2.12 Kemer pencere çerçevesi (story fotoğrafları)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/frame_arch.png` · 1024×1536 · **Şeffaf zemin**

```
A tall Moroccan window frame, alone: a horseshoe-arch opening framed by carved ivory stucco with fine geometric lattice carving and a slim carved cedar sill at the bottom, about 2:3 tall overall. The window opening is filled with flat pure green #00FF00 (no texture, no shading), its arch outline crisp. Gouache with realistic stucco and wood texture. Front view, perfectly straight, centered and not cropped, with generous empty margin. Soft warm light from the top-left. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```
Kontrol: pencere düz #00FF00, at nalı kemer; çerçeve ince (pencere çerçevenin ~%70'i); alfa. (Claude pencereyi şeffaf
yapar ve ölçer; story ve home'daki üç pencerenin fotoğrafı çerçevenin arkasına, pencereye oturur — kemer GPT'nin çizgisi.)

#### W2.13 Yatay çerçeve (mekân fotoğrafı)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A wide carved cedar frame in the same style as frame_arch.png, alone: a slim carved cedar border with small hammered-brass studs at the corners, its opening exactly 16:9 and filled with flat pure green #00FF00 (no texture, no shading). Front view, perfectly straight, centered, not cropped, generous margin. Soft warm light from the top-left. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```
Kontrol: pencere 16:9 düz #00FF00; çerçeve ince; alfa. (Yeri: details'te mekân fotoğrafının çerçevesi.)

#### W2.14 – W2.15 Bougainvillea köşe kümeleri
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bougainvillea_tl.png` ve `bougainvillea_br.png` · 1024×1024 · **Şeffaf zemin**

```
tl: A cascading spray of magenta bougainvillea (#B8326E) with papery bracts, small ivory flowers and dark green leaves, growing in from the top-left corner of the square and trailing down and to the right, gouache with realistic petal texture; the bottom-right half of the square stays empty. No shadow, no glow, no text. True transparent background PNG.
br: The same bougainvillea, mirrored in composition: growing in from the bottom-right corner, reaching up and to the left; the top-left half empty. No shadow, no glow, no text. True transparent background PNG.
```
Kontrol: küme köşeden giriyor, diğer yarı boş; magenta yalnız burada; alfa. (Yeri: home'un ilk ekranında sol üst + sağ alt
köşe, RSVP'de sol üst; kartın ve yazının arkasında.)

#### W2.16 Ayırıcı
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/divider.png` · 1536×512 · **Şeffaf zemin**

```
A slim horizontal ornament, alone: a fine pierced brass filigree line with a small eight-point star at its center, about 10 times wider than tall, centered. Realistic hammered brass, soft warm light from the top-left. No shadow, no glow, no text. True transparent background PNG.
```
Kontrol: ince, yatay, ortalı; alfa. (Yeri: home davetinde isimlerle tarih arasında, details başlığının altında.)

#### W2.17 Süzülen accent — tek bougainvillea yaprağı (braktesi)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
A single papery magenta bougainvillea bract, alone, slightly curled, filling about 60% of the square. Gouache with realistic petal texture. Front view, centered, not cropped. No shadow, no glow, no text. True transparent background PNG.
```
Kontrol: tek yaprak; alfa. (Yeri: RSVP yanıtı gönderilince fener bir kez parlar ve bu yapraktan üçü ekrandan süzülür —
`site.js` `petals`, `.accent-layer`; hareket azaltmada yok.)

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
Platform her yüz için **tek** zemin kullanır ve onu kesim payı (bleed) dahil sayfaya `cover` ile yayar: aynı görsel hem 5×7 in
(+1/8 in bleed = 5.25 × 7.25 in) hem A5 (+3 mm = 154 × 216 mm) basar. Bu yüzden zemin **A5 + bleed ölçüsünde, 300 ppi**:
1819×2551 px (5×7'de üst ve alttan ~%0,8 kırpılır, ~260 ppi). Ayrı A5 / 5×7 zemini istenmez (platform kullanamaz).
Metin kutusu (`layouts.ts`, kesim kenarına göre %: üst, sağ, alt, sol) ön `[17, 12, 17, 12]`, arka `[16, 12, 10, 12]`;
zemin görselinin yüzdesiyle bu, ön yüzde **yükseklik %16–84, genişlik %11–89**, arka yüzde **yükseklik %15–91, genişlik
%11–89** düz kâğıt demektir (iki ölçüde de kutuyu kapsar). Dekor yalnız bunun dışında ve kenardan en az %5 içeride (kâğıt
dokusu kenara kadar uzanır).

#### 6.1 Ön yüz
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_front.png` · 1819×2551 · opak

```
A printable wedding invitation ground, front side, portrait, flat and seen straight on, 1819 × 2551 px at 300 ppi (A5 with bleed; it is trimmed later), no text: warm ivory lime-plaster paper (#F6EAD2) with a fine hand-made texture running edge to edge. Decoration ONLY in the top 15% and the bottom 15% of the image: at the top a narrow band of teal, saffron and ivory zellige tiles with a small carved ivory-stucco horseshoe arch motif framing a lit pierced brass lantern at its centre and a few magenta bougainvillea bracts at the top-right; at the bottom a matching narrow zellige band. Keep every ornament at least 5% inside the image edges. The whole central area — from 16% to 84% of the height and from 11% to 89% of the width — is plain, calm, even ivory paper with no ornament, no frame line and no shading, for the names, date and venue. Gouache with realistic texture, soft warm light from the top-left. No text, no letters, no numbers, no calligraphy, no monogram.
```

#### 6.2 Arka yüz
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_back.png` · 1819×2551 · opak

```
The matching back of the same invitation (give print_front.png as the reference image), portrait, 1819 × 2551 px at 300 ppi, no text: the same ivory lime-plaster paper edge to edge, decorated ONLY in the top 14% of the image — a single narrow band of the same zellige tiles and a small brass eight-point star centred just under it, at least 5% inside the image edges. Everything else — from 15% to 91% of the height and from 11% to 89% of the width, and the bottom of the sheet — is plain, even ivory paper for the schedule, the details and a QR code. Same style and light. No text, no letters, no numbers, no calligraphy.
```

Kontrol (PAKET 6): 1819×2551; orta alan (ön %16–84 × %11–89, arka %15–91 × %11–89) tamamen düz kâğıt; yazı yok; ön ve arka
aynı kâğıt. **Gelince (Claude, otomatik değil — G149 ölçümü gerekir):** `lib/print/layouts.ts` `'riad-lantern-nights'`
bloğunda `sources` → `{ front: 'print/print_front.png', back: 'print/print_back.png' }`, `composed` → `front: { bg:
cover('front'), images: [] }`, `back: { bg: cover('back'), images: [] }` (karo satırları kalkar; kutular aynı kalabilir);
sonra `node scripts/build-print-assets.ts --theme riad-lantern-nights` ve `node --test tests/g149-print-layout.test.ts`
(kutu dekora değiyorsa `front`/`back` kutusu ya da `bands` ölçülüp daraltılır). O zamana kadar `build-print-assets` bu iki
dosya için "PAKET 6 grounds not used … yet" uyarısı verir.

---

## Parçalar gelince (Claude)

```bash
python3 tools/kit_check.py collections/27_Riad_Lantern_Nights                     # ölçü / alfa / #00FF00 pencere denetimi
python3 platform/themes/riad-lantern-nights/build_images.py                     # parts/ → img/ + manifest.json + site.css @gpt-layers
cd platform && PORT=3405 NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs --theme riad-lantern-nights --stress --compare none
node --test tests/theme-riad-lantern-nights.test.ts                             # CSS @gpt-layers = manifest
```

`build_images.py` (G167) her parçayı dosyası varsa kullanır, yoksa geçici parçayı keser; çıktı uyarıları (`manifest.json`
`warnings`: dikiş bulunamadı, oran %4'ten fazla farklı, 1,5×'ten fazla büyütme, çerçeve kesildi, pencere yok) göz
kontrolünde okunur. Kesim: `doors_closed` → `tema_build.dikis_bul` dikişinden iki kanat (`door_l`, `door_r`, 477×1254'e
ölçeklenir), alfa kutusu = kapı açıklığı; `doorway` → açıklığın çevresinden sabit paylarla kesim, önde sabit katman;
`courtyard` → açıklığın kutusu (`court`) + 16:9 (`court_band`); `card_small` → kart (878×1254), #00FF00 pencere şeffaf,
pencere ve düz kâğıt ölçülür; `frame_arch` / `frame_landscape` → pencere şeffaf + ölçü (foto arkada); `tile_1..4` → 76 + 152
px; `bg_tile` → `bg_wall`; `bg_page` → kapı sayfası telefon zemini; `lantern`, `bougainvillea_*`, `divider`, `accent_1` →
yalnız GPT'yle görünen katmanlar; `web_hero` → `og-1200x630.jpg` (`og_kirp(hiza="alt")`); PAKET 2 → demo kaydının `media`'sı
(tema varlığı, ayrı iş); PAKET 6 → yukarıdaki elle geçiş. Sonra göz kontrolü (gerçek iPhone/Android dahil) ve satış kararı
(`coming` → `live`).

Kuru deneme (gerçek repo değişmez): `python3 tools/gpt_kuru_deneme.py --tema riad-lantern-nights --sekil
collections/27_Riad_Lantern_Nights/assets/gpt/kuru_sekil.json [--theme-check --stress --port 3405]`.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a teal zellige-tiled table top in a lantern-lit courtyard and pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a teal zellige-tiled table top in a lantern-lit courtyard, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a teal zellige-tiled table top in a lantern-lit courtyard, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a teal zellige-tiled table top in a lantern-lit courtyard, slightly right of center and rotated about 8 degrees, surrounded at the edges by pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a low cedar daybed with saffron and teal cushions and a brass-rimmed tea glass; a small arrangement of pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
