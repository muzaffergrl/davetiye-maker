---
id: G064
baslik: Tema 01 alt menüsü — arkadaki yazı harflerin arasından okunmasın (opak + bulanık zemin)
rol: claude-kod
durum: alindi
alan: wf-g064
oncelik: 1
bagimli: []
yazar: [platform/themes/olive-ivory/site.css, platform/previews/g064/]
---

## Amaç
G059 bulgusu (docs/05 §G): tema 01'in alt menüsü (`.site-nav`) yarı saydam ve bulanıklıksız; sayfa kayarken arkadaki
yazı menü harflerinin arasından okunuyor. 03'teki gibi okunur, sakin bir menü zemini; tasarımın yumuşak geçişi korunur.

## Yapılacaklar
1. `.site-nav` zemini: harflerin arkası opak ya da bulanık olsun (ör. `backdrop-filter` + daha yüksek opaklık); üstteki yumuşak
   geçiş sert bir bulanıklık sınırı çizmesin. Geniş ekranda üstteki menü de aynı denetimden geçsin.
2. 390, 360×640 (kısa), yatay telefon ve 1280 px'te home/story/details/rsvp: menü arkasında metin/foto varken ekran görüntüsü →
   `platform/previews/g064/`. Önce/sonra.
3. `node scripts/theme-check.cjs --theme olive-ivory --stress`, `tests/g051-browser.ts --theme olive-ivory`,
   `tests/final-smoke.ts --theme olive-ivory`, `npm test`, `npm run build` geçmeli.

## Bitti sayılması için
- [ ] Menü harflerinin arasından arkadaki yazı okunmuyor (kanıt: önce/sonra görüntüleri)
- [ ] Bütün tema kontrolleri geçti

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): G059 bulgusu
- 2026-10-14 alindi: wf-g064
