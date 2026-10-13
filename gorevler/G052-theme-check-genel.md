---
id: G052
baslik: Tarayıcı denetimlerini her temaya açmak — theme-check / g051-browser / final-smoke `--theme <id>` (G4NN'den önce)
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G046, G051]
yazar: [platform/scripts/theme-check.cjs, platform/tests/g051-browser.ts, platform/tests/final-smoke.ts, platform/scripts/lib/]
---

## Amaç
`docs/11_TEMA_STANDARDI.md` §13.1/§13.3 her G4NN temasını `node scripts/theme-check.cjs --theme <slug>` ile denetletiyor; bugün
betik `blush-garden-rose`'a bağlı (`const THEME = 'blush-garden-rose'`, çıktı `previews/g038`, G035 karşılaştırması, temanın font listesi,
kart seçicileri, sayfa başlıkları). `tests/g051-browser.ts` ve `tests/final-smoke.ts` de 03'e bağlı. Bu görev bitmeden hiçbir G4NN
bitti tanımını karşılayamaz (G401–G420 `bagimli`'sinde G052 var).

## Girdiler
- `platform/scripts/theme-check.cjs`, `platform/tests/g051-browser.ts`, `platform/tests/final-smoke.ts` (bugünkü 03 denetimleri)
- `docs/11_TEMA_STANDARDI.md` §6 (ölçüm), §12, §13.3–§13.4 (denetlenecekler, önizleme dosyaları)
- `platform/themes/blush-garden-rose/img/manifest.json` (`free_zone`, `photo_slots`, `stage`), `theme.json`

## Yapılacaklar
1. `theme-check.cjs --theme <id>` (varsayılan `blush-garden-rose`, bugünkü davranış aynen korunur):
   - tema `theme.json` + `img/manifest.json`'dan okunur; font listesi sayfadaki Google Fonts `<link>`'inden (aile + ağırlık);
   - kart metni ↔ `free_zone` eşlemesi manifest'ten (kart seçicisi → manifest anahtarı tablosu temanın README'sinde ya da
     manifest'te tanımlanır; sabit 03 seçicisi kalmaz); sayfa başlıkları şablonun `data-text`'inden;
   - karşılaştırma görselleri W1 comp'larıyla (`collections/NN_*/assets/gpt/comps/web_<n>_*.png`, yalnız sade ad; `_vN` alınmaz):
     `compare_<sayfa>_390.jpg` = comp | tema; 03 için bugünkü G035 karşılaştırması ayrı bayrakla kalabilir;
   - çıktı `previews/<görev>/` (`--out` ya da `THEME_SHOTS_DIR`), `checks.json` aynı biçimde;
   - "first view" ölçümü iki kez: yer tutucularla **ve** tohumlanmış PAKET 2 fotoğraflarıyla (docs/11 §6), ikisi de `checks.json`'a.
2. `g051-browser.ts --theme <id>` ve `final-smoke.ts --theme <id>`: aynı genelleştirme (03'e özgü seçiciler tema README'sindeki
   ya da manifest'teki tabloya taşınır); SSS sorusunun erişilebilir adı (CDP `Accessibility.getFullAXTree`) bütün temalarda denetlenir.
3. Ortak yardımcılar (sunucu başlatma, tohumlama, taşma ölçümü) gerekiyorsa `platform/scripts/lib/` altında.
4. `blush-garden-rose` ile üçü de bugünkü sonuçları verir (69/69, 44/44, 42/42 ya da gerekçeli yeni sayı); `_sample` ile en azından
   çalışır ve anlamlı hata/uyarı verir.

## Bitti sayılması için
- [ ] Üç betik `--theme` alıyor; 03 sonuçları değişmedi; `_sample` ile koşuldu
- [ ] docs/11 §13.1'deki komut olduğu gibi çalışıyor; çıktı `previews/<görev>/`
- [ ] Sonuç dürüst: hangi denetim hâlâ temaya özgü tablo istiyor, G4NN ajanı ne yazmalı

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-13 açıldı: G046 incelemesi (docs/11 §14 #3; G4NN bitti tanımı bu araç olmadan karşılanamıyor)
