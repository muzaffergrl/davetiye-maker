---
id: G050
baslik: Etkinlik türü metin setleri (Save the Date, Engagement, Bridal Shower)
rol: claude-metin
durum: blokaj
alan:
oncelik: 7
bagimli: []
yazar: [collections/02_Dusty_Blue/event_types/]
---

## Amaç
> Kullanıcının Aşama 1–2 planında yok; en düşük öncelik. Diğer claude-metin görevleri bitince alınır.

Aynı kalıbın (T1) farklı etkinlikler için metin setlerini hazırlamak.

## Girdiler
- `collections/02_Dusty_Blue/canva/TEXT_SLOTS.json`
- `collections/02_Dusty_Blue/content.demo.json`

## Yapılacaklar
1. Her tür için `event_types/<tur>.json`: TEXT_SLOTS'taki her sahne/metin için İngilizce karşılık; gereksiz sahne varsa `"skip": true` ve neden.
2. Uzunluklar orijinale yakın (taşma riski); tarih biçimi `September 18, 2027`.
3. Her tür için ayrı `content.<tur>.json` demo kaydı (kurgu isimler, URL'ler null).

## Bitti sayılması için
- [ ] 3 tür × metin seti + demo kayıt; `python3 tools/validate_content.py` geçiyor (uygulanabiliyorsa)

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
