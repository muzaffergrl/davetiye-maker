---
id: G065
baslik: İlan kiti yenileme (01, 03) — panel v2 ekranları, BKE Studio markası, 8. görselde demo QR yerine QR'sız demo görseli
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G060, GM02]
yazar: [tools/listing_kit.py, tools/listing_templates/, collections/01_Olive_Ivory/package/, collections/03_Blush_Garden_Rose/package/, docs/05_SET_PAKETI.md]
---

## Amaç
G059 kiti onaylandı; üç değişiklik birikti, bir kerede yeniden üretilir:
1. **Panel v2 (G060)** yayına girince START HERE adımları ve ilan görsellerindeki panel ekranları eskidi → `listing_kit.py capture` + `all`.
2. **Marka (K26, GM02):** `[SHOP NAME]` → "BKE Studio" (kullanıcı adı kesin onaylayınca), logo/renk kitin kapak ve PDF'lerine.
3. **Etsy dışına QR yok (docs/15 §1, Off-Platform):** 8. görseldeki canlı demo QR'ı kaldırılır; yerine QR'sız, URL'siz "canlı
   demo açıklamada" görseli. START HERE'deki **teslim** QR'ı (/start) kalır.
4. Canva dönemi şablonları (`tools/listing_templates/{whats_included,how_it_works,edit_in_canva}.html`) kaldırılır ya da
   platform metnine çevrilir (`mockup_compose.py render` kullanıyorsa birlikte).

## Bitti sayılması için
- [ ] `listing_kit.py check` 0 sorun; görseller, PDF'ler ve video yeniden üretildi ve gözle bakıldı
- [ ] İlan görsellerinde QR yok; START HERE teslim QR'ı çözülüyor
- [ ] Ticari alanlar yalnız kullanıcının verdiği değerlerle; kalanlar yer tutucu

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): G059 onayı sonrası birikenler
