# GPT görsel istekleri — Tasarım 43 · Chartreuse Garden Party

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, names, dates,
> initials, monograms, logos, labels, stamps, seals or watermarks in any image, and no QR codes.** The flowers are
> hand-painted gouache invented for this design — not a copy of any existing illustration, wallpaper, fabric or
> stationery. Every photo frame is a generic instant-film style print with no brand marks. Give W1 `cream_paper.png`,
> W2 `chartreuse_paper.png` and W3 `env_back.png` as the style reference of every later part: the same cream cotton
> paper, the same chartreuse envelope stock, the same vivid opaque gouache flowers in peony pink, raspberry, burgundy
> and chartreuse, the same bright daylight from the top-left.

Bu dosya tasarım 43'ün **bütün görsel parçalarının** tek kaynağıdır (4. dalga 39–48, `docs/33_GPT_YENI_10_TASARIM.md`,
akım şeridi). Tasarım henüz `concept`: tema (`platform/themes/chartreuse-garden-party/`) **yok**, geçici görsel de yok;
parçalar repoya geldikçe tema bunlarla kurulacak (G4NN benzeri iş, önerilen G443). Claude şekil/dekor çizmez (K21): gelmeyen parçanın
çizilmiş yedeği olmaz.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/43_Chartreuse_Garden_Party/assets/gpt/` altındaki `parts/`
  (PAKET 5), `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle;
  kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 tools/kit_check.py collections/43_Chartreuse_Garden_Party --paket 5` ve `--paket 2`. Tema
  kurulunca `python3 platform/themes/chartreuse-garden-party/build_images.py` PAKET 5'in **her parçasını geldiği anda**
  kullanır (G167 düzeni: img/ yeniden üretilir, `parts.css` gelen parçaların kurallarıyla yazılır; gelmeyenler
  `img/manifest.json` → `parts.waiting_for_gpt`), ardından `python3 tools/gpt_kuru_deneme.py --tema
  chartreuse-garden-party --sekil collections/43_Chartreuse_Garden_Party/assets/gpt/kuru_sekil.json` (prova; gerçek
  parçalarla da koşulabilir), theme-check ve göz kontrolü. PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **vivid hand-painted gouache + photorealism** — opaque, velvety gouache flowers with visible brush strokes
  and a little paper tooth in the paint, real heavy cream cotton paper, real chartreuse envelope stock, a real white
  instant-film style print card, real polished gold wire; bright spring daylight from the top-left; classic, romantic,
  rich and joyful, a garden party. Not cartoon, not flat vector, not clip-art, not neon, not a sticker sheet.
- Çiçekler (bütün parçalarda **aynı** guaj eli): şakayık (peony, peony pink), düğün çiçeği (ranunculus; pembe ve
  ahududu), ıtır (sweet pea; açık pembe, kıvrık filizli), kozmos (bordo, ince saplı), aslanpençesi (lady's mantle;
  köpük gibi chartreuse çiçekçikler, taraklı yaprak), yapraklar (leaf green).
- Renkler: chartreuse `#C7CF3C` · chartreuse deep `#8F9726` · chartreuse light `#E6EBA0` · peony pink `#F1A9C0` ·
  raspberry `#C8436F` · burgundy `#6B1730` · leaf green `#4F7A3A` · cream `#FBF6EA` · ink `#2A1B1F`.
- Işık: parlak gün ışığı, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni
  değil), nesne tuvalin en az %6 içinde, nesnenin dışında gölge ya da hâle yok (gölgeyi site ekler).
- Anlık baskılar: genel bir "instant-film style print" — beyaz kart, kalın alt kenar; marka, logo, yazı, tarih yok.
  PAKET 2'de 2.2–2.4 siyah-beyaz.
- Gerçek bir mekâna, markaya, sanatçıya ya da başka bir satıcının tasarımına benzemesin. 38 Papel Picado'dan ayrı:
  kâğıt kesim, bayrak, ampul yok; 02 Dusty Blue'dan ayrı: toz mavisi ve okaliptüs yok.

## Kapalı zarf geometrisi (W3–W7 buna göre)
Zarf **yatay**, arkadan görünür; tuval **1400×1000**, zarf kutusu **x %7–93, y %9–91** (x 98–1302 px, y 90–910 px;
1204×820 px — şartnamedeki ≈1,4:1 yatay oran, esas olan kutu yüzdeleri). Arka (W3), ön cep (W4) ve kapak (W5) **aynı
tuvalde, aynı konumda** çizilir; Claude her birini kendi kutusuna kırpar. Zarfın yüzdesiyle:
- **Ön cep** %36'dan alta: üst kenarı geniş, yumuşak bir yay — yanlarda %36'da (y≈385 px), ortada %50'ye iner (y≈500 px).
- **Dalgalı kapak** üstten iner: alt kenarı **7 sığ, eşit tarak** — yan kenarlarda %40'ta (y≈418 px), ortadaki tarağın
  ucunda **%56**'da (y≈549 px). Kapak her yerde cebin üst kenarının altına iner (aralık kalmaz).
- **İki yarık** kapağın ucuna yakın: kısa dikey kesikler, yatayda zarfın **%44** ve **%56**'sı (x≈628 ve x≈772 px),
  düşeyde **%50** (y≈500 px), her biri zarf boyunun ~%4'ü.
- **Çiçek sapı** (W7, ayrı tuval) iki yarık arasından yatay geçer: çiçek solda kapağın üstünde, sap %44'teki yarıktan
  girip kapağın altından %56'daki yarıktan çıkar (tema sap ile kapak arasındaki şeridi kapaktan keserek üstte tutar).
- **Kapağın iç yüzü** (W6) ayrı tuvalde (1400×700), aynı ölçekte: katlanma çizgisi altta, taraklar üstte.
Açılışta sap sağa kayıp çıkar, çiçek takla atarak düşer, kapak üst kenarında 3B açılır, 4 çiçek kümesi (W8) zarfın
arkasından sırayla büyür, kart (W9) cepten yükselir.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W1 Krem pamuk kâğıt (kartlar, sayfa zemini, form)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/cream_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of thick cold-pressed cotton paper in a warm cream (#FBF6EA), the kind of heavy art paper gouache is painted on: a soft fine tooth, a few faint cotton fibres, the gentlest warm mottling, an even tone everywhere, calm enough for dark ink text (#2A1B1F) to read on it anywhere. Evenly lit by bright daylight from the top-left. No fold, no crease, no deckle edge, no stain, no paint marks, no printing, no pattern, no shadow, no vignette. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz (2×2 yan yana ek yeri yok); sakin krem `#FBF6EA` civarı; leke/boya izi yok; üstüne koyu yazı okunur.
Kullanım: tema kurulunca sayfa zemini, home kartı, RSVP formu, details program kâğıdı; zarftan yükselen kart (W9 gelene
kadar).

#### W2 Chartreuse zarf kâğıdı (bantlar, zarf rengi referansı)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/chartreuse_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of heavy, softly textured pigment-dyed paper in a vivid chartreuse (#C7CF3C), the stock of a fine spring garden-party envelope: a gently felted matte surface, fine darker fibres (#8F9726) and tiny paler flecks (#E6EBA0) scattered evenly through the sheet, a very soft natural tonal variation, calm and even so cream or ink text reads on it everywhere. Evenly lit by bright daylight from the top-left. No fold, no crease, no stain, no printing, no pattern, no shadow, no vignette, not glossy, not neon. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: dikişsiz; chartreuse `#C7CF3C` civarı (neon değil, mat); ince lifler; leke/desen yok.
Kullanım: tema kurulunca home davet bandı ve details "The Day" bandı; zarfın cebi ve kapağı (W3–W5 gelene kadar); zarf
rengi referansı.

#### W3 Zarfın arkası (iç astar görünür)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/env_back.png` · 1400×1000 · **Şeffaf zemin**

```
The back panel of an open landscape envelope made of the chartreuse paper of chartreuse_paper.png, seen perfectly straight on, on a fully transparent background. The envelope occupies exactly x 7–93% and y 9–91% of the 1400×1000 canvas (from x 98 px to x 1302 px and from y 90 px to y 910 px), a crisp wide rectangle with very slightly softened corners. Its inside faces us and is lined all over with a cream paper liner (#FBF6EA) hand-painted in vivid opaque gouache with a dense, joyful, all-over repeat of garden flowers: full peonies in peony pink (#F1A9C0), cupped ranunculus in raspberry (#C8436F), small deep burgundy cosmos (#6B1730) on wiry stems, soft pink sweet peas with curling tendrils, frothy sprays of chartreuse lady's mantle (#C7CF3C) and fresh leaves (#4F7A3A) — velvety strokes with visible brush marks and a little paper tooth, painted by hand, not printed, not a copy of any existing wallpaper or fabric. A slim edge of the chartreuse paper (about 2% of the envelope's width) frames the liner along the top and both sides. Bright daylight from the top-left, a gentle shade towards the bottom where the pocket will sit. No flap, no front pocket, no flower stem, no card inside. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf tuvalin x %7–93, y %9–91 kutusunda; iç yüz baştan sona guaj çiçek astarı, kenarlarda ince chartreuse pay;
kapak/cep/sap yok; kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca zarf kutusuna kırpılır → `.env-back` (kapak açılınca görünen iç); bütün sonraki parçaların stil
referansı.

#### W4 Zarfın ön cebi
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/env_front.png` · 1400×1000 · **Şeffaf zemin**

```
Only the front pocket of the same chartreuse envelope as env_back.png, on the same 1400×1000 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 9–91% of the canvas (x 98–1302 px, y 90–910 px); the pocket spans its full width and its bottom edge lies on the envelope's bottom edge (y 910 px). The pocket's top edge is one wide, smooth, gentle arc: it sits at 36% of the envelope's height at the left and right sides (y ≈ 385 px) and dips to 50% of the envelope's height at the centre (y ≈ 500 px), finished as a crisp folded paper edge with a soft rolled highlight. Made of the chartreuse paper of chartreuse_paper.png (#C7CF3C), with two faint diagonal fold lines rising from the bottom corners where the side flaps are glued underneath and a very soft contact shade on the paper just below the arced edge. Bright daylight from the top-left. Everything above the arc is completely transparent. No flap, no liner, no stem, no flower, no card. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: cep zarf kutusunun tam eninde; üst kenar yanlarda %36, ortada %50'ye inen yay; üstü tamamen şeffaf; kapak/sap
yok; gerçek alfa.
Kullanım: tema kurulunca cep kutusuna kırpılır → `.env-front`; kart bunun arkasından yükselir.

#### W5 Dalgalı kapak (kapalı, dış yüz)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/flap.png` · 1400×1000 · **Şeffaf zemin**

```
Only the closed scalloped flap of the same chartreuse envelope, on the same 1400×1000 canvas and in exactly the same place, on a fully transparent background. The envelope occupies exactly x 7–93% and y 9–91% of the canvas (x 98–1302 px, y 90–910 px); the flap spans its full width from the envelope's top edge (y 90 px), with a soft rounded fold along the top, and lies folded down over the pocket. Its lower edge is a wide, gentle downward curve made of exactly seven even, shallow, rounded scallops (each about 3% of the envelope's height deep): it meets the envelope's left and right sides at 40% of the envelope's height (y ≈ 418 px) and reaches its lowest point, the tip of the middle scallop, at the centre at 56% of the envelope's height (y ≈ 549 px). Near the tip two small, neat vertical slits are cut through the flap, each about 4% of the envelope's height long, centred at 50% of the envelope's height (y ≈ 500 px) and at 44% and 56% of the envelope's width (x ≈ 628 px and x ≈ 772 px), well inside the paper and clear of the scalloped edge — thin dark cuts with a hint of shadowed gap, empty (the flower stem is a separate image). The chartreuse paper of chartreuse_paper.png (#C7CF3C), a fine crisp edge along every scallop, a very soft contact shade on the paper just inside the scalloped edge. Bright daylight from the top-left. Everything below the scalloped edge is completely transparent. No stem, no flower, no seal, no sticker, no ribbon. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tam 7 tarak; yanlarda %40, ortada uç %56; ucun üstünde iki küçük dikey yarık (boş); mühür/sap yok; altı
tamamen şeffaf; gerçek alfa.
Kullanım: tema kurulunca kapak kutusuna kırpılır → `.flap` (kapalı kapak); açılışta üst kenarında 3B döner. Yarıklar
arasındaki şerit sapın üstüne ayrı katman olarak kesilir (sap yarıktan geçiyor görünür).

#### W6 Kapağın iç yüzü (açıkken)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/flap_in.png` · 1400×700 · **Şeffaf zemin**

```
The inside face of the same scalloped flap as flap.png, alone, as it stands up above the envelope when the flap is open, seen straight on, on a fully transparent background. Same outline and the same scale as flap.png but mirrored top-to-bottom: its straight fold line is at the BOTTOM and its seven scallops are at the TOP. The flap occupies x 7–93% of the 1400×700 canvas (x 98–1302 px, the same width as the envelope in env_back.png); its straight fold line runs along y 94% (658 px); its scalloped edge rises from y ≈ 330 px at the left and right ends to the tip of the middle scallop at y ≈ 199 px at the centre. It is lined with the same hand-painted gouache flower liner as env_back.png (peonies, raspberry ranunculus, burgundy cosmos, pink sweet peas, chartreuse lady's mantle and fresh leaves on cream), with a slim edge of chartreuse paper following the scallops; the two small slits show as thin cuts just below the tip (y ≈ 248 px, at x ≈ 628 px and x ≈ 772 px). Bright daylight from the top-left. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: düz katlama çizgisi altta, 7 tarak üstte; astar W3 ile aynı guaj desen; iki yarık ucun altında; gerçek alfa.
Kullanım: tema kurulunca kapak 3B açılınca (zarfın üstünde dik dururken) görünen iç yüz.

#### W7 Çiçek sapı (kapanış: tek pembe düğün çiçeği)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/stem.png` · 1400×400 · **Şeffaf zemin**

```
A single pink ranunculus lying horizontally with its long slender stem and two leaves, alone, hand-painted in vivid opaque gouache, seen from above, on a fully transparent background: at the left end one full, many-petalled cup of tightly layered petals in peony pink (#F1A9C0) deepening to raspberry (#C8436F) at the heart, about 52% of the image height across; from it a long, smooth, very slightly curving stem (#4F7A3A) runs to the right, with two small pointed leaves along it and a neatly cut end at the right. The whole flower is about 76% of the image width, centred, lying flat and straight enough to pass through two slits in a paper flap. Velvety gouache strokes with visible brush marks and a little paper tooth, the same hand as env_back.png. Bright daylight from the top-left. No ribbon, no twine, no other flower, no envelope. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek yatay düğün çiçeği, çiçek solda, sap sağa uzanıyor, iki yaprak; kurdele yok; kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca kapalı zarfta yarıklardan geçen sap (`.stem`); dokununca sağa kayıp çıkar, çiçek takla atarak
düşer.

#### W8 Guaj çiçek kümeleri (açılışta patlayan) — dört ayrı dosya
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/bloom_1.png`, `bloom_2.png`, `bloom_3.png`, `bloom_4.png` · her biri 800×800 · **Şeffaf zemin**

```
A single lush cluster of garden flowers hand-painted in vivid opaque gouache, alone, on a fully transparent background: a rounded, generous bunch with a few leaves and buds peeking out at its edges, filling about 80% of the square, centred, seen from the front and slightly above. Velvety gouache strokes with visible brush marks and a little paper tooth, the same hand and the same palette as env_back.png, crisp painted edges. Bright daylight from the top-left. No vase, no ribbon, no paper behind it. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make four clusters, the same size and style: 1 = one large open peony in peony pink #F1A9C0 with two round buds and its leaves #4F7A3A; 2 = three deep burgundy cosmos #6B1730 on wiry stems over a froth of chartreuse lady's mantle #C7CF3C with its scalloped leaves; 3 = a spray of soft pink sweet peas in three pinks with curling tendrils and small leaves; 4 = four cupped raspberry ranunculus #C8436F with small leaves.)
```
Kontrol: her dosyada tek küme; dört dosya dört farklı çiçek; vazo/kurdele yok; kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca açılışta zarfın arkasından sırayla, aşan ölçekle büyüyen dört küme; home üst kenarında
küçülmüş hâlleri; imzada küçük.

#### W9 Zarftaki kart (boş)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/card_small.png` · 1000×1400 · **Şeffaf zemin**

```
A flat portrait invitation card of the cream cotton paper of cream_paper.png, alone, seen straight on, on a fully transparent background: the card occupies x 7–93% and y 6–94% of the 1000×1400 canvas, with softly rounded corners and a crisp clean-cut edge. Along its top edge a small, delicate row of hand-painted gouache flowers — tiny peonies, raspberry ranunculus buds, sweet peas, one burgundy cosmos and frothy chartreuse lady's mantle with small leaves — staying within the top 16% of the card, the same hand as env_back.png. Everything below is EMPTY, calm paper (the website sets the names and the date there). Bright daylight from the top-left, a very soft contact shade on the card itself only. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek krem kart; çiçek dizisi yalnız üst %16'da; altı tamamen boş; yazı yok; gerçek alfa.
Kullanım: tema kurulunca zarftan yükselen kart (`card_small`); isim ve tarih HTML olarak çiçek dizisinin altına dizilir.

#### W10 Anlık baskı çerçevesi (kare foto penceresi)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/instant_frame.png` · 880×1060 · **Şeffaf zemin**

```
A single blank instant-film style print, alone, seen perfectly straight on, on a fully transparent background: one bright soft-white instant print card with a fine matte paper surface and very slightly rounded corners. The print occupies x 60–820 px and y 76–984 px of the 880×1060 canvas (760 × 908 px); its top and side borders are about 55 px wide and its bottom border is deep, about 204 px — the classic thick lower margin, left EMPTY (no writing). In its upper part a square photo window exactly 650 px wide and 650 px tall, its top-left corner at x 115 px, y 130 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Bright daylight from the top-left, a faint sheen on the white border. No clip, no tape, no pick, no flower over it. Generic, no brand marks. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, kare 650×650, sol üst (115, 130); alt kenar kalın ve boş; baskı tuvalin %6 içinde;
gerçek alfa.
Kullanım: tema kurulunca yeşil pencere ölçülür (`manifest instant_frame.window_pct`) ve şeffaf yapılır; home kartında
portre, hikâye tanıtımı ve Story'nin üç anı (fotoğraf kareye kırpılır, Story'de siyah-beyaz). Her baskı W12 çubuğunun
spiralinde durur, aranjmandan (W13) yükselip sallanır.

#### W11 Geniş anlık baskı (mekân fotoğrafı)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/instant_wide.png` · 1500×1080 · **Şeffaf zemin**

```
A single blank wide-format instant-film style print, alone, seen perfectly straight on, on a fully transparent background: one bright soft-white landscape instant print card, the same white paper and corners as instant_frame.png. The print occupies x 96–1404 px and y 70–1010 px of the 1500×1080 canvas (1308 × 940 px); its top and side borders are about 55 px wide and its bottom border is deep, about 210 px, left EMPTY (no writing). A landscape photo window exactly 1200 px wide and 675 px tall (16:9), its top-left corner at x 150 px, y 125 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). Bright daylight from the top-left, a faint sheen on the white border. No clip, no tape, no pick, no flower over it. Generic, no brand marks. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: pencere düz `#00FF00`, 1200×675 (16:9), sol üst (150, 125); alt kenar kalın ve boş; gerçek alfa.
Kullanım: tema kurulunca details'te mekân fotoğrafının çerçevesi (pencere ölçülür); iki çubukta yükselip hafifçe sallanır.

#### W12 Altın tel çiçekçi çubuğu
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/florist_pick.png` · 200×900 · **Şeffaf zemin**

```
A single florist's card pick standing perfectly upright, alone, seen straight on, on a fully transparent background: one slender, straight, polished warm gold wire about 10 px thick, its lower end cut to a neat point, and at its top a small flat spiral coil of the same wire, three turns, about 60% of the image width across, the kind of holder that grips a card or a print from behind. The pick fills about 88% of the image height, centred. Bright daylight from the top-left gives a fine bright highlight along the wire. No card, no photo, no flower, no ribbon, no base. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: tek dik tel; tepede düz spiral; alt ucu sivri; kart/çiçek yok; kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca her anlık baskının altındaki çubuk (`.pick`); baskı spiralin önünde durur, çubukla birlikte
aranjmandan yükselir ve hafifçe sallanır.

#### W13 Ayaklı kâsede aranjman (baskıların yükseldiği yer)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/bouquet.png` · 1400×1000 · **Şeffaf zemin**

```
A low, lush, generous garden-party flower arrangement hand-painted in vivid opaque gouache, alone, on a fully transparent background: a simple cream footed pedestal bowl (#FBF6EA, softly painted sheen) at the bottom centre, overflowing with a wide, low dome of flowers — two big peony-pink peonies (#F1A9C0), cupped raspberry ranunculus (#C8436F), soft pink sweet peas with curling tendrils, deep burgundy cosmos (#6B1730) on wiry stems, frothy chartreuse lady's mantle (#C7CF3C) and fresh leaves (#4F7A3A) trailing over the rim at both sides. The arrangement is about 84% of the image wide and about 80% tall, wider than tall. In its top centre the flowers part slightly, leaving a small open gap among the stems (picks with prints rise from there later — do not draw any pick, card or photo). The same gouache hand as env_back.png, crisp painted edges. Bright daylight from the top-left. No table, no cloth, no other vase. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: ayaklı krem kâse + alçak gür aranjman; üst ortada küçük açıklık; çubuk/kart yok; kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca home hikâye tanıtımının ve story sayfasının her anının altında; çubuklu baskılar (W10 + W12)
üst ortadaki açıklıktan yükselir.

#### W14 Çiçek çelengi (bölüm ayırıcı)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/divider.png` · 1600×260 · **Şeffaf zemin**

```
A slim horizontal garland of small hand-painted gouache garden flowers, alone, on a fully transparent background: an airy line of tiny peonies, raspberry ranunculus buds, pink sweet peas, a few burgundy cosmos and frothy chartreuse lady's mantle on fine stems with small leaves, symmetrical around a slightly fuller cluster in the centre and tapering to delicate single buds at both ends; about 80% of the image width and 55% of its height, centred, with a generous empty margin at both ends. The same gouache hand as env_back.png. Bright daylight from the top-left. No ribbon, no line, no frame. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: yatay, ortası dolgun, uçları tek tomurcuk; iki uçta boşluk; kurdele/çizgi yok; gerçek alfa.
Kullanım: tema kurulunca başlıkların altında (home davet ve gün, details program, RSVP formu üstü).

#### W15 Süzülen küçük parçalar — üç ayrı dosya
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/accent_1.png`, `accent_2.png`, `accent_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small garden element hand-painted in vivid opaque gouache, alone, on a fully transparent background, filling about 55% of the square, centred, not cropped, the same gouache hand as env_back.png. Bright daylight from the top-left. Nothing else in the image. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around. True transparent background PNG (real alpha channel — not white, not a checkerboard). No cast shadow or drop shadow outside the object, no glow or halo outside the object. No text, letters, numbers, monograms, logos or watermarks. (Make three files, the same size and style: 1 = one single loose peony petal in peony pink #F1A9C0, softly cupped, deeper pink at its base; 2 = one small sprig of chartreuse lady's mantle #C7CF3C with its frothy tiny flowers and one scalloped leaf; 3 = one single deep burgundy cosmos flower #6B1730 with a small golden centre on a short stem.)
```
Kontrol: her dosyada tek parça; üç dosya farklı; kenarlara değmiyor; gerçek alfa.
Kullanım: tema kurulunca RSVP gönderilince pembe yaprak konfetisi (çoğunlukla accent_1, arada 2 ve 3); kaydırınca süzülen
birkaç küçük parça.

#### W16 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic with hand-painted gouache paper elements, bright daylight from the top-left: the closed landscape chartreuse envelope of env_back.png, env_front.png and flap.png with its seven-scallop flap and the single pink ranunculus of stem.png threaded through the two slits near the flap's tip, lying slightly below the centre on a cream linen tablecloth; around it, hand-painted gouache flower cut-outs on cream paper (as bloom_1–4.png) and a few loose pink petals; at the right two blank instant-film style prints (as instant_frame.png, their picture areas plain white paper, nothing printed), slightly overlapping; at the left a loosely curled length of striped silk ribbon in peony pink and cream. The top 20% of the image is calm and soft (cream linen, gently out of focus). This image is cropped to 1200×630 for link previews: keep the whole envelope visible with at least 5% empty margin below it. No people. No text, letters, numbers, monograms, logos or watermarks.
```
Kontrol: zarf ve çiçek sapı bütün, altında boşluk; üst %20 sakin; baskıların resim alanı boş beyaz; yazı yok.
Kullanım: tema kurulunca `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı: üstten ~%21 kırpılır).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Poppy & Hugo; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography with subtle film grain. 2.1 and 2.5 are in full colour (a bright
spring garden palette of chartreuse, peony pink, raspberry and cream with fresh leafy garden tones); 2.2–2.4 are in
black-and-white (soft natural contrast, fine grain, the candid, playful feel of an instant-film snapshot — but no frame,
no border). ONE fictional couple in their early thirties, the same two people in every photo (they must not resemble any
real person or celebrity): Poppy — shoulder-length wavy dark auburn-brown hair with a soft fringe, fair skin, a slim gold
ring; Hugo — short black curly hair, clean-shaven, deep brown skin. Modern, elegant clothing (no costume). The portrait
and Story photos are cropped to a square in an instant-print frame: keep faces and hands in the middle 70%. No text, no
frame, no watermark, no readable signs.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın). Gerçek
bir kişiye/ünlüye benzerse yeniden üretilir. Portre ve Story fotoğrafları sitede **kare** kırpılır (anlık baskı
penceresi); mekân 16:9.

#### 2.1 Ana portre
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 colour wedding portrait of the fictional couple Poppy and Hugo, in their early thirties (Poppy: shoulder-length wavy dark auburn-brown hair with a soft fringe, fair skin, a slim gold ring; Hugo: short black curly hair, clean-shaven, deep brown skin; they must not resemble any real person or celebrity) standing beneath a flowering garden arch: she in a simple ivory tea-length dress with a small posy of pink peonies and chartreuse lady's mantle, he in a light stone-coloured suit with a raspberry ranunculus boutonnière, close together and laughing, waist-up, faces in the upper middle of the frame; around and behind them, softly out of focus, climbing pink roses, peonies and leafy garden shrubs in bright spring daylight. Photorealistic, bright spring palette, subtle grain. No frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.2 Story 1 — "Our first picnic"
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin) on their first picnic, sitting close on a checked blanket in a sunny meadow, a wicker basket and a jar of wild flowers beside them, she laughing with her head tipped back, he offering her a strawberry, soft natural contrast and fine grain, the playful feel of an instant snapshot; faces and hands in the middle of the frame. No readable labels, no frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.3 Story 2 — "Flower market Saturdays"
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/photos/story_2.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white candid photo: the same couple as hero_portrait.jpg at an open-air Saturday flower market, she carrying a huge armful of peonies and smiling at him over the blooms, he holding a bunch of ranunculus and looking at her, galvanised buckets of flowers and other shoppers softly out of focus behind them. Soft natural contrast, fine grain. No signs, no price tags, no frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.4 Story 3 — "Yes, in the garden"
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 black-and-white photo seen from a little distance: the same couple as hero_portrait.jpg in a flowering garden, he down on one knee on a gravel path holding up a small ring box, she with both hands raised to her face in happy surprise, framed by blooming shrubs and a low clipped hedge, both figures small but clearly the same two people, placed in the middle of the frame. Soft natural contrast, fine grain, a candid, joyful moment. No frame. No text, letters, numbers, monograms, logos or watermarks.
```

#### 2.5 Mekân
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9 colour photo: a flower-filled garden terrace prepared for a spring wedding supper — one long table dressed in cream linen with low, lush arrangements of pink peonies, raspberry ranunculus, sweet peas, burgundy cosmos and frothy chartreuse lady's mantle, cane-backed chairs, small striped silk ribbons on the chair backs, leafy trees and flowering borders around the terrace in bright afternoon daylight. A generic place that does not resemble any real venue. No people, no signs, no religious objects. Photorealistic, same bright spring palette. No text, letters, numbers, monograms, logos or watermarks.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Bu tasarımın `'chartreuse-garden-party'` bloğu
> **henüz yok**: tema kurulunca eklenecek (şu an geçici `composed` görünüm de yok).
> **Dosya adı ve ölçü:** dalganın öteki tasarımlarıyla aynı — `print/invitation_front_5x7.png`,
> `print/invitation_back_5x7.png`, **1575×2175 px** = 5×7 in + 1/8 in taşma, 300 ppi. Ayrı A5 dosyası istenmez:
> `layouts.ts` her yüz için tek zemin taşır (`cover`); A5 + 3 mm taşma (154×216 mm, oran 0,713) aynı sayfadan yanlardan
> ~%0,8 kırpılarak basılır (~260 ppi). Bu yüzden süsleme yan kenarların %8'ine girmez.
> **Yazı alanı:** ön yüzde yükseklikte %19–%91 × genişlikte %10–%90, arka yüzde %13'ün altı × %9–%91 tamamen boş istenir
> (isimler/tarih/mekân öne; program ve QR arkaya — QR'ı GPT çizmez, `tools/make_qr.py` gerçek URL'den üretir). Metin
> kutuları tema kurulunca bu alanın ~%3 içine yazılır.
>
> **Gelince (elle, tek blok; otomatik değil — G149: kutular gerçek görselde ölçülür):**
> 1. Tema kurulunca `layouts.ts`'e `'chartreuse-garden-party'` bloğu eklenir: `sources` → `{ front:
>    'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' }`; `composed` → `{ front: { bg:
>    cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Kutuları görselde ölç (süslemenin ~%2 dışında kalsın); taşma varsa `front`/`back` ya da `bands` düzelt
>    (`tests/g149-print-layout.test.ts`).
> 3. `cd platform && node scripts/build-print-assets.ts --theme chartreuse-garden-party` ve `node scripts/print-sample.ts
>    --theme chartreuse-garden-party --invite 5x7 --bleed` + `--invite a5 --bleed` ile iki boyutu göz kontrolü.

#### P1 — Ön yüz
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5.25:7.25, seen perfectly flat: the whole sheet is the warm cream cotton paper of cream_paper.png. Across the top, a lush, airy band of hand-painted gouache garden flowers — a pink peony at the centre, raspberry ranunculus, soft pink sweet peas, burgundy cosmos and frothy chartreuse lady's mantle with fresh leaves (as bloom_1–4.png, the same gouache hand) — its lowest petals staying above 17% of the height and all of it between 8% and 92% of the width. Along the bottom a slim garland of small gouache flowers (as divider.png), staying below 93% of the height and between 8% and 92% of the width. The rectangle from 19% to 91% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm paper (the names, date and venue are set there): no flower, no petal, no line, no shadow, no stain in it. No text, letters, numbers, monograms, logos or watermarks. No QR code. Print quality, sharp at 1575×2175 px.
```
Kontrol: tam taşma; %19–%91 × %10–%90 tamamen boş; çiçekler yalnız üst ve alt bantta, yan %8'e girmiyor; yazı yok.

#### P2 — Arka yüz
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5.25:7.25, perfectly flat: the same cream cotton paper, only a small spray of hand-painted gouache flowers across the top centre (one pink ranunculus, two sweet peas, a sprig of chartreuse lady's mantle and a burgundy cosmos bud, as the flowers of bloom_1–4.png), its lowest petals staying above 11% of the height and all of it between 9% and 91% of the width. Everything below 13% of the height, and everything between 9% and 91% of the width, is COMPLETELY EMPTY paper (a schedule and a QR code are set there): no flower, no line, no shadow, no stain. No text, letters, numbers, monograms, logos or watermarks. No QR code. Print quality, sharp at 1575×2175 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üst ortada küçük çiçek dalı (%11'in üstünde); %13'ün altı boş; yazı/QR yok.

---

PAKET 3/7 (Etsy ilan sahneleri) bu dosyada yok: tema kurulunca `tools/paket7_ilan.py` ile üretilecek.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> Set bu tasarımın kendi dünyası (PAKET 3 yok; `EK_SETLER`): bütün sahnelerde aynı masa, süs, ışık. Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 43`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Chartreuse Garden Party". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a cream cotton tablecloth, a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a burgundy cosmos stem, the same light and the same color world (chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a cream cotton tablecloth, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a burgundy cosmos stem, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a cream cotton tablecloth, a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a burgundy cosmos stem. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a jug of peonies, ranunculus and sweet peas. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a cream cotton tablecloth, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a burgundy cosmos stem. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a cream cotton tablecloth, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a burgundy cosmos stem arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a cream cotton tablecloth: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a burgundy cosmos stem. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a cream cotton tablecloth: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a burgundy cosmos stem. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a cream cotton tablecloth, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a burgundy cosmos stem. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a jug of peonies, ranunculus and sweet peas; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a cream cotton tablecloth, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/43_Chartreuse_Garden_Party/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a cream cotton tablecloth: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a jug of peonies, ranunculus and sweet peas, frothy chartreuse lady's mantle and a burgundy cosmos stem. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: chartreuse, peony pink, raspberry, burgundy, leaf green and cream in bright spring garden-party daylight. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
