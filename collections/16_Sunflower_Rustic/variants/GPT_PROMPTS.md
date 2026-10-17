# 16_Sunflower_Rustic — palet varyantları GPT istemleri (G158)

**Neden GPT:** kareli kurdele (hardal/turuncu) ile ayçiçeği taç yaprakları **aynı ton bandında** (OKLCH ton 62–97°, kroma ve
açıklık da örtüşüyor); renk dönüşümü kurdeleyi lacivert/bordo/mavi yaparken ayçiçeğini de boyar. Bu yüzden **lacivert, bordo,
dusty blue** paletlerinde kurdele ile ayçiçeğinin **aynı görselde** olduğu parçalar GPT'den gelir (`palette.json` → `recolor`).
Yalnız kurdele olan parçalar (zarf astarı `env_body`/`env_flap`, küçük kart çerçevesi `card_small`) algoritmayla boyandı ve iyi
duruyor; ayçiçeği/buğday parçaları bu üç palette asıl hâliyle kalır (`keep`). **Limon & Sage** ve **Autumn Rust & Bronze**
paletlerinde kurdele ve ayçiçeği birlikte doğal ayçiçeği renklerine (limon sarısı, bronz-pas) boyandı → GPT gerekmez.

GPT gelene dek bu üç palette ilgili parçalar **asıl** (hardal kareli) görünür; paletler zaten `coming` (satışta yok).

## Ortak kurallar (her istem)

- Referans: belirtilen **asıl kaynak dosya** (`collections/16_Sunflower_Rustic/assets/gpt/parts/<dosya>`) — GPT'ye yüklenir.
- Aynı tuval boyutu, aynı şeffaflık, aynı kompozisyon ve hiza (parçalar 1:1 üst üste kesiliyor; kurdele bandının yüksekliği ve
  yeri piksel düzeyinde aynı kalmalı). Yalnız **kurdelenin kumaş rengi** değişir; ayçiçekleri, buğday, papatyalar, yapraklar,
  kraft zarf, krem kart, ahşap ve ışık **aynı** kalır. Metin, harf, logo, filigran yok.
- Teslim: tam yol aşağıda. Sonra: `python3 platform/themes/sunflower-rustic-barn/build_images.py` kesimiyle aynı kesim
  (kaynak klasörü varyantın `gpt/` klasörü, çıktı `platform/themes/sunflower-rustic-barn/img/variants/<slug>/`; baskı
  parçaları `platform/public/print/sunflower-rustic-barn/variants/<slug>/{card,back}.webp`), `palette.json` → `recolor`'dan
  ilgili `gpt` satırları silinir (`auto`'ya dönmez: dosya artık varyant klasöründe), `recolor_parts.py build --design 16` ve
  `variant-check`.

## V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`)

### 1. `closure.png` → card_ribbon

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (closure.png). Recolour ONLY the gingham fabric ribbon and bow (long horizontal gingham ribbon band): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 2. `closure_r2_v3.png` → closure, favicon

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure_r2_v3.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (closure_r2_v3.png). Recolour ONLY the gingham fabric ribbon and bow (wrap-around gingham ribbon band): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 3. `invitation_card.png` → invitation_card, print:card

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/invitation_card.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (invitation_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge invitation card): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 4. `info_card.png` → info_card, print:back

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/info_card.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (info_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge details card): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 5. `web_hero.png` → og-1200x630

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/web_hero.png` (1536 × 1024, opaque (RGB))

```text
Edit the attached image (web_hero.png). Recolour ONLY the gingham fabric ribbon and bow (sunlit barn scene: kraft envelope tied): make it a navy blue (#2C3E5C) and white gingham check, the half-tone squares a mid navy (#5A6E8F), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1536 × 1024), same composition and alignment, the ribbon band at exactly the same height and position. Keep the full opaque scene, exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

## V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`)

### 6. `closure.png` → card_ribbon

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/closure.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (closure.png). Recolour ONLY the gingham fabric ribbon and bow (long horizontal gingham ribbon band): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 7. `closure_r2_v3.png` → closure, favicon

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/closure_r2_v3.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (closure_r2_v3.png). Recolour ONLY the gingham fabric ribbon and bow (wrap-around gingham ribbon band): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 8. `invitation_card.png` → invitation_card, print:card

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/invitation_card.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (invitation_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge invitation card): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 9. `info_card.png` → info_card, print:back

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/info_card.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (info_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge details card): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 10. `web_hero.png` → og-1200x630

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/web_hero.png` (1536 × 1024, opaque (RGB))

```text
Edit the attached image (web_hero.png). Recolour ONLY the gingham fabric ribbon and bow (sunlit barn scene: kraft envelope tied): make it a deep burgundy (#6B2132) and cream-white gingham check, the half-tone squares a soft wine (#9A5562), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1536 × 1024), same composition and alignment, the ribbon band at exactly the same height and position. Keep the full opaque scene, exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

## V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`)

### 11. `closure.png` → card_ribbon

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/closure.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (closure.png). Recolour ONLY the gingham fabric ribbon and bow (long horizontal gingham ribbon band): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 12. `closure_r2_v3.png` → closure, favicon

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/closure_r2_v3.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (closure_r2_v3.png). Recolour ONLY the gingham fabric ribbon and bow (wrap-around gingham ribbon band): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 13. `invitation_card.png` → invitation_card, print:card

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/invitation_card.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (invitation_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge invitation card): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 14. `info_card.png` → info_card, print:back

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/info_card.png` (1024 × 1536, transparent background (RGBA))

```text
Edit the attached image (info_card.png). Recolour ONLY the gingham fabric ribbon and bow (cream deckle-edge details card): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1024 × 1536), same composition and alignment, the ribbon band at exactly the same height and position. Keep the background fully transparent (alpha), exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```

### 15. `web_hero.png` → og-1200x630

**Kaydet:** `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/web_hero.png` (1536 × 1024, opaque (RGB))

```text
Edit the attached image (web_hero.png). Recolour ONLY the gingham fabric ribbon and bow (sunlit barn scene: kraft envelope tied): make it a dusty blue (#7E98B2) and white gingham check, the half-tone squares a pale dusty blue (#B4C4D4), with the same weave texture, folds, shading, frayed edges and highlights. Everything else must stay pixel-identical in shape, position and colour: the golden-yellow sunflowers with brown centres, the wheat ears, the small white daisies and baby's breath, the green leaves, the paper / kraft / wood and the lighting. Same canvas size (1536 × 1024), same composition and alignment, the ribbon band at exactly the same height and position. Keep the full opaque scene, exactly as in the reference. Same painted style as the reference. No text, no letters, no watermark, no new objects.
```
