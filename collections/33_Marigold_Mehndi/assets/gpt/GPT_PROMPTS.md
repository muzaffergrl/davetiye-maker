# GPT görsel istekleri — Tasarım 33 · Marigold & Mehndi

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, scripts of any
> language, monograms, logos or watermarks in any image. No religious symbols or deities** (no Om, no swastika, no
> Ganesha, no temple, no sacred fire, no kalash): this is a festive, cultural look — marigolds, henna patterns, silk,
> brass lamps, carved arches — not a religious one. Give W2.1 `silk.png`, W2.14 `velvet.png`, W2.15 `paper.png` and
> W2.2 `sleeve.png` as the style reference of every later part: the same fuchsia silk, the same velvet, the same
> saffron paper, the same warm gold.

Bu dosya tasarım 33'ün **bütün görsel parçalarının** tek kaynağıdır (G182). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema
(`platform/themes/marigold-mehndi/`) **geçici** görsellerle çalışıyor: 14'ün fildişi saten dokusu fuşya ipeğe, 06'nın
düz lacivert kâğıdı kadife-fuşyaya (sayfa zemini daha koyu), 18'in düz pamuk kâğıdı safran-fildişine tonlandı; altın =
17'nin altın mührünün düz metal yüzeyinden dikdörtgen kırpım (defne yok). Zarf şimdilik ipek dokusundan dikdörtgen
parçalar (arka, ön cep, düz kapak) ve üstünde düz altın bir bant (kılıf); püskül, kadife çiçeği yaprakları, kemer,
kına, diya, alev ve çelenk **yok** (çizilmiş yedek yok, K21). Parçalar gelince ne değişeceği: tema README → "What
waits for GPT".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/33_Marigold_Mehndi/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/marigold-mehndi/build_images.py` — PAKET 5'in **her parçası geldiği anda
  kendiliğinden** kullanılır (G167 düzeni): img/ yeniden üretilir, `platform/themes/marigold-mehndi/parts.css` o
  parçaların kurallarıyla yazılır; gelmeyen parçanın kuralı yazılmaz, sayfa geçici görünümünde kalır (`img/manifest.json`
  → `parts.used` / `parts.waiting_for_gpt`). Sonra `python3 tools/kit_check.py collections/33_Marigold_Mehndi
  --paket 2`, `python3 tools/gpt_kuru_deneme.py --tema marigold-mehndi --sekil
  collections/33_Marigold_Mehndi/assets/gpt/kuru_sekil.json` (prova; gerçek parçalarla da koşulabilir) ve göz
  kontrolü. PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **rich Indian miniature painting detail + photorealistic silk** — real silk sheen, real velvet pile, real
  brass and gold leaf, fresh marigolds; fine henna line work in a deep henna brown. Classic, romantic, rich and festive;
  not a cartoon, not flat vector, not neon, not Bollywood poster.
- Renkler: fuchsia silk `#B3165E` · velvet `#5C0A36` · velvet plum `#3E0726` · saffron `#F2A13B` · saffron light
  `#F7C27A` · saffron ivory paper `#FAEBD0` · gold `#C9A24A` · gold light `#EBCD84` · henna brown `#7A3B1E`
- Işık: yumuşak, sıcak, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil).
  Parçalar gölgesiz (zemine düşen gölge yok; site ekler).
- Kültürel semboller yaygın ve saygılı: kadife çiçeği, kına deseni (paisley, çiçek, yaprak, nokta), pirinç diya
  (yalnız kandil, dini sahne değil), ipek püskül, Rajasthan jharokha kemeri. **Dini simge yok.**
- Gerçek bir mekâna, markaya, matbaaya veya başka bir satıcının tasarımına benzemesin. 27 Riad Lantern'dan (fas
  kapısı, fener, teal) ve 01–32'nin V kapak + mum mühürlü zarfından ayrı: burada mühür ve V kapak yok.

## Kapalı zarf geometrisi (W2.2, W2.11, W2.12, W2.13 buna göre)
Sahne **0,8 en / 1 boy** (dikey zarf). Yüzdeler sahnenin (sol, üst, genişlik, yükseklik): düz kapak `0, 0, 100, 42`;
ön cep `0, 38, 100, 62`; altın kılıf `-4, 30, 108, 36` (zarfın iki yanından %4 taşar, kapağın alt kenarını örter);
kart `8, 6, 84, 92` (0,73:1; içeride, kapak ve ön cebin arkasında). Püskül kılıfın alt kenarında, sağdan ~%26 içeride
asılı. Parçalar bu kutulara 100% × 100% gerilir: oranları buna göre verildi.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W2.1 Fuşya ipek (zarfın arkası, ön cebi, kapağı)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/silk.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of rich fuchsia raw silk (#B3165E) filling the whole square edge to edge: a fine slub weave, a soft natural sheen that moves in gentle diagonal waves, very subtle shot-silk warmth (a hint of saffron in the highlights). Calm and even everywhere, no fold, no seam, no pattern, no embroidery, no border, no vignette, no object. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); renk `#B3165E` civarı; parlaklık yumuşak; desen/yazı yok.
Kullanım: `silk-640` = zarfın arkası (koyu), ön cebi, kapağın ön yüzü (W2.12/W2.13 gelene kadar); basılı davetiyenin
geçici ipek şeridi.

#### W2.2 Altın lazer kesim paisley kılıf (açılışta yana kayar)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/sleeve.png` · 1200×500 · **Şeffaf zemin**

```
A wide horizontal band of thin gold metallic card, laser-cut in an intricate openwork pattern of paisleys, small marigold flowers and fine vines, seen straight from the front on a fully transparent background, the band filling the image edge to edge (2.4:1): warm gold (#C9A24A) with gold-leaf highlights (#EBCD84), the cut-outs are TRUE TRANSPARENT holes (about 40% of the band is open lace, so the silk behind shows through), a slim solid gold edge along the top and bottom. Soft warm light from the top-left, the gold gently curved as if wrapped round an envelope. No tassel, no seal, no shadow outside the band. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: bant tuvali dolduruyor (2,4:1); kesik yerleri gerçekten şeffaf; püskül/mühür yok; gerçek alfa.
Kullanım: alfa kutusuna kırpılır → `sleeve-900` = zarfın ortasındaki kılıf (geçici düz altın bandın yerine). Açılışta
300 ms'de hafifçe sola çekilip sağa kayarak çıkar; püskül onunla gider.

#### W2.3 Kadife çiçeği yaprakları (süzülen yapraklar) — üç ayrı dosya
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_1.png`, `petal_2.png`, `petal_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single loose marigold petal, photorealistic, alone, on a fully transparent background: a ruffled orange-saffron petal (#F2A13B, deeper orange at the base, a golden edge), soft and slightly curled, filling about 55% of the square, centred, not cropped. No stem, no whole flower, no shadow, no other petal. No text. True transparent background PNG (real alpha channel). (Make three different petals: 1 = a wide ruffled petal, 2 = a narrow curled petal, 3 = a small deep-orange petal.)
```
Kontrol: tek yaprak; üç dosya farklı; gölge yok; gerçek alfa.
Kullanım: `petal_1..3-96` (alfa kutusu, kare); `parts.css` `--mm-petals` ile site.js'e bildirilir: açılışta 1600 ms'den
sonra zarfın üstünden 14 yaprak dönerek süzülür; RSVP gönderilince 12 yaprak yağar. Dosya yoksa yaprak yok.

#### W2.4 Jharokha kemeri (foto çerçevesi; kemerli pencere)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/jharokha.png` · 1000×1300 · **Şeffaf zemin**

```
A carved Rajasthani jharokha window frame seen straight from the front, on a fully transparent background, the frame filling the image edge to edge (0.77:1): warm sandstone-and-gold carving with a scalloped (cusped) arch at the top, two slender carved pillars, a small domed canopy (chhatri) crown with a tiny gold finial at the top, a carved ledge with two small brackets at the bottom, fine gold-leaf accents and a few tiny inlaid fuchsia and saffron stones. The window opening inside is a cusped arch whose bounding box is exactly 4:5 — 64% of the image width wide (from 18% to 82%) and from 24% to 85.5% of the image height — and the whole opening is filled with flat pure green #00FF00 (no texture, no shading, crisp arch edges, nothing in front of it). Soft warm light from the top-left. No lattice in the window, no people, no shadow outside the frame. No text, letters, numbers or symbols, no religious figures. True transparent background PNG (real alpha channel).
```
Kontrol: pencere düz `#00FF00`, kutusu 4:5 ve tarifteki yerde (%18–%82 × %24–%85,5); kemer dilimli; dini figür yok; alfa.
Kullanım: yeşil pencere ölçülür (`manifest arch.window_pct`), şeffaf yapılır → `arch-640`; pencerenin şekli
`mask_arch.png` olur ve her fotoğraf (home kartı, hikâye tanıtımı, Story'nin üç anı) bu maskeyle kemerli kesilir.
Pencere 4:5'ten %3'ten fazla saparsa build uyarır (foto alanları 4:5 kırpılır). Pencere yoksa fotoğraflar kemersiz kalır.

#### W2.5 Kına deseni (kemerin çevresi; çizgi çizgi akar)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/henna.png` · 1000×1300 · **Şeffaf zemin**

```
Fine henna (mehndi) line art in a deep henna brown (#7A3B1E) on a fully transparent background, on the same 1000×1300 canvas as jharokha.png and drawn to sit AROUND that arch frame: delicate paisleys, small flowers, leaves, dots and flowing vines that climb up both sides from the bottom corners and meet over the arch crown, plus a few dotted trails reaching outwards; thin, even, hand-drawn lines like real henna on skin, no filled areas. The middle of the canvas where the frame and its window sit — from 12% to 88% of the width and from 8% to 92% of the height — stays EMPTY except where the vines cross the frame's outer edge. No background, no skin, no hand. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız ince kına çizgileri (dolgu yok); orta alan boş; jharokha ile aynı tuval; alfa.
Kullanım: `henna-720` = her kemerin üstünde aynı kutuda; fotoğraf alttan belirdikten sonra kına alttan yukarı **çizgi
çizgi** akar (adım adım ilerleyen maske; reduced motion'da sabit).

#### W2.6 Pirinç diya (sönük kandil)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/diya.png` · 600×420 · **Şeffaf zemin**

```
A single small traditional brass oil lamp (diya), photorealistic, seen from the front and slightly above, on a fully transparent background, filling about 90% of the image: a shallow almond-shaped polished brass bowl with a short pinched spout on the right, a few fine engraved petals on its side, a little oil inside and a cotton wick lying in the spout — UNLIT (no flame, no glow). Warm light from the top-left. No base cloth, no flowers, no shadow, no other object. No text. True transparent background PNG (real alpha channel).
```
Kontrol: tek sönük kandil; alev/ışıma yok; fitil ağızda; alfa.
Kullanım: `diya-160`: açılışta zarfın altında 5'li sıra, home imzasında 5'li, RSVP kapanışında 3'lü sıra.

#### W2.7 Diya alevi
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/flame.png` · 256×512 · **Şeffaf zemin**

```
A single small oil-lamp flame, photorealistic, alone, on a fully transparent background, filling about 85% of the image height: a soft teardrop flame, white-gold core, saffron and orange edges, a faint blue at the base, the very tip slightly curved, centred with its base at the bottom-centre of the image. No wick, no lamp, no glow beyond the flame, no smoke, no sparks. No text. True transparent background PNG (real alpha channel).
```
Kontrol: tek alev; tabanı alt ortada; dışa taşan hâle yok; alfa.
Kullanım: `flame-96`: her diyanın fitilinin üstünde; açılışta 1800 ms'den sonra soldan sağa **tek tek** yanar, sonra
hafifçe titrer; imzalarda sahne görününce sırayla yanar (site turuncu bir `drop-shadow` ışık ekler).

#### W2.8 Kadife çiçeği çelengi
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/garland.png` · 1800×420 · **Şeffaf zemin**

```
A festive garland of fresh marigolds (toran) seen straight from the front on a fully transparent background, filling the image width: two graceful swags of densely strung orange and saffron-yellow marigold flowers hanging from the top edge, held at three points (left end, centre, right end), with short strands of marigolds and a few green mango leaves hanging down between the swags, small fuchsia rose buds tucked in here and there. Photorealistic flowers, soft warm light from the top-left. The top edge of the garland runs along the very top of the image. No string ends visible outside, no wall, no shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: iki sarkan kavis, üst kenar boyunca; çiçekler gerçekçi; arka plan yok; alfa.
Kullanım: `garland-900`: açılış sayfasının ve home hero'nun üst kenarında tam genişlik; davet başlığının, details
programının ve RSVP formunun üstünde küçük (%70).

#### W2.9 Kına deseni zemini (Story arka planı)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/mehndi_pattern.png` · 1024×1024 · **Şeffaf zemin**, dikişsiz

```
A seamless, tileable all-over pattern of fine henna (mehndi) line art in a light saffron-gold (#F7C27A) on a fully transparent background: an even scatter of small paisleys, tiny flowers, leaves and dots linked by delicate vines, thin even lines, no filled areas, generous space between motifs. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: dikişsiz; yalnız ince çizgi; motifler seyrek; alfa.
Kullanım: `mehndi-640` = Story sayfasının arkasında sabit, %14 opaklık.

#### W2.10 Astardan yükselen kart (boş, kemerli foto penceresi)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/card_small.png` · 1022×1400 · **Şeffaf zemin**

```
A flat vertical invitation card of the same saffron-ivory paper as paper.png, exactly 0.73:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine gold-foil border of tiny paisleys inset from the edge and a small marigold sprig in each of the two lower corners, a very soft contact shade on the card itself. In its upper part a portrait window shaped as a cusped (scalloped) Rajasthani arch with a 4:5 bounding box — 60% of the card's width wide, horizontally centred, its top at 8% of the card's height — filled with flat pure green #00FF00 (no texture, no shading, crisp edges), with a slim gold carved rim round it. Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```
Kontrol: kemer pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.
Kullanım: alfa kutusuna kırpılır; yeşil pencere ölçülür (`manifest card_small.window_pct`), şeffaf yapılır ve şekli
`mask_card.png` olur → `card_small-860` = astardan yükselen kart; portre ölçülen pencereye kemerli oturur, isim/tarih
pencerenin altından başlar. Pencere bulunamazsa build uyarır ve kart safran kâğıt kalır.

#### W2.11 İpek püskül (kılıftan sarkar, sallanır)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/tassel.png` · 300×1000 · **Şeffaf zemin**

```
A single silk tassel hanging straight down, photorealistic, seen from the front on a fully transparent background, filling the image height: a short twisted gold cord loop at the very top centre (where it hangs from), a small gold-thread wrapped head with a few tiny beads, and a full skirt of fine fuchsia silk threads (#B3165E) with saffron and gold threads mixed in, the ends slightly uneven. Soft warm light from the top-left. No hook, no shadow, no background. No text. True transparent background PNG (real alpha channel).
```
Kontrol: tek püskül; asılma noktası üst ortada; dikey; alfa.
Kullanım: `tassel-200`: kılıfın alt kenarında asılı; kapalıyken hafifçe salınır, dokununca sarkaç gibi sallanıp sönümlenir
(üst ortadan döner), kılıfla birlikte kayar.

#### W2.12 Zarfın ön cebi
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/envelope_front.png` · 1290×1000 · **Şeffaf zemin**

```
The front pocket of a fuchsia silk envelope, seen straight from the front on a fully transparent background, filling the image edge to edge (1.29:1): the same fuchsia raw silk as silk.png stretched over card, a perfectly STRAIGHT horizontal top edge finished with a slim gold piping and a fine line of tiny gold embroidered dots just below it, the other three edges straight and crisp with a hairline gold edge. Soft warm light from the top-left. No flap, no seal, no sleeve, no shadow outside. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: dikdörtgen cep; üst kenar düz ve altın biyeli; mühür/kapak yok; alfa.
Kullanım: `env_front-900` = ön cep (zarfın %38–%100'ü); kart astardan bunun arkasından yükselir.

#### W2.13 Zarfın düz kapağı (ön yüz)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/flap.png` · 1524×800 · **Şeffaf zemin**

```
The closed top flap of the same fuchsia silk envelope, seen straight from the front on a fully transparent background, filling the image edge to edge (1.9:1): a RECTANGULAR flap (not a V, not a point) of the same fuchsia raw silk as silk.png, its lower edge straight with a slim gold piping and a delicate border of tiny gold-embroidered paisleys along it, a soft fold highlight along the top edge where it is hinged. Soft warm light from the top-left. No seal, no button, no sleeve, no shadow outside. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```
Kontrol: dikdörtgen kapak (V değil); alt kenar düz ve altın biyeli; mühür yok; alfa.
Kullanım: `flap-900` = kapağın ön yüzü (zarfın %0–%42'si); açılışta üst kenarı üstünde 0°→90° döner, kadife iç yüz
(W2.14) −90°→0° devralır.

#### W2.14 Kadife (astar, kapağın iç yüzü, sayfa zemini)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/velvet.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of deep fuchsia-plum silk velvet (#5C0A36) filling the whole square edge to edge: a soft dense pile with a gentle crushed-velvet sheen, slightly lighter where the pile catches the light, calm and even everywhere so light text can read on a darker version of it. No fold, no seam, no pattern, no vignette, no object. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: dikişsiz; kadife hav dokusu; renk `#5C0A36` civarı; desen yok.
Kullanım: `velvet-640` = astar ve kapağın iç yüzü; %66 parlaklıkta = sayfa zemini `ground-640` (üstünde yazı okunur).

#### W2.15 Safran-fildişi kâğıt (kartlar, bantlar, form)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of fine handmade cotton paper in a warm saffron-ivory (#FAEBD0): a gentle natural tooth, a few tiny soft fibres, a very slight warm mottling, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no printing, no gold, no pattern. Edges tile without a seam. No text, letters, numbers or symbols.
```
Kontrol: sakin (üstüne koyu yazı her yerde okunur); safran-fildişi; dikişsiz; leke/baskı yok.
Kullanım: `paper-640/1024` = home kartı, davet ve gün bantları, details program kâğıdı, RSVP formu, açılış kartı (W2.10
gelene kadar).

#### W2.16 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft warm light from the top-left: the fuchsia silk envelope of silk.png, flap closed, held in the gold laser-cut paisley sleeve of sleeve.png with the silk tassel of tassel.png hanging from it, lying slightly below the centre on deep fuchsia-plum velvet (as velvet.png); a few loose marigold petals and two small lit brass diyas at the left, a short strand of marigolds at the right; a marigold garland (as garland.png) softly out of focus along the top edge. The top 20% of the image is calm. This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people, no hands, no text, letters, numbers or symbols, no logos, no religious objects.
```
Kontrol: zarf bütün ve altta boşluklu; üst %20 sakin; yazı/dini nesne yok.
Kullanım: `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı: üstten ~%21 kırpılır).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, a warm saffron, fuchsia and gold palette, soft golden light,
subtle film grain; ONE fictional couple in their early thirties, the same two people in every photo (they must not
resemble any real person, actor or celebrity): Anaya — long dark-brown hair in a loose low braid with a few marigolds,
warm medium-brown skin, a small gold nose stud, fine henna on her hands; Kabir — short black hair, a neat short beard,
warm light-brown skin. Elegant festive clothing: she in a fuchsia-and-gold silk lehenga or saree, he in an ivory or
saffron silk sherwani (no costume, no religious ritual, no sacred fire, no temple). Arched photos are cropped from 4:5
images: keep faces and hands in the middle 70%. No text, no frame, no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir. Story ve ana portre sitede **kemerli** (4:5) kırpılır.

#### 2.1 Ana portre
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Anaya and Kabir, in their early thirties (Anaya: long dark-brown hair in a loose low braid with a few marigolds, warm medium-brown skin, a small gold nose stud, fine henna on her hands; Kabir: short black hair, a neat short beard, warm light-brown skin; they must not resemble any real person or celebrity) in a sunlit courtyard of an old haveli with carved sandstone arches and marigold garlands softly out of focus behind them: she in a fuchsia-and-gold silk lehenga, he in an ivory silk sherwani with a saffron stole, standing close, foreheads almost touching, smiling, waist-up, faces in the upper middle of the frame. Photorealistic, warm saffron, fuchsia and gold palette, subtle grain. No text, no frame, no religious objects.
```

#### 2.2 Story 1 — "A monsoon afternoon"
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin), in casual modern clothes, sharing one umbrella and laughing outside a small old bookshop on a rainy monsoon afternoon, wet street reflections, warm shop light, a few books in her arms. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "Kites over the rooftops"
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5: the same couple as hero_portrait.jpg on a sunny flat rooftop of an old pink-sandstone city, flying a bright kite together, she holding the spool and laughing, he guiding the string, many small colourful kites in a clear blue sky above, old rooftops and domes softly behind. Photorealistic, same palette and grain. No text, no readable signs.
```

#### 2.4 Story 3 — "Among the marigolds"
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hennaed hand with a slim gold ring resting in his, over a brass tray heaped with fresh marigold flowers and petals, soft warm light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text, no religious objects.
```

#### 2.5 Mekân
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: the courtyard garden of an elegant old haveli at golden hour, carved sandstone arches and jharokha balconies round a lawn, rows of simple chairs with fuchsia and saffron silk sashes facing a low floral stage of marigold garlands (no religious structure), strings of small warm lights, brass lamps along the path. No people, no signs, no text. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`, blok `'marigold-mehndi'`). Şu an geçici
> (`composed`): safran kâğıt + üstte ve altta fuşya ipek şeridi (temanın tonladığı dokular; kâğıt ~195 ppi, ipek ~120 ppi).
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden önemli hiçbir şey yan kenarların %8'ine girmez.
> **Yazı alanı:** metin kutuları `layouts.ts`'teki ölçülerdir (ön `[21, 13, 19, 13]` = yükseklikte %21–%81, genişlikte
> %13–%87; arka `[17, 12, 10, 12]` = %17–%90 × %12–%88, yüzde: üst, sağ, alt, sol). Prompt'lar bu alanı ~%3 payla boş
> ister; alan aynı kalırsa kutular değişmeden kullanılır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. `layouts.ts` `'marigold-mehndi'` bloğunda `sources` → `{ front: 'print/invitation_front_5x7.png', back:
>    'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg:
>    cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme marigold-mehndi` (artık kullanılmayan
>    `paper.webp`/`silk.webp` dosyalarını `public/print/marigold-mehndi/`'den sil) ve `node scripts/print-sample.ts
>    --theme marigold-mehndi --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the saffron-ivory paper of paper.png. Along the top edge a marigold garland of two swags (as garland.png) hanging over a narrow band of fuchsia silk about 9% of the height, its flowers reaching down to at most 15% of the height. Along the bottom edge a band of fuchsia silk about 8% of the height with a slim gold-foil paisley border on its upper edge (staying below 87%), and fine henna vines (as henna.png, deep henna brown) climbing a little way up from the two bottom corners along the side edges (staying outside the middle 80% of the width). The rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos, watermarks or religious symbols. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %18–%84 × %10–%90 tamamen boş; yazı/dini simge yok; çelenk üstte, ipek bant altta.

#### P2 — Arka yüz
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same saffron-ivory paper, only a narrow band of fuchsia silk along the top edge (about 6% of the height) with a slim gold-foil paisley border on its lower edge and a few loose marigold petals scattered just below it (everything staying above 10% of the height). Everything below 14% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no petal, no line, no shadow, no stain. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar ipek bant + birkaç yaprak (%10'un üstünde); %14'ün altı boş; yazı yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> Set bu tasarımın kendi dünyası (PAKET 3 yok; `EK_SETLER`): bütün sahnelerde aynı masa, süs, ışık. Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 33`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Marigold & Mehndi". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a fuchsia silk cloth over a carved dark wood low table, fresh marigold garlands, a saffron silk tassel, a small brass bowl of marigold petals and a fold of plum velvet with fine gold embroidery, the same light and the same color world (fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a fuchsia silk cloth over a carved dark wood low table, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by fresh marigold garlands, a saffron silk tassel, a small brass bowl of marigold petals and a fold of plum velvet with fine gold embroidery, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a fuchsia silk cloth over a carved dark wood low table, fresh marigold garlands, a saffron silk tassel, a small brass bowl of marigold petals and a fold of plum velvet with fine gold embroidery. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and fresh marigold garlands, a saffron silk tassel. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a fuchsia silk cloth over a carved dark wood low table, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: fresh marigold garlands, a saffron silk tassel, a small brass bowl of marigold petals and a fold of plum velvet with fine gold embroidery. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a fuchsia silk cloth over a carved dark wood low table, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with fresh marigold garlands, a saffron silk tassel, a small brass bowl of marigold petals and a fold of plum velvet with fine gold embroidery arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a fuchsia silk cloth over a carved dark wood low table: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: fresh marigold garlands, a saffron silk tassel, a small brass bowl of marigold petals and a fold of plum velvet with fine gold embroidery. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a fuchsia silk cloth over a carved dark wood low table: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: fresh marigold garlands, a saffron silk tassel, a small brass bowl of marigold petals and a fold of plum velvet with fine gold embroidery. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a fuchsia silk cloth over a carved dark wood low table, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: fresh marigold garlands, a saffron silk tassel, a small brass bowl of marigold petals and a fold of plum velvet with fine gold embroidery. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes fresh marigold garlands, a saffron silk tassel; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a fuchsia silk cloth over a carved dark wood low table, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/33_Marigold_Mehndi/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a fuchsia silk cloth over a carved dark wood low table: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: fresh marigold garlands, a saffron silk tassel, a small brass bowl of marigold petals and a fold of plum velvet with fine gold embroidery. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: fuchsia silk, plum velvet, saffron, saffron ivory paper and warm gold. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
