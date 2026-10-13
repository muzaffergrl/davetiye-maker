---
id: G006
baslik: Tasarım 02 — polaroid_frame katmanını geniş kenarla yeniden çıkar (gölge kesik)
rol: claude-kod
durum: blokaj
alan:
oncelik: 3
bagimli: []
yazar: [collections/02_Dusty_Blue/assets/layers/polaroid_frame.png, collections/02_Dusty_Blue/assets/layers/layers.json, collections/02_Dusty_Blue/canva/ASSET_MAP.json]
---

## Amaç
G022'de görüldü: `polaroid_frame.png` gölgesi sağ ve alt kenarda sert dikdörtgenle kesiliyor. Katmanı daha geniş pay ile yeniden çıkarmak. (Dondurulmuş maskeye bilinçli istisna — entegratör onaylı.)

## Girdiler
- `collections/02_Dusty_Blue/video/invitation_motion.html`, `assets/layers/layers.json`, `tools/export_layers.mjs`
- `canva/ASSET_MAP.json` (Canva yerleşimi 540×630, sol/üst ofset)

## Yapılacaklar
1. layers.json'da polaroid pad 50 → 80; yalnız bu katmanı yeniden çıkar (diğer dosyalar değişmesin).
2. Yeni ölçüye göre ASSET_MAP'teki polaroid yerleşim boyutu/ofsetini hesapla ve not et (Canva'daki güncelleme G012'de yapılır).
3. Önce/sonra karşılaştırma görüntüsü Sonuç'a (scratch).

## Bitti sayılması için
- [ ] Gölge kesilmiyor
- [ ] Yalnız polaroid dosyası değişti (git diff)

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
