# GPT görsel istekleri — Tasarım 42 · Espresso Pastoral

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> monograms, initials, signatures, logos, watermarks or QR codes in any image** (also not on the cabinet card mounts —
> no studio imprint — and not in the corner of any painting). The look is warm and deep, never gloomy: espresso and
> cocoa browns, cream, candle gold and dusty rose, low warm light from the LEFT, a warm-toned oil-painted countryside
> at dusk and photorealistic paper, lace and dried flowers. Give W1 `espresso_paper.png`, W2 `cream_parchment.png` and
> W3 `sky.png` as the style reference of every later part: the same espresso laid paper, the same cream parchment, the
> same warm oil-painted dusk, the same low warm light from the left. For `env_front.png`, `flap.png` and
> `lace_band.png` also attach `env_back.png` and keep the same 1080×1500 canvas, the same envelope position and the same
> envelope size; for `hills.png`, `meadow.png`, `grasses.png` and `flap_in.png` attach `sky.png` so the countryside is
> one and the same.

Bu dosya tasarım 42'nin **bütün görsel parçalarının** tek kaynağıdır (`docs/33_GPT_YENI_10_TASARIM.md`, 4. dalga 39–48).
Tasarım henüz `tools/katalog.py` `EK_TEMALAR`'da değil ve teması yok: dosya elle yazıldı, durum `concept`. Geçici görsel
de **yok** (K21: çizilmiş yedek yok); tema (önerilen G442) bu parçalarla kurulacak. Kişisel alanlar (isimler, tarih,
baş harfler, mekân) hiçbir görsele pişirilmez; sitede HTML'dir. QR kodunu GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/42_Espresso_Pastoral/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/42_Espresso_Pastoral --paket 5` ve `--paket 2` (oran, gerçek
  alfa, kenar payı, yeşil pencere) + göz kontrolü. Tema `platform/themes/espresso-pastoral/` **henüz yok** (G442 benzeri
  iş: 03/38 yapısı, `build_images.py`, `parts.css`, `layouts.ts` baskı bloğu, `EK_TEMALAR` kaydı). Tema kurulunca
  `python3 platform/themes/espresso-pastoral/build_images.py` her parçayı geldiği anda kullanır (G167 düzeni) ve
  `python3 tools/gpt_kuru_deneme.py --tema espresso-pastoral --sekil
  collections/42_Espresso_Pastoral/assets/gpt/kuru_sekil.json` provası koşulur. PAKET 6 için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **warm dark-toned oil painting of a pastoral countryside + photorealistic paper, lace and dried flowers** —
  real laid paper with its fine parallel lines, real cream parchment, real vintage cotton lace, real dried roses and
  wheat, real brass and wax; the landscape is a soft, glowing oil painting with gentle glazes and visible brushwork,
  deep but warm (not harsh chiaroscuro, not black). Classic, romantic, rich, nostalgic. Not flat vector, not sepia
  filter on everything, not gloomy.
- Renkler: espresso `#3B2A21` · cocoa deep `#231811` · mocha `#6E5140` · latte `#B79B7E` · cream `#F1E6D2` · parchment
  `#E6D8BF` · candle gold `#D9B47A` · dusty rose `#B48479` · ink `#2A1E17`.
- Işık: alçak, sıcak mum/akşam ışığı **soldan**; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa; nesnenin dışında
  gölge, hâle, ışıma yok (mum alevi dahil: site mum ışığını kendisi ekler); nesne tuvalin her kenarından en az %6 içeride
  — **istisna W4–W6 paralaks katmanları:** sol, sağ ve alt kenarın %6'lık dış bandında yumuşakça tamamen şeffafa söner,
  üstleri şeffaf (tema katmanları taşırarak büyütür; sönen kenar ekran dışında kalır).
- Manzara (W3–W6, W10, hero arkası): **tek ve aynı** kır — alacakaranlık gök, uzakta yuvarlak tepeler ve sırtta tek büyük
  meşe, yakında kır çiçekli çayır, önde uzun otlar ve buğday başakları. Gerçek bir yere benzemez.
- Yasak: yazı, marka, imza, stüdyo damgası; ressam adı, gerçek mekân. 19 Midnight Garden'dan ayrı (siyah zarf, gümüş mühür,
  barok çerçeve yok), 10 Tuscan Vineyard'dan ayrı (kraft, sicimli zarf, üzüm yok), 22 Nocturne Lake Estate'ten ayrı (göl
  yok; manzara tam boy değil, paralaks katmanlar).

## Kapalı zarf geometrisi (W7–W12 buna göre)
Zarf **dikey**, espresso kahvesi **çizgili (laid) kâğıt**. Tuval **1080×1500**; zarf kutusu **x 7–93 %, y 6–94 %**
(≈929×1320 px, ≈0,70:1). Dört katman (W7 arka, W8 ön cep, W9 kapak, W11 dantel bant) **aynı tuvalde, aynı konumda**
çizilir; tema üst üste koyar. **Mühür yok.** Zarf yüzdesiyle → tuval yüzdesiyle:
- ön cep: zarfın %38'inden alta, düz üst kenar → tuvalde x 7–93 %, y 39,4–94 %
- **V kapak, iki eğik kenarı yırtık (deckle)**: üst kenarı zarfın üst kenarı, sivri ucu zarfın %52'sinde → tuvalde
  x 7–93 %, y 6–51,8 % (uç ortada, tuvalde (50 %, 51,8 %))
- dantel bant: zarfın %40–%50'si → tuvalde x 7–93 %, y 41,2–50,0 %; kapağın alt ucunun hemen üstünden geçer (sivri ucun
  son ~%2'si bandın altında kalır ve ortadaki demetin arkasında görünmez)
- kuru çiçek demeti (W12, ayrı tuval 700×900): merkezi zarfın (50 %, 45 %) noktası = tuvalde (50 %, 45,6 %); bandın
  ortasına sıkıştırılmış durur
- açık kapağın iç yüzü (W10) ayrı tuval 1080×640: kapak x 7–93 %, y 6–94 % (katlama çizgisi altta, sivri uç üstte);
  tema onu kapak kutusuna ölçekler.

Açılış (tema kurulunca): demet öne devrilip düşer (birkaç yaprak saçılır, W18) → dantel bant aşağı kayıp zarftan çıkar →
V kapak 3B kalkar, iç yüzünde (W10) yağlı boya kır manzarası görünür → kamera astardaki tablonun **içine dalar**: dört
katman paralaks (W3 gök, W4 tepeler + meşe, W5 çayır, W6 otlar) ekranı doldurur → kart (W13) çayırdan yükselir → home.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Espresso çizgili kâğıt (sayfa zemini, zarf)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/espresso_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of fine handmade laid paper in a deep espresso brown (#3B2A21): the delicate parallel laid lines running horizontally across the whole sheet and faint, wider-spaced chain lines running vertically, a soft felted tooth, the gentlest tonal variation toward mocha (#6E5140) here and there, matte. Calm, even and dark enough for cream text (#F1E6D2) to read on it everywhere. Evenly lit by low warm light from the left, no folds, no creases, no stains, no watermark, no deckle edge, no vignette, no shadow, no objects. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); espresso kahvesi `#3B2A21` civarı; laid çizgileri ince ve sakin; krem yazı
her yerde okunur; leke/filigran yok.
Kullanım (tema kurulunca): bütün sayfaların ve açılış sayfasının zemini; koyu bantlar.

#### W2 Krem parşömen (kartlar, form)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/cream_parchment.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of thick cream parchment paper (#F1E6D2) with a soft, slightly mottled surface: faint cloudy fibres, the gentlest warm tonal drift toward parchment (#E6D8BF) and latte (#B79B7E) in a few soft patches, a fine matte tooth, very low contrast and calm enough for dark brown text (#2A1E17) to read on it everywhere. Evenly lit by low warm light from the left, no folds, no stains, no burnt edges, no vignette, no shadow, no printing, no pattern. Edges tile without a seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sakin krem; dikişsiz; yanık kenar/leke/baskı yok; koyu yazı her yerde okunur.
Kullanım (tema kurulunca): home kartı, davet bandı, RSVP formu, zarftan yükselen kartın kâğıt referansı.

#### W3 Alacakaranlık göğü (paralaksın en arka katmanı)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/sky.png` · 1200×1600 · opak

```
A vertical oil painting of a dusk sky over open countryside, filling the whole canvas edge to edge, painted in warm, deep, glowing tones with soft visible brushwork and gentle glazes: at the top a deep dusky espresso brown (#3B2A21) blending into a muted smoky blue-brown, a few long soft clouds lit from below in dusty rose (#B48479) and candle gold (#D9B47A), and in the lower half a warm rose-gold horizon glow, brightest toward the left where the sun has just set, that continues smoothly down to the bottom edge (the hills layer will cover the lower part). Sky only: no land, no hills, no trees, no birds, no moon, no stars, no buildings. The top 30% is calm. Keep the important glow within the central 85% of the width (phones crop the sides). An original painting, no signature in any corner. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yalnız gök (toprak/ağaç/kuş yok); üstte koyu sıcak kahve, altta gül-altın ufuk; ışık soldan; imza yok.
Kullanım (tema kurulunca): astardaki tablonun içine dalışta en arka katman (en yavaş paralaks); home'un üst bandında.

#### W4 Uzak tepeler ve tek meşe (paralaks katmanı)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/hills.png` · 1400×900 · **Şeffaf zemin**

```
A wide parallax layer of the same oil-painted countryside at dusk as sky.png, on a fully transparent background: a line of distant, soft, rolling hills in muted mocha (#6E5140), smoky blue-brown and dusky latte (#B79B7E), their gentle ridge running across the whole width at about 30–45% of the image height, and on the crest slightly right of centre one single large, broad old oak with a full rounded crown, painted in deep warm browns with a thin rim of candle-gold (#D9B47A) light along its left side; below the ridge the hills continue down to the bottom with soft fields and a few hedgerows in warm dark tones. Everything ABOVE the ridge line and the oak's crown is fully transparent (the sky is a separate layer). Warm, deep, glowing oil paint with soft visible brushwork, low warm evening light from the left. Edge rule: the painted layer runs across the canvas, but in the outer 6% band along the left, right and bottom edges it fades softly and smoothly to full transparency, so the outermost pixels on those three edges are completely transparent and nothing is cut by a hard border; the top of the image is transparent too. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sırtın üstü tamamen şeffaf; tek büyük meşe sırtta; sol, sağ ve alt kenar %6 bantta yumuşakça şeffafa sönüyor
(sert kesik yok); gök yok; gerçek alfa.
Kullanım (tema kurulunca): paralaksın ikinci katmanı (gökten biraz hızlı); tema taşırarak büyütür, sönen kenarlar ekran dışında.

#### W5 Yakın çayır (paralaks katmanı)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/meadow.png` · 1400×800 · **Şeffaf zemin**

```
A wide parallax layer of a near meadow at dusk in the same oil-painted countryside as sky.png and hills.png, on a fully transparent background: a gently undulating meadow crest running across the width at about 25–35% of the image height, below it a meadow of tall autumn grasses in deep mocha (#6E5140), warm ochre and latte (#B79B7E) with scattered small wildflowers — creamy lace-like umbels, dusty-rose (#B48479) clover heads, a few faded golden blooms — catching low warm candle-gold (#D9B47A) light from the left, darker and warmer toward the bottom; soft visible brushstrokes, warm deep tones. Everything ABOVE the meadow crest is fully transparent (the hills and the sky are separate layers). Edge rule: the painted layer runs across the canvas, but in the outer 6% band along the left, right and bottom edges it fades softly and smoothly to full transparency, so the outermost pixels on those three edges are completely transparent and nothing is cut by a hard border; the top of the image is transparent too. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: çayır sırtının üstü şeffaf; kır çiçekleri küçük ve dağınık; üç kenar %6 bantta yumuşakça sönüyor; gerçek alfa.
Kullanım (tema kurulunca): paralaksın üçüncü katmanı; açılışın sonunda kart bunun içinden yükselir.

#### W6 Ön plan otları ve buğday (paralaks katmanı)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/grasses.png` · 1600×600 · **Şeffaf zemin**

```
A wide foreground parallax layer of the same oil-painted countryside as sky.png, on a fully transparent background: a dense row of tall wild grasses and ripe wheat ears rising from the bottom of the image, their feathery tips and seed heads reaching up to between 10% and 30% of the image height at varying heights, the stalks deep warm brown and mocha (#6E5140) at the base, turning latte (#B79B7E) and candle gold (#D9B47A) where the low evening light from the left catches the tips; between the stalks and above the tips the background is fully transparent. Soft visible brushstrokes, crisp enough to read as the nearest layer, warm deep tones. Edge rule: the painted layer runs across the canvas, but in the outer 6% band along the left, right and bottom edges it fades softly and smoothly to full transparency, so the outermost pixels on those three edges are completely transparent and nothing is cut by a hard border; the top of the image is transparent too. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: otlar alttan yükselir, aralar ve üstü şeffaf; buğday başakları ışıkta altın; üç kenar yumuşakça sönüyor; gerçek alfa.
Kullanım (tema kurulunca): paralaksın en ön (en hızlı) katmanı; home ve details'te sayfa altında kaydırmayla hafif kayar.

#### W7 Zarfın arkası (iç astar görünür)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/env_back.png` · 1080×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope made of espresso-brown laid paper (the paper of espresso_paper.png), seen perfectly straight on, on a fully transparent 1080×1500 canvas. The envelope occupies exactly x 7–93% and y 6–94% of the canvas (about 929 × 1320 px). We look at its inside: the whole panel is lined with a plain, smooth, uncoated paper in deep cocoa (#231811), very faintly lighter toward the middle, with a slim edge of the espresso laid paper showing along the top and both sides; the top edge is a straight crisp fold line (where the V flap is hinged). Low warm evening light from the left, a gentle shade toward the lower half where the pocket will sit. No flap, no front pocket, no lace, no flowers, no card inside, nothing else. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikdörtgen zarf tuvalde x 7–93 % · y 6–94 %; içi düz koyu kakao; kapak/cep/dantel yok; çevresi gerçek alfa.
Kullanım (tema kurulunca): `.env-back` — kapak kalkınca görünen iç; W8, W9 ve W11 aynı tuvalde üstüne biner.

#### W8 Zarfın ön cebi
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/env_front.png` · 1080×1500 · **Şeffaf zemin**

```
Only the front pocket of the same espresso laid-paper envelope as env_back.png, on the same 1080×1500 canvas and in exactly the same place: the envelope occupies exactly x 7–93% and y 6–94% of the canvas, and the pocket is its lower part — a flat panel of espresso-brown laid paper (#3B2A21, the fine laid lines of espresso_paper.png running horizontally) spanning the full envelope width (x 7–93%) from 39.4% of the canvas height down to 94%. Its top edge is perfectly STRAIGHT and crisp; two soft diagonal fold lines where the side flaps are folded in and glued, with slightly lifted paper edges. Low warm evening light from the left, a very soft contact shade on the paper just under its top edge. Everything above 39.4% of the canvas height is completely transparent. No flap, no lace, no flowers, no card, nothing else. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep x 7–93 % · y 39,4–94 %, üst kenar düz; üstü tamamen şeffaf; W7'nin üstüne konunca kenarlar çakışır; gerçek alfa.
Kullanım (tema kurulunca): `.env-front` — kartın önündeki cep.

#### W9 Kapalı V kapak (yırtık kenarlı)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/flap.png` · 1080×1500 · **Şeffaf zemin**

```
Only the closed V flap of the same espresso laid-paper envelope as env_back.png, on the same 1080×1500 canvas and in exactly the same place: the envelope occupies exactly x 7–93% and y 6–94% of the canvas, and the flap is a triangle of the same espresso-brown laid paper whose straight top edge is the envelope's top fold (from x 7% to x 93% at 6% of the canvas height) and whose point reaches down to the horizontal centre at 51.8% of the canvas height. Both slanted edges are softly hand-torn deckle edges, fibrous and feathery, showing a slightly lighter mocha (#6E5140) paper core along the tear. Low warm evening light from the left, a very soft contact shade along the torn edges on the flap itself. Everything outside the triangle is completely transparent. No seal, no lace, no flowers, no string. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: V kapak tuvalde x 7–93 %, ucu ortada %51,8'de; iki eğik kenar yırtık; mühür yok; üçgen dışı şeffaf; gerçek alfa.
Kullanım (tema kurulunca): kapalı kapak; dantel bant ve demet üstünde; açılışta üst katından 3B kalkar, 90°'den sonra iç
yüzü (W10) devralır.

#### W10 Açık kapağın iç yüzü (manzara astarı)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/flap_in.png` · 1080×640 · **Şeffaf zemin**

```
The inside face of the same V flap as flap.png, alone, as it stands upright above the envelope when it is open, seen straight on, on a fully transparent 1080×640 canvas: the flap spans x 7–93% and y 6–94% of this canvas, its straight fold line along the BOTTOM and its torn point at the TOP centre, the slanted edges softly hand-torn as on flap.png. The whole inner face is lined with a small warm oil painting of the same dusk countryside as sky.png, hills.png and meadow.png: a rose-gold and candle-gold (#D9B47A) dusk sky glowing at the left, distant soft rolling hills in mocha (#6E5140) with one single large oak on the crest slightly right of centre, and a near meadow in deep warm browns with tiny dusty-rose wildflowers along the bottom — soft visible brushstrokes, warm deep tones — the painting following the triangle, with a slim band of espresso laid paper along the torn edges. Low warm evening light from the left. No signature. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: katlama çizgisi altta, sivri uç üstte; astar W3–W5 ile aynı manzara (gök, tepeler + tek meşe, çayır); imza yok; gerçek alfa.
Kullanım (tema kurulunca): `.flap-in` — kapak açılınca görünen manzara astarı; kamera bunun içine dalar ve paralaks
katmanlarına geçer.

#### W11 Krem dantel bant (aynı tuvalde, zarfı yatay sarar)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/lace_band.png` · 1080×1500 · **Şeffaf zemin**

```
Only a band of cream cotton lace wrapped horizontally around the same espresso envelope as env_back.png, on the same 1080×1500 canvas and in exactly the same place: the envelope occupies exactly x 7–93% and y 6–94% of the canvas, and the lace band crosses it from the envelope's left edge (x 7%) to its right edge (x 93%), from 41.2% to 50.0% of the canvas height, just above the point of the V flap. It is a vintage cream cotton lace ribbon (#F1E6D2) with a soft floral crochet pattern, small scalloped edges top and bottom and an open mesh: the holes in the lace are truly transparent (real alpha), so the envelope will show through them. At both ends the band turns softly around the envelope's side edges. Low warm evening light from the left, a delicate contact shade on the lace itself. Everything outside the band is completely transparent: no envelope, no flowers, no twine. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: bant tuvalde x 7–93 % · y 41,2–50 %; dantel delikleri gerçekten şeffaf; zarf/çiçek çizilmemiş; gerçek alfa.
Kullanım (tema kurulunca): kapanış; dokununca aşağı kayıp zarftan çıkar (demet düştükten sonra).

#### W12 Kuru çiçek demeti (kapanışın ortası)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/posy.png` · 700×900 · **Şeffaf zemin**

```
A small dried-flower posy, upright, alone, seen straight from the front, on a fully transparent background, centred and filling about 80% of the image height: one cream dried rose (#F1E6D2) and one dusty-rose dried rosebud (#B48479) with papery curled petals, three or four golden wheat ears, two slim sprigs of dried lavender and airy clouds of tiny white gypsophila, the stems gathered and tied with natural jute twine in a small bow at about two thirds of the height, the cut stem ends at the bottom. Photorealistic dried flowers with their papery texture, low warm evening light from the left. No ribbon other than the twine, no vase, no paper wrap, no lace. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek küçük demet; krem gül, gül kurusu tomurcuk, buğday, lavanta, cipsofil; sicim fiyonk; kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): dantel bandın ortasına sıkışık (merkez zarf tuvalinde (50 %, 45,6 %)); dokununca öne devrilip
düşer, birkaç yaprak (W18) saçılır.

#### W13 Zarftaki kart (boş)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/card_small.png` · 1000×1380 · **Şeffaf zemin**

```
A flat vertical invitation card of the cream parchment of cream_parchment.png (#F1E6D2), alone, seen straight on, on a fully transparent background, the card spanning about x 6–94% and y 6–94% of the image, with softly hand-torn deckle edges on all four sides and one fine, thin mocha-brown (#6E5140) printed border line inset about 5% from the edges. The whole card inside the border is EMPTY, calm parchment (the website sets the names and the date there). Low warm evening light from the left, a very soft contact shade on the card itself only. No flowers, no lace, nothing printed except the thin border line. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: krem kart, dört kenarı yırtık, ince kahve bordür; içi tamamen boş; kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): açılışın sonunda çayırdan yükselen kart ve home'un ilk kartı; isim, tarih HTML.

#### W14 Kabine kart paspartusu (foto penceresi 4:5)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/cabinet_frame.png` · 1000×1300 · **Şeffaf zemin**

```
An antique cabinet card photo mount, seen perfectly straight on (flat, no tilt), alone, on a fully transparent background: a rigid card of deep cocoa-brown board (#3B2A21 to #231811) spanning x 6–94% and y 6–94% of the image (60–940 px across, 78–1222 px down), with slightly rounded corners, a fine gilded bevelled outer edge and an embossed thin border of tiny laurel leaves and beading in dull antique gold (#D9B47A). In its upper part a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 140 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it), framed by a thin gilded bevelled inner edge. Below the window the bottom margin of the card is wide (about 200 px) and completely EMPTY plain board — no studio name, no imprint, no stamp, no ornament, no lettering of any kind. Low warm evening light from the left, the gilding catching it softly. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, dikdörtgen (4:5), kartın üst bölümünde; alt kenar geniş ve boş (stüdyo yazısı/damga yok);
kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): yeşil pencere ölçülür ve şeffaf yapılır; home portresi, hikâye tanıtımı ve Story'nin üç anı.
Fotoğraf **sepya** girer, yerine oturdukça sıcak renge döner (CSS filtre geçişi, "zaman akar").

#### W15 Geniş kabine kart (mekân fotoğrafı, 16:9)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/cabinet_wide.png` · 1600×1100 · **Şeffaf zemin**

```
A wide antique cabinet card photo mount, the same board, gilding and embossed border as cabinet_frame.png, seen perfectly straight on (flat, no tilt), alone, on a fully transparent background: a rigid card of deep cocoa-brown board (#3B2A21 to #231811) spanning x 6–94% and y 6–94% of the image (96–1504 px across, 66–1034 px down), with slightly rounded corners, a fine gilded bevelled outer edge and an embossed thin border of tiny laurel leaves and beading in dull antique gold (#D9B47A). In its upper part a landscape photo window exactly 1280 px wide and 720 px tall (16:9), its top-left corner at x 160 px, y 130 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it), framed by a thin gilded bevelled inner edge. Below the window the bottom margin is wide (about 180 px) and completely EMPTY plain board — no studio name, no imprint, no stamp, no lettering of any kind. Low warm evening light from the left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, dikdörtgen (16:9); alt kenar geniş ve boş; W14 ile aynı malzeme; kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): details'te mekân fotoğrafı (pencere ölçülür); aynı sepyadan renge geçiş.

#### W16 Pirinç şamdan ve yanan mum
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/candle.png` · 400×1000 · **Şeffaf zemin**

```
A single tall antique brass candlestick holding a lit cream wax candle, alone, seen straight from the front, on a fully transparent background, centred and spanning from about 7% to 93% of the image height: a round stepped brass base, a slender turned stem and a small drip pan, warm antique brass from candle gold (#D9B47A) to deep bronze with soft highlights on the left; the cream candle (#F1E6D2) with a few soft wax drips; on top a small, calm, teardrop flame with a bright pale-gold core and a faint blue base. The flame is crisp-edged: NO light, glow, halo, rays or haze around the flame or anywhere outside the objects (the website adds the candlelight). No table, no other candles. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek şamdan + mum; alev küçük ve net, çevresinde ışık/hâle yok; kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): home imzasının ve details programının yanında; kaydırınca alevin hafif titremesi ve mum ışığı
(site efekti: CSS sıcak ışık + titreme).

#### W17 Kuru güller (köşe kümesi)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/dried_roses.png` · 1200×1000 · **Şeffaf zemin**

```
A rich cluster of dried flowers spilling diagonally from the top-left toward the centre, alone, on a fully transparent background: three or four dried roses in cream (#F1E6D2) and dusty rose (#B48479) with papery, slightly curled petals, two small rosebuds, golden wheat ears, airy sprays of tiny white gypsophila, a few dried leaves in mocha (#6E5140), and a small torn piece of vintage cream cotton lace tucked beneath them (its holes truly transparent). Photorealistic dried-flower textures, low warm evening light from the left. The cluster fills the upper-left area of the image and leaves the bottom-right third empty. No vase, no table, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: küme sol üstten ortaya uzanır; sağ alt üçte bir boş; dantel delikleri şeffaf; kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): home kartının üst köşeleri (sağda aynalanır), bölüm başları, imza.

#### W18 Süzülen parçalar — üç ayrı dosya
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small dried botanical, alone, on a fully transparent background, centred and filling about 60% of the square, photorealistic with its papery dried texture, low warm evening light from the left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files: 1 = one single dried rose petal in dusty rose #B48479, softly curled; 2 = one single golden wheat ear on a short stem; 3 = one small sprig of white gypsophila with a few tiny dried blossoms.)
```
Kontrol: tek nesne; üç dosya farklı (gül yaprağı, buğday başağı, cipsofil); kenara değmiyor; gerçek alfa.
Kullanım (tema kurulunca): açılışta demet düşerken saçılan yapraklar, kaydırınca süzülen parçalar, RSVP gönderilince
düşen yapraklar; dosya yoksa öğe yok (çizilmiş yedek yok).

#### W19 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, low warm candle and evening light from the left: the closed espresso laid-paper envelope of flap.png with its torn V flap, the cream cotton lace band of lace_band.png around it and the small dried posy of posy.png tucked into the lace at the centre, lying slightly below the centre on a dark, worn oak farmhouse table; at the left the brass candlestick of candle.png with its small lit flame; at the right a loose cluster of dried roses, wheat and gypsophila (as dried_roses.png); behind, softly out of focus on a dim wall, a framed oil painting of dusky rolling hills with a single oak (as hills.png). Warm, deep, glowing tones, soft natural shading. The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no signature on the painting. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf, dantel bant ve demet bütün, altında ≥%5 boşluk; üst %20 sakin; yazı/imza yok.
Kullanım (tema kurulunca): `og-1200x630.jpg` (alta hizalı kırpım, üstten ~%21).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Eloise & Samuel; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography in colour with a warm, moody autumn palette — espresso browns,
cream, candle gold and dusty rose, deep soft shadows, low warm light from the left, visible fine film grain; ONE
fictional couple in their early thirties, the same two people in every photo (they must not resemble any real person
or celebrity): Eloise — long dark honey-brown hair in a loose braid, fair skin with freckles, a slim gold ring; Samuel
— tousled dark-blond hair, a short beard, light-medium skin. Modern, elegant autumn clothing (wool, knit, linen; no
costume). Story photos are cropped to 4:5 in a cabinet card: keep faces and hands in the middle 70%. No text, no frame,
no watermark, no readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Hero ve Story fotoğrafları sitede **4:5** kırpılır, kabine karta (W14) oturur.

#### 2.1 Ana portre
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Eloise and Samuel, in their early thirties (Eloise: long dark honey-brown hair in a loose braid, fair skin with freckles, a slim gold ring; Samuel: tousled dark-blond hair, a short beard, light-medium skin; they must not resemble any real person or celebrity) leaning together against an old weathered wooden rail fence beside a quiet country lane at golden evening light: she in a simple ivory silk gown with a cream knit shawl and a small posy of dried roses and wheat, he in a deep brown wool three-piece suit, smiling at each other, waist-up, faces in the upper middle of the frame; behind them, softly out of focus, rolling autumn hills and a single large oak. Photorealistic, warm moody autumn palette, low warm light from the left, fine film grain. A generic countryside, not a recognisable place. No frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.2 Story 1 — "An autumn walk"
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) walking hand in hand along a narrow woodland path carpeted with fallen russet and gold leaves, seen slightly from behind and to the side, her head turned toward him laughing, wool coats and scarves, low warm late-afternoon light from the left slanting through the trees. Photorealistic, same moody autumn palette and film grain. No readable signs. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.3 Story 2 — "Supper by candlelight"
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5: the same couple as hero_portrait.jpg seated close together at a worn wooden table in an old farmhouse kitchen in the evening, lit only by several brass candlesticks with lit candles, a simple supper of bread, cheese and red wine, a jug of dried roses and wheat, exposed stone wall and old copper pans softly out of focus behind them; she leans toward him laughing, he holds her hand on the table. Deep warm shadows, glowing candlelight from the left. Photorealistic, same palette and film grain. No readable labels on bottles or jars. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.4 Story 3 — "A ring in the meadow"
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, among tall dry golden meadow grasses and a few wheat ears at dusk, low warm light from the left catching the ring and the grass tips, shallow depth of field, soft dusty-rose and candle-gold bokeh behind. Photorealistic, same palette and film grain. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.5 Mekân
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an old stone farmhouse and a weathered stone barn nestled among softly rolling autumn hills at dusk, a single large oak beside them; in front, on the grass, one long rustic wooden table set for supper with cream linen, many lit candles in brass candlesticks, low arrangements of dried roses, wheat and gypsophila, and simple wooden chairs. No people, no signs, no religious objects. A generic countryside, not a real or recognisable place. Photorealistic, warm moody palette, low warm light from the left, fine film grain. No text, letters, numbers, monograms, logos or watermarks.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın `'espresso-pastoral'` bloğu
> **henüz yok** — tema kurulunca eklenecek (G442 benzeri iş); o zamana kadar bu iki dosya yalnız kaynak olarak bekler.
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden süsleme yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 tamamen boş; arka yüzde %13'ün altı ve %9–%91
> genişlik boş (program + QR oraya; QR'ı GPT çizmez, `tools/make_qr.py`). Baskı zemini **krem parşömen** (koyu mürekkep
> okunur; evde basımda espresso zemin mürekkep yer). Önerilen kutular (yüzde: üst, sağ, alt, sol) ön `[22, 13, 12, 13]`,
> arka `[16, 12, 10, 12]` — gerçek görselde ölçülür.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema kurulurken `layouts.ts`'e `'espresso-pastoral'` bloğu eklenir: `sources` → `{ front:
>    'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme espresso-pastoral` ve `node scripts/print-sample.ts
>    --theme espresso-pastoral --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the cream parchment of cream_parchment.png (#F1E6D2). Across the top centre, a small warm oil-painted vignette of the dusk countryside of hills.png — a rose-gold sky glowing at the left, soft rolling hills and a single large oak — in a gently arched shape with softly feathered edges melting into the parchment, between 18% and 82% of the width, from about 3% to 15% of the height; at its lower left corner a small spray of dried cream and dusty-rose roses with wheat and gypsophila (as dried_roses.png), staying above 17% of the height. Along the bottom, a slim horizontal row of dried wheat ears and tiny gypsophila sprigs laid end to end, between 25% and 75% of the width, from 93% to 97% of the height. All ornament stays between 8% and 92% of the width; only the plain parchment reaches the side edges. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no petal, no line, no shadow, no stain in it. Low warm light from the left. No signature. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; manzara vinyeti ve kuru güller yalnız üstte (%17'nin üstünde),
buğday sırası yalnız altta (%93'ün altında); süsleme yanların %8'ine girmiyor; yazı/imza yok.

#### P2 — Arka yüz
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream parchment, only a small horizontal spray of dried roses, wheat and gypsophila (as dried_roses.png) at the top centre, between 32% and 68% of the width, staying above 11% of the height. Everything below 13% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flower, no line, no shadow, no stain. Low warm light from the left. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı parşömen; yalnız üst ortada küçük kuru çiçek dalı (%11'in üstünde); %13'ün altı tamamen boş; yazı yok.

---

PAKET 3/7 (Etsy ilan sahneleri) bu dosyada yok: tema `espresso-pastoral` kurulunca `tools/paket7_ilan.py` ile üretilecek.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> Set bu tasarımın kendi dünyası (PAKET 3 yok; `EK_SETLER`): bütün sahnelerde aynı masa, süs, ışık. Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 42`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Espresso Pastoral". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a dark espresso-brown wooden table, dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick, the same light and the same color world (espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a dark espresso-brown wooden table, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a dark espresso-brown wooden table, dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a dark espresso-brown wooden table, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a dark espresso-brown wooden table, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a dark espresso-brown wooden table: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a dark espresso-brown wooden table: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a dark espresso-brown wooden table, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a dark espresso-brown wooden table, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/42_Espresso_Pastoral/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a dark espresso-brown wooden table: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: dried roses and golden wheat, a cream vintage cotton lace runner and a lit brass candlestick. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: espresso brown, mocha, latte, cream parchment, candle gold and dusty rose in warm candlelight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
