# GPT görsel istekleri — Tasarım 25 · Orient Express Voyage

> **Instructions for GPT:** This design ("Orient Express Voyage") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/orient-express-voyage/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/orient-express-voyage/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.

Tasarım 25 (G163, `docs/24_YENI_TASARIMLAR.md`) GPT parçaları **gelmeden** kuruldu (22 Nocturne gibi). Platform teması
`platform/themes/orient-express-voyage/` şu an her parça için **geçici düz palet tonları** kullanıyor (çizim yok, K21).
PAKET 5 dosyaları `assets/gpt/parts/` altına kaydedilince tek komut yeterli (PAKET 6 için aşağıdaki "PAKET 6 gelince"):

```bash
python3 platform/themes/orient-express-voyage/build_images.py   # parts/ → img/ + site.css stage bloğu (gelen parça kullanılır, eksikler geçici kalır)
```

`img/manifest.json` → `"interim"` hâlâ GPT bekleyen parçaları listeler. Build ölçtüğü yerleri (kayış kutusu ve toka
kesimi, bilet kutusu ve penceresi, vagon camı ve çerçeve oranı) `site.css`'teki `/* stage:begin … stage:end */` bloğuna
kendisi yazar (G167); elle yüzde eşitlemek gerekmez. Cep üst kenarı parçanın kendi alfasıdır. Sonra göz kontrolü (390 px
ekran görüntüleri). Basılı davetiye (PAKET 6) kendiliğinden geçmez: aşağıda "PAKET 6 gelince".

Prova (G167, gerçek repoya dokunmaz): `python3 tools/gpt_kuru_deneme.py --tema orient-express-voyage --sekil
collections/25_Orient_Express_Voyage/assets/gpt/kuru_sekil.json` — her istenen dosyayı doğru ölçü/alfa/#00FF00 penceresiyle
deneme görseliyle doldurup build'i koşar. `kuru_sekil.json` parçaların prompt'taki yerleridir (tuval %).

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/25_Orient_Express_Voyage/assets/gpt/` altındaki `parts/`
  (PAKET 5), `photos/` (PAKET 2), `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.

## Stil ve renk (her parça)
- Teknik: **vintage travel poster lithograph** — 1920s–30s railway poster: flat but rich colour areas, soft stone-litho
  grain, subtle registration texture, gentle gradients in the sky; objects (wallet, ticket, tag, clock) are rendered as
  **realistic luxury objects in warm, painterly light** so they read as real things on a poster-coloured world.
- Palet: bottle green `#1E3A2C` · deep green `#11241B` · soft green `#2E5240` · brass `#B8914B` · light brass `#D8BD84`
  · ivory `#F3EBD9` · paper `#ECE1C8` · route red `#8C2F39` (accent only).
- Işık: warm, soft, from the top-left; the same in every part.
- Klasik, romantik, zengin; ultra-minimal değil. Gerçek bir markaya, trene, şirkete, kişiye veya başka bir satıcının
  tasarımına benzemesin (no real railway company insignia, no real train livery, no real station).
- Yazı yok: biletin, etiketin, haritanın, saatin, damganın üstünde harf/rakam/simge YOK (isimler ve tarih sitede ayrı
  metin katmanıdır).

---

## PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).

Cüzdan parçaları (W2.1–W2.6) **aynı 1024×1536 tuvalde, aynı konumda** çizilir: cüzdan yatayda ortalı, genişliği tuvalin
~%62'si, yüksekliği ~%62'si (dik, 2:3), üst kenarı tuvalin ~%19'unda. Build her parçayı kendi alfa kutusundan kapalı
cüzdanın kutusuna oturtur; yine de aynı ölçü ve açıyla çizilmeleri gerekir.

#### W2.1 Kapalı bilet cüzdanı — kayış OLMADAN
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_closed.png` · 1024×1536 · **Şeffaf zemin**

```
A luxurious vintage first-class railway ticket wallet, closed, seen perfectly straight from the front: a tall portrait rectangle (2:3), bottle-green (#1E3A2C) fine-grain leather with softly rounded corners, a slim debossed border line running inside the edge, small polished brass corner caps on the four corners, and a narrow stitched spine visible along the LEFT edge (the cover opens from the left like a book). WITHOUT any strap or buckle — the front is clean leather. Place it horizontally centered, about 62% of the image width, top edge at about 19% of the image height. Warm painterly light from the top-left, gentle leather sheen, rendered like a realistic object in a 1930s travel-poster world. Only this one object. Not cropped, generous empty margin. No cast shadow, no drop shadow, no glow outside the outline. No text, letters, numbers, emblem or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kayış/toka yok; sırt solda; dikey 2:3; pirinç köşeler; yazı yok; gölge yok; gerçek alfa.

#### W2.2 Kayış ve pirinç toka (tek başına, cüzdanla aynı yerde)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_strap.png` · 1024×1536 · **Şeffaf zemin**

```
Only the leather strap of the same ticket wallet (give wallet_closed.png as the reference image), alone on the same canvas in exactly the place where it wraps the closed wallet: one horizontal strap of darker cognac-brown leather (#5C3A24) with fine edge stitching, about 10% of the wallet's height tall, crossing the whole width of the wallet a little below its middle (top edge at about 53% of the wallet's height), its two ends wrapping just around the left and right edges; the edge stitching is dark brown thread (not gold, not brass). On the right part of the strap, at about 62–75% of the wallet's width, a polished brass buckle with a short tongue holding the strap closed; the buckle frame is as tall as the strap or a little taller, and it is the only brass on the strap. Nothing else: no wallet behind it. Same light and perspective as wallet_closed.png. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız kayış + toka; tokanın sol kenarı net (build kayışı tokanın hemen solundan ikiye keser — kayıştaki tek
pirinç renkli şey toka olmalı; dikiş koyu kahve); cüzdan yok; alfa.

#### W2.3 Kapağın içi (açılınca soldaki yüz)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_inside_cover.png` · 1024×1536 · **Şeffaf zemin**

```
The INSIDE of the same wallet's front cover (reference: wallet_closed.png), seen straight on as it lies open to the left: the same portrait 2:3 size and position on the canvas, lined with soft deep-green suede (#11241B) with a thin brass-coloured stitched edge, the spine edge now on the RIGHT side, and a small slanted leather slip pocket in the lower half holding nothing. Same light from the top-left. No cast shadow, no glow. No text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: kapalıyla aynı ölçü; sırt sağda; boş cep; yazı yok; alfa.

#### W2.4 Cüzdanın içi — sağ panel (bilet cebinin arkası)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_inside.png` · 1024×1536 · **Şeffaf zemin**

```
The inside right panel of the same open wallet (reference: wallet_closed.png), same size and same position as the closed wallet on the canvas: deep-green suede lining (#11241B) with brass stitching along the edges, the spine edge on the LEFT. The upper half is plain empty lining (a ticket will sit there). Do NOT draw the pocket front and do not draw a ticket. Same light. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: düz astar; cep önü ve bilet yok; kapalıyla aynı ölçü; alfa.

#### W2.5 Bilet cebinin ön dudağı (tek başına)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_pocket.png` · 1024×1536 · **Şeffaf zemin**

```
Only the front lip of the ticket pocket of the same wallet, on the same canvas and in the same place as wallet_inside.png: a bottle-green leather pocket covering the LOWER 54% of the inside panel, full panel width, with a straight top edge (crisp, with a tiny stitched hem and a small half-moon thumb notch in its middle), brass stitching on its sides. Everything above its top edge is transparent. Same light. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız cep önü; üst kenar düz ve net (bilet bunun arkasından çıkar); üstü tamamen şeffaf; alfa.

#### W2.6 İstasyon zemini (zarf sayfası, telefon)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/bg_station.png` · 1024×1536 · opak

```
A vertical phone-screen background in vintage travel-poster lithograph style: a grand railway station hall at night seen from the platform, deep bottle-green shadows (#11241B), a warm brass glow from hanging lamps only along the very top edge (the top 5% of the image), faint iron arches and a sleeping carriage silhouette blurred at the far left and right edges. The whole central area (from 7% to 92% of the height, the middle 70% of the width) stays calm, dark (deep green, well below mid-grey), nearly flat with only a very fine, low-contrast grain, and EMPTY so ivory text and the ticket wallet read on it. No people, no signs, no clock face with numbers, no text.
```
Kontrol: orta (%7–92) sakin, koyu yeşil ve çok ince grenli (ivory yazı üstünde — theme-check zarf zemini ölçüsü: kenar
≤ 2,2, açık piksel ≤ %5); lamba ışığı yalnız en üst %5'te; dekor yalnız kenarlarda; yazı/tabela yok.

#### W2.7 Birinci sınıf bilet (portre penceresi #00FF00)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/ticket.png` · 1024×1536 · **Şeffaf zemin**

```
A vintage first-class railway ticket card, alone, seen straight on, portrait (about 500:760), thick ivory card stock (#F3EBD9) with a fine engraved guilloche border printed in bottle green and brass along the edges, a perforated tear-off line across the card at about 88% of its height, and slightly rounded corners. In the upper half, centered, a portrait photo window filled with flat pure green #00FF00 (no texture, no shading): window width about 46% of the card width, window height about 38% of the card height, its top at 7% of the card height, a 4:5 portrait. The lower half below the window (from 49% to 86% of the card height) is EMPTY plain ivory card for text. Centered on the canvas, about 50% of the canvas width. Same light as the wallet. No cast shadow, no glow. No text, letters, numbers, prices, serial numbers or emblems. True transparent background PNG (real alpha channel).
```
Kontrol: pencere düz #00FF00 ve 4:5; alt yarı boş fildişi (isimler + tarih oraya); delikli koçan çizgisi; yazı yok; alfa.

#### W2.8 Seyahat afişi (home hero + paylaşım görseli)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/poster_hero.png` · 1024×1536 · opak

```
A vertical vintage travel poster lithograph, 1930s style, flat rich colour areas with stone-litho grain: an elegant bottle-green and brass luxury sleeper train crossing a stone viaduct over a river valley at golden hour, cypress trees and distant mountains, a lakeside town with warm windows far below. The TOP 45% is a calm, pale golden-ivory sky with very soft gradients and nothing in it (dark green names are set there), the middle shows the viaduct and train, the bottom 25% deep green valley shadows. No people close up, no text, no letters, no numbers, no logos, no railway company insignia. Also cropped to 1200×630 for link previews from the middle: keep the train on the viaduct in the vertical middle band.
```
Kontrol: üst %45 sakin açık gökyüzü; tren viyadükte ortada; yazı/logo yok; litografi dokusu.

#### W2.9 Eski harita (rota bandı)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/map.png` · 1536×1024 · opak

```
A horizontal antique travel map in the same lithograph style: aged ivory paper (#ECE1C8) with soft folds, a fictional coastline and sea tinted soft bottle green, delicate hatched mountains, rivers, tiny town clusters drawn as dots and squares, a decorative compass rose in a corner, faint grid lines. ABSOLUTELY NO readable place names, letters, numbers or labels anywhere (no cartouche text). Leave a clear, uncluttered diagonal band from the lower-left corner to the upper-right corner (a route line will be drawn along it by the website). Muted, elegant, warm.
```
Kontrol: hiç yazı/etiket yok; sol alt → sağ üst köşegen sakin; kurgu coğrafya.

#### W2.10 Bagaj etiketi (sallanır)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/luggage_tag.png` · 1024×1536 · **Şeffaf zemin**

```
A single vintage leather-and-card luggage tag hanging straight down, seen from the front: a tall rounded-top tag of warm kraft-tan card (#C4A070) with a thin bottle-green leather edge, a brass eyelet near the top centre with a short loop of twine above it (the twine's top end is the pivot, straight above the eyelet). The whole object, twine loop included, is about 300:560 and about 80% of the image height; measured over that whole object, the card face from 36% to 90% of its height is EMPTY plain card for text. Only this object, centered. Same light. No cast shadow, no glow. No text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: düz duruyor; ip üstte ortada (dönme noktası); yüz, ip dahil nesne yüksekliğinin %36–90'ında boş; yazı yok; alfa.

#### W2.11 İstasyon saati (geri sayım)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/station_clock.png` · 1024×1024 · **Şeffaf zemin**

```
An antique brass railway station clock seen straight on, round, with an ornate polished brass bezel and a short brass bracket at the top, an ivory dial with simple bar hour marks ONLY (no numerals, no letters, no brand name), slim dark green hands showing about ten past ten. Filling about 80% of the square, centered. Same light. No cast shadow, no glow. True transparent background PNG (real alpha channel).
```
Kontrol: rakam/yazı yok; çubuk işaretler; alfa.

#### W2.12 Vagon penceresi (cam #00FF00)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/carriage_window.png` · 1024×1536 · **Şeffaf zemin**

```
A single railway carriage window frame seen straight on: a portrait polished brass window frame whose glass opening is exactly 3:4 (portrait), with softly rounded top corners and a slim lower sill, set in a narrow band of dark varnished bottle-green wood panelling around it (only a thin band, about 7% of the width), a tiny brass latch on the lower sill. The glass area is filled with flat pure green #00FF00 (no texture, no reflection, no shading). Outside the frame the image is transparent. Same light. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: cam düz #00FF00, cam açıklığı 3:4 (fotoğraflar 3:4); çerçeve ince; dışı şeffaf; alfa.

#### W2.13 Vagon ahşap paneli (dikişsiz)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/carriage_wall.png` · 1024×1024 · opak

```
A seamless tileable texture of luxury railway carriage panelling: deep bottle-green (#1E3A2C) lacquered wood with a subtle fine grain and very faint marquetry inlay lines, evenly lit, low contrast, no strong highlights, no objects. Must repeat seamlessly on all four sides. No text.
```
Kontrol: dikişsiz; düşük kontrast (üstünde fildişi yazı okunur).

#### W2.14 Litografi kâğıdı (dikişsiz sayfa zemini)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/bg_paper.png` · 1024×1024 · opak

```
A seamless tileable texture of warm ivory lithograph poster paper (#F3EBD9): very soft stone-litho grain and faint fibres, evenly lit, very low contrast, no stains, no folds, no objects. Must repeat seamlessly on all four sides. No text.
```
Kontrol: dikişsiz; çok sakin (koyu yeşil yazı okunur).

#### W2.15 Biniş kartı (RSVP formu, 3 dilim)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/boarding_pass.png` · 1024×1536 · **Şeffaf zemin**

```
A vintage railway boarding pass, portrait, seen straight on, filling about 95% of the canvas width: thick ivory card (#F3EBD9). Top 14%: a bottle-green printed header band with a fine brass guilloche edge (NO text in it). From 16% to 84% of the height: completely PLAIN, even ivory card with no marks at all, the same width from top to bottom (a form sits there and this band is repeated vertically by the website). At about 86% of the height a perforated tear-off line across the card; below it the stub with a small empty brass-printed rectangle frame. Same light. No cast shadow, no glow. No text, letters, numbers or barcodes. True transparent background PNG (real alpha channel).
```
Kontrol: orta bant (%16–84) tamamen düz ve kenarları paralel (build %16 / %45–55 / %82'den keser, orta dilim tekrarlanır);
delikli çizgi ~%86'da (kesimin altında); başlık bandı ve koçan yazısız; alfa.

#### W2.16 Biniş damgası (RSVP sonrası + favicon)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/stamp.png` · 1024×1024 · **Şeffaf zemin**

```
A single round vintage rubber-stamp impression in deep route-red ink (#8C2F39), as if pressed on paper: a double ring border with a small art deco locomotive front silhouette and two small stars in the centre, slightly uneven ink coverage and worn edges. ABSOLUTELY NO letters, words, numbers or dates in the rings. Filling about 80% of the square, slightly rotated. True transparent background PNG (real alpha channel; the paper is NOT included, only the ink).
```
Kontrol: yalnız mürekkep; harf/rakam yok; kağıt yok; alfa.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor)

Beş fotoğrafta **aynı kurgu çift**: her prompt aynı tanımı tekrarlar (GPT 2.1'i referans alır). Ünlü, model ya da
tanınmış birine benzerlik yok; yüzler sıradan ve doğal. Hepsi opak JPG.

#### 2.1 Ana portre (bilet penceresi + davet yanında)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5) · opak

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin, standing at the open door of an elegant vintage sleeper carriage on a quiet station platform at golden hour: groom in a dark bottle-green velvet suit, bride in an ivory silk gown with a short veil, close and smiling, three-quarter length, faces in the upper third. Brass handrails, warm lamp light, soft steam in the background. Bottle green, brass and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 2.2 Pencere 1 — "Where our journey began"
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_1.jpg` · Dikey (1024×1365, 3:4) · opak

```
The same fictional couple as hero_portrait.jpg (a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin), in smart travel clothes, vertical 3:4, sitting opposite each other in a vintage dining car by the window, laughing over two cups of coffee, warm table lamp, countryside blurred outside. Photorealistic, same palette and grain. No text, no logos.
```

#### 2.3 Pencere 2 — "A yes between two stations"
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_2.jpg` · Dikey (1024×1365, 3:4) · opak

```
The same fictional couple as hero_portrait.jpg (a fictional couple in their early thirties who do not resemble any real or famous person — she has shoulder-length wavy chestnut-brown hair, warm olive skin and a soft natural smile; he has short dark-brown hair, a neatly trimmed short beard and light-brown skin), in autumn coats, vertical 3:4, a proposal moment on a quiet country station platform at dusk, he on one knee, she with hands over her mouth, a vintage carriage and warm lamps behind them. Photorealistic, same palette and grain. No text, no signs.
```

#### 2.4 Pencere 3 — "Next stop: forever"
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_3.jpg` · Dikey (1024×1365, 3:4) · opak

```
Vertical 3:4 close-up of the same fictional couple's hands (her warm olive skin, his light-brown skin; no faces): her hand with a simple engagement ring resting on a vintage leather travel case, his hand gently over hers, beside two first-class tickets with blank faces (no printing), soft window light. Photorealistic, same palette and grain. No text, no numbers.
```

#### 2.5 Mekân
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 3:2) · opak

```
Landscape 3:2: a fictional grand historic station hall turned wedding venue at dusk, iron and glass atrium roof, long tables with ivory flowers and brass candle holders, a vintage bottle-green carriage parked along the platform, warm lights. No people, no signs, no text, no clock numerals. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre)

> **Neden yeniden yazıldı (2026-10-20):** website 18–19 Ekim'de fildişi kâğıt + köşe çiçekleri görünümüne geçti; eski baskı prompt'ları eski görünümü (ve artık olmayan PAKET 5 parçalarını) istiyordu. `platform/lib/print/layouts.ts` `'orient-express-voyage'` bloğunun geçici kaynakları yeniden kurulumda `img/`'den silindi: panel şu an `public/print/orient-express-voyage/`'deki eski çıktıyı (eski görünüm) basıyor ve `build-print-assets` bu tema için yeniden koşamaz. Bu zeminler gelince:
> Platform her yüz için **tek** zemin kullanır ve onu taşma payıyla `cover` olarak yayar (5×7 ve A5 aynı zeminden).
> 1. `layouts.ts` `'orient-express-voyage'` bloğunda `sources` → bu zeminler (`print/invitation_front_5x7.png` + `print/invitation_back_5x7.png`), `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Zemin artık **açık fildişi**: `ink` / `accent` koyu tonlara (temanın site metin rengi) alınır; açık mürekkep kalmaz.
> 3. Metin kutuları (`front` / `back`) gerçek görselde ölçülür (G149; süsten ~%2 açıklık), `node --test tests/g149-print-layout.test.ts`.
> 4. `cd platform && node scripts/build-print-assets.ts --theme orient-express-voyage`; `public/print/orient-express-voyage/`'deki artık kaynak olmayan eski dosyalar silinir; 5×7 ve A5 örnek PDF'ine göz atılır.
> Ek görsel (her iki yüz için sohbetin başında): `platform/themes/orient-express-voyage/img/bg_scene-1024.webp`.

#### P6.1 Ön yüz
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 px (300 ppi), opak

```
A full-bleed printable wedding invitation ground for the "Orient Express Voyage" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same deep forest green, warm parchment, champagne gold, ivory roses, delicate antique train travel map details and brass ornament, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### P6.2 Arka yüz
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 px (300 ppi), opak

```
The back side of the same "Orient Express Voyage" invitation (give invitation_front_5x7.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

---

## Kontrol (Claude, parçalar gelince) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).
1. `python3 platform/themes/orient-express-voyage/build_images.py` → `manifest.json` `"interim": []`, `checks.green` temiz
   (#00FF00 kalmadı), tema klasörü ≤ 3 MB.
2. `site.css` `/* stage:begin … stage:end */` bloğu build tarafından yazıldı mı bak (`git diff site.css`): kayış, bilet,
   bilet penceresi, vagon camı ve çerçeve oranı manifestten gelir; elle eşitleme yok.
3. `content.demo.json` (koleksiyon + tema kopyası) `media` alanları PAKET 2 fotoğraflarına bağlanabilir (Nocturne gibi tema
   içi örnek) — ya da theme-check'in PAKET 2 tohumlamasıyla yetinilir.
4. `cd platform && NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs --theme orient-express-voyage --stress
   --compare none` 0 hata; 390 px ekran görüntülerine gözle bakılır; sonra satış kararı (`coming` → `live`).

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Orient Express Voyage". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a polished mahogany carriage table with an ivory linen runner, a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, the same light and the same color world (bottle green, brass, ivory and route red). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a polished mahogany carriage table with an ivory linen runner and a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a polished mahogany carriage table with an ivory linen runner, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a polished mahogany carriage table with an ivory linen runner, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a polished mahogany carriage table with an ivory linen runner, slightly right of center and rotated about 8 degrees, surrounded at the edges by a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a bottle-green leather carriage seat with a brass reading lamp and a china teacup; a small arrangement of a bottle-green leather ticket wallet with a brass buckle, a blank ivory first-class ticket, an antique brass pocket watch, a folded antique map without lettering and a cup of tea in fine china is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: bottle green, brass, ivory and route red. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
