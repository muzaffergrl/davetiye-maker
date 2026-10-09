---
id: G004
baslik: Canva UI blokajları için otomasyon yolu araştır
rol: claude-canva
durum: hazir
alan:
oncelik: 1
bagimli: []
yazar: [docs/08_CANVA_UI_BLOKAJ.md]
---

## Amaç
API'si olmayan dört işi (element animasyonu/timeline, website Form/RSVP, website yayını, template link) kullanıcıya iş vermeden yapmanın yolunu bulmak.

## Girdiler
- `docs/05_SET_PAKETI.md` §C
- Canva MCP araçları, Canva Help (`help` aracı), Canva Connect API ve Apps SDK belgeleri

## Yapılacaklar
1. Her iş için seçenekleri listele: Canva Connect REST API, Canva Apps SDK (editör içi uygulama), tarayıcı otomasyonu (Playwright + kayıtlı oturum), hazır animasyonlu Canva şablonundan başlamak (animasyonu şablondan devralmak), animasyonu video katmanı olarak taşımak.
2. Her seçenek için: çalışır mı (kanıt/kaynak), ne gerekir (hesap, gizli anahtar, ortam ayarı), risk, kullanıcıdan bir defalık bir şey gerekiyor mu.
3. Denenebilir olanı küçük ölçekte dene; denenmeyeni 'denenmedi' diye yaz.

## Bitti sayılması için
- [ ] `docs/08_CANVA_UI_BLOKAJ.md`: iş başına önerilen yol + kanıt
- [ ] Önerilen yollar için yeni görev önerileri Sonuç'ta

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_
