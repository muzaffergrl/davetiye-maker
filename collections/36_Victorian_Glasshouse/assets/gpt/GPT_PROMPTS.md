# GPT görsel istekleri — Tasarım 36 · Victorian Glasshouse

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, Latin plant
> names, labels with writing, logos, monograms or watermarks in any image** (a blank label, a blank seed packet and
> engraved botanical line art without lettering are fine). Give W3.1 `fern_ground.png`, W3.3 `herbarium_paper.png`
> and W3.4 `packet_body.png` as the style reference of every later part: the same deep fern green, the same
> herbarium paper, the same kraft, copper and jute, the same soft daylight through glass.

Bu dosya tasarım 36'nın **bütün görsel parçalarının** tek kaynağıdır (G185). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema
(`platform/themes/victorian-glasshouse/`) **geçici** görsellerle çalışıyor: 17'nin düz yeşil kadifesi koyu eğrelti
yeşiline, 13'ün düz soluk kâğıdı buğulu cam yeşiline, 16'nın düz krem kâğıdı herbaryum kâğıdına, 04'ün düz eski kâğıdı
kraft rengine tonlandı; bakır = 17'nin altın mührünün düz metal yüzeyinden dikdörtgen kırpım (tonlandı); sicim = 10'un
kapanışındaki düz jüt iplerinden kırpım (yaprak yok). Paket ve kapağı bu kraftın dikdörtgenleri, etiket bakır plaka;
eğrelti otu, demir kemer, orkide, cam vitrin, herbaryum etiketi ve yaprakçıklar **yok** (çizilmiş yedek yok, K21).
Buğu ve cam üstündeki ışık bandı CSS ışığıdır (bulanıklık + soluk perde). Parçalar gelince ne değişeceği: tema README →
"What waits for GPT".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/36_Victorian_Glasshouse/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/victorian-glasshouse/build_images.py` — PAKET 5'in **her parçası geldiği anda
  kendiliğinden** kullanılır (G167 düzeni): img/ yeniden üretilir, `platform/themes/victorian-glasshouse/parts.css` o
  parçaların kurallarıyla yazılır; gelmeyen parçanın kuralı yazılmaz, sayfa geçici görünümünde kalır (`img/manifest.json`
  → `parts.used` / `parts.waiting_for_gpt`). Sonra `python3 tools/kit_check.py collections/36_Victorian_Glasshouse
  --paket 2`, `python3 tools/gpt_kuru_deneme.py --tema victorian-glasshouse --sekil
  collections/36_Victorian_Glasshouse/assets/gpt/kuru_sekil.json` (prova; gerçek parçalarla da koşulabilir) ve göz
  kontrolü. PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **botanical copperplate engraving + photorealistic glass** — the fern and orchid plates of a 19th-century
  botanical atlas, rendered as real objects in a real Victorian glasshouse: real kraft paper, real jute, real copper
  with a little verdigris, real old glass with condensation; classic, romantic, rich. Not a modern greenhouse, not a
  garden centre, not neon, no plastic pots, no tropical cartoon leaves.
- Renkler: deep fern `#1C3328` · fern `#2F523E` · misted glass `#E2EAE3` · herbarium paper `#F3EDDF` · kraft `#AC8054` ·
  copper `#B26A3C` · copper light `#D99A68` · verdigris `#6F9E8E` · ink `#1E2B24`
- Işık: yumuşak, cam çatıdan süzülen gün ışığı, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz
  ya da dama deseni değil).
- Gerçek bir seraya, botanik bahçesine (Kew, vb.), tohum markasına veya başka bir satıcının tasarımına benzemesin.
  13 Enchanted Forest'tan (orman, ateş böceği), 18 Wildflower'dan (renkli kır çiçekleri, vellum) ve 08 Winter'dan (kırağı
  deseni) ayrı: burada kır çiçeği, kırağı, ateş böceği yok; eğrelti, orkide, dökme demir ve buğu var.

## Kapalı tohum paketi geometrisi (W3.4–W3.7, W3.15 buna göre)
Paket **0,68 en / 1 boy** (dikey). Yüzdeler paketin kutusuna göre (sol, üst, genişlik, yükseklik): ön duvar (W3.4)
`0, 5, 100, 95` — üst kenarı paketin ağzı; kapak (W3.5) `0, 0, 100, 30` — üst kenarı menteşe, ön duvarın üstüne katlı;
sicim (W3.7) dikey, ortada `45–55 %`; bakır etiket (W3.6) düğümden sarkar, `50, 38, 30` geniş; kart (W3.15) içeride
`9, 4, 82, 80`. Her parça **kendi tuvalinde, kenardan kenara** çizilir; Claude alfa kutusuna kırpar ve bu kutulara gerer.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W3.1 Koyu eğrelti zemini (açılış, home kartının arkası, imza, gezinme)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/fern_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat texture of a deep fern-green (#1C3328) surface like the shadowy interior of a Victorian glasshouse at dusk: a soft matte velvet-paper grain, the faintest suggestion of very fine engraved fern fronds tone-on-tone (barely visible, a slightly lighter green, no outline), calm and even everywhere so light text reads on it. No vignette, no gradient, no light spot, no object, no frame. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#1C3328` civarı; desen neredeyse görünmez; yazı yok.
Kullanım: `fern-640` = açılış zemini, home üst bölümü, imza bandı, gezinme (üstünde açık renk yazı okunur).

#### W3.2 Buğulu cam zemini (sayfa zemini)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/glass_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat texture of a pale sage misted glass pane seen straight on (#E2EAE3), lit evenly by daylight: a very soft milky haze, the faintest scattering of tiny condensation dots, a hint of old glass waviness, calm enough for dark text to read on it everywhere. No drops running, no frame, no shadow, no plants behind it, no vignette. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: sakin, açık adaçayı yeşili; dikişsiz; damla/akıntı yok; yazı yok.
Kullanım: `glass-640/1024` = sayfaların genel zemini (story, details, rsvp, home'un gün bölümü).

#### W3.3 Herbaryum kâğıdı (kartlar, bantlar, etiket, form)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of thick antique herbarium mounting paper in a warm cream (#F3EDDF): a soft cotton tooth, a very faint natural mottling, a gentle warm patina, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no pressed plant, no printing. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: sakin krem; dikişsiz; leke/bitki/baskı yok.
Kullanım: `paper-640/1024` = home kartı, davet bandı, details program kâğıdı, RSVP formu, yazı etiketleri (W3.13 gelene kadar), paketten çıkan kart (W3.15 gelene kadar).

#### W3.4 Tohum paketi — ön duvar (kapalı zarfın gövdesi)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_body.png` · 1032×1440 · **Şeffaf zemin**

```
The front wall of an antique kraft-paper seed packet envelope, seen perfectly straight on, alone on a fully transparent background, filling the image edge to edge (the image IS the paper, about 0.72:1): warm kraft brown paper (#AC8054) with natural fibres and a soft tooth, slightly worn deckled side edges, a straight clean top edge (the mouth of the packet), and in its middle a delicate engraved botanical illustration of a fern frond and a small orchid printed in dark sepia ink as on a Victorian seed packet, framed by a fine printed double rule. The upper 30% of the paper is plain kraft (a flap will cover it). Soft daylight from the top-left. No text, no lettering, no numbers, no brand, no price, no twine, no label. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: kenardan kenara düz kraft; üst kenar düz; ortada sepya eğrelti + orkide gravürü; üst %30 sade; yazı/sicim/etiket yok; alfa.
Kullanım: alfa kutusuna kırpılır → `packet_body-700`, paketin ön duvar kutusuna (`0, 5, 100, 95`) gerilir; kart açılışta bunun arkasından yükselir.

#### W3.5 Tohum paketi — kapak, dış yüz
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_flap.png` · 1360×600 · **Şeffaf zemin**

```
The top flap of the same kraft seed packet as packet_body.png, folded down, seen perfectly straight on, alone on a fully transparent background, filling the image edge to edge (about 2.27:1): the same warm kraft paper, a straight top edge (the fold), a straight lower edge with a softly deckled border and a slim printed sepia rule just above it, a tiny engraved fern sprig at its centre. Soft daylight from the top-left, a whisper of shade along the lower edge on the flap itself. No text, letters, numbers, no twine, no label, no seal. True transparent background PNG (real alpha channel).
```
Kontrol: dikdörtgen kapak (V değil), üst kenar katlama çizgisi; ortada küçük eğrelti; mühür/sicim/yazı yok; alfa.
Kullanım: `flap_out-700` = kapalı paketin kapağı (`0, 0, 100, 30`); açılışta 900 ms'de menteşesinden yukarı ve arkaya katlanır.

#### W3.5b Tohum paketi — kapak, iç yüz
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_flap_in.png` · 1360×600 · **Şeffaf zemin**

```
The inside of the same seed packet flap as packet_flap.png, seen straight on as it stands up above the open packet, alone on a fully transparent background, filling the image edge to edge (about 2.27:1): plain, slightly darker unprinted kraft paper with natural fibres, the fold along the BOTTOM edge, the softly deckled free edge along the top, a faint crease. Soft daylight from the top-left. No print, no text, no numbers, no twine, no label. True transparent background PNG (real alpha channel).
```
Kontrol: baskısız iç yüz; katlama altta, serbest kenar üstte; alfa.
Kullanım: `flap_in-700` = kapak 90°'yi geçince görünen iç yüz (paketin üstünde dikilir, kartın arkasında).

#### W3.6 Bakır bitki etiketi (boş; monogram/numara site yazar)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/copper_tag.png` · 600×800 · **Şeffaf zemin**

```
A small antique copper plant label as used in a Victorian glasshouse, seen straight on, alone on a fully transparent background, filling the image edge to edge (3:4): a rectangular copper plate with softly rounded corners and a slim raised rim, warm copper (#B26A3C) with a gentle patina and a little verdigris (#6F9E8E) at the edges, a small round punched hole near the top-left corner filled with flat pure green #00FF00 (no texture, no shading), the centre of the plate smooth and EMPTY (the website stamps letters there). Soft daylight from the top-left. No string, no text, letters, numbers or engraving in the centre. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt had no window. The photo window must be a clearly visible, SOLID, fully opaque flat #00FF00 green area inside the object (not transparent, not a hole), at least 25% of the object's area.
```
Kontrol: boş merkez; delik sol üstte, düz `#00FF00`; ip yok; alfa.
Kullanım: delik şeffaf yapılır (`manifest tag.hole_pct`) → `tag-360`: kapalı paketin düğümündeki etiket (monogram), Story'deki numaralı etiketler (01–03), program satırlarının küçük etiketleri, imzadaki monogram etiketi. Etiket deliğinden sallanır.

#### W3.7 Jüt sicim (dikey, üst–alt dikişsiz)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/twine.png` · 160×1200 · **Şeffaf zemin**

```
A single straight vertical length of natural jute garden twine, two twisted strands, seen straight on, alone on a fully transparent background, running from the very top edge to the very bottom edge of the image, centred, about 40% of the image width thick; warm natural fibre colour with tiny stray fibres. The top and bottom ends must tile vertically without a visible seam (no knot, no cut end). Soft daylight from the top-left. No text. True transparent background PNG (real alpha channel).
```
Kontrol: düz dikey ip; üst–alt dikişsiz; düğüm/uç yok; alfa.
Kullanım: `twine_own-160` = paketin ortasından geçen sicim (düğümden ikiye: üst yarı yukarı, alt yarı aşağı kayar) ve etiketlerin ipleri.

#### W3.8 Cam buğusu (yarı saydam yoğuşma)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/glass_mist.png` · 1600×1600 · **Şeffaf zemin**

```
Condensation on a pane of glass, as a semi-transparent overlay on a fully transparent background, filling the whole square: a soft milky white haze of fine fog (white, about 40–60% opacity, uneven like breath on glass), thousands of tiny condensation droplets of different sizes, a few larger droplets, two or three thin trickles running down. No glass frame, no plants, no colour other than white and transparency, no text. True transparent background PNG (real alpha channel; the haze itself partly transparent).
```
Kontrol: yarı saydam beyaz buğu + damlacıklar; çerçeve/bitki yok; gerçek alfa.
Kullanım: `mist-900` = açılıştaki cam buğusunun ve her foto camındaki buğunun dokusu (CSS bulanıklığı kalır); silme maskesiyle açılır.

#### W3.9 Dökme demir sera kemerleri (paralaks katmanı)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/ironwork.png` · 1800×1200 · **Şeffaf zemin**

```
The cast-iron ribs of a Victorian glasshouse roof seen from inside, looking up, on a fully transparent background: three slender elegant arches of dark painted cast iron (deep green-black with a hint of verdigris) curving across the upper half of the image, delicate scrollwork brackets where they meet thin columns at the sides, the panes between them fully transparent (no glass colour, no sky). The lower 45% of the image is EMPTY transparency. Soft daylight from the top-left catching the iron. No plants, no text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: üst yarıda kemerler, alt %45 boş; camlar şeffaf; bitki/yazı yok; alfa.
Kullanım: `arches-1200` = açılışta ve home'un üstünde, story sayfasının arkasında, imzada; kaydırdıkça içerikten farklı hızda kayar (paralaks), açılışta hafifçe süzülür.

#### W3.10 Eğrelti otları ve orkide (açılış ve home çerçevesi)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/ferns.png` · 1800×1200 · **Şeffaf zemin**

```
Lush botanical fern fronds rising from the bottom-left and bottom-right corners of the image on a fully transparent background, as a frame for something in the middle: maidenhair and sword ferns in deep and fresh greens, a few curled fiddleheads, and on the right one arching spray of white-and-blush moth orchids; photorealistic leaves with the fine detail of a botanical engraving, soft daylight from the top-left. The centre of the image (from 25% to 75% of the width and the whole upper 60%) is EMPTY transparency. No pots, no glass, no insects, no text. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: bitkiler alt köşelerde, orta ve üst %60 boş; saksı/yazı yok; alfa.
Kullanım: `ferns-1000` = açılışta buğu silinince kartın çevresinde belirir; home üst bölümünde kartın altında, kaydırmada kendi hızıyla.

#### W3.11 Orkide dalı (başlık altı ayırıcı)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/orchid_sprig.png` · 1400×300 · **Şeffaf zemin**

```
A single slender horizontal sprig in fine botanical engraving style with soft natural colour, on a fully transparent background: a thin arching orchid stem with three small white-and-blush blossoms in the middle and two tiny fern leaflets at the ends, centred, symmetrical in weight, generous empty margin all round. No line, no frame, no text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: ince, yatay, ortalı; çizgi/yazı yok; alfa.
Kullanım: `sprig-700` = herbaryum kâğıdındaki başlıkların altında (home davet ve gün, story, details program, RSVP formu); ortadan iki yana açılarak belirir.

#### W3.12 Numune camı (4:5 foto vitrini)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/specimen_frame.png` · 1000×1250 · **Şeffaf zemin**

```
A Victorian botanical specimen case seen straight on, alone on a fully transparent background, filling the image edge to edge (4:5): a slim frame of dark-stained wood with fine copper corner pieces and a narrow cream herbarium-paper mount inside it, a tiny copper ring at the top-right corner. The window inside the mount is a perfect rectangle from 9% to 91% of the width and from 8% to 92% of the height, filled with flat pure green #00FF00 (no texture, no shading, no glass reflection in it). Soft daylight from the top-left. No plant, no label, no text, letters or numbers. True transparent background PNG (real alpha channel).
```
Kontrol: dikdörtgen pencere düz `#00FF00`, tarif edilen konumda; yazı/bitki yok; alfa.
Kullanım: yeşil pencere ölçülür (`manifest frame.window_pct`) ve şeffaf yapılır → `frame-800`; home kartı, hikâye tanıtımı ve Story'nin üç fotoğrafının çevresinde; foto camı (buğu + ışık bandı) pencereye oturur. Pencere bulunamazsa build uyarır, fotoğraflar vitrinsiz kalır.

#### W3.13 Herbaryum etiketi (boş; yazıyı site koyar)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_label.png` · 1200×360 · **Şeffaf zemin**

```
A blank antique herbarium specimen label seen straight on, alone on a fully transparent background, filling the image edge to edge (10:3): a slip of cream paper slightly warmer than herbarium_paper.png with a finely printed sepia double border and tiny engraved fern sprigs in its two left corners, the inside EMPTY (the website writes the caption there), a very soft shade on the paper itself. No text, letters, numbers or Latin names. True transparent background PNG (real alpha channel).
```
Kontrol: boş iç alan; köşelerde küçük eğrelti; yazı yok; alfa.
Kullanım: `label-640` = Story'deki her fotoğrafın altındaki yazı etiketi (yazı soldan/sağdan "yazılır").

#### W3.14 Eğrelti yaprakçıkları (süzülen parçacıklar) — üç ayrı dosya
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_1.png`, `leaf_2.png`, `leaf_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small fern leaflet, alone on a fully transparent background, photorealistic with fine veins, fresh fern green, filling about 55% of the square, centred, not cropped, a soft natural curve. No stem from the edge, no other leaf, no shadow, no text. True transparent background PNG (real alpha channel). (Make three different leaflets: 1 = a maidenhair fern pinnule, 2 = a small sword-fern leaflet, 3 = a curled young fiddlehead.)
```
Kontrol: tek yaprak; üç dosya farklı; alfa.
Kullanım: `leaf_N-200`; `parts.css` `--vg-leaves` ile site.js'e bildirilir: açılışta buğu silinirken kartın yanından 2 yaprakçık süzülür; RSVP gönderilince 5 yaprakçık iner. Dosya yoksa parçacık yok.

#### W3.15 Paketten çıkan kart (boş, 4:5 foto penceresi)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/card_small.png` · 976×1400 · **Şeffaf zemin**

```
A flat vertical invitation card of the same cream herbarium paper as herbarium_paper.png, exactly 0.70:1, filling the image edge to edge (the card IS the image), seen straight on, with a finely printed sepia border line inset from the edge and a tiny engraved fern sprig in each lower corner, a very soft contact shade on the card itself. In its upper part a portrait window, a rectangle 58% of the card's width wide and 4:5 tall, horizontally centred, its top edge at 7% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```
Kontrol: pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.
Kullanım: alfa kutusuna kırpılır; yeşil pencere ölçülür (`manifest card_small.window_pct`) ve şeffaf yapılır →
`card_small-860` = paketten yükselen kart; portre alanı ölçülen pencereye oturur, isim/tarih pencerenin altından başlar.
Pencere bulunamazsa build uyarır ve kart herbaryum kâğıdı kalır.

#### W3.16 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft daylight through old glass from the top-left: inside a Victorian glasshouse with slender cast-iron arches above (as ironwork.png), on a weathered potting bench a kraft seed packet envelope (as packet_body.png, blank, no lettering) tied with jute twine and a small blank copper plant label at the knot, standing slightly below the centre, surrounded by maidenhair ferns and one spray of white moth orchids (as ferns.png), a little condensation on the glass in the background. The top 20% of the image is calm, out-of-focus glasshouse. This image is cropped to 1200×630 for link previews: keep the whole packet visible with at least 5% empty margin below it. No people, no text, letters, numbers, labels with writing or logos.
```
Kontrol: paket bütün ve altta boşluklu; üst %20 sakin; yazı yok.
Kullanım: `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, a soft fern-green, cream and warm copper palette, gentle daylight
through glass, subtle film grain; ONE fictional couple in their early thirties, the same two people in every photo
(they must not resemble any real person or celebrity): Flora — shoulder-length chestnut hair with soft waves, light
olive skin, a slim gold ring; Edmund — short black curly hair, a neat short beard, deep brown skin. Modern, elegant
clothing (no costume). Photos are cropped 4:5 portrait on the site: keep faces and hands in the middle 70%. No text, no
frame, no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir. Story fotoğrafları sitede **4:5 dikey** kırpılır.

#### 2.1 Ana portre
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Flora and Edmund, in their early thirties (Flora: shoulder-length chestnut hair with soft waves, light olive skin, a slim gold ring; Edmund: short black curly hair, a neat short beard, deep brown skin; they must not resemble any real person or celebrity) inside a Victorian glasshouse full of ferns: she in a simple ivory silk gown, he in a deep green suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, soft daylight through the glass roof, slender cast-iron columns softly out of focus behind them. Photorealistic, fern-green, cream and copper palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "Sheltering from the rain"
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing as they step in from the rain under the glass roof of an old glasshouse, raindrops on the panes above, his jacket held over both of them, tall ferns around, soft grey daylight. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "Our first cutting"
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5: the same couple as hero_portrait.jpg at a weathered wooden potting bench, side by side, gently planting a small fern cutting in a terracotta pot together, their hands touching in the soil, smiling, kraft seed packets (blank, no lettering) and jute twine on the bench, soft daylight through glass. Photorealistic, same palette and grain. No text, no labels with writing.
```

#### 2.4 Story 3 — "Yes, among the palms"
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, in front of tall palm leaves and ferns inside a glasshouse, a little condensation on a pane behind, soft warm daylight from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: the interior of an elegant fictional Victorian glasshouse set for a wedding ceremony, a central aisle between rows of simple wooden chairs, tall palms, ferns and white orchids along the sides, slender white-painted cast-iron arches and a glass roof with soft late-afternoon light, a few strings of warm small lights. No people, no signs, no text. Photorealistic, same palette. Must not resemble a specific real conservatory.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, blok `'victorian-glasshouse'`). Şu an geçici
> (`composed`): herbaryum kâğıdı + üstte eğrelti yeşili bant ve içinde bakır plaka, altta ince kraft bant (temanın
> tonladığı dokular). **Dosya adı ve ölçü:** `print/invitation_front_5x7.png`, `print/invitation_back_5x7.png`,
> **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez: `layouts.ts` her yüz için tek zemin
> taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan ~%0,8 kırpılarak basılır (~260 ppi).
> Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** metin kutuları `layouts.ts`'teki ölçülerdir (ön `[20, 12, 14, 12]` = yükseklikte %20–%86, genişlikte
> %12–%88; arka `[13, 12, 8, 12]` = %13–%92 × %12–%88; yüzde: üst, sağ, alt, sol). Prompt'lar bu alanı ~%3 payla boş
> ister; alan aynı kalırsa kutular değişmeden kullanılır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'victorian-glasshouse'` bloğunda `sources` → `{ front: 'print/invitation_front_5x7.png', back:
>    'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme victorian-glasshouse` (artık kullanılmayan
>    `paper.webp`/`fern.webp`/`copper.webp`/`kraft.webp` dosyalarını `public/print/victorian-glasshouse/`'den sil) ve `node scripts/print-sample.ts
>    --theme victorian-glasshouse --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the cream herbarium paper of herbarium_paper.png. Along the top edge a band of slender cast-iron glasshouse arches in deep fern green (as ironwork.png, small) with maidenhair fern fronds hanging from them, staying above 16% of the height; at the two bottom corners small sprays of ferns and one white orchid (as ferns.png, small), staying below 88% of the height and outside the middle 60% of the width. The rectangle from 17% to 89% of the height and from 9% to 91% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no leaf, no line, no shadow, no stain in it. No text, letters, numbers, Latin names, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %17–%89 × %9–%91 tamamen boş; yazı yok; süs yalnız üst bantta ve alt köşelerde.

#### P2 — Arka yüz
**Kaydet:** `collections/36_Victorian_Glasshouse/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream herbarium paper, only a narrow band of fern fronds along the top edge (about 8% of the height, staying above 10% of the height). Everything below 11% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no leaf, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar eğrelti bandı (%10'un üstünde); %11'in altı boş; yazı yok.
