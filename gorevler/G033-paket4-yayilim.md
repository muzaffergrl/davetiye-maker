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
Yazım adımı (wf-paketw, 2026-10-13). Görsel üretilmedi; `platform/` ve `collections/03_Blush_Garden_Rose/` değişmedi.
- `tools/katalog.py`: `WEB` sözlüğü — 03 dışındaki 19 tasarımın İngilizce website sanat yönetimi (zarf tipi: kapaklı
  zarf / gatefold / kitap / kese / vellum kılıf; kapalı ve açık zarf, kapanış elemanı, website açılış hikâyesi, küçük kart,
  davet ve bilgi kartı, dikey/yatay foto çerçevesi ve story dizilişi (foto eksenine göre), 3 accent, köşe kümesi,
  zemin dokusu, buton, tipografi, Paket 2 fotoğraf dünyası). 02'nin alanları `collections/02_Dusty_Blue`'dan
  (palette.json, eski GPT_PROMPTS) türetildi. Yeni komutlar: `paket5` (GPT_PROMPTS.md: başlık + PAKET 5 + PAKET 2,
  PAKET 3 aynen korunur; 03'ü reddeder; `--dene`), `gorev5` (G2NN/G4NN; Günlük korunur), `belge` (docs/09);
  `kontrol` artık WEB kayıtlarını da denetler. `yaz` 03'ün dosyasına `--zorla` ile bile dokunmaz.
- 19 `GPT_PROMPTS.md` üretildi: PAKET 5 = 5 W1 comp + 17 W2 parça (16 ve 18'de +1: `twine_line`, `vellum_overlay`),
  PAKET 2 = 5 fotoğraf, PAKET 3 = 3 mockup (19/19 bayt bayt korundu). İkinci çalıştırma: 0 değişiklik.
- `tools/kit_check.py`: `--paket 5`; prompt bloğunda `#00FF00` geçen parça/comp'ta yeşil pencere denetimi
  (mockup_compose yeşil testi + en büyük bölge ≥%0,3). 03'ün gerçek parçalarında doğrulandı (card_small %18,9,
  arch_frame %11,1). `tools/parts_prep.py`: parça listesi PAKET 4 ya da 5 `/parts/` satırları (aynı yolda sonraki
  geçerli); PAKET 5 opak dikey görsel 9:16'ya kırpılmaz, comp pencereleri kaynak koordinatında.
- Görevler: G201, G202 (yeni), G204–G220 → website tasarım paketi (gpt-gorsel, hazir); G401, G402 (yeni), G404–G420 →
  platform teması (claude-kod, hazir, bağımlı G2NN + G038 + G046). G203/G403 olduğu gibi blokajda.
- Belgeler: `gorevler/roller/gpt-gorsel.md` "Website paketi (Paket 5)", `docs/06_FABRIKA_PLANI.md` §0 paragrafı,
  `docs/09_TASARIM_KATALOGU.md` "Website (K22–K24)" tablosu (`katalog.py belge`).
- Testler: tools/tests/test_*.py hepsi geçti (yeni `test_parts_prep_paket5.py`, kit_check'e PAKET 5 testi);
  `gorev.py kontrol` temiz; `katalog.py kontrol` geçti; kit_check `--paket 5`: 04 → 0/22, 16 → 0/23 (dosyalar yok, beklenen).
- Test edilmedi: prompt'ların GPT'de gerçek çıktısı; gatefold/kitap/kese/kılıf tiplerinde parts_prep cep kesimi
  (kare V zarf varsayar — G4NN'de tema build adımına not edildi).
- Entegratöre: `G011` (02 Paket 2, p1) artık G202'nin Paket 2'siyle aynı dosyaları üretir — kapatılması ya da G202'ye
  katılması önerilir. `gorevler/README.md` §1b'de G2NN/G4NN tanımları (Paket 1 / website HTML) ve `docs/06` §3 tablosu
  eski; güncellenmesi önerilir (bu görevin yazma alanı dışında).

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24): video Paket 4 yerine website Paket 5; iş akışı wf-paketw ile yapılıyor (yaz → 4 bağımsız inceleme → düzeltme → son denetim)
