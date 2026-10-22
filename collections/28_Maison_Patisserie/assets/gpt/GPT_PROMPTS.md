# GPT görsel istekleri — Tasarım 28 · Maison Pâtisserie (2026-10-22 yeniden tasarım)

> **Instructions for GPT:** This design ("Maison Pâtisserie") is being REDESIGNED from scratch. Generate PAKET 5R
> (website layers) first, in order and in ONE chat, then PAKET 6R (printable invitation). PAKET 2 (sample photos)
> already exists — do NOT regenerate it. Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as
> written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text,
> letters, numbers, names, dates, initials, monograms, crests, logos, brand marks, shop names, price tags, QR codes or
> watermarks in any image** (also not on the sleeve band, the plates, the macarons, the awning or the shop window). This
> is an elegant Parisian pâtisserie in soft morning light — refined, romantic, photorealistic; never cartoon, never a
> children's-party or cupcake-shop look, no sprinkles, no candy colours beyond pistachio, rose, cream and a little gold.
> The doily lace is printed/pierced PAPER lace, never fabric lace. Give W1 `page_ground.png`, W2 `cream_paper.png` and
> W3 `env_back.png` as the style reference of every later part: the same cream pastry paper, the same cream cotton
> stationery, the same pistachio and rose papers, the same rose satin, the same soft morning window light from the
> top-left. Parts drawn on the same envelope canvas (W3, W4, W5, W7, W8, W9) keep the envelope in exactly the same box.

Bu dosya tasarım 28'in **bütün görsel parçalarının** tek kaynağıdır (`docs/35_22_32_YENIDEN_TASARIM.md`, 22–32 yeniden
tasarımı; görev G228). 18–20 Ekim'deki Codex kapağı (`img/v3-*`, `img/v4-*`) ve iç sayfaları bu parçalarla **tamamen**
değişir; eski PAKET 5 / PAKET 6 bölümleri kaldırıldı (git geçmişinde). Tema (`platform/themes/maison-patisserie/`) parçalar
gelince 39 pilotunun yapısıyla yeniden kurulur (G428, `docs/34`); gelmeyen parçanın yerine çizilmiş yedek konmaz (K21).
Kişisel alanlar (isimler, tarih, baş harfler, mekân) HTML'dir, hiçbir görsele pişirilmez. QR'ı GPT çizmez
(`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/28_Maison_Patisserie/assets/gpt/` altındaki `parts/` (PAKET 5R)
  ve `print/` (PAKET 6R). `photos/` (PAKET 2) zaten dolu — dokunma. Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/28_Maison_Patisserie --paket 5` (oran, gerçek alfa, kenar payı,
  foto penceresi) + göz kontrolü. Tema yeniden kurulunca `python3 platform/themes/maison-patisserie/build_images.py`
  (alfa kutusuna kırpma + arka katmanın kutusuna yerleştirme, `keyed_window`) ve `python3 tools/gpt_kuru_deneme.py --tema
  maison-patisserie --sekil collections/28_Maison_Patisserie/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için aşağıdaki
  "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic product photography** — real cream cotton stationery and pastry paper, real pistachio-green
  and rose-pink papers with a fine felt tooth, real pierced paper doily lace, real rose satin ribbon with a soft sheen,
  real French macarons with smooth domed shells and ruffled feet, real sugared rose buds glittering with fine sugar, real
  gold-rimmed white porcelain, real piped white royal icing. A Parisian pâtisserie at nine in the morning: airy, sweet,
  elegant, classic, romantic and rich (AGENTS şart 5). Not cartoon, not flat vector, not watercolour clip-art, not a
  cupcake-shop or kids' party print.
- Renkler (yalnız bunlar): pistachio `#A9C49C` · deep pistachio `#4F6D49` · rose `#E8B4B8` · deep rose `#9B4F5A` · cream
  `#FBF5EC` · cream shade `#F1E8D8` · gold `#B8995A` · ink `#3E3A32` (yalnız gölge/derinlik). Altın seyrek ve ince (kenar,
  çizgi, şeker inci); büyük altın yüzey yok.
- Işık: yumuşak **sabah pencere ışığı sol üstten**, bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da
  dama deseni değil), her kenarda en az %6 boşluk, nesnenin dışında gölge/hâle yok (gölgeyi site ekler).
- Dantel: **kâğıt doily** — krem ya da fildişi kâğıda iğneyle delinmiş çok ince dantel deseni (küçük çiçek rozetleri,
  ince yapraklar, kenarda delikli tarak); deliklerden altı görünür (gerçek alfa). Kumaş dantel, tül, inci yok (40'tan ayrı).
- Foto penceresi (`#00FF00`) yalnız W12 `cameo_frame`, W13 `plate_frame` ve W15 `vitrine_wide`'da; diğer parçalarda yeşil
  yok.
- Gerçek bir pastaneye, markaya, kutu tasarımına, otele, sanatçıya ya da başka bir satıcının tasarımına benzemesin;
  tentede, vitrinde, bantta yazı/logo/ad yok. **46'dan ayrı:** kurdele zarfın deliklerinden geçmez, kâğıt kılıf bandın
  üstündedir. **43'ten ayrı:** dalgalı kapak ve çiçek sapı yok. **03'ten ayrı:** V kapak ve mum mühür yok.

## Zarf geometrisi (W3–W5, W7–W10 ve W20 buna göre)
Tuval **1560×1200** (yatay). Zarf kutusu **x %7–93, y %7–93** (zarf ≈1,3:1). Altı katman **aynı tuvalde, aynı kutuda**
çizilir: W3 arka, W4 ön cep, W5 kapak, W7 kılıf bant, W8 bağlı fiyonk, W9 çözülmüş kurdele; Claude her birini kendi alfa
kutusuna kırpar ve W3'ün kutusuna göre yerleştirir. Tuval yüzdeleri:
- **ön cep (W4):** tam zarf genişliği (x %7–93), üst kenarı yanlarda **%40**, ortada **%45**'e inen sığ bir yay; zarfın
  alt kenarına (%93) kadar;
- **dantel tarak kapak (W5):** üst katlama çizgisi %7, tam genişlik; serbest kenarı **11 küçük yuvarlak tarak** dizisi —
  dizi geniş, sığ bir yay çizer: yan kenarlara **%44**'te değer, ortada en alt tarak **%60**'ta; kenar boyunca ~%4 derinlikte
  delikli doily bordür. Kapak cebin üst kenarını her yerde örter;
- **kılıf bant (W7):** zarfı yatay saran gül pembesi kâğıt bant, **x %6–94** (iki uçta zarfın yan kenarından arkaya
  kıvrılan yumuşak dönüş görünür), **y %52–72**; üst ve alt kenarı ince altın tarak. Kapağın ucu (%60) bandın altında kalır;
- **kurdele + bağlı fiyonk (W8):** bandın orta çizgisinde boydan boya gül saten kurdele (**y %60,5–63,5**, x %6–94);
  ortada fiyonk — iki ilmek **x %39–61, y %53–69**, düğüm merkezi **(%50, %62)**, iki kısa V kesik kuyruk yaklaşık
  **(%45, %82)** ve **(%55, %82)**'ye iner;
- **çözülmüş kurdele (W9):** aynı kurdele, ortada düğüm ve ilmek yok; iki serbest uç düğüm yerinden yumuşakça sarkar:
  sol uç **(%44, %80)**'e, sağ uç **(%57, %77)**'ye kıvrılır;
- **şekerlenmiş gül goncası (W10, ayrı 600×600 tuval):** sitede düğümün üstüne, merkezi **(%50, %61)**, çapı tuval eninin
  **%7,5**'i;
- açık kapağın iç yüzü (W6) ayrı tuvalde (**1560×860**): W5'in çizgisi dikey aynalanmış — katlama kenarı **altta %87**'de,
  x %7–93; yanlar **%35**'e çıkar, tarak dizisi ortada **%13**'e yükselir.
- Kat sırası (alttan üste): W3 arka → kart (W11) → W4 cep → W5 kapak → W7 kılıf bant → W8 fiyonk (ya da W9) → W10 gonca.

Açılış: gonca hafifçe eğilip sola yuvarlanarak düşer → fiyonk çözülür (W8 → W9 geçişi, ilmekler küçülür) → kılıf bant
çözülmüş kurdelesiyle birlikte **sağa kayarak** zarftan çıkar (hafif eğimle, ekrandan dışarı) → dantel tarak kapak üst
katlama çizgisinde **3B** açılır, 90°'yi geçince iç yüzü (W6, gül pembesi doily astar) görünür → krem kart (W11) cebin
arkasından yükselir, dudağı geçince öne gelir ve büyür → makaronlar, şeker inciler ve gül yaprakları (W19) hafifçe zıplayarak
düşer → home.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Krem pastane kâğıdı (sayfa zemini)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/page_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of fine cream pastry-shop wrapping paper (#FBF5EC): a soft matte paper with a gentle felt tooth and a few faint fibres, printed with very fine, evenly spaced vertical pinstripes in pale pistachio (#A9C49C at very low strength, the stripes hair-fine and about 3% of the width apart, so faint they read as a whisper of texture), the gentlest warm variation toward #F1E8D8. Evenly lit by soft morning window light from the top-left: no fold, no crease, no stain, no shadow, no vignette, no other pattern, no objects. Calm enough for dark ink and deep-rose text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam (the stripes continue exactly across the seams). No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: krem, çok soluk ince fıstık çizgiler; dikişsiz (2×2 yan yana ek yeri yok, çizgiler kesintisiz); leke/kat yok; koyu yazı her yerde okunur.
Kullanım: tema kurulunca bütün sayfaların zemini ve açılış sayfası (kapalı zarfın arkası).

#### W2 Krem pamuk kırtasiye (kartlar, bantlar, form)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/cream_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of thick cream cotton stationery card (#FBF5EC): a soft felted tooth, a few faint long cotton fibres, a whisper of warm variation toward #F1E8D8, matte, no pattern at all. Evenly lit by soft morning window light from the top-left: no deckle edge, no fold, no crease, no stain, no printing, no shadow, no vignette. Calm enough for dark ink text everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sakin krem, desensiz; dikişsiz; leke/baskı yok; koyu yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, details program kartı, RSVP formu.

#### W3 Zarfın arkası (doily astar görünür)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/env_back.png` · 1560×1200 · **Şeffaf zemin**

```
The back panel of an open landscape envelope, seen perfectly straight on, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas (about 1.3 wide : 1 tall) — the same box is used later by env_front.png, flap.png, sleeve_band.png, bow.png and bow_untied.png, so keep it exactly there. We look at its inside: the panel is lined with soft rose-pink paper (#E8B4B8) printed in fine ivory with an elegant paper-doily lace pattern — small round rosettes of tiny petals, delicate leaf sprays and fine pierced-dot scrolls, evenly repeated, symmetrical about the vertical centre, quiet and low in contrast; along the top edge and both sides a slim rim of the envelope's own cream cotton paper (#FBF5EC, a fine felt tooth) shows. The top edge is straight and open (the flap is not drawn). Soft morning window light from the top-left, a gentle shade toward the bottom where the pocket will sit. No flap, no front pocket, no band, no ribbon, no card, no seal. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf x %7–93 / y %7–93 kutusunda; içi gül pembesi kâğıt + fildişi doily baskı, kenarda krem pay; kapak/cep/bant yok; gölge/hâle yok; gerçek alfa.
Kullanım: tema kurulunca zarf kutusuna (`7, 7, 93, 93`) kırpılır → zarfın en arka katı; kapak açılınca doily astar görünür, kart onun önünden yükselir.

#### W4 Zarfın ön cebi
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/env_front.png` · 1560×1200 · **Şeffaf zemin**

```
Only the front pocket of the same cream envelope as env_back.png, on the same 1560×1200 canvas and in exactly the same place, on a fully transparent background: the envelope box is again exactly x 7–93% and y 7–93% of the canvas, and the pocket spans the full envelope width (x 7–93%) from its top edge down to the envelope's bottom edge at 93%. Its top edge is one shallow, smooth arc: at 40% of the canvas height at both side edges, dipping gently to 45% at the horizontal centre, a clean crisp cut with the faint thickness of heavy paper visible along it. Thick cream cotton paper (#FBF5EC, a fine felt tooth) showing the softly folded side flaps and bottom flap of a real envelope with their gentle fold lines, softly lit by morning window light from the top-left. Everything above the pocket's edge is completely transparent. No flap, no band, no ribbon, no card, no doily on the pocket. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep tam genişlik; üst kenarı yanlarda %40, ortada %45'e inen sığ yay; üstü tamamen şeffaf; W3 ile üst üste konunca kenarlar çakışıyor; gerçek alfa.
Kullanım: tema kurulunca aynı zarf kutusuna kırpılır → ön cep (`.env-front`); kart bunun arkasından yükselir, kapak açıkken yay kenarı görünür.

#### W5 Dantel tarak kapak (kapalı, dış yüz)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/flap.png` · 1560×1200 · **Şeffaf zemin**

```
Only the closed flap of the same envelope, on the same 1560×1200 canvas and in exactly the same place, on a fully transparent background: the envelope box is again exactly x 7–93% and y 7–93% of the canvas; the flap hangs from a softly rounded fold along the envelope's top edge at 7% across the full envelope width (x 7–93%). It is made of pistachio-green paper (#A9C49C, a fine felt tooth, slightly deeper toward #4F6D49 only in the faintest fold shade). Its free lower edge is a row of ELEVEN small, even, round scallops, like the border of a paper doily, and the row as a whole follows one broad shallow curve: it meets the two side edges at 44% of the canvas height and its lowest, centre scallop reaches 60% of the canvas height. Along this scalloped edge runs a narrow pierced doily border about 4% of the canvas height deep: tiny pierced holes and fine pierced flower rosettes cut through the pistachio paper, each hole truly transparent (real alpha). The rest of the flap is plain pistachio paper with a hair-fine gold line (#B8995A) following the scallops just inside the pierced border. Soft morning window light from the top-left, a whisper of contact shade on the flap itself along its edge. Everything below the flap's edge is completely transparent. No band, no ribbon, no bow, no seal, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: fıstık yeşili tam genişlik kapak; serbest kenarı 11 eşit küçük yuvarlak tarak, yanlarda %44, ortada %60 (V/sivri/dalgalı değil); delikler gerçekten şeffaf; ince altın çizgi; bant/fiyonk yok; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapak kutusuna (`7, 7, 93, 60`) kırpılır → kapalı kapak; açılışta kılıf bant çıktıktan sonra üst katlama çizgisinde 3B kalkar.

#### W6 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/flap_in.png` · 1560×860 · **Şeffaf zemin**

```
The inside of the same scalloped envelope flap as flap.png, alone, seen straight on as it stands upright above the envelope when it is open, on a fully transparent background: exactly the same outline as flap.png but mirrored vertically — its straight fold edge runs along the BOTTOM at 87% of the image height, spanning x 7–93% of the width; its two straight sides rise to 35% of the image height, and its row of eleven small round scallops arches UP to its highest, centre scallop at 13% of the image height. The inside is lined with the same rose-pink paper printed with the fine ivory paper-doily lace pattern as env_back.png (small rosettes, leaf sprays, pierced-dot scrolls, low contrast); along the scalloped edge the same narrow pierced doily border cut through the paper (tiny holes truly transparent) and a slim rim of pistachio paper (#A9C49C) shows beyond it. Soft morning window light from the top-left. No band, no ribbon, no bow. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: katlama kenarı altta (%87), yanlar %35'e, tarak dizisi ortada %13'e çıkar; W3 ile aynı gül pembesi doily astar; kenarda delikli bordür + ince fıstık pay; düz renk değil; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır, kapak enine ölçeklenir → kapak 90°'yi geçince zarfın üstünde dik duran iç yüz (3B dönüşün arka yüzü; asla düz renk).

#### W7 Gül pembesi kılıf bant (zarfı yatay saran)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/sleeve_band.png` · 1560×1200 · **Şeffaf zemin**

```
On the same 1560×1200 canvas as env_back.png and flap.png, in exactly the same place (the envelope box is x 7–93% and y 7–93% of the canvas, but the envelope itself is NOT drawn here), only a horizontal paper sleeve band that wraps the closed envelope like a pâtisserie box sleeve, on a fully transparent background: a band of smooth rose-pink paper (#E8B4B8, a fine felt tooth, a soft paper sheen) running horizontally from x 6% to x 94% of the canvas and from y 52% to y 72%; at both ends it turns over in a soft rounded fold, as if it bends around the envelope's side edges and continues behind it. Its top and bottom edges are each finished with a fine, even row of tiny scallops edged in a hair-fine gold foil line (#B8995A, a soft metallic shine); between them the band is plain rose paper with a faint, slightly deeper rose (#9B4F5A at very low strength) shade along its edges only. Soft morning window light from the top-left. Everything outside the band is fully transparent: no envelope, no flap, no ribbon, no bow, no sticker, no label. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek yatay gül pembesi bant (x %6–94 / y %52–72); iki uç yumuşak kıvrık; üst-alt kenar ince altın tarak; kurdele/etiket/yazı yok; zarf çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca aynı zarf tuvalinde tam tuval katman; açılışta fiyonk çözüldükten sonra çözülmüş kurdeleyle (W9) birlikte sağa kayarak zarftan çıkar.

#### W8 Gül saten kurdele + bağlı fiyonk
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/bow.png` · 1560×1200 · **Şeffaf zemin**

```
On the same 1560×1200 canvas as sleeve_band.png, in exactly the same place (the envelope box is x 7–93% and y 7–93%; the envelope and the sleeve band are NOT drawn here), only a rose satin ribbon tied in a bow, on a fully transparent background: a narrow ribbon of rose satin (#E8B4B8 with a soft luminous sheen and deeper rose #9B4F5A in its folds) runs horizontally along the centre line of the band, from x 6% to x 94% of the canvas and from y 60.5% to y 63.5%, its two ends turning over in a soft fold at the far left and right. At the horizontal centre it is tied in a full, soft, elegant bow: two plump rounded loops spanning x 39% to 61% and y 53% to 69%, a neat small knot centred at 50% of the width and 62% of the height, and two short tails falling from the knot, gently twisted once, ending in neat V-cut swallowtails at about (45%, 82%) and (55%, 82%). The satin catches soft morning window light from the top-left. Nothing on the knot (no flower, no charm, no pearl). Everything else fully transparent. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kurdele y %60,5–63,5 boyunca x %6–94; fiyonk ilmekleri x %39–61 / y %53–69, düğüm (%50, %62); kuyruklar V kesik ~(%45, %82) ve (%55, %82); düğümde süs yok; bant/zarf çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca kılıf bandın üstünde kapalı zarfın kapanışı; açılışta goncadan sonra W9'a geçer (ilmekler küçülerek çözülür).

#### W9 Çözülmüş kurdele (fiyonk açılmış)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/bow_untied.png` · 1560×1200 · **Şeffaf zemin**

```
On the same 1560×1200 canvas as bow.png, in exactly the same place, on a fully transparent background, the same rose satin ribbon (#E8B4B8, soft sheen, deeper rose #9B4F5A in its folds) just after its bow has been untied: it still runs horizontally along the band's centre line (y 60.5–63.5%) from the far left (x 6%, the end turning over in a soft fold) to near the centre, and from near the centre to the far right (x 94%, also turning over), but there is NO bow, NO loop and NO knot: in the middle the two freed ends simply hang loose and soft, slightly crinkled where the knot was — the left end curls gently down to about 44% of the width and 80% of the height, the right end curls down to about 57% of the width and 77% of the height, each ending in the same V-cut swallowtail. The satin catches soft morning window light from the top-left. The envelope and the band are NOT drawn. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: aynı kurdele, fiyonk/ilmek/düğüm yok; ortada iki serbest uç ~(%44, %80) ve (%57, %77)'ye sarkar; kurdele çizgisi W8 ile aynı yükseklikte; gerçek alfa.
Kullanım: tema kurulunca fiyonk çözülürken W8'in yerine geçer (çapraz geçiş), sonra kılıf bantla birlikte sağa kayar.

#### W10 Şekerlenmiş gül goncası (düğümün üstünde)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/rosebud.png` · 600×600 · **Şeffaf zemin**

```
A single sugared rose bud, alone, seen from the front and very slightly from above, on a fully transparent background, centred and filling about 70% of the canvas: a small, tightly furled garden rose bud in soft rose pink (#E8B4B8 deepening to #9B4F5A at the heart), its petals frosted with fine sparkling crystal sugar that catches the soft morning window light from the top-left, with two tiny sugared pistachio-green leaves (#A9C49C) tucked beneath it. No stem longer than the leaves, no ribbon, no pearl. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek şekerli gül goncası + iki küçük yaprak; şeker parıltısı gerçekçi; kurdele/sap yok; gerçek alfa.
Kullanım: tema kurulunca fiyonk düğümünün üstüne (merkez %50, %61; çap tuval eninin %7,5'i); açılışın ilk anı: eğilip sola yuvarlanarak düşer. Home'da portrenin üstünde küçük süs, RSVP kapanışında da.

#### W11 Zarftaki kart (boş)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen perfectly straight on, on a fully transparent background: the thick cream cotton card of cream_paper.png (#FBF5EC) spanning x 7–93% and y 6–94% of the canvas, its top edge cut in a gentle row of small round scallops like a doily edge, the other three edges straight with softly rounded corners. A fine gold foil line (#B8995A) follows the whole outline about 5% inside the edge, and at the top centre, just inside the scalloped edge, a small delicate pierced paper-doily rosette (tiny holes truly transparent) about 22% of the card's width. Below the rosette the card is completely EMPTY paper (the website sets the names, the date and the venue there in HTML). A hair-fine contact shade on the card's own edge only, soft morning window light from the top-left. No flowers, no ribbon, no photo. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: krem kart, üst kenarı küçük tarak; ince altın çizgi; üst ortada küçük delikli doily rozeti; altı tamamen boş; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → zarftan yükselen kart (zarf eninin ~%58'i) ve home kartı (isimler, tarih, mekân HTML).

#### W12 Krema dantelli oval çerçeve (home portresi)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/cameo_frame.png` · 1000×1250 · **Şeffaf zemin**

```
An upright oval frame made entirely of piped white royal icing, like the finest lacework on a classic wedding cake, alone, seen straight on, on a fully transparent background: a ring of delicate piped scrolls, tiny drop-loops, beaded borders and small piped lace points in soft white icing (#FBF5EC with gentle cream shade #F1E8D8 in the relief), a few tiny gold dragées (#B8995A) set into it; at the top centre and at the bottom centre a small cluster of sugar flowers — blush garden roses (#E8B4B8), a pistachio-green hydrangea floret or two and tiny sugar leaves (#A9C49C). The frame's outer edge spans about x 6–94% and y 6–94% of the canvas. In the middle an upright OVAL photo window exactly 680 px wide and 850 px tall (4:5), its bounding box from x 160 px to 840 px and from y 215 px to 1065 px, filled with flat pure green #00FF00 (no texture, no shading, a clean smooth oval edge, nothing over it — the top sugar flowers stay above y 205 px and the bottom ones below y 1075 px). Soft morning window light from the top-left giving the piping a crisp relief. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek dikey oval krema dantel çerçeve; pencere düz `#00FF00` oval, kutusu ~x 160–840 / y 215–1065 (4:5); şeker çiçekler pencereye binmiyor; gerçek alfa.
Kullanım: tema kurulunca yeşil oval ölçülür (`window_pct`) ve şeffaf yapılır → home hero portresi (foto oval maskeyle), hikâye tanıtımında küçük.

#### W13 Altın kenarlı porselen pasta tabağı (story çerçevesi)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/plate_frame.png` · 1000×1000 · **Şeffaf zemin**

```
A round fine white porcelain dessert plate, alone, seen perfectly from above, on a fully transparent background: the plate's outer edge spans x 6–94% of the canvas (centred), its rim gently scalloped and finished with a fine polished gold band (#B8995A, a crisp metallic highlight) on the very edge and a second hair-fine gold line where the rim meets the well; on the rim a delicate hand-painted garland of tiny blush rose buds (#E8B4B8) and small pistachio-green leaves (#A9C49C) all the way round, very fine and refined. In the centre a perfectly round photo window exactly 700 px in diameter, centred at (500 px, 500 px) — from x 150 to 850 px and y 150 to 850 px — filled with flat pure green #00FF00 (no texture, no shading, a clean circular edge, nothing over it). The glaze has a soft glossy sheen from the morning window light at the top-left. No food, no fork, no doily. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yukarıdan yuvarlak porselen tabak, tarak kenar + altın şerit, kenarda ince gül-yaprak çelengi; pencere düz `#00FF00` daire, çap 700, merkez (500, 500); gerçek alfa.
Kullanım: tema kurulunca daire ölçülür ve şeffaf yapılır → story'deki üç anın vitrin rafındaki tabakları (foto daire maskeyle; ortadaki öne çıkıp hafifçe döner) ve home hikâye tanıtımı.

#### W14 Altın konsollu cam vitrin rafı
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/shelf.png` · 1600×320 · **Şeffaf zemin**

```
A single pâtisserie display-case shelf, alone, seen straight on at eye level, on a fully transparent background: a long, thick shelf of clear polished glass seen edge-on with a faint pale-green glass edge and soft reflections, its front edge capped by a slim polished gold rail (#B8995A, crisp highlights), resting on two delicate scrolled gold brackets beneath it near its two ends. The shelf spans about x 6–94% and y 20–80% of the canvas (the glass top surface a slim sliver in light perspective, the brackets below). The glass is truly see-through (real alpha in the clear parts), shown by crisp highlights and edge reflections from soft morning window light at the top-left. Nothing on the shelf. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek yatay cam raf, ön kenarı altın ray, altında iki kıvrık altın konsol; cam saydam; üstünde nesne yok; gerçek alfa.
Kullanım: tema kurulunca story'deki tabakların durduğu raf (raf kayar, tabaklar üstünde) ve details'teki Meal & menu vitrini.

#### W15 Fıstık yeşili pastane vitrini (mekân fotoğrafı)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/vitrine_wide.png` · 1600×1150 · **Şeffaf zemin**

```
The front of a small, elegant Parisian pâtisserie shop window, alone, seen perfectly straight on, on a fully transparent background, photorealistic: a painted wooden shopfront in pistachio green (#A9C49C with soft deep-pistachio #4F6D49 shade in its mouldings), its outer edge spanning about x 6–94% and y 6–94% of the canvas. Across the top, a short scalloped awning valance of rose-and-cream striped canvas (#E8B4B8 and #FBF5EC) from about y 6% to 18%, below it a slim gilded moulding (#B8995A); at the two sides slim fluted pilasters with a tiny painted garland of blush roses; along the bottom a sill with a small window box of blush roses and pale greenery. In the middle a landscape photo window exactly 1280 px wide and 720 px tall (16:9), its top-left corner at x 160 px, y 250 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, square corners, nothing over it — no glass reflection, no lettering, no curtain). Soft morning window light from the top-left. The awning and the woodwork carry no text, no shop name, no number. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 1280×720 (16:9), sol üst (160, 250); üstte çizgili tarak tente, yanlarda pilaster, altta güllü pencere kutusu; tente/ahşapta yazı yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafı (vitrin camının ardında; foto sağdan sola hafifçe kayarak girer).

#### W16 Köşe demeti (gül + fıstık yaprağı + saten kurdele)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/corner_spray.png` · 1200×1000 · **Şeffaf zemin**

```
A small, restrained corner spray growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: two blush garden roses (#E8B4B8, soft layered petals, deeper rose #9B4F5A at the heart), one rose bud, a few sprigs of small soft pistachio-green leaves (#A9C49C), a tiny sprig of white sweet-pea-like blossom, and one short curl of rose satin ribbon trailing out of it with a soft sheen; one pistachio macaron (#A9C49C shells, cream filling) resting at its edge. Light and airy, not dense. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right 40% of the canvas is completely empty. Soft morning window light from the top-left. No vase, no glitter, no other colours. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sol üstten çıkan hafif küme (iki gül, gonca, yaprak, kurdele, bir makaron); sağ alt %40 boş; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşeleri (sağda aynalanır), RSVP kapanışında küçük; kapakta en fazla bir köşede ve metnin altında asla değil.

#### W17 Krema sıkma ayırıcı (bölüm ayırıcı)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider of piped white royal icing, alone, on a fully transparent background: a delicate line of tiny, even piped scallops and drop-loops (#FBF5EC with soft cream shade #F1E8D8 in the relief) running straight across x 8–92% of the canvas at the vertical centre, with one small gold dragée (#B8995A, a crisp highlight) at the centre flanked by two smaller ones, and tiny single dragées spaced evenly along the line, the piping tapering finer toward both ends. Soft morning window light from the top-left. Elegant and fine. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay ince krema tarak çizgisi, ortada üç altın şeker inci; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet ve gün, details program, RSVP formu).

#### W18 Makaronlu porselen pasta standı (imza süsü)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/cake_stand.png` · 800×900 · **Şeffaf zemin**

```
A small footed white porcelain cake stand with a fine gold edge (#B8995A), alone, seen from the front at a low eye level, on a fully transparent background, photorealistic: on its plate a neat little pyramid of seven French macarons — pistachio (#A9C49C), rose (#E8B4B8) and cream (#FBF5EC), with smooth domed shells, fine ruffled feet and soft fillings — crowned by one sugared rose bud; two gold dragées resting at the foot of the stand. The stand spans about x 18–82% and y 8–92% of the canvas. Soft morning window light from the top-left. No cake, no candles, no doily. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek ayaklı porselen stand, üstünde 7 makaronlu küçük piramit + şekerli gonca; yalnız palet renkleri; gerçek alfa.
Kullanım: tema kurulunca home imzası (isimlerin üstünde), RSVP teşekkür hâli ve 404/teşekkür modu süsü.

#### W19 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, soft morning window light from the top-left. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files, the same light and scale: 1 = one French macaron seen at a three-quarter angle, pistachio shells (#A9C49C) with fine ruffled feet and a cream filling; 2 = one round gold sugar pearl dragée (#B8995A) with a soft metallic sheen and a crisp highlight; 3 = one single loose blush rose petal (#E8B4B8), softly cupped and silky, a deeper rose shade in its fold.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (makaron, altın şeker inci, gül yaprağı); kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışın sonunda makaronlar, şeker inciler ve yapraklar hafifçe zıplayarak düşer (her biri ayrı katman, kendi fazında); RSVP gönderilince şeker inci yağmuru.

#### W20 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic product photography, soft morning window light from the top-left: the closed landscape cream envelope with its scalloped pistachio doily-edged flap (as flap.png), wrapped by the rose-pink sleeve band with fine gold scalloped edges (as sleeve_band.png) and tied with the rose satin bow crowned by a sugared rose bud (as bow.png and rosebud.png), lying slightly below the centre on cream pinstriped pastry paper (as page_ground.png); at the left a small footed porcelain cake stand with a pyramid of pistachio, rose and cream macarons (as cake_stand.png); at the right a gold-rimmed porcelain plate with two macarons and a silver cake fork, a few gold dragées and blush rose petals scattered; behind, softly out of focus, the pistachio-green woodwork and striped awning of a pâtisserie window. Only pistachio, rose, cream and a little gold. The top 20% of the image is calm and soft (only out-of-focus background). This image is cropped to 1200×630 for link previews: keep the whole envelope, band and bow visible with at least 5% empty margin below them. No people. No text, letters, numbers, monograms, logos, shop names or watermarks.
```
Kontrol: zarf + bant + fiyonk + gonca bütün, altında ≥%5 boşluk; üst %20 sakin; yazı/logo/tabela yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım: üstten ~%21) ve katalog kapağı.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Ortak: photorealistic fine-art wedding photography, soft natural light, pastel pistachio / rose / cream palette, gentle
film grain. Kurgu bir çift, otuzlu yaşların başında; ünlü ya da gerçek bir kişiye benzemesin. Yazı, logo, tabela yok.

#### 2.1 Ana portre
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties in a sunlit orangery with tall arched glass windows and potted citrus trees: the bride in a soft ivory tulle gown, the groom in a light sage-grey suit with a blush pocket square, close together and smiling, three-quarter length, faces in the upper third of the frame. Pastel pistachio, rose and cream palette, soft daylight, gentle film grain. They must not resemble any real or famous person. No text, no frame, no watermark.
```

#### 2.2 Raf 1 — "Coffee and croissants for two"
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5, in casual clothes at a small marble table inside a Parisian-style pâtisserie, sharing coffee and croissants, laughing, a glass display case of pastel pastries softly out of focus behind them. Photorealistic, same palette and grain. No readable signs, no text, no logos.
```

#### 2.3 Raf 2 — "A question over macarons"
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5: the moment of the proposal at a café terrace table, a small open pâtisserie box of pastel macarons between them, his hand offering a ring box, her hands over her mouth in surprise. Photorealistic, same palette and grain. No text, no logos.
```

#### 2.4 Raf 3 — "Forever, with a ring"
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Close-up, vertical 4:5: the couple's joined hands with a delicate engagement ring, resting beside a pistachio-and-rose macaron and a satin ribbon on a cream linen tablecloth. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 3:2)

```
Landscape 3:2: an elegant white Victorian orangery with tall arched glass windows on a green lawn by the sea, a rose garden in front, set for a wedding with cream chairs and pastel flowers, soft late-afternoon light. Fictional place — no recognisable real building, no people, no signs, no text. Photorealistic, same palette.
```

Gelince: `content.demo.json` (koleksiyon + tema kopyası) `media` alanlarına tema yolu yazılmaz — fotoğraflar
`python3 tools/kit_check.py collections/28_Maison_Patisserie --paket 2` ile denetlenir; theme-check onları
`--photos` yerine koleksiyondan kendisi bulur (`scripts/lib/theme-env.ts`).


---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, `'maison-patisserie'` bloğu). Bugünkü zeminler
> (`print/invitation_front.png`, `print/invitation_back.png`) 18–19 Ekim'in fildişi + köşe çiçekleri görünümüne göre;
> yeni görünümle **yeni adlarla** değişir (eskiler yeni dosyalar bağlanana kadar kullanımda kalır).
> **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px** = 5×7 in +
> 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan ~%0,8
> kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'maison-patisserie'` bloğunda `sources` → `{ front: 'print/invitation_front_r_5x7.png', back:
>    'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }` (aynı kalır); `ink`/`accent` yeni zemine göre (`#3E3A32` / `#9B4F5A`).
> 2. Kutuları (`front`, `back` kenar payları) görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme maison-patisserie` ve `node scripts/print-sample.ts --theme
>    maison-patisserie --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü. Eski iki dosya ancak
>    yeniler bağlanıp test geçince silinir.

#### P1 — Ön yüz
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the thick cream cotton card of cream_paper.png (#FBF5EC). Across the top, between 9% and 91% of the width, a delicate garland of fine piped white royal-icing scallops and drop-loops with tiny gold dragées (as divider.png) hanging in a gentle double swag from near the top corners, and at its centre a small rose satin bow (#E8B4B8) crowned by a sugared rose bud with two tiny pistachio-green leaves (as bow.png and rosebud.png); nothing in this top band reaches lower than 17% of the height. Along the bottom, between 93% and 96% of the height and from 14% to 86% of the width, a fine row of tiny scallops in gold foil (#B8995A) with one small gold dragée at its centre. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no icing, no petal, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges. Soft morning window light from the top-left. Only cream, rose, pistachio and a little gold. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; krema çelengi + fiyonk + gonca yalnız üstte (%17'nin üstünde), altın tarak çizgi yalnız altta; yan %8 boş; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same thick cream cotton card, only a short line of fine piped white royal-icing scallops with five tiny gold dragées across the top centre (between 30% and 70% of the width) and one small sugared rose bud at its middle, its lowest point staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no icing, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada kısa krema çizgisi + gonca (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

## PAKET 3 — Etsy ilan sahneleri (görev G175) — GEÇERSİZ (2026-10-22: yeniden tasarım; tema kurulunca yeniden yazılacak)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Yazan: G175 (`tools/paket3_sahne.py` şablonu, 01–21 ile aynı). `tools/listing_editorial.py` 3.1, 3.2, 3.4 ve 3.5'i
> kullanır (ilan görselleri 1, 2, 8, 4); 3.3 yedek sahnedir.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a white marble pastry counter with a cream linen napkin and a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a white marble pastry counter with a cream linen napkin, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a white marble pastry counter with a cream linen napkin, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a white marble pastry counter with a cream linen napkin, slightly right of center and rotated about 8 degrees, surrounded at the edges by a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a cream boudoir armchair with a pistachio cushion and a porcelain cup of coffee; a small arrangement of a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
