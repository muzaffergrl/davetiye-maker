# GPT görsel istekleri — Tasarım 47 · Monochrome Darkroom

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> initials, monograms, logos, brand marks, QR codes or watermarks in any image** — also no edge numbers, frame numbers
> or printed markings on any film, no label on the film canister, no lettering on the loupe or the tray. Everything is
> strictly **neutral black, white and grey**: no colour cast, no sepia, no blue tint and no red (the website adds the red
> safelight itself). Romantic and rich, not ultra-minimal. Give W1 `black_paper.png`, W2 `fiber_paper.png` and W3
> `env_back.png` as the style reference of every later part: the same matte black photographic paper, the same warm white
> fibre-based photo paper, the same black light-tight envelope with its charcoal inside, the same single soft window light
> from the top-left. Parts drawn on the same envelope canvas (W3, W4, W5, W7) keep the envelope in exactly the same box.

Bu dosya tasarım 47'nin **bütün görsel parçalarının** tek kaynağıdır (4. dalga, `docs/33_GPT_YENI_10_TASARIM.md`). Durum
**concept**: platform teması (`platform/themes/monochrome-darkroom/`) **henüz yok** (önerilen G447 benzeri iş, `docs/33` →
"Sonra"); geçici görsel de yok. Tema kurulunca her parçanın nasıl kullanılacağı aşağıdaki "Kullanım" satırlarındadır;
gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar (isimler, tarih, baş harfler, mekân) HTML'dir,
hiçbir görsele pişirilmez. Kırmızı güvenlik ışığı, negatif (invert) ve "banyo" efektleri site CSS'idir; GPT parçaları
nötr gri.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/47_Monochrome_Darkroom/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/47_Monochrome_Darkroom --paket 5` ve `--paket 2` (oran, gerçek
  alfa, kenar payı, foto penceresi) + göz kontrolü. Tema kurulunca `python3 platform/themes/monochrome-darkroom/build_images.py`
  (G167 düzeni: her parça geldiği anda kullanılır) ve `python3 tools/gpt_kuru_deneme.py --tema monochrome-darkroom --sekil
  collections/47_Monochrome_Darkroom/assets/gpt/kuru_sekil.json` (prova). PAKET 6 için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **black-and-white analog film photography (silver gelatin) + photorealistic objects** — real matte black
  photographic paper, real warm white fibre-based photo paper, real developed 35 mm negative film with its sprocket holes,
  a real shallow developing tray, a real photographer's loupe, real white anemones with black centres; a photographer
  couple's darkroom and a love letter: romantic, rich and tactile. Not ultra-minimal, not cold editorial, not cartoon, not
  flat vector.
- Renkler: noir `#121212` · charcoal `#2A2A2A` · graphite `#5A5A5A` · silver grey `#A9A9A6` · paper white `#F4F2EE` · warm
  paper `#EAE5DC` · ink `#161616`. safelight red `#A3262A` **yalnız** açılıştaki ışık ve sitedeki küçük vurgu (CSS);
  hiçbir GPT görselinde kırmızı yok.
- Işık: tek yönlü yumuşak pencere ışığı **sol üstten**; bütün parçalar nötr gri tonlu (renk kayması, sepya, mavi ton
  yok). Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil), her kenarda en az %6 boşluk, nesnenin dışında
  gölge/hâle yok.
- Film: banyo edilmiş 35 mm negatif; kareler koyu ve **boş** (görüntü yok), perforasyon delikleri gerçekten şeffaf;
  kenar yazısı, kare numarası, marka izi yok.
- Foto penceresi yalnız W8 `film_tile`, W11 `fiber_print` ve W12 `fiber_wide`'da istenir (prompt'ta ölçüsüyle).
- Gerçek bir markaya, galeriye, sanatçıya ya da başka bir satıcının tasarımına benzemesin. **39 Silver Photo Booth'tan
  ayrı:** gümüş-fildişi, flaş, kabin şeridi yok; burada siyah kâğıt, negatif, karanlık oda, kırmızı ışık, lup. **06 Art
  Deco Noir'dan ayrı:** lacivert-altın geometri yok. **19 Midnight Garden'dan ayrı:** karanlık çiçek natürmortu ve gümüş
  mühür yok. **24'ten ayrı:** sinema/sahne yok (film makarası, projektör, klaket yok; film burada fotoğraf negatifi).

## Zarf geometrisi (W3–W7 ve W18 buna göre)
Tuval **1110×1500** (dikey). Zarf kutusu **x %7–93, y %6–94** (zarf ≈0,72:1). Dört katman **aynı tuvalde, aynı kutuda**
çizilir: W3 arka, W4 ön cep, W5 tuck kapak, W7 film halkası; Claude her birini kendi kutusuna kırpar. Zarfın yüzdesiyle →
tuval yüzdesi:
- ön cep: zarfın %36'sından alta → tuval **y %37,7–94**; üst kenarı düz, temiz kesik;
- tuck (içe sokulan) kapak: zarfın üstünden %40'ına → tuval **y %6–41,2**; tam genişlikte iner, zarfın ~%30'unda (tuval
  ~%32,4) iki kısa eğik omuzla daralıp **dil** olur (tuval x %15–85); dilin alt ucu cebin üst kenarının **arkasına**
  sokuludur (tuval %37,7–41,2 cebin arkasında, görünmez) — GPT kapağı tam çizer, cep onu örter;
- film halkası: kapağın cebe girdiği yerin ortasından (zarfın %50, %38'i → tuval **x %50, y %39,4**) çıkar, sağa tek
  gevşek halka yapar; **zarfın içinde kalır** (sağ ucu en fazla tuval x %88, yani zarfın sağ kenarından zarf eninin ~%6'sı
  içeride) → tuval kutusu ~**x %44–88, y %37–75**;
- açık kapağın iç yüzü (W6) ayrı tuvalde (1110×640): aynı çizgi dikey aynalanmış, oran korunur → tuval **x %7–93, y
  %8,75–91,25**.
- Katman sırası (tema): arka → kart → kapak → ön cep → film halkası.

Açılış: dokununca film halkası açılıp ekranda **yatay bir film şeridi** olarak akar (W8 kareleri; içinde çiftin
fotoğraflarının negatifi — CSS invert) → tuck kapak cepten çıkıp 3B kalkar (iç yüzü W6) → ekran **kırmızı güvenlik
ışığına** döner (CSS) → kart (W10) bir **banyo tepsisinde** (W9) boş beyazdan "banyo olarak" belirir (metin katmanı
yavaşça kararır) → ışık normale döner, kart yükselir → home.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Mat siyah fotoğraf kâğıdı (sayfa zemini)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/black_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of matte black light-tight photographic paper (#121212), like the black paper that photographic paper is packed in: a very fine, soft fibre and a gentle matte tooth, the faintest neutral grey lift toward #2A2A2A in broad soft areas from a single soft window light at the top-left, very low contrast, calm enough for white and silver grey text to read on it everywhere. Strictly neutral grey, no colour cast. No fold, no crease, no scratches, no dust specks, no pattern, no vignette, no shadow, no objects. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: mat siyah, çok sakin; leke/çizik/toz yok; renk kayması yok; dikişsiz (2×2 yan yana ek yeri yok); beyaz yazı her yerde okunur.
Kullanım: tema kurulunca bütün sayfaların zemini ve açılış sayfası (kapalı zarfın arkası).

#### W2 Sıcak beyaz lifli fotoğraf kâğıdı (kart, form)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/fiber_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of warm white fibre-based photographic paper (#F4F2EE), the matte back of a heavy darkroom print: a soft paper tooth, very faint long fibres, the gentlest warm variation toward #EAE5DC, calm enough for black text everywhere. Evenly lit by a soft window light from the top-left, neutral (no sepia, no yellowing). No fold, no crease, no stain, no printing, no pattern, no shadow, no vignette, no deckle edge. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sakin sıcak beyaz; dikişsiz; leke/baskı/desen yok; sararma yok; siyah yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, details program kartı, RSVP formu.

#### W3 Zarfın arkası (iç yüz görünür)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/env_back.png` · 1110×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope made of matte black light-tight photographic paper (as black_paper.png), seen perfectly straight on, on a fully transparent background. The envelope occupies exactly x 7–93% and y 6–94% of the canvas (about 0.72 wide : 1 tall) — the same box is used later by env_front.png, flap.png and film_curl.png, so keep it exactly there. We look at its inside: a plain, smooth charcoal grey paper lining (#2A2A2A) with a soft matte tooth covers the panel, and along the top edge and both sides a slim rim of the envelope's own matte black paper (#121212) shows, a crisp fine edge so the outline reads. The top edge is straight and open (the flap is not drawn). Single soft window light from the top-left, a gentle shade toward the bottom where the pocket will sit. Neutral grey only. No flap, no front pocket, no film, no card, no seal, no sticker. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: zarf x %7–93 / y %6–94 kutusunda; içi düz kömür gri, kenarda siyah pay; kapak/cep/film yok; gölge/hâle yok; gerçek alfa.
Kullanım: tema kurulunca zarf kutusuna (`7, 6, 93, 94`) kırpılır → zarfın en arka katı; kapak kalkınca kömür gri iç görünür, kart onun önünden yükselir.

#### W4 Zarfın ön cebi
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/env_front.png` · 1110×1500 · **Şeffaf zemin**

```
Only the front pocket of the same matte black envelope as env_back.png, on the same 1110×1500 canvas and in exactly the same place, on a fully transparent background: the envelope box is again exactly x 7–93% and y 6–94% of the canvas, and the pocket fills that box from 37.7% of the canvas height down to the envelope's bottom edge at 94%, across the full envelope width (x 7–93%). It is the same matte black light-tight photographic paper (#121212, a very fine fibre), showing the softly folded side and bottom flaps of a real envelope with gentle fold lines picked out by the window light; its top edge is perfectly straight, a clean cut with a hair-fine lighter grey rim (#5A5A5A) so it reads against the charcoal inside. Everything above the pocket is fully transparent. Single soft window light from the top-left, neutral grey only. No flap, no film, no card, no seal. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: cep tuvalin ~%37,7'sinden alta, zarfla aynı genişlik; üst kenar düz ve ince gri çizgiyle okunur; üstü tamamen şeffaf; W3 ile kenarlar çakışıyor; gerçek alfa.
Kullanım: tema kurulunca aynı zarf kutusuna kırpılır → ön cep (`.env-front`); kapağın dili bunun arkasına sokulu durur, kart bunun arkasından yükselir.

#### W5 Tuck kapak (kapalı, dış yüz)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/flap.png` · 1110×1500 · **Şeffaf zemin**

```
Only the closed tuck-in flap of the same matte black envelope as env_back.png, on the same 1110×1500 canvas and in exactly the same place, on a fully transparent background: the envelope box is again exactly x 7–93% and y 6–94% of the canvas. The flap hangs from the envelope's top edge at 6% (a soft rounded fold line) across the full envelope width (x 7–93%) and runs straight down to 32% of the canvas height; there two short angled shoulders step it in to a slightly narrower tuck tongue (x 15–85%) that continues straight down to 41% of the canvas height and ends in softly rounded corners. Draw the whole flap including the tongue: on the website the lowest part of the tongue (below 37.7%) is hidden inside the pocket. The same matte black light-tight photographic paper (#121212), a hair-fine lighter grey edge (#5A5A5A) along its outline and a very soft contact shade on the flap itself just inside the shoulders. Everything around the flap is fully transparent. Single soft window light from the top-left, neutral grey only. No seal, no sticker, no string, no button, no film. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tam genişlik kapak %6–32, iki eğik omuz, dil x %15–85 ve %41'e kadar; V/yuvarlak değil, mühür yok; siyah kâğıt; altı şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapak kutusuna (`7, 6, 93, 41.2`) kırpılır → kapalı kapak (kart ile ön cep arasında); açılışta film aktıktan sonra cepten yukarı kayıp üst kenarında 3B kalkar.

#### W6 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/flap_in.png` · 1110×640 · **Şeffaf zemin**

```
The inside of the same tuck-in envelope flap as flap.png, alone, seen straight on as it stands up above the envelope when it is open, on a fully transparent background: exactly the same outline and proportions as the whole flap of flap.png (about 1.8 wide : 1 tall, including the tongue) but mirrored vertically — its straight fold edge runs along the BOTTOM and its narrower tuck tongue with the two angled shoulders points UP. On this 1110×640 canvas it spans x 7–93% of the width and y 8.75–91.25% of the height. The inside is the same plain charcoal grey paper lining (#2A2A2A) as env_back.png, with a slim matte black rim (#121212) along its edges. Single soft window light from the top-left, neutral grey only. No seal, no film. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: düz katlama kenarı altta, dil üstte; oranı W5'teki kapakla aynı; kömür gri iç, siyah pay; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır, kapak enine ölçeklenir → kapak 90°'yi geçince zarfın üstünde dik duran iç yüz.

#### W7 35 mm negatif film halkası (kapanış)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/film_curl.png` · 1110×1500 · **Şeffaf zemin**

```
On the same 1110×1500 canvas as env_back.png and flap.png, in exactly the same place (the envelope box is x 7–93% and y 6–94% of the canvas, but the envelope itself is NOT drawn here), only a curling strip of developed 35 mm negative film, on a fully transparent background, photorealistic: the strip starts at the horizontal centre at about y 38–39% of the canvas, its upper end a clean straight cut lying exactly on the line where the flap is tucked into the pocket, as if the film slides out of that slot; it runs down and then curls to the right in one loose, open, graceful loop, like film springing off a roll, and its free end lies flat, pointing right, cut straight across. The film is about 14% of the canvas width wide; the whole curl stays inside x 44–88% and y 37–75% of the canvas (inside the envelope, never past its right edge). Its frames are dark and EMPTY: deep charcoal (#2A2A2A) with no image in them, the rebates along both edges a slightly lighter translucent grey (#5A5A5A) with a soft sheen, and the sprocket holes along both edges clearly visible and truly transparent (real alpha). Single soft window light from the top-left catching the curve, neutral grey only. No canister, no reel, no envelope, no flap. No edge numbers or markings. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek film halkası, üst ucu ortada cebin ağzında, sağa tek gevşek halka, zarfın içinde (x ~%44–88, y ~%37–75); kareler koyu ve boş; delikler şeffaf; kenar yazısı yok; gerçek alfa.
Kullanım: tema kurulunca aynı zarf tuvalinde tam tuval katman (en üstte); dokununca halka açılıp yerini ekranda yatay akan film şeridine (W8 kareleri) bırakır.

#### W8 Tek kareli 35 mm film parçası (uç uca dizilen)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/film_tile.png` · 1200×1100 · **Şeffaf zemin**

```
A single-frame piece of developed 35 mm negative film, alone, seen perfectly flat and straight on, horizontal, on a fully transparent background, photorealistic: the film spans exactly x 72–1128 px and y 66–1034 px of the 1200×1100 canvas; its left and right ends are cut perfectly straight and square exactly halfway between two frames (pieces placed end to end form one continuous strip). The film base is a deep charcoal (#2A2A2A) with a soft satin sheen. In it one photo frame window exactly 960 px wide and 640 px tall (3:2), its top-left corner at x 120 px, y 230 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Along the top band (above the window) and the bottom band (below it) a row of eight evenly spaced small rounded-rectangle sprocket holes each, about 132 px apart, each hole about 77 px wide and 55 px tall, centred about 80 px from the film's top and bottom edges; the holes are truly transparent (real alpha), lined up identically in the top and bottom rows. Single soft window light from the top-left, neutral grey only. No edge numbers, no frame numbers, no markings. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek kare; pencere düz `#00FF00` dikdörtgen (3:2), ~960×640, sol üst ~(120, 230); üstte ve altta 8'er şeffaf delik; uçlar düz kesik; kenar yazısı yok; gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür ve şeffaf yapılır; parçalar uç uca dizilip açılışta ekranda yatay akan film şeridi olur (karelerde çiftin fotoğraflarının negatifi, CSS invert); story'de kontak baskı şeridi (35 mm kareler) + parmağı izleyen lup (W13); details'te ayırıcı yerine kısa şerit.

#### W9 Banyo tepsisi (açılışta kartın belirdiği yer)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/tray.png` · 1400×1100 · **Şeffaf zemin**

```
A shallow black photographic developing tray seen from directly above, flat and straight on, alone, on a fully transparent background, photorealistic: a rectangular matte black tray (#121212) with a softly rolled rim, rounded corners, a small pouring lip at one corner and faint shallow ribs on its floor seen through the liquid; it is filled with a calm, perfectly still liquid whose surface is a smooth dark grey (#2A2A2A shading to #5A5A5A) with one soft, broad reflection of the window light from the top-left. The tray spans about x 7–93% and y 8–92% of the canvas. The middle of the tray is calm and empty (a card is placed there by the website). Neutral grey only, no red. No tongs, no thermometer, no print, no paper, no bubbles, no splashes. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tepeden düz siyah tepsi; sıvı sakin koyu gri, ortası boş; maşa/kâğıt/kırmızı yok; yazı yok; gerçek alfa.
Kullanım: tema kurulunca açılışta kırmızı güvenlik ışığı (CSS) altında kart (W10) bu tepsinin ortasında boş beyazdan "banyo olarak" belirir; RSVP teşekkür ekranında küçük.

#### W10 Zarftaki kart (boş)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen straight on, on a fully transparent background: the warm white fibre-based photo paper of fiber_paper.png (#F4F2EE) as a thick card with crisp square corners, spanning x 7–93% and y 6–94% of the canvas, a single fine black hairline (#161616) inset about 5% from the card's edge. The whole card inside the line is EMPTY paper (the website sets the names, date and venue there in HTML). Single soft window light from the top-left, a hair-fine contact shade on the card's own edge only, neutral (no sepia). No flowers, no film, no photo, no ornament. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: boş sıcak beyaz lifli kart, ince siyah kenar çizgisi; içi tamamen boş; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → banyo tepsisinde beliren ve zarftan yükselen kart, home kartı (isimler, tarih, mekân HTML).

#### W11 Parlak lifli baskı (dikey foto çerçevesi)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/fiber_print.png` · 1000×1250 · **Şeffaf zemin**

```
A glossy black-and-white fibre-based darkroom print, alone, seen straight on, on a fully transparent background, photorealistic: a sheet of heavy warm white glossy photo paper (#F4F2EE) with a clean white border, the paper very slightly wavy as fibre prints dry, catching soft highlights from the window light at the top-left; the paper spans about x 6–94% and y 6–94% of the canvas. In it a portrait photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 130 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Neutral grey only. No clip, no pin, no tape. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, ~760×950 (4:5), sol üst ~(120, 130); beyaz kenarlı hafif dalgalı parlak kâğıt; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → home kartı portresi, hikâye tanıtımı ve Story'nin üç anı (sol–sağ–sol): fotoğraf önce negatif (CSS invert) gelir, sahnenin ortasında pozitife döner.

#### W12 Geniş lifli baskı (mekân fotoğrafı)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/fiber_wide.png` · 1600×1050 · **Şeffaf zemin**

```
A wide glossy black-and-white fibre-based darkroom print, alone, seen straight on, on a fully transparent background, photorealistic: the same heavy warm white glossy photo paper as fiber_print.png (#F4F2EE) with a clean white border, very slightly wavy, soft highlights from the window light at the top-left; the paper spans about x 6–94% and y 6–94% of the canvas. In it a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 140 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Neutral grey only. No clip, no pin, no tape. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, ~1360×765 (16:9), sol üst ~(120, 140); W11 ile aynı kâğıt; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafının geniş baskısı (negatiften pozitife döner).

#### W13 Fotoğrafçı lupu (yukarıdan)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/loupe.png` · 700×700 · **Şeffaf zemin**

```
A photographer's loupe seen from directly above, alone, centred, on a fully transparent background, photorealistic: a round, thick matte black barrel rim (#121212) with a fine knurled grip on its outer edge and a slim polished chrome ring (#A9A9A6 with crisp highlights) on its top face; its outer diameter is about 76% of the canvas, and inside it a round clear opening about 57% of the canvas across, centred. The lens area inside the ring is COMPLETELY transparent (alpha zero): no glass drawn, no reflection, no tint, nothing inside it — the website does the magnification. Single soft window light from the top-left on the rim, neutral grey only. No strap, no cord. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No lettering on the rim. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tepeden yuvarlak lup; siyah halka + ince krom; mercek alanı tamamen şeffaf (cam/yansıma yok); halkada yazı yok; gerçek alfa.
Kullanım: tema kurulunca story'de kontak baskı şeridinin üstünde parmağı/fareyi izleyen lup (büyütme CSS); RSVP'de küçük.

#### W14 Anemon köşesi (beyaz anemon + siyah saten kurdele + film ucu)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/anemones.png` · 1200×1000 · **Şeffaf zemin**

```
A romantic corner cluster growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photographed in black and white (no colour at all): three or four white anemones (#F4F2EE petals) with velvety black centres and dark stamens, two closed buds, slender stems and a few frilled leaves rendered in soft mid and dark greys, a thin black satin ribbon (#121212) with a soft sheen looping through it with one tail trailing down, and the cut end of a short strip of dark 35 mm negative film (empty dark frames, sprocket holes truly transparent) tucked among the stems. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right third of the canvas is completely empty. Single soft window light from the top-left, rich silver-gelatin tones, neutral grey only. No vase, no other flower. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: sol üstten çıkan küme, sağ alt üçte bir boş; tamamen siyah-beyaz (renk yok); beyaz anemon siyah göbek, siyah kurdele, film ucu; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşeleri (sağda aynalanır), imzada ve RSVP kapanışında küçük.

#### W15 Film kutusu (yazısız)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/canister.png` · 500×700 · **Şeffaf zemin**

```
A single 35 mm film canister standing upright, alone, seen from the front, on a fully transparent background, photorealistic: a small brushed silver metal cylinder (#A9A9A6, crisp highlights) with matte black end caps (#121212), a short spindle nub on top, and a short tongue of dark film leader (#2A2A2A, a few transparent sprocket holes) coming out of its side slot and curling slightly. Completely plain: no label, no printed pattern, no barcode-like squares, no stripes. The canister spans about x 18–82% and y 8–92% of the canvas. Single soft window light from the top-left, neutral grey only. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek dik film kutusu, kısa film dili; etiket/desen/yazı yok; gerçek alfa.
Kullanım: tema kurulunca details'te program kartının yanında ve home imzasında küçük süs.

#### W16 Kısa negatif film şeridi (bölüm ayırıcı)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/divider.png` · 1600×220 · **Şeffaf zemin**

```
A short strip of developed 35 mm negative film lying horizontally with a very gentle curve, alone, on a fully transparent background, photorealistic: about six dark, EMPTY frames (deep charcoal #2A2A2A, no image in them) in a row, lighter translucent grey rebates (#5A5A5A) along both edges with small sprocket holes that are truly transparent, both ends cut straight, a soft satin sheen catching the window light from the top-left. The strip spans about x 7–93% of the width and stays between 18% and 82% of the height. Neutral grey only. No edge numbers or markings, no canister, no reel. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: yatay, hafif kavisli kısa şerit; ~6 koyu boş kare; delikler şeffaf; kenar yazısı yok; iki uçta boşluk; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet ve gün, details program, RSVP formu).

#### W17 Süzülen küçük nesneler — iki ayrı dosya
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/accent_1.png`, `accent_2.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photographed in black and white (no colour at all), single soft window light from the top-left, neutral grey only. No other object. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. (Make two files, the same light and scale: 1 = one single loose white anemone petal (#F4F2EE), silky and softly cupped, a pale grey shade in its fold; 2 = one short snip of dark 35 mm negative film (two empty frames, transparent sprocket holes) curled into a small loose spiral.)
```
Kontrol: her dosyada tek nesne; iki dosya farklı (anemon yaprağı, küçük film kıvrımı); renk yok; kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışta ve RSVP gönderilince süzülen küçük nesneler (her biri ayrı katman, kendi fazında).

#### W18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, photographed in rich black and white (silver-gelatin tones, no colour at all), a single soft window light from the top-left: the closed portrait matte black envelope of flap.png with its tuck-in flap and the curling 35 mm negative film of film_curl.png coming out of it, lying slightly below the centre on a few loosely overlapping sheets of warm white fibre photo paper (as fiber_paper.png); at the left a cluster of white anemones with black centres and a thin black satin ribbon (as anemones.png); at the right the photographer's loupe of loupe.png lying flat and the plain film canister of canister.png; behind, softly out of focus, a few contact sheets whose small frames are only empty soft grey. The top 20% of the image is calm and soft (only out-of-focus paper and soft dark tones). This image is cropped to 1200×630 for link previews: keep the whole envelope and film visible with at least 5% empty margin below it. No people, no red. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf + film halkası bütün, altında ≥%5 boşluk; tamamen siyah-beyaz; kontak baskı kareleri boş gri; üst %20 sakin; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım: üstten ~%21) ve katalog kapağı.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Simone & Elliot; gerçek kişiye benzemesin)

Ortak: black-and-white fine-art wedding photography on classic black-and-white film, rich grain and deep silver-gelatin
tones, romantic and intimate, soft natural light; ONE fictional couple in their early thirties, the same two people in
every photo (they must not resemble any real person or celebrity): Simone — a short blunt dark bob with a straight fringe,
light-medium skin, natural lips (no bold lipstick), a slim ring; Elliot — long, nearly shoulder-length light-brown hair
swept back, a short beard, fair skin; in some photos an old film camera hangs from his neck (plain, unbranded, no
lettering). Modern, elegant clothing. Story photos are cropped to 4:5 in a print: keep faces and hands in the middle 70%.
No text, no frame, no watermark, no readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Hero ve Story fotoğrafları sitede **4:5** kırpılır (W11 lifli baskı);
Story başlıkları `content.demo.json` → `story.items` ile aynı. Sitede önce negatif (CSS invert) görünür, sonra pozitife döner.

#### 2.1 Ana portre
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white film wedding portrait of the fictional couple Simone and Elliot, in their early thirties (Simone: a short blunt dark bob with a straight fringe, light-medium skin, natural lips; Elliot: long, nearly shoulder-length light-brown hair swept back, a short beard, fair skin; they must not resemble any real person or celebrity), standing close beside a tall old loft window in soft single window light from the top-left, she leaning into his shoulder, both smiling softly, waist-up, faces in the upper middle of the frame: she in a sleek white silk wedding gown with a square neckline, he in a black suit with a narrow black tie. Rich grain, deep silver tones, gentle shadows. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.2 Story 1 — "Our first roll of film"
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white film photo: the same couple as hero_portrait.jpg (same faces, hair and skin) on a quiet old city street, photographing each other — he lowers the plain, unbranded film camera hanging from his neck and laughs as she aims a small plain camera back at him; casual autumn clothes (a long coat, a knit sweater); brick facades and shop windows softly blurred behind them. A generic street, not a recognisable place. No readable signs, no shop names, no lettering on the cameras. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.3 Story 2 — "Rainy afternoons"
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white film photo: the same couple as hero_portrait.jpg sheltering together under one black umbrella on a rain-wet city pavement, she tucked under his arm and laughing up at him, fine streaks of rain in the air and soft reflections on the wet stones, a blurred street behind them. Rich grain, deep silver tones. A generic street, not a recognisable place. No readable signs. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.4 Story 3 — "Developing forever"
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white film close-up: the hands of the same couple as hero_portrait.jpg (same skin tones) resting together on a darkroom contact sheet, her hand with a slim engagement ring catching the light, his hand gently over hers; the contact sheet shows rows of small frames that are only soft, out-of-focus grey tones with no recognisable image, and no edge numbers or markings; shallow depth of field, soft window light from the top-left. Natural, well-formed hands with five fingers each. Rich grain, deep silver tones. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.5 Mekân
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9 black-and-white film photograph of an old gallery loft prepared for a wedding dinner, empty of people: tall factory windows with slim steel mullions letting in soft daylight from the left, white-painted brick walls with a few large empty white frames hung on them, long wooden tables in rows with white linen, candles and low arrangements of white anemones with black centres, a polished concrete floor. Rich grain, deep silver tones. A generic space that must not resemble any real gallery or venue. No people, no signs, no artworks with recognisable images, no religious objects. No text, letters, numbers, monograms, logos or watermarks.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın `'monochrome-darkroom'` bloğu
> **henüz yok** — tema kurulunca eklenecek (önerilen G447 benzeri iş). Tema yokken geçici baskı da yok.
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli
> hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> %13'ün altı, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda. Baskı kâğıdı sıcak beyaz (siyah zemin değil: ev yazıcısında mürekkep ve okunurluk).
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema kurulunca `layouts.ts`'e `'monochrome-darkroom'` bloğu eklenir: `sources` → `{ front:
>    'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme monochrome-darkroom` ve `node scripts/print-sample.ts
>    --theme monochrome-darkroom --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm white fibre-based photo paper of fiber_paper.png (#F4F2EE). Across the top, between 9% and 91% of the width, a short, gently curving strip of dark 35 mm negative film (as divider.png: empty dark frames, small sprocket holes) with two white anemones with black centres and a thin black satin ribbon (as anemones.png) resting at its centre, photographed in black and white; nothing in this top band reaches lower than 17% of the height. Along the bottom, between 93% and 95.5% of the height and from 14% to 86% of the width, a slim row of small black rounded-rectangle sprocket-hole shapes, like the edge of a film strip. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no petal, no film, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges. Neutral black, white and grey only, no red. No QR code. No edge numbers on the film. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; film şeridi + anemonlar yalnız üstte (%17'nin üstünde), delik dizisi yalnız altta; yan %8 boş; renk/yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same warm white fibre-based photo paper, only a short straight piece of dark 35 mm negative film with three empty dark frames and small sprocket holes lying horizontally across the top centre (between 30% and 70% of the width), with one small white anemone bud beside it, its lowest point staying above 11% of the height. The whole area below 13% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no film, no line, no shadow, no stain. No ornament within 8% of the left and right edges. Neutral black, white and grey only. No QR code. No edge numbers on the film. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada kısa film parçası (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

PAKET 3/7 (Etsy ilan sahneleri) burada yok: tema kurulunca `tools/paket7_ilan.py` ile üretilecek.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> Set bu tasarımın kendi dünyası (PAKET 3 yok; `EK_SETLER`): bütün sahnelerde aynı masa, süs, ışık. Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 47`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Monochrome Darkroom". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a matte black darkroom bench, a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with black centres and warm white fibre photo paper, the same light and the same color world (black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a matte black darkroom bench, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with black centres and warm white fibre photo paper, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a matte black darkroom bench, a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with black centres and warm white fibre photo paper. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a strip of developed 35 mm film negatives, a photographer's loupe. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a matte black darkroom bench, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with black centres and warm white fibre photo paper. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a matte black darkroom bench, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with black centres and warm white fibre photo paper arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a matte black darkroom bench: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with black centres and warm white fibre photo paper. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a matte black darkroom bench: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with black centres and warm white fibre photo paper. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a matte black darkroom bench, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with black centres and warm white fibre photo paper. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a strip of developed 35 mm film negatives, a photographer's loupe; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a matte black darkroom bench, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/47_Monochrome_Darkroom/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a matte black darkroom bench: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a strip of developed 35 mm film negatives, a photographer's loupe, white anemones with black centres and warm white fibre photo paper. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black and white only: noir, charcoal, graphite, silver grey and warm paper white, no red. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
