# GPT görsel istekleri — Tasarım 28 · Maison Pâtisserie

> **Instructions for GPT:** This design ("Maison Pâtisserie") was redesigned on 2026-10-18/19: its website is warm ivory stationery paper with abundant photorealistic flowers in the corners, opened from a themed cover object. The old website parts (PAKET 5) are NO LONGER needed — do not generate them. Generate PAKET 3 (the Etsy listing scenes) and PAKET 6 (the printed invitation grounds) in ONE chat; PAKET 2 (sample photos) is optional and comes last. Before the first image, attach these two images from the repository as the style reference of every image: `platform/themes/maison-patisserie/img/bg_scene-1024.webp` (the website background: paper, flowers, colors, light) and `platform/themes/maison-patisserie/img/v3-closed-880.webp` (the design's closed cover object). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". No text, letters, numbers, logos, monograms or watermarks in any image.

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

## PAKET 5 — Website katmanları (YAZI YOK) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).

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

#### W2.14 · W2.15 Dekor (makaronlu tabak, tül köşe süsü) — BU TURDA ÜRETME
G167 kararı: sayfalarda bu iki süsün yeri henüz yok (geçici katmanlarla gösterilemiyor; K21 gereği çizilemiyor) ve
`build_images.py` onları okumuyor — üretilirse kullanılmayan dosya olur. Yerleşim bir tema görevinde tasarlanınca
prompt'lar (makaronlu altın kenar tabak 1536×1024 şeffaf; tül + şeker inci + iki makaron yatay köşe süsü 1536×1024
şeffaf) buraya **Kaydet** satırlarıyla geri yazılır ve `build_images.py` aynı anda bağlanır. **GPT: bu ikisini atla.**

#### W2.16 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal scene in the same style: the closed pistachio pâtisserie box with its rose satin ribbon and bow (as lid.png + ribbon_cross.png + the bow parts) resting on a pale marble pâtisserie counter, a gold-rimmed plate of pistachio, rose and vanilla macarons beside it, a puff of ivory tulle and a few sugar pearls, cream watercolour wall behind. The box and the plate sit in the lower 70% of the image, fully visible; the top 20% is calm empty cream wall. Photorealistic pastry with a pastel watercolour background. No text, letters, logos or price tags. This image is also cropped to 1200×630 for link previews.
```
Kontrol: kutu + fiyonk altta tam görünür; üst %20 boş; yazı yok.

Gelince: `python3 platform/themes/maison-patisserie/build_images.py` (her parçayı kendisi bulur; `img/manifest.json`
→ `sources` hangi katmanın GPT'den geldiğini yazar), sonra `site.css`'te `.tissue-l/.tissue-r/.bow` `transform-origin`
değerleri `manifest.stage.layers` ile karşılaştırılır. Betik her parçayı sayfaların istediği tuvale/genişliğe ölçekler
(sahne katmanları 1024×1024; `shelf-1200`, `bow-480`, `accent_1-200`, `bg_page-1024`); daha küçük gelen parça büyütülür ve
uyarı yazar — o parçayı GPT'den büyük iste. `card_small` kartı 560:740'tan %4'ten fazla saparsa da uyarı yazar.
Prova: `python3 tools/gpt_kuru_deneme.py --tema maison-patisserie --sekil collections/28_Maison_Patisserie/assets/gpt/kuru_sekil.json`
(G167; deneme görselleriyle GEÇTİ — `kuru_sekil.json` parçaların bu dosyadaki yerleri).

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) — isteğe bağlı (demo şu an ortak örnek fotoğrafları kullanıyor)

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

## PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK; 2026-10-20 yeni tasarıma göre)

> **Neden yeniden yazıldı (2026-10-20):** website 18–19 Ekim'de fildişi kâğıt + köşe çiçekleri görünümüne geçti; eski baskı prompt'ları eski görünümü (ve artık olmayan PAKET 5 parçalarını) istiyordu. `platform/lib/print/layouts.ts` `'maison-patisserie'` bloğunun geçici kaynakları yeniden kurulumda `img/`'den silindi: panel şu an `public/print/maison-patisserie/`'deki eski çıktıyı (eski görünüm) basıyor ve `build-print-assets` bu tema için yeniden koşamaz. Bu zeminler gelince:
> Platform her yüz için **tek** zemin kullanır ve onu taşma payıyla `cover` olarak yayar (5×7 ve A5 aynı zeminden).
> 1. `layouts.ts` `'maison-patisserie'` bloğunda `sources` → bu zeminler (`print/invitation_front.png` + `print/invitation_back.png`), `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }`.
> 2. Zemin artık **açık fildişi**: `ink` / `accent` koyu tonlara (temanın site metin rengi) alınır; açık mürekkep kalmaz.
> 3. Metin kutuları (`front` / `back`) gerçek görselde ölçülür (G149; süsten ~%2 açıklık), `node --test tests/g149-print-layout.test.ts`.
> 4. `cd platform && node scripts/build-print-assets.ts --theme maison-patisserie`; `public/print/maison-patisserie/`'deki artık kaynak olmayan eski dosyalar silinir; 5×7 ve A5 örnek PDF'ine göz atılır.
> Ek görsel (her iki yüz için sohbetin başında): `platform/themes/maison-patisserie/img/bg_scene-1024.webp`.

#### P6.1 Ön yüz
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/print/invitation_front.png` · 1575×2175 px (300 ppi), opak

```
A full-bleed printable wedding invitation ground for the "Maison Pâtisserie" design, front side, portrait, seen perfectly flat and straight on, 1575 × 2175 px at 300 ppi (it is trimmed later). Match the attached website background (bg_scene-1024.webp) exactly in style: the same warm ivory, softly textured stationery paper running edge to edge and the same pistachio sage, cream and soft blush, garden roses, pearl ribbon and delicate French patisserie rococo ornament, in the same photorealistic stationery-photography finish with soft light from the top-left. Place the decoration ONLY in two places: an abundant arrangement gathered at the top-left corner and trailing along the top edge, staying entirely within the top 16% of the height, and a smaller matching arrangement gathered at the bottom-right corner, staying entirely within the bottom 14% of the height. A very fine antique-gold foil hairline frame inset about 6% from every edge. Keep every ornament at least 4% inside the image edges. The whole rectangle from 18% to 84% of the height and from 10% to 90% of the width is COMPLETELY EMPTY, calm ivory paper (the names, date and venue are printed there in dark ink): no petal, leaf, line, shadow or stain in it. No envelope, no card, no frame object, no people. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: tam taşma fildişi kâğıt (site zeminiyle aynı); çiçekler yalnız üst %16 (sol üst) ve alt %14 (sağ alt); %18–84 yükseklik × %10–90 genişlik tamamen boş; ince altın çerçeve; yazı yok; 1575×2175.

#### P6.2 Arka yüz
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/print/invitation_back.png` · 1575×2175 px (300 ppi), opak

```
The back side of the same "Maison Pâtisserie" invitation (give invitation_front.png as the reference image): portrait, full bleed, perfectly flat, 1575 × 2175 px at 300 ppi, the same warm ivory stationery paper edge to edge and the same very fine antique-gold foil hairline frame inset about 6% from every edge. Decoration ONLY a slim spray of the same flowers and foliage centred along the top edge, staying entirely within the top 11% of the height and at least 4% inside the image edges. Everything from 13% to 92% of the height and from 10% to 90% of the width is COMPLETELY EMPTY paper for the schedule, the details and a QR code: no petal, line, shadow or stain. Same style, colors and light. No text, letters, numbers, logos or watermarks. Print quality, sharp at 1575 × 2175 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; çiçek yalnız üst %11'de ince dal; %13–92 × %10–90 boş; yazı yok; 1575×2175.

---

## Komutlar (Claude, parçalar gelince) — GEÇERSİZ (2026-10-20: website 18–19 Ekim'de yeniden kuruldu; üretme)

> **GEÇERSİZ (2026-10-20).** Tasarım 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu (yeni kapak `img/v3-*`, yeni zemin `img/bg_scene-*`, yeni iç sayfalar; `docs/qa/2026-10-18-*.md`, `docs/qa/2026-10-19-*.md`). Bu bölüm artık istenmez, sayılmaz ve yerleştirilmez; tarihçe için duruyor. `build_images.py` emekli (img/'yi silerdi).

```bash
# repo kökünden
python3 platform/themes/maison-patisserie/build_images.py          # PAKET 5 → img/ (geçici katmanların yerine GPT)
python3 tools/kit_check.py collections/28_Maison_Patisserie --paket 2   # PAKET 2 fotoğrafları
# platform/ içinde
node scripts/build-print-assets.ts --theme maison-patisserie        # PAKET 6 → public/print/maison-patisserie/ (önce layouts.ts, PAKET 6 "Gelince")
NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs --theme maison-patisserie --stress --compare none
```

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
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "Maison Pâtisserie". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: a white marble pastry counter with a cream linen napkin, a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, the same light and the same color world (pistachio, rose, cream and gold). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with a white marble pastry counter with a cream linen napkin and a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on a white marble pastry counter with a cream linen napkin, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The phones fill about 70% of the image width and stand in the middle band of the image. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on a white marble pastry counter with a cream linen napkin, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals, arranged loosely at the edges. Generous calm space above the laptop. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on a white marble pastry counter with a cream linen napkin, slightly right of center and rotated about 8 degrees, surrounded at the edges by a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals. The left third of the image is calm, empty surface kept free for text. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `collections/28_Maison_Patisserie/assets/gpt/mockups/hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on a cream boudoir armchair with a pistachio cushion and a porcelain cup of coffee; a small arrangement of a pistachio green pastry box tied with a rose satin bow, a few pastel macarons on a gold-rimmed porcelain plate, a silver cake fork and a few blush rose petals is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, shallow depth of field, editorial and luxurious, color world: pistachio, rose, cream and gold. Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. No text, letters, numbers, logos or watermarks anywhere in the image.
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
