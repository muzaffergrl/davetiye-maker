# GPT görsel istekleri — Tasarım 25 · Orient Express Voyage

> **Instructions for GPT:** Generate PAKET 5 (website parts) first, in order and in ONE chat, so every part shares the
> same lithograph style, palette and light; then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each
> English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown
> under "Kaydet". **No text, letters, numbers, logos, monograms, brand names or watermarks in any image** — not on the
> ticket, the tag, the clock, the map, the stamp or the poster. Generate W2.1 (the closed wallet) first and give it as
> the reference image of every wallet part (W2.2–W2.6) and of the ticket (W2.7).

Tasarım 25 (G163, `docs/24_YENI_TASARIMLAR.md`) GPT parçaları **gelmeden** kuruldu (22 Nocturne gibi). Platform teması
`platform/themes/orient-express-voyage/` şu an her parça için **geçici düz palet tonları** kullanıyor (çizim yok, K21).
Aşağıdaki dosyalar `assets/gpt/` altına kaydedilince tek komut yeterli:

```bash
python3 platform/themes/orient-express-voyage/build_images.py          # parts/ → img/ (gelen parça kullanılır, eksikler geçici kalır)
node platform/scripts/build-print-assets.ts --theme orient-express-voyage   # (platform/ içinden) basılı davetiye
```

`img/manifest.json` → `"interim"` hâlâ GPT bekleyen parçaları listeler. Parçalar gelince göz kontrolü (390 px ekran
görüntüleri) ve `site.css`'teki `/* manifest stage.* */` yüzdelerinin manifestle eşitlenmesi gerekir (kayış kutusu,
cep üst kenarı, bilet penceresi, vagon camı).

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

## PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)

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
Only the leather strap of the same ticket wallet (give wallet_closed.png as the reference image), alone on the same canvas in exactly the place where it wraps the closed wallet: one horizontal strap of darker cognac-brown leather (#5C3A24) with fine edge stitching, about 10% of the wallet's height tall, crossing the whole width of the wallet a little below its middle (top edge at about 53% of the wallet's height), its two ends wrapping just around the left and right edges. On the right part of the strap, at about 62–75% of the wallet's width, a polished brass buckle with a short tongue holding the strap closed. Nothing else: no wallet behind it. Same light and perspective as wallet_closed.png. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız kayış + toka; tokanın sol kenarı net (build kayışı tokanın hemen solundan ikiye keser); cüzdan yok; alfa.

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
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/bg_station.png` · 1024×1536

```
A vertical phone-screen background in vintage travel-poster lithograph style: a grand railway station hall at night seen from the platform, deep bottle-green shadows (#11241B), a warm brass glow from hanging lamps at the top edge, faint iron arches and a sleeping carriage silhouette blurred at the far left and right edges. The whole central area (from 10% to 85% of the height, 70% of the width) stays calm, dark, nearly flat green and EMPTY so ivory text and the ticket wallet read on it. No people, no signs, no clock face with numbers, no text.
```
Kontrol: orta sakin ve koyu yeşil; dekor yalnız kenarlarda; yazı/tabela yok.

#### W2.7 Birinci sınıf bilet (portre penceresi #00FF00)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/ticket.png` · 1024×1536 · **Şeffaf zemin**

```
A vintage first-class railway ticket card, alone, seen straight on, portrait (about 500:760), thick ivory card stock (#F3EBD9) with a fine engraved guilloche border printed in bottle green and brass along the edges, a perforated tear-off line across the card at about 88% of its height, and slightly rounded corners. In the upper half, centered, a portrait photo window filled with flat pure green #00FF00 (no texture, no shading): window width about 46% of the card width, window height about 38% of the card height, its top at 7% of the card height, a 4:5 portrait. The lower half below the window (from 49% to 86% of the card height) is EMPTY plain ivory card for text. Centered on the canvas, about 50% of the canvas width. Same light as the wallet. No cast shadow, no glow. No text, letters, numbers, prices, serial numbers or emblems. True transparent background PNG (real alpha channel).
```
Kontrol: pencere düz #00FF00 ve 4:5; alt yarı boş fildişi (isimler + tarih oraya); delikli koçan çizgisi; yazı yok; alfa.

#### W2.8 Seyahat afişi (home hero + paylaşım görseli)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/poster_hero.png` · 1024×1536

```
A vertical vintage travel poster lithograph, 1930s style, flat rich colour areas with stone-litho grain: an elegant bottle-green and brass luxury sleeper train crossing a stone viaduct over a river valley at golden hour, cypress trees and distant mountains, a lakeside town with warm windows far below. The TOP 45% is a calm, pale golden-ivory sky with very soft gradients and nothing in it (dark green names are set there), the middle shows the viaduct and train, the bottom 25% deep green valley shadows. No people close up, no text, no letters, no numbers, no logos, no railway company insignia. Also cropped to 1200×630 for link previews from the middle: keep the train on the viaduct in the vertical middle band.
```
Kontrol: üst %45 sakin açık gökyüzü; tren viyadükte ortada; yazı/logo yok; litografi dokusu.

#### W2.9 Eski harita (rota bandı)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/map.png` · 1536×1024

```
A horizontal antique travel map in the same lithograph style: aged ivory paper (#ECE1C8) with soft folds, a fictional coastline and sea tinted soft bottle green, delicate hatched mountains, rivers, tiny town clusters drawn as dots and squares, a decorative compass rose in a corner, faint grid lines. ABSOLUTELY NO readable place names, letters, numbers or labels anywhere (no cartouche text). Leave a clear, uncluttered diagonal band from the lower-left corner to the upper-right corner (a route line will be drawn along it by the website). Muted, elegant, warm.
```
Kontrol: hiç yazı/etiket yok; sol alt → sağ üst köşegen sakin; kurgu coğrafya.

#### W2.10 Bagaj etiketi (sallanır)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/luggage_tag.png` · 1024×1536 · **Şeffaf zemin**

```
A single vintage leather-and-card luggage tag hanging straight down, seen from the front: a tall rounded-top tag (about 300:560) of warm kraft-tan card (#C4A070) with a thin bottle-green leather edge, a brass eyelet near the top centre with a short loop of twine above it (the twine's top end is the pivot), and an EMPTY plain card face below the eyelet (from 36% to 90% of the tag height) for text. Only this object, centered. Same light. No cast shadow, no glow. No text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: düz duruyor; ip üstte ortada; yüz boş; yazı yok; alfa.

#### W2.11 İstasyon saati (geri sayım)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/station_clock.png` · 1024×1024 · **Şeffaf zemin**

```
An antique brass railway station clock seen straight on, round, with an ornate polished brass bezel and a short brass bracket at the top, an ivory dial with simple bar hour marks ONLY (no numerals, no letters, no brand name), slim dark green hands showing about ten past ten. Filling about 80% of the square, centered. Same light. No cast shadow, no glow. True transparent background PNG (real alpha channel).
```
Kontrol: rakam/yazı yok; çubuk işaretler; alfa.

#### W2.12 Vagon penceresi (cam #00FF00)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/carriage_window.png` · 1024×1536 · **Şeffaf zemin**

```
A single railway carriage window frame seen straight on: a portrait 3:4 polished brass window frame with softly rounded top corners and a slim lower sill, set in a narrow band of dark varnished bottle-green wood panelling around it (only a thin band, about 7% of the width), a tiny brass latch on the lower sill. The glass area is filled with flat pure green #00FF00 (no texture, no reflection, no shading). Outside the frame the image is transparent. Same light. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: cam düz #00FF00, 3:4; çerçeve ince; dışı şeffaf; alfa.

#### W2.13 Vagon ahşap paneli (dikişsiz)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/carriage_wall.png` · 1024×1024

```
A seamless tileable texture of luxury railway carriage panelling: deep bottle-green (#1E3A2C) lacquered wood with a subtle fine grain and very faint marquetry inlay lines, evenly lit, low contrast, no strong highlights, no objects. Must repeat seamlessly on all four sides. No text.
```
Kontrol: dikişsiz; düşük kontrast (üstünde fildişi yazı okunur).

#### W2.14 Litografi kâğıdı (dikişsiz sayfa zemini)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/bg_paper.png` · 1024×1024

```
A seamless tileable texture of warm ivory lithograph poster paper (#F3EBD9): very soft stone-litho grain and faint fibres, evenly lit, very low contrast, no stains, no folds, no objects. Must repeat seamlessly on all four sides. No text.
```
Kontrol: dikişsiz; çok sakin (koyu yeşil yazı okunur).

#### W2.15 Biniş kartı (RSVP formu, 3 dilim)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/boarding_pass.png` · 1024×1536 · **Şeffaf zemin**

```
A vintage railway boarding pass, portrait, seen straight on, filling about 95% of the canvas width: thick ivory card (#F3EBD9). Top 14%: a bottle-green printed header band with a fine brass guilloche edge (NO text in it). From 16% to 82% of the height: completely PLAIN, even ivory card with no marks at all (a form sits there and this band is repeated vertically by the website). From 82% down: a tear-off stub separated by a perforated line, with a small empty brass-printed rectangle frame. Same light. No cast shadow, no glow. No text, letters, numbers or barcodes. True transparent background PNG (real alpha channel).
```
Kontrol: orta bant tamamen düz (tekrarlanır); başlık bandı ve koçan yazısız; alfa.

#### W2.16 Biniş damgası (RSVP sonrası + favicon)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/parts/stamp.png` · 1024×1024 · **Şeffaf zemin**

```
A single round vintage rubber-stamp impression in deep route-red ink (#8C2F39), as if pressed on paper: a double ring border with a small art deco locomotive front silhouette and two small stars in the centre, slightly uneven ink coverage and worn edges. ABSOLUTELY NO letters, words, numbers or dates in the rings. Filling about 80% of the square, slightly rotated. True transparent background PNG (real alpha channel; the paper is NOT included, only the ink).
```
Kontrol: yalnız mürekkep; harf/rakam yok; kağıt yok; alfa.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin)

#### 2.1 Ana portre (bilet penceresi + davet yanında)
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties who do not resemble any real person, standing at the open door of an elegant vintage sleeper carriage on a quiet station platform at golden hour: groom in a dark bottle-green velvet suit, bride in an ivory silk gown with a short veil, close and smiling, three-quarter length, faces in the upper third. Brass handrails, warm lamp light, soft steam in the background. Bottle green, brass and ivory palette, subtle film grain. No text, no signs, no logos.
```

#### 2.2 Pencere 1 — "Where our journey began"
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_1.jpg` · Dikey (1024×1365, 3:4)

```
The same fictional couple, vertical 3:4, sitting opposite each other in a vintage dining car by the window, laughing over two cups of coffee, warm table lamp, countryside blurred outside. Photorealistic, same palette and grain. No text, no logos.
```

#### 2.3 Pencere 2 — "A yes between two stations"
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_2.jpg` · Dikey (1024×1365, 3:4)

```
The same fictional couple, vertical 3:4, a proposal moment on a quiet country station platform at dusk, he on one knee, she with hands over her mouth, a vintage carriage and warm lamps behind them. Photorealistic, same palette and grain. No text, no signs.
```

#### 2.4 Pencere 3 — "Next stop: forever"
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_3.jpg` · Dikey (1024×1365, 3:4)

```
Vertical 3:4 close-up: the couple's hands with an engagement ring resting on a vintage leather travel case beside two first-class tickets with blank faces (no printing), soft window light. Photorealistic, same palette and grain. No text, no numbers.
```

#### 2.5 Mekân
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 3:2)

```
Landscape 3:2: a fictional grand historic station hall turned wedding venue at dusk, iron and glass atrium roof, long tables with ivory flowers and brass candle holders, a vintage bottle-green carriage parked along the platform, warm lights. No people, no signs, no text, no clock numerals. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, yazı yok)

> Şu an basılı davetiye `platform/lib/print/layouts.ts` → `orient-express-voyage` **composed** düzeninde: ön yüz temanın
> afiş görseli (geçici ton), arka yüz fildişi + damga. Aşağıdaki zeminler gelince layouts.ts'te `sources`
> `print/invitation_front*.png` / `print/invitation_back*.png` olur (`paper: { mode: 'cover' }`, metin kutusu: ön
> `[44, 12, 8, 12]` alt boş alan, arka `[18, 12, 10, 12]`) ve `node scripts/build-print-assets.ts --theme
> orient-express-voyage` çalıştırılır. 5×7 in + 0,125 in taşma = **1575 × 2175 px**; A5 + 3 mm taşma (154 × 216 mm) =
> **1819 × 2551 px**; ikisi de 300 ppi. Kenardan 0,25 in (A5: 6 mm) içeride önemli öğe yok.

#### P6.1 Ön yüz 5×7
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak

```
Print-ready front of a wedding invitation, portrait 5×7 inches with bleed, 300 ppi, in the same 1930s travel-poster lithograph style as poster_hero.png: the bottle-green and brass sleeper train crossing the stone viaduct at golden hour fills the UPPER 42% of the card; below it the card fades into calm, plain, pale golden-ivory poster paper (#F3EBD9) with soft litho grain that stays EMPTY from 44% to 92% of the height for dark green text (names, date, venue). A slim brass art deco border line 0.3 inch inside the trim edge. No text, letters, numbers, logos. Sharp print detail.
```
Kontrol: alt %48 boş ve sakin; ince pirinç çerçeve kesimden içeride; yazı yok.

#### P6.2 Arka yüz 5×7
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak

```
Print-ready back of the same invitation, portrait 5×7 inches with bleed, 300 ppi: the antique map from map.png faintly printed (about 15% strength) over plain ivory lithograph paper (#F3EBD9), with a small brass luggage-tag illustration hanging at the top centre (empty face) and the same slim brass border line. Everything from 18% to 90% of the height stays calm and readable for a schedule and a QR code. No readable place names, no text, letters or numbers.
```
Kontrol: harita çok soluk; orta alan okunur; yazı yok.

#### P6.3 Ön yüz A5
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_front_a5.png` · 1819×2551 · opak

```
The same design as invitation_front_5x7.png re-composed for A5 with 3 mm bleed (154 × 216 mm, 300 ppi): train and viaduct in the upper 42%, plain pale golden-ivory paper EMPTY from 44% to 92% of the height, slim brass border 6 mm inside the trim. No text, letters, numbers, logos.
```

#### P6.4 Arka yüz A5
**Kaydet:** `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_back_a5.png` · 1819×2551 · opak

```
The same design as invitation_back_5x7.png re-composed for A5 with 3 mm bleed (154 × 216 mm, 300 ppi): faint antique map over ivory paper, small empty brass luggage tag at the top centre, slim brass border 6 mm inside the trim, calm readable area from 18% to 90% of the height. No readable names, text, letters or numbers.
```

---

## Kontrol (Claude, parçalar gelince)
1. `python3 platform/themes/orient-express-voyage/build_images.py` → `manifest.json` `"interim": []`, `checks.green` temiz
   (#00FF00 kalmadı), tema klasörü ≤ 3 MB.
2. `site.css`: `.strap-l/.strap-r` (manifest `stage.strap`), `.w-pocket` üst kenarı (`stage.pocket.top_pct`), `.ticket-photo`
   (`stage.ticket.window_pct`), `.glass` (`window.glass_pct`) manifestle eşitlenir.
3. `content.demo.json` (koleksiyon + tema kopyası) `media` alanları PAKET 2 fotoğraflarına bağlanabilir (Nocturne gibi tema
   içi örnek) — ya da theme-check'in PAKET 2 tohumlamasıyla yetinilir.
4. `cd platform && NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs --theme orient-express-voyage --stress
   --compare none` 0 hata; 390 px ekran görüntülerine gözle bakılır; sonra satış kararı (`coming` → `live`).
