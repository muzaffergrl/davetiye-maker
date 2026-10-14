---
id: G084
baslik: 02, 04, 05 temalarına RSVP misafir adları satırı (G069 `data-rsvp-party` şablonu + `form_party` copy anahtarı)
rol: claude-kod
durum: alindi
alan: claude-G084
oncelik: 2
bagimli: [G069, G081]
yazar: [platform/themes/dusty-blue-champagne/, platform/themes/vintage-airmail-love-letter/, platform/themes/mediterranean-lemon/, platform/tests/, platform/previews/g084/]
---

## Amaç
G069 RSVP v2 ile misafir 2+ kişi seçince "Name of guest 2/3…" alanları açılıyor (`<template data-rsvp-party>`), panel kişi başına satır
gösteriyor. 01 ve 03'te var; 02, 04, 05'te yok (G081 Sonuç'u) → bu temalarda ek misafir adları toplanmıyor.

## Yapılacaklar
1. Her temanın `rsvp.html` formuna 01/03'teki gibi `<template data-rsvp-party>` satırı, temanın kendi form stilinde (yeni görsel yok).
2. `form_party` vb. copy anahtarları + manifest (`node scripts/copy-manifest.ts --theme <id>`), `--stress` ile `max`.
3. İlk ekran/nav kuralı ve RSVP katlama ölçümleri bozulmaz (tema testleri). g069-browser'ı üç temaya genişlet (3 kişilik yanıt isimlerle).
4. 04 için G404 onayından sonra. Önizleme `platform/previews/g084/` (390). Sonuç, Günlük, bitir.

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): G081 Sonuç önerisi
- 2026-10-14 alindi: claude-G084 (G081'in 02/05 turu onaylı; bu tur yalnız 02 ve 05, 04 G404/G081 04 turundan sonra)
