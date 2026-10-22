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
