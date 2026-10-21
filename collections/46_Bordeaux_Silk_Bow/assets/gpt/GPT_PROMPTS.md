# GPT görsel istekleri — Tasarım 46 · Bordeaux Silk Bow

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> initials, monograms, crests, logos, QR codes or watermarks in any image** (the cards, the prints and the letters in
> the photos included — any handwriting must be unreadable). Ivory is the main colour and claret is the accent: no dark
> claret pages, no velvet, no roses, no autumn leaves. Give W1 `ivory_linen.png`, W3 `env_back.png` and W7 `bow.png` as
> the style reference of every later part: the same ivory linen, the same glossy claret silk satin ribbon of the same
> width, the same soft studio light from the top-left with bright, clean light streaks along the satin.

Bu dosya tasarım 46'nın **bütün görsel parçalarının** tek kaynağıdır (`docs/33_GPT_YENI_10_TASARIM.md`, 4. dalga 39–48).
Durum `concept`: platform teması (`platform/themes/bordeaux-silk-bow/`) **henüz yok**, geçici görsel de yok; tema ayrı bir
görevle kurulunca parçalar buradaki adlarla okunur (çizilmiş yedek yok, K21). Kişisel alanlar (isimler, tarih, baş
harfler, monogram) hiçbir görsele pişmez; sitede HTML metindir. QR'ı GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/46_Bordeaux_Silk_Bow/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/46_Bordeaux_Silk_Bow --paket 5` ve `--paket 2` (ölçü, oran,
  gerçek alfa, kenar payı, foto penceresi). Tema kurulunca: `python3 platform/themes/bordeaux-silk-bow/build_images.py`
  (G167 düzeni: her parça geldiği anda kullanılır), `python3 tools/gpt_kuru_deneme.py --tema bordeaux-silk-bow --sekil
  collections/46_Bordeaux_Silk_Bow/assets/gpt/kuru_sekil.json` (prova), theme-check ve göz kontrolü. PAKET 6 için aşağıdaki
  "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **photorealistic studio still life of silk satin and linen** — real double-faced claret silk satin ribbon with
  bright light streaks along every fold, real heavy ivory linen bookcloth over card, real ivory moiré silk, real white
  tulips; the quiet "old money" of a winter wedding in an old city club: classic, romantic, rich. Ivory dominates; claret
  is the accent. Not velvet (07 Burgundy Velvet'ten ayrı), not dark oxblood pages (21 Crimson Rose'dan ayrı), not a pink
  square envelope (03'ten ayrı), no roses, no dahlias, no autumn leaves, no glitter.
- Kurdele: aynı claret satin her parçada — parlak, dökümlü, iki yüzü aynı renk; zarfta eni zarf eninin %12'si.
- Renkler: claret `#7A1E2C` · claret deep `#4D1019` (gölgeli kıvrım) · silk sheen `#A63A49` (parlak ışık çizgisi) ·
  ivory `#F7F1E6` · linen `#EADFCC` · oyster `#D9CDB8` · soft gold `#BFA06A` (yalnız ince çizgi) · ink `#2A1316`.
- Işık: yumuşak **stüdyo ışığı sol üstten**, satende parlak temiz ışık çizgileri; bütün parçalarda aynı. Şeffaf parçalarda
  gerçek alfa, nesne tuvalin en az %6 içinde (dikişsiz kurdele parçalarında yalnız iki uç kenara değer), nesnenin dışında
  düşen gölge ya da hâle yok (gölgeyi site ekler).
- Gerçek bir mekâna, markaya, sanatçıya ya da başka bir satıcının tasarımına benzemesin. Foto penceresi yalnız W12 ve
  W14'te; diğer parçalarda pencere yok.

## Kapalı zarf geometrisi (W3–W8 buna göre)
Zarf **dikey (0,72:1)**, arkadan görünür. Beş katman (W3 arka, W4 ön cep, W5 kapak, W7 fiyonk, W8 çözülmüş kurdele)
**aynı 1080×1500 tuvalde, aynı konumda** çizilir; zarf her katmanda tuvalin **x %7–93, y %6–94**'ünü kaplar (tuval
yüzdeleri; parantezde zarfın yüzdesi):
- **Ön cep (W4):** tam genişlik, düz üst kenarı %39'da (zarfın %38'i), zarfın alt kenarına (%94) kadar.
- **Düz kapak (W5):** üst katlama çizgisi %6; düz alt kenarı %43'te (zarfın %42'si) — cebin üst kenarını ~%4 örter.
- **Delikler:** yatayda ortada (%50); kapaktaki %38'de (zarfın %36'sı), cepteki %48'de (zarfın %48'i); her biri tuval
  eninin ~%4'ü (≈45 px), temiz zımbalanmış yuvarlak.
- **Kurdele:** eni tuval eninin ~%10'u (≈110 px; zarf eninin %12'si). İçeriden geçer: bir ucu kapak deliğinden, öteki cep
  deliğinden öne çıkar; iki uç kapağın önünde **büyük fiyonkla** bağlanır.
- **Fiyonk (W7):** düğüm merkezi (%50, %41) (zarfın %50, %40'ı); ilmekler x %20–80 (zarf eninin %70'i), dikeyde yaklaşık
  %33–%49 (iki deliği örter); uzun kuyruklar %83'e (zarfın %88'i) iner, uçları V kesik.
- **Çözülmüş hâl (W8):** fiyonksuz, kapak deliğinden (%38) cep deliğine (%48) inen düz dikey kurdele parçası.
- Kat sırası (alttan üste): W3 arka → kart (W11) → W4 cep → W5 kapak → W8 / W7 kurdele.

Açılış: fiyonk **ilmek ilmek çözülür** (W7 → W8: ilmekler gevşeyip düğüme, düğüm düz kurdeleye) → kurdele deliklerden
yukarı çekilip çıkar ve ekranın kenarından aşağı akan **uzun kurdeleye** dönüşür (W9 + W10; home boyunca kaydırmayla
bölümlerin önünden/arkasından dolanır) → düz kapak üst katlama çizgisinde 3B açılır (iç yüz W6) → kart yükselir → home.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Fildişi keten (zarf, kart)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/ivory_linen.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of fine ivory linen (#F7F1E6 with soft slub threads toward #EADFCC), like the bookcloth of a beautifully bound old album: a crisp, even plain weave with gentle natural slubs, a faint dry lustre on the threads, an even warm tone with only the gentlest variation. Evenly lit by soft studio light from the top-left, no fold, no crease, no fraying, no stain, no shadow, no vignette, no printing, no pattern. Calm enough for dark ink text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); fildişi `#F7F1E6` civarı, ince keten dokusu; leke/kat yok; koyu yazı okunur.
Kullanım: tema kurulunca zarfın rengi/dokusu referansı, home kartı, davet bandı, RSVP formu.

#### W2 Fildişi hare ipek (sayfa zemini)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/ivory_moire.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat texture of very pale ivory moiré silk (#F7F1E6, its watermark ripples barely shifting toward #EADFCC): the soft flowing wood-grain-like ripples of real moiré taffeta, very low contrast, a gentle pearly sheen, so calm that text in any colour reads on it everywhere. Perfectly flat and evenly lit by soft studio light from the top-left: no folds, no wrinkles, no seams, no pattern other than the faint moiré, no stains, no shadow, no vignette. Edges tile without a seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: çok açık fildişi, hare dalgaları çok hafif; dikişsiz; kırışık/leke yok; her yerde yazı okunur.
Kullanım: tema kurulunca bütün sayfaların zemini ve açılış (kapalı zarf) sayfası.

#### W3 Zarfın arkası (içi bordo ipek astar)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/env_back.png` · 1080×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope made of the ivory linen of ivory_linen.png (linen bookcloth over stiff card, crisp and structured), seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas (0.72:1). We see its inside: it is lined with smooth claret silk (#7A1E2C) with a soft lustre and one long gentle light streak from the top-left, deepening to #4D1019 toward the bottom, the silk covering the panel almost completely, with a slim margin of ivory linen showing along the top and both sides; a gentle shade toward the bottom where the front pocket will sit. No flap, no front pocket, no ribbon, no holes, no card inside. Soft studio light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikey panel x %7–93 · y %6–94; iç yüz bordo ipek astar, kenarlarda ince fildişi keten pay; kapak/cep/kurdele yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — kapak açılınca kartın arkasında görünen bordo ipek iç.

#### W4 Zarfın ön cebi (ortada küçük delik)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/env_front.png` · 1080×1500 · **Şeffaf zemin**

```
Only the front pocket of the same ivory linen envelope as env_back.png, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas; the pocket spans the full envelope width (x 7–93%) from a STRAIGHT top edge at 39% of the canvas height down to the envelope's bottom edge at 94%, the top edge finished as a crisp folded edge with the faint thickness of the card visible. Horizontally centred, at 48% of the canvas height, one small neat round punched hole about 4% of the canvas width across, cleanly cut, the hole itself truly transparent (real alpha). The ivory linen of ivory_linen.png, the soft fold lines of the side and bottom flaps barely visible, soft studio light from the top-left. Everything above the pocket's edge is completely transparent. No flap, no ribbon, no card, no seal. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep tam genişlik, düz üst kenarı %39'da; ortada %48'de küçük şeffaf delik; üstü tamamen şeffaf; kurdele yok; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart bunun arkasından yükselir; kurdele kalkınca deliği görünür.

#### W5 Düz kapak (kapalı, dış yüz, küçük delik)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/flap.png` · 1080×1500 · **Şeffaf zemin**

```
Only the closed flap of the same ivory linen envelope, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas; the flap spans its full width (x 7–93%), hinged along a softly rounded fold at the envelope's top edge (6% of the canvas height), and ends in a STRAIGHT, crisp bottom edge at 43% of the canvas height with square corners (not a V, not a point, not rounded, not scalloped). Horizontally centred, at 38% of the canvas height, one small neat round punched hole about 4% of the canvas width across, the hole itself truly transparent (real alpha). The ivory linen of ivory_linen.png, a whisper of contact shade on the flap itself just along its bottom edge, soft studio light from the top-left. Everything below the flap's bottom edge is completely transparent. No ribbon, no bow, no seal, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kapak üstten %43'e, düz alt kenar, köşeler keskin; ortada %38'de küçük şeffaf delik; kurdele yok; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapalı kapak; kurdele çıkınca üst katlama çizgisinde 3B kalkar, arkasında W6 görünür.

#### W6 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/flap_in.png` · 1080×640 · **Şeffaf zemin**

```
The inside of the same straight envelope flap, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background: the outline of flap.png mirrored vertically — a wide rectangle spanning x 7–93% of the width (exactly as wide as the envelope), its fold edge at the BOTTOM along 93% of the image height and its straight free edge at the TOP along 7%, square corners. The inside is lined with the same smooth claret silk (#7A1E2C) as env_back.png, with a soft lustre and one long light streak from the top-left, a slim margin of ivory linen along the free edge and the sides. Horizontally centred, at 19% of the image height, the same small round punched hole as flap.png (about 4% of the image width across), truly transparent. Soft studio light from the top-left. No ribbon, no bow. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikdörtgen, katlama kenarı altta (%93), serbest kenar üstte (%7); bordo ipek astar; %19'da küçük delik; gerçek alfa.
Kullanım: tema kurulunca kapak açıldığında zarfın üstünde dik duran iç yüz (3B dönüşün arka yüzü).

#### W7 Büyük bordo saten fiyonk (kapanış)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/bow.png` · 1080×1500 · **Şeffaf zemin**

```
A large, generous bow of glossy claret silk satin ribbon (#7A1E2C, deep folds #4D1019, bright light streaks #A63A49) that closes the same ivory linen envelope, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background — the envelope itself is NOT drawn, only the ribbon. The envelope occupies exactly x 7–93% and y 6–94% of the canvas. The ribbon is about 10% of the canvas width wide; its two ends emerge from two small holes at the horizontal centre (at 38% and at 48% of the canvas height — both hidden under the bow) and are tied in front in one big, full, soft bow whose knot sits at 50% of the width and 41% of the height: two plump loops spreading from 20% to 80% of the width and from about 33% to 49% of the height, a neatly gathered knot, and two long tails falling gracefully over the envelope with one soft twist each, ending in clean V-cut swallowtail tips at about 83% of the height, one a little left of centre, one a little right. Real double-faced silk satin with crisp folds and bright, clean light streaks along every curve in soft studio light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek büyük fiyonk, düğüm (%50, %41); ilmekler x %20–80; kuyruklar %83'e iner, V kesik; zarf çizilmemiş; parlak saten; gerçek alfa.
Kullanım: tema kurulunca kapalı zarfın kapanışı; açılışta ilmek ilmek çözülür (ölçek + maske), yerine W8 gelir.

#### W8 Çözülmüş kurdele (fiyonksuz, deliklerden geçen düz parça)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/knot.png` · 1080×1500 · **Şeffaf zemin**

```
The untied state of the same claret silk satin ribbon on the same ivory linen envelope, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background — the envelope itself is NOT drawn, only the ribbon. The envelope occupies exactly x 7–93% and y 6–94% of the canvas. The bow is gone: one flat, straight vertical band of the same glossy claret satin, about 10% of the canvas width wide (from 45% to 55% of the width), running from the small hole in the flap at 38% of the canvas height down to the small hole in the pocket at 48%; at each end the satin is gathered into soft pleats as it disappears into the hole, and across its middle there are two or three soft creases where the bow had been tied. Bright light streaks along its length in soft studio light from the top-left. No bow, no loops, no tails. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek düz dikey kurdele x %45–55, %38'den %48'e; uçlar deliklere büzülerek girer; fiyonk/kuyruk yok; gerçek alfa.
Kullanım: tema kurulunca fiyonk çözülünce kalan hâl; sonra yukarı çekilip deliklerden çıkar ve akan kurdeleye (W9/W10) dönüşür.

#### W9 Akan kurdele — düz parça (dikey dikişsiz)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/ribbon_tile.png` · 1200×1200 · **Şeffaf zemin** · dikey dikişsiz

```
A straight vertical length of the same glossy claret silk satin ribbon (#7A1E2C, light streak #A63A49), seen perfectly flat and straight on, on a fully transparent background: the ribbon is exactly 200 px wide and runs straight down the horizontal middle of the canvas (from x 500 px to x 700 px), from the top edge to the bottom edge. Its top and bottom ends must join seamlessly when copies are stacked vertically: the same width, the same straight edges and the same soft sheen at the top as at the bottom, one long gentle light streak running down its left third along the whole length, no twist, no crease, no knot. Soft studio light from the top-left. Apart from the ribbon's two cut ends, which run straight off the top and bottom edges, keep the WHOLE object at least 6% inside every edge of the canvas: nothing else may touch or be cut by the image border, and the background must be fully transparent on both sides of the ribbon. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kurdele 200 px, x 500–700; üst ve alt uç dikişsiz eklenir; iki yanı tamamen şeffaf; kıvrım/düğüm yok; gerçek alfa.
Kullanım: tema kurulunca ekranın kenarından aşağı akan kurdelenin düz bölümleri (dikey tekrar).

#### W10 Akan kurdele — S kıvrımı
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/ribbon_curl.png` · 1200×1200 · **Şeffaf zemin**

```
A length of the same glossy claret silk satin ribbon, 200 px wide, flowing in one graceful S-curve, seen straight on, on a fully transparent background: it enters straight down from the top edge exactly between x 500 px and x 700 px, swings softly out to one side and back across to the other side in a smooth S, with one gentle half-twist that shows the same claret on its reverse face, and leaves straight down through the bottom edge again exactly between x 500 px and x 700 px, so it joins ribbon_tile.png above and below without a seam (same width, same colour and sheen at the ends). At its widest the ribbon stays within x 250 px to x 950 px. Bright light streaks follow every curve in soft studio light from the top-left. Apart from the ribbon's two cut ends, which run straight off the top and bottom edges, keep the WHOLE object at least 6% inside every edge of the canvas: nothing else may touch or be cut by the image border, and the background must be fully transparent on both sides of the ribbon. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: üst ve alt uç dikey, x 500–700'de kenara değer; S kıvrımı x 250–950 içinde; iki yanı şeffaf; gerçek alfa.
Kullanım: tema kurulunca akan kurdelenin bölümler arasında dolandığı kıvrımlar (W9 parçalarının arasına eklenir).

#### W11 Küçük kart (zarftan yükselen, boş)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat vertical invitation card, alone, seen perfectly straight on, on a fully transparent background: the card occupies x 7–93% and y 6–94% of the canvas. Thick ivory cotton card with a fine linen finish (as ivory_linen.png, a touch smoother), a softly torn deckle edge on all four sides, a very fine soft-gold hairline (#BFA06A) inset about 6% from the card's edge, and at the top centre a small bow of the same glossy claret silk satin ribbon as bow.png, about 24% of the card's width, its two short V-cut tails lying on the card. Below the bow the card is completely EMPTY paper (the website sets the names, the date and the venue there in HTML). A very soft contact shade under the bow on the card itself, soft studio light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tırtıklı fildişi kart, ince altın kıl çizgi; üst ortada küçük bordo fiyonk; altı boş; yazı yok; gerçek alfa.
Kullanım: tema kurulunca zarftan yükselen kart ve home kartı; isimler, tarih ve mekân HTML olarak fiyonkun altına.

#### W12 Anı baskısı (foto penceresi)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/keepsake_print.png` · 1000×1250 · **Şeffaf zemin**

```
An old black-and-white keepsake photographic print, alone, seen perfectly straight on, on a fully transparent background: the print's paper occupies x 6–94% and y 6–94% of the canvas, with a warm ivory deckled border (a decorative wavy-cut edge all around), softly rounded corners, the faint satin sheen of old fibre photo paper and a fine soft-gold hairline (#BFA06A) framing the picture area about 15 px outside it. In the middle a vertical photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 120 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The ivory border is slim at the top and the sides and a little deeper at the bottom. Soft studio light from the top-left. No ribbon, no photo corners, no tape. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 760×950 (4:5), sol üst (120, 120); sıcak fildişi tırtıklı kenar, yuvarlak köşe, ince altın çizgi pencerenin dışında; gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür (`window_pct`) ve şeffaf yapılır; home portresi, hikâye tanıtımı ve Story'nin üç anı (anı destesi) bu baskıda, üstünde W13 kurdele.

#### W13 Desteyi bağlayan kurdele
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/bundle_ribbon.png` · 1000×1250 · **Şeffaf zemin**

```
A claret silk satin ribbon tied around a small stack of prints, alone, on the same 1000×1250 canvas as keepsake_print.png and over exactly the same rectangle as that print (x 6–94% and y 6–94% of the canvas), on a fully transparent background — the prints themselves are NOT drawn, only the ribbon. One straight vertical band of the same glossy claret satin as bow.png, about 8% of the canvas width wide, centred at 70% of the width, runs from the print's top edge at 6% to its bottom edge at 94%; one straight horizontal band of the same width, centred at 72% of the height, runs from the print's left edge at 6% to its right edge at 94%; at each of the four ends the ribbon turns softly over the edge, as if wrapping round behind the stack. Where the two bands cross (70% of the width, 72% of the height) they are tied in a neat, full bow about 30% of the canvas wide, its two short tails with V-cut ends lying over the lower right of the print. Bright light streaks along the satin in soft studio light from the top-left. Everything except the ribbon is completely transparent. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikey bant x ~%70'te, yatay bant y ~%72'de, uçları baskının kenarında (%6–94); kesişimde fiyonk; kurdele dışı şeffaf; gerçek alfa.
Kullanım: tema kurulunca W12'nin üstünde (anı destesinin bağı); kaydırınca fiyonk gevşer, kurdele kayar, fotoğraflar tek tek yelpaze gibi açılır.

#### W14 Geniş anı baskısı (mekân, foto penceresi)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/keepsake_wide.png` · 1600×1000 · **Şeffaf zemin**

```
A wide old keepsake photographic print, the same paper, the same warm ivory deckled border, softly rounded corners and the same fine soft-gold hairline (#BFA06A) as keepsake_print.png, alone, seen perfectly straight on, on a fully transparent background: the print's paper occupies x 6–94% and y 6–94% of the canvas. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 115 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The deckled border is narrow at the sides and a little deeper at the top and the bottom. Soft studio light from the top-left. No ribbon, no photo corners, no tape. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 1360×765 (16:9), sol üst (120, 115); fildişi tırtıklı kenar, ince altın çizgi; gerçek alfa.
Kullanım: tema kurulunca details'te mekân fotoğrafının baskısı (pencere ölçülür).

#### W15 Beyaz laleler (köşe süsü)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/tulips.png` · 1000×1300 · **Şeffaf zemin**

```
A loose spray of white tulips reaching from the top-left corner toward the centre, photorealistic, alone, on a fully transparent background: four elegant white tulips (#FBF8F2 petals with the faintest cool shading), two of them opening softly, one still a closed bud, on long gently curving stems with a few long, smooth, silvery sage-grey leaves, the stems tied together with a short length of the same glossy claret silk satin ribbon as bow.png, one ribbon end trailing toward the centre with a V-cut tip. The spray begins just inside the top-left corner and leaves the bottom-right third of the canvas empty. Soft studio light from the top-left. No vase, no roses, no other flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: beyaz laleler sol üstten çapraz; bordo kurdele ucu; sağ alt üçte bir boş; gül/vazo yok; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşelerinde (sağda aynalanır), imzada küçük.

#### W16 Küçük bordo fiyonk (bölüm başları)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/bow_small.png` · 600×450 · **Şeffaf zemin**

```
A small, neat bow of the same glossy claret silk satin ribbon as bow.png (#7A1E2C, deep folds #4D1019, light streaks #A63A49), photorealistic, alone, seen straight from the front, on a fully transparent background, centred and about 75% of the canvas wide: two full rounded loops, a tidy gathered knot, two short tails falling down and slightly outward with V-cut ends, bright clean light streaks along the satin in soft studio light from the top-left. No pin, no pearl, no brooch. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek küçük bordo fiyonk; iki ilmek, iki kısa V kesik kuyruk; gerçek alfa.
Kullanım: tema kurulunca bölüm başlıklarının üstünde; RSVP gönderilince "yeniden bağlanan fiyonk" (ölçekle belirir).

#### W17 Süzülen parçalar — iki ayrı dosya
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/accent_1.png`, `accent_2.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small floating object, photorealistic, alone, on a fully transparent background, centred and filling about 60% of the square, not cropped, in soft studio light from the top-left. (Make two files: accent_1.png = one single white tulip petal, smooth and gently cupped, #FBF8F2 with the faintest cool shading; accent_2.png = one short curled end of the same glossy claret silk satin ribbon as bow.png, a loose spiral with a V-cut tip and a bright light streak.) No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: lale yaprağı ve kurdele ucu ayrı dosyalarda, her birinde tek nesne; kesilmemiş; gerçek alfa.
Kullanım: tema kurulunca kaydırmada ve RSVP gönderilince süzülen küçük parçalar.

#### W18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft studio light from the top-left with bright light streaks on satin: the closed portrait ivory linen envelope of env_back.png and flap.png, closed with the large glossy claret silk satin bow of bow.png threaded through its two small holes, its long tails falling over the envelope, lying slightly below the centre on very pale ivory moiré silk (as ivory_moire.png); at the left a loose spray of white tulips (as tulips.png); at the right a small stack of blank old keepsake prints with warm ivory deckled borders (their picture areas plain ivory paper, nothing printed on them) tied crosswise with the same claret ribbon and a small bow (as bundle_ribbon.png). Ivory dominates, claret is the accent. The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope and its bow visible with at least 5% empty margin below them. No people, no roses, no velvet. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf ve fiyonk bütün, altta boşluklu; üst %20 sakin; baskıların resim alanı boş fildişi; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım, üstten ~%21) ve satış sayfası kapak görseli.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Cecilia & Nathaniel; gerçek kişiye benzemesin)

Ortak: classic fine-art wedding photography with a quiet "old money" elegance — 2.1–2.4 in rich black-and-white film
(silvery greys, deep velvety blacks, soft grain), 2.5 in colour; ONE fictional couple in their early thirties, the same two
people in every photo (they must not resemble any real person or celebrity): Cecilia — long glossy dark-brown hair falling
below the shoulders, usually worn in an elegant low chignon, light-medium skin; Nathaniel — short black hair neatly
side-parted, clean-shaven, dark skin. Timeless winter clothing: a long ivory wool coat, a dark tailored overcoat, a
cashmere scarf; on the wedding day an ivory satin gown and a black tuxedo. Photos are cropped to 4:5 inside a deckled
print: keep faces and hands in the middle 70%. No text, no frame, no watermark, no readable signs or handwriting.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Hero ve Story fotoğrafları sitede **4:5** kırpılır; 2.1–2.4 siyah-beyaz, 2.5
renkli.

#### 2.1 Ana portre
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white wedding portrait of the fictional couple Cecilia and Nathaniel, in their early thirties (Cecilia: long glossy dark-brown hair in an elegant low chignon, light-medium skin; Nathaniel: short black hair neatly side-parted, clean-shaven, dark skin; they must not resemble any real person or celebrity) on the wide curving staircase of an old city club: she one step above him in an ivory satin gown, he in a black tuxedo, his hand holding hers on the carved wooden banister, both smiling warmly, waist-up, faces in the upper middle of the frame; behind them, softly out of focus, panelled walls and the glow of a chandelier. Rich black-and-white film, silvery greys, deep blacks, soft grain, soft light from the top-left. No text, letters, numbers, monograms, logos or watermarks. No frame.
```
Kontrol: siyah-beyaz; aynı çift merdivende; yüzler orta-üstte; yazı/tabela yok.
Kullanım: tema kurulunca home kartında W12 baskısının içinde (4:5), anı destesinin en üstteki fotoğrafı.

#### 2.2 Story 1 — "Snow in the city"
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid black-and-white photo: the same couple as hero_portrait.jpg (same faces, hair and skin) in a city park under gently falling snow, she in a long ivory wool coat laughing as he brushes snowflakes from her collar, he in a dark overcoat and cashmere scarf, bare winter trees and old iron lamp posts softly out of focus behind them, snow on the path. A generic place, not a recognisable landmark. Rich black-and-white film, same tones and grain. No readable signs. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: siyah-beyaz; kar, parkta gülüşme; tanınır yer/tabela yok; yazı yok.
Kullanım: tema kurulunca Story 1 (sol), anı destesinden yelpaze gibi açılan ilk baskı.

#### 2.3 Story 2 — "Letters and ribbons"
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white photo: the same couple as hero_portrait.jpg indoors by a tall winter window, she seated reading a handwritten letter with a soft smile, he standing just behind her, leaning over her shoulder, his hand on the back of her chair; on the small table beside them a stack of letters tied with a satin ribbon. The handwriting is NOT readable (soft out-of-focus lines only). Soft window light from the top-left. Rich black-and-white film, same tones and grain. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: siyah-beyaz; mektup okunmuyor (yazı seçilmez); kurdeleli mektup destesi; yazı yok.
Kullanım: tema kurulunca Story 2 (sağ), anı destesinin ikinci baskısı.

#### 2.4 Story 3 — "A ribbon on the ring"
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), his hands holding open a small vintage ring box tied with a loosened satin ribbon (it reads as a deep, glossy dark tone in black and white), her fingers reaching to touch the slim engagement ring inside, the sleeve of her ivory wool coat and his dark cuff visible. Shallow depth of field, hands and fingers natural and correct. Rich black-and-white film, same tones and grain. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: siyah-beyaz; eller ve parmaklar düzgün; kurdeleli yüzük kutusu net; marka/yazı yok.
Kullanım: tema kurulunca Story 3 (sol), anı destesinin son baskısı.

#### 2.5 Mekân
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9 colour photo: the grand salon of an old city club prepared for a winter wedding dinner — ivory panelled walls with fine mouldings, a crystal chandelier glowing softly, claret velvet armchairs along the walls, one long table dressed in ivory linen with low arrangements of white tulips and slim ivory candles, tall windows showing a soft snowy evening outside. Ivory dominates, claret is the accent. A generic place, not resembling any real venue. No people, no signs, no text, no religious objects. Photorealistic, soft warm light from the top-left. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: renkli, yatay; insansız; tabela/dini obje yok; fildişi baskın, bordo vurgu; gerçek mekâna benzemiyor.
Kullanım: tema kurulunca details'te W14 geniş baskıda (16:9).

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın bloğu (`'bordeaux-silk-bow'`)
> **henüz yok** — tema kurulunca eklenecek.
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90, arka yüzde %13'ün altı × %9–%91 **tamamen boş**
> (ön: isimler, tarih, mekân; arka: program + QR — QR'ı GPT çizmez, `tools/make_qr.py`). Süsleme yalnız üst ve alt
> bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema kurulunca `layouts.ts`'e `'bordeaux-silk-bow'` bloğu: `sources` → `{ front: 'print/invitation_front_5x7.png',
>    back: 'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Metin kutularını görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme bordeaux-silk-bow` ve `node scripts/print-sample.ts
>    --theme bordeaux-silk-bow --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the fine ivory linen-finish card of ivory_linen.png. Near the top, a ribbon of the same glossy claret silk satin as bow.png (#7A1E2C, light streaks #A63A49) runs straight across the full width of the sheet at about 4–7% of the height and is tied at the centre in a generous bow; the bow's loops and its two V-cut tails stay above 17% of the height. Along the bottom, centred, two white tulips with slender stems and a few silvery sage-grey leaves laid crossed horizontally (as tulips.png), staying below 92% of the height. Nothing important within 8% of the left and right edges (only the ribbon may run off the sides). The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm card (the names, the date and the venue are set there): no ribbon, no petal, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; kurdele + fiyonk yalnız üstte (%17'nin üstünde), laleler yalnız altta (%92'nin altında); yazı yok.
Kullanım: tema kurulunca `layouts.ts` `'bordeaux-silk-bow'` ön yüz zemini (`cover('front')`); metin HTML/PDF katmanı.

#### P2 — Arka yüz
**Kaydet:** `collections/46_Bordeaux_Silk_Bow/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same ivory linen-finish card, with only a small bow of the same glossy claret silk satin (as bow_small.png) at the top centre, staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY card (a schedule and a QR code are set there): no ribbon, no flower, no line, no shadow, no stain. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada küçük fiyonk (%11'in üstünde); %13'ün altı boş; yazı yok.
Kullanım: tema kurulunca arka yüz zemini (`cover('back')`); program ve QR üstüne basılır.

PAKET 3/7 (Etsy ilan sahneleri) bu dosyada yok: tema kurulunca `tools/paket7_ilan.py` ile üretilecek.
