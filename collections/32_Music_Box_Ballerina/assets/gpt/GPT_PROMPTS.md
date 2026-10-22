# GPT görsel istekleri — Tasarım 32 · Music Box Ballerina (yeniden tasarım, 2026-10-22)

> **Instructions for GPT:** This design was completely REDESIGNED on 2026-10-22. Generate PAKET 5R (website layers) first,
> in order and in ONE chat, then PAKET 6R (printable invitation). **PAKET 2 sample photos already exist — do not
> regenerate them.** Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as written, follow its
> checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers,
> names, dates, initials, monograms, crests, musical notation, logos, brand marks, QR codes or watermarks in any image**
> (also not on the keyhole plate, the key, the figurine's base, the card or the mirrors). The ballerina is a small
> porcelain-and-tulle music-box figurine with a serene, softly suggested porcelain face (eyes gently closed) — not a
> photograph of a real dancer, not a doll or toy brand, not a cartoon. The music box look is an original design: it must
> not copy any real music box, jewellery box, brand or seller's design. Give W1 `page_ground.png`, W2 `card_paper.png` and
> W3 `env_back.png` as the style reference of every later part: the same blush silk satin, the same cream cotton card,
> the same rose-quartz silk satin envelope with its quilted blush lining, the same soft gold filigree, the same soft
> daylight from the top-left. Parts drawn on the same envelope canvas (W3, W4, W5, W7) keep the envelope in exactly the
> same box.

Bu dosya tasarım 32'nin **bütün görsel parçalarının** tek kaynağıdır (yeniden tasarım: `docs/35_22_32_YENIDEN_TASARIM.md`
§3–§4; brief `../../DESIGN_BRIEF.md`). Durum **concept**: bugünkü tema (`platform/themes/music-box-ballerina/`) Codex
`envelope-v3` sürümüdür ve PAKET 5R gelince 39 pilotunun yapısıyla **baştan kurulacak** (G432); geçici görsel yok.
Gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar (isimler, tarih, baş harfler, mekân) HTML'dir,
hiçbir görsele pişirilmez. Eski PAKET 5 ve PAKET 6 bölümleri kaldırıldı (git geçmişinde).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/32_Music_Box_Ballerina/assets/gpt/` altındaki `parts/`
  (PAKET 5R) ve `print/` (PAKET 6R). `photos/` (PAKET 2) dolu, dokunma. Repoya yazamıyorsan dur ve bunu çıktında açıkça
  söyle; kullanıcıya yükleme işi verme.
- Sonra (Claude, G432): `python3 tools/kit_check.py collections/32_Music_Box_Ballerina --paket 5` (oran, gerçek alfa,
  kenar payı, foto penceresi) + göz kontrolü; tema 39 pilotunun yapısıyla kurulunca `python3
  platform/themes/music-box-ballerina/build_images.py` ve `python3 tools/gpt_kuru_deneme.py --tema music-box-ballerina
  --sekil collections/32_Music_Box_Ballerina/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic luxury product photography** — real rose-quartz silk satin wrapped over stiff board (crisp
  folded edges, a soft liquid sheen), real quilted blush satin with tiny pearl buttons, real warm soft-gold filigree
  (fine pierced scrollwork, gently worn gilding), real polished brass, real glazed porcelain, real silk tulle, real
  bevelled mirror glass, real garden roses. An antique vanity-table music box: classic, romantic, rich and calm. Not
  cartoon, not flat vector, not childish, not a toy, not glitter-heavy.
- Renkler (yalnız bunlar): rose quartz `#EECDD0` · blush `#F7E4E2` · cream `#FFF8F4` · rose gold `#B76E79` · deep rose
  `#8A4A55` · soft gold `#C9A45C` · ink `#4A2F35`. Yeşil yalnız güllerin az sayıdaki adaçayı yeşili yaprağında (pencere
  yeşiliyle karışmayacak kadar soluk, `#9DAA94` civarı); başka renk yok.
- Işık: yumuşak **gün ışığı sol üstten**, satende akan parlaklık, varakta ılık parıltı, aynada yumuşak pembe ışık;
  bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil), her kenarda en az %6 boşluk,
  nesnenin dışında gölge/hâle yok (gölgeyi site ekler).
- Foto penceresi (düz `#00FF00`) yalnız W6 `flap_in` (oval ayna), W12 `portrait_frame`, W13 `mirror_frame` ve W14
  `venue_frame`'de; diğer parçalarda yeşil alan yok.
- **23 Velvet Jewel Box'tan ayrı:** kadife yok, kurdele/fiyonk yok, yüzük yok. **44 Blue Toile'dan ayrı:** toile yok,
  kamea broş yok; kapak bir serpantin (bombe) müzik kutusu kapağıdır, kapanış anahtar deliği plakası + kurma anahtarıdır.
  **03 Blush Garden Rose'dan ayrı:** mum mühür yok, V kapak yok; gül yalnız ölçülü köşe süsünde. Nota, nota anahtarı,
  porte (müzik yazısı) hiçbir görselde yok.

## Zarf geometrisi (W3–W5, W7 aynı tuvalde; W6, W8–W10 kendi tuvallerinde)
Zarf tuvali **1500×1200** (yatay). Zarf kutusu **x %7–93, y %7–93** (1290×1032 px, zarf ≈1,25:1). Dört katman **aynı
tuvalde, aynı kutuda** çizilir: W3 arka, W4 ön cep, W5 kapak, W7 anahtar deliği plakası; Claude her birini kendi alfa
kutusuna kırpar ve arka katmanın kutusuna göre yerleştirir. Tuval yüzdeleri:
- **Ön cep (W4):** tam genişlik x %7–93; üst kenarı yumuşak bir yay — yanlarda **y %40**, ortada **y %47**'ye iner;
  zarfın alt kenarına (**y %93**) kadar. Alt iki köşede minik varaklı telkâri köşe süsü (her biri zarf eninin ~%5'i).
- **Bombe kapak (W5):** üst katlama çizgisi **y %7**, tam genişlik. Serbest kenarı serpantin bir müzik kutusu kapağı
  çizgisi: yan kenarlara **y %44**'te değer → **x %22 ve %78**'de hafifçe yukarı, **y %41**'e kıvrılan yumuşak içbükey
  omuzlar → ortada öne şişen geniş, dolgun dışbükey bir eğriyle **(x %50, y %66)**'da geniş yuvarlak en alt nokta (V değil,
  sivri değil, tarak değil). Kenar boyunca ince altın telkâri bordür (~tuval yüksekliğinin %1,2'si). Kapak cebin üst
  kenarını her yerde örter.
- **Anahtar deliği plakası (W7):** kapağın ucundan sarkan telkâri bir kilit plakası; kutu **x %44–56, y %54–72**, üstü
  kapakta, alt kısmı cebin üstüne biner. Anahtar deliğinin yuvarlak kısmının merkezi **(x %50, y %62)**.
- **Kurma anahtarı (W8, ayrı 800×800 tuval):** önden görülür, düz süslü tutamağı izleyiciye bakar; **dönme ekseni (yuvarlak
  boyun) tam tuval merkezinde (400, 400)**; tutamak yatayda tuvalin %10–90'ı, düşeyde ~%28–72'si. Sitede boyun merkezi
  W7'nin anahtar deliği merkezine (%50, %62) oturur; tutamak eni ≈ zarf eninin %17'si.
- **Kapağın iç yüzü (W6, ayrı 1500×900 tuval):** W5'in çizgisi dikey aynalanmış: düz katlama kenarı **altta y %93**, x %7–93;
  yanlar **y %44**'e çıkar, omuzlar (x %22/%78) **y %48**, en üst nokta ortada **(x %50, y %14)**. İçi ayna gibi rose gold
  saten, ortada eğimli oval ayna = foto penceresi (kutu x 560–940 px, y 230–700 px).
- **Balerin (W9 ön, W10 arka; ayrı 800×1200 tuval, iki dosyada birebir aynı siluet kutusu):** figür + kaide **x %22–78,
  y %6–94**, kaide merkezi x %50. Sitede cebin arkasından yükselir, boyu ≈ zarf yüksekliğinin %45'i.
- Kat sırası (alttan üste): W3 arka → kart (W11) → balerin (W9/W10) → W4 cep → W5 kapak → W7 plaka → W8 anahtar.

Açılış (≤ 5,5 s): dokununca anahtar **iki tur** döner (tık sesi; W8'in tuval merkezinde döndürülmesi) → kapak üst katlama
çizgisinde 3B kalkar; 90°'den sonra iç yüz W6 görünür ve oval aynada çiftin portresi belirir (plaka ve anahtar kapakla
birlikte kalkar) → porselen balerin cepten yükselir ve iki piruet atar (W9 ↔ W10, scaleX ile) → krem kart (W11) cebin
arkasından yükselir, cep dudağını geçince öne gelir → gül yaprağı, inci ve tül parçası (W17) süzülür → home.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Pudra ipek saten (sayfa zemini, kapak sayfası)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/page_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of a very pale blush silk satin (#F7E4E2), like the lining of an antique vanity drawer: a fine smooth weave with a soft, even, liquid sheen that drifts only very gently across the surface, very low contrast so dark rose text reads on it everywhere. Perfectly flat and evenly lit by soft daylight from the top-left: no folds, no wrinkles, no ripples, no pattern, no quilting, no stains, no shadow, no vignette, no flowers. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: çok açık pudra saten, sakin; dikişsiz (2×2 yan yana ek yeri yok); kırışık/desen/kapitone yok; her yerde yazı okunur.
Kullanım: tema kurulunca kapak sayfası (kapalı zarf) ve bütün sayfaların zemini.

#### W2 Krem pamuk kart kâğıdı (kartlar, bantlar, form)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/card_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of thick mould-made cotton card in a warm cream (#FFF8F4) with the faintest blush undertone: a gentle soft tooth, a few faint cotton fibres, an even tone with only the gentlest natural cloudiness. Evenly lit by soft daylight from the top-left, no fold, no crease, no deckle edge, no stain, no shadow, no vignette, no printing, no pattern, no gold. Calm enough for fine dark rose ink text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; krem `#FFF8F4` civarı; leke/kat/desen yok; üstüne koyu yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, program ve RSVP formunun kâğıdı.

#### W3 Zarfın arkası (kapitone pudra saten astar görünür)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/env_back.png` · 1500×1200 · **Şeffaf zemin**

```
The back panel of an open horizontal envelope made of rose-quartz silk satin (#EECDD0) wrapped over stiff board, seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas (a 1.25:1 rectangle with very slightly softened corners and crisp folded satin edges). We see its inside: it is lined with tufted, quilted pale blush satin (#F7E4E2) like the interior of an antique music box — soft rounded diamond quilting with a tiny cream pearl button at each crossing, a gentle sheen on every puff where the light from the top-left catches it — the quilting covers the panel almost completely, with a slim margin of rose-quartz satin and a hair-fine soft-gold piping (#C9A45C) along the top and both sides; a very gentle shade toward the bottom where the front pocket will sit. No flap, no front pocket, no keyhole plate, no key, no card, no figurine inside. Soft daylight from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay panel x %7–93 · y %7–93; iç yüz kapitone pudra saten + minik inci düğmeler, kenarlarda ince gül kuvarsı pay ve altın biye; kapak/cep/plaka yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — kapak açılınca kartın ve balerinin arkasında görünen müzik kutusu içi.

#### W4 Zarfın ön cebi
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/env_front.png` · 1500×1200 · **Şeffaf zemin**

```
Only the front pocket of the same horizontal rose-quartz satin envelope as env_back.png, on the same 1500×1200 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the pocket spans the full envelope width (x 7–93%) from its top edge down to the envelope's bottom edge at 93% of the canvas height. Its top edge is one soft, smooth arc: it starts at 40% of the canvas height at both side edges and dips gently to 47% at the horizontal centre, cut clean, the satin neatly folded over a stiff board so the edge has a soft rounded thickness. Rose-quartz silk satin (#EECDD0) with a soft liquid sheen flowing from the top-left, the faint folded seams of the two side flaps barely visible, and at each of the two bottom corners a tiny soft-gold filigree corner mount (pierced scrollwork, each about 5% of the envelope's width), like the little gilt corners of an antique music box. Everything above the pocket's edge is completely transparent. No flap, no keyhole plate, no key, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep tam genişlik; üst kenarı yanlarda %40, ortada %47'ye inen yumuşak yay; alt köşelerde minik telkâri köşe süsü; üstü tamamen şeffaf; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart ve balerin bunun arkasından yükselir; kapak açıkken yay kenarı görünür.

#### W5 Bombe müzik kutusu kapağı (kapalı, dış yüz)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/flap.png` · 1500×1200 · **Şeffaf zemin**

```
Only the closed flap of the same horizontal rose-quartz satin envelope, on the same 1500×1200 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the flap spans its full width (x 7–93%), hinged along a softly rounded fold at the envelope's top edge (7% of the canvas height). Its free lower edge is the serpentine outline of an antique music-box lid: it meets the two side edges at 44% of the canvas height, rises gently into two soft concave shoulders that reach 41% of the canvas height at 22% and 78% of the width, and then swells forward in one full, generous convex curve to a broad, softly rounded lowest point at the horizontal centre, at 66% of the canvas height (not a V, not a sharp point, not scalloped, not straight). A fine soft-gold filigree border (#C9A45C, delicate pierced scrollwork about 1.2% of the canvas height wide, gently worn gilding) follows the whole free edge. Rose-quartz silk satin (#EECDD0) stretched smooth over the flap with a soft liquid sheen from the top-left and a whisper of contact shade on the flap itself just along its curved edge. Everything below the flap's edge is completely transparent. No keyhole plate, no key, no seal, no ribbon, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kapak tam genişlik; kenar yanlarda %44, omuzlar (%22/%78) %41, ortada %66'da geniş yuvarlak uç (V/sivri/tarak değil); kenar boyunca ince altın telkâri; plaka/anahtar yok; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapalı kapak; açılışta üst katlama çizgisinde 3B kalkar, 90°'den sonra W6 devralır. Cebin üst kenarını her yerde örttüğü doğrulanır (W4 yanlarda %40 < %44, ortada %47 < %66).

#### W6 Kapağın iç yüzü — ayna saten + oval ayna (açıkken dik)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/flap_in.png` · 1500×900 · **Şeffaf zemin**

```
The inside of the same serpentine music-box flap, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background: the outline of flap.png mirrored vertically. Its straight fold edge is at the BOTTOM, along 93% of the image height, spanning x 7–93% of the width (exactly as wide as the envelope); its two straight sides rise to 44% of the image height, the two soft shoulders at 22% and 78% of the width sit at 48%, and its serpentine edge swells UP in one full curve to a broad, softly rounded highest point at the horizontal centre, at 14% of the image height. The same fine soft-gold filigree border follows the whole curved edge. The inside is lined with smooth rose-gold silk satin (#B76E79) stretched taut, with a soft mirror-like sheen from the top-left, and in its centre is set an upright oval bevelled mirror whose glass area is the photo window: an oval exactly 380 px wide and 470 px tall, its bounding box from x 560 px to x 940 px and from y 230 px to y 700 px, filled with flat pure green #00FF00 (no texture, no shading, no reflection, smooth clean oval edge, nothing over it), surrounded by a slim soft-gold beaded bezel about 18 px wide that stays entirely outside the green oval. Soft daylight from the top-left. No key, no keyhole plate, no ribbon, no figurine. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz katlama kenarı altta (%93), yanlar %44'e, omuzlar %48, tepe ortada %14; rose gold ayna saten; ortada düz `#00FF00` oval, ~380×470, kutu (560–940, 230–700); ince altın boncuklu bezel pencereye binmiyor; gerçek alfa.
Kullanım: tema kurulunca yeşil oval ölçülür ve şeffaf yapılır → kapak dikilirken aynada çiftin portresi (`hero_portrait`) görünür (3B dönüşün arka yüzü). Düz renkle doldurulmaz; iç yüz her zaman bu parçadır.

#### W7 Telkâri anahtar deliği plakası (kapağın ucunda)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/escutcheon.png` · 1500×1200 · **Şeffaf zemin**

```
On the same 1500×1200 canvas as env_back.png and flap.png, in exactly the same place (the envelope box is x 7–93% and y 7–93% of the canvas, but the envelope itself is NOT drawn here), only a small ornate keyhole escutcheon plate, on a fully transparent background: an upright rococo cartouche-shaped plate of soft-gold filigree (#C9A45C, fine pierced scrollwork with tiny leaf curls, gently worn gilding, a slightly domed solid centre) spanning exactly x 44–56% and y 54–72% of the canvas, symmetrical about the vertical centre line, hanging like a little clasp from the tip of a music-box lid. In its solid centre a classic keyhole: a small round opening whose centre is at exactly x 50%, y 62% of the canvas, with a short tapered slot below it, the opening dark deep rose-brown (#4A2F35). Soft daylight from the top-left, warm highlights on the gilding. No key, no lock body, no letters, no crest, no screws other than two tiny gilt pins at the top. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek simetrik telkâri plaka x %44–56 · y %54–72; anahtar deliği merkezi (%50, %62); anahtar yok, harf/arma yok; zarf çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca aynı zarf tuvalinde katman; kapakla birlikte kalkar. Anahtar (W8) boynu deliğin merkezine oturur.

#### W8 Pirinç kurma anahtarı (önden, dönme ekseni merkezde)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/key.png` · 800×800 · **Şeffaf zemin**

```
A single antique music-box winding key, seen exactly from the front as it sits in a keyhole facing the viewer, alone, on a fully transparent background: a small round polished brass collar exactly at the centre of the canvas (its centre at 400, 400 px), and attached to it a flat, ornate openwork key bow facing the viewer — two graceful heart-shaped scrolled lobes of pierced soft-gold brass (#C9A45C with warm highlights), extending equally to the left and to the right of the collar, perfectly mirror-symmetrical, spanning about x 10–90% of the canvas width and about y 28–72% of its height, with a few tiny leaf curls and one small cream pearl set at the centre of the collar. The shaft is hidden behind the collar (it points straight away from the viewer into the keyhole). Soft daylight from the top-left, crisp warm reflections. No keyhole plate, no ribbon, no tassel, no chain. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: boyun tam tuval merkezinde (400, 400); iki loblu tutamak sağa-sola eşit ve ayna simetrik (x ~%10–90); plaka/kurdele yok; gerçek alfa.
Kullanım: tema kurulunca kırpılmadan (merkez korunarak) ölçeklenir → W7 anahtar deliğinin üstünde; açılışta tuval merkezi etrafında iki tur döner, sonra kapakla birlikte kalkar. RSVP gönderilince bir tur.

#### W9 Porselen balerin — önden
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/ballerina_front.png` · 800×1200 · **Şeffaf zemin**

```
A small antique porcelain music-box ballerina figurine, seen exactly from the front, standing upright and centred, alone, on a fully transparent background, photorealistic: glazed cream porcelain (#FFF8F4) skin and bodice with a soft pearly lustre, a serene, softly suggested porcelain face with eyes gently closed and hair in a smooth low bun, poised en pointe with both legs together (feet crossed tightly in sous-sus), both arms raised above her head in a rounded, perfectly symmetrical fifth position, wearing a classical short tutu of layered real blush silk tulle (#F7E4E2 to #EECDD0) standing out evenly on both sides, a hint of soft-gold edging on the bodice, standing on a small round soft-gold filigree pedestal base. The whole figure and base are perfectly mirror-symmetrical about the vertical centre line and span exactly x 22–78% and y 6–94% of the canvas, the base centred at x 50% at the bottom. Soft daylight from the top-left. Elegant and refined, not a doll, not a toy, not a cartoon, not a real person. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek figür, önden, ayna simetrik (kollar yuvarlak 5. pozisyonda, ayaklar bitişik); siluet + kaide x %22–78 · y %6–94; porselen yüz yumuşak, gözler kapalı; oyuncak/gerçek kişi değil; gerçek alfa.
Kullanım: tema kurulunca açılışta cebin arkasından yükselir; W10 ile scaleX takasıyla piruet (iki tur); home imzasında, story aralarında (çeyrek dönüş) ve RSVP gönderiminde.

#### W10 Porselen balerin — arkadan (W9 ile aynı siluet)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/ballerina_back.png` · 800×1200 · **Şeffaf zemin**

```
The same porcelain music-box ballerina figurine as ballerina_front.png, on the same 800×1200 canvas and in exactly the same place and size, now seen exactly from BEHIND, on a fully transparent background: the same pose (en pointe, legs together, both arms raised in the same rounded symmetrical fifth position), the same layered blush silk tulle tutu, the back of the cream porcelain bodice with fine soft-gold edging and a tiny laced back, the smooth low bun of her hair with two tiny pearl pins, the same small round soft-gold filigree pedestal. Its outline must match ballerina_front.png as closely as possible: the figure and base span exactly x 22–78% and y 6–94% of the canvas, mirror-symmetrical, base centred at x 50%. Soft daylight from the top-left. No face visible. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: W9 ile aynı tuval, aynı kutu, aynı poz; arkadan (topuz + inci tokalar, sırt); siluetler üst üste konunca kenarları çakışıyor; gerçek alfa.
Kullanım: tema kurulunca W9'la scaleX (1 → 0 → −1) takasında arka yüz; piruetin yarım turları.

#### W11 Zarftaki kart (boş)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/card_small.png` · 1000×1300 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen straight on, on a fully transparent background: the thick cream cotton card of card_paper.png (#FFF8F4) with softly rounded corners, spanning x 7–93% and y 6–94% of the canvas, a fine soft-gold foil border line (#C9A45C, a crisp warm metallic shine) inset about 5% from the card's edge and a second hair-fine rose-gold line (#B76E79) just inside it; at the top centre, inside the border, one small delicate soft-gold filigree flourish (symmetrical scrolls around a tiny blush rosebud), no wider than 26% of the card and no lower than 13% of the card's height. Below it the whole card inside the border is EMPTY paper (the website sets the names, date and venue there in HTML). Soft daylight from the top-left, a hair-fine contact shade on the card's own edge only. No photo, no other ornament. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: boş krem kart, yuvarlak köşe, ince altın + rose gold çift bordür; üst ortada küçük telkâri + gonca (%13'ün üstünde); altı tamamen boş; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → zarftan yükselen kart ve home kartı (isimler, tarih, mekân HTML).

#### W12 Varaklı oval ayna — home portresi
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/portrait_frame.png` · 1000×1300 · **Şeffaf zemin**

```
An ornate antique gilded oval vanity mirror frame, alone, seen straight on, on a fully transparent background: a carved and gilded frame in soft gold (#C9A45C, warm highlights, gently worn gilding with a hint of rose-gold in the recesses) with a fine inner bead of tiny cream pearls, crowned at the top by a symmetrical crest of filigree scrolls and leaf curls holding a small cluster of three blush garden roses (#EECDD0, deep rose shade #8A4A55 in their hearts) with two pale sage leaves. The frame spans about x 8–92% and y 6–94% of the canvas. The glass area is the photo window: an upright oval exactly 640 px wide and 820 px tall, its bounding box from x 180 px to x 820 px and from y 330 px to y 1150 px, filled with flat pure green #00FF00 (no texture, no shading, no reflection, smooth clean oval edge, nothing over it); the crest sits entirely above y 330 px except where the frame meets it. Soft daylight from the top-left. No ribbon, no bow, no glass reflection over the window. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz `#00FF00` oval, ~640×820, kutu (180–820, 330–1150); varaklı çerçeve + inci boncuk; tepede telkâri + üç gül; fiyonk/kurdele yok; pencereye bir şey binmiyor; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → home kartının portresi ("kapağın aynasında"); teşekkür modunda teşekkür fotoğrafı.

#### W13 İnci boncuklu oval ayna — story çerçevesi
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/mirror_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A slender antique oval hand-mirror-style frame without a handle, alone, seen straight on, on a fully transparent background: a narrow frame of soft-gold filigree (#C9A45C, fine pierced scrollwork, gently worn gilding) with an outer row of tiny cream pearls and a fine inner bevel, small symmetrical leaf curls at the top and bottom only. The frame's outer edge spans about x 6–94% and y 6–94% of the canvas. The glass area is the photo window: an upright oval exactly 760 px wide and 950 px tall, its bounding box from x 120 px to x 880 px and from y 150 px to y 1100 px, filled with flat pure green #00FF00 (no texture, no shading, no reflection, smooth clean oval edge, nothing over it). Lighter and simpler than an ornate crested mirror: no roses, no crest. Soft daylight from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz `#00FF00` oval, ~760×950 (4:5), kutu (120–880, 150–1100); ince telkâri + inci dizisi; gül/arma yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → story'nin üç anı (sol–sağ–sol) ve home hikâye tanıtımı; foto aynada buğu çözülür gibi (bulanık → net + üstünden ışık parıltısı) belirir.

#### W14 Geniş varaklı ayna (mekân fotoğrafı)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/venue_frame.png` · 1600×1000 · **Şeffaf zemin**

```
A wide antique gilded overmantel mirror frame, alone, seen straight on, on a fully transparent background: a carved and gilded rectangular frame in soft gold (#C9A45C, gently worn gilding, a hint of rose-gold in the recesses) with a fine inner bead of tiny cream pearls, delicate symmetrical filigree scrolls at the four corners and a small filigree flourish at the top centre. The frame spans about x 6–94% and y 6–94% of the canvas. The glass area is the photo window: a landscape rectangle exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 117 px, filled with flat pure green #00FF00 (no texture, no shading, no reflection, straight edges, nothing over it). Soft daylight from the top-left. No roses, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz `#00FF00` dikdörtgen, ~1360×765 (16:9), sol üst ~(120, 117); varaklı çerçeve + inci boncuk + köşe telkârileri; pencereye bir şey binmiyor; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafı.

#### W15 Köşe süsü (ölçülü: iki bahçe gülü + tül + telkâri)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/corner_spray.png` · 1200×1000 · **Şeffaf zemin**

```
A restrained, romantic corner spray growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: two blush garden roses (#EECDD0, many soft layered petals, deep rose shade #8A4A55 in their hearts), one cream rosebud, four or five pale sage-green leaves (#9DAA94), a soft wisp of blush silk tulle drifting out of the spray, and one fine soft-gold filigree scroll curling along it. Airy and light, not a heavy bouquet. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right half of the canvas is completely empty. Soft daylight from the top-left. No vase, no ribbon bow, no glitter, no other flower or colour. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sol üstten çıkan hafif küme (2 gül, 1 gonca, az yaprak, tül, telkâri); sağ alt yarı boş; fiyonk yok; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşeleri (sağda aynalanır), kapak sayfasında en fazla bir köşe (metnin altında değil), imza ve RSVP kapanışında küçük.

#### W16 Telkâri ayırıcı (bölüm ayırıcı)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider of fine soft-gold filigree, alone, on a fully transparent background: a delicate symmetrical line of pierced gilded scrollwork and tiny leaf curls (#C9A45C, warm highlights) running horizontally across x 10–90% of the canvas at the vertical centre, thinning toward both ends, with one small lustrous cream pearl (#FFF8F4) set at its exact centre between two tiny mirrored scrolls. Elegant and fine. No flowers, no ribbon, no beads of other colours. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay simetrik telkâri çizgi, ortada tek inci; uçlarda boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet ve gün, details program, RSVP formu).

#### W17 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, soft daylight from the top-left. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files, the same light and scale: 1 = one single loose blush garden-rose petal (#EECDD0), soft and gently cupped, a deeper rose shade in its fold; 2 = one small round lustrous cream pearl (#FFF8F4) with a soft pink overtone highlight; 3 = one small soft wisp of blush silk tulle (#F7E4E2), gathered and drifting, with a few hair-fine soft-gold threads woven in.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (gül yaprağı, inci, tül parçası); kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışta, RSVP gönderiminde ve sayfa geçişlerinde süzülen küçük nesneler (her biri ayrı katman, kendi fazında).

#### W18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic luxury product photography, soft daylight from the top-left: the closed horizontal rose-quartz satin envelope of flap.png with its serpentine music-box flap and fine gold filigree edge, the filigree keyhole plate of escutcheon.png at the flap's tip with the brass winding key of key.png in it, lying slightly below the centre on pale blush silk satin (as page_ground.png); at the right the porcelain ballerina figurine of ballerina_front.png standing on her gilt pedestal; at the left a small airy spray of blush garden roses with a wisp of tulle (as corner_spray.png); a few loose rose petals and three small cream pearls scattered; behind, softly out of focus, the oval of a gilded vanity mirror reflecting only soft pink light. Only rose quartz, blush, cream, rose gold and soft gold tones. The top 20% of the image is calm and soft (only out-of-focus satin and mirror light). This image is cropped to 1200×630 for link previews: keep the whole envelope, key and figurine visible with at least 5% empty margin below them. No people. No text, letters, numbers, monograms, musical notation, logos or watermarks.
```
Kontrol: zarf + plaka + anahtar + balerin bütün, altında ≥%5 boşluk; üst %20 sakin; yazı/nota yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım: üstten ~%21) ve katalog kapağı.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Ortak: photorealistic fine-art wedding photography, soft natural light, pastel rose-quartz / blush / cream palette with a
touch of soft gold, gentle film grain. Kurgu bir çift, otuzlu yaşların başında; ünlü ya da gerçek bir kişiye benzemesin.
Yazı, logo, tabela yok.

#### 2.1 Ana portre (aynada ve davetin yanında)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties in a light-filled garden pavilion with tall windows and climbing pale pink roses: the bride in an ivory gown with a soft tulle skirt, the groom in a dove-grey suit with a blush rose boutonnière, close together and smiling, waist-up, faces centred in the upper half of the frame (the photo is also shown cropped to an oval). Pastel rose-quartz, blush and cream palette, soft daylight, gentle film grain. They must not resemble any real or famous person. No text, no frame, no watermark.
```

#### 2.2 Ayna 1 — "Our first dance"
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5, in smart evening clothes dancing a slow first dance together in a softly lit old ballroom with warm string lights, laughing, faces in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No readable signs, no text, no logos.
```

#### 2.3 Ayna 2 — "A little music box"
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5: the proposal at home by a window on a winter afternoon — he holds out a small open rose-coloured music box with a tiny ring inside, she covers her mouth in happy surprise; faces and the box in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No text, no logos.
```

#### 2.4 Ayna 3 — "Yours, forever"
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Close-up, vertical 4:5: the couple's joined hands with a delicate engagement ring, resting on blush satin beside a few rose petals and a little brass music box key; the hands in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 16:9 kırpılır)

```
Landscape: an elegant white garden pavilion with tall arched windows and a rose garden in front, set for a spring wedding with cream chairs and pale pink flowers, soft late-afternoon light. Fictional place — no recognisable real building, no people, no signs, no text. Photorealistic, same palette. Keep the pavilion in the middle 60% of the height (the photo is shown cropped to 16:9).
```

Gelince: `content.demo.json` (koleksiyon + tema kopyası) `media` alanlarına tema yolu yazılmaz — fotoğraflar
`python3 tools/kit_check.py collections/32_Music_Box_Ballerina --paket 2` ile denetlenir; theme-check onları
koleksiyondan kendisi bulur (`scripts/lib/theme-env.ts`).

---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). `'music-box-ballerina'` bloğu bugün eski zeminleri
> (`print/invitation_front.png`, `print/invitation_back.png`; 18–20 Ekim görünümü) kullanıyor; bu iki dosya yeni görünümle
> **değiştirilir** (eski dosyalar repoda kalır, tema kurulunca bırakılır).
> **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px** = 5×7 in +
> 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan ~%0,8
> kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'music-box-ballerina'` bloğunda `sources` → `{ front: 'print/invitation_front_r_5x7.png', back:
>    'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }` (aynı kalır).
> 2. `front` / `back` kutularını yeni görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme music-box-ballerina` ve `node scripts/print-sample.ts
>    --theme music-box-ballerina --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the thick cream cotton card of card_paper.png (#FFF8F4). Across the top centre, between 22% and 78% of the width, a delicate symmetrical soft-gold filigree crest (fine pierced scrolls and leaf curls, as divider.png and the crest of portrait_frame.png) holding a small cluster of three blush garden roses (#EECDD0) with two pale sage leaves and a soft wisp of blush tulle drifting from it to each side; nothing in this top band reaches lower than 17% of the height. Along the bottom, between 93% and 96% of the height and from 14% to 86% of the width, a fine soft-gold filigree rule with one small cream pearl at its centre. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no petal, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges. Soft daylight from the top-left. Only cream, blush, rose quartz, rose gold and soft gold tones. No QR code. No text, letters, numbers, monograms, musical notation, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; telkâri + güller yalnız üstte (%17'nin üstünde), telkâri çizgi + inci yalnız altta; yan %8 boş; yazı/nota yok.

#### P2 — Arka yüz
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same thick cream cotton card, only a short symmetrical soft-gold filigree flourish across the top centre (between 34% and 66% of the width) with one tiny blush rosebud at its middle, its lowest point staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no petal, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, monograms, musical notation, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada kısa telkâri + gonca (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Music Box Ballerina". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a blush satin cloth on a white vanity table, a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, the same light and the same color world (rose quartz, blush, rose gold and soft gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a blush satin cloth on a white vanity table and a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a blush satin cloth on a white vanity table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a blush satin cloth on a white vanity table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a blush satin cloth on a white vanity table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a blush velvet armchair with a rose-gold cushion and a porcelain teacup; a small arrangement of a small closed rose-quartz music box with a brass wind-up key, a pair of blush ballet slippers with satin ribbons, a few blush rose petals and a strand of pearls is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: rose quartz, blush, rose gold and soft gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
