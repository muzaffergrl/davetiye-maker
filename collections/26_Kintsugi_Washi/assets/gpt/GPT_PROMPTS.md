# GPT görsel istekleri — Tasarım 26 · Kintsugi & Washi (yeniden tasarım, 2026-10-22)

> **Instructions for GPT:** This design is being REDESIGNED from scratch (2026-10-22). Generate PAKET 5R (website layers)
> first, in order and in ONE chat, then PAKET 6R (printable invitation). PAKET 2 sample photos already exist — do NOT
> regenerate them. Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as written, follow its
> checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers,
> names, dates, initials, monograms, kanji, kana, calligraphy, seals with characters, logos, QR codes or watermarks in any
> image** (also not on the porcelain button, the cord, the card or the tea bowl). **No religious symbols** (no temple,
> torii, Buddha, incense, charms) and no costume clichés (no kimono, pagoda, paper lantern, folding fan, geisha, cherry
> blossom). This is a calm, rich, romantic stationery piece: hand-made indigo-dyed washi paper folded into a four-flap
> pinwheel packet, crossed by real gold kintsugi seams, closed with a gold-mended porcelain button and a twisted
> gold-and-ivory silk cord. Give W1 `page_ground.png`, W3 `env_back.png` and W4 `flap_n.png` as the style reference of
> every later part: the same handmade washi with long visible kozo fibres, the same deep indigo dye with soft uneven
> depth, the same undyed rice-ivory reverse flecked with gold leaf, the same real gold-lacquer kintsugi seams, the same
> soft north-window light from the top-left. Parts drawn on the same packet canvas (W3–W7 and W12) keep the packet in
> exactly the same box.

Bu dosya tasarım 26'nın **bütün görsel parçalarının** tek kaynağıdır (yeniden tasarım, `docs/35_22_32_YENIDEN_TASARIM.md`
§4 satır 26; görev G226). Önceki PAKET 5 ve PAKET 6 bölümleri kaldırıldı (git geçmişinde). Platform teması
(`platform/themes/kintsugi-washi/`) parçalar gelince **39 pilotunun yapısıyla yeniden kurulacak** (G426); o zamana kadar
mevcut tema değişmeden duruyor. Her parçanın sitede nasıl kullanılacağı "Kullanım" satırlarındadır; gelmeyen parçanın yerine
çizilmiş yedek konmaz (K21). Kişisel alanlar (isimler, tarih, baş harfler, mekân) HTML'dir, hiçbir görsele pişirilmez.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/26_Kintsugi_Washi/assets/gpt/` altındaki `parts/` (PAKET 5R) ve
  `print/` (PAKET 6R). `photos/` (PAKET 2) zaten dolu, dokunma. Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/26_Kintsugi_Washi --paket 5` (oran, gerçek alfa, kenar payı,
  foto penceresi) + göz kontrolü. Tema yeniden kurulunca `python3 platform/themes/kintsugi-washi/build_images.py` ve
  `python3 tools/gpt_kuru_deneme.py --tema kintsugi-washi --sekil collections/26_Kintsugi_Washi/assets/gpt/kuru_sekil.json`
  (prova). PAKET 6R için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic stationery and craft photography** — real handmade washi (kozo) paper with long visible fibres
  and soft deckled (feathered, hand-torn) free edges, real indigo dye that sits unevenly and deeply in the fibres, real
  gold-lacquer kintsugi seams (raised, slightly irregular, warm metallic gold with a soft sheen, fine branching hairlines),
  real glazed white porcelain, real twisted silk cord, real gold leaf. Calm, rich, romantic and classic. Not flat vector,
  not anime, not watercolour clip-art, not a souvenir-shop look.
- Renkler (yalnız bunlar): indigo `#242E58` · night `#161C36` · inner indigo `#3C4874` · rice `#F3ECDC` · gold `#C9A55A`
  · gold light `#E3C987` · gold ink `#7A5C22` · ink `#1D2340`. Porselen sıcak beyaz (`#F7F3EA` civarı); erik çiçeği
  fildişi-beyaz, dal koyu çivit-kahve. Başka renk vurgusu yok (kırmızı yok, pembe yok).
- Kintsugi: her kanatta **kendi** 1–2 altın damarı vardır, kanadın kenarlarına kadar uzanır (komşu kanatta devam ediyor
  gibi görünür); damarlar ince, dallanan, el işi; çizgi film gibi kalın değil. İç yüzlerde aynı damar daha soluk görünür
  (altın kâğıdın içine işlemiş gibi).
- Işık: yumuşak **kuzey penceresi ışığı sol üstten**; altın lakede sıcak, temiz vurgular; bütün parçalarda aynı. Şeffaf
  parçalarda gerçek alfa (beyaz ya da dama deseni değil), nesnenin dışında gölge/hâle yok (gölgeyi site ekler).
- Foto penceresi (`#00FF00`) yalnız W15–W18 paspartularında; diğer parçalarda yeşil alan yok.
- Gerçek bir markaya, sanatçıya, ustaya ya da başka bir satıcının tasarımına benzemesin. Kültür: zanaat (washi, kintsugi,
  tatō katlama) — dini simge, yazı, kostüm, kiraz çiçeği yok. **34 Red Lacquer'den ayrı:** kırmızı yok, kâğıt kesim
  (jianzhi) yok, kordon zarfı yatay saran bir banttır.

## Zarf geometrisi (W3–W7 ve W12 buna göre; W8–W11 ayrı tuvalde)
Paket **kare (1:1)**, önden (üstten) düz görünür. Tuval **1200×1200**; paket kutusu **x %8–92, y %8–92** (1008 px kare,
köşeler (96, 96)–(1104, 1104) px). Altı katman **aynı tuvalde, aynı kutuda**: W3 taban (iç), W4 kuzey kanat, W5 doğu
kanat, W6 güney kanat, W7 batı kanat, W12 kordon bandı; Claude her birini kendi alfa kutusuna kırpar ve W3'ün kutusuna göre
yerleştirir.

Dört kanat **fırıldak (tatō)** düzeninde: her kanat, paketin bir kenarı boyunca tam genişlikte menteşeli (katlama çizgisi)
bir üçgendir; tepesi merkezin %8 ötesine, **saat yönünde kaydırılmış** bir noktadadır (dört tepe merkez etrafında dönen
bir fırıldak çizer). Köşe noktaları tuval yüzdesiyle:
- **K (kuzey, W4):** menteşe üst kenar (8, 8)–(92, 8); tepe **(58, 58)**.
- **D (doğu, W5):** menteşe sağ kenar (92, 8)–(92, 92); tepe **(42, 58)**.
- **G (güney, W6):** menteşe alt kenar (92, 92)–(8, 92); tepe **(42, 42)**.
- **B (batı, W7):** menteşe sol kenar (8, 92)–(8, 8); tepe **(58, 42)**.
Kanatların iki serbest kenarı düz ama **yumuşak el yırtığı (deckle) washi kenarı**dır; menteşe kenarı keskin bir katlama
çizgisi. Kapalıyken dört kanat tabanı tamamen örter (tepeler merkezde üst üste biner; boşluk kalmaz).

- **Taban (W3):** paketin iç zemini — aynı kare (x/y %8–92), washi'nin **boyasız iç yüzü**: pirinç fildişi `#F3ECDC`,
  seyrek altın varak pulları, dört kenarda çok hafif çivit sızıntısı ve katlama izleri.
- **Kordon bandı (W12):** altın-fildişi bükme ipek kordon paketi **yatay** sarar: merkez çizgisi y %50, sol ve sağ
  kenarda (x %8 ve %92) paketin arkasına dönüyor gibi biter; ortada, düğmenin oturacağı **merkezi (50, 50), çapı tuvalin
  %16'sı** olan **boş** dairenin çevresinde kordonun iki ucu sekiz şeklinde iki ilmek atar (daire içi şeffaf).
- **Porselen düğme (W13, ayrı 600×600 tuval):** pakette merkez (50, 50), çapı tuvalin %16'sı (paket eninin %19'u).
- **Kanat iç yüzleri (W8–W11, ayrı tuvaller):** her biri kendi kanadının menteşesine göre **aynalanmış** hâli (kanat
  dışa doğru düz yatırıldığında görünen yüz); menteşe kenarı tuvalin bir kenarına paralel, %8,3 içeride:
  - K iç (W8) 1200×720: menteşe **altta** y %91,7, x %8–92; tepe **(58, 8,3)**.
  - D iç (W9) 720×1200: menteşe **solda** x %8,3, y %8–92; tepe **(91,7, 58)**.
  - G iç (W10) 1200×720: menteşe **üstte** y %8,3, x %8–92; tepe **(42, 91,7)**.
  - B iç (W11) 720×1200: menteşe **sağda** x %91,7, y %8–92; tepe **(8,3, 42)**.
- Kat sırası (alttan üste): W3 taban → kart (W14) → W7 B → W6 G → W5 D → W4 K → W12 kordon → W13 düğme.

Açılış: düğme yarım tur döner (kordonu çözer gibi) ve hafifçe kalkıp söner → kordon bandı gevşeyip sağa kayarak söner →
kanatlar **K → D → G → B** sırasıyla 220 ms arayla kendi menteşelerinde 3B açılır (arka yüzler W8–W11, düz renk asla); sahne
açık kanatlar ekrana sığsın diye hafifçe küçülür → altın pullu taban görünür → pirinç kâğıdı kart (W14) merkezden
izleyiciye doğru yükselip büyür → altın varak pulu, çivit mürekkep damlası ve erik yaprağı (W23) süzülür → home.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Pirinç kâğıdı washi (sayfa zemini, kapak)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/page_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of handmade undyed washi (kozo) paper in a warm rice ivory (#F3ECDC): long soft visible plant fibres drifting in random directions within the sheet, a gentle cloudy formation, a faint felt tooth, and only a very sparse scatter of tiny gold-leaf flecks (#C9A55A) caught in the fibres — no more than a few per tile, small and irregular. Evenly lit by soft north-window light from the top-left: no fold, no crease, no deckle edge, no stain, no shadow, no vignette, no pattern, no flowers, no indigo. Very low contrast so dark ink text reads on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: dikişsiz (2×2 ek yeri yok); pirinç fildişi `#F3ECDC` civarı; uzun lifler görünür; altın pullar çok seyrek ve küçük; desen/leke/çivit yok.
Kullanım: tema kurulunca bütün sayfaların zemini ve kapak (kapalı paket) sayfası; açık zemin (docs/35 §3 ritmi).

#### W2 Kart kâğıdı (kartlar, bantlar, form)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/card_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat texture of a smooth, thick, hand-made rice-paper card stock in a slightly lighter warm ivory than page_ground.png (around #F6F0E3): a fine even surface with only very faint short fibres pressed into it, a soft velvety tooth, the calm tone of good stationery. No gold flecks, no pattern, no fold, no crease, no stain, no shadow, no vignette. Evenly lit by soft north-window light from the top-left. Calm enough for small dark ink text to read on it everywhere. Edges tile without a visible seam. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: dikişsiz; W1'den biraz daha açık ve pürüzsüz; altın pul yok; leke/desen yok; üstüne küçük koyu yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, program, RSVP formu (W1 zemin üstünde ayrışan kart yüzeyi).

#### W3 Paketin tabanı (iç zemin; kanatlar açılınca görünür)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/env_back.png` · 1200×1200 · **Şeffaf zemin**

```
The flat inside floor of an opened square paper packet, seen perfectly straight from above, on a fully transparent background: a perfect square occupying exactly x 8–92% and y 8–92% of the canvas (corners at 96,96 and 1104,1104 px). It is the UNDYED reverse side of handmade indigo washi: warm rice ivory (#F3ECDC) with long soft kozo fibres, a scatter of small irregular gold-leaf flecks (#C9A55A, #E3C987) caught in the paper, the faintest bleed of indigo (#3C4874) seeping in along all four edges where the dye came through, and four crisp fold creases running exactly along the square's four edges (these are the hinges of the flaps). One very fine pale-gold kintsugi hairline wanders across one corner, faded into the paper. Perfectly flat, softly lit by north-window light from the top-left. No flaps, no cord, no button, no card, no flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: tam kare x/y %8–92; boyasız pirinç fildişi iç yüz, altın pullar, kenarlarda hafif çivit sızıntısı; dört kenarda katlama çizgisi; kanat/kordon/kart yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — en alt katman; kanatlar açılınca kartın arkasında görünen altın pullu iç. Bütün zarf katmanlarının hizası bu parçanın alfa kutusuna göre yapılır.

#### W4 Kuzey kanat (kapalı, dış yüz)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_n.png` · 1200×1200 · **Şeffaf zemin**

```
Only the NORTH flap of a square four-flap pinwheel paper packet, on a 1200×1200 canvas, on a fully transparent background, seen perfectly straight from above. The packet box is x 8–92% and y 8–92% of the canvas, but only this one flap is drawn: a triangle of handmade indigo-dyed washi paper whose three corners are exactly at (8%, 8%), (92%, 8%) and (58%, 58%) of the canvas — its straight top edge runs along the packet's top edge and is a crisp fold (the hinge), and its two free edges run down to a point that sits just past the centre, shifted to the lower right. The two free edges are straight in direction but softly deckled, feathery hand-torn washi edges with fine fibres. The paper is deep indigo (#242E58) dyed unevenly into the long kozo fibres, darker toward the fold (#161C36), lighter and slightly mottled toward the point (#3C4874). Across the flap run one or two real gold-lacquer kintsugi seams (#C9A55A with warm highlights #E3C987 and fine dark-gold edges #7A5C22): raised, slightly irregular, branching into fine hairlines, reaching the flap's free edges as if the line continues onto the neighbouring flap. Soft north-window light from the top-left, a whisper of contact shade on the flap itself along its free edges. Everything else on the canvas is fully transparent. No other flap, no base, no cord, no button. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: tek üçgen kanat; köşeler (8, 8), (92, 8), (58, 58); üst kenar keskin katlama, iki serbest kenar yumuşak yırtık; çivit washi, 1–2 altın kintsugi damarı kenara ulaşıyor; başka parça yok; gerçek alfa.
Kullanım: tema kurulunca en üstteki kanat; açılışta ilk açılan (üst menteşesinde 3B kalkar, arka yüzü W8).

#### W5 Doğu kanat (kapalı, dış yüz)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_e.png` · 1200×1200 · **Şeffaf zemin**

```
Only the EAST flap of the same square four-flap pinwheel paper packet as flap_n.png, on the same 1200×1200 canvas and in exactly the same packet box (x 8–92%, y 8–92%), on a fully transparent background, seen perfectly straight from above. A triangle of the same handmade indigo-dyed washi whose three corners are exactly at (92%, 8%), (92%, 92%) and (42%, 58%) of the canvas — its straight right edge runs along the packet's right edge and is a crisp fold (the hinge), and its two free edges run to a point just past the centre, shifted to the lower left. The two free edges are softly deckled, feathery hand-torn washi edges. Deep indigo (#242E58) dyed unevenly into the fibres, darker toward the fold (#161C36), lighter toward the point (#3C4874), with one or two real gold-lacquer kintsugi seams (#C9A55A, highlights #E3C987, dark-gold edges #7A5C22), raised, irregular and branching, reaching the free edges. Same paper, dye, gold and soft north-window light from the top-left as flap_n.png; a whisper of contact shade on the flap itself along its free edges. Everything else is fully transparent. No other flap, no base, no cord, no button. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: köşeler (92, 8), (92, 92), (42, 58); sağ kenar katlama; W4 ile aynı kâğıt, boya, altın; gerçek alfa.
Kullanım: tema kurulunca W4'ün altında; açılışta ikinci (sağ menteşesinde 3B, arka yüzü W9).

#### W6 Güney kanat (kapalı, dış yüz)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_s.png` · 1200×1200 · **Şeffaf zemin**

```
Only the SOUTH flap of the same square four-flap pinwheel paper packet as flap_n.png, on the same 1200×1200 canvas and in exactly the same packet box (x 8–92%, y 8–92%), on a fully transparent background, seen perfectly straight from above. A triangle of the same handmade indigo-dyed washi whose three corners are exactly at (92%, 92%), (8%, 92%) and (42%, 42%) of the canvas — its straight bottom edge runs along the packet's bottom edge and is a crisp fold (the hinge), and its two free edges rise to a point just past the centre, shifted to the upper left. The two free edges are softly deckled, feathery hand-torn washi edges. Deep indigo (#242E58) dyed unevenly into the fibres, darker toward the fold (#161C36), lighter toward the point (#3C4874), with one or two real gold-lacquer kintsugi seams (#C9A55A, highlights #E3C987, dark-gold edges #7A5C22), raised, irregular and branching, reaching the free edges. Same paper, dye, gold and soft north-window light from the top-left as flap_n.png; a whisper of contact shade on the flap itself along its free edges. Everything else is fully transparent. No other flap, no base, no cord, no button. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: köşeler (92, 92), (8, 92), (42, 42); alt kenar katlama; W4 ile aynı malzeme; gerçek alfa.
Kullanım: tema kurulunca W5'in altında; açılışta üçüncü (alt menteşesinde 3B, arka yüzü W10).

#### W7 Batı kanat (kapalı, dış yüz)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_w.png` · 1200×1200 · **Şeffaf zemin**

```
Only the WEST flap of the same square four-flap pinwheel paper packet as flap_n.png, on the same 1200×1200 canvas and in exactly the same packet box (x 8–92%, y 8–92%), on a fully transparent background, seen perfectly straight from above. A triangle of the same handmade indigo-dyed washi whose three corners are exactly at (8%, 92%), (8%, 8%) and (58%, 42%) of the canvas — its straight left edge runs along the packet's left edge and is a crisp fold (the hinge), and its two free edges run to a point just past the centre, shifted to the upper right. The two free edges are softly deckled, feathery hand-torn washi edges. Deep indigo (#242E58) dyed unevenly into the fibres, darker toward the fold (#161C36), lighter toward the point (#3C4874), with one or two real gold-lacquer kintsugi seams (#C9A55A, highlights #E3C987, dark-gold edges #7A5C22), raised, irregular and branching, reaching the free edges. Same paper, dye, gold and soft north-window light from the top-left as flap_n.png; a whisper of contact shade on the flap itself along its free edges. Everything else is fully transparent. No other flap, no base, no cord, no button. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: köşeler (8, 92), (8, 8), (58, 42); sol kenar katlama; W4 ile aynı malzeme; dört kanat üst üste konunca tabanı boşluksuz örter; gerçek alfa.
Kullanım: tema kurulunca en alttaki kanat (kartın hemen üstü); açılışta dördüncü (sol menteşesinde 3B, arka yüzü W11).

#### W8 Kuzey kanadın iç yüzü (açık, dışa yatmış)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_in_n.png` · 1200×720 · **Şeffaf zemin**

```
The inside face of the north flap of flap_n.png, alone, as it looks when the flap is opened and laid flat outward above the packet, seen straight on, on a fully transparent background: the same triangle mirrored over its fold. Its straight fold edge is at the BOTTOM, along 91.7% of the image height, spanning x 8–92% of the width, and its point is at the TOP at (58%, 8.3%) of the image. Its two free edges are the same softly deckled, feathery hand-torn washi edges. This is the UNDYED reverse of the indigo washi: warm rice ivory (#F3ECDC) with long kozo fibres and a scatter of small gold-leaf flecks (#C9A55A, #E3C987), a soft cloud of indigo (#3C4874) bleeding through along the torn edges, and the gold kintsugi seam of the outside showing through as a paler, slightly sunken gold line (#C9A55A softened) in mirrored position, reaching the free edges. A crisp fold crease along the bottom edge. Soft north-window light from the top-left. Not a plain colour: real paper, fibres, flecks and seam must be visible. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: menteşe altta (y %91,7, x %8–92), tepe (58, 8,3); boyasız fildişi washi + altın pullar + kenarda çivit sızıntısı + soluk altın damar; düz renk değil; gerçek alfa.
Kullanım: tema kurulunca kuzey kanadın 3B dönüşünün arka yüzü (açık kanat paketin üstünde yatarken görünen yüz).

#### W9 Doğu kanadın iç yüzü (açık, dışa yatmış)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_in_e.png` · 720×1200 · **Şeffaf zemin**

```
The inside face of the east flap of flap_e.png, alone, as it looks when the flap is opened and laid flat outward to the right of the packet, seen straight on, on a fully transparent background: the same triangle mirrored over its fold. Its straight fold edge is at the LEFT, along 8.3% of the image width, spanning y 8–92% of the height, and its point is at the RIGHT at (91.7%, 58%) of the image. The same undyed rice-ivory washi reverse as flap_in_n.png (#F3ECDC, long kozo fibres, small gold-leaf flecks, indigo #3C4874 bleeding in along the torn edges, the outside's gold kintsugi seam showing through as a paler sunken gold line in mirrored position), softly deckled free edges, a crisp fold crease along the left edge. Soft north-window light from the top-left. Not a plain colour. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: menteşe solda (x %8,3, y %8–92), tepe (91,7, 58); W8 ile aynı iç yüz malzemesi; gerçek alfa.
Kullanım: tema kurulunca doğu kanadın 3B dönüşünün arka yüzü.

#### W10 Güney kanadın iç yüzü (açık, dışa yatmış)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_in_s.png` · 1200×720 · **Şeffaf zemin**

```
The inside face of the south flap of flap_s.png, alone, as it looks when the flap is opened and laid flat outward below the packet, seen straight on, on a fully transparent background: the same triangle mirrored over its fold. Its straight fold edge is at the TOP, along 8.3% of the image height, spanning x 8–92% of the width, and its point is at the BOTTOM at (42%, 91.7%) of the image. The same undyed rice-ivory washi reverse as flap_in_n.png (#F3ECDC, long kozo fibres, small gold-leaf flecks, indigo #3C4874 bleeding in along the torn edges, the outside's gold kintsugi seam showing through as a paler sunken gold line in mirrored position), softly deckled free edges, a crisp fold crease along the top edge. Soft north-window light from the top-left. Not a plain colour. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: menteşe üstte (y %8,3, x %8–92), tepe (42, 91,7); W8 ile aynı iç yüz malzemesi; gerçek alfa.
Kullanım: tema kurulunca güney kanadın 3B dönüşünün arka yüzü.

#### W11 Batı kanadın iç yüzü (açık, dışa yatmış)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_in_w.png` · 720×1200 · **Şeffaf zemin**

```
The inside face of the west flap of flap_w.png, alone, as it looks when the flap is opened and laid flat outward to the left of the packet, seen straight on, on a fully transparent background: the same triangle mirrored over its fold. Its straight fold edge is at the RIGHT, along 91.7% of the image width, spanning y 8–92% of the height, and its point is at the LEFT at (8.3%, 42%) of the image. The same undyed rice-ivory washi reverse as flap_in_n.png (#F3ECDC, long kozo fibres, small gold-leaf flecks, indigo #3C4874 bleeding in along the torn edges, the outside's gold kintsugi seam showing through as a paler sunken gold line in mirrored position), softly deckled free edges, a crisp fold crease along the right edge. Soft north-window light from the top-left. Not a plain colour. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: menteşe sağda (x %91,7, y %8–92), tepe (8,3, 42); W8 ile aynı iç yüz malzemesi; gerçek alfa.
Kullanım: tema kurulunca batı kanadın 3B dönüşünün arka yüzü.

#### W12 Altın-fildişi bükme kordon bandı (kapanış)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/cord_band.png` · 1200×1200 · **Şeffaf zemin**

```
On the same 1200×1200 canvas as env_back.png and flap_n.png, in exactly the same place (the packet box is x 8–92% and y 8–92% of the canvas, but the packet itself is NOT drawn here), only a twisted silk cord that ties the closed packet, on a fully transparent background: one round cord about 1.6% of the canvas thick, two strands twisted together — one warm gold (#C9A55A with soft highlights #E3C987) and one ivory (#F3ECDC) — with a fine silky sheen. It runs horizontally across the packet along the centre line (y 50%) from x 8% to x 92%, and at both ends it turns away in a soft rounded bend, as if it wraps around the packet's left and right edges and continues behind. In the middle, around an EMPTY circle centred at (50%, 50%) with a diameter of 16% of the canvas (where a button will sit — leave the inside of this circle fully transparent), the cord's two ends are wound in a neat figure-eight: one loop above-left and one loop below-right of the circle, crossing each other just at the circle's edge, the loops lying flat. Soft north-window light from the top-left; a hair-fine contact shade on the cord itself only. Everything else is fully transparent: no packet, no flap, no button, no tassel, no knot bow. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: tek bükme kordon (altın + fildişi iki kat); yatay y %50, uçları x %8 ve %92'de arkaya dönüyor; ortada (50, 50) merkezli %16 çaplı daire boş ve şeffaf, çevresinde sekiz ilmek; püskül/fiyonk yok; paket çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca aynı paket tuvalinde, kanatların üstünde, düğmenin altında; açılışta düğme dönerken gevşer (hafif scaleX) ve sağa kayarak söner.

#### W13 Kintsugi onarımlı porselen düğme
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/button.png` · 600×600 · **Şeffaf zemin**

```
A single round porcelain button, seen perfectly straight from the front, on a fully transparent background, centred and filling about 78% of the canvas: a gently domed disc of glazed warm-white porcelain (#F7F3EA) with a soft glassy sheen and a slightly thicker rounded rim, once broken into three pieces and mended in the kintsugi way — three fine, slightly raised real gold-lacquer seams (#C9A55A, highlights #E3C987, dark-gold edges #7A5C22) running irregularly from the rim toward a point just off the centre, where they meet. A very faint pale-indigo crackle in the glaze near the rim. No holes, no shank visible, no pattern, no flower, no character, no letter. Soft north-window light from the top-left with a clean soft highlight on the dome. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: tek yuvarlak sırlı beyaz porselen disk; üç altın kintsugi dikişi merkeze yakın birleşiyor; delik/desen/harf yok; gerçek alfa.
Kullanım: tema kurulunca paketin ortasında (50, 50), çapı tuvalin %16'sı; açılışta yarım tur döner, hafifçe kalkıp söner. Home imzasında ve RSVP kapanışında küçük.

#### W14 Paketteki kart (boş)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/card_small.png` · 1000×1300 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen perfectly straight on, on a fully transparent background: the card occupies x 7–93% and y 6–94% of the canvas. Thick hand-made rice-paper card of card_paper.png (around #F6F0E3) with softly deckled, feathery hand-torn edges on all four sides, the very edge of the deckle lightly gilded with gold leaf (#C9A55A) that catches the light here and there. At the top centre, inside the card, a short horizontal real gold-lacquer kintsugi seam about 26% of the card's width, slightly irregular with two fine branching hairlines, like a mended crack. Below it the whole card is completely EMPTY paper (the website sets the names, the date and the venue there in HTML). A very soft contact shade on the card itself along the deckle. Soft north-window light from the top-left. No flowers, no photo, no frame line. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: yırtık kenarlı pirinç kâğıdı kart, kenarı yer yer altın varaklı; üst ortada kısa altın dikiş; altı tamamen boş; gerçek alfa.
Kullanım: tema kurulunca paketin tabanında yatan, açılışta merkezden öne yükselen kart; home kartının kâğıdı (isimler, tarih, mekân HTML dikişin altına).

#### W15 Çivit washi portre paspartusu (home portresi, foto penceresi)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/frame_portrait.png` · 1000×1250 · **Şeffaf zemin**

```
A portrait photo mat of handmade indigo-dyed washi paper, alone, seen straight on, on a fully transparent background: the mat spans about x 6–94% and y 6–94% of the canvas, its outer edge softly deckled and feathery, hand-torn all around, the deep indigo (#242E58) dyed unevenly into long kozo fibres and lightening to #3C4874 toward the torn edges, a thin rice-ivory (#F3ECDC) layer of an undyed sheet peeking out just beyond the torn indigo edge. One real gold-lacquer kintsugi seam (#C9A55A, highlights #E3C987) crosses the lower-right corner of the mat from its outer edge toward the window and stops just short of it, branching into fine hairlines. In the middle a vertical photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Soft north-window light from the top-left. No flowers, no cord, no glass over the window. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, ~760×950 (4:5), sol üst ~(120, 150); yırtık kenarlı çivit washi paspartu, altında ince fildişi kat; sağ alt köşede pencereye değmeyen altın dikiş; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → home kartındaki portre ve hikâye tanıtımı; foto W19 mürekkep lekesi maskesiyle merkezden yayılarak belirir, sonra altın dikiş üzerinde bir ışık süpürmesi.

#### W16 Pirinç kâğıdı story paspartusu (dikey, foto penceresi)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/frame_story.png` · 1000×1250 · **Şeffaf zemin**

```
A portrait photo mat of thick undyed rice-ivory washi (#F3ECDC with long kozo fibres and a few gold-leaf flecks), alone, seen straight on, on a fully transparent background: the mat spans about x 6–94% and y 6–94% of the canvas, its outer edge softly deckled and hand-torn all around; a soft wash of indigo (#3C4874 fading to #242E58 at the very edge) has been brushed and absorbed along the torn outer border, like dye drawn into the fibres, leaving the area close to the window clean ivory. A real gold-lacquer kintsugi seam (#C9A55A, highlights #E3C987) runs along the upper-left corner from the outer edge toward the window, stopping short of it. In the middle a vertical photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Soft north-window light from the top-left. No flowers, no cord. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, ~760×950 (4:5), sol üst ~(120, 150); fildişi washi, dış kenarda çivit boya emilimi; sol üstte pencereye değmeyen altın dikiş; gerçek alfa.
Kullanım: tema kurulunca story'de 1. ve 3. an (sol–sağ–sol); foto mürekkep lekesiyle belirir.

#### W17 Pirinç kâğıdı story paspartusu (yatay, foto penceresi)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/frame_story_wide.png` · 1250×1000 · **Şeffaf zemin**

```
A landscape photo mat, the same material and style as frame_story.png, alone, seen straight on, on a fully transparent background: thick undyed rice-ivory washi (#F3ECDC, long kozo fibres, a few gold-leaf flecks) spanning about x 6–94% and y 6–94% of the canvas, its outer edge softly deckled and hand-torn all around, a soft wash of indigo (#3C4874 to #242E58) absorbed along the torn border, a real gold-lacquer kintsugi seam (#C9A55A) running along the lower-right corner toward the window and stopping short of it. In the middle a landscape photo window exactly 950 px wide and 760 px tall (5:4), its top-left corner at x 150 px, y 120 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Soft north-window light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, ~950×760 (5:4), sol üst ~(150, 120); W16 ile aynı malzeme; sağ altta altın dikiş; gerçek alfa.
Kullanım: tema kurulunca story'nin 2. anı ("Tea by the river", `story_2.jpg` yatay 5:4).

#### W18 Geniş el yırtığı washi (mekân fotoğrafı, foto penceresi)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/frame_venue.png` · 1600×1000 · **Şeffaf zemin**

```
A wide landscape photo mat of handmade indigo-dyed washi, alone, lying flat, seen straight on, on a fully transparent background: the sheet spans about x 6–94% and y 6–94% of the canvas, its outer edge softly deckled and hand-torn all around, deep indigo (#242E58) dyed unevenly into the fibres and lightening toward the torn edges (#3C4874), a thin undyed rice-ivory sheet (#F3ECDC) peeking out just beyond the torn indigo edge along the bottom. Two real gold-lacquer kintsugi seams (#C9A55A, highlights #E3C987): one crossing the top-left corner, one the bottom-right corner, each from the outer edge toward the window, stopping short of it. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 110 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Soft north-window light from the top-left. No flowers, no cord. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, ~1360×765 (16:9), sol üst ~(120, 110); yırtık kenarlı çivit washi; iki köşede pencereye değmeyen altın dikiş; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafı (mürekkep lekesiyle belirir).

#### W19 Sumi mürekkep lekesi (foto maskesi)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/ink_bloom.png` · 1200×1200 · **Şeffaf zemin**

```
A single bloom of black sumi ink that has spread into absorbent washi paper, seen straight from above, on a fully transparent background — only the ink, no paper: a roughly round, organic ink stain centred in the canvas, about 76% of the canvas wide, fully opaque deep black (#0B0D18) in its body, with a natural feathered, fibrous outer edge where the ink crept along the paper fibres in fine tendrils, a few small satellite droplets just outside it, and a slightly softer, partly translucent rim. Its silhouette is irregular but compact — no long splashes, no drips. Flat, no gloss, no 3D. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: tek yuvarlağımsı mürekkep lekesi, gövdesi tam opak siyah, kenarı lifli tüylü; uzun sıçrama yok; kâğıt çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca CSS `mask-image` — fotoğraflar (W15–W18 pencereleri) merkezden büyüyen bu lekeyle belirir; leke küçükten tam boya ölçeklenir. Görünür süs değil.

#### W20 Beyaz erik dalı (köşe süsü, ölçülü)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/corner_sprig.png` · 1200×1000 · **Şeffaf zemin**

```
A slender, restrained sprig of white plum blossom growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: one thin, gracefully angled dark branch (deep indigo-brown, #2A2630) with a few side twigs, five or six small five-petalled ivory-white plum blossoms (#F7F3EA) with soft golden stamens (#C9A55A), three round buds, a touch of real gold leaf on one or two buds and on the branch's tip. Airy and sparse, much empty space between the flowers. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right half of the canvas is completely empty. Soft north-window light from the top-left. No cherry blossom, no pink, no red, no leaves in other colours, no vase, no bird. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: ince tek dal, 5–6 beyaz erik çiçeği, altın dokunuşlu tomurcuklar; seyrek; sağ alt yarı boş; pembe/kiraz yok; gerçek alfa.
Kullanım: tema kurulunca kapakta sağ üst köşede küçük (aynalanır; metnin altına girmez), home kartının köşesi, RSVP kapanışı.

#### W21 Altın kintsugi dikişi (bölüm ayırıcı)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider made of a single real gold-lacquer kintsugi seam, alone, on a fully transparent background — only the gold line, no paper or ceramic: a slightly irregular, gently wandering horizontal line of raised warm gold lacquer (#C9A55A with highlights #E3C987 and fine dark-gold edges #7A5C22) running across x 10–90% of the canvas at the vertical centre, thickest in the middle (about 1.2% of the canvas width) and tapering to hair-fine at both ends, with two or three tiny branching hairlines near the middle, the soft metallic sheen of real gold catching north-window light from the top-left. Elegant and fine. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: yatay tek altın dikiş, ortada kalın, uçlara doğru incelen, birkaç ince dal; kâğıt yok; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet bandı, details program, RSVP formu); girerken soldan sağa maskeyle "akar" ve bir ışık süpürmesi alır.

#### W22 Kintsugi onarımlı çay kâsesi (imza süsü)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/mended_bowl.png` · 800×640 · **Şeffaf zemin**

```
A single small hand-thrown ceramic tea bowl, alone, seen from the front at a very slight high angle, on a fully transparent background, photorealistic: a softly irregular wheel-thrown form, a deep indigo glaze (#242E58 to #3C4874) pooling darker at the foot and breaking to a soft rice-ivory (#F3ECDC) at the lip, mended in the kintsugi way with two real gold-lacquer seams (#C9A55A, highlights #E3C987) running from the lip down the side and branching. Empty, no tea, no steam. The bowl spans about x 15–85% and y 15–85% of the canvas. Soft north-window light from the top-left. No saucer, no whisk, no cloth, no table. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: tek kâse, çivit sır + fildişi ağız, iki altın kintsugi dikişi; boş; altlık/masa yok; gerçek alfa.
Kullanım: tema kurulunca home imzasında (isimlerin üstünde), RSVP gönderiminde (kâsede altın parıltısı) ve teşekkür modunda.

#### W23 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, soft north-window light from the top-left. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. (Make three files, the same light and scale: 1 = one small irregular flake of real gold leaf (#C9A55A to #E3C987), thin, slightly crumpled with a torn edge, catching the light; 2 = one single round droplet of indigo ink (#242E58) seen from above, glossy, with a tiny feathered halo where it touched paper — only the ink, no paper; 3 = one single loose white plum-blossom petal (#F7F3EA), small, rounded, softly cupped, with a faint golden blush at its base.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (altın varak pulu, çivit mürekkep damlası, erik yaprağı); kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışta kart yükselirken ve RSVP gönderilince süzülen küçük nesneler (her biri ayrı katman, kendi fazında); mürekkep damlası kartın yanına düşüp hafifçe yayılır.

#### W24 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic stationery photography, soft north-window light from the top-left: the closed square four-flap pinwheel packet of indigo-dyed washi with gold kintsugi seams (as flap_n.png, flap_e.png, flap_s.png and flap_w.png together), tied with the twisted gold-and-ivory silk cord (as cord_band.png) and closed with the gold-mended white porcelain button (as button.png), lying slightly right of centre and turned a few degrees on a sheet of rice-ivory washi (as page_ground.png); at the left, the small indigo kintsugi tea bowl (as mended_bowl.png) and a slender sprig of white plum blossom (as corner_sprig.png); a few flakes of gold leaf scattered; behind, softly out of focus, more washi sheets with torn edges. Only indigo, rice ivory, warm white porcelain and gold. The top 20% of the image is calm and soft (only out-of-focus paper). This image is cropped to 1200×630 for link previews: keep the whole packet visible with at least 5% empty margin below it. No people, no card text. No text, letters, numbers, monograms, kanji, kana, logos or watermarks.
```
Kontrol: paket + kordon + düğme bütün, altında ≥%5 boşluk; kâse ve erik dalı solda; üst %20 sakin; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım) ve katalog kapağı.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Ortak: photorealistic fine-art wedding photography, soft natural light, a calm indigo, ivory and warm gold palette,
subtle film grain; ONE fictional couple in their early thirties, the same two people in every photo (they must not
resemble any real person or celebrity): Naomi — shoulder-length wavy dark-brown hair, warm light-brown skin, a slim gold
ring; Kai — short black hair, a neat short beard, light skin. Modern, elegant clothing (no costume). No text, no frame,
no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir.

#### 2.1 Ana portre
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Naomi and Kai, in their early thirties (Naomi: shoulder-length wavy dark-brown hair, warm light-brown skin, a slim gold ring; Kai: short black hair, a neat short beard, light skin; they must not resemble any real person or celebrity) in an autumn garden: she in a simple ivory silk gown, he in a deep indigo suit, standing close under a red-gold maple, smiling at each other, three-quarter length, faces in the upper third, soft afternoon light from the left, a still pond and a cedar pavilion softly out of focus behind. Photorealistic, calm indigo, ivory and gold palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "A borrowed umbrella"
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin), laughing under one shared dark umbrella on a quiet rainy street at dusk, warm shop lights blurred behind, wet stones reflecting the light, her hand on his arm. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "Tea by the river"
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/story_2.jpg` · Yatay 1280×1024 (5:4)
```
Landscape 5:4: the same couple as hero_portrait.jpg sitting side by side on a wooden deck by a wide river in the early morning, two simple handmade ceramic cups between them, mist over the water and forested hills, seen from slightly behind and to the side. Photorealistic, same palette and grain. No text.
```

#### 2.4 Story 3 — "The promise"
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, beside a small ceramic tea bowl mended with gold kintsugi seams, on indigo linen, soft window light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant open garden pavilion of warm cedar wood beside a still pond in autumn, red and gold maples, a gravel path and a few rows of simple white chairs set for a ceremony, soft late-afternoon light, forested hills behind. No people, no signs, no text. Photorealistic, same palette.
```

---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, `'kintsugi-washi'` bloğu). Eski PAKET 6 zeminleri
> (`print/invitation_front_5x7.png`, `print/invitation_back_5x7.png`; fildişi + köşe çiçekleri) eski görünüme aittir;
> bu iki dosya **yeni adlarla** istenir, eskilerin üstüne yazılmaz.
> **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px** = 5×7 in +
> 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (oran 0,713) aynı sayfadan yanlardan ~%0,8 kırpılarak
> basılır. Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema yeniden kurulunca (G426) `layouts.ts` `'kintsugi-washi'` bloğunda `sources` → `{ front:
>    'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`; `ink` / `accent` koyu çivit (`#1D2340`).
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme kintsugi-washi`; `public/print/kintsugi-washi/`'deki artık
>    kaynak olmayan eski dosyalar silinir; `node scripts/print-sample.ts --theme kintsugi-washi --invite 5x7 --bleed` +
>    `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the smooth hand-made rice-paper card of card_paper.png (around #F6F0E3). Across the top, a hand-torn strip of indigo-dyed washi (as flap_n.png: deep indigo #242E58 dyed unevenly into long fibres, softly feathered torn lower edge) lies along the top edge from 8% to 92% of the width, with one real gold-lacquer kintsugi seam (#C9A55A) crossing it; a slender sprig of white plum blossom with gold-touched buds (as corner_sprig.png) rests over its right end; nothing in this top band reaches lower than 17% of the height. Along the bottom, between 93% and 96% of the height and from 20% to 80% of the width, a single fine horizontal gold kintsugi seam (as divider.png), thickest in the middle and tapering to hair-fine ends. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are printed there): no fleck, no petal, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges except the torn strip itself. Soft north-window light from the top-left. Only indigo, rice ivory and gold. No QR code. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma pirinç kâğıdı; üstte yırtık çivit washi şerit + altın dikiş + erik dalı (%17'nin üstünde); altta tek altın dikiş; %19–%91 × %10–%90 tamamen boş; yazı/QR yok.

#### P2 — Arka yüz
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation (give invitation_front_r_5x7.png as the reference image), full bleed, portrait 5.25:7.25, perfectly flat: the same smooth rice-paper card, only a short horizontal gold kintsugi seam (as divider.png) across the top centre, between 32% and 68% of the width, with one tiny white plum blossom resting at its middle, everything staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no fleck, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada kısa altın dikiş + tek erik çiçeği (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a sheet of pale ivory rice paper over a light ash wood table and a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a sheet of pale ivory rice paper over a light ash wood table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a sheet of pale ivory rice paper over a light ash wood table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a sheet of pale ivory rice paper over a light ash wood table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a natural linen sofa with an indigo cushion and a ceramic tea bowl; a small arrangement of a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 26`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a sheet of pale ivory rice paper over a light ash wood table, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a sheet of pale ivory rice paper over a light ash wood table, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a sheet of pale ivory rice paper over a light ash wood table, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a sheet of pale ivory rice paper over a light ash wood table: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a sheet of pale ivory rice paper over a light ash wood table: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a sheet of pale ivory rice paper over a light ash wood table, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a sheet of pale ivory rice paper over a light ash wood table, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a sheet of pale ivory rice paper over a light ash wood table: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.

---

## PAKET 8 — Kintsugi Washi yeniden tasarım (2026-10-24)

> Kullanıcı (2026-10-23/24): 21'den itibaren her tasarım "çok iyi bir profesyonel tasarımcının elinden çıkmış gibi" olacak
> ("cesur ve yaratıcı ol"); kendine özgü bileşen, hareket ve ses. 26'nın bugünkü sitesi (PAKET 5R, G426: kare çivit tatō +
> altın-fildişi kordon + kintsugi düğme + yırtık paspartular; `frame_*` pencerelerinde GPT yeşili yarı saydam lekeye döndü)
> çıta değildir. PAKET 8 tasarımı baştan GPT'ye çizdirir (K21): önce **W1** tasarım panosu, sonra aynı sohbette panodan türeyen
> **W2** parçaları (23 madde, 29 dosya). Claude yalnız keser, maskeler, ölçekler, ışık verir, HTML/CSS/JS kurar; çizmez. Bu
> bölüm dosyanın başındaki "Instructions for GPT" notunun (page_ground / env_back / flap_n stil referansı) ve PAKET 5R'nin
> yerini alır.
>
> Claude için notlar:
> - W1'in kayıt satırı bilerek kalın değil: yol `mockups/` altında olduğu için `kit_check` / `gpt_yerlestir` orada yeşil ekran
>   arar. Panoyu GPT doğrudan commit eder; `gpt_yerlestir`'e verilmez.
> - W1 demo metni `content.demo.json` ile aynı: Naomi & Kai (Naomi Ellis Hart & Kai Matthew Arden) · Saturday, October 9, 2027,
>   4:00 PM · Stillwater Garden Pavilion, Hood River, Oregon · program 4:00 / 5:00 / 6:30 PM (The maple lawn / The stone
>   terrace / The cedar pavilion) · Garden formal · RSVP son günü September 1, 2027 · yemek Vegetarian / Fish / Chicken · story
>   "A borrowed umbrella" / "Tea by the river" / "The promise". Geri sayım örneği 350 gün (2026-10-24'ten). Başlıklar temanın
>   `copy` metinlerinden: "Joined in gold" (`home_intro`), "Our Story", "Moments we hold dear", "The Day", "Kindly reply",
>   "Send reply". "THE SECOND FOLD" yalnız panodaki örnek üst satır (story intro'daki "every fold of our story"dan); `copy`'ye
>   eklenip eklenmeyeceğine entegratör karar verir.
> - Dosya adları bilerek PAKET 5R'den ve git geçmişindeki eski PAKET 5'ten (washi_indigo, rice_paper, obi_band, kintsugi_veins,
>   sumi_stroke, ink_bleed, gold_flake_1 …) farklı (`tato_*`, `clasp_*`, `ground_dipdye*`, `washi_*_tile`, `paper_card`,
>   `mat_*`, `join_tear`, `seam_*`, `plum_branch`, `icon_*`, `flake_gold`, `petal_plum`, `blossom_plum`): `gpt_is_listesi`
>   aynı yolda dosyadaki ilk prompt'u alır. Eski parçalar silinmez; tema yeniden kurulana kadar canlı site onları kullanıyor.
>   **`parts/ink_bloom.png` (PAKET 5R) yeniden istenmez:** görünmez CSS maskesi (foto mürekkep lekesiyle belirir) olarak yeni
>   temada da kalır.
> - Foto pencereleri yeşil değil, **şeffaf açıklık** (21/22 TESLİM dersi). Prompt'larda bilerek yeşil hex kodu yok
>   (`kit_check` yeşil pencere arardı). Pencere kenarı düz kesim değil, **lifli su yırtığı**: maske, kapalı kâğıt halkasının
>   içindeki alfa=0 bölgesinden çıkarılır (düzensiz kenar sorun değil; foto mat'ın altında durur).
> - Açılış nesnesi yine **kare tatō** (START HERE / panel adı `Origami` geçerli kalır). Paket tuvali 1024×1024, kare x/y %10–90;
>   `tato_closed` ana görseldir, dört kanat ve mizuhiki bandı onu **düzenleyerek** üretilir (aynı kare). **Taban ayrıca
>   istenmez:** `tato_open`'ın ortadaki kare tabanı (x/y %30–70) düz kat çizgilerinden kesilip paket karesine ölçeklenir; kanat
>   iç yüzleri de `tato_open`'dan menteşe çizgisinin dışında kalan üçgenler olarak kesilir (geometri aşağıda; 1254 px çıktıda
>   taban ≈500 px — 360–430 px telefonda ~%72 genişlikteki pakete 2× yeter). Hiza otomatik koşmaz; Claude `tema_build.hiza_olc`
>   ile ölçer, her katmanı kendi alfa kutusundan keser ve ölçülen kutusuyla yerleştirir (GPT kayması tema ölçüsüyle emilir).
> - Klips iki yarım porselendir (çift = iki yarım, altınla birleşmiş): `clasp_joined` kendi tuvalinde büyük çizilir,
>   `clasp_left` / `clasp_right` onu düzenleyerek; Claude pakette paket eninin ~%20'sine ölçekler. Baş harfler (`initials`
>   "N&K" → sol yarıda "N", sağ yarıda "K") canlı HTML, yalnız home tepeliğinde ve RSVP birleşmesinde (klips ≥ 96 px);
>   kapalı pakette harf yok.
> - Altın ışığı: Claude kanat/klips/mat görsellerindeki altın pikselleri renkle (`#C9A55A` ailesi) ayırıp maske yapar; ışık
>   süpürmesi yalnız damar üstünde koşar (çizim değil, maske). `seam_long` kaydırmayla yukarıdan aşağı maskeyle "akar".
> - İnce şeritler (ayırıcı, birleşim yırtığı, uzun damar) GPT'nin yerel tuvallerinde bant olarak istenir; Claude kırpar. Bütün
>   ölçüler GPT'nin yerel tuvalleri (1024×1024, 1024×1536, 1536×1024); pano ≈1908×824. `join_tear` bilerek sol ve sağ kenara
>   değer (yatay döşeme) → `kit_check` "kenarların yalnız %…'i şeffaf" uyarısı beklenir; yatay dikiş kalırsa Claude
>   ayna-döşeme / kenar geçişiyle giderir (piksel boyamadan).
> - Paylaşım (og) görseli istenmedi: Claude `ground_dipdye_wide` + `tato_closed` + `tato_band` + `clasp_joined`'dan kurar (eski
>   `web_hero` yerinde kalır). PAKET 6R baskı zeminleri ve PAKET 3/7 ilan sahneleri bu turda değişmez (yeni görünüme uyum
>   gerekirse ayrı paket).
> - Palet **değişmez** (`indigo-gold-rice`; G177 varyantları çivit ailesini `#242E58` çapasından boyar, altın sabit; yeni renk
>   ailesi eklenmedi). Parçalar gelince `variants/recolor.json` `parts` listesi yeni adlarla yeniden yazılır, çapalar gerçek
>   parçalarda ölçülür, `recolor_parts.py build/check --design 26` koşar.
> - Fontlar değişir (aşağıda; Allura + Shippori Mincho yerine Kalnia + Kolker Brush + Zen Old Mincho): `DESIGN_BRIEF.md`,
>   `platform/lib/marketing/designs.ts` (`fonts`), `platform/lib/print/layouts.ts` (`kintsugi-washi` bloğu),
>   `scripts/font-fallback.ts`, `kuru_sekil.json` ve `tests/theme-kintsugi-washi.test.ts` entegratörde / tema yeniden
>   kurulurken güncellenir. Kalnia ince ağırlıkta ≥ 28 px; Kolker Brush yalnız "&" ve 1–3 kelimelik vurgu, ≥ 36 px.
> - Ses dosyası yok: aşağıdaki ipuçlarını Claude `tools/audio_fx.py` ile sentezler (AGENTS şart 9); ilk dokunuştan önce sessiz.

### Sanat yönetimi — "Joined in Gold"

- **Signature.** Two lives, joined in gold. In kintsugi a broken bowl is mended with real gold and becomes more beautiful
  where it broke; here everything is hand-made paper and porcelain mended with gold, and **the couple is the clasp**: a round
  white porcelain clasp made of two halves joined by a gold seam. It closes a square indigo **tatō** — a four-flap pinwheel
  packet of hand-dyed washi crossed by gold kintsugi seams, tied with a band of fine gold-and-ivory **mizuhiki** paper cords.
  Tap: the two porcelain halves part, the band springs loose, the four flaps unfold one by one like a pinwheel onto a lining
  of gold-dusted rice paper (**sunago**), the deckled card rises — and the two halves fly back and **meet above the names
  with a flash of gold**: joined.
- **The gold seam is the site's only line.** Section joins are feathered indigo washi edges mended onto the next paper with a
  line of gold; dividers are seams with a tiny mended chip; the order of the day hangs on one long gold seam; every photo mat
  carries a tear mended in gold; on the story page one golden line draws itself down the page as you scroll; photos appear
  through a spreading bloom of sumi ink soaking into the paper.
- **Materials & light (photographed for real).** Hand-made kozo washi with long visible fibres and feathered deckle edges;
  indigo dye sitting deep and uneven in the fibres (dip-dyed sheets fading from indigo to rice-ivory); sunago (drifts of fine
  gold dust and square-cut gold leaf); raised gold lacquer; glazed warm-white porcelain; stiff glossy mizuhiki cords; sumi
  ink; one restrained branch of white plum. One soft north-window light from the upper left everywhere.
- **Colour (unchanged — the five colour variants recolour the indigo family).** indigo `#242E58` · night `#161C36` · inner
  indigo `#3C4874` · rice `#F3ECDC` · porcelain `#F7F3EA` · gold `#C9A55A` (light `#E3C987`, gold ink `#7A5C22`) · ink
  `#1D2340`. No other hue: no red, no pink.
- **Respect, not costume.** Washi, kintsugi, tatō folding, sunago and mizuhiki are crafts and are used as crafts. Never:
  kanji, kana or any lettering in images, fake "Asian" lettering, brush characters, seals or chops, ensō circles, temples,
  torii, Buddha, incense, singing bowls, geisha, kimono, fans, paper lanterns, pagodas, cherry blossom, cranes, koi, bamboo,
  Mount Fuji, waves, a rising sun. Not the other designs: oxblood velvet, roses, ripped paper strips, oval frames, Western
  envelopes and wax seals (21); the moon, night lakes, mountains (22); jewel boxes, pearls, gems, satin (23); theatres,
  curtains, playbills (24); trains, tickets, luggage, travel posters (25); doors, lanterns (27); stars, constellations (29);
  music box, mirror (32); red lacquer, paper-cut, Chinese motifs (34); Art Deco, Art Nouveau. 26's edges are the natural
  feathered deckle and soft water-torn edges of washi with long fibres, never ripped card.
- **Type (Google Fonts; no other design uses them — verified 2026-10-24, HTTP 200, latin + latin-ext).** *Kalnia* 300–500 —
  the names and big headings, countdown numerals (a contemporary high-contrast serif with sharp, flared, brush-cut wedge
  serifs; light weights ≥ 28 px); *Kolker Brush* — only the ampersand between the names and one- to three-word script accents,
  in gold, ≥ 36 px (a single fast dry-brush stroke, Latin, never "oriental" lettering); *Zen Old Mincho* 400/700 — body,
  captions and widely letter-spaced capitals for dates, labels and buttons (the refined old-style Latin of a Japanese mincho).
  Replaces Allura + Shippori Mincho.
- **Motion (Claude builds it; GPT designs for it).** Closed: light runs slowly along the gold seams of the flaps, the porcelain
  glints. Tap → the two clasp halves turn ±14° and part to the sides, lifting toward the guest → the mizuhiki band slackens and
  slides away → the flaps open north, east, south, west, 220 ms apart, each in 3D on its own hinge (indigo outside → at 90°
  the gold-dusted inside), a light sweep catching its gold seam as it passes → the open pinwheel settles and the stage eases
  back → the card rises from the floor toward the guest, gold leaf and plum petals drift → the two halves glide back in and
  meet above the names, the seam flashes → home. Home: the card on the open pinwheel; feathered indigo joins; photos bloom out
  of sumi ink; story: the golden line draws itself and each moment's mat is laid down from its side; details: each row lights
  as the seam reaches it; RSVP: on send the halves meet over the card and gold leaf falls.
- **Sound (Claude synthesises them, `tools/audio_fx.py`; silent until the first tap).** (1) clasp: a small bright
  glazed-porcelain tick, then the two halves gliding apart, ceramic on ceramic, with a faint ring; (2) band: stiff paper cords
  springing loose — a dry springy flick and a soft paper slither; (3) flaps: four soft, fibrous washi folds opening one after
  another, each a low paper breath with a few fibre crackles, each a little higher; (4) card: a hushed lift of air with a
  whisper of gold leaf; (5) joined in gold: the two porcelain halves meeting — a soft, clear porcelain "kiss" with a warm low
  resonance blooming over ~1.2 s; (6) RSVP sent: the same porcelain kiss, smaller, and a light flutter of gold leaf. No gongs,
  temple or singing bowls, wind chimes, koto or shakuhachi.

**Instructions for GPT (send before the first image):**
```
You are the art director and still-life photographer of a luxury wedding stationery house, designing the mobile wedding website "Kintsugi & Washi" from scratch. Its signature, "Joined in Gold": two lives joined in gold, as in kintsugi, where a broken bowl is mended with real gold and becomes more beautiful where it broke. The couple is a round white porcelain clasp made of two halves joined by a gold seam; it closes a square tatō — a four-flap pinwheel packet of hand-dyed indigo washi crossed by gold kintsugi seams and tied with a band of fine gold-and-ivory mizuhiki paper cords. When the guest taps, the two porcelain halves part, the band springs loose, the four flaps unfold one by one onto a lining of gold-dusted rice paper, the card rises, and the two halves meet again above the names. Every line in the website is a real gold-lacquer kintsugi seam. Materials, photographed for real: hand-made kozo washi with long visible fibres and feathered deckle edges; indigo dye sitting deep and uneven in the fibres (indigo #242E58, night #161C36, inner indigo #3C4874); undyed rice-ivory washi (#F3ECDC); sunago — drifts of fine gold dust and small square-cut flakes of gold leaf; raised real gold lacquer (#C9A55A, highlights #E3C987, dark-gold edges #7A5C22); glazed warm-white porcelain (#F7F3EA); sumi ink (#1D2340); one restrained branch of white plum blossom. No other colour: no red, no pink. Washi, kintsugi, tatō folding, sunago and mizuhiki are respected crafts, never a costume: never kanji, kana or any lettering, fake Asian lettering, brush characters, seals, ensō circles, temples, torii, Buddha, incense, geisha, kimono, fans, paper lanterns, pagodas, cherry blossom, cranes, koi, bamboo, Mount Fuji, waves or a rising sun. Also never: velvet, roses, ripped paper strips, oval frames, Western envelopes or wax seals, the moon, night lakes, mountains, jewels, pearls, satin, theatres or curtains, trains or tickets, doors, lanterns, stars, Art Deco or Art Nouveau. Everything must look made by hand and photographed for real: rich, calm, romantic, classic, magazine-quality luxury; never clip-art, never flat vector, never watercolour clip-art, never a souvenir-shop look. One soft north-window light from the upper left in every image. It must not resemble any real brand, artist, maker or another seller's design. First you draw a design board of five phone screens (W1); then, giving that board as the reference image of every image, you make the production parts (W2): one object per image, no cast or drop shadow, no glow or halo outside the object, no text, letters, numbers, monograms, logos or watermarks. A transparent background must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard), and the object must stay at least 5% inside every edge unless its prompt says otherwise.
```

#### W1 — Tasarım panosu (5 telefon ekranı; demo metin serbest, YALNIZ referans)
Kaydet (W1): `collections/26_Kintsugi_Washi/assets/gpt/mockups/design-board.png` · yaklaşık 1908×824 (≈2,3:1; araç vermiyorsa 1536×1024, beş ekran tek sırada) · opak · kit_check dışı

```
Use case: ui-mockup. Create a high-fidelity art direction board of FIVE mobile wedding website screens for a new luxury design called "Kintsugi & Washi", each screen in a 390 by 844 proportion, arranged side by side in one row with generous, even gaps on a soft warm ivory-grey studio background (the whole board about 2.3:1). The attached photographs (hero_portrait.jpg, story_2.jpg and venue.jpg) are ONLY the identity and styling reference for the fictional couple (she: shoulder-length wavy dark-brown hair, warm light-brown skin, an ivory silk slip gown; he: short dark hair, a neat short beard, light skin, a deep indigo suit) and for the venue (a cedar garden pavilion by a still pond in autumn); everything else is new. The five screens must look like one finished, coherent, best-selling premium product made by a top luxury stationery designer: rich, tactile, romantic, calm, classic and bold; never minimal, never flat vector, never clip-art.

THE CONCEPT — "Joined in Gold": two lives joined in gold, as in kintsugi. Everything is hand-made paper and porcelain, photographed for real and mended with real raised gold lacquer: kozo washi with long visible fibres and feathered deckle edges, indigo dye sitting deep and uneven in the fibres (#242E58, #161C36, #3C4874), undyed rice-ivory washi (#F3ECDC), sunago (drifts of fine gold dust and small square-cut gold leaf), gold lacquer seams (#C9A55A, highlights #E3C987), glazed warm-white porcelain (#F7F3EA), sumi ink, one slender branch of white plum blossom. The couple is a round porcelain clasp made of TWO HALVES joined down the middle by a gold seam. Every line on the site is a gold kintsugi seam: sections meet along feathered indigo washi edges mended onto the next paper with a line of gold. NO kanji, kana or any non-English lettering, no seals, no ensō, no temples, no geisha, kimono, fans, lanterns, pagodas, cherry blossom, cranes, koi, bamboo or waves; no red, no pink; no Western envelope, no wax seal, no velvet, no roses, no oval frames, no moon, no stars, no jewels, no theatre, no tickets.

TYPOGRAPHY: the couple's names and the big headings in a contemporary high-contrast serif with sharp, flared, brush-cut wedge serifs, light weight, large and elegant; the ampersand alone written as one fast dry-brush stroke in gold; dates, labels and buttons in widely letter-spaced refined capitals; body text in a refined old-style book serif with a calm italic. Ivory and gold type on indigo; indigo-black ink type on rice paper.

Screen 1 — the opening (the closed packet): full-bleed, one large sheet of hand-made washi, dip-dyed: deep indigo at the top and at the bottom, fading through cloudy, mottled indigo into a luminous rice-ivory band across the middle, long pale fibres visible everywhere, soft drifts of gold dust along the two fades, and one long gold kintsugi seam crossing the lower part of the sheet from edge to edge like a mended tear. At the top, on the indigo, tiny spaced ivory capitals "TOGETHER WITH THEIR FAMILIES", the names large on two lines "Naomi" and "& Kai" in ivory with the ampersand in gold brush, and "SATURDAY · OCTOBER 9, 2027 · HOOD RIVER" in small spaced capitals. In the middle, on the pale band, the CLOSED square tatō, seen perfectly straight from above, about 72% of the screen width: four triangular flaps of deep indigo washi folded in a pinwheel, each flap's point lying a little past the centre, turned clockwise; feathered deckle free edges, crisp folds along the four sides; gold kintsugi seams running across the flaps and meeting from flap to flap like one mended crack; a horizontal band of five fine, stiff, glossy mizuhiki paper cords (gold and ivory) wraps the packet across its middle; at the very centre the round porcelain clasp, about a fifth of the packet's width, its two halves joined by a vertical gold seam. A slender branch of white plum blossom reaches in from the left edge just below the packet. At the bottom, on the indigo, "TAP TO OPEN" in tiny spaced ivory capitals; a tiny outlined "Skip" pill in the top right corner.

Screen 2 — home: the same dip-dyed sheet behind the top 55% of the screen; on it the tatō lies fully OPEN and flat, seen straight from above: its four indigo flaps folded back outward into a four-pointed pinwheel star, showing their insides — rice-ivory washi lined with drifts of gold dust and square-cut gold leaf, the gold seams showing through faintly. On the open packet lies a thick deckled rice-white card with a lightly gilded deckle edge; at its top the porcelain clasp, its two halves now JOINED, a small gold letter "N" on the left half and "K" on the right half; under it "Naomi & Kai" in the light serif with the gold brush ampersand, "SATURDAY, OCTOBER 9, 2027 · 4:00 PM" and "STILLWATER GARDEN PAVILION · HOOD RIVER, OREGON" in small spaced capitals. Below, the pale paper meets a deep indigo washi section along a feathered deckle edge mended onto it with a line of gold (the signature join). Overlapping that join on the right side, the couple's portrait (from the attached hero_portrait.jpg) in a layered washi mat — an outer rice-ivory sheet with deckle edges, an inner sheet of indigo washi with a feathered water-torn opening — with a small tear across one corner of the mat mended with gold. On the indigo at the left: tiny gold capitals "JOINED IN GOLD", the italic line "Naomi Ellis Hart & Kai Matthew Arden request the pleasure of your company at the celebration of their marriage" in ivory, a countdown of four plain numerals in the light serif with tiny spaced labels "350 DAYS · 04 HOURS · 12 MINUTES · 36 SECONDS" separated by short vertical gold seams (no boxes, no tiles), and a gold-leaf pill button "Kindly reply" with indigo text.

Screen 3 — story: a deep indigo washi page with long pale fibres. At the top tiny gold capitals "MOMENTS WE HOLD DEAR" and the heading "Our Story" in ivory. Down the left side one long gold kintsugi seam runs the whole height of the screen, branching toward each moment (the golden line). In the middle the couple's landscape photograph (from the attached story_2.jpg) in a layered washi mat (outer rice-ivory deckled sheet, inner indigo sheet with a feathered water-torn opening, a gold-mended tear at one corner), the photograph caught in the middle of appearing: its lower-left part still blooming out of a spreading cloud of black sumi ink soaking into the paper. Beside it tiny gold capitals "THE SECOND FOLD" and the italic caption "Tea by the river"; below, the top of the next, upright mat peeks in from the right; a small "02 / 03" with two fine arrow buttons; two or three flakes of gold leaf and one white plum petal drifting.

Screen 4 — details: a rice-ivory washi page with long silky fibres. The heading "The Day" in the light serif in indigo-black, "SATURDAY, OCTOBER 9, 2027" in spaced capitals, a fine horizontal gold seam divider with a tiny mended gold chip at its centre. The order of the day hangs on one vertical gold kintsugi seam running down the left third: three rows, each with a small icon brushed in sumi ink with one touch of gold leaf (two interlocked rings · two coupes touching · a plate with knife and fork) sitting on the seam, the time in spaced capitals, the event in the light serif and the place in italic: "4:00 PM · Ceremony · The maple lawn", "5:00 PM · Cocktail hour · The stone terrace", "6:30 PM · Dinner & dancing · The cedar pavilion"; then a brushed bow-tie icon with "DRESS CODE · Garden formal". Below, the venue photograph (from the attached venue.jpg) in a wide layered washi mat with a gold-mended corner, "STILLWATER GARDEN PAVILION · HOOD RIVER, OREGON" and a thin gold outlined button "View map".

Screen 5 — RSVP: the dip-dyed indigo sheet, its pale band low and soft. A tall, thick rice-white stationery card with feathered, lightly gilded deckle edges fills most of the screen, a drift of gold dust and square-cut gold leaf across its top right corner and a small tear at its lower left mended with gold: the heading "Kindly reply" in the light serif, the italic line "by September 1, 2027", then a real, readable form in indigo-black ink: "Your name" on a fine gold underline, "Will you attend?" with two round options "Yes, we'll be there!" and "Sadly, we can't make it", "Number of guests" as a select showing "2", "Your meal preference" as a select showing "Fish", and a full-width indigo pill button "Send reply" with ivory text. Just above the card's top edge the two porcelain clasp halves float a finger's width apart, about to meet, gold glinting on their edges. A slender white plum branch at the lower right; a few flakes of gold leaf.

All five screens share one world (the same indigo washi, rice paper, gold seams, porcelain and light) but each has its own composition — not all centred. Use exactly this English sample text and no other words. Photos show the fictional adult couple only, natural and tasteful, not resembling any real or famous person. No device frames or bezels, no hands, no laptop, no marketing collage, no logos, no watermarks, no captions outside the screens. This is a design reference board, not a final website.
```
Kontrol: 5 ekran yan yana, her biri ~390:844; 1. ekranda uçları çivit, ortası pirinç fildişi daldırma boyalı washi zemin,
ortada kapalı kare tatō (dört kanat fırıldak, altın damarlar), mizuhiki bandı ve iki yarımlı porselen klips; 2. ekranda açık
fırıldak yıldız + altın tozlu iç yüzler + kart + birleşik klips (N | K), lifli çivit kenarın altınla birleştiği bölüm geçişi,
katmanlı washi mat; 3. ekranda boyunca uzanan altın çizgi ve sumi mürekkebinden beliren fotoğraf; 4. ekranda dikey altın damar
üstünde fırça ikonlu program + mekân mat'ı; 5. ekranda okunur form + birleşmek üzere iki porselen yarım; kanji/kana/mühür/
kiraz/kırmızı/yelpaze/fener/zarf yok. Başlık harfi keskin uçlu, ince, yüksek kontrastlı çağdaş serif; "&" altın fırça.
Metindeki küçük harf bozuklukları kabul (yalnız referans). Beğenilmezse yeniden üret (en çok 3 deneme); W2 bu panodan türer.
Kullanım: Claude'un yerleşim, tipografi ölçeği ve renk referansı; paketin ekran genişliğine oranı, açık yıldızın home'daki yeri,
klipsin kart üstündeki boyu, birleşim yırtığının konumu buradan ölçülür.

### W2 — Parçalar (panodan türer; HER parçada `design-board.png` referans görsel; YAZI YOK)

Ortak kurallar: tek görselde tek nesne · şeffaflar gerçek alfa · zemine düşen gölge yok · nesnenin dışında ışıma/hâle/ışın yok
(altın parıltısı, ışık süpürmesi, porselen parıltısı site CSS'i) · ışık sol üstten (kuzey penceresi) · oran önemli, piksel
değil · lif, damar dalı, altın pul, kordon, çiçek **sayısı** önemli değil, sayı için yeniden üretme · hiçbir W2 görselinde harf,
rakam, kanji/kana ya da yazıya benzeyen fırça izi yok.

**Paket tuvali (W2.1–W2.6, hepsi 1024×1024, aynı konum):** paket karesi x %10–90 · y %10–90. Kanatlar (tuval %): **K** menteşe
üst kenar (10,10)–(90,10), uç (57,57) · **D** menteşe sağ kenar (90,10)–(90,90), uç (43,57) · **G** menteşe alt kenar
(90,90)–(10,90), uç (43,43) · **B** menteşe sol kenar (10,90)–(10,10), uç (57,43) — uçlar merkezin ~%9 ötesinde, saat yönünde
fırıldak. Üst üste sıra (üstten): K, D, G, B (açılış sırası da bu). Mizuhiki bandı y %47–53, x %9–91. Klips ayrı tuvalde
(W2.8–W2.10), pakette merkez (50,50), çapı paket eninin ~%20'si. Önce W2.1; W2.2–W2.6'yı **W2.1'i düzenleyerek** (image edit)
üret; araç düzenleyemiyorsa referans ver ve kareyi aynı piksellerde tut.
**Açık paket (W2.7, ayrı 1024×1024 tuval):** taban x/y %30–70; dışa yatık kanat uçları K (53,5; 6,5) · D (93,5; 53,5) · G (46,5;
93,5) · B (6,5; 46,5) (kapalı geometrinin menteşe üzerinden aynası). Claude tabanı ve dört iç yüzü bu görselden keser.

#### W2.1 Kapalı tatō — ana görsel (kordonsuz, klipssiz)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/tato_closed.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), matching the closed packet on screen 1 of the attached design board, but WITHOUT the cord band and WITHOUT the porcelain clasp (those are separate images). ONE closed square tatō packet, alone, seen perfectly straight from above, no perspective, no tilt. Placement on the square canvas, exactly: its outer square spans from 10% to 90% of the image width and from 10% to 90% of the image height. It is folded from hand-made kozo washi dyed deep indigo (#242E58), the dye sitting deep and uneven in the long fibres — darker toward the folds (#161C36), lighter and softly mottled toward the points (#3C4874) — with long pale fibres visible in the dye. Four triangular flaps in a pinwheel: each flap is hinged along one full side of the square with a crisp fold that shows a thin rounded paper thickness, and its two free edges are feathered deckle edges with fine fibres (never ripped, never straight-cut); each flap's point lies a little past the centre, turned clockwise. Exactly, in percent of the image: the NORTH flap is hinged along the top side from (10, 10) to (90, 10) with its point at (57, 57); the EAST flap along the right side from (90, 10) to (90, 90) with its point at (43, 57); the SOUTH flap along the bottom side from (90, 90) to (10, 90) with its point at (43, 43); the WEST flap along the left side from (10, 90) to (10, 10) with its point at (57, 43). The north flap lies on top, then the east, then the south, the west lowest; together they cover the square completely, the four points forming a small pinwheel swirl at the centre. Across the flaps run real raised gold-lacquer kintsugi seams (#C9A55A, highlights #E3C987, fine dark-gold edges #7A5C22): each flap carries its own one or two seams, slightly irregular and branching into fine hairlines, reaching its free edges so that, closed, the seams seem to continue from flap to flap like one mended crack converging toward the centre. Each free edge reads clearly against the flap beneath it (a fine paper edge and a whisper of contact shade on the paper itself). Nothing on the packet: no cord, no clasp, no button, no flower. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow or halo outside the packet. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: kare x/y %10–90 (±%2); dört üçgen kanat fırıldak düzeninde, uçlar merkezin biraz ötesinde saat yönünde; menteşeler keskin katlama, serbest kenarlar lifli deckle (yırtık karton değil); her kanatta kenara ulaşan altın damar; kordon/klips/çiçek yok; gerçek alfa.
Kullanım: index'teki kapalı paket (kapalıyken tek katman; dokununca kanat katmanları devralır); og görselinin ana nesnesi; altın piksellerinden ışık süpürmesi maskesi.

#### W2.2 Kuzey kanat (dış yüz; aynı tuval)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/tato_flap_n.png` · 1024×1024 · **Şeffaf zemin**

```
Only the NORTH flap of the same packet as the attached tato_closed.png, alone (give tato_closed.png and design-board.png as the reference images, and edit tato_closed.png if the tool allows: remove the other three flaps and keep only the north flap), on the same 1024×1024 canvas, at the same scale and in exactly the same place, seen perfectly straight from above. One triangle of the same indigo-dyed kozo washi with exactly the same dye, fibres and gold kintsugi seams it has on tato_closed.png: its hinge along the top side from (10%, 10%) to (90%, 10%) of the image is a crisp fold, and its two feathered deckle free edges run down to its point at (57%, 57%). Draw it complete. Everything else on the canvas is fully transparent: no other flap, no floor, no cord, no clasp. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow or halo outside the flap. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tato_closed.png'nin üstüne %50 saydam konunca menteşe ve iki serbest kenar çakışıyor (gözle kayma yok); köşeler (10,10), (90,10), (57,57); damarlar aynı; tek kanat; gerçek alfa.
Kullanım: en üst kanat; açılışta ilk (900 ms), üst menteşesinde 3B `rotateX 0→-180°`; 90°'de `tato_open`'dan kesilen kuzey iç yüzü devralır; damarında ışık süpürmesi.

#### W2.3 Doğu kanat (dış yüz; aynı tuval)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/tato_flap_e.png` · 1024×1024 · **Şeffaf zemin**

```
Only the EAST flap of the same packet as the attached tato_closed.png, alone (give tato_closed.png and design-board.png as the reference images, and edit tato_closed.png if the tool allows: remove the other three flaps and keep only the east flap), on the same 1024×1024 canvas, at the same scale and in exactly the same place, seen perfectly straight from above. One triangle of the same indigo-dyed kozo washi with the same dye, fibres and gold kintsugi seams as on tato_closed.png: its hinge along the right side from (90%, 10%) to (90%, 90%) of the image is a crisp fold, and its two feathered deckle free edges run to its point at (43%, 57%). Draw it complete, including the part that was hidden under the north flap, continuing its dye and its gold seam naturally. Everything else on the canvas is fully transparent: no other flap, no floor, no cord, no clasp. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow or halo outside the flap. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tato_closed üstünde menteşe ve görünen kenar çakışıyor; köşeler (90,10), (90,90), (43,57); gizli kısmı tamamlanmış; gerçek alfa.
Kullanım: K'nın altında; açılışta ikinci (1120 ms), sağ menteşesinde 3B; arka yüzü `tato_open`'ın doğu iç yüzü.

#### W2.4 Güney kanat (dış yüz; aynı tuval)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/tato_flap_s.png` · 1024×1024 · **Şeffaf zemin**

```
Only the SOUTH flap of the same packet as the attached tato_closed.png, alone (give tato_closed.png and design-board.png as the reference images, and edit tato_closed.png if the tool allows: remove the other three flaps and keep only the south flap), on the same 1024×1024 canvas, at the same scale and in exactly the same place, seen perfectly straight from above. One triangle of the same indigo-dyed kozo washi with the same dye, fibres and gold kintsugi seams as on tato_closed.png: its hinge along the bottom side from (90%, 90%) to (10%, 90%) of the image is a crisp fold, and its two feathered deckle free edges rise to its point at (43%, 43%). Draw it complete, including the parts that were hidden under the flaps above it, continuing its dye and its gold seam naturally. Everything else on the canvas is fully transparent: no other flap, no floor, no cord, no clasp. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow or halo outside the flap. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tato_closed üstünde menteşe ve görünen kenar çakışıyor; köşeler (90,90), (10,90), (43,43); gizli kısmı tamamlanmış; gerçek alfa.
Kullanım: D'nin altında; açılışta üçüncü (1340 ms), alt menteşesinde 3B; arka yüzü `tato_open`'ın güney iç yüzü.

#### W2.5 Batı kanat (dış yüz; aynı tuval)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/tato_flap_w.png` · 1024×1024 · **Şeffaf zemin**

```
Only the WEST flap of the same packet as the attached tato_closed.png, alone (give tato_closed.png and design-board.png as the reference images, and edit tato_closed.png if the tool allows: remove the other three flaps and keep only the west flap), on the same 1024×1024 canvas, at the same scale and in exactly the same place, seen perfectly straight from above. One triangle of the same indigo-dyed kozo washi with the same dye, fibres and gold kintsugi seams as on tato_closed.png: its hinge along the left side from (10%, 90%) to (10%, 10%) of the image is a crisp fold, and its two feathered deckle free edges run to its point at (57%, 43%). Draw it complete, including the parts that were hidden under the flaps above it, continuing its dye and its gold seam naturally. Everything else on the canvas is fully transparent: no other flap, no floor, no cord, no clasp. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow or halo outside the flap. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tato_closed üstünde menteşe ve görünen kenar çakışıyor; köşeler (10,90), (10,10), (57,43); dört kanat üst üste konunca kareyi boşluksuz örtüyor; gerçek alfa.
Kullanım: en alttaki kanat (kartın hemen üstü); açılışta dördüncü (1560 ms), sol menteşesinde 3B; arka yüzü `tato_open`'ın batı iç yüzü.

#### W2.6 Mizuhiki bandı (kapanış; aynı tuval)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/tato_band.png` · 1024×1024 · **Şeffaf zemin**

```
Only the band that ties the packet, alone, drawn exactly where it lies across the attached tato_closed.png (give tato_closed.png and design-board.png as the reference images, and edit tato_closed.png if the tool allows: remove the packet and keep only the band) — the same 1024×1024 canvas, the same scale and the same straight top view. A flat band of FIVE fine, stiff, glossy mizuhiki cords (tightly twisted washi-paper cords with a soft lacquered sheen) lying side by side and touching, alternating gold (#C9A55A, highlights #E3C987) and pearl-ivory (#F3ECDC): gold, ivory, gold, ivory, gold. It runs perfectly horizontally across the packet from 9% to 91% of the image width, between 47% and 53% of the image height; at both ends the cords turn away in a short rounded bend, as if they wrap round the packet's left and right edges and continue behind it. The band is straight and continuous through the centre (the clasp will sit on top of it). No knot, no bow, no loop, no tassel, no clasp, no packet. Everything else is fully transparent. One soft north-window light from the upper left; a hair-fine contact shade on the cords themselves only. No cast shadow or drop shadow, no glow or halo outside the cords. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: beş ince kordon (altın/fildişi dönüşümlü) yatay, y %47–53, x %9–91, uçlar yuvarlak dönüşle arkaya gidiyor; düğüm/fiyonk/ilmek yok; paket çizilmemiş; tato_closed üstünde ortada; gerçek alfa.
Kullanım: kanatların üstünde, klipsin altında; klips yarımları ayrılınca gevşer (`scaleX` .98, +%3 aşağı), sağa-aşağı kayıp söner.

#### W2.7 Açık tatō — fırıldak yıldız, altın tozlu iç yüzler (ayrı tuval)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/tato_open.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png and tato_closed.png as the reference images), matching the open packet on screen 2 of the attached design board, but WITHOUT the card and without the clasp. The SAME packet as tato_closed.png, now completely opened and lying flat, alone, seen perfectly straight from above on a 1024×1024 canvas. In the middle lies the square floor of the packet, from 30% to 70% of the image width and from 30% to 70% of the image height, with four crisp fold creases along its four sides (the hinges). The four flaps are folded fully back and lie flat outward, each now showing its INSIDE: the north flap above the floor (hinged along the floor's top side, its point at 53.5% of the width and 6.5% of the height), the east flap to the right (hinged along the floor's right side, its point at 93.5% and 53.5%), the south flap below (hinged along the floor's bottom side, its point at 46.5% and 93.5%), the west flap to the left (hinged along the floor's left side, its point at 6.5% and 46.5%) — together a four-pointed pinwheel star. The floor and all four insides are lined with undyed rice-ivory washi (#F3ECDC, long soft fibres) decorated in the sunago way: soft drifting clouds of fine gold dust and small square-cut flakes of real gold leaf (#C9A55A, #E3C987), densest toward the four outer points and along the folds, thinning to clean, calm ivory over the middle of the floor (a card will lie there). Along the feathered deckle edges of the flaps a thin rim of the indigo outside shows, and the gold kintsugi seams of the outside show through the lining as paler, slightly sunken gold lines. One soft north-window light from the upper left. No card, no cord, no clasp, no flower. No cast shadow or drop shadow, no glow or halo outside the paper. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: taban karesi x/y ~%30–70 (±%3), dört kat çizgisi net; dört kanat dışa yatık, uçlar ~(53,5; 6,5), (93,5; 53,5), (46,5; 93,5), (6,5; 46,5) — fırıldak; iç yüzler altın tozlu (sunago) pirinç kâğıdı, kenarda ince çivit, soluk damar; tabanın ortası sakin; kart/kordon/klips yok; kenara değmiyor; gerçek alfa.
Kullanım: Claude tabanı (x/y %30–70) ve dört iç yüzü (menteşe dışındaki üçgenler) keser, paket karesine ölçekler; açılışın son karesi ve home hero'nun tabanı (kart ortasında, isimler kartta HTML).

#### W2.8 Porselen klips — birleşik (iki yarım, altın dikiş)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/clasp_joined.png` · 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), matching the porcelain clasp at the centre of the packet on screen 1 and at the top of the card on screen 2 of the attached design board, but without any letters. ONE round porcelain clasp, alone, seen perfectly straight from the front, centred: a gently domed disc spanning from 14% to 86% of the image width and of the image height, of glazed warm-white porcelain (#F7F3EA) with a soft glassy sheen, a slightly thicker rounded rim and the faintest pale-indigo crackle in the glaze near the rim. It is made of TWO HALVES — a left half and a right half — joined in the kintsugi way by one vertical seam of raised real gold lacquer (#C9A55A, highlights #E3C987, fine dark-gold edges #7A5C22) that runs from the top of the rim to the bottom of the rim, wandering only slightly and staying between 47% and 53% of the image width, with one or two hair-fine gold branches reaching a little way into each half. Both halves are otherwise plain, smooth porcelain (letters are added later as live text). No holes, no shank, no cord, no pattern, no flower, no character. One soft north-window light from the upper left with a clean soft highlight on the dome. No cast shadow or drop shadow, no glow or halo outside the disc. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek yuvarlak, kubbeli, sırlı beyaz porselen disk (x/y %14–86); ortada yukarıdan aşağı tek dikey altın dikiş (x %47–53), iki yarım net; yarımların yüzü boş; delik/desen/harf yok; gerçek alfa.
Kullanım: kapalı paketin merkezi (paket eninin ~%20'si); açılış sonunda birleşme anı, home tepeliği (baş harfler HTML), RSVP gönderimi, teşekkür modu, favicon; dikişte ışık süpürmesi.

#### W2.9 Porselen klips — sol yarım (W2.8'i düzenleyerek; aynı tuval)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/clasp_left.png` · 1024×1024 · **Şeffaf zemin**

```
Only the LEFT half of the porcelain clasp of the attached clasp_joined.png, alone (give clasp_joined.png and design-board.png as the reference images, and edit clasp_joined.png if the tool allows: remove the right half), on the same 1024×1024 canvas, at the same scale and in exactly the same place, seen straight from the front. Everything to the right of the gold seam is fully transparent. The left half keeps its own gilded break edge: the gold lacquer of the seam stays along its edge as a fine raised gold rim, with a thin sliver of the porcelain's thickness showing along the break, so the half looks complete and beautiful on its own. The same glaze, sheen, rim and crackle as clasp_joined.png. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow or halo outside the porcelain. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: clasp_joined.png'nin üstüne %50 saydam konunca sol yarımın dış kenarı çakışıyor; kırık kenarı altın; sağ yarım yok; gerçek alfa.
Kullanım: açılışta −14° dönüp sola ayrılır, yükselir; sonunda geri gelip sağ yarımla birleşir (porselen "öpücük" sesi + dikişte parıltı); RSVP'de aynı.

#### W2.10 Porselen klips — sağ yarım (W2.8'i düzenleyerek; aynı tuval)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/clasp_right.png` · 1024×1024 · **Şeffaf zemin**

```
Only the RIGHT half of the porcelain clasp of the attached clasp_joined.png, alone (give clasp_joined.png and design-board.png as the reference images, and edit clasp_joined.png if the tool allows: remove the left half), on the same 1024×1024 canvas, at the same scale and in exactly the same place, seen straight from the front. Everything to the left of the gold seam is fully transparent. The right half keeps its own gilded break edge: the gold lacquer of the seam stays along its edge as a fine raised gold rim, with a thin sliver of the porcelain's thickness showing along the break, so the half looks complete and beautiful on its own. The same glaze, sheen, rim and crackle as clasp_joined.png; the light still falls from the upper left (not mirrored). No cast shadow or drop shadow, no glow or halo outside the porcelain. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: clasp_joined üstünde sağ yarımın dış kenarı çakışıyor; kırık kenarı altın; sol yarım yok; ışık yine sol üstten; gerçek alfa.
Kullanım: sol yarımla aynı, +14° ve sağa.

#### W2.11 Daldırma boyalı washi — telefon zemini
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/ground_dipdye.png` · 1024×1536 · opak

```
Production background for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), the dip-dyed sheet behind screens 1, 2 and 5 of the attached design board. A full-frame vertical (2:3) photograph, edge to edge, of one large sheet of hand-made kozo washi lying perfectly flat, seen straight from above and filling the whole frame. It has been dip-dyed in indigo from both ends: deep indigo (#161C36 to #242E58) over the top 22% and the bottom 18% of the frame, fading through cloudy, mottled indigo (#3C4874) with soft natural tide-lines where the dye crept up the fibres, into a luminous, calm rice-ivory (#F3ECDC) band across the middle from about 34% to 68% of the height. Long pale kozo fibres drift through the whole sheet (white in the indigo, faint in the ivory); soft drifts of fine gold dust and a few square-cut flakes of gold leaf (sunago) lie along the two fades. One long real gold-lacquer kintsugi seam (#C9A55A, highlights #E3C987) crosses the sheet like a mended tear, from the left edge at about 76% of the height to the right edge at about 86%, wandering gently, with a few hair-fine branches. The middle band is calm and even (a packet sits there); the indigo top and bottom are calm enough for small ivory text. Keep every important detail within the middle 85% of the width. Even, soft north-window light from the upper left; no vignette, no fold, no crease, no hotspot, no objects, no flowers. No text, letters, numbers, kanji, kana, logos or watermarks.
```
Kontrol: tam opak; üst ~%22 ve alt ~%18 koyu çivit, orta %34–68 sakin pirinç fildişi; geçişlerde altın toz; altta kenardan kenara tek altın damar; nesne/yazı yok.
Kullanım: index (paket orta bantta), home hero ve RSVP zemini (`cover`, 700 px altı); açılışta orta bant hafifçe aydınlanır (CSS).

#### W2.12 Daldırma boyalı washi — geniş ekran
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/ground_dipdye_wide.png` · 1536×1024 · opak

```
The same dip-dyed washi sheet as ground_dipdye.png (give ground_dipdye.png and design-board.png as the reference images), now a full-frame horizontal (3:2) photograph, edge to edge, seen straight from above: deep indigo over the top 20% and the bottom 16% of the frame, fading through cloudy, mottled indigo with soft tide-lines into the same calm rice-ivory band from about 32% to 70% of the height; the same long pale fibres, the same drifts of gold dust and square-cut gold leaf along the fades, and one long gold kintsugi seam crossing from the left edge at about 78% of the height to the right edge at about 84%. The middle half of the width is calm. Same colours and light. No objects, no flowers, no text, letters, numbers, kanji, kana, logos or watermarks.
```
Kontrol: ground_dipdye ile aynı kâğıt, boya ve ışık; orta yarı sakin; opak.
Kullanım: 700 px ve üstü ekranlarda ground_dipdye'nin yerine (index, home hero, RSVP); og görselinin zemini.

#### W2.13 Çivit washi — dikişsiz doku
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/washi_indigo_tile.png` · 1024×1024 · opak, dikişsiz

```
Production texture for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), the indigo washi of the story page of the attached design board. A seamless, tileable square texture of hand-made kozo washi dyed deep indigo, seen perfectly flat and straight on: the dye sitting deep and slightly uneven in the sheet (#242E58, gently mottled between #1E2650 and #2B3563), long pale fibres drifting in random directions, a faint cloudy formation, no more than five tiny flecks of gold leaf over the whole square. Very low contrast, calm enough for small ivory text everywhere. Perfectly even lighting: no vignette, no gradient, no hotspot, no fold, no crease, no stain, no deckle edge, no pattern, so that four copies placed side by side join invisibly (the left edge continues the right edge, the top edge continues the bottom edge). No objects, no text, letters, numbers, kanji, kana, logos or watermarks.
```
Kontrol: düşük kontrast çivit, uzun soluk lifler, altın pul çok seyrek; eşit ışık; 2×2 dizince dikiş görünmüyor (Claude dizip bakar; küçük dikişi ofsetle kendisi giderir — yalnız bunun için yeniden üretme); opak.
Kullanım: story sayfası, home'daki çivit bölümler, alt bilgi (`background-repeat`).

#### W2.14 Pirinç fildişi washi — dikişsiz doku
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/washi_rice_tile.png` · 1024×1024 · opak, dikişsiz

```
Production texture for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), the rice-ivory washi of the details page of the attached design board. A seamless, tileable square texture of hand-made undyed kozo washi in warm rice ivory (#F3ECDC), seen perfectly flat and straight on: long, silky fibres drifting in random directions within the sheet, a gentle cloudy formation, a faint soft tooth, no more than five tiny flecks of gold leaf over the whole square. Very low contrast, calm enough for small dark ink text everywhere. Perfectly even lighting: no vignette, no gradient, no hotspot, no fold, no crease, no stain, no deckle edge, no indigo, no pattern; four copies placed side by side join invisibly. No objects, no text, letters, numbers, kanji, kana, logos or watermarks.
```
Kontrol: sıcak pirinç fildişi, uzun ipeksi lifler, altın pul çok seyrek; çivit yok; 2×2 dikişsiz; opak.
Kullanım: details, G138 blokları (travel, dress code, registry, SSS, menü) ve home'daki açık bantlar (`background-repeat`).

#### W2.15 Kalın deckle kart (3 dilim: üst süs · tekrarlanan orta · alt süs)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/paper_card.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), matching the tall stationery card of screen 5 and the card on the open packet of screen 2 of the attached design board. ONE tall card, alone, portrait, seen perfectly straight from the front, spanning from 8% to 92% of the image width and from 5% to 95% of the image height: thick hand-made rice-white washi card stock (#F6F0E3) with a fine soft tooth and faint short fibres, its edges feathered deckle edges with the very edge lightly gilded with gold leaf that catches the light here and there. It is designed so the website can cut it into three horizontal slices and repeat the middle one. TOP band (the top 16% of the card): a soft drift of fine gold dust and a few small square-cut flakes of gold leaf (sunago) across the top right corner, fading out toward the centre, and a small tear across the top right corner mended with a short real gold-lacquer kintsugi seam (#C9A55A, highlights #E3C987). MIDDLE band (from 16% to 86% of the card's height): plain, calm card with nothing on it; its left and right edges are a fine, low, even deckle that looks the same at every height. BOTTOM band (the last 14%): a small tear across the bottom left corner mended with a short gold kintsugi seam, a light breath of gold dust beside it. No form fields, no photo window, no flowers. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow outside the card. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: orta bantta yalnız sakin kâğıt ve yükseklik boyunca aynı ince deckle kenar (tekrarlanabilir); üstte sağ köşede altın toz + altınla onarılmış küçük yırtık, altta sol köşede altın onarım; kenar yer yer varaklı; gerçek alfa.
Kullanım: açılışta yükselen kart (Claude üç dilimden 4:5 kurar), home kartı ve davet bandı, details programı ve G138 blokları, RSVP formu; Claude üst · orta · alt diye keser, ortayı içeriğe göre uzatır.

#### W2.16 Katmanlı washi mat — dikey (pencere şeffaf)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/mat_portrait.png` · 1024×1536 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), matching the layered washi mat around the portrait on screen 2 of the attached design board. ONE photo mat, alone, seen perfectly straight from the front, made of two sheets of hand-made washi laid one on the other: the OUTER sheet is undyed rice-ivory washi (#F3ECDC, long soft fibres) with feathered deckle edges all round, spanning from 8% to 92% of the image width and from 17% to 83% of the image height; on it lies the INNER sheet of deep indigo-dyed washi (#242E58, uneven dye, long pale fibres, lighter #3C4874 toward its edges), its outer edge feathered, about 3% of the image width inside the ivory sheet's edge all round. In the middle an upright opening of about 4:5, from about 22% to 78% of the image width and from about 27% to 73% of the image height, torn through both sheets with a soft, feathered water-torn edge (fine fibres reaching a little into the opening, a thin line of the ivory sheet showing round the indigo), and the opening is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it); the ring of paper is closed all the way round it. One small tear runs in from the lower right corner of the mat toward the opening and stops well short of it, mended with a real raised gold-lacquer kintsugi seam (#C9A55A, highlights #E3C987) with a few fine branches. One soft north-window light from the upper left. No glass, no photo, no flowers. No cast shadow or drop shadow, no glow or halo outside the mat. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: dış fildişi sayfa x %8–92 · y %17–83, üstünde çivit iç sayfa; ~4:5 açıklık (x ~%22–78 · y ~%27–73) tamamen şeffaf, lifli su yırtığı kenarlı, halka kesintisiz kapalı; sağ alt köşede pencereye değmeyen altın onarım; gerçek alfa.
Kullanım: home portresi, story 1. ve 3. an; foto mat'ın altında, `ink_bloom` maskesiyle merkezden yayılarak belirir, sonra altın onarımda ışık süpürmesi; çivit ve açık zeminde de ayrışır (iki katman).

#### W2.17 Katmanlı washi mat — yatay (pencere şeffaf)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/mat_landscape.png` · 1536×1024 · **Şeffaf zemin** · pencere şeffaf

```
The landscape twin of the attached mat_portrait.png (give mat_portrait.png and design-board.png as the reference images), matching the wide mats around the photographs on screens 3 and 4 of the attached design board. ONE photo mat, alone, seen perfectly straight from the front, of the same two layered sheets: an OUTER sheet of undyed rice-ivory washi with feathered deckle edges, spanning from 7% to 93% of the image width and from 6% to 94% of the image height, and on it the INNER sheet of deep indigo-dyed washi with a feathered outer edge about 3% of the image height inside the ivory edge all round. In the middle a landscape opening of about 3:2, from about 18% to 82% of the image width and from about 18% to 82% of the image height, torn through both sheets with the same soft, feathered water-torn edge and a thin line of the ivory sheet showing round the indigo, COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it); the ring of paper is closed all the way round it. One small tear runs in from the upper left corner of the mat toward the opening and stops well short of it, mended with a real raised gold-lacquer kintsugi seam with a few fine branches. One soft north-window light from the upper left. No glass, no photo, no flowers. No cast shadow or drop shadow, no glow or halo outside the mat. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: mat_portrait ile aynı iki katman ve kenar; ~3:2 açıklık tamamen şeffaf, halka kapalı; sol üstte pencereye değmeyen altın onarım; gerçek alfa.
Kullanım: story 2. an (`story_2` 5:4 → `cover`) ve details mekân fotoğrafı (`venue` 16:9 → `cover`); fotoğraflar mürekkep lekesiyle belirir.

#### W2.18 Birleşim yırtığı — çivit kenar altınla onarılmış (yatay döşeme)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/join_tear.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), matching the feathered indigo edge mended with gold where the pale paper and the indigo section meet on screen 2 of the attached design board. A horizontal strip of deep indigo-dyed kozo washi (#242E58, uneven dye, long pale fibres) seen perfectly straight from above, running across the FULL width of the image from the left edge to the right edge (this image deliberately touches the left and right edges): its top edge is a straight horizontal cut at 34% of the image height; its bottom edge is a soft, feathered, water-torn deckle edge wandering gently between 52% and 60% of the height, with long fine fibres reaching down from it, and just along that torn edge runs a fine line of real raised gold lacquer (#C9A55A, highlights #E3C987), as if the indigo sheet had been mended onto the paper below with gold, with a few hair-fine gold branches. The left and right ends must continue each other when the image is repeated side by side (the tear, the gold line and the dye join without a visible seam). Above 34% and below the torn edge everything is fully transparent. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: kenardan kenara çivit şerit; üstü düz kesim (%34), altı lifli su yırtığı (%52–60) + boyunca ince altın onarım çizgisi; üst ve alt şeffaf; yan yana dizince ek yeri göze batmıyor (küçük dikişi Claude giderir); gerçek alfa. Sol/sağ kenara değmesi bilerek (kit_check uyarısı beklenir).
Kullanım: imza bileşeni — her çivit bölümün alt kenarı (aşağı bakan yırtık), dikey çevrilerek üst kenarı; `repeat-x`, Claude şeridi kırpar; altın çizgide yavaş ışık süpürmesi.

#### W2.19 Ayırıcı — onarılmış çipli altın damar
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/seam_rule.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), matching the small gold dividers of the attached design board. ONE delicate horizontal divider made of a single real raised gold-lacquer kintsugi seam, alone — only the gold, no paper and no ceramic: a slightly irregular, gently wandering line running level across the vertical middle of the canvas from 14% to 86% of the image width, thickest at the centre (about 1% of the image width) and tapering to hair-fine at both ends; at its exact centre a tiny mended chip — a small irregular patch of gold lacquer where three hairlines meet — and two or three short, hair-fine branches. A warm metallic sheen of real gold (#C9A55A, highlights #E3C987, fine dark-gold edges #7A5C22). Nothing else, plenty of empty space above and below. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek ince yatay altın damar, ortada küçük onarım çipi, uçlar kıl inceliğinde; kâğıt yok; kenarlara değmiyor; gerçek alfa.
Kullanım: başlık altları (home, story, details, rsvp); Claude dar şerit olarak kırpar; girerken soldan sağa maskeyle "akar", sonra ışık süpürmesi.

#### W2.20 Uzun altın damar — "altın çizgi" (dikey)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/seam_long.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png and seam_rule.png as the reference images), matching the long vertical gold seams of screens 3 and 4 of the attached design board. ONE long vertical kintsugi seam of real raised gold lacquer, alone — only the gold, no paper and no ceramic: it runs from 6% to 94% of the image height, wandering gently around the vertical middle and staying between 38% and 62% of the image width, tapering to hair-fine at both ends; along it three or four short branches reach left and right at irregular heights, and two or three tiny mended chips (small irregular patches of gold where hairlines meet) sit on the line. Fine and elegant, about 1% of the image width at its thickest, the same gold, sheen and character as seam_rule.png (#C9A55A, highlights #E3C987, dark-gold edges #7A5C22). Nothing else. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek dikey altın damar y %6–94, x %38–62 içinde; birkaç kısa dal ve küçük onarım çipi; uçlar kıl inceliğinde; seam_rule ile aynı altın; gerçek alfa.
Kullanım: details zaman çizgisi (ikonlar damarın üstünde; satırlar damar onlara ulaştıkça aydınlanır) ve story'nin altın çizgisi (kaydırmayla yukarıdan aşağı maskeyle çizilir; gerekirse aynalanıp art arda).

#### W2.21 Beyaz erik dalı (ölçülü)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/plum_branch.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), matching the slender white plum branches of screens 1 and 5 of the attached design board. ONE slender, restrained branch of white plum blossom, alone, photographed for real: a thin, gracefully angled dark branch (deep indigo-brown #2A2630) with a few side twigs, entering from 6% of the image width at the left and reaching to about 84% at the right, rising gently, staying between 22% and 78% of the image height; seven or eight small five-petalled ivory-white plum blossoms (#F7F3EA) with soft golden stamens, a few round buds, and a touch of real gold leaf on two buds and on the tip of the branch. Airy and sparse, much empty space between the flowers. No cherry blossom, no pink, no red, no leaves, no vase, no bird. One soft north-window light from the upper left. No cast shadow or drop shadow, no glow or halo outside the branch. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek ince dal, 7–8 beyaz erik çiçeği (sayı önemli değil), altın dokunuşlu tomurcuklar; seyrek; pembe/kiraz/yaprak yok; kenarlara değmiyor; gerçek alfa.
Kullanım: index'te paketin solunda, home kartının köşesi, RSVP kartının sağ altı (aynalanabilir; metnin altına girmez); hafif rüzgâr salınımı (CSS).

#### W2.22 Program ikonları — beş ayrı dosya (sumi fırça + altın varak)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/icon_rings.png`, `icon_toast.png`, `icon_dinner.png`, `icon_dance.png`, `icon_dress.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png as the style reference), matching the small programme icons on screen 4 of the attached design board. ONE small icon, alone, painted as if with a single fine sumi-ink brush: a few confident brush strokes of deep indigo-black ink (#1D2340) of one even, fairly bold weight (about 3% of the image width), with a soft dry-brush texture where the strokes end, plus ONE small touch of real gold leaf (#C9A55A) — simple and clearly readable when shown at 32–40 px, filling about 60% of the square, centred, upright. It is a drawing of an object, never a written character or a letter. No paper behind it, no circle, frame or badge around it, no seal. All five icons of this set share exactly the same brush, ink colour, weight and gold touch. One soft light from the upper left on the gold. No cast shadow, no glow. No text, letters, numbers, monograms, kanji or kana. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make five separate images:
icon_rings = two interlocked wedding rings, the gold leaf on one ring
icon_toast = two champagne coupes touching at the rim, a touch of gold leaf in the wine
icon_dinner = a round dinner plate seen from the front with a knife and a fork beside it, a fleck of gold leaf on the rim
icon_dance = a pair of dancing shoes side by side, a lady's heeled slipper and a gentleman's oxford, the gold leaf on the slipper's bow
icon_dress = a gentleman's bow tie, the gold leaf on its knot
```
Kontrol: beş dosya, her birinde tek ikon; hepsi aynı fırça, kalınlık ve tek altın dokunuş; 40 px'te okunuyor; yazıya/karaktere benzemiyor; rozet/daire/kâğıt yok; gerçek alfa (Claude alfayı maske yapıp mürekkep rengini değiştirebilir, altın korunur).
Kullanım: details programı (ceremony = rings, cocktail = toast, dinner = dinner, dancing = dance; "Dinner & dancing" tek satırda dinner), dress code = dress; ikonlar `seam_long` üstünde.

#### W2.23 Süzülen vurgular — üç ayrı dosya
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/flake_gold.png`, `petal_plum.png`, `blossom_plum.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Kintsugi & Washi" wedding website (give design-board.png and plum_branch.png as the reference images), matching the drifting gold leaf and plum petals of the attached design board. ONE single small object, alone, photographed for real, centred, not cropped, generous empty margin all round. One soft north-window light from the upper left. Nothing else: no surface, no other objects, no dust, no sparkle. No cast shadow or drop shadow, no glow or halo outside the object. No text, letters, numbers, monograms, kanji, kana, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make three separate images:
flake_gold = one small square-cut flake of genuine gold leaf (#C9A55A body, #E3C987 highlights), very thin, slightly crumpled, one corner curling up, catching the light, filling about 35% of the square
petal_plum = one single loose white plum-blossom petal (#F7F3EA), small, rounded, softly cupped, with a faint golden blush at its base, filling about 40% of the square
blossom_plum = one single five-petalled white plum blossom (#F7F3EA) seen from the front, with fine golden stamens, the same flower as on plum_branch.png, filling about 50% of the square
```
Kontrol: üç dosya, her birinde tek nesne; varak kare kesim, yaprak ve çiçek beyaz (pembe değil); yüzey/parıltı yok; gerçek alfa.
Kullanım: açılışta kart yükselirken 6–8 varak + 3–4 yaprak (Claude döndürür/ölçekler); story'de 2–3; RSVP gönderilince yarımlar birleşirken varak yağar; çiçek yalnız home imzasında ve RSVP kapanışında bir kez.

### Instructions for GPT — iş sırası ve teslim (PAKET 8)

```
Work only on PAKET 8 of collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md in the repository muzaffergrl/davetiye-maker (branch main). Ignore every other section of that file: PAKET 2, 3, 6R and 7 are done or out of scope, PAKET 5R is the old look that this package replaces, and the note at the top of the file (page_ground / env_back / flap_n as style references) does NOT apply to PAKET 8. Do NOT attach anything from collections/26_Kintsugi_Washi/assets/gpt/parts/ that existed before this package (page_ground, card_paper, env_back, env_back_v1, flap_*, flap_in_*, cord_band, button, card_small, frame_*, ink_bloom, corner_sprig, divider, mended_bowl, accent_*, web_hero) and nothing from platform/themes/; do not attach another design's board.

1. ONE chat, in this order. Send the "Instructions for GPT (send before the first image)" message of PAKET 8 first. Then W1, the design board: attach collections/26_Kintsugi_Washi/assets/gpt/photos/hero_portrait.jpg, story_2.jpg and venue.jpg as the identity reference of the couple and the venue only. The board is the design; if it is weak or misses its Kontrol line, make it again before going on (at most 3 tries). Commit and push the board as soon as it is chosen.
2. Then W2, one image per prompt, in the order W2.1 to W2.23, in the same chat. Give the finished design-board.png as the reference image of EVERY W2 image. The pieces of the opening must line up: make W2.1 tato_closed first; make W2.2–W2.5 (the four flaps) and W2.6 tato_band by EDITING tato_closed.png (same 1024×1024 canvas, same square); give tato_closed.png as a reference for W2.7 tato_open; make W2.8 clasp_joined, then W2.9 clasp_left and W2.10 clasp_right by EDITING clasp_joined.png. If your tool cannot edit, attach the base image as a reference and keep the object on the same pixels. Check by laying each one over its base at 50% opacity: the flap (or the band, or the half) must sit in the same place at the same size; regenerate once if a shift is plainly visible and write any remaining difference in TESLIM.txt. For W2.12 also give ground_dipdye.png; for W2.17 also give mat_portrait.png; for W2.20 also give seam_rule.png; for W2.23 also give plum_branch.png.
3. Use each English prompt exactly as written. One object per image. No text, letters, numbers, monograms, kanji, kana, logos or watermarks in any W2 image (sample text is allowed on W1 only). In the two multi-image prompts (W2.22 icons; W2.23 flake, petal and blossom) each listed line is its own image and its own file.
4. Keep each image in the ratio of its Kaydet size: 1:1, 2:3 or 3:2 (W1 about 2.3:1). The pixel size may differ. Do not resize, crop, repaint or recolour any pixel with code — Claude crops bands, cuts the pieces and builds the masks.
5. Photo windows (W2.16 mat_portrait, W2.17 mat_landscape) are TRANSPARENT openings; a ring of paper that closes all the way round them matters more than the opening itself. Never fill them with green, white, black or a picture. W2.18 join_tear is the only transparent part that deliberately touches the canvas edges (left and right only).
6. Counts (fibres, seam branches, gold flakes, cords, blossoms) do not matter; never regenerate for a count. Regenerate only for: a wrong object; text, or any letter-like or character-like mark; a cast/drop shadow or a glow outside the object; a fake background (white or checkerboard) instead of real alpha; an object touching the canvas edge (except W2.18 and the opaque backgrounds); a wrong ratio; a photo window that is filled or not closed; red or pink colour or cherry blossom; or an opening piece that plainly does not line up with its base. At most 2 attempts per part; then keep the best one, note the defect and move on.
7. Delivery: commit every PNG to the repository at exactly the path on its Kaydet line, with exactly that file name (the parts in collections/26_Kintsugi_Washi/assets/gpt/parts/, the board at collections/26_Kintsugi_Washi/assets/gpt/mockups/design-board.png). No zip, no Downloads folder, no other folder, nothing under platform/ or docs/ (docs/qa included), no new folder, no download names, no "_final", "_v2" or "(1)" suffixes; rejected tries are not committed. Save as PNG. Push to branch main; only if you cannot push to main, push a branch named codex/g26-paket8 and say so on the first line of TESLIM.txt. Run git pull --rebase origin main before each push. Push after W1, then after W2.7, W2.14, W2.20 and W2.23 ("26 PAKET 8: W1", "26 PAKET 8: W2 1/4", …) so nothing is lost if the chat breaks; the last commit is "26 PAKET 8: teslim". Touch no other file, write no code, do not run gpt_yerlestir.py or build_images.py.
8. Finally write collections/26_Kintsugi_Washi/assets/gpt/parts/TESLIM.txt in Turkish: branch and last commit; how many files were delivered (expected: the board + 29 parts); for every file the target size and the actual size, RGBA or RGB (real alpha channel or not), the number of attempts and every difference from its Kontrol line (be specific); the alignment results (the four flaps and the band against tato_closed; clasp_left and clasp_right against clasp_joined: shift yes/no, roughly how much; where the floor square of tato_open actually sits); anything skipped and why; which reference images were attached; and one line confirming that no pixels were changed by code. If you cannot write to the repository at all, stop and say so clearly in the chat; do not hand the upload to the user.
```
