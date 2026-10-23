# GPT görsel istekleri — Tasarım 22 · Nocturne Lake Estate (yeniden tasarım, 2026-10-22)

> **Instructions for GPT:** This design is being REDESIGNED from scratch. Generate PAKET 5R (website layers) first, in
> order and in ONE chat, then PAKET 6R (printable invitation). PAKET 2 (sample photos) ALREADY EXISTS — do not regenerate
> it. Sections marked GEÇERSİZ are not wanted. Use each English prompt exactly as written, follow its checklist, and save
> each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> initials, monograms, crests, logos, QR codes or watermarks in any image** (also not on the brooch, the vellum band, the
> card or the frames). No real place, villa, lake, brand, artist or other seller's design may be recognisable — the lake,
> mountains and villa are invented. Give W1 `night_laid.png`, W2 `ivory_laid.png` and W3 `env_back.png` as the style
> reference of every later part: the same charcoal-black laid paper, the same warm ivory laid card, the same champagne
> gold foil, the same oil-painted night lake, and the same light — soft cool MOONLIGHT from the top-left with a faint warm
> CANDLE glow from the lower right. Parts drawn on the same envelope canvas (W3, W4, W5, W7) keep the envelope in exactly
> the same box.

Bu dosya tasarım 22'nin **bütün görsel parçalarının** tek kaynağıdır (`docs/35_22_32_YENIDEN_TASARIM.md`, satır 22;
görev G222). Önceki PAKET 5/6 bölümleri ve Codex taslak görselleri (`envelope.png`, `hero.png`, `couple.png`) bu sürümde
kullanılmaz (git geçmişinde). Tema yeniden kurulunca (G422, `docs/34` 39 pilot yapısı) her parçanın nasıl kullanılacağı
aşağıdaki "Kullanım" satırlarındadır; gelmeyen parçanın yerine çizilmiş yedek konmaz (K21). Kişisel alanlar (isimler,
tarih, baş harfler, mekân) HTML'dir, hiçbir görsele pişirilmez. QR'ı GPT çizmez (`tools/make_qr.py`).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/22_Nocturne_Lake_Estate/assets/gpt/` altındaki `parts/`
  (PAKET 5R) ve `print/` (PAKET 6R). `photos/` (PAKET 2) zaten dolu. Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Sonra (Claude, G422): `python3 tools/kit_check.py collections/22_Nocturne_Lake_Estate --paket 5` (oran, gerçek alfa,
  kenar payı, foto penceresi) + göz kontrolü. Tema kurulunca `python3 platform/themes/nocturne-lake-estate/build_images.py`
  ve `python3 tools/gpt_kuru_deneme.py --tema nocturne-lake-estate --sekil
  collections/22_Nocturne_Lake_Estate/assets/gpt/kuru_sekil.json` (prova). PAKET 6R için aşağıdaki "Gelince" adımı.

## Stil ve renk
- Teknik: **photorealistic luxury stationery product photography + oil-painted nocturne** — real charcoal-black laid
  paper with fine chain lines, real deckled champagne-gold foil, real frosted vellum with silver engraving, real hammered
  gold, real lacquered wood and wrought iron; the lake scenes are rich, quiet oil paintings with soft brushwork. A villa
  terrace by a mountain lake near midnight: black-tie, candlelit, deep and romantic. Not gothic, not Halloween, not neon,
  not a night-club look, not flat vector, not clip-art.
- Renkler (yalnız bunlar): night `#11120F` · charcoal `#1C1D15` · champagne `#E0C7A4` · gold `#C7A978` · ivory `#F1E4CC`;
  vellum gravürü için silver `#BFC3C6`. Yağlı boya sahnelerde gece mavisi-kömür gök ve su (`#11120F`–`#2A2E33` arası),
  sıcak pencere/mum ışıkları şampanya-altın. Çiçekler yalnız beyaz-fildişi bahçe gülü ve gümüşi zeytin yaprağı.
- Işık: **ay ışığı sol üstten** (yumuşak, serin) + **çok hafif ılık mum ışığı sağ alttan**; bütün parçalarda aynı.
  Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil), nesne her kenarda en az %6 içeride, nesnenin dışında
  düşen gölge ya da hâle yok (gölgeyi site ekler).
- Foto penceresi (`#00FF00`) yalnız W10 `window_frame`, W11 `story_frame` ve W13 `terrace_frame`'de; diğer parçalarda
  yeşil alan yok.
- **19 Midnight Garden'dan ayrı:** çiçek bahçesi yok; **29'dan ayrı:** yıldız haritası/usturlap yok; **42'den ayrı:**
  dantel bant ve kuru çiçek yok; **01–21'den ayrı:** mum mühür yok, kapak V değil.

## Zarf geometrisi (W3, W4, W5, W7 aynı tuvalde; W6 ve W8 ayrı tuvalde)
Tuval **1080×1500** (dikey). Zarf kutusu **x %7–93, y %7–93** (zarf 929×1290 px ≈ 0,72:1). Dört katman **aynı tuvalde,
aynı kutuda** çizilir: W3 arka (astar), W4 ön cep, W5 kapak, W7 vellum bant; Claude her birini kendi alfa kutusuna kırpar
ve W3'ün kutusuna göre yerleştirir. Tuval yüzdeleri:
- **ön cep (W4):** tam genişlik, üst kenarı yan kanatların oluşturduğu sığ bir V: yan kenarlarda **y %20**'den başlar,
  ortada **y %53**'e iner; zarfın alt kenarına (**y %93**) kadar → kutu x %7–93, y %20–93.
- **elmas kapak (W5):** menteşe zarfın üst kenarında (**y %7**); iki yanı **dik** iner, **y %19**'a kadar; sonra iki
  hafif **içbükey** kenar (düz çizgiden en çok tuval yüksekliğinin %3'ü kadar içe doğru) ortada **(%50, %68)**'de keskin
  sivri uçta birleşir. Kenar boyunca ~%1,2 genişliğinde şampanya altın deckle folyo şerit → kutu x %7–93, y %7–68. Kapak
  her yerde cebin V kenarının **altına** iner (kapalıyken astar görünmez).
- **vellum bant (W7):** yatay, **y %57–75**; zarfın iki yan kenarından ~%1 taşar ve arkaya kıvrılır → kutu x %6–94,
  y %57–75. Kapağın sivri ucu (%68) bandın altında kalır.
- **hilal broş (W8, ayrı 600×600 tuval):** zarf üstünde merkezi **(%50, %66)**, genişliği tuval eninin **%22**'si
  (zarf eninin ~%26'sı); bandın ortasına iğneli.
- **kapağın iç yüzü (W6, ayrı 1080×1100 tuval):** W5'in dikey aynası: düz katlama kenarı **altta y %93**, x %7–93;
  dik yanlar **y %78**'e çıkar, içbükey kenarlar **y %10**'da tepe noktasında birleşir → kutu x %7–93, y %10–93.
- Kat sırası (alttan üste): W3 arka → kart (W9) → W4 cep → W5 kapak → W7 vellum bant → W8 broş.

Açılış: hilal broşta ay ışığı parlar → broş bandın üstünden kalkar, yavaşça yukarı süzülüp ekranın üstünde "ay" olarak
durur (home'da da) → vellum bant aşağı kayarak zarftan çıkar ve söner → elmas kapak menteşesinde 3B açılır: iç yüzü (W6)
yağlı boya **gece göğü ve dağ silueti**, zarfın astarı (W3) **göl, villa ışıkları ve ay yolu** — kapak açıkken ikisi tek bir
tablo gibi birleşir (dağların ayağı kapağın katlama kenarında, gölün kıyısı astarın üst kenarında) → fildişi kart (W9)
cebin arkasından yükselir, cep dudağını geçince öne gelir → astardaki ay yolunda ışık kıpırdar (CSS maske) → altın pul,
mum kıvılcımı ve beyaz gül yaprağı (W18) süzülür → home.

---

## PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)

#### W1 Gece laid kâğıdı (sayfa zemini, kapak sayfası)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/night_laid.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of heavy charcoal-black laid paper (#1C1D15, the deepest tones toward #11120F): fine parallel laid lines running horizontally with faint chain lines crossing them vertically every few centimetres, a soft felted tooth, and a very sparse scatter of tiny champagne-gold foil flecks (#C7A978) — only a few flecks per square, irregular, flat and small, catching the light softly. Evenly lit by soft cool moonlight from the top-left; very low contrast, calm and deep, so champagne and ivory text reads on it everywhere. No fold, no crease, no stain, no vignette, no pattern other than the laid lines, no shadow, no deckle edge. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: kömür-siyah, çok sakin; laid çizgileri ince; altın pullar seyrek ve küçük; dikişsiz (2×2 ek yeri yok); açık renk yazı her yerde okunur.
Kullanım: tema kurulunca bütün sayfaların zemini ve açılış (kapalı zarf) sayfası; paletlerde tonu `variants.css` ile kaydırılır.

#### W2 Fildişi laid kart (kartlar, bantlar, form)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/ivory_laid.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of thick warm ivory laid card stock (#F1E4CC, the gentlest variation toward #E8D9BC): very fine horizontal laid lines and faint vertical chain lines, a soft felted cotton tooth, matte, calm enough for charcoal text to read on it everywhere. Evenly lit by soft cool moonlight from the top-left with the faintest warm tint; no fold, no crease, no stain, no gold flecks, no printing, no pattern, no shadow, no vignette, no deckle edge. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: sakin sıcak fildişi; laid çizgileri çok ince; dikişsiz; leke/baskı yok; koyu yazı okunur.
Kullanım: tema kurulunca home kartı, davet bandı, details program kartı, RSVP formu ve zarftan yükselen kartın dokusu.

#### W3 Zarfın arkası — göl astarı
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/env_back.png` · 1080×1500 · **Şeffaf zemin**

```
The back panel of an open portrait envelope made of the charcoal-black laid paper of night_laid.png, seen perfectly straight from the front, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the 1080×1500 canvas (a 0.72:1 rectangle with crisp, very slightly softened corners). We see its inside: it is lined with an oil-painted nocturne of an invented mountain lake near midnight, covering the panel almost completely with a slim margin (about 2% of the canvas) of charcoal laid paper along the top and both sides. The painting: the calm dark lake fills the panel; across its top edge runs the far shore — a low line of dark hills with a small invented villa whose few windows glow warm champagne-gold, a row of slender cypresses and a stone terrace with tiny candle lights reflected as soft gold streaks in the water; down the vertical centre of the lake runs a shimmering path of pale moonlight in broken, soft horizontal brushstrokes; the rest of the water is deep charcoal-blue (#11120F to #2A2E33) with gentle ripples. Rich, quiet, soft brushwork, like a fine small oil painting printed on the liner paper; a very gentle shade toward the bottom where the front pocket will sit. No sky (the sky is on the flap), no moon disc, no flap, no front pocket, no band, no brooch, no card. Soft cool moonlight from the top-left. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: panel x %7–93 · y %7–93; iç yüz yağlı boya göl (karşı kıyı + villa ışıkları + ortadan inen ay yolu); kenarlarda ince kömür laid pay; gök/ay diski yok; gerçek alfa.
Kullanım: tema kurulunca `.env-back` — kapak açılınca kartın arkasında görünen göl; ay yolunun üstünde CSS maske süpürmesiyle ışık kıpırtısı.

#### W4 Zarfın ön cebi
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/env_front.png` · 1080×1500 · **Şeffaf zemin**

```
Only the front pocket of the same portrait charcoal-black laid paper envelope as env_back.png, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the pocket spans the full envelope width (x 7–93%) and reaches down to the envelope's bottom edge at 93% of the canvas height. Its top edge is the shallow V formed by the two side flaps: it starts at 20% of the canvas height at both side edges and runs in two straight, crisply cut lines down to a soft point at the horizontal centre at 53% of the canvas height; the faint thickness of heavy paper visible along the cut, the gentle fold lines of the side flaps and the bottom flap barely visible on the charcoal laid paper of night_laid.png with its sparse tiny gold flecks. Everything above the pocket's edge is completely transparent. No flap, no band, no brooch, no card, no foil on the pocket. Soft cool moonlight from the top-left. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: cep tam genişlik; üst kenar yanlarda %20, ortada %53'e inen sığ V; üstü tamamen şeffaf; folyo yok; gerçek alfa.
Kullanım: tema kurulunca `.env-front` — kart bunun arkasından yükselir; kapak açıkken V kenarı astarın gölünü çerçeveler.

#### W5 Elmas kapak (kapalı, dış yüz)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/flap.png` · 1080×1500 · **Şeffaf zemin**

```
Only the closed flap of the same portrait charcoal-black laid paper envelope, on the same 1080×1500 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 7–93% of the canvas; the flap spans its full width (x 7–93%), hinged along a softly rounded fold at the envelope's top edge (7% of the canvas height). Its shape is a deep, elegant elongated diamond: its two sides drop straight down along the envelope's side edges to 19% of the canvas height, then two long edges, each very gently concave (curving inward by no more than 3% of the canvas height), run down and meet in ONE sharp point at the horizontal centre at 68% of the canvas height. All along the two long edges and the point runs a narrow border of real champagne-gold foil (#C7A978 with soft bright highlights toward #E0C7A4), about 1.2% of the canvas wide, with a delicate deckled, torn-paper outer edge. The flap is the charcoal laid paper of night_laid.png with its laid lines and sparse tiny gold flecks, a whisper of contact shade on the flap itself just along its edges. Everything outside the flap is completely transparent. No band, no brooch, no seal, no card. Soft cool moonlight from the top-left, a faint warm reflection on the foil from the lower right. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: kapak tam genişlik; yanlar %19'a dik, sonra hafif içbükey iki kenar (%50, %68)'de keskin uçta; kenarda ince deckle altın folyo; mühür/broş yok; gerçek alfa.
Kullanım: tema kurulunca kapalı kapak; açılışta üst katlama çizgisinde 3B kalkar, arka yüzü W6.

#### W6 Kapağın iç yüzü — gece göğü (açıkken dik)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/flap_in.png` · 1080×1100 · **Şeffaf zemin**

```
The inside of the same elongated-diamond envelope flap, alone, seen straight on as it stands upright when the envelope is open, on a fully transparent background: the outline of flap.png mirrored vertically. Its straight fold edge is at the BOTTOM, along 93% of the image height, spanning x 7–93% of the width (exactly as wide as the envelope); its two straight sides rise to 78% of the image height, and its two very gently concave long edges rise and meet in one sharp point at the horizontal centre at 10% of the image height. The inside is lined with the upper half of the same oil-painted nocturne as env_back.png: a deep night sky (#11120F to #2A2E33) with a few faint stars and soft drifting clouds lit silver at their edges by a hidden moon glowing softly behind the clouds near the top (no moon disc visible), and along the bottom of the flap, sitting right on the fold edge, the dark layered silhouettes of invented mountains whose lowest slopes meet the fold line — so that, with the envelope open, the mountains continue straight into the lake painted inside the envelope. A slim margin of charcoal laid paper and the same narrow deckled champagne-gold foil border follow the two long edges and the point. Rich, quiet oil brushwork. No villa, no lake, no moon disc, no seal. Soft cool moonlight from the top-left. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: katlama kenarı altta (%93), dik yanlar %78'e, uç ortada %10'da; iç yüz yağlı boya gece göğü + altta dağ silueti (katlama kenarına oturur); ay diski yok; kenarda altın folyo; gerçek alfa.
Kullanım: tema kurulunca kapak açıldığında zarfın üstünde dik duran iç yüz (3B dönüşün arka yüzü); dağlar astarın gölüne devam eder.

#### W7 Vellum bel bandı — gümüş gravür göl panoraması
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/vellum_band.png` · 1080×1500 · **Şeffaf zemin**

```
On the same 1080×1500 canvas as env_back.png and flap.png, in exactly the same place (the envelope box is x 7–93% and y 7–93% of the canvas, but the envelope itself is NOT drawn here), only a horizontal belly band of frosted translucent vellum that wraps around the closed envelope, on a fully transparent background: the band runs straight across from x 6% to x 94% of the canvas and from y 57% to y 75%; at both ends it turns over the envelope's side edges in a soft rounded fold, as if continuing behind it. The vellum is milky and semi-transparent (real partial alpha, about 40–50% opaque, so whatever lies beneath shows through softly), with a faint frosted texture and a crisp clean cut along its top and bottom edges. Across the whole band runs a delicate continuous engraving in fine metallic silver lines (#BFC3C6) and fine hatching: an invented lakeshore panorama — layered mountains, a small villa with a balustrade terrace in the centre, slender cypresses, a few boats, and gentle ripple lines on the water; the centre of the band, where a brooch will be pinned, stays a little calmer. Soft cool moonlight from the top-left giving the silver lines a faint glint. Everything outside the band is fully transparent: no envelope, no flap, no brooch, no pin. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek yatay bant (x %6–94 / y %57–75), iki uç arkaya kıvrık; vellum yarı saydam (gerçek kısmi alfa); gümüş gravür panorama, ortası sakin; zarf/broş çizilmemiş. Vellum opak gelirse kabul, saydamlığı site verir (CSS opaklık) — not et.
Kullanım: tema kurulunca aynı zarf tuvalinde tam tuval katman; açılışta broş kalktıktan sonra aşağı kayarak zarftan çıkar ve söner.

#### W8 Dövme altın hilal broş
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/moon_brooch.png` · 600×600 · **Şeffaf zemin**

```
A single brooch in the shape of a slender crescent moon, seen perfectly straight from the front, on a fully transparent background, centred and filling about 78% of the canvas: hand-hammered champagne gold (#C7A978, bright soft highlights toward #E0C7A4, deeper tones toward a warm antique gold) with a fine faceted hammer texture over its whole surface, a slim raised polished rim along both curves, the crescent opening toward the upper right, and three tiny round champagne-gold beads set along its inner curve like small stars. The polished rim catches the cool moonlight from the top-left with crisp highlights and a faint warm reflection from the lower right. No face on the moon, no pin visible from the front, no gemstones of other colours, no chain, no ribbon. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek hilal broş, dövme doku, ince parlak kenar, iç kavste üç küçük boncuk; yüz/yazı/taş yok; gerçek alfa.
Kullanım: tema kurulunca zarfta (%50, %66), genişliği tuval eninin %22'si; açılışta parlayıp kalkar, ekranın üstüne süzülür ve home'un üstünde "ay" olarak kalır; imzada küçük.

#### W9 Zarftaki kart (boş)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card, alone, seen straight on, on a fully transparent background: the thick warm ivory laid card of ivory_laid.png (#F1E4CC) spanning x 7–93% and y 6–94% of the canvas, with a softly deckled edge on all four sides gilded with a fine champagne-gold edge (#C7A978), and a hair-fine champagne-gold rule inset about 6% from the card's edge. At the top centre, inside the rule, a small engraved vignette in fine gold line only (no fill): a slender crescent moon above a few gentle ripple lines, about 18% of the card's width. Below it the whole card is EMPTY paper (the website sets the names, date and venue there in HTML). Soft cool moonlight from the top-left, a hair-fine contact shade on the card's own edge only. No flowers, no photo, no other ornament. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: boş fildişi laid kart, deckle + altın kenar, ince altın iç çizgi; üst ortada küçük hilal + dalga gravürü; altı boş; gerçek alfa.
Kullanım: tema kurulunca alfa kutusuna kırpılır → zarftan yükselen kart ve home kartının zemini (isimler, tarih, mekân HTML).

#### W10 Kemerli villa penceresi (home portresi)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/window_frame.png` · 1000×1300 · **Şeffaf zemin**

```
An arched villa window frame in gilded wrought iron, alone, seen perfectly straight on, on a fully transparent background: a slender frame of black wrought iron (#11120F) finished with soft champagne-gold leaf (#C7A978) on its raised mouldings, with a round-arched top, fine scrolling ironwork in the spandrels around the arch, a small leaf finial at the top centre, and below the window a small curved wrought-iron balcony railing with gilded balusters. The whole object spans about x 6–94% and y 5–95% of the canvas. In the middle a portrait photo window whose outline is a rectangle with a full semicircular arched top: its bounding box is exactly 720 px wide and 900 px tall, its top-left corner at x 140 px, y 180 px (the semicircle has a radius of 360 px and forms the top of the window, the sides below it are straight); the window is filled with flat pure green #00FF00 (no texture, no shading, clean edges, nothing over it — no glazing bars, no glass, no reflection). The balcony railing sits entirely below the window (between y 1110 px and y 1230 px). Soft cool moonlight from the top-left with crisp gold highlights, a faint warm reflection from the lower right. No flowers, no curtains. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, kemerli üst, kutusu 720×900 (4:5), sol üst (140, 180); ferforje + altın varak; balkon pencerenin altında; pencerenin üstünde kayıt/cam yok; gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür (kemer maskesi yeşilin kendisinden) ve şeffaf yapılır → home kartındaki ana portre; imzada küçük.

#### W11 Ferforje dikdörtgen pencere (story çerçevesi)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/story_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A rectangular villa window frame, alone, seen perfectly straight on, on a fully transparent background: a deep moulded frame of black lacquered wood and wrought iron (#11120F) with soft champagne-gold leaf (#C7A978) on its inner bead and outer moulding, a small carved stone-coloured sill along the bottom, and two small gilded shutter hinges on each side of the frame's outer edge (left and right, for shutters that open outward). The frame's outer edge spans about x 6–94% and y 6–94% of the canvas. In the middle a portrait photo window exactly 760 px wide and 950 px tall (4:5), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it — no glazing bars, no glass, no reflection). Soft cool moonlight from the top-left with crisp gold highlights, a faint warm reflection from the lower right. No shutters drawn (they are separate), no curtains, no flowers. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, 760×950 (4:5), sol üst (120, 150); siyah lake + altın varak, iki yanda menteşe; panjur/cam yok; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → story'deki üç an (sol–sağ–sol) ve home'daki hikâye tanıtımı; önünde W12 panjurlar.

#### W12 Kömür lake panjurlar — iki ayrı dosya (story çerçevesinin önünde, kapalı)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/shutter_left.png` ve `shutter_right.png` · her biri 1000×1250 · **Şeffaf zemin**

```
On the same 1000×1250 canvas as story_frame.png, in exactly the same place (the frame itself is NOT drawn here), ONE closed window shutter, alone, seen perfectly straight on, on a fully transparent background: a tall wooden louvered shutter lacquered in deep charcoal (#1C1D15) with a soft satin sheen, narrow horizontal louvres in a raised outer frame, a fine champagne-gold edge line (#C7A978) and two small gilded hinge knuckles on its outer edge. Make TWO files, identical in style and light: shutter_left.png — the left shutter, covering exactly x 12–50% and y 12–88% of the canvas, its hinges on its LEFT edge; shutter_right.png — the right shutter, covering exactly x 50–88% and y 12–88% of the canvas, its hinges on its RIGHT edge. Side by side they close the window completely and meet in a straight vertical seam at x 50%. Soft cool moonlight from the top-left, a faint warm reflection from the lower right. No frame, no window, no handle, no flowers. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: iki dosya; sol panjur x %12–50, sağ x %50–88, ikisi y %12–88; menteşeler dış kenarda; yan yana pencereyi tam kapatır (orta dikiş x %50); çerçeve çizilmemiş; gerçek alfa.
Kullanım: tema kurulunca story çerçevesinin önünde; kaydırmayla dış menteşelerinde 3B açılır (rotateY), arkadan foto mum sıcaklığından netleşir.

#### W13 Korkuluklu teras çerçevesi (mekân fotoğrafı)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/terrace_frame.png` · 1600×1000 · **Şeffaf zemin**

```
A wide landscape frame like the view from a villa terrace, alone, seen straight on, on a fully transparent background: a slim moulded frame of black wrought iron with soft champagne-gold leaf (#C7A978) on its inner bead, and across the whole bottom of the object a low carved pale stone balustrade (warm grey stone, softly worn, a row of rounded balusters under a flat handrail) with a small brass candle lantern standing at each end of the handrail, unlit. The object spans about x 6–94% and y 6–94% of the canvas. Above the balustrade a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 90 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it); the balustrade sits entirely below the window (between y 870 px and y 940 px) and the lanterns never overlap the window. Soft cool moonlight from the top-left with crisp gold highlights, a faint warm reflection from the lower right. No flowers, no plants. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: pencere düz `#00FF00`, 1360×765 (16:9), sol üst (120, 90); altta taş korkuluk + iki sönük fener, pencereye binmiyor; gerçek alfa.
Kullanım: tema kurulunca pencere ölçülür ve şeffaf yapılır → details'te mekân fotoğrafı; fenerlerin üstüne CSS ile çok hafif ılık titreme.

#### W14 Yağlı boya gece gölü bandı (home üst bandı)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/nocturne_band.png` · 1920×900 · opak

```
A wide, quiet oil painting of an invented mountain lake near midnight, in the same style, palette and light as the lining of env_back.png and the sky of flap_in.png: the top 40% is a calm, deep night sky (#11120F to #2A2E33) with a few faint stars and soft clouds edged in silver by a hidden moon, with NO moon disc and nothing busy (a gold crescent will be placed there by the website); across the middle the dark layered silhouettes of mountains and, on the far shore slightly right of centre, a small invented villa with a stone terrace, slender cypresses and a few warm champagne-gold windows and candle lights; the lower part is the calm lake with long soft golden reflections and a broken path of pale moonlight down the centre. Rich, soft brushwork, deep and serene, like a fine small oil painting. The bottom 15% is calm dark water that can fade into the page. No people, no boats in the foreground, no text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: üst %40 sakin gök, ay diski yok; ortada dağlar + küçük villa ışıkları; altta göl ve ay yolu; alt %15 sakin koyu su; yazı yok.
Kullanım: tema kurulunca home'un en üst bandı (altı sayfa zeminine söner, üstünde broş "ay"); details ve rsvp başlıklarında dar kırpım.

#### W15 Köşe süsü (beyaz bahçe gülü + zeytin dalı)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/corner_spray.png` · 1200×1000 · **Şeffaf zemin**

```
A restrained, romantic corner spray growing out from near the top-left corner toward the centre, alone, on a fully transparent background, photorealistic: two white-ivory garden roses (#F1E4CC, soft layered petals with a faint champagne blush in their hearts), one half-open bud, a few slender sprigs of silvery-green olive leaves, and two or three tiny champagne-gold leaves; the stems are hidden among the leaves. It reaches toward the top and left sides of the image but stays 6% inside them, and the bottom-right half of the canvas is completely empty. Soft cool moonlight from the top-left, a faint warm glow on the petals from the lower right. No other flowers or colours, no ribbon, no vase, no glitter. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: küçük, sade küme sol üstten; sağ alt yarı boş; yalnız beyaz gül + zeytin + birkaç altın yaprak; gerçek alfa.
Kullanım: tema kurulunca home kartının üst köşeleri (sağda aynalanır), RSVP formunun köşesi; kapak sayfasında **kullanılmaz** (metnin altına girmez).

#### W16 Zeytin dalı ayırıcı (altın)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/divider.png` · 1600×200 · **Şeffaf zemin**

```
A slim horizontal divider, alone, on a fully transparent background: two delicate champagne-gold olive branches (#C7A978, fine engraved gilded metal, small slender leaves) growing from the centre outward to the left and to the right along the vertical centre line, tapering to fine tips at about 8% and 92% of the canvas width, and at the very centre a tiny gilded crescent moon about 4% of the canvas width. Symmetrical, elegant, fine. Soft cool moonlight from the top-left with small crisp highlights. No ribbon, no beads, no other colour. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: yatay simetrik iki altın zeytin dalı + ortada küçük hilal; uçlar %8–92; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında bölüm ayırıcı (home davet bandı ve gün özeti, details programı, RSVP formu).

#### W17 Cam fener içinde mum (imza)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/candle_lantern.png` · 500×800 · **Şeffaf zemin**

```
A single small hurricane lantern, standing upright, alone, seen from the front, on a fully transparent background: a slender clear glass chimney on a round antique-brass base with a fine champagne-gold rim, a small brass ring handle on top, and inside it one short ivory pillar candle (#F1E4CC) with a small calm lit flame. The glass is truly see-through (real alpha in the clear glass), shown only by crisp edge highlights and a faint reflection of the flame; the warm light of the flame stays INSIDE the glass (a soft gold warmth on the inner glass and the candle top), nothing outside the lantern. The lantern spans about x 22–78% and y 8–92% of the canvas. Soft cool moonlight from the top-left on the brass and glass. No table, no flowers, no smoke. No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: tek fener, cam saydam, içinde yanan küçük mum; ışık camın içinde kalıyor; gerçek alfa.
Kullanım: tema kurulunca home imzası ve RSVP kapanışı; alevin üstünde CSS ile hafif titreme (ölçek/opaklık); RSVP gönderilince alev büyür.

#### W18 Süzülen küçük nesneler — üç ayrı dosya
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small object, alone, centred, on a fully transparent background, filling about 55% of the square, photorealistic, soft cool moonlight from the top-left with a faint warm glow from the lower right. No other object. No cast shadow or drop shadow outside the object. No text, letters, numbers, monograms, logos or watermarks. True transparent background PNG (real alpha channel — not white, not a checkerboard). Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. (Make three files, the same light and scale: 1 = one small irregular flake of champagne-gold leaf (#C7A978), thin, slightly crumpled, catching the light; 2 = one single loose white-ivory garden rose petal (#F1E4CC), softly cupped, a faint champagne blush at its base; 3 = one tiny warm spark of candlelight — a small soft round point of champagne-gold light (#E0C7A4 at its bright centre) fading smoothly to fully transparent at its edge, like a firefly or a reflected candle glint, the light itself being the object.)
```
Kontrol: her dosyada tek nesne; üç dosya farklı (altın varak pulu, gül yaprağı, ışık kıvılcımı); kıvılcım kenarda tam şeffafa söner; gerçek alfa.
Kullanım: tema kurulunca açılışın sonunda ve RSVP gönderilince süzülen küçük nesneler (her biri ayrı katman, kendi fazında); kıvılcım kapak sayfasında da çok seyrek.

#### W19 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic luxury stationery product photography by moonlight and candlelight: the closed portrait charcoal-black laid paper envelope of flap.png with its deep elongated-diamond flap edged in deckled champagne-gold foil, wrapped by the frosted vellum belly band of vellum_band.png with its fine silver lake-panorama engraving and the hammered gold crescent-moon brooch of moon_brooch.png pinned at its centre, lying slightly below the centre on the charcoal laid paper of night_laid.png; at the left a small spray of white-ivory garden roses and silvery olive sprigs (as corner_spray.png); at the right the small hurricane lantern of candle_lantern.png with its lit candle and a narrow champagne silk ribbon lying loosely; a few tiny gold-leaf flakes scattered; behind, softly out of focus, the dark paper and a faint warm candle glow. Only black, charcoal, champagne, gold and ivory tones. The top 20% of the image is calm and dark (only out-of-focus paper). This image is cropped to 1200×630 for link previews: keep the whole envelope, band and brooch visible with at least 5% empty margin below it. No people. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf + bant + broş bütün, altında ≥%5 boşluk; üst %20 sakin; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (alta hizalı kırpım: üstten ~%21) ve katalog kapağı posteri.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) — var, yeniden üretme

#### 2.1 Ana portre
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties on a Lake Como villa terrace at blue hour: groom in a tailored black tuxedo, bride in a minimal ivory silk gown, close and smiling, three-quarter length, faces in the upper third. Distant lake lights, cypresses, warm candlelight. Black, olive and champagne palette, subtle film grain. No text, no frame.
```

#### 2.2 Galeri 1 — "A quiet moment, just us"
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5, a quiet candid moment on the villa's stone steps at dusk, foreheads touching, candle lanterns along the steps, lake in soft focus behind. Photorealistic, same palette and grain. No text.
```

#### 2.3 Galeri 2 — "Where the mountains meet the water"
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_2.jpg` · Yatay (1536×1152, 4:3)

```
Landscape 4:3: the same couple small in the frame on a wooden lake jetty at dusk, the mountains and the water's lights wide around them. Photorealistic, same palette and grain. No text.
```

#### 2.4 Galeri 3 — "An evening we will always remember"
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_3.jpg` · Yatay (1536×1152, 4:3)

```
Landscape 4:3: a long candlelit dinner table on the lake terrace at night, ivory roses and champagne glasses, guests as soft silhouettes, the couple laughing at the head of the table. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/venue.jpg` · Yatay (1536×864, 16:9)

```
Landscape 16:9: an elegant lakeside villa with a stone balustrade terrace and cypress trees, seen from the water at dusk, warm windows and candle lights, mountains behind. No people, no signs, no text. Photorealistic, same palette.
```

---

## PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, `'nocturne-lake-estate'` bloğu). Eski zeminler
> (`print/invitation_front.png`, `print/invitation_back.png`) eski görünümündü; yeni görünüm için **yeni dosya adları**.
> **Dosya adı ve ölçü:** `print/invitation_front_r_5x7.png`, `print/invitation_back_r_5x7.png`, **1575×2175 px** = 5×7 in +
> 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan ~%0,8
> kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Kâğıt açık fildişi** (ev yazıcısında mürekkep dostu; metin koyu kömür basılır), koyu gece dili yalnız alt bantta.
> **Yazı alanı:** ön yüzde yükseklikte %19–%78 × genişlikte %10–%90 **tamamen boş** (isimler, tarih, mekân); arka yüzde
> yükseklikte %13–%93, genişlikte %9–%91 boş (program + QR; QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir).
> Süsleme yalnız üst ve alt bantlarda.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema kurulunca (G422) `layouts.ts` `'nocturne-lake-estate'` bloğu: `sources` → `{ front:
>    'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' }`; `composed` → `{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`; `ink` / `accent` koyu kömür + altın.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın; `tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme nocturne-lake-estate` (eski kaynaklardan kalan
>    `public/print/nocturne-lake-estate/` dosyaları silinir) ve `node scripts/print-sample.ts --theme nocturne-lake-estate
>    --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/print/invitation_front_r_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the thick warm ivory laid card of ivory_laid.png (#F1E4CC). At the top centre, between 8% and 15% of the height, a small hammered champagne-gold crescent moon (as moon_brooch.png, printed flat as a fine gold illustration) above a short pair of fine gold olive branches (as divider.png), about 30% of the width. Along the bottom, from 82% of the height down to the bottom edge, a full-width band of the oil-painted night lake of nocturne_band.png — dark mountains, a tiny villa with warm gold windows, cypresses and a path of moonlight on the water — whose top edge is a soft, slightly irregular painted edge fading into the ivory paper (no hard line), with a hair-fine champagne-gold rule just above it at 81% of the height between 12% and 88% of the width. The rectangle from 19% to 78% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there in dark ink): no petal, no line, no shadow, no stain in it. No ornament within 8% of the left and right edges except the painted band, which simply runs off the edges. Soft cool light from the top-left. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%78 × %10–%90 tamamen boş; üstte küçük altın hilal + zeytin (%15'in üstünde); altta %82'den itibaren yağlı boya göl bandı, yumuşak geçiş; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/print/invitation_back_r_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same thick warm ivory laid card, only a short pair of fine champagne-gold olive branches with a tiny gold crescent at their centre across the top centre (between 32% and 68% of the width), staying above 11% of the height, and a very slim strip of the same oil-painted night lake along the very bottom edge (below 95% of the height, fading softly upward into the paper). The whole area between 13% and 93% of the height, from 9% to 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no line, no shadow, no stain. No ornament within 8% of the left and right edges except the bottom strip. No QR code. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; üst ortada kısa altın zeytin + hilal (%11'in üstünde), en altta ince göl şeridi (%95'in altı); %13–%93 boş; yazı/QR yok.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a black linen tablecloth over a dark walnut table beside a window at dusk and tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a black linen tablecloth over a dark walnut table beside a window at dusk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a black linen tablecloth over a dark walnut table beside a window at dusk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a black linen tablecloth over a dark walnut table beside a window at dusk, slightly right of center and rotated about 8 degrees, surrounded at the edges by tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a charcoal velvet sofa with a champagne silk cushion and a crystal champagne coupe; a small arrangement of tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 22`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Nocturne Lake Estate". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, the same light and the same color world (black, charcoal, champagne and antique gold). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a black linen tablecloth over a dark walnut table beside a window at dusk, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a black linen tablecloth over a dark walnut table beside a window at dusk, tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a black linen tablecloth over a dark walnut table beside a window at dusk, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a black linen tablecloth over a dark walnut table beside a window at dusk, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a black linen tablecloth over a dark walnut table beside a window at dusk: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a black linen tablecloth over a dark walnut table beside a window at dusk: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a black linen tablecloth over a dark walnut table beside a window at dusk, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a black linen tablecloth over a dark walnut table beside a window at dusk, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a black linen tablecloth over a dark walnut table beside a window at dusk: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: tall ivory taper candles in brass holders, a sealed black envelope with a champagne gold wax seal, a few white garden roses, a thin champagne silk ribbon and two crystal champagne coupes. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: black, charcoal, champagne and antique gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
