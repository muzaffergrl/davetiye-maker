---
id: G004
baslik: Canva UI blokajları için otomasyon yolu araştır
rol: claude-canva
durum: bitti
alan: claude-canva-1
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
- Sonuç belgesi: `docs/08_CANVA_UI_BLOKAJ.md` (9 yol denendi; kanıtlar orada).
- Bu bulut ortamından dört işin hiçbiri yapılamıyor: MCP/Connect API/Apps SDK'da uç nokta yok; üretici animasyon
  eklemiyor; hareketli medya yüklenemiyor; tarayıcı otomasyonu Canva bot engeline (403) takılıyor.
- Template link yalnız arayüzde ve ücretli planda — satışın ön şartı.
- Karar bekliyor (kullanıcı): A) kullanıcının bilgisayarında Canva oturumlu tarayıcıyı Claude'un sürmesi (önerilen),
  B) animasyon için geçici herkese açık medya adresi, C) RSVP'yi bağlantılı butonla yapmak.
- Test tasarımları: DAHXhRJIiTQ, DAHXhYgp4e0, DAHXhQPlWPg (satış dışı).
- **Karar 2026-10-09: A** (hesap Pro). Uygulama: rol `claude-tarayici`, GA02/GANN + GB02/GBNN.
- Önerilen görev (karar sonrası): A seçilirse GA02 pilotunu kullanıcının bilgisayarındaki oturumla çalıştır.

## Günlük
- 2026-10-09 alindi: claude-canva-1
- 2026-10-09 bitti, incelemeye gönderildi
- 2026-10-09 entegratör onayladı
