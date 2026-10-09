---
id: G028
baslik: tools/mockup_compose.py — yeşil ekran mockup + ilan görseli şablonları
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: []
yazar: [tools/mockup_compose.py, tools/listing_templates/, tools/tests/]
---

## Amaç
Tasarım export'larını GPT mockup'larının yeşil (#00FF00) alanına yerleştirmek ve ilan görsellerini (What's included, How it works) palete göre üretmek. 20 tasarım ve 100 varyantta kullanılır.

## Girdiler
- `docs/05_SET_PAKETI.md` §B
- Herhangi bir kitin `assets/gpt/mockups/*.png` (yoksa test için sahte yeşil ekranlı görsel üret)
- `<kit>/palette.json`

## Yapılacaklar
1. CLI: `python3 tools/mockup_compose.py <mockup.png> <tasarım.png|jpg> <çıktı.png>`: yeşil bölgeyi bul (±40 tolerans), 4 köşeyi çıkar, perspektif dönüşümle yerleştir, kenar yumuşatma; yeşil taşmasını temizle.
2. `tools/listing_templates/`: HTML şablonları (What's included, How it works, Edit in Canva) + `render` komutu (Playwright, palette.json ile renk). Metin İngilizce, ticari iddia yok.
3. Küçük test: sahte mockup + sahte tasarım ile çıktı.

## Bitti sayılması için
- [ ] Sahte girdilerle doğru yerleşim
- [ ] Şablonlar palete göre renkleniyor

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_
