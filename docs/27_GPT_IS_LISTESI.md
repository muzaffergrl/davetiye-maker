# GPT iş listesi — ChatGPT'de üretilecek görseller

`python3 tools/gpt_is_listesi.py --yaz` (ya da `tools/gpt_bekleyen.py --yaz`) ile üretilir; elle düzenlenmez. Kaynak: bütün `GPT_PROMPTS.md` dosyaları. Her madde kendi başına yapıştırılabilir tam İngilizce prompt'tur. Tıklanabilir, kopyalama düğmeli ve işaretlenebilir sürüm: [`27_GPT_IS_LISTESI.html`](27_GPT_IS_LISTESI.html) (tarayıcıda aç).

**Toplam: 34 görsel** · A · Tasarım 22–38 (yeni tasarımlar): 33 · C · Palet varyantı görselleri: 1

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
| A | 33_Marigold_Mehndi | 6 |
| A | 34_Red_Lacquer_Double_Happiness | 4 |
| A | 35_Highland_Tartan_Thistle | 5 |
| A | 36_Victorian_Glasshouse | 7 |
| A | 37_Art_Nouveau_Lily | 5 |
| A | 38_Papel_Picado_Fiesta | 6 |
| C | 21_Crimson_Rose_Atelier | 1 |

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
A wide horizontal band of thin gold metallic card, laser-cut in an intricate openwork pattern of paisleys, small marigold flowers and fine vines, seen straight from the front on a fully transparent background, the band filling the image edge to edge (2.4:1): warm gold (#C9A24A) with gold-leaf highlights (#EBCD84), the cut-outs are TRUE TRANSPARENT holes (about 40% of the band is open lace, so the silk behind shows through), a slim solid gold edge along the top and bottom. Soft warm light from the top-left, the gold gently curved as if wrapped round an envelope. No tassel, no seal, no shadow outside the band. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: bant tuvali dolduruyor (2,4:1); kesik yerleri gerçekten şeffaf; püskül/mühür yok; gerçek alfa.

#### 2. W2.8 Kadife çiçeği çelengi

- İndirme adı: `33-marigold-mehndi__garland.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/garland.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1800×420 px (30:7) · şeffaf zemin (gerçek alfa) · PNG

```
A festive garland of fresh marigolds (toran) seen straight from the front on a fully transparent background, filling the image width: two graceful swags of densely strung orange and saffron-yellow marigold flowers hanging from the top edge, held at three points (left end, centre, right end), with short strands of marigolds and a few green mango leaves hanging down between the swags, small fuchsia rose buds tucked in here and there. Photorealistic flowers, soft warm light from the top-left. The top edge of the garland runs along the very top of the image. No string ends visible outside, no wall, no shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: iki sarkan kavis, üst kenar boyunca; çiçekler gerçekçi; arka plan yok; alfa.

#### 3. W2.9 Kına deseni zemini (Story arka planı)

- İndirme adı: `33-marigold-mehndi__mehndi_pattern.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/mehndi_pattern.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1024×1024 px (1:1) · şeffaf zemin (gerçek alfa) · PNG

```
A seamless, tileable all-over pattern of fine henna (mehndi) line art in a light saffron-gold (#F7C27A) on a fully transparent background: an even scatter of small paisleys, tiny flowers, leaves and dots linked by delicate vines, thin even lines, no filled areas, generous space between motifs. The left/right and top/bottom edges must tile without a visible seam. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikişsiz; yalnız ince çizgi; motifler seyrek; alfa.

#### 4. W2.10 Astardan yükselen kart (boş, kemerli foto penceresi)

- İndirme adı: `33-marigold-mehndi__card_small.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1022×1400 px (0.730:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: paper.png (repoda: collections/33_Marigold_Mehndi/assets/gpt/parts/paper.png)

```
A flat vertical invitation card of the same saffron-ivory paper as paper.png, exactly 0.73:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine gold-foil border of tiny paisleys inset from the edge and a small marigold sprig in each of the two lower corners, a very soft contact shade on the card itself. In its upper part a portrait window shaped as a cusped (scalloped) Rajasthani arch with a 4:5 bounding box — 60% of the card's width wide, horizontally centred, its top at 8% of the card's height — filled with flat pure green #00FF00 (no texture, no shading, crisp edges), with a slim gold carved rim round it. Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: kemer pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 5. W2.11 İpek püskül (kılıftan sarkar, sallanır)

- İndirme adı: `33-marigold-mehndi__tassel.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/tassel.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 300×1000 px (3:10) · şeffaf zemin (gerçek alfa) · PNG

```
A single silk tassel hanging straight down, photorealistic, seen from the front on a fully transparent background, filling the image height: a short twisted gold cord loop at the very top centre (where it hangs from), a small gold-thread wrapped head with a few tiny beads, and a full skirt of fine fuchsia silk threads (#B3165E) with saffron and gold threads mixed in, the ends slightly uneven. Soft warm light from the top-left. No hook, no shadow, no background. No text. True transparent background PNG (real alpha channel).
```

Kontrol: tek püskül; asılma noktası üst ortada; dikey; alfa.

#### 6. W2.13 Zarfın düz kapağı (ön yüz)

- İndirme adı: `33-marigold-mehndi__flap.png`
- Hedef: `collections/33_Marigold_Mehndi/assets/gpt/parts/flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1524×800 px (1.905:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: silk.png (repoda: collections/33_Marigold_Mehndi/assets/gpt/parts/silk.png)

```
The closed top flap of the same fuchsia silk envelope, seen straight from the front on a fully transparent background, filling the image edge to edge (1.9:1): a RECTANGULAR flap (not a V, not a point) of the same fuchsia raw silk as silk.png, its lower edge straight with a slim gold piping and a delicate border of tiny gold-embroidered paisleys along it, a soft fold highlight along the top edge where it is hinged. Soft warm light from the top-left. No seal, no button, no sleeve, no shadow outside. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen kapak (V değil); alt kenar düz ve altın biyeli; mühür yok; alfa.

### 34_Red_Lacquer_Double_Happiness

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, logos, monograms, seals with writing or watermarks in any image.** The only character allowed anywhere is the double happiness character 囍, and only in W2.11 `xi_gold.png` (and in W2.20 / PAKET 6 where the prompt asks for it) — never any other Chinese character, no stamp, no calligraphy, no religious symbol (no Buddha, no temple, no deity, no incense, no shrine). Give W2.2 `red_paper.png`, W2.3 `cream_paper.png`, W2.4 `gold_leaf.png` and W2.7 `envelope_flap.png` as the style reference of every later part: the same cinnabar paper, the same warm cream, the same gold leaf, the same crisp paper-cut technique.
```

#### 7. W2.6 Zarfın ön cebi

- İndirme adı: `34-red-lacquer-double-happiness__envelope_pocket.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 990×1500 px (0.660:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_back.png (repoda: collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_back.png), red_paper.png (repoda: collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/red_paper.png)

```
The front pocket of the same tall vertical red envelope as envelope_back.png, seen straight from the front, on a fully transparent background, drawn on the full envelope canvas: the pocket is the same cinnabar red paper as red_paper.png and covers the image from 30% of its height down to the bottom edge, full width; its top edge at 30% is a clean straight cut with a fine gold-leaf edge line; everything above 30% is fully transparent. Very soft folds of real paper at the sides, a hair of shadow under the top edge, soft warm light from the top-left. The pocket is PLAIN: no character, no flower, no button, no cord drawn on it (they are separate layers). No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: cep %30'dan aşağı, üstü tamamen şeffaf; cep düz (düğme, ip, 囍 yok); gerçek alfa.

#### 8. W2.12 Dış kâğıt kesim pencere (kırmızı; ortadan ikiye kesilir)

- İndirme adı: `34-red-lacquer-double-happiness__veil_outer.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_outer.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (repoda: collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/red_paper.png)

```
A single sheet of red Chinese paper-cut (jianzhi) in the same cinnabar red paper as red_paper.png, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): an intricate window grille pattern with a large blooming tree peony in the centre, peony leaves and buds, auspicious cloud scrolls and a fine lattice border all round, the cut-away parts fully transparent (real openings, about 45% of the area open), crisp clean cut edges with a hair of shadow. The design is perfectly mirror-symmetric left to right (it will be cut down the vertical centre line into two shutter halves), with no important detail exactly on the centre line. No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tuvali dolduran tek kâğıt kesim; ortadan simetrik; açık yerler gerçekten şeffaf; yazı yok.

#### 9. W2.13 İç kâğıt kesim pencere (altın; ortadan ikiye kesilir)

- İndirme adı: `34-red-lacquer-double-happiness__veil_inner.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_inner.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 968×1400 px (0.691:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: veil_outer.png (listede #8)

```
A single sheet of fine gold paper-cut (gold-leaf paper) of the same size, seen flat and straight on, on a fully transparent background, filling the image edge to edge (0.69:1): a lighter, finer pattern than veil_outer.png — a delicate lattice of plum blossoms and small cloud scrolls with two smaller peonies, about 60% of the area cut away (fully transparent openings), crisp edges, a soft gold satin shine from the top-left. Perfectly mirror-symmetric left to right (it is cut down the vertical centre line into two halves). No character, no text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: altın, dış kattan daha ince ve açık; simetrik; açık yerler şeffaf; yazı yok.

#### 10. W2.17 Kâğıt kesim bordür (başlık altı)

- İndirme adı: `34-red-lacquer-double-happiness__peony_band.png`
- Hedef: `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/peony_band.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×300 px (16:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: red_paper.png (repoda: collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/red_paper.png)

```
A long horizontal border strip of red Chinese paper-cut in the same cinnabar paper as red_paper.png, on a fully transparent background: a small blooming peony in the centre with leaves and buds running out symmetrically to both sides and ending in little cloud scrolls, crisp cut edges with a hair of shadow, the cut-away parts fully transparent, a few tiny gold-leaf accents. Centered, not cropped, generous empty margin. Mirror-symmetric left to right. No text, letters, numbers or characters. True transparent background PNG (real alpha channel).
```

Kontrol: yatay şerit; ortada şakayık; simetrik; açık yerler şeffaf; yazı yok.

### 35_Highland_Tartan_Thistle

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, monograms, clan crests, coats of arms, flags, religious symbols, logos or watermarks in any image.** The tartan is an original heather-and-moss sett invented for this design — it must not copy any registered clan or brand tartan. Give W2.1 `tartan_wool.png`, W2.2 `cream_paper.png` and W2.6 `envelope_back.png` as the style reference of every later part: the same wool, the same cream paper, the same warm saddle leather and antique brass, the same soft daylight.
```

#### 11. W2.7 Zarfın ön cebi

- İndirme adı: `35-highland-tartan-thistle__envelope_front.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_front.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: envelope_back.png (repoda: collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_back.png), tartan_wool.png (repoda: collections/35_Highland_Tartan_Thistle/assets/gpt/parts/tartan_wool.png)

```
Only the front pocket of the same tartan wool envelope as envelope_back.png, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from 34% of the image height down to the bottom edge, its straight top edge finished with a narrow folded hem and a fine line of cream stitching, soft daylight from the top-left. The upper 34% of the canvas is completely transparent. No flap, no strap, no buckle, no card, no shadow outside the pocket. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: cep tuvalin %34'ünden alta, tam genişlikte; üstü tamamen şeffaf; kayış/toka yok; gerçek alfa.

#### 12. W2.8 Zarfın düz kapağı (V değil)

- İndirme adı: `35-highland-tartan-thistle__flap.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/flap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1080×1200 px (9:10) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: tartan_wool.png (repoda: collections/35_Highland_Tartan_Thistle/assets/gpt/parts/tartan_wool.png)

```
Only the closed flap of the same tartan wool envelope, on the same 1080×1200 canvas and in the same place, on a fully transparent background: a flat rectangle of the tartan wool of tartan_wool.png spanning the full width of the image from the top edge down to 56% of the image height, folded down over the pocket, with a soft rounded fold along its top edge and a STRAIGHT bottom edge (not a V, not a point, not scalloped) finished with a narrow hem and a fine line of cream stitching; a very soft shade along its bottom edge. The lower 44% of the canvas is completely transparent. No strap, no buckle, no seal, no button, no card. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: kapak üstten %56'ya, tam genişlik; alt kenar **düz**; mühür/düğme/kayış yok; altı tamamen şeffaf; gerçek alfa.

#### 13. W2.9 Deri kayış

- İndirme adı: `35-highland-tartan-thistle__strap.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/strap.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 240×1300 px (0.185:1) · şeffaf zemin (gerçek alfa) · PNG

```
A single straight vertical leather strap, seen straight from the front, on a fully transparent background, filling the image edge to edge (about 0.18:1): warm saddle-brown vegetable-tanned leather (#6B4428) with a fine stitched line of cream thread along both long edges, softly burnished edges, a natural grain, a rounded tip at the bottom end, the top end cut straight. Soft daylight from the top-left. No buckle, no holes, no rivets, no shadow outside the strap. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek dikey kayış; iki kenarda krem dikiş; alt ucu yuvarlak; toka yok; gerçek alfa.

#### 14. W2.12 Funda ayırıcı (başlık altı)

- İndirme adı: `35-highland-tartan-thistle__heather_divider.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_divider.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×260 px (6.154:1) · şeffaf zemin (gerçek alfa) · PNG

```
A slim horizontal divider made of two small sprigs of heather and a small thistle head, photorealistic with a soft painterly finish, on a fully transparent background: the thistle head with its purple tuft in the centre, a heather sprig reaching out to the left and one to the right, lying horizontally, delicate and airy, centred with a generous empty margin at both ends. Soft daylight from the top-left. No ribbon, no line, no shadow. No text. True transparent background PNG (real alpha channel).
```

Kontrol: yatay, ortada devedikeni, iki yanda funda; kenarlarda boşluk; çizgi/kurdele yok; gerçek alfa.

#### 15. W2.17 Zarftaki kart (boş, oval foto penceresi)

- İndirme adı: `35-highland-tartan-thistle__card_small.png`
- Hedef: `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1166 px (0.858:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: cream_paper.png (repoda: collections/35_Highland_Tartan_Thistle/assets/gpt/parts/cream_paper.png)

```
A flat vertical invitation card of the same cream paper as cream_paper.png, exactly 0.858:1, filling the image edge to edge (the card IS the image), seen straight on, with a softly torn deckle edge, a fine engraved brass-coloured border line inset from the edge and a tiny sprig of heather in each top corner, a very soft contact shade on the card itself. In its upper part an oval portrait window filled with flat pure green #00FF00 (no texture, no shading): 46% of the card's width across, horizontally centred, its top at 8% and its bottom at 57% of the card's height. Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: oval pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

### 36_Victorian_Glasshouse

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, Latin plant names, labels with writing, logos, monograms or watermarks in any image** (a blank label, a blank seed packet and engraved botanical line art without lettering are fine). Give W3.1 `fern_ground.png`, W3.3 `herbarium_paper.png` and W3.4 `packet_body.png` as the style reference of every later part: the same deep fern green, the same herbarium paper, the same kraft, copper and jute, the same soft daylight through glass.
```

#### 16. W3.6 Bakır bitki etiketi (boş; monogram/numara site yazar)

- İndirme adı: `36-victorian-glasshouse__copper_tag.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/copper_tag.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 600×800 px (3:4) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A small antique copper plant label as used in a Victorian glasshouse, seen straight on, alone on a fully transparent background, filling the image edge to edge (3:4): a rectangular copper plate with softly rounded corners and a slim raised rim, warm copper (#B26A3C) with a gentle patina and a little verdigris (#6F9E8E) at the edges, a small round punched hole near the top-left corner filled with flat pure green #00FF00 (no texture, no shading), the centre of the plate smooth and EMPTY (the website stamps letters there). Soft daylight from the top-left. No string, no text, letters, numbers or engraving in the centre. True transparent background PNG (real alpha channel).
```

Kontrol: boş merkez; delik sol üstte, düz `#00FF00`; ip yok; alfa.

#### 17. W3.7 Jüt sicim (dikey, üst–alt dikişsiz)

- İndirme adı: `36-victorian-glasshouse__twine.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/twine.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 160×1200 px (2:15) · şeffaf zemin (gerçek alfa) · PNG

```
A single straight vertical length of natural jute garden twine, two twisted strands, seen straight on, alone on a fully transparent background, running from the very top edge to the very bottom edge of the image, centred, about 40% of the image width thick; warm natural fibre colour with tiny stray fibres. The top and bottom ends must tile vertically without a visible seam (no knot, no cut end). Soft daylight from the top-left. No text. True transparent background PNG (real alpha channel).
```

Kontrol: düz dikey ip; üst–alt dikişsiz; düğüm/uç yok; alfa.

#### 18. W3.10 Eğrelti otları ve orkide (açılış ve home çerçevesi)

- İndirme adı: `36-victorian-glasshouse__ferns.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/ferns.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1800×1200 px (3:2) · şeffaf zemin (gerçek alfa) · PNG

```
Lush botanical fern fronds rising from the bottom-left and bottom-right corners of the image on a fully transparent background, as a frame for something in the middle: maidenhair and sword ferns in deep and fresh greens, a few curled fiddleheads, and on the right one arching spray of white-and-blush moth orchids; photorealistic leaves with the fine detail of a botanical engraving, soft daylight from the top-left. The centre of the image (from 25% to 75% of the width and the whole upper 60%) is EMPTY transparency. No pots, no glass, no insects, no text. True transparent background PNG (real alpha channel).
```

Kontrol: bitkiler alt köşelerde, orta ve üst %60 boş; saksı/yazı yok; alfa.

#### 19. W3.11 Orkide dalı (başlık altı ayırıcı)

- İndirme adı: `36-victorian-glasshouse__orchid_sprig.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/orchid_sprig.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1400×300 px (14:3) · şeffaf zemin (gerçek alfa) · PNG

```
A single slender horizontal sprig in fine botanical engraving style with soft natural colour, on a fully transparent background: a thin arching orchid stem with three small white-and-blush blossoms in the middle and two tiny fern leaflets at the ends, centred, symmetrical in weight, generous empty margin all round. No line, no frame, no text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: ince, yatay, ortalı; çizgi/yazı yok; alfa.

#### 20. W3.12 Numune camı (4:5 foto vitrini)

- İndirme adı: `36-victorian-glasshouse__specimen_frame.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/specimen_frame.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1250 px (4:5) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A Victorian botanical specimen case seen straight on, alone on a fully transparent background, filling the image edge to edge (4:5): a slim frame of dark-stained wood with fine copper corner pieces and a narrow cream herbarium-paper mount inside it, a tiny copper ring at the top-right corner. The window inside the mount is a perfect rectangle from 9% to 91% of the width and from 8% to 92% of the height, filled with flat pure green #00FF00 (no texture, no shading, no glass reflection in it). Soft daylight from the top-left. No plant, no label, no text, letters or numbers. True transparent background PNG (real alpha channel).
```

Kontrol: dikdörtgen pencere düz `#00FF00`, tarif edilen konumda; yazı/bitki yok; alfa.

#### 21. W3.13 Herbaryum etiketi (boş; yazıyı site koyar)

- İndirme adı: `36-victorian-glasshouse__herbarium_label.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_label.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×360 px (10:3) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: herbarium_paper.png (repoda: collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_paper.png)

```
A blank antique herbarium specimen label seen straight on, alone on a fully transparent background, filling the image edge to edge (10:3): a slip of cream paper slightly warmer than herbarium_paper.png with a finely printed sepia double border and tiny engraved fern sprigs in its two left corners, the inside EMPTY (the website writes the caption there), a very soft shade on the paper itself. No text, letters, numbers or Latin names. True transparent background PNG (real alpha channel).
```

Kontrol: boş iç alan; köşelerde küçük eğrelti; yazı yok; alfa.

#### 22. W3.15 Paketten çıkan kart (boş, 4:5 foto penceresi)

- İndirme adı: `36-victorian-glasshouse__card_small.png`
- Hedef: `collections/36_Victorian_Glasshouse/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 976×1400 px (0.697:1) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: herbarium_paper.png (repoda: collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_paper.png)

```
A flat vertical invitation card of the same cream herbarium paper as herbarium_paper.png, exactly 0.70:1, filling the image edge to edge (the card IS the image), seen straight on, with a finely printed sepia border line inset from the edge and a tiny engraved fern sprig in each lower corner, a very soft contact shade on the card itself. In its upper part a portrait window, a rectangle 58% of the card's width wide and 4:5 tall, horizontally centred, its top edge at 7% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

### 37_Art_Nouveau_Lily

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, monograms, logos, signatures or watermarks in any image.** Give W2.1 `cream_paper.png`, W2.4 `env_back.png` and W2.6 `petal_centre.png` as the style reference of every later part: the same cream paper, the same soft gold, the same sage and lilac, the same Art Nouveau line (Mucha-style poster + stained glass). No peacock feathers anywhere (that is another design).
```

#### 23. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_right.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_right.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_back.png), env_pocket.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_pocket.png), cream_paper.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/cream_paper.png)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_right (number 2 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

#### 24. W2.6 Üç taç yaprağı kapak (sol, sağ, orta) — üç ayrı dosya, aynı tuval

- İndirme adı: `37-art-nouveau-lily__petal_centre.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_centre.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1320 px (0.758:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: env_back.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_back.png), env_pocket.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_pocket.png), cream_paper.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/cream_paper.png)

```
This prompt describes a set of 3 separate images (petal_left, petal_right, petal_centre). Make ONLY ONE image now: petal_centre (number 3 of 3).

The three closed petal-shaped flaps of the same envelope as env_back.png, each as its own image on the same 1000×1320 canvas and in its closed position, on a fully transparent background, so that the three images stacked on env_back.png and env_pocket.png show the closed envelope: (1) petal_left: a long lily-petal-shaped flap hinged along the whole left edge of the envelope, curving inward to a soft point at (50% across, 57% down); (2) petal_right: its mirror image hinged along the right edge, its point at the same spot; (3) petal_centre: a wider lily-petal flap hinged along the whole top edge, curving down to a soft point just below the other two, at (50%, 61%). All three in cream cotton paper (as cream_paper.png) with a fine flowing Art Nouveau gold-leaf whiplash border along their free edges, the centre petal with a delicate gold outline of a lily's veins; together they read as one elegant flower-like envelope front. Each image shows ONLY its own flap: everything else is fully transparent. Soft daylight from the top-left, a very soft contact shade on the paper along each free edge (on the flap itself, not outside it). No seal (the medallion is a separate image), no text, letters, numbers or symbols. True transparent background PNG (real alpha channel) for each file.
```

Kontrol: üç dosya aynı tuval; üst üste konunca kapalı zarf (uçlar ~%50, %57–61'de buluşur); menteşe kenarları zarfın

#### 25. W2.8 Cepten yükselen kart (boş, kemerli foto penceresi)

- İndirme adı: `37-art-nouveau-lily__card_small.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/card_small.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1008×1400 px (18:25) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG
- Ek görsel: cream_paper.png (repoda: collections/37_Art_Nouveau_Lily/assets/gpt/parts/cream_paper.png)

```
A flat vertical invitation card of the same cream paper as cream_paper.png, exactly 0.72:1, filling the image edge to edge (the card IS the image), seen straight on, with a fine flowing gold-leaf Art Nouveau border inset from the edge (whiplash curves meeting in small lily buds at the top corners), a very soft contact shade on the card itself. In its upper part an arched portrait window (a rounded arch on top, straight sides, flat bottom), 5:7 tall, 50% of the card's width across, horizontally centred, its top at 9% of the card's height, filled with flat pure green #00FF00 (no texture, no shading). Below the window the paper is EMPTY (the website sets the names and the date there). No text, letters, numbers or monograms. True transparent background PNG (real alpha channel) around the card's edge.
```

Kontrol: kemer pencere düz `#00FF00`, ölçü/konum tarif gibi; altı boş kâğıt; yazı yok.

#### 26. W2.9 Vitray kemer çerçeve (bütün portre fotoğrafları)

- İndirme adı: `37-art-nouveau-lily__arch_window.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/arch_window.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1300 px (10:13) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A tall arched stained-glass window frame, seen straight on, on a fully transparent background, filling the image edge to edge: a band of leaded stained glass about 15% of the width wide running round a rounded arch with straight sides and a flat bottom — white lilies, sage-green leaves and curling stems in soft jewel-toned glass (cream, sage, lilac, pale gold) with thin dark lead lines, held in a slim gold Art Nouveau whiplash moulding on its outer edge. The opening in the middle is an arch (rounded top, straight sides, flat bottom) exactly 70% of the image width across and 5:7 tall (700 × 980 px), its left edge at 150 px and its top at 170 px, filled with flat pure green #00FF00 (no texture, no shading). Soft daylight from the top-left, the glass gently glowing. No text, letters, numbers or symbols, no saints, no religious symbol. True transparent background PNG (real alpha channel).
```

Kontrol: kemer pencere düz `#00FF00`, 5:7, ölçü/konum tarif gibi; vitray bant; yazı/dini simge yok; alfa.

#### 27. W2.12 Altın kıvrım çizgisi (başlık altı ayırıcı)

- İndirme adı: `37-art-nouveau-lily__whiplash.png`
- Hedef: `collections/37_Art_Nouveau_Lily/assets/gpt/parts/whiplash.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×300 px (16:3) · şeffaf zemin (gerçek alfa) · PNG

```
A single horizontal Art Nouveau divider in fine gold leaf (#B8964E with lighter highlights), on a fully transparent background: one long flowing "whiplash" line that curls from the left, swells gracefully to a small lily bud in the centre and curls out to the right, with a few thin secondary tendrils, symmetrical, centred, with a generous empty margin. Line only, no filled shapes other than the small bud. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel).
```

Kontrol: tek yatay çizgi, ortada küçük tomurcuk; altın; alfa.

### 38_Papel_Picado_Fiesta

Sohbetin ilk mesajı (dosyanın GPT notu):

```
Generate PAKET 5 (website layers) first, in order and in ONE chat, then PAKET 2 (sample photos), then PAKET 6 (printable invitation). Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and folder shown under "Kaydet". **No text, letters, numbers, words cut into the paper, names, dates, logos, monograms or watermarks in any image.** **No religious symbols** (no crosses, saints, hearts with flames or thorns, churches, altars) and **no Day of the Dead imagery** (no skulls, skeletons, calaveras, marigold altars): this is a joyful wedding fiesta. Give W1 `kraft_paper.png`, W3 `cream_paper.png` and W8 `flag_1.png` as the style reference of every later part: the same kraft, the same cream paper, the same crisp hand-cut tissue paper in the same six colours, the same warm afternoon sun from the top-left.
```

#### 28. W5 Zarfın cebi (arkadan, kapaksız)

- İndirme adı: `38-papel-picado-fiesta__envelope_pocket.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_pocket.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1110×1500 px (0.740:1) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: kraft_paper.png (repoda: collections/38_Papel_Picado_Fiesta/assets/gpt/parts/kraft_paper.png)

```
The back of a portrait kraft paper envelope seen perfectly straight on, on a fully transparent background, the envelope filling the image edge to edge (the image IS the envelope, 0.74:1): the same kraft paper as kraft_paper.png, the two side flaps and the bottom flap folded in and glued, their soft fold lines and slightly lifted paper edges visible, the top edge straight and open (this is where the card comes out — no flap is drawn, no V shape at the top). Warm sun from the top-left, a soft natural shade along the folds. No seal, no sticker, no stamp, no string, no card inside, no cast shadow outside the envelope. No text, letters, numbers or symbols. True transparent background PNG (real alpha channel — not white, not a checkerboard).
```

Kontrol: zarf tuvali dolduruyor (0,74:1); üstte düz açık kenar, V kapak **yok**; mühür/ip yok; gerçek alfa.

#### 29. W10 Kâğıt kesim foto çerçeveleri — üç ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__frame_1.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_1.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1200 px (5:6) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
This prompt describes a set of 3 separate images (frame_1, frame_2, frame_3). Make ONLY ONE image now: frame_1 (number 1 of 3).

A papel picado photo frame, alone, seen straight on, on a fully transparent background, filling the image edge to edge: one sheet of crisp hand-cut tissue paper with an intricate symmetrical cut-paper border of flowers, leaves, vines, tiny birds and scallops (the cut-outs truly transparent), its top edge folded over a short piece of natural twine with a small hanging loop at the centre, as if the frame hangs from a cord. In the middle a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 190 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window is at least 40 px wide on every side. Warm sun from the top-left, a slight translucency. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Three frames, same size and window, different patterns: 1 = fuchsia #D63A7A, 2 = turquoise #1C8F9C, 3 = marigold #F2A31B.)
```

Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 190); kesik yerler şeffaf; üstte ip ilmeği; alfa.

#### 30. W10 Kâğıt kesim foto çerçeveleri — üç ayrı dosya

- İndirme adı: `38-papel-picado-fiesta__frame_2.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_2.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1000×1200 px (5:6) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
This prompt describes a set of 3 separate images (frame_1, frame_2, frame_3). Make ONLY ONE image now: frame_2 (number 2 of 3).

A papel picado photo frame, alone, seen straight on, on a fully transparent background, filling the image edge to edge: one sheet of crisp hand-cut tissue paper with an intricate symmetrical cut-paper border of flowers, leaves, vines, tiny birds and scallops (the cut-outs truly transparent), its top edge folded over a short piece of natural twine with a small hanging loop at the centre, as if the frame hangs from a cord. In the middle a rectangular photo window exactly 700 px wide and 875 px tall (4:5), its top-left corner at x 150 px, y 190 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges, nothing over it). The paper around the window is at least 40 px wide on every side. Warm sun from the top-left, a slight translucency. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel). (Three frames, same size and window, different patterns: 1 = fuchsia #D63A7A, 2 = turquoise #1C8F9C, 3 = marigold #F2A31B.)
```

Kontrol: pencere düz `#00FF00`, 700×875 (4:5), sol üst (150, 190); kesik yerler şeffaf; üstte ip ilmeği; alfa.

#### 31. W11 Geniş kâğıt kesim çerçeve (mekân fotoğrafı)

- İndirme adı: `38-papel-picado-fiesta__frame_wide.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_wide.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1600×1000 px (8:5) · şeffaf zemin (gerçek alfa) · düz #00FF00 pencere · PNG

```
A wide papel picado photo frame in coral tissue paper (#E85637), alone, seen straight on, on a fully transparent background, filling the image edge to edge: an intricate symmetrical cut-paper border of flowers, leaves, vines and scallops (the cut-outs truly transparent), the top edge folded over natural twine with two small hanging loops. In the middle a landscape photo window exactly 1360 px wide and 765 px tall (16:9), its top-left corner at x 120 px, y 150 px, filled with flat pure green #00FF00 (no texture, no shading, straight edges). Warm sun from the top-left. No text, letters, numbers, skulls, crosses or other religious symbols. True transparent background PNG (real alpha channel).
```

Kontrol: pencere düz `#00FF00`, 1360×765 (16:9), sol üst (120, 150); kesik yerler şeffaf; alfa.

#### 32. W12 Bugenvil salkımı (köşe süsü)

- İndirme adı: `38-papel-picado-fiesta__bougainvillea.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bougainvillea.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 1200×1000 px (6:5) · şeffaf zemin (gerçek alfa) · PNG

```
A lush cluster of magenta-fuchsia bougainvillea spilling diagonally from the top-left corner toward the centre, alone, on a fully transparent background: woody stems, fresh green leaves, many papery bracts in vivid fuchsia with tiny cream flowers at their hearts, a few single bracts drifting loose near the tips, photorealistic in warm top-left sun. The cluster touches the top and left edges and leaves the bottom-right third empty. No pot, no wall, no shadow, no other flower. No text. True transparent background PNG (real alpha channel).
```

Kontrol: salkım sol üst köşeden taşar; sağ alt üçte bir boş; saksı/duvar yok; alfa.

#### 33. W13 İşlemeli kumaş bandı (bölüm ayırıcı)

- İndirme adı: `38-papel-picado-fiesta__embroidery_band.png`
- Hedef: `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/embroidery_band.png`
- Bölüm: PAKET 5 — Website katmanları (YAZI YOK) (website parçası (PAKET 5))
- Şart: 2400×160 px (15:1) · opak · PNG

```
A long horizontal strip of cream cotton fabric (#FBF4E8) hand-embroidered along its whole length with a continuous row of small bright folk flowers and leaves in fuchsia, marigold, turquoise, lime, violet and coral satin stitch, between two slim stitched lines, seen perfectly flat and straight on, filling the image edge to edge. The left and right edges must tile seamlessly when repeated side by side. Even warm light. A joyful generic folk-floral embroidery, not a copy of any specific community's traditional design. No text, letters, numbers or symbols.
```

Kontrol: yatayda dikişsiz; tek sıra çiçek; krem zemin; yazı yok.


## C · Palet varyantı görselleri

### 21_Crimson_Rose_Atelier

#### 34. İstem — fildişi güller (yalnız istenirse) — isteğe bağlı

- İndirme adı: `21-crimson-rose-atelier__v07-ivory-rose__rose-branch.png`
- Hedef: `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png`
- Bölüm: İstem — fildişi güller (yalnız istenirse) (palet varyantı)
- Şart: 1374×1145 px (6:5) · şeffaf zemin (gerçek alfa) · PNG
- Ek görsel: rose-branch.png (repoda: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png)

```
Photorealistic botanical illustration of a branch of three fully open IVORY / soft cream garden roses with dark green rose leaves and a few small buds, painted in exactly the same style, lighting, angle and composition as the reference image (a diagonal branch of three red roses running from lower left to upper right). Keep the same size and position of every rose and leaf; only the petal colour changes to natural ivory-white with warm cream shadows (no pink, no yellow cast). Transparent background (PNG, alpha), no shadow on the ground, no text, no frame. Canvas 1374 × 1145 px.
Reference: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png
```
