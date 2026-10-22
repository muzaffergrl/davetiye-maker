# GPT iş listesi — ChatGPT'de üretilecek görseller

`python3 tools/gpt_is_listesi.py --yaz` (ya da `tools/gpt_bekleyen.py --yaz`) ile üretilir; elle düzenlenmez. Kaynak: bütün `GPT_PROMPTS.md` dosyaları. Her madde kendi başına yapıştırılabilir tam İngilizce prompt'tur. Tıklanabilir, kopyalama düğmeli ve işaretlenebilir sürüm: [`27_GPT_IS_LISTESI.html`](27_GPT_IS_LISTESI.html) (tarayıcıda aç).

**Toplam: 36 görsel** · A · Tasarım 22–38 (yeni tasarımlar): 14 · C · Palet varyantı görselleri: 1 · D · Diğer (marka): 21

## Neden bu sıra

22–32 tasarımları 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu: website parçaları (PAKET 5) artık istenmiyor; bu tasarımlardan yalnız ilan sahneleri (PAKET 3) ve yeni görünüme uyan baskı zeminleri (PAKET 6) isteniyor, örnek fotoğrafları (PAKET 2) isteğe bağlı ve grubun sonunda. 33–38 ancak kendi website parçaları (PAKET 5) gelince geçici yer tutuculardan çıkıp live olabilir; örnek fotoğraflar (PAKET 2) theme-check ve demo için, ilan sahneleri (PAKET 3) ve baskı zeminleri (PAKET 6) satış paketi için gerekir. 01–21'in website parçaları tam; bu gruptaki 2× baskı parçaları yalnız basılı davetiyeyi ~230 ppi'den 300 ppi'ye çıkarır (bugünkü parçalarla da çalışıyor). Palet varyantları en sonda: o paletler `coming` ve GPT gelene dek asıl renkli parçayla görünüyor; fildişi gül paleti yalnız istenirse.

## ChatGPT'de çalışma

1. Her tasarım için **yeni bir sohbet** aç ve o tasarımın maddelerini aynı sohbette sırayla üret (stil, ışık, malzeme tutarlı kalsın). Tasarım başlığındaki İngilizce GPT notu varsa önce onu gönder; notta adı geçen repo görsellerini (ör. 22–32'de `bg_scene-1024.webp` ve `v3-closed-880.webp`) o ilk mesaja ekle.
2. **Her mesajda tek görsel:** "Prompt'u kopyala" → ChatGPT'ye yapıştır → gönder. Prompt'u kısaltma, Türkçeye çevirme.
3. Ölçü / oran ve şeffaf zemin prompt'un içinde yazar; ChatGPT farklı verirse aynı sohbette "same image, exactly W×H px (oran), true transparent background PNG" diye bir kez iste. Oran ±%2 tutmalı; çözünürlük küçükse yalnız uyarı.
4. **Ek görsel** satırı varsa o dosyayı (listede daha önce ürettiğin ya da repodaki) mesaja görsel olarak ekle.
5. Görseli **PNG** olarak indir (fotoğraflar .jpg hedefli olsa da PNG indir; yerleştirici dönüştürür).
6. "Dosya adını kopyala" ile dosyayı **indirme adıyla** yeniden adlandır ve hepsini tek klasörde topla. Sonra Claude: `python3 tools/gpt_yerlestir.py --klasor <klasör>` (kuru) → `--uygula`. Adı değiştirmediysen (ChatGPT adıyla kaldıysa) otomatik eşleşmez: Claude görsellere bakıp `--eslestir harita.json` yazar — daha yavaş.
7. ChatGPT **şeffaf zemin vermiyorsa**: prompt dosyalarında yazılı bir yedek yol (#00FF00 ya da düz zemin) yok — beyaz/damalı zeminli görseli kaydetme (yerleştirici reddeder). Maddeyi **Sorun** olarak işaretle ve geç; Claude sonra bakar. Bir maddede yedek yazıyorsa maddenin içinde "Şeffaf yedek" satırı görünür.
8. Görselde yazı, harf, logo, QR benzeri kare çıkarsa yeniden üret — hiçbir parçada yazı istenmiyor.

## Sayım

| Grup | Tasarım | Görsel |
|---|---|---|
| A | 33_Marigold_Mehndi | 3 |
| A | 34_Red_Lacquer_Double_Happiness | 3 |
| A | 35_Highland_Tartan_Thistle | 2 |
| A | 36_Victorian_Glasshouse | 2 |
| A | 37_Art_Nouveau_Lily | 2 |
| A | 38_Papel_Picado_Fiesta | 2 |
| C | 21_Crimson_Rose_Atelier | 1 |
| D | brand | 21 |

## A · Tasarım 22–38 (yeni tasarımlar)

### 33_Marigold_Mehndi

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, scripts of any language, monograms, logos or watermarks in any image. No religious symbols or deities** (no Om, no swastika, no Ganesha, no temple, no sacred fire, no kalash): this is a festive, cultural look — marigolds, henna patterns, silk, brass lamps, carved arches — not a religious one. Give W2.1 `silk.png`, W2.14 `velvet.png`, W2.15 `paper.png` and W2.2 `sleeve.png` as the style reference of every later part: the same fuchsia silk, the same velvet, the same saffron paper, the same warm gold.
```

#### 1. W2.2 Altın lazer kesim paisley kılıf (açılışta yana kayar)

- İndirme adı: `33-marigold-mehndi__sleeve.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/sleeve.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×500 px (12:5) · şeffaf zemin (gerçek alfa) · PNG

```
A wide horizontal band of thin gold metallic card, laser-cut in an intricate openwork pattern of paisleys, small marigold flowers and fine vines, seen straight from the front on a fully transparent background, the band filling the image edge to edge (2.4:1): warm gold (#C9A24A) with gold-leaf highlights (#EBCD84), the cut-outs are TRUE TRANSPARENT holes (about 40% of the band is open lace, so the silk behind shows through), a slim solid gold edge along the top and bottom. Soft warm light from the top-left, the gold gently curved as if wrapped round an envelope. No tassel, no seal, no shadow outside the band. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: bant tuvali dolduruyor (2,4:1); kesik yerleri gerçekten şeffaf; püskül/mühür yok; gerçek alfa.

#### 2. W2.9 Kına deseni zemini (Story arka planı)

- İndirme adı: `33-marigold-mehndi__mehndi_pattern.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/mehndi_pattern.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A seamless, tileable all-over pattern of fine henna (mehndi) line art in a light saffron-gold (#F7C27A) on a fully transparent background: an even scatter of small paisleys, tiny flowers, leaves and dots linked by delicate vines, thin even lines, no filled areas, generous space between motifs. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: dikişsiz; yalnız ince çizgi; motifler seyrek; alfa.

#### 3. W2.13 Zarfın düz kapağı (ön yüz)

- İndirme adı: `33-marigold-mehndi__flap.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1524×800 px (1.905:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: silk.png (repoda: collections/33_Marigold_Mehndi/assets/gpt/parts/silk.png)

```
The closed top flap of the same fuchsia silk envelope, seen straight from the front on a fully transparent background, filling the image edge to edge (1.9:1): a RECTANGULAR flap (not a V, not a point) of the same fuchsia raw silk as silk.png, its lower edge straight with a slim gold piping and a delicate border of tiny gold-embroidered paisleys along it, a soft fold highlight along the top edge where it is hinged. Soft warm light from the top-left. No seal, no button, no sleeve, no shadow outside. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: dikdörtgen kapak (V değil); alt kenar düz ve altın biyeli; mühür yok; alfa.

### 34_Red_Lacquer_Double_Happiness

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, logos, monograms, seals with writing or watermarks in any image.** The only character allowed anywhere is the double happiness character 囍, and only in W2.11 `xi_gold.png` (and in W2.20 / PAKET 6 where the prompt asks for it) — never any other Chinese character, no stamp, no calligraphy, no religious symbol (no Buddha, no temple, no deity, no incense, no shrine). Give W2.2 `red_paper.png`, W2.3 `cream_paper.png`, W2.4 `gold_leaf.png` and W2.7 `envelope_flap.png` as the style reference of every later part: the same cinnabar paper, the same warm cream, the same gold leaf, the same crisp paper-cut technique.
```

#### 4. W2.6 Zarfın ön cebi

- İndirme adı: `34-red-lacquer-double-happiness__envelope_pocket.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×1500 px (0.660:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_back.png (repoda: collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_back.png), red_paper.png (repoda: collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/red_paper.png)

```
The front pocket of the same tall vertical red envelope as envelope_back.png, seen straight from the front, on a fully transparent background, drawn on the full envelope canvas: the pocket is the same cinnabar red paper as red_paper.png and covers the image from 30% of its height down to the bottom edge, full width; its top edge at 30% is a clean straight cut with a fine gold-leaf edge line; everything above 30% is fully transparent. Very soft folds of real paper at the sides, a hair of shadow under the top edge, soft warm light from the top-left. The pocket is PLAIN: no character, no flower, no button, no cord drawn on it (they are separate layers). No text, letters, numbers or symbols. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: cep %30'dan aşağı, üstü tamamen şeffaf; cep düz (düğme, ip, 囍 yok); gerçek alfa.

#### 5. W2.12 Dış kâğıt kesim pencere (kırmızı; ortadan ikiye kesilir)

- İndirme adı: `34-red-lacquer-double-happiness__veil_outer.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_outer.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (repoda: collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/red_paper.png)

```
A single sheet of red Chinese paper-cut (jianzhi) in the same cinnabar red paper as red_paper.png, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): an intricate window grille pattern with a large blooming tree peony in the centre, peony leaves and buds, auspicious cloud scrolls and a fine lattice border all round, the cut-away parts fully transparent (real openings, about 45% of the area open), crisp clean cut edges with a hair of shadow. The design is perfectly mirror-symmetric left to right (it will be cut down the vertical centre line into two shutter halves), with no important detail exactly on the centre line. No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: tuvali dolduran tek kâğıt kesim; ortadan simetrik; açık yerler gerçekten şeffaf; yazı yok.

#### 6. W2.13 İç kâğıt kesim pencere (altın; ortadan ikiye kesilir)

- İndirme adı: `34-red-lacquer-double-happiness__veil_inner.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_inner.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: veil_outer.png (listede #5)

```
A single sheet of fine gold paper-cut (gold-leaf paper) of the same size, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): a lighter, finer pattern than veil_outer.png — a delicate lattice of plum blossoms and small cloud scrolls with two smaller peonies, about 60% of the area cut away (fully transparent openings), crisp edges, a soft gold satin shine from the top-left. Perfectly mirror-symmetric left to right (it is cut down the vertical centre line into two halves). No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: altın, dış kattan daha ince ve açık; simetrik; açık yerler şeffaf; yazı yok.

### 35_Highland_Tartan_Thistle

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, monograms, clan crests, coats of arms, flags, religious symbols, logos or watermarks in any image.** The tartan is an original heather-and-moss sett invented for this design — it must not copy any registered clan or brand tartan. Give W2.1 `tartan_wool.png`, W2.2 `cream_paper.png` and W2.6 `envelope_back.png` as the style reference of every later part: the same wool, the same cream paper, the same warm saddle leather and antique brass, the same soft daylight.
```

#### 7. W2.7 Zarfın ön cebi

- İndirme adı: `35-highland-tartan-thistle__envelope_front.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_front.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_back.png (repoda: collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_back.png), tartan_wool.png (repoda: collections/35_Highland_Tartan_Thistle/assets/gpt/parts/tartan_wool.png)

```
Only the front pocket of the same tartan wool envelope as envelope_back.png, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from 34% of the image height down to the bottom edge, its straight top edge finished with a narrow folded hem and a fine line of cream stitching, soft daylight from the top-left. The upper 34% of the canvas is completely transparent. No flap, no strap, no buckle, no card, no shadow outside the pocket. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: cep tuvalin %34'ünden alta, tam genişlikte; üstü tamamen şeffaf; kayış/toka yok; gerçek alfa.

#### 8. W2.8 Zarfın düz kapağı (V değil)

- İndirme adı: `35-highland-tartan-thistle__flap.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: tartan_wool.png (repoda: collections/35_Highland_Tartan_Thistle/assets/gpt/parts/tartan_wool.png)

```
Only the closed flap of the same tartan wool envelope, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from the top edge down to 56% of the image height, folded down over the pocket, with a soft rounded fold along its top edge and a STRAIGHT bottom edge (not a V, not a point, not scalloped) finished with a narrow hem and a fine line of cream stitching; a very soft shade along its bottom edge. The lower 44% of the canvas is completely transparent. No strap, no buckle, no seal, no button, no card. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: kapak üstten %56'ya, tam genişlik; alt kenar **düz**; mühür/düğme/kayış yok; altı tamamen şeffaf; gerçek alfa.

### 36_Victorian_Glasshouse

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, Latin plant names, labels with writing, logos, monograms or watermarks in any image** (a blank label, a blank seed packet and engraved botanical line art without lettering are fine). Give W3.1 `fern_ground.png`, W3.3 `herbarium_paper.png` and W3.4 `packet_body.png` as the style reference of every later part: the same deep fern green, the same herbarium paper, the same kraft, copper and jute, the same soft daylight through glass.
```

#### 9. W3.6 Bakır bitki etiketi (boş; monogram/numara site yazar)

- İndirme adı: `36-victorian-glasshouse__copper_tag.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/copper_tag.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 600×800 px (3:4) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A small antique copper plant label as used in a Victorian glasshouse, seen straight on, alone on a fully transparent background, filling the image edge to edge (3:4): a rectangular copper plate with softly rounded corners and a slim raised rim, warm copper (#B26A3C) with a gentle patina and a little verdigris (#6F9E8E) at the edges, a small round punched hole near the top-left corner filled with flat pure green #00FF00 (no texture, no shading), the centre of the plate smooth and EMPTY (the website stamps letters there). Soft daylight from the top-left. No string, no text, letters, numbers or engraving in the centre. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt had no window. The photo window must be a clearly visible, SOLID, fully opaque flat #00FF00 green area inside the object (not transparent, not a hole), at least 25% of the object's area.
```

Kontrol: boş merkez; delik sol üstte, düz `#00FF00`; ip yok; alfa.

#### 10. W3.10 Eğrelti otları ve orkide (açılış ve home çerçevesi)

- İndirme adı: `36-victorian-glasshouse__ferns.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/ferns.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1800×1200 px (3:2) · şeffaf zemin (gerçek alfa) · PNG

```
Lush botanical fern fronds rising from the bottom-left and bottom-right corners of the image on a fully transparent background, as a frame for something in the middle: maidenhair and sword ferns in deep and fresh greens, a few curled fiddleheads, and on the right one arching spray of white-and-blush moth orchids; photorealistic leaves with the fine detail of a botanical engraving, soft daylight from the top-left. The centre of the image (from 25% to 75% of the width and the whole upper 60%) is EMPTY transparency. No pots, no glass, no insects, no text. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: bitkiler alt köşelerde, orta ve üst %60 boş; saksı/yazı yok; alfa.

### 37_Art_Nouveau_Lily

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, monograms, logos, signatures or watermarks in any image.** Give W2.1 `cream_paper.png`, W2.4 `env_back.png` and W2.6 `petal_centre.png` as the style reference of every later part: the same cream paper, the same soft gold, the same sage and lilac, the same Art Nouveau line (Mucha-style poster + stained glass). No peacock feathers anywhere (that is another design).
```

#### 11. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_right.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_right.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_back.png), env_pocket.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_pocket.png), cream_paper.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/cream_paper.png)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_right (number 2 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file. RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

#### 12. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_centre.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_centre.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_back.png), env_pocket.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_pocket.png), cream_paper.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/cream_paper.png)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_centre (number 3 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file. RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

### 38_Papel_Picado_Fiesta

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, words cut into the paper, names, dates, logos, monograms or watermarks in any image.** **No religious symbols** (no crosses, saints, hearts with flames or thorns, churches, altars) and **no Day of the Dead imagery** (no skulls, skeletons, calaveras, marigold altars): this is a joyful wedding fiesta. Give W1 `kraft_paper.png`, W3 `cream_paper.png` and W8 `flag_1.png` as the style reference of every later part: the same kraft, the same cream paper, the same crisp hand-cut tissue paper in the same six colours, the same warm afternoon sun from the top-left.
```

#### 13. W5 Zarfın cebi (arkadan, kapaksız)

- İndirme adı: `38-papel-picado-fiesta__envelope_pocket.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1110×1500 px (0.740:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: kraft_paper.png (repoda: collections/38_Papel_Picado_Fiesta/assets/gpt/parts/kraft_paper.png)

```
The back of a portrait kraft paper envelope seen perfectly straight on, on a fully transparent background, the envelope filling the image edge to edge (the image IS the envelope, 0.74:1): the same kraft paper as kraft_paper.png, the two side flaps and the bottom flap folded in and glued, their soft fold lines and slightly lifted paper edges visible, the top edge straight and open (this is where the card comes out — no flap is drawn, no V shape at the top). Warm sun from the top-left, a soft natural shade along the folds. No seal, no sticker, no stamp, no string, no card inside, no cast shadow outside the envelope. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: zarf tuvali dolduruyor (0,74:1); üstte düz açık kenar, V kapak **yok**; mühür/ip yok; gerçek alfa.

#### 14. W12 Bugenvil salkımı (köşe süsü)

- İndirme adı: `38-papel-picado-fiesta__bougainvillea.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bougainvillea.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×1000 px (6:5) · şeffaf zemin (gerçek alfa) · PNG

```
A lush cluster of magenta-fuchsia bougainvillea spilling diagonally from the top-left corner toward the centre, alone, on a fully transparent background: woody stems, fresh green leaves, many papery bracts in vivid fuchsia with tiny cream flowers at their hearts, a few single bracts drifting loose near the tips, photorealistic in warm top-left sun. The cluster touches the top and left edges and leaves the bottom-right third empty. No pot, no wall, no shadow, no other flower. No text. True transparent background PNG (real alpha channel). RETRY NOTE: the first attempt touched the image border. Keep the WHOLE object at least 6% inside every edge of the canvas: nothing may touch or be cut by the image border, and the background must be fully transparent all around.
```

Kontrol: salkım sol üst köşeden taşar; sağ alt üçte bir boş; saksı/duvar yok; alfa.


## C · Palet varyantı görselleri

### 21_Crimson_Rose_Atelier

#### 15. İstem — fildişi güller (yalnız istenirse) — isteğe bağlı

- İndirme adı: `21-crimson-rose-atelier__v07-ivory-rose__rose-branch.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png`
- Bölüm: İstem — fildişi güller (yalnız istenirse) (palet varyantı)
- Şart: 1374×1145 px (6:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png)

```
Photorealistic botanical illustration of a branch of three fully open IVORY / soft cream garden roses with dark green rose leaves and a few small buds, painted in exactly the same style, lighting, angle and composition as the reference image (a diagonal branch of three red roses running from lower left to upper right). Keep the same size and position of every rose and leaf; only the petal colour changes to natural ivory-white with warm cream shadows (no pink, no yellow cast). Transparent background (PNG, alpha), no shadow on the ground, no text, no frame. Canvas 1374 × 1145 px.
Reference: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png
```


## D · Diğer (marka)

### brand

#### 16. SM1.1 Designs — mühürlü zarf

- İndirme adı: `brand__social__highlight_designs.png`
- Hedef: `brand/social/gpt/highlight_designs.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

An Instagram story highlight cover, 9:16 portrait: a solid deep aubergine (#2B1526) background with a very subtle fine paper grain, and in the exact center a simple, elegant single-line icon drawn in flat champagne gold (#D0AE6A): a closed envelope with a small round wax seal on its V flap. Even line weight, rounded line ends, minimal detail, the icon about 34% of the image width, perfectly centered horizontally and vertically, nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: ikon tam ortada ve genişliğin ~%34'ü; tek çizgi, düz altın; zemin düz patlıcan; yazı yok.

#### 17. SM1.2 How it works — telefon ve dokunuş

- İndirme adı: `brand__social__highlight_how.png`
- Hedef: `brand/social/gpt/highlight_how.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

Same style and size as the previous highlight cover (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is a smartphone seen from the front with a fingertip touching the center of its screen and two small curved lines showing the tap. Nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: SM1.1 ile aynı çizgi kalınlığı ve boyut; telefon + parmak ucu; yazı yok.

#### 18. SM1.3 RSVP — yanıt kartı

- İndirme adı: `brand__social__highlight_rsvp.png`
- Hedef: `brand/social/gpt/highlight_rsvp.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

Same style and size as the previous highlight covers (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is a small reply card with a check mark inside a circle in its lower half and two short blank lines above it. The lines are plain strokes, not letters. Nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: kartta harf yok (yalnız çizgi ve tik); aynı stil.

#### 19. SM1.4 FAQ — konuşma balonu

- İndirme adı: `brand__social__highlight_faq.png`
- Hedef: `brand/social/gpt/highlight_faq.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

Same style and size as the previous highlight covers (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is two overlapping rounded speech bubbles, the front one with three small dots inside. No question mark, no letters. Nothing else in the image. No text, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: soru işareti ya da harf yok; aynı stil.

#### 20. SM1.5 Tips — açık defter

- İndirme adı: `brand__social__highlight_tips.png`
- Hedef: `brand/social/gpt/highlight_tips.png`
- Bölüm: SM1 — Instagram öne çıkan (highlight) kapakları (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of five matching Instagram highlight covers: the same background, the same line weight, the same size and position of the icon in every one.

Same style and size as the previous highlight covers (solid deep aubergine #2B1526 background with a very subtle paper grain, one centered single-line icon in flat champagne gold #D0AE6A, same line weight, about 34% of the image width): the icon is an open notebook with a small ribbon bookmark and a few plain lines on its pages (strokes, not writing). Nothing else in the image. No text, no letters, no numbers, no glow, no shadow, no metallic shine.
```

Kontrol: sayfalarda yazı yok; beş kapak yan yana aynı aileden görünüyor.

#### 21. SM2.1 Kaydırmalı gönderi kapağı — açık

- İndirme adı: `brand__social__bg_carousel_cover_light.png`
- Hedef: `brand/social/gpt/bg_carousel_cover_light.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 4:5 portrait, of a warm paper surface (#EDE5D7 to #FAF7F0) with a fine natural paper texture. Along the right edge only, partly cut off by the frame: a sprig of dried white flowers, a loose champagne-gold silk ribbon and the corner of a pale lavender envelope, with soft natural shadows from window light at the top-left. The left 65% and the middle of the image are calm, completely empty paper for a large headline. No text, no letters, no logos, no phone.
```

Kontrol: sol %65 tamamen boş; nesneler yalnız sağ kenarda; yazı yok.

#### 22. SM2.2 Kaydırmalı gönderi iç sayfası — açık

- İndirme adı: `brand__social__bg_carousel_inner_light.png`
- Hedef: `brand/social/gpt/bg_carousel_inner_light.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 4:5 portrait, of the same warm paper surface as the previous image (#EDE5D7 to #FAF7F0, fine natural paper texture), almost empty: only a very soft, out-of-focus shadow of a leafy branch falling across the top-right corner from window light. Everything else is calm, even, empty paper for text and screenshots. No objects, no text, no letters, no logos.
```

Kontrol: neredeyse boş; gölge yalnız sağ üst köşede; düz ışık (metin okunur kalsın).

#### 23. SM2.3 Kaydırmalı gönderi — koyu (kapak ya da son sayfa)

- İndirme adı: `brand__social__bg_carousel_dark.png`
- Hedef: `brand/social/gpt/bg_carousel_dark.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 4:5 portrait, of deep aubergine (#2B1526) heavyweight cotton paper with a soft natural texture, lit by soft window light from the top-left. In the bottom-right corner only, partly cut off by the frame: a folded champagne-gold silk ribbon and a single dried rose. The rest of the image (about 80%) is calm, empty dark paper for light text. No text, no letters, no logos, no phone, no metallic shine.
```

Kontrol: %80 boş koyu zemin; nesneler yalnız sağ alt köşede; yazı yok.

#### 24. SM2.4 Hikâye zemini — açık

- İndirme adı: `brand__social__bg_story_light.png`
- Hedef: `brand/social/gpt/bg_story_light.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 9:16 portrait, of a warm paper surface (#EDE5D7 to #FAF7F0) with a fine natural texture. At the very top edge, partly cut off: a champagne-gold silk ribbon lying across and two small sprigs of dried flowers; at the very bottom edge, partly cut off: the corner of a pale lavender envelope. The middle 70% of the image is calm, completely empty paper. Soft window light from the top-left. No text, no letters, no logos, no phone.
```

Kontrol: orta %70 boş (Instagram'ın üst/alt arayüzü kenar süsleri örter, sorun değil); yazı yok.

#### 25. SM2.5 Hikâye zemini — koyu

- İndirme adı: `brand__social__bg_story_dark.png`
- Hedef: `brand/social/gpt/bg_story_dark.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead photograph, 9:16 portrait, of deep aubergine (#2B1526) heavyweight cotton paper with a soft natural texture, lit by soft window light from the top-left. At the very top edge, partly cut off: a folded champagne-gold silk ribbon; at the very bottom edge, partly cut off: a single dried rose and a few petals. The middle 70% is calm, completely empty dark paper. No text, no letters, no logos, no phone, no metallic shine.
```

Kontrol: orta %70 boş; altın düz renk (folyo parlaması yok); yazı yok.

#### 26. SM2.6 Pinterest rehber pini zemini

- İndirme adı: `brand__social__bg_pin_guide.png`
- Hedef: `brand/social/gpt/bg_pin_guide.png`
- Bölüm: SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) (sosyal medya (GM10))
- Şart: 1000×1500 px (2:3) · opak · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of matching backgrounds for posts and stories: real-looking overhead photographs of paper and linen with natural window light, warm and calm, true-to-life color. Keep the empty area described in each prompt completely free of objects: headlines and real screenshots go there.

Overhead styled flat lay photograph, 2:3 portrait, on warm off-white linen (#FAF7F0): along the top edge only, partly cut off by the frame, a few wedding planning details — a pale lavender envelope, a champagne-gold silk ribbon, a fountain pen and a small sprig of white flowers. The lower 75% of the image is a calm, empty sheet of warm paper (#EDE5D7) lying on the linen, with straight edges, ready for a checklist to be written on it. Soft natural daylight from the top-left with soft shadows. No text, no letters, no numbers, no logos, no phone.
```

Kontrol: alt %75 boş kâğıt; kâğıtta yazı/çizgi yok; nesneler yalnız üst kenarda.

#### 27. SM3.1 Planlama masası, telefon elde

- İndirme adı: `brand__social__scene_planning_desk.png`
- Hedef: `brand/social/gpt/scene_planning_desk.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait, seen from slightly above: a fictional woman's hand (only the hand and wrist, a delicate engagement ring, natural nails) holding a smartphone upright over a wooden desk covered with gentle wedding planning details — an open linen planner with blank pages, fabric swatches in blush and sage, a cup of coffee, a few loose dried flowers. The phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large in the frame (about 45% of the image height) and fully visible, not covered by the thumb. The upper-left quarter of the image stays calm and uncluttered. Warm morning window light, soft shadows, true-to-life colors. No text, no letters, no logos.
```

Kontrol: ekran büyük, düz yeşil, parmaksız; yüzük var; plannerda yazı yok; sol üst sakin.

#### 28. SM3.2 Mühürlü zarfın üstünde telefon

- İndirme adı: `brand__social__scene_phone_on_envelope.png`
- Hedef: `brand/social/gpt/scene_phone_on_envelope.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Overhead photograph, 4:5 portrait: a smartphone lying flat on top of a real cream paper envelope that is closed with a round deep aubergine (#2B1526) wax seal (the seal's face is a plain smooth circle with no letter or symbol), on warm off-white linen. A champagne-gold silk ribbon and a few loose white petals around them. The phone sits in the center, perfectly straight, its entire screen a flat pure green #00FF00 rectangle with no reflections. Soft natural daylight from the top-left, soft shadows, premium editorial still life. No hands, no text, no letters, no logos.
```

Kontrol: mühür yüzü boş (harf/sembol yok); telefon düz ve ortada; yeşil yansımasız.

#### 29. SM3.3 Yeni nişanlı, kış ışıkları

- İndirme adı: `brand__social__scene_just_engaged_winter.png`
- Hedef: `brand/social/gpt/scene_just_engaged_winter.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait: close-up of a fictional woman's left hand with a new engagement ring, holding a smartphone, and her partner's hand resting gently on her wrist, in a cozy living room in December — soft out-of-focus warm string lights and a hint of evergreen in the background, a knit sweater sleeve. The phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large (about 45% of the image height), fully visible and not covered by fingers. Warm, joyful, intimate mood, natural light mixed with warm bokeh. Anatomically correct hands. No faces, no text, no letters, no logos.
```

Kontrol: iki el doğal ve doğru; yüzük görünür; ekran büyük ve açık; yüz yok.

#### 30. SM3.4 Akşam yemeği masası (Pinterest)

- İndirme adı: `brand__social__scene_dinner_table.png`
- Hedef: `brand/social/gpt/scene_dinner_table.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1000×1500 px (2:3) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 2:3 portrait: an elegant candlelit dinner table set for a wedding celebration — linen tablecloth, taper candles, low garden roses and greenery, crystal glasses — and in the foreground a smartphone standing upright on a small stand, slightly angled toward the camera, its entire screen a flat pure green #00FF00 rectangle, large and fully visible. Warm candlelight with soft evening ambient light, shallow depth of field on the background. The top 25% of the image is calm, darker background suitable for a headline. No people, no text, no letters, no logos, no menu cards with writing.
```

Kontrol: ekran büyük ve okunur açıda; üst %25 sakin; masada yazılı kart yok.

#### 31. SM3.5 Çiçekli keten, üstten (Pinterest)

- İndirme adı: `brand__social__scene_linen_flatlay.png`
- Hedef: `brand/social/gpt/scene_linen_flatlay.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1000×1500 px (2:3) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Overhead flat lay photograph, 2:3 portrait, on soft white linen: a smartphone in the lower center, perfectly straight, its entire screen a flat pure green #00FF00 rectangle with no reflections; around it, mainly in the upper half, loose garden roses and sweet peas in blush, ivory and soft lavender, a champagne-gold silk ribbon and a blank cream place card. The top 20% stays calm linen for a headline. Soft natural daylight from the top-left, soft shadows, premium editorial still life. No hands, no text, no letters, no logos.
```

Kontrol: telefon düz; üst %20 boş; kartta yazı yok.

#### 32. SM3.6 Bahçede altın saat (hikâye / Reel kapağı)

- İndirme adı: `brand__social__scene_garden_golden_hour.png`
- Hedef: `brand/social/gpt/scene_garden_golden_hour.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1920 px (9:16) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 9:16 portrait: a fictional woman's hand holding a smartphone up at chest height in a blooming garden at golden hour, roses and soft greenery blurred behind, warm sunlight flaring gently from the side. The phone's entire screen is a flat pure green #00FF00 rectangle facing the camera, large (about 40% of the image height), in the vertical middle of the frame, fully visible and not covered by fingers. The top 20% and bottom 20% of the image are soft, calm background. Anatomically correct hand, a delicate ring, no face. No text, no letters, no logos.
```

Kontrol: ekran dikeyde ortada; üst ve alt %20 sakin (Reel arayüzü oraya biner); yazı yok.

#### 33. SM3.7 Kafede davetiyeyi alan misafir

- İndirme adı: `brand__social__scene_guest_cafe.png`
- Hedef: `brand/social/gpt/scene_guest_cafe.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait: a fictional man in his thirties (not resembling any real person), seen from the shoulder down at a sunny café table, holding a smartphone in one hand and smiling slightly (only the lower half of his face visible at most), a cappuccino and a croissant on the table. The phone's entire screen is a flat pure green #00FF00 rectangle angled toward the camera, large and fully visible, not covered by fingers. Natural relaxed moment, correct hands, warm daylight, soft background. No text, no letters, no logos, no menus with writing.
```

Kontrol: kimliği belirgin yüz yok; ekran okunur açıda; yazı yok.

#### 34. SM3.8 Karşılama masasında QR kartı (yeşil alan = QR)

- İndirme adı: `brand__social__scene_qr_welcome_table.png`
- Hedef: `brand/social/gpt/scene_qr_welcome_table.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait: a wedding welcome table with a small framed card (5×7 inch, cream paper in a thin gold frame) standing on an easel-back, beside a low arrangement of white roses and eucalyptus and two small candles. In the center of the card there is one perfectly square flat pure green #00FF00 area (about 45% of the card's width), with a wide empty cream margin all around it; the rest of the card is blank. The card faces the camera straight on, sharp and well lit. Soft daylight, shallow depth of field. No phone, no people, no text, no letters, no QR pattern, no logos.
```

Kontrol: yeşil alan tam kare ve tek; kartta başka yazı/desen yok; telefon yok. (Claude buraya `tools/make_qr.py` ile gerçek QR koyar.)

#### 35. SM3.9 Sonbahar şükran masası (teşekkür modu)

- İndirme adı: `brand__social__scene_autumn_thanks.png`
- Hedef: `brand/social/gpt/scene_autumn_thanks.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Lifestyle photograph, 4:5 portrait, seen from slightly above: a cozy late-November table — a linen napkin, small white pumpkins, burgundy dahlias, a few copper autumn leaves, a cup of tea — and a fictional woman's hand holding a smartphone toward the camera, its entire screen a flat pure green #00FF00 rectangle, large and fully visible, not covered by fingers. Warm, grateful, homey mood, soft afternoon light. Anatomically correct hand, no face. No text, no letters, no logos.
```

Kontrol: ekran büyük ve açık; mevsim hissi var; yazı yok.

#### 36. SM3.10 Kış masası, kahve ve battaniye

- İndirme adı: `brand__social__scene_winter_cozy.png`
- Hedef: `brand/social/gpt/scene_winter_cozy.png`
- Bölüm: SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) (sosyal medya (GM10))
- Şart: 1080×1350 px (4:5) · opak · düz #00FF00 pencere · PNG

```
BKE Studio makes wedding websites that open like a real invitation: on their phone, guests tap a sealed envelope, it opens with motion and the couple's website appears. These images are for BKE Studio's Instagram, TikTok and Pinterest; the audience is engaged couples aged 25-38 in the US, UK, Canada and Australia. Brand palette, used as soft accents only: deep aubergine #2B1526, flat champagne gold #D0AE6A (never shiny foil), warm paper #EDE5D7, dusty lavender #9F84A7, light page #FAF7F0. No text, letters, numbers, logos, watermarks or brand names anywhere in any image of this chat: every word is added later. This section is a set of real-looking lifestyle photographs: warm, romantic, premium but friendly, natural daylight, true-to-life color, editorial, never cluttered or stock-looking. Every phone is a plain modern smartphone with thin bezels and no visible brand, and its entire screen is ONE flat pure green #00FF00 rectangle with no reflection or glare, facing the camera, large and not covered by fingers (only one green area per image); the real product screens are placed there later. Fictional people only, never resembling a real person; hands and fingers anatomically correct; most scenes show only hands. Keep everything important at least 6% inside every edge.

Overhead photograph, 4:5 portrait: a cozy winter flat lay on a chunky cream knit blanket — a smartphone in the center, perfectly straight, its entire screen a flat pure green #00FF00 rectangle with no reflections; around it a mug of hot chocolate, a sprig of evergreen with red berries, a pine cone, a pale envelope with a plain unmarked wax seal and a few warm fairy lights. The top 20% stays calm for a headline. Soft, warm light. No hands, no text, no letters, no logos.
```

Kontrol: telefon düz ve ortada; mühür yüzü boş; üst %20 sakin; yazı yok.
