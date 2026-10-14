---
id: G081
baslik: 02, 04, 05 temalarına teşekkür hâli (docs/11 §3.6) ve düzenlenebilir metinler (§3.7 data-copy + manifest)
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G075, G068, G402, G404, G405]
yazar: [platform/themes/dusty-blue-champagne/, platform/themes/vintage-airmail-love-letter/, platform/themes/mediterranean-lemon/, platform/tests/, platform/previews/g081/]
---

## Amaç
G075 teşekkür modunu yalnız 01 ve 03'e uyguladı; 02/04/05 o sırada başka ajanlarda düzeltiliyordu. theme-check bunlara uyarı veriyor.

## Yapılacaklar
1. Her temaya docs/11 §3.6 işaretleri: zarf kartında teşekkür başlığı + tarih, kart penceresinde teşekkür fotoğrafı yoksa temanın süsü,
   home'da teşekkür kartı (geri sayım/RSVP/takvim yok), details "The Day" ya da gizli, RSVP "Replies are closed". Yeni görsel yok (K21).
1b. G068 kuralı (docs/11 §3.7): görünür her sabit metin `data-copy`; `node scripts/copy-manifest.ts --theme <id>` ile manifest; her anahtarın `max`'ı `--stress` ile ölçülür (taşmasın).
2. theme-check `--stress` her temada uyarısız (işaretsiz görünür metin 0); final-smoke, g075 testlerinin tema kısmı. Önizleme `platform/previews/g081/`.

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): G075 Sonuç önerisi; 02/04/05 onaylanınca başlar
- 2026-10-14 kapsam: G068 düzenlenebilir metinler de eklendi
