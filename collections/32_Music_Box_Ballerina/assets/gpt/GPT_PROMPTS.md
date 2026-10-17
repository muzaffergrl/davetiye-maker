# GPT görsel istekleri — Tasarım 32 · Music Box Ballerina

> **Instructions for GPT:** Generate the parts below in order and in ONE chat: PAKET 5 (website layers) first, then
> PAKET 2 (sample photos of the fictional couple), then PAKET 6 (printable invitation backgrounds). Use each English
> prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under
> "Kaydet". **No text, letters, numbers, logos, monograms, price tags or watermarks in any image.** Give W2.3
> `box_body.png` as the style and position reference of every later stage part, W2.6 `dancer.png` as the reference of
> both turn strips, and W2.11 `bg_page.png` as the palette reference of everything else.

Bu dosya Music Box Ballerina'nın **bütün görsellerinin** tek kaynağıdır (G171, docs/24 #32, 2. dalga). Tasarım
`tools/katalog.py`'de `EK_TEMALAR` dalga kaydıyla duruyor (6 eksen + hareket imzası); PAKET üreteçlerine girmediği için
dosya elle yazıldı. Tema bugün **geçici** parçalarla çalışıyor: `platform/themes/music-box-ballerina/build_images.py`
kutu, kapak ve kuyuyu depodaki başka GPT kâğıt/saten görsellerinden kırpıp tonluyor, ayna 14'ün oval çerçevesi, anahtar
yerinde 17'nin altın diski, balerin yerinde tonlanmış saten bir dikdörtgen (2B döndürülüyor) — çizim yok, figür yok.
Aşağıdaki parçalar `assets/gpt/parts/` içine geldikçe betik **katman katman** onlara geçer.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`; klasör `collections/32_Music_Box_Ballerina/assets/gpt/` altındaki `parts/` (PAKET 5),
  `photos/` (PAKET 2) ve `print/` (PAKET 6). Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme
  işi verme.

## Stil ve renk
- Teknik: **photorealistic + pastel** — kutu, pirinç anahtar, saten, ayna, gül yaprağı ve porselen balerin fotogerçekçi
  (gerçek lake, gerçek pirinç, gerçek saten); zeminler yumuşak pastel.
- Palet: rose quartz `#EECDD0` · blush `#F7E4E2` · rose gold `#B76E79` · deep rose `#8A4A55` · cream `#FFF8F4` ·
  soft gold `#C9A45C`. Pirinç/altın yalnız anahtar, menteşe, kenar şeridi ve küçük ayaklarda.
- Işık: yumuşak, sol üstten; bütün parçalarda aynı.
- Klasik, romantik, zengin; ultra-minimal değil. 23 Velvet Jewel Box'a (patlıcan moru kadife yüzük kutusu, fiyonk) ve
  28 Maison Pâtisserie'ye (fıstık yeşili pasta kutusu) benzemesin: burada nesne **önden görülen lake bir müzik kutusu**,
  kurdele/fiyonk yok, renk gül kuvarsı.
- Balerin **porselen bir müzik kutusu figürinidir**, gerçek bir kişi değil; gerçek bir dansçıya, markaya ya da başka bir
  satıcının ürününe benzemesin. Logo, desen kopyası yok.

---

## PAKET 5 — Website katmanları (YAZI YOK)

Tek görselde tek nesne, düşen gölge yok (site ekler), ışık sol üstten, şeffaflar **gerçek alfa**. **Sahne parçaları
W2.1–W2.5 aynı 1024 × 1536 dikey tuvalde, kutunun TAM ÖNDEN (göz hizasının biraz üstünden, üst yüzü ince bir şerit
olarak görünen) görünüşüyle ve aynı konumda** çizilir; birbirinin üstüne konunca kenarlar çakışmalı. Tema bu katmanları
kırpmadan üst üste dizer (`platform/themes/music-box-ballerina/index.html`), tuvalin y 240–1420 px bandını gösterir.

Sıra (alttan üste): `lid_open` (aynalı iç kapak, dik) · `interior` (saten kuyu) · balerin (sprite) · (kart, HTML) ·
`box_body` (kutunun önü) · `lid_closed` (kapalı kapak) · `key` (anahtar).

#### W2.1 Açık kapak — aynalı iç yüz (dik)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/lid_open.png` · 1024×1536 · **Şeffaf zemin**

```
The INSIDE of the lid of a luxury rose-quartz lacquered music box, standing upright behind the box as when the box is open, seen straight from the front (give box_body.png as the reference; same canvas, same position): a rectangular lid panel covering x 150–874 px and y 200–905 px of a 1024 x 1536 canvas, lined with smooth blush satin (#F7E4E2) in soft gathered pleats, a thin soft-gold border along its edges, two small brass hinges at its bottom edge (y about 895–905 px). In its centre an oval MIRROR in a delicate soft-gold beaded frame; the mirror glass itself is filled with flat pure green #00FF00 (no reflection, no gradient) exactly inside the oval x 312–712 px, y 290–790 px. Only the lid panel. Front view, no perspective tilt. Soft light from the top-left. No cast shadow and no drop shadow outside the lid. No glow outside its outline. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```
Kontrol: x 150–874, y 200–905; oval ayna camı düz #00FF00 (x 312–712, y 290–790); menteşeler alt kenarda; gölge yok;
gerçek alfa. (Claude yeşili şeffaf yapar, çiftin portresi aynada görünür.)

#### W2.2 Saten kuyu — açık kutunun içi (üst şerit)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/interior.png` · 1024×1536 · **Şeffaf zemin**

```
The open top of the same music box seen from the front and slightly above (give box_body.png as the reference; same canvas and position): only the inside well, a shallow tray lined with tufted blush satin (#F7E4E2) and a deeper rose-quartz satin piping, with a small round soft-gold pedestal in the middle (centred at x 512 px, top at about y 975 px) where a figurine will stand; the well spans x 150–874 px and y 880–1010 px. Empty: no figurine, no lid, no box front. Soft light from the top-left. No cast shadow outside it. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız iç kuyu x 150–874, y 880–1010; ortada küçük altın kaide; figür yok; gerçek alfa.

#### W2.3 Kutunun önü (gövde)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/box_body.png` · 1024×1536 · **Şeffaf zemin**

```
A luxury music box body seen straight from the front, slightly from above: a rectangular box of glossy rose-quartz lacquer (#EECDD0 with a deeper #D9A7AE shading) with a softly rounded top edge, a fine soft-gold inlay line framing the front panel, a delicate carved relief of small roses in the centre of the front panel (no letters), and four small brass ball feet. The body covers x 112–912 px and y 990–1400 px of a 1024 x 1536 canvas (its top edge at y 990, the feet ending at y 1400), perfectly centred and level. The open top is NOT shown (the inside well and the lid are separate parts): the body ends at its top edge. On its right side, at about y 1190 px, a small brass keyhole plate where the winding key goes in (the key itself is a separate part). Photorealistic lacquer. Soft light from the top-left. No cast shadow and no drop shadow outside the box. No text, letters, numbers, logo or monogram. True transparent background PNG (real alpha channel).
```
Kontrol: x 112–912, y 990–1400; ön yüzde altın şerit ve gül kabartması (harf yok); pirinç ayaklar; sağ yanda anahtar
deliği plakası; kapak ve iç yok; gölge yok; gerçek alfa.

#### W2.4 Kapalı kapak
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/lid_closed.png` · 1024×1536 · **Şeffaf zemin**

```
The CLOSED lid of the same music box (give box_body.png as the reference; same canvas, same front view slightly from above, same position): a slightly domed rose-quartz lacquered lid with a soft-gold edge band, its visible top surface a thin band and its front edge overhanging the body a little; it covers x 100–924 px and y 880–1020 px of the 1024 x 1536 canvas, so that it sits exactly on the top edge of box_body.png. A small carved rose medallion in the middle of the front edge (no letters). Only the lid. Soft light from the top-left. No cast shadow outside the lid. No glow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: x 100–924, y 880–1020; gövdenin üst kenarına tam oturur; harf yok; gölge yok; gerçek alfa.

#### W2.5 Pirinç kurma anahtarı
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/key.png` · 1024×1536 · **Şeffaf zemin**

```
Only the antique brass WIND-UP KEY of the same music box (give box_body.png as the reference; same canvas and position), seen from the front: its short shaft enters the right side of the box horizontally at about x 900 px, y 1190 px and its butterfly-shaped bow (two rounded wings, an open scroll pattern, no letters) stands upright at the end of the shaft; the whole key covers x 896–1014 px and y 1112–1268 px of the 1024 x 1536 canvas. Polished warm brass (#C9A45C) with soft highlights. Only the key — no box. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: yalnız anahtar x 896–1014, y 1112–1268; kanatlar dik; harf yok; gerçek alfa. (Açılışta anahtar kendi yatay
ekseni etrafında iki tur döner.)

#### W2.6 Balerin — önden duruş (referans + sabit görüntü)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/dancer.png` · 1024×1536 · **Şeffaf zemin**

```
A miniature porcelain music box ballerina figurine (not a real person; a small porcelain figure with a smooth, simple, doll-like face) standing en pointe on one foot, arms raised in a soft rounded fifth position above her head, wearing a blush-pink satin bodice and a layered pale pink tulle tutu (#F6DEE2) with tiny soft-gold details, her hair in a neat bun. Seen straight from the front, full figure, standing vertically and centred on the canvas, the figure about 85% of the image height, generous empty margin all around, feet at the bottom. No pedestal, no box, no base. Photorealistic glazed porcelain and real tulle. Soft light from the top-left. No cast shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: porselen figürin (gerçek kişi değil); tam boy, önden; kaide yok; gerçek alfa. (Footer'daki sabit balerin ve
iki dönüş şeridinin referansı.)

#### W2.7 Balerin dönüşü — kareler 1–4
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/dancer_turn_a.png` · 1536×1024 · **Şeffaf zemin**

```
The SAME porcelain ballerina figurine as dancer.png (give it as the reference: same figure, same pose, same tutu, same size, same light from the top-left), shown four times side by side as four frames of one slow turn on the spot, each frame in its own equal column of 384 px width of a 1536 x 1024 canvas, the figure centred in its column, standing on the same baseline (feet at about y 960 px), the same height in every frame (about 88% of the image height): 1) facing the viewer, 2) turned a quarter to her left (three-quarter view, her right shoulder toward the viewer), 3) in profile facing left, 4) turned three-quarters away (mostly her back, facing left). Arms and pose identical in all frames, only the body turns. The figures do not touch each other or the column edges. Photorealistic porcelain and tulle. No pedestal. No cast shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: aynı figür ve ölçü; 4 eşit sütun (384 px); aynı taban çizgisi; sırayla ön → ¾ → profil → ¾ arka; gerçek alfa.

#### W2.8 Balerin dönüşü — kareler 5–8
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/dancer_turn_b.png` · 1536×1024 · **Şeffaf zemin**

```
The next four frames of the same slow turn of the same porcelain ballerina (give dancer.png and dancer_turn_a.png as the reference: identical figure, size, baseline at about y 960 px, four equal 384 px columns of a 1536 x 1024 canvas): 5) seen fully from the back, 6) turned three-quarters away facing right (mostly her back), 7) in profile facing right, 8) turned a quarter to her right (three-quarter front view, her left shoulder toward the viewer) — so that frame 8 leads back to frame 1 of dancer_turn_a.png. Arms and pose identical, only the body turns. The figures do not touch each other or the column edges. No pedestal. No cast shadow. No text. True transparent background PNG (real alpha channel).
```
Kontrol: 8 kare art arda bir tam dönüş; figür aynı; gerçek alfa. (Claude kareleri tek bir sprite'a dizer; açılışta
balerin 2,4 s'de bir tur döner.)

#### W2.9 Kutudaki kart (boş)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/card_small.png` · 1024×1536 · **Şeffaf zemin**

```
A small, thick landscape invitation card that waits inside the music box, alone: cream cotton card (#FFF8F4) with a deckled edge, a very faint blush watercolour wash in one corner and a very thin soft-gold foil edge, exactly 500 by 330 in proportion (landscape, about 3:2), centred on the canvas and filling about 78% of its width. The whole face of the card is BLANK (the website places the names and the date on it) — no window, no frame lines, no ornaments in the middle. Front view, perfectly straight, not cropped, generous empty margin all around. Soft light from the top-left. No cast shadow. No text, letters, numbers or monogram. True transparent background PNG (real alpha channel).
```
Kontrol: yatay, oran ~500:330; yüzü boş; ince altın kenar; gölge yok; gerçek alfa.

#### W2.10 Gül yaprakları (üç ayrı dosya)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/petal_1.png`, `petal_2.png`, `petal_3.png` · 1024×1024 · **Şeffaf zemin**

```
A single fresh rose petal, alone, drawn large so it fills about 50% of the square: petal_1 blush pink (#F2C9CE) gently curled, petal_2 cream with a pink edge, petal_3 deeper rose (#D99AA5) seen slightly from the side. Photorealistic, soft velvety texture. Front view, centred, not cropped, generous empty margin. Soft light from the top-left. No cast shadow, no glow outside its outline. No text. True transparent background PNG (real alpha channel). Make three separate images, one petal each.
```
Kontrol: her dosyada tek yaprak; gölge yok; gerçek alfa (açılışta 5, RSVP gönderiminde 9 yaprak süzülür;
azaltılmış harekette hiç).

#### W2.11 Sayfa zemini (kutu sayfası + home, telefon)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/bg_page.png` · 1024×1536 · opak

```
A vertical phone-screen background, soft and pastel: warm blush paper (#F7E4E2) with a delicate, very faint satin sheen, airy watercolour washes of rose quartz in the top-left and bottom-right corners, two or three tiny pale petals only at the far edges, fine paper grain everywhere. The whole central 70% of the image — and especially the upper half, where dark text sits — stays calm, light and empty (no box, no figure, no text). No text, letters or numbers.
```
Kontrol: orta %70 ve üst yarı sakin ve açık; renk yalnız köşelerde; yazı yok.

#### W2.12 Saten zemin (davet, program, RSVP kartı)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/satin_bg.png` · 1024×1024 · opak

```
A smooth blush satin fabric surface (#FAECE9) with very soft, wide, low-contrast folds and a gentle sheen, seen from above, evenly lit, no objects, no seams, no strong highlights or dark creases — calm enough for dark text set on it anywhere. No text.
```
Kontrol: düşük kontrast; nesne yok; üzerinde koyu yazı okunur.

#### W2.13 Website hero + paylaşım görseli (og:image kaynağı)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/parts/web_hero.png` · 1536×1024 · opak

```
Wide horizontal scene in the same style: the open rose-quartz music box (as box_body.png, interior.png and lid_open.png, the oval mirror showing only a soft blurred pink reflection, no face) with the porcelain ballerina figurine (as dancer.png) on its pedestal and the brass key on its side, standing on a blush satin cloth with a few scattered rose petals and a wisp of pale tulle, soft blush wall behind. The box sits in the lower 75% of the image, fully visible; the top 20% is calm empty wall. Photorealistic, pastel. No text, letters, logos or price tags. This image is also cropped to 1200×630 for link previews.
```
Kontrol: kutu + balerin altta tam görünür; aynada yüz yok; üst %20 boş; yazı yok.

Gelince: `python3 platform/themes/music-box-ballerina/build_images.py` (her parçayı kendisi bulur; `img/manifest.json`
→ `sources` hangi katmanın GPT'den geldiğini yazar). Betik menteşe/anahtar eksenlerini, ayna penceresini (yeşil) ve
kartın yükselişini ölçer, `img/manifest.json` → `stage`'e **ve** `site.css`'in `/* stage:begin … stage:end */` bloğuna
yazar (elle kopya yok; tema testi karşılaştırır). Dönüş şeritleri yoksa `dancer.png` 2B döndürülür (yatay ölçek |cos|).
Her parça sayfaların istediği tuvale/genişliğe ölçeklenir; küçük gelen parça büyütülür ve uyarı yazar — o parçayı GPT'den
büyük iste. `card_small` kartı 500:330'dan %4'ten fazla saparsa, `bg_page` üst-orta bölgesi yazı için fazla koyu/hareketliyse
uyarı yazar. Prova: `python3 tools/gpt_kuru_deneme.py --tema music-box-ballerina --sekil collections/32_Music_Box_Ballerina/assets/gpt/kuru_sekil.json`.

---

## PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin)

Ortak: photorealistic fine-art wedding photography, soft natural light, pastel rose-quartz / blush / cream palette with a
touch of soft gold, gentle film grain. Kurgu bir çift, otuzlu yaşların başında; ünlü ya da gerçek bir kişiye benzemesin.
Yazı, logo, tabela yok.

#### 2.1 Ana portre (aynada ve davetin yanında)
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/hero_portrait.jpg` · Dikey (1024×1280, 4:5)

```
Photorealistic fine-art wedding portrait, vertical 4:5, a fictional couple in their early thirties in a light-filled garden pavilion with tall windows and climbing pale pink roses: the bride in an ivory gown with a soft tulle skirt, the groom in a dove-grey suit with a blush rose boutonnière, close together and smiling, waist-up, faces centred in the upper half of the frame (the photo is also shown cropped to an oval). Pastel rose-quartz, blush and cream palette, soft daylight, gentle film grain. They must not resemble any real or famous person. No text, no frame, no watermark.
```

#### 2.2 Ayna 1 — "Our first dance"
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_1.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5, in smart evening clothes dancing a slow first dance together in a softly lit old ballroom with warm string lights, laughing, faces in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No readable signs, no text, no logos.
```

#### 2.3 Ayna 2 — "A little music box"
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_2.jpg` · Dikey (1024×1280, 4:5)

```
The same fictional couple, vertical 4:5: the proposal at home by a window on a winter afternoon — he holds out a small open rose-coloured music box with a tiny ring inside, she covers her mouth in happy surprise; faces and the box in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No text, no logos.
```

#### 2.4 Ayna 3 — "Yours, forever"
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_3.jpg` · Dikey (1024×1280, 4:5)

```
Close-up, vertical 4:5: the couple's joined hands with a delicate engagement ring, resting on blush satin beside a few rose petals and a little brass music box key; the hands in the centre of the frame (shown cropped to an oval). Photorealistic, same palette and grain. No text.
```

#### 2.5 Mekân
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/photos/venue.jpg` · Yatay (1536×1024, 16:9 kırpılır)

```
Landscape: an elegant white garden pavilion with tall arched windows and a rose garden in front, set for a spring wedding with cream chairs and pale pink flowers, soft late-afternoon light. Fictional place — no recognisable real building, no people, no signs, no text. Photorealistic, same palette. Keep the pavilion in the middle 60% of the height (the photo is shown cropped to 16:9).
```

Gelince: `content.demo.json` (koleksiyon + tema kopyası) `media` alanlarına tema yolu yazılmaz — fotoğraflar
`python3 tools/kit_check.py collections/32_Music_Box_Ballerina --paket 2` ile denetlenir; theme-check onları
koleksiyondan kendisi bulur (`scripts/lib/theme-env.ts`).

---

## PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK)

Bugün basılı davetiye geçici düzende (`platform/lib/print/layouts.ts` `'music-box-ballerina'` → `composed`: sitenin
pudra kâğıdı `bg_page` + gül yaprağı `petal`). Yazı kutuları (kesim çizgisinin yüzdesi; üst, sağ, alt, sol): **ön
`[24, 13, 14, 13]`, arka `[12, 12, 20, 12]`**. Aşağıdaki iki zemin bu kutuları boş bırakacak biçimde istenir. Baskı düzeni
5×7 ve A5 için **aynı** zemini `cover` ile kullanır (A5'te ~%1,5 kenar kırpılır), bu yüzden ayrı A5 zemini istenmez.

Ölçü **taşma payı dahil** 5.25 × 7.25 in @ 300 ppi = **1575 × 2175 px** (kesim çizgisi her kenardan 38 px içeride).
Üretici bu ölçüyü veremezse aynı yönde en büyük dikey ölçüyü versin (ör. 1024 × 1536) ve çıktısında yazsın; Claude
büyütme yapmaz, gerçek ppi'yi `layouts.ts` notuna yazar. A5 (148 × 210 mm, taşmalı 154 × 216 mm @ 300 ppi = 1819 × 2551 px)
aynı zeminden `cover` ile basılır. **Hiçbir öğe sol/sağ kenara görüntü genişliğinin %10'undan, üst/alt kenara yüksekliğin
%5'inden yakın olmasın.**

#### P6.1 Ön yüz
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_front.png` · **1575 × 2175 px** (5.25 × 7.25 in @ 300 ppi) · opak

```
A full-bleed printable wedding invitation background, front side, portrait, soft and pastel: warm blush cotton paper (#F7E4E2) with fine grain everywhere. At the top centre a small photorealistic porcelain music box ballerina figurine (as dancer.png, not a real person) standing on a tiny soft-gold pedestal with two or three blush rose petals at her feet; all of it between 6% and 21% of the image height and within the middle 30% of the width. At the bottom a slim horizontal spray of pale pink rose petals and a wisp of tulle between 88% and 95% of the image height, within the middle 70% of the width. A very thin soft-gold hairline frame inset 7% from every edge. The whole area from 12% to 88% of the width and from 23% to 87% of the height is completely EMPTY, calm blush paper (no petals, shading or frame lines in it) because dark text is printed there. No text, letters, numbers, monograms, logos or watermarks. Print quality, sharp at 1575 x 2175 px.
```
Kontrol: tam taşma; x %12–88 × y %23–87 tamamen boş; balerin y %6–21; yapraklar y %88–95; yazı yok.

#### P6.2 Arka yüz
**Kaydet:** `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_back.png` · **1575 × 2175 px** · opak

```
The back side of the same printable invitation (give invitation_front.png as the reference): full-bleed blush cotton paper (#F7E4E2) with the same fine grain and the same thin soft-gold hairline frame inset 7% from every edge; only a small brass music box wind-up key lying on its side with two blush rose petals at the bottom centre, all between 83% and 93% of the image height and within the middle 30% of the width. Everything from 11% to 81% of the height, between 12% and 88% of the width, is completely EMPTY paper for the schedule and a QR code. No text, letters, numbers, logos or watermarks. Print quality, 1575 x 2175 px.
```
Kontrol: ön yüzle aynı kâğıt ve çerçeve; anahtar + yapraklar y %83–93; geri kalanı boş; yazı yok.

**Gelince (Claude, `platform/lib/print/layouts.ts` — yalnız `'music-box-ballerina'` bloğu):**
1. `sources` → `{ front: 'print/invitation_front.png', back: 'print/invitation_back.png' }` (koleksiyon `assets/gpt/` göreli).
2. `composed` → `{ front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }` (yaprak görseli
   kalkar; süs artık zeminde).
3. `front`/`back` kutularını yeni zemin üzerinde ölç (G149: her süsten ~%2 açıklık; zemin yüzdesini kesim yüzdesine çevir:
   `kesim% = (görüntü_px − 38) / 1499` yatay, `/ 2099` dikey). Prompt'a uyduysa kutular aynı kalır; süs içeri taşıyorsa
   `bands` ekle ya da kutuyu daralt.
4. `cd platform && node scripts/build-print-assets.ts --theme music-box-ballerina` (çıktı `public/print/music-box-ballerina/
   front.webp`, `back.webp`; eski `paper.webp`/`petal.webp` dosyalarını sil), `node --test tests/g149-print-layout.test.ts
   tests/theme-music-box-ballerina.test.ts`, 5×7 ve A5 örnek PDF'ine göz at; gerçek ppi'yi blok yorumuna yaz.

---

## Komutlar (Claude, parçalar gelince)

```bash
# repo kökünden
python3 platform/themes/music-box-ballerina/build_images.py          # PAKET 5 → img/ + site.css stage bloğu
python3 tools/kit_check.py collections/32_Music_Box_Ballerina --paket 2   # PAKET 2 fotoğrafları
# platform/ içinde
node scripts/build-print-assets.ts --theme music-box-ballerina        # PAKET 6 → public/print/music-box-ballerina/ (önce layouts.ts)
NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs --theme music-box-ballerina --stress --compare none
```
