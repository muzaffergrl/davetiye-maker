---
id: G201
baslik: Rehber dalga 5 — N9 (SSS örnekleri) ve N10 (destination düğün sitesi kontrol listesi), İngilizce
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G199]
yazar: [platform/content/guides/, platform/lib/marketing/guides.ts, platform/tests/g201.test.ts, platform/previews/g201/, docs/36_ICERIK_PLANI.md, gorevler/G201-rehber-n9-n10.md]
---

## Amaç
Kullanıcı (2026-10-22): "dalga 5 ile devam et, N9 ve N10'u yaz" (docs/36).

## Sonuç (2026-10-22, bulut oturumu)
- `content/guides/wedding-website-faq-examples.md` (N9, order 15, 1.284 kelime): hangi sorular (öncelik tablosu, 12 soru),
  10 kopyalanabilir örnek yanıt, hassas soruların dili (eşlik eden, çocuk, telefonsuz tören), SSS'ye konmayacaklar, güncel
  tutma kontrol listesi.
- `content/guides/destination-wedding-website-checklist.md` (N10, order 16, 1.214 kelime): erken yayın, 6 başlıklı kontrol
  listesi (ulaşım, belgeler, konaklama, program, yerel ipuçları, pratik), pasaport/vize için resmî kaynağa link, otel tablosu,
  çok günlük program + saat dilimi satırı (Lizbon, Haziran = WEST UTC+1; günler hesapla doğrulandı), maliyet sorusu,
  gelemeyen misafirler.
- claude-seo `content_quality.py`: N9 77, N10 79 (dolgu 0, AI kalıbı 0).
- Ürün cümleleri koddan: SSS en fazla 12, eklenir/düzenlenir/sıralanır/silinir, bölüm kapatılabilir (`components/panel/sections.tsx`);
  "travel and stay" bölümü en fazla 6 otel/ev, her birinde adres, mesafe, not, rezervasyon kodu (`components/panel/ExtrasFields.tsx`,
  `lib/content/limits.ts`); harita nikâh ve düğün yemeği yerini ayrı gösterir (`lib/maps.ts`); takvime ekle düğün saat
  dilimini kullanır (`lib/calendar.ts`); 5 dilde hazır metinler (`facts.ts`).
- Kaynaklar (arama sonuçlarından doğrulandı): Emily Post `wedding-website-tips`; ABD Dışişleri Bakanlığı
  (travel.state.gov, pasaport geçerliliği).
- Test kuralı yakaladı: N9'da örnek yanıt "Your presence is the best gift" `tests/marketing-content.test.ts`'in "the best"
  yasağına takıldı; "the only gift we need" olarak değiştirildi.
- Kod: `lib/marketing/guides.ts` yeni jeton `{{travelStays}}` (CONTENT_LIMITS'ten). Test: `tests/g201.test.ts`.
- İç linkler (İngilizce): G2 ve G4 → N9; G3 ve G4 → N10; N10 → N9, N5.
- Kontrol: build temiz; N9 ve N10 200, tek H1, Article + BreadcrumbList; jetonlar sayfada gerçek değerle ("up to 12 questions",
  "up to 6 hotels"); /guides 16 rehber; 390 px'te yatay taşma yok. Görüntüler `platform/previews/g201/`.
- Testler: `npm test` 1696/1696 (0 hata, 0 atlanan; g201 testi dahil), build temiz.
- Çeviri: G202.

## Önerilen görevler (entegratöre)
- ~~N9 + N10 çevirisi~~ → G202 (yapıldı).
- Dalga 6: N11 (gizlilik ve şifre), N12 (RSVP için QR kod) ve G2 gizlilik bölümü (docs/36).

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: N9 + N10 yazıldı
