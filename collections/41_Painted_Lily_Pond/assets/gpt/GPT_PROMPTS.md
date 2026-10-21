# GPT görsel istekleri — Tasarım 41 · Painted Lily Pond

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> monograms, initials, signatures, logos, watermarks or QR codes in any image** (also not in the wax seal, not in the
> corner of any painting, not on brush handles). The painting is described by technique only: a fresh plein-air
> impressionist oil painting — broken colour laid in short side-by-side strokes, thick visible impasto brushwork, soft
> luminous light — an original work, never a copy of any existing painting, painter or real garden. Give W1
> `canvas_ground.png`, W2 `garden_scene.png` and W3 `env_back.png` as the style reference of every later part: the same
> primed cream linen canvas, the same pastel pond-blue, lilac and lily-pink palette, the same thick brushwork, the same
> bright morning light from the top-right. For `env_front.png` and `flap.png` also attach `env_back.png` and keep the
> same 1110×1500 canvas, the same envelope position and the same envelope size.

Bu dosya tasarım 41'in **bütün görsel parçalarının** tek kaynağıdır (`docs/33_GPT_YENI_10_TASARIM.md`, 4. dalga 39–48).
Tasarım henüz `tools/katalog.py` `EK_TEMALAR`'da değil ve teması yok: dosya elle yazıldı, durum `concept`. Geçici görsel
de **yok** (K21: çizilmiş yedek yok); tema (önerilen G441) bu parçalarla kurulacak. Kişisel alanlar (isimler, tarih,
baş harfler, mekân) hiçbir görsele pişirilmez; sitede HTML'dir. QR kodunu GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/41_Painted_Lily_Pond/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/41_Painted_Lily_Pond --paket 5` ve `--paket 2` (oran, gerçek
  alfa, kenar payı, yeşil pencere) + göz kontrolü. Tema `platform/themes/painted-lily-pond/` **henüz yok** (G441 benzeri
  iş: 03/38 yapısı, `build_images.py`, `parts.css`, `layouts.ts` baskı bloğu, `EK_TEMALAR` kaydı). Tema kurulunca
  `python3 platform/themes/painted-lily-pond/build_images.py` her parçayı geldiği anda kullanır (G167 düzeni) ve
  `python3 tools/gpt_kuru_deneme.py --tema painted-lily-pond --sekil
  collections/41_Painted_Lily_Pond/assets/gpt/kuru_sekil.json` provası koşulur. PAKET 6 için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **plein-air impressionist oil painting + real linen canvas** — thick impasto, broken colour laid side by side
  in short visible strokes, soft lost edges, luminous pastel light, sparkling reflections on water, the primed linen
  weave showing through thin passages; objects (wax seal, stretched canvas panels, card, envelope) are photorealistic
  materials whose painted surfaces carry the same brushwork. Classic, romantic, rich and airy. Not flat vector, not
  watercolour clip-art, not a photo filter, not a copy of any existing painting.
- Renkler: pond blue `#6F8FAE` · deep pond `#3F5A73` · lilac `#B7A3CC` · wisteria `#9C86BE` · lily pink `#E8B9C1` ·
  water sage (su yeşili) `#86A889` · canvas cream `#F4EEDF` · sun gold `#E5C77F` · ink `#2F3A45`.
- Işık: parlak sabah ışığı **sağ üstten** (dalganın diğer tasarımlarından farklı), suda yumuşak yansımalar; bütün
  parçalarda aynı. Şeffaf parçalarda gerçek alfa; nesnenin dışında gölge, hâle, ışıma yok; nesne tuvalin her kenarından
  en az %6 içeride.
- Motifler: nilüfer yaprakları ve pembe nilüferler, mor salkım (wisteria), söğüt dalları, uzakta küçük kavisli ahşap
  bahçe köprüsü (genel, solgun krem-gri; bilinen hiçbir köprüye benzemez), yusufçuk, geniş boya darbeleri.
- Yasak: ressam adı, tablo adı, gerçek bahçe/mekân, tablo köşesinde imza, yazı, marka, bir sanatçıya benzetme. 03 Blush Garden
  Rose'dan ayrı (şakayık/gül ve kemerli altın çerçeve yok), 37 Art Nouveau Lily'den ayrı (vitray, kurşun çizgi, zambak
  yok), 09 Lavender Provence'tan ayrı (keten kese, lavanta tarlası yok).

## Kapalı zarf geometrisi (W3–W7 buna göre)
Zarf **dikey**, krem astarlı keten tuvalden portföy zarf. Tuval **1110×1500**; zarf kutusu **x 7–93 %, y 6–94 %**
(≈955×1320 px, ≈0,72:1). Üç katman (W3 arka, W4 ön cep, W5 kapak) **aynı tuvalde, aynı konumda** çizilir; tema üst üste
koyar. Zarf yüzdesiyle → tuval yüzdesiyle:
- ön cep: zarfın %40'ından alta, **düz** üst kenar → tuvalde x 7–93 %, y 41,2–94 %
- **düz kapak**: zarfın üstünden %44'üne, alt kenarı **yırtık (deckle)** → tuvalde x 7–93 %, y 6–44,7 % (cebin üst
  ~%3,5'ini örter); dış yüzü kalın fırçayla boyanmış küçük bir nilüfer havuzu tablosu
- mühür (W7, ayrı tuval 560×560): merkezi zarfın (50 %, 44 %) noktası = tuvalde (50 %, 44,7 %); çapı zarf eninin %18'i
  (≈172 px = tuval eninin %15,5'i); kapağın yırtık alt kenarının ortasına oturur
- açık kapağın iç yüzü (W6) ayrı tuval 1110×640: kapak x 7–93 %, y 6–94 % (katlama çizgisi altta, yırtık kenar üstte);
  tema onu kapak kutusuna ölçekler.

Açılış (tema kurulunca): mühür kalkar → kapak üst katından 3B açılır (iç yüzü W6) → dört geniş fırça darbesi (W8, maske)
zarfın arkasından **tek tek** açılıp tam ekran bahçe tablosunu (W2) boyayarak ortaya çıkarır → kart (W9) sudan yükselir
gibi kalkar (altında CSS halka dalgası) → home.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Astarlı keten tuval (sayfa zemini, "tablo" dokusu)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/canvas_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of primed artist's linen canvas in a warm canvas cream (#F4EEDF): the fine, slightly irregular linen weave clearly visible through a thin even layer of off-white gesso, a few faint and very soft broad sweeps of the priming brush running in slightly different directions, the tiniest hint of sun gold (#E5C77F) and lilac (#B7A3CC) caught in those sweeps, very low contrast and calm enough for dark slate text (#2F3A45) to read on it everywhere. Evenly lit by bright morning light from the top-right. No stretcher bars, no tacks, no folds, no stains, no paint marks, no vignette, no shadow, no objects, no pattern. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); keten dokusu görünür ama sakin krem; leke/boya izi yok; koyu yazı her yerde okunur.
Kullanım (tema kurulunca): bütün sayfaların ve açılış sayfasının zemini; düşük opaklıkla fotoğrafların "tablodan
fotoğrafa" geçişinde üste binen tuval dokusu.

#### W2 Bahçe tablosu (tam ekran açılış sahnesi)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/garden_scene.png` · 1200×1600 · opak

```
A vertical plein-air impressionist oil painting of a water garden on a bright spring morning, filling the whole canvas edge to edge: in the foreground a still pond in pond blue (#6F8FAE) and deep pond (#3F5A73) broken by flickering reflections of the sky, scattered round lily pads in jade and water sage (#86A889) with four or five open pink water lilies (#E8B9C1) catching the light; in the middle distance a rustic wooden arch heavily draped with hanging lilac and wisteria blossoms (#B7A3CC, #9C86BE) framing the view; far away, small and soft, a gently curved wooden garden footbridge in pale weathered cream-grey crossing the water, and at the right a willow trailing its long fronds toward the surface. The TOP 35% of the image is a calm, open, luminous pale morning sky of canvas cream, soft sun gold (#E5C77F) and the faintest lilac, painted with only a few broad soft strokes — no branches, no blossoms, no birds in it (names are set there). Thick visible impasto brushstrokes, broken colour laid side by side, soft lost edges, sparkling light on the water, bright morning sun from the top-right. Keep the important shapes inside the central 85% of the width (phones crop the sides). An original painting, not a copy of any existing painting or real garden; no people, no boats, no signature in any corner. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: üst %35 sakin açık gök (dal/çiçek/kuş yok); önde nilüferli havuz, ortada mor salkım kemeri, köprü uzakta ve
küçük; fırça darbeleri görünür; köşede imza yok.
Kullanım (tema kurulunca): açılışta dört fırça darbesi maskesiyle (W8) ekranı boyayarak beliren tam ekran sahne; isimler
üst %35'e HTML; home'un üst bandında yumuşak kırpımla tekrar.

#### W3 Zarfın arkası (iç astar görünür)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/env_back.png` · 1110×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope made of primed cream linen canvas (the canvas of canvas_ground.png), seen perfectly straight on, on a fully transparent 1110×1500 canvas. The envelope occupies exactly x 7–93% and y 6–94% of the canvas (about 955 × 1320 px). We look at its inside: the whole panel is lined with a thin, translucent oil-paint wash that melts from lilac (#B7A3CC) at the top into pond blue (#6F8FAE) toward the bottom, laid in soft, broad, visible brush sweeps with the linen weave showing through, a slim edge of bare cream canvas showing along the top and both sides; the top edge is a straight soft fold line (where the flap is hinged). Bright morning light from the top-right, a gentle shade toward the lower half where the pocket will sit. No flap, no front pocket, no seal, no card inside, nothing else. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikdörtgen zarf tuvalde x 7–93 % · y 6–94 %; içi leylaktan havuz mavisine boya lavisi; kapak/cep/mühür yok;
çevresi gerçek alfa, gölge yok.
Kullanım (tema kurulunca): `.env-back` — kapak kalkınca görünen iç; W4 ve W5 aynı tuvalde üstüne biner.

#### W4 Zarfın ön cebi
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/env_front.png` · 1110×1500 · **Şeffaf zemin**

```
Only the front pocket of the same linen-canvas envelope as env_back.png, on the same 1110×1500 canvas and in exactly the same place: the envelope occupies exactly x 7–93% and y 6–94% of the canvas, and the pocket is its lower part — a flat panel of primed cream linen canvas (#F4EEDF, the canvas of canvas_ground.png) spanning the full envelope width (x 7–93%) from 41.2% of the canvas height down to 94%. Its top edge is perfectly STRAIGHT and clean, finished with a narrow turned hem that shows the linen threads; two very soft diagonal fold lines where the side flaps are folded in; two or three faint stray touches of lilac paint near the lower right corner, as if the painter's hand brushed it. Bright morning light from the top-right, a very soft contact shade on the canvas just under the hem. Everything above 41.2% of the canvas height is completely transparent. No flap, no seal, no card, nothing else. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep x 7–93 % · y 41,2–94 %, üst kenar düz; üstü tamamen şeffaf; W3'ün üstüne konunca yan ve alt kenarlar
çakışır; gerçek alfa.
Kullanım (tema kurulunca): `.env-front` — kartın önündeki cep; kart bunun arkasından yükselir.

#### W5 Kapalı düz kapak (dış yüzü boyalı nilüfer havuzu)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/flap.png` · 1110×1500 · **Şeffaf zemin**

```
Only the closed flat flap of the same linen-canvas envelope as env_back.png, on the same 1110×1500 canvas and in exactly the same place: the envelope occupies exactly x 7–93% and y 6–94% of the canvas, and the flap spans its full width (x 7–93%) from the envelope's top edge at 6% of the canvas height down to 44.7%. It is a flat rectangle of primed cream linen canvas whose top edge is a soft rounded fold and whose BOTTOM edge is a softly hand-torn, feathery deckle edge — irregular and fibrous but running straight across overall (not a V, not a point, not scalloped). Its whole outer face is a small plein-air impressionist oil painting of a lily pond, painted right onto the canvas: pond blue and deep pond water (#6F8FAE, #3F5A73) with flickering sky reflections, round lily pads in jade and water sage (#86A889), three or four pink water lilies (#E8B9C1), a few drooping lilac wisteria tendrils (#B7A3CC) entering from the top-right corner, thick visible impasto brushstrokes and broken colour; the paint stops a few millimetres before the torn edge so a slim band of bare cream canvas frames it. Bright morning light from the top-right, the impasto ridges catching it, a very soft contact shade along the torn edge on the flap itself. Everything below 44.7% of the canvas height is completely transparent. No seal, no ribbon, no card, no signature on the painting. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kapak x 7–93 % · y 6–44,7 %; alt kenar yırtık ama genel çizgisi düz (V/sivri değil); dış yüzü kalın fırçalı
nilüfer havuzu; mühür/imza yok; altı tamamen şeffaf.
Kullanım (tema kurulunca): kapalı kapak; mühür (W7) yırtık alt kenarın ortasına oturur; açılışta üst katından 3B kalkar,
90°'den sonra iç yüzü (W6) devralır.

#### W6 Açık kapağın iç yüzü
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/flap_in.png` · 1110×640 · **Şeffaf zemin**

```
The inside face of the same flat linen-canvas flap as flap.png, alone, as it stands upright above the envelope when it is open, seen straight on, on a fully transparent 1110×640 canvas: the flap spans x 7–93% and y 6–94% of this canvas; its BOTTOM edge is the straight soft fold line and its softly hand-torn, feathery deckle edge is at the TOP. The inner face is lined with the same translucent oil-paint wash as env_back.png — lilac (#B7A3CC) melting into pond blue (#6F8FAE) in soft, broad, visible brush sweeps with the linen weave showing through — with a slim band of bare cream canvas along the torn edge. Bright morning light from the top-right. No pond painting on this side, no seal, nothing else. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: katlama çizgisi altta ve düz, yırtık kenar üstte; W3 ile aynı leylak-mavi lavi; gerçek alfa.
Kullanım (tema kurulunca): `.flap-in` — kapak açılınca zarfın üstünde dik dururken görünen iç yüz (kapak kutusuna ölçeklenir).

#### W7 Leylak mum mühür (nilüfer kabartmalı)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/seal.png` · 560×560 · **Şeffaf zemin**

```
A single round wax seal in soft lilac wax (#B7A3CC, deepening to wisteria #9C86BE in the recesses), alone, seen straight from the front, on a fully transparent background, centred and filling about 80% of the square: a slightly irregular, softly rippled poured-wax rim, and a smooth domed centre pressed with a crisp, detailed relief of one open water lily with layered pointed petals resting on a round lily pad, a satin wax sheen with gentle highlights from the top-right. Only the seal — no ribbon, no paper, no envelope under it. No letters, no initials, no monogram, no numbers in the relief. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek leylak mühür; kabartma nilüfer + yaprak; harf/monogram yok; karenin ~%80'i, kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): kapanış — kapağın alt kenarının ortasında, merkez zarf tuvalinde (50 %, 44,7 %), çap zarf
eninin %18'i; dokununca hafifçe kalkıp söner.

#### W8 Fırça darbeleri (açılış maskeleri) — dört ayrı dosya
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/stroke_1.png`, `stroke_2.png`, `stroke_3.png`, `stroke_4.png` · her biri 1400×600 · **Şeffaf zemin**

```
A single broad impressionist oil-paint brushstroke, alone, on a fully transparent background: one confident, slightly arcing horizontal sweep of thick paint laid with a wide flat bristle brush, running across about 85% of the image width and about 60% of the image height at its widest, centred, with a rounded, heavily loaded start at the left and a tapering dry-brush tail at the right. The body of the stroke is solid, fully opaque paint with deep impasto ridges and bristle grooves following the sweep and soft broken colour inside it (lighter and deeper tints of the same hue); only its ragged bristle edges and the dry-brush tail break into fine semi-transparent streaks. Bright morning light from the top-right catching the ridges. No brush, no hand, no canvas under it, no drips, no splatter. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make four strokes, the same size and style, each with a slightly different curve: 1 = lilac #B7A3CC, 2 = pond blue #6F8FAE, 3 = water sage #86A889, 4 = lily pink #E8B9C1.)
```
Kontrol: tek geniş darbe; gövde opak, kenarları kıl izli; dört dosya dört renk (1 leylak, 2 havuz mavisi, 3 water sage
`#86A889`, 4 nilüfer pembesi); kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): açılışta zarfın arkasından sırayla büyüyüp ekranı kaplayan dört maske (alfa = W2'nin
göründüğü yer; darbenin rengi bir an görünür, sonra tablo altından belirir); RSVP gönderilince tek küçük darbe.

#### W9 Zarftaki kart (boş)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/card_small.png` · 1000×1350 · **Şeffaf zemin**

```
A flat vertical invitation card of thick cream canvas paper (#F4EEDF, with the fine linen tooth of canvas_ground.png), alone, seen straight on, on a fully transparent background, the card spanning about x 6–94% and y 6–94% of the image, with softly rounded corners. Its edges carry a light, airy painted border in thick visible impressionist strokes: a few hanging clusters of lilac wisteria (#B7A3CC, #9C86BE) trailing from the two top corners, two small round lily pads in water sage (#86A889) and one pink water lily (#E8B9C1) resting along the bottom edge, a few loose touches of pond blue (#6F8FAE) — all kept within the outer 14% of the card. The whole centre of the card is EMPTY, calm cream paper (the website sets the names and the date there). Bright morning light from the top-right, a very soft contact shade on the card itself only. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kart tuvalin ~x 6–94 % · y 6–94 %; boyalı bordür yalnız kartın dış %14'ünde; orta tamamen boş; yazı yok; gerçek alfa.
Kullanım (tema kurulunca): zarftan sudan yükselir gibi kalkan kart (açılışın sonu) ve home'un ilk kartı; isim, tarih HTML.

#### W10 Gerilmiş tuval pano (foto penceresi 4:5)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/canvas_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A stretched artist's canvas panel seen perfectly straight on (flat, no perspective, no tilt), alone, on a fully transparent background: the panel spans x 6–94% and y 6–94% of the image (60–940 px across, 75–1175 px down), with crisp corners and the slight soft rounding of linen wrapped over a wooden stretcher. Its face is a border band of plein-air impressionist garden painting in thick visible impasto and broken colour — lilac wisteria blossoms (#B7A3CC, #9C86BE), lily pads in jade and water sage (#86A889), pink water lilies (#E8B9C1) and pond-blue (#6F8FAE) water with sparkling light — painted all around the edges, the primed linen weave showing through thin passages. In the middle a rectangular photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it); the painted border around it is about 60 px wide at the sides and 75 px at the top and bottom. Bright morning light from the top-right catching the impasto. No tacks, no easel, no signature. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, dikdörtgen (4:5), ortada; çevresi boyalı bahçe bandı; imza yok; kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): yeşil pencere ölçülür ve şeffaf yapılır; home portresi, hikâye tanıtımı ve Story'nin üç anı bu
panoda. Fotoğraf önce "tablo" gibi belirir (CSS: bulanık + doygun + W1 dokusu üstte), sonra doku erir ve keskin
fotoğrafa döner.

#### W11 Geniş tuval pano (mekân fotoğrafı, 16:9)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/canvas_wide.png` · 1600×1000 · **Şeffaf zemin**

```
A wide stretched artist's canvas panel seen perfectly straight on (flat, no perspective, no tilt), alone, on a fully transparent background: the panel spans x 6–94% and y 6–94% of the image (96–1504 px across, 60–940 px down), the same linen and the same painted edge as canvas_frame.png — a border band of plein-air impressionist garden painting in thick visible impasto and broken colour: lilac wisteria blossoms (#B7A3CC, #9C86BE), lily pads in jade and water sage (#86A889), pink water lilies (#E8B9C1) and pond-blue (#6F8FAE) water. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 118 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it); the painted border is about 58 px at the top and bottom and a narrower 24 px at the left and right. Bright morning light from the top-right. No tacks, no easel, no signature. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, dikdörtgen (16:9), ortada; boyalı kenar üst/altta geniş, yanlarda dar; kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): details'te mekân fotoğrafının panosu (pencere ölçülür); aynı "tablodan fotoğrafa" netleşme.

#### W12 Mor salkım (köşe süsü)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/wisteria.png` · 900×1400 · **Şeffaf zemin**

```
A lush cascade of wisteria hanging down from the top-left, painted as a plein-air impressionist oil study, alone, on a fully transparent background: a twisting woody vine running across the upper left, from which long pendulous racemes of lilac and wisteria-violet blossoms (#B7A3CC, #9C86BE, with paler cream-lilac tips) hang down at different lengths, the longest reaching about 85% of the image height, with fresh leaflets in jade and water sage (#86A889), thick visible brushstrokes and broken colour, light sparkling on the blossoms from the top-right. The cascade occupies the left two thirds of the image; the lower-right third is empty. No trellis, no wall, no sky behind it. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: mor salkım sol üstten sarkar; sağ alt üçte bir boş; fırça darbeleri görünür; kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): home kartının ve bölüm başlarının üst köşeleri (sağda aynalanır); kaydırınca hafif salınım.

#### W13 Nilüfer kümesi (alt bant, ayırıcı)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/lilies.png` · 1400×600 · **Şeffaf zemin**

```
A long, low, horizontal drift of floating lily pads with a small cluster of pink water lilies, painted as a plein-air impressionist oil study, alone, on a fully transparent background: seven or eight round lily pads in jade, water sage (#86A889) and touches of sun gold (#E5C77F), overlapping in a gentle spray, two open pink water lilies (#E8B9C1) with sun-gold centres and one closed bud near the middle, a few short loose strokes of pond blue (#6F8FAE) between the pads suggesting water; the whole spray centred, spanning about 85% of the width and 60% of the height. Thick visible impasto, broken colour, bright morning light from the top-right. No full pond, no rectangle of water, no frame. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay, ortalı; yapraklar + iki pembe nilüfer + tomurcuk; su yalnız birkaç darbe (dikdörtgen havuz yok); kenara
değmiyor; gerçek alfa.
Kullanım (tema kurulunca): bölüm ayırıcı, home ve RSVP kartının alt bandı, imzanın altı.

#### W14 Süzülen parçalar — üç ayrı dosya
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small painted object, alone, on a fully transparent background, centred and filling about 60% of the square, painted as a plein-air impressionist oil study with thick visible brushstrokes and broken colour, bright morning light from the top-right. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files: 1 = one round lily pad in jade and water sage #86A889 with its small notch and a soft highlight; 2 = one small wisteria floret cluster, a few lilac #B7A3CC and wisteria #9C86BE blossoms on a short stalk; 3 = one dragonfly seen from above, its slender body in pond blue #6F8FAE and deep pond #3F5A73, its four wings truly see-through — only fine painted veins and a faint pearly tint, with real transparency between the veins.)
```
Kontrol: tek nesne; üç dosya farklı (yaprak, çiçekçik, yusufçuk); yusufçuk kanatları gerçekten yarı saydam; kenara
değmiyor; gerçek alfa.
Kullanım (tema kurulunca): kaydırınca süzülen nilüfer yaprakları ve çiçekçikler, kanat çırpan yusufçuk (CSS); dosya
yoksa öğe yok (çizilmiş yedek yok).

#### W15 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic with a soft painterly finish, bright morning light from the top-right: the closed linen-canvas envelope of flap.png (its torn-edged flap painted with a small lily pond, the lilac water-lily wax seal of seal.png at the centre of the flap's edge) lying slightly below the centre on a loosely draped, lightly paint-flecked cream canvas drop cloth; at the left two worn artist's brushes with plain unmarked wooden handles and a small wooden palette with dabs of lilac, pond blue, lily pink, water sage and sun gold paint; at the right a fresh sprig of lilac wisteria. Behind, softly out of focus, an impressionist oil painting of a lily pond resting on an easel. The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no signature on the painting. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf ve mühür bütün, altında ≥%5 boşluk; üst %20 sakin; fırça saplarında ve paletteki hiçbir yerde yazı yok.
Kullanım (tema kurulunca): `og-1200x630.jpg` (alta hizalı kırpım, üstten ~%21).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Rosalie & Benjamin; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography with an impressionist feeling of light — a soft pastel palette of
pond blue, lilac, lily pink and cream, luminous hazy morning light from the top-right, gentle sparkle on water and
blossoms, subtle fine grain; ONE fictional couple in their early thirties, the same two people in every photo (they
must not resemble any real person or celebrity): Rosalie — long wavy chestnut hair with a small sprig of lilac flowers
tucked into it, light wheat-toned skin, a slim gold ring; Benjamin — short light-brown hair, a short neat beard, fair
skin. Modern, elegant garden clothing (no costume). Story photos are cropped to 4:5 in a canvas panel: keep faces and
hands in the middle 70%. No text, no frame, no watermark, no readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Hero ve Story fotoğrafları sitede **4:5** kırpılır, tuval panoya (W10) oturur.

#### 2.1 Ana portre
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Rosalie and Benjamin, in their early thirties (Rosalie: long wavy chestnut hair with a small sprig of lilac flowers tucked into it, light wheat-toned skin, a slim gold ring; Benjamin: short light-brown hair, a short neat beard, fair skin; they must not resemble any real person or celebrity) standing close and laughing on a small, gently arched wooden footbridge in a water garden: she in a flowing ivory chiffon gown, he in a soft dove-grey linen suit with a lilac boutonnière, waist-up, faces in the upper middle of the frame; behind them, softly out of focus, cascades of lilac wisteria and the shimmer of a lily pond. Photorealistic, soft pastel palette, luminous morning light from the top-right, subtle grain. A generic garden, not a recognisable place. No frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.2 Story 1 — "A rowboat on the pond"
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) in a small wooden rowboat drifting among lily pads and pink water lilies, he at the oars smiling at her, she laughing and trailing one hand in the water, a weeping willow and soft sparkling light on the pond behind them. Photorealistic, same pastel palette and grain, morning light from the top-right. No readable signs. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.3 Story 2 — "Painting in the garden"
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5: the same couple as hero_portrait.jpg in a sunny garden beside a lily pond, she seated at a wooden easel holding a brush, painting a loose, unfinished impressionist study of the pond, he standing behind her with his arms wrapped around her shoulders, both smiling, wisteria softly out of focus behind them. The canvas on the easel shows only loose brushstrokes of water and lilies — no signature, no letters. Photorealistic, same pastel palette and grain, morning light from the top-right. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.4 Story 3 — "Beneath the wisteria"
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, beneath hanging racemes of lilac wisteria, soft lilac-tinted dappled morning light falling over the hands, a few blurred blossoms in the foreground, shallow depth of field. Photorealistic, same pastel palette and grain. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.5 Mekân
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: a water garden prepared for a wedding ceremony — a long rustic wooden arch heavily draped with lilac wisteria at the edge of a still lily pond with pink water lilies, two rows of simple white garden chairs on the lawn with a central aisle facing the arch, weeping willows on the far bank and, far in the distance, a small curved wooden footbridge. No people, no signs, no religious objects. A generic garden, not a real or recognisable place. Photorealistic, luminous morning light from the top-right, same soft pastel palette. No text, letters, numbers, monograms, logos or watermarks.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın `'painted-lily-pond'` bloğu
> **henüz yok** — tema kurulunca eklenecek (G441 benzeri iş); o zamana kadar bu iki dosya yalnız kaynak olarak bekler.
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden süsleme yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 tamamen boş; arka yüzde %13'ün altı ve %9–%91
> genişlik boş (program + QR oraya; QR'ı GPT çizmez, `tools/make_qr.py`). Önerilen kutular (yüzde: üst, sağ, alt, sol)
> ön `[22, 13, 12, 13]`, arka `[16, 12, 10, 12]` — gerçek görselde ölçülür.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema kurulurken `layouts.ts`'e `'painted-lily-pond'` bloğu eklenir: `sources` → `{ front:
>    'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme painted-lily-pond` ve `node scripts/print-sample.ts
>    --theme painted-lily-pond --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm cream primed linen canvas paper of canvas_ground.png (#F4EEDF). Across the top, painted in thick visible plein-air impressionist brushstrokes and broken colour, a soft garland of hanging lilac and wisteria blossoms (#B7A3CC, #9C86BE, as wisteria.png) with a few fresh leaflets, spreading between 8% and 92% of the width, its lowest blossoms staying above 17% of the height. Along the bottom, a low horizontal drift of lily pads in water sage (#86A889) with two pink water lilies (#E8B9C1, as lilies.png) and a few loose strokes of pond blue (#6F8FAE), between 8% and 92% of the width, from 93% of the height down to about 98%. All ornament stays between 8% and 92% of the width; only the plain canvas paper reaches the side edges. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no blossom, no petal, no stroke, no line, no shadow, no stain in it. Bright morning light from the top-right. No signature. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; mor salkım yalnız üstte (%17'nin üstünde), nilüferler yalnız altta
(%93'ün altında); süsleme yanların %8'ine girmiyor; yazı/imza yok.

#### P2 — Arka yüz
**Kaydet:** `collections/41_Painted_Lily_Pond/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream primed linen canvas paper, only a small painted spray of hanging lilac wisteria (as wisteria.png) at the top centre, between 30% and 70% of the width, its lowest blossoms staying above 11% of the height, in the same thick impressionist brushstrokes. Everything below 13% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no blossom, no stroke, no line, no shadow, no stain. Bright morning light from the top-right. No signature. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada küçük mor salkım (%11'in üstünde); %13'ün altı tamamen boş; yazı yok.

---

PAKET 3/7 (Etsy ilan sahneleri) bu dosyada yok: tema `painted-lily-pond` kurulunca `tools/paket7_ilan.py` ile üretilecek.
