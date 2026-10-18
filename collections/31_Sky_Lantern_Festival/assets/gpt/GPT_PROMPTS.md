# GPT görsel istekleri — Tasarım 31 · Sky Lantern Festival

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos of the fictional couple), then PAKET 6 (printable invitation grounds). Use each English prompt exactly as
> written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text,
> letters, numbers, logos, monograms, signatures or watermarks in any image. Make W2.2 `lantern_dark.png` first and give
> it as the style reference of every later part: the same rice paper, the same soft watercolor, the same dusk palette,
> the same warm light.

Bu dosya tasarım 31'in **bütün görsel parçalarının** tek kaynağıdır (G170). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
(eksenler + hareket imzası) kayıtlı, üreteçlere girmediği için dosya elle yazıldı. Tema (`platform/themes/sky-lantern-festival/`)
bu parçalar gelmeden kuruldu: `build_images.py` eksik her parça için repodaki başka GPT görsellerinden **geçici** bir katman
kesiyor (02'nin suluboya yıkamasından satır satır tonlanmış alacakaranlık göğü ve sayfa zemini, 18'in pamuk kâğıdından
fener/uzak fener/kart tonları; çizim yok, K21). Betiğin GPT kolu hazır — her parça dosyası `parts/` altına konduğu anda
(parça parça) kullanılır, sayfalar aynı dosya adlarını alır, ölçülen pencere yüzdeleri `img/manifest.json`'a ve `site.css`
sonundaki üretilen `@gpt-layers` bloğuna yazılır (elle düzenlenmez). Yalnız GPT'yle var olan katmanlar (avuçlar, yıldız
tozu, ayırıcı, pirinç kâğıdı paspartu, yatay çerçeve) o blok açana kadar gizlidir. Tema `live` olmadan önce göz
kontrolünden geçer (bkz. en alttaki "Parçalar gelince").

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/31_Sky_Lantern_Festival/assets/gpt/` altındaki `parts/`
  (PAKET 5), `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.

## Stil ve renk
- Teknik: **soft watercolor with glowing light** — wet-on-wet watercolor washes for the sky, delicate rice-paper texture
  for the lanterns, light painted as warm glow (the lit paper glows from inside). Romantic, airy, elegant. Not a photo,
  not flat vector, not cartoon, not anime.
- Renkler: dusk violet `#2B1F45` · deep `#1B1430` · violet `#4A3466` · dusky rose `#E7B4A6` · lantern amber `#F2A65A` ·
  glow `#FFD08A` · rice paper `#F7EEDD` · ink `#3B2A4A`.
- Işık: fenerin kendi sıcak ışığı (içeriden) ve ufuktaki son gün ışığı; diğer her şey alacakaranlık. Bütün parçalarda aynı.
- **Kültürel olarak nötr ve zarif:** sade, yuvarlak hatlı beyaz/fildişi pirinç kâğıdı dilek feneri (ince bambu iskelet
  hafifçe seçilir). Kostüm, festival kalabalığı, tapınak, pagoda, ejderha, yazı/karakter, belirli bir ülkenin simgesi yok.
  27 Riad Lantern Nights (pirinç delikli metal fener, kapı, çini), 26 Kintsugi (çivit washi, altın damar), 19 Midnight Garden
  (siyah, koyu güller) ya da 29 Celestial Observatory (pirinç gözlemevi, yıldız haritası) gibi görünmesin.
- Gerçek bir kişiye, mekâna, markaya veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — website katmanları (YAZI YOK)

Tek görselde tek nesne, düşen gölge yok, şeffaflar gerçek alfa (beyaz ya da dama tahtası değil).
**W2.1 avuçlar, W2.2 sönük fener ve W2.3 yanan fener aynı 1024×1536 tuvalde, aynı konumda** çizilir: üst üste konunca fener
avuçların içinde durur; yanan fener sönüğün tam üstüne oturur (site önce sönüğü gösterir, dokununca yananı üstüne açar,
sonra fener yükselirken avuçlar aşağı iner). Ortak ölçü (tuval yüzdesi): fener x %31–69, y %27–67 (ortası y %47 — sitenin
ışık hâlesi oraya ortalanır); avuçlar x %14–86, y %58–100 (bilekler alt kenardan çıkar; parmaklar fenerin yalnız en alt
~%10'unu sarar). `build_images.py` üç tuvali olduğu gibi (kesmeden) 800×1200'e ölçekler ve sahnenin üstüne tam oturtur.

#### W2.1 Avuçlar (fenersiz)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/hands.png` · 1024×1536 · **Şeffaf zemin**

```
Two gently cupped hands seen from the front and slightly below, held together and raised as if offering something up to the sky, alone on a transparent background, soft watercolor illustration: graceful, elegant hands in warm backlight, painted in soft muted rose-beige and violet shadow tones so that they read as anyone's hands (no rings, no nail polish, no sleeves beyond the wrists, no jewellery), the fingertips and the inner palms lit warm amber from above as if by a glowing lantern. The hands sit in the lower part of the image: from 14% to 86% of the image width and from 58% of the image height down to the bottom edge (the wrists leave the image at the bottom edge). The space ABOVE the cupped fingers — from 27% to 67% of the image height, from 31% to 69% of the width — is EMPTY and transparent: a paper lantern will sit there, its lowest part resting in the cup of the fingers. Front view, symmetrical, not cropped at the sides. No lantern, no object in the hands, no cast shadow, no glow or halo outside the hands' outline. No text. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: avuçlar alt kenardan giriyor, x %14–86, üstü %58; fenerin yeri boş; yüzük/oje/takı yok; ten tonu yumuşak, ışığa
gömülü (herkesin eli gibi); gölge/hâle yok; gerçek alfa. (Yeri: açılış sayfasında fenerin önünde; dokununca açılıp aşağı iner.)

#### W2.2 Sönük kâğıt fener
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_dark.png` · 1024×1536 · **Şeffaf zemin**

```
A single paper sky lantern, unlit, alone on a transparent background, soft watercolor with delicate rice-paper texture: a tall, softly rounded lantern of ivory rice paper (#F7EEDD) gently tinted dusky rose and violet by the evening light, slightly wider at the top than at the open bottom, with a fine, barely visible bamboo frame and a thin bamboo ring at the open bottom. It is placed exactly where the hands of hands.png will hold it: from 31% to 69% of the image width and from 27% to 67% of the image height (its centre at 47% of the height). Elegant and simple — no pattern, no symbols, no tassels, no writing on the paper. Front view, perfectly straight and symmetrical, not cropped. No hands, no flame visible, no cast shadow, no glow or halo outside its outline. No text. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek fener, x %31–69, y %27–67; desen/yazı/püskül yok; sönük (iç ışık yok); gölge/hâle yok; alfa. (Stil referansı:
bundan sonraki her parça bu fenerle aynı kâğıt ve aynı suluboya.)

#### W2.3 Yanan kâğıt fener (aynı fener, içeriden ışıyor)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_lit.png` · 1024×1536 · **Şeffaf zemin**

```
The same paper sky lantern as lantern_dark.png (give it as the reference image), on exactly the same canvas position and with exactly the same outline (from 31% to 69% of the image width, from 27% to 67% of the image height), now lit from inside by a small warm flame near its open bottom: the rice paper glows warm amber and honey gold (#F2A65A to #FFD08A), brightest in the lower middle and softer toward the top, the fine bamboo frame showing as slightly darker lines through the glowing paper. The glow stays INSIDE the lantern's outline — no halo, no light rays, no glow on the transparent background (the website adds the halo). No hands, no cast shadow. No text. True transparent background PNG.
```
Kontrol: hattı W2.2 ile birebir aynı (üst üste konunca kaymıyor); ışık yalnız kâğıdın içinde; dışarıda hâle yok; alfa.

#### W2.4 Alacakaranlık göğü (açılış sayfası ve ana sayfanın ilk ekranı)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/sky_dusk.png` · 1080×1920 · opak

```
A vertical phone-screen background: a dusk sky painted in soft wet-on-wet watercolor that fills the whole canvas — deep violet (#2B1F45) at the top, melting through soft violet and dusky rose (#E7B4A6) in the middle to a warm amber glow (#F2A65A) along the horizon at the very bottom, with a few long, soft, translucent clouds lit rose and gold from below, and the faintest first stars near the top. A low, calm line of distant hills in soft violet silhouette along the bottom 8% only. No lanterns, no people, no buildings, no moon, no text. The whole central area stays calm and open (names and an invitation card are placed over it). Soft, romantic, luminous.
```
Kontrol: üst mor → orta pembe → alt kehribar; orta sakin; fener/kişi/yazı yok; tepeler yalnız en alt bantta. (Yeri: açılış
sayfasının arka planı — fener yükselirken yavaşça aşağı kayar, paralaks — ve ana sayfanın ilk ekranı; 16:9 kırpımı program
bandının zemini.)

#### W2.5 Yıldız tozu (paralaks katmanı)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/star_dust.png` · 1080×1920 · **Şeffaf zemin**

```
A transparent overlay of scattered star dust for a dusk sky: many tiny soft pinpoints of warm white and pale gold light of different sizes, a few slightly larger soft sparkles, denser in the upper third of the image and fading out toward the bottom, with a gentle sweep of fine glittering dust crossing diagonally from the upper left. Painted softly, like flecks of white gouache flicked onto watercolor. Nothing else — no sky color, no clouds, no lanterns, no moon, no text. Most of the image stays empty and transparent. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız ince yıldız noktaları; zemin şeffaf; üstte yoğun, altta seyrek; yazı yok. (Yeri: gök katmanının önünde; açılışta
gökten daha hızlı kayar — iki katmanlı paralaks; ana sayfanın ilk ekranında da.)

#### W2.6 Uzaktaki küçük fener
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_far.png` · 1024×1024 · **Şeffaf zemin**

```
One small, distant paper sky lantern, lit and glowing warm amber from inside, alone on a transparent background, in the same watercolor and rice-paper style as lantern_lit.png: the same simple softly rounded shape, about two thirds as wide as it is tall (2:3), centred, filling about 60% of the image height. The glow stays inside its outline (no halo, no rays). No text. True transparent background PNG.
```
Kontrol: tek fener, oran ~2:3, ortalı; hâle yok; alfa. (Yeri: açılışta yükselen üç uzak fener, ana sayfada kaydırdıkça
süzülen fenerler, fotoğrafların yanından yükselen küçük fenerler, programın her satırındaki fener, RSVP'de göğe bırakılan
fener — site 72 ve 144 px keser; ışık hâlesini CSS ekler.)

#### W2.7 Fenerin ışığında beliren küçük davet kartı (boş)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
A small portrait invitation card, alone: thick warm ivory rice paper (#F7EEDD) with visible soft fibres and a gently deckled edge, about 0.7 as wide as it is tall, with a very faint wash of dusky rose and amber light along its upper edge, as if lit by a lantern above it. In its upper half, horizontally centred, a portrait photo window about 4:5 with softly rounded corners, about half as wide as the card, its top about 8% of the card's height below the card's top edge, filled with flat pure green #00FF00 (no texture, no shading, crisp outline). Everything below the window — at least the lower 42% of the card — is blank, even ivory paper (no text, no ornament: names and date are added there by the website). Front view, perfectly straight, centered and not cropped, with generous empty margin all around. No cast shadow and no drop shadow. No glow outside the object's outline. No text, letters or numbers. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: pencere düz #00FF00, kartın üst yarısında ortalı; pencerenin altı düz kâğıt; kenar yumuşak tırtıklı; alfa. (Claude:
pencere şeffaf yapılır, portre kartın ARKASINA, ölçülen pencereye konur; pencere altındaki düz kâğıt `free_zone` olur,
theme-check kart yazısını onunla denetler.)

#### W2.8 Döşenebilir sayfa zemini
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/bg_tile.png` · 1024×1024 · opak · **dikişsiz**

```
A seamless, tileable texture of a deep evening sky in soft watercolor: dusk violet to deep night violet (#1B1430 to #3A2A5C), gentle wet-on-wet blooms and a fine paper grain, evenly lit with no vignette, no light spot, no stars, no clouds with hard edges and no pattern that shows when the tile repeats. Edges must match perfectly left-right and top-bottom. No text, no objects.
```
Kontrol: 2×2 yan yana konunca dikiş görünmüyor; ışık lekesi yok; açık renk yazı üstünde okunuyor.

#### W2.9 Pirinç kâğıdı paspartu (story fotoğrafları)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/frame_paper.png` · 1024×1536 · **Şeffaf zemin**

```
A soft rice-paper photo mat, alone: a portrait sheet of ivory rice paper (#F7EEDD) with visible fibres and gently deckled edges, about 2:3 overall, its inside lit faintly amber from below as if a lantern were rising beneath it. A portrait window exactly 3:4, centred, about 72% of the mat's width, filled with flat pure green #00FF00 (no texture, no shading, crisp straight edges). Front view, perfectly straight, centered and not cropped, with generous empty margin. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```
Kontrol: pencere 3:4 düz #00FF00; kâğıt kenarı ince; alfa. (Claude pencereyi şeffaf yapar ve ölçer; story ve home'daki üç
fotoğraf paspartunun arkasına, pencereye oturur.)

#### W2.10 Yatay çerçeve (mekân fotoğrafı)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/frame_landscape.png` · 1536×1024 · **Şeffaf zemin**

```
A wide rice-paper photo mat in the same style as frame_paper.png, alone: a slim ivory rice-paper border with gently deckled outer edges, its opening exactly 16:9 and filled with flat pure green #00FF00 (no texture, no shading). Front view, perfectly straight, centered, not cropped, generous margin. No cast shadow, no glow outside the outline. No text. True transparent background PNG.
```
Kontrol: pencere 16:9 düz #00FF00; kenar ince; alfa. (Yeri: details'te mekân fotoğrafının paspartusu.)

#### W2.11 Ayırıcı — yıldız tozu izi
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/divider.png` · 1536×512 · **Şeffaf zemin**

```
A slim horizontal ornament, alone: a gentle trail of warm gold star dust drifting from left to right, with three tiny glowing paper lanterns rising along it at different heights (the middle one slightly larger), about 10 times wider than tall, centred, soft watercolor and gouache flecks. No shadow, no halo, no text. True transparent background PNG.
```
Kontrol: ince, yatay, ortalı; üç küçük fener; alfa. (Yeri: home davetinde isimlerle tarih arasında, details başlığının altında.)

#### W2.12 Paylaşım görseli kaynağı
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
A wide scene for a link-preview image in the same watercolor style and palette: the dusk sky of sky_dusk.png (deep violet above, dusky rose, an amber horizon over low violet hills), the lit paper lantern of lantern_lit.png rising in the lower middle of the image just above the gently cupped hands of hands.png that have just let it go, a warm soft glow around the lantern, and five or six small distant lanterns drifting higher at different sizes. The lantern and the hands sit in the lower-middle and are fully visible; the top 20% of the image is calm sky with nothing important. No people other than the hands, no text, no letters.
```
Kontrol: fener ve avuçlar alt-ortada tam görünüyor; üst %20 sakin; yazı yok. (`tema_build.og_kirp(hiza="alt")` →
`og-1200x630.jpg`.)

---

## PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel)

Demo içeriği (`content.demo.json`): **Sophie & Daniel**, *The Meadowlark Terrace* (kurgu), Santa Barbara, California,
September 18, 2027. Kurgu kişiler: **gerçek bir kişiye (ünlü dahil) benzemesin**; yüzler doğal, yaşları 28–34; tek bir kurgu
çift beş fotoğrafta da aynı kişiler. Sophie: açık kumral, omuz altı yumuşak dalgalı saç, açık ten, sade fildişi şifon uzun
elbise (gelinlik değil, sade). Daniel: koyu kahve kısa saç, buğday ten, kısa bakımlı sakal, kömür grisi takım, açık yaka.
Fotoğraf gerçekçi (PAKET 5'in suluboyası değil), alacakaranlık ve sıcak fener ışığı, sinematik ama doğal. Gerçek kalabalık
fener bırakma ya da ateş tehlikesi görünen sahne yok (fenerler küçük, sakin; LED kâğıt fenerler olabilir). Yazı, logo,
filigran yok.

#### 2.1 Portre (davet kartı ve home)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/hero_portrait.jpg` · 1024×1280 (4:5)

```
A warm, natural portrait photograph of a fictional couple in their early thirties (they must not resemble any real person): she has soft wavy light-brown hair below her shoulders and wears a simple ivory chiffon gown, he has short dark-brown hair, a neat short beard and wears a charcoal suit with an open collar. They stand close, foreheads nearly touching, smiling softly, framed from the waist up, on a hilltop terrace at dusk; behind them, softly out of focus, a violet-to-amber sky and a few warm paper lanterns hanging low. Faces in the upper middle of the frame. Photorealistic, natural skin, no heavy retouching. No text, no logo, no watermark.
```

#### 2.2 Story 1 — "Our first evening"
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_1.jpg` · 1152×1536 (3:4)

```
The same fictional couple (same faces, hair and clothes styled casually: she in a light summer dress, he in a white linen shirt) laughing together at a small table on a seaside terrace in the early evening, string lights and a soft violet sky behind them, seen from a little distance. Vertical photo, the couple in the middle third. Photorealistic. No text, no watermark.
```

#### 2.3 Story 2 — "A wish in the sky"
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_2.jpg` · 1152×1536 (3:4)

```
The same fictional couple standing in a quiet meadow at dusk, holding one glowing white paper lantern together between their hands and looking up at it, their faces lit warm by its glow, a violet sky and a few distant soft lights behind them. Seen at a three-quarter angle. Vertical photo. Photorealistic. Calm and intimate — no crowd, no fire, no smoke. No text, no watermark.
```

#### 2.4 Story 3 — "Yes, at dusk"
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_3.jpg` · 1152×1536 (3:4)

```
A close photograph of the same fictional couple's joined hands with a simple gold engagement ring, held up against a soft violet-and-amber dusk sky with a small glowing paper lantern blurred in the background, shallow depth of field. Vertical photo. Photorealistic. No text, no watermark.
```

#### 2.5 Mekân — "The Meadowlark Terrace" (kurgu)
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/photos/venue.jpg` · 1536×864 (16:9)

```
A wide photograph of a fictional hilltop garden terrace set for an evening wedding at dusk: long tables with ivory linen and candles, white paper lanterns strung low on thin lines between olive trees, a lawn with rows of white chairs facing an open view of distant hills and the sea under a violet-to-amber sky. It must not reproduce any real, identifiable venue. No people, no text, no signs, no watermark.
```

Kontrol (PAKET 2): beş fotoğrafta aynı kurgu çift; gerçek kişiye benzemiyor; yazı yok; oranlar doğru (`python3 tools/kit_check.py collections/31_Sky_Lantern_Festival --paket 2`).

---

## PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK)

Yazı (isimler, tarih, mekân, program) website'in metin katmanı gibi baskı sayfasına sonradan konur (`lib/print/layouts.ts`).
Platform her yüz için **tek** zemin kullanır ve onu kesim payı (bleed) dahil sayfaya `cover` ile yayar: aynı görsel hem 5×7 in
(+1/8 in bleed = 5.25 × 7.25 in) hem A5 (+3 mm = 154 × 216 mm) basar. Bu yüzden zemin **A5 + bleed ölçüsünde, 300 ppi**:
1819×2551 px (5×7'de üst ve alttan ~%0,8 kırpılır, ~260 ppi). Ayrı A5 / 5×7 zemini istenmez (platform kullanamaz).
Metin kutusu (`layouts.ts`, kesim kenarına göre %: üst, sağ, alt, sol) ön `[18, 12, 13, 12]`, arka `[12, 12, 8, 12]`;
zemin görselinin yüzdesiyle bu, ön yüzde **yükseklik %17–88, genişlik %11–89**, arka yüzde **yükseklik %11–93, genişlik
%11–89** düz kâğıt demektir (iki ölçüde de kutuyu kapsar). Dekor yalnız bunun dışında ve kenardan en az %5 içeride (kâğıt
dokusu ve gök yıkaması kenara kadar uzanabilir).

#### 6.1 Ön yüz
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/print/print_front.png` · 1819×2551 · opak

```
A printable wedding invitation ground, front side, portrait, flat and seen straight on, 1819 × 2551 px at 300 ppi (A5 with bleed; it is trimmed later), no text: warm ivory rice paper (#F7EEDD) with soft visible fibres running edge to edge. Decoration ONLY in the top 16% and the bottom 11% of the image: at the top a soft watercolor band of dusk sky (deep violet fading to dusky rose) with three small glowing paper lanterns rising in it, the middle one slightly larger, and a little gold star dust; at the bottom a narrow wash of amber horizon light with a faint line of violet hills. Keep the lanterns and every ornament at least 5% inside the image edges (the washes may reach the edges). The whole central area — from 17% to 88% of the height and from 11% to 89% of the width — is plain, calm, even ivory paper with no ornament, no frame line and no shading, for the names, date and venue. Soft watercolor with glowing light. No text, no letters, no numbers, no monogram.
```

#### 6.2 Arka yüz
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/print/print_back.png` · 1819×2551 · opak

```
The matching back of the same invitation (give print_front.png as the reference image), portrait, 1819 × 2551 px at 300 ppi, no text: the same ivory rice paper edge to edge, decorated ONLY in the top 10% of the image — a single narrow watercolor band of the same dusk sky with one small glowing lantern at its centre. Everything else — from 11% to 93% of the height and from 11% to 89% of the width, and the bottom of the sheet — is plain, even ivory paper for the schedule, the details and a QR code. Same style and light. No text, no letters, no numbers.
```

Kontrol (PAKET 6): 1819×2551; orta alan (ön %17–88 × %11–89, arka %11–93 × %11–89) tamamen düz kâğıt; yazı yok; ön ve arka
aynı kâğıt. **Gelince (Claude, otomatik değil — G149 ölçümü gerekir):** `lib/print/layouts.ts` `'sky-lantern-festival'`
bloğunda `sources` → `{ front: 'print/print_front.png', back: 'print/print_back.png' }`, `composed` → `front: { bg:
cover('front'), images: [] }`, `back: { bg: cover('back'), images: [] }` (gök bantları ve fener kalkar; kutular aynı
kalabilir); sonra `node scripts/build-print-assets.ts --theme sky-lantern-festival` ve `node --test
tests/g149-print-layout.test.ts` (kutu dekora değiyorsa `front`/`back` kutusu ya da `bands` ölçülüp daraltılır). O zamana
kadar `build-print-assets` bu iki dosya için "PAKET 6 grounds not used … yet" uyarısı verir.

---

## Parçalar gelince (Claude)

```bash
python3 tools/kit_check.py collections/31_Sky_Lantern_Festival                    # ölçü / alfa / #00FF00 pencere denetimi
python3 platform/themes/sky-lantern-festival/build_images.py                    # parts/ → img/ + manifest.json + site.css @gpt-layers
cd platform && PORT=3405 NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs --theme sky-lantern-festival --stress --compare none
node --test tests/theme-sky-lantern-festival.test.ts                            # CSS @gpt-layers = manifest
```

`build_images.py` her parçayı dosyası varsa kullanır, yoksa geçici parçayı keser; çıktı uyarıları (`manifest.json`
`warnings`: oran %4'ten fazla farklı, 1,5×'ten fazla büyütme, pencere yok) göz kontrolünde okunur. Kesim: `hands`,
`lantern_dark`, `lantern_lit` → aynı tuval, kesilmeden 800×1200 (sahnenin üstüne tam oturur; fenerin alfa kutusu
`manifest.stage.lantern_box_pct` — hâle CSS'te fenerin ortasına, y %47); `sky_dusk` → `sky` (1080×1920) + 16:9 `sky_band`;
`star_dust` → paralaks katmanı; `lantern_far` → alfa kırpımı, 144×216 (72 + 144 px); `card_small` → kart (878×1254),
#00FF00 pencere şeffaf, pencere ve düz kâğıt ölçülür; `frame_paper` / `frame_landscape` → pencere şeffaf + ölçü (foto
arkada); `bg_tile` → `bg_wall`; `divider` → yalnız GPT'yle görünen katman; `web_hero` → `og-1200x630.jpg`
(`og_kirp(hiza="alt")`); PAKET 2 → demo kaydının `media`'sı (tema varlığı, ayrı iş); PAKET 6 → yukarıdaki elle geçiş. Sonra
göz kontrolü (gerçek iPhone/Android dahil) ve satış kararı (`coming` → `live`).

Kuru deneme (gerçek repo değişmez): `python3 tools/gpt_kuru_deneme.py --tema sky-lantern-festival --sekil
collections/31_Sky_Lantern_Festival/assets/gpt/kuru_sekil.json [--theme-check --stress --port 3405]`.

---

## PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Yazan: G175 (`tools/paket3_sahne.py` şablonu, 01–21 ile aynı). `tools/listing_editorial.py` 3.1, 3.2, 3.4 ve 3.5'i
> kullanır (ilan görselleri 1, 2, 8, 4); 3.3 yedek sahnedir.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Sky Lantern Festival". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a soft rice-paper cloth on a light wooden table at dusk, glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, the same light and the same color world (dusk violet, lantern amber, dusky rose and rice paper). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a soft rice-paper cloth on a light wooden table at dusk and glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a soft rice-paper cloth on a light wooden table at dusk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a soft rice-paper cloth on a light wooden table at dusk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a soft rice-paper cloth on a light wooden table at dusk, slightly right of center and rotated about 8 degrees, surrounded at the edges by glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on an ivory linen sofa with a dusky rose cushion and a warm glowing paper lantern; a small arrangement of glowing round rice-paper lanterns, a few strands of warm fairy lights, a dusky rose silk ribbon and a sprig of pale dried flowers is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: dusk violet, lantern amber, dusky rose and rice paper. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
