---
id: G195
baslik: Rehber dalga 2 — N3 (davetiye mi website mi) ve N4 (websiteyi davetiyeye koymak), İngilizce
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G193]
yazar: [platform/content/guides/, platform/lib/marketing/guides.ts, platform/tests/g195.test.ts, platform/previews/g195/, docs/36_ICERIK_PLANI.md, gorevler/G195-rehber-n3-n4.md]
---

## Amaç
Kullanıcı (2026-10-22): "dalga 2 ile devam et, N3 ve N4'ü yaz" (docs/36).

## Sonuç (2026-10-22, bulut oturumu)
- `content/guides/wedding-website-vs-invitation.md` (N3, order 10, 1.283 kelime): davetiye ile websitenin işi (tablo),
  "website gerekli mi" kontrol listesi, davetiye yine gerekli mi, üç birleşim yolu, ne nereye, karar soruları.
  Hedef: wedding website vs invitation + do you need a wedding website.
- `content/guides/wedding-website-on-invitation.md` (N4, order 9, 1.374 kelime): adres hangi karta (tablo), kopyalanabilir
  metinler (detay kartı, yanıt kartı, save the date, davetiye altı, şifre), link mi QR mı, QR baskı kontrol listesi,
  dijital davetiye, sık hatalar. Hedef: how to put wedding website on invitation.
- claude-seo `content_quality.py`: 76 / 77 (dolgu 0, AI kalıbı 0; "low-density" önceki rehberlerle aynı).
- Ürün cümleleri `facts.ts` / `faq.ts`'ten: QR PNG/SVG indirme, 5 × 7 in ya da A5 basılabilir davetiye (isteğe bağlı arka
  yüz: ayrıntılar + QR, taşma payı ve kesim işaretleri), baskı ve kargo yok, adres = isimler + alan adı.
- Kaynaklar (arama sonuçlarından doğrulandı): Emily Post `wedding-website-tips`, DENSO WAVE `qrcode.com/en/howto/code.html`
  (dört modüllük boş kenar).
- Kod: `lib/marketing/guides.ts` yeni jeton `{{domain}}` (= `siteHost()`, çift adreslerindeki alan adı), N4 örneği
  "bkestudio.com/clara-and-julian" olarak görünüyor. Test: `tests/g195.test.ts`.
- İç linkler (İngilizce): G3 ve G4 → N4; G2 ve N1 → N3; N2 → N4; N3 ↔ N4, N3 → N1.
- Kontrol (G196 build'i ile): iki sayfa 200, tek H1, Article + BreadcrumbList, hreflang; 390 px'te yatay taşma yok (tablolar
  kendi kutusunda kayıyor). Görüntüler `platform/previews/g195/`.
- Testler: `npm test` 1691/1691 (0 hata, 0 atlanan; g195 testi dahil), build temiz.
- Çeviri: G196.

## Önerilen görevler (entegratöre)
- ~~N3 + N4 çevirisi~~ → G196 (yapıldı).
- Dalga 3: N5 (RSVP son tarihi), N6 (cevap vermeyen misafir), G3 başlık güncellemesi (docs/36).

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: N3 + N4 yazıldı
