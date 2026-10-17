---
id: GP107
baslik: Aşama 2 · Tasarım 07 — 5 ek palet + prompt dosyaları
rol: claude-canva
durum: inceleme
alan:
oncelik: 6
bagimli: [G090]
yazar: [collections/07_Burgundy_Velvet/variants/]
---

## Amaç
Tasarım 07 için orijinale ek 5 renk paleti seçmek ve her biri için prompt dosyası yazmak.

## Girdiler
- `collections/07_Burgundy_Velvet/DESIGN_BRIEF.md`, `collections/07_Burgundy_Velvet/palette.json`, `collections/07_Burgundy_Velvet/assets/gpt/GPT_PROMPTS.md`
- Örnek: `collections/02_Dusty_Blue/variants/`, `tools/variant_prompts.py`

## Yapılacaklar
1. 5 palet: tasarımın ruhuna uygun, birbirinden ve orijinalden belirgin farklı; isim + hex token'lar.
2. `collections/07_Burgundy_Velvet/variants/Vxx_<ad>/palette.json` + `assets/gpt/GPT_PROMPTS.md` (Paket 1 + Paket 3, renk sözcükleri değişmiş).

## Bitti sayılması için
- [ ] 5 varyant klasörü hazır

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

2026-10-17 · claude-G156: platform paletleri olarak yapıldı (K24/docs/25 akışı; Canva dönemi prompt dosyaları gereksiz). 5 palet `coming`, GPT parçası gerekmedi. Ayrıntı ve testler: `gorevler/G156-palet-a.md`.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-17 bitti, incelemeye gönderildi (claude-G156; tools/gorev.py G090-qa-raporu.md'nin başlıksızlığı yüzünden çalışmadı, elle)
