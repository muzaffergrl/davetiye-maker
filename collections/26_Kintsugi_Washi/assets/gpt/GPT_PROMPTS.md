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
