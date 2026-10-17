# GPT görsel istekleri — Tasarım 28 · Maison Pâtisserie

> **Instructions for GPT:** Generate the parts below in order and in ONE chat: PAKET 5 (website layers) first, then
> PAKET 2 (sample photos of the fictional couple), then PAKET 6 (printable invitation backgrounds). Use each English
> prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under
> "Kaydet". **No text, letters, numbers, logos, monograms, price tags or watermarks in any image.** Give W2.1
> `box_base.png` as the style and position reference of every later stage part, and W2.10 `bg_page.png` as the palette
> reference of everything else.

Bu dosya Maison Pâtisserie'nin **bütün görsellerinin** tek kaynağıdır (G166, docs/24 #28). Tasarım `tools/katalog.py`'de
`EK_TEMALAR` dalga kaydıyla duruyor (6 eksen + hareket imzası); PAKET üreteçlerine girmediği için dosya elle yazıldı.
Tema bugün **geçici** parçalarla çalışıyor: `platform/themes/maison-patisserie/build_images.py` kutu, kapak, ipek kâğıt,
kart ve rafı depodaki başka GPT kâğıt/saten görsellerinden kırpıp tonluyor, fiyonk 14'ün fildişi fiyonkundan tonlanıp
düğümden kesiliyor (çizim yok). Aşağıdaki parçalar `assets/gpt/parts/` içine geldikçe betik **katman katman** onlara geçer.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/28_Maison_Patisserie/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme
  işi verme.

## Stil ve renk
- Teknik: **pastel watercolour + photorealistic pastry** — zemin ve dokular yumuşak pastel suluboya; kutu, kurdele,
  makaron, tabak ve şeker inci fotogerçekçi (gerçek karton, gerçek saten, gerçek porselen).
- Palet: pistachio `#A9C49C` · deep pistachio `#4F6D49` · rose `#E8B4B8` · deep rose `#9B4F5A` · cream `#FBF5EC` ·
  gold `#B8995A`. Altın yalnız ince kenar/çizgi; hiçbir yerde baskın değil.
- Işık: yumuşak, sol üstten; bütün parçalarda aynı.
- Klasik, romantik, zengin; ultra-minimal değil. 03 Blush Garden Rose'a (şakayık, kemer çerçeve, pembe zarf) benzemesin:
  burada çiçek yok, nesne bir pasta kutusu, renk fıstık yeşili ağırlıklı.
- Gerçek bir kişiye, markaya, gerçek bir pastaneye (logo, tabela, desen) veya başka bir satıcının tasarımına benzemesin.

---

## PAKET 5 — Website katmanları (YAZI YOK)

Tek görselde tek nesne, düşen gölge yok (site ekler), ışık sol üstten, şeffaflar **gerçek alfa**. **Sahne parçaları
W2.1–W2.8 aynı 1024 × 1024 tuvalde, kutunun TAM ÜSTTEN görünüşüyle ve aynı konumda** çizilir: kutu/kapak tuvalin
x 32–992, y 32–992 px karesini kaplar (yaklaşık %3 kenar boşluğu). Birbirinin üstüne konunca kenarlar çakışmalı. Tema
bu katmanları kırpmadan %100 üst üste dizer (`platform/themes/maison-patisserie/index.html`).

Sıra (alttan üste): `box_base` · (kart, HTML) · `tissue_left` · `tissue_right` · `lid` · `ribbon_cross` (Claude dört
kola keser) · `bow_left` · `bow_right` · `bow_knot`.

#### W2.1 Açık kutu — içi boş (üstten)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/box_base.png` · 1024×1024 · **Şeffaf zemin**

```
A square luxury pâtisserie gift box WITHOUT its lid, seen exactly from directly above (top-down, no perspective), empty: four low walls of matte pistachio-green card (#A9C49C) with a thin gold foil line along the top edge of each wall, the inside lined with smooth cream paper (#FBF5EC) with a very faint watercolour texture. The box fills the square from about 3% to 97% of the image on every side (outer edge of the walls at x 32–992 px and y 32–992 px of a 1024 px canvas), perfectly centered and square. Nothing inside the box. The inner edge where the walls meet the cream floor is a crisp, clearly visible line with a soft contact shade on the object itself. Only this one object. Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow outside the box. No glow, halo or haze outside its outline. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: tam üstten; kare; x/y 32–992 px; içi boş; duvar üstünde ince altın çizgi; gölge yok; gerçek alfa.

#### W2.2 İpek kâğıt — sol yaprak
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/tissue_left.png` · 1024×1024 · **Şeffaf zemin**

```
Only the LEFT sheet of soft ivory-white tissue paper that lies folded inside the box of box_base.png (give it as the reference; same canvas, same top-down view, same position): a gently crinkled, slightly translucent sheet with delicate natural creases and a faint rose-pink deckled edge, covering the left half of the inside of the box from the left wall (x about 54 px) to just past the middle (x about 548 px), from the top wall (y about 54 px) to the bottom wall (y about 970 px). Its right edge, which will slide away, is a soft folded edge that reads clearly. Only the tissue — no box, no card, nothing else. Top-down, no perspective. Soft light from the top-left. No cast shadow outside the sheet. No text. True transparent background PNG (real alpha channel), the paper itself about 92% opaque.
```
Kontrol: yalnız sol yaprak; kutunun içine oturuyor; ortayı az geçiyor; gölge yok; gerçek alfa.

#### W2.3 İpek kâğıt — sağ yaprak
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/tissue_right.png` · 1024×1024 · **Şeffaf zemin**

```
The RIGHT sheet of the same tissue paper as tissue_left.png (give it as the reference; same canvas and view): it covers the right half of the inside of the box from just before the middle (x about 476 px, overlapping the left sheet a little) to the right wall (x about 970 px), y about 54 to 970 px, with its own natural creases (not a mirror copy) and the same faint rose-pink deckled edge. Only the tissue. Top-down, no perspective. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha), the paper about 92% opaque.
```
Kontrol: yalnız sağ yaprak; sol yaprakla ortada biraz örtüşüyor; ayna kopya değil; gerçek alfa.

#### W2.4 Kapak — kurdelesiz (üstten)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/lid.png` · 1024×1024 · **Şeffaf zemin**

```
The closed LID of the same pâtisserie box (give box_base.png as the reference; same canvas, same top-down view, same position), WITHOUT any ribbon or bow: a square lid of matte pistachio-green card (#A9C49C) with a very subtle pastel watercolour mottling, a fine embossed border and a thin gold foil line inset about 4% from its edge; the lid covers the box exactly, its outer edge at x 32–992 px and y 32–992 px. The centre of the lid is plain (the ribbon and the bow are separate parts). Only the lid. Top-down, no perspective. Soft light from the top-left. No cast shadow and no drop shadow outside the lid. No glow outside its outline. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel).
```
Kontrol: kurdele/fiyonk yok; kutuyla aynı kare (32–992 px); ince altın çizgi; gölge yok; gerçek alfa.

#### W2.5 Saten kurdele — çapraz (fiyonksuz)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/ribbon_cross.png` · 1024×1024 · **Şeffaf zemin**

```
Only the rose-pink double-faced satin ribbon (#E8B4B8 with a soft natural sheen) that crosses the lid of lid.png (give it as the reference; same canvas, same top-down view): one band running vertically through the centre from the top edge of the lid to the bottom edge (x about 460–564 px, y 32–992 px) and one band running horizontally through the centre from the left edge to the right edge (y about 460–564 px, x 32–992 px), lying flat on the lid; where the two bands cross in the centre the ribbon is flat and neat (the bow is a separate part). Each band is about 104 px wide with crisp edges. Only the ribbon — no lid, no bow. Top-down, no perspective. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız kurdele; iki bant ortadan; ~104 px genişlik; kapak kenarlarına kadar; fiyonk yok; gerçek alfa. (Claude
merkezden dört kola keser: kuzey, güney, batı, doğu — açılışta her kol kendi yönüne kayar.)

#### W2.6 Fiyonk — sol ilmek ve sol kuyruk
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/bow_left.png` · 1024×1024 · **Şeffaf zemin**

```
The LEFT half of a generous rose-pink satin bow (#E8B4B8, the same satin as ribbon_cross.png; give it as the reference) tied in the centre of the box lid, seen from directly above on the same canvas: only the left loop and the left tail, complete — including the part that would be hidden under the knot — reaching from the centre of the canvas (x 512, y 500) to the left, about 300 px wide and 340 px tall in total, the tail falling down-left. The bow sits on the centre of the lid where the ribbons cross. Soft satin folds and sheen. Only this half of the bow. Top-down. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız sol ilmek + kuyruk; düğümün altına giren kısım da tam; merkezden sola; gerçek alfa.

#### W2.7 Fiyonk — sağ ilmek ve sağ kuyruk
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/bow_right.png` · 1024×1024 · **Şeffaf zemin**

```
The RIGHT half of the same rose-pink satin bow as bow_left.png (give it as the reference; same canvas and view): only the right loop and the right tail, complete including the part under the knot, reaching from the centre of the canvas (x 512, y 500) to the right, about 300 px wide and 340 px tall, the tail falling down-right — matching the left half so together they make one natural bow (not a mirror copy). Only this half. Top-down. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız sağ yarı; sol yarıyla birlikte tek fiyonk gibi; gerçek alfa.

#### W2.8 Fiyonk düğümü
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/bow_knot.png` · 1024×1024 · **Şeffaf zemin**

```
Only the small wrapped KNOT in the centre of the same rose-pink satin bow (give bow_left.png and bow_right.png as the reference; same canvas and view): a neat satin knot about 90 px wide and 110 px tall, centred at x 512, y 500, covering the place where the two loops meet. Only the knot. Top-down. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız düğüm; iki yarının birleştiği yeri örtüyor; gerçek alfa. **Üçü üst üste = tek fiyonk** (açılışta ilmekler
iki yana ayrılır, düğüm düşer).

#### W2.9 Kutudaki kart (boş)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
A small, thick invitation card that waits inside the pâtisserie box, alone: soft cream cotton card (#FFFBF5) with a faint watercolour wash of pistachio at the very top edge and a very thin gold foil edge, portrait, exactly 560 by 740 in proportion (about 3:4), centred on the canvas and filling about 70% of its width. The whole face of the card is BLANK (the website places the photo and the text on it) — no window, no frame lines in the middle, no ornaments in the middle. Front view, perfectly straight, centered and not cropped, with generous empty margin all around. Soft light from the top-left. No cast shadow. No text, letters, numbers or monogram. True transparent background PNG (real alpha channel).
```
Kontrol: oran ~560:740; yüzü boş (foto ve yazı HTML); ince altın kenar; gölge yok; gerçek alfa.

#### W2.10 Sayfa zemini (kutu sayfası + home, telefon)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/bg_page.png` · 1024×1536 · opak

```
A vertical phone-screen background in pastel watercolour: warm cream paper (#FBF5EC) with soft, airy washes of pistachio green in the top-left corner and of rose pink in the bottom-right corner, a few tiny scattered sugar pearls and one or two pale macaron crumbs only at the far edges, fine cotton-paper grain everywhere. The whole central 70% of the image stays calm, light and empty (no box, no card, no text) so dark text and the box read on it. No text, letters or numbers.
```
Kontrol: orta %70 sakin ve açık; renk yalnız köşelerde; yazı yok.

#### W2.11 Dikişsiz zemin karosu
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/bg_tile.png` · 1024×1024 · opak

```
A seamless, tileable cream paper texture (#FBF5EC) with a very faint pastel watercolour mottling of pistachio and rose, fine cotton-paper grain, very low contrast, no objects, no pattern repeats visible, no edges or vignette. It must tile perfectly in both directions. No text.
```
Kontrol: dört yönde dikişsiz; çok düşük kontrast; nesne yok.

#### W2.12 Vitrin rafı
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/shelf.png` · 1536×1024 · **Şeffaf zemin**

```
A single long glass shelf of a Parisian pâtisserie display case, seen straight from the front at eye level: a thick clear glass plate with a soft green-tinted edge and a thin polished gold rim along its front edge, very wide and thin — it spans about 96% of the image width and is only about 5% of the image height, centred vertically. Clean, elegant, photorealistic. Only the shelf — no pastries, no case, no brackets. Soft light from the top-left. No cast shadow below it. No text. True transparent background PNG (real alpha channel).
```
Kontrol: çok geniş, ince; altın ön kenar; boş; gölge yok; gerçek alfa (Story'de fotoğraflar ve Details'te menü raflarının altı).

#### W2.13 Şeker inci (accent 1)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/accent_1.png` · 1024×1024 · **Şeffaf zemin**

```
A single glossy sugar pearl (a round pâtisserie dragée) in pearly white with a faint pink lustre, alone, drawn large so it fills about 50% of the square. Photorealistic. Front view, centered, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel).
```
Kontrol: tek inci; parlak; gölge yok; gerçek alfa (RSVP gönderiminde ~18 inci düşer — `MOTION.accents.closing`).

#### W2.14 Dekor — makaronlu altın kenar tabak
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/decor_macarons.png` · 1536×1024 · **Şeffaf zemin**

```
A small round white porcelain dessert plate with a fine gold rim, seen from slightly above, holding five French macarons in pistachio green, rose pink and vanilla cream, with a soft puff of ivory tulle tucked at one side and three sugar pearls scattered on the plate. Photorealistic pastry, pastel colours, delicate. The plate fills about 60% of the image width, centred. Only this group. Soft light from the top-left. No cast shadow below the plate. No text, no logo on the macarons. True transparent background PNG (real alpha channel).
```
Kontrol: tek grup; logo/yazı yok; gölge yok; gerçek alfa (home davet bölümü ve details menü başlığı yanında süs).

#### W2.15 Dekor — tül fiyonk ve inci dizisi (köşe)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/decor_tulle.png` · 1536×1024 · **Şeffaf zemin**

```
A soft, airy gathered puff of ivory tulle with a short trail of tiny sugar pearls and two pistachio macarons resting at its end, arranged as a gentle horizontal corner accent that runs from the left side to about 70% of the image width. Photorealistic, pastel, light and delicate. Only this group. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yatay köşe süsü; hafif; gölge yok; gerçek alfa (geniş ekran kenarları, RSVP kartı üstü).

#### W2.16 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal scene in the same style: the closed pistachio pâtisserie box with its rose satin ribbon and bow (as lid.png + ribbon_cross.png + the bow parts) resting on a pale marble pâtisserie counter, a gold-rimmed plate of pistachio, rose and vanilla macarons beside it, a puff of ivory tulle and a few sugar pearls, cream watercolour wall behind. The box and the plate sit in the lower 70% of the image, fully visible; the top 20% is calm empty cream wall. Photorealistic pastry with a pastel watercolour background. No text, letters, logos or price tags. This image is also cropped to 1200×630 for link previews.
```
Kontrol: kutu + fiyonk altta tam görünür; üst %20 boş; yazı yok.

Gelince: `python3 platform/themes/maison-patisserie/build_images.py` (her parçayı kendisi bulur; `img/manifest.json`
→ `sources` hangi katmanın GPT'den geldiğini yazar), sonra `site.css`'te `.tissue-l/.tissue-r/.bow` `transform-origin`
değerleri `manifest.stage.layers` ile karşılaştırılır. W2.14/W2.15 için yerleşim tema görevinde (Claude) yapılır.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, soft natural light, pastel pistachio / rose / cream palette, gentle
film grain. Kurgu bir çift, otuzlu yaşların başında; ünlü ya da gerçek bir kişiye benzemesin. Yazı, logo, tabela yok.

#### 2.1 Ana portre
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties in a sunlit orangery with tall arched glass windows and potted citrus trees: the bride in a soft ivory tulle gown, the groom in a light sage-grey suit with a blush pocket square, close together and smiling, three-quarter length, faces in the upper third of the frame. Pastel pistachio, rose and cream palette, soft daylight, gentle film grain. They must not resemble any real or famous person. No text, no frame, no watermark.
```

#### 2.2 Raf 1 — "Coffee and croissants for two"
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5, in casual clothes at a small marble table inside a Parisian-style pâtisserie, sharing coffee and croissants, laughing, a glass display case of pastel pastries softly out of focus behind them. Photorealistic, same palette and grain. No readable signs, no text, no logos.
```

#### 2.3 Raf 2 — "A question over macarons"
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5: the moment of the proposal at a café terrace table, a small open pâtisserie box of pastel macarons between them, his hand offering a ring box, her hands over her mouth in surprise. Photorealistic, same palette and grain. No text, no logos.
```

#### 2.4 Raf 3 — "Forever, with a ring"
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Close-up, vertical 4:5: the couple's joined hands with a delicate engagement ring, resting beside a pistachio-and-rose macaron and a satin ribbon on a cream linen tablecloth. Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 3:2)

```
Landscape 3:2: an elegant white Victorian orangery with tall arched glass windows on a green lawn by the sea, a rose garden in front, set for a wedding with cream chairs and pastel flowers, soft late-afternoon light. Fictional place — no recognisable real building, no people, no signs, no text. Photorealistic, same palette.
```

Gelince: `content.demo.json` (koleksiyon + tema kopyası) `media` alanlarına tema yolu yazılmaz — fotoğraflar
`python3 tools/kit_check.py collections/28_Maison_Patisserie --paket 2` ile denetlenir; theme-check onları
`--photos` yerine koleksiyondan kendisi bulur (`scripts/lib/theme-env.ts`).

---

## PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK)

Bugün basılı davetiye geçici düzende (`platform/lib/print/layouts.ts` `composed`: sitenin krem kâğıdı + saten fiyonk).
Bu dört zemin gelince `layouts.ts`'te `composed` kalkar, kaynaklar bunlara çevrilir ve
`node scripts/build-print-assets.ts --theme maison-patisserie` çalıştırılır (platform/ içinde). Ölçüler **taşma payı dahil**
(5×7 in + 1/8 in her yanda = 5.25 × 7.25 in; A5 + 3 mm her yanda = 154 × 216 mm) ve **300 ppi**. Önemli öğeler kesim
çizgisinden en az 0.25 in (6 mm) içeride; metin alanı boş kalır (Claude yazıyı katman olarak dizer).

#### P6.1 Ön yüz — 5×7
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/print/invitation_front_5x7.png` · **1575 × 2175 px** (5.25 × 7.25 in @ 300 ppi) · opak

```
A full-bleed printable wedding invitation background, front side, portrait, in pastel watercolour: warm cream cotton paper (#FBF5EC) with fine grain; at the top centre a photorealistic rose-pink satin bow (the same bow as the website's box) resting on a short length of satin ribbon; at the bottom a soft pastel watercolour garland of pistachio macarons, sugar pearls and a wisp of ivory tulle, staying in the lowest 15% of the card; a very thin gold foil hairline frame inset about 0.35 in from the edge. The whole centre (about 76% of the width, from 24% to 84% of the height) is EMPTY cream paper for dark text. Keep every important element at least 0.25 in (75 px) inside the trim line, which is 0.125 in (38 px) in from every edge. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: tam taşma; orta boş (metin alanı ~%76 × %60); öğeler kesimden ≥ 75 px içeride; yazı yok.

#### P6.2 Arka yüz — 5×7
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/print/invitation_back_5x7.png` · **1575 × 2175 px** · opak

```
The back side of the same printable invitation: full-bleed cream cotton paper (#FBF5EC) with the same fine grain and the same thin gold foil hairline frame, only a small rose-pink satin bow at the top centre and three tiny sugar pearls beneath it. Everything below the bow (from 18% of the height down) is EMPTY paper for the schedule and a QR code. Keep every element at least 75 px inside the trim (38 px from each edge). No text, letters, numbers, logos or watermarks. Print quality, 1575 × 2175 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; yalnız üstte küçük fiyonk; geri kalanı boş; yazı yok.

#### P6.3 Ön yüz — A5
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/print/invitation_front_a5.png` · **1819 × 2551 px** (154 × 216 mm @ 300 ppi) · opak

```
The same front design as invitation_front_5x7.png (give it as the reference), recomposed for an A5 card with 3 mm bleed: full-bleed cream cotton paper, the rose satin bow at the top centre, the pastel macaron, sugar pearl and tulle garland in the lowest 15%, the thin gold hairline frame inset about 9 mm from the edge, and the whole centre (about 76% of the width, from 24% to 84% of the height) EMPTY for text. Every important element at least 6 mm (71 px) inside the trim line, which is 3 mm (35 px) in from every edge. No text, letters, numbers, logos or watermarks. Print quality, 1819 × 2551 px.
```
Kontrol: 5×7 ile aynı tasarım, A5 oranına yeniden dizilmiş (germe yok); orta boş; yazı yok.

#### P6.4 Arka yüz — A5
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/print/invitation_back_a5.png` · **1819 × 2551 px** · opak

```
The back side for the A5 card, the same as invitation_back_5x7.png recomposed for A5 with 3 mm bleed: cream cotton paper, the thin gold hairline frame, a small rose satin bow and three sugar pearls at the top centre, everything below 18% of the height EMPTY. Every element at least 71 px inside the trim (35 px from each edge). No text, letters, numbers, logos or watermarks. Print quality, 1819 × 2551 px.
```
Kontrol: A5 oranı; yalnız üstte fiyonk; geri kalanı boş; yazı yok.

Not: Üretici bu tam piksel ölçüsünü veremezse aynı oranda en büyük dikey ölçüyü ver ve çıktında ölçüyü yaz; Claude
büyütme (upscale) yapmaz, gerçek ppi'yi `layouts.ts` notuna yazar (G139 kuralı).

---

## Komutlar (Claude, parçalar gelince)

```bash
# repo kökünden
python3 platform/themes/maison-patisserie/build_images.py          # PAKET 5 → img/ (geçici katmanların yerine GPT)
python3 tools/kit_check.py collections/28_Maison_Patisserie --paket 2   # PAKET 2 fotoğrafları
# platform/ içinde
node scripts/build-print-assets.ts --theme maison-patisserie        # PAKET 6 → public/print/maison-patisserie/
NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs --theme maison-patisserie --stress --compare none
```
