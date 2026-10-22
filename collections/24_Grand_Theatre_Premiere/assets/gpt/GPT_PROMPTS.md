# GPT görsel istekleri — Tasarım 24 · Grand Theatre Premiere

> **Instructions for GPT:** This design ("Grand Theatre Premiere") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/grand-theatre-premiere/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/grand-theatre-premiere/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.

Bu dosya 24 Grand Theatre Premiere'in **bütün görsel parçalarının** tek kaynağıdır (G162, `docs/24_YENI_TASARIMLAR.md`).
Tasarım `tools/katalog.py`'de `EK_TEMALAR` satırıyla kayıtlı (D'ye girmedi), bu yüzden dosya elle yazıldı. Tema
(`platform/themes/grand-theatre-premiere/`) şu an **geçici** parçalarla çalışıyor: 06'nın kadife dokusu tavus mavisine
tonlanmış perde kanatları, 21'in fildişi kâğıdı program kartı (tema README "Interim pieces"). Aşağıdakiler gelince
`build_images.py` bunlara **kendiliğinden** geçer (dosya adına bakar; parça parça — sahne takımı birlikte, bkz. "Claude'un
kesimi"); ölçüler (sahne kutusu, perde menteşeleri, toplanma oranı, kart kutusu ve penceresi) parçalardan ölçülüp
`img/manifest.json` → `stage` ve `site.css` `/* stage:begin … stage:end */` bloğuna yazılır, elle yüzde kopyalanmaz.

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

## PAKET 5 — website katmanları (YAZI YOK) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).

Sahne katmanları (W2.1–W2.6) **aynı tuvalde, aynı konumda**: 1024×1536; üst üste konunca kemer açıklığı, perde kanatları
ve sahnenin içi birbirine oturur. Program kartları (W2.7, W2.7b) tek başına çizilir; Claude kartı sahne tabanına koyar
(aşağıdaki kart yeri, tuval yüzdesi). Tek görselde tek nesne, nesnenin dışına düşen gölge yok, nesnenin
dışına taşan ışıma/hâle yok (site ışığı kendisi ekler), gerçek alfa (beyaz ya da dama değil).

Ortak sahne ölçüleri (tuval yüzdesi): kemer çerçevesi x %4–96, y %3–97; **açıklık** (sahne penceresi) x %12–88,
y %14–92 (üst kenarı drapeli saçak/valans, alt kenarı sahne tabanı); kapalı perde kanatları açıklığın içinde ve
kemerin altına %1 taşarak: sol x %11–51, sağ x %49–89, y %12–93 (orta dikişte %2 bindirme); toplanmış (açık) kanatlar
sol x %11–27, sağ x %73–89; program kartı (Claude yerleştirir) sahnenin ortasında x %31–69, ayağı y %90'da.

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
A vintage theatre programme card (playbill) standing upright, alone: thick ivory cotton card (#F3EBD8) with a fine antique-gold printed ornamental border inset about 5% from its edge and a small gold flourish at the top centre, portrait 2:3, drawn large so it fills about 76% of the image height, centred. In its upper part a portrait photo window with an arched top, about 4:5, horizontally centred, from about 23% to 77% of the card's width and from about 9% to 52% of the card's height, with a thin gold moulding around it, filled with flat pure green #00FF00 (no texture, no shading, crisp edges). The lower part of the card, from about 56% to 92% of its height, is plain ivory paper for text (no lines, no ornament, no text). Front view, straight, not cropped, generous empty margin. Oil-painted style with subtle paper grain, warm light from below. No cast shadow, no glow outside the card. No text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: pencere düz #00FF00 (kemerli üst), kartın üst kısmında (yükseklik ~%9–52) ortada; alt kısım (~%56–92) düz kâğıt;
kenar süsü ince; alfa. (Perde sayfasında sahnede duran kart; fotoğraf penceresinin altına konur, isim ve tarih alt kısma
yazılır.)

#### W2.7b Ana sayfanın program kartı (pencere yok)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_plain.png` · 1024×1536 · **Şeffaf zemin**

```
The same vintage theatre programme card as card_small.png (give it as the reference: the same thick ivory cotton card, the same fine antique-gold ornamental border inset about 5% from the edge, the same small gold flourish at the top centre, the same 2:3 proportion and size, about 76% of the image height, centred) but WITHOUT any photo window: inside the border the whole face is plain ivory paper for text, calm and even, no lines, no frame, no ornament in the middle. Front view, straight, not cropped. Oil-painted style with subtle paper grain, warm light from below. No cast shadow, no glow outside the card. No text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: card_small ile aynı kart (kenar süsü, üst süs, oran); yüzü baştan sona düz kâğıt; pencere yok; alfa. (Ana sayfanın
ilk ekranındaki kart: isimler, tarih, şehir; açılıştaki kart buraya uçar.)

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
Kontrol: üst kenarda delikli çizgi; orta boş; ~3:1; alfa. (Yanıt gönderilince bu koçan yırtılıp düşer; sitede kendi
oranında, kırpılmadan durur — "Admit one", isimler ve tarih ortadaki boş kâğıda yazılır.)

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

## PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor)

Fotogerçekçi, sinematik, sıcak sahne ışığı; tavus mavisi, antik altın ve fildişi palet; hafif film greni. Yüzler
gerçek ünlülere ya da tanınmış kişilere benzemez; marka, tabela, yazı yok. Hepsi 4:5 dikey (mekân 3:2 yatay).
**Tek kurgu çift, her fotoğrafta aynı:** her prompt aynı tarifi taşır (kadın: omuz hizasında dalgalı kestane-kızıl saç,
açık ten, hafif çil; erkek: kısa koyu kahve saç, kısa düzgün sakal, zeytinî ten). 2.1'i sonraki fotoğraflara referans ver.

#### 2.1 Ana portre
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), standing on the empty stage of an ornate gilded theatre in front of drawn-back peacock-teal velvet curtains: the groom in a classic black tuxedo, the bride in an ivory satin gown with a long veil, close together and smiling, three-quarter length, faces in the upper third, lit by a warm spotlight from above-left. Warm footlights, soft haze in the air. Peacock, antique gold and ivory palette, subtle film grain. They must not resemble any real or famous person. No text, no frame.
```

#### 2.2 Story 1 — "Opening night"
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in smart evening clothes, vertical 4:5, a candid moment in peacock-teal velvet theatre seats with gilded armrests in the stalls, side by side and laughing during an evening performance, the stage light falling on their faces, the dark auditorium behind softly out of focus. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 2.3 Story 2 — "The proposal at intermission"
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
Vertical 4:5: the same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in evening clothes, in a mirrored, candlelit theatre foyer at intermission, he on one knee holding up a ring box, she with her hands to her face in happy surprise, champagne glasses on a marble ledge, gilded mirrors and warm sconces softly blurred. Photorealistic, same palette and grain. Not resembling any real person. No text, no signs.
```

#### 2.4 Story 3 — "Our curtain call"
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Vertical 4:5: the same fictional couple as hero_portrait.jpg (she: shoulder-length wavy auburn hair, fair skin with light freckles; he: short dark-brown hair, a short neat beard, olive skin), in their wedding clothes (black tuxedo, ivory satin gown), taking a playful bow together at the front of the stage, hand in hand, ivory rose petals in the air, the peacock velvet curtain gathered behind them and warm footlights glowing. Photorealistic, same palette and grain. Not resembling any real person. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 3:2)

```
Landscape 3:2: the interior of an imaginary grand theatre seen from the back of the stalls, rows of velvet seats, two tiers of gilded balconies, a crystal chandelier, the antique-gold proscenium with peacock velvet curtains open, warm evening light, set for a wedding with ivory flowers along the stage edge. No people, no signs, no text, not a copy of any real theatre. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre)

> **Neden yeniden yazıldı (2026-10-20):** website 18–19 Ekim'de fildişi kâğıt + köşe çiçekleri görünümüne geçti; eski baskı prompt'ları eski görünümü (ve artık olmayan PAKET 5 parçalarını) istiyordu. `platform/lib/print/layouts.ts` `'grand-theatre-premiere'` bloğunun geçici kaynakları yeniden kurulumda `img/`'den silindi: panel şu an `public/print/grand-theatre-premiere/`'deki eski çıktıyı (eski görünüm) basıyor ve `build-print-assets` bu tema için yeniden koşamaz. Bu zeminler gelince:
> 1. `layouts.ts` `'grand-theatre-premiere'` bloğunda `sources` → bu zeminler (`print/invitation_front_5x7.png` + `print/invitation_back_5x7.png`), `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Zemin artık **açık fildişi**: `ink` / `accent` koyu tonlara (temanın site metin rengi) alınır; açık mürekkep kalmaz.
> 3. Metin kutuları (`front` / `back`) gerçek görselde ölçülür (G149; süsten ~%2 açıklık), `node --test tests/g149-print-layout.test.ts`.
> 4. `cd platform && node scripts/build-print-assets.ts --theme grand-theatre-premiere`; `public/print/grand-theatre-premiere/`'deki artık kaynak olmayan eski dosyalar silinir; 5×7 ve A5 örnek PDF'ine göz atılır.
> Ek görsel (her iki yüz için sohbetin başında): `platform/themes/grand-theatre-premiere/img/bg_scene-1024.webp`.

#### P6.1 Ön yüz 5×7
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 px (300 ppi), opak

```
A full-bleed printable wedding invitation ground for the "Grand Theatre Premiere" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same burgundy velvet, antique gold and ivory roses, theatrical gilded rococo flourishes at the corners, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### P6.2 Arka yüz 5×7
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 px (300 ppi), opak

```
The back side of the same "Grand Theatre Premiere" invitation (give invitation_front_5x7.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

#### P6.3 Ön yüz A5
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_a5.png` · 1819×2551 px (300 ppi), opak

```
A full-bleed printable wedding invitation ground for the "Grand Theatre Premiere" design, front side, portrait, seen perfectly flat and straight on, 1819 × 2551 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same burgundy velvet, antique gold and ivory roses, theatrical gilded rococo flourishes at the corners, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```
Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1819×2551.

#### P6.4 Arka yüz A5
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_a5.png` · 1819×2551 px (300 ppi), opak

```
The back side of the same "Grand Theatre Premiere" invitation (give invitation_front_a5.png as the reference image): portrait, full bleed, perfectly flat, 1819 × 2551 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1819 × 2551 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1819×2551.

---

## Claude'un kesimi (parçalar gelince — `build_images.py` kendisi yapar) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).
- Komut: `python3 platform/themes/grand-theatre-premiere/build_images.py` (sonra `cd platform && node scripts/theme-assets.cjs`
  ve `PORT=… node scripts/theme-check.cjs --theme grand-theatre-premiere --stress --compare none`). Çıktıdaki
  "waiting for GPT" listesi hâlâ geçici olan parçaları sayar; `img/manifest.json` → `sources` her parçanın kaynağını yazar.
- **Sahne takımı** (`proscenium` + `curtain_left` + `curtain_right` üçü birden varsa): `tools/parts_prep.py` (geçici klasör)
  `proscenium.png` açıklığını ve `card_small.png` penceresini (#00FF00) şeffaf yapar. Sahne kutusu = kemer, iki kapalı kanat
  ve iki toplanmış kanadın alfa kutularının birleşimi; bütün sahne katmanları bu kutudan kırpılır (`th_arch`, `curtain_l/r`,
  `curtain_gl/gr`, `th_back` — `th_back` = `stage_back.png` kemer açıklığının maskesiyle, +6 px kemerin altına). Kapalı
  kanadın dış kenarı = `transform-origin` (`--cl-o/--cr-o`); toplanmış genişlik / kapalı genişlik = `gather` (`--gather`,
  açılma keyframe'leri bundan hesaplanır); toplanmış kanadın tepe ortası = salınım ekseni. Takımın içinde eksik
  `curtain_*_open` → kapalı GPT kanadı %40 genişliğe ölçeklenir; eksik `stage_back` → geçici kadife.
- Kart: `card_small` alfa kutusuna kırpılır, sahnede genişliği tuvalin %38'i, ayağı tuvalin %90'ında, açıklığın ortasında;
  pencere kutusu (+2 px) `stage.card.window_pct` → `--win-*`: fotoğraf kartın altında, pencereden görünür. Pencere
  bulunamazsa fotoğraf geçici yerinde kartın üstünde durur (manifest `warnings`).
- `card_plain` → `card_plain` (ana sayfa kartı; kendi oranı `--hero-ar`, kırpılmaz), `playbill_tile` → `paper`,
  `velvet_tile` → `velvet` (aynalama yok), `bg_page` → `room` + yer tutucular (`ph_portrait`, `ph_land`), `ticket_stub` →
  `stub_paper` (kendi oranı `--stub-ar`, CSS kesik çizgisi kalkar), `tassel` → `favicon.png`, `web_hero` → `og-1200x630.jpg`
  (`tema_build.og_kirp(hiza="alt")`: üst ~%21 kırpılır).
- Bütün ölçüler `img/manifest.json` → `stage` (+ `stage.css`) ve `site.css` `/* stage:begin … stage:end */` bloğuna yazılır;
  `tests/theme-grand-theatre-premiere.test.ts` ikisinin aynı olduğunu denetler. Kalıntı #00FF00 → build hata verir.
- Prova (gerçek parça gelmeden): `python3 tools/gpt_kuru_deneme.py --tema grand-theatre-premiere --sekil
  collections/24_Grand_Theatre_Premiere/assets/gpt/kuru_sekil.json [--theme-check --stress --port …]`.
- PAKET 2 `photos/*.jpg` → `npm run seed -- --photos` ve theme-check fotoğraflı ölçüm; demo kaydına bağlanması ayrı karar.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a deep peacock teal velvet cloth over an antique gilded side table and a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a deep peacock teal velvet cloth over an antique gilded side table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a deep peacock teal velvet cloth over an antique gilded side table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a deep peacock teal velvet cloth over an antique gilded side table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a teal velvet theatre sofa with an antique gold cushion and a glass of champagne; a small arrangement of a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 24`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Grand Theatre Premiere". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, the same light and the same color world (peacock teal, deep velvet green, antique gold and ivory). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a deep peacock teal velvet cloth over an antique gilded side table, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a deep peacock teal velvet cloth over an antique gilded side table, a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a deep peacock teal velvet cloth over an antique gilded side table, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a deep peacock teal velvet cloth over an antique gilded side table, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a deep peacock teal velvet cloth over an antique gilded side table: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a deep peacock teal velvet cloth over an antique gilded side table: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a deep peacock teal velvet cloth over an antique gilded side table, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a deep peacock teal velvet cloth over an antique gilded side table, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a deep peacock teal velvet cloth over an antique gilded side table: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a folded blank ivory theatre programme with a gold edge, a pair of antique brass opera glasses, two blank ivory ticket stubs, a fold of peacock velvet curtain fabric with a gold tassel and a single ivory rose. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: peacock teal, deep velvet green, antique gold and ivory. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
