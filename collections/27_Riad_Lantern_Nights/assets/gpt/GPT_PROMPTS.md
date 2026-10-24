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

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 27`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Riad Lantern Nights". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, the same light and the same color world (night teal, saffron, brass and cedar). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a teal zellige-tiled table top in a lantern-lit courtyard, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a teal zellige-tiled table top in a lantern-lit courtyard, pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and pierced brass lanterns glowing warm, a small carved cedar box. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a teal zellige-tiled table top in a lantern-lit courtyard, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a teal zellige-tiled table top in a lantern-lit courtyard, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a teal zellige-tiled table top in a lantern-lit courtyard: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a teal zellige-tiled table top in a lantern-lit courtyard: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a teal zellige-tiled table top in a lantern-lit courtyard, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes pierced brass lanterns glowing warm, a small carved cedar box; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a teal zellige-tiled table top in a lantern-lit courtyard, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a teal zellige-tiled table top in a lantern-lit courtyard: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: pierced brass lanterns glowing warm, a small carved cedar box, a fold of saffron silk, a few orange blossoms and a brass-rimmed tea glass. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: night teal, saffron, brass and cedar. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.

---

## PAKET 8 — Riad Lantern Nights yeniden tasarım (2026-10-24)

> Kullanıcı (2026-10-23/24): 21'den itibaren her tasarım "çok iyi bir profesyonel tasarımcının elinden çıkmış gibi" olacak
> ("cesur ve yaratıcı ol"); kendine özgü bileşen, hareket ve ses. 27'nin bugünkü sitesi (teal zarf + at nalı kemer kapak +
> safran kordon + fener tılsımı, PAKET 5R) çıta değildir. PAKET 8 tasarımı baştan GPT'ye çizdirir (K21): önce **W1** tasarım
> panosu, sonra aynı sohbette panodan türeyen **W2** parçaları (27 dosya). Tema bu parçalarla yeniden kurulur (Claude: kesim,
> maske, ölçek, ışık, HTML/CSS/JS; çizim yok). Dosyanın başındaki "Instructions for GPT" notu (tadelakt_ground / cotton_paper /
> env_back referansları) ve "Zarf geometrisi" bölümü PAKET 8'e **uygulanmaz**.
>
> Claude için notlar:
> - W1'in kayıt satırı bilerek kalın değil: yol `mockups/` altında olduğu için `kit_check` / `gpt_yerlestir` orada yeşil ekran
>   arar. Panoyu GPT doğrudan commit eder; `gpt_yerlestir`'e verilmez.
> - W1 demo metni `content.demo.json` ile aynı: Leila & Adrian · Saturday, October 9, 2027 · The Saffron Courtyard Riad,
>   Marrakech, Morocco · RSVP son günü August 15, 2027 · program 6:00 / 7:00 / 8:30 PM (yer adlarıyla) · dress code Evening
>   attire · story 2. altyazı "Among the lanterns" · yemek seçenekleri Vegetarian / Fish / Lamb. Geri sayım örneği 350 gün
>   (2026-10-24'ten). RSVP etiketleri temanın kopyasından (`Will You Join Us?`, `Kindly reply by`, `Will you attend?`, `Send reply`).
> - Dosya adları bilerek eski adlardan farklı (PAKET 5R: `env_*`, `flap*`, `stud`, `cord`, `lantern_*`, `hanging_lantern`,
>   `card_small`, `*_frame`, `corner_spray`, `divider`, `zellige_tile`, `tadelakt_ground`, `cotton_paper`, `accent_*`,
>   `web_hero`; geçersiz eski PAKET 5: `doors_closed`, `doorway`, `courtyard`, `lantern`, `frame_*`, `tile_*`, `bg_*`,
>   `bougainvillea_*`, `mask_*`): `gpt_is_listesi` aynı yolda dosyadaki ilk prompt'u alır. Eski parçalar diskte kalır; tema
>   yeniden kurulana kadar canlı site onları kullanır.
> - **Açılış nesnesi zarf değil, riadın sokak kapısı** (23 kutu, 24 program, 25 kompartıman penceresi gibi PAKET 8'de K23
>   "sıkı zarf"tan sapma; entegratör `DESIGN_BRIEF.md`'yi günceller). İlk kapı sürümünün (`docs/24`) red nedenleri burada yok:
>   kanatlar boş krem panel değil (oyma + pirinç çivili teal boyalı sedir), isimler sakin sıva üstünde (çiçek zemin yok), kapının
>   ardındaki avlu home hero'nun ta kendisi (iç sayfalar kopuk değil). En yakın tip `kapi` (06 gatefold) ama kanatlar **içe**
>   (uzağa) açılır ve **çerçevenin arkasında** durur: `rotateY` dış pervaz menteşesinde 0→∓78° + perspektif; arka yüz gerekmez.
>   START HERE / panel açılış adı "Door" olur (G175'teki eski `door` adı) — entegratör kararı.
> - `portal_*` beş parça aynı 1024×1536 tuvalde, aynı kutuda; W2.2–W2.5, W2.1 **düzenlenerek** üretilir. Hiza (dış kutu, kemer
>   çizgisi ±%1,5) PAKET 8 için otomatik koşmaz; Claude `tema_build.hiza_olc` ile ölçer, her katmanı kendi alfa kutusundan keser,
>   ölçülen kutusuyla yerleştirir. Kat sırası (alttan): `courtyard_bluehour` (açıklığın arkasında) < `portal_leaf_l` /
>   `portal_leaf_r` < `portal_cord` < `portal_frame` < `lamp_*` < `lamp_light` (screen). Fener (`lamp_*`) ayrı tuval; üst halkası
>   `portal_frame`'deki kemer tepesi halkasına (x %50, y ≈%25) asılır, fenerin ucu ≈ y %50 (halka kulpların üstünde kalır).
> - **İmza katmanı `lamp_light`:** opak, **saf siyah zeminde** sıcak ışık deseni (yeşil ya da şeffaf değil). Claude
>   `mix-blend-mode: screen` ya da build'de parlaklık→alfa ile kullanır; döndürür, ölçekler, kaydırır, bulanıklaştırır (ışık işi,
>   çizim değil). Kenar ve köşeler siyah olduğu için dönerken kare görünmez. "Işıma yok" kuralı bu parçaya uygulanmaz.
> - Foto pencereleri (`niche_portrait`, `story_arch`, `gallery_arch`) yeşil değil, **şeffaf açıklık** (21 TESLİM: yeşil
>   tutmuyor); prompt'larda bilerek yeşil hex kodu yok. Maske kapalı halkanın içindeki şeffaf bölgeden. Story kafesi
>   (`mashrabiya_panel`) fotoğrafın önünde, çerçevenin arkasında; pencere maskesiyle kırpılıp yukarı kayar.
> - İnce şerit (ayırıcı) 3:2 tuvalde ortada bant olarak istenir; Claude kırpar. `card_riad` dikey 3 dilim (22 `card_gilt` gibi).
>   Bütün ölçüler GPT'nin yerel tuvalleri (1024×1024, 1024×1536, 1536×1024); pano ≈1908×824.
> - 30 Azulejo aynı anda yeniden tasarlanıyor ve "karolar tek tek döner" onun imzası: 27'nin eski "zellige karoları çini çini
>   dizilir" hareketi bırakıldı. Zellige 27'de durağan zanaattır; hareket ışıkta, kafeste ve kapıdadır. Mavi-beyaz boyalı karo yok.
> - Paylaşım (og) görseli ayrıca istenmedi: Claude `courtyard_bluehour_wide` + `portal_closed` + `lamp_lit` + `lamp_light`'tan
>   kurar (eski `web_hero` yerinde kalır). PAKET 6R basılı davetiye ve PAKET 3/7 ilan sahneleri bu turda değişmez.
> - Palet aileleri korunur: G177 `variants/recolor.json` aileleri teal / lantern (safran) / cedar; 5 renk varyantı bunlara bağlı.
>   Parçalar gelince aile çapaları gerçek parçalarda ölçülür, `recolor_parts.py build/check` yeniden koşar (teal kapı kanatları
>   varyantlarda zümrüt, çivit … kapı olur). Gül yaprağı pembesi hiçbir aileye girmez (dokunulmaz).
> - Fontlar değişir: Cinzel + Marcellus SC + Marcellus (Cinzel 07 ve 22'de, Marcellus 10'da da var) → **Habibi + Piazzolla**
>   (aşağıda; 26'nın paralel briefi Kalnia'yı aldığı için Kalnia değil). Habibi tek ağırlık (400) ve eski stil rakamlı: tarih,
>   etiket ve geri sayım rakamları Piazzolla'da (`lining-nums`). `scripts/font-fallback.ts` yeniden koşar; `DESIGN_BRIEF.md`,
>   `COLLECTION_STATUS.md` entegratörde. Prova şekli `kuru_sekil.json` ve tema testi yeni katmanlara göre yeniden yazılır.
> - Ses dosyası yok: aşağıdaki ipuçlarını Claude sentezler (`tools/audio_fx.py`; AGENTS şart 9); ilk dokunuştan önce sessiz.

### Sanat yönetimi — "The door left open"

- **Signature: the lantern's light.** A pierced brass lantern throws a pattern of small warm stars, dots and teardrops of light,
  and that moving light walks with the guest through an imaginary riad at the blue hour: it blooms over the door at the opening,
  drifts across the courtyard walls on home, falls through the cedar lattice on story, travels down the programme on details and
  blooms again when the reply is sent. It is one GPT layer (`lamp_light`) that the site turns, moves and fades.
- **Opening = the riad's street door, opening in separate pieces.** On a calm ivory tadelakt wall at dusk: a horseshoe-arch
  doorway in a carved stucco frame edged with zellige, under a small cedar canopy roofed in teal tiles; two carved cedar leaves
  painted deep teal (the old teal envelope becomes the door) and studded with brass nail heads tracing an eight-pointed star; two
  brass ring pulls tied with a saffron silk cord; a pierced lantern hanging from the crown of the arch. Tap → the lantern lights
  and its star-light blooms over door and wall, turning slowly as the lantern sways → the silk knot slips and the cord falls
  → the two leaves swing inward one after the other, a widening wedge of warm light between them → the camera steps over the
  threshold (frame and lantern grow past the screen edges) into the blue-hour courtyard → rose petals and orange blossoms drift
  out on the evening air → home. No plain fades.
- **Inside the riad.** Home = the courtyard itself (names in the open square of sky, fountain with rose petals, lit lanterns),
  the portrait in a carved stucco horseshoe niche, the countdown floating on the fountain's water among petals. Story = three tall
  cedar horseshoe windows on a night-teal plaster wall; in each a turned-cedar mashrabiya lattice slides up to uncover the photo
  while lantern light passes through it. Details = "The Day" on an ivory card with brass pictograms; the venue seen from the upper
  gallery under a scalloped stucco arch. RSVP = an ivory card under a hanging lantern; on send the lantern lights, its light
  blooms over the wall and a rose petal lands on the fountain's water with a ripple.
- **Materials & colour (palette families kept for the G177 variants).** Real, photographed craft: polished tadelakt plaster,
  hand-cut glazed zellige, carved cedar (painted teal on the door), carved ivory stucco, pierced and hammered brass, saffron silk,
  white marble, still water. night teal `#0F2F31` · deep `#0A2324` · door teal `#16494B` · zellige teal `#1E6A6A` · saffron
  `#E3A54A` · brass `#C9A35B` · cedar `#3A2114` · ivory `#F6EAD2` · tadelakt `#EFE3CC` · glaze white `#F4EFE4` · lantern light
  `#FFD08A` · damask-rose petals `#D98A8F` (petals only) · bougainvillea `#B8326A` (very sparing).
- **Respect, not costume.** Only craft and architecture. Never camels, fezzes, kaftans or djellabas, belly dancers, snake
  charmers, magic carpets, genie oil lamps, souk clutter, desert dunes, palm silhouettes; no hand-shaped (hamsa) knocker, crescent
  and star, mosque, dome or minaret; no Arabic or pseudo-Arabic script, calligraphy, inscription bands or letter-like ornament.
- **Not the others.** 21 red roses, velvet, envelope + wax seal, gold oval · 22 moon, night lake · 23 jewel box, pearls, gems ·
  24 paper theatre, stage curtains, tickets · 25 train window, travel poster, luggage · 26 washi, kintsugi · 29 starry sky,
  constellations · 30 blue-and-white painted tiles flipping one by one · 31 paper sky lanterns · 33 pointed jharokha, paisley,
  henna, marigolds · 05 lemons, majolica · 06 Art Deco fans, gatefold card doors · 11 terracotta arch pocket, pampas. 27 now has
  no envelope, no whole roses (pale petals only) and no stars in the sky (its star shapes are lantern piercings and zellige).
- **Type (Google Fonts; no other theme or parallel brief uses them — verified 2026-10-24, HTTP 200 alone and combined as
  `family=Habibi&family=Piazzolla:ital,opsz,wght@0,8..30,300..700;1,8..30,300..700`; latin + latin-ext).** *Habibi* 400 —
  names, page headings and programme event names (names ≥ 32 px): a high-contrast serif with sharp, chiselled wedge serifs and a
  calligraphic stress, like letters cut into carved stucco; Latin only. *Piazzolla* + italic — body, captions, places and the
  form, plus widely letter-spaced capitals (wght 500–600, lining figures) for dates, labels and buttons and light lining numerals
  (wght 300) for the countdown: a warm humanist book serif with a flowing italic. Replaces Cinzel + Marcellus SC + Marcellus.
- **Sound (Claude synthesises; silent until the first tap).** (1) a match strike and a small flame catching, the lantern's chain
  creaking once; (2) a silk cord sliding through brass rings, two small brass beads tapping the wood; (3) a deep wooden latch knock,
  then a soft air push as the heavy leaves swing and a faint brass ring clink when they stop; (4) the courtyard opening up: a
  fountain's trickle and orange-tree leaves rustling, a few seconds, very low; (5) story: a short cedar-on-cedar slide as each
  lattice rises; (6) RSVP sent: mint tea poured from a height into a glass, then one drop into still water.

**Instructions for GPT (send before the first image):**
```
You are the art director and still-life photographer of a luxury wedding stationery house, designing the mobile wedding website "Riad Lantern Nights" from scratch. Its signature: the guest is welcomed into an imaginary riad — a courtyard house in old Marrakech — at the blue hour, and a pierced brass lantern throws a moving pattern of small warm stars, dots and teardrops of light that follows the guest from page to page. The website opens on the riad's street door: a horseshoe-arch doorway in carved ivory stucco edged with glazed zellige, under a small cedar canopy roofed in teal tiles; two carved cedar door leaves painted deep teal and studded with brass nail heads; two brass ring pulls tied with a saffron silk cord; a pierced brass lantern hanging from the crown of the arch. Behind the door: a courtyard with a white marble fountain, rose petals on the water, an orange tree and lit lanterns. Everything is real and photographed: polished tadelakt lime plaster, hand-cut glazed zellige (geometric eight-pointed stars in saffron, teal and glaze white, no cobalt), carved Atlas cedar, carved ivory stucco, pierced and hammered brass, saffron silk, white marble, still water. Colours: night teal #0F2F31, deep #0A2324, door teal #16494B, zellige teal #1E6A6A, saffron #E3A54A, brass #C9A35B, cedar #3A2114, ivory #F6EAD2, tadelakt #EFE3CC, warm lantern light #FFD08A, pale damask-rose petals #D98A8F (petals only), a very little magenta bougainvillea #B8326A. Respect, not costume: only craft and architecture — never camels, fezzes, costumes, belly dancers, magic carpets, genie oil lamps, souk clutter, desert dunes or palm silhouettes; never a hand-shaped (hamsa) knocker, a crescent and star, a mosque, dome or minaret; never Arabic or pseudo-Arabic script, calligraphy, inscription bands or letter-like ornament. Also never: envelopes or wax seals, whole roses, velvet, pearls or gems, a moon or a starry sky, stage curtains, blue-and-white painted tiles, paper sky lanterns, pointed Rajasthani arches, paisley or henna patterns, lemons, Art Deco fans. Everything must look made and photographed for real: rich, warm, tactile, romantic, magazine-quality luxury; never clip-art, never flat vector, never a tourist souvenir. One soft warm light from the upper left in every image. It is an imaginary riad: it must not resemble any real riad, hotel, brand, artist or another seller's design. First you draw a design board of five phone screens (W1); then, giving that board as the reference image of every image, you make the production parts (W2): one object per image, no cast or drop shadow, no glow or halo outside the object (the website adds every light effect itself), no text, letters, numbers, monograms, logos or watermarks. A transparent background must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard), and the object must stay at least 5% inside every edge.
```

#### W1 — Tasarım panosu (5 telefon ekranı; demo metin serbest, YALNIZ referans)
Kaydet (W1): `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/design-board.png` · yaklaşık 1908×824 (≈2,3:1; araç vermiyorsa 1536×1024, beş ekran tek sırada) · opak · kit_check dışı

```
Use case: ui-mockup. Create a high-fidelity art direction board of FIVE mobile wedding website screens for a new luxury design called "Riad Lantern Nights", each screen in a 390 by 844 proportion, arranged side by side in one row with generous, even gaps on a soft warm ivory-grey studio background (the whole board about 2.3:1). The attached photographs (hero_portrait.jpg, story_2.jpg and venue.jpg) are ONLY the identity and styling reference for the fictional couple (she: shoulder-length dark wavy hair, warm olive skin, a simple ivory silk evening dress; he: short light-brown hair, fair skin, a navy suit with an open collar) and for the venue courtyard; everything else is new. The five screens must look like one finished, coherent, best-selling premium product made by a top luxury stationery designer: rich, warm, tactile, romantic, classic and bold; never minimal, never flat vector, never clip-art, never a tourist souvenir.

THE CONCEPT — "The door left open": the website is an evening visit to an imaginary riad (a courtyard house in old Marrakech) at the blue hour. Its signature is the LANTERN LIGHT: a pierced brass lantern throws a pattern of small warm eight-pointed stars, dots and teardrops of light (#FFD08A) onto the plaster, and this light pattern appears on every screen. Everything is real and photographed: polished tadelakt lime plaster in warm ivory (#EFE3CC) and in deep night teal (#0F2F31), hand-cut glazed zellige in geometric eight-pointed-star patterns (saffron #E3A54A, zellige teal #1E6A6A, glaze white, no cobalt), carved Atlas cedar (#3A2114), carved ivory stucco, pierced and hammered brass (#C9A35B), saffron silk, white marble, still water with pale damask-rose petals (#D98A8F). NO envelope, no wax seal, no whole roses, no moon, no stars in the sky, no camels, no fezzes or costumes, no hand-shaped knocker, no crescent, no mosque, dome or minaret, no Arabic or pseudo-Arabic script or calligraphy anywhere, no Art Deco, no blue-and-white painted tiles.

TYPOGRAPHY: the couple's names and the big headings in the display face, an elegant high-contrast serif with sharp, chiselled wedge serifs and a calligraphic stress, like letters cut into carved stucco — refined and romantic, not a script, not Art Deco, not a heavy Didone; body text and captions in a warm humanist book serif with a flowing italic, and the same book serif set as small, widely letter-spaced capitals for dates, labels and buttons. Deep teal and saffron type on ivory; ivory and saffron type on the night-teal walls and the blue-hour courtyard.

Screen 1 — the opening (the closed door): full-bleed, a calm, plain wall of warm ivory tadelakt plaster at dusk, cool blue-hour teal in the shadows at the top and the edges, warm where the lantern light falls. At the top, tiny spaced capitals "TOGETHER WITH THEIR FAMILIES" and the names large on two lines "Leila" and "& Adrian"; a small "Skip" pill in the top right corner. In the middle, about 76% of the screen width, seen perfectly straight on: the closed street door of the riad — a Moorish horseshoe-arch doorway (gently pointed crown) set in a rectangular frame of finely carved ivory stucco whose outer edge is a narrow band of glazed zellige, under a small projecting carved cedar canopy roofed with glazed deep-teal tiles; in the arch, two carved cedar door leaves painted a deep, slightly weathered teal (#16494B), worn to warm cedar on the edges of the carving, studded with rows of small domed brass nail heads that trace one large eight-pointed star across both leaves; near the centre seam two heavy brass ring pulls on pierced brass rosettes, tied together through their rings by a saffron silk cord in a loose knot whose two ends end in small brass beads; a worn white marble threshold step. Hanging on a short chain from the crown of the arch, in front of the upper part of the doors, a pierced brass lantern, softly lit, throwing its pattern of small warm stars, dots and teardrops of light over the door and the wall around it. At the bottom "OCTOBER 9, 2027 · MARRAKECH" and "TAP TO OPEN" in tiny spaced capitals.

Screen 2 — home: the view through the open door — the riad courtyard at the blue hour fills the top 58% of the screen: the open square of a deep blue-hour teal sky at the top (no moon, no stars), a carved cedar upper gallery with a fine turned-wood lattice balustrade, a ground-floor arcade of three carved ivory stucco horseshoe arches on slender white marble columns above a zellige dado, lit pierced brass lanterns, an orange tree in white blossom at the left, a little magenta bougainvillea at the right, and in the lower middle a round white marble fountain with pale rose petals floating on its dark water; a soft pattern of lantern light drifts over the walls. The names "Leila & Adrian" large in ivory across the sky, with "SATURDAY, OCTOBER 9, 2027" in small spaced capitals under them. Below, on warm ivory tadelakt: the couple's portrait (from the attached hero_portrait.jpg) in a carved ivory stucco horseshoe-arch niche with a slim zellige inner band and a small cedar sill, set left of centre and overlapping the courtyard's lower edge; beside and below it "Together with their families", the italic line "request the pleasure of your company at the celebration of their marriage" and "THE SAFFRON COURTYARD RIAD · MARRAKECH" in spaced capitals. Then a band of the fountain's water seen from straight above — dark teal water with soft golden reflections, pale rose petals and a few orange blossoms floating near its edges — with a countdown of four plain, large, light lining numerals and small spaced labels "350 DAYS · 06 HOURS · 42 MINUTES · 18 SECONDS" (no boxes, no tiles), and a saffron pill button "RSVP".

Screen 3 — story: a wall of deep night-teal tadelakt plaster (tone-on-tone, quiet). At the top small spaced saffron capitals "MOMENTS WE HOLD DEAR" and the heading "Our Story" in the display face in ivory. In the middle a tall carved cedar horseshoe-arch window (gently pointed crown, a fine brass bead on its inner edge, a cedar sill) holding the couple's photograph (from the attached story_2.jpg); a cedar mashrabiya lattice of fine turned spindles is SLIDING UP inside the window: the lower 60% of the photo is already uncovered while its upper part is still seen through the lattice; warm lantern light falls through the lattice and scatters small stars and dots of light over the cedar and the wall. Under it the italic caption "Among the lanterns", "II / III" with three small dots, and two fine arrow buttons; one or two pale rose petals drifting.

Screen 4 — details: warm ivory tadelakt. The heading "The Day" in the display face in deep teal, "SATURDAY, OCTOBER 9, 2027" in spaced capitals, a fine brass divider with a small pierced brass eight-pointed star at its centre. "ORDER OF THE DAY" on a tall ivory cotton card whose top edge is cut as a shallow horseshoe-arch crown, with a fine brass foil line inside its edge and a tiny zellige star under the crown: three rows, each with a small solid polished-brass pictogram at the left (two interlocked rings · a Moroccan teapot · a small pierced hanging lantern), the time in spaced capitals, the event in the display face and the place in italic: "6:00 PM · Ceremony in the courtyard · The orange-tree courtyard", "7:00 PM · Mint tea at sunset · The rooftop terrace", "8:30 PM · Lantern-lit dinner & dancing · The great salon"; a brass pictogram of a dinner jacket on a hanger with "DRESS CODE · Evening attire"; a soft band of lantern light lies across the second row. Then the venue photograph (from the attached venue.jpg) seen from the courtyard's upper gallery: framed above by a wide, low scalloped (lambrequin) arch of carved ivory stucco, with slim white marble colonnettes at its sides and a carved cedar balcony front across the bottom; under it "THE SAFFRON COURTYARD RIAD · MARRAKECH, MOROCCO" and an outlined deep-teal button "View map".

Screen 5 — RSVP: a wall of deep night-teal tadelakt. At the top a pierced brass lantern hangs lit on a short chain, its stars and dots of warm light spread over the wall. A tall ivory cotton card (the same shallow horseshoe-arch top, fine brass line, tiny zellige star under the crown) fills most of the screen: the heading "Will You Join Us?" in the display face, the italic line "Kindly reply by August 15, 2027", then a real, readable form in deep teal ink: "Your name" on a fine brass underline, "Will you attend?" with two round options "Joyfully accepts" and "Regretfully declines", "Number of guests" as a select showing "2", "Your meal preference" as a select showing "Lamb", and a full-width saffron button "Send reply" with deep teal text. Along the bottom of the screen, under the card, the fountain's dark water with floating pale rose petals; one petal is just landing, with a small ripple ring.

All five screens share one world (the same plaster, zellige, cedar, brass, saffron silk, lantern light and blue-hour palette) but each has its own composition — not all centred. Use exactly this English sample text and no other words. Photos show the fictional adult couple only, natural and tasteful, not resembling any real or famous person. No device frames or bezels, no hands, no laptop, no marketing collage, no logos, no watermarks, no captions outside the screens. This is a design reference board, not a final website.
```
Kontrol: 5 ekran yan yana, her biri ~390:844; 1. ekranda sakin fildişi sıva üstünde kapalı at nalı kemerli kapı (teal boyalı oyma
sedir kanatlar, pirinç çivilerle sekiz kollu yıldız, ipek kordonla bağlı iki halka kulp, mermer eşik), kemer tepesinden asılı
yanık fener ve duvara düşen yıldız-nokta ışık deseni; 2. ekranda mavi saat avlusu (çeşme + gül yaprakları + fenerler), gökte
isimler, alçı nişte portre, su bandında geri sayım; 3. ekranda sedir at nalı pencerede yarıya kalkmış ahşap kafes; 4. ekranda
pirinç piktogramlı program + fistolu kemerin altından mekân; 5. ekranda okunur form + asılı yanık fener + suya düşen yaprak.
Zarf/mühür/bütün gül/ay/yıldızlı gök/hilal/el biçimli tokmak/yazıya benzer süs/kostüm/deve yok. Başlık harfi keskin kama
tırnaklı, kalem vurgulu, yüksek kontrastlı zarif serif (script değil, deco değil). Metindeki küçük harf bozuklukları kabul (yalnız referans). Beğenilmezse
yeniden üret (en çok 3 deneme); W2 bu panodan türer.
Kullanım: Claude'un yerleşim, tipografi ölçeği ve renk referansı; kapının ekran genişliğine oranı, fenerin kemerdeki yeri, ışık
deseninin yoğunluğu, nişin ve su bandının home'daki yeri buradan ölçülür.

### W2 — Parçalar (panodan türer; HER parçada `design-board.png` referans görsel; YAZI YOK)

Ortak kurallar: tek görselde tek nesne · şeffaflar gerçek alfa · zemine düşen gölge yok · nesnenin dışında ışıma/hâle/ışın yok
(fener hâlesini, kapı aralığından sızan ışığı, alacakaranlık tonunu site CSS ile ekler; tek istisna W2.8 ışık deseninin kendisi) ·
ışık sol üstten · oran önemli, piksel değil · çivi, karo, iğ, yaprak **sayısı** önemli değil, sayı için yeniden üretme.

**Kapı tuvali (W2.1–W2.5, hepsi 1024×1536, aynı konum):** kapı kutusu x %8–92 · y %7–95. Sedir saçak y %7–16; oyma alçı
çerçeve (alfiz) x %11–89 · y %16–89, dış kenarında ince zellige bant; at nalı kemer açıklığı: pervazlar x %24 ve %76 (eşikten
y %89'dan impost y %45'e), kemer en geniş x %22–78 (y ≈%38), sivri tepe (x %50, y %24); tepede fener halkası; mermer eşik
x %13–87 · y %89–95. Kanat dikişi x %50; halka kulplar (x %44 / %56, y %60); kordon düğümü (x %50, y %63). Önce W2.1'i üret;
W2.2–W2.5'i **W2.1'i düzenleyerek** (image edit) üret; araç düzenleme yapamıyorsa W2.1'i referans ver ve kutuyu aynı piksellerde tut.

#### W2.1 Kapalı kapı — bütün (kordonsuz, fenersiz)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/portal_closed.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the closed door on screen 1 of the attached design board. ONE riad street doorway with its doors CLOSED, alone, seen perfectly straight from the front at eye level, no perspective, no tilt, photographed for real. Placement on the 1024×1536 canvas, exactly: the whole doorway spans from 8% to 92% of the image width and from 7% to 95% of the image height. Its parts, from top to bottom: (1) from 7% to 16% of the height, a small projecting canopy of carved Atlas cedar (#3A2114, oiled, warm grain) on two carved cedar brackets, its top a short sloping roof of glazed deep-teal (#16494B) half-round clay tiles; (2) below it, from 16% to 89% of the height and from 11% to 89% of the width, a rectangular frame of finely carved ivory stucco (#F4EFE4, warm shading in the carving) — geometric interlace and small rosettes, crisp hand-carved depth — whose outer edge is a narrow band (about 2.5% of the width) of hand-cut glazed zellige tesserae in saffron (#E3A54A), zellige teal (#1E6A6A) and glaze white with fine ivory grout; (3) in it, a Moorish horseshoe-arch doorway: two straight jambs at 24% and 76% of the width rise from the threshold (89% of the height) to the impost line at 45%; above it the arch first swells slightly outward (widest, from 22% to 78% of the width, at about 38% of the height) and then sweeps up and inward to a gently pointed crown at the centre at 24% of the height; a slim carved cedar moulding outlines the whole opening, and one small round brass ring hangs at the very crown, just inside the opening (a lantern will hang from it); (4) the arch is filled by two closed door leaves meeting in one straight vertical seam at 50% of the width: carved cedar painted a deep, slightly weathered teal (#16494B with #0F2F31 in the shadows), the paint worn away to warm cedar on the edges of the carving, with shallow geometric carved panels and rows of small domed brass nail heads (#C9A35B) tracing one large eight-pointed star across the two leaves; on each leaf, close to the seam at 60% of the height, a heavy round polished brass ring pull hanging from a pierced brass rosette plate (the left ring centred at 44%, the right ring at 56% of the width, each ring about 6% of the width across); (5) at the bottom, from 89% to 95% of the height and from 13% to 87% of the width, one worn white marble threshold step. The centre seam and the line where the leaves meet the arch moulding must read clearly (the leaves are cut along them). NO cord, NO lantern (they are separate images), no plants, no light spilling from the door. One soft warm light from the upper left. No cast shadow or drop shadow, no glow or halo outside the doorway. No text, letters, numbers, monograms, logos or watermarks; no inscription band, no calligraphy, no script-like ornament; no hand-shaped knocker. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: kutu x %8–92 · y %7–95 (±%2); at nalı kemer (pervaz %24/%76, impost %45, en geniş ~%38, sivri tepe %24) ve tepede küçük
pirinç halka; teal boyalı oyma sedir iki kanat, ortada düz dikiş, pirinç çivilerle sekiz kollu yıldız; dikişin iki yanında %60'ta
pirinç halka kulplar; teal kiremitli sedir saçak; zellige kenarlı oyma alçı çerçeve; mermer eşik; kordon/fener yok; yazı/el
biçimli tokmak yok; gerçek alfa.
Kullanım: hiza tabanı (diğer dört `portal_*` bunun üstüne oturur); og görseli; JS'siz ve azaltılmış harekette kapalı kapı.

#### W2.2 Kapı çerçevesi — kanatsız (açıklık şeffaf)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/portal_frame.png` · 1024×1536 · **Şeffaf zemin** · açıklık şeffaf

```
The SAME doorway as the attached portal_closed.png (give portal_closed.png and design-board.png as the reference images, and edit portal_closed.png if the tool allows): the same 1024×1536 canvas, with the cedar canopy and its teal tiles, the carved stucco frame, the zellige border, the arch moulding, the small brass ring at the crown and the marble threshold step exactly where they are — but with BOTH DOOR LEAVES REMOVED. The whole arch opening (from the threshold at 89% of the height up to the crown at 24%, between the jambs at 24% and 76% and the arch's widest swell at 22–78%) is now COMPLETELY TRANSPARENT: a real hole in the alpha channel, nothing inside it — no doors, no darkness, no courtyard, no glass. The ring of carved stucco, arch moulding and threshold step closes all the way round the opening without any gap. Seen perfectly straight from the front. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the doorway. No text, letters, numbers, monograms, logos or watermarks; no calligraphy. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: portal_closed'un üstüne %50 saydam konunca dış kenarlar ve kemer çizgisi çakışıyor; kemer açıklığı tamamen şeffaf, halka
kapalı (eşik altta kapatıyor); tepe halkası yerinde; kanat izi yok; gerçek alfa.
Kullanım: kanatların ve avlunun önündeki çerçeve; "eşikten geçiş"te fenerle birlikte ekran dışına büyür; açıklıktan
`courtyard_bluehour` görünür.

#### W2.3 Sol kanat (aynı tuval)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/portal_leaf_l.png` · 1024×1536 · **Şeffaf zemin**

```
Only the LEFT door leaf of the attached portal_closed.png, alone (give portal_closed.png and design-board.png as the reference images; edit portal_closed.png if the tool allows: remove the canopy, the stucco frame, the zellige, the arch moulding, the brass ring at the crown, the threshold step and the right leaf, keeping only the left leaf exactly where it is): the same 1024×1536 canvas, the same scale, the same straight front view. The leaf runs from the centre seam — a straight vertical edge at 50% of the width — to its outer edge, which continues about 2% of the width beyond the jamb, to 22% (that strip normally hides behind the frame, so complete it with the same painted wood); its top follows the left half of the horseshoe arch but about 2% higher and wider than the opening, meeting the seam at about 22% of the height; its bottom edge is straight at 89.5%. The same carved cedar painted deep weathered teal (#16494B), the same carved panels, the same domed brass nail heads (the left half of the eight-pointed star) and the same heavy brass ring pull on its pierced rosette plate near the seam at 60% of the height. Everything else fully transparent. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the leaf. No text, letters, numbers, monograms, logos or watermarks; no hand-shaped knocker. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: yalnız sol kanat; dikiş kenarı x %50'de düz ve dik; dış kenar ~%22'ye, üstü kemerden ~%2 büyük; halka kulp aynı yerde;
portal_frame'in altına konunca açıklıkta boşluk kalmıyor; gerçek alfa.
Kullanım: çerçevenin arkasında; açılışta `rotateY(0→-78°)`, origin dış kenar (≈x %23), perspektif; aralıktan sıcak ışık (CSS).

#### W2.4 Sağ kanat (aynı tuval)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/portal_leaf_r.png` · 1024×1536 · **Şeffaf zemin**

```
Only the RIGHT door leaf of the attached portal_closed.png, alone, the twin of portal_leaf_l.png (give portal_closed.png, portal_leaf_l.png and design-board.png as the reference images; edit portal_closed.png if the tool allows, keeping only the right leaf exactly where it is): the same 1024×1536 canvas, scale and straight front view. The leaf runs from the centre seam — a straight vertical edge at 50% of the width — to its outer edge, which continues about 2% beyond the jamb, to 78%; its top follows the right half of the horseshoe arch about 2% higher and wider than the opening; its bottom edge is straight at 89.5%. The same painted teal cedar, the same carving, the same domed brass nail heads (the right half of the eight-pointed star) and the same brass ring pull on its pierced rosette plate near the seam at 60% of the height. The light still falls from the upper left (not mirrored). Everything else fully transparent. No cast shadow or drop shadow, no glow outside the leaf. No text, letters, numbers, monograms, logos or watermarks; no hand-shaped knocker. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: yalnız sağ kanat; dikiş x %50; dış kenar ~%78; ışık yine sol üstten; iki kanat yan yana konunca çivi yıldızı ve dikiş
birleşiyor; gerçek alfa.
Kullanım: sol kanadın aynası (`rotateY 0→78°`, 120 ms sonra).

#### W2.5 Safran ipek kordon (halka kulpları bağlayan; aynı tuval)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/portal_cord.png` · 1024×1536 · **Şeffaf zemin**

```
Only the saffron silk cord that ties together the two brass ring pulls of the attached portal_closed.png, alone (give portal_closed.png and design-board.png as the reference images; edit portal_closed.png if the tool allows: draw the cord through the two rings as on screen 1 of the design board, then remove the doorway, the leaves and the rings, keeping only the cord exactly where it is): the same 1024×1536 canvas, scale and straight front view. A tightly twisted saffron silk cord (#E3A54A with deeper amber twists and a soft sheen, about 0.9% of the canvas width thick) loops once round the lower curve of the left ring (centred at 44% of the width and 60% of the height) and of the right ring (56%, 60%), is tied in one loose, soft knot exactly on the seam at 50% of the width and 63% of the height, and its two ends hang down from the knot, one to about 75% and the other to about 78% of the height, each ending in a small pierced brass bead. Everything else, including the rings themselves, is fully transparent. One soft warm light from the upper left. No cast shadow or drop shadow, no glow. No tassel. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: yalnız kordon; halka ilmekleri %44/%56 · %60'ta, düğüm dikişte (%50, %63), iki uç küçük pirinç boncukla bitiyor; kapı ve
halkalar çizilmemiş; gerçek alfa.
Kullanım: kanatların üstünde, çerçevenin altında; açılışta düğüm çözülür, kordon halkalardan kayıp boncuklarıyla sallanarak düşer
(`translateY` + `rotate`) ve söner.

#### W2.6 Delikli pirinç fener — sönük
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lamp_unlit.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the lantern hanging from the crown of the arch on screen 1 of the attached design board. ONE hand-pierced brass riad lantern hanging straight from a short brass chain, alone, seen straight from the front, photographed for real, NOT lit. Placement on the 1024×1536 canvas: a small round brass ring at the top centre (centred at 50% of the width and 4% of the height), the chain hanging straight down from it to the lantern's crown at about 30% of the height; the lantern itself from 30% to 92% of the height and from 28% to 72% of the width: a domed, pointed, pierced brass crown; a tall faceted body of six slightly bulging panels pierced with fine geometric eight-pointed stars, dots and teardrops, with small panes of pale amber glass behind the piercings; a pierced lower bowl and a short pointed finial with a small brass drop at the bottom. Polished and lightly aged brass (#C9A35B, warm highlights, darker recesses). It is NOT lit: the amber glass is dim, the piercings are dark, no light inside, no sparkle. One soft warm light from the upper left. No cast shadow or drop shadow, no glow or halo outside the lantern. No text, letters, numbers, monograms, logos or watermarks; no crescent or other religious symbol. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: tek fener + kısa zincir; üst halka (x %50, y %4); gövde x %28–72 · y %30–92; delikli pirinç + kehribar cam; ışık yok;
hilal/yazı yok; gerçek alfa.
Kullanım: açılışta kemer tepesinin halkasına asılı (Claude ölçekler: halka → tepe halkası, fener ucu ≈ kapı tuvalinin y %50'si);
RSVP başlığının üstünde; `lamp_lit` ile tam üst üste.

#### W2.7 Delikli pirinç fener — yanık (aynı tuval)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lamp_lit.png` · 1024×1536 · **Şeffaf zemin**

```
Exactly the same lantern as the attached lamp_unlit.png (give lamp_unlit.png and design-board.png as the reference images, and edit lamp_unlit.png if the tool allows): the same 1024×1536 canvas, the same chain and ring, the same size, pose and position — but now LIT from inside by a small warm flame: the amber glass panes glow honey-gold (#FFD08A to #E3A54A), every star, dot and teardrop piercing shines as a bright warm point, and the brass around the piercings catches a warm inner glow. The light stays ONLY inside the lantern's own outline: no rays, no halo, no glow, no light spots on anything outside it; the background stays fully transparent. The outside of the brass is still lit by the soft warm light from the upper left. No cast shadow or drop shadow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: lamp_unlit'in üstüne konunca kaymıyor (zincir, halka, gövde aynı yerde); cam ve delikler yanık; dış hatta hâle/ışın yok;
gerçek alfa.
Kullanım: açılışın ilk anı (sönük → yanık çapraz geçiş, 0–400 ms) ve sonra hafif salınım; RSVP gönderiminde yanar; home imzası;
dıştaki sıcak hâle CSS'tir.

#### W2.8 İmza — fenerin duvara düşen ışık deseni (siyah zeminde)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lamp_light.png` · 1024×1024 · opak (saf siyah zemin)

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png and lamp_lit.png as the reference images), the signature lantern light of the attached design board. A photograph, seen perfectly straight on, of ONLY the pattern of light that the lit, hand-pierced brass lantern of lamp_lit.png throws onto a smooth flat surface all around it in a completely dark room — the lantern itself is NOT in the picture. Warm honey-gold light (#FFD08A at its brightest, #E3A54A in the softer shapes) on pure black (#000000). The pattern is radial around the exact centre of the square: the centre itself (about 8% of the width around it) stays dark; from there outward, concentric rings of small, crisp shapes of light — eight-pointed stars, round dots and teardrops, like the lantern's piercings — growing slightly larger, softer and more stretched (pointing outward) the further they are from the centre, and fading smoothly to pure black by about 45% of the width from the centre. All four corners and every edge of the image are completely black (the image will be rotated). No lantern, no chain, no wall texture, no plaster, no haze or fog filling the background, no rays, no colour other than warm gold light on black. No text, letters, numbers, monograms, logos or watermarks. Opaque image on a pure black background (not transparent).
```
Kontrol: saf siyah zeminde sıcak altın ışık şekilleri (yıldız/nokta/damla) merkez çevresinde halkalar hâlinde; merkez karanlık;
merkezden ~%45'ten sonra ve bütün kenar/köşeler saf siyah; fener, duvar dokusu, sis yok; opak.
Kullanım: imza katmanı — `mix-blend-mode: screen` (ya da build'de parlaklık→alfa). Açılışta fener merkezinde 0→1 açılır
(ölçek .85→1), fener sallandıkça ±4° döner; home'da avlu duvarlarında yavaş kayar; story'de kafesin arkasından süzülür;
details'te kart boyunca iner, satırlar ışık geçerken ısınır; RSVP'de patlar. Claude ölçekler, döndürür, bulanıklaştırır; çizmez.

#### W2.9 Mavi saatte riad avlusu — telefon zemini
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/courtyard_bluehour.png` · 1024×1536 · opak

```
Production background for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the courtyard at the top of screen 2 of the attached design board (it is also the view through the open door). A full-frame vertical (2:3) photograph, edge to edge, of the courtyard of an imaginary riad in old Marrakech at the blue hour, seen from just inside the entrance at standing eye level, on its central axis. The top 28% of the frame is the open square of the courtyard's sky: calm, smooth, deep blue-hour teal (#14363F fading to #0F2F31 at the very top), no clouds, NO moon, NO stars, framed at its sides by the dark carved cedar eaves of the upper gallery. Below it the far side of the courtyard: an upper gallery with a carved cedar balustrade of fine turned-wood lattice; a ground-floor arcade of three carved ivory stucco horseshoe arches on slender white marble columns, a dado of glazed zellige (saffron, zellige teal and glaze white geometric stars) below them, warm light inside the arches; several pierced brass lanterns hanging lit, glowing warm (no beams); a potted orange tree in white blossom at the left; a little magenta bougainvillea (#B8326A) climbing one column at the right. In the lower third, centred, a round white marble fountain basin with a low single jet, its still dark water reflecting the lanterns, pale damask-rose petals (#D98A8F) and a few orange blossoms floating on it; a polished zellige floor in front of it. The band from 30% to 50% of the height is calm (the arcade in soft focus) so light text can sit over the sky and the upper arcade. Keep every important detail within the middle 85% of the width. Rich, warm, magical but true-to-life low-light architectural photography with a subtle film grain. No people, no tables, no cushions, no signs, no Arabic script or calligraphy, no religious elements, no text, letters, numbers, logos or watermarks.
```
Kontrol: tam opak; üst %28 sakin mavi saat göğü (ay/yıldız/bulut yok); üç at nalı kemerli alçı revak + sedir kafesli galeri +
yanık fenerler + portakal ağacı; altta gül yapraklı mermer çeşme; insan/masa/yazı/dini öğe yok; önemli her şey ortadaki %85'te.
Kullanım: açılan kapının ardındaki görüntü (çerçeve açıklığının arkasında) ve "eşikten geçiş"le home hero'nun kendisi (isimler
gökte, `lamp_light` duvarlarda kayar).

#### W2.10 Mavi saatte riad avlusu — geniş ekran
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/courtyard_bluehour_wide.png` · 1536×1024 · opak

```
The same riad courtyard as courtyard_bluehour.png (give courtyard_bluehour.png and design-board.png as the reference images), now a full-frame horizontal (3:2) photograph, edge to edge, on the same central axis: the same open square of calm, deep blue-hour teal sky across the top 28% (no moon, no stars, no clouds), the same carved cedar upper gallery with its turned-wood lattice, the same arcade of three carved ivory stucco horseshoe arches on white marble columns above the zellige dado, the same lit pierced brass lanterns, the orange tree at the left and a little bougainvillea at the right, the same round white marble fountain with floating rose petals in the lower middle. The middle half of the width above the fountain is calm. Same colours, light and film grain. No people, no tables, no signs, no Arabic script or calligraphy, no religious elements, no text, letters, numbers, logos or watermarks.
```
Kontrol: courtyard_bluehour ile aynı avlu, renk ve ışık; üst gök sakin; ay/yıldız yok; opak.
Kullanım: 700 px ve üstü ekranlarda courtyard_bluehour yerine (kapının ardı, home hero); og görselinin zemini.

#### W2.11 Fildişi tadelakt — dikişsiz doku
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/plaster_ivory.png` · 1024×1024 · opak · dikişsiz

```
Production texture for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), the warm ivory plaster of screens 1, 2 and 4 of the attached design board. A seamless, tileable square texture of polished tadelakt lime plaster in warm ivory (#EFE3CC gently varying toward #F6EAD2), seen perfectly flat and straight on: soft cloudy trowel movement, a faint satin sheen where it was burnished with a stone, the gentlest warm tonal drift, very LOW contrast. Perfectly even lighting: no vignette, no gradient, no hotspot, no crack, no stain, no tile, no pattern, so that four copies placed side by side join invisibly (the left edge continues the right edge, the top edge continues the bottom edge). Calm enough for small dark teal text everywhere. No text, letters, numbers, logos or watermarks.
```
Kontrol: sıcak fildişi, düşük kontrast, eşit ışık; 2×2 dizince dikiş görünmüyor (küçük dikişi Claude ofsetle giderir — yalnız
bunun için yeniden üretme); opak.
Kullanım: açılış duvarı (alacakaranlık tonu ve fener ışığı CSS + `lamp_light`), home alt bölümü, details (`background-repeat`).

#### W2.12 Gece tealı tadelakt — dikişsiz doku
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/plaster_teal.png` · 1024×1024 · opak · dikişsiz

```
Production texture for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), the deep teal plaster wall of screens 3 and 5 of the attached design board. A seamless, tileable square texture of polished tadelakt lime plaster in deep night teal (#0F2F31 gently varying toward #16494B), seen perfectly flat and straight on: soft cloudy trowel movement, a faint satin sheen where it was burnished with a stone, very LOW contrast. Perfectly even lighting: no vignette, no gradient, no hotspot, no crack, no stain, no tile, no pattern, so that four copies placed side by side join invisibly (the left edge continues the right edge, the top edge continues the bottom edge). Calm enough for small ivory text everywhere. No text, letters, numbers, logos or watermarks.
```
Kontrol: koyu gece tealı, düşük kontrast, eşit ışık; 2×2 dikiş görünmüyor (küçük dikişi Claude giderir); opak.
Kullanım: story ve RSVP duvarı, home'daki koyu bantlar; fener ışığı deseni en çok burada görünür.

#### W2.13 Çeşme suyu — yukarıdan, gül yaprakları
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/fountain_water.png` · 1536×1024 · opak

```
Production background for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the fountain water of screens 2 and 5 of the attached design board. A full-frame horizontal (3:2) photograph looking straight down at the still water of a courtyard fountain basin at the blue hour, edge to edge (no rim, no tiles, only water): deep, dark teal water (#0A2324 to #1E6A6A) with a few soft, slow, blurred golden reflections of lantern light (#FFD08A), and floating on it pale damask-rose petals (#D98A8F with lighter rims) and a few white orange blossoms — most of them near the left, right and bottom edges, a few loose ones elsewhere. The middle half of the width and the middle of the height stay calm, dark and clear of petals (large light numerals will sit there). Real, quiet, luxurious, true-to-life photography. No fountain jet, no splashes, no people, no reflections of people or buildings, no text, letters, numbers, logos or watermarks.
```
Kontrol: tam opak; yalnız su (kenar/karo yok); yapraklar kenarlarda, orta koyu ve sakin; insan/yansıma/yazı yok.
Kullanım: home'da geri sayım bandının zemini (`petal_*` yavaşça süzülür, CSS halka dalga), RSVP sayfasının altı (gönderilince yaprak
düşer + dalga).

#### W2.14 Alçı at nalı niş — home portresi (pencere şeffaf)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/niche_portrait.png` · 1024×1536 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the portrait niche on screen 2 of the attached design board. ONE carved stucco horseshoe-arch niche used as a photo frame, alone, seen perfectly straight from the front, photographed for real. The whole niche spans from 7% to 93% of the image width and from 6% to 93% of the image height: a rectangular outer frame of finely carved ivory stucco (#F4EFE4, geometric interlace and small rosettes, crisp hand-carved depth), edged on the outside by a slim moulding of carved Atlas cedar (#3A2114); inside it the niche's opening, edged by a narrow band of hand-cut glazed zellige tesserae (saffron #E3A54A, zellige teal #1E6A6A, glaze white) that follows the opening all the way round. The OPENING: two straight sides at 17% and 83% of the width rise from the sill at 80% of the height to the impost at 44%; above it the horseshoe arch swells slightly outward (widest, from 15% to 85%, at about 38% of the height) and sweeps up to a gently pointed crown at the centre at 21% of the height. The opening is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it, no glass) and the ring of zellige, stucco and sill closes all the way round it without any gap. Below the opening, from 80% to 86% of the height, a projecting carved cedar sill; below that, carved stucco down to the frame's bottom edge. No lantern, no flowers. One soft warm light from the upper left. No cast shadow or drop shadow, no glow or halo outside the niche. No text, letters, numbers, monograms, logos or watermarks; no inscription band, no calligraphy. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: açıklık at nalı kemer (kutusu ≈ x %15–85 · y %21–80, ≈4:5), tamamen şeffaf, halka kapalı; zellige iç bant, oyma alçı, sedir
dış pervaz ve sedir eşik; gerçek alfa.
Kullanım: home portresi (`hero_portrait`; maske şeffaf açıklıktan); foto karanlıkta bekler, `lamp_light` geçince belirir.

#### W2.15 Sedir at nalı pencere — story (pencere şeffaf)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/story_arch.png` · 1024×1536 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the tall cedar window on screen 3 of the attached design board. ONE tall carved cedar window frame in the shape of a Moorish horseshoe arch, alone, seen perfectly straight from the front, photographed for real: deep, richly carved Atlas cedar (#3A2114, warm oiled grain with honey highlights), a geometric carved interlace on the frame, small carved rosettes in the spandrels, a fine polished brass bead (#C9A35B) along the inner edge and a stepped outer moulding. The frame spans from 8% to 92% of the image width and from 5% to 95% of the image height. The WINDOW OPENING: two straight sides at 22% and 78% of the width rise from the sill at 88% of the height to the impost at 40%; above it the horseshoe arch swells slightly outward (widest, from 20% to 80%, at about 34% of the height) and sweeps up to a gently pointed crown at the centre at 17% of the height. The opening is COMPLETELY TRANSPARENT (a real hole in the alpha channel: no glass, no lattice, no shutters, nothing inside) and the frame closes all the way round it without any gap; along the bottom, from 88% to 95% of the height, a carved cedar sill. One soft warm light from the upper left. No cast shadow or drop shadow, no glow or halo outside the frame. No text, letters, numbers, monograms, logos or watermarks; no calligraphy. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: uzun at nalı açıklık (≈ x %20–80 · y %17–88), tamamen şeffaf, halka kapalı; oyma sedir + pirinç iç boncuk + sedir eşik;
kafes/kepenk/cam yok; gerçek alfa.
Kullanım: story'deki üç pencere (sol–sağ–sol) ve home hikâye tanıtımı; maske açıklıktan; `mashrabiya_panel` fotoğraf ile çerçeve
arasında.

#### W2.16 Ahşap kafes (mashrabiya) — story penceresinin içinde kayan (aynı tuval)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/mashrabiya_panel.png` · 1024×1536 · **Şeffaf zemin**

```
Only the turned-cedar lattice screen that sits inside the window of the attached story_arch.png, alone (give story_arch.png and design-board.png as the reference images; edit story_arch.png if the tool allows: draw the lattice inside the window as on screen 3 of the design board, then remove the frame, keeping only the lattice exactly where it is): the same 1024×1536 canvas, the same scale, the same straight front view. ONE upright rectangular mashrabiya panel, a little larger than the window so that its edges hide behind the frame: from 18% to 82% of the image width and from 14% to 90% of the image height. It is a fine lattice of small turned Atlas cedar spindles (#3A2114, oiled, honey highlights on the turned beads), like strings of tiny wooden beads, joined in a regular diagonal diamond grid, with one small solid carved eight-pointed star rosette at the centre of the panel; about half of the panel's area is open. Every opening between the spindles is COMPLETELY TRANSPARENT (real holes in the alpha channel). Along its bottom edge a slim, plain, perfectly straight cedar rail; along its other three edges a slim plain cedar border. No frame, no window, no photo, no glass behind it. One soft warm light from the upper left. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks; no calligraphy. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: dikdörtgen kafes x %18–82 · y %14–90; delikler gerçek şeffaf (≈yarısı açık); ortada küçük yıldız rozet; altta düz sedir
ray; story_arch'ın altına konunca pencereyi tamamen örtüyor; çerçeve/foto yok; gerçek alfa.
Kullanım: story'de fotoğrafın önünde, çerçevenin arkasında; kaydırınca yukarı kayar (`translateY`, pencere maskesiyle kırpılı);
`lamp_light` kafesin arkasından süzülür.

#### W2.17 Galeri kemeri — mekân (pencere şeffaf)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/gallery_arch.png` · 1536×1024 · **Şeffaf zemin** · pencere şeffaf

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the frame around the venue photograph on screen 4 of the attached design board. ONE wide photo frame made of the view out from the upper gallery of a riad, alone, seen perfectly straight from the front, photographed for real: across the top a wide, low lambrequin arch of finely carved ivory stucco (#F4EFE4) whose underside is festooned with small scallops and hanging carved drops; at the left and the right a slender white marble colonnette with a carved capital; across the bottom a carved cedar balcony front (#3A2114, a SOLID geometric fretwork panel with a polished top rail — not see-through). The whole frame spans from 5% to 95% of the image width and from 6% to 94% of the image height. The OPENING between them, from about 12% to 88% of the width and from about 18% to 78% of the height (its top edge following the scallops, their lowest points no lower than 22%), is COMPLETELY TRANSPARENT (a real hole in the alpha channel, nothing inside it) and the frame closes all the way round it without any gap. No people, no lanterns, no plants. One soft warm light from the upper left. No cast shadow or drop shadow, no glow or halo outside the frame. No text, letters, numbers, monograms, logos or watermarks; no inscription band, no calligraphy. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: geniş açıklık (≈16:9), tamamen şeffaf, halka kapalı; üstte fistolu (lambrequin) alçı kemer, yanlarda mermer sütunçe,
altta dolu sedir balkon önü; gerçek alfa.
Kullanım: details'te mekân fotoğrafı (`venue`; maske açıklıktan); girişte `lamp_light` fotoğrafın üstünden geçer.

#### W2.18 Fildişi pamuk kart (3 dilim: üst süs · tekrarlanan orta · alt süs)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/card_riad.png` · 1024×1536 · **Şeffaf zemin**

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the tall ivory cards of screens 4 and 5 of the attached design board. ONE tall card of thick warm ivory handmade cotton paper (#F6EAD2, a soft felted tooth), alone, seen perfectly straight from the front, spanning from 8% to 92% of the image width and from 5% to 95% of the image height. Its top edge is cut as a shallow horseshoe-arch crown (the top edge rises from both upper corners into a gently pointed arch at the centre); its sides are straight and its bottom corners square and crisp. It is designed so the website can cut it into three horizontal slices and stretch the middle one. TOP band (the top 18% of the card): a fine brass-gold foil line (#C9A35B) about 4% inside the edge follows the arched top, and just under the crown sits a small cluster of glazed zellige tesserae forming one eight-pointed star (saffron, zellige teal and glaze white), about 12% of the card's width. MIDDLE band (from 18% to 86% of the card's height): plain ivory paper with ONLY the two straight vertical brass foil lines running down each side, exactly the same at every height, nothing else; the left and right edges perfectly straight and vertical. BOTTOM band (the last 14%): the brass lines turn the corners and close, with a narrow centred strip of tiny zellige tesserae (about 40% of the card's width) just above the bottom line. No form fields, no photo window. One soft warm light from the upper left. No cast shadow or drop shadow, no glow outside the card. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: orta bantta yalnız iki yandaki düz pirinç çizgi (yükseklik boyunca aynı, tekrarlanabilir); üstte at nalı tepe + zellige
yıldız; altta zellige şerit; yan kenarlar dik; gerçek alfa.
Kullanım: home davet kartı, details programı ve G138 blokları (travel, dress code, registry, SSS), RSVP formu; Claude üst · orta ·
alt diye keser, ortayı içeriğe göre uzatır.

#### W2.19 Ayırıcı — delikli pirinç yıldız
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/divider_star.png` · 1536×1024 · **Şeffaf zemin**

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the small dividers of the attached design board. ONE delicate horizontal divider in polished brass (#C9A35B, warm highlights), alone: at its exact centre a small eight-pointed star medallion of pierced brass (about 10% of the image height; its piercings are real holes in the alpha channel), a tiny brass bead on each side of it, and from it a hair-fine brass line running level to both sides and tapering to fine points; the whole divider about 72% of the image width, perfectly level in the vertical middle of the canvas. Very fine and elegant. Nothing else, plenty of empty space above and below. One soft warm light from the upper left. No cast shadow or drop shadow, no glow. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard).
```
Kontrol: ince yatay pirinç çizgi + ortada delikli sekiz kollu yıldız + iki boncuk; uçlar incelir; kenarlara değmiyor; gerçek alfa.
Kullanım: başlık altları (home, story, details, rsvp); Claude dar şerit olarak kırpar; `lamp_light` üstünden geçer.

#### W2.20 Program piktogramları — beş ayrı dosya (pirinç tılsım)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/icon_rings.png`, `icon_teapot.png`, `icon_lantern.png`, `icon_attire.png`, `icon_key.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the small programme pictograms on screen 4 of the attached design board. ONE small pictogram cut from a sheet of polished brass, alone, like a little brass charm: a bold, simple, solid silhouette (#C9A35B with warm highlights) with only a few fine engraved lines and tiny pierced dots for detail, clearly readable when shown at 32–40 px, filling about 60% of the square, centred, perfectly straight and flat-on. No backing plate, no circle, frame or badge around it, no background shape. All five pictograms of this set share exactly the same thickness, brass colour, engraving style and level of detail. One soft warm light from the upper left. No cast shadow, no glow. No text, letters, numbers or monogram. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make five separate images:
icon_rings = two interlocked wedding rings
icon_teapot = a traditional Moroccan teapot with a curved spout and a domed lid (no tray, no glasses)
icon_lantern = a small pierced hanging lantern on a short chain
icon_attire = a dinner jacket on a hanger
icon_key = an ornate antique door key with a pierced bow
```
Kontrol: beş dosya, her birinde tek piktogram; hepsi aynı kalınlık ve stilde; 40 px'te okunuyor; rozet/daire/plaka yok; gerçek alfa
(Claude alfayı maske olarak kullanıp rengi değiştirebilir).
Kullanım: details programı (ceremony = rings, mint tea = teapot, dinner & dancing = lantern), dress code = attire, travel & stay =
key; `lamp_light` satırdan geçerken piktogram parlar (CSS).

#### W2.21 Süzülen vurgular — gül yaprağı ×2 ve portakal çiçeği (üç ayrı dosya)
**Kaydet:** `collections/27_Riad_Lantern_Nights/assets/gpt/parts/petal_rose.png`, `petal_rose_curl.png`, `orange_blossom.png` · her biri 1024×1024 · **Şeffaf zemin**

```
Production asset for the "Riad Lantern Nights" wedding website (give design-board.png as the style reference), matching the drifting rose petals and orange blossoms of the attached design board. ONE single small object, alone, photographed for real, centred, not cropped, generous empty margin all round. One soft warm light from the upper left. Nothing else: no surface, no water, no other objects, no dust, no sparkle. No cast shadow or drop shadow, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (a real alpha channel, not white, not a checkerboard). Make three separate images:
petal_rose = one single damask-rose petal, soft pale pink (#D98A8F, deepening toward #C06A78 at its base and lighter at its rim), gently cupped, seen from above, filling about 40% of the square
petal_rose_curl = one single damask-rose petal of the same colour, curled at one side and seen slightly from the side, filling about 40% of the square
orange_blossom = one single white orange blossom with five thick waxy petals and pale yellow stamens, seen from above, filling about 40% of the square
```
Kontrol: üç dosya, her birinde tek nesne ve birbirinden farklı; yapraklar soluk şam gülü pembesi (kırmızı değil, bütün gül değil);
yüzey/su/parıltı yok; gerçek alfa.
Kullanım: açılışın sonunda kapıdan dışarı 6–10 süzülen yaprak ve çiçek (Claude döndürür/ölçekler), home çeşme bandında yüzen
yapraklar, story'de 1–2 yaprak, RSVP'de suya düşen yaprak.

### Instructions for GPT — iş sırası ve teslim (PAKET 8)

```
Work only on PAKET 8 of collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md in the repository muzaffergrl/davetiye-maker (branch main). Ignore every other section of that file: PAKET 2, 3, 6R and 7 are done or cancelled, PAKET 5R is the old look that this package replaces, and the note at the top of the file (tadelakt_ground / cotton_paper / env_back as style references) and its "Zarf geometrisi" section do NOT apply to PAKET 8. Do NOT attach any image that existed in collections/27_Riad_Lantern_Nights/assets/gpt/parts/ before this package (env_*, flap*, stud, cord, lantern_*, hanging_lantern, card_small, arch_frame, story_frame, venue_frame, corner_spray, divider, zellige_tile, tadelakt_ground, cotton_paper, accent_*, web_hero), nothing from platform/themes/riad-lantern-nights/img/, and no design board of another design.

1. ONE chat, in this order. Send the "Instructions for GPT (send before the first image)" message of PAKET 8 first. Then W1, the design board: attach collections/27_Riad_Lantern_Nights/assets/gpt/photos/hero_portrait.jpg, story_2.jpg and venue.jpg as the identity reference of the couple and the venue only. The board is the design; if it misses its Kontrol line or looks ordinary, make it again before going on (at most 3 tries). Commit and push the board as soon as it is chosen.
2. Then W2, one image per prompt, in the order W2.1 to W2.21, in the same chat. Give the finished design-board.png as the reference image of EVERY W2 image (the same plaster, zellige, cedar, brass, silk, lantern light and blue-hour palette). The door canvas parts must line up: make W2.1 portal_closed first, then make W2.2 portal_frame, W2.3 portal_leaf_l, W2.4 portal_leaf_r and W2.5 portal_cord by EDITING portal_closed.png (same 1024×1536 canvas, same box). Make W2.7 lamp_lit by EDITING lamp_unlit.png, and W2.16 mashrabiya_panel by EDITING story_arch.png. Also give the extra references named in each prompt: lamp_lit.png for W2.8, courtyard_bluehour.png for W2.10, portal_leaf_l.png for W2.4. If your tool cannot edit, attach the base image as a reference and keep the box on the same pixels. Check by laying each one over its base at 50% opacity: the outline (or the opening) must sit in the same place at the same size; regenerate once if a shift is plainly visible and write any remaining difference in TESLIM.txt.
3. Use each English prompt exactly as written. One object per image. No text, letters, numbers, monograms, logos or watermarks in any W2 image (sample text is allowed on W1 only); no calligraphy, script-like ornament or inscription band anywhere. In the two multi-image prompts (W2.20 pictograms, W2.21 petals and blossom) each listed line is its own image and its own file.
4. Keep each image in the ratio of its Kaydet size: 1:1, 2:3 or 3:2 (W1 about 2.3:1). The pixel size may differ. Do not resize, crop, repaint or recolour any pixel with code — Claude crops thin bands, cuts the pieces and builds every light effect.
5. Photo windows (W2.14 the niche, W2.15 the cedar window, W2.17 the gallery arch) and the door opening of W2.2 are TRANSPARENT openings; a ring that closes all the way round them matters more than the opening itself. Never fill them with green, white, glass, darkness or a picture. The openings of the lattice (W2.16) are transparent too.
6. W2.8 lamp_light is the one exception to "no glow": it is ONLY warm light shapes on a pure black, opaque background (no lantern, no wall, black corners). W2.9, W2.10, W2.11, W2.12 and W2.13 are opaque too; every other part has a true transparent background.
7. Counts (nail heads, tesserae, spindles, scallops, petals, piercings) do not matter; never regenerate for a count. Regenerate only for: a wrong object; text, letters, calligraphy or letter-like ornament present; a religious symbol (hand-shaped knocker, crescent, star-and-crescent, mosque, dome or minaret) or a tourist cliché (camel, fez, costume, magic carpet, genie lamp); a cast/drop shadow or a glow outside the object (except W2.8); a fake background (white or checkerboard) instead of real alpha; an object touching the canvas edge; a wrong ratio; a photo window or door opening that is not transparent or not closed; a moon or stars in the courtyard sky; whole or red roses instead of pale petals; a door, lantern or lattice part that plainly does not line up with its base; a seamless texture (W2.11, W2.12) that is clearly not uniform. At most 2 attempts per part; then keep the best one, note the defect and move on.
8. Delivery: commit every PNG to the repository at exactly the path on its Kaydet line, with exactly that file name (the parts in collections/27_Riad_Lantern_Nights/assets/gpt/parts/, the board at collections/27_Riad_Lantern_Nights/assets/gpt/mockups/design-board.png). No zip, no Downloads folder, no other folder (not docs/qa, not platform/), no new folder, no download names, no "_final", "_v2" or "(1)" suffixes; rejected tries are not committed. Save as PNG. Push to branch main; only if you cannot push to main, push a branch named codex/g27-paket8 and say so on the first line of TESLIM.txt. Run git pull --rebase origin main before each push. Push after W1, then after W2.5, W2.10, W2.16 and W2.21 ("27 PAKET 8: W1", "27 PAKET 8: W2 1/4", …) so nothing is lost if the chat breaks; the last commit is "27 PAKET 8: teslim". Touch no other file, write no code, do not run gpt_yerlestir.py or build_images.py.
9. Finally write collections/27_Riad_Lantern_Nights/assets/gpt/parts/TESLIM.txt in Turkish: branch and last commit; how many files were delivered (expected: the board + 27 parts); for every file the target size and the actual size, RGBA or RGB (real alpha channel or not), the number of attempts and every difference from its Kontrol line (be specific); the alignment results (portal_frame, portal_leaf_l, portal_leaf_r and portal_cord against portal_closed; lamp_lit against lamp_unlit; mashrabiya_panel against the window of story_arch: shift yes/no, roughly how much); anything skipped and why; which reference images were attached; and one line confirming that no pixels were changed by code. If you cannot write to the repository at all, stop and say so clearly in the chat; do not hand the upload to the user.
```
