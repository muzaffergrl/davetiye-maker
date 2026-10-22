# GPT görsel istekleri — Tasarım 26 · Kintsugi & Washi

> **Instructions for GPT:** This design ("Kintsugi & Washi") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/kintsugi-washi/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/kintsugi-washi/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.

Bu dosya tasarım 26'nın **bütün görsel parçalarının** tek kaynağıdır (G164). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema (`platform/themes/kintsugi-washi/`)
**geçici** kâğıtla çalışıyor: 06'nın düz lacivert kâğıdı çivide, 18'in düz pamuk kâğıdı pirinç kâğıdına tonlandı;
katlar, kuşak ve kart bu kâğıtların dikdörtgen kırpımları. Parçalar gelince ne değişeceği: tema README → "What waits
for GPT".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/26_Kintsugi_Washi/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya
  yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/kintsugi-washi/build_images.py` — PAKET 5'in **her parçası geldiği anda
  kendiliğinden** kullanılır (G167): img/ yeniden üretilir, `platform/themes/kintsugi-washi/parts.css` o parçaların
  kurallarıyla yazılır; gelmeyen parçanın kuralı yazılmaz, sayfa geçici görünümünde kalır (`img/manifest.json` →
  `parts.used` / `parts.waiting_for_gpt`). Sonra `python3 tools/kit_check.py collections/26_Kintsugi_Washi --paket 2`,
  `python3 tools/gpt_kuru_deneme.py --tema kintsugi-washi` (prova; gerçek parçalarla da koşulabilir) ve göz kontrolü.
  PAKET 6 için aşağıdaki "Gelince" adımı (elle, tek blok).

## Stil ve renk
- Teknik: **sumi ink + gold leaf** on real handmade paper — photorealistic paper texture, ink and leaf; quiet, elegant,
  romantic. Not a costume or a cliché: no kimono, pagoda, lantern, fan, cherry blossom, torii, bamboo or calligraphy.
- Renkler: indigo `#242E58` · night `#161C36` · inner indigo `#3C4874` · rice `#F3ECDC` · gold `#C9A55A` · gold light
  `#E3C987` · ink `#1D2340`
- Işık: yumuşak, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil).
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

## Kapalı paket geometrisi (W2.4, W2.8, W2.9 buna göre) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).
Kapalı paket **0,70 en / 1 boy** (dikey). Katlar paketin yüzdesiyle: üst kat 0–%40, alt kat %62–%100 (tam genişlik); orta
bantta (%40–%62) sol kat %0–%50, sağ kat %50–%100; pirinç kâğıdı kuşak %45–%56 (paketten her yana %3 taşar). Altın
damarlar bu kat çizgilerinin **üstünden geçer**; Claude damar katmanını kat sınırlarından keser, her parça kendi katıyla
döner.

---

## PAKET 5 — Website katmanları (YAZI YOK) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).

#### W2.1 Çivit washi (dış yüz + sayfa zemini)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/washi_indigo.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of handmade Japanese-style washi paper dyed deep indigo (#242E58), filling the whole square edge to edge: long soft paper fibres slightly lighter than the paper, a gentle uneven dye with very subtle darker clouds, a fine matte grain. Evenly lit from the top-left, no shadow, no vignette, no fold, no crease, no object, no pattern, no gold. The left/right and top/bottom edges must tile without a visible seam. No text, letters or symbols.
```
Kontrol: dikişsiz (yan yana 2×2 konunca ek yeri yok); renk `#242E58` civarı; lifler görünür ama sakin; desen/yazı yok.
Kullanım: katların dış yüzü (`washi_indigo-640/1024`), og/favicon montajı, basılı davetiyenin geçici şeridi.

#### W2.2 Çivit washi — katın içi
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/washi_inner.png` · 1536×1536 · opak, dikişsiz

```
The inside of the same indigo washi paper as washi_indigo.png: a seamless, tileable, flat top-down texture, one shade lighter and softer (#3C4874), the fibres a little more visible, with a few very small scattered flecks of real gold leaf (about 1–3% of the surface, irregular, never in a pattern). Evenly lit from the top-left, no shadow, no vignette, no fold, no object. Edges tile without a seam. No text, letters or symbols.
```
Kontrol: W2.1 ile aynı kâğıt, bir ton açık; altın pullar seyrek ve düzensiz; dikişsiz.

#### W2.3 Pirinç kâğıdı (kart, davet bandı, form)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/rice_paper.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, flat top-down texture of soft handmade rice paper in warm ivory (#F3ECDC): long translucent kozo fibres, a very gentle uneven thickness, a natural deckle-free surface, calm enough for dark ink text to read on it everywhere. Evenly lit from the top-left, no shadow, no vignette, no fold, no stain, no gold, no pattern. Edges tile without a seam. No text, letters or symbols.
```
Kontrol: sakin (üstüne koyu yazı her yerde okunur); fildişi; dikişsiz; leke yok.

#### W2.4 Altın kintsugi damarları (kapalı paketin dış yüzü)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/kintsugi_veins.png` · 1078×1540 · **Şeffaf zemin**

```
Only fine lines of real gold leaf in the kintsugi manner, on a fully transparent background, for a vertical 0.70:1 sheet (the image IS the sheet; no paper, no background): two or three slender, organic, branching gold veins that wander across the whole sheet like the mended cracks of a ceramic bowl — one crossing the sheet's upper part, one crossing the middle from the left edge to the right edge, one running down through the lower part; the lines are 2–6 px wide, with a soft metallic highlight from the top-left, slightly raised like applied leaf, irregular thickness, a few tiny gold dots along them. They must cross the horizontal lines at 40% and 62% of the height and the vertical centre line, so the paper folds can be cut along them. Nothing else: no paper, no shadow, no glow or halo outside the gold. No text, letters or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: yalnız altın çizgiler (kâğıt yok); %40 ve %62 yatay çizgilerini ve dikey orta çizgiyi kesiyor; parıltı/hâle yok; gerçek alfa.
Kullanım (build_images.py, otomatik): görüntü 0,70:1 paketin kendisi sayılır, 1078×1540'a ölçeklenir ve kat sınırlarından
kesilir → `vein_top/bottom-760`, `vein_left/right-380` (her biri kendi katının dış yüzünde, katla birlikte döner);
kuşak bandı (%45–%56) çıkarılmış tamamı → `vein_glint-540` = `.sheen` ışığının maskesi: kapalı pakette ve açılışın ilk
430 ms'sinde altın ışık yalnız damarların üstünde gezer.

#### W2.5 Mürekkep lekesi (foto maskesi)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/ink_bleed.png` · 1024×1024 · **Şeffaf zemin**

```
A single bloom of black sumi ink spreading on wet rice paper, seen from above, on a fully transparent background: a solid, fully opaque black centre filling about 70% of the square, with an organic, feathered, softly irregular edge — fine capillary tendrils and soft bleeding fringes, a few small satellite droplets near the edge — like ink that has just soaked into absorbent paper. Pure black only (no grey wash in the centre, no paper texture, no colour). Centered, not cropped, generous empty margin. No text, letters or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: merkez tam opak siyah; kenar organik ve tüylü; kâğıt dokusu yok; gerçek alfa (CSS maske olarak büyütülecek).
Kullanım: alfa kutusuna kırpılır, kareye tamamlanır → `ink-640` = `.ink` maskesinin üç katmanı (geçici yumuşak
disklerin yerine; büyüme süresi ve konumlar aynı). Görünen kısım yalnız kenar (merkez opak olduğu için).

#### W2.6 Sumi fırça darbesi (başlık altı / ayırıcı)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/sumi_stroke.png` · 1536×384 · **Şeffaf zemin**

```
One single horizontal brush stroke of sumi ink in deep indigo-black (#1D2340), on a fully transparent background: about 75% of the image width, starting with a confident pressed head on the left and fading into a dry, split, feathered tail on the right, with natural dry-brush texture. No other mark, no letter, no character, no seal, no gold. Centered, not cropped, generous empty margin. No text. True transparent background PNG (real alpha channel).
```
Kontrol: tek yatay darbe; harf/karakter gibi okunmuyor; gerçek alfa.
Kullanım: pirinç kâğıdı üzerindeki başlıkların altında (`.paper-band h2` — home davet ve gün, details program —
ve RSVP form başlığı); sahnede başlık yükseldikten sonra soldan sağa "boyanır" (clip-path; reduced motion'da sabit).
Koyu çivit zemindeki başlıklarda kullanılmaz (koyu mürekkep orada okunmaz).

#### W2.7 Altın varak pulları (süzülen parçacık) — üç ayrı dosya
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/gold_flake_1.png`, `gold_flake_2.png`, `gold_flake_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small torn flake of real gold leaf, alone, slightly crinkled, with a soft metallic highlight from the top-left, irregular torn edges, filling about 55% of the square. Centered, not cropped. No shadow, no glow or sparkle outside the flake. No text. True transparent background PNG (real alpha channel). (Make three different flakes: 1 = a roughly square flake, 2 = a long narrow sliver, 3 = a small crumpled piece.)
```
Kontrol: tek pul; üç dosya farklı biçimde; gölge/ışıltı yok; alfa.
Kullanım: `flake_1..3-200` (alfa kutusu, kare); `parts.css` `--kw-flakes` ile site.js'e bildirilir: açılışta son panel
açılırken paketten 3 pul (2500 ms), home'a varışta kartın üstünde 2, RSVP gönderilince teşekkür panelinden 5 pul
süzülür (bir yana salınarak). Dosya yoksa pul yok (çizilmiş yedek yok).

#### W2.8 Pirinç kâğıdı kuşak (kapanış)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/obi_band.png` · 1600×240 · **Şeffaf zemin**

```
A flat, straight horizontal band of the same ivory rice paper as rice_paper.png, seen straight on, like a paper belly band wrapped round a folded invitation: a long rectangle about 6.7:1, its two long edges softly torn (natural deckle), a few scattered flecks of real gold leaf on it, the two short ends cut straight. Lit from the top-left; a very soft contact shade on the band itself only. No cast shadow, no knot, no seal, no ribbon. No text, letters or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: düz yatay bant (~6,7:1); yırtık uzun kenarlar; altın pullar seyrek; düğüm/mühür yok; alfa.
Kullanım: alfa kutusuna kırpılır → `obi-800` = `.band` (paketin %45–%56'sı, iki yana %3 taşar; 100% × 100% gerilir —
oran 6,7:1'den çok saparsa bant basık/uzun görünür).

#### W2.9 Katların içindeki kart (boş, foto penceresi)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/card_small.png` · 1078×1540 · **Şeffaf zemin**

```
A flat vertical invitation card of the same ivory rice paper as rice_paper.png, exactly 0.70:1, filling the image edge to edge (the card IS the image), seen straight on, with softly deckled edges and a very soft contact shade on the card itself. In its upper part a portrait photo window, 64% of the card's width, 4:5 tall, horizontally centered, its top edge at 9% of the card's height, filled with flat pure green #00FF00 (no texture, no shading, straight edges). Below the window the rice paper is EMPTY (the website sets the names and the date there). No gold line, no frame, no text, letters or symbols. True transparent background PNG (real alpha channel) around the deckled edge.
```
Kontrol: pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.
Kullanım: alfa kutusuna kırpılır; yeşil pencere ölçülür (manifest `card_small.window_pct`) ve şeffaf yapılır →
`card_small-860` = katların içindeki kart; portre alanı ölçülen pencereye oturur, isim/tarih pencerenin altından başlar.
Pencere bulunamazsa build uyarır ve kart pirinç kâğıdı kalır.

#### W2.10 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft light from the top-left: the closed folded invitation — indigo washi paper (as washi_indigo.png) folded over an ivory rice-paper card like origami, a top and a bottom fold, two side panels meeting in the middle, an ivory rice-paper band with gold-leaf flecks round its middle (as obi_band.png), fine gold kintsugi veins crossing the folds (as kintsugi_veins.png) — lying slightly below the centre on a surface of the same rice paper, with three small torn gold-leaf flakes near it and a single sumi brush stroke far at the right edge. The top 20% of the image is calm, empty paper. This image is cropped to 1200×630 for link previews: keep the whole packet visible with at least 5% empty margin below it. No people, no text, no letters, no calligraphy, no seal with characters.
```
Kontrol: paket bütün ve altta boşluklu; üst %20 boş; yazı/hat yok.
Kullanım: `og-1200x630.jpg` (`tema_build.og_kirp`, alta hizalı: üstten ~%21 kırpılır).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor)

Ortak: photorealistic fine-art wedding photography, soft natural light, a calm indigo, ivory and warm gold palette,
subtle film grain; ONE fictional couple in their early thirties, the same two people in every photo (they must not
resemble any real person or celebrity): Naomi — shoulder-length wavy dark-brown hair, warm light-brown skin, a slim gold
ring; Kai — short black hair, a neat short beard, light skin. Modern, elegant clothing (no costume). No text, no frame,
no watermark.

Not: beş fotoğraf aynı sohbette sırayla üretilir; 2.1 sonrakilerin kişi referansıdır (yüz, saç, ten aynı kalsın).
Gerçek bir kişiye/ünlüye benzerse yeniden üretilir.

#### 2.1 Ana portre
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Naomi and Kai, in their early thirties (Naomi: shoulder-length wavy dark-brown hair, warm light-brown skin, a slim gold ring; Kai: short black hair, a neat short beard, light skin; they must not resemble any real person or celebrity) in an autumn garden: she in a simple ivory silk gown, he in a deep indigo suit, standing close under a red-gold maple, smiling at each other, three-quarter length, faces in the upper third, soft afternoon light from the left, a still pond and a cedar pavilion softly out of focus behind. Photorealistic, calm indigo, ivory and gold palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "A borrowed umbrella"
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple as hero_portrait.jpg (same faces, hair and skin), laughing under one shared dark umbrella on a quiet rainy street at dusk, warm shop lights blurred behind, wet stones reflecting the light, her hand on his arm. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "Tea by the river"
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/story_2.jpg` · Yatay 1280×1024 (5:4)
```
Landscape 5:4: the same couple as hero_portrait.jpg sitting side by side on a wooden deck by a wide river in the early morning, two simple handmade ceramic cups between them, mist over the water and forested hills, seen from slightly behind and to the side. Photorealistic, same palette and grain. No text.
```

#### 2.4 Story 3 — "The promise"
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the hands of the same couple as hero_portrait.jpg (same skin tones), her hand with a slim gold engagement ring resting in his, beside a small ceramic tea bowl mended with gold kintsugi seams, on indigo linen, soft window light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant open garden pavilion of warm cedar wood beside a still pond in autumn, red and gold maples, a gravel path and a few rows of simple white chairs set for a ceremony, soft late-afternoon light, forested hills behind. No people, no signs, no text. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre)

> **Neden yeniden yazıldı (2026-10-20):** website 18–19 Ekim'de fildişi kâğıt + köşe çiçekleri görünümüne geçti; eski baskı prompt'ları eski görünümü (ve artık olmayan PAKET 5 parçalarını) istiyordu. `platform/lib/print/layouts.ts` `'kintsugi-washi'` bloğunun geçici kaynakları yeniden kurulumda `img/`'den silindi: panel şu an `public/print/kintsugi-washi/`'deki eski çıktıyı (eski görünüm) basıyor ve `build-print-assets` bu tema için yeniden koşamaz. Bu zeminler gelince:
> Platform her yüz için **tek** zemin kullanır ve onu taşma payıyla `cover` olarak yayar (5×7 ve A5 aynı zeminden).
> 1. `layouts.ts` `'kintsugi-washi'` bloğunda `sources` → bu zeminler (`print/invitation_front_5x7.png` + `print/invitation_back_5x7.png`), `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Zemin artık **açık fildişi**: `ink` / `accent` koyu tonlara (temanın site metin rengi) alınır; açık mürekkep kalmaz.
> 3. Metin kutuları (`front` / `back`) gerçek görselde ölçülür (G149; süsten ~%2 açıklık), `node --test tests/g149-print-layout.test.ts`.
> 4. `cd platform && node scripts/build-print-assets.ts --theme kintsugi-washi`; `public/print/kintsugi-washi/`'deki artık kaynak olmayan eski dosyalar silinir; 5×7 ve A5 örnek PDF'ine göz atılır.
> Ek görsel (her iki yüz için sohbetin başında): `platform/themes/kintsugi-washi/img/bg_scene-1024.webp`.

#### P6.1 Ön yüz
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_front_5x7.png` · 1575×2175 px (300 ppi), opak

```
A full-bleed printable wedding invitation ground for the "Kintsugi & Washi" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same warm ivory washi paper, indigo botanical branches, champagne gold fine kintsugi veins, white magnolia and cherry blossoms, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### P6.2 Arka yüz
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_back_5x7.png` · 1575×2175 px (300 ppi), opak

```
The back side of the same "Kintsugi & Washi" invitation (give invitation_front_5x7.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a sheet of pale ivory rice paper over a light ash wood table and a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a sheet of pale ivory rice paper over a light ash wood table, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a sheet of pale ivory rice paper over a light ash wood table, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a sheet of pale ivory rice paper over a light ash wood table, slightly right of center and rotated about 8 degrees, surrounded at the edges by a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a natural linen sofa with an indigo cushion and a ceramic tea bowl; a small arrangement of a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.

---

## PAKET 7 — Etsy ilan sahneleri 2 (10–20. görseller) + promo video (2026-10-21)

> Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (20 fotoğraf + 2 video). İlanda 9 görsel + 1 video var → **11 sahne** (promo videoyu
> Claude gerçek kayıttan yapar). Amaç: ürün ön planda, detayları gösteren, alıcının içini rahatlatan, satın almaya teşvik eden kareler.
> GPT yalnız **sahneyi** üretir; ekranlar (ve 7.7'de kartın ön yüzü) **düz #00FF00**. Claude gerçek site ekranlarını ve
> gerçek basılı davetiye render'ını yeşile yerleştirir, başlıkları dizer. Böylece ilan ürünü olduğu gibi gösterir (Etsy kuralı).
> PAKET 3 ile **aynı set** (aynı masa, süs, ışık). Hepsini **tek sohbette** üret. Üreten: `python3 tools/paket7_ilan.py --no 26`.

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Kintsugi & Washi". Every image in this chat is a real-looking styled product photo built around phones, a tablet, a laptop or a printed card whose screens (and the card's front face) are flat pure green (#00FF00); we will place the real website screens and the real printed invitation into the green areas afterwards. Keep one consistent set across all images: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, the same light and the same color world (deep indigo, ivory rice paper and gold leaf). The product (the device screens) is always the hero: sharp, prominent, never small in the frame. Aim for best-selling, magazine-quality Etsy listing photos that make a couple feel calm and confident: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 7.1 Yakın çekim: açılış nesnesinin detayı (kâğıt, mühür, doku) — ürünün kalitesi
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_01_closeup.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A close, intimate product shot: one smartphone stands slightly tilted back on a sheet of pale ivory rice paper over a light ash wood table, filling about 60% of the image height, shot from a low three-quarter angle so the phone feels tangible and premium. It is framed softly in the foreground and background by a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia, which come close to the phone frame but never touch the screen. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.2 Dokununca açılır: misafirin parmağı ekrana yaklaşıyor (parmak ekranın DIŞINDA)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_02_hand_tap.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A woman's elegant hand holds a smartphone upright in the center of the frame, screen facing the camera; the index finger of her other hand hovers just below the bottom edge of the phone, about to tap, clearly outside the screen area. Behind, softly out of focus: a sheet of pale ivory rice paper over a light ash wood table, a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. A sense of anticipation, like opening a real letter. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.3 Misafir evde daveti açıyor: sıcak, gerçek hayat — misafir hiçbir şey indirmez
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_03_guest_home.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A cozy at-home moment: a guest sits by a bright window in a soft armchair, holding a smartphone in portrait orientation at a comfortable reading angle, screen facing the camera, thumbs only on the phone frame. On a side table beside them, softly blurred: a cup of tea and a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams. Warm, delighted mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.4 Her cihazda: telefon + tablet aynı site
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_04_phone_tablet.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
A tablet stands upright on a small stand slightly left of center on a sheet of pale ivory rice paper over a light ash wood table, and a smartphone stands upright to its right, both screens facing the camera, clear space between them. Around them at the edges: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. Calm, generous space above the devices. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.5 Bilgisayarda düzenleyici: rahat, büyük ekran
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_05_laptop.png` · yatay 3:2 (ör. 1536×1024) · 1 yeşil alan

```
An open modern laptop seen from a gentle three-quarter angle on a sheet of pale ivory rice paper over a light ash wood table, its screen facing the camera and filling about half of the image width. A ceramic coffee cup and a closed linen-covered wedding planner notebook beside it, with a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia arranged loosely at the edges. Bright, organised, stress-free planning mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.6 Çift birlikte planlıyor: laptop + telefon (yüz yok)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_06_couple_planning.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Two people sit side by side at a table set with a sheet of pale ivory rice paper over a light ash wood table: only their forearms and hands are visible, one with a delicate engagement ring. An open laptop in front of them and a smartphone held by one of them, both screens facing the camera. On the table: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. Warm, happy, together; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.7 Basılı davetiye de dahil: kart ön yüzü + telefon (kartın ön yüzü de yeşil)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_07_print_card.png` · yatay 3:2 (ör. 1536×1024) · 2 yeşil alan

```
Flat-lay from directly above on a sheet of pale ivory rice paper over a light ash wood table: a single portrait 5×7 inch invitation card with a thick cotton-paper edge lies left of center, its entire front face a perfectly flat, uniform, opaque pure green (#00FF00) with crisp straight edges; a smartphone lies to its right, rotated about 6 degrees. Around them at the edges: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. The card's four corners and the phone screen's four corners are fully visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 2 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.8 Dört sayfa / dört dil: yelpaze dizilmiş 4 telefon
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_08_four_phones.png` · yatay 3:2 (ör. 1536×1024) · 4 yeşil alan

```
Four identical smartphones stand upright in a gentle arc on a sheet of pale ivory rice paper over a light ash wood table, seen from the front at eye level, evenly spaced with clear gaps so they never overlap, all screens facing the camera. Around their bases and at the edges of the frame: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. Elegant, orderly, catalogue-like. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 4 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.9 Düğün günü: misafir masasında telefon (Details/harita)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_09_venue_table.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
At a beautifully set wedding reception table, a smartphone stands upright on a small clear stand next to a folded napkin, crystal glasses and candles, screen facing the camera. Table décor echoes a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams; the venue and other tables glow softly out of focus behind. Golden-hour light, festive and elegant; no people's faces. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.10 Düğünden sonra: buket yanında telefon (teşekkür sayfası, yanıtlar)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_10_bouquet.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
A bridal bouquet in the color world of this design lies on a sheet of pale ivory rice paper over a light ash wood table, and a smartphone rests beside it at a slight angle, screen facing up toward the camera from a high three-quarter view. A loosened silk ribbon and a few petals around, never on the screen. Soft, nostalgic after-the-wedding mood. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.11 Paylaşmak kolay: bir kişi telefonu diğerine gösteriyor
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/mockups/p7_11_share.png` · kare 1:1 (ör. 1254×1254) · 1 yeşil alan

```
Close-up of two people's hands at a sheet of pale ivory rice paper over a light ash wood table: one holds a smartphone toward the other, screen facing the camera, while the other person's hand rests on the table nearby. In the soft background: a deep indigo washi paper packet folded like origami with a rice-paper band, a small ceramic bowl mended with gold kintsugi seams, a sumi ink stone with a brush, a few flakes of gold leaf and a single white camellia. Joyful sharing moment; no faces visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: deep indigo, ivory rice paper and gold leaf. Every phone, tablet and laptop is a generic modern device with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, hand, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol (gözle; piksel ölçme yok): 1 adet düz, parlak, tek tonda yeşil alan (tam #00FF00 şart değil, (3, 252, 45) gibi bir yeşil yeterli; birleştirme aracı toleransla okur); oran doğru, ölçü serbest; her yeşil alanın dört köşesi görünüyor; parmak/süs yeşilin üstünde değil; yazı/logo yok. En fazla 2 deneme; hâlâ kusurluysa en iyisini kaydet, notunu düş ve **sonraki sahneye geç**.

### 7.V Promo video (2. video) — GPT'ye verilmez
Claude gerçek site kaydından üretir (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 12–15 sn): açılış → sayfalar →
düzenleyici → RSVP. Videoda gösterilen her şey gerçek siteden gelir; yapay zekâ videosu kullanılmaz.
