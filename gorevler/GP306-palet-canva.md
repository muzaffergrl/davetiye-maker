---
id: GP306
baslik: Aşama 2 · Tasarım 06 — 5 palet Canva varyantları
rol: claude-canva
durum: blokaj
alan:
oncelik: 6
bagimli: [GP206, G040]
yazar: [collections/06_Art_Deco_Noir/variants/]
---

## Amaç
Tasarım 06'in bütün Canva tasarımlarını (video, website, PDF, story/kare) 5 palete çoğaltmak.

## Girdiler
- `tools/make_variant.py` (G040) → `canva_plan.json`
- `collections/06_Art_Deco_Noir/canva/DESIGNS.json`

## Yapılacaklar
1. Her palet: copy-design → kit katmanları update_fill → metin renkleri → önizleme → commit → yeniden oku.
2. Animasyon/template link G004 yoluyla; kopyada korunup korunmadığını kaydet.

## Bitti sayılması için
- [ ] 5 × 4 Canva tasarımı kayıtlı; ID'ler `variants/*/canva/DESIGNS.json`

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
