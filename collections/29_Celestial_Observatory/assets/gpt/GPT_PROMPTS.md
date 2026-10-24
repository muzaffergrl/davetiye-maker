# GPT görsel istekleri — Tasarım 29 · Celestial Observatory (yeniden tasarım, 2026-10-22)

> **Instructions for GPT:** This design ("Celestial Observatory") is being REDESIGNED from scratch on 2026-10-22. Generate
> PAKET 5R (website layers) first, in order and in ONE chat, then PAKET 6R (printable invitation). PAKET 2 (sample
> photos) ALREADY EXISTS — do not regenerate it. Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly
> as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No
> text, letters, numbers, names, dates, initials, monograms, logos, brand marks, QR codes or watermarks in any image** —
> also no zodiac signs or glyphs, no constellation names, no star-catalogue labels, and the astrolabe, the planisphere
> rings and the telescope carry ONLY plain engraved tick marks (no numerals, no hour letters, no degree numbers, no maker's
> name). This is an 18th-century observatory library: real midnight-blue cotton paper, real engraved gold leaf, real
> antique brass instruments, real silver-ivory chart paper — classic, romantic and rich. Not science fiction, not a
> planetarium poster: no coloured nebulae, no galaxies, no neon, no lens flares, no rockets, no flowers, no candles, no
> lake. Give W1 `night_paper.png`, W3 `env_back.png` and W7 `astro_plate.png` as the style reference of every later
> part: the same midnight-blue paper, the same engraved gold leaf, the same warm antique brass, the same cool soft
> moonlight from the top-left with one warm highlight on metal. Parts drawn on the same envelope canvas (W3, W4, W5) keep
> the envelope in exactly the same box; W7 and W8 share one canvas and one centre.

Bu dosya tasarım 29'un **bütün görsel parçalarının** tek kaynağıdır (`docs/35_22_32_YENIDEN_TASARIM.md`, 22–32 yeniden
tasarım). Önceki PAKET 5 (G168 gözlemevi kubbesi parçaları), Codex `envelope-v3` kapağı ve 2026-10-20 PAKET 6 zeminleri
**geçersiz**; bölümleri bu dosyadan kaldırıldı (git geçmişinde). Durum: tema (`platform/themes/celestial-observatory/`)
bu parçalarla 39 pilotunun yapısında **yeniden kurulacak** (görev G429; GPT görevi G229). Tema kurulunca her parçanın nasıl
kullanılacağı aşağıdaki "Kullanım" satırlarındadır; gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar
(isimler, tarih, baş harfler, mekân) HTML'dir, hiçbir görsele pişirilmez. QR'ı GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/29_Celestial_Observatory/assets/gpt/` altındaki `parts/`
  (PAKET 5R) ve `print/` (PAKET 6R). `photos/` (PAKET 2) dolu, dokunma. Repoya yazamıyorsan dur ve bunu çıktında açıkça
  söyle; kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/29_Celestial_Observatory --paket 5` (oran, gerçek alfa, kenar
  payı, foto penceresi) + göz kontrolü (`docs/34` §4 yöntemleri). Tema yeniden kurulunca
  `python3 platform/themes/celestial-observatory/build_images.py` (alfa kutusuna kırpma, zarf katmanlarını `env_back`
  kutusuna göre yerleştirme, `keyed_window`, manifest.stage ↔ site.css) ve `python3 tools/gpt_kuru_deneme.py --tema
  celestial-observatory --sekil collections/29_Celestial_Observatory/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için
  aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **fine copperplate engraving + gold leaf, photographed like luxury stationery** — real midnight-blue cotton
  paper with a soft felt tooth, real engraved and gilded gold leaf (slightly raised, crisp, with a soft warm sheen),
  real antique brass with a gentle patina and hand-worn edges, real silver-ivory chart paper printed with fine engraved
  lines in gold-brown ink. Classic, romantic, rich, calm and a little magical. Not flat vector, not clip-art, not
  sci-fi, not a planetarium poster.
- Renkler (yalnız bunlar): midnight `#11193A` · night `#0A0F24` · chart paper `#EEEBE3` · silver `#C9CFDC` · silver light
  `#E6E9F1` · gold `#C8A24E` · gold light `#E2C27A` · gold ink `#7A5A1E` · brass `#9B7A3C` · ink `#141A33`. Renkli bulutsu,
  mor/turkuaz gök yok; yıldızlar altın ya da gümüş-beyaz.
- Işık: yumuşak, serin **ay ışığı sol üstten**, pirinçte ve varakta tek sıcak parlak vurgu; bütün parçalarda aynı.
  Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil), her kenarda en az %6 boşluk, nesnenin dışında düşen
  gölge/hâle yok (gölgeyi site ekler).
- Gravürler: koordinat yayları, noktalı takımyıldız çizgileri, küçük yıldız noktaları, ay evreleri, ince çentikli
  halkalar. **Takımyıldız figürü (mitolojik çizim), burç simgesi, harf, rakam, takımyıldız adı yok.** Uydurma
  takımyıldızlar da olur; gerçek bir atlas sayfasını kopyalama.
- Foto penceresi (düz `#00FF00`) yalnız W10 `medallion_frame`, W11 `planisphere_frame` ve W13 `venue_frame`'de; başka
  hiçbir parçada yeşil alan yok.
- Gerçek bir gözlemevine, saat/alet üreticisine, markaya, sanatçıya ya da başka bir satıcının tasarımına benzemesin.
  **19 Midnight Garden'dan ayrı:** çiçek, mum, siyah zemin yok. **22 Nocturne'den ayrı:** göl, villa, laid kâğıt, elmas
  kapak, hilal broş yok. **48 Navy Ivory Crest'ten ayrı:** arma, kalkan, keten cüzdan zarf yok.

## Zarf geometrisi (W3–W5 aynı tuval; W6, W7–W8 ayrı tuval)
Zarf tuvali **1100×1400** (dikey). Zarf kutusu **x %7–93, y %6–94** (zarf ≈0,77:1). Üç katman **aynı tuvalde, aynı
kutuda** çizilir: W3 arka (iç astar), W4 ön cep, W5 kubbe kapak; Claude her birini kendi alfa kutusuna kırpar ve `env_back`
kutusuna göre yerleştirir. Ölçüler tuval yüzdesiyle:
- **Kubbe kapak (W5):** tam bir **yarım daire**; düz katlama kenarı zarfın üst kenarında (y %6), x %7'den %93'e; yarım
  dairenin merkezi (x %50, y %6), yarıçapı tuval eninin %43'ü (473 px) → yayın en alt noktası (x %50, y %40). Zarfın iki
  üst köşesinde kapak yok (köşe ile yay arası W4'ün yan kanatları görünür).
- **Ön cep (W4):** zarfın tamamı (x %7–93, y %6–94) eksi üstten oyulmuş **içbükey yarım daire kubbe penceresi**: merkezi
  yine (x %50, y %6), yarıçapı tuval eninin %39,5'i (435 px) → kesik y %6'da x %10,5 ile %89,5 arasında, en derin noktası
  (x %50, y %37). Yani cep iki üst köşeye kadar çıkar (yan kanatlar ince hilaller), ortası kemer gibi oyuk. Kapağın yayı
  bu kesiği her yerde ~35 px dışarıdan örter (kapalıyken boşluk kalmaz).
- **Arka (W3):** zarf kutusunun tamamı; içi antika yıldız atlası astarı, kenarlarda ince gece mavisi pay. Kapak açılınca
  kubbe penceresinden görünür.
- **Usturlap (W7 + W8):** ayrı **800×800** tuval, ikisi **aynı merkezde** (x %50, y %53): W7 ana disk Ø %70 (560 px) +
  disk üstünde taht ve asma halkası (y %7–18); W8 rete Ø %60 (480 px), merkezde aynı pim. Zarf üstünde usturlap diskinin
  merkezi zarf tuvalinin (x %50, y %38,5)'inde (kapağın ucunun hemen üstünde), disk çapı zarf tuvali eninin %28'i
  (≈308 px); taht yukarı bakar.
- **Kapağın iç yüzü (W6):** ayrı **1100×600** tuval: aynı yarım daire dik duruyor — düz katlama kenarı altta (y %94),
  x %7–93; yay yukarı, en üst noktası (x %50, y ~%15).
- Kat sırası (alttan üste): W3 arka → kart (W9) → W4 ön cep → W5 kapak → W7 ana disk → W8 rete.

Açılış: dokununca usturlabın retesi 120° döner, rete uçlarında altın yıldız noktaları sırayla parlar (CSS ışıltı) →
usturlap (disk + rete birlikte) kalkıp ekranın üstüne süzülür ve orada küçük bir "gök süsü" olarak kalır (home'da da) →
kubbe kapak üst katlama çizgisinde 3B açılır; 90°'den sonra iç yüz (W6) görünür: dik duran yarım daire bir **gözlemevi
kubbesi** silueti olur → kubbe penceresinden yıldız atlası astarı görünür → harita kâğıdı kart (W9) cebin arkasından
yükselir, cep kenarını geçince öne gelir → küçük altın yıldızlar (W17) tek tek yanar, bir hilal süzülür → home.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Gece mavisi pamuk kâğıt (sayfa zemini, kapak sayfası)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/night_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of thick midnight-blue cotton paper (#11193A, drifting very gently toward #0A0F24 in soft clouds), the kind used for luxury engraved stationery: a soft felt tooth, a few faint long fibres, and — printed very faintly in slightly lighter midnight blue (#1B2550), barely visible — a delicate engraved star chart: thin concentric coordinate arcs, a few dotted constellation lines and tiny star points, spread evenly so no area is busier than another. Here and there a few very small specks of real gold leaf (#C8A24E), sparse and tiny. Evenly lit by cool soft moonlight from the top-left, no fold, no crease, no stain, no vignette, no bright spot. Very low contrast so light ivory and gold text reads on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No zodiac signs, no constellation figures. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); gece mavisi `#11193A` civarı; gravür harita çok soluk, altın pullar seyrek ve küçük; üstüne açık renk yazı her yerde okunur; harf/rakam yok.
Kullanım: tema kurulunca kapak (kapalı zarf) sayfasının ve iç sayfaların koyu zemini; home'da kart bantlarının arasında.

#### W2 Gümüş-fildişi harita kâğıdı (kartlar, bantlar, form)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/chart_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of heavy silver-ivory chart paper (#EEEBE3) from an old star atlas: a fine smooth laid surface with the faintest chain lines, a soft cool-ivory tone with only the gentlest natural variation, and — printed extremely faintly in pale gold-brown ink (#7A5A1E at very low strength) — a sparse engraved grid of thin coordinate arcs and meridian lines, so faint it reads as texture. Evenly lit by cool soft moonlight from the top-left, no fold, no crease, no foxing, no stain, no vignette. Calm enough for fine dark ink text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No stars bigger than a dot, no constellation figures, no zodiac signs. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; gümüş-fildişi `#EEEBE3`; koordinat çizgileri çok soluk; leke/kat yok; koyu yazı her yerde okunur.
Kullanım: tema kurulunca home kartı, davet bandı, story başlık kartları, details program kartı ve RSVP formu; zarftan yükselen kartın kâğıdıyla aynı.

#### W3 Zarfın arkası (iç yıldız atlası astarı)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/env_back.png` · 1100×1400 · **Şeffaf zemin**

```
The back panel of an open portrait envelope made of the midnight-blue cotton paper of night_paper.png, seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas (a portrait rectangle with very slightly softened corners). We see its inside: it is lined with an antique star-atlas print on silver-ivory chart paper (#EEEBE3) — finely engraved in gold-brown ink (#7A5A1E): concentric coordinate arcs and meridian lines radiating from a point above the top centre, dotted constellation lines joining small engraved stars of different sizes, a few stars picked out in real raised gold leaf (#C8A24E) — covering the panel almost completely, with a slim margin of midnight-blue paper showing along the top and both sides; the lining is richest in the upper half (where it shows through the dome window) and calmer toward the bottom, with a very gentle shade toward the bottom where the front pocket will sit. No flap, no front pocket, no astrolabe, no card inside. Cool soft moonlight from the top-left. No constellation figures, no zodiac signs, no labels. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf kutusu x %7–93 · y %6–94; iç yüz yıldız atlası astarı (gravür yaylar, noktalı takımyıldızlar, birkaç varak yıldız), kenarda ince gece mavisi pay; kapak/cep/usturlap yok; harf/rakam yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — kapak açılınca kubbe penceresinden ve kartın arkasında görünen astar.

#### W4 Zarfın ön cebi (kubbe pencereli)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/env_front.png` · 1100×1400 · **Şeffaf zemin**

```
Only the front pocket of the same portrait midnight-blue envelope as env_back.png, on the same 1100×1400 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas; the pocket covers the whole envelope (x 7–93%, y 6–94%) EXCEPT one large concave semicircular cut-out taken from its top edge, like a dome-shaped window: the cut-out is a perfect half circle whose centre is at x 50%, y 6% of the canvas and whose radius is 39.5% of the canvas width — so along the top edge the cut runs from x 10.5% to x 89.5%, and its deepest point is at x 50%, y 37%. The two narrow crescent-shaped side flaps therefore rise up to the envelope's two top corners. The cut edge is crisp and clean with the faint thickness of heavy paper visible, finished with a hair-fine engraved gold-leaf line (#C8A24E) just inside the cut. The midnight-blue cotton paper of night_paper.png (no star-chart print on the pocket — plain paper with its soft tooth), the soft fold lines of the side flaps and the bottom flap barely visible, cool moonlight from the top-left. Everything inside the semicircular cut-out is completely transparent. No flap, no astrolabe, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep tam zarf; üstten oyulmuş yarım daire kesik: y %6'da x %10,5–89,5, en derin (x %50, y %37); yan kanatlar iki üst köşeye çıkar; kesik içi tamamen şeffaf; ince altın çizgi; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart bunun arkasından yükselir; kapak açıkken kubbe penceresinden astar görünür.

#### W5 Yarım daire kubbe kapak (kapalı, dış yüz)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/flap.png` · 1100×1400 · **Şeffaf zemin**

```
Only the closed flap of the same portrait midnight-blue envelope, on the same 1100×1400 canvas and in exactly the same place, on a fully transparent background. The flap is a perfect HALF CIRCLE: its straight hinge edge lies along the envelope's top edge at 6% of the canvas height, from x 7% to x 93% (the full envelope width); its free edge is one smooth semicircular arc centred at x 50%, y 6%, with a radius of 43% of the canvas width, so its lowest point is at x 50%, y 40%. Not a V, not a U, not scalloped. The midnight-blue cotton paper of night_paper.png; along the arc a narrow engraved border of real gold leaf (#C8A24E): a fine double rule with tiny star points between the rules; inside it, raised gold-leaf engraving of a few dotted constellation lines and small six-pointed stars arranged like the gores of a dome — thin lines radiating from the hinge centre toward the arc — elegant and sparse, most of the flap calm paper. A whisper of contact shade on the flap itself along its arc, cool moonlight from the top-left with a warm glint on the gold. Everything below the flap's arc and in the two top corners outside the half circle is completely transparent. No astrolabe, no seal, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kapak tam yarım daire: düz kenar y %6'da x %7–93, yay en alt (x %50, y %40); altın varak çift çizgi bordür + seyrek takımyıldız gravürü; köşeler ve altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapalı kapak; açılışta üst katlama çizgisinde 3B kalkar, 90°'den sonra W6 iç yüzü devralır.

#### W6 Kapağın iç yüzü — gözlemevi kubbesi (açıkken dik)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/flap_in.png` · 1100×600 · **Şeffaf zemin**

```
The inside of the same half-circle envelope flap, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background: the outline of flap.png mirrored vertically. Its straight fold edge is at the BOTTOM, along 94% of the image height, spanning x 7–93% of the width (exactly as wide as the envelope); its semicircular edge rises in one smooth arc to its highest point at x 50%, about 15% of the image height. The inside is lined with deep midnight-blue paper (#0A0F24 toward #11193A) and engraved in real gold leaf (#C8A24E, warm highlights #E2C27A) like the inside of an observatory dome seen from below: eight slender curved meridian ribs rising from the fold edge and converging toward the top of the arc, a fine gold double rule following the arc, a narrow vertical slit-shaped band of slightly lighter midnight blue up the centre, and tiny gold and silver-white star points scattered between the ribs. Rich but calm. A slim margin of midnight-blue paper beyond the gold rule. Cool moonlight from the top-left. No astrolabe, no telescope, no moon, no flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz katlama kenarı altta (%94), yay ortada ~%15'e çıkar; gece mavisi iç, altın varak meridyen kaburgaları + yıldızlar; kubbe silueti okunuyor; harf/rakam yok; gerçek alfa.
Kullanım: tema kurulunca kapak açıldığında zarfın üstünde dik duran iç yüz (3B dönüşün arka yüzü) — gözlemevi kubbesi silueti.

#### W7 Pirinç usturlap — ana disk (mater)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/astro_plate.png` · 800×800 · **Şeffaf zemin**

```
The main body of an antique brass astrolabe, alone, seen perfectly straight from the front, on a fully transparent background: a round brass disc (the mater) whose centre is exactly at x 50%, y 53% of the canvas and whose diameter is 70% of the canvas width (it spans x 15–85%, y 18–88%), with a raised outer rim (the limb) engraved with a ring of evenly spaced fine tick marks only — short and long ticks, absolutely no numerals, no letters; inside the rim a recessed plate of slightly darker warm brass (#9B7A3C) engraved with a delicate pattern of concentric arcs (almucantars) and curved lines, and a small domed brass pin exactly at the centre. On top of the disc, centred, an ornate pierced brass throne in a symmetrical scrolled shape (spanning about x 40–60%, y 10–19%) carrying a small round brass shackle ring at the very top (around y 7–11%). Real antique brass with a gentle patina, hand-worn bright edges, a warm highlight on the rim from soft moonlight at the top-left. NO rete or star pointer on this disc (that is a separate part). No numerals, no letters, no zodiac signs, no maker's mark, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek pirinç disk, merkezi (x %50, y %53), çapı %70; kenarda yalnız çentik çizgileri (rakam/harf yok); ortada pim; üstte oyma taht + halka; rete yok; gerçek alfa.
Kullanım: tema kurulunca kapağın ucunda kapanış (zarf tuvalinde merkez x %50, y %38,5; çap zarf eninin %28'i); açılışta W8 ile birlikte kalkıp ekranın üstüne süzülür; home ve imzada küçük gök süsü.

#### W8 Pirinç usturlap — dönen rete (yıldız işaretçili oyma disk)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/astro_rete.png` · 800×800 · **Şeffaf zemin**

```
Only the rete of the same antique brass astrolabe as astro_plate.png, on the same 800×800 canvas and with EXACTLY the same centre (x 50%, y 53%), on a fully transparent background — the disc, rim and throne are NOT drawn. The rete is a lace-like pierced brass star map: an outer circular ring with a diameter of 60% of the canvas width (it fits just inside the astrolabe's raised rim), an off-centre inner ring (the ecliptic ring, touching the outer ring on one side), and between them graceful curling brass tracery — flame-shaped and leaf-shaped star pointers, about twelve of them, each ending in a fine sharp point, some tipped with a tiny bead of gold (#E2C27A) — all joined by slender scrolls; a small round boss with a hole exactly at the centre (the pin passes through it). Everything between the brass tracery is TRULY TRANSPARENT (real alpha), so the plate beneath shows through. Real antique brass (#9B7A3C, highlights #E2C27A) slightly brighter than the plate, a warm highlight from soft moonlight at the top-left. No numerals, no letters, no star names, no zodiac signs. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yalnız rete; merkez W7 ile aynı (x %50, y %53); dış halka Ø %60; oyma işaretçiler arası gerçekten şeffaf; harf/rakam yok; gerçek alfa.
Kullanım: tema kurulunca W7'nin üstünde aynı merkezde; açılışta 120° döner, işaretçi uçları sırayla parlar; home'da sayfa kaydırıldıkça çok yavaş döner.

#### W9 Zarftan yükselen kart (boş)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen perfectly straight on, on a fully transparent background: the heavy silver-ivory chart paper of chart_paper.png (#EEEBE3) with crisp square corners very slightly softened, spanning x 7–93% and y 6–94% of the canvas; a fine double border of real gold leaf (#C8A24E) inset about 5% from the card's edge, with a tiny six-pointed star at each of its four corners; at the top centre, inside the border, a small engraved gold-leaf crescent moon cradling three tiny stars, about 18% of the card's width. Below it the whole card is EMPTY paper (the website sets the names, the date and the venue there in HTML). A hair-fine contact shade on the card's own edge only, cool moonlight from the top-left with a warm glint on the gold. No photo, no flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: boş harita kâğıdı kart; altın varak çift bordür + köşe yıldızları; üst ortada küçük hilal + üç yıldız; altı tamamen boş; yazı yok; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → zarftan yükselen kart ve home kartı (isimler, tarih, mekân HTML).

#### W10 Gök madalyonu (home portresi, yuvarlak pencere)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/medallion_frame.png` · 1200×1200 · **Şeffaf zemin**

```
A round celestial medallion picture frame, alone, seen straight on, on a fully transparent background: a moulded ring of real gilded gold leaf (#C8A24E, highlights #E2C27A, soft shadows #7A5A1E) with a fine beaded inner edge, surrounded by a radiating sunburst of slender gold-leaf rays of alternating lengths, with a small six-pointed star at the tip of every fourth ray, the whole ornament spanning about x 6–94% and y 6–94% of the canvas, perfectly symmetrical. In the exact centre a perfectly CIRCULAR photo window with a diameter of exactly 760 px, centred at x 600 px, y 600 px (its bounding square from 220 to 980 px), filled with flat pure green #00FF00 (no texture, no shading, a clean round edge, nothing over it). Cool soft moonlight from the top-left, a warm glint on the gold. No glass, no flowers, no moon face. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00` daire, Ø 760 px, merkez (600, 600); altın varak halka + ışın demeti simetrik; pencereye bir şey binmiyor; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → home kartındaki portre (hero 1:1, daire kırpım); teşekkür modunda teşekkür fotoğrafı.

#### W11 Planisfer halkası (story çerçevesi, yuvarlak pencere)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/planisphere_frame.png` · 1200×1200 · **Şeffaf zemin**

```
A round antique brass planisphere frame, alone, seen straight on, on a fully transparent background: a wide flat ring of warm antique brass (#9B7A3C, highlights #E2C27A) whose outer edge spans x 6–94% and y 6–94% of the canvas (diameter 88%), with a fine raised bead along its outer edge and a raised inner lip around the window; on the ring's inner band a fine engraved scale of evenly spaced short tick marks and, between the outer bead and the scale, a plain smooth brass band (a separate rotating dial ring will sit there); four tiny domed rivets at top, bottom, left and right. In the exact centre a perfectly CIRCULAR photo window with a diameter of exactly 840 px, centred at x 600 px, y 600 px (its bounding square from 180 to 1020 px), filled with flat pure green #00FF00 (no texture, no shading, a clean round edge, nothing over it). Real brass with a gentle patina, cool moonlight from the top-left with one warm highlight. No numerals, no letters, no zodiac signs, no star map over the window. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00` daire, Ø 840 px, merkez (600, 600); geniş pirinç halka, yalnız çentikler; dış bantta düz pirinç (W12 için); harf/rakam yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → story'deki üç an (sol–sağ–sol) ve home'daki hikâye tanıtımı; foto kadran süpürmesiyle belirir.

#### W12 Planisfer dönen derece halkası (W11'in üstüne)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/planisphere_dial.png` · 1200×1200 · **Şeffaf zemin**

```
Only a thin open rotating dial ring for the same planisphere frame as planisphere_frame.png, on the same 1200×1200 canvas and with exactly the same centre (x 600 px, y 600 px), on a fully transparent background — the frame and the window are NOT drawn. The ring is a narrow band of slightly brighter polished brass (#B08A45 toward #E2C27A) with an outer diameter of 86% of the canvas width and an inner diameter of 76%: engraved around it a crisp scale of evenly spaced tick marks (every tenth tick longer), and at eight evenly spaced points a tiny six-pointed star in raised gold leaf; one small triangular brass pointer on its inner edge at the top. Everything inside the inner diameter and outside the outer diameter is TRULY TRANSPARENT (real alpha). Cool moonlight from the top-left, a warm highlight along the top-left of the ring. No numerals, no letters, no zodiac signs. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yalnız ince halka, merkez (600, 600), dış Ø %86, iç Ø %76; çentikler + 8 küçük yıldız + üstte tek işaretçi; içi ve dışı şeffaf; harf/rakam yok; gerçek alfa.
Kullanım: tema kurulunca W11'in üstünde aynı merkezde; sayfa kaydırıldıkça döner (story ve home hikâye tanıtımı).

#### W13 Pirinç çerçeveli gök haritası panosu (mekân, geniş pencere)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/venue_frame.png` · 1600×1000 · **Şeffaf zemin**

```
A wide antique star-chart display frame, alone, seen straight on, on a fully transparent background: a slim moulded frame of warm antique brass (#9B7A3C, highlights #E2C27A) with small rounded corner bosses, around a mat of silver-ivory chart paper (#EEEBE3) engraved very finely in gold-brown ink (#7A5A1E) with a border of thin coordinate arcs and tick marks and a small engraved star at each corner of the mat; the frame's outer edge spans about x 6–94% and y 6–94% of the canvas. In the mat a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 110 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Cool moonlight from the top-left, a warm highlight on the brass. No glass, no telescope, no numerals, no letters. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 1360×765 (16:9), sol üst (120, 110); ince pirinç çerçeve + gravürlü harita kâğıdı paspartu; harf/rakam yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafı (teleskop ışını gibi soldan sağa süpürülerek belirir).

#### W14 Köşe süsü (altın takımyıldız + hilal)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/corner_ornament.png` · 1200×1000 · **Şeffaf zemin**

```
A restrained corner ornament growing out from near the top-left corner toward the centre, alone, on a fully transparent background: fine engraved lines of real raised gold leaf (#C8A24E, highlights #E2C27A) — two thin concentric coordinate arcs sweeping from the top edge to the left edge, a delicate dotted constellation line linking six or seven small six-pointed gold stars of different sizes along the arcs, one slim gold crescent moon nestled between the arcs, and a sprinkle of tiny silver-white star dots (#E6E9F1). Elegant and airy, mostly empty space between the lines. It reaches toward the top and left sides but stays 6% inside them; the bottom-right half of the canvas is completely empty. Cool moonlight from the top-left. No flowers, no planets in colour, no zodiac signs, no figures. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sol üstten çıkan ince altın yaylar + noktalı takımyıldız + hilal; sağ alt yarı boş; çiçek/burç yok; gerçek alfa.
Kullanım: tema kurulunca kapak sayfasında en fazla bir köşede (metnin altında değil), home kartının üst köşelerinde (sağda aynalanır) ve RSVP kapanışında.

#### W15 Ay evreleri dizisi (bölüm ayırıcı)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider of seven small moon phases in real gold leaf, alone, on a fully transparent background, evenly spaced along a straight line at the vertical centre across x 8–92% of the canvas: from left to right a thin waxing crescent, a half moon, a waxing gibbous, a full moon in the middle (slightly larger, with a fine engraved ring around it), a waning gibbous, a half moon and a thin waning crescent — each a crisp gilded disc or crescent (#C8A24E, warm highlights #E2C27A) with the dark part left empty (transparent, only a hair-fine gold outline), joined by a hair-fine dotted gold line with two tiny stars at its ends. Elegant and fine. Cool moonlight from the top-left. No faces on the moons. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay 7 ay evresi, ortada dolunay; karanlık kısımlar şeffaf (ince kontur); iki uçta boşluk; yüz yok; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet bandı, details program, RSVP formu).

#### W16 Küçük pirinç teleskop (imza süsü)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/telescope.png` · 1000×700 · **Şeffaf zemin**

```
A small antique brass refracting telescope on a slender folding brass tripod, alone, seen from the side, its tube angled up to the right at about 30 degrees, on a fully transparent background: a polished brass tube (#9B7A3C, highlights #E2C27A) with two fine ring collars and a narrow dark eyepiece, a gently flared objective end with a thin dark lens rim, mounted on a small brass yoke on a three-legged tripod with delicate turned legs. Real antique brass with a gentle patina, a warm highlight from soft moonlight at the top-left. The telescope spans about x 10–90% and y 12–88% of the canvas. No light beam, no stars, no engraving with letters or numbers, no maker's plate. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek pirinç teleskop + üç ayak, sağa yukarı ~30°; ışın/yıldız yok; yazı/plaka yok; gerçek alfa.
Kullanım: tema kurulunca home imzasında ve details'te mekân çerçevesinin yanında küçük; teleskop ışını süpürmesi CSS'tir.

#### W17 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, cool soft moonlight from the top-left with a warm glint on gold. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files, the same light and scale: 1 = one small six-pointed star cut from real gold leaf (#C8A24E), slightly raised with a crisp warm highlight on its points; 2 = one slim crescent moon cut from real gold leaf (#C8A24E, highlight #E2C27A), its inner curve softly bevelled, no face; 3 = a tiny loose cluster of five or six silver-white and pale-gold star dust specks (#E6E9F1 and #E2C27A) of different sizes, each a crisp point of light with no glow or halo around it.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (altın yıldız, hilal, yıldız tozu); hâle/ışıma yok; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışta yıldızların tek tek yanması (accent_1, sırayla), süzülen hilal (accent_2), RSVP gönderilince yükselip sönen yıldız tozu (accent_3) — her biri ayrı katman, kendi fazında.

#### W18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic luxury stationery product photography, cool soft moonlight from the top-left with warm glints on gold and brass: the closed portrait midnight-blue envelope of flap.png with its half-circle dome flap engraved in gold leaf and the antique brass astrolabe of astro_plate.png with its pierced rete (astro_rete.png) resting on the flap's tip, lying slightly below the centre on the midnight-blue cotton paper of night_paper.png; at the left the edge of an antique star-atlas sheet on silver-ivory chart paper (no lettering) and the small brass telescope of telescope.png lying on its side; at the right a silver-ivory invitation card (as card_small.png, empty) half tucked behind the envelope and a few tiny gold-leaf stars and one gold crescent scattered; behind, softly out of focus, more midnight paper. Only midnight blue, silver-ivory, gold and brass tones. The top 20% of the image is calm and soft (only out-of-focus midnight paper). This image is cropped to 1200×630 for link previews: keep the whole envelope and astrolabe visible with at least 5% empty margin below them. No people, no flowers. No text, letters, numbers, zodiac signs, monograms, logos or watermarks.
```
Kontrol: zarf + usturlap bütün, altında ≥%5 boşluk; üst %20 sakin; çiçek/insan yok; yazı/rakam yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım: üstten ~%21) ve katalog kapağı.

---


## PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Ortak: photorealistic fine-art wedding photography, a calm midnight-blue, silver and warm gold palette, subtle film
grain; ONE fictional couple in their early thirties, the same two people in every photo (they must not resemble any
real person or celebrity): Celeste — long loose auburn waves, fair skin with light freckles, a slim gold ring; Rowan —
short dark-blond hair, a light stubble, olive skin. Modern, elegant clothing (no costume). Round photos are cropped from
square images: keep faces and hands in the middle 70%. No text, no frame, no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir. Story fotoğrafları sitede **yuvarlak** (1:1) kırpılır.

#### 2.1 Ana portre
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/hero_portrait.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1 wedding portrait of the fictional couple Celeste and Rowan, in their early thirties (Celeste: long loose auburn waves, fair skin with light freckles, a slim gold ring; Rowan: short dark-blond hair, a light stubble, olive skin; they must not resemble any real person or celebrity) at blue hour on a high desert ridge: she in a simple silver-ivory satin gown, he in a midnight-blue suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, the first stars appearing in a deep blue sky behind them and a small white observatory dome softly out of focus far away. Photorealistic, calm midnight, silver and gold palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "A shared telescope"
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/story_1.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) at night beside a small brass telescope on a tripod on a wooden deck, she looking through the eyepiece and laughing, he leaning in beside her pointing at the sky, a soft warm lantern light on their faces, a starry sky above. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "Night by the lake"
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/story_2.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1: the same couple as hero_portrait.jpg sitting close together on a wool blanket at the edge of a still mountain lake at night, seen from slightly behind and to the side, her head on his shoulder, the Milky Way softly reflected in the water, pine silhouettes. Photorealistic, same palette and grain. No text.
```

#### 2.4 Story 3 — "Under the dome"
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/story_3.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, on the brass rail of an old observatory telescope inside a wooden dome, a sliver of night sky through the open slit behind, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant garden on a pine-covered ridge at dusk with a small white historic observatory dome at one side, a lawn with a few rows of simple white chairs set for a ceremony facing a wide view of distant mountains, strings of warm small lights, the first stars in a deep blue sky. No people, no signs, no text. Photorealistic, same palette.
```


---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). `'celestial-observatory'` bloğu bugün eski
> (2026-10-20 fildişi + çiçek) görünümün çıktısını basıyor; bu zeminler gelince yeni görünüme geçer. Eski
> `print/invitation_front_5x7.png` / `invitation_back_5x7.png` dosyalarına dokunma (geçmiş); yeni dosyalar `_r_` adlı.
> **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px** = 5×7 in
> + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Zemin açık:** baskıda koyu mürekkep okunur kalsın diye zemin gümüş-fildişi harita kâğıdıdır (sitenin kart kâğıdı);
> gece mavisi ve altın yalnız süs bantlarında. **Yazı alanı:** ön yüzde yükseklikte %19–%90 × genişlikte %10–%90
> **tamamen boş** (isimler, tarih, mekân); arka yüzde %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez,
> `tools/make_qr.py` gerçek URL'den üretir). Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema yeniden kurulunca `layouts.ts` `'celestial-observatory'` bloğunda `sources` → `{ front:
>    'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`; `ink` / `accent` koyu (ink `#141A33`,
>    accent gold ink `#7A5A1E`).
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme celestial-observatory` ve `node scripts/print-sample.ts
>    --theme celestial-observatory --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü;
>    `public/print/celestial-observatory/`'deki artık kaynak olmayan eski dosyalar silinir.

#### P1 — Ön yüz
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the heavy silver-ivory chart paper of chart_paper.png (#EEEBE3) with its extremely faint engraved coordinate grid. Across the top, between 9% and 91% of the width, an engraved celestial band in real gold leaf (#C8A24E) and gold-brown ink (#7A5A1E): a shallow arch of two fine concentric coordinate arcs, a dotted constellation line linking small six-pointed gold stars along it, and at its centre a small antique brass astrolabe with its pierced rete (as astro_plate.png and astro_rete.png, only tick marks); nothing in this top band reaches lower than 17% of the height. Along the bottom, between 92% and 96% of the height and from 14% to 86% of the width, a row of seven small gold-leaf moon phases with a full moon in the middle (as divider.png). The rectangle from 19% to 90% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are printed there in dark ink): no star, no line, no grid stronger than the paper's faint texture, no shadow, no stain in it. No ornament within 8% of the left and right edges. Cool soft light from the top-left with a warm glint on the gold. Only silver-ivory, midnight blue, gold and brass tones. No QR code. No zodiac signs. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma harita kâğıdı; %19–%90 × %10–%90 tamamen boş; takımyıldız yayı + küçük usturlap yalnız üstte (%17'nin üstünde), ay evreleri yalnız altta; yan %8 boş; usturlapta rakam yok; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation (give invitation_front_r_5x7.png as the reference image), full bleed, portrait 5.25:7.25, perfectly flat: the same heavy silver-ivory chart paper, only a short engraved gold-leaf constellation across the top centre (between 32% and 68% of the width) — five small six-pointed stars linked by a dotted line with one slim gold crescent moon at its middle — its lowest point staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no star, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No zodiac signs. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada kısa takımyıldız + hilal (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

## PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) — GEÇERSİZ (2026-10-22: yeniden tasarım; tema kurulunca yeniden yazılacak)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Yazan: G175 (`tools/paket3_sahne.py` şablonu, 01–21 ile aynı). `tools/listing_editorial.py` 3.1, 3.2, 3.4 ve 3.5'i
> kullanır (ilan görselleri 1, 2, 8, 4); 3.3 yedek sahnedir.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a midnight blue velvet cloth over an antique wooden desk and a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a midnight blue velvet cloth over an antique wooden desk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a midnight blue velvet cloth over an antique wooden desk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a midnight blue velvet cloth over an antique wooden desk, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a midnight blue velvet sofa with a silver cushion and a ceramic coffee cup; a small arrangement of a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 29`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a midnight blue velvet cloth over an antique wooden desk, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a small antique brass telescope, an old star chart without lettering. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a midnight blue velvet cloth over an antique wooden desk, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a midnight blue velvet cloth over an antique wooden desk, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a midnight blue velvet cloth over an antique wooden desk: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a midnight blue velvet cloth over an antique wooden desk: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a midnight blue velvet cloth over an antique wooden desk, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a small antique brass telescope, an old star chart without lettering; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a midnight blue velvet cloth over an antique wooden desk, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a midnight blue velvet cloth over an antique wooden desk: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.

---

## PAKET 8 — Celestial Observatory yeniden tasarım (2026-10-24)

> Kullanıcı (2026-10-23/24): 21'den itibaren her tasarım "çok iyi bir profesyonel tasarımcının elinden çıkmış gibi"; kendine
> özgü bileşen, hareket ve ses; "cesur ve yaratıcı ol". 29'un bugünkü sitesi (PAKET 5R: gece mavisi zarf + yarım daire kubbe
> kapak + pirinç usturlap kapanış + planisfer halkaları) çıta değildir. PAKET 8 tasarımı baştan GPT'ye çizdirir (K21): önce
> **W1** tasarım panosu, sonra aynı sohbette panodan türeyen **W2** parçaları (25 dosya). Claude yalnız keser, maskeler,
> ölçekler, ışık verir ve HTML/CSS/JS kurar; çizmez. Bu bölüm dosyanın başındaki "Instructions for GPT" notunun (night_paper /
> env_back / astro_plate referansları) ve PAKET 5R'nin yerini alır.
>
> Claude için notlar:
> - W1'in kayıt satırı bilerek kalın değil: yol `mockups/` altında olduğu için `kit_check` / `gpt_yerlestir` orada yeşil ekran
>   arar. Panoyu GPT doğrudan commit eder; `gpt_yerlestir`'e verilmez.
> - W1 demo metni `content.demo.json` ile aynı: Celeste & Rowan; Saturday, August 14, 2027; Starlight Ridge Observatory
>   Gardens, Flagstaff, Arizona; RSVP son günü July 10, 2027; program 6:30 / 7:00 / 8:00 / 11:00 PM (yerleriyle); Black tie
>   optional; story başlıkları "A shared telescope" / "Night by the lake" / "Under the dome"; yemek seçeneği "Fish". Geri sayım
>   örneği 294 gün (2026-10-24'ten).
> - Dosya adları bilerek eski adlardan farklı — PAKET 5R (`night_paper`, `chart_paper`, `env_*`, `flap*`, `astro_*`,
>   `card_small`, `medallion_frame`, `planisphere_*`, `venue_frame`, `corner_ornament`, `divider`, `telescope`, `accent_1..3`,
>   `web_hero`) ve git geçmişindeki geçersiz PAKET 5 (G168: `astrolabe`, `dome`, `shutter`, `night_sky`, `star_chart`,
>   `star_1`, `orbits`, `moon_phases`, `planisphere_ring`): `gpt_is_listesi` aynı yolda dosyadaki ilk prompt'u alır, eski prompt
>   kazanırdı. Yeni adlar: `sky_plate`, `night_tile`, `chart_tile`, `arm_*`, `sky_chart`, `frame_dome`, `dome_shutter`,
>   `frame_lens`, `frame_plate`, `card_dome`, `divider_stars`, `dial_*`, `icon_*`, `accent_star|twinkle|comet`. Eski parçalar
>   silinmez; tema yeniden kurulana kadar canlı site onları kullanıyor.
> - Foto pencereleri yeşil değil, **şeffaf açıklık** (21/22 TESLİM dersi); prompt'larda bilerek yeşil hex kodu yok. Maske,
>   kapalı halkanın içindeki şeffaf bölgeden çıkarılır. Bütün ölçüler GPT'nin yerel tuvalleri (1024×1024, 1024×1536,
>   1536×1024); ince bant (ayırıcı) 3:2 tuvalin ortasında, Claude kırpar.
> - **Açılış nesnesi zarf değil, katlanır pirinç armiller küre** (bir "kapalı madalyon" gibi düzlemde katlı halkalar) + kalbinde
>   **düğün gecesi gök haritası** (`sky_chart`). Halkalar aynı tuvali paylaşmaz: hepsi ortalı tam daire; Claude her birinin dış
>   çapını alfadan ölçer, `arm_stand` halkasının iç çapına göre iç içe ölçekler (equator ≈ meridyen iç çapının %96'sı, ecliptic
>   ≈ equator iç çapının %96'sı, lace ≈ ecliptic iç çapının %96'sı, harita ≈ lace iç çapının %94'ü) ve pim göbekleri eksene
>   gelmiyorsa görseli düzlem içinde döndürür (çizim değil, dönüşüm). 3B: düz halka görselleri `transform-style: preserve-3d`
>   içinde `rotateX/rotateY` ile elips olur; kesişen düzlemlerin önü/arkası tarayıcı sıralamasına kalır. iOS Safari'de doğru
>   çıkmazsa Claude her halkayı eksen boyunca düz bir kesimle iki yarıya ayırır (uzak yarı haritanın arkasında, yakın yarı
>   önünde). **Denenmedi.**
> - `dome_shutter` tek görseldir; Claude ortadaki dikey dikişten iki kanada keser; kanatlar `frame_dome` penceresinin maskesi
>   içinde yanlara kayar (kenarları pervazın altında kalır). `card_dome` 3 dilim (22 `card_gilt`, 24 `playbill_card` gibi).
> - Paylaşım (og) görseli ayrıca istenmedi: Claude `sky_plate` + kapalı armiller (`arm_stand` + üç halka + `sky_chart`)'den
>   kurar. PAKET 6R basılı davetiye (üstte usturlaplı bant) ve PAKET 3/7 ilan sahneleri (pirinç teleskop, yıldız haritası seti)
>   bu turda değişmez; yeni görünüme uyum gerekirse ayrı paket.
> - START HERE ve paneldeki açılış adı bugün `dome` / `Dome`; "Armillary" (ya da "Sky") olup olmayacağına entegratör karar
>   verir. `DESIGN_BRIEF.md` (açılış, motifler, font), `COLLECTION_STATUS.md`, `kuru_sekil.json` ve tema testi entegratörde
>   güncellenir.
> - **Palet değişmez** (`midnight-silver-gold`; G177 varyantları `recolor.json` `midnight` + `gold` ailelerine bağlı). Bu yüzden
>   prompt'larda başka renk ailesi yok (yeşil pas, mor/turkuaz gök yok). Parçalar gelince aile çapaları gerçek parçalarda
>   yeniden ölçülür ve `tools/recolor_parts.py build/check --design 29` koşulur.
> - **Font değişir:** Forum artık 23'ün (PAKET 8); 29 **Imperial Script** (kendi fontu, başka tema kullanmıyor) +
>   **Ibarra Real Nova** (yeni, hiçbir temada yok). İkisi de 2026-10-24'te HTTP 200 (`Ibarra+Real+Nova:ital,wght@0,400;0,500;
>   0,600;0,700;1,400;1,600` ve `Imperial+Script`; latin + latin-ext). 26/27/28/30 aynı anda font seçiyor: biri Ibarra Real
>   Nova'yı alırsa yedek **Baskervville** + **Baskervville SC** (ikisi de 200; Libre Baskerville'den ayrı aile, ama 08 Winter
>   Evergreen'in Libre Baskerville gövdesine yakın görünür — entegratör karar verir).
> - **Dürüstlük:** `sky_chart` uydurma bir gök haritasıdır; çiftin düğün gecesinin gerçek göğü değildir. İlan ve START HERE'de
>   "the sky on your wedding night" gibi gerçek gök iddiası yazılmaz (Claude gerçek yıldız konumlarını hesaplayıp UI noktası
>   olarak koymadıkça). Baş harflerin takımyıldızı ve story'deki takımyıldız çizgisi 1 px UI çizgisidir (DESIGN_BRIEF izinli),
>   görsele pişmez.

### Sanat yönetimi — "Two rings, one sky"

- **Signature.** The site is the private observatory of an 18th-century astronomer on the couple's wedding night. The opening
  object is a **folding brass armillary sphere**: closed, its rings lie folded flat in one plane like a brass locket on a
  slender stand, with a small round chart of the night sky at its heart carrying the couple's initials. On tap the rings swing
  out one by one into a full sphere (two of them read as the couple's two rings), and the chart of the wedding-night sky rises
  out of the sphere toward the guest, turning like a planisphere being set to the date, and becomes the home page.
- **The sky carries the site.** Home = that round wedding-sky chart with the names in its centre, the open armillary as its
  crest; the portrait behind the arched **dome window** whose two shutter leaves slide apart; the countdown in four small brass
  **instrument dials**. Story = **"the constellation of us"**: three photos seen through brass **telescope lens cells**, joined by
  a dotted gold constellation line drawn as you scroll, each photo pulled into focus. Details = the observer's ephemeris on a
  **dome-topped chart card** with engraved icons, the venue framed as an **atlas plate** with a graduated border. RSVP = the dome
  card; on sending, an engraved gold **comet** crosses the sky.
- **Materials.** Midnight-blue cotton paper printed like an 18th-century celestial atlas plate (silver engraving, silver
  Milky Way stipple, raised gold leaf); silver-ivory chart paper with gold-brown engraving; warm antique brass instruments
  with crisp tick scales. Everything photographed for real like luxury stationery; never flat vector, never sci-fi.
- **Colour (unchanged; G177 variants depend on it).** midnight `#11193A` · night `#0A0F24` · chart paper `#EEEBE3` · silver
  `#C9CFDC` · silver light `#E6E9F1` · gold `#C8A24E` · gold light `#E2C27A` · gold ink `#7A5A1E` · brass `#9B7A3C` · ink
  `#141A33`. Light: cool soft moonlight from the upper left, one warm highlight on gold and brass.
- **Not the others.** 21 owns envelopes, wax seals, roses, the oval; 22 the moon (as a seal or a full moon), the night lake and
  photographic night skies; 23 the jewel box, pearls, gems; 24 curtains and the paper theatre; 25 windows of a train, tickets,
  posters; 19 flowers and candles; 31 lanterns; 48 crests and shields. 29 drops its own old envelope, dome flap and astrolabe
  closure. No zodiac signs, no mythological constellation figures, no constellation names, no planets with rings, no coloured
  nebulae, no neon, no lens flare, no planetarium look. Stars and invented engraved constellations belong to 29.
- **Type (Google Fonts; both answered 200 on 2026-10-24).** **Imperial Script** — the names and script headings ("Our Story",
  "The Evening", "Kindly Reply"), ≥ 30 px: a formal copperplate script, the engraved dedication of the plate (kept; no other
  theme uses it). **Ibarra Real Nova** 400/600 + italic — widely letter-spaced capitals for dates, labels, buttons and times
  (the engraved title of a star atlas: Gerónimo Gil's 1780 types for Joaquín Ibarra's Quixote, recovered with Spain's
  Calcografía Nacional — the national copperplate collection), and the same face for body text and italic captions. Replaces
  Forum (now 23's).
- **Motion (Claude builds it; GPT designs for it).** Tap → the gilt star finial turns a quarter and clicks → the lace ring swings
  open (`rotateY 0→-68°`), then the star band (`rotateZ(-23.5°) rotateY 0→72°`, the obliquity of the ecliptic), then the
  graduated ring (`rotateX 0→74°`), each with a small overshoot and settle, light running along the brass → the sphere starts a
  slow precession → the chart rises out of the sphere toward the guest, scaling up and turning ~40° like a volvelle, the
  initials giving way to the names → the stars of the plate light one by one and gold hairline constellations draw between them
  → a comet crosses once → home (view transition). Every piece moves on its own; nothing is a plain fade. Home: the shutter
  leaves part over the portrait; dial pointers creep round their ticks. Story: constellation line draws on scroll, each lens
  "focuses" (blur → sharp). Details: each programme row's star lights in turn; the venue's scale bars are swept by a band of
  light. RSVP: comet + rising star dust. Reduced motion: everything still, straight cuts.
- **Sound (Claude synthesises them, `tools/audio_fx.py`; silent until the first tap).** (1) tap: a fine brass detent click
  with a tiny tick; (2) the three rings swinging: three soft metallic swishes, each ending in a faint struck-brass-hoop shimmer,
  rising in pitch; (3) the chart rising: a soft paper slide over a warm, low glass-harmonica chord; (4) stars lighting: a sparse
  run of tiny glass-bell pings (pentatonic), like a music box of stars; (5) the comet: one airy, high shimmer sweep, left to
  right; (6) RSVP sent: one clear observatory-clock bell strike with a soft sparkle tail.

**Instructions for GPT (send before the first image):**
```
You are the art director and the still-life photographer of a luxury wedding stationery house, designing the mobile wedding website "Celestial Observatory" from scratch. Its signature: the private observatory of an 18th-century astronomer on the couple's wedding night. The opening object is a folding brass ARMILLARY SPHERE: closed, its rings lie folded flat in one plane like a brass locket on a slender stand, with a small round chart of the night sky at its heart; on tap the rings swing out into a full sphere and the chart of the wedding-night sky rises out of it and becomes the home page. The observatory DOME is the second motif: dome-topped cards and an arched dome window with sliding shutter leaves. Materials, all photographed for real like luxury stationery: deep midnight-blue cotton paper (#11193A, #0A0F24) printed like a plate of an 18th-century celestial atlas with fine silver engraving (#C9CFDC, #E6E9F1) and raised burnished gold leaf (#C8A24E, highlights #E2C27A); heavy silver-ivory chart paper (#EEEBE3) with fine gold-brown engraving (#7A5A1E); warm antique brass instruments (#9B7A3C) with crisp engraved tick scales and a warm patina, never green. Stars and invented constellations joined by fine dotted lines are the decoration. Never: zodiac signs or glyphs, mythological constellation figures, constellation names or labels, numerals on scales, planets with rings, coloured nebulae or galaxies, neon, lens flares, rockets, a planetarium look, a photographic night sky, a large full moon or a moon used as a seal, lakes or night water, envelopes, wax seals, an astrolabe, flowers, candles, jewels or pearls, curtains, lanterns, crests or shields. It is an imaginary observatory: it must not resemble any real observatory, instrument maker, atlas page, brand, artist or another seller's design. One cool soft moonlight from the upper left with one warm highlight on gold and brass in every image. First you draw a design board of five phone screens (W1); then, giving that board as the reference image of every image, you make the production parts (W2): one object per image, no cast or drop shadow, no glow or halo outside the object, no text, letters, numbers, monograms, logos or watermarks. A transparent background must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard), and the object must stay at least 5% inside every edge.
```

#### W1 — Tasarım panosu (5 telefon ekranı; demo metin serbest, YALNIZ referans)
Kaydet (W1): `collections/29_Celestial_Observatory/assets/gpt/mockups/design-board.png` · yaklaşık 1908×824 (≈2,3:1; araç vermiyorsa 1536×1024, beş ekran tek sırada) · opak · kit_check dışı

```
Use case: ui-mockup. Create a high-fidelity art-direction board of FIVE mobile wedding-website screens, each exactly 390 by 844 in proportion, arranged side by side in one horizontal row with even gaps and generous margins on a soft cool pale-grey studio background (the whole board about 2.3:1). The five screens must look like one finished, coherent, best-selling premium product by a top luxury stationery designer: rich, tactile, romantic, classic and bold; never minimal, never flat vector, never clip-art, never science fiction. The attached photographs (hero_portrait.jpg, story_1.jpg and venue.jpg) are ONLY the identity and styling reference for the fictional couple Celeste and Rowan (she: long loose auburn waves, fair skin with light freckles, a silver-ivory satin gown; he: short dark-blond hair, a light stubble, olive skin, a midnight-blue suit) and for the venue; use them for the photos inside the screens; everything else is new.

THE CONCEPT — "Two rings, one sky": the private observatory of an 18th-century astronomer on the couple's wedding night. Everything is a real object, photographed like luxury stationery: deep midnight-blue cotton paper (#11193A, #0A0F24) printed like a plate of an 18th-century celestial atlas with fine silver engraving (#C9CFDC) and raised burnished gold leaf (#C8A24E, highlights #E2C27A); heavy silver-ivory chart paper (#EEEBE3) with fine gold-brown engraved lines (#7A5A1E); warm antique brass instruments (#9B7A3C) with crisp engraved tick scales. The signature object is a folding brass ARMILLARY SPHERE whose rings fold flat like a closed locket and swing open into a sphere; at its heart lies a round engraved chart of the sky on the wedding night. The observatory DOME is the second motif: dome-topped cards and an arched dome window with sliding shutter leaves. Stars and invented engraved constellations joined by fine dotted lines are everywhere. NO zodiac signs or glyphs, no mythological constellation figures, no constellation names or labels, no planets with rings, no coloured nebulae or galaxies, no neon, no lens flares, no planetarium look, no photographic night sky, no large full moon and no moon used as a seal, no lake or night water, no envelope, no wax seal, no astrolabe, no flowers, no candles, no jewels, no curtains, no lanterns.

TYPOGRAPHY: the couple's names and the script headings in a formal copperplate script with fine hairlines and shaded swelling strokes, like the engraved dedication on an 18th-century plate; dates, labels, times and buttons in widely letter-spaced 18th-century neoclassical roman capitals, like the engraved title of a star atlas; body text in the same refined 18th-century roman with a graceful italic. Gold and silver type on midnight paper; midnight ink and gold-brown type on chart paper.

Screen 1 — the opening (the closed armillary): full-bleed midnight-blue paper engraved like a celestial atlas plate: a faint grid of thin coordinate arcs, a soft diagonal band of the Milky Way in fine silver stipple, scattered small engraved stars, a few of them in gold leaf. At the top, small spaced silver capitals "TOGETHER WITH THEIR FAMILIES" and the names "Celeste & Rowan" large in the gold copperplate script. In the middle, about 80% of the screen width, a brass armillary sphere on a slender turned brass stand, seen perfectly face-on, its rings FOLDED FLAT into one plane so they read as concentric rings, like a closed brass locket: the outer fixed meridian ring with a fine engraved tick scale and a small gilt eight-pointed star finial on its top; inside it three nested rings — a plain graduated ring, a wider band engraved with a row of small gold-leaf stars, and a slender ring of pierced brass lacework; at the very centre a small round midnight-blue star-chart disc with a narrow silver-ivory rim, carrying "C & R" in the gold script. Below: "AUGUST 14, 2027 · FLAGSTAFF, ARIZONA" in small spaced capitals and "Tap to open" in italic.

Screen 2 — home: the top 55% on midnight paper. At the top centre the same armillary sphere, small and now OPEN: its three inner rings swung out of the plane and crossing each other like a real sphere (one tipped back almost flat, one turned sideways, the wide star band tilted diagonally). Below it, about 90% of the screen width, the round chart of the wedding-night sky: a midnight-blue paper disc engraved with thin silver circles and hour lines, a soft silver Milky Way, many tiny stars with the brightest in raised gold leaf, a few invented dotted constellations, and a narrow silver-ivory rim with a gold tick scale; in its calm round centre, inside a fine gold double rule, "Celeste & Rowan" in the gold script and "AUGUST 14, 2027" in small spaced capitals. Under the chart "STARLIGHT RIDGE OBSERVATORY GARDENS · FLAGSTAFF, ARIZONA". The lower part of the screen is a band of silver-ivory chart paper: at the left the couple's portrait (from hero_portrait.jpg) in a tall arched frame shaped like the opening of an observatory dome (a round-topped arch of antique brass with an outer band of midnight-blue enamel set with tiny gold stars, short gilt ribs around the arch, a small gilt star at its apex), its two midnight-blue shutter leaves slid half open to the sides; at the right, in italic, "Together with their families request the pleasure of your company at their wedding"; across the bottom a countdown in four small round brass instrument dials (silver-ivory faces with a fine ring of tick marks, a slim brass pointer on the rim of each) holding "294 DAYS", "06 HOURS", "42 MINUTES", "18 SECONDS".

Screen 3 — story: midnight paper with a very faint engraved chart. Small spaced capitals "MOMENTS WE HOLD DEAR" and the heading "Our Story" in the gold script. Down the screen — left, right, left — three round photographs, each seen through a round brass telescope lens cell (a knurled brass focusing ring, a polished brass collar with a fine tick scale, a thin dark inner rim), joined by a dotted gold-leaf constellation line with a small gold star at each turn, so the three photos form the couple's own constellation: 1) the couple laughing at a small brass telescope at night (as story_1.jpg), caption "A shared telescope"; 2) the couple sitting close by a still mountain lake at night, seen from behind, caption "Night by the lake"; 3) their hands with a slim gold ring on the brass rail of an old observatory telescope, caption "Under the dome" — this third photo still softly out of focus, as if the lens were being focused. Captions in italic; a few tiny gold stars.

Screen 4 — details: silver-ivory chart paper. The heading "The Evening" in the script in midnight ink, "SATURDAY, AUGUST 14, 2027" in spaced capitals, a fine gold divider with a tiny dotted constellation of five stars at its centre. The order of the evening: four rows, each with a small engraved gold line icon at the left (two champagne coupes · two interlocked rings · a plate with a knife and a fork · a slim crescent moon with two tiny stars), the time in spaced capitals, the event in the script and the place in italic: "6:30 PM · Welcome drinks · The telescope terrace", "7:00 PM · Ceremony · The meridian lawn", "8:00 PM · Dinner & dancing · The dome pavilion", "11:00 PM · Late-night snacks · Under the stars"; a small engraved bow-tie icon with "DRESS CODE · Black tie optional". Then the venue photograph (from venue.jpg) framed as an 18th-century atlas plate: a chart-paper mat with a graduated border — a double neat-line with alternating gold and ivory scale bars and fine ticks on all four sides, a small gold star in each corner, a slim antique brass outer edge; under it "STARLIGHT RIDGE OBSERVATORY GARDENS · FLAGSTAFF, ARIZONA" and an outlined midnight button with a tiny engraved compass icon, "View map".

Screen 5 — RSVP: the midnight celestial plate. A tall silver-ivory chart-paper card fills most of the screen; its top is shaped like an observatory DOME (a full semicircle) with short gilt ribs along the arch, a fine gold double rule following the curve and a small gilt eight-pointed star at its apex; inside the dome the heading "Kindly Reply" in the script and "by July 10, 2027" in italic; below, a real, readable form in midnight ink: "Your name" on a fine gold underline, "Will you join us?" with two round options "Joyfully accepts" and "Regretfully declines", "Number of guests" as a select showing "2", "Your meal preference" as a select showing "Fish", and a full-width midnight-blue button with a thin gold edge, "Send reply". Across the top right of the screen an engraved gold-leaf comet streaks diagonally, its long tail drawn in fine hatched lines; a few small gold stars.

All five screens share one world (the same midnight paper, chart paper, gold leaf, brass and cool moonlight from the upper left with warm glints on gold) but each has its own composition — not all centred. Use exactly this English sample text and no other words; do not write the design's name anywhere. Photos show the fictional adult couple only, natural and tasteful, not resembling any real or famous person. No device frames or bezels, no hands, no laptop, no marketing collage, no logos, no watermarks, no captions outside the screens. This is a design reference board, not a final website.
```
Kontrol: 5 ekran yan yana, her biri ~390:844; 1. ekranda **düzlemde katlı** (iç içe daireler, kapalı madalyon gibi) ayaklı pirinç
armiller, kalbinde "C & R"li küçük koyu gök haritası; 2. ekranda tepede **açılmış** armiller (halkalar birbirini kesiyor), büyük
yuvarlak koyu gök haritası ortasında isimler, kubbe kemerli portre çerçevesi + yarı açık iki kepenk kanadı, 4 pirinç kadranlı geri
sayım; 3. ekranda teleskop mercek halkalarında 3 foto + aralarında noktalı altın takımyıldız çizgisi; 4. ekranda gravür altın ikonlu
program + dereceli atlas levhası çerçevesinde mekân + pusulalı "View map"; 5. ekranda kubbe tepeli kartta okunur form + kuyruklu
yıldız. Burç simgesi, takımyıldız figürü/adı, ölçeklerde rakam, renkli bulutsu, fotoğraf gök, büyük dolunay, göl, zarf, mühür,
usturlap, çiçek, mum yok; tasarımın adı yazılmamış. Metindeki küçük harf bozuklukları kabul (yalnız referans). Beğenilmezse ya da
sıradan görünürse yeniden üret (en çok 3 deneme); W2 bu panodan türer.
Kullanım: Claude'un yerleşim, tipografi ölçeği ve renk referansı; armillerin ekran genişliğine oranı, haritanın home'daki boyu,
kubbe penceresi ve kadranların yeri buradan ölçülür.

### W2 — Parçalar (panodan türer; HER parçada `design-board.png` referans görsel; YAZI YOK)

Ortak kurallar: tek görselde tek nesne · şeffaflar gerçek alfa · zemine düşen gölge yok · nesnenin dışında ışıma/hâle/ışın yok
(yıldız ışıltısını, ay ışığını, ışık süpürmesini site CSS ile ekler) · ışık sol üstten serin ay ışığı, altın ve pirinçte tek sıcak
vurgu · oran önemli, piksel değil · yıldız, çentik, tırtıl, takımyıldız **sayısı** önemli değil, sayı için yeniden üretme · halka
parçaları **tam daire ve tam karşıdan** (elips değil; elipsi site 3B dönüşle yapar).

#### W2.1 Göksel atlas levhası — telefon zemini (açılış ve RSVP)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/sky_plate.png` · 1024×1536 · opak

```
Production background for the "Celestial Observatory" wedding website (give design-board.png as the style reference), the midnight celestial plate behind screens 1 and 5 of the attached design board. A full-frame vertical (2:3) image, edge to edge, perfectly flat and straight on: thick midnight-blue cotton paper (#11193A, drifting gently toward #0A0F24 in soft clouds) with a soft felt tooth, printed like a plate of an 18th-century celestial atlas: a faint engraved grid of thin coordinate arcs and meridian lines in a slightly lighter blue-silver (low contrast), a soft band of the Milky Way crossing the sheet diagonally from the upper right to the lower left, rendered as delicate silver (#C9CFDC) engraved stipple and fine hatching, and a scatter of small engraved stars of different sizes (tiny six- and eight-pointed stars in silver-white #E6E9F1), a few of the brightest in small touches of raised gold leaf (#C8A24E), with two or three invented constellations joined by fine dotted silver lines. The middle of the sheet, from 22% to 78% of the height, is calmer (fewer stars, the Milky Way softer there) so light text and a brass object can sit on it. Even, cool soft moonlight from the upper left; no vignette, no hotspot, no fold, no stain. Keep every important detail within the middle 85% of the width. No constellation figures, no zodiac signs, no moon, no planets, no coloured nebulae, no photographic sky. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tam opak; gece mavisi kâğıt üstünde gümüş gravür (yay ızgarası, çapraz Samanyolu noktalaması, yıldızlar, birkaç varak yıldız, uydurma noktalı takımyıldız); orta %22–78 sakin; fotoğraf gök/bulutsu/ay/burç/figür yok; yazı yok.
Kullanım: açılış ve RSVP sayfası zemini; açılışta yıldızlar tek tek yanar (Claude görseldeki parlak yıldız noktalarını ölçüp üstlerine CSS ışık + `accent_*` koyar); 700 px ve üstünde ortada `cover`, yanlarda `night_tile`.

#### W2.2 Gece mavisi kâğıt — dikişsiz doku
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/night_tile.png` · 1024×1024 · opak · dikişsiz

```
Production texture for the "Celestial Observatory" wedding website (give design-board.png and sky_plate.png as the reference images), the midnight paper of the story page of the attached design board. A seamless, tileable square texture of the same thick midnight-blue cotton paper as sky_plate.png (#11193A, a soft felt tooth), seen perfectly flat and straight on, printed VERY faintly with the same engraving: a few thin coordinate arcs and a sparse, even scatter of tiny silver star points and a very few tiny specks of gold leaf — no Milky Way band, no constellations, very low contrast, spread evenly so no area is busier than another. Perfectly even lighting: no vignette, no gradient, no hotspot, no fold, no stain, so that four copies placed side by side join invisibly (the left edge continues the right edge, the top edge continues the bottom edge). No text, letters, numbers, logos or watermarks.
```
Kontrol: çok soluk gravür, eşit ışık; 2×2 dizince dikiş görünmüyor (Claude dizip bakar; küçük dikişi ofsetle kendisi giderir — yalnız bunun için yeniden üretme); opak.
Kullanım: story sayfası ve home'daki koyu bantların zemini (`background-repeat`).

#### W2.3 Gümüş-fildişi harita kâğıdı — dikişsiz doku
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/chart_tile.png` · 1024×1024 · opak · dikişsiz

```
Production texture for the "Celestial Observatory" wedding website (give design-board.png as the style reference), the silver-ivory chart paper of the details page and the cards of the attached design board. A seamless, tileable square texture of heavy silver-ivory chart paper (#EEEBE3) seen perfectly flat and straight on: a fine smooth surface with the faintest laid lines, a soft cool-ivory tone with only gentle natural variation, an extremely faint engraved grid of thin coordinate arcs in pale gold-brown ink (#7A5A1E at very low strength) so faint it reads as texture, and a very few tiny flecks of gold leaf (no more than six over the whole square). Perfectly even lighting: no vignette, no gradient, no hotspot, no fold, no stain, no foxing, no border, calm enough for small dark text everywhere; four copies placed side by side join invisibly. No stars bigger than a dot. No text, letters, numbers, logos or watermarks.
```
Kontrol: gümüş-fildişi, sakin; ızgara çok soluk; altın pul çok seyrek; 2×2 dikişsiz; opak.
Kullanım: details sayfası ve home'daki açık bantların zemini (`background-repeat`).

#### W2.4 Armiller küre — ayak ve sabit meridyen halkası (açılış nesnesinin gövdesi)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/arm_stand.png` · 1024×1536 · **Şeffaf zemin** · halkanın içi şeffaf

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the armillary sphere on screen 1 of the attached design board. ONLY the fixed frame of a folding brass armillary sphere, alone, seen perfectly straight from the front at eye level, no perspective, photographed for real: a slender turned stand and the outer fixed meridian ring — no inner rings, no chart, no globe, nothing inside the ring. Placement on the canvas, exactly: the meridian ring is a PERFECT CIRCLE (not an ellipse) centred at 50% of the image width and 42% of the image height, its outer diameter 80% of the image width (from x 10% to x 90%), its band about 6% of the image width wide — a flat band of warm antique brass (#9B7A3C, highlights #E2C27A) with a fine raised edge on both sides and a crisp engraved scale of evenly spaced tick marks (ticks only), and two small brass pivot pins pointing inward from its inner edge at the very top and the very bottom. On top of the ring, at its highest point, a small turned brass finial carrying a small gilt eight-pointed star, reaching up to about 8% of the image height. Below, the ring rests in a small curved brass cradle on a slender turned baluster stem with a few fine mouldings, standing on a round, gently domed brass foot with three small scrolled feet; the foot spans about x 32–68% of the width and its lowest point is at about 92% of the height. Everything INSIDE the ring is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it), and everything outside the object is transparent too. Real antique brass with a gentle warm patina (never green), hand-worn bright edges, cool soft moonlight from the upper left with one warm highlight on the metal. No numerals, no letters, no zodiac signs, no maker's mark. No cast shadow or drop shadow, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: halka tam daire (elips değil), merkez ~(%50, %42), dış Ø ~%80; yalnız çentikler; üstte yıldızlı tepelik, altta torna gövde + üç kıvrık ayaklı taban; halkanın içi tamamen şeffaf; iç halka/küre/harita yok; yeşil pas yok; gerçek alfa.
Kullanım: açılış nesnesinin sabit gövdesi (en arka katman); Claude halkanın merkezini ve iç çapını alfadan ölçer (daire uydurma), iç halkaları ve haritayı buna göre ölçekler; dokununca tepelik yıldızı çeyrek tur döner ("tık"); home'da açılmış armiller küçük tepe süsü; og görselinin ana nesnesi.

#### W2.5 Armiller — derecelendirilmiş halka (yatay eksende açılır)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/arm_ring_equator.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png and arm_stand.png as the reference images: the same brass, the same engraving, the same light), one of the inner rings of the armillary sphere on screen 1 of the attached design board. ONE single flat brass ring, alone, seen perfectly face-on: a PERFECT CIRCLE centred on the canvas — not an ellipse, no perspective, no tilt. Its outer diameter is 88% of the image width and its band is about 6% of the image width wide (inner diameter about 76%). A plain graduated ring of warm antique brass (#9B7A3C, highlights #E2C27A) with a fine raised edge on both sides and a crisp engraved scale of evenly spaced tick marks along its face, every fifth tick longer (ticks only). Exactly opposite each other on the ring, at 3 o'clock and at 9 o'clock, two tiny round brass pivot bosses. Everything inside the ring and outside it is COMPLETELY TRANSPARENT (a real alpha channel). Cool soft moonlight from the upper left with a warm highlight on the upper-left part of the ring. No numerals, no letters, no zodiac signs. No cast shadow or drop shadow, no glow or halo. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek düz halka, tam daire; yalnız çentikler; saat 3 ve 9 yönünde iki küçük pim göbeği; içi ve dışı şeffaf; gerçek alfa.
Kullanım: üç iç halkanın en dışı; açılışta `rotateX 0→74°` (yatay eksen, pimler eksende), en son açılır; home tepe süsünde yavaş devinim.

#### W2.6 Armiller — yıldızlı ekliptik bandı (eğik eksende açılır)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/arm_ring_ecliptic.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png and arm_stand.png as the reference images: the same brass, the same engraving, the same light), the wide star band of the armillary sphere on screen 1 of the attached design board. ONE single flat brass band ring, alone, seen perfectly face-on: a PERFECT CIRCLE centred on the canvas — not an ellipse, no perspective, no tilt. Its outer diameter is 88% of the image width and the band is about 10% of the image width wide (inner diameter about 68%). A flat band of warm antique brass (#9B7A3C, highlights #E2C27A) with a fine raised rim along both edges; along the middle of its face, between two hair-fine engraved lines, a row of small six-pointed stars in raised burnished gold leaf (#C8A24E), evenly spaced all the way round (stars in place of the zodiac signs of a real armillary — absolutely NO zodiac signs or glyphs). Exactly opposite each other on the band, at 12 o'clock and at 6 o'clock, two tiny round brass pivot bosses. Everything inside the band and outside it is COMPLETELY TRANSPARENT (a real alpha channel). Cool soft moonlight from the upper left with a warm highlight on the upper-left part of the band. No numerals, no letters. No cast shadow or drop shadow, no glow or halo. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek geniş düz bant, tam daire; ortasında altın varak altı köşeli yıldız dizisi; burç simgesi yok; saat 12 ve 6 yönünde iki pim göbeği; içi ve dışı şeffaf; gerçek alfa.
Kullanım: ortadaki halka; açılışta `rotateZ(-23.5°) rotateY 0→72°` (ekliptiğin eğikliği), ikinci açılır; yıldızlarının üstünden ışık geçer.

#### W2.7 Armiller — oyma dantel halka (dikey eksende açılır)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/arm_ring_lace.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png and arm_stand.png as the reference images: the same brass, the same light), the slender pierced ring of the armillary sphere on screen 1 of the attached design board. ONE single flat brass ring of pierced lacework, alone, seen perfectly face-on: a PERFECT CIRCLE centred on the canvas — not an ellipse, no perspective, no tilt. Its outer diameter is 88% of the image width and its band is about 8% of the image width wide (inner diameter about 72%): two thin round rims of warm antique brass (#9B7A3C, highlights #E2C27A) joined by a delicate openwork of tiny pierced six-pointed stars and small scrolls running evenly all the way round; the piercings are TRULY TRANSPARENT (a real alpha channel). Exactly opposite each other on the ring, at 12 o'clock and at 6 o'clock, two tiny round brass pivot bosses. Everything inside the ring and outside it is COMPLETELY TRANSPARENT. Cool soft moonlight from the upper left with a warm highlight on the upper-left part of the ring. No numerals, no letters, no zodiac signs. No cast shadow or drop shadow, no glow or halo. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek ince oyma halka, tam daire; iki ince kenar arasında yıldız-kıvrım dantel, delikleri gerçekten şeffaf; saat 12 ve 6 yönünde iki pim göbeği; içi ve dışı şeffaf; gerçek alfa.
Kullanım: en içteki halka (haritayı çevreler); açılışta ilk açılır, `rotateY 0→-68°`.

#### W2.8 Düğün gecesi gök haritası (armillerin kalbi → home hero)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/sky_chart.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the round chart of the wedding-night sky on screen 2 (and the small disc at the heart of the armillary on screen 1) of the attached design board. ONE round engraved star chart, alone, seen perfectly face-on: a perfect circle of thick midnight-blue cotton paper (#11193A, deepening to #0A0F24 toward the rim), its diameter 88% of the image width, centred, cut cleanly with a hair-thin gilt edge. Around its edge a narrow rim band of silver-ivory chart paper (#EEEBE3, about 4% of the disc's diameter wide) engraved with a fine gold-brown (#7A5A1E) scale of evenly spaced tick marks (ticks only). Inside the rim, the sky engraved as on an 18th-century celestial chart: thin concentric silver (#C9CFDC) circles and radial hour lines, a soft band of the Milky Way in fine silver stipple crossing the disc, a rich scatter of tiny engraved stars of different sizes in silver-white (#E6E9F1), the brightest ones as small six- and eight-pointed stars in raised burnished gold leaf (#C8A24E, highlights #E2C27A), and four or five invented constellations joined by fine dotted gold lines. In the exact centre a perfectly round CARTOUCHE with a diameter of 50% of the disc, bordered by a fine gold-leaf double rule with four tiny gold stars on it at the top, bottom, left and right; inside the cartouche the paper is COMPLETELY EMPTY and calm (plain midnight-blue paper: no lines, no stars, no stipple — the website writes the names there as live text). Cool soft moonlight from the upper left, a warm glint on the gold. No constellation figures, no labels, no zodiac signs, no moon, no planets, no nebula colours. No cast shadow or drop shadow, no glow or halo outside the disc. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek yuvarlak koyu harita, tam daire; gümüş-fildişi kenar bandında yalnız çentik; içinde gümüş yaylar, Samanyolu, varak yıldızlar, uydurma noktalı takımyıldızlar; ortada Ø %50 tamamen boş kartuş (altın çift çizgi + 4 küçük yıldız); figür/etiket/ay/gezegen yok; gerçek alfa.
Kullanım: açılışta armillerin kalbi (kartuşta `initials` canlı metin) → halkalar açılınca öne gelir, volvel gibi ~40° dönerek büyür, baş harfler isimlere döner → home hero (kartuşta isimler + tarih canlı metin; VT `invite-card`); yıldızlarının üstüne CSS ışıltı; home'da kaydırmayla çok yavaş döner. Kurgu bir gök haritasıdır (yukarıdaki dürüstlük notu).

#### W2.9 Kubbe penceresi — portre çerçevesi (pencere şeffaf)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/frame_dome.png` · 1024×1536 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the arched portrait frame on screen 2 of the attached design board. ONE tall picture frame shaped like the opening of an observatory dome, alone, seen perfectly straight from the front, photographed for real: a round-topped arch (a tall rectangle whose top is a full semicircle). The frame is a moulding of warm antique brass (#9B7A3C, highlights #E2C27A) with a fine beaded inner edge, surrounded by an outer band of deep midnight-blue enamel (#11193A) set with tiny gold-leaf stars; around the arch, short gilt radial ribs cross the enamel band like the ribs of a dome; at the apex a small gilt eight-pointed star finial; at the foot a slim projecting brass sill. Placement on the canvas: the whole frame spans about x 8–92% of the width and y 9–91% of the height. The WINDOW inside the frame is an arch of about 4 wide : 5 tall including its round top, from about x 17% to x 83% of the width and from about y 24% (the top of the arch) to y 82% of the height, and it is COMPLETELY TRANSPARENT (a real hole in the alpha channel: no glass, no shutters, nothing inside); the moulding closes all the way round the window without any gap. Cool soft moonlight from the upper left, one warm highlight on the brass. No crest, no flowers, no telescope. No cast shadow or drop shadow, no glow or halo outside the frame. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: kemerli (yarım daire tepeli) pencere ~4:5, tamamen şeffaf, pirinç pervaz kesintisiz kapalı; dışta yıldızlı gece mavisi mine bandı + kemer boyunca altın kaburgalar + tepede yıldız + altta denizlik; gerçek alfa.
Kullanım: home portresi (`hero_portrait`, maske = şeffaf pencere); teşekkür modunda teşekkür fotoğrafı; W2.10 kanatları bunun altında kayar.

#### W2.10 Kubbe kepengi — kapalı iki kanat (W2.9'u düzenleyerek, aynı tuval)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/dome_shutter.png` · 1024×1536 · **Şeffaf zemin**

```
The closed shutter of the dome window of the attached frame_dome.png (give frame_dome.png and design-board.png as the reference images; if your tool allows, EDIT frame_dome.png: close its window with the shutter, then remove the whole frame), alone, on the same 1024×1536 canvas, at the same scale and in exactly the same place as the window. ONE arch-shaped panel (a tall rectangle with a semicircular top), exactly the shape of the window but about 2% of the canvas larger on every side, so its edges will hide under the frame's moulding. It is made of two shutter leaves of midnight-blue lacquered wood (#11193A with soft deeper #0A0F24 tones) that meet at ONE straight vertical seam down the exact centre (x 50%), crisp and clearly visible from the top of the arch to the bottom; each leaf is engraved in fine gold leaf (#C8A24E) with thin curved meridian lines following the arch and a few tiny eight-pointed stars, with a small round brass pull knob close to the seam at about mid-height. Everything outside the panel is fully transparent. Cool soft moonlight from the upper left. No frame, no moulding, no sill, no light leaking round it. No cast shadow or drop shadow, no glow outside the panel. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: frame_dome.png'nin altına %50 saydam konunca pencereyi tamamen örtüyor, kenarları pervazın altında kalıyor (gözle kayma yok); ortada net, düz dikey dikiş; iki küçük pirinç topuz; çerçeve çizilmemiş; gerçek alfa.
Kullanım: Claude dikişten iki kanada keser; home'da portre görünür olunca kanatlar yanlara kayar (pencere maskesi içinde, pervazın altına), kanat kenarından ay ışığı sızar (CSS); teşekkür modunda da.

#### W2.11 Teleskop mercek yuvası — story çerçevesi (pencere şeffaf)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/frame_lens.png` · 1024×1024 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the round telescope frames of the story photos on screen 3 of the attached design board. ONE round brass telescope lens cell, alone, seen perfectly face-on, photographed for real: from the outside in, a knurled focusing ring of warm antique brass (#9B7A3C) with fine even knurling, a polished brass collar (highlights #E2C27A) engraved with a crisp scale of evenly spaced tick marks, and a thin dark retaining rim of deep blackened metal (#0A0F24) round the window. The whole cell is a perfect circle with an outer diameter of 88% of the image width, centred. In the exact centre a perfectly CIRCULAR window with a diameter of about 62% of the image width, COMPLETELY TRANSPARENT (a real hole in the alpha channel: no glass, no lens, no reflection, nothing inside); the rings close all the way round it. Cool soft moonlight from the upper left, one warm highlight on the brass. No numerals, no letters, no maker's name. No cast shadow or drop shadow, no glow or halo outside the cell. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tam daire; pencere Ø ~%62 tamamen şeffaf, halkalar kesintisiz; tırtıllı odak halkası + çentikli bilezik + ince koyu iç kenar; cam/yansıma/yazı yok; gerçek alfa.
Kullanım: story'deki üç an (sol–sağ–sol) ve home hikâye tanıtımı; foto "odaklanır" (CSS blur → net); fotoğrafları kaydırmayla çizilen noktalı altın takımyıldız çizgisi birleştirir (1 px UI).

#### W2.12 Atlas levhası çerçevesi — mekân (pencere şeffaf)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/frame_plate.png` · 1536×1024 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the frame around the venue photograph on screen 4 of the attached design board. ONE wide frame made like the border of an 18th-century atlas plate, alone, seen perfectly flat and straight on: a mat of heavy silver-ivory chart paper (#EEEBE3) round a landscape window, with a GRADUATED BORDER engraved round the window — a double neat-line in gold-brown ink (#7A5A1E) with, between its two lines, a band of alternating gold-leaf (#C8A24E) and ivory scale bars and fine tick marks on all four sides — a small engraved gold eight-pointed star in each of the four corners of the mat, and a slim moulded edge of warm antique brass (#9B7A3C) round the outside. Placement: the whole frame spans about x 6–94% of the width and y 8–92% of the height; the WINDOW is a landscape rectangle of about 16:9, roughly from x 16% to x 84% of the width and from y 21% to y 79% of the height, and it is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside); the mat and the border close all the way round it. Cool soft moonlight from the upper left, a warm highlight on the brass. No numerals, no letters, no compass rose, no map. No cast shadow or drop shadow, no glow or halo outside the frame. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: pencere ~16:9, tamamen şeffaf, kenarlık kesintisiz; dereceli çift çerçeve çizgisi + dönüşümlü altın/fildişi ölçek çubukları; köşelerde yıldız; ince pirinç dış kenar; rakam/harf yok; gerçek alfa.
Kullanım: details'te mekân fotoğrafı (`venue`); girişte ölçek çubuklarının üstünden CSS ışık bandı geçer, foto soldan sağa açılır.

#### W2.13 Kubbe tepeli harita kartı (3 dilim: kubbe · tekrarlanan orta · alt kapanış)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/card_dome.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the dome-topped RSVP card on screen 5 of the attached design board. ONE tall card of heavy silver-ivory chart paper (#EEEBE3), alone, seen perfectly straight from the front, with crisp die-cut edges and a hair-thin gilt edge all round. Its TOP is shaped like an observatory dome: a full semicircle exactly as wide as the card. The card spans about x 8–92% of the image width and y 6–94% of the image height (so the top of the dome is at about 6% and the base of the semicircle at about 34%). It is designed so the website can cut it into three horizontal slices and stretch the middle one. TOP band (from the top of the dome down to about 40% of the image height): just inside the arch a fine gold-leaf (#C8A24E) double rule follows the curve, with short gilt radial ribs between the two rules like the ribs of a dome, and a small gilt eight-pointed star at the apex; across the base of the dome a fine gold double rule; the rest of the dome is calm, empty paper (a heading is set there). MIDDLE band (from 40% to 84% of the image height): plain chart paper with ONLY a fine double gold rule running straight down each side, parallel to the edges, exactly the same at every height, nothing else; the left and right edges perfectly straight and vertical. BOTTOM band (from 84% down): the side rules turn the corners and close along the bottom, with a small centred engraved gold motif of three tiny stars joined by a dotted line above the bottom rule. No form fields, no photo window. Cool soft moonlight from the upper left, a warm glint on the gold. No cast shadow or drop shadow, no glow outside the card. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: üst yarım daire kubbe (kemer boyunca kaburgalı altın çift çizgi + tepe yıldızı, içi boş); orta bantta yalnız iki yandaki düz çift çizgi (yükseklik boyunca aynı, tekrarlanabilir); altta kapanış + üç yıldız; yan kenarlar dik; gerçek alfa.
Kullanım: RSVP formu, home davet bandı, details programı ve G138 blokları (travel, dress code, registry, SSS); Claude üst · orta · alt diye keser, ortayı içeriğe göre uzatır; başlık kubbenin içinde.

#### W2.14 Ayırıcı — küçük takımyıldız
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/divider_stars.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the small dividers of the attached design board. ONE delicate horizontal divider in raised, burnished gold leaf (#C8A24E, highlights #E2C27A), alone: at its exact centre a tiny invented constellation of five small six- and eight-pointed gold stars of different sizes joined by a fine dotted gold line (about 14% of the image width), and from it a hair-fine engraved gold rule running level to both sides, ending in tiny round dots; the whole divider about 72% of the image width, perfectly level in the vertical middle of the canvas. Very fine and elegant, a subtle real gold-leaf sheen. Nothing else, plenty of empty space above and below. Cool soft moonlight from the upper left. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek ince yatay çizgi + ortada beş yıldızlı küçük takımyıldız; uçlarda nokta; kenarlara değmiyor; gerçek alfa.
Kullanım: başlık altları (home, story, details, rsvp); Claude dar şerit olarak kırpar; yıldızlar sırayla ışıldar.

#### W2.15 Alet kadranı — geri sayım (boş)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/dial_face.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the small countdown dials on screen 2 of the attached design board. ONE small round instrument dial, alone, seen perfectly face-on: a perfect circle with an outer diameter of 86% of the image width, centred: a polished bezel of warm antique brass (#9B7A3C, highlights #E2C27A) with fine knurling on its outer edge, about 7% of the image width wide; inside it a silver-ivory face (#EEEBE3) engraved in gold-brown ink (#7A5A1E) with a ring of evenly spaced fine tick marks close to the bezel (every fifth tick longer) and a hair-fine gold circle just inside the ticks. The centre of the face, a circle of about 50% of the image width, is COMPLETELY EMPTY calm paper (the website sets the number and its label there). No hands, no pointer, no centre pin. Cool soft moonlight from the upper left, one warm highlight on the bezel. No numerals, no letters. No cast shadow or drop shadow, no glow outside the dial. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tam daire; tırtıllı pirinç kasa; fildişi kadranda yalnız çentik halkası + ince altın daire; orta boş; ibre/pim/rakam yok; gerçek alfa.
Kullanım: home geri sayımı — dört kadran (gün, saat, dakika, saniye); sayı ve etiket ortada canlı metin; W2.16 ibresi çentik halkasında dolaşır.

#### W2.16 Kadran ibresi
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/dial_pointer.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png and dial_face.png as the reference images: the same brass and light), the slim pointer on the rim of the countdown dials on screen 2 of the attached design board. ONE small brass instrument pointer, alone: a slim, tapering index of warm polished antique brass (#9B7A3C, highlights #E2C27A) shaped like a short lance, with a tiny gilt eight-pointed star at its tip and a small round eye at its base, standing perfectly vertical with the tip pointing straight up, centred on the canvas, about 46% of the image height tall and 9% of the image width wide. Seen perfectly flat and straight on. Cool soft moonlight from the upper left. No dial, no other objects. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek ince pirinç ibre, dik, ucu yukarı, uçta küçük yıldız; kadran yok; gerçek alfa.
Kullanım: her kadranın çentik halkasında, kadran merkezi etrafında döner (saniye kadranında her saniye bir çentik, ötekilerde orantılı); Claude ölçekler ve döndürür.

#### W2.17–W2.22 Program ikonları — altı ayrı dosya (gravür vinyetleri)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/icon_toast.png`, `icon_rings.png`, `icon_dinner.png`, `icon_moon.png`, `icon_bowtie.png`, `icon_compass.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the small programme icons on screen 4 of the attached design board. ONE small engraved icon in the manner of an 18th-century copperplate vignette, alone: crisp gold-brown (#7A5A1E) engraved outlines of one even, fairly bold weight (about 2.5% of the image width), only a little fine hatching for volume, and a few small touches of raised burnished gold leaf (#C8A24E) — simple and clearly readable when shown at 32–40 px, filling about 60% of the square, centred, perfectly straight. No paper behind it, no circle, frame or badge around it, no background shape. All six icons of this set share exactly the same line weight, ink colour, gold touches and style. Cool soft light from the upper left on the gold. No cast shadow, no glow. No text, letters, numbers or monogram. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make six separate images:
icon_toast = two champagne coupes touching at the rim, with a tiny eight-pointed star where they touch
icon_rings = two interlocked wedding rings drawn like two slim armillary rings crossing each other, each with a fine engraved line of ticks
icon_dinner = a round dinner plate seen from the front with a knife and a fork beside it
icon_moon = a slim crescent moon (no face) with two tiny eight-pointed stars beside it
icon_bowtie = a classic bow tie
icon_compass = a small round brass pocket compass seen from above (its own round case is the icon, no extra circle around it), a needle shaped like a slim lance with a tiny star at its tip, a fine ring of ticks, and NO letters for the directions
```
Kontrol: altı dosya, her birinde tek ikon; hepsi aynı çizgi kalınlığı ve stilde; 40 px'te okunuyor; rozet/daire zemin yok; pusulada N/S/E/W harfi yok; ayda yüz yok; gerçek alfa (Claude alfayı maske olarak kullanıp mürekkep rengini değiştirebilir: koyu zeminde altın).
Kullanım: details programı (welcome drinks / cocktails = toast, ceremony = rings, dinner & dancing = dinner, late-night / after-party = moon), dress code = bowtie, "View map" ve travel = compass; satırların yıldızı sırayla yanar.

#### W2.23–W2.25 Süzülen vurgular — üç ayrı dosya (yıldız, parıltı, kuyruklu yıldız)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/accent_star.png`, `accent_twinkle.png`, `accent_comet.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Celestial Observatory" wedding website (give design-board.png as the style reference), matching the small stars and the comet of the attached design board. ONE single small object, alone, centred, not cropped, generous empty margin all round, photographed for real like cut metal leaf. Cool soft moonlight from the upper left with a warm glint. Nothing else: no other objects, no dust, no sparkle, no glow, halo or rays around it. No cast shadow or drop shadow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make three separate images:
accent_star = one eight-pointed star cut from real raised gold leaf (#C8A24E, highlights #E2C27A), finely engraved facets along its rays, filling about 45% of the square
accent_twinkle = one tiny four-pointed star of bright silver-white metal leaf (#E6E9F1), its four long slender rays each with a hair-fine engraved centre line, filling about 35% of the square, crisp points with NO glow around it
accent_comet = one comet engraved in gold leaf in the manner of an 18th-century print: a small round gilt head with a tiny eight-pointed star at its centre at the lower left, and a long, gently widening tail of fine parallel engraved gold lines streaming away to the upper right on a straight diagonal, from about 12% to 88% of the image width; the spaces between the tail lines truly transparent
```
Kontrol: üç dosya, her birinde tek nesne ve birbirinden farklı; hâle/ışıma/ışın yok; kuyruk çizgilerinin arası şeffaf; kenara değmiyor; gerçek alfa.
Kullanım: açılışta yanan yıldızlar (accent_star, accent_twinkle; Claude ölçekler, döndürür, gümüş/altın ışık verir); açılışın sonunda ve RSVP gönderilince gökten bir kez geçen kuyruklu yıldız (accent_comet, `offset-path`); story'de 2–3 parıltı; RSVP'de yükselip sönen yıldız tozu.

### Instructions for GPT — iş sırası ve teslim (PAKET 8)

```
Work only on PAKET 8 of collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md in the repository muzaffergrl/davetiye-maker (branch main). Ignore every other section of that file: PAKET 2, 3, 6R and 7 are done or cancelled, PAKET 5R is the old look that this package replaces, and the note at the top of the file (night_paper / env_back / astro_plate as style references) does NOT apply to PAKET 8. Do NOT attach any existing image from collections/29_Celestial_Observatory/assets/gpt/parts/ (night_paper, chart_paper, env_*, flap*, astro_*, card_small, *_frame, planisphere_*, corner_ornament, divider, telescope, accent_1..3, web_hero: the old look), nothing from collections/29_Celestial_Observatory/assets/gpt/print/ or mockups/ other than the new design-board.png, nothing from platform/themes/celestial-observatory/, and no design board of another design.

1. ONE chat, in this order. Send the "Instructions for GPT (send before the first image)" message of PAKET 8 first. Then W1, the design board: attach collections/29_Celestial_Observatory/assets/gpt/photos/hero_portrait.jpg, story_1.jpg and venue.jpg as the identity reference of the couple and the venue only. The board is the design; if it misses its Kontrol line or looks ordinary, make it again before going on (at most 3 tries). Commit and push the board as soon as it is chosen.
2. Then W2, one image per prompt, in the order W2.1 to W2.25, in the same chat. Give the finished design-board.png as the reference image of EVERY W2 image. Also give the extra references named in each prompt: sky_plate.png for W2.2; arm_stand.png for W2.5, W2.6 and W2.7; frame_dome.png for W2.10 (EDIT it if your tool allows: close the window with the shutter, then remove the frame; otherwise attach it and keep the panel on the same pixels as the window); dial_face.png for W2.16. For the icons (W2.17–W2.22) also give the finished icon_toast.png as the style reference of the other five.
3. Use each English prompt exactly as written. One object per image. No text, letters, numbers, monograms, logos or watermarks in any W2 image (sample text is allowed on W1 only). In the two multi-image prompts (the six icons, the three accents) each listed line is its own image and its own file.
4. Keep each image in the ratio of its Kaydet size: 1:1, 2:3 or 3:2 (W1 about 2.3:1). The pixel size may differ. Do not resize, crop, repaint or recolour any pixel with code — Claude crops thin bands, cuts the shutter at its seam, scales the rings to nest and rotates them.
5. The armillary rings (W2.4 to W2.7) and the round parts (W2.8, W2.11, W2.15) are PERFECT CIRCLES seen face-on, never ellipses or tilted: the website turns them in 3D itself. The inside of the meridian ring (W2.4) and the photo windows (W2.9, W2.11, W2.12) are TRANSPARENT openings; a ring or frame that closes all the way round them matters more than the opening itself. Never fill them with green, white, glass or a picture.
6. Counts (ticks, stars, knurls, ribs, constellations, scale bars) do not matter; never regenerate for a count. Regenerate only for: a wrong object, text present (including numerals on a scale or letters on the compass), a zodiac sign or a constellation figure, a ring drawn as an ellipse or in perspective, a cast/drop shadow or a glow outside the object, a fake background (white or checkerboard) instead of real alpha, an object touching the canvas edge, a photo window that is not transparent or not closed, a wrong ratio, a "repeatable middle" (W2.13) that is clearly not uniform, or a shutter (W2.10) that plainly does not cover the window of W2.9. At most 2 attempts per part; then keep the best one, note the defect and move on.
7. Delivery: commit every PNG to the repository at exactly the path on its Kaydet line, with exactly that file name (the parts in collections/29_Celestial_Observatory/assets/gpt/parts/, the board at collections/29_Celestial_Observatory/assets/gpt/mockups/design-board.png). No zip, no Downloads folder, no other folder (not docs/qa, not platform/), no new folder, no download names, no "_final", "_v2" or "(1)" suffixes; rejected tries are not committed. Save as PNG. Push to branch main; only if you cannot push to main, push a branch named codex/g29-paket8 and say so on the first line of TESLIM.txt. Run git pull --rebase origin main before each push. Push after W1, then after W2.4, W2.8, W2.13, W2.16, W2.22 and W2.25 ("29 PAKET 8: W1", "29 PAKET 8: W2 1/6", …) so nothing is lost if the chat breaks; the last commit is "29 PAKET 8: teslim". Touch no other file, write no code, do not run gpt_yerlestir.py or build_images.py.
8. Finally write collections/29_Celestial_Observatory/assets/gpt/parts/TESLIM.txt in Turkish: branch and last commit; how many files were delivered (expected: the board + 25 parts); for every file the target size and the actual size, RGBA or RGB (real alpha channel or not), the number of attempts and every difference from its Kontrol line (be specific); for the rings and round parts whether they are true circles (alpha box width vs height); the alignment result of dome_shutter against frame_dome (covers the window yes/no, roughly how much shift); anything skipped and why; which reference images were attached; and one line confirming that no pixels were changed by code. If you cannot write to the repository at all, stop and say so clearly in the chat; do not hand the upload to the user.
```
