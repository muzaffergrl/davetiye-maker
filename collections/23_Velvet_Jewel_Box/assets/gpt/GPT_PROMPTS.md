# GPT görsel istekleri — Tasarım 23 · Velvet Jewel Box (yeniden tasarım, 2026-10-22)

> **Instructions for GPT:** This design is being REDESIGNED (2026-10-22). Generate PAKET 5R (website layers) first, in
> order and in ONE chat, then PAKET 6R (printable invitation). PAKET 2 sample photos already exist — do NOT regenerate
> them. Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> initials, monograms, crests, engravings, hallmarks, logos, brand marks, QR codes or watermarks in any image** (also not
> inside the ring band, on the ribbon, on the ring box or on the frames). Nothing may resemble a real jewellery brand's
> box, colour or packaging. Give W1 `moire_ground.png`, W3 `velvet.png` and W4 `env_back.png` as the style reference of
> every later part: the same pale champagne silk moiré, the same deep aubergine silk velvet with its soft pile sheen, the
> same champagne silk satin lining with stitched seed pearls, the same polished rose gold, the same soft studio light from
> the top-left. Parts drawn on the same envelope canvas (W4 env_back, W5 env_front, W6 flap, W8 ribbon_band) keep the
> envelope in exactly the same box.

Bu dosya tasarım 23'ün **bütün görsel parçalarının** tek kaynağıdır (yeniden tasarım: `docs/35_22_32_YENIDEN_TASARIM.md`
§4 satır 23; görev G223 → tema G423). 18–20 Ekim'in Codex kapağı (sekizgen kadife kitap, `img/v3-*`/`v4-*`) ve eski
PAKET 5/6 bölümleri bırakıldı (git geçmişinde). Durum **concept**: tema `platform/themes/velvet-jewel-box/` 39 pilot
yapısıyla yeniden kurulacak; her parçanın nasıl kullanılacağı aşağıdaki "Kullanım" satırlarındadır, gelmeyen parçanın
yerine çizilmiş yedek konmaz (K21). Kişisel alanlar (isimler, tarih, baş harfler, mekân) HTML'dir, hiçbir görsele
pişirilmez. QR'ı GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/23_Velvet_Jewel_Box/assets/gpt/` altındaki `parts/` (PAKET 5R)
  ve `print/` (PAKET 6R). `photos/` (PAKET 2) dolu, dokunulmaz. Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/23_Velvet_Jewel_Box --paket 5` (oran, gerçek alfa, kenar payı,
  foto penceresi) + göz kontrolü. Tema yeniden kurulunca `python3 platform/themes/velvet-jewel-box/build_images.py`
  (alfa kutusu + arka katmanın kutusuna yerleştirme, `keyed_window`) ve `python3 tools/gpt_kuru_deneme.py --tema
  velvet-jewel-box --sekil collections/23_Velvet_Jewel_Box/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için aşağıdaki
  "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic luxury product photography** — real deep aubergine silk velvet with a soft directional pile
  and velvety shadows, real champagne silk satin with a liquid sheen, real pale champagne silk moiré with its watered
  pattern, real ivory seed pearls with a soft orient, real polished rose gold, one real round brilliant diamond. The mood
  of a winter townhouse salon: classic, romantic, rich and calm; precious but never flashy. Not cartoon, not flat vector,
  not a glitter print, not a jewellery advert with sparkle rays.
- Renkler (yalnız bunlar): night `#1C0B1A` · aubergine `#2A1328` · plum `#4A2142` · champagne `#E8D3B0` · rose gold
  `#C99A86` · ivory `#F8EDE0`. Çiçek yalnız W14 köşe süsünde (şampanya-allık gül goncası) ve ölçülü.
- Işık: yumuşak stüdyo ışığı **sol üstten**; kadifede havın derin gölgesi, satende ve rose goldda temiz parlak vurgu;
  bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil), her kenarda en az %6 boşluk,
  nesnenin dışında düşen gölge/hâle/ışın yok (gölgeyi ve parıltıyı site ekler).
- Foto penceresi (`#00FF00`) yalnız W11 `cameo_frame`, W12 `tray_frame`, W13 `venue_frame`'de istenir; diğer parçalarda
  yeşil yok.
- Gerçek bir mücevher markasına (kutu rengi, kurdele, logo), bir mekâna, sanatçıya ya da başka bir satıcının tasarımına
  benzemesin. **40'tan ayrı:** fildişi pamuk, yay kapak, dantel, kuğu mühür yok. **46'dan ayrı:** fiyonk ve delik yok;
  tek düz saten bant. **32'den ayrı:** telkâri, anahtar, balerin yok.

## Zarf geometrisi (W4–W6, W8, W9 ve W18 buna göre)
Tuval **1200×1200** (kare). Zarf **kare (1:1)**, önden görünür, kutusu **x %7–93, y %7–93**. Dört katman **aynı tuvalde,
aynı kutuda** çizilir: W4 arka, W5 ön cep, W6 kapak, W8 saten bant; Claude her birini kendi alfa kutusuna kırpar ve W4'ün
kutusuna göre yerleştirir. Tuval yüzdeleri:
- **Ön cep (W5):** tam genişlik (x %7–93); üst kenarı tek yumuşak, çok sığ yay — yanlarda **%42**, ortada **%45**'e iner;
  zarfın alt kenarına (%93) kadar.
- **Üç loblu (yonca) kapak (W6):** üst katlama çizgisi %7, tam genişlik. Serbest kenarı **üç yumuşak dışbükey lob**:
  yan kenarlara **%44**'te değer; sol lobun en alt noktası **(x %24, y %52)**; loblar arası yumuşak girinti **(x %37,
  y %48)** ve **(x %63, y %48)**; orta lob en derin, yuvarlak ucu **(x %50, y %60)**; sağ lobun en alt noktası **(x %76,
  y %52)**. Kapak cebin kenarını her yerde örter (girintilerde de: cep orada ~%44,7, kapak %48).
- **Saten bant (W8):** dikey, ortada **x %46–54** (eni zarfın ~%9'u); zarfın üst ve alt kenarında yumuşak kıvrımla
  arkaya döner (görünen boy **y %6,5–93,5**); orta lobun ucunun hemen altında küçük yassı bir düğüm, merkezi **(x %50,
  y %62)**. Bant kapağın ve cebin üstünden geçer.
- **Yüzük (W9, ayrı 600×600 tuval):** zarf tuvalinde merkezi **(x %50, y %56)**, yüzüğün dış eni zarf tuval eninin
  **%13**'ü (zarf eninin ~%15'i); düğümün hemen üstünde, bandın üzerinde durur.
- **Kapağın iç yüzü (W7, ayrı 1200×760 tuval):** aynı yonca çizgisi dikey aynalanmış, aynı en (x %7–93); düz katlama
  kenarı **altta %92**, yan kenarlar **%33,6**'ya, yan lobların tepesi **(x %24 / %76, y %20,9)**, girintiler **(x %37 /
  %63, y %27,2)**, orta lobun tepesi **(x %50, y %8,3)**.
- Kat sırası (alttan üste): W4 arka → kart (W10) → W5 cep → W6 kapak → W8 bant → W9 yüzük.

Açılış: taşta kısa ışıltı (CSS, GPT taşın üstünde) → yüzük bant boyunca yukarı kayar, zarftan ayrılır ve isimlerin üstüne
süzülür (home'da küçük süs; imzada kutusuna oturur) → bant düğümden ikiye ayrılır (Claude W8'i düğümde kırpar): üst
yarısı kapağın üstünden geri çekilir, alt yarısı aşağı kayıp söner → yonca kapak üst katlama çizgisinde 3B açılır, 90°'de
iç yüz (W7: şampanya saten + inci kenar) devralır → inci kenarlı fildişi kart (W10) cebin arkasından yükselir, cep
dudağını geçince öne gelir → inciler, şampanya gül yaprakları ve elmas pırıltıları (W17) süzülür → home.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Şampanya ipek hare (sayfa zemini)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/moire_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of pale champagne silk moiré (between #E8D3B0 and #F3E6D0), the luxurious watered-silk fabric of an old townhouse salon wall: soft, wide, flowing watermark ripples in the weave that shift gently between slightly lighter and slightly darker champagne, a fine horizontal rib, a faint pearly sheen. Very low contrast so dark text reads on it everywhere. Perfectly flat and evenly lit by soft studio light from the top-left: no folds, no wrinkles, no seams, no stains, no shadow, no vignette, no flowers, no pattern other than the moiré itself. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 ek yeri yok); açık şampanya, düşük kontrast; hare dalgası yumuşak; kırışık/çiçek yok; üstünde koyu yazı okunur.
Kullanım: tema kurulunca bütün sayfaların zemini ve kapak (kapalı zarf) sayfası; zarf ve kart üstünde sakin malzeme.

#### W2 Fildişi pamuk kâğıt (kartlar, form)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/ivory_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of thick mould-made cotton paper in a warm ivory (#F8EDE0), the kind used for fine engraved stationery: a gentle felt tooth, a few faint long cotton fibres, the slightest natural cloudiness, an even tone with only the gentlest variation and a very faint satin lustre. Evenly lit by soft studio light from the top-left, no fold, no crease, no deckle edge, no stain, no shadow, no vignette, no printing, no pattern. Calm enough for fine dark text to read on it everywhere. The edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; sıcak fildişi `#F8EDE0` civarı; leke/kat/desen yok; üstüne koyu yazı okunur.
Kullanım: tema kurulunca home kartı, saten kartlar, RSVP formu ve zarftan yükselen kartın kâğıt dokusu.

#### W3 Patlıcan ipek kadife (koyu bantlar)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/velvet.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of deep aubergine silk velvet (#2A1328, with soft plum highlights toward #4A2142 and velvety shadows toward #1C0B1A): a dense, fine, even pile with the soft directional sheen of real silk velvet, the faintest crush marks only as gentle tonal drifts, no folds. Evenly lit by soft studio light from the top-left, very low contrast so ivory and champagne text reads on it everywhere. No wrinkles, no seams, no stains, no pattern, no flowers, no vignette. The edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; koyu patlıcan kadife, hav dokusu görünür ama sakin; desen/kırışık yok; üstünde fildişi yazı okunur.
Kullanım: tema kurulunca home davet bandı, RSVP kartının altındaki bant, story vitrininin zemini ve imza bölümü.

#### W4 Zarfın arkası (iç astar görünür)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/env_back.png` · 1200×1200 · **Şeffaf zemin**

```
The back panel of an open square envelope covered in deep aubergine silk velvet (as velvet.png), seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas (a perfect square) with very slightly softened corners. We see its inside: it is lined with smooth champagne silk satin (#E8D3B0) with a soft liquid sheen catching the light from the top-left, the satin covering the panel almost completely, edged along its top and both sides by a fine row of tiny stitched ivory seed pearls (#F8EDE0), with a slim margin of aubergine velvet showing beyond the pearls; a very gentle shade toward the bottom where the front pocket will sit. No flap, no front pocket, no ribbon, no ring, no card inside. Soft studio light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kare panel x %7–93 · y %7–93; iç yüz şampanya saten, üst ve yanlarda inci dikişi, dışında ince kadife pay; kapak/cep/bant yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — kapak açılınca kartın arkasında görünen saten iç; bütün zarf katmanları bunun alfa kutusuna göre yerleşir.

#### W5 Zarfın ön cebi
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/env_front.png` · 1200×1200 · **Şeffaf zemin**

```
Only the front pocket of the same square aubergine silk velvet envelope as env_back.png, on the same 1200×1200 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the pocket spans the full envelope width (x 7–93%) from its top edge down to the envelope's bottom edge at 93% of the canvas height. Its top edge is one smooth, very shallow arc: it starts at 42% of the canvas height at both side edges and dips only slightly to 45% at the horizontal centre, cut clean, with a fine rolled velvet edge and the faint thickness of a padded panel visible along it. Deep aubergine silk velvet of velvet.png with its soft directional pile sheen, the soft fold lines of the two side flaps and the bottom flap barely visible as gentle tonal seams in the velvet, lit by soft studio light from the top-left. Everything above the pocket's edge is completely transparent. No flap, no ribbon, no ring, no card, no pearls on the pocket. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep tam genişlik; üst kenarı yanlarda %42, ortada %45 (çok sığ yay); üstü tamamen şeffaf; aynı kadife; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart bunun arkasından yükselir; kapak açıkken üst kenarı görünür.

#### W6 Üç loblu (yonca) kapak (kapalı, dış yüz)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/flap.png` · 1200×1200 · **Şeffaf zemin**

```
Only the closed flap of the same square aubergine silk velvet envelope, on the same 1200×1200 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the flap spans its full width (x 7–93%), hinged along a softly rounded fold at the envelope's top edge (7% of the canvas height). Its free lower edge is made of THREE soft, rounded, convex lobes like a trefoil, smooth and continuous (not pointed, not a V, not scalloped lace): the edge meets the left side at 44% of the canvas height, swells down into the left lobe whose lowest point is at x 24%, y 52%, rises into a soft rounded notch at x 37%, y 48%, swells down into the largest centre lobe whose broad rounded tip is at x 50%, y 60%, rises into a second soft notch at x 63%, y 48%, swells into the right lobe lowest at x 76%, y 52%, and meets the right side at 44%. The flap is padded aubergine silk velvet (as velvet.png) with a soft directional pile sheen and a fine rolled edge along the lobes, a whisper of contact shade on the flap itself just along its lobed edge, soft studio light from the top-left. Everything below the flap's edge is completely transparent. No ribbon, no ring, no pearls, no seal, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kapak tam genişlik; serbest kenar üç yuvarlak lob (yanlarda %44, yan lob dipleri %52, girintiler %48, orta lob ucu %60); kadife, süssüz; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapalı kapak; açılışta üst katlama çizgisinde 3B kalkar, 90°'de W7 iç yüz devralır.

#### W7 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/flap_in.png` · 1200×760 · **Şeffaf zemin**

```
The inside of the same trefoil envelope flap, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background: the outline of flap.png mirrored vertically. Its straight fold edge is at the BOTTOM, along 92% of the image height, spanning x 7–93% of the width (exactly as wide as the envelope); its two straight sides rise to 33.6% of the image height; the left lobe's highest point is at x 24%, y 20.9%, a soft rounded notch at x 37%, y 27.2%, the largest centre lobe's broad rounded top at x 50%, y 8.3%, a second notch at x 63%, y 27.2%, the right lobe's highest point at x 76%, y 20.9%. The inside is lined with the same smooth champagne silk satin (#E8D3B0) as env_back.png, with a soft liquid sheen and a few gentle satin ripples catching the light from the top-left, and a fine row of tiny stitched ivory seed pearls follows the whole lobed edge just inside it; a slim margin of aubergine velvet shows beyond the pearls along the lobed edge. Soft studio light from the top-left. No ribbon, no ring, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz katlama kenarı altta (%92), yanlar %33,6'ya, yan lob tepeleri %20,9, orta lob tepesi %8,3; şampanya saten + lob kenarı boyunca inci dikişi + ince kadife pay; düz renk değil; gerçek alfa.
Kullanım: tema kurulunca kapak açıldığında zarfın üstünde dik duran iç yüz (3B dönüşün arka yüzü); kart yükselirken arkasında satende ışık süpürmesi (CSS maske).

#### W8 Şampanya saten bant (zarfı dikey saran)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/ribbon_band.png` · 1200×1200 · **Şeffaf zemin**

```
On the same 1200×1200 canvas as env_back.png and flap.png, in exactly the same place (the envelope box is x 7–93% and y 7–93% of the canvas, but the envelope itself is NOT drawn here), only a single flat champagne silk satin ribbon that wraps the closed envelope vertically, on a fully transparent background: the ribbon (#E8D3B0, a rich liquid sheen with soft lighter highlights where it catches the light from the top-left) runs straight down the centre from x 46% to x 54% of the canvas, from y 6.5% to y 93.5%; at both ends it turns over in a soft rounded fold, as if it bends over the envelope's top and bottom edges and continues behind it. Just below the centre, at x 50%, y 62%, the ribbon makes one small, neat, flat knot (a simple tidy wrap, slightly wider than the ribbon, no bow, no loops, no tails). Along its length the ribbon lies flat with one or two very gentle soft ripples. Everything outside the ribbon is fully transparent: no envelope, no flap, no ring, no pearls. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek dikey saten bant x %46–54 / y %6,5–93,5; iki uç yumuşak kıvrık; (%50, %62)'de küçük yassı düğüm, fiyonk yok; zarf çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca aynı zarf tuvalinde tam tuval katman; açılışta yüzük kalkınca düğümde ikiye kırpılır: üst yarısı kapağın üstünden geri, alt yarısı aşağı çekilip söner.

#### W9 Rose gold tek taş yüzük (kapanış)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/ring.png` · 600×600 · **Şeffaf zemin**

```
A single rose gold solitaire engagement ring, alone, standing upright and seen perfectly straight from the front, on a fully transparent background, centred and filling about 72% of the canvas height: a slim, highly polished round band in rose gold (#C99A86 with bright warm highlights and soft deeper reflections), and on top a single round brilliant-cut diamond held in a delicate six-claw rose gold setting, its crisp facets catching the soft studio light from the top-left with clean white and faint champagne reflections. The open centre of the band is truly transparent (real alpha). Elegant, classic, not oversized. No engraving, no hallmark, no inscription inside the band, no other stones, no box, no ribbon, no sparkle rays, no star flares. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek yüzük, önden dik; rose gold ince bant + altı tırnaklı tek taş; bandın içi şeffaf; kazıma/yazı/ışın yok; gerçek alfa.
Kullanım: tema kurulunca zarf tuvalinde (x %50, y %56), eni tuvalin %13'ü; açılışta taşta CSS parıltısı → banttan yukarı kayıp isimlerin üstüne süzülür; home'da küçük süs, imzada açık yüzük kutusuna (W16) oturur.

#### W10 Zarftaki kart (boş)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/card_small.png` · 1000×1300 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen perfectly straight on, on a fully transparent background: the thick warm ivory cotton card of ivory_paper.png (#F8EDE0) with very slightly rounded corners, spanning x 7–93% and y 6–94% of the canvas. A fine rose gold foil border line (#C99A86, crisp metallic shine) is inset about 5% from the card's edge, and just inside it a delicate continuous row of tiny ivory seed pearls set along the border on all four sides, slightly larger at the four corners. The whole card inside the pearl border is EMPTY paper (the website sets the names, date and venue there in HTML). Soft studio light from the top-left, a hair-fine contact shade on the card's own edge only. No flowers, no ring, no photo, no ornament in the middle. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: boş fildişi kart; rose gold folyo çizgi + içinde tohum incisi dizisi; içi tamamen boş; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → zarftan yükselen kart (cebin arkasından, dudağı geçince öne) ve home kartının çerçevesi; isimler, tarih, mekân HTML.

#### W11 Rose gold + inci oval kamea çerçeve (home portresi)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/cameo_frame.png` · 1000×1250 · **Şeffaf zemin**

```
An upright oval cameo-style portrait frame, alone, seen straight on, on a fully transparent background, like a precious antique locket frame: a polished rose gold oval bezel (#C99A86, warm highlights, soft deeper reflections) with a fine beaded inner rim, surrounded by a continuous ring of graduated ivory seed pearls (#F8EDE0, soft orient), and at the top centre a small, delicate rose gold ribbon bow with two short tails resting on the pearls. The frame's outer edge spans about x 8–92% and y 6–94% of the canvas. In the middle an upright OVAL photo window exactly 640 px wide and 820 px tall, centred at x 500 px, y 640 px (its bounding box from x 180 to 820 px and y 230 to 1050 px), filled with flat pure green #00FF00 (no texture, no shading, smooth clean oval edge, nothing over it). Soft studio light from the top-left. No glass reflection over the window, no gemstones other than the pearls, no flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz `#00FF00` dikey oval pencere ~640×820, merkez ~(500, 640); rose gold bezel + inci halkası + üstte küçük rose gold fiyonk; pencereye binen yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır (oval maske) → home kartındaki portre (`hero_portrait`), foto satende ışık süpürmesiyle belirir; teşekkür modunda teşekkür fotoğrafı.

#### W12 Kadife yüzük tepsisi oval yuvası (story vitrini)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/tray_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A single upright panel from a jeweller's display tray, alone, seen straight on, on a fully transparent background: a softly padded, rounded-rectangle cushion of deep aubergine silk velvet (as velvet.png) with gently rounded corners and a soft tufted edge, spanning about x 7–93% and y 6–94% of the canvas; set into its centre a slim polished rose gold oval bezel (#C99A86) with a fine beaded rim, and a single row of tiny ivory seed pearls around the bezel. Inside the bezel an upright OVAL photo window exactly 600 px wide and 780 px tall, centred at x 500 px, y 625 px (its bounding box from x 200 to 800 px and y 235 to 1015 px), filled with flat pure green #00FF00 (no texture, no shading, smooth clean oval edge, nothing over it). The velvet shows its soft directional pile sheen and velvety shadows around the bezel. Soft studio light from the top-left. No ring, no jewellery, no glass, no flowers. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz `#00FF00` dikey oval ~600×780, merkez ~(500, 625); kadife yastık panel + rose gold bezel + inci sırası; yüzük/cam yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → story'deki döner vitrinin üç yuvası (3B silindir karusel) ve home'daki hikâye tanıtımı.

#### W13 İnci kenarlı geniş çerçeve (mekân fotoğrafı)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/venue_frame.png` · 1600×1000 · **Şeffaf zemin**

```
A wide landscape picture frame, alone, seen straight on, on a fully transparent background: a slim polished rose gold frame (#C99A86, warm highlights) with softly rounded corners and a fine raised beaded inner lip, and just inside the lip a continuous row of tiny ivory seed pearls on all four sides, slightly larger pearls at the four corners. The frame's outer edge spans about x 6–94% and y 7–93% of the canvas. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 118 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges with only very slightly rounded corners, nothing over it). Soft studio light from the top-left. No bow, no flowers, no glass reflection. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz `#00FF00` ~1360×765 (16:9), sol üst ~(120, 118); ince rose gold çerçeve + iç kenarda inci sırası; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafı (`venue`).

#### W14 Köşe süsü (inci dizileri + saten kurdele + gül goncası)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/corner_spray.png` · 1200×1000 · **Şeffaf zemin**

```
A refined corner ornament growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: two or three graceful looping strands of ivory seed pearls (#F8EDE0, soft orient) draped in soft swags, a loop of champagne silk satin ribbon (#E8D3B0) with two long softly curling tails, one half-open champagne-blush garden rose and two small closed buds with a few dark plum-green leaves tucked among the ribbon. Restrained and elegant, more jewellery than bouquet. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right half of the canvas is completely empty. Soft studio light from the top-left. No ring, no gemstones, no glitter, no other flowers or colours. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sol üstten çıkan ölçülü süs (inci + saten kurdele + tek gül + iki gonca); sağ alt yarı boş; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca home kartının iki üst köşesi (sağda aynalanır), RSVP kartı ve imzada küçük. Kapak sayfasında kullanılmaz ya da yalnız tek köşede, asla metnin altında değil.

#### W15 Tohum incisi dizisi (bölüm ayırıcı)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider, alone, on a fully transparent background: one straight strand of graduated ivory seed pearls (#F8EDE0, soft orient and tiny bright highlights) running horizontally across x 8–92% of the canvas at the vertical centre, the pearls largest in the middle and gradually smaller toward both ends, with a tiny polished rose gold bar clasp (#C99A86) exactly at the centre. Fine and elegant. No tassels, no other colours, no bow. Soft studio light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay tek dizi, ortada büyük uçlarda küçük inciler, ortada küçük rose gold klips; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet bandı ve gün, details program, RSVP formu).

#### W16 Açık kadife yüzük kutusu (imza, boş)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/ring_box.png` · 900×800 · **Şeffaf zemin**

```
A small open ring box, alone, seen from the front and very slightly from above, on a fully transparent background, photorealistic: a softly rounded box covered in deep aubergine silk velvet (as velvet.png) with a fine rose gold rim line where the lid meets the base; the lid stands open at about 100 degrees, its inside lined with champagne silk satin with a soft sheen; in the base a plump champagne satin cushion with a single empty slit in its centre (NO ring in it). The box spans about x 20–80% and y 10–90% of the canvas. Soft studio light from the top-left, velvety shadows in the pile. No ring, no jewellery, no logo or stamp inside the lid, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek açık kutu, kadife dış + saten iç; yastıkta boş yarık (yüzük YOK); kapak içinde logo/yazı yok; gerçek alfa.
Kullanım: tema kurulunca home imzası ve RSVP teşekkürü: W9 yüzüğü yukarıdan süzülüp yarığa oturur, "Open it again" (tekrar oynat) linkinin üstünde.

#### W17 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, soft studio light from the top-left. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files, the same light and scale: 1 = one single round ivory seed pearl (#F8EDE0) with a soft pink-champagne orient and one tiny bright highlight; 2 = one single loose champagne-blush rose petal (#E8D3B0 shading to a soft blush), velvety and softly cupped, a faint deeper shade in its fold; 3 = one single small loose round brilliant-cut diamond seen from the top, crisp clean facets with white and faint champagne reflections, NO sparkle rays, NO star flare.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (inci, gül yaprağı, elmas); ışın/hâle yok; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışta ve RSVP gönderilince süzülen küçük nesneler (her biri ayrı katman, kendi fazında); elmasa CSS ile kısa parıltı.

#### W18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic luxury product photography, soft studio light from the top-left: the closed square aubergine silk velvet envelope of flap.png with its three-lobed trefoil flap, wrapped vertically by the champagne satin ribbon of ribbon_band.png with its small flat knot, and the rose gold solitaire ring of ring.png resting on the ribbon just above the knot, lying slightly below the centre on pale champagne silk moiré (as moire_ground.png); at the left a few looping strands of ivory seed pearls and a champagne satin ribbon tail with one half-open champagne-blush rose (as corner_spray.png); at the right, softly out of focus, the small open aubergine velvet ring box of ring_box.png (empty); a few loose pearls and one rose petal scattered. Only aubergine, plum, champagne, rose gold and ivory tones. The top 20% of the image is calm and soft (only out-of-focus moiré). This image is cropped to 1200×630 for link previews: keep the whole envelope, ribbon and ring visible with at least 5% empty margin below the envelope. No people. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf + bant + yüzük bütün, altında ≥%5 boşluk; üst %20 sakin; kutu boş; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım: üstten ~%21) ve katalog kapağı yedeği.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor) — var, yeniden üretme

Bütün fotoğraflar **aynı kurgu çift** (her prompt aynı tarifi taşır: Isabelle uzun koyu kahve saç, alçak topuz, buğday
ten; Julian kısa koyu sarı saç, kısa düzgün sakal, açık ten), gerçek ya da ünlü birine benzemeyen; aynı renk düzeni
(aubergine, champagne, ivory), hafif film greni. Yazı, logo, tabela yok. Sitedeki yerleri: `hero_portrait` = kutudan
çıkan kartın penceresi + home portresi; `story_1..3` = Story karuseli; `venue` = Details. Dosya adları `theme.json`
foto anahtarlarıyla aynı (theme-check / seed bu klasörden okur).

#### 2.1 Ana portre
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes. An elegant New York townhouse salon with aubergine velvet curtains and warm candlelight: Julian in a midnight-blue tuxedo, Isabelle in an ivory satin gown with a single strand of pearls, standing close and smiling, three-quarter length, both faces in the upper third and centered (the photo is also shown small, cropped to the faces). Aubergine, champagne and ivory palette, subtle film grain. No text, no logos, no frame.
```

#### 2.2 Story 1 — "Our first dinner"
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic candid photo, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes — the same two people as in the portrait. A small candlelit restaurant table for two, laughing over a shared dessert, a rain-streaked window behind them with soft out-of-focus city lights. Smart evening clothes (no wedding attire). Aubergine, champagne and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 2.3 Story 2 — "A little velvet box"
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic photo, vertical 4:5, of the same fictional couple in every photo, Isabelle and Julian, both in their early thirties and not resembling any real or famous person: Isabelle has long dark-brown hair worn in a low soft chignon, warm olive skin and brown eyes; Julian has short dark-blond hair, a neatly trimmed short beard, fair skin and grey-blue eyes — the same two people as in the portrait. The moment of the proposal in a quiet park under a black umbrella at dusk: Julian holds an open aubergine velvet ring box, Isabelle covers her mouth in happy surprise; the ring is a small glint, not the focus; both faces visible. Aubergine, champagne and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 2.4 Story 3 — "Yours, forever"
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic close-up, vertical 4:5: the hands of the same fictional couple, Isabelle and Julian (her warm olive skin, his fair skin), intertwined on champagne satin, her engagement ring and a strand of ivory pearls, soft window light. Only hands, no faces. Not resembling any real or famous person. Aubergine, champagne and ivory palette, subtle film grain. No text, no engraving, no logos.
```

#### 2.5 Mekân
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/photos/venue.jpg` · Yatay (1536×864, 16:9)

```
Photorealistic landscape 16:9: a grand fictional New York townhouse ballroom prepared for a wedding dinner: aubergine velvet chairs, champagne satin table linens, tall candles and ivory flowers, crystal chandeliers, warm evening light. No people, no signs, no text, no logos, no recognisable real venue. Aubergine, champagne and ivory palette, subtle film grain.
```

---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, `'velvet-jewel-box'` bloğu var). Eski zeminler
> (`print/invitation_front.png`, `print/invitation_back.png`; fildişi + yoğun köşe çiçekleri) eski görünüme aittir; yeni
> zeminler **yeni adlarla** istenir, eskiler tema kurulunca silinir.
> **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px** = 5×7 in
> + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda. Zemin açık fildişi: `ink` / `accent` koyu (patlıcan, plum) kalır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'velvet-jewel-box'` bloğunda `sources` → `{ front: 'print/invitation_front_r_5x7.png', back:
>    'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme velvet-jewel-box` (artık kaynak olmayan eski
>    `public/print/velvet-jewel-box/` dosyaları silinir) ve `node scripts/print-sample.ts --theme velvet-jewel-box
>    --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the thick warm ivory cotton card of ivory_paper.png (#F8EDE0). Across the top, between 9% and 91% of the width, two graceful swags of ivory seed pearl strands (as divider.png) hang in gentle curves from near the top corners and meet at the top centre in a small, neat champagne silk satin bow with short tails, one small half-open champagne-blush rose bud tucked into the bow; nothing in this top band reaches lower than 17% of the height. Along the bottom, between 93% and 96% of the height and from 14% to 86% of the width, a fine double rule of rose gold foil (#C99A86) with one single seed pearl at its centre. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no pearl, no petal, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges. Soft studio light from the top-left. Only ivory, champagne, blush and rose gold tones. No ring, no velvet. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma fildişi; %19–%91 × %10–%90 tamamen boş; inci salkımları + saten fiyonk + gonca yalnız üstte (%17'nin üstünde), rose gold çift çizgi + tek inci yalnız altta; yan %8 boş; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same thick warm ivory cotton card, only one short swag of graduated ivory seed pearls across the top centre (between 32% and 68% of the width) with a tiny rose gold bar clasp at its middle, its lowest point staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no pearl, no line, no shadow, no stain. No ornament within 8% of the left and right edges. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada kısa inci salkımı (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a champagne satin cloth over a dark plum lacquered table and a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a champagne satin cloth over a dark plum lacquered table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a champagne satin cloth over a dark plum lacquered table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a champagne satin cloth over a dark plum lacquered table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a plum velvet sofa with a champagne satin cushion and a porcelain teacup; a small arrangement of a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 23`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Velvet Jewel Box". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, the same light and the same color world (aubergine, plum, champagne and rose gold). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a champagne satin cloth over a dark plum lacquered table, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a champagne satin cloth over a dark plum lacquered table, a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a champagne satin cloth over a dark plum lacquered table, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a champagne satin cloth over a dark plum lacquered table, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a champagne satin cloth over a dark plum lacquered table: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a champagne satin cloth over a dark plum lacquered table: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a champagne satin cloth over a dark plum lacquered table, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a champagne satin cloth over a dark plum lacquered table, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a champagne satin cloth over a dark plum lacquered table: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a small closed aubergine velvet ring box tied with a champagne satin ribbon, a strand of pearls, a few blush garden roses and a thin rose gold ribbon. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: aubergine, plum, champagne and rose gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.

---

## PAKET 8 — Jewel Box yeniden tasarım (2026-10-24)

> Kullanıcı (2026-10-23): "21'den sonrası profesyonel bir tasarımcının elinden çıkmış gibi olmalı; her şablona özel tasarım,
> bileşen, animasyon ve ses." Model: 21 Crimson Rose Atelier (önce W1 tasarım panosu, sonra panodan kesilmiş W2 parçaları).
> Bu paket 23'ü **sıfırdan** yeniden tasarlar; bugünkü site (sekizgen kadife kitap kapağı + fildişi kâğıt + köşe gülleri)
> çıta değildir ve tamamen değişebilir. Dosyanın başındaki eski talimat (bg_scene / v3-closed referansları) bu pakete
> **uygulanmaz**. **GPT: read the "Instructions for GPT" block at the end of this section first, then W1, then W2.**

### Sanat yönü

- **Fikir — "Kutunun içi":** site, bir kuyumcunun patlıcan moru kadife mücevher kutusudur ve misafir onu **kuşbakışı**
  görür. Açılış sayfası kapalı kutu; açılınca kapağın şampanya ipek astarında çiftin isimleri **varak baskı** gibi belirir
  (kuyumcunun adı kutu kapağına nasıl basılırsa; canlı metin + CSS varak). Her iç sayfa kutunun bir **bölmesi**dir: ipek
  panel, kadife tepsi hücresi, ipek cep. **Çiçek yok — süs mücevherdir:** inci, faset kesim ametist ve morganit, cilalı
  rose gold, şampanya ipek, patlıcan moru ipek kadife.
- **İmza bileşen — tırnaklı taş yuvası:** her fotoğraf emerald-cut (köşeleri kesik dikdörtgen) bir taş gibi dört rose gold
  çift tırnakla tutulur; fotoğraf "mücevher"dir. Butonlar aynı kesik köşeli biçimde (CSS), geri sayım dört kadife tepsi
  hücresinde, program ikonları küçük kadife hücrelerde, bölüm ayırıcıları inci dizisi.
- **Ayrım:** 21 Crimson'ın mum ışıklı kan kırmızısı, gülleri, zarf + mühür, yırtık kâğıt, altın oval, albüm ve Didone'u
  yok; burada mor + şampanya + rose gold, kuşbakışı kutu, mücevher dili. 32 Music Box'ın önden lake kutusu, aynası,
  balerini, kurma anahtarı yok; burada yukarıdan kadife kutu, ametist klips, ipek astar, bölmeli tepsi.
- **Açılış (hero):** kadifede kapalı kutu → dokununca (≤ 250 ms) ametist kabaşonlu klips içe basılır ve kalkar ("tık") →
  kapak arka (üst) kenardaki menteşede 3B döner (ön yüz `rotateX 0→90°`, 90°'de ipek astar `-90°→0` devralır) ve kutunun
  üstünde açık durur → astarda isimler soldan sağa varak ışığıyla belirir → orta ipek yuvada yatan fildişi kart çekme
  kurdelesini gererek yükselir, hafif döner, öne gelir ve home'a uçar (VT); kutu kadifeye çekilir, 2–3 taş/inci kenardan
  hafifçe kayar. Fade yok; klips, kapak, astar, kart ve taşlar ayrı ayrı hareket eder.
- **Hareket imzası:** faset parıltısı (taş ve tırnak kenarında küçük dört köşeli ışık; CSS, bir kez), ipek üstünde ışık
  süpürmesi, story'de kadife kaide üstünde dönen vitrin (silindir karusel, en yakına oturur), sayfa geçişi "tepsi kalkışı"
  (sayfa hafifçe alçalıp kadifeye gömülür, yenisi gölgesiyle yükselir), RSVP'de kart ipek cepten kayarak çıkar, gönderilince
  inciler kadifeye saçılır.
- **Ses (G126 kancaları, yalnız dokunuştan sonra):** kadifeyle boğuk klips tıkı, yumuşak kapak "pof"u, isimler belirirken tek
  kristal çın, kart yükselirken ipek hışırtısı. Lisansı belirsiz ses eklenmez.
- **Font (Google Fonts):** **Forum** — isimler ve başlıklar: oyma Roma başlık harfleri, kuyumcu kapağı varak baskısı
  hissi, Didone değil; **Lavishly Yours** — yalnız ampersand ve kısa script vurgular; gövde **Spectral** 300/400 + italik.
  Forum ve Lavishly Yours 01–49'un hiçbirinde yok (Google Fonts'ta var, 2026-10-24 denendi). Castoro Titling 22 Nocturne'e ayrıldı.
- **Palet (değişmez; G177 renk varyantları buna bağlı):** night `#1C0B1A` · aubergine `#2A1328` · plum `#4A2142` ·
  champagne `#E8D3B0` · rose gold `#C99A86` · ivory `#F8EDE0`; yalnız taşlarda ametist `#5B2A6E`, morganit `#E9B9B0`.

### W1 — Tasarım panosu (5 telefon ekranı; demo metin serbest, YALNIZ referans)

**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/design-board.png` · ~1908×824 (≈ 2,3:1; araç bu oranı
vermiyorsa 1536×1024, beş ekran tek sırada) · opak

```
Use case: ui-mockup. Create a high-fidelity art-direction board of FIVE mobile wedding-website screens for a luxury design called "Velvet Jewel Box", each screen exactly 390 by 844 in proportion, arranged in one horizontal row with even gaps and generous margins on a soft pale champagne-grey studio background. The five screens must look like one finished, coherent, best-selling premium product made by a top luxury stationery designer: rich, tactile, romantic, classic, never minimal, never cheap, never clip-art.

THE CONCEPT: the whole website is the inside of a jeweller's velvet jewel casket, seen from directly above like a flat-lay. Materials only: deep aubergine silk velvet (#1C0B1A to #2A1328, lit pile #4A2142), smooth champagne silk linings (#E8D3B0), polished rose gold (#C99A86, highlights #EBC9B5), lustrous ivory pearls (#F8EDE0) and a few faceted gemstones (deep amethyst #5B2A6E, pale pink morganite #E9B9B0). NO flowers, no leaves, no roses in the decoration — the jewels are the decoration. Every photo is presented like a gemstone: an EMERALD-CUT shape (a rectangle with small cut corners) held by four slim rose-gold double claws (prongs) at its corners, like a stone in a ring setting. Buttons share that cut-corner gem shape. Small numbers and icons sit in small square velvet compartments like the cells of a fitted jewellery tray. Soft warm light from the upper left everywhere, real velvet pile, real silk sheen, real metal.

TYPOGRAPHY: names and headings in engraved classical Roman titling capitals with small flared wedge serifs and gentle stroke contrast, widely letter-spaced, like gold foil lettering stamped inside a jeweller's box lid — NOT a Didone, NOT Bodoni, no ball terminals; a formal copperplate script with long hairline swashes ONLY for the ampersand and very short accents; small letter-spaced capitals and a light refined serif for body text. Champagne and rose-gold foil text on velvet, deep aubergine text on silk and ivory.

Screen 1 — the closed box (opening page): on calm aubergine velvet seen from directly above, a CLOSED rectangular velvet jewel casket, landscape about 4:3, centred in the lower middle of the screen: softly rounded corners, a gently domed lid, slim rose-gold piping along every edge, a small empty rose-gold filigree cartouche with a tiny amethyst in the middle of the lid (no letters in it), and a small rose-gold push clasp set with an oval amethyst cabochon at the middle of its front (bottom) edge; a loose strand of pearls curls on the velvet beside the box. Above the box: small capitals "YOU ARE INVITED", the names "ISABELLE & JULIAN" large in the engraved capitals with a rose-gold script ampersand, a fine pearl-strand divider, "NOVEMBER 13, 2027 · NEW YORK". Below the box: "Tap to open" with a tiny faceted gem symbol.

Screen 2 — home: the top 40% of the screen is the INSIDE OF THE OPENED LID, edge to edge: a smooth padded champagne silk centre panel surrounded by fine sunray pleats of champagne silk and rose-gold piping; foil-stamped in rose gold in the centre panel: "TOGETHER WITH THEIR FAMILIES", "ISABELLE & JULIAN", "Saturday, November 13, 2027". Overlapping the lower edge of the lid, centred: the couple's portrait in the emerald-cut rose-gold claw setting. Below, on aubergine velvet: a countdown of four small square velvet tray compartments with rose-gold rims holding "214 DAYS", "06 HOURS", "42 MINUTES", "18 SECONDS", then the top of a padded champagne silk card with a small rose-gold filigree crest and the line "request the pleasure of your company at the celebration of their marriage".

Screen 3 — story: aubergine velvet page, heading "OUR STORY" with a short script accent "little treasures" and a pearl divider; a rotating jeweller's showcase: three of the couple's photos, each in its emerald-cut rose-gold claw setting, arranged on a curved carousel — the front photo large and straight (the proposal under a black umbrella at dusk, he holds an open little velvet ring box), the two side photos smaller and turned away in perspective — all floating above a round, low aubergine velvet display pedestal with a polished rose-gold band; under it the caption "A little velvet box" in script, "02 / 03", and two small cut-corner rose-gold outline arrow buttons.

Screen 4 — details: a large padded champagne silk card (rose-gold piping, a small rose-gold filigree crest with an amethyst on top) on aubergine velvet: heading "THE EVENING", "Saturday, November 13, 2027"; a programme of three rows, each with a small fine rose-gold LINE icon (two interlocking rings / two champagne coupes / a domed dinner cloche) inside a tiny square aubergine velvet tray cell, then the time, the event in small capitals and the room in italic: "5:00 PM · THE CEREMONY · The Amethyst Salon", "6:00 PM · COCKTAIL HOUR · The Mirrored Gallery", "7:30 PM · DINNER & DANCING · The Grand Ballroom"; a single fine rose-gold line links the cells with a tiny pearl between rows; then "HALVERN HOUSE · NEW YORK", a small venue photo (a candlelit ballroom) in the same emerald-cut claw setting, and an aubergine velvet cut-corner button "View map" with a rose-gold edge.

Screen 5 — RSVP: aubergine velvet page; at the bottom a wide pocket of pleated champagne silk with rose-gold piping along its top edge and a tiny pearl button, and out of it slides up a generous thick ivory reply card with gilded rose-gold bevelled edges and a small rose-gold filigree crest: heading "KINDLY REPLY", "by October 1, 2027", a real readable form: a "Your name" field, "Will you join us?" with two options "Joyfully accepts" and "Regretfully declines", "Number of guests" select showing "2", "Meal preference" select showing "Beef", and a large aubergine cut-corner button "Send reply" with a rose-gold edge.

Use exactly this English sample text and no other words. The people in the photos are the same fictional couple as in the attached sample photos and must not resemble any real or famous person. Each screen has a clearly different composition. No device bezels, no phone frames, no hands, no laptop, no logos, no watermarks, no captions outside the screens. This is a design reference board, not a screenshot.
```
Kontrol: beş ekran tek sırada, 390×844 oranında; kuşbakışı kadife kutu ve açık kapağın ipek astarı tanınıyor; fotoğraflar
emerald-cut tırnaklı yuvada; dekorda çiçek yok; başlık harfleri Didone değil (yuvarlak uç yok); form okunur; tarih
"November 13, 2027"; ekranlar birbirinden farklı. Beğenilmezse yeniden üret (en çok 3 deneme); W2 bu panodan kesilir.

### W2 — Parçalar (panodan kesilir; HER parçada `design-board.png` referans görsel; YAZI YOK)

Ortak kurallar: tek görselde tek nesne · şeffaflar gerçek alfa · zemine düşen gölge yok · nesnenin dışında ışıma/hâle/ışın
yok (site ekler) · ışık sol üstten · oran önemli, piksel değil (1:1, 2:3, 3:2 tuvaller; ince bantları Claude kırpar) · inci
ve kıvrım **sayısı** önemli değil, sayı için yeniden üretme. **W2.3–W2.6 aynı 1536×1024 tuvalde, aynı konumda** (kutu,
klips, açık kutu, kapak astarı): önce W2.3'ü üret, W2.4–W2.6'yı **W2.3'ü düzenleyerek** (image edit) üret.

#### W2.1 Kadife zemin — telefon (açılış ve RSVP sayfası)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/velvet_page.png` · 1024×1536 · opak

```
A full-frame vertical photograph (2:3) of deep aubergine silk velvet seen from directly above, filling the whole canvas edge to edge, like the floor of a jeweller's display tray, matching the velvet of the attached design board: dense short velvet pile, #1C0B1A in the shadows, #2A1328 in the mid tones, #4A2142 where the pile catches the light. The velvet is smooth, calm and even: NO folds, no creases, no seams. One soft warm pool of light from the upper left fading gently across the frame and a subtle natural vignette toward the edges; the middle 70% of the frame stays calm and even so light text and a jewel box can sit on it. Photorealistic luxury jewellery still-life photography. No objects, no jewels, no pearls, no flowers, no shadows of objects, no text, letters, numbers, logos or watermarks.
```
Kontrol: kenardan kenara düz kadife; kıvrım yok; renk mor (kırmızı ya da kahverengi değil); nesne yok.
Kullanım: index ve RSVP zemini (`cover`); geniş ekranda aynı görsel + CSS vinyet.

#### W2.2 Kadife karo — dikişsiz (home, story, details zemini)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/velvet_tile.png` · 1024×1024 · opak · dikişsiz

```
A square seamless tileable texture of the same deep aubergine silk velvet as the attached design board, seen from directly above and filling the whole canvas edge to edge: only the fine natural velvet pile with subtle organic variation (average #2A1328, from #1C0B1A to #4A2142), lit perfectly evenly — NO light pool, NO vignette, NO folds, no creases, no pattern, no repeating marks. Every edge continues seamlessly into the opposite edge so the square can repeat in a grid without a visible seam. Photorealistic macro texture photography. No objects, no text, letters, numbers, logos or watermarks.
```
Kontrol: eşit ışık; kıvrım ve leke yok; sol–sağ ve üst–alt kenarlar aynı tonda (küçük dikiş farkını Claude kırparak/ofsetle giderir; yalnız bunun için yeniden üretme).
Kullanım: uzun sayfaların zemini (`background-repeat`), üstünde CSS ışık süpürmesi.

#### W2.3 Kapalı kutu — kuşbakışı, klips OLMADAN
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_closed.png` · 1536×1024 · **Şeffaf zemin**

```
The closed jewel casket of the attached design board, alone, seen from DIRECTLY ABOVE (top-down, the camera looking straight down at the lid), perfectly straight, not rotated: a rectangular luxury jewel box, landscape about 4:3, covered in deep aubergine silk velvet (#2A1328, lit pile #4A2142), with softly rounded corners and a gently domed lid; a slim polished rose-gold piping (#C99A86) runs along every edge of the lid; in the centre of the lid a small rose-gold filigree cartouche with a tiny oval amethyst, completely empty inside (no letters, no monogram). The camera is tilted only very slightly toward the front, so a thin sliver of the box's front wall (about 3% of the image height) shows below the lid's front edge; the line where the lid's front edge meets that front wall is one crisp, straight, horizontal line with the rose-gold piping on it, clearly visible. NO clasp, no lock, no key, no ribbon, no bow, no jewellery on the box (the clasp is a separate image). Place it exactly: horizontally centred, about 72% of the image width, its top edge at about 10% and its bottom edge at about 90% of the image height. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. Only this one object, complete, not cropped, with empty margin around it. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow onto the ground, no glow, halo, light rays, sparkles or haze outside the object's outline (the website adds its own light). True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: tam üstten, düz; klips/kurdele yok; kapak ön kenarı ile ön duvar arasındaki çizgi net ve yatay; kartuş boş; konum tarife yakın; gölge yok; gerçek alfa.
Kullanım: kapalı hâl; Claude kapağı bu görselden keser (ön duvar şeridi gövdede kalır); kapak üst kenardaki menteşede `rotateX 0→90°`. Kartuşa istenirse `initials` canlı metin olarak konur.

#### W2.4 Klips — tek başına, aynı tuvalde
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/clasp.png` · 1536×1024 · **Şeffaf zemin**

```
Only the small rose-gold push clasp of the jewel box, alone, drawn exactly where it sits on the attached box_closed.png — the same 1536×1024 canvas, the same scale and the same top-down view (edit box_closed.png and remove the box, keeping only the clasp): horizontally centred over the middle of the lid's front edge, straddling the line between the lid and the front wall, about 9% of the image width wide: a polished rose-gold clasp plate (#C99A86, highlights #EBC9B5) with fine millegrain beading around an oval amethyst cabochon (#5B2A6E) set in a smooth bezel at its centre. Without the box behind it. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow, halo, light rays or sparkles outside the object's outline. True transparent background PNG with a real alpha channel — not white, not a checkerboard; everything except the clasp is fully transparent.
```
Kontrol: yalnız klips; box_closed.png'nin üstüne konunca ön kenarın tam ortasında, kenar çizgisinin üstünde; kutu yok; gerçek alfa.
Kullanım: dokununca kabaşon içe basılır (ölçek .92) ve klips kalkar (`rotateX`), "tık" sesi; sonra kapakla birlikte döner.

#### W2.5 Açık kutu — kapaksız, içi görünür (aynı tuvalde)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_open.png` · 1536×1024 · **Şeffaf zemin**

```
The SAME jewel box as the attached box_closed.png — the same 1536×1024 canvas, the same size, the same position and the same top-down view (edit box_closed.png so that the outer outline stays identical) — now with the lid removed (the lid is a separate image): we look straight down into the fitted interior. The velvet-covered rim and the thin front-wall sliver are exactly as in box_closed.png, with the rose-gold piping along the top of the rim, and there is a crisp, clearly visible edge where the rim meets the interior. Inside: a fitted aubergine velvet tray divided by slim velvet dividers into three compartments: a large CENTRAL compartment, portrait, about 5:7, lined with smooth champagne silk (#E8D3B0) and completely EMPTY (the invitation card is added separately), with one thin champagne silk pull-ribbon lying flat across its lower third; on the LEFT a narrow compartment with a padded velvet ring roll holding one slim rose-gold ring with a small amethyst; on the RIGHT a narrow compartment with a softly coiled strand of ivory pearls. Nothing on the rim, no lid, no card. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow outside the box, no glow, halo, light rays or sparkles outside the object's outline. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: box_closed.png'nin üstüne %50 saydam konunca dış çizgi (sol, sağ, alt kenar ve ön duvar şeridi) aynı yerde, aynı boyda — kayma gözle seçiliyorsa box_closed'u düzenleyerek yeniden üret; orta bölme boş, dikey ~5:7; yüzük ve inciler sade; gerçek alfa.
Kullanım: kapak açılınca kalan gövde; kart orta bölmeden yükselir (Claude bölmeyi ölçer, kartı oraya oturtur); yüzük ve incilerde CSS faset parıltısı.

#### W2.6 Kapağın içi — ipek astar (aynı tuvalde, menteşe ALTTA)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/lid_lining.png` · 1536×1024 · **Şeffaf zemin**

```
The INSIDE of the same jewel-box lid, as seen when the lid stands open behind the box and faces the viewer straight on (front view, not tilted): exactly the same outer outline, size and position on the 1536×1024 canvas as the lid in the attached box_closed.png (rounded corners, slim rose-gold piping along its edge), with the HINGE EDGE at the BOTTOM of the image and two tiny rose-gold hinge knuckles on that bottom edge. The lining: a smooth, softly padded champagne silk centre panel (#E8D3B0, sheen #F3E4C8), about 70% of the lid's width and 60% of its height, completely calm and EMPTY (the couple's names are printed on it live by the website), surrounded by fine champagne silk pleats radiating outward from the panel to the lid's edges (a sunray-pleated lining), then a thin band of aubergine velvet and the rose-gold piping. No mirror, no pocket, no jewellery, no label. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow, halo or light rays outside the object's outline. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: dış çizgi box_closed'daki kapakla aynı boy ve biçim; orta panel boş ve sakin; pliler panelden dışa; menteşe kenarı altta; ayna yok; gerçek alfa.
Kullanım: 90°'de devralan iç yüz (`rotateX -90°→0`, origin alt); home'un başında açık kapak; isimler orta panelde canlı metin + CSS varak ışığı.

#### W2.7 Fildişi kart — 3 dilim (açılış kartı + RSVP yanıt kartı)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/ivory_card.png` · 1024×1536 · **Şeffaf zemin**

```
One thick ivory cotton card (#F8EDE0), portrait, about 5:7, seen straight from the front, centred, about 80% of the image width, matching the reply card of the attached design board: crisp bevelled edges gilded in polished rose gold (a fine metallic edge all around), a subtle fine cotton-paper texture. At the top centre a small embossed rose-gold filigree crest with a tiny amethyst and two tiny pearls, staying within the top 15% of the card; at the bottom centre a smaller matching rose-gold filigree accent within the bottom 10% of the card. Everything between 18% and 88% of the card's height is COMPLETELY PLAIN, uniform ivory paper — no ornament, no line, no stain, no shading change — and the left and right edges are perfectly straight and vertical, so a thin horizontal slice of the middle can be repeated to make the card taller. Photorealistic luxury stationery still-life photography, one soft warm studio light from the upper left. Only this one card, complete, not cropped. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow or halo outside the card. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: orta bant (%18–88) düz ve eşit; yan kenarlar dik; süs yalnız üstte ve altta; yazı yok; gerçek alfa.
Kullanım: 3 dilim (üst süs / tekrar eden orta / alt süs): kutudan yükselen davet kartı (5:7, portre + "We're getting married") ve RSVP yanıt kartı (forma göre uzar).

#### W2.8 İpek panel — 3 dilim (içerik kartı)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/silk_card.png` · 1024×1536 · **Şeffaf zemin**

```
One padded panel of smooth champagne silk (#E8D3B0, sheen #F3E4C8) stretched taut over a board like the lining of a jewel box, portrait about 2:3, seen straight from the front, centred, about 84% of the image width, matching the silk card of the attached design board, with a slim polished rose-gold piping along all four edges and gently rounded corners. At the top centre, overlapping the top piping, a small rose-gold filigree ornament with an oval amethyst cabochon, within the top 14% of the panel; at the bottom centre a smaller mirrored rose-gold accent with one pearl, within the bottom 10%. Between 18% and 88% of the panel's height the silk is completely plain, smooth and uniform — no folds, no wrinkles, no gradient, only a very low-contrast even sheen — and the left and right edges are perfectly straight and vertical, so a thin horizontal slice of the middle can be repeated to make the panel any height. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. Only this one panel, complete, not cropped. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow or halo outside the panel. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: orta bant düz, kıvrımsız, düşük kontrast; yan kenarlar dik; süs yalnız üstte ve altta; gerçek alfa.
Kullanım: home davet metni, details programı ve blokları (Travel & stay, Menu, Registry, SSS), story başlıkları; içerik kadar uzar.

#### W2.9 İpek cep (RSVP kartının çıktığı cep)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/silk_pocket.png` · 1536×1024 · **Şeffaf zemin**

```
The front of a jewel-box lid pocket, alone, matching the pocket of the attached design board: a wide horizontal band of champagne silk (#E8D3B0) gathered into soft, even vertical pleats, with a slim polished rose-gold piping along its perfectly straight, horizontal top edge and a tiny pearl button at the centre of that top edge; its lower edge is straight as well. The band spans about 92% of the image width and occupies only the middle third of the image height (about 3:1); the rest of the canvas is empty. Seen straight from the front. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. Only this one object, complete, not cropped. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow or halo outside the object. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: tek parça pliseli ipek bant; üst kenar düz ve yatay; ortada inci düğme; gerçek alfa. Claude banda kırpar.
Kullanım: RSVP: kart cebin arkasından kayarak çıkar; cep ekranın altında durur.

#### W2.10 Tırnaklı taş yuvası — foto çerçevesi
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/gem_frame.png` · 1024×1536 · **Şeffaf zemin** · pencere boş (yeşil ya da şeffaf)

```
An emerald-cut gemstone SETTING used as a photo frame, alone, seen straight from the front, matching the photo settings of the attached design board: a slim polished rose-gold bezel (#C99A86, highlights #EBC9B5) shaped as a portrait rectangle with small cut (chamfered) corners — the window inside is a 4:5 portrait octagon — with a fine millegrain beaded inner edge, and at each of the four cut corners a pair of slim rose-gold claws (double prongs) that curl gently over the edge of the window, as if holding a stone. Refined and light, never heavy or baroque: no crest, no bow, no flowers, no gems on the frame. The frame is centred and fills about 88% of the image width. The inside of the window is EMPTY: flat pure green #00FF00 if you can keep it perfectly flat, otherwise fully transparent — either is accepted, as long as the rose-gold frame is closed all the way round and the window edge is crisp. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow or halo outside the frame. True transparent background PNG with a real alpha channel around the frame — not white, not a checkerboard.
```
Kontrol: pencere 4:5 dikey sekizgen (köşeleri kesik); çerçeve her yerde kapalı ve ince; dört köşede çift tırnak; pencere düz yeşil ya da şeffaf (ikisi de kabul); gerçek alfa.
Kullanım: bütün fotoğraflar (home portresi, açılış kartının portresi, story vitrini, mekân); Claude pencereyi ölçer, maskesini (`mask_gem.png`) çıkarır.

#### W2.11 Tepsi hücresi (geri sayım ve ikon kuyusu)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/tray_cell.png` · 1024×1024 · **Şeffaf zemin**

```
A single small square compartment of a fitted jewellery tray, alone, seen from directly above, matching the countdown cells of the attached design board: four short inner walls covered in deep aubergine silk velvet sloping down to a flat, calm, slightly darker velvet floor (#1C0B1A to #2A1328), a slim polished rose-gold piping along the top of the rim, softly rounded outer corners. The floor (the inner 60% of the cell) is completely calm and empty so a number can be printed on it. The cell is square, centred and fills about 80% of the image. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow or halo outside the cell. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: kare; iç taban sakin ve boş; rose gold kenar; gerçek alfa.
Kullanım: geri sayımın 4 hücresi; details program ikonlarının küçük kuyusu.

#### W2.12 Kadife kaide (story vitrini)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/display_pedestal.png` · 1536×1024 · **Şeffaf zemin**

```
A round, low jeweller's display pedestal (a short, wide cylinder like a ring-display plinth), alone, matching the pedestal of the attached design board: covered in deep aubergine silk velvet (#2A1328, lit pile #4A2142) with a polished rose-gold band around its top edge and another around its base, seen from the front at a slightly high eye level so its EMPTY top is a flat ellipse. It is about 80% of the image width, centred horizontally, sitting in the lower 55% of the image. Nothing on it. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. Only this one object, complete, not cropped. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow onto the ground, no glow, halo or light rays outside the object. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: tek kaide; üstü boş elips; iki rose gold bant; gerçek alfa.
Kullanım: Story: fotoğraflar kaidenin üstünde silindir karusel olarak döner; bantta CSS ışık süpürmesi.

#### W2.13 İnci dizisi ayırıcı
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/pearl_divider.png` · 1536×1024 · **Şeffaf zemin**

```
A single straight horizontal strand of lustrous ivory pearls (#F8EDE0 with a soft rosy overtone), gently graduated — slightly larger in the middle, smaller toward the ends — lying perfectly straight and level, spanning about 90% of the image width across the vertical middle of the image; at its centre a small faceted oval amethyst drop (#5B2A6E) in a fine rose-gold bezel hangs just below the strand. Seen straight from the front. The exact number of pearls does not matter. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. Only this one object, complete, not cropped. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow, halo, light rays or sparkles outside the pearls. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: düz ve yatay dizi; ortada ametist damla; gerçek alfa. Claude ince banda kırpar.
Kullanım: bölüm ayırıcı (başlık altı, açılışta isimlerin altı).

#### W2.14 Filigran süs (başlık süsü)
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/filigree_crest.png` · 1536×1024 · **Şeffaf zemin**

```
A small symmetrical rose-gold filigree ornament like a jeweller's brooch, alone, horizontal (about 2.5:1), seen straight from the front, matching the crests of the attached design board: a central oval amethyst cabochon (#5B2A6E) in a fine beaded bezel, flanked left and right by delicate polished rose-gold scrolls (#C99A86, highlights #EBC9B5) and two tiny ivory pearls; light and refined, not heavy, no crown. It spans about 70% of the image width, centred in the image. Photorealistic luxury jewellery still-life photography, one soft warm studio light from the upper left. Only this one object, complete, not cropped. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow, halo, light rays or sparkles outside the ornament. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
```
Kontrol: simetrik; ortada ametist; ince ve hafif; gerçek alfa.
Kullanım: sayfa başlıklarının üstü (home, story, details, rsvp); üstünden ışık süpürmesi.

#### W2.15–W2.19 Program ikonları — beş ayrı dosya
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/icon_rings.png`, `icon_coupes.png`, `icon_dinner.png`,
`icon_music.png`, `icon_key.png` (hepsi aynı klasörde) · her biri 1024×1024 · **Şeffaf zemin**

```
A small LINE ICON of [SUBJECT], alone, drawn as fine engraved lines of polished rose-gold metal (#C99A86 with lighter #EBC9B5 highlights), like thin gold wire: one even stroke weight (about 2.5% of the image width), open outlines with no fill, no background shape, no circle or badge around it, no extra ornaments, matching the programme icons of the attached design board. Front view, centred, filling about 60% of the square. All five icons of this set (rings, coupes, cloche, music, key) share exactly the same line weight, colour and style. One soft warm light from the upper left on the metal. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow or halo outside the lines. True transparent background PNG with a real alpha channel — not white, not a checkerboard.
[SUBJECT] — make five separate images:
icon_rings  = two interlocking wedding rings, one with a tiny gem on top
icon_coupes = two champagne coupes clinking, with a few tiny bubbles
icon_dinner = a domed dinner cloche on a plate
icon_music  = two joined musical eighth notes
icon_key    = an antique ornate key with a filigree bow
```
Kontrol: beş dosya, her birinde tek ikon; çizgi kalınlığı ve rengi beşinde aynı; dolgu ve arka şekil yok; temiz alfa kenarı (Claude alfayı maske olarak kullanıp rengini değiştirebilir).
Kullanım: details programı (rings = tören, coupes = kokteyl, dinner = akşam yemeği, music = dans), key = Travel & stay; ikonlar tepsi hücresinin içinde.

#### W2.20–W2.22 Süzülen taşlar — üç ayrı dosya
**Kaydet:** `collections/23_Velvet_Jewel_Box/assets/gpt/parts/gem_amethyst.png`, `gem_morganite.png`, `pearl.png`
(aynı klasörde) · her biri 1024×1024 · **Şeffaf zemin**

```
A single loose [STONE], alone, lying as if on velvet but WITHOUT the velvet, seen three-quarter from above, centred, filling about 45% of the square, matching the gems of the attached design board: crisp, believable facets (or lustre) catching one soft warm studio light from the upper left, with tiny bright specular highlights ON the stone only. No setting, no prongs, no other stones, no velvet, no surface. Photorealistic luxury jewellery macro photography. No text, letters, numbers, monograms, logos or watermarks. No cast shadow or drop shadow, no glow, halo, light rays, star sparkles or haze outside the stone's outline (the website adds its own sparkle). True transparent background PNG with a real alpha channel — not white, not a checkerboard.
[STONE] — make three separate images:
gem_amethyst  = oval faceted deep amethyst (#5B2A6E, lighter violet facets)
gem_morganite = pear-shaped faceted pale pink morganite (#E9B9B0)
pearl         = round lustrous ivory pearl (#F8EDE0) with a soft rosy overtone and a bright window reflection
```
Kontrol: üç dosya, her birinde tek taş; yüzey/kadife yok; dışarı taşan parıltı yok; gerçek alfa.
Kullanım: açılışta kapak kalkınca 2–3 taş kenardan kayar; home ve story kenarlarında yavaş paralaks; RSVP gönderilince inciler saçılır; parıltıyı site ekler.

### Instructions for GPT (order of work, saving, delivery)

**First message (send once, before the first image of this chat):**
```
You are the art director and still-life photographer of a luxury jewellery-inspired wedding stationery house. We are designing the mobile wedding website "Velvet Jewel Box" from scratch. Concept: the whole website is the inside of a jeweller's velvet jewel casket seen from directly above. Materials only: deep aubergine silk velvet (#1C0B1A, #2A1328, lit pile #4A2142), smooth champagne silk linings (#E8D3B0), polished rose gold (#C99A86, highlights #EBC9B5), lustrous ivory pearls (#F8EDE0) and a few faceted gemstones (amethyst #5B2A6E, pale pink morganite #E9B9B0). No flowers anywhere in the decoration — the jewels are the decoration. Photos are set like emerald-cut gemstones held by four rose-gold double claws. Everything must look photographed for real: rich, tactile, believable, magazine-quality luxury; never clip-art, never flat vector, never cheap stock. One soft warm studio light from the upper left in every image. The five attached photos show the fictional couple Isabelle and Julian; use them only for the photos inside the design board. Apart from the design board (W1), no image may contain text, letters, numbers, monograms, logos or watermarks. When an image asks for a transparent background it must be a TRUE transparent PNG (a real alpha channel, not white, not a checkerboard), with no cast shadow and no glow outside the object.
```
Attach these five images from the repository to that first message (couple reference for the board):
`collections/23_Velvet_Jewel_Box/assets/gpt/photos/hero_portrait.jpg`, `story_1.jpg`, `story_2.jpg`, `story_3.jpg`,
`venue.jpg`. **Do NOT attach** anything from `platform/themes/velvet-jewel-box/img/` (bg_scene, v3-closed, frames: the old
look that this package replaces) and do NOT attach the Crimson Rose Atelier board (a different design). The instruction at
the top of this file (bg_scene / v3-closed as style reference) does NOT apply to PAKET 8.

**Order of work (one chat):**
1. **W1** — generate the design board. If it misses its Kontrol line, generate it again (at most 3 tries). Save it at its
   Kaydet path → commit `G23 PAKET 8: W1 design board` → push.
2. **W2.1 → W2.22** in order, in the same chat. **Attach `mockups/design-board.png` as the reference image to every W2
   request.** For W2.4 clasp, W2.5 box_open and W2.6 lid_lining also attach `parts/box_closed.png` and produce them by
   **editing** it (same 1536×1024 canvas). Then check alignment: lay box_open.png and clasp.png over box_closed.png at 50%
   opacity — the box's outer outline and its front-wall sliver must sit in the same place at the same size. If a shift is
   visible, regenerate once; write any remaining difference in TESLIM.txt.
3. Use every prompt **word for word**. In the icon and stone groups replace `[SUBJECT]` / `[STONE]` with the listed line;
   each line is its own image and its own file.
4. **Ratio matters, pixels do not:** only 1:1, 2:3 or 3:2 canvases (the board ~2.3:1). If the tool returns a different pixel
   size, keep it. Do **not** resize, crop, repaint or colour-correct any image with code; Claude crops thin bands and cuts
   the pieces.
5. Photo window (W2.10): if flat green cannot be kept, a **transparent window is accepted**, as long as the rose-gold frame
   is closed all the way round.
6. Never regenerate because of the **number** of pearls, pleats or scrolls. If a part fails its Kontrol twice, save the best
   try, write why in TESLIM.txt and move on.

**Saving and committing:**
- Repository `muzaffergrl/davetiye-maker`, branch **`main`**. If you cannot push to `main`, push to the branch
  `codex/g23-paket8` and write that on the first line of TESLIM.txt.
- Every file goes **exactly** to the path and name on its Kaydet line: W1 → `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/`,
  W2 → `collections/23_Velvet_Jewel_Box/assets/gpt/parts/`. No Downloads folder, no zip, no other collection, nothing under
  `platform/`, no new folder, no renaming (`_final`, `_v2` …); rejected tries are not committed. Save as PNG.
- Intermediate saves: commit + push after W1 and after every 4–5 W2 parts (`G23 PAKET 8: W2 checkpoint (n/5)`), finally
  `G23 PAKET 8: W2 parts + TESLIM`. Run `git pull --rebase origin main` before every push.
- Touch no other file; write no code; do not run `gpt_yerlestir.py` or `build_images.py`.

**TESLIM.txt** → `collections/23_Velvet_Jewel_Box/assets/gpt/parts/TESLIM.txt` (plain text, Turkish or English):
- Branch and last commit; how many files were delivered (expected: the board + 22 parts).
- One line per file: name · target size → actual size · RGB/RGBA (is there a real alpha channel) · number of tries ·
  any deviation from its Kontrol line (which point, why).
- Alignment result: box_closed ↔ box_open, clasp and lid_lining (shift yes/no, roughly how much).
- Skipped or missing files and why; anything you are unsure about.
