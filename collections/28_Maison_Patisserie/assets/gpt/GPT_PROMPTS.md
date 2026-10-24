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

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 28`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a white marble pastry counter with a cream linen napkin, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a white marble pastry counter with a cream linen napkin, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a white marble pastry counter with a cream linen napkin, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a white marble pastry counter with a cream linen napkin: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a white marble pastry counter with a cream linen napkin: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a white marble pastry counter with a cream linen napkin, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a white marble pastry counter with a cream linen napkin, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a white marble pastry counter with a cream linen napkin: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.

---

## PAKET 8 — Maison Patisserie yeniden tasarım (2026-10-24)

> Kullanıcı (2026-10-23/24, K59/K60): 21'den itibaren her tasarım "çok iyi bir profesyonel tasarımcının elinden çıkmış
> gibi" olacak; kendine özgü bileşen, hareket ve ses; "cesur ve yaratıcı ol". 28'in bugünkü sitesi (PAKET 5R: krem zarf +
> fıstık doily kapak + gül kılıf bant + saten fiyonk + şekerli gonca, G428) birkaç yeniden kurulumun yamasıdır; çıta
> değildir. PAKET 8 tasarımı baştan GPT'ye çizdirir (K21): önce **W1** tasarım panosu, sonra aynı sohbette panodan türeyen
> **W2** parçaları (21 madde, 31 dosya). Tema bu parçalarla yeniden kurulur (Claude: kesim, maske, ölçek, ışık,
> HTML/CSS/JS; çizim yok). Dosyanın başındaki "Instructions for GPT" notu, "Stil ve renk" ve "Zarf geometrisi" bölümleri
> PAKET 8'e **uygulanmaz**. Eski parçalar diskte kalır; tema yeniden kurulana kadar canlı site onları kullanır.
>
> Claude için notlar:
> - W1'in kayıt satırı bilerek kalın değil: yol `mockups/` altında olduğu için `kit_check` / `gpt_yerlestir` orada yeşil ekran
>   arar. Panoyu GPT doğrudan commit eder; `gpt_yerlestir`'e verilmez.
> - W1 demo metni `content.demo.json` ile aynı: Camille & Oliver · Saturday, June 12, 2027 · 4:00 PM · The Belle Rive
>   Orangery, Newport, Rhode Island · RSVP son günü May 1, 2027 · program 4:00 / 5:00 / 6:30 PM (Ceremony in the orangery ·
>   Champagne & macarons on the lawn · Dinner & dancing) · dress code "Cocktail attire in soft pastels" · yemek seçeneği
>   "Seared halibut" · story "A question over macarons". Geri sayım örneği 231 gün (2026-10-24'ten).
> - Dosya adları bilerek PAKET 5R'dekilerden (page_ground, cream_paper, env_*, flap*, sleeve_band, bow*, rosebud,
>   card_small, cameo_frame, plate_frame, shelf, vitrine_wide, corner_spray, divider, cake_stand, accent_*, web_hero) ve git
>   geçmişindeki eski kutu PAKET 5'ten (lid, box_base, tissue_left/right, ribbon_cross, bow_left/right/knot, bg_page,
>   bg_tile) farklı: `gpt_is_listesi` aynı yolda dosyadaki ilk prompt'u alır, eski prompt kazanırdı.
> - Açılış nesnesi zarf değil, **bolduc kurdeleyle çapraz bağlı yuvarlak pastane şapka kutusu** (K23 "kapalı zarf",
>   23/24/25 PAKET 8'deki gibi K59/K60 ile esnetildi). 23'ün kuşbakışı, menteşeli kadife kutusundan ayrı: önden (~15° yukarıdan)
>   görülür, kapak menteşesiz **dik kalkar**. START HERE (G175) zaten `box` / `Box` diyor; `designs.ts` açılış cümlesi,
>   `tests/unique-openings.test.ts`, katalog/panel adı entegratörde.
> - Kutu parçaları (W2.1–W2.6) aynı 1024×1536 tuvalde, aynı kamerayla. Hiza PAKET 8 için otomatik koşmaz: Claude
>   `tema_build.hiza_olc` ile ölçer, her katmanı kendi alfa kutusundan keser ve `hatbox_closed`'un kutusuna göre yerleştirir.
>   `hatbox_open` → `tema_build.kese_kes` (arka = görselin tamamı: iç astar + arka ağız; ön = ön ağız yayının altı); bu
>   yüzden prompt ağız kenarında net krem karton bandı ister. Kat sırası (alttan üste): open arka → `wedding_cake` →
>   `tissue_sheet_l/r` → open ön duvar → `hatbox_lid` → `bolduc_ribbon` → `bolduc_knot`. Kapalıyken mendil ve pasta gizli
>   (kırpma/görünürlük Claude'da); pasta ayrı tuvalde, kutu ağzına göre ölçeklenir.
> - Foto pencereleri (`frame_piped_arch`, `frame_shopfront`) yeşil değil, **şeffaf açıklık** (21 TESLİM: düz yeşil
>   tutmuyor); prompt'larda bilerek yeşil hex yok. Maske kapalı halkanın içindeki şeffaf bölgeden. Story fotoğrafları da
>   `frame_piped_arch` içinde (küçük ölçek), `porcelain_stand` üstünde, `glass_cloche` altında (gerçek yarı saydam cam;
>   eski `shelf` parçası GPT'nin yarı saydam camı verebildiğini gösterdi).
> - Bant gibi ince parçalar (`awning_valance`, `gilt_sign`, `rule_piped`) 3:2 tuvalde ortada bant olarak istenir; Claude
>   kırpar. Tente saçağından bir tekrar birimi kesilip yatay döşenir (dikiş kalırsa ofset/ayna; piksel boyama yok). Bütün
>   ölçüler GPT'nin yerel tuvalleri (1024×1024, 1024×1536, 1536×1024); pano ≈1908×824.
> - Kişisel içerik canlı HTML: isimler `gilt_sign` çerçevesinin içinde CSS varakla (altın degrade + ince koyu gül kontur ve
>   sağ-alt gölge = Paris vitrin camı yaldızı, verre églomisé; tasarımın tipografik imzası); `initials` pastanın boş şeker
>   plaketinde; geri sayım rakamları makaron üstlerinde. Hiçbiri görsele pişirilmez.
> - Fontlar değişir (aşağıda): **Niconne** + **Ysabeau Infant**; Parisienne + Italiana üç temada ortaktı (art-deco-black-tie,
>   winter-evergreen). Niconne tek ağırlık (400): yalnız büyük boyda; `scripts/font-fallback.ts` yeniden koşulur.
> - Palet değişmez (G177 renk varyantları `variants/recolor.json` pistachio / rose / gold ailelerine bağlı). Prompt'lar her
>   parçayı bu üç aile + krem/mermer nötrlerinde tutar (lavanta, limon, mavi, kahve, kırmızı yok) ki `recolor_parts` temiz
>   boyasın; parçalar gelince aile çapaları ölçülür, `python3 tools/recolor_parts.py build --design 28` + `check` yeniden koşar.
> - Paylaşım (og) görseli ayrıca istenmedi: Claude `vitrine_morning_wide` + `hatbox_closed`'dan kurar (eski `web_hero`
>   yerinde kalır). RSVP açılış parçalarını yeniden kullanır (cevap kartı `hatbox_open`'dan yükselir; gönderilince geri iner,
>   `hatbox_lid` kapanır, `bolduc_knot` geri konar); home imzası `wedding_cake`. PAKET 6R basılı davetiye ve PAKET 3/7 ilan
>   sahneleri bu turda değişmez (yeni görünüme uyum gerekirse ayrı paket). `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md`, tema
>   README, `kuru_sekil.json` ve tema testi entegratörde / yeniden kurulumda güncellenir.
> - K60: pano ve kurulan site kullanıcıya gösterilip onay alınmadan main'e alınmaz.

### Sanat yönetimi — "Lift the lid" (la levée)

- **Signature.** The whole website is the morning window of an imaginary Paris pâtisserie at nine o'clock, and **every
  reveal is a lift**. The guest finds a tall round pâtisserie hatbox on the white marble counter behind the glass — cream
  card with hair-fine pistachio pinstripes, a pistachio lid edged with a deep frill of pierced paper doily, tied crosswise
  with glossy rose-and-gold French curling ribbon (bolduc) that bursts into a fountain of ringlet curls — and the couple's
  names gilded in gold leaf on the shop window above it, like the sign of a little maison of their own.
- **The lift carries the site.** Opening: the knot springs, the lid lifts off, the rose tissue folds back and a white
  overpiped wedding cake rises out of the box, the couple's initials on its sugar plaque. Home: the portrait "served" in an
  overpiped royal-icing frame standing on a gold-rimmed cake stand; a countdown on four macarons. Story: three cake stands
  under glass cloches slide along the counter and the front cloche **lifts** off each photograph. Details: the order of the
  day as a pâtisserie menu card with icons **piped** in deep-rose icing; the venue through a pistachio shopfront window.
  RSVP: the reply card rises out of the open box — and on sending it goes back in, the lid comes down and the curls spring.
- **Materials (all photographed for real).** Cream cotton card and pinstriped pastry paper, pierced **paper** doily lace,
  glossy curling ribbon, crinkled rose tissue, overpiped white royal icing in the Lambeth style (scallops, garlands, drop
  strings, beading) with blush sugar roses and pistachio sugar leaves, gold-rimmed white porcelain, clear glass cloches with
  brass knobs, white Carrara marble, real French macarons and gold dragées, pistachio-lacquered shop woodwork, a rose-and-
  cream striped awning, and real gold leaf gilded on glass (verre églomisé, the lettering art of old Paris shop windows).
- **Colour (unchanged; G177 variants depend on it).** pistachio `#A9C49C` · deep pistachio `#4F6D49` · rose `#E8B4B8` ·
  deep rose `#9B4F5A` · cream `#FBF5EC` · cream shade `#F1E8D8` · gold `#B8995A` · ink `#3E3A32` · marble white. Light, joyful,
  luminous — the opposite of the dark 21–23. Soft morning window light from the upper left in every image.
- **Not the others.** 21 owns oxblood velvet, red roses, torn paper, the gold oval frame, envelope + wax seal and Didone type;
  22 the moon and night water; 23 the velvet jewel box seen from above with a hinged lid, pearls, gems, satin and a curved
  carousel on a pedestal; 24 the paper theatre, curtains and tassels; 25 train windows and tickets; 46 the satin bow; 40
  fabric lace and swans; 43 the wavy flap with flowers; 03 the V flap and wax seal; 32 the music box and mirror; 06 Art Deco
  fans; 27 doors and lanterns; 29 stars. None of them appears. No real pâtisserie, brand, packaging, shop name, crest or
  logo; no Eiffel Tower or other Paris clichés; never a children's party, cupcakes, sprinkles or candy colours.
- **Type (Google Fonts; no other theme uses them — checked 2026-10-24 against every `platform/themes/*/*.html`; HTTP 200,
  latin + latin-ext).** *Niconne* 400 — the names, page headings and countdown numerals (≥ 28 px): a high-contrast, upright
  French calligraphic script with full loops and swash capitals, the gold-leaf script of a Paris shop window. *Ysabeau
  Infant* 300/400/600 + italic (`ital,wght@0,300;0,400;0,600;1,300;1,400`) — body, captions, the form, and widely
  letter-spaced capitals for dates, labels and buttons: a light, airy, Garamond-flavoured humanist sans. Replaces
  Parisienne + Italiana.
- **Motion (Claude builds it; GPT designs for it).** Tap (first movement ≤ 250 ms) → the curls quiver and the knot springs
  off, tumbling away to the upper right → the slackened ribbon slips down the box and drops below the counter → the lid
  lifts straight up with a little suction, tips ~6° and floats out of the top of the screen → the tissue folds back, left
  sheet then right (3D, hinged on the rim) → the cake rises out of the box with a small overshoot, the initials appear in
  gold on its plaque, a glint runs over the icing → macarons, dragées and sugared petals drop onto the marble and bounce
  once → the awning swings, the gilt names travel to home. Home: the frame settles onto its stand; the macarons tick.
  Story: stands slide along the counter, the front cloche lifts (the photo's glass reflection clears). Details: each icon is
  "piped" in (stroke-reveal mask), rows follow. RSVP: see above. Page change: the awning valance swings once. Reduced
  motion: still, straight cuts. No plain fade carries a step.
- **Sound (Claude synthesises them, `tools/audio_fx.py` / `tools/audio_packs.py`; silent until the first tap).** (1) the
  knot: a springy, glossy ribbon "zing" and the tiny bounce of the curls; (2) the ribbon slithering off card; (3) the lid: the
  soft suction pop of a snug hatbox lid and a light card whoosh; (4) two crisp, airy tissue-paper rustles, left then right;
  (5) the cake: two soft rings of the little brass bell over a pâtisserie door, then a warm string-and-celesta chord; (6) a
  glass "ting" with a faint air release when a cloche lifts (story), and on RSVP send the lid's soft "tok", the curl spring
  and sugar pearls pattering on marble.

**Instructions for GPT (send before the first image):**
```
You are the art director, set stylist and still-life photographer of a luxury wedding stationery house, designing a mobile wedding website from scratch. Its signature: the whole website is the morning window of an imaginary Paris pâtisserie at nine o'clock, and every reveal is a LIFT — the guest lifts the lid of a ribboned hatbox, a glass cloche lifts off each photograph, and the reply goes back into the box. The closed object is a tall round pâtisserie hatbox on a white marble counter: a body of cream card with hair-fine pistachio pinstripes, a pistachio lid edged with a deep frill of pierced paper doily lace, tied crosswise with a glossy rose-and-gold French curling ribbon (bolduc) knotted on top in a fountain of spiralling ringlet curls; inside, rose tissue paper and a white three-tier wedding cake overpiped with royal icing. Materials, all photographed for real: cream cotton card and pinstriped pastry paper, pierced PAPER doily lace (never fabric lace), glossy curling ribbon, crinkled tissue, overpiped white royal icing in the Lambeth style (scallops, garlands, drop strings, fine beading) with blush sugar roses and pistachio sugar leaves, gold-rimmed white porcelain, clear glass cloches with brass knobs, white Carrara marble, real French macarons and gold dragées, pistachio-lacquered shop woodwork, a rose-and-cream striped awning, and real gold leaf gilded on glass (verre églomisé, the lettering art of old Paris shop windows). Colours: pistachio #A9C49C, deep pistachio #4F6D49, rose #E8B4B8, deep rose #9B4F5A, cream #FBF5EC, cream shade #F1E8D8, gold #B8995A, ink #3E3A32, marble white — no other hues (no lavender, lemon, blue, chocolate brown or red). Light: one soft morning window light from the upper left in every image. The mood is light, joyful, luminous, classic, romantic and luxurious: magazine-quality, tactile and believable; never a children's party, never cupcakes, sprinkles, candy colours, cartoon, clip-art or flat vector. It is an imaginary shop: no shop names or words, no prices, no logos, crests or monograms, nothing that resembles a real pâtisserie, brand or its packaging, no Eiffel Tower or other Paris clichés. Never: envelopes or wax seals, satin bows, fabric lace, red roses, velvet, torn paper, gold oval frames, the moon or stars, jewels or pearl strands (gold dragées are sugar, not pearls), curtains or tassels, tickets or trains, doors, lanterns, mirrors, music boxes, Art Deco fans. First you draw a design board of five phone screens (W1); then, giving that board as the reference image of every image, you make the production parts (W2): one object per image, no cast or drop shadow, no glow or halo outside the object, no text, letters, numbers, monograms, logos or watermarks. A transparent background must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard), and the object must stay at least 5% inside every edge.
```

#### W1 — Tasarım panosu (5 telefon ekranı; demo metin serbest, YALNIZ referans)
Kaydet (W1): `collections/28_Maison_Patisserie/assets/gpt/mockups/design-board.png` · yaklaşık 1908×824 (≈2,3:1; araç vermiyorsa 1536×1024, beş ekran tek sırada) · opak · kit_check dışı

```
Use case: ui-mockup. Create a high-fidelity art direction board of FIVE mobile wedding website screens for a new luxury design, each screen in a 390 by 844 proportion, arranged side by side in one row with generous, even gaps on a soft warm cream-grey studio background (the whole board about 2.3:1). The attached photographs (hero_portrait.jpg, story_2.jpg and venue.jpg) are ONLY the identity and styling reference for the fictional couple (she: dark-brown hair in a soft low updo with tiny flowers, fair skin, an ivory lace gown; he: tousled dark-brown hair, light stubble, a sage-grey suit with a blush pocket square) and for the venue (a white Victorian glass orangery by the sea with a rose garden); everything else is new. The five screens must look like one finished, coherent, best-selling premium product made by a top luxury stationery designer: light, joyful, luminous, romantic, classic and rich; never minimal, never flat vector, never clip-art, never a children's party.

THE CONCEPT — "Lift the lid": the whole website is the morning window of an imaginary Paris pâtisserie at nine o'clock, and every reveal is a lift. Materials, all photographed for real: cream cotton card and cream pastry paper with hair-fine pistachio pinstripes, pierced PAPER doily lace, glossy rose-and-gold French curling ribbon (bolduc) with spiralling ringlet curls, crinkled rose tissue, overpiped white royal icing in the Lambeth style (scallops, garlands, drop strings, fine beading) with blush sugar roses and pistachio sugar leaves, gold-rimmed white porcelain, clear glass cloches with small brass knobs, white Carrara marble, real French macarons and gold dragées, pistachio-lacquered shop woodwork, a rose-and-cream striped awning, real gold leaf gilded on glass (verre églomisé). Colours: pistachio #A9C49C, deep pistachio #4F6D49, rose #E8B4B8, deep rose #9B4F5A, cream #FBF5EC, gold #B8995A, ink #3E3A32, marble white; soft morning sunlight from the upper left. NO envelopes, no wax seals, no satin bows, no fabric lace, no red roses, no velvet, no oval frames, no moon or stars, no pearl strands or jewels, no curtains, no doors, no lanterns, no mirrors, no Eiffel Tower, no cupcakes, no sprinkles.

TYPOGRAPHY: the couple's names and the big headings in a flowing, high-contrast, upright French calligraphic script with full round loops and generous swash capitals, like gold-leaf lettering painted on a Paris shop window (not a thin hairline wedding script, not a Didone); on the window the names are real gold leaf on glass with a fine deep-rose outline and a thin rose shade line (the gilding of old Paris shop windows); dates, labels and buttons in widely letter-spaced light humanist capitals; body text in a light, airy humanist sans with an elegant italic. Deep rose, deep pistachio and gold type on cream; gold-leaf type on the glass.

Screen 1 — the opening (the closed hatbox): full-bleed, the window of the pâtisserie seen from the street at nine in the morning. Across the very top hangs the scalloped valance of a rose-and-cream striped awning on a slim brass rod. On the window glass, an ornamental frame of gold-leaf scrolls (verre églomisé, no letters in it) holds tiny spaced capitals "TOGETHER WITH THEIR FAMILIES", the names "Camille & Oliver" large in the gold-leaf script, and "JUNE 12, 2027 · NEWPORT" in small spaced capitals. Behind the glass, softly out of focus: pistachio-lacquered wall panels with fine gilt mouldings, glass shelves of pastel pastries and macarons in pistachio, rose and cream, a few blush roses; a soft diagonal sun reflection on the glass. In the lower middle, standing on a white marble counter, the CLOSED round hatbox, about 64% of the screen width, seen from the front and slightly above (the top of its lid a shallow ellipse): its body thick cream card with hair-fine vertical pistachio pinstripes and a hair-thin gold line round its base; its lid smooth pistachio card with a deep frill of pierced cream paper doily lace hanging over the body; tied crosswise with a glossy rose curling ribbon with fine gold edges, one strand running down the front centre, knotted at the top of the lid in a generous fountain of tight spiralling ringlet curls spilling over the lid. Beside it on the marble: two macarons (pistachio and rose) and three gold dragées. At the bottom "Tap to lift the lid" in small italic.

Screen 2 — home: the striped awning valance across the top; below it, on cream paper with hair-fine pistachio pinstripes, the couple's portrait (from hero_portrait.jpg) in a tall arch-topped frame of overpiped white royal icing — a scalloped outer border, piped garlands, drop strings, fine beading and tiny gold dragées, crowned with a cluster of blush sugar roses and pistachio sugar leaves — standing upright on a footed white porcelain cake stand with a fine gold rim. Below it "Camille & Oliver" large in the script in gold leaf with a fine deep-rose outline; "SATURDAY, JUNE 12, 2027 · 4:00 PM" and "THE BELLE RIVE ORANGERY · NEWPORT, RHODE ISLAND" in spaced capitals; a fine line of piped white icing with a tiny sugar rose bud at its centre; "request the pleasure of your company at their wedding" in italic; a countdown on four French macarons seen from directly above in a row (pistachio, rose, pistachio, rose), each with its number in deep rose on its smooth top — "231", "06", "42", "18" — and tiny spaced labels "DAYS", "HOURS", "MINUTES", "SECONDS" under them; a deep-rose pill button "Kindly reply".

Screen 3 — story: cream pinstriped paper above a white marble counter that fills the lower third. At the top the script heading "Our Story" and the italic line "From a shared table at a little pâtisserie to a lifetime together". On the marble, three footed porcelain cake stands in a row, each holding one of the couple's photographs in a small arch-topped frame of piped white icing under a tall clear glass cloche with a small brass knob: the centre stand large and in front, its cloche LIFTED and floating above it, tilted a little, so its photo (from story_2.jpg, the proposal over macarons) is clear and bright; the two side stands smaller and half cut by the screen edges, still under glass with soft reflections. Under them the italic caption "A question over macarons", "II / III" in small spaced capitals and two small round pistachio arrow buttons; one sugared rose petal and two gold dragées on the marble.

Screen 4 — details: a tall cream menu card fills the top two thirds of the screen: along its top edge a row of small scallops pierced like a paper doily, a small gold-leaf scroll ornament, the script heading "The Order of the Day", "SATURDAY, JUNE 12, 2027" in spaced capitals, a fine line of piped white icing with a tiny sugar rose bud; then rows, each starting with a small icon PIPED in glossy deep-rose royal icing (two interlocked rings · two champagne coupes · a domed dinner cloche · an open parasol), the time in spaced capitals, the event and the place in italic: "4:00 PM · Ceremony in the orangery · The Orangery", "5:00 PM · Champagne & macarons on the lawn · The Rose Lawn", "6:30 PM · Dinner & dancing · The Garden Pavilion", "DRESS CODE · Cocktail attire in soft pastels". Below the card, the venue photograph (from venue.jpg) seen through the window of a pistachio-lacquered Paris shopfront: the rose-and-cream striped awning on top, a gilt transom panel of ornamental gold-leaf scrolls (no letters), slim fluted pilasters, a window box of blush roses along the sill; under it "THE BELLE RIVE ORANGERY · NEWPORT, RHODE ISLAND" in spaced capitals and an outlined pistachio button "View map".

Screen 5 — RSVP: the softly blurred pâtisserie window in morning light as the background. In the lower part, on the white marble counter, the same hatbox now OPEN, its pistachio lid leaning against its side, rose tissue paper folded back over its rim; rising out of the box, a tall cream reply card with a row of pierced doily scallops along its top and a small gold-leaf scroll ornament: the script heading "Kindly Reply", "by May 1, 2027" in italic, then a real, readable form in deep rose and ink: "Your name" on a fine pistachio underline, "Will you join us?" with two macaron-coloured pill options "Joyfully accepts" (pistachio, selected) and "Regretfully declines" (rose), "Number of guests" as a select showing "2", "Your meal preference" as a select showing "Seared halibut", and a full-width deep-rose button "Send reply" with cream text. One loose ringlet curl of the ribbon and three gold dragées on the marble.

All five screens share one world (the same cream paper, pistachio, rose, gold leaf, icing, marble and morning light) but each has its own composition — not all centred. Use exactly this English sample text and no other words; do not write the design's name, a shop name or the word "pâtisserie" anywhere in the images. Photos show the fictional adult couple only, natural and tasteful, not resembling any real or famous person. No device frames or bezels, no hands, no laptop, no marketing collage, no logos, no watermarks, no captions outside the screens. This is a design reference board, not a final website.
```
Kontrol: 5 ekran yan yana, her biri ~390:844; 1. ekranda tente saçağı, camda varak (églomisé) çerçeve içinde isimler, mermer
tezgâhta **kapalı şapka kutusu** (ince fıstık çizgili krem gövde, fıstık kapak + delikli kâğıt doily fırfır, bolduc kurdele +
spiral bukleler); 2. ekranda kremadan kemerli çerçevede portre porselen stand üstünde + 4 makaron geri sayım; 3. ekranda üç
stand + fanus, ortadaki fanus kalkmış; 4. ekranda krema sıkma ikonlu menü kartı + pastane vitrini penceresinde mekân; 5.
ekranda açık kutudan yükselen okunur cevap kartı; zarf/mühür/saten fiyonk/kumaş dantel/kırmızı gül/oval/ay/yıldız/inci
dizisi/kadife/ayna/deco yok; dükkân adı ya da "Pâtisserie" yazısı yok. Başlık yazısı dolgun, ilmekli, dik Fransız
kaligrafik script (ince düğün script'i ya da Didone değil). Metindeki küçük harf bozuklukları kabul (yalnız referans).
Beğenilmezse yeniden üret (en çok 3 deneme); W2 bu panodan türer.
Kullanım: Claude'un yerleşim, tipografi ölçeği ve renk referansı; kutunun ekran genişliğine oranı, varak çerçevenin yeri,
stand + fanus + çerçeve oranları buradan ölçülür.

### W2 — Parçalar (panodan türer; HER parçada `design-board.png` referans görsel; YAZI YOK)

Ortak kurallar: tek görselde tek nesne · şeffaflar gerçek alfa · zemine düşen gölge yok · nesnenin dışında ışıma/hâle/ışın
yok (camdaki güneş yansımasını, sabah ışığını, fanus parıltısını site CSS ile ekler) · ışık sol üstten · oran önemli, piksel
değil · bukle, çizgi, tarak, boncuk, gül, delik **sayısı** önemli değil, sayı için yeniden üretme · renkler yalnız fıstık,
gül, krem, altın ve mermer beyazı.

**Kutu tuvali (W2.1–W2.6, hepsi 1024×1536, aynı kamera, aynı konum):** kamera kutunun ~15° üstünde (kapak üstü sığ elips).
Gövde x %16–84, alt yayı ortada %91; kapak x %14–86, üst elipsi y %37–45, yan bandı ~%52'ye, doily fırfırı önde ~%56'ya
iner; gövdenin kendi ağzı (yalnız kapaksız görünür) elips x %16–84, arka kenar ~%41, ön kenar ~%49; düğüm (%50, %41),
bukleler y %29–58 · x %34–66; mendiller ağızda, tepeleri ~%37'ye kabarır, alt kısımları ~%52'ye iner. Önce W2.1'i üret;
W2.2–W2.5'i **W2.1'i düzenleyerek**, W2.6'yı **W2.3'ü düzenleyerek** (image edit) üret; araç düzenleme yapamıyorsa referans
ver ve kutuyu aynı piksellerde tut.

#### W2.1 Kapalı şapka kutusu — ana hiza (kurdele + düğüm dahil)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/hatbox_closed.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the closed hatbox on screen 1 of the attached design board. ONE closed round pâtisserie hatbox, alone, standing upright, seen from the front with the camera slightly above it (about 15 degrees), so the top of its lid shows as a shallow ellipse; no tilt, perfectly centred. Placement on the 1024×1536 canvas: the body spans from 16% to 84% of the image width and its bottom edge (a gentle arc) is lowest at 91% of the image height; the lid is a little wider (from 14% to 86%), its top ellipse from 37% to 45% of the image height, its side band reaching down to about 52%, and below the band a frill of pierced paper doily lace hangs over the body down to about 56% at the front. The body: thick cream cotton card (#FBF5EC) printed with hair-fine vertical pistachio pinstripes (#A9C49C, very faint, following the curve of the cylinder) and a hair-thin gold line (#B8995A) round its base. The lid: smooth pistachio card (#A9C49C, deeper #4F6D49 only in its soft shading) with crisp edges; its frill is cream paper doily pierced with tiny holes and small rosettes, ending in small round scallops, every hole truly transparent. The box is tied crosswise with a glossy two-tone French curling ribbon (bolduc: rose #E8B4B8 with a fine gold edge): one strand runs from the top of the lid straight down the front centre of the lid and of the body to the bottom edge; the other crosses the top of the lid from side to side and turns round the left and right sides. At the centre of the lid's top the ribbon is knotted, and from the knot springs a generous fountain of tight, glossy, spiralling ringlet curls that rise to about 29% of the image height and spill over the front of the lid down to about 58%, spreading from 34% to 66% of the image width. Nothing under the box (no counter, no surface). One soft morning window light from the upper left with gentle natural shading round the cylinder. No cast shadow or drop shadow, no glow outside the box. No text, letters, numbers, monograms, labels, stickers, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek kapalı kutu; gövde x %16–84 (±%2), alt yay ~%91; kapak biraz geniş, üst elips görünüyor (hafif yukarıdan);
kapak kenarında delikli kâğıt doily fırfır (delikler şeffaf); bolduc kurdele çapraz bağlı, ön ortada dikey şerit; düğüm
kapak üstünde, spiral bukleler; tezgâh/zemin yok; yazı/etiket yok; gerçek alfa.
Kullanım: açılışın hiza tabanı (`hiza_olc`); kapalı sahne katmanları (`hatbox_open` ön duvarı + kapak + kurdele + düğüm) bunun
kutusuna oturur; og görselinin ana nesnesi.

#### W2.2 Kutunun kapağı (kurdelesiz, aynı tuval)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/hatbox_lid.png` · 1024×1536 · **Şeffaf zemin**

```
The lid of the SAME hatbox as the attached hatbox_closed.png, alone (give hatbox_closed.png and design-board.png as the reference images, and edit hatbox_closed.png if the tool allows): the same 1024×1536 canvas, the same camera, the same scale and exactly the same position — the lid's outline on exactly the same pixels as in hatbox_closed.png. Only the lid: the pistachio card top ellipse, the lid's side band and the pierced cream paper doily frill round its lower edge, seen as a closed lid from the outside. WITHOUT the ribbon and WITHOUT the knot and curls: where the ribbon crossed the lid, the pistachio card and the doily frill simply continue. The box body is NOT drawn: everything below the frill is fully transparent. One soft morning window light from the upper left. No cast shadow or drop shadow, no glow outside the lid. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: hatbox_closed.png'nin üstüne %50 saydam konunca kapak çakışıyor (gözle kayma yok); kurdele/düğüm/bukle yok; gövde
çizilmemiş; fırfır delikleri şeffaf; gerçek alfa.
Kullanım: açılışta kurdele gittikten sonra dik kalkar, ~6° eğilir, ekranın üstünden çıkar; RSVP'de cevap kutuya girince
geri iner.

#### W2.3 Açık ve boş kutu (kapaksız, aynı tuval)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/hatbox_open.png` · 1024×1536 · **Şeffaf zemin**

```
The SAME hatbox as the attached hatbox_closed.png with its lid taken off, EMPTY and OPEN (give hatbox_closed.png and design-board.png as the reference images, and edit hatbox_closed.png if the tool allows): the same 1024×1536 canvas, the same camera, the same scale and exactly the same position — the body's left, right and bottom edges on exactly the same pixels. No lid, no ribbon, no knot, no curls. Because the camera is slightly above, we look into the open top: the opening is an ellipse from 16% to 84% of the image width, its far (back) edge at about 41% and its near (front) edge at about 49% of the image height. The rim all round the opening is the cut edge of the thick cream card: a clear, crisp cream band with a visible card thickness that reads sharply against the lining (the website cuts the image along the near rim). Inside, the walls are lined with soft rose paper (#E8B4B8) printed with a fine, quiet ivory paper-doily lace pattern, softly shaded toward the bottom; the box is completely empty (no tissue, no cake). The outside of the body is exactly as before — cream card with hair-fine pistachio pinstripes and the thin gold line round its base — and where the ribbon was, the pinstriped card simply continues. One soft morning window light from the upper left. No cast shadow or drop shadow, no glow outside the box. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: hatbox_closed'un üstüne %50 saydam konunca gövdenin sol, sağ ve alt kenarı çakışıyor; kapak/kurdele yok; ağız elipsi
görünüyor, ön kenarda net krem karton bandı; iç astar gül pembesi doily baskı; içi boş; gerçek alfa.
Kullanım: `kese_kes` → arka (görselin tamamı: iç astar + arka ağız) ve ön duvar (ön ağız yayının altı); pasta ve mendiller
ikisinin arasında; RSVP'de cevap kartı buradan yükselir ve geri iner.

#### W2.4 Bolduc kurdele — yalnız şeritler (düğümsüz, aynı tuval)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/bolduc_ribbon.png` · 1024×1536 · **Şeffaf zemin**

```
Only the ribbon of the attached hatbox_closed.png, alone, drawn exactly where it lies on the box (give hatbox_closed.png and design-board.png as the reference images; edit hatbox_closed.png: remove the box, the knot and the curls, keep only the flat ribbon strands): the same 1024×1536 canvas, the same camera, the same scale and exactly the same position. The glossy two-tone French curling ribbon (rose #E8B4B8 with a fine gold edge): the strand running straight down the front centre of the lid and of the body to the bottom edge, the strand crossing the top of the lid from side to side, and the short visible parts where the strands turn round the left and right sides of the lid and the body. Where they cross at the centre of the lid's top they simply cross flat, with NO knot and NO curls. The ribbon follows the curve of the box exactly as before, but the box itself is not drawn: everything else is fully transparent. One soft morning window light from the upper left. No cast shadow or drop shadow, no glow outside the ribbon. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: yalnız kurdele şeritleri; düğüm ve bukle yok; hatbox_closed'un üstüne konunca yerine oturuyor; kutu çizilmemiş;
gerçek alfa.
Kullanım: düğüm fırladıktan sonra gevşer, kutunun önünden aşağı kayıp tezgâhın altına düşer.

#### W2.5 Bolduc düğümü + spiral bukleler (aynı tuval)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/bolduc_knot.png` · 1024×1536 · **Şeffaf zemin**

```
Only the knot and the curls of the ribbon of the attached hatbox_closed.png, alone, exactly where they sit (give hatbox_closed.png and design-board.png as the reference images; edit hatbox_closed.png: remove the box and the flat ribbon strands, keep only the knot and its fountain of curls): the same 1024×1536 canvas, the same camera, the same scale and exactly the same position. The small tight knot at the centre of the lid's top (about 50% of the image width, 41% of the image height) and the generous fountain of tight, glossy, spiralling ringlet curls of rose-and-gold curling ribbon springing from it, rising to about 29% and spilling down to about 58% of the image height, from 34% to 66% of the image width; every curl complete (where a curl lay against the lid, its hidden part is completed). The box and the flat strands are not drawn: everything else is fully transparent. One soft morning window light from the upper left. No cast shadow or drop shadow, no glow outside the curls. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: yalnız düğüm + spiral bukleler; hatbox_closed'un üstüne konunca aynı yerde; kutu/şerit yok; gerçek alfa.
Kullanım: açılışın ilk anı: bukleler titrer, düğüm yukarı fırlar, dönerek sağ üstten çıkar; RSVP gönderilince geri konar;
og görselinde kapalı kutunun parçası.

#### W2.6 Gül pembesi kâğıt mendil — iki ayrı dosya (W2.3'ü düzenleyerek)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/tissue_sheet_l.png`, `tissue_sheet_r.png` · her biri 1024×1536 · **Şeffaf zemin**

```
Make two separate images. Each is ONE sheet of crinkled rose tissue paper (#E8B4B8, paler toward its thin crinkled folds, slightly translucent only at its finest edges), alone, drawn exactly where it lies in the open top of the attached hatbox_open.png (give hatbox_open.png and design-board.png as the reference images; edit hatbox_open.png: lay the sheet in place, then remove the box so that only the sheet remains): the same 1024×1536 canvas, the same camera, the same scale and exactly the same position. Together the two sheets cover the whole opening of the box like the tissue a pâtissier tucks over a cake: each lies over one half of the opening, puffed up softly into gentle crinkled domes that rise to about 37% of the image height, its outer part tucked down inside the box wall, its lower part reaching down to about 52% of the image height (that part will be hidden behind the box's front wall). The box is NOT drawn: everything except the sheet is fully transparent. One soft morning window light from the upper left. No cast shadow or drop shadow, no glow outside the sheet. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
tissue_sheet_l = the LEFT sheet, from 17% to 53% of the image width, its inner edge a soft crinkled, roughly vertical edge just right of the centre
tissue_sheet_r = the RIGHT sheet, from 47% to 83% of the image width, its inner edge lying over the left sheet a little at the centre
```
Kontrol: iki dosya, her birinde tek kâğıt; ikisi birlikte ağzı örtüyor, ortada hafif bindirme; kutu yok; gerçek alfa (ince
kenarlarda hafif yarı saydamlık kabul).
Kullanım: kapak kalkınca ağızda kapalı görünür; sonra sol, 120 ms sonra sağ yaprak dış kenarından 3B geri katlanır
(`rotateY`), pasta yükselir. Kapalı sahnede gizli.

#### W2.7 Düğün pastası — kutudan yükselen (boş şeker plaketli)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/wedding_cake.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png and hatbox_open.png as the reference images; the cake must look as if it had been packed in that box). ONE elegant three-tier wedding cake, alone, photographed for real, seen from the front with the same slightly raised camera as the hatbox (about 15 degrees), perfectly upright and centred: three round tiers of decreasing size covered in smooth white royal icing (#FBF5EC) and overpiped in the classic Lambeth style — layered scallops, garlands, drop strings, fine beading and tiny piped bows — with tiny gold dragées (#B8995A) set into the piping; a narrow pistachio grosgrain ribbon (#A9C49C) round the base of each tier; a soft cascade of blush (#E8B4B8) and cream sugar garden roses with small pistachio sugar leaves spiralling from the top tier down the right side. On top, standing upright in a small cluster of sugar roses, a round sugar plaque with a piped scalloped border whose smooth white face is COMPLETELY EMPTY (the website writes the couple's initials there). The bottom tier spans from 22% to 78% of the image width; the whole cake runs from about 6% (the top of the plaque) to 94% of the image height; the bottom edge of the bottom tier is straight, level and clean — no cake board, no stand, no plate, no table (the cake rises out of a box). Refined, white and couture: never childish, never a cupcake or birthday look, no candles, no figurines, no fresh fruit. One soft morning window light from the upper left. No cast shadow or drop shadow, no glow outside the cake. No text, letters, numbers, monograms, logos or watermarks (the plaque stays blank). True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek üç katlı beyaz pasta; Lambeth krema sıkma; katlarda fıstık kurdele; yanda gül kaskadı; tepede boş şeker plaket
(harf yok); alt kenar düz, altlık/stand yok; gerçek alfa.
Kullanım: açılışta mendiller açılınca kutudan yükselir (alt kısmı ön duvarın arkasında kalır), plakette `initials` canlı
metin varakla belirir; home imzası ("Open it again").

#### W2.8 Pastane vitrini, sabah — telefon zemini
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/vitrine_morning.png` · 1024×1536 · opak

```
Production background for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching what is seen behind the glass on screens 1 and 5 of the attached design board. A full-frame vertical (2:3) photograph, edge to edge, of the morning window display of an imaginary Paris pâtisserie at nine o'clock: in the lower 28% the polished top of a white Carrara marble counter (soft grey veins, the faintest rose-tinted vein), seen slightly from above, its front edge just out of frame; behind it, softly out of focus with a shallow depth of field and creamy bokeh, the shop interior — pistachio-lacquered wall panels (#A9C49C, shade #4F6D49) with fine gilt mouldings (#B8995A), glass display shelves with rows of pastel pastries, macarons and little cakes in pistachio, rose and cream only, a few blush roses in a white porcelain vase — bathed in soft golden morning sunlight from the upper left, airy and luminous. The middle of the frame, from 12% to 68% of the height, is calm and soft with no sharp details and no bright spots, so light-gold names and a hatbox can sit on it; keep every important detail within the middle 85% of the width. Photorealistic luxury food-and-interior photography with a subtle film grain. No people, no hands, no mirrors, no doors, no window frames, no signs, no price tags, no text, letters, numbers, logos or watermarks.
```
Kontrol: tam opak; alt ~%28 mermer tezgâh; arkada bulanık fıstık lambri + pastel vitrin rafları; orta bölge sakin; renkler
yalnız palet; insan/ayna/tabela/yazı yok.
Kullanım: index zemini (kutu tezgâhta durur; camda CSS güneş yansıması), RSVP zemini (yumuşatılmış), home hero'nun arkası.

#### W2.9 Pastane vitrini, sabah — geniş ekran
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/vitrine_morning_wide.png` · 1536×1024 · opak

```
The same morning pâtisserie window display as vitrine_morning.png (give vitrine_morning.png and design-board.png as the reference images), now a full-frame horizontal (3:2) photograph, edge to edge: the same polished white Carrara marble counter top in the lower 28%, the same softly out-of-focus pistachio-lacquered wall panels with fine gilt mouldings, the same glass shelves of pastel pastries and macarons in pistachio, rose and cream, a few blush roses, the same soft golden morning sunlight from the upper left. The middle half of the width and the middle of the height are calm and soft. Same colours, light and film grain. No people, no hands, no mirrors, no doors, no window frames, no signs, no price tags, no text, letters, numbers, logos or watermarks.
```
Kontrol: vitrine_morning ile aynı vitrin, renk ve ışık; orta yarı sakin; opak.
Kullanım: 700 px ve üstü ekranlarda vitrine_morning'in yerine (index, home hero, RSVP); og görselinin zemini.

#### W2.10 Krem pastane kâğıdı, ince fıstık çizgili — dikişsiz doku
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/stripe_paper.png` · 1024×1024 · opak

```
Production texture for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), the pinstriped cream paper of screens 2 and 3 of the attached design board. A seamless, tileable square texture of fine cream pastry paper (#FBF5EC) seen perfectly flat and straight on: a soft matte paper with a gentle felted tooth and a few faint fibres, printed with hair-fine, perfectly vertical pistachio pinstripes (#A9C49C at low strength) evenly spaced about 4% of the width apart, so faint they read as a whisper of texture. Perfectly even lighting: no vignette, no gradient, no hotspot, no fold, no stain, no border, no other pattern, calm enough for small dark text everywhere; four copies placed side by side join invisibly (the left edge continues the right edge, the top edge continues the bottom edge, and the stripes run straight across the seams). No objects, no text, letters, numbers, logos or watermarks.
```
Kontrol: krem, çok soluk dikey fıstık çizgiler; eşit ışık; 2×2 dizince dikiş görünmüyor (Claude dizip bakar; küçük dikişi
ofsetle kendisi giderir — yalnız bunun için yeniden üretme); opak.
Kullanım: home, story ve details zemini (`background-repeat`).

#### W2.11 Çizgili tente saçağı (sayfa başlığı bandı)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/awning_valance.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the striped awning valance across the top of screens 1 and 2 of the attached design board. ONE straight horizontal band of a Paris shop awning valance, alone, photographed for real and seen perfectly straight from the front: a slim polished brass rod with tiny round finials at both ends runs level at about 32% of the image height; hanging from it, a band of heavy woven canvas in even vertical stripes of rose (#E8B4B8) and cream (#FBF5EC), each stripe about 4% of the image width, from 33% to 58% of the image height; its lower edge is cut into a row of round scallops that line up evenly with the stripes, finished with a narrow cream binding. The stripes and scallops are perfectly even and repeat exactly, so a section can be cut and repeated side by side. A soft woven texture and a gentle sheen, a little soft shading inside each scallop on the canvas itself. The band spans from 6% to 94% of the image width; everything above and below it is fully transparent. One soft morning window light from the upper left. No lettering, no shop name, no numbers, no logos, no cast shadow or drop shadow, no glow. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek yatay saçak bandı, pirinç çubuk + gül/krem eşit çizgiler + yuvarlak taraklar; tekrar edilebilir; yazı yok;
kenarlara değmiyor; gerçek alfa.
Kullanım: her sayfanın tepesinde başlık bandı (Claude bir tekrar birimi kesip yatay döşer); açılışın sonunda ve sayfa
geçişinde bir kez sallanır.

#### W2.12 Vitrin camı yaldızı — isim çerçevesi (verre églomisé, harfsiz)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/gilt_sign.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the gold-leaf ornament round the names on the window glass on screen 1 of the attached design board. ONE ornamental frame in genuine gold leaf as it is gilded on the back of a Paris shop window (verre églomisé), alone, seen perfectly straight from the front, with no glass and no window drawn: a wide, elegant horizontal cartouche outline made of fine gold-leaf scrolls, C-scrolls and small acanthus leaves; its top edge rises into a gentle arch with a small shell-like scroll at its centre, its bottom edge is a shallow inverted arch with a tiny scroll at its centre. The gold is mirror-bright burnished leaf with a few soft matte areas, and every gilded line is edged with a fine deep-rose (#9B4F5A) outline and a thin darker rose shade line toward the lower right, as the old sign-writers did. The frame spans from 6% to 94% of the image width and from 22% to 78% of the image height; the large central field, from 18% to 82% of the width and from 34% to 66% of the height, is COMPLETELY EMPTY and transparent (the website writes the couple's names there). It is a frame for a name, but it contains NO letters, words, initials or numbers at all. One soft morning light from the upper left on the gold. No cast shadow or drop shadow, no glow or sparkle outside the gold. No logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek yatay varak kartuş, kıvrımlar koyu gül konturlu; orta alan tamamen boş ve şeffaf; harf/kelime yok; gerçek alfa.
Kullanım: index'te camda isimlerin çerçevesi (isimler canlı metin, CSS varak + koyu gül kontur); home'da isimlerin üstünde
küçük; üstünden bir kez ışık süpürmesi.

#### W2.13 Krema sıkma kemerli çerçeve — portre ve story (pencere şeffaf)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/frame_piped_arch.png` · 1024×1536 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the icing frame round the portrait on screen 2 of the attached design board. ONE upright photo frame made entirely of overpiped white royal icing in the classic Lambeth style, alone, photographed for real and seen perfectly straight from the front: a tall cartouche with straight sides, a round arched top and a softly scalloped outline, built up in layers of piped scrolls, C-scrolls, scallops, delicate drop strings and garlands, fine beading and tiny piped bows (#FBF5EC with a soft cream shade #F1E8D8 in the relief), a few tiny gold dragées (#B8995A) set into the piping; crowning the top of the arch a small cluster of blush sugar garden roses (#E8B4B8, deeper #9B4F5A at their hearts) with pistachio sugar leaves (#A9C49C), and a smaller matching cluster at the centre of the bottom; its bottom edge is straight and level so the frame can stand upright on a cake stand. The whole frame spans from 8% to 92% of the image width and from 6% to 94% of the image height. Inside it a clean arch-topped (round-top) opening of about 4:5, from 19% to 81% of the image width and from 26% to 78% of the image height, which is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it); the piped ring is closed all the way round the opening and the sugar roses stay outside it. Crisp sugary relief in one soft morning window light from the upper left. No cast shadow or drop shadow, no glow or halo outside the frame. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek kemerli krema çerçeve (oval değil); açıklık ~4:5, tamamen şeffaf, halka kesintisiz kapalı; güller açıklığın
dışında; alt kenar düz; gerçek alfa.
Kullanım: home portresi (`hero_portrait`, porselen standın üstünde durur); story'de üç fotoğraf küçük ölçekte fanus altında;
maske şeffaf açıklıktan (kemer üst köşeleri `cover` ile kırpılır).

#### W2.14 Fıstık yeşili pastane vitrini — mekân penceresi (pencere şeffaf)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/frame_shopfront.png` · 1536×1024 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the shopfront round the venue photograph on screen 4 of the attached design board. ONE small, elegant Paris shopfront window, alone, photographed for real and seen perfectly straight from the front, used as a photo frame: pistachio-lacquered woodwork (#A9C49C with soft deep-pistachio #4F6D49 shade in the mouldings) with fine gilt mouldings (#B8995A); across the top a short rose-and-cream striped awning with a scalloped valance (from about 5% to 15% of the image height); under it a narrow gilt transom panel decorated ONLY with ornamental gold-leaf scrolls (from about 15% to 26%); slim fluted pilasters at the left (from 6% to 22% of the width) and the right (from 78% to 94%); along the bottom a sill with a window box of blush roses and pale greenery (from about 82% to 95%). Between them a clean rectangular window of about 3:2, from 22% to 78% of the image width and from 26% to 82% of the image height, which is COMPLETELY TRANSPARENT (a real hole in the alpha channel — no glass, no reflection, no curtain, nothing inside it); the woodwork closes all the way round it. The awning, the transom and the woodwork carry no lettering, no shop name and no number. One soft morning window light from the upper left. No cast shadow or drop shadow, no glow or halo outside the shopfront. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: pencere ~3:2, tamamen şeffaf, çerçeve kesintisiz kapalı; üstte çizgili tente + yaldız kıvrımlı (harfsiz) üst pano,
yanlarda yivli pilaster, altta güllü pencere kutusu; yazı/dükkân adı yok; gerçek alfa.
Kullanım: details'te mekân fotoğrafı (`venue`); maske şeffaf açıklıktan; camı CSS yansıması verir, foto sağdan hafifçe
kayarak girer.

#### W2.15 Ayaklı porselen pasta standı
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/porcelain_stand.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the cake stands on screens 2 and 3 of the attached design board. ONE footed cake stand of fine white porcelain, alone, photographed for real, seen from the front at eye level with the camera very slightly above, so the top of its plate shows as a very thin ellipse: a wide round plate with a gently scalloped edge finished with a fine polished gold band (#B8995A), a delicate hand-painted garland of tiny blush rose buds (#E8B4B8) and pistachio leaves (#A9C49C) just under the rim, resting on a slender fluted pedestal with a fine gold ring that widens into a round scalloped foot. The plate spans from 16% to 84% of the image width with its top surface at about 40% of the image height; the foot stands at about 84%. The top of the plate is EMPTY (nothing on it, no doily, no cake). One soft morning window light from the upper left, a soft glossy glaze. No cast shadow or drop shadow, no glow outside the stand. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek ayaklı porselen stand; altın tarak kenar + ince gül-yaprak çelengi; tabak üstü boş; gerçek alfa.
Kullanım: home'da portre çerçevesinin altlığı; story'de üç stand (fanus altında, tezgâh boyunca kayar); details menü
bloğunda.

#### W2.16 Cam fanus (pasta kubbesi) — gerçek yarı saydam cam
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/glass_cloche.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png, porcelain_stand.png and frame_piped_arch.png as the reference images: the dome must be wide enough to cover the stand's plate and tall enough for the frame standing on it), matching the glass cloches on screen 3 of the attached design board. ONE tall glass cloche (a cake dome), alone, photographed for real, seen straight from the front at eye level: thin, flawless clear glass with gently curved sides and a rounded top, a small polished brass knob on top, its open bottom rim a thin glass edge with a hint of an ellipse. It spans from 12% to 88% of the image width and from 8% to 90% of the image height. The glass must be truly SEE-THROUGH: the clear areas of the dome are almost fully transparent in the alpha channel; only the crisp highlights (a tall soft window reflection on the upper left of the dome, a thin bright line along its silhouette, small glints on the knob), the faint pale-green tint of the glass edges and the brass knob are visible. Nothing inside it and nothing under it (no plate, no stand, no cake). One soft morning window light from the upper left. No cast shadow or drop shadow, no glow, haze or sparkle outside the glass. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard, not grey).
```
Kontrol: tek cam fanus + pirinç tepe; koyu zemine konunca içi görünüyor (beyaz/gri dolgu yok); yalnız parlamalar ve kenar
çizgisi belirgin; altında tabak yok; gerçek alfa (yarı saydam).
Kullanım: story'de her fotoğrafın üstünde; öndeki fanus kalkar (yukarı + hafif eğim), fotoğraftaki cam yansıması (CSS)
silinir; RSVP teşekkür hâlinde makaronların üstüne iner.

#### W2.17 Menü kartı (3 dilim: üst süs · tekrarlanan orta · alt süs)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/menu_card.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the cream menu card of screen 4 and the reply card of screen 5 of the attached design board. ONE tall card of thick cream cotton card (#FBF5EC, a fine felted tooth), alone, portrait 2:3, seen perfectly straight from the front, filling about 84% of the image width and 90% of the image height, centred. It is designed so the website can cut it into three horizontal slices and stretch the middle one. TOP band (the top 18% of the card): the top edge is a row of small round scallops pierced like a paper doily (tiny holes and small rosettes, truly transparent), and below it a small centred gold-leaf scroll ornament (no letters) flanked by two short fine pistachio rules. MIDDLE band (from 18% to 86% of the card's height): plain cream card with ONLY a fine double pistachio (#A9C49C) hairline running straight down each side, parallel to the edges, exactly the same at every height, nothing else; the left and right edges perfectly straight and vertical. BOTTOM band (the last 14%): the double hairlines turn the corners and close, a short line of piped white royal-icing scallops with one tiny blush sugar rose bud at its centre sits above the bottom edge, and the bottom edge itself is a row of small round pierced-doily scallops matching the top. No form fields, no photo window. One soft morning window light from the upper left. No cast shadow or drop shadow, no glow outside the card. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: üst ve alt kenar delikli doily tarak (delikler şeffaf); üstte küçük varak süs, altta krema çizgisi + gonca; orta
bantta yalnız iki yandaki düz çift fıstık çizgi (yükseklik boyunca aynı); yan kenarlar dik; gerçek alfa.
Kullanım: home davet kartı, details programı ve G138 blokları (travel, dress code, menu, registry, SSS), RSVP cevap kartı
(kutudan yükselir); Claude üst · orta · alt diye keser, ortayı içeriğe göre uzatır.

#### W2.18 Ayırıcı — krema sıkma çizgisi + şeker gonca
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/rule_piped.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the thin lines of piped icing under the headings of the attached design board. ONE delicate horizontal divider of piped white royal icing, alone, photographed for real: a fine line of tiny, even piped scallops and drop loops with little beads (#FBF5EC, soft cream shade #F1E8D8 in the relief), running perfectly level across about 72% of the image width in the vertical middle of the canvas, tapering finer toward both ends, with one small blush sugar rose bud (#E8B4B8) and two tiny pistachio sugar leaves (#A9C49C) at its exact centre and one tiny gold dragée (#B8995A) on either side of the bud. The whole divider no taller than about 10% of the image height; plenty of empty space above and below. One soft morning window light from the upper left, a crisp sugary relief. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek ince yatay krema çizgisi, ortada gonca + iki yaprak + iki altın draje; kenarlara değmiyor; gerçek alfa.
Kullanım: başlık altları (home, story, details, rsvp); Claude dar şerit olarak kırpar; krem zeminde okunması için CSS ince
gölge ekleyebilir.

#### W2.19 Program ikonları — altı ayrı dosya (koyu gül krema ile sıkılmış)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/icon_rings.png`, `icon_coupes.png`, `icon_cloche.png`, `icon_cake.png`, `icon_parasol.png`, `icon_accordion.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the small programme icons on screen 4 of the attached design board. ONE small icon PIPED in glossy deep-rose royal icing (#9B4F5A, a soft sugary sheen and the round relief of a fine piping nozzle), alone, seen from directly above as if piped flat onto a sheet: one even, rounded piped line about 3% of the image width thick, only a few short piped details, and one or two tiny gold dragées (#B8995A) as accents — simple and clearly readable when shown at 32–40 px, filling about 60% of the square, centred, perfectly straight. Only the piped outline: no fill, no white icing, no paper or cake behind it, no circle, frame or badge around it. All six icons of this set share exactly the same line thickness, colour, sheen and style. One soft morning window light from the upper left. No cast shadow, no glow. No text, letters or numbers. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make six separate images:
icon_rings = two interlocked wedding rings
icon_coupes = two champagne coupes touching at the rim
icon_cloche = a domed dinner cloche on a plate, with a small round handle on top
icon_cake = a three-tier wedding cake with a tiny sugar rose on top
icon_parasol = an open lace-edged parasol with a curved handle
icon_accordion = a small piano accordion with its bellows half open
```
Kontrol: altı dosya, her birinde tek ikon; hepsi aynı kalınlıkta koyu gül krema çizgisi + 1–2 altın draje; 40 px'te
okunuyor; dolgu/rozet/daire/kâğıt yok; gerçek alfa (Claude alfayı maske olarak kullanıp rengini değiştirebilir).
Kullanım: details programı (ceremony = rings, champagne / cocktails = coupes, dinner = cloche, cake / dessert = cake,
dancing / music = accordion), dress code = parasol; her ikon "sıkılarak" çizilir (stroke-reveal maskesi), satır onu izler.

#### W2.20 Geri sayım makaronları — üstten, iki ayrı dosya
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/macaron_top_pistachio.png`, `macaron_top_rose.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the countdown macarons on screen 2 of the attached design board. ONE single French macaron seen from DIRECTLY ABOVE, alone, photographed for real: a perfectly round, smooth, softly domed top shell with a fine matte eggshell surface, the ruffled "feet" just visible all round its edge as a slightly lighter frilled ring; filling about 70% of the square, centred, not cropped. The top is completely smooth and EMPTY (the website writes a number on it): no sugar dust, no decoration, no drizzle, no crack, no spot. One soft morning window light from the upper left giving a gentle highlight on the upper left of the dome. No plate, no surface. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make two separate images, identical in size, shape and light:
macaron_top_pistachio = pistachio shell (#A9C49C)
macaron_top_rose = rose shell (#E8B4B8)
```
Kontrol: iki dosya; tam yuvarlak, üstten, pürüzsüz ve boş üst kabuk; kenarda fırfır "ayak"; aynı ölçü ve ışık; gerçek alfa.
Kullanım: home geri sayımı (sırayla fıstık, gül, fıstık, gül; rakamlar Niconne canlı metin, her saniye küçük "tık");
RSVP seçim çiplerinin rengi için ölçü.

#### W2.21 Düşen küçük nesneler — dört ayrı dosya
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/float_macaron.png`, `float_dragee.png`, `float_petal.png`, `float_curl.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Maison Pâtisserie" wedding website (give design-board.png as the style reference), matching the macarons, gold dragées, sugared petals and ribbon curls scattered on the marble in the attached design board. ONE single small object, alone, photographed for real, centred, not cropped, generous empty margin all round. One soft morning window light from the upper left. Nothing else: no surface, no other objects, no crumbs, no dust, no sparkle. No cast shadow or drop shadow, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make four separate images:
float_macaron = one French macaron at a three-quarter angle, pistachio shells (#A9C49C) with fine ruffled feet and a rose-pink (#E8B4B8) filling, filling about 45% of the square
float_dragee = one round gold sugar dragée (#B8995A) with a smooth metallic sheen and a crisp highlight, filling about 25% of the square
float_petal = one single blush rose petal (#E8B4B8), softly cupped and glittering with fine crystal sugar, a deeper rose shade in its fold, filling about 40% of the square
float_curl = one loose spiralling ringlet curl of the same glossy rose-and-gold curling ribbon as the hatbox, lying on a diagonal, filling about 55% of the diagonal
```
Kontrol: dört dosya, her birinde tek nesne ve birbirinden farklı; yüzey/parıltı yok; gerçek alfa.
Kullanım: açılışın sonunda 6–8 parça mermere düşüp bir kez seker (Claude döndürür/ölçekler); story'de 2–3 parça; RSVP
gönderilince draje ve bukle yağar.

### Instructions for GPT — iş sırası ve teslim (PAKET 8)

```
Work only on PAKET 8 of collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md in the repository muzaffergrl/davetiye-maker (branch main). Ignore every other section of that file: PAKET 2, 6R and 7 are done, PAKET 3 is cancelled, PAKET 5R is the old look that this package replaces, and the note at the top of the file (page_ground / cream_paper / env_back as style references, the envelope geometry) does NOT apply to PAKET 8. Do NOT attach anything from collections/28_Maison_Patisserie/assets/gpt/parts/ that existed before this package (page_ground*, cream_paper, env_*, flap*, sleeve_band, bow*, rosebud, card_small, cameo_frame, plate_frame, shelf, vitrine_wide, corner_spray, divider, cake_stand, accent_*, web_hero) and nothing from platform/themes/; do not attach another design's board.

1. ONE chat, in this order. Send the "Instructions for GPT (send before the first image)" message of PAKET 8 first. Then W1, the design board: attach collections/28_Maison_Patisserie/assets/gpt/photos/hero_portrait.jpg, story_2.jpg and venue.jpg as the identity reference of the couple and the venue only. The board is the design; if it is weak or misses its Kontrol line, make it again before going on (at most 3 tries). Commit and push the board as soon as it is chosen.
2. Then W2, one image per prompt, in the order W2.1 to W2.21, in the same chat. Give the finished design-board.png as the reference image of EVERY W2 image. The hatbox parts must line up: make W2.1 hatbox_closed first; make W2.2 hatbox_lid, W2.3 hatbox_open, W2.4 bolduc_ribbon and W2.5 bolduc_knot by EDITING hatbox_closed.png (same 1024×1536 canvas, same box); make the two W2.6 tissue sheets by EDITING hatbox_open.png. If your tool cannot edit, attach the base image as a reference and keep the box on the same pixels. Check by laying each one over its base at 50% opacity: the outline must sit in the same place at the same size; regenerate once if a shift is plainly visible and write any remaining difference in TESLIM.txt. For W2.7 also give hatbox_open.png; for W2.9 also give vitrine_morning.png; for W2.16 also give porcelain_stand.png and frame_piped_arch.png.
3. Use each English prompt exactly as written. One object per image. No text, letters, numbers, monograms, logos or watermarks in any W2 image (sample text is allowed on W1 only). In the multi-image prompts (W2.6 tissue sheets, W2.19 icons, W2.20 macaron tops, W2.21 small objects) each listed line is its own image and its own file.
4. Keep each image in the ratio of its Kaydet size: 1:1, 2:3 or 3:2 (W1 about 2.3:1). The pixel size may differ. Do not resize, crop, repaint or recolour any pixel with code — Claude crops thin bands and cuts the pieces.
5. Photo windows (W2.13 frame_piped_arch, W2.14 frame_shopfront) are TRANSPARENT openings; a ring that closes all the way round them matters more than the opening itself. Never fill them with green, white, glass or a picture. The glass cloche (W2.16) must be truly see-through (low alpha in the clear glass), never filled white or grey.
6. Counts (curls, stripes, scallops, piping beads, sugar roses, doily holes) do not matter; never regenerate for a count. Regenerate only for: a wrong object, text present, a cast/drop shadow or a glow outside the object, a fake background (white or checkerboard) instead of real alpha, an object touching the canvas edge, a wrong ratio, an opaque cloche, a satin bow instead of curling ribbon, fabric lace instead of pierced paper doily, an oval instead of an arch-topped frame, no visible cream rim edge on hatbox_open, or a hatbox part that plainly does not line up with its base. At most 2 attempts per part; then keep the best one, note the defect and move on.
7. Delivery: commit every PNG to the repository at exactly the path on its Kaydet line, with exactly that file name (the parts in collections/28_Maison_Patisserie/assets/gpt/parts/, the board at collections/28_Maison_Patisserie/assets/gpt/mockups/design-board.png). No zip, no Downloads folder, no other folder, nothing under platform/ or docs/ (not docs/qa either), no new folder, no download names, no "_final", "_v2" or "(1)" suffixes; rejected tries are not committed. Save as PNG. Push to branch main; only if you cannot push to main, push a branch named codex/g28-paket8 and say so on the first line of TESLIM.txt. Run git pull --rebase origin main before each push. Push after W1, then after W2.6, W2.10, W2.14, W2.18 and W2.21 ("28 PAKET 8: W1", "28 PAKET 8: W2 1/5", …) so nothing is lost if the chat breaks; the last commit is "28 PAKET 8: teslim". Touch no other file, write no code, do not run gpt_yerlestir.py or build_images.py.
8. Finally write collections/28_Maison_Patisserie/assets/gpt/parts/TESLIM.txt in Turkish: branch and last commit; how many files were delivered (expected: the board + 31 parts); for every file the target size and the actual size, RGBA or RGB (real alpha channel or not), the number of attempts and every difference from its Kontrol line (be specific); the alignment results (hatbox_lid, hatbox_open, bolduc_ribbon and bolduc_knot against hatbox_closed; the two tissue sheets against hatbox_open: shift yes/no, roughly how much); whether the cloche's clear glass is really see-through; anything skipped and why; which reference images were attached; and one line confirming that no pixels were changed by code. If you cannot write to the repository at all, stop and say so clearly in the chat; do not hand the upload to the user.
```
