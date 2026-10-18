# GPT görsel istekleri — Tasarım 35 · Highland Tartan & Thistle

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, monograms, clan
> crests, coats of arms, flags, religious symbols, logos or watermarks in any image.** The tartan is an original
> heather-and-moss sett invented for this design — it must not copy any registered clan or brand tartan. Give W2.1
> `tartan_wool.png`, W2.2 `cream_paper.png` and W2.6 `envelope_back.png` as the style reference of every later part: the
> same wool, the same cream paper, the same warm saddle leather and antique brass, the same soft daylight.

Bu dosya tasarım 35'in **bütün görsel parçalarının** tek kaynağıdır (G184). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema
(`platform/themes/highland-tartan-thistle/`) **geçici** görsellerle çalışıyor: 09'un düz keten dokusu funda moruna
(ekose **yok**: desen çizilmez), 17'nin düz yeşil kadifesi koyu yosuna, 01'in fildişi kâğıdı kreme, 07'nin kadifesi deri
kahvesine tonlandı; pirinç = 17'nin altın mührünün düz metal yüzeyi (toka ve madalyon kapağı bu pirincin kırpımları); sis =
08'in buzlu kâğıdı ağır bulanık, kendi lekeleri alfa. Tepeler, funda, devedikeni, madalyon çerçevesi ve funda çiçekleri
**yok** (çizilmiş yedek yok, K21). Parçalar gelince ne değişeceği: tema README → "What waits for GPT".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/35_Highland_Tartan_Thistle/assets/gpt/` altındaki `parts/`
  (PAKET 5), `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/highland-tartan-thistle/build_images.py` — PAKET 5'in **her parçası geldiği
  anda kendiliğinden** kullanılır (G167 düzeni): img/ yeniden üretilir, `platform/themes/highland-tartan-thistle/parts.css`
  o parçaların kurallarıyla yazılır; gelmeyen parçanın kuralı yazılmaz, sayfa geçici görünümünde kalır
  (`img/manifest.json` → `parts.used` / `parts.waiting_for_gpt`). Sonra `python3 tools/kit_check.py
  collections/35_Highland_Tartan_Thistle --paket 2`, `python3 tools/gpt_kuru_deneme.py --tema highland-tartan-thistle
  --sekil collections/35_Highland_Tartan_Thistle/assets/gpt/kuru_sekil.json` (prova; gerçek parçalarla da koşulabilir) ve
  göz kontrolü. PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **oil-painted Highland landscape + photorealistic textures** — real woven wool, real saddle leather, real
  antique brass, real cream paper; classic, romantic, rich, warm. Not a souvenir-shop look: no bagpipes, no kilted
  figures, no castles, no flags, no clan crests, no cartoon thistles.
- Renkler: heather `#7B5A84` · heather light `#C4A9CC` · moss `#5E6B3E` · moss ink `#46512C` · ground `#20291D` ·
  tartan red (thin accent lines only) `#8E2B2F` · cream `#F1EADB` · cream shade `#E2D8C3` · brass `#A88437` · brass light
  `#D9BB72` · leather `#6B4428` · mist `#DFE3DC` · ink `#2A2620`
- Ekose (sett): moss-green and heather-purple squares, a fine cream overcheck and a very thin deep-red line; soft, woven,
  slightly fuzzy (real wool). Bütün ekoseli parçalarda **aynı** sett.
- Işık: yumuşak gün ışığı, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil).
- Gerçek bir klana, markaya, kumaş üreticisine veya başka bir satıcının tasarımına benzemesin. 25 Orient Express'in deri
  bilet cüzdanından ayrı: burada kitap gibi açılan cüzdan yok; yün zarf, düz kapak, dikey kayış.

## Zarf geometrisi (W2.6–W2.10 ve W2.17 buna göre)
Zarf **0,9 en / 1 boy** (dikey, 1080×1200 tuval). Üç zarf katmanı (W2.6 arka, W2.7 ön cep, W2.8 kapak) **aynı tuvalde,
aynı konumda** çizilir; Claude her birini kendi kutusuna kırpar. Kutular zarfın yüzdesiyle (sol, üst, genişlik, yükseklik):
ön cep `0, 34, 100, 66`; kapak `0, 0, 100, 56` (alt kenarı **düz**, V değil; kapak cebin üst %22'sini örter); kayış
`42, -5, 16, 86` (zarfın üst kenarından taşar, kapağın üstünden cebin üstüne iner); toka kayışın üstünde `37, 47.5, 26, 15`
(kapağın alt kenarının hizasında); kart cepte `9, 7, 82, 86` (0,858:1).

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W2.1 Ekoseli yün (zarfın kumaşı)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/tartan_wool.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of soft woven wool tartan filling the whole square edge to edge: an original sett of muted moss-green (#5E6B3E) and heather-purple (#7B5A84) squares with a fine cream (#F1EADB) overcheck and one very thin deep-red (#8E2B2F) line, about four repeats of the sett across the square, real twill weave and a slightly fuzzy wool surface, evenly lit from the top-left. Calm and even, no fold, no crease, no stitching, no fringe, no vignette, no shadow. It must not copy any registered clan or brand tartan. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, crests or symbols.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); yosun + funda kareleri, ince krem ve çok ince kırmızı çizgi; kıvrım/yazı yok.
Kullanım: `wool-640` = zarfın arkası, cebi ve kapağı (W2.6–W2.8 gelene kadar), kapağın iç yüzü (koyulaştırılmış), teşekkür
modunda fotoğrafsız madalyonun zemini. Basılı davetiyenin geçici yün şeridi.

#### W2.2 Krem kâğıt (kartlar, bantlar, form)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/cream_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of thick handmade cotton paper in a warm cream (#F1EADB): a gentle natural tooth, very faint fibres, the softest warm mottling, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no deckle edge, no stain, no printing, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: sakin (üstüne koyu yazı her yerde okunur); krem; dikişsiz; leke/baskı yok.
Kullanım: `paper-640/1024` = home kartı, davet ve gün bantları, details program kâğıdı, RSVP formu, zarftaki kart (W2.17 gelene kadar).

#### W2.3 Koyu yosun zemin (sayfa zemini)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/moss_ground.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat texture of deep moss-green boiled wool felt (#20291D) filling the whole square, a soft matte fibrous surface with a barely visible heathered fleck of darker green and faint heather purple, calm and even everywhere so cream text reads on it. Evenly lit, no pattern, no tartan, no fold, no vignette, no gradient, no object. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: koyu, sakin (üstünde krem yazı okunur); desen/ekose yok; dikişsiz.
Kullanım: `ground-640` = bütün sayfaların zemini (açılış, home, story, details, rsvp).

#### W2.4 Yağlı boya tepeler (açılışın arka planı)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/hills.png` · 1200×1600 · opak

```
A portrait oil painting of Scottish Highland hills at early morning, painted in rich, soft brushwork like a 19th-century landscape: layered rolling hills in moss green and heather purple fading into the distance, a calm glen with a faint ribbon of a loch in the middle distance, low banks of pale mist lying in the valleys, a soft overcast sky with warm light breaking through. The hills fill the lower 60% of the image; the upper 40% is calm, pale, misty sky with nothing in it (text sits there). Muted, deep tones that sit well under cream text (moss #5E6B3E, heather #7B5A84, ground #20291D, mist #DFE3DC). No castle, no buildings, no people, no animals, no trees in the foreground, no frame, no signature. No text, letters, numbers or symbols.
```
Kontrol: tepeler alt %60'ta; üst %40 boş, sakin gök; kale/insan/imza yok; koyu ve yumuşak.
Kullanım: `hills-1024` = açılışta zarfın arkasındaki tepeler (sayfanın alt %62'si, alttan hizalı `cover`); sis katmanları
bunların üstünden iki yana çekilir.

#### W2.5 Dağ sisi (iki sis katmanı)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/mist.png` · 1600×800 · **Şeffaf zemin**

```
A single soft horizontal bank of pale Highland mist (#DFE3DC), photographed as real low cloud, on a fully transparent background: a long drifting band, thicker in the middle and thinning to nothing towards the left, right, top and bottom edges, with soft wisps and gentle variations of density, semi-transparent everywhere (never a solid white block). It fills the width of the image and about the middle 70% of its height; every edge fades to full transparency well before the border. No hills, no sky, no trees, no objects. No text. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tek sis bandı; kenarları tam şeffafa iniyor; yarı saydam (düz beyaz blok değil); başka nesne yok; gerçek alfa.
Kullanım: `mist-1024` = açılışta tepelerin üstündeki iki sis katmanı (yakın olan aynalanır; dokununca yakın sola, uzak sağa
çekilir), home kartının arkası, story ve details sayfalarının arkasında kaydırmayla zıt yönlere süzülen iki katman.

#### W2.6 Zarfın arkası (iç astar görünür)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_back.png` · 1080×1200 · **Şeffaf zemin**

```
The back panel of an open rectangular envelope made of the tartan wool of tartan_wool.png, seen straight from the front, on a fully transparent background: a flat upright rectangle filling the whole image edge to edge (the image IS the envelope, 0.9:1), its inside facing us, lined with a plain deep moss-green wool lining (#46512C) that covers it all, a slim edge of the tartan showing along the top and sides, softly lit from the top-left, a gentle shade towards the bottom where the pocket would be. No flap, no front pocket, no strap, no card inside, no shadow outside the rectangle. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tuvali dolduran dikdörtgen (0,9:1); iç astar düz yosun yeşili; kapak/cep/kayış yok; gerçek alfa.
Kullanım: tuvalin tamamı → `env_back-760` = `.env-back` (kapak kalkınca görünen iç).

#### W2.7 Zarfın ön cebi
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_front.png` · 1080×1200 · **Şeffaf zemin**

```
Only the front pocket of the same tartan wool envelope as envelope_back.png, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from 34% of the image height down to the bottom edge, its straight top edge finished with a narrow folded hem and a fine line of cream stitching, soft daylight from the top-left. The upper 34% of the canvas is completely transparent. No flap, no strap, no buckle, no card, no shadow outside the pocket. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: cep tuvalin %34'ünden alta, tam genişlikte; üstü tamamen şeffaf; kayış/toka yok; gerçek alfa.
Kullanım: Claude tuvali cep kutusuna (`0, 34, 100, 66`) kırpar → `env_front-760` = `.env-front`.

#### W2.8 Zarfın düz kapağı (V değil)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/flap.png` · 1080×1200 · **Şeffaf zemin**

```
Only the closed flap of the same tartan wool envelope, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from the top edge down to 56% of the image height, folded down over the pocket, with a soft rounded fold along its top edge and a STRAIGHT bottom edge (not a V, not a point, not scalloped) finished with a narrow hem and a fine line of cream stitching; a very soft shade along its bottom edge. The lower 44% of the canvas is completely transparent. No strap, no buckle, no seal, no button, no card. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: kapak üstten %56'ya, tam genişlik; alt kenar **düz**; mühür/düğme/kayış yok; altı tamamen şeffaf; gerçek alfa.
Kullanım: Claude tuvali kapak kutusuna (`0, 0, 100, 56`) kırpar → `flap-760` = kapağın dış yüzü; açılışta üst katından 3B
kalkar (iç yüzü koyulaştırılmış yün kalır).

#### W2.9 Deri kayış
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/strap.png` · 240×1300 · **Şeffaf zemin**

```
A single straight vertical leather strap, seen straight from the front, on a fully transparent background, filling the image edge to edge (about 0.18:1): warm saddle-brown vegetable-tanned leather (#6B4428) with a fine stitched line of cream thread along both long edges, softly burnished edges, a natural grain, a rounded tip at the bottom end, the top end cut straight. Soft daylight from the top-left. No buckle, no holes, no rivets, no shadow outside the strap. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tek dikey kayış; iki kenarda krem dikiş; alt ucu yuvarlak; toka yok; gerçek alfa.
Kullanım: alfa kutusuna kırpılır → `strap-200` = `.strap` (zarfın üst kenarından cebe iner); açılışta tokadan yukarı kayıp çıkar.

#### W2.10 Pirinç toka
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/buckle.png` · 560×320 · **Şeffaf zemin**

```
A single antique brass strap buckle, seen straight from the front, on a fully transparent background, filling the image edge to edge (about 1.75:1): a rectangular frame with softly rounded corners and a centre bar, with its pointed prong lying flat across the bar, in warm antique brass (#A88437) with gentle highlights and a little patina, finely engraved with a simple border line. The openings inside the frame are fully transparent (the strap shows through them). Soft daylight from the top-left. No strap, no shadow outside the buckle. No text, letters, numbers, crests or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tek toka; çerçeve içi şeffaf; dil ortadaki çubuğun üstünde; gerçek alfa.
Kullanım: alfa kutusuna kırpılır → `buckle-320` = `.buckle`; açılışta çerçeve alt çubuğu üstünde öne devrilir, sonra kayışla
birlikte kayar.

#### W2.11 Funda dalı (cepten yükselen)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_sprig.png` · 600×1100 · **Şeffaf zemin**

```
A single sprig of Scottish heather standing upright, photorealistic with a soft painterly finish, on a fully transparent background: a slender woody stem with a few small side branches, dense spikes of tiny heather-purple (#7B5A84) bell flowers along the upper half, small dark-green needle leaves, one short sprig of pale cream heather tucked beside it, filling about 90% of the image height, centred, the stem's cut end at the bottom. Soft daylight from the top-left. No ribbon, no vase, no shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: tek dik funda dalı; mor çiçekler üst yarıda; alt uç kesik; kurdele/gölge yok; gerçek alfa.
Kullanım: `sprig-420` = `.sprig`; açılışta kapak kalkınca kartın önünde cepten yükselir.

#### W2.12 Funda ayırıcı (başlık altı)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_divider.png` · 1600×260 · **Şeffaf zemin**

```
A slim horizontal divider made of two small sprigs of heather and a small thistle head, photorealistic with a soft painterly finish, on a fully transparent background: the thistle head with its purple tuft in the centre, a heather sprig reaching out to the left and one to the right, lying horizontally, delicate and airy, centred with a generous empty margin at both ends. Soft daylight from the top-left. No ribbon, no line, no shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yatay, ortada devedikeni, iki yanda funda; kenarlarda boşluk; çizgi/kurdele yok; gerçek alfa.
Kullanım: `divider-800` = `.band-sprig`: krem kâğıt üstündeki başlıkların altında (home davet ve gün, details program, RSVP formu).

#### W2.13 Funda çiçekçikleri (yanıt gönderilince süzülen) — üç ayrı dosya
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_1.png`, `heather_floret_2.png`, `heather_floret_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single tiny cluster of heather bell flowers, photorealistic, alone, on a fully transparent background: three to five small heather-purple (#7B5A84) bells on a short sprig tip with a couple of needle leaves, filling about 55% of the square, centred, not cropped. Soft daylight from the top-left. No shadow, no other object. No text. True transparent background PNG (real alpha channel). (Make three different clusters: 1 = purple bells pointing down, 2 = a paler lilac cluster, 3 = a single cream-white bell sprig.)
```
Kontrol: tek küçük salkım; üç dosya farklı; gölge yok; gerçek alfa.
Kullanım: `floret_N-96` (alfa kutusu, kare); `parts.css` `--ht-florets` ile site.js'e bildirilir: RSVP gönderilince 7 çiçekçik
yanıt panelinin üstünden salınarak düşer. Dosya yoksa çiçekçik yok (çizilmiş yedek yok).

#### W2.14 Pirinç madalyon çerçevesi (oval foto penceresi)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/locket_rim.png` · 1000×1250 · **Şeffaf zemin**

```
An open antique brass locket seen straight from the front, on a fully transparent background, filling the image edge to edge: an oval frame of warm antique brass (#A88437) about 10% of the image width thick, with a fine engraved border of tiny leaves and a slim beaded inner edge, a small round bail and ring at the top centre. The oval opening inside the frame is filled with flat pure green #00FF00 (no texture, no shading): it is 76% of the image width across (from 12% to 88% of the width) and 76% of the image height tall (from 16% to 92% of the height). Soft daylight from the top-left. No hinge lid, no chain, no shadow outside the locket. No text, letters, numbers, crests or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: oval pencere düz `#00FF00`, genişlikte %12–%88, yükseklikte %16–%92; üstte halka; kapak/zincir yok; gerçek alfa.
Kullanım: yeşil pencere ölçülür (`manifest rim.window_pct`) ve şeffaf yapılır → `rim-640`; her oval fotoğrafın (home kartı,
hikâye tanıtımı, Story'nin üç anı) çevresine konur, fotoğraf ve kapak ölçülen pencereye oturur.

#### W2.15 Madalyon kapağı (menteşede açılan)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/locket_lid.png` · 800×1000 · **Şeffaf zemin**

```
The closed front lid of the same antique brass locket as locket_rim.png, alone, seen straight from the front, on a fully transparent background, filling the image edge to edge (an oval, 0.8:1): warm antique brass with a softly domed surface, a delicate engraved spray of heather and a small thistle in the centre, a slim engraved border, a tiny hinge knuckle on the left edge, gentle highlights from the top-left. No bail, no chain, no frame around it, no shadow outside the oval. No text, letters, numbers, monograms, crests or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tek oval kapak (0,8:1); ortada funda + devedikeni gravürü; solda küçük menteşe; harf/monogram yok; gerçek alfa.
Kullanım: alfa kutusuna kırpılır → `lid-560` = `.lid`; fotoğrafın sahnesi gelince sol menteşesi üstünde açılır (geçici
pirinç oval kırpımın yerine).

#### W2.16 Devedikeni (imza süsü)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/thistle.png` · 800×1000 · **Şeffaf zemin**

```
A single Scotch thistle with a short stem and two leaves, photorealistic with a soft painterly finish, on a fully transparent background, filling about 88% of the image height: one full flower head with a soft purple tuft (#7B5A84) on a spiky green bulb, a slender stem, two graceful spiny leaves in muted moss green, a tiny sprig of heather crossing the stem. Centred, not cropped. Soft daylight from the top-left. No ribbon, no shadow. No text, letters, numbers, crests or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: tek devedikeni; mor tepe, iki yaprak; kurdele/gölge yok; gerçek alfa.
Kullanım: `thistle-400` = `.thistle`: home imzasının ve RSVP kapanışının üstünde (≈120 px).

#### W2.17 Zarftaki kart (boş, oval foto penceresi)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/card_small.png` · 1000×1166 · **Şeffaf zemin**

```
A flat vertical invitation card of the same cream paper as cream_paper.png, exactly 0.858:1, filling the image edge to edge (the card IS the image), seen straight on, with a softly torn deckle edge, a fine engraved brass-coloured border line inset from the edge and a tiny sprig of heather in each top corner, a very soft contact shade on the card itself. In its upper part an oval portrait window filled with flat pure green #00FF00 (no texture, no shading): 46% of the card's width across, horizontally centred, its top at 8% and its bottom at 57% of the card's height. Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```
Kontrol: oval pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.
Kullanım: alfa kutusuna kırpılır; yeşil pencere ölçülür (`manifest card_small.window_pct`) ve şeffaf yapılır →
`card_small-760` = zarftan yükselen kart; portre alanı ölçülen pencereye oturur, isim/tarih pencerenin altından başlar.
Pencere bulunamazsa build uyarır ve kart krem kâğıt kalır.

#### W2.18 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft daylight from the top-left: the tartan wool envelope of envelope_back.png, closed, with its straight flap, the leather strap of strap.png and the brass buckle of buckle.png, lying slightly below the centre on a deep moss-green wool throw, a sprig of heather (as heather_sprig.png) and a small thistle laid at the left, an open antique brass locket (as locket_rim.png, its window empty cream) at the right; behind, softly out of focus, an oil-painted Highland landscape with mist (as hills.png). The top 20% of the image is calm and soft. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no text, letters, numbers, crests or logos.
```
Kontrol: zarf bütün ve altta boşluklu; üst %20 sakin; yazı/arma yok.
Kullanım: `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı: üstten ~%21 kırpılır).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, a soft heather, moss and cream palette with warm leather and brass
accents, subtle film grain; ONE fictional couple in their early thirties, the same two people in every photo (they must not
resemble any real person or celebrity): Isla — long soft copper-red hair, pale skin with freckles, a slim gold ring;
Callum — short dark-brown hair, a neat short beard, fair skin. Modern, elegant clothing (a wool tweed jacket is fine; no
costume, no kilt). Oval photos are cropped from 4:5 portraits: keep faces and hands in the middle 70%. No text, no
frame, no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir. Portre ve Story fotoğrafları sitede **oval** (4:5) kırpılır.

#### 2.1 Ana portre
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Portrait 4:5 wedding photo of the fictional couple Isla and Callum, in their early thirties (Isla: long soft copper-red hair, pale skin with freckles, a slim gold ring; Callum: short dark-brown hair, a neat short beard, fair skin; they must not resemble any real person or celebrity) on a heather-covered hillside in soft overcast light: she in a simple ivory wool-crepe gown with a small posy of heather, he in a moss-green tweed suit, standing close and smiling at each other, waist-up, faces in the middle of the frame, misty hills softly out of focus behind them. Photorealistic, soft heather, moss and cream palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "A wet day on the hill"
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Portrait 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) laughing under one shared waxed jacket held over their heads in light rain on a narrow hill path, wet heather around them, soft grey light, misty slopes behind. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "A walk by the loch"
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Portrait 4:5: the same couple as hero_portrait.jpg walking hand in hand along the stony shore of a calm Highland loch in the evening, seen from slightly behind and to the side, her head turned towards him, low mist over the water and dark hills beyond. Photorealistic, same palette and grain. No text.
```

#### 2.4 Story 3 — "Among the heather"
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Portrait 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, holding a small sprig of purple heather, among blooming heather on a hillside, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant old stone country house with tall chimneys and a walled garden at the edge of a wooded Highland glen, a lawn with a few rows of simple wooden chairs set for a ceremony facing a wide view of misty purple hills, soft late-afternoon light. Not a real or famous building, no castle, no people, no signs, no text. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, blok `'highland-tartan-thistle'`). Şu an geçici
> (`composed`): krem kâğıt + üstte ve altta funda moru yün şeridi (temanın tonladığı dokular, ~195 ppi; ekose yok).
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** metin kutuları `layouts.ts`'teki ölçülerdir (ön `[21, 13, 19, 13]` = yükseklikte %21–%81, genişlikte
> %13–%87; arka `[17, 12, 10, 12]` = %17–%90 × %12–%88, yüzde: üst, sağ, alt, sol). Prompt'lar bu alanı ~%3 payla boş
> ister; alan aynı kalırsa kutular değişmeden kullanılır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'highland-tartan-thistle'` bloğunda `sources` → `{ front: 'print/invitation_front_5x7.png', back:
>    'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme highland-tartan-thistle` (artık kullanılmayan
>    `paper.webp`/`wool.webp` dosyalarını `public/print/highland-tartan-thistle/`'den sil) ve `node scripts/print-sample.ts
>    --theme highland-tartan-thistle --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the cream paper of cream_paper.png. Along the top edge a band of the tartan wool of tartan_wool.png about 12% of the height, with a slim brass-coloured rule on its lower edge and, centred just below the band, a small spray of heather and a thistle (as heather_divider.png), all staying above 17% of the height. Along the bottom edge a matching tartan band about 9% of the height with a slim brass-coloured rule on its upper edge (staying below 88%). The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no line, no shadow, no stain in it. No text, letters, numbers, crests, monograms, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı yok; ekose bantlar yalnız üstte ve altta.

#### P2 — Arka yüz
**Kaydet:** `collections/35_Highland_Tartan_Thistle/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream paper, only a narrow tartan band of tartan_wool.png along the top edge (about 7% of the height, with a slim brass-coloured rule on its lower edge, staying above 10% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flower, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar ekose bandı (%10'un üstünde); %14'ün altı boş; yazı yok.
