---
id: G033
baslik: Paket 5 (website, GPT tasarlar) prompt'larını 19 tasarıma yay — katalog.py + G2NN/G4NN yeniden tanımı
rol: claude-kod
durum: alindi
alan: wf-paketw
oncelik: 2
bagimli: [G030, G035]
yazar: [tools/katalog.py, tools/kit_check.py, tools/parts_prep.py, tools/tests/, collections/01_Olive_Ivory/assets/gpt/GPT_PROMPTS.md, collections/02_Dusty_Blue/assets/gpt/GPT_PROMPTS.md, collections/04_Vintage_Airmail/assets/gpt/GPT_PROMPTS.md, collections/05_Lemon_Mediterranean/assets/gpt/GPT_PROMPTS.md, collections/06_Art_Deco_Noir/assets/gpt/GPT_PROMPTS.md, collections/07_Burgundy_Velvet/assets/gpt/GPT_PROMPTS.md, collections/08_Winter_Evergreen/assets/gpt/GPT_PROMPTS.md, collections/09_Lavender_Provence/assets/gpt/GPT_PROMPTS.md, collections/10_Tuscan_Vineyard/assets/gpt/GPT_PROMPTS.md, collections/11_Boho_Pampas/assets/gpt/GPT_PROMPTS.md, collections/12_Tropical_Destination/assets/gpt/GPT_PROMPTS.md, collections/13_Enchanted_Forest/assets/gpt/GPT_PROMPTS.md, collections/14_Ivory_Lace_Pearl/assets/gpt/GPT_PROMPTS.md, collections/15_Cherry_Blossom/assets/gpt/GPT_PROMPTS.md, collections/16_Sunflower_Rustic/assets/gpt/GPT_PROMPTS.md, collections/17_Emerald_Gold_Estate/assets/gpt/GPT_PROMPTS.md, collections/18_Wildflower_Vellum/assets/gpt/GPT_PROMPTS.md, collections/19_Midnight_Garden/assets/gpt/GPT_PROMPTS.md, collections/20_Coastal_Seaside/assets/gpt/GPT_PROMPTS.md, docs/09_TASARIM_KATALOGU.md, docs/06_FABRIKA_PLANI.md, gorevler/G2, gorevler/G4, gorevler/G033-paket4-yayilim.md, gorevler/roller/gpt-gorsel.md]
---

## Amaç
Pilot (G030/G031) kullanıcıya gösterilip yöntem onaylandıktan sonra, tasarım 03'teki elle yazılmış
PAKET 4'ü `tools/katalog.py` üretecine taşıyıp diğer 19 tasarım için üretmek; G2NN görevlerini Paket 4'e çevirmek.

## Girdiler
- `collections/03_Blush_Garden_Rose/assets/gpt/GPT_PROMPTS.md` PAKET 4 (örnek)
- Pilot dersleri: `gorevler/G030-*.md`, `gorevler/G031-*.md` Sonuç bölümleri
- `tools/katalog.py` (her tasarımın zarf/foto/dekor/teknik eksenleri)

## Yapılacaklar
1. katalog.py'ye Paket 4 üretimi (T1 comp'lar + T2 parçalar), tasarıma özgü zarf/kapanış/çerçeve/dekor ile.
2. 20 tasarımın GPT_PROMPTS.md'sinde Paket 1 → Paket 4 (03'ün elle yazılmış bölümünü bozmadan).
3. G2NN görev dosyalarını Paket 4'e göre yeniden yaz (G203 hariç: G030 onu karşıladı).

## Bitti sayılması için
- [ ] 20 GPT_PROMPTS.md'de Paket 4; kit_check her biri için 19 civarı satır görüyor
- [ ] `gorev.py kontrol` temiz

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24): video Paket 4 yerine website Paket 5; iş akışı wf-paketw ile yapılıyor (yaz → 4 bağımsız inceleme → düzeltme → son denetim)
