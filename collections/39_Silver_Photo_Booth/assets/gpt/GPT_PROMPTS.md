# GPT görsel istekleri — Tasarım 39 · Silver Photo Booth

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> initials, monograms, logos, brand marks, QR codes or watermarks in any image** (also not on the chrome plate, the
> flashbulb base, the photo strip or the booth). **No party props:** no moustaches or lips on sticks, no signs, no
> costumes, no feather boas, no confetti — this is an elegant 1940s–50s hotel-ballroom photo booth, not a party-store
> look. Everything stays in ivory, pearl, silver, chrome and black. Give W1 `page_ground.png`, W2 `ivory_paper.png` and
> W3 `env_back.png` as the style reference of every later part: the same pearl-grey satin, the same ivory cotton card,
> the same pearl-silver metallic envelope paper with its black star-dust lining, the same soft studio light from the
> top-left with clean bright highlights on chrome. Parts drawn on the same envelope canvas (W3, W4, W5, W7) keep the
> envelope in exactly the same box.

Bu dosya tasarım 39'un **bütün görsel parçalarının** tek kaynağıdır (4. dalga, `docs/33_GPT_YENI_10_TASARIM.md`). Durum
**concept**: platform teması (`platform/themes/silver-photo-booth/`) **henüz yok** (önerilen G439 benzeri iş, `docs/33` →
"Sonra"); geçici görsel de yok. Tema kurulunca her parçanın nasıl kullanılacağı aşağıdaki "Kullanım" satırlarındadır;
gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar (isimler, tarih, baş harfler, mekân) HTML'dir,
hiçbir görsele pişirilmez.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/39_Silver_Photo_Booth/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/39_Silver_Photo_Booth --paket 5` ve `--paket 2` (oran, gerçek
  alfa, kenar payı, foto penceresi) + göz kontrolü. Tema kurulunca `python3 platform/themes/silver-photo-booth/build_images.py`
  (G167 düzeni: her parça geldiği anda kullanılır) ve `python3 tools/gpt_kuru_deneme.py --tema silver-photo-booth --sekil
  collections/39_Silver_Photo_Booth/assets/gpt/kuru_sekil.json` (prova). PAKET 6 için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic product photography + black-and-white film** — real polished chrome with clean reflections,
  real pearl-grey satin, real ivory cotton card, real glossy photo paper, real ivory ranunculus and silvery dusty miller;
  a 1940s–50s hotel ballroom photo booth: joyful but elegant, classic, romantic and rich. Not cartoon, not flat vector,
  not neon, not a party-store print.
- Renkler (yalnız bunlar): ivory `#F5F0E6` · ivory shade `#E7E0D2` · pearl `#D5D6D8` · silver `#B9BCC0` · chrome
  `#9EA3A8` · chrome light `#E4E6E9` · graphite `#45474B` · noir `#141414` · ink `#1E1E1E`. Renkli vurgu yok; çiçekler de
  fildişi ve gümüş-gri. W7 şerit bandının boş kareleri açık gri fotoğraf kâğıdı `#D9D9D9`.
- Işık: yumuşak stüdyo ışığı **sol üstten**, kromda temiz parlak vurgular; bütün parçalarda aynı. Şeffaf parçalarda
  gerçek alfa (beyaz ya da dama deseni değil), her kenarda en az %6 boşluk, nesnenin dışında gölge/hâle yok.
- Foto penceresi yalnız W8 `strip_tile`, W10 `booth_frame` ve W11 `print_wide`'da istenir (prompt'ta ölçüsüyle). W7 bandında
  üç kare var ama `kit_check` tek bölge ölçtüğü için kareler boş gri kâğıttır; tema fotoğrafları oraya CSS ile koyar.
- Gerçek bir kabine, markaya, otele, sanatçıya ya da başka bir satıcının tasarımına benzemesin; kabin plakasında yazı,
  rakam, fiyat, jeton yuvası yok. **02 Dusty Blue'dan ayrı:** anlık baskı uçarak yerleşmez, kabin şeridi krom yuvadan
  çıkar. **47 Monochrome Darkroom'dan ayrı:** negatif, film, kırmızı ışık, siyah kâğıt yok; burada gümüş-fildişi, flaş,
  şerit. **24'ten ayrı:** perde/sahne yok (kabin perdesi yalnız PAKET 2 fotoğrafında).

## Zarf geometrisi (W3–W7 ve W17 buna göre)
Tuval **1080×1500** (dikey). Zarf kutusu **x %7–93, y %6–94** (zarf ≈0,7:1). Dört katman **aynı tuvalde, aynı kutuda**
çizilir: W3 arka, W4 ön cep, W5 kapak, W7 şerit bandı; Claude her birini kendi kutusuna kırpar. Zarfın yüzdesiyle →
tuval yüzdesi:
- ön cep: zarfın %40'ından alta → tuval **y %41,2–94**; üst kenarı hafif yay (ortada ~%44'e iner);
- U kapak: zarfın üstünden %58'ine → tuval **y %6–57**; ucu derin yuvarlak (V değil, düz değil), ortada;
- foto şeridi bandı: ortada, eni zarf eninin %24'ü → tuval **x %39,7–60,3**; zarfın %4'ünden %96'sına → tuval **y
  %9,5–90,5**; iki ucu zarfın üst ve alt kenarından arkaya kıvrılır gibi yumuşak bir dönüşle biter;
- şeridin üç karesi: her biri bandın eninin %84'ü (tuval **x %41,3–58,7**), yüksekliği zarfın %26'sı, kareler arası zarfın
  %3'ü → tuval **y %13,0–35,9 · %38,6–61,4 · %64,1–87,0** (zarfın %8–34, %37–63, %66–92'si);
- açık kapağın iç yüzü (W6) ayrı tuvalde (1080×700): aynı U çizgisi dikey aynalanmış, oranı korunur (≈1,2:1 → tuval
  x ~%15–85, y %6–94).

Açılış: dokununca beyaz flaş (120 ms, CSS) → şerit yukarı kayıp zarftan ayrılır ve ekranın üstüne iğnelenir (home'da hero
şeridi olur) → U kapak üst kenarında 3B kalkar, iç yüzü (W6) yıldız tozlu siyah astar → fildişi kart (W12) cepten yükselir
→ home.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 İnci grisi saten (sayfa zemini, kabin fonu)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/page_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat texture of pearl-grey satin (#D5D6D8) like the softly padded backdrop inside a vintage hotel photo booth: a very fine satin weave, the faintest broad sheen drifting across it from the soft studio light at the top-left (highlights toward #E4E6E9, the softest lows toward #B9BCC0), very low contrast, calm enough for graphite and black text to read on it everywhere. Flat and smooth: no folds, no wrinkles, no seams, no buttons, no quilting, no pattern, no vignette, no shadow, no objects. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: inci grisi, çok sakin; kıvrım/kapitone/desen yok; dikişsiz (2×2 yan yana ek yeri yok); koyu yazı her yerde okunur.
Kullanım: tema kurulunca bütün sayfaların zemini ve açılış sayfası (kapalı zarfın arkasındaki kabin fonu).

#### W2 Fildişi pamuk kart (kartlar, bantlar, form)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/ivory_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of thick ivory cotton card stock (#F5F0E6): a soft felted tooth, a few faint cotton fibres, the gentlest warm variation toward #E7E0D2, matte, calm enough for graphite and black text everywhere. Evenly lit by soft studio light from the top-left, no deckle edge, no fold, no crease, no stain, no printing, no pattern, no shadow, no vignette. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sakin fildişi; dikişsiz; leke/baskı/desen yok; üstüne koyu yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, details program kartı, RSVP formu.

#### W3 Zarfın arkası (iç astar görünür)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/env_back.png` · 1080×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope, seen perfectly straight on, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas (about 0.7 wide : 1 tall) — the same box is used later by env_front.png, flap.png and strip_band.png, so keep it exactly there. We look at its inside: the panel is lined with deep black paper (#141414) dusted with a fine, sparse scatter of tiny silver star specks and silver glitter dust (#B9BCC0, #E4E6E9), like a quiet night sky, a little denser near the top; along the top edge and both sides a slim rim of the envelope's own pearl-silver metallic paper (#D5D6D8, a soft satin-metal sheen, a fine paper tooth) shows. The top edge is straight and open (the flap is not drawn). Soft studio light from the top-left, a gentle shade toward the bottom where the pocket will sit. No flap, no front pocket, no strip, no card, no seal, no sticker. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: zarf x %7–93 / y %6–94 kutusunda; içi gümüş yıldız tozlu siyah astar, kenarda inci-gümüş pay; kapak/cep/şerit yok; gölge/hâle yok; gerçek alfa.
Kullanım: tema kurulunca zarf kutusuna (`7, 6, 93, 94`) kırpılır → zarfın en arka katı; U kapak kalkınca yıldız tozlu astar görünür, kart onun önünden yükselir.

#### W4 Zarfın ön cebi
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/env_front.png` · 1080×1500 · **Şeffaf zemin**

```
Only the front pocket of the same pearl-silver envelope as env_back.png, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background: the envelope box is again exactly x 7–93% and y 6–94% of the canvas, and the pocket fills that box from 41% of the canvas height down to the envelope's bottom edge at 94%, across the full envelope width (x 7–93%). It is the same pearl-silver metallic paper (#D5D6D8 with a soft satin-metal sheen, highlights toward #E4E6E9, a fine paper tooth), showing the softly folded side and bottom flaps of a real envelope and their gentle fold lines; its top edge is a gentle, shallow arc (at 41% at both sides, dipping to about 44% at the centre), a clean cut edge with a hair-fine lighter rim so it reads clearly against the black lining behind it. Everything above the pocket is fully transparent. Soft studio light from the top-left. No flap, no strip, no card, no seal. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: cep tuvalin %41'inden alta, zarfla aynı genişlik; üst kenar hafif yay; üstü tamamen şeffaf; W3 ile üst üste konunca kenarlar çakışıyor; gerçek alfa.
Kullanım: tema kurulunca aynı zarf kutusuna kırpılır → ön cep (`.env-front`); kart bunun arkasından yükselir.

#### W5 U kapak (kapalı, dış yüz)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/flap.png` · 1080×1500 · **Şeffaf zemin**

```
Only the closed flap of the same pearl-silver envelope as env_back.png, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background: the envelope box is again exactly x 7–93% and y 6–94% of the canvas; the flap hangs from the envelope's top edge at 6% (a soft rounded fold line) across the full envelope width (x 7–93%) and comes down to a deep, round U-shaped tip whose lowest point, at the horizontal centre, is at 57% of the canvas height: its straight sides curve into one smooth, deep semicircle — NOT a V, NOT a point, NOT a straight edge, NOT scalloped. Outer face: the same pearl-silver metallic paper (#D5D6D8 with a satin-metal sheen, highlights toward #E4E6E9, a slightly deeper #B9BCC0 in the curve), a hair-fine lighter edge along the U and a very soft contact shade on the flap itself just inside its edge. Everything below and around the flap is fully transparent. Soft studio light from the top-left. No strip, no seal, no sticker, no button, no string. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tam genişlik kapak, derin U ucu ortada ~%57'de (V/düz/tarak değil); zarfla aynı inci-gümüş; şerit/mühür yok; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapak kutusuna (`7, 6, 93, 57`) kırpılır → kapalı kapak; açılışta flaş ve şeridin sıyrılmasından sonra üst kenarında 3B kalkar.

#### W6 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/flap_in.png` · 1080×700 · **Şeffaf zemin**

```
The inside of the same U-shaped envelope flap as flap.png, alone, seen straight on as it stands up above the envelope when it is open, on a fully transparent background: exactly the same outline and proportions as the flap of flap.png (about 1.2 wide : 1 tall) but mirrored vertically — its straight fold edge runs along the BOTTOM and its deep round U tip points UP. Scaled to fit this 1080×700 canvas, it spans about x 15–85% of the width and y 6–94% of the height. The inside is lined with the same deep black paper (#141414) dusted with tiny silver star specks and glitter dust as env_back.png, with a slim pearl-silver rim (#D5D6D8) along the curved edge. Soft studio light from the top-left. No seal, no strip. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: düz katlama kenarı altta, U uç üstte; oranı W5'teki kapakla aynı; W3 ile aynı yıldız tozlu siyah astar; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır, kapak enine ölçeklenir → kapak 90°'yi geçince zarfın üstünde dik duran iç yüz.

#### W7 Foto şeridi bandı (zarfı dikey saran kapanış)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/strip_band.png` · 1080×1500 · **Şeffaf zemin**

```
On the same 1080×1500 canvas as env_back.png and flap.png, in exactly the same place (the envelope box is x 7–93% and y 6–94% of the canvas, but the envelope itself is NOT drawn here), only a vertical photo-booth print strip that wraps the closed envelope like a belly band, on a fully transparent background: a strip of glossy white photo paper (#F5F0E6, a faint satin sheen) running vertically down the centre, from x 39.7% to x 60.3% of the canvas, from y 9.5% to y 90.5%; at both ends the strip turns over in a soft rounded fold, as if it bends over the envelope's top and bottom edges and continues behind it. On the strip, three frames stacked vertically, each from x 41.3% to x 58.7% of the canvas: frame 1 from y 13.0% to 35.9%, frame 2 from y 38.6% to 61.4%, frame 3 from y 64.1% to 87.0%. Each frame is EMPTY: flat, smooth light grey blank photo paper (#D9D9D9) with crisp straight edges — no image, no face, no texture — and the white border shows between and around them. A very soft contact shade on the strip itself where it bends. Soft studio light from the top-left. Everything outside the strip is fully transparent: no envelope, no flap, no pin, no clip. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek dikey beyaz şerit, tuvalin ortasında (x %39,7–60,3 / y %9,5–90,5); üç boş açık gri kare, görüntü yok; iki uç yumuşak kıvrık; zarf çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca aynı zarf tuvalinde tam tuval katman; üç kareye alıcının fotoğrafları CSS ile konur (kare kutuları yukarıdaki yüzdeler) → zarf kapalıyken fotoğraflar görünür. Açılışta beyaz flaştan sonra şerit yukarı kayıp zarftan sıyrılır ve ekranın üstüne iğnelenir; home'da hero şeridi olarak kalır.

#### W8 Şerit karesi (uç uca dizilen tek kare)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/strip_tile.png` · 1000×900 · **Şeffaf zemin**

```
A single frame of a photo-booth print strip, alone, seen perfectly flat and straight on, on a fully transparent background: a rectangle of glossy white photo paper (#F5F0E6, a faint satin sheen, soft studio light from the top-left) spanning exactly x 60–940 px and y 54–846 px of the 1000×900 canvas; its top and bottom edges are cut perfectly straight and square (frames placed end to end form one continuous strip), its two long sides clean and straight. In it a photo window exactly 760 px wide and 640 px tall, its top-left corner at x 120 px, y 110 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it); the white border around the window is 60 px at the sides, about 56 px at the top and about 96 px at the bottom. No curl, no fold, no pin. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek kare; pencere düz `#00FF00` dikdörtgen, ~760×640, sol üst ~(120, 110); üst/alt kenar düz kesik; beyaz kâğıt; gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür ve şeffaf yapılır; kareler uç uca dizilip kabin şeridi olur: home ve story'de krom yuvadan (W9) aşağı kayarak çıkar, her kare önce flaşla beyaz, sonra gri, sonra tam kontrast "banyo olur" (tek tek, kabin ritmiyle). RSVP gönderilince 4 flaş + "yeni şerit".

#### W9 Krom baskı yuvası plakası
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/booth_slot.png` · 1400×360 · **Şeffaf zemin**

```
A horizontal chrome print-slot plate from a vintage hotel photo booth, alone, seen perfectly straight on, on a fully transparent background: a long rectangular plate of polished chrome (#9EA3A8 with bright clean highlights toward #E4E6E9 and soft graphite reflections #45474B) with softly rounded corners and a slightly bevelled edge, four small domed rivets near its corners, and in its centre a long horizontal dark slot (#141414) about 62% of the plate's width and narrow in height, with a fine rolled inner lip, as if prints come out of it. The plate spans about x 7–93% and y 22–78% of the canvas. Soft studio light from the top-left, crisp clean reflections, no smudges, no scratches. No print or strip coming out of the slot, no buttons, no coin slot, no lamp, no screws other than the four rivets. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek yatay krom plaka, 4 perçin, ortada koyu yatay yarık; yazı/rakam/düğme/jeton yuvası yok; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → home ve story'de şeritlerin aşağı kayarak çıktığı yuva (şerit yarığın arkasından maskeyle çıkar).

#### W10 Krom kabin penceresi (story çerçevesi)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/booth_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A chrome photo-booth window frame, alone, seen straight on, on a fully transparent background: a thick polished chrome bezel (#9EA3A8, bright highlights toward #E4E6E9, soft graphite reflections #45474B) with softly rounded outer corners, a fine raised inner lip and small domed rivets evenly spaced around it (three along each long side, two along each short side), like the window of a vintage booth. The frame's outer edge spans about x 6–94% and y 6–94% of the canvas. In the middle a portrait photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it; only its corners very slightly rounded). Soft studio light from the top-left, clean reflections. No curtain, no glass and no reflection over the window, no buttons. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, ~760×950 (4:5), sol üst ~(120, 150); kalın krom bezel + perçinler; pencerenin üstünde cam/yansıma yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → story'deki üç anın (sol–sağ–sol) büyük kabin penceresi ve home'daki hikâye tanıtımı; fotoğraf aynı flaş + banyo ile belirir.

#### W11 Geniş tırtıklı baskı (mekân fotoğrafı)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/print_wide.png` · 1600×1000 · **Şeffaf zemin**

```
A wide black-and-white photo print, alone, lying flat, seen straight on, on a fully transparent background: a sheet of glossy white photo paper (#F5F0E6) with a finely scalloped, wavy-toothed white border (a classic deckle-cut print edge), the paper spanning about x 6–94% and y 6–94% of the canvas. In it a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 110 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Its two top corners are held by two small silver photo corners (triangular metallic corner pockets in #B9BCC0 with a bright edge highlight), each leg about 4% of the image width long, covering only the white border, never the window. Soft studio light from the top-left. No tape, no pin. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, ~1360×765 (16:9), sol üst ~(120, 110); tırtıklı beyaz kenar; iki üst köşede gümüş köşelik, pencereye binmiyor; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafının geniş baskısı.

#### W12 Zarftaki kart (boş)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen straight on, on a fully transparent background: the thick ivory cotton card of ivory_paper.png (#F5F0E6) with softly rounded corners, spanning x 7–93% and y 6–94% of the canvas, a fine silver-foil border line (#B9BCC0 with a crisp metallic shine) inset about 5% from the card's edge and a second hair-fine silver line just inside it. The whole card inside the border is EMPTY paper (the website sets the names, date and venue there in HTML). Soft studio light from the top-left, a hair-fine contact shade on the card's own edge only. No flowers, no ornament, no photo. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: boş fildişi kart, yuvarlak köşe, ince çift gümüş folyo bordür; içi tamamen boş; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → zarftan yükselen kart ve home kartı (isimler, tarih, mekân HTML).

#### W13 Köşe çiçeği (ranunculus + dusty miller + saten kurdele)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/corner_spray.png` · 1200×1000 · **Şeffaf zemin**

```
A romantic corner spray of wedding flowers growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: three or four ivory ranunculus blooms (#F5F0E6, many layered tissue-thin petals with soft pearl-grey shade in their hearts), two ivory buds, sprigs of silvery dusty miller with soft felted silver-grey leaves (#B9BCC0), and a long tail of ivory satin ribbon curling down out of the spray with a soft sheen; the stems are hidden among the silver leaves. The whole spray is only ivory, pearl and silver-grey. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right third of the canvas is completely empty. Soft studio light from the top-left. No vase, no glitter, no other flower or colour. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: sol üstten çıkan küme, sağ alt üçte bir boş; yalnız fildişi + gümüş-gri tonlar; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşeleri (sağda aynalanır), imzada ve RSVP kapanışında küçük.

#### W14 Yıldız payet dizisi (bölüm ayırıcı)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider of silver star sequins strung on one fine silver thread, alone, on a fully transparent background: a straight, very fine silver thread running horizontally across x 8–92% of the canvas at the vertical centre, with small faceted five-pointed silver star sequins (#B9BCC0 with bright facet highlights toward #E4E6E9) threaded along it at even intervals, slightly larger in the middle and smaller toward both ends, each catching the soft studio light from the top-left. Elegant and fine, not a party garland. No tassels, no beads of other colours. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: yatay tek iplik, uçlara doğru küçülen gümüş yıldız payetler; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet ve gün, details program, RSVP formu).

#### W15 Eski tip flaş ampulü (sönük)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/flashbulb.png` · 400×640 · **Şeffaf zemin**

```
A single vintage photographic flashbulb, unused and unlit, standing upright, alone, seen from the front, on a fully transparent background: a clear pear-shaped glass bulb with a delicate crumpled pale-silver foil filament inside, a small glass tip at the top, and a ribbed silver metal screw base at the bottom (#B9BCC0, crisp highlights). The glass is truly see-through (real alpha in the clear glass), shown only by crisp highlights and fine edge reflections from the soft studio light at the top-left. The bulb spans about x 25–75% and y 8–92% of the canvas. It is NOT lit: no light, no flash, no rays, no sparkle, no glow. No socket, no cord, no reflector dish. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek sönük ampul (ışık/ışın/hâle yok); cam gerçekten saydam; gümüş vida tabanı yazısız; gerçek alfa.
Kullanım: tema kurulunca açılışta zarfın yanında beyaz flaştan (CSS) hemen önce belirir; RSVP gönderilince 4 flaşın yanında; imzada küçük.

#### W16 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, soft studio light from the top-left. No other object. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. (Make three files, the same light and scale: 1 = one faceted five-pointed silver star sequin (#B9BCC0, bright facet highlights) with a tiny centre hole; 2 = one single loose ivory ranunculus petal (#F5F0E6), tissue-thin and softly cupped, a pearl-grey shade in its fold; 3 = one short curled piece of ivory satin ribbon (#F5F0E6) with a soft sheen, both ends cut in a small V.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (payet, yaprak, kurdele); kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışta ve RSVP gönderilince süzülen küçük nesneler (her biri ayrı katman, kendi fazında).

#### W17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic product photography, soft studio light from the top-left with clean bright highlights on chrome: the closed portrait pearl-silver envelope of flap.png with its deep U flap, wrapped vertically by the white photo-booth strip of strip_band.png (its three frames empty light grey photo paper #D9D9D9), lying slightly below the centre on pearl-grey satin (as page_ground.png); at the left a spray of ivory ranunculus and silvery dusty miller with an ivory satin ribbon (as corner_spray.png); at the right the riveted chrome print-slot plate of booth_slot.png leaning at a slight angle and an unlit vintage flashbulb (as flashbulb.png) lying beside it; a few small silver star sequins scattered; behind, softly out of focus, more ivory flowers and the pearl satin. Only ivory, pearl, silver, chrome and black tones. The top 20% of the image is calm and soft (only out-of-focus satin and flowers). This image is cropped to 1200×630 for link previews: keep the whole envelope and strip visible with at least 5% empty margin below it. No people. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf + şerit bütün, altında ≥%5 boşluk; şerit kareleri boş gri; üst %20 sakin; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım: üstten ~%21) ve katalog kapağı.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Josephine & Miles; gerçek kişiye benzemesin)

Ortak: black-and-white fine-art wedding photography on classic black-and-white film, rich silver tones from deep black to
clean white, fine natural grain, soft flattering light; ONE fictional couple in their early thirties, the same two people
in every photo (they must not resemble any real person or celebrity): Josephine — shoulder-length wavy light-brown hair
styled in soft 1940s-inspired waves, fair skin, a slim ring; Miles — short dark hair, clean-shaven, medium-dark skin,
thin-framed glasses. Modern, elegant clothing (no costume; no props, moustaches, lips or signs on sticks). Story photos
are cropped to 4:5 in a frame: keep faces and hands in the middle 70%. No text, no frame, no watermark, no readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Hero ve Story fotoğrafları sitede **4:5** kırpılır (krom kabin penceresi ve
şerit kareleri); Story başlıkları `content.demo.json` → `story.items` ile aynı.

#### 2.1 Ana portre
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white film wedding portrait of the fictional couple Josephine and Miles, in their early thirties (Josephine: shoulder-length wavy light-brown hair in soft 1940s-inspired waves, fair skin; Miles: short dark hair, clean-shaven, medium-dark skin, thin-framed glasses; they must not resemble any real person or celebrity), standing side by side and laughing together in front of the softly lit pearl satin backdrop of a vintage photo booth: she in a sleek satin column gown with a softly draped neckline, he in a black tuxedo with a white pocket square, his arm around her waist, waist-up, faces in the upper middle of the frame. Rich silver tones, fine grain, soft studio light from the top-left. No props, no signs. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.2 Story 1 — "The first photo booth"
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white film photo with the tight, even framing of a photo-booth frame: the same couple as hero_portrait.jpg (same faces, hair and skin) seated close inside a vintage photo booth in front of its pale satin curtain, she laughing with her eyes closed as he kisses her cheek, dressed as guests at a friend's evening wedding (she in a simple cocktail dress, he in a dark suit with an open collar), lit by the bright, even light of the booth flash. Rich silver tones, fine grain. No props, no signs, no lettering on the booth. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.3 Story 2 — "Dancing at the ballroom"
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white film photo: the same couple as hero_portrait.jpg dancing close in a grand hotel ballroom at night, he turning her gently, her skirt in soft motion, both smiling; crystal chandeliers and other dancers behind them only as soft out-of-focus shapes and glowing round bokeh. Rich silver tones, fine grain, a little motion softness in the skirt. A generic ballroom, not a recognisable place. No readable signs. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.4 Story 3 — "The question"
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white film close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand resting in his with a slim engagement ring just placed on her finger and catching the light, a small open ring box in his other hand, against a softly blurred background of glittering sequin bokeh, shallow depth of field. Natural, well-formed hands with five fingers each. Rich silver tones, fine grain. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.5 Mekân
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9 black-and-white film photograph of a 1940s art-moderne hotel ballroom prepared for a wedding evening, empty of people: tiered crystal chandeliers, a polished parquet dance floor, round tables dressed in ivory tablecloths with low ivory flowers, curved streamlined walls with soft cove lighting, and in one corner a chrome vintage photo booth with a pale curtain (no lettering, no sign on it). Rich silver tones, fine grain, soft evening light. A generic room that must not resemble any real hotel or venue. No people, no signs, no religious objects. No text, letters, numbers, monograms, logos or watermarks.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın `'silver-photo-booth'` bloğu
> **henüz yok** — tema kurulunca eklenecek (önerilen G439 benzeri iş). Tema yokken geçici baskı da yok.
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli
> hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema kurulunca `layouts.ts`'e `'silver-photo-booth'` bloğu eklenir: `sources` → `{ front:
>    'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme silver-photo-booth` ve `node scripts/print-sample.ts
>    --theme silver-photo-booth --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the thick ivory cotton card of ivory_paper.png (#F5F0E6). Across the top, between 9% and 91% of the width, a delicate swag of small faceted silver star sequins on one fine silver thread (as divider.png) hanging in a gentle curve from near the top corners, with a small spray of ivory ranunculus and silvery dusty miller (as corner_spray.png) at its centre; nothing in this top band reaches lower than 17% of the height. Along the bottom, between 93% and 96% of the height and from 14% to 86% of the width, a fine double rule of silver foil with one small star sequin at its centre. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no sequin, no petal, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges. Soft studio light from the top-left. Only ivory, pearl and silver tones. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; payet dizisi + çiçek yalnız üstte (%17'nin üstünde), gümüş çift çizgi yalnız altta; yan %8 boş; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same thick ivory cotton card, only a short swag of five small silver star sequins on a fine silver thread across the top centre (between 30% and 70% of the width) with one tiny ivory ranunculus bud at its middle, its lowest point staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no sequin, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada kısa payet dizisi (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

PAKET 3/7 (Etsy ilan sahneleri) burada yok: tema kurulunca `tools/paket7_ilan.py` ile üretilecek.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> Set bu tasarımın kendi dünyası (PAKET 3 yok; `EK_SETLER`): bütün sahnelerde aynı masa, süs, ışık. Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 39`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Silver Photo Booth". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a pearl-grey silk satin cloth, a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, ivory ranunculus and silvery dusty miller, the same light and the same color world (ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a pearl-grey silk satin cloth, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, ivory ranunculus and silvery dusty miller, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a pearl-grey silk satin cloth, a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, ivory ranunculus and silvery dusty miller. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a polished chrome vintage flash bulb, a short strip of black-and-white photo prints. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a pearl-grey silk satin cloth, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, ivory ranunculus and silvery dusty miller. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a pearl-grey silk satin cloth, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, ivory ranunculus and silvery dusty miller arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a pearl-grey silk satin cloth: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, ivory ranunculus and silvery dusty miller. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a pearl-grey silk satin cloth: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, ivory ranunculus and silvery dusty miller. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a pearl-grey silk satin cloth, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, ivory ranunculus and silvery dusty miller. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a polished chrome vintage flash bulb, a short strip of black-and-white photo prints; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a pearl-grey silk satin cloth, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/39_Silver_Photo_Booth/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a pearl-grey silk satin cloth: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a polished chrome vintage flash bulb, a short strip of black-and-white photo prints, ivory ranunculus and silvery dusty miller. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: ivory, pearl grey, polished chrome and silver, graphite and soft black, no other colour. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
