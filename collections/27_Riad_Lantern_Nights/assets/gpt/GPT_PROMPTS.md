# GPT görsel istekleri — Tasarım 27 · Riad Lantern Nights (2026-10-22 yeniden tasarım)

> **Instructions for GPT:** This design was completely redesigned on 2026-10-22. Generate PAKET 5R (website layers)
> first, in order and in ONE chat, then PAKET 6R (printable invitation). PAKET 2 (sample photos) ALREADY EXISTS — do not
> regenerate it. Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as written, follow its
> checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers,
> names, dates, initials, monograms, logos, brand marks, QR codes or watermarks in any image** (also not on the lantern,
> the stud, the tiles or the card). **No calligraphy, no script-like ornament, no religious symbols** (no crescent and
> star, no hand amulet, no mosque, dome or minaret silhouettes): only craft — geometric zellige, carved cedar, carved
> stucco, pierced brass, silk cord, courtyard flowers. Give W1 `tadelakt_ground.png`, W2 `cotton_paper.png` and W3
> `env_back.png` as the style reference of every later part: the same warm ivory tadelakt plaster, the same ivory cotton
> paper, the same deep teal cotton envelope paper with its saffron-and-teal zellige lining, the same soft warm evening
> light from the top-left. Parts drawn on the same envelope canvas (W3, W4, W5, W7, W8) keep the envelope in exactly the
> same box; W9 and W10 (the lantern unlit and lit) are the same lantern on the same canvas in exactly the same place.

Bu dosya tasarım 27'nin **bütün görsel parçalarının** tek kaynağıdır (`docs/35_22_32_YENIDEN_TASARIM.md`, satır 27). 18–20
Ekim Codex kapağı ve eski PAKET 5 / PAKET 6 bölümleri kaldırıldı (git geçmişinde). Durum: tema **yeniden kurulacak**
(G422–G432, 39 pilotunun yapısı, `docs/34`); parçalar G222–G232 ile beklenir. Tema kurulunca her parçanın nasıl
kullanılacağı aşağıdaki "Kullanım" satırlarındadır; gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar
(isimler, tarih, baş harfler, mekân) HTML'dir, hiçbir görsele pişirilmez.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/27_Riad_Lantern_Nights/assets/gpt/` altındaki `parts/` (PAKET 5R)
  ve `print/` (PAKET 6R). `photos/` (PAKET 2) dolu, dokunulmaz. Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/27_Riad_Lantern_Nights --paket 5` (oran, gerçek alfa, kenar payı,
  foto penceresi) + göz kontrolü. Tema kurulunca `python3 platform/themes/riad-lantern-nights/build_images.py` (her parça
  geldiği anda kullanılır) ve `python3 tools/gpt_kuru_deneme.py --tema riad-lantern-nights --sekil
  collections/27_Riad_Lantern_Nights/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic craft product photography** — real deep teal cotton paper with a faint blind-embossed
  geometric pattern, real glazed zellige tesserae (hand-cut, slightly uneven glaze, fine grout lines), real hand-pierced
  brass, real carved Atlas cedar, real carved ivory stucco, real saffron silk cord and tassel, real magenta bougainvillea
  and white orange blossom; a riad courtyard at blue hour lit by warm lanterns: calm, warm, rich, classic and romantic.
  Not cartoon, not flat vector, not gouache illustration, not a tourist souvenir look.
- Renkler: night teal `#0F2F31` · deep `#0A2324` · saffron `#E3A54A` · brass `#C9A35B` · cedar `#3A2114` · ivory `#F6EAD2`;
  yardımcı: zarf tealı `#16494B`, zellige tealı `#1E6A6A`, tadelakt fildişi `#EFE3CC`, sır beyazı `#F4EFE4`, bougainvillea
  `#B8326A` (çok seyrek). Zellige yalnız safran, teal, fildişi ve çok az koyu teal; kobalt/mavi-beyaz yok (05 ve 30'dan ayrı).
- Işık: **sol üstten sıcak, yumuşak akşam ışığı**; pirinçte sıcak altın parıltı, sırda yumuşak yansıma; bütün parçalarda
  aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil), her kenarda en az %6 boşluk, nesnenin dışında
  gölge/hâle yok (gölgeyi ve fener ışığının duvara vuruşunu site ekler). W10 yanık fenerde ışık **yalnız fenerin kendi
  delikleri ve camı içinde**.
- Foto penceresi yalnız W12 `arch_frame`, W13 `story_frame` ve W14 `venue_frame`'de istenir (prompt'ta ölçüsüyle); diğer
  parçalarda yeşil alan yok.
- Gerçek bir otele/riada, markaya, sanatçıya ya da başka bir satıcının tasarımına benzemesin. **33 Marigold'dan ayrı:**
  sivri jharokha, paisley, kına, fuşya yok. **05'ten ayrı:** limon, majolika, mavi-beyaz çini yok.

## Zarf geometrisi (W3–W5, W7, W8 ve W20 buna göre)
Tuval **1080×1440** (dikey 3:4). Zarf kutusu **x %7–93, y %6–94** (zarf ≈0,73:1). Beş katman **aynı tuvalde, aynı
kutuda** çizilir: W3 arka, W4 ön cep, W5 kapak, W7 çivi, W8 kordon; Claude her birini alfa kutusuna kırpar ve W3'ün
kutusuna göre yerleştirir. Tuval yüzdeleri:
- **Ön cep (W4):** tam genişlik (x %7–93), üst kenarı yanlarda **y %46**, ortada **y %50**'ye inen çok sığ bir iç bükey
  yay; zarfın alt kenarına (%94) kadar; kesik kenar boyunca ince pirinç folyo çizgi.
- **Ters at nalı kemer kapak (W5):** menteşe zarfın üst kenarında (**y %6**), tam genişlik; yan kenarlar dik iner
  **y %26**'ya, orada kenar küçük bir basamakla içe kırılır (kemerin "impost"u, her yanda ~%2), sonra **at nalı eğrisi**
  önce hafifçe dışa şişer (en geniş yeri x %9–91, y ~%36), sonra dönüp aşağı ve içe süpürülerek ortada **hafif sivri
  bir uçta** biter: **(x %50, y %62)**. Kenar boyunca ~%2,5 genişliğinde altın folyo zellige bordür (kapağın üstünde).
  Kapak cebin üst kenarını her yerde örter (yanlarda y %26–46 arası kapak tam genişlikte değil; o aralıkta görünen arka
  astar değil **arka panelin teal kâğıt kenar payıdır** — W3 kenar paylarını bu yüzden x %7–15 / %85–93'te teal kâğıt
  bırakır).
- **Kubbe başlı pirinç çivi (W7):** merkezi **(x %50, y %56)**, çapı tuval eninin **%7**'si (kutu x %46,5–53,5,
  y %53,4–58,6) — kapağın ucunun hemen üstünde, bordürün içinde.
- **Kordon + püskül (W8):** safran ipek kordon çivinin etrafında bir kez dolanır (halka çivinin çevresinde, y %52–60),
  oradan iki uç kapağın ucunun üstünden cebe sarkar: **sol uç** hafif kıvrılarak iner ve **(x %43, y %78)**'de bir pirinç
  kapakla biten safran **püsküle** bağlanır, püskülün ucu **y %90**; **sağ uç** daha kısa iner ve **(x %58, y %71)**'de
  küçük bir pirinç **halka** ile biter (fener W9/W10 bu halkaya asılır). Kordonun kutusu yaklaşık x %38–62, y %51–91.
- **Fener tılsımı (W9 sönük, W10 yanık):** ayrı **600×900** tuval; ikisi aynı fener, aynı yerde (fener x %25–75,
  asma halkası üst ortada **(x %50, y %8)**, fener gövdesinin altı y %92). Sitede asma halkası W8'in sağ halkasına
  **(x %58, y %71)** oturur; fener yüksekliği zarf tuvalinin ~%16'sı (alt ucu ~y %87).
- **Kapağın iç yüzü (W6, açıkken dik):** ayrı tuval **1080×940**: W5'in çizgisi dikey aynalanmış — düz katlama kenarı
  **altta y %93**, x %7–93; yanlar **y %62**'ye çıkar, impost basamağı, at nalı eğrisi yukarıda en geniş (y ~%51), sivri
  tepe **(x %50, y %7)**. Açıkken zarfın üstünde **dik bir kapı kemeri** gibi durur.
- **Kat sırası (alttan üste):** W3 arka → kart (W11) → W4 cep → W5 kapak → W7 çivi → W8 kordon → W9/W10 fener.

Açılış (site.js `MOTION`, toplam ≤ 5,5 s): dokununca fener sönükten yanığa geçer (W9 → W10 çapraz geçiş, 0–500 ms), içinden
sıcak ışık zarfa ve duvara vurur (CSS), hafif salınır → kordon halkası çividen kalkar; kordon, püskül ve fener birlikte
hafif salınarak aşağı düşüp söner (500–1300) → çivi yerinde kalır → kemer kapak üst kenarında **3B** kalkar, 90°'den sonra
iç yüz (W6, zellige) görünür, zarfın üstünde dik bir at nalı kemer olarak durur (1300–2500) → kemer tepeli fildişi kart
(W11) cebin arkasından yükselir, cep dudağını geçince öne gelir ve büyür (2400–3800) → bougainvillea yaprakları, portakal
çiçekleri ve küçük pirinç yıldızlar (W19) kendi fazında süzülür (3400–4800) → home (≤ 5300).

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Fildişi tadelakt sıva (sayfa zemini, kapak)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tadelakt_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat straight-on texture of polished tadelakt lime plaster in a warm ivory (#EFE3CC, gently varying toward #F6EAD2), like the softly burnished wall of a riad courtyard: subtle cloudy trowel movement, a faint satin sheen where the plaster was polished with a stone, a few very fine hairline variations, the gentlest warm tonal drift. Evenly lit by soft warm evening light from the top-left; no cracks, no stains, no holes, no tiles, no pattern, no shadow, no vignette. Calm enough for dark teal text in any size to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 ek yeri yok); sıcak fildişi, düşük kontrast; çatlak/leke/desen yok; üstüne koyu yazı okunur.
Kullanım: tema kurulunca bütün sayfaların ve kapalı zarf sayfasının zemini (CSS tekrar).

#### W2 Fildişi pamuk kâğıt (kartlar, bantlar, form)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/cotton_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of thick handmade cotton paper in a warm ivory (#F6EAD2): a soft felted tooth, a few faint long cotton fibres, the slightest natural cloudiness, an even tone with only the gentlest variation. Evenly lit by soft warm evening light from the top-left; no fold, no crease, no deckle edge, no stain, no shadow, no vignette, no printing, no pattern. Calm enough for fine dark text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; fildişi `#F6EAD2` civarı; desen/leke yok; yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, program kartı, RSVP formu ve zarftan yükselen kartın kâğıt dokusu.

#### W3 Zarfın arkası (zellige astar görünür)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/env_back.png` · 1080×1440 · **Şeffaf zemin**

```
The back panel of an open portrait envelope, seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas (a portrait rectangle, about 0.73:1) with crisp square corners. It is made of deep teal cotton paper (#16494B, shading to #0F2F31) with a faint blind-embossed geometric star pattern. We see its inside: from x 15% to x 85% and from y 9% down to the bottom it is lined with a glazed zellige tile mosaic — hand-cut tesserae forming a classic geometric pattern of eight-pointed stars and interlocking polygons in saffron (#E3A54A), zellige teal (#1E6A6A), glaze white (#F4EFE4) and a little deep teal (#0F2F31), each tessera with a slightly uneven glossy glaze catching the warm light, fine ivory grout lines; a very gentle shade toward the bottom where the front pocket will sit. Outside the lining a margin of the plain teal paper shows along the top and both sides (x 7–15% and x 85–93%). No flap, no front pocket, no stud, no cord, no lantern, no card inside. Soft warm evening light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf x %7–93 · y %6–94; iç yüz safran-teal-beyaz geometrik zellige (kobalt yok); yanlarda ve üstte düz teal kâğıt payı; kapak/cep yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — kapak açılınca kartın arkasında parlayan zellige iç; sahnenin referans kutusu (diğer katmanlar bunun kutusuna göre yerleşir).

#### W4 Zarfın ön cebi
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/env_front.png` · 1080×1440 · **Şeffaf zemin**

```
Only the front pocket of the same portrait deep teal envelope as env_back.png, on the same 1080×1440 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas; the pocket spans its full width (x 7–93%) from its top edge down to the envelope's bottom edge at 94% of the canvas height. Its top edge is one very shallow concave curve: it starts at 46% of the canvas height at both side edges and dips gently to 50% at the horizontal centre, cut clean and crisp, the thickness of heavy paper visible along the cut, with a fine line of brass foil (#C9A35B) running just below the cut edge. The deep teal cotton paper (#16494B) with the same faint blind-embossed geometric star pattern, the soft fold lines of the side flaps and bottom flap barely visible, softly lit by warm evening light from the top-left. Everything above the pocket's edge is completely transparent. No flap, no stud, no cord, no lantern, no card, no tiles. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep tam genişlik; üst kenarı yanlarda %46, ortada %50'ye inen sığ yay + ince pirinç çizgi; üstü tamamen şeffaf; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart bunun arkasından yükselir; cep dudağını geçince öne alınır.

#### W5 Ters at nalı kemer kapak (kapalı, dış yüz)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/flap.png` · 1080×1440 · **Şeffaf zemin**

```
Only the closed flap of the same portrait deep teal envelope, on the same 1080×1440 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas; the flap hangs from a softly rounded fold along the envelope's top edge (6% of the canvas height), full width (x 7–93%). Its outline is an upside-down Moorish horseshoe arch: the two straight sides drop vertically from the fold to 26% of the canvas height, where the edge steps inward by a small notch (about 2% of the width on each side, like the impost of an arch); from there the horseshoe curve first swells slightly outward (its widest point x 9–91% at about 36% of the height), then sweeps round, down and inward in one smooth continuous curve to a gently pointed tip at the horizontal centre at 62% of the canvas height. Along the whole curved and stepped edge, on the flap, runs a narrow border (about 2.5% of the width) of fine brass-gold foil stamped with a tiny geometric zellige interlace, crisp and slightly raised. The rest of the flap is the plain deep teal cotton paper (#16494B) with the same faint blind-embossed geometric star pattern; a whisper of contact shade on the flap itself along its edge. Soft warm evening light from the top-left. Everything outside the flap is completely transparent. No stud, no cord, no tassel, no lantern, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kapak menteşesi %6; yanlar %26'ya dik, küçük impost basamağı, at nalı eğrisi (en geniş ~%36), sivri uç (x %50, y %62); kenarda altın folyo zellige bordür; altı/yanları şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapalı kapak; açılışta üst katlama çizgisinde 3B kalkar, 90°'den sonra W6 iç yüz devralır.

#### W6 Kapağın iç yüzü (açıkken dik duran kemer)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/flap_in.png` · 1080×940 · **Şeffaf zemin**

```
The inside of the same horseshoe-arch envelope flap, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background: the outline of flap.png mirrored vertically, so it now reads as an upright Moorish horseshoe arch doorway. Its straight fold edge is at the BOTTOM, along 93% of the image height, spanning x 7–93% of the width (exactly as wide as the envelope); its two straight sides rise to 62% of the image height, step inward by a small impost notch, the horseshoe curve swells slightly outward (widest at about 51% of the height) and sweeps up and inward to a gently pointed crown at the top centre, at 7% of the image height. The inside is lined with the same glazed zellige mosaic as env_back.png (saffron #E3A54A, zellige teal #1E6A6A, glaze white #F4EFE4, a little deep teal; eight-pointed stars and interlocking polygons, fine ivory grout, glossy uneven glaze catching the light), and the brass-gold foil border with its tiny interlace follows the whole arched edge on the inside too, with a slim margin of teal paper beyond it. Soft warm evening light from the top-left. No stud, no cord, no lantern. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz katlama kenarı altta (%93, x %7–93), yanlar %62'ye, impost, sivri tepe (x %50, y %7); iç yüz zellige + altın bordür; düz renk alan yok; gerçek alfa.
Kullanım: tema kurulunca 3B dönüşün arka yüzü — kapak açıkken zarfın üstünde dik bir at nalı kapı kemeri; home'a geçişte kemer portre çerçevesine (W12) dönüşüyormuş gibi solar.

#### W7 Kubbe başlı pirinç çivi
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/stud.png` · 1080×1440 · **Şeffaf zemin**

```
On the same 1080×1440 canvas as env_back.png and flap.png, in exactly the same place (the envelope box is x 7–93% and y 6–94% of the canvas, but the envelope itself is NOT drawn here), only one small domed brass stud, seen straight on, on a fully transparent background: a hand-made brass rosette fastener whose centre is exactly at x 50% and y 56% of the canvas and whose diameter is 7% of the canvas width (it spans x 46.5–53.5%, y 53.4–58.6%): a smooth polished brass dome (#C9A35B with warm highlights) in the middle, ringed by a fine eight-petal rosette of hammered brass with a beaded edge. Warm golden highlight from the soft evening light at the top-left. Everything else is fully transparent: no flap, no cord, no lantern. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek pirinç çivi, merkez (x %50, y %56), çap tuval eninin %7'si; kubbe + sekiz yapraklı rozet; başka bir şey yok; gerçek alfa.
Kullanım: tema kurulunca kapağın ucunda sabit kalır (kapakla birlikte 3B kalkar); kordon açılışın başında bunun etrafından kalkar.

#### W8 Safran ipek kordon + püskül (çiviye dolanmış)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/cord.png` · 1080×1440 · **Şeffaf zemin**

```
On the same 1080×1440 canvas as env_back.png, flap.png and stud.png, in exactly the same place (the envelope, the flap and the stud are NOT drawn here), only a saffron silk cord, on a fully transparent background. The cord (about 0.9% of the canvas width thick, tightly twisted silk in saffron #E3A54A with a soft sheen and darker amber twists) makes one closed loop around the point where the stud sits — a ring centred at x 50% and y 56% of the canvas, its inner opening just larger than a 7%-wide stud, the loop spanning about y 52–60% — so that the stud will show through the middle of the loop. From the bottom of the loop two ends hang down: the LEFT end falls in a gentle S-curve to x 43% and y 78%, where it enters a small polished brass cap from which a full saffron silk tassel hangs, its fine silk threads ending at about y 90%; the RIGHT end falls more shortly to x 58% and y 71%, where it ends in a small round polished brass jump ring (about 1.6% of the canvas width). Warm evening light from the top-left, soft sheen along the twists. Everything else is fully transparent: no envelope, no stud, no lantern. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: halka (x %50, y %56) çevresinde, ortası boş; sol uçta püskül (pirinç kapak x %43, y %78; uç y %90); sağ uçta pirinç halka (x %58, y %71); zarf/çivi/fener çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca kapanış katmanı; açılışta fener yandıktan sonra halka çividen kalkar, kordon püskül ve fenerle birlikte hafif salınarak düşer ve söner.

#### W9 Delikli pirinç fener tılsımı — sönük
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lantern_unlit.png` · 600×900 · **Şeffaf zemin**

```
A small hand-pierced brass lantern charm, unlit, hanging straight, alone, seen from the front, on a fully transparent background: a tiny traditional riad lantern about the size of a thumb, with a round brass hanging ring at the top centre (its centre at x 50% and y 8% of the canvas), a small domed and pointed brass cap, a faceted body of four slightly bulging brass panels pierced with fine geometric star-and-dot patterns, small panes of pale amber glass behind the piercings, and a short pointed brass finial at the bottom. The lantern spans x 25–75% of the width and y 4–92% of the height. Polished and lightly aged brass (#C9A35B, warm highlights, darker recesses), soft warm evening light from the top-left. It is NOT lit: the amber glass is dim and the piercings are dark, no light, no rays, no sparkle, no glow. No chain, no cord, no hook. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek sönük fener (ışık/hâle yok); asma halkası üst ortada (x %50, y %8); delikli pirinç paneller + kehribar cam; gerçek alfa.
Kullanım: tema kurulunca kapalı zarfta W8'in sağ halkasına asılı (halka (x %58, y %71)); W10 ile tam üst üste.

#### W10 Delikli pirinç fener tılsımı — yanık
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lantern_lit.png` · 600×900 · **Şeffaf zemin**

```
Exactly the same hand-pierced brass lantern charm as lantern_unlit.png, on the same 600×900 canvas, in exactly the same place, the same size and the same pose (hanging ring centred at x 50% and y 8%, the lantern spanning x 25–75% and y 4–92%), on a fully transparent background — but now it is LIT from inside by a tiny warm flame: the amber glass panes glow a warm honey-gold (#FFD08A to #E3A54A), every star-and-dot piercing shines as a bright warm point of light, and the brass around the piercings catches a warm inner glow. The light stays ONLY inside the lantern's own glass and piercings: no rays, no halo, no glow, no light spots outside the lantern's outline, the background fully transparent. The outside of the brass is still lit by the same soft evening light from the top-left. No chain, no cord, no hook. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: W9 ile aynı fener, aynı yer ve boy (üst üste konunca kaymaz); delikler ve cam sıcak yanıyor; dış hatta hâle/ışın yok; gerçek alfa.
Kullanım: tema kurulunca açılışın ilk anı — W9'un üstünde 0→1 çapraz geçiş; duvara düşen sıcak ışığı site ekler. Home imzasında ve RSVP gönderiminde de yanık tılsım.

#### W11 Kemer tepeli kart (zarftan yükselen, boş)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen straight on, on a fully transparent background: thick ivory handmade cotton paper as cotton_paper.png (#F6EAD2), spanning x 7–93% and y 6–94% of the canvas. Its bottom corners are square and its sides straight; its top is cut in the shape of a Moorish horseshoe arch with a gently pointed crown at the top centre (the arch begins at 30% of the card's height on both sides). Inside the edge, about 4% in, runs a fine brass-gold foil line that follows the arch and the sides, and just inside the crown of the arch sits a small cluster of three glazed zellige tesserae forming a tiny eight-pointed star (saffron, zellige teal and glaze white), about 12% of the card's width. Below it the card is completely EMPTY paper (the website sets the names, the date and the venue there in HTML). A hair-fine contact shade only on the card's own edge, soft warm evening light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: at nalı kemer tepeli fildişi kart; içte ince altın çizgi; tepede küçük zellige yıldız; altı tamamen boş; gerçek alfa.
Kullanım: tema kurulunca zarftan yükselen kart ve home kartı (isimler, tarih, mekân HTML olarak yıldızın altında).

#### W12 Alçı at nalı kemer çerçeve (home portresi)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/arch_frame.png` · 1000×1300 · **Şeffaf zemin**

```
A portrait photo frame in the shape of a Moorish horseshoe arch window, alone, seen straight on, on a fully transparent background: a wide frame of finely carved ivory stucco (#F4EFE4 with warm shading in the carving) — delicate geometric interlace and small rosettes, crisp hand-carved depth — edged on the outside by a slim moulding of carved Atlas cedar (#3A2114, warm oiled wood grain) and on the inside by a narrow band of glazed saffron-and-teal zellige tesserae. The frame's outer edge spans about x 6–94% and y 5–95% of the canvas, its top following the horseshoe arch with a gently pointed crown. In the middle a photo window filled with flat pure green #00FF00 (no texture, no shading, crisp edges, nothing over it), shaped as a horseshoe arch: its bounding box is exactly 720 px wide and 900 px tall (4:5), its top-left corner at x 140 px, y 250 px; the window's sides are straight from its bottom up to y 500 px, then it follows the horseshoe arch (slightly wider than the straight part, then closing to a gently pointed top at y 250 px). Soft warm evening light from the top-left. No lantern, no flowers, no glass over the window. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yeşil pencere at nalı kemer biçimli, kutusu 720×900 (4:5), sol üst (140, 250); oyma alçı + sedir + zellige; pencereye binen yok; gerçek alfa.
Kullanım: tema kurulunca pencere maskesi yeşil alanın kendisinden alınır (dikdörtgen değil; kemer köşelerindeki alçı silinmez) → home portresi; foto fener ışığı süpürmesiyle belirir.

#### W13 Sedir at nalı kemer pencere (story çerçevesi)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/story_frame.png` · 1000×1500 · **Şeffaf zemin**

```
A tall carved cedar window frame in the shape of a Moorish horseshoe arch, alone, seen straight on, on a fully transparent background: deep, richly carved Atlas cedar (#3A2114, warm oiled grain with honey highlights) with a geometric carved interlace and a small row of carved rosettes in the spandrels, a fine inner moulding of brass (#C9A35B) and an outer stepped moulding. The frame's outer edge spans about x 6–94% and y 5–95% of the canvas, its top following the horseshoe arch with a gently pointed crown. In the middle a photo window filled with flat pure green #00FF00 (no texture, no shading, crisp edges, nothing over it), shaped as a horseshoe arch: its bounding box is exactly 680 px wide and 1020 px tall (2:3), its top-left corner at x 160 px, y 300 px; the window's sides are straight from its bottom up to y 560 px, then it follows the horseshoe arch to a gently pointed top at y 300 px. Soft warm evening light from the top-left. No shutters, no grille, no glass over the window, no lantern, no flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yeşil pencere at nalı kemer biçimli, kutusu 680×1020 (2:3), sol üst (160, 300); oyma sedir + pirinç iç pervaz; pencereye binen yok; gerçek alfa.
Kullanım: tema kurulunca pencere maskesi yeşil alandan → story'deki üç uzun pencere (sol–sağ–sol) ve home hikâye tanıtımı; foto karanlıkta bekler, kaydırınca yukarıdan aşağı sıcak ışık süpürmesiyle belirir.

#### W14 Geniş sedir çerçeve + kemerli alçı friz (mekân)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/venue_frame.png` · 1600×1100 · **Şeffaf zemin**

```
A wide landscape photo frame, alone, seen straight on, on a fully transparent background: a frame of carved Atlas cedar (#3A2114, warm oiled grain) with a fine inner brass moulding (#C9A35B), its outer edge spanning about x 5–95% and y 6–94% of the canvas; its top border is deeper and holds a carved ivory stucco frieze of three small horseshoe arches side by side (delicate geometric carving, crisp depth), centred above the window, and the bottom border has a narrow band of glazed saffron-and-teal zellige tesserae. In the middle a landscape photo window exactly 1280 px wide and 720 px tall (16:9), its top-left corner at x 160 px, y 260 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The frieze stays entirely above the window. Soft warm evening light from the top-left. No glass, no lantern, no flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00` dikdörtgen 1280×720 (16:9), sol üst (160, 260); üstte üç kemerli alçı friz pencerenin üstünde kalıyor; altta zellige bant; gerçek alfa.
Kullanım: tema kurulunca `keyed_window` (dikdörtgen tümden şeffaf + 10 px halkada yeşil taşmasını nötrle) → details'te mekân fotoğrafı.

#### W15 Köşe süsü (bougainvillea + portakal çiçeği)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/corner_spray.png` · 1200×1000 · **Şeffaf zemin**

```
A restrained, elegant corner spray growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: a few sprigs of magenta bougainvillea (#B8326A, papery bracts with tiny cream flowers in their hearts, used sparingly), small clusters of white orange blossom with waxy petals and pale yellow stamens, glossy dark green orange leaves, and one fine curl of saffron silk cord with a tiny brass bead winding through the stems. Airy and light, not dense: plenty of space between the elements. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right half of the canvas is completely empty. Soft warm evening light from the top-left. No lemons, no oranges (fruit), no vase, no lantern, no tiles. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sol üstten çıkan seyrek küme, sağ alt yarı boş; bougainvillea az, portakal çiçeği; meyve yok; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşeleri (sağda aynalanır), imza ve RSVP kapanışında küçük; kapakta en fazla bir köşede ve asla metnin altında değil.

#### W16 Zellige ayırıcı (bölüm ayırıcı)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider, alone, on a fully transparent background: a fine straight line of polished brass (#C9A35B) running across x 8–92% of the canvas at the vertical centre, and at its centre a small row of five glazed zellige tesserae forming a tiny geometric star motif (saffron, zellige teal and glaze white, the middle tessera an eight-pointed star slightly larger), with one tiny brass bead on the line on each side of it; the line tapers to fine points at both ends. Soft warm evening light from the top-left, a glossy glint on the glaze. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay pirinç çizgi, ortada küçük zellige yıldız motifi, uçlar incelir; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet ve gün, details program, RSVP formu).

#### W17 Asılı büyük pirinç fener (yanık)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/hanging_lantern.png` · 700×1400 · **Şeffaf zemin**

```
A large hand-pierced brass riad lantern hanging from a short brass chain, lit from inside, alone, seen from the front, on a fully transparent background: the chain starts at the top centre at 6% of the canvas height; the lantern has a domed, pointed brass crown, a tall faceted body of six panels pierced with fine geometric star-and-dot patterns over warm amber glass, and a pointed finial with a small brass drop at the bottom at 93% of the height; the lantern body spans about x 18–82% of the width. A warm flame inside makes the amber glass glow honey-gold and every piercing shine as a bright warm point, while the brass outside is lit by the soft evening light from the top-left. The light stays ONLY inside the lantern's own glass and piercings: no rays, no halo, no light spots outside the outline. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zincirli tek büyük fener, içten yanık; ışık yalnız cam ve deliklerde; dışta hâle yok; gerçek alfa.
Kullanım: tema kurulunca home gün özetinin ve RSVP formunun üstünde asılı, çok hafif salınır (CSS); altına sıcak ışık hâlesini site ekler.

#### W18 Zellige karosu (dikişsiz, sırayla dizilen bant)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/zellige_tile.png` · 768×768 · opak, dikişsiz

```
A seamless, tileable, perfectly flat straight-on square of glazed zellige mosaic, the same tesserae and colours as env_back.png: one complete repeat of a classic geometric pattern centred on one eight-pointed star, surrounded by interlocking polygons, in saffron (#E3A54A), zellige teal (#1E6A6A), glaze white (#F4EFE4) and a little deep teal (#0F2F31); hand-cut tesserae with slightly uneven glossy glaze and fine ivory grout lines, evenly lit by soft warm evening light from the top-left with a gentle glossy sheen. The pattern continues seamlessly across all four edges so squares placed side by side form one continuous mosaic. No border, no crack, no shadow, no vignette. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek tekrar, ortada sekiz kollu yıldız; dört kenarda dikişsiz; astarla aynı renkler; kobalt yok.
Kullanım: tema kurulunca home'daki zellige bandı — karolar kaydırınca çini çini (stagger) dizilir; RSVP kapanışında ince şerit.

#### W19 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, soft warm evening light from the top-left. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files, the same light and scale: 1 = one single papery magenta bougainvillea bract (#B8326A), heart-shaped with fine veins, slightly curled; 2 = one single white orange blossom with five waxy petals and pale yellow stamens; 3 = one tiny eight-pointed star cut from polished brass (#C9A35B), slightly domed, catching a warm glint.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (bougainvillea yaprağı, portakal çiçeği, pirinç yıldız); kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışın sonunda ve RSVP gönderilince süzülen küçük nesneler (her biri ayrı katman, kendi fazında).

#### W20 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic craft product photography, soft warm evening light from the top-left: the closed portrait deep teal envelope of flap.png with its upside-down horseshoe-arch flap and brass-gold zellige border, closed with the saffron silk cord wound once around the brass stud (as stud.png and cord.png), its saffron tassel and the small pierced brass lantern charm (lit, as lantern_lit.png) hanging over the pocket, lying slightly below the centre on warm ivory tadelakt plaster (as tadelakt_ground.png); at the left a few sprigs of magenta bougainvillea and white orange blossom (as corner_spray.png); at the right a large lit pierced brass lantern (as hanging_lantern.png) standing on the plaster and two or three loose glazed zellige tesserae; behind, softly out of focus, a carved cedar arch and warm lantern light. Only teal, saffron, brass, cedar and ivory tones, a touch of magenta. The top 20% of the image is calm and soft (only out-of-focus plaster and warm light). This image is cropped to 1200×630 for link previews: keep the whole envelope, cord and lantern charm visible with at least 5% empty margin below them. No people. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf + kordon + fener tılsımı bütün, altında ≥%5 boşluk; üst %20 sakin; dini simge/yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım) ve katalog kapağı.

---

## PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Demo içeriği (`content.demo.json`): **Leila & Adrian**, *The Saffron Courtyard Riad*, Marrakech, October 9, 2027. Kurgu
kişiler: **gerçek bir kişiye (ünlü dahil) benzemesin**; yüzler doğal, yaşları 28–34; tek bir kurgu çift beş fotoğrafta da aynı
kişiler. Leila: koyu dalgalı omuz boyu saç, sıcak zeytin teni, sade fildişi ipek gece elbisesi (gelinlik değil, sade).
Adrian: kısa açık kahve saç, açık ten, lacivert takım, kravatsız açık yaka. Kostüm, yerel kıyafet taklidi, klişe yok.
Fotoğraf gerçekçi (PAKET 5'in gouache'ı değil), sıcak fener ışığı, sinematik ama doğal. Yazı, logo, filigran yok.

#### 2.1 Portre (davet kartı ve home)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/hero_portrait.jpg` · 1024×1280 (4:5)

```
A warm, natural portrait photograph of a fictional couple in their early thirties (they must not resemble any real person): she has shoulder-length dark wavy hair and wears a simple ivory silk evening dress, he has short light-brown hair and wears a navy suit with an open collar. They stand close, smiling softly, framed from the waist up, in a riad courtyard at blue hour, lit by warm pierced brass lanterns; teal tiled walls and a little magenta bougainvillea softly out of focus behind them. Faces in the upper middle of the frame. Photorealistic, natural skin, no heavy retouching. No text, no logo, no watermark.
```

#### 2.2 Story 1 — "Our first evening" (uzun pencere)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_1.jpg` · 1024×1536 (2:3)

```
The same fictional couple (same faces, hair and clothes) sharing mint tea at a small mosaic table on a lantern-lit riad terrace in the evening, laughing, seen from a little distance; warm saffron lantern light, teal shadows. Vertical photo, the couple in the middle third. Photorealistic. No text, no watermark.
```

#### 2.3 Story 2 — "Among the lanterns"
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_2.jpg` · 1024×1536 (2:3)

```
The same fictional couple walking hand in hand under many hanging pierced brass lanterns in a quiet covered passage at night, warm light patterns falling on the walls, seen from behind at a three-quarter angle so their faces are only partly visible. Vertical photo. Photorealistic. No shop signs, no text, no watermark.
```

#### 2.4 Story 3 — "Yes, under the stars"
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_3.jpg` · 1024×1536 (2:3)

```
A close photograph of the same fictional couple's joined hands with a simple gold engagement ring, resting on a teal and ivory zellige tabletop beside a small lit brass lantern and a few magenta bougainvillea bracts, night, shallow depth of field. Vertical photo. Photorealistic. No text, no watermark.
```

#### 2.5 Mekân — "The Saffron Courtyard Riad" (kurgu)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/photos/venue.jpg` · 1536×864 (16:9)

```
A wide photograph of a fictional riad courtyard set for an evening wedding: a central tiled fountain, an orange tree, low cedar tables with ivory linen and candles, carved stucco arcades, teal and saffron zellige, many lit brass lanterns hanging overhead and bougainvillea on the columns, at blue hour. It must not reproduce any real, identifiable hotel or riad. No people, no text, no signs, no watermark.
```

Kontrol (PAKET 2): beş fotoğrafta aynı kurgu çift; gerçek kişiye benzemiyor; yazı yok; oranlar doğru (`python3 tools/kit_check.py collections/27_Riad_Lantern_Nights --paket 2`).

---

---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, `'riad-lantern-nights'` bloğu). Bugünkü blok eski
> zeminleri (`print/print_front.png`, `print/print_back.png`; 18–19 Ekim görünümü) kullanıyor; yeni zeminler gelince ona
> geçilir. **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px**
> = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (oran 0,713) aynı sayfadan yanlardan ~%0,8
> kırpılarak basılır. Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda. Mürekkep koyu teal/sedir (açık kâğıt üstünde).
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'riad-lantern-nights'` bloğunda `sources` → `{ front: 'print/invitation_front_r_5x7.png', back:
>    'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }` (aynı kalır); `front`/`back` kutularını yeni görselde ölç (süslemenin ~%2 dışında
>    kalsın; `tests/g149-print-layout.test.ts`); ink `#0F2F31`, accent `#8F5418` önerisi gözle doğrulanır.
> 2. `cd platform && node scripts/build-print-assets.ts --theme riad-lantern-nights` ve `node scripts/print-sample.ts
>    --theme riad-lantern-nights --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.
> 3. Eski `print_front.png` / `print_back.png` dosyaları blok geçince silinebilir (entegratör kararı).

#### P1 — Ön yüz
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the thick ivory handmade cotton paper of cotton_paper.png (#F6EAD2). Across the top, between 9% and 91% of the width, a band in the shape of a shallow horseshoe-arch crown: a fine brass-gold foil line (#C9A35B) that rises from both sides into a gently pointed arch at the centre, with a narrow row of small glazed saffron-and-teal zellige tesserae following it, and at the crown a small cluster of tesserae forming one eight-pointed star; a few sprigs of white orange blossom and two or three magenta bougainvillea bracts tucked at the two ends of the band; nothing in this top band reaches lower than 17% of the height. Along the bottom, between 92% and 96% of the height and from 14% to 86% of the width, a slim border of the same zellige tesserae between two fine brass-gold foil lines, with one tiny eight-pointed brass star at its centre. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no tile, no petal, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges. Soft warm light from the top-left. Only ivory, teal, saffron, brass and a touch of magenta. No calligraphy, no religious symbols. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; kemer tepeli zellige bant yalnız üstte (%17'nin üstünde), zellige bordür yalnız altta; yan %8 boş; yazı/dini simge yok.

#### P2 — Arka yüz
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same thick ivory cotton paper, only a short slim brass-gold foil line across the top centre (between 32% and 68% of the width) with a tiny eight-pointed star of glazed saffron-and-teal zellige tesserae at its middle and one white orange blossom beside it, its lowest point staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no tile, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada kısa altın çizgi + küçük zellige yıldız (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

## PAKET 3 — Etsy ilan sahneleri — GEÇERSİZ (2026-10-22: yeniden tasarım; tema kurulunca yeniden yazılacak)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Yazan: G175 (`tools/paket3_sahne.py` şablonu, 01–21 ile aynı). `tools/listing_editorial.py` 3.1, 3.2, 3.4 ve 3.5'i
> kullanır (ilan görselleri 1, 2, 8, 4); 3.3 yedek sahnedir.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a teal zellige-tiled table top in a lantern-lit courtyard and pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a teal zellige-tiled table top in a lantern-lit courtyard, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a teal zellige-tiled table top in a lantern-lit courtyard, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a teal zellige-tiled table top in a lantern-lit courtyard, slightly right of center and rotated about 8 degrees, surrounded at the edges by pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a low cedar daybed with saffron and teal cushions and a brass-rimmed tea glass; a small arrangement of pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
