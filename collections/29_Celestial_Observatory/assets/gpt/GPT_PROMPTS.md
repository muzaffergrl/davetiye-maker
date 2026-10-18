# GPT görsel istekleri — Tasarım 29 · Celestial Observatory

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, zodiac glyphs,
> constellation names, degree numerals, Roman numerals, logos, monograms or watermarks in any image** (engraved tick
> marks without numbers are fine). Give W2.1 `night_sky.png`, W2.2 `chart_paper.png` and W2.3 `dome.png` as the style
> reference of every later part: the same midnight sky, the same silver-ivory paper, the same warm antique brass and
> gold leaf, the same fine engraving.

Bu dosya tasarım 29'un **bütün görsel parçalarının** tek kaynağıdır (G168). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema
(`platform/themes/celestial-observatory/`) **geçici** görsellerle çalışıyor: 06'nın düz lacivert kâğıdı gece mavisine,
18'in düz pamuk kâğıdı gümüş-fildişine tonlandı; pirinç = 17'nin altın mührünün düz metal yüzeyinden dikdörtgen kırpım
(defne yok). Kubbe şimdilik yarığın çevresinden kesilmiş pirinç bir dikdörtgen; yıldız, yıldız haritası, halka, usturlap,
ay evreleri ve yörüngeler **yok** (çizilmiş yedek yok, K21). Parçalar gelince ne değişeceği: tema README → "What waits for GPT".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/29_Celestial_Observatory/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/celestial-observatory/build_images.py` — PAKET 5'in **her parçası geldiği anda
  kendiliğinden** kullanılır (G167 düzeni): img/ yeniden üretilir, `platform/themes/celestial-observatory/parts.css` o
  parçaların kurallarıyla yazılır; gelmeyen parçanın kuralı yazılmaz, sayfa geçici görünümünde kalır (`img/manifest.json`
  → `parts.used` / `parts.waiting_for_gpt`). Sonra `python3 tools/kit_check.py collections/29_Celestial_Observatory
  --paket 2`, `python3 tools/gpt_kuru_deneme.py --tema celestial-observatory --sekil
  collections/29_Celestial_Observatory/assets/gpt/kuru_sekil.json` (prova; gerçek parçalarla da koşulabilir) ve göz
  kontrolü. PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **fine copperplate engraving + gold leaf** — antique astronomical instruments and star atlases of the 18th
  century, rendered photorealistically (real brass, real paper, real leaf); classic, romantic, rich. Not science
  fiction, not a planetarium poster, not neon: no glowing nebulae, no galaxies in colour, no lens flares, no rockets.
- Renkler: midnight `#11193A` · night `#0A0F24` · chart paper `#EEEBE3` · silver `#C9CFDC` · silver light `#E6E9F1` ·
  gold `#C8A24E` · gold light `#E2C27A` · brass `#9B7A3C` · ink `#141A33`
- Işık: yumuşak ay ışığı, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil).
- Gerçek bir gözlemevine, markaya, saat/alet üreticisine veya başka bir satıcının tasarımına benzemesin. 19 Midnight
  Garden'dan (siyah zemin, gül, mum) ve 22 Nocturne'den (göl, köşk) ayrı: burada çiçek, mum ve göl yok.

## Kapalı gözlemevi geometrisi (W2.3, W2.4, W2.11 buna göre)
Sahne **0,82 en / 1 boy** (dikey). Yarık (slit) sahnenin yüzdesiyle: sol %39, üst %4, genişlik %22, yükseklik %62 (dikey,
ortada). Claude yarığı GPT kubbesinde `#00FF00` pencereden **ölçer**; kapak (W2.4) bu kutuya gerilir ve ortasından iki
yarıya kesilir, kart (W2.11) yarıktan yükselir.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W2.1 Gece göğü (yarığın içi + sayfa zemini)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/night_sky.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat texture of a deep midnight-blue night sky (#11193A) filling the whole square edge to edge, printed like an antique engraved star atlas plate: very fine, sparse pin-point stars in silver-white of three or four sizes (about 60–90 stars in total, scattered irregularly, a few slightly brighter), a barely visible fine engraved hatching texture in a slightly lighter blue, a soft matte paper grain. Calm and even everywhere, no milky way band, no nebula, no colour other than midnight blue and silver, no constellation lines, no vignette, no gradient, no object. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#11193A` civarı; yıldızlar ince ve seyrek; çizgi/yazı yok.
Kullanım: `sky-640/1024` = yarığın içindeki gök (açılışta aydınlanır); aynı görüntü %62 parlaklıkta = sayfa zemini
`night-640` (üstünde yazı okunur). Basılı davetiyenin geçici gök şeridi.

#### W2.2 Gümüş-fildişi harita kâğıdı (kartlar, bantlar, form)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/chart_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of fine antique laid paper in a cool silver-ivory (#EEEBE3), like the paper of an old star atlas: very faint laid lines, a gentle natural tooth, a soft cool tone with the slightest warm patina, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: sakin (üstüne koyu yazı her yerde okunur); gümüş-fildişi; dikişsiz; leke/baskı yok.
Kullanım: `paper-640/1024` = home kartı, davet ve gün bantları, details program kâğıdı, RSVP formu, açılış kartı (W2.11 gelene kadar).

#### W2.3 Gözlemevi kubbesi (kapalı nesne; yarık penceresi)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/dome.png` · 1100×1340 · **Şeffaf zemin**

```
A small antique observatory seen straight from the front, as an elegant object on a fully transparent background, the object filling the image edge to edge (the image IS the object, 0.82:1): a hemispherical dome of warm antique brass (#9B7A3C) with fine engraved meridian lines and a few rows of tiny rivets, sitting on a short round drum of the same brass with a delicate engraved band of stars and a slim gold-leaf moulding. A vertical slit runs down the middle of the dome from its top to about two thirds of the object's height: the slit opening is about 22% of the image width, centred, its top at about 4% and its bottom at about 66% of the image height, and the whole opening is filled with flat pure green #00FF00 (no texture, no shading, straight vertical edges, nothing in front of it). Soft moonlight from the top-left, gentle highlights on the brass, the drum's base sitting on the bottom edge. No telescope sticking out, no stand, no stars outside the brass, no cast shadow, no background. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: nesne tuvali dolduruyor (0,82:1); yarık düz `#00FF00`, ortada, ~%22 geniş, ~%4–%66 yüksek; teleskop/zemin yok; gerçek alfa.
Kullanım: alfa kutusuna kırpılır; yeşil yarık ölçülür (`manifest dome.slit_pct`) ve şeffaf yapılır → `dome-900`
(geçici pirinç dikdörtgenin yerine). Yarığın gökyüzü, ışığı ve kapağı ölçülen kutuya oturur. Yarık bulunamazsa build
uyarır, geçici pirinç kalır. Açılışta kubbe yerinde kalır; ay ışığı üstünden geçer.

#### W2.4 Yarık kapağı (iki yarıya kesilir)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/shutter.png` · 480×1360 · **Şeffaf zemin**

```
The closed slit shutter of the same brass observatory dome as dome.png, alone, seen straight from the front, on a fully transparent background: a tall narrow vertical panel of the same warm antique brass, filling the image edge to edge (about 0.35:1), slightly curved like part of the dome, with a fine vertical centre seam where its two halves meet, a few small rivets along both long edges, delicate engraved horizontal lines, a slim gold-leaf edge. Soft moonlight from the top-left. No hinge, no handle, no shadow outside the panel. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tek dikey panel; ortada ince birleşme çizgisi; kubbeyle aynı pirinç; alfa.
Kullanım: alfa kutusuna kırpılır, ortasından ikiye kesilir → `shutter_l-240` / `shutter_r-240`; ölçülen yarığa 100% × 100%
gerilir; açılışta 450 ms'de iki yarı yana kayar (sol sola, sağ sağa).

#### W2.5 Yıldız parıltıları (yanan yıldızlar + takımyıldız) — üç ayrı dosya
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/star_1.png`, `star_2.png`, `star_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small star as on an antique engraved star atlas, alone, on a fully transparent background: a tiny bright silver-white core with fine engraved rays — not a cartoon star, not a five-pointed shape — a soft, delicate glint with a hint of warm gold at its centre, filling about 45% of the square. Centered, not cropped. No glow beyond the rays, no halo ring, no other star. No text. True transparent background PNG (real alpha channel). (Make three different stars: 1 = four long fine rays, 2 = six short rays, 3 = a small round glint with tiny rays.)
```
Kontrol: tek yıldız; üç dosya farklı; beş köşeli/çizgi film değil; gerçek alfa.
Kullanım: `star_1..3-128` (alfa kutusu, kare); `parts.css` `--co-stars` ile site.js'e bildirilir: açılışta 1100–2300 ms
arasında gözlemevinin üstünde 14 yıldız **tek tek** yanar ve hafifçe parıldar; takımyıldız çizgisi baş harflerin her
köşesine ulaştığında orada bir yıldız yanar (home imzasında da); RSVP gönderilince 6 yıldız yükselir. Dosya yoksa yıldız
yok, çizgi tek başına (çizilmiş yedek yok).

#### W2.6 Gravür yıldız haritası (dönen gök)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/star_chart.png` · 1600×1600 · **Şeffaf zemin**

```
A large circular celestial chart in the manner of an 18th-century copperplate star atlas, on a fully transparent background, filling about 92% of the square: fine silver engraved lines on transparency — concentric circles of declination, radiating hour lines, a softly drawn ecliptic band, and a few classical constellation figures (a swan, a lyre, a hunter, a bear) drawn only as delicate engraved outlines, with tiny star dots; a few thin gold-leaf accents on the outer circle. The lines are thin and pale (silver #C9CFDC, gold #C8A24E) so the chart reads as a faint pattern over a dark sky. No filled areas, no background colour, no paper. No text, letters, numbers, zodiac glyphs or constellation names. True transparent background PNG (real alpha channel).
```
Kontrol: daire; ince gümüş/altın çizgiler; dolgu/zemin yok; yazı/glif yok; alfa.
Kullanım: `chart-1000`: açılışta gökyüzünde (davet başlığının arkasında, %42 opaklık) yavaşça döner ve açılışta 14°
çevrilir; Story sayfasında sabit arka plan (%26) sayfa kaydırıldıkça döner.

#### W2.7 Planisfer halkası (yuvarlak foto çerçevesi)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/planisphere_ring.png` · 1200×1200 · **Şeffaf zemin**

```
The brass rim of an antique planisphere (rotating star finder), seen straight on, on a fully transparent background, filling the image edge to edge: a flat ring of warm antique brass about 13% of the image width thick, engraved with fine evenly spaced tick marks (no numbers), a slim inner bead and a slim outer gold-leaf edge, four tiny decorative star studs at the quarters. The round opening in the middle is a perfect circle 74% of the image width across, centred, filled with flat pure green #00FF00 (no texture, no shading). Soft moonlight from the top-left. No text, letters, numbers, month names or zodiac glyphs. True transparent background PNG (real alpha channel).
```
Kontrol: tam daire pencere, düz `#00FF00`, %74; işaretler sayısız; yazı yok; alfa.
Kullanım: yeşil pencere ölçülür (`manifest ring.window_pct`) ve şeffaf yapılır → `ring-720`; her yuvarlak fotoğrafın
(home kartı, hikâye tanıtımı, Story'nin üç anı) çevresine pencere fotoğrafa oturacak biçimde konur ve sayfa kaydırıldıkça
−70°…+70° döner. Fotoğraf yerinde kalır (kadran süpürmesiyle belirir).

#### W2.8 Pirinç usturlap (imza süsü)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/astrolabe.png` · 1000×1000 · **Şeffaf zemin**

```
An antique brass astrolabe seen straight on, on a fully transparent background, filling about 90% of the square: the round mater with a fine engraved tick ring (no numbers), an openwork rete of elegant curved brass tracery with small pointed star pointers, a slim alidade across it, a small hanging ring at the top; warm antique brass with gold-leaf highlights, soft moonlight from the top-left. No text, letters, numbers, Arabic or Latin inscriptions, zodiac glyphs. No shadow, no background. True transparent background PNG (real alpha channel).
```
Kontrol: tek usturlap; yazı/rakam yok; alfa.
Kullanım: `astrolabe-480`: home imzasının ve RSVP kapanışının üstünde (≈140 px), sayfa kaydırıldıkça yavaşça döner.

#### W2.9 Ay evreleri (başlık altı ayırıcı)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/moon_phases.png` · 1600×260 · **Şeffaf zemin**

```
A single horizontal row of seven small moon phases in fine silver engraving with a touch of gold leaf, on a fully transparent background: from left to right waxing crescent, first quarter, waxing gibbous, full moon (slightly larger, in the centre), waning gibbous, last quarter, waning crescent, evenly spaced, each moon a delicately engraved disc (the dark part only fine hatching, never solid black). Centered, not cropped, generous empty margin. No line connecting them, no stars, no text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: yedi evre tek satırda, dolunay ortada; koyu kısım tarama (siyah dolgu değil); alfa.
Kullanım: `moons-800`: harita kâğıdı üstündeki başlıkların altında (home davet ve gün, details program, RSVP formu);
sahnede başlıktan sonra soldan sağa evre evre görünür (clip-path; reduced motion'da sabit).

#### W2.10 Gezegen yörüngeleri (home kartının arkası)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/orbits.png` · 1600×1600 · **Şeffaf zemin**

```
An engraved orrery diagram on a fully transparent background, filling about 95% of the square: five or six concentric slightly elliptical orbits drawn as fine silver engraved lines, a small gold-leaf sun at the centre, and on each orbit one tiny engraved planet (one with a delicate ring), placed at different angles. Thin, pale, airy lines (silver #C9CFDC, gold #C8A24E) — a faint pattern over a dark sky. No background, no stars between the orbits, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: ince eşmerkezli yörüngeler; ortada küçük altın güneş; dolgu/yazı yok; alfa.
Kullanım: `orbits-900`: home'da kartın arkasında (%50 opaklık), 240 saniyede bir tur döner; kart ortayı örter.

#### W2.11 Yarıktan yükselen kart (boş, yuvarlak foto penceresi)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/card_small.png` · 1008×1400 · **Şeffaf zemin**

```
A flat vertical invitation card of the same silver-ivory paper as chart_paper.png, exactly 0.72:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine engraved silver border line inset from the edge and tiny engraved stars at its four corners, a very soft contact shade on the card itself. In its upper part a round portrait window, a perfect circle 62% of the card's width across, horizontally centred, its top edge at 9% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```
Kontrol: daire pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.
Kullanım: alfa kutusuna kırpılır; yeşil pencere ölçülür (`manifest card_small.window_pct`) ve şeffaf yapılır →
`card_small-860` = yarıktan yükselen kart; portre alanı ölçülen pencereye oturur, isim/tarih pencerenin altından başlar.
Pencere bulunamazsa build uyarır ve kart harita kâğıdı kalır.

#### W2.12 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft moonlight from the top-left: the small brass observatory of dome.png standing slightly below the centre on a midnight-blue velvet surface, its slit shutter half open with a sliver of starry sky inside, a brass astrolabe (as astrolabe.png) lying at the left, a rolled antique star chart and a silver-ivory card (as chart_paper.png, blank) at the right; a deep midnight sky with fine pin-point stars above (as night_sky.png). The top 20% of the image is calm, empty sky. This image is cropped to 1200×630 for link previews: keep the whole observatory visible with at least 5% empty margin below it. No people, no text, letters, numbers or symbols, no logos.
```
Kontrol: gözlemevi bütün ve altta boşluklu; üst %20 boş gök; yazı yok.
Kullanım: `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı: üstten ~%21 kırpılır).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, a calm midnight-blue, silver and warm gold palette, subtle film
grain; ONE fictional couple in their early thirties, the same two people in every photo (they must not resemble any
real person or celebrity): Celeste — long loose auburn waves, fair skin with light freckles, a slim gold ring; Rowan —
short dark-blond hair, a light stubble, olive skin. Modern, elegant clothing (no costume). Round photos are cropped from
square images: keep faces and hands in the middle 70%. No text, no frame, no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir. Story fotoğrafları sitede **yuvarlak** (1:1) kırpılır.

#### 2.1 Ana portre
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/hero_portrait.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1 wedding portrait of the fictional couple Celeste and Rowan, in their early thirties (Celeste: long loose auburn waves, fair skin with light freckles, a slim gold ring; Rowan: short dark-blond hair, a light stubble, olive skin; they must not resemble any real person or celebrity) at blue hour on a high desert ridge: she in a simple silver-ivory satin gown, he in a midnight-blue suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, the first stars appearing in a deep blue sky behind them and a small white observatory dome softly out of focus far away. Photorealistic, calm midnight, silver and gold palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "A shared telescope"
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/story_1.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) at night beside a small brass telescope on a tripod on a wooden deck, she looking through the eyepiece and laughing, he leaning in beside her pointing at the sky, a soft warm lantern light on their faces, a starry sky above. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "Night by the lake"
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/story_2.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1: the same couple as hero_portrait.jpg sitting close together on a wool blanket at the edge of a still mountain lake at night, seen from slightly behind and to the side, her head on his shoulder, the Milky Way softly reflected in the water, pine silhouettes. Photorealistic, same palette and grain. No text.
```

#### 2.4 Story 3 — "Under the dome"
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/story_3.jpg` · Kare 1280×1280 (1:1)
```
Square 1:1 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, on the brass rail of an old observatory telescope inside a wooden dome, a sliver of night sky through the open slit behind, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant garden on a pine-covered ridge at dusk with a small white historic observatory dome at one side, a lawn with a few rows of simple white chairs set for a ceremony facing a wide view of distant mountains, strings of warm small lights, the first stars in a deep blue sky. No people, no signs, no text. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, blok `'celestial-observatory'`). Şu an geçici
> (`composed`): harita kâğıdı + üstte ve altta gece göğü şeridi (temanın tonladığı dokular, ~195 ppi).
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** metin kutuları `layouts.ts`'teki ölçülerdir (ön `[21, 13, 19, 13]` = yükseklikte %21–%81, genişlikte
> %13–%87; arka `[17, 12, 10, 12]` = %17–%90 × %12–%88, yüzde: üst, sağ, alt, sol). Prompt'lar bu alanı ~%3 payla boş
> ister; alan aynı kalırsa kutular değişmeden kullanılır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'celestial-observatory'` bloğunda `sources` → `{ front: 'print/invitation_front_5x7.png', back:
>    'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme celestial-observatory` (artık kullanılmayan
>    `paper.webp`/`sky.webp` dosyalarını `public/print/celestial-observatory/`'den sil) ve `node scripts/print-sample.ts
>    --theme celestial-observatory --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the silver-ivory paper of chart_paper.png. Along the top edge a band of the midnight sky of night_sky.png about 13% of the height, with fine pin-point stars and, inside the band, a delicate engraved arc of the star chart (as star_chart.png) and a small row of seven moon phases (as moon_phases.png) centred in it; its lower edge is a slim gold-leaf rule (staying above 15% of the height). Along the bottom edge a matching midnight band about 10% of the height with a slim gold-leaf rule on its upper edge (staying below 87%). The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no star, no line, no shadow, no stain in it. No text, letters, numbers, zodiac glyphs, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı yok; gök bantları yalnız üstte ve altta.

#### P2 — Arka yüz
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same silver-ivory paper, only a narrow midnight sky band along the top edge (about 7% of the height, with fine pin-point stars and a slim gold-leaf rule on its lower edge, staying above 10% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no star, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar gök bandı (%10'un üstünde); %14'ün altı boş; yazı yok.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a midnight blue velvet cloth over an antique wooden desk and a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a midnight blue velvet cloth over an antique wooden desk, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a midnight blue velvet cloth over an antique wooden desk, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a midnight blue velvet cloth over an antique wooden desk, slightly right of center and rotated about 8 degrees, surrounded at the edges by a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a midnight blue velvet sofa with a silver cushion and a ceramic coffee cup; a small arrangement of a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
