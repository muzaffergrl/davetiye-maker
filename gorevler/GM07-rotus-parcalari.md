---
id: GM07
baslik: Tasarım 15–20 rötuş parçaları — tema ajanlarının önerdiği 6 GPT parçası (yuvarlak çerçeveler, fiyonk, geri sayım kutusu, hap dalı, yatay çerçeve)
rol: gpt-gorsel
durum: hazir
alan: gpt-gorsel-R
oncelik: 3
bagimli: []
yazar: [collections/15_Cherry_Blossom/assets/gpt/parts/, collections/16_Sunflower_Rustic/assets/gpt/parts/, collections/17_Emerald_Gold_Estate/assets/gpt/parts/, collections/19_Midnight_Garden/assets/gpt/parts/, collections/20_Coastal_Seaside/assets/gpt/parts/]
---

## Amaç
15–20 temaları çalışıyor; bu parçalar comp'a (W1) daha yakın olmak için **isteğe bağlı rötuş**. Kaynak: G415–G420 Sonuç
"önerilen gpt-gorsel görevi" satırları. Mevcut dosyalar **değişmez**: yeni parçalar `_r2` adıyla yanına kaydedilir, Claude temaya takar.

## Genel kurallar (her parça)
- Her parça için önce o tasarımın W1 comp'unu (`collections/<NN>_*/assets/gpt/comps/web_*.png`) ve aynı adlı mevcut parçayı **referans görsel**
  olarak ver: aynı teknik, aynı palet, aynı ışık (sol üst), aynı malzeme.
- Tek görselde tek nesne; yazı/harf/rakam/monogram yok; gölge/hâle yok; gerçek alfa (şeffaf PNG); fotoğraf penceresi düz `#00FF00`.
- Ortalı, kesilmemiş, kenarda boşluk. Kaydet satırındaki tam yol ve ad; denemeler `_r2_v2`, `_r2_v3`; seçilen sade `_r2` adıyla kalır.
- Bitince main'e `GM07: rötuş parçaları` mesajıyla commit; aşağıdaki Sonuç'a hangi parça kaç denemede seçildi, emin olunmayanlar.

## Parçalar

### R1 — 15 Cherry Blossom: tam yuvarlak portre çerçevesi
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/frame_portrait_r2.png` · 1254×1254 (kare), RGBA
```
A perfectly ROUND (circular, 1:1) thin antique-gold ring photo frame entwined with blossoming cherry twigs and pink buds, realistic watercolor, centred on a transparent canvas. Inside the ring: one flat pure green #00FF00 circular window (no texture, no gradient). The ring has even thickness all around; twigs stay outside the window. Soft light from the top-left, no cast shadow, no glow outside the frame. Same style, palette and paper as the reference images. No text.
```
Kontrol: pencere tam daire (en = boy ±1 %), düz yeşil; dallar pencereye girmiyor; şeffaf zemin.

### R2 — 20 Coastal Seaside: tam yuvarlak lombar (porthole) çerçeve
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/frame_portrait_r2.png` · 1254×1254 (kare), RGBA
```
A ship's porthole photo frame: a brass ring of even thickness with rivets, slightly weathered, realistic watercolor, centred on a transparent canvas. The window is a PERFECT CIRCLE (equal width and height) filled with flat pure green #00FF00 (no texture, no gradient, no glass reflection). Draw the porthole centred; do not stretch it. Soft light from the top-left, no cast shadow, no glow outside the frame. Same style and brass colour as the reference images. No text.
```
Kontrol: pencere tam daire, düz yeşil; perçinler düzenli; şeffaf zemin.

### R3 — 16 Sunflower Rustic: kapanış (fiyonk + buğday spreyi)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/closure_r2.png` · 1024×1536, RGBA — **mevcut `envelope_closed.png` ile aynı tuval**: kurdele zarfın üstüne piksel piksel oturmalı.
```
Only the closure of the kraft envelope from the reference image envelope_closed.png, on a transparent canvas of exactly the same size, at exactly the same position: a wide mustard-yellow gingham fabric ribbon wrapped horizontally around the envelope, finished in a big soft bow at the center with a small sunflower head tucked into the knot and a little spray of wheat ears, baby's breath and two green leaves fanning out behind the bow. Do not draw the envelope itself. Realistic watercolor, soft light from the top-left, no cast shadow. No text.
```
Kontrol: zarf çizilmemiş; kurdele uçları zarfın sol/sağ kenarına denk (mevcut closure.png ile üst üste koyup bak); buğday spreyi fiyonkun arkasında.

### R4 — 17 Emerald & Gold: geri sayım kutusu
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/countdown_box_r2.png` · 1024×1024, RGBA
```
One small empty rectangular box frame for a countdown number, about 4:5 (width:height), thin engraved antique-gold double border with tiny corner ornaments, the inside completely transparent (no fill, no glass), as in the countdown boxes of the reference home screen. Centred on a transparent canvas, soft light from the top-left, no cast shadow, no glow. No numbers, no text.
```
Kontrol: içi tamamen şeffaf; yalnız çerçeve; oran ~4:5.

### R5 — 17 Emerald & Gold: RSVP hapı yan dalı
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/pill_sprig_r2.png` · 1024×1024, RGBA
```
One small horizontal sprig of engraved antique-gold leaves (like the tiny branches beside the RSVP button in the reference home screen), pointing to the right, centred on a transparent canvas, realistic metallic gold, soft light from the top-left, no cast shadow, no glow. No text.
```
Kontrol: tek dal, sağa bakıyor (sol taraf için Claude yansıtır); şeffaf zemin.

### R6 — 19 Midnight Garden: geniş yatay çerçeve
**Kaydet:** `collections/19_Midnight_Garden/assets/gpt/parts/frame_landscape_r2.png` · 1536×1024, RGBA
```
The same ornate baroque gilded frame as the reference frame_landscape.png, but with a wider window: the inside window is a flat pure green #00FF00 rectangle with an aspect ratio of about 2.2:1 (width:height), as in the reference details screen (W1.4). Centred on a transparent canvas, soft warm candle-like light from the top-left, no cast shadow, no glow outside the frame. No text.
```
Kontrol: pencere oranı 2,1–2,3; düz yeşil; çerçeve süsleri pencereye girmiyor.

## Sonuç
(GPT doldurur)

## Günlük
- 2026-10-15 açıldı (entegratör; G415–G420 önerileri)
