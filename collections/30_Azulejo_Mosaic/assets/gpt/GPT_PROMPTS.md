# GPT görsel istekleri — Tasarım 30 · Azulejo Mosaic

> **Instructions for GPT:** This design ("Azulejo Mosaic") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/azulejo-mosaic/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/azulejo-mosaic/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.

Bu dosya tasarım 30'un **bütün görsel parçalarının** tek kaynağıdır (G169). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema
(`platform/themes/azulejo-mosaic/`) **geçici** parçalarla çalışıyor: çiniler 05'in boyalı çini bordüründen kesildi (sarı
göbekler terrakotaya döndürüldü, ~70 px'ten büyütüldü — yumuşak), zeminler 05'in düz badana sıvası ve 18'in düz pamuk
kâğıdı tonlanarak. Parçalar gelince ne değişeceği: tema README → "Interim build".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/30_Azulejo_Mosaic/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/azulejo-mosaic/build_images.py` — PAKET 5'in **her parçası geldiği anda
  kendiliğinden** kullanılır (G167): aynı dosya adları üretilir (sabit ölçüler), sayfalar değişmez; saksılar
  `platform/themes/azulejo-mosaic/parts.css` ile gelir (gelmezse yer boş kalır). `img/manifest.json` → `sources`,
  `parts.used` / `parts.waiting_for_gpt`. Sonra `python3 tools/kit_check.py collections/30_Azulejo_Mosaic --paket 2`,
  `python3 tools/gpt_kuru_deneme.py --tema azulejo-mosaic` (prova; gerçek parçalarla da koşulabilir) ve göz kontrolü.
  PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **hand-painted ceramic** — Portuguese-style azulejo tiles: cobalt-blue brush painting on white tin glaze,
  photographed flat, real glaze sheen and slight hand-made irregularity; quiet, classic, romantic. Not a souvenir or a
  cliché: no lemons (that is design 05), no sardines, no roosters, no trams, no flags, no lettering.
- Renkler: cobalt `#1F4A9E` · night blue `#102554` · glaze white `#FAF8F2` · whitewash `#F2EDE3` · terracotta `#AE583A`
  · deep terracotta `#8C4128`
- Işık: yumuşak, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil).
- Gerçek bir kişiye, markaya, müzeye/binaya ait belirli bir çini paneline veya başka bir satıcının tasarımına benzemesin.

## Çini paneli düzeni (W2.1–W2.4 buna göre) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).
Kapalı nesne 4 sütun × 6 satır çiniden bir panel (2:3). Köşelerde **köşe çinisi** (W2.3), kenarlarda **bordür çinisi**
(W2.2; üst kenarda olduğu gibi, sağ kenarda 90°, alt kenarda 180°, sol kenarda 270° döndürülerek), içte iki **alan
çinisi** (W2.1 ve W2.4) dama gibi sırayla ve her biri 2 × 2'lik grupta çeyrek çeyrek döndürülerek. Bu yüzden:
- Her çini **tam kare**, kenardan kenara (kenarda boşluk, gölge, derz yok), motif dört kenarda simetrik akar.
- Alan çinileri (W2.1, W2.4) **çeyrek madalyon**: motifin merkezi çininin bir köşesinde; dört kopya köşe etrafında 0°,
  90°, 180°, 270° döndürülünce büyük bir madalyon oluşur. W2.1 ve W2.4 yan yana gelince de desen sürer.
- Fotoğraf mozaiklerinde yalnız alan çinileri (W2.1/W2.4) kullanılır; tekrarda göze batan bir "tek çini" olmasın.

---

## PAKET 5 — Website katmanları (YAZI YOK) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).

#### W2.1 Alan çinisi 1 (çeyrek madalyon)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_1.png` · 1024×1024 · opak

```
One single square Portuguese-style azulejo tile, seen perfectly flat from above, filling the whole square edge to edge (the tile IS the image: no grout, no border of background, no shadow, no table): white tin glaze (#FAF8F2) hand-painted in cobalt blue (#1F4A9E) with lighter blue washes, a classic 18th-century pattern. The motif is a QUARTER of a large medallion: the medallion's centre sits exactly in the top-left corner of the tile, with curling acanthus leaves and a small flower bud spreading from that corner towards the middle, and a quarter rosette at the opposite (bottom-right) corner, so that four copies of this tile rotated 0°, 90°, 180° and 270° around a shared corner form one complete large medallion. Small terracotta-orange (#AE583A) accents only on two or three dots. Real glaze: a soft even sheen, faint crazing, slightly uneven hand-painted brush edges. Evenly lit from the top-left, no vignette. No text, letters, numbers or symbols.
```
Kontrol: tam kare, kenardan kenara; köşe merkezli çeyrek madalyon (4 kopya döndürülünce madalyon kapanıyor); kobalt +
beyaz sır; turuncu yalnız birkaç noktada; derz/gölge yok.
Kullanım: merkez kare → `tile_1-128/256`; panelin alanı (2 × 2 döndürme), fotoğraf mozaikleri, friz geçici kopyası,
basılı davetiyenin çini sırası; favicon.

#### W2.2 Bordür çinisi
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_2.png` · 1024×1024 · opak

```
One single square border tile in the same azulejo set as azulejo_1.png (same white tin glaze, same cobalt blue, same brushwork), seen perfectly flat from above, filling the whole square edge to edge: a classic running border motif — a flowing cobalt scroll of leaves and small flowers that runs horizontally from the left edge to the right edge and meets itself seamlessly when two copies are placed side by side; a narrow solid cobalt band along the TOP edge only (the outer edge of a panel), the bottom part lighter and airier. Evenly lit from the top-left, no grout, no shadow, no vignette. No text, letters, numbers or symbols.
```
Kontrol: sol ve sağ kenar yan yana dikişsiz; koyu kobalt bant yalnız üst kenarda (panelin dış kenarı); W2.1 ile aynı set.
Kullanım: `tile_2-128/256`; panelin kenarları (bant dışa bakacak şekilde döndürülür), basılı çini sırası.

#### W2.3 Köşe çinisi
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_3.png` · 1024×1024 · opak

```
One single square corner tile in the same azulejo set as azulejo_1.png and azulejo_2.png, seen perfectly flat from above, filling the whole square edge to edge: the solid cobalt band of the border tile turns the corner along the TOP edge and the LEFT edge (an L, meeting at the top-left corner), and inside it a small cobalt rosette with four leaves pointing to the corners; where the bands leave the tile on the right and at the bottom they must line up with the band of azulejo_2.png. Same white tin glaze, cobalt blue and brushwork. Evenly lit from the top-left, no grout, no shadow. No text, letters, numbers or symbols.
```
Kontrol: kobalt bant üst ve sol kenarda L; sağ ve altta W2.2 bandıyla aynı hizada biter; ortada rozet.
Kullanım: `tile_3-128/256`; panelin dört köşesi (döndürülerek).

#### W2.4 Alan çinisi 2 (çeyrek madalyon, eşi)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_4.png` · 1024×1024 · opak

```
A second field tile for the same azulejo set as azulejo_1.png, seen perfectly flat from above, filling the whole square edge to edge: also a quarter-medallion design with its centre in the top-left corner (four copies rotated around a corner form one medallion), but a different motif — a quarter of a large eight-petal flower with cobalt petals and fine blue tendrils, and a small quarter star at the bottom-right corner. Where it touches azulejo_1.png on any side the cobalt lines should flow on naturally. Same white tin glaze, cobalt blue and brushwork, two or three tiny terracotta-orange (#AE583A) dots. Evenly lit from the top-left, no grout, no shadow. No text, letters, numbers or symbols.
```
Kontrol: W2.1'den farklı ama aynı set; çeyrek madalyon; yan yana gelince çizgiler akıyor.
Kullanım: `tile_4-128/256`; alan (W2.1 ile dama), fotoğraf mozaikleri, basılı çini sırası.

#### W2.5 Çini sırtı (terrakota)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_back.png` · 1024×1024 · opak

```
The unglazed back of a handmade terracotta tile, seen perfectly flat from above, filling the whole square edge to edge: warm terracotta clay (#AE583A) with natural darker and lighter firing variations, a fine sandy texture, a few small pits and faint finger marks of the maker, slightly paler near the edges. Evenly lit from the top-left, no shadow, no vignette, no glaze, no pattern, no stamp, no text, letters or numbers.
```
Kontrol: düz terrakota, sır yok, desen/damga/yazı yok; kenardan kenara.
Kullanım: `tile_back-256` = her çininin arka yüzü (açılışta ve mozaiklerde dönen çininin gösterdiği yüz).

#### W2.6 Kobalt duvar (açılış sayfası + koyu bantlar)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/cobalt_wall.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of a lime-plastered wall washed in deep night-cobalt blue (#102554): soft uneven limewash, gentle brush strokes and faint mottling a little lighter than the base, a fine matte plaster grain; calm enough for white text to read on it everywhere. Evenly lit, no shadow, no vignette, no crack, no tile, no object, no pattern. The left/right and top/bottom edges must tile without a visible seam. No text, letters or symbols.
```
Kontrol: dikişsiz (2×2 konunca ek yeri yok); koyu kobalt; sakin (beyaz yazı her yerde okunur); desen yok.
Kullanım: `wall-640` — açılış sayfası, home'un kart bölümü ve "The Day" bandı; og montajı.

#### W2.7 Badana sıva (açık sayfalar)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/lime_wash.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of a sunlit whitewashed lime plaster wall in warm white (#F2EDE3): very soft uneven brush strokes of limewash, a fine chalky grain, the faintest warm patches; calm enough for dark blue text to read on it everywhere. Evenly lit, no shadow, no vignette, no crack, no stain, no object, no pattern. Edges tile without a seam. No text, letters or symbols.
```
Kontrol: sakin, sıcak beyaz; dikişsiz; leke/çatlak yok.
Kullanım: `lime-640` — sayfa zemini (davet, hikâye, detaylar, RSVP); foto yer tutucuları bundan bulanıklaştırılır.

#### W2.8 Kart kâğıdı (çinilerin arkasındaki kart, program ve yanıt kartı)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/card_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of heavy cotton invitation paper in glaze white (#FAF8F2): a soft felt grain, a very gentle cool-warm unevenness, calm enough for dark text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no deckle, no stain, no pattern. Edges tile without a seam. No text, letters or symbols.
```
Kontrol: sakin, beyaz; dikişsiz.
Kullanım: `card-640` — çinilerin ardındaki kart, home kartı, program kartı, RSVP kartı.

#### W2.9 Çini frizi (bölüm ayracı)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/frieze.png` · 2048×512 · opak, yatay dikişsiz

```
A straight horizontal row of exactly four square azulejo border tiles from the same set as azulejo_2.png, seen perfectly flat, filling the 4:1 image edge to edge: the tiles touch with only a hair-thin natural joint, the cobalt scroll runs continuously through all four, a narrow solid cobalt band along the top and along the bottom edge, white tin glaze, cobalt blue brushwork. The left edge must join the right edge seamlessly when the row is repeated. Evenly lit, no shadow, no background. No text, letters, numbers or symbols.
```
Kontrol: 4:1, dört kare çini; sol–sağ kenar tekrar edince dikişsiz; üst ve altta kobalt bant.
Kullanım: 192 px yüksekliğe ölçeklenir, ilk 768 px → `frieze-768` (bölümler arası ince friz, yatay tekrar). Gelmezse
dört çini yan yana konur (geçici).

#### W2.10 Terrakota saksılar (açılış duvarının ve home kartının dibinde) — iki dosya
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/pot_left.png` ve `pot_right.png` · her biri 1024×1280 · **Şeffaf zemin**

```
A single classic terracotta flower pot, photorealistic, seen slightly from the front, standing on nothing, on a fully transparent background: a round hand-thrown pot with a rolled rim in warm terracotta (#AE583A) with natural firing variations, planted with trailing green ivy and small white jasmine flowers that spill over the rim towards the inner side; soft light from the top-left, the pot's own shading only. Centered at the bottom of the image, the pot's base touching the bottom edge, generous empty margin above. No lemons, no citrus, no other fruit, no shadow on the ground, no saucer, no text. True transparent background PNG (real alpha channel — not white, not a checkerboard). (pot_left.png: the ivy spills to the RIGHT; pot_right.png: a second, slightly different pot whose ivy spills to the LEFT.)
```
Kontrol: tek saksı, alfa; limon/meyve yok; zemin gölgesi yok; sarmaşık iç tarafa sarkıyor; taban alt kenarda.
Kullanım: alfa kutusuna kırpılır → `pot_l-480`, `pot_r-480` + `parts.css`: açılış sayfasında ve home kartının altında
sol/sağ alt köşede (en ≈ %24 ekran, 150 px'e kadar). Dosya yoksa saksı yok (yedek çizilmez).

#### W2.11 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal photorealistic still life, soft light from the top-left: a panel of blue-and-white azulejo tiles (the set of azulejo_1.png to azulejo_4.png: corner tiles, a border all round, quarter-medallion field tiles) set into a deep cobalt limewashed wall (as cobalt_wall.png), slightly below the centre; two or three tiles near one corner are half-turned in mid-air showing their terracotta backs (as tile_back.png); a terracotta pot with trailing ivy and white jasmine (as pot_left.png) standing at the lower left. The top 20% of the image is calm, empty wall. This image is cropped to 1200×630 for link previews: keep the whole tile panel visible with at least 5% empty margin below it. No people, no lemons, no text, letters or numbers.
```
Kontrol: panel bütün ve altta boşluklu; üst %20 boş; limon/yazı yok.
Kullanım: `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor)

Ortak: photorealistic fine-art wedding photography, soft natural light, a calm cobalt, white and warm terracotta
palette, subtle film grain; ONE fictional couple in their early thirties, the same two people in every photo (they must
not resemble any real person or celebrity): Inês — long dark-brown wavy hair worn half up, olive skin, brown eyes, a
slim gold ring; Mateo — short dark hair, a neat trimmed beard, light-tan skin. Modern, elegant clothing (no costume,
no folk dress). No text, no readable signs, no frame, no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir.

#### 2.1 Ana portre
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Inês and Mateo, in their early thirties (Inês: long dark-brown wavy hair worn half up, olive skin, brown eyes, a slim gold ring; Mateo: short dark hair, a neat trimmed beard, light-tan skin; they must not resemble any real person or celebrity) in a sunlit courtyard: she in a simple ivory crepe gown, he in a navy-blue suit, standing close and smiling at each other in front of a wall of blue-and-white hand-painted tiles, terracotta pots with trailing ivy beside them, three-quarter length, faces in the upper third, soft late-afternoon light from the left. Photorealistic, calm cobalt, white and terracotta palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "A rainy afternoon"
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing at a small table by the window of a cosy café on a rainy afternoon, two coffee cups, raindrops on the glass, blue-and-white tiles on the café wall softly out of focus, warm light inside. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "The tram up the hill"
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_2.jpg` · Yatay 1280×1024 (5:4)
```
Landscape 5:4: the same couple as hero_portrait.jpg on a steep old cobbled street of a hilly seaside town at golden hour, walking up hand in hand beside a vintage yellow tram (no numbers, no lettering on it), whitewashed houses with tiled façades and terracotta roofs behind, the sea far below. Seen from slightly behind and to the side. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.4 Story 3 — "Our promise"
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, on a sunlit stone balustrade with a blue-and-white tile set into it and the sea softly out of focus behind, soft light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant old Portuguese country estate (a fictional quinta) in early summer: a whitewashed courtyard with blue-and-white tile panels on its walls, a stone arcade, terracotta pots with ivy and white jasmine, a long table set for dinner under string lights, wooded hills behind, soft late-afternoon light. No people, no signs, no text. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre)

> **Neden yeniden yazıldı (2026-10-20):** website 18–19 Ekim'de fildişi kâğıt + köşe çiçekleri görünümüne geçti; eski baskı prompt'ları eski görünümü (ve artık olmayan PAKET 5 parçalarını) istiyordu. `platform/lib/print/layouts.ts` `'azulejo-mosaic'` bloğunun geçici kaynakları yeniden kurulumda `img/`'den silindi: panel şu an `public/print/azulejo-mosaic/`'deki eski çıktıyı (eski görünüm) basıyor ve `build-print-assets` bu tema için yeniden koşamaz. Bu zeminler gelince:
> Platform her yüz için **tek** zemin kullanır ve onu taşma payıyla `cover` olarak yayar (5×7 ve A5 aynı zeminden).
> 1. `layouts.ts` `'azulejo-mosaic'` bloğunda `sources` → bu zeminler (`print/invitation_front.png` + `print/invitation_back.png`), `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Zemin artık **açık fildişi**: `ink` / `accent` koyu tonlara (temanın site metin rengi) alınır; açık mürekkep kalmaz.
> 3. Metin kutuları (`front` / `back`) gerçek görselde ölçülür (G149; süsten ~%2 açıklık), `node --test tests/g149-print-layout.test.ts`.
> 4. `cd platform && node scripts/build-print-assets.ts --theme azulejo-mosaic`; `public/print/azulejo-mosaic/`'deki artık kaynak olmayan eski dosyalar silinir; 5×7 ve A5 örnek PDF'ine göz atılır.
> Ek görsel (her iki yüz için sohbetin başında): `platform/themes/azulejo-mosaic/img/bg_scene-1024.webp`.

#### P6.1 Ön yüz
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_front.png` · 1819×2551 px (300 ppi), opak

```
A full-bleed printable wedding invitation ground for the "Azulejo Mosaic" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same cream plaster, cobalt blue and antique gold, Portuguese azulejo ceramic corner flourishes, white roses and olive branches, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```
Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1819×2551.

#### P6.2 Arka yüz
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_back.png` · 1819×2551 px (300 ppi), opak

```
The back side of the same "Azulejo Mosaic" invitation (give invitation_front.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1819×2551.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Azulejo Mosaic". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sunlit whitewashed table with an edge of terracotta tiles, a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, the same light and the same color world (cobalt, night blue, whitewash and terracotta). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a sunlit whitewashed table with an edge of terracotta tiles and a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a sunlit whitewashed table with an edge of terracotta tiles, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a sunlit whitewashed table with an edge of terracotta tiles, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a sunlit whitewashed table with an edge of terracotta tiles, slightly right of center and rotated about 8 degrees, surrounded at the edges by a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/30_Azulejo_Mosaic/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a whitewashed bench with cobalt-and-white cushions and a terracotta cup; a small arrangement of a few hand-painted blue-and-white azulejo tiles, a small terracotta jug of white jasmine, a linen napkin with a cobalt stripe and a thin cobalt ribbon is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: cobalt, night blue, whitewash and terracotta. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
