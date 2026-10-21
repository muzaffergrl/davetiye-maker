# GPT görsel istekleri — Tasarım 45 · Suede Ranch Lace

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, initials,
> monograms, logos, brand marks, ranch logos, cattle brands, flags, sheriff stars, guns, religious symbols, QR codes or
> watermarks in any image**, and no cartoon cowboys, costumes or souvenir-shop western props: this is a classic, romantic
> golden-hour ranch wedding. Give W1 `suede.png`, W2 `cream_paper.png` and W3 `ranch_landscape.png` as the style
> reference of every later part: the same soft tan suede, the same cream cotton paper and lace, the same warm oil-painted
> golden-hour landscape, the same low golden sun coming from the RIGHT. W4 `env_back.png`, W5 `env_front.png`, W6
> `flap.png` and W8 `cord.png` sit on the same 1110×1500 canvas: attach `env_back.png` to each of them and keep the
> envelope in exactly the same place and size.

Bu dosya tasarım 45'in **bütün görsel parçalarının** tek kaynağıdır (`docs/33_GPT_YENI_10_TASARIM.md`, 4. dalga). Tema
(`platform/themes/suede-ranch-lace/`) **henüz yok**, durum `concept`; geçici görsel de yok. Her parçanın sitede nerede
kullanılacağı altındaki "Kullanım" satırında, tema kurulunca uygulanacak biçimde yazılı. Kişisel alanlar (isimler, tarih,
baş harfler) görsele pişmez; hepsi HTML metindir.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/45_Suede_Ranch_Lace/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/45_Suede_Ranch_Lace --paket 5` ve `--paket 2` (oran, gerçek
  alfa, kenar payı, foto pencereleri) + göz kontrolü. Tema kurulunca `python3 platform/themes/suede-ranch-lace/build_images.py`
  her parçayı geldiği anda kullanır (G167 düzeni) ve `python3 tools/gpt_kuru_deneme.py --tema suede-ranch-lace --sekil
  collections/45_Suede_Ranch_Lace/assets/gpt/kuru_sekil.json` ile prova koşulur. PAKET 6 için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **warm oil-painted landscape + photorealism** — real soft suede with its velvety nap, real hand-tooled
  vegetable-tanned leather, real cream cotton lace, real engraved silver, real sun-bleached wood; classic, romantic, rich
  and warm. Not cartoon, not flat vector, not clip-art, not a costume-party or souvenir western look.
- Renkler: suede `#A97C54` · saddle `#714629` · cream lace `#F3EBDD` · sage `#99A487` · sage deep `#5F6B4E` · sunset
  peach `#E2A17E` · denim dusk `#6A7F99` · silver `#B5B3AD` · ink `#2E221A`.
- Işık: **alçak altın saat güneşi sağdan**; bütün parçalarda aynı (parlak vurgular nesnenin sağ kenarında, yumuşak
  tonlama nesnenin kendi sol yanında). Şeffaf parçalarda gerçek alfa; nesnenin dışına düşen gölge, hâle, ışıma yok (altın
  ışık süpürmesini site ekler).
- Yasak: karikatür kovboy, kostüm, silah, mermi, şerif yıldızı, boynuzlu kafatası, at nalı süsü, tabela, marka/logo,
  çiftlik logosu, harfli hayvan damgası (cattle brand), bayrak, dini simge.
- Gerçek bir mekâna, markaya, sanatçıya ya da başka bir satıcının tasarımına benzemesin. 16'dan (kraft, ayçiçeği,
  ip-mandal), 11'den (pampas, makrome, terrakota kemer) ve 35'ten (yün, dikey kayış, pirinç toka) ayrı.

## Kapalı zarf geometrisi (W4–W9 buna göre)
Zarf **dikey**, tuval **1110×1500**; zarf kutusu tuvalin **x %7–93, y %6–94**'ü (≈955×1320 px, ≈0,72:1). W4 arka, W5 ön
cep, W6 kapak (dantel şerit + saçak dahil) ve W8 kordon **aynı tuvalde, aynı konumda** çizilir; konço (W9) ayrı tuvalde
gelir ve düğümün üstüne konur. Yüzdeler zarf boyunun yüzdesi (parantezde tuval yüksekliği):
- ön cep: zarfın %38'inden (tuval ≈%39,4) alta, üst kenarı düz; iki yanı deri şeritle whipstitch dikişli.
- düz kapak: üstten zarfın %46'sına (tuval ≈%46,5); krem dantel şerit kapağın alt bandında, zarfın %42–%46'sı (tuval
  ≈%43,0–%46,5); süet saçak kapağın alt kenarından sarkar, zarfın %46–%54'ü (tuval ≈%46,5–%53,5).
- kordon: zarfın %48–%53 bandında (tuval ≈%48,2–%52,6) iki tur yatay; düğüm ve konço merkezi zarfın (%50, %50) noktası
  (tuval de %50, %50); konço çapı zarf eninin %18'i (≈172 px = tuval eninin ≈%15,5'i); iki uç düğümün altından zarfın
  ≈%66'sına (tuval ≈%64) sarkar.
- Açılış (tema): konço yarım tur döner → kordon çözülüp yana kayarak çıkar → kapak üst katından 3B kalkar, saçaklar
  salınır → altın saat ışığı süpürür → kart (W10) cepten yükselir → home.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Süet doku (zarf, sayfa zemini)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/suede.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of soft tan suede leather (#A97C54) filling the whole square: a fine, dense, velvety nap with tiny tonal variations where the nap has been brushed in different directions, a few very soft lighter and darker clouds between honey tan and a slightly deeper saddle tan, a matte surface that drinks the light, the faintest natural pores. Evenly lit by warm low golden-hour sun from the right, very low contrast overall. No seam, no stitching, no fringe, no fold, no crease, no scuff, no stain, no tooling, no vignette, no shadow. Calm enough for cream and dark-brown text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); ten rengi süet `#A97C54` civarı, kadife tüy dokusu görünür; leke/dikiş yok.
Kullanım: tema kurulunca index sayfasının zemini ve zarf rengi referansı; home'da "The Day" bandının altında koyulaştırılmış süet.

#### W2 Krem pamuk kâğıt (kartlar, form)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/cream_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of thick soft cotton paper in a warm cream lace colour (#F3EBDD): a gentle felt tooth, a few faint cotton fibres, the slightest warm honey tint in places, an even tone calm enough for dark-brown text everywhere. Evenly lit by warm low golden-hour sun from the right. No deckle edge, no lace, no fold, no stain, no printing, no pattern, no vignette, no shadow. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sakin krem; dikişsiz; leke/baskı yok; üstüne koyu kahve yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, story/details kartları ve RSVP formunun kâğıdı.

#### W3 Altın saat çiftlik manzarası (tam ekran, yağlı boya)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/ranch_landscape.png` · 1200×1600 · opak

```
A vertical oil painting of a mountain-foothill ranch at golden hour, an original landscape (not any real place), painted with soft visible brushwork, warm glazes and a gentle impasto in the highlights. In the foreground silvery sagebrush (#99A487) and a few scarlet Indian paintbrush and deep blue bluebonnet wildflowers grow along a weathered split-rail wooden fence that runs diagonally up from the lower left; in the middle distance rolling golden meadows with two or three horses grazing, small and far away; behind them low rounded hills and a soft range of distant mountains in denim dusk blue (#6A7F99) with warm sunlit ridges. The low golden-hour sun is just outside the frame on the RIGHT: its warm peach light (#E2A17E) rakes across the grass, the fence posts and the horses from the right, long soft shadows fall to the left. The top 35% of the canvas is calm open sky: a smooth gradient from pale peach just above the mountains to soft cream and a gentle dusky blue at the very top, at most a few faint wisps of cloud, nothing else (the couple's names are set there). No buildings, no barns with lettering, no signs, no flags, no people, no riders, no cattle, no brands, no fence crossing the sky area. Classic, romantic, rich. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikey; üst %35 sakin gökyüzü; çit, adaçayı, uzakta atlar, mavi dağlar; ışık sağdan; insan/tabela/bayrak yok.
Kullanım: tema kurulunca index ve home'un arkasında tam ekran manzara (isimler üst %35'e), açılıştaki altın ışık
süpürmesinin zemini, home "The Day" bandı ve imzanın arkası.

#### W4 Zarfın arkası (açık, iç astar görünür)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/env_back.png` · 1110×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope made of the soft tan suede of suede.png (#A97C54), seen perfectly straight on, on a fully transparent background; the envelope occupies exactly x 7–93% and y 6–94% of the canvas (about 0.72:1). Its inside faces us: it is lined with a cream cotton ticking (#F3EBDD) woven with fine, evenly spaced vertical stripes in a faded denim blue (#6A7F99) and a thin saddle-brown pinstripe (#714629), the lining covering the whole panel, with a slim rim of suede showing along the top and both sides. The left and right edges are finished with a saddle-brown leather lace whipstitch (#714629) looping over the edge at even intervals. The top edge is straight and open — no flap is drawn, no V shape. A gentle soft shade on the lining towards the bottom, where the pocket will sit. Warm low golden-hour sun from the right. No front pocket, no flap, no fringe, no lace trim, no cord, no concho, no card inside. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf tuvalin x %7–93, y %6–94'ünde; içi krem çizgili (ticking) astar; yanlarda deri whipstitch; kapak/cep/kordon yok; gerçek alfa.
Kullanım: tema kurulunca zarfın arka katmanı (`.env-back`); kapak kalkınca görünen iç astar, kart bunun önünden yükselir.

#### W5 Zarfın ön cebi
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/env_front.png` · 1110×1500 · **Şeffaf zemin**

```
Only the front pocket of the same tan suede envelope as env_back.png, on the same 1110×1500 canvas and in exactly the same place (the envelope occupies exactly x 7–93% and y 6–94% of the canvas), on a fully transparent background: a flat panel of the suede of suede.png spanning the full envelope width, from 38% of the envelope's height (about 39% of the canvas height) down to the envelope's bottom edge (94% of the canvas). Its top edge is straight with a soft rolled suede edge (this is the edge the card rises from), its left and right edges are laced with the same saddle-brown leather whipstitch as env_back.png, its bottom corners softly squared. The suede nap catches the warm low golden-hour sun from the right; a faint soft shade just under the top edge on the suede itself. Everything above the pocket's top edge is completely transparent. No flap, no lace, no fringe, no cord, no concho, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep zarfın %38'inden alta, tam zarf eninde; üst kenar düz ve net; yanlarda whipstitch; üstü tamamen şeffaf; gerçek alfa.
Kullanım: tema kurulunca tuval cep kutusuna kırpılır → `.env-front`; kart bunun arkasından yükselir.

#### W6 Düz kapak + dantel şerit + süet saçak (kapalı, dış yüz)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/flap.png` · 1110×1500 · **Şeffaf zemin**

```
Only the closed straight flap of the same tan suede envelope, on the same 1110×1500 canvas and in exactly the same place (the envelope occupies exactly x 7–93% and y 6–94% of the canvas), on a fully transparent background. The flap is a flat rectangle of the suede of suede.png spanning the full envelope width, from the envelope's top edge (6% of the canvas) down to 46% of the envelope's height (about 46.5% of the canvas), with a soft rounded fold along its top edge and the same saddle-brown leather whipstitch along its left and right edges. Its STRAIGHT bottom edge (not a V, not a point, not scalloped suede) is trimmed with a band of romantic cream cotton lace (#F3EBDD) stitched onto the suede across the full width, from 42% to 46% of the envelope's height (about 43% to 46.5% of the canvas): a floral lace of small roses and leaves with a softly scalloped lower edge, the suede showing through its open-work. Below the lace hangs a fringe of narrow hand-cut suede strips, each about 14 px wide, straight, evenly spaced with thin transparent gaps between them, slightly irregular in length, from 46% to 54% of the envelope's height (about 46.5% to 53.5% of the canvas). The warm low golden-hour sun from the right lifts the suede nap and the lace relief. Everything below the fringe tips is completely transparent. No cord, no concho, no seal, no button, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kapak üstten zarfın %46'sına, alt kenar düz; altında tam genişlikte krem dantel şerit, onun altında süet saçak (%54'e kadar, şeritler arası şeffaf); kordon/konço yok; gerçek alfa.
Kullanım: tema kurulunca kapak kutusuna kırpılır → `.flap`; açılışta üst katından 3B kalkar, saçak şeritleri CSS ile salınır.

#### W7 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/flap_in.png` · 1110×700 · **Şeffaf zemin**

```
The inside of the same suede flap as flap.png, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background. The flap, including its fringe, is centred and occupies x 13–87% and y 6–94% of this canvas, keeping exactly the same proportions as the flap with its fringe in flap.png. Its BOTTOM edge is the straight fold line (the hinge) and its free edge is at the TOP. The inner face is lined with the same cream ticking as env_back.png (cream #F3EBDD with faded denim-blue stripes and a thin saddle-brown pinstripe), with a slim rim of suede and the same saddle-brown leather whipstitch along the left and right edges. The suede fringe stands straight up from the top edge in the same plane as the flap — not drooping, not curling — its back side plain tan suede, the strips filling the top part from 6% to about 19% of the canvas height with thin transparent gaps between them. No lace on this side, no cord, no concho. Warm low golden-hour sun from the right. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: alt kenar düz menteşe çizgisi, saçak üstte dik (sarkmıyor); iç yüz çizgili astar; dantel/kordon yok; gerçek alfa.
Kullanım: tema kurulunca kapak 3B kalkıp dik durduğunda görünen iç yüz (`.flap-in`), zarfın üst kenarına oturur.

#### W8 Deri kordon (aynı tuvalde, iki tur + düğüm + sarkan uçlar)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/cord.png` · 1110×1500 · **Şeffaf zemin**

```
Only the leather cord that ties the same envelope, on the same 1110×1500 canvas and in exactly the same place as env_back.png (the envelope occupies exactly x 7–93% and y 6–94% of the canvas — but the envelope itself is NOT drawn), on a fully transparent background. A round saddle-brown leather cord (#714629), about 18 px thick, with a soft burnished sheen and fine natural creases, makes two parallel horizontal turns around the envelope across its front, the two strands about 30 px apart, both inside the band from 48% to 53% of the envelope's height (about 48% to 53% of the canvas), each running the full envelope width from x 7% to x 93% as if curving around its sides. At the centre (x 50%, y 50% of the canvas) the two turns gather into one small, neat knot about 90 px across, and from beneath the knot two loose ends hang down, slightly apart in a soft V, to about 66% of the envelope's height (about 64% of the canvas), each end finished with a tiny tight overhand knot. Warm low golden-hour sun from the right catching the top of the cord. Nothing else: no envelope, no suede, no lace, no fringe, no concho (a separate silver concho is placed over the knot). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yalnız kordon (zarf çizilmemiş); iki yatay tur %48–%53 bandında; ortada küçük düğüm, iki uç ≈%64'e sarkar; gerçek alfa.
Kullanım: tema kurulunca kapalı zarfın kapanışı (`.cord`); açılışta konço döndükten sonra kordon gevşeyip yana kayarak çıkar.

#### W9 Gümüş konço
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/concho.png` · 500×500 · **Şeffaf zemin**

```
A single round silver concho, seen straight from the front, on a fully transparent background: a slightly domed disc of hand-engraved sterling-coloured silver (#B5B3AD) filling about 80% of the square, centred, with a softly scalloped rim of small rounded petals, a fine rope-twist border just inside the rim, and a deeply engraved floral pattern of wild roses, curling leaves and scrolls radiating from a smooth, plain, polished centre boss. Bright clean highlights on the raised petals and the boss from warm low golden-hour sun from the right, a gentle antique darkening in the engraved recesses. Purely floral ornament: no star, no initials, no animal, no skull, no horseshoe, no stone. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek yuvarlak gümüş konço, tarak kenar + halat bordür + çiçek oyma; ortası düz; yıldız/harf/taş yok; gerçek alfa.
Kullanım: tema kurulunca kordonun düğümünün üstüne (zarfın %50, %50'si; çap zarf eninin %18'i) konur; açılışta yarım tur
döner; lace_divider ile aynı gümüş.

#### W10 Zarftaki kart (boş)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat vertical invitation card of the same cream cotton paper as cream_paper.png (#F3EBDD), seen straight on, on a fully transparent background, the card centred and occupying x 8–92% and y 7–93% of the canvas (about 0.7:1). All around its edge runs a narrow, delicate cream cotton lace edging with a softly scalloped outline, its open-work holes truly transparent at the outer border, and a very fine sepia-brown hairline (#714629) inset just inside the lace. The whole inner area is EMPTY plain paper (the website sets the names, the date and the venue there). Warm low golden-hour sun from the right, only a faint contact shade on the card itself under the lace. No flowers, no concho, no printing, no photo window. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek krem kart; kenarı ince dantel, içinde ince kahve çizgi; iç alan tamamen boş; gerçek alfa.
Kullanım: tema kurulunca zarftan yükselen kart (`.card`) ve home'daki küçük bilgi kartları; isim/tarih HTML.

#### W11 İşlenmiş deri çerçeve (dikey foto penceresi)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/leather_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A vertical photo frame of hand-tooled vegetable-tanned leather, seen perfectly straight on, on a fully transparent background, the frame occupying x 6–94% and y 6–94% of the canvas: a wide border of warm saddle and suede browns (#714629, #A97C54), hand-carved and stamped with a flowing floral pattern of wild roses, curling leaves and scrolls, the cuts darkened and the raised petals softly burnished, a fine stitched groove along the inner and outer edges, and a saddle-brown leather lace whipstitch looping around the whole outer edge. In the middle a rectangular photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Warm low golden-hour sun from the right raking across the tooling. No initials, no stars, no animals, no brand marks in the tooling. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz yeşil `#00FF00`, dikdörtgen 760×950 (4:5), sol üst (120, 150); çevresi çiçek oyma deri + whipstitch; gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür ve şeffaf yapılır; home portresi ve Story'nin üç anı bu çerçevede, önünde
W12 kapı paneli durur.

#### W12 Çiftlik kapısı paneli (fotoğrafın önünde açılan)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/gate.png` · 1000×1250 · **Şeffaf zemin**

```
A small weathered wooden ranch gate panel, seen perfectly straight on, on a fully transparent background, the panel occupying x 10–90% and y 10–90% of the canvas (a 4:5 rectangle, slightly larger than the photo window of leather_frame.png so that it covers it completely): vertical boards of sun-bleached, silvery-brown old pine with soft grain, small knots, worn rounded edges and a few faint weathering cracks, set tightly side by side with NO gaps between them (fully opaque wood); two horizontal rails across the top and the bottom and one diagonal brace running from the lower left corner up to the upper right corner; two black hand-forged iron strap hinges on the LEFT edge, one on the top rail and one on the bottom rail, and a small iron ring latch on the right edge. Warm low golden-hour sun from the right catching the board edges and the rail tops. No horseshoe, no burned marks, no sign, no nails forming shapes. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek kapı paneli (x %10–90, y %10–90), tahtalar arası boşluksuz; iki kuşak + çapraz destek; menteşeler SOLDA; gerçek alfa.
Kullanım: tema kurulunca her deri çerçevenin önünde durur; fotoğrafın sahnesi gelince sol menteşesinde 3B açılır.
details'teki geniş çerçevede iki kanat olarak (biri aynalanmış) ortadan açılır.

#### W13 Geniş deri çerçeve (mekân fotoğrafı)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/leather_wide.png` · 1600×1000 · **Şeffaf zemin**

```
A wide landscape photo frame of the same hand-tooled vegetable-tanned leather as leather_frame.png, seen perfectly straight on, on a fully transparent background, the frame's outer edge running about 6% inside the canvas edges: warm saddle and suede browns (#714629, #A97C54), hand-carved with the same flowing floral pattern of wild roses, curling leaves and scrolls, the tooling richest along the top and bottom bands, a slim stitched border on the left and right sides, and the same saddle-brown leather lace whipstitch looping around the whole outer edge. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 118 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Warm low golden-hour sun from the right raking across the tooling. No initials, no stars, no animals, no brand marks in the tooling. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz yeşil `#00FF00`, 1360×765 (16:9), sol üst (120, 118); deri W11 ile aynı; yan bantlar ince olabilir; gerçek alfa.
Kullanım: tema kurulunca details'te mekân fotoğrafının çerçevesi; önünde iki kanatlı kapı (W12 ve aynası) ortadan açılır.

#### W14 Kır çiçekleri (köşe süsü)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/wildflowers.png` · 1200×1000 · **Şeffaf zemin**

```
A lush corner cluster of western wildflowers reaching diagonally from the top-left corner area toward the centre, photorealistic with a soft painterly finish, on a fully transparent background: scarlet-orange Indian paintbrush spikes, deep blue bluebonnet spires, three or four cream wild roses with golden centres and soft open petals, silvery sagebrush sprigs (#99A487) and a few fine dry grass seed heads, with the end of a cream lace ribbon tucked among the stems. The cluster sits near the top-left, its stems and blossoms reaching toward the centre, and the bottom-right third of the canvas stays empty. Warm low golden-hour sun from the right lighting the petals from the right. No vase, no hat, no fence, no other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: küme sol üst bölgede, sağ alt üçte bir boş; paintbrush + bluebonnet + krem gül + adaçayı; vazo yok; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşelerinde (sağda aynalanır), index'te zarfın yanında küçük, imzada.

#### W15 Dantel ayırıcı (ortada küçük konço)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/lace_divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider, seen straight on, on a fully transparent background: a straight length of romantic cream cotton lace ribbon (#F3EBDD) with small roses and leaves and softly scalloped upper and lower edges, its open-work holes truly transparent, lying horizontally across the canvas from about 8% to 92% of its width and from about 35% to 65% of its height, its two ends cut cleanly; at its centre a small round engraved silver concho exactly like concho.png, about 140 px across, sitting on the lace. Warm low golden-hour sun from the right. No cord, no flowers, no line. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay dantel şerit, delikler şeffaf; ortada küçük gümüş konço; uçlar kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında ve bölümler arasında ayırıcı (home davet, details program, RSVP formu).

#### W16 Krem keçe şapka (imza süsü)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/hat.png` · 900×600 · **Şeffaf zemin**

```
A single cream felt cowboy hat (#F3EBDD), photorealistic, seen from the front and slightly above, on a fully transparent background: a classic crown with a soft centre crease and a gentle front pinch, a wide, gently curved brim, a fine soft felt nap, and a hatband made of tiny dried wildflowers — cream wild roses, silvery sagebrush sprigs and small blue blooms — over a thin saddle-leather band. Centred, filling about 80% of the canvas width. Warm low golden-hour sun from the right lighting the crown and brim edge. No feather, no badge, no pin, no star, no label, no concho on the band. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek krem şapka, kuru çiçek bantlı; rozet/etiket/yazı yok; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca home imzasının ve RSVP teşekkür kartının üstünde küçük süs (≈140 px).

#### W17 Süzülen küçük süsler — üç ayrı dosya
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small botanical object, photorealistic with a soft painterly finish, alone, centred on a fully transparent background, filling about 55% of the square, not cropped. Warm low golden-hour sun from the right. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three separate files, one object each, same size and style: 1 = a single small sprig of silvery sagebrush (#99A487); 2 = a single bluebonnet stem with its deep blue flower spire; 3 = a single small dried cream wild rose head with two dry leaves.)
```
Kontrol: her dosyada tek nesne (1 adaçayı, 2 bluebonnet, 3 kuru yabani gül); ortalı, kesilmemiş; gerçek alfa.
Kullanım: tema kurulunca kaydırmada süzülen küçük süsler ve RSVP gönderilince tozlu esintiyle savrulan yapraklar.

#### W18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, warm low golden-hour sun from the right: the closed portrait tan suede envelope of env_back.png, env_front.png and flap.png — its straight flap with the cream lace band and the suede fringe, its sides whipstitched with saddle leather — tied with the two turns of saddle leather cord of cord.png and the engraved silver concho of concho.png at the centre, lying slightly below the centre of the frame on an old weathered wooden fence plank; at the left a loose cluster of wildflowers as wildflowers.png (Indian paintbrush, bluebonnets, cream wild roses, sagebrush); at the right the cream felt hat of hat.png resting on its crown beside a folded length of cream lace; behind, softly out of focus, a golden-hour meadow and distant blue hills as ranch_landscape.png. The top 20% of the image is calm and soft (blurred sky and meadow light). This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no signs, no brand marks, no cattle brands, no flags. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf (kordon + konço) bütün ve altında boşluk; üst %20 sakin; solda çiçekler, sağda şapka; yazı/logo yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım) ve satış sayfası kapağı.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Josie & Beau; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography in warm colour, golden-hour light from the right, rich honey, peach
and cream tones with soft sage and denim-blue shadows, subtle film grain; ONE fictional couple in their early thirties,
the same two people in every photo (they must not resemble any real person or celebrity): Josie — long wavy honey-blonde
hair, lightly bronzed fair skin, a slim gold ring; Beau — short brown hair, a neat short beard, sun-tanned fair skin, a
cream felt hat in some frames. Clothing: she wears a cream lace wedding dress with brown leather cowboy boots; he wears a
cream shirt and a brown vest. Classic and romantic: no costume, no guns, no ranch logos, no cattle brands, no flags.
Story photos are cropped to 4:5 in a frame: keep faces and hands in the middle 70%. No text, no frame, no watermark, no
readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Hero ve Story fotoğrafları sitede **4:5** kırpılır (deri çerçeve penceresi).

#### 2.1 Ana portre
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Josie and Beau, in their early thirties (Josie: long wavy honey-blonde hair, lightly bronzed fair skin, a slim gold ring; Beau: short brown hair, a neat short beard, sun-tanned fair skin; they must not resemble any real person or celebrity), standing close and laughing in front of a weathered split-rail wooden fence at golden hour: she in a cream lace wedding dress with fine lace sleeves, he in a cream shirt, a brown vest and his cream felt hat, his arm around her waist, waist-up, faces in the upper middle of the frame. Behind them, softly out of focus, a golden meadow, silvery sagebrush and distant blue foothills; the low sun from the right rims their hair and shoulders with warm light. Photorealistic, warm golden palette, subtle film grain. No frame. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: iki kişi, bel üstü, yüzler orta-üstte; çit ve altın saat ışığı sağdan; gerçek kişiye benzemiyor; yazı yok.
Kullanım: tema kurulunca home kartındaki deri çerçeve portresi (4:5) ve demo sitenin ana fotoğrafı.

#### 2.2 Story 1 — "Horseback at sunset"
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5: the same couple as hero_portrait.jpg (same faces, hair and skin) riding two calm horses side by side at a slow walk through a golden meadow at sunset — a chestnut and a bay with plain brown leather tack — seen from the front three-quarter at a medium distance so that both faces are clearly visible as they smile at each other (NOT a silhouette): she in a cream lace dress and brown boots, he in a cream shirt, a brown vest and his cream felt hat; the low sun from the right lights their faces and the horses' manes, sagebrush and distant blue hills softly behind. Photorealistic, same palette and grain. No marks on the saddles. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: iki at, iki yüz net görünüyor (siluet değil); ışık sağdan; eğerlerde logo/yazı yok.
Kullanım: tema kurulunca Story 1 (sol), deri çerçeve + açılan kapı arkasında.

#### 2.3 Story 2 — "Dancing in the barn"
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) dancing and laughing inside a rustic wooden barn in the evening, she mid-twirl with her lace skirt flaring and her boots showing, he holding her hand high, rough timber beams and hay bales softly behind, strings of warm bulb lights blurred overhead into soft round bokeh, other guests only as out-of-focus shapes. Photorealistic, same warm palette and grain. No readable signs. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: ahır içinde dans; yüzler orta %70'te; tabela/yazı yok; aynı çift.
Kullanım: tema kurulunca Story 2 (sağ), deri çerçeve + açılan kapı arkasında.

#### 2.4 Story 3 — "Yes, by the fence"
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his on the top rail of a weathered split-rail wooden fence, a sprig of silvery sagebrush and a few wildflowers beside them, the low golden sun from the right, warm soft bokeh of the meadow behind, shallow depth of field. Natural, well-formed hands and fingers. Photorealistic, same palette and grain. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: eller ve yüzük net, parmaklar doğal; çit + adaçayı; ışık sağdan; yazı yok.
Kullanım: tema kurulunca Story 3 (sol), deri çerçeve + açılan kapı arkasında.

#### 2.5 Mekân
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: a mountain-foothill ranch meadow prepared for a wedding ceremony at golden hour, an original place that does not resemble any real venue: at the far end of a grass aisle a simple timber arch dressed with cream fabric and a few wildflowers, rows of hay bales covered with soft cream and denim-blue wool blankets as guest seating, small bunches of sagebrush and wildflowers along the aisle, a weathered split-rail fence to one side, and distant blue mountains under a warm peach sky; the low sun from the right. No people, no animals in the foreground, no signs, no flags, no religious objects. Photorealistic, warm golden palette, subtle film grain. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: insansız; ahşap kemer, battaniyeli saman balyaları, dağ arka planı; tabela/yazı/dini obje yok.
Kullanım: tema kurulunca details'te geniş deri çerçevede, iki kanatlı kapının arkasında mekân fotoğrafı.

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın `'suede-ranch-lace'` bloğu **henüz
> yok** — tema kurulunca eklenecek; o zamana kadar bu iki dosya yalnız kaynak olarak bekler.
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden süsleme yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 **tamamen boş** (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (tema kurulunca, elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts`'e `'suede-ranch-lace'` bloğu: `sources` → `{ front: 'print/invitation_front_5x7.png', back:
>    'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Metin kutularını görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme suede-ranch-lace` ve `node scripts/print-sample.ts --theme
>    suede-ranch-lace --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the cream cotton paper of cream_paper.png. Across the top centre, a painterly spray of wildflowers with a warm oil-paint texture (as wildflowers.png: scarlet Indian paintbrush, deep blue bluebonnets, cream wild roses and silvery sagebrush) arches gently to the left and right from a small engraved silver concho (as concho.png) at the top centre, over a short length of cream lace ribbon; the whole spray stays between 12% and 88% of the width and above 17% of the height. Along the bottom, a slim painted vignette of sagebrush sprigs and a few small bluebonnets lying horizontally, centred, between 20% and 80% of the width and between 93% and 97% of the height. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no petal, no line, no shadow, no stain in it. Nothing decorative within 8% of the left and right edges. Warm low golden light from the right. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; çiçek spreyi yalnız üstte (%17'nin üstünde), adaçayı şeridi yalnız altta; yanların %8'i boş; yazı yok.
Kullanım: tema kurulunca `layouts.ts` ön yüz zemini (`cover('front')`); isimler, tarih, mekân üstüne HTML/PDF metniyle basılır.

#### P2 — Arka yüz
**Kaydet:** `collections/45_Suede_Ranch_Lace/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream cotton paper, with only a small ornament at the top centre — two crossed sprigs of silvery sagebrush and one bluebonnet tied with a short cream lace ribbon, painted with the same warm oil-paint texture — staying between 35% and 65% of the width and above 11% of the height. Everything below 13% of the height is COMPLETELY EMPTY paper across the full width, and certainly between 9% and 91% of the width (a schedule and a QR code are set there; do not draw any code): no flower, no line, no shadow, no stain. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada küçük süs (%11'in üstünde); %13'ün altı tamamen boş; QR/yazı yok.
Kullanım: tema kurulunca `layouts.ts` arka yüz zemini (`cover('back')`); program ve gerçek QR (`tools/make_qr.py`) üstüne konur.

---

PAKET 3/7 (Etsy ilan sahneleri) bu dosyada yok: tema `platform/themes/suede-ranch-lace/` kurulunca `tools/paket7_ilan.py` ile üretilecek.
