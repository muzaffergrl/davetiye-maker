# GPT görsel istekleri — Tasarım 29 · Celestial Observatory

> **Instructions for GPT:** This design ("Celestial Observatory") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/celestial-observatory/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/celestial-observatory/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.

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

## Kapalı gözlemevi geometrisi (W2.3, W2.4, W2.11 buna göre) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).
Sahne **0,82 en / 1 boy** (dikey). Yarık (slit) sahnenin yüzdesiyle: sol %39, üst %4, genişlik %22, yükseklik %62 (dikey,
ortada). Claude yarığı GPT kubbesinde `#00FF00` pencereden **ölçer**; kapak (W2.4) bu kutuya gerilir ve ortasından iki
yarıya kesilir, kart (W2.11) yarıktan yükselir.

---

## PAKET 5 — Website katmanları (YAZI YOK) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).

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

## PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor)

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

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre)

> **Neden yeniden yazıldı (2026-10-20):** website 18–19 Ekim'de fildişi kâğıt + köşe çiçekleri görünümüne geçti; eski baskı prompt'ları eski görünümü (ve artık olmayan PAKET 5 parçalarını) istiyordu. `platform/lib/print/layouts.ts` `'celestial-observatory'` bloğunun geçici kaynakları yeniden kurulumda `img/`'den silindi: panel şu an `public/print/celestial-observatory/`'deki eski çıktıyı (eski görünüm) basıyor ve `build-print-assets` bu tema için yeniden koşamaz. Bu zeminler gelince:
> Platform her yüz için **tek** zemin kullanır ve onu taşma payıyla `cover` olarak yayar (5×7 ve A5 aynı zeminden).
> 1. `layouts.ts` `'celestial-observatory'` bloğunda `sources` → bu zeminler (`print/invitation_front_5x7.png` + `print/invitation_back_5x7.png`), `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Zemin artık **açık fildişi**: `ink` / `accent` koyu tonlara (temanın site metin rengi) alınır; açık mürekkep kalmaz.
> 3. Metin kutuları (`front` / `back`) gerçek görselde ölçülür (G149; süsten ~%2 açıklık), `node --test tests/g149-print-layout.test.ts`.
> 4. `cd platform && node scripts/build-print-assets.ts --theme celestial-observatory`; `public/print/celestial-observatory/`'deki artık kaynak olmayan eski dosyalar silinir; 5×7 ve A5 örnek PDF'ine göz atılır.
> Ek görsel (her iki yüz için sohbetin başında): `platform/themes/celestial-observatory/img/bg_scene-1024.webp`.

#### P6.1 Ön yüz
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 px (300 ppi), opak

```
A full-bleed printable wedding invitation ground for the "Celestial Observatory" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same midnight navy, champagne gold and warm ivory, tiny restrained constellations, roses, antique celestial engravings, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### P6.2 Arka yüz
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 px (300 ppi), opak

```
The back side of the same "Celestial Observatory" invitation (give invitation_front_5x7.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

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

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 29`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Celestial Observatory". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, the same light and the same color world (midnight blue, silver, brass, gold and ivory). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a midnight blue velvet cloth over an antique wooden desk, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a midnight blue velvet cloth over an antique wooden desk, a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a small antique brass telescope, an old star chart without lettering. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a midnight blue velvet cloth over an antique wooden desk, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a midnight blue velvet cloth over an antique wooden desk, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a midnight blue velvet cloth over an antique wooden desk: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a midnight blue velvet cloth over an antique wooden desk: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a midnight blue velvet cloth over an antique wooden desk, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a small antique brass telescope, an old star chart without lettering; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a midnight blue velvet cloth over an antique wooden desk, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/29_Celestial_Observatory/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a midnight blue velvet cloth over an antique wooden desk: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a small antique brass telescope, an old star chart without lettering, a brass compass, a few tiny gold star confetti and a silver-ivory ribbon. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: midnight blue, silver, brass, gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
