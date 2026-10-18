# GPT görsel istekleri — Tasarım 38 · Papel Picado Fiesta

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, words cut into
> the paper, names, dates, logos, monograms or watermarks in any image.** **No religious symbols** (no crosses, saints,
> hearts with flames or thorns, churches, altars) and **no Day of the Dead imagery** (no skulls, skeletons, calaveras,
> marigold altars): this is a joyful wedding fiesta. Give W1 `kraft_paper.png`, W3 `cream_paper.png` and W8
> `flag_1.png` as the style reference of every later part: the same kraft, the same cream paper, the same crisp hand-cut
> tissue paper in the same six colours, the same warm afternoon sun from the top-left.

Bu dosya tasarım 38'in **bütün görsel parçalarının** tek kaynağıdır (G187). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema
(`platform/themes/papel-picado-fiesta/`) **geçici** görsellerle çalışıyor: 04'ün düz eski kâğıdı kraft rengine, 11'in düz
sıcak kâğıdı kireç badanaya ve terrakotaya, 18'in düz pamuk kâğıdı kreme ve altı tissue rengine tonlandı; bayraklar bu
tissue kâğıtlardan **düz dikdörtgen kırpımlar** (kesim deseni yok), foto çerçeveleri düz tissue paspartu. Ampul dizisi,
bugenvil ve işlemeli kumaş bandı **yok** (çizilmiş yedek yok, K21). Parçalar gelince ne değişeceği: tema README →
"What waits for GPT".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/38_Papel_Picado_Fiesta/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/papel-picado-fiesta/build_images.py` — PAKET 5'in **her parçası geldiği anda
  kendiliğinden** kullanılır (G167 düzeni): img/ yeniden üretilir, `platform/themes/papel-picado-fiesta/parts.css` o
  parçaların kurallarıyla yazılır; gelmeyen parçanın kuralı yazılmaz, sayfa geçici görünümünde kalır (`img/manifest.json`
  → `parts.used` / `parts.waiting_for_gpt`). Sonra `python3 tools/kit_check.py collections/38_Papel_Picado_Fiesta
  --paket 2`, `python3 tools/gpt_kuru_deneme.py --tema papel-picado-fiesta --sekil
  collections/38_Papel_Picado_Fiesta/assets/gpt/kuru_sekil.json` (prova; gerçek parçalarla da koşulabilir), theme-check ve
  göz kontrolü. PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **vivid hand-cut tissue paper (papel picado) + photorealism** — real crisp tissue with its fine fibres and the
  slight translucency of thin paper, real kraft, real cream card stock, real terracotta, real glass bulbs; warm late
  afternoon sun from the top-left; classic, romantic, rich and joyful, a courtyard dressed for a wedding fiesta. Not
  cartoon, not flat vector, not neon, not a party-store print.
- Kâğıt kesim desenleri: çiçekler (dahlia, rose, daisy), yapraklar, sarmaşık kıvrımları, küçük kuşlar ve güvercinler,
  kalpler, tarak (scallop) kenarlar, güneş ışını desenleri — simetrik ve zarif. Yazı/harf kesilmez. Dini simge ve Ölüler
  Günü imgesi yok (yukarıda).
- Renkler (altı tissue): fuchsia `#D63A7A` · marigold `#F2A31B` · turquoise `#1C8F9C` · lime `#76A63A` · violet `#7A4FA0` ·
  coral `#E85637`; zeminler: kraft `#B78A5B` · limewash `#F5E9D8` · cream paper `#FBF4E8` · terracotta `#B0502F` · ink
  (cocoa) `#3B2418`.
- Işık: sıcak öğleden sonra güneşi, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama
  deseni değil).
- Gerçek bir mekâna, markaya, sanatçıya ya da başka bir satıcının tasarımına benzemesin. 11 Boho Pampas'tan (pampas, kuru
  ot, makrome) ve 27 Riad'dan (zellige, pirinç fener, sedir kapı) ayrı: burada makrome, pampas, zellige ve fener yok.

## Kapalı zarf geometrisi (W5–W8 buna göre)
Zarf **dikey, 0,74 en / 1 boy**, arkadan görünür. **Düz (V olmayan) kapak** üst kenarda menteşeli, zarf boyunun **%30'u**
(W6). Kapağı **kemer bant** tutar: altı bayrak (W8) zarfın enine yan yana, her biri zarf eninin 1/6'sı, bant zarf boyunun
%22–%37,4'ü (kapağın alt kenarını örter). **Mühür yok.** Açılışta bant gevşer, bayraklar tek tek uçup göğe bir süs dizisi
olur, kapak üst kenarında 3B kalkıp astarını (W7) gösterir, ampuller (W9) sırayla yanar, kart cepten (W5) yükselir.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Kraft kâğıt (zarf, program kartı)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/kraft_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of natural brown kraft paper (#B78A5B), like a sturdy recycled kraft envelope: fine visible wood fibres and tiny darker flecks, a soft matte tooth, an even warm tone with only the gentlest natural variation. Evenly lit from the top-left, no fold, no crease, no stain, no shadow, no vignette, no printing, no pattern. Calm enough for dark brown text to read on it. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); kraft kahve `#B78A5B` civarı; leke/kat yok; üstüne koyu yazı okunur.
Kullanım: `kraft-640/1024` = zarfın cebi ve kapağı (W5/W6 gelene kadar), details'te program kartı.

#### W2 Kireç badanalı duvar (sayfa zemini)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/limewash_wall.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat texture of a sunlit limewashed courtyard wall in a very pale warm cream (#F5E9D8): soft cloudy limewash brush movement, a fine sandy plaster grain, the faintest warm blush in places, very low contrast so text in any colour reads on it everywhere. Flat, evenly lit, no cracks, no stains, no shadow, no vignette, no objects, no tiles. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: çok açık, sakin (her yerde yazı okunur); dikişsiz; çatlak/leke yok.
Kullanım: `wall-640/1024` = bütün sayfaların zemini, açılış sayfası.

#### W3 Krem kart kâğıdı (kartlar, bantlar, form)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/cream_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of thick handmade cotton card stock in a warm cream (#FBF4E8): a soft felt tooth, a few faint cotton fibres, an even warm tone, calm enough for dark text everywhere. Evenly lit from the top-left, no deckle edge, no shadow, no vignette, no fold, no stain, no printing, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: sakin krem; dikişsiz; leke/baskı yok.
Kullanım: `paper-640/1024` = home kartı, davet bandı, RSVP formu, zarftan yükselen kart.

#### W4 Terrakota (home "The Day" bandı)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/terracotta.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat texture of a sun-warmed terracotta-painted plaster wall (#B0502F): a smooth hand-troweled finish with soft tonal clouds between a slightly deeper and a slightly lighter terracotta, a fine sandy grain, matte. Even, calm and dark enough for cream text to read on it everywhere. No cracks, no tiles, no stains, no shadow, no vignette, no objects. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: terrakota `#B0502F` civarı; krem yazı her yerde okunur; dikişsiz.
Kullanım: `terra-640` = home'da "Join us in / The Day" bandı; geçici kapak astarı (W7 gelene kadar).

#### W5 Zarfın cebi (arkadan, kapaksız)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_pocket.png` · 1110×1500 · **Şeffaf zemin**

```
The back of a portrait kraft paper envelope seen perfectly straight on, on a fully transparent background, the envelope filling the image edge to edge (the image IS the envelope, 0.74:1): the same kraft paper as kraft_paper.png, the two side flaps and the bottom flap folded in and glued, their soft fold lines and slightly lifted paper edges visible, the top edge straight and open (this is where the card comes out — no flap is drawn, no V shape at the top). Warm sun from the top-left, a soft natural shade along the folds. No seal, no sticker, no stamp, no string, no card inside, no cast shadow outside the envelope. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: zarf tuvali dolduruyor (0,74:1); üstte düz açık kenar, V kapak **yok**; mühür/ip yok; gerçek alfa.
Kullanım: alfa kutusuna kırpılır → `pocket-720` (geçici kraft dikdörtgenin yerine); kart bunun arkasından yükselir.

#### W6 Düz kapak (dış yüz)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_flap.png` · 1110×450 · **Şeffaf zemin**

```
The closed straight flap of the same kraft envelope as envelope_pocket.png, alone, seen straight on, on a fully transparent background, filling the image edge to edge: a wide rectangle of the same kraft paper, exactly as wide as the envelope, with softly rounded bottom corners and a straight bottom edge (NOT a V, NOT a point), the top edge a crisp fold line, a very soft shade along the bottom edge where it lies on the envelope. Warm sun from the top-left. No seal, no sticker, no string. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: dikdörtgen düz kapak, alt kenar düz (V/sivri değil); zarfla aynı kraft; alfa.
Kullanım: `flap-720` = kapalı kapak; açılışta üst kenarında 3B 180° döner.

#### W7 Kapak astarı (işlemeli kumaş)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flap_liner.png` · 1110×450 · **Şeffaf zemin**

```
The inside of the same straight envelope flap, alone, seen straight on as it stands up when the flap is open, on a fully transparent background, filling the image edge to edge, the same outline as envelope_flap.png but mirrored vertically: its BOTTOM edge is the straight fold line and its rounded corners are at the TOP. It is lined with a cream cotton fabric densely hand-embroidered with bright folk flowers, leaves and small birds in fuchsia, marigold, turquoise, lime, violet and coral satin stitch (a joyful, generic folk-floral embroidery — not a copy of any specific community's traditional design), a slim band of kraft paper showing at the edges. Warm sun from the top-left. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: alt kenar düz katlama çizgisi, yuvarlak köşeler üstte; işlemeli çiçekli kumaş astar; alfa.
Kullanım: `liner-720` = kapak açılınca (zarfın üstünde dik dururken) görünen iç yüz.

#### W8 Papel picado bayrakları — altı ayrı dosya
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_1.png`, `flag_2.png`, `flag_3.png`, `flag_4.png`, `flag_5.png`, `flag_6.png` · her biri 800×1000 · **Şeffaf zemin**

```
A single papel picado flag, alone, seen straight on, on a fully transparent background, filling the image edge to edge (0.8:1): one sheet of thin crisp tissue paper, hand-cut with an intricate symmetrical lace-like pattern — a central flower or a pair of small birds framed by leaves, vines and tiny holes — and a scalloped bottom edge; the open cut-outs are truly transparent (real alpha), the paper shows its fine fibres and a slight translucency in the warm top-left sun. Its top edge is folded over a thin natural twine that runs straight across the full width of the image at about 4% from the top, so flags placed side by side read as one garland. Flat, gently rippled, not crumpled. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Make six flags, the same size and style, different patterns: 1 = fuchsia #D63A7A, 2 = marigold #F2A31B, 3 = turquoise #1C8F9C, 4 = lime #76A63A, 5 = violet #7A4FA0, 6 = coral #E85637.)
```
Kontrol: tek bayrak, 0,8:1; kesik yerler gerçekten şeffaf; üstte tam genişlikte ip; altı dosya altı renk; yazı/dini simge yok.
Kullanım: `flag_N-200` (aynı ad geçici dikdörtgenlerin yerine) = kapalı zarfın kemer bandı (altı bayrak yan yana), açılışta
göğe uçan süs dizisi (her bayrak kendi fazında CSS dalgasıyla dalgalanır), home/story/RSVP süs dizileri, details programında
her satırın başındaki sallanan küçük bayrak, RSVP gönderilince süzülerek düşen bayraklar, basılı davetiyenin geçici süs dizisi.

#### W9 Ampul (ampul dizisi; tek sprite)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bulb.png` · 400×640 · **Şeffaf zemin**

```
A single lit festoon string-light bulb hanging straight down, alone, seen from the front, on a fully transparent background: a small black rubber socket at the top with a short stub of black cord going up to the top edge, below it a round clear glass globe bulb with a glowing warm filament (#FFC861), the glass catching a little sun from the top-left, and a soft warm glow halo around the globe that fades to full transparency well inside the image edges. Centered, not cropped. No other bulbs, no wire running sideways. No text. True transparent background PNG (real alpha channel; the glow is semi-transparent, not a solid disc).
```
Kontrol: tek ampul, üstte duy + kısa kablo; hâle yarı saydam ve kenara değmiyor; alfa.
Kullanım: `bulb-96`; `parts.css` `--pf-bulb` ile site.js'e bildirilir: açılışta süs dizisinin altında 9 ampul bir sarkık
çizgi boyunca **tek tek** yanar (1900–3000 ms), home hero'da ve imzada, RSVP kapanışında. Dosya yoksa ampul yok (çizilmiş
yedek yok).

#### W10 Kâğıt kesim foto çerçeveleri — üç ayrı dosya
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_1.png`, `frame_2.png`, `frame_3.png` · her biri 1000×1200 · **Şeffaf zemin**

```
A papel picado photo frame, alone, seen straight on, on a fully transparent background, filling the image edge to edge: one sheet of crisp hand-cut tissue paper with an intricate symmetrical cut-paper border of flowers, leaves, vines, tiny birds and scallops (the cut-outs truly transparent), its top edge folded over a short piece of natural twine with a small hanging loop at the centre, as if the frame hangs from a cord. In the middle a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 190 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window is at least 40 px wide on every side. Warm sun from the top-left, a slight translucency. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Three frames, same size and window, different patterns: 1 = fuchsia #D63A7A, 2 = turquoise #1C8F9C, 3 = marigold #F2A31B.)
```
Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 190); kesik yerler şeffaf; üstte ip ilmeği; alfa.
Kullanım: yeşil pencere ölçülür (`manifest frame_N.window_pct`) ve şeffaf yapılır → `frame_N-720`; çerçeve kutusu parçanın
oranını alır, fotoğraf ölçülen pencereye oturur (geçici tissue paspartunun yerine). 1 = home kartı + Story 1, 2 = hikâye
tanıtımı + Story 2, 3 = Story 3. Çerçeve üst kenarından asılı: sahnesine gelince düşüp sarkaç gibi sallanarak durur, sonra
esintide salınır; kaydırma hızı rüzgârı artırır.

#### W11 Geniş kâğıt kesim çerçeve (mekân fotoğrafı)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_wide.png` · 1600×1000 · **Şeffaf zemin**

```
A wide papel picado photo frame in coral tissue paper (#E85637), alone, seen straight on, on a fully transparent background, filling the image edge to edge: an intricate symmetrical cut-paper border of flowers, leaves, vines and scallops (the cut-outs truly transparent), the top edge folded over natural twine with two small hanging loops. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges). Warm sun from the top-left. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel).
```
Kontrol: pencere düz `#00FF00`, 1360×765 (16:9), sol üst (120, 150); kesik yerler şeffaf; alfa.
Kullanım: `frame_wide-1100` = details'te mekân fotoğrafının çerçevesi (pencere ölçülür; asılı, düşüp sallanır).

#### W12 Bugenvil salkımı (köşe süsü)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bougainvillea.png` · 1200×1000 · **Şeffaf zemin**

```
A lush cluster of magenta-fuchsia bougainvillea spilling diagonally from the top-left corner toward the centre, alone, on a fully transparent background: woody stems, fresh green leaves, many papery bracts in vivid fuchsia with tiny cream flowers at their hearts, a few single bracts drifting loose near the tips, photorealistic in warm top-left sun. The cluster touches the top and left edges and leaves the bottom-right third empty. No pot, no wall, no shadow, no other flower. No text. True transparent background PNG (real alpha channel).
```
Kontrol: salkım sol üst köşeden taşar; sağ alt üçte bir boş; saksı/duvar yok; alfa.
Kullanım: `bloom-720`: home kartının üst köşelerinde (sağda aynalanır, kartın %48 eni), imzada küçük.

#### W13 İşlemeli kumaş bandı (bölüm ayırıcı)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/embroidery_band.png` · 2400×160 · opak, yatay dikişsiz

```
A long horizontal strip of cream cotton fabric (#FBF4E8) hand-embroidered along its whole length with a continuous row of small bright folk flowers and leaves in fuchsia, marigold, turquoise, lime, violet and coral satin stitch, between two slim stitched lines, seen perfectly flat and straight on, filling the image edge to edge. The left and right edges must tile seamlessly when repeated side by side. Even warm light. A joyful generic folk-floral embroidery, not a copy of any specific community's traditional design. No text, letters, numbers or symbols.
```
Kontrol: yatayda dikişsiz; tek sıra çiçek; krem zemin; yazı yok.
Kullanım: `embroidery-1200`: home davet bandının üst ve alt kenarında 24 px yüksekliğinde yatay tekrar.

#### W14 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, warm late afternoon sun from the top-left: the portrait kraft envelope of envelope_pocket.png with its straight flap closed and a belly band of six papel picado flags (as flag_1–6.png) wrapped across it, lying slightly below the centre on a sunlit limewash courtyard table (as limewash_wall.png), a sprig of fuchsia bougainvillea (as bougainvillea.png) at the left, a cream card (as cream_paper.png, blank) and a small terracotta dish at the right; above, out of focus, a garland of papel picado flags and a string of glowing bulbs (as bulb.png) across a warm wall. The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no text, letters, numbers or symbols, no logos.
```
Kontrol: zarf bütün ve altta boşluklu; üst %20 sakin; yazı yok.
Kullanım: `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı: üstten ~%21 kırpılır).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, a warm sunny palette of terracotta, cream and bright fiesta colours,
subtle film grain; ONE fictional couple in their early thirties, the same two people in every photo (they must not
resemble any real person or celebrity): Valeria — long dark-brown wavy hair often worn half up with a small fuchsia
flower, warm olive-tan skin, a slim gold ring; Diego — short black hair, a neat short beard, medium-brown skin. Modern,
elegant clothing (no costume, no sombrero, no stereotype). Story photos are cropped to 4:5 in a frame: keep faces and
hands in the middle 70%. No text, no frame, no watermark, no readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Hero ve Story fotoğrafları sitede **4:5** kırpılır.

#### 2.1 Ana portre
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Valeria and Diego, in their early thirties (Valeria: long dark-brown wavy hair half up with a small fuchsia flower, warm olive-tan skin, a slim gold ring; Diego: short black hair, a neat short beard, medium-brown skin; they must not resemble any real person or celebrity) in a sunlit courtyard: she in a simple ivory gown with fine lace sleeves, he in a light sand-coloured suit with a fuchsia boutonnière, standing close and laughing, waist-up, faces in the upper middle of the frame; behind them, softly out of focus, a limewash wall with fuchsia bougainvillea and a garland of colourful papel picado flags. Photorealistic, warm sunny palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "Our first dance"
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) dancing and laughing at an open-air summer evening market, she mid-twirl with her skirt flaring, he holding her hand, warm string lights and blurred colourful paper flags overhead, other people only as soft out-of-focus shapes. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "Sunset on the river"
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5: the same couple as hero_portrait.jpg walking hand in hand along a quiet stone riverside path at golden hour, seen slightly from behind and to the side, her head turned toward him, cypress trees and a small arched stone footbridge softly in the background, warm light on the water. A generic place, not a recognisable landmark. Photorealistic, same palette and grain. No text.
```

#### 2.4 Story 3 — "Under the lights"
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, against a softly blurred background of glowing string-light bulbs and colourful papel picado flags at dusk, a few warm bokeh circles, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: a sunlit Spanish-colonial-style courtyard prepared for a wedding — limewash walls draped with fuchsia bougainvillea, terracotta floor tiles, a small stone fountain, rows of simple wooden chairs with a central aisle, and overhead criss-crossing garlands of colourful papel picado flags and festoon string lights. No people, no signs, no text, no religious objects. Photorealistic, warm late afternoon light, same palette.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, blok `'papel-picado-fiesta'`). Şu an geçici
> (`composed`): krem kâğıt + üstte temanın altı bayrağıyla sarkık bir süs dizisi (ön yüz 6 bayrak, arka yüz 4; geçici
> tissue dikdörtgenleri, W8 gelince kendiliğinden GPT bayrakları).
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** metin kutuları `layouts.ts`'teki ölçülerdir (ön `[22, 13, 12, 13]` = yükseklikte %22–%88, genişlikte
> %13–%87; arka `[15, 12, 10, 12]` = %15–%90 × %12–%88, yüzde: üst, sağ, alt, sol). Prompt'lar bu alanı ~%3 payla boş
> ister; alan aynı kalırsa kutular değişmeden kullanılır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'papel-picado-fiesta'` bloğunda `sources` → `{ front: 'print/invitation_front_5x7.png', back:
>    'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme papel-picado-fiesta` (artık kullanılmayan `paper.webp`/
>    `flagN.webp` dosyalarını `public/print/papel-picado-fiesta/`'den sil) ve `node scripts/print-sample.ts --theme
>    papel-picado-fiesta --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm cream card stock of cream_paper.png. Across the top, a garland of six small papel picado flags (as flag_1–6.png, fuchsia, marigold, turquoise, lime, violet, coral) hanging from a natural twine that sags gently from the top corners, the flags' lowest points staying above 17% of the height; a small sprig of fuchsia bougainvillea (as bougainvillea.png) tucked at the top-left corner. Along the bottom edge a slim band of the embroidered folk-flower ribbon of embroidery_band.png, about 5% of the height, staying below 92%. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flag, no petal, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; yazı yok; süs dizisi yalnız üstte, nakış bandı yalnız altta.

#### P2 — Arka yüz
**Kaydet:** `collections/38_Papel_Picado_Fiesta/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream card stock, only a short garland of four small papel picado flags (as flag_1–6.png) hanging from a twine across the top centre, their lowest points staying above 11% of the height. Everything below 13% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flag, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üstte kısa süs dizisi (%11'in üstünde); %13'ün altı boş; yazı yok.
