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

## PAKET 5 — website katmanları (YAZI YOK)

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

## PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin)

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

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK)

Şu an `platform/lib/print/layouts.ts` → `grand-theatre-premiere` **composed** düzenle çalışıyor (fildişi kâğıt + üstte ve
ön yüzde altta kadife bandı; ikisi de temanın GPT dokularından). Metin kutuları (kesim çizgisinin yüzdesi, üst · sağ · alt ·
sol): ön `front: [19, 12, 15, 12]`, arka `back: [17, 12, 8, 12]`. Aşağıdaki prompt'lar bu kutuların **dışına** süs koyar
(yüzdeler taşmalı görselin yüzdesi; 5×7'de taşma payı yatayda %2,4, dikeyde %1,7 → ön boş alan kesimde ≈ %18–86 yükseklik,
%10–90 genişlik; kutular onun içinde kalır). Zeminler gelince **otomatik geçmez** (G149: kutular gerçek resmin üzerinde
ölçülür); Claude şunu yapar:
1. `python3 tools/kit_check.py collections/24_Grand_Theatre_Premiere --paket 6` (ölçü 1575×2175 / 1819×2551, yazı yok).
2. `layouts.ts` bloğunda `sources` → `{ front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' }`;
   `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }` (zemin taşma paylı
   tam sayfa; A5 aynı kaynağı `cover` ile ~%1,5 kırparak kullanır — A5 zeminleri baskıcıya ayrıca verilir).
3. `cd platform && node scripts/build-print-assets.ts --theme grand-theatre-premiere`; `front`/`back` kutularını gerçek
   resmin süs sınırlarından ~%2 açıklıkla yeniden ölç (gerekirse `bands`), `node --test tests/g149-print-layout.test.ts`
   ve `tests/theme-grand-theatre-premiere.test.ts` (baskı kaynakları var mı) yeşil; 5×7 ve A5 PDF'ine göz at.
4. Eski `public/print/grand-theatre-premiere/{paper,velvet}.webp` dosyalarını sil (artık kaynak değil).

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

## Claude'un kesimi (parçalar gelince — `build_images.py` kendisi yapar)
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
