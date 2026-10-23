---
id: G199
baslik: Rehber dalga 4 — N7 (ücretsiz mi ücretli mi) ve N8 (Our Story örnekleri), İngilizce
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G197]
yazar: [platform/content/guides/, platform/lib/marketing/guides.ts, platform/tests/g199.test.ts, platform/previews/g199/, docs/36_ICERIK_PLANI.md, gorevler/G199-rehber-n7-n8.md]
---

## Amaç
Kullanıcı (2026-10-22): "dalga 4 ile devam et, N7 ve N8'i yaz" (docs/36).

## Sonuç (2026-10-22, bulut oturumu)
- `content/guides/free-vs-paid-wedding-websites.md` (N7, order 13, 1.282 kelime): kısa cevap, 4 fiyatlandırma modeli
  (tablo; rakip adı yok), ücretsiz planların içerdiği, ödemenin eklediği, gözden kaçan maliyetler (alan adı yenileme: ICANN
  kaynağı), 8 maddelik seçim kontrol listesi, ücretsiz / ücretli ne zaman, kendi fiyatlandırmamız.
- `content/guides/wedding-website-our-story-examples.md` (N8, order 14, 1.226 kelime): iyi bir bölümün özellikleri, 5 yapı
  (tablo), kurgu çiftlerle 6 özgün örnek, altyazı örnekleri, fotoğraf seçimi, dışarıda bırakılacaklar, takılınca 6 adım.
- claude-seo `content_quality.py`: N7 75, N8 80 (dolgu 0, AI kalıbı 0).
- Ürün cümleleri koddan: tek seferlik Etsy ödemesi, yenileme/aylık/misafir başına ücret ve panel içi yükseltme yok, düğün
  tarihinden 12 ay sonrasına kadar açık (`{{months}}` jetonu), çevrimdışı alınabilir (`faq.ts`); özel alan adı ve renk/font değişikliği dahil
  değil (`facts.ts`); Our Story: giriş ≤ 200, 3 foto, altyazı ≤ 60 (`lib/content/schema.ts` + `facts.ts`), müzik seçimi,
  sayfa kapatılabilir. Kendi ürünümüz için "subscription" kelimesi yok (docs/14 kuralı, test).
- Kod: `lib/marketing/guides.ts` yeni jetonlar `{{storyPhotos}}`, `{{storyIntroChars}}`, `{{storyCaptionChars}}` (LIMITS'ten).
  Test: `tests/g199.test.ts`.
- İç linkler (İngilizce): G6 ve G1 → N7; G4 ve G2 → N8. N7 → G6, N3, G2; N8 → G4, G2.
- Kontrol: build temiz; N7 ve N8 200, tek H1, Article + BreadcrumbList; jetonlar sayfada gerçek değerle ("12 months",
  "200 characters"); /guides 14 rehber listeliyor; 390 px'te yatay taşma yok. Görüntüler `platform/previews/g199/`.
- Testler: `npm test` 1693/1693 (0 hata, 0 atlanan; g199 testi dahil), build temiz.
- Çeviri: G200.

## Önerilen görevler (entegratöre)
- ~~N7 + N8 çevirisi~~ → G200 (yapıldı).
- Dalga 5: N9 (SSS örnekleri), N10 (destination checklist) (docs/36).

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: N7 + N8 yazıldı
