---
id: G991
baslik: Rehber N15 (davetiyeyi evde ya da matbaada basmak) ve N16 (düğün hafta sonu programı) — İngilizce + iç linkler
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G990]
yazar: [platform/content/guides/, platform/tests/g991.test.ts, platform/previews/g991/, docs/36_ICERIK_PLANI.md, gorevler/G991-rehber-n15-n16.md]
---

## Amaç
Kullanıcı (2026-10-22): "dalga 8 ile devam et, N15 ve N16'yı yaz" (`docs/36` §7).

## Sonuç (2026-10-22, bulut oturumu)
- **N15** `content/guides/print-wedding-invitations-at-home.md` (order 21): ev yazıcısı / yerel matbaa / online matbaa tablosu;
  kart ve zarf ölçü tablosu (5 × 7 in → A7, A5 → C5, bilgi kartı); ABD'de kare, sert ya da süslü zarfın ek posta ücreti (USPS
  QSG 201 mektup standartları, en-boy oranı 1,3–2,5; fiyat yazılmadı, değişiyor); kâğıt ağırlığı ve yüzeyi; bleed ve kesim
  işaretleri; evde baskı adımları (%100 ölçek, arka besleme, arka yüz hizası); matbaaya sorulacaklar ve basmadan önce kontrol
  listesi. Ürün bölümü koddan: 5 × 7 in / A5, bleed 1/8 in / 3 mm (`lib/print/invitation.ts`), kesim işaretleri, arka yüzde
  program, kıyafet kuralı, yanıt tarihi ve QR (`lib/print/labels.ts`), en son kaydedilen bilgiler, 4 × 6 in QR kartı; biz
  basmıyoruz.
- **N16** `content/guides/wedding-weekend-itinerary.md` (order 22): her etkinlik için 7 bilgi tablosu; 3 günlük örnek program
  (gün başlığı + madde, telefonda okunur); yalnız davetlilere açık etkinlikler (Emily Post: prova yemeğini herkese açık
  yayınlamak); dinlenme payı kontrol listesi; etkinlikler arası ulaşım; ne zaman neyin paylaşılacağı tablosu; her etkinlik için
  metin. N10'un çok günlü program bölümünü tekrar etmiyor, ona link veriyor. Ürün bölümü dürüst: gün akışı yalnız düğün günü
  (satırlarda tarih yok, `ScheduleItem`), en fazla {{scheduleRows}} satır, saat dilimi, takvime ekleme (tören saatinden,
  `lib/calendar.ts`); diğer günlerin etkinlikleri SSS'ye ya da kişisel mesaja.
- İç linkler (İngilizce): N4 ve N12 → N15; N10 ve G4 → N16. Çevirilerdeki karşılıkları çeviri göreviyle (betik: scratchpad
  `g210links.py`, bölüm sırası İngilizceden alınıyor).
- Ölçüler: başlık 56 / 55, açıklama ≤ 160, quick answer ≤ 60 kelime (N15 kısaltıldı), 4'er SSS; kelime 1439 / 1286;
  content_quality 84 / 83, filler 0, AI kalıbı 0.
- `tests/g991.test.ts`: baskı ölçüleri ve bleed, arka yüz, QR kartı, programın tek gün olması, takvim başlangıcı, linkler.
- Build: 4 sayfa 200, tek H1; 390 px taşma 0 (`previews/g991/`). `npm test` 1711/1711 (0 hata, 0 atlanan), typecheck temiz.
- Çeviri yapılmadı.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: N15 + N16 + 4 iç link
