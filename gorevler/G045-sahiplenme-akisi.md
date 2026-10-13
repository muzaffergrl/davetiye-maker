---
id: G045
baslik: /start sahiplenme akışı — sipariş no + e-posta → taslak site + düzenleme linki
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G039]
yazar: [platform/app/start/, platform/lib/claim/]
---

## Amaç
Etsy alıcısı satın aldıktan sonra kendi sitesini başlatır.

## Yapılacaklar
1. `/start?theme=<tema>`: tema önizlemesi, Etsy sipariş no (biçim kontrolü) + e-posta → slug önerisi → taslak site.
2. Düzenleme linkini göster + "bu linki kaydet" uyarısı; aynı sipariş no ile ikinci site sınırı.
3. Etsy API doğrulaması ve e-posta gönderimi için arayüz noktası (şimdilik kapalı; `docs/10` §3).

## Sonuç
_(görevi yapan ajan doldurur)_
