# GPT görsel istekleri — Tasarım 40 · Swan Chantilly Lace

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> initials, monograms, crests, logos, QR codes or watermarks in any image** (the wax seal, the cards and the prints
> included). The Chantilly lace and the swan engraving are original drawings invented for this design — they must not
> copy any existing lace pattern, print, illustration or seller's design. No pearls and no roses anywhere. Give W1
> `ivory_cotton.png`, W3 `env_back.png` and W7 `lace_overlay.png` as the style reference of every later part: the same
> ivory cotton paper, the same fine ivory Chantilly lace, the same black silk, the same soft north-window light from the
> top-left.

Bu dosya tasarım 40'ın **bütün görsel parçalarının** tek kaynağıdır (`docs/33_GPT_YENI_10_TASARIM.md`, 4. dalga 39–48).
Durum `concept`: platform teması (`platform/themes/swan-chantilly-lace/`) **henüz yok**, geçici görsel de yok; tema ayrı
bir görevle kurulunca parçalar buradaki adlarla okunur (çizilmiş yedek yok, K21). Kişisel alanlar (isimler, tarih, baş
harfler, monogram) hiçbir görsele pişmez; sitede HTML metindir. QR'ı GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/40_Swan_Chantilly_Lace/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/40_Swan_Chantilly_Lace --paket 5` ve `--paket 2` (ölçü, oran,
  gerçek alfa, kenar payı, foto penceresi). Tema kurulunca: `python3 platform/themes/swan-chantilly-lace/build_images.py`
  (G167 düzeni: her parça geldiği anda kullanılır), `python3 tools/gpt_kuru_deneme.py --tema swan-chantilly-lace --sekil
  collections/40_Swan_Chantilly_Lace/assets/gpt/kuru_sekil.json` (prova), theme-check ve göz kontrolü. PAKET 6 için
  aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **photorealistic lace, silk and cotton paper + fine pen-and-ink engraving (only the swans)** — real ivory
  Chantilly lace with its sheer hexagonal net ground, outlined flower sprays and scalloped picot edges; real heavy
  mould-made cotton paper; real black silk satin ribbon with a soft low sheen; real ivory sealing wax. The quiet luxury of
  an old family house by a lake: classic, romantic, rich, calm. Black is only a fine accent (ribbon, lining, ink lines).
  Not flat vector, not clip-art, not gothic, not a costume look.
- Dantel: Chantilly — çok ince altıgen tül zemin üzerinde ipeksi konturlu küçük bahar çiçeği demetleri, yapraklar ve
  kıvrık dallar; tarak (scallop) kenar ve küçük pikolar; dikey eksene göre simetrik. Açık yerler **gerçekten şeffaf**
  (gerçek alfa). Bütün dantelli parçalarda (W6 kenarı, W7, W12, W14, W17, P1/P2) **aynı** dantel. İnci yok, gül yok
  (14 Ivory Lace & Pearls'ten ayrı).
- Kuğu: süzülen genel bir dilsiz kuğu (mute swan); W10, W15 ve P1'de yalnız siyah mürekkep çizgi + tarama (dolgu yok),
  W9'da mum kabartması.
- Renkler: ivory `#F4EEE2` · lace white `#FBF8F2` · oyster `#DCD3C3` · wax ivory `#EDE3CF` · pewter `#8F8A82` · soft gold
  `#B9A274` (çok seyrek) · black silk `#0F0E0D` · ink `#1B1A18`.
- Işık: yumuşak **kuzey penceresi ışığı sol üstten**; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa, nesne tuvalin
  en az %6 içinde, nesnenin dışında düşen gölge ya da hâle yok (gölgeyi site ekler).
- Gerçek bir mekâna, markaya, sanatçıya ya da başka bir satıcının tasarımına benzemesin. Foto penceresi yalnız W11 ve
  W13'te; diğer parçalarda pencere yok.

## Kapalı zarf geometrisi (W3–W9 buna göre)
Zarf **kare (1:1)**, arkadan görünür. Beş katman (W3 arka, W4 ön cep, W5 kapak, W7 dantel örtü, W8 kurdele kuyrukları)
**aynı 1200×1200 tuvalde, aynı konumda** çizilir; zarf her katmanda tuvalin **x %7–93, y %7–93**'ünü kaplar (tuval
yüzdeleri; parantezde zarfın yüzdesi):
- **Ön cep (W4):** tam genişlik; üst kenarı yanlarda %43'te (zarfın %42'si), ortada %52'ye (zarfın %52'si) inen yumuşak
  bir yay; zarfın alt kenarına (%93) kadar.
- **Yay kapak (W5):** üst katlama çizgisi %7; serbest kenarı tek bir dışbükey yay — yan kenarlara %46'da değer, ortada
  geniş yuvarlak en alt noktası %59 (zarfın %60'ı). Kapak cebin üst kenarını her yerde örter (yanda boşluk kalmaz).
- **Dantel örtü (W7):** kapağı tamamen ve biraz fazlasını örter; tarak kenarı kapağın yayını ~%5 aşağıdan izler —
  yanlarda %51, ortada %64 (zarfın %66'sı).
- **Mühür (W9, ayrı 600×600 tuval):** merkezi (%50, %57) (zarfın %50, %58'i), çapı tuval eninin %17'si (zarf eninin %20'si).
- **Kurdele kuyrukları (W8):** mührün altında (%50, %57) çaprazlanır; V kesik uçları yaklaşık (%28, %86) ve (%72, %86).
- Kat sırası (alttan üste): W3 arka → kart (W10) → W4 cep → W5 kapak → W7 dantel → W8 kuyruklar → W9 mühür.

Açılış: mühür hafifçe eğilip kalkar → kuyruklar mührün altından sola ve sağa kayıp düşer → dantel örtü **gelin duvağı
kaldırılır gibi** yukarı kalkıp hafif salınımla süzülerek çıkar → yay kapak üst katlama çizgisinde 3B açılır (iç yüz W6:
siyah ipek, dantel kenar) → fildişi kart yükselir → tek bir beyaz kuğu tüyü (W19) süzülür → home.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Fildişi pamuk kâğıt (kart, form)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/ivory_cotton.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of thick mould-made cotton paper in a soft warm ivory (#F4EEE2), the kind used for fine engraved stationery: a gentle felt tooth, a few faint long cotton fibres, the slightest natural cloudiness in the sheet, an even tone with only the gentlest variation. Evenly lit by soft north-window light from the top-left, no fold, no crease, no deckle edge, no stain, no shadow, no vignette, no printing, no pattern, no lace. Calm enough for fine dark ink text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); fildişi `#F4EEE2` civarı; leke/kat/desen yok; üstüne koyu yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, RSVP formu ve zarftan yükselen kartın kâğıt dokusu.

#### W2 İstiridye ipek-keten (sayfa zemini)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/oyster_silk.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat texture of a very pale oyster silk-and-linen blend fabric (between #DCD3C3 and #E9E3D8), like the quiet wall covering of an old drawing room by a lake: a soft fine slub weave, a faint silky sheen that drifts only very gently across the surface, very low contrast so text in any colour reads on it everywhere. Perfectly flat and evenly lit by soft north-window light from the top-left: no folds, no wrinkles, no pattern, no lace, no stains, no shadow, no vignette. Edges tile without a seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: çok açık, sakin istiridye tonu; dikişsiz; kırışık/desen/dantel yok; her yerde yazı okunur.
Kullanım: tema kurulunca bütün sayfaların zemini ve açılış (kapalı zarf) sayfası.

#### W3 Zarfın arkası (içi siyah ipek astar)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/env_back.png` · 1200×1200 · **Şeffaf zemin**

```
The back panel of an open square envelope made of the ivory cotton paper of ivory_cotton.png, seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas (a perfect square). We see its inside: it is lined with smooth black silk (#0F0E0D) with a soft, low sheen where it catches the light from the top-left, the silk covering the panel almost completely, with a slim margin of ivory cotton paper showing along the top and both sides; a very gentle shade toward the bottom where the front pocket will sit. No flap, no front pocket, no lace, no ribbon, no seal, no card inside. Soft north-window light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kare panel x %7–93 · y %7–93; iç yüz siyah ipek astar, kenarlarda ince fildişi pay; kapak/cep/dantel yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — kapak açılınca kartın arkasında görünen siyah ipek iç.

#### W4 Zarfın ön cebi
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/env_front.png` · 1200×1200 · **Şeffaf zemin**

```
Only the front pocket of the same square ivory cotton envelope as env_back.png, on the same 1200×1200 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the pocket spans the full envelope width (x 7–93%) from its top edge down to the envelope's bottom edge at 93% of the canvas height. Its top edge is one soft, smooth arc: it starts at 43% of the canvas height at both side edges and dips gently to 52% at the horizontal centre, like a shallow smile, cut clean and crisp, the faint thickness of heavy paper visible along the cut. The ivory cotton paper of ivory_cotton.png, the soft fold lines of the two side flaps and the bottom flap barely visible, softly lit by north-window light from the top-left. Everything above the pocket's edge is completely transparent. No flap, no lace, no ribbon, no seal, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep tam genişlik; üst kenarı yanlarda %43, ortada %52'ye inen yumuşak yay; üstü tamamen şeffaf; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart bunun arkasından yükselir; kapak açıkken yay kenarı görünür.

#### W5 Yay kapak (kapalı, dış yüz)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/flap.png` · 1200×1200 · **Şeffaf zemin**

```
Only the closed flap of the same square ivory cotton envelope, on the same 1200×1200 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the flap spans its full width (x 7–93%), hinged along a softly rounded fold at the envelope's top edge (7% of the canvas height). Its free lower edge is ONE smooth convex arc: it meets the two side edges at 46% of the canvas height and bows down to a broad, softly rounded lowest point at the horizontal centre, at 59% of the canvas height (not a V, not a point, not straight, not scalloped). Plain ivory cotton paper of ivory_cotton.png, a whisper of contact shade on the flap itself just along its curved edge, soft north-window light from the top-left. Everything below the flap's edge is completely transparent. No lace, no ribbon, no seal, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kapak tam genişlik; serbest kenarı yanlarda %46, ortada %59'a inen tek yay (V/sivri değil); dantelsiz, mühürsüz; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapalı kapak; açılışta üst katlama çizgisinde 3B kalkar, arkasında W6 görünür.

#### W6 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/flap_in.png` · 1200×720 · **Şeffaf zemin**

```
The inside of the same arched envelope flap, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background: the outline of flap.png mirrored vertically. Its straight fold edge is at the BOTTOM, along 93% of the image height, spanning x 7–93% of the width (exactly as wide as the envelope); its two straight sides rise up to 28% of the image height, and its arched edge bows UP in one smooth curve to a softly rounded highest point at 7% of the image height in the centre. The inside is lined with the same smooth black silk (#0F0E0D) as env_back.png, with a soft low sheen from the top-left, and a narrow trim of fine ivory Chantilly lace (a sheer hexagonal net ground, tiny outlined flowers, a scalloped picot edge) follows the whole arched edge on the silk, its small scallops pointing outward, every open space of the lace truly transparent; a slim margin of ivory cotton paper shows beyond the trim. Soft north-window light from the top-left. No seal, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz katlama kenarı altta (%93), yanlar %28'e, yay ortada %7'ye çıkar; siyah ipek astar + yay boyunca ince dantel; gerçek alfa.
Kullanım: tema kurulunca kapak açıldığında zarfın üstünde dik duran iç yüz (3B dönüşün arka yüzü).

#### W7 Chantilly dantel örtü (kapağı örten)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/lace_overlay.png` · 1200×1200 · **Şeffaf zemin**

```
A separate overlay of fine ivory Chantilly lace that lies over the closed flap of the same square envelope, on the same 1200×1200 canvas and in exactly the same place, on a fully transparent background — the envelope itself is NOT drawn, only the lace. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the lace covers the whole flap and a little more: it spans the full envelope width (x 7–93%), its straight top edge lies along the envelope's top edge at 7%, and its lower edge is a row of soft scallops with tiny picots that follows the flap's arc about 5% lower — it meets the side edges at 51% of the canvas height and reaches its lowest scallop at the centre at 64%. The lace is a sheer, very fine hexagonal tulle net ground with lace-white threads (#FBF8F2) and delicate sprays of small spring flowers, leaves and curling tendrils, each motif outlined with a slightly heavier silky thread, symmetrical about the vertical centre line, richest along the scalloped edge and lighter toward the top. Every open space of the net and between the motifs is truly transparent (real alpha) so whatever lies beneath shows through; the threads are crisp and fine, with the faint silky sheen of real lace in soft north-window light from the top-left. It lies flat with two or three very gentle soft ripples. No pearls, no roses, no beads, no ribbon, no seal. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dantel tam genişlikte, tarak kenarı yanlarda %51, ortada %64; açık yerler gerçekten şeffaf; zarf çizilmemiş; inci/gül yok; gerçek alfa.
Kullanım: tema kurulunca kapalı kapağın üstündeki örtü; açılışta gelin duvağı kaldırılır gibi yukarı kalkıp hafif salınımla süzülerek çıkar.

#### W8 Siyah ipek kurdele kuyrukları (mührün altında)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/ribbon_tails.png` · 1200×1200 · **Şeffaf zemin**

```
Two tails of black silk satin ribbon that cross beneath a wax seal on the same square envelope, on the same 1200×1200 canvas and in exactly the same place, on a fully transparent background — the envelope, the lace and the seal are NOT drawn, only the two ribbon tails. The envelope occupies exactly x 7–93% and y 7–93% of the canvas. Both tails start together under the point where the seal will sit, at 50% of the width and 57% of the height, cross each other there in a soft, slightly flattened X, and then fall diagonally: one runs down to the left and ends at about 28% of the width and 86% of the height, the other runs down to the right and ends at about 72% of the width and 86% of the height. Each tail is a narrow ribbon about 5% of the canvas wide, black silk satin (#0F0E0D) with a soft charcoal sheen along its folds, one gentle twist along each tail, and a neat V-cut swallowtail end. Soft north-window light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: iki kuyruk (%50, %57)'de çaprazlanır; uçlar yaklaşık (%28, %86) ve (%72, %86), V kesik; zarf/mühür çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca mührün altında; açılışta mühür kalkarken kuyruklar sola ve sağa kayıp düşer.

#### W9 Kuğu kabartmalı fildişi mum mühür
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/seal.png` · 600×600 · **Şeffaf zemin**

```
A single ivory sealing-wax seal, seen perfectly straight from the front, on a fully transparent background, centred and filling about 80% of the canvas: a thick round pool of creamy ivory wax (#EDE3CF) with a softly irregular, naturally spread outer edge and a slightly raised rim, its centre pressed with a deep, crisp relief of one single swan gliding to the left in side view — a graceful curved neck, softly raised folded wings, three short ripple lines beneath it. The relief catches soft north-window light from the top-left with gentle highlights and soft shading inside the impression; a faint pearly lustre in the wax and a few tiny air bubbles. No letters, no initials, no monogram, no border text, no crest, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek fildişi mühür; ortada süzülen tek kuğu kabartması; harf/monogram yok; düzensiz mum kenarı; gerçek alfa.
Kullanım: tema kurulunca kapağın ucunda (%50, %57), çapı zarf eninin %20'si; açılışta hafifçe eğilip kalkar.

#### W10 Küçük kart (zarftan yükselen, boş)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/card_small.png` · 1000×1300 · **Şeffaf zemin**

```
A flat vertical invitation card, alone, seen perfectly straight on, on a fully transparent background: the card occupies x 7–93% and y 6–94% of the canvas. Thick ivory cotton paper as ivory_cotton.png with a softly torn deckle edge on all four sides, a single fine black hairline border (#1B1A18) inset about 6% from the card's edge, and at the top centre, inside the border, a small fine pen-and-ink engraving of a pair of mute swans gliding toward each other (drawn only in crisp black ink lines and fine hatching, no fill), about 30% of the card's width. Below the swans the card is completely EMPTY paper (the website sets the names, the date and the venue there in HTML). A very soft contact shade on the card itself along the deckle, soft north-window light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tırtıklı fildişi kart; ince siyah kıl çizgi bordür; üst ortada küçük kuğu çifti gravürü; altı boş; yazı yok; gerçek alfa.
Kullanım: tema kurulunca zarftan yükselen kart ve home kartı; isimler, tarih ve mekân HTML olarak kuğuların altına.

#### W11 Eski gümüş jelatin baskı (foto penceresi)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/print_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A vintage black-and-white silver gelatin photographic print, alone, seen perfectly straight on, on a fully transparent background: the print's paper occupies x 6–94% and y 6–94% of the canvas, with a crisp, cool bright white deckled border (a decorative wavy-cut edge all around, like old family photographs), square corners, the faint pearly sheen and the very slight curl of fibre-based photo paper, a fine silvery tone at the outermost edge of the border. In the middle a vertical photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 120 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The white border is slim at the top and the sides and a little deeper at the bottom. Soft north-window light from the top-left. No lace, no ribbon, no photo corners, no tape. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 760×950 (4:5), sol üst (120, 120); tırtıklı beyaz kenar, köşeler düz; dantel yok; gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür (`window_pct`) ve şeffaf yapılır; home portresi, hikâye tanıtımı ve Story'nin üç anı bu baskıda, üstünde W12 duvak.

#### W12 Dantel duvak (baskıyı örten)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/lace_veil.png` · 1000×1250 · **Şeffaf zemin**

```
A veil of the same fine ivory Chantilly lace as lace_overlay.png, alone, on the same 1000×1250 canvas as print_frame.png and covering exactly the same rectangle as that print (x 6–94% and y 6–94% of the canvas), on a fully transparent background — the print itself is NOT drawn, only the lace. The veil's straight top edge lies along 6% of the height, its sides along 6% and 94% of the width, and its lower edge is a row of soft scallops with tiny picots whose lowest points reach 94% of the height. A sheer hexagonal tulle net ground with delicate outlined sprays of small flowers and tendrils, richest along the scalloped lower edge and around the outer border, much lighter and more open in the middle so a photograph beneath would still be glimpsed; every open space of the net is truly transparent (real alpha). The lace hangs flat with two or three very soft vertical ripples, the threads crisp in soft north-window light from the top-left. No pearls, no roses, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dantel baskıyla aynı kutuda (x %6–94, y %6–94); alt kenar tarak; ortası seyrek; açık yerler şeffaf; baskı çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca W11'in tam üstünde; fotoğrafın sahnesi gelince yavaşça yana/yukarı kalkar (dantel perde açılışı).

#### W13 Geniş baskı (mekân, foto penceresi)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/print_wide.png` · 1600×1000 · **Şeffaf zemin**

```
A wide vintage black-and-white silver gelatin print, the same paper and the same crisp cool white deckled border as print_frame.png, alone, seen perfectly straight on, on a fully transparent background: the print's paper occupies x 6–94% and y 6–94% of the canvas, square corners, a faint pearly sheen. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 115 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The deckled border is narrow at the sides and a little deeper at the top and the bottom. Soft north-window light from the top-left. No lace, no ribbon, no photo corners, no tape. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 1360×765 (16:9), sol üst (120, 115); tırtıklı beyaz kenar; gerçek alfa.
Kullanım: tema kurulunca details'te mekân fotoğrafının baskısı (pencere ölçülür); üstünde W14 geniş duvak.

#### W14 Geniş dantel duvak
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/veil_wide.png` · 1600×1000 · **Şeffaf zemin**

```
A wide veil of the same fine ivory Chantilly lace as lace_overlay.png, alone, on the same 1600×1000 canvas as print_wide.png and covering exactly the same rectangle as that print (x 6–94% and y 6–94% of the canvas), on a fully transparent background — the print itself is NOT drawn, only the lace. A straight top edge along 6% of the height, the sides along 6% and 94% of the width, and a lower edge of soft scallops with tiny picots whose lowest points reach 94% of the height. A sheer hexagonal tulle net ground with delicate outlined flower sprays and tendrils, richest along the scalloped lower edge and the outer border, light and open across the middle; every open space of the net is truly transparent (real alpha). It hangs flat with a few very soft vertical ripples, the threads crisp in soft north-window light from the top-left. No pearls, no roses, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dantel W13'le aynı kutuda (x %6–94, y %6–94); alt kenar tarak; ortası seyrek; açık yerler şeffaf; gerçek alfa.
Kullanım: tema kurulunca W13'ün tam üstünde; mekân bölümü gelince yana kalkar.

#### W15 Kuğu çifti (kalem-mürekkep gravür)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/swans.png` · 1400×800 · **Şeffaf zemin**

```
A pair of mute swans gliding on calm water, drawn as a fine pen-and-ink engraving, alone, on a fully transparent background, centred and about 80% of the canvas wide: two swans in side view a little apart, facing each other, their long necks curved gracefully and turned slightly toward one another (not touching, not forming a heart), wings softly raised over their backs, a few short horizontal ripple lines and a hint of broken reflection beneath each bird. Drawn ONLY in crisp black ink lines (#1B1A18) with fine parallel hatching and cross-hatching for the shading, like a classic copperplate book engraving, the hatching implying soft light from the top-left; there is NO white, ivory or grey fill and no wash — between the lines the canvas is transparent, so the paper beneath reads as the swans' white plumage. No reeds, no frame, no border, no landscape, no moon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: iki kuğu, boyunlar hafifçe birbirine dönük (kalp değil); yalnız siyah çizgi ve tarama, dolgu yok; kısa su çizgileri; gerçek alfa.
Kullanım: tema kurulunca home imzası, küçük kartın üstü ve RSVP formunun başı; RSVP gönderilince kuğu çifti suda yatay süzülür.

#### W16 İnci çiçeği dalları (köşe süsü)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/lily_valley.png` · 1000×1200 · **Şeffaf zemin**

```
Delicate sprays of lily of the valley hanging from the top-left corner toward the centre, photorealistic, alone, on a fully transparent background: three slender arching stems, each with a row of small nodding bell-shaped flowers in pure lace white (#FBF8F2) with tiny flared scalloped rims, two broad glossy natural leaves curving behind them, and a short end of black silk satin ribbon (#0F0E0D) with a V-cut tip tied loosely around the stems. The sprays begin just inside the top-left corner and reach diagonally toward the centre, leaving the bottom-right third of the canvas empty. Soft north-window light from the top-left. No vase, no other flowers, no pearls. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: inci çiçeği dalları sol üstten çapraz; siyah ipek kurdele ucu; sağ alt üçte bir boş; inci/vazo yok; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşelerinde (sağda aynalanır), imzada küçük.

#### W17 Dantel şerit (bölüm ayırıcı, yatay dikişsiz)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/lace_band.png` · 2400×440 · **Şeffaf zemin** · yatay dikişsiz

```
A long horizontal band of the same fine ivory Chantilly lace as lace_overlay.png, seen perfectly flat and straight on, on a fully transparent background: the band is exactly 220 px tall and sits in the vertical middle of the canvas (from 110 px to 330 px, that is 25–75% of the height), with a scalloped picot edge along both its top and its bottom, a sheer hexagonal tulle net ground and a continuous row of small outlined flower sprays and tendrils repeating evenly along its whole length. The band runs straight across the full width, and its left and right ends must tile seamlessly when copies are placed side by side (the pattern continues across the join without a visible seam). Every open space of the net is truly transparent (real alpha). Soft north-window light from the top-left. Apart from the band's two cut ends, which run straight off the left and right edges, keep the WHOLE object at least 6% inside every edge of the canvas: nothing else may touch or be cut by the image border, and the background must be fully transparent above and below the band. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: bant 220 px, dikey ortada (%25–75); sol-sağ uçları dikişsiz eklenir; üstü ve altı tamamen şeffaf; açık yerler şeffaf; gerçek alfa.
Kullanım: tema kurulunca bölüm ayırıcı (yatay tekrar); index'te zarfın altında ince şerit.

#### W18 Siyah ipek fiyonk (home kartının üstü)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/bow.png` · 800×600 · **Şeffaf zemin**

```
A single bow of black silk satin ribbon (#0F0E0D), photorealistic, alone, seen straight from the front, on a fully transparent background, centred and about 75% of the canvas wide: two full, softly rounded loops, a neat gathered knot in the middle, two short tails falling down and slightly outward with neat V-cut ends, the satin showing a soft charcoal sheen along every fold in north-window light from the top-left. No pin, no pearl, no lace, no seal, no brooch. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek siyah ipek fiyonk; iki ilmek, iki kısa V kesik kuyruk; inci/broş yok; gerçek alfa.
Kullanım: tema kurulunca home kartının üst ortasında; bölüm başlarında küçük.

#### W19 Süzülen parçalar — iki ayrı dosya
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/feather.png`, `bell.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small floating object, photorealistic, alone, on a fully transparent background, centred and filling about 60% of the square, not cropped, in soft north-window light from the top-left. (Make two files: feather.png = one soft white swan feather, gently curved, a fine pale quill, a smooth vane with a few separated barbs near the tip and a wisp of fluffy down at its base; bell.png = one single lily-of-the-valley bell flower in pure lace white #FBF8F2, nodding, with a tiny flared scalloped rim and a short pale stalk.) No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tüy ve çan ayrı dosyalarda, her birinde tek nesne; kesilmemiş; gerçek alfa.
Kullanım: tema kurulunca `feather` = açılış sonunda ve home'da süzülen tek kuğu tüyü; `bell` = RSVP gönderilince düşen küçük çanlar.

#### W20 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft north-window light from the top-left: the closed square ivory cotton envelope of env_back.png and flap.png, its arched flap covered by the Chantilly lace overlay of lace_overlay.png and sealed with the ivory swan wax seal of seal.png, the two crossed black silk ribbon tails of ribbon_tails.png beneath the seal, lying slightly below the centre on softly draped very pale oyster silk (as oyster_silk.png); at the left a few sprays of lily of the valley (as lily_valley.png), at the right a single white swan feather (as feather.png) and a loosely folded length of ivory lace; behind, softly out of focus, the silvery light of a calm lake seen through a tall old window. The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no pearls, no roses. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf bütün (dantel, mühür, kuyruklar) ve altta boşluklu; üst %20 sakin; yazı/monogram yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım, üstten ~%21) ve satış sayfası kapak görseli.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Beatrice & Alistair; gerçek kişiye benzemesin)

Ortak: classic black-and-white film wedding photography — soft silvery tones, gentle contrast, deep but never crushed
blacks, fine film grain, natural north light; ONE fictional couple in their early thirties, the same two people in every
photo (they must not resemble any real person or celebrity): Beatrice — long honey-blonde hair worn in a low chignon, fair
skin, small fine gold earrings (no pearls); Alistair — short light-brown hair neatly side-parted, fair skin, clean-shaven.
Timeless, elegant clothing: on the wedding day an ivory gown with fine lace sleeves and a black tuxedo; in the story photos
refined summer and evening clothes. Photos are cropped to 4:5 inside a deckled print: keep faces and hands in the middle
70%. No text, no frame, no watermark, no readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Hero ve Story fotoğrafları sitede **4:5** kırpılır; hepsi siyah-beyaz.

#### 2.1 Ana portre
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white wedding portrait of the fictional couple Beatrice and Alistair, in their early thirties (Beatrice: long honey-blonde hair in a low chignon, fair skin, small fine gold earrings; Alistair: short light-brown hair neatly side-parted, fair skin, clean-shaven; they must not resemble any real person or celebrity) on an old stone terrace by a lake: she in an ivory gown with fine lace sleeves, he in a black tuxedo with a small white boutonnière, standing close, her hand on his arm, both smiling softly, waist-up, faces in the upper middle of the frame; behind them, softly out of focus, a carved stone balustrade and the calm silvery water of the lake. Classic black-and-white film, soft silvery tones, fine grain, natural north light from the top-left. No text, letters, numbers, monograms, logos or watermarks. No frame.
```
Kontrol: siyah-beyaz; aynı çift, yüzler orta-üstte; balüstrad + göl flu; yazı yok.
Kullanım: tema kurulunca home kartında W11 baskısının içinde (4:5), paylaşım/örnek site portresi.

#### 2.2 Story 1 — "A summer on the lake"
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid black-and-white photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing in a small wooden rowing boat on a calm lake in summer, he at the oars in a white shirt with rolled sleeves, she in a simple light summer dress, her head tilted back in laughter, sunlight sparkling silver on the water, soft trees on the far shore out of focus. Classic black-and-white film, same tones and grain. No other people, no readable signs. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: siyah-beyaz; kayıkta gülüşme; yüzler orta %70'te; yazı yok.
Kullanım: tema kurulunca Story 1 (sol), W11 baskısında, dantel duvak açılınca görünür.

#### 2.3 Story 2 — "Swans at dusk"
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white photo: the same couple as hero_portrait.jpg walking hand in hand along a quiet lakeside path at dusk, seen from the side and slightly behind, her head turned toward him, his jacket over her shoulders; far out on the calm water two swans glide side by side, a soft evening mist over the far shore. A generic place, not a recognisable landmark. Classic black-and-white film, same tones and grain. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: siyah-beyaz; göl kıyısında yürüyüş, uzakta iki kuğu; tanınır yer yok; yazı yok.
Kullanım: tema kurulunca Story 2 (sağ), W11 baskısında.

#### 2.4 Story 3 — "Forever, in lace"
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand in a delicate fingerless ivory lace mitt whose scalloped edge rests just below her knuckles, a slim gold engagement ring on her bare finger, resting in his hand, the cuff of his black tuxedo sleeve visible, a soft fold of lace from her gown blurred behind. Shallow depth of field, hands and fingers natural and correct. Classic black-and-white film, same tones and grain. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: siyah-beyaz; eller ve parmaklar düzgün; dantel kenar + yüzük net; yazı yok.
Kullanım: tema kurulunca Story 3 (sol), W11 baskısında.

#### 2.5 Mekân
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9 black-and-white photo: the garden of a classic old manor house beside a calm lake, prepared for a wedding — wide stone steps and a balustraded stone terrace leading down to a smooth lawn at the water's edge, rows of simple white chairs with a central aisle facing the lake, an open stretch of still silvery water, and far out on the water a pair of swans. A generic place, not resembling any real venue. No people, no signs, no text, no religious objects. Classic black-and-white film, soft silvery tones, fine grain, soft light from the top-left. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: siyah-beyaz, yatay; insansız; tabela/dini obje yok; gerçek mekâna benzemiyor.
Kullanım: tema kurulunca details'te W13 geniş baskıda (16:9), üstünde W14 duvak.

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın bloğu (`'swan-chantilly-lace'`)
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
> 1. Tema kurulunca `layouts.ts`'e `'swan-chantilly-lace'` bloğu: `sources` → `{ front: 'print/invitation_front_5x7.png',
>    back: 'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Metin kutularını görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme swan-chantilly-lace` ve `node scripts/print-sample.ts
>    --theme swan-chantilly-lace --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the soft ivory cotton paper of ivory_cotton.png. Along the top edge, a border of the same fine Chantilly lace as lace_band.png, printed in soft photographic detail in a slightly deeper oyster tone (#DCD3C3 to #8F8A82 in the shading) so it reads on the ivory paper, its scalloped lower edge staying above 11% of the height; centred just below it, a small fine pen-and-ink engraving of the pair of swans of swans.png in black ink lines (#1B1A18), staying above 17% of the height. Along the bottom, centred, a slim horizontal spray of lily of the valley (as lily_valley.png) with a short black silk ribbon end, staying below 92% of the height. Nothing important within 8% of the left and right edges (only the lace border may run off the sides). The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, the date and the venue are set there): no lace, no petal, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; dantel ve kuğular yalnız üstte (%17'nin üstünde), inci çiçeği yalnız altta (%92'nin altında); yazı yok.
Kullanım: tema kurulunca `layouts.ts` `'swan-chantilly-lace'` ön yüz zemini (`cover('front')`); metin HTML/PDF katmanı.

#### P2 — Arka yüz
**Kaydet:** `collections/40_Swan_Chantilly_Lace/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same ivory cotton paper, with only a narrow border of the same Chantilly lace along the top edge in the same soft oyster tone, its scallops staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no lace, no swan, no flower, no line, no shadow, no stain. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üstte ince dantel (%11'in üstünde); %13'ün altı boş; yazı yok.
Kullanım: tema kurulunca arka yüz zemini (`cover('back')`); program ve QR üstüne basılır.

PAKET 3/7 (Etsy ilan sahneleri) bu dosyada yok: tema kurulunca `tools/paket7_ilan.py` ile üretilecek.
