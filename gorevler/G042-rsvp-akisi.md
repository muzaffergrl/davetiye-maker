---
id: G042
baslik: RSVP — misafir formu, kayıt, panelde liste + CSV
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G037]
yazar: [platform/app/api/rsvp/, platform/lib/rsvp/, platform/components/rsvp/]
---

## Amaç
Misafir yanıtı çifte ulaşsın; başkası görmesin.

## Yapılacaklar
1. Tema RSVP sayfası için form bileşeni/uç noktası: Name (zorunlu), Email, Attending (Yes/No), Number of guests, Message.
2. Honeypot + IP başına hız sınırı; son tarih geçince form kapanır (mesajla).
3. Panelde yanıt listesi, sayılar (katılan/katılmayan/toplam kişi), CSV indirme.
4. Test: geçerli/eksik/spam gönderim, son tarih, CSV.

## Bitti sayılması için
- [ ] Testler geçiyor; demo yanıt yalnız kurgu veriyle

## Sonuç
_(görevi yapan ajan doldurur)_
