# GPT görsel istekleri — Tasarım 48 · Navy Ivory Crest

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, initials,
> monograms, mottos, logos, heraldic charges (no lions, eagles, crowns, helmets, crosses, stripes, bars or anchors on a
> shield), real coats of arms, religious symbols, QR codes or watermarks in any image.** Every crest, shield, seal and
> cartouche stays EMPTY: the couple's initials are added later as live website text, never painted. Give W1
> `navy_linen.png`, W2 `ivory_cotton.png` and W3 `env_back.png` as the style reference of every later part: the same
> navy linen weave, the same smooth ivory cotton paper, the same envelope, the same soft morning light from the top-left
> with a low raking angle that reveals the blind embossing. W3 `env_back.png`, W4 `env_front.png`, W5 `flap.png` and W8
> `ribbon_tab.png` sit on the same 1400×1000 canvas: attach `env_back.png` to each of them and keep the envelope in
> exactly the same place and size.

Bu dosya tasarım 48'in **bütün görsel parçalarının** tek kaynağıdır (`docs/33_GPT_YENI_10_TASARIM.md`, 4. dalga). Tema
(`platform/themes/navy-ivory-crest/`) **henüz yok**, durum `concept`; geçici görsel de yok. Her parçanın sitede nerede
kullanılacağı altındaki "Kullanım" satırında, tema kurulunca uygulanacak biçimde yazılı. Kalkan, mühür ve kartuş her
görselde **boş**; çiftin baş harfleri ve bütün kişisel alanlar HTML metindir (görsele pişmez).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/48_Navy_Ivory_Crest/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/48_Navy_Ivory_Crest --paket 5` ve `--paket 2` (oran, gerçek
  alfa, kenar payı, foto pencereleri) + göz kontrolü. Tema kurulunca `python3 platform/themes/navy-ivory-crest/build_images.py`
  her parçayı geldiği anda kullanır (G167 düzeni) ve `python3 tools/gpt_kuru_deneme.py --tema navy-ivory-crest --sekil
  collections/48_Navy_Ivory_Crest/assets/gpt/kuru_sekil.json` ile prova koşulur. PAKET 6 için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **fine gold line engraving + blind embossing (letterpress) + photorealism** — real navy linen weave, real smooth
  ivory cotton paper, real ivory sealing wax, real navy grosgrain, real magnolia and bay laurel; classic, romantic, rich
  and airy, an old seaside manor in the morning. Not flat vector, not clip-art, not a heraldry chart.
- Renkler: navy `#1C2A48` · deep navy `#111A30` · navy ink `#28385C` · slate `#6D7C99` · ivory `#F5F0E3` · parchment
  `#E8E0CC` · gold `#B8964F` · gold light `#DCC489` · laurel `#6F7A5A` (yalnız yaprakta) · ink `#1A2236`.
- Işık: **sabah ışığı sol üstten**, kabartmayı okutan **alçak yan açı**; bütün parçalarda aynı. Kör kabartma = mürekkepsiz,
  folyosuz, kâğıdın/ketenin kendi renginde; yalnız bu ışıkla okunur. Şeffaf parçalarda gerçek alfa; nesnenin dışına düşen
  gölge, hâle, ışıma yok (altın ışık süpürmesini site ekler).
- Arma kuralı: kalkan, mühür, kartuş **her zaman boş**; harf, monogram, hanedan figürü, taç, miğfer, slogan kurdelesi,
  çapa, gerçek arma yok. Altın gravür: ince, net, tarama çizgili; dolu renk alanı yok (W9 `crest.png` sonraki altın
  parçaların çizgi örneğidir).
- Gerçek bir aileye, kuruma, okula, kulübe ya da şehre ait armaya, markaya, sanatçıya ya da başka bir satıcının
  tasarımına benzemesin. 06'dan (geometrik art deco, yelpaze), 19'dan (siyah zarf, gümüş mühür) ve 17'den (zümrüt, mermer)
  ayrı.

## Kapalı zarf geometrisi (W3–W8 buna göre)
Zarf **yatay cüzdan (wallet)**, tuval **1400×1000**; zarf kutusu tuvalin **x %9,5–90,5, y %10–90**'ı (1134×800 px ≈
1,42:1 — şartnamedeki x %7–93 bu oranı vermediği için kutu 1,42:1'e göre daraltıldı). W3 arka, W4 ön cep, W5 kapak
(kabartma kartuş dahil) ve W8 kurdele dili **aynı tuvalde, aynı konumda** çizilir; mühür (W7) ayrı tuvalde gelir ve
kurdele dilinin üst ucunun üstüne konur. Yüzdeler zarf boyunun yüzdesi (parantezde tuval):
- ön cep: zarfın %30'undan (tuval %34) alta, üst kenarı düz.
- düz kapak: üstten zarfın %56'sına (tuval %54,8), alt kenarı düz (V değil).
- kör kabartma boş defne kartuşu: merkez zarfın (%50, %32)'si (tuval %50, %35,6), eni zarf eninin %30'u (≈340 px), boyu
  ≈200 px (yatay oval; mührün üst ucuna değmesin diye).
- kalkan mühür: merkez zarfın (%50, %56)'sı = kapağın alt kenarı (tuval %50, %54,8), eni zarf eninin %13'ü (≈147 px), boyu
  ≈172 px (tuval ≈%46–%63).
- kurdele dili: üst ucu tuvalin %50'si (mührün altında), alt ucu tuvalin %70'i (zarfın %75'i), eni ≈80 px, ucu V kesik
  (mührün altından ≈55 px görünür).
- Açılış (tema): kabartmanın üstünden altın ışık süpürür → mühür kurdele diliyle kalkıp yana döner → kapak üst katından
  3B açılır → fildişi kart (W10) yükselir, üstünde arma (W9) aşağıdan yukarı kazınarak belirir → home.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Lacivert keten (zarf, sayfa zemini)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/navy_linen.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of fine navy linen (#1C2A48) filling the whole square: a crisp, even plain weave with natural slubs, the threads varying gently between navy (#1C2A48) and a deeper navy (#111A30) with a few slightly lighter navy-ink threads (#28385C), a soft matte surface with a faint natural sheen. Evenly lit by soft morning light from the top-left, very low contrast overall. No fold, no crease, no stain, no stitching, no pattern, no embossing, no vignette, no shadow. Calm and dark enough for ivory text to read on it everywhere. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); lacivert `#1C2A48` civarı, keten dokusu görünür; leke/desen yok; fildişi yazı okunur.
Kullanım: tema kurulunca index sayfasının zemini, zarf rengi referansı ve home'daki lacivert "The Day" bandı.

#### W2 Fildişi pamuk kâğıt (kartlar, form)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/ivory_cotton.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of smooth, heavy ivory cotton paper (#F5F0E3): a fine soft tooth, a few faint cotton fibres, an even warm ivory tone with only the faintest parchment (#E8E0CC) clouding, calm enough for navy text everywhere. Perfectly flat: no embossing, no laid lines, no watermark pattern, no deckle edge, no fold, no stain, no printing, no vignette, no shadow. Evenly lit by soft morning light from the top-left. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sakin fildişi, düz (kabartma dokusu yok); dikişsiz; leke/baskı yok; lacivert yazı okunur.
Kullanım: tema kurulunca story/details/rsvp sayfa zemini, davet bandı, form kartı.

#### W3 Zarfın arkası (açık, çizgili iç astar)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/env_back.png` · 1400×1000 · **Şeffaf zemin**

```
The back panel of an open landscape wallet envelope made of the navy linen of navy_linen.png, seen perfectly straight on, on a fully transparent background; the envelope occupies exactly x 9.5–90.5% and y 10–90% of the canvas (about 1.42:1). Its inside faces us: it is lined with smooth ivory paper (#F5F0E3) printed with fine, evenly spaced vertical navy pinstripes (#28385C) about 18 px apart, the lining covering the whole panel, with a slim rim of navy linen showing along the top and both sides. The top edge is straight and open — no flap is drawn, no V shape. A gentle soft shade on the lining towards the bottom, where the pocket will sit. Soft morning light from the top-left. No front pocket, no flap, no seal, no ribbon, no card inside. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf tuvalin x %9,5–90,5, y %10–90'ında (yatay); içi fildişi + ince lacivert çizgili astar; kapak/cep/mühür yok; gerçek alfa.
Kullanım: tema kurulunca zarfın arka katmanı (`.env-back`); kapak açılınca görünen iç astar, kart bunun önünden yükselir.

#### W4 Zarfın ön cebi
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/env_front.png` · 1400×1000 · **Şeffaf zemin**

```
Only the front pocket of the same navy linen wallet envelope as env_back.png, on the same 1400×1000 canvas and in exactly the same place (the envelope occupies exactly x 9.5–90.5% and y 10–90% of the canvas), on a fully transparent background: a flat panel of the navy linen of navy_linen.png spanning the full envelope width, from 30% of the envelope's height (34% of the canvas height) down to the envelope's bottom edge (90% of the canvas). Its top edge is perfectly straight and crisply folded with a fine turned hem (this is the edge the card rises from), its side edges neatly folded, its bottom corners square. Soft morning light from the top-left, a faint shade just under the top hem on the linen itself. Everything above the pocket's top edge is completely transparent. No flap, no embossing, no seal, no ribbon, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep zarfın %30'undan (tuval %34) alta, tam zarf eninde; üst kenar düz ve net; üstü tamamen şeffaf; gerçek alfa.
Kullanım: tema kurulunca tuval cep kutusuna kırpılır → `.env-front`; kart bunun arkasından yükselir.

#### W5 Düz kapak + kör kabartma boş defne kartuşu (kapalı, dış yüz)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/flap.png` · 1400×1000 · **Şeffaf zemin**

```
Only the closed straight flap of the same navy linen wallet envelope, on the same 1400×1000 canvas and in exactly the same place (the envelope occupies exactly x 9.5–90.5% and y 10–90% of the canvas), on a fully transparent background: a flat rectangle of the navy linen of navy_linen.png spanning the full envelope width, from the envelope's top edge (10% of the canvas) down to 56% of the envelope's height (54.8% of the canvas), with a soft rounded fold along its top edge and a STRAIGHT bottom edge (not a V, not a point, not scalloped) finished with a crisp turned hem. Blind-embossed into the centre of the flap — no ink, no foil, the same navy linen, readable only because the low raking morning light from the top-left catches the raised relief — an EMPTY laurel cartouche: a horizontal oval wreath of two laurel branches whose stems cross at the bottom and whose tips nearly meet at the top, framing a smooth, raised, plain oval with nothing inside; the cartouche is about 340 px wide and 200 px tall, centred at x 50% and y 35.6% of the canvas (32% of the envelope's height). Everything below the flap's bottom edge is completely transparent. No seal, no ribbon, no card, no gold, nothing inside the cartouche. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kapak üstten zarfın %56'sına, alt kenar düz; ortada mürekkepsiz kabartma defne kartuşu, içi tamamen boş; mühür/kurdele yok; gerçek alfa.
Kullanım: tema kurulunca kapak kutusuna kırpılır → `.flap`; açılışta önce kabartmanın üstünden altın ışık süpürür, sonra kapak 3B açılır.

#### W6 Kapağın iç yüzü (açıkken dik)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/flap_in.png` · 1400×700 · **Şeffaf zemin**

```
The inside of the same straight flap as flap.png, alone, seen straight on as it stands upright when the wallet envelope is open, on a fully transparent background: exactly the same size as the flap in flap.png, occupying x 9.5–90.5% and y 18–82% of this canvas. Its BOTTOM edge is the straight fold line (the hinge) and its free straight edge is at the TOP. It is lined with the same ivory pinstripe paper as env_back.png (ivory #F5F0E3 with fine vertical navy pinstripes #28385C), with a slim rim of navy linen along its edges. No embossing on this side, no seal, no ribbon. Soft morning light from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz dikdörtgen, alt kenar menteşe çizgisi; iç yüz çizgili fildişi astar; kabartma/mühür yok; gerçek alfa.
Kullanım: tema kurulunca kapak 3B açılıp dik durduğunda görünen iç yüz (`.flap-in`), zarfın üst kenarına oturur.

#### W7 Kalkan biçimli fildişi mum mühür (ortası boş)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/seal.png` · 600×700 · **Şeffaf zemin**

```
A single shield-shaped ivory sealing-wax seal, seen straight from the front, on a fully transparent background, centred and filling about 80% of the canvas height: warm ivory wax (#F5F0E3) with a soft parchment tone (#E8E0CC) in the deeper wax, in a classic heater-shield outline (a flat top, gently curved sides meeting in a soft point at the bottom); its rim is pressed with a fine raised border of small laurel leaves running all the way around, and its centre is a smooth, flat, completely EMPTY field (the couple's initials are added later as website text). A slightly irregular, softly melted wax edge spills just beyond the shield outline; a gentle satin sheen. Soft morning light from the top-left at a low raking angle so the laurel relief reads clearly. No initials, no heraldic charges (no lions, eagles, crowns, crosses, stripes, bars or anchors), no coat of arms, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek kalkan biçimli fildişi mum mühür; kenarda kabartma defne; ortası düz ve BOŞ (harf/figür yok); gerçek alfa.
Kullanım: tema kurulunca kapağın alt kenarının ortasına (zarfın %50, %56'sı; eni zarf eninin %13'ü) konur, baş harfler
ortasına HTML olarak yazılır; açılışta kurdele diliyle kalkıp yana döner; RSVP gönderilince yeniden "basılır".

#### W8 Lacivert grogren kurdele dili (aynı tuvalde)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/ribbon_tab.png` · 1400×1000 · **Şeffaf zemin**

```
Only a short navy grosgrain ribbon tab, on the same 1400×1000 canvas and in exactly the same place as env_back.png (the envelope occupies exactly x 9.5–90.5% and y 10–90% of the canvas — but the envelope itself is NOT drawn), on a fully transparent background: one straight vertical piece of navy grosgrain ribbon (#1C2A48) with fine horizontal ribs and a soft sheen, about 80 px wide, centred at x 50% of the canvas, its top end cut straight at 50% of the canvas height (it will be hidden under the seal) and hanging down to 70% of the canvas height (75% of the envelope's height), its bottom end cut in a neat inverted-V swallowtail notch. Soft morning light from the top-left. Nothing else: no envelope, no linen, no seal (a separate seal is placed over its top end), no bow. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yalnız tek dikey kurdele (zarf çizilmemiş), x %50'de, tuvalin %50'sinden %70'ine; alt ucu V kesik; gerçek alfa.
Kullanım: tema kurulunca mührün altından sarkan dil (`.tab`); açılışta mühürle birlikte kalkıp yana döner.

#### W9 Altın gravür arma (defne çelengi + BOŞ kalkan)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/crest.png` · 1000×1000 · **Şeffaf zemin**

```
A gold engraved crest ornament, seen straight on, on a fully transparent background, centred and filling about 80% of the canvas: a symmetrical laurel wreath of two slender branches whose stems cross at the bottom centre, each branch curving up around an EMPTY heater-shaped shield (a flat top, gently curved sides meeting in a soft point) outlined with a fine double gold rule; above the shield, at the top centre where the branch tips nearly meet, a small tied ribbon bow. Everything is drawn as crisp, fine engraved lines in warm gold (#B8964F, with lighter #DCC489 where the morning light from the top-left catches the lines) — fine hatching on the leaves, delicate veins, no filled colour areas, no background. The inside of the shield is completely empty and transparent (the couple's initials are added later as website text): no initials, no heraldic charges (no lions, eagles, crowns, helmets, crosses, stripes, bars or anchors), no motto ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: ince altın çizgi gravür; defne çelengi + üstte küçük fiyonk; kalkanın içi tamamen boş ve şeffaf; figür/taç/harf yok; gerçek alfa.
Kullanım: tema kurulunca home kartının ve RSVP formunun üstünde; açılışta aşağıdan yukarı maskeyle "kazınarak" belirir,
kalkanın içine baş harfler (Mr De Haviland, HTML) yazılır.

#### W10 Zarftaki kart (boş, kör kabartma bordür)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat vertical invitation card of the same ivory cotton paper as ivory_cotton.png (#F5F0E3), seen straight on, on a fully transparent background, the card centred and occupying x 8–92% and y 7–93% of the canvas (about 0.7:1), with a fine soft deckle edge all around. A slim blind-embossed border — a raised double rule with a tiny laurel leaf at each corner, the same ivory, no ink, readable only through the low raking morning light from the top-left — is inset about 5% from the edge. The whole inner area is EMPTY plain paper (the website sets the crest initials, the names, the date and the venue there). Only a faint contact shade on the card itself along the deckle. No gold, no seal, no printing, no photo window. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek fildişi kart, ince tırtıklı kenar; kabartma bordür mürekkepsiz; iç alan tamamen boş; gerçek alfa.
Kullanım: tema kurulunca zarftan yükselen kart (`.card`; arma W9 bunun üstüne konur) ve home'daki bilgi kartları.

#### W11 Köşesi kesik kabartma paspartu (dikey foto penceresi)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/cartouche_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A vertical ivory mat (passe-partout) with notched corners, seen perfectly straight on, on a fully transparent background, the mat occupying x 6–94% and y 6–94% of the canvas: thick smooth ivory cotton board (#F5F0E3) whose four outer corners are each notched inward by a small concave quarter-circle cut of about 70 px radius; a very fine gold rule (#B8964F) follows the outer edge, notches included; around the window runs a blind-embossed laurel border (a continuous chain of small raised laurel leaves, the same ivory, no ink, readable only through the low raking morning light from the top-left) and a slim bevelled inner edge lined with a fine gold line. In the middle a photo window exactly 720 px wide and 900 px tall (4:5), its top-left corner at x 140 px, y 175 px (its centre at x 500 px, y 625 px), filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it); the window's four corners are notched inward in the same way, each by a concave quarter-circle of 60 px radius (the ivory mat fills those small notches), so its outline is four straight sides joined by four small inward arcs. No crest, no initials on the mat. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz yeşil `#00FF00`, 720×900 (4:5), sol üst (140, 175), dört köşesi ≈60 px içe yay; paspartunun dış köşeleri de içe kesik; kabartma defne + ince altın çizgi; gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür ve şeffaf yapılır (köşe kesikleri maskeye girer); home portresi ve Story'nin
üç anı bu paspartuda: fotoğraf önce kabartma rölyef gibi beyaz belirir, sonra ton akar.

#### W12 Geniş köşesi kesik paspartu (mekân fotoğrafı)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/cartouche_wide.png` · 1600×1000 · **Şeffaf zemin**

```
A wide landscape ivory mat (passe-partout) with notched corners, the same as cartouche_frame.png, seen perfectly straight on, on a fully transparent background, the mat occupying x 6–94% and y 6–94% of the canvas: thick smooth ivory cotton board (#F5F0E3) whose four outer corners are each notched inward by a small concave quarter-circle cut of about 70 px radius; a very fine gold rule (#B8964F) follows the outer edge, notches included; around the window runs the same blind-embossed laurel border (small raised laurel leaves, the same ivory, no ink, readable only through the low raking morning light from the top-left) and a slim bevelled inner edge lined with a fine gold line. In the middle a landscape photo window exactly 1280 px wide and 720 px tall (16:9), its top-left corner at x 160 px, y 140 px (its centre at x 800 px, y 500 px), filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it); the window's four corners are notched inward in the same way, each by a concave quarter-circle of 60 px radius (the ivory mat fills those small notches), so its outline is four straight sides joined by four small inward arcs. No crest, no initials on the mat. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz yeşil `#00FF00`, 1280×720 (16:9), sol üst (160, 140), köşeleri ≈60 px içe yay; W11 ile aynı paspartu dili; gerçek alfa.
Kullanım: tema kurulunca details'te mekân fotoğrafının paspartusu (kabartmadan tona geçiş).

#### W13 Manolya + defne (köşe süsü)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/magnolia.png` · 1200×1000 · **Şeffaf zemin**

```
A corner cluster reaching diagonally from the top-left corner area toward the centre, photorealistic, on a fully transparent background: one large open white magnolia blossom with thick, creamy, waxy petals and a soft golden centre, one half-open bud, several glossy magnolia leaves in deep olive laurel tones (#6F7A5A) with soft bronze-brown undersides, a sprig of slender bay laurel leaves, and the end of a navy grosgrain ribbon (#1C2A48) curling among them. The cluster sits near the top-left and leaves the bottom-right third of the canvas empty. Soft morning light from the top-left. No vase, no other flowers, no crest. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: küme sol üst bölgede, sağ alt üçte bir boş; beyaz manolya + defne + lacivert kurdele ucu; vazo yok; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşelerinde (sağda aynalanır), index'te zarfın yanında küçük, imzada.

#### W14 Altın gravür defne ayırıcı
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/laurel_divider.png` · 1600×240 · **Şeffaf zemin**

```
A slim symmetrical horizontal divider engraved in fine gold line (#B8964F, lighter #DCC489 where the morning light from the top-left catches it), on a fully transparent background: two slender laurel branches growing out to the left and to the right from a tiny gold dot at the centre, each with pairs of small engraved leaves tapering toward the tip, drawn with the same crisp fine engraved lines and hatching as crest.png, no filled colour areas; the divider spans from about 10% to 90% of the canvas width and from about 20% to 80% of its height. No ribbon, no shield, no straight rule. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay, simetrik iki defne dalı, ortada küçük nokta; ince altın çizgi; uçlar kenara değmiyor; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında ve bölümler arasında ayırıcı (home davet, details program, RSVP formu).

#### W15 Lacivert grogren fiyonk
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/bow.png` · 700×500 · **Şeffaf zemin**

```
A single navy grosgrain ribbon bow (#1C2A48), photorealistic, seen straight from the front, on a fully transparent background: two crisp, evenly sized loops, a neat wrapped centre knot, two short tails falling down and slightly outward with swallowtail-cut ends, fine horizontal grosgrain ribs and a soft sheen on the tops of the loops in soft morning light from the top-left. Centred, filling about 80% of the canvas width. No pin, no pearl, no crest. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek lacivert grogren fiyonk, iki ilmek + V kesik kuyruklar; iğne/inci yok; gerçek alfa.
Kullanım: tema kurulunca home imzasının üstünde ve story/details kart başlıklarında küçük süs.

#### W16 Süzülen küçük süsler — üç ayrı dosya
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred on a fully transparent background, filling about 55% of the square, not cropped. Soft morning light from the top-left. No other object. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three separate files, one object each, same size: 1 = a single photorealistic white magnolia petal, thick and creamy with a faint warm blush at its base; 2 = a single photorealistic glossy bay laurel leaf in olive laurel (#6F7A5A); 3 = a single small laurel leaf engraved in fine gold line (#B8964F) exactly like the leaves of crest.png, no fill.)
```
Kontrol: her dosyada tek nesne (1 manolya yaprağı, 2 defne yaprağı, 3 altın gravür yaprak); ortalı, kesilmemiş; gerçek alfa.
Kullanım: tema kurulunca kaydırmada süzülen küçük süsler; RSVP kapanışında mühür basılırken düşen yapraklar.

#### W17 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft morning light from the top-left at a low raking angle: the closed landscape navy linen wallet envelope of env_back.png, env_front.png and flap.png — its straight flap with the blind-embossed EMPTY laurel cartouche, the ivory shield-shaped wax seal of seal.png (its centre smooth and EMPTY) on the flap's bottom edge and the short navy grosgrain tab of ribbon_tab.png below it — lying slightly below the centre of the frame on a crisp ivory linen tablecloth; at the left a white magnolia blossom with bay laurel (as magnolia.png); at the right a small ivory card with the gold engraved laurel crest of crest.png (its shield EMPTY) and a curl of navy grosgrain ribbon; behind, softly out of focus, bright morning sea light through a tall window. The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope with its seal and tab visible with at least 5% empty margin below it. No people, nothing inside the seal or the shield, no heraldic charges. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf (kartuş + mühür + dil) bütün ve altında boşluk; mühür ve kalkan boş; üst %20 sakin; yazı/arma figürü yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım) ve satış sayfası kapağı.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Caroline & Frederick; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography in colour, classic and airy, a navy, ivory and soft sea-blue palette
with warm natural skin tones, bright soft seaside light, subtle film grain; ONE fictional couple in their early thirties,
the same two people in every photo (they must not resemble any real person or celebrity): Caroline — shoulder-length
dark-blonde hair in soft waves, fair skin, a slim gold necklace (no pearls); Frederick — short brown hair, clean-shaven,
olive-medium skin, a navy suit. Classic, elegant clothing; no crests, no logos, no boat names. Story photos are cropped
to 4:5 in a notched mat: keep faces and hands in the middle 70%. No text, no frame, no watermark, no readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Hero ve Story fotoğrafları sitede **4:5** kırpılır (köşesi kesik paspartu).

#### 2.1 Ana portre
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Caroline and Frederick, in their early thirties (Caroline: shoulder-length dark-blonde hair in soft waves, fair skin, a slim gold necklace; Frederick: short brown hair, clean-shaven, olive-medium skin; they must not resemble any real person or celebrity), on the lawn of an old seaside manor: she in an ivory silk-crepe gown with a soft bateau neckline, he in a navy suit with an ivory pocket square and a small white flower boutonnière, standing close, her hand on his arm, both smiling, waist-up, faces in the upper middle of the frame. Behind them, softly out of focus, a manicured lawn, old trees and the calm blue water of a bay with one distant white sail; soft light from the top-left. Photorealistic, navy-ivory palette, subtle film grain. No frame. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: iki kişi, bel üstü, yüzler orta-üstte; arkada çimen ve körfez; inci yok; gerçek kişiye benzemiyor; yazı yok.
Kullanım: tema kurulunca home kartındaki köşesi kesik paspartu portresi (4:5) ve demo sitenin ana fotoğrafı.

#### 2.2 Story 1 — "Sailing season"
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) on the teak deck of a classic wooden sailboat on a bright summer day, she laughing with the wind in her hair and a navy knit sweater over her shoulders, he in a white shirt with rolled sleeves holding a line, the white sails and the blue water of the bay behind them. The sails and hull carry no letters, numbers, names or logos. Photorealistic, same palette and grain. No readable signs. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yelkenli güvertesinde iki kişi, yüzler orta %70'te; yelkende/teknede yazı, numara, logo yok.
Kullanım: tema kurulunca Story 1 (sol), köşesi kesik paspartuda.

#### 2.3 Story 2 — "Summers at the estate"
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) riding two vintage bicycles side by side across the lawn of an old seaside estate in summer, laughing toward each other, she in a light ivory summer dress with a small basket of white flowers on her handlebars, he in light trousers and a navy polo shirt, tall old trees and a white-columned house softly out of focus behind. The bicycles carry no logos or lettering. Photorealistic, same palette and grain. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: çimende bisiklet, iki yüz görünür; bisikletlerde logo/yazı yok; aynı çift.
Kullanım: tema kurulunca Story 2 (sağ), köşesi kesik paspartuda.

#### 2.4 Story 3 — "A ring by the water"
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, on the sun-bleached planks of an old wooden dock, a loose length of navy grosgrain ribbon beside them, the calm bay softly out of focus with gentle light on the water, shallow depth of field. Natural, well-formed hands and fingers. Photorealistic, same palette and grain. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: eller ve yüzük net, parmaklar doğal; iskele tahtası + su; yazı yok.
Kullanım: tema kurulunca Story 3 (sol), köşesi kesik paspartuda.

#### 2.5 Mekân
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: the lawn of an old white-columned manor beside a calm bay, prepared for a wedding ceremony on a bright late afternoon, an original place that does not resemble any real building or venue: rows of white ceremony chairs with navy grosgrain ribbon bows on the aisle chairs, tall arrangements of white magnolia and bay laurel at the front, a simple ivory-draped arch facing the water, the manor's white columns softly behind, the blue bay and a distant sail. No people, no signs, no flags, no religious objects. Photorealistic, navy-ivory palette, subtle film grain. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: insansız; beyaz sütunlu malikâne, sandalyeler + lacivert kurdeleler, körfez; tabela/bayrak/dini obje yok.
Kullanım: tema kurulunca details'te geniş köşesi kesik paspartuda mekân fotoğrafı.

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın `'navy-ivory-crest'` bloğu **henüz
> yok** — tema kurulunca eklenecek; o zamana kadar bu iki dosya yalnız kaynak olarak bekler.
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden süsleme yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân; baş harfler
> armanın kalkanına metin olarak); arka yüzde %13'ün altı, genişlikte %9–%91 **tamamen boş** (program + QR; QR'ı GPT
> çizmez, `tools/make_qr.py` gerçek URL'den üretir). Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (tema kurulunca, elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts`'e `'navy-ivory-crest'` bloğu: `sources` → `{ front: 'print/invitation_front_5x7.png', back:
>    'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Metin kutularını görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`); ön yüzde armanın
>    kalkanına baş harf kutusu eklenir.
> 3. `cd platform && node scripts/build-print-assets.ts --theme navy-ivory-crest` ve `node scripts/print-sample.ts --theme
>    navy-ivory-crest --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the smooth ivory cotton paper of ivory_cotton.png. At the top centre, a small gold engraved laurel crest exactly like crest.png — the laurel wreath, an EMPTY shield and a small bow on top, in fine gold lines — staying between 38% and 62% of the width and above 17% of the height. Along the bottom, a slim gold engraved laurel divider like laurel_divider.png, centred, between 30% and 70% of the width and between 93% and 97% of the height. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no leaf, no line, no border, no shadow, no stain in it. Nothing decorative within 8% of the left and right edges and no border around the sheet. The shield inside the crest stays empty: no initials, no heraldic charges. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; arma yalnız üst ortada (%17'nin üstünde), kalkanı boş; defne ayırıcı yalnız altta; yanların %8'i boş; yazı yok.
Kullanım: tema kurulunca `layouts.ts` ön yüz zemini (`cover('front')`); isimler, tarih, mekân ve kalkandaki baş harfler metin olarak basılır.

#### P2 — Arka yüz
**Kaydet:** `collections/48_Navy_Ivory_Crest/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same smooth ivory cotton paper, with only a small symmetrical pair of gold engraved laurel sprigs (like the leaves of crest.png, fine gold lines) at the top centre, staying between 40% and 60% of the width and above 11% of the height. Everything below 13% of the height is COMPLETELY EMPTY paper across the full width, and certainly between 9% and 91% of the width (a schedule and a QR code are set there; do not draw any code): no leaf, no line, no border, no shadow, no stain. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada küçük altın defne (%11'in üstünde); %13'ün altı tamamen boş; QR/yazı yok.
Kullanım: tema kurulunca `layouts.ts` arka yüz zemini (`cover('back')`); program ve gerçek QR (`tools/make_qr.py`) üstüne konur.

---

PAKET 3/7 (Etsy ilan sahneleri) bu dosyada yok: tema `platform/themes/navy-ivory-crest/` kurulunca `tools/paket7_ilan.py` ile üretilecek.
