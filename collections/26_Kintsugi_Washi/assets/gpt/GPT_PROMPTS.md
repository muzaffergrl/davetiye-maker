# GPT görsel istekleri — Tasarım 26 · Kintsugi & Washi

> **Instructions for GPT:** Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample
> photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and
> save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, calligraphy,
> kanji, kana, seals with characters (hanko), logos, monograms or watermarks in any image.** Give W2.1 `washi_indigo.png`
> and W2.3 `rice_paper.png` as the style reference of every later part: the same indigo washi, the same rice paper, the
> same warm gold leaf.

Bu dosya tasarım 26'nın **bütün görsel parçalarının** tek kaynağıdır (G164). Tasarım `tools/katalog.py` `EK_TEMALAR`'da
eksenleriyle kayıtlı ama PAKET üreteçlerine girmediği için dosya elle yazıldı. Şu an tema (`platform/themes/kintsugi-washi/`)
**geçici** kâğıtla çalışıyor: 06'nın düz lacivert kâğıdı çivide, 18'in düz pamuk kâğıdı pirinç kâğıdına tonlandı;
katlar, kuşak ve kart bu kâğıtların dikdörtgen kırpımları. Parçalar gelince ne değişeceği: tema README → "What waits
for GPT".

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/26_Kintsugi_Washi/assets/gpt/` altındaki `parts/` (PAKET 5,
  PAKET 6) ve `photos/` (PAKET 2). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.
- Sonra (Claude): `python3 platform/themes/kintsugi-washi/build_images.py` (img/ yeniden üretilir; W2.1–W2.3 otomatik
  devralınır), `python3 tools/kit_check.py collections/26_Kintsugi_Washi --paket 2`, basılı davetiye için
  `cd platform && node scripts/build-print-assets.ts --theme kintsugi-washi`.

## Stil ve renk
- Teknik: **sumi ink + gold leaf** on real handmade paper — photorealistic paper texture, ink and leaf; quiet, elegant,
  romantic. Not a costume or a cliché: no kimono, pagoda, lantern, fan, cherry blossom, torii, bamboo or calligraphy.
- Renkler: indigo `#242E58` · night `#161C36` · inner indigo `#3C4874` · rice `#F3ECDC` · gold `#C9A55A` · gold light
  `#E3C987` · ink `#1D2340`
- Işık: yumuşak, sol üstten; bütün parçalarda aynı. Şeffaf parçalarda gerçek alfa (beyaz ya da dama deseni değil).
- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.

## Kapalı paket geometrisi (W2.4, W2.8, W2.9 buna göre)
Kapalı paket **0,70 en / 1 boy** (dikey). Katlar paketin yüzdesiyle: üst kat 0–%40, alt kat %62–%100 (tam genişlik); orta
bantta (%40–%62) sol kat %0–%50, sağ kat %50–%100; pirinç kâğıdı kuşak %45–%56 (paketten her yana %3 taşar). Altın
damarlar bu kat çizgilerinin **üstünden geçer**; Claude damar katmanını kat sınırlarından keser, her parça kendi katıyla
döner.

---

## PAKET 5 — Website katmanları (YAZI YOK)

#### W2.1 Çivit washi (dış yüz + sayfa zemini)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/washi_indigo.png` · 1536×1536 · opak, dikişsiz

```
A seamless, tileable, perfectly flat top-down texture of handmade Japanese-style washi paper dyed deep indigo (#242E58), filling the whole square edge to edge: long soft paper fibres slightly lighter than the paper, a gentle uneven dye with very subtle darker clouds, a fine matte grain. Evenly lit from the top-left, no shadow, no vignette, no fold, no crease, no object, no pattern, no gold. The left/right and top/bottom edges must tile without a visible seam. No text, letters or symbols.
```
Kontrol: dikişsiz (yan yana 2×2 konunca ek yeri yok); renk `#242E58` civarı; lifler görünür ama sakin; desen/yazı yok.

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
Kullanım: Claude kat sınırlarından keser (üst 0–%40, alt %62–%100, orta bantta sol/sağ); her parça kendi katının dış
yüzünde; açılışta "altın damar parıltısı" = bu katmanla maskelenen kenarsız ışık.

#### W2.5 Mürekkep lekesi (foto maskesi)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/ink_bleed.png` · 1024×1024 · **Şeffaf zemin**

```
A single bloom of black sumi ink spreading on wet rice paper, seen from above, on a fully transparent background: a solid, fully opaque black centre filling about 70% of the square, with an organic, feathered, softly irregular edge — fine capillary tendrils and soft bleeding fringes, a few small satellite droplets near the edge — like ink that has just soaked into absorbent paper. Pure black only (no grey wash in the centre, no paper texture, no colour). Centered, not cropped, generous empty margin. No text, letters or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: merkez tam opak siyah; kenar organik ve tüylü; kâğıt dokusu yok; gerçek alfa (CSS maske olarak büyütülecek).

#### W2.6 Sumi fırça darbesi (başlık altı / ayırıcı)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/sumi_stroke.png` · 1536×384 · **Şeffaf zemin**

```
One single horizontal brush stroke of sumi ink in deep indigo-black (#1D2340), on a fully transparent background: about 75% of the image width, starting with a confident pressed head on the left and fading into a dry, split, feathered tail on the right, with natural dry-brush texture. No other mark, no letter, no character, no seal, no gold. Centered, not cropped, generous empty margin. No text. True transparent background PNG (real alpha channel).
```
Kontrol: tek yatay darbe; harf/karakter gibi okunmuyor; gerçek alfa.

#### W2.7 Altın varak pulları (süzülen parçacık) — üç ayrı dosya
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/gold_flake_1.png`, `gold_flake_2.png`, `gold_flake_3.png` · her biri 512×512 · **Şeffaf zemin**

```
A single small torn flake of real gold leaf, alone, slightly crinkled, with a soft metallic highlight from the top-left, irregular torn edges, filling about 55% of the square. Centered, not cropped. No shadow, no glow or sparkle outside the flake. No text. True transparent background PNG (real alpha channel). (Make three different flakes: 1 = a roughly square flake, 2 = a long narrow sliver, 3 = a small crumpled piece.)
```
Kontrol: tek pul; üç dosya farklı biçimde; gölge/ışıltı yok; alfa (açılışta karttan 3 pul düşer, home'a varışta 2).

#### W2.8 Pirinç kâğıdı kuşak (kapanış)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/obi_band.png` · 1600×240 · **Şeffaf zemin**

```
A flat, straight horizontal band of the same ivory rice paper as rice_paper.png, seen straight on, like a paper belly band wrapped round a folded invitation: a long rectangle about 6.7:1, its two long edges softly torn (natural deckle), a few scattered flecks of real gold leaf on it, the two short ends cut straight. Lit from the top-left; a very soft contact shade on the band itself only. No cast shadow, no knot, no seal, no ribbon. No text, letters or symbols. True transparent background PNG (real alpha channel).
```
Kontrol: düz yatay bant (~6,7:1); yırtık uzun kenarlar; altın pullar seyrek; düğüm/mühür yok; alfa.

#### W2.9 Katların içindeki kart (boş, foto penceresi)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/card_small.png` · 1078×1540 · **Şeffaf zemin**

```
A flat vertical invitation card of the same ivory rice paper as rice_paper.png, exactly 0.70:1, filling the image edge to edge (the card IS the image), seen straight on, with softly deckled edges and a very soft contact shade on the card itself. In its upper part a portrait photo window, 64% of the card's width, 4:5 tall, horizontally centered, its top edge at 9% of the card's height, filled with flat pure green #00FF00 (no texture, no shading, straight edges). Below the window the rice paper is EMPTY (the website sets the names and the date there). No gold line, no frame, no text, letters or symbols. True transparent background PNG (real alpha channel) around the deckled edge.
```
Kontrol: pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### W2.10 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal still life, photorealistic, soft light from the top-left: the closed folded invitation — indigo washi paper (as washi_indigo.png) folded over an ivory rice-paper card like origami, a top and a bottom fold, two side panels meeting in the middle, an ivory rice-paper band with gold-leaf flecks round its middle (as obi_band.png), fine gold kintsugi veins crossing the folds (as kintsugi_veins.png) — lying slightly below the centre on a surface of the same rice paper, with three small torn gold-leaf flakes near it and a single sumi brush stroke far at the right edge. The top 20% of the image is calm, empty paper. This image is cropped to 1200×630 for link previews: keep the whole packet visible with at least 5% empty margin below it. No people, no text, no letters, no calligraphy, no seal with characters.
```
Kontrol: paket bütün ve altta boşluklu; üst %20 boş; yazı/hat yok.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, soft natural light, a calm indigo, ivory and warm gold palette,
subtle film grain; a fictional couple in their early thirties (they must not resemble any real person or celebrity);
modern, elegant clothing (no costume). No text, no frame, no watermark.

#### 2.1 Ana portre
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/hero_portrait.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 wedding portrait of the fictional couple Naomi and Kai in an autumn garden: she in a simple ivory silk gown, he in a deep indigo suit, standing close under a red-gold maple, smiling at each other, three-quarter length, faces in the upper third, soft afternoon light from the left, a still pond and a cedar pavilion softly out of focus behind. Photorealistic, calm indigo, ivory and gold palette, subtle grain. No text, no frame.
```

#### 2.2 Story 1 — "A borrowed umbrella"
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/story_1.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 candid photo: the same couple laughing under one shared dark umbrella on a quiet rainy street at dusk, warm shop lights blurred behind, wet stones reflecting the light, her hand on his arm. Photorealistic, same palette and grain. No readable signs, no text.
```

#### 2.3 Story 2 — "Tea by the river"
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/story_2.jpg` · Yatay 1280×1024 (5:4)
```
Landscape 5:4: the same couple sitting side by side on a wooden deck by a wide river in the early morning, two simple handmade ceramic cups between them, mist over the water and forested hills, seen from slightly behind and to the side. Photorealistic, same palette and grain. No text.
```

#### 2.4 Story 3 — "The promise"
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/story_3.jpg` · Dikey 1024×1280 (4:5)
```
Vertical 4:5 close-up: the couple's hands, her hand with a slim gold engagement ring resting in his, beside a small ceramic tea bowl mended with gold kintsugi seams, on indigo linen, soft window light from the top-left, shallow depth of field. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/photos/venue.jpg` · Yatay 1536×864 (16:9)
```
Landscape 16:9: an elegant open garden pavilion of warm cedar wood beside a still pond in autumn, red and gold maples, a gravel path and a few rows of simple white chairs set for a ceremony, soft late-afternoon light, forested hills behind. No people, no signs, no text. Photorealistic, same palette.
```

---

## PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5, 300 ppi)

> Panelden indirilen basılı davetiye (`platform/lib/print/layouts.ts`). Şu an geçici: pirinç kâğıdı + üstte ve altta çivit
> washi şeridi (temanın tonladığı kâğıtlar, ~195 ppi). İki sayfa gelince `composed` arka planları bunlara geçer
> (`bg: url(print_front.webp) center / cover`) ve `node scripts/build-print-assets.ts --theme kintsugi-washi` koşulur.
> Ölçü: 2250×3150 px (5:7) = 5×7 in + 3 mm taşmayla ≥ 428 ppi, A5 + 3 mm taşmayla ≥ 370 ppi (A5'te kenarlardan ~%1 kırpılır).
> Güvenli alan: her kenardan %8 içeride önemli öğe yok.

#### P1 — Ön yüz
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/print_front.png` · 2250×3150 · opak
```
The front of a printed wedding invitation, full bleed, portrait 5:7, seen perfectly flat: the whole sheet is the ivory rice paper of rice_paper.png. Along the top edge a band of the indigo washi of washi_indigo.png about 12% of the height, its lower edge softly torn like hand-torn washi; along the bottom edge a matching indigo band about 11% of the height, its upper edge softly torn; one slender gold kintsugi vein (as kintsugi_veins.png) runs from the top band down the left margin and fades out before the centre; a few tiny gold-leaf flecks. The whole centre (about 74% of the width, 62% of the height) is EMPTY rice paper for dark text. Nothing important within 8% of any edge except the bands. No text, letters, numbers, calligraphy, monograms, seals, logos or watermarks. Print quality, sharp at 2250×3150 px.
```
Kontrol: tam taşma (kenara kadar kâğıt); orta %74 × %62 boş; yazı yok; çivit bantlar yırtık kenarlı.

#### P2 — Arka yüz
**Kaydet:** `collections/26_Kintsugi_Washi/assets/gpt/parts/print_back.png` · 2250×3150 · opak
```
The back of the same printed wedding invitation, full bleed, portrait 5:7, perfectly flat: the same ivory rice paper, only a narrow indigo washi band along the top edge (about 7% of the height, its lower edge softly torn) and a few tiny gold-leaf flecks near it. Everything below the band is EMPTY rice paper for a schedule and a QR code. No text, letters, numbers, logos or watermarks. Print quality, 2250×3150 px.
```
Kontrol: ön yüzle aynı kâğıt; yalnız üstte dar çivit bant; geri kalanı boş; yazı yok.
