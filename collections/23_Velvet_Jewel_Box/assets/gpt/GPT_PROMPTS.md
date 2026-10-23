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
