# GPT görsel istekleri — Tasarım 24 · Grand Theatre Premiere

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation grounds). Use each English prompt exactly as written, follow its
> checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers,
> logos, monograms, signatures or watermarks in any image. W2.1 `proscenium.png` is the style reference of every later
> part: give it as the reference image each time (same antique gold, same peacock velvet, same light).

Bu dosya 24 Grand Theatre Premiere'in **bütün görsel parçalarının** tek kaynağıdır (G162, `docs/24_YENI_TASARIMLAR.md`).
Tasarım `tools/katalog.py`'de `EK_TEMALAR` satırıyla kayıtlı (D'ye girmedi), bu yüzden dosya elle yazıldı. Tema
(`platform/themes/grand-theatre-premiere/`) şu an **geçici** parçalarla çalışıyor: 06'nın kadife dokusu tavus mavisine
tonlanmış perde kanatları, 21'in fildişi kâğıdı program kartı (tema README "Interim pieces"). Aşağıdakiler gelince
`build_images.py` bunlara geçer.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/24_Grand_Theatre_Premiere/assets/gpt/` altındaki `parts/`
  (PAKET 5), `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Gelince (Claude): `python3 tools/kit_check.py collections/24_Grand_Theatre_Premiere --paket 5` ve `--paket 2`, sonra
  `python3 platform/themes/grand-theatre-premiere/build_images.py` ve `cd platform && node scripts/build-print-assets.ts --theme grand-theatre-premiere`.

## Stil ve renk
- Teknik: **oil-painted theatre poster** — rich visible brush texture, painterly velvet folds, burnished gilding; not
  flat vector, not photographic, not cartoon. Classic, romantic, rich (Belle Époque opera house), broad appeal.
- Renkler: pit `#061416` · velvet `#0E3D40` · peacock `#16595B` · antique gold `#C9A45C` · gold light `#E3C78B` ·
  ivory `#F3EBD8` · ink `#1E2626`
- Işık: warm stage light from below and slightly left (footlights) + a soft top-left key; the same in every part.
- Özgünlük: no copy of any real theatre's proscenium, crest, curtain or programme design; no real person; no brand.

---

## PAKET 5 — website katmanları (YAZI YOK)

Sahne katmanları (W2.1–W2.7) **aynı tuvalde, aynı konumda**: 1024×1536, şeffaf zemin; üst üste konunca kemer
açıklığı, perde kanatları ve kart birbirine oturur. Tek görselde tek nesne, nesnenin dışına düşen gölge yok, nesnenin
dışına taşan ışıma/hâle yok (site ışığı kendisi ekler), gerçek alfa (beyaz ya da dama değil).

Ortak sahne ölçüleri (tuval yüzdesi): kemer çerçevesi x %4–96, y %3–97; **açıklık** (sahne penceresi) x %12–88,
y %14–92 (üst kenarı drapeli saçak/valans, alt kenarı sahne tabanı); kapalı perde kanatları açıklığın içinde ve
kemerin altına %1 taşarak: sol x %11–51, sağ x %49–89, y %12–93 (orta dikişte %2 bindirme); toplanmış (açık) kanatlar
sol x %11–27, sağ x %73–89; program kartı sahnenin ortasında x %31–69, y %47–90.

#### W2.1 Proscenium kemeri + saçak (tüm parçaların stil referansı)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/proscenium.png` · 1024×1536 · **Şeffaf zemin**

```
An ornate antique-gold proscenium arch of an imaginary Belle Époque opera house, oil-painted theatre poster style with rich visible brushwork and burnished, slightly worn gilding (#C9A45C with #E3C78B highlights): two fluted gilded columns at the sides, a gently arched top with carved acanthus scrolls and a small empty cartouche (no letters, no crest), and hanging from the inside of the arch a deep peacock-teal velvet valance (#0E3D40 to #16595B) in three soft swags with a heavy gold bullion fringe and two small gold tassels. The arch frame spans about 4% to 96% of the image width and 3% to 97% of the height. The stage OPENING inside the frame — from about 12% to 88% of the width and from just under the valance at about 14% to the stage floor edge at about 92% of the height — is filled with flat pure green #00FF00 (no texture, no shading, no gradient), with crisp edges. Front view, perfectly symmetrical and straight, not cropped. Warm light from below and slightly left, as from footlights. No cast shadow outside the arch, no glow, halo or light rays outside its outline. No text, letters, numbers, monograms or logos. True transparent background PNG (real alpha channel — not white, not a checkerboard) outside the arch.
```
Kontrol: açıklık düz #00FF00, kenarı net; saçak açıklığın üst kenarını örtüyor; arma/yazı yok; simetrik; kesilmemiş; alfa.

#### W2.2 Kapalı perde — sol kanat
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left.png` · 1024×1536 · **Şeffaf zemin**

```
The LEFT panel of a closed peacock-teal velvet stage curtain (#0E3D40 shadows, #16595B body, soft #2E7F7C highlights on the fold crests), alone, on the same 1024×1536 canvas and in exactly the position it has behind proscenium.png (give proscenium.png as the reference): it spans from about 11% to 51% of the image width and from about 12% to 93% of the height. Heavy deep vertical folds that catch warm footlight from below, a slight gather at the very top, a heavy antique-gold bullion fringe along the bottom hem that just touches the stage floor line. Its right (inner) edge is a straight vertical fold that will meet the right panel at the centre seam; its left (outer) edge is a fold that tucks under the arch. Oil-painted theatre poster style, the same brushwork, velvet and light as proscenium.png. Only this one panel — no arch, no valance, no stage, no other panel. Not cropped. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```
Kontrol: tuval konumu x %11–51, y %12–93; iç kenar düz dikey; alt saçak altın püsküllü; yalnız kanat; alfa.

#### W2.3 Kapalı perde — sağ kanat
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right.png` · 1024×1536 · **Şeffaf zemin**

```
The RIGHT panel of the same closed peacock-teal velvet stage curtain, alone, on the same 1024×1536 canvas and in exactly its position behind proscenium.png (give proscenium.png and curtain_left.png as references): it spans from about 49% to 89% of the image width and from about 12% to 93% of the height, overlapping the left panel by about 2% at the centre seam. Painted separately (not a mirror copy of the left panel): its own heavy vertical folds catching warm footlight from below, the same slight gather at the top and the same antique-gold bullion fringe along the bottom hem. Its left (inner) edge is a straight vertical fold; its right (outer) edge tucks under the arch. Same oil-painted style, velvet and light. Only this one panel. Not cropped. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```
Kontrol: x %49–89, y %12–93; sol kanadın aynası değil; iki kanat üst üste konunca dikişte boşluk yok; alfa.

#### W2.4 Açık perde — sol kanat toplanmış (bağlı, püsküllü)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left_open.png` · 1024×1536 · **Şeffaf zemin**

```
The same LEFT velvet curtain panel now drawn open and gathered to the left side of the stage, on the same 1024×1536 canvas (give proscenium.png and curtain_left.png as references): a tall swag hanging from the top at about 11% to 27% of the image width, from about 12% to 93% of the height, its folds bunched tight, its inner edge sweeping in a graceful curve, held at about two-thirds height by a thick twisted gold rope tieback with one large antique-gold tassel hanging from it. The same peacock velvet, the same gold bullion fringe at the hem, the same warm light from below. Oil-painted theatre poster style. Only this gathered panel. Not cropped. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```
Kontrol: x %11–27; tieback + tek büyük püskül; aynı kadife ve saçak; alfa. (Açılışın sonunda kapalı kanat buna el değiştirir ve salınır.)

#### W2.5 Açık perde — sağ kanat toplanmış
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right_open.png` · 1024×1536 · **Şeffaf zemin**

```
The same RIGHT velvet curtain panel drawn open and gathered to the right side of the stage, on the same 1024×1536 canvas (give curtain_left_open.png as reference): a tall swag at about 73% to 89% of the image width, from about 12% to 93% of the height, folds bunched, inner edge sweeping in a curve, held by a thick twisted gold rope tieback with one large antique-gold tassel. Painted separately, not a mirror copy. Same velvet, fringe, light and oil-painted style. Only this gathered panel. Not cropped. No cast shadow, no glow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: x %73–89; sol eşinin aynası değil; alfa.

#### W2.6 Sahnenin içi (perdenin arkası)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/stage_back.png` · 1024×1536 · **Opak**

```
The inside of the stage seen through the proscenium opening, painted to fill the whole 1024×1536 canvas: a deep, shadowy painted backdrop in dark peacock and night teal (#061416 to #0E3D40) with a faint, out-of-focus moonlit garden scene barely visible, and in the lower fifth warm honey-coloured wooden stage floorboards in perspective, catching a soft pool of warm light in the centre. The whole centre is calm, dark and EMPTY (no people, no props, no furniture) — a programme card will stand there. Oil-painted theatre poster style, the same palette and warm footlight from below as proscenium.png. No text, no letters, no logos.
```
Kontrol: orta boş ve sakin; zemin tahtaları alt %20'de; opak; yazı yok.

#### W2.7 Sahnedeki program kartı (boş)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
A vintage theatre programme card (playbill) standing upright, alone: thick ivory cotton card (#F3EBD8) with a fine antique-gold printed ornamental border inset from its edge and a small gold flourish at the top centre, portrait 2:3, drawn large so it fills about 76% of the image height, centred. In its upper half a portrait photo window with an arched top, about 4:5, filled with flat pure green #00FF00 (no texture, no shading). The lower half of the card is plain ivory paper for text (no lines, no text). Front view, straight, not cropped, generous empty margin. Oil-painted style with subtle paper grain, warm light from below. No cast shadow, no glow outside the card. No text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: pencere düz #00FF00 (kemerli üst); alt yarı düz kâğıt; kenar süsü ince; alfa. (Index kartı = home kahraman kartı.)

#### W2.8 Kadife zemin karosu (dikişsiz)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/velvet_tile.png` · 1024×1024 · **Opak**

```
A seamless, tileable square texture of deep peacock-teal crushed velvet (#0E3D40 with #16595B sheen), soft and even, with a fine pile and gentle light variations, no folds, no seams, no pattern, no objects. Oil-painted feel with subtle brush texture. It must repeat without visible edges in both directions. No text.
```
Kontrol: dikişsiz (2×2 döşenince kenar görünmüyor); kıvrım/desen yok; opak.

#### W2.9 Program kâğıdı karosu (dikişsiz)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/playbill_tile.png` · 1024×1024 · **Opak**

```
A seamless, tileable square texture of aged ivory theatre-programme paper (#F3EBD8), soft cotton grain, very faint warm foxing, no fold lines, no stains in the middle, no print, no border, no objects. It must repeat without visible edges in both directions. No text.
```
Kontrol: dikişsiz; açık ve sakin (koyu mürekkep metin okunur); opak.

#### W2.10 Bilet koçanı (RSVP)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/ticket_stub.png` · 1536×1024 · **Şeffaf zemin**

```
The stub of an antique theatre ticket, alone, landscape about 3:1, drawn large so it fills about 86% of the image width, centred: thick ivory card (#F3EBD8) with a fine antique-gold printed ornamental border, and along its TOP edge a clearly visible perforation — a straight row of small round punched holes, as where it was torn from the ticket. The whole centre is plain ivory card for text (no text, no numbers, no seat print). Front view, straight, not cropped. Oil-painted style, warm light. No cast shadow, no glow outside its outline. True transparent background PNG (real alpha channel).
```
Kontrol: üst kenarda delikli çizgi; orta boş; ~3:1; alfa. (Yanıt gönderilince bu koçan yırtılıp düşer.)

#### W2.11 Salon arka planı (perde sayfası ve home, telefon)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/bg_page.png` · 1024×1536 · **Opak**

```
A vertical phone-screen background: the dark auditorium of an imaginary opera house seen from the stalls, almost black teal (#061416) with the faint warm glow of gilded balcony fronts and tiny lamps far out of focus at the very left and right edges and the top. The whole centre stays calm, dark and empty (no stage, no curtain, no people, no text) so light ivory text and the stage read on it. Oil-painted theatre poster style, the same palette and warmth as proscenium.png.
```
Kontrol: orta koyu ve boş; dekor yalnız kenarlarda; yazı yok.

#### W2.12 Püskül (favicon, süs)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/tassel.png` · 1024×1024 · **Şeffaf zemin**

```
A single antique-gold theatre curtain tassel on a short twisted gold cord, alone, hanging straight, drawn large so it fills about 72% of the square, centred. Burnished gold threads, a carved gilt head. Oil-painted style, warm light from below-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```
Kontrol: tek püskül; altın; gölge yok; alfa.

#### W2.13 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/web_hero.png` · 1536×1024 · **Opak**

```
Wide horizontal version of the same design: the antique-gold proscenium with its peacock velvet curtains drawn open and tied back with gold tassels, warm footlights glowing on honey wooden floorboards, a soft spotlight pool on the empty centre of the stage, the dark auditorium edges around. This image is cropped to 1200×630 for link previews: keep the whole stage opening and both tied curtains visible with at least 5% empty margin below the stage floor, and keep the top 20% to the arch and valance only. Oil-painted theatre poster style. No people, no text, no letters.
```
Kontrol: sahne + iki toplanmış perde tam görünür; üst %20 yalnız kemer/saçak; yazı yok.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin)

Fotogerçekçi, sinematik, sıcak sahne ışığı; tavus mavisi, antik altın ve fildişi palet; hafif film greni. Yüzler
gerçek ünlülere ya da tanınmış kişilere benzemez; marka, tabela, yazı yok. Hepsi 4:5 dikey (mekân 3:2 yatay).

#### 2.1 Ana portre
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties standing on the empty stage of an ornate gilded theatre in front of drawn-back peacock-teal velvet curtains: the groom in a classic black tuxedo, the bride in an ivory satin gown with a long veil, close together and smiling, three-quarter length, faces in the upper third, lit by a warm spotlight from above-left. Warm footlights, soft haze in the air. Peacock, antique gold and ivory palette, subtle film grain. They must not resemble any real or famous person. No text, no frame.
```

#### 2.2 Story 1 — "Opening night"
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5, a candid moment in red-and-gold theatre seats in the stalls, side by side and laughing during an evening performance, the stage light falling on their faces, the dark auditorium behind softly out of focus. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 2.3 Story 2 — "The proposal at intermission"
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
Vertical 4:5: the same fictional couple in a mirrored, candlelit theatre foyer at intermission, he on one knee holding up a ring box, she with her hands to her face in happy surprise, champagne glasses on a marble ledge, gilded mirrors and warm sconces softly blurred. Photorealistic, same palette and grain. Not resembling any real person. No text, no signs.
```

#### 2.4 Story 3 — "Our curtain call"
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Vertical 4:5: the same fictional couple taking a playful bow together at the front of the stage, hand in hand, ivory rose petals in the air, the peacock velvet curtain gathered behind them and warm footlights glowing. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 3:2)

```
Landscape 3:2: the interior of an imaginary grand theatre seen from the back of the stalls, rows of velvet seats, two tiers of gilded balconies, a crystal chandelier, the antique-gold proscenium with peacock velvet curtains open, warm evening light, set for a wedding with ivory flowers along the stage edge. No people, no signs, no text, not a copy of any real theatre. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK)

Şu an `platform/lib/print/layouts.ts` → `grand-theatre-premiere` **composed** düzenle çalışıyor (fildişi kâğıt + üstte ve
ön yüzde altta kadife bandı; ikisi de temanın GPT dokularından). Zeminler gelince düzen `card`/`back` kaynaklarına çevrilir
(metin kutuları `front: [19, 12, 15, 12]`, `back: [17, 12, 8, 12]` — üst/alt süs bantlarının dışında; zemin bu boş alanları
korumalı) ve `node scripts/build-print-assets.ts --theme grand-theatre-premiere` koşulur. İki ölçünün ikisi de istenir;
platform bugün tek kaynak kullanıyor (5×7 zemini, A5'te `cover` ile %1 kırpılır), A5 zemini baskı için ayrıca saklanır.

#### P1 — Ön yüz 5×7 (taşma paylı)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_5x7.png` · **1575×2175 px** (5.25×7.25 in @ 300 ppi) · Opak

```
The front of a printed wedding invitation, flat, portrait, full bleed, in the Grand Theatre Premiere style: aged ivory theatre-programme paper (#F3EBD8) with fine cotton grain; across the top 15% a painted peacock-teal velvet valance in three soft swags with an antique-gold bullion fringe and two small tassels; across the bottom 11% the gilded edge of a stage floor with a soft warm footlight glow; a very fine antique-gold printed rule frame inset about 6% from the edges. The whole centre (from about 19% to 85% of the height and 12% to 88% of the width) is EMPTY plain ivory paper for dark ink text. Oil-painted theatre poster style. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: orta boş; süs yalnız üst %15 ve alt %11 + ince çerçeve; yazı yok; 1575×2175.

#### P2 — Arka yüz 5×7
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_5x7.png` · **1575×2175 px** · Opak

```
The back of the same printed invitation, flat, portrait, full bleed: the same aged ivory programme paper and fine gold rule frame; across the top 13% a narrower painted peacock velvet valance with gold fringe; nothing at the bottom. Everything below the valance is EMPTY plain ivory paper for a schedule and a QR code. Same style. No text, letters, numbers, logos or watermarks. Print quality, 1575×2175 px.
```
Kontrol: yalnız üstte saçak; geri kalanı boş; yazı yok.

#### P3 — Ön yüz A5 (taşma paylı)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_a5.png` · **1819×2551 px** (154×216 mm @ 300 ppi) · Opak

```
The same front as invitation_front_5x7.png (give it as the reference), recomposed for the A5 proportion: the velvet valance across the top 15%, the gilded stage edge and footlight glow across the bottom 11%, the fine gold rule frame inset about 6%, the whole centre EMPTY plain ivory paper. Same style and colours. No text, letters, numbers, logos or watermarks. Print quality, 1819×2551 px.
```

#### P4 — Arka yüz A5
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_a5.png` · **1819×2551 px** · Opak

```
The same back as invitation_back_5x7.png, recomposed for the A5 proportion: velvet valance across the top 13%, fine gold rule frame, everything below EMPTY plain ivory paper. Same style. No text, letters, numbers, logos or watermarks. Print quality, 1819×2551 px.
```

---

## Claude'un kesimi (parçalar gelince)
- `tools/parts_prep.py` (geçici klasör): `proscenium.png` ve `card_small.png` #00FF00 pencereleri → şeffaf + `windows.json`.
- Sahne kutusu = kemerin alfa kutusu; bütün sahne katmanları bu kutudan kırpılır (`th_arch`, `curtain_l/r`, `curtain_gl/gr`,
  `th_back` — `th_back` kemer penceresinin maskesiyle). Perde kanatlarının dış kenarı = `transform-origin`; toplanmış genişlik /
  kapalı genişlik = `gather` (manifest). Kart kutusu = `card_small` alfa kutusu; pencere = `mask_card.png` + `photo_slots`.
- `playbill_tile` → `paper`, `velvet_tile` → `velvet` (2×2 aynalama gerekmez), `bg_page` → `room` + yer tutucular,
  `ticket_stub` → `stub_paper` (delik sırası üst kenarda kalır; CSS kesik çizgi kalkar), `tassel` → `favicon.png`,
  `web_hero` → `og-1200x630.jpg` (`tema_build.og_kirp(hiza="alt")`).
- PAKET 2 `photos/*.jpg` → `npm run seed -- --photos` ve theme-check fotoğraflı ölçüm; demo kaydına bağlanması ayrı karar.
