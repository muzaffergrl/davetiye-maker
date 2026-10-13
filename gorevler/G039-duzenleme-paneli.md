---
id: G039
baslik: Düzenleme paneli — telefonda alan düzenleme, foto yükleme, canlı önizleme, yayınla
rol: claude-kod
durum: hazir
alan:
oncelik: 1
bagimli: [G037]
yazar: [platform/app/edit/, platform/components/panel/, platform/lib/panel/]
---

## Amaç
Alıcı (çift) sitesini Canva bilmeden telefonundan düzenler. Panel İngilizce, sade, büyük dokunma alanları.

## Yapılacaklar
1. `/edit/[slug]?k=<anahtar>`: anahtar doğrulama (hash), yanlışsa genel hata.
2. Bölümler: Couple, Date & time, Venue, Schedule (satır ekle/sil/sırala), Story (3 foto + başlık), Details
   (dress code, travel, registry linkleri), RSVP (son tarih), Optional sections (aç/kapa), Photos (yükle, kırp, değiştir).
3. Otomatik taslak kayıt, doğrulama mesajları (tarih biçimi `June 12, 2027` gibi gösterim), canlı önizleme (iframe, 390 px).
4. Yayınla / yayından kaldır; yayın linki ve QR (tools/make_qr.py mantığıyla, gerçek URL'den).
5. Test: anahtar kontrolü, kayıt, foto yükleme sınırları, yayınla akışı (Playwright 390 px).

## Bitti sayılması için
- [ ] Telefonda (390 px) baştan sona düzenleme → yayınla akışı testle geçiyor; ekran kaydı `platform/previews/`

## Sonuç
_(görevi yapan ajan doldurur)_
