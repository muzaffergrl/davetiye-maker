---
id: G012
baslik: V01 kit katmanlarını Canva master'a tak
rol: claude-canva
durum: blokaj
alan:
oncelik: 2
bagimli: [G001, G002, G003, G010, G011]
yazar: [collections/02_Dusty_Blue/kit_layers/, collections/02_Dusty_Blue/canva/]
---

## Amaç
HTML katmanlarını fotogerçekçi V01 kit katmanlarıyla değiştirmek (aynı yer, aynı boyut).

## Girdiler
- `tools/kit_build.py`
- `collections/02_Dusty_Blue/canva/ASSET_MAP.json`
- `canva-guvenli-duzenleme` skill

## Yapılacaklar
1. `kit_check` → `kit_build` → 17 katmanı Canva'ya yükle (create-upload-url).
2. Master'da `update_fill` ile değiştir (taslak) → önizleme → onay → commit → yeniden oku.
3. ASSET_MAP'e `media_id_kit_v01` ekle.

## Bitti sayılması için
- [ ] Kayıtlı master'da yeni katmanlar; metinler yerinde

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
