---
id: G058
baslik: 03 blush-garden-rose — yatay telefon düzeni ve isim aralığı kaydıyla ilk ekran (01'deki kurala eşit)
rol: claude-kod
durum: alindi
alan: claude-kod-13
oncelik: 2
bagimli: [G401]
yazar: [platform/themes/blush-garden-rose/, platform/tests/theme-blush-garden-rose.test.ts]
---

## Amaç
01'in QA'sında çıkan kurallar 03'te de geçerli: yatay telefonda (844×390, 667×375) hero nav'ın altına giriyor (G401 fix2 ölçümü);
ilk ekranda hiçbir öğe nav'ın altında yarım kalmamalı; isimler ≥ 36 px tabanı.

## Yapılacaklar
1. 03 için yatay kısa ekran düzeni (01'deki `@media (min-aspect-ratio: 1/1) and (max-height: 620px)` yaklaşımı), zarf sayfası dahil.
2. `theme-check --theme blush-garden-rose --stress` yatay + aralık kaydı akışlarıyla hatasız.

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-14 alindi: claude-kod-13
